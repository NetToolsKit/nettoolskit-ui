# Reference Whitelabel Report System Plan

Date: 2026-04-01
Repository: `nettoolskit-ui-vue`
Status: Complete
Related history:
- `planning/plans/completed/2026-03/cms-engine-reference-alignment-plan-2026-03-26.md`

## Normalized Intake Summary

Replace the current CMS-facing demo/runtime direction with a reusable reference-system baseline driven by the approved report-designer layout.

Primary objective:
- remove CMS from the public demo/runtime flow and package-facing template catalog focus
- create reusable templates and components for the approved reference-system layout
- introduce a parametrizable whitelabel layer so the same screens can be re-skinned per tenant/product
- publish samples that reproduce the approved reference screens using the new reusable architecture

Out of scope for this workstream:
- redesigning the generic library primitives unrelated to the reference-system surfaces
- changing low-level Quasar bootstrapping outside what is needed for the new sample/runtime entrypoints
- preserving the previous CMS demo route as a supported public flow

## Current Reality Baseline

- The current landing/demo boot file still exposes `?cms=1` through `landing-page/main.ts`.
- `landing-page/CmsApp.vue` and `src/templates/features/cms/**` still dominate the demo/template narrative.
- The reusable foundation needed for the approved layout already exists:
  - `src/templates/layouts/MainLayoutTemplate.vue`
  - `src/templates/pages/editor/EditorWorkbenchTemplate.vue`
  - `src/templates/styles/reference-app-bridge.scss`
- The supplied reference project under `.temp/reference/` does not include the original source tree in this workspace; the reliable approval artifacts available locally are:
  - `docs/knowledge-base/planning-reference/edit.png`
  - `docs/knowledge-base/planning-reference/layout-reference-system.md`
  - the already extracted editor/template primitives inside `src/templates/**`

## Progress Update

- 2026-04-01 slice 1:
  - added the reusable `reference-system` template pack under `src/templates/features/reference-system/**`
  - added `landing-page/ReferenceSamplesApp.vue` as the CMS-free sample runtime
  - updated `landing-page/TemplateShowcaseApp.vue` to surface the reference manager + designer templates
  - build validation passed with `vite build`
  - global `vue-tsc --noEmit` is currently blocked by pre-existing TS4023 export-name issues in legacy base components (`BaseFooter`, `BaseHeader`, `BaseHero`, `BaseButton`, `BaseCard`, `BaseChip`, `BaseCreditCard`, `BaseFeatureCard`, `BaseLogo`, `BasePricingCard`, `BaseSteps`, `MetricCard`)
  - eslint could not be trusted in this workstation because the fallback cache used for validation (`.temp/reference/node_modules`) is missing `yocto-queue`
- 2026-04-01 slice 2:
  - extracted reusable building blocks from the reference-system templates:
    - status badge
    - detail card
    - document tabs bar
    - whitelabel preset summary card
  - kept the manager and designer templates as composition shells instead of monolithic page-level implementations
  - expanded unit coverage to assert the extracted components can be mounted independently from the page templates
- 2026-04-01 slice 3:
  - split the previous `reference-system.sample-data.ts` dump into dedicated files for:
    - report catalog sample data
    - manager sample config
    - designer sample config
  - preserved backwards compatibility by keeping `reference-system.sample-data.ts` as a barrel re-export
- 2026-04-01 slice 4:
  - extracted a reusable shell/composition layer for the reference workspace:
    - `ReferenceWorkspaceShell.vue`
    - `ReferenceWorkspaceComposer.vue`
    - `ReferenceBrandLockup.vue`
    - `ReferencePresetSelectorBar.vue`
  - slimmed `landing-page/ReferenceSamplesApp.vue` down to sample-state orchestration only
  - updated `landing-page/TemplateShowcaseApp.vue` to reuse the shared composer instead of wiring manager/designer separately
  - installed `node v24.14.1` and `npm 11.11.0` in a user-scoped path so local validation can run in this workstation
  - validation results for this slice:
    - `npm run lint` passes with warnings only in older unrelated files (`WikiChatDrawerTemplate.vue`, `src/templates/runtime/router.ts`)
    - `npm run type-check` passes
    - `npm run test -- tests/unit/templates/ReferenceSystemTemplates.spec.ts tests/unit/landing/LandingTokenization.spec.ts` passes
    - `npm run build:landing` passes
    - `npm audit --omit=dev` passes with 0 runtime vulnerabilities
    - `npm audit` still reports 4 dev-dependency vulnerabilities (`brace-expansion`, `flatted`, `immutable`, `picomatch`)
