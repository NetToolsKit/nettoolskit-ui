# NetToolsKit Frontend Standard Execution Plan

Date: 2026-06-19
Generated: 2026-06-19 16:00
LastUpdated: 2026-06-20 03:19
Status: active
Progress: 80% (12/15 checked)
Primary specialist: `dev-frontend-vue-quasar-engineer`
Tester: mandatory
Reviewer: mandatory before closeout
Release closeout: mandatory

## Progress Checklist

- [x] Package and command surface spec accepted.
- [x] DTCG token/resolver initial implementation planned and delivered.
- [x] Theme, density, tenant validation, and Quasar adapter initial implementation planned and delivered.
- [x] Component contracts, recipes, and compatibility exports initial implementation planned and delivered.
- [x] CSS governance and enforcement initial implementation planned and delivered.
- [x] CMS/template migration initial implementation planned and delivered in thin slices.
- [x] Quality gates and generated docs initial implementation planned and delivered.
- [x] README and changelog decisions recorded.
- [x] Validation evidence recorded in this plan.
- [x] Completion audit against active specs recorded.
- [x] Browser/stylelint gate slice validated locally.
- [x] Browser/stylelint gate committed, pushed, and opened as a stacked PR.
- [ ] Remaining spec gaps converted into the next implementation slices.
- [ ] CI result inspection and PR stack review completed.
- [ ] Final review and closeout completed.

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

## Current Planning Status

- All 8 linked specs remain under `planning/specs/active` after completion audit.
- The earlier 90% status reflected completed implementation slices, not final spec acceptance.
- PR #1 through PR #4 are open as draft PRs in a stacked chain; Vercel checks are green, but no GitHub Actions run was found for those heads during the audit.
- PR #5 is open as a draft stacked PR from `feat/nettoolskit-quality-gates-browser-stylelint-2026-06-19` into `feat/nettoolskit-quality-gates-docs-2026-06-19`.
- PR #6 is open as a draft stacked PR from `feat/nettoolskit-token-css-policy-2026-06-19` into `feat/nettoolskit-quality-gates-browser-stylelint-2026-06-19`.
- PR #7 is open as a draft stacked PR from `feat/nettoolskit-theme-density-contracts-2026-06-19` into `feat/nettoolskit-token-css-policy-2026-06-19`.
- PR #8 is open as a draft stacked PR from `feat/nettoolskit-ds-button-wrapper-2026-06-19` into `feat/nettoolskit-theme-density-contracts-2026-06-19`.
- PR #9 is open as a draft stacked PR from `feat/nettoolskit-ds-card-input-wrappers-2026-06-19` into `feat/nettoolskit-ds-button-wrapper-2026-06-19`.
- PR #10 is open as a draft stacked PR from `feat/nettoolskit-cms-preview-ds-button-2026-06-19` into `feat/nettoolskit-ds-card-input-wrappers-2026-06-19`.
- PR #11 is open as a draft stacked PR from `feat/nettoolskit-ds-select-wrapper-2026-06-20` into `feat/nettoolskit-cms-preview-ds-button-2026-06-19`.
- PR #12 is open as a draft stacked PR from `feat/nettoolskit-ds-table-wrapper-2026-06-20` into `feat/nettoolskit-ds-select-wrapper-2026-06-20`.
- PR #13 is open as a draft stacked PR from `feat/nettoolskit-ds-page-section-wrappers-2026-06-20` into `feat/nettoolskit-ds-table-wrapper-2026-06-20`.
- PR #14 is open as a draft stacked PR from `feat/nettoolskit-ntk-button-compat-2026-06-20` into `feat/nettoolskit-ds-page-section-wrappers-2026-06-20`.
- PR #15 is open as a draft stacked PR from `refactor/nettoolskit-cms-ruler-ds-button-2026-06-20` into `feat/nettoolskit-ntk-button-compat-2026-06-20`.
- PR #16 is open as a draft stacked PR from `feat/nettoolskit-ntk-datatable-compat-2026-06-20` into `refactor/nettoolskit-cms-ruler-ds-button-2026-06-20`.
- PR #17 is open as a draft stacked PR from `refactor/nettoolskit-cms-media-ds-button-2026-06-20` into `feat/nettoolskit-ntk-datatable-compat-2026-06-20`.
- PR #18 is open as a draft stacked PR from `feat/nettoolskit-ntk-select-compat-2026-06-20` into `refactor/nettoolskit-cms-media-ds-button-2026-06-20`.
- PR #19 is open as a draft stacked PR from `refactor/nettoolskit-cms-releases-ds-button-2026-06-20` into `feat/nettoolskit-ntk-select-compat-2026-06-20`.
- PR #20 is open as a draft stacked PR from `feat/nettoolskit-ntk-input-compat-2026-06-20` into `refactor/nettoolskit-cms-releases-ds-button-2026-06-20`.
- PR #21 is open as a draft stacked PR from `refactor/nettoolskit-cms-preview-toolbar-ntk-select-2026-06-20` into `feat/nettoolskit-ntk-input-compat-2026-06-20`.
- PR #22 is open as a draft stacked PR from `refactor/nettoolskit-cms-media-fields-ntk-form-2026-06-20` into `refactor/nettoolskit-cms-preview-toolbar-ntk-select-2026-06-20`.
- PR #23 is open as a draft stacked PR from `refactor/nettoolskit-cms-bridge-field-token-aliases-2026-06-20` into `refactor/nettoolskit-cms-media-fields-ntk-form-2026-06-20`.
- PR #24 is open as a draft stacked PR from `refactor/nettoolskit-cms-shell-native-cards-2026-06-20` into `refactor/nettoolskit-cms-bridge-field-token-aliases-2026-06-20`.
- Specs and this plan must stay active until remaining gaps, CI/review evidence, and closeout are recorded.

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

