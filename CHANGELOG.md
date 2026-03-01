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

### Fixed

- **Blank screen in Blocks module with legacy data**
  - Added safe defaults in landing CMS blocks (`CTA`, `Hero`, `Stats`, `Features`) to prevent runtime errors when required props are missing
  - Hardened `openPageInBlocksEditor` selection access with safer optional chaining for legacy section/block payloads

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