- 2026-04-01 slice 5:
  - moved the workspace host/controller state into the reusable feature pack:
    - `useReferenceWorkspaceHost.ts`
  - removed the landing-page-only host state wrapper
  - updated both `landing-page/ReferenceSamplesApp.vue` and `landing-page/TemplateShowcaseApp.vue` to consume the shared workspace host controller
  - added unit coverage for workspace host behavior:
    - preset persistence
    - menu/action routing
    - explicit state hydration
  - updated the root/template docs to document the new shell/composer/host structure:
    - `README.md`
    - `src/templates/README.md`
    - `src/templates/features/README.md`
  - validation results for this slice:
    - `npm run lint` passes with warnings only in older unrelated files (`WikiChatDrawerTemplate.vue`, `src/templates/runtime/router.ts`)
    - `npm run type-check` passes
    - `npm run test -- tests/unit/composables/useReferenceWorkspaceHost.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts tests/unit/landing/LandingTokenization.spec.ts` passes
    - `npm run build:landing` passes
- 2026-04-01 slice 6 (closeout):
  - confirmed all plan validation items pass in final state:
    - `npm run lint` — passes, warnings only in pre-existing files
    - `npm run type-check` — passes
    - `npm run build:landing` — passes
    - `npm run test` (full suite) — 56 files, 1011 tests, all passing
    - `npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts` — passes (2 tests)
    - `npm run test -- tests/unit/templates/SystemPageTemplates.spec.ts` — passes (9 tests)
    - `npm run test -- tests/unit/templates/EnterpriseFeatureTemplates.spec.ts` — passes (10 tests)
    - `npm run test -- tests/unit/templates/ReferenceSystemTemplates.spec.ts` — passes
    - `npm audit --omit=dev` — 0 runtime vulnerabilities
  - archived both plans under `planning/plans/completed/YYYY-MM/`
  - commit: `docs(plan): close out reference whitelabel report system workstream`

## Ordered Tasks

1. Retire CMS from public entrypoints and package narrative
   - Target paths:
     - `landing-page/main.ts`
     - `landing-page/App.vue`
     - `index.ts`
     - `src/templates/features/index.ts`
     - `src/templates/features/feature-template.catalog.ts`
     - `vite.config.ts`
   - Commands:
     - `rg -n "cms|CmsApp|feature-cms" landing-page src index.ts vite.config.ts`
   - Checkpoints:
     - no public demo route points to `CmsApp.vue`
     - package root no longer exports `src/modules/cms`
     - template showcase/catalog no longer treats CMS as the active feature track
   - Commit checkpoint suggestion:
     - `refactor(runtime): retire cms entrypoints from demo surface`

2. Build a reusable reference-system template pack
   - Target paths:
     - `src/templates/features/reference-system/**`
     - `src/templates/pages/**`
     - `src/templates/styles/**`
   - Commands:
     - `npm run test -- tests/unit/templates/EditorWorkbenchTemplate.spec.ts`
   - Checkpoints:
     - report manager and report designer surfaces exist as reusable templates
     - shell, report list, workspace actions, designer slots, and whitelabel contracts are parameter-driven
     - approved editor layout is represented by reusable contracts instead of page-specific markup
   - Commit checkpoint suggestion:
     - `feat(templates): add reusable reference report system templates`

3. Add parametrizable whitelabel presets and sample screens
   - Target paths:
     - `landing-page/ReferenceSamplesApp.vue`
     - `src/templates/features/reference-system/**`
     - `src/config/presets/**`
   - Commands:
     - `npm run test -- tests/unit/templates/ReferenceSystemTemplates.spec.ts`
   - Checkpoints:
     - at least two approved-layout sample screens are available
     - samples can switch brand/theme/preset without duplicating structure
     - sample state is driven by reusable preset/data contracts
   - Commit checkpoint suggestion:
     - `feat(samples): add whitelabel reference-system samples`

4. Refresh showcase, validation, and closeout
   - Target paths:
     - `landing-page/TemplateShowcaseApp.vue`
     - `tests/unit/templates/**`
     - `README.md`
     - `planning/plans/completed/2026-04/reference-whitelabel-report-system-plan-2026-04-01.md`
   - Commands:
     - `npm run lint`
     - `npm run type-check`
     - `npm run build:landing`
   - Checkpoints:
     - showcase highlights the new reference-system templates and samples
     - touched docs reflect the new public flow
     - validations and commit messages are recorded in this plan
   - Commit checkpoint suggestion:
     - `docs(showcase): align samples and catalog with reference system`

## Validation Checklist

- `npm run lint`
- `npm run type-check`
- `npm run build:landing`
- `npm run test -- tests/unit/templates/ReferenceSystemTemplates.spec.ts`

## Recommended Specialist

- Implementation: `dev-frontend-vue-quasar-engineer`
- Planning maintenance: `plan-active-work-planner`
- Test gate: required
- Review gate: required before closing the workstream
- Release closeout: required with English commit messages

## Closeout Expectations

- This file is archived under `planning/plans/completed/YYYY-MM/` after the reference-system samples replaced the CMS public flow.
- Every stable slice must end with:
  - validation results
  - an English commit message
  - a real git commit
- When the workstream is complete:
  - keep this archived file in `planning/plans/completed/YYYY-MM/`
  - update README sections touched by the public demo/runtime flow