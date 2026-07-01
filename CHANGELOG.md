# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed

- **BREAKING: legacy theme/config compatibility surface removed.**
  - Deleted `NtkThemePlugin`/`useNtkTheme` (`config/theme/theme.plugin.ts`) and the dead `src/plugins` barrel; the runtime theme model is preset-driven (`useThemeSwitcher` palettes + `useColorScheme` + CSS custom properties).
  - `theme-mode.config` is no longer exported from the package entry (stays internal to the presets).
  - Removed `DESIGN_TOKENS`/`CSS_VARS` from `@nettoolskit/ui/styles` — token values live only in the token sources; `getCssVar()`/`setCssVar()` remain. Guarded by a no-hex test on the styles entry.
  - See `MIGRATION.md` ("Removed legacy theme/config surface").
- **BREAKING: legacy `Ntk*`/`Base*` component surface removed.**
  - Deleted the entire `src/components` tree (54 `Ntk*`/`Base*`/marketing/landing components plus `app-shell.{types,config,theme}`) and the `useNtkField`/`useBaseField` field composables.
  - `index.ts` now exports only the governed design system (`Ds*` components, tokens, recipes, schema, `createNetToolsKitUI`), the kept composables/services/utils/config, and the Quasar notification adapter.
  - Notification capability is preserved via `useNotification` + `NotificationService` + `QuasarNotificationAdapter`; only the `NtkNotificationCenter` UI wrapper was removed.
  - See `MIGRATION.md` for the full `Ntk*`/`Base*` → `Ds*` mapping and `scripts/codemod/ntk-to-ds.mjs` for an automated import/usage rewrite of the 1:1 cases.

### Added

- **Schema-driven front creation system & app shell** (capability-parity with the removed surface):
  - `createNetToolsKitUI` one-line install plugin; `defineForm`/`defineResource` pure schema; `DsForm`, `DsFormPage`, `DsCrudPage` screen composites.
  - `DsTable` server mode (sortable headers, server pagination, loading) wired through `DsCrudPage`.
  - `DsChip`, `DsSteps`, `DsLogo`, and the app shell family (`DsAppShell`/`DsHeader`/`DsSidebar`/`DsFooter`/`DsDrawer`); `DsSelect` multiple selection.
- **MIGRATION.md** and an `Ntk*`→`Ds*` codemod (`scripts/codemod/ntk-to-ds.mjs`).
- **L0–L3 architecture guide** (`docs/architecture/layers.md`) with a decision guide, worked example, and the pure-vs-framework (`core`/styles/`vue`) split.
- **Dual-registry publishing via the GitRiver `release` stage** on `main`/`v*` refs with dist-tag `preview` (idempotent; credentials injected into the runner): `scripts/ci/river/npm-publish.sh` → public **npmjs.org** (primary), `scripts/ci/river/package-publish.sh` → **GitHub Packages** (org mirror).

### Changed

- **BREAKING: package renamed `nettoolskit` → `@nettoolskit/ui`** to follow the `@nettoolskit/*` org scope convention. Update installs (`npm install @nettoolskit/ui`), imports (`from '@nettoolskit/ui'`) and style subpaths (`@nettoolskit/ui/styles/*`). The unscoped `nettoolskit` preview is deprecated on npm with a pointer to the new name.
- **CSS governance is now zero-tolerance.** The baseline scans `src/design-system/vue/components` with all metrics at 0 (directQuasarTags / quasarClassSelectors / unmanagedDeepSelectors / importantDeclarations / rawHexColors), and an ESLint rule blocks reintroducing legacy `Ntk*`/`Base*` or `src/components` imports.

## [0.0.1-preview.1] - 2026-06-22

### Removed

- **Library-only package surface cleanup**
  - Removed CMS engine, CMS authoring, landing runtime, product template runtime, reference whitelabel, Playwright product fixtures, and related product documentation from the `nettoolskit` package surface.
  - Removed public exports for `src/modules/cms`, `src/templates`, `src/whitelabel`, and landing-page configuration so this repository stays focused on reusable UI library contracts.
  - Replaced product/browser gates with library-focused validation gates for tokens, generated docs, CSS governance, design-system tests, architecture tests, type-check, and package build.

### Changed

- **Unified npm major dependency upgrade**
  - Updated the frontend dependency set for TypeScript 6, vue-tsc 3, Vite 8, Vue Router 5, ESLint 10, eslint-plugin-vue 10, vue-eslint-parser 10, jsdom 29, cross-env 10, and Highcharts 13 in one compatible lockfile.
  - Added ESLint runtime globals for browser, Node, and modern ECMAScript APIs required by the existing Vue/Quasar source tree.
  - Stabilized TypeScript 6 and vue-tsc 3 declaration checks for style imports and legacy `Base*` component aliases.
  - Updated the jsdom 29 pointer-event unit test path to dispatch DOM events with coordinates through the event constructor.

### Added

- **NtkInput design-system compatibility aliases**
  - Added `variant`, `size`, `intent`, `disabled`, `invalid`, and `required` compatibility props to the Quasar-backed `NtkInput`.
  - Added field recipe classes for recognized contract values while preserving `QInput` behavior and explicit legacy `outlined`, `filled`, `dense`, and `disable` precedence.
- **NtkSelect design-system compatibility aliases**
  - Added `variant`, `size`, `intent`, `disabled`, `invalid`, and `required` compatibility props to the Quasar-backed `NtkSelect`.
  - Added field recipe classes for recognized contract values while preserving `QSelect`, multiple/chips behavior, select-all actions, and explicit legacy `outlined`, `filled`, `dense`, and `disable` precedence.
- **NtkDataTable design-system compatibility classes**
  - Added `variant`, `size`, and `intent` compatibility props to the Quasar-backed `NtkDataTable`.
  - Added table recipe classes for recognized contract values while preserving the legacy `.ntk-data-table` selector, Quasar table behavior, row actions, status cells, slots, and selection events.
- **NtkButton design-system compatibility aliases**
  - Added `variant`, `intent`, and `disabled` compatibility handling to the Quasar-backed `NtkButton` without narrowing existing open string props.
  - Added recipe classes for recognized button contract values while preserving legacy `disable`, `flat`, `outline`, `unelevated`, `size`, `padding`, and tokenized `color` behavior.
- **Rendered design-system page and section wrappers**
  - Added `NtkPageContract`, `NtkSectionContract`, page/section recipe classes, and rendered `DsPage`/`DsSection` landmark wrappers.
  - Added focused render tests for headings, accessible names, slots, heading levels, and recipe classes.
- **Rendered design-system table wrapper**
  - Added `NtkTableContract`, table recipe classes, and `DsTable` as a rendered Vue wrapper for native table markup.
  - Added focused render tests for headers, rows, selected keys, row clicks, empty state, custom cells, and recipe classes.
- **Rendered design-system select wrapper**
  - Added `DsSelect` as a rendered Vue wrapper backed by the field contract and recipe classes.
  - Added focused render tests for options, placeholder, model updates, invalid, disabled, readonly, and required states.
- **Rendered design-system card and input wrappers**
  - Added `DsCard` and `DsInput` as rendered Vue wrappers backed by the card and field contracts and recipe classes.
  - Added focused render tests for card titles, slots, selectable/clickable states, input labels, messages, model updates, invalid, disabled, and readonly states.
- **Rendered design-system button wrapper**
  - Added `DsButton` as the first rendered `Ds*` Vue wrapper backed by the button contract and recipe classes.
  - Exported `DsButton` through the design-system Vue surface and added focused render tests for labels, icons, recipe classes, disabled, and loading states.
  - Updated generated component documentation to list Vue wrapper sources.
- **Theme density and token validation contracts**
  - Added density assignment helpers for compact, comfortable, and spacious contexts using generated design-token CSS variable names.
  - Tightened tenant theme validation so token maps reject unknown CSS variable names that are not present in the generated token resolver.
  - Extended Quasar adapter tests to verify assignments sourced from generated token values.
- **Token resolver and CSS governance policy**
  - Added committed token resolver outputs at `src/design-system/tokens/resolver.json` and `src/design-system/tokens/generated/tokens.*` while preserving the existing `nettoolskit/design-system/tokens.css` compatibility export.
  - Added a traceable CSS governance policy with owner/removal metadata for current baseline exceptions and made the architecture test use the same governance CLI path as `lint:css`.
  - Expanded GitHub Actions CI to run token drift, generated-doc drift, Stylelint, CSS governance, architecture governance, a11y, and full Windows visual gates.
- **Browser style and visual quality gates**
  - Added Stylelint coverage through `lint:style` and a focused Playwright axe gate for the template-runtime login surface.
  - Expanded `verify` to include Stylelint plus browser gates for a11y, template-runtime visual baselines, and CMS visual regression baselines.
  - Added the internal CMS preview as a Vite build input, stabilized CMS visual selectors, exposed the `Save content model` action in the settings surface, and regenerated the affected Windows visual baselines.
- **Design system quality gates and generated docs**
  - Added generated `DESIGN.md`, `TOKENS.md`, and `COMPONENTS.md` references built from the token source and component recipe contracts.
  - Added `docs:build`, `docs:check`, `lint:css`, and `test:design-system` scripts, plus importable documentation and CSS governance CLIs.
  - Expanded `verify` to include token drift, generated documentation drift, CSS governance, design-system unit coverage, architecture checks, type-check, lint, and build.
