# NetToolsKit Component Contracts And Recipes - Spec

Date: 2026-06-19
Status: active
Priority: P1
Sequence: 04
Source Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`

## Design Intent

Create typed visual contracts, pure recipes, and component wrappers so features express visual intent through semantic props instead of direct Quasar props, raw colors, open strings, or page-local overrides.

## Current Evidence

Existing useful components:

- `src/components/ui/NtkButton.vue`
- `src/components/ui/NtkCard.vue`
- `src/components/form/NtkInput.vue`
- `src/components/form/NtkSelect.vue`
- `src/components/ui/NtkDataTable.vue`

Existing issue examples:

- `NtkButton` accepts `color?: string` and `padding?: string`.
- Some wrappers use `!important` to override Quasar internals.
- Many templates use direct `q-btn`, `q-input`, and `q-select`.

## Decisions

1. Component contracts must use closed semantic props such as `tone`, `variant`, `size`, and `density`.
2. Pure recipes resolve semantic props to classes, attributes, and token variables.
3. `Ds*` components implement the standard component API.
4. `Ntk*` components remain as compatibility exports until migration closes.
5. Direct Quasar internals may be used inside wrapper/adapters only.
6. All reference components must cover default, hover, active, focus-visible, disabled, loading, readonly, error, success, selected, expanded, empty, and skeleton states when applicable.

## Target Paths

- future `src/design-system/core/contracts/**`
- future `src/design-system/core/recipes/**`
- future `src/design-system/vue/components/**`
- future `src/design-system/public-api.ts`
- existing `src/components/ui/**`
- existing `src/components/form/**`
- existing `index.ts`
- existing `tests/unit/components/**`

## Design Slice Matrix

| Slice | Component Boundary | Validation |
|---|---|---|
| Button | `DsButton`, `NtkButton` compatibility | recipe tests, component tests, keyboard/focus tests |
| Card | `DsCard`, `NtkCard` compatibility | variant and padding tests |
| Field | `DsInput`, `DsSelect`, form wrappers | label, error, hint, aria tests |
| Table | `DsTable`, `NtkDataTable` compatibility | row key, selection, empty, responsive tests |
| Page | `DsPage`, `DsSection`, header/actions | layout and semantic landmark tests |

## Acceptance Criteria

1. Contracts and recipes exist before broad template migration.
2. `Ds*` components expose the required semantic API.
3. `Ntk*` exports remain compatible or document breaking changes.
4. Open visual strings are replaced by controlled enums or named escape hatches.
5. Component tests prove recipe output and rendered Quasar behavior.

## Risks

- Dual `Ds*` and `Ntk*` surfaces can confuse consumers unless exports and docs are explicit.
- Migrating open props too early can break downstream app usage.
- Recipe outputs must not leak raw colors or spacing values.

## Planning Readiness

Ready for planning after token and theme adapters exist.

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Support: `test-engineer`