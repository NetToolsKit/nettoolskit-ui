# Reference Full Component Parity — Spec

Date: 2026-04-13
Status: ready-for-planning

## Design Intent

Replicar fielmente todos os componentes, layouts, páginas, módulos (auth, wiki), stores, estilos, composables e menus do projeto de referência (`.temp/reference/src/`) dentro do workspace `nettoolskit-ui-vue`, seguindo a organização existente em `src/templates/`, `src/composables/`, `src/components/`, e expondo tudo no runtime de samples.

O objetivo é que o sample público (`samples/`) rode com a mesma experiência visual e funcional do projeto de referência, usando a infra de templates já existente no repositório.

## Source of Truth

- `.temp/reference/src/` — projeto Quasar aprovado como referência visual e funcional
- Todos os componentes, estilos, stores, services, composables e páginas devem ser replicados

## Target Architecture

O workspace já possui uma camada de templates bem estruturada:

```
src/templates/
├── layouts/          → AuthLayoutTemplate, MainLayoutTemplate
├── navigation/       → MenuLinkTemplate, HorizontalMenuLinkTemplate, UserMenuTemplate, AppBreadcrumbTemplate
├── pages/            → DashboardTemplate, ProfileTemplate, ErrorNotFoundTemplate, PlaceholderTemplate
├── features/
│   ├── auth/         → LoginTemplate
│   ├── wiki/         → WikiTemplate, WikiChatTemplate, WikiChatDrawerTemplate
│   └── ...
├── scaffolding/      → auth-store, layout-store, menu.constants, notification, router
└── runtime/          → TemplateRuntimeApp, router
```

O alinhamento será feito camada a camada, mantendo a nomenclatura `*Template` do repositório.

## Componentes do Reference → Mapeamento Target

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
| `modules/auth/composables/useAuth.ts` | `src/templates/scaffolding/` (composable) |
| `modules/auth/stores/authStore.ts` | `src/templates/scaffolding/auth-store.template.ts` |
| `modules/auth/services/authService.ts` | `src/templates/scaffolding/` (service) |
| `modules/auth/types/auth.types.ts` | `src/templates/scaffolding/` (types) |
| `modules/wiki/pages/WikiPage.vue` | `src/templates/features/wiki/WikiTemplate.vue` |
| `modules/wiki/pages/WikiChatPage.vue` | `src/templates/features/wiki/WikiChatTemplate.vue` |
| `modules/wiki/components/ChatDrawer.vue` | `src/templates/features/wiki/WikiChatDrawerTemplate.vue` |
| `modules/wiki/stores/chatStore.ts` | `src/templates/scaffolding/` (chat store) |
| `modules/wiki/services/chatService.ts` | `src/templates/scaffolding/` (chat service) |
| `modules/wiki/types/chat.types.ts` | `src/templates/features/wiki/wiki-template.types.ts` |
| `shared/composables/useMenuMode.ts` | `src/composables/` ou inline no MainLayoutTemplate |
| `shared/constants/menu.constants.ts` | `src/templates/scaffolding/menu.constants.template.ts` |
| `shared/constants/app.ts` | `src/templates/scaffolding/` |
| `shared/types/menu.types.ts` | `src/templates/navigation/menu-template.types.ts` |
| `shared/types/breadcrumb.types.ts` | `src/templates/navigation/` |
| `shared/utils/notification.ts` | `src/templates/scaffolding/notification.template.ts` |
| `shared/utils/format-name.ts` | `src/templates/scaffolding/` |
| `stores/layout-store.ts` | `src/templates/scaffolding/layout-store.template.ts` |
| `css/app.scss` | `src/styles/global.scss` + sample host |
| `router/` | `src/templates/runtime/router.ts` |

## Acceptance Criteria

1. O sample público (`npm run dev:samples` → `?template-runtime=1`) deve rodar com visual e funcionalidade idênticos ao `.temp/reference`
2. Login funcional com fake auth service
3. Dashboard com KPIs e charts (Highcharts presente ou substituído por SVG placeholder)
4. Wiki page com tree sidebar, filtros, tabela/grid
5. Wiki Chat page com sidebar de conversas e área de chat
6. Chat Drawer flutuante acessível pelo FAB
7. Profile page com hero header e informações da conta
8. Menu horizontal e lateral com toggle
9. Mini mode com labels e tooltips
10. Breadcrumb funcional
11. `npm run type-check` passa
12. `npm run build:samples` sucede

## Alternatives Considered

- Copiar componentes diretamente de `.temp/reference/` sem adaptar → rejeitado, pois o workspace exige a camada *Template e a infraestrutura de scaffolding
- Criar módulos `auth/` e `wiki/` sob `src/modules/` → rejeitado, pois esses pertencem à **camada de samples/templates**, não à lib publicável

## Risks

- Highcharts é dependência pesada; pode ser necessário adicionar ao devDependencies ou usar placeholder
- A fake auth pode manter estado entre reloads via localStorage, verificar se faz sentido no sample
- O volume de arquivos é alto — priorizar os componentes mais impactantes primeiro

## Planning Readiness

✅ Pronto para planejamento — o mapeamento está completo e os arquivos-alvo estão identificados

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Support: `dev-software-engineer` para scaffolding/types