- **Design system foundation**
  - Added a DTCG-style token source and token builder under `src/design-system/tokens`, generating committed CSS custom properties and typed token maps with `--ntk-*` naming.
  - Added theme runtime validation for theme ids, tenant ids, density, and controlled CSS variables, plus a Quasar adapter that emits validated CSS variable patches.
  - Added button, field, and card component contracts/class recipes with public `nettoolskit` exports, focused unit coverage, and a `verify` script for the foundation gates.
- **NetToolsKit package surface alignment**
  - Renamed the package surface to `nettoolskit`, updated install/import examples, and added a source lock for the frontend standard workstream.
  - Added a `nettoolskit/styles` export with explicit SCSS/CSS style subpaths and package path validation through `npm pack --dry-run`.
  - Added a baseline architecture test that prevents new unmanaged Quasar tags/selectors, `:deep()`, `!important`, and raw hex color usage in governed frontend paths.
- **Template-first release closeout with visual regression showcase**
  - Added a dedicated template showcase runtime mode at `/?templates=1`, wired through `landing-page/main.ts`, to render reusable template surfaces with deterministic fixture data for release validation.
  - Added `landing-page/TemplateShowcaseApp.vue` covering layout, auth/login, dashboard workspace, CRUD list, profile/placeholder, enterprise command/approval/audit, and wiki/chat template surfaces in one enterprise-oriented preview.
  - Added `tests/e2e/template-visual-regression.spec.ts` with Windows-maintained visual baselines for catalog, layout/dashboard, CRUD+enterprise, and wiki/chat surfaces.
  - Generated and committed the new snapshot set under `tests/e2e/template-visual-regression.spec.ts-snapshots/` to enforce template visual stability in CI and local regression flows.
- **Landing-page-new consolidated as the only public landing**
  - Merged the `landing-page-new` public experience into the canonical `landing-page` source tree while keeping `landing-page/main.ts` as the single split entry for public landing vs `?cms=1` CMS mode.
  - Added `landing-page/LandingPublicApp.ts` so the public landing keeps its dedicated CSS bundle without leaking landing-only styles into CMS mode.
  - Removed duplicated landing runtime paths from `package.json` by dropping `build:landing-new` and `dev:landing-new` in favor of the canonical `build:landing` and `dev:landing` commands.
  - Rebased `landing-page/index.html` onto the consolidated landing metadata/fonts and reworked the landing tokenization test to assert canonical entry, script cleanup and legacy artifact removal instead of inspecting deleted `App-Dev.vue` sources.
- **Landing header and hero standardized on shared landing primitives**
  - Rebuilt `landing-page/components/LandingHeaderSection.vue` on top of `NtkLandingHeader`, preserving the existing navigation labels, GitHub CTA, theme toggle, locale toggle and mobile drawer flow while removing the previous standalone header shell.
  - Rebuilt `landing-page/components/LandingHeroSection.vue` on top of `NtkHero`, preserving the current copy, highlight treatment, CTA links, stats and hero media while keeping the landing animation hooks intact.
  - Rebuilt `landing-page/components/LandingFeaturesSection.vue` and `landing-page/components/LandingShowcaseSection.vue` on top of `NtkSection` and `NtkSectionHeader`, removing duplicated outer section/container/header shells while preserving the current content order and interactive tabs.
  - Rebuilt `landing-page/components/LandingDeveloperSection.vue` and `landing-page/components/LandingDashboardSection.vue` on top of `NtkSection` and `NtkSectionHeader`, removing duplicated section/container wrappers while preserving the existing code example, media blocks, metrics and chart content.
  - Simplified `landing-page/App.vue` by removing the old custom mobile-drawer state/handlers and retargeting the landing reveal blueprints to the shared hero markup.
  - Revalidated `npm run type-check`, `npm run lint` and `npm run build:landing` after the landing standardization slice.
- **CMS authoring workspace layout cleanup aligned with `layout-cms.md`**
  - Removed the remaining centered-workspace constraints from the CMS authoring shell by overriding the app-shell workspace max-width and card wrapper so the editor now uses the full available workspace width.
  - Reshaped the workspace tabs, editor shell and workbench proportions to follow the `topbar -> ruler -> editor body -> statusbar` structure described in the local layout specification.
  - Moved tenant import/export back to the `Settings` editor topbar and reduced duplicate recovery/actions from the right rail so the three editing bars keep distinct responsibilities.
  - Revalidated `type-check`, `lint`, `build:landing` and focused CMS Playwright coverage for the rebuilt designer shell and internal preview-tab flow.
- **Accessibility and content QA gates for release review**
  - Added an engine-level content QA helper that evaluates release snapshots for editorial quality and accessibility gaps, including missing/weak page descriptions, empty authored pages and image assets without usable alt text.
  - Integrated the new QA diagnostics into release snapshot validation and the release candidate checklist through a dedicated `Accessibility and content QA` row, keeping schema/reference integrity separate from editorial/a11y review.
  - Extended checklist drill-down routing so QA issues can open `Pages` or `Media` directly from the `Releases` module.
  - Added focused unit coverage for the QA helper, checklist integration and drill-down routing, plus focused Playwright coverage proving QA findings surface in the release checklist and navigate back to authoring.
  - Revalidated `type-check`, `lint`, `build:landing`, focused CMS unit suites, focused release checklist E2E coverage and `npm audit --omit=dev`.
- **Provider sync, conflict and version contracts for backend-oriented CMS persistence**
  - Added revision-aware provider document contracts for the `content`, `assets` and `releases` domains, including version metadata, optimistic save requests and typed conflict payloads.
  - Added engine helpers to load, hydrate and save revisioned provider documents across all CMS domains without changing the aggregate authoring settings contract.
  - Added storage-backed async sync providers that persist revision metadata separately from the tenant snapshot and reject stale writes through optimistic concurrency checks.
  - Added transport-to-provider sync adapters for backend hydration examples so future API integrations can expose revision-safe save flows without coupling the CMS engine to a specific backend client.
  - Added focused unit coverage for sync-document loading, optimistic conflict handling, sync hydration and transport adapter mapping, then revalidated `type-check`, `lint`, `build:landing`, focused provider tests and `npm audit --omit=dev`.
- **Schema migration runner and upgrade report for authored content models**
  - Added a new engine-level schema migration helper that builds dry-run upgrade reports for pages against the latest authored content-model schema, including field-level adds, updates and removals across page fields and localized overrides.
  - Replaced the previous blind schema sync flow in `Pages` with a reviewable upgrade surface showing migration status, version delta, migration notes and the top field changes before applying the upgrade, now blocking invalid content-model ids instead of silently migrating them against the fallback model.
  - Expanded authored content-model schema-version hashing so nested field contracts, default values, media-kind constraints and reference-kind constraints all trigger deterministic schema bumps before migration review.
  - Added focused unit coverage for invalid, upgrade-required, localized upgrade and ahead-of-model scenarios plus Playwright coverage proving the report renders before sync and disappears after the upgrade is applied.
  - Revalidated `type-check`, `lint`, `build:landing`, focused unit tests and focused CMS E2E coverage for the migration runner flow.
- **Replacement assistant for deprecated reusable CMS entities**
  - Added an engine-level replacement assistant that previews and applies configured replacements across linked page sections, linked page blocks, reusable-section blocks, reusable blocks and authored block preset derivations.
  - Surfaced `Apply replacement` actions with impact summaries in the `Pages` reusable section library plus the `Blocks` reusable block and authored preset libraries, reusing the existing deprecation metadata instead of introducing a separate workflow.
  - Added focused unit coverage for replacement-assistant reference rewrites and Playwright coverage proving deprecated reusable block replacements migrate existing linked references to the configured replacement entity.
  - Revalidated `type-check`, `lint`, `build:landing`, `npm audit --omit=dev`, focused unit coverage and focused CMS E2E coverage for the new replacement flow.
- **Deprecation lifecycle and replacement guidance for reusable CMS entities**
  - Added provider-agnostic deprecation metadata plus lifecycle helpers so reusable sections, reusable blocks, authored block presets and schema-field presets can be phased out without deleting existing references.
  - Surfaced deprecation status, replacement selection, advisory notes and `Use replacement` actions across the authored preset and reusable library surfaces in `Content`, `Pages` and `Blocks`.
  - Filtered deprecated entities out of new authoring pickers by default while keeping archived and already-linked records intact for existing content.
  - Added focused unit coverage for deprecation-state helpers, storage normalization of deprecation metadata and Playwright coverage proving deprecated field presets guide authors toward approved replacements.
  - Revalidated `type-check`, `lint`, `build:landing`, focused unit coverage and the new CMS replacement-guidance E2E flow.
- **Governance workflow and audit hub in Releases**
  - Added an engine-level governance hub helper that aggregates workflow state, revision cadence, audit activity and role-policy readiness without duplicating workflow rules in the Vue layer.
  - Surfaced a new `Governance workflow and audit` panel in `Releases` with summary cards plus recent revisions, audit entries and role-policy lists for the active tenant state.
  - Added focused unit coverage for governance hub aggregation and Playwright coverage proving the Releases surface reflects workflow and audit activity after a manual settings save.
  - Revalidated `type-check`, `lint`, `build:landing` and focused CMS E2E coverage for the new governance authoring surface.
