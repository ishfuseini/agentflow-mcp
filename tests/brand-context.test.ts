/**
 * Unit tests for brand_context_lookup: local cache hit, cache miss,
 * cachedOnly mode, Brandfetch-unavailable fallbacks, and the slimmed
 * response contract (identity only — no logo_url, positioning, or brand).
 *
 * Uses a tiny loopback HTTP server so the real fetchBrandContext code path
 * is exercised without hitting the real API.
 */
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { lookupBrandContext } from "../src/tools/brandContextLookup.js";

// --- minimal valid Brandfetch Brand Context response (snake_case), identity only
const RAW = {
  meta: {
    domain: "demo.com",
    canonical_name: "Demo Co: We Build Things",
    resolved_at: "2024-01-01T00:00:00Z",
  },
  identity: {
    tagline: "Build things",
    mission: "Mission",
    description: "A retail commerce and shopping company",
    tags: ["retail", "ecommerce", "consumer goods"],
  },
};

interface MockState {
  brandfetchCalls: { domain: string; cachedOnly: boolean }[];
  cachedDomains: Set<string>;
  brandfetchLiveFail: boolean;
}

let brandfetchServer: Server;
let state: MockState;
const tmpDirs: string[] = [];

const freshCacheDir = (): string => {
  const d = mkdtempSync(join(tmpdir(), "brand-test-"));
  tmpDirs.push(d);
  process.env.BRAND_CACHE_DIR = d;
  return d;
};

before(async () => {
  state = {
    brandfetchCalls: [],
    cachedDomains: new Set(),
    brandfetchLiveFail: false,
  };

  brandfetchServer = createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const match = url.pathname.match(/^\/context\/(.+)$/);
    if (!match) {
      res.writeHead(404);
      res.end();
      return;
    }
    const domain = decodeURIComponent(match[1] ?? "");
    const cachedOnly = url.searchParams.get("cachedOnly") === "true";
    state.brandfetchCalls.push({ domain, cachedOnly });

    if (cachedOnly) {
      if (state.cachedDomains.has(domain)) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ...RAW, meta: { ...RAW.meta, domain } }));
      } else {
        res.writeHead(204);
        res.end();
      }
      return;
    }
    if (state.brandfetchLiveFail) {
      res.writeHead(500);
      res.end();
      return;
    }
    state.cachedDomains.add(domain);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ...RAW, meta: { ...RAW.meta, domain } }));
  });

  await new Promise<void>((r) => brandfetchServer.listen(0, "127.0.0.1", r));

  const bfAddr = brandfetchServer.address();
  process.env.BRANDFETCH_API_KEY = "test-key";
  process.env.BRANDFETCH_BRAND_CONTEXT_ENDPOINT = `http://127.0.0.1:${
    typeof bfAddr === "object" && bfAddr ? bfAddr.port : 0
  }/context`;
});

after(async () => {
  for (const d of tmpDirs) rmSync(d, { recursive: true, force: true });
  delete process.env.BRANDFETCH_API_KEY;
  delete process.env.BRANDFETCH_BRAND_CONTEXT_ENDPOINT;
  await new Promise<void>((r) => brandfetchServer.close(() => r()));
});

const resetState = () => {
  state.brandfetchCalls = [];
  state.cachedDomains.clear();
  state.brandfetchLiveFail = false;
};

/** The response must never carry the removed fields, whatever the source. */
const assertSlimContract = (out: Record<string, unknown>) => {
  assert.ok(!("logo_url" in out), "logo_url must not appear");
  assert.ok(!("positioning" in out), "positioning must not appear");
  assert.ok(!("brand" in out), "brand must not appear");
};

test("cache miss populates local cache and returns identity only", async () => {
  freshCacheDir();
  resetState();
  const out = await lookupBrandContext({ domain: "demo.com" });
  assert.equal(out.available, true);
  assert.equal(out.cached, false);
  assert.equal(out.company_name, "Demo Co");
  assert.equal(out.tagline, "Build things");
  assert.equal(out.mission, "Mission");
  assert.equal(out.description, "A retail commerce and shopping company");
  assert.deepEqual(out.tags, ["retail", "ecommerce", "consumer goods"]);
  assert.equal(out.industry_hint, "retail");
  assert.ok(out.confidence >= 0.8);
  assertSlimContract(out as unknown as Record<string, unknown>);
  // a live call was made (cachedOnly missed first, then live succeeded)
  assert.ok(state.brandfetchCalls.some((c) => !c.cachedOnly));
});

