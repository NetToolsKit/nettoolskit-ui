# Reference Catalog Main Runtime Plan - 2026-04-10

## Scope Summary
- replace the marketing landing as the default `/` runtime with a samples-first catalog focused on reusable systems and screens
- keep whitelabel as the parameterization architecture that drives the same templates/components through different presets
- preserve the legacy landing behind an explicit query mode until the catalog is validated and the old runtime can be removed safely

## Ordered Tasks
1. Completed: create a reusable reference-catalog layer under `src/templates/features/reference-system/**` with shared sample data, host state, catalog sections, and live preview rendering for the approved screen surfaces.
2. Completed: add a thin `landing-page` host for the new catalog and switch `landing-page/main.ts` so `/` resolves to the catalog while `?landing=1` preserves the legacy marketing runtime.
3. Completed: update tests, README/runtime docs, and plan evidence so the repo describes a samples-first entrypoint instead of a landing-first entrypoint.
4. Completed: run validation, record evidence, and prepare the stable commit checkpoint for this catalog-first runtime slice.

## Validation Checklist
- `npm run lint`
- `npm run type-check`
- `npm run test -- tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts`
- `npm run build:landing`

## Recommended Specialist
- primary: `dev-frontend-vue-quasar-engineer`
- validation support: `test-engineer`
- release closeout: required before deleting the legacy landing runtime

## Closeout Expectations
- keep the reusable catalog contracts in `src/**`; `landing-page/**` should stay a thin host shell only
- document the new default runtime and the explicit legacy landing query mode
- finish the slice with a real commit and validation evidence

## Validation Evidence
- `2026-04-10`: `npm install` completed successfully so local frontend validation tooling is now available in this checkout.
- `2026-04-10`: `npm run type-check` passed.
- `2026-04-10`: `npm run test -- tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts` passed with 2 files / 16 tests.
- `2026-04-10`: `npm run build:landing` passed and produced the new `ReferenceCatalogApp` entry chunk.
- `2026-04-10`: `npm run lint` passed with pre-existing Vue formatting warnings only and no errors.
- `2026-04-10`: `npm audit --omit=dev --audit-level=high` passed with `0 vulnerabilities`.
- `2026-04-10`: `npm audit` still reports dev-time advisories in `brace-expansion`, `flatted`, `immutable`, `lodash`, `picomatch`, and `vite`; remediation was kept out of this runtime-entry slice.

## Implementation Outcome
- the default `/` runtime is now the reference catalog instead of the marketing landing.
- the new catalog host lives in `landing-page/ReferenceCatalogApp.vue`, but the reusable catalog/template logic now lives under `src/templates/features/reference-system/**`.
- the legacy marketing landing remains reachable through `/?landing=1` while the migration finishes.
- `landing-page/reference-samples.data.ts` was removed and its sample payloads now live in shared `src/**` contracts.
- the report workspace now says `Back to catalog` instead of routing users back to the old landing language.

## Execution Slices
### Slice 1
- Target paths:
  - `src/templates/features/reference-system/**`
  - `src/whitelabel/types.ts`
- Checkpoint:
  - catalog data, host state, catalog template, and live preview surface exist in reusable `src/**` modules
- Commit checkpoint:
  - `feat(reference): add reusable catalog runtime for sample systems`

### Slice 2
- Target paths:
  - `landing-page/main.ts`
  - `landing-page/ReferenceCatalogApp.vue`
  - `landing-page/index.html`
  - `landing-page/ReferenceSamplesApp.vue`
- Checkpoint:
  - `/` opens the new catalog; `?landing=1` keeps the legacy landing reachable; reference workspace returns to the catalog
- Commit checkpoint:
  - `refactor(runtime): make reference catalog the default landing app`

### Slice 3
- Target paths:
  - `tests/unit/landing/LandingTokenization.spec.ts`
  - `tests/unit/templates/ReferenceSystemTemplates.spec.ts`
  - `README.md`
  - `planning/completed/reference-catalog-main-runtime-plan-2026-04-10.md`
- Checkpoint:
  - tests and docs describe the samples-first runtime without implying the marketing landing is canonical
- Commit checkpoint:
  - `docs(reference): document samples-first runtime entrypoint`
