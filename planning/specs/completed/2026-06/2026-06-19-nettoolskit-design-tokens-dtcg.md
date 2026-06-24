# NetToolsKit Design Tokens DTCG - Spec

Date: 2026-06-19
Status: completed - archived
Priority: P0
Sequence: 02
Source Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`

## Design Intent

Move the current manual CSS token layer into DTCG token files, a resolver, generated CSS and generated TypeScript, while preserving compatibility for existing `--ntk-*` consumers.

## Current Evidence

The repository currently stores visual tokens mainly in:

- `src/styles/tokens.scss`
- `src/styles/themes.css`
- `src/config/theme/theme.config.ts`
- `src/config/colors/**`

These files remain useful inputs, but they should stop being the only manually edited token source after the token package exists.

## Decisions

1. Token files must be grouped as primitive, semantic, component, state, density, motion, z-index, and theme overlays.
2. The resolver must treat theme, density, contrast, and motion as separate contexts when possible.
3. Generated CSS must preserve `--ntk-*` compatibility aliases.
4. Generated TypeScript must expose typed token names and safe token maps.
5. Token validation must fail on missing references, context mismatches, unknown token use, and inconsistent theme token sets.

## Target Paths

- future `src/design-system/tokens/**/*.tokens.json`
- future `src/design-system/tokens/resolver.json`
- future `src/design-system/tokens/generated/tokens.css`
- future `src/design-system/tokens/generated/tokens.ts`
- future `src/design-system/tokens/generated/tokens.d.ts`
- future `scripts/validate-tokens.mjs`
- future `scripts/build-tokens.mjs`
- existing `src/styles/tokens.scss`
- existing `src/styles/themes.css`

## Design Slice Matrix

| Slice | Target | Validation |
|---|---|---|
| Primitive tokens | colors, radius, spacing, typography, shadows | schema validation |
| Semantic tokens | surface, text, action, status, border | alias resolution tests |
| Component tokens | button, card, input, select, table, dialog | component token tests |
| Context resolver | theme, density, contrast, motion | resolver fixture tests |
| Generated compatibility | `--ntk-*` aliases | CSS output snapshot and TypeScript compile |

## Acceptance Criteria

1. DTCG token files exist and validate.
2. Resolver exists and validates all required contexts.
3. Generated CSS includes compatibility aliases for existing `--ntk-*` consumers.
4. Generated TypeScript exports token names and maps.
5. Token build is part of the verify flow.
6. Existing manual token files either become generated files or documented compatibility bridges.

## Implementation Evidence

### 2026-06-19 21:29 - Resolver And Generated Output Slice

- Added generated resolver output at `src/design-system/tokens/resolver.json`.
- Added generated folder outputs at `src/design-system/tokens/generated/tokens.css`, `tokens.ts`, and `tokens.d.ts`.
- Preserved compatibility output at `src/design-system/tokens/generated.css` and existing package export `nettoolskit/design-system/tokens.css`.
- Resolver now records token paths, groups, types, references, CSS variables, and context buckets for theme, density, contrast, and motion.
- Token tests validate resolver references, context buckets, generated CSS, generated TypeScript, generated declarations, and resolver drift.
- Remaining gap: context buckets are compatibility-bridge metadata; full density/theme application still belongs to the theme adapter spec.

## Risks

- Generated CSS can change visual output broadly.
- Theme contrast can regress if compatibility aliases are incomplete.
- Token migration can break tests that assert fixed values instead of semantic roles.

## Planning Readiness

Ready for planning after the package surface spec is accepted.

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Support: `test-engineer`