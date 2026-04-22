# Reference Project Patterns Adoption Plan

Date: 2026-04-22
Status: active
Progress: 22%
Primary specialist: `dev-frontend-vue-quasar-engineer`
Tester: mandatory for adopted UI patterns
Reviewer: mandatory before closeout
Release closeout: mandatory

## Scope Summary

Capture useful frontend, admin UX, and low-code platform patterns from the reference repositories provided by the user, then convert the useful ideas into a prioritized implementation backlog for this Vue + Quasar UI library. This plan does not copy code from those projects and does not introduce backend responsibilities.

Reference links:
- Directus: https://github.com/directus/directus
- Frappe: https://github.com/frappe/frappe
- Budibase: https://github.com/Budibase/budibase
- Corteza: https://github.com/cortezaproject/corteza
- Appwrite: https://github.com/appwrite/appwrite
- Strapi: https://github.com/strapi/strapi
- OpenBlocks: https://github.com/openblocks-dev/openblocks
- Skyve: https://github.com/skyvers/skyve

## Useful Patterns

Directus:
- Data-model-first admin navigation.
- Collection list, detail, permissions, and extension surfaces.
- Polished admin shell consistency.

Strapi:
- Content-type builder UX.
- Plugin/admin extension slots.
- Clear separation between content model, content entry, and settings screens.

Budibase:
- Internal app builder flows.
- Data source/action/workflow authoring.
- Preview and responsive builder patterns.

OpenBlocks:
- Retool-style component inspector.
- Data binding and expression editing.
- Live preview with component property panels.

Frappe:
- Metadata-driven forms and lists.
- Roles, workflow/status, audit, and document versioning concepts.

Corteza:
- Low-code modules, pages, workflows, and permission-aware navigation.
- Strong enterprise governance mental model.

Appwrite:
- Console patterns for auth, database, storage, functions, and messaging resources.
- Useful resource cards and platform onboarding flows.

Skyve:
- Enterprise low-code metadata patterns.
- Validation, workflow, and audit concepts useful for admin templates.

## Pattern Matrix - Initial Pass

| Reference | Local fit | Priority | Local surface | Decision |
| --- | --- | --- | --- | --- |
| Directus | High | P1 | Admin shell, data lists, permissions-aware navigation | Adopt as admin polish and resource navigation benchmark. |
| Strapi | High | P1 | CMS authoring, content model builder, plugin slots | Adopt for content-type/model UX, without backend scope. |
| Budibase | Medium | P2 | Builder preview, actions/workflows, responsive inspector | Adopt selected builder UX patterns after core compliance. |
| OpenBlocks | Medium | P2 | Component inspector, binding editor, live preview | Adopt inspector/data-binding concepts as UI-only backlog. |
| Frappe | Medium | P2 | Metadata-driven forms/lists, workflow states, audit/version UI | Adopt metadata and governance patterns, not framework architecture. |
| Corteza | Medium | P2 | Low-code modules, RBAC-aware pages, workflow UX | Adopt governance and permission-aware navigation ideas. |
| Appwrite | Medium | P3 | Platform console cards, auth/resource onboarding | Adopt resource-card/onboarding UX only. |
| Skyve | Low/Medium | P3 | Enterprise validation, workflow, audit concepts | Keep as governance inspiration; no direct Vue/Quasar implementation model. |

## Ordered Tasks

### Task 1 - Pattern Matrix

Target paths:
- `planning/active/reference-project-patterns-adoption-plan-2026-04-22.md`
- optional future `docs/reference-patterns.md`

Work:
- Build a matrix of project, useful pattern, UI surface impacted, fit score, and implementation risk.
- Keep sources linked and summarized.

Validation commands:
- `rg -n 'Directus|Strapi|Budibase|OpenBlocks|Frappe|Corteza|Appwrite|Skyve' planning/active`

Checkpoint:
- Every provided reference link has a clear useful/not-useful decision.

Suggested commit:
- `docs(plans): capture reference project pattern matrix`

### Task 2 - Admin Shell Rubric

Target paths:
- `src/components/layout/NtkAppShell.vue`
- `src/templates/layouts/MainLayoutTemplate.vue`
- `tests/e2e/template-runtime-reference-evidence.spec.ts`

Work:
- Compare current shell against Directus/Strapi-style admin polish.
- Score navigation, resource grouping, user menu, command/search, density, keyboard behavior, and dark contrast.
- Add evidence requirements without changing backend contracts.

Validation commands:
- `npx playwright test tests/e2e/template-runtime-reference-evidence.spec.ts --workers=1 --output=.build/test-results/reference-shell-rubric`

Checkpoint:
- Shell quality criteria are objective and evidence-backed.

Suggested commit:
- `test(e2e): add admin shell reference rubric`

### Task 3 - Schema Driven Template Backlog

Target paths:
- `src/templates/pages/page-template.catalog.ts`
- `src/templates/pages/page-template.types.ts`
- `src/templates/features/cms/authoring/`
- planning docs

Work:
- Translate Directus, Strapi, Frappe, and Skyve metadata patterns into a frontend-only template registry backlog.
- Identify which pieces belong in UI contracts versus backend/domain services.

Validation commands:
- `npm run type-check`

Checkpoint:
- Schema-driven UI backlog is actionable without backend scope creep.

Suggested commit:
- `docs(plans): define schema driven template backlog`

### Task 4 - Builder And Inspector Concepts

Target paths:
- `src/templates/features/cms/authoring/`
- possible future `src/templates/features/builder/`
- tests under `tests/unit/templates` and `tests/e2e`

Work:
- Extract useful Budibase/OpenBlocks concepts: property panel, expression editor, responsive preview, component palette, and data binding preview.
- Convert them into UI-only implementation slices.

Validation commands:
- `npm run test -- tests/unit/templates`
- targeted Playwright specs once implemented

Checkpoint:
- Builder ideas are prioritized by impact and implementation risk.

Suggested commit:
- `docs(plans): prioritize builder inspector patterns`

### Task 5 - Governance UX Concepts

Target paths:
- `src/templates/features/enterprise/`
- `src/templates/features/cms/authoring/`
- visual and unit tests

Work:
- Extract useful Corteza/Frappe/Skyve governance ideas: roles, audit timeline, approvals, workflow status, versioning, rollback, and environment promotion.
- Keep the implementation UI-only unless a future backend plan is explicitly created.

Validation commands:
- `npm run test -- tests/unit/templates`

Checkpoint:
- Governance UX backlog is separated from backend implementation.

Suggested commit:
- `docs(plans): map governance ux reference patterns`

## Validation Checklist

- [x] Pattern matrix covers all provided repositories.
- [x] Each pattern is mapped to a local UI surface or rejected as out of scope.
- [x] No backend work is introduced.
- [ ] Adopted patterns include tests or visual evidence.
- [ ] README/docs links are updated if the user asks for a public docs surface.

## Risks

- Reference projects solve broader platform problems; copying their scope would pull backend concerns into this UI library.
- Some projects are not Vue/Quasar references, so they should guide product/admin UX rather than component implementation details.
- Builder/editor features can grow quickly; each adoption should be sliced into testable UI contracts.

## Closeout Expectations

- Keep this as an adoption/backlog plan until concrete implementation slices are selected.
- Move to `planning/completed` only after the useful patterns have been converted into tracked issues/plans or implemented UI changes.
- Final closeout should include a percentage for pattern analysis and a separate percentage for implemented adoption.
