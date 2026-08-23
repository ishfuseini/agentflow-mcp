/**
 * Local file cache for brand context (task 6.4).
 *
 * One JSON file per domain under BRAND_CACHE_DIR (default .cache/brand/).
 * Entries are fresh for 7 days; expired entries are still served when every
 * upstream source fails (stale-if-error), so the demo degrades gracefully.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import type { BrandContextLookupOutput } from "../types/brand-context.js";

const TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface CacheEntry {
  fetched_at: string;
  output: BrandContextLookupOutput;
}

const cacheDir = (): string => resolve(process.env.BRAND_CACHE_DIR ?? ".cache/brand");

const fileFor = (domain: string): string => join(cacheDir(), `${domain}.json`);

export function readCache(domain: string): CacheEntry | null {
  const path = fileFor(domain);
  if (!existsSync(path)) return null;
  try {
    const entry = JSON.parse(readFileSync(path, "utf8")) as CacheEntry;
    if (!entry || typeof entry.fetched_at !== "string" || !entry.output) return null;
    return entry;
  } catch {
    return null;
  }
}

export function isFresh(entry: CacheEntry): boolean {
  return Date.now() - Date.parse(entry.fetched_at) < TTL_MS;
}

export function writeCache(domain: string, output: BrandContextLookupOutput): void {
  const entry: CacheEntry = { fetched_at: new Date().toISOString(), output };
  mkdirSync(cacheDir(), { recursive: true });
  writeFileSync(fileFor(domain), `${JSON.stringify(entry, null, 2)}\n`);
}
