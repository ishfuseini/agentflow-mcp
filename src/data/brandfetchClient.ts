/**
 * Brandfetch Brand Context API client (task 6.2).
 *
 * GET {endpoint}/{domain} with Bearer BRANDFETCH_API_KEY and Accept: application/json.
 * The API returns snake_case JSON grouped into meta / identity / positioning / brand.
 * With cachedOnly=true it responds 204 (never crawls) when nothing is cached,
 * which keeps latency low and avoids burning live resolutions.
 *
 * Docs: https://docs.brandfetch.com/reference/brand-context-api
 */
export interface RawBrandContext {
  meta: { domain: string; canonical_name: string; resolved_at: string };
  identity: { tagline: string; mission: string; description: string; tags: string[] };
}

export type BrandfetchResult =
  | { status: "ok"; context: RawBrandContext }
  /** 204 from cachedOnly=true: domain not in Brandfetch's cache yet */
  | { status: "miss" }
  | { status: "error"; message: string };

const endpoint = (): string =>
  process.env.BRANDFETCH_BRAND_CONTEXT_ENDPOINT ?? "https://api.brandfetch.io/v2/context";

export function hasBrandfetchKey(): boolean {
  return Boolean(process.env.BRANDFETCH_API_KEY);
}

/**
 * Fetch brand context for a domain. cachedOnly=true trades coverage for speed:
 * instant 200 from cache or 204 without a live crawl.
 */
export async function fetchBrandContext(
  domain: string,
  opts: { cachedOnly?: boolean } = {},
): Promise<BrandfetchResult> {
  const key = process.env.BRANDFETCH_API_KEY;
  if (!key) return { status: "error", message: "BRANDFETCH_API_KEY not set" };

  const url = `${endpoint()}/${encodeURIComponent(domain)}${
    opts.cachedOnly ? "?cachedOnly=true" : ""
  }`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
      signal: AbortSignal.timeout(opts.cachedOnly ? 5_000 : 20_000),
    });
    if (res.status === 204) return { status: "miss" };
    if (res.status === 429) {
      return { status: "error", message: "Brandfetch quota exceeded (429)" };
    }
    if (!res.ok) {
      return { status: "error", message: `Brandfetch returned HTTP ${res.status}` };
    }
    const context = (await res.json()) as Partial<RawBrandContext>;
    if (!context?.meta || !context.identity) {
      return { status: "error", message: "Brandfetch response missing required sections" };
    }
    return { status: "ok", context: context as RawBrandContext };
  } catch (err) {
    return { status: "error", message: `Brandfetch request failed: ${describe(err)}` };
  }
}

const describe = (err: unknown): string => (err instanceof Error ? err.message : String(err));
