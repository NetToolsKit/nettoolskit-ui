# Templates Catalog

Template-first layer for visual delivery in `@nettoolskit/ui-vue`.

## Standard Compliance

This README follows:
- [docs/standards/readme-frontend-super-agent-standard.md](../../docs/standards/readme-frontend-super-agent-standard.md)

## Goal

Provide reusable, configurable template contracts for:
- layouts
- navigation
- pages
- feature surfaces
- style bridges
- integration scaffolding

This folder is the canonical source for new visual work. Direct one-off implementation in module/page roots is not allowed unless explicitly approved in planning.

## Structure

- `contracts/`
  - shared types and acceptance gate helpers
- `layouts/`
  - layout template catalog and exports
- `navigation/`
  - navigation template catalog and exports
- `pages/`
  - page template catalog and exports
  - domain-oriented folders (`dashboard/`, `crud/`, `account/`, `system/`)
  - see `pages/README.md` for organization and contracts
- `features/`
  - feature template catalog and exports
  - domain folders include:
    - `auth/`
    - `wiki/`
    - `enterprise/`
    - `cms/`
    - `reference-system/`
  - `cms/` owns the reusable authoring shell and module surfaces extracted from the CMS runtime
  - `reference-system/` owns the reusable catalog/workspace shells, composition layers, and host controllers consumed by the `samples/` runtime host
- `styles/`
  - style/template bridge catalog and exports
- `scaffolding/`
  - router/menu/store/notification scaffold catalog and exports
- `registry.ts`
  - unified registry for all template entries

## Delivery Rule

A visual slice is only releasable when all mandatory acceptance criteria are complete:
- layout template contract
- page template contract
- state/composable integration template
- tokenized styles
- accessibility contract
- unit tests
- README/documentation contract

Use helpers from `contracts/template-acceptance.ts` to verify readiness.

## Theme And Layout Contract

Template styling must follow this hierarchy:

1. Quasar mode and brand layer: `Dark` runtime state plus `--q-primary`, `--q-secondary`, `--q-accent`, `--q-dark`, `--q-positive`, `--q-negative`, `--q-info`, and `--q-warning`.
2. NetToolsKit base aliases: `--ntk-*` and `--semantic-*`.
3. Template aliases: `--ntk-template-page-*`, `--ntk-template-shell-*`, `--ntk-template-overlay-*`, `--ntk-template-semantic-*`, plus reference/CMS-specific aliases.
4. Component styles: consume template aliases and avoid local contrast formulas unless the formula is promoted to the shared bridge first.

Quasar components that render through portals or teleports must receive explicit global/popup styling hooks. Do not assume scoped CSS from a parent component will reach `QMenu`, `QDialog`, `QSelect` menus, `QPopupProxy`, or `QTooltip` content after it is mounted under `body`.

Runtime layout templates should use Quasar layout primitives directly:
- `QLayout`
- `QDrawer`
- `QPageContainer`
- `QPage`

The template layer may style the product shell, but it should not reimplement Quasar layout mechanics.

## Generic Template Reuse Rule

Templates under `pages/` and `features/` must stay generic enough to be reused in:
- dashboard surfaces
- CRUD/list modules
- CMS, backoffice, and reference-system variants

Do not hardcode business-domain copy, route assumptions, or store bindings directly inside shared template files.

## Validation Baseline

```bash
npm run lint
npm run type-check
npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts
```

For theme and visual architecture slices, also run the focused runtime guardrails:

```bash
npm test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/templates/ThemeSwitcherTokens.spec.ts
npx playwright test tests/e2e/template-runtime-dark-theme-guardrails.spec.ts
```
