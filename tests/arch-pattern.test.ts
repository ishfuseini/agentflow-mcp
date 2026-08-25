/**
 * Unit tests for arch_pattern_lookup (task 8.1): all four demo scenarios
 * plus the unknown-industry fallback.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { lookupArchPattern } from "../src/tools/archPatternLookup.js";
import type { ArchPatternLookupInput } from "../src/types/arch-pattern.js";

const agency: ArchPatternLookupInput = {
  industry: "media_agency",
  data_stack: ["BigQuery", "Snowflake"],
  cloud: "GCP",
  constraints: ["SAML SSO", "EU data residency", "cross-client governance"],
};

const healthcare: ArchPatternLookupInput = {
  industry: "healthcare",
  data_stack: ["Databricks"],
  constraints: ["HIPAA", "PHI", "US data residency"],
};

const retail: ArchPatternLookupInput = {
  industry: "retail",
  data_stack: ["Databricks", "Snowflake"],
  constraints: ["real-time personalization"],
};

const fsi: ArchPatternLookupInput = {
  industry: "financial_services",
  data_stack: ["Snowflake"],
  constraints: ["PII", "regulated financial data", "audit logs"],
};

test("agency scenario matches media_agency_audience_measurement", () => {
  const out = lookupArchPattern(agency);
  assert.equal(out.pattern_id, "media_agency_audience_measurement");
  assert.ok(out.confidence >= 0.85, `confidence ${out.confidence}`);
  for (const c of ["BigQuery", "Snowflake", "SAML SSO"]) {
    assert.ok(
      out.recommended_components.some((x) => x.toLowerCase().includes(c.toLowerCase())),
      `component ${c}`,
    );
  }
  // EU region appears in a component name or integration note
  assert.ok(
    [...out.recommended_components, ...out.integration_notes].some((x) => /eu/i.test(x)),
    "EU region referenced",
  );
  assert.ok(out.data_zones.includes("bronze"));
  assert.ok(out.integration_notes.some((n) => /tenant/i.test(n)));
  // diagram data moved to the arch_diagram tool — absent here by default
  assert.ok(!("diagram_data" in out));
});

test("healthcare scenario matches healthcare_patient_insights", () => {
  const out = lookupArchPattern(healthcare);
  assert.equal(out.pattern_id, "healthcare_patient_insights");
  assert.ok(out.recommended_components.some((c) => /databricks/i.test(c)));
  assert.ok(out.integration_notes.some((n) => /phi|baa|hipaa/i.test(n)));
});

test("retail scenario matches retail_lakehouse_personalization", () => {
  const out = lookupArchPattern(retail);
  assert.equal(out.pattern_id, "retail_lakehouse_personalization");
  assert.ok(out.integration_notes.some((n) => /personaliz/i.test(n)));
});

test("fsi scenario matches fsi_governance_copilot", () => {
  const out = lookupArchPattern(fsi);
  assert.equal(out.pattern_id, "fsi_governance_copilot");
  assert.ok(out.integration_notes.some((n) => /audit/i.test(n)));
});

test("unknown industry falls back with low confidence and no diagram", () => {
  const out = lookupArchPattern({
    industry: "aerospace",
    data_stack: ["Hadoop"],
    constraints: ["quantum encryption"],
  });
  assert.ok(out.confidence < 0.5, `confidence ${out.confidence}`);
  assert.ok(out.pattern_id.length > 0);
  assert.ok(!("diagram_data" in out));
  assert.ok(!("source_references" in out));
  assert.equal(typeof out.architecture_summary, "string");
});

test("every response includes required schema fields", () => {
  for (const input of [
    agency,
    healthcare,
    retail,
    fsi,
    { industry: "aerospace", data_stack: ["Hadoop"], constraints: ["quantum"] },
  ]) {
    const out = lookupArchPattern(input as ArchPatternLookupInput);
    assert.equal(typeof out.pattern_id, "string");
    assert.equal(typeof out.architecture_summary, "string");
    assert.ok(Array.isArray(out.recommended_components));
    assert.ok(Array.isArray(out.data_zones));
    assert.ok(Array.isArray(out.integration_notes));
    assert.ok(out.confidence >= 0 && out.confidence <= 1);
    // source_references and diagram_data moved to dedicated tools
    assert.ok(!("source_references" in out));
    assert.ok(!("diagram_data" in out));
  }
});

test("curated matches omit source_references and diagram_data by default", () => {
  const out = lookupArchPattern(agency);
  assert.ok(out.confidence >= 0.85);
  assert.ok(!("source_references" in out));
  assert.ok(!("diagram_data" in out));
});
