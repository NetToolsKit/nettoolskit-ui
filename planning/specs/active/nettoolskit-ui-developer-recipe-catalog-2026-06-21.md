# NetToolsKit UI Developer Recipe Catalog - Spec

Generated: 2026-06-21 21:43 America/Sao_Paulo
LastUpdated: 2026-06-21 21:43 America/Sao_Paulo
Status: active
Priority: high
Branch: `TBD`
Workstream ID: `nettoolskit-ui-developer-recipe-catalog`
Related Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`
Related Baseline: `planning/specs/completed/2026-06/nettoolskit-ui-library-only-surface-2026-06-21.md`

## Objective

Create a developer-facing recipe catalog that shows how to assemble common
screens with `Ds*` and reusable `Ntk*` compatibility components without writing
custom CSS or reaching directly for Quasar.

## Normalized Request Summary

The design system foundation is useful only if a product developer can quickly
answer: "how do I build this page correctly?" This spec registers the need for
copyable, library-only recipes covering CRUD, dashboard, form, table, filter,
empty-state and dialog workflows.

## Design Intent

The catalog should be an implementation guide, not a marketing site and not a
product runtime. It should teach the approved composition patterns by rendering
real components with deterministic fixtures and showing concise usage snippets.

Target developer experience:

```txt
Need a CRUD list?
  -> open catalog recipe
  -> copy semantic Ds composition
  -> adjust domain fields
  -> no local CSS needed for normal states
```

## Recipe Scope

Initial recipes:

- CRUD list with `DsPage`, `DsPageHeader`, `DsFilterBar`, `DsTable`.
- Create/edit form with `DsFormLayout`, `DsInput`, `DsSelect`, `DsButton`.
- Dashboard overview with `DsMetricGrid`, `DsCard`, `DsSection`.
- Empty/no-results/error state with `DsEmptyState` and actions.
- Dialog action flow with `DsDialog` and command buttons.
- Responsive page section layout with density variants.
- Token and theme switch preview for light/dark/density behavior.

## Key Decisions

- The catalog must live in library-owned sample/docs paths, not product paths.
- Recipes must use deterministic local fixture data and no backend dependency.
- Examples must prefer `Ds*` first; `Ntk*` appears only as compatibility or
  migration context.
- Code snippets must avoid raw Quasar tags, raw colors, `:deep()`, and
  one-off CSS.
- The catalog must be small enough for `npm run build:samples` to remain a
  fast package gate.

## Design Slice Matrix

| Slice | Target paths | Standardization impact | Security impact | Performance impact | Acceptance signal |
|---|---|---|---|---|---|
| Catalog shell | `samples/**` | Gives developers one place to inspect approved patterns | Uses static local fixtures only | Keeps sample build lightweight | `npm run build:samples` passes |
| Recipe fixtures | `samples/**` or `docs/**` | Makes examples deterministic and reviewable | Avoids live API/secrets/product data | Keeps runtime predictable | Fixture data has no product-owned payloads |
| Usage docs | `README.md`, `COMPONENTS.md`, optional recipe docs | Reduces ambiguity between `Ds*`, `Ntk*`, and Quasar | Documents safe APIs and escape hatch policy | Lowers repeated implementation effort | Docs link each recipe to components |
| Validation | tests and scripts as needed | Prevents recipes from drifting into direct Quasar/CSS | Keeps unsafe style values out of examples | Build/lint gates catch regressions | `npm run verify` includes sample build |

## Alternatives Considered

| Alternative | Decision | Reason |
|---|---|---|
| Keep only API docs | Rejected | API docs do not teach whole-screen composition. |
| Restore removed template runtime | Rejected | Product templates belong downstream, not in this library. |
| Build a large Storybook-like app immediately | Deferred | Useful later, but a small Vite sample catalog is enough to start. |
| Place examples only in README | Rejected | Static snippets drift and do not prove components render. |

## Risks

- Recipes can become product templates if they include domain logic or routing.
- Too many examples can slow the sample build.
- If snippets are hand-written separately from rendered examples, they can drift.
- Developers may keep using old `Ntk*` patterns unless recipes clearly prefer
  `Ds*`.

## Acceptance Criteria

- Catalog renders the initial recipe set using library components only.
- Each recipe has a short usage explanation and a copyable composition snippet.
- Sample build remains part of the package validation path.
- Active scans find no product/CMS/template runtime paths in the catalog.
- `npm run verify` passes.

## Planning Readiness

Ready for execution planning after the component expansion spec identifies
which `Ds*` components are available in the first implementation slice.

## Recommended Specialist Focus

- Super Agent controller
- Frontend Vue/Quasar engineer
- Docs/release engineer for recipe wording
- Test engineer for sample build and smoke coverage