/**
 * NTK Theme Plugin
 * Vue plugin for global theme configuration.
 * 
 * USAGE:
 * import { NtkThemePlugin } from 'nettoolskit-ui-vue';
 * 
 * app.use(NtkThemePlugin, {
 *   primary: '#0D47A1',
 *   primaryGradient: ['#0D47A1', '#7B74D4'],
 *   dark: false
 * });
 */

import type { App, Plugin } from 'vue';
import { syncThemeDomState } from './theme-dom';

/**
 * Theme configuration options.
 */
export interface NtkThemeOptions {
  /** Main primary color */
  primary?: string;
  /** Dark primary color (hover) */
  primaryDark?: string;
  /** Light primary color */
  primaryLight?: string;
  /** Primary gradient [start, end] */
  primaryGradient?: [string, string];
  /** Secondary color */
  secondary?: string;
  /** Main background color */
  background?: string;
  /** Secondary background color */
  backgroundSecondary?: string;
  /** Main text color */
  textPrimary?: string;
  /** Secondary text color */
  textSecondary?: string;
  /** Border color */
  borderColor?: string;
  /** Enable dark mode */
  dark?: boolean;
  /** Main font family */
  fontFamily?: string;
  /** Display/title font family */
  fontFamilyDisplay?: string;
}

/**
 * Applies theme options as CSS variables.
 */
function applyThemeOptions(options: NtkThemeOptions): void {
  const themeVars: Record<string, string | null | undefined> = {
    '--ntk-primary': options.primary,
    '--ntk-primary-dark': options.primaryDark,
    '--ntk-primary-light': options.primaryLight,
    '--ntk-secondary': options.secondary,
    '--ntk-bg-primary': options.background,
    '--ntk-bg-secondary': options.backgroundSecondary,
    '--ntk-text-primary': options.textPrimary,
    '--ntk-text-secondary': options.textSecondary,
    '--ntk-border-color': options.borderColor,
    '--ntk-font-family': options.fontFamily,
    '--ntk-font-family-display': options.fontFamilyDisplay,
  };

  if (options.primaryGradient) {
    const [start, end] = options.primaryGradient;
    themeVars['--ntk-primary-gradient-start'] = start;
    themeVars['--ntk-primary-gradient-end'] = end;
    themeVars['--ntk-primary-gradient'] = `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
    themeVars['--ntk-primary-gradient-hover'] = `linear-gradient(135deg, ${options.primaryDark || start} 0%, ${start} 100%)`;
    themeVars['--ntk-gradient-accent'] = `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;
  }

  syncThemeDomState({
    dark: options.dark,
    structuralBackground: options.background,
    structuralText: options.textPrimary,
    themeVars,
  });
}

function applyPrimaryColor(color: string): void {
  syncThemeDomState({
    themeVars: {
      '--ntk-primary': color,
    },
  });
}

function applyPrimaryGradient(start: string, end: string): void {
  syncThemeDomState({
    themeVars: {
      '--ntk-primary': start,
      '--ntk-accent': end,
      '--ntk-primary-gradient-start': start,
      '--ntk-primary-gradient-end': end,
      '--ntk-primary-gradient': `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
      '--ntk-gradient-accent': `linear-gradient(135deg, ${start} 0%, ${end} 100%)`,
    },
  });
}

/**
 * Vue plugin for theme configuration.
 */
export const NtkThemePlugin: Plugin = {
  install(app: App, options: NtkThemeOptions = {}) {
    // Apply the initial theme options.
    applyThemeOptions(options);
    
    // Expose runtime theme update helpers.
    app.config.globalProperties.$ntkTheme = {
      update: applyThemeOptions,
      setDark: (dark: boolean) => {
        syncThemeDomState({
          dark,
        });
      },
      setPrimary: applyPrimaryColor,
      setGradient: applyPrimaryGradient,
    };
    
    // Provide for the Composition API.
    app.provide('ntkTheme', app.config.globalProperties.$ntkTheme);
  }
};

/**
 * Composable for accessing theme helpers.
 */
export function useNtkTheme() {
  return {
    /**
     * Updates multiple theme options.
     */
    update: applyThemeOptions,
    
    /**
     * Sets dark mode.
     */
    setDark: (dark: boolean) => {
      syncThemeDomState({
        dark,
      });
    },
    
    /**
     * Sets the primary color.
     */
    setPrimary: applyPrimaryColor,
    
    /**
     * Sets the primary gradient.
     */
    setGradient: applyPrimaryGradient,
    
    /**
     * Gets a CSS variable value.
     */
    getVar: (name: string): string => {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    },
    
    /**
     * Sets a custom CSS variable.
     */
    setVar: (name: string, value: string) => {
      document.documentElement.style.setProperty(name, value);
    }
  };
}

export default NtkThemePlugin;
