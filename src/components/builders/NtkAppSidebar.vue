<template>
  <div class="app-sidebar-content">
    <!-- User Profile Section -->
    <div
      v-if="showUserProfile && userProfile"
      class="sidebar-profile"
    >
      <q-avatar
        size="56px"
        class="sidebar-profile__avatar"
        :style="userAvatarStyle"
      >
        <img
          v-if="userProfile.avatar"
          :src="userProfile.avatar"
          :alt="userProfile.name"
        >
        <span v-else>{{ userInitials }}</span>
      </q-avatar>
      <div class="profile-info">
        <div class="profile-name">
          {{ userProfile.name }}
        </div>
        <div class="profile-email">
          {{ userProfile.email }}
        </div>
      </div>
    </div>

    <q-separator
      v-if="showUserProfile && userProfile"
      class="q-my-md"
    />

    <!-- Navigation Menu -->
    <q-list
      class="sidebar-menu"
      padding
    >
      <template
        v-for="(item, index) in menuItems"
        :key="index"
      >
        <!-- Group Header -->
        <q-item-label
          v-if="item.type === 'header'"
          header
          class="menu-header"
        >
          {{ item.label }}
        </q-item-label>

        <!-- Separator -->
        <q-separator
          v-else-if="item.type === 'separator'"
          class="q-my-sm"
        />

        <!-- Menu Item -->
        <q-item
          v-else
          v-ripple
          clickable
          :active="item.active || isActive(item)"
          :to="item.to"
          :href="item.href"
          :target="item.href ? '_blank' : undefined"
          class="menu-item"
          @click="handleItemClick(item)"
        >
          <q-item-section
            v-if="item.icon"
            avatar
          >
            <q-icon :name="item.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
            <q-item-label
              v-if="item.caption"
              caption
            >
              {{ item.caption }}
            </q-item-label>
          </q-item-section>

          <q-item-section
            v-if="item.badge"
            side
          >
            <q-badge
              class="menu-badge"
              :style="getBadgeStyle(item.badgeColor)"
              :label="item.badge"
            />
          </q-item-section>

          <q-item-section
            v-if="item.children"
            side
          >
            <q-icon name="chevron_right" />
          </q-item-section>
        </q-item>

        <!-- Submenu -->
        <q-expansion-item
          v-if="item.children"
          :icon="item.icon"
          :label="item.label"
          :caption="item.caption"
          class="submenu-item"
        >
          <q-list padding>
            <q-item
              v-for="(child, childIndex) in item.children"
              :key="childIndex"
              v-ripple
              clickable
              :active="child.active || isActive(child)"
              :to="child.to"
              :href="child.href"
              :target="child.href ? '_blank' : undefined"
              class="submenu-child"
              @click="handleItemClick(child)"
            >
              <q-item-section
                v-if="child.icon"
                avatar
              >
                <q-icon
                  :name="child.icon"
                  size="sm"
                />
              </q-item-section>
              
              <q-item-section>
                <q-item-label>{{ child.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </template>
    </q-list>
  </div>
</template>

<script setup lang="ts">
/**
 * Src/components/builders/Ntk App Sidebar module.
 */

import { computed } from 'vue'
import { useRoute } from 'vue-router'

export interface MenuItem {
  type?: 'item' | 'header' | 'separator'
  label: string
  caption?: string
  icon?: string
  to?: string
  href?: string
  active?: boolean
  badge?: string | number
  badgeColor?: string
  children?: MenuItem[]
  onClick?: () => void
}

export interface UserProfile {
  name: string
  email: string
  avatar?: string
  avatarColor?: string
}

interface Props {
  menuItems: MenuItem[]
  showUserProfile?: boolean
  userProfile?: UserProfile | null
}

const props = withDefaults(defineProps<Props>(), {
  showUserProfile: false,
  userProfile: null
})

const emit = defineEmits<{
  'item-click': [item: MenuItem]
}>()

const route = useRoute()

const colorTokenAliases: Record<string, string> = {
  primary: 'var(--ntk-primary)',
  secondary: 'var(--ntk-accent, var(--ntk-primary))',
  accent: 'var(--ntk-accent, var(--ntk-primary))',
  positive: 'var(--semantic-success-primary, var(--ntk-success))',
  success: 'var(--semantic-success-primary, var(--ntk-success))',
  negative: 'var(--semantic-error-primary, var(--ntk-error))',
  error: 'var(--semantic-error-primary, var(--ntk-error))',
  warning: 'var(--semantic-warning-primary, var(--ntk-warning))',
  info: 'var(--semantic-info-primary, var(--ntk-info))',
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

const resolveThemeColor = (color?: string, fallback = 'var(--ntk-avatar-bg, var(--ntk-primary))'): string => {
  const value = color?.trim()
  if (!value) return fallback

  if (isSafeCssTokenExpression(value)) {
    return value
  }

  const alias = value.toLowerCase().replace(/_/g, '-')
  return colorTokenAliases[alias] ?? (QUASAR_NEUTRAL_ALIAS_PATTERN.test(alias) ? 'var(--ntk-text-secondary)' : fallback)
}

const userInitials = computed(() => {
  if (!props.userProfile) return ''
  const names = props.userProfile.name.split(' ')
  return names.length > 1
    ? `${names[0][0]}${names[names.length - 1][0]}`
    : names[0][0]
})

const userAvatarStyle = computed<Record<string, string>>(() => ({
  '--ntk-sidebar-avatar-bg': resolveThemeColor(props.userProfile?.avatarColor),
}))

const getBadgeStyle = (color?: string): Record<string, string> => ({
  '--ntk-sidebar-badge-bg': resolveThemeColor(color, 'var(--ntk-primary)'),
})

const isActive = (item: MenuItem): boolean => {
  if (!item.to) return false
  return route.path === item.to || route.path.startsWith(item.to + '/')
}

const handleItemClick = (item: MenuItem) => {
  emit('item-click', item)
  if (item.onClick) {
    item.onClick()
  }
}
</script>

<style lang="scss" scoped>
.app-sidebar-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sidebar-profile {
  padding: var(--ntk-spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-md);
  
  .profile-info {
    flex: 1;
    min-width: 0;
  }
  
  .profile-name {
    font-weight: 600;
    color: var(--ntk-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .profile-email {
    font-size: 0.875rem;
    color: var(--ntk-text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.sidebar-profile__avatar {
  background: var(--ntk-sidebar-avatar-bg, var(--ntk-avatar-bg, var(--ntk-primary))) !important;
  color: var(--ntk-avatar-color, var(--ntk-text-on-accent, var(--ntk-text-on-primary, var(--ntk-text-inverse)))) !important;
  border: 1px solid var(--ntk-avatar-border, transparent);
  font-weight: 700;
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
}

.menu-header {
  color: var(--ntk-text-secondary);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: var(--ntk-spacing-md) var(--ntk-spacing-lg);
}

.menu-item {
  border-radius: var(--ntk-radius-md);
  margin-bottom: var(--ntk-spacing-xs);
  transition: all var(--ntk-transition-base);

  &:hover {
    background: var(--ntk-bg-hover);
  }

  &.q-router-link--active {
    background: var(--ntk-primary);
    color: var(--ntk-text-on-primary, var(--ntk-text-on-accent, var(--ntk-text-inverse)));

    :deep(.q-icon) {
      color: var(--ntk-text-on-primary, var(--ntk-text-on-accent, var(--ntk-text-inverse)));
    }
  }
}

.menu-badge {
  background: var(--ntk-sidebar-badge-bg, var(--ntk-primary)) !important;
  color: var(--ntk-sidebar-badge-text, var(--ntk-text-on-accent, var(--ntk-text-on-primary, var(--ntk-text-inverse)))) !important;
}

.submenu-item {
  margin-bottom: var(--ntk-spacing-xs);
}

.submenu-child {
  border-radius: var(--ntk-radius-sm);
  margin: var(--ntk-spacing-xs) 0;
  padding-left: var(--ntk-spacing-2xl);

  &:hover {
    background: var(--ntk-bg-hover);
  }

  &.q-router-link--active {
    background: var(--ntk-primary-light);
    color: var(--ntk-primary-dark);
  }
}
</style>
