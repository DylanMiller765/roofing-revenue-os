"use client";
import Link from "next/link";
import { clientConfig } from "@/config/client";
import { type CSSProperties, useState } from "react";
import {
	campaigns,
	recommendations,
	searchTerms,
	auditTrail,
} from "@/lib/mock-data";
import { sumFunnelMetrics } from "@/lib/metrics";
import {
	cohortStages,
	money,
	percent,
	reportingWindow,
	observationDays,
	evidenceLabel,
	evidenceValue,
	recommendationContext,
} from "@/lib/presentation";
import Icon from "./Icon";
import PolicyLab from "./PolicyLab";

function visibleWaste(ids: string[]) {
	return searchTerms
		.filter(
			(term) =>
				ids.includes(term.campaignId) && term.disposition === "Negative review",
		)
		.reduce((sum, term) => sum + term.spend, 0);
}

const nav = [
	{ id: "overview", label: "Overview", icon: "chart" },
	{ id: "campaigns", label: "Campaigns", icon: "funnel" },
	{ id: "search", label: "Search intelligence", icon: "search" },
	{ id: "analyst", label: "Ads Analyst", icon: "chart" },
	{ id: "controls", label: "Controls & audit", icon: "shield" },
	{ id: "pilot", label: "Founding pilot", icon: "brief" },
] as const;

function statusClass(status: string) {
	return `status ${status === "Healthy" || status === "Keep" || status === "executed" ? "status--good" : status === "blocked" || status === "Waste review" || status === "Negative review" ? "status--alert" : "status--watch"}`;
}

