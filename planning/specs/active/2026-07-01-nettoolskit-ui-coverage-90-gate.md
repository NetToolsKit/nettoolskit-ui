# NetToolsKit UI Coverage >= 90% + Enforced Gate - Spec

Generated: 2026-07-01 America/Sao_Paulo
LastUpdated: 2026-07-01 America/Sao_Paulo
Status: active
Priority: high
Workstream ID: `nettoolskit-ui-coverage-90-gate`
Phase: quality-hardening

## Objective

Raise suite coverage to >= 90% with genuine behavior tests (no data-restating
fillers, no dishonest exclusions) and lock the result as an enforced vitest
threshold so it cannot regress silently.

## Baseline -> Result (2026-07-01)

- Baseline: 81.18% statements / 81.23% lines / 82.85% functions / 76.96%
  branches (3,986 statements measured).
- Result: **91.37% statements / 91.48% lines / 91.69% functions / 83.52%
  branches** — +409 covered statements via 100+ new behavior tests.

## What was tested (all behavior, no restatements)

- **Config catalogs** (were 0%): helper semantics (getTypography/Spacing/
  Effects/Theme/Identity/Navigation/Content/Responsive), DOM application
  (`applyTypography` token writes, `applySpacing`/`applyEffects` `--ntk-*`
  discipline), phone/WhatsApp/social utilities, breakpoint boundary math,
  notification style switching + config merge, preset category mapping +
  developer-feature toggles + `applyNettoolskitPreset` DOM/meta effects.
- **Services**: FilterService activity detection, URL round-trip typing
  (number/boolean/CSV-array restore, foreign-key drop), clear-vs-reset
  semantics, copy-not-reference, change notification, factory caching;
  NotificationService base console routing, per-type defaults, constructor
  config, loading handle.
- **Optional-quasar surface** (was 0%): useResponsive breakpoint derivation
  against a mocked `quasar`, Notify adapter type mapping/actions/loading
  dismissal, singleton.
- **Composables**: useAsync state machine (loading/data/error/retry/
  immediate), useBranding brand resolution + unknown-identity fallback.
- **Components**: DsFormPage (was 0%) full passthrough contract; DsInput
  types/textarea/events/invalid; DsDialog persistent policy, hideClose,
  variant/size classes, actions close scope; DsDrawer lifecycle; DsSelect
  search filter, disabled, full trigger keyboard contract (open/move/commit/
  home/end/escape/tab); DsDatePicker popup lifecycle, month nav, day
  selection, popup keyboard; utils gaps (relative-time buckets, CPF/CNPJ
  check-digit matrix, password requirement matrix).

## Honesty measures

- Only new exclusion: `src/design-system/tokens/generated.ts` (+ `generated/`)
  — a committed build artifact ("do not edit manually"); everything else
  earns coverage through tests.
- `core/i18n` logic moved out of the excluded barrel filename
  (`index.ts` -> `messages.ts` + re-export barrel) so it is measured.
- Thresholds set at the achieved floor: statements/functions/lines **90**,
  branches **82** (achieved 83.52 — branch parity with the 90 line goal is a
  follow-up, mostly keyboard/edge paths in pickers and industrial widgets).
  Core components/schema keep their 100% thresholds. Raising a floor requires
  tests; lowering one requires an ADR.

## Verification

- `npm run test:coverage` green WITH thresholds enforced (exit 1 on
  regression); `lint --quiet`; `type-check`.

## Acceptance

- Coverage >= 90% on statements/functions/lines with the gate enforced in
  `tests/vitest.config.ts`; suite passes; no non-generated exclusions added.

## Progress Checklist

Progress: 100% (4/4 checked)

- [x] Baseline measured and gaps ranked by uncovered statements
- [x] Behavior suites for config/services/composables/components/utils
- [x] Honesty fixes (generated-artifact exclusion only; i18n barrel rename)
- [x] Thresholds enforced (90/82/90/90 global + core 100)