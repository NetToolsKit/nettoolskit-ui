# Samples Reference Visual Parity Plan - 2026-04-13

## Scope Summary
- compare the approved local reference in `.temp/reference` against the current `samples/` baseline pack
- validate the comparison in desktop and mobile viewports using running applications instead of code-only inspection
- turn the observed visual drift into an actionable remediation sequence so the reference becomes the true base for the samples runtime

## Compared Runtimes
- reference runtime: `http://127.0.0.1:9002/pipeline`
- current baseline sample: `http://127.0.0.1:4173/?templates=1&family=approved-reference`

## Compared Viewports
- desktop: `1440x900`
- mobile: `390x844`

## Current Findings
1. The current baseline sample is still wrapped by a dark showcase shell that does not exist in the reference runtime, so the first visual read is of the catalog, not of the approved product shell.
2. The reference header is white, compact, and visually quiet, while the current sample uses a saturated blue top bar that changes the whole hierarchy before the user even reaches the dashboard preview.
3. The reference desktop route opens directly into the dashboard canvas, while the sample route inserts selector stats, sample cards, taxonomy chips, and dual-theme preview chrome ahead of the actual baseline content.
4. The approved reference dashboard in `.temp/reference` is light-first and single-canvas; the current sample baseline emphasizes side-by-side light/dark comparison, which is useful for design review but not faithful as the base runtime.
5. On mobile, the reference keeps the content immediately adjacent to the left navigation rail and prioritizes the dashboard cards, while the sample still shows the showcase header and selector scaffolding, pushing the true baseline content down the page.
6. The reference branding block is logo-led and product-shell-first, while the current sample baseline uses neutral branding correctly but still presents it through showcase framing instead of a direct shell entry.

## Ordered Tasks
1. Completed: created a dedicated runtime entry for the original reference-derived sample at `/?original=1` so it opens directly in the approved shell instead of inside the showcase wrapper.
2. Completed: kept the existing showcase route for catalog/review, but made the direct original-runtime route the preferred destination for baseline navigation from the home/runtime links.
3. Completed: aligned the original sample header, drawer, page gutter, hero spacing, charts, and dashboard lower cards more tightly to `.temp/reference` in desktop mode.
4. Completed: aligned the original mobile behavior so the original sample prioritizes the dashboard canvas and reference shell over selector chrome.
5. Completed: preserved the five whitelabel variation packs as derived examples while separating the original baseline route from the showcase flow.
6. Completed: reran browser comparison in desktop and mobile after the direct original-runtime route landed.

## Validation Checklist
- desktop smoke:
  - `http://127.0.0.1:9002/pipeline`
  - `http://127.0.0.1:4173/<new-original-route>`
- mobile smoke:
  - `390x844` on both routes above
- screenshots captured for both runtimes after the parity pass
- `npm run type-check`
- `npm run test -- tests/unit/landing/LandingTokenization.spec.ts tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/samples/TemplateShowcaseApprovedReference.spec.ts`
- `npm run build:samples`

## Recommended Specialist
- primary: `dev-frontend-vue-quasar-engineer`
- tester: mandatory
- reviewer: recommended once the direct original-runtime route is in place

## Closeout Expectations
- the original sample must open as a direct product-shell experience derived from the approved reference, not as a card inside the showcase
- desktop and mobile first-view screenshots must read as the same product family as `.temp/reference`
- the showcase remains available for pack comparison, but it no longer defines the first visual impression of the original baseline

## Progress Note
- the original baseline now opens directly at `http://127.0.0.1:4173/?original=1`
- the current workstream removed the showcase wrapper from the original path, updated the public runtime links, fixed the shared header override so the original route uses a white header again, and tightened dashboard parity with reference-like charts, titles, top-client stats, and a neutral product mark
- the shared user-menu avatar alignment was also corrected so initials render centered in both the top-right trigger and the dropdown profile block
- current validation completed:
  - `npm run type-check`
  - `npm run test -- tests/unit/landing/LandingTokenization.spec.ts tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/samples/TemplateShowcaseApprovedReference.spec.ts`
  - `npm run build:samples`
  - browser smoke on:
    - `http://127.0.0.1:4173/?original=1`
    - `http://127.0.0.1:4173/`
    - `http://127.0.0.1:4173/?templates=1`
- comparison artifacts captured:
  - `.temp/logs/reference-pipeline-desktop-current.png`
  - `.temp/logs/original-reference-desktop-parity-pass-5.png`
  - `.temp/logs/original-reference-mobile-parity-pass-2.png`
- accepted residual differences are now limited to neutral branding geometry and non-blocking chart micro-positioning; the reference remains the base for the original sample runtime and the plan can be closed
