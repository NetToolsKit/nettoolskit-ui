# Reference Project Patterns Adoption Plan

Date: 2026-04-22
Status: active
Progress: 68%
Primary specialist: `dev-frontend-vue-quasar-engineer`
Tester: mandatory for adopted UI patterns
Reviewer: mandatory before closeout
Release closeout: mandatory

## Scope Summary

Capture useful frontend, admin UX, and low-code platform patterns from the reference repositories provided by the user, then convert the useful ideas into a prioritized implementation backlog for this Vue + Quasar UI library. This plan does not copy code from those projects and does not introduce backend responsibilities.

The adoption target is UI quality: admin shell polish, schema-driven template composition, builder/inspector affordances, governance UX, white-label consistency, visual evidence, and testable Vue + Quasar contracts.

Reference links:
- Directus: https://github.com/directus/directus
- Frappe: https://github.com/frappe/frappe
- Budibase: https://github.com/Budibase/budibase
- Corteza: https://github.com/cortezaproject/corteza
- Appwrite: https://github.com/appwrite/appwrite
- Strapi: https://github.com/strapi/strapi
- OpenBlocks: https://github.com/openblocks-dev/openblocks
- Skyve: https://github.com/skyvers/skyve

## Explicit Out Of Scope

- Backend APIs, database schemas, migrations, queues, workers, auth services, storage services, and deployment architecture are out of scope.
- Directus collections, Strapi content APIs, Frappe DocType persistence, Corteza modules, Appwrite services, Budibase automations, OpenBlocks connectors, and Skyve server-side metadata engines must not be implemented in this UI plan.
- Any future demo data must remain static, mocked, or adapter-driven inside frontend test fixtures.
- Any resource, permission, audit, workflow, or schema concept adopted here must be represented as a frontend contract, visual state, sample fixture, or design-system primitive only.

## Useful Patterns

Directus:
- Data-model-first admin navigation.
- Collection list, detail, permissions, and extension surfaces.
- Polished admin shell consistency.
- Useful locally as the primary admin shell quality benchmark.

Strapi:
- Content-type builder UX.
- Plugin/admin extension slots.
- Clear separation between content model, content entry, and settings screens.
- Useful locally for CMS authoring and schema-builder interaction patterns.

Budibase:
- Internal app builder flows.
- Data source/action/workflow authoring.
- Preview and responsive builder patterns.
- Useful locally for builder canvas, responsive preview, and guided app assembly patterns.

OpenBlocks:
- Retool-style component inspector.
- Data binding and expression editing.
- Live preview with component property panels.
- Useful locally for inspector, component palette, and binding preview concepts.

Frappe:
- Metadata-driven forms and lists.
- Roles, workflow/status, audit, and document versioning concepts.
- Useful locally for schema-driven templates and governance-oriented visual states.

Corteza:
- Low-code modules, pages, workflows, and permission-aware navigation.
- Strong enterprise governance mental model.
- Useful locally for role-aware navigation, workflow state chips, and page/module organization.

Appwrite:
- Console patterns for auth, database, storage, functions, and messaging resources.
- Useful resource cards and platform onboarding flows.
- Useful locally for resource cards, empty states, onboarding checklists, and console information architecture.

Skyve:
- Enterprise low-code metadata patterns.
- Validation, workflow, and audit concepts useful for admin templates.
- Useful locally for validation summaries, audit timeline layout, and metadata-driven form/read-only/detail states.

## Pattern Matrix

