## Why

The current MCP tools bundle too much into single responses, bloating payloads and coupling unrelated concerns. `brand_context_lookup` mixes logo.dev logo retrieval with Brandfetch positioning and brand voice/style data, and `arch_pattern_lookup` always returns source references and inline `diagram_data` even when the caller only needs the core pattern. Breaking the tools into more atomic units lets agents fetch only what they need, reduces latency on the critical demo path, and makes each tool's contract single-purpose and easier to test. The resulting tools are independent and can be called in any order; there is no required pipeline or sequence.

## What Changes

- **NEW `brand_search` tool** — add an independent tool using the logo.dev Brand Search API (`GET https://api.logo.dev/search?q=<name>`) that resolves a company name to a canonical domain and returns a ready-to-embed logo URL. This replaces the logo.dev brand-profile call inside `brand_context_lookup`.
- **MODIFY `brand_context_lookup`** — remove all logo.dev functionality (the `logoDevClient`, `logo_url` field, and the logo.dev cache layer). Remove `positioning` and `brand` (voice/style) from the output and their types, so the tool returns only the Brandfetch `identity` section (company name, tagline, mission, description, tags) plus a derived industry hint. **BREAKING**: `logo_url`, `positioning`, and `brand` fields are removed from the response schema.
- **MODIFY `arch_pattern_lookup`** — return a basic response that omits `source_references` by default. Keep the core fields (`pattern_id`, `architecture_summary`, `recommended_components`, `data_zones`, `integration_notes`, `confidence`) and remove the inline `diagram_data` from the default response. **BREAKING**: `source_references` and `diagram_data` are removed from the default `arch_pattern_lookup` response.
- **NEW `arch_diagram` tool** — add a separate tool that generates architecture diagram data (`diagram_data`) for an identified pattern and stack, callable after `arch_pattern_lookup` returns a `pattern_id`. This moves diagram generation out of the pattern lookup so the heavy structured-diagram payload is only produced when explicitly requested.
- **NEW `arch_pattern_references` tool** — add a separate tool that returns the source references (`source_references`) for a given `pattern_id`, so references are fetched on demand rather than always included in `arch_pattern_lookup`.

## Capabilities

### New Capabilities

- `brand-search`: Resolve a company name to a canonical domain and logo URL via the logo.dev Brand Search API. Independent of other tools.
- `arch-diagram`: Generate structured `diagram_data` (components, connections, boundaries) for a given architecture pattern and data stack. Independent of other tools.
- `arch-pattern-references`: Return the source pack references for a given pattern match. Independent of other tools.

### Modified Capabilities

- `brand-context-lookup`: Remove logo.dev logo retrieval and the `logo_url` field; remove `positioning` (`BrandPositioning`, `TargetAudienceSegment`, `ProductOrService` types) and `brand` (`BrandVoice`, `BrandStyle`, `BrandIdentityBlock` types) from the output. Tool now returns only the Brandfetch `identity` section (company name, tagline, mission, description, tags) plus a derived industry hint.
- `arch-pattern-lookup`: Return a basic response without `source_references` or inline `diagram_data`. Those are now fetched via the new `arch_pattern_references` and `arch_diagram` tools respectively.

## Impact

- **Code**: `src/tools/brandContextLookup.ts` (remove logo.dev path, positioning, and brand voice/style), `src/data/logoDevClient.ts` (repurpose from brand-profile to brand-search), `src/tools/archPatternLookup.ts` (strip references + diagram_data from default output), `src/index.ts` (register three new tools: `brand_search`, `arch_diagram`, `arch_pattern_references`).
- **Types**: `src/types/brand-context.ts` (drop `BrandPositioning`, `TargetAudienceSegment`, `ProductOrService`, `BrandVoice`, `BrandStyle`, `BrandIdentityBlock`, `logo_url`, `positioning`, `brand` fields), `src/types/arch-pattern.ts` (remove `source_references`/`diagram_data` from default output type), new types for `brand-search`, `arch-diagram`, `arch-pattern-references`.
- **Cache**: `src/data/brandCache.ts` cache shape changes (no `logo_url`/`positioning`/`brand` stored); `logoDevClient.ts` endpoint changes from `/brand/{domain}` to `/search?q={name}`.
- **Tests**: `tests/brand-context.test.ts` (remove logo server + logo_url assertions, remove positioning and brand voice/style assertions), `tests/arch-pattern.test.ts` (assert references/diagram_data absent by default), new tests for `brand_search`, `arch_diagram`, `arch_pattern_references`.
- **APIs**: Depends on logo.dev Brand Search API (`GET https://api.logo.dev/search`) — requires `LOGO_DEV_SECRET_KEY`, works on the free plan. Brandfetch dependency remains for `brand_context_lookup` identity data only.
- **Breaking**: Agents relying on `positioning`, `brand` voice/style, `logo_url`, `source_references`, or inline `diagram_data` from existing tools must use the new dedicated tools instead. The new and modified tools are independent and can be called in any order.