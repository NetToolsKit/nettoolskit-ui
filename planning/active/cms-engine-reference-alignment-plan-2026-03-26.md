# CMS Engine Reference Alignment Plan

Date: 2026-03-26
Repository: `nettoolskit-ui-vue`
Status: In Progress
Related history:
- `planning/completed/cms-engine-enterprise-plan-2026-03-13.md`

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

- Historical plan status in `planning/completed/cms-engine-enterprise-plan-2026-03-13.md` says the template/reference alignment track was completed.
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

## Ordered Tasks

1. Reconcile plan status with runtime truth
   - Target paths:
     - `planning/active/cms-engine-reference-alignment-plan-2026-03-26.md`
     - `planning/completed/cms-engine-enterprise-plan-2026-03-13.md`
   - Commands:
     - `git status --short`
     - `rg -n "NtkAppShell|MainLayoutTemplate|EditorWorkbenchTemplate" landing-page/CmsApp.vue src/templates -S`
   - Checkpoints:
     - active plan exists
     - plan explicitly records the current template/runtime gap
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
   - Status: in progress
   - Target paths:
     - `landing-page/CmsApp.vue`
     - `landing-page/cms/*.vue`
     - `landing-page/cms/composables/*.ts`
     - `landing-page/cms/utils/*.ts`
     - `src/templates/styles/cms-authoring-reference.css`
   - Commands:
     - `npm run lint`
     - `npm run type-check`
     - `npm run build:landing`
   - Checkpoints:
     - repeated toolbar/ruler/sidebar/status blocks extracted
     - shared styles used instead of per-screen duplication
     - `CmsApp.vue` becomes orchestration-heavy instead of markup-heavy
   - Commit checkpoint suggestion:
     - `refactor(cms): extract reusable authoring chrome components`

5. Reference-parity validation and release closeout
   - Target paths:
     - `.temp/reference/**`
     - `.temp/comparison/**`
     - `planning/active/cms-engine-reference-alignment-plan-2026-03-26.md`
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
- Review gate: required before closing this active plan
- Release closeout: required with detailed English commit messages

## Closeout Expectations

- Keep this plan in `planning/active/` until the CMS runtime truly matches the template/reference architecture.
- If README files are touched, they must continue following `docs/standards/readme-frontend-super-agent-standard.md`.
- Every stable phase must end with:
  - validation results
  - an English commit message
  - a real git commit
- After full completion:
  - move this plan to `planning/completed/`
  - update the historical enterprise plan only if a corrective note is needed