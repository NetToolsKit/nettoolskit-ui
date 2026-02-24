/**
 * NetToolsKit UI Vue - Single Entry Point
 *
 * ⭐ ÚNICO PONTO DE ENTRADA para todo o módulo
 *
 * Zero repetição: Importa tudo diretamente de cada arquivo,
 * sem index.ts intermediários nas subpastas.
 *
 * @example
 * ```typescript
 * import {
 *   // Components
 *   NtkButton, NtkInput, NtkMetricCard,
 *
 *   // Composables
 *   useNotification, useFormRules, useAsync,
 *
 *   // Services
 *   NotificationService, FilterService,
 *
 *   // Utils
 *   validateEmail, validateCPF, retry, timeout
 * } from '@nettoolskit/ui-vue'
 * ```
 */

// ============================================================================
// ADAPTERS
// ============================================================================
export * from './src/adapters/QuasarNotificationAdapter'

// ============================================================================
// COMPONENTS - Form
// ============================================================================
export { default as NtkInput } from './src/components/form/NtkInput.vue'
export { default as NtkSelect } from './src/components/form/NtkSelect.vue'
export { default as NtkMultiSelect } from './src/components/form/NtkMultiSelect.vue'
export { default as NtkTextarea } from './src/components/form/NtkTextarea.vue'
export { default as NtkDatePicker } from './src/components/form/NtkDatePicker.vue'
export { default as NtkTimePicker } from './src/components/form/NtkTimePicker.vue'

// ============================================================================
// COMPONENTS - Layout
// ============================================================================
export { default as NtkHeader } from './src/components/layout/NtkHeader.vue'
export { default as NtkSidebar } from './src/components/layout/NtkSidebar.vue'
export { default as NtkFooter } from './src/components/layout/NtkFooter.vue'
export { default as NtkSection } from './src/components/layout/NtkSection.vue'
export { default as NtkHero } from './src/components/layout/NtkHero.vue'
export { default as NtkLandingHeader } from './src/components/layout/NtkLandingHeader.vue'
export { default as NtkMobileDrawer } from './src/components/layout/NtkMobileDrawer.vue'
export { default as NtkCTASection } from './src/components/layout/NtkCTASection.vue'

// ============================================================================
// COMPONENTS - UI
// ============================================================================
export { default as NtkButton } from './src/components/ui/NtkButton.vue'
export { default as NtkCard } from './src/components/ui/NtkCard.vue'
export { default as NtkChip } from './src/components/ui/NtkChip.vue'
export { default as NtkMetricCard } from './src/components/ui/NtkMetricCard.vue'
export { default as NtkSectionHeader } from './src/components/ui/NtkSectionHeader.vue'
export { default as NtkInfoCard } from './src/components/ui/NtkInfoCard.vue'
export { default as NtkPricingCard } from './src/components/ui/NtkPricingCard.vue'
export { default as NtkLogo } from './src/components/ui/NtkLogo.vue'
export { default as NtkFeatureCard } from './src/components/ui/NtkFeatureCard.vue'
export { default as NtkSteps } from './src/components/ui/NtkSteps.vue'
export { default as NtkCreditCard } from './src/components/ui/NtkCreditCard.vue'
export { default as NtkStatCard } from './src/components/ui/NtkStatCard.vue'
export { default as NtkTestimonialCard } from './src/components/ui/NtkTestimonialCard.vue'

// ============================================================================
// COMPOSABLES - Forms
// ============================================================================
export * from './src/composables/forms/useFormRules'
export * from './src/composables/forms/useNtkField'

// ============================================================================
// COMPOSABLES - UI
// ============================================================================
export * from './src/composables/ui/useDialog'
export * from './src/composables/ui/useDialogActions'
export * from './src/composables/ui/useResponsive'
export * from './src/composables/ui/useTheme'
export * from './src/composables/ui/useBranding'

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
export * from './src/config/theme/theme.plugin'

// ============================================================================
// CONFIG - Brand
// ============================================================================
export * from './src/config/brand/identity.config'
export * from './src/config/brand/navigation.config'
export * from './src/config/brand/content.config'

// ============================================================================
// CONFIG - Colors
// ============================================================================
export * from './src/config/colors/palette.config'
export * from './src/config/colors/semantic.config'
export * from './src/config/colors/theme-mode.config'
