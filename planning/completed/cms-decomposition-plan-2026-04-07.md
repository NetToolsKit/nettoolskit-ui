# CMS Decomposition Plan - 2026-04-07

## Scope Summary
- continue the post-merge runtime cleanup after unifying `feat/remove-cms-whitelabel-reference-2026-04-01` with `feature/landing-components`
- reduce `landing-page/CmsApp.vue` by moving remaining inline CMS authoring modules onto reusable template surfaces under `src/templates/features/cms/authoring/modules`
- preserve runtime behavior while shifting reusable UI, workbench chrome, and file-import flows out of the landing app shell

## Ordered Tasks
1. Completed: replace the inline `Settings` workspace block in `landing-page/CmsApp.vue` with `CmsSettingsModuleSurface` and adapt the file-import callbacks to a `File`-driven contract.
2. Completed: replace the inline `Blocks` workspace block in `landing-page/CmsApp.vue` with `CmsBlocksModuleSurface` and remove now-unused chrome/component imports from the app shell.
3. Completed: re-run validation, record the results in this plan, and create a commit checkpoint for the phase.

## Validation Checklist
- `npm run type-check`
- `npm run lint`
- `npm run build:landing`
- `npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts tests/unit/components/AllComponentsSmoke.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts tests/unit/templates/CmsAuthoringChromeComponents.spec.ts tests/unit/modules/cms/CmsRenderer.spec.ts tests/unit/modules/cms/LandingSchemaIntegration.spec.ts`

## Validation Evidence
- `2026-04-07`: `npm run type-check` passed after switching `Settings` and `Blocks` to surface bindings backed by `unwrapSurfaceProps(...)`.
- `2026-04-07`: `npm run lint` passed with pre-existing Vue formatting warnings only and no errors.
- `2026-04-07`: `npm run build:landing` passed.
- `2026-04-07`: targeted Vitest pack passed with 6 files / 45 tests.

## Implementation Outcome
- `landing-page/CmsApp.vue` now renders `Settings` exclusively through `CmsSettingsModuleSurface`.
- `landing-page/CmsApp.vue` now renders `Blocks` exclusively through `CmsBlocksModuleSurface`.
- the legacy file-input refs and open-dialog handlers were removed from `CmsApp.vue`; imports now flow through surface-emitted `File` payloads.
- `landing-page/CmsApp.vue` dropped from `13478` lines to `10585` lines in this phase.

## Continuation Checkpoint - 2026-04-08

### Scope Extension
- move remaining tenant-profile authoring workflows out of `landing-page/CmsApp.vue` and into reusable helpers under `src/modules/cms/white-label/authoring/**`
- replace the CMS-local blue authoring override pack with a shared enterprise monochrome baseline driven from `src/**`
- document the authoritative CMS/template visual baseline so future modules do not reintroduce page-local shell styling

### Completed Tasks
1. Completed: extract tenant selection, tenant creation/removal, import/export downloads, and JSON file parsing into `src/modules/cms/white-label/authoring/tenant-profile-authoring.ts`.
2. Completed: add a reusable CMS design-baseline helper in `src/modules/cms/white-label/authoring/design-baseline.ts` and wire `landing-page/CmsApp.vue` to consume it instead of hardcoded blue authoring colors.
3. Completed: switch `createDefaultWhiteLabelSettings(...)` to the shared `enterpriseMinimal` default preset and document the baseline in the repository root `DESIGN.md`.
4. Completed: re-run validation and record the results below.

### Validation Evidence - 2026-04-08
- `npm run type-check` passed after moving tenant-profile authoring helpers into `src/modules/cms/white-label/authoring/**` and replacing local CMS theme overrides with `createCmsAuthoringShellTheme(...)`.
- `npm run lint` passed with pre-existing Vue formatting warnings only and no errors.
- `npm run build:landing` passed.
- `npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts tests/unit/components/AllComponentsSmoke.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts tests/unit/templates/CmsAuthoringChromeComponents.spec.ts tests/unit/modules/cms/CmsRenderer.spec.ts tests/unit/modules/cms/LandingSchemaIntegration.spec.ts` passed with 6 files / 45 tests.

