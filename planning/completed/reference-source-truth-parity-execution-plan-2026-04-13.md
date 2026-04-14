# Reference Source Truth Parity Execution Plan

Date: 2026-04-13
Branch: `feat/remove-cms-whitelabel-reference-2026-04-01`
Spec: `planning/specs/active/reference-source-truth-parity-audit-2026-04-13.md`

## Scope Summary

Close the remaining product-shell parity gaps between the single public sample runtime and `.temp/reference`, treating the reference application as the visual and behavioral source of truth.

This plan focuses on:

1. Global baseline parity
2. Header and brand parity
3. Menu and navigation parity
4. Runtime copy/data parity
5. Final desktop/mobile comparison pass

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Tester: mandatory
- Reviewer: recommended before remote push
- Release closeout: required when the parity pass is considered complete

## Ordered Tasks

### Task 1 — Global baseline parity

Goal:
- Make the public sample inherit the same base visual environment as the reference.

Target paths:
- `samples/index.html`
- `samples/main.ts`
- `samples/original-reference/OriginalReferenceApp.vue`
- `src/styles/global.scss`
- any sample-only host stylesheet needed for the public runtime

Changes:
- Align browser title/product identity to the reference baseline
- Align body background and body font baseline with `.temp/reference/src/css/app.scss`
- Remove product-demo naming from public sample chrome

Commands:
- `npm run type-check`
- `npm run build:samples`

Checkpoint:
- Header, browser tab, and page shell should read like a product runtime, not a demo runtime

Suggested commit checkpoint:
- `refactor(samples): align global runtime baseline with reference`

### Task 2 — Header and brand parity

Goal:
- Match the reference header composition more strictly.

Target paths:
- `samples/original-reference/OriginalReferenceApp.vue`
- `src/templates/layouts/MainLayoutTemplate.vue`
- `src/templates/navigation/UserMenuTemplate.vue`
- `samples/assets/reference-header-logo.png`

Changes:
- Lock the public sample to the reference brand footprint
- Align menu toggle, logo spacing, avatar placement, and toolbar density
- Remove any remaining sample-owned deviations in the header contract

Commands:
- `npm run type-check`
- `npm run test -- tests/unit/samples/OriginalReferenceApp.spec.ts`

Checkpoint:
- Side-by-side comparison shows the header reading as the same shell family

Suggested commit checkpoint:
- `refactor(samples): tighten reference header parity`

### Task 3 — Menu and navigation parity

Goal:
- Make lateral and horizontal menu behavior match the reference implementation path only.

Target paths:
- `src/templates/navigation/MenuLinkTemplate.vue`
- `src/templates/navigation/HorizontalMenuLinkTemplate.vue`
- `src/templates/layouts/MainLayoutTemplate.vue`
- `samples/original-reference/OriginalReferenceApp.vue`
- `tests/unit/templates/HorizontalMenuLinkTemplate.spec.ts`

Changes:
- Freeze public sample navigation to the reference behavior path
- Remove remaining visual leakage and generic branch behavior in the active sample
- Verify mini mode, horizontal mode, sticky bottom item, hover, and active states

Commands:
- `npm run test -- tests/unit/templates/HorizontalMenuLinkTemplate.spec.ts tests/unit/samples/OriginalReferenceApp.spec.ts`
- `npm run build:samples`

Checkpoint:
- Menu behavior works identically in direct sample usage without router-only assumptions

Suggested commit checkpoint:
- `fix(samples): align reference navigation behavior`

### Task 4 — Runtime copy and state parity

Goal:
- Remove noisy data/copy mismatches that make comparison misleading.

Target paths:
- `samples/original-reference/original-reference.sample-data.ts`
- `samples/original-reference/OriginalReferenceApp.vue`
- any helper/composable needed for time-sensitive greeting logic

Changes:
- Align greeting and runtime defaults with the reference
- Review chips, labels, headings, and product copy that are visible in first fold comparison

Commands:
- `npm run type-check`
- `npm run test -- tests/unit/samples/OriginalReferenceApp.spec.ts`

Checkpoint:
- The sample first fold should compare cleanly against the reference without obvious textual mismatch

Suggested commit checkpoint:
- `refactor(samples): sync reference runtime copy and defaults`

### Task 5 — Final parity audit and closeout

Goal:
- Validate the remaining differences and decide whether the sample is ready for closeout.

Target paths:
- `.temp/logs/`
- `planning/active/reference-source-truth-parity-execution-plan-2026-04-13.md`
- `planning/specs/active/reference-source-truth-parity-audit-2026-04-13.md`

Changes:
- Capture fresh desktop/mobile screenshots for sample and reference
- Update plan/spec status with what still differs, if anything
- Prepare closeout handoff when parity is acceptable

Commands:
- `npm run type-check`
- `npm run build:samples`
- browser smoke against `http://127.0.0.1:4173/` and `http://127.0.0.1:9002/pipeline`

Checkpoint:
- Remaining differences, if any, must be explicitly documented and intentional

Suggested commit checkpoint:
- `docs(planning): record final reference parity audit`

## Validation Checklist

- [x] `npm run type-check`
- [x] `npm run test -- tests/unit/samples/OriginalReferenceApp.spec.ts tests/unit/templates/HorizontalMenuLinkTemplate.spec.ts`
- [x] `npm run build:samples`
- [x] Desktop comparison (1440px) — dashboard, drawer, mini mode, horizontal mode, labels-in-mini, section navigation
- [x] Mobile comparison (375px) — responsive stacked layout, no drawer overlay, compact top clients

## Audit Results

### Task Completion Summary

| Task | Status | Commit | Notes |
|------|--------|--------|-------|
| 1 — Global baseline | ✅ | `129e4e3` | Title "Atlas Flow", dynamic greeting, accent fixes |
| 2 — Header/brand | ✅ | `3764beb` | Logo height: 32px (was width: 120px) |
| 3 — Menu/navigation | ✅ | (no code changes needed) | All behaviors verified: mini, horizontal, labels, sticky bottom, active states |
| 4 — Runtime copy/data | ✅ | `129e4e3` | Combined with Task 1: avatar initials, accented text |
| 5 — Final audit | ✅ | this commit | Desktop + mobile parity confirmed |

### Remaining Intentional Differences

- OriginalReferenceApp uses query-param navigation (`?section=X`) instead of Vue Router — intentional for non-router sample
- Reference has additional routes (wiki, reports, profile) not present in sample — intentional scope reduction
- Sample uses `MainLayoutTemplate` (reusable library) vs reference custom layout — architecture difference by design

## Risks

- The reusable template layer may keep reintroducing non-reference styling through shared tokens
- Browser title, global font, and body styles may be controlled outside the sample-local files
- Menu behavior can look right but still diverge functionally if only tested through visual smoke

## Closeout Expectations

- [x] Update plan and spec statuses before closing the workstream
- [x] Keep the public sample as a single runtime at `/`
- [x] Do not reintroduce extra sample families or showcase routes
- [x] Prefer one or two intentional commits per completed slice

## Status: COMPLETED
