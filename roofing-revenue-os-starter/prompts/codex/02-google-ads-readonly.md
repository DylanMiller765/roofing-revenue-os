Implement a READ-ONLY Google Ads adapter behind an interface. Do not add any mutate/write calls.

Requirements:
- Read account/customer metadata.
- Pull campaign, ad group, keyword and search-term performance for configurable date ranges.
- Include spend, impressions, clicks, conversions and available qualified/converted lead segments.
- Normalize monetary micros.
- Store sync results in Postgres/Supabase tables.
- Add robust pagination/error handling.
- Add fixtures so all tests work without real credentials.
- Document required OAuth/developer token setup separately.
- Never commit secrets.

Architecture note: keep offline qualified/converted lead uploads OUT of this adapter. Those belong in a separate Google Ads Data Manager API adapter; this task is read-only Google Ads reporting.
