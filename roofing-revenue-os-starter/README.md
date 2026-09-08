# Roofing Revenue OS — starter

A Codex-ready MVP starter for a Houston roofing customer-acquisition service.

## What is included
- `/` prospect-facing fictional roofing demo funnel
- `/operator` mock internal operator dashboard
- lead-capture API stub
- Supabase/Postgres schema
- `AGENTS.md` instructions for Codex
- founding-client offer + pilot guardrails
- Daily Ads Analyst spec + workflow
- four ready-to-run Codex task prompts

## Run locally
```bash
npm install
npm run dev
```
Then open `http://localhost:3000` and `http://localhost:3000/operator`.

## Recommended Codex workflow today
Run these as separate Codex threads/worktrees, in order or partially parallel:
1. `prompts/codex/01-build-production-mvp.md`
2. `prompts/codex/03-analyst-engine.md`
3. `prompts/codex/02-google-ads-readonly.md` once a Google Ads test account/credentials are available
4. `prompts/codex/04-storm-mode.md`

## Important
This repo intentionally starts with mock data and a fictional roofing brand. Do not present it as a real roofer or use unverified business claims.
