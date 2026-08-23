## Purpose

Retrieve rich company context — identity, positioning, brand voice/style from the Brandfetch Brand Context API, and company logo from logo.dev — so the Architecture Agent can ground its pattern matching in company-specific data and the architecture-diagram skill can render branded diagrams. Uses layered caching (Brandfetch `cachedOnly` mode + local file cache + logo.dev cache) to stay within free-tier limits and ensure demo stability.

## ADDED Requirements

### Requirement: Company context retrieval

The system SHALL accept a domain name and return a structured company context including company name, description, tags, positioning, and brand voice/style, sourced from the Brandfetch Brand Context API (`GET https://api.brandfetch.io/v2/context/{domain}`, Bearer auth).

#### Scenario: Known domain lookup

- **WHEN** the tool receives domain "havas.com"
- **THEN** the system returns company_name "Havas", domain "havas.com", description of the company, tags characterizing the brand, positioning including value_proposition and target_audience, brand voice and style summaries, logo_url from logo.dev, and confidence >= 0.80

#### Scenario: Industry hint derived from tags

- **WHEN** the tool receives a domain and the Brandfetch response includes tags
- **THEN** the system maps the tags to an industry_hint aligned with the source pack's industry codes (e.g., "media_agency", "healthcare", "retail", "financial_services")

### Requirement: Logo retrieval via logo.dev

The system SHALL retrieve the company logo URL from logo.dev (`GET https://api.logo.dev/brand/{domain}`) and include it in the response as `logo_url`. The logo URL is cached locally alongside the Brandfetch context.

#### Scenario: Logo retrieved successfully

- **WHEN** the tool receives a domain and logo.dev is available
- **THEN** the system returns a logo_url pointing to the company logo image

#### Scenario: logo.dev unavailable

- **WHEN** logo.dev is unreachable or returns an error
- **THEN** the system returns logo_url as null or omits the field, without causing a tool error; the remaining brand context from Brandfetch is still returned if available

### Requirement: Layered caching with cachedOnly mode

The system SHALL cache Brandfetch responses using two layers: (1) the Brandfetch API's `cachedOnly=true` parameter for instant cache-only lookups, and (2) a local file cache with TTL so repeated lookups return cached data without calling the Brandfetch API.

#### Scenario: Local cache hit

- **WHEN** the tool receives a domain that has been previously fetched and the local cache entry is not expired
- **THEN** the system returns the cached response without making any Brandfetch API call

#### Scenario: Cache miss populates cache

- **WHEN** the tool receives a domain not present in the local cache and Brandfetch is available
- **THEN** the system calls Brandfetch, stores the response in the local file cache, and returns the fresh response

#### Scenario: cachedOnly mode for pre-populated domains

- **WHEN** the tool receives a domain that has been pre-populated in the Brandfetch cache
- **THEN** the system uses `cachedOnly=true` for an instant response without triggering a live resolution

### Requirement: Graceful fallback when Brandfetch unavailable

The system SHALL return cached context or a graceful unavailable response when the Brandfetch API or logo.dev is unreachable, returns an error, or returns HTTP 429 (quota exceeded).

#### Scenario: Brandfetch unavailable with cached response

- **WHEN** Brandfetch is unreachable and a local cached response exists for the requested domain
- **THEN** the system returns the cached response

#### Scenario: Brandfetch unavailable with no cache

- **WHEN** Brandfetch is unreachable and no local cached response exists for the requested domain
- **THEN** the system returns a graceful unavailable response indicating that brand context could not be retrieved, without causing a tool error

### Requirement: Structured JSON output

The system SHALL return a JSON object containing company_name, domain, industry_hint, description, tags, positioning, brand, logo_url, and confidence for successful lookups.

#### Scenario: Response schema compliance

- **WHEN** the tool returns a successful brand context lookup
- **THEN** the response includes all required fields: company_name (string), domain (string), industry_hint (string), description (string), tags (array of strings), positioning (object with value_proposition, target_audience, products_and_services), brand (object with voice and style), logo_url (string or null, from logo.dev), and confidence (number between 0 and 1)

#### Scenario: Unavailable response schema

- **WHEN** the tool returns a graceful unavailable response
- **THEN** the response indicates the brand context is unavailable without causing a tool error

### Requirement: API key via environment variable

The system SHALL read the Brandfetch API key from the `BRANDFETCH_API_KEY` environment variable for Brand Context API calls. The logo.dev client does not require an API key for basic logo retrieval.

#### Scenario: API key present

- **WHEN** the `BRANDFETCH_API_KEY` environment variable is set
- **THEN** the system uses the key as a Bearer token for Brandfetch API calls

#### Scenario: API key missing with local cache

- **WHEN** the `BRANDFETCH_API_KEY` environment variable is not set but local cached responses exist
- **THEN** the system returns cached responses for cached domains and a graceful unavailable response for uncached domains
