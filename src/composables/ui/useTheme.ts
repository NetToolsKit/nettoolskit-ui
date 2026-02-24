/**
 * useTheme Composable
 * Gerencia temas dinamicamente na aplicação
 * Permite trocar cores, fontes e configurações em tempo real
 */

import { ref, computed, readonly } from 'vue';
import type { ThemeConfig, ThemeName } from '../../config/theme/theme.config';
import { themes, defaultTheme } from '../../config/theme/theme.config';
import { applySemanticColors } from '../../config/colors/semantic.config';

// Estado global do tema
const currentTheme = ref<ThemeConfig>(defaultTheme);
const themeName = ref<ThemeName>('sentinela');

/**
 * Aplica as variáveis CSS do tema no documento
 */
function applyThemeToCSS(theme: ThemeConfig): void {
  const root = document.documentElement;
  const normalizedBackground = theme.colors.background.replace('#', '');
  const hasHexBackground = /^[0-9A-Fa-f]{6}$/.test(normalizedBackground);
  const r = hasHexBackground ? parseInt(normalizedBackground.slice(0, 2), 16) : 255;
  const g = hasHexBackground ? parseInt(normalizedBackground.slice(2, 4), 16) : 255;
  const b = hasHexBackground ? parseInt(normalizedBackground.slice(4, 6), 16) : 255;
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const isDarkTheme = brightness < 128;
  const textInverse = isDarkTheme ? '#0f172a' : '#ffffff';
  
  // Cores principais
  root.style.setProperty('--theme-primary', theme.colors.primary);
  root.style.setProperty('--theme-primary-dark', theme.colors.primaryDark);
  root.style.setProperty('--theme-primary-light', theme.colors.primaryLight);
  root.style.setProperty('--theme-secondary', theme.colors.secondary);
  root.style.setProperty('--theme-accent', theme.colors.accent);
  
  // Backgrounds
  root.style.setProperty('--theme-background', theme.colors.background);
  root.style.setProperty('--theme-background-light', theme.colors.backgroundLight);
  
  // Texto
  root.style.setProperty('--theme-text', theme.colors.text);
  root.style.setProperty('--theme-text-light', theme.colors.textLight);
  root.style.setProperty('--theme-text-muted', theme.colors.textMuted);
  
  // Bordas
  root.style.setProperty('--theme-border', theme.colors.border);
  
  // Feedback
  root.style.setProperty('--theme-success', theme.colors.success);
  root.style.setProperty('--theme-warning', theme.colors.warning);
  root.style.setProperty('--theme-error', theme.colors.error);
  root.style.setProperty('--theme-info', theme.colors.info);
  
  // Gradientes
  root.style.setProperty('--theme-gradient-hero', theme.gradients.hero);
  root.style.setProperty('--theme-gradient-primary', theme.gradients.primary);
  root.style.setProperty('--theme-gradient-loading', theme.gradients.loading);
  
  // Fontes
  root.style.setProperty('--theme-font-display', theme.fonts.display);
  root.style.setProperty('--theme-font-body', theme.fonts.body);

  // Backward compatibility: legacy NTK tokens
  root.style.setProperty('--ntk-primary', theme.colors.primary);
  root.style.setProperty('--ntk-primary-dark', theme.colors.primaryDark);
  root.style.setProperty('--ntk-primary-light', theme.colors.primaryLight);
  root.style.setProperty('--ntk-secondary', theme.colors.secondary);
  root.style.setProperty('--ntk-bg-primary', theme.colors.background);
  root.style.setProperty('--ntk-bg-secondary', theme.colors.backgroundLight);
  root.style.setProperty('--ntk-bg-tertiary', theme.colors.backgroundLight);
  root.style.setProperty('--ntk-bg-card', theme.colors.background);
  root.style.setProperty('--ntk-bg-hover', theme.colors.backgroundLight);
  root.style.setProperty('--ntk-bg-overlay', 'rgba(0, 0, 0, 0.5)');
  root.style.setProperty('--ntk-text-primary', theme.colors.text);
  root.style.setProperty('--ntk-text-secondary', theme.colors.textLight);
  root.style.setProperty('--ntk-text-muted', theme.colors.textMuted);
  root.style.setProperty('--ntk-text-dark', theme.colors.text);
  root.style.setProperty('--ntk-text-light', theme.colors.textLight);
  root.style.setProperty('--ntk-text-inverse', textInverse);
  root.style.setProperty('--ntk-text-on-primary', '#ffffff');
  root.style.setProperty('--ntk-border-color', theme.colors.border);
  root.style.setProperty('--ntk-border-light', theme.colors.border);
  root.style.setProperty('--ntk-border-dark', theme.colors.border);
  root.style.setProperty('--ntk-success', theme.colors.success);
  root.style.setProperty('--ntk-warning', theme.colors.warning);
  root.style.setProperty('--ntk-error', theme.colors.error);
  root.style.setProperty('--ntk-info', theme.colors.info);
  root.style.setProperty('--ntk-gradient-hero', theme.gradients.hero);
  root.style.setProperty('--ntk-gradient-loading', theme.gradients.loading);
  root.style.setProperty('--ntk-gradient-accent', theme.gradients.primary);
  root.style.setProperty('--ntk-primary-gradient', theme.gradients.primary);
  root.style.setProperty('--ntk-gradient-subtle', `linear-gradient(135deg, ${theme.colors.background} 0%, ${theme.colors.backgroundLight} 100%)`);
  root.style.setProperty('--ntk-font-family', theme.fonts.body);
  root.style.setProperty('--ntk-font-family-display', theme.fonts.display);

  // Compatibility aliases used by legacy design-system styles
  root.style.setProperty('--color-action-primary', theme.colors.primary);
  root.style.setProperty('--color-action-primary-hover', theme.colors.primaryDark);
  root.style.setProperty('--color-bg-light', theme.colors.backgroundLight);
  root.style.setProperty('--color-surface-primary', theme.colors.background);
  root.style.setProperty('--color-text-primary', theme.colors.text);
  root.style.setProperty('--color-text-secondary', theme.colors.textLight);
  root.style.setProperty('--color-text-muted', theme.colors.textMuted);
  root.style.setProperty('--color-text-dark', theme.colors.text);
  root.style.setProperty('--color-text-inverse', textInverse);
  root.style.setProperty('--color-border', theme.colors.border);
  root.style.setProperty('--color-footer-bg', isDarkTheme ? theme.colors.background : '#1a1a2e');
  root.style.setProperty('--color-footer-text', isDarkTheme ? theme.colors.text : '#e0e0e0');
  root.style.setProperty('--color-footer-text-muted', isDarkTheme ? theme.colors.textLight : '#9e9e9e');
  root.style.setProperty('--color-footer-link', theme.colors.primaryLight);
  root.style.setProperty('--color-footer-link-hover', theme.colors.primary);
  root.style.setProperty('--color-footer-border', isDarkTheme ? theme.colors.border : 'rgba(255, 255, 255, 0.1)');
  
  // Data attribute para CSS selectors
  root.setAttribute('data-theme', theme.name.toLowerCase());

  // Ensure semantic tokens are always available for components
  applySemanticColors();
}

