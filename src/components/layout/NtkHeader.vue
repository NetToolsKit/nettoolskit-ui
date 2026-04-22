<template>
  <header
    v-if="variant === 'landing'"
    class="ntk-header ntk-header--landing base-header base-header--landing"
  >
    <div class="ntk-header__container">
      <!-- Logo -->
      <div class="ntk-header__logo">
        <slot name="logo">
          <img
            v-if="logo"
            :src="logo"
            :alt="logoAlt"
            class="ntk-header__logo-img"
          >
          <span
            v-if="logoText"
            class="ntk-header__logo-text"
          >{{ logoText }}</span>
        </slot>
      </div>
      
      <!-- Navigation Links -->
      <nav
        v-if="navLinks.length > 0"
        class="ntk-header__nav"
      >
        <a 
          v-for="link in navLinks" 
          :key="link.label"
          :href="link.href"
          class="ntk-header__nav-link"
        >
          {{ link.label }}
        </a>
      </nav>
      
      <!-- Actions (Theme Toggle, CTA, etc) -->
      <div class="ntk-header__actions">
        <slot name="actions">
          <button 
            v-if="showThemeToggle"
            class="ntk-header__theme-toggle" 
            :aria-label="themeToggleAriaLabel"
            @click="$emit('theme-toggle')"
          >
            <slot name="theme-icon">
              <!-- Default sun/moon icons -->
              <svg
                v-if="!isDark"
                class="ntk-header__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="5"
                />
                <line
                  x1="12"
                  y1="1"
                  x2="12"
                  y2="3"
                />
                <line
                  x1="12"
                  y1="21"
                  x2="12"
                  y2="23"
                />
                <line
                  x1="4.22"
                  y1="4.22"
                  x2="5.64"
                  y2="5.64"
                />
                <line
                  x1="18.36"
                  y1="18.36"
                  x2="19.78"
                  y2="19.78"
                />
                <line
                  x1="1"
                  y1="12"
                  x2="3"
                  y2="12"
                />
                <line
                  x1="21"
                  y1="12"
                  x2="23"
                  y2="12"
                />
                <line
                  x1="4.22"
                  y1="19.78"
                  x2="5.64"
                  y2="18.36"
                />
                <line
                  x1="18.36"
                  y1="5.64"
                  x2="19.78"
                  y2="4.22"
                />
              </svg>
              <svg
                v-else
                class="ntk-header__icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </slot>
          </button>
        </slot>
      </div>
      
      <!-- Mobile Menu Button -->
      <button 
        v-if="showMobileMenu"
        class="ntk-header__mobile-menu-btn" 
        :aria-label="mobileMenuAriaLabel"
        @click="$emit('mobile-menu-toggle')"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line
            x1="3"
            y1="12"
            x2="21"
            y2="12"
          />
          <line
            x1="3"
            y1="6"
            x2="21"
            y2="6"
          />
          <line
            x1="3"
            y1="18"
            x2="21"
            y2="18"
          />
        </svg>
      </button>
    </div>
  </header>

  <q-header
    v-else
    :elevated="elevated"
    :class="headerClass"
    :style="headerTokenStyle"
  >
    <q-toolbar :style="{ height: `${height}px` }">
      <!-- Left Section: Hamburger Menu -->
      <div
        v-if="showMenuButton"
        class="ntk-header__menu-container base-header__menu-container"
      >
        <q-btn
          flat
          dense
          round
          :icon="menuIcon"
          :aria-label="menuAriaLabel"
          class="ntk-header__action-btn"
          @click="$emit('toggle-menu')"
        >
          <q-tooltip>{{ menuTooltip }}</q-tooltip>
        </q-btn>
      </div>

      <!-- Left Section: Title/Breadcrumb -->
      <q-toolbar-title
        v-if="title || breadcrumbs.length > 0 || $slots.title"
        class="ntk-header__title base-header__title"
      >
        <slot name="title">
          <div
            v-if="breadcrumbs.length > 0"
            class="ntk-header__breadcrumb"
          >
            <span
              v-for="(crumb, index) in breadcrumbs"
              :key="index"
              class="ntk-header__breadcrumb-item"
            >
              <span :class="{ 'ntk-header__breadcrumb-app': index === 0 }">{{ crumb }}</span>
              <q-icon
                v-if="index < breadcrumbs.length - 1"
                name="chevron_right"
                size="var(--ntk-header-breadcrumb-icon-size, 20px)"
                class="ntk-header__breadcrumb-separator base-header__breadcrumb-separator"
              />
            </span>
          </div>
          <span
            v-else
            class="ntk-header__title-text"
          >{{ title }}</span>
        </slot>
      </q-toolbar-title>

      <q-space />

      <!-- Center Section: Search (optional) -->
      <div
        v-if="showSearch && !isMobileView"
        class="ntk-header__search base-header__search"
      >
        <q-input
          dense
          borderless
          :model-value="searchValue"
          :placeholder="searchPlaceholder"
          class="ntk-header__search-input"
          @update:model-value="$emit('update:search-value', $event)"
        >
          <template #prepend>
            <q-icon
              name="search"
              class="ntk-header__search-icon"
            />
          </template>
        </q-input>
      </div>

      <!-- Right Section: Actions -->
      <div class="ntk-header__actions">
        <slot name="actions">
          <!-- Default actions: Notifications + User Avatar -->
          <q-btn
            v-if="showNotifications"
            round
            dense
            flat
            icon="notifications"
            class="ntk-header__action-btn"
            :aria-label="notificationsAriaLabel"
            @click="$emit('notifications-click')"
          >
            <q-badge
              v-if="notificationCount > 0"
              class="ntk-header__notification-badge"
              :label="notificationCount"
              floating
            />
            <q-tooltip>{{ notificationsTooltip }}</q-tooltip>
          </q-btn>

          <q-btn
            v-if="showUserAvatar"
            round
            flat
            class="ntk-header__action-btn"
            :aria-label="userAriaLabel"
            @click="$emit('user-click')"
          >
            <q-avatar size="var(--ntk-header-avatar-size, 26px)">
              <img
                v-if="userAvatar"
                :src="userAvatar"
                alt="User Avatar"
              >
              <q-icon
                v-else
                name="account_circle"
                size="var(--ntk-header-avatar-size, 26px)"
              />
            </q-avatar>
            <q-tooltip>{{ userTooltip }}</q-tooltip>
          </q-btn>
        </slot>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
