import { describe, expect, it } from "vitest";
import { buildSummarizerInput, DeterministicRecommendationSummarizer } from "./summarizer";
import type { AnalystRecommendation } from "./types";

describe("analyst summarizer boundary", () => {
  it("feeds a summarizer structured calculated evidence but no executable action", async () => {
    const recommendation: AnalystRecommendation = {
      id: "REC-1",
      className: "negative-keyword",
      title: "Review one term",
      detail: "Confirm match-type implications.",
      evidence: { spend: 100, qualifiedLeads: 0 },
      severity: "warning",
      confidence: "high",
      status: "proposed",
      proposedAction: "add-negative-keyword"
    };
    const input = buildSummarizerInput([recommendation]);

    expect(input[0]).not.toHaveProperty("proposedAction");
    await expect(new DeterministicRecommendationSummarizer().summarize(input))
      .resolves.toContain("spend=100, qualifiedLeads=0");
  });
});
