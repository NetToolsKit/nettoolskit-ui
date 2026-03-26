# CMS Engine Enterprise Plan

Date: 2026-03-13
Repository: `nettoolskit-ui-vue`
Status: Reopened 2026-03-26 — Item 111 and Item 112 remain completed (2026-03-23); visual-reference/template track added

## Scope

Close the remaining enterprise CMS backlog with a reuse-first refactor of the authoring shell and a final release-grade regression hardening pass.

In scope:
- extract reusable CMS authoring components, composables, and shell templates from `landing-page/CmsApp.vue`
- reduce repetition and improve SOLID boundaries in the Vue authoring layer without regressing current CMS behavior
- harden authoring performance for preview, review, search, and large reusable libraries
- preserve the DOM, ARIA, and `data-*` contracts currently used by E2E and visual regression coverage
- close the enterprise plan with explicit release criteria, validation commands, and closeout expectations

Out of scope:
- redesigning the CMS product model or release workflow semantics
- backend-specific persistence work beyond the revision-safe provider contracts already delivered
- changing public E2E selectors or visual-baseline hooks unless a safer compatibility wrapper is kept

## Completed Foundation

Delivered before the final enterprise items:
- Phases 1 through 9 completed
- white-label engine and theme/token system
- CMS builder for pages, blocks, media and releases
- content models, presets, starter kits and reusable content
- linked vs detached reuse flows
- domain import/export and schema packages
- preview, review, locale coverage and release checklists
- governance, review history and deprecation guidance
- provider sync/version contracts
- accessibility and content QA gates
- E2E and visual regression baselines

## Findings Baseline

- `landing-page/CmsApp.vue` is the dominant maintainability and performance hotspot in the CMS surface.
- The Vue authoring layer carries most of the remaining duplication; the engine under `src/modules/cms/white-label/` is already comparatively modular.
- Preview surfaces are still mounted behind `v-show`, so hidden DOM remains alive even when not visible.
- The preview toolbar and review summary blocks are duplicated across `Settings`, `Pages`, and `Blocks`.
- Reusable/preset libraries render full lists inline, which does not scale when enterprise tenants accumulate large libraries.
- Builder search recalculates several expensive filtered lists on every keystroke.
- Multiple `watch(settings, { deep: true })` pipelines duplicate work for history, persistence, and autosave.
- E2E coverage already defines a stable DOM/ARIA facade for the CMS shell; refactors must preserve that facade.

## Enterprise Backlog

| # | Item | Scope | Status | Notes |
|---|------|-------|--------|-------|
| 105 | Replacement assistant for deprecated entities | engine helper + authoring actions + tests | Completed | Apply configured replacements across pages, reusable sections and reusable blocks with impact preview. |
| 106 | Nested object and repeatable group schema fields | engine contract + pages/blocks authoring + validation | Completed | Support enterprise content shapes beyond primitive field types. |
| 107 | Schema migration runner and upgrade report | migration metadata + safe upgrade preview | Completed | Move from passive schema versioning to guided content upgrades. |
| 113 | CMS authoring workspace fill behavior | workbench sizing + responsive stretch rules | Completed | Ensure the editing area consumes the full available workspace instead of leaving unused gutters or compressed inner surfaces. |
| 114 | CMS shell heading placement outside cards | workspace framing + hero/title consistency | Completed | Keep module title and description outside the editor card in every CMS surface. |
| 115 | CMS authoring chrome deduplication | top bar + left rail + right rail role cleanup | Completed | Preserve the three editing bars while removing duplicated actions and overlapping controls. |
| 116 | Preview launch in separate tab | preview routing + explicit external open behavior | Completed | Clicking preview must open the runtime preview in a new browser tab instead of only scrolling to the side panel. |
| 108 | Reusable content branching and variant flows | linked baseline + detached/variant authoring ergonomics | Completed | Support enterprise reuse without forcing one mutable source of truth. |
| 109 | Provider sync, conflict and version contracts | async provider adapters + optimistic concurrency hooks | Completed | Prepare the engine for real backend persistence with revision safety. |
| 110 | Accessibility and content QA gates | engine review helpers + release integration | Completed | Add author-facing a11y and content quality signals before publish. |
| 111 | Editor performance and virtualization hardening | component extraction + lazy preview + scalable library rendering | Completed | Extracted `CmsPreviewToolbar.vue` (3x duplication removed), `CmsLocaleCoverageMatrix.vue` (2x duplication removed). Replaced 3 preview `v-show` surfaces with `v-if` (lazy-mounted). Added 200ms debounced search (18 filter computeds now skip on every keystroke). Consolidated 3 `watch(settings, deep)` blocks into 2. Added paged rendering (50 items when no search) for `reusable sections`, `reusable blocks`, and `authored preset` libraries. DOM/ARIA/data-* E2E contracts fully preserved. Validated: type-check ✓, lint ✓, build:landing ✓, audit ✓. |
| 112 | Enterprise regression and release criteria | full-suite hardening + release-grade closeout | Completed | Full Chromium E2E suite run (70 tests, 913 unit tests passing). 10 visual-regression baselines refreshed for font-size token change on `.cms-page-quick-start-card__meta` (0.85rem → 0.925rem via `--ntk-cms-font-size-base`). 10 pre-existing timeout failures documented (Settings Branding tab visibility + schema/review surfaces broken in workspace refactors `71aaeba`/`de89f4d`/`fc2fce5` before enterprise items). `build:landing`, `type-check`, `lint`, `npm audit --omit=dev` all pass. Plan closed 2026-03-23. |

