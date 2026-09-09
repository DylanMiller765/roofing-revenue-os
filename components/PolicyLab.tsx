"use client";
import { useState } from "react";
import { evaluateChangePolicy } from "@/lib/google-ads/policy";
import type { ChangeProposal } from "@/lib/google-ads/types";
import { evidenceLabel, evidenceValue } from "@/lib/presentation";

const base: ChangeProposal = {
	id: "POLICY-DEMO",
	accountId: "mock-account",
	campaignId: "research",
	actionType: "add-negative-keyword",
	resourceType: "campaign-negative-keyword",
	previousValue: null,
	newValue: { text: "roofing jobs near me", matchType: "EXACT" },
	reason: "Demonstrate policy gates using fictional search-term evidence.",
	supportingMetrics: { spend: 126, clicks: 21, qualifiedLeads: 0 },
	confidence: "high",
	risk: "low",
	evidenceSufficient: true,
	reversible: true,
	rollbackPlan: "Remove only the exact-match negative added by this proposal.",
	tracking: {
		attributionCoverage: 0.96,
		crmOutcomeCoverage: 0.92,
		googleCrmLeadMismatchRate: 0.04,
		primaryConversionVerified: true,
	},
};
export default function PolicyLab() {
	const [scenario, setScenario] = useState("low");
	const [approval, setApproval] = useState(false);
	const [uncertain, setUncertain] = useState(false);
	let proposal: ChangeProposal = { ...base };
	if (scenario === "medium")
		proposal = {
			...base,
			id: "POLICY-BUDGET",
			campaignId: "storm",
			actionType: "adjust-campaign-budget",
			resourceType: "campaign-budget",
			risk: "medium",
			confidence: "medium",
			previousValue: { dailyBudget: 60 },
			newValue: { dailyBudget: 66 },
			accountDailyBudgetAtWindowStart: 215,
			proposedAccountDailyBudget: 221,
			currentCampaignDailyBudget: 60,
			proposedCampaignDailyBudget: 66,
			sampleSize: 4,
			minimumSampleSize: 4,
			supportingMetrics: { bookedInspections: 4, qualifiedLeads: 5, wins: 2 },
			rollbackPlan: "Restore the storm campaign daily budget to $60.",
			reason:
				"Illustrative 10% budget test; current mock evidence has only medium confidence.",
		};
	if (scenario === "high")
		proposal = {
			...base,
			id: "POLICY-HIGH",
			actionType: "change-geographic-targeting",
			resourceType: "campaign-targeting",
			risk: "high",
			previousValue: { area: "Current verified ZIP set" },
			newValue: { area: "Illustrative expanded ZIP set" },
			supportingMetrics: { sampleSize: 30 },
			sampleSize: 30,
			minimumSampleSize: 20,
			rollbackPlan: "Restore the exact previous ZIP set.",
			reason:
				"Synthetic governance scenario, not an analyst recommendation or a real geographic opportunity.",
		};
	if (uncertain)
		proposal.tracking = { ...proposal.tracking, attributionCoverage: 0.5 };
	if (approval && scenario === "high")
		proposal.approval = {
			approvedBy: "Demo operator (simulated)",
			approvedAt: "2026-09-08T14:00:00Z",
			scope: "this-change-only",
		};
	const decision = evaluateChangePolicy(proposal);
	return (
		<div className="policy-lab">
			<div className="policy-controls">
				<label htmlFor="policy-scenario">Inspect a policy scenario</label>
				<select
					id="policy-scenario"
					value={scenario}
					onChange={(e) => {
						setScenario(e.target.value);
						setApproval(false);
					}}
				>
					<option value="low">Low risk · exact negative</option>
					<option value="medium">Medium risk · budget +10%</option>
					<option value="high">High risk · geographic change</option>
				</select>
				<label className="check-control">
					<input
						type="checkbox"
						checked={uncertain}
						onChange={(e) => setUncertain(e.target.checked)}
					/>
					Simulate uncertain tracking
				</label>
				{scenario === "high" && (
					<label className="check-control">
						<input
							type="checkbox"
							checked={approval}
							onChange={(e) => setApproval(e.target.checked)}
						/>
						Simulate approval for this proposal only
					</label>
				)}
				<p>
					Interactive explanation only. Inputs are local to this page. No
					approval is saved and no change is sent.
				</p>
			</div>
			<div className="policy-result" aria-live="polite">
				<span
					className={`status ${decision.allowed ? "status--good" : "status--watch"}`}
				>
					{decision.allowed
						? "Policy permits this example"
						: decision.requiresApproval && !approval
							? "Approval required"
							: "Policy blocked"}
				</span>
				<h3>
					{scenario === "low"
						? "Exclude one exact query"
						: scenario === "medium"
							? "Test $60 → $66 per day"
							: "Change the geographic scope"}
				</h3>
				<div className="state-comparison">
					<div>
						<span>Current state</span>
						<code>{JSON.stringify(proposal.previousValue)}</code>
					</div>
					<div>
						<span>Proposed state</span>
						<code>{JSON.stringify(proposal.newValue)}</code>
					</div>
				</div>
				<p>{proposal.reason}</p>
				<dl className="evidence-grid">
					{Object.entries(proposal.supportingMetrics).map(([key, value]) => (
						<div key={key}>
							<dt>{evidenceLabel(key)}</dt>
							<dd>{evidenceValue(key, value)}</dd>
						</div>
					))}
				</dl>
				{decision.reasons.length > 0 && (
					<ul className="policy-reasons">
						{decision.reasons.map((reason) => (
							<li key={reason}>{reason}</li>
						))}
					</ul>
				)}
				<p>
					<strong>Rollback:</strong> {proposal.rollbackPlan}
				</p>
				<div className="provider-boundary">
					<strong>Execution unavailable</strong>
					<span>
						No live provider is connected. Passing policy never means a change
						was executed.
					</span>
				</div>
			</div>
		</div>
	);
}
