# NetToolsKit Component Contracts And Recipes - Spec

Date: 2026-06-19
Status: completed - archived
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

### 2026-06-20 00:02 - DsTable Wrapper Slice

- Added `src/design-system/core/components/table.ts` with `NtkTableContract`, typed columns/rows, table variants, defaults, and recipe classes.
- Added `src/design-system/vue/components/DsTable.vue`.
- Exported the table contract/recipe from the core component surface and `DsTable` from the design-system Vue component surface.
- `DsTable` renders native table markup without direct Quasar usage.
- Component tests cover table recipe output, caption/accessibility label behavior, headers, rows, selected keys, select-all state, row clicks, keyboard row activation, empty state, custom cells, and recipe classes.
- Generated component docs now list button, field, card, and table contracts plus `DsButton`, `DsCard`, `DsInput`, `DsSelect`, and `DsTable` wrapper sources.
- `npm test -- tests/unit/design-system/components/component-recipes.spec.ts tests/unit/design-system/components/ds-table.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` passed with 2 files and 15 tests.
- `npm run type-check` passed.
- `npm run docs:check` passed.
- `npm run verify` passed, including 48 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Remaining gaps: page wrappers, `NtkDataTable` compatibility decisions, `NtkButton` open-string compatibility migration, full `NtkSelect` parity decisions, and broader CMS direct Quasar migration.

### 2026-06-20 00:14 - DsPage And DsSection Wrapper Slice

- Added `src/design-system/core/components/page.ts` with `NtkPageContract`, page variants, defaults, and recipe classes.
- Added `src/design-system/core/components/section.ts` with `NtkSectionContract`, section variants, heading-level control, defaults, and recipe classes.
- Added `src/design-system/vue/components/DsPage.vue` and `src/design-system/vue/components/DsSection.vue`.
- Exported the page and section contracts/recipes from the core component surface and the Vue wrappers from the design-system Vue component surface.
- `DsPage` renders a native `main` landmark and `DsSection` renders a native `section` without extra landmark roles or direct Quasar usage.
- The wrappers apply `aria-labelledby` only when the internal title is rendered with a stable id; custom header slots require consumer-owned labelling through `ariaLabel` or custom markup.
- Added optional `actions` slots plus header, body, and footer slot coverage.
- Generated component docs now list button, field, card, table, page, and section contracts plus seven Vue wrapper sources.
- Focused validation passed: `npx vitest run --config tests/vitest.config.ts tests/unit/design-system/components/component-recipes.spec.ts tests/unit/design-system/components/ds-page-section.spec.ts tests/unit/design-system/docs/design-system-docs.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 21 tests.
- `npm run type-check` passed.
- `npm run docs:check` passed.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Remaining gaps: `NtkDataTable` compatibility decisions, `NtkButton` open-string compatibility migration, full `NtkSelect` parity decisions, broader CMS direct Quasar migration, and final PR/CI/review closeout.

### 2026-06-20 00:36 - NtkButton Compatibility Slice

- Kept `src/components/ui/NtkButton.vue` as a Quasar-backed compatibility adapter.
- Added design-system compatibility aliases for `variant`, `intent`, and `disabled`.
- Preserved open legacy props by keeping public `variant` and `intent` string-compatible and leaving `size`, `padding`, `color`, `flat`, `outline`, `unelevated`, navigation, and layout props intact.
- Unknown legacy `variant` strings continue to pass through to the Quasar adapter instead of being narrowed to design-system variants.
- `disable` remains the primary legacy disabled prop; `disabled` maps to Quasar `disable` only when `disable` is not explicitly provided.
- Recognized button contract values now add `resolveNtkButtonRecipe()` classes, including variant, size, intent, disabled, and loading classes.
- Focused validation passed: `npm run test -- tests/unit/components/ui/BaseButton.spec.ts tests/unit/components/ui/NtkUiComponents.spec.ts tests/unit/components/ui/NtkPublicColorInputSanitization.spec.ts tests/unit/design-system/components/component-recipes.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 4 files and 100 tests.
- `npm run type-check` passed.
- `npm run test:design-system` passed with 11 files and 55 tests.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Remaining gaps: `NtkDataTable` compatibility decisions, full `NtkSelect` parity decisions, broader CMS direct Quasar migration, and final PR/CI/review closeout.

