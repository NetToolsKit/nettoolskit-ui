# Reference Shell Design Alignment Plan - 2026-04-10

## Scope Summary
- align the `samples/` runtime shell to the approved structural reference in `.temp/reference`
- preserve `src/**` as the reusable implementation source while adapting shell defaults, menu behavior, and surface styling
- use the `awesome-design-md` / VoltAgent direction as the color and visual-language baseline for the whitelabel presets

## Input References
- local structure baseline: `.temp/reference/src/layouts/MainLayoutHorizontal.vue`
- local menu behavior baseline: `.temp/reference/src/components/MenuLink.vue`, `.temp/reference/src/components/HorizontalMenuLink.vue`, `.temp/reference/src/components/UserMenu.vue`
- visual direction: `https://github.com/VoltAgent/awesome-design-md/tree/main/design-md`
- visual summary used for implementation inference: `https://getdesign.md/voltagent/design-md`

## Ordered Tasks
1. Completed: adapt template-layout defaults so the reference shell can boot with the intended lateral/horizontal behavior and mini-menu defaults, including the `90px` mini-with-labels drawer state.
2. In progress: reshape reference whitelabel presets and runtime token mapping to the darker emerald-driven visual language.
3. In progress: restyle the reference shell, topbar, menu links, workspace cards, and catalog surfaces to match the new navigation hierarchy and visual tone.
4. Pending: update focused tests/docs, validate, and commit the design-alignment checkpoint.

## Validation Checklist
- `npm run type-check`
- `npm run test -- tests/unit/utils/whitelabel.spec.ts tests/unit/composables/useReferenceWorkspaceHost.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts tests/unit/landing/LandingTokenization.spec.ts`
- `npm run build:samples`
- `npm run lint`
- `npm audit --omit=dev --audit-level=high`

## Recommended Specialist
- primary: `dev-frontend-vue-quasar-engineer`
- validation support: `test-engineer`

## Closeout Expectations
- keep `samples/` as a host only; reusable UI logic stays under `src/**`
- keep whitelabel presetting as the parameterization layer instead of hardcoding a single demo skin
- preserve legacy landing/CMS compatibility routes while the samples runtime becomes the approved visual baseline
