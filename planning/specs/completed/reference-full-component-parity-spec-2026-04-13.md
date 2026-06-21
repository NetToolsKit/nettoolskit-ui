# Reference Full Component Parity - Spec

Date: 2026-04-13
Status: completed - archived

## Design Intent

Replicate the reference project's components, layouts, pages, modules (auth, wiki), stores, styles, composables, and menus from `.temp/reference/src/` into the `nettoolskit-ui-vue` workspace, following the existing organization under `src/templates/`, `src/composables/`, and `src/components/`, and exposing the result in the samples runtime.

The goal was for the public sample (`samples/`) to run with the same visual and functional experience as the reference project while using the template infrastructure already present in this repository.

## Source Of Truth

- `.temp/reference/src/` - approved Quasar project used as the visual and functional reference
- All reference components, styles, stores, services, composables, and pages that affected the public runtime experience

## Target Architecture

The workspace already had a structured template layer:

```text
src/templates/
├── layouts/          -> AuthLayoutTemplate, MainLayoutTemplate
├── navigation/       -> MenuLinkTemplate, HorizontalMenuLinkTemplate, UserMenuTemplate, AppBreadcrumbTemplate
├── pages/            -> DashboardTemplate, ProfileTemplate, ErrorNotFoundTemplate, PlaceholderTemplate
├── features/
│   ├── auth/         -> LoginTemplate
│   ├── wiki/         -> WikiTemplate, WikiChatTemplate, WikiChatDrawerTemplate
│   └── ...
├── scaffolding/      -> auth-store, layout-store, menu.constants, notification, router
└── runtime/          -> TemplateRuntimeApp, router
```

Alignment was planned layer by layer while preserving the repository's `*Template` naming convention.

## Reference To Target Mapping

| Reference File | Target File |
|---|---|
| `components/MenuLink.vue` | `src/templates/navigation/MenuLinkTemplate.vue` |
| `components/HorizontalMenuLink.vue` | `src/templates/navigation/HorizontalMenuLinkTemplate.vue` |
| `components/UserMenu.vue` | `src/templates/navigation/UserMenuTemplate.vue` |
| `shared/components/common/AppBreadcrumb.vue` | `src/templates/navigation/AppBreadcrumbTemplate.vue` |
| `layouts/AuthLayout.vue` | `src/templates/layouts/AuthLayoutTemplate.vue` |
| `layouts/MainLayoutHorizontal.vue` | `src/templates/layouts/MainLayoutTemplate.vue` |
| `pages/PipelinePage.vue` | `src/templates/pages/dashboard/DashboardTemplate.vue` |
| `pages/ProfilePage.vue` | `src/templates/pages/account/ProfileTemplate.vue` |
| `pages/PlaceholderPage.vue` | `src/templates/pages/system/PlaceholderTemplate.vue` |
| `pages/ErrorNotFound.vue` | `src/templates/pages/system/ErrorNotFoundTemplate.vue` |
| `modules/auth/pages/LoginPage.vue` | `src/templates/features/auth/LoginTemplate.vue` |
| `modules/auth/composables/useAuth.ts` | `src/templates/scaffolding/` composable |
| `modules/auth/stores/authStore.ts` | `src/templates/scaffolding/auth-store.template.ts` |
| `modules/auth/services/authService.ts` | `src/templates/scaffolding/` service |
| `modules/auth/types/auth.types.ts` | `src/templates/scaffolding/` types |
| `modules/wiki/pages/WikiPage.vue` | `src/templates/features/wiki/WikiTemplate.vue` |
| `modules/wiki/pages/WikiChatPage.vue` | `src/templates/features/wiki/WikiChatTemplate.vue` |
| `modules/wiki/components/ChatDrawer.vue` | `src/templates/features/wiki/WikiChatDrawerTemplate.vue` |
| `modules/wiki/stores/chatStore.ts` | `src/templates/scaffolding/` chat store |
| `modules/wiki/services/chatService.ts` | `src/templates/scaffolding/` chat service |
| `modules/wiki/types/chat.types.ts` | `src/templates/features/wiki/wiki-template.types.ts` |
| `shared/composables/useMenuMode.ts` | `src/composables/` or inline in `MainLayoutTemplate` |
| `shared/constants/menu.constants.ts` | `src/templates/scaffolding/menu.constants.template.ts` |
| `shared/constants/app.ts` | `src/templates/scaffolding/` |
| `shared/types/menu.types.ts` | `src/templates/navigation/menu-template.types.ts` |
| `shared/types/breadcrumb.types.ts` | `src/templates/navigation/` |
| `shared/utils/notification.ts` | `src/templates/scaffolding/notification.template.ts` |
| `shared/utils/format-name.ts` | `src/templates/scaffolding/` |
| `stores/layout-store.ts` | `src/templates/scaffolding/layout-store.template.ts` |
| `css/app.scss` | `src/styles/global.scss` plus the sample host |
| `router/` | `src/templates/runtime/router.ts` |

## Acceptance Criteria

1. The public sample (`npm run dev:samples` with `?template-runtime=1`) runs with the same visual and functional behavior as `.temp/reference`.
2. Login works through a fake auth service.
3. Dashboard renders KPIs and charts, with Highcharts present or replaced by an SVG placeholder.
4. Wiki page includes a tree sidebar, filters, and table/grid surfaces.
5. Wiki Chat page includes a conversation sidebar and chat area.
6. Floating Chat Drawer is accessible from the FAB.
7. Profile page includes the hero header and account information.
8. Horizontal and side menus support toggling.
9. Mini mode supports labels and tooltips.
10. Breadcrumb behavior is functional.
11. `npm run type-check` passes.
12. `npm run build:samples` succeeds.

## Alternatives Considered

- Copying components directly from `.temp/reference/` without adapting them was rejected because this workspace requires the template layer and scaffolding infrastructure.
- Creating `auth/` and `wiki/` modules under `src/modules/` was rejected because these surfaces belong to the samples/templates layer, not to the publishable library.

## Risks

- Highcharts is a heavy dependency, so the implementation might need to add it to `devDependencies` or use a placeholder.
- Fake auth can preserve state across reloads through `localStorage`, so persistence behavior must be intentional.
- The file volume is high, so the most visible components should be prioritized first.

## Planning Readiness

This spec was ready for planning and has since been archived with the completed execution plan.

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Support: `dev-software-engineer` for scaffolding and types
