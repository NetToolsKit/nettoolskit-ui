<template>
  <q-layout
    :view="layoutView"
    :class="[
      'ntk-template-main-layout',
      sideMenuVariant === 'vercel'
        ? 'ntk-template-main-layout--side-vercel'
        : 'ntk-template-main-layout--side-reference',
    ]"
  >
    <q-header
      v-if="showHeader"
      class="ntk-template-main-layout__header"
      bordered
    >
      <q-toolbar>
        <div
          class="ntk-template-main-layout__menu-btn"
          :class="{ 'ntk-template-main-layout__menu-btn--hidden': horizontalMode }"
        >
          <q-btn
            flat
            dense
            round
            :icon="miniMode ? 'menu' : 'menu_open'"
            :aria-label="miniMode ? expandMenuAriaLabel : collapseMenuAriaLabel"
            @click="toggleMiniMode"
          />
        </div>

        <slot name="brand">
          <div class="ntk-template-main-layout__brand">
            <img
              v-if="logoSrc"
              :src="logoSrc"
              :alt="logoAlt"
              class="ntk-template-main-layout__logo"
            >
            <span class="ntk-template-main-layout__title">{{ appName }}</span>
          </div>
        </slot>

        <slot name="breadcrumb">
          <AppBreadcrumbTemplate
            v-if="showBreadcrumb"
            class="q-ml-md"
          />
        </slot>

        <q-space />

        <slot
          name="header-actions"
          :layout-controls="{
            horizontalMode,
            setHorizontalMode,
            showLabelsInMini,
            setShowLabelsInMini,
            sideMenuVariant,
            setSideMenuVariant,
          }"
        >
          <UserMenuTemplate
            v-model="horizontalMode"
            v-model:show-labels-in-mini="showLabelsInMini"
            v-model:side-menu-variant="sideMenuVariant"
            :app-name="appName"
            :profile-name="userName"
            :profile-initials="userInitials"
            @account-click="$emit('account-click')"
            @logout-click="$emit('logout-click')"
          />
        </slot>
      </q-toolbar>

      <transition name="ntk-template-main-layout__slide-down">
        <q-toolbar
          v-if="horizontalMode"
          class="ntk-template-main-layout__horizontal-nav"
        >
          <nav class="ntk-template-main-layout__horizontal-nav-list q-gutter-x-xs">
            <HorizontalMenuLinkTemplate
              v-for="item in menuItems"
              :key="item.id"
              :item="item"
              :active-item-id="activeItemId"
              @item-click="forwardMenuItemClick"
            />
          </nav>
        </q-toolbar>
      </transition>
    </q-header>

    <q-drawer
      v-if="!horizontalMode && showDrawer"
      show-if-above
      side="left"
      bordered
      :width="resolvedDrawerWidth"
      :mini="miniMode && !showLabelsInMini"
      :mini-width="miniDrawerWidth"
      :class="[
        'ntk-template-main-layout__drawer',
        { 'ntk-template-main-layout__drawer--mini': isDrawerMiniMode },
      ]"
    >
      <div class="ntk-template-main-layout__drawer-container">
        <div class="ntk-template-main-layout__drawer-scroll">
          <q-list
            class="q-pt-none"
            style="margin-top: 2px"
          >
            <template
              v-for="(item, index) in primaryMenuItems"
              :key="item.id"
            >
              <q-item-label
                v-if="shouldRenderGroupLabel(primaryMenuItems, index)"
                class="ntk-template-main-layout__group-caption"
                :class="{ 'ntk-template-main-layout__group-caption--mini': isDrawerMiniMode }"
              >
                <span class="ntk-template-main-layout__group-caption-text">
                  {{ isDrawerMiniMode ? getCompactGroupLabel(item.groupLabel) : item.groupLabel }}
                </span>
                <q-tooltip
                  v-if="isDrawerMiniMode && item.groupLabel"
                  class="ntk-template-main-layout__group-tooltip"
                  :offset="[10, 0]"
                >
                  {{ item.groupLabel }}
                </q-tooltip>
              </q-item-label>

              <MenuLinkTemplate
                :item="item"
                :mini-mode="miniMode"
                :show-labels-in-mini="showLabelsInMini"
                :menu-visual-style="sideMenuVariant"
                :active-item-id="activeItemId"
                @item-click="forwardMenuItemClick"
              />
            </template>
          </q-list>
        </div>

        <div
          v-if="secondaryMenuItems.length > 0"
          class="ntk-template-main-layout__drawer-bottom"
        >
          <MenuLinkTemplate
            v-for="item in secondaryMenuItems"
            :key="item.id"
            :item="item"
            :mini-mode="miniMode"
            :show-labels-in-mini="showLabelsInMini"
            :menu-visual-style="sideMenuVariant"
            :active-item-id="activeItemId"
            @item-click="forwardMenuItemClick"
          />
        </div>
      </div>
    </q-drawer>

    <q-page-container :class="['ntk-template-main-layout__page-container', pageContainerClass]">
      <component
        :is="RouterView"
        v-if="useRouterView"
        v-slot="{ Component, route }"
      >
        <transition
          name="ntk-template-main-layout__route-fade"
          mode="out-in"
        >
          <component
            :is="Component"
            :key="route.path"
          />
        </transition>
      </component>
      <slot v-else />
    </q-page-container>

    <!-- Slot for floating elements (FABs, overlay drawers, chat panels) -->
    <slot name="floating" />
  </q-layout>
