## 1. Types

- [x] 1.1 Create `src/types/brand-search.ts` with `BrandSearchInput` (query, strategy?, is_profane?) and `BrandSearchCandidate` (name, domain, logo_url), `BrandSearchOutput` (query, strategy, candidates). Verify: `tsc --noEmit` passes and the types import cleanly.
- [x] 1.2 Create `src/types/arch-diagram.ts` with `ArchDiagramInput` (pattern_id, data_stack?) and `ArchDiagramOutput` (pattern_id, diagram_data). Verify: `tsc --noEmit` passes.
- [x] 1.3 Create `src/types/arch-pattern-references.ts` with `ArchPatternReferencesInput` (pattern_id, industry, data_stack?, cloud?, constraints?) and `ArchPatternReferencesOutput` (pattern_id, source_references). Verify: `tsc --noEmit` passes.
- [x] 1.4 Modify `src/types/brand-context.ts`: drop `BrandPositioning`, `TargetAudienceSegment`, `ProductOrService`, `BrandVoice`, `BrandStyle`, and `BrandIdentityBlock`, and the `positioning`, `brand`, and `logo_url` fields from `BrandContextLookupOutput`. Verify: `tsc --noEmit` passes and no other file references the removed types.
- [x] 1.5 Modify `src/types/arch-pattern.ts`: remove `source_references` and `diagram_data` from `ArchPatternLookupOutput` (move those types to the new arch-diagram/arch-pattern-references type files if not already duplicated). Verify: `tsc --noEmit` passes.

## 2. Data Clients

- [x] 2.1 Repurpose `src/data/logoDevClient.ts` from `/brand/{domain}` to `GET /search?q={name}&strategy={suggest|match}&is_profane={bool}` with Bearer `LOGO_DEV_SECRET_KEY`, returning `BrandSearchCandidate[]`. Verify: a unit test calling the client with a mocked fetch returns parsed candidates for "Sweetgreen" with strategy "match".
- [x] 2.2 Update `src/data/brandfetchClient.ts` to stop returning/forwarding `positioning` and `brand` data (neither field is no longer consumed). Verify: `tsc --noEmit` passes and the client still returns the identity section.
- [x] 2.3 Confirm `src/data/brandCache.ts` tolerates old cache entries (extra fields ignored on read) and stores the new `BrandContextLookupOutput` shape. Verify: a cache read of a pre-existing entry does not throw and a fresh write stores the slimmed shape.

## 3. brand_search Tool

- [x] 3.1 Create `src/tools/brandSearchLookup.ts` exporting `registerBrandSearchLookup(server)` using `logoDevClient` and `BrandSearchInput`/`BrandSearchOutput`. Verify: the tool is registered in `src/index.ts` and `tsc --noEmit` passes.
- [x] 3.2 Add graceful-unavailable handling for missing `LOGO_DEV_SECRET_KEY` and API errors (401/400/unreachable). Verify: a unit test with the env var unset returns an unavailable response without throwing.

## 4. brand_context_lookup Modifications

- [x] 4.1 Remove the `logoDevClient` import and logo.dev call path from `src/tools/brandContextLookup.ts`; remove the `logo_url` field from the response. Verify: `tsc --noEmit` passes and no logo.dev call is made on a lookup.
- [x] 4.2 Remove `positioning` and `brand` (voice/style) from the `brandContextLookup` response mapping. Verify: a unit test asserts the response has no `positioning` or `brand` field.
- [x] 4.3 Update `tests/brand-context.test.ts`: remove logo server mocks, `logo_url` assertions, positioning assertions, and brand voice/style assertions; keep identity (company name, tagline, mission, description, tags) / industry_hint / cache assertions. Verify: `npm test -- brand-context` passes.

## 5. arch_pattern_lookup Modifications

- [x] 5.1 Strip `source_references` and `diagram_data` from the default response in `src/tools/archPatternLookup.ts`. Verify: `tsc --noEmit` passes.
- [x] 5.2 Update `tests/arch-pattern.test.ts` to assert `source_references` and `diagram_data` are absent from the default response, while core fields (pattern_id, architecture_summary, recommended_components, data_zones, integration_notes, confidence) remain present. Verify: `npm test -- arch-pattern` passes.

## 6. arch_diagram Tool

- [x] 6.1 Create `src/tools/archDiagramLookup.ts` exporting `registerArchDiagramLookup(server)` that loads the source pack, finds the `pattern_id`, and returns `diagram_data` (components, connections, boundaries). Verify: the tool is registered in `src/index.ts` and `tsc --noEmit` passes.
- [x] 6.2 Handle unknown `pattern_id` and fallback pattern with graceful unavailable/empty responses. Verify: a unit test for an unknown pattern_id returns an unavailable response without throwing.

## 7. arch_pattern_references Tool

- [x] 7.1 Create `src/tools/archPatternReferencesLookup.ts` exporting `registerArchPatternReferencesLookup(server)` that re-runs scoring with the original ask inputs and returns `source_references` for the matched `pattern_id`. Verify: the tool is registered in `src/index.ts` and `tsc --noEmit` passes.
- [x] 7.2 Handle unknown `pattern_id` and fallback with empty/best-available references. Verify: a unit test for the fallback pattern returns best-available references without throwing.

## 8. Tool Registration

- [x] 8.1 Register `brand_search`, `arch_diagram`, and `arch_pattern_references` in `src/index.ts` `createServer()` alongside the existing tools. Verify: `tsc --noEmit` passes and the server starts without error.

## 9. Tests

- [x] 9.1 Add `tests/brand-search.test.ts` covering exact match, suggest, no matches, missing API key, and API error. Verify: `npm test -- brand-search` passes.
- [x] 9.2 Add `tests/arch-diagram.test.ts` covering a curated pattern, the fallback pattern, and an unknown pattern_id. Verify: `npm test -- arch-diagram` passes.
- [x] 9.3 Add `tests/arch-pattern-references.test.ts` covering a curated pattern, the fallback pattern, and an unknown pattern_id. Verify: `npm test -- arch-pattern-references` passes.
- [x] 9.4 Run the full suite and verify all tests pass: `npm test`.

## 10. Validation

- [x] 10.1 Run `openspec validate make-tools-atomic` and verify it reports no spec/design/task inconsistencies. Verify: command exits 0.
- [x] 10.2 Run `tsc --noEmit` and verify the whole project type-checks. Verify: command exits 0.
- [x] 10.3 Run the server end-to-end and invoke each of the five tools independently (brand_search, brand_context_lookup, arch_pattern_lookup, arch_diagram, arch_pattern_references) to confirm the atomic contracts behave as specified. Verify: each tool returns its specified shape and no removed fields appear.