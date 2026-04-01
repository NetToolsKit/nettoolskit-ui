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
 * Based on NetToolsKit tokens.scss :root values
 */
export const lightThemeColors: ThemeColorPalette = {
  // Primary Brand Colors
  primary: '#512BD4',
  primaryDark: '#3B1F9E',
  primaryLight: '#7B74D4',
  
  // Background Colors (whites and light grays)
  background: '#ffffff',
  backgroundSecondary: '#e5e7eb',
  backgroundTertiary: '#f3f4f6',
  backgroundCard: '#fafafa',
  backgroundHover: '#ffffff',
  
  // Text Colors (blacks and dark grays)
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  textInverse: '#ffffff',
  textOnPrimary: '#ffffff',
  
  // Border Colors
  border: '#e5e7eb',
  borderLight: '#e5e7eb',
  borderDark: '#e5e7eb',
  borderFocus: '#512BD4',
  
  // Component-Specific Colors
  chipBackground: '#f1f5f9',
  chipText: '#424242',
  cardShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
  menuBackground: '#ffffff',
}

/**
 * Predefined Dark Theme Colors
 * Based on NetToolsKit tokens.scss .dark values
 */
export const darkThemeColors: ThemeColorPalette = {
  // Primary Brand Colors
  primary: '#7B74D4',
  primaryDark: '#3B1F9E',
  primaryLight: '#9d96e6',
  
  // Background Colors (blacks and dark grays)
  background: '#0f172a',
  backgroundSecondary: '#1e293b',
  backgroundTertiary: '#334155',
  backgroundCard: '#1e293b',
  backgroundHover: '#334155',
  
  // Text Colors (whites and light grays)
  textPrimary: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textMuted: '#94a3b8',
  textInverse: '#0f172a',
  textOnPrimary: '#ffffff',
  
  // Border Colors
  border: '#334155',
  borderLight: '#475569',
  borderDark: '#1e293b',
  borderFocus: '#7B74D4',
  
  // Component-Specific Colors
  chipBackground: '#334155',
  chipText: '#f1f5f9',
  cardShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
  menuBackground: '#1e293b',
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