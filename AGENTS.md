# Roofing Revenue OS — Codex instructions

## Goal
Build a repeatable Houston roofing customer-acquisition operating system. Optimize for qualified homeowner opportunities, booked inspections, and eventually signed-job value—not vanity metrics.

## MVP boundaries
- The public demo funnel must always identify itself as a demo until a real client is configured.
- Never fabricate licenses, reviews, warranties, testimonials, certifications, addresses, service areas, prices, or insurance claims.
- Google Ads integration starts READ-ONLY. Any future write action must be separately gated behind explicit human approval.
- Do not optimize purely for raw CPL. Prefer CPQL, cost per booked inspection, cost per estimate, and cost per converted lead when data exists.
- Preserve attribution identifiers such as GCLID/GBRAID where legally and technically appropriate.
- Store secrets only in environment variables. Never commit credentials.

## Technical direction
- Next.js + TypeScript.
- Keep adapters behind interfaces so Google Ads, call tracking, CRM and model providers can be swapped.
- Use Supabase/Postgres for persistence once we leave mock mode.
- Add tests for qualification logic and recommendation thresholds before enabling any write path.

## Definition of qualified lead (v0)
Qualified means: homeowner = yes, within client service area, roofing need is relevant, valid reachable contact info, and not duplicate/spam. Client-specific rules override this default.

## Tests before completion
For code changes, run typecheck/build where feasible. Never claim integration is live without real credentials and a successful test request.