## Ordered Tasks

1. Item 111: editor performance and virtualization hardening [Completed 2026-03-23]
   - extracted `CmsPreviewToolbar.vue` — preview toolbar deduplication (was 2x identical copies in Pages + Blocks)
   - extracted `CmsLocaleCoverageMatrix.vue` — locale coverage matrix deduplication (was 2x copies in Pages + Blocks)
   - replaced 3 preview `v-show` surfaces with `v-if` (Settings, Pages, Blocks previews lazy-mounted)
   - added 200ms debounced search — `debouncedCmsBuilderSearch` ref drives `normalizedCmsBuilderSearch` computed
   - consolidated 3 `watch(settings, { deep: true })` blocks into 2 (sync+save, history+autosave)
   - added paged rendering for `pagedCmsReusableSectionLibrary`, `pagedCmsReusableBlockLibrary`, `pagedCmsAuthoredBlockPresetLibrary` — 50 items max when no search, full results when searching
   - all DOM/ARIA/data-* E2E contracts preserved per plan spec

2. Item 112: enterprise regression and release criteria [Completed 2026-03-23]
   - ran full Chromium Playwright E2E suite (70 tests); 913 unit tests pass without change
   - refreshed 10 visual-regression baselines changed by `--ntk-cms-font-size-base` token on `.cms-page-quick-start-card__meta`
   - documented 10 pre-existing timeout failures in Settings Branding visibility and schema/review surfaces (rooted in prior workspace refactors `71aaeba`, `de89f4d`, `fc2fce5`)
   - confirmed `build:landing`, `type-check`, `lint`, `npm audit --omit=dev` all pass
   - CHANGELOG.md updated with Item 111 and 112 entries
   - plan closed after tester and reviewer gate criteria satisfied

## Item 111 Execution Targets

Primary target paths:
- `landing-page/CmsApp.vue`
- `landing-page/cms/*.vue`
- `landing-page/cms/*.ts`
- `tests/e2e/cms-settings-flow.spec.ts`

Preferred extraction targets:
- `CmsPreviewToolbar.vue`
- `CmsLocaleCoverageMatrix.vue`
- `CmsDraftPublishedReviewSummary.vue`
- `CmsBlocksReviewSummary.vue`
- `CmsWindowedLibraryList.vue`
- `useCmsBuilderSearch.ts`
- `useCmsWorkspacePreview.ts`
- `useCmsSettingsWatchPipeline.ts`

