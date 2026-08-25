/**
 * logo.dev Brand Search API client.
 *
 * GET {endpoint}?q={name}&strategy={suggest|match}&is_profane={bool} with
 * Bearer LOGO_DEV_SECRET_KEY. Returns ranked brand candidates, each with a
 * name, canonical domain, and a ready-to-embed CDN logo URL.
 *
 * Returns null on any failure (missing key, 401/400, unreachable): callers
 * distinguish "unavailable" (null) from "no matches" ([]) and degrade
 * gracefully. Docs: https://www.logo.dev/docs/search/introduction
 */
import type { BrandSearchCandidate } from "../types/brand-search.js";

const endpoint = (): string =>
  process.env.LOGO_DEV_SEARCH_API_ENDPOINT ?? "https://api.logo.dev/search";

export interface LogoDevSearchOptions {
  /** "suggest" (default) for popular prefix matches, "match" for exact/near-exact first. */
  strategy?: "suggest" | "match";
  /** When false, excludes brands flagged as potentially inappropriate. */
  is_profane?: boolean;
}

interface RawCandidate {
  name?: unknown;
  domain?: unknown;
  logo_url?: unknown;
}

const toCandidate = (raw: RawCandidate): BrandSearchCandidate | null =>
  typeof raw.name === "string" && typeof raw.domain === "string" && typeof raw.logo_url === "string"
    ? { name: raw.name, domain: raw.domain, logo_url: raw.logo_url }
    : null;

/**
 * Search logo.dev for brands matching a company name query.
 * Returns parsed candidates ([] when nothing matches), or null on any failure.
 */
export async function searchLogoDevBrands(
  query: string,
  opts: LogoDevSearchOptions = {},
): Promise<BrandSearchCandidate[] | null> {
  const key = process.env.LOGO_DEV_SECRET_KEY;
  if (!key) return null;

  const params = new URLSearchParams({ q: query, strategy: opts.strategy ?? "suggest" });
  if (opts.is_profane !== undefined) params.set("is_profane", String(opts.is_profane));

  try {
    const res = await fetch(`${endpoint()}?${params}`, {
      headers: { Authorization: `Bearer ${key}` },
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) return null;
    const raw = (await res.json()) as RawCandidate[];
    if (!Array.isArray(raw)) return null;
    return raw.map(toCandidate).filter((c): c is BrandSearchCandidate => c !== null);
  } catch {
    return null;
  }
}
