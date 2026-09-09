# Revamp verification — 8 September 2026

## Baseline and scope

Started clean on main at 4cfa68b2530de2419ec4071da34d2bf5ec8beb6a after fetch and fast-forward sync. Reviewed both routes before redesign at desktop and 390px. No Ads account was connected, no external messages were sent, and no Ads mutation was attempted. Policy, executor, analyst rules and their existing tests were preserved.

## Automated validation

- Clean `npm ci`: successful; 0 reported dependency vulnerabilities.
- `npm run lint`: passes.
- `npm run typecheck`: passes.
- `npm test`: 55 tests across 8 files pass, including 17 existing controlled-write policy/executor tests.
- `npm run build -- --webpack`: optimized production build passes. Default Turbopack build stalled locally during compilation and was interrupted; this is not recorded as a passing Turbopack build.
- Production server: `npm run start -- --port 3000`.
- `git diff --check`: passes.

New regression coverage checks malformed/null/non-object requests, missing input, invalid phone/ZIP/need/homeowner values, unqualified but valid intake, all seven attribution fields, no contact data in the response, session expiry, unavailable storage, campaign-source replacement and reconciled campaign/funnel totals.

## Browser verification

Used the Codex browser against the running app, then the optimized production server. Saved the four replacement screenshots in `public/screenshots/`.

- Desktop funnel: 1440 × 1000; inspected hero, diagram, form, identity and restrained fictional labeling.
- Mobile funnel: 390 × 844, plus repair variant at 320 × 740; inspected sticky actions, form positioning and input sizing. No document overflow at 320 or 390.
- Desktop operator: 1440 × 1000; inspected hierarchy, cumulative stage chart, local mock-value caveat, campaign table and navigation.
- Mobile operator: 390 × 844; inspected campaign cards, recommendation details, policy controls and expanded audit. No document overflow at 320, 390, 768 or 1024 widths.
- Campaign scope: Broad research shows 4 leads, 1 qualified, 0 booked and an absent booking CPA (not a fabricated zero); search terms narrow to the campaign. Reset restores account totals.
- Empty search: unmatched query displays a useful empty state; Reset search view clears the query, review filter and campaign scope.
- Form: empty submission triggers native required-field validation. A repeated-digit phone triggers a server error while retaining entered details. Correcting it yields a qualified demo receipt.
- Qualification: non-homeowner plus out-of-area ZIP produces a review-needed receipt with both explanations; no appointment confirmation is implied.
- Source continuity: tagged storm entry with UTMs, GCLID and GBRAID → internal home link removes URL tags → valid submission still shows Google source and a preserved click identifier. Endpoint tests separately assert all seven fields.
- Intent: storm and repair headings match their queries and preselect the corresponding roof concern. Only allowlisted intent values affect content.
- Policy lab: low-risk example permitted by policy; medium-confidence budget example blocked; high-risk example requires exact-proposal simulated approval; adding approval permits the example; uncertain tracking blocks it even with approval. Execution remains unavailable throughout.
- Audit: actor/time/entity/proposal, before/after, metrics, confidence, risk, approval state, policy reason, rollback and absence of a provider request remain inspectable. No invented successful execution history.
- Accessibility: labeled inputs and fieldsets, visible focus styles, semantic disclosure controls, invalid-field behavior and success-heading focus checked. Form reset returns focus to the form heading. Reduced-motion rule inspected in CSS; no animated charts or timers. No claim of a full assistive-technology certification or physical-device test.

## Limits

This is a verified local mock product demonstration, not a verified live acquisition system. No call was placed to the fictional number. No actual lead delivery, CRM persistence, offline upload, account authorization or provider rollback was tested. Latency and recovery code exists, but an interrupted-network browser test is not included in this record. The attribution window is demonstration behavior; a real client requires a consent/privacy and retention decision.
