/**
 * Typography Configuration
 * 
 * Font families, sizes, weights, line heights, and text styles.
 * Independent of colors and themes.
 * 
 * ## Purpose
 * Centralize all typography-related settings to ensure:
 * - Consistent font usage across the application
 * - Proper text hierarchy and readability
 * - Easy customization per brand
 * - Accessibility compliance (readable sizes, line heights)
 * 
 * ## Responsibility (Single Responsibility Principle)
 * ONLY typography settings. Does NOT include:
 * - Colors → see colors/ configs
 * - Spacing → see spacing.config.ts
 * - Visual effects → see effects.config.ts
 * 
 * ## Usage
 * ```typescript
 * import { sentinelaTypography } from '@/config/visual/typography.config'
 * 
 * const heading = {
 *   fontFamily: sentinelaTypography.fonts.display,
 *   fontSize: sentinelaTypography.sizes.h1,
 *   fontWeight: sentinelaTypography.weights.bold,
 *   lineHeight: sentinelaTypography.lineHeights.tight
 * }
 * ```
 * 
 * @module visual/typography.config
 */

// ============================
// Typography Interfaces
// ============================

/**
 * Font Family Configuration
 * 
 * Defines font families for different use cases.
 * 
 * @example
 * ```typescript
 * const fonts: FontFamilies = {
 *   display: "'Poppins', sans-serif",
 *   body: "'Inter', sans-serif",
 *   mono: "'Fira Code', monospace"
 * }
 * ```
 */
export interface FontFamilies {
  /** Display font for headings and hero sections */
  display: string
  
  /** Body font for paragraphs and content */
  body: string
  
  /** Monospace font for code and technical content */
  mono: string
}

/**
 * Font Size Scale
 * 
 * Predefined font sizes following a modular scale.
 * Ensures consistent sizing and proper hierarchy.
 */
export interface FontSizes {
  /** Extra small - 12px - Captions, labels */
  xs: string
  
  /** Small - 14px - Secondary text */
  sm: string
  
  /** Base - 16px - Body text (default) */
  base: string
  
  /** Large - 18px - Emphasized text */
  lg: string
  
  /** Extra large - 20px - Subheadings */
  xl: string
  
  /** Heading 6 - 24px */
  h6: string
  
  /** Heading 5 - 28px */
  h5: string
  
  /** Heading 4 - 32px */
  h4: string
  
  /** Heading 3 - 36px */
  h3: string
  
  /** Heading 2 - 48px */
  h2: string
  
  /** Heading 1 - 64px - Hero, main titles */
  h1: string
  
  /** Display - 80px - Landing page heroes */
  display: string
}

/**
 * Font Weight Scale
 * 
 * Standard font weights for emphasis and hierarchy.
 */
export interface FontWeights {
  /** Thin - 100 - Rarely used */
  thin: number
  
  /** Extra light - 200 */
  extralight: number
  
  /** Light - 300 - Subtle text */
  light: number
  
  /** Normal - 400 - Body text (default) */
  normal: number
  
  /** Medium - 500 - Slight emphasis */
  medium: number
  
  /** Semibold - 600 - Subheadings */
  semibold: number
  
  /** Bold - 700 - Headings, strong emphasis */
  bold: number
  
  /** Extra bold - 800 - Strong impact */
  extrabold: number
  
  /** Black - 900 - Maximum emphasis */
  black: number
}

/**
 * Line Height Scale
 * 
 * Relative line heights for different text contexts.
 * Ensures readability and proper vertical rhythm.
 */
export interface LineHeights {
  /** None - 1.0 - Tight headings */
  none: number
  
  /** Tight - 1.25 - Display headings */
  tight: number
  
  /** Snug - 1.375 - Subheadings */
  snug: number
  
  /** Normal - 1.5 - Body text (default) */
  normal: number
  
  /** Relaxed - 1.625 - Long-form content */
  relaxed: number
  
  /** Loose - 2.0 - Spacious paragraphs */
  loose: number
}

/**
 * Letter Spacing Scale
 * 
 * Character spacing for different text styles.
 */
export interface LetterSpacing {
  /** Tighter - -0.05em - Large headings */
  tighter: string
  
  /** Tight - -0.025em - Headings */
  tight: string
  
  /** Normal - 0em - Body text (default) */
  normal: string
  
  /** Wide - 0.025em - Subtle emphasis */
  wide: string
  
  /** Wider - 0.05em - Buttons, labels */
  wider: string
  
  /** Widest - 0.1em - All-caps text */
  widest: string
}

/**
 * Complete Typography Configuration
 * 
 * Aggregates all typography settings for a brand.
 */
export interface TypographyConfig {
  fonts: FontFamilies
  sizes: FontSizes
  weights: FontWeights
  lineHeights: LineHeights
  letterSpacing: LetterSpacing
}

// ============================
// Default Typography Scales
// ============================

