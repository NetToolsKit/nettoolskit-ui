<template>
  <q-layout
    view="hHh Lpr fFf"
    :class="[
      'ntk-app-shell',
      { 'ntk-app-shell--compact': isCompactViewport },
    ]"
    :style="shellStyle"
  >
    <q-drawer
      v-model="drawerOpen"
      show-if-above
      :width="drawerWidth"
      :mini-width="miniWidth"
      :mini="isMiniMode"
      :breakpoint="breakpoint"
      bordered
      role="navigation"
      :aria-label="navigationAriaLabel"
      class="ntk-app-shell__drawer"
    >
      <q-scroll-area class="fit">
        <div class="ntk-app-shell__drawer-header">
          <slot name="drawer-header">
            <div class="ntk-app-shell__brand">
              <q-avatar
                square
                class="ntk-app-shell__brand-logo"
              >
                <img
                  :src="brandLogo"
                  :alt="brandLogoAlt"
                >
              </q-avatar>
              <div
                v-if="!isMiniMode"
                class="ntk-app-shell__brand-text"
              >
                <strong>{{ appName }}</strong>
                <small>{{ appSubtitle }}</small>
              </div>
            </div>
          </slot>
        </div>

        <q-list
          padding
          class="ntk-app-shell__drawer-list"
          :aria-label="navigationItemsAriaLabel"
        >
          <template
            v-for="group in resolvedGroups"
            :key="group.id"
          >
            <div
              v-if="showGroupCaptions"
              :id="groupLabelId(group.id)"
              class="ntk-app-shell__group-caption"
              :class="{ 'ntk-app-shell__group-caption--mini': isMiniMode }"
            >
              <span class="ntk-app-shell__group-caption-text">
                {{ isMiniMode ? getCompactGroupLabel(group.label) : group.label }}
              </span>
              <q-tooltip
                v-if="isMiniMode"
                anchor="center right"
                self="center left"
                :offset="[10, 0]"
              >
                {{ group.label }}
              </q-tooltip>
            </div>

            <q-item
              v-for="item in groupedItems[group.id]"
              :key="item.id"
              clickable
              :active="activeItemId === item.id"
              active-class="ntk-app-shell__item--active"
              class="ntk-app-shell__item"
              :aria-label="resolveItemAriaLabel(item)"
              :aria-current="activeItemId === item.id ? 'page' : undefined"
              :aria-describedby="showGroupCaptions ? groupLabelId(group.id) : undefined"
              tabindex="0"
              @click="selectItem(item)"
              @keyup.enter.prevent="selectItem(item)"
              @keyup.space.prevent="selectItem(item)"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" />
              </q-item-section>

              <q-item-section v-if="!isMiniMode">
                <q-item-label>{{ item.label }}</q-item-label>
                <q-item-label
                  v-if="item.caption"
                  caption
                >
                  {{ item.caption }}
                </q-item-label>
              </q-item-section>

              <q-item-section
                v-if="!isMiniMode && item.badge"
                side
              >
                <q-badge
                  :style="getItemBadgeStyle(item)"
                  :label="item.badge"
                />
              </q-item-section>

              <q-tooltip
                v-else-if="isMiniMode"
                anchor="center right"
                self="center left"
                :offset="[10, 0]"
              >
                {{ item.label }}
              </q-tooltip>
            </q-item>

            <q-separator
              v-if="hasVisibleItemsAfter(group.id)"
              class="ntk-app-shell__group-separator q-my-sm"
            />
          </template>
        </q-list>

        <div
          v-if="collapsible"
          class="ntk-app-shell__drawer-footer"
        >
          <q-item
            clickable
            role="button"
            class="ntk-app-shell__item ntk-app-shell__item--toggle"
            :aria-label="isMiniMode ? expandLabel : collapseLabel"
            :aria-expanded="String(!isMiniMode)"
            tabindex="0"
            @click="toggleMenuMode"
            @keyup.enter.prevent="toggleMenuMode"
            @keyup.space.prevent="toggleMenuMode"
          >
            <q-item-section avatar>
              <q-icon :name="isMiniMode ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'" />
            </q-item-section>
            <q-item-section v-if="!isMiniMode">
              <q-item-label>{{ isMiniMode ? expandLabel : collapseLabel }}</q-item-label>
            </q-item-section>
            <q-tooltip
              v-else
              anchor="center right"
              self="center left"
              :offset="[10, 0]"
            >
              {{ expandLabel }}
            </q-tooltip>
          </q-item>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-header
      elevated
      class="ntk-app-shell__header"
      :height-hint="headerHeight"
    >
      <q-toolbar
        class="ntk-app-shell__toolbar"
        :style="{ height: `${headerHeight}px` }"
      >
        <div class="ntk-app-shell__menu-slot">
          <q-btn
            flat
            dense
            round
            :icon="menuIcon"
            :aria-label="menuAriaLabel"
            :aria-expanded="String(drawerOpen)"
            @click="toggleMenuMode"
          >
            <q-tooltip>{{ isMiniMode ? expandLabel : collapseLabel }}</q-tooltip>
          </q-btn>
        </div>

        <q-toolbar-title class="ntk-app-shell__title">
          <slot
            name="title"
            :active-item="activeItem"
          >
            <span class="ntk-app-shell__title-app">{{ appName }}</span>
            <q-icon
              name="chevron_right"
              class="ntk-app-shell__title-separator"
            />
            <span>{{ activeItem.label }}</span>
          </slot>
        </q-toolbar-title>

        <q-space />

        <div
          v-if="showSearch && !isCompactViewport"
          class="ntk-app-shell__search-wrapper"
        >
          <q-input
            :model-value="searchModel"
            dense
            borderless
            :placeholder="searchPlaceholder"
            :aria-label="searchAriaLabel"
            class="ntk-app-shell__search"
            @update:model-value="updateSearch"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div
          class="ntk-app-shell__actions"
          role="toolbar"
          :aria-label="toolbarAriaLabel"
        >
          <slot name="actions">
            <template v-if="toolbarActions.length > 0">
              <q-btn
                v-for="action in toolbarActions"
                :key="action.id"
                :flat="action.flat ?? true"
                :dense="action.dense ?? true"
                :round="action.round ?? false"
                :unelevated="action.unelevated ?? false"
                :outline="action.outline ?? false"
                :no-caps="action.noCaps ?? false"
                :icon="action.icon"
                :label="action.showLabel ? action.label : undefined"
                :color="resolveToolbarActionColor(action)"
                :text-color="resolveToolbarActionTextColor(action)"
                :aria-label="resolveToolbarActionAriaLabel(action)"
                :href="resolveToolbarActionHref(action)"
                :target="resolveToolbarActionTarget(action)"
                :rel="resolveToolbarActionRel(action)"
                :style="getToolbarActionInteractiveStyle(action)"
                :class="['ntk-app-shell__toolbar-action-btn', action.className]"
                @mouseenter="setToolbarActionHover(`action:${action.id}`, true)"
                @mouseleave="setToolbarActionHover(`action:${action.id}`, false)"
                @focus="setToolbarActionHover(`action:${action.id}`, true)"
                @blur="setToolbarActionHover(`action:${action.id}`, false)"
                @click="handleToolbarAction(action)"
              >
                <q-badge
                  v-if="action.badge !== undefined"
                  :style="getActionBadgeStyle(action)"
                  floating
                >
                  {{ action.badge }}
                </q-badge>
                <q-tooltip v-if="action.tooltip">
                  {{ action.tooltip }}
                </q-tooltip>
              </q-btn>
            </template>

            <template v-else>
              <q-btn
                v-if="showNotifications"
                flat
                round
                dense
                icon="notifications"
                :aria-label="notificationsAriaLabel"
                :style="getDefaultHeaderActionStyle('default-notifications', notificationActionStyle)"
                class="ntk-app-shell__toolbar-action-btn"
                @mouseenter="setToolbarActionHover('default-notifications', true)"
                @mouseleave="setToolbarActionHover('default-notifications', false)"
                @focus="setToolbarActionHover('default-notifications', true)"
                @blur="setToolbarActionHover('default-notifications', false)"
                @click="$emit('notifications-click')"
              >
                <q-badge
                  v-if="notificationCount > 0"
                  floating
                  :style="notificationBadgeStyle"
                >
                  {{ notificationCount }}
                </q-badge>
                <q-tooltip>{{ notificationsTooltip }}</q-tooltip>
              </q-btn>

              <q-btn
                v-if="showUserAvatar"
                flat
                round
                dense
                :aria-label="userAriaLabel"
                :style="getDefaultHeaderActionStyle('default-account')"
                class="ntk-app-shell__toolbar-action-btn"
                @mouseenter="setToolbarActionHover('default-account', true)"
                @mouseleave="setToolbarActionHover('default-account', false)"
                @focus="setToolbarActionHover('default-account', true)"
                @blur="setToolbarActionHover('default-account', false)"
                @click="$emit('user-click')"
              >
                <q-avatar class="ntk-app-shell__user-avatar">
                  <img
                    v-if="userAvatar"
                    :src="userAvatar"
                    alt="User avatar"
                  >
                  <q-icon
                    v-else
                    name="account_circle"
                    class="ntk-app-shell__user-avatar-icon"
                  />
                </q-avatar>
                <q-tooltip>{{ userTooltip }}</q-tooltip>
              </q-btn>
            </template>
          </slot>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container class="ntk-app-shell__page-container">
      <q-page class="ntk-app-shell__page">
        <div class="ntk-app-shell__workspace">
          <div class="ntk-app-shell__workspace-card">
            <slot
              :active-item="activeItem"
              :active-item-id="activeItemId"
              :is-mini-mode="isMiniMode"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
