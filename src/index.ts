/**
 * NetToolsKit UI Vue - Single Entry Point
 *
 * Single entry point for the whole package.
 *
 * The public visual surface is the governed design system (`Ds*` components,
 * tokens, recipes, schema). The legacy `Ntk*`/`Base*` component surface has been
 * removed — see `MIGRATION.md` for the `Ntk*` → `Ds*` mapping.
 *
 * @example
 * ```typescript
 * import {
 *   // Install plugin
 *   createNetToolsKitUI,
 *
 *   // Components
 *   DsButton, DsInput, DsTable, DsForm, DsCrudPage,
 *
 *   // Schema-driven front creation
 *   defineForm, defineResource,
 *
 *   // Composables
 *   useNotification, useFormRules, useAsync,
 *
 *   // Services
 *   NotificationService, FilterService,
 *
 *   // Utils
 *   validateEmail, validateCPF, retry, timeout
 * } from '@nettoolskit/ui'
 * ```
 */

// ============================================================================
// ADAPTERS
// ============================================================================
export * from './adapters/QuasarNotificationAdapter'

// ============================================================================
// DESIGN SYSTEM (Ds* components, tokens, recipes, schema, install plugin)
// ============================================================================
export * from './design-system'

// ============================================================================
// COMPOSABLES - Forms
// ============================================================================
export * from './composables/forms/useFormRules'

// ============================================================================
// COMPOSABLES - UI
// ============================================================================
export * from './composables/ui/useDialog'
export * from './composables/ui/useDialogActions'
export * from './composables/ui/useResponsive'
export * from './composables/ui/useTheme'
export * from './composables/ui/useColorScheme'
export * from './composables/ui/useBranding'
export * from './composables/ui/useToast'

// ============================================================================
// COMPOSABLES - Data
// ============================================================================
export * from './composables/data/useFilters'
export * from './composables/data/useTableColumns'

// ============================================================================
// COMPOSABLES - Utils
// ============================================================================
export * from './composables/utils/useDebounce'
export * from './composables/utils/useAsync'

// ============================================================================
// COMPOSABLES - Services
// ============================================================================
export * from './composables/services/useNotification'

// ============================================================================
// SERVICES
// ============================================================================
export * from './services/NotificationService'
export * from './services/FilterService'
export * from './design-system/core/validators/FormValidationService'

// ============================================================================
// UTILS - Validators
// ============================================================================
export * from './utils/validators'

// ============================================================================
// UTILS - Async
// ============================================================================
export * from './utils/async'

// ============================================================================
// CONFIG - Theme
// ============================================================================
// The runtime theme model is preset-driven: named palettes (useThemeSwitcher),
// light/dark scheme (useColorScheme) and CSS custom properties. The legacy
// NtkThemePlugin/useNtkTheme surface was removed (see MIGRATION.md).
export * from './config/theme/theme.config'

// ============================================================================
// CONFIG - Brand
// ============================================================================
export * from './config/brand/identity.config'
export * from './config/brand/navigation.config'
export * from './config/brand/content.config'

// ============================================================================
// CONFIG - Presets
// ============================================================================
export * from './config/presets'

// ============================================================================
// CONFIG - Colors
// ============================================================================
// theme-mode.config stays internal (consumed by the presets); white-label
// runtime work uses preset/theme CSS custom properties, not plugin writes.
export * from './config/colors/palette.config'
export * from './config/colors/semantic.config'