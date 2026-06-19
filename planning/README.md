# Planning

Planning artifacts for this repository live under `planning/`.

## Standard Compliance

This README follows:
- [docs/standards/readme-frontend-super-agent-standard.md](../docs/standards/readme-frontend-super-agent-standard.md)

Minimum contract covered:
- scope
- structure
- rules
- validation expectations

## Structure

- `specs/active/`
  - active design specifications for work that changes architecture, workflow, UX, testing, or governance
- `specs/completed/`
  - closed specifications kept for historical reference
- `plans/active/`
  - active execution plans that consume one or more active specs
- `plans/completed/`
  - closed execution plans kept for historical reference
- `archive/`
  - inactive planning material moved out of active execution without claiming completion
- `completed/`
  - legacy closed plans kept only for historical reference
- `reference/`
  - supporting planning material such as baselines, parameter tables and decision support documents

## Rules

- New design work must start in `planning/specs/active/`.
- New active execution plans must be created in `planning/plans/active/`.
- Closed specs must be moved to `planning/specs/completed/`.
- Closed plans must be moved to `planning/plans/completed/`.
- Legacy active planning that is no longer the current workstream must move to `planning/archive/<date>-<slug>/`.
- Support material that is not itself an execution plan must live in `planning/reference/`.
- `.temp/` remains reserved for disposable debug artifacts only, not for active planning.
- Generated build, coverage, Playwright and other test artifacts must prefer `.build/` whenever the toolchain allows an explicit output path.
- Generated deployment bundles, scripts and operational output must prefer `.deployment/` whenever the hosting/deploy tool does not require a root-level file.
- Explicit exceptions stay at repository root when toolchains require them, such as `node_modules/`, lockfiles and provider manifests like `vercel.json`.
- Package naming for this workstream must use `nettoolskit`.
- Terminal command naming for repository-owned CLI flows may use `ntk`.

## Validation Baseline

When planning changes include frontend impact, validate with:
- `npm run lint`
- `npm run type-check`