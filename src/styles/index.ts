/**
 * Shared Styles Export
 * 
 * Este arquivo centraliza os estilos compartilhados do projeto.
 * 
 * SISTEMA DE TOKENS:
 * - tokens.scss: Variáveis CSS globais (--ntk-*)
 * - design-system.scss: Estilos base e utilitários
 * - global.scss: Reset e estilos globais
 * 
 * USO EM PROJETOS:
 * 1. Importe os estilos no main.ts ou App.vue:
 *    @import 'nettoolskit-ui-vue/src/styles/tokens.scss';
 *    @import 'nettoolskit-ui-vue/src/styles/design-system.scss';
 * 
 * 2. Use o plugin para customizar cores:
 *    import { NtkThemePlugin } from 'nettoolskit-ui-vue';
 *    app.use(NtkThemePlugin, { primary: '#0D47A1', primaryGradient: ['#0D47A1', '#7B74D4'] });
 * 
 * 3. Ou sobrescreva variáveis CSS diretamente:
 *    :root { --ntk-primary: #0D47A1; }
 */

/**
 * Design Tokens - Valores padrão
 * Use CSS Custom Properties (--ntk-*) para customização em runtime
 */
export const DESIGN_TOKENS = {
  colors: {
    // Primary
    primary: '#512BD4',
    primaryDark: '#3B1F9E',
    primaryLight: '#7B74D4',
    
    // Secondary
    secondary: '#64748b',
    secondaryDark: '#475569',
    secondaryLight: '#94a3b8',
    
    // Backgrounds
    bgPrimary: '#ffffff',
    bgSecondary: '#f8fafc',
    bgTertiary: '#f1f5f9',
    
    // Text
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    textInverse: '#ffffff',
    textOnPrimary: '#ffffff',
    
    // Borders
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    borderDark: '#cbd5e1',
    
    // Feedback
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Footer
    footerBg: '#1a1a2e',
    footerText: '#e0e0e0',
    
    // Legacy (retrocompatibilidade)
    white: '#ffffff',
    background: '#f5f7fa',
    gradientStart: '#f5f7fa',
    gradientEnd: '#c3cfe2',
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #512BD4 0%, #7B74D4 100%)',
    hero: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    loading: 'linear-gradient(90deg, #f8fafc 0%, #f1f5f9 50%, #f8fafc 100%)',
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
    family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    familyDisplay: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    familyMono: "'Fira Code', 'Consolas', 'Monaco', monospace",
  },
  
  // Legacy (retrocompatibilidade)
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
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