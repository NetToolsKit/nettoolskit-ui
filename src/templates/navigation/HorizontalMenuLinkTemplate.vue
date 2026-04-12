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
}>()

const route = inject(routeLocationKey, null)

const visibleChildren = computed<TemplateMenuChildItem[]>(() => props.item.children ?? [])
const hasChildren = computed<boolean>(() => visibleChildren.value.length > 0)

function isTargetActive(to?: string, routeName?: string): boolean {
  if (routeName && String(route?.name ?? '') === routeName) {
    return true
  }
  if (to) {
    return route?.path === to || Boolean(route?.path?.startsWith(`${to}/`))
  }
  return false
}

const isCurrentItemActive = computed<boolean>(() => {
  if (isTargetActive(props.item.to, props.item.routeName)) {
    return true
  }
  return visibleChildren.value.some(child => isTargetActive(child.to, child.routeName))
})

function childClass(child: TemplateMenuChildItem): string {
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
</script>

<style lang="scss">
.ntk-template-horizontal-link {
  color: var(--ntk-template-horizontal-link-color, rgba(255, 255, 255, 0.8)) !important;
  font-family: var(--ntk-font-family, Inter, system-ui, sans-serif);
  font-size: 13px;
  font-weight: 400;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  padding: 8px 16px;
  transition: all 0.2s ease;

  &:hover {
    color: var(--ntk-template-horizontal-link-hover-color, #ffffff) !important;
    background-color: var(--ntk-template-horizontal-link-hover-bg, rgba(255, 255, 255, 0.08));
  }
}

.ntk-template-horizontal-link--active {
  color: var(--ntk-template-horizontal-link-active-color, #ffffff) !important;
  font-weight: 500;
  border-bottom: 2px solid var(--ntk-template-horizontal-link-active-border, #ffffff) !important;
  background-color: var(--ntk-template-horizontal-link-active-bg, rgba(255, 255, 255, 0.12));
}

.ntk-template-horizontal-link__submenu {
  min-width: 220px;
  padding: 6px;
  border-radius: 8px;
  border: 1px solid var(--ntk-template-layout-toolbar-border, rgba(148, 163, 184, 0.18));
  background: var(--ntk-template-page-card-bg, #ffffff);
  box-shadow: var(--ntk-shadow-soft, 0 4px 16px rgba(15, 23, 42, 0.08));
}

.ntk-template-horizontal-link__submenu-item {
  border-left: 3px solid transparent;
  border-radius: 8px;
  transition: all 0.2s ease;
  color: var(--ntk-text-primary, #0f172a);

  &:hover {
    background-color: var(--ntk-template-horizontal-link-submenu-hover-bg, rgba(0, 0, 0, 0.05));
  }
}

.ntk-template-horizontal-link__submenu-item--active {
  border-left: 3px solid var(--ntk-template-horizontal-link-submenu-active-border, var(--q-primary)) !important;
  background-color: var(--ntk-template-horizontal-link-submenu-active-bg, rgba(25, 118, 210, 0.1));
  color: var(--ntk-template-horizontal-link-submenu-active-color, var(--q-primary));
}
</style>
