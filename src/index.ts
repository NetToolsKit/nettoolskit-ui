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
// OPTIONAL PEER SURFACE
// ============================================================================
// Modules that statically import the optional peers stay OUT of this entry so
// the package resolves without them (see MIGRATION.md):
//   '@nettoolskit/ui/quasar' -> QuasarNotificationAdapter, useDialogActions,
//                               useResponsive, installQuasarServices()
//   '@nettoolskit/ui/router' -> useFilters

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
export * from './composables/ui/useTheme'
export * from './composables/ui/useColorScheme'
export * from './composables/ui/useBranding'
export * from './composables/ui/useToast'

// ============================================================================
// COMPOSABLES - Data
// ============================================================================
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
export * from './config/theme/theme.config'
// Legacy compatibility export. Prefer the preset-driven runtime theme model,
// CSS custom properties, and Quasar Dark Plugin sync for new template work.
export * from './config/theme/theme.plugin'

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
export * from './config/colors/palette.config'
export * from './config/colors/semantic.config'
// Legacy compatibility export. Prefer preset/theme CSS custom properties for
// runtime white-label work so tokens can be swapped without plugin writes.
export * from './config/colors/theme-mode.config'