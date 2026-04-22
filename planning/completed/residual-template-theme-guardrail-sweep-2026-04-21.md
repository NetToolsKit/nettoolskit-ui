# Residual Template Theme Guardrail Sweep

Date: 2026-04-21
Branch: `feat/remove-cms-whitelabel-reference-2026-04-01`
Status: completed - archived in `planning/completed`

## Scope Summary

Close the residual frontend-only gaps found after the template and Vue/Quasar visual workstreams were moved to `planning/completed`.

This sweep is limited to:
- white-label color leaks in shared Vue/Quasar components used by templates or samples
- visual guardrails for dashboard charts, user initials, and dark table surfaces
- documentation and artifact hygiene after completed-plan closeout

Out of scope:
- backend integration
- CMS domain behavior changes
- broad lint formatting cleanup unrelated to template/theme regressions

## Status Snapshot

Overall status: **100%**

| Slice | Status | Current evidence | Remaining closeout gap |
|---|---:|---|---|
| Slice 1 - Planning And Artifact Hygiene | 100% | Completed references were cleaned, README links stayed in English, and orphaned visual-regression screenshots were removed. | None. |
| Slice 2 - Shared Component Token Leaks | 100% | Shared components, app-shell defaults, legacy adapter defaults, branding colors, Quasar fallbacks, and reference template override order now route through token contracts. | None. |
| Slice 3 - Visual Guardrail Expansion | 100% | Runtime screenshots cover charts/orders; dark guardrails iterate tables/overlays; semantic checks prove the user initials avatar and chart DOM structure. | None. |
| Slice 4 - Validation And Closeout | 100% | Type-check, unit, lint, and focused Playwright visual suites passed after the final changes. | None. |

## Ordered Tasks

1. Clean stale documentation and artifacts.
   - Target paths: `README.md`, `planning/completed/**`, `tests/e2e/template-visual-regression.spec.ts-snapshots/**`
   - Commands: `rg`, `git ls-files`, targeted doc checks
   - Commit suggestion: `docs(plans): clean completed template references`

2. Tokenize shared component color leaks.
   - Target paths: `src/components/layout/NtkSidebar.vue`, `src/components/ui/NtkPricingCard.vue`, `src/components/ui/NtkFeatureCard.vue`, `src/components/ui/NtkSteps.vue`, `src/components/ui/NtkStatCard.vue`, `src/components/ui/NtkCreditCard.vue`, `src/components/layout/NtkCTASection.vue`, `src/components/layout/app-shell.config.ts`
   - Commands: `npm run type-check`, focused component/audit tests
   - Commit suggestion: `fix(theme): remove shared component color leaks`

3. Expand runtime visual guardrails.
   - Target paths: `tests/e2e/template-runtime-screenshots.spec.ts`, `tests/e2e/template-runtime-visual.spec.ts`, `tests/e2e/template-runtime-dark-theme-guardrails.spec.ts`, screenshot baselines
   - Commands: focused Playwright tests and snapshot update where needed
   - Commit suggestion: `test(runtime): expand visual guardrails for charts and tables`

4. Final validation and closeout.
   - Commands: `npm run type-check`, focused unit/E2E tests, `npm run lint`
   - Closeout: update this status to 100%, move to `planning/completed/`, and commit.

## Validation Checklist

- `npm run type-check` - passed.
- `npm test -- --testTimeout=30000` - passed: 125 test files, 1413 tests.
- `npm run lint` - passed with existing warnings only, 0 errors.
- `npx playwright test tests/e2e/template-runtime-screenshots.spec.ts tests/e2e/template-runtime-visual.spec.ts tests/e2e/template-runtime-dark-theme-guardrails.spec.ts --workers=1 --reporter=line` - passed: 18 tests.
- `rg` audits for direct Quasar color props/classes and legacy `theme.value.colors/theme.value.gradients` consumers - passed for template/component surfaces.

## Closeout Expectations

- no active planning/doc references point to closed template workstreams
- no orphaned visual-regression artifacts remain outside `.build` or `.temp`
- shared component colors use CSS variable/token contracts instead of Quasar defaults or legacy `useTheme` values
- dashboard charts, user initials, orders table, and dark table details are covered by stable visual guardrails

## Final Status

The residual sweep is complete. `planning/active` should be empty after this file is moved to `planning/completed`.
