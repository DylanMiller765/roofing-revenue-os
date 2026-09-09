# Workflow: Daily Ads Analysis and controlled execution

1. Pull yesterday plus trailing 7- and 30-day Google Ads metrics through the reporting adapter.
2. Pull attributed lead-stage outcomes for the same windows through the CRM adapter.
3. Validate attribution coverage, CRM outcome coverage, lead-count agreement and the primary conversion definition.
4. If tracking is uncertain, save a critical tracking recommendation and stop all optimization changes.
5. Calculate CPL, CPQL, booked-inspection CPA, estimate CPA, converted-lead CPA and downstream stage rates.
6. Apply client minimum-data thresholds to search terms, campaigns and useful segments.
7. Generate deterministic recommendations with evidence, severity, confidence and risk.
8. Save recommendations as `proposed`; an optional language model may explain but not alter them.
9. Build a typed mutation proposal only for an allowlisted action. There is no delete operation.
10. Evaluate spend caps, samples, tracking, claims, conversion safety and risk.
11. Auto-authorize only reversible, high-confidence low-risk actions and qualifying medium-risk actions with sufficient samples and rollback; require scoped human approval for high risk.
12. Re-evaluate immediately before execution to catch stale budgets or tracking state.
13. Validate the provider request, execute through the separate mutation adapter, and append the result to the immutable audit log.
14. Prefer pausing over deleting and never overwrite historical performance or audit data.
