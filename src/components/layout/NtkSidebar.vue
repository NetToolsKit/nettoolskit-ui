<template>
  <q-drawer
    :model-value="modelValue"
    :mini="mini"
    :width="width"
    :mini-width="miniWidth"
    :breakpoint="breakpoint"
    :class="drawerClass"
    :style="drawerStyle"
    @update:model-value="$emit('update:model-value', $event)"
  >
    <q-scroll-area class="fit">
      <!-- Header (Logo/Brand) -->
      <div
        v-if="$slots.header || logo || brandName"
        class="ntk-sidebar__header base-sidebar__header"
      >
        <slot name="header">
          <div class="ntk-sidebar__logo base-sidebar__logo">
            <img
              v-if="logo"
              :src="logo"
              :alt="logoAlt"
              class="ntk-sidebar__logo-img base-sidebar__logo-img"
            >
            <span
              v-if="!mini && brandName"
              class="ntk-sidebar__brand base-sidebar__brand"
            >{{ brandName }}</span>
          </div>
        </slot>
      </div>

      <!-- Navigation Items -->
      <q-list
        padding
        :class="listClass"
      >
        <template
          v-for="(item, index) in items"
          :key="item.id || index"
        >
          <!-- Separator -->
          <q-separator
            v-if="item.type === 'separator'"
            :class="separatorClass"
          />

          <!-- Navigation Item -->
          <q-item
            v-else
            clickable
            :to="item.to"
            :exact="item.exact"
            :disable="item.disabled"
            :class="sidebarItemClass"
            @click="handleItemClick(item)"
          >
            <q-item-section
              v-if="item.icon"
              avatar
            >
              <q-icon :name="item.icon" />
            </q-item-section>

            <q-item-section v-if="!mini">
              <q-item-label>{{ item.label }}</q-item-label>
              <q-item-label
                v-if="item.caption"
                caption
              >
                {{ item.caption }}
              </q-item-label>
            </q-item-section>

            <!-- Badge -->
            <q-item-section
              v-if="!mini && item.badge"
              side
            >
              <span
                class="ntk-sidebar__badge"
                :style="getBadgeStyle(item.badgeColor)"
              >
                {{ item.badge }}
              </span>
            </q-item-section>

            <!-- Tooltip for mini mode -->
            <q-tooltip
              v-if="mini && item.label"
              anchor="center right"
              self="center left"
              :offset="[10, 0]"
            >
              {{ item.label }}
            </q-tooltip>
          </q-item>
        </template>
      </q-list>

      <!-- Footer (Toggle Button) -->
      <div
        v-if="showToggle"
        class="ntk-sidebar__footer base-sidebar__footer"
      >
        <slot name="footer">
          <q-item
            clickable
            :class="sidebarItemClass"
            @click="$emit('toggle')"
          >
            <q-item-section avatar>
              <q-icon :name="mini ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'" />
            </q-item-section>
            <q-item-section v-if="!mini">
              <q-item-label>{{ toggleLabel }}</q-item-label>
            </q-item-section>
            <q-tooltip
              v-if="mini"
              anchor="center right"
              self="center left"
              :offset="[10, 0]"
            >
              {{ toggleTooltip }}
            </q-tooltip>
          </q-item>
        </slot>
      </div>
    </q-scroll-area>
  </q-drawer>
</template>

<script setup lang="ts">
/**
 * Src/components/layout/Ntk Sidebar module.
 */

import { computed } from 'vue'
import type { CSSProperties } from 'vue'

