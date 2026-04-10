# Samples Five Examples Light Dark Plan - 2026-04-10

## Scope Summary
- reshape the samples showcase around exactly five curated reusable examples
- render every curated example with two functional whitelabel variants: light and dark
- keep the implementation config-driven so `samples/` only consumes `src/**` templates and shared whitelabel utilities
- preserve the approved reference layout as the baseline visual model and derive the remaining packs as controlled variations

## Ordered Tasks
1. Inspect the current showcase, choose the five canonical examples, and confirm which existing interactions already need to remain functional.
2. Add a config-driven family/variant model where each example maps to one light preset and one dark preset with whitelabel overrides.
3. Refactor the showcase host and section renderer so the same example is previewed twice, once per theme, without duplicating template implementations.
4. Update the samples home navigation so the initial page advertises the five curated examples and their light/dark availability.
5. Refresh tests and validation coverage for the exact count, light/dark guarantees, and route-driven filtering behavior.
6. Run type-check, focused tests, lint/build, browser smoke, and create a clean commit checkpoint.

## Validation Checklist
- `npm run type-check`
- `npm run test -- tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts`
- `npx eslint samples tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/landing/LandingTokenization.spec.ts --ext .ts,.vue`
- `npm run build:samples`
- browser smoke on `http://127.0.0.1:4173/` and `http://127.0.0.1:4173/?templates=1`

## Closeout Expectations
- exactly five curated examples should be visible in the showcase path
- each curated example must expose both light and dark theme variants through whitelabel config
- example actions, buttons, toggles, and selection controls must remain live instead of static mockups
- the samples home should clearly help the user navigate into the showcase or directly into one of the curated examples
