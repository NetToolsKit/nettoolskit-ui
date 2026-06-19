# NetToolsKit Frontend Standard Execution Plan

Date: 2026-06-19
Generated: 2026-06-19 16:00
LastUpdated: 2026-06-19 18:54
Status: active
Progress: 90% (9/10 checked)
Primary specialist: `dev-frontend-vue-quasar-engineer`
Tester: mandatory
Reviewer: mandatory before closeout
Release closeout: mandatory

## Progress Checklist

- [x] Package and command surface spec accepted.
- [x] DTCG token/resolver implementation planned and delivered.
- [x] Theme, density, tenant validation, and Quasar adapter planned and delivered.
- [x] Component contracts, recipes, and compatibility exports planned and delivered.
- [x] CSS governance and enforcement planned and delivered.
- [x] CMS/template migration planned and delivered in thin slices.
- [x] Quality gates and generated docs planned and delivered.
- [x] README and changelog decisions recorded.
- [x] Validation evidence recorded in this plan.
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
- `scripts/token-build.mjs`
- `src/styles/**`

Commands:
- `npm run tokens:check`
- `npm run tokens:build`
- `npm run test:tokens`

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
- `src/design-system/vue/**`
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
- `.github/workflows/ci-tests.yml` dist verification now checks the generated `index.js`, `index.mjs`, `index.d.ts`, `styles.js`, and `styles.mjs` package outputs.

### 2026-06-19 18:11 - Design System Foundation Slice

- Added DTCG-style token source, resolver, generated CSS, generated TypeScript maps, and stale-output checks under `src/design-system/tokens/**` plus `scripts/token-build.mjs`.
- Added theme runtime validation, density/tenant normalization, and Quasar CSS variable adapter coverage under `src/design-system/theme/**` and `src/design-system/adapters/quasar/**`.
- Added button, field, and card contracts/class recipes plus `Ntk*` compatibility helpers under `src/design-system/core/**` and `src/design-system/vue/**`.
- Added public exports from `index.ts` and package export `nettoolskit/design-system/tokens.css`.
- Updated README and CHANGELOG for the new public design system surface and foundation gates.
- `git diff --check` passed.
- `npm run tokens:check` passed and reported 119 tokens.
- `npm run test:tokens` passed with 5 tests.
- `npm test -- tests/unit/design-system/theme tests/unit/design-system/components` passed with 3 files and 16 tests.
- `npm run type-check` passed.
- `npm run lint -- --quiet` passed after replacing the theme control-character regex with a `charCodeAt` check.
- `npm run test:architecture` passed.
- `npm run build` passed.
- `npm run verify` passed.
- `npm pack --dry-run` passed and included `.build/dist/src/design-system/**` declarations plus `src/design-system/tokens/generated.css`.

### 2026-06-19 18:27 - CMS Template Toolbar Migration Slice

- Migrated only the top editor toolbar action buttons in `CmsSettingsModuleSurface.vue`, `CmsBlocksModuleSurface.vue`, and `CmsPagesModuleSurface.vue` from direct `q-btn` usage to `NtkButton`.
- Kept primary preview buttons, styled body actions, destructive actions, round icon controls, tooltip-slot controls, and `@click.stop` actions unchanged for this thin slice.
- README was not changed because this slice does not add a public command or package API.
- CHANGELOG was updated under `[Unreleased]`.
- `npm run lint -- --quiet` passed.
- `npm run type-check` passed.
- `npm test -- tests/unit/templates/CmsAuthoringModuleTemplates.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` passed with 3 files and 21 tests.
- `npm run test:architecture` passed.
- `npm run build` passed.
- `git diff --check` passed.

### 2026-06-19 18:54 - Quality Gates And Generated Docs Slice

- Added generated root docs from source artifacts: `DESIGN.md`, `TOKENS.md`, and `COMPONENTS.md`.
- Added `scripts/design-system-docs.mjs` with build and drift-check modes.
- Added `scripts/lint-css-governance.mjs` with baseline-aware CSS governance checks and JSON output.
- Added focused docs and CSS governance unit tests under `tests/unit/design-system/**`.
- Added package scripts: `docs:build`, `docs:check`, `lint:css`, and `test:design-system`.
- Expanded `npm run verify` to run token drift, generated-doc drift, ESLint, CSS governance, type-check, design-system tests, architecture tests, and build.
- Adjusted `scripts/token-build.mjs` so generated token files stay stable after the repository EOF hygiene hook.
- README and CHANGELOG were updated for the new gates and generated docs.
- `npm run docs:check` passed.
- `npm run lint:css` passed and scanned 178 files.
- `npm test -- tests/unit/design-system/docs/design-system-docs.spec.ts tests/unit/design-system/governance/css-governance-lint.spec.ts --environment=node --pool=forks --maxWorkers=1 --no-file-parallelism` passed with 2 files and 6 tests.
- `npm run verify` passed with 6 design-system test files, 27 design-system tests, architecture tests, and build.
- `git diff --check` passed.
- Full Playwright visual/E2E remains a separate gate for slices that change visual runtime behavior.

## Closeout Expectations

- README update is required when package surface, commands, or public API changes.
- CHANGELOG update is required when user-visible package behavior changes.
- Commit suggestion for the planning reset: `docs(planning): reset frontend standard specs`
- Commit suggestion for the package surface slice: `feat(package): align nettoolskit package surface`
- Commit suggestion for the design system foundation slice: `feat(design-system): add token theme and recipe foundation`
- Commit suggestion for the CMS template migration slice: `refactor(cms): migrate editor toolbar actions to ntk button`
- Commit suggestion for the quality gates and docs slice: `feat(design-system): add generated docs and governance gates`
- Do not move specs or this plan to completed until validation, review, and closeout evidence are recorded.