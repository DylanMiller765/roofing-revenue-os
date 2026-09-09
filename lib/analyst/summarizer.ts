import type { AnalystRecommendation } from "./types";

export type RecommendationSummaryInput = Pick<
  AnalystRecommendation,
  "id" | "className" | "title" | "detail" | "evidence" | "severity" | "confidence" | "status"
>;

export interface RecommendationSummarizer {
  summarize(recommendations: readonly RecommendationSummaryInput[]): Promise<string>;
}

export function buildSummarizerInput(
  recommendations: readonly AnalystRecommendation[]
): RecommendationSummaryInput[] {
  return recommendations.map(({ proposedAction: _proposedAction, ...evidenceOnly }) => evidenceOnly);
}

export class DeterministicRecommendationSummarizer implements RecommendationSummarizer {
  async summarize(recommendations: readonly RecommendationSummaryInput[]): Promise<string> {
    if (recommendations.length === 0) return "No recommendation crossed the configured evidence thresholds.";

    return recommendations.map((item) => {
      const evidence = Object.entries(item.evidence)
        .map(([key, value]) => `${key}=${String(value)}`)
        .join(", ");
      return `${item.title} (${item.confidence} confidence): ${evidence}. ${item.detail}`;
    }).join("\n");
  }
}
