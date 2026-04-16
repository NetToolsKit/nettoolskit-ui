# Vue Quasar Visual Architecture Replatform Plan

Date: 2026-04-16
Branch: `feat/remove-cms-whitelabel-reference-2026-04-01`
Status: active

## Scope Summary

Recover the template runtime visual architecture so color, contrast, popup surfaces, tables, forms, menus, and layout shells follow the official Vue + Quasar model instead of a growing patch layer.

This workstream is explicitly frontend-only:
- no backend integration work
- no runtime productization beyond visual and layout correctness
- focus on theme architecture, layout architecture, contrast safety, and visual regression confidence

## Relationship To The Templates Functional Plan

This plan is the visual-architecture dependency for `planning/active/templates-100-functional-whitelabel-plan-2026-04-15.md`.

It owns the frontend visual recovery scope that was previously spread across the older plan's white-label, visual regression, and visual closeout slices. Runtime-local functionality, placeholder replacement, and non-visual release completion remain owned by the older plan.

To avoid duplicate execution:
- use this plan for theme, token, popup, layout, contrast, and preset-certification work
- use the older plan for runtime functionality, local data flows, and final umbrella closeout
- do not reopen visual tokenization or visual regression tasks in the older plan once they are tracked here

## Official Reference Stack

These links are the source of truth for the workstream:
- Quasar Dark Mode: https://quasar.dev/style/dark-mode
- Quasar Dark Plugin: https://quasar.dev/quasar-plugins/dark/
- Quasar Body Classes: https://quasar.dev/style/body-classes/
- Quasar Color Palette And Brand Colors: https://quasar.dev/style/color-palette/
- Quasar Sass And SCSS Variables: https://quasar.dev/style/sass-scss-variables/
- Quasar QMenu: https://quasar.dev/vue-components/menu/
- Quasar QDialog: https://quasar.dev/vue-components/dialog/
- Quasar QSelect: https://quasar.dev/vue-components/select/
- Quasar QDrawer: https://quasar.dev/layout/drawer/
- Quasar QPage And QPageContainer: https://quasar.dev/layout/page/
- Vue SFC CSS Features: https://vuejs.org/api/sfc-css-features
- Vue Teleport: https://vuejs.org/guide/built-ins/teleport.html

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Tester: mandatory
- Reviewer: mandatory before merge
- Release closeout: required at the end of the workstream

---

## Ordered Tasks

### Slice 1 — Official Baseline And Architecture Contract

**Goal:** Make Quasar the source of truth for mode and brand palette, then map NTK aliases on top of it.

**Target paths:**
- `src/composables/useThemeSwitcher.ts`
- `src/styles/themes.css`
- `src/modules/cms/white-label/authoring/theme-runtime.ts`
- `src/whitelabel/runtime.ts`

**Changes:**
- define a clear token hierarchy: Quasar brand tokens -> NTK aliases -> component tokens
- drive mode only through Quasar-compatible dark and light state
- remove contradictory fallback chains that generate light surfaces inside dark presets
- document which tokens are allowed to set raw colors and which must only alias upstream tokens

**Commands:**
- `npm run type-check`
- `npm test -- tests/unit/templates/ThemeSwitcherTokens.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/utils/whitelabel.spec.ts`

**Checkpoint:**
- switching between light and dark presets always updates Quasar-compatible mode state
- brand tokens and NTK aliases no longer disagree on background or text direction

**Suggested commit:**
- `refactor(theme): align quasar mode and brand token hierarchy`

---

### Slice 2 — Teleport And Popup Surface Unification

**Goal:** Theme every portalized Quasar surface through one predictable global layer.

**Target paths:**
- `src/templates/styles/reference-app-bridge.scss`
- `src/templates/features/reference-system/components/ReferenceTopbarActions.vue`
- `src/templates/features/reference-system/components/ReferencePresetSelectorBar.vue`
- `src/templates/features/cms/authoring/CmsEntityUsageDrawer.vue`
- `src/templates/styles/cms-authoring-reference.css`

**Changes:**
- create a single popup and dialog surface strategy for `QMenu`, `QDialog`, `QPopupProxy`, `QSelect`, and tooltips
- stop relying on local container CSS for teleported content
- normalize popup text, muted text, separators, list items, cards, table containers, and focus states
- use explicit popup classes only where Quasar requires routing a style hook into teleported content

**Commands:**
- `npm run type-check`
- `npm test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts`
- `npx playwright test tests/e2e/template-runtime-dark-theme-guardrails.spec.ts`

**Checkpoint:**
- menus, selects, dialogs, drawers, and tooltips render with correct contrast in dark presets
- no popup surface falls back to white unless the preset is explicitly light

**Suggested commit:**
- `fix(theme): unify teleported popup and dialog surfaces`

---

### Slice 3 — Layout Rebuild To Official Quasar Pattern

**Goal:** Reduce layout-specific overrides and follow `QLayout`, `QDrawer`, `QPageContainer`, and `QPage` more directly.

**Target paths:**
- `src/templates/layouts/MainLayoutTemplate.vue`
- `src/templates/navigation/MenuLinkTemplate.vue`
- `src/templates/navigation/HorizontalMenuLinkTemplate.vue`
- `src/templates/navigation/UserMenuTemplate.vue`
- `src/templates/runtime/TemplateRuntimeApp.vue`

**Changes:**
- simplify drawer, topbar, and page-shell styling around official Quasar layout primitives
- remove color derivations based on the wrong semantic source such as text-on-accent for navigation surfaces
- ensure side navigation, horizontal navigation, and user menu all inherit from the same shell contract
- verify mobile and desktop layout variants against the same token stack

