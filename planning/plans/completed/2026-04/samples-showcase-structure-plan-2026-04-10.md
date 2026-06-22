# Samples Showcase Structure Plan - 2026-04-10

## Scope Summary
- reorganize the `samples/` showcase so `TemplateShowcaseApp.vue` stops acting as a monolith
- extract each showcase example into its own subfolder under `samples/template-showcase/examples/**`
- keep `samples/` as a thin host layer while reusable implementation continues to come from `src/**`

## Ordered Tasks
1. Completed: map the current showcase file and identify stable extraction boundaries for each example section.
2. Completed: move showcase data, styles, and example implementations into `samples/template-showcase/**`.
3. Completed: update tests and docs that assume the old flat showcase layout.
4. Completed: validate the restructured showcase and create a commit checkpoint.

## Validation Checklist
- `npm run type-check`
- `npm run test -- tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts`
- `npm run build:samples`
- `npx eslint samples/TemplateShowcaseApp.vue samples/template-showcase tests/unit/landing/LandingTokenization.spec.ts --ext .ts,.vue`

## Closeout Expectations
- keep `samples/TemplateShowcaseApp.vue` small and orchestration-only
- each showcase example must live in its own subfolder with local state close to the rendered sample
- avoid moving shared implementation out of `src/**`; only the host/sample composition belongs in `samples/**`

## Validation Notes
- `npm run type-check`
- `npm run test -- tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts`
- `npx eslint samples/TemplateShowcaseApp.vue samples/template-showcase tests/unit/landing/LandingTokenization.spec.ts --ext .ts,.vue`
- `npm run build:samples`