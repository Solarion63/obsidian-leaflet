# Development status

2026-11-27 — L1 baseline setup. Upstream javalent/obsidian-leaflet, version 6.0.5, commit a26e36bd5d2bdfb3f930562f427241327d306e6e. Public fork Solarion63/obsidian-leaflet. Source code and dependency lockfile unchanged in L1. Build verification proposed; check live PR and exact-head CI before merging. Node 22 selected for initial CI rather than upstream's historical Node 18; compatibility not yet demonstrated.

Inherited release automation removed from the active workflows in this fork to prevent accidental publishing or external notification; original remains recoverable in upstream history. Verify is read-only, no artifact upload. No release or plugin installation authorized by this increment. Package metadata and lockfile declare MIT, but no standalone license file at baseline and GitHub license metadata null. Clarify upstream license and notices before publishing modified builds; do not invent a copyright notice.

## Resume
Read this status and DEVELOPMENT-ROADMAP.md, verify main, open PRs and actual workflow conclusions. If L1 passes and is merged, implement L2 on a separate branch. If it fails, inspect logs and fix baseline without mixing feature changes. Update checkpoint in each substantive PR. Keep private campaign maps, notes, data and credentials out of this public fork. Use synthetic images for tests.

## Scope
Image map auto-fit is opt-in, with existing plugin identifier preserved for eventual controlled local replacement. No runtime feature changes yet. Original upstream workflows available in baseline history. User's Obsidian version and installed plugin version not confirmed. Local runtime acceptance mandatory.