| Reference | Local fit | Priority | Local UI surface | Adopt | Out-of-scope boundary |
| --- | --- | --- | --- | --- | --- |
| Directus | High | P1 | Admin shell, collection lists, resource navigation, permission-aware menu states | Admin polish rubric, resource grouping, list/detail state model | No SQL/API/permission engine |
| Strapi | High | P1 | CMS authoring, content model builder, plugin slots, settings panels | Content model UI, entry editor UX, extensibility slots | No CMS backend/content API |
| Budibase | Medium | P2 | Builder preview, actions panel, responsive inspector, app assembly | Canvas shell, responsive preview controls, action configuration UI | No datasource/action execution engine |
| OpenBlocks | Medium | P2 | Component inspector, binding editor, live preview | Property inspector, binding tokens, expression preview states | No connector runtime/query engine |
| Frappe | Medium | P2 | Metadata-driven forms/lists, workflow states, audit/version UI | Schema contract, workflow/status UI, version timeline | No DocType persistence/workflow engine |
| Corteza | Medium | P2 | Low-code modules, RBAC-aware pages, workflow UX | Role-aware navigation, approvals UI, module grouping | No RBAC service/workflow backend |
| Appwrite | Medium | P3 | Platform console cards, auth/resource onboarding, resource status | Resource cards, empty states, onboarding checklist | No auth/database/storage/functions service |
| Skyve | Low/Medium | P3 | Enterprise validation, workflow, audit concepts | Validation panels, audit timeline, metadata state variants | No Java/server metadata framework |

## Implementation Evidence Update - 2026-04-22

Implemented adoption signals:
- Directus/Frappe-style list surfaces are now represented by a shared tokenized `NtkDataTable` adapter over Quasar `QTable`.
- CRUD, Wiki, Enterprise command center, and Editor workbench templates now use the same table strategy instead of native per-template tables.
- Directus/Strapi-style admin-shell parity is covered in the reference evidence matrix through QLayout shell, resource navigation, initials avatar, overlay, table/list, and dark contrast checks.
- Appwrite-style console clarity remains represented through dashboard/settings/resource card evidence, without adding backend services.

Validated evidence:
- `npx playwright test tests/e2e/template-runtime-reference-evidence.spec.ts --workers=1 --output=.build/test-results/vue-quasar-reference-evidence`: 3 tests passed.
- `npx playwright test tests/e2e/template-runtime-dark-theme-guardrails.spec.ts --workers=1 --output=.build/test-results/vue-quasar-dark-theme-guardrails`: 10 tests passed across Warp and Resend dark themes.
- `npx playwright test tests/e2e/template-runtime-visual.spec.ts --workers=1 --output=.build/test-results/runtime-template-visual-certification`: 4 tests passed across Revolut, Claude, Warp, and Resend.
- `npx playwright test tests/e2e/template-runtime-screenshots.spec.ts --workers=1 --output=.build/test-results/runtime-template-screenshots-baselines`: 4 tests passed against refreshed reference-style baselines.
- `npx playwright test tests/e2e/template-runtime-data-flows.spec.ts tests/e2e/template-runtime-flow.spec.ts --workers=1 --output=.build/test-results/runtime-template-flow-fixes`: 4 tests passed.
- `npx playwright test tests/e2e/template-runtime-auth.spec.ts tests/e2e/template-runtime-whitelabel.spec.ts tests/e2e/template-runtime-wiki-chat.spec.ts tests/e2e/template-runtime-layout.spec.ts --workers=1 --output=.build/test-results/runtime-template-core-english`: 9 tests passed.
- `.build/evidence/reference-visual-comparison/vue-quasar-compliance-matrix.json` records all current parity signals as `pass`.
- Screenshots remain under `.build/evidence/reference-visual-comparison/`.

Deferred adoption:
- Builder/inspector concepts from Budibase/OpenBlocks remain planned only.
- Governance workflow/audit concepts from Corteza/Frappe/Skyve remain UI-backlog only.
- No backend, connector, permission engine, workflow engine, or data execution layer was added.

Progress note:
- Pattern analysis and reference mapping: 95%.
- Implemented UI adoption with automated evidence: 45%.
- Overall plan progress remains 68% because builder/inspector and governance UX are intentionally still backlog slices.

## Admin Shell Rubric

Goal:
- Make the shell feel closer to Directus/Strapi-grade admin tooling while preserving the current Vue + Quasar architecture and white-label theme system.

