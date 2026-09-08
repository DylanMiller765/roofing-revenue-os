export type LeadStage = "new" | "contacted" | "qualified" | "inspection_booked" | "inspection_completed" | "estimate_given" | "won" | "lost";

export type Lead = {
  id: string;
  createdAt: string;
  homeowner: boolean;
  need: "replacement" | "repair" | "storm" | "unknown";
  zip: string;
  roofAge?: string;
  name: string;
  phone: string;
  gclid?: string;
  gbraid?: string;
  stage: LeadStage;
  estimatedValue?: number;
  wonValue?: number;
};