### Implementation Outcome - 2026-04-08
- `landing-page/CmsApp.vue` now consumes reusable tenant-profile authoring operations from `src/modules/cms/white-label/authoring/tenant-profile-authoring.ts` instead of owning tenant import/export/select/create/remove logic inline.
- the CMS authoring shell now resolves through `createCmsAuthoringShellTheme(...)`, eliminating the page-local blue override pack that previously overrode shared theme presets.
- `src/modules/cms/white-label/config.ts` now boots new CMS states with the shared `enterpriseMinimal` preset.
- `src/templates/styles/cms-authoring-reference.css` now consumes inherited shared shell tokens instead of overriding the workbench with fixed blue/gray values.
- the repository now has a root-level visual contract in `DESIGN.md` that defines the reusable enterprise monochrome baseline for templates and CMS authoring surfaces.
- `landing-page/CmsApp.vue` dropped further to `10495` lines.

### Remaining Work
1. extract the remaining large stateful workflows from `landing-page/CmsApp.vue` into `src/modules/cms/white-label/**` so the landing app becomes a thin runtime shell
2. continue moving reusable preview/authoring logic from `landing-page/CmsApp.vue` into `src/templates/features/cms/authoring/modules/**`

## Closure Status - 2026-04-12
- Closed as superseded.
- The active product direction moved away from keeping CMS as a first-class `samples/` runtime, and the current workstream now prioritizes the reference baseline plus whitelabel sample families.
- The decomposition work completed so far remains preserved in history, but the remaining CMS-specific extraction tasks are no longer tracked as active execution.
3. review `landing-page/**` for any other reusable system contracts that still belong in `src/**`
4. normalize README and template docs once the remaining surface/export moves stabilize

## Continuation Checkpoint - 2026-04-08 (Theme Runtime)

### Scope Extension
- extract reusable CMS theme editor/runtime behavior from `landing-page/CmsApp.vue`
- move authoring shell CSS variable projection and shared tone styles into `src/modules/cms/white-label/authoring/**`
- continue shrinking `CmsApp.vue` without changing CMS theme/preset behavior

### Completed Tasks
1. Completed: add `src/modules/cms/white-label/authoring/theme-runtime.ts` for theme field picker resolution, preset selection, preset application, and authoring style-variable projection.
2. Completed: rewire `landing-page/CmsApp.vue` to use shared theme runtime helpers instead of local theme field mutation, preset detection, and large style-map blocks.
3. Completed: export the new helper module through `src/modules/cms/white-label/authoring/index.ts`.
4. Completed: re-run validation and record the results below.

### Validation Evidence - 2026-04-08 (Theme Runtime)
- `npm run type-check` passed after moving theme runtime helpers into `src/modules/cms/white-label/authoring/theme-runtime.ts`.
- `npm run lint` passed with pre-existing Vue formatting warnings only and no errors.
- `npm run build:landing` passed.
- `npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts tests/unit/components/AllComponentsSmoke.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts tests/unit/templates/CmsAuthoringChromeComponents.spec.ts tests/unit/modules/cms/CmsRenderer.spec.ts tests/unit/modules/cms/LandingSchemaIntegration.spec.ts` passed with 6 files / 45 tests.

### Implementation Outcome - 2026-04-08 (Theme Runtime)
- theme field color-picker resolution and per-preset override writes no longer live inline in `landing-page/CmsApp.vue`.
- preset application/detection now reuse shared authoring helpers instead of repeating detection logic inside the landing app.
- the large authoring-shell CSS variable map now comes from a shared `src/**` helper, making the CMS design contract reusable for future editor surfaces.
- `landing-page/CmsApp.vue` dropped further to `10250` lines.

### Remaining Work After Theme Runtime
1. extract the remaining large stateful workflows from `landing-page/CmsApp.vue` into `src/modules/cms/white-label/**` so the landing app becomes a thin runtime shell
2. continue moving reusable preview/authoring logic from `landing-page/CmsApp.vue` into `src/templates/features/cms/authoring/modules/**`
3. review `landing-page/**` for any other reusable system contracts that still belong in `src/**`
4. normalize README and template docs once the remaining surface/export moves stabilize

## Continuation Checkpoint - 2026-04-08 (Grouped Module Template APIs)

### Scope Extension
- normalize the public CMS authoring module contracts around grouped template APIs with fewer top-level parameters
- keep the internal surfaces intact as implementation details while moving `landing-page/CmsApp.vue` to wrapper/template consumption
- document and test the grouped-template contract so future whitelabel consumers do not bind directly to the large flat surface prop sets

### Completed Tasks
1. Completed: add grouped wrapper templates for `Settings`, `Pages`, and `Blocks` under `src/templates/features/cms/authoring/modules/**`.
2. Completed: update `landing-page/CmsApp.vue` to consume `CmsSettingsModuleTemplate`, `CmsPagesModuleTemplate`, and `CmsBlocksModuleTemplate` instead of binding directly to the internal surfaces.
3. Completed: update the CMS feature catalog and feature-template README so the grouped wrapper templates are the documented public entry points.
4. Completed: add wrapper contract tests for grouped prop flattening and event forwarding.
5. Completed: re-run validation and record the results below.

