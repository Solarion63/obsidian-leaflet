# Development roadmap

| Increment | Scope | Status |
|---|---|---|
| L1 | Reproduce upstream build; read-only CI; checkpoint | Merged; Verify #1 passed |
| L2 | Optional image fit-to-frame at initial render | Merged; Verify #3 and #4 passed; runtime pending |
| L3 | Reset, resize and fullscreen; preserve deliberate zoom/pan | Merged; Verify #5 passed |
| L4 | Regression tests and verification | Merged; Verify #7 passed; 14 mocked-boundary tests |
| L5a | Local build and installation procedure | Merged; Windows build passed |
| L5b.1 | XML parser and compatible security updates | Merged; Verify #11 passed; 5 audit findings remain |
| L5b.2 | Remaining build-tool vulnerabilities | Merged; Verify #13 passed; local audit zero |
| L5c | Obsidian runtime acceptance | Metraith 12/12 passed; broader compatibility pending |
| L6 | Consumer-vault marker integration (separate private project) | Planned |
| L7 | Evaluate upstream contribution and licensing | Planned |

## Design contract
Proposed parameters autoFit (default false), fitPadding, fitOnResize. Names and defaults subject to implementation review. Use Leaflet fitBounds on actual active image bounds after a nonzero viewport exists, account for min/max zoom and zoom snapping. Preserve coordinate system and marker positions; never infer distance scale. Real-world maps and maps without opt-in unchanged. Define precedence with explicit zoom/feature/marker settings and layer switches. Reset returns to current fitted overview, not a guessed fixed zoom. Resize/fullscreen refit overview only, preserve intentional detail view. Avoid observer loops and dispose listeners.

## Acceptance
Landscape and portrait synthetic images, narrow and wide panes, initially hidden panes, reset after user pan/zoom, fullscreen enter/exit, image layer switches, marker anchoring and link navigation, opt-out compatibility, real-world maps unchanged. Build verification is not runtime verification. No private assets in this public repository. No automatic public release until license and distribution requirements reviewed.

## Workflow
Branch from current main, preserve upstream attribution and minimize diffs. Update DEVELOPMENT-STATUS.md with verified baseline, exact source scope, blockers and next action. PR review, exact-head Verify, merge only after approval. Build artifacts retained locally or explicitly requested for testing, no routine CI artifact upload. Use original plugin ID only in a controlled backed-up installation; avoid installing both variants simultaneously.

## L6a runtime acceptance
PR #9 merged at ab3f623e8a5a401495d17753531667109b191e4d; Verify #17 passed (46100880932). Initial local test used outdated build; corrected by updating main, rebuilding and reinstalling. GM subsequently reported 12/12 passed: native landscape proportions, width breakout, unchanged text width, undistorted fit, Reading View, Live Preview, pane resizing, detail preservation, reset, fullscreen, existing portrait map and all markers unchanged, no unexpected Leaflet console errors. Scope is tested local installation and theme, not all Obsidian layouts. Hidden panes, layer switches, geographic and nested layout compatibility still outstanding; licensing review remains open. No private assets or binaries.
