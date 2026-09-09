Implement a Google Ads reporting adapter behind an interface. Keep this adapter free of mutate/write calls so reporting, controlled mutations and offline outcome uploads retain separate deployment boundaries.

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

Architecture note: keep controlled mutations and offline qualified/converted lead uploads OUT of this reporting adapter. Mutations belong behind the risk policy and executor; outcome uploads belong in a separate Google Ads Data Manager API adapter.
