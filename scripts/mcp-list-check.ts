/**
 * Verifies tools are discoverable via MCP tool listing (task 3.7 et al).
 * Spawns the dev server over stdio with an MCP SDK client, lists tools,
 * and exercises each registered tool once.
 *
 * Usage: node --import tsx scripts/mcp-list-check.ts [tool-name ...]
 * With no args, asserts all expected tools are listed and calls each one.
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const EXPECTED_TOOLS = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["arch_pattern_lookup", "tool_selection_lookup", "risk_policy_lookup", "brand_context_lookup"];

const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["--import", "tsx", "src/index.ts"],
});
const client = new Client({ name: "listing-check", version: "0.0.0" });
await client.connect(transport);

const { tools } = await client.listTools();
const listed = tools.map((t) => t.name);
console.log("listed tools:", listed.join(", "));

let fail = 0;
for (const name of EXPECTED_TOOLS) {
  if (!listed.includes(name)) {
    console.log(`FAIL: ${name} not listed`);
    fail++;
  }
}

if (listed.includes("arch_pattern_lookup")) {
  const res = await client.callTool({
    name: "arch_pattern_lookup",
    arguments: {
      industry: "media_agency",
      data_stack: ["BigQuery", "Snowflake"],
      cloud: "GCP",
      constraints: ["SAML SSO", "EU data residency", "cross-client governance"],
    },
  });
  const out = JSON.parse((res.content as Array<{ text: string }>)[0].text);
  const ok = out.pattern_id === "media_agency_audience_measurement" && out.confidence >= 0.85;
  console.log(
    `${ok ? "PASS" : "FAIL"} callTool arch_pattern_lookup: ${out.pattern_id} conf=${out.confidence}`,
  );
  if (!ok) fail++;
}

if (listed.includes("tool_selection_lookup")) {
  const res = await client.callTool({
    name: "tool_selection_lookup",
    arguments: {
      use_case: "AI-powered patient insights",
      data_stack: ["Databricks"],
      constraints: ["HIPAA", "PHI", "US data residency"],
      latency: "batch",
    },
  });
  const out = JSON.parse((res.content as Array<{ text: string }>)[0].text);
  const ok =
    out.recommended_platform === "Databricks" &&
    out.cloud_fit === "Azure or AWS" &&
    Array.isArray(out.alternatives) &&
    out.alternatives.length >= 1 &&
    Array.isArray(out.reasoning) &&
    out.reasoning.some((r: string) => /hipaa/i.test(r)) &&
    out.reasoning.some((r: string) => /phi/i.test(r));
  console.log(
    `${ok ? "PASS" : "FAIL"} callTool tool_selection_lookup: ${out.recommended_platform} (${out.cloud_fit})`,
  );
  if (!ok) fail++;
}

if (listed.includes("risk_policy_lookup")) {
  const res = await client.callTool({
    name: "risk_policy_lookup",
    arguments: {
      industry: "healthcare",
      data_classification: ["PHI", "PII"],
      region: "US",
      deployment: "cloud",
    },
  });
  const out = JSON.parse((res.content as Array<{ text: string }>)[0].text);
  const need = ["RBAC", "audit logs", "data lineage", "SAML SSO"];
  const ok =
    need.every((c) => out.required_controls.includes(c)) &&
    out.hitl_required === true &&
    typeof out.review_reason === "string" &&
    out.review_reason.length > 0;
  console.log(
    `${ok ? "PASS" : "FAIL"} callTool risk_policy_lookup: hitl=${out.hitl_required} controls=${out.required_controls.length}`,
  );
  if (!ok) fail++;
}

if (listed.includes("brand_context_lookup")) {
  // brandfetch.com is free on Brandfetch and does not consume quota.
  const res = await client.callTool({
    name: "brand_context_lookup",
    arguments: { domain: "brandfetch.com" },
  });
  const out = JSON.parse((res.content as Array<{ text: string }>)[0].text);
  const ok =
    typeof out.available === "boolean" &&
    typeof out.domain === "string" &&
    typeof out.industry_hint === "string" &&
    typeof out.confidence === "number" &&
    Array.isArray(out.tags) &&
    (out.available === false ? typeof out.message === "string" : out.company_name !== null);
  console.log(
    `${ok ? "PASS" : "FAIL"} callTool brand_context_lookup: available=${out.available} name=${out.company_name} cached=${out.cached}`,
  );
  if (!ok) fail++;
}

await client.close();
process.exit(fail ? 1 : 0);
