import { calculateFunnelMetrics, type FunnelMetricsInput } from "@/lib/metrics";
import type { LeadStage } from "@/lib/types";

export type CampaignRow = FunnelMetricsInput & {
  id: string;
  name: string;
  intent: string;
  status: "Healthy" | "Watch" | "Waste review";
};

const campaignInputs: CampaignRow[] = [
  { id: "replacement", name: "Roof replacement", intent: "High-intent replacement", spend: 1842, clicks: 91, leads: 14, qualifiedLeads: 11, bookedInspections: 6, estimates: 4, wins: 2, revenue: 24800, status: "Healthy" },
  { id: "storm", name: "Storm damage", intent: "Hail and damage inspection", spend: 1106, clicks: 68, leads: 8, qualifiedLeads: 5, bookedInspections: 4, estimates: 3, wins: 2, revenue: 19600, status: "Healthy" },
  { id: "repair", name: "Roof repair", intent: "Leak and repair", spend: 812, clicks: 74, leads: 10, qualifiedLeads: 7, bookedInspections: 2, estimates: 1, wins: 0, revenue: 0, status: "Watch" },
  { id: "research", name: "Broad research", intent: "Exploratory queries", spend: 426, clicks: 57, leads: 4, qualifiedLeads: 1, bookedInspections: 0, estimates: 0, wins: 0, revenue: 0, status: "Waste review" }
];

export const campaigns = campaignInputs.map((campaign) => ({
  ...campaign,
  metrics: calculateFunnelMetrics(campaign)
}));

export const searchTerms = [
  { term: "roof replacement houston", campaign: "Roof replacement", spend: 386, clicks: 17, qualified: 4, booked: 2, disposition: "Keep" },
  { term: "hail damage roof inspection", campaign: "Storm damage", spend: 274, clicks: 15, qualified: 3, booked: 3, disposition: "Keep" },
  { term: "emergency roof leak repair", campaign: "Roof repair", spend: 189, clicks: 19, qualified: 2, booked: 1, disposition: "Watch" },
  { term: "roofing jobs near me", campaign: "Broad research", spend: 126, clicks: 21, qualified: 0, booked: 0, disposition: "Negative review" },
  { term: "diy roof cost calculator", campaign: "Broad research", spend: 94, clicks: 14, qualified: 0, booked: 0, disposition: "Negative review" }
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

export const recommendations = [
  { id: "REC-104", className: "Budget reallocation candidate", title: "Hold broad research spend for review", evidence: "$426 spend · 1 qualified lead · 0 bookings", confidence: "High", status: "proposed", detail: "The broad campaign trails every downstream metric. Draft a pause and move no budget until an operator approves it." },
  { id: "REC-103", className: "Lead-quality anomaly", title: "Inspect repair follow-through", evidence: "7 qualified leads · 2 bookings · 0 wins", confidence: "Medium", status: "approved", detail: "Cheap CPQL is not translating into inspection or won-job value. Review call speed and search-term fit before scaling." },
  { id: "REC-102", className: "Negative-keyword candidate", title: "Review two research terms", evidence: "$220 combined spend · 0 qualified leads", confidence: "High", status: "rejected", detail: "Two queries show job-seeker or DIY intent. The recommendation was rejected pending match-type review." }
] as const;

export const auditTrail = [
  { time: "Today, 8:10 AM", actor: "Analyst", action: "Proposed REC-104", detail: "No account change made" },
  { time: "Yesterday, 4:32 PM", actor: "Operator", action: "Approved REC-103", detail: "Analysis only · execution not enabled" },
  { time: "Yesterday, 2:05 PM", actor: "Operator", action: "Rejected REC-102", detail: "Waiting on match-type review" },
  { time: "Sep 5, 9:18 AM", actor: "System", action: "Imported mock outcomes", detail: "12 bookings · 8 estimates · 4 wins" }
] as const;
