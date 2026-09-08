# GitHub-only maximum boundary

The Hub intentionally pushes GitHub Pages + Actions as far as practical before adding a cloud application backend.

## Implemented on GitHub
- Static PWA hosting through GitHub Pages
- Automatic deployment from `main`
- Local-first CRUD, notes, favorites, tasks, calendar and file-reference metadata
- Knowledge graph and cross-object relationships
- JSON backup/import
- Today / intelligence JSON layer
- Scheduled public-feed refresh through GitHub Actions
- Source health, deduplication, basic story clustering, verification labels and priority scoring
- Content Studio handoff
- Responsive desktop/mobile interface

## Boundary
GitHub Pages is static hosting. Browser-local personal state does not automatically synchronize between devices. GitHub Actions can periodically build public data files, but they are not a substitute for a private realtime database or authenticated API.

A backend becomes justified when the Hub needs private cross-device sync, authentication, private file storage, realtime collaboration, protected server-side AI/API calls, or per-user private data.

## Security rule
Never commit passwords, API keys, tokens, confidential operational data, or private personal data to this public repository. Secrets required by Actions belong in repository/environment secrets and should only be used server-side during workflows.
