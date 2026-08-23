/**
 * Input/output types for the brand_context_lookup tool (task 6.1).
 */

export interface BrandContextLookupInput {
  /** Resolved company domain, e.g. "havas.com". Autocomplete is agent-side (design #10). */
  domain: string;
}

export interface TargetAudienceSegment {
  segment: string;
  description: string;
}

export interface ProductOrService {
  name: string;
  type: string;
  description: string;
}

export interface BrandPositioning {
  value_proposition: string;
  target_audience: TargetAudienceSegment[];
  products_and_services: ProductOrService[];
}

export interface BrandVoice {
  summary: string;
  attributes: string[];
  avoid: string[];
}

export interface BrandStyle {
  summary: string;
  attributes: string[];
}

export interface BrandIdentityBlock {
  voice: BrandVoice;
  style: BrandStyle;
}

export interface BrandContextLookupOutput {
  /** False when neither a fresh source nor any cache could produce context */
  available: boolean;
  company_name: string | null;
  domain: string;
  /** Mapped from tags/description to source-pack industry codes; "general" when unmapped */
  industry_hint: string;
  description: string | null;
  tags: string[];
  positioning: BrandPositioning | null;
  brand: BrandIdentityBlock | null;
  /** Ready-to-embed logo URL from logo.dev; null when logo.dev is unavailable */
  logo_url: string | null;
  /** 0-1 completeness score; 0 when unavailable */
  confidence: number;
  /** True when served from the local cache without an upstream call */
  cached: boolean;
  /** Present on unavailable responses and stale-cache fallbacks */
  message?: string;
}
