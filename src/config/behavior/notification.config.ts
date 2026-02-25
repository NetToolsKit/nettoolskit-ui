/**
 * Notification & UI Behavior Configuration
 * 
 * This module provides comprehensive configuration for all UI notification systems
 * including toasts, popups, dialogs, snackbars, banners, alerts, and loading overlays.
 * 
 * ## Purpose
 * Centralizes all UI behavior configurations that are independent of theme (light/dark).
 * Controls animations, positioning, accessibility features, and user interactions
 * across all notification components.
 * 
 * ## Architecture
 * Separated from theme colors to allow:
 * - Independent behavior configuration
 * - Consistent UX across different themes
 * - Easy customization without affecting visual themes
 * - Reusability across different projects
 * 
 * ## Notification Types
 * 1. **Notifications**: Toast-style messages that appear temporarily
 * 2. **Popups**: Modal overlays that require user interaction
 * 3. **Dialogs**: Confirmation dialogs with action buttons
 * 4. **Toasts**: Lightweight notifications with icons
 * 5. **Snackbars**: Material Design-style bottom messages
 * 6. **Banners**: Full-width informational strips
 * 7. **Alerts**: Inline contextual messages
 * 8. **Loading**: Full-screen loading indicators
 * 
 * ## Usage
 * ```typescript
 * import { notificationConfig, dialogConfig, toastConfig } from '@/config'
 * 
 * // Use default configurations
 * showNotification({ type: 'success', message: 'Saved!' })
 * 
 * // Or override specific settings
 * notificationConfig.defaultDuration = 3000
 * dialogConfig.confirmText = 'Yes'
 * ```
 * 
 * @module notification.config
 */

// ============================
// Position & Placement Types
// ============================

/**
 * Notification Position Interface
 * 
 * Defines the position offset from edges of the viewport.
 * All properties are optional CSS values (px, rem, %, vh, vw).
 * 
 * @example
 * ```typescript
 * const position: NotificationPosition = {
 *   top: '20px',
 *   right: '20px'
 * }
 * ```
 */
export interface NotificationPosition {
  /** Distance from top edge (e.g., '16px', '2rem', '10%') */
  top?: string
  
  /** Distance from bottom edge (e.g., '16px', '2rem', '10%') */
  bottom?: string
  
  /** Distance from left edge (e.g., '16px', '2rem', '10%') */
  left?: string
  
  /** Distance from right edge (e.g., '16px', '2rem', '10%') */
  right?: string
}

/**
 * Position Preset Type
 * 
 * Predefined position combinations for quick configuration.
 * Eliminates the need to specify exact pixel values.
 * 
 * @example
 * ```typescript
 * const toast: ToastConfig = {
 *   position: 'top-right' // Simple preset
 * }
 * ```
 */
export type PositionPreset = 
  | 'top-left'      // Top left corner
  | 'top-center'    // Top center (horizontally centered)
  | 'top-right'     // Top right corner (default for toasts)
  | 'bottom-left'   // Bottom left corner
  | 'bottom-center' // Bottom center (horizontally centered, good for snackbars)
  | 'bottom-right'  // Bottom right corner
  | 'center'        // Center of screen (useful for modals)

// ============================
// Notification Configuration
// ============================

/**
 * Notification Configuration Interface
 * 
 * Controls behavior, appearance, and timing for toast-style notifications.
 * These are temporary messages that appear on screen to inform users of actions,
 * status changes, or important information.
 * 
 * ## Use Cases
 * - Form submission confirmations
 * - Error messages
 * - Status updates
 * - System messages
 * - Background process completion
 * 
 * @example
 * ```typescript
 * import { notificationConfig } from '@/config'
 * 
 * // Customize globally
 * notificationConfig.defaultDuration = 4000
 * notificationConfig.maxVisible = 3
 * notificationConfig.position = { top: '80px', right: '20px' }
 * ```
 */
export interface NotificationConfig {
  // ========================================
  // Duration Settings (milliseconds)
  // ========================================
  
  /**
   * Default duration for all notification types
   * @default 5000 (5 seconds)
   */
  defaultDuration: number
  
  /**
   * Duration for success notifications
   * Usually shorter since they confirm expected outcomes
   * @default 5000 (5 seconds)
   */
  successDuration: number
  
  /**
   * Duration for warning notifications
   * Longer to ensure users notice important cautions
   * @default 7000 (7 seconds)
   */
  warningDuration: number
  
