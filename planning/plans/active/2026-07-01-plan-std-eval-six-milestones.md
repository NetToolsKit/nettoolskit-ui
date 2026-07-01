# NTK-FE-STD Evaluation — Six-Milestone Execution Plan

Generated: 2026-07-01 America/Sao_Paulo
LastUpdated: 2026-07-01 America/Sao_Paulo
Status: active
Workstream ID: `nettoolskit-ui-std-eval-milestones`

## Objective

Execute the six milestones raised by the NTK-FE-STD-001/002 deep evaluation as
independent, individually-mergeable PRs (base `main`, merged by the operator,
not by the agent). One milestone plan links six specs because each spec owns a
separate design boundary.

## Specs (one per milestone)

| # | Spec | Branch / PR |
|---|---|---|
| WS1 | `planning/specs/active/2026-07-01-nettoolskit-ui-component-extension-model.md` | `docs/spec-component-extension-model` → PR #117 |
| WS2 | `planning/specs/active/2026-07-01-nettoolskit-ui-dsdialog-invoker-commands.md` | `feat/dsdialog-invoker-commands` |
| WS3 | `planning/specs/active/2026-07-01-nettoolskit-ui-public-api-legacy-cut.md` | `refactor/public-api-legacy-cut` |
| WS4 | `planning/specs/active/2026-07-01-nettoolskit-ui-optional-peers-bundle-budget.md` | `feat/optional-peers-size-gate` |
| WS5 | `planning/specs/active/2026-07-01-nettoolskit-ui-adr-native-primitives.md` | `docs/adr-native-primitives` |
| WS6 | `planning/specs/active/2026-07-01-nettoolskit-ui-docs-coverage-e2e-verify.md` | `feat/docs-coverage-e2e-verify` |

## Execution order and isolation

Sequential, one branch at a time from `origin/main` (WS1 rides the already-open
PR #117 branch). File surfaces are kept disjoint across PRs so the operator can
merge all at once; the only shared file is `package.json` (WS4:
`peerDependenciesMeta` + `size:check` script; WS6: `verify` script) in
non-overlapping regions.

## Validation per PR

- `npm run tokens:check && npm run layers:check && npm run docs:check`
- `npm run lint -- --quiet && npm run lint:css`
- `npm run type-check`
- Targeted unit suites (`npm run test:design-system` or per-file) — the full
  worker-pool run is flaky on this mount; CI (River) runs the full matrix
  including e2e/axe.

## Closeout (after operator merges)

1. Move the six specs from `planning/specs/active/` to
   `planning/specs/completed/2026-07/`.
2. Move this plan to `planning/plans/completed/2026-07/`.
3. Delete the six merged semantic branches.
4. Tag/release per CHANGELOG policy if a release is cut.

## Progress Checklist

Progress: tracked per spec (each spec carries its own checklist)

- [x] WS1 implemented + validated (PR #117)
- [ ] WS2 implemented + validated
- [ ] WS3 implemented + validated
- [ ] WS4 implemented + validated
- [ ] WS5 implemented + validated
- [ ] WS6 implemented + validated