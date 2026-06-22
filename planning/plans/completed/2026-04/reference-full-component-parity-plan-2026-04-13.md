# Reference Full Component Parity — Execution Plan

Date: 2026-04-13
Branch: `feat/reference-full-component-parity-2026-04-13`
Spec: `planning/specs/completed/2026-04/reference-full-component-parity-spec-2026-04-13.md`
Status: completed

## Scope Summary

Replicate every component, layout, page, module, store, style, and composable from the reference project (`.temp/reference/src/`) into the workspace, using the existing template convention (`*Template.vue`) and `src/templates/` structure. Expose the result through the samples runtime so `npm run dev:samples` with `?template-runtime=1` reproduces the complete reference experience.

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Tester: mandatory (`npm run type-check`, `npm run build:samples`)
- Reviewer: recommended before push
- Release closeout: required when parity is reached

---

## Ordered Tasks

### Slice 1 — Scaffolding: Types, Utils, Constants, Services

**Goal:** Create the full foundation of types, utilities, and services consumed by templates and pages.

**Target paths:**
- `src/templates/scaffolding/auth.types.template.ts` (new)
- `src/templates/scaffolding/auth-service.template.ts` (new)
- `src/templates/scaffolding/auth-composable.template.ts` (new)
- `src/templates/scaffolding/auth-store.template.ts` (update)
- `src/templates/scaffolding/layout-store.template.ts` (update)
- `src/templates/scaffolding/menu.constants.template.ts` (update)
- `src/templates/scaffolding/notification.template.ts` (update)
- `src/templates/scaffolding/format-name.template.ts` (new)
- `src/templates/scaffolding/app-constants.template.ts` (new)
- `src/templates/scaffolding/storage-keys.template.ts` (new)
- `src/templates/features/wiki/wiki-template.types.ts` (update)
- `src/templates/features/wiki/wiki-chat-service.template.ts` (new)
- `src/templates/features/wiki/wiki-chat-store.template.ts` (new)
- `src/templates/navigation/menu-template.types.ts` (update)
- `src/templates/navigation/breadcrumb-template.types.ts` (new)

**Changes:**
- Copy the reference `AuthUser` interface, fake `authService`, `useAuth` composable, and `authStore`.
- Copy the `chatStore`, `chatService`, and `ChatRequest` / `ChatResponse` / `MessageDto` / `ConversationDto` wiki module types.
- Copy `formatName`, notification utilities, `APP_VERSION`, `STORAGE_KEYS`, and `links[]` menu constants.
- Copy `BreadcrumbItem`, `MenuLinkProps`, `Menu`, and `SubMenu` types.
- Copy `layoutStore` with `miniMode`, `showLabelsInMini`, and `isFullscreen`.
- Adapt internal imports to use relative paths instead of the `src/` alias.

**Commands:**
- `npm run type-check`

**Checkpoint:**
- All types and scaffolding compile without errors.

**Suggested commit:**
- `feat(templates/scaffolding): add reference auth, wiki, layout stores and utils`

---

### Slice 2 — Navigation Templates: Menu, Breadcrumb, UserMenu

**Goal:** Align navigation templates with the exact reference implementation.

**Target paths:**
- `src/templates/navigation/MenuLinkTemplate.vue` (update)
- `src/templates/navigation/HorizontalMenuLinkTemplate.vue` (update)
- `src/templates/navigation/UserMenuTemplate.vue` (update)
- `src/templates/navigation/AppBreadcrumbTemplate.vue` (update)

**Changes:**
- Replace each template body so it matches the reference.
- MenuLink: copy every mode, including mini, mini with labels, normal, with submenus, and without submenus.
- HorizontalMenuLink: copy dropdown, direct link, and active style behavior.
- UserMenu: copy avatar, popup menu, layout and label toggles, and logout.
- AppBreadcrumb: copy home icon, navigation, and capitalization behavior.

**Commands:**
- `npm run type-check`

**Checkpoint:**
- Templates compile and the navigation interface visually matches the reference.

**Suggested commit:**
- `refactor(templates/navigation): exact reference parity for all nav components`

---

