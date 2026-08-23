## 1. Project Setup

- [x] 1.1 Initialize TypeScript project with `package.json`, `tsconfig.json`, and Biome config (`biome.json`) — verify `npm install` and `npx biome check` succeed with no errors
- [x] 1.2 Install FastMCP and MCP SDK dependencies — verify `import { FastMCP } from "fastmcp"` resolves and type-checks
- [x] 1.3 Create project directory structure (`src/tools/`, `src/data/`, `src/types/`, `tests/`) — verify all directories exist and are empty

## 2. Source Pack

- [x] 2.1 Add YAML frontmatter to all existing markdown files in `data/industry/`, `data/vendors/`, `data/patterns/` with structured metadata (type, title, source_url, vendor, industry, data_stack, cloud, constraints, compliance, region, data_zones, latency) — verify all 92 files have valid frontmatter
- [x] 2.2 Scrape BigQuery vendor documentation (BigQuery architecture, analytics, EU data residency) into `data/vendors/gcp/` with `data_stack: [bigquery]` frontmatter — verify files exist and have valid frontmatter
- [x] 2.3 Tag existing SAML SSO files (snowflake/enterprise-sso-architecture-snowflake-entraid.md, snowflake/user-guide-admin-security-fed-auth-overview.md, databricks/community.databricks.com-t5-technical-blog-how-sso-works-with-databricks-and-your-identity-provider-a-ba-p-41021.md) with `data_stack: [saml-sso]` and `constraints: [SAML SSO]` in frontmatter — verify files exist and have valid frontmatter
- [x] 2.4 Create 4 scenario pattern definition files in `data/patterns/` (`media-agency-audience-measurement.md`, `healthcare-patient-insights.md`, `retail-lakehouse-personalization.md`, `fsi-governance-copilot.md`) with full output schema in frontmatter (pattern_id, architecture_summary, recommended_components, data_zones, integration_notes, confidence_baseline) and narrative body — verify each file has complete frontmatter and body content
- [x] 2.5 Tag access management and tenant isolation files (`Centralized-Identity-Access-Management-Pattern.md`, `Microservices-Security-Pattern-Policy-Based.md`, `Microservices-Governance-And-API-Management.md`, `data/vendors/gcp/data-isolation-tenant-architecture-google-cloud-platform-gcp.md`) with `constraints: [cross-client governance]` in frontmatter — verify cross-client governance is searchable via frontmatter
- [x] 2.6 Implement frontmatter parser/loader that reads all markdown files in `data/` at server startup, parses YAML frontmatter, and builds an in-memory index keyed by industry, data_stack, constraints, compliance, and pattern_id — verify loader runs and returns indexed patterns, vendors, and industries

## 3. Tool: arch_pattern_lookup (P0)

- [x] 3.1 Define TypeScript input/output types for `arch_pattern_lookup` matching the spec's JSON schema (pattern_id, architecture_summary, recommended_components, data_zones, integration_notes, confidence, optional diagram_data with components/connections/boundaries) — verify types compile with `tsc --noEmit`
- [x] 3.2 Implement pattern matching logic: industry match → data stack overlap → constraint coverage → confidence score — verify media agency inputs (industry "media_agency", data stack ["BigQuery", "Snowflake"], cloud "GCP", constraints ["SAML SSO", "EU data residency", "cross-client governance"]) return pattern_id "media_agency_audience_measurement" with confidence >= 0.85
- [x] 3.3 Implement fallback generic enterprise AI POC pattern for weak or unmatched inputs — verify unknown industry "aerospace" returns fallback pattern with confidence < 0.5
- [x] 3.4 Implement confidence scoring algorithm (industry 40%, data stack overlap 30%, constraint coverage 30%) — verify high-confidence match returns >= 0.85 and fallback returns < 0.5
- [x] 3.5 Implement `diagram_data` field population for curated matches (confidence >= 0.85): structure components (name, type, sublabel, zone), connections (from, to, label, style), and boundaries (label, type) from the pattern definition frontmatter — verify media agency response includes diagram_data with BigQuery, Snowflake, SAML SSO components and GCP EU region boundary
- [x] 3.6 Add source references in response output citing the source pack entries that informed the match (P1) — verify response includes source references for curated matches
- [x] 3.7 Register `arch_pattern_lookup` as an MCP tool via FastMCP — verify tool is discoverable via MCP tool listing

## 4. Tool: tool_selection_lookup (P0)

- [x] 4.1 Define TypeScript input/output types for `tool_selection_lookup` matching the spec's JSON schema (recommended_platform, cloud_fit, reasoning, alternatives) — verify types compile with `tsc --noEmit`
- [x] 4.2 Implement platform recommendation logic — verify healthcare inputs (use case "AI-powered patient insights", data stack ["Databricks"], constraints ["HIPAA", "PHI", "US data residency"], latency "batch") return recommended_platform "Databricks" with cloud_fit "Azure or AWS"
- [x] 4.3 Implement alternatives listing with at least one alternative platform and rationale — verify response includes alternatives with brief descriptions
- [x] 4.4 Implement constraint-aware reasoning that factors HIPAA, PII, data residency, SSO/SAML, and latency into platform reasoning — verify reasoning text references input constraints
- [x] 4.5 Register `tool_selection_lookup` as an MCP tool via FastMCP — verify tool is discoverable via MCP tool listing

## 5. Tool: risk_policy_lookup (P0)