/**
 * Src/components/layout/Ntk Header module.
 */

import { computed } from 'vue'
import { useQuasar } from 'quasar'

interface NavLink {
  label: string
  href: string
}

const props = defineProps({
  // Variant: 'app' (Quasar-based) or 'landing' (landing page style)
  variant: {
    type: String as () => 'app' | 'landing',
    default: 'app'
  },
  
  // Landing variant props
  logo: {
    type: String,
    default: ''
  },
  logoAlt: {
    type: String,
    default: 'Logo'
  },
  logoText: {
    type: String,
    default: ''
  },
  navLinks: {
    type: Array as () => NavLink[],
    default: () => []
  },
  showThemeToggle: {
    type: Boolean,
    default: false
  },
  isDark: {
    type: Boolean,
    default: false
  },
  themeToggleAriaLabel: {
    type: String,
    default: 'Toggle Theme'
  },
  showMobileMenu: {
    type: Boolean,
    default: true
  },
  mobileMenuAriaLabel: {
    type: String,
    default: 'Toggle Mobile Menu'
  },
  
  // App variant props
  title: {
    type: String,
    default: ''
  },
  breadcrumbs: {
    type: Array as () => string[],
    default: () => []
  },
  elevated: {
    type: Boolean,
    default: true
  },
  height: {
    type: Number,
    default: 64
  },
  bgColor: {
    type: String,
    default: ''
  },
  textColor: {
    type: String,
    default: ''
  },
  showMenuButton: {
    type: Boolean,
    default: true
  },
  menuIcon: {
    type: String,
    default: 'menu'
  },
  menuAriaLabel: {
    type: String,
    default: 'Toggle Menu'
  },
  menuTooltip: {
    type: String,
    default: 'Menu'
  },
  showSearch: {
    type: Boolean,
    default: false
  },
  searchValue: {
    type: String,
    default: ''
  },
  searchPlaceholder: {
    type: String,
    default: 'Search'
  },
  isMobile: {
    type: Boolean,
    default: undefined
  },
  showNotifications: {
    type: Boolean,
    default: true
  },
  notificationCount: {
    type: Number,
    default: 0
  },
  notificationsTooltip: {
    type: String,
    default: 'Notifications'
  },
  notificationsAriaLabel: {
    type: String,
    default: 'Open notifications'
  },
  showUserAvatar: {
    type: Boolean,
    default: true
  },
  compact: {
    type: Boolean,
    default: false
  },
  dark: {
    type: Boolean,
    default: false
  },
  transparent: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  },
  userAvatar: {
    type: String,
    default: ''
  },
  userTooltip: {
    type: String,
    default: 'Account'
  },
  userAriaLabel: {
    type: String,
    default: 'Open account menu'
  },
  actionColor: {
    type: String,
    default: 'var(--ntk-text-secondary)'
  },
  searchIconColor: {
    type: String,
    default: 'var(--ntk-text-muted)'
  },
  notificationBadgeColor: {
    type: String,
    default: 'var(--semantic-error, var(--ntk-danger))'
  },
  notificationBadgeTextColor: {
    type: String,
    default: 'var(--ntk-text-inverse)'
  }
})