### 2026-06-19 19:05 - PR Evidence And Remaining Acceptance

- PR #1 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/1`.
- PR #2 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/2`.
- PR #3 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/3`.
- PR #4 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/4`.
- Local milestone implementation, validation, documentation, changelog, and planning evidence are committed and pushed in the stacked PR chain.
- Remaining acceptance: review, CI result inspection, PR merge, branch cleanup, and final archive movement after merge approval.

### 2026-06-19 20:54 - Completion Audit Rebaseline

- Active plan status was rebalanced from implementation-slice progress to spec-acceptance progress.
- All 8 linked specs remain active and are not ready for archive movement.
- Subagent audit confirmed gaps still remain in token resolver output shape, density application, component contracts, CSS policy depth, CMS direct Quasar migration, and CI/browser gate coverage.
- GitHub audit confirmed PR #1 through PR #4 are draft, stacked, and Vercel-green; no GitHub Actions run was found for those branch heads.
- Current closure path is to keep adding thin stacked PRs with validation evidence until every active spec has review and closeout evidence.

### 2026-06-19 20:54 - Browser Style And Visual Gate Slice

- Added Stylelint configuration and `lint:style`.
- Added a focused Playwright/axe a11y gate for the template-runtime login surface.
- Added `test:a11y`, `test:visual`, and `test:browser-gates`, and expanded `verify` to include Stylelint plus browser gates.
- Added the internal CMS preview page to the Vite multi-entry build so Playwright preview targets the CMS runtime.
- Exposed the `Save content model` command in the CMS settings content-model surface and used it in the visual regression flow.
- Stabilized CMS visual selectors for drawer modules, quick search, content model authoring, and archived preset toggles.
- Regenerated affected Windows CMS visual baselines.
- `npm run lint:style` passed.
- `npm run type-check` passed.
- `npm run test:a11y` passed with 1 Playwright test.
- `npm run test:visual` passed with 24 Playwright tests.
- `npm run verify` passed, including 25 browser-gate Playwright tests and the package build.
- Commit `b3a295ff` created the browser/stylelint gate slice.
- PR #5 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/5`.
- PR #5 Vercel check passed; GitHub Actions were still not present for the PR stack.

### 2026-06-19 21:57 - Token Resolver, CSS Policy, And CI Gate Slice

