/**
 * Reproduction script: connect to the remote MCP server using the official
 * MCP SDK StreamableHTTPClient (the same client most MCP apps use) and print
 * the exact error surfaced during startup/version negotiation.
 *
 * Run: node scripts/repro-mcp-client.mjs
 */
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const url = process.env.MCP_URL ?? "https://arch.ishlab.dev/mcp";

const transport = new StreamableHTTPClientTransport(new URL(url));
const client = new Client({ name: "repro", version: "1.0.0" });

try {
  console.log(`Connecting to ${url} ...`);
  await client.connect(transport);
  console.log("Connected OK");
  const tools = await client.listTools();
  console.log(`listTools OK — ${tools.tools.length} tools:`);
  for (const t of tools.tools) console.log("  -", t.name);
  await client.close();
} catch (err) {
  console.error("\nFAILED:");
  console.error("  name:", err?.name);
  console.error("  message:", err?.message);
  console.error("  code:", err?.code, "status:", err?.status);
  process.exitCode = 1;
}
