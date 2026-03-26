<template>
  <q-item
    v-if="hasChildren && miniMode && showLabelsInMini"
    v-ripple
    clickable
    :class="itemClass"
    class="ntk-template-menu-link ntk-template-menu-link--labels"
  >
    <q-item-section class="ntk-template-menu-link__labels">
      <q-icon
        :name="item.icon"
        size="sm"
      />
      <span class="ntk-template-menu-link__label">{{ item.text }}</span>
    </q-item-section>

    <q-menu
      fit
      anchor="top right"
      self="top left"
      transition-show="jump-right"
      transition-hide="jump-left"
      square
    >
      <q-list class="ntk-template-menu-link__submenu">
        <q-item
          v-for="child in visibleChildren"
          :key="child.id ?? child.text"
          clickable
          :disable="child.disabled"
          :to="resolveRouteTo(child.to, child.routeName)"
          :class="childClass(child)"
        >
          <q-item-section avatar>
            <q-icon :name="child.icon ?? 'chevron_right'" />
          </q-item-section>
          <q-item-section>{{ child.text }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-item>

  <q-item
    v-else-if="hasChildren && miniMode"
    v-ripple
    clickable
    :class="itemClass"
    class="ntk-template-menu-link"
  >
    <q-item-section avatar>
      <q-icon
        :name="item.icon"
        size="sm"
      />
      <q-tooltip :offset="[10, 10]">
        {{ item.text }}
      </q-tooltip>
    </q-item-section>

    <q-menu
      fit
      anchor="top right"
      self="top left"
      transition-show="jump-right"
      transition-hide="jump-left"
      square
    >
      <q-list class="ntk-template-menu-link__submenu">
        <q-item
          v-for="child in visibleChildren"
          :key="child.id ?? child.text"
          clickable
          :disable="child.disabled"
          :to="resolveRouteTo(child.to, child.routeName)"
          :class="childClass(child)"
        >
          <q-item-section avatar>
            <q-icon :name="child.icon ?? 'chevron_right'" />
          </q-item-section>
          <q-item-section>{{ child.text }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-item>

  <q-expansion-item
    v-else-if="hasChildren"
    :icon="item.icon"
    :label="item.text"
    :header-class="[
      'ntk-template-menu-link__expansion-header',
      { 'ntk-template-menu-link__expansion-header--active': isCurrentItemActive },
    ]"
    class="ntk-template-menu-link__expansion"
  >
    <q-list class="ntk-template-menu-link__expanded-list q-pl-md">
      <q-item
        v-for="child in visibleChildren"
        :key="child.id ?? child.text"
        clickable
        :disable="child.disabled"
        :to="resolveRouteTo(child.to, child.routeName)"
        :class="['ntk-template-menu-link__child-row', childClass(child)]"
      >
        <q-item-section avatar>
          <q-icon
            :name="child.icon ?? 'chevron_right'"
            size="sm"
          />
        </q-item-section>
        <q-item-section>{{ child.text }}</q-item-section>
      </q-item>
    </q-list>
  </q-expansion-item>

  <q-item
    v-else-if="miniMode && showLabelsInMini"
    v-ripple
    clickable
    :disable="item.disabled"
    :to="resolveRouteTo(item.to, item.routeName)"
    :class="itemClass"
    class="ntk-template-menu-link ntk-template-menu-link--labels"
  >
    <q-item-section class="ntk-template-menu-link__labels">
      <q-icon
        :name="item.icon"
        size="sm"
      />
      <span class="ntk-template-menu-link__label">{{ item.text }}</span>
    </q-item-section>
  </q-item>

  <q-item
    v-else
    v-ripple
    clickable
    :disable="item.disabled"
    :to="resolveRouteTo(item.to, item.routeName)"
    :class="itemClass"
    class="ntk-template-menu-link"
  >
    <q-item-section avatar>
      <q-icon
        :name="item.icon"
        size="sm"
      />
      <q-tooltip
        v-if="miniMode"
        :offset="[10, 10]"
      >
        {{ item.text }}
      </q-tooltip>
    </q-item-section>
    <q-item-section v-if="!miniMode">
      <q-item-label>{{ item.text }}</q-item-label>
    </q-item-section>
    <q-item-section
      v-if="!miniMode && item.badge !== undefined"
      side
    >
      <q-badge
        :label="item.badge"
        color="primary"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import type { TemplateMenuChildItem, TemplateMenuItem } from './menu-template.types'

const props = withDefaults(defineProps<{
  item: TemplateMenuItem
  miniMode?: boolean
  showLabelsInMini?: boolean
}>(), {
  miniMode: false,
  showLabelsInMini: false,
})

const route = useRoute()

const visibleChildren = computed<TemplateMenuChildItem[]>(() => props.item.children ?? [])
const hasChildren = computed<boolean>(() => visibleChildren.value.length > 0)

function isTargetActive(to?: string, routeName?: string): boolean {
  if (routeName && String(route.name ?? '') === routeName) {
    return true
  }
  if (to) {
    return route.path === to || route.path.startsWith(`${to}/`)
  }
  return false
}

const isCurrentItemActive = computed<boolean>(() => {
  if (isTargetActive(props.item.to, props.item.routeName)) {
    return true
  }
  return visibleChildren.value.some(child => isTargetActive(child.to, child.routeName))
})

const itemClass = computed(() => {
  return isCurrentItemActive.value
    ? 'ntk-template-menu-link--active'
    : 'ntk-template-menu-link--inactive'
})

function childClass(child: TemplateMenuChildItem): string {
  return isTargetActive(child.to, child.routeName)
    ? 'ntk-template-menu-link__child--active'
    : 'ntk-template-menu-link__child'
}

function resolveRouteTo(to?: string, routeName?: string): string | { name: string } | undefined {
  if (routeName) {
    return { name: routeName }
  }
  return to
}
</script>

<style lang="scss">
.ntk-template-menu-link {
  transition: all 0.2s ease;
  color: var(--ntk-template-menu-link-color, rgba(255, 255, 255, 0.85));

  .q-item__section,
  .q-item__label {
    color: inherit;
  }

  &:hover {
    background-color: var(--ntk-template-menu-link-hover-bg, rgba(255, 255, 255, 0.08));
  }
}

.ntk-template-menu-link--active {
  border-left: 4px solid var(--ntk-template-menu-link-active-border, rgba(255, 255, 255, 0.85));
  background-color: var(--ntk-template-menu-link-active-bg, rgba(255, 255, 255, 0.16));
}

.ntk-template-menu-link--inactive {
  border-left: 4px solid transparent;
}

.ntk-template-menu-link__submenu {
  min-width: 220px;
}

.ntk-template-menu-link__child {
  border-left: 4px solid transparent;
}

.ntk-template-menu-link__child--active {
  border-left: 4px solid var(--ntk-template-menu-link-active-border, var(--q-primary));
  background-color: var(--ntk-template-menu-link-child-active-bg, rgba(25, 118, 210, 0.1));
}

.ntk-template-menu-link__expansion-header {
  color: var(--ntk-template-menu-link-color, rgba(255, 255, 255, 0.85));
}

.ntk-template-menu-link__expansion-header--active {
  border-left: 4px solid var(--ntk-template-menu-link-active-border, rgba(255, 255, 255, 0.85));
  background-color: var(--ntk-template-menu-link-active-bg, rgba(255, 255, 255, 0.16));
}

.ntk-template-menu-link--labels {
  flex-direction: column;
  min-height: 70px;
}

.ntk-template-menu-link__labels {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.ntk-template-menu-link__label {
  width: 100%;
  padding: 0 2px;
  font-size: 11px;
  line-height: 1.2;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>