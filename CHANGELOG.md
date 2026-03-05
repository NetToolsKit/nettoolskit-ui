# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2026-03-01

### Added

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