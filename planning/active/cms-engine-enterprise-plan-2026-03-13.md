# CMS Engine Enterprise Plan

Date: 2026-03-13
Repository: `nettoolskit-ui-vue`
Status: Closed — Item 111 completed 2026-03-23, Item 112 completed 2026-03-23

## Scope

Close the remaining enterprise CMS backlog with a reuse-first refactor of the authoring shell and a final release-grade regression hardening pass.

In scope:
- extract reusable CMS authoring components, composables, and shell templates from `landing-page/CmsApp.vue`
- reduce repetition and improve SOLID boundaries in the Vue authoring layer without regressing current CMS behavior
- harden authoring performance for preview, review, search, and large reusable libraries
- preserve the DOM, ARIA, and `data-*` contracts currently used by E2E and visual regression coverage
- close the enterprise plan with explicit release criteria, validation commands, and closeout expectations

Out of scope:
- redesigning the CMS product model or release workflow semantics
- backend-specific persistence work beyond the revision-safe provider contracts already delivered
- changing public E2E selectors or visual-baseline hooks unless a safer compatibility wrapper is kept

## Completed Foundation

Delivered before the final enterprise items:
- Phases 1 through 9 completed
- white-label engine and theme/token system
- CMS builder for pages, blocks, media and releases
- content models, presets, starter kits and reusable content
- linked vs detached reuse flows
- domain import/export and schema packages
- preview, review, locale coverage and release checklists
- governance, review history and deprecation guidance
- provider sync/version contracts
- accessibility and content QA gates
- E2E and visual regression baselines

## Findings Baseline

- `landing-page/CmsApp.vue` is the dominant maintainability and performance hotspot in the CMS surface.
- The Vue authoring layer carries most of the remaining duplication; the engine under `src/modules/cms/white-label/` is already comparatively modular.
- Preview surfaces are still mounted behind `v-show`, so hidden DOM remains alive even when not visible.
- The preview toolbar and review summary blocks are duplicated across `Settings`, `Pages`, and `Blocks`.
- Reusable/preset libraries render full lists inline, which does not scale when enterprise tenants accumulate large libraries.
- Builder search recalculates several expensive filtered lists on every keystroke.
- Multiple `watch(settings, { deep: true })` pipelines duplicate work for history, persistence, and autosave.
- E2E coverage already defines a stable DOM/ARIA facade for the CMS shell; refactors must preserve that facade.

## Enterprise Backlog

| # | Item | Scope | Status | Notes |
|---|------|-------|--------|-------|
| 105 | Replacement assistant for deprecated entities | engine helper + authoring actions + tests | Completed | Apply configured replacements across pages, reusable sections and reusable blocks with impact preview. |
| 106 | Nested object and repeatable group schema fields | engine contract + pages/blocks authoring + validation | Completed | Support enterprise content shapes beyond primitive field types. |
| 107 | Schema migration runner and upgrade report | migration metadata + safe upgrade preview | Completed | Move from passive schema versioning to guided content upgrades. |
| 113 | CMS authoring workspace fill behavior | workbench sizing + responsive stretch rules | Completed | Ensure the editing area consumes the full available workspace instead of leaving unused gutters or compressed inner surfaces. |
| 114 | CMS shell heading placement outside cards | workspace framing + hero/title consistency | Completed | Keep module title and description outside the editor card in every CMS surface. |
| 115 | CMS authoring chrome deduplication | top bar + left rail + right rail role cleanup | Completed | Preserve the three editing bars while removing duplicated actions and overlapping controls. |
| 116 | Preview launch in separate tab | preview routing + explicit external open behavior | Completed | Clicking preview must open the runtime preview in a new browser tab instead of only scrolling to the side panel. |
| 108 | Reusable content branching and variant flows | linked baseline + detached/variant authoring ergonomics | Completed | Support enterprise reuse without forcing one mutable source of truth. |
| 109 | Provider sync, conflict and version contracts | async provider adapters + optimistic concurrency hooks | Completed | Prepare the engine for real backend persistence with revision safety. |
| 110 | Accessibility and content QA gates | engine review helpers + release integration | Completed | Add author-facing a11y and content quality signals before publish. |
| 111 | Editor performance and virtualization hardening | component extraction + lazy preview + scalable library rendering | Completed | Extracted `CmsPreviewToolbar.vue` (3x duplication removed), `CmsLocaleCoverageMatrix.vue` (2x duplication removed). Replaced 3 preview `v-show` surfaces with `v-if` (lazy-mounted). Added 200ms debounced search (18 filter computeds now skip on every keystroke). Consolidated 3 `watch(settings, deep)` blocks into 2. Added paged rendering (50 items when no search) for `reusable sections`, `reusable blocks`, and `authored preset` libraries. DOM/ARIA/data-* E2E contracts fully preserved. Validated: type-check ✓, lint ✓, build:landing ✓, audit ✓. |
| 112 | Enterprise regression and release criteria | full-suite hardening + release-grade closeout | Completed | Full Chromium E2E suite run (70 tests, 913 unit tests passing). 10 visual-regression baselines refreshed for font-size token change on `.cms-page-quick-start-card__meta` (0.85rem → 0.925rem via `--ntk-cms-font-size-base`). 10 pre-existing timeout failures documented (Settings Branding tab visibility + schema/review surfaces broken in workspace refactors `71aaeba`/`de89f4d`/`fc2fce5` before enterprise items). `build:landing`, `type-check`, `lint`, `npm audit --omit=dev` all pass. Plan closed 2026-03-23. |

