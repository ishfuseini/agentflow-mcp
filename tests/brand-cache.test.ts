/**
 * Unit tests for brandCache (task 2.3): old-shape cache entries are tolerated
 * on read (extra fields ignored, no throw), and fresh writes store the
 * slimmed BrandContextLookupOutput shape.
 */
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";
import { isFresh, readCache, writeCache } from "../src/data/brandCache.js";
import type { BrandContextLookupOutput } from "../src/types/brand-context.js";

let dir: string;

before(() => {
  dir = mkdtempSync(join(tmpdir(), "brand-cache-test-"));
  process.env.BRAND_CACHE_DIR = dir;
});

after(() => {
  delete process.env.BRAND_CACHE_DIR;
  rmSync(dir, { recursive: true, force: true });
});

const OLD_SHAPE_ENTRY = {
  fetched_at: new Date().toISOString(),
  output: {
    available: true,
    company_name: "Demo Co",
    domain: "demo.com",
    industry_hint: "retail",
    tagline: "Build things",
    mission: "Mission",
    description: "A demo company",
    tags: ["retail"],
    confidence: 0.9,
    cached: false,
    // fields removed from the slimmed shape:
    logo_url: "https://img.logo.dev/demo.com",
    positioning: { value_proposition: "We sell great products" },
    brand: { voice: { summary: "Friendly" } },
  },
};

test("reads a pre-existing old-shape entry without throwing", async () => {
  writeFileSync(join(dir, "demo.com.json"), JSON.stringify(OLD_SHAPE_ENTRY));

  const entry = await readCache("demo.com");

  assert.ok(entry);
  assert.equal(entry.fetched_at, OLD_SHAPE_ENTRY.fetched_at);
  assert.equal(entry.output.company_name, "Demo Co");
  assert.ok(isFresh(entry));
});

const SLIM_OUTPUT: BrandContextLookupOutput = {
  available: true,
  company_name: "Slim Co",
  domain: "slim.com",
  industry_hint: "retail",
  tagline: "Slim",
  mission: null,
  description: null,
  tags: [],
  confidence: 0.5,
  cached: false,
};

test("a fresh write stores the slimmed shape", async () => {
  await writeCache("slim.com", SLIM_OUTPUT);

  const stored = JSON.parse(readFileSync(join(dir, "slim.com.json"), "utf8"));
  assert.equal(stored.output.company_name, "Slim Co");
  assert.ok(!("logo_url" in stored.output));
  assert.ok(!("positioning" in stored.output));
  assert.ok(!("brand" in stored.output));

  const back = await readCache("slim.com");
  assert.deepEqual(back?.output, SLIM_OUTPUT);
});
