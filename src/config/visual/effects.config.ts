/**
 * Visual Effects Configuration
 * 
 * Gradients, shadows, blur effects, and border radius settings.
 * Pure visual properties independent of layout and colors.
 * 
 * ## Purpose
 * Centralize all visual effect settings to ensure:
 * - Consistent depth and elevation system
 * - Reusable gradient patterns
 * - Standardized border radius across components
 * - Easy brand customization
 * 
 * ## Responsibility (Single Responsibility Principle)
 * ONLY visual effects. Does NOT include:
 * - Colors → see colors/ configs
 * - Typography → see typography.config.ts
 * - Layout spacing → see spacing.config.ts
 * 
 * ## Usage
 * ```typescript
 * import { sentinelaEffects } from '@/config/visual/effects.config'
 * 
 * const card = {
 *   boxShadow: sentinelaEffects.shadows.md,
 *   borderRadius: sentinelaEffects.radius.lg,
 *   background: sentinelaEffects.gradients.hero
 * }
 * ```
 * 
 * @module visual/effects.config
 */

// ============================
// Effects Interfaces
// ============================

/**
 * Gradient Configuration
 * 
 * Predefined gradients for backgrounds, overlays, and decorative elements.
 * 
 * @example
 * ```typescript
 * const gradients: Gradients = {
 *   hero: 'linear-gradient(135deg, var(--ntk-bg-primary) 0%, var(--ntk-bg-secondary) 100%)',
 *   primary: 'var(--ntk-primary-gradient)',
 *   loading: 'linear-gradient(90deg, var(--ntk-bg-secondary) 0%, var(--ntk-bg-tertiary) 50%, var(--ntk-bg-secondary) 100%)'
 * }
 * ```
 */
export interface Gradients {
  /** Hero section gradient */
  hero: string
  
  /** Primary brand gradient */
  primary: string
  
  /** Secondary gradient */
  secondary: string
  
  /** Accent gradient for CTAs */
  accent: string
  
  /** Loading shimmer gradient */
  loading: string
  
  /** Subtle overlay gradient */
  overlay: string
  
  /** Glass morphism backdrop */
  glass: string
}

/**
 * Shadow Configuration
 * 
 * Elevation system using box shadows.
 * Based on Material Design shadow guidelines.
 */
export interface Shadows {
  /** No shadow - flat appearance */
  none: string
  
  /** Extra small - 1dp - Subtle depth */
  xs: string
  
  /** Small - 2dp - Buttons, chips */
  sm: string
  
  /** Medium - 4dp - Cards, panels */
  md: string
  
  /** Large - 8dp - Modals, drawers */
  lg: string
  
  /** Extra large - 16dp - Popups, tooltips */
  xl: string
  
  /** 2XL - 24dp - Major elevation */
  '2xl': string
  
  /** Inner shadow - Inset elements */
  inner: string
}

/**
 * Border Radius Configuration
 * 
 * Rounded corner sizes for consistent component styling.
 */
export interface BorderRadius {
  /** No radius - sharp corners */
  none: string
  
  /** Extra small - 2px - Subtle */
  xs: string
  
  /** Small - 4px - Buttons, inputs */
  sm: string
  
  /** Medium - 6px - Cards (default) */
  md: string
  
  /** Large - 8px - Panels */
  lg: string
  
  /** Extra large - 12px - Hero sections */
  xl: string
  
  /** 2XL - 16px - Large cards */
  '2xl': string
  
  /** Full - 9999px - Pills, circles */
  full: string
}

/**
 * Blur Configuration
 * 
 * Backdrop blur values for glass morphism effects.
 */
export interface BlurEffects {
  /** No blur */
  none: string
  
  /** Small - 4px - Subtle backdrop */
  sm: string
  
  /** Medium - 8px - Modal overlays */
  md: string
  
  /** Large - 16px - Strong blur */
  lg: string
  
  /** Extra large - 24px - Heavy blur */
  xl: string
}

/**
 * Complete Effects Configuration
 * 
 * Aggregates all visual effects for a brand.
 */
export interface EffectsConfig {
  gradients: Gradients
  shadows: Shadows
  radius: BorderRadius
  blur: BlurEffects
}

// ============================
// Default Effects
// ============================

/**
 * Default Shadows
 * 
 * Material Design elevation system.
 * Colors are neutral grays - override with brand colors if needed.
 */
export const defaultShadows: Shadows = {
  none: 'none',
  xs: '0 1px 2px 0 color-mix(in srgb, var(--ntk-shadow-color) 5%, transparent)',
  sm: '0 1px 3px 0 color-mix(in srgb, var(--ntk-shadow-color) 10%, transparent), 0 1px 2px 0 color-mix(in srgb, var(--ntk-shadow-color) 6%, transparent)',
  md: '0 4px 6px -1px color-mix(in srgb, var(--ntk-shadow-color) 10%, transparent), 0 2px 4px -1px color-mix(in srgb, var(--ntk-shadow-color) 6%, transparent)',
  lg: '0 10px 15px -3px color-mix(in srgb, var(--ntk-shadow-color) 10%, transparent), 0 4px 6px -2px color-mix(in srgb, var(--ntk-shadow-color) 5%, transparent)',
  xl: '0 20px 25px -5px color-mix(in srgb, var(--ntk-shadow-color) 10%, transparent), 0 10px 10px -5px color-mix(in srgb, var(--ntk-shadow-color) 4%, transparent)',
  '2xl': '0 25px 50px -12px color-mix(in srgb, var(--ntk-shadow-color) 25%, transparent)',
  inner: 'inset 0 2px 4px 0 color-mix(in srgb, var(--ntk-shadow-color) 6%, transparent)',
}

