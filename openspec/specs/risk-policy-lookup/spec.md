# Risk Policy Lookup Specification

## Purpose

Return industry-specific risk and governance checks — required controls, risk flags, and HITL triggers — so the Risk Checker Agent can gate architecture signoff on regulated data without relying on generic LLM judgment.

## Requirements

### Requirement: Risk and governance checks by industry

The system SHALL accept an industry, data classification, region, and deployment model, and return required controls, risk flags, and whether human-in-the-loop review is required.

#### Scenario: Healthcare with HIPAA and PHI

- **WHEN** the tool receives industry "healthcare", data classification ["PHI", "PII"], region "US", and deployment model "cloud"
- **THEN** the system returns required_controls including RBAC, audit logs, data lineage, and SAML SSO, risk_flags including "prompt leakage" and "overbroad analyst access", hitl_required true, and a review_reason explaining that regulated data access requires human approval

#### Scenario: Financial services with regulated data

- **WHEN** the tool receives industry "financial_services", data classification ["PII", "regulated financial data"], region "US", and deployment model "cloud"
- **THEN** the system returns required_controls including RBAC, audit logs, data lineage, and SAML SSO, risk_flags including "prompt leakage", "overbroad analyst access", and "cross-region replication", and hitl_required true

#### Scenario: Non-regulated industry

- **WHEN** the tool receives industry "retail", data classification ["non-sensitive"], region "US", and deployment model "cloud"
- **THEN** the system returns hitl_required false or true based on data classification, with risk_flags appropriate to the data sensitivity level

### Requirement: HITL trigger for regulated data

The system SHALL set hitl_required to true when the data classification includes regulated data types such as PHI, PII, or regulated financial data, and SHALL include a human-readable review_reason.

#### Scenario: PHI triggers HITL

- **WHEN** the data classification includes "PHI"
- **THEN** hitl_required is true and the review_reason explains that PHI access requires human approval before final architecture signoff

#### Scenario: PII triggers HITL

- **WHEN** the data classification includes "PII"
- **THEN** hitl_required is true and the review_reason references PII handling requirements

#### Scenario: Regulated financial data triggers HITL

- **WHEN** the data classification includes "regulated financial data"
- **THEN** hitl_required is true and the review_reason references financial data governance requirements

### Requirement: Structured JSON output

The system SHALL return a JSON object containing required_controls, risk_flags, hitl_required, and review_reason for every response.

#### Scenario: Response schema compliance

- **WHEN** the tool returns any risk policy lookup
- **THEN** the response includes all required fields: required_controls (array of strings), risk_flags (array of strings), hitl_required (boolean), and review_reason (string, present when hitl_required is true)

### Requirement: At least three scenarios trigger meaningful HITL review

The system SHALL produce risk flags and HITL triggers for at least three of the four demo scenarios to ensure the demo shows meaningful risk review.

#### Scenario: Healthcare triggers HITL

- **WHEN** the healthcare scenario is run with HIPAA and PHI constraints
- **THEN** hitl_required is true with PHI-specific risk flags

#### Scenario: FSI governance triggers HITL

- **WHEN** the financial services scenario is run with PII and regulated financial data
- **THEN** hitl_required is true with financial data risk flags

#### Scenario: Media agency cross-client governance triggers HITL

- **WHEN** the media agency scenario is run with cross-client governance constraints
- **THEN** hitl_required is true or risk_flags include cross-client data separation concerns
