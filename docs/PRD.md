# PRD: Enterprise Architecture Pattern MCP

## Status
Draft  
Date: 2026-08-22  
Owner: Ish Fuseini

## Problem Statement
The Agentic POC demo needs a credible internal tool that agents can call to translate messy enterprise asks into realistic architecture patterns. Public search can provide generic context, but the demo needs domain-specific judgment around data platforms, identity, data residency, governance, and cloud deployment tradeoffs.

Without this MCP, the demo risks looking like a prompt-only workflow rather than a forward-deployed architecture system with real tool use.

## Product Concept
Build a small self-hosted MCP server that acts as an internal architecture reference brain for enterprise AI POC scoping.

The MCP receives company, industry, data stack, cloud, and governance constraints, then returns recommended architecture patterns, tool selections, risks, and POC success criteria.

## Goals
1. Demonstrate custom MCP tool use inside the multi-agent pipeline.
2. Support five demo scenarios: Agency, Salesforce/CRM, Healthcare, Retail Lakehouse, and FSI Governance.
3. Recommend realistic architecture patterns across BigQuery, Snowflake, Databricks, SSO/SAML, data residency, and AWS/GCP/Azure.
4. Produce deterministic enough outputs for a live interview demo.
5. Make the architecture agent feel grounded in reusable enterprise patterns, not generic LLM reasoning.

## Non-Goals
1. No real vendor integration with BigQuery, Snowflake, Databricks, AWS, GCP, or Azure in v1.
2. No customer data ingestion or persistence.
3. No auth, tenancy, or production admin UI.
4. No live web crawling in the critical demo path.
5. No exhaustive vendor comparison engine.

## Primary Users
- Demo user: recruiter, hiring manager, interviewer, or technical evaluator.
- Agent user: Architect Agent and Risk Checker Agent.
- Builder/operator: Ish, maintaining the static architecture source pack.

## Recommended Grounding Strategy
Use a hybrid grounding model.

Curated source material should be the source of truth for v1:
- Architecture patterns by industry.
- Data platform capability matrix.
- Governance and compliance rules.
- POC success criteria templates.
- Common enterprise risks.

Live enrichment should be additive:
- Brandfetch can enrich company identity, industry, and brand context.
- Firecrawl can refresh vendor pages offline into cached summaries.
- Context7 can help during development for SDK/library docs.

The demo should not depend on live vendor crawling to produce a good answer.

## MCP Tools

### 1. `brand_context_lookup`
Purpose: Retrieve public company context from Brandfetch or cached Brandfetch results.

Input:
```json
{
  "domain": "havas.com"
}
```

Output:
```json
{
  "company_name": "Havas",
  "domain": "havas.com",
  "industry_hint": "media_agency",
  "description": "Global communications and media group",
  "brand_assets": {
    "logo_url": "...",
    "primary_colors": ["#..."]
  },
  "confidence": 0.86
}
```

### 2. `arch_pattern_lookup`
Purpose: Match an enterprise ask to a reference architecture pattern.

Input:
```json
{
  "industry": "media_agency",
  "data_stack": ["BigQuery", "Snowflake"],
  "cloud_preference": "GCP",
  "constraints": ["SAML SSO", "EU data residency", "cross-client governance"]
}
```

Output:
```json
{
  "pattern_id": "media_agency_audience_measurement",
  "architecture_summary": "Federated warehouse pattern with BigQuery activation, Snowflake reporting, and governed gold measurement layer.",
  "recommended_components": ["BigQuery", "Snowflake", "SAML SSO", "GCP EU region"],
  "data_zones": ["bronze", "silver", "gold"],
  "integration_notes": ["Use tenant-aware audience tables", "Keep client data separated by access policy"],
  "confidence": 0.91
}
```

### 3. `tool_selection_lookup`
Purpose: Recommend platform choices based on workload and constraints.

Input:
```json
{
  "use_case": "AI-powered patient insights",
  "data_stack": ["Databricks"],
  "constraints": ["HIPAA", "PHI", "US data residency"],
  "latency_need": "batch"
}
```

