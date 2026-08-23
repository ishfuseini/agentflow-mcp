/**
 * Input/output types for the risk_policy_lookup tool (task 5.1).
 */

export interface RiskPolicyLookupInput {
  /** e.g. "healthcare", "financial_services", "media_agency", "retail" */
  industry: string;
  /** Data classifications in scope, e.g. ["PHI", "PII"], ["regulated financial data"], ["non-sensitive"] */
  data_classification: string[];
  /** e.g. "US", "EU" */
  region: string;
  /** e.g. "cloud", "on-prem", "hybrid" */
  deployment: string;
  /** Governance constraints from the architecture brief (optional), e.g. ["cross-client governance", "EU data residency"] */
  constraints?: string[];
}

export interface RiskPolicyLookupOutput {
  /** Controls the architecture must include before signoff */
  required_controls: string[];
  /** Risk flags for the reviewing agent to address */
  risk_flags: string[];
  /** True when regulated data requires human-in-the-loop review */
  hitl_required: boolean;
  /** Human-readable reason for HITL review; present when hitl_required is true */
  review_reason?: string;
}
