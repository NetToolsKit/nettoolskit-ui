# NetToolsKit UI Library i18n (pt-BR / en) - Spec

Generated: 2026-07-01 America/Sao_Paulo
LastUpdated: 2026-07-01 America/Sao_Paulo
Status: active
Priority: medium-high
Workstream ID: `nettoolskit-ui-library-i18n-ptbr-en`
Phase: capability-completion

## Objective

Close the last gap from the NTK-FE-STD evaluation: a formal pt-BR/en
dictionary for the governed built-in strings, replacing the mixed hardcoded
defaults (CRUD labels in PT, table/dialog/filter labels in EN) with one
locale-resolved source. STD-002 mandates pt-BR default + en.

## Design

- **Core (pure)** `src/design-system/core/i18n/`: typed key union
  (`NtkMessageKey`, `en` is the coverage source), `pt-BR`/`en` dictionaries,
  `resolveNtkMessage(locale, key, params)` with `{placeholder}` interpolation,
  and a module-level locale registry (`set/getNtkCoreLocale`, `ntkMessage`) —
  the same registry pattern as the notification service, so pure call sites
  (validation defaults) honor the app locale without a framework dependency.
- **Vue binding** `vue/composables/useNtkI18n.ts`: reactive `ref` mirror with
  write-through to the core registry; `setNtkLocale()` switches every governed
  string at runtime; `useNtkI18n()` exposes `{ locale, t }`.
- **Plugin**: `createNetToolsKitUI({ locale })` option.
- **Components** (high-value set): `DsCrudPage` (12 labels), `DsForm`
  (submit/reset), `DsTable` (7 labels + boolean Yes/No + select-row prefix),
  `DsDialog` (close), `DsFilterBar` (apply/reset), `DsSelect`
  (empty/search placeholder). Pattern: label prop default removed; a
  `computed(() => props.x ?? t('key'))` resolves per render — **explicit props
  always win** (no API break; `hasDefault` flips in the public-API snapshot,
  reviewed).
- **Validation** (`core/schema/validation.ts`): rule default messages resolve
  from the registry at evaluation time; explicit `message` args win.

## Behavior change

Default locale is **pt-BR**: `DsTable`/`DsDialog`/`DsFilterBar`/`DsSelect`
built-in strings switch from EN to PT out of the box (CHANGELOG noted).
`createNetToolsKitUI({ locale: 'en' })` restores English globally.

## Out of scope (follow-up)

Long-tail a11y-only labels (DsDrawer/DsBanner/DsChip/DsToast/DsDatePicker/
DsHeader/DsBreadcrumbs/DsTabs/industrial family) keep their EN defaults and
prop overrides; wiring them to the same dictionary is mechanical and can ride
any later PR.

## Verification

- New `tests/unit/design-system/i18n/i18n.spec.ts`: key coverage across
  locales, resolution + interpolation, validation-rule locale switch at
  evaluation time, reactive component switching (DsForm/DsTable), prop
  override precedence, `useNtkI18n` reactivity.
- Full design-system suite (35 files / 596 tests) green; public-API snapshot
  regenerated — diff is exactly the `hasDefault` flips for moved labels.
- Gates: `lint --quiet`, `type-check`, `layers:check` (core i18n is pure; the
  Vue mirror lives in the binding layer), `docs:check`.

## Acceptance

- `createNetToolsKitUI({ locale: 'en' })` renders every governed string in
  English; omitting it renders pt-BR; `setNtkLocale()` switches at runtime.
- Explicit label props and explicit validation messages always override.
- Core purity gate stays green (no Vue in `core/i18n`).

## Progress Checklist

Progress: 100% (5/5 checked)

- [x] Core dictionaries + registry + interpolation (pure)
- [x] `useNtkI18n` reactive mirror + `setNtkLocale` + plugin `locale` option
- [x] Six high-value components resolve labels by locale (props win)
- [x] Validation rule messages localized at evaluation time
- [x] i18n suite + snapshot review + CHANGELOG entry