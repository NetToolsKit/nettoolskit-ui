# Landing Standardization Plan

Date: 2026-03-18
Repository: `nettoolskit-ui-vue`
Status: Completed

## Scope

Consolidate the repository onto a single canonical public landing under `landing-page`, using the visual/content direction from the previous `landing-page-new` implementation while preserving the existing `?cms=1` entry path for the CMS shell.

In scope:
- make `landing-page` the only supported public landing entry
- merge the `landing-page-new` source into the canonical `landing-page` root
- preserve the current `?cms=1` split so CMS mode continues to load from `landing-page/main.ts`
- remove duplicated build/dev configs and obsolete legacy landing files
- document what standardization debt still exists after the consolidation

Out of scope:
- redesigning the new landing from zero
- fully rewriting the new landing on top of shared section primitives in the same slice
- CMS/editor changes unrelated to the public landing

## Findings Baseline

- `landing-page/main.ts` is already the canonical split entry for public landing vs `?cms=1`.
- `landing-page-new/` exists as a fully separate public landing implementation with its own `App.vue`, `index.html`, `main.ts` and dedicated Vite config.
- `package.json` currently exposes duplicated public landing commands (`build:landing-new`, `dev:landing-new`) even though only one public landing should exist.
- Legacy public landing files still remain under `landing-page/`:
  - `App.vue`
  - `App-Dev.vue`
  - `main-original.ts`
  - `index-original.html`
- After consolidation, the new landing will still have standardization debt because it is largely custom and not yet rebuilt on top of the shared landing primitives under `src/components/layout`.

## Ordered Tasks

1. Consolidate public entrypoint [Completed]
   - keep `landing-page/main.ts` as the single public/CMS split entry
   - route the public path to the new landing implementation only

2. Remove duplicated landing runtime paths [Completed]
   - remove standalone `landing-page-new` build/dev config usage
   - delete obsolete legacy landing files from `landing-page`

3. Canonicalize assets and source tree [Completed]
   - merge the new landing app, components, styles, composables and assets into `landing-page`
   - keep CMS files under `landing-page` untouched

4. Rebaseline tests and docs [Completed]
   - remove unit-test references to `App-Dev.vue`
   - document remaining standardization debt after consolidation

## Progress Notes

- `2026-03-18`: the workstream pivoted from standardizing the old public landing to consolidating the separate `landing-page-new` implementation as the only supported public landing.
- `2026-03-18`: `landing-page/App.vue` now hosts the former `landing-page-new/App.vue` composition, with its assets/components/composables/styles merged into the canonical `landing-page` root.
- `2026-03-18`: `landing-page/main.ts` kept the existing `?cms=1` split and now loads the public landing through `LandingPublicApp.ts`, which scopes the landing CSS to the public bundle instead of CMS mode.
- `2026-03-18`: duplicated dev/build paths for `landing-page-new` were removed from `package.json`, and `vite.landing-new.config.ts` plus the separate `landing-page-new/` source tree were removed from the repository.
- Remaining standardization debt is now on the canonical landing itself: the merged `landing-page/App.vue`, `landing-page/components/LandingNew*.vue` and `landing-page/styles/landing.css` remain largely custom and are not yet aligned with the shared `NtkSection`/`NtkLandingHeader`/`NtkHero` primitives.

## Validation

- `npm run type-check`
- `npm run lint`
- `npm run build:landing`
- `npm run test -- tests/unit/landing/LandingTokenization.spec.ts`

## Specialists

- Recommended specialist: `dev-frontend-vue-quasar-engineer`
- Test gate: mandatory
- Review gate: mandatory
- Release closeout: required after a stable landing checkpoint

## Closeout Expectations

- update `CHANGELOG.md` when a visible landing slice lands
- provide a commit message after each stable slice
- keep follow-up standardization debt explicit in the final summary