# MVP Spec

## Surface A — Prospect-facing demo funnel
- Houston roofing-specific hero and CTA
- Click-to-call CTA
- Short qualification form
- Homeowner / need / ZIP / roof-age / phone capture
- UTM + GCLID/GBRAID preservation
- Trust sections populated only from verified client data
- Dedicated storm-intent variant later

## Surface B — Internal operator dashboard
- Spend, clicks, leads, qualified leads, booked inspections, estimates, wins, revenue
- Campaign and search-term drill-down
- Daily AI analyst recommendations
- Recommendation status: proposed / approved / rejected / executed
- Audit trail

## Integrations
### v0
- Mock Google Ads dataset
- Mock lead capture

### v1
- Google Ads reporting connector via plugin or API
- Supabase persistence
- Call-tracking provider
- CRM or lightweight internal pipeline

### v2
- Offline qualified/converted lead uploads via Google Ads Data Manager API
- Controlled Google Ads writes with automatic low/qualifying-medium execution and approval-gated high-risk actions
- Weather/storm trigger data

## Non-goals for v0
- Full CRM replacement
- Live Google Ads execution in the mock/demo environment
- AI phone receptionist
- Meta Ads
- Multi-vertical support