- Added committed token resolver output at `src/design-system/tokens/resolver.json`.
- Added generated token folder outputs at `src/design-system/tokens/generated/tokens.css`, `tokens.ts`, and `tokens.d.ts`.
- Preserved compatibility token outputs at `src/design-system/tokens/generated.css` and `generated.ts`.
- Exported `designTokenResolver` from the public design-system token index.
- Added `policies/design-system-css-governance.yaml` with owner, removal spec, and reason metadata for current baseline exceptions.
- `scripts/lint-css-governance.mjs` now requires the CSS policy and validates traceable baseline exception metadata.
- `tests/architecture/design-system-governance.spec.ts` now uses the same governance script path as the CLI.
- GitHub Actions now runs token drift, generated-doc drift, Stylelint, CSS governance, architecture governance, a11y, and full visual gates explicitly.
- Stabilized the published pages preview screenshot by asserting preview toolbar state and capturing the runtime preview frame.
- `npm run verify` passed, including 29 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `9b8509f0` created the token resolver, CSS policy, and CI gate slice.
- PR #6 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/6`.
- PR #6 Vercel check passed; GitHub Actions were still not present in `gh pr checks`.
- Remaining gaps: full density/theme application, broader CSS governed roots with generated-token excludes, component `Ds*` wrappers, and final PR/CI/review closeout.

### 2026-06-19 22:09 - Theme Density And Known Token Validation Slice

- Added deterministic density CSS variable assignments for compact, comfortable, and spacious modes.
- Theme validation now rejects token CSS variables that are not present in the generated token resolver.
- Quasar adapter tests now cover generated-token value inputs.
- Focused validation passed: `npm test -- tests/unit/design-system/theme --pool=forks --maxWorkers=1 --no-file-parallelism`.
- `npm run type-check` passed.
- `npm run verify` passed, including 31 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `ab2379564` created the theme density and known token validation slice.
- PR #7 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/7`.
- PR #7 Vercel check passed; GitHub Actions were still not present in `gh pr checks`.
- Remaining gaps: DOM theme manager, legacy theme API restriction/deprecation, dark-mode sync, and non-brand Quasar behavior adapters.

### 2026-06-19 22:30 - DsButton Wrapper Slice

- Added `DsButton` as the first rendered `Ds*` Vue component wrapper.
- Exported `DsButton` from the design-system Vue surface.
- Added focused rendered component tests under `tests/unit/design-system/components/ds-button.spec.ts`.
- Generated component docs now list Vue wrapper sources.
- Focused validation passed: `npm test -- tests/unit/design-system/components --pool=forks --maxWorkers=1 --no-file-parallelism`.
- `npm run type-check` passed.
- `npm run verify` passed, including 33 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `b8153976` created the DsButton wrapper slice.
- PR #8 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/8`.
- PR #8 Vercel check passed; GitHub Actions were still not present in `gh pr checks`.
- Remaining gaps: additional `Ds*` wrappers, compatibility migration for open `NtkButton` visual strings, and broader rendered behavior coverage.

### 2026-06-19 22:58 - DsCard And DsInput Wrapper Slice

- Added rendered `DsCard` and `DsInput` Vue component wrappers.
- Exported both wrappers from the design-system Vue component surface.
- Added focused rendered component tests under `tests/unit/design-system/components/ds-card-input.spec.ts`.
- `DsCard` now gates pointer and keyboard activation behind the `clickable` contract and avoids standalone selected ARIA without a selectable widget context.
- Generated component docs now list `DsButton`, `DsCard`, and `DsInput`.
- Focused validation passed: `npm test -- tests/unit/design-system/components --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 18 tests.
- `npm run type-check` passed.
- `npm run docs:check` passed.
- Stabilized CMS visual regression selectors around Quasar menus and drawer screenshots; regenerated the previously blank reusable-block impact drawer baseline.
- `npx playwright test tests/e2e/cms-visual-regression.spec.ts -g "captures pages preview in published tablet pt-BR mode|captures phase 5 reusable block impact drawer" --workers=1` passed with 2 tests.
- `npm run verify` passed, including 39 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `0ad377d` created the DsCard and DsInput wrapper slice.
- PR #9 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/9`.
- PR #9 Vercel check passed; GitHub Actions were still not present in `gh pr checks`.
- Remaining gaps: `DsSelect`, `DsTable`, page wrappers, compatibility migration for open `NtkButton` visual strings, and broader focus/keyboard behavior coverage.

### 2026-06-19 23:27 - CMS Pages Preview DsButton Slice

