# Core Extraction — Composable → Core Migration Map

This is the migration map for the
`nettoolskit-ui-framework-agnostic-core-extraction` spec: which logic in
`src/composables/**` is **pure** (belongs in `src/design-system/core/**`,
portable to any framework) versus **Vue reactivity glue** (stays in the
composable). It is the design artifact that makes the eventual logic-move
mechanical; see [`binding-contract.md`](./binding-contract.md) for what a
binding consumes and [`layers.md`](./layers.md) for the layer taxonomy.

> **Status:** in progress. The map below is the plan; extractions land
> incrementally, each leaving the composable's public signature unchanged and
> carrying a core unit test. **Landed so far:** `useDebounce` → `core/timing`
> (createDebouncer/createThrottler) and `FormValidationService` → `core/validators`.

## Baseline (verified 2026-06-30)

- `src/design-system/core/**` imports `vue` **zero** times — confirmed by grep
  and now **enforced** by the `core-purity` rule in
  [`scripts/check-layers.mjs`](../../scripts/check-layers.mjs). This is the
  import-boundary rule the extraction spec called for; it shipped with the
  layer-taxonomy formalization.
- 14 composables audited; 11 import Vue (`ref`/`computed`/`watch`/lifecycle).
  Their *logic* is often pure but is currently trapped behind reactive wrappers,
  so today it would be re-authored per framework instead of reused.

## Migration table

| Composable | Vue APIs used | Pure logic to expose in `core/` | Thin Vue wrapper left behind | Class |
|---|---|---|---|---|
| `forms/useFormRules.ts` | none | ValidationService rules (required, email, CPF, phone…) | re-export | **MOSTLY-PURE** |
| `services/useNotification.ts` | none | NotificationService delegation | adapter accessor | **MOSTLY-PURE** |
| `ui/useBranding.ts` | `computed` | brand-config lookups (logo, contact, nav, social) | computed over `useTheme` | **MOSTLY-PURE** |
| `ui/useDialog.ts` | `ref`, `computed` | dialog state machine (open/close/toggle/reset) | reactive state container | **MOSTLY-PURE** |
| `ui/useToast.ts` | `ref`, `readonly` | toast queue mutations, id gen, timer scheduling | singleton refs + timer map | **MOSTLY-PURE** |
| `utils/useAsync.ts` | `ref` | async state transitions (idle/loading/error/data) | reactive loading/error/data | **MOSTLY-PURE** |
| `utils/useDebounce.ts` | `ref` | debounce/throttle timing algorithm | ref-wrapped timeout ids | **MOSTLY-PURE** |
| `ui/useColorScheme.ts` | `ref`, `computed`, `readonly`, `onScopeDispose` | `resolveColorScheme()`, `applyColorScheme()`, mode validation | singleton refs + media-query listener lifecycle | **MIXED** |
| `ui/useTheme.ts` | `ref`, `computed`, `readonly` | `applyThemeToCSS()` (brightness/derivation/CSS-var mapping) | singleton theme state + computed selectors | **MIXED** |
| `useThemeSwitcher.ts` | `ref`, `watch` | theme-id validation, preference persistence | reactive theme state + DOM-sync watcher | **MIXED** |
| `data/useFilters.ts` | `ref`, `computed`, `watch`, router | filter state, serialization, query-param math | refs + router sync + watcher | **MIXED** |
| `data/useTableColumns.ts` | `ref`, `computed`, `watch` | column visibility/reorder/filter logic | reactive state + localStorage persist | **MIXED** |
| `ui/useDialogActions.ts` | Quasar `useQuasar()` | — (Quasar wrapper) | Quasar dialog/notify integration | **VUE-IDIOMATIC** |
| `ui/useResponsive.ts` | `computed`, Quasar `useQuasar()` | breakpoint predicates (isMobile/isTablet) | Quasar screen accessors | **VUE-IDIOMATIC** |

## Recommended extraction order (highest value, lowest risk first)

1. **`forms/useFormRules.ts` → `core/validators/`** — ✅ **landed.**
   `FormValidationService` (already pure) now lives in
   `src/design-system/core/validators/`; `useFormRules` re-exports it unchanged.
2. **`ui/useColorScheme.ts` exported fns → `core/color-scheme/`** — pure
   `resolveColorScheme()` / `applyColorScheme()` / mode guard; wrapper keeps the
   singleton refs + media-query listener. Risk: low.
3. **`ui/useTheme.ts` `applyThemeToCSS()` → `core/theme/`** — brightness/CSS-var
   derivation; wrapper keeps the reactive theme state. Risk: low.
4. **`utils/useDebounce.ts` timing → `core/timing/`** — ✅ **landed.**
   `createDebouncer`/`createThrottler` are framework-free; `useDebouncedSearch`/
   `useThrottle` are reactive shells with the same public API.
5. **`ui/useToast.ts` queue → `core/notifications/`** — queue mutations + id gen
   as a pure factory with injected timer; wrapper keeps the singleton refs.
   Risk: medium (stateful timer management — needs DI).

## Leave in the composable (do not extract)

- `ui/useDialogActions.ts`, `ui/useResponsive.ts` — Quasar-hard-coupled.
- `data/useFilters.ts`, `data/useTableColumns.ts` — router/localStorage tightly
  woven; extract only the underlying service math if/when needed.
- `services/useNotification.ts` — already a thin adapter over a pure service.

## Extraction rules (when the move happens)

- Keep each composable's **public name + signature** unchanged; it becomes a
  reactive shell over the new core function.
- Only move logic that is **genuinely pure** — over-extraction hurts
  debuggability. Leave Vue-idiomatic glue where it reads naturally.
- Every moved unit gets a **core unit test** (core carries the 100% coverage
  gate).
- `core/` stays Vue-free/DOM-free — the `core-purity` gate fails the build
  otherwise. The one legit DOM toucher (`workspace-canvas.ts`) is the documented
  exception.
- Do **not** change `package.json` published paths in the extraction; the package
  split is internal boundaries + the lint rule, not a publish change.