# Giga Knowledge Hub

Private personal knowledge and intelligence workspace.

Core workflow:

**Discover → Understand → Save → Connect → Act → Create**

## Current build
V4 local prototype with:
- Projects
- Logistics
- Football
- Daily Knowledge
- Content Studio
- Favorites
- Notes
- Tasks
- Calendar
- Sources
- File records
- Cross-object links
- JSON backup/import
- PWA shell

## Run locally
```bash
python -m http.server 8000
```

Then open:
`http://localhost:8000`

## GitHub Pages
A GitHub Actions workflow is included at:

`.github/workflows/deploy.yml`

After the repository is published and GitHub Pages is enabled with **GitHub Actions** as the source, pushes to `main` can deploy automatically.

## Production plan
See:
- `docs/architecture.md`
- `docs/roadmap.md`
- `backend/supabase_schema.sql`
