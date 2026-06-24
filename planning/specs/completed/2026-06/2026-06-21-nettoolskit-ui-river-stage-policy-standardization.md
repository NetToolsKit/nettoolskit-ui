# NetToolsKit UI River Stage Policy Standardization - Spec

Status: completed
Created: 2026-06-21 17:32 America/Sao_Paulo
LastUpdated: 2026-06-22 08:32 America/Sao_Paulo
Generated: 2026-06-21 17:32
Related Plan: `planning/plans/completed/2026-06/2026-06-21-nettoolskit-ui-river-stage-policy-standardization-plan.md`
Workstream ID: `nettoolskit-ui-river-stage-policy-standardization`
Source Spec: `nettoolskit-agent/planning/specs/completed/2026-06/202606191130-spec-cicd-promotion-workflow-validation.md`
Source Follow-Up: `nettoolskit-agent/planning/plans/completed/2026-06/202606211300-plan-cicd-stage-only-closeout-followup.md`
Related Local Planning: `planning/specs/completed/2026-06/2026-06-21-nettoolskit-ui-gitriver-cicd-migration.md`

## Objective

Align `nettoolskit-ui` with the same River-aware CI/CD stage policy used by
`nettoolskit-agent`: ordinary CI quality gates stay separate from controlled
GitHub-native promotion workflows, and provider-visible River contexts use
stage-only names.

## Normalized Request Summary

Cross-repository CI/CD planning must copy the Agent River stage policy as the
standardization baseline for `nettoolskit-ui`. This planning slice registers the
policy overlay only. It does not add new `.gitriver` metadata, source-owned
River scripts, branch-protection changes, or live CI execution beyond any
separate local migration workstream already present in this repository.

## Scope

In scope:

- register the Agent-derived CI/CD River stage policy as active planning;
- define the split between ordinary CI gates and GitHub-native promotion
  workflows;
- standardize public River status contexts as `river/{stage}`;
- map the canonical stage order for UI implementation planning;
- keep GitHub as the source of truth and River as executor only when configured.

Out of scope for this planning-only slice:

- adding or changing `.gitriver/workflows/**`;
- adding or changing `scripts/ci/river/**`;
- changing `.github/workflows/**`;
- publishing River metadata or syncing variables;
- changing branch protection, secrets, packages, releases, deployments, or tags.

## Design Summary

The Agent source spec remains the canonical model. `nettoolskit-ui` CI/CD work
should classify ordinary PR quality workflows separately from controlled
promotion workflows. Ordinary PR gates should follow the core order
`prepare -> standard -> security -> build -> test`; optional mutation or
publication stages should remain explicit and ordered as
`package -> release -> deploy -> verify`.

When River is configured, public provider contexts must be stage-only names such
as `river/prepare`, `river/standard`, `river/security`, `river/build`,
`river/test`, `river/package`, `river/release`, `river/deploy`, and
`river/verify`. Repository/domain-prefixed contexts such as
`river/nettoolskit-ui-standard` are not valid public status contexts.

GitHub-native promotion workflows may remain in GitHub Actions when they are
restricted to protected production deployment, release publication, GitHub or
npm package permissions, tags, manual dispatch, or equivalent promotion
surfaces and still preserve approval, rollback, release evidence, least
privilege, pinned actions, and secret hygiene.

## Design Slice Matrix

| Design slice | Behavior or artifact boundary | Standardization impact | Security impact | Performance impact | Acceptance signal |
| --- | --- | --- | --- | --- | --- |
| DS1 Stage taxonomy | River and GitHub status naming | Reuses Agent stage-only public context rule | Avoids ambiguous status spoofing or hidden gates | Cheap status mapping | Planning names only `river/{stage}` contexts |
| DS2 Ordinary CI boundary | UI PR quality gates | Keeps prepare, standard, security, build, and test ordered | Keeps security gate before build/test closeout | Avoids full mutation pipelines for ordinary PRs | Future or related workflow inventory maps checks to core stages |
| DS3 Promotion boundary | npm publish, release, deploy, and verification workflows | Keeps promotion separate from ordinary CI | Preserves approvals, rollback, pinned actions, and secret hygiene | Avoids duplicate expensive gates when River exists | Future validation accepts only controlled promotion workflows |
| DS4 Source checkout contract | River source execution | Requires exact source SHA validation when River is used | Avoids branch-name drift and mutable checkout trust | Prevents wasted reruns from stale branch checkout | Future or related River scripts validate `GITHUB_SOURCE_SHA` |
| DS5 Closeout | Planning, README, changelog, and PR evidence | Keeps CI/CD planning traceable | Avoids local paths, tokens, and raw logs in docs | Documentation-only until implementation | Plan evidence and review complete before archive |

