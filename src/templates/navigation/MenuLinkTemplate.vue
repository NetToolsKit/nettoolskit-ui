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
      content-class="ntk-template-menu-link__submenu-popup"
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
      <q-tooltip
        class="ntk-template-menu-link__tooltip"
        :offset="[10, 10]"
      >
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
      content-class="ntk-template-menu-link__submenu-popup"
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
        class="ntk-template-menu-link__tooltip"
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
        class="ntk-template-menu-link__badge"
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
  --ntk-template-menu-link-text-resolved: var(--ntk-template-menu-link-color, var(--ntk-template-layout-nav-text, var(--ntk-template-layout-drawer-text, var(--ntk-drawer-text, var(--ntk-template-page-text, var(--ntk-text-primary))))));
  --ntk-template-menu-link-hover-bg-resolved: var(--ntk-template-menu-link-hover-bg, var(--ntk-template-layout-nav-hover-bg, color-mix(in srgb, var(--ntk-template-layout-drawer-text, var(--ntk-template-page-text, var(--ntk-text-primary))) 8%, transparent)));
  --ntk-template-menu-link-active-border-resolved: var(--ntk-template-menu-link-active-border, var(--ntk-template-layout-nav-active-border, var(--ntk-primary, var(--ntk-accent))));
  --ntk-template-menu-link-active-bg-resolved: var(--ntk-template-menu-link-active-bg, var(--ntk-template-layout-nav-active-bg, linear-gradient(90deg, color-mix(in srgb, var(--ntk-template-menu-link-active-border-resolved) 20%, transparent) 0%, color-mix(in srgb, var(--ntk-template-menu-link-active-border-resolved) 6%, transparent) 100%)));
  --ntk-template-menu-link-active-text-resolved: var(--ntk-template-menu-link-active-text, var(--ntk-template-layout-nav-active-text, var(--ntk-accent, var(--ntk-template-layout-drawer-text, var(--ntk-template-page-title, var(--ntk-text-primary))))));
  --ntk-template-menu-link-caption-resolved: var(--ntk-template-menu-link-caption, color-mix(in srgb, var(--ntk-template-menu-link-text-resolved) 76%, transparent));
  --ntk-template-menu-link-submenu-bg-resolved: var(--ntk-template-menu-link-submenu-bg, var(--ntk-template-layout-submenu-bg, var(--ntk-template-overlay-bg, var(--ntk-template-page-card-bg, var(--ntk-card-bg, var(--ntk-bg-primary))))));
  --ntk-template-menu-link-submenu-border-resolved: var(--ntk-template-menu-link-submenu-border, var(--ntk-template-layout-submenu-border, var(--ntk-template-overlay-border, var(--ntk-template-layout-toolbar-border, color-mix(in srgb, var(--ntk-template-page-text, var(--ntk-text-primary)) 12%, transparent)))));
  --ntk-template-menu-link-submenu-text-resolved: var(--ntk-template-menu-link-submenu-text, var(--ntk-template-layout-submenu-text, var(--ntk-template-overlay-text, var(--ntk-template-page-title, var(--ntk-text-heading, var(--ntk-text-primary))))));
  --ntk-template-menu-link-submenu-hover-bg-resolved: var(--ntk-template-menu-link-submenu-hover-bg, var(--ntk-template-layout-submenu-hover-bg, var(--ntk-template-overlay-hover-bg, color-mix(in srgb, var(--ntk-template-page-text, var(--ntk-text-primary)) 5%, transparent))));
  --ntk-template-menu-link-submenu-active-border-resolved: var(--ntk-template-menu-link-submenu-active-border, var(--ntk-template-layout-submenu-active-border, var(--ntk-template-menu-link-active-border-resolved)));
  --ntk-template-menu-link-submenu-active-bg-resolved: var(--ntk-template-menu-link-submenu-active-bg, var(--ntk-template-layout-submenu-active-bg, var(--ntk-template-overlay-active-bg, color-mix(in srgb, var(--ntk-template-menu-link-active-border-resolved) 12%, transparent))));
  --ntk-template-menu-link-submenu-active-text-resolved: var(--ntk-template-menu-link-submenu-active-text, var(--ntk-template-layout-submenu-active-text, var(--ntk-template-menu-link-active-text-resolved)));
  --ntk-template-menu-link-child-active-bg-resolved: var(--ntk-template-menu-link-child-active-bg, var(--ntk-template-menu-link-active-bg-resolved));
  --ntk-template-menu-link-submenu-radius-resolved: var(--ntk-template-menu-link-submenu-radius, var(--ntk-template-overlay-radius, 8px));
  --ntk-template-menu-link-shadow-resolved: var(--ntk-template-menu-link-shadow, var(--ntk-template-layout-submenu-shadow, var(--ntk-template-overlay-shadow, var(--ntk-shadow-soft, 0 4px 16px color-mix(in srgb, var(--ntk-template-page-text, var(--ntk-text-primary)) 8%, transparent)))));
  --ntk-template-menu-link-reference-hover-bg-resolved: var(--ntk-template-menu-link-reference-hover-bg, var(--ntk-template-layout-reference-nav-hover-bg, color-mix(in srgb, var(--ntk-template-layout-drawer-text, var(--ntk-template-page-text, var(--ntk-text-primary))) 5%, transparent)));
  --ntk-template-menu-link-active-shadow-resolved: var(--ntk-template-menu-link-active-shadow, 0 0 0 1px color-mix(in srgb, var(--ntk-template-menu-link-active-border-resolved) 24%, transparent), 0 10px 18px color-mix(in srgb, var(--ntk-template-layout-page-text) 18%, transparent));
  --ntk-template-menu-link-active-inset-resolved: var(--ntk-template-menu-link-active-inset, inset 0 0 0 1px color-mix(in srgb, var(--ntk-template-layout-drawer-text) 14%, transparent));

  transition: all 0.2s ease;
  color: var(--ntk-template-menu-link-text-resolved) !important;

  .q-item__section,
  .q-item-section,
  .q-item__label {
    color: inherit !important;
  }
}

