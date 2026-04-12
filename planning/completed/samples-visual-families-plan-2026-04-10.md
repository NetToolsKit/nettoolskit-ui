# Samples Visual Families Plan - 2026-04-10

## Scope Summary
- evolve the `samples/` showcase from a flat sequence of examples into a visual-families catalog
- keep `samples/` as a thin host while `src/**` remains the reusable source of templates, shells, and components
- drive each family through whitelabel-style configuration so layout tone, palette, radius, and typography can vary without duplicating implementation

## Input References
- local shell/layout baseline: `.temp/reference/src/layouts/MainLayoutHorizontal.vue`
- local color baseline: `.temp/reference/src/css/app.scss`
- visual direction catalog: `https://github.com/VoltAgent/awesome-design-md/tree/main/design-md`
- specific inspiration samples reviewed for implementation inference:
  - `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/voltagent/DESIGN.md`
  - `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/stripe/DESIGN.md`
  - `https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/design-md/uber/DESIGN.md`

## Ordered Tasks
1. Completed: define the target architecture with `families/` and `components/` folders so `TemplateShowcaseApp.vue` stays orchestration-only.
2. Completed: introduce config-driven visual families with at least 5 distinct formats backed by whitelabel overrides.
3. Completed: refactor the showcase host and section renderer to consume the family configs instead of hardcoded example order.
4. Completed: update docs/tests so the new contract is explicit and regression coverage enforces the family architecture.
5. Completed: validate type-check, focused tests, and `build:samples`, then create a commit checkpoint.

## Validation Checklist
- `npm run type-check`
- `npm run test -- tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts`
- `npm run build:samples`
- `npx eslint samples/TemplateShowcaseApp.vue samples/template-showcase tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/landing/LandingTokenization.spec.ts --ext .ts,.vue`

## Recommended Specialist
- primary: `dev-frontend-vue-quasar-engineer`
- planning: `plan-active-work-planner`
- validation support: `test-engineer`

## Task Targets And Checkpoints
1. Family configuration layer
   - target paths: `samples/template-showcase/families/**`, `samples/template-showcase/template-showcase.examples.ts`
   - checkpoint: each family resolves a whitelabel preset + rendered example list from config only
   - commit checkpoint suggestion: `feat(samples): add config-driven visual families`
2. Showcase renderer
   - target paths: `samples/TemplateShowcaseApp.vue`, `samples/template-showcase/components/**`, `samples/template-showcase/template-showcase.css`
   - checkpoint: showcase renders 5 family sections with visibly different layouts and no direct example sequencing in the app host
   - commit checkpoint suggestion: `refactor(samples): render showcase by visual family`
3. Documentation and regression coverage
   - target paths: `samples/README.md`, `tests/unit/landing/LandingTokenization.spec.ts`, `tests/unit/samples/TemplateVisualFamilies.spec.ts`
   - checkpoint: docs explain the family/config architecture and tests enforce at least 5 families plus `src/**` reuse
   - commit checkpoint suggestion: `test(samples): cover visual family configuration`

## Closeout Expectations
- preserve `src/**` as the canonical reusable implementation source
- keep family variation parameterized through configuration and whitelabel overrides, not copied components
- maintain a clear path to add more families later without growing another monolithic host file

## Validation Notes
- `npm run type-check`
- `npm run test -- tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts`
- `npx eslint samples/TemplateShowcaseApp.vue samples/template-showcase tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/landing/LandingTokenization.spec.ts --ext .ts,.vue`
- `npm run build:samples`
