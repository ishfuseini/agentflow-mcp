# brand-search Specification

## Purpose
Resolve a company name to a canonical domain and a ready-to-embed logo URL via the logo.dev Brand Search API. This is an independent tool callable at any time; it has no required ordering relative to other tools.

## Requirements

### Requirement: Company name to domain resolution

The system SHALL accept a company name query and return candidate brand matches from the logo.dev Brand Search API (`GET https://api.logo.dev/search?q={name}`), each including the brand name, canonical domain, and a ready-to-embed logo URL.

#### Scenario: Exact name match

- **WHEN** the tool receives query "Sweetgreen" with strategy "match"
- **THEN** the system returns a ranked list of candidates whose first entry has name "Sweetgreen", domain "sweetgreen.com", and a logo_url beginning with "https://img.logo.dev/"

#### Scenario: Typeahead suggestion match

- **WHEN** the tool receives query "swee" with strategy "suggest" (the default)
- **THEN** the system returns up to 10 candidates sorted by popularity, each with name, domain, and logo_url

#### Scenario: No matches

- **WHEN** the tool receives a query that matches no brands in the logo.dev index
- **THEN** the system returns an empty candidate list without causing a tool error

### Requirement: Matching strategy parameter

The system SHALL accept an optional `strategy` parameter that selects between "suggest" (default, popular prefix matches for typeahead) and "match" (exact/near-exact name matches first).

#### Scenario: Default strategy

- **WHEN** the tool receives a query without specifying strategy
- **THEN** the system uses the "suggest" strategy

#### Scenario: Match strategy for exact lookups

- **WHEN** the tool receives query "Havas" with strategy "match"
- **THEN** the system favors exact name matches, ranking "Havas" ahead of prefix-only autocomplete suggestions

### Requirement: Profanity filter parameter

The system SHALL accept an optional `is_profane` boolean parameter that, when set to false, excludes brands flagged as potentially inappropriate from the results.

#### Scenario: Profanity filter enabled

- **WHEN** the tool receives a query with is_profane set to false
- **THEN** the system excludes any brand flagged as potentially inappropriate from the returned candidates

### Requirement: Structured JSON output

The system SHALL return a JSON object containing the query, the strategy used, and an array of candidate matches, each with name (string), domain (string), and logo_url (string).

#### Scenario: Response schema compliance

- **WHEN** the tool returns a successful brand search
- **THEN** the response includes query (string), strategy (string), and candidates (array of objects each with name, domain, and logo_url)

#### Scenario: API error handling

- **WHEN** the logo.dev Brand Search API is unreachable, returns HTTP 401 (invalid token), or returns HTTP 400 (invalid request)
- **THEN** the system returns a graceful unavailable response indicating the search could not be completed, without causing a tool error

### Requirement: API key via environment variable

The system SHALL read the logo.dev secret key from the `LOGO_DEV_SECRET_KEY` environment variable for Brand Search API calls.

#### Scenario: API key present

- **WHEN** the `LOGO_DEV_SECRET_KEY` environment variable is set
- **THEN** the system uses the key as a Bearer token for the logo.dev Brand Search API call

#### Scenario: API key missing

- **WHEN** the `LOGO_DEV_SECRET_KEY` environment variable is not set
- **THEN** the system returns a graceful unavailable response without making an API call
