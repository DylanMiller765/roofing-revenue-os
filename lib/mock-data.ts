import { calculateFunnelMetrics, type FunnelMetricsInput } from "@/lib/metrics";
import { runAnalyst } from "@/lib/analyst/rules";
import type { ChangeAuditEntry } from "@/lib/google-ads/types";
import type { LeadStage } from "@/lib/types";

export type CampaignRow = FunnelMetricsInput & {
  id: string;
  name: string;
  intent: string;
  dailyBudget: number;
  status: "Healthy" | "Watch" | "Waste review";
};

const campaignInputs: CampaignRow[] = [
  { id: "replacement", name: "Roof replacement", intent: "High-intent replacement", dailyBudget: 85, spend: 1842, clicks: 91, leads: 14, qualifiedLeads: 11, bookedInspections: 6, estimates: 4, wins: 2, revenue: 24800, status: "Healthy" },
  { id: "storm", name: "Storm damage", intent: "Hail and damage inspection", dailyBudget: 60, spend: 1106, clicks: 68, leads: 8, qualifiedLeads: 5, bookedInspections: 4, estimates: 3, wins: 2, revenue: 19600, status: "Healthy" },
  { id: "repair", name: "Roof repair", intent: "Leak and repair", dailyBudget: 45, spend: 812, clicks: 74, leads: 10, qualifiedLeads: 7, bookedInspections: 2, estimates: 1, wins: 0, revenue: 0, status: "Watch" },
  { id: "research", name: "Broad research", intent: "Exploratory queries", dailyBudget: 25, spend: 426, clicks: 57, leads: 4, qualifiedLeads: 1, bookedInspections: 0, estimates: 0, wins: 0, revenue: 0, status: "Waste review" }
];

export const campaigns = campaignInputs.map((campaign) => ({
  ...campaign,
  metrics: calculateFunnelMetrics(campaign)
}));

export const searchTerms = [
  { term: "roof replacement houston", campaignId: "replacement", campaign: "Roof replacement", spend: 386, clicks: 17, leads: 5, qualified: 4, booked: 2, disposition: "Keep" },
  { term: "hail damage roof inspection", campaignId: "storm", campaign: "Storm damage", spend: 274, clicks: 15, leads: 4, qualified: 3, booked: 3, disposition: "Keep" },
  { term: "emergency roof leak repair", campaignId: "repair", campaign: "Roof repair", spend: 189, clicks: 19, leads: 3, qualified: 2, booked: 1, disposition: "Watch" },
  { term: "roofing jobs near me", campaignId: "research", campaign: "Broad research", spend: 126, clicks: 21, leads: 2, qualified: 0, booked: 0, disposition: "Negative review" },
  { term: "diy roof cost calculator", campaignId: "research", campaign: "Broad research", spend: 94, clicks: 14, leads: 1, qualified: 0, booked: 0, disposition: "Negative review" }
] as const;

export const leadStages: { stage: LeadStage; label: string; count: number }[] = [
  { stage: "new", label: "New", count: 4 },
  { stage: "contacted", label: "Contacted", count: 3 },
  { stage: "qualified", label: "Qualified", count: 9 },
  { stage: "inspection_booked", label: "Inspection booked", count: 12 },
  { stage: "estimate_given", label: "Estimate given", count: 8 },
  { stage: "won", label: "Won", count: 4 },
  { stage: "lost", label: "Lost", count: 6 }
];

export const analystResult = runAnalyst({
  campaigns: campaignInputs,
  searchTerms: searchTerms.map((term) => ({
    term: term.term,
    campaignId: term.campaignId,
    campaignName: term.campaign,
    spend: term.spend,
    clicks: term.clicks,
    leads: term.leads,
    qualifiedLeads: term.qualified,
    bookedInspections: term.booked
  })),
  tracking: {
    attributionCoverage: 0.96,
    crmOutcomeCoverage: 0.92,
    googleCrmLeadMismatchRate: 0.04,
    primaryConversionVerified: true
  }
});

export const recommendations = analystResult.recommendations;

export const auditTrail: ChangeAuditEntry[] = [{
  id: "AUD-MOCK-001",
  proposalId: "NEG-roofing-jobs-near-me",
  timestamp: "2026-09-08T13:10:00.000Z",
  actor: "Codex Ads Analyst",
  actionType: "add-negative-keyword",
  resourceType: "campaign-negative-keyword",
  resourceId: "mock/research",
  previousValue: null,
  newValue: { text: "roofing jobs", matchType: "PHRASE" },
  reason: "Meaningful search-term spend produced no qualified homeowner outcome.",
  supportingMetrics: { spend: 126, clicks: 21, qualifiedLeads: 0, bookedInspections: 0 },
  confidence: "high",
  risk: "low",
  status: "blocked",
  policyReasons: ["Mock mode has no credentials.", "Explicit human approval is required for this change."]
}];