### Validation Evidence - 2026-04-08 (Grouped Module Template APIs)
- `npm run type-check` passed after typing each wrapper `flatProps` projection against the internal surface `$props` contract.
- `npm run lint` passed with pre-existing Vue formatting warnings only and no errors.
- `npm run build:landing` passed.
- `npm run test -- tests/unit/templates/CmsAuthoringModuleTemplates.spec.ts tests/unit/templates/CmsAuthoringChromeComponents.spec.ts tests/unit/templates/TemplateAcceptance.spec.ts tests/unit/components/AllComponentsSmoke.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts tests/unit/modules/cms/CmsRenderer.spec.ts tests/unit/modules/cms/LandingSchemaIntegration.spec.ts` passed with 7 files / 48 tests.
- `npm audit --omit=dev --audit-level=high` passed with `0 vulnerabilities`.

### Implementation Outcome - 2026-04-08 (Grouped Module Template APIs)
- `src/templates/features/cms/authoring/modules/CmsSettingsModuleTemplate.vue` now exposes the settings authoring workspace through grouped `shell`, `tenant`, `theme`, `contentModel`, and `actions` contracts.
- `src/templates/features/cms/authoring/modules/CmsPagesModuleTemplate.vue` now exposes the pages authoring workspace through grouped `shell`, `builder`, `library`, `preview`, and `actions` contracts.
- `src/templates/features/cms/authoring/modules/CmsBlocksModuleTemplate.vue` now exposes the blocks authoring workspace through grouped `shell`, `builder`, `library`, `preview`, and `actions` contracts.
- `landing-page/CmsApp.vue` no longer binds directly to the flat public surface contracts for `Settings`, `Pages`, and `Blocks`; the large flat prop sets are now isolated behind grouped template wrappers.
- `src/templates/features/feature-template.catalog.ts` now points the CMS module catalog entries at the grouped wrapper templates instead of the internal surface files.
- `src/templates/features/README.md` now declares grouped domain contracts as the preferred public pattern for reusable authoring modules.
- `landing-page/CmsApp.vue` remains large at `10281` lines, but the public CMS module API is now materially smaller and more reusable for future whitelabel consumers.

### Remaining Work After Grouped Module Template APIs
1. move the grouped module prop builders out of `landing-page/CmsApp.vue` and into reusable `src/modules/cms/white-label/authoring/**` helpers so the landing app shell keeps shrinking
2. continue wrapping `Media` and `Releases` with grouped template entry points so every CMS module follows the same low-parameter public contract
3. keep extracting remaining stateful authoring workflows from `landing-page/CmsApp.vue` into `src/modules/cms/white-label/**`
4. normalize template docs/readmes once the remaining CMS module wrappers stabilize

## Recommended Specialist
- primary: `dev-frontend-vue-quasar-engineer`
- validation support: `test-engineer`
- release closeout: required for each stable phase commit

## Closeout Expectations
- update this completed plan with completed scope and validation evidence
- keep README changes out unless the surface/export contract changes
- produce a detailed English commit message with explicit validations
- preserve changelog-ready details in the commit body only

## Execution Slices
### Slice 1
- Target paths:
  - `landing-page/CmsApp.vue`
  - `src/templates/features/cms/authoring/modules/CmsSettingsModuleSurface.vue`
- Commands:
  - `rg -n "isSettingsModule|CmsSettingsModuleSurface|tenant-import-file-change" landing-page/CmsApp.vue`
- Checkpoint:
  - `Settings` workspace rendered exclusively through `CmsSettingsModuleSurface`
- Status:
  - completed

### Slice 2
- Target paths:
  - `landing-page/CmsApp.vue`
  - `src/templates/features/cms/authoring/modules/CmsBlocksModuleSurface.vue`
- Commands:
  - `rg -n "isBlocksModule|CmsBlocksModuleSurface" landing-page/CmsApp.vue`
- Checkpoint:
  - `Blocks` workspace rendered exclusively through `CmsBlocksModuleSurface`
- Status:
  - completed

### Slice 3
- Target paths:
  - `planning/completed/cms-decomposition-plan-2026-04-07.md`
- Commands:
  - `npm run type-check`
  - `npm run lint`
  - `npm run build:landing`
- Commit checkpoint:
  - `refactor(cms): move settings and blocks workspaces onto reusable module surfaces`
- Status:
  - completed