.ntk-template-menu-link__expansion-header {
  color: var(--ntk-template-menu-link-text-resolved) !important;
}

.ntk-template-menu-link__expansion-header .q-expansion-item__toggle-icon {
  color: inherit !important;
}

.ntk-template-menu-link--active {
  border-left: 4px solid var(--ntk-template-menu-link-active-border-resolved);
  background: var(--ntk-template-menu-link-active-bg-resolved);
  color: var(--ntk-template-menu-link-active-text-resolved) !important;
}

.ntk-template-menu-link--inactive {
  border-left: 4px solid transparent;
}

.ntk-template-menu-link__submenu {
  min-width: 220px;
  padding: 6px;

  .q-item {
    border-left: 3px solid transparent;
    border-radius: 12px;
    color: var(--ntk-template-menu-link-submenu-text-resolved);

    &:hover {
      background: var(--ntk-template-menu-link-submenu-hover-bg-resolved);
    }
  }

  .q-item.q-router-link--active,
  .q-item--active {
    color: var(--ntk-template-menu-link-submenu-active-text-resolved) !important;
    border-left-color: var(--ntk-template-menu-link-submenu-active-border-resolved);
    background: var(--ntk-template-menu-link-submenu-active-bg-resolved);
  }
}

.ntk-template-menu-link__submenu-popup {
  --ntk-template-overlay-bg: var(--ntk-template-menu-link-submenu-bg-resolved);
  --ntk-template-overlay-border: var(--ntk-template-menu-link-submenu-border-resolved);
  --ntk-template-overlay-text: var(--ntk-template-menu-link-submenu-text-resolved);
  --ntk-template-overlay-shadow: var(--ntk-template-menu-link-shadow-resolved);
  --ntk-template-overlay-hover-bg: var(--ntk-template-menu-link-submenu-hover-bg-resolved);
  --ntk-template-overlay-active-bg: var(--ntk-template-menu-link-submenu-active-bg-resolved);
  --ntk-template-overlay-radius: var(--ntk-template-menu-link-submenu-radius-resolved);
}

.ntk-template-menu-link__expanded-list {
  padding-block: 4px;

  .q-item.q-router-link--active,
  .q-item--active {
    color: var(--ntk-template-menu-link-active-text-resolved) !important;
  }
}

.ntk-template-menu-link__child {
  border-left: 4px solid transparent;
  border-radius: 0 8px 8px 0;
}

.ntk-template-menu-link__child--active {
  border-left: 4px solid var(--ntk-template-menu-link-active-border-resolved);
  background: var(--ntk-template-menu-link-child-active-bg-resolved);
}