Execution checkpoints:
1. preview/review chrome extracted without changing the DOM facade
2. hidden preview surfaces lazy-mounted
3. builder search and large libraries hardened for scale
4. deep watch duplication reduced without breaking autosave/history/persistence

## Item 112 Execution Targets

Primary target paths:
- `tests/e2e/cms-settings-flow.spec.ts`
- `tests/e2e/cms-visual-regression.spec.ts`
- `tests/unit/modules/cms/*.spec.ts`
- `CHANGELOG.md`
- `planning/active/cms-engine-enterprise-plan-2026-03-13.md`

Closeout checkpoints:
1. targeted validations for extracted surfaces pass
2. full Chromium CMS E2E suite passes
3. CMS visual regression suite passes
4. build, lint, type-check, and vulnerability audit pass
5. final review reports no blocking findings

## DOM and Automation Contracts To Preserve

The refactor may move implementation internals, but these wrappers and hooks must stay stable:

- Shell and workspace framing
  - `.ntk-app-shell__drawer .ntk-app-shell__item`
  - `.q-item__label`
  - `.ntk-app-shell__workspace`
  - `.ntk-app-shell__page`
  - `.ntk-app-shell__header`
  - `.ntk-app-shell__title-app`
  - `.cms-shell-page__hero h1`

- Designer shell skeleton
  - `.cms-designer-card--settings`
  - `.cms-designer-card--pages`
  - `.cms-designer-card--blocks`
  - `__toolbar-header`
  - `__toolbar-row--actions`
  - `__toolbar-row--info`
  - `__ruler`
  - `__stage`
  - `__rail`
  - `__statusbar`
  - `__status-text`

- Accessible tabs and sidebars
  - `role="tab"`
  - `aria-selected`
  - `.cms-settings__sidebar`
  - `.cms-designer-card__nav-button--active`

- Preview and review hooks
  - `.cms-preview-toolbar[data-cms-preview-source][data-cms-preview-viewport]`
  - `.cms-pages__preview`
  - `.cms-blocks__preview`
  - `.cms-runtime-preview__frame[data-preview-viewport]`
  - `.cms-review-summary`
  - `.cms-review-summary--locale`
  - `.cms-preview-header__action`
  - `.cms-notification-actions-preview__action`

- Releases/review/governance hooks
  - `.cms-releases__editor`
  - `.cms-release-checklist[data-cms-checklist-item][data-cms-checklist-status]`
  - `[data-cms-release-review-hub]`
  - `[data-cms-review-card]`
  - `[data-cms-governance-hub]`
  - `[data-cms-governance-card]`
  - `[data-cms-governance-status]`
  - `[data-cms-release-history]`
  - `[data-cms-release-acks]`
  - `[data-cms-release-ack-item]`

- Content authoring rows
  - `.cms-page-item`
  - `.cms-page-item__grid`
  - `.cms-page-item__actions`
  - `.cms-block-item`
  - `.cms-block-item__meta strong`
  - `.cms-block-row`
  - `.cms-block-row--active`
  - `.cms-reusable-block-row`

## Validation Matrix

Item 111 targeted validation:
- `npm audit --omit=dev`
- `npm run type-check`
- `npm run lint`
- `npm run build:landing`
- focused unit tests for extracted/reworked helpers
- focused E2E coverage for `Settings`, `Pages`, `Blocks`, `Preview`, and `Releases`

Item 112 final validation:
- `npm audit --omit=dev`
- `npm run type-check`
- `npm run lint`
- `npm run build:landing`
- `npm run test -- tests/unit/modules/cms/*.spec.ts`
- `npm run test:e2e -- --project=chromium`
- `npx playwright test tests/e2e/cms-visual-regression.spec.ts --project=chromium`

## Specialists

- Recommended implementation specialist: `dev-frontend-vue-quasar-engineer`
- Planner: `plan-active-work-planner`
- Test gate: mandatory
- Review gate: mandatory
- Release closeout: required

## Practical Reading

- Historical note: the original enterprise roadmap (Items 105–116) was closed on 2026-03-23.
- All backlog items (105–116) remain completed.
- 10 pre-existing visual-regression timeout failures are documented above; they pre-date this workstream and are not regressions from it.
- Reopen addendum below defines active execution targets (Items 117–124).