  /**
   * Duration for error notifications
   * Longest duration as errors need user attention
   * @default 8000 (8 seconds)
   */
  errorDuration: number
  
  /**
   * Duration for informational notifications
   * @default 5000 (5 seconds)
   */
  infoDuration: number
  
  /**
   * Duration for loading notifications
   * Set to null for infinite duration (must be closed programmatically)
   * @default null (infinite)
   */
  loadingDuration: number | null
  
  // ========================================
  // Position
  // ========================================
  
  /**
   * Position offset from viewport edges
   * Defines where notifications will appear
   * @default { top: '16px', right: '16px' }
   */
  position: NotificationPosition
  
  // ========================================
  // Behavior Settings
  // ========================================
  
  /**
   * Whether clicking on notification closes it
   * @default true
   */
  closeOnClick: boolean
  
  /**
   * Whether hovering pauses the auto-close timer
   * Useful for reading longer messages
   * @default true
   */
  pauseOnHover: boolean
  
  /**
   * Whether to show a progress bar indicating time remaining
   * @default true
   */
  showProgressBar: boolean
  
  /**
   * Whether newest notifications appear on top of stack
   * false = oldest on top (queue-like)
   * @default true
   */
  newestOnTop: boolean
  
  /**
   * Maximum number of notifications visible simultaneously
   * Older notifications are hidden when limit is exceeded
   * @default 5
   */
  maxVisible: number
  
  /**
   * Vertical spacing between stacked notifications (in pixels)
   * @default 12
   */
  stackSpacing: number
  
  // ========================================
  // Animation Settings
  // ========================================
  
  /**
   * Duration of show/hide animations in milliseconds
   * @default 300
   */
  animationDuration: number
  
  /**
   * CSS easing function for animations
   * @default 'cubic-bezier(0.4, 0, 0.2, 1)' (smooth ease-in-out)
   */
  animationEasing: string
  
  /**
   * Animation type when notification appears
   * - fade: Simple opacity transition
   * - slide: Slide in from edge
   * - bounce: Bouncy entrance
   * - zoom: Scale up from center
   * @default 'slide'
   */
  showAnimation: 'fade' | 'slide' | 'bounce' | 'zoom'
  
  /**
   * Animation type when notification disappears
   * @default 'slide'
   */
  hideAnimation: 'fade' | 'slide' | 'bounce' | 'zoom'
  
  // ========================================
  // Appearance Settings
  // ========================================
  
  /**
   * Border radius for rounded corners
   * @default '8px'
   */
  borderRadius: string
  
  /**
   * Box shadow for depth effect
   * @default '0 8px 16px rgba(0, 0, 0, 0.15)'
   */
  shadow: string
  
  /**
   * Backdrop blur effect (experimental in some browsers)
   * @default '0px' (no blur)
   */
  backdropBlur: string
  
  /**
   * Minimum width of notification container
   * @default '320px'
   */
  minWidth: string
  
  /**
   * Maximum width of notification container
   * @default '480px'
   */
  maxWidth: string
  
  // ========================================
  // Accessibility
  // ========================================
  
  /**
   * ARIA live region politeness level
   * - polite: Wait for current task to complete before announcing
   * - assertive: Interrupt and announce immediately
   * - off: Don't announce
   * @default 'polite'
   */
  ariaLive: 'polite' | 'assertive' | 'off'
  
  /**
   * ARIA role for semantic meaning
   * @default 'alert'
   */
  role: string
}

// ============================
// Popup Configuration
// ============================

export interface PopupConfig {
  // Overlay
  overlayOpacity: number
  overlayColor: string
  overlayBlur: string
  
  // Behavior
  closeOnOverlayClick: boolean
  closeOnEscape: boolean
  trapFocus: boolean
  preventScroll: boolean
  returnFocus: boolean
  
  // Animation
  animationDuration: number
  animationEasing: string
  showAnimation: 'fade' | 'scale' | 'slide-up' | 'slide-down'
  hideAnimation: 'fade' | 'scale' | 'slide-up' | 'slide-down'
  
  // Appearance
  borderRadius: string
  shadow: string
  minWidth: string
  maxWidth: string
  maxHeight: string
  padding: string
  
  // Accessibility
  role: 'dialog' | 'alertdialog' | 'alert'
  ariaModal: boolean
}

// ============================
// Dialog Configuration
// ============================

export interface DialogConfig {
  // Button texts
  confirmText: string
  cancelText: string
  closeText: string
  
