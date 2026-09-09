# Daily Ads Analyst and controlled-write architecture

## V1 scope clarification

The founding pilot measures acquisition and qualified leads. CRM adoption and sales outcomes are optional; the current mock analyst sample includes deeper signals to demonstrate future capability. Preserve the tested engine and safeguards. A live adapter must distinguish missing downstream evidence from true zeros and validate tracking appropriate to available signals before enabling optimization. No live adapter is implemented in this task.

## Objective

Optimize the full roofing revenue path:

`qualified leads → booked inspections → estimates → signed roofs → revenue`

Clicks, CTR, raw lead volume and CPL are diagnostics. They are never the sole optimization target when qualified or downstream CRM outcomes exist.

## Inputs

- Yesterday, trailing 7-day and trailing 30-day performance
- Campaign, ad-group, keyword and search-term spend and conversions
- Lead-stage outcomes joined through legally and technically appropriate attribution IDs
- Campaign budgets and pacing
- Device, hour and geographic segments only when minimum samples are met
- Tracking completeness and Google-to-CRM mismatch indicators

## Deterministic core

- CPL = spend / leads
- CPQL = spend / qualified leads
- Booked-inspection CPA = spend / booked inspections
- Estimate CPA = spend / estimates
- Converted-lead CPA = spend / signed jobs
- Lead-to-qualified, qualified-to-booked and booked-to-won rates
- Revenue / spend where verified signed-job value exists

`lib/analyst/rules.ts` owns thresholds and recommendation logic. Thresholds are client-configurable. A zero denominator returns no metric rather than infinity or a fabricated zero.

## Recommendation classes

1. Wasted-search-term or negative-keyword candidate
2. Search-term expansion opportunity
3. Budget reallocation candidate
4. Landing-page problem candidate
5. Lead-quality anomaly
6. Tracking/data-quality issue
7. Geographic opportunity
8. Day/hour/device observation

Every recommendation contains structured evidence, severity, confidence and status. Strong changes are blocked on tiny samples. If tracking fails its coverage, mismatch or conversion-definition checks, the engine returns only a tracking issue and stops optimization.

## Controlled writes

The mutation boundary supports typed proposals for:

- creating campaigns, ad groups, keywords, responsive search ads and negative keywords;
- pausing or re-enabling campaign elements instead of deleting them;
- adjusting bids and campaign budgets;
- restructuring campaigns and creating experiments;
- separately classified high-risk changes such as bidding-strategy or material geographic changes.

There is intentionally no delete action. Conversion tracking can be changed only when it is demonstrably broken. Claim-bearing ad or campaign content must be explicitly verified.

### Effective execution policy

The repository-level `AGENTS.md` defines risk-gated controlled execution:

- Low risk may auto-execute only with high confidence, sufficient evidence, reversibility and an explicit rollback plan.
- Medium risk may auto-execute only with high confidence, sufficient evidence, healthy tracking, an explicit passing sample threshold, reversibility, rollback and all hard limits satisfied.
- High risk requires explicit human approval scoped to the exact proposal. Large account-level budget increases, bidding-strategy changes, material geographic changes, new service categories, major restructuring and conversion-definition changes are high risk.

No live Google Ads mutation adapter or credentials are configured in the MVP. `DisabledGoogleAdsMutationAdapter` fails closed, and the dashboard uses only mock policy evaluations. This environment therefore executes no account changes even when the architecture would authorize an automatic low- or medium-risk proposal.

### Spend protection

- Account daily budget after all changes in a rolling 24-hour window cannot exceed 115% of the budget at the window start without explicit approval.
- A single campaign budget increase can never exceed 20% in one change.
- Material spend impact must be high-risk.
- The policy requires explicit before/after account and campaign budget values; absent values block the change.

## Audit contract

Every attempted change records:

- timestamp and actor;
- action, resource and proposal IDs;
- previous and new values;
- reason and structured supporting metrics;
- confidence and risk;
- explicit approval status plus identity/time/scope when approval is required;
- rollback plan, policy reasons, execution status, provider validation result, external request ID and error when applicable.

The planned Postgres table is append-only: updates and deletes are rejected by a trigger. Blocked attempts are logged without calling the Google Ads adapter. Authorized changes are logged before any provider call, then validated with the provider before execution.

## Optional language-model boundary

An optional summarizer may receive only structured calculated recommendation evidence. It cannot receive an executor, create metrics, change recommendation status or call Google Ads. The deterministic summary implementation remains the default.

## Adapter separation

- Reporting adapter: Google Ads performance/search-term reads only.
- Mutation adapter: separately deployed controlled writes behind deterministic policy and risk-based approval.
- Offline outcome adapter: future Google Ads Data Manager qualified/converted-lead uploads.
- CRM adapter: lead-stage and signed-job value reads.
- Audit store: append-only mutation attempt/result records.

Separate runtime credentials and least-privilege deployment boundaries should be used even though Google Ads authorization scopes do not by themselves express every product-level permission.
