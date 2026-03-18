# Landing Standardization Plan

Date: 2026-03-18
Repository: `nettoolskit-ui-vue`
Status: In Progress

## Scope

Align the new landing page with the shared NetToolsKit landing standards while preserving the current content direction and bringing forward reusable behaviors from the previous landing composition.

In scope:
- compare the new landing (`landing-page/App.vue` + `landing-page/components/**`) against shared landing primitives under `src/components/layout`
- migrate the new landing toward shared header/hero/section patterns
- preserve current copy, assets, i18n, theme toggle and CMS entry links
- remove duplicated layout logic, container rules and author-specific styling where shared components already exist

Out of scope:
- redesigning the whole landing from zero
- replacing every custom section in one pass
- CMS/editor changes unrelated to the public landing

## Findings Baseline

- The current landing is active through [main.ts](C:/Users/tguis/Documents/Trabalho/Pessoal/Desenvolvimento/Projetos/nettoolskit-ui-vue/landing-page/main.ts).
- The new landing currently uses custom section components under `landing-page/components/`.
- Shared landing standards already exist in:
  - [NtkLandingHeader.vue](C:/Users/tguis/Documents/Trabalho/Pessoal/Desenvolvimento/Projetos/nettoolskit-ui-vue/src/components/layout/NtkLandingHeader.vue)
  - [NtkHero.vue](C:/Users/tguis/Documents/Trabalho/Pessoal/Desenvolvimento/Projetos/nettoolskit-ui-vue/src/components/layout/NtkHero.vue)
  - [NtkSection.vue](C:/Users/tguis/Documents/Trabalho/Pessoal/Desenvolvimento/Projetos/nettoolskit-ui-vue/src/components/layout/NtkSection.vue)
  - [NtkLandingComposer.vue](C:/Users/tguis/Documents/Trabalho/Pessoal/Desenvolvimento/Projetos/nettoolskit-ui-vue/src/components/layout/NtkLandingComposer.vue)
- The new landing still duplicates:
  - header shell behavior
  - container spacing rules
  - dark-mode page selectors
  - hero composition logic
  - section framing patterns

## Ordered Tasks

1. Standardize header [Completed]
   - replace the custom `LandingHeaderSection` shell with `NtkLandingHeader`
   - preserve theme toggle, locale toggle and GitHub CTA
   - keep mobile navigation behavior and CMS entry access

2. Standardize hero [Completed]
   - migrate `LandingHeroSection` to `NtkHero`
   - preserve existing copy, highlight treatment, CTA links, stats and hero media

3. Normalize landing structure [In Progress]
   - reduce custom container duplication in `App.vue` and section wrappers
   - keep the new landing content order and section list intact

4. Map remaining standardization debt [In Progress]
   - list which sections still use custom-only layout/style contracts
   - identify the next candidates for migration (`features`, `showcase`, `footer`, etc.)

## Progress Notes

- `2026-03-18`: `LandingHeaderSection.vue` was rebuilt on top of `NtkLandingHeader`, keeping the existing nav labels, theme toggle, locale toggle, GitHub CTA and mobile drawer behavior.
- `2026-03-18`: `LandingHeroSection.vue` was rebuilt on top of `NtkHero`, preserving the current hero copy, highlight, CTAs, stats and media asset while keeping the landing animation hooks intact.
- `2026-03-18`: `LandingFeaturesSection.vue` and `LandingShowcaseSection.vue` were moved to `NtkSection`/`NtkSectionHeader`, removing duplicated outer section/container/header shells while preserving their current content and CSS contracts.
- Remaining standardization debt is now concentrated in `landing-page/App.vue` global CSS and the remaining custom section wrappers after the showcase (`developer`, `dashboard`, `themes`, `installation`, `footer`).

## Validation

- `npm run type-check`
- `npm run lint`
- `npm run build:landing`
- focused E2E or smoke validation when the public landing behavior changes materially

## Specialists

- Recommended specialist: `dev-frontend-vue-quasar-engineer`
- Test gate: mandatory
- Review gate: mandatory
- Release closeout: required after a stable landing checkpoint

## Closeout Expectations

- update `CHANGELOG.md` when a visible landing slice lands
- provide a commit message after each stable slice
- keep follow-up standardization debt explicit in the final summary