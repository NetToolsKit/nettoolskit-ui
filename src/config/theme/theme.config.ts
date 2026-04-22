/**
 * Theme Configuration Adapter
 * 
 * Consolidates color palettes, brand identities, and semantic colors
 * into complete theme configurations that can be applied dynamically.
 * 
 * This adapter bridges the granular configuration system with the
 * useTheme composable, providing backward compatibility while
 * maintaining the benefits of the modular config structure.
 * 
 * @module theme/theme.config
 */

import type { BrandPalette } from '../colors/palette.config';
import { sentinelaPalette, plateaPalette, nettoolskitPalette } from '../colors/palette.config';
import { semanticColors } from '../colors/semantic.config';
import type { BrandIdentity } from '../brand/identity.config';
import { sentinelaIdentity, plateaIdentity, nettoolskitIdentity } from '../brand/identity.config';

// ============================
// Theme Interfaces
// ============================

/**
 * Complete Theme Configuration
 * 
 * Combines brand identity, colors, and visual settings
 * into a cohesive theme that can be applied to the application.
 */
export interface ThemeConfig {
  /** Theme identifier */
  name: string;
  
  /** Brand identity information */
  identity: BrandIdentity;
  
  /** Color palette */
  palette: BrandPalette;
  
  /** Theme colors (derived from palette) */
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    accent: string;
    background: string;
    backgroundLight: string;
    text: string;
    textLight: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  
  /** Typography settings */
  fonts: {
    display: string;
    body: string;
  };
  
  /** Gradient definitions */
  gradients: {
    hero: string;
    primary: string;
    loading: string;
  };
}

// ============================
// Theme Configurations
// ============================

const revolutPalette: BrandPalette = {
  primary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0f766e',
    700: '#115e59',
    800: '#134e4a',
    900: '#0f3f3c',
  },
  secondary: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0f766e',
    700: '#115e59',
    800: '#134e4a',
    900: '#0f3f3c',
  },
  accent: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#14b8a6',
    600: '#0f766e',
    700: '#115e59',
    800: '#134e4a',
    900: '#0f3f3c',
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
};

const revolutIdentity: BrandIdentity = {
  name: 'revolut',
  displayName: 'Revolut',
  tagline: 'Financial operating system',
  logo: {
    type: 'letter',
    value: 'R',
    alt: 'Revolut Logo',
    size: 'md',
  },
  description: 'Revolut-inspired neutral fintech baseline for preset-driven white-label interfaces.',
  url: 'https://www.revolut.com',
  version: '1.0.0',
  copyright: 'NetToolsKit UI',
  license: 'MIT',
};

/**
 * Revolut Theme
 *
 * Default teal fintech baseline used when no host theme is selected.
 */
export const revolutTheme: ThemeConfig = {
  name: 'revolut',
  identity: revolutIdentity,
  palette: revolutPalette,
  colors: {
    primary: revolutPalette.primary[600],
    primaryDark: revolutPalette.primary[700],
    primaryLight: revolutPalette.primary[400],
    secondary: revolutPalette.primary[600],
    accent: revolutPalette.accent[500],
    background: revolutPalette.neutral[100],
    backgroundLight: revolutPalette.neutral[50],
    text: revolutPalette.neutral[900],
    textLight: revolutPalette.neutral[700],
    textMuted: revolutPalette.neutral[500],
    border: revolutPalette.neutral[200],
    success: '#10b981',
    warning: '#f59e0b',
    error: semanticColors.errorPrimary,
    info: revolutPalette.accent[500],
  },
  fonts: {
    display: 'Sora',
    body: 'Plus Jakarta Sans',
  },
  gradients: {
    hero: `linear-gradient(135deg, ${revolutPalette.neutral[100]} 0%, #ffffff 100%)`,
    primary: `linear-gradient(135deg, ${revolutPalette.primary[800]} 0%, ${revolutPalette.accent[500]} 100%)`,
    loading: `linear-gradient(90deg, ${revolutPalette.neutral[100]} 0%, ${revolutPalette.neutral[50]} 50%, ${revolutPalette.neutral[100]} 100%)`,
  },
};

/**
 * Sentinela Theme
 * 
 * Professional blue theme for search and monitoring applications.
 */
export const sentinelaTheme: ThemeConfig = {
  name: 'sentinela',
  identity: sentinelaIdentity,
  palette: sentinelaPalette,
  colors: {
    primary: sentinelaPalette.primary[700],
    primaryDark: sentinelaPalette.primary[800],
    primaryLight: sentinelaPalette.primary[600],
    secondary: sentinelaPalette.secondary[500],
    accent: sentinelaPalette.accent[600],
    background: sentinelaPalette.neutral[50],
    backgroundLight: sentinelaPalette.neutral[100],
    text: sentinelaPalette.neutral[900],
    textLight: sentinelaPalette.neutral[700],
    textMuted: sentinelaPalette.neutral[500],
    border: sentinelaPalette.neutral[200],
    success: semanticColors.successPrimary,
    warning: semanticColors.warningPrimary,
    error: semanticColors.errorPrimary,
    info: sentinelaPalette.accent[500],
  },
  fonts: {
    display: 'Sora',
    body: 'Plus Jakarta Sans',
  },
  gradients: {
    hero: `linear-gradient(135deg, ${sentinelaPalette.primary[800]} 0%, ${sentinelaPalette.primary[600]} 100%)`,
    primary: `linear-gradient(135deg, ${sentinelaPalette.primary[700]} 0%, ${sentinelaPalette.accent[600]} 100%)`,
    loading: `linear-gradient(90deg, ${sentinelaPalette.neutral[100]} 0%, ${sentinelaPalette.neutral[200]} 50%, ${sentinelaPalette.neutral[100]} 100%)`,
  },
};

