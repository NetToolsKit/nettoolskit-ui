<template>
  <q-btn-dropdown
    v-if="hasChildren"
    flat
    no-caps
    dropdown-icon="expand_more"
    class="ntk-template-horizontal-link"
    :class="{ 'ntk-template-horizontal-link--active': isCurrentItemActive }"
  >
    <template #label>
      <q-icon
        :name="item.icon"
        size="xs"
        class="q-mr-sm"
      />
      {{ item.text }}
    </template>

    <q-list class="ntk-template-horizontal-link__submenu">
      <q-item
        v-for="child in visibleChildren"
        :key="child.id ?? child.text"
        v-close-popup
        clickable
        :disable="child.disabled"
        :to="resolveRouteTo(child.to, child.routeName)"
        :class="['ntk-template-horizontal-link__submenu-item', childClass(child)]"
        @click="emitChildClick(child)"
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
  </q-btn-dropdown>

  <q-btn
    v-else
    flat
    no-caps
    class="ntk-template-horizontal-link"
    :class="{ 'ntk-template-horizontal-link--active': isCurrentItemActive }"
    :disable="item.disabled"
    :to="resolveRouteTo(item.to, item.routeName)"
    @click="emitItemClick(item)"
  >
    <q-icon
      :name="item.icon"
      size="xs"
      class="q-mr-sm"
    />
    {{ item.text }}
  </q-btn>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { routeLocationKey } from 'vue-router'

import type { TemplateMenuChildItem, TemplateMenuItem } from './menu-template.types'

const props = defineProps<{
  item: TemplateMenuItem
  activeItemId?: string
}>()

const emit = defineEmits<{
  'item-click': [item: TemplateMenuItem | TemplateMenuChildItem]
}>()

const route = inject(routeLocationKey, null)

const visibleChildren = computed<TemplateMenuChildItem[]>(() => props.item.children ?? [])
const hasChildren = computed<boolean>(() => visibleChildren.value.length > 0)
const isManualActiveMode = computed<boolean>(() => Boolean(props.activeItemId))

function isTargetActive(to?: string, routeName?: string): boolean {
  if (isManualActiveMode.value) {
    return false
  }
  if (routeName && String(route?.name ?? '') === routeName) {
    return true
  }
  if (to) {
    return route?.path === to || Boolean(route?.path?.startsWith(`${to}/`))
  }
  return false
}

const isCurrentItemActive = computed<boolean>(() => {
  if (isManualActiveMode.value) {
    if (props.item.id === props.activeItemId) {
      return true
    }

    return visibleChildren.value.some(child => child.id === props.activeItemId)
  }

  if (isTargetActive(props.item.to, props.item.routeName)) {
    return true
  }
  return visibleChildren.value.some(child => isTargetActive(child.to, child.routeName))
})

function childClass(child: TemplateMenuChildItem): string {
  if (isManualActiveMode.value) {
    return child.id === props.activeItemId
      ? 'ntk-template-horizontal-link__submenu-item--active'
      : ''
  }

  return isTargetActive(child.to, child.routeName)
    ? 'ntk-template-horizontal-link__submenu-item--active'
    : ''
}

function resolveRouteTo(to?: string, routeName?: string): string | { name: string } | undefined {
  if (routeName) {
    return { name: routeName }
  }
  return to
}

function emitItemClick(item: TemplateMenuItem): void {
  if (item.disabled) {
    return
  }

  emit('item-click', item)
}

function emitChildClick(child: TemplateMenuChildItem): void {
  if (child.disabled) {
    return
  }

  emit('item-click', child)
}
</script>

<style lang="scss">
.ntk-template-horizontal-link {
  --ntk-template-horizontal-link-color: color-mix(in srgb, var(--ntk-template-layout-horizontal-text, var(--ntk-template-page-title, var(--ntk-text-primary))) 75%, transparent);
  --ntk-template-horizontal-link-hover-color: var(--ntk-template-layout-horizontal-text, var(--ntk-template-page-title, var(--ntk-text-primary)));
  --ntk-template-horizontal-link-hover-bg: color-mix(in srgb, var(--ntk-template-layout-horizontal-text, var(--ntk-template-page-title, var(--ntk-text-primary))) 8%, transparent);
  --ntk-template-horizontal-link-active-color: var(--ntk-template-layout-horizontal-text, var(--ntk-template-page-title, var(--ntk-text-primary)));
  --ntk-template-horizontal-link-active-border: var(--ntk-template-layout-horizontal-text, var(--ntk-template-page-title, var(--ntk-text-primary)));
  --ntk-template-horizontal-link-active-bg: color-mix(in srgb, var(--ntk-template-layout-horizontal-text, var(--ntk-template-page-title, var(--ntk-text-primary))) 10%, transparent);
  --ntk-template-horizontal-link-submenu-bg: var(--ntk-template-page-card-bg, var(--ntk-card-bg, var(--ntk-bg-primary)));
  --ntk-template-horizontal-link-submenu-text: var(--ntk-template-page-title, var(--ntk-text-heading, var(--ntk-text-primary)));
  --ntk-template-horizontal-link-submenu-hover-bg: color-mix(in srgb, var(--ntk-template-page-text, var(--ntk-text-primary)) 5%, transparent);
  --ntk-template-horizontal-link-submenu-active-bg: color-mix(in srgb, var(--ntk-primary, var(--ntk-accent)) 10%, transparent);
  --ntk-template-horizontal-link-submenu-active-border: var(--ntk-primary, var(--ntk-accent));
  --ntk-template-horizontal-link-submenu-active-color: var(--ntk-primary, var(--ntk-accent));

  color: var(--ntk-template-horizontal-link-color) !important;
  font-size: 13px;
  font-weight: 400;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  padding: 8px 16px;
  transition: all 0.2s ease;

  &:hover {
    color: var(--ntk-template-horizontal-link-hover-color) !important;
    background-color: var(--ntk-template-horizontal-link-hover-bg);
  }
}

.ntk-template-horizontal-link--active {
  color: var(--ntk-template-horizontal-link-active-color) !important;
  font-weight: 500;
  border-bottom: 2px solid var(--ntk-template-horizontal-link-active-border) !important;
  background-color: var(--ntk-template-horizontal-link-active-bg);
}

.ntk-template-horizontal-link__submenu {
  min-width: 220px;
  background: var(--ntk-template-horizontal-link-submenu-bg);
}

.ntk-template-horizontal-link__submenu-item {
  border-left: 3px solid transparent;
  transition: all 0.2s ease;
  color: var(--ntk-template-horizontal-link-submenu-text);

  &:hover {
    background-color: var(--ntk-template-horizontal-link-submenu-hover-bg);
  }
}

.ntk-template-horizontal-link__submenu-item--active {
  border-left: 3px solid var(--ntk-template-horizontal-link-submenu-active-border) !important;
  background-color: var(--ntk-template-horizontal-link-submenu-active-bg);
  color: var(--ntk-template-horizontal-link-submenu-active-color);
}
</style>
