# NetToolsKit UI Visual Styling Foundation - Spec

Generated: 2026-06-24 America/Sao_Paulo
LastUpdated: 2026-06-24 America/Sao_Paulo
Status: completed
Priority: high
Workstream ID: `nettoolskit-ui-visual-styling-foundation`
Phase: P0

## Objective

Wire the existing 119 design tokens to the `Ds*` component classes so the design
system actually *looks* designed out of the box, without product CSS. Today
several primitives emit a complete semantic BEM class API but ship **no CSS**, so
they render with default browser styling.

## Normalized Request Summary

Audit finding: no stylesheet defines `.ntk-button`, `.ntk-card`, `.ntk-field`,
`.ntk-page`, `.ntk-section`, and these components have no scoped `<style>`:
`DsButton`, `DsCard`, `DsInput`, `DsSelect`, `DsPage`, `DsSection`. `DsTable`
only styles sort/pagination — its base table (header, cells, striped/bordered
variants, row hover/selected) is unstyled. The token foundation exists; the
component CSS layer that consumes it is missing for the primitives.

## Design Intent

Each primitive gets token-driven scoped styles covering its full recipe surface:
`variant`, `size`, `intent`, and interaction states (hover, active, disabled,
focus-visible). No raw hex, no `!important`, no `:deep()`, no Quasar selectors —
only `var(--ntk-*)` tokens, so CSS governance stays at zero-tolerance.

```txt
token (--ntk-*)  ->  recipe class (.ntk-button--variant-solid)  ->  scoped <style> using tokens
```

## Scope

- `DsButton` — solid/outline/ghost/link variants, sizes, intents, hover/active/
  disabled, loading affordance hook, focus-visible ring.
- `DsCard` — surface, border, optional clickable elevation, header/body/footer.
- `DsInput` / `DsSelect` (`.ntk-field`) — label, control border/background per
  variant (outlined/filled/plain), invalid/disabled/readonly, focus ring, hint/
  error message.
- `DsPage` / `DsSection` — layout surface, spacing rhythm, header/body/footer.
- `DsTable` base — header cell, body cell, `default/bordered/striped` variants,
  row hover and selected, alignment, empty/loading rows.

## Key Decisions

- Styles live as scoped `<style>` in each SFC (matches DsDialog/DsChip/shell),
  token-only. No new global stylesheet required.
- The visual language is defined by the existing tokens; this work applies them
  consistently — it does not invent a new palette/scale.
- No public API change (props/recipes unchanged); the public-API snapshot stays
  stable. CSS governance baseline stays at 0.

## Design Slice Matrix

| Slice | Target paths | Standardization | Security | Performance | Acceptance |
|---|---|---|---|---|---|
| Primitive styles | `src/design-system/vue/components/Ds{Button,Card,Input,Select,Page,Section}.vue` | Removes "unstyled primitive" gap | Token-only, no raw values | Scoped CSS, tree-shaken per component | Components render styled in samples; lint:css 0 |
| Table base styles | `Ds Table.vue` | Completes the data surface | Token-only | Bounded CSS | Striped/bordered/hover/selected visible |
| Visual proof | `samples/**`, `e2e/**` | Catalog shows styled primitives | Static fixtures | Fast gate | build:samples + e2e axe green |

## Acceptance Criteria

- Every primitive above renders with token-driven styling for all variants/
  sizes/intents/states; nothing relies on default browser appearance.
- `lint:css` and the governance baseline stay at 0 (no raw hex/important/deep/q-).
- `npm run verify` passes; `npm run test:e2e` passes.
- No public API or snapshot churn beyond intended.

## Recommended Specialist Focus

- Frontend Vue engineer (token-driven component CSS)
- Design-system reviewer (visual consistency, states)
- Test engineer (samples build + e2e a11y)