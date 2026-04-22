# Reference Highcharts Parity Plan

Date: 2026-04-22
Status: active
Progress: 0%
Primary specialist: `dev-frontend-vue-quasar-engineer`
Tester: mandatory
Reviewer: mandatory before closeout
Release closeout: required

## Scope Summary

Close the remaining enterprise visual parity gap by replacing the CSS/SVG dashboard chart approximation with a Highcharts-based implementation aligned to the source reference project in `.temp/reference/src/pages/PipelinePage.vue`.

This work is frontend-only. No backend, API, CMS backend, database, or server behavior belongs in this plan.

## Ordered Tasks

### Task 1 - Dependency Contract

Target paths:
- `package.json`
- `package-lock.json`

Work:
- Add `highcharts` as a runtime dependency because the exported dashboard template will render charts directly.
- Keep the version aligned to the local reference dependency contract.

Validation:
- `npm install`
- `npm run type-check`

Checkpoint:
- Lockfile is updated and type-check can resolve Highcharts.

Suggested commit:
- `chore(deps): add highcharts for reference charts`

### Task 2 - Chart Component Parity

Target paths:
- `src/templates/pages/dashboard/ReferenceDashboardCharts.vue`

Work:
- Replace CSS-only chart drawings with real Highcharts pie and bar charts.
- Preserve the existing public props: `statusSegments` and `categorySeries`.
- Preserve token-driven theming so white-label palettes continue to drive colors, surfaces, borders, labels, and dark mode.
- Manage chart creation, update, resize, and destroy using Vue lifecycle hooks.
- Keep deterministic rendering for Playwright screenshots by disabling animation.

Validation:
- `npm run type-check`
- `npm run build:samples`

Checkpoint:
- Runtime and original sample render Highcharts without memory leaks or console errors.

Suggested commit:
- `refactor(charts): render reference dashboard charts with highcharts`

### Task 3 - Visual Tests And Evidence

Target paths:
- `tests/e2e/template-runtime-visual.spec.ts`
- `tests/e2e/template-runtime-screenshots.spec.ts`
- `tests/e2e/template-runtime-reference-evidence.spec.ts`
- `tests/e2e/template-runtime-screenshots.spec.ts-snapshots/`
- `.build/evidence/reference-visual-comparison/`

Work:
- Update chart assertions to prove Highcharts containers, pie slices, bar points, labels, and disabled credits.
- Update screenshot snapshots intentionally after chart parity changes.
- Regenerate `.build` evidence screenshots for the reference visual comparison.

Validation:
- `npx playwright test tests/e2e/template-runtime-reference-evidence.spec.ts tests/e2e/template-runtime-screenshots.spec.ts tests/e2e/template-runtime-visual.spec.ts tests/e2e/template-runtime-dark-theme-guardrails.spec.ts --workers=1 --output=.build/test-results/highcharts-parity`

Checkpoint:
- Full visual gate passes after snapshot updates.

Suggested commit:
- `test(e2e): certify highcharts reference parity`

### Task 4 - Plan Closeout

Target paths:
- `planning/active/enterprise-reference-visual-evidence-plan-2026-04-22.md`
- `planning/active/reference-highcharts-parity-plan-2026-04-22.md`

Work:
- Update enterprise progress after Highcharts parity evidence passes.
- Mark this plan completed or document any remaining accepted difference.
- Keep generated screenshots and reports under `.build`.

Validation:
- `git status --short`
- Confirm only intended source/test/plan/snapshot/dependency files are tracked.

Checkpoint:
- Project is ready to report near-100% or 100% depending on test results.

Suggested commit:
- `docs(plans): close highcharts parity evidence`

## Validation Checklist

- [ ] `highcharts` dependency is installed and locked.
- [ ] `ReferenceDashboardCharts.vue` renders real Highcharts charts.
- [ ] Chart colors are still passed through theme variables / runtime tokens.
- [ ] Highcharts animations are disabled for deterministic visual tests.
- [ ] Existing dark theme guardrails still pass.
- [ ] Screenshot snapshots are intentionally updated.
- [ ] Evidence files are regenerated under `.build/evidence/reference-visual-comparison`.
- [ ] `npm run type-check` passes.
- [ ] `npm run build:samples` passes.
- [ ] Full visual gate passes.

## Risks

- Highcharts introduces a larger runtime dependency and can affect bundle size.
- Pixel baselines will change because real chart rendering differs from the CSS approximation.
- CSS variables must be resolved before passing colors into Highcharts, otherwise dark themes can regress into unreadable labels.

## Closeout Expectations

- Do not commit `.build` artifacts.
- Commit dependency changes, chart implementation, test/snapshot changes, and plan closeout separately when possible.
- Move this plan to `planning/completed` only after the final validation gate passes.
