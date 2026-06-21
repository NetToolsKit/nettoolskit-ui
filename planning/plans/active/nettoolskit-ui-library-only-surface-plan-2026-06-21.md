# NetToolsKit UI Library-Only Surface - Plan

Generated: 2026-06-21 19:14
LastUpdated: 2026-06-21 20:53
Status: active
Progress: 89% (8/9 checked)
Branch: `refactor/library-only-surface`
BackupBranch: `backup/pre-library-only-cleanup-2026-06-21`
Spec: `planning/specs/active/nettoolskit-ui-library-only-surface-2026-06-21.md`

## Progress Checklist

- [x] Backup branch is pushed and recorded.
- [x] Public package surface removes CMS/template/landing/whitelabel exports.
- [x] Product source trees are removed from the library repo.
- [x] Samples, Vite, Vercel and package scripts are library-focused.
- [x] Tests and architecture baselines are pruned to library gates.
- [x] README, docs and changelog describe the library-only scope.
- [x] Package dry run proves removed product declarations are not published.
- [x] Library validation gates pass or blocked gates are documented.
- [ ] Branch is committed, pushed, and PR-ready.

## Scope Summary

Clean `nettoolskit-ui` so it behaves as a shared Vue 3 + Quasar component
library and design system only. Remove CMS/product/application-template runtime
source, docs, tests, sample entries, exports and declaration outputs from this
repository. Preserve the deleted code through the pushed backup branch for
later migration into `NetToolsKit.One`.

## Sub-Slice Matrix

| Slice | Targets | Validation | Commit checkpoint |
|---|---|---|---|
| Backup and branch state | Git refs | `git status -sb`, `git ls-remote --heads origin backup/pre-library-only-cleanup-2026-06-21` | Included in first cleanup commit planning evidence. |
| Public API cleanup | `index.ts`, `package.json`, `tsconfig.json`, `tsup.config.ts` | `npm run type-check`, `npm run build`, `npm pack --dry-run` | `refactor(package): narrow library public surface` |
| Product source removal | `src/modules/cms`, `src/templates`, `src/whitelabel`, `landing-page` | `rg` absence checks, build/typecheck | Same implementation commit unless too large. |
| Samples/runtime cleanup | `samples`, `vite.config.ts`, `vercel.json` | `npm run build:samples` if samples remain | Same implementation commit. |
| Test/governance cleanup | `tests`, `policies`, architecture baseline, package scripts | `npm run lint:css`, `npm run test:architecture`, `npm run test:design-system` | `test(governance): align gates with library scope` if separated. |
| Docs closeout | `README.md`, `CHANGELOG.md`, planning files | `npm run docs:check`, markdown review | `docs(planning): record library-only cleanup` |

## Ordered Tasks

1. Verify clean branch state and pushed backup branch.
2. Remove CMS, template, landing and whitelabel exports from `index.ts`.
3. Delete product source trees and product-specific sample/runtime files.
4. Narrow TypeScript declaration input and package scripts to library-owned
   files.
5. Update Vite/Vercel/sample config or remove product-only entries.
6. Prune tests and governance baselines that only exercise removed product
   surfaces.
7. Update README and changelog with the breaking library-only scope.
8. Run package dry-run and validation gates.
9. Review diff, commit semantically, push branch, and prepare PR.

## Validation Checklist

- `npm run tokens:check`
- `npm run docs:check`
- `npm run lint:css`
- `npm run test:architecture`
- `npm run test:design-system`
- `npm run type-check`
- `npm run build`
- `npm pack --dry-run`
- `git diff --check`

## Risks And Controls

- Risk: deleting code before migration to `NetToolsKit.One`.
  Control: backup branch has already been pushed before cleanup work begins.
- Risk: hidden imports from reusable components into removed product surfaces.
  Control: remove public exports early and let type-check/build expose misses.
- Risk: package docs still advertise CMS after cleanup.
  Control: README and changelog are mandatory closeout artifacts.
- Risk: governance baseline becomes stale.
  Control: regenerate or update baseline after source removal and validate with
  `npm run lint:css`.

## Specialist Routing

- Controller: Super Agent
- Implementation: Frontend Vue/Quasar engineer
- Validation: Test engineer discipline through package gates
- Closeout: Release closeout discipline for README/changelog/PR evidence

## Closeout Expectations

- Commit messages must use semantic Git format, never `[codex]`.
- README update is mandatory because the package contract changes.
- CHANGELOG update is mandatory because this is a breaking surface cleanup.
- Open a PR after validation and push unless blocked by a failing gate.
