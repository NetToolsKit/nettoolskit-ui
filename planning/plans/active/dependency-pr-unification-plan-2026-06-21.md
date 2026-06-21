# Dependency PR Unification - Plan

Date: 2026-06-21
LastUpdated: 2026-06-21 17:07
Status: active
Branch: `chore/unify-dependency-upgrades`
Progress: 67% (4/6 checked)

## Scope

Unify the currently open Dependabot npm pull requests into one coherent dependency update branch, fix the compatibility issues exposed by the individual PR checks, and publish one semantic PR for review.

Separate spec registration is not required for this workstream because this is dependency and CI stabilization work, not a new product behavior or architecture decision. The plan records the compatibility decisions and validation evidence.

## Target Pull Requests

- #40 TypeScript 6
- #41 eslint-plugin-vue 10
- #42 Vite 8
- #43 jsdom 29
- #44 vue-eslint-parser 10
- #45 vue-tsc 3
- #46 vue-router 5
- #47 cross-env 10
- #48 @vitejs/plugin-vue 6
- #49 @eslint/js 10
- #50 highcharts 13
- #51 ESLint 10

## Execution Checklist

- [x] Start from synchronized `main` and create the unification branch.
- [x] Apply dependency version updates as one compatible package set.
- [x] Fix TypeScript 6, vue-tsc 3, jsdom 29, Vite 8, Vue Router 5, and ESLint 10 compatibility issues.
- [x] Run install, audit, lint, type-check, unit tests, and build as applicable.
- [ ] Commit with semantic Git message and push branch.
- [ ] Open one GitHub PR and record validation/CI status.

## Validation Targets

- `npm ci`
- `npm audit --omit=dev --audit-level=high`
- `npm run lint`
- `npm run type-check`
- `npm test`
- `npm run build`

## Validation Evidence

- Passed: `npm ci --no-audit --no-fund`
- Passed: `npm audit --omit=dev --audit-level=high`
- Passed: `npm run tokens:check`
- Passed: `npm run docs:check`
- Passed: `npm run lint -- --quiet`
- Passed with warnings only: `npm run lint`
- Passed: `npm run lint:style`
- Passed: `npm run lint:css`
- Passed: `npm run type-check`
- Passed: `npm run test:architecture`
- Passed: `npm run test:design-system`
- Passed: `npx vitest run --config tests/vitest.config.ts tests/unit/modules/cms/CmsLandingFeaturesBlock.spec.ts --pool=forks --maxWorkers=1 --no-file-parallelism --reporter=verbose`
- Passed: `npm run build`
- Passed with Vite 8 warnings only: `npm run build:landing`
- Local Windows limitation: full `npm test` exceeded the local 15-minute timeout after spawning Vitest workers; River/Linux CI remains the final full-suite gate.

## Closeout

- Keep the final PR title semantic, without `[codex]`.
- After the unified PR is green, the individual Dependabot PRs can be closed as superseded.
