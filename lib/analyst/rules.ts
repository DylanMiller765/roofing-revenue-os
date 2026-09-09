import { calculateFunnelMetrics, sumFunnelMetrics } from "../metrics";
import type {
  AnalystInput,
  AnalystRecommendation,
  AnalystResult,
  AnalystThresholds,
  TrackingHealth
} from "./types";

export const defaultAnalystThresholds: AnalystThresholds = {
  minSearchTermSpend: 50,
  minSearchTermClicks: 8,
  minCampaignSpend: 300,
  minLeadsForRateComparison: 5,
  minQualifiedLeadsForDownstreamComparison: 5,
  maxQualifiedToBookedRatioVsAccount: 0.6,
  minOpportunityQualifiedLeads: 3,
  minOpportunityBookedInspections: 2,
  minBudgetOpportunityBookedInspections: 4,
  maxBookedCostRatioVsAccount: 0.85,
  minAttributionCoverage: 0.85,
  minCrmOutcomeCoverage: 0.8,
  maxGoogleCrmLeadMismatchRate: 0.15
};

export function isTrackingReliable(tracking: TrackingHealth, thresholds: AnalystThresholds): boolean {
  return tracking.primaryConversionVerified
    && tracking.attributionCoverage >= thresholds.minAttributionCoverage
    && tracking.crmOutcomeCoverage >= thresholds.minCrmOutcomeCoverage
    && tracking.googleCrmLeadMismatchRate <= thresholds.maxGoogleCrmLeadMismatchRate;
}

function recommendationId(prefix: string, value: string) {
  const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `${prefix}-${slug}`;
}

export function runAnalyst(input: AnalystInput): AnalystResult {
  const thresholds = { ...defaultAnalystThresholds, ...input.thresholds };
  const recommendations: AnalystRecommendation[] = [];
  const trackingReliable = isTrackingReliable(input.tracking, thresholds);

  if (!trackingReliable) {
    recommendations.push({
      id: "TRACKING-QUALITY-GATE",
      className: "tracking-data-quality",
      title: "Stop optimization changes and repair measurement",
      detail: "Attribution or CRM outcome coverage is below the configured reliability gate. Do not infer performance or execute optimization changes until tracking is verified.",
      evidence: { ...input.tracking },
      severity: "critical",
      confidence: "high",
      status: "blocked",
      proposedAction: "investigate"
    });

    return { recommendations, optimizationBlocked: true, thresholds };
  }

  const totals = sumFunnelMetrics(input.campaigns);

  for (const term of input.searchTerms) {
    if (
      term.spend >= thresholds.minSearchTermSpend
      && term.clicks >= thresholds.minSearchTermClicks
      && term.qualifiedLeads === 0
    ) {
      recommendations.push({
        id: recommendationId("NEG", term.term),
        className: "negative-keyword",
        title: `Review “${term.term}” as a negative keyword`,
        detail: "Meaningful spend produced no qualified homeowner outcome. Confirm match-type implications before risk-gated execution.",
        evidence: {
          campaign: term.campaignName,
          spend: term.spend,
          clicks: term.clicks,
          leads: term.leads,
          qualifiedLeads: term.qualifiedLeads,
          bookedInspections: term.bookedInspections
        },
        severity: "warning",
        confidence: term.leads > 0 ? "high" : "medium",
        status: "proposed",
        proposedAction: "add-negative-keyword"
      });
    }

    if (
      term.qualifiedLeads >= thresholds.minOpportunityQualifiedLeads
      && term.bookedInspections >= thresholds.minOpportunityBookedInspections
    ) {
      recommendations.push({
        id: recommendationId("OPP", term.term),
        className: "search-term-opportunity",
        title: `Protect high-quality demand for “${term.term}”`,
        detail: "This query has enough downstream outcomes to justify a keyword or match-type expansion review. It is not a budget recommendation by itself.",
        evidence: {
          campaign: term.campaignName,
          spend: term.spend,
          qualifiedLeads: term.qualifiedLeads,
          bookedInspections: term.bookedInspections,
          costPerQualifiedLead: term.spend / term.qualifiedLeads,
          costPerBookedInspection: term.spend / term.bookedInspections
        },
        severity: "info",
        confidence: "high",
        status: "proposed",
        proposedAction: "create-keyword"
      });
    }
  }

  for (const campaign of input.campaigns) {
    const metrics = calculateFunnelMetrics(campaign);
    const enoughData = campaign.spend >= thresholds.minCampaignSpend
      && campaign.leads >= thresholds.minLeadsForRateComparison
      && campaign.qualifiedLeads >= thresholds.minQualifiedLeadsForDownstreamComparison;
    const accountQualifiedToBooked = totals.qualifiedToBookedRate;
    const campaignQualifiedToBooked = metrics.qualifiedToBookedRate;

    if (
      enoughData
      && accountQualifiedToBooked !== null
      && campaignQualifiedToBooked !== null
      && campaignQualifiedToBooked < accountQualifiedToBooked * thresholds.maxQualifiedToBookedRatioVsAccount
    ) {
      recommendations.push({
        id: recommendationId("QUALITY", campaign.id),
        className: "lead-quality-anomaly",
        title: `Inspect ${campaign.name} downstream quality before scaling`,
        detail: "Qualified leads are not becoming booked inspections at the account norm. Check search intent and sales follow-up before changing spend.",
        evidence: {
          spend: campaign.spend,
          leads: campaign.leads,
          qualifiedLeads: campaign.qualifiedLeads,
          bookedInspections: campaign.bookedInspections,
          campaignQualifiedToBookedRate: campaignQualifiedToBooked,
          accountQualifiedToBookedRate: accountQualifiedToBooked,
          cpql: metrics.cpql,
          costPerBookedInspection: metrics.costPerBookedInspection
        },
        severity: "warning",
        confidence: campaign.qualifiedLeads >= thresholds.minQualifiedLeadsForDownstreamComparison * 2 ? "high" : "medium",
        status: "proposed",
        proposedAction: "investigate"
      });
    }

    if (
      totals.costPerBookedInspection !== null
      && metrics.costPerBookedInspection !== null
      && campaign.qualifiedLeads >= thresholds.minQualifiedLeadsForDownstreamComparison
      && campaign.bookedInspections >= thresholds.minBudgetOpportunityBookedInspections
      && campaign.wins > 0
      && metrics.costPerBookedInspection <= totals.costPerBookedInspection * thresholds.maxBookedCostRatioVsAccount
    ) {
      recommendations.push({
        id: recommendationId("BUDGET", campaign.id),
        className: "budget-reallocation",
        title: `Test a controlled budget increase for ${campaign.name}`,
        detail: "Booked-inspection efficiency is stronger than the account average even if raw CPL or CPQL is not. Any proposal still needs fresh data, rollback and risk/budget checks.",
        evidence: {
          spend: campaign.spend,
          leads: campaign.leads,
          qualifiedLeads: campaign.qualifiedLeads,
          bookedInspections: campaign.bookedInspections,
          wins: campaign.wins,
          cpl: metrics.cpl,
          cpql: metrics.cpql,
          costPerBookedInspection: metrics.costPerBookedInspection,
          accountCostPerBookedInspection: totals.costPerBookedInspection
        },
        severity: "info",
        confidence: campaign.bookedInspections >= thresholds.minBudgetOpportunityBookedInspections * 2 ? "high" : "medium",
        status: "proposed",
        proposedAction: "adjust-budget"
      });
    }
  }

  return { recommendations, optimizationBlocked: false, thresholds };
}