</template>

<script lang="ts">
export const TEMPLATE_LAYOUT_PERSISTED_SUFFIXES = [
  'horizontal-mode',
  'mini-mode',
  'mini-labels',
  'side-menu-variant',
] as const

export function clearTemplateLayoutPersistence(storageKeyPrefix = 'ntk-template-layout'): void {
  if (typeof window === 'undefined') {
    return
  }

  for (const suffix of TEMPLATE_LAYOUT_PERSISTED_SUFFIXES) {
    try {
      window.localStorage.removeItem(`${storageKeyPrefix}:${suffix}`)
    } catch {
      // Intentionally ignore persistence failures (private mode, quota, SSR).
    }
  }
}
</script>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterView } from 'vue-router'

import AppBreadcrumbTemplate from '../navigation/AppBreadcrumbTemplate.vue'
import HorizontalMenuLinkTemplate from '../navigation/HorizontalMenuLinkTemplate.vue'
import MenuLinkTemplate from '../navigation/MenuLinkTemplate.vue'
import UserMenuTemplate from '../navigation/UserMenuTemplate.vue'
import type { TemplateMenuChildItem, TemplateMenuItem } from '../navigation/menu-template.types'

const props = withDefaults(defineProps<{
  appName?: string
  logoSrc?: string
  logoAlt?: string
  userName?: string
  userInitials?: string
  menuItems: TemplateMenuItem[]
  showHeader?: boolean
  showDrawer?: boolean
  showBreadcrumb?: boolean
  useRouterView?: boolean
  persistMode?: boolean
  storageKeyPrefix?: string
  layoutView?: string
  drawerWidth?: number
  miniLabelsDrawerWidth?: number
  miniDrawerWidth?: number
  pageContainerClass?: string
  expandMenuAriaLabel?: string
  collapseMenuAriaLabel?: string
  sideMenuVariant?: 'vercel' | 'reference'
  activeItemId?: string
  defaultHorizontalMode?: boolean
  defaultMiniMode?: boolean
  defaultShowLabelsInMini?: boolean
}>(), {
  appName: 'NetToolsKit',
  logoSrc: '',
  logoAlt: 'App logo',
  userName: 'User',
  userInitials: 'U',
  showHeader: true,
  showDrawer: true,
  showBreadcrumb: true,
  useRouterView: false,
  persistMode: true,
  storageKeyPrefix: 'ntk-template-layout',
  layoutView: 'hHh lpR fFf',
  drawerWidth: 250,
  miniLabelsDrawerWidth: 90,
  miniDrawerWidth: 56,
  pageContainerClass: '',
  expandMenuAriaLabel: 'Expand side menu',
  collapseMenuAriaLabel: 'Collapse side menu',
  sideMenuVariant: 'vercel',
  activeItemId: '',
  defaultHorizontalMode: false,
  defaultMiniMode: false,
  defaultShowLabelsInMini: false,
})

const emit = defineEmits<{
  'account-click': []
  'logout-click': []
  'menu-item-click': [item: TemplateMenuItem | TemplateMenuChildItem]
}>()

const horizontalMode = ref(props.defaultHorizontalMode)
const miniMode = ref(props.defaultMiniMode)
const showLabelsInMini = ref(props.defaultShowLabelsInMini)
const sideMenuVariant = ref<'vercel' | 'reference'>(props.sideMenuVariant)

const isDrawerMiniMode = computed<boolean>(() => {
  return miniMode.value && !showLabelsInMini.value
})

const resolvedDrawerWidth = computed<number>(() => {
  if (miniMode.value && showLabelsInMini.value) {
    return props.miniLabelsDrawerWidth
  }

  return props.drawerWidth
})

