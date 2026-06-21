# NetToolsKit UI Library-Only Surface - Spec

Generated: 2026-06-21 19:14
LastUpdated: 2026-06-21 20:55
Status: ready-for-review
Priority: high
Branch: `refactor/library-only-surface`
BackupBranch: `backup/pre-library-only-cleanup-2026-06-21`
PullRequest: https://github.com/NetToolsKit/nettoolskit-ui/pull/56

## Intake Summary

The repository must stop carrying product-owned CMS, landing, and application
template runtime code. `nettoolskit-ui` should remain the shared Vue 3 +
Quasar UI library and design-system package. Product surfaces move to
`NetToolsKit.One`; this workstream removes them from the public package and
repository-owned library gates after the backup branch has been pushed.

## Design Intent

Keep `nettoolskit-ui` focused on reusable library contracts:

- design tokens, generated token artifacts, resolver, density and theme helpers;
- design-system core recipes and `Ds*` Vue wrappers;
- reusable `Ntk*` components, composables, services, utilities, styles and
  package governance;
- library samples only when they exercise reusable components, not product CMS
  or application runtime flows.

Remove or stop publishing product/application surfaces:

- CMS engine, CMS authoring UI, CMS blocks, CMS release orchestration;
- landing-page runtime and product marketing assets;
- template runtime, scaffolded router/runtime pages, app shells, reference
  systems and feature demos that behave like a product;
- CMS-specific docs, tests, Playwright gates, package exports and declaration
  outputs.

## Key Decisions

1. Preserve the full current state through the pushed backup branch before any
   destructive cleanup.
2. Treat `NetToolsKit.One` as the future product owner, but do not require that
   repository to exist locally before this repository can be cleaned.
3. Remove public exports for CMS/templates/landing/whitelabel surfaces before
   deleting files so build failures expose missed dependencies.
4. Keep generated docs for the design-system package, not for product features.
5. Keep CI/GitRiver scripts unless they directly reference removed gates.

## Alternatives Considered

| Alternative | Decision | Reason |
|---|---|---|
| Keep CMS as a subpackage | Rejected | The user explicitly wants product surfaces outside this repo. |
| Hide CMS with package `files` only | Rejected | Declarations and bundle still leak product contracts. |
| Move files directly into NetToolsKit.One now | Deferred | Requires confirming destination repository structure and ownership boundaries. Backup branch preserves source for migration. |
| Remove only docs/tests and leave source | Rejected | Public API would still publish product contracts. |

## Design Slice Matrix

| Slice | Target paths | Standardization impact | Security impact | Performance impact |
|---|---|---|---|---|
| Package public surface | `index.ts`, `package.json`, `tsconfig.json`, `tsup.config.ts` | Enforces library-only exports. | Reduces product/provider API exposure. | Shrinks bundle/declaration output. |
| Source cleanup | `src/modules/cms`, `src/templates`, `src/whitelabel`, landing configs | Removes product code from library tree. | Removes local-storage/provider/product workflow code from lib package. | Removes heavy CMS/template code. |
| Samples and Vite cleanup | `samples`, `landing-page`, `vite.config.ts`, `vercel.json` | Keeps samples library-focused. | Removes internal CMS dev entry. | Removes large CMS sample chunks. |
| Tests and docs cleanup | `tests`, `docs`, `README.md`, `CHANGELOG.md` | Aligns docs and gates to library scope. | Removes product integration docs from lib. | Removes slow product/browser gates from default verify. |
| Governance cleanup | `policies`, architecture baselines, planning | Updates baselines after removal. | Keeps future product code from re-entering silently. | Keeps gates narrower and faster. |

## Acceptance Criteria

- Backup branch is pushed and named in closeout.
- `index.ts` no longer exports CMS, template runtime, landing runtime, or
  reference whitelabel product surfaces.
- `npm pack --dry-run` no longer includes `landing-page`, `samples`,
  `src/modules/cms`, `src/templates`, or `src/whitelabel` declarations.
- `npm run tokens:check`, `npm run docs:check`, `npm run lint:css`,
  `npm run test:design-system`, `npm run test:architecture`,
  `npm run type-check`, and `npm run build` pass or any skipped gate is
  explicitly documented.
- README and package scripts describe the library-only contract.
- Changelog records the breaking package surface cleanup.

## Planning Readiness

Ready for execution planning.

## Recommended Specialist Focus

- Super Agent controller
- Frontend Vue/Quasar engineer
- Test engineer for package gates
- Release closeout engineer for README/changelog/PR summary
