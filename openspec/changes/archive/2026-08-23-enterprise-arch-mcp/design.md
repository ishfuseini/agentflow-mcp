## Context

The repo contains a `data/` directory with 92 markdown reference files covering industry architectures, vendor documentation (Azure, Databricks, Snowflake, GCP, AWS), and enterprise architecture patterns. The `agent/` directory (prompt files for the Architecture Agent, Technology Selection Agent, and the architecture-diagram skill) is being moved to the agentflow pipeline project — agent prompts and the diagram skill belong in the pipeline, not in the MCP server. There are no existing specs, no MCP server code, and no JSON source pack. See `proposal.md` for motivation and scope.

## Goals / Non-Goals

**Goals:**

- Deterministic, local-first MCP server that produces stable outputs across all four demo scenarios.
- Stable JSON schemas for every tool response, validated at runtime via TypeScript types.
- Clean separation between the curated source pack (source of truth) and live enrichment (Brandfetch, additive only).
- Demo remains fully functional when Brandfetch or web enrichment is unavailable.
- MCP server deployable as a standalone service on GCP Cloud Run with HTTP transport, and locally via stdio transport for development.

**Non-Goals:**

- ML/embedding-based pattern matching — v1 uses deterministic rules-based matching only.
- Real-time vendor metadata introspection (BigQuery/Snowflake/Databricks) — deferred to P2.
- Admin UI for editing architecture patterns — deferred to P2.
- Multi-tenant customer-specific architecture libraries — deferred to P2.
- Live web crawling in the critical demo path — Firecrawl-based refresh is P2.

## Decisions

### 1. FastMCP + TypeScript

**Choice**: Build the MCP server with FastMCP and TypeScript.

**Rationale**: PRD specifies FastMCP; TypeScript provides type safety for the JSON tool schemas that agents consume; FastMCP is the standard MCP framework with built-in tool registration and transport handling.

**Alternatives**: Python FastMCP (PRD specifies TypeScript), raw MCP SDK (more boilerplate, less ergonomics).

### 2. Frontmatter-first markdown source pack

**Choice**: Add structured YAML frontmatter to the existing markdown reference files under `data/` (92 files across `industry/`, `vendors/`, `patterns/`). The MCP parses frontmatter at runtime for pattern matching and uses the markdown body as detailed reference content. No separate JSON source pack — one set of files, not two.

**Frontmatter schema** (fields vary by file type):
```yaml
---
type: pattern | vendor | industry          # what this document is
title: Healthcare Patient Personalization Reference Architecture
source_url: https://www.databricks.com/resources/architectures/...
vendor: databricks                              # vendor slug (vendor files only)
scraped_at: 2026-08-22

# Matching fields the MCP queries on
industry: [healthcare]                          # industry code(s)
data_stack: [databricks, unity-catalog]        # platform/tool slugs
cloud: [aws, azure]                             # cloud providers
constraints: [HIPAA, PHI, US data residency]   # governance/compliance constraints
compliance: [hipaa]                             # compliance frameworks
region: [US]                                    # data residency regions
data_zones: [bronze, silver, gold]              # medallion layers
latency: batch                                  # batch | real-time

# Pattern-specific (only on pattern definition files)
pattern_id: healthcare_patient_insights
architecture_summary: Lakehouse pattern with medallion architecture, Unity Catalog governance, and ML-driven patient risk scoring
recommended_components: [databricks, unity-catalog, DLT, MLflow]
integration_notes: [Use Redox for EHR/EMR integration, RBAC + ABAC via Unity Catalog]
confidence_baseline: 0.90
---
```

**Policy coverage without a policies directory**: HIPAA, PII, and data-residency constraints are tagged via frontmatter on vendor docs (e.g., `compliance: [hipaa]` on AWS/GCP/Databricks HIPAA pages). Cross-client governance is tagged on access management and tenant isolation files (e.g., `constraints: [cross-client governance]` on `Centralized-Identity-Access-Management-Pattern.md` and `data/vendors/gcp/data-isolation-tenant-architecture-google-cloud-platform-gcp.md`). The `risk_policy_lookup` tool matches on `compliance` and `constraints` fields across all file types.

**New files to scrape**: BigQuery vendor documentation (architecture, analytics, EU data residency) into `data/vendors/gcp/` with `data_stack: [bigquery]` frontmatter. SAML SSO is covered by existing Snowflake and Databricks SSO docs — tag via frontmatter, no new scraping needed.

**New files to author**: 4 scenario pattern definition files (one per demo scenario) with full output schema in frontmatter — these define what the MCP returns for each scenario.

