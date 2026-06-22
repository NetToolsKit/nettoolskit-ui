# Samples Selector Original Plus Five Plan - 2026-04-11

## Scope Summary
- evolve the `samples/` showcase from a plain family list into a selector-driven catalog
- separate the approved local baseline into an explicit `Original Reference` sample pack
- keep five additional packs as controlled whitelabel variations backed by the same `src/**` templates
- ensure the approved baseline does not inherit external branding or text from any stale runtime state

## Ordered Tasks
1. Completed: mapped the current pack registry and defined the new contract as `1 original + 5 variations`.
2. Completed: refactored pack configuration and sample metadata so the selector presents the original baseline separately from the variations.
3. Completed: added a sample selector menu to the home and showcase experiences with direct navigation between packs.
4. Completed: kept the original baseline branding locked to the approved local reference identity only.
5. Completed: refreshed tests and validations for the new total, selector behavior, and approved baseline constraints.
6. Completed: ran focused type-check, tests, browser smoke, and left a clean checkpoint ready for review.

## Validation Checklist
- `npm run type-check`
- `npm run test -- tests/unit/samples/TemplateShowcaseApprovedReference.spec.ts tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/landing/LandingTokenization.spec.ts`
- browser smoke on `http://127.0.0.1:4173/` and `http://127.0.0.1:4173/?templates=1`

## Closeout Expectations
- the samples runtime should expose a clear selector for `Original Reference` plus five variation packs
- the approved baseline should stay visually faithful to `.temp/reference` without foreign branding text
- pack selection should deep-link cleanly and keep sample interactions functional

## Validation Notes
- `npm run type-check`
- `npm run test -- tests/unit/samples/TemplateShowcaseApprovedReference.spec.ts tests/unit/samples/TemplateVisualFamilies.spec.ts tests/unit/landing/LandingTokenization.spec.ts`
- `npm run build:samples`
- browser smoke on `http://127.0.0.1:4173/` and `http://127.0.0.1:4173/?templates=1`, including selector navigation to `service-command`