  // Button variants
  confirmVariant: 'primary' | 'success' | 'danger' | 'warning'
  cancelVariant: 'secondary' | 'outline' | 'ghost'
  
  // Behavior
  closeOnConfirm: boolean
  closeOnCancel: boolean
  persistent: boolean
  closeButton: boolean
  
  // Icons
  showIcon: boolean
  iconSize: string
  iconPosition: 'top' | 'left'
  
  // Appearance
  titleSize: string
  messageSize: string
  spacing: string
  
  // Accessibility
  focusConfirm: boolean
  role: 'dialog' | 'alertdialog'
  ariaLabelledBy: string
  ariaDescribedBy: string
}

// ============================
// Toast Configuration
// ============================

export interface ToastConfig {
  // Position
  position: PositionPreset
  offset: NotificationPosition
  
  // Appearance
  minWidth: string
  maxWidth: string
  borderRadius: string
  shadow: string
  padding: string
  
  // Behavior
  duration: number
  closeButton: boolean
  icon: boolean
  pauseOnHover: boolean
  
  // Animation
  animation: 'fade' | 'slide' | 'bounce' | 'zoom'
  animationDuration: number
  animationEasing: string
  
  // Stack
  stackable: boolean
  maxStack: number
  stackSpacing: number
}

// ============================
// Snackbar Configuration
// ============================

export interface SnackbarConfig {
  // Position
  position: 'bottom-left' | 'bottom-center' | 'bottom-right'
  offset: NotificationPosition
  
  // Appearance
  minWidth: string
  maxWidth: string
  borderRadius: string
  shadow: string
  padding: string
  textAlign: 'left' | 'center' | 'right'
  
  // Behavior
  duration: number
  action: boolean
  actionText: string
  closeOnAction: boolean
  
  // Animation
  animation: 'slide' | 'fade'
  animationDuration: number
  
  // Accessibility
  ariaLive: 'polite' | 'assertive'
  role: 'status' | 'alert'
}

// ============================
// Banner Configuration
// ============================

export interface BannerConfig {
  // Position
  position: 'top' | 'bottom'
  sticky: boolean
  
  // Appearance
  padding: string
  shadow: string
  borderWidth: string
  
  // Behavior
  dismissible: boolean
  persistent: boolean
  showIcon: boolean
  
  // Animation
  animationDuration: number
  showAnimation: 'slide-down' | 'fade'
  hideAnimation: 'slide-up' | 'fade'
  
  // Accessibility
  role: 'banner' | 'alert' | 'status'
  ariaLive: 'polite' | 'assertive'
}

// ============================
// Alert Configuration
// ============================

export interface AlertConfig {
  // Appearance
  borderRadius: string
  borderWidth: string
  padding: string
  iconSize: string
  
  // Behavior
  dismissible: boolean
  showIcon: boolean
  variant: 'filled' | 'outlined' | 'soft'
  
  // Accessibility
  role: 'alert' | 'status'
  ariaLive: 'polite' | 'assertive' | 'off'
}

// ============================
// Loading Configuration
// ============================

export interface LoadingConfig {
  // Overlay
  overlayOpacity: number
  overlayColor: string
  overlayBlur: string
  
  // Spinner
  spinnerSize: string
  spinnerColor: string
  spinnerThickness: string
  
  // Message
  showMessage: boolean
  messagePosition: 'top' | 'bottom'
  messageSpacing: string
  
  // Behavior
  preventScroll: boolean
  closeOnClick: boolean
  timeout: number | null // null = no timeout
  
  // Animation
  animationDuration: number
  spinnerAnimation: 'spin' | 'pulse' | 'bounce'
}

// ============================
// Default Configuration Objects
// ============================

/**
 * Default Notification Configuration
 * 
 * Pre-configured settings optimized for general use cases.
 * Provides sensible defaults for toast-style notifications.
 * 
 * ## Customization
 * Override any property to match your application's needs:
 * ```typescript
 * import { notificationConfig } from '@/config'
 * 
 * // Shorter durations for faster-paced apps
 * notificationConfig.defaultDuration = 3000
 * notificationConfig.successDuration = 2000
 * 
 * // Different positioning
 * notificationConfig.position = { top: '80px', right: '20px' }
 * 
 * // More notifications visible at once
 * notificationConfig.maxVisible = 10
 * ```
 * 
 * @see {@link NotificationConfig} For detailed property documentation
 */