- Replaced the single pages preview `Open in new window` `q-btn` header action with `DsButton`.
- Added focused unit coverage for the pages preview `openInWindow` header action.
- Confirmed `CmsPagesPreviewSurface.vue` no longer contains direct `<q-btn>` usage.
- Refreshed the affected Windows visual baseline for the published tablet `pt-BR` pages preview frame.
- Focused validation passed: `npm test -- tests/unit/templates/CmsAuthoringChromeComponents.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 1 file and 28 tests.
- `npm run lint -- --quiet` passed.
- `npm run type-check` passed.
- `npm test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` passed with 2 files and 18 tests.
- `npx playwright test tests/e2e/cms-visual-regression.spec.ts -g "captures pages preview in published tablet pt-BR mode" --workers=1` passed.
- `npm run verify` passed, including 39 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `bd79f7d` created the CMS pages preview DsButton slice.
- PR #10 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/10`.
- PR #10 Vercel check passed; GitHub Actions were still not present in `gh pr checks`.
- Remaining gaps: broader CMS direct Quasar migration, bridge selector reduction, `DsSelect`, `DsTable`, and page wrapper work.

### 2026-06-19 23:44 - DsSelect Wrapper Slice

- Added `DsSelect` as a rendered Vue component wrapper backed by the field contract and recipe classes.
- Exported `DsSelect` from the design-system Vue component surface.
- Generated component docs now list `DsButton`, `DsCard`, `DsInput`, and `DsSelect`.
- Added focused rendered component tests under `tests/unit/design-system/components/ds-select.spec.ts`.
- Readonly select state avoids model updates and resets the DOM value to the controlled model value.
- Focused validation passed: `npm test -- tests/unit/design-system/components/ds-select.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 1 file and 4 tests.
- `npm run type-check` passed.
- `npm run docs:check` passed.
- `npm run verify` passed, including 43 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `11f3d4d` created the DsSelect wrapper slice.
- PR #11 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/11`.
- PR #11 Vercel check passed; GitHub Actions were still not present in `gh pr checks`.
- Remaining gaps: `DsTable`, page wrappers, full `NtkSelect` parity decisions, broader CMS direct Quasar migration, and final PR/CI/review closeout.

### 2026-06-20 00:02 - DsTable Wrapper Slice

- Added `NtkTableContract`, table variants/defaults, and table recipe classes.
- Added `DsTable` as a rendered native table wrapper.
- Exported the table core contract and `DsTable` Vue wrapper.
- Generated component docs now list button, field, card, and table contracts plus five Vue wrappers.
- Added focused rendered component tests under `tests/unit/design-system/components/ds-table.spec.ts`.
- Addressed the table audit's immediate a11y risks with a fallback accessible table name, keyboard row activation, select-all mixed state, and row selection labels based on readable cell values.
- Focused validation passed: `npm test -- tests/unit/design-system/components/component-recipes.spec.ts tests/unit/design-system/components/ds-table.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 2 files and 15 tests.
- `npm run type-check` passed.
- `npm run docs:check` passed.
- `npm run verify` passed, including 48 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `ac0dd79` created the DsTable wrapper slice.
- PR #12 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/12`.
- PR #12 Vercel check passed; GitHub Actions were still not present in `gh pr checks`.
- Remaining gaps: page wrappers, `NtkDataTable` compatibility decisions, broader CMS direct Quasar migration, and final PR/CI/review closeout.

### 2026-06-20 00:14 - DsPage And DsSection Wrapper Slice

- Added `NtkPageContract`, `NtkSectionContract`, page/section variants/defaults, and recipe classes.
- Added rendered native `DsPage` and `DsSection` Vue landmark wrappers.
- Exported the page and section core contracts and the Vue wrappers.
- Generated component docs now list button, field, card, table, page, and section contracts plus seven Vue wrappers.
- Addressed the page/section audit's immediate a11y risks by avoiding default generic landmark labels and preventing `aria-labelledby` from targeting replaced header-slot content.
- Added optional `actions` slots and focused rendered component tests under `tests/unit/design-system/components/ds-page-section.spec.ts`.
- Focused validation passed: `npx vitest run --config tests/vitest.config.ts tests/unit/design-system/components/component-recipes.spec.ts tests/unit/design-system/components/ds-page-section.spec.ts tests/unit/design-system/docs/design-system-docs.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 21 tests.
- `npm run type-check` passed.
- `npm run docs:check` passed.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `50540db` created the DsPage and DsSection wrapper slice.
- PR #13 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/13`.
- PR #13 Vercel check passed; GitHub Actions were still not present in `gh pr checks`.
- Remaining gaps: compatibility migration decisions, broader CMS direct Quasar migration, and final PR/CI/review closeout.

