# Architecture

## Product principle
**Discover → Understand → Save → Connect → Act → Create**

## Current V5.5 — live static application
Frontend:
- Semantic HTML
- Modular CSS
- Vanilla JavaScript
- SVG knowledge graph
- JSON seed data
- Browser `localStorage`
- PWA manifest + service worker
- GitHub Pages deployment through GitHub Actions

User layers:
1. Home / scope navigation
2. Knowledge graph + cards
3. Detail / connection layer
4. Favorites and recent items
5. Notes
6. Tasks Kanban
7. Calendar
8. File/reference metadata
9. Source manager
10. Content Studio handoff
11. JSON backup/import

### Current persistence boundary
Repository seed data is version-controlled. Personal edits are stored only in each browser. There is no cross-device sync, authentication, cloud storage, background ingestion or server-side AI yet.

## Planned production architecture
### Frontend
- Next.js / React
- TypeScript
- Tailwind CSS + shadcn/ui
- React Flow or Cytoscape.js
- PWA

### Data + identity
- Supabase Postgres
- Supabase Auth
- Supabase Storage
- Row Level Security on every user-owned table
- Export/backup path

### Core entities
- objects
- edges
- notes
- tasks
- events
- files
- sources
- news_items

### Intelligence ingestion
Source adapters should use RSS or APIs where available and permitted. Scraping is source-specific and should respect terms and technical constraints.

Pipeline:
`Source → Normalize → Deduplicate → Cluster → Verify → Prioritize → Summarize → Present`

Verification states:
- Official / Confirmed
- Multiple Sources
- Single Source
- Rumor / Unverified

Priority areas:
- FC Barcelona
- Georgian Legionnaires
- Middle Corridor
- Black Sea
- Port Industry

### AI layer
AI must run server-side. Browser code must never expose provider secrets.

Contextual actions:
- Summarize
- Research
- Fact-check
- Explain
- Find Connections
- Save to Knowledge
- Create LinkedIn Post
- Generate English Video Prompt

### Security model
The public GitHub repository contains application code and non-sensitive seed data only. Authentication, service-role credentials, AI keys, tokens and confidential operational files stay outside the repository in managed secret stores.