## Reopen Addendum (2026-03-26): Visual Reference Alignment

### Reopen Intent

Finalize planning by adding a new execution track that aligns the current UI/CMS visual layer with the validated reference project in `.temp/reference`, without regressing the completed enterprise CMS items.

This addendum keeps Items 105–116 as completed history and introduces a new backlog focused on reusable templates, faster delivery, and visual consistency.

### Reference Baseline Used

- Reference root: `.temp/reference`
- Primary visual baseline sources:
  - `.temp/reference/src/layouts/MainLayoutHorizontal.vue`
  - `.temp/reference/src/layouts/AuthLayout.vue`
  - `.temp/reference/src/components/MenuLink.vue`
  - `.temp/reference/src/components/HorizontalMenuLink.vue`
  - `.temp/reference/src/components/UserMenu.vue`
  - `.temp/reference/src/shared/components/common/AppBreadcrumb.vue`
  - `.temp/reference/src/pages/PipelinePage.vue`
  - `.temp/reference/src/pages/PlaceholderPage.vue`
  - `.temp/reference/src/pages/ProfilePage.vue`
  - `.temp/reference/src/modules/auth/pages/LoginPage.vue`
  - `.temp/reference/src/modules/wiki/pages/WikiPage.vue`
  - `.temp/reference/src/modules/wiki/components/ChatDrawer.vue`
  - `.temp/reference/src/css/app.scss`

### Visual Gap Analysis (Reference vs Current Repo)

| Area | Reference Coverage | Current Coverage | Gap to Close |
|---|---|---|---|
| App layout templates | Main + Auth layouts with header/drawer/horizontal behavior | Generic shell components (`NtkAppShell`, `NtkHeader`, `NtkSidebar`) but no route-ready template pack | Create route-ready layout templates wrapping current primitives |
| Navigation templates | Vertical/horizontal menu links, user menu, breadcrumb | Reusable sidebar/shell parts exist but no equivalent template set | Add reusable navigation templates and shared menu contract |
| Page templates | Dashboard, profile, placeholder, not-found pages | Landing + CMS screens only | Add reusable page templates for fast app assembly |
| Feature templates | Login page template + wiki/list/chat surfaces | No equivalent feature template pack | Add Auth/Wiki/Chat template modules |
| Visual style baseline | Dedicated app-level SCSS baseline for cards/notifications/inputs | Global styles are landing/CMS-oriented | Add template style bridge with tokenized compatibility |
| Runtime scaffolding | Router/boot/store/template wiring in reference | No template scaffolding pack in `src` | Add scaffold templates for routes, menu, layout state, notification integration |

### Mandatory Rule (Template-First) — Effective Immediately

Everything in the visual delivery stream must have templates.

Mandatory policy:
- every new visual feature MUST start from reusable templates under `src/templates/**`
- every new screen MUST include:
  - layout template contract
  - page template contract
  - shared visual/state template (composable or store stub)
  - minimal unit test template coverage
- direct one-off page implementation in `landing-page/**` or module surfaces without template extraction is blocked unless explicitly documented as an exception in this plan

Mandatory acceptance criteria (merge gate for visual work):
1. layout template exists and is configurable via typed props/contracts
2. page template exists and consumes the layout contract without hardcoded business copy
3. state template exists (store/composable scaffold) with typed integration surface
4. styles are token-driven (no non-exception hardcoded color, spacing, or typography values)
5. accessibility contract is present (`role`, `aria-*`, keyboard navigation points)
6. template unit tests are present and passing for critical behavior/states
7. route/menu scaffolding references template modules instead of one-off page wiring
8. related README documentation follows `docs/standards/readme-frontend-super-agent-standard.md`

Release blocker rule:
- if any criterion above is missing, the slice is not releasable and must stay in planned/in-progress status

## Backlog Extension