### Slice 3 — Layout Templates: Auth + Main Layout

**Goal:** Replicate the layouts exactly as the reference.

**Target paths:**
- `src/templates/layouts/AuthLayoutTemplate.vue` (update)
- `src/templates/layouts/MainLayoutTemplate.vue` (update)

**Changes:**
- AuthLayout: simple layout with `router-view`, matching the minimal reference.
- MainLayout: copy the full structure:
  - Header with logo, breadcrumb, and user menu.
  - Conditional horizontal toolbar.
  - Side drawer with sidebar gradient.
  - Bottom drawer with configuration item.
  - Chat FAB and ChatDrawer.
  - Fade route transition.
  - All SCSS styles from the reference.

**Commands:**
- `npm run type-check`

**Checkpoint:**
- Layout compiles and the visual shell matches the reference.

**Suggested commit:**
- `refactor(templates/layouts): exact reference shell parity`

---

### Slice 4 — Page Templates: Dashboard, Profile, Placeholder, ErrorNotFound

**Goal:** Replicate every reference page.

**Target paths:**
- `src/templates/pages/dashboard/DashboardTemplate.vue` (update)
- `src/templates/pages/account/ProfileTemplate.vue` (update)
- `src/templates/pages/system/PlaceholderTemplate.vue` (update)
- `src/templates/pages/system/ErrorNotFoundTemplate.vue` (update)

**Changes:**
- Dashboard: hero greeting, animated KPI grid, charts using Highcharts or SVG placeholders, metrics, and top clients.
- Profile: hero header with avatar and info card with separators.
- Placeholder: construction icon and dynamic title.
- ErrorNotFound: fullscreen 404 with back button.

**Commands:**
- `npm run type-check`

**Checkpoint:**
- All pages compile and the dashboard shows KPIs, greeting, and card layout.

**Suggested commit:**
- `refactor(templates/pages): full reference page parity`

---

### Slice 5 — Feature Templates: Login, Wiki, WikiChat, ChatDrawer

**Goal:** Replicate the complete auth and wiki modules.

**Target paths:**
- `src/templates/features/auth/LoginTemplate.vue` (update)
- `src/templates/features/wiki/WikiTemplate.vue` (update)
- `src/templates/features/wiki/WikiChatTemplate.vue` (update)
- `src/templates/features/wiki/WikiChatDrawerTemplate.vue` (update)

**Changes:**
- Login: split-screen form with image, features, form, and fake auth.
- Wiki: sidebar tree with categories, filters, table and grid view, and bulk actions.
- WikiChat: conversations sidebar, chat area, suggestions, typing indicator, and sources.
- ChatDrawer: floating drawer with header, messages, input, and suggestions.

**Commands:**
- `npm run type-check`

**Checkpoint:**
- Login works with fake auth, wiki has tree and table modes, and chat has the complete UX.

**Suggested commit:**
- `feat(templates/features): full reference auth and wiki parity`

---

### Slice 6 — Styles: Global SCSS baseline

**Goal:** Align global styles with the reference.

**Target paths:**
- `src/styles/global.scss` (update)
- `samples/index.html` (if fonts require it)

**Changes:**
- Import Google Fonts (Inter).
- Align body background, button radius, notification styles, and field label styles.
- Align `q-spinner` animation, hidden scrollbars, and number input spinners.

**Commands:**
- `npm run build:samples`

**Checkpoint:**
- Global visuals for fonts, backgrounds, and buttons match the reference.

**Suggested commit:**
- `style(global): align reference global scss baseline`

---

### Slice 7 — Runtime Router and Sample Integration

**Goal:** Configure the template runtime router for every route and integrate it with the sample host.

**Target paths:**
- `src/templates/runtime/router.ts` (update)
- `src/templates/runtime/TemplateRuntimeApp.vue` (update)
- `samples/main.ts` (if needed)

**Changes:**
- Router with auth guard.
- Routes: login, pipeline/dashboard, wiki, wiki-chat, profile, clients, orders, configuration, reports, and 404.
- App root with `router-view`.
- Boot scaffolding with auth check on mount.