.ntk-template-menu-link__expansion-header--active {
  border-left: 4px solid var(--ntk-template-menu-link-active-border-resolved);
  background: var(--ntk-template-menu-link-active-bg-resolved);
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

.ntk-template-menu-link :deep(.q-item__label--caption) {
  opacity: 0.72;
  color: var(--ntk-template-menu-link-caption-resolved) !important;
}

.ntk-template-menu-link--visual-reference {
  box-sizing: border-box;
  border-left: 4px solid transparent !important;
  border-radius: 0;
  transition: all 0.2s ease !important;
}

.ntk-template-menu-link--visual-reference:hover {
  background: var(--ntk-template-menu-link-reference-hover-bg-resolved);
}

.ntk-template-menu-link--visual-reference.ntk-template-menu-link--active {
  border-left: 4px solid var(--ntk-template-menu-link-active-border-resolved) !important;
  background: var(--ntk-template-menu-link-active-bg-resolved) !important;
}

.ntk-template-menu-link--visual-reference.ntk-template-menu-link--active .q-icon,
.ntk-template-menu-link--visual-reference.ntk-template-menu-link--active .q-item__label,
.ntk-template-menu-link--visual-reference.ntk-template-menu-link--active .q-item__section,
.ntk-template-menu-link--visual-reference.ntk-template-menu-link--active .q-item-section {
  color: var(--ntk-template-menu-link-active-text-resolved) !important;
  font-weight: 500;
}

.ntk-template-menu-link__expansion-header.ntk-template-menu-link--visual-reference {
  box-sizing: border-box;
  border-left: 4px solid transparent !important;
  border-radius: 0;
}

.ntk-template-menu-link__expansion-header.ntk-template-menu-link--visual-reference:hover {
  background: var(--ntk-template-menu-link-reference-hover-bg-resolved);
}

.ntk-template-menu-link__expansion-header.ntk-template-menu-link--visual-reference.ntk-template-menu-link__expansion-header--active {
  border-left: 4px solid var(--ntk-template-menu-link-active-border-resolved) !important;
  background: var(--ntk-template-menu-link-active-bg-resolved) !important;
}

.ntk-template-menu-link__child.ntk-template-menu-link--visual-reference,
.ntk-template-menu-link__child-row.ntk-template-menu-link--visual-reference {
  box-sizing: border-box;
  border-left: 4px solid transparent !important;
  border-radius: 0;
}

.ntk-template-menu-link__child--active.ntk-template-menu-link--visual-reference,
.ntk-template-menu-link--visual-reference .ntk-template-menu-link__child--active {
  border-left: 4px solid var(--ntk-template-menu-link-active-border-resolved) !important;
  background: var(--ntk-template-menu-link-child-active-bg-resolved) !important;
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
  background: var(--ntk-template-menu-link-hover-bg-resolved);
}

.ntk-template-menu-link--visual-vercel.ntk-template-menu-link--active {
  border-left-color: var(--ntk-template-menu-link-active-border-resolved);
  background: var(--ntk-template-menu-link-active-bg-resolved);
  box-shadow: var(--ntk-template-menu-link-active-shadow-resolved);
  transform: translateX(4px);
}

.ntk-template-menu-link--visual-vercel.ntk-template-menu-link--active::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  box-shadow: var(--ntk-template-menu-link-active-inset-resolved);
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
  background: var(--ntk-template-menu-link-hover-bg-resolved);
}

.ntk-template-menu-link__expansion-header.ntk-template-menu-link--visual-vercel.ntk-template-menu-link__expansion-header--active {
  border-left-color: var(--ntk-template-menu-link-active-border-resolved);
  background: var(--ntk-template-menu-link-active-bg-resolved);
  transform: translateX(4px);
}

.ntk-template-menu-link__child--active.ntk-template-menu-link--visual-vercel,
.ntk-template-menu-link--visual-vercel .ntk-template-menu-link__child--active {
  border-left-color: var(--ntk-template-menu-link-active-border-resolved);
  background: var(--ntk-template-menu-link-child-active-bg-resolved);
}

.ntk-template-menu-link__badge {
  background: var(--ntk-primary, var(--ntk-accent)) !important;
  color: var(--ntk-text-on-primary, var(--ntk-text-on-accent, var(--ntk-template-page-title, var(--ntk-text-primary)))) !important;
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
