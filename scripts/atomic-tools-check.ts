/**
 * End-to-end check for the five atomic tools (task 10.3).
 *
 * Spawns the dev server over stdio with an MCP SDK client, lists tools,
 * invokes each of brand_search, brand_context_lookup, arch_pattern_lookup,
 * arch_diagram, and arch_pattern_references, and asserts the atomic contracts:
 * correct shapes, and no removed fields (logo_url / positioning / brand /
 * source_references / diagram_data) anywhere they don't belong.
 *
 * Usage: node --import tsx scripts/atomic-tools-check.ts
 * Without API keys, brand_search / brand_context_lookup return graceful
 * unavailable responses — still contract-valid.
 */
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

try {
  process.loadEnvFile();
} catch {}

const EXPECTED = [
  "brand_search",
  "brand_context_lookup",
  "arch_pattern_lookup",
  "arch_diagram",
  "arch_pattern_references",
];

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["--import", "tsx", "src/index.ts"],
});
const client = new Client({ name: "atomic-tools-check", version: "0.1.0" });
await client.connect(transport);

const { tools } = await client.listTools();
const listed = tools.map((t) => t.name);
console.log("listed tools:", listed.join(", "));
for (const name of EXPECTED) {
  assert.ok(listed.includes(name), `FAIL: ${name} not listed`);
}

type Json = Record<string, unknown>;
const call = async (name: string, args: Record<string, unknown>): Promise<Json> => {
  const res = await client.callTool({ name, arguments: args });
  assert.ok(!res.isError, `FAIL: ${name} returned a tool error`);
  return JSON.parse((res.content as Array<{ text: string }>)[0]?.text ?? "{}") as Json;
};

// brand_search (graceful unavailable without LOGO_DEV_SECRET_KEY is fine)
const brandSearch = await call("brand_search", { query: "Sweetgreen", strategy: "match" });
assert.equal(brandSearch.query, "Sweetgreen");
assert.equal(brandSearch.strategy, "match");
assert.ok(Array.isArray(brandSearch.candidates));
assert.equal(typeof brandSearch.available, "boolean");
console.log(
  `PASS brand_search — available=${String(brandSearch.available)} candidates=${(brandSearch.candidates as unknown[]).length}`,
);

// brand_context_lookup — identity only, no removed fields
const brandContext = await call("brand_context_lookup", { domain: "havas.com" });
assert.equal(brandContext.domain, "havas.com");
assert.equal(typeof brandContext.available, "boolean");
assert.ok(!("logo_url" in brandContext), "FAIL: logo_url present");
assert.ok(!("positioning" in brandContext), "FAIL: positioning present");
assert.ok(!("brand" in brandContext), "FAIL: brand present");
console.log(`PASS brand_context_lookup — available=${String(brandContext.available)}, no removed fields`);

// arch_pattern_lookup — core fields only
const pattern = await call("arch_pattern_lookup", {
  industry: "media_agency",
  data_stack: ["BigQuery", "Snowflake"],
  cloud: "GCP",
  constraints: ["SAML SSO", "EU data residency", "cross-client governance"],
});
assert.equal(pattern.pattern_id, "media_agency_audience_measurement");
assert.ok((pattern.confidence as number) >= 0.85);
assert.ok(!("source_references" in pattern), "FAIL: source_references present");
assert.ok(!("diagram_data" in pattern), "FAIL: diagram_data present");
console.log(
  `PASS arch_pattern_lookup — ${String(pattern.pattern_id)} conf=${String(pattern.confidence)}, core fields only`,
);

// arch_diagram — full diagram_data for the matched pattern
const diagram = await call("arch_diagram", {
  pattern_id: pattern.pattern_id,
  data_stack: ["BigQuery", "Snowflake"],
});
assert.equal(diagram.available, true);
const dd = diagram.diagram_data as {
  components: unknown[];
  connections: unknown[];
  boundaries: unknown[];
};
assert.ok(dd.components.length > 0 && dd.connections.length > 0 && dd.boundaries.length > 0);
console.log(
  `PASS arch_diagram — ${dd.components.length} components, ${dd.connections.length} connections, ${dd.boundaries.length} boundaries`,
);

// arch_pattern_references — citations for the matched pattern
const refs = await call("arch_pattern_references", {
  pattern_id: pattern.pattern_id,
  industry: "media_agency",
  data_stack: ["BigQuery", "Snowflake"],
  cloud: "GCP",
  constraints: ["SAML SSO", "EU data residency", "cross-client governance"],
});
assert.equal(refs.available, true);
assert.ok((refs.source_references as unknown[]).length > 0);
console.log(
  `PASS arch_pattern_references — ${(refs.source_references as unknown[]).length} references`,
);

await client.close();
console.log("\nAll five atomic tools behave as specified.");
