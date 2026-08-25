## Context

The agentflow-mcp server currently exposes four tools. Two of them bundle unrelated concerns into a single response, bloating payloads on the critical demo path:

- `brand_context_lookup` mixes logo.dev logo retrieval (via `logoDevClient.ts` calling `/brand/{domain}`) with Brandfetch identity, positioning, and brand voice/style data. Callers that only need identity pay the logo.dev latency and payload cost.
- `arch_pattern_lookup` always returns `source_references` and inline `diagram_data` even when the caller only wants the core pattern match.

There is no pipeline order. The resulting tools are independent and can be called in any order; each tool's contract is single-purpose.

See `proposal.md` for the motivation. The current tool registration lives in `src/index.ts` (`createServer()`), with per-tool registration functions in `src/tools/*.ts`. Types are centralized in `src/types/*.ts` and data clients in `src/data/*.ts`. The MCP SDK is `@modelcontextprotocol/server` with `server.registerTool()` + zod input schemas.

## Goals / Non-Goals

**Goals:**
- Decompose the two bundled tools into five single-purpose, composable tools.
- Keep the tools independent with no required call order; each tool can be invoked at any time with its documented inputs.
- Minimize payload on the hot path (pattern match without diagram/references; brand context without positioning/brand voice/logo).
- Preserve existing caching behavior for Brandfetch responses (layered `cachedOnly` + local file cache).
- Keep each tool's contract independently testable.

**Non-Goals:**
- Changing the `risk_policy_lookup` or `brand_context` (the existing brand-context compound name) tools beyond the documented removals.
- Introducing a new orchestration/meta-tool that chains the calls automatically. Agents decide when to call which tool; there is no required sequence.
- Migrating existing callers/consumers. This change is server-side; downstream agent prompts are updated separately.
- Adding new data sources. logo.dev Brand Search and Brandfetch Brand Context are the same providers, re-pointed to different endpoints.

## Decisions

### Decision 1: brand_search uses the logo.dev `/search` endpoint, not `/brand/{domain}`

**Choice:** Repurpose `src/data/logoDevClient.ts` to call `GET https://api.logo.dev/search?q={name}&strategy={suggest|match}&is_profane={bool}` with Bearer `LOGO_DEV_SECRET_KEY`. Return an array of `{name, domain, logo_url}` candidates.

**Rationale:** The `/search` endpoint resolves a company name to a domain and returns a ready-to-embed logo URL in one call. The existing `/brand/{domain}` call assumed the domain was already known and only returned a logo; it did not help with name→domain resolution. `/search` works on the logo.dev free plan. `brand_search` is an independent tool; callers that already know the domain do not need to call it.

**Alternatives considered:**
- *Keep `/brand/{domain}` and ask the caller to supply the domain.* Rejected — the whole point is that callers start from a company name, not a domain. This forces them to guess or hard-code.
- *Use a separate name→domain resolver (e.g., Clearbit).*. Rejected — adds a new dependency and API key. logo.dev `/search` already returns the domain alongside the logo URL.

### Decision 2: brand_context_lookup drops logo.dev, positioning, and brand voice/style, returns identity only

**Choice:** Remove the `logoDevClient` import and `logo_url` field from `brandContextLookup.ts` and `BrandContextLookupOutput`. Remove `positioning` and the `BrandPositioning` / `TargetAudienceSegment` / `ProductOrService` types. Remove `brand` and the `BrandVoice` / `BrandStyle` / `BrandIdentityBlock` types. The tool's input remains a domain string (no company name), matching the existing `domain` input field.

**Rationale:** The tool's job is the Brandfetch `identity` section only (company name, tagline, mission, description, tags) plus a derived industry hint. Logo retrieval, positioning, and brand voice/style were tangential and inflated the response. The tool accepts a domain directly; it does not require a domain resolved by another tool, which makes the contract single-purpose and removes the implicit logo.dev dependency from the Brandfetch path.

**Alternatives considered:**
- *Keep `logo_url` as a passthrough from `brand_search`.* Rejected — `brand_search` is an independent tool; duplicating its output invites staleness.
- *Make positioning a separate tool now.* Rejected — positioning was not used downstream. If it becomes needed, a dedicated tool can be added later (not in scope).
- *Keep `brand` voice/style.* Rejected — brand voice/style was not used downstream and inflated the payload. The tool stays focused on the Brandfetch `identity` section.

### Decision 3: arch_pattern_lookup returns core fields only; diagram_data and source_references become separate tools