- **Phase 7 regression and quality hardening for release review workflows**
  - Expanded the Playwright visual regression suite with phase-7 coverage for the `Releases` acknowledgement surface, review package history and checklist drill-down actions.
  - Revalidated the release-review authoring flows with Chromium E2E coverage spanning review hub, checklist navigation, review package export/history and acknowledgement capture.
  - Regenerated the affected Windows visual baselines after closing the phase-7 release review surface work.
  - Revalidated `npm audit --omit=dev`, `lint`, `type-check`, `build:landing`, the full Chromium E2E suite and the CMS visual regression suite to close Phase 7.
- **Publish gate drill-down actions in Releases**
  - Added an engine-level release checklist drill-down helper that maps publish-review issues to concrete authoring destinations such as `Branding`, `Content`, `Pages`, `Blocks` and `Releases`.
  - Surfaced checklist action buttons in `Releases` so authors can jump directly from publish findings to the affected builder surface instead of manually navigating through the CMS.
  - Added a dedicated `Run Validate` shortcut on the checklist validation row when the current release still requires its first validation pass.
  - Added focused unit coverage for drill-down mapping and Playwright coverage proving authors can validate a release and jump straight to `Pages` from a content-integrity finding.
- **Release review acknowledgements in Releases**
  - Added persisted release-review acknowledgement entries with lightweight decisions (`noted`, `approved`, `changes requested`) so review notes can live with the selected release without requiring backend workflow execution.
  - Surfaced a `Review acknowledgements` panel in `Releases` with decision selection, optional note capture, summary chips and a chronological list filtered by release and environment.
  - Added focused unit coverage for acknowledgement creation, bounded history and scoped summaries, plus Playwright coverage proving acknowledgements can be recorded from the Releases authoring UI.
  - Revalidated `type-check`, `lint`, `build:landing`, focused release/unit coverage and focused CMS E2E coverage for the acknowledgement flow.
- **Review package history surface in Releases**
  - Added persisted review-package export metadata to the release settings domain so authors can recall recent offline review exports without storing the full payload in CMS state.
  - Surfaced a new `Review package history` panel in `Releases` with recent exports for the active environment, including file name, release context, change counts, locale gaps and checklist status.
  - Added focused unit coverage for review-package history metadata creation/capping plus Playwright coverage proving exported review packages appear immediately in the new Releases history surface.
  - Revalidated `type-check`, `lint`, `build:landing`, focused unit tests and focused CMS E2E coverage for the review export flow.
- **Unified release review hub in Releases**
  - Added an engine-level release review hub helper that aggregates draft-vs-published diff signals, locale coverage gaps and release candidate checklist status into one deterministic summary object.
  - Surfaced the new review hub in the `Releases` module as a compact authoring summary with three review cards for `Changes`, `Locale coverage` and `Checklist`, reusing the same underlying review sources already used elsewhere in the CMS.
  - Added focused unit coverage for release review-hub aggregation semantics plus Playwright coverage proving the new surface renders after creating a new release candidate from a changed draft.
  - Revalidated `type-check`, `lint`, `build:landing`, focused CMS unit coverage and focused Chromium E2E coverage for the unified review surface.
- **Phase 6 regression and quality hardening for review workflows**
  - Expanded the Playwright visual regression suite with phase-6 coverage for the Releases review surface plus the new Pages and Blocks draft-vs-published review summaries.
  - Stabilized the shared CMS E2E suite by aligning usage-protection expectations with the current archive-first UX and scoping the quick-start search assertions to the dedicated quick-start workflow surface.
  - Regenerated the affected Windows visual baselines for the published preview surfaces and the quick-start command surface after the accumulated builder changes from phases 3 through 6.
  - Revalidated `npm audit --omit=dev`, `type-check`, `lint`, `build:landing`, the full Chromium E2E suite (`57 passed`) and the full visual regression suite (`17 passed`) to close Phase 6 with no remaining active roadmap items.
- **Draft comparison export package for release review**
  - Added a versioned review-package payload that combines draft-vs-published diff results, locale coverage and the release candidate checklist into one exportable JSON artifact.
  - Added a new `Releases` action to export the current review package directly from the CMS authoring surface without coupling the flow to any backend.
  - Added focused unit coverage for review-package summary/export helpers plus Playwright coverage proving the review package can be exported after authoring changes against a published release.
  - Documented the review-package contract in [docs/cms-review-package.md](docs/cms-review-package.md) and linked it from the README architecture/guides section.
- **Locale coverage matrix for preview review**
  - Added an engine-level locale coverage matrix that summarizes authored completeness for `Pages`, `Fields` and `Reusable content` across `en` and `pt-BR` preview snapshots.
  - Surfaced the locale coverage review in both `Pages` and `Blocks` preview panels with per-locale status chips, completion ratios and top missing entries.
  - Added focused unit coverage for locale coverage aggregation and Playwright coverage proving the matrix renders consistently in both preview surfaces.
  - Revalidated `type-check`, `lint`, `build:landing`, focused unit tests and focused CMS E2E coverage for the new review surface.
- **Release candidate checklist for CMS publish review**
  - Added an engine-level release candidate checklist builder that turns release gate diagnostics into author-facing review items for candidate state, validation, workflow, permissions, content integrity and production brand assets.
  - Surfaced the checklist in the `Releases` module with grouped status chips, issue lists and readiness counters so authors can review publish blockers without parsing raw diagnostics first.
  - Added focused unit coverage for fresh-draft and production-branding scenarios plus Playwright coverage proving the checklist updates after validation from the authoring UI.
  - Revalidated `type-check`, `lint`, targeted unit tests, focused CMS E2E and `build:landing` after aligning validation status semantics with the checklist review flow.
- **Draft vs published diff review for Pages and Blocks preview**
  - Added an engine-level draft/published diff helper that compares page, section and block snapshots against the best available published release without coupling review flows to backend storage.
  - Surfaced a review summary in both `Pages` and `Blocks`, including change counters, changed-page lists and per-entity status chips so authors can inspect impact before publishing.
  - Added unit coverage for diff aggregation plus focused Playwright coverage validating the new review surfaces against a published release snapshot.
  - Revalidated `type-check`, `lint`, `build:landing`, focused unit tests and focused CMS E2E coverage after fixing the preview status styling regression.
- **Phase 5 regression and quality hardening for starter kits, impact analysis and archive flows**
  - Expanded unit coverage for starter-kit seeding, archived-entity semantics and usage explorer summaries so reusable CMS state remains safe to reason about even when entities are archived but still referenced.
  - Added a focused Playwright regression that installs a starter kit, opens the usage drawer for a seeded reusable block and validates archive/restore behavior in the same authored flow.
  - Expanded the CMS visual regression suite with phase-5 surfaces for starter-kit bundles, reusable-block impact drawer state and archived authored-preset libraries, adding new Windows baselines for those authoring views.
  - Revalidated `type-check`, `lint`, `build:landing`, focused functional E2E and the full CMS visual regression suite to close Phase 5 with no active roadmap items remaining.
- **Backend integration handbook for the CMS engine**
  - Added [docs/cms-backend-integration-handbook.md](docs/cms-backend-integration-handbook.md) to document how backend-oriented teams should hydrate, persist, validate and publish the CMS engine while preserving the boundary between engine concerns and application concerns.
  - Documented the recommended domain split for `content`, `assets` and `releases`, plus the expected boot, save and publish flows for API-backed integrations.
  - Linked the new handbook from the README documentation section and architecture-layer guidance so backend teams have one direct integration entry point.
- **Builder performance and CMS bundle hardening**
  - Reworked the landing Vite chunk strategy so the CMS authoring surface now ships as smaller `cms-app`, `cms-engine`, `cms-ui` and `cms-blocks` bundles instead of one large CMS chunk.
  - Reduced the former single CMS bundle from roughly `606 kB` into production-safe chunks (`cms-app` ~`328 kB`, `cms-engine` ~`221 kB`, plus smaller UI/block chunks) while keeping the async CMS entrypoint intact.
  - Revalidated `type-check`, `lint` and `build:landing` after the split to keep Vercel preview builds stable as the CMS engine grows.
- **Provider hydration examples for external CMS backends**
  - Added a generic transport-based hydration adapter that maps `content`, `assets` and `releases` domains into the existing async CMS provider contracts without changing authoring flows.
  - Added a fetch-based example adapter for teams that already expose one JSON endpoint per CMS domain and want a minimal reference implementation to hydrate the engine.
  - Exported the new hydration helpers through the white-label engine barrel and documented the integration flow in [docs/cms-provider-hydration.md](docs/cms-provider-hydration.md).
  - Added focused unit coverage for transport mapping, fetch endpoint handling and provider bundle generation, then revalidated `type-check`, `lint` and `build:landing`.
