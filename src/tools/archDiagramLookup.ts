/**
 * arch_diagram tool (tasks 6.1-6.2).
 *
 * Returns the structured diagram_data (components, connections, boundaries)
 * stored in the source pack for a curated pattern_id, so an agent's
 * architecture-diagram skill can render it. Independent of arch_pattern_lookup —
 * callable at any time with just a pattern_id.
 *
 * Unknown pattern ids, and the generic fallback pattern (which has no curated
 * source pack entry), yield a graceful unavailable response rather than a tool
 * error.
 */
import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { loadSourcePack } from "../data/loader.js";
import { withToolLogging } from "../logging/gelf.js";
import type { ArchDiagramInput, ArchDiagramOutput } from "../types/arch-diagram.js";

function unavailable(patternId: string, message: string): ArchDiagramOutput {
  return { pattern_id: patternId, diagram_data: null, available: false, message };
}

/** Core lookup — exported for tests and direct (non-MCP) callers. */
export function lookupArchDiagram(input: ArchDiagramInput): ArchDiagramOutput {
  const patternId = input.pattern_id.trim();
  if (!patternId) {
    return unavailable(input.pattern_id, "Empty pattern_id: provide a pattern identifier");
  }

  const index = loadSourcePack();
  const entry = index.byPatternId.get(patternId);
  if (!entry?.pattern) {
    return unavailable(
      patternId,
      `No diagram available: pattern_id "${patternId}" is not a curated pattern in the source pack`,
    );
  }
  const diagram = entry.pattern.diagram_data;
  if (!diagram) {
    return unavailable(patternId, `No diagram data stored for pattern "${patternId}"`);
  }
  return { pattern_id: entry.pattern.pattern_id, diagram_data: diagram, available: true };
}

export function registerArchDiagramLookup(server: McpServer): void {
  server.registerTool(
    "arch_diagram",
    {
      description:
        "Return structured diagram_data (components, connections, boundaries) for a curated " +
        "architecture pattern_id, ready for an architecture-diagram skill to render. Unknown " +
        "pattern ids return a graceful unavailable response rather than an error.",
      inputSchema: z.object({
        pattern_id: z
          .string()
          .describe('Curated pattern identifier, e.g. "media_agency_audience_measurement"'),
        data_stack: z
          .array(z.string())
          .optional()
          .describe('Data stack to annotate the diagram with, e.g. ["BigQuery", "Snowflake"]'),
      }),
    },
    withToolLogging("arch_diagram", async (args: ArchDiagramInput) => ({
      content: [{ type: "text", text: JSON.stringify(lookupArchDiagram(args)) }],
    })),
  );
}
