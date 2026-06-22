# Samples Home Functional Navigation Plan - 2026-04-10

## Scope Summary
- evolve the root `samples/` runtime into a true entry page for navigation and template selection
- keep `src/**` as the reusable component/template source while `samples/**` orchestrates navigation, demo state, and interaction feedback
- remove no-op interactions from the sample wrappers so visible buttons, submits, and action surfaces produce deterministic behavior

## Ordered Tasks
1. Completed: mapped the root runtime and inserted the home navigation layer without breaking the reference catalog shell.
2. Completed: added an initial navigation/selection surface for runtimes, visual families, and showcase examples.
3. Completed: supported deep links from the home page into filtered showcase views by family and example.
4. Completed: replaced no-op handlers and silent emits in the sample wrappers with visible functional behavior.
5. Completed: validated type-check, focused tests, build, lint, and browser smoke checks for the checkpoint.

## Validation Checklist
- `npm run type-check`
- `npm run test -- tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts`
- `npm run build:samples`
- `npx eslint samples tests/unit/landing/LandingTokenization.spec.ts --ext .ts,.vue`
- browser smoke: `http://127.0.0.1:4173/` and `http://127.0.0.1:4173/?templates=1`

## Closeout Expectations
- root `samples/` must present a clear starting point for navigation and template selection
- template and family selection should deep-link into the showcase instead of requiring manual browsing
- interactive sample buttons must update state, navigate, or emit visible feedback instead of remaining silent

## Validation Notes
- `npm run type-check`
- `npm run test -- tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts`
- `npx eslint samples tests/unit/landing/LandingTokenization.spec.ts --ext .ts,.vue`
- `npm run build:samples`
- browser smoke on `http://127.0.0.1:4173/`, `http://127.0.0.1:4173/?templates=1&family=signal-command`, and sample interaction clicks