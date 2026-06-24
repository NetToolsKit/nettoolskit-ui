# Samples Single Reference Runtime Plan - 2026-04-13

## Scope Summary
- reduce the public `samples/` runtime to a single approved sample based on `.temp/reference`
- remove the public showcase/catalog/pack flow that is making the runtime harder to maintain and farther from the approved baseline
- fix the remaining shell/navigation drift in the single sample so header, side menu, and horizontal mode follow the reference more closely

## Goals
1. `/` must open the single reference-derived sample directly.
2. The sample should not depend on `template-showcase/**` or multi-pack navigation anymore.
3. The sample shell must stay visually close to `.temp/reference`, especially header chrome and left navigation behavior.
4. Runtime copy and actions must stop talking about packs/families/showcase.

## Ordered Tasks
1. Completed: simplified the public samples runtime so the root route resolves directly to the reference-derived sample and removed public routing for catalog/showcase/workspace runtimes.
2. Completed: moved original-sample-only charts/sample-data into `samples/original-reference/**` and detached the sample from `template-showcase/**`.
3. Completed: deleted the extra public sample-pack/showcase files that are no longer needed after the single-sample reduction.
4. Completed: tightened shell parity in shared navigation/layout components where the current implementation still drifted from `.temp/reference`, especially the left navigation behavior and the user avatar alignment.
5. Completed: updated tests and docs so they reflect the single-sample runtime instead of the old showcase/packs architecture.
6. Completed: validated with:
   - `npm run type-check`
   - `npm run test -- tests/unit/landing/LandingTokenization.spec.ts tests/unit/samples/OriginalReferenceApp.spec.ts`
   - `npm run build:samples`

## Closeout Expectations
- `samples/` should read as one clean reference implementation, not a gallery
- no public route should advertise multiple packs/families
- the remaining runtime should preserve only the approved-reference-derived sample and its supporting assets

## Progress Note
- `/` now opens the single public sample directly, while `/?landing=1` and `/?template-runtime=1` remain the only public alternate modes
- `samples/original-reference/OriginalReferenceApp.vue` is now self-contained with local sample data and chart composition
- the public showcase/catalog/workspace sample hosts and their tests were removed from the source tree
- `samples/index.html`, `samples/README.md`, `landing-page/App.vue`, and `README.md` were updated to reflect the single-sample runtime
- browser smoke confirmed the new root sample on `http://127.0.0.1:4173/`