/**
 * Base Color Palettes Configuration
 * 
 * Pure color values organized by brand without theme dependency.
 * These palettes serve as the foundation for theme modes and semantic colors.
 * 
 * ## Purpose
 * Centralize brand-specific color values that can be:
 * - Used across different themes (light/dark)
 * - Referenced by semantic colors
 * - Applied to brand-specific components
 * - Composed into complete color systems
 * 
 * ## Responsibility (Single Responsibility Principle)
 * ONLY stores raw color values. Does NOT include:
 * - Theme-dependent colors (backgrounds, text) → see theme-mode.config.ts
 * - Semantic colors (success, error) → see semantic.config.ts
 * - Visual effects (gradients, shadows) → see ../visual/effects.config.ts
 * 
 * ## Usage
 * ```typescript
 * import { sentinelaPalette, plateaPalette } from '@/config/colors/palette.config'
 * 
 * // Use brand primary color
 * const primaryColor = sentinelaPalette.primary[500]
 * 
 * // Create custom theme using palette
 * const customTheme = {
 *   primary: sentinelaPalette.primary[600],
 *   accent: sentinelaPalette.accent[400]
 * }
 * ```
 * 
 * @module colors/palette.config
 */

// ============================
// Color Scale Interface
// ============================

/**
 * Color Scale
 * 
 * Standard color scale from light to dark (50-900).
 * Follows Tailwind CSS convention for consistency and familiarity.
 * 
 * @example
 * ```typescript
 * const blues: ColorScale = {
 *   50: '#E3F2FD',   // Lightest
 *   100: '#BBDEFB',
 *   200: '#90CAF9',
 *   300: '#64B5F6',
 *   400: '#42A5F5',
 *   500: '#2196F3',  // Base/Primary
 *   600: '#1E88E5',
 *   700: '#1976D2',
 *   800: '#1565C0',
 *   900: '#0D47A1'   // Darkest
 * }
 * ```
 */
export interface ColorScale {
  /** Lightest shade - backgrounds, hover states */
  50: string
  
  /** Very light - subtle backgrounds */
  100: string
  
  /** Light - disabled states, borders */
  200: string
  
  /** Light-medium - secondary borders */
  300: string
  
  /** Medium-light - hover states */
  400: string
  
  /** Base color - primary brand color */
  500: string
  
  /** Medium-dark - active states */
  600: string
  
  /** Dark - emphasis, headings */
  700: string
  
  /** Darker - strong emphasis */
  800: string
  
  /** Darkest - maximum contrast */
  900: string
}

// ============================
// Brand Palette Interface
// ============================

/**
 * Brand Color Palette
 * 
 * Complete color system for a brand including:
 * - Primary: Main brand color
 * - Secondary: Supporting color
 * - Accent: Call-to-action and highlights
 * - Neutral: Grays for text, borders, backgrounds
 * 
 * Each property is a ColorScale with shades from 50 to 900.
 */
export interface BrandPalette {
  /** Primary brand color scale */
  primary: ColorScale
  
  /** Secondary supporting color scale */
  secondary: ColorScale
  
  /** Accent color for CTAs and highlights */
  accent: ColorScale
  
  /** Neutral grays for text and UI elements */
  neutral: ColorScale
}

// ============================
// Sentinela Palette
// ============================

/**
 * Sentinela Brand Palette
 * 
 * Professional blue palette for monitoring and search applications.
 * Based on Material Design blue and slate gray scales.
 * 
 * **Primary**: Deep blue (#0D47A1) - Trust, stability, corporate
 * **Secondary**: Cool gray - Professional, clean, modern
 * **Accent**: Bright blue - Call to action, interactive elements
 * **Neutral**: Slate gray - Text, borders, backgrounds
 * 
 * @example
 * ```typescript
 * import { sentinelaPalette } from '@/config/colors/palette.config'
 * 
 * const button = {
 *   background: sentinelaPalette.primary[700],
 *   hover: sentinelaPalette.primary[800],
 *   text: sentinelaPalette.neutral[50]
 * }
 * ```
 */
export const sentinelaPalette: BrandPalette = {
  // Primary: Deep Blue (Material Blue 900 base)
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3',
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  
  // Secondary: Cool Gray
  secondary: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  
  // Accent: Bright Blue
  accent: {
    50: '#E1F5FE',
    100: '#B3E5FC',
    200: '#81D4FA',
    300: '#4FC3F7',
    400: '#29B6F6',
    500: '#03A9F4',
    600: '#039BE5',
    700: '#0288D1',
    800: '#0277BD',
    900: '#01579B',
  },
  
  // Neutral: Slate (same as secondary for consistency)
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
}

// ============================
// PlaTEA Palette
// ============================