const primaryMenuItems = computed<TemplateMenuItem[]>(() => {
  return props.menuItems.filter(item => !item.stickyBottom)
})

const secondaryMenuItems = computed<TemplateMenuItem[]>(() => {
  return props.menuItems.filter(item => item.stickyBottom)
})

function normalizeGroupLabel(item: TemplateMenuItem): string {
  return String(item.groupLabel ?? '').trim()
}

function shouldRenderGroupLabel(items: TemplateMenuItem[], index: number): boolean {
  const currentGroupLabel = normalizeGroupLabel(items[index] as TemplateMenuItem)
  if (!currentGroupLabel) {
    return false
  }

  if (index === 0) {
    return true
  }

  const previousGroupLabel = normalizeGroupLabel(items[index - 1] as TemplateMenuItem)
  return currentGroupLabel !== previousGroupLabel
}

function getCompactGroupLabel(label?: string): string {
  const normalized = String(label ?? '').trim()
  if (!normalized) {
    return '•'
  }

  const compact = normalized
    .split(/\s+/)
    .map(chunk => chunk.charAt(0).toUpperCase())
    .join('')

  return compact.slice(0, 3)
}

function storageKey(suffix: string): string {
  return `${props.storageKeyPrefix}:${suffix}`
}

function readStoredFlag(key: string, fallback = false): boolean {
  if (!props.persistMode) {
    return fallback
  }
  try {
    const storedValue = localStorage.getItem(storageKey(key))
    if (storedValue === null) {
      return fallback
    }
    return storedValue === 'true'
  } catch {
    return fallback
  }
}

function readStoredValue(key: string): string | null {
  if (!props.persistMode) {
    return null
  }
  try {
    return localStorage.getItem(storageKey(key))
  } catch {
    return null
  }
}

function writeStoredFlag(key: string, value: boolean): void {
  if (!props.persistMode) {
    return
  }
  try {
    localStorage.setItem(storageKey(key), String(value))
  } catch {
    // Intentionally ignore persistence failures (private mode, quota, SSR).
  }
}

function writeStoredValue(key: string, value: string): void {
  if (!props.persistMode) {
    return
  }
  try {
    localStorage.setItem(storageKey(key), value)
  } catch {
    // Intentionally ignore persistence failures (private mode, quota, SSR).
  }
}

function normalizeSideMenuVariant(value: string | null | undefined): 'vercel' | 'reference' {
  if (value === 'reference' || value === 'classic') {
    return 'reference'
  }
  return 'vercel'
}

function toggleMiniMode(): void {
  miniMode.value = !miniMode.value
}

function setHorizontalMode(value: boolean): void {
  horizontalMode.value = value
}

function setShowLabelsInMini(value: boolean): void {
  showLabelsInMini.value = value
}

function setSideMenuVariant(value: 'vercel' | 'reference'): void {
  sideMenuVariant.value = value
}

function forwardMenuItemClick(item: TemplateMenuItem | TemplateMenuChildItem): void {
  emit('menu-item-click', item)
}

onMounted(() => {
  horizontalMode.value = readStoredFlag('horizontal-mode', props.defaultHorizontalMode)
  miniMode.value = readStoredFlag('mini-mode', props.defaultMiniMode)
  showLabelsInMini.value = readStoredFlag('mini-labels', props.defaultShowLabelsInMini)
  sideMenuVariant.value = normalizeSideMenuVariant(readStoredValue('side-menu-variant') ?? props.sideMenuVariant)
})

watch(horizontalMode, value => {
  writeStoredFlag('horizontal-mode', value)
})

watch(miniMode, value => {
  writeStoredFlag('mini-mode', value)
})

watch(showLabelsInMini, value => {
  writeStoredFlag('mini-labels', value)
})

watch(sideMenuVariant, value => {
  writeStoredValue('side-menu-variant', value)
})
</script>

