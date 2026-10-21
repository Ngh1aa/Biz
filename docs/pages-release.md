# GitHub Pages release — Biz V0.2

## Scope
Publish the reviewed pastel browser prototype and retain monochrome through the theme query. User explicitly requested GitHub Pages deployment. Keep the repository's existing Pages source: `main` at `/`; there is no existing application to replace.

Public URL: `https://ngh1aa.github.io/Biz/`.

## Verification and deployment
- Root static HTML uses relative module, font, CSS, graphic and icon URLs.
- Hash/query navigation supports `/Biz/` without rewrite rules.
- `.nojekyll` preserves the static source. Build also copies this marker to `dist/`.
- Read-only CI runs syntax, domain tests and static export. Browser QA remains a separate evidence surface.
- Before reporting a verified release, inspect the deployed Pages commit/status and test actual public routes, graphic/font assets, theme switch, reload and a critical workflow.
- This publishes a synthetic UX prototype. Authentication, server authorization, uploads, payments and native app runtime are not implemented.

## Recovery
Use a forward fix or a normal revert of the release commit followed by the same Pages build and public verification. Do not rewrite shared Git history.

The final provider metadata, source SHA and public browser evidence are saved separately with the release handoff after GitHub finishes publishing; CI green alone is not a live-release claim.
