/**
 * brand_search tool (tasks 3.1-3.2).
 *
 * Resolves a company name to candidate brands (name, canonical domain,
 * ready-to-embed logo URL) via the logo.dev Brand Search API. Independent of
 * the other tools — callable at any time with just a company name.
 *
 * Any failure (missing LOGO_DEV_SECRET_KEY, HTTP 401/400, unreachable API)
 * yields a graceful unavailable response rather than a tool error, so agents
 * can continue without a logo.
 */
import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { searchLogoDevBrands } from "../data/logoDevClient.js";
import { withToolLogging } from "../logging/gelf.js";
import type { BrandSearchInput, BrandSearchOutput } from "../types/brand-search.js";

function unavailable(
  query: string,
  strategy: "suggest" | "match",
  message: string,
): BrandSearchOutput {
  return { query, strategy, candidates: [], available: false, message };
}

/** Core search — exported for tests and direct callers. */
export async function lookupBrandSearch(input: BrandSearchInput): Promise<BrandSearchOutput> {
  const query = input.query.trim();
  const strategy = input.strategy ?? "suggest";
  if (!query) {
    return unavailable(input.query, strategy, "Empty query: provide a company name");
  }
  if (!process.env.LOGO_DEV_SECRET_KEY) {
    return unavailable(query, strategy, "Brand search unavailable: LOGO_DEV_SECRET_KEY not set");
  }

  const candidates = await searchLogoDevBrands(query, {
    strategy,
    ...(input.is_profane !== undefined ? { is_profane: input.is_profane } : {}),
  });
  if (candidates === null) {
    return unavailable(query, strategy, "Brand search unavailable: logo.dev search failed");
  }
  return { query, strategy, candidates, available: true };
}

export function registerBrandSearchLookup(server: McpServer): void {
  server.registerTool(
    "brand_search",
    {
      description:
        "Resolve a company name to candidate brands — each with a name, canonical domain, and " +
        'ready-to-embed logo URL — via the logo.dev Brand Search API. Use strategy "match" for ' +
        'exact name lookups, "suggest" (default) for typeahead-style prefix matches. Returns an ' +
        "unavailable response (not an error) when the search cannot be completed.",
      inputSchema: z.object({
        query: z.string().describe('Company name, e.g. "Sweetgreen", or a prefix like "swee"'),
        strategy: z
          .enum(["suggest", "match"])
          .optional()
          .describe('"suggest" (default) for popular prefix matches, "match" for exact first'),
        is_profane: z
          .boolean()
          .optional()
          .describe("When false, excludes brands flagged as potentially inappropriate"),
      }),
    },
    withToolLogging("brand_search", async (args: BrandSearchInput) => ({
      content: [{ type: "text", text: JSON.stringify(await lookupBrandSearch(args)) }],
    })),
  );
}