export const notificationConfig: NotificationConfig = {
  // Duration (milliseconds)
  defaultDuration: 5000,
  successDuration: 5000,
  warningDuration: 7000,
  errorDuration: 8000,
  infoDuration: 5000,
  loadingDuration: null, // Infinite until closed
  
  // Position
  position: {
    top: '16px',
    right: '16px',
  },
  
  // Behavior
  closeOnClick: true,
  pauseOnHover: true,
  showProgressBar: true,
  newestOnTop: true,
  maxVisible: 5,
  stackSpacing: 12,
  
  // Animation
  animationDuration: 300,
  animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  showAnimation: 'slide',
  hideAnimation: 'slide',
  
  // Appearance
  borderRadius: '8px',
  shadow: 'var(--ntk-shadow-card-hover)',
  backdropBlur: '0px',
  minWidth: '320px',
  maxWidth: '480px',
  
  // Accessibility
  ariaLive: 'polite',
  role: 'alert',
}

export const popupConfig: PopupConfig = {
  // Overlay
  overlayOpacity: 0.5,
  overlayColor: 'var(--ntk-text-primary)',
  overlayBlur: '4px',
  
  // Behavior
  closeOnOverlayClick: true,
  closeOnEscape: true,
  trapFocus: true,
  preventScroll: true,
  returnFocus: true,
  
  // Animation
  animationDuration: 300,
  animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  showAnimation: 'fade',
  hideAnimation: 'fade',
  
  // Appearance
  borderRadius: '12px',
  shadow: 'var(--ntk-shadow-popup)',
  minWidth: '320px',
  maxWidth: '640px',
  maxHeight: '90vh',
  padding: '24px',
  
  // Accessibility
  role: 'dialog',
  ariaModal: true,
}

export const dialogConfig: DialogConfig = {
  // Button texts
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  closeText: 'Close',
  
  // Button variants
  confirmVariant: 'primary',
  cancelVariant: 'secondary',
  
  // Behavior
  closeOnConfirm: true,
  closeOnCancel: true,
  persistent: false,
  closeButton: true,
  
  // Icons
  showIcon: true,
  iconSize: '48px',
  iconPosition: 'top',
  
  // Appearance
  titleSize: '24px',
  messageSize: '16px',
  spacing: '16px',
  
  // Accessibility
  focusConfirm: true,
  role: 'alertdialog',
  ariaLabelledBy: 'dialog-title',
  ariaDescribedBy: 'dialog-description',
}

export const toastConfig: ToastConfig = {
  // Position
  position: 'top-right',
  offset: {
    top: '16px',
    right: '16px',
  },
  
  // Appearance
  minWidth: '300px',
  maxWidth: '420px',
  borderRadius: '8px',
  shadow: 'var(--ntk-shadow-popup)',
  padding: '12px 16px',
  
  // Behavior
  duration: 5000,
  closeButton: true,
  icon: true,
  pauseOnHover: true,
  
  // Animation
  animation: 'slide',
  animationDuration: 300,
  animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  
  // Stack
  stackable: true,
  maxStack: 5,
  stackSpacing: 12,
}

export const snackbarConfig: SnackbarConfig = {
  // Position
  position: 'bottom-center',
  offset: {
    bottom: '16px',
    left: '16px',
    right: '16px',
  },
  
  // Appearance
  minWidth: '320px',
  maxWidth: '640px',
  borderRadius: '4px',
  shadow: 'var(--ntk-shadow-card)',
  padding: '14px 16px',
  textAlign: 'left',
  
  // Behavior
  duration: 4000,
  action: true,
  actionText: 'Undo',
  closeOnAction: true,
  
  // Animation
  animation: 'slide',
  animationDuration: 250,
  
  // Accessibility
  ariaLive: 'polite',
  role: 'status',
}

export const bannerConfig: BannerConfig = {
  // Position
  position: 'top',
  sticky: true,
  
  // Appearance
  padding: '12px 16px',
  shadow: 'var(--ntk-shadow-md)',
  borderWidth: '0 0 1px 0',
  
  // Behavior
  dismissible: true,
  persistent: false,
  showIcon: true,
  
  // Animation
  animationDuration: 300,
  showAnimation: 'slide-down',
  hideAnimation: 'slide-up',
  
  // Accessibility
  role: 'banner',
  ariaLive: 'polite',
}

