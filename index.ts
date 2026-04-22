/**
 * NetToolsKit UI Vue - Single Entry Point
 *
 * Single entry point for the whole package.
 *
 * No intermediate subfolder index files are required; everything is exported
 * directly from its source module to keep the public API explicit.
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
export { default as BaseInput } from './src/components/form/BaseInput.vue'
export { default as BaseSelect } from './src/components/form/BaseSelect.vue'
export { default as BaseMultiSelect } from './src/components/form/BaseMultiSelect.vue'
export { default as BaseTextarea } from './src/components/form/BaseTextarea.vue'
export { default as BaseDatePicker } from './src/components/form/BaseDatePicker.vue'
export { default as BaseTimePicker } from './src/components/form/BaseTimePicker.vue'

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
export { default as NtkStatsSection } from './src/components/layout/NtkStatsSection.vue'
export { default as NtkServiceGrid } from './src/components/layout/NtkServiceGrid.vue'
export { default as NtkTechStack } from './src/components/layout/NtkTechStack.vue'
export { default as NtkContactSection } from './src/components/layout/NtkContactSection.vue'
export { default as NtkLandingComposer } from './src/components/layout/NtkLandingComposer.vue'
export { default as NtkAppShell } from './src/components/layout/NtkAppShell.vue'
export { default as BaseHeader } from './src/components/layout/BaseHeader.vue'
export { default as BaseSidebar } from './src/components/layout/BaseSidebar.vue'
export { default as BaseFooter } from './src/components/layout/BaseFooter.vue'
export { default as BaseSection } from './src/components/layout/BaseSection.vue'
export { default as BaseHero } from './src/components/layout/BaseHero.vue'
export * from './src/components/layout/app-shell.types'
export * from './src/components/layout/app-shell.config'
export * from './src/components/layout/app-shell.theme'

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
export { default as NtkDataTable } from './src/components/ui/NtkDataTable.vue'
export { default as NtkStatCard } from './src/components/ui/NtkStatCard.vue'
export { default as NtkTestimonialCard } from './src/components/ui/NtkTestimonialCard.vue'
export { default as BaseButton } from './src/components/ui/BaseButton.vue'
export { default as BaseCard } from './src/components/ui/BaseCard.vue'
export { default as BaseChip } from './src/components/ui/BaseChip.vue'
export { default as BaseLogo } from './src/components/ui/BaseLogo.vue'
export { default as BaseFeatureCard } from './src/components/ui/BaseFeatureCard.vue'
export { default as BasePricingCard } from './src/components/ui/BasePricingCard.vue'
export { default as BaseCreditCard } from './src/components/ui/BaseCreditCard.vue'
export { default as BaseSteps } from './src/components/ui/BaseSteps.vue'
export { default as MetricCard } from './src/components/ui/MetricCard.vue'

// ============================================================================
// COMPOSABLES - Forms
// ============================================================================
export * from './src/composables/forms/useFormRules'
export * from './src/composables/forms/useNtkField'
export * from './src/composables/forms/useBaseField'

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
// Legacy compatibility export. Prefer the preset-driven runtime theme model,
// CSS custom properties, and Quasar Dark Plugin sync for new template work.
export * from './src/config/theme/theme.plugin'

// ============================================================================
// CONFIG - Brand
// ============================================================================
export * from './src/config/brand/identity.config'
export * from './src/config/brand/navigation.config'
export * from './src/config/brand/content.config'
export * from './src/config/landing/landing-page.config'

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

// ============================================================================
// MODULES - CMS
// ============================================================================
export * from './src/modules/cms'

// ============================================================================
// WHITELABEL - Reference Samples
// ============================================================================
export * from './src/whitelabel'

// ============================================================================
// TEMPLATES - Visual Template Catalog
// ============================================================================
export * from './src/templates'
