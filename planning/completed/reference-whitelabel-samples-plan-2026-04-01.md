# Reference Whitelabel Samples Plan

Date: 2026-04-01
Repository: `nettoolskit-ui-vue`
Status: Complete
Branch: `feat/remove-cms-whitelabel-reference-2026-04-01`

## Scope Summary

Remove the CMS runtime from the active product surface and reposition the repository around:
- reusable templates and components derived from the approved reference layout
- a parameterized white-label system for shell, tokens, and brand identity
- sample screens that demonstrate the approved reference direction without CMS dependencies

Primary objectives:
- remove `?cms=1`, `landing-page/CmsApp.vue`, and public CMS exports from the main package surface
- preserve and strengthen the existing reusable template architecture under `src/templates/**`
- add a reusable white-label layer that can switch sample branding and shell tokens without duplicating screens
- create a new sample runtime using the approved reference layout direction

Out of scope for this workstream:
- redesigning the generic template contracts that are already stable
- rebuilding the missing `.temp/reference` source tree from scratch
- rewriting historical planning artifacts under `planning/completed/**`

## Current Reality Baseline

- The current repo still exposes a CMS runtime through `/?cms=1`.
- `landing-page/CmsApp.vue` remains a very large authoring shell tied to `src/modules/cms/**`.
- The reusable template layer is already strong enough to host the approved reference screens:
  - `src/templates/layouts/**`
  - `src/templates/pages/**`
  - `src/templates/features/auth/**`
  - `src/templates/features/wiki/**`
  - `src/templates/features/enterprise/**`
- `.temp/reference` does not currently include the original source tree expected by older plans, so the approved direction will be driven by:
  - current reusable templates
  - `planning/reference/layout-reference-system.md`
  - `planning/reference/white-label-parameters-table.md`
  - existing validated template/reference assets already in this repository

## Progress Snapshot

- Branch created for the workstream: `feat/remove-cms-whitelabel-reference-2026-04-01`
- CMS runtime surface removed from active entrypoints, exports, docs, and CMS-specific test suites
- Reusable `src/whitelabel/**` runtime added for preset-driven shell and token swaps
- New `reference-system` feature templates added for report catalog and designer scenarios
- Reference-system templates further decomposed into reusable components for tabs, status, details, and preset summary
- `reference-system` workspace state now lives in a reusable controller under `src/templates/features/reference-system/useReferenceWorkspaceHost.ts`
- `ReferenceWorkspaceShell.vue` and `ReferenceWorkspaceComposer.vue` now centralize the sample shell and catalog/designer composition
- `landing-page/ReferenceSamplesApp.vue` now runs the approved reference flow without CMS dependencies and without duplicating shell markup
- `landing-page/TemplateShowcaseApp.vue` now reuses the shared reference workspace composer for the catalog + designer preview stack
- Root/template documentation now describes the shared reference workspace stack and host controller
- `node v24.14.1` and `npm 11.11.0` were installed in a user-scoped path at `C:\Users\tguis\tools\nodejs`
- Validation now runs locally in this environment:
  - `npm run lint` passes with remaining warnings only in older unrelated files
  - `npm run type-check` passes
  - `npm run test -- tests/unit/templates/ReferenceSystemTemplates.spec.ts tests/unit/landing/LandingTokenization.spec.ts` passes
  - `npm run build:landing` passes
  - `npm audit --omit=dev` reports 0 runtime vulnerabilities
  - `npm audit` still reports 4 dev-dependency vulnerabilities (`brace-expansion`, `flatted`, `immutable`, `picomatch`)

## Ordered Tasks

1. Create the active execution track for CMS removal and reference-system adoption
   - Target paths:
     - `planning/active/reference-whitelabel-samples-plan-2026-04-01.md`
   - Checkpoints:
     - scope, risks, validations, and commit checkpoints are explicit
   - Commit checkpoint suggestion:
     - `docs(plan): start reference whitelabel migration plan`