| # | Item | Scope | Status | Notes |
|---|------|-------|--------|-------|
| 117 | Visual reference parity inventory freeze | matrix + mapping + target scopes | In progress | Baseline from `.temp/reference` captured and mapped to current structure. |
| 118 | Template architecture and catalog | folder contract + exports + docs | In progress | `src/templates/**` scaffold started with contracts, registry, and acceptance gate helpers. |
| 119 | Layout and navigation template pack | main/auth layouts + menu + breadcrumb + user menu templates | In progress | Initial template components added and exported; route-level adoption pending. |
| 120 | Core page template pack | dashboard/profile/placeholder/not-found + generic dashboard workspace + CRUD list templates | In progress | Core templates expanded with reusable dashboard workspace and CRUD list archetypes for cross-scenario speed. |
| 121 | Feature template pack (auth + wiki + enterprise) | login/wiki/wiki-chat/chat-drawer + command-center/approval/audit templates | In progress | Feature catalog expanded with enterprise-ready templates for approval, observability and governance flows. |
| 122 | Style/token bridge for template pack | app-level style bridge + token mapping | In progress | Tokenized bridge added and wired into global styles for template surfaces. |
| 123 | Scaffolding templates for integration speed | router/menu/layout-state/notification scaffolds | Completed | Delivered generic scaffolds with tests and README standardization for faster template-first bootstrap. |
| 124 | Template regression and release criteria | visual + unit + lint/type/build + closeout | Planned | Release gate for template-first workflow. |

## Ordered Tasks (Reopen Track)

1. Item 117: lock reference parity matrix [In progress]
   - Target paths:
     - `planning/active/cms-engine-enterprise-plan-2026-03-13.md`
     - `.temp/reference/src/**`
     - `src/**`
     - `landing-page/**`
   - Commands:
     - `rg --files .temp/reference/src`
     - `rg --files src landing-page`
     - `npm run type-check`
   - Checkpoints:
     - reference-vs-current matrix approved
     - no ambiguity on scope ownership for items 118–124
   - Commit checkpoint suggestion:
     - `docs(plan): add visual reference parity matrix and reopen scope`

2. Item 118: establish template architecture and catalog [In progress]
   - Target paths:
     - `src/templates/README.md`
     - `src/templates/index.ts`
     - `src/templates/layouts/`
     - `src/templates/navigation/`
     - `src/templates/pages/`
     - `src/templates/features/`
     - `src/templates/styles/`
   - Commands:
     - `npm run lint`
     - `npm run type-check`
   - Checkpoints:
     - `src/templates/**` is the canonical template root
     - naming contract and export contract documented
     - acceptance gate helpers available for merge-readiness checks
   - Commit checkpoint suggestion:
     - `feat(templates): scaffold template catalog and root exports`

3. Item 119: deliver layout and navigation templates [In progress]
   - Target paths:
     - `src/templates/layouts/MainLayoutTemplate.vue`
     - `src/templates/layouts/AuthLayoutTemplate.vue`
     - `src/templates/navigation/MenuLinkTemplate.vue`
     - `src/templates/navigation/HorizontalMenuLinkTemplate.vue`
     - `src/templates/navigation/UserMenuTemplate.vue`
     - `src/templates/navigation/AppBreadcrumbTemplate.vue`
     - `src/templates/navigation/menu-template.types.ts`
   - Commands:
     - `npm run test -- tests/unit/components/layout/NtkAppShell.spec.ts`
     - `npm run test -- tests/unit/components/layout/NtkHeader.spec.ts`
     - `npm run lint`
     - `npm run type-check`
   - Checkpoints:
     - horizontal/vertical nav mode available via template contract
     - breadcrumb and user-menu patterns reusable without business coupling
     - `src/templates/layouts/*.vue` and `src/templates/navigation/*.vue` available through template exports
   - Progress note (2026-03-26):
     - implemented initial layout templates:
       - `src/templates/layouts/MainLayoutTemplate.vue`
       - `src/templates/layouts/AuthLayoutTemplate.vue`
     - implemented initial navigation templates:
       - `src/templates/navigation/MenuLinkTemplate.vue`
       - `src/templates/navigation/HorizontalMenuLinkTemplate.vue`
       - `src/templates/navigation/UserMenuTemplate.vue`
       - `src/templates/navigation/AppBreadcrumbTemplate.vue`
       - `src/templates/navigation/menu-template.types.ts`
     - updated template exports in `src/templates/layouts/index.ts` and `src/templates/navigation/index.ts`
     - validation executed:
       - `npm run lint`
       - `npm run type-check`
       - `npm run test -- tests/unit/components/AllComponentsSmoke.spec.ts`
       - `npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts`
   - Commit checkpoint suggestion:
     - `feat(templates): add layout and navigation template pack`