/**
 * Default Font Families
 * 
 * Modern, web-safe font stack with good fallbacks.
 * Uses system fonts if custom fonts fail to load.
 */
export const defaultFonts: FontFamilies = {
  display: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'Fira Code', 'Consolas', 'Monaco', monospace",
}

/**
 * Default Font Sizes
 * 
 * Based on 16px root with modular scale ratio of 1.2-1.33.
 * Accessible sizes meeting WCAG guidelines.
 */
export const defaultSizes: FontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px (default)
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  h6: '1.5rem',     // 24px
  h5: '1.75rem',    // 28px
  h4: '2rem',       // 32px
  h3: '2.25rem',    // 36px
  h2: '3rem',       // 48px
  h1: '4rem',       // 64px
  display: '5rem',  // 80px
}

/**
 * Default Font Weights
 * 
 * Standard numeric values compatible with most font families.
 */
export const defaultWeights: FontWeights = {
  thin: 100,
  extralight: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
}

/**
 * Default Line Heights
 * 
 * Optimized for readability across different text contexts.
 * Based on typography best practices.
 */
export const defaultLineHeights: LineHeights = {
  none: 1.0,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2.0,
}

/**
 * Default Letter Spacing
 * 
 * Subtle spacing adjustments for different contexts.
 */
export const defaultLetterSpacing: LetterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
}

// ============================
// Brand Typography Configs
// ============================

/**
 * Sentinela Typography
 * 
 * Professional, corporate typography for business applications.
 * Clean, readable fonts with good legibility.
 */
export const sentinelaTypography: TypographyConfig = {
  fonts: {
    display: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'Fira Code', monospace",
  },
  sizes: defaultSizes,
  weights: defaultWeights,
  lineHeights: defaultLineHeights,
  letterSpacing: defaultLetterSpacing,
}

/**
 * PlaTEA Typography
 * 
 * Friendly, accessible typography for neurodivergent users.
 * Slightly larger sizes and more generous spacing for readability.
 */
export const plateaTypography: TypographyConfig = {
  fonts: {
    display: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
    mono: "'Fira Code', monospace",
  },
  sizes: {
    ...defaultSizes,
    base: '1.125rem',   // 18px - Larger for better readability
    sm: '1rem',         // 16px
  },
  weights: defaultWeights,
  lineHeights: {
    ...defaultLineHeights,
    normal: 1.625,      // More generous line height
    relaxed: 1.75,
  },
  letterSpacing: {
    ...defaultLetterSpacing,
    normal: '0.015em',  // Slightly wider for readability
  },
}

/**
 * NetToolsKit Typography
 * 
 * Modern, developer-focused typography.
 * Clean code-like aesthetic with monospace touches.
 */
export const nettoolskitTypography: TypographyConfig = {
  fonts: {
    display: "'JetBrains Mono', 'Fira Code', monospace",
    body: "'Inter', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
  sizes: defaultSizes,
  weights: defaultWeights,
  lineHeights: defaultLineHeights,
  letterSpacing: defaultLetterSpacing,
}

// ============================
// Typography Registry
// ============================

/**
 * All Typography Configurations
 * 
 * Registry for dynamic brand switching.
 */
export const typographies = {
  sentinela: sentinelaTypography,
  platea: plateaTypography,
  nettoolskit: nettoolskitTypography,
} as const

export type TypographyName = keyof typeof typographies

/**
 * Get Typography by Name
 * 
 * Helper function for dynamic brand typography.
 * 
 * @param name - Typography configuration name
 * @returns The requested typography config
 */
export function getTypography(name: TypographyName): TypographyConfig {
  return typographies[name]
}

/**
 * Apply Typography to CSS Variables
 * 
 * Creates CSS custom properties for typography values.
 * Call this on app initialization or theme change.
 * 
 * @param config - Typography configuration to apply
 * 
 * @example
 * ```typescript
 * import { applyTypography, sentinelaTypography } from '@/config/visual/typography.config'
 * 
 * applyTypography(sentinelaTypography)
 * ```
 */
export function applyTypography(config: TypographyConfig): void {
  const root = document.documentElement
  
  // Fonts
  root.style.setProperty('--ntk-font-display', config.fonts.display)
  root.style.setProperty('--ntk-font-body', config.fonts.body)
  root.style.setProperty('--ntk-font-mono', config.fonts.mono)
  
  // Sizes
  Object.entries(config.sizes).forEach(([key, value]) => {
    root.style.setProperty(`--ntk-text-${key}`, value)
  })
  
  // Weights
  Object.entries(config.weights).forEach(([key, value]) => {
    root.style.setProperty(`--ntk-font-${key}`, String(value))
  })
  
  // Line heights
  Object.entries(config.lineHeights).forEach(([key, value]) => {
    root.style.setProperty(`--ntk-leading-${key}`, String(value))
  })
  
  // Letter spacing
  Object.entries(config.letterSpacing).forEach(([key, value]) => {
    root.style.setProperty(`--ntk-tracking-${key}`, value)
  })
}