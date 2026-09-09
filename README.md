# Giga Knowledge Hub

Personal project, knowledge and intelligence workspace built around:

**Discover → Understand → Save → Connect → Act → Create**

## Live app
https://Georgeparker-GP.github.io/giga-knowledge-hub/

## Current build — V6.2 Cloud
The app combines a local-first PWA with a Supabase cloud layer:

- Five scopes: Projects, Logistics, Football, Daily Knowledge, Content Studio
- Global search and connected SVG knowledge graph
- Favorites, notes, tasks, calendar and sources
- Today / Live Intelligence surface
- Supabase email/password authentication
- Cross-device workspace synchronization
- Postgres persistence with Row Level Security
- Private user-isolated `gkh-files` Storage bucket
- Private file upload/open/delete UI
- Local JSON backup/import remains available
- Georgian / English UI foundation
- Automatic GitHub Pages deployment from `main`
- Calendar local-date handling suitable for Georgia timezone

## Cloud data model
Supabase tables:
`profiles`, `objects`, `edges`, `notes`, `tasks`, `events`, `sources`, `files`, `news_items`, `sync_state`, `tombstones`.

Workspace rows are protected with RLS. Private Storage paths begin with the authenticated user ID. The browser contains only the Supabase **publishable** key; no service-role key or server secret is committed.

## V6.2 Live Intelligence
The public intelligence layer now has a server-side ingestion path:

- `refresh-intelligence` Supabase Edge Function, production architecture V13
- Official FC Barcelona and APM Terminals source discovery
- Article-level title, summary and publication-date extraction
- Stable external IDs and database deduplication
- Scheduled refresh through Supabase Cron / `pg_net`
- Cron authentication uses one private request token stored in Supabase Vault
- The Edge Function validates that token server-side through the restricted `verify_gkh_cron_token()` RPC
- No scheduler token or privileged database key is stored in this public repository
- Browser-side intelligence remains read-only and uses the Supabase publishable key
- Save to Knowledge and Content Studio actions turn intelligence into workspace objects

V13 was manually invoked successfully with HTTP 200 after the secure authentication migration. The scheduled V13 path is treated as fully verified only after a natural Cron execution is observed.

## Sync behavior
The application remains local-first. Before sign-in, it works from browser storage. After sign-in, V6 can upload the local workspace, pull the cloud workspace and sync between devices. Existing local JSON export remains an independent backup path.

## Security boundary
This repository is public. Never commit passwords, service-role keys, OpenAI/API secrets, private work files, confidential operational data, Vault tokens, or personal secrets. Server-side secrets belong in Supabase/hosting secret stores only.

## Next layer — V6.3 AI
After the secure scheduled V6.2 ingestion path is verified, the next server-side layer is AI-assisted understanding and creation: summarization, relevance/priority analysis, knowledge extraction, relationship suggestions, and Content Studio drafting. AI provider keys must remain server-side and AI writes must preserve user ownership and RLS boundaries.

## Run locally
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.
