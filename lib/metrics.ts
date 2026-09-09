export type FunnelMetricsInput = {
  spend: number;
  clicks: number;
  leads: number;
  qualifiedLeads: number;
  bookedInspections: number;
  estimates: number;
  wins: number;
  revenue: number;
};

export type FunnelMetrics = FunnelMetricsInput & {
  cpl: number | null;
  cpql: number | null;
  costPerBookedInspection: number | null;
  costPerEstimate: number | null;
  costPerConvertedLead: number | null;
  costPerWin: number | null;
  leadToQualifiedRate: number | null;
  qualifiedToBookedRate: number | null;
  bookedToWinRate: number | null;
  returnOnAdSpend: number | null;
};

export function safeDivide(numerator: number, denominator: number): number | null {
  return denominator > 0 ? numerator / denominator : null;
}

export function calculateFunnelMetrics(input: FunnelMetricsInput): FunnelMetrics {
  return {
    ...input,
    cpl: safeDivide(input.spend, input.leads),
    cpql: safeDivide(input.spend, input.qualifiedLeads),
    costPerBookedInspection: safeDivide(input.spend, input.bookedInspections),
    costPerEstimate: safeDivide(input.spend, input.estimates),
    costPerConvertedLead: safeDivide(input.spend, input.wins),
    costPerWin: safeDivide(input.spend, input.wins),
    leadToQualifiedRate: safeDivide(input.qualifiedLeads, input.leads),
    qualifiedToBookedRate: safeDivide(input.bookedInspections, input.qualifiedLeads),
    bookedToWinRate: safeDivide(input.wins, input.bookedInspections),
    returnOnAdSpend: safeDivide(input.revenue, input.spend)
  };
}

export function sumFunnelMetrics(rows: FunnelMetricsInput[]): FunnelMetrics {
  const totals = rows.reduce<FunnelMetricsInput>(
    (sum, row) => ({
      spend: sum.spend + row.spend,
      clicks: sum.clicks + row.clicks,
      leads: sum.leads + row.leads,
      qualifiedLeads: sum.qualifiedLeads + row.qualifiedLeads,
      bookedInspections: sum.bookedInspections + row.bookedInspections,
      estimates: sum.estimates + row.estimates,
      wins: sum.wins + row.wins,
      revenue: sum.revenue + row.revenue
    }),
    { spend: 0, clicks: 0, leads: 0, qualifiedLeads: 0, bookedInspections: 0, estimates: 0, wins: 0, revenue: 0 }
  );

  return calculateFunnelMetrics(totals);
}
