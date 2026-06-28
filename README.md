# NetToolsKit UI

Shared Vue 3 + Quasar component library, design-system contracts, composables,
styles and DTCG-style design tokens for the NetToolsKit ecosystem.

This repository is library-only. Product applications, CMS authoring flows,
landing runtimes and application template shells belong in downstream products
such as `NetToolsKit.One`.

## Install

```bash
npm install nettoolskit
```

Peer dependencies:

```bash
npm install vue quasar
```

> **Preview release.** `0.0.1-preview.x` is an early preview: the public surface
> is stabilizing and minor versions may introduce breaking changes until `0.1.0`.

## Quick start

One-line install registers every `Ds*` component and bootstraps theming:

```ts
import { createNetToolsKitUI } from 'nettoolskit'
import 'nettoolskit/styles/global.scss'

app.use(createNetToolsKitUI({ theme: 'auto' }))
```

A complete CRUD screen from a single schema — list + filter + pagination +
validated form + delete, with no per-screen CSS and no raw Quasar:

```vue
<template>
  <DsCrudPage :resource="resource" />
</template>

<script setup lang="ts">
import { DsCrudPage, defineResource } from 'nettoolskit'

const resource = defineResource({
  title: 'Clientes',
  rowKey: 'id',
  columns: [{ field: 'name', label: 'Nome' }, { field: 'email', label: 'E-mail' }],
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

## Usage

```ts
import {
  DsButton,
  DsCard,
  DsInput,
  NtkButton,
  NtkCard,
  NtkInput,
  useFormRules,
} from 'nettoolskit'

import 'nettoolskit/styles/global.scss'
```

## Layers (L0–L3)

The library is a layered front-creation system — pick the layer that matches how
much control you need, and drop down a level any time for full control:

| Layer | What | Reach for it when |
|---|---|---|
| **L0** | `Ds*` primitives + `createNetToolsKitUI()` install | One widget / app + theme setup |
| **L1** | `DsCrudPage` / `DsFormPage` composites | No template fits → full layout control |
| **L2** | `defineForm` / `defineResource` schema + `DsForm` | A whole screen from a schema |
| **L3** | Recipe catalog (`samples/`) | Learn / copy a sanctioned pattern |

The pure logic (contracts, class recipes, schema, validation) lives in
`src/design-system/core/**` (zero Vue, framework-free); the `Ds*` components are
thin render shells over it. Full guide + decision tree + worked example:
[docs/architecture/layers.md](./docs/architecture/layers.md).

### Recipes

Copyable, library-only patterns for common screens (CRUD, form, dialog, table,
empty/loading/error states, and a primitives gallery) live in
[docs/RECIPES.md](./docs/RECIPES.md). Each recipe is rendered live in the sample catalog
(`samples/`) next to its composition snippet — run `npm run dev:samples`.

## Public Surface

- `src/design-system/**`: tokens, theme/density helpers, recipes, contracts and
  `Ds*` Vue wrappers.
- `src/components/**`: reusable `Ntk*` and compatibility `Base*` components.
- `src/composables/**`: reusable UI, form, data and utility composables.
- `src/services/**`: reusable frontend service helpers.
- `src/utils/**`: validation, formatting and async utilities.
- `src/styles/**`: shared style exports and token CSS/SCSS entry points.
- `policies/**` and `scripts/**`: package governance and generated-doc tooling.

Not in scope for this repository:

- CMS engines or authoring workflows;
- product landing pages;
- router-enabled application template runtimes;
- product-specific backend integration docs or visual regression fixtures.

## Exports

```ts
import { DsButton, DsCard, DsInput, DsSelect, DsTable } from 'nettoolskit'
import { createDensityCssVariableAssignments } from 'nettoolskit'
```

Style exports:

```scss
@use 'nettoolskit/styles/tokens.scss';
@use 'nettoolskit/styles/global.scss';
```

Package subpaths:

- `nettoolskit/styles`
- `nettoolskit/styles/tokens.scss`
- `nettoolskit/styles/global.scss`
- `nettoolskit/styles/themes.css`
- `nettoolskit/styles/quasar-variables.scss`
- `nettoolskit/design-system/tokens.css`
- `nettoolskit/design-system/resolver.json`

## Development

```bash
npm ci
npm run dev:samples
```

The sample host is a library preview only. It renders reusable components and
loads the shared token stack without CMS, product runtime or template-router
code.

## Validation

Focused gates:

```bash
npm run tokens:check
npm run docs:check
npm run lint:css
npm run test:design-system
npm run test:architecture
npm run type-check
npm run build
```

Full package gate:

```bash
npm run verify
```

Browser & a11y gate (separate from `verify` to keep ordinary gates fast):

```bash
# builds the sample catalog, serves it, and runs a real-browser axe/a11y +
# focus/dialog smoke over the Ds* recipes (Chromium)
npx playwright install chromium   # one-time
npm run test:e2e
```

This library-only gate targets the sample catalog (`samples/`) — no product,
CMS, or template runtime. It runs in CI inside the GitRiver `test` stage (which
installs Chromium and runs `npm run test:e2e`), so the real-browser a11y/focus
checks gate every PR to `main` alongside the unit, lint and build stages.

Package dry-run:

```bash
npm pack --dry-run
```

## Documentation

- [docs/architecture/layers.md](./docs/architecture/layers.md) — L0–L3 layers, decision guide, pure-vs-framework split
- [docs/RECIPES.md](./docs/RECIPES.md) — copyable screen patterns
- [docs/MIGRATION.md](./docs/MIGRATION.md) — migration notes

## Generated References

- [docs/DESIGN.md](./docs/DESIGN.md)
- [docs/TOKENS.md](./docs/TOKENS.md)
- [docs/COMPONENTS.md](./docs/COMPONENTS.md)

Regenerate/check with:

```bash
npm run tokens:build
npm run docs:build
npm run tokens:check
npm run docs:check
```

## Repository

GitHub: https://github.com/NetToolsKit/nettoolskit-ui

License: MIT