### 2026-06-20 00:36 - NtkButton Compatibility Slice

- Kept `NtkButton` as the Quasar-backed compatibility adapter while adding design-system aliases for `variant`, `intent`, and `disabled`.
- Preserved legacy open string props, unknown variant pass-through, and explicit Quasar style flags; `disable` takes precedence over the new `disabled` alias.
- Recognized contract values now add button recipe classes for variant, size, intent, disabled, and loading states.
- Focused validation passed: `npm run test -- tests/unit/components/ui/BaseButton.spec.ts tests/unit/components/ui/NtkUiComponents.spec.ts tests/unit/components/ui/NtkPublicColorInputSanitization.spec.ts tests/unit/design-system/components/component-recipes.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 4 files and 100 tests.
- `npm run type-check` passed.
- `npm run test:design-system` passed with 11 files and 55 tests.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `a59a57a` created the NtkButton compatibility slice.
- PR #14 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/14`.
- PR #14 Vercel check passed; GitHub Actions were still not present in `gh pr checks`.
- Remaining gaps: `NtkDataTable` compatibility decisions, full `NtkSelect` parity decisions, broader CMS direct Quasar migration, and final PR/CI/review closeout.

### 2026-06-20 01:06 - CMS Authoring Ruler DsButton Slice

- Replaced `CmsAuthoringRulerBar` focus and grid-mode direct `q-btn` controls with the rendered `DsButton` wrapper.
- Preserved focus and mode-toggle event behavior while adding ruler-specific compact styles for `ntk-button` icon/label structure.
- Added focused rendered-control coverage in `CmsAuthoringChromeComponents.spec.ts`.
- Refreshed the affected Windows visual baselines for settings light/dark/monochrome shells and the phase 3 pages quick-start command surface.
- Focused validation passed: `npm test -- tests/unit/templates/CmsAuthoringChromeComponents.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 1 file and 28 tests.
- `npm run lint -- --quiet` passed.
- `npm run type-check` passed.
- `npx playwright test tests/e2e/cms-visual-regression.spec.ts -g "captures settings shell in light preset|captures settings shell in dark preset|captures settings shell in monochrome preset|captures phase 3 pages quick-start and command surface" --workers=1 --update-snapshots` passed with 4 tests and regenerated only affected snapshots.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `fc249cf` created the CMS authoring ruler DsButton slice.
- PR #15 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/15`.
- PR #15 Vercel check passed; GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: `NtkDataTable` compatibility decisions, full `NtkSelect` parity decisions, broader CMS direct Quasar migration, and final PR/CI/review closeout.

### 2026-06-20 01:21 - NtkDataTable Compatibility Slice

- Kept `NtkDataTable` as a Quasar-backed compatibility adapter while adding design-system props for `variant`, `size`, and `intent`.
- Recognized table contract values now add `resolveNtkTableRecipe()` classes while preserving `.ntk-data-table`, QTable row selection, row-click behavior, row actions, status cells, and custom cell slots.
- Focused validation passed: `npm test -- tests/unit/components/ui/NtkDataTable.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 1 file and 8 tests.
- Focused recipe/table validation passed: `npm run test -- tests/unit/components/ui/NtkDataTable.spec.ts tests/unit/design-system/components/component-recipes.spec.ts tests/unit/design-system/components/ds-table.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 24 tests.
- `npm run type-check` passed.
- `npm run lint -- --quiet` passed.
- `npm run test:design-system` passed with 11 files and 55 tests.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `493bee1` created the NtkDataTable compatibility slice.
- PR #16 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/16`.
- PR #16 Vercel check passed; GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: full `NtkSelect` parity decisions, broader CMS direct Quasar migration, and final PR/CI/review closeout.

### 2026-06-20 01:42 - CMS Media Module DsButton Slice

