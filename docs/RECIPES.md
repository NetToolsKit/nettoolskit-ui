# Recipes

Copyable, library-only composition patterns for building common screens with
`Ds*` components — no raw Quasar, no one-off CSS, no backend. Each recipe is
rendered live in the sample catalog (`samples/`) next to a copyable snippet.

Run the catalog locally:

```bash
npm run dev:samples   # live, with HMR
npm run build:samples # the static artifact the a11y gate serves
```

Source lives in [`samples/recipes/`](./samples/recipes); the catalog host that
composes them is
[`samples/LibrarySampleApp.vue`](./samples/LibrarySampleApp.vue). The reusable
copy wrapper is
[`samples/recipes/RecipeShowcase.vue`](./samples/recipes/RecipeShowcase.vue).

## Recipe → component map

| Recipe | File | Components used | What it shows |
|---|---|---|---|
| Dashboard | `DashboardRecipe.vue` | `DsMetricGrid` | Overview indicators in a responsive metric grid. |
| CRUD from schema | `CrudRecipe.vue` | `DsCrudPage`, `defineResource` (composes `DsPage`, `DsPageHeader`, `DsFilterBar`, `DsTable`, `DsForm`) | A full list + filter + create/edit/delete screen from one resource definition. |
| Page form | `FormRecipe.vue` | `DsFormPage`, `defineForm` | A two-column schema form with validation and submit. |
| Action dialog | `DialogRecipe.vue` | `DsButton`, `DsDialog`, `DsForm`, `defineForm` | A schema form inside an accessible modal (focus trap, Esc/backdrop). |
| Sortable table | `TableRecipe.vue` | `DsTable`, `DsSelect` | A standalone table with server-style sort + pagination resolved locally over a fixture, plus a density toggle. |
| Async states | `EmptyStateRecipe.vue` | `DsEmptyState`, `DsStateBlock`, `DsButton` | Empty (with actions), loading and error states side by side. |
| Primitives gallery | `ComponentsGalleryRecipe.vue` | `DsBadge`, `DsChip`, `DsAvatar`, `DsTabs`, `DsTooltip`, `DsSkeleton`, `DsBreadcrumbs`, `DsSteps`, `DsBanner`, `DsButton` + `useToast` → `DsToast`/`DsToastHost` | A few variants of each newer primitive; the toast button pushes onto the shared queue rendered by `<DsToastHost />`. |
| Copy wrapper | `RecipeShowcase.vue` | `DsCard`, `DsButton` | Presentational shell: live preview + copyable `<pre><code>` snippet with an accessible Copy button. |

## Declarative dialogs (Invoker Commands)

In browsers with the HTML Invoker Commands API (Baseline newly available:
Chrome/Edge 135+, Firefox 144+, Safari 26+), a `DsDialog` with an `id` can be
opened and closed with **no handler code** — the browser performs the action
and the component mirrors it back into `v-model`:

```vue
<button commandfor="invite-dialog" command="show-modal">Convidar</button>

<DsDialog id="invite-dialog" v-model="open" title="Convidar usuário">
  <p>Conteúdo…</p>
  <template #actions="{ close }">
    <button commandfor="invite-dialog" command="close">Cancelar</button>
    <DsButton @click="close">Confirmar</DsButton>
  </template>
</DsDialog>
```

`v-model` stays the source of truth (older browsers keep the existing
programmatic flow — the attributes are simply inert there), `persistent` still
governs Esc/backdrop, and custom (`--*`) commands are ignored.

## Conventions

- Import everything from the package entry (`'../../index'` in samples,
  `'nettoolskit'` in product code). Prefer `Ds*` first.
- Use deterministic local fixtures — never product data, secrets, or live APIs.
- Styling is token-only (`var(--ntk-*)`); no raw colors, no `.q-*`, no
  `:deep()`. Normal states need no local CSS.
- The catalog is the a11y gate target: everything must pass WCAG AA contrast
  (axe runs with `color-contrast` enabled). See README "Browser & a11y gate".