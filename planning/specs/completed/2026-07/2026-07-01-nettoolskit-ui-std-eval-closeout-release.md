# NetToolsKit UI STD-Eval Closeout + 0.0.1-preview.2 Release Prep - Spec

Generated: 2026-07-01 America/Sao_Paulo
LastUpdated: 2026-07-01 America/Sao_Paulo
Status: completed (completes at merge of its own PR; filed directly under completed/)
Priority: medium-high
Workstream ID: `nettoolskit-ui-std-eval-closeout-release`
Phase: release-closeout

## Objective

Close the six-milestone NTK-FE-STD workstream after the operator merged PRs
#117-#122, and prepare the `0.0.1-preview.2` release so the published package
reflects the merged surface (the MIGRATION guide already references
`0.0.1-preview.2`).

## Scope

- Planning state: the six milestone specs move `active` →
  `completed/2026-07/`; the milestone plan moves to
  `plans/completed/2026-07/`; the fulfilled `v0.0.1-preview.1` release plan
  (published to npm) moves to `plans/completed/2026-06/`.
- Version: `0.0.1-preview.1` → `0.0.1-preview.2` (package.json +
  package-lock). `0.0.1-preview.1` is live on npm, so the accumulated
  `Unreleased` section becomes the `[0.0.1-preview.2] - 2026-07-01` CHANGELOG
  section, extended with the six milestone entries (L2 slots, invoker
  commands, optional-peer subpaths + size gate, ADR-0006, docs
  auto-discovery + e2e in verify) and the optional-peers breaking note.
- Branch hygiene: the six merged semantic branches deleted (remote + local).
- Out of band (no PR possible): amendment applied to the external
  `F:\Desenvolvimento\.docs\ui\NTK-FE-STD-002.md` (not a git repository)
  aligning SS9/SS10 with ADR-0006; stale automated CI issue #115 closed
  (its ref `feat/extract-timing-core` merged in #113; all subsequent River
  runs green through #122).

## Verification

- `docs:check`, `tokens:check`, `layers:check` green (planning/text/version
  changes only).
- Release tag/publish happens via the GitRiver `release` stage on `main`/`v*`
  after the operator merges this PR (dist-tag `preview`, idempotent).

## Acceptance

- `planning/specs/active/` holds only the pre-existing non-milestone specs;
  `planning/plans/active/` holds only the river-9-stage plan.
- Version and CHANGELOG agree on `0.0.1-preview.2`; `Unreleased` is empty.
- No stale semantic branches on origin.