# Enterprise Reference Visual Evidence Plan

Date: 2026-04-22
Status: completed
Progress: 100%
Primary specialist: `dev-frontend-vue-quasar-engineer`
Tester: mandatory
Reviewer: completed through automated evidence and guardrails
Release closeout: completed

## Scope Summary

Raise the Vue + Quasar template runtime to enterprise-grade visual assurance by making the reference project in `.temp/reference` the explicit comparison base for samples and template runtime evidence.

Current state: the runtime visual suite is green for theme contracts, dark theme contrast, Quasar overlay surfaces, screenshot baselines, Highcharts chart structure, and user initials avatar behavior. Direct reference-vs-sample evidence now exists as a repeatable Playwright artifact under `.build/evidence`.

## Enterprise Status

Overall status: 100%

Completed coverage:
- Existing Playwright visual suite validates Revolut, Claude, Warp, and Resend theme contracts.
- Existing screenshot baselines cover header, dashboard card, charts, clients table, orders table, settings card, and user menu.
- Existing dark guardrails catch light backgrounds with low-contrast text in Warp and Resend themes.
- Existing checks verify that the user avatar renders initials instead of a fallback icon.
- Existing runtime coverage exercises dashboard, clients, orders, settings, knowledge, profile, chat, and overlays.
- Dashboard charts now render with Highcharts, matching the same reference resource family instead of a CSS/SVG approximation.
- Chart, grid, label, card, and callout colors remain driven by white-label CSS variables and runtime theme tokens.

Open enterprise gaps:
- No remaining visual parity gaps are open for the reference/runtime scope.
- Non-visual package hygiene remains tracked separately: `npm audit --audit-level=high` reports 5 high and 1 moderate vulnerability in `.build/npm-audit-highcharts.json`.

## Evidence Update - 2026-04-22

Generated evidence:
- `.build/evidence/reference-visual-comparison/original-reference-dashboard.png`
- `.build/evidence/reference-visual-comparison/original-reference-user-menu.png`
- `.build/evidence/reference-visual-comparison/template-runtime-reference-charts.png`
- `.build/evidence/reference-visual-comparison/template-runtime-user-menu.png`
- `.build/evidence/reference-visual-comparison/template-runtime-reports-route.png`
- `.build/evidence/reference-visual-comparison/template-runtime-warp-clients-table.png`
- `.build/evidence/reference-visual-comparison/original-reference-contract.json`
- `.build/evidence/reference-visual-comparison/template-runtime-reference-evidence.json`

Validation results:
- `npm run type-check`: passed.
- `npx playwright test tests/e2e/template-runtime-reference-evidence.spec.ts --workers=1 --output=.build/test-results/reference-visual-evidence`: 2 passed.
- `npx playwright test tests/e2e/template-runtime-reference-evidence.spec.ts tests/e2e/template-runtime-screenshots.spec.ts tests/e2e/template-runtime-visual.spec.ts tests/e2e/template-runtime-dark-theme-guardrails.spec.ts --workers=1 --output=.build/test-results/enterprise-visual-evidence`: 20 passed.
- `npm run build:samples`: passed.
- `npx playwright test tests/e2e/template-runtime-screenshots.spec.ts --workers=1 --update-snapshots --output=.build/test-results/highcharts-snapshots-final`: 4 passed.
- `npx playwright test tests/e2e/template-runtime-reference-evidence.spec.ts tests/e2e/template-runtime-screenshots.spec.ts tests/e2e/template-runtime-visual.spec.ts tests/e2e/template-runtime-dark-theme-guardrails.spec.ts --workers=1 --output=.build/test-results/highcharts-parity-final`: 20 passed.
- `npm run test`: 130 files passed, 1430 tests passed.
- `npm run lint`: passed with 0 errors and existing warnings.
- `npm audit --audit-level=high --json`: completed with findings recorded under `.build/npm-audit-highcharts.json`.

Route/resource parity updates:
- `#/configurations` is now supported as an alias for the runtime settings page.
- `#/reports` is now available as a reference-route placeholder in the template runtime.
- Sample logo asset hash matches all three reference logo aliases from `.temp/reference/src/assets/images`.
- Dashboard chart rendering now uses `highcharts@12.5.0` with deterministic animation disabled for screenshot stability.

