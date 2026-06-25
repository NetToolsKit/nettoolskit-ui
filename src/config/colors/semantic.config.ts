/**
 * Semantic Colors Configuration
 * 
 * Colors that are independent of theme (light/dark mode).
 * These colors are used for feedback, status indicators, and semantic meaning
 * across the entire application.
 * 
 * ## Purpose
 * Semantic colors remain consistent across all themes to ensure:
 * - Clear visual communication of states and actions
 * - Accessibility compliance (WCAG AA/AAA standards)
 * - Consistent user experience regardless of theme
 * 
 * ## Usage
 * These colors should be used for:
 * - Success messages and confirmations (green)
 * - Warning and caution alerts (amber/orange)
 * - Error states and destructive actions (red)
 * - Informational messages (blue)
 * - Disabled or inactive states (gray)
 * 
 * ## Color Psychology
 * - Green (Success): Positive outcomes, confirmations, growth
 * - Amber (Warning): Caution, attention needed, pending actions
 * - Red (Error): Errors, failures, destructive actions
 * - Blue (Info): Information, guidance, neutral communication
 * 
 * @see {@link https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html WCAG Contrast Requirements}
 */
export interface SemanticColors {
  // ========================================
  // Success Colors (Green Palette)
  // ========================================
  
  /**
   * Primary success color
   * Used for main success indicators, icons, and emphasis
   * @example '#22c55e' (green-500)
   */
  successPrimary: string
  
  /**
   * Light success color
   * Used for backgrounds, subtle highlights, and hover states
   * @example '#dcfce7' (green-100)
   */
  successLight: string
  
  /**
   * Dark success color
   * Used for text on light backgrounds and pressed states
   * @example '#16a34a' (green-600)
   */
  successDark: string
  
  /**
   * Success border color
   * Used for borders on success alerts, inputs, and cards
   * @example '#22c55e' (green-500)
   */
  successBorder: string
  
  /**
   * Success background color
   * Used for alert boxes, notifications, and highlighted areas
   * @example '#dcfce7' (green-100)
   */
  successBackground: string
  
  /**
   * Success text color
   * Used for text content in success contexts
   * Must meet WCAG AA contrast ratio (4.5:1) on light backgrounds
   * @example '#16a34a' (green-600)
   */
  successText: string
  
  // ========================================
  // Warning Colors (Amber Palette)
  // ========================================
  
  /**
   * Primary warning color
   * Used for main warning indicators, icons, and emphasis
   * @example '#f59e0b' (amber-500)
   */
  warningPrimary: string
  
  /**
   * Light warning color
   * Used for backgrounds, subtle highlights, and hover states
   * @example '#fef3c7' (amber-100)
   */
  warningLight: string
  
  /**
   * Dark warning color
   * Used for text on light backgrounds and pressed states
   * @example '#b45309' (amber-700)
   */
  warningDark: string
  
  /**
   * Warning border color
   * Used for borders on warning alerts, inputs, and cards
   * @example '#f59e0b' (amber-500)
   */
  warningBorder: string
  
  /**
   * Warning background color
   * Used for alert boxes, notifications, and highlighted areas
   * @example '#fef3c7' (amber-100)
   */
  warningBackground: string
  
  /**
   * Warning text color
   * Used for text content in warning contexts
   * Must meet WCAG AA contrast ratio (4.5:1) on light backgrounds
   * @example '#b45309' (amber-700)
   */
  warningText: string
  
  // ========================================
  // Error Colors (Red Palette)
  // ========================================
  
  /**
   * Primary error color
   * Used for main error indicators, icons, and emphasis
   * @example '#ef4444' (red-500)
   */
  errorPrimary: string
  
  /**
   * Light error color
   * Used for backgrounds, subtle highlights, and hover states
   * @example '#fee2e2' (red-100)
   */
  errorLight: string
  
  /**
   * Dark error color
   * Used for text on light backgrounds and pressed states
   * @example '#b91c1c' (red-700)
   */
  errorDark: string
  
  /**
   * Error border color
   * Used for borders on error alerts, inputs, and cards
   * @example '#ef4444' (red-500)
   */
  errorBorder: string
  
  /**
   * Error background color
   * Used for alert boxes, notifications, and highlighted areas
   * @example '#fee2e2' (red-100)
   */
  errorBackground: string
  
  /**
   * Error text color
   * Used for text content in error contexts
   * Must meet WCAG AA contrast ratio (4.5:1) on light backgrounds
   * @example '#b91c1c' (red-700)
   */
  errorText: string
  
  // ========================================
  // Info Colors (Blue Palette)
  // ========================================
  
  /**
   * Primary info color
   * Used for main info indicators, icons, and emphasis
   * @example '#3b82f6' (blue-500)
   */
  infoPrimary: string
  
  /**
   * Light info color
   * Used for backgrounds, subtle highlights, and hover states
   * @example '#dbeafe' (blue-100)
   */
  infoLight: string
  
  /**
   * Dark info color
   * Used for text on light backgrounds and pressed states
   * @example '#2563eb' (blue-600)
   */
  infoDark: string
  
