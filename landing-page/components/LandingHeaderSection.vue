<template>
  <div>
    <header class="header">
      <div class="container">
        <div class="logo">
          <img src="../assets/nuget-icon.png" alt="NTK">
          <span class="logo-text">NetToolsKit UI</span>
        </div>

        <button class="mobile-menu-btn" aria-label="Open menu" @click="$emit('open-drawer')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <nav class="nav">
          <a href="#features">Features</a>
          <a href="#components">Components</a>
          <a href="#themes">Themes</a>
          <a href="#installation">Installation</a>

          <button class="theme-toggle" title="Toggle dark mode" @click="$emit('toggle-theme')">
            <svg
              v-show="!isDark"
              class="sun-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>

            <svg
              v-show="isDark"
              class="moon-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          <a href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue" class="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </nav>
      </div>
    </header>

    <div class="mobile-drawer" :class="{ open: drawerOpen }">
      <div class="drawer-header">
        <button class="drawer-close-btn" @click="$emit('close-drawer')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="13 17 18 12 13 7" />
            <polyline points="6 17 11 12 6 7" />
          </svg>
          <span>Comprimir</span>
        </button>
      </div>

      <nav class="drawer-nav">
        <a href="#features" class="drawer-link" @click="$emit('close-drawer')">Features</a>
        <a href="#components" class="drawer-link" @click="$emit('close-drawer')">Components</a>
        <a href="#themes" class="drawer-link" @click="$emit('close-drawer')">Themes</a>
        <a href="#installation" class="drawer-link" @click="$emit('close-drawer')">Installation</a>
        <a href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue" class="btn btn-primary drawer-cta">GitHub</a>
      </nav>
    </div>

    <div class="drawer-overlay" :class="{ open: drawerOpen }" @click="$emit('close-drawer')" />
  </div>
</template>

<script setup lang="ts">
/**
 * Landing page/components/Landing Header Section module.
 */

defineProps<{
  isDark: boolean
  drawerOpen: boolean
}>()

defineEmits<{
  (e: 'toggle-theme'): void
  (e: 'open-drawer'): void
  (e: 'close-drawer'): void
}>()
</script>