## MODIFIED Requirements

### Requirement: Pattern matching by enterprise ask

The system SHALL accept an enterprise ask consisting of industry, data stack, cloud preference, and constraints, and return the best-matching reference architecture pattern from the curated source pack. The response SHALL include only the core pattern fields (pattern_id, architecture_summary, recommended_components, data_zones, integration_notes, confidence) and SHALL NOT include `source_references` or `diagram_data` by default. Those are fetched via the dedicated `arch_pattern_references` and `arch_diagram` tools, which are independent and can be called at any time.

#### Scenario: Media agency audience measurement

- **WHEN** the tool receives industry "media_agency", data stack ["BigQuery", "Snowflake"], cloud preference "GCP", and constraints ["SAML SSO", "EU data residency", "cross-client governance"]
- **THEN** the system returns pattern_id "media_agency_audience_measurement" with recommended_components including BigQuery, Snowflake, SAML SSO, and GCP EU region, data_zones of bronze/silver/gold, tenant-aware integration notes, confidence >= 0.85, and does NOT include source_references or diagram_data

#### Scenario: Healthcare patient insights

- **WHEN** the tool receives industry "healthcare", data stack ["Databricks"], and constraints ["HIPAA", "PHI", "US data residency"]
- **THEN** the system returns pattern_id "healthcare_patient_insights" with Databricks as a recommended component and HIPAA-appropriate integration notes, and does NOT include source_references or diagram_data

#### Scenario: Retail lakehouse personalization

- **WHEN** the tool receives industry "retail", data stack ["Databricks", "Snowflake"], and constraints ["real-time personalization"]
- **THEN** the system returns pattern_id "retail_lakehouse_personalization" with lakehouse components and personalization integration notes, and does NOT include source_references or diagram_data

#### Scenario: FSI governance copilot

- **WHEN** the tool receives industry "financial_services", data stack ["Snowflake"], and constraints ["PII", "regulated financial data", "audit logs"]
- **THEN** the system returns pattern_id "fsi_governance_copilot" with governance controls and audit integration notes, and does NOT include source_references or diagram_data

### Requirement: Fallback for weak matches

The system SHALL return a generic enterprise AI POC pattern with low confidence when no strong pattern match is found for the given industry or constraints. The fallback response SHALL NOT include `source_references` or `diagram_data`.

#### Scenario: Unknown industry

- **WHEN** the tool receives an industry not present in the source pack (e.g., "aerospace")
- **THEN** the system returns a fallback generic enterprise AI POC pattern with confidence < 0.5, and does NOT include source_references or diagram_data

#### Scenario: Conflicting or unmatched constraints

- **WHEN** the tool receives constraints that do not align with any curated pattern
- **THEN** the system returns the fallback generic pattern with low confidence rather than no response, and does NOT include source_references or diagram_data

### Requirement: Structured JSON output

The system SHALL return a JSON object containing pattern_id, architecture_summary, recommended_components, data_zones, integration_notes, and confidence for every response. The system SHALL NOT include `source_references` or `diagram_data` fields in the default `arch_pattern_lookup` response; those are provided by the dedicated `arch_pattern_references` and `arch_diagram` tools, which are independent and can be called at any time.

#### Scenario: Response schema compliance

- **WHEN** the tool returns any pattern match, whether curated or fallback
- **THEN** the response includes all required fields: pattern_id (string), architecture_summary (string), recommended_components (array of strings), data_zones (array of strings), integration_notes (array of strings), confidence (number between 0 and 1), and does NOT include source_references or diagram_data fields

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

## REMOVED Requirements

### Requirement: Diagram data for architecture-diagram skill

**Reason**: Diagram data generation has moved to the dedicated `arch_diagram` tool, which accepts a `pattern_id` and data stack and returns the structured `diagram_data`. Including `diagram_data` in every `arch_pattern_lookup` response bloated the payload for callers who only need the core pattern. The two tools are independent; `arch_diagram` can be called at any time.
**Migration**: Call `arch_diagram` with a `pattern_id` and data stack to obtain the `diagram_data`.

### Requirement: Source references in output

**Reason**: Source references have moved to the dedicated `arch_pattern_references` tool, which accepts a `pattern_id` and the original enterprise-ask inputs and returns the `source_references`. Including `source_references` in every `arch_pattern_lookup` response bloated the payload for callers who only need the core pattern. The two tools are independent; `arch_pattern_references` can be called at any time.
**Migration**: Call `arch_pattern_references` with a `pattern_id` (and the original industry, data stack, and constraints) to obtain the `source_references`.