import { describe, expect, it } from "vitest";
import { campaigns } from "./mock-data";
import { sumFunnelMetrics } from "./metrics";
import { cohortStages } from "./presentation";

describe("reconciled owner reporting", () => {
	it("uses the same cumulative cohort as the campaign economics", () => {
		const stages = cohortStages(sumFunnelMetrics(campaigns));
		expect(stages.map((stage) => stage.count)).toEqual([36, 24, 12, 8, 4]);
		expect(stages[2]).toMatchObject({ conversion: 0.5, notAdvanced: 12 });
	});
	it("reconciles a filtered campaign and does not invent a rate for a zero denominator", () => {
		const stages = cohortStages(
			sumFunnelMetrics(campaigns.filter((c) => c.id === "research")),
		);
		expect(stages.map((stage) => stage.count)).toEqual([4, 1, 0, 0, 0]);
		expect(stages[3].conversion).toBeNull();
	});
});
