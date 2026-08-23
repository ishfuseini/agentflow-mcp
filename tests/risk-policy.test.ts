/**
 * Unit tests for risk_policy_lookup (task 8.3): HITL triggers for PHI, PII,
 * and regulated financial data, plus baseline controls.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { lookupRiskPolicy } from "../src/tools/riskPolicyLookup.js";
import type { RiskPolicyLookupInput } from "../src/types/risk-policy.js";

const BASE_CONTROLS = ["RBAC", "audit logs", "data lineage", "SAML SSO"];

const healthcare: RiskPolicyLookupInput = {
  industry: "healthcare",
  data_classification: ["PHI", "PII"],
  region: "US",
  deployment: "cloud",
};

test("healthcare returns baseline controls and HITL", () => {
  const out = lookupRiskPolicy(healthcare);
  for (const c of BASE_CONTROLS) {
    assert.ok(out.required_controls.includes(c), `control ${c}`);
  }
  assert.equal(out.hitl_required, true);
  assert.ok(out.review_reason && out.review_reason.length > 0);
  assert.ok(out.risk_flags.includes("PHI exposure in AI outputs"));
});

test("PHI alone triggers HITL with review reason", () => {
  const out = lookupRiskPolicy({
    industry: "healthcare",
    data_classification: ["PHI"],
    region: "US",
    deployment: "cloud",
  });
  assert.equal(out.hitl_required, true);
  assert.match(out.review_reason ?? "", /PHI/);
});

test("PII alone triggers HITL with review reason", () => {
  const out = lookupRiskPolicy({
    industry: "media_agency",
    data_classification: ["PII"],
    region: "EU",
    deployment: "cloud",
  });
  assert.equal(out.hitl_required, true);
  assert.match(out.review_reason ?? "", /PII/);
});

test("regulated financial data alone triggers HITL with review reason", () => {
  const out = lookupRiskPolicy({
    industry: "financial_services",
    data_classification: ["regulated financial data"],
    region: "US",
    deployment: "cloud",
  });
  assert.equal(out.hitl_required, true);
  assert.match(out.review_reason ?? "", /financial/);
  assert.ok(out.required_controls.includes("immutable transaction audit trail"));
});

test("non-sensitive data does not trigger HITL", () => {
  const out = lookupRiskPolicy({
    industry: "retail",
    data_classification: ["non-sensitive"],
    region: "US",
    deployment: "cloud",
  });
  assert.equal(out.hitl_required, false);
  assert.equal(out.review_reason, undefined);
});

test("cross-client governance adds tenant isolation, risk flag, and HITL", () => {
  const out = lookupRiskPolicy({
    industry: "media_agency",
    data_classification: ["non-sensitive"],
    region: "EU",
    deployment: "cloud",
    constraints: ["cross-client governance", "EU data residency"],
  });
  assert.ok(out.required_controls.includes("tenant isolation"));
  assert.ok(out.risk_flags.includes("cross-client data separation"));
  assert.ok(out.required_controls.includes("EU region data pinning"));
  assert.equal(out.hitl_required, true);
  assert.match(out.review_reason ?? "", /cross-client/);
});

test("every response includes required schema fields", () => {
  const out = lookupRiskPolicy(healthcare);
  assert.ok(Array.isArray(out.required_controls) && out.required_controls.length > 0);
  assert.ok(Array.isArray(out.risk_flags));
  assert.equal(typeof out.hitl_required, "boolean");
});
