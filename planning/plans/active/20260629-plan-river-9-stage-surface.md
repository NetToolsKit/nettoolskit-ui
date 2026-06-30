# Plan: River 9-Stage Surface Completion

Status: Active
Generated: 2026-06-29 21:58 -03:00
LastUpdated: 2026-06-29 22:04 -03:00
Spec: `planning/specs/active/20260629-spec-river-9-stage-surface.md`
Progress: 89% (8/9 checked)

## Progress Checklist

- [x] Register active River 9-stage spec.
- [x] Register active River 9-stage execution plan.
- [x] Update GitRiver workflow to expose exactly nine canonical stage contexts.
- [x] Add validation-only `river/package`.
- [x] Keep deploy and verify reserved and non-deploying.
- [x] Run `git diff --check` for the intended change set.
- [x] Run static context audit.
- [x] Review the diff for context drift, secret leakage, and unintended manifest creation.
- [ ] Commit, push, open PR, and record PR/CI evidence.

## Scope Summary

Complete the `nettoolskit-ui` River stage surface without changing library code
or package versioning. The implementation is limited to River metadata and
planning artifacts.

## Sub-Slice Matrix

| Slice | Target Paths | Risk Check | Validation Command | Commit Checkpoint |
| --- | --- | --- | --- | --- |
| Metadata | `.gitriver/workflows/nettoolskit-ui-quality.yml` | Context list must be canonical and unique by visible name | Static context audit | Include with planning update |
| Package stage | `.gitriver/workflows/nettoolskit-ui-quality.yml` | Must not publish to a registry | Diff review | Include with metadata update |
| Planning | `planning/specs/active/**`, `planning/plans/active/**` | No local paths, tokens, or unverifiable claims | Markdown diff review | Same commit |

## Ordered Tasks

1. Add `package`, `deploy`, and `verify` GitRiver jobs.
2. Chain release after package and keep deploy/verify reserved.
3. Run `git diff --check` and static context audit.
4. Review and stage only River/planning files.
5. Commit with `ci: complete canonical river stage surface`, push, and open a PR.

## Validation Checklist

- [x] `git diff --check`
- [x] Static context audit for `.gitriver/workflows/nettoolskit-ui-quality.yml`
- [x] TOML check recorded as not applicable because no `.ntk/ci/river.toml`
  manifest exists.

## Validation Evidence

- [2026-06-29 22:04 -03:00] `git diff --check` passed.
- [2026-06-29 22:04 -03:00] Static context audit found exactly:
  `river/prepare`, `river/standard`, `river/security`, `river/build`,
  `river/test`, `river/package`, `river/release`, `river/deploy`,
  `river/verify`.
- [2026-06-29 22:04 -03:00] Review found no secret values, no extra
  provider-visible River context, and no new `.ntk/ci/river.toml` manifest.

## Closeout Expectations

No README or CHANGELOG update is required unless the implementation changes the
documented user-facing command surface. The PR body must mention that deploy and
verify remain reserved.