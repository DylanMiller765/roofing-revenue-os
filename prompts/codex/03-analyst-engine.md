Use docs/ADS_ANALYST_SPEC.md.

Build the deterministic analyst layer first, before adding an LLM:
- Metric calculations for CPL, CPQL, booked-inspection CPA and converted-lead CPA.
- Rules that flag wasted search terms, tracking anomalies and campaign-quality mismatches.
- Minimum-data thresholds configurable per client.
- Recommendation objects with evidence, severity, confidence and status.
- Tests for every rule.

Then add an optional LLM summarizer that can explain recommendations in plain English but CANNOT invent metrics or execute changes. Feed it only structured calculated evidence.