/**
 * Src/components/layout/Ntk App Shell module.
 */

import { computed, ref, watch, type PropType } from 'vue'
import { useQuasar } from 'quasar'
import type {
  AppShellAction,
  AppShellGroup,
  AppShellItem,
  AppShellTheme,
  AppShellTelemetryEvent,
} from './app-shell.types'
import { APP_SHELL_DEFAULTS, APP_SHELL_DEFAULT_THEME } from './app-shell.config'
import { resolveAppShellTheme, sanitizeShellLink } from './app-shell.theme'

const props = defineProps({
  appName: {
    type: String,
    default: APP_SHELL_DEFAULTS.appName,
  },
  appSubtitle: {
    type: String,
    default: APP_SHELL_DEFAULTS.appSubtitle,
  },
  brandLogo: {
    type: String,
    default: APP_SHELL_DEFAULTS.brandLogo,
  },
  brandLogoAlt: {
    type: String,
    default: APP_SHELL_DEFAULTS.brandLogoAlt,
  },
  menuIcon: {
    type: String,
    default: APP_SHELL_DEFAULTS.menuIcon,
  },
  menuAriaLabel: {
    type: String,
    default: APP_SHELL_DEFAULTS.menuAriaLabel,
  },
  navGroups: {
    type: Array as PropType<AppShellGroup[]>,
    default: () => [...APP_SHELL_DEFAULTS.navGroups],
  },
  items: {
    type: Array as PropType<AppShellItem[]>,
    default: () => [...APP_SHELL_DEFAULTS.items],
  },
  activeItem: {
    type: String,
    default: APP_SHELL_DEFAULTS.activeItem,
  },
  searchValue: {
    type: String,
    default: APP_SHELL_DEFAULTS.searchValue,
  },
  searchPlaceholder: {
    type: String,
    default: APP_SHELL_DEFAULTS.searchPlaceholder,
  },
  showSearch: {
    type: Boolean,
    default: APP_SHELL_DEFAULTS.showSearch,
  },
  showGroupCaptions: {
    type: Boolean,
    default: APP_SHELL_DEFAULTS.showGroupCaptions,
  },
  toolbarActions: {
    type: Array as PropType<AppShellAction[]>,
    default: () => [...APP_SHELL_DEFAULTS.toolbarActions],
  },
  theme: {
    type: Object as PropType<AppShellTheme>,
    default: () => ({ ...(APP_SHELL_DEFAULTS.theme ?? {}) }),
  },
  showNotifications: {
    type: Boolean,
    default: APP_SHELL_DEFAULTS.showNotifications,
  },
  notificationsTooltip: {
    type: String,
    default: APP_SHELL_DEFAULTS.notificationsTooltip,
  },
  notificationCount: {
    type: Number,
    default: APP_SHELL_DEFAULTS.notificationCount,
  },
  showUserAvatar: {
    type: Boolean,
    default: APP_SHELL_DEFAULTS.showUserAvatar,
  },
  userAvatar: {
    type: String,
    default: APP_SHELL_DEFAULTS.userAvatar,
  },
  userTooltip: {
    type: String,
    default: APP_SHELL_DEFAULTS.userTooltip,
  },
  collapsible: {
    type: Boolean,
    default: APP_SHELL_DEFAULTS.collapsible,
  },
  collapseLabel: {
    type: String,
    default: APP_SHELL_DEFAULTS.collapseLabel,
  },
  expandLabel: {
    type: String,
    default: APP_SHELL_DEFAULTS.expandLabel,
  },
  drawerWidth: {
    type: Number,
    default: APP_SHELL_DEFAULTS.drawerWidth,
  },
  miniWidth: {
    type: Number,
    default: APP_SHELL_DEFAULTS.miniWidth,
  },
  breakpoint: {
    type: Number,
    default: APP_SHELL_DEFAULTS.breakpoint,
  },
  headerHeight: {
    type: Number,
    default: APP_SHELL_DEFAULTS.headerHeight,
  },
  defaultDrawerOpen: {
    type: Boolean,
    default: APP_SHELL_DEFAULTS.defaultDrawerOpen,
  },
  defaultMini: {
    type: Boolean,
    default: APP_SHELL_DEFAULTS.defaultMini,
  },
  searchAriaLabel: {
    type: String,
    default: 'Search modules',
  },
  navigationAriaLabel: {
    type: String,
    default: 'Primary navigation',
  },
  navigationItemsAriaLabel: {
    type: String,
    default: 'Module list',
  },
  toolbarAriaLabel: {
    type: String,
    default: 'Header actions',
  },
  notificationsAriaLabel: {
    type: String,
    default: APP_SHELL_DEFAULTS.notificationsTooltip,
  },
  userAriaLabel: {
    type: String,
    default: APP_SHELL_DEFAULTS.userTooltip,
  },
  itemAriaLabelPrefix: {
    type: String,
    default: 'Open module',
  },
  actionAriaLabelPrefix: {
    type: String,
    default: 'Action',
  },
})

