/**
 * Input/output types for the brand_search tool.
 * Resolves a company name to a canonical domain and a ready-to-embed logo URL
 * via the logo.dev Brand Search API (GET https://api.logo.dev/search).
 */

export interface BrandSearchInput {
  /** Company name query, e.g. "Sweetgreen" or a typeahead prefix "swee". */
  query: string;
  /** "suggest" (default, popular prefix matches for typeahead) or "match" (exact/near-exact first). */
  strategy?: "suggest" | "match";
  /** When false, excludes brands flagged as potentially inappropriate. */
  is_profane?: boolean;
}

export interface BrandSearchCandidate {
  /** Brand display name, e.g. "Sweetgreen". */
  name: string;
  /** Canonical domain, e.g. "sweetgreen.com". */
  domain: string;
  /** Ready-to-embed logo URL, e.g. "https://img.logo.dev/...". */
  logo_url: string;
}

export interface BrandSearchOutput {
  /** The query that was searched. */
  query: string;
  /** The strategy used for the search. */
  strategy: "suggest" | "match";
  /** Candidate brand matches; empty when no matches or unavailable. */
  candidates: BrandSearchCandidate[];
  /** False when the search could not be completed (missing key, API error). */
  available: boolean;
  /** Present on unavailable responses. */
  message?: string;
}