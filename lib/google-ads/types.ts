import type { Confidence, Evidence, TrackingHealth } from "../analyst/types";

export type GoogleAdsActionType =
  | "create-campaign"
  | "create-ad-group"
  | "create-keyword"
  | "create-responsive-search-ad"
  | "add-negative-keyword"
  | "pause-entity"
  | "adjust-bid"
  | "adjust-campaign-budget"
  | "restructure-campaign"
  | "create-experiment"
  | "switch-bidding-strategy"
  | "change-geographic-targeting"
  | "launch-service-category"
  | "change-conversion-tracking";

export type ChangeRisk = "low" | "medium" | "high";

export type ChangeProposal = {
  id: string;
  accountId: string;
  campaignId?: string;
  actionType: GoogleAdsActionType;
  resourceType: string;
  resourceId?: string;
  previousValue: unknown;
  newValue: unknown;
  reason: string;
  supportingMetrics: Evidence;
  confidence: Confidence;
  risk: ChangeRisk;
  tracking: TrackingHealth;
  contentClaimsVerified?: boolean;
  conversionTrackingDemonstrablyBroken?: boolean;
  materialSpendImpact?: boolean;
  sampleSize?: number;
  minimumSampleSize?: number;
  accountDailyBudgetAtWindowStart?: number;
  proposedAccountDailyBudget?: number;
  currentCampaignDailyBudget?: number;
  proposedCampaignDailyBudget?: number;
  approval?: {
    approvedBy: string;
    approvedAt: string;
    scope: "this-change-only";
  };
};

export type PolicyDecision = {
  allowed: boolean;
  requiresApproval: boolean;
  validateOnly: boolean;
  reasons: string[];
};

export type ChangeAuditStatus = "blocked" | "validated" | "executed" | "failed";

export type ChangeAuditEntry = {
  id: string;
  proposalId: string;
  timestamp: string;
  actor: string;
  actionType: GoogleAdsActionType;
  resourceType: string;
  resourceId?: string;
  previousValue: unknown;
  newValue: unknown;
  reason: string;
  supportingMetrics: Evidence;
  confidence: Confidence;
  risk: ChangeRisk;
  status: ChangeAuditStatus;
  policyReasons: string[];
  approval?: ChangeProposal["approval"];
  externalRequestId?: string;
  error?: string;
};

export type GoogleAdsMutationResult = {
  externalRequestId: string;
  resourceNames: string[];
};

export interface GoogleAdsMutationAdapter {
  mutate(proposal: ChangeProposal, options: { validateOnly: boolean }): Promise<GoogleAdsMutationResult>;
}

export interface ChangeAuditStore {
  append(entry: ChangeAuditEntry): Promise<void>;
}
