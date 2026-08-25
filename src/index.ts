/**
 * MCP server entry point (tasks 7.1-7.3).
 *
 * Registers all four tools. Transport is selected via MCP_TRANSPORT:
 * "stdio" (default, for local dev and MCP Inspector) or "http-stream"
 * (for Fly.io, listening on 0.0.0.0:$PORT, default 8080).
 *
 * Input validation is enforced by the official MCP TypeScript SDK v2
 * (@modelcontextprotocol/server): every tool registers a zod Standard Schema
 * (inputSchema), and invalid or missing required fields are rejected with a
 * validation error before the handler runs.
 */
import { createServer as createHttpServer } from "node:http";
import { pathToFileURL } from "node:url";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { logGelf } from "./logging/gelf.js";
import { registerArchDiagramLookup } from "./tools/archDiagramLookup.js";
import { registerArchPatternLookup } from "./tools/archPatternLookup.js";
import { registerArchPatternReferencesLookup } from "./tools/archPatternReferencesLookup.js";
import { registerBrandContextLookup } from "./tools/brandContextLookup.js";
import { registerBrandSearchLookup } from "./tools/brandSearchLookup.js";
import { registerRiskPolicyLookup } from "./tools/riskPolicyLookup.js";
import { registerToolSelectionLookup } from "./tools/toolSelectionLookup.js";

try {
  process.loadEnvFile();
} catch {}

/**
 * Build a fresh McpServer instance with all four tools registered.
 * The stdio and HTTP serving entries call this as their per-connection /
 * per-request factory, so no server state is shared between connections.
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: "agentflow-mcp",
    version: "0.1.0",
  });
  registerArchPatternLookup(server);
  registerArchDiagramLookup(server);
  registerArchPatternReferencesLookup(server);
  registerToolSelectionLookup(server);
  registerRiskPolicyLookup(server);
  registerBrandContextLookup(server);
  registerBrandSearchLookup(server);
  return server;
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const transport = process.env.MCP_TRANSPORT ?? "stdio";

  if (transport === "http-stream") {
    const port = Number(process.env.PORT ?? 8080);
    // createMcpHandler serves a fresh McpServer per request, so the endpoint
    // is natively stateless — required for compatibility with standard MCP
    // clients (their startup "probe" is a GET with no session ID) and suited
    // to scale-to-zero deployments (Fly.io). This subsumes the
    // FastMCP `stateless: true` httpStream workaround.
    const handler = createMcpHandler(createServer);
    const nodeHandler = toNodeHandler(handler);
    const httpServer = createHttpServer((req, res) => {
      nodeHandler(req, res);
    });
    httpServer.on("error", (err) => {
      const message = err instanceof Error ? err.message : String(err);
      const stack = err instanceof Error ? (err.stack ?? err.message) : String(err);
      console.error("http server error:", err);
      logGelf({
        shortMessage: "http server error",
        level: "error",
        fullMessage: stack,
        fields: { transport: "http-stream", error: message },
      });
    });
    httpServer.listen(port, "0.0.0.0", () => {
      console.error(`agentflow-mcp listening on http://0.0.0.0:${port}/mcp`);
      logGelf({
        shortMessage: "agentflow-mcp started",
        level: "info",
        fields: { transport: "http-stream", port },
      });
    });
  } else {
    logGelf({
      shortMessage: "agentflow-mcp started",
      level: "info",
      fields: { transport: "stdio" },
    });
    serveStdio(createServer);
  }
}