Backlog slices:
- P1: Resource navigation taxonomy with stable groups, active state clarity, density modes, and theme-safe separators.
- P1: User menu parity with initials/avatar, account metadata, role/tenant context, keyboard access, and dark-theme contrast.
- P1: Global shell evidence spec with screenshots for Revolut, Claude, Warp, and Resend themes.
- P2: Command/search affordance placeholder with shortcut hint, focus state, empty state, and no backend search dependency.
- P2: Permission-aware disabled/hidden menu states represented by frontend fixtures only.
- P3: Onboarding/resource cards inspired by Appwrite console patterns for empty projects and first-run guidance.

Acceptance criteria:
- The shell can be evaluated through a repeatable checklist covering navigation, hierarchy, density, focus, keyboard behavior, contrast, and empty states.
- All color decisions flow through `--ntk-*`, `--semantic-*`, or Quasar bridge variables.
- Evidence is generated under `.build` and never outside `.build` or `.temp`.
- The shell remains backend-agnostic and can run with static sample data.

Validation commands:
- `npm run type-check`
- `npx playwright test tests/e2e/template-runtime-reference-evidence.spec.ts --workers=1 --output=.build/test-results/reference-shell-rubric`
- `npx playwright test tests/e2e/template-runtime-dark-theme-guardrails.spec.ts --workers=1 --output=.build/test-results/reference-shell-dark-guardrails`

## Schema-Driven Template Backlog

Goal:
- Convert Directus, Strapi, Frappe, and Skyve metadata ideas into frontend-only template contracts for lists, detail pages, forms, settings, validation summaries, and read-only states.

Backlog slices:
- P1: Define a UI schema contract for fields, sections, display density, required states, read-only states, validation messages, and action slots.
- P1: Map schema fixtures to existing page templates without introducing backend services.
- P1: Add schema-driven examples for list, detail, edit, create, and settings surfaces.
- P2: Add workflow/status visual metadata such as draft, pending review, approved, rejected, archived, and read-only locked.
- P2: Add version/audit metadata fixtures for timeline and change summary components.
- P3: Add extension-slot metadata inspired by Strapi plugin areas and Directus extension surfaces.

Acceptance criteria:
- Every schema-driven sample is renderable from static frontend fixtures.
- Schema names and labels remain English-only in template definitions and documentation.
- The registry documents which fields are visual-only versus integration placeholders.
- No backend/platform concept is required to run, test, or visually certify the templates.

Validation commands:
- `npm run type-check`
- `npm run test -- tests/unit/templates`
- `rg -n 'DocType|collection API|content API|database schema|migration|backend service' src/templates planning/active`

## Builder And Inspector Backlog

Goal:
- Translate Budibase and OpenBlocks concepts into UI-only builder affordances that help users assemble and inspect templates without implementing data execution.

Backlog slices:
- P1: Component palette layout with categories, search/filter, theme-safe item cards, and disabled/pro-only states represented as frontend fixtures.
- P1: Property inspector shell with sections for content, appearance, layout, behavior, and accessibility.
- P1: Responsive preview controls for desktop, tablet, and mobile using existing sample pages and static fixtures.
- P2: Binding preview UI that displays tokenized expressions as inert text, not executable code.
- P2: Action configuration mock UI for buttons/forms with visual validation only.
- P2: Selection breadcrumbs and inspector focus ring for canvas-selected components.
- P3: Change summary panel for staged builder edits, reset states, and preview-only warnings.

Acceptance criteria:
- The inspector never executes user-provided expressions.
- All preview states can be tested with deterministic fixtures.
- Component palette and inspector surfaces pass dark-theme contrast checks.
- The builder concepts remain separate from backend data sources, connectors, and automation engines.

Validation commands:
- `npm run type-check`
- `npm run test -- tests/unit/templates`
- `npx playwright test tests/e2e/template-runtime-visual.spec.ts --workers=1 --output=.build/test-results/builder-inspector-visual`

## Governance UX Backlog

Goal:
- Convert Corteza, Frappe, and Skyve governance concepts into visible, testable UI patterns for enterprise users without creating authorization or workflow services.