test("local cache hit avoids API calls", async () => {
  freshCacheDir();
  resetState();
  // first call populates
  await lookupBrandContext({ domain: "demo.com" });
  const bfBefore = state.brandfetchCalls.length;
  // second call should be served from cache
  const out = await lookupBrandContext({ domain: "demo.com" });
  assert.equal(out.available, true);
  assert.equal(out.cached, true);
  assert.equal(state.brandfetchCalls.length, bfBefore);
  assertSlimContract(out as unknown as Record<string, unknown>);
});

test("cachedOnly mode returns from Brandfetch cache without live resolution", async () => {
  freshCacheDir();
  resetState();
  // pre-populate Brandfetch's cache
  state.cachedDomains.add("demo.com");
  const out = await lookupBrandContext({ domain: "demo.com" });
  assert.equal(out.available, true);
  // local cache miss (cached:false) but served from Brandfetch cache
  assert.equal(out.cached, false);
  // only the cachedOnly call was made — no live call
  assert.ok(state.brandfetchCalls.every((c) => c.cachedOnly));
});

test("Brandfetch unavailable with stale old-shape cache serves slimmed cached response", async () => {
  const dir = freshCacheDir();
  resetState();
  // manually write a stale cache entry in the OLD shape (8 days old),
  // carrying fields the slimmed contract removed
  const staleOldShapeOutput = {
    available: true,
    company_name: "Demo Co",
    domain: "demo.com",
    industry_hint: "retail",
    description: "A retail commerce and shopping company",
    tags: ["retail"],
    positioning: { value_proposition: "We sell great products" },
    brand: { voice: { summary: "Friendly" } },
    logo_url: "https://img.logo.dev/demo.com?token=pk_old",
    confidence: 1,
    cached: false,
  };
  writeFileSync(
    join(dir, "demo.com.json"),
    JSON.stringify({
      fetched_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      output: staleOldShapeOutput,
    }),
  );
  // point brandfetch to a closed port → unavailable
  const savedEndpoint = process.env.BRANDFETCH_BRAND_CONTEXT_ENDPOINT;
  process.env.BRANDFETCH_BRAND_CONTEXT_ENDPOINT = "http://127.0.0.1:1";
  const out = await lookupBrandContext({ domain: "demo.com" });
  process.env.BRANDFETCH_BRAND_CONTEXT_ENDPOINT = savedEndpoint;
  assert.equal(out.available, true);
  assert.equal(out.cached, true);
  assert.ok(out.message?.includes("stale"));
  assert.equal(out.company_name, "Demo Co");
  // removed fields from the old entry must not leak into the response
  assertSlimContract(out as unknown as Record<string, unknown>);
  // fields added after the old entry was written degrade to null
  assert.equal(out.tagline, null);
  assert.equal(out.mission, null);
});

test("Brandfetch unavailable with no cache returns graceful unavailable", async () => {
  freshCacheDir();
  const savedEndpoint = process.env.BRANDFETCH_BRAND_CONTEXT_ENDPOINT;
  process.env.BRANDFETCH_BRAND_CONTEXT_ENDPOINT = "http://127.0.0.1:1";
  const out = await lookupBrandContext({ domain: "nocache.com" });
  process.env.BRANDFETCH_BRAND_CONTEXT_ENDPOINT = savedEndpoint;
  assert.equal(out.available, false);
  assert.equal(out.confidence, 0);
  assert.ok(typeof out.message === "string" && out.message.length > 0);
  assertSlimContract(out as unknown as Record<string, unknown>);
});

test("missing BRANDFETCH_API_KEY with uncached domain returns unavailable", async () => {
  freshCacheDir();
  const savedKey = process.env.BRANDFETCH_API_KEY;
  delete process.env.BRANDFETCH_API_KEY;
  const out = await lookupBrandContext({ domain: "nokey.com" });
  process.env.BRANDFETCH_API_KEY = savedKey;
  assert.equal(out.available, false);
  assert.equal(out.confidence, 0);
  assert.ok(out.message);
});

test("invalid domain returns unavailable without an API call", async () => {
  freshCacheDir();
  resetState();
  const out = await lookupBrandContext({ domain: "not-a-domain" });
  assert.equal(out.available, false);
  assert.match(out.message ?? "", /Invalid domain/);
  assert.equal(state.brandfetchCalls.length, 0);
});