**Choice:** Strip `source_references` and `diagram_data` from the default `ArchPatternLookupOutput`. Add `arch_diagram` (takes `pattern_id` + data stack, returns `diagram_data`) and `arch_pattern_references` (takes `pattern_id` + original ask inputs, returns `source_references`).

**Rationale:** The pattern match is the hot path; diagram generation and reference citation are only needed when the agent decides to render or cite. The three architecture tools (`arch_pattern_lookup`, `arch_diagram`, `arch_pattern_references`) are independent peers — each can be called at any time with its documented inputs; none requires another to be called first.

**Alternatives considered:**
- *Add a boolean `include_details` flag to `arch_pattern_lookup`.* Rejected — a flag-laden tool is harder to test and document than two single-purpose tools, and the payload saving only triggers when the flag is off.
- *Keep `diagram_data` inline but drop `source_references` only.* Rejected — `diagram_data` is the heavier payload (components/connections/boundaries); it should be the first thing split out.

### Decision 4: Reuse existing source-pack loading for arch_diagram and arch_pattern_references

**Choice:** Both new tools read the same in-memory source pack that `archPatternLookup.ts` already loads. `arch_diagram` extracts the `diagram_data` block for a `pattern_id`; `arch_pattern_references` re-runs the scoring function to return the references for the matched pattern (or the best-available references for the fallback).

**Rationale:** No new data source or loader. The source pack already contains the diagram and reference metadata per pattern; we are just exposing them through dedicated tools instead of inline.

**Alternatives considered:**
- *Load the source pack lazily per tool call.* Rejected — the pack is already loaded once at server start; duplicating loaders adds complexity without benefit.

### Decision 5: Cache shape change for brandCache is non-breaking internally

**Choice:** `brandCache.ts` stores `BrandContextLookupOutput`. When the output type drops `logo_url`/`positioning`, existing cache entries written by the old shape are tolerated on read (extra fields ignored) and overwritten on the next write. No migration of the cache file is required.

**Rationale:** The cache is a local file with a TTL; stale entries age out. A schema migration step would add complexity for a transient store.

**Alternatives considered:**
- *Version the cache and migrate.* Rejected — over-engineering for a TTL cache.

## Risks / Trade-offs

- **[Breaking response schema] → Mitigation:** Document the removed fields in the spec `REMOVED` sections with explicit `Migration` notes. Downstream agent prompts must be updated to call `brand_search` and the new arch tools; this is an agent-prompt change, not a server rollback concern.
- **[Agents must call multiple tools for a full picture] → Mitigation:** The tools are independent by design; an agent that already knows the domain can call `brand_context_lookup` directly, and an agent that only needs the pattern can call `arch_pattern_lookup` without `arch_diagram` or `arch_pattern_references`. Smaller, focused payloads offset the need to make separate calls.
- **[logo.dev `/search` rate limits on free plan] → Mitigation:** Brand Search is documented as working on the free plan. If rate limits bind, a short local cache for search results (keyed by query+strategy) can be added later; not in scope for this change.
- **[arch_pattern_references must reproduce the match to cite the right references] → Mitigation:** The tool accepts the original ask inputs alongside the `pattern_id` and re-runs scoring; it does not rely on the caller to pass opaque reference data.
- **[Cache entries with old shape] → Mitigation:** Extra fields are ignored on read; entries age out by TTL. No action needed.

## Migration Plan

1. Ship the new tools (`brand_search`, `arch_diagram`, `arch_pattern_references`) alongside the modified existing tools in the same release. The new and modified tools are independent and can be called in any order.
2. Update the agent prompts/skills to call each tool as needed (there is no required call order): `brand_search` (name→domain+logo) and `brand_context_lookup` (identity) for brand context; `arch_pattern_lookup` (pattern match), `arch_diagram` (diagram_data), and `arch_pattern_references` (source references) for architecture context.
3. Remove the old fields from the response schemas (`logo_url`, `positioning`, `brand` from brand context; `source_references`, `diagram_data` from arch pattern lookup).
4. Rollback strategy: revert the release. The local cache will repopulate with the new shape after TTL expiry; no persistent data migration is involved.

## Open Questions

- Should `brand_search` cache results locally to absorb repeat queries for the same company name within a session? Deferrable — the free plan is sufficient for current demo volume; add a cache only if rate limits bind.
- Should `arch_diagram` accept a partial data stack (subset of the original ask) to render a focused diagram? Deferrable — the current contract accepts the full stack; narrowing can be added if agents request it.