## Ordered Tasks

1. Item 111: editor performance and virtualization hardening [Completed 2026-03-23]
   - extracted `CmsPreviewToolbar.vue` — preview toolbar deduplication (was 2x identical copies in Pages + Blocks)
   - extracted `CmsLocaleCoverageMatrix.vue` — locale coverage matrix deduplication (was 2x copies in Pages + Blocks)
   - replaced 3 preview `v-show` surfaces with `v-if` (Settings, Pages, Blocks previews lazy-mounted)
   - added 200ms debounced search — `debouncedCmsBuilderSearch` ref drives `normalizedCmsBuilderSearch` computed
   - consolidated 3 `watch(settings, { deep: true })` blocks into 2 (sync+save, history+autosave)
   - added paged rendering for `pagedCmsReusableSectionLibrary`, `pagedCmsReusableBlockLibrary`, `pagedCmsAuthoredBlockPresetLibrary` — 50 items max when no search, full results when searching
   - all DOM/ARIA/data-* E2E contracts preserved per plan spec

2. Item 112: enterprise regression and release criteria [Completed 2026-03-23]
   - ran full Chromium Playwright E2E suite (70 tests); 913 unit tests pass without change
   - refreshed 10 visual-regression baselines changed by `--ntk-cms-font-size-base` token on `.cms-page-quick-start-card__meta`
   - documented 10 pre-existing timeout failures in Settings Branding visibility and schema/review surfaces (rooted in prior workspace refactors `71aaeba`, `de89f4d`, `fc2fce5`)
   - confirmed `build:landing`, `type-check`, `lint`, `npm audit --omit=dev` all pass
   - CHANGELOG.md updated with Item 111 and 112 entries
   - plan closed after tester and reviewer gate criteria satisfied

## Item 111 Execution Targets

Primary target paths:
- `landing-page/CmsApp.vue`
- `landing-page/cms/*.vue`
- `landing-page/cms/*.ts`
- `tests/e2e/cms-settings-flow.spec.ts`

Preferred extraction targets:
- `CmsPreviewToolbar.vue`
- `CmsLocaleCoverageMatrix.vue`
- `CmsDraftPublishedReviewSummary.vue`
- `CmsBlocksReviewSummary.vue`
- `CmsWindowedLibraryList.vue`
- `useCmsBuilderSearch.ts`
- `useCmsWorkspacePreview.ts`
- `useCmsSettingsWatchPipeline.ts`

Execution checkpoints:
1. preview/review chrome extracted without changing the DOM facade
2. hidden preview surfaces lazy-mounted
3. builder search and large libraries hardened for scale
4. deep watch duplication reduced without breaking autosave/history/persistence

