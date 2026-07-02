# NetToolsKit UI Branch Coverage Push - Spec

Generated: 2026-07-01 America/Sao_Paulo
LastUpdated: 2026-07-01 America/Sao_Paulo
Status: active
Priority: medium
Workstream ID: `nettoolskit-ui-branch-coverage-push`
Phase: quality-hardening

## Objective

Push branch coverage toward the 90% line-metric parity goal with genuine
state-permutation tests, and raise every enforced floor to the new plateau.

## Result (honest accounting)

- Branches: **83.52% -> 86.31%** (+70 covered branches). Statements/functions/
  lines rose to **93.43 / 93.86 / 93.47**.
- Floors raised: statements/functions/lines 90 -> **92**, branches 82 -> **85**.
- Branch parity with 90 is **not yet reached**; the remaining pools are
  keyboard/edge paths in `DsTimePicker`, `DsSelect`, `DsDrawer`, `DsForm`
  type-coercion edges and `useTableColumns` reorder/add/remove — recorded as
  the follow-up scope for the next push.

## What was tested

- `useColorScheme` full matrix: system vs explicit resolution, matchMedia
  absence, DOM apply/clear, storage persistence + quota failure, invalid
  stored mode, toggle cycle, and the system-change listener on a fresh module
  instance (singleton isolated via `vi.resetModules`).
- `useThemeSwitcher`: persist/reset/bootstrap incl. missing
  `requestAnimationFrame` branch.
- `useBranding` REAL module (the global setup mocks it for component suites;
  `vi.importActual` bypasses the mock): known-brand vs fallback catalog
  selection with mutation-tolerant intersection assertions.
- Semantic color overrides: derived border/positive/negative fallbacks vs
  explicit overrides vs reset.
- `theme-dom` option permutations: explicit structural colors, `presetId`
  null-clear, `templateScope` off, `themeVars` null-removal.
- Vue compat adapters: all six button variant flag mappings, field variant
  matrix + `dense` derivation, neutral-card accent suppression.
- Component permutations: DsForm metadata/columns/actions-off/checkbox rule
  errors + the schema fail-fast for option fields without options; DsDialog
  fallback ids/description/aria-label; DsTable custom empty-value and
  select-row labels + caption precedence; DsCrudPage read-only resource,
  descending default sort, non-Error failure stringification, fetch-less
  static resource.

## Verification

- Full suite 67 files / 923 tests green WITH the raised floors enforced;
  `lint --quiet`, `type-check` green.

## Progress Checklist

Progress: 100% (3/3 checked) — follow-up scope recorded above

- [x] Branch pools ranked from the coverage JSON and attacked by size
- [x] Permutation suites added (composables/config/adapters/components)
- [x] Floors raised to the achieved plateau (92/85/92/92)