<template>
  <q-layout
    view="lHh lpR fFf"
    class="ntk-template-main-layout"
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

        <slot name="header-actions">
          <UserMenuTemplate
            v-model="horizontalMode"
            v-model:show-labels-in-mini="showLabelsInMini"
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
      :width="drawerWidth"
      :mini="miniMode && !showLabelsInMini"
      :mini-width="miniDrawerWidth"
      class="ntk-template-main-layout__drawer"
    >
      <div class="ntk-template-main-layout__drawer-container">
        <div class="ntk-template-main-layout__drawer-scroll">
          <q-list
            class="q-pt-none"
            style="margin-top: 2px"
          >
            <MenuLinkTemplate
              v-for="item in primaryMenuItems"
              :key="item.id"
              :item="item"
              :mini-mode="miniMode"
              :show-labels-in-mini="showLabelsInMini"
            />
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
          />
        </div>
      </div>
    </q-drawer>

    <q-page-container :class="['ntk-template-main-layout__page-container', pageContainerClass]">
      <router-view
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
      </router-view>
      <slot v-else />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import AppBreadcrumbTemplate from '../navigation/AppBreadcrumbTemplate.vue'
import HorizontalMenuLinkTemplate from '../navigation/HorizontalMenuLinkTemplate.vue'
import MenuLinkTemplate from '../navigation/MenuLinkTemplate.vue'
import UserMenuTemplate from '../navigation/UserMenuTemplate.vue'
import type { TemplateMenuItem } from '../navigation/menu-template.types'

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
  drawerWidth?: number
  miniDrawerWidth?: number
  pageContainerClass?: string
  expandMenuAriaLabel?: string
  collapseMenuAriaLabel?: string
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
  drawerWidth: 250,
  miniDrawerWidth: 56,
  pageContainerClass: '',
  expandMenuAriaLabel: 'Expand side menu',
  collapseMenuAriaLabel: 'Collapse side menu',
})

defineEmits<{
  'account-click': []
  'logout-click': []
}>()

const horizontalMode = ref(false)
const miniMode = ref(false)
const showLabelsInMini = ref(false)

const primaryMenuItems = computed<TemplateMenuItem[]>(() => {
  return props.menuItems.filter(item => !item.stickyBottom)
})

const secondaryMenuItems = computed<TemplateMenuItem[]>(() => {
  return props.menuItems.filter(item => item.stickyBottom)
})

function storageKey(suffix: string): string {
  return `${props.storageKeyPrefix}:${suffix}`
}

function readStoredFlag(key: string): boolean {
  if (!props.persistMode) {
    return false
  }
  try {
    return localStorage.getItem(storageKey(key)) === 'true'
  } catch {
    return false
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

function toggleMiniMode(): void {
  miniMode.value = !miniMode.value
}

onMounted(() => {
  horizontalMode.value = readStoredFlag('horizontal-mode')
  miniMode.value = readStoredFlag('mini-mode')
  showLabelsInMini.value = readStoredFlag('mini-labels')
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
</script>

<style lang="scss">
.ntk-template-main-layout__header {
  background: var(--ntk-template-layout-header-bg, #ffffff);
  color: var(--ntk-template-layout-header-text, #1f2937);
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
  font-size: 14px;
  font-weight: 600;
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

.ntk-template-main-layout__horizontal-nav {
  min-height: 48px !important;
  background: var(
    --ntk-template-layout-horizontal-bg,
    linear-gradient(90deg, #1f2937 0%, #334155 100%)
  );
  color: var(--ntk-template-layout-horizontal-text, #ffffff);
}

.ntk-template-main-layout__horizontal-nav-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.ntk-template-main-layout__drawer {
  background: var(
    --ntk-template-layout-drawer-bg,
    linear-gradient(180deg, #1f2937 0%, #334155 100%)
  ) !important;
  color: var(--ntk-template-layout-drawer-text, #ffffff) !important;
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

.ntk-template-main-layout__drawer-bottom {
  flex-shrink: 0;
}

.ntk-template-main-layout__page-container {
  background: var(--ntk-template-layout-page-bg, #f8fafc);
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

@media (max-width: 768px) {
  .ntk-template-main-layout__horizontal-nav-list {
    display: none;
  }
}
</style>