# NetToolsKit Frontend Standard Sequence - Spec

Date: 2026-06-19
Status: completed - archived
Priority: P0
Sequence: 00
Source Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`
Package Naming: `nettoolskit`
CLI Naming: `ntk`

## Design Intent

Replace the older active planning queue with a concrete, staged specification set that implements the frontend standard exactly as the source standard describes, while preserving useful repository-specific surfaces that the standard does not cover.

This sequence spec owns ordering and dependency context. Each linked stage spec owns one implementation boundary.

## Current Reset

Older active plans were moved to `planning/archive/2026-06-19-active-reset/`.

The active workstream now starts from these specs:

| Priority | Sequence | Spec | Purpose |
|---|---:|---|---|
| P0 | 01 | `nettoolskit-package-surface-and-sources-2026-06-19.md` | Naming, source lock, package surface, repo-owned commands, and documentation ownership |
| P0 | 02 | `nettoolskit-design-tokens-dtcg-2026-06-19.md` | DTCG token files, resolver, generated CSS/TS, compatibility bridge |
| P0 | 03 | `nettoolskit-theme-density-quasar-adapter-2026-06-19.md` | Theme, density, dark mode, multi-tenant validation, Quasar adapter |
| P1 | 04 | `nettoolskit-component-contracts-and-recipes-2026-06-19.md` | Typed visual contracts, recipes, `Ds*` components, `Ntk*` compatibility |
| P1 | 05 | `nettoolskit-css-governance-and-enforcement-2026-06-19.md` | CSS layers, `:deep()` policy, `!important` policy, ESLint and Stylelint |
| P1 | 06 | `nettoolskit-template-migration-and-cleanup-2026-06-19.md` | CMS/templates migration away from direct Quasar and residual bridge overrides |
| P2 | 07 | `nettoolskit-quality-gates-and-documentation-2026-06-19.md` | Tests, a11y, visual evidence, generated docs, CI gates |

## Required Ordering

1. Establish package, source, and command ownership.
2. Build tokens and resolver before changing components.
3. Build theme and Quasar adapter before migrating templates.
4. Build component contracts and recipes before broad feature migration.
5. Add enforcement before declaring any migration stable.
6. Migrate templates and clean overrides in thin slices.
7. Finish with quality gates and generated docs.

## Design Slice Matrix

| Slice | Depends On | Blocks | Validation Evidence |
|---|---|---|---|
| Source and naming | none | all later slices | README/spec checks and package/export audit |
| Tokens and resolver | source and naming | theme, components, CSS enforcement | token schema validation, generated files, invariant tests |
| Theme and adapter | tokens | components and migration | DOM adapter tests, Quasar variable tests, dark/density tests |
| Components and recipes | tokens, theme | template migration | unit tests for recipes and components |
| CSS enforcement | tokens, components | cleanup closeout | ESLint, Stylelint, architecture tests |
| Template migration | components, CSS enforcement | visual/a11y gate closeout | targeted unit tests, Playwright visual tests |
| Quality and docs | all prior slices | release readiness | full verify command, generated docs diff check |

## Acceptance Criteria

1. Active specs list all implementation stages in priority order.
2. Older active planning is no longer in `planning/active`.
3. A single active plan links these specs and tracks execution progress.
4. Every stage has target paths, risks, acceptance criteria, and validation evidence.
5. Package naming uses `nettoolskit`.
6. Repository-owned CLI command naming may use `ntk`.
7. The active planning surface contains no older unrelated queue.

## Planning Readiness

Ready for execution planning.

## Recommended Specialist

- Primary: `dev-frontend-vue-quasar-engineer`
- Support: `test-engineer`, `docs-release-engineer`, `ops-devops-platform-engineer`
