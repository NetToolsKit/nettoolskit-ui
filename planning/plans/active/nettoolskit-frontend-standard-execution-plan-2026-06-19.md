# NetToolsKit Frontend Standard Execution Plan

Date: 2026-06-19
Generated: 2026-06-19 16:00
LastUpdated: 2026-06-19 16:28
Status: active
Progress: 10% (1/10 checked)
Primary specialist: `dev-frontend-vue-quasar-engineer`
Tester: mandatory
Reviewer: mandatory before closeout
Release closeout: mandatory

## Progress Checklist

- [x] Package and command surface spec accepted.
- [ ] DTCG token/resolver implementation planned and delivered.
- [ ] Theme, density, tenant validation, and Quasar adapter planned and delivered.
- [ ] Component contracts, recipes, and compatibility exports planned and delivered.
- [ ] CSS governance and enforcement planned and delivered.
- [ ] CMS/template migration planned and delivered in thin slices.
- [ ] Quality gates and generated docs planned and delivered.
- [ ] README and changelog decisions recorded.
- [ ] Validation evidence recorded in this plan.
- [ ] Review and closeout completed.

## Scope Summary

Implement `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md` through staged specs while preserving useful repository-specific behavior that is mapped to an explicit contract, adapter, fixture, policy, or exception.

Package naming must use `nettoolskit`. Repository-owned terminal commands may use `ntk`.

## Linked Specs

1. `planning/specs/active/nettoolskit-frontend-standard-sequence-2026-06-19.md`
2. `planning/specs/active/nettoolskit-package-surface-and-sources-2026-06-19.md`
3. `planning/specs/active/nettoolskit-design-tokens-dtcg-2026-06-19.md`
4. `planning/specs/active/nettoolskit-theme-density-quasar-adapter-2026-06-19.md`
5. `planning/specs/active/nettoolskit-component-contracts-and-recipes-2026-06-19.md`
6. `planning/specs/active/nettoolskit-css-governance-and-enforcement-2026-06-19.md`
7. `planning/specs/active/nettoolskit-template-migration-and-cleanup-2026-06-19.md`
8. `planning/specs/active/nettoolskit-quality-gates-and-documentation-2026-06-19.md`

## Sub-Slice Matrix

| Order | Slice | Primary Targets | Validation |
|---:|---|---|---|
| 1 | Package and source surface | `package.json`, `index.ts`, `README.md`, source lock | naming audit, export audit |
| 2 | Tokens and resolver | `src/design-system/tokens/**`, scripts | token validation, generated CSS/TS tests |
| 3 | Theme and Quasar adapter | `src/design-system/theme/**`, `src/design-system/adapters/quasar/**` | DOM/Quasar adapter tests |
| 4 | Components and recipes | `src/design-system/core/**`, `src/design-system/vue/components/**` | recipe and component unit tests |
| 5 | CSS governance | policies, ESLint, Stylelint, architecture tests | lint and architecture tests |
| 6 | Template migration | CMS/templates, bridge styles | unit tests and Playwright visual tests |
| 7 | Quality and docs | verify script, CI, generated docs | `npm run verify` |

## Ordered Tasks

### Task 1 - Lock Package Surface

Target paths:
- `package.json`
- `index.ts`
- `README.md`
- future `sources.lock.yaml`

Commands:
- `npm run type-check`
- `npm run lint`

Checkpoint:
- Naming, exports, command prefix, and source ownership are explicit.

### Task 2 - Build Token Foundation

Target paths:
- `src/design-system/tokens/**`
- `scripts/validate-tokens.mjs`
- `scripts/build-tokens.mjs`
- `src/styles/**`

Commands:
- `npm run tokens:validate`
- `npm run tokens:build`
- `npm run test -- tests/unit/styles`

Checkpoint:
- Tokens generate CSS and TypeScript while preserving `--ntk-*` compatibility.

### Task 3 - Build Theme And Quasar Adapter

Target paths:
- `src/design-system/theme/**`
- `src/design-system/adapters/quasar/**`
- `src/config/theme/**`
- `src/adapters/QuasarNotificationAdapter.ts`

Commands:
- `npm run test -- tests/unit/config tests/unit/composables`
- `npm run type-check`

Checkpoint:
- Theme, density, dark mode, tenant validation, and Quasar variables share one controlled path.

### Task 4 - Build Components And Recipes

Target paths:
- `src/design-system/core/contracts/**`
- `src/design-system/core/recipes/**`
- `src/design-system/vue/components/**`
- `src/components/**`
- `index.ts`

Commands:
- `npm run test -- tests/unit/components`
- `npm run type-check`

Checkpoint:
- `Ds*` contracts exist and `Ntk*` compatibility is documented or tested.

### Task 5 - Add CSS And Architecture Enforcement

Target paths:
- `stylelint.config.*`
- `eslint.config.mjs`
- `tests/architecture/**`
- `src/design-system/policies/**`

Commands:
- `npm run lint`
- `npm run lint:css`
- `npm run test:architecture`

Checkpoint:
- New direct Quasar, raw color, unmanaged `:deep()`, and unmanaged `!important` usage fails locally.

### Task 6 - Migrate CMS And Template Surfaces

Target paths:
- `src/templates/features/cms/authoring/**`
- `src/templates/styles/**`
- `src/modules/cms/white-label/**`

Commands:
- `npm run test -- tests/unit/modules/cms tests/unit/templates`
- `npx playwright test tests/e2e/cms-settings-flow.spec.ts tests/e2e/cms-visual-regression.spec.ts --workers=1`

Checkpoint:
- Direct Quasar usage and bridge override count trend down with recorded evidence.

### Task 7 - Add Quality Gates And Generated Docs

Target paths:
- `package.json`
- `.github/workflows/**`
- `DESIGN.md`
- `COMPONENTS.md`
- `TOKENS.md`
- `tests/a11y/**`
- `tests/e2e/**`

Commands:
- `npm run verify`

Checkpoint:
- Full local gate covers tokens, docs, lint, tests, a11y, visual regression, and build.

## Validation Checklist

- `git diff --check`
- `npm run lint`
- `npm run type-check`
- `npm run test`
- `npm run test:e2e`
- `npm run verify` after the verify script exists

## Validation Evidence

### 2026-06-19 16:28 - Package Surface And Baseline Governance Slice

- Stale package identifiers and stale dist entrypoints check returned no matches in the package/docs surface.
- `npm run lint` passed with existing warnings and no errors.
- `npm run type-check` passed.
- `npm run build` passed after moving layout persistence helpers from the Vue SFC to `src/templates/layouts/main-layout-persistence.ts`.
- `npm run test:architecture` passed.
- `npm pack --dry-run` passed and reported `nettoolskit@1.1.0`.
- Package export path check passed for `main`, `module`, `types`, `nettoolskit/styles`, and style subpaths.

## Closeout Expectations

- README update is required when package surface, commands, or public API changes.
- CHANGELOG update is required when user-visible package behavior changes.
- Commit suggestion for the planning reset: `docs(planning): reset frontend standard specs`
- Commit suggestion for the package surface slice: `feat(package): align nettoolskit package surface`
- Do not move specs or this plan to completed until validation, review, and closeout evidence are recorded.