**Rationale**: Simpler than maintaining two sets of files (markdown reference + JSON source pack). The frontmatter provides the structured metadata for matching; the markdown body provides the narrative reference content the agent can cite. HIPAA and data residency are already well-covered in vendor docs — no need to duplicate them in separate policy files. Cross-client governance naturally belongs in access management patterns.

**Alternatives**: Separate JSON source pack (duplicates content, two files to maintain per topic); parse unstructured markdown without frontmatter (no reliable matching); external database (overkill for a demo).

**Source pack structure**:
```
data/
  industry/        7 existing files + frontmatter
  vendors/          37 existing files + frontmatter + new BigQuery content in gcp/
  patterns/         31 existing files + frontmatter + 4 new scenario pattern definitions
                    (media-agency-audience-measurement, healthcare-patient-insights,
                     retail-lakehouse-personalization, fsi-governance-copilot)
```

### 3. Rules-based pattern matching

**Choice**: Implement deterministic, rules-based pattern matching — industry match → data stack overlap → constraint coverage → confidence score.

**Rationale**: Deterministic outputs are essential for a live interview demo; predictable and debuggable; no ML model to train or serve. The matching algorithm weights industry alignment highest, then data stack overlap, then constraint coverage, producing a confidence score between 0 and 1.

**Alternatives**: ML/embedding-based semantic matching (non-deterministic, overkill, hard to debug during a demo).

### 4. Brandfetch Brand Context API with layered caching

**Choice**: `brand_context_lookup` calls the Brandfetch Brand Context API (`GET https://api.brandfetch.io/v2/context/{domain}`, Bearer auth via `BRANDFETCH_API_KEY` env var) to retrieve rich company context — identity (tagline, mission, description, tags), positioning (value proposition, target audience segments, products & services), and brand voice/style. Responses are cached using two layers: (1) Brandfetch's `cachedOnly=true` parameter for instant cache-only lookups on pre-populated domains, and (2) a local file cache with TTL. Falls back to local cache or a graceful unavailable response when Brandfetch is down or quota is exceeded.

**Rationale**: The Brand Context API provides narrative-rich, structured data purpose-built for grounding LLMs — far more useful than the simplified logo/color schema in the original PRD (logos and colors come from the separate Brand API, not the Brand Context API). The free tier (100 requests/month) is sufficient for 5 demo domains pre-populated before the demo. The `cachedOnly` mode gives instant responses for pre-populated domains. Layered caching ensures demo stability even under network failure.

**Logo retrieval via logo.dev**: The company logo is retrieved from logo.dev (`GET https://api.logo.dev/brand/{domain}`), a lightweight single-purpose logo API. The logo is cached locally alongside the Brandfetch context. When logo.dev is unavailable, logo_url is set to null — the remaining brand context is still returned. The logo is used by the agent's architecture-diagram skill to render branded diagram headers.

**Alternatives**: No Brandfetch (loses company-specific grounding and enrichment polish); always-live calls without caching (burns quota, demo instability); Brand API for logos/colors/fonts (heavier integration, less useful for architecture reasoning — the Brand Context API provides narrative context, logo.dev provides the logo, together they cover what the demo needs without the full Brand API overhead).

### 5. Standalone service on GCP Cloud Run (HTTP) + stdio for local dev

**Choice**: Deploy the MCP server as a standalone service on GCP Cloud Run with HTTP transport for remote agent pipeline calls. Support stdio transport for local development and testing.

**Rationale**: PRD specifies GCP Cloud Run. Standalone service keeps the MCP cleanly separated from the agent pipeline, making it easier to demo independently. Stdio transport is needed for local development and MCP Inspector testing.

**Alternatives**: Embedded in a SvelteKit backend (coupling, harder to demo independently — and the PRD tech stack does not mention SvelteKit for v1).

### 6. Biome for linting and formatting

**Choice**: Use Biome for code formatting and linting.

**Rationale**: PRD specifies Biome; it is fast, zero-config, and Rust-based, reducing tooling overhead for a single-maintainer project.

**Alternatives**: ESLint + Prettier (more configuration, slower, heavier dependency footprint).

### 7. Fallback generic enterprise AI POC pattern

**Choice**: When no curated pattern matches with confidence >= 0.5, return a generic enterprise AI POC pattern with low confidence.

**Rationale**: Acceptance criterion requires the demo to always produce a valid pattern, even for unknown industries. The fallback ensures the demo flow never breaks. Low confidence signals to the agent and evaluator that the match is weak.

**Alternatives**: Error response (breaks demo flow); empty response (agent has nothing to work with).

### 8. Confidence scoring algorithm

**Choice**: Compute confidence as a weighted score: industry match (40%), data stack overlap (30%), constraint coverage (30%). Fallback pattern always returns confidence < 0.5.

**Rationale**: P1 but adds demo polish; gives the agent and evaluator a signal for match quality; weights industry alignment highest because it is the strongest predictor of pattern fit.

