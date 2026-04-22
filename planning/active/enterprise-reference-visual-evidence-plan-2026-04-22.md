# Enterprise Reference Visual Evidence Plan

Date: 2026-04-22
Status: active
Progress: 72%
Primary specialist: `dev-frontend-vue-quasar-engineer`
Tester: mandatory
Reviewer: recommended
Release closeout: required before moving to `planning/completed`

## Scope Summary

Raise the Vue + Quasar template runtime to enterprise-grade visual assurance by making the reference project in `.temp/reference` the explicit comparison base for samples and template runtime evidence.

Current state: the runtime visual suite is green for theme contracts, dark theme contrast, Quasar overlay surfaces, screenshot baselines, chart structure, and user initials avatar behavior. The remaining gap is that direct reference-vs-sample evidence is not yet a first-class, repeatable artifact in every run.

## Enterprise Status

Overall status: 72%

Completed coverage:
- Existing Playwright visual suite validates Revolut, Claude, Warp, and Resend theme contracts.
- Existing screenshot baselines cover header, dashboard card, charts, clients table, orders table, settings card, and user menu.
- Existing dark guardrails catch light backgrounds with low-contrast text in Warp and Resend themes.
- Existing checks verify that the user avatar renders initials instead of a fallback icon.
- Existing runtime coverage exercises dashboard, clients, orders, settings, knowledge, profile, chat, and overlays.

Open enterprise gaps:
- Direct `.temp/reference` to `samples` parity evidence must be generated as a durable `.build/evidence` artifact.
- Route, menu, and asset parity must be validated against the reference source, not only against current sample expectations.
- Historical intentional differences must be revalidated under the stricter "same resources as reference" requirement.
- Final closeout must document whether chart implementation is accepted as reference-equivalent or must use the exact Highcharts implementation.

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

- [ ] Reference evidence spec exists and passes.
- [ ] Evidence screenshots and manifest are generated under `.build/evidence/reference-visual-comparison`.
- [ ] Full visual gate passes.
- [ ] HTML report remains under `.build/playwright-report`.
- [ ] Type-check passes.
- [ ] Sample build passes.
- [ ] Any remaining intentional implementation differences are explicitly accepted or converted into follow-up work.

## Risks

- `.temp/reference` is a local reference copy, so the evidence spec must fail clearly if it is missing.
- Exact pixel parity with the original reference app may not be realistic while the library intentionally tokenizes colors and uses reusable templates.
- Exact Highcharts parity may add dependency and theming complexity; this decision should be explicit before calling the work 100%.

## Closeout Expectations

- Move this plan to `planning/completed` only after the evidence spec, full visual gate, type-check, and sample build pass.
- Keep generated evidence in `.build`, not in tracked source.
- Final commit should summarize the enterprise visual evidence status and the accepted reference parity contract.
