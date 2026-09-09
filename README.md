# Roofing Revenue OS

An acquisition-focused mock MVP for a Houston roofing customer-acquisition service. It demonstrates a mobile prospect funnel and a controlled, risk-gated operator control room with an independent Ronnie Roofer proposal using sourced business details and project photos. Advertising datasets and outcomes remain explicitly mock. Calls and forms are simulated.

## The founding-client service

Google Search Ads → dedicated pages matched to replacement, storm or repair searches → tracked calls/forms → leads sent directly to the roofer → acquisition quality review and controlled Ads optimization. We build and host paid-traffic pages; the roofer keeps their existing website and sales process.

Open `/` and use the left/right search controls, drag the hero, or swipe on a phone to change the roof image, headline and form concern together. Append `preview=homeowner` to show the matching destination without demo controls. The examples select configured `intent` destinations; they do not read a visitor’s private Google search or automatically learn a winning page. Related keywords share a page.

Read [V1 service boundaries and demo script](docs/V1_SERVICE.md) before extending this product.

## Product boundaries

- The public funnel stays visibly labeled as a demo until verified real-client data is configured.
- Google Ads and CRM data are mocked. The controlled-write policy is implemented, but there is no live mutation adapter or account connection.
- V1 measures acquisition and qualified-lead cost. Inspections, estimates, wins and revenue are optional enrichment after the roofer shares reliable outcomes. No CRM adoption or sales-stage updates are required.
- No licenses, reviews, warranties, certifications, prices, insurance outcomes or service claims are implied.

## Requirements

- Node.js 20.9 or newer
- npm

## Exact local setup

From the repository root:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open:

- Prospect demo: [http://localhost:3000](http://localhost:3000)
- Our internal acquisition dashboard: [http://localhost:3000/operator](http://localhost:3000/operator)

The current mock MVP does not require populated environment variables. `.env.example` reserves names for future Supabase persistence and separately deployed Google Ads reporting/mutation adapters.

## Verification commands

```bash
npm run test
npm run lint
npm run typecheck
npm run build
npm audit
```

`npm run test` covers attribution capture, homeowner/service-area/contact qualification gates, duplicate/spam rejection, CPQL and downstream funnel math, deterministic analyst thresholds, tracking stop conditions, spend caps, risk/approval policy, provider preflight and complete change-audit behavior.

## What is implemented

- `/` — responsive Ronnie Roofer proposal with sourced photos and review excerpts
- `/operator` — campaign-scoped spend, calls, forms, qualified-lead economics, an optional cumulative sales funnel, mobile campaign cards, searchable terms, complete recommendation evidence, a read-only policy lab and audit details
- `/api/leads` — validated mock capture endpoint; it does not persist or route contact data
- `config/client.ts` — one lightweight source for white-label identity and service-area values
- `lib/qualification.ts` — testable v0 qualified-lead rules
- `lib/metrics.ts` — testable funnel economics and conversion rates
- `lib/analyst/` — deterministic rules, configurable samples and evidence-only summarization
- `lib/google-ads/` — typed controlled-write policy, executor, adapter boundary and audit contract
- `lib/mock-data.ts` — clearly separated fictional dashboard data
- Session-scoped attribution continuity for UTM fields, GCLID and GBRAID (30-minute expiry; new tagged visits replace the complete source)
- Intent entry points: `/?intent=repair`, `/?intent=replacement`, `/?intent=storm`
- Qualified / review-needed mock receipt; contact details are never persisted or routed
- Self-hosted Manrope variable font with its OFL license; generated architectural roof imagery, labeled as illustration rather than client work proof

## Client configuration

Edit `config/client.ts` to supply verified identity, phone, market and service-area ZIPs. Keep `isDemo: true` and the demo disclaimer until every public value and claim has been approved. A future implementation should derive the configuration from persistence rather than expanding hard-coded conditions throughout the UI.

## Screenshots

### Prospect funnel

![Prospect funnel desktop](public/screenshots/landing-desktop.png)

![Prospect funnel mobile](public/screenshots/landing-mobile.png)

### Operator dashboard

![Operator dashboard desktop](public/screenshots/operator-desktop.png)

![Operator dashboard mobile](public/screenshots/operator-mobile.png)

## QA checklist

- [x] Demo disclaimer remains visible above both product surfaces.
- [x] No real contractor or unverified trust claim is presented.
- [x] Prospect page has no document-level horizontal overflow at 390 px or 1440 px.
- [x] Operator campaigns recompose into mobile summary cards with expandable funnel detail.
- [x] Keyboard focus is visible and reduced-motion preferences are respected.
- [x] Call buttons show Ronnie’s public number in a clearly labeled preview dialog; no call is placed.
- [x] Form validation, success state and retry flow work in a production build.
- [x] UTM, GCLID and GBRAID query values are included with mock form submissions.
- [x] Recommendations are generated by deterministic evidence/threshold rules.
- [x] Tracking uncertainty stops optimization instead of guessing.
- [x] Interactive policy scenarios make approval, tracking and provider boundaries explicit without executing or saving changes.
- [x] Every modeled mutation records previous/new values, rationale, metrics, confidence and status.
- [x] Unit tests, TypeScript and the optimized production build pass.
- [ ] Before a real pilot, verify client service area, contact routing, claims, consent language, privacy policy, call tracking and Ads account ownership. CRM access is optional.
- [ ] Before connecting Google Ads, complete a successful reporting request, deploy a separate mutation adapter, persist approvals/audits and test against a Google Ads test account.

## Current demo verification

See [V1 QA and screenshots](docs/QA_V1_DEMO.md) for the current validation record and [service boundaries](docs/V1_SERVICE.md) for the sales script.

![Search-matched page demo](public/screenshots/roofing-slider-desktop.png)

## Revamp audit and verification

Read [the critical audit](docs/CRITICAL_AUDIT.md), [ranked opportunities](docs/OPPORTUNITIES.md) and [the verification record](docs/QA_REVAMP.md).

The current local production verification uses `npm run build -- --webpack`; the default Turbopack build stalled locally during this audit. Both use the same Next.js application.

The dashboard is a static 29-day sample cohort. Campaign filters affect the performance and search views; the analyst queue is explicitly account-wide. Stage counts are cumulative and must not be added together. Signed value is fictional contract value, not cash collected or profit.

## Next phases

Google Ads reporting, controlled mutations and future offline conversion uploads remain separate adapters. Qualifying reversible low- and medium-risk actions may auto-execute once a live provider is configured; high-risk actions require explicit approval. See `docs/ADS_ANALYST_SPEC.md` for the complete gates and hard guardrails.

The current photographic slider design, interaction and image prompts are documented in [HERO_DESIGN.md](docs/HERO_DESIGN.md).

## Current personalized concept

`/pilot` presents the founding-client proposal: free setup and 30 live days of management, a proposed $1,000 initial total ad-spend cap subject to forecasts/approval, and optional renewal terms. See [Ronnie pilot brief](docs/RONNIE_PILOT.md) for source provenance, limitations, and draft walkthrough/outreach. Older QA/design documents describe earlier demo iterations.
