import type { FunnelMetricsInput } from "../metrics";

export type Confidence = "low" | "medium" | "high";
export type Severity = "info" | "warning" | "critical";
export type RecommendationStatus = "proposed" | "approved" | "rejected" | "executed" | "blocked";

export type RecommendationClass =
  | "wasted-search-term"
  | "negative-keyword"
  | "budget-reallocation"
  | "landing-page-problem"
  | "lead-quality-anomaly"
  | "tracking-data-quality"
  | "search-term-opportunity"
  | "geographic-opportunity"
  | "day-hour-device-observation";

export type Evidence = Record<string, string | number | boolean | null>;

export type AnalystRecommendation = {
  id: string;
  className: RecommendationClass;
  title: string;
  detail: string;
  evidence: Evidence;
  severity: Severity;
  confidence: Confidence;
  status: RecommendationStatus;
  proposedAction?: "add-negative-keyword" | "pause-entity" | "adjust-budget" | "create-keyword" | "investigate";
};

export type CampaignAnalysisInput = FunnelMetricsInput & {
  id: string;
  name: string;
  dailyBudget: number;
};

export type SearchTermAnalysisInput = {
  term: string;
  campaignId: string;
  campaignName: string;
  spend: number;
  clicks: number;
  leads: number;
  qualifiedLeads: number;
  bookedInspections: number;
};

export type TrackingHealth = {
  attributionCoverage: number;
  crmOutcomeCoverage: number;
  googleCrmLeadMismatchRate: number;
  primaryConversionVerified: boolean;
};

export type AnalystThresholds = {
  minSearchTermSpend: number;
  minSearchTermClicks: number;
  minCampaignSpend: number;
  minLeadsForRateComparison: number;
  minQualifiedLeadsForDownstreamComparison: number;
  maxQualifiedToBookedRatioVsAccount: number;
  minOpportunityQualifiedLeads: number;
  minOpportunityBookedInspections: number;
  minBudgetOpportunityBookedInspections: number;
  maxBookedCostRatioVsAccount: number;
  minAttributionCoverage: number;
  minCrmOutcomeCoverage: number;
  maxGoogleCrmLeadMismatchRate: number;
};

export type AnalystInput = {
  campaigns: CampaignAnalysisInput[];
  searchTerms: SearchTermAnalysisInput[];
  tracking: TrackingHealth;
  thresholds?: Partial<AnalystThresholds>;
};

export type AnalystResult = {
  recommendations: AnalystRecommendation[];
  optimizationBlocked: boolean;
  thresholds: AnalystThresholds;
};