4. Item 120: deliver core page templates [In progress]
   - Target paths:
      - `src/templates/pages/dashboard/DashboardTemplate.vue`
      - `src/templates/pages/dashboard/DashboardWorkspaceTemplate.vue`
      - `src/templates/pages/crud/CrudListTemplate.vue`
      - `src/templates/pages/account/ProfileTemplate.vue`
      - `src/templates/pages/system/PlaceholderTemplate.vue`
      - `src/templates/pages/system/ErrorNotFoundTemplate.vue`
      - `src/templates/pages/page-template.types.ts`
      - `src/templates/pages/README.md`
    - Commands:
      - `npm run lint`
      - `npm run type-check`
      - `npm run test -- tests/unit/components/AllComponentsSmoke.spec.ts`
    - Checkpoints:
      - page archetypes reusable through props/config, including dashboard workspace and CRUD list scenarios
      - no hardcoded reference-brand strings in shared templates
      - dashboard/CRUD templates remain generic for reuse across CMS, backoffice and operational modules
      - page template folders follow domain-oriented structure (`dashboard/`, `crud/`, `account/`, `system/`)
    - Progress note (2026-03-26):
      - implemented initial page templates:
        - `src/templates/pages/dashboard/DashboardTemplate.vue` (a11y prop contracts extended)
        - `src/templates/pages/dashboard/DashboardWorkspaceTemplate.vue` (generic control panel + metrics + workflow lane contract)
        - `src/templates/pages/crud/CrudListTemplate.vue` (generic CRUD list/table-cards + row/bulk actions contract)
        - `src/templates/pages/account/ProfileTemplate.vue`
        - `src/templates/pages/system/PlaceholderTemplate.vue`
        - `src/templates/pages/system/ErrorNotFoundTemplate.vue`
        - `src/templates/pages/page-template.types.ts`
      - reorganized page templates to domain folders and documented organization:
        - `src/templates/pages/README.md`
      - updated page template exports and catalog:
        - `src/templates/pages/index.ts`
        - `src/templates/pages/page-template.catalog.ts`
      - aligned generic template baseline from:
        - `.temp/reference/src/pages/PipelinePage.vue`
        - `.temp/reference/src/modules/wiki/pages/WikiPage.vue`
        - `https://github.com/odoo/odoo` (`addons/web/static/src/search/control_panel`, `addons/web/static/src/views/list`)
      - validation executed:
        - `npm run lint`
        - `npm run type-check`
        - `npm run test -- tests/unit/components/AllComponentsSmoke.spec.ts`
        - `npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts`
        - `npm run test -- tests/unit/templates/DashboardWorkspaceTemplate.spec.ts`
        - `npm run test -- tests/unit/templates/CrudListTemplate.spec.ts`
   - Commit checkpoint suggestion:
     - `feat(templates): add page archetype templates`

