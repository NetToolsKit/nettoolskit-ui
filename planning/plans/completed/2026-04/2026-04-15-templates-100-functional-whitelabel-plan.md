# Templates 100 Percent Functional And White Label — Execution Plan

Date: 2026-04-15
Branch: `feat/remove-cms-whitelabel-reference-2026-04-01`
Status: completed — closeout readiness 100%

## Scope Summary

Bring the template catalog and `?template-runtime=1` into a reference-ready state where:
- every approved runtime route delivers a local functional flow, without `Coming soon` placeholders
- auth, dashboard, clients, orders, settings, and wiki/chat work with deterministic local persistence
- template styling is driven by CSS variables and theme tokens, without meaningful fixed-color islands or direct Quasar semantic drift
- automated tests prevent functional and white-label regressions

## Status Snapshot

Overall status: **100%**

| Slice | Status | Current evidence | Remaining closeout gap |
|---|---:|---|---|
| Slice 1 — Guardrails And Baseline Audit | 100% | Router, white-label, navigation/auth, reference-system, theme-switcher, and dedicated runtime-interaction unit guardrails exist. | No current gap for the approved guardrail baseline. |
| Slice 2 — Runtime Local Data And Persistence Contracts | 100% | Runtime local data, deterministic auth, persisted wiki/chat behavior, and split storage/factory modules exist. | No current gap for the local-first runtime contract. |
| Slice 3 — Replace Placeholder Routes With Functional Surfaces | 100% | Approved runtime routes are functional and the router tests forbid placeholders. | No current gap for approved routes. |
| Slice 4 — Complete White Label Tokenization | 100% | Shell, dashboard, CRUD, wiki, reference-system, semantic chips, dark contrast fixes, scoped Quasar bridge overrides, legacy hardcoded fallback audits, and Quasar brand resync guardrails are implemented. | No current gap for the approved white-label scope. |
| Slice 5 — Runtime Coverage And Visual Confidence | 100% | Dedicated runtime flow, visual preset certification, dark contrast, whitelabel, wiki/chat coverage, and screenshot-baseline matrix coverage exist. | No current gap for approved runtime visual confidence. |
| Slice 6 — Final Sweep, Documentation, And Closeout | 100% | README/reference docs are updated, final validations are recorded, and this plan is ready for `planning/plans/completed/YYYY-MM/`. | No current closeout gap. |

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Tester: mandatory
- Reviewer: recommended before merge
- Release closeout: required before closing the workstream

---

## Ordered Tasks

### Slice 1 — Guardrails And Baseline Audit

**Goal:** Convert the already identified gaps into automated checks before expanding functionality.

**Target paths:**
- `planning/plans/completed/2026-04/2026-04-15-templates-100-functional-whitelabel-plan.md`
- `tests/unit/templates/TemplateRuntimeRouter.spec.ts`
- `tests/unit/templates/NavigationAndAuthTemplates.spec.ts`
- `tests/unit/templates/ReferenceSystemTemplates.spec.ts`
- `tests/unit/templates/TemplateWhiteLabelAudit.spec.ts` (new)
- `tests/unit/templates/ThemeSwitcherTokens.spec.ts` (new)
- `tests/unit/templates/TemplateRuntimeInteractions.spec.ts`

**Changes:**
- add automated audit coverage for prohibited hardcoded colors and inline styles in `src/templates/**`
- cover `ThemeDotsSwitcher` and `useThemeSwitcher`
- expand runtime coverage beyond scaffold/menu tests, including header actions, user menu, auth redirect, and chat FAB
- register temporary exceptions only when strictly necessary and with a removal plan

**Commands:**
- `npm test -- tests/unit/templates/TemplateRuntimeRouter.spec.ts tests/unit/templates/NavigationAndAuthTemplates.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/templates/ThemeSwitcherTokens.spec.ts tests/unit/templates/TemplateRuntimeInteractions.spec.ts`

**Checkpoint:**
- the suite fails when a meaningful new hardcode enters `src/templates/**`
- the runtime has minimum coverage for navigation, auth shell, and theme switching

**Current status:** complete for the approved guardrail baseline.

**Suggested commit:**
- `test(templates): add runtime and white-label guardrails`

---

### Slice 2 — Runtime Local Data And Persistence Contracts

**Goal:** Replace demo-only runtime behavior with usable local flows and persisted state.

**Target paths:**
- `src/templates/runtime/router.ts`
- `src/templates/runtime/index.ts`
- `src/templates/runtime/TemplateRuntimeApp.vue`
- `src/templates/runtime/runtime-data.template.ts`
- `src/templates/runtime/runtime-storage.template.ts`
- `src/templates/runtime/runtime-factories.template.ts`
- `src/templates/scaffolding/auth-service.template.ts`
- `src/templates/scaffolding/auth-store.template.ts`
- `src/templates/features/wiki/wiki-chat-service.template.ts`
- `src/templates/features/wiki/wiki-chat-store.template.ts`

