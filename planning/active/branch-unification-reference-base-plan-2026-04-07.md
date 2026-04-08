# Branch Unification Reference Base Plan

## Metadata
- Date: 2026-04-07
- Base branch: `feat/remove-cms-whitelabel-reference-2026-04-01`
- Integration source: `feature/landing-components`
- Integration branch: `feat/branch-unification-reference-base-2026-04-07`
- Worktree: `C:\Users\tguis\Documents\Trabalho\Pessoal\Desenvolvimento\Projetos\.worktrees\nettoolskit-ui-vue-branch-unification-2026-04-07`

## Goal
Unify the reference-system baseline with the CMS/landing-components workstream without losing functionality in either runtime surface.

## Phase Status
- [x] Create isolated integration worktree from the reference-base branch.
- [x] Reconcile entrypoints, exports, catalogs, and runtime chunking so `landing`, `cms`, `samples`, `templates`, and `template-runtime` coexist.
- [x] Validate the unified runtime and resolve remaining documentation/test parity gaps.
- [ ] Commit the integration checkpoint with detailed English closeout notes.
- [ ] Continue remaining planning workstreams on top of the unified branch, committing each stable phase.

## Execution Notes
- Keep `feat/remove-cms-whitelabel-reference-2026-04-01` semantics as the baseline for shared layout/template/reference-system contracts.
- Preserve CMS authoring surfaces, tests, docs, and runtime slices brought by `feature/landing-components`.
- Prefer shared `src/**` contracts over `landing-page/**` duplication whenever merge choices are ambiguous.

## Mandatory Validation
```bash
npm run lint
npm run type-check
npm run build:landing
npm run test -- tests/unit/landing/LandingI18n.spec.ts tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/TemplateAcceptance.spec.ts tests/unit/components/AllComponentsSmoke.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts tests/unit/templates/CmsAuthoringChromeComponents.spec.ts tests/unit/modules/cms/CmsRenderer.spec.ts tests/unit/modules/cms/LandingSchemaIntegration.spec.ts
```

## Validation Evidence
- `npm run type-check` passed
- `npm run lint` passed with existing Vue formatting warnings and no errors
- `npm run build:landing` passed after reconciling chunk ownership and removing the temporary circular chunk warning
- `npm run test -- tests/unit/landing/LandingI18n.spec.ts tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/TemplateAcceptance.spec.ts tests/unit/components/AllComponentsSmoke.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts tests/unit/templates/CmsAuthoringChromeComponents.spec.ts tests/unit/modules/cms/CmsRenderer.spec.ts tests/unit/modules/cms/LandingSchemaIntegration.spec.ts` passed

## Closeout Rule
Every stable phase after the unification checkpoint must end with:
- updated planning status
- validation evidence
- a real commit
- a detailed English commit message