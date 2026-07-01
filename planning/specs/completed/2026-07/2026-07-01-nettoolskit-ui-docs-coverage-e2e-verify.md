# NetToolsKit UI Docs Coverage + E2E in Verify - Spec

Generated: 2026-07-01 America/Sao_Paulo
LastUpdated: 2026-07-01 America/Sao_Paulo
Status: active
Priority: medium
Workstream ID: `nettoolskit-ui-docs-coverage-e2e-verify`
Phase: governance-completion

## Objective

Close two evaluation gaps: (1) the generated component docs covered only 14 of
the core recipe modules — the living documentation promise requires the whole
catalog; (2) `npm run verify` did not include the browser/a11y gate, so a
locally "green" verify did not prove WCAG compliance.

## Scope

- `scripts/design-system-docs.mjs`: auto-discovery of every recipe module in
  `core/components` (convention: `ntk*RecipeClassMap` + `ntk*Defaults` +
  `Ntk*Contract`; `ntk*Variants` optional — the pickers have none). Curated
  configs keep order and hand-written purposes; discovered modules follow
  alphabetically with the purpose taken from the module's doc header
  (ASCII-sanitized). Vue wrapper table now discovers every `Ds*.vue`
  (contract extracted from the SFC source). Class-map flattening handles
  non-standard groups (elements/tones/nested) generically; defaults rows
  render whatever keys the recipe defines.
- Regenerated `docs/COMPONENTS.md` + `docs/DESIGN.md`: 42 component recipe
  modules (was 14) and 48 Vue wrapper rows.
- `package.json` `verify`: appended `npm run test:e2e` after `build:samples`,
  matching the DoD ("verify green includes e2e/axe"). Requires Playwright
  chromium locally (`npx playwright install chromium`); CI (River standard
  stage) already runs it.

## Verification

- `docs:build` + `docs:check` green (123 tokens, 42 components).
- Generator unit suite green (sync, representative content, stale rejection).
- Full e2e gate run locally: 4/4 passing (landmarks, axe WCAG scan, keyboard
  focus, dialog lifecycle) against the built catalog.

## Acceptance

- Every core recipe module appears in `docs/COMPONENTS.md` with contract
  props, defaults, variants, and class map; every `Ds*.vue` appears in the
  wrapper table.
- `verify` fails when the browser/a11y gate fails.
- Adding a new conventional recipe module documents itself on the next
  `docs:build` with no generator change.

## Risks / Notes

- Branch stacked on `feat/optional-peers-size-gate` (both touch the `verify`
  script line) — merge PR #120 before this one, or merge this one directly
  (it contains #120's commits).
- Local `verify` now needs Playwright browsers; documented here and in the PR.

## Progress Checklist

Progress: 100% (3/3 checked)

- [x] Generator auto-discovery (42 recipe modules, 48 wrappers) + tolerant doc builders
- [x] Docs regenerated and in sync; generator suite green
- [x] `test:e2e` wired into `verify`; full e2e gate exercised locally (4/4)