/**
 * Composable para gerenciar temas
 */
export function useTheme() {
  /**
   * Define o tema atual
   */
  const setTheme = (name: ThemeName): void => {
    const theme = themes[name];
    if (theme) {
      currentTheme.value = theme;
      themeName.value = name;
      applyThemeToCSS(theme);
      
      // Salvar preferência no localStorage
      try {
        localStorage.setItem('app-theme', name);
      } catch (_e) {
        console.warn('Não foi possível salvar preferência de tema');
      }
    }
  };

  /**
   * Define um tema customizado
   */
  const setCustomTheme = (theme: ThemeConfig): void => {
    currentTheme.value = theme;
    applyThemeToCSS(theme);
  };

  /**
   * Carrega tema salvo ou usa o padrão
   */
  const loadSavedTheme = (): void => {
    try {
      const saved = localStorage.getItem('app-theme') as ThemeName | null;
      if (saved && themes[saved]) {
        setTheme(saved);
      } else {
        applyThemeToCSS(currentTheme.value);
      }
    } catch (_e) {
      applyThemeToCSS(currentTheme.value);
    }
  };

  /**
   * Retorna a cor primária atual
   */
  const primaryColor = computed(() => currentTheme.value.colors.primary);

  /**
   * Retorna as configurações do logo
   */
  const logo = computed(() => currentTheme.value.identity.logo);

  /**
   * Retorna o nome do tema atual
   */
  const name = computed(() => currentTheme.value.name);

  /**
   * Verifica se é um tema escuro
   */
  const isDark = computed(() => {
    const bg = currentTheme.value.colors.background;
    // Verifica se o background é escuro (hex < 50%)
    const hex = bg.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness < 128;
  });

  /**
   * Lista de temas disponíveis
   */
  const availableThemes = computed(() => Object.keys(themes) as ThemeName[]);

  return {
    // Estado (readonly para evitar mutações diretas)
    theme: readonly(currentTheme),
    themeName: readonly(themeName),
    
    // Computed
    primaryColor,
    logo,
    name,
    isDark,
    availableThemes,
    
    // Métodos
    setTheme,
    setCustomTheme,
    loadSavedTheme,
  };
}

/**
 * Inicializa o tema no carregamento da aplicação
 * Chamar no main.ts ou App.vue
 */
export function initTheme(defaultThemeName: ThemeName = 'sentinela'): void {
  const { setTheme } = useTheme();
  
  // Tenta carregar tema salvo, senão usa o padrão
  try {
    const saved = localStorage.getItem('app-theme') as ThemeName | null;
    if (saved && themes[saved]) {
      setTheme(saved);
    } else {
      setTheme(defaultThemeName);
    }
  } catch (_e) {
    setTheme(defaultThemeName);
  }
}