**Changes:**
- replace `fakeDashboard` and purely fake services with local contracts persisted in `localStorage`
- make auth deterministic, including login, logout, session restore, and predictable error states
- make wiki/chat functional with local history, conversation continuity, deletion, and persisted reopen behavior
- split fixtures, storage keys, and state factories so modules can evolve safely

**Commands:**
- `npm run type-check`
- `npm test -- tests/unit/templates/ScaffoldingTemplates.spec.ts tests/unit/templates/WikiTemplates.spec.ts tests/unit/templates/TemplateRuntimeInteractions.spec.ts`

**Checkpoint:**
- browser refresh preserves the expected session and local data
- wiki/chat no longer depends on random responses

**Current status:** implemented as a local-first runtime contract with split storage and factory modules.

**Suggested commit:**
- `feat(templates/runtime): add persistent local runtime data contracts`

---

### Slice 3 — Replace Placeholder Routes With Functional Surfaces

**Goal:** Remove `PlaceholderTemplate` from the approved runtime's main routes.

**Target paths:**
- `src/templates/runtime/router.ts`
- `src/templates/pages/crud/CrudListTemplate.vue`
- `src/templates/pages/dashboard/DashboardWorkspaceTemplate.vue`
- `src/templates/pages/account/ProfileTemplate.vue`
- `src/templates/features/enterprise/ApprovalQueueTemplate.vue`
- `src/templates/features/enterprise/AuditTimelineTemplate.vue`
- `src/templates/features/enterprise/EnterpriseCommandCenterTemplate.vue`
- `src/templates/runtime/pages/RuntimeClientsTemplate.vue` (new if needed)
- `src/templates/runtime/pages/RuntimeOrdersTemplate.vue` (new if needed)
- `src/templates/runtime/pages/RuntimeSettingsTemplate.vue` (new if needed)

**Changes:**
- implement `Clients`, `Orders`, and `Settings` with existing reusable templates
- connect filters, selection, local actions, and state messages to persisted runtime data
- align labels, breadcrumbs, empty states, and navigation UX with the approved shell
- keep the runtime as a functional kit reference, not a placeholder collection

**Commands:**
- `npm run type-check`
- `npm test -- tests/unit/templates/CrudListTemplate.spec.ts tests/unit/templates/ProfileAndLayoutTemplates.spec.ts tests/unit/templates/EnterpriseFeatureTemplates.spec.ts tests/unit/templates/TemplateRuntimeInteractions.spec.ts`

**Checkpoint:**
- no approved main menu route uses `PlaceholderTemplate`
- clients/orders/settings execute real local actions with visual feedback

**Current status:** complete for approved runtime routes.

**Suggested commit:**
- `feat(templates/runtime): replace placeholder routes with functional local flows`

---

### Slice 4 — Complete White Label Tokenization

**Goal:** Eliminate meaningful residual hardcodes and make the UI respond fully to tenant/theme changes.

**Target paths:**
- `src/composables/useThemeSwitcher.ts`
- `src/templates/navigation/ThemeDotsSwitcher.vue`
- `src/templates/styles/reference-app-bridge.scss`
- `src/templates/layouts/MainLayoutTemplate.vue`
- `src/templates/features/auth/LoginTemplate.vue`
- `src/templates/pages/system/PlaceholderTemplate.vue`
- `src/templates/pages/system/ErrorNotFoundTemplate.vue`
- `src/templates/pages/editor/EditorWorkbenchTemplate.vue`
- `src/templates/features/cms/authoring/CmsMediaAssetPicker.vue`
- `src/templates/features/reference-system/components/ReferenceReportStatusBadge.vue`
- `src/templates/features/reference-system/components/ReferenceContextRailPanel.vue`
- `src/templates/features/reference-system/components/ReferenceTopbarActions.vue`
- `src/templates/features/reference-system/components/ReferenceWhitelabelPresetCard.vue`
- `src/templates/runtime/router.ts`

**Changes:**
- move colors, gradients, opacity rules, and inline styles to `--ntk-*` / `--semantic-*` tokens
- expose theme swatches through CSS variables instead of TypeScript hardcodes
- neutralize `color="primary|negative|..."` usages where the bridge/tokens do not guarantee contrast yet
- reduce the bridge to a predictable alias layer with minimal and non-opinionated defaults

**Commands:**
- `npm run type-check`
- `npm test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/templates/ThemeSwitcherTokens.spec.ts tests/unit/templates/EditorWorkbenchTemplate.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts`

**Checkpoint:**
- tenant/theme switching updates all audited components without meaningful fixed visual islands
- `ThemeDotsSwitcher` and its previews do not depend on TypeScript hex hardcodes

**Current status:** complete for the approved white-label scope.

**Suggested commit:**
- `refactor(templates/theme): complete white-label tokenization`

---

