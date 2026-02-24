/**
 * NTK Theme Plugin
 * Plugin Vue para configuração global de temas
 * 
 * USO:
 * import { NtkThemePlugin } from 'nettoolskit-ui-vue';
 * 
 * app.use(NtkThemePlugin, {
 *   primary: '#0D47A1',
 *   primaryGradient: ['#0D47A1', '#7B74D4'],
 *   dark: false
 * });
 */

import type { App, Plugin } from 'vue';

/**
 * Opções de configuração do tema
 */
export interface NtkThemeOptions {
  /** Cor primária principal */
  primary?: string;
  /** Cor primária escura (hover) */
  primaryDark?: string;
  /** Cor primária clara */
  primaryLight?: string;
  /** Gradiente primário [start, end] */
  primaryGradient?: [string, string];
  /** Cor secundária */
  secondary?: string;
  /** Cor de fundo principal */
  background?: string;
  /** Cor de fundo secundária */
  backgroundSecondary?: string;
  /** Cor de texto principal */
  textPrimary?: string;
  /** Cor de texto secundário */
  textSecondary?: string;
  /** Cor de borda */
  borderColor?: string;
  /** Ativar modo escuro */
  dark?: boolean;
  /** Família de fontes principal */
  fontFamily?: string;
  /** Família de fontes para títulos */
  fontFamilyDisplay?: string;
}

/**
 * Aplica as opções de tema como variáveis CSS
 */
function applyThemeOptions(options: NtkThemeOptions): void {
  const root = document.documentElement;
  
  // Cores primárias
  if (options.primary) {
    root.style.setProperty('--ntk-primary', options.primary);
  }
  if (options.primaryDark) {
    root.style.setProperty('--ntk-primary-dark', options.primaryDark);
  }
  if (options.primaryLight) {
    root.style.setProperty('--ntk-primary-light', options.primaryLight);
  }
  
  // Gradiente primário
  if (options.primaryGradient) {
    const [start, end] = options.primaryGradient;
    root.style.setProperty('--ntk-primary-gradient-start', start);
    root.style.setProperty('--ntk-primary-gradient-end', end);
    root.style.setProperty('--ntk-primary-gradient', `linear-gradient(135deg, ${start} 0%, ${end} 100%)`);
    root.style.setProperty('--ntk-primary-gradient-hover', `linear-gradient(135deg, ${options.primaryDark || start} 0%, ${start} 100%)`);
    root.style.setProperty('--ntk-gradient-accent', `linear-gradient(135deg, ${start} 0%, ${end} 100%)`);
  }
  
  // Cores secundárias
  if (options.secondary) {
    root.style.setProperty('--ntk-secondary', options.secondary);
  }
  
  // Backgrounds
  if (options.background) {
    root.style.setProperty('--ntk-bg-primary', options.background);
  }
  if (options.backgroundSecondary) {
    root.style.setProperty('--ntk-bg-secondary', options.backgroundSecondary);
  }
  
  // Texto
  if (options.textPrimary) {
    root.style.setProperty('--ntk-text-primary', options.textPrimary);
  }
  if (options.textSecondary) {
    root.style.setProperty('--ntk-text-secondary', options.textSecondary);
  }
  
  // Bordas
  if (options.borderColor) {
    root.style.setProperty('--ntk-border-color', options.borderColor);
  }
  
  // Fontes
  if (options.fontFamily) {
    root.style.setProperty('--ntk-font-family', options.fontFamily);
  }
  if (options.fontFamilyDisplay) {
    root.style.setProperty('--ntk-font-family-display', options.fontFamilyDisplay);
  }
  
  // Modo escuro
  if (options.dark) {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else if (options.dark === false) {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }
}

/**
 * Plugin Vue para configuração de temas
 */
export const NtkThemePlugin: Plugin = {
  install(app: App, options: NtkThemeOptions = {}) {
    // Aplica as opções de tema
    applyThemeOptions(options);
    
    // Disponibiliza função para atualizar tema em runtime
    app.config.globalProperties.$ntkTheme = {
      update: applyThemeOptions,
      setDark: (dark: boolean) => {
        const root = document.documentElement;
        if (dark) {
          root.classList.add('dark');
          root.setAttribute('data-theme', 'dark');
        } else {
          root.classList.remove('dark');
          root.setAttribute('data-theme', 'light');
        }
      },
      setPrimary: (color: string) => {
        document.documentElement.style.setProperty('--ntk-primary', color);
      },
      setGradient: (start: string, end: string) => {
        const root = document.documentElement;
        root.style.setProperty('--ntk-primary-gradient-start', start);
        root.style.setProperty('--ntk-primary-gradient-end', end);
        root.style.setProperty('--ntk-primary-gradient', `linear-gradient(135deg, ${start} 0%, ${end} 100%)`);
        root.style.setProperty('--ntk-gradient-accent', `linear-gradient(135deg, ${start} 0%, ${end} 100%)`);
      }
    };
    
    // Provide para Composition API
    app.provide('ntkTheme', app.config.globalProperties.$ntkTheme);
  }
};

/**
 * Composable para acessar funções de tema
 */
export function useNtkTheme() {
  return {
    /**
     * Atualiza múltiplas opções de tema
     */
    update: applyThemeOptions,
    
    /**
     * Define modo escuro
     */
    setDark: (dark: boolean) => {
      const root = document.documentElement;
      if (dark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    },
    
    /**
     * Define cor primária
     */
    setPrimary: (color: string) => {
      document.documentElement.style.setProperty('--ntk-primary', color);
    },
    
    /**
     * Define gradiente primário
     */
    setGradient: (start: string, end: string) => {
      const root = document.documentElement;
      root.style.setProperty('--ntk-primary-gradient-start', start);
      root.style.setProperty('--ntk-primary-gradient-end', end);
      root.style.setProperty('--ntk-primary-gradient', `linear-gradient(135deg, ${start} 0%, ${end} 100%)`);
      root.style.setProperty('--ntk-gradient-accent', `linear-gradient(135deg, ${start} 0%, ${end} 100%)`);
    },
    
    /**
     * Obtém valor de variável CSS
     */
    getVar: (name: string): string => {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    },
    
    /**
     * Define variável CSS customizada
     */
    setVar: (name: string, value: string) => {
      document.documentElement.style.setProperty(name, value);
    }
  };
}

export default NtkThemePlugin;