- Replaced the seven direct `q-btn` controls in `CmsMediaModuleSurface.vue` with rendered `DsButton` controls.
- Preserved create/save/delete/replace/branding event behavior and updated disabled bindings to the native `disabled` prop.
- Added scoped media action styles for `ntk-button` icon/label rendering.
- Updated media E2E button selectors from `.q-btn` to role/name lookup and made `openDrawerModule` tolerate the current listitem-based drawer markup.
- Confirmed `CmsMediaModuleSurface.vue` no longer contains direct `<q-btn>` usage.
- Focused validation passed: `npm test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 2 files and 18 tests.
- `npm run type-check` passed.
- `npm run lint -- --quiet` passed.
- `npm run test:architecture` passed.
- Focused media E2E subset was attempted: `manages media library assets and applies branding bindings` passed; the three block-preview media flows still fail after asset selection because `img.cms-landing-hero-media__image` is not rendered in the Blocks preview, outside the migrated Media button surface.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `37f90ff` created the CMS Media Module DsButton slice.
- PR #17 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/17`.
- PR #17 Vercel check passed; GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: broader CMS direct Quasar migration, bridge selector reduction, full `NtkSelect` parity decisions, and final PR/CI/review closeout.

### 2026-06-20 01:53 - NtkSelect Compatibility Slice

- Kept `NtkSelect` as a Quasar-backed compatibility adapter while adding design-system props for `variant`, `size`, `intent`, `disabled`, `invalid`, and `required`.
- Recognized field contract values now add `resolveNtkFieldRecipe()` classes while preserving `.ntk-select`, QSelect, multiple/chips behavior, select-all actions, and menu behavior.
- Preserved explicit legacy prop precedence for `outlined`, `filled`, `dense`, and `disable`; `outlined`/`filled` are treated as one visual group so partial legacy input wins over `variant`.
- Kept `size="lg"` as class-only compatibility and `required` as ARIA/state-only for this slice to avoid changing Quasar validation behavior.
- Focused validation passed: `npm test -- tests/unit/components/form/NtkFormComponents.spec.ts tests/unit/design-system/components/component-recipes.spec.ts tests/unit/design-system/components/ds-select.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 41 tests.
- `npm run type-check` passed.
- `npm run lint -- --quiet` passed.
- `npm run test:design-system` passed with 11 files and 55 tests.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `6460318` created the NtkSelect compatibility slice.
- PR #18 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/18`.
- PR #18 Vercel check passed; GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: broader CMS direct Quasar migration, bridge selector reduction, and final PR/CI/review closeout.

### 2026-06-20 02:14 - CMS Releases Module DsButton Slice

- Replaced the eleven direct `q-btn` controls in `CmsReleasesModuleSurface.vue` with rendered `DsButton` controls.
- Preserved release orchestration, acknowledgement, checklist shortcut, and checklist drill-down event contracts while moving disable bindings from Quasar `disable` to native `disabled`.
- Updated release E2E selectors from `.q-btn` to role/name based button lookup in `cms-settings-flow.spec.ts` and `cms-visual-regression.spec.ts`.
- Added template audit coverage proving the Releases surface imports `DsButton` and no longer contains direct `<q-btn>` usage.
- Refreshed the affected Windows visual baselines for release review, acknowledgements, review package history, and checklist drill-down.
- Focused validation passed: `npm test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 2 files and 19 tests.
- `npm run type-check` passed.
- `npm run lint -- --quiet` passed.
- Focused release E2E passed: `npx playwright test tests/e2e/cms-settings-flow.spec.ts -g "executes release orchestration flow|surfaces a release candidate checklist and updates it after validation|records release review acknowledgements" --workers=1` with 3 tests.
- Focused release visual update passed: `npx playwright test tests/e2e/cms-visual-regression.spec.ts -g "captures phase 6 releases review surface|captures phase 7 review acknowledgements surface|captures phase 7 review package history surface|captures phase 7 release checklist drill-down surface" --workers=1 --update-snapshots` with 4 tests.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Subagent audit identified the next low-conflict slices as `CmsPreviewToolbar` `q-select` to `NtkSelect` migration and `NtkInput` field compatibility parity.
- Commit `f00de39` created the CMS Releases Module DsButton slice.
- PR #19 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/19`.
- PR #19 remote checks passed at 2026-06-20 02:17: Vercel passed, Vercel Preview Comments passed, and GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: broader CMS direct Quasar migration, bridge selector reduction, `CmsPreviewToolbar` select migration, `NtkInput` compatibility parity, and final PR/CI/review closeout.

### 2026-06-20 02:20 - NtkInput Compatibility Slice