export const alertConfig: AlertConfig = {
  // Appearance
  borderRadius: '8px',
  borderWidth: '1px',
  padding: '12px 16px',
  iconSize: '20px',
  
  // Behavior
  dismissible: true,
  showIcon: true,
  variant: 'soft',
  
  // Accessibility
  role: 'alert',
  ariaLive: 'polite',
}

export const loadingConfig: LoadingConfig = {
  // Overlay
  overlayOpacity: 0.6,
  overlayColor: 'var(--ntk-text-primary)',
  overlayBlur: '4px',
  
  // Spinner
  spinnerSize: '48px',
  spinnerColor: 'var(--semantic-info)',
  spinnerThickness: '4px',
  
  // Message
  showMessage: true,
  messagePosition: 'bottom',
  messageSpacing: '16px',
  
  // Behavior
  preventScroll: true,
  closeOnClick: false,
  timeout: null, // No timeout
  
  // Animation
  animationDuration: 300,
  spinnerAnimation: 'spin',
}

// ============================
// Notification Styles
// ============================

export interface NotificationTypeStyle {
  background: string
  color: string
  borderColor: string
  icon: string
}

export interface NotificationStyles {
  success: NotificationTypeStyle
  warning: NotificationTypeStyle
  error: NotificationTypeStyle
  info: NotificationTypeStyle
  loading: NotificationTypeStyle
  neutral: NotificationTypeStyle
}

export const lightNotificationStyles: NotificationStyles = {
  success: {
    background: 'var(--semantic-success-bg)',
    color: 'var(--semantic-success-text)',
    borderColor: 'var(--semantic-success-border)',
    icon: 'check_circle',
  },
  warning: {
    background: 'var(--semantic-warning-bg)',
    color: 'var(--semantic-warning-text)',
    borderColor: 'var(--semantic-warning-border)',
    icon: 'warning',
  },
  error: {
    background: 'var(--semantic-error-bg)',
    color: 'var(--semantic-error-text)',
    borderColor: 'var(--semantic-error-border)',
    icon: 'error',
  },
  info: {
    background: 'var(--semantic-info-bg)',
    color: 'var(--semantic-info-text)',
    borderColor: 'var(--semantic-info-border)',
    icon: 'info',
  },
  loading: {
    background: 'var(--ntk-bg-secondary)',
    color: 'var(--ntk-text-secondary)',
    borderColor: 'var(--ntk-border-dark)',
    icon: 'hourglass_empty',
  },
  neutral: {
    background: 'var(--ntk-bg-tertiary)',
    color: 'var(--ntk-text-secondary)',
    borderColor: 'var(--ntk-border-color)',
    icon: 'notifications',
  },
}

export const darkNotificationStyles: NotificationStyles = {
  success: {
    background: 'color-mix(in srgb, var(--semantic-success) 20%, transparent)',
    color: 'var(--semantic-success)',
    borderColor: 'var(--semantic-success-border)',
    icon: 'check_circle',
  },
  warning: {
    background: 'color-mix(in srgb, var(--semantic-warning) 20%, transparent)',
    color: 'var(--semantic-warning)',
    borderColor: 'var(--semantic-warning-border)',
    icon: 'warning',
  },
  error: {
    background: 'color-mix(in srgb, var(--semantic-error) 20%, transparent)',
    color: 'var(--semantic-error)',
    borderColor: 'var(--semantic-error-border)',
    icon: 'error',
  },
  info: {
    background: 'color-mix(in srgb, var(--semantic-info) 20%, transparent)',
    color: 'var(--semantic-info)',
    borderColor: 'var(--semantic-info-border)',
    icon: 'info',
  },
  loading: {
    background: 'color-mix(in srgb, var(--ntk-text-secondary) 20%, transparent)',
    color: 'var(--ntk-text-muted)',
    borderColor: 'var(--ntk-text-secondary)',
    icon: 'hourglass_empty',
  },
  neutral: {
    background: 'color-mix(in srgb, var(--ntk-text-muted) 20%, transparent)',
    color: 'var(--ntk-border-dark)',
    borderColor: 'var(--ntk-text-secondary)',
    icon: 'notifications',
  },
}

