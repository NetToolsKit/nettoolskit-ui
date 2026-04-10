<template>
  <q-item
    v-if="hasChildren && miniMode && showLabelsInMini"
    v-ripple
    clickable
    :class="[itemClass, menuVisualClass]"
    class="ntk-template-menu-link ntk-template-menu-link--labels"
    @click="emitItemClick(item)"
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
          :class="[childClass(child), menuVisualClass]"
          @click="emitChildClick(child)"
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
    :class="[itemClass, menuVisualClass]"
    class="ntk-template-menu-link"
    @click="emitItemClick(item)"
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
          :class="[childClass(child), menuVisualClass]"
          @click="emitChildClick(child)"
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
      menuVisualClass,
      { 'ntk-template-menu-link__expansion-header--active': isCurrentItemActive },
    ]"
    :class="['ntk-template-menu-link__expansion', menuVisualClass]"
  >
    <q-list class="ntk-template-menu-link__expanded-list q-pl-md">
      <q-item
        v-for="child in visibleChildren"
        :key="child.id ?? child.text"
        clickable
        :disable="child.disabled"
        :to="resolveRouteTo(child.to, child.routeName)"
        :class="['ntk-template-menu-link__child-row', childClass(child), menuVisualClass]"
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
  </q-expansion-item>

  <q-item
    v-else-if="miniMode && showLabelsInMini"
    v-ripple
    clickable
    :disable="item.disabled"
    :to="resolveRouteTo(item.to, item.routeName)"
    :class="[itemClass, menuVisualClass]"
    class="ntk-template-menu-link ntk-template-menu-link--labels"
    @click="emitItemClick(item)"
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
    :class="[itemClass, menuVisualClass]"
    class="ntk-template-menu-link"
    @click="emitItemClick(item)"
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
      <q-item-label
        v-if="showCaption"
        caption
      >
        {{ item.caption }}
      </q-item-label>
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
import { computed, inject } from 'vue'
import { routeLocationKey } from 'vue-router'

import type { TemplateMenuChildItem, TemplateMenuItem } from './menu-template.types'

const props = withDefaults(defineProps<{
  item: TemplateMenuItem
  miniMode?: boolean
  showLabelsInMini?: boolean
  menuVisualStyle?: 'vercel' | 'reference'
  activeItemId?: string
}>(), {
  miniMode: false,
  showLabelsInMini: false,
  menuVisualStyle: 'vercel',
  activeItemId: '',
})

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

const itemClass = computed(() => {
  return isCurrentItemActive.value
    ? 'ntk-template-menu-link--active'
    : 'ntk-template-menu-link--inactive'
})

const menuVisualClass = computed<string>(() => {
  return props.menuVisualStyle === 'reference'
    ? 'ntk-template-menu-link--visual-reference'
    : 'ntk-template-menu-link--visual-vercel'
})

const showCaption = computed<boolean>(() => {
  return Boolean(itemHasCaption.value) && props.menuVisualStyle !== 'reference'
})

const itemHasCaption = computed<boolean>(() => {
  return String(props.item.caption ?? '').trim().length > 0
})

