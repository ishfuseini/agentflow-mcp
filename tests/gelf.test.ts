/**
 * Graylog GELF logger tests (task 6.1).
 *
 * Verifies the GELF message shape and that logGelf POSTs a valid GELF 1.1
 * message to the configured GRAYLOG_GELF_URL endpoint (a local HTTP receiver
 * stands in for the Graylog GELF HTTP input).
 */
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test } from "node:test";
import { buildGelf, flushGelf, logGelf } from "../src/logging/gelf.js";

test("buildGelf produces a valid GELF 1.1 message with prefixed custom fields", () => {
  const msg = JSON.parse(
    buildGelf({
      shortMessage: "hello",
      level: "error",
      fields: { tool: "arch_pattern_lookup", duration_ms: 12, ok: false },
    }),
  ) as Record<string, unknown>;
  assert.equal(msg.version, "1.1");
  assert.equal(msg.host, "agentflow-mcp");
  assert.equal(msg.short_message, "hello");
  assert.equal(msg.level, 3); // error
  assert.ok(typeof msg.timestamp === "number");
  assert.equal(msg._tool, "arch_pattern_lookup");
  assert.equal(msg._duration_ms, 12);
  assert.equal(msg._ok, false);
});

test("logGelf POSTs a valid GELF message to the configured endpoint", async () => {
  const received: string[] = [];
  const server = createServer((req, res) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      received.push(body);
      res.writeHead(202, { "Content-Type": "application/json" });
      res.end();
    });
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as { port: number };

  const savedUrl = process.env.GRAYLOG_GELF_URL;
  process.env.GRAYLOG_GELF_URL = `http://127.0.0.1:${port}/gelf`;
  try {
    logGelf({
      shortMessage: "agentflow-mcp started",
      level: "info",
      fields: { transport: "stdio" },
    });
    await flushGelf();

    assert.equal(received.length, 1, "expected one GELF message to be received");
    const msg = JSON.parse(received[0]) as Record<string, unknown>;
    assert.equal(msg.version, "1.1");
    assert.equal(msg.short_message, "agentflow-mcp started");
    assert.equal(msg.level, 6); // info
    assert.equal(msg._transport, "stdio");
  } finally {
    if (savedUrl === undefined) delete process.env.GRAYLOG_GELF_URL;
    else process.env.GRAYLOG_GELF_URL = savedUrl;
    server.close();
  }
});

test("logGelf is a no-op when GRAYLOG_GELF_URL is not set", async () => {
  const savedUrl = process.env.GRAYLOG_GELF_URL;
  delete process.env.GRAYLOG_GELF_URL;
  try {
    // Should not throw and should leave the queue empty.
    logGelf({ shortMessage: "should be dropped", level: "info" });
    await flushGelf();
    assert.ok(true);
  } finally {
    if (savedUrl === undefined) delete process.env.GRAYLOG_GELF_URL;
    else process.env.GRAYLOG_GELF_URL = savedUrl;
  }
});
