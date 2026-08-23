---
type: pattern
title: Healthcare Patient Insights Lakehouse (Databricks, HIPAA)
source_url: openspec/changes/enterprise-arch-mcp/design.md
vendor: []
industry: [healthcare]
data_stack: [databricks, unity-catalog]
cloud: [aws, azure]
constraints: [HIPAA, PHI, US data residency]
compliance: [hipaa]
region: [US]
data_zones: [bronze, silver, gold]
latency: [batch]
pattern_id: healthcare_patient_insights
architecture_summary: Medallion lakehouse on Databricks with Unity Catalog governance and MLflow-driven patient risk scoring — HIPAA-aligned, US-resident, PHI de-identified before ML training
recommended_components:
  - "Databricks"
  - "Unity Catalog"
  - "Delta Live Tables"
  - "MLflow"
  - "Redox (EHR/EMR integration)"
integration_notes:
  - "Integrate EHR/EMR systems via Redox FHIR feeds into the bronze zone"
  - "Enforce RBAC + ABAC row and column policies in Unity Catalog so PHI is visible only to care-authorized roles"
  - "De-identify PHI in the silver zone (tokenization, date shifting) before any ML training"
  - "Keep all storage and compute in US regions using BAA-covered services only"
confidence_baseline: 0.92
diagram_data:
  components:
    - name: EHR / EMR systems
      type: source
      sublabel: Redox FHIR feeds
      zone: bronze
    - name: Databricks bronze
      type: lakehouse
      sublabel: Delta Live Tables raw PHI
      zone: bronze
    - name: Databricks silver
      type: lakehouse
      sublabel: de-identified, conformed
      zone: silver
    - name: Unity Catalog
      type: governance
      sublabel: RBAC + ABAC, lineage
      zone: governance
    - name: Databricks gold
      type: lakehouse
      sublabel: patient cohorts & features
      zone: gold
    - name: MLflow risk model
      type: ml
      sublabel: patient risk scoring
      zone: gold
  connections:
    - from: EHR / EMR systems
      to: Databricks bronze
      label: FHIR streaming
      style: solid
    - from: Databricks bronze
      to: Databricks silver
      label: de-identification
      style: solid
    - from: Databricks silver
      to: Databricks gold
      label: cohort build
      style: solid
    - from: Databricks gold
      to: MLflow risk model
      label: training & inference
      style: solid
    - from: Unity Catalog
      to: Databricks gold
      label: policy enforcement
      style: dashed
  boundaries:
    - label: US region (BAA services)
      type: region
    - label: HIPAA compliance zone
      type: compliance
---

# Healthcare Patient Insights

Patient insights lakehouse for a healthcare organization turning EHR/EMR data into
risk scores and cohort analytics under HIPAA, with PHI controls and US residency as
first-class architecture constraints — not afterthoughts.

## When to use

- Healthcare provider or payer building patient-level analytics or ML
- Databricks-centric stack with Unity Catalog governance
- PHI, HIPAA, and US data residency constraints
- Batch-oriented clinical integration (nightly FHIR sync is fine)

## Architecture walkthrough

**Bronze** — raw FHIR resources arrive via Redox into Delta Live Tables pipelines.
Raw PHI lands encrypted, access restricted to the pipeline service principal alone.

**Silver** — de-identification pass: patient identifiers tokenized, dates shifted,
zip codes truncated. Conformed clinical models (encounters, conditions, medications)
built here. Downstream consumers never see raw identifiers.

**Gold** — patient cohorts, feature tables, and quality measures. MLflow trains risk
models (readmission, deterioration) on gold features; models are registered with
lineage back to the exact table versions used.

**Governance** — Unity Catalog enforces RBAC plus ABAC row filters (care-team
relationship) and column masks (PHI fields). Every table carries lineage; audit
queries answer "who saw this patient's data" for compliance reviews.

## Governance & compliance

- **HIPAA / PHI**: de-identify before ML; BAA-covered services only; ABAC row filters
- **US data residency**: all storage/compute pinned to US regions
- **Audit**: Unity Catalog + Access History answer regulator questions

## Source grounding

- `data/vendors/aws/wellarchitected-latest-healthcare-industry-lens-healthcare-analytics-reference-architecture.html.md` — healthcare analytics reference architecture
- `data/vendors/gcp/security-compliance-hipaa.md` — HIPAA on GCP (BAA scope)
- `data/vendors/databricks/community.databricks.com-t5-technical-blog-how-sso-works-with-databricks-and-your-identity-provider-a-ba-p-41021.md` — Databricks identity federation