## Ordered Tasks

### Task 1 - Reference Contract Evidence

Target paths:
- `tests/e2e/template-runtime-reference-evidence.spec.ts`
- `.build/evidence/reference-visual-comparison/`

Work:
- Add an E2E evidence spec that reads the `.temp/reference` contract.
- Validate that the sample header logo matches the reference logo asset by file hash.
- Validate that the public sample exposes the same primary reference menu resources: Dashboard, Clientes, Pedidos, Configurações.
- Validate that the template runtime exposes the full reference-derived route surface plus runtime additions.
- Generate screenshot evidence under `.build/evidence/reference-visual-comparison`.

Validation commands:
- `npx playwright test tests/e2e/template-runtime-reference-evidence.spec.ts --workers=1 --output=.build/test-results/reference-visual-evidence`

Checkpoint:
- Evidence spec passes and writes the evidence screenshots/manifest only under `.build`.

Suggested commit:
- `test(e2e): add reference visual evidence capture`

### Task 2 - Current Enterprise Visual Gate

Target paths:
- `tests/e2e/template-runtime-screenshots.spec.ts`
- `tests/e2e/template-runtime-visual.spec.ts`
- `tests/e2e/template-runtime-dark-theme-guardrails.spec.ts`
- `.build/test-results/enterprise-visual-evidence`
- `.build/playwright-report`

Work:
- Run the full visual enterprise gate.
- Keep Playwright output and HTML report under `.build`.
- Summarize results in the active plan.

Validation commands:
- `npx playwright test tests/e2e/template-runtime-screenshots.spec.ts tests/e2e/template-runtime-visual.spec.ts tests/e2e/template-runtime-dark-theme-guardrails.spec.ts --workers=1 --output=.build/test-results/enterprise-visual-evidence`

Checkpoint:
- All visual gate specs pass.

Suggested commit:
- `docs(plans): record enterprise visual gate evidence`

### Task 3 - Same Resources Parity Audit

Target paths:
- `samples/original-reference/`
- `samples/assets/`
- `src/templates/runtime/`
- `src/templates/pages/dashboard/`
- `src/templates/navigation/`

Work:
- Confirm the sample uses the reference logo asset, reference shell, reference menu labels, reference dashboard data, reference chart surface, and reference user initials avatar.
- Confirm the template runtime routes are derived from the reference route surface and document any additions.
- Decide whether exact Highcharts parity is mandatory or whether the CSS/SVG chart surface is acceptable as reference-equivalent.

Validation commands:
- `npm run type-check`
- `npm run build:samples`
- `npx playwright test tests/e2e/template-runtime-reference-evidence.spec.ts tests/e2e/template-runtime-screenshots.spec.ts --workers=1 --output=.build/test-results/reference-parity-gate`

Checkpoint:
- No known resource mismatch remains undocumented.

Suggested commit:
- `docs(plans): record reference resource parity audit`

## Validation Checklist

- [x] Reference evidence spec exists and passes.
- [x] Evidence screenshots and manifest are generated under `.build/evidence/reference-visual-comparison`.
- [x] Full visual gate passes.
- [x] HTML report remains under `.build/playwright-report`.
- [x] Type-check passes.
- [x] Sample build passes.
- [x] Any remaining intentional implementation differences are explicitly accepted or converted into follow-up work.

## Risks

- `.temp/reference` is a local reference copy, so the evidence spec must fail clearly if it is missing.
- Exact pixel parity with the original reference app may not be realistic while the library intentionally tokenizes colors and uses reusable templates.
- Exact Highcharts parity may add dependency and theming complexity; this decision should be explicit before calling the work 100%.

## Closeout Expectations

- Moved to `planning/plans/completed/YYYY-MM` after the evidence spec, full visual gate, type-check, unit test suite, lint, and sample build passed.
- Keep generated evidence in `.build`, not in tracked source.
- Final commit should summarize the enterprise visual evidence status and the accepted reference parity contract.