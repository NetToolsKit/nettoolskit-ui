# NetToolsKit UI i18n A11y Long-Tail Labels - Spec

Generated: 2026-07-01 America/Sao_Paulo
LastUpdated: 2026-07-01 America/Sao_Paulo
Status: active
Priority: medium
Workstream ID: `nettoolskit-ui-i18n-a11y-longtail`
Phase: capability-completion

## Objective

Complete the library i18n milestone: wire the remaining hardcoded
accessibility labels (the "long tail" recorded as follow-up in the library
i18n spec) to the `core/i18n` dictionary so screen-reader strings follow the
active locale everywhere, with explicit props still winning.

## Scope (21 labels / 18 components)

New `a11y.*` keys (pt-BR/en) + locale-resolved computed fallbacks in:
`DsChip` (remove), `DsBanner`/`DsToast`/`DsToastHost` (dismiss, notifications),
`DsBreadcrumbs`, `DsSidebar`, `DsDrawer` (aria/nav/close — close reuses
`dialog.close`), `DsDockLayout`, `DsHeader` (open menu), `DsRibbon`,
`DsDatePicker`/`DsTimePicker` (trigger labels), `DsTabs`, `DsStatusBar`,
`DsQuickAccessToolbar`, `DsSteps` (progress), `DsTreeExplorer`,
`DsWorkspaceCanvas`.

Application was a deterministic codemod (same pattern as the first i18n
wave): remove the `withDefaults` literal; add
`computed(() => props.x ?? ntkI18n.t(key))`. Seven test assertions pinned to
the old EN defaults were updated to the pt-BR defaults; the public-API
snapshot was regenerated (diff = `hasDefault` flips only).

## Out of scope

Calendar month/weekday names (`ntkMonthLabels`/`ntkWeekdayLabels` in core)
stay EN — localizing the calendar grid is a core data change, recorded as the
only remaining i18n follow-up.

## Verification

- Full suite + coverage gate green: 91.5% stmts / 83.7% branches / 91.8%
  funcs / 91.6% lines (floors 90/82/90/90 enforced).
- New i18n assertions prove a11y keys switch pt-BR <-> en.
- `lint --quiet`, `type-check` green.

## Acceptance

- No `Label: '<EN literal>'` defaults remain in `Ds*` components; every
  governed string resolves from the dictionary; props override everywhere.

## Progress Checklist

Progress: 100% (3/3 checked)

- [x] `a11y.*` keys (pt-BR/en) added with full key-coverage parity
- [x] 21 labels across 18 components wired via locale-resolved computeds
- [x] Test expectations updated + snapshot regenerated + gates green