# Replace FastMCP with the official MCP TypeScript SDK v2

## Why

The server is built on FastMCP v4 (`fastmcp`), a third-party wrapper over the v1 MCP TypeScript SDK (`@modelcontextprotocol/sdk` 1.x). FastMCP cannot serve the modern 2026-07-28 protocol revision, and as a wrapper it lags first-party support. The official MCP TypeScript SDK v2 (`@modelcontextprotocol/server`, `client`, `core`, `node`) is the first-party implementation of the 2026-07-28 spec, is actively maintained, and ships an official migration path. Replace the FastMCP server implementation with the official SDK v2 while preserving tool behavior exactly.

## What Changes

- Replace the FastMCP server object with the official v2 server:
  - `new FastMCP({ name, version })` → `new McpServer({ name, version })` from `@modelcontextprotocol/server`
  - `server.addTool({ name, description, parameters, execute })` → `server.registerTool(name, { description, inputSchema }, handler)` with `inputSchema: z.object({ ... })` (Standard Schema; zod ^4.2+)
  - Tool handlers now return `{ content: [{ type: "text", text }] }` instead of a raw JSON string. FastMCP wrapped string returns into a single text content block, so the wire-visible tool result is unchanged.
- Replace the transport wiring in `src/index.ts`:
  - stdio: `server.start({ transportType: "stdio" })` → `serveStdio(factory)` from `@modelcontextprotocol/server/stdio`
  - HTTP (Streamable HTTP): `server.start({ transportType: "httpStream", httpStream: { port, host, stateless } })` → `createMcpHandler(factory)` from `@modelcontextprotocol/server` + `toNodeHandler(handler)` from `@modelcontextprotocol/node`. The v2 handler is natively stateless (one fresh server instance per request), preserving the current stateless serving requirement without the 405-probe workaround.
- Dependencies (`package.json`):
  - Remove `fastmcp` (runtime dependency)
  - Add `@modelcontextprotocol/server` and `@modelcontextprotocol/node` (runtime)
  - Keep `zod ^4.4.3` (v2 requires zod ^4.2.0; already satisfied)
  - Keep the v1 `@modelcontextprotocol/sdk` as a **devDependency** only — the two dev/check scripts (`scripts/mcp-list-check.ts`, `scripts/repro-mcp-client.mjs`) still import the v1 client. Their behavior is out of scope.
- Docs: `README.md` and `docs/MCP-OVERVIEW.md` reference "FastMCP"; update them to describe the official SDK v2 server. No **BREAKING** changes — the four tools (`arch_pattern_lookup`, `tool_selection_lookup`, `risk_policy_lookup`, `brand_context_lookup`) keep their names, JSON input schemas, and response payloads.

## Capabilities

None — this is a pure implementation refactor, declared with `skip_specs: true` in `.openspec.yaml`.

### New Capabilities

None. No new spec-level capability is introduced; gaining the 2026-07-28 protocol revision is a property of the SDK swap itself, not a change to any tool requirement.

### Modified Capabilities

None. The existing capabilities (`arch-pattern-lookup`, `brand-context-lookup`, `risk-policy-lookup`, `tool-selection-lookup`) describe tool-level behavior (lookup semantics, schemas, responses) — none of that changes. No requirement delta is needed, and none is invented.

## Impact

- **Code**: `src/index.ts` (server construction + transport selection), `src/tools/archPatternLookup.ts`, `src/tools/brandContextLookup.ts`, `src/tools/riskPolicyLookup.ts`, `src/tools/toolSelectionLookup.ts` (registration API + handler return shape)
- **Dependencies**: `package.json`, `package-lock.json` (remove `fastmcp`; add `@modelcontextprotocol/server`, `@modelcontextprotocol/node`)
- **Transports**: stdio and Streamable HTTP both preserved; stateless per-request HTTP serving retained
- **Deployment**: no change — Fly.io still serves the same `/mcp` HTTP endpoint; the Dockerfile stays (Fly.io auto-uses it), and the unused GCP deployment configs (Cloud Run / App Engine) were removed
- **Tests**: unchanged (they exercise the exported `lookup*` functions directly); a v2-server smoke check (list + call a tool over stdio/HTTP) is added
- **Docs**: `README.md`, `docs/MCP-OVERVIEW.md`, and archived change references to FastMCP