  /**
   * Info border color
   * Used for borders on info alerts, inputs, and cards
   * @example '#3b82f6' (blue-500)
   */
  infoBorder: string
  
  /**
   * Info background color
   * Used for alert boxes, notifications, and highlighted areas
   * @example '#dbeafe' (blue-100)
   */
  infoBackground: string
  
  /**
   * Info text color
   * Used for text content in info contexts
   * Must meet WCAG AA contrast ratio (4.5:1) on light backgrounds
   * @example '#2563eb' (blue-600)
   */
  infoText: string
  
  // ========================================
  // Additional Semantic Colors
  // ========================================
  
  /**
   * Positive color (alias for success)
   * Used for positive actions, growth indicators, and upward trends
   * @example '#22c55e' (green-500)
   */
  positive: string
  
  /**
   * Negative color (alias for error)
   * Used for negative actions, decline indicators, and downward trends
   * @example '#ef4444' (red-500)
   */
  negative: string
  
  /**
   * Neutral color
   * Used for neutral states, default indicators, and balanced information
   * @example '#64748b' (slate-600)
   */
  neutral: string
  
  /**
   * Disabled background color
   * Used for disabled buttons, inputs, and interactive elements
   * @example '#e2e8f0' (slate-200)
   */
  disabled: string
  
  /**
   * Disabled text color
   * Used for text on disabled elements
   * Provides subtle appearance for inactive content
   * @example '#94a3b8' (slate-400)
   */
  disabledText: string
}

/**
 * Global Semantic Colors Object
 * 
 * Default semantic color values that remain consistent across all themes.
 * These colors are carefully selected to meet WCAG AA/AAA accessibility standards.
 * 
 * ## Accessibility Compliance
 * All color combinations meet minimum contrast requirements:
 * - Text colors: 4.5:1 contrast ratio (WCAG AA)
 * - Large text: 3:1 contrast ratio (WCAG AA)
 * - UI components: 3:1 contrast ratio (WCAG AA)
 * 
 * ## Customization
 * You can override these values globally:
 * ```typescript
 * import { semanticColors } from '@/config/semantic-colors.config'
 * 
 * // Override individual colors
 * semanticColors.successPrimary = '#28a745' // Bootstrap green
 * semanticColors.errorPrimary = '#dc3545'   // Bootstrap red
 * 
 * // Then apply changes
 * applySemanticColors()
 * ```
 * 
 * @see {@link SemanticColors} Interface documentation for each property
 */
const defaultSemanticColors: SemanticColors = {
  // Success (Green) - Positive actions, confirmations
  successPrimary: '#22c55e',
  successLight: '#dcfce7',
  successDark: '#16a34a',
  successBorder: '#22c55e',
  successBackground: '#dcfce7',
  successText: '#16a34a',
  
  // Warning (Amber/Orange) - Caution, requires attention
  warningPrimary: '#f59e0b',
  warningLight: '#fef3c7',
  warningDark: '#b45309',
  warningBorder: '#f59e0b',
  warningBackground: '#fef3c7',
  warningText: '#b45309',

  // Error (Red) - Errors, destructive actions
  errorPrimary: '#ef4444',
  errorLight: '#fee2e2',
  errorDark: '#b91c1c',
  errorBorder: '#ef4444',
  errorBackground: '#fee2e2',
  errorText: '#b91c1c',
  
  // Info (Blue) - Informational, neutral messages
  infoPrimary: '#3b82f6',
  infoLight: '#dbeafe',
  infoDark: '#2563eb',
  infoBorder: '#3b82f6',
  infoBackground: '#dbeafe',
  infoText: '#2563eb',
  
  // Additional semantic colors
  positive: '#22c55e',    // Alias for success
  negative: '#ef4444',    // Alias for error
  neutral: '#64748b',     // Neutral gray
  disabled: '#e2e8f0',    // Disabled background
  disabledText: '#94a3b8', // Disabled text
}

export const semanticColors: SemanticColors = { ...defaultSemanticColors }

/**
 * Resolves semantic colors.
 */
function resolveSemanticColors(overrides: Partial<SemanticColors> = {}): SemanticColors {
  const merged: SemanticColors = {
    ...semanticColors,
    ...overrides,
  }

  const successPrimary = overrides.successPrimary ?? merged.successPrimary
  const warningPrimary = overrides.warningPrimary ?? merged.warningPrimary
  const errorPrimary = overrides.errorPrimary ?? merged.errorPrimary
  const infoPrimary = overrides.infoPrimary ?? merged.infoPrimary

  return {
    ...merged,
    successBorder: overrides.successBorder ?? merged.successBorder ?? successPrimary,
    warningBorder: overrides.warningBorder ?? merged.warningBorder ?? warningPrimary,
    errorBorder: overrides.errorBorder ?? merged.errorBorder ?? errorPrimary,
    infoBorder: overrides.infoBorder ?? merged.infoBorder ?? infoPrimary,
    positive: overrides.positive ?? merged.positive ?? successPrimary,
    negative: overrides.negative ?? merged.negative ?? errorPrimary,
  }
}

/**
 * Handles set semantic colors.
 */
