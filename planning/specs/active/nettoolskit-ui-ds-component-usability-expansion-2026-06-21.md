# NetToolsKit UI DS Component Usability Expansion - Spec

Generated: 2026-06-21 21:43 America/Sao_Paulo
LastUpdated: 2026-06-21 21:43 America/Sao_Paulo
Status: active
Priority: high
Branch: `TBD`
Workstream ID: `nettoolskit-ui-ds-component-usability-expansion`
Related Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`
Related Baseline: `planning/specs/completed/2026-06/nettoolskit-ui-library-only-surface-2026-06-21.md`

## Objective

Expand the `Ds*` component surface so downstream product developers can build
common application screens with semantic components instead of hand-authored
CSS, direct Quasar primitives, or local layout conventions.

## Normalized Request Summary

The current library foundation already has tokens, recipes, adapters and base
wrappers, but developer usability is still limited because real screens need
more than button, card, field, select, table, page and section. This spec
registers the missing high-utility components that make the standard practical
for `NetToolsKit.One` and other downstream products.

## Design Intent

Developers should express page intent through stable design-system components:

```txt
page shell
  -> page header and action area
  -> filter/search bar
  -> card or table region
  -> empty/loading/error states
  -> dialog or drawer action flow
```

The design system owns visual consistency, spacing, density, focus behavior,
state classes, and token use. Product code should compose these blocks without
writing custom CSS for ordinary CRUD, dashboard, form, or review workflows.

## Target Component Set

Initial high-value additions:

- `DsPageHeader`: page title, description, breadcrumb/action slots.
- `DsToolbar`: dense command/action surface with responsive wrapping.
- `DsFilterBar`: search, filters, reset, submit/apply actions.
- `DsFormLayout`: label/help/error layout and responsive field grouping.
- `DsDialog`: accessible modal wrapper with title/body/actions contract.
- `DsEmptyState`: empty/error/no-results state with icon, text and action.
- `DsMetricGrid`: responsive metric cards without product-specific styling.
- `DsStateBlock`: loading, error, success and skeleton placeholders.

## Key Decisions

- Components must use closed semantic props such as `variant`, `intent`, `size`,
  `density`, `loading`, `invalid`, `disabled`, and `selected`.
- Components must be backed by contracts and recipes under
  `src/design-system/core/components/**` before or alongside Vue wrappers.
- Quasar internals may be used inside adapters/wrappers, but the public API must
  remain `Ds*`.
- Components must have accessibility semantics by default: landmarks,
  labels, focus handling, `aria-*` where required, and keyboard-safe actions.
- Product-specific text, domain state, API calls, routing and CMS behavior are
  out of scope.

## Design Slice Matrix

| Slice | Target paths | Standardization impact | Security impact | Performance impact | Acceptance signal |
|---|---|---|---|---|---|
| Contracts and recipes | `src/design-system/core/components/**` | Gives each new component a typed semantic API | Prevents arbitrary style strings and unsafe CSS values | Pure functions remain cheap and tree-shakeable | Contract tests cover allowed variants/states |
| Vue wrappers | `src/design-system/vue/components/**` | Makes common screen patterns copyable and consistent | Keeps Quasar use encapsulated | Avoids product pages adding local layout/CSS debt | Unit tests mount states and slots |
| Style tokens | `src/styles/**`, `src/design-system/tokens/**` | Keeps spacing, radius, state and density centralized | Avoids raw external theme input in component styles | Shared CSS reduces repeated product CSS | `tokens:check` and style gates pass |
| Public exports | `index.ts`, `src/design-system/vue/components/index.ts` | Makes the new components available through the package | Avoids private path imports | Keeps package surface explicit | Type declarations include the components |
| Docs | `COMPONENTS.md`, `README.md`, samples | Makes usage discoverable for devs | Avoids undocumented escape hatches | Reduces trial-and-error implementation cost | Generated docs list contracts and examples |

## Alternatives Considered

| Alternative | Decision | Reason |
|---|---|---|
| Keep only primitive `Ds*` wrappers | Rejected | Developers still need custom CSS and layout glue for real screens. |
| Tell product teams to compose `Ntk*` components | Rejected | Legacy `Ntk*` still carries Quasar/CSS debt and mixed conventions. |
| Add full product templates back into this repo | Rejected | The library-only cleanup intentionally moved product surfaces downstream. |
| Expose raw Quasar wrappers with pass-through props | Rejected | This recreates direct Quasar coupling under a different name. |

## Risks

- Component scope can grow into product templates if not kept domain-neutral.
- Too many props can recreate arbitrary styling through component APIs.
- Incomplete accessibility behavior in `DsDialog` could create downstream risk.
- If docs are weak, developers may still bypass components and use Quasar
  directly.

## Acceptance Criteria

- Each added `Ds*` component has a typed contract, recipe, Vue wrapper and tests.
- No new raw hex colors, unmanaged `:deep()`, direct `.q-*` selectors, or
  unmanaged direct `q-*` tags are introduced outside allowed wrappers.
- Components support the expected baseline states: default, hover/focus where
  applicable, disabled, loading, error/empty and responsive layout.
- Generated component docs include the new components and prop contracts.
- `npm run verify` passes.

## Planning Readiness

Ready for execution planning after the current library-only cleanup PR is
merged or this spec is assigned to a new feature branch.

## Recommended Specialist Focus

- Super Agent controller
- Frontend Vue/Quasar engineer
- Test engineer for component states and accessibility behavior
- Docs/release engineer for generated docs and examples