## Key Decisions

- [2026-06-21 17:32] Use the Agent CI/CD promotion workflow spec as the source
  policy for cross-repository River stage standardization.
- [2026-06-21 17:32] Keep this slice planning-only and avoid changing existing
  UI CI/CD contracts.
- [2026-06-21 17:32] Reserve public River status contexts for stage-only
  `river/{stage}` names.
- [2026-06-21 17:32] Treat future GitHub-native deployment, release, and package
  publication workflows as promotion surfaces, not ordinary CI, only when
  approval and evidence controls are present.

## Assumptions And Constraints

- GitHub remains the source of truth for repository code and PR status.
- Existing local UI GitRiver migration planning may contain implementation
  evidence, but this policy overlay does not claim or modify that evidence.
- Existing GitHub Actions workflows must not be removed just to satisfy
  planning.
- Future implementation must account for Vue/Vite package gates, npm audit,
  documentation checks, token checks, browser/playwright constraints, and
  package publication boundaries.

## Alternatives Considered

| Alternative | Decision | Reason |
| --- | --- | --- |
| Implement or rewrite UI River metadata in this branch | Rejected for this slice | The request is planning-only and a separate local migration workstream already exists. |
| Copy Agent implementation scripts verbatim | Rejected | `nettoolskit-ui` has frontend package, browser, token, and documentation gates. |
| Keep repository-prefixed River contexts | Rejected | Agent follow-up standardized public contexts to stage-only `river/{stage}` names. |
| Treat every GitHub workflow as ordinary CI | Rejected | Promotion workflows need different safety and evidence controls. |

## Risks

- Existing UI CI/CD migration planning and this policy overlay can drift if
  future closeout does not reconcile them.
- Stage-only public contexts can conflict with old branch-protection rules if
  required checks are not migrated deliberately.
- Promotion classification can become too permissive if approval and rollback
  evidence are weakened.
- Planning can drift unless the future implementation plan updates evidence
  before archive.

## Acceptance Criteria

- This spec and its paired active plan exist in the repository planning
  workspace.
- The spec references the Agent source spec and stage-only follow-up as the
  standardization baseline.
- The scope explicitly states that no River contracts, workflows, scripts,
  secrets, branch protection, or runtime CI changes are added in this slice.
- Future implementation work has a stage taxonomy and validation boundary to
  follow.
- `git diff --check` passes for the planning-only changes.

## Planning Readiness

Ready. The paired active plan owns reconciliation with existing UI CI/CD
planning, future validation, review, and closeout.

## Recommended Specialist Focus

- `ops-devops-platform-engineer` owns CI/CD stage and promotion boundaries.
- `dev-frontend-vue-quasar-engineer` owns frontend package and UI validation implications.
- `test-engineer` owns future gate validation coverage.
- `docs-release-engineer` owns planning, README, changelog, and PR evidence.

## Pillar Impact

- Standardization: `nettoolskit-ui` receives the same Agent-derived River stage
  policy baseline.
- Security: no secrets, tokens, branch-protection mutation, or live CI metadata
  are changed in this planning-only slice.
- Performance: future ordinary PR gates can stay bounded and avoid promotion,
  browser-heavy, or package/deploy work unless the changed surface requires it.

## Closeout

Completed for `v0.0.1-preview.1` release preparation after the policy overlay
was reconciled with the implemented GitRiver migration. Public contexts are
stage-only `river/{stage}` names, River metadata validates `GITHUB_SOURCE_SHA`,
GitHub Actions remain fallback/manual/scheduled where applicable, and PR #55 was
merged into `main` on 2026-06-21T21:39:23Z with River contexts successful.