**Commands:**
- `npm run type-check`
- `npm test -- tests/unit/templates/ProfileAndLayoutTemplates.spec.ts tests/unit/templates/NavigationAndAuthTemplates.spec.ts tests/unit/templates/TemplateRuntimeRouter.spec.ts`

**Checkpoint:**
- drawer and header surfaces keep consistent contrast across approved presets
- layout behavior no longer depends on brittle per-component overrides

**Suggested commit:**
- `refactor(layout): normalize runtime shell to quasar layout patterns`

---

### Slice 4 — Surface And Data Display Normalization

**Goal:** Eliminate high-risk light-on-light and dark-on-dark bugs from template surfaces.

**Target paths:**
- `src/templates/features/auth/LoginTemplate.vue`
- `src/templates/pages/account/ProfileTemplate.vue`
- `src/templates/pages/dashboard/DashboardTemplate.vue`
- `src/templates/features/enterprise/EnterpriseCommandCenterTemplate.vue`
- `src/templates/features/wiki/WikiChatTemplate.vue`
- `src/templates/features/wiki/WikiChatDrawerTemplate.vue`
- `src/templates/pages/system/PlaceholderTemplate.vue`

**Changes:**
- audit inputs, cards, tables, empty states, badges, captions, and helper text
- remove residual hardcoded light backgrounds and low-contrast text fallbacks
- align table surfaces and row states with the shared surface tokens
- ensure every template page consumes the same page, card, input, and popup token families

**Commands:**
- `npm run type-check`
- `npm test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/templates/NavigationAndAuthTemplates.spec.ts tests/unit/templates/DashboardTemplate.spec.ts tests/unit/templates/WikiTemplates.spec.ts`

**Checkpoint:**
- dark presets do not show white cards with pale text or pale tables on pale backgrounds
- common page templates pass a manual contrast sweep and automated token audit

**Suggested commit:**
- `fix(templates): resolve dark theme contrast and surface regressions`

---

### Slice 5 — Theme Preset Certification

**Goal:** Turn the recovered visual architecture into guardrails that catch theme regressions early.

**Target paths:**
- `tests/e2e/template-runtime-dark-theme-guardrails.spec.ts`
- `tests/e2e/template-runtime-visual.spec.ts`
- `tests/unit/templates/TemplateWhiteLabelAudit.spec.ts`
- `.build/playwright-report/**`
- `.build/test-results/**`

**Changes:**
- expand visual coverage for `Warp`, `Resend`, `Revolut`, and `Claude`
- capture contrast-critical surfaces: login, dashboard, navigation, CRUD tables, popup surfaces, and profile shell
- add assertions for body classes, popup surfaces, and page-level contrast invariants
- keep snapshots and reports inside `.build`

**Commands:**
- `npm test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/templates/ThemeSwitcherTokens.spec.ts`
- `npm run test:e2e -- --grep "template runtime|dark theme|visual"`

**Checkpoint:**
- preset changes are visually guarded in the highest-risk screens
- theme regressions fail in CI before merge

**Suggested commit:**
- `test(theme): add preset visual regression matrix`

---

### Slice 6 — Regression Guardrails And Documentation

**Goal:** Close the workstream with explicit documentation and a stable operating model for future visual changes.

**Target paths:**
- `README.md`
- `planning/active/vue-quasar-visual-architecture-replatform-2026-04-16.md`
- `planning/completed/vue-quasar-visual-architecture-replatform-2026-04-16.md`
- `planning/reference/white-label-parameters-table.md`

**Changes:**
- keep the official Vue and Quasar links in the repository README
- record the final token hierarchy and the popup/layout styling rules
- move the plan to `planning/completed` when the regression matrix is green
- leave a short maintenance note telling future contributors to prefer official Quasar layout and theme patterns over local ad hoc overrides

**Commands:**
- `npm run lint`
- `npm run type-check`
- `npm test`
- `npm run build:samples`

**Checkpoint:**
- the repo documents the source of truth for visual decisions
- future theme and layout work starts from the documented architecture instead of rediscovery

**Suggested commit:**
- `docs(theme): close official quasar and vue recovery workstream`

---

## Validation Checklist

- `npm run lint`
- `npm run type-check`
- `npm test`
- `npm run build:samples`
- `npm run test:e2e -- --grep "template runtime|dark theme|visual"`
- browser smoke on:
  - `http://127.0.0.1:4173/?template-runtime=1`
  - `http://127.0.0.1:4173/?template-runtime=1#/login`
  - `http://127.0.0.1:4173/?template-runtime=1#/clients`
  - `http://127.0.0.1:4173/?template-runtime=1#/knowledge`

## Risks And Mitigation

- Quasar and NTK tokens may continue to drift if both remain writable sources of truth.
  - Mitigation: restrict raw colors to the brand layer and make downstream tokens aliases only.
- Teleported surfaces can still escape local styles if a component bypasses the shared popup layer.
  - Mitigation: audit popup-capable components and require explicit popup hooks where Quasar exposes them.
- Visual cleanup can regress layout behavior on mobile.
  - Mitigation: validate drawer, header, and page shells in both desktop and mobile breakpoints.
- Incremental fixes can look correct in a cached build while the actual bundle is stale.
  - Mitigation: validate with fresh sample builds and cache-busted preview URLs during manual review.

## Definition Of Done

- dark and light presets render menus, dialogs, selects, tables, cards, and forms with stable contrast
- Quasar is the mode and brand baseline for the runtime shell
- teleported surfaces follow one global theme strategy
- README contains the official Vue and Quasar references used as source of truth
- automated unit and E2E guardrails cover the highest-risk preset regressions

## Closeout Expectations

- final README update preserved
- final plan moved from `planning/active` to `planning/completed`
- commit message references theme/layout recovery explicitly
- no backend or integration scope included in the visual closeout