/**
 * Get Notification Styles Based on Theme
 * 
 * Returns the appropriate notification styles (light or dark) based on the current theme.
 * This function ensures notification colors adapt to the active theme while maintaining
 * semantic meaning and accessibility.
 * 
 * ## Theme Adaptation
 * - **Light Theme**: Uses solid backgrounds with dark text for high contrast
 * - **Dark Theme**: Uses transparent rgba backgrounds with bright borders and text
 * 
 * ## Usage
 * ```typescript
 * import { getNotificationStyles } from '@/config'
 * 
 * // Get styles based on current theme
 * const isDarkMode = useTheme().isDark
 * const styles = getNotificationStyles(isDarkMode)
 * 
 * // Apply to notification component
 * <div :style="{
 *   background: styles.success.background,
 *   color: styles.success.color,
 *   borderColor: styles.success.borderColor
 * }">
 *   <i>{{ styles.success.icon }}</i>
 *   Success message
 * </div>
 * ```
 * 
 * @param isDark - Whether the current theme is dark mode
 * @returns Notification styles object with success, warning, error, info, loading, and neutral variants
 * 
 * @see {@link NotificationStyles} Interface for return type structure
 * @see {@link lightNotificationStyles} Default light theme styles
 * @see {@link darkNotificationStyles} Default dark theme styles
 */
export function getNotificationStyles(isDark: boolean): NotificationStyles {
  return isDark ? darkNotificationStyles : lightNotificationStyles
}

/**
 * Apply Notification Configuration
 * 
 * Programmatically updates the notification configuration with partial overrides.
 * This is useful for runtime configuration changes without directly modifying
 * the global config object.
 * 
 * ## Use Cases
 * - Applying user preferences from settings
 * - Adjusting behavior based on viewport size
 * - A/B testing different notification timings
 * - Context-specific configuration (e.g., admin panel vs. public site)
 * 
 * ## Example
 * ```typescript
 * import { applyNotificationConfig } from '@/config'
 * 
 * // Update multiple properties at once
 * applyNotificationConfig({
 *   defaultDuration: 3000,
 *   maxVisible: 3,
 *   position: { top: '100px', right: '20px' },
 *   showAnimation: 'fade'
 * })
 * 
 * // Mobile-specific adjustments
 * if (isMobile) {
 *   applyNotificationConfig({
 *     position: { top: '10px', left: '10px', right: '10px' },
 *     maxWidth: '100%'
 *   })
 * }
 * ```
 * 
 * @param config - Partial configuration object with properties to override
 * 
 * @see {@link NotificationConfig} For available configuration properties
 */
export function applyNotificationConfig(config: Partial<NotificationConfig>): void {
  Object.assign(notificationConfig, config)
}

/**
 * Configuration Override Guide
 * 
 * All configuration objects can be customized by directly modifying their properties
 * or using the apply functions. Changes affect all components using these configs.
 * 
 * ## Global Override Example
 * ```typescript
 * import { 
 *   notificationConfig, 
 *   dialogConfig, 
 *   toastConfig,
 *   snackbarConfig 
 * } from '@/config/notification.config'
 * 
 * // Customize notification behavior
 * notificationConfig.defaultDuration = 3000
 * notificationConfig.position = { top: '80px', right: '20px' }
 * 
 * // Customize dialog appearance
 * dialogConfig.confirmText = 'Yes, proceed'
 * dialogConfig.cancelText = 'No, go back'
 * dialogConfig.confirmVariant = 'success'
 * 
 * // Customize toast positioning
 * toastConfig.position = 'bottom-right'
 * toastConfig.maxStack = 3
 * 
 * // Customize snackbar behavior
 * snackbarConfig.duration = 5000
 * snackbarConfig.actionText = 'Desfazer'
 * ```
 * 
 * ## Per-Component Override Example
 * ```typescript
 * // Override for specific notification instance
 * showNotification({
 *   type: 'success',
 *   message: 'Settings saved',
 *   duration: 2000, // Override default duration
 *   position: { top: '100px', right: '20px' } // Override default position
 * })
 * ```
 * 
 * ## Best Practices
 * - Set global defaults in app initialization (main.ts)
 * - Use apply functions for dynamic runtime changes
 * - Keep semantic consistency (don't make errors look like success)
 * - Test accessibility with screen readers after customization
 * - Document any non-standard durations or behaviors
 */

export default {
  notification: notificationConfig,
  popup: popupConfig,
  dialog: dialogConfig,
  toast: toastConfig,
  snackbar: snackbarConfig,
  banner: bannerConfig,
  alert: alertConfig,
  loading: loadingConfig,
  styles: {
    light: lightNotificationStyles,
    dark: darkNotificationStyles,
    get: getNotificationStyles,
  },
}