<style lang="scss">
.ntk-template-main-layout {
  --ntk-template-layout-shell-bg: var(--ntk-template-shell-bg);
  --ntk-template-layout-page-text: var(--ntk-template-shell-text);
  --ntk-template-layout-header-bg: var(--ntk-template-shell-header-bg);
  --ntk-template-layout-header-text: var(--ntk-template-shell-header-text);
  --ntk-template-layout-header-border: var(--ntk-template-shell-header-border);
  --ntk-template-layout-header-shadow: var(--ntk-template-shell-header-shadow);
  --ntk-template-layout-header-action-text: var(--ntk-template-shell-header-action-text);
  --ntk-template-layout-header-action-hover-bg: var(--ntk-template-shell-header-action-hover-bg);
  --ntk-template-layout-header-action-focus-ring: var(--ntk-template-shell-header-action-focus-ring);
  --ntk-template-layout-header-action-radius: var(--ntk-template-shell-header-action-radius);
  --ntk-template-layout-header-breadcrumb-bg: var(--ntk-template-shell-breadcrumb-bg);
  --ntk-template-layout-header-breadcrumb-border: var(--ntk-template-shell-breadcrumb-border);
  --ntk-template-layout-header-breadcrumb-link: var(--ntk-template-shell-breadcrumb-link);
  --ntk-template-layout-header-breadcrumb-link-hover: var(--ntk-template-shell-breadcrumb-link-hover);
  --ntk-template-layout-header-breadcrumb-current: var(--ntk-template-shell-breadcrumb-current);
  --ntk-template-layout-header-breadcrumb-sep: var(--ntk-template-shell-breadcrumb-sep);
  --ntk-template-layout-header-breadcrumb-hover-bg: var(--ntk-template-shell-breadcrumb-hover-bg);
  --ntk-template-layout-header-breadcrumb-focus-ring: var(--ntk-template-shell-breadcrumb-focus-ring);
  --ntk-template-layout-header-breadcrumb-radius: var(--ntk-template-shell-breadcrumb-radius);
  --ntk-template-layout-nav-start: var(--ntk-template-shell-nav-surface-start);
  --ntk-template-layout-nav-end: var(--ntk-template-shell-nav-surface-end);
  --ntk-template-layout-horizontal-bg: var(--ntk-template-shell-horizontal-bg);
  --ntk-template-layout-horizontal-text: var(--ntk-template-shell-horizontal-text);
  --ntk-template-layout-horizontal-border: var(--ntk-template-shell-horizontal-border);
  --ntk-template-layout-drawer-bg: var(--ntk-template-shell-drawer-bg);
  --ntk-template-layout-drawer-text: var(--ntk-template-shell-drawer-text);
  --ntk-template-layout-drawer-border: var(--ntk-template-shell-drawer-border);
  --ntk-template-layout-drawer-inset: var(--ntk-template-shell-drawer-inset);
  --ntk-template-layout-nav-group-text: var(--ntk-template-shell-nav-group-text);
  --ntk-template-layout-nav-group-pill-bg: var(--ntk-template-shell-nav-group-pill-bg);
  --ntk-template-layout-nav-text: var(--ntk-template-shell-nav-text);
  --ntk-template-layout-nav-active-border: var(--ntk-template-shell-nav-active-border);
  --ntk-template-layout-nav-active-text: var(--ntk-template-shell-nav-active-text);
  --ntk-template-layout-nav-active-bg: var(--ntk-template-shell-nav-active-bg);
  --ntk-template-layout-nav-hover-bg: var(--ntk-template-shell-nav-hover-bg);
  --ntk-template-layout-reference-nav-hover-bg: var(--ntk-template-shell-reference-nav-hover-bg);
  --ntk-template-layout-toolbar-border: var(--ntk-template-shell-toolbar-border);
  --ntk-template-layout-submenu-bg: var(--ntk-template-shell-submenu-bg);
  --ntk-template-layout-submenu-border: var(--ntk-template-shell-submenu-border);
  --ntk-template-layout-submenu-text: var(--ntk-template-shell-submenu-text);
  --ntk-template-layout-submenu-shadow: var(--ntk-template-shell-submenu-shadow);
  --ntk-template-layout-submenu-hover-bg: var(--ntk-template-shell-submenu-hover-bg);
  --ntk-template-layout-submenu-active-border: var(--ntk-template-shell-submenu-active-border);
  --ntk-template-layout-submenu-active-bg: var(--ntk-template-shell-submenu-active-bg);
  --ntk-template-layout-submenu-active-text: var(--ntk-template-shell-submenu-active-text);
  --ntk-template-page-card-bg: var(--ntk-template-layout-surface-bg, var(--ntk-card-bg, var(--ntk-bg-primary)));
  --ntk-shadow-soft: 0 4px 16px color-mix(in srgb, var(--ntk-template-layout-page-text) 8%, transparent);

  background: var(--ntk-template-layout-shell-bg);
  color: var(--ntk-template-layout-page-text);
}

.ntk-template-main-layout__header {
  background: var(--ntk-template-layout-header-bg) !important;
  color: var(--ntk-template-layout-header-text) !important;
  border-bottom: 1px solid var(--ntk-template-layout-header-border);
  box-shadow: var(--ntk-template-layout-header-shadow) !important;
  z-index: 2100 !important;
}

