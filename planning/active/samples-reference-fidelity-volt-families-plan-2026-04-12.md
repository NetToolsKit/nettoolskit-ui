# Samples Reference Fidelity And Volt Families Plan - 2026-04-12

## Scope Summary
- realign the `samples/` runtime to the approved shell and spacing rules observed in `.temp/reference`
- keep one baseline pack that is structurally faithful to the local reference while using neutral naming and controlled branding
- replace the five variation packs with whitelabel families grounded in `VoltAgent/awesome-design-md`
- keep the samples host functional, selector-driven, and backed by shared `src/**` components only

## Ordered Tasks
1. Completed: audited `.temp/reference` to capture shell geometry, menu behavior, palette, typography, and dashboard rhythm.
2. Completed: compared the current `samples/` runtime against that baseline and identified host-level drift in shell, hero, spacing, typography, and duplicated navigation.
3. Completed: selected five concrete `awesome-design-md` directions to map into the current packs:
   - IBM
   - Stripe
   - Uber
   - Notion
   - Airbnb
4. Completed: simplified the `samples/` host so `/` and `/?templates=1` both sit inside the approved shell language instead of standalone promotional layouts.
5. Completed: replaced stale approved-reference branding assets with a neutral baseline identity and kept the original pack free of forbidden names.
6. Completed: tuned the reusable layout/navigation components so the baseline shell matches the local reference more closely.
7. Completed: rewrote the five pack configurations so each family documents its GitHub design source and uses source-aligned tokens for both light and dark themes.
8. Completed: fixed stale sample links and kept all navigation buttons/actions functional.
9. Completed: ran focused validation, browser smoke, and left a clean checkpoint ready for review.

## Validation Checklist
- `npm run type-check`
- `npm run test -- tests/unit/samples/TemplateShowcaseApprovedReference.spec.ts tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/landing/LandingTokenization.spec.ts`
- `npm run build:samples`
- browser smoke on:
  - `http://127.0.0.1:4173/`
  - `http://127.0.0.1:4173/?templates=1`
  - `http://127.0.0.1:4173/?templates=1&family=approved-reference`

## Source Baselines
- local approval reference: `E:\Desenvolvimento\nettoolskit-ui-vue\.temp\reference`
- GitHub design sources:
  - `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/ibm/DESIGN.md`
  - `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/stripe/DESIGN.md`
  - `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/uber/DESIGN.md`
  - `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/notion/DESIGN.md`
  - `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/airbnb/DESIGN.md`

## Closeout Expectations
- the default baseline must read as the approved local reference first, not as a separate marketing experiment
- the original pack must not expose forbidden names or stale branding assets
- the five variation packs must be visibly distinct while still inheriting the same reusable product architecture
- every selector, menu action, and runtime link used in `samples/` must remain functional