- **Archive flow for reusable CMS entities and authored presets**
  - Added a shared archive-state helper plus persisted `archivedAt` support for reusable sections, reusable blocks, authored block presets and authored schema-field presets.
  - Updated `Pages`, `Blocks` and `Content` libraries to hide archived entries from normal authoring flows by default, with explicit `Show archived` toggles and restore actions.
  - Preserved existing linked/detached references while disabling reuse actions for archived entities until they are restored, which makes long-lived tenants safer than hard delete.
  - Added focused unit coverage for archive normalization and helper behavior, plus Playwright regression coverage for archiving and restoring reusable entities and authored presets.
  - Fixed the landing production build pathing used by Vercel and validated the build locally after removing TypeScript-extension imports from `CmsApp.vue`.
- **Engine impact drawer for reusable CMS entities**
  - Added a shared impact-analysis drawer backed by the engine usage index so authors can inspect full references for authored content models, reusable sections, reusable blocks and authored presets before detaching or deleting them.
  - Added `Inspect usage` actions across `Content`, `Pages` and `Blocks`, complementing the existing safe delete guards with readable per-reference diagnostics in the authoring surface.
  - Added focused unit coverage for usage-summary resolution by target kind and Playwright regression coverage validating the drawer flow from in-use reusable sections and reusable blocks.
- **Starter-kit bundles for common landing use cases**
  - Added a dedicated starter-kit catalog that composes existing page templates, reusable sections, reusable blocks, authored block presets and authored schema-field presets into one guided install flow.
  - Added `Pages` builder cards and quick commands for starter-kit installation, including a direct `Install + open blocks` path for backend-oriented teams that want to seed a full landing setup in one step.
  - Added focused unit coverage for starter-kit option/bundle generation plus Playwright regression coverage proving that starter-kit installation seeds reusable libraries and opens the target page in `Blocks`.
- **Cross-entity usage explorer and safe delete guards for reusable CMS entities**
  - Added a shared engine usage index covering authored content models, authored block presets, reusable blocks and reusable sections, replacing scattered ad hoc counters with one consistent impact-analysis source.
  - Surfaced usage chips and readable reference summaries across `Content`, `Pages` and `Blocks` so authors can see where reusable entities are consumed before making destructive changes.
  - Blocked delete actions for in-use reusable sections, reusable blocks and authored presets directly in the authoring surface and in the action handlers.
  - Added focused unit coverage for cross-entity usage counting plus Playwright regression coverage for disabled delete actions on in-use reusable content.
- **Phase 4 regression and quality hardening for richer schema authoring**
  - Expanded the Playwright visual regression suite with phase-4 coverage for authored schema surfaces, localized rich page fields and section-level field authoring in `Blocks`.
  - Hardened the CMS E2E selector helpers for `CmsMediaAssetPicker` and media replacement flows so the full authoring suite remains stable with the richer media-field UX.
  - Added landing production build verification to CI so Vercel-style module resolution and bundle regressions are caught before preview deployment.
  - Closed Phase 4 with a fully passing Chromium Playwright suite (`43 passed`), clean `type-check`, clean `lint` and updated consolidated planning status.
- **Schema package import/export flows for authored CMS models and presets**
  - Added a versioned schema-package payload contract dedicated to authored content models, schema-field presets and block presets, keeping schema transfer independent from authored pages, media assets and release state.
  - Added `Content` tab actions to export and import schema packages directly from the CMS authoring surface, preserving the rest of the tenant snapshot while replacing only schema libraries.
  - Hardened schema snapshot cloning against Vue reactive proxies so package export works reliably in production builds and browser previews.
  - Added focused unit coverage for schema-package parsing/application and Playwright coverage proving schema import does not overwrite authored page content.
- **Media picker previews and clearer selection UX for media-asset fields**
  - Added a reusable CMS media-asset picker with thumbnails, kind badges and selected-asset previews so schema-driven media fields no longer rely on raw `q-select` lists across content-model defaults, page fields, section fields and block bindings.
  - Centralized media-picker option shaping in the white-label engine, keeping compatible assets first while surfacing incompatible assets as disabled options with explicit allowed-kind feedback instead of hiding them.
  - Added focused unit coverage for picker option ordering and selection resolution, and updated Playwright schema-field coverage to verify preview cards plus incompatible media feedback in `Pages`.
- **Async-friendly repository adapters for CMS integration**
  - Added promise-native repository adapter contracts and wrappers for the content, asset and release domains so future backend integrations can adopt async persistence without changing the aggregate CMS authoring contract.
  - Added aggregate async load/save hydration helpers that split or rehydrate white-label settings through the provider bundle while preserving omitted domains.
  - Added storage-backed demo repository factories, including async wrappers, so the current local persistence flow already mirrors the future async integration boundary.
  - Added focused unit coverage for sync-to-async provider wrapping, async storage-backed round-trips and provider-domain hydration behavior.
- **Section-level custom field surfaces in Pages and Blocks**
  - Added section-scoped custom-field storage and localized field payloads to page section contracts so sections can carry authored metadata independently from page-level schema fields.
  - Added built-in section schema fields for anchor id and theme variant across section presets, with grouped metadata resolved through the shared content-model engine.
  - Updated the `Blocks` builder to render grouped section schema fields, preserve them through `Pages` round-trips and keep linked reusable sections read-only.
  - Extended shared validation and regression coverage so invalid section custom-field values are reported consistently in unit and Playwright suites.
- **Localized schema metadata authoring for content-model fields**
  - Added explicit EN/base plus PT-BR authoring inputs for schema-field `label`, `description`, `placeholder` and `group` metadata in the CMS `Content` tab.
  - Updated field-draft persistence so localized schema metadata is saved through content-model and schema-field preset flows without overwriting the English base contract.
  - Updated content-model preview chips to resolve field labels and groups according to the active authoring locale while keeping the stored schema metadata explicit.
  - Added Playwright regression coverage proving that localized field metadata survives reload and renders locale-specific labels/groups in the `Pages` builder.
- **Schema reference fields and entity relationships for content models**
  - Added `reference` as a first-class schema field type so authored content models can point to internal CMS engine entities without backend coupling.
  - Added backend-agnostic internal reference catalogs for authored content models, block presets, reusable blocks and reusable sections, including allowed-kind constraints on schema fields.
  - Updated the `Content` tab and `Pages` builder to author and render reference fields through select-based entity pickers instead of raw string ids.
  - Extended validation and schema-field preset contracts so reference fields are checked against engine catalogs and keep their allowed reference kinds through reuse flows.
- **Rich schema field types for content-model page fields**
  - Added `url`, `date` and `media-asset` as first-class authored schema field types for page-level custom fields in the CMS engine.
  - Extended content-model normalization, page custom-field defaults and schema-field preset contracts so these richer field types keep media-kind constraints and stable default values through storage and reuse flows.
  - Updated the CMS `Content` tab and `Pages` builder to author and render these field types directly, including managed media-asset selection constrained by allowed media kinds.
  - Added focused unit and Playwright coverage for rich field-type authoring, validation and page-level rendering.
- **Grouped and ordered schema fields for content-model page authoring**
  - Added `group` and explicit `order` to authored content-model schema fields so page-level custom fields can be organized into stable authoring sections instead of a single flat list.
  - Extended field localization metadata to support localized group labels and wired ordered/grouped resolution through the content-model engine signatures used by normalization and schema versioning.
  - Updated the CMS `Content` tab to author field group and order metadata, and updated the `Pages` builder to render grouped custom-field sections with preserved field order.
  - Expanded unit and Playwright regression coverage for authored content models to validate grouped field authoring and grouped rendering in `Pages`.
- **Reusable schema-field presets for authored content models**
  - Added an authored schema-field preset library so one field contract can be saved once and reapplied across multiple content models without re-entering the same schema metadata.
  - Wired the `Content` authoring UI to save, apply and remove field presets directly from the schema-field editor while keeping defaults, options and localized metadata consistent.
  - Added focused unit coverage for schema-field preset normalization and application flows.
- **Conditional visibility rules for schema-driven page fields**
  - Added shared visibility rules for content-model fields based on another field value or on page status, keeping the same behavior across normalization, `Pages` authoring and validation.
  - Updated the `Pages` builder to render only the fields that match the active visibility rules and updated validation so hidden required fields do not block authoring.
  - Added regression coverage for field-driven and page-status-driven conditional visibility in unit and Playwright suites.
- **Guided quick-start workflows in the Pages builder**
  - Added quick-start cards in `Pages` for common template-driven flows (`Landing`, `Marketing funnel`, `Blank page`) so authors can create a page without manually selecting a template first.
  - Added a one-click `Create + open blocks` action that creates the page, initializes authoring selections and jumps directly into the `Blocks` module on the first editable section.
  - Added unit coverage for quick-start metadata and Playwright coverage for the guided create/open workflow.
- **Shared builder search and quick commands for Pages and Blocks**
  - Reused the existing topbar search as the single search surface for authoring, filtering page quick-starts, page cards, reusable sections, block sections, reusable blocks and authored preset libraries without breaking sidebar module navigation.
  - Added module-aware quick command pickers in `Pages` and `Blocks` for common actions such as create/open page, apply model scaffold/defaults, sync schema version, focus sections/blocks and select reusable content.
  - Added focused Playwright coverage for shared search filtering plus command execution across `Pages` and `Blocks`.
