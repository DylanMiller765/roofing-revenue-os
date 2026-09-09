import { describe, expect, it } from "vitest";
import { calculateFunnelMetrics, safeDivide, sumFunnelMetrics } from "./metrics";

describe("core funnel metrics", () => {
  it("calculates cost and stage-conversion metrics from downstream outcomes", () => {
    const result = calculateFunnelMetrics({
      spend: 1200, clicks: 80, leads: 12, qualifiedLeads: 8,
      bookedInspections: 4, estimates: 3, wins: 2, revenue: 18000
    });

    expect(result.cpl).toBe(100);
    expect(result.cpql).toBe(150);
    expect(result.costPerBookedInspection).toBe(300);
    expect(result.costPerEstimate).toBe(400);
    expect(result.costPerConvertedLead).toBe(600);
    expect(result.costPerWin).toBe(600);
    expect(result.leadToQualifiedRate).toBeCloseTo(2 / 3);
    expect(result.bookedToWinRate).toBe(0.5);
    expect(result.returnOnAdSpend).toBe(15);
  });

  it("returns null instead of misleading infinity when a denominator is zero", () => {
    expect(safeDivide(400, 0)).toBeNull();
  });

  it("sums campaign inputs before calculating account-level ratios", () => {
    const total = sumFunnelMetrics([
      { spend: 100, clicks: 10, leads: 2, qualifiedLeads: 1, bookedInspections: 1, estimates: 1, wins: 1, revenue: 1000 },
      { spend: 300, clicks: 20, leads: 6, qualifiedLeads: 3, bookedInspections: 1, estimates: 0, wins: 0, revenue: 0 }
    ]);

    expect(total.spend).toBe(400);
    expect(total.qualifiedLeads).toBe(4);
    expect(total.cpql).toBe(100);
    expect(total.returnOnAdSpend).toBe(2.5);
  });
});
