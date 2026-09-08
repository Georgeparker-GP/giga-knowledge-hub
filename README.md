# Giga Knowledge Hub

Personal project, knowledge and intelligence workspace built around:

**Discover → Understand → Save → Connect → Act → Create**

## Live app
https://Georgeparker-GP.github.io/giga-knowledge-hub/

## Current build — V6 Cloud
The app now combines a local-first PWA with a real Supabase cloud layer:

- Five scopes: Projects, Logistics, Football, Daily Knowledge, Content Studio
- Global search and connected SVG knowledge graph
- Favorites, notes, tasks, calendar and sources
- Today / public intelligence surface
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
`profiles`, `objects`, `edges`, `notes`, `tasks`, `events`, `sources`, `files`, `news_items`, `sync_state`.

Workspace rows are protected with RLS. Private Storage paths begin with the authenticated user ID. The browser contains only the Supabase **publishable** key; no service-role key or server secret is committed.

## Sync behavior
The application remains local-first. Before sign-in, it works from browser storage. After sign-in, V6 can upload the local workspace, pull the cloud workspace and sync between devices. Existing local JSON export remains an independent backup path.

## Security boundary
This repository is public. Never commit passwords, service-role keys, OpenAI/API secrets, private work files, confidential operational data, or personal secrets. Server-side secrets belong in Supabase/hosting secret stores only.

## Still server-side / future intelligence work
Live source ingestion, scheduled jobs, story clustering, verification, priority scoring and AI generation require server-side functions and source/API configuration. They must not expose privileged keys in this static frontend.

## Run locally
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.
