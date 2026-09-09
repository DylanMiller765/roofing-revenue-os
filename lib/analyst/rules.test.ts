import { describe, expect, it } from "vitest";
import { runAnalyst } from "./rules";
import type { AnalystInput } from "./types";

const reliableTracking = {
  attributionCoverage: 0.96,
  crmOutcomeCoverage: 0.92,
  googleCrmLeadMismatchRate: 0.04,
  primaryConversionVerified: true
};

function baseInput(): AnalystInput {
  return {
    tracking: reliableTracking,
    campaigns: [{
      id: "repair", name: "Roof repair", dailyBudget: 50, spend: 800, clicks: 70, leads: 10,
      qualifiedLeads: 7, bookedInspections: 2, estimates: 1, wins: 0, revenue: 0
    }, {
      id: "storm", name: "Storm damage", dailyBudget: 80, spend: 1100, clicks: 60, leads: 8,
      qualifiedLeads: 6, bookedInspections: 5, estimates: 4, wins: 2, revenue: 20000
    }],
    searchTerms: []
  };
}

describe("deterministic analyst rules", () => {
  it("flags meaningful search-term spend with no qualified outcome", () => {
    const input = baseInput();
    input.searchTerms = [{
      term: "roofing jobs near me", campaignId: "repair", campaignName: "Roof repair",
      spend: 126, clicks: 21, leads: 2, qualifiedLeads: 0, bookedInspections: 0
    }];

    const result = runAnalyst(input);
    expect(result.recommendations).toEqual(expect.arrayContaining([
      expect.objectContaining({ className: "negative-keyword", confidence: "high" })
    ]));
  });

  it("does not flag a zero-quality term below the spend or click threshold", () => {
    const input = baseInput();
    input.searchTerms = [{
      term: "tiny sample", campaignId: "repair", campaignName: "Roof repair",
      spend: 49, clicks: 7, leads: 0, qualifiedLeads: 0, bookedInspections: 0
    }];

    expect(runAnalyst(input).recommendations.some((item) => item.className === "negative-keyword")).toBe(false);
  });

  it("finds downstream quality mismatch without relying on raw CPL", () => {
    const result = runAnalyst(baseInput());
    const mismatch = result.recommendations.find((item) => item.className === "lead-quality-anomaly");

    expect(mismatch?.evidence.qualifiedLeads).toBe(7);
    expect(mismatch?.evidence.costPerBookedInspection).toBe(400);
    expect(mismatch?.detail).toContain("before changing spend");
  });

  it("prioritizes booked-inspection efficiency over a superficially better CPL", () => {
    const result = runAnalyst(baseInput());
    const opportunity = result.recommendations.find((item) => item.className === "budget-reallocation");

    expect(opportunity?.title).toContain("Storm damage");
    expect(opportunity?.evidence.cpl).toBeGreaterThan(100);
    expect(opportunity?.evidence.costPerBookedInspection).toBe(220);
    expect(opportunity?.detail).toContain("even if raw CPL or CPQL is not");
  });

  it("finds a search-term opportunity only after downstream thresholds are met", () => {
    const input = baseInput();
    input.searchTerms = [{
      term: "hail damage inspection", campaignId: "storm", campaignName: "Storm damage",
      spend: 300, clicks: 16, leads: 4, qualifiedLeads: 3, bookedInspections: 2
    }];

    expect(runAnalyst(input).recommendations).toEqual(expect.arrayContaining([
      expect.objectContaining({ className: "search-term-opportunity", confidence: "high" })
    ]));
  });

  it("stops all optimization recommendations when tracking is uncertain", () => {
    const input = baseInput();
    input.tracking = { ...reliableTracking, crmOutcomeCoverage: 0.5 };
    input.searchTerms = [{
      term: "roofing jobs", campaignId: "repair", campaignName: "Roof repair",
      spend: 500, clicks: 60, leads: 9, qualifiedLeads: 0, bookedInspections: 0
    }];

    const result = runAnalyst(input);
    expect(result.optimizationBlocked).toBe(true);
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0]).toMatchObject({ className: "tracking-data-quality", status: "blocked" });
  });

  it("uses client-specific minimum-data thresholds", () => {
    const input = baseInput();
    input.thresholds = { minQualifiedLeadsForDownstreamComparison: 8 };

    expect(runAnalyst(input).recommendations).toHaveLength(0);
  });
});
