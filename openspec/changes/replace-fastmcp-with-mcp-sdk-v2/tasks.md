# Tasks: Replace FastMCP with the official MCP TypeScript SDK v2

## 1. Dependencies

- [x] 1.1 Add `@modelcontextprotocol/server` and `@modelcontextprotocol/node`, remove `fastmcp` from `package.json` and install; verify `npm ls @modelcontextprotocol zod` shows the v2 packages and `zod ^4.2+`, shows no `fastmcp`, and `npm run typecheck` still compiles the existing imports

## 2. Tool modules

- [x] 2.1 Convert `src/tools/archPatternLookup.ts` to `server.registerTool("arch_pattern_lookup", { description, inputSchema: z.object({...}) }, handler)` returning `{ content: [{ type: "text", text: JSON.stringify(lookupArchPattern(args)) }] }`; verify it compiles and the stdio smoke check returns the same JSON text as before
- [x] 2.2 Convert `src/tools/toolSelectionLookup.ts` the same way (verify compile + identical JSON text for the demo FSI input)
- [x] 2.3 Convert `src/tools/riskPolicyLookup.ts` the same way (verify compile + identical JSON text for the demo healthcare input)
- [x] 2.4 Convert `src/tools/brandContextLookup.ts` the same way (verify compile + identical JSON text for a resolved-domain sample)

## 3. Server entry point

- [x] 3.1 Add a `createServer()`-style factory that builds a fresh `McpServer({ name: "agentflow-mcp", version: "0.1.0" })` and registers all four tools inside it (no shared instance); verify `npm run typecheck` passes
- [x] 3.2 Wire stdio via `serveStdio(factory)` from `@modelcontextprotocol/server/stdio`, keeping `MCP_TRANSPORT=stdio` as the default; verify the server answers `initialize` and `tools/list` over stdio (MCP Inspector or a v2 client)
- [x] 3.3 Wire HTTP via `createMcpHandler(factory)` + `toNodeHandler` from `@modelcontextprotocol/node`, binding `0.0.0.0:$PORT` (default 8080) at `/mcp` when `MCP_TRANSPORT=http-stream`; verify an HTTP client can list and call all four tools over the endpoint

## 4. Verification

- [x] 4.1 Run `npm run typecheck` and `npm test`; verify all existing tests pass unchanged (tests exercise `lookup*` directly, so no assertions should change)
- [x] 4.2 Stdio smoke check: list the four tools and call each with a representative input; verify each tool's text content is byte-identical to the pre-change `JSON.stringify` output
- [x] 4.3 HTTP smoke check: run `MCP_TRANSPORT=http-stream` and drive the `/mcp` endpoint with the repro client; verify the stateless GET probe is tolerated without the FastMCP 405 workaround and tool results match
- [x] 4.4 Schema baseline: capture the four `tools/list` `inputSchema` payloads; verify they are valid JSON Schema 2020-12 and re-baseline any golden/schema assertions to the new (spec-conformant) shapes

## 5. Documentation

- [x] 5.1 Update `README.md` and `docs/MCP-OVERVIEW.md` to describe the official SDK v2 server (remove FastMCP framing); verify no "FastMCP" references remain in README/docs beyond archived change history

## 6. Monitoring (Graylog) — before deployment

- [x] 6.1 Add Graylog monitoring: forward structured JSON logs (startup, transport, tool-call errors) from the MCP server to Graylog via GELF over HTTP; add the Graylog endpoint as env config (e.g. `GRAYLOG_GELF_URL`); verify logs are searchable in Graylog — end-to-end visibility in the Graylog UI pending `GRAYLOG_GELF_URL` being reachable from the deployed app (port 12201 was not reachable from dev)