- **Domain-level import/export flows for content, assets and releases**
  - Added a versioned domain-payload contract so `content`, `assets` and `releases` can be exported and imported independently without replacing the broader tenant-level JSON package flow.
  - Added CMS `Settings` actions for domain package selection plus `Export package` / `Import package`, backed by provider-domain snapshot extract/apply helpers.
  - Added unit coverage for payload parsing and focused Playwright coverage for importing and exporting each domain while preserving the untouched domains in storage.
- **Draft recovery and autosave resilience in the CMS engine**
  - Added tenant-scoped draft recovery snapshots with `latest` and `previous` autosave checkpoints so destructive authoring actions can recover the last distinct draft state without backend support.
  - Added auto-save status diagnostics plus `Restore auto-save` / `Discard auto-save` controls to the CMS Settings toolbar, keeping long authoring sessions safer for backend-oriented users.
  - Added focused unit coverage for recovery snapshot rotation and a Playwright regression that restores the last auto-saved tenant branding draft after a reset-to-defaults action.
- **Phase 3 regression and quality hardening for CMS authoring**
  - Expanded the Playwright visual regression suite with phase-3 authoring surfaces covering content-model schema authoring, Pages quick-start plus command flows, and the draft-recovery toolbar state.
  - Regenerated deterministic Windows visual baselines for the updated Settings shell after the autosave toolbar changes, keeping the existing visual gate aligned with the current authoring UI.
  - Hardened functional E2E coverage by stabilizing drag-and-drop target positions in the page/block reorder flow and by uploading Playwright artifacts when the Linux E2E job fails in CI.
- **Engine-level visual regression and release-quality gates**
  - Added a dedicated Playwright visual regression suite for the CMS engine covering light, dark and monochrome settings shells plus published preview states in `Pages` and `Blocks`.
  - Added deterministic Windows snapshot baselines so the visual contract is protected without cross-platform rendering noise from the Linux functional E2E job.
  - Added a dedicated `visual-regression` GitHub Actions job on `windows-latest` with failure artifact upload for `test-results` and Playwright report output.
- **Backend-oriented authoring UX hardening in the CMS engine**
  - Added snapshot-based `undo/redo` history for CMS settings authoring through a reusable `snapshot-history` helper and integrated it into the Settings actions toolbar.
  - Added `Blocks` productivity actions for block duplication, bulk enable/disable, cleanup of disabled blocks and clearer guided empty states for section/page authoring.
  - Hardened the duplicate-block mutation with immutable page/section updates and stabilized Playwright authoring coverage by resetting browser storage once per E2E test case instead of leaking state across runs.
- **Landing + CMS i18n baseline (`en` default, `pt-BR` option)**
  - Added landing i18n provider with locale persistence (`localStorage` + `?lang=` sync), runtime toggle in topbar, and translated copy across landing sections.
  - Added CMS locale preset engine for shell/content labels with `Language` selector in Content tab.
  - Added locale normalization in white-label storage compatibility layer.
  - Added new unit suites: `LandingI18n.spec.ts` and `WhiteLabelI18n.spec.ts`.
- **CMS i18n continuation for operational UI copy**
  - Replaced remaining hardcoded labels/messages in `CmsApp.vue` with locale-aware mapping (`en`/`pt-BR`) for tenant/actions toolbar controls, theme preset controls, and module titles (`Pages`, `Blocks`, `Media`, `Releases`).
  - Localized release empty states and runtime status messages used by save/reset/import/release orchestration actions.
  - Added shared saved-at formatter and page/release label helpers tied to current CMS locale.
  - Added `tr(en, pt-BR)` helper and localized remaining CMS form labels, toggles, buttons and example copy across `Branding`, `Menu`, `Topbar`, `Content`, `Pages`, `Blocks`, `Media` and `Releases`.
- **Pages builder templates for faster CMS authoring**
  - Added `page-templates` helper module with localized templates (`Landing`, `Marketing`, `Blank`) and collision-safe generation for page id/path/title.
  - Added template selector in `Pages` module header and switched `Add page` flow to template-driven scaffolding.
  - Added `PageTemplates.spec.ts` regression suite and validated against existing CMS config/storage/i18n tests plus `cms-settings-flow` E2E.
- **Backend-agnostic persistence contracts for the CMS engine**
  - Added `providers.ts` with `CmsPersistenceStore` plus options contracts for white-label settings and tenant profile persistence.
  - Kept browser `localStorage` as the default adapter, but storage helpers now accept injected stores so the engine can later plug into external application/backoffice layers without rewriting builder logic.
  - Added regression tests covering provider-backed white-label settings persistence and tenant profile fallback loading.
- **Structured content models and section presets for CMS Pages**
  - Added `content-models.ts` with localized content model catalogs (`Landing page`, `Marketing page`, `Blank canvas`) and reusable section preset definitions.
  - Extended page/section contracts with `contentModelId` and `presetId`, plus storage migration helpers that detect and normalize legacy page payloads.
  - Updated `Pages` authoring UX to select content models, pick section presets before adding sections, and preview the active content model directly in page cards.
  - Added `ContentModels.spec.ts` and expanded `cms-settings-flow` E2E to validate `Content model -> Section preset -> Add section` behavior.
- **Reusable block library for the CMS engine**
  - Added `reusable-blocks.ts` with localized reusable block seeds, normalization helpers and clone utilities for block templates.
  - Extended the CMS engine contracts, storage normalization and release snapshots to persist reusable block libraries independently of backend infrastructure.
  - Added `Blocks` authoring controls to save the selected block as reusable, reinsert reusable templates into a page section, and remove obsolete templates from the shared library.
  - Hardened cloning against Vue reactive proxies via `toRaw` + JSON fallback and stabilized Playwright E2E execution by switching the default web server to `build:landing + vite preview`.
  - Added `ReusableBlocks.spec.ts` and expanded `cms-settings-flow` E2E to validate reusable block save/insert behavior.
- **Schema-driven media asset references in Blocks**
  - Added `media-asset` field support to the landing block-field catalog so block schemas can store asset references instead of only manual URLs.
  - Extended the CMS renderer with optional `renderContext` + registry-level `resolveProps` hooks, allowing block runtimes to resolve `assetId -> url/alt` before mount without coupling the engine to a backend.
  - Wired the `Blocks` editor to show typed media-library selectors for hero image/video/poster bindings while preserving manual URL override fields for legacy content and explicit fallbacks.
  - Added regression coverage in `MediaLibrary.spec.ts`, `CmsRenderer.spec.ts`, `LandingBlockFields.spec.ts` and Playwright E2E for binding a media asset into a hero block and verifying preview + reload persistence.
- **CMS media diagnostics and drag-and-drop authoring primitives**
  - Added reusable media diagnostics (`media_asset_missing`, `media_asset_kind_mismatch`, `media_asset_url_missing`, `media_asset_unused`) plus reference and usage aggregation surfaced in `Blocks` and `Media`.
  - Added drag-and-drop reordering for `Pages` section rows and `Blocks` rows/section containers, backed by builder-state index move helpers instead of ad-hoc UI-only swaps.
  - Fixed page normalization so authored block ids keep priority during cross-section moves, while auto-generated placeholder blocks are renumbered when a source section becomes empty.
  - Added Playwright regression coverage for block/section drag-and-drop and deleted-asset diagnostics.
- **Structured content validation shared by CMS builder and releases**
  - Added `content-validation.ts` as the engine-level validator for page, section and block integrity (`duplicate ids/paths`, `invalid content models/presets`, `empty enabled sections`, `unregistered block types`, `schema-invalid props`).
  - Reused the same validator inside release snapshot validation so authoring and release gates now share one content-integrity contract.
  - Surfaced content diagnostics directly in `Pages preview` and `Blocks preview`, and fixed the blocks summary cards to expose both enabled sections and enabled blocks counts.
  - Added `ContentValidation.spec.ts`, expanded `CmsReleases.spec.ts`, and added Playwright coverage to assert the same content diagnostic appears in both `Pages` and `Blocks`.
- **Reusable section library and richer Pages authoring**
  - Added `reusable-sections.ts` with backend-agnostic section-template normalization, cloning and authored-section save helpers.
  - Extended white-label settings storage and release snapshots to persist reusable section libraries alongside pages, reusable blocks and media assets.
  - Expanded the `Pages` builder with `Save reusable`, `Insert reusable` and `Duplicate` section flows plus a reusable-sections library panel for management.
  - Added `ReusableSections.spec.ts`, expanded storage/release regression coverage, and added Playwright coverage for saving/reinserting reusable sections in `Pages`.
- **Locale-scoped authored content for Pages and Blocks**
  - Added `localized-content.ts` with backend-agnostic helpers to normalize, resolve and update localized authored values while keeping English as the base content contract.
  - Extended page, section, block, reusable block and reusable section contracts with optional localization payloads and preserved them through storage normalization, page templates and reusable libraries.
  - Updated `CmsApp.vue` so `Pages` and `Blocks` edit locale-scoped content based on the active CMS locale (`en` / `pt-BR`) without mutating the other locale.
  - Updated the CMS renderer to merge localized block props through `renderContext.locale`, and added unit/E2E regression coverage for locale isolation across authoring and runtime resolution.
