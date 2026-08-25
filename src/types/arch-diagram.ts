/**
 * Input/output types for the arch_diagram tool.
 * Generates structured diagram_data (components, connections, boundaries) for a
 * given architecture pattern and data stack, independent of other tools.
 */
import type { DiagramData } from "./source.js";

export interface ArchDiagramInput {
  /** Pattern identifier, e.g. "media_agency_audience_measurement". */
  pattern_id: string;
  /**
   * Optional data stack the diagram will be rendered for, e.g. ["BigQuery", "Snowflake"].
   * Currently informational: the curated diagram_data is returned unmodified.
   */
  data_stack?: string[];
}

export interface ArchDiagramOutput {
  /** Pattern identifier the diagram was generated for. */
  pattern_id: string;
  /** Structured diagram data for rendering; null when unavailable. */
  diagram_data: DiagramData | null;
  /** False when no diagram could be generated. */
  available: boolean;
  /** Present on unavailable responses. */
  message?: string;
}