const emit = defineEmits({
  'update:active-item': (_value: string) => true,
  'update:search-value': (_value: string) => true,
  'item-click': (_value: AppShellItem) => true,
  'notifications-click': () => true,
  'user-click': () => true,
  'toolbar-action': (_value: AppShellAction) => true,
  'toggle-menu': (_value: { mini: boolean; open: boolean }) => true,
  'telemetry': (_value: AppShellTelemetryEvent) => true,
})

const $q = useQuasar()

const drawerOpen = ref($q.screen.gt.sm ? props.defaultDrawerOpen : false)
const miniState = ref(props.defaultMini)
const localSearchValue = ref(props.searchValue)
const localActiveItem = ref(props.activeItem || props.items[0]?.id || '')

watch(
  () => props.activeItem,
  value => {
    if (value && value !== localActiveItem.value) {
      localActiveItem.value = value
    }
  }
)

watch(
  () => props.searchValue,
  value => {
    if (value !== localSearchValue.value) {
      localSearchValue.value = value
    }
  }
)

const resolvedGroups = computed<AppShellGroup[]>(() => {
  if (props.navGroups.length > 0) {
    return props.navGroups
  }

  const dynamicGroups = new Map<string, AppShellGroup>()
  for (const item of props.items) {
    if (!dynamicGroups.has(item.group)) {
      dynamicGroups.set(item.group, {
        id: item.group,
        label: item.group,
      })
    }
  }

  return Array.from(dynamicGroups.values())
})

const groupedItems = computed<Record<string, AppShellItem[]>>(() => {
  const grouped: Record<string, AppShellItem[]> = {}
  for (const group of resolvedGroups.value) {
    grouped[group.id] = []
  }

  for (const item of props.items) {
    if (!grouped[item.group]) {
      grouped[item.group] = []
    }
    grouped[item.group].push(item)
  }

  return grouped
})

const activeItemId = computed(() => localActiveItem.value || props.items[0]?.id || '')

const activeItem = computed<AppShellItem>(() => {
  return props.items.find(item => item.id === activeItemId.value) ?? {
    id: '',
    group: '',
    label: 'No module selected',
    icon: 'dashboard',
    caption: '',
    description: '',
  }
})

const resolvedTheme = computed<AppShellTheme>(() => resolveAppShellTheme(props.theme ?? {}, APP_SHELL_DEFAULT_THEME))
const defaultCompactBreakpointPx = parseBreakpointToken(APP_SHELL_DEFAULT_THEME.compactBreakpoint, 500)
const defaultCmsLayoutBreakpointLgPx = parseBreakpointToken(APP_SHELL_DEFAULT_THEME.cmsLayoutBreakpointLg, 1280)

/**
 * Parses breakpoint token values (e.g. "500" or "500px") into pixels.
 */
function parseBreakpointToken(value: string | undefined, fallback: number): number {
  const parsed = Number.parseFloat(String(value ?? '').replace(/[^0-9.]/g, ''))
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed
  }
  return fallback
}

/**
 * Resolves viewport width with deterministic fallback for tests/SSR.
 */
function resolveViewportWidth(fallback: number): number {
  if (typeof $q.screen.width === 'number' && Number.isFinite($q.screen.width)) {
    return $q.screen.width
  }
  if (typeof window !== 'undefined' && typeof window.innerWidth === 'number' && Number.isFinite(window.innerWidth)) {
    return window.innerWidth
  }
  return fallback
}

const compactBreakpointPx = computed(() => parseBreakpointToken(resolvedTheme.value.compactBreakpoint, defaultCompactBreakpointPx))
const cmsLayoutBreakpointLgPx = computed(() => parseBreakpointToken(resolvedTheme.value.cmsLayoutBreakpointLg, defaultCmsLayoutBreakpointLgPx))
const viewportWidthPx = computed(() => resolveViewportWidth(cmsLayoutBreakpointLgPx.value + 1))
const isCompactViewport = computed(() => viewportWidthPx.value <= compactBreakpointPx.value)
const isMiniMode = computed(() => miniState.value && $q.screen.gt.sm)
const searchModel = computed(() => localSearchValue.value)
const notificationDefaultColor = computed(() => {
  return resolvedTheme.value.notificationBadgeColor || resolvedTheme.value.notificationErrorColor || ''
})
const notificationDefaultTextColor = computed(() => {
  const explicitBadgeText = typeof props.theme?.notificationBadgeTextColor === 'string'
    && props.theme.notificationBadgeTextColor.trim().length > 0

  if (explicitBadgeText) {
    return resolvedTheme.value.notificationBadgeTextColor || ''
  }

  return (
    resolvedTheme.value.notificationErrorTextColor ||
    resolvedTheme.value.notificationBadgeTextColor ||
    ''
  )
})
const notificationFallbackTextColor = computed(() => {
  return (
    resolvedTheme.value.notificationErrorTextColor ||
    resolvedTheme.value.notificationBadgeTextColor ||
    ''
  )
})
const notificationIconColor = computed(() => {
  return resolvedTheme.value.notificationIconColor || resolvedTheme.value.toolbarButtonColor || ''
})

const notificationBadgeStyle = computed(() => ({
  backgroundColor: 'var(--ntk-shell-notification-badge-bg)',
  color: 'var(--ntk-shell-notification-badge-text)',
}))

const notificationActionStyle = computed<Record<string, string>>(() => ({
  color: notificationIconColor.value,
}))

const hoveredToolbarActionKey = ref<string | null>(null)