- **Schema-driven block presets with localized CMS seeding**
  - Added `block-presets.ts` as a first-class engine catalog for localized starter blocks (`header`, `hero`, `stats`, `features`, `cta`, `footer`) plus preset metadata for CMS authoring.
  - Wired content-model section presets, reusable block seeds and reusable section cloning to preserve block `presetId` and seed locale-aware starter content consistently.
  - Hardened builder/page-schema cloning against Vue reactive nested props so inserting localized presets from the `Blocks` toolbar is stable in runtime, unit tests and Playwright E2E.
- **Simpler Pages authoring with starter preset variants**
  - Enriched starter preset options with source/default metadata and surfaced them as quick-pick cards in `Pages`, so authors can choose starter variants visually instead of relying only on dropdowns.
  - Documented the platform layering in the root README to keep the boundary clear: `Quasar -> NTK UI -> NTK CMS Engine -> application/backend contracts`.
- **Authored content-model library inside the CMS engine**
  - Added authored content-model contracts to the engine type/config/storage/release pipeline, including localized name/description fields plus allowed/recommended section preset constraints.
  - Extended shared content validation so authored model ids and preset compatibility are enforced both in the builder and in release validation.
  - Added a dedicated `Content` tab authoring surface for model library selection, draft creation, preset toggles, save/delete flows and preview metadata, then validated the full flow in unit tests and Playwright E2E.
- **Required section presets for content models**
  - Added `requiredPresets` to builtin and authored content-model contracts so page schemas can demand mandatory sections in addition to allowed/recommended composition hints.
  - Constrained `requiredPresets` to the allowed-preset set during normalization, storage import and authoring updates, preventing invalid schema states from leaking into the builder.
  - Surfaced required presets in the CMS `Content` tab and extended the shared content validator to emit blocking diagnostics when a page omits a mandatory enabled section for its selected content model.
- **Media engine hardening for enterprise authoring**
  - Extended media assets with focal-point metadata and optional replacement targets while preserving backend-agnostic storage contracts.
  - Added branding-aware media usage aggregation plus shared diagnostics for missing alt text, invalid focal points and broken replacement-target references.
  - Added an explicit `Replace references` flow in the `Media` module that rewires page block bindings and branding URLs to a new asset without manually editing each consumer.
  - Expanded regression coverage with unit tests for usage/replacement flows and Playwright coverage for asset replacement across `Media` and `Blocks`.
- **Starter page scaffolds for content models**
  - Added ordered `starterPresets` to builtin and authored content-model contracts so each model can define the initial page section sequence it wants authors to start from.
  - Exposed scaffold authoring in the CMS `Content` tab and added a `Pages -> Apply model scaffold` action that replaces the current section list with the selected model scaffold.
  - Added storage roundtrip regression for authored scaffolds and extended Playwright coverage to validate authored model creation, scaffold application and incremental section insertion on top of the scaffold.
- **Content-model composition limits in the CMS engine**
  - Added `maxSections` and per-preset repetition caps (`sectionPresetLimits`) to authored content-model contracts, normalization and storage roundtrips.
  - Exposed those limits in the CMS `Content` tab so authors can constrain composition without backend coupling.
  - Extended shared content validation and the `Pages` builder so invalid schemas are reported and `Add section` is disabled when the selected preset cap or total enabled-section budget is reached.
- **Content-model default page metadata**
  - Added `defaultPageTitle`, `defaultPageDescription` and `defaultPagePathPrefix` to builtin and authored content-model contracts.
  - Exposed these defaults in the CMS `Content` tab preview/editor and added `Pages -> Apply model defaults` for explicit page metadata stamping.
  - Added regression coverage in authored-content-model, content-model, storage and Playwright CMS flow tests.
- **Schema field engine MVP for authored content models**
  - Added page-level schema field definitions to authored content models (`id`, `label`, `description`, `placeholder`, `type`, `required`, `defaultValue`, `options`).
  - Extended page settings with `customFields` plus localized page-field payload support, and surfaced these fields in the `Pages` builder as rendered form controls.
  - Added shared validation and storage normalization for schema-driven page custom fields, plus unit/E2E regression coverage for authored schema fields in the CMS flow.
- **Schema field engine completion for authored content models**
  - Added `repeatable`, `min` and `max` field constraints to authored schema fields and normalized them through content-model creation, updates, page custom-field coercion and storage roundtrips.
  - Added locale-aware field metadata resolution for `label`, `description` and `placeholder`, keeping English base values stable while resolving localized field copy in the CMS runtime.
  - Extended the `Content` authoring UI and `Pages` builder to support multiline repeatable defaults/inputs, context-aware hints, and validation-aware field rendering backed by targeted unit and Playwright regression coverage.
- **Section schema contracts and block-slot rules in the CMS engine**
  - Added explicit section-preset composition contracts with allowed block types, single-slot metadata and min/max enabled block limits to the CMS engine.
  - Updated `listCmsSectionStarterPresetOptions` and the `Blocks` builder so palette types, block presets and `Add block` availability now respect the active section contract instead of filtering only by raw block type.
  - Extended shared content validation with section-level diagnostics for incompatible block types, incompatible block presets and section block-limit violations, backed by unit and Playwright regression coverage.
- **Content-model versioning and migration diagnostics**
  - Added `schemaVersion`, localized `migrationNotes` and `lastSchemaChangeAt` to builtin and authored content-model contracts, with schema-version bumps triggered only by structural model changes.
  - Persisted `contentModelVersion` on pages and surfaced shared diagnostics for missing, stale and ahead page-schema versions so authored content cannot drift silently from its model.
  - Extended the CMS `Content` and `Pages` flows with migration metadata preview plus explicit `Sync schema version` recovery, backed by focused unit and Playwright regression coverage.
- **Advanced CMS preview modes backed by engine snapshots**
  - Added `preview.ts` with backend-agnostic snapshot resolution for `draft` and release-backed `published` preview modes, including deterministic published-release fallback selection by active environment.
  - Extended `Pages preview` and `Blocks preview` with independent `preview source`, `locale` and `viewport` controls, plus responsive preview frames for `desktop`, `tablet` and `mobile`.
  - Rewired preview validation/diagnostics/media resolution to consume the resolved preview snapshot instead of only the live draft, and added unit + Playwright regression coverage for `draft vs published` preview behavior.
- **Linked vs detached reusable content in the CMS engine**
  - Added explicit `reusableMode` / `reusableSourceId` provenance to page sections and blocks so reusable content can stay linked to library entries or be inserted as detached snapshots intentionally.
  - Added reusable-reference resolution and detach helpers for blocks/sections, then wired the same contract through builder runtime, preview resolution, content validation and release orchestration diagnostics.
- **Backend-agnostic repository contracts for content, assets and releases**
  - Expanded `providers.ts` from raw key-value persistence into engine-facing repository contracts for `content`, `assets` and `releases`, including async-friendly provider interfaces and domain snapshot extract/apply helpers.
  - Added storage-level load/save wrappers for each repository domain so the current `localStorage` demo already uses the same split contracts that future backend integrations can implement.
  - Added focused provider regression coverage to guarantee content, asset and release snapshots round-trip independently without cross-domain mutation.
  - Updated `Pages` and `Blocks` authoring flows with `Insert detached`, `Insert linked`, reusable-source chips, read-only linked editing behavior and explicit detach actions, backed by focused unit and Playwright regression coverage.
- **Structured block props editor in CMS Blocks module**
  - Dynamic field catalog for landing blocks (`header`, `hero`, `stats`, `features`, `cta`, `footer`)
  - Field-level editing for `text`, `textarea`, `number`, `toggle`, `select`, and `json`
  - Bidirectional sync between structured fields and raw `Block props JSON`
- **Regression tests for CMS Blocks flow**
  - E2E coverage for `Pages -> Blocks` navigation and structured/JSON props synchronization
  - Unit tests validating landing block field catalog (supported types, unknown types, unique paths)
- **Renderer regression test for legacy props**
  - Added coverage for rendering `landing.cta` when props are empty
- **Landing color token set exposed in CMS**
  - Added dedicated `Landing Colors` section in CMS settings with live preview for section backgrounds, theme gradients, code syntax and dark-shared tokens
  - Expanded `AppShellTheme` with landing-specific color keys and wired defaults/presets for `default`, `dark` and `monochrome`
- **Landing typography scale tokenized in CMS**
  - Added landing font-size tokens (`2xs` to `display-3xl`) to `AppShellTheme`, default theme and presets
  - Wired landing runtime to apply these typography tokens from active CMS tenant profile
  - Organized landing token editing into sectioned groups (core, typography, neutrals, sections, GitHub-dark, shared-dark, syntax, effects)
- **Landing spacing/radius/shadow/motion tokenized in CMS**
  - Added landing spacing (`xs` to `3xl`) and radius (`xs` to `pill/round`) tokens to `AppShellTheme`, default theme and presets
  - Added landing shadow presets (`header`, `emphasis`, `topbar scrolled`, `code frame`, `code frame hover`) and interaction motion tokens (easing, transitions, reveal, hover and topbar enter behavior)
  - Wired landing runtime CSS vars to active tenant profile for these tokens and replaced remaining hardcoded landing radius/shadow values with token-based vars
  - Expanded CMS `Landing Colors` organization with `layout spacing`, `radius`, `shadows` and `motion` sections