- Kept `NtkInput` as a Quasar-backed compatibility adapter while adding design-system props for `variant`, `size`, `intent`, `disabled`, `invalid`, and `required`.
- Recognized field contract values now add `resolveNtkFieldRecipe()` classes while preserving `.ntk-input`, QInput, v-model behavior, prepend/append slots, hints, and rules.
- Preserved explicit legacy prop precedence for `outlined`, `filled`, `dense`, and `disable`; `outlined`/`filled` are treated as one visual group so partial legacy input wins over `variant`.
- Kept `size="lg"` as class-only compatibility and `required` as ARIA/state-only for this slice to avoid changing Quasar validation behavior.
- Focused validation passed: `npm test -- tests/unit/components/form/NtkFormComponents.spec.ts tests/unit/design-system/components/component-recipes.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 2 files and 41 tests.
- `npm run type-check` passed.
- `npm run lint -- --quiet` passed.
- `npm run test:design-system` passed with 11 files and 55 tests.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `8994da6` created the NtkInput compatibility slice.
- PR #20 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/20`.
- PR #20 remote checks passed after the final push: Vercel passed, Vercel Preview Comments passed, and GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: broader CMS direct Quasar migration, bridge selector reduction, and final PR/CI/review closeout.

### 2026-06-20 02:43 - CMS Preview Toolbar NtkSelect Slice

- Replaced the three direct `q-select` controls in `CmsPreviewToolbar.vue` with the `NtkSelect` compatibility wrapper.
- Preserved draft/published preview source, locale, viewport, toolbar `data-*` attributes, emitted update contracts, and the `cms-preview-toolbar__popup` class.
- Added focused unit coverage for the shared toolbar wrapper props and template audit coverage proving the toolbar imports `NtkSelect` and no longer contains direct `<q-select>` usage.
- Refreshed affected Windows visual baselines for the Blocks published mobile preview and the phase 6 Pages/Blocks review summary surfaces.
- Focused validation passed: `npm test -- tests/unit/templates/CmsAuthoringChromeComponents.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 49 tests.
- `npm run lint -- --quiet` passed.
- `npm run type-check` passed.
- Focused visual validation passed: `npx playwright test tests/e2e/cms-visual-regression.spec.ts -g "captures pages preview in published tablet pt-BR mode|captures blocks preview in published mobile pt-BR mode" --workers=1` with 2 tests.
- Focused visual update passed: `npx playwright test tests/e2e/cms-visual-regression.spec.ts -g "captures phase 6 pages review summary surface|captures phase 6 blocks review summary surface" --workers=1 --update-snapshots` with 2 tests.
- `git diff --check` passed.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- The focused `cms-settings-flow` draft/published viewport test was re-run with this slice stashed and still failed on the parent branch before this toolbar migration; the failure is tracked as an inherited Blocks runtime preview text issue, not as a `NtkSelect` migration regression.
- Commit `422873e` created the CMS Preview Toolbar NtkSelect slice.
- PR #21 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/21`.
- PR #21 remote checks passed at 2026-06-20 02:45: Vercel passed, Vercel Preview Comments passed, and GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: broader CMS direct Quasar migration, bridge selector reduction, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

### 2026-06-20 02:57 - CMS Media Module Ntk Form Field Slice

- Replaced the remaining eight direct `q-input` fields and three direct `q-select` fields in `CmsMediaModuleSurface.vue` with `NtkInput` and `NtkSelect` compatibility wrappers.
- Preserved media field labels, hints, numeric bounds, textarea autogrow, replace-target clearing, emitted update contracts, and `cms-media-module-surface__popup` menu styling.
- Forwarded `hint` and `aria-describedby` through `NtkSelect` so migrated select fields keep helper text and accessible descriptions.
- Added form component coverage for `NtkSelect` hint/description forwarding and template audit coverage proving the Media module imports `NtkInput`/`NtkSelect` and no longer contains direct `<q-input>` or `<q-select>` usage.
- Focused validation passed: `npm test -- tests/unit/components/form/NtkFormComponents.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 50 tests.
- `npm run type-check` passed.
- `npm run lint -- --quiet` passed.
- Focused media E2E passed for `manages media library assets and applies branding bindings`.
- Focused media replacement E2E was re-run with this slice stashed and still failed on the parent branch at the known Blocks runtime preview image assertion, before returning to the migrated Media fields.
- `git diff --check` passed.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Subagent audits confirmed this field slice is viable and identified a separate future bridge cleanup slice in `cms-authoring-reference.css`.
- Commit `3573e46` created the CMS Media Module Ntk form field slice.
- PR #22 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/22`.
- PR #22 remote checks passed at 2026-06-20 02:58: Vercel passed, Vercel Preview Comments passed, and GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: broader CMS direct Quasar migration, bridge selector reduction, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

