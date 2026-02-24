<template>
  <div id="app-dev">
    <!-- Área de desenvolvimento de componentes -->
    <BaseHeader
      variant="landing"
      logo="./assets/nuget-icon.png"
      logo-text="NetToolsKit UI"
      :nav-links="navLinks"
      :show-theme-toggle="true"
      :is-dark="isDark"
      @theme-toggle="toggleTheme"
    >
      <template #actions>
        <button @click="toggleTheme" class="header-action__theme-toggle">
          <svg v-if="!isDark" class="header-action__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else class="header-action__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
        
        <a 
          href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue" 
          target="_blank"
          rel="noopener noreferrer"
          class="header-action__github-btn"
        >
          <svg class="header-action__github-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
          </svg>
          GitHub
        </a>
      </template>
    </BaseHeader>

    <!-- Conteúdo de teste -->
    <main style="padding-top: 80px; min-height: 100vh;">
      <div class="container" style="padding: 2rem;">
        <h1>Desenvolvimento de Componentes</h1>
        <p>Teste o header acima - tema atual: {{ isDark ? 'Escuro' : 'Claro' }}</p>
        
        <div style="margin-top: 2rem;">
          <h2>Próximos componentes:</h2>
          <ul>
            <li>BaseButton</li>
            <li>BaseInput</li>
            <li>BaseCard</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import BaseHeader from '../src/components/layout/BaseHeader.vue';
import { lightThemeColors, darkThemeColors, applyThemeColors } from '../src/config/colors/theme-mode.config';

const isDark = ref(false);

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Components', href: '#components' },
  { label: 'Themes', href: '#themes' },
  { label: 'Installation', href: '#installation' },
];

const toggleTheme = () => {
  isDark.value = !isDark.value;
  document.body.classList.toggle('dark-mode', isDark.value);
};

// Apply theme colors whenever isDark changes
watchEffect(() => {
  applyThemeColors(isDark.value ? 'dark' : 'light');
});

// Get current theme colors from global config
const currentColors = computed(() => isDark.value ? darkThemeColors : lightThemeColors);

// Header color configuration using global theme colors
const headerColors = computed(() => ({
  light: {
    logoText: lightThemeColors.textPrimary,
    navLink: lightThemeColors.textSecondary,
    navLinkHover: lightThemeColors.primary,
    themeToggleBorder: lightThemeColors.borderLight,
    themeToggleColor: lightThemeColors.textSecondary,
    themeToggleHoverBg: lightThemeColors.backgroundTertiary,
    themeToggleHoverColor: lightThemeColors.primary,
    ctaBackground: lightThemeColors.primary,
    ctaColor: lightThemeColors.textOnPrimary,
    ctaHoverBackground: lightThemeColors.primaryDark,
  },
  dark: {
    logoText: darkThemeColors.textPrimary,
    navLink: darkThemeColors.textSecondary,
    navLinkHover: darkThemeColors.primaryLight,
    themeToggleBorder: 'rgba(255, 255, 255, 0.2)',
    themeToggleColor: darkThemeColors.textSecondary,
    themeToggleHoverBg: 'rgba(255, 255, 255, 0.1)',
    themeToggleHoverColor: darkThemeColors.primaryLight,
    ctaBackground: darkThemeColors.primary,
    ctaColor: darkThemeColors.textOnPrimary,
    ctaHoverBackground: darkThemeColors.primaryDark,
    headerBackground: darkThemeColors.backgroundSecondary + 'F2', // 95% opacity
    headerBorder: `1px solid ${darkThemeColors.border}`,
  }
}));
</script>

<style>
/* Importar design system */
@import '../src/styles/design-system.scss';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--theme-font-body);
  background: var(--theme-background);
  color: var(--theme-text);
  transition: background 0.3s ease, color 0.3s ease;
}

body.dark-mode {
  background: #111827;
  color: #f3f4f6;
}

/* Custom header actions styles */
.header-action__theme-toggle {
  background: transparent;
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  padding: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-text-light);
  transition: all var(--transition-fast);
}

.header-action__theme-toggle:hover {
  background: var(--theme-background-light);
  color: var(--theme-primary);
}

.header-action__icon {
  width: 18px;
  height: 18px;
}

.header-action__github-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0rem 1rem;
  border-radius: 6px;
  font-size: 0.8125rem;
  line-height: 1.2;
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
  background: var(--theme-primary);
  color: var(--theme-background);
  text-decoration: none;
}

.header-action__github-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.header-action__github-btn:hover {
  background: var(--theme-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-medium);
  color: var(--theme-background);
  text-decoration: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

h1 {
  font-family: var(--theme-font-display);
  color: var(--theme-primary);
  margin-bottom: 1rem;
}

h2 {
  font-family: var(--theme-font-display);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

/* ============================================
 * HEADER CUSTOMIZATION - COLORS HERE
 * ============================================ */
 
/* Light mode colors */
.base-header__logo-text {
  color: #111827;
}

.base-header__nav-link {
  color: #374151;
}

.base-header__nav-link:hover {
  color: #512BD4;
}

.base-header__theme-toggle {
  border-color: #D1D5DB;
  color: #374151;
}

.base-header__theme-toggle:hover {
  background: #F3F4F6;
  color: #512BD4;
}

/* GitHub button in purple */
.base-header__cta {
  background: #512BD4 !important;
  color: white !important;
}

.base-header__cta:hover {
  background: #3B1FA2 !important;
}

/* Dark mode colors */
body.dark-mode .base-header--landing {
  background: rgba(17, 24, 39, 0.95) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

body.dark-mode .base-header__logo-text {
  color: #F3F4F6 !important;
}

body.dark-mode .base-header__nav-link {
  color: #D1D5DB !important;
}

body.dark-mode .base-header__nav-link:hover {
  color: #A78BFA !important;
}

body.dark-mode .base-header__theme-toggle {
  border-color: rgba(255, 255, 255, 0.2) !important;
  color: #D1D5DB !important;
}

body.dark-mode .base-header__theme-toggle:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #A78BFA !important;
}
</style>