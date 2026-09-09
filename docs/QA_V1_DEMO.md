# V1 demo verification — 9 September 2026

## Baseline
Fresh checkout of origin/main at 61236d0, including 4cfa68b2530de2419ec4071da34d2bf5ec8beb6a. The original Documents checkout repeatedly timed out reading files, so implementation and the local server use `/Users/dylanmiller/Developer/roofing-revenue-os-demo`. Original checkout contents were not overwritten in this pass.

## Validation
- Clean npm ci: passed, zero reported dependency vulnerabilities.
- Lint and TypeScript: passed.
- Vitest: 56 tests passed across 8 files, including existing qualification, attribution, API and Ads policy/executor coverage plus acquisition channel reconciliation.
- Production build: `npm run build -- --webpack` passed. Production server on port 3000 used for the final browser checks and screenshots.
- Diff whitespace checks passed. AGENTS.md and the tested analyst/policy/executor implementation remain unchanged.

## Browser checks
- Desktop at 1440 × 1000: search selector, homeowner funnel, operator acquisition metrics, optional sales disclosure, campaign filter and search empty/reset state inspected.
- Phone at 390 × 844: compact search selector with matching headline visible, homeowner form and sticky action, and operator metrics inspected. Both pages have matching clientWidth/scrollWidth of 390.
- Narrow viewport: homeowner preview and operator both report matching clientWidth/scrollWidth of 320. This is viewport testing, not a physical device certification.
- Replacement, storm and repair change headline and selected form concern together; preview hides demo controls while retaining fictional labeling.
- Tagged storm entry → repair example → valid mock form submission retains Google source and a click identifier. Links preserve supplied UTMs, GCLID and GBRAID. Existing endpoint tests cover the individual attribution fields.
- Valid fabricated homeowner/contact details produce a qualified demo receipt; the receipt explicitly says no data saved, no contractor contacted and no appointment booked.
- Broad research filter shows $426 spend, 1 call, 3 forms and 1 qualified lead; clearing an unmatched search restores all-campaign totals.
- Optional sales section is closed by default. Channel totals reconcile per campaign and account. No source/policy engine rewrite was made.
- Fresh screenshots saved in public/screenshots: landing desktop/mobile, operator desktop/mobile, and search demo desktop/mobile.

## Limits
All lead/call/performance data is mock. No actual call, delivery, Google Ads request, CRM update or account change was made. Conversion improvements are hypotheses to measure. The unchanged analyst mock still contains optional sales signals; a live acquisition adapter must handle missing downstream data distinctly from zero and verify tracking before consequential optimization.
