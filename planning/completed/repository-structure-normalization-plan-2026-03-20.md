# Repository Structure Normalization Plan

Date: 2026-03-20
Repository: `nettoolskit-ui-vue`
Status: Completed

## Scope

Normalize repository planning and generated-artifact structure.

In scope:
- move planning material out of `.temp/` into `planning/active`, `planning/completed` or `planning/reference`
- classify active vs completed plans based on current completion state
- clean disposable `.temp/` artifacts that no longer belong to planning
- route generated test/build artifacts into `.build/` where toolchain supports it
- document explicit exceptions when toolchains require root locations

Out of scope:
- relocating tool-managed dependency folders that would break standard package resolution
- moving provider-specific deployment manifests that must remain at repository root

## Ordered Tasks

1. Classify planning artifacts [Completed]
   - confirm active, completed and reference planning material
   - identify useful `.temp/` files vs disposable debug artifacts

2. Consolidate planning folders [Completed]
   - move closed plans to `planning/completed`
   - move reference docs out of `.temp/`

3. Normalize generated artifact outputs [Completed]
   - keep library and landing build outputs in `.build/`
   - route Playwright artifacts into `.build/`

4. Clean `.temp/` down to zero planning debt [Completed]
   - remove debug screenshots, logs, temp specs and obsolete prototypes

## Decisions

- `planning/active/cms-engine-enterprise-plan-2026-03-13.md` remains active because items `111` and `112` are still pending.
- `planning/active/landing-standardization-plan-2026-03-18.md` is completed and must move to `planning/completed/`.
- `layout-cms.md` and the white-label hardcoded audit are support material, not active plans; they belong in `planning/reference/`.
- `node_modules/` remains at repository root because npm/Vite/TypeScript resolution expects the standard location; it is not safe to relocate as a repository hygiene change.
- Root deployment manifests such as `vercel.json` remain at root because their hosting providers expect that location.

## Validation

- verify planning folder contents after moves
- verify `.temp/` no longer contains planning material or stale debug artifacts
- verify Playwright config writes into `.build/`
- run `npm run type-check`
- run `npm run build:landing`

## Specialists

- Recommended specialist: `dev-frontend-vue-quasar-engineer`
- Test gate: mandatory for config/runtime changes
- Review gate: mandatory
- Release closeout: required