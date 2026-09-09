import { describe, expect, it, vi } from "vitest";
import { ControlledGoogleAdsExecutor, InMemoryAuditStore } from "./executor";
import { evaluateChangePolicy } from "./policy";
import type { ChangeProposal, GoogleAdsMutationAdapter } from "./types";

const reliableTracking = {
  attributionCoverage: 0.95,
  crmOutcomeCoverage: 0.9,
  googleCrmLeadMismatchRate: 0.05,
  primaryConversionVerified: true
};

function proposal(overrides: Partial<ChangeProposal> = {}): ChangeProposal {
  return {
    id: "CHANGE-1",
    accountId: "mock-account",
    campaignId: "campaign-1",
    actionType: "add-negative-keyword",
    resourceType: "keyword",
    previousValue: null,
    newValue: { text: "roofing jobs", matchType: "PHRASE" },
    reason: "Meaningful spend with no qualified homeowner outcome",
    supportingMetrics: { spend: 126, qualifiedLeads: 0 },
    confidence: "high",
    risk: "low",
    evidenceSufficient: true,
    reversible: true,
    rollbackPlan: "Remove the newly added negative keyword.",
    tracking: reliableTracking,
    ...overrides
  };
}

describe("controlled Google Ads write policy", () => {
  it("auto-authorizes a reversible low-risk change with sufficient high-confidence evidence", () => {
    const decision = evaluateChangePolicy(proposal());
    expect(decision).toEqual({ allowed: true, requiresApproval: false, validateOnly: false, reasons: [] });
  });

  it("does not turn an optional low-risk approval into a universal approval requirement", () => {
    const decision = evaluateChangePolicy(proposal({
      approval: { approvedBy: "operator@example.test", approvedAt: "2026-09-08T12:00:00Z", scope: "this-change-only" }
    }));
    expect(decision).toEqual({ allowed: true, requiresApproval: false, validateOnly: false, reasons: [] });
  });

  it("blocks optimization when tracking quality is uncertain", () => {
    const decision = evaluateChangePolicy(proposal({
      tracking: { ...reliableTracking, attributionCoverage: 0.5 },
      approval: { approvedBy: "operator@example.test", approvedAt: "2026-09-08T12:00:00Z", scope: "this-change-only" }
    }));
    expect(decision.allowed).toBe(false);
    expect(decision.reasons[0]).toContain("Tracking quality");
  });

  it("enforces the rolling account and per-change campaign budget caps", () => {
    const decision = evaluateChangePolicy(proposal({
      actionType: "adjust-campaign-budget",
      resourceType: "campaign-budget",
      accountDailyBudgetAtWindowStart: 1000,
      proposedAccountDailyBudget: 1140,
      currentCampaignDailyBudget: 100,
      proposedCampaignDailyBudget: 121,
      approval: { approvedBy: "operator@example.test", approvedAt: "2026-09-08T12:00:00Z", scope: "this-change-only" }
    }));
    expect(decision.allowed).toBe(false);
    expect(decision.reasons.join(" ")).toContain("20%");
  });

  it("allows an approved high-risk account increase above 15% when the campaign step stays within 20%", () => {
    const decision = evaluateChangePolicy(proposal({
      actionType: "adjust-campaign-budget",
      resourceType: "campaign-budget",
      risk: "high",
      accountDailyBudgetAtWindowStart: 1000,
      proposedAccountDailyBudget: 1160,
      currentCampaignDailyBudget: 100,
      proposedCampaignDailyBudget: 115,
      approval: { approvedBy: "operator@example.test", approvedAt: "2026-09-08T12:00:00Z", scope: "this-change-only" }
    }));
    expect(decision.allowed).toBe(true);
  });

  it("blocks an unapproved account increase above 15% in 24 hours", () => {
    const decision = evaluateChangePolicy(proposal({
      actionType: "adjust-campaign-budget",
      resourceType: "campaign-budget",
      accountDailyBudgetAtWindowStart: 1000,
      proposedAccountDailyBudget: 1160,
      currentCampaignDailyBudget: 100,
      proposedCampaignDailyBudget: 115
    }));
    expect(decision.reasons.join(" ")).toContain("15%");
  });

  it("requires high confidence for medium-risk execution", () => {
    const decision = evaluateChangePolicy(proposal({
      risk: "medium",
      confidence: "medium",
      approval: { approvedBy: "operator@example.test", approvedAt: "2026-09-08T12:00:00Z", scope: "this-change-only" }
    }));
    expect(decision.allowed).toBe(false);
    expect(decision.reasons.join(" ")).toContain("high-confidence");
  });

  it("auto-authorizes medium risk only with strong evidence, sufficient samples, and rollback", () => {
    const decision = evaluateChangePolicy(proposal({
      risk: "medium",
      sampleSize: 30,
      minimumSampleSize: 20
    }));
    expect(decision).toEqual({ allowed: true, requiresApproval: false, validateOnly: false, reasons: [] });
  });

  it("blocks automatic execution when rollback is unavailable", () => {
    const decision = evaluateChangePolicy(proposal({ reversible: false, rollbackPlan: undefined }));
    expect(decision.allowed).toBe(false);
    expect(decision.reasons.join(" ")).toContain("rollback plan");
  });

  it("blocks claim-bearing ad creation until every claim is verified", () => {
    const unverified = evaluateChangePolicy(proposal({
      actionType: "create-responsive-search-ad",
      resourceType: "ad-group-ad",
      risk: "medium",
      contentClaimsVerified: false,
      approval: { approvedBy: "operator@example.test", approvedAt: "2026-09-08T12:00:00Z", scope: "this-change-only" }
    }));
    expect(unverified.allowed).toBe(false);
    expect(unverified.reasons.join(" ")).toContain("claims");
  });

  it("rejects delete actions at runtime as well as in the type system", () => {
    const unsafe = proposal({
      actionType: "delete-campaign" as ChangeProposal["actionType"],
      approval: { approvedBy: "operator@example.test", approvedAt: "2026-09-08T12:00:00Z", scope: "this-change-only" }
    });
    const decision = evaluateChangePolicy(unsafe);
    expect(decision.allowed).toBe(false);
    expect(decision.reasons.join(" ")).toContain("delete operations");
  });

  it("never changes conversion tracking unless broken, high-risk, and approved", () => {
    const decision = evaluateChangePolicy(proposal({
      actionType: "change-conversion-tracking",
      resourceType: "conversion-action",
      risk: "high",
      approval: { approvedBy: "operator@example.test", approvedAt: "2026-09-08T12:00:00Z", scope: "this-change-only" }
    }));
    expect(decision.allowed).toBe(false);
    expect(decision.reasons.join(" ")).toContain("demonstrably broken");
  });

  it("blocks a major change supported by a tiny sample", () => {
    const decision = evaluateChangePolicy(proposal({
      actionType: "restructure-campaign",
      resourceType: "campaign",
      risk: "high",
      sampleSize: 3,
      minimumSampleSize: 20,
      approval: { approvedBy: "operator@example.test", approvedAt: "2026-09-08T12:00:00Z", scope: "this-change-only" }
    }));
    expect(decision.allowed).toBe(false);
    expect(decision.reasons.join(" ")).toContain("sample is too small");
  });

  it("requires approval for high-risk changes even when all evidence gates pass", () => {
    const highRisk = proposal({
      actionType: "create-campaign",
      resourceType: "campaign",
      risk: "high",
      contentClaimsVerified: true
    });
    const missingApproval = evaluateChangePolicy(highRisk);
    const approved = evaluateChangePolicy({
      ...highRisk,
      approval: { approvedBy: "operator@example.test", approvedAt: "2026-09-08T12:00:00Z", scope: "this-change-only" }
    });

    expect(missingApproval.allowed).toBe(false);
    expect(missingApproval.requiresApproval).toBe(true);
    expect(approved.allowed).toBe(true);
  });

  it("records a complete audit entry for a blocked change without calling the adapter", async () => {
    const adapter: GoogleAdsMutationAdapter = { mutate: vi.fn() };
    const auditStore = new InMemoryAuditStore();
    const executor = new ControlledGoogleAdsExecutor(adapter, auditStore);

    await expect(executor.execute(proposal({ evidenceSufficient: false }))).resolves.toBeNull();
    expect(adapter.mutate).not.toHaveBeenCalled();
    expect(auditStore.entries[0]).toMatchObject({
      proposalId: "CHANGE-1",
      previousValue: null,
      newValue: { text: "roofing jobs", matchType: "PHRASE" },
      reason: expect.any(String),
      supportingMetrics: { spend: 126, qualifiedLeads: 0 },
      confidence: "high",
      status: "blocked"
    });
    expect(auditStore.entries[0].timestamp).toEqual(expect.any(String));
  });

  it("provider-validates, executes, and audits an auto-authorized low-risk change", async () => {
    const mutate = vi.fn().mockResolvedValue({ externalRequestId: "req-1", resourceNames: ["customers/mock/criteria/1"] });
    const auditStore = new InMemoryAuditStore();
    const executor = new ControlledGoogleAdsExecutor({ mutate }, auditStore);
    const automatic = proposal();

    await expect(executor.execute(automatic)).resolves.toMatchObject({ externalRequestId: "req-1" });
    expect(mutate).toHaveBeenNthCalledWith(1, automatic, { validateOnly: true });
    expect(mutate).toHaveBeenNthCalledWith(2, automatic, { validateOnly: false });
    expect(auditStore.entries).toHaveLength(3);
    expect(auditStore.entries[0]).toMatchObject({ status: "authorized", approvalStatus: "not-required" });
    expect(auditStore.entries[1]).toMatchObject({ status: "validated" });
    expect(auditStore.entries[2]).toMatchObject({ status: "executed", externalRequestId: "req-1", result: { externalRequestId: "req-1" } });
  });

  it("never executes when provider validation fails and preserves the failure audit", async () => {
    const mutate = vi.fn().mockRejectedValue(new Error("Provider validation rejected the operation"));
    const auditStore = new InMemoryAuditStore();
    const executor = new ControlledGoogleAdsExecutor({ mutate }, auditStore);
    const automatic = proposal();

    await expect(executor.execute(automatic)).rejects.toThrow("Provider validation rejected");
    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledWith(automatic, { validateOnly: true });
    expect(auditStore.entries).toHaveLength(2);
    expect(auditStore.entries[0]).toMatchObject({ status: "authorized" });
    expect(auditStore.entries[1]).toMatchObject({ status: "failed", error: "Provider validation rejected the operation" });
  });
});
