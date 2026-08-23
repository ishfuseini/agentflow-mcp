# Design: Replace FastMCP with the official MCP TypeScript SDK v2

## Context

The server is a single-process TypeScript app (`src/index.ts` + four tool modules in `src/tools/`). It currently constructs a `FastMCP` instance and starts either a stdio or a stateless Streamable HTTP transport (`MCP_TRANSPORT` env var, default `stdio`; HTTP binds `0.0.0.0:$PORT` and serves `/mcp`). See proposal.md — Why for motivation.

Constraints that shape this design:

- Node.js >= 20, ESM, TypeScript, `zod ^4.4.3` (already satisfies v2's zod ^4.2.0 requirement).
- The four tools expose no resources, prompts, auth, or middleware — the FastMCP surface used is thin (construction + `addTool` + `start`).
- All tests exercise the exported `lookup*` functions directly; nothing tests the MCP wire layer today except two standalone dev scripts that use the v1 SDK **client**.
- Deployment is Node on Fly.io behind managed ingress; the HTTP transport must remain stateless.

## Goals / Non-Goals

**Goals:**

- Serve the 2026-07-28 protocol revision via the official v2 SDK (`@modelcontextprotocol/server`, `@modelcontextprotocol/node`).
- Preserve tool behavior byte-for-byte at the consumer level: same tool names, same JSON input schemas, same JSON text content in tool results, same stdio + Streamable HTTP transports, same stateless HTTP semantics, same `MCP_TRANSPORT` switch.
- Keep the change a pure implementation refactor (no spec deltas, no requirement changes).

**Non-Goals:**

- Migrating the two dev/check scripts (`scripts/mcp-list-check.ts`, `scripts/repro-mcp-client.mjs`) from the v1 SDK client to the v2 client. They stay standalone on the v1 package (kept as a devDependency); migrating them is a separate change.
- Adding auth, host/origin validation, resources, prompts, or any new MCP capability. Parity with current behavior only — the deployed transport already sits behind Fly ingress.
- Re-platforming the transport (no Express/Fastify/Hono adoption; no web-standard runtime switch).

## Decisions

### 1. Use the official v2 packages rather than another wrapper

Adopt `@modelcontextprotocol/server` (server impl), `@modelcontextprotocol/server/stdio` (stdio), and `@modelcontextprotocol/node` (`toNodeHandler` for the Node HTTP mount). Rationale: first-party implementation of the 2026-07-28 spec, active maintenance, official codemod, and it removes the middleman that caused the spec lag.

- *Alternative considered:* stay on FastMCP — no path to the 2026 spec.
- *Alternative considered:* a different third-party wrapper — recreates the same lag risk.
- *Alternative considered:* use the v1 SDK directly — same protocol ceiling as FastMCP.

### 2. Adopt the v2 registration API and Standard Schema

`server.addTool({ name, description, parameters, execute })` becomes `server.registerTool(name, { description, inputSchema }, handler)` with `inputSchema: z.object({ ... })` (zod v4 implements the Standard Schema spec, including `~standard.jsonSchema` for `.describe()`-preserving conversion). Use the wrapped `z.object()` form, not the deprecated raw-shape overload, and never the unwrapped shape (v2 auto-wrap only exists on the deprecated overloads and zod-3 shapes fail at `tools/list`).

### 3. Tool handlers return `{ content: [...] }`, not a JSON string

FastMCP took the string returned from `execute` and wrapped it in a single `{ type: "text", text }` content block. v2 handlers must return the content array themselves. Keep `execute`'s `JSON.stringify(...)` output as the text of that single block so the consumer-visible result is identical.

### 4. HTTP serving via `createMcpHandler` + `toNodeHandler`, natively stateless

`createMcpHandler(factory)` returns a web-standard `{ fetch, close, ... }`; the factory builds one fresh `McpServer` per request, so the endpoint is stateless by construction — this subsumes FastMCP's `stateless: true` workaround (whose 405-probe rationale is documented in `src/index.ts` and no longer applies; v2 clients tolerate the stateless GET probe natively). Mount with `toNodeHandler` from `@modelcontextprotocol/node` on `0.0.0.0:$PORT`, serving `/mcp`.

- *Alternative considered:* `NodeStreamableHTTPServerTransport` + manual `node:http` wiring — more boilerplate and session-state plumbing we do not need.
- *Alternative considered:* an Express/Hono/Fastify adapter — the project has no web framework; not worth adding one.

### 5. Do not add host/origin validation (behavior parity)

The v2 docs recommend composing `localhostHostValidation`/`localhostOriginValidation` in front of a plain `node:http` mount, but the production endpoint sits behind Fly managed ingress and FastMCP performed no such validation. Adding it would be a behavior change; it is recorded as an explicit non-goal and future hardening.

### 6. Keep the v1 SDK as a devDependency for the dev scripts only

`@modelcontextprotocol/sdk` stays (devDependencies) solely because `scripts/mcp-list-check.ts` and `scripts/repro-mcp-client.mjs` import the v1 client. The v1 and v2 packages coexist under different names, and the scripts are standalone processes — no v1/v2 object flows across the boundary. Removing it would force the scripts' migration into this change.

## Risks / Trade-offs

- **Advertised tool schemas change shape on the wire** — v2 generates JSON Schema 2020-12 `inputSchema` with different `additionalProperties` handling than FastMCP/v1. Consumers that strict-validate `tools/list` need re-baselining (the new shapes are spec-conformant). → Mitigation: capture the advertised schemas in the smoke check; note re-baselining in tasks.
- **Tool result regression** — a handler that returns a content array instead of the exact JSON string (or forgets `content`) changes the consumer-visible result. → Mitigation: smoke test asserts the text content equals the previous `JSON.stringify` output for each tool.
- **Statelessness regressions** — if tools were registered on a shared instance outside the factory, state would leak across requests. → Mitigation: register all four tools inside the `createMcpHandler`/`serveStdio` factory, as the design mandates.
- **v1/v2 boundary** — `instanceof`/nominal types do not cross the v1 and v2 packages. → Mitigation: keep the dev scripts standalone (their own imports); never share SDK objects between v1-imported and v2-imported code.
- **zod version skew** — a nested or stale zod copy could break Standard Schema conversion (v1's `zod ^3.25 || ^4.0` peer is gone; v2 wants ^4.2). → Mitigation: project is already on `zod ^4.4.3`; removing `fastmcp` also removes its transitive v1 SDK. Run `npm ls zod` during apply.

## Migration Plan

1. `npm install @modelcontextprotocol/server @modelcontextprotocol/node`, then `npm uninstall fastmcp`; verify `npm ls zod` and `npm ls @modelcontextprotocol`.
2. Rewrite `src/tools/*.ts`: switch to `registerTool(name, { description, inputSchema }, handler)` with `z.object(...)` and return `{ content: [{ type: "text", text: JSON.stringify(...) }] }`.
3. Rewrite `src/index.ts`: build the server in a factory; stdio via `serveStdio(factory)`; HTTP via `createMcpHandler(factory)` + `toNodeHandler`, preserving the `MCP_TRANSPORT` switch and `/mcp` binding.
4. `npm run typecheck` and `npm test`; run a v2 smoke check (list + call each tool over stdio; call over HTTP via the repro client) and assert tool results match the pre-change text output.
5. Update `README.md` and `docs/MCP-OVERVIEW.md` to describe the official SDK v2 server.
6. Deploy as normal (no config changes). **Rollback**: revert to the previous commit — FastMCP remains in git history; the stateless HTTP endpoint contract is unchanged, so rollback is a simple redeploy.

## Open Questions

- Whether to migrate the two dev/check scripts to the v2 client — deferred as a non-goal; answering it later does not change the approach or task breakdown.
