/**
 * Input/output types for the arch_pattern_references tool.
 * Returns the source pack references that informed a pattern match, independent
 * of other tools.
 */
import type { SourceRef } from "./arch-pattern.js";

export interface ArchPatternReferencesInput {
  /** Pattern identifier, e.g. "media_agency_audience_measurement". */
  pattern_id: string;
  /** Original industry code used to find the match. */
  industry: string;
  /** Original candidate platforms/tools used to find the match. */
  data_stack: string[];
  /** Original cloud preference used to find the match. */
  cloud?: string;
  /** Original governance/compliance constraints used to find the match. */
  constraints: string[];
}

export interface ArchPatternReferencesOutput {
  /** Pattern identifier the references were resolved for. */
  pattern_id: string;
  /** Source pack references that informed the match; empty when none. */
  source_references: SourceRef[];
  /** False when references could not be resolved. */
  available: boolean;
  /** Present on unavailable responses. */
  message?: string;
}