### 2026-06-20 03:07 - CMS Field Bridge Token Alias Slice

- Removed duplicated broad Quasar field overrides from `src/templates/styles/cms-authoring-reference.css`.
- Routed CMS field text, label, placeholder, icon, control background, border, hover, and focus behavior through scoped token aliases consumed by the shared template bridge.
- Added template audit coverage proving the aliases exist and the removed `.cms-shell-page :deep(.q-field...)` overrides do not return.
- Refreshed the dark CMS shell Windows visual baseline because fields now follow the tokenized CMS dark surface instead of Quasar default light field styling.
- Focused governance passed: `node scripts/lint-css-governance.mjs --root src/templates --format=json` with `quasarClassSelectors: 241`, `unmanagedDeepSelectors: 91`, `importantDeclarations: 134`, and no exceeded metrics.
- Focused Stylelint passed: `npx stylelint "src/templates/styles/reference-app-bridge.scss" "src/templates/styles/cms-authoring-reference.css"`.
- Focused audit passed: `npx vitest run --config tests/vitest.config.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 16 tests.
- CMS visual regression passed: `npx playwright test tests/e2e/cms-visual-regression.spec.ts --workers=1` with 20 tests.
- `git diff --check` passed.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `4b5a620` created the CMS field bridge token alias slice.
- PR #23 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/23`.
- PR #23 remote checks passed at 2026-06-20 03:09: Vercel passed, Vercel Preview Comments passed, and GitHub Actions are still not present in `gh pr checks`.
- Remaining gaps: broader CMS direct Quasar migration, remaining bridge selector reduction, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

### 2026-06-20 03:19 - CMS Shell Native Card Slice

- Replaced the shared `q-card` roots in `CmsShellCard.vue` and `CmsAuthoringWorkbench.vue` with native `section` markup.
- Preserved `.cms-shell-card` classes, slots, existing separator behavior, and workbench delegation.
- Added focused unit coverage for native section roots and template audit coverage preventing direct `<q-card>` regression in the shared shell components.
- Refreshed the dark CMS shell Windows visual baseline because the workbench no longer inherits Quasar's card default surface.
- Focused validation passed: `npm test -- tests/unit/templates/CmsAuthoringChromeComponents.spec.ts tests/unit/templates/TemplateWhiteLabelAudit.spec.ts tests/unit/modules/cms/CmsConfigCoverage.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism` with 3 files and 51 tests.
- `npm run type-check` passed.
- `npm run lint -- --quiet` passed.
- Focused governance passed: `node scripts/lint-css-governance.mjs --root src/templates --format=json` with `directQuasarTags: 1057` and no exceeded metrics.
- CMS visual regression passed: `npx playwright test tests/e2e/cms-visual-regression.spec.ts --workers=1` with 20 tests.
- `git diff --check` passed.
- `npm run verify` passed, including 55 design-system tests, architecture governance, 25 browser-gate Playwright tests, and package build.
- Commit `257473b` created the CMS shell native card slice.
- PR #24 opened as draft: `https://github.com/ThiagoGuislotti/nettoolskit-ui-vue/pull/24`.
- Remaining gaps: broader CMS direct Quasar migration, remaining bridge selector reduction, inherited Blocks preview runtime content failure triage, and final PR/CI/review closeout.

## Closeout Expectations

- README update is required when package surface, commands, or public API changes.
- CHANGELOG update is required when user-visible package behavior changes.
- Commit suggestion for the planning reset: `docs(planning): reset frontend standard specs`
- Commit suggestion for the package surface slice: `feat(package): align nettoolskit package surface`
- Commit suggestion for the design system foundation slice: `feat(design-system): add token theme and recipe foundation`
- Commit suggestion for the CMS template migration slice: `refactor(cms): migrate editor toolbar actions to ntk button`
- Commit suggestion for the quality gates and docs slice: `feat(design-system): add generated docs and governance gates`
- Commit suggestion for the browser style and visual gate slice: `test(design-system): add browser style and cms visual gates`
- Do not move specs or this plan to completed until validation, review, and closeout evidence are recorded.