export interface SidebarItem {
  id?: string | number
  type?: 'item' | 'separator'
  label?: string
  caption?: string
  icon?: string
  to?: string
  exact?: boolean
  disabled?: boolean
  badge?: string | number
  badgeColor?: string
  onClick?: () => void
}

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  },
  mini: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    default: 200
  },
  miniWidth: {
    type: Number,
    default: 64
  },
  breakpoint: {
    type: Number,
    default: 0
  },
  items: {
    type: Array as () => SidebarItem[],
    default: () => []
  },
  bgColor: {
    type: String,
    default: 'var(--ntk-sidebar-bg, var(--ntk-bg-card))'
  },
  textColor: {
    type: String,
    default: 'var(--ntk-sidebar-text, var(--ntk-text-primary))'
  },
  activeColor: {
    type: String,
    default: 'var(--ntk-sidebar-item-active-text, var(--ntk-accent, var(--ntk-primary)))'
  },
  logo: {
    type: String,
    default: ''
  },
  logoAlt: {
    type: String,
    default: 'Logo'
  },
  brandName: {
    type: String,
    default: ''
  },
  showToggle: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  },
  itemClass: {
    type: String,
    default: ''
  },
  toggleLabel: {
    type: String,
    default: 'Collapse'
  },
  toggleTooltip: {
    type: String,
    default: 'Expand Menu'
  }
})

const emit = defineEmits<{
  'update:model-value': [value: boolean]
  toggle: []
  'item-click': [item: SidebarItem]
}>()

