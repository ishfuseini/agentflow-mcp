## MODIFIED Requirements

### Requirement: Company context retrieval

The system SHALL accept a domain name and return a structured company context sourced from the `identity` section of the Brandfetch Brand Context API (`GET https://api.brandfetch.io/v2/context/{domain}`, Bearer auth): company name, tagline, mission, description, and tags. The system SHALL NOT include positioning data, brand voice/style, or logo retrieval in this tool. The tool accepts a domain directly; it does not require a domain resolved by another tool.

#### Scenario: Known domain lookup

- **WHEN** the tool receives domain "havas.com"
- **THEN** the system returns company_name "Havas", domain "havas.com", tagline, mission, description of the company, tags characterizing the brand, and confidence >= 0.80

#### Scenario: Industry hint derived from tags

- **WHEN** the tool receives a domain and the Brandfetch response includes tags
- **THEN** the system maps the tags to an industry_hint aligned with the source pack's industry codes (e.g., "media_agency", "healthcare", "retail", "financial_services")

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

The system SHALL return cached context or a graceful unavailable response when the Brandfetch API is unreachable, returns an error, or returns HTTP 429 (quota exceeded).

#### Scenario: Brandfetch unavailable with cached response

- **WHEN** Brandfetch is unreachable and a local cached response exists for the requested domain
- **THEN** the system returns the cached response

#### Scenario: Brandfetch unavailable with no cache

- **WHEN** Brandfetch is unreachable and no local cached response exists for the requested domain
- **THEN** the system returns a graceful unavailable response indicating that brand context could not be retrieved, without causing a tool error

### Requirement: Structured JSON output

The system SHALL return a JSON object containing company_name, domain, industry_hint, tagline, mission, description, tags, and confidence for successful lookups. The system SHALL NOT include `positioning`, `brand` (voice/style), or `logo_url` fields in the response.

#### Scenario: Response schema compliance

- **WHEN** the tool returns a successful brand context lookup
- **THEN** the response includes all required fields: company_name (string), domain (string), industry_hint (string), tagline (string), mission (string), description (string), tags (array of strings), and confidence (number between 0 and 1), and does NOT include positioning, brand, or logo_url fields

#### Scenario: Unavailable response schema

- **WHEN** the tool returns a graceful unavailable response
- **THEN** the response indicates the brand context is unavailable without causing a tool error

### Requirement: API key via environment variable

The system SHALL read the Brandfetch API key from the `BRANDFETCH_API_KEY` environment variable for Brand Context API calls.

#### Scenario: API key present

- **WHEN** the `BRANDFETCH_API_KEY` environment variable is set
- **THEN** the system uses the key as a Bearer token for Brandfetch API calls

#### Scenario: API key missing with local cache

- **WHEN** the `BRANDFETCH_API_KEY` environment variable is not set but local cached responses exist
- **THEN** the system returns cached responses for cached domains and a graceful unavailable response for uncached domains

## REMOVED Requirements

### Requirement: Logo retrieval via logo.dev

**Reason**: Logo retrieval has moved to the dedicated `brand_search` tool, which resolves a company name to a domain and returns a logo URL via the logo.dev Brand Search API. The brand_context_lookup tool no longer calls logo.dev.
**Migration**: Call `brand_search` with the company name to obtain the domain and logo_url before calling `brand_context_lookup` with the resolved domain.

### Requirement: Structured JSON output (positioning)

**Reason**: The `positioning` field (value_proposition, target_audience, products_and_services) is removed from the brand_context_lookup response to keep the tool focused on identity. Positioning data was not used downstream and bloated the payload.
**Migration**: Positioning is no longer returned. If positioning data is needed in the future, a separate dedicated tool should be introduced.

### Requirement: Structured JSON output (brand voice/style)

**Reason**: The `brand` field (voice and style summaries) is removed from the brand_context_lookup response to keep the tool focused on the Brandfetch `identity` section only. Brand voice/style was not used downstream and bloated the payload.
**Migration**: Brand voice/style is no longer returned. If it is needed in the future, a separate dedicated tool should be introduced.