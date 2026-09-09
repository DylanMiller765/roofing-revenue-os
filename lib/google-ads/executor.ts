import { evaluateChangePolicy } from "./policy";
import type {
  ChangeAuditEntry,
  ChangeAuditStore,
  ChangeProposal,
  GoogleAdsMutationAdapter,
  GoogleAdsMutationResult
} from "./types";

export class ControlledGoogleAdsExecutor {
  constructor(
    private readonly adapter: GoogleAdsMutationAdapter,
    private readonly auditStore: ChangeAuditStore,
    private readonly actor = "Codex Ads Analyst"
  ) {}

  async execute(proposal: ChangeProposal): Promise<GoogleAdsMutationResult | null> {
    const decision = evaluateChangePolicy(proposal);
    const auditPrefix = `AUD-${proposal.id}-${Date.now()}`;
    const baseAudit: Omit<ChangeAuditEntry, "id" | "status"> = {
      proposalId: proposal.id,
      timestamp: new Date().toISOString(),
      actor: this.actor,
      actionType: proposal.actionType,
      resourceType: proposal.resourceType,
      resourceId: proposal.resourceId,
      previousValue: proposal.previousValue,
      newValue: proposal.newValue,
      reason: proposal.reason,
      supportingMetrics: proposal.supportingMetrics,
      confidence: proposal.confidence,
      risk: proposal.risk,
      approvalStatus: proposal.approval ? "approved" : decision.requiresApproval ? "missing" : "not-required",
      rollbackPlan: proposal.rollbackPlan,
      policyReasons: decision.reasons,
      approval: proposal.approval
    };

    if (!decision.allowed) {
      await this.auditStore.append({ ...baseAudit, id: `${auditPrefix}-blocked`, status: "blocked" });
      return null;
    }

    await this.auditStore.append({ ...baseAudit, id: `${auditPrefix}-authorized`, status: "authorized" });

    try {
      await this.adapter.mutate(proposal, { validateOnly: true });
      await this.auditStore.append({ ...baseAudit, id: `${auditPrefix}-validated`, status: "validated" });
      const result = await this.adapter.mutate(proposal, { validateOnly: false });
      await this.auditStore.append({
        ...baseAudit,
        id: `${auditPrefix}-executed`,
        status: "executed",
        externalRequestId: result.externalRequestId,
        result
      });
      return result;
    } catch (error) {
      await this.auditStore.append({
        ...baseAudit,
        id: `${auditPrefix}-failed`,
        status: "failed",
        error: error instanceof Error ? error.message : "Unknown mutation failure"
      });
      throw error;
    }
  }
}

export class DisabledGoogleAdsMutationAdapter implements GoogleAdsMutationAdapter {
  async mutate(): Promise<never> {
    throw new Error("No live Google Ads mutation adapter or credentials are configured.");
  }
}

export class InMemoryAuditStore implements ChangeAuditStore {
  readonly entries: ChangeAuditEntry[] = [];

  async append(entry: ChangeAuditEntry): Promise<void> {
    this.entries.push(entry);
  }
}