- **Landing pulse/float motion timings tokenized in CMS**
  - Added configurable landing motion tokens for pulse/float durations, easings and float delays (`sm`, `md`, `lg`, `xl`)
  - Wired runtime CSS vars in `landing-page/App.vue` for pulse/float animation control from tenant settings
  - Replaced remaining fixed animation/transition values (`2s`, `4s`, `0.2s`, `0.3s`, `0.6s`, `0.9s`) with token-driven values
- **Landing layout dimensions and reveal observer settings tokenized**
  - Added layout tokens for container width, hero paddings/orb/title clamp, section/header/media widths, icon/chart sizes, drawer width and floating CTA offsets/padding
  - Added reveal observer tokens (`threshold`, `root margin`) and removed fixed observer values in landing runtime
  - Exposed the new keys in CMS `Landing Colors` under `Layout Dimensions` and `Motion`
- **Landing residual structural literals tokenized**
  - Added layout tokens for global line-height, thin border width, z-index layers (`header`, `drawer`, `overlay`, `floating button`), hero orb offsets, hero badge letter spacing, theme badge hover scale, chart bar hover opacity and mobile drawer shadow
  - Replaced remaining fixed literals in `landing-page/App.vue` with token-driven CSS variables
  - Exposed all new keys in CMS `Landing Colors` under `Layout Dimensions`
- **Responsive breakpoints fully configurable via CMS tokens**
  - Added `landingBreakpointLg`, `landingBreakpointMd` and `landingBreakpointSm` to theme contract/defaults/presets and CMS fields
  - Replaced fixed `@media (max-width: 1024/768/480)` landing rules with runtime responsive classes (`landing-bp-lg/md/sm`) computed from active token values
  - Mobile navigation visibility now follows the same configurable breakpoint tokens
- **Shell viewport fallback aligned to tokenized CMS breakpoint**
  - Updated `NtkAppShell` viewport fallback to derive from `cmsLayoutBreakpointLg` instead of fixed `1280`
  - Added landing regression assertion to prevent reintroducing fixed `@media (max-width: ...)` rules
- **Landing micro-typography hooks tokenized in runtime CSS**
  - Wired CMS theme keys for landing nav/hero/feature/code/footer line-heights and floating button letter-spacing to actual `App.vue` CSS selectors
  - Added regression assertions to prevent numeric `line-height` and `letter-spacing` declarations from reappearing in landing app styles
- **Layout components responsive/style hardening without fixed max-width rules**
  - Replaced fixed `@media (max-width: ...)` behavior in `NtkHeader`, `NtkLandingHeader`, `NtkCTASection`, `NtkServiceGrid`, `NtkStatsSection`, `NtkTechStack` and `NtkContactSection` with viewport-aware reactive logic
  - Converted remaining numeric `line-height`/`letter-spacing` literals in layout components to tokenized CSS variables
  - Added layout regression test to guard against reintroducing fixed max-width media rules and numeric line-height/letter-spacing declarations
- **CMS mapping for new layout breakpoint/typography hooks**
  - Responsive layout components now fallback to tokenized landing breakpoints (`landingBreakpointLg/Md/Sm`) when explicit props are not provided
  - Added new landing layout theme keys for `CTA subtitle line-height`, `section badge letter-spacing` and `footer link title letter-spacing`
  - Wired new keys through `AppShellTheme`, default theme, presets, CMS field catalog and landing runtime CSS var map
- **CMS editor performance and virtualization hardening (Item 111)**
  - Extracted `CmsPreviewToolbar.vue` to eliminate three identical inline copies of the preview toolbar across `Settings`, `Pages`, and `Blocks` surfaces.
  - Extracted `CmsLocaleCoverageMatrix.vue` to eliminate two identical inline copies of the locale coverage matrix across `Pages` and `Blocks`.
  - Replaced three `v-show` preview card mounts with `v-if` so preview surfaces are lazy-mounted only when the author navigates to the Preview tab, reducing initial DOM size.
  - Added 200 ms debounced search via `debouncedCmsBuilderSearch` so the 18 filtered-list computeds skip recalculation on every keystroke.
  - Consolidated three `watch(settings, { deep: true })` pipelines into two (sync+save, history+autosave) to remove redundant deep-traversal work.
  - Added paged rendering for the reusable-section library, reusable-block library, and authored-preset library (50 items when no active search, full results when searching) to keep large enterprise libraries performant.
  - All DOM/ARIA/`data-*` E2E contracts preserved; validated with `type-check`, `lint`, `build:landing`, and `npm audit --omit=dev`.
- **CMS enterprise regression and release criteria closeout (Item 112)**
  - Ran the full Chromium Playwright E2E suite (70 tests) against the Item 111 changes; 913 unit tests pass without change.
  - Identified and documented 10 pre-existing visual-regression timeout failures (Settings Branding tab visibility, schema authoring surfaces, and phase 6 review surfaces) rooted in workspace tab refactors from prior commits (`71aaeba`, `de89f4d`, `fc2fce5`) that pre-date the enterprise items.
  - Refreshed visual-regression baselines for the 10 tests whose screenshots changed due to the `--ntk-cms-font-size-base` token substitution on `.cms-page-quick-start-card__meta` (font-size moved from hardcoded `0.85rem` to the 0.925 rem token default); all 10 snapshot tests now pass.
  - Confirmed `build:landing`, `type-check`, `lint`, and `npm audit --omit=dev` all pass at close.
  - Closed the CMS Engine Enterprise Plan (2026-03-13) after tester and reviewer gate criteria were satisfied.

### Changed

- **CMS settings content field migration**
  - Replaced the Settings content-copy tab `q-input` and `q-select` controls with `NtkInput` and `NtkSelect` compatibility wrappers.
  - Replaced the content locale preset action with `NtkButton` while preserving locale selection, translated copy fields, textarea autogrow behavior, and preview text bindings.
- **CMS settings module native status chips**
  - Replaced the remaining direct `q-chip` status badges in the CMS Settings module with the native `CmsStatusChip`.
  - Preserved autosave, notification, preview, tab label, content-model preset count, tenant, and workbench status badge styling through existing token-driven chip styles.
- **CMS releases module native status chips**
  - Replaced the remaining direct `q-chip` status badges in the CMS Releases module with the native `CmsStatusChip`.
  - Preserved release count, review hub, review package history, governance, acknowledgement, checklist, timeline, calendar, and conflict badge styling through existing token-driven chip styles.
- **CMS pages module native status chips**
  - Replaced the remaining direct `q-chip` status badges in the CMS Pages authoring module with the native `CmsStatusChip`.
  - Preserved template, schema migration, reusable section, starter-kit, quick-start, and linked/detached section badge styling through existing token-driven chip styles.
- **CMS blocks module native status chips**
  - Replaced the remaining direct `q-chip` status badges in the CMS Blocks module with the native `CmsStatusChip`.
  - Preserved ruler counts, reusable library counts, usage badges, block status badges, linked/detached state, and preview diff badge styling through existing token-driven chip styles.
- **CMS pages preview native status chips**
  - Replaced the remaining direct `q-chip` status badges in the CMS Pages preview module with the native `CmsStatusChip`.
  - Preserved draft/published diff, page metadata, page status, page diff, and section badge styling through existing token-driven chip styles.
- **CMS media module native status chips**
  - Replaced the remaining direct `q-chip` status badges in the CMS Media authoring module with the native `CmsStatusChip`.
  - Preserved media counts, diagnostics, binding metadata, asset refs, focal point, replacement, tag, and diagnostic-code badge styling through the existing token-driven chip styles.
- **CMS shared native status chips**
  - Added a native `CmsStatusChip` for CMS authoring status badges and migrated shared authoring chrome, preview toolbar, locale coverage, usage drawer and media picker badges away from direct `q-chip` usage.
  - Preserved token-driven chip styling and refreshed affected Windows CMS release review visual baselines.
- **CMS releases module field migration**
  - Replaced the remaining direct `q-input` and `q-select` controls in the CMS Releases authoring module with `NtkInput` and `NtkSelect` compatibility wrappers.
  - Added `datetime-local` support to `NtkInput` for scheduled release publishing and refreshed the affected Windows release visual baselines.
- **CMS shell card native markup**
  - Replaced the shared CMS shell card and authoring workbench `q-card` roots with native `section` markup while preserving classes, slots, separators, and visual coverage.
  - Refreshed the dark CMS shell visual baseline where the workbench now uses the CMS dark surface instead of the Quasar card default.
- **CMS shell card native separator**
  - Replaced the shared CMS shell card `q-separator` with a tokenized native `hr` separator while preserving the `showSeparator` contract and visual coverage.
- **CMS authoring native separators**
  - Replaced the remaining direct `q-separator` controls in CMS authoring surfaces with tokenized native `hr` separators.
  - Added audit coverage preventing direct `q-separator` regressions in CMS authoring Vue files and refreshed the reusable block impact drawer visual baseline.
- **CMS usage drawer native shell**
  - Replaced the usage drawer `q-card` shell and direct close `q-btn` with native shell markup and the rendered `DsButton` wrapper.
  - Added translated close-label wiring, role-based E2E close coverage, pointer-event handling for the native dialog child, and focused unit/audit coverage.
