/**
 * Post-deploy verification: invoke all five atomic tools against the live
 * server and assert the atomic contracts (correct shapes, no removed fields).
 *
 * Run: node --import tsx scripts/atomic-tools-live-check.ts
 * Defaults to https://arch.ishlab.dev/mcp (override with MCP_URL).
 */
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const url = process.env.MCP_URL ?? "https://arch.ishlab.dev/mcp";
console.log(`Connecting to ${url} ...`);

const transport = new StreamableHTTPClientTransport(new URL(url));
const client = new Client({ name: "atomic-live-check", version: "0.1.0" });
await client.connect(transport);

const { tools } = await client.listTools();
const listed = tools.map((t) => t.name);
console.log("listed tools:", listed.join(", "));
for (const name of [
  "brand_search",
  "brand_context_lookup",
  "arch_pattern_lookup",
  "arch_diagram",
  "arch_pattern_references",
]) {
  assert.ok(listed.includes(name), `FAIL: ${name} not listed`);
}

type Json = Record<string, unknown>;
const call = async (name: string, args: Record<string, unknown>): Promise<Json> => {
  const res = await client.callTool({ name, arguments: args });
  assert.ok(!res.isError, `FAIL: ${name} returned a tool error`);
  return JSON.parse((res.content as Array<{ text: string }>)[0]?.text ?? "{}") as Json;
};

const brandSearch = await call("brand_search", { query: "Sweetgreen", strategy: "match" });
assert.equal(brandSearch.query, "Sweetgreen");
assert.ok(Array.isArray(brandSearch.candidates));
console.log(
  `PASS brand_search — available=${brandSearch.available} candidates=${(brandSearch.candidates as unknown[]).length}` +
    (brandSearch.available
      ? ` first=${(brandSearch.candidates as { domain: string }[])[0]?.domain}`
      : ` (${brandSearch.message})`),
);

const brandContext = await call("brand_context_lookup", { domain: "havas.com" });
assert.ok(
  !("logo_url" in brandContext) && !("positioning" in brandContext) && !("brand" in brandContext),
);
console.log(
  `PASS brand_context_lookup — available=${brandContext.available} name=${brandContext.company_name} hint=${brandContext.industry_hint}, no removed fields`,
);

const pattern = await call("arch_pattern_lookup", {
  industry: "media_agency",
  data_stack: ["BigQuery", "Snowflake"],
  cloud: "GCP",
  constraints: ["SAML SSO", "EU data residency", "cross-client governance"],
});
assert.equal(pattern.pattern_id, "media_agency_audience_measurement");
assert.ok(!("source_references" in pattern) && !("diagram_data" in pattern));
console.log(
  `PASS arch_pattern_lookup — ${pattern.pattern_id} conf=${pattern.confidence}, core fields only`,
);

const diagram = await call("arch_diagram", { pattern_id: pattern.pattern_id });
const dd = diagram.diagram_data as {
  components: unknown[];
  connections: unknown[];
  boundaries: unknown[];
};
assert.equal(diagram.available, true);
console.log(
  `PASS arch_diagram — ${dd.components.length} components, ${dd.connections.length} connections, ${dd.boundaries.length} boundaries`,
);

const refs = await call("arch_pattern_references", {
  pattern_id: pattern.pattern_id,
  industry: "media_agency",
  data_stack: ["BigQuery", "Snowflake"],
  constraints: ["SAML SSO", "EU data residency", "cross-client governance"],
});
assert.equal(refs.available, true);
console.log(
  `PASS arch_pattern_references — ${(refs.source_references as unknown[]).length} references`,
);

await client.close();
console.log("\nAll five atomic tools verified in production.");
