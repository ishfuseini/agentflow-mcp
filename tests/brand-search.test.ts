/**
 * Unit tests for the logo.dev Brand Search client (task 2.1).
 *
 * Uses a tiny loopback HTTP server so the real searchLogoDevBrands code path
 * is exercised without hitting the real API.
 */
import assert from "node:assert/strict";
import { createServer, type Server } from "node:http";
import { after, before, test } from "node:test";
import { searchLogoDevBrands } from "../src/data/logoDevClient.js";
import { lookupBrandSearch } from "../src/tools/brandSearchLookup.js";

const SWEETGREEN = [
  { name: "Sweetgreen", domain: "sweetgreen.com", logo_url: "https://img.logo.dev/sweetgreen.com" },
  {
    name: "Sweet Green",
    domain: "sweetgreen.example",
    logo_url: "https://img.logo.dev/sg.example",
  },
];

let server: Server;
let baseUrl: string;
let lastQuery: URLSearchParams | null;
let payload: unknown = SWEETGREEN;
let httpStatus = 200;

before(async () => {
  server = createServer((req, res) => {
    lastQuery = new URL(req.url ?? "", "http://localhost").searchParams;
    res.statusCode = httpStatus;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(payload));
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  if (!addr || typeof addr === "string") throw new Error("no address");
  baseUrl = `http://127.0.0.1:${addr.port}`;
});

after(async () => {
  delete process.env.LOGO_DEV_SEARCH_API_ENDPOINT;
  delete process.env.LOGO_DEV_SECRET_KEY;
  await new Promise((resolve) => server.close(resolve));
});

test("returns parsed candidates for Sweetgreen with strategy match", async () => {
  process.env.LOGO_DEV_SEARCH_API_ENDPOINT = baseUrl;
  process.env.LOGO_DEV_SECRET_KEY = "test-key";

  const candidates = await searchLogoDevBrands("Sweetgreen", { strategy: "match" });

  assert.ok(candidates);
  assert.equal(candidates.length, 2);
  assert.deepEqual(candidates[0], SWEETGREEN[0]);
  assert.equal(candidates[0].name, "Sweetgreen");
  assert.equal(candidates[0].domain, "sweetgreen.com");
  assert.ok(candidates[0].logo_url.startsWith("https://img.logo.dev/"));
  assert.equal(lastQuery?.get("q"), "Sweetgreen");
  assert.equal(lastQuery?.get("strategy"), "match");
});

test("appends is_profane query parameter when provided", async () => {
  process.env.LOGO_DEV_SEARCH_API_ENDPOINT = baseUrl;
  process.env.LOGO_DEV_SECRET_KEY = "test-key";

  const candidates = await searchLogoDevBrands("swee", { is_profane: false });

  assert.ok(candidates);
  assert.equal(lastQuery?.get("q"), "swee");
  assert.equal(lastQuery?.get("strategy"), "suggest");
  assert.equal(lastQuery?.get("is_profane"), "false");
});

test("drops malformed candidates without failing the whole search", async () => {
  process.env.LOGO_DEV_SEARCH_API_ENDPOINT = baseUrl;
  process.env.LOGO_DEV_SECRET_KEY = "test-key";
  payload = [null, { name: "NoDomain" }, SWEETGREEN[0]];
  try {
    const candidates = await searchLogoDevBrands("Sweetgreen", { strategy: "match" });

    assert.ok(candidates);
    assert.deepEqual(candidates, [SWEETGREEN[0]]);
  } finally {
    payload = SWEETGREEN;
  }
});

test("returns null without making a call when the key is missing", async () => {
  process.env.LOGO_DEV_SEARCH_API_ENDPOINT = baseUrl;
  delete process.env.LOGO_DEV_SECRET_KEY;
  lastQuery = null;

  const candidates = await searchLogoDevBrands("Sweetgreen");

  assert.equal(candidates, null);
  assert.equal(lastQuery, null);
});

// --- tool-level: graceful unavailable handling (task 3.2)

test("tool returns unavailable without throwing when LOGO_DEV_SECRET_KEY is unset", async () => {
  delete process.env.LOGO_DEV_SECRET_KEY;
  lastQuery = null;

  const output = await lookupBrandSearch({ query: "Sweetgreen", strategy: "match" });

  assert.equal(output.available, false);
  assert.deepEqual(output.candidates, []);
  assert.match(output.message ?? "", /LOGO_DEV_SECRET_KEY/);
  assert.equal(lastQuery, null); // no API call attempted
});

test("tool returns unavailable on logo.dev API error (401)", async () => {
  process.env.LOGO_DEV_SEARCH_API_ENDPOINT = baseUrl;
  process.env.LOGO_DEV_SECRET_KEY = "bad-key";
  httpStatus = 401;
  try {
    const output = await lookupBrandSearch({ query: "Sweetgreen" });

    assert.equal(output.available, false);
    assert.deepEqual(output.candidates, []);
    assert.equal(output.strategy, "suggest"); // default strategy
    assert.match(output.message ?? "", /unavailable/);
  } finally {
    httpStatus = 200;
  }
});

test("tool returns empty candidates (available) when nothing matches", async () => {
  process.env.LOGO_DEV_SEARCH_API_ENDPOINT = baseUrl;
  process.env.LOGO_DEV_SECRET_KEY = "test-key";
  payload = [];
  try {
    const output = await lookupBrandSearch({ query: "zz-no-such-brand" });

    assert.equal(output.available, true);
    assert.deepEqual(output.candidates, []);
    assert.equal(output.strategy, "suggest");
  } finally {
    payload = SWEETGREEN;
  }
});

test("tool returns parsed candidates on success", async () => {
  process.env.LOGO_DEV_SEARCH_API_ENDPOINT = baseUrl;
  process.env.LOGO_DEV_SECRET_KEY = "test-key";

  const output = await lookupBrandSearch({ query: "Sweetgreen", strategy: "match" });

  assert.equal(output.available, true);
  assert.equal(output.query, "Sweetgreen");
  assert.equal(output.strategy, "match");
  assert.equal(output.candidates.length, 2);
  assert.equal(output.candidates[0]?.domain, "sweetgreen.com");
});
