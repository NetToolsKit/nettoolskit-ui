# Spec: River 9-Stage Surface Completion

Status: Active
Generated: 2026-06-29 21:58 -03:00
LastUpdated: 2026-06-29 21:58 -03:00

## Intake Summary

`nettoolskit-ui` must expose the canonical River provider-visible stage surface
on `main`: `river/prepare`, `river/standard`, `river/security`, `river/build`,
`river/test`, `river/package`, `river/release`, `river/deploy`, and
`river/verify`.

The current workflow already includes prepare, standard, security, build, test,
and release. This work adds package, deploy, and verify while preserving the
existing release publication path.

## Design Decisions

- `.gitriver/workflows/nettoolskit-ui-quality.yml` remains the provider metadata
  surface and must publish only the nine canonical contexts.
- `river/package` is a safe local package validation stage: it builds the
  library and runs `npm pack --dry-run` without publishing.
- `river/release` keeps the existing npm/GitHub Packages publication wrapper.
- `river/deploy` and `river/verify` are reserved explicit stages until approved
  deployment automation exists.
- No `.ntk/ci/river.toml` is created in this repo because no manifest currently
  exists to update.

## Alternatives Considered

- Move publication into `river/package`: rejected because package validation and
  release publication must remain separate provider-visible stages.
- Add a new manifest only for this task: rejected because the instruction only
  requires `stage_commands` where a manifest already exists.
- Implement deploy now: rejected because no approved deployment target or
  verification contract exists in this repo.

## Acceptance Criteria

- Static context audit reports exactly the nine canonical contexts and no extra
  provider-visible contexts.
- Package is validation-only and does not publish.
- Deploy and verify are explicit reserved stages and do not deploy.
- `git diff --check` passes for the intended River/planning change set.
- The branch is committed, pushed, and opened as a PR against `main`.

## Design Slice Matrix

| Slice | Target Paths | Standardization | Security | Performance | Validation Evidence |
| --- | --- | --- | --- | --- | --- |
| River metadata | `.gitriver/workflows/nettoolskit-ui-quality.yml` | Adds package/deploy/verify contexts only | No secrets added | Keeps npm work bounded to stage purpose | Static context audit |
| Package stage | `.gitriver/workflows/nettoolskit-ui-quality.yml` | Separates package validation from release | No registry write | Reuses build output flow | Diff review |
| Planning | `planning/specs/active/**`, `planning/plans/active/**` | Records lifecycle and closeout | No local paths or tokens | No runtime impact | Planning checklist |

## Planning Readiness

Ready for active execution planning.