const shellStyle = computed<Record<string, string>>(() => {
  const theme = resolvedTheme.value

  return {
    '--ntk-shell-bg': theme.shellBackground ?? '',
    '--ntk-shell-header-bg': theme.headerBackground ?? '',
    '--ntk-shell-header-text': theme.headerTextColor ?? '',
    '--ntk-shell-header-shadow': theme.headerShadow ?? '',
    '--ntk-shell-toolbar-btn-color': theme.toolbarButtonColor ?? '',
    '--ntk-shell-title-app': theme.titleAppColor ?? '',
    '--ntk-shell-title-text': theme.titleTextColor ?? '',
    '--ntk-shell-title-separator': theme.titleSeparatorColor ?? '',
    '--ntk-shell-drawer-bg': theme.drawerBackground ?? '',
    '--ntk-shell-drawer-text': theme.drawerTextColor ?? '',
    '--ntk-shell-drawer-shadow': theme.drawerShadow ?? '',
    '--ntk-shell-drawer-footer-bg': theme.drawerFooterBackground ?? '',
    '--ntk-shell-divider': theme.dividerColor ?? '',
    '--ntk-shell-search-bg': theme.searchBackground ?? '',
    '--ntk-shell-search-text': theme.searchTextColor ?? '',
    '--ntk-shell-search-icon': theme.searchIconColor ?? '',
    '--ntk-shell-search-border': theme.searchBorder ?? '',
    '--ntk-shell-search-border-hover': theme.searchBorderHover ?? '',
    '--ntk-shell-focus-color': theme.focusColor ?? theme.itemActiveColor ?? '',
    '--ntk-shell-action-bg': theme.actionBackground ?? '',
    '--ntk-shell-action-hover': theme.actionHoverBackground ?? '',
    '--ntk-shell-notification-badge-bg': notificationDefaultColor.value,
    '--ntk-shell-notification-badge-text': notificationDefaultTextColor.value,
    '--ntk-shell-brand-title': theme.brandTitleColor ?? '',
    '--ntk-shell-brand-subtitle': theme.brandSubtitleColor ?? '',
    '--ntk-shell-group-caption': theme.groupCaptionColor ?? '',
    '--ntk-shell-group-caption-mini-bg': theme.groupCaptionMiniBackground ?? '',
    '--ntk-shell-item-text': theme.itemTextColor ?? '',
    '--ntk-shell-item-hover': theme.itemHoverBackground ?? '',
    '--ntk-shell-item-hover-color': theme.itemHoverColor ?? '',
    '--ntk-shell-item-icon': theme.itemIconColor ?? '',
    '--ntk-shell-item-icon-hover': theme.itemIconHoverColor ?? '',
    '--ntk-shell-item-active-bg': theme.itemActiveBackground ?? '',
    '--ntk-shell-item-active-color': theme.itemActiveColor ?? '',
    '--ntk-shell-footer-shadow': theme.drawerFooterShadow ?? '',
    '--ntk-shell-page-bg': theme.pageBackground ?? '',
    '--ntk-shell-page-text': theme.pageTextColor ?? '',
    '--ntk-shell-font-family': theme.fontFamily ?? '',
    '--ntk-shell-font-display': theme.fontFamilyDisplay ?? '',
    '--ntk-shell-font-style-base': theme.fontStyleBase ?? '',
    '--ntk-shell-font-weight-regular': theme.fontWeightRegular ?? '',
    '--ntk-shell-font-weight-medium': theme.fontWeightMedium ?? '',
    '--ntk-shell-font-weight-semibold': theme.fontWeightSemibold ?? '',
    '--ntk-shell-font-weight-bold': theme.fontWeightBold ?? '',
    '--ntk-shell-font-size-base': theme.fontSizeBase ?? '',
    '--ntk-shell-font-size-title': theme.fontSizeTitle ?? '',
    '--ntk-shell-font-size-title-app': theme.fontSizeTitleApp ?? '',
    '--ntk-shell-font-size-brand-title': theme.fontSizeBrandTitle ?? '',
    '--ntk-shell-font-size-brand-subtitle': theme.fontSizeBrandSubtitle ?? '',
    '--ntk-shell-font-size-item-label': theme.fontSizeItemLabel ?? '',
    '--ntk-shell-font-size-item-caption': theme.fontSizeItemCaption ?? '',
    '--ntk-shell-font-size-group-caption': theme.fontSizeGroupCaption ?? '',
    '--ntk-shell-font-size-group-caption-mini': theme.fontSizeGroupCaptionMini ?? '',
    '--ntk-shell-letter-spacing-group-caption': theme.letterSpacingGroupCaption ?? '',
    '--ntk-shell-letter-spacing-group-caption-mini': theme.letterSpacingGroupCaptionMini ?? '',
    '--ntk-shell-line-height-brand-text': theme.lineHeightBrandText ?? '',
    '--ntk-shell-line-height-item-label': theme.lineHeightItemLabel ?? '',
    '--ntk-shell-line-height-item-caption': theme.lineHeightItemCaption ?? '',
    '--ntk-shell-border-width': theme.borderWidth ?? '',
    '--ntk-shell-menu-slot-width': theme.menuSlotWidth ?? '',
    '--ntk-shell-search-width': theme.searchWidth ?? '',
    '--ntk-shell-search-control-height': theme.searchControlHeight ?? '',
    '--ntk-shell-search-prepend-padding-right': theme.searchPrependPaddingRight ?? '',
    '--ntk-shell-drawer-header-min-height': theme.drawerHeaderMinHeight ?? '',
    '--ntk-shell-brand-logo-size': theme.brandLogoSize ?? '',
    '--ntk-shell-group-caption-min-height': theme.groupCaptionMinHeight ?? '',
    '--ntk-shell-group-caption-padding': theme.groupCaptionPadding ?? '',
    '--ntk-shell-group-caption-mini-padding': theme.groupCaptionMiniPadding ?? '',
    '--ntk-shell-group-caption-mini-min-width': theme.groupCaptionMiniMinWidth ?? '',
    '--ntk-shell-group-caption-mini-height': theme.groupCaptionMiniHeight ?? '',
    '--ntk-shell-group-caption-mini-horizontal-padding': theme.groupCaptionMiniHorizontalPadding ?? '',
    '--ntk-shell-group-caption-mini-radius': theme.groupCaptionMiniRadius ?? '',
    '--ntk-shell-item-min-height': theme.itemMinHeight ?? '',
    '--ntk-shell-item-icon-size': theme.itemIconSize ?? '',
    '--ntk-shell-item-hover-translate-x': theme.itemHoverTranslateX ?? '',
    '--ntk-shell-item-active-border-width': theme.itemActiveBorderWidth ?? '',
    '--ntk-shell-drawer-scroll-padding-bottom': theme.drawerScrollPaddingBottom ?? '',
    '--ntk-shell-workspace-max-width': theme.workspaceMaxWidth ?? '',
    '--ntk-shell-viewport-height': theme.viewportHeight ?? '',
    '--ntk-shell-compact-breakpoint': `${compactBreakpointPx.value}px`,
    '--ntk-shell-compact-page-padding': theme.compactPagePadding ?? '',
    '--ntk-shell-compact-workspace-card-padding': theme.compactWorkspaceCardPadding ?? '',
    '--ntk-shell-cms-layout-breakpoint-lg': theme.cmsLayoutBreakpointLg ?? '',
    '--ntk-shell-cms-layout-breakpoint-md': theme.cmsLayoutBreakpointMd ?? '',
    '--ntk-shell-mini-item-margin-right': theme.miniItemMarginRight ?? '',
    '--ntk-shell-mini-item-avatar-min-width': theme.miniItemAvatarMinWidth ?? '',
    '--ntk-shell-radius-sm': theme.radiusSm ?? '',
    '--ntk-shell-radius-md': theme.radiusMd ?? '',
    '--ntk-shell-radius-lg': theme.radiusLg ?? '',
    '--ntk-shell-radius-item': theme.radiusItem ?? '',
    '--ntk-shell-space-xs': theme.spacingXs ?? '',
    '--ntk-shell-space-sm': theme.spacingSm ?? '',
    '--ntk-shell-space-md': theme.spacingMd ?? '',
    '--ntk-shell-space-lg': theme.spacingLg ?? '',
    '--ntk-shell-transition-fast': theme.transitionFast ?? '',
    '--ntk-shell-title-separator-size': theme.titleSeparatorSize ?? '',
    '--ntk-shell-user-avatar-size': theme.userAvatarSize ?? '',
    '--ntk-shell-header-blur': theme.headerBlur ?? '',
    '--ntk-shell-action-hover-translate-y': theme.actionHoverTranslateY ?? '',
    '--ntk-shell-item-caption-offset': theme.itemCaptionOffset ?? '',
    '--ntk-shell-header-z-index': theme.headerZIndex ?? '',
    '--ntk-shell-drawer-z-index': theme.drawerZIndex ?? '',
    '--ntk-shell-group-separator-opacity': theme.groupSeparatorOpacity ?? '',
    '--ntk-shell-badge-pulse-scale': theme.badgePulseScale ?? '',
    '--ntk-shell-header-height': `${props.headerHeight}px`,
  }
})