/**
 * PlaTEA Brand Palette
 * 
 * Calm green palette for accessibility and organization applications.
 * Warm, welcoming colors promoting focus and tranquility.
 * 
 * **Primary**: Teal green (#4A9B7F) - Growth, calm, nature
 * **Secondary**: Warm beige - Comfort, neutrality, accessibility
 * **Accent**: Bright green - Action, success, positive feedback
 * **Neutral**: Warm gray - Soft contrast, readability
 * 
 * @example
 * ```typescript
 * import { plateaPalette } from '@/config/colors/palette.config'
 * 
 * const card = {
 *   background: plateaPalette.neutral[50],
 *   border: plateaPalette.primary[200],
 *   heading: plateaPalette.primary[800]
 * }
 * ```
 */
export const plateaPalette: BrandPalette = {
  // Primary: Teal Green
  primary: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4A9B7F',
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },
  
  // Secondary: Warm Beige
  secondary: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#F5F3F0',
    500: '#E8E6E2',
    600: '#D4D2CE',
    700: '#B8B6B2',
    800: '#9C9A96',
    900: '#7A7874',
  },
  
  // Accent: Bright Green
  accent: {
    50: '#F1F8E9',
    100: '#DCEDC8',
    200: '#C5E1A5',
    300: '#AED581',
    400: '#9CCC65',
    500: '#8BC34A',
    600: '#7CB342',
    700: '#689F38',
    800: '#558B2F',
    900: '#33691E',
  },
  
  // Neutral: Warm Gray
  neutral: {
    50: '#FAFAF9',
    100: '#F5F5F4',
    200: '#E7E5E4',
    300: '#D6D3D1',
    400: '#A8A29E',
    500: '#78716C',
    600: '#57534E',
    700: '#44403C',
    800: '#292524',
    900: '#1C1917',
  },
}

// ============================
// NetToolsKit Palette
// ============================

/**
 * NetToolsKit UI Brand Palette
 * 
 * Modern purple palette for design system and component library.
 * Vibrant, creative colors that work well for developer tools.
 * 
 * **Primary**: Rich purple (#512BD4) - Creativity, innovation, tech
 * **Secondary**: Deep slate - Professional, modern, tech-focused
 * **Accent**: Vibrant purple - Interactive, dynamic, engaging
 * **Neutral**: Cool gray - Clean, minimal, developer-friendly
 * 
 * @example
 * ```typescript
 * import { nettoolskitPalette } from '@/config/colors/palette.config'
 * 
 * const component = {
 *   primary: nettoolskitPalette.primary[600],
 *   hover: nettoolskitPalette.primary[700],
 *   focus: nettoolskitPalette.accent[500]
 * }
 * ```
 */
export const nettoolskitPalette: BrandPalette = {
  // Primary: Rich Purple
  primary: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#512BD4',
    600: '#8E24AA',
    700: '#7B1FA2',
    800: '#6A1B9A',
    900: '#4A148C',
  },
  
  // Secondary: Deep Slate
  secondary: {
    50: '#ECEFF1',
    100: '#CFD8DC',
    200: '#B0BEC5',
    300: '#90A4AE',
    400: '#78909C',
    500: '#607D8B',
    600: '#546E7A',
    700: '#455A64',
    800: '#37474F',
    900: '#263238',
  },
  
  // Accent: Vibrant Purple
  accent: {
    50: '#EDE7F6',
    100: '#D1C4E9',
    200: '#B39DDB',
    300: '#9575CD',
    400: '#7E57C2',
    500: '#7B74D4',
    600: '#5E35B1',
    700: '#512DA8',
    800: '#4527A0',
    900: '#311B92',
  },
  
  // Neutral: Cool Gray (same as Sentinela)
  neutral: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
}

// ============================
// Palette Registry
// ============================

/**
 * All Available Palettes
 * 
 * Registry of all brand palettes for easy access.
 * Use this when you need to switch between brands dynamically.
 * 
 * @example
 * ```typescript
 * import { palettes } from '@/config/colors/palette.config'
 * 
 * const currentBrand = 'sentinela'
 * const brandColors = palettes[currentBrand]
 * ```
 */
export const palettes = {
  sentinela: sentinelaPalette,
  platea: plateaPalette,
  nettoolskit: nettoolskitPalette,
} as const

export type PaletteName = keyof typeof palettes

/**
 * Get Palette by Name
 * 
 * Helper function to retrieve a palette by its name.
 * Useful for dynamic brand switching.
 * 
 * @param name - Name of the palette to retrieve
 * @returns The requested brand palette
 * 
 * @example
 * ```typescript
 * import { getPalette } from '@/config/colors/palette.config'
 * 
 * const brand = 'platea'
 * const colors = getPalette(brand)
 * console.log(colors.primary[500]) // '#4A9B7F'
 * ```
 */
export function getPalette(name: PaletteName): BrandPalette {
  return palettes[name]
}