---
type: pattern
title: FSI Governance Copilot (Snowflake, regulated data)
source_url: openspec/changes/enterprise-arch-mcp/design.md
vendor: []
industry: [financial_services]
data_stack: [snowflake]
cloud: [aws, azure]
constraints: [PII, regulated financial data, audit logs]
compliance: []
region: []
data_zones: [bronze, silver, gold]
latency: [batch]
pattern_id: fsi_governance_copilot
architecture_summary: Snowflake-governed FSI data platform with column-level PII tagging and masking, Access History audit trails feeding regulator-ready lineage, and an LLM copilot restricted to governed gold views with human-in-the-loop review
recommended_components:
  - "Snowflake"
  - "Column-level security with tagging policies"
  - "Access History audit sink"
  - "Governed LLM copilot views"
  - "HITL review workflow"
integration_notes:
  - "Tag and mask PII columns with Snowflake tagging policies before any copilot access"
  - "Route all copilot queries through governed gold views only — no direct table access"
  - "Stream Snowflake Access History into an immutable audit sink for regulator-ready lineage"
  - "Require human-in-the-loop sign-off before any regulated advice or customer-facing output"
confidence_baseline: 0.90
diagram_data:
  components:
    - name: Regulated data sources
      type: source
      sublabel: banking, trading, CRM
      zone: bronze
    - name: Snowflake bronze
      type: warehouse
      sublabel: encrypted landing
      zone: bronze
    - name: Snowflake silver
      type: warehouse
      sublabel: tagged & masked
      zone: silver
    - name: Snowflake gold
      type: warehouse
      sublabel: governed copilot views
      zone: gold
    - name: Access History audit
      type: audit
      sublabel: immutable sink
      zone: governance
    - name: LLM copilot
      type: ml
      sublabel: governed views only
      zone: gold
    - name: HITL review
      type: control
      sublabel: sign-off gate
      zone: governance
  connections:
    - from: Regulated data sources
      to: Snowflake bronze
      label: secure ELT
      style: solid
    - from: Snowflake bronze
      to: Snowflake silver
      label: PII tagging & masking
      style: solid
    - from: Snowflake silver
      to: Snowflake gold
      label: governed views
      style: solid
    - from: Snowflake gold
      to: LLM copilot
      label: RAG over views
      style: solid
    - from: LLM copilot
      to: HITL review
      label: draft outputs
      style: solid
    - from: Access History audit
      to: HITL review
      label: evidence trail
      style: dashed
  boundaries:
    - label: Regulated data boundary
      type: compliance
---

# FSI Governance Copilot

An LLM copilot for a financial services institution where the risk isn't the model —
it's ungoverned data access underneath it. Every copilot answer is grounded in
governed Snowflake views, fully audited, and human-reviewed before anything regulated
leaves the building.

## When to use

- Financial services AI copilots (advisor assist, compliance Q&A, ops automation)
- Snowflake-centric data platform
- PII, regulated financial data, and audit-log constraints
- Regulators (or risk teams) require lineage from every AI output back to source data

## Architecture walkthrough

**Bronze** — banking, trading, and CRM data lands encrypted. Direct analyst access is
disabled; only pipeline service accounts operate here.

**Silver** — Snowflake tagging policies classify columns (PII, financial, internal);
masking policies apply per role. This is where governance becomes enforceable
metadata rather than tribal knowledge.

**Gold** — governed views purpose-built for the copilot: aggregation thresholds,
row filters by business line, masked identifiers. The LLM connects with a service
account whose entire surface is these views — it physically cannot read raw tables.

**Audit & HITL** — Snowflake Access History streams to an immutable sink, so every
copilot query has a queryable evidence trail. Draft outputs touching regulated
advice route through a human-in-the-loop sign-off gate before release.

## Governance & compliance

- **PII**: tagging + masking policies enforced before copilot access
- **Regulated financial data**: gold views only, aggregation thresholds, row filters
- **Audit logs**: Access History → immutable sink; regulator-ready lineage reports
- **HITL**: sign-off gate for regulated outputs with full evidence trail

## Source grounding

- `data/vendors/snowflake/snowflake-cortex-redact-pii.md` — PII redaction
- `data/vendors/gcp/architecture-framework-perspectives-fsi.md` — FSI architecture controls
- `data/vendors/aws/wellarchitected-latest-financial-services-industry-lens-financial-services-industry-lens.html.md` — FSI lens
- `data/vendors/aws/solutions-governance-on-aws.md` — governance reference
- `data/patterns/Microservices-Security-Pattern-Policy-Based.md` — policy-based security