/**
 * Resolves notification type color.
 */
function resolveNotificationTypeColor(color?: string): string {
  const value = (color ?? '').trim().toLowerCase()
  if (value === 'success') {
    return resolvedTheme.value.notificationSuccessColor ?? ''
  }
  if (value === 'warning') {
    return resolvedTheme.value.notificationWarningColor ?? ''
  }
  if (value === 'error') {
    return resolvedTheme.value.notificationErrorColor ?? ''
  }
  if (value === 'info') {
    return resolvedTheme.value.notificationInfoColor ?? ''
  }
  return color ?? ''
}

/**
 * Resolves notification type text color.
 */
function resolveNotificationTypeTextColor(color?: string): string {
  const value = (color ?? '').trim().toLowerCase()
  if (value === 'success') {
    return resolvedTheme.value.notificationSuccessTextColor ?? resolvedTheme.value.notificationBadgeTextColor ?? ''
  }
  if (value === 'warning') {
    return resolvedTheme.value.notificationWarningTextColor ?? resolvedTheme.value.notificationBadgeTextColor ?? ''
  }
  if (value === 'error') {
    return resolvedTheme.value.notificationErrorTextColor ?? resolvedTheme.value.notificationBadgeTextColor ?? ''
  }
  if (value === 'info') {
    return resolvedTheme.value.notificationInfoTextColor ?? resolvedTheme.value.notificationBadgeTextColor ?? ''
  }
  return ''
}

/**
 * Normalizes optional token.
 */
function normalizeOptionalToken(value?: string): string | undefined {
  const normalized = String(value ?? '').trim()
  return normalized.length > 0 ? normalized : undefined
}

/**
 * Checks whether is css color expression.
 */
function isCssColorExpression(value: string): boolean {
  return /^(#|var\(|rgb\(|rgba\(|hsl\(|hsla\(|oklch\(|oklab\(|color\(|color-mix\()/i.test(value)
}

/**
 * Checks whether is system toolbar action.
 */
function isSystemToolbarAction(action: AppShellAction): boolean {
  const actionId = String(action.id ?? '').trim().toLowerCase()
  return actionId === 'notifications' || actionId === 'account' || actionId === 'go-landing'
}

/**
 * Resolves toolbar action color.
 */
function resolveToolbarActionColor(action: AppShellAction): string | undefined {
  const color = normalizeOptionalToken(action.color)
  if (!color || isCssColorExpression(color)) {
    return undefined
  }
  if (isSystemToolbarAction(action)) {
    return undefined
  }
  return color
}

/**
 * Resolves toolbar action text color.
 */
function resolveToolbarActionTextColor(action: AppShellAction): string | undefined {
  const textColor = normalizeOptionalToken(action.textColor)
  if (!textColor || isCssColorExpression(textColor)) {
    return undefined
  }
  if (isSystemToolbarAction(action)) {
    return undefined
  }
  return textColor
}

/**
 * Resolves toolbar action style color.
 */
function resolveToolbarActionStyleColor(action: AppShellAction): string | undefined {
  const textColor = normalizeOptionalToken(action.textColor)
  if (textColor && isCssColorExpression(textColor)) {
    return textColor
  }

  const color = normalizeOptionalToken(action.color)
  if (color && isCssColorExpression(color)) {
    return color
  }

  return undefined
}

// Detects whether an action should follow the notification semantic styling.
/**
 * Checks whether is notification toolbar action.
 */
function isNotificationToolbarAction(action: AppShellAction): boolean {
  const actionId = String(action.id ?? '').trim().toLowerCase()
  const actionIcon = String(action.icon ?? '').trim().toLowerCase()
  return actionId === 'notifications' || actionIcon === 'notifications'
}

// Applies notification icon color to bell actions while preserving explicit action color overrides.
/**
 * Handles get toolbar action style.
 */
function getToolbarActionStyle(action: AppShellAction): Record<string, string> {
  const explicitStyleColor = resolveToolbarActionStyleColor(action)
  if (explicitStyleColor) {
    return {
      color: explicitStyleColor,
    }
  }

  if (resolveToolbarActionColor(action) || resolveToolbarActionTextColor(action)) {
    return {}
  }

  if (isNotificationToolbarAction(action)) {
    return {
      color: notificationIconColor.value,
    }
  }

  return {}
}

/**
 * Handles set toolbar action hover.
 */
function setToolbarActionHover(actionKey: string, active: boolean): void {
  if (active) {
    hoveredToolbarActionKey.value = actionKey
    return
  }

  if (hoveredToolbarActionKey.value === actionKey) {
    hoveredToolbarActionKey.value = null
  }
}

/**
 * Handles merge toolbar action interactive style.
 *
 * Hover/focus/active visual feedback is handled entirely by CSS pseudo-class
 * rules (.ntk-app-shell__toolbar-action-btn:hover, :focus-visible, :active)
 * using the --ntk-shell-action-hover CSS custom property.
 * No inline style overrides are applied — they previously shadowed the CSS
 * and prevented the CMS actionHoverBackground token from reflecting visually.
 */
function mergeToolbarActionInteractiveStyle(
  _actionKey: string,
  baseStyle: Record<string, string> = {}
): Record<string, string> {
  return baseStyle
}

/**
 * Handles get toolbar action interactive style.
 */
function getToolbarActionInteractiveStyle(action: AppShellAction): Record<string, string> {
  const baseStyle = getToolbarActionStyle(action)
  return mergeToolbarActionInteractiveStyle(`action:${action.id}`, baseStyle)
}

/**
 * Handles get default header action style.
 */
function getDefaultHeaderActionStyle(
  actionKey: string,
  baseStyle: Record<string, string> = {}
): Record<string, string> {
  return mergeToolbarActionInteractiveStyle(actionKey, baseStyle)
}

/**
 * Handles get item badge style.
 */
function getItemBadgeStyle(item: AppShellItem): Record<string, string> {
  const explicitBadgeColor = normalizeOptionalToken(item.badgeColor)
  const explicitBadgeTextColor = normalizeOptionalToken(item.badgeTextColor)
  const semanticColor = resolveNotificationTypeColor(explicitBadgeColor)
  const semanticTextColor = resolveNotificationTypeTextColor(explicitBadgeColor)
  return {
    backgroundColor: semanticColor || explicitBadgeColor || resolvedTheme.value.itemActiveColor || '',
    color: explicitBadgeTextColor || semanticTextColor || resolvedTheme.value.notificationBadgeTextColor || '',
  }
}

/**
 * Handles get action badge style.
 */
function getActionBadgeStyle(action: AppShellAction): Record<string, string> {
  const explicitBadgeColor = normalizeOptionalToken(action.badgeColor)
  const explicitBadgeTextColor = normalizeOptionalToken(action.badgeTextColor)
  const semanticColor = resolveNotificationTypeColor(explicitBadgeColor)
  const semanticTextColor = resolveNotificationTypeTextColor(explicitBadgeColor)
  const fallbackTextColor = semanticTextColor
    || (isNotificationToolbarAction(action) ? notificationDefaultTextColor.value : notificationFallbackTextColor.value)

  return {
    backgroundColor: semanticColor || explicitBadgeColor || notificationDefaultColor.value,
    color: explicitBadgeTextColor || fallbackTextColor || '',
  }
}

/**
 * Checks whether has visible items after.
 */
function hasVisibleItemsAfter(groupId: string): boolean {
  const groups = resolvedGroups.value
  const currentIndex = groups.findIndex(group => group.id === groupId)
  if (currentIndex < 0) {
    return false
  }

  for (let index = currentIndex + 1; index < groups.length; index += 1) {
    const nextGroup = groups[index]
    if ((groupedItems.value[nextGroup.id] ?? []).length > 0) {
      return true
    }
  }

  return false
}

/**
 * Handles get compact group label.
 */
function getCompactGroupLabel(label: string): string {
  const words = label.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) {
    return '--'
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase()
  }
  return `${words[0][0] ?? ''}${words[1][0] ?? ''}`.toUpperCase()
}

