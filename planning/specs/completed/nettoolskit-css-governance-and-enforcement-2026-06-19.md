# NetToolsKit CSS Governance And Enforcement - Spec

Date: 2026-06-19
Status: completed - archived
Priority: P1
Sequence: 05
Source Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`

## Design Intent

Stop CSS drift by defining allowed CSS scopes, cascade layers, low-specificity selectors, controlled `:deep()` usage, controlled `!important` usage, and automated lint rules.

## Current Evidence

Current scans found high-volume usage of direct Quasar selectors, `:deep()`, `!important`, inline styles, and raw values, concentrated in templates and bridge styles.

High-risk files include:

- `src/templates/styles/reference-app-bridge.scss`
- `src/templates/styles/cms-authoring-reference.css`
- `src/templates/features/cms/authoring/modules/**`
- `src/components/layout/NtkAppShell.vue`
- `src/styles/global.scss`

## Decisions

1. Global CSS is limited to tokens, reset, typography, base layout, controlled utilities, and documented overrides.
2. Component CSS may use BEM-style classes and local token variables.
3. Page/template CSS must not override Quasar internals.
4. `:deep()` is allowed only inside design-system wrappers/adapters or documented exceptions.
5. `!important` requires a short justification and must be rejected outside approved files.
6. Stylelint and ESLint must enforce the policy.

## Target Paths

- future `src/design-system/styles/layers.css`
- future `src/design-system/policies/css.policy.yaml`
- future `stylelint.config.*`
- future `eslint` rules or local architecture tests
- existing `src/styles/global.scss`
- existing `src/templates/styles/reference-app-bridge.scss`
- existing `src/templates/styles/cms-authoring-reference.css`
- existing `tests/unit/templates/TemplateWhiteLabelAudit.spec.ts`

## Design Slice Matrix

| Slice | Target | Validation |
|---|---|---|
| CSS layers | reset, tokens, base, components, utilities, overrides | CSS import order test |
| Selector policy | max specificity, no IDs, no page-local Quasar internals | Stylelint |
| `:deep()` policy | wrapper-only usage | ESLint or architecture test |
| `!important` policy | exception-only usage | Stylelint and grep gate |
| Raw value policy | no hardcoded color/shadow/motion outside tokens | Stylelint and token audit |

## Acceptance Criteria

1. CSS policy file exists and is enforced.
2. Stylelint runs in the verify flow.
3. ESLint or architecture tests block direct Quasar usage in features.
4. Existing exceptions are listed with owners and target removal specs.
5. New CSS cannot add raw colors, unmanaged `:deep()`, or unmanaged `!important`.

## Implementation Evidence

### 2026-06-19 21:29 - Policy And Shared Enforcement Slice

- Added `policies/design-system-css-governance.yaml`.
- `scripts/lint-css-governance.mjs` now requires the policy file and validates traceable owner, removal spec, and reason metadata for baseline exceptions.
- `tests/architecture/design-system-governance.spec.ts` now uses the same governance script path as `npm run lint:css`.
- CSS governance unit coverage validates missing metrics, missing exception metadata, machine-readable CLI output, and baseline enforcement.
- Remaining gap: governed roots still focus on `src/components` and `src/templates`; expanding to `src/styles` and `src/design-system` requires targeted excludes/allowlists for token-generated artifacts and legacy raw values.

### 2026-06-20 03:07 - CMS Field Bridge Token Alias Slice

- Removed duplicated broad Quasar field overrides from `src/templates/styles/cms-authoring-reference.css`.
- Routed CMS field styling through scoped token aliases consumed by `src/templates/styles/reference-app-bridge.scss`.
- Added template audit coverage for the token aliases and removed broad `.cms-shell-page :deep(.q-field...)` selectors.
- Focused governance passed: `node scripts/lint-css-governance.mjs --root src/templates --format=json` with no exceeded metrics.
- Focused Stylelint passed: `npx stylelint "src/templates/styles/reference-app-bridge.scss" "src/templates/styles/cms-authoring-reference.css"`.
- CMS visual regression passed: `npx playwright test tests/e2e/cms-visual-regression.spec.ts --workers=1` with 20 tests after refreshing only the dark settings shell baseline.
- `npm run verify` passed, including CSS governance, architecture governance, browser gates, and package build.
- Remaining gap: bridge files still contain documented Quasar exceptions; continue shrinking selectors in narrow visual slices.

## Risks

- Enforcing rules before wrappers exist will create noisy failures.
- Existing bridge files may need temporary exception windows.
- Overly broad regex rules can block valid token expressions.

## Planning Readiness

Ready for planning after component wrappers and token generation exist.

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Support: `test-engineer`
