/**
 * arch_pattern_lookup tool (tasks 3.2-3.7).
 *
 * Deterministic, rules-based matching over the source pack index:
 * industry match (40%) -> data stack overlap (30%) -> constraint coverage (30%).
 * Curated matches score confidence >= 0.85; weak matches fall back to a generic
 * enterprise AI POC pattern with confidence < 0.5.
 *
 * The response carries only the core pattern fields. diagram_data and
 * source_references moved to the independent arch_diagram and
 * arch_pattern_references tools; the sourceReferences helper is exported for
 * arch_pattern_references to re-run scoring against the original ask.
 */
import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { loadSourcePack, norm, overlapRatio } from "../data/loader.js";
import { withToolLogging } from "../logging/gelf.js";
import type {
  ArchPatternLookupInput,
  ArchPatternLookupOutput,
  SourceRef,
} from "../types/arch-pattern.js";
import type { SourceEntry, SourceIndex } from "../types/source.js";

export const WEIGHTS = { industry: 0.4, stack: 0.3, constraints: 0.3 } as const;
const CURATED_THRESHOLD = 0.85;
const FALLBACK_CONFIDENCE_CAP = 0.45;

/** Vendor-neutral fallback when no curated pattern matches (task 3.3). */
export const FALLBACK_PATTERN: ArchPatternLookupOutput = {
  pattern_id: "generic_enterprise_ai_poc",
  architecture_summary:
    "Vendor-neutral enterprise AI POC pattern: governed data landing zone with medallion zones, RAG over governed sources, an LLM gateway with usage controls, and human-in-the-loop review before production",
  recommended_components: [
    "Governed data lake (bronze/silver/gold)",
    "RAG index over governed sources",
    "LLM gateway (rate limits, logging)",
    "HITL review workflow",
  ],
  data_zones: ["bronze", "silver", "gold"],
  integration_notes: [
    "Start from governed data, not direct database access",
    "Log every prompt/response through the gateway for audit",
    "Route regulated or low-confidence outputs through human review",
  ],
  confidence: FALLBACK_CONFIDENCE_CAP,
};

/** Score one pattern entry against the input. Returns raw score components. */
export function scorePattern(
  input: ArchPatternLookupInput,
  entry: SourceEntry,
): { industry: number; stack: number; constraints: number; total: number } {
  const industry = entry.fm.industry.map(norm).includes(norm(input.industry)) ? 1 : 0;
  const stack = overlapRatio(input.data_stack, entry.fm.data_stack);
  const constraints = overlapRatio(input.constraints, entry.fm.constraints);
  return {
    industry,
    stack,
    constraints,
    total: WEIGHTS.industry * industry + WEIGHTS.stack * stack + WEIGHTS.constraints * constraints,
  };
}

/** Source pack entries that informed the match — used by arch_pattern_references. */
export function sourceReferences(
  input: ArchPatternLookupInput,
  index: SourceIndex,
  patternEntry?: SourceEntry,
): SourceRef[] {
  const scores = new Map<SourceEntry, number>();
  const bump = (entries: SourceEntry[] | undefined, weight: number) => {
    for (const e of entries ?? []) {
      if (e === patternEntry) continue;
      scores.set(e, (scores.get(e) ?? 0) + weight);
    }
  };
  bump(index.byIndustry.get(norm(input.industry)), 2);
  for (const s of input.data_stack) bump(index.byDataStack.get(norm(s)), 2);
  for (const c of input.constraints) bump(index.byConstraints.get(norm(c)), 1);

  const ranked = [...scores.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].relPath.localeCompare(b[0].relPath))
    .slice(0, 5)
    .map(([e]) => ({ path: e.relPath, title: e.fm.title, source_url: e.fm.source_url }));

  return patternEntry
    ? [
        {
          path: patternEntry.relPath,
          title: patternEntry.fm.title,
          source_url: patternEntry.fm.source_url,
        },
        ...ranked,
      ]
    : ranked;
}

/** Core lookup — exported for tests and direct (non-MCP) callers. */
export function lookupArchPattern(input: ArchPatternLookupInput): ArchPatternLookupOutput {
  const index = loadSourcePack();
  const candidates = [...index.byPatternId.values()];

  let best: SourceEntry | undefined;
  let bestScore = 0;
  for (const entry of candidates) {
    const s = scorePattern(input, entry);
    // deterministic tie-break: higher score, then lexicographic pattern_id
    if (s.total > bestScore || (s.total === bestScore && best && entry.fm.title < best.fm.title)) {
      best = entry;
      bestScore = s.total;
    }
  }

  const industryMatched = best ? best.fm.industry.map(norm).includes(norm(input.industry)) : false;

  if (!best?.pattern || !industryMatched || bestScore < CURATED_THRESHOLD) {
    // fallback: weak or unmatched — always < 0.5
    const fallbackConfidence = Math.min(bestScore, FALLBACK_CONFIDENCE_CAP);
    return {
      ...FALLBACK_PATTERN,
      confidence: Math.round(fallbackConfidence * 1000) / 1000,
    };
  }

  const p = best.pattern;
  const confidence = Math.min(bestScore, p.confidence_baseline);
  return {
    pattern_id: p.pattern_id,
    architecture_summary: p.architecture_summary,
    recommended_components: p.recommended_components,
    data_zones: best.fm.data_zones,
    integration_notes: p.integration_notes,
    confidence: Math.round(confidence * 1000) / 1000,
  };
}

export function registerArchPatternLookup(server: McpServer): void {
  server.registerTool(
    "arch_pattern_lookup",
    {
      description:
        "Match an enterprise ask (industry, data stack, cloud, constraints) to a curated " +
        "reference architecture pattern with components, data zones, integration notes, and " +
        "confidence. Use arch_diagram for diagram data and arch_pattern_references for source " +
        "citations — both independent tools callable at any time.",
      inputSchema: z.object({
        industry: z
          .string()
          .describe("Industry code, e.g. media_agency, healthcare, retail, financial_services"),
        data_stack: z
          .array(z.string())
          .describe('Candidate platforms/tools, e.g. ["BigQuery", "Snowflake"]'),
        cloud: z.string().optional().describe("Cloud preference, e.g. GCP, AWS, Azure"),
        constraints: z
          .array(z.string())
          .describe('Governance/compliance constraints, e.g. ["SAML SSO", "EU data residency"]'),
        latency: z.string().optional().describe("Latency expectation: batch or real-time"),
      }),
    },
    withToolLogging("arch_pattern_lookup", async (args: ArchPatternLookupInput) => ({
      content: [{ type: "text", text: JSON.stringify(lookupArchPattern(args)) }],
    })),
  );
}
