# Development roadmap

| Increment | Scope | Status |
|---|---|---|
| L1 | Reproduce upstream build; read-only CI; checkpoint | Merged; Verify #1 passed |
| L2 | Optional image fit-to-frame at initial render | Proposed; build and runtime acceptance pending |
| L3 | Reset, resize and fullscreen; preserve deliberate zoom/pan | Planned |
| L4 | Regression tests and verification | Planned |
| L5 | Controlled local installation and Obsidian runtime acceptance | Planned |
| L6 | Consumer-vault marker integration (separate private project) | Planned |
| L7 | Evaluate upstream contribution and licensing | Planned |

## Design contract
Proposed parameters autoFit (default false), fitPadding, fitOnResize. Names and defaults subject to implementation review. Use Leaflet fitBounds on actual active image bounds after a nonzero viewport exists, account for min/max zoom and zoom snapping. Preserve coordinate system and marker positions; never infer distance scale. Real-world maps and maps without opt-in unchanged. Define precedence with explicit zoom/feature/marker settings and layer switches. Reset returns to current fitted overview, not a guessed fixed zoom. Resize/fullscreen refit overview only, preserve intentional detail view. Avoid observer loops and dispose listeners.

## Acceptance
Landscape and portrait synthetic images, narrow and wide panes, initially hidden panes, reset after user pan/zoom, fullscreen enter/exit, image layer switches, marker anchoring and link navigation, opt-out compatibility, real-world maps unchanged. Build verification is not runtime verification. No private assets in this public repository. No automatic public release until license and distribution requirements reviewed.

## Workflow
Branch from current main, preserve upstream attribution and minimize diffs. Update DEVELOPMENT-STATUS.md with verified baseline, exact source scope, blockers and next action. PR review, exact-head Verify, merge only after approval. Build artifacts retained locally or explicitly requested for testing, no routine CI artifact upload. Use original plugin ID only in a controlled backed-up installation; avoid installing both variants simultaneously.