/**
 * Default Border Radius
 * 
 * Modern rounded corners with progressive sizing.
 */
export const defaultRadius: BorderRadius = {
  none: '0',
  xs: '0.125rem',   // 2px
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',   // Pill shape
}

/**
 * Default Blur Effects
 * 
 * Standard backdrop blur values.
 */
export const defaultBlur: BlurEffects = {
  none: '0',
  sm: 'blur(4px)',
  md: 'blur(8px)',
  lg: 'blur(16px)',
  xl: 'blur(24px)',
}

// ============================
// Brand Effects Configs
// ============================

const whiteLabelGradients: Gradients = {
  hero: 'linear-gradient(135deg, var(--ntk-bg-primary) 0%, var(--ntk-bg-secondary) 100%)',
  primary: 'var(--ntk-primary-gradient, linear-gradient(135deg, var(--ntk-primary) 0%, var(--ntk-accent) 100%))',
  secondary: 'linear-gradient(135deg, var(--ntk-secondary) 0%, var(--ntk-secondary-dark) 100%)',
  accent: 'linear-gradient(135deg, var(--ntk-primary-gradient-start, var(--ntk-primary)) 0%, var(--ntk-primary-gradient-end, var(--ntk-accent)) 100%)',
  loading: 'linear-gradient(90deg, var(--ntk-bg-secondary) 0%, var(--ntk-bg-tertiary) 50%, var(--ntk-bg-secondary) 100%)',
  overlay: 'linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--ntk-primary) 72%, transparent) 100%)',
  glass: 'linear-gradient(135deg, color-mix(in srgb, var(--ntk-surface-overlay) 14%, transparent), color-mix(in srgb, var(--ntk-surface-overlay) 6%, transparent))',
}

/**
 * Sentinela Visual Effects
 * 
 * Legacy preset that now resolves gradients through active white-label tokens.
 * Corporate depth remains available without locking colors to the old blue brand.
 */
export const sentinelaEffects: EffectsConfig = {
  gradients: { ...whiteLabelGradients },
  shadows: {
    ...defaultShadows,
    md: '0 4px 8px color-mix(in srgb, var(--ntk-shadow-color) 15%, transparent)',
    lg: '0 8px 16px color-mix(in srgb, var(--ntk-shadow-color) 18%, transparent)',
  },
  radius: defaultRadius,
  blur: defaultBlur,
}

/**
 * PlaTEA Visual Effects
 * 
 * Legacy preset that now resolves gradients through active white-label tokens.
 * Accessible, calming shape and shadow choices remain independent of brand color.
 */
export const plateaEffects: EffectsConfig = {
  gradients: { ...whiteLabelGradients },
  shadows: {
    ...defaultShadows,
    md: '0 4px 6px color-mix(in srgb, var(--ntk-success) 8%, transparent)',
    lg: '0 8px 12px color-mix(in srgb, var(--ntk-success) 12%, transparent)',
  },
  radius: {
    ...defaultRadius,
    md: '0.5rem',   // 8px - Slightly more rounded for friendly feel
    lg: '0.75rem',  // 12px
  },
  blur: defaultBlur,
}

/**
 * NetToolsKit Visual Effects
 * 
 * Legacy preset that now resolves gradients through active white-label tokens.
 * Tech-forward depth remains available without reintroducing the old purple palette.
 */
export const nettoolskitEffects: EffectsConfig = {
  gradients: { ...whiteLabelGradients },
  shadows: {
    ...defaultShadows,
    md: '0 4px 6px color-mix(in srgb, var(--ntk-primary) 15%, transparent)',
    lg: '0 8px 16px color-mix(in srgb, var(--ntk-primary) 20%, transparent)',
    xl: '0 20px 25px color-mix(in srgb, var(--ntk-primary) 25%, transparent)',
  },
  radius: {
    ...defaultRadius,
    md: '0.5rem',   // 8px - Modern, tech-forward
    lg: '0.75rem',  // 12px
  },
  blur: defaultBlur,
}

// ============================
// Effects Registry
// ============================

/**
 * All Effects Configurations
 * 
 * Registry for dynamic brand switching.
 */
export const effects = {
  sentinela: sentinelaEffects,
  platea: plateaEffects,
  nettoolskit: nettoolskitEffects,
} as const

export type EffectsName = keyof typeof effects

/**
 * Get Effects by Name
 * 
 * Helper function for dynamic brand effects.
 * 
 * @param name - Effects configuration name
 * @returns The requested effects config
 */
export function getEffects(name: EffectsName): EffectsConfig {
  return effects[name]
}

/**
 * Apply Effects to CSS Variables
 * 
 * Creates CSS custom properties for visual effects.
 * Call this on app initialization or theme change.
 * 
 * @param config - Effects configuration to apply
 * 
 * @example
 * ```typescript
 * import { applyEffects, sentinelaEffects } from '@/config/visual/effects.config'
 * 
 * applyEffects(sentinelaEffects)
 * ```
 */
export function applyEffects(config: EffectsConfig): void {
  const root = document.documentElement
  
  // Gradients
  Object.entries(config.gradients).forEach(([key, value]) => {
    root.style.setProperty(`--ntk-gradient-${key}`, value)
  })
  
  // Shadows
  Object.entries(config.shadows).forEach(([key, value]) => {
    root.style.setProperty(`--ntk-shadow-${key}`, value)
  })
  
  // Border radius
  Object.entries(config.radius).forEach(([key, value]) => {
    root.style.setProperty(`--ntk-radius-${key}`, value)
  })
  
  // Blur
  Object.entries(config.blur).forEach(([key, value]) => {
    root.style.setProperty(`--ntk-blur-${key}`, value)
  })
}
