# CMS Engine Reference Alignment Plan

Date: 2026-03-26
Repository: `nettoolskit-ui-vue`
Status: Completed / archived
Related history:
- `planning/plans/completed/2026-03/cms-engine-enterprise-plan-2026-03-13.md`

## Scope Summary

Reopen the CMS visual/template workstream to close the gap between the completed template roadmap and the current runtime implementation.

Primary objective:
- make `?cms=1` use the same template-first architecture already established under `src/templates/**`
- align the CMS shell and editor workspaces with the validated reference direction from `.temp/reference`
- continue shrinking `landing-page/CmsApp.vue` by moving repeated workbench chrome into reusable components, composables, and shared CMS/template styles

Out of scope:
- changing CMS domain semantics, release orchestration rules, or persistence contracts
- removing existing DOM hooks used by E2E without a compatibility wrapper

## Current Reality Baseline

- Historical plan status in `planning/plans/completed/2026-03/cms-engine-enterprise-plan-2026-03-13.md` says the template/reference alignment track was completed.
- This corrective workstream started because the runtime did not fully match that claim:
  - `landing-page/CmsApp.vue` was still using `NtkAppShell`
  - `Settings`, `Pages`, and `Blocks` were still rendering large inline designer shells instead of consuming `MainLayoutTemplate` and `EditorWorkbenchTemplate` as the primary host surfaces
  - significant workbench chrome was still inline inside `CmsApp.vue`
- Template infrastructure already exists and is reusable:
  - `src/templates/layouts/MainLayoutTemplate.vue`
  - `src/templates/pages/editor/EditorWorkbenchTemplate.vue`
  - `src/templates/navigation/**`
  - `src/templates/styles/reference-app-bridge.scss`
  - `src/templates/styles/cms-authoring-reference.css`

## Progress Update

- 2026-03-26 phase 1:
  - `?cms=1` now renders through `MainLayoutTemplate`
  - CMS header search/actions were moved into template slots
  - sidebar state is controlled through template navigation contracts
- 2026-03-26 phase 2:
  - `Settings`, `Pages`, and `Blocks` now mount through reusable `CmsAuthoringWorkbench`
  - `CmsAuthoringWorkbench` is backed by `EditorWorkbenchTemplate`
  - the three editor modules keep their legacy inner authoring content while sharing one template-driven host
  - `landing-page/CmsApp.vue` was stabilized again after the earlier broken workbench migration attempt
- 2026-03-26 phase 3:
  - extract shared authoring chrome into dedicated reusable components:
    - `landing-page/cms/CmsAuthoringToolbar.vue`
    - `landing-page/cms/CmsAuthoringRulerBar.vue`
  - `Settings`, `Pages`, and `Blocks` now reuse the same toolbar and ruler contracts instead of duplicating those shells inline inside `CmsApp.vue`
- 2026-03-27 phase 4:
  - add `landing-page/cms/CmsShellCard.vue` as a reusable shell for CMS cards with shared header, actions, separator, and body regions
  - migrate the `Settings`, `Pages`, and `Blocks` preview surfaces onto `CmsShellCard`
  - keep the preview runtime behavior intact while removing repeated `q-card` scaffolding from `CmsApp.vue`
- 2026-03-27 phase 5:
  - add reusable authoring presentational contracts:
    - `landing-page/cms/CmsAuthoringPanelHeader.vue`
    - `landing-page/cms/CmsAuthoringMetricsList.vue`
    - `landing-page/cms/CmsAuthoringStatusBar.vue`
    - `landing-page/cms/CmsDiagnosticsListSection.vue`
  - migrate repeated sidebar, rail, status, and diagnostics chrome in `Settings`, `Pages`, `Blocks`, and `Media` onto those shared components
  - keep CMS-specific behavior in `CmsApp.vue` while moving the repeated markup into reusable CMS/template-aligned view components
- 2026-03-27 phase 6:
  - add reusable section/review summary contracts:
    - `landing-page/cms/CmsSectionHeaderSummary.vue`
    - `landing-page/cms/CmsStatusMetricCardGrid.vue`
    - `landing-page/cms/CmsPanelListSection.vue`
  - migrate remaining repeated section headers in `Pages`, preview diff review panels, and `Releases` onto `CmsSectionHeaderSummary`
  - migrate release review/governance card grids onto `CmsStatusMetricCardGrid`
  - migrate governance list panels onto `CmsPanelListSection`
  - keep release domain logic in `CmsApp.vue` while moving section chrome and summary scaffolding into reusable CMS components
