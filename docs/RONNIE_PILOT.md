# Ronnie Roofer — personalized concept and proposed pilot

Prepared September 9, 2026. Independent proposal, not an approved client engagement.

## Reviewable deliverables

- `/`: Ronnie-branded landing-page demo. Replacement, storm inspection and repair examples change the search phrase, headline, imagery, form concern and relevant review excerpt.
- `/?intent=repair&preview=homeowner`: homeowner presentation without the educational carousel. Proposal disclosure remains.
- `/pilot`: owner-facing offer, scope, budget boundary and renewal terms.
- `/operator`: internal sample acquisition dashboard. All spend, lead and revenue numbers remain mock and are not Ronnie's results.
- Calls open a preview dialog; they never dial. Forms validate mock details and do not store or deliver them. No advertising or outreach has been launched.

## Prospect and source evidence

Ronnie Roofer, public business phone (281) 515-0630. Official site: https://www.ronnieroofer.com/ . The site lists Houston, Clear Lake, League City, Webster and other Bay Area communities, residential replacement/repair, and free inspections. Their budget, active advertising, agency relationship, interest and available capacity are unknown.

Google's business panel and reviews were inspected directly in the browser on September 9, 2026: 5.0 from 45 reviews. The official site still showed 44; that stale number is not used. This is a dated snapshot, not a live feed or an API integration.
https://www.google.com/maps/place/Ronnie+Roofer/data=!4m2!3m1!1s0x0:0xba1f39ad3d6cc5de

Short, exact, attributed excerpts total 16 words:
- Zain Omar, replacement: “he earned my full trust”
- Seth Meier, inspection: “Very friendly and very knowledgeable.”
- Windy McClain, repair: “He was quick and thorough.”

Direct review links live in `config/ronnie-proof.ts`. They are labeled selected excerpts, with the snapshot date. The inspection review is not represented as a storm-damage result. No reviewer portraits, invented testimonials, certification badges or insurance outcomes are added. Before public launch, approve reuse and select a compliant review-display method. If using Google Places, follow https://developers.google.com/maps/documentation/places/web-service/policies . Public availability alone is not asset permission.

## Photo provenance

Published by Ronnie Roofer, downloaded September 9, 2026 and compressed to WebP; no generated project imagery is used in this concept. Captions identify their published gallery rather than asserting unverified project locations, prices, dates or storm causes. All files require business approval for launch/reuse.

- `brick.webp`: https://www.ronnieroofer.com/__l5e/assets-v1/19341ae0-eda8-4ac6-b05e-26c8efbb0855/project-brick-two-story.jpg
- `ranch.webp`: https://www.ronnieroofer.com/__l5e/assets-v1/a6a46c04-fe6a-4124-b853-3e87f1359e97/project-ranch-charcoal.jpg
- `workers.webp`: https://www.ronnieroofer.com/__l5e/assets-v1/d613cec8-ab29-4e0a-870e-f86464ed9a89/workers.jpg
- `mansion.webp`: https://www.ronnieroofer.com/__l5e/assets-v1/c8d5095a-8e82-4bcb-93f7-3d4ebf2b5fe8/project-mansion.jpg (reference asset; not displayed)

The small header uses a new typeset red Ronnie / Roofer concept wordmark. It is not claimed to be their exact existing logo. Their source logo was inspected at https://www.ronnieroofer.com/assets/logo-bUrAy7nU.png but its glowing background does not reproduce well at mobile-header size.

## Proposed commercial terms

- One founding client; $0 setup permanently waived and $0 management for first 30 live days.
- Proposed initial **$1,000 total advertising cap**, paid directly to Google. No amount has been committed. No automatic increase. Stop at the cap or trial end, whichever comes first, unless explicitly renewed.
- First learn whether the company already buys Google Ads. Consider an approved portion of existing spend instead of new incremental spend; do not alter an existing account without review and permission.
- Check local Keyword Planner forecasts and target economics before recommending a new $1,000 test. If that budget cannot generate useful evidence, do not launch an underpowered test merely to win the client. No lead or profitability guarantee.
- Launch one service in a small, approved area. The three demo examples illustrate possibilities, not a promise to split $1,000 across three campaigns. Proposed ZIPs 77058/77059/77062/77573/77598 are illustrative pilot targeting and need Ronnie's approval.
- Include one focused campaign/landing page, tracking, direct lead delivery and weekly management. No mandatory CRM. Client answers leads and flags good fit/wrong fit/spam; downstream sales stages are optional.
- Day-21 review. Optional renewal: $1,250/month for next three months, then $1,500/month for the same scope, with advertising separate. Agree before launch; no automatic paid conversion.
- Client retains their Ads account and data. Agree page hosting, tracking costs, asset rights and offboarding terms before signature. No setup clawback. No obligation to provide a positive testimonial; named case study only with separate approval.
- Future standard pricing hypothesis: $2,000 setup + $1,500/month. Do not present those amounts as historical prices or verified market averages.

## 90-second walkthrough

1. “Ronnie and Amy, I put together a concept using the work and customer feedback you've already earned.” Open `/`.
2. “Someone looking for a replacement sees this page. Someone searching for a leak repair sees this one.” Select repair; show corresponding review and form concern.
3. “On mobile, the homeowner can call or send a short request. It goes straight to your team.” Open the call preview, then submit made-up details. Explain that delivery is simulated until setup.
4. “You don't have to learn another CRM. We handle the ads and report on what you're spending and the inquiries you're getting.” Optional `/operator`, explicitly mock.
5. Open `/pilot`: “I'd like to offer free setup and the first 30 live days of management. Before recommending ad spend, I'd like to understand what you're running now and the jobs you want.”

## Outreach draft — not sent

Hi Ronnie and Amy — I put together a short mobile demo showing how someone searching for a roof repair in Clear Lake could land on a page featuring your work and customer reviews, then contact you directly. Are you currently running Google Ads, or getting most of your work through referrals? I'd be happy to show you the concept. I'm looking for one founding roofing client and would waive setup and the first 30 days of management; any advertising budget would be agreed with you first.

## Before any live launch

Confirm interest/capacity, service/area, current account and campaigns, approved budget, business assets/claims, a lead-response owner, privacy/consent copy, persistent form capture, authorized delivery destination, call tracking and working end-to-end attribution. No live integration is currently claimed. This proposal is marked noindex; noindex is not authentication.

## Validation — September 9, 2026

- Lint, TypeScript, 56 tests across 8 files, and production webpack build passed.
- Live production server inspected at desktop 1440px and mobile 320/390/430px. No horizontal page overflow at those widths; pilot page also checked at 320/390/1440px.
- Intent arrows update headline, photo, selected excerpt and form concern; wrapping preserves supplied UTMs and click ID.
- Direct homeowner preview hides the teaching carousel.
- Mobile sticky request button lands on the form. Mock submission with 77058 passes the configured qualification rules; no storage or delivery occurs.
- Call preview opens a native modal; page contains zero tel links. No call was placed.
- No real Ads/call/form delivery integration or physical-device keyboard testing is claimed.
- Screenshots: `public/screenshots/ronnie-desktop.png`, `ronnie-mobile.png`, `ronnie-form-mobile.png`, `ronnie-pilot-mobile.png`.

## Review deployment

Hosted concept: https://ronnie-roofer-proposal.vercel.app/

Owner offer: https://ronnie-roofer-proposal.vercel.app/pilot

Dedicated Vercel project `ronnie-roofer-proposal`, separate from any existing business website. The first deployment is classified as production by Vercel, but the application remains an independently labeled proposal with simulated calls/forms and mock operator metrics. No live client service or ad account is connected.
