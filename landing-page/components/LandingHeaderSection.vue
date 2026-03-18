<template>
  <div class="landing-header-shell">
    <NtkLandingHeader
      class="landing-header-shell__frame"
      logo-letter="NTK"
      :logo-text="t('header.brandName')"
      logo-link="#app"
      logo-size="md"
      :logo-gradient="false"
      :logo-icon-color="props.isDark ? 'var(--gh-bg-muted)' : 'var(--ntk-purple)'"
      :logo-text-color="props.isDark ? 'var(--white)' : 'var(--gray-900)'"
      :nav-items="navItems"
      :cta-text="t('header.github')"
      cta-link="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue"
      :sticky="true"
      :background="isDark ? 'var(--gray-900)' : 'var(--white)'"
      :shadow="isDark ? 'none' : 'sm'"
      :compress-label="t('header.collapse')"
      @mobile-toggle="$emit('mobile-toggle', $event)"
    >
      <template #actions>
        <button
          class="theme-toggle"
          :title="t('header.themeToggleTitle')"
          @click="$emit('toggle-theme')"
        >
          <svg
            v-show="!props.isDark"
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
            v-show="props.isDark"
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

        <button
          class="theme-toggle lang-toggle"
          :title="t('header.localeToggleTitle')"
          @click="toggleLocale"
        >
          {{ localeSwitchLabel }}
        </button>

        <a
          href="https://github.com/ThiagoGuislotti/nettoolskit-ui-vue"
          class="btn btn-github"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          {{ t('header.github') }}
        </a>
      </template>

      <template #mobile-extra>
        <div class="landing-header-shell__mobile-actions">
          <button
            class="theme-toggle"
            :title="t('header.themeToggleTitle')"
            @click="$emit('toggle-theme')"
          >
            <svg
              v-show="!props.isDark"
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
              v-show="props.isDark"
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
            <span>{{ t('header.themeToggleTitle') }}</span>
          </button>

          <button
            class="theme-toggle lang-toggle"
            :title="t('header.localeToggleTitle')"
            @click="toggleLocale"
          >
            <span>{{ localeSwitchLabel }}</span>
          </button>
        </div>
      </template>
    </NtkLandingHeader>
  </div>
</template>

<script setup lang="ts">
/**
 * Landing page/components/Landing Header Section module.
 */
import { computed } from 'vue'
import NtkLandingHeader from '../../src/components/layout/NtkLandingHeader.vue'
import { useLandingI18n } from '../composables/useLandingI18n'

const props = defineProps<{
  isDark: boolean
}>()

defineEmits<{
  (e: 'toggle-theme'): void
  (e: 'mobile-toggle', open: boolean): void
}>()

const { locale, setLocale, t } = useLandingI18n()

const navItems = computed(() => ([
  { href: '#features', label: t('header.nav.features') },
  { href: '#components', label: t('header.nav.components') },
  { href: '#themes', label: t('header.nav.themes') },
  { href: '#installation', label: t('header.nav.installation') },
]))

const localeSwitchLabel = computed(() => t('header.localeSwitchLabel'))

/**
 * Toggles landing locale between English and pt-BR.
 */
function toggleLocale(): void {
  setLocale(locale.value === 'en' ? 'pt-BR' : 'en')
}
</script>

<style lang="scss">
.landing-header-shell {
  --landing-header-bg: var(--white);
  --landing-header-border: var(--gray-200);
  --landing-header-text: var(--gray-700);
  --landing-header-text-strong: var(--gray-900);

  .ntk-landing-header {
    background: var(--landing-header-bg);
    border-bottom: 1px solid var(--landing-header-border);
    box-shadow: var(--shadow-header);
    transition:
      background var(--transition-normal),
      box-shadow var(--transition-normal),
      border-color var(--transition-normal),
      transform var(--transition-normal);
    animation: ntk-header-enter var(--topbar-enter-duration) var(--easing-standard);
    animation-fill-mode: both;
  }

  .header-container {
    max-width: 1200px;
    padding-inline: var(--spacing-lg);
  }

  .logo-icon {
    box-shadow: none;
  }

  .logo-text {
    font-family: var(--ntk-font-family-display);
    font-weight: var(--ntk-font-weight-extrabold);
  }

  .header-nav {
    gap: var(--spacing-lg);
  }

  .header-nav-item {
    position: relative;
    color: var(--landing-header-text);
    font-size: var(--ntk-font-size-sm);
    font-weight: var(--ntk-font-weight-medium);
    line-height: 1;
    transition: color var(--transition-fast), transform var(--transition-normal);
  }

  .header-nav-item::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -0.35rem;
    width: 100%;
    height: 3px;
    border-radius: 999px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform var(--transition-normal);
  }

  .header-nav-item:hover {
    color: var(--ntk-purple);
    transform: translateY(-1px);
  }

  .header-nav-item:hover::after {
    transform: scaleX(1);
  }

  .header-actions {
    gap: 0.75rem;
  }

  .header-mobile-btn {
    color: var(--landing-header-text);
  }

  .header-mobile-btn:hover {
    background: var(--gray-100);
    color: var(--landing-header-text-strong);
  }
}

body.landing-scrolled .landing-header-shell .ntk-landing-header {
  background: color-mix(in srgb, var(--white) 90%, transparent);
  box-shadow: var(--topbar-shadow-scrolled);
  border-bottom-color: color-mix(in srgb, var(--gray-200) 72%, transparent);
  backdrop-filter: blur(10px);
}

body.dark-mode .landing-header-shell {
  --landing-header-bg: color-mix(in srgb, #010409 94%, transparent);
  --landing-header-border: var(--gh-border-default);
  --landing-header-text: var(--gh-fg-muted);
  --landing-header-text-strong: var(--gh-fg-default);
}

body.dark-mode.landing-scrolled .landing-header-shell .ntk-landing-header {
  background: color-mix(in srgb, #010409 90%, transparent);
  border-bottom-color: var(--gh-border-default);
}

.landing-header-shell__mobile-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);

  .theme-toggle {
    width: 100%;
    justify-content: flex-start;
  }
}

.theme-toggle {
  background: transparent;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  padding: 0.5rem 0.65rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  color: var(--gray-700);
  transition: all var(--transition-fast);
}

.theme-toggle:hover {
  background: var(--gray-100);
  color: var(--ntk-purple);
}

.lang-toggle {
  min-width: 56px;
  font-size: var(--ntk-font-size-xs);
  font-weight: var(--ntk-font-weight-semibold);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem;
  border-radius: 8px;
  font-weight: var(--ntk-font-weight-semibold);
  font-size: var(--landing-font-size-sm-tight);
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
}

.btn-github {
  background: var(--gh-bg-muted);
  border: 1px solid var(--gh-border-default);
  color: var(--gh-fg-default) !important;
  box-shadow: none;
}

.btn-github:hover {
  background: var(--gh-border-default);
  border-color: var(--gh-fg-subtle);
  color: var(--gh-fg-default) !important;
  transform: translateY(-1px);
  box-shadow: none;
}

body.dark-mode .theme-toggle {
  border-color: var(--overlay-white-20);
  color: var(--gray-300);
}

body.dark-mode .theme-toggle:hover {
  background: var(--overlay-white-10);
  color: var(--ntk-purple-light);
}
</style>