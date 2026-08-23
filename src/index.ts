/**
 * MCP server entry point (tasks 7.1-7.3).
 *
 * Registers all four tools. Transport is selected via MCP_TRANSPORT:
 * "stdio" (default, for local dev and MCP Inspector) or "http-stream"
 * (for GCP Cloud Run, listening on 0.0.0.0:$PORT, default 8080).
 *
 * Input validation (task 7.4) is enforced by FastMCP: every tool declares a
 * zod schema, and invalid or missing required fields are rejected with a
 * validation error before execute runs.
 */
import { pathToFileURL } from "node:url";
import { FastMCP } from "fastmcp";
import { registerArchPatternLookup } from "./tools/archPatternLookup.js";
import { registerBrandContextLookup } from "./tools/brandContextLookup.js";
import { registerRiskPolicyLookup } from "./tools/riskPolicyLookup.js";
import { registerToolSelectionLookup } from "./tools/toolSelectionLookup.js";

try {
  process.loadEnvFile();
} catch {}

export function createServer(): FastMCP {
  const server = new FastMCP({
    name: "agentflow-mcp",
    version: "0.1.0",
  });
  registerArchPatternLookup(server);
  registerToolSelectionLookup(server);
  registerRiskPolicyLookup(server);
  registerBrandContextLookup(server);
  return server;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const transport = process.env.MCP_TRANSPORT ?? "stdio";
  const server = createServer();

  if (transport === "http-stream") {
    const port = Number(process.env.PORT ?? 8080);
    await server.start({
      transportType: "httpStream",
      // Stateless mode is REQUIRED for compatibility with standard MCP
      // clients: their startup "probe" is a GET with no session ID, which a
      // stateful mcp-proxy answers with 400 "No sessionId" (a fatal
      // "version negotiation" error). In stateless mode the probe gets 405
      // "Method Not Allowed", which every client explicitly tolerates. It
      // also suits scale-to-zero deployments (Fly/Cloud Run) — no server-side
      // session state to lose when instances spin down.
      httpStream: { port, host: "0.0.0.0", stateless: true },
    });
    console.error(`agentflow-mcp listening on http://0.0.0.0:${port}/mcp`);
  } else {
    await server.start({ transportType: "stdio" });
  }
}
