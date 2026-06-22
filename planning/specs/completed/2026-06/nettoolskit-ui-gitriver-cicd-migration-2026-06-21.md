# NetToolsKit UI GitRiver CI/CD Migration - Spec

Date: 2026-06-21
LastUpdated: 2026-06-22 08:32
Status: completed
Priority: P0
Source Guidance: `nettoolskit-agent` operations, governance, and security CI/CD instructions

## Design Intent

Move routine pull request quality gates from GitHub Actions to GitRiver while keeping GitHub as the source of truth and Access as the delegated control plane for GitRiver metadata and masked CI variables.

## Current Evidence

Open Dependabot PRs are mergeable, but most are blocked by legacy GitHub Actions checks. The current workflows run broad pull request gates in `.github/workflows/ci-tests.yml` and `.github/workflows/security.yml`, including externally downloaded shared security scripts.

## Decisions

1. GitRiver publishes canonical pull request contexts: `river/prepare`, `river/standard`, `river/security`, `river/build`, and `river/test`.
2. GitRiver workflow metadata lives under `.gitriver/workflows`.
3. Mutable source-owned gate scripts live under `scripts/ci/river`.
4. GitRiver clones `NetToolsKit/nettoolskit-ui` at runtime and validates `GITHUB_SOURCE_SHA` before running gates.
5. Access publishes GitRiver metadata and syncs masked variables such as `GITHUB_SOURCE_TOKEN`, `GHCR_PUBLISH_TOKEN`, and `NPM_TOKEN`.
6. GitHub Actions remain only as manual or scheduled fallback where GitHub-native evidence is still useful.

## Acceptance Criteria

1. Routine PR workflows no longer run broad GitHub Actions gates on every pull request.
2. GitRiver has source-owned scripts for prepare, standard, security, build, and test stages.
3. GitRiver metadata can be dry-run published through `nettoolskit-access`.
4. Local syntax and drift checks pass for changed workflow and script files.
5. The PR audit clearly separates merge conflicts from CI/CD failures.

## Implementation Evidence

### 2026-06-21 - GitRiver Access Registration

- Added `.gitriver/workflows/nettoolskit-ui-quality.yml` with canonical River contexts.
- Added source-owned River shell scripts under `scripts/ci/river`.
- Restricted GitHub Actions PR triggers to manual/scheduled fallback ownership.
- Published GitRiver metadata to `admin/nettoolskit-ui-ci` through Access.
- Synced masked `GITHUB_SOURCE_TOKEN`, `GHCR_PUBLISH_TOKEN`, and `NPM_TOKEN` through Access.
- Reloaded the Access `access-ci` stack so the live webhook bridge uses the current repository route map.
- Verified PR pipeline `019eeb25-8fc8-7221-bd84-6aae4f216868` completed successfully in `admin/nettoolskit-ui-ci`.
- PR #53 merged into `main` on 2026-06-21T18:51:34Z with River `prepare`,
  `standard`, `security`, `build`, and `test` contexts successful.

## Risks

- Branch protection may still require old GitHub Actions contexts until repository rules are updated outside source control.
- Browser gates may need GitRiver runner images with Playwright system dependencies.
- Dependabot major upgrades may still fail product tests after CI migration; those are dependency compatibility failures, not CI/CD ownership failures.

## Recommended Specialist

- Primary: `ops-devops-platform-engineer`
- Support: `test-engineer`, `release-closeout-engineer`

## Closeout

Completed for `v0.0.1-preview.1` release preparation after the GitRiver
migration PR was merged and publication evidence was recorded.