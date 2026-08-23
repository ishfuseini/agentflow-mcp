/**
 * Unit tests for tool_selection_lookup (task 8.2): healthcare, media agency,
 * and retail scenarios.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { lookupToolSelection } from "../src/tools/toolSelectionLookup.js";
import type { ToolSelectionLookupInput } from "../src/types/tool-selection.js";

const healthcare: ToolSelectionLookupInput = {
  use_case: "AI-powered patient insights",
  data_stack: ["Databricks"],
  constraints: ["HIPAA", "PHI", "US data residency"],
  latency: "batch",
};

const media: ToolSelectionLookupInput = {
  use_case: "audience measurement and cross-channel campaign reporting",
  data_stack: ["BigQuery", "Snowflake"],
  constraints: ["EU data residency", "cross-client governance"],
  latency: "batch",
};

const retail: ToolSelectionLookupInput = {
  use_case: "real-time personalization engine",
  data_stack: ["Databricks", "Kafka"],
  constraints: ["real-time personalization"],
  latency: "streaming",
};

test("healthcare recommends Databricks on Azure or AWS", () => {
  const out = lookupToolSelection(healthcare);
  assert.equal(out.recommended_platform, "Databricks");
  assert.equal(out.cloud_fit, "Azure or AWS");
  assert.ok(Array.isArray(out.alternatives) && out.alternatives.length >= 1);
  assert.ok(out.reasoning.some((r: string) => /hipaa/i.test(r)));
  assert.ok(out.reasoning.some((r: string) => /phi/i.test(r)));
});

test("media agency recommends BigQuery on GCP with alternatives", () => {
  const out = lookupToolSelection(media);
  assert.equal(out.recommended_platform, "BigQuery");
  assert.equal(out.cloud_fit, "GCP");
  assert.ok(out.alternatives.length >= 1);
  assert.ok(out.reasoning.some((r: string) => /eu data residency/i.test(r)));
});

test("retail recommends Databricks with streaming reasoning", () => {
  const out = lookupToolSelection(retail);
  assert.equal(out.recommended_platform, "Databricks");
  assert.ok(out.reasoning.some((r: string) => /stream/i.test(r)));
  assert.ok(Array.isArray(out.alternatives));
});

test("every response includes required schema fields", () => {
  for (const input of [healthcare, media, retail]) {
    const out = lookupToolSelection(input);
    assert.equal(typeof out.recommended_platform, "string");
    assert.equal(typeof out.cloud_fit, "string");
    assert.ok(Array.isArray(out.reasoning) && out.reasoning.length > 0);
    assert.ok(Array.isArray(out.alternatives) && out.alternatives.length >= 1);
    for (const alt of out.alternatives) {
      assert.equal(typeof alt, "string");
    }
  }
});