.ntk-template-main-layout__header .q-toolbar {
  min-height: var(--ntk-template-layout-header-height, 56px);
  padding: var(--ntk-template-layout-header-padding, 0 16px 0 12px);
  gap: 12px;
}

.ntk-template-main-layout__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ntk-template-main-layout__logo {
  width: auto;
  height: 24px;
}

.ntk-template-main-layout__title {
  font-family: var(--ntk-template-layout-title-font, var(--ntk-font-family-display, system-ui, sans-serif));
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0;
  color: var(--ntk-template-layout-title-color, inherit);
}

.ntk-template-main-layout__menu-btn {
  width: 48px;
  overflow: hidden;
  opacity: 1;
  transition:
    width 0.25s ease,
    opacity 0.25s ease;
}

.ntk-template-main-layout__menu-btn--hidden {
  width: 0;
  opacity: 0;
}

.ntk-template-main-layout__menu-btn .q-btn {
  background: transparent;
  border: 0;
  color: var(--ntk-template-layout-header-action-text);
  border-radius: var(--ntk-template-layout-header-action-radius);
}

.ntk-template-main-layout__menu-btn .q-btn::before {
  background: var(--ntk-template-layout-header-action-hover-bg);
}

.ntk-template-main-layout__menu-btn .q-btn:hover::before,
.ntk-template-main-layout__menu-btn .q-btn.q-focusable--focused::before,
.ntk-template-main-layout__menu-btn .q-btn.q-hoverable:hover::before {
  opacity: 1 !important;
}

.ntk-template-main-layout__menu-btn .q-btn:focus-visible {
  outline: 2px solid var(--ntk-template-layout-header-action-focus-ring);
  outline-offset: 2px;
}

.ntk-template-main-layout__menu-btn .q-btn__content {
  color: inherit;
}

.ntk-template-main-layout__horizontal-nav {
  min-height: 48px !important;
  background: var(--ntk-template-layout-horizontal-bg);
  color: var(--ntk-template-layout-horizontal-text);
  border-top: 1px solid var(--ntk-template-layout-horizontal-border);
}

.ntk-template-main-layout__horizontal-nav-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.ntk-template-main-layout__drawer {
  background: var(--ntk-template-layout-drawer-bg) !important;
  color: var(--ntk-template-layout-drawer-text) !important;
  border-right: 1px solid var(--ntk-template-layout-drawer-border);
  transition:
    width 0.24s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.24s cubic-bezier(0.4, 0, 0.2, 1);
}

.ntk-template-main-layout__drawer--mini {
  box-shadow: inset -1px 0 0 var(--ntk-template-layout-drawer-inset);
}

.ntk-template-main-layout__drawer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.ntk-template-main-layout__drawer-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.ntk-template-main-layout__group-caption {
  min-height: 26px;
  padding: 8px 14px 4px;
  font-family: var(--ntk-template-layout-group-font, var(--ntk-font-family-mono, ui-monospace, monospace));
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ntk-template-layout-nav-group-text);
}

.ntk-template-main-layout__group-caption-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ntk-template-main-layout__group-caption--mini {
  display: flex;
  justify-content: center;
  padding: 8px 4px 4px;
}

.ntk-template-main-layout__group-caption--mini .ntk-template-main-layout__group-caption-text {
  min-width: 28px;
  height: 18px;
  padding: 0 6px;
  border-radius: 999px;
  background: var(--ntk-template-layout-nav-group-pill-bg);
  font-size: 10px;
}

.ntk-template-main-layout__drawer-bottom {
  flex-shrink: 0;
}

.ntk-template-main-layout__page-container {
  background: var(--ntk-template-layout-page-bg);
}

.ntk-template-main-layout__slide-down-enter-active,
.ntk-template-main-layout__slide-down-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.ntk-template-main-layout__slide-down-enter-from,
.ntk-template-main-layout__slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}

.ntk-template-main-layout__slide-down-enter-to,
.ntk-template-main-layout__slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
  max-height: 64px;
}

.ntk-template-main-layout__route-fade-enter-active,
.ntk-template-main-layout__route-fade-leave-active {
  transition: opacity 0.2s ease;
}

.ntk-template-main-layout__route-fade-enter-from,
.ntk-template-main-layout__route-fade-leave-to {
  opacity: 0;
}

.q-drawer--left.q-drawer--bordered {
  border-right: 1px solid var(--ntk-template-layout-drawer-border);
}

@media (max-width: 768px) {
  .ntk-template-main-layout__horizontal-nav-list {
    display: none;
  }
}
</style>
