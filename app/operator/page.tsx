import type { CSSProperties } from "react";
import Link from "next/link";
import { clientConfig } from "@/config/client";
import { auditTrail, campaigns, leadStages, recommendations, searchTerms } from "@/lib/mock-data";
import { sumFunnelMetrics } from "@/lib/metrics";

const totals = sumFunnelMetrics(campaigns);

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("en-US");
const percent = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });

function nullableMoney(value: number | null) {
  return value === null ? "—" : money.format(value);
}

const headlineMetrics = [
  ["Spend", money.format(totals.spend), "Media cost"],
  ["Clicks", number.format(totals.clicks), "Tracked visits"],
  ["Leads", number.format(totals.leads), `${nullableMoney(totals.cpl)} CPL`],
  ["Qualified", number.format(totals.qualifiedLeads), `${nullableMoney(totals.cpql)} CPQL`],
  ["Booked", number.format(totals.bookedInspections), `${nullableMoney(totals.costPerBookedInspection)} each`],
  ["Estimates", number.format(totals.estimates), "Sales outcomes"],
  ["Wins", number.format(totals.wins), `${percent.format(totals.bookedToWinRate ?? 0)} of booked`],
  ["Revenue", money.format(totals.revenue), `${totals.returnOnAdSpend?.toFixed(1) ?? "—"}× ROAS`]
] as const;

function statusClass(status: string) {
  if (status === "Healthy" || status === "approved" || status === "Keep") return "status status--good";
  if (status === "Waste review" || status === "rejected" || status === "Negative review") return "status status--alert";
  return "status status--watch";
}

export default function Operator() {
  return (
    <main className="operator-shell">
      <header className="operator-header">
        <div className="operator-nav wrap">
          <Link className="operator-brand" href="/operator"><span>RR</span><strong>Revenue OS</strong></Link>
          <nav aria-label="Operator sections"><a href="#performance">Performance</a><a href="#leads">Lead stages</a><a href="#recommendations">Recommendations</a></nav>
          <Link className="operator-exit" href="/">View demo funnel ↗</Link>
        </div>
      </header>

      <div className="mock-banner" role="note">
        <div className="wrap"><strong>Mock dataset</strong><span>No Google Ads or CRM account is connected. All recommendations are read-only and require human approval.</span></div>
      </div>

      <div className="operator-main wrap">
        <section className="dashboard-heading">
          <div><p>{clientConfig.city} founding-pilot demo</p><h1>Revenue control room</h1></div>
          <div className="date-control"><span>Reporting window</span><strong>Aug 10 – Sep 7, 2026</strong></div>
        </section>

        <section className="metric-grid" aria-label="Funnel performance summary">
          {headlineMetrics.map(([label, value, context], index) => (
            <article className={index === 3 ? "metric-cell metric-cell--focus" : "metric-cell"} key={label}>
              <p>{label}</p><strong>{value}</strong><span>{context}</span>
            </article>
          ))}
        </section>

        <section className="dashboard-section" id="performance">
          <div className="dashboard-section__heading"><div><p>Campaign view</p><h2>Downstream performance</h2></div><span>Mock Google Ads + sales outcomes</span></div>
          <div className="data-panel table-scroll">
            <table className="data-table">
              <thead><tr><th>Campaign</th><th>Spend</th><th>Clicks</th><th>Leads</th><th>Qualified</th><th>CPQL</th><th>Booked</th><th>Estimates</th><th>Wins</th><th>Status</th></tr></thead>
              <tbody>{campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <th scope="row"><strong>{campaign.name}</strong><span>{campaign.intent}</span></th>
                  <td>{money.format(campaign.spend)}</td><td>{campaign.clicks}</td><td>{campaign.leads}</td><td>{campaign.qualifiedLeads}</td>
                  <td>{nullableMoney(campaign.metrics.cpql)}</td><td>{campaign.bookedInspections}</td><td>{campaign.estimates}</td><td>{campaign.wins}</td>
                  <td><span className={statusClass(campaign.status)}>{campaign.status}</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </section>

        <div className="dashboard-split">
          <section className="dashboard-section" id="leads">
            <div className="dashboard-section__heading"><div><p>Sales pipeline</p><h2>Lead stages</h2></div><span>46 mock records</span></div>
            <div className="pipeline-panel">
              {leadStages.map((item, index) => (
                <div className="pipeline-row" key={item.stage}>
                  <span className="pipeline-index">{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{item.label}</strong><i style={{ "--bar": `${Math.max(14, item.count / 12 * 100)}%` } as CSSProperties} /></div><b>{item.count}</b>
                </div>
              ))}
            </div>
          </section>

          <section className="dashboard-section">
            <div className="dashboard-section__heading"><div><p>Search quality</p><h2>Terms to inspect</h2></div><span>Top mock spend</span></div>
            <div className="data-panel search-term-list">
              {searchTerms.map((term) => (
                <article key={term.term}>
                  <div><strong>“{term.term}”</strong><span>{term.campaign}</span></div>
                  <dl><div><dt>Spend</dt><dd>{money.format(term.spend)}</dd></div><div><dt>Qualified</dt><dd>{term.qualified}</dd></div><div><dt>Booked</dt><dd>{term.booked}</dd></div></dl>
                  <span className={statusClass(term.disposition)}>{term.disposition}</span>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="dashboard-section" id="recommendations">
          <div className="dashboard-section__heading"><div><p>Daily Ads Analyst</p><h2>Recommendation queue</h2></div><span>Human review required</span></div>
          <div className="recommendation-grid">
            {recommendations.map((recommendation) => (
              <article className="recommendation" key={recommendation.id}>
                <div className="recommendation__meta"><span>{recommendation.id}</span><span className={statusClass(recommendation.status)}>{recommendation.status}</span></div>
                <p>{recommendation.className}</p><h3>{recommendation.title}</h3><strong>{recommendation.evidence}</strong><span>{recommendation.detail}</span>
                <footer><span>Confidence: {recommendation.confidence}</span><button type="button" disabled>Review in connected mode</button></footer>
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-section audit-section">
          <div className="dashboard-section__heading"><div><p>Governance</p><h2>Audit trail</h2></div><span>Latest activity</span></div>
          <div className="audit-list">
            {auditTrail.map((entry) => <article key={`${entry.time}-${entry.action}`}><time>{entry.time}</time><strong>{entry.actor}</strong><span>{entry.action}</span><p>{entry.detail}</p></article>)}
          </div>
        </section>
      </div>
    </main>
  );
}
