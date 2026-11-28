# Local runtime acceptance (Windows)

Use a local checkout of this fork, not a community-plugin update or public release. Keep the original plugin ID and settings. This procedure is for controlled testing; no public binary distribution pending licensing clarification.

## Build
Install Git and Node.js 22 (npm included). Clone using GitHub Desktop, select main, pull the current verified commit, then open PowerShell in the checkout. Run:

```powershell
npm ci
if ($LASTEXITCODE -ne 0) { throw 'Dependency install failed' }
node --test tests/image-fit.test.cjs
if ($LASTEXITCODE -ne 0) { throw 'Regression tests failed' }
npm run build
if ($LASTEXITCODE -ne 0) { throw 'Build failed' }
```

Expected bundle: main.js, manifest.json, styles.css. Note git rev-parse HEAD. Do not copy source files or node_modules into vault.

## Install with backup
Close Obsidian completely before running. From the repository root, execute:
```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Install-LocalTest.ps1 -VaultPath 'C:\path\to\vault'
```
The script backs up the entire installed plugin folder to a timestamped directory outside the vault, then replaces only the three bundle files. It never deletes data.json or installs a second plugin ID. Record the printed backup path. If your vault uses a custom configuration directory, pass -ConfigDirectory with that directory name (default .obsidian). Stop automatic community plugin updates during testing if enabled; upstream updates may replace the local build. Reopen Obsidian and confirm Leaflet is enabled.

## Test block
Use a local test note with a unique ID and an existing image filename. Do not publish campaign assets in this repository. For the campaign map, preserve its existing map ID if testing in place and retain the original source links. Suggested parameters:
```leaflet
id: image-fit-test
image: [[your-image.png]]
height: 750px
autoFit: true
fitPadding: 12
fitOnResize: true
minZoom: 1
maxZoom: 10
zoomDelta: 0.25
darkMode: false
```
If existing zoom limits constrain fit, adjust minZoom without changing maxZoom (automatic image coordinate bounds depend on maxZoom). Keep original map ID and coordinate system for established markers.

## Runtime checklist
1. Portrait and landscape maps open fully visible in Reading View, with proportions preserved.
2. Zoom and pan; Reset restores full image at current viewport size.
3. Resize narrow/wide in overview; whole image remains visible.
4. Resize while zoomed/panned; detail view stays intact.
5. Enter/exit full-screen in overview and detail; each respects state.
6. Hidden tab reopened; map fits on first visible render.
7. Switch image layer; reset to its bounds.
8. fitOnResize:false disables responsive refit but Reset works.
9. autoFit omitted/false preserves standard image-map behavior.
10. Geographic maps unaffected.
11. Existing markers remain anchored; clicking opens correct note.
12. Open/close repeatedly; no errors in developer console; original/standalone image links still work.

Record Obsidian version, installed upstream version before replacement, commit SHA, pass/fail for each case and screenshots/console errors if failed. Report test limitations or skipped cases separately. A successful build is not runtime acceptance.

## Rollback
Close Obsidian. Copy main.js, manifest.json, styles.css from the backup directory into the existing plugin directory, leaving current data.json alone. If settings have become incompatible, preserve current folder separately and restore full backup only after review (this may discard new markers/settings). Reopen Obsidian. Remove autoFit/fitPadding/fitOnResize from test notes or restore prior note revision if desired.

## L6b Live Preview regression acceptance
With an opt-in full-width landscape map, cold-start directly into saved Live Preview; verify entire frame and controls visible and clickable, native aspect correct, text width unchanged. Switch Reading View and Live Preview twice, close/reopen note, restart application, resize pane and toggle sidebar, check fullscreen/reset and intentional zoom/pan. Check nearby ordinary code blocks, nested maps, fixed-width portrait maps, and existing marker navigation; no unexpected console errors. If failed, record ancestor clipping and computed bounds before changing CSS. No claim of runtime success from CI alone.
