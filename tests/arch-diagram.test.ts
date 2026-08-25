/**
 * Unit tests for arch_diagram (tasks 6.2, 9.2): curated pattern returns full
 * diagram_data; the generic fallback pattern id and unknown pattern ids return
 * graceful unavailable responses without throwing.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { lookupArchDiagram } from "../src/tools/archDiagramLookup.js";
import { FALLBACK_PATTERN } from "../src/tools/archPatternLookup.js";

test("curated pattern returns components, connections, and boundaries", () => {
  const out = lookupArchDiagram({
    pattern_id: "media_agency_audience_measurement",
    data_stack: ["BigQuery", "Snowflake"],
  });

  assert.equal(out.available, true);
  assert.equal(out.pattern_id, "media_agency_audience_measurement");
  const diagram = out.diagram_data;
  assert.ok(diagram);
  assert.ok(diagram.components.length > 0);
  assert.ok(diagram.connections.length > 0);
  assert.ok(diagram.boundaries.length > 0);
  for (const c of diagram.components) {
    assert.equal(typeof c.name, "string");
    assert.equal(typeof c.type, "string");
    assert.equal(typeof c.zone, "string");
  }
  for (const conn of diagram.connections) {
    assert.equal(typeof conn.from, "string");
    assert.equal(typeof conn.to, "string");
  }
});

test("generic fallback pattern id returns graceful unavailable", () => {
  const out = lookupArchDiagram({ pattern_id: FALLBACK_PATTERN.pattern_id });

  assert.equal(out.available, false);
  assert.equal(out.diagram_data, null);
  assert.ok(out.message);
});

test("unknown pattern_id returns graceful unavailable without throwing", () => {
  const out = lookupArchDiagram({ pattern_id: "does_not_exist" });

  assert.equal(out.available, false);
  assert.equal(out.diagram_data, null);
  assert.match(out.message ?? "", /not a curated pattern/);
});

test("empty pattern_id returns graceful unavailable", () => {
  const out = lookupArchDiagram({ pattern_id: "   " });

  assert.equal(out.available, false);
  assert.ok(out.message);
});
