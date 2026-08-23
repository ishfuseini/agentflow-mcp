/**
 * tool_selection_lookup tool (tasks 4.2-4.5).
 *
 * Deterministic platform recommender: scores platform profiles against the
 * input's data stack, constraints, latency, and use-case keywords, then emits
 * a recommendation with cloud fit, constraint-aware reasoning, and
 * alternatives with when-to-prefer rationale.
 */
import type { FastMCP } from "fastmcp";
import { z } from "zod";
import { norm, overlapRatio } from "../data/loader.js";
import type {
  ToolSelectionLookupInput,
  ToolSelectionLookupOutput,
} from "../types/tool-selection.js";

interface PlatformProfile {
  name: string;
  stackTags: string[];
  cloud_fit: string;
  /** constraints (normalized) this platform supports */
  supports: string[];
  /** normalized constraint -> reasoning string */
  constraintReasoning: Record<string, string>;
  /** "batch" | "real-time" -> strength 0..1 */
  latencyFit: Record<string, number>;
  /** use-case keywords (normalized substring) -> affinity bonus */
  affinity: Array<[string, number]>;
  /** when-to-prefer rationale used in alternatives */
  preferWhen: string;
  /** one-line strength narrative included in reasoning when this platform wins */
  strength: string;
}

const PLATFORMS: PlatformProfile[] = [
  {
    name: "Databricks",
    stackTags: ["databricks"],
    cloud_fit: "Azure or AWS",
    supports: [
      "hipaa",
      "phi",
      "pii",
      "us data residency",
      "eu data residency",
      "saml sso",
      "audit logs",
      "regulated financial data",
    ],
    constraintReasoning: {
      hipaa: "HIPAA compliance available on BAA-covered Azure/AWS deployments",
      phi: "PHI protection via Unity Catalog row/column policies and encryption",
      pii: "PII masking and tagging enforced in Unity Catalog",
      "us data residency":
        "US data residency available by pinning workspaces and storage to US regions",
      "eu data residency": "EU data residency available on EU Azure/AWS regions",
      "saml sso": "SAML SSO federation via Entra ID or Okta",
      "audit logs": "Audit logs via workspace + Unity Catalog event history",
      "regulated financial data":
        "Regulated financial data governed with lineage and access controls",
    },
    latencyFit: { batch: 1, "real-time": 1 },
    affinity: [
      ["patient", 0.5],
      ["clinical", 0.5],
      ["healthcare", 0.5],
      ["lakehouse", 0.5],
      ["personalization", 0.5],
      ["real-time", 0.5],
      ["recommendation", 0.4],
      ["ml", 0.3],
    ],
    preferWhen:
      "strong lakehouse + ML workloads with streaming ingestion and Unity Catalog governance",
    strength:
      "Strong lakehouse fit — unified batch and streaming on Delta Lake with Unity Catalog governance",
  },
  {
    name: "Snowflake",
    stackTags: ["snowflake"],
    cloud_fit: "AWS, Azure, or GCP",
    supports: [
      "hipaa",
      "phi",
      "pii",
      "us data residency",
      "eu data residency",
      "saml sso",
      "audit logs",
      "regulated financial data",
    ],
    constraintReasoning: {
      hipaa: "HIPAA compliance supported on all three major clouds (BAA available)",
      phi: "PHI protected via masking policies and row access policies",
      pii: "PII governed with tagging policies and dynamic masking",
      "us data residency": "US data residency via US region selection",
      "eu data residency": "EU data residency via EU regions (e.g. eu-central-1)",
      "saml sso": "SAML SSO federation supported with any major IdP",
      "audit logs": "Access History and LOGIN_HISTORY provide queryable audit trails",
      "regulated financial data":
        "Regulated financial data handled with governance features and Time Travel evidence",
    },
    latencyFit: { batch: 1, "real-time": 0.5 },
    affinity: [
      ["governance", 0.5],
      ["regulated", 0.5],
      ["financial", 0.4],
      ["reporting", 0.4],
      ["warehouse", 0.3],
      ["sharing", 0.3],
    ],
    preferWhen:
      "warehouse-first analytics with strong data sharing, governance, and multi-cloud neutrality",
    strength:
      "Strong governance model — policy-based masking, tagging, and Time Travel for audit evidence",
  },
  {
    name: "BigQuery",
    stackTags: ["bigquery"],
    cloud_fit: "GCP",
    supports: [
      "hipaa",
      "phi",
      "pii",
      "us data residency",
      "eu data residency",
      "saml sso",
      "audit logs",
    ],
    constraintReasoning: {
      hipaa: "HIPAA compliance available on GCP under a BAA",
      phi: "PHI protected with column-level security and Cloud DLP integration",
      pii: "PII governed via column-level access control and policy tags",
      "us data residency": "US data residency via US multi-regions",
      "eu data residency": "EU data residency satisfied by EU multi-regions (eu / europe-west)",
      "saml sso": "SAML SSO via Cloud Identity federation",
      "audit logs": "Audit logs via Cloud Audit Logs and INFORMATION_SCHEMA jobs views",
    },
    latencyFit: { batch: 1, "real-time": 0.5 },
    affinity: [
      ["audience", 0.5],
      ["measurement", 0.5],
      ["marketing", 0.4],
      ["advertising", 0.4],
      ["media", 0.4],
      ["serverless", 0.3],
    ],
    preferWhen:
      "serverless analytics on GCP with governed data sharing (Analytics Hub) and EU residency controls",
    strength:
      "Serverless analytics fit — governed sharing via Analytics Hub with EU residency controls",
  },
  {
    name: "AWS",
    stackTags: ["aws"],
    cloud_fit: "AWS",
    supports: ["hipaa", "pii", "us data residency", "eu data residency", "saml sso", "audit logs"],
    constraintReasoning: {
      hipaa: "HIPAA-eligible services documented in the AWS Business Associate Addendum",
      pii: "PII protection via KMS encryption, Macie discovery, and IAM controls",
      "us data residency": "US data residency via US regions",
      "eu data residency": "EU data residency via EU regions (e.g. eu-central-1)",
      "saml sso": "SAML SSO via IAM Identity Center",
      "audit logs": "CloudTrail provides immutable audit logging",
    },
    latencyFit: { batch: 1, "real-time": 1 },
    affinity: [
      ["ecosystem", 0.3],
      ["serverless", 0.2],
    ],
    preferWhen: "broadest managed-service ecosystem with per-service residency controls",
    strength:
      "Broad service ecosystem — per-service residency controls with CloudTrail audit evidence",
  },
  {
    name: "Azure",
    stackTags: ["azure"],
    cloud_fit: "Azure",
    supports: ["hipaa", "pii", "us data residency", "eu data residency", "saml sso", "audit logs"],
    constraintReasoning: {
      hipaa: "HIPAA compliance under the Microsoft BAA (Azure compliance offerings)",
      pii: "PII protection via Purview classification and Entra ID controls",
      "us data residency": "US data residency via US regions",
      "eu data residency": "EU data residency via EU regions and data boundaries",
      "saml sso": "SAML SSO native via Entra ID",
      "audit logs": "Azure Monitor and activity logs provide audit trails",
    },
    latencyFit: { batch: 1, "real-time": 0.75 },
    affinity: [
      ["microsoft", 0.4],
      ["enterprise microsoft", 0.4],
      ["office", 0.2],
    ],
    preferWhen: "Microsoft-centric enterprises with Entra ID identity and Purview governance",
    strength: "Microsoft-native fit — Entra ID identity with Purview governance integration",
  },
  {
    name: "GCP",
    stackTags: ["gcp"],
    cloud_fit: "GCP",
    supports: ["hipaa", "pii", "us data residency", "eu data residency", "saml sso", "audit logs"],
    constraintReasoning: {
      hipaa: "HIPAA compliance under the GCP BAA (covered services)",
      pii: "PII protection via Cloud DLP and IAM conditions",
      "us data residency": "US data residency via US multi-regions",
      "eu data residency": "EU data residency via EU multi-regions",
      "saml sso": "SAML SSO via Cloud Identity",
      "audit logs": "Cloud Audit Logs provide admin and data access trails",
    },
    latencyFit: { batch: 1, "real-time": 1 },
    affinity: [
      ["serverless", 0.3],
      ["data", 0.2],
    ],
    preferWhen: "data-analytics-first cloud with strong serverless and streaming primitives",
    strength: "Analytics-first cloud — serverless and streaming primitives with Cloud DLP",
  },
];

