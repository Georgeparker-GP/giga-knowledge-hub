# Architecture

## Current V4
Static progressive web app prototype:
- HTML/CSS/JavaScript frontend
- localStorage persistence
- JSON seed data
- PWA manifest + service worker
- GitHub Pages deployment workflow

## Planned production architecture
Frontend:
- Next.js / React
- Tailwind CSS
- React Flow or Cytoscape.js

Backend:
- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Row Level Security

Background intelligence:
- Source adapters (RSS/API where permitted)
- Scheduled ingestion jobs
- Story clustering
- Verification status
- Priority scoring
- AI summaries

Key principle:
Discover → Understand → Save → Connect → Act → Create
