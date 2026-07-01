# NetToolsKit UI Public API Legacy Cut + Theme Consolidation - Spec

Generated: 2026-07-01 America/Sao_Paulo
LastUpdated: 2026-07-01 America/Sao_Paulo
Status: active
Priority: medium-high
Workstream ID: `nettoolskit-ui-public-api-legacy-cut`
Phase: surface-hardening

## Objective

Finish the legacy-surface elimination (ADR-0003) at the API level: remove the
"legacy compatibility" exports that survived the component cut, and leave one
theme door instead of three. Also remove the last token-value duplication in
TypeScript (anti-duplicity rule).

## Background (audited 2026-07-01)

- `src/index.ts` still exported `theme.plugin` (NtkThemePlugin/useNtkTheme)
  and `theme-mode.config`, both marked "Legacy compatibility export".
- `src/plugins/index.ts` was a dead barrel (nothing imports it).
- `src/styles/index.ts` restated ~30 token values as hex in `DESIGN_TOKENS` /
  `CSS_VARS` — a direct violation of the anti-duplicity rule (values must live
  only in token sources).
- Three theme doors coexisted: legacy plugin writes, named palettes
  (`useThemeSwitcher`), and color scheme (`useColorScheme`).

## Scope

- Delete `src/config/theme/theme.plugin.ts` and `src/plugins/index.ts`; drop
  their exports from `src/index.ts`. The preset-driven model
  (`useThemeSwitcher` + `useColorScheme` + CSS custom properties) is the only
  runtime theme surface.
- Keep `theme-mode.config` as an internal module (the nettoolskit preset
  consumes it) but remove it from the public entry.
- Rewrite `src/styles/index.ts` to export only `getCssVar`/`setCssVar`; the
  no-hex invariant is now asserted by
  `tests/unit/styles/token-fallbacks.spec.ts`.
- Tests: drop the `useNtkTheme` block from `useTheme.spec.ts`; replace the
  `DESIGN_TOKENS` assertions with the anti-duplicity guard.
- `MIGRATION.md` section + `CHANGELOG.md` Unreleased entry (breaking on the
  0.0.x preview line).

## Verification

- Targeted units: `useTheme`, `token-fallbacks`, `theme-fallbacks`, presets.
- Gates: `lint --quiet`, `lint:css`, `type-check`, `layers:check`,
  `docs:check`.

## Acceptance

- No "Legacy compatibility export" markers remain in `src/index.ts`.
- `@nettoolskit/ui/styles` exports no color literals (guarded by test).
- Preset rendering (nettoolskit preset) unaffected — `theme-mode.config`
  values keep flowing internally.

## Risks / Notes

- Breaking for any consumer of `useNtkTheme`/`DESIGN_TOKENS`; acceptable on
  the 0.0.x preview line and documented in MIGRATION.
- `src/config/index.ts` internal barrel still re-exports theme-mode for
  in-repo consumers; out of scope here.

## Progress Checklist

Progress: 100% (4/4 checked)

- [x] theme.plugin + plugins barrel deleted; index exports cleaned
- [x] styles entry hex-free with anti-duplicity test guard
- [x] useTheme spec trimmed to the modern surface
- [x] MIGRATION + CHANGELOG entries