export default function OperatorDashboard() {
	const [selected, setSelected] = useState("all");
	const [termFilter, setTermFilter] = useState("all");
	const [query, setQuery] = useState("");
	const [recFilter, setRecFilter] = useState("all");
	const rows =
		selected === "all" ? campaigns : campaigns.filter((c) => c.id === selected);
	const totals = sumFunnelMetrics(rows);
	const stages = cohortStages(totals);
	const calls = rows.reduce((sum, row) => sum + row.calls, 0);
	const formLeads = rows.reduce((sum, row) => sum + row.formLeads, 0);
	const waste = visibleWaste(rows.map((row) => row.id));
	const visibleTerms = searchTerms.filter(
		(term) =>
			(selected === "all" || term.campaignId === selected) &&
			(termFilter === "all" || term.disposition === "Negative review") &&
			term.term.toLowerCase().includes(query.toLowerCase()),
	);
	const visibleRecs = recommendations.filter(
		(rec) =>
			recFilter === "all" ||
			(recFilter === "review" && rec.severity === "warning") ||
			(recFilter === "growth" && rec.severity === "info"),
	);
	const metrics = [
		["Ad spend", money(totals.spend), "Google Search media"],
		["Calls", String(calls), "Mock inbound calls; not call clicks"],
		["Form leads", String(formLeads), "Mock inspection requests"],
		[
			"Qualified leads",
			String(totals.qualifiedLeads),
			`${percent(totals.leadToQualifiedRate)} of ${totals.leads} total leads`,
		],
		["Cost / lead", money(totals.cpl), "Spend ÷ all leads"],
		["Cost / qualified lead", money(totals.cpql), "Spend ÷ qualified leads"],
	];
	return (
		<div className="operator-shell">
			<a className="skip-link" href="#overview">
				Skip to performance
			</a>
			<aside className="sidebar">
				<Link className="operator-brand" href="/operator">
					<span className="os-mark">
						<i />
						<i />
						<i />
					</span>
					<span>
						Revenue OS<small>Roofing acquisition</small>
					</span>
				</Link>
				<div className="workspace">
					<span className="workspace-avatar">RR</span>
					<div>
						{clientConfig.name}
						<small>Proposed pilot · Mock data</small>
					</div>
					<span className="demo-tag">Demo</span>
				</div>
				<nav aria-label="Operator sections">
					{nav.map((item) => (
						<a key={item.id} href={`#${item.id}`}>
							<Icon name={item.icon} />
							{item.label}
							{item.id === "analyst" && (
								<span className="nav-count">{recommendations.length}</span>
							)}
						</a>
					))}
				</nav>
				<div className="sidebar-bottom">
					<div>
						<span className="connection-dot" />
						Mock workspace
					</div>
					<p>No Google Ads account connected</p>
					<Link href="/">
						View homeowner funnel <Icon name="external" />
					</Link>
				</div>
			</aside>
			<div className="operator-workspace">
				<header className="operator-topbar">
					<span>
						Workspace <span className="slash">/</span> Acquisition overview
					</span>
					<Link href="/">
						View funnel <Icon name="external" />
					</Link>
				</header>
				<div className="mock-banner">
					<span className="demo-tag">Demo data</span>
					<p>
						Our internal acquisition workspace. All figures are mock; no leads
						are delivered or ads changed.
					</p>
					<a href="#controls">
						View safeguards <Icon name="shield" />
					</a>
				</div>
				<main className="operator-main">
					<section id="overview" className="overview-section">
						<div className="dashboard-heading">
							<div>
								<p className="muted">Houston residential roofing</p>
								<h1>Know what your ad spend brings in.</h1>
							</div>
							<div className="date-control">
								<Icon name="clock" />
								<span>
									{reportingWindow}
									<small>{observationDays}-day sample cohort</small>
								</span>
							</div>
						</div>
						<div className="scope-row">
							<label htmlFor="campaign-scope">Performance scope</label>
							<select
								id="campaign-scope"
								value={selected}
								onChange={(e) => setSelected(e.target.value)}
							>
								<option value="all">All campaigns</option>
								{campaigns.map((c) => (
									<option key={c.id} value={c.id}>
										{c.name}
									</option>
								))}
							</select>
							<span>Static acquisition sample • as of Sep 8</span>
						</div>
						<div className="metric-grid acquisition-metrics" aria-live="polite">
							{metrics.map(([label, value, context]) => (
								<article className="metric-cell" key={label}>
									<p>{label}</p>
									<strong>{value}</strong>
									<span>{context}</span>
								</article>
							))}
						</div>
						<div className="acquisition-story panel">
							<div>
								<h2>You handle the homeowner. We handle acquisition.</h2>
								<p>
									In the pilot, calls and form requests go straight to your
									chosen phone and inbox. Keep using your current sales process.
								</p>
							</div>
							<ol>
								<li>
									<strong>We bring the right traffic</strong>
									<span>
										Google ads lead to a page about their roofing need.
									</span>
								</li>
								<li>
									<strong>You receive the lead</strong>
									<span>
										Your team follows up as usual. No new CRM to learn.
									</span>
								</li>
								<li>
									<strong>We improve the advertising</strong>
									<span>
										Review lead quality, search terms and cost, with spending
										safeguards.
									</span>
								</li>
							</ol>
							<Link className="text-link" href="/">
								Try the search-to-page demo <Icon name="arrow" />
							</Link>
						</div>
						<div className="attention-strip">
							<span className="attention-icon">
								<Icon name="search" />
							</span>
							<div>
								<strong>
									{money(waste)} in search-term spend needs a closer look.
								</strong>
								<p>
									Selected mock terms flagged for waste review. This is spend to
									investigate, not guaranteed savings.
								</p>
							</div>
							<a href="#search">
								Review search terms <Icon name="arrow" />
							</a>
						</div>
						<details className="optional-outcomes panel">
							<summary>
								Optional: inspections, estimates and signed jobs
							</summary>
							<p className="optional-intro">
								If you share sales updates later, we can add them here. These
								fictional examples show future visibility; the month-one service
								does not require CRM access or sales-stage updates.
							</p>
							<div className="outcome-grid">
								<section className="funnel-panel panel">
									<div className="panel-heading">
										<div>
											<h2>The path to a signed roof</h2>
											<p>Cumulative stages reached by this lead cohort</p>
										</div>
										<span className="status">{totals.leads} leads</span>
									</div>
									<div className="cohort-chart">
										{stages.map((stage, index) => (
											<div className="cohort-column" key={stage.label}>
												<div className="cohort-label">
													<span>{stage.label}</span>
													<strong>{stage.count}</strong>
												</div>
												<div className="cohort-track">
													<div
														style={
															{
																"--bar": `${totals.leads ? (stage.count / totals.leads) * 100 : 0}%`,
																"--stage": index,
															} as CSSProperties
														}
													/>
												</div>
												<div className="cohort-conversion">
													{index === 0 ? (
														"Starting cohort"
													) : (
														<>
															<b>{percent(stage.conversion)}</b> from prior
															stage
														</>
													)}
												</div>
											</div>
										))}
									</div>
									<p className="panel-footnote">
										Stages overlap; do not add them together. Not yet advanced
										does not mean lost.
									</p>
								</section>
								<section className="signed-panel">
									<div className="signed-top">
										<Icon name="brief" />
										<span>Modeled signed value</span>
									</div>
									<strong>{money(totals.revenue)}</strong>
									<p>
										{totals.wins} won jobs <span>/</span> {totals.estimates}{" "}
										estimates
									</p>
									<div>
										<span>Signed value / ad spend</span>
										<b>{totals.returnOnAdSpend?.toFixed(1) ?? "—"}×</b>
									</div>
									<small>
										Fictional outcomes, not achieved results. Contract value is
										not cash collected or profit; costs beyond media are
										excluded.
									</small>
								</section>
							</div>
						</details>
					</section>

					<section id="campaigns" className="dashboard-section">
						<div className="section-title">
							<div>
								<h2>Which campaigns produce opportunities?</h2>
								<p>
									Compare calls, form requests and qualified-lead cost by
									roofing need.
								</p>
							</div>
							<span>{rows.length} campaigns in scope</span>
						</div>
						<div className="panel campaign-table">
							<table>
								<caption className="sr-only">
									Campaign performance for the selected sample cohort
								</caption>
								<thead>
									<tr>
										<th scope="col">Campaign</th>
										<th scope="col">Spend</th>
										<th scope="col">Qualified</th>
										<th scope="col">CPQL</th>
										<th scope="col">Calls</th>
										<th scope="col">Forms</th>
										<th scope="col">CPL</th>
										<th scope="col">Review</th>
									</tr>
								</thead>
								<tbody>
									{rows.map((c) => (
										<tr key={c.id}>
											<th scope="row">
												<strong>{c.name}</strong>
												<span>{c.intent}</span>
											</th>
											<td>{money(c.spend)}</td>
											<td>
												{c.qualifiedLeads}
												<small>of {c.leads} leads</small>
											</td>
											<td>{money(c.metrics.cpql)}</td>
											<td>{c.calls}</td>
											<td>{c.formLeads}</td>
											<td>{money(c.metrics.cpl)}</td>
											<td>
												<span className={statusClass(c.status)}>
													{c.status}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="campaign-cards">
							{rows.map((c) => (
								<article className="panel campaign-card" key={c.id}>
									<header>
										<h3>{c.name}</h3>
										<span className={statusClass(c.status)}>{c.status}</span>
									</header>
									<dl>
										<div>
											<dt>Spend</dt>
											<dd>{money(c.spend)}</dd>
										</div>
										<div>
											<dt>Qualified</dt>
											<dd>{c.qualifiedLeads}</dd>
										</div>
										<div>
											<dt>Cost / qualified</dt>
											<dd>{money(c.metrics.cpql)}</dd>
										</div>
									</dl>
									<details>
										<summary>Calls, forms and optional sales updates</summary>
										<dl className="evidence-grid">
											<div>
												<dt>Calls</dt>
												<dd>{c.calls}</dd>
											</div>
											<div>
												<dt>Form leads</dt>
												<dd>{c.formLeads}</dd>
											</div>
											<div>
												<dt>Total leads</dt>
												<dd>{c.leads}</dd>
											</div>
											<div>
												<dt>CPQL</dt>
												<dd>{money(c.metrics.cpql)}</dd>
											</div>
											<div>
												<dt>Booked (optional)</dt>
												<dd>{c.bookedInspections}</dd>
											</div>
											<div>
												<dt>Estimates (optional)</dt>
												<dd>{c.estimates}</dd>
											</div>
											<div>
												<dt>Won jobs (optional)</dt>
												<dd>{c.wins}</dd>
											</div>
											<div>
												<dt>Signed value (mock)</dt>
												<dd>{money(c.revenue)}</dd>
											</div>
										</dl>
									</details>
								</article>
							))}
						</div>
						<details className="diagnostics">
							<summary>Traffic diagnostics and metric definitions</summary>
							<div className="diagnostic-content">
								<p>
									{totals.clicks} clicks ·{" "}
									{money(totals.clicks ? totals.spend / totals.clicks : null)}{" "}
									average CPC · {money(totals.cpl)} raw CPL.
								</p>
								<p>
									Qualified = homeowner, supported ZIP, relevant roof need and
									valid phone format. This is a rule-based screen, not verified
									contactability. Calls need a quality review; a call click
									alone is not a qualified lead. Booked = optional appointment
									recorded; won = signed job recorded. CPQL and booking CPA use
									all campaign spend. No denominator is shown as “—”.
								</p>
							</div>
						</details>
					</section>

					<section id="search" className="dashboard-section">
						<div className="section-title">
							<div>
								<h2>Search intelligence</h2>
								<p>Separate homeowner demand from expensive distractions.</p>
							</div>
							<span>Selected terms, not all account traffic</span>
						</div>
						<div className="panel">
							<div className="panel-toolbar">
								<fieldset
									className="segmented"
									aria-label="Search term filters"
								>
									<button
										type="button"
										aria-pressed={termFilter === "all"}
										onClick={() => setTermFilter("all")}
									>
										All terms
									</button>
									<button
										type="button"
										aria-pressed={termFilter === "review"}
										onClick={() => setTermFilter("review")}
									>
										Review waste
									</button>
								</fieldset>
								<div className="search-input">
									<Icon name="search" />
									<input
										aria-label="Find a search term"
										placeholder="Find a search term"
										value={query}
										onChange={(e) => setQuery(e.target.value)}
									/>
								</div>
							</div>
							<div className="term-list" aria-live="polite">
								{visibleTerms.length ? (
									visibleTerms.map((term) => (
										<details className="term-row" key={term.term}>
											<summary>
												<span className="term-name">
													<strong>{term.term}</strong>
													<small>{term.campaign}</small>
												</span>
												<span className="term-cost">
													{money(term.spend)}
													<small>
														{term.qualified} qualified / {term.leads} leads
													</small>
												</span>
												<span className={statusClass(term.disposition)}>
													{term.disposition}
												</span>
											</summary>
											<div className="term-detail">
												<p>
													{term.clicks} clicks · {term.leads} leads ·{" "}
													{money(
														term.qualified ? term.spend / term.qualified : null,
													)}{" "}
													per qualified lead.
												</p>
												<p>
													{term.disposition === "Negative review"
														? "Review the exact query and match scope before excluding traffic. Zero qualified outcomes do not by themselves authorize a change."
														: "Review qualified-lead cost and search relevance. Add sales outcomes when available. Do not expand spend from this term alone."}
												</p>
												<a className="text-link" href="#analyst">
													Inspect the analyst queue <Icon name="arrow" />
												</a>
											</div>
										</details>
									))
								) : (
									<div className="empty-state">
										<Icon name="search" />
										<h3>No terms match this view</h3>
										<p>
											Clear the search and review filter, or select all
											campaigns above.
										</p>
										<button
											className="button button--quiet"
											type="button"
											onClick={() => {
												setQuery("");
												setTermFilter("all");
												setSelected("all");
											}}
										>
											Reset search view
										</button>
									</div>
								)}
							</div>
						</div>
					</section>

					<section id="analyst" className="dashboard-section">
						<div className="section-title">
							<div>
								<h2>Ads Analyst</h2>
								<p>
									Evidence first. A clear action, or a clear reason to hold.
								</p>
							</div>
							<span className="status status--good">Mock tracking passes</span>
						</div>
						<div className="analyst-meta">
							<span>
								Account-wide · {reportingWindow} · {observationDays} days
							</span>
							<span>
								Mock sample includes optional sales signals; live optimization
								requires verified tracking
							</span>
						</div>
						<div className="recommendation-toolbar">
							<fieldset
								className="segmented"
								aria-label="Recommendation filters"
							>
								<button
									type="button"
									aria-pressed={recFilter === "all"}
									onClick={() => setRecFilter("all")}
								>
									All {recommendations.length}
								</button>
								<button
									type="button"
									aria-pressed={recFilter === "review"}
									onClick={() => setRecFilter("review")}
								>
									Needs review
								</button>
								<button
									type="button"
									aria-pressed={recFilter === "growth"}
									onClick={() => setRecFilter("growth")}
								>
									Opportunities
								</button>
							</fieldset>
							<p>Recommendations are not execution authorizations.</p>
						</div>
						<div className="recommendation-list">
							{visibleRecs.map((rec) => {
								const context = recommendationContext(rec);
								return (
									<details className="recommendation panel" key={rec.id}>
										<summary>
											<span
												className={`rec-marker ${rec.severity === "warning" ? "rec-marker--review" : ""}`}
											>
												<Icon
													name={rec.severity === "warning" ? "search" : "chart"}
												/>
											</span>
											<span className="rec-title">
												<small>
													{rec.className.replaceAll("-", " ")} <span>/</span>{" "}
													{rec.confidence} confidence
												</small>
												<strong>{rec.title}</strong>
											</span>
											<span className="status">{rec.status}</span>
										</summary>
										<div className="rec-body">
											<p>{rec.detail}</p>
											<div className="decision-facts">
												<div>
													<span>Risk assessment</span>
													<strong>{context.risk}</strong>
												</div>
												<div>
													<span>Observed sample</span>
													<strong>{context.sample}</strong>
												</div>
												<div>
													<span>Observation window</span>
													<strong>
														{observationDays} days · {reportingWindow}
													</strong>
												</div>
											</div>
											<div className="state-comparison">
												<div>
													<span>Current state</span>
													<strong>{context.current}</strong>
												</div>
												<div>
													<span>Proposed next step</span>
													<strong>{context.proposed}</strong>
												</div>
											</div>
											<dl className="evidence-grid">
												{Object.entries(rec.evidence).map(([key, value]) => (
													<div key={key}>
														<dt>{evidenceLabel(key)}</dt>
														<dd>{evidenceValue(key, value)}</dd>
													</div>
												))}
											</dl>
											<p>
												<strong>Rule threshold:</strong> {context.threshold}
											</p>
											<p>
												<strong>Expected impact:</strong> {context.impact}
											</p>
											<div className="execution-note">
												<Icon name="shield" />
												<p>
													{context.route} High-risk changes require scoped human
													approval. All live execution is unavailable in this
													demo.
												</p>
											</div>
										</div>
									</details>
								);
							})}
						</div>
					</section>

					<section id="controls" className="dashboard-section">
						<div className="section-title">
							<div>
								<h2>Controlled changes. Visible accountability.</h2>
								<p>Every action has a scope, a reason and a way back.</p>
							</div>
							<span>No live execution</span>
						</div>
						<div className="governance-stats">
							<div>
								<strong>0</strong>
								<span>Executed changes</span>
							</div>
							<div>
								<strong>0</strong>
								<span>Saved approvals</span>
							</div>
							<div>
								<strong>{auditTrail.length}</strong>
								<span>Blocked mock attempt</span>
							</div>
						</div>
						<div className="guardrail-grid">
							<div>
								<Icon name="shield" />
								<strong>Low risk</strong>
								<p>
									Automatic only with high confidence, sufficient evidence and
									rollback.
								</p>
							</div>
							<div>
								<Icon name="shield" />
								<strong>Medium risk</strong>
								<p>
									Also requires explicit passing samples, healthy tracking and
									hard-limit checks.
								</p>
							</div>
							<div>
								<Icon name="shield" />
								<strong>High risk</strong>
								<p>
									Explicit approval for the exact proposal. Approval never
									bypasses hard limits.
								</p>
							</div>
						</div>
						<details className="policy-disclosure panel">
							<summary>
								Explore the policy gates <span>Interactive, no writes</span>
							</summary>
							<PolicyLab />
						</details>
						<div className="budget-rule">
							<span>
								Account: &gt;15% daily-budget increase in 24h requires approval.
							</span>
							<span>Campaign: never &gt;20% in one increase.</span>
							<span>Uncertain tracking stops optimization.</span>
						</div>
						<div className="audit-heading">
							<h3>Change audit</h3>
							<span>Illustrative history / America–Chicago time</span>
						</div>
						{auditTrail.map((entry) => (
							<details className="audit-entry panel" key={entry.id}>
								<summary>
									<span className={statusClass(entry.status)}>
										{entry.status}
									</span>
									<span>
										<strong>Negative keyword / Broad research</strong>
										<small>
											{new Date(entry.timestamp).toLocaleString("en-US", {
												dateStyle: "medium",
												timeStyle: "short",
												timeZone: "America/Chicago",
											})}{" "}
											· {entry.actor}
										</small>
									</span>
									<Icon name="shield" />
								</summary>
								<div className="audit-body">
									<div className="state-comparison">
										<div>
											<span>Previous value</span>
											<code>{JSON.stringify(entry.previousValue)}</code>
										</div>
										<div>
											<span>Proposed value (not applied)</span>
											<code>{JSON.stringify(entry.newValue)}</code>
										</div>
									</div>
									<p>{entry.reason}</p>
									<dl className="evidence-grid">
										<div>
											<dt>Risk</dt>
											<dd>{entry.risk}</dd>
										</div>
										<div>
											<dt>Confidence</dt>
											<dd>{entry.confidence}</dd>
										</div>
										<div>
											<dt>Approval</dt>
											<dd>{entry.approvalStatus}</dd>
										</div>
										{Object.entries(entry.supportingMetrics).map(
											([key, value]) => (
												<div key={key}>
													<dt>{evidenceLabel(key)}</dt>
													<dd>{evidenceValue(key, value)}</dd>
												</div>
											),
										)}
									</dl>
									<p>
										<strong>Result:</strong> {entry.policyReasons.join(" ")}
									</p>
									<p>
										<strong>Rollback plan:</strong> {entry.rollbackPlan} No
										rollback is needed because this attempt was blocked.
									</p>
									<p className="muted">
										Audit {entry.id} / Proposal {entry.proposalId} / Entity{" "}
										{entry.resourceId}. Provider validation and external request
										ID: none.
									</p>
								</div>
							</details>
						))}
						<p className="panel-footnote">
							No pending live approvals. The scenarios above explain approval
							behavior; they do not create an approval queue.
						</p>
					</section>

					<section id="pilot" className="pilot-panel">
						<div>
							<p>One Houston roofing company. One focused pilot.</p>
							<h2>
								Build a better path
								<br />
								from search to qualified leads.
							</h2>
							<p>
								30 days of ads, focused landing pages and leads sent directly to
								your team. Define success and the media budget before launch.
							</p>
						</div>
						<div className="pilot-terms">
							<dl>
								<div>
									<dt>Founding-client setup</dt>
									<dd>$0</dd>
								</div>
								<div>
									<dt>First 30 days of management</dt>
									<dd>$0</dd>
								</div>
								<div>
									<dt>Advertising spend</dt>
									<dd>Funded directly by you</dd>
								</div>
							</dl>
							<details>
								<summary>What makes the pilot work</summary>
								<ul>
									<li>
										Your team names a response owner and agrees a coverage
										schedule.
									</li>
									<li>
										We agree the service area, qualification rules and test
										budget.
									</li>
									<li>
										Share Google Ads access (or let us help set it up), approve
										your business details, and choose where leads should arrive.
										Sales updates are optional.
									</li>
									<li>
										You retain ownership of your ad account and business data.
									</li>
									<li>
										Continuation is optional; price and scope are agreed before
										any retainer.
									</li>
									<li>
										Case-study use requires anonymization or your approval. No
										lead count or profit is guaranteed.
									</li>
								</ul>
								<p>
									<strong>Next step:</strong> a working session with the owner
									to review their current funnel and operating capacity.
								</p>
							</details>
						</div>
					</section>
					<footer className="operator-footer">
						<span>Roofing Revenue OS</span>
						<span>Mock acquisition workspace / No verified client results</span>
					</footer>
				</main>
			</div>
		</div>
	);
}
