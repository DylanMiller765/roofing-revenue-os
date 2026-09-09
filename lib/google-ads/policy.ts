import { defaultAnalystThresholds, isTrackingReliable } from "../analyst/rules";
import type { ChangeProposal, PolicyDecision } from "./types";

const supportedActionTypes = new Set([
  "create-campaign",
  "create-ad-group",
  "create-keyword",
  "create-responsive-search-ad",
  "add-negative-keyword",
  "pause-entity",
  "adjust-bid",
  "adjust-campaign-budget",
  "restructure-campaign",
  "create-experiment",
  "switch-bidding-strategy",
  "change-geographic-targeting",
  "launch-service-category",
  "change-conversion-tracking"
]);

const claimBearingActions = new Set([
  "create-campaign",
  "create-responsive-search-ad",
  "launch-service-category"
]);

const mandatoryHighRiskActions = new Set([
  "create-campaign",
  "restructure-campaign",
  "switch-bidding-strategy",
  "change-geographic-targeting",
  "launch-service-category",
  "change-conversion-tracking"
]);

const dataSensitiveActions = new Set([
  "pause-entity",
  "restructure-campaign",
  "switch-bidding-strategy"
]);

export function evaluateChangePolicy(proposal: ChangeProposal): PolicyDecision {
  const reasons: string[] = [];

  if (!supportedActionTypes.has(proposal.actionType)) {
    reasons.push("The requested action is not supported; delete operations are intentionally unavailable.");
  }

  if (!isTrackingReliable(proposal.tracking, defaultAnalystThresholds)) {
    reasons.push("Tracking quality is below the reliability gate; optimization changes must stop.");
  }

  if (claimBearingActions.has(proposal.actionType) && proposal.contentClaimsVerified !== true) {
    reasons.push("Ad or campaign content contains claims that have not been explicitly verified.");
  }

  if (proposal.actionType === "change-conversion-tracking" && proposal.conversionTrackingDemonstrablyBroken !== true) {
    reasons.push("Conversion tracking may change only when the current definition is demonstrably broken.");
  }

  if (mandatoryHighRiskActions.has(proposal.actionType) && proposal.risk !== "high") {
    reasons.push("This action class must be classified as high risk.");
  }

  if (proposal.materialSpendImpact === true && proposal.risk !== "high") {
    reasons.push("Any action with material spend impact must be classified as high risk.");
  }

  if (proposal.risk === "medium" && proposal.confidence !== "high") {
    reasons.push("Medium-risk changes require high-confidence evidence.");
  }

  if (
    dataSensitiveActions.has(proposal.actionType)
    && (proposal.minimumSampleSize === undefined || proposal.sampleSize === undefined)
  ) {
    reasons.push("This action requires an explicit sample size and minimum-data threshold.");
  }

  if (
    proposal.risk !== "low"
    && proposal.minimumSampleSize !== undefined
    && (proposal.sampleSize === undefined || proposal.sampleSize < proposal.minimumSampleSize)
  ) {
    reasons.push("The supporting sample is too small for this medium- or high-risk change.");
  }

  if (proposal.actionType === "adjust-campaign-budget") {
    const accountStart = proposal.accountDailyBudgetAtWindowStart;
    const accountAfter = proposal.proposedAccountDailyBudget;
    const campaignBefore = proposal.currentCampaignDailyBudget;
    const campaignAfter = proposal.proposedCampaignDailyBudget;

    if (accountStart === undefined || accountAfter === undefined || campaignBefore === undefined || campaignAfter === undefined) {
      reasons.push("Budget changes require account-window and campaign before/after values.");
    } else {
      if (accountAfter > accountStart * 1.15 && !proposal.approval) {
        reasons.push("The proposed account daily budget exceeds the 15% rolling 24-hour increase cap without approval.");
      }
      if (accountAfter > accountStart * 1.15 && proposal.risk !== "high") {
        reasons.push("An account daily budget increase above 15% must be classified as high risk.");
      }
      if (campaignAfter > campaignBefore * 1.2) {
        reasons.push("A single campaign budget increase may not exceed 20% in one change.");
      }
      if (accountStart < 0 || accountAfter < 0 || campaignBefore < 0 || campaignAfter < 0) {
        reasons.push("Budget values must be non-negative.");
      }
    }
  }

  if (proposal.confidence === "low" && proposal.actionType !== "create-experiment") {
    reasons.push("Low-confidence evidence cannot support a live optimization change.");
  }

  const requiresApproval = true;
  if (!proposal.approval) {
    reasons.push("Repository policy requires explicit human approval scoped to this change.");
  }

  return {
    allowed: reasons.length === 0,
    requiresApproval,
    validateOnly: reasons.length > 0,
    reasons
  };
}