Backlog slices:
- P1: Role-aware navigation states using static role fixtures: visible, disabled, hidden, and restricted tooltip.
- P1: Workflow/status chips and banners for draft, review, approved, rejected, archived, failed validation, and locked states.
- P1: Audit timeline component pattern with actor, timestamp, action, before/after summary, and theme-safe severity colors.
- P2: Approval queue screen pattern with filters, bulk-selection affordance, empty states, and read-only preview pane.
- P2: Version history and rollback-intent UI where rollback is represented as a disabled/demo action unless a future backend plan exists.
- P3: Environment promotion UI pattern for draft, staging, and production labels as static visual metadata.

Acceptance criteria:
- Governance UX uses static fixtures and does not enforce real permissions.
- UI states communicate clearly when an action is visual-only, unavailable, or integration-dependent.
- Audit and workflow colors use semantic tokens only.
- Screens pass dark-theme guardrails and have keyboard-visible focus states.

Validation commands:
- `npm run type-check`
- `npm run test -- tests/unit/templates`
- `npx playwright test tests/e2e/template-runtime-dark-theme-guardrails.spec.ts --workers=1 --output=.build/test-results/governance-dark-guardrails`

## Ordered Tasks

### Task 1 - Strengthen Pattern Matrix

Status: completed

Target paths:
- `planning/active/reference-project-patterns-adoption-plan-2026-04-22.md`

Work:
- Build a matrix of project, useful pattern, UI surface impacted, fit score, priority, and implementation risk.
- Keep sources linked and summarized.
- Mark backend/platform concepts as out of scope.

Validation commands:
- `rg -n 'Directus|Strapi|Budibase|OpenBlocks|Frappe|Corteza|Appwrite|Skyve' planning/active/reference-project-patterns-adoption-plan-2026-04-22.md`

Checkpoint:
- Every provided reference link has a clear useful/not-useful decision.

Suggested commit:
- `docs(plans): capture reference project pattern matrix`

### Task 2 - Admin Shell Rubric

Status: ready

Target paths:
- `src/components/layout/NtkAppShell.vue`
- `src/templates/layouts/MainLayoutTemplate.vue`
- `tests/e2e/template-runtime-reference-evidence.spec.ts`
- `.build/test-results/reference-shell-rubric`

Work:
- Compare current shell against Directus/Strapi-style admin polish.
- Score navigation, resource grouping, user menu, command/search, density, keyboard behavior, empty states, and dark contrast.
- Add evidence requirements without changing backend contracts.

Validation commands:
- `npm run type-check`
- `npx playwright test tests/e2e/template-runtime-reference-evidence.spec.ts --workers=1 --output=.build/test-results/reference-shell-rubric`

Checkpoint:
- Shell quality criteria are objective and evidence-backed.

Suggested commit:
- `test(e2e): add admin shell reference rubric`

### Task 3 - Schema-Driven Template Backlog

Status: ready

Target paths:
- `src/templates/pages/page-template.catalog.ts`
- `src/templates/pages/page-template.types.ts`
- `src/templates/features/cms/authoring/`
- `tests/unit/templates`
- `tests/e2e`

Work:
- Translate Directus, Strapi, Frappe, and Skyve metadata patterns into a frontend-only template registry backlog.
- Identify which pieces belong in UI contracts versus backend/domain services.
- Add fixtures for list, detail, edit, validation, workflow, and read-only variants.

Validation commands:
- `npm run type-check`
- `npm run test -- tests/unit/templates`

Checkpoint:
- Schema-driven UI backlog is actionable without backend scope creep.

Suggested commit:
- `docs(plans): define schema driven template backlog`

### Task 4 - Builder And Inspector Concepts

Status: ready

Target paths:
- `src/templates/features/cms/authoring/`
- possible future `src/templates/features/builder/`
- `tests/unit/templates`
- `tests/e2e`
- `.build/test-results/builder-inspector-visual`

