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
    tracking: reliableTracking,
    ...overrides
  };
}

describe("controlled Google Ads write policy", () => {
  it("requires separately scoped human approval even for low-risk changes", () => {
    const decision = evaluateChangePolicy(proposal());
    expect(decision.allowed).toBe(false);
    expect(decision.requiresApproval).toBe(true);
    expect(decision.reasons.join(" ")).toContain("explicit human approval");
  });

  it("allows a supported approved low-risk change with reliable tracking", () => {
    const decision = evaluateChangePolicy(proposal({
      approval: { approvedBy: "operator@example.test", approvedAt: "2026-09-08T12:00:00Z", scope: "this-change-only" }
    }));
    expect(decision).toEqual({ allowed: true, requiresApproval: true, validateOnly: false, reasons: [] });
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

  it("records a complete audit entry for a blocked change without calling the adapter", async () => {
    const adapter: GoogleAdsMutationAdapter = { mutate: vi.fn() };
    const auditStore = new InMemoryAuditStore();
    const executor = new ControlledGoogleAdsExecutor(adapter, auditStore);

    await expect(executor.execute(proposal())).resolves.toBeNull();
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

  it("executes and audits only a separately approved change", async () => {
    const mutate = vi.fn().mockResolvedValue({ externalRequestId: "req-1", resourceNames: ["customers/mock/criteria/1"] });
    const auditStore = new InMemoryAuditStore();
    const executor = new ControlledGoogleAdsExecutor({ mutate }, auditStore);
    const approved = proposal({
      approval: { approvedBy: "operator@example.test", approvedAt: "2026-09-08T12:00:00Z", scope: "this-change-only" }
    });

    await expect(executor.execute(approved)).resolves.toMatchObject({ externalRequestId: "req-1" });
    expect(mutate).toHaveBeenCalledWith(approved, { validateOnly: false });
    expect(auditStore.entries).toHaveLength(2);
    expect(auditStore.entries[0]).toMatchObject({ status: "validated" });
    expect(auditStore.entries[1]).toMatchObject({ status: "executed", externalRequestId: "req-1" });
  });
});
