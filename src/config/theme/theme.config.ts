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
    background: '#FFFFFF',
    backgroundLight: sentinelaPalette.neutral[50],
    text: sentinelaPalette.neutral[900],
    textLight: sentinelaPalette.neutral[700],
    textMuted: sentinelaPalette.neutral[500],
    border: sentinelaPalette.neutral[200],
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    info: sentinelaPalette.accent[500],
  },
  fonts: {
    display: 'Poppins',
    body: 'Inter',
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
    background: '#FFFFFF',
    backgroundLight: plateaPalette.neutral[50],
    text: plateaPalette.neutral[900],
    textLight: plateaPalette.neutral[700],
    textMuted: plateaPalette.neutral[500],
    border: plateaPalette.neutral[200],
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    info: plateaPalette.accent[500],
  },
  fonts: {
    display: 'Poppins',
    body: 'Inter',
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
    background: '#FFFFFF',
    backgroundLight: nettoolskitPalette.neutral[50],
    text: nettoolskitPalette.neutral[900],
    textLight: nettoolskitPalette.neutral[700],
    textMuted: nettoolskitPalette.neutral[500],
    border: nettoolskitPalette.neutral[200],
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    info: nettoolskitPalette.accent[500],
  },
  fonts: {
    display: 'Poppins',
    body: 'Inter',
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
export const defaultTheme = nettoolskitTheme;

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