/**
 * arch_pattern_references tool (tasks 7.1-7.2).
 *
 * Returns the source pack references (path, title, source_url) that informed a
 * pattern match, citing the matched pattern's own entry first. Re-runs the
 * deterministic scoring from arch_pattern_lookup against the original ask
 * inputs, so the citations reproduce the match without the caller passing
 * opaque reference data.
 *
 * Independent of arch_pattern_lookup — callable at any time. The generic
 * fallback pattern has no source pack entry of its own, so it returns the
 * best-available references for the inputs; unknown pattern ids yield a
 * graceful unavailable response rather than a tool error.
 */
import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { loadSourcePack } from "../data/loader.js";
import { withToolLogging } from "../logging/gelf.js";
import type { ArchPatternLookupInput } from "../types/arch-pattern.js";
import type {
  ArchPatternReferencesInput,
  ArchPatternReferencesOutput,
} from "../types/arch-pattern-references.js";
import { FALLBACK_PATTERN, sourceReferences } from "./archPatternLookup.js";

function unavailable(patternId: string, message: string): ArchPatternReferencesOutput {
  return { pattern_id: patternId, source_references: [], available: false, message };
}

/** Core lookup — exported for tests and direct (non-MCP) callers. */
export function lookupArchPatternReferences(
  input: ArchPatternReferencesInput,
): ArchPatternReferencesOutput {
  const patternId = input.pattern_id.trim();
  if (!patternId) {
    return unavailable(input.pattern_id, "Empty pattern_id: provide a pattern identifier");
  }

  const ask: ArchPatternLookupInput = {
    industry: input.industry,
    data_stack: input.data_stack,
    constraints: input.constraints,
    ...(input.cloud ? { cloud: input.cloud } : {}),
  };
  const index = loadSourcePack();

  const entry = index.byPatternId.get(patternId);
  if (entry?.pattern) {
    return {
      pattern_id: entry.pattern.pattern_id,
      source_references: sourceReferences(ask, index, entry),
      available: true,
    };
  }
  if (patternId === FALLBACK_PATTERN.pattern_id) {
    // Fallback: no curated entry — cite the best-available sources for the ask.
    return {
      pattern_id: patternId,
      source_references: sourceReferences(ask, index),
      available: true,
    };
  }
  return unavailable(
    patternId,
    `No references available: pattern_id "${patternId}" is not a curated pattern in the source pack`,
  );
}

export function registerArchPatternReferencesLookup(server: McpServer): void {
  server.registerTool(
    "arch_pattern_references",
    {
      description:
        "Return the source pack references (path, title, source_url) that informed an " +
        "architecture pattern match. Pass the pattern_id plus the original ask inputs " +
        "(industry, data_stack, constraints) used to find the match. The generic fallback " +
        "pattern returns best-available references; unknown pattern ids return a graceful " +
        "unavailable response rather than an error.",
      inputSchema: z.object({
        pattern_id: z
          .string()
          .describe(
            'Pattern identifier, e.g. "media_agency_audience_measurement" or the fallback "generic_enterprise_ai_poc"',
          ),
        industry: z.string().describe('Original industry code, e.g. "media_agency"'),
        data_stack: z
          .array(z.string())
          .describe('Original candidate platforms/tools, e.g. ["BigQuery", "Snowflake"]'),
        cloud: z.string().optional().describe("Original cloud preference, e.g. GCP"),
        constraints: z
          .array(z.string())
          .describe('Original constraints, e.g. ["SAML SSO", "EU data residency"]'),
      }),
    },
    withToolLogging("arch_pattern_references", (args: ArchPatternReferencesInput) => ({
      content: [{ type: "text", text: JSON.stringify(lookupArchPatternReferences(args)) }],
    })),
  );
}