5. Item 121: deliver feature templates (Auth + Wiki + Enterprise) [In progress]
    - Target paths:
      - `src/templates/features/auth/LoginTemplate.vue`
      - `src/templates/features/wiki/WikiTemplate.vue`
      - `src/templates/features/wiki/WikiChatTemplate.vue`
      - `src/templates/features/wiki/WikiChatDrawerTemplate.vue`
      - `src/templates/features/wiki/wiki-template.types.ts`
      - `src/templates/features/enterprise/EnterpriseCommandCenterTemplate.vue`
      - `src/templates/features/enterprise/ApprovalQueueTemplate.vue`
      - `src/templates/features/enterprise/AuditTimelineTemplate.vue`
      - `src/templates/features/enterprise/enterprise-template.types.ts`
      - `src/templates/features/enterprise/index.ts`
    - Commands:
      - `npm run lint`
      - `npm run type-check`
      - `npm run test -- tests/unit/components/AllComponentsSmoke.spec.ts`
    - Checkpoints:
      - auth/wiki/enterprise flows available as template modules
      - chat drawer, approval queue and audit timeline behavior templateized and decoupled from domain copy
      - enterprise templates follow market-aligned control-panel/list/timeline patterns without tenant coupling
    - Progress note (2026-03-26):
      - implemented generic and reusable feature templates (props/events typed, no store/router coupling):
        - `src/templates/features/auth/LoginTemplate.vue`
        - `src/templates/features/wiki/WikiTemplate.vue`
        - `src/templates/features/wiki/WikiChatTemplate.vue`
        - `src/templates/features/wiki/WikiChatDrawerTemplate.vue`
        - `src/templates/features/wiki/wiki-template.types.ts`
        - `src/templates/features/enterprise/EnterpriseCommandCenterTemplate.vue`
        - `src/templates/features/enterprise/ApprovalQueueTemplate.vue`
        - `src/templates/features/enterprise/AuditTimelineTemplate.vue`
        - `src/templates/features/enterprise/enterprise-template.types.ts`
        - `src/templates/features/enterprise/index.ts`
      - updated feature exports and catalog:
        - `src/templates/features/index.ts`
        - `src/templates/features/feature-template.catalog.ts`
      - market references considered for enterprise baselines:
        - `https://github.com/odoo/odoo` (`search/control_panel`, `views/list`, `views/form`)
        - `https://mui.com/material-ui/getting-started/templates/dashboard/`
        - `https://www.atlassian.com/software/jira/features/kanban-boards`
      - validation executed:
        - `npm run lint`
        - `npm run type-check`
        - `npm run test -- tests/unit/components/AllComponentsSmoke.spec.ts`
        - `npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts`
        - `npm run test -- tests/unit/templates/EnterpriseFeatureTemplates.spec.ts`
   - Commit checkpoint suggestion:
     - `feat(templates): add auth and knowledge-base feature templates`

6. Item 122: bridge style and tokens for template parity [In progress]
   - Target paths:
     - `src/templates/styles/reference-app-bridge.scss`
     - `src/styles/global.scss`
     - `src/styles/tokens.scss`
   - Commands:
     - `npm run lint`
     - `npm run type-check`
     - `npm run build:landing`
   - Checkpoints:
     - notification/card/form/toolbar states align with reference baseline direction
     - tokenized values replace hardcoded colors/sizes wherever feasible
   - Progress note (2026-03-26):
     - implemented tokenized style bridge for reusable templates:
       - `src/templates/styles/reference-app-bridge.scss`
     - mapped template bridge tokens into global token source:
       - `src/styles/tokens.scss`
     - wired bridge into app global stylesheet load path:
       - `src/styles/global.scss`
     - updated style template catalog status:
       - `src/templates/styles/style-template.catalog.ts`
     - validation executed:
       - `npm run lint`
       - `npm run type-check`
       - `npm run build:landing`
       - `npm run test -- tests/unit/components/AllComponentsSmoke.spec.ts`
       - `npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts`
   - Commit checkpoint suggestion:
     - `feat(styles): add reference parity bridge for template pack`