/**
 * Handles emit telemetry.
 */
function emitTelemetry(type: AppShellTelemetryEvent['type'], payload: Record<string, unknown>): void {
  emit('telemetry', {
    type,
    component: 'NtkAppShell',
    payload,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Normalizes id segment.
 */
function normalizeIdSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Handles group label id.
 */
function groupLabelId(groupId: string): string {
  const normalized = normalizeIdSegment(groupId)
  return `ntk-shell-group-${normalized || 'default'}`
}

/**
 * Resolves item aria label.
 */
function resolveItemAriaLabel(item: AppShellItem): string {
  const prefix = props.itemAriaLabelPrefix?.trim()
  if (!prefix) {
    return item.label
  }
  return `${prefix}: ${item.label}`
}

/**
 * Resolves toolbar action aria label.
 */
function resolveToolbarActionAriaLabel(action: AppShellAction): string {
  const explicit = action.tooltip?.trim() || action.label?.trim()
  if (explicit) {
    return explicit
  }

  const prefix = props.actionAriaLabelPrefix?.trim() || 'Action'
  return `${prefix}: ${action.id}`
}

/**
 * Resolves toolbar action href.
 */
function resolveToolbarActionHref(action: AppShellAction): string | undefined {
  return sanitizeShellLink(action.href)
}

/**
 * Resolves toolbar action target.
 */
function resolveToolbarActionTarget(action: AppShellAction): string | undefined {
  return action.external && resolveToolbarActionHref(action) ? '_blank' : undefined
}

/**
 * Resolves toolbar action rel.
 */
function resolveToolbarActionRel(action: AppShellAction): string | undefined {
  return action.external && resolveToolbarActionHref(action) ? 'noopener noreferrer' : undefined
}

/**
 * Handles select item.
 */
function selectItem(item: AppShellItem): void {
  localActiveItem.value = item.id
  emit('update:active-item', item.id)
  emit('item-click', item)
  emitTelemetry('navigation-select', {
    itemId: item.id,
    itemLabel: item.label,
    groupId: item.group,
  })

  if (!$q.screen.gt.sm) {
    drawerOpen.value = false
  }
}

/**
 * Handles update search.
 */
function updateSearch(value: string | number | null): void {
  const normalized = String(value ?? '')
  localSearchValue.value = normalized
  emit('update:search-value', normalized)
  emitTelemetry('search-update', { value: normalized })
}

/**
 * Handles handle toolbar action.
 */
function handleToolbarAction(action: AppShellAction): void {
  emit('toolbar-action', action)
  emitTelemetry('toolbar-action', {
    actionId: action.id,
    hasHref: Boolean(resolveToolbarActionHref(action)),
    external: Boolean(action.external),
  })
}

/**
 * Handles toggle menu mode.
 */
function toggleMenuMode(): void {
  if ($q.screen.gt.sm) {
    miniState.value = !miniState.value
  } else {
    drawerOpen.value = !drawerOpen.value
  }

  emit('toggle-menu', {
    mini: miniState.value,
    open: drawerOpen.value,
  })
  emitTelemetry('menu-toggle', {
    mini: miniState.value,
    open: drawerOpen.value,
  })
}
</script>

<style scoped lang="scss">
.ntk-app-shell {
  background: var(--ntk-shell-bg);
  font-family: var(--ntk-shell-font-family);
  font-style: var(--ntk-shell-font-style-base);
}

.ntk-app-shell__header {
  background: var(--ntk-shell-header-bg);
  color: var(--ntk-shell-header-text);
  box-shadow: var(--ntk-shell-header-shadow) !important;
  z-index: var(--ntk-shell-header-z-index) !important;
  backdrop-filter: var(--ntk-shell-header-blur);
}

.ntk-app-shell__toolbar {
  padding: 0 var(--ntk-shell-space-sm) 0 var(--ntk-shell-space-lg);
  gap: var(--ntk-shell-space-sm);
}

.ntk-app-shell__menu-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--ntk-shell-menu-slot-width);
}

.ntk-app-shell__menu-slot :deep(.q-btn) {
  color: var(--ntk-shell-toolbar-btn-color);
  transition: all var(--ntk-shell-transition-fast);
}

.ntk-app-shell__menu-slot :deep(.q-btn:hover) {
  background-color: var(--ntk-shell-action-hover) !important;
  color: var(--ntk-shell-item-hover-color) !important;
}

.ntk-app-shell__menu-slot :deep(.q-btn:hover > .q-focus-helper) {
  background: var(--ntk-shell-action-hover) !important;
  opacity: 1 !important;
}

.ntk-app-shell__menu-slot :deep(.q-btn:hover > .q-focus-helper:before),
.ntk-app-shell__menu-slot :deep(.q-btn:hover > .q-focus-helper:after) {
  opacity: 0 !important;
}

.ntk-app-shell__title {
  display: flex;
  align-items: center;
  gap: var(--ntk-shell-space-sm);
  font-weight: var(--ntk-shell-font-weight-medium);
  font-size: var(--ntk-shell-font-size-title);
  color: var(--ntk-shell-title-text);
}

.ntk-app-shell__title-app {
  font-family: var(--ntk-shell-font-display);
  font-weight: var(--ntk-shell-font-weight-bold);
  font-size: var(--ntk-shell-font-size-title-app);
  color: var(--ntk-shell-title-app);
}

.ntk-app-shell__title-separator {
  color: var(--ntk-shell-title-separator);
  font-size: var(--ntk-shell-title-separator-size);
}

.ntk-app-shell__user-avatar {
  width: var(--ntk-shell-user-avatar-size);
  height: var(--ntk-shell-user-avatar-size);
}

.ntk-app-shell__user-avatar-icon {
  font-size: var(--ntk-shell-user-avatar-size);
}

.ntk-app-shell__search-wrapper {
  width: var(--ntk-shell-search-width);
  max-width: var(--ntk-shell-search-width);
  margin-right: var(--ntk-shell-space-lg);
  border: var(--ntk-shell-border-width) solid var(--ntk-shell-search-border);
  border-radius: var(--ntk-shell-radius-md);
  background: var(--ntk-shell-search-bg);
  transition: border-color var(--ntk-shell-transition-fast);
  padding: 0 var(--ntk-shell-space-md);
}

.ntk-app-shell__search-wrapper:hover {
  border-color: var(--ntk-shell-search-border-hover);
}

.ntk-app-shell__search-wrapper:focus-within {
  border-color: var(--ntk-shell-focus-color);
}

.ntk-app-shell__search :deep(.q-field__control) {
  height: var(--ntk-shell-search-control-height);
  min-height: var(--ntk-shell-search-control-height);
  padding: 0;
  background: transparent;
}

.ntk-app-shell__search :deep(.q-field__marginal) {
  height: var(--ntk-shell-search-control-height);
}

.ntk-app-shell__search :deep(.q-field__prepend) {
  padding-right: var(--ntk-shell-search-prepend-padding-right);
}

.ntk-app-shell__search :deep(input) {
  color: var(--ntk-shell-search-text);
  font-size: var(--ntk-shell-font-size-title);
  font-weight: var(--ntk-shell-font-weight-medium);
}

.ntk-app-shell__search :deep(.q-icon) {
  color: var(--ntk-shell-search-icon);
}

.ntk-app-shell__actions {
  display: inline-flex;
  align-items: center;
  gap: var(--ntk-shell-space-xs);
  margin-right: var(--ntk-shell-space-xs);
}

.ntk-app-shell__actions :deep(.q-btn) {
  background: var(--ntk-shell-action-bg) !important;
  color: var(--ntk-shell-toolbar-btn-color);
  transition:
    transform var(--ntk-shell-transition-fast),
    color var(--ntk-shell-transition-fast),
    background-color var(--ntk-shell-transition-fast);
}

.ntk-app-shell__actions :deep(.q-btn__content) {
  font-size: var(--ntk-shell-font-size-title);
  font-weight: var(--ntk-shell-font-weight-medium);
}

.ntk-app-shell__actions :deep(.q-btn:not(.q-btn--round)) {
  border-radius: var(--ntk-shell-radius-sm);
}

.ntk-app-shell__actions :deep(.ntk-app-shell__toolbar-action-btn > .q-focus-helper) {
  opacity: 0 !important;
  background: transparent !important;
  transition:
    opacity var(--ntk-shell-transition-fast),
    background var(--ntk-shell-transition-fast);
}

.ntk-app-shell__actions :deep(.ntk-app-shell__toolbar-action-btn:hover),
.ntk-app-shell__actions :deep(.ntk-app-shell__toolbar-action-btn:focus-visible),
.ntk-app-shell__actions :deep(.ntk-app-shell__toolbar-action-btn:active) {
  transform: translateY(var(--ntk-shell-action-hover-translate-y));
  background-color: var(--ntk-shell-action-hover) !important;
  color: var(--ntk-shell-item-hover-color) !important;
}

.ntk-app-shell__actions :deep(.ntk-app-shell__toolbar-action-btn:hover > .q-focus-helper),
.ntk-app-shell__actions :deep(.ntk-app-shell__toolbar-action-btn:focus-visible > .q-focus-helper),
.ntk-app-shell__actions :deep(.ntk-app-shell__toolbar-action-btn:active > .q-focus-helper) {
  background: var(--ntk-shell-action-hover) !important;
  opacity: 1 !important;
}

.ntk-app-shell__actions :deep(.ntk-app-shell__toolbar-action-btn:hover > .q-focus-helper:before),
.ntk-app-shell__actions :deep(.ntk-app-shell__toolbar-action-btn:hover > .q-focus-helper:after),
.ntk-app-shell__actions :deep(.ntk-app-shell__toolbar-action-btn:focus-visible > .q-focus-helper:before),
.ntk-app-shell__actions :deep(.ntk-app-shell__toolbar-action-btn:focus-visible > .q-focus-helper:after),
.ntk-app-shell__actions :deep(.ntk-app-shell__toolbar-action-btn:active > .q-focus-helper:before),
.ntk-app-shell__actions :deep(.ntk-app-shell__toolbar-action-btn:active > .q-focus-helper:after) {
  opacity: 0 !important;
}

.ntk-app-shell__actions :deep(.q-badge) {
  animation: ntk-pulse 2s infinite;
}

.ntk-app-shell :deep(.q-drawer) {
  background-color: var(--ntk-shell-drawer-bg) !important;
  color: var(--ntk-shell-drawer-text) !important;
  border-right: var(--ntk-shell-border-width) solid var(--ntk-shell-divider) !important;
  z-index: var(--ntk-shell-drawer-z-index) !important;
  box-shadow: var(--ntk-shell-drawer-shadow) !important;
}

:deep(.ntk-app-shell__drawer) {
  background-color: var(--ntk-shell-drawer-bg) !important;
  color: var(--ntk-shell-drawer-text) !important;
}

:deep(.ntk-app-shell__drawer .q-scrollarea),
:deep(.ntk-app-shell__drawer .q-scrollarea__container),
:deep(.ntk-app-shell__drawer .q-scrollarea__content) {
  background-color: var(--ntk-shell-drawer-bg) !important;
  color: var(--ntk-shell-drawer-text) !important;
}

.ntk-app-shell__drawer-header {
  min-height: var(--ntk-shell-drawer-header-min-height);
  padding: var(--ntk-shell-space-lg);
  display: flex;
  align-items: center;
  border-bottom: var(--ntk-shell-border-width) solid var(--ntk-shell-divider);
}

.ntk-app-shell__brand {
  display: flex;
  align-items: center;
  gap: var(--ntk-shell-space-md);
}

.ntk-app-shell__brand-logo {
  width: var(--ntk-shell-brand-logo-size);
  height: var(--ntk-shell-brand-logo-size);
}

.ntk-app-shell__brand-text {
  display: flex;
  flex-direction: column;
  line-height: var(--ntk-shell-line-height-brand-text);
}

.ntk-app-shell__brand-text strong {
  font-family: var(--ntk-shell-font-display);
  font-size: var(--ntk-shell-font-size-brand-title);
  font-weight: var(--ntk-shell-font-weight-semibold);
  color: var(--ntk-shell-brand-title);
}

.ntk-app-shell__brand-text small {
  font-size: var(--ntk-shell-font-size-brand-subtitle);
  font-weight: var(--ntk-shell-font-weight-regular);
  color: var(--ntk-shell-brand-subtitle);
}

.ntk-app-shell__drawer-list {
  padding: var(--ntk-shell-space-lg) 0;
  flex: 1;
}

.ntk-app-shell__group-caption {
  min-height: var(--ntk-shell-group-caption-min-height);
  padding: var(--ntk-shell-group-caption-padding);
  font-size: var(--ntk-shell-font-size-group-caption);
  letter-spacing: var(--ntk-shell-letter-spacing-group-caption);
  text-transform: uppercase;
  color: var(--ntk-shell-group-caption);
  display: flex;
  align-items: center;
}

.ntk-app-shell__group-caption-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ntk-app-shell__group-caption--mini {
  justify-content: center;
  padding: var(--ntk-shell-group-caption-mini-padding);
}

.ntk-app-shell__group-caption--mini .ntk-app-shell__group-caption-text {
  min-width: var(--ntk-shell-group-caption-mini-min-width);
  height: var(--ntk-shell-group-caption-mini-height);
  padding: 0 var(--ntk-shell-group-caption-mini-horizontal-padding);
  border-radius: var(--ntk-shell-group-caption-mini-radius);
  background: var(--ntk-shell-group-caption-mini-bg);
  font-size: var(--ntk-shell-font-size-group-caption-mini);
  font-weight: var(--ntk-shell-font-weight-bold);
  letter-spacing: var(--ntk-shell-letter-spacing-group-caption-mini);
}

.ntk-app-shell__item {
  border-radius: var(--ntk-shell-radius-item);
  margin-right: var(--ntk-shell-space-lg);
  margin-bottom: var(--ntk-shell-space-xs);
  min-height: var(--ntk-shell-item-min-height);
  color: var(--ntk-shell-item-text);
  transition: all var(--ntk-shell-transition-fast);
  text-decoration: none;
}

.ntk-app-shell__item:hover {
  background-color: var(--ntk-shell-item-hover);
  color: var(--ntk-shell-item-hover-color);
  transform: translateX(var(--ntk-shell-item-hover-translate-x));
  text-decoration: none;
}

.ntk-app-shell__item:hover :deep(.q-focus-helper) {
  background: var(--ntk-shell-item-hover) !important;
  opacity: 0.9;
}

.ntk-app-shell__item:hover :deep(.q-focus-helper:before),
.ntk-app-shell__item:hover :deep(.q-focus-helper:after) {
  opacity: 0 !important;
}

.ntk-app-shell__item :deep(.q-icon) {
  color: var(--ntk-shell-item-icon);
  font-size: var(--ntk-shell-item-icon-size);
  transition: all var(--ntk-shell-transition-fast);
}

.ntk-app-shell__item:hover :deep(.q-icon) {
  color: var(--ntk-shell-item-icon-hover);
}

.ntk-app-shell__item :deep(.q-item__label) {
  font-size: var(--ntk-shell-font-size-item-label);
  font-weight: var(--ntk-shell-font-weight-semibold);
  line-height: var(--ntk-shell-line-height-item-label);
}

.ntk-app-shell__item :deep(.q-item__label--caption) {
  font-size: var(--ntk-shell-font-size-item-caption);
  font-weight: var(--ntk-shell-font-weight-regular);
  line-height: var(--ntk-shell-line-height-item-caption);
  margin-top: var(--ntk-shell-item-caption-offset);
  color: var(--ntk-shell-brand-subtitle) !important;
}

.ntk-app-shell__item:hover :deep(.q-item__label--caption) {
  color: var(--ntk-shell-item-hover-color) !important;
}

.ntk-app-shell__item--active {
  background: var(--ntk-shell-item-active-bg);
  color: var(--ntk-shell-item-active-color);
  border-left: var(--ntk-shell-item-active-border-width) solid var(--ntk-shell-item-active-color);
}

.ntk-app-shell__item--active :deep(.q-focus-helper) {
  background: var(--ntk-shell-item-active-bg) !important;
  opacity: 0.95;
}

.ntk-app-shell__item--active :deep(.q-icon),
.ntk-app-shell__item--active :deep(.q-item__label) {
  color: var(--ntk-shell-item-active-color);
}

.ntk-app-shell__item--active :deep(.q-item__label--caption) {
  color: var(--ntk-shell-item-active-color) !important;
}

.ntk-app-shell__group-separator {
  opacity: var(--ntk-shell-group-separator-opacity);
  margin: var(--ntk-shell-space-lg) var(--ntk-shell-space-lg);
}

.ntk-app-shell__drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: var(--ntk-shell-border-width) solid var(--ntk-shell-divider);
  background-color: var(--ntk-shell-drawer-footer-bg);
  box-shadow: var(--ntk-shell-footer-shadow);
}

