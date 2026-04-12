# Samples Runtime Closeout Plan - 2026-04-12

## Scope Summary
- finish the remaining public-runtime cleanup after the approved baseline and the five visual packs were stabilized
- remove the residual circular chunk warning from `build:samples` without breaking the curated samples runtime split
- fix accessibility issues still emitted by the public samples host so the runtime closes this cycle without known browser issues

## Ordered Tasks
1. Completed: audited the current Vite chunk split and confirmed the circular warning came from the public samples entries being forced into manual chunks alongside the shared template-system chunk.
2. Completed: removed the conflicting manual chunk assignments while preserving dedicated chunks for internal CMS, template runtime, and vendor groups so `build:samples` now completes cleanly.
3. Completed: mapped the public-facing form controls still triggering `A form field element should have an id or name attribute` across the reusable dashboard, editor, CRUD, enterprise, and reference-system templates.
4. Completed: patched the affected reusable controls in `src/**` with explicit `name` attributes so the fix applies to every pack that consumes those templates.
5. Completed: reran type-check, targeted unit coverage, `build:samples`, and browser smoke on the public runtime.
6. Completed: archived this plan to `planning/completed` after the runtime closed cleanly with no current console issues on the public routes.

## Validation Checklist
- `npm run type-check`
- `npm run test -- tests/unit/landing/LandingTokenization.spec.ts tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/samples/TemplateShowcaseApprovedReference.spec.ts`
- `npm run build:samples`
- browser smoke on:
  - `http://127.0.0.1:4173/`
  - `http://127.0.0.1:4173/?templates=1`
  - `http://127.0.0.1:4173/?templates=1&family=approved-reference`

## Recommended Specialist
- primary: `dev-frontend-vue-quasar-engineer`
- tester: mandatory
- reviewer: optional if the chunk strategy changes materially
- release closeout: mandatory if this plan reaches completion in the same slice

## Closeout Expectations
- no public samples route should emit known accessibility issues in the browser console
- `build:samples` should complete without the circular chunk warning
- the samples runtime should keep consuming reusable `src/**` components only, without regressing the approved baseline or the five packs

## Closeout Note
- completed on `2026-04-12`
- updated the reusable template controls instead of patching the samples host, so the accessibility cleanup now benefits every whitelabel pack consuming the same `src/**` primitives
- removed the public circular chunk warning without collapsing the internal CMS split or the curated samples runtime split
- validation results:
  - `npm run type-check`
  - `npm run test -- tests/unit/landing/LandingTokenization.spec.ts tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/samples/TemplateShowcaseApprovedReference.spec.ts`
  - `npm run build:samples`
  - browser smoke on:
    - `http://127.0.0.1:4173/`
    - `http://127.0.0.1:4173/?templates=1`
    - `http://127.0.0.1:4173/?templates=1&family=approved-reference`
  - result: no current console messages on the public routes and no circular chunk warning during build

## Task Targets And Checkpoints
### Task 1-2: Build split cleanup
- target paths:
  - `vite.config.ts`
  - `samples/ReferenceCatalogApp.vue`
  - `samples/TemplateShowcaseApp.vue`
  - `samples/reference-hub/**`
- commands:
  - `npm run build:samples`
- checkpoint:
  - the build log no longer reports `reference-catalog -> template-system -> reference-catalog`
- commit checkpoint:
  - `fix(build): remove samples circular chunk warning`

### Task 3-4: Accessibility cleanup
- target paths:
  - `src/templates/features/reference-system/components/ReferenceTopbarActions.vue`
  - `src/templates/features/reference-system/components/ReferencePresetSelectorBar.vue`
  - any directly connected public samples host wrapper if needed
- commands:
  - browser smoke on `/` and `/?templates=1`
- checkpoint:
  - browser console no longer reports form-field `id/name` issues on the public runtime
- commit checkpoint:
  - `fix(samples): resolve public runtime form accessibility issues`

### Task 5-6: Validation and closeout
- target paths:
  - `planning/active/samples-runtime-closeout-plan-2026-04-12.md`
  - `planning/completed/samples-runtime-closeout-plan-2026-04-12.md`
- commands:
  - `npm run type-check`
  - `npm run test -- tests/unit/landing/LandingTokenization.spec.ts tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/samples/TemplateShowcaseApprovedReference.spec.ts`
  - `npm run build:samples`
- checkpoint:
  - working tree is clean and validations are recorded in the closeout note
- commit checkpoint:
  - `docs(planning): close samples runtime cleanup plan`
