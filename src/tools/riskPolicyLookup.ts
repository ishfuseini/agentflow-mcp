/**
 * risk_policy_lookup tool (tasks 5.2-5.5).
 *
 * Deterministic risk and governance checks: required controls, risk flags,
 * and human-in-the-loop triggers derived from industry, data classification,
 * region, deployment model, and governance constraints.
 */
import type { FastMCP } from "fastmcp";
import { z } from "zod";
import { norm } from "../data/loader.js";
import type { RiskPolicyLookupInput, RiskPolicyLookupOutput } from "../types/risk-policy.js";

const REGULATED_TYPES = ["phi", "pii", "regulated financial data"] as const;

/** Core recommendation — exported for tests and direct callers. */
export function lookupRiskPolicy(input: RiskPolicyLookupInput): RiskPolicyLookupOutput {
  const classes = input.data_classification.map(norm);
  const constraints = (input.constraints ?? []).map(norm);
  const region = norm(input.region);

  const has = (t: string) => classes.includes(norm(t));
  const hasPhi = has("PHI");
  const hasPii = has("PII");
  const hasRfd = has("regulated financial data");
  const hasNonSensitive = has("non-sensitive");
  const crossClient = constraints.includes("cross-client governance");
  const euResidency = constraints.includes("eu data residency") || region === "eu";

  // --- required controls (task 5.2): enterprise baseline + classification/constraint additions
  const controls: string[] = ["RBAC", "audit logs", "data lineage", "SAML SSO"];
  if (norm(input.deployment) === "cloud") {
    controls.push("network isolation (VPC/private endpoints)");
  }
  if (hasPhi) {
    controls.push(
      "encryption at rest and in transit",
      "BAA with cloud provider",
      "de-identification pipeline",
    );
  }
  if (hasPii) {
    controls.push("PII masking and tokenization");
  }
  if (hasRfd) {
    controls.push("encryption at rest and in transit", "immutable transaction audit trail");
  }
  if (crossClient) {
    controls.push("tenant isolation", "per-client access policies");
  }
  if (euResidency) {
    controls.push("EU region data pinning");
  }

  // --- risk flags: regulated data gets the AI-governance flag pair
  const flags: string[] = [];
  const regulated = classes.filter((c) => (REGULATED_TYPES as readonly string[]).includes(c));
  if (regulated.length > 0) {
    flags.push("prompt leakage", "overbroad analyst access");
  }
  if (hasPhi) flags.push("PHI exposure in AI outputs");
  if (hasRfd) flags.push("cross-region replication");
  if (crossClient) flags.push("cross-client data separation");
  if (euResidency) flags.push("cross-region data transfer");
  if (regulated.length === 0 && !crossClient && !euResidency) {
    flags.push(
      hasNonSensitive
        ? "low sensitivity — standard enterprise controls apply"
        : "no regulated data classified — confirm data classification before signoff",
    );
  }

  // --- HITL trigger (task 5.3): regulated data types or cross-client governance
  // constraints force human review before architecture signoff.
  const hitlRequired = regulated.length > 0 || crossClient;
  let reviewReason: string | undefined;
  if (hitlRequired) {
    const parts: string[] = [];
    if (hasPhi)
      parts.push(
        "PHI access requires human approval before final architecture signoff (HIPAA-regulated data)",
      );
    if (hasPii) parts.push("PII handling requirements apply to personal data in scope");
    if (hasRfd)
      parts.push("financial data governance requirements apply (regulated financial data)");
    if (crossClient)
      parts.push("cross-client governance requires human review for tenant data isolation signoff");
    reviewReason = `Human-in-the-loop review required before architecture signoff: ${parts.join("; ")}`;
  }

  return {
    required_controls: [...new Set(controls)],
    risk_flags: [...new Set(flags)],
    hitl_required: hitlRequired,
    review_reason: reviewReason,
  };
}

export function registerRiskPolicyLookup(server: FastMCP): void {
  server.addTool({
    name: "risk_policy_lookup",
    description:
      "Return required controls, risk flags, and human-in-the-loop triggers for an architecture " +
      "based on industry, data classification (PHI, PII, regulated financial data), region, " +
      "deployment model, and governance constraints.",
    parameters: z.object({
      industry: z
        .string()
        .describe("Industry, e.g. healthcare, financial_services, media_agency, retail"),
      data_classification: z
        .array(z.string())
        .describe(
          'Data classifications in scope, e.g. ["PHI", "PII"], ["regulated financial data"], ["non-sensitive"]',
        ),
      region: z.string().describe("Data region, e.g. US or EU"),
      deployment: z.string().describe("Deployment model: cloud, on-prem, or hybrid"),
      constraints: z
        .array(z.string())
        .optional()
        .describe(
          'Governance constraints from the architecture brief, e.g. ["cross-client governance", "EU data residency"]',
        ),
    }),
    execute: async (args: RiskPolicyLookupInput) => JSON.stringify(lookupRiskPolicy(args)),
  });
}