function childClass(child: TemplateMenuChildItem): string {
  if (isManualActiveMode.value) {
    return child.id === props.activeItemId
      ? 'ntk-template-menu-link__child--active'
      : 'ntk-template-menu-link__child'
  }

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
.ntk-template-menu-link {
  transition: all 0.2s ease;
  color: var(--ntk-template-layout-nav-text, rgba(255, 255, 255, 0.82)) !important;

  .q-item__section,
  .q-item-section,
  .q-item__label {
    color: inherit !important;
  }
}

.ntk-template-menu-link__expansion-header {
  color: var(--ntk-template-layout-nav-text, rgba(255, 255, 255, 0.82)) !important;
}

.ntk-template-menu-link__expansion-header .q-expansion-item__toggle-icon {
  color: inherit !important;
}

.ntk-template-menu-link--active {
  border-left: 4px solid var(--ntk-template-layout-nav-active-border, rgba(255, 255, 255, 0.8));
  background: var(--ntk-template-layout-nav-active-bg, rgba(255, 255, 255, 0.15));
  color: var(--ntk-template-layout-nav-active-text, #ffffff) !important;
}

.ntk-template-menu-link--inactive {
  border-left: 4px solid transparent;
}

.ntk-template-menu-link__submenu {
  min-width: 220px;
  padding: 6px;
  border-radius: 18px;
  border: 1px solid var(--ntk-template-layout-toolbar-border, rgba(148, 163, 184, 0.18));
  background: var(--ntk-template-page-card-bg, #ffffff);
  box-shadow: var(--ntk-shadow-md, 0 18px 48px rgba(15, 23, 42, 0.12));

  .q-item {
    border-left: 3px solid transparent;
    border-radius: 12px;
    color: var(--ntk-text-primary, #0f172a);

    &:hover {
      background: var(--ntk-template-layout-submenu-hover-bg, rgba(15, 23, 42, 0.05));
    }
  }

  .q-item.q-router-link--active,
  .q-item--active {
    color: var(--ntk-primary, #10b981) !important;
    border-left-color: var(--ntk-template-layout-submenu-active-border, var(--ntk-primary, #10b981));
    background: var(--ntk-template-layout-submenu-active-bg, rgba(16, 185, 129, 0.12));
  }
}

.ntk-template-menu-link__expanded-list {
  padding-block: 4px;

  .q-item.q-router-link--active,
  .q-item--active {
    color: var(--ntk-template-layout-nav-active-text, #ffffff) !important;
  }
}

.ntk-template-menu-link__child {
  border-left: 4px solid transparent;
  border-radius: 0 12px 12px 0;
}

.ntk-template-menu-link__child--active {
  border-left: 4px solid var(--ntk-template-layout-nav-active-border, rgba(255, 255, 255, 0.8));
  background: var(--ntk-template-layout-nav-active-bg, rgba(255, 255, 255, 0.15));
}

.ntk-template-menu-link__expansion-header--active {
  border-left: 4px solid var(--ntk-template-layout-nav-active-border, rgba(255, 255, 255, 0.8));
  background: var(--ntk-template-layout-nav-active-bg, rgba(255, 255, 255, 0.15));
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
  font-family: 'IBM Plex Mono', ui-monospace, monospace;
  font-size: 11px;
  line-height: 1.2;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.ntk-template-menu-link :deep(.q-item__label--caption) {
  opacity: 0.72;
  color: color-mix(in srgb, var(--ntk-template-layout-nav-text, #ffffff) 76%, transparent) !important;
}

.ntk-template-menu-link--visual-reference {
  margin: 3px 10px 3px 0;
  border-left: 4px solid transparent !important;
  border-radius: 0 16px 16px 0;
  transition:
    transform 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.22s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.22s cubic-bezier(0.22, 1, 0.36, 1);
}

.ntk-template-menu-link--visual-reference:hover {
  transform: translateX(2px);
  background: var(--ntk-template-layout-nav-hover-bg, rgba(255, 255, 255, 0.08));
}

.ntk-template-menu-link--visual-reference.ntk-template-menu-link--active {
  border-left: 4px solid var(--ntk-template-layout-nav-active-border, rgba(255, 255, 255, 0.8)) !important;
  background: var(--ntk-template-layout-nav-active-bg, rgba(255, 255, 255, 0.15)) !important;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ntk-template-layout-nav-active-border, #ffffff) 16%, transparent);
}

.ntk-template-menu-link--visual-reference.ntk-template-menu-link--active .q-icon,
.ntk-template-menu-link--visual-reference.ntk-template-menu-link--active .q-item__label,
.ntk-template-menu-link--visual-reference.ntk-template-menu-link--active .q-item__section,
.ntk-template-menu-link--visual-reference.ntk-template-menu-link--active .q-item-section {
  color: var(--ntk-template-layout-nav-active-text, #ffffff) !important;
  font-weight: 500;
}

.ntk-template-menu-link__expansion-header.ntk-template-menu-link--visual-reference {
  margin: 3px 10px 3px 0;
  border-left: 4px solid transparent !important;
  border-radius: 0 16px 16px 0;
}

.ntk-template-menu-link__expansion-header.ntk-template-menu-link--visual-reference:hover {
  background: var(--ntk-template-layout-nav-hover-bg, rgba(255, 255, 255, 0.08));
}

.ntk-template-menu-link__expansion-header.ntk-template-menu-link--visual-reference.ntk-template-menu-link__expansion-header--active {
  border-left: 4px solid var(--ntk-template-layout-nav-active-border, rgba(255, 255, 255, 0.8)) !important;
  background: var(--ntk-template-layout-nav-active-bg, rgba(255, 255, 255, 0.15)) !important;
}

.ntk-template-menu-link__child--active.ntk-template-menu-link--visual-reference,
.ntk-template-menu-link--visual-reference .ntk-template-menu-link__child--active {
  border-left: 4px solid var(--ntk-template-layout-nav-active-border, rgba(255, 255, 255, 0.8)) !important;
  background: var(--ntk-template-layout-nav-active-bg, rgba(255, 255, 255, 0.15)) !important;
}

.ntk-template-menu-link--visual-vercel {
  position: relative;
  margin: 3px 8px 3px 10px;
  border-left-width: 3px;
  border-radius: 14px;
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

.ntk-template-menu-link--visual-vercel:hover {
  transform: translateX(3px);
  background: var(--ntk-template-layout-nav-hover-bg, rgba(255, 255, 255, 0.08));
}

.ntk-template-menu-link--visual-vercel.ntk-template-menu-link--active {
  border-left-color: var(--ntk-template-layout-nav-active-border, #10b981);
  background: var(--ntk-template-layout-nav-active-bg, linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.06) 100%));
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--ntk-template-layout-nav-active-border, #10b981) 24%, transparent),
    0 10px 18px rgba(15, 23, 42, 0.18);
  transform: translateX(4px);
}

.ntk-template-menu-link--visual-vercel.ntk-template-menu-link--active::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.14);
  animation: ntk-template-menu-link-select-in 0.24s ease-out;
}

.ntk-template-menu-link__expansion-header.ntk-template-menu-link--visual-vercel {
  margin: 3px 8px 3px 10px;
  border-radius: 14px;
  border-left: 3px solid transparent;
  transition:
    transform 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.24s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.24s cubic-bezier(0.22, 1, 0.36, 1);
}

.ntk-template-menu-link__expansion-header.ntk-template-menu-link--visual-vercel:hover {
  transform: translateX(3px);
  background: var(--ntk-template-layout-nav-hover-bg, rgba(255, 255, 255, 0.08));
}

.ntk-template-menu-link__expansion-header.ntk-template-menu-link--visual-vercel.ntk-template-menu-link__expansion-header--active {
  border-left-color: var(--ntk-template-layout-nav-active-border, #10b981);
  background: var(--ntk-template-layout-nav-active-bg, linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.06) 100%));
  transform: translateX(4px);
}

.ntk-template-menu-link__child--active.ntk-template-menu-link--visual-vercel,
.ntk-template-menu-link--visual-vercel .ntk-template-menu-link__child--active {
  border-left-color: var(--ntk-template-layout-nav-active-border, #10b981);
  background: var(--ntk-template-layout-nav-active-bg, linear-gradient(90deg, rgba(16, 185, 129, 0.17) 0%, rgba(16, 185, 129, 0.05) 100%));
}

@keyframes ntk-template-menu-link-select-in {
  from {
    opacity: 0;
    transform: scaleX(0.96);
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}
</style>
