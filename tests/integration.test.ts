/**
 * Integration tests (tasks 8.5, 8.6).
 *
 * 8.5: all four demo scenarios produce a valid architecture pattern (curated
 *      or fallback) when run through arch_pattern_lookup.
 * 8.6: every tool response conforms to its declared JSON schema — required
 *      fields present with correct types.
 */
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { lookupArchPattern } from "../src/tools/archPatternLookup.js";
import { lookupBrandContext } from "../src/tools/brandContextLookup.js";
import { lookupRiskPolicy } from "../src/tools/riskPolicyLookup.js";
import { lookupToolSelection } from "../src/tools/toolSelectionLookup.js";
import type { ArchPatternLookupInput } from "../src/types/arch-pattern.js";

const DEMO_SCENARIOS: Record<string, ArchPatternLookupInput> = {
  Agency: {
    industry: "media_agency",
    data_stack: ["BigQuery", "Snowflake"],
    cloud: "GCP",
    constraints: ["SAML SSO", "EU data residency", "cross-client governance"],
  },
  Healthcare: {
    industry: "healthcare",
    data_stack: ["Databricks"],
    constraints: ["HIPAA", "PHI", "US data residency"],
  },
  Retail: {
    industry: "retail",
    data_stack: ["Databricks", "Snowflake"],
    constraints: ["real-time personalization"],
  },
  "FSI Governance": {
    industry: "financial_services",
    data_stack: ["Snowflake"],
    constraints: ["PII", "regulated financial data", "audit logs"],
  },
};

// --- 8.5: every demo scenario produces a valid pattern
test("8.5 all four demo scenarios return a valid architecture pattern", () => {
  for (const [name, input] of Object.entries(DEMO_SCENARIOS)) {
    const out = lookupArchPattern(input);
    assert.ok(
      typeof out.pattern_id === "string" && out.pattern_id.length > 0,
      `${name}: pattern_id`,
    );
    assert.ok(out.confidence >= 0 && out.confidence <= 1, `${name}: confidence range`);
  }
});

test("8.5 curated scenarios match their canonical pattern_id", () => {
  const expected: Record<string, string> = {
    Agency: "media_agency_audience_measurement",
    Healthcare: "healthcare_patient_insights",
    Retail: "retail_lakehouse_personalization",
    "FSI Governance": "fsi_governance_copilot",
  };
  for (const [name, input] of Object.entries(DEMO_SCENARIOS)) {
    const out = lookupArchPattern(input);
    assert.equal(out.pattern_id, expected[name], `${name} pattern_id`);
  }
});

// --- 8.6: JSON schema compliance for all tool responses

const isStr = (v: unknown): v is string => typeof v === "string";
const isStrArr = (v: unknown): v is string[] =>
  Array.isArray(v) && v.every((x) => typeof x === "string");
const isNum = (v: unknown): v is number => typeof v === "number";

test("8.6 arch_pattern_lookup response schema compliance", () => {
  const agency = DEMO_SCENARIOS.Agency;
  assert.ok(agency, "Agency scenario defined");
  const out = lookupArchPattern(agency);
  assert.ok(isStr(out.pattern_id));
  assert.ok(isStr(out.architecture_summary));
  assert.ok(isStrArr(out.recommended_components));
  assert.ok(isStrArr(out.data_zones));
  assert.ok(isStrArr(out.integration_notes));
  assert.ok(isNum(out.confidence));
  assert.ok(out.confidence >= 0 && out.confidence <= 1);
});

test("8.6 tool_selection_lookup response schema compliance", () => {
  const out = lookupToolSelection({
    use_case: "AI-powered patient insights",
    data_stack: ["Databricks"],
    constraints: ["HIPAA", "PHI"],
    latency: "batch",
  });
  assert.ok(isStr(out.recommended_platform));
  assert.ok(isStr(out.cloud_fit));
  assert.ok(isStrArr(out.reasoning) && out.reasoning.length > 0);
  assert.ok(isStrArr(out.alternatives) && out.alternatives.length >= 1);
});

test("8.6 risk_policy_lookup response schema compliance", () => {
  const out = lookupRiskPolicy({
    industry: "healthcare",
    data_classification: ["PHI", "PII"],
    region: "US",
    deployment: "cloud",
  });
  assert.ok(isStrArr(out.required_controls) && out.required_controls.length > 0);
  assert.ok(isStrArr(out.risk_flags));
  assert.equal(typeof out.hitl_required, "boolean");
  assert.ok(out.hitl_required ? isStr(out.review_reason) : true);
});

test("8.6 brand_context_lookup unavailable response schema compliance", async () => {
  // No BRANDFETCH_API_KEY and uncached domain → graceful unavailable.
  const dir = mkdtempSync(join(tmpdir(), "brand-int-"));
  const savedKey = process.env.BRANDFETCH_API_KEY;
  const savedDir = process.env.BRAND_CACHE_DIR;
  delete process.env.BRANDFETCH_API_KEY;
  process.env.BRAND_CACHE_DIR = dir;

  const out = await lookupBrandContext({ domain: "schema-test-unavailable.com" });

  process.env.BRANDFETCH_API_KEY = savedKey;
  process.env.BRAND_CACHE_DIR = savedDir;
  rmSync(dir, { recursive: true, force: true });

  assert.equal(out.available, false);
  assert.equal(out.company_name, null);
  assert.ok(isStr(out.domain));
  assert.ok(isStr(out.industry_hint));
  assert.ok(isStrArr(out.tags));
  // removed fields must be absent, not null (atomic contract)
  assert.ok(!("positioning" in out));
  assert.ok(!("brand" in out));
  assert.ok(!("logo_url" in out));
  assert.ok(isNum(out.confidence));
  assert.equal(out.confidence, 0);
  assert.ok(isStr(out.message));
});
