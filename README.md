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

### Recipes

Copyable, library-only patterns for common screens (CRUD, form, dialog, table,
empty/loading/error states, and a primitives gallery) live in
[RECIPES.md](./RECIPES.md). Each recipe is rendered live in the sample catalog
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
CMS, or template runtime. It runs in CI via `.github/workflows/a11y.yml`
(`workflow_dispatch` + pull requests touching the design system, samples, or the
gate itself). Routine PR gating remains in GitRiver; broader product e2e lives
downstream.

Package dry-run:

```bash
npm pack --dry-run
```

## Generated References

- [DESIGN.md](./DESIGN.md)
- [TOKENS.md](./TOKENS.md)
- [COMPONENTS.md](./COMPONENTS.md)

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