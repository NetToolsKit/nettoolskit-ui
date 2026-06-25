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
 * } from 'nettoolskit'
 * ```
 */

// ============================================================================
// ADAPTERS
// ============================================================================
export * from './src/adapters/QuasarNotificationAdapter'

// ============================================================================
// DESIGN SYSTEM (Ds* components, tokens, recipes, schema, install plugin)
// ============================================================================
export * from './src/design-system'

// ============================================================================
// COMPOSABLES - Forms
// ============================================================================
export * from './src/composables/forms/useFormRules'

// ============================================================================
// COMPOSABLES - UI
// ============================================================================
export * from './src/composables/ui/useDialog'
export * from './src/composables/ui/useDialogActions'
export * from './src/composables/ui/useResponsive'
export * from './src/composables/ui/useTheme'
export * from './src/composables/ui/useColorScheme'
export * from './src/composables/ui/useBranding'
export * from './src/composables/ui/useToast'

// ============================================================================
// COMPOSABLES - Data
// ============================================================================
export * from './src/composables/data/useFilters'
export * from './src/composables/data/useTableColumns'

// ============================================================================
// COMPOSABLES - Utils
// ============================================================================
export * from './src/composables/utils/useDebounce'
export * from './src/composables/utils/useAsync'

// ============================================================================
// COMPOSABLES - Services
// ============================================================================
export * from './src/composables/services/useNotification'

// ============================================================================
// SERVICES
// ============================================================================
export * from './src/services/NotificationService'
export * from './src/services/FilterService'
export * from './src/services/FormValidationService'

// ============================================================================
// UTILS - Validators
// ============================================================================
export * from './src/utils/validators'

// ============================================================================
// UTILS - Async
// ============================================================================
export * from './src/utils/async'

// ============================================================================
// CONFIG - Theme
// ============================================================================
export * from './src/config/theme/theme.config'
// Legacy compatibility export. Prefer the preset-driven runtime theme model,
// CSS custom properties, and Quasar Dark Plugin sync for new template work.
export * from './src/config/theme/theme.plugin'

// ============================================================================
// CONFIG - Brand
// ============================================================================
export * from './src/config/brand/identity.config'
export * from './src/config/brand/navigation.config'
export * from './src/config/brand/content.config'

// ============================================================================
// CONFIG - Presets
// ============================================================================
export * from './src/config/presets'

// ============================================================================
// CONFIG - Colors
// ============================================================================
export * from './src/config/colors/palette.config'
export * from './src/config/colors/semantic.config'
// Legacy compatibility export. Prefer preset/theme CSS custom properties for
// runtime white-label work so tokens can be swapped without plugin writes.
export * from './src/config/colors/theme-mode.config'