<template>
  <div id="app-dev">
    <!-- Área de desenvolvimento de componentes -->
    <NtkHeader
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
    </NtkHeader>

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
import { ref, watchEffect } from 'vue';
import NtkHeader from '../src/components/layout/NtkHeader.vue';
import { applyThemeColors } from '../src/config/colors/theme-mode.config';

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
  background: var(--theme-background);
  color: var(--theme-text);
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
  color: var(--theme-text);
}

.base-header__nav-link {
  color: var(--theme-text-light);
}

.base-header__nav-link:hover {
  color: var(--theme-primary);
}

.base-header__theme-toggle {
  border-color: var(--theme-border);
  color: var(--theme-text-light);
}

.base-header__theme-toggle:hover {
  background: var(--theme-background-light);
  color: var(--theme-primary);
}

/* GitHub button in purple */
.base-header__cta {
  background: var(--theme-primary) !important;
  color: var(--theme-text-inverse, var(--ntk-text-on-primary)) !important;
}

.base-header__cta:hover {
  background: var(--theme-primary-dark) !important;
}

/* Dark mode colors */
body.dark-mode .base-header--landing {
  background: color-mix(in srgb, var(--theme-background) 95%, transparent) !important;
  border-bottom: 1px solid color-mix(in srgb, var(--theme-text) 10%, transparent);
}

body.dark-mode .base-header__logo-text {
  color: var(--theme-text) !important;
}

body.dark-mode .base-header__nav-link {
  color: var(--theme-text-light) !important;
}

body.dark-mode .base-header__nav-link:hover {
  color: var(--theme-primary-light) !important;
}

body.dark-mode .base-header__theme-toggle {
  border-color: color-mix(in srgb, var(--theme-text) 20%, transparent) !important;
  color: var(--theme-text-light) !important;
}

body.dark-mode .base-header__theme-toggle:hover {
  background: color-mix(in srgb, var(--theme-text) 10%, transparent) !important;
  color: var(--theme-primary-light) !important;
}
</style>
