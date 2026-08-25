/**
 * Unit tests for arch_pattern_references (tasks 7.2, 9.3): curated pattern
 * cites its own entry plus ranked informing sources; the fallback pattern
 * returns best-available references; unknown pattern ids return graceful
 * unavailable without throwing.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { FALLBACK_PATTERN } from "../src/tools/archPatternLookup.js";
import { lookupArchPatternReferences } from "../src/tools/archPatternReferencesLookup.js";
import type { ArchPatternReferencesInput } from "../src/types/arch-pattern-references.js";

const agencyAsk = {
  industry: "media_agency",
  data_stack: ["BigQuery", "Snowflake"],
  cloud: "GCP",
  constraints: ["SAML SSO", "EU data residency", "cross-client governance"],
};

const assertRefShape = (refs: { path: string; title: string; source_url: string }[]) => {
  for (const r of refs) {
    assert.equal(typeof r.path, "string");
    assert.ok(r.path.length > 0);
    assert.equal(typeof r.title, "string");
    assert.equal(typeof r.source_url, "string");
  }
};

test("curated pattern cites its own entry first plus informing sources", () => {
  const input: ArchPatternReferencesInput = {
    pattern_id: "media_agency_audience_measurement",
    ...agencyAsk,
  };
  const out = lookupArchPatternReferences(input);

  assert.equal(out.available, true);
  assert.equal(out.pattern_id, "media_agency_audience_measurement");
  assert.ok(out.source_references.length > 0);
  // the matched pattern's own source pack entry leads the citations
  assert.ok(out.source_references[0]?.path.includes("media-agency-audience-measurement"));
  assertRefShape(out.source_references);
});

test("fallback pattern returns best-available references without throwing", () => {
  const input: ArchPatternReferencesInput = {
    pattern_id: FALLBACK_PATTERN.pattern_id,
    ...agencyAsk,
  };
  const out = lookupArchPatternReferences(input);

  assert.equal(out.available, true);
  assert.equal(out.pattern_id, FALLBACK_PATTERN.pattern_id);
  // best-available: sources that informed the ask, none of them the fallback itself
  assert.ok(out.source_references.length > 0);
  assertRefShape(out.source_references);
});

test("unknown pattern_id returns graceful unavailable with empty references", () => {
  const out = lookupArchPatternReferences({ pattern_id: "does_not_exist", ...agencyAsk });

  assert.equal(out.available, false);
  assert.deepEqual(out.source_references, []);
  assert.match(out.message ?? "", /not a curated pattern/);
});

test("empty pattern_id returns graceful unavailable", () => {
  const out = lookupArchPatternReferences({ pattern_id: "  ", ...agencyAsk });

  assert.equal(out.available, false);
  assert.deepEqual(out.source_references, []);
  assert.ok(out.message);
});
