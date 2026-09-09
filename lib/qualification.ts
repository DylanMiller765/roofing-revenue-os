export const roofingNeeds = ["replacement", "repair", "storm", "unknown"] as const;

export type RoofingNeed = (typeof roofingNeeds)[number];

export type QualificationInput = {
  homeowner: boolean;
  need: RoofingNeed;
  zip: string;
  phone: string;
};

export type QualificationContext = {
  serviceAreaZips: readonly string[];
  duplicate?: boolean;
  spam?: boolean;
};

export type QualificationResult = {
  qualified: boolean;
  reasons: string[];
};

export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

export function isReachablePhone(value: string): boolean {
  const digits = normalizePhone(value);
  return /^\d{10}$/.test(digits) && !/^(\d)\1{9}$/.test(digits);
}

export function isRoofingNeed(value: string): value is RoofingNeed {
  return roofingNeeds.includes(value as RoofingNeed);
}

export function qualifyLead(
  lead: QualificationInput,
  context: QualificationContext
): QualificationResult {
  const reasons: string[] = [];

  if (!lead.homeowner) reasons.push("not_homeowner");
  if (!roofingNeeds.includes(lead.need)) reasons.push("irrelevant_need");
  if (!/^\d{5}$/.test(lead.zip) || !context.serviceAreaZips.includes(lead.zip)) {
    reasons.push("outside_service_area");
  }
  if (!isReachablePhone(lead.phone)) reasons.push("unreachable_contact");
  if (context.duplicate) reasons.push("duplicate");
  if (context.spam) reasons.push("spam");

  return { qualified: reasons.length === 0, reasons };
}
