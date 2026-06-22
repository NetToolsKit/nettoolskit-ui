# NetToolsKit UI GitRiver CI/CD Migration - Plan

Date: 2026-06-21
LastUpdated: 2026-06-22 08:32
Status: completed
Branch: `ci/gitriver-access-cicd`
Progress: 100% (7/7 checked)

## Progress Checklist

- [x] Add GitRiver workflow metadata for the canonical stages.
- [x] Add source-owned River shell scripts for clone-safe frontend gates and changed-surface handling.
- [x] Restrict GitHub Actions to manual/scheduled fallback instead of routine PR gates.
- [x] Add an Access wrapper for publishing GitRiver metadata for `nettoolskit-ui`.
- [x] Validate locally, dry-run Access publication, and publish through Access.
- [x] Commit, push, and open/update the GitHub PR for this migration.
- [x] Move the active spec and plan to completed after the migration PR is merged and closeout is confirmed.

## PR Audit

All currently open PRs are mergeable. The blocking state is CI/CD instability from legacy GitHub Actions checks, not merge conflicts.

| PR | Merge state | Primary blocker |
|---|---|---|
| #51 | UNSTABLE | `CI Tests/Lint + Type-check + Unit`, `Security Analysis/Vulnerability Audit` |
| #50 | CLEAN | None |
| #49 | UNSTABLE | `CI Tests/Lint + Type-check + Unit`, `Security Analysis/Vulnerability Audit` |
| #48 | UNSTABLE | Previously pending GitHub Actions check; latest check query passed |
| #47 | UNSTABLE | Pending `Visual Regression (Playwright)` at audit time |
| #46 | UNSTABLE | `CI Tests/Lint + Type-check + Unit`, `Security Analysis/Vulnerability Audit` |
| #45 | UNSTABLE | `CI Tests/Lint + Type-check + Unit` |
| #44 | CLEAN | None |
| #43 | UNSTABLE | `CI Tests/Lint + Type-check + Unit` |
| #42 | UNSTABLE | `CI Tests/Lint + Type-check + Unit`, `Security Analysis/Vulnerability Audit` |
| #41 | CLEAN | None |
| #40 | UNSTABLE | `CI Tests/Lint + Type-check + Unit` |

## Execution Slices

1. Add GitRiver workflow metadata for the canonical stages.
2. Add source-owned River shell scripts for clone-safe frontend gates and changed-surface handling.
3. Restrict GitHub Actions to manual/scheduled fallback instead of routine PR gates.
4. Add an Access wrapper for publishing GitRiver metadata for `nettoolskit-ui`.
5. Validate locally, dry-run Access publication, then publish if the dry run succeeds.
6. Commit, push, and open/update the GitHub PR for this migration.

## Validation

- Passed: `bash -n scripts/ci/river/run-source-gate.sh scripts/ci/river/changed-surface.sh scripts/ci/river/frontend-stage.sh`
- Passed: PowerShell parser check for `scripts/integrations/gitriver/publish-ui-ci-metadata.ps1`
- Passed: `pwsh -NoLogo -NoProfile -File scripts/integrations/gitriver/publish-ui-ci-metadata.ps1 -AccessRepositoryRoot C:\Users\tguis\Documents\Trabalho\Pessoal\Desenvolvimento\Projetos\nettoolskit-access -DryRun`
- Published: `admin/nettoolskit-ui-ci` updated in GitRiver through Access to match the Access webhook route `NetToolsKit/nettoolskit-ui=admin/nettoolskit-ui-ci|UI CI Stages`; `GITHUB_SOURCE_TOKEN`, `GHCR_PUBLISH_TOKEN`, and `NPM_TOKEN` synced as masked variables.
- Published: Access `access-ci` Portainer stack reloaded so the live webhook bridge accepted `NetToolsKit/nettoolskit-ui`.
- Passed: GitRiver PR pipeline `019eeb25-8fc8-7221-bd84-6aae4f216868` on `admin/nettoolskit-ui-ci` completed with `prepare`, `standard`, `security`, `build`, and `test` all successful.
- Passed: `npm run tokens:check`
- Passed: `npm run docs:check`
- Passed: `npm audit --omit=dev --audit-level=high`
- Passed: `git diff --check`
- Merged: PR #53 merged into `main` on 2026-06-21T18:51:34Z with River `prepare`, `standard`, `security`, `build`, and `test` contexts successful.
- Not used as a gate: local `changed-surface` functional loop timed out in Windows Git Bash while `git fetch` waited on SSH; GitRiver uses HTTPS with `GITHUB_SOURCE_TOKEN` through Access.

## Closeout

- Closed for `v0.0.1-preview.1` release preparation after merged PR and GitRiver publication evidence were verified.