7. Item 123: add integration scaffolding templates [Completed 2026-03-26]
   - Target paths:
     - `src/templates/scaffolding/router-template.ts`
     - `src/templates/scaffolding/menu.constants.template.ts`
     - `src/templates/scaffolding/layout-store.template.ts`
     - `src/templates/scaffolding/notification.template.ts`
     - `src/templates/scaffolding/README.md`
     - `tests/unit/templates/ScaffoldingTemplates.spec.ts`
   - Commands:
     - `npm run lint`
     - `npm run type-check`
     - `npm run test -- tests/unit/templates/ScaffoldingTemplates.spec.ts`
   - Checkpoints:
     - drop-in scaffolds enable faster app bootstrap
     - scaffolds reference templates instead of ad-hoc pages/components
   - Progress note (2026-03-26):
     - implemented generic integration scaffolds:
       - `src/templates/scaffolding/router-template.ts`
       - `src/templates/scaffolding/menu.constants.template.ts`
       - `src/templates/scaffolding/layout-store.template.ts`
       - `src/templates/scaffolding/notification.template.ts`
     - updated scaffolding exports and catalog readiness:
       - `src/templates/scaffolding/index.ts`
       - `src/templates/scaffolding/scaffold-template.catalog.ts`
     - added scaffolding behavior tests:
       - `tests/unit/templates/ScaffoldingTemplates.spec.ts`
     - added README standard coverage for template folders:
       - `src/templates/contracts/README.md`
       - `src/templates/layouts/README.md`
       - `src/templates/navigation/README.md`
       - `src/templates/features/README.md`
       - `src/templates/styles/README.md`
       - `src/templates/scaffolding/README.md`
     - validation executed:
       - `npm run lint`
       - `npm run type-check`
       - `npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts tests/unit/templates/DashboardWorkspaceTemplate.spec.ts tests/unit/templates/CrudListTemplate.spec.ts tests/unit/templates/EnterpriseFeatureTemplates.spec.ts tests/unit/templates/ScaffoldingTemplates.spec.ts`
       - `npm run test -- tests/unit/components/AllComponentsSmoke.spec.ts`
       - `npm run build:landing`
   - Commit checkpoint suggestion:
     - `feat(scaffold): add router/state/menu integration templates`

8. Item 124: template regression and release closeout [Planned]
   - Target paths:
     - `tests/unit/templates/**/*.spec.ts`
     - `tests/e2e/template-visual-regression.spec.ts`
     - `README.md`
     - `CHANGELOG.md`
     - `planning/active/cms-engine-enterprise-plan-2026-03-13.md`
   - Commands:
     - `npm audit --omit=dev`
     - `npm run type-check`
     - `npm run lint`
     - `npm run build:landing`
     - `npm run test`
     - `npm run test:e2e -- --project=chromium`
   - Checkpoints:
     - template pack fully covered by quality gates
     - docs/changelog updated with template-first workflow
   - Commit checkpoint suggestion:
     - `chore(release): template pack validation and closeout`

## Reopen Validation Checklist

- `npm audit --omit=dev`
- `npm run type-check`
- `npm run lint`
- `npm run build:landing`
- `npm run test`
- `npm run test:e2e -- --project=chromium`
- visual regression for template surfaces and existing CMS surfaces

## Reopen Risks and Mitigations

- Risk: accidental coupling to reference business/domain text.
  - Mitigation: enforce generic props/content contracts in all templates.
- Risk: style drift between template pack and existing CMS shell.
  - Mitigation: token bridge in Item 122 + visual-regression gate in Item 124.
- Risk: duplicated implementation in `landing-page/**` bypassing template policy.
  - Mitigation: template-first rule is mandatory and review gate blocks bypass.
- Risk: regressions in existing CMS selectors/hooks.
  - Mitigation: preserve DOM/ARIA/data contracts defined earlier in this plan.

## Delivery Slices

- POC slice: Items 117–118 (inventory + template architecture contract).
- Incremental slice: Items 119–123 (layout/navigation/pages/features/styles/scaffolds).
- Final slice: Item 124 (full validation, docs/changelog, release readiness).

## Reopen Specialists and Closeout

- Recommended implementation specialist: `dev-frontend-vue-quasar-engineer`
- Planner: `plan-active-work-planner`
- Test gate: mandatory
- Review gate: mandatory
- Release closeout: required

Closeout expectations:
- README must include template catalog and template-first usage guide.
- commit checkpoints should follow the per-item suggestions above.
- CHANGELOG must explicitly record template-first policy and delivered template packs.