function score(input: ToolSelectionLookupInput, p: PlatformProfile): number {
  const stack = 2.0 * overlapRatio(input.data_stack, p.stackTags);
  const constraintSupport =
    1.0 *
    (input.constraints.length
      ? input.constraints.filter((c) => p.supports.includes(norm(c))).length /
        input.constraints.length
      : 0);
  const latency = input.latency ? 0.75 * (p.latencyFit[norm(input.latency)] ?? 0) : 0;
  const uc = norm(input.use_case);
  const affinity = p.affinity.reduce((acc, [kw, bonus]) => acc + (uc.includes(kw) ? bonus : 0), 0);
  return stack + constraintSupport + latency + affinity;
}

/** Core recommendation — exported for tests and direct callers. */
export function lookupToolSelection(input: ToolSelectionLookupInput): ToolSelectionLookupOutput {
  const ranked = [...PLATFORMS]
    .map((p) => ({ p, s: score(input, p) }))
    .sort((a, b) => b.s - a.s || a.p.name.localeCompare(b.p.name));

  const top = ranked[0]?.p;
  if (!top) throw new Error("no platform profiles configured");
  const rest = ranked.slice(1);

  // constraint-aware reasoning (task 4.4): reference every input constraint
  const reasoning: string[] = [];
  const uc = norm(input.use_case);
  reasoning.push(
    `${top.name} scores highest for "${input.use_case}" on data-stack fit, constraint support, and ${input.latency ? `${input.latency} latency` : "workload profile"}`,
  );
  reasoning.push(top.strength);
  for (const c of input.constraints) {
    const nc = norm(c);
    if (nc === "real-time" || nc === "real-time personalization") continue; // latency, not governance
    reasoning.push(
      top.constraintReasoning[nc] ??
        `${c}: no explicit ${top.name} support documented — validate with the vendor before committing`,
    );
  }
  if (input.latency) {
    const fit = top.latencyFit[norm(input.latency)] ?? 0;
    reasoning.push(
      fit >= 1
        ? `${input.latency} latency is a first-class capability on ${top.name}${norm(input.latency) === "real-time" ? " with streaming ingestion and low-latency serving" : ""}`
        : `${input.latency} latency is partially supported on ${top.name} — validate serving-path requirements`,
    );
  }
  if (uc.includes("audience") || uc.includes("measurement")) {
    const snow = input.data_stack.some((s) => norm(s) === "snowflake");
    if (snow && top.name !== "Snowflake") {
      reasoning.push(
        `Snowflake pairs well alongside ${top.name} for governed cross-client reporting`,
      );
    }
  }

  // alternatives (task 4.3): next two ranked platforms with when-to-prefer rationale
  const alternatives = rest.slice(0, 2).map((r) => `${r.p.name} — ${r.p.preferWhen}`);

  return {
    recommended_platform: top.name,
    cloud_fit: top.cloud_fit,
    reasoning,
    alternatives,
  };
}

export function registerToolSelectionLookup(server: FastMCP): void {
  server.addTool({
    name: "tool_selection_lookup",
    description:
      "Recommend a data platform based on use case, data stack, constraints (HIPAA, PII, " +
      "data residency, SSO/SAML), and latency needs — with cloud fit, reasoning, and alternatives.",
    parameters: z.object({
      use_case: z
        .string()
        .describe('What the enterprise wants to build, e.g. "AI-powered patient insights"'),
      data_stack: z.array(z.string()).describe("Platforms/tools in play or under consideration"),
      constraints: z.array(z.string()).describe("Governance/compliance constraints"),
      latency: z.string().optional().describe("Latency need: batch or real-time"),
    }),
    execute: async (args: ToolSelectionLookupInput) => JSON.stringify(lookupToolSelection(args)),
  });
}
