# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2026-03-01

### Added

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

### Fixed

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