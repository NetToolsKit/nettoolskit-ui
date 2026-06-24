# Samples Runtime Folder Plan - 2026-04-10

## Scope Summary
- move the active showcase/runtime entrypoint out of `landing-page/` and into a dedicated `samples/` folder
- keep `samples/` as the canonical consumer of `src/**` template and component libraries
- preserve the legacy landing and CMS runtimes as explicit compatibility modes while the cleanup continues

## Ordered Tasks
1. Completed: move the active sample hosts (`main`, `index`, catalog app, report workspace app, template showcase app) into `samples/`.
2. Completed: update Vite root/input/public handling and package scripts so the project boots from `samples/` while preserving compatibility aliases.
3. Completed: align tests and docs to the new `samples/` runtime folder without changing the reusable `src/**` contracts.
4. Completed: run validation, record evidence, and commit the structural migration checkpoint.

## Validation Checklist
- `npm run type-check`
- `npm run test -- tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts`
- `npm run build:samples`
- `npm run lint`

## Recommended Specialist
- primary: `dev-frontend-vue-quasar-engineer`
- validation support: `test-engineer`

## Closeout Expectations
- `samples/` owns the runtime host only; reusable visual logic must remain under `src/**`
- keep compatibility commands where helpful, but make the naming reflect the new `samples` runtime
- preserve legacy `landing-page/` assets/components only for the remaining compatibility mode

## Progress Notes
- `2026-04-10`: moved the active runtime entry files from `landing-page/` into `samples/` and relocated public host assets to `samples/public`.
- `2026-04-10`: promoted `samples/` to the canonical Vite root/build output while keeping `build:landing` and `dev:landing` as compatibility aliases.
- `2026-04-10`: aligned tokenization coverage, Playwright preview config, Vercel build config, and README guidance around the new `samples/` host.
- `2026-04-10`: `npm run type-check` passed.
- `2026-04-10`: `npm run test -- tests/unit/landing/LandingTokenization.spec.ts tests/unit/templates/ReferenceSystemTemplates.spec.ts` passed.
- `2026-04-10`: `npm run lint` passed with existing repository warnings only; no new `samples/` errors were introduced.
- `2026-04-10`: `npm run build:samples` passed and emitted the canonical host into `.build/samples`.
- `2026-04-10`: `npm audit --omit=dev --audit-level=high` passed with `0` runtime vulnerabilities.