**Alternatives**: No confidence score (less informative, harder for evaluator to assess match quality).

### 9. Diagram data in arch_pattern_lookup output

**Choice**: Include an optional `diagram_data` field in the `arch_pattern_lookup` response for curated matches (confidence >= 0.85). The field contains structured components (name, type, sublabel, zone), connections (from, to, label, style), and boundaries (label, type) that the agent's architecture-diagram skill renders as an HTML/SVG diagram.

**Rationale**: The agentflow pipeline includes an architecture-diagram skill (`agent/architecture-diagram/`) that generates dark-themed SVG diagrams as standalone HTML files. By returning diagram-ready structured data from the MCP, the agent can pass it directly to the diagram skill without manually translating the pattern output into component/connection format. The MCP owns the structured knowledge; the diagram skill owns the rendering. Clean separation of concerns.

**Fallback matches** (confidence < 0.5) omit `diagram_data` — the generic pattern does not warrant a detailed diagram.

**Alternatives**: MCP generates the HTML diagram directly (couples knowledge to presentation, breaks separation of concerns); no diagram_data (agent must manually structure the pattern output into diagram components, adding friction); diagram_data as a separate tool (over-engineering — it's just a view of the same pattern data).

### 10. Agent prompts and diagram skill belong in agentflow, not the MCP

**Choice**: Agent system prompts (Architecture Agent, Risk Checker Agent, Qualifier Agent) and the architecture-diagram skill live in the agentflow pipeline project, not in the MCP server. The MCP server is a tool provider — it exposes tools and data, not agent behavior. Company autocomplete (logo.dev autocomplete API for resolving a partial company name to a domain) is likewise agent-side: the agent resolves the domain in conversation, then calls `brand_context_lookup` with it.

**Rationale**: The agentflow PRD defines 3 agents (Qualifier, Architect, Risk Checker) with specific output schemas and interaction flows. Agent prompts define *how* agents reason — that's pipeline behavior. The MCP defines *what* architecture knowledge exists — that's its domain. Mixing agent behavior into the MCP creates coupling between two projects that should stay cleanly separated. The MCP's `diagram_data` output is the bridge: structured data the agent passes to the diagram skill. Autocomplete is a typahead interaction pattern (resolving "havas" to "havas.com" before a lookup) — UX behavior, not knowledge, so it stays in the pipeline with its own logo.dev key.

**Alternatives**: Expose agent prompts as MCP prompts (couples MCP to pipeline agent definitions; MCP prompts are for reusable prompt templates, not full agent system prompts); embed diagram skill in MCP (the skill generates HTML, which is presentation, not knowledge).

## Risks / Trade-offs

- **[Source pack content quality]** → Add frontmatter to existing 92 markdown files + author 4 scenario pattern definitions + scrape BigQuery/SAML SSO content; manually verify each of the four scenarios produces the expected output before demo.
- **[Brandfetch API or logo.dev quota/outages]** → Layered caching (Brandfetch `cachedOnly` + local file cache with TTL + logo.dev cache); 100-request free tier is sufficient for 4 demo domains pre-populated before demo; graceful fallback to cached or unavailable response; when logo.dev is down, logo_url is null but remaining brand context is still returned; the three core tools (arch_pattern_lookup, tool_selection_lookup, risk_policy_lookup) work fully offline without brand context.
- **[Pattern matching accuracy for edge cases]** → Deterministic rules-based matching with explicit fallback; edge cases produce the generic pattern rather than incorrect matches.
- **[Demo reliability under network failure]** → Local-first architecture; the three core tools (arch_pattern_lookup, tool_selection_lookup, risk_policy_lookup) work fully offline; `brand_context_lookup` falls back to local cache or graceful unavailable when Brandfetch or logo.dev is unreachable.
- **[JSON schema drift across tools]** → Define shared TypeScript interfaces for each tool's input and output; runtime validation on tool entry.
- **[Diagram data completeness]** → The `diagram_data` field must accurately represent the architecture pattern's components and connections for the diagram skill to render a meaningful diagram; manually verify diagram_data for each of the four demo scenarios.
- **[Source pack freshness]** → P1 source-pack refresh script can be manual initially; Firecrawl-based refresh deferred to P2.

## Open Questions

- Should the MCP server support both stdio and HTTP transports from day one, or start with stdio for development and add HTTP when deploying to Cloud Run? (Deferrable — specs describe tool behavior, not transport; both transports can be added independently.)
- Should the source pack refresh script (P1) invoke Firecrawl for vendor page summaries, or start as a manual frontmatter authoring workflow? (Deferrable — Firecrawl is P2; P1 refresh can be a simple validation script.)
