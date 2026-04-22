/**
 * Global Theme Color Configuration
 * 
 * Predefined color palettes for light and dark themes
 * Based on NetToolsKit design tokens
 * 
 * RESPONSIBILITY: Theme-dependent colors (light/dark mode)
 * - Primary brand colors
 * - Background colors (whites/blacks, grays)
 * - Text colors (contrasting with backgrounds)
 * - Border colors
 * - Component-specific theme colors
 * 
 * NOT included here:
 * - Semantic colors (success, warning, error, info) → see semantic-colors.config.ts
 * - Notification/Popup configs → see notification.config.ts
 * 
 * Usage:
 * import { themeColors } from '@/config/theme-colors.config'
 * 
 * Override example:
 * themeColors.light.primary = '#0D47A1'
 * themeColors.dark.background = '#000000'
 */

export interface ThemeColorPalette {
  // Primary Brand Colors
  primary: string
  primaryDark: string
  primaryLight: string
  secondary: string
  secondaryDark: string
  secondaryLight: string
  
  // Background Colors (whites/blacks & grays)
  background: string
  backgroundSecondary: string
  backgroundTertiary: string
  backgroundCard: string
  backgroundHover: string
  
  // Text Colors (contrasting with backgrounds)
  textPrimary: string
  textSecondary: string
  textMuted: string
  textInverse: string
  textOnPrimary: string
  
  // Border Colors
  border: string
  borderLight: string
  borderDark: string
  borderFocus: string
  
  // Component-Specific Colors
  chipBackground: string
  chipText: string
  cardShadow: string
  menuBackground: string
}

/**
 * Predefined Light Theme Colors
 * Based on the preset-driven Revolut fallback tokens.
 */
export const lightThemeColors: ThemeColorPalette = {
  // Primary Brand Colors
  primary: '#0f766e',
  primaryDark: '#115e59',
  primaryLight: '#2dd4bf',
  secondary: '#0f766e',
  secondaryDark: '#115e59',
  secondaryLight: '#2dd4bf',
  
  // Background Colors (whites and light grays)
  background: '#ffffff',
  backgroundSecondary: '#f1f5f9',
  backgroundTertiary: '#f8fafc',
  backgroundCard: '#ffffff',
  backgroundHover: '#f1f5f9',
  
  // Text Colors (blacks and dark grays)
  textPrimary: '#0f172a',
  textSecondary: '#334155',
  textMuted: '#64748b',
  textInverse: '#ffffff',
  textOnPrimary: '#ffffff',
  
  // Border Colors
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  borderDark: '#cbd5e1',
  borderFocus: '#0f766e',
  
  // Component-Specific Colors
  chipBackground: '#f8fafc',
  chipText: '#334155',
  cardShadow: '0 4px 8px rgba(15, 23, 42, 0.12)',
  menuBackground: '#ffffff',
}

/**
 * Predefined Dark Theme Colors
 * Based on the preset-driven Revolut dark fallback tokens.
 */
export const darkThemeColors: ThemeColorPalette = {
  // Primary Brand Colors
  primary: '#14b8a6',
  primaryDark: '#0f766e',
  primaryLight: '#5eead4',
  secondary: '#14b8a6',
  secondaryDark: '#0f766e',
  secondaryLight: '#5eead4',
  
  // Background Colors (blacks and dark grays)
  background: '#0e0e0d',
  backgroundSecondary: '#141413',
  backgroundTertiary: '#1a1a19',
  backgroundCard: '#1a1a19',
  backgroundHover: '#242422',
  
  // Text Colors (whites and light grays)
  textPrimary: '#faf9f6',
  textSecondary: '#c8c8c4',
  textMuted: '#8a8a86',
  textInverse: '#0e0e0d',
  textOnPrimary: '#0e0e0d',
  
  // Border Colors
  border: 'rgba(226, 226, 226, 0.12)',
  borderLight: 'rgba(226, 226, 226, 0.08)',
  borderDark: 'rgba(226, 226, 226, 0.22)',
  borderFocus: '#14b8a6',
  
  // Component-Specific Colors
  chipBackground: '#242422',
  chipText: '#faf9f6',
  cardShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  menuBackground: '#1a1a19',
}

/**
 * Global Theme Colors Object
 * Can be overridden at runtime
 * 
 * Example:
 * import { themeColors } from '@/config/theme-colors.config'
 * themeColors.light.primary = '#custom-color'
 */
export const themeColors = {
  light: lightThemeColors,
  dark: darkThemeColors,
}

/**
 * Helper function to apply theme colors to CSS variables
 * Updates --ntk-* custom properties
 */
export function applyThemeColors(theme: 'light' | 'dark'): void {
  const colors = themeColors[theme]
  const root = document.documentElement
  
  // Apply all colors as CSS variables
  root.style.setProperty('--ntk-primary', colors.primary)
  root.style.setProperty('--ntk-primary-dark', colors.primaryDark)
  root.style.setProperty('--ntk-primary-light', colors.primaryLight)
  root.style.setProperty('--ntk-secondary', colors.secondary)
  root.style.setProperty('--ntk-secondary-dark', colors.secondaryDark)
  root.style.setProperty('--ntk-secondary-light', colors.secondaryLight)
  
  root.style.setProperty('--ntk-bg-primary', colors.background)
  root.style.setProperty('--ntk-bg-secondary', colors.backgroundSecondary)
  root.style.setProperty('--ntk-bg-tertiary', colors.backgroundTertiary)
  root.style.setProperty('--ntk-bg-card', colors.backgroundCard)
  root.style.setProperty('--ntk-bg-hover', colors.backgroundHover)
  
  root.style.setProperty('--ntk-text-primary', colors.textPrimary)
  root.style.setProperty('--ntk-text-secondary', colors.textSecondary)
  root.style.setProperty('--ntk-text-muted', colors.textMuted)
  root.style.setProperty('--ntk-text-inverse', colors.textInverse)
  root.style.setProperty('--ntk-text-on-primary', colors.textOnPrimary)
  
  root.style.setProperty('--ntk-border-color', colors.border)
  root.style.setProperty('--ntk-border-light', colors.borderLight)
  root.style.setProperty('--ntk-border-dark', colors.borderDark)
  root.style.setProperty('--ntk-border-focus', colors.borderFocus)
}

/**
 * Helper to get current theme colors
 */
export function getCurrentThemeColors(isDark: boolean): ThemeColorPalette {
  return isDark ? themeColors.dark : themeColors.light
}

export default themeColors