- [x] 5.1 Define TypeScript input/output types for `risk_policy_lookup` matching the spec's JSON schema (required_controls, risk_flags, hitl_required, review_reason) — verify types compile with `tsc --noEmit`
- [x] 5.2 Implement risk and governance checks by industry and data classification — verify healthcare inputs (industry "healthcare", data classification ["PHI", "PII"], region "US", deployment "cloud") return required_controls including RBAC, audit logs, data lineage, SAML SSO, and hitl_required true — verify healthcare inputs (industry "healthcare", data classification ["PHI", "PII"], region "US", deployment "cloud") return required_controls including RBAC, audit logs, data lineage, SAML SSO, and hitl_required true
- [x] 5.3 Implement HITL trigger for regulated data types (PHI, PII, regulated financial data) with human-readable review_reason — verify hitl_required is true and review_reason is present for all three regulated data types — verify hitl_required is true and review_reason is present for all three regulated data types
- [x] 5.4 Verify at least three demo scenarios trigger meaningful HITL review — verify healthcare, FSI governance, and media agency cross-client governance all produce hitl_required true or relevant risk_flags — verify healthcare, FSI governance, and media agency cross-client governance all produce hitl_required true or relevant risk_flags
- [x] 5.5 Register `risk_policy_lookup` as an MCP tool via FastMCP — verify tool is discoverable via MCP tool listing

## 6. Tool: brand_context_lookup (P0)

- [x] 6.1 Define TypeScript input/output types for `brand_context_lookup` matching the spec's JSON schema (company_name, domain, industry_hint, description, tags, positioning, brand, logo_url, confidence) — verify types compile with `tsc --noEmit`
- [x] 6.2 Implement Brandfetch Brand Context API client (`GET https://api.brandfetch.io/v2/context/{domain}`, Bearer auth via `BRANDFETCH_API_KEY` env var) that maps the API response (meta, identity, positioning, brand) to the tool output schema — verify domain "havas.com" returns company_name "Havas" with description, tags, positioning, brand voice/style, and confidence >= 0.80
- [x] 6.3 Implement logo.dev client (`GET https://api.logo.dev/brand/{domain}`) that retrieves the company logo URL and includes it as `logo_url` in the response — verify domain "havas.com" returns a valid logo_url
- [x] 6.4 Implement layered caching: local file cache with TTL plus Brandfetch `cachedOnly=true` parameter for instant cache-only lookups — verify second lookup for same domain returns cached data without consuming API quota
- [x] 6.5 Implement graceful fallback when Brandfetch or logo.dev is unreachable — verify fallback returns cached response if available, or a graceful unavailable response if no cache exists
- [x] 6.6 Pre-populate local cache for the four demo domains by running them through Brandfetch before the demo — verify all four domains return cached context on subsequent lookups
- [x] 6.7 Register `brand_context_lookup` as an MCP tool via FastMCP — verify tool is discoverable via MCP tool listing

## 7. MCP Server

- [x] 7.1 Implement MCP server entry point with FastMCP, registering all four tools — verify server starts and all four tools are discoverable via MCP tool listing
- [x] 7.2 Implement stdio transport for local development and MCP Inspector testing — verify server runs via stdio and responds to tool calls
- [x] 7.3 Implement HTTP transport for GCP Cloud Run deployment — verify server runs via HTTP and responds to tool calls
- [x] 7.4 Implement runtime JSON schema validation on tool entry — verify invalid or missing required input fields return a validation error

## 8. Testing

- [x] 8.1 Write unit tests for `arch_pattern_lookup` covering all four demo scenarios (agency, healthcare, retail lakehouse, FSI governance) plus the unknown-industry fallback — verify all tests pass
- [x] 8.2 Write unit tests for `tool_selection_lookup` covering healthcare, media agency, and retail scenarios — verify all tests pass
- [x] 8.3 Write unit tests for `risk_policy_lookup` including HITL triggers for PHI, PII, and regulated financial data — verify all tests pass
- [x] 8.4 Write unit tests for `brand_context_lookup` including local cache hit, cache miss, cachedOnly mode, Brandfetch-unavailable fallback, and logo.dev-unavailable fallback (logo_url null but context returned) — verify all tests pass
- [x] 8.5 Write integration test verifying all four demo scenarios produce a valid architecture pattern (curated or fallback) — verify all four scenarios pass
- [x] 8.6 Write integration test verifying JSON schema compliance for all tool responses — verify every response conforms to its declared schema

## 9. Deployment

- [x] 9.1 Create Dockerfile for GCP Cloud Run — verify `docker build` succeeds with no errors
- [x] 9.2 Create Cloud Run service configuration (port, env vars, health check) — verify config is valid and deployable
- [x] 9.3 Add source-pack validation script (P1) that checks all markdown files in `data/` for valid YAML frontmatter and required fields — verify script runs and reports any missing or malformed frontmatter

## 10. Demo Validation

- [x] 10.1 Verify 100% of four demo scenarios produce a valid architecture pattern — verify all four return a pattern_id and confidence score
- [x] 10.2 Verify 100% of MCP responses conform to JSON schema — verify no response is missing required fields
- [x] 10.3 Verify at least one MCP tool call is visible in a demo pipeline run — verify tool call appears in agent pipeline output
- [x] 10.4 Verify at least three scenarios trigger meaningful HITL risk review — verify hitl_required is true for at least three of four scenarios
- [x] 10.5 Verify demo remains usable when Brandfetch is unavailable — verify `brand_context_lookup` returns cached context or graceful unavailable response, and the remaining P0 tools (arch_pattern_lookup, tool_selection_lookup, risk_policy_lookup) continue to function normally
