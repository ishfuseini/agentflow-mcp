/**
 * brand_context_lookup tool (tasks 6.2-6.5, 6.7).
 *
 * Layered flow: fresh local cache -> Brandfetch cachedOnly -> Brandfetch live.
 * Any upstream failure falls back to the local cache (even stale) or a graceful
 * unavailable response, so a Brandfetch outage never breaks the demo pipeline.
 *
 * The tool returns only the Brandfetch identity section (company name, tagline,
 * mission, description, tags) plus a derived industry hint. Logo retrieval moved
 * to the independent brand_search tool; positioning and brand voice/style are
 * removed entirely.
 */
import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { isFresh, readCache, writeCache } from "../data/brandCache.js";
import { fetchBrandContext } from "../data/brandfetchClient.js";
import { withToolLogging } from "../logging/gelf.js";
import type { BrandContextLookupInput, BrandContextLookupOutput } from "../types/brand-context.js";

/** Accepts "havas.com", "https://www.havas.com/about" -> "havas.com". */
export function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

/**
 * Map tags + description to a source-pack industry code. First keyword hit
 * wins; unmapped domains get "general".
 */
const INDUSTRY_KEYWORDS: ReadonlyArray<readonly [string, readonly string[]]> = [
  [
    "media_agency",
    ["advertis", "marketing", "media", "agency", "communications", "creative", "public relations"],
  ],
  [
    "healthcare",
    ["health", "medical", "pharma", "patient", "clinical", "hospital", "biotech", "life science"],
  ],
  [
    "retail",
    ["retail", "ecommerce", "e-commerce", "commerce", "shopping", "store", "consumer goods"],
  ],
  [
    "financial_services",
    [
      "finance",
      "financial",
      "banking",
      "insurance",
      "investment",
      "capital",
      "fintech",
      "asset management",
      "payments",
    ],
  ],
  [
    "transportation",
    ["transport", "logistics", "mobility", "airline", "aviation", "railway", "shipping"],
  ],
  ["telecom", ["telecom", "wireless", "connectivity", "network operator", "5g"]],
  ["hospitality", ["hospitality", "hotel", "travel", "restaurant", "tourism", "lodging"]],
  ["higher_education", ["higher education", "university", "academic", "learning", "college"]],
  [
    "energy",
    ["energy", "oil and gas", "utilities", "renewable", "electricity", "power generation"],
  ],
  ["automotive", ["automotive", "vehicle", "autonomous driving", "car manufacturing"]],
];

export function inferIndustryHint(tags: string[], description: string): string {
  const haystack = `${tags.join(" ")} ${description}`.toLowerCase();
  for (const [code, keywords] of INDUSTRY_KEYWORDS) {
    if (keywords.some((kw) => haystack.includes(kw))) return code;
  }
  return "general";
}

function unavailable(domain: string, message: string): BrandContextLookupOutput {
  return {
    available: false,
    company_name: null,
    domain,
    industry_hint: "general",
    tagline: null,
    mission: null,
    description: null,
    tags: [],
    confidence: 0,
    cached: false,
    message,
  };
}

/**
 * Pick only the current output fields. Old cache entries may carry removed
 * fields (logo_url, positioning, brand) and lack newer ones (tagline, mission);
 * this keeps the response contract clean regardless of cache age.
 */
function slim(output: BrandContextLookupOutput): BrandContextLookupOutput {
  return {
    available: output.available,
    company_name: output.company_name,
    domain: output.domain,
    industry_hint: output.industry_hint,
    tagline: output.tagline ?? null,
    mission: output.mission ?? null,
    description: output.description,
    tags: output.tags,
    confidence: output.confidence,
    cached: output.cached,
    ...(output.message ? { message: output.message } : {}),
  };
}

function withCacheFlag(
  output: BrandContextLookupOutput,
  cached: boolean,
  message?: string,
): BrandContextLookupOutput {
  return { ...output, cached, ...(message ? { message } : {}) };
}

/** Completeness score: 0.5 base + 0.1 per populated identity section. */
function scoreConfidence(output: BrandContextLookupOutput): number {
  let c = 0.5;
  if (output.company_name) c += 0.1;
  if (output.tagline) c += 0.1;
  if (output.mission) c += 0.1;
  if (output.description) c += 0.1;
  if (output.tags.length > 0) c += 0.1;
  return Math.round(Math.min(c, 1) * 100) / 100;
}

/** Core lookup — exported for tests, the cache warmer, and direct callers. */
export async function lookupBrandContext(
  input: BrandContextLookupInput,
): Promise<BrandContextLookupOutput> {
  const domain = normalizeDomain(input.domain);
  if (!domain.includes(".")) {
    return unavailable(domain, `Invalid domain: "${input.domain}"`);
  }

  // Layer 1: fresh local cache — zero API cost.
  const cachedEntry = await readCache(domain);
  if (cachedEntry && isFresh(cachedEntry)) {
    return withCacheFlag(slim(cachedEntry.output), true);
  }

  const noCacheOrStale = (): BrandContextLookupOutput => {
    if (cachedEntry) {
      return withCacheFlag(
        slim(cachedEntry.output),
        true,
        "Serving stale cached brand context: upstream source unavailable",
      );
    }
    return unavailable(domain, "Brand context unavailable: no cache and no reachable source");
  };

  // Layer 2: Brandfetch cachedOnly — instant when pre-populated, never crawls.
  const cachedOnly = await fetchBrandContext(domain, { cachedOnly: true });
  let raw = cachedOnly.status === "ok" ? cachedOnly.context : undefined;

  // Layer 3: live resolution (only when cachedOnly missed).
  if (!raw) {
    const live = await fetchBrandContext(domain);
    if (live.status !== "ok") return noCacheOrStale(); // error, or 204 which only happens with cachedOnly
    raw = live.context;
  }

  const canonicalName = raw.meta.canonical_name.split(":")[0]?.trim() || domain;

  const output: BrandContextLookupOutput = {
    available: true,
    company_name: canonicalName,
    domain,
    industry_hint: inferIndustryHint(raw.identity.tags, raw.identity.description),
    tagline: raw.identity.tagline || null,
    mission: raw.identity.mission || null,
    description: raw.identity.description || null,
    tags: raw.identity.tags,
    confidence: 0, // set below
    cached: false,
  };
  output.confidence = scoreConfidence(output);

  await writeCache(domain, output);
  return output;
}

export function registerBrandContextLookup(server: McpServer): void {
  server.registerTool(
    "brand_context_lookup",
    {
      description:
        "Retrieve company brand context (company name, tagline, mission, description, tags, " +
        "industry hint) for a resolved domain, from the Brandfetch Brand Context API identity " +
        "section. Serves cached data when the source is unavailable. Use brand_search to resolve " +
        "a company name to a domain (and logo) before calling.",
      inputSchema: z.object({
        domain: z.string().describe('Resolved company domain, e.g. "havas.com"'),
      }),
    },
    withToolLogging("brand_context_lookup", async (args: BrandContextLookupInput) => ({
      content: [{ type: "text", text: JSON.stringify(await lookupBrandContext(args)) }],
    })),
  );
}