2. Remove CMS from the active runtime, build, exports, and tests
   - Target paths:
     - `landing-page/main.ts`
     - `landing-page/CmsApp.vue`
     - `vite.config.ts`
     - `index.ts`
     - `src/modules/cms/**`
     - `src/templates/features/cms/**`
     - `src/templates/styles/cms-authoring-reference.css`
     - `tests/e2e/cms-*`
     - `tests/unit/modules/cms/**`
     - `tests/unit/templates/CmsAuthoringChromeComponents.spec.ts`
   - Checkpoints:
     - no public runtime path uses `?cms=1`
     - no package export exposes `src/modules/cms`
     - removed tests/docs no longer reference deleted runtime
   - Commit checkpoint suggestion:
     - `refactor(ui): remove cms runtime and package surface`

3. Introduce the reusable whitelabel layer for the approved reference system
   - Target paths:
     - `src/whitelabel/**`
     - `index.ts`
     - `tests/unit/**`
   - Checkpoints:
     - sample runtime can switch presets without duplicating templates
     - shell identity and tokens are parameter-driven
   - Commit checkpoint suggestion:
     - `feat(whitelabel): add reference system presets and token application`

4. Build the reference samples runtime on top of existing reusable templates
   - Target paths:
     - `landing-page/ReferenceSamplesApp.vue`
     - `landing-page/reference-samples.data.ts`
     - `landing-page/main.ts`
     - `landing-page/App.vue`
     - `landing-page/composables/useLandingI18n.ts`
     - `landing-page/TemplateShowcaseApp.vue`
   - Checkpoints:
     - samples cover approved reference-style screens
     - landing points to samples instead of CMS
     - existing template showcase remains reusable and focused on templates
   - Commit checkpoint suggestion:
     - `feat(samples): add reference whitelabel samples runtime`

5. Reconcile docs, registry metadata, and validations after CMS removal
   - Target paths:
     - `README.md`
     - `src/templates/README.md`
     - `src/templates/features/index.ts`
     - `src/templates/features/feature-template.catalog.ts`
     - `src/templates/styles/README.md`
     - `src/templates/styles/style-template.catalog.ts`
     - `tests/unit/landing/LandingTokenization.spec.ts`
   - Checkpoints:
     - docs describe templates + samples + whitelabel instead of CMS
     - template catalog contains only supported reusable surfaces
     - validation suite covers the new public direction
   - Commit checkpoint suggestion:
     - `docs(templates): align docs with reference whitelabel runtime`

## Validation Checklist

- `npm run lint`
- Result:
  - passes with warnings only in `src/templates/features/wiki/WikiChatDrawerTemplate.vue` and `src/templates/runtime/router.ts`
- `npm run type-check`
- Result:
  - passes
- `npm run test -- tests/unit/landing/LandingTokenization.spec.ts`
- Result:
  - passes
- `npm run test -- tests/unit/templates/ReferenceSystemTemplates.spec.ts`
- Result:
  - passes
- `npm run test -- tests/unit/composables/useReferenceWorkspaceHost.spec.ts`
- Result:
  - passes
- `npm run build:landing`
- Result:
  - passes
- `npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts`
- Result:
  - passes (2 tests)
- `npm run test -- tests/unit/templates/SystemPageTemplates.spec.ts`
- Result:
  - passes (9 tests)
- `npm run test -- tests/unit/templates/EnterpriseFeatureTemplates.spec.ts`
- Result:
  - passes (10 tests)
- `npm run test` (full suite)
- Result:
  - passes — 56 files, 1011 tests (CMS test files removed as part of the CMS removal workstream)
- `npm audit --omit=dev`
- Result:
  - passes with 0 runtime vulnerabilities
- `npm audit`
- Result:
  - fails on 4 dev-dependency vulnerabilities; not addressed in this slice
- `npm run test:e2e -- tests/e2e/template-runtime-screenshots.spec.ts --project=chromium`
- Result:
  - deferred; E2E snapshot baseline is environment-dependent and outside this workstream scope

## Risks

- Deleting CMS files can leave orphan imports in catalog, docs, or tests.
- Template visual regression may need snapshot refresh if sample/showcase copy changes.
- README and historical wording can drift if CMS references are only partially removed.

## Closeout Expectations

- Keep this plan under `planning/active/` until CMS removal and sample runtime validation are complete.
- Create real git commits at each stable checkpoint.
- If the visual baseline changes, refresh the relevant Playwright snapshots in the same workstream.
