/**
 * Configuration Index
 * 
 * Central export point for all configuration modules.
 * Organized by SOLID principles with clear separation of concerns.
 * 
 * ## Organization
 * - **colors/**: Color palettes, semantic colors, theme modes
 * - **visual/**: Typography, effects (gradients/shadows), spacing
 * - **layout/**: Structure, responsive behavior
 * - **behavior/**: Notifications, animations
 * - **brand/**: Identity, navigation, content
 * - **presets/**: Complete brand presets (aggregates all configs)
 * 
 * ## Quick Start
 * ```typescript
 * // Option 1: Use complete preset (recommended)
 * import { applyNettoolskitPreset } from '@/config/presets/nettoolskit.preset'
 * applyNettoolskitPreset('light')
 * 
 * // Option 2: Import individual configs
 * import { nettoolskitPalette } from '@/config/colors/palette.config'
 * import { nettoolskitTypography } from '@/config/visual/typography.config'
 * ```
 * 
 * @module config
 */

// ============================
// Colors
// ============================

/**
 * Color Palettes
 * Base brand colors (50-900 scales)
 */
export {
  type ColorScale,
  type BrandPalette,
  type PaletteName,
  nettoolskitPalette,
  palettes,
  getPalette,
} from './colors/palette.config'

/**
 * Semantic Colors
 * Purpose-driven colors (success, warning, error, info)
 */
export {
  type SemanticColors,
  semanticColors,
  applySemanticColors,
  setSemanticColors,
  resetSemanticColors,
} from './colors/semantic.config'

/**
 * Theme Mode Colors
 * Light/dark theme-dependent colors
 */
export {
  type ThemeColorPalette,
  themeColors,
  lightThemeColors,
  darkThemeColors,
  applyThemeColors,
  getCurrentThemeColors,
} from './colors/theme-mode.config'

// ============================
// Visual
// ============================

/**
 * Typography
 * Fonts, sizes, weights, line heights, letter spacing
 */
export {
  type FontFamilies,
  type FontSizes,
  type FontWeights,
  type LineHeights,
  type LetterSpacing,
  type TypographyConfig,
  type TypographyName,
  defaultFonts,
  defaultSizes,
  defaultWeights,
  defaultLineHeights,
  defaultLetterSpacing,
  nettoolskitTypography,
  typographies,
  getTypography,
  applyTypography,
} from './visual/typography.config'

/**
 * Effects
 * Gradients, shadows, border radius, blur
 */
export {
  type Gradients,
  type Shadows,
  type BorderRadius,
  type BlurEffects,
  type EffectsConfig,
  type EffectsName,
  defaultShadows,
  defaultRadius,
  defaultBlur,
  nettoolskitEffects,
  effects,
  getEffects,
  applyEffects,
} from './visual/effects.config'

/**
 * Spacing
 * Spacing scale, padding, margin, gaps
 */
export {
  type SpacingScale,
  type ComponentSpacing,
  type SpacingConfig,
  type SpacingConfigName,
  fourPxScale,
  eightPxScale,
  defaultSpacing,
  accessibleSpacing,
  compactSpacing,
  spacingConfigs,
  getSpacingConfig,
  applySpacing,
  getSpacingValue,
} from './visual/spacing.config'

// ============================
// Layout
// ============================

/**
 * Structure
 * Header, sidebar, footer, container
 */
export {
  type HeaderConfig,
  type SidebarConfig,
  type FooterConfig,
  type ContainerConfig,
  type MobileConfig,
  type LayoutConfig,
  type LayoutPreset,
  defaultLayoutConfig,
  stickyHeaderLayout,
  dashboardLayout,
  layoutPresets,
} from './layout/structure.config'

/**
 * Responsive
 * Breakpoints, device behavior
 */
export {
  type Breakpoints,
  type TabletConfig,
  type ResponsiveConfig,
  type ResponsiveConfigName,
  materialBreakpoints,
  bootstrapBreakpoints,
  tailwindBreakpoints,
  defaultResponsive,
  accessibleResponsive,
  compactResponsive,
  responsiveConfigs,
  getResponsiveConfig,
  getCurrentBreakpoint,
  isMobileDevice,
  isTabletDevice,
  isDesktopDevice,
  getContainerMaxWidth,
} from './layout/responsive.config'

// ============================
// Behavior
// ============================

/**
 * Notifications
 * Toast, popup, dialog, banner, snackbar
 */
export {
  type NotificationPosition,
  type PositionPreset,
  type NotificationConfig,
  type PopupConfig,
  type DialogConfig,
  type ToastConfig,
  type SnackbarConfig,
  type BannerConfig,
  type AlertConfig,
  type LoadingConfig,
  type NotificationTypeStyle,
  type NotificationStyles,
  notificationConfig,
  popupConfig,
  dialogConfig,
  toastConfig,
  snackbarConfig,
  bannerConfig,
  alertConfig,
  loadingConfig,
  lightNotificationStyles,
  darkNotificationStyles,
  getNotificationStyles,
  applyNotificationConfig,
} from './behavior/notification.config'

// ============================
// Brand
// ============================

/**
 * Identity
 * Brand name, logo, tagline, description
 */
export {
  type LogoConfig,
  type BrandIdentity,
  type BrandName,
  nettoolskitIdentity,
  identities,
  getBrandIdentity,
  getCopyrightNotice,
} from './brand/identity.config'

/**
 * Navigation
 * Menus, links, CTAs
 */
export {
  type NavLink,
  type CTAButton,
  type BrandNavigation,
  type NavigationName,
  nettoolskitNavigation,
  navigations,
  getNavigation,
  flattenNavLinks,
} from './brand/navigation.config'

/**
 * Content
 * Footer, social links, contact
 */
export {
  type SocialLink,
  type ContactInfo,
  type FooterSection,
  type BrandContent,
  type ContentName,
  nettoolskitContent,
  contents,
  getContent,
  formatPhone,
  getWhatsAppLink,
  getSocialLinkByPlatform,
} from './brand/content.config'

// ============================
// Legacy Exports (Deprecated - for backward compatibility)
// ============================
// These exports are deprecated and will be removed in future versions.
// Please use the new organized exports above.