- **CMS field bridge token aliases**
  - Removed duplicated broad Quasar field overrides from the CMS authoring stylesheet and routed field colors/borders through scoped token aliases consumed by the shared template bridge.
  - Refreshed the dark CMS shell visual baseline so dark preset fields now follow the tokenized CMS surface instead of Quasar's default light field surface.
- **CMS media module field migration**
  - Replaced the remaining direct `q-input` and `q-select` controls in the CMS Media authoring module with `NtkInput` and `NtkSelect` compatibility wrappers.
  - Preserved media field labels, hints, numeric bounds, textarea autogrow, replace-target clearing, and popup styling while adding audit coverage against direct form-control regressions.
- **CMS preview toolbar select migration**
  - Replaced the three direct `q-select` controls in the shared CMS preview toolbar with the `NtkSelect` compatibility wrapper.
  - Preserved draft/published source, locale, viewport, toolbar data attributes, and popup styling while adding audit coverage against direct `q-select` regression.
- **CMS releases module button migration**
  - Replaced the eleven direct `q-btn` controls in the CMS Releases authoring module with the rendered `DsButton` wrapper.
  - Moved release E2E action selectors from `.q-btn` to role/name based button selectors and refreshed the affected Windows release visual baselines.
- **CMS media module button migration**
  - Replaced the seven direct `q-btn` controls in the CMS Media authoring module with the rendered `DsButton` wrapper.
  - Added media-action styles for `ntk-button` icon/label rendering and moved media E2E selectors from `.q-btn` to role/name based button selectors.
- **CMS authoring ruler button migration**
  - Replaced the authoring ruler focus and grid-mode `q-btn` controls with the rendered `DsButton` wrapper while preserving focus/toggle events and compact ruler styling.
  - Added focused unit coverage for the ruler controls and refreshed the affected Windows CMS visual baselines.
- **CMS pages preview header action migration**
  - Replaced the pages preview `Open in new window` header action with the rendered `DsButton` wrapper.
  - Added focused unit coverage for the `openInWindow` action and refreshed the affected Windows visual baseline.
- **CMS authoring toolbar migration**
  - Migrated the top editor toolbar actions in Settings, Pages, and Blocks module surfaces from direct `q-btn` usage to the shared `NtkButton` wrapper.
  - Preserved the primary preview buttons and styled/destructive body actions on direct Quasar buttons for this thin slice.

### Fixed

- **Design-system verify worker startup stability**
  - Reused a single Vitest fork worker for `test:design-system` to avoid Windows worker startup timeouts inside the full `npm run verify` gate.
- **NtkSelect hint forwarding**
  - Forwarded `hint` and `aria-describedby` through the Quasar-backed `NtkSelect` wrapper so migrated select fields keep their helper text and accessible descriptions.
- **Vercel production build module resolution for CMS releases**
  - Replaced the implicit `../src/modules/cms/releases` directory import in `landing-page/CmsApp.vue` with the explicit barrel entrypoint to avoid Rollup resolution failures during `vite build` on Vercel.
  - Revalidated the landing production build locally after the import fix to keep the deployment path aligned with the Vercel build environment.
- **Blank screen in Blocks module with legacy data**
  - Added safe defaults in landing CMS blocks (`CTA`, `Hero`, `Stats`, `Features`) to prevent runtime errors when required props are missing
  - Hardened `openPageInBlocksEditor` selection access with safer optional chaining for legacy section/block payloads
- **Localized authored block presets now seed the correct locale-specific starter content**
  - Fixed authored preset updates so `pt-BR` saves the visible localized block props instead of reusing the English base props
  - Starter sections created from authored presets in `Pages` now open in `Blocks` with the expected localized content and metadata
- **Landing page hardcoded color leakage**
  - Replaced remaining direct hex color usages in `landing-page/App.vue` with configurable CSS tokens (including gradients, dark header overlays, code palette and hero metallic highlights)
  - Added runtime application of active tenant landing color tokens from CMS storage in landing mode

## [1.1.0] - 2025-12-25

### Added

- **`useBranding()` composable** - Centralized API for accessing theme branding properties
  - Access logo (letter, text, tagline)
  - Access colors (primary, secondary, etc.)
  - Access contact information (email, phone, address, whatsapp)
  - Access social media links (github, linkedin, twitter, etc.)
- **TypeScript declarations (.d.ts)** - Full type definitions now generated with `vue-tsc`
  - Automatic DTS generation in build process
  - Complete type safety for all components and composables
- **Comprehensive Documentation Suite**
  - `docs/CUSTOMIZATION.md` - 4.8KB complete customization guide
  - `templates/new-project-setup.md` - Step-by-step setup guide for new projects
  - `templates/custom-theme-template.ts` - TypeScript theme configuration template
  - `templates/custom-branding.scss` - SCSS design tokens template
- **Component Integration** - All layout/UI components now support `useBranding()`
  - `BaseLogo.vue` - Uses theme logo, colors with smart fallbacks
  - `BaseFooter.vue` - Auto-maps social platforms to Font Awesome icons
  - `BaseLandingHeader.vue` - Integrates logo, appUrl, primaryColor
  - `BaseHero.vue` - Uses appName and tagline as intelligent fallbacks

### Changed

- **Theme Configuration Interface** - Enhanced with more comprehensive structure
  - Added `name` property for theme identification
  - Expanded `colors` with `primaryDark`, `primaryLight`, `background`, `backgroundLight`, `text`, `textLight`, `textMuted`, `border`
  - Added `fonts` property with `display` and `body` font families
  - Added `gradients` property with `hero`, `primary`, and `loading` gradients
  - Added `app` property with `name`, `description`, `tagline`, `url`
  - Enhanced `contact` with `whatsapp` support
  - Enhanced `social` with additional platforms (youtube, medium, discord, slack)
- **Build System** - Split into two stages for better reliability
  - `build:js` - Generates JavaScript bundles (CJS + ESM + CSS)
  - `build:dts` - Generates TypeScript declarations with vue-tsc
- **Package Exports** - Updated to include type definitions in exports map
- **README.md** - Complete rewrite with new features and examples

### Fixed

- **BaseDatePicker.vue** - Fixed TypeScript error in locale property
  - Changed from inline object string to proper const object reference
  - Ensures type safety and proper DTS generation
- **useAsync.ts** - Fixed complex type inference issue
  - Used explicit type assertion for `Ref<T | null>` to resolve DTS generation error

### Documentation

- Updated Quick Start guide with new setup pattern
- Added `useBranding()` usage examples
- Added links to CUSTOMIZATION.md and templates
- Enhanced Features list with new capabilities
- Added "Documentation" section with guide references

### Build Artifacts

- CJS: 187.02 KB
- ESM: 181.93 KB
- CSS: 66.03 KB
- DTS: Complete type definitions

## [1.0.0] - 2025-12-24

### Added

- Initial release of NetToolsKit UI Vue
- 22 reusable Vue 3 components (form, layout, UI)
- 12 composables for reactive logic and state management
- Multi-theme support (Sentinela blue, PlaTEA teal, Dark mode)
- SCSS design system with CSS variables and utility classes
- TypeScript-first with full type definitions (manual)
- Quasar Framework integration
- Clean Architecture patterns
- Accessibility-focused (WCAG AA compliant)
- NPM package ready (CJS + ESM + CSS)

### Components

- **Form**: BaseInput, BaseSelect, BaseMultiSelect, BaseTextarea, BaseDatePicker, BaseTimePicker
- **Layout**: BaseHeader, BaseSidebar, BaseFooter, BaseSection, BaseHero, BaseLandingHeader, BaseMobileDrawer, BaseCTASection
- **UI**: BaseButton, BaseCard, BaseChip, BaseLogo, MetricCard, SectionHeader, InfoCard, BasePricingCard, BaseFeatureCard, BaseSteps

### Composables

- **Data**: useAsync, useLocalStorage, usePagination
- **Forms**: useFormRules, useBaseField
- **Services**: useNotification, useDialog, useFilter
- **UI**: useResponsive, useDebounce
- **Utils**: useTheme

### Services

- NotificationService (Quasar adapter)
- FilterService (dynamic filtering)
- FormValidationService

### Utils

- Validators (email, CPF, CNPJ, phone)
- Formatters (currency, date, phone, CPF, CNPJ)
- Async utilities (retry, timeout, sleep, debounce, throttle)

---

## Release Notes

### Version 1.1.0 Summary

This minor version adds significant new features while maintaining full backward compatibility:

1. **`useBranding()` Composable** - New centralized API for accessing all branding configuration (logo, colors, contact, social)
2. **TypeScript Declarations** - Automated DTS generation ensures complete type safety
3. **Documentation Suite** - Professional guides and templates for rapid project setup
4. **Component Enhancements** - Smart fallback patterns across all components
5. **Bug Fixes** - Resolved TypeScript issues in BaseDatePicker and useAsync

**Upgrade Path**: Direct upgrade from 1.0.0 to 1.1.0 with no breaking changes. Existing code continues to work. New features are opt-in.

**Recommended Actions**:
1. Update import: `import { useBranding } from '@nettoolskit/ui-vue'`
2. Review `docs/CUSTOMIZATION.md` for new capabilities
3. Use templates for new projects: `templates/new-project-setup.md`