const colorTokenAliases: Record<string, string> = {
  primary: 'var(--ntk-primary)',
  secondary: 'var(--ntk-secondary, var(--ntk-accent, var(--ntk-primary)))',
  accent: 'var(--ntk-accent, var(--ntk-primary))',
  positive: 'var(--semantic-success-primary, var(--ntk-success))',
  success: 'var(--semantic-success-primary, var(--ntk-success))',
  negative: 'var(--semantic-error-primary, var(--ntk-error))',
  error: 'var(--semantic-error-primary, var(--ntk-error))',
  warning: 'var(--semantic-warning-primary, var(--ntk-warning))',
  info: 'var(--semantic-info-primary, var(--ntk-info))',
  'grey-5': 'var(--ntk-text-muted)',
  'grey-7': 'var(--ntk-text-secondary)',
  'grey-8': 'var(--ntk-text-primary)'
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

const resolveThemeColor = (color: string | undefined, fallback: string): string => {
  const value = color?.trim()

  if (!value) {
    return fallback
  }

  if (isSafeCssTokenExpression(value)) {
    return value
  }

  const alias = value.toLowerCase().replace(/_/g, '-')
  return colorTokenAliases[alias] ?? (QUASAR_NEUTRAL_ALIAS_PATTERN.test(alias) ? 'var(--ntk-text-secondary)' : fallback)
}

const drawerClass = computed(() => [
  'ntk-sidebar',
  'base-sidebar',
  props.customClass
])

const drawerStyle = computed<CSSProperties>(() => ({
  '--ntk-sidebar-bg-resolved': resolveThemeColor(
    props.bgColor,
    'var(--ntk-sidebar-bg, var(--ntk-bg-card))'
  ),
  '--ntk-sidebar-text-resolved': resolveThemeColor(
    props.textColor,
    'var(--ntk-sidebar-text, var(--ntk-text-primary))'
  ),
  '--ntk-sidebar-item-active-text-resolved': resolveThemeColor(
    props.activeColor,
    'var(--ntk-sidebar-item-active-text, var(--ntk-accent, var(--ntk-primary)))'
  ),
  '--ntk-sidebar-item-active-bg-resolved':
    'var(--ntk-sidebar-item-active-bg, color-mix(in srgb, var(--ntk-sidebar-item-active-text-resolved) 12%, transparent))'
}))

const listClass = computed(() => [
  'ntk-sidebar__list',
  'base-sidebar__list'
])

const sidebarItemClass = computed(() => [
  'ntk-sidebar__item',
  'base-sidebar__item',
  props.itemClass
])

const separatorClass = computed(() => [
  'ntk-sidebar__separator',
  'base-sidebar__separator',
  'q-my-md'
])

const getBadgeStyle = (color?: string): CSSProperties => ({
  '--ntk-sidebar-badge-bg': resolveThemeColor(
    color,
    'var(--ntk-sidebar-item-active-text-resolved, var(--ntk-accent, var(--ntk-primary)))'
  )
})

const handleItemClick = (item: SidebarItem) => {
  if (item.onClick) {
    item.onClick()
  }
  emit('item-click', item)
}
</script>

<style scoped lang="scss">
.ntk-sidebar {
  font-family: var(--ntk-font-family);
  background: var(--ntk-sidebar-bg-resolved, var(--ntk-sidebar-bg, var(--ntk-bg-card)));
  color: var(--ntk-sidebar-text-resolved, var(--ntk-sidebar-text, var(--ntk-text-primary)));
  border-right: 1px solid var(--ntk-sidebar-border);

  :deep(.q-scrollarea__content) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}

.ntk-sidebar__header {
  padding: var(--ntk-spacing-lg) var(--ntk-spacing-md);
  border-bottom: 1px solid var(--ntk-sidebar-border);
}

.ntk-sidebar__logo {
  display: flex;
  align-items: center;
  gap: var(--ntk-spacing-sm);
}

.ntk-sidebar__logo-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.ntk-sidebar__brand {
  font-size: var(--ntk-font-size-xl);
  font-weight: var(--ntk-font-weight-bold);
  color: var(--ntk-sidebar-brand);
  font-family: var(--ntk-font-family);
}

.ntk-sidebar__list {
  flex: 1;
  padding-top: var(--ntk-spacing-md);
}

.ntk-sidebar__item {
  border-radius: var(--ntk-radius-md);
  margin: var(--ntk-spacing-xs) var(--ntk-spacing-sm);
  color: inherit;
  transition: all var(--ntk-transition-fast);
  text-decoration: none;

  &:hover {
    background: var(--ntk-sidebar-item-hover);
    text-decoration: none;
  }

  :deep(.q-item__section--avatar) {
    min-width: var(--ntk-spacing-2xl);
  }

  :deep(.q-icon) {
    font-size: var(--ntk-text-2xl);
  }

  :deep(.q-item__label) {
    font-weight: var(--ntk-font-weight-medium);
    font-size: var(--ntk-font-size-sm);
  }

  :deep(.q-item__label--caption) {
    font-size: var(--ntk-font-size-xs);
    opacity: 0.7;
  }

  &.q-router-link--active {
    background: var(--ntk-sidebar-item-active-bg-resolved, var(--ntk-sidebar-item-active-bg));
    color: var(--ntk-sidebar-item-active-text-resolved, var(--ntk-sidebar-item-active-text));
    text-decoration: none;

    :deep(.q-icon) {
      color: var(--ntk-sidebar-item-active-text-resolved, var(--ntk-sidebar-item-active-text));
    }

    :deep(.q-item__label) {
      font-weight: var(--ntk-font-weight-semibold);
      color: var(--ntk-sidebar-item-active-text-resolved, var(--ntk-sidebar-item-active-text));
    }
  }
}

.ntk-sidebar__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  min-height: 1.25rem;
  padding: 0 var(--ntk-spacing-xs);
  border-radius: var(--ntk-radius-full, 999px);
  background: var(--ntk-sidebar-badge-bg, var(--ntk-sidebar-item-active-text-resolved, var(--ntk-accent, var(--ntk-primary))));
  color: var(--ntk-sidebar-badge-text, var(--ntk-text-on-accent, var(--ntk-text-on-primary, var(--ntk-text-inverse))));
  font-size: var(--ntk-font-size-xs);
  font-weight: var(--ntk-font-weight-semibold);
  line-height: 1;
}

.ntk-sidebar__separator {
  opacity: 0.12;
  margin: var(--ntk-spacing-md) var(--ntk-spacing-sm);
}

.ntk-sidebar__footer {
  padding: var(--ntk-spacing-md) 0;
  border-top: 1px solid var(--ntk-sidebar-border);
  margin-top: auto;
}
</style>
