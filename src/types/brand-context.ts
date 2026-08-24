/**
 * Input/output types for the brand_context_lookup tool.
 * Returns only the Brandfetch identity section (company name, tagline, mission,
 * description, tags) plus a derived industry hint. Positioning, brand voice/style,
 * and logo retrieval live in dedicated tools or are removed.
 */

export interface BrandContextLookupInput {
  /** Resolved company domain, e.g. "havas.com". */
  domain: string;
}

export interface BrandContextLookupOutput {
  /** False when neither a fresh source nor any cache could produce context */
  available: boolean;
  company_name: string | null;
  domain: string;
  /** Mapped from tags/description to source-pack industry codes; "general" when unmapped */
  industry_hint: string;
  /** Brandfetch identity tagline; null when not provided. */
  tagline: string | null;
  /** Brandfetch identity mission; null when not provided. */
  mission: string | null;
  description: string | null;
  tags: string[];
  /** 0-1 completeness score; 0 when unavailable */
  confidence: number;
  /** True when served from the local cache without an upstream call */
  cached: boolean;
  /** Present on unavailable responses and stale-cache fallbacks */
  message?: string;
}