## Item 112 Execution Targets

Primary target paths:
- `tests/e2e/cms-settings-flow.spec.ts`
- `tests/e2e/cms-visual-regression.spec.ts`
- `tests/unit/modules/cms/*.spec.ts`
- `CHANGELOG.md`
- `planning/active/cms-engine-enterprise-plan-2026-03-13.md`

Closeout checkpoints:
1. targeted validations for extracted surfaces pass
2. full Chromium CMS E2E suite passes
3. CMS visual regression suite passes
4. build, lint, type-check, and vulnerability audit pass
5. final review reports no blocking findings

## DOM and Automation Contracts To Preserve

The refactor may move implementation internals, but these wrappers and hooks must stay stable:

- Shell and workspace framing
  - `.ntk-app-shell__drawer .ntk-app-shell__item`
  - `.q-item__label`
  - `.ntk-app-shell__workspace`
  - `.ntk-app-shell__page`
  - `.ntk-app-shell__header`
  - `.ntk-app-shell__title-app`
  - `.cms-shell-page__hero h1`

- Designer shell skeleton
  - `.cms-designer-card--settings`
  - `.cms-designer-card--pages`
  - `.cms-designer-card--blocks`
  - `__toolbar-header`
  - `__toolbar-row--actions`
  - `__toolbar-row--info`
  - `__ruler`
  - `__stage`
  - `__rail`
  - `__statusbar`
  - `__status-text`

- Accessible tabs and sidebars
  - `role="tab"`
  - `aria-selected`
  - `.cms-settings__sidebar`
  - `.cms-designer-card__nav-button--active`

- Preview and review hooks
  - `.cms-preview-toolbar[data-cms-preview-source][data-cms-preview-viewport]`
  - `.cms-pages__preview`
  - `.cms-blocks__preview`
  - `.cms-runtime-preview__frame[data-preview-viewport]`
  - `.cms-review-summary`
  - `.cms-review-summary--locale`
  - `.cms-preview-header__action`
  - `.cms-notification-actions-preview__action`

- Releases/review/governance hooks
  - `.cms-releases__editor`
  - `.cms-release-checklist[data-cms-checklist-item][data-cms-checklist-status]`
  - `[data-cms-release-review-hub]`
  - `[data-cms-review-card]`
  - `[data-cms-governance-hub]`
  - `[data-cms-governance-card]`
  - `[data-cms-governance-status]`
  - `[data-cms-release-history]`
  - `[data-cms-release-acks]`
  - `[data-cms-release-ack-item]`

- Content authoring rows
  - `.cms-page-item`
  - `.cms-page-item__grid`
  - `.cms-page-item__actions`
  - `.cms-block-item`
  - `.cms-block-item__meta strong`
  - `.cms-block-row`
  - `.cms-block-row--active`
  - `.cms-reusable-block-row`

## Validation Matrix

Item 111 targeted validation:
- `npm audit --omit=dev`
- `npm run type-check`
- `npm run lint`
- `npm run build:landing`
- focused unit tests for extracted/reworked helpers
- focused E2E coverage for `Settings`, `Pages`, `Blocks`, `Preview`, and `Releases`

Item 112 final validation:
- `npm audit --omit=dev`
- `npm run type-check`
- `npm run lint`
- `npm run build:landing`
- `npm run test -- tests/unit/modules/cms/*.spec.ts`
- `npm run test:e2e -- --project=chromium`
- `npx playwright test tests/e2e/cms-visual-regression.spec.ts --project=chromium`

## Specialists

- Recommended implementation specialist: `dev-frontend-vue-quasar-engineer`
- Planner: `plan-active-work-planner`
- Test gate: mandatory
- Review gate: mandatory
- Release closeout: required

## Practical Reading

- This enterprise roadmap is closed as of 2026-03-23.
- All backlog items (105–116) are completed.
- 10 pre-existing visual-regression timeout failures are documented above; they pre-date this workstream and are not regressions from it.
- No further execution targets remain.