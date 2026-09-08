# Daily Ads Analyst v0

## Inputs
- Date range: yesterday, trailing 7 days, trailing 30 days
- Campaign/ad group/keyword/search-term spend and conversions
- Lead-stage outcomes from CRM
- Campaign budget and pacing
- Device, hour and geographic segments when statistically useful

## Core calculations
- CPL = spend / leads
- CPQL = spend / qualified leads
- Cost per booked inspection = spend / booked inspections
- Cost per converted lead = spend / converted leads
- Lead-to-qualified rate
- Qualified-to-booked rate
- Booked-to-won rate

## Recommendation classes
1. Wasted-search-term candidate
2. Negative-keyword candidate
3. Budget reallocation candidate
4. Landing-page problem candidate
5. Lead-quality anomaly
6. Tracking/data-quality issue
7. Geographic opportunity
8. Day/hour/device observation

## Safety
- Read-only first.
- Every recommendation must include evidence and confidence.
- Never infer a true business outcome from Google conversion counts when CRM outcome data disagrees.
- Avoid strong optimization changes on tiny samples.
- Never exceed client-level budget constraints.

## Example analyst output
"Storm Damage spent $1,106, produced 5 qualified leads and 4 booked inspections. CPQL is higher than Repair, but booked-inspection efficiency is materially better. Maintain budget. Pull search terms with >= $50 spend and zero qualified leads for negative-keyword review."

## Google integration boundary (2026)
- Google Ads API: read campaign/search-term/account performance and conversion reporting.
- Google Ads Data Manager API: future offline qualified/converted lead event uploads.
- Keep both adapters separate so reporting cannot accidentally gain mutation privileges.
