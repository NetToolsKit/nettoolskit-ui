# NetToolsKit Quality Gates And Documentation - Spec

Date: 2026-06-19
Status: active
Priority: P2
Sequence: 07
Source Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`

## Design Intent

Make the frontend standard enforceable through scripts, tests, accessibility checks, visual evidence, generated docs, and CI gates.

## Current Evidence

Current package scripts include build, type-check, lint, Vitest, coverage, and Playwright. Missing gates include token validation/build scripts, Stylelint, architecture tests for direct Quasar usage, and automated a11y checks.

## Decisions

1. `verify` must run token validation, token build, docs generation/check, type-check, lint, Stylelint, unit tests, architecture tests, a11y tests, visual tests, and build.
2. Accessibility checks must include automated tooling and targeted keyboard/focus assertions.
3. Visual regression must cover light, dark, density, and critical CMS/template surfaces.
4. Generated docs must include `DESIGN.md`, `COMPONENTS.md`, `TOKENS.md`, and agent-facing implementation rules.
5. CI must fail on new unmanaged direct Quasar usage, unmanaged raw colors, unmanaged `:deep()`, unmanaged `!important`, and generated doc drift.

## Target Paths

- `package.json`
- `.github/workflows/**`
- future `scripts/validate-tokens.mjs`
- future `scripts/build-tokens.mjs`
- future `scripts/generate-design-docs.mjs`
- future `tests/architecture/**`
- future `tests/a11y/**`
- existing `tests/e2e/**`
- future `COMPONENTS.md`
- future `TOKENS.md`
- existing `DESIGN.md`

## Design Slice Matrix

| Slice | Target | Validation |
|---|---|---|
| Scripts | `package.json`, scripts | `npm run verify` dry run after prerequisites |
| Architecture tests | direct Quasar and policy checks | Vitest architecture suite |
| A11y tests | axe and keyboard/focus checks | automated a11y gate |
| Visual tests | Playwright screenshots and assertions | multi-theme visual gate |
| Docs generation | docs generated from source artifacts | generated diff check |
| CI | workflow gates | GitHub Actions or equivalent local validation |

## Acceptance Criteria

1. `npm run verify` exists and covers all required gates.
2. Token validation and build scripts run before TypeScript and visual tests.
3. A11y checks are automated.
4. Generated docs are checked for drift.
5. CI fails on policy violations and build/test failures.
6. Final Definition of Done is documented and used by execution plans.

## Risks

- Full verification may be slow; targeted commands can remain available but cannot replace the full gate.
- A11y tooling can produce false positives; exceptions need documented ownership.
- Generated docs can create noisy diffs if source ordering is unstable.

## Planning Readiness

Ready for planning after enforcement, migration, and docs source artifacts exist.

## Recommended Specialist

- Primary: `test-engineer`
- Support: `ops-devops-platform-engineer`, `docs-release-engineer`