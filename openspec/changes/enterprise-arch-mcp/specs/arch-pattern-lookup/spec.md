## Purpose

Match an enterprise ask to a curated reference architecture pattern, returning components, data zones, integration notes, confidence, and optional diagram_data (structured for the architecture-diagram skill) so the Architecture Agent can ground its recommendations in reusable enterprise patterns rather than generic LLM reasoning.

## ADDED Requirements

### Requirement: Pattern matching by enterprise ask

The system SHALL accept an enterprise ask consisting of industry, data stack, cloud preference, and constraints, and return the best-matching reference architecture pattern from the curated source pack.

#### Scenario: Media agency audience measurement

- **WHEN** the tool receives industry "media_agency", data stack ["BigQuery", "Snowflake"], cloud preference "GCP", and constraints ["SAML SSO", "EU data residency", "cross-client governance"]
- **THEN** the system returns pattern_id "media_agency_audience_measurement" with recommended_components including BigQuery, Snowflake, SAML SSO, and GCP EU region, data_zones of bronze/silver/gold, tenant-aware integration notes, and confidence >= 0.85

#### Scenario: Healthcare patient insights

- **WHEN** the tool receives industry "healthcare", data stack ["Databricks"], and constraints ["HIPAA", "PHI", "US data residency"]
- **THEN** the system returns pattern_id "healthcare_patient_insights" with Databricks as a recommended component and HIPAA-appropriate integration notes

#### Scenario: Retail lakehouse personalization

- **WHEN** the tool receives industry "retail", data stack ["Databricks", "Snowflake"], and constraints ["real-time personalization"]
- **THEN** the system returns pattern_id "retail_lakehouse_personalization" with lakehouse components and personalization integration notes

#### Scenario: FSI governance copilot

- **WHEN** the tool receives industry "financial_services", data stack ["Snowflake"], and constraints ["PII", "regulated financial data", "audit logs"]
- **THEN** the system returns pattern_id "fsi_governance_copilot" with governance controls and audit integration notes

### Requirement: Fallback for weak matches

The system SHALL return a generic enterprise AI POC pattern with low confidence when no strong pattern match is found for the given industry or constraints.

#### Scenario: Unknown industry

- **WHEN** the tool receives an industry not present in the source pack (e.g., "aerospace")
- **THEN** the system returns a fallback generic enterprise AI POC pattern with confidence < 0.5

#### Scenario: Conflicting or unmatched constraints

- **WHEN** the tool receives constraints that do not align with any curated pattern
- **THEN** the system returns the fallback generic pattern with low confidence rather than no response

### Requirement: Structured JSON output

The system SHALL return a JSON object containing pattern_id, architecture_summary, recommended_components, data_zones, integration_notes, confidence, and an optional diagram_data field for every response.

#### Scenario: Response schema compliance

- **WHEN** the tool returns any pattern match, whether curated or fallback
- **THEN** the response includes all required fields: pattern_id (string), architecture_summary (string), recommended_components (array of strings), data_zones (array of strings), integration_notes (array of strings), confidence (number between 0 and 1), and optionally diagram_data (object with components, connections, and boundaries arrays)

### Requirement: Confidence scoring

The system SHALL include a confidence score between 0 and 1 in every response, reflecting how well the input industry, data stack, cloud, and constraints match the returned pattern.

#### Scenario: High confidence match

- **WHEN** the tool receives an industry, data stack, cloud, and constraints that closely match a curated pattern
- **THEN** the confidence score is >= 0.85

#### Scenario: Low confidence fallback

- **WHEN** the tool falls back to the generic pattern
- **THEN** the confidence score is < 0.5

### Requirement: Support all four demo scenarios

The system SHALL produce a valid architecture pattern for all four demo scenarios: Agency, Healthcare, Retail Lakehouse, and FSI Governance.

#### Scenario: Every scenario returns a valid pattern

- **WHEN** each of the four demo scenarios is run through the tool with its canonical inputs
- **THEN** each returns a valid architecture pattern (either a curated match with high confidence or the fallback with low confidence)

### Requirement: Diagram data for architecture-diagram skill

The system SHALL include an optional `diagram_data` field in the response for curated pattern matches, containing structured components, connections, and boundaries that the agent's architecture-diagram skill can render as an HTML/SVG diagram.

#### Scenario: Curated match includes diagram data

- **WHEN** the tool returns a curated pattern match with confidence >= 0.85
- **THEN** the response includes a diagram_data object with a components array (each with name, type, sublabel, and zone), a connections array (each with from, to, label, and style), and a boundaries array (each with label and type)

#### Scenario: Fallback match omits diagram data

- **WHEN** the tool returns the fallback generic pattern with confidence < 0.5
- **THEN** the diagram_data field is omitted or null, since the generic pattern does not warrant a detailed diagram

### Requirement: Source references in output

The system SHALL include source references in the response, citing the source pack entries that informed the pattern match. (P1)

#### Scenario: Source citation

- **WHEN** the tool returns a curated pattern match
- **THEN** the response includes references to the source pack files that informed the match