defineEmits([
  'toggle-menu',
  'update:search-value',
  'notifications-click',
  'user-click',
  'theme-toggle',
  'cta-click',
  'mobile-menu-toggle'
])

const $q = useQuasar()
const isMobileView = computed(() => props.isMobile ?? !$q.screen.gt.xs)

const COLOR_TOKEN_ALIASES: Record<string, string> = {
  primary: 'var(--ntk-primary)',
  secondary: 'var(--ntk-secondary, var(--ntk-accent, var(--ntk-primary)))',
  accent: 'var(--ntk-accent, var(--ntk-primary))',
  brand: 'var(--ntk-primary)',
  success: 'var(--ntk-success, var(--semantic-success-primary))',
  positive: 'var(--ntk-success, var(--semantic-success-primary))',
  warning: 'var(--ntk-warning, var(--semantic-warning-primary))',
  error: 'var(--ntk-error, var(--semantic-error-primary))',
  danger: 'var(--ntk-error, var(--semantic-error-primary))',
  negative: 'var(--ntk-error, var(--semantic-error-primary))',
  info: 'var(--ntk-info, var(--semantic-info-primary))',
  neutral: 'var(--ntk-text-secondary)',
  muted: 'var(--ntk-text-muted)',
  text: 'var(--ntk-text-primary)',
  inverse: 'var(--ntk-text-inverse)',
  surface: 'var(--ntk-bg-primary)',
  'surface-muted': 'var(--ntk-bg-secondary)',
  border: 'var(--ntk-border-color)',
}

const QUASAR_NEUTRAL_ALIAS_PATTERN = /^(grey|gray|blue-grey)-\d+$/i
const UNSAFE_CSS_VALUE_PATTERN = /[;{}<>]|url\s*\(|expression\s*\(|javascript:/i
const HEX_COLOR_PATTERN = /#[\da-f]{3,8}\b/i
const RAW_COLOR_FUNCTION_PATTERN = /\b(?:rgb|rgba|hsl|hsla|oklch|oklab|color)\(\s*(?!var\(--)/i
const NAMED_COLOR_PATTERN = /\b(?:white|black|red|green|blue|hotpink|purple|violet|yellow|orange|pink|gray|grey|cyan|magenta|lime|navy|teal|maroon|olive|silver|gold|brown|coral|tomato|salmon|beige|ivory|snow|azure|lavender|plum|orchid|indigo)\b/i

const stripCssVariables = (value: string): string => value.replace(/var\([^)]*\)/gi, '')

const isSafeCssTokenExpression = (value: string): boolean => {
  const normalized = value.trim()
  return normalized.includes('var(--')
    && !UNSAFE_CSS_VALUE_PATTERN.test(normalized)
    && !HEX_COLOR_PATTERN.test(normalized)
    && !RAW_COLOR_FUNCTION_PATTERN.test(normalized)
    && !NAMED_COLOR_PATTERN.test(stripCssVariables(normalized))
}

const resolveTokenColor = (value?: string, fallback = ''): string => {
  const normalized = value?.trim()
  if (!normalized) {
    return fallback
  }

  if (isSafeCssTokenExpression(normalized)) {
    return normalized
  }

  const alias = normalized.toLowerCase().replace(/_/g, '-')
  return COLOR_TOKEN_ALIASES[alias] ?? (QUASAR_NEUTRAL_ALIAS_PATTERN.test(alias) ? COLOR_TOKEN_ALIASES.neutral : fallback)
}

const headerClass = computed(() => {
  const classes: Array<string | Record<string, boolean>> = [
    'ntk-header',
    'base-header',
    {
      'ntk-header--compact': props.compact,
      'base-header--compact': props.compact,
      'ntk-header--dark': props.dark,
      'base-header--dark': props.dark,
      'ntk-header--transparent': props.transparent,
      'base-header--transparent': props.transparent
    },
    props.customClass
  ]

  return classes
})

const headerTokenStyle = computed<Record<string, string>>(() => {
  const headerBg = resolveTokenColor(props.bgColor)
  const headerText = resolveTokenColor(props.textColor)

  return {
    ...(headerBg ? { '--ntk-header-bg-color': headerBg } : {}),
    ...(headerText ? { '--ntk-header-text-color': headerText } : {}),
    '--ntk-header-action-color': resolveTokenColor(props.actionColor, 'var(--ntk-text-secondary)'),
    '--ntk-header-search-icon-color': resolveTokenColor(props.searchIconColor, 'var(--ntk-text-muted)'),
    '--ntk-header-notification-badge-bg': resolveTokenColor(
      props.notificationBadgeColor,
      'var(--semantic-error, var(--ntk-danger))'
    ),
    '--ntk-header-notification-badge-text': resolveTokenColor(
      props.notificationBadgeTextColor,
      'var(--ntk-text-inverse)'
    )
  }
})
</script>

<style scoped lang="scss">
/* ============================================
 * Landing Variant Styles
 * ============================================ */
.ntk-header--landing {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--ntk-bg-primary);
  box-shadow: var(--ntk-header-shadow);
  padding: 0.6rem 0;
  font-family: var(--ntk-font-body);
  z-index: 1000;
}

.ntk-header__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.ntk-header__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: auto;
}

.ntk-header__logo-img {
  width: var(--ntk-header-logo-size, 38px);
  height: var(--ntk-header-logo-size, 38px);
  border-radius: var(--ntk-header-logo-radius, var(--ntk-radius-md));
}

.ntk-header__logo-text {
  font-weight: var(--ntk-font-weight-extrabold);
  font-size: var(--ntk-font-size-xl);
  color: var(--ntk-text-primary);
}

.ntk-header__nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.ntk-header__nav-link {
  color: var(--ntk-text-secondary);
  font-weight: var(--ntk-font-weight-medium);
  font-size: var(--ntk-font-size-sm);
  text-decoration: none;
  transition: color var(--ntk-transition-fast);
  line-height: 1;
  display: flex;
  align-items: center;
}

.ntk-header__nav-link:hover {
  color: var(--ntk-primary);
  text-decoration: none;
}

.ntk-header__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.ntk-header__action-btn {
  color: var(--ntk-header-action-color);
}

.ntk-header__theme-toggle {
  background: transparent;
  border: 1px solid var(--ntk-border-color);
  border-radius: var(--ntk-radius-md);
  padding: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ntk-text-secondary);
  transition: all var(--ntk-transition-fast);
  text-decoration: none;
}