### 2026-06-20 01:21 - NtkDataTable Compatibility Slice

- Kept `src/components/ui/NtkDataTable.vue` as a Quasar-backed compatibility adapter.
- Added design-system compatibility props for `variant`, `size`, and `intent` without replacing `QTable` or narrowing existing row/column/action contracts.
- Recognized table contract values now add `resolveNtkTableRecipe()` classes while preserving the legacy `.ntk-data-table` selector used by template runtime tests.
- Preserved Quasar selection updates, row-click behavior, row actions, status cells, custom cell slots, row classes, and empty/status labels.
- Focused validation passed: `npm test -- tests/unit/components/ui/NtkDataTable.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 1 file and 8 tests.
- Focused recipe/table validation passed: `npm run test -- tests/unit/components/ui/NtkDataTable.spec.ts tests/unit/design-system/components/component-recipes.spec.ts tests/unit/design-system/components/ds-table.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 24 tests.
- `npm run type-check` passed.
- `npm run lint -- --quiet` passed.
- `npm run test:design-system` passed with 11 files and 55 tests.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Remaining gaps: full `NtkSelect` parity decisions, broader CMS direct Quasar migration, and final PR/CI/review closeout.

### 2026-06-20 01:53 - NtkSelect Compatibility Slice

- Kept `src/components/form/NtkSelect.vue` as a Quasar-backed compatibility adapter.
- Added design-system compatibility props for `variant`, `size`, `intent`, `disabled`, `invalid`, and `required` without replacing `QSelect` or changing multiple/chips/menu behavior.
- Recognized field contract values now add `resolveNtkFieldRecipe()` classes while preserving the legacy `.ntk-select` selector.
- Preserved explicit legacy prop precedence for `outlined`, `filled`, `dense`, and `disable`; `outlined`/`filled` are treated as one visual group so partial legacy input wins over `variant`.
- Kept `size="lg"` as class-only compatibility and `required` as ARIA/state-only for this slice to avoid changing Quasar validation behavior.
- Focused validation passed: `npm test -- tests/unit/components/form/NtkFormComponents.spec.ts tests/unit/design-system/components/component-recipes.spec.ts tests/unit/design-system/components/ds-select.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 41 tests.
- `npm run type-check` passed.
- `npm run lint -- --quiet` passed.
- `npm run test:design-system` passed with 11 files and 55 tests.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Remaining gaps: broader CMS direct Quasar migration and final PR/CI/review closeout.

### 2026-06-20 02:20 - NtkInput Compatibility Slice

- Kept `src/components/form/NtkInput.vue` as a Quasar-backed compatibility adapter.
- Added design-system compatibility props for `variant`, `size`, `intent`, `disabled`, `invalid`, and `required` without replacing `QInput` or changing v-model behavior.
- Recognized field contract values now add `resolveNtkFieldRecipe()` classes while preserving the legacy `.ntk-input` selector.
- Preserved explicit legacy prop precedence for `outlined`, `filled`, `dense`, and `disable`; `outlined`/`filled` are treated as one visual group so partial legacy input wins over `variant`.
- Kept `size="lg"` as class-only compatibility and `required` as ARIA/state-only for this slice to avoid changing Quasar validation behavior.
- Extended the compatibility type surface on 2026-06-20 03:34 to pass `type="datetime-local"` through to the underlying `QInput` for CMS release scheduling fields.
- Focused validation passed: `npm test -- tests/unit/components/form/NtkFormComponents.spec.ts tests/unit/design-system/components/component-recipes.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 2 files and 41 tests.
- Additional release scheduling validation passed: `npm test -- tests/unit/components/form/NtkFormComponents.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 52 tests.
- `npm run type-check` passed.
- `npm run lint -- --quiet` passed.
- `npm run test:design-system` passed with 11 files and 55 tests.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Remaining gaps: broader CMS direct Quasar migration, bridge selector reduction, and final PR/CI/review closeout.

## Risks

- Dual `Ds*` and `Ntk*` surfaces can confuse consumers unless exports and docs are explicit.
- Migrating open props too early can break downstream app usage.
- Recipe outputs must not leak raw colors or spacing values.

## Planning Readiness

Ready for planning after token and theme adapters exist.

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Support: `test-engineer`