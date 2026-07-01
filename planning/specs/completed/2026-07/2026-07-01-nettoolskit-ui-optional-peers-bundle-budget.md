# NetToolsKit UI Optional Peers + Bundle Budget Gate - Spec

Generated: 2026-07-01 America/Sao_Paulo
LastUpdated: 2026-07-01 America/Sao_Paulo
Status: active
Priority: medium-high
Workstream ID: `nettoolskit-ui-optional-peers-bundle-budget`
Phase: packaging-performance

## Objective

Make `quasar` and `vue-router` genuinely optional for consumers (install AND
bundle time), and add a deterministic bundle-budget gate so the published
surface cannot silently grow or re-acquire the optional peers.

## Background

`peerDependenciesMeta.optional` alone would be a footgun: the root entry
statically imported `quasar` through three chains (adapter → `useNotification`;
`useThemeSwitcher` → `theme-dom` → `Dark`; `useDialogActions`/`useResponsive`)
and `vue-router` through `useFilters`, so `vite build` in an app without those
peers fails at resolve time. Real optionality requires the optional-peer
surface to live behind subpath entries (the pattern used across the ecosystem)
— aligned with ADR-0006.

## Scope

- **Subpath entries** (`tsup` + `exports`): `@nettoolskit/ui/quasar`
  (QuasarNotificationAdapter, `useDialogActions`, `useResponsive`,
  `installQuasarServices()`) and `@nettoolskit/ui/router` (`useFilters`).
  Removed from the root entry (breaking on the 0.0.x preview line; MIGRATION
  section added).
- **`useNotification`** resolves its backend lazily through the existing
  `get/setNotificationService()` registry; default = framework-free base
  service; `installQuasarServices()` wires the Notify backend.
- **`theme-dom`** no longer imports Quasar: `registerThemeDarkSync()` accepts
  an optional host bridge; `installQuasarServices()` registers `Dark`. The
  `--q-*` CSS variable aliases are plain CSS and unchanged.
- **`peerDependenciesMeta`**: `quasar` + `vue-router` optional (`vue` remains
  required). `useTableColumns` keeps only a type-only quasar import (erased at
  emit).
- **Gate**: `scripts/check-bundle-size.mjs` (`npm run size:check`, wired into
  `verify` after `build`) enforces gzip budgets per entry (measured + ~15%
  headroom) and forbids `quasar`/`vue-router` specifiers in the root entries.

## Verification

- `npm run build && npm run size:check` — budgets green, forbidden-dependency
  scan green.
- Targeted units: `useNotification` backend resolution, `theme-dom` bridge.
- Gates: `lint --quiet`, `lint:css`, `type-check`, `layers:check`.

## Acceptance

- `npm i @nettoolskit/ui` without quasar/vue-router installs without warnings
  and the root entry bundles (no static/dynamic optional-peer specifiers).
- Quasar consumers keep the full experience via one
  `installQuasarServices()` call + subpath imports.
- `size:check` fails the build on budget overflow or optional-peer leakage.

## Risks / Notes

- Behavior change: `useNotification` defaults to the console backend until
  `installQuasarServices()` runs (documented in MIGRATION).
- Budgets are intentionally tight; raising one must happen in the same PR as
  the growth it accommodates.

## Progress Checklist

Progress: 100% (5/5 checked)

- [x] Subpath entries + exports map + tsup entries
- [x] `useNotification` lazy backend + `theme-dom` pluggable dark bridge
- [x] `peerDependenciesMeta` optional for quasar/vue-router
- [x] `size:check` gate (budgets + forbidden-dependency scan) wired into `verify`
- [x] MIGRATION section + targeted unit specs