Work:
- Extract useful Budibase/OpenBlocks concepts: component palette, property panel, expression preview, responsive preview, selection breadcrumbs, and data binding preview.
- Convert them into UI-only implementation slices.

Validation commands:
- `npm run type-check`
- `npm run test -- tests/unit/templates`
- `npx playwright test tests/e2e/template-runtime-visual.spec.ts --workers=1 --output=.build/test-results/builder-inspector-visual`

Checkpoint:
- Builder ideas are prioritized by impact and implementation risk.

Suggested commit:
- `docs(plans): prioritize builder inspector patterns`

### Task 5 - Governance UX Concepts

Status: ready

Target paths:
- `src/templates/features/enterprise/`
- `src/templates/features/cms/authoring/`
- `tests/unit/templates`
- `tests/e2e`
- `.build/test-results/governance-dark-guardrails`

Work:
- Extract useful Corteza/Frappe/Skyve governance ideas: roles, audit timeline, approvals, workflow status, versioning, rollback intent, and environment promotion.
- Keep the implementation UI-only unless a future backend plan is explicitly created.

Validation commands:
- `npm run type-check`
- `npm run test -- tests/unit/templates`
- `npx playwright test tests/e2e/template-runtime-dark-theme-guardrails.spec.ts --workers=1 --output=.build/test-results/governance-dark-guardrails`

Checkpoint:
- Governance UX backlog is separated from backend implementation.

Suggested commit:
- `docs(plans): map governance ux reference patterns`

### Task 6 - Evidence And Closeout Matrix

Status: ready

Target paths:
- `.build/reference-project-patterns/`
- `planning/active/reference-project-patterns-adoption-plan-2026-04-22.md`
- future completed plan path under `planning/plans/completed/YYYY-MM/`

Work:
- Store screenshots, Playwright reports, contrast notes, and checklist outputs under `.build/reference-project-patterns/`.
- Track which patterns were adopted, deferred, or rejected.
- Move this plan to completed only after the adopted UI slices have evidence and a reviewer pass.

Validation commands:
- `Get-ChildItem -Recurse .build/reference-project-patterns`
- `git status --short`

Checkpoint:
- Evidence proves which reference ideas were adopted and which stayed backlog-only.

Suggested commit:
- `docs(plans): close reference pattern adoption plan`

## Validation Checklist

- [x] Pattern matrix covers all provided repositories.
- [x] Each pattern is mapped to a local UI surface or rejected as out of scope.
- [x] Backend/platform concepts are explicitly out of scope.
- [x] Admin shell rubric includes acceptance criteria and validation commands.
- [x] Schema-driven template backlog includes acceptance criteria and validation commands.
- [x] Builder/inspector backlog includes acceptance criteria and validation commands.
- [x] Governance UX backlog includes acceptance criteria and validation commands.
- [x] Adopted UI patterns include tests or visual evidence.
- [ ] README/docs links are updated if the user asks for a public docs surface.
- [ ] Plan is moved to `planning/plans/completed/YYYY-MM` after implementation evidence is collected.

## Risks

- Reference projects solve broader platform problems; copying their scope would pull backend concerns into this UI library.
- Some projects are not Vue/Quasar references, so they should guide product/admin UX rather than component implementation details.
- Builder/editor features can grow quickly; each adoption should be sliced into testable UI contracts.
- Governance UX can imply real authorization or workflow enforcement; this plan only allows visual states and frontend fixtures.
- Binding/expression editor ideas can become security-sensitive if execution is added later; this plan only allows inert previews.

## Closeout Expectations

- Keep this as an adoption/backlog plan until concrete implementation slices are selected and validated.
- Move to `planning/plans/completed/YYYY-MM` only after useful patterns have been converted into tracked implementation slices or completed UI changes.
- Final closeout should include a percentage for pattern analysis and a separate percentage for implemented adoption.
- Final evidence must remain under `.build` or `.temp`.
- Suggested closeout commit after implementation evidence exists: `docs(plans): complete reference project pattern adoption`.