/**
 * PlaTEA Theme
 * 
 * Warm, accessible theme for visual agenda application.
 */
export const plateaTheme: ThemeConfig = {
  name: 'platea',
  identity: plateaIdentity,
  palette: plateaPalette,
  colors: {
    primary: plateaPalette.primary[600],
    primaryDark: plateaPalette.primary[700],
    primaryLight: plateaPalette.primary[500],
    secondary: plateaPalette.secondary[500],
    accent: plateaPalette.accent[500],
    background: plateaPalette.neutral[50],
    backgroundLight: plateaPalette.neutral[100],
    text: plateaPalette.neutral[900],
    textLight: plateaPalette.neutral[700],
    textMuted: plateaPalette.neutral[500],
    border: plateaPalette.neutral[200],
    success: semanticColors.successPrimary,
    warning: semanticColors.warningPrimary,
    error: semanticColors.errorPrimary,
    info: plateaPalette.accent[500],
  },
  fonts: {
    display: 'Sora',
    body: 'Plus Jakarta Sans',
  },
  gradients: {
    hero: `linear-gradient(135deg, ${plateaPalette.primary[700]} 0%, ${plateaPalette.primary[500]} 100%)`,
    primary: `linear-gradient(135deg, ${plateaPalette.primary[600]} 0%, ${plateaPalette.accent[500]} 100%)`,
    loading: `linear-gradient(90deg, ${plateaPalette.neutral[100]} 0%, ${plateaPalette.neutral[200]} 50%, ${plateaPalette.neutral[100]} 100%)`,
  },
};

/**
 * NetToolsKit Theme
 * 
 * Modern purple theme for component library showcase.
 */
export const nettoolskitTheme: ThemeConfig = {
  name: 'nettoolskit',
  identity: nettoolskitIdentity,
  palette: nettoolskitPalette,
  colors: {
    primary: nettoolskitPalette.primary[600],
    primaryDark: nettoolskitPalette.primary[700],
    primaryLight: nettoolskitPalette.primary[500],
    secondary: nettoolskitPalette.secondary[600],
    accent: nettoolskitPalette.accent[500],
    background: nettoolskitPalette.neutral[50],
    backgroundLight: nettoolskitPalette.neutral[100],
    text: nettoolskitPalette.neutral[900],
    textLight: nettoolskitPalette.neutral[700],
    textMuted: nettoolskitPalette.neutral[500],
    border: nettoolskitPalette.neutral[200],
    success: semanticColors.successPrimary,
    warning: semanticColors.warningPrimary,
    error: semanticColors.errorPrimary,
    info: nettoolskitPalette.accent[500],
  },
  fonts: {
    display: 'Sora',
    body: 'Plus Jakarta Sans',
  },
  gradients: {
    hero: `linear-gradient(135deg, ${nettoolskitPalette.primary[700]} 0%, ${nettoolskitPalette.accent[600]} 100%)`,
    primary: `linear-gradient(135deg, ${nettoolskitPalette.primary[600]} 0%, ${nettoolskitPalette.accent[500]} 100%)`,
    loading: `linear-gradient(90deg, ${nettoolskitPalette.neutral[100]} 0%, ${nettoolskitPalette.neutral[200]} 50%, ${nettoolskitPalette.neutral[100]} 100%)`,
  },
};

// ============================
// Theme Registry
// ============================

/**
 * Available Themes
 * 
 * Registry of all theme configurations.
 */
export const themes = {
  revolut: revolutTheme,
  sentinela: sentinelaTheme,
  platea: plateaTheme,
  nettoolskit: nettoolskitTheme,
} as const;

/**
 * Theme Name Type
 * 
 * Union type of all available theme names.
 */
export type ThemeName = keyof typeof themes;

/**
 * Default Theme
 * 
 * Theme used when no specific theme is selected.
 */
export const defaultTheme = revolutTheme;

/**
 * Get Theme by Name
 * 
 * Retrieves a theme configuration by its name.
 * 
 * @param name - Theme name
 * @returns Theme configuration
 * 
 * @example
 * ```typescript
 * const theme = getTheme('sentinela');
 * console.log(theme.colors.primary); // '#1976D2'
 * ```
 */
export function getTheme(name: ThemeName): ThemeConfig {
  return themes[name];
}
