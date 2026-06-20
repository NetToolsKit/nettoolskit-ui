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

## Risks

- CMS module files are large and high-change; migrations must be sliced.
- Visual snapshots can shift after wrapper migration.
- Some preview surfaces intentionally show user-selected colors; those need controlled preview adapters instead of blanket bans.

## Planning Readiness

Ready for planning after wrappers and enforcement policy exist.

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Support: `test-engineer`