/**
 * Input/output types for the arch_pattern_lookup tool (task 3.1).
 */
import type { DiagramData } from "./source.js";

export interface ArchPatternLookupInput {
  /** Industry code, e.g. media_agency | healthcare | retail | financial_services */
  industry: string;
  /** Candidate platforms/tools, e.g. ["BigQuery", "Snowflake"] */
  data_stack: string[];
  /** Cloud preference, e.g. "GCP" (optional) */
  cloud?: string;
  /** Governance/compliance constraints, e.g. ["SAML SSO", "EU data residency"] */
  constraints: string[];
  /** Latency expectation: batch | real-time (optional) */
  latency?: string;
}

/** Cites the source pack files that informed a match (task 3.6, P1). */
export interface SourceRef {
  path: string;
  title: string;
  source_url: string;
}

export interface ArchPatternLookupOutput {
  pattern_id: string;
  architecture_summary: string;
  recommended_components: string[];
  data_zones: string[];
  integration_notes: string[];
  /** 0-1; curated matches >= 0.85, fallback < 0.5 */
  confidence: number;
  /** Included for curated matches only (confidence >= 0.85) */
  diagram_data?: DiagramData;
  source_references?: SourceRef[];
}
