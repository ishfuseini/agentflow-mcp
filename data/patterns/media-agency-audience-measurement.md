---
type: pattern
title: Media Agency Audience Measurement (BigQuery + Snowflake, EU)
source_url: openspec/changes/enterprise-arch-mcp/design.md
vendor: []
industry: [media_agency]
data_stack: [bigquery, snowflake]
cloud: [gcp]
constraints: [SAML SSO, EU data residency, cross-client governance]
compliance: []
region: [EU]
data_zones: [bronze, silver, gold]
latency: [batch]
pattern_id: media_agency_audience_measurement
architecture_summary: Multi-tenant audience measurement lakehouse on BigQuery (EU) with Snowflake for client cross-analysis, Analytics Hub for governed cross-client audience exchange, and SAML SSO federated identity for agency users
recommended_components:
  - "BigQuery (EU multi-region)"
  - "Snowflake"
  - "SAML SSO (Okta or Entra ID)"
  - "Analytics Hub"
  - "BigQuery column-level security"
integration_notes:
  - "Tenant-isolate client data via per-client GCP projects and BigQuery column-level security — never mix client audiences in shared tables"
  - "Exchange audiences with clients and partners through Analytics Hub listings (governed data shares), not raw exports"
  - "Federate agency identity via SAML SSO to both BigQuery and Snowflake so access reviews cover every system"
  - "Pin BigQuery datasets to EU multi-regions (eu / europe-west) to satisfy EU data residency commitments"
confidence_baseline: 0.90
diagram_data:
  components:
    - name: SAML IdP
      type: identity
      sublabel: agency SSO (Okta/Entra ID)
      zone: governance
    - name: Campaign & platform sources
      type: source
      sublabel: ad platforms, web analytics
      zone: bronze
    - name: BigQuery (EU)
      type: warehouse
      sublabel: audience lakehouse, medallion zones
      zone: gold
    - name: Analytics Hub
      type: exchange
      sublabel: governed cross-client listings
      zone: gold
    - name: Snowflake
      type: warehouse
      sublabel: client cross-analysis & activation
      zone: gold
  connections:
    - from: SAML IdP
      to: BigQuery (EU)
      label: SAML SSO
      style: dashed
    - from: SAML IdP
      to: Snowflake
      label: SAML SSO
      style: dashed
    - from: Campaign & platform sources
      to: BigQuery (EU)
      label: batch ELT
      style: solid
    - from: BigQuery (EU)
      to: Analytics Hub
      label: governed listings
      style: solid
    - from: Analytics Hub
      to: Snowflake
      label: audience exchange
      style: solid
  boundaries:
    - label: GCP EU region
      type: region
    - label: Client tenants
      type: grouping
---

# Media Agency Audience Measurement

Audience measurement platform for a media agency operating many client brands from one
governed data estate. The defining tension: the agency needs shared tooling and
identity, while each client's audience data must stay isolated and EU-resident.

## When to use

- Media agency or advertising holding company measuring audiences across client brands
- Mixed BigQuery + Snowflake estate with analysts in both
- EU data residency and cross-client governance are hard requirements
- Agency-wide SSO (SAML) instead of per-system local accounts

## Architecture walkthrough

**Bronze** — raw campaign delivery logs, ad-platform exports, and web analytics land in
per-client BigQuery datasets in EU multi-regions. Ingestion jobs tag every row with the
owning client tenant.

**Silver** — conformed audience identity: deterministic and probabilistic ID resolution
deduplicates users across platforms, normalized to shared schemas but still
tenant-partitioned. Column-level security hides sensitive audience attributes by role.

**Gold** — per-client measurement marts (reach, frequency, cross-screen deduplication)
plus agency-level aggregate views that only expose anonymized, k-anonymity-checked
audience segments. Analytics Hub publishes these as governed data listings.

**Snowflake** — clients that standardize on Snowflake subscribe to Analytics Hub
listings or activate matched audiences there; agency analysts use it for cross-client
benchmarking on aggregates only. Same SAML identity provider federates access.

## Governance & compliance

- **Cross-client governance**: per-client projects + column-level security keep tenant
  data isolated; Analytics Hub is the only sanctioned egress path for cross-client data
- **EU data residency**: BigQuery datasets pinned to EU multi-regions; check the
  locations doc before adding any new dataset
- **Identity**: single SAML IdP federated to BigQuery and Snowflake; quarterly access
  reviews cover both

## Source grounding

- `data/vendors/gcp/bigquery-docs-analytics-hub-introduction.md` — governed data sharing
- `data/vendors/gcp/bigquery-docs-locations.md` — EU dataset placement
- `data/vendors/gcp/bigquery-docs-column-level-security-intro.md` — PII column controls
- `data/vendors/gcp/data-isolation-tenant-architecture-google-cloud-platform-gcp.md` — tenant isolation
- `data/vendors/snowflake/enterprise-sso-architecture-snowflake-entraid.md` — SAML SSO
- `data/patterns/Centralized-Identity-Access-Management-Pattern.md` — centralized IAM
- `data/vendors/gcp/solutions-marketing-analytics.md` — marketing analytics reference