- 2026-03-27 phase 7:
  - create a local safety backup of the current public landing experience before further architecture work:
    - `.temp/backups/landing-public-example-2026-03-27/**`
  - move reusable CMS authoring surfaces out of `landing-page/cms/**` into `src/**`:
    - `src/templates/features/cms/authoring/**`
    - `src/modules/cms/white-label/authoring/**`
    - `src/modules/cms/presets/landing/**`
  - update CMS tests and Vite chunking so the migrated `src/**` surfaces become the authoritative import path
  - move the product preset from `landing-page/config/nettoolskit.preset.ts` to:
    - `src/config/presets/nettoolskit.preset.ts`
  - move generic template runtime infrastructure from `landing-page/**` to:
    - `src/templates/runtime/**`
  - extract the `Media` authoring screen into:
    - `src/templates/features/cms/authoring/modules/CmsMediaModuleSurface.vue`
  - reduce `landing-page/CmsApp.vue` again by replacing the inline media editor/preview surface with the reusable module component while keeping the runtime behavior intact
- 2026-03-27 phase 8:
  - extract the `Releases` authoring screen into:
    - `src/templates/features/cms/authoring/modules/CmsReleasesModuleSurface.vue`
  - move release orchestration, review package history, governance summary, acknowledgements, checklist, timeline, and calendar markup behind the reusable module surface
  - keep release domain state and command handlers inside `landing-page/CmsApp.vue` while the new surface owns the presentational shell and emitted interactions
  - export the new reusable module through:
    - `src/templates/features/cms/authoring/index.ts`
  - reduce `landing-page/CmsApp.vue` from `14914` lines to `14445` lines after replacing the inline releases workspace with the reusable module component
- 2026-03-27 phase 9:
  - extract the `Pages` preview runtime into:
    - `src/templates/features/cms/authoring/modules/CmsPagesPreviewSurface.vue`
  - move the pages preview shell, draft-vs-published review summary, locale coverage matrix integration, and rendered page preview cards behind the reusable preview surface
  - keep pages preview selectors, render transforms, diagnostics producers, and diff helpers inside `landing-page/CmsApp.vue` while the new surface owns the reusable presentational shell
  - export the new reusable preview surface through:
    - `src/templates/features/cms/authoring/index.ts`
  - reduce `landing-page/CmsApp.vue` from `14445` lines to `14332` lines after replacing the inline pages preview surface with the reusable component
- 2026-03-27 phase 10:
  - extract the full `Pages` authoring workspace into:
    - `src/templates/features/cms/authoring/modules/CmsPagesModuleSurface.vue`
  - move the inline pages editor shell, schema-migration review, section authoring canvas, reusable section rail, starter kits, quick starts, and preview bridge behind the reusable module surface
  - keep CMS page domain state, selectors, transforms, diagnostics producers, and command handlers inside `landing-page/CmsApp.vue` while the new module surface owns the presentational workbench contract and emitted updates
  - export the new reusable module through:
    - `src/templates/features/cms/authoring/index.ts`
  - reduce `landing-page/CmsApp.vue` from `15545` lines to `14684` lines after replacing the inline pages workspace with the reusable module component

## Ordered Tasks

1. Reconcile plan status with runtime truth
   - Target paths:
     - `planning/plans/completed/2026-03/cms-engine-reference-alignment-plan-2026-03-26.md`
     - `planning/plans/completed/2026-03/cms-engine-enterprise-plan-2026-03-13.md`
   - Commands:
     - `git status --short`
     - `rg -n "NtkAppShell|MainLayoutTemplate|EditorWorkbenchTemplate" landing-page/CmsApp.vue src/templates -S`
   - Checkpoints:
     - completed plan is archived in `planning/plans/completed/YYYY-MM`
     - plan explicitly records the template/runtime gap that was closed
   - Commit checkpoint suggestion:
     - `docs(plan): reopen cms template-reference alignment execution`

2. Migrate CMS shell to template-first layout
   - Status: completed on 2026-03-26
   - Target paths:
     - `landing-page/CmsApp.vue`
     - `src/templates/layouts/MainLayoutTemplate.vue`
     - `src/templates/navigation/MenuLinkTemplate.vue`
     - `src/templates/navigation/UserMenuTemplate.vue`
     - `src/templates/navigation/menu-template.types.ts`
   - Commands:
     - `npm run lint`
     - `npm run type-check`
   - Checkpoints:
     - `?cms=1` no longer renders through `NtkAppShell`
     - header stays fixed
     - sidebar uses template menu contracts and reference visual mode by default
     - CMS topbar actions/search remain available through template slots
   - Commit checkpoint suggestion:
     - `feat(cms): move runtime shell to template-first layout`

