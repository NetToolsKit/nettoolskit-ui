# NetToolsKit UI v0.0.1-preview.1 Release - Plan

Generated: 2026-06-22 08:25 America/Sao_Paulo
LastUpdated: 2026-06-22 08:41 America/Sao_Paulo
Status: active
Progress: 86% (6/7 checked)
Branch: `release/v0.0.1-preview.1`
Source Traceability: not required

## Progress Checklist

- [x] Release branch is based on `origin/main` and includes required post-merge planning/docs commits.
- [x] Completed planning workstreams with merged PR evidence are moved to completed.
- [x] Package manifest and lockfile use `0.0.1-preview.1`.
- [x] Changelog has a dated `0.0.1-preview.1` section.
- [x] Local release gates pass.
- [x] Package dry-run proves the preview tarball shape.
- [ ] Release commit is pushed and PR-ready.

## Scope Summary

Prepare the first testable preview package for `nettoolskit-ui` as
`v0.0.1-preview.1`. This work does not publish to npm because this machine is
not authenticated with the npm registry. It prepares the repository, package
metadata, changelog, planning closeout, validation evidence and PR branch needed
for the preview release.

## Sub-Slice Matrix

| Slice | Targets | Validation | Commit checkpoint |
|---|---|---|---|
| Branch and carried commits | Git refs, `AGENTS.md`, planning taxonomy | `git log origin/main..HEAD` | Included in release branch history |
| Planning closeout | `planning/plans/**`, `planning/specs/**` | PR merge evidence from GitHub and River contexts | `docs(planning): close merged preview workstreams` if separated |
| Version metadata | `package.json`, `package-lock.json` | `npm pack --dry-run --json` reports `0.0.1-preview.1` | `chore(release): prepare v0.0.1-preview.1` |
| Release notes | `CHANGELOG.md` | Manual changelog review | Same checkpoint |
| Gates | package scripts and npm audit | `npm run verify`, `npm audit --omit=dev --audit-level=high`, `git diff --check` | Same checkpoint |
| PR readiness | Git branch and GitHub PR | pushed branch, PR URL | Same checkpoint |

## Ordered Tasks

1. Confirm release branch starts from `origin/main`.
2. Carry post-merge planning taxonomy and `AGENTS.md` guidance commits into the
   release branch.
3. Close out active planning files that already have merged PR evidence.
4. Update package version metadata to `0.0.1-preview.1`.
5. Promote the changelog `Unreleased` content into a dated preview section.
6. Run local release gates and package dry-run.
7. Commit, push, open or update the release PR, and record release status.

## Validation Checklist

- `npm run verify`
- `npm audit --omit=dev --audit-level=high`
- `npm pack --dry-run --json`
- `git diff --check`
- `git status --short --branch`

## Validation Evidence

- Passed: `npm run verify`
- Passed: `npm audit --omit=dev --audit-level=high`
- Passed: `npm pack --dry-run --json`
  - package: `nettoolskit`
  - version: `0.0.1-preview.1`
  - filename: `nettoolskit-0.0.1-preview.1.tgz`
  - entries: 286
  - size: 783995 bytes
  - unpacked size: 5313370 bytes
- Passed: `git diff --check`
- Passed: `git diff --cached --check`
- Passed: Git Bash syntax check for River shell scripts:
  `scripts/ci/river/run-source-gate.sh`,
  `scripts/ci/river/changed-surface.sh`, and
  `scripts/ci/river/frontend-stage.sh`.

## Closeout Expectations

- Do not create or push the `v0.0.1-preview.1` tag until the release PR is
  merged into `main`.
- Do not run `npm publish` until npm authentication and the target registry/tag
  are confirmed.
- Commit message suggestion: `chore(release): prepare v0.0.1-preview.1`.