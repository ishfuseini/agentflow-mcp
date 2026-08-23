# Tool Selection Lookup Specification

## Purpose

Recommend platform and tool choices based on workload type, data stack, constraints, and latency needs so the Architecture Agent can ground its technology selections in enterprise-grade reasoning rather than generic LLM suggestions.

## Requirements

### Requirement: Platform recommendation by workload

The system SHALL accept a use case description, data stack, constraints, and latency need, and return a recommended platform with cloud fit, reasoning, and alternatives.

#### Scenario: Healthcare AI-powered patient insights

- **WHEN** the tool receives use case "AI-powered patient insights", data stack ["Databricks"], constraints ["HIPAA", "PHI", "US data residency"], and latency need "batch"
- **THEN** the system returns recommended_platform "Databricks", cloud_fit "Azure or AWS", reasoning including strong lakehouse fit and good governance model, and alternatives including Snowflake and BigQuery

#### Scenario: Media agency audience measurement

- **WHEN** the tool receives use case "audience measurement", data stack ["BigQuery", "Snowflake"], constraints ["SAML SSO", "EU data residency"], and latency need "batch"
- **THEN** the system returns recommended_platform "BigQuery" for activation with Snowflake for governed reporting, and cloud_fit "GCP"

#### Scenario: Retail lakehouse personalization

- **WHEN** the tool receives use case "real-time personalization", data stack ["Databricks", "Snowflake"], constraints ["real-time"], and latency need "real-time"
- **THEN** the system returns recommended_platform "Databricks" or "Snowflake" with reasoning around lakehouse fit and streaming capabilities

### Requirement: Structured JSON output

The system SHALL return a JSON object containing recommended_platform, cloud_fit, reasoning, and alternatives for every response.

#### Scenario: Response schema compliance

- **WHEN** the tool returns any platform recommendation
- **THEN** the response includes all required fields: recommended_platform (string), cloud_fit (string), reasoning (array of strings), and alternatives (array of strings)

### Requirement: Alternatives listing

The system SHALL include at least one alternative platform recommendation with a brief rationale for each alternative.

#### Scenario: Alternatives provided

- **WHEN** the tool returns a recommended platform
- **THEN** the response includes at least one alternative platform with a brief description of when to prefer it

### Requirement: Support for major platforms

The system SHALL provide recommendations covering BigQuery, Snowflake, Databricks, AWS, GCP, and Azure based on the input constraints and workload.

#### Scenario: Platform coverage

- **WHEN** the tool receives inputs referencing any combination of the supported platforms
- **THEN** the system returns a recommendation that accounts for the referenced platforms in either the recommendation or alternatives

### Requirement: Constraint-aware reasoning

The system SHALL factor data residency, compliance (HIPAA, PII), SSO/SAML, and latency requirements into its platform reasoning.

#### Scenario: HIPAA constraint influences recommendation

- **WHEN** the tool receives constraints including "HIPAA" and "PHI"
- **THEN** the reasoning references HIPAA compliance and PHI protection as factors in the platform recommendation

#### Scenario: Data residency constraint influences cloud fit

- **WHEN** the tool receives constraints including "EU data residency"
- **THEN** the cloud_fit accounts for EU region availability
