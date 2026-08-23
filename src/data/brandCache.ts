/**
 * Local file cache for brand context (task 6.4).
 *
 * One JSON file per domain under BRAND_CACHE_DIR (default .cache/brand/).
 * Entries are fresh for 7 days; expired entries are still served when every
 * upstream source fails (stale-if-error), so the demo degrades gracefully.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import type { BrandContextLookupOutput } from "../types/brand-context.js";

const TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface CacheEntry {
  fetched_at: string;
  output: BrandContextLookupOutput;
}

const cacheDir = (): string => resolve(process.env.BRAND_CACHE_DIR ?? ".cache/brand");

const fileFor = (domain: string): string => join(cacheDir(), `${domain}.json`);

export async function readCache(domain: string): Promise<CacheEntry | null> {
  try {
    const raw = await readFile(fileFor(domain), "utf8");
    const entry = JSON.parse(raw) as CacheEntry;
    if (!entry || typeof entry.fetched_at !== "string" || !entry.output) return null;
    return entry;
  } catch {
    return null;
  }
}

export function isFresh(entry: CacheEntry): boolean {
  return Date.now() - Date.parse(entry.fetched_at) < TTL_MS;
}

export async function writeCache(domain: string, output: BrandContextLookupOutput): Promise<void> {
  const entry: CacheEntry = { fetched_at: new Date().toISOString(), output };
  await mkdir(cacheDir(), { recursive: true });
  await writeFile(fileFor(domain), `${JSON.stringify(entry, null, 2)}\n`);
}
