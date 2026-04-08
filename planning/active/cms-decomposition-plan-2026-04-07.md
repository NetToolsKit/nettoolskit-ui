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
3. review `landing-page/**` for any other reusable system contracts that still belong in `src/**`
4. normalize README and template docs once the remaining surface/export moves stabilize

## Recommended Specialist
- primary: `dev-frontend-vue-quasar-engineer`
- validation support: `test-engineer`
- release closeout: required for each stable phase commit

## Closeout Expectations
- update this active plan with completed scope and validation evidence
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
  - `planning/active/cms-decomposition-plan-2026-04-07.md`
- Commands:
  - `npm run type-check`
  - `npm run lint`
  - `npm run build:landing`
- Commit checkpoint:
  - `refactor(cms): move settings and blocks workspaces onto reusable module surfaces`
- Status:
  - completed