Output:
```json
{
  "recommended_platform": "Databricks",
  "cloud_fit": "Azure or AWS",
  "reasoning": ["Strong lakehouse fit", "Good governance model", "Batch analytics acceptable"],
  "alternatives": ["Snowflake for governed warehouse analytics", "BigQuery for GCP-native analytics"]
}
```

### 4. `risk_policy_lookup`
Purpose: Return industry-specific risk and governance checks.

Input:
```json
{
  "industry": "financial_services",
  "data_classification": ["PII", "regulated financial data"],
  "region": "US",
  "deployment_model": "cloud"
}
```

Output:
```json
{
  "required_controls": ["RBAC", "audit logs", "data lineage", "SAML SSO"],
  "risk_flags": ["prompt leakage", "overbroad analyst access", "cross-region replication"],
  "hitl_required": true,
  "review_reason": "Regulated data access requires human approval before final architecture signoff."
}
```

## Source Pack

The MCP should load static local files:

```txt
/data
  /industries
    agency.json
    salesforce-crm.json
    healthcare.json
    retail-lakehouse.json
    fsi-governance.json
  /vendors
    bigquery.json
    snowflake.json
    databricks.json
    aws.json
    gcp.json
    azure.json
    saml-sso.json
  /patterns
    media-agency-audience-measurement.json
    agentforce-telephony.json
    healthcare-patient-insights.json
    retail-lakehouse-personalization.json
    fsi-governance-copilot.json
  /policies
    hipaa.json
    pii.json
    data-residency.json
    cross-client-governance.json
```

## V1 Requirements

### P0 Must-Have
- MCP server exposes `arch_pattern_lookup`, `tool_selection_lookup`, and `risk_policy_lookup`.
- MCP returns structured JSON with stable schemas.
- Architecture Agent can call the MCP during a pipeline run.
- MCP supports all five demo scenarios.
- Outputs include risks that can trigger the HITL gate.

### P1 Nice-to-Have
- Add `brand_context_lookup` using Brandfetch.
- Cache Brandfetch responses for demo stability.
- Include confidence scores for pattern matches.
- Show source references in tool-call output.
- Add simple source-pack refresh script.

### P2 Future
- Firecrawl-based vendor documentation refresh.
- Context7-driven live SDK reference lookup.
- Real BigQuery/Snowflake/Databricks metadata introspection.
- Admin UI for editing architecture patterns.
- Multi-tenant customer-specific architecture libraries.


# Tech Stack
- MCP TypeScript SDK v2 (official)
- TypeScript
- Biome
- Fly.io
- architecture pattern lookup
- curated MD/JSON source pack
- optional Firecrawl-generated markdown inputs

## Acceptance Criteria
- Given a media agency scenario with BigQuery, Snowflake, SAML, and EU residency, when the Architect Agent calls `arch_pattern_lookup`, then the MCP returns the media agency audience measurement pattern.
- Given a healthcare scenario with Databricks and HIPAA, when the Risk Checker calls `risk_policy_lookup`, then the MCP flags PHI controls and requires HITL review.
- Given an unknown or weakly matched industry, when the MCP cannot find a strong pattern, then it returns a fallback generic enterprise AI POC pattern with low confidence.
- Given Brandfetch is unavailable, when `brand_context_lookup` is called, then the MCP returns cached context or a graceful unavailable response.

## Success Metrics
- 100% of five scenarios produce a valid architecture pattern.
- 100% of MCP responses conform to JSON schema.
- At least one MCP tool call is visible in every successful demo run.
- At least three scenarios trigger meaningful HITL risk review.
- Demo remains usable when Brandfetch or web enrichment is unavailable.

## Open Questions
- Should Brandfetch be exposed through this self-made MCP, or kept as the separate remote tool call?
- Should vendor summaries cite source URLs in v1, or is that unnecessary for the interview demo?
- Should Firecrawl refreshes happen manually before interviews or on a scheduled job?
- Should the MCP run as a standalone service or inside the SvelteKit backend during v1?

## Recommendation
For v1, keep the MCP deterministic and local-first. Use Brandfetch as the live enrichment layer, but make architecture selection depend on curated source files. That gives the demo both polish and reliability.