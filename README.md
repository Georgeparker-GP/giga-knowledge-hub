# Giga Knowledge Hub

A live personal knowledge, project and intelligence workspace built around one operating loop:

**Discover → Understand → Save → Connect → Act → Create**

## Live app
GitHub Pages deployment:

https://Georgeparker-GP.github.io/giga-knowledge-hub/

## Current build — V5.5
The live static application includes:
- Five scopes: Projects, Logistics, Football, Daily Knowledge, Content Studio
- Responsive desktop/mobile navigation
- Global search
- Interactive SVG knowledge graph with zoom/focus
- Cards + detail panel
- Cross-object relationships
- Favorites + recently opened
- Personal notes
- Tasks Kanban: To Do → In Progress → Done
- Calendar with task due dates and events
- File/reference metadata links
- Source manager with reliability tiers
- Add / Edit / Delete / Link items
- Send-to-Content-Studio workflow
- Georgian / English UI foundation
- JSON export / import / local reset
- PWA/offline cache
- Automatic GitHub Pages deployment from `main`

## Important data boundary
V5.5 stores personal workspace changes in the browser using `localStorage`. This means edits are not yet synchronized between phone and desktop.

The repository is public. **Never commit passwords, API keys, tokens, private work files, confidential operational data or personal secrets.** `.env` files are ignored and future server-side secrets must stay in GitHub/Vercel/Supabase secret stores.

## Production backend blueprint
The next architecture phase is prepared for:
- Supabase Postgres
- Supabase Auth
- Private Supabase Storage
- Row Level Security
- Live logistics and football ingestion
- Story clustering and verification
- Priority scoring
- Server-side AI actions
- Multi-device sync

See:
- `docs/architecture.md`
- `docs/roadmap.md`
- `backend/supabase_schema.sql`
- `backend/news_pipeline_pseudocode.py`

## Run locally
```bash
python -m http.server 8000
```
Then open `http://localhost:8000`.
