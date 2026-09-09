import type { Evidence, AnalystRecommendation } from "./analyst/types";
import type { FunnelMetricsInput } from "./metrics";

const usd = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 0,
});
export const money = (value: number | null) =>
	value === null ? "—" : usd.format(value);
export const percent = (value: number | null) =>
	value === null ? "—" : `${Math.round(value * 100)}%`;
export const reportingWindow = "Aug 10 – Sep 7, 2026";
export const observationDays = 29;

export function cohortStages(totals: FunnelMetricsInput) {
	return [
		{ label: "Leads", count: totals.leads },
		{ label: "Qualified", count: totals.qualifiedLeads },
		{ label: "Booked", count: totals.bookedInspections },
		{ label: "Estimates", count: totals.estimates },
		{ label: "Won jobs", count: totals.wins },
	].map((stage, index, stages) => ({
		...stage,
		conversion:
			index > 0 && stages[index - 1].count > 0
				? stage.count / stages[index - 1].count
				: null,
		notAdvanced: index > 0 ? stages[index - 1].count - stage.count : null,
	}));
}

export function evidenceLabel(key: string) {
	const labels: Record<string, string> = {
		cpql: "Cost / qualified lead",
		cpl: "Cost / lead",
		crmOutcomeCoverage: "CRM outcome coverage",
		googleCrmLeadMismatchRate: "Google / CRM mismatch",
		primaryConversionVerified: "Primary conversion verified",
	};
	return (
		labels[key] ??
		key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase())
	);
}
export function evidenceValue(key: string, value: Evidence[string]) {
	if (value === null) return "—";
	if (typeof value === "boolean") return value ? "Yes" : "No";
	if (typeof value !== "number") return value;
	if (/rate|coverage/i.test(key)) return percent(value);
	if (/spend|cost|cpql|cpl/i.test(key)) return money(value);
	return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
}

/** Presentation guidance is intentionally not an executable proposal or policy authorization. */
export function recommendationContext(rec: AnalystRecommendation) {
	switch (rec.className) {
		case "negative-keyword":
			return {
				risk: "Low candidate",
				current: "Query is receiving traffic",
				proposed: "Review an exact-match exclusion; confirm scope first",
				impact:
					"Reduce spend on non-homeowner intent. Savings are not forecast.",
				route:
					"May qualify for automatic execution after a complete proposal passes policy.",
				sample: `${rec.evidence.clicks} clicks; ${rec.evidence.leads} leads`,
				threshold: "At least $50 spend and 8 clicks; zero qualified leads",
			};
		case "search-term-opportunity":
			return {
				risk: "Medium candidate",
				current: "Query has qualified and booked outcomes",
				proposed: "Review keyword coverage and match type",
				impact: "Preserve relevant demand. Incremental volume is unknown.",
				route:
					"Automatic only with high confidence, explicit samples, rollback and healthy tracking.",
				sample: `${rec.evidence.qualifiedLeads} qualified; ${rec.evidence.bookedInspections} booked`,
				threshold: "At least 3 qualified leads and 2 booked inspections",
			};
		case "budget-reallocation":
			return {
				risk: "Medium candidate",
				current: "Storm campaign: $60 daily budget in fixture",
				proposed: "Assess a capped budget test; no new amount approved",
				impact: "Test whether booking efficiency persists at more spend.",
				route:
					"Hold: medium confidence does not pass the automatic execution policy.",
				sample: `${rec.evidence.qualifiedLeads} qualified; ${rec.evidence.bookedInspections} booked; ${rec.evidence.wins} wins`,
				threshold:
					"At least 5 qualified, 4 booked, 1 win; booking CPA ≤85% of account",
			};
		default:
			return {
				risk: "Investigation only",
				current: `${percent(Number(rec.evidence.campaignQualifiedToBookedRate))} qualified-to-booked`,
				proposed: "Review repair intent and follow-up before changing spend",
				impact: "Identify the booking gap; do not assume the cause.",
				route: "No Ads mutation proposed. Review the sales process first.",
				sample: `${rec.evidence.leads} leads; ${rec.evidence.qualifiedLeads} qualified`,
				threshold:
					"At least $300, 5 leads and 5 qualified; booking rate <60% of account",
			};
	}
}
