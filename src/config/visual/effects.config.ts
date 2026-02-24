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
 *   hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
 *   primary: 'linear-gradient(to right, #4facfe 0%, #00f2fe 100%)',
 *   loading: 'linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 50%, #f0f0f0 100%)'
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
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
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

/**
 * Sentinela Visual Effects
 * 
 * Professional blue gradients with subtle shadows.
 * Corporate, clean aesthetic.
 */
export const sentinelaEffects: EffectsConfig = {
  gradients: {
    hero: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)',
    primary: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 100%)',
    secondary: 'linear-gradient(135deg, #64748B 0%, #475569 100%)',
    accent: 'linear-gradient(135deg, #03A9F4 0%, #0288D1 100%)',
    loading: 'linear-gradient(90deg, #f5f7fa 0%, #e4e8ec 50%, #f5f7fa 100%)',
    overlay: 'linear-gradient(180deg, rgba(13, 71, 161, 0) 0%, rgba(13, 71, 161, 0.8) 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
  },
  shadows: {
    ...defaultShadows,
    md: '0 4px 8px rgba(0, 0, 0, 0.15)',  // Slightly stronger for corporate feel
    lg: '0 8px 16px rgba(0, 0, 0, 0.18)',
  },
  radius: defaultRadius,
  blur: defaultBlur,
}

/**
 * PlaTEA Visual Effects
 * 
 * Warm, soft gradients with gentle shadows.
 * Accessible, calming aesthetic.
 */
export const plateaEffects: EffectsConfig = {
  gradients: {
    hero: 'linear-gradient(135deg, #ffffff 0%, #f5f3f0 100%)',
    primary: 'linear-gradient(135deg, #4A9B7F 0%, #388E3C 100%)',
    secondary: 'linear-gradient(135deg, #FFE082 0%, #F5F3F0 100%)',
    accent: 'linear-gradient(135deg, #8BC34A 0%, #689F38 100%)',
    loading: 'linear-gradient(90deg, #f5f3f0 0%, #e8e6e2 50%, #f5f3f0 100%)',
    overlay: 'linear-gradient(180deg, rgba(74, 155, 127, 0) 0%, rgba(74, 155, 127, 0.6) 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
  },
  shadows: {
    ...defaultShadows,
    md: '0 4px 6px rgba(74, 155, 127, 0.08)',  // Softer, green-tinted
    lg: '0 8px 12px rgba(74, 155, 127, 0.12)',
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
 * Vibrant purple gradients with modern shadows.
 * Tech-forward, dynamic aesthetic.
 */
export const nettoolskitEffects: EffectsConfig = {
  gradients: {
    hero: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    primary: 'linear-gradient(135deg, #512BD4 0%, #7B1FA2 100%)',
    secondary: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)',
    accent: 'linear-gradient(135deg, #7B74D4 0%, #5E35B1 100%)',
    loading: 'linear-gradient(90deg, #f1f5f9 0%, #cbd5e1 50%, #f1f5f9 100%)',
    overlay: 'linear-gradient(180deg, rgba(81, 43, 212, 0) 0%, rgba(81, 43, 212, 0.85) 100%)',
    glass: 'linear-gradient(135deg, rgba(123, 116, 212, 0.12), rgba(123, 116, 212, 0.06))',
  },
  shadows: {
    ...defaultShadows,
    md: '0 4px 6px rgba(81, 43, 212, 0.15)',  // Purple-tinted shadows
    lg: '0 8px 16px rgba(81, 43, 212, 0.2)',
    xl: '0 20px 25px rgba(81, 43, 212, 0.25)',
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
