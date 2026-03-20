# Planning

Planning artifacts for this repository live under `planning/`.

## Structure

- `active/`
  - active execution plans and current roadmaps
- `completed/`
  - closed plans kept only for historical reference
- `reference/`
  - supporting planning material such as baselines, parameter tables and decision support documents

## Rules

- New active plans must be created in `planning/active/`.
- Closed plans must be moved to `planning/completed/`.
- Support material that is not itself an execution plan must live in `planning/reference/`.
- `.temp/` remains reserved for disposable debug artifacts only, not for active planning.
- Generated build, coverage, Playwright and other test artifacts must prefer `.build/` whenever the toolchain allows an explicit output path.
- Generated deployment bundles, scripts and operational output must prefer `.deployment/` whenever the hosting/deploy tool does not require a root-level file.
- Explicit exceptions stay at repository root when toolchains require them, such as `node_modules/`, lockfiles and provider manifests like `vercel.json`.