### Slice 5 — Runtime Coverage And Visual Confidence

**Goal:** Provide automated confidence for the approved runtime and the most sensitive templates.

**Target paths:**
- `tests/unit/templates/TemplateRuntimeInteractions.spec.ts`
- `tests/unit/templates/ThemeSwitcherTokens.spec.ts`
- `tests/unit/templates/TemplateWhiteLabelAudit.spec.ts`
- `tests/e2e/template-runtime-flow.spec.ts`
- `tests/e2e/template-runtime-visual.spec.ts`
- `tests/e2e/template-runtime-screenshots.spec.ts`
- `tests/e2e/template-runtime-screenshots.spec.ts-snapshots/**`
- `.build/playwright-report/**`
- `.build/test-results/**`

**Changes:**
- add runtime E2E smoke coverage for login, logout, theme switcher, clients, orders, settings, and wiki/chat
- add visual regression coverage focused on the approved runtime and supported themes
- validate desktop and mobile shell-critical paths

**Commands:**
- `npm test -- tests/unit/templates/TemplateRuntimeInteractions.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/templates/ThemeSwitcherTokens.spec.ts`
- `npm run test:e2e -- --grep "template runtime"`

**Checkpoint:**
- the approved runtime has minimum flow and visual coverage to block obvious regressions

**Current status:** complete. Flow, preset visual certification, dark contrast, and screenshot-baseline coverage are implemented for the approved runtime matrix.

**Suggested commit:**
- `test(runtime): add flow and visual regression coverage`

---

### Slice 6 — Final Sweep, Documentation, And Closeout

**Goal:** Close the workstream with an approved runtime, aligned documentation, and clear release checkpoints.

**Target paths:**
- `planning/plans/completed/2026-04/2026-04-15-templates-100-functional-whitelabel-plan.md`
- `samples/README.md`
- `src/templates/README.md`
- `docs/knowledge-base/planning-reference/white-label-parameters-table.md` (update if needed)

**Changes:**
- record the final runtime state and any intentional limits that remain
- update template and approved-runtime documentation
- keep the archived plan in `planning/plans/completed/YYYY-MM/` because the workstream is closed

**Commands:**
- `npm run lint`
- `npm run type-check`
- `npm test`
- `npm run build:samples`

**Checkpoint:**
- no critical open item remains for the functional runtime or full white-label scope
- the plan is closed with validations recorded

**Current status:** complete; final validation passed and this plan is ready to live under `planning/plans/completed/YYYY-MM/`.

**Suggested commit:**
- `docs(templates): close 100 percent functional and white-label workstream`

---

## Validation Checklist

- `npm run lint`
- `npm run type-check` — passed on 2026-04-21
- `npm test -- tests/unit/composables/useTheme.spec.ts tests/unit/templates/ThemeSwitcherTokens.spec.ts` — passed on 2026-04-21
- `npm run build:samples` — passed on 2026-04-21
- `npx playwright test tests/e2e/template-runtime-screenshots.spec.ts tests/e2e/template-runtime-flow.spec.ts tests/e2e/template-runtime-visual.spec.ts tests/e2e/template-runtime-dark-theme-guardrails.spec.ts` — passed on 2026-04-21
- `npm test -- --testTimeout=30000` — passed on 2026-04-21; 119 files and 1396 tests passed
- `npm run lint` — passed on 2026-04-21 with 0 errors and 849 existing style warnings
- browser smoke on:
  - `http://127.0.0.1:4173/?template-runtime=1`
  - `http://127.0.0.1:4173/?template-runtime=1#/clients`
  - `http://127.0.0.1:4173/?template-runtime=1#/orders`
  - `http://127.0.0.1:4173/?template-runtime=1#/settings`
  - `http://127.0.0.1:4173/?template-runtime=1#/knowledge`

## Risks And Mitigation

- Runtime "100% functional" can become unbounded if it is treated as a complete product.
  - Mitigation: treat it as a complete local reference runtime with persistence and approved flows, not backend integration.
- Full tokenization can break contrast and visual consistency across themes.
  - Mitigation: add theme-level visual smoke coverage and prioritize the most visible components first.
- Overly strict guardrails can block valid `var(--token, fallback)` patterns.
  - Mitigation: separate prohibited hardcodes from acceptable fallbacks and keep the allowlist small and documented.

## Delivery Slices

- POC:
  - Slice 1
  - Slice 4 started on the most critical hardcodes
- Incremental:
  - Slice 2
  - Slice 3
  - remaining Slice 4 architecture guardrails
- Final:
  - Slice 5
  - Slice 6

## Closeout Expectations

- approved runtime without placeholder main routes
- auth, clients, orders, settings, wiki, and chat working with local persistence
- theme switching and branding responding through tokens, without meaningful hardcode dependency
- automated suite covering runtime functionality and white-label audit
- final closeout completed with the plan moved to `planning/plans/completed/YYYY-MM/`