3. Move editor workspaces onto `EditorWorkbenchTemplate`
   - Status: completed on 2026-03-26 through `landing-page/cms/CmsAuthoringWorkbench.vue`
   - Target paths:
     - `landing-page/CmsApp.vue`
     - `src/templates/pages/editor/EditorWorkbenchTemplate.vue`
     - `landing-page/cms/**`
   - Commands:
     - `npm run lint`
     - `npm run type-check`
     - `npm run build:landing`
   - Checkpoints:
     - `Settings`, `Pages`, and `Blocks` use `EditorWorkbenchTemplate` as the outer editing host
     - left widget rail, ruler, canvas, right rail, and status bar flow through template slots/contracts
     - preview behavior remains compatible with current CMS flows
   - Commit checkpoint suggestion:
     - `feat(cms): adopt editor workbench template across authoring modules`

4. Extract remaining reusable CMS chrome from `CmsApp.vue`
   - Status: completed
   - Target paths:
     - `landing-page/CmsApp.vue`
     - `src/templates/features/cms/authoring/*.vue`
     - `src/templates/features/cms/authoring/modules/*.vue`
     - `src/modules/cms/white-label/authoring/*.ts`
     - `src/modules/cms/presets/landing/*.ts`
     - `src/templates/styles/cms-authoring-reference.css`
   - Commands:
     - `npm run lint`
     - `npm run type-check`
     - `npm run build:landing`
   - Checkpoints:
     - repeated toolbar/ruler/sidebar/status/diagnostics/section-summary blocks extracted
     - shared styles used instead of per-screen duplication
     - `CmsApp.vue` becomes orchestration-heavy instead of markup-heavy
   - Commit checkpoint suggestion:
     - `refactor(cms): extract reusable authoring chrome components`

5. Move reusable landing/template runtime infrastructure into `src`
   - Status: completed
   - Target paths:
     - `landing-page/main.ts`
     - `src/templates/runtime/**`
     - `src/config/presets/**`
     - `tests/unit/templates/TemplateRuntimeRouter.spec.ts`
   - Commands:
     - `npm run lint`
     - `npm run type-check`
     - `npm run build:landing`
     - `npm run test -- tests/unit/templates/TemplateRuntimeRouter.spec.ts`
   - Checkpoints:
     - landing-page keeps only app/demo boot concerns
     - template runtime router/host live under `src/templates/**`
     - product presets no longer live under `landing-page/config/**`
   - Commit checkpoint suggestion:
     - `refactor(templates): move reusable runtime and preset infrastructure into src`

6. Reference-parity validation and release closeout
   - Target paths:
     - `.temp/reference/**`
     - `.temp/comparison/**`
     - `planning/plans/completed/2026-03/cms-engine-reference-alignment-plan-2026-03-26.md`
     - `README.md`
     - `src/templates/**/README.md`
   - Commands:
     - `npm run lint`
     - `npm run type-check`
     - `npm run build:landing`
     - `npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts`
     - `npm run test -- tests/unit/components/AllComponentsSmoke.spec.ts`
   - Checkpoints:
     - runtime screenshots produced for CMS/reference comparison
     - touched README files still comply with repository frontend documentation standard
     - final commit message prepared for the finished phase
   - Commit checkpoint suggestion:
     - `refactor(cms): finish reference parity and shared template adoption`

## Validation Checklist

- `npm run lint`
- `npm run type-check`
- `npm run build:landing`
- `npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts`
- `npm run test -- tests/unit/components/AllComponentsSmoke.spec.ts`

## Recommended Specialist

- Implementation: `dev-frontend-vue-quasar-engineer`
- Planning maintenance: `plan-active-work-planner`
- Test gate: required
- Review gate: required before closing this workstream
- Release closeout: required with detailed English commit messages

## Closeout Expectations

- This plan is archived in `planning/plans/completed/YYYY-MM/` after the CMS runtime alignment workstream was closed.
- If README files are touched, they must continue following `docs/standards/readme-frontend-super-agent-standard.md`.
- Every stable phase must end with:
  - validation results
  - an English commit message
  - a real git commit
- After full completion:
  - keep this archived plan in `planning/plans/completed/YYYY-MM/`
  - update the historical enterprise plan only if a corrective note is needed