.ntk-header__theme-toggle:hover {
  background: var(--ntk-bg-light);
  color: var(--ntk-primary);
  text-decoration: none;
}

.ntk-header__icon {
  width: var(--ntk-header-theme-icon-size, 18px);
  height: var(--ntk-header-theme-icon-size, 18px);
}



.ntk-header__mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  padding: var(--ntk-spacing-sm);
  cursor: pointer;
  color: var(--ntk-text-secondary);
  text-decoration: none;
  
  &:hover {
    text-decoration: none;
  }
}

/* Responsive for landing variant */
@media (max-width: 768px) {
  .ntk-header__nav {
    display: none;
  }
  
  .ntk-header__mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

/* ============================================
 * App Variant Styles (Quasar-based)
 * ============================================ */
.ntk-header {
  font-family: var(--ntk-font-body);
  background: var(--ntk-header-bg-color, var(--ntk-bg-primary));
  color: var(--ntk-header-text-color, var(--ntk-text-primary));

  :deep(.q-toolbar) {
    padding: 0 16px;
    gap: 16px;
  }
}

.ntk-header__menu-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
}

.ntk-header__title {
  font-family: var(--ntk-font-body);
  font-weight: var(--ntk-font-weight-semibold);
  font-size: var(--ntk-font-size-lg);
  flex-shrink: 0;
}

.ntk-header__title-text {
  font-weight: var(--ntk-font-weight-semibold);
}

.ntk-header__breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ntk-header__breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ntk-header__breadcrumb-app {
  font-weight: var(--ntk-font-weight-semibold);
}

.ntk-header__breadcrumb-separator {
  color: var(--ntk-text-muted);
}

.ntk-header__search {
  max-width: 400px;
  flex: 1;
}

.ntk-header__search-input {
  background: var(--ntk-bg-secondary);
  border-radius: 8px;
  padding: 4px 12px;

  :deep(.q-field__control) {
    height: 40px;
  }

  :deep(.q-field__native) {
    font-family: var(--ntk-font-body);
  }
}

.ntk-header__search-icon {
  color: var(--ntk-header-search-icon-color);
}

.ntk-header__notification-badge {
  background: var(--ntk-header-notification-badge-bg);
  color: var(--ntk-header-notification-badge-text);
}
</style>
