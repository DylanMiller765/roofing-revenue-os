# MVP scope — founding acquisition pilot

## V1: acquisition + qualified-lead tracking
Google Search Ads → dedicated paid-traffic landing pages → tracked calls/forms → leads directly to the roofer → acquisition measurement → controlled Ads optimization.

- `/`: example searches for replacement, storm/hail and repair/leak select a matching headline, inspection action and form concern. Related search needs share a page. Homeowner preview hides the sales walkthrough.
- `/operator`: our internal workspace, showing spend, calls, form leads, qualified leads, CPL, CPQL, campaign/search intelligence, Ads Analyst evidence and controlled-change audit.
- The client shares Ads access (or we help configure it), funds media directly, approves verified details/service area, chooses lead destinations and responds to leads in their normal process.
- No new CRM, software integrations or required inspection/job updates for the roofer.
- We build and host paid-traffic landing pages, not necessarily their full website.

## Current mock implementation
No live Ads account, call provider, lead persistence or delivery is connected. Mock forms validate and show a receipt; no contact details are stored or routed. Click IDs and UTMs survive demo navigation. Dashboard calls/forms are explicitly fictional channel counts, not data collected by clicking the demo phone number. The mock cohort treats channels as non-overlapping; production requires deduplication.

## Required before a live pilot
Verified Ads reporting, durable lead capture and direct delivery, tested tracking numbers/forwarding, qualification definitions and privacy/consent controls. A call click is not a connected call or qualified lead. Call quality needs evidence or review. Do not claim these integrations work until tested.

## V2: optional deeper attribution after proving value
Keep existing sales-stage models, metrics, analyst and policy architecture. Add CRM/inspection/estimate/revenue enrichment and offline outcomes only when the client wants it and the signals are trustworthy. These are not prerequisites for V1. Ads safeguards remain authoritative in AGENTS.md.

## Deliberately deferred
CRM adoption, mandatory stage workflows, revenue guarantees, live provider integration in this demo task, weather expansion and speculative automation.
