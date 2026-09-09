# Roofing Revenue OS

A production-quality mock MVP for a Houston roofing customer-acquisition service. It demonstrates a mobile prospect funnel and a read-only operator control room while keeping every company claim, phone number, dataset and outcome explicitly fictional.

## Product boundaries

- The public funnel stays visibly labeled as a demo until verified real-client data is configured.
- Google Ads and CRM data are mocked. There are no account writes or live integrations.
- Success is measured through qualified leads, booked inspections, estimates, wins and revenue—not raw CPL alone.
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
- Operator dashboard: [http://localhost:3000/operator](http://localhost:3000/operator)

The current mock MVP does not require populated environment variables. `.env.example` reserves names for future Supabase persistence and Google Ads read-only reporting.

## Verification commands

```bash
npm run test
npm run lint
npm run typecheck
npm run build
npm audit
```

`npm run test` covers attribution capture, homeowner/service-area/contact qualification gates, duplicate/spam rejection, CPQL and downstream funnel math, zero-denominator handling, and account-level aggregation.

## What is implemented

- `/` — responsive Houston-specific fictional inspection-request funnel
- `/operator` — campaign, search-term, lead-stage, recommendation and audit-trail views
- `/api/leads` — validated mock capture endpoint; it does not persist or route contact data
- `config/client.ts` — one lightweight source for white-label identity and service-area values
- `lib/qualification.ts` — testable v0 qualified-lead rules
- `lib/metrics.ts` — testable funnel economics and conversion rates
- `lib/mock-data.ts` — clearly separated fictional dashboard data
- Query attribution capture for UTM fields, GCLID and GBRAID

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
- [x] Operator tables remain contained and horizontally scroll within their panel on mobile.
- [x] Keyboard focus is visible and reduced-motion preferences are respected.
- [x] Click-to-call uses an explicitly fictional 555 demo number.
- [x] Form validation, success state and retry flow work in a production build.
- [x] UTM, GCLID and GBRAID query values are included with mock form submissions.
- [x] Recommendations show evidence, confidence and proposed/approved/rejected status.
- [x] Disabled review controls make the read-only boundary explicit.
- [x] Unit tests, TypeScript and the optimized production build pass.
- [ ] Before a real pilot, verify client service area, contact routing, claims, consent language, privacy policy, call tracking and CRM ownership.
- [ ] Before connecting Google Ads, use a reporting-only credential and complete a successful read request.

## Next phases

Follow the repository prompts in order. Google Ads starts read-only, offline conversion uploads remain a separate adapter, and every future ad-account mutation requires explicit human approval.
