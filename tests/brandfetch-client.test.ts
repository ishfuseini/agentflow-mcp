/**
 * Unit test for the slimmed brandfetchClient (task 2.2): a response containing
 * only the meta and identity sections parses successfully — positioning and
 * brand sections are no longer required or forwarded.
 */
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { after, before, test } from "node:test";
import { fetchBrandContext } from "../src/data/brandfetchClient.js";

const META_IDENTITY_ONLY = {
  meta: { domain: "demo.com", canonical_name: "Demo Co", resolved_at: "2024-01-01T00:00:00Z" },
  identity: {
    tagline: "Build things",
    mission: "Mission",
    description: "A demo company",
    tags: ["retail"],
  },
  // no positioning, no brand
};

let server: Server;

before(async () => {
  server = createServer((_req, res) => {
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(META_IDENTITY_ONLY));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  if (!addr || typeof addr === "string") throw new Error("no address");
  process.env.BRANDFETCH_BRAND_CONTEXT_ENDPOINT = `http://127.0.0.1:${addr.port}`;
  process.env.BRANDFETCH_API_KEY = "test-key";
});

after(async () => {
  delete process.env.BRANDFETCH_BRAND_CONTEXT_ENDPOINT;
  delete process.env.BRANDFETCH_API_KEY;
  await new Promise((resolve) => server.close(resolve));
});

test("parses a response containing only meta and identity sections", async () => {
  const result = await fetchBrandContext("demo.com");

  assert.equal(result.status, "ok");
  if (result.status !== "ok") return;
  assert.equal(result.context.meta.canonical_name, "Demo Co");
  assert.equal(result.context.identity.tagline, "Build things");
  assert.deepEqual(result.context.identity.tags, ["retail"]);
  assert.ok(!("positioning" in result.context));
  assert.ok(!("brand" in result.context));
});
