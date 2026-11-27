# Development status

2026-11-27 — L1 merged at c56b318455260373794555eed6d078c30a4d395c; Verify #1 passed (46040548182). L2 initial image fit proposed on l2/initial-image-fit. Upstream javalent/obsidian-leaflet, version 6.0.5, commit a26e36bd5d2bdfb3f930562f427241327d306e6e. Public fork Solarion63/obsidian-leaflet. Source code and dependency lockfile unchanged in L1. Node 22 baseline build verified. Check L2 exact-head CI before merging.

Inherited release automation removed from the active workflows in this fork to prevent accidental publishing or external notification; original remains recoverable in upstream history. Verify is read-only, no artifact upload. No release or plugin installation authorized by this increment. Package metadata and lockfile declare MIT, but no standalone license file at baseline and GitHub license metadata null. Clarify upstream license and notices before publishing modified builds; do not invent a copyright notice.

## Resume
Read this status and DEVELOPMENT-ROADMAP.md, verify main, open PRs and actual workflow conclusions. If L2 passes and is merged, implement L3 dynamic reset/resize/fullscreen on a separate branch. If CI fails, inspect logs and fix. Update checkpoint in each substantive PR. Keep private campaign maps, notes, data and credentials out of this public fork. Use synthetic images for tests.

## Scope
Image map auto-fit is opt-in, with existing plugin identifier preserved for eventual controlled local replacement. L2 adds opt-in initial image fitting with padding; one-time fit waits for loaded image and measurable attached viewport. Explicit feature/marker/distance zoom takes precedence. Zoom limits still apply. Initial fitted view saved for existing reset. Dynamic refitting not implemented. Local runtime tests pending. Original upstream workflows available in baseline history. User's Obsidian version and installed plugin version not confirmed. Local runtime acceptance mandatory.
