# NetToolsKit UI Visual Polish, Density & Real A11y - Spec

Generated: 2026-06-24 America/Sao_Paulo
LastUpdated: 2026-06-24 America/Sao_Paulo
Status: active
Priority: high
Workstream ID: `nettoolskit-ui-visual-polish-density-a11y`
Phase: P1
Depends on: `2026-06-24-nettoolskit-ui-visual-styling-foundation.md`

## Objective

After the primitives are styled (P0), raise visual + accessibility quality:
consistent interaction states, density modes, a verified dark mode, and **real**
WCAG AA color-contrast in the browser gate (currently disabled).

## Design Intent

- **Interaction states:** one focus-ring treatment across all interactive
  components (token `--ntk-border-focus`), plus hover/active/disabled and a
  `loading` spinner on `DsButton`.
- **Density:** a token-driven density attribute (`compact` / `comfortable` /
  `spacious`) affecting control height, padding and table row density, exposed
  via the install plugin and/or a `density` prop, per the standard.
- **Dark mode:** confirm every component reads `bg/text/border` tokens so the
  existing color-scheme switch fully reskins them; add a theme + scheme + density
  toggle to the sample catalog so it is visible.
- **Real contrast:** re-enable axe `color-contrast` in `e2e/a11y.spec.ts` and fix
  any AA failures revealed once primitives are styled.

## Key Decisions

- Density is expressed with tokens (e.g. `--ntk-density-*`) and a closed prop/
  attribute, never arbitrary padding props.
- Contrast is governed at the token layer; fixes adjust tokens, not per-component
  hardcoded colors.
- No raw hex/important/deep/q-* (governance stays at 0).

## Design Slice Matrix

| Slice | Target paths | Standardization | Security | Performance | Acceptance |
|---|---|---|---|---|---|
| Interaction states | `vue/components/**`, `core/components/**` | Uniform focus/hover/active/loading | Token-only | Negligible | Visible + tested states |
| Density modes | `core/components/**`, `vue/components/**`, tokens | Closed density vocabulary | No arbitrary sizing | One token set | Compact/comfortable/spacious render |
| Dark mode + toggles | `samples/**` | Proves reskin | Static | Small | Catalog toggles theme/scheme/density |
| Real contrast gate | `e2e/**`, tokens | Enforces WCAG AA contrast | Reduces inaccessible output | Bounded | axe with color-contrast passes |

## Acceptance Criteria

- All interactive components share one focus-ring; `DsButton` shows a loading
  state.
- Density modes apply consistently to fields, buttons and table rows.
- The catalog demonstrates theme + light/dark + density switching.
- `e2e/a11y.spec.ts` runs axe **with** `color-contrast` enabled and passes.
- `npm run verify` and `npm run test:e2e` pass; governance baseline stays 0.

## Recommended Specialist Focus

- Frontend Vue engineer (states, density)
- Accessibility/test engineer (contrast, axe gate)
- Design-system reviewer (dark mode, tokens)