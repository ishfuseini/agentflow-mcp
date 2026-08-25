## ADDED Requirements

### Requirement: Source references as a separate tool

The system SHALL provide a dedicated `arch_pattern_references` tool that accepts a `pattern_id` (and the original enterprise-ask inputs used to find the match) and returns the source pack references that informed the match. Source references SHALL NOT be part of the default `arch_pattern_lookup` response. This tool is independent and can be called at any time; it does not require `arch_pattern_lookup` to be called first.

#### Scenario: References for a curated pattern

- **WHEN** the tool receives pattern_id "media_agency_audience_measurement" with the industry, data stack, and constraints that produced the match
- **THEN** the system returns a source_references array citing the source pack files that informed the match, each with path, title, and source_url

#### Scenario: References for the fallback pattern

- **WHEN** the tool receives a pattern_id corresponding to the generic enterprise AI POC fallback pattern with the original inputs
- **THEN** the system returns the best-available source_references for the inputs even though no curated pattern matched

#### Scenario: Unknown pattern id

- **WHEN** the tool receives a pattern_id not present in the source pack
- **THEN** the system returns an empty source_references list or a graceful unavailable response, without causing a tool error

### Requirement: Structured JSON output

The system SHALL return a JSON object containing pattern_id and source_references for successful reference lookups.

#### Scenario: Response schema compliance

- **WHEN** the tool returns a successful references lookup
- **THEN** the response includes pattern_id (string) and source_references (array of objects each with path, title, and source_url)

#### Scenario: Empty references

- **WHEN** no source pack entries informed the match
- **THEN** the response includes an empty source_references array without causing a tool error