export function setSemanticColors(overrides: Partial<SemanticColors>): SemanticColors {
  const resolved = resolveSemanticColors(overrides)
  Object.assign(semanticColors, resolved)
  return semanticColors
}

/**
 * Resets semantic colors.
 */
export function resetSemanticColors(): SemanticColors {
  Object.assign(semanticColors, defaultSemanticColors)
  return semanticColors
}

/**
 * Apply Semantic Colors to CSS Custom Properties
 * 
 * This function takes the semantic colors from the `semanticColors` object
 * and applies them as CSS custom properties (CSS variables) to the document root.
 * 
 * ## When to Call
 * - **Once on app initialization** (typically in main.ts or app setup)
 * - After overriding semantic colors programmatically
 * - When switching color schemes that affect semantic colors
 * 
 * ## CSS Variables Created
 * Creates the following CSS custom properties on `:root`:
 * ```css
 * --semantic-success, --semantic-success-primary, --semantic-success-light, etc.
 * --semantic-warning, --semantic-warning-primary, --semantic-warning-light, etc.
 * --semantic-error, --semantic-error-primary, --semantic-error-light, etc.
 * --semantic-info, --semantic-info-primary, --semantic-info-light, etc.
 * --semantic-positive, --semantic-negative, --semantic-neutral
 * --semantic-disabled, --semantic-disabled-text
 * ```
 * 
 * ## Usage in Components
 * After calling this function, use the CSS variables in your styles:
 * ```scss
 * .success-message {
 *   color: var(--semantic-success-text);
 *   background: var(--semantic-success-bg);
 *   border: 1px solid var(--semantic-success-border);
 * }
 * 
 * .error-alert {
 *   color: var(--semantic-error-text);
 *   background: var(--semantic-error-bg);
 * }
 * ```
 * 
 * ## Example
 * ```typescript
 * import { applySemanticColors, semanticColors } from '@/config/semantic-colors.config'
 * 
 * // Apply default colors
 * applySemanticColors()
 * 
 * // Or override first, then apply
 * semanticColors.successPrimary = '#10b981'
 * applySemanticColors()
 * ```
 * 
 * @see {@link semanticColors} The source object for semantic colors
 */
export function applySemanticColors(overrides: Partial<SemanticColors> = {}): void {
  const next = Object.keys(overrides).length > 0
    ? setSemanticColors(overrides)
    : semanticColors

  const root = document.documentElement
  
  // Success colors
  root.style.setProperty('--semantic-success', next.successPrimary)
  root.style.setProperty('--semantic-success-primary', next.successPrimary)
  root.style.setProperty('--semantic-success-light', next.successLight)
  root.style.setProperty('--semantic-success-dark', next.successDark)
  root.style.setProperty('--semantic-success-border', next.successBorder)
  root.style.setProperty('--semantic-success-bg', next.successBackground)
  root.style.setProperty('--semantic-success-text', next.successText)
  
  // Warning colors
  root.style.setProperty('--semantic-warning', next.warningPrimary)
  root.style.setProperty('--semantic-warning-primary', next.warningPrimary)
  root.style.setProperty('--semantic-warning-light', next.warningLight)
  root.style.setProperty('--semantic-warning-dark', next.warningDark)
  root.style.setProperty('--semantic-warning-border', next.warningBorder)
  root.style.setProperty('--semantic-warning-bg', next.warningBackground)
  root.style.setProperty('--semantic-warning-text', next.warningText)
  
  // Error colors
  root.style.setProperty('--semantic-error', next.errorPrimary)
  root.style.setProperty('--semantic-error-primary', next.errorPrimary)
  root.style.setProperty('--semantic-error-light', next.errorLight)
  root.style.setProperty('--semantic-error-dark', next.errorDark)
  root.style.setProperty('--semantic-error-border', next.errorBorder)
  root.style.setProperty('--semantic-error-bg', next.errorBackground)
  root.style.setProperty('--semantic-error-text', next.errorText)
  
  // Info colors
  root.style.setProperty('--semantic-info', next.infoPrimary)
  root.style.setProperty('--semantic-info-primary', next.infoPrimary)
  root.style.setProperty('--semantic-info-light', next.infoLight)
  root.style.setProperty('--semantic-info-dark', next.infoDark)
  root.style.setProperty('--semantic-info-border', next.infoBorder)
  root.style.setProperty('--semantic-info-bg', next.infoBackground)
  root.style.setProperty('--semantic-info-text', next.infoText)
  
  // Additional colors
  root.style.setProperty('--semantic-positive', next.positive)
  root.style.setProperty('--semantic-negative', next.negative)
  root.style.setProperty('--semantic-neutral', next.neutral)
  root.style.setProperty('--semantic-disabled', next.disabled)
  root.style.setProperty('--semantic-disabled-text', next.disabledText)
}

/**
 * Override semantic colors if needed
 * 
 * Example:
 * import { semanticColors } from '@/config/semantic-colors.config'
 * semanticColors.successPrimary = '#28a745' // Bootstrap green
 * semanticColors.errorPrimary = '#dc3545' // Bootstrap red
 */

export default semanticColors