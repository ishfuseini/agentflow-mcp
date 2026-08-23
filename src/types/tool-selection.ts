/**
 * Input/output types for the tool_selection_lookup tool (task 4.1).
 */

export interface ToolSelectionLookupInput {
  /** What the enterprise wants to build, e.g. "AI-powered patient insights" */
  use_case: string;
  /** Platforms/tools already in play or under consideration */
  data_stack: string[];
  /** Governance/compliance constraints, e.g. ["HIPAA", "PHI", "EU data residency"] */
  constraints: string[];
  /** Latency need: batch | real-time (optional) */
  latency?: string;
}

export interface ToolSelectionLookupOutput {
  recommended_platform: string;
  /** Where it runs well, e.g. "Azure or AWS", "GCP" */
  cloud_fit: string;
  /** Constraint-aware reasoning strings, referencing input constraints */
  reasoning: string[];
  /** Alternative platforms with when-to-prefer rationale */
  alternatives: string[];
}
