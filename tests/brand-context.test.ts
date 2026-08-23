/**
 * Unit tests for brand_context_lookup (task 8.4): local cache hit, cache miss,
 * cachedOnly mode, Brandfetch-unavailable fallback, and logo.dev-unavailable
 * fallback (logo_url null but context returned).
 *
 * Uses tiny loopback HTTP servers so the real fetchBrandContext / fetchLogoDevBrand
 * code paths are exercised without hitting the real APIs.
 */
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { lookupBrandContext } from "../src/tools/brandContextLookup.js";

// --- minimal valid Brandfetch Brand Context response (snake_case)
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
  positioning: {
    value_proposition: "We sell great products",
    target_audience: [{ segment: "shoppers", description: "everyday consumers" }],
    products_and_services: [{ name: "Store", type: "product", description: "online store" }],
  },
  brand: {
    voice: { summary: "Friendly and direct", attributes: ["friendly"], avoid: ["rude"] },
    style: { summary: "Clean and modern", attributes: ["clean"] },
  },
};

interface MockState {
  brandfetchCalls: { domain: string; cachedOnly: boolean }[];
  logoCalls: string[];
  cachedDomains: Set<string>;
  brandfetchLiveFail: boolean;
  logoFail: boolean;
}

let brandfetchServer: Server;
let logoServer: Server;
let brandfetchUrl: string;
let logoUrl: string;
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
    logoCalls: [],
    cachedDomains: new Set(),
    brandfetchLiveFail: false,
    logoFail: false,
  };

  brandfetchServer = createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const match = url.pathname.match(/^\/context\/(.+)$/);
    if (!match) {
      res.writeHead(404);
      res.end();
      return;
    }
    const domain = decodeURIComponent(match[1]);
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

  logoServer = createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    const match = url.pathname.match(/^\/brand\/(.+)$/);
    if (!match) {
      res.writeHead(404);
      res.end();
      return;
    }
    const domain = decodeURIComponent(match[1]);
    state.logoCalls.push(domain);
    if (state.logoFail) {
      res.writeHead(401);
      res.end();
      return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({ name: "Demo Co", logo: `https://img.logo.dev/${domain}?token=pk_test` }),
    );
  });

  await new Promise<void>((r) => brandfetchServer.listen(0, "127.0.0.1", r));
  await new Promise<void>((r) => logoServer.listen(0, "127.0.0.1", r));

  const bfAddr = brandfetchServer.address();
  const lgAddr = logoServer.address();
  brandfetchUrl = `http://127.0.0.1:${typeof bfAddr === "object" && bfAddr ? bfAddr.port : 0}/context`;
  logoUrl = `http://127.0.0.1:${typeof lgAddr === "object" && lgAddr ? lgAddr.port : 0}/brand`;

  process.env.BRANDFETCH_API_KEY = "test-key";
  process.env.LOGO_DEV_SECRET_KEY = "test-key";
  process.env.BRANDFETCH_BRAND_CONTEXT_ENDPOINT = brandfetchUrl;
  process.env.LOGO_DEV_BRAND_API_ENDPOINT = logoUrl;
});

after(async () => {
  for (const d of tmpDirs) rmSync(d, { recursive: true, force: true });
  await new Promise<void>((r) => brandfetchServer.close(() => r()));
  await new Promise<void>((r) => logoServer.close(() => r()));
});

const resetState = () => {
  state.brandfetchCalls = [];
  state.logoCalls = [];
  state.cachedDomains.clear();
  state.brandfetchLiveFail = false;
  state.logoFail = false;
};

test("cache miss populates local cache", async () => {
  freshCacheDir();
  resetState();
  const out = await lookupBrandContext({ domain: "demo.com" });
  assert.equal(out.available, true);
  assert.equal(out.cached, false);
  assert.equal(out.company_name, "Demo Co");
  assert.equal(out.industry_hint, "retail");
  assert.ok(out.confidence >= 0.8);
  assert.ok(out.logo_url?.startsWith("https://img.logo.dev/"));
  // a live call was made (cachedOnly missed first, then live succeeded)
  assert.ok(state.brandfetchCalls.some((c) => !c.cachedOnly));
  assert.ok(state.logoCalls.length > 0);
});

test("local cache hit avoids API calls", async () => {
  freshCacheDir();
  resetState();
  // first call populates
  await lookupBrandContext({ domain: "demo.com" });
  const bfBefore = state.brandfetchCalls.length;
  const lgBefore = state.logoCalls.length;
  // second call should be served from cache
  const out = await lookupBrandContext({ domain: "demo.com" });
  assert.equal(out.available, true);
  assert.equal(out.cached, true);
  assert.equal(state.brandfetchCalls.length, bfBefore);
  assert.equal(state.logoCalls.length, lgBefore);
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

test("Brandfetch unavailable with stale cache serves cached response", async () => {
  const dir = freshCacheDir();
  resetState();
  // manually write a stale cache entry (8 days old)
  const staleOutput = {
    available: true,
    company_name: "Demo Co",
    domain: "demo.com",
    industry_hint: "retail",
    description: "A retail commerce and shopping company",
    tags: ["retail"],
    positioning: RAW.positioning,
    brand: RAW.brand,
    logo_url: "https://img.logo.dev/demo.com?token=pk_old",
    confidence: 1,
    cached: false,
  };
  writeFileSync(
    join(dir, "demo.com.json"),
    JSON.stringify({
      fetched_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      output: staleOutput,
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
  assert.equal(out.logo_url, null);
});

test("logo.dev unavailable returns null logo_url but context still returned", async () => {
  freshCacheDir();
  resetState();
  state.logoFail = true;
  const out = await lookupBrandContext({ domain: "demo.com" });
  assert.equal(out.available, true);
  assert.equal(out.logo_url, null);
  assert.equal(out.company_name, "Demo Co");
  assert.equal(out.industry_hint, "retail");
  assert.ok(out.confidence >= 0.5);
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
