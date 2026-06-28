# Architecture — Layers (L0–L3)

`nettoolskit` is a **schema-driven front-creation system** layered on top of the
`Ds*` primitives. You pick the layer that matches how much control you need —
each layer is independently usable, and you can always drop down a level for full
control without leaving the design system.

> The numbering is a **dependency order, not a quality ranking.** `L1`
> (hand-composing primitives) is a first-class escape hatch that deliberately
> sits *below* the schema layer. Higher number ≠ "better"; it means "more
> dependencies / more done for you."

## The layers

| Layer | What it is | Lives in | Reach for it when |
|---|---|---|---|
| **L0** | `Ds*` primitives + `createNetToolsKitUI()` one-line install | `src/design-system/vue/components/**`, `src/design-system/vue/plugin/**` | You need a single widget, or to bootstrap the app/theme |
| **L1** | `DsCrudPage` / `DsFormPage` composites (compose `Ds*` by hand) | `src/design-system/vue/components/**` | No template fits → you want full layout control |
| **L2** | `defineForm` / `defineResource` schema (pure) + `DsForm` renderer | `src/design-system/core/schema/**` (pure) + `src/design-system/vue/components/DsForm.vue` | You want a whole screen generated from a schema |
| **L3** | Recipe catalog (teaches approved composition) | `samples/**` | You want to learn or copy a sanctioned pattern |

### Dependency direction

```
        L3  recipe catalog (samples/)  — consumes everything below, teaches usage
        │
        ▼
   ┌─────────────────────────────────────────────┐
   │ L2  defineResource / defineForm  +  DsForm   │  schema → screen
   └─────────────────────────────────────────────┘
        │ built on
        ▼
   ┌─────────────────────────────────────────────┐
   │ L1  DsCrudPage / DsFormPage  (compose Ds*)   │  escape hatch, full control
   └─────────────────────────────────────────────┘
        │ built on
        ▼
   ┌─────────────────────────────────────────────┐
   │ L0  Ds* primitives  +  createNetToolsKitUI() │  one widget / app install
   └─────────────────────────────────────────────┘

   Everything pure (contracts, class recipes, schema, validation) lives in
   src/design-system/core/**  →  see "Pure vs framework" below.
```

## Which layer do I use? (decision guide)

1. **Is there already a recipe for this screen?** → copy the **L3** recipe from
   `samples/` (or `docs/RECIPES.md`).
2. **Is it a whole CRUD / form driven by data?** → **L2**:
   `defineResource(...)` + `<DsCrudPage :resource>` (or `defineForm` + `<DsForm>`).
3. **Do you need bespoke layout the schema can't express?** → **L1**: compose
   `Ds*` primitives by hand (optionally inside `DsFormPage`). This is expected and
   supported — not a failure.
4. **Do you just need one control?** → **L0**: use the `Ds*` component directly.

You never start from zero: if the template (L2) doesn't fit, you fall back to
composites (L1); if those don't fit, to primitives (L0); and the pure contracts
underneath normalize props, classes and validation for all of them.

## Worked example — the same screen at three layers

### L2 — a full CRUD from one schema (the fast path)

```vue
<template>
  <DsCrudPage :resource="resource" />
</template>

<script setup lang="ts">
import { DsCrudPage, defineResource } from '@nettoolskit/ui'

const resource = defineResource({
  title: 'Clientes',
  rowKey: 'id',
  columns: [
    { field: 'name', label: 'Nome' },
    { field: 'email', label: 'E-mail' },
  ],
  form: [
    { field: 'name', type: 'text', label: 'Nome', required: true, minLength: 2 },
    { field: 'email', type: 'email', label: 'E-mail', required: true },
  ],
  fetch: () => api.list(),
  create: (row) => api.create(row),
  update: (row) => api.update(row),
  remove: (row) => api.remove(row),
})
</script>
```

List + filter + pagination + a validated create/edit form + delete — with no
per-screen CSS and no raw Quasar.

### L1 — drop down for bespoke layout

When the schema can't express what you need, hand-compose the same primitives
the composite uses internally:

```vue
<template>
  <DsFormPage title="Clientes">
    <DsTable :rows="rows" :columns="columns" @row-click="edit" />
    <DsForm :schema="schema" @submit="save" />
  </DsFormPage>
</template>
```

### L0 — the building blocks underneath

```vue
<DsInput v-model="name" label="Nome" />
<DsSelect v-model="role" :options="roles" label="Perfil" />
<DsButton label="Salvar" intent="primary" @click="save" />
```

And the one-line install that registers all of `L0` + bootstraps theming:

```ts
import { createNetToolsKitUI } from '@nettoolskit/ui'
app.use(createNetToolsKitUI({ theme: 'auto' }))
```

## Pure vs framework (and why multi-framework is feasible)

The system is split so the **expensive-to-rewrite parts are framework-free**:

| Concern | Location | Framework-bound? |
|---|---|---|
| Contracts, class recipes (`getNtk*Classes`), schema (`defineForm`/`defineResource`), validation, icons | `src/design-system/core/**` | **No** — pure TypeScript, zero Vue imports, ~zero DOM |
| Design tokens (`--ntk-*`, themes, density, brand) | `src/styles/**` | **No** — CSS custom properties, portable to any framework |
| `Ds*` components, composites, plugin | `src/design-system/vue/**` | **Yes** — Vue SFCs |
| Reactive composables | `src/composables/**` | **Yes** — Vue (`ref`/`computed`) |

A `<DsButton>` is a thin render shell over the **pure** `getNtkButtonClasses()`.
A second framework (e.g. React) would re-consume `core/` + the token CSS and
re-implement only the render/event glue — which is why the two layers that
normally block a port (logic + visual language) are already shared.

See the backlog specs for the planned path:
`planning/specs/backlog/2026-06-28-nettoolskit-ui-framework-agnostic-core-extraction.md`
and `…-react-binding-pilot.md`.

## See also

- [docs/RECIPES.md](../RECIPES.md) — copyable L3 patterns
- [docs/COMPONENTS.md](../COMPONENTS.md) — generated component reference
- [docs/TOKENS.md](../TOKENS.md) — generated token reference
- [docs/DESIGN.md](../DESIGN.md) — design direction
- [docs/MIGRATION.md](../MIGRATION.md) — migration notes