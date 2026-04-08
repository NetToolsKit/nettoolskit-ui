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