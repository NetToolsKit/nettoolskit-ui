# NetToolsKit UI River Stage Policy Standardization - Plan

Generated: 2026-06-21 17:32
LastUpdated: 2026-06-21 17:36
Status: active
Owner: nettoolskit-ui
Branch: `docs/nettoolskit-ui-river-stage-policy-spec-20260621`
Spec Path: `planning/specs/active/nettoolskit-ui-river-stage-policy-standardization-2026-06-21.md`
Workstream ID: `nettoolskit-ui-river-stage-policy-standardization`
Related Local Plan: `planning/plans/active/nettoolskit-ui-gitriver-cicd-migration-plan-2026-06-21.md`
Progress: 22% (2/9 checked)

## Progress Checklist

- [x] Register the Agent-derived CI/CD River stage policy spec.
- [x] Register the active execution plan for future rollout or reconciliation.
- [ ] Reconcile this policy overlay with the existing UI GitRiver CI/CD migration plan.
- [ ] Inventory existing GitHub Actions, package, release, browser, and frontend validation surfaces.
- [ ] Map existing and required checks to canonical stages: prepare, standard, security, build, test, package, release, deploy, and verify.
- [ ] Confirm every public River context is stage-only `river/{stage}` where River is configured.
- [ ] Validate exact source SHA checkout behavior where River execution exists.
- [ ] Run repository-specific validation and status visibility audit.
- [ ] Complete review, README/changelog decision, PR evidence, and archive closeout.

## Scope Summary

This workstream registers a planning-only policy overlay. It copies the
`nettoolskit-agent` River stage policy baseline for `nettoolskit-ui` without
adding or modifying runtime CI/CD contracts in this branch. Existing UI GitRiver
migration planning remains separate and must be reconciled during future
closeout.

## Sub-Slice Matrix

| Slice | Target paths | Standardization checks | Security checks | Performance checks | Validation evidence |
| --- | --- | --- | --- | --- | --- |
| P1 Planning registration | `planning/**` | Source spec and follow-up are referenced | No local paths, secrets, tokens, or raw logs | Documentation-only | `git diff --check` |
| P2 Planning reconciliation | Existing UI GitRiver migration spec and plan | Avoid duplicate or contradictory River rules | Do not expose Access or variable details beyond approved docs | Avoid repeated validation claims | Updated plan evidence |
| P3 Workflow inventory | `.github/workflows/**`, `.gitriver/workflows/**`, `scripts/ci/river/**`, package manifests | Every existing gate maps to a canonical stage | Identify secret and permission surfaces | Identify browser-heavy and package-heavy triggers | Inventory table in this plan |
| P4 Stage-only verification | River status publication and status docs | Public contexts use only `river/{stage}` | Validate `GITHUB_SOURCE_SHA`; keep variables masked | Bounded, skip-aware ordinary PR gates | Syntax checks and status audit |
| P5 Closeout | `README.md`, `CHANGELOG.md`, planning files, PR text | Evidence stays bundled with implementation | No sensitive release details in docs | Planning archive only after validation | Review and PR merge evidence |

## Ordered Tasks

1. Keep this planning branch limited to `planning/**`.
   - Target paths: `planning/specs/active/**`, `planning/plans/active/**`.
   - Checkpoint: `git diff --check` passes.
   - Commit checkpoint: `docs(planning): register river stage policy baseline`.

2. Reconcile this policy overlay with existing UI GitRiver migration planning.
   - Target paths:
     `planning/specs/active/nettoolskit-ui-gitriver-cicd-migration-2026-06-21.md`,
     `planning/plans/active/nettoolskit-ui-gitriver-cicd-migration-plan-2026-06-21.md`.
   - Checkpoint: no contradictory context naming or validation claims remain.

3. In a future implementation or reconciliation branch, inventory current CI/CD
   and release surfaces before changing workflows.
   - Target paths: `.github/workflows/**`, `.gitriver/workflows/**`,
     `scripts/ci/river/**`, `package.json`, `package-lock.json`,
     `vite.config.ts`, `playwright.config.ts`.
   - Checkpoint: current checks are mapped to canonical stages and promotion
     surfaces are explicitly separated.

4. Validate future or existing River contract evidence.
   - Candidate commands: `npm run lint`, `npm run type-check`, package build,
     npm audit, browser/playwright gates when runner dependencies exist,
     workflow syntax checks, shell syntax checks, and `git diff --check`.
   - Checkpoint: skipped status evidence is visible for docs/planning-only
     changes and blocking failures stay actionable.

5. Close out only after implementation evidence exists or reconciliation is
   complete.
   - Target paths: README, CHANGELOG, active plan/spec.
   - Checkpoint: plan is not moved to completed until implementation or
     reconciliation evidence, validation, review, and PR evidence are complete.

## Validation Checklist

- [x] Planning-only branch validates with `git diff --check`.
- [ ] Existing UI GitRiver migration planning is reconciled with this stage policy overlay.
- [ ] Public River contexts are stage-only `river/{stage}` names where River is configured.
- [ ] River source checkout validates exact source SHA before gates run where River is configured.
- [ ] Ordinary PR gates stay bounded and skip-aware.
- [ ] Promotion workflows keep approval, rollback, pinned actions, least privilege, and secret hygiene.

## Validation Evidence

- 2026-06-21 17:36: `git diff --check` passed for the planning-only changes.

## Risks And Mitigations

- Risk: this policy overlay duplicates the existing UI migration plan.
  Mitigation: future closeout must reconcile both active planning files before
  archiving either workstream.
- Risk: required checks can become invisible during status-context migration.
  Mitigation: publish pending or skipped evidence for every expected context
  before work starts in future implementation or reconciliation.
- Risk: promotion workflows can bypass ordinary CI. Mitigation: accept
  promotion classification only for protected release/deploy/package surfaces
  with evidence controls.

## Closeout Expectations

- README update: deferred until implementation or reconciliation changes
  developer workflow or CI/CD commands.
- CHANGELOG update: deferred until implementation or reconciliation is
  release-relevant; this planning-only registration does not change runtime
  behavior.
- Commit message suggestion: `docs(planning): register river stage policy baseline`.