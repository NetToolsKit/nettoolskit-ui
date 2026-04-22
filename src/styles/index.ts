/**
 * Shared Styles Export
 * 
 * This file centralizes the shared project styles.
 * 
 * TOKEN SYSTEM:
 * - tokens.scss: global CSS custom properties (--ntk-*)
 * - global.scss: reset and global styles
 * 
 * PROJECT USAGE:
 * 1. Import the styles in main.ts or App.vue:
 *    @import 'nettoolskit-ui-vue/src/styles/tokens.scss';
 *    @import 'nettoolskit-ui-vue/src/styles/global.scss';
 * 
 * 2. Prefer preset/theme CSS variables for runtime branding:
 *    :root { --ntk-primary: var(--brand-primary); }
 * 
 * 3. Legacy plugin-based theme writes remain available for existing apps,
 *    but new template runtime work should use the preset-driven model.
 */

/**
 * Design Tokens - default values
 * Use CSS custom properties (--ntk-*) for runtime customization.
 */
export const DESIGN_TOKENS = {
  colors: {
    // Primary
    primary: '#0f766e',
    primaryDark: '#115e59',
    primaryLight: '#2dd4bf',
    
    // Secondary
    secondary: '#0f766e',
    secondaryDark: '#115e59',
    secondaryLight: '#2dd4bf',
    
    // Backgrounds
    bgPrimary: '#ffffff',
    bgSecondary: '#f1f5f9',
    bgTertiary: '#f8fafc',
    
    // Text
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    textInverse: '#ffffff',
    textOnPrimary: '#ffffff',
    
    // Borders
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    borderDark: '#cbd5e1',
    
    // Feedback
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#14b8a6',
    
    // Footer
    footerBg: '#0f172a',
    footerText: '#f8fafc',
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #134e4a 0%, #14b8a6 100%)',
    hero: 'linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)',
    loading: 'linear-gradient(90deg, #f1f5f9 0%, #f8fafc 50%, #f1f5f9 100%)',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    base: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
  
  fonts: {
    family: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    familyDisplay: "'Sora', 'Plus Jakarta Sans', sans-serif",
    familyMono: "'Fira Code', 'Consolas', 'Monaco', monospace",
  },
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;

/**
 * CSS Variable Names
 * Nomes das variáveis CSS para referência
 */
export const CSS_VARS = {
  // Primary
  primary: '--ntk-primary',
  primaryDark: '--ntk-primary-dark',
  primaryLight: '--ntk-primary-light',
  primaryGradient: '--ntk-primary-gradient',
  primaryGradientStart: '--ntk-primary-gradient-start',
  primaryGradientEnd: '--ntk-primary-gradient-end',
  
  // Backgrounds
  bgPrimary: '--ntk-bg-primary',
  bgSecondary: '--ntk-bg-secondary',
  bgCard: '--ntk-bg-card',
  
  // Text
  textPrimary: '--ntk-text-primary',
  textSecondary: '--ntk-text-secondary',
  textOnPrimary: '--ntk-text-on-primary',
  
  // Borders
  borderColor: '--ntk-border-color',
  
  // Shadows
  shadowSm: '--ntk-shadow-sm',
  shadowMd: '--ntk-shadow-md',
  shadowLg: '--ntk-shadow-lg',
  
  // Radius
  radiusSm: '--ntk-radius-sm',
  radiusMd: '--ntk-radius-md',
  radiusLg: '--ntk-radius-lg',
} as const;

/**
 * Helper para obter valor de variável CSS
 */
export function getCssVar(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Helper para definir variável CSS
 */
export function setCssVar(name: string, value: string): void {
  document.documentElement.style.setProperty(name, value);
}
