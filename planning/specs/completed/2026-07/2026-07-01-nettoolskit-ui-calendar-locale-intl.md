# NetToolsKit UI Calendar Locale via Intl - Spec

Generated: 2026-07-01 America/Sao_Paulo
LastUpdated: 2026-07-01 America/Sao_Paulo
Status: active
Priority: medium
Workstream ID: `nettoolskit-ui-calendar-locale-intl`
Phase: capability-completion

## Objective

Close the final i18n follow-up: calendar month/weekday names (and the date
picker's remaining a11y strings) follow the active locale — via
`Intl.DateTimeFormat`, so there are no hand-written month dictionaries to
maintain and any BCP-47 locale works.

## Design

- Core (`core/components/date-picker.ts`): `getNtkWeekdayLabels(locale?)` /
  `getNtkMonthLabels(locale?)` derive labels from `Intl.DateTimeFormat`
  (weekday short, month long; anchored on a known UTC Sunday), cached per
  locale, defaulting to the core registry locale. Pure — Intl is a JS
  standard, no framework. Old EN constants kept as deprecated aliases (no
  breaking export removal).
- `DsDatePicker`: weekday headers and the live month label become reactive to
  `useNtkI18n().locale`; the four remaining hardcoded a11y strings move to
  the dictionary (`a11y.chooseDate`, `a11y.calendarFor` with `{label}`
  interpolation, `a11y.previousMonth`, `a11y.nextMonth`).

## Verification

- i18n suite: en 'January' / pt-BR 'janeiro', registry-driven default,
  per-locale cache identity; picker suites updated to the pt-BR defaults
  (month label + nav aria-labels); `lint --quiet`, `type-check` green.

## Acceptance

- Switching the locale re-renders weekday headers, month label and nav/aria
  strings; explicit label props still win; core purity gate green.

## Progress Checklist

Progress: 100% (3/3 checked)

- [x] Intl-based locale-aware label getters in core (+ deprecated EN aliases)
- [x] DsDatePicker reactive wiring + 4 remaining a11y strings in the dictionary
- [x] Suites updated and green