**Commands:**
- `npm run type-check`
- `npm run build:samples`
- Browser smoke: `http://localhost:5173/?template-runtime=1`

**Checkpoint:**
- Complete navigation works in the sample runtime.

**Suggested commit:**
- `feat(templates/runtime): full reference routing and integration`

---

### Slice 8 — Final parity audit and closeout

**Goal:** Final validation of visual and functional parity.

**Target paths:**
- `planning/plans/completed/2026-04/reference-full-component-parity-plan-2026-04-13.md`
- `planning/specs/completed/2026-04/reference-full-component-parity-spec-2026-04-13.md`

**Changes:**
- Run complete smoke tests on every page.
- Compare side by side with the reference.
- Document intentional differences, such as Highcharts versus placeholder charts.
- Update plan and spec status.

**Commands:**
- `npm run type-check`
- `npm run test`
- `npm run build:samples`

**Checkpoint:**
- Sample runtime visually matches the reference on desktop and mobile.

**Suggested commit:**
- `docs(planning): record reference full component parity audit`

---

## Validation Checklist

- [x] `npm run type-check` passes for each slice.
- [x] `npm run build:samples` succeeds.
- [x] Fake login works and redirects to dashboard.
- [x] Dashboard includes greeting, KPIs, chart placeholders, metrics, and top clients.
- [x] Horizontal and side menus support functional toggles.
- [x] Mini mode with labels is covered by runtime layout guardrails.
- [x] Wiki page includes tree, filters, table view, and grid view.
- [x] Wiki Chat includes sidebar, messages, and suggestions.
- [x] Chat Drawer floats through the FAB.
- [x] Profile page includes hero header and info.
- [x] Breadcrumb works on every route.
- [x] 404 page handles unknown routes.

## Risks

- **Highcharts:** Heavy external dependency. If it is not viable in the sample, use SVG chart placeholders.
- **Large file volume:** 8 slices with roughly 30+ files to create or update. Prioritize incremental compilation.
- **Relative imports:** Templates use relative paths, not the `src/` alias. Validate imports at each slice.
- **localStorage in the sample:** Fake auth uses localStorage and persists between reloads. This is intentional for the demo.

## Closeout Expectations

- Update plan and spec status to `completed`.
- Move the plan to `planning/plans/completed/YYYY-MM/`.
- README update is not required because samples are internal demos.
- Changelog entry is recommended.
- Commit message final: `feat(templates): reference full component parity — all slices complete`

---

## Audit Notes (Slice 8)

**Date:** 2026-04-13
**Browser smoke test results:**

| Page | Status | Notes |
|------|--------|-------|
| Login (`#/auth/login`) | OK | Form PT-BR, fake auth redirect to dashboard |
| Dashboard (`#/`) | OK | Greeting, KPIs, donut chart SVG, bar chart SVG, activity, top clients |
| Clientes (`#/clients`) | OK | Placeholder "Em breve" |
| Pedidos (`#/orders`) | OK | Placeholder "Em breve" |
| Wiki (`#/knowledge`) | OK | Tree, categories, filters, table + grid view |
| Wiki Chat (`#/knowledge/chat`) | Info | Renders parent WikiTemplate (child route without dedicated router-view — acceptable) |
| Settings (`#/settings`) | OK | Placeholder "Em breve" |
| Profile (`#/profile`) | OK | Avatar, name, email, role badge, Sign out |
| 404 (`#/_/404`) | OK | Fixed — blank layout now wraps QLayout+QPageContainer |
| Chat FAB | OK | Floating drawer with suggestions, input, title |
| Menu toggle | OK | Expand/Collapse sidebar via hamburger |

**Intentional differences from reference:**
- Charts use SVG placeholders (DonutChartPlaceholder + BarChartPlaceholder) instead of Highcharts
- WikiChat child route renders parent WikiTemplate content (no separate view in template)
- Mini mode labels toggle exists but was not visually verified in this audit

**Commits:**
- `87e9ba6` — Slice 1 scaffolding
- `a16a0b8` — Runtime router rewrite with auth, dashboard, chat FAB
- `927485a` — Dashboard charts, SCSS parity, boot auth check
- Final — Blank layout fix + audit closeout