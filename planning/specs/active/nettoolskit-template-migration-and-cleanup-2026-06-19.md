# NetToolsKit Template Migration And Cleanup - Spec

Date: 2026-06-19
Status: active
Priority: P1
Sequence: 06
Source Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`

## Design Intent

Migrate templates and CMS authoring surfaces away from direct Quasar controls, page-local Quasar overrides, inline style objects, and residual bridge CSS. Preserve useful repository-specific runtime behavior by mapping it to contracts, adapters, fixtures, or documented exceptions.

## Current Evidence

The largest direct Quasar usage appears in:

- `src/templates/features/cms/authoring/modules/CmsSettingsModuleSurface.vue`
- `src/templates/features/cms/authoring/modules/CmsBlocksModuleSurface.vue`
- `src/templates/features/cms/authoring/modules/CmsPagesModuleSurface.vue`
- `src/templates/features/cms/authoring/modules/CmsReleasesModuleSurface.vue`
- `src/templates/features/cms/authoring/modules/CmsMediaModuleSurface.vue`

## Decisions

1. Migration must proceed by thin vertical slices to keep tests reviewable.
2. Each migrated template surface must replace direct `q-btn`, `q-input`, `q-select`, `q-card`, `q-dialog`, and table surfaces with design-system wrappers where those wrappers exist.
3. Inline style objects must become token variables, component props, or controlled preview-only adapters.
4. CMS color authoring must use token-safe field adapters.
5. Repository-specific CMS/building behavior remains only when mapped to a contract or documented exception.

## Target Paths

- `src/templates/features/cms/authoring/modules/**`
- `src/templates/features/cms/authoring/**`
- `src/templates/styles/reference-app-bridge.scss`
- `src/templates/styles/cms-authoring-reference.css`
- `src/modules/cms/white-label/**`
- `tests/unit/modules/cms/**`
- `tests/e2e/cms-*.spec.ts`

## Design Slice Matrix

| Slice | Target Surface | Validation |
|---|---|---|
| Toolbar actions | CMS module action bars | unit tests and keyboard checks |
| Field groups | settings, blocks, pages forms | form/a11y tests |
| Status and chips | status chips, banners, previews | token audit and snapshot tests |
| Color authoring | theme/color fields | unsafe input rejection tests |
| Bridge cleanup | global template bridge CSS | regression tests and reduced selector count |
| Runtime parity | samples and CMS E2E | Playwright visual and flow tests |

## Acceptance Criteria

1. Direct Quasar controls are removed from migrated feature/template surfaces.
2. Inline visual style objects are replaced or isolated behind approved preview adapters.
3. Bridge CSS selectors and `!important` count trend down with each slice.
4. CMS color authoring validates token-safe input.
5. Visual behavior stays covered by targeted unit and Playwright tests.

## Implementation Evidence

### 2026-06-19 23:27 - CMS Pages Preview Header Action Slice

- Replaced the single `q-btn` header action in `CmsPagesPreviewSurface.vue` with `DsButton`.
- Added focused unit coverage for the pages preview `openInWindow` header action in `CmsAuthoringChromeComponents.spec.ts`.
- Confirmed `CmsPagesPreviewSurface.vue` no longer contains direct `<q-btn>` usage.
- Refreshed the affected Windows visual baseline for the published tablet `pt-BR` pages preview frame.
- Focused validation passed: `npm test -- tests/unit/templates/CmsAuthoringChromeComponents.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 1 file and 28 tests.
- `npm run lint -- --quiet` passed.
- `npm run type-check` passed.
- `npm test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` passed with 2 files and 18 tests.
- `npx playwright test tests/e2e/cms-visual-regression.spec.ts -g "captures pages preview in published tablet pt-BR mode" --workers=1` passed.
- `npm run verify` passed, including 39 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Remaining gaps: broader `q-btn`, `q-input`, and `q-select` migration across CMS module surfaces, bridge selector reduction, and wrappers for select/table/page surfaces.

### 2026-06-20 01:06 - CMS Authoring Ruler DsButton Slice

- Replaced the `CmsAuthoringRulerBar` focus and grid-mode direct `q-btn` controls with `DsButton`.
- Kept the existing `focus` and `toggle-mode` event contract and added compact ruler-specific styling for the rendered design-system button structure.
- Added focused unit coverage for rendered `button.ntk-button` controls, recipe classes, focus emission, and mode-toggle emission in `CmsAuthoringChromeComponents.spec.ts`.
- Refreshed the affected Windows visual baselines for settings light/dark/monochrome shells and the phase 3 pages quick-start command surface.
- Focused validation passed: `npm test -- tests/unit/templates/CmsAuthoringChromeComponents.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 1 file and 28 tests.
- `npm run lint -- --quiet` passed.
- `npm run type-check` passed.
- `npx playwright test tests/e2e/cms-visual-regression.spec.ts -g "captures settings shell in light preset|captures settings shell in dark preset|captures settings shell in monochrome preset|captures phase 3 pages quick-start and command surface" --workers=1 --update-snapshots` passed with 4 tests and regenerated only affected snapshots.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Remaining gaps: broader CMS direct Quasar migration, bridge selector reduction, `NtkDataTable` compatibility decisions, full `NtkSelect` parity decisions, and final PR/CI/review closeout.

### 2026-06-20 01:42 - CMS Media Module DsButton Slice

- Replaced the seven direct `q-btn` controls in `CmsMediaModuleSurface.vue` with rendered `DsButton` controls.
- Preserved create, save, delete, replace-references, and branding-slot event contracts while moving disable bindings from Quasar `disable` to native `disabled`.
- Added media action styles for the rendered `ntk-button` icon/label structure and removed the direct button styles from the migrated primary/danger actions.
- Updated media E2E selectors from `.q-btn` to role/name based button lookup and made `openDrawerModule` tolerate the current listitem-based drawer markup.
- Confirmed `CmsMediaModuleSurface.vue` no longer contains direct `<q-btn>` usage.
- Focused validation passed: `npm test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 2 files and 18 tests.
- `npm run type-check` passed.
- `npm run lint -- --quiet` passed.
- `npm run test:architecture` passed.
- Focused media E2E subset was attempted: `manages media library assets and applies branding bindings` passed; the three block-preview media flows still fail after asset selection because `img.cms-landing-hero-media__image` is not rendered in the Blocks preview, outside the migrated Media button surface.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Remaining gaps: broader CMS direct Quasar migration, bridge selector reduction, full `NtkSelect` parity decisions, and final PR/CI/review closeout.

### 2026-06-20 02:14 - CMS Releases Module DsButton Slice

- Replaced the eleven direct `q-btn` controls in `CmsReleasesModuleSurface.vue` with rendered `DsButton` controls.
- Preserved draft, validate, schedule, publish, run-scheduled, promote, rollback, export, acknowledgement, checklist shortcut, and checklist drill-down event contracts while moving disable bindings from Quasar `disable` to native `disabled`.
- Updated release E2E selectors from `.q-btn` to role/name based button lookup in `cms-settings-flow.spec.ts` and `cms-visual-regression.spec.ts`.
- Added template audit coverage proving `CmsReleasesModuleSurface.vue` imports `DsButton` and no longer contains direct `<q-btn>` usage.
- Refreshed the affected Windows visual baselines for the release review surface, release acknowledgements, review package history, and release checklist drill-down.
- Focused validation passed: `npm test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 2 files and 19 tests.
- `npm run type-check` passed.
- `npm run lint -- --quiet` passed.
- Focused release E2E passed: `npx playwright test tests/e2e/cms-settings-flow.spec.ts -g "executes release orchestration flow|surfaces a release candidate checklist and updates it after validation|records release review acknowledgements" --workers=1` with 3 tests.
- Focused release visual update passed: `npx playwright test tests/e2e/cms-visual-regression.spec.ts -g "captures phase 6 releases review surface|captures phase 7 review acknowledgements surface|captures phase 7 review package history surface|captures phase 7 release checklist drill-down surface" --workers=1 --update-snapshots` with 4 tests.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Remaining gaps: broader CMS direct Quasar migration, bridge selector reduction, `CmsPreviewToolbar` select migration, `NtkInput` compatibility parity, and final PR/CI/review closeout.

### 2026-06-20 02:43 - CMS Preview Toolbar NtkSelect Slice

- Replaced the three direct `q-select` controls in the shared `CmsPreviewToolbar.vue` with `NtkSelect`.
- Preserved preview source, locale, viewport, toolbar `data-*` attributes, emitted update contracts, and popup styling class behavior.
- Added focused component coverage for the wrapper props and template audit coverage preventing direct `<q-select>` regression in the toolbar.
- Refreshed affected Windows visual baselines for Blocks published mobile preview and phase 6 Pages/Blocks review summary surfaces.
- Focused validation passed: `npm test -- tests/unit/templates/CmsAuthoringChromeComponents.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 49 tests.
- `npm run lint -- --quiet` passed.
- `npm run type-check` passed.
- `git diff --check` passed.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Focused `cms-settings-flow` draft/published viewport coverage still fails on the parent branch with this slice stashed, before any toolbar migration code runs; this remains an inherited Blocks runtime preview text issue for a separate triage slice.
- Remaining gaps: broader CMS direct Quasar migration, bridge selector reduction, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

### 2026-06-20 02:57 - CMS Media Module Ntk Form Field Slice

- Replaced the remaining eight direct `q-input` fields and three direct `q-select` fields in `CmsMediaModuleSurface.vue` with `NtkInput` and `NtkSelect`.
- Preserved labels, hints, numeric bounds, textarea autogrow, replace-target clearing, update emissions, and media popup styling.
- Forwarded `hint` and `aria-describedby` through `NtkSelect` to preserve the migrated select helper text contract.
- Added focused form component coverage and template audit coverage preventing direct `<q-input>`/`<q-select>` regression in the Media module.
- Focused validation passed: `npm test -- tests/unit/components/form/NtkFormComponents.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 50 tests.
- `npm run type-check` passed.
- `npm run lint -- --quiet` passed.
- `git diff --check` passed.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Focused media replacement E2E still fails on the parent branch with this slice stashed at the known Blocks runtime preview image assertion; the create/apply media binding flow passes with this slice.
- Remaining gaps: broader CMS direct Quasar migration, bridge selector reduction, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

### 2026-06-20 03:07 - CMS Field Bridge Token Alias Slice

- Removed duplicated broad Quasar field overrides from the CMS authoring stylesheet and routed field styling through scoped token aliases consumed by the shared template bridge.
- Added audit coverage so the token aliases remain present and the broad `.cms-shell-page :deep(.q-field...)` selectors stay removed.
- Refreshed the dark settings shell visual baseline because fields now use the tokenized CMS dark surface.
- CMS visual regression passed: `npx playwright test tests/e2e/cms-visual-regression.spec.ts --workers=1` with 20 tests.
- `npm run verify` passed, including 25 browser-gate Playwright tests and package build.
- Remaining gaps: broader CMS direct Quasar migration, remaining bridge selector reduction, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

### 2026-06-20 03:19 - CMS Shell Native Card Slice

- Replaced the shared `q-card` roots in `CmsShellCard.vue` and `CmsAuthoringWorkbench.vue` with native `section` markup.
- Preserved shell classes, slots, separator behavior, and workbench delegation.
- Added focused unit and audit coverage proving the shell roots stay native and do not regress to `<q-card>`.
- Refreshed the dark settings shell visual baseline because the workbench no longer inherits Quasar's card default surface.
- Focused validation passed: `npm test -- tests/unit/templates/CmsAuthoringChromeComponents.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 51 tests.
- CMS visual regression passed: `npx playwright test tests/e2e/cms-visual-regression.spec.ts --workers=1` with 20 tests.
- `npm run verify` passed, including 25 browser-gate Playwright tests and package build.
- Remaining gaps: broader CMS direct Quasar migration, remaining bridge selector reduction, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

### 2026-06-20 03:34 - CMS Releases Module Ntk Form Field Slice

- Replaced the remaining direct `q-input` and `q-select` controls in `CmsReleasesModuleSurface.vue` with `NtkInput` and `NtkSelect`.
- Preserved release orchestration and acknowledgement field contracts, including popup styling, textarea autogrow, `aria-label`, and update emissions.
- Added `datetime-local` support to `NtkInput` for scheduled release publishing and unit coverage for that field type.
- Added template audit coverage proving `CmsReleasesModuleSurface.vue` imports `NtkInput`/`NtkSelect` and no longer contains direct `<q-input>`/`<q-select>`/`<q-btn>` usage.
- Focused validation passed: `npm test -- tests/unit/components/form/NtkFormComponents.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 52 tests.
- Focused release E2E passed for release orchestration, checklist validation, and review acknowledgements.
- Focused release visual regression passed for release review, acknowledgements, package history, and checklist drill-down surfaces after refreshing the affected Windows baselines.
- `npm run verify` passed, including 25 browser-gate Playwright tests and package build.
- PR #25 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/25`.
- PR #25 remote checks passed at 2026-06-20 03:36: Vercel passed, Vercel Preview Comments passed, and GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: broader CMS direct Quasar migration, remaining bridge selector reduction, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

### 2026-06-20 03:55 - CMS Shell Native Separator Slice

- Replaced the shared `q-separator` in `CmsShellCard.vue` with a native `hr` separator styled by CMS tokens.
- Preserved `showSeparator` behavior while removing direct Quasar separator usage from the shared shell card.
- Added component and template audit coverage proving the separator stays native and direct `<q-separator>` does not return to `CmsShellCard.vue`.
- Focused validation passed: `npm test -- tests/unit/templates/CmsAuthoringChromeComponents.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 51 tests.
- CMS visual regression passed with 20 tests, and `npm run verify` passed after re-running affected visual checks.
- PR #26 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/26`.
- PR #26 remote checks passed at 2026-06-20 03:57: Vercel passed, Vercel Preview Comments passed, and GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: broader CMS direct Quasar migration, remaining bridge selector reduction, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

### 2026-06-20 09:26 - CMS Authoring Native Separator Slice

- Replaced the remaining direct `q-separator` controls in CMS authoring Vue files with native `hr` separators styled by shared CMS tokens.
- Added audit coverage proving CMS authoring Vue files no longer contain direct `<q-separator>` usage.
- Refreshed the reusable block impact drawer Windows visual baseline because the drawer separator moved to native markup.
- Focused validation passed: `npm test -- tests/unit/templates/CmsAuthoringChromeComponents.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 52 tests.
- Direct tag audit passed: `rg -n "<q-separator\\b" src/templates/features/cms/authoring` returned no matches.
- CMS visual regression passed with 20 tests, and `npm run verify` passed with 25 browser-gate Playwright tests and package build.
- PR #27 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/27`.
- PR #27 remote checks passed at 2026-06-20 09:28: Vercel passed, Vercel Preview Comments passed, and GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: broader CMS direct Quasar migration, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

### 2026-06-20 09:52 - CMS Usage Drawer Native Shell Slice

- Replaced the CMS usage drawer `q-card` shell with native `section` markup while preserving `q-dialog` and `q-chip` as documented remaining Quasar internals.
- Replaced the direct close `q-btn` with `DsButton`, added translated close-label wiring, and updated E2E coverage to close the drawer by role/name.
- Added native dialog child pointer-event handling and close-button focus-visible styling.
- Added unit and template audit coverage proving the drawer shell and close action stay on native/design-system markup.
- Focused validation passed: `npm test -- tests/unit/templates/CmsAuthoringChromeComponents.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts tests/unit/design-system/components/ds-button.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 4 files and 57 tests.
- Focused usage drawer E2E and starter-kit impact drawer E2E passed.
- CMS visual regression passed with 20 tests, and `npm run verify` passed with 25 browser-gate Playwright tests and package build.
- PR #28 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/28`.
- PR #28 remote checks passed at 2026-06-20 09:54: Vercel passed, Vercel Preview Comments passed, and GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: broader CMS direct Quasar migration, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

### 2026-06-20 11:15 - CMS Shared Native Status Chip Slice

- Added native `CmsStatusChip` markup for passive CMS status badges instead of reusing the Quasar-backed, clickable-by-default `NtkChip`.
- Migrated shared CMS authoring chrome, diagnostics, locale coverage, preview toolbar, usage drawer and media picker badges away from direct `<q-chip>` usage.
- Added unit and template audit coverage proving the migrated shared components use `<CmsStatusChip>` and reject direct `<q-chip>` regressions.
- Confirmed no direct `<q-chip>` usage remains in top-level `src/templates/features/cms/authoring/*.vue`; remaining direct chip tags are module-local work for later slices.
- Stabilized the design-system verify gate by reusing a single Vitest fork worker for `test:design-system`, avoiding repeated Windows worker startup timeouts.
- CMS visual regression passed with 20 tests after refreshing three affected Releases Windows baselines, and `npm run verify` passed with 25 browser-gate Playwright tests and package build.
- PR #29 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/29`.
- PR #29 remote checks passed at 2026-06-20 11:23: Vercel passed, Vercel Preview Comments passed, and GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: module-local CMS `q-chip` migration, broader CMS direct Quasar migration, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

### 2026-06-20 11:49 - CMS Media Module Native Status Chip Slice

- Replaced the eleven direct `q-chip` status badges in `CmsMediaModuleSurface.vue` with the native `CmsStatusChip`.
- Preserved the media module status badge contracts for asset counts, diagnostics, binding metadata, asset kind, references, usage summary, focal point, replacement target, tags, and diagnostic codes.
- Added template audit coverage proving the Media module imports `CmsStatusChip` and rejects direct `<q-chip>` regressions alongside the existing `NtkInput`/`NtkSelect` field guards.
- Subagent audit confirmed every former Media module chip was passive status markup without `icon`, `clickable`, `removable`, or click behavior.
- Focused validation passed: `npm test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 20 tests.
- `npm run type-check`, `npm run lint -- --quiet`, `npm run lint:style`, CSS governance, and `git diff --check` passed.
- `npm run verify` passed, including 25 browser-gate Playwright tests and package build.
- Focused media E2E create/apply binding flow passed; the three block-preview media flows still fail on the parent branch with this slice stashed at the inherited Blocks runtime preview image assertion.
- PR #30 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/30`.
- PR #30 remote checks passed at 2026-06-20 11:52: Vercel passed, Vercel Preview Comments passed, and GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: module-local CMS `q-chip` migration in Blocks, Pages, Pages Preview, Releases, and Settings, broader CMS direct Quasar migration, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

### 2026-06-20 12:10 - CMS Pages Preview Native Status Chip Slice

- Replaced the eight direct `q-chip` status badges in `CmsPagesPreviewSurface.vue` with the native `CmsStatusChip`.
- Preserved draft/published diff, page metadata, page status, page diff, and section badge behavior and styling.
- Added unit stub coverage and template audit coverage proving the Pages preview module imports `CmsStatusChip` and rejects direct `<q-chip>` regressions.
- Subagent audit confirmed every former Pages preview chip was passive status markup without `icon`, `clickable`, `removable`, or click behavior.
- Focused validation passed: `npm test -- tests/unit/templates/CmsAuthoringChromeComponents.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 54 tests.
- `npm run type-check`, `npm run lint -- --quiet`, `npm run lint:style`, CSS governance, and `git diff --check` passed.
- Focused CMS visuals passed without snapshot updates for the published tablet Pages preview and phase 6 pages review summary surfaces.
- `npm run verify` passed, including 25 browser-gate Playwright tests and package build.
- PR #31 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/31`.
- PR #31 remote checks passed at 2026-06-20 12:13: Vercel passed, Vercel Preview Comments passed, and GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: module-local CMS `q-chip` migration in Blocks, Pages, Releases, and Settings, broader CMS direct Quasar migration, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

### 2026-06-20 12:32 - CMS Blocks Module Native Status Chip Slice

- Replaced the eleven direct `q-chip` status badges in `CmsBlocksModuleSurface.vue` with the native `CmsStatusChip`.
- Preserved ruler counts, reusable library counts, usage badges, block status/type badges, linked/detached labels, and preview diff badges.
- Updated Blocks-specific E2E selectors from `.q-chip` to `.cms-status-chip` while leaving Pages/Releases selectors unchanged.
- Added template audit coverage proving the Blocks module imports `CmsStatusChip` and rejects direct `<q-chip>` regressions.
- Subagent audit confirmed every former Blocks module chip was passive status markup without `icon`, `clickable`, `removable`, or click behavior.
- Focused validation passed: `npm test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 22 tests.
- `npm run type-check`, `npm run lint -- --quiet`, `npm run lint:style`, CSS governance, and `git diff --check` passed.
- Focused Blocks visuals passed without snapshot updates for Blocks preview published mobile, phase 5 reusable block impact drawer, phase 5 archived authored preset library, and phase 6 blocks review summary.
- Focused Blocks E2E passed for linked reusable block readonly authoring and variant branching after rerunning alone; the first parallel run failed before tests started because Vite hit a `.build/samples/favicon.png` cleanup `EPERM`.
- `npm run verify` passed, including 25 browser-gate Playwright tests and package build.
- Remaining gaps: module-local CMS `q-chip` migration in Pages, Releases, and Settings, broader CMS direct Quasar migration, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

## Risks

- CMS module files are large and high-change; migrations must be sliced.
- Visual snapshots can shift after wrapper migration.
- Some preview surfaces intentionally show user-selected colors; those need controlled preview adapters instead of blanket bans.

## Planning Readiness

Ready for planning after wrappers and enforcement policy exist.

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Support: `test-engineer`