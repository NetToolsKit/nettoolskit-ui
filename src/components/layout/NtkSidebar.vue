<template>
  <q-drawer
    :model-value="modelValue"
    :mini="mini"
    :width="width"
    :mini-width="miniWidth"
    :breakpoint="breakpoint"
    :class="drawerClass"
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
              <q-badge
                :color="item.badgeColor || 'primary'"
                :label="item.badge"
              />
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
    default: 'white'
  },
  textColor: {
    type: String,
    default: 'grey-8'
  },
  activeColor: {
    type: String,
    default: 'primary'
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
    default: 'Comprimir'
  },
  toggleTooltip: {
    type: String,
    default: 'Expandir Menu'
  }
})

const emit = defineEmits(['update:model-value', 'toggle', 'item-click'])

const drawerClass = computed(() => [
  'ntk-sidebar',
  'base-sidebar',
  `bg-${props.bgColor}`,
  `text-${props.textColor}`,
  props.customClass
])

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
  transition: all var(--transition-fast);
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
    background: var(--ntk-sidebar-item-active-bg);
    color: var(--ntk-sidebar-item-active-text);
    text-decoration: none;

    :deep(.q-icon) {
      color: var(--ntk-sidebar-item-active-text);
    }

    :deep(.q-item__label) {
      font-weight: var(--ntk-font-weight-semibold);
      color: var(--ntk-sidebar-item-active-text);
    }
  }
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