.ntk-app-shell__item--toggle {
  margin-bottom: 0;
}

:deep(.ntk-app-shell__drawer .q-scrollarea__content) {
  min-height: 100%;
  padding-bottom: var(--ntk-shell-drawer-scroll-padding-bottom);
}

.ntk-app-shell__page-container {
  background: var(--ntk-shell-page-bg);
  min-height: var(--ntk-shell-viewport-height);
  height: var(--ntk-shell-viewport-height);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable both-edges;
}

.ntk-app-shell__page {
  color: var(--ntk-shell-page-text);
  font-size: var(--ntk-shell-font-size-base);
  font-weight: var(--ntk-shell-font-weight-regular);
  padding: var(--ntk-shell-space-lg);
  min-height: calc(var(--ntk-shell-viewport-height) - var(--ntk-shell-header-height));
}

.ntk-app-shell__workspace {
  width: 100%;
  max-width: var(--ntk-shell-workspace-max-width);
  margin: 0 auto;
}

.ntk-app-shell__workspace-card {
  border: var(--ntk-shell-border-width) solid var(--ntk-shell-divider);
  border-radius: var(--ntk-shell-radius-lg);
  background: var(--ntk-shell-drawer-bg);
  box-shadow: var(--ntk-shell-header-shadow);
  padding: var(--ntk-shell-space-lg);
  min-height: calc(var(--ntk-shell-viewport-height) - var(--ntk-shell-header-height) - (var(--ntk-shell-space-lg) * 2));
}

:deep(.q-drawer--mini) .ntk-app-shell__item {
  justify-content: center;
  margin-right: var(--ntk-shell-mini-item-margin-right);
  border-radius: var(--ntk-shell-radius-item);
  min-height: var(--ntk-shell-item-min-height);
}

:deep(.q-drawer--mini) .ntk-app-shell__item :deep(.q-item__section--avatar) {
  min-width: var(--ntk-shell-mini-item-avatar-min-width);
  padding-right: 0;
}

@keyframes ntk-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(var(--ntk-shell-badge-pulse-scale));
  }
}

.ntk-app-shell--compact .ntk-app-shell__page {
  padding: var(--ntk-shell-compact-page-padding);
}

.ntk-app-shell--compact .ntk-app-shell__workspace-card {
  padding: var(--ntk-shell-compact-workspace-card-padding);
  min-height: calc(var(--ntk-shell-viewport-height) - var(--ntk-shell-header-height) - (var(--ntk-shell-compact-workspace-card-padding) * 2));
}
</style>