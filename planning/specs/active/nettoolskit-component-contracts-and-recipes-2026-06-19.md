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

## Implementation Evidence

### 2026-06-19 22:30 - DsButton Wrapper Slice

- Added `src/design-system/vue/components/DsButton.vue`.
- Added `src/design-system/vue/components/index.ts` and exported wrappers from `src/design-system/vue/index.ts`.
- `DsButton` renders native button markup from `NtkButtonContract` and `resolveNtkButtonRecipe()` without direct `q-btn` usage.
- Component tests cover labels, slots, icons, data attributes, recipe classes, disabled state, and loading state.
- Generated component docs now list Vue wrapper sources.
- Remaining gaps: `DsCard`, `DsInput`, `DsSelect`, `DsTable`, page wrappers, `NtkButton` open-string compatibility migration, and broader rendered behavior coverage.

### 2026-06-19 22:58 - DsCard And DsInput Wrapper Slice

- Added `src/design-system/vue/components/DsCard.vue`.
- Added `src/design-system/vue/components/DsInput.vue`.
- `DsCard` renders native card markup from `NtkCardContract` and `resolveNtkCardRecipe()` without direct Quasar usage.
- `DsInput` renders native input markup from `NtkFieldContract` and `resolveNtkFieldRecipe()` without direct Quasar usage.
- Component tests cover card title/subtitle/slots/clickable/selected states, non-clickable activation guards, and input label/message/model/invalid/disabled/readonly states.
- Generated component docs now list `DsButton`, `DsCard`, and `DsInput` wrapper sources.
- `npm test -- tests/unit/design-system/components --pool=forks --maxWorkers=1 --no-file-parallelism` passed with 3 files and 18 tests.
- `npm run verify` passed, including 39 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Remaining gaps: `DsSelect`, `DsTable`, page wrappers, `NtkButton` open-string compatibility migration, and broader focus/keyboard behavior coverage.

### 2026-06-19 23:44 - DsSelect Wrapper Slice

- Added `src/design-system/vue/components/DsSelect.vue`.
- Exported `DsSelect` from the design-system Vue component surface.
- `DsSelect` renders native select markup from `NtkFieldContract` and `resolveNtkFieldRecipe()` without direct Quasar usage.
- Component tests cover options, placeholder, model updates, invalid, disabled, readonly, required, label, and message states.
- Readonly select state now avoids model updates and resets the DOM value to the controlled model value.
- Generated component docs now list `DsButton`, `DsCard`, `DsInput`, and `DsSelect` wrapper sources.
- `npm test -- tests/unit/design-system/components/ds-select.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` passed with 1 file and 4 tests.
- `npm run type-check` passed.
- `npm run docs:check` passed.
- `npm run verify` passed, including 43 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Remaining gaps: `DsTable`, page wrappers, `NtkButton` open-string compatibility migration, full `NtkSelect` parity decisions, and broader focus/keyboard behavior coverage.

## Risks

- Dual `Ds*` and `Ntk*` surfaces can confuse consumers unless exports and docs are explicit.
- Migrating open props too early can break downstream app usage.
- Recipe outputs must not leak raw colors or spacing values.

## Planning Readiness

Ready for planning after token and theme adapters exist.

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Support: `test-engineer`