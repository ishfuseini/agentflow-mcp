## Why

The Agentic POC demo needs a credible internal MCP server that agents can call to translate messy enterprise asks into realistic architecture patterns. Public search provides generic context, but the demo needs domain-specific judgment around data platforms, identity, data residency, governance, and cloud deployment tradeoffs. Without this MCP, the demo risks looking like a prompt-only workflow rather than a forward-deployed architecture system with real tool use.

## What Changes

- New self-hosted MCP server built with FastMCP and TypeScript, exposing four tools that Architecture and Risk Checker agents call during a pipeline run.
- **`arch_pattern_lookup`** (P0): Match an enterprise ask (industry, data stack, cloud, constraints) to a reference architecture pattern from the curated source pack. Returns an optional `diagram_data` field (components, connections, boundaries) structured for the agent's architecture-diagram skill to render.
- **`tool_selection_lookup`** (P0): Recommend platform choices (BigQuery, Snowflake, Databricks, AWS/GCP/Azure) based on workload and constraints.
- **`risk_policy_lookup`** (P0): Return industry-specific risk and governance checks, including HITL triggers for regulated data.
- **`brand_context_lookup`** (P0): Retrieve rich company context — identity, positioning, and brand voice/style — from the Brandfetch Brand Context API, plus company logo from logo.dev. Layered caching and graceful fallback for both sources.
- Curated markdown source pack with structured YAML frontmatter covering four demo scenarios: Agency, Healthcare, Retail Lakehouse, FSI Governance. HIPAA and data residency are covered in existing vendor docs; cross-client governance is tagged in access management pattern files.
- Fallback generic enterprise AI POC pattern returned with low confidence when no strong match is found.
- Risk flags from `risk_policy_lookup` can trigger the HITL gate in the multi-agent pipeline.
- Deployable as a standalone service on GCP Cloud Run; Biome for linting and formatting.

## Capabilities

### New Capabilities

- `arch-pattern-lookup`: Architecture pattern matching MCP tool — receives industry, data stack, cloud preference, and constraints; returns a matched reference architecture pattern with components, data zones, integration notes, confidence, and optional diagram_data (components, connections, boundaries structured for the architecture-diagram skill). Includes fallback for weak matches.
- `tool-selection-lookup`: Platform/tool selection MCP tool — receives use case, data stack, constraints, and latency need; returns a recommended platform with cloud fit, reasoning, and alternatives.
- `risk-policy-lookup`: Risk and governance policy MCP tool — receives industry, data classification, region, and deployment model; returns required controls, risk flags, HITL requirement, and review reason.
- `brand-context-lookup`: Brand context enrichment MCP tool — receives a domain; returns company identity (name, tagline, mission, description, tags), positioning (value proposition, target audience, products & services), brand voice/style from the Brandfetch Brand Context API, and company logo from logo.dev. Falls back to cached context or a graceful unavailable response when either source is down.

### Modified Capabilities

_None — this is a new project with no existing specs._

## Impact

- **New code**: MCP server implementation under `src/` (FastMCP, TypeScript, Biome).
- **New data**: YAML frontmatter added to existing markdown reference files under `data/` (industries, vendors, patterns), plus 4 scenario pattern definition files and scraped BigQuery content. No separate policies directory — HIPAA, PII, data-residency, and cross-client governance are tagged via frontmatter on vendor docs and access management/tenant isolation patterns.
- **Agent integration**: Architecture Agent and Risk Checker Agent (defined in the agentflow pipeline project) call the MCP tools during pipeline runs. Agent prompts and the architecture-diagram skill live in the agentflow project — the MCP server is a tool provider, not an agent orchestrator.
- **Deployment**: GCP Cloud Run configuration (Dockerfile, service config).
- **External dependencies**: Brandfetch Brand Context API for `brand_context_lookup` (requires API key via `BRANDFETCH_API_KEY` env var, 100 requests/month free tier) and logo.dev for company logo retrieval. Both use layered caching for demo stability.
- **No breaking changes** — this is a greenfield addition to the repo.
