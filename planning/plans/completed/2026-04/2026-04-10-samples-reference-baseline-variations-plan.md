# Samples Reference Baseline Variations Plan - 2026-04-10

## Scope Summary
- anchor the visual-family showcase to the approved local reference in `.temp/reference`
- create one baseline family that mirrors the approved shell and dashboard more faithfully
- turn the remaining families into configuration-driven variations of the same comparison model instead of unrelated template mixes

## Ordered Tasks
1. Completed: inspected the approved local reference and mirrored the shell, dashboard, and menu details needed for the baseline family.
2. Completed: added the approved-reference baseline family and aligned its tokens, chrome, and brand treatment to the local reference.
3. Completed: rebuilt the `layout-dashboard` showcase example so it matches the approved dashboard composition more closely while staying on top of reusable `src/**` templates.
4. Completed: rebalanced the remaining visual families so they compare the same model through different whitelabel configurations.
5. Completed: validated type-check, focused tests, lint, build, and browser smoke for the checkpoint.

## Validation Checklist
- `npm run type-check`
- `npm run test -- tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts`
- `npx eslint samples tests/unit/samples/TemplateVisualFamilies.spec.ts --ext .ts,.vue`
- `npm run build:samples`
- browser smoke on `http://127.0.0.1:4173/?templates=1`

## Closeout Expectations
- one family should feel visually faithful to `.temp/reference`
- the family showcase should compare the same baseline model across multiple configurations
- the approved-reference baseline must keep runtime interactions functional instead of decorative

## Validation Notes
- `npm run type-check`
- `npm run test -- tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts`
- `npx eslint samples tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/landing/LandingTokenization.spec.ts --ext .ts,.vue`
- `npm run build:samples`
- browser smoke on `http://127.0.0.1:4173/?templates=1` and `http://127.0.0.1:4173/?templates=1&family=approved-reference`
- residual browser issues are limited to generic form-field accessibility hints in older example surfaces; no unresolved Vue component warnings remain in the showcase host