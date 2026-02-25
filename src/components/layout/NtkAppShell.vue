<template>
  <q-layout view="hHh Lpr fFf" class="ntk-app-shell" :style="shellStyle">
    <q-drawer
      v-model="drawerOpen"
      show-if-above
      :width="drawerWidth"
      :mini-width="miniWidth"
      :mini="isMiniMode"
      :breakpoint="breakpoint"
      bordered
      class="ntk-app-shell__drawer"
    >
      <q-scroll-area class="fit">
        <div class="ntk-app-shell__drawer-header">
          <slot name="drawer-header">
            <div class="ntk-app-shell__brand">
              <q-avatar square size="34px">
                <img :src="brandLogo" :alt="brandLogoAlt" />
              </q-avatar>
              <div v-if="!isMiniMode" class="ntk-app-shell__brand-text">
                <strong>{{ appName }}</strong>
                <small>{{ appSubtitle }}</small>
              </div>
            </div>
          </slot>
        </div>

        <q-list padding class="ntk-app-shell__drawer-list">
          <template v-for="group in resolvedGroups" :key="group.id">
            <div
              v-if="showGroupCaptions"
              class="ntk-app-shell__group-caption"
              :class="{ 'ntk-app-shell__group-caption--mini': isMiniMode }"
            >
              <span class="ntk-app-shell__group-caption-text">
                {{ isMiniMode ? getCompactGroupLabel(group.label) : group.label }}
              </span>
              <q-tooltip v-if="isMiniMode" anchor="center right" self="center left" :offset="[10, 0]">
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
              @click="selectItem(item)"
            >
              <q-item-section avatar>
                <q-icon :name="item.icon" />
              </q-item-section>

              <q-item-section v-if="!isMiniMode">
                <q-item-label>{{ item.label }}</q-item-label>
                <q-item-label v-if="item.caption" caption>{{ item.caption }}</q-item-label>
              </q-item-section>

              <q-item-section v-if="!isMiniMode && item.badge" side>
                <q-badge :style="getItemBadgeStyle(item)" :label="item.badge" />
              </q-item-section>

              <q-tooltip v-else-if="isMiniMode" anchor="center right" self="center left" :offset="[10, 0]">
                {{ item.label }}
              </q-tooltip>
            </q-item>

            <q-separator
              v-if="hasVisibleItemsAfter(group.id)"
              class="ntk-app-shell__group-separator q-my-sm"
            />
          </template>
        </q-list>

        <div v-if="collapsible" class="ntk-app-shell__drawer-footer">
          <q-item clickable class="ntk-app-shell__item ntk-app-shell__item--toggle" @click="toggleMenuMode">
            <q-item-section avatar>
              <q-icon :name="isMiniMode ? 'keyboard_double_arrow_right' : 'keyboard_double_arrow_left'" />
            </q-item-section>
            <q-item-section v-if="!isMiniMode">
              <q-item-label>{{ isMiniMode ? expandLabel : collapseLabel }}</q-item-label>
            </q-item-section>
            <q-tooltip v-else anchor="center right" self="center left" :offset="[10, 0]">
              {{ expandLabel }}
            </q-tooltip>
          </q-item>
        </div>
      </q-scroll-area>
    </q-drawer>

    <q-header elevated class="ntk-app-shell__header" :height-hint="headerHeight">
      <q-toolbar class="ntk-app-shell__toolbar" :style="{ height: `${headerHeight}px` }">
        <div class="ntk-app-shell__menu-slot">
          <q-btn
            flat
            dense
            round
            :icon="menuIcon"
            :aria-label="menuAriaLabel"
            @click="toggleMenuMode"
          >
            <q-tooltip>{{ isMiniMode ? expandLabel : collapseLabel }}</q-tooltip>
          </q-btn>
        </div>

        <q-toolbar-title class="ntk-app-shell__title">
          <slot name="title" :active-item="activeItem">
            <span class="ntk-app-shell__title-app">{{ appName }}</span>
            <q-icon name="chevron_right" size="20px" class="ntk-app-shell__title-separator" />
            <span>{{ activeItem.label }}</span>
          </slot>
        </q-toolbar-title>

        <q-space />

        <div v-if="showSearch && $q.screen.gt.xs" class="ntk-app-shell__search-wrapper">
          <q-input
            :model-value="searchModel"
            dense
            borderless
            :placeholder="searchPlaceholder"
            class="ntk-app-shell__search"
            @update:model-value="updateSearch"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="ntk-app-shell__actions">
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
                :color="action.color"
                :text-color="action.textColor"
                :href="action.href"
                :target="action.external ? '_blank' : undefined"
                :rel="action.external ? 'noopener noreferrer' : undefined"
                :class="action.className"
                @click="handleToolbarAction(action)"
              >
                <q-badge
                  v-if="action.badge !== undefined"
                  :style="getActionBadgeStyle(action)"
                  floating
                >
                  {{ action.badge }}
                </q-badge>
                <q-tooltip v-if="action.tooltip">{{ action.tooltip }}</q-tooltip>
              </q-btn>
            </template>

            <template v-else>
              <q-btn v-if="showNotifications" flat round dense icon="notifications" @click="$emit('notifications-click')">
                <q-badge v-if="notificationCount > 0" floating :style="notificationBadgeStyle">
                  {{ notificationCount }}
                </q-badge>
                <q-tooltip>{{ notificationsTooltip }}</q-tooltip>
              </q-btn>

              <q-btn v-if="showUserAvatar" flat round dense @click="$emit('user-click')">
                <q-avatar size="26px">
                  <img v-if="userAvatar" :src="userAvatar" alt="User avatar" />
                  <q-icon v-else name="account_circle" size="26px" />
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
        <slot :active-item="activeItem" :active-item-id="activeItemId" :is-mini-mode="isMiniMode" />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import type { AppShellAction, AppShellGroup, AppShellItem, AppShellTheme } from './app-shell.types'
import { APP_SHELL_DEFAULTS, APP_SHELL_DEFAULT_THEME } from './app-shell.config'

const props = withDefaults(
  defineProps<{
    appName?: string
    appSubtitle?: string
    brandLogo?: string
    brandLogoAlt?: string
    menuIcon?: string
    menuAriaLabel?: string
    navGroups?: AppShellGroup[]
    items?: AppShellItem[]
    activeItem?: string
    searchValue?: string
    searchPlaceholder?: string
    showSearch?: boolean
    showGroupCaptions?: boolean
    toolbarActions?: AppShellAction[]
    theme?: AppShellTheme
    showNotifications?: boolean
    notificationsTooltip?: string
    notificationCount?: number
    showUserAvatar?: boolean
    userAvatar?: string
    userTooltip?: string
    collapsible?: boolean
    collapseLabel?: string
    expandLabel?: string
    drawerWidth?: number
    miniWidth?: number
    breakpoint?: number
    headerHeight?: number
    defaultDrawerOpen?: boolean
    defaultMini?: boolean
  }>(),
  {
    appName: APP_SHELL_DEFAULTS.appName,
    appSubtitle: APP_SHELL_DEFAULTS.appSubtitle,
    brandLogo: APP_SHELL_DEFAULTS.brandLogo,
    brandLogoAlt: APP_SHELL_DEFAULTS.brandLogoAlt,
    menuIcon: APP_SHELL_DEFAULTS.menuIcon,
    menuAriaLabel: APP_SHELL_DEFAULTS.menuAriaLabel,
    navGroups: () => [...APP_SHELL_DEFAULTS.navGroups],
    items: () => [...APP_SHELL_DEFAULTS.items],
    activeItem: APP_SHELL_DEFAULTS.activeItem,
    searchValue: APP_SHELL_DEFAULTS.searchValue,
    searchPlaceholder: APP_SHELL_DEFAULTS.searchPlaceholder,
    showSearch: APP_SHELL_DEFAULTS.showSearch,
    showGroupCaptions: APP_SHELL_DEFAULTS.showGroupCaptions,
    toolbarActions: () => [...APP_SHELL_DEFAULTS.toolbarActions],
    theme: () => ({ ...(APP_SHELL_DEFAULTS.theme ?? {}) }),
    showNotifications: APP_SHELL_DEFAULTS.showNotifications,
    notificationsTooltip: APP_SHELL_DEFAULTS.notificationsTooltip,
    notificationCount: APP_SHELL_DEFAULTS.notificationCount,
    showUserAvatar: APP_SHELL_DEFAULTS.showUserAvatar,
    userAvatar: APP_SHELL_DEFAULTS.userAvatar,
    userTooltip: APP_SHELL_DEFAULTS.userTooltip,
    collapsible: APP_SHELL_DEFAULTS.collapsible,
    collapseLabel: APP_SHELL_DEFAULTS.collapseLabel,
    expandLabel: APP_SHELL_DEFAULTS.expandLabel,
    drawerWidth: APP_SHELL_DEFAULTS.drawerWidth,
    miniWidth: APP_SHELL_DEFAULTS.miniWidth,
    breakpoint: APP_SHELL_DEFAULTS.breakpoint,
    headerHeight: APP_SHELL_DEFAULTS.headerHeight,
    defaultDrawerOpen: APP_SHELL_DEFAULTS.defaultDrawerOpen,
    defaultMini: APP_SHELL_DEFAULTS.defaultMini,
  }
)

const emit = defineEmits<{
  (e: 'update:active-item', value: string): void
  (e: 'update:search-value', value: string): void
  (e: 'item-click', value: AppShellItem): void
  (e: 'notifications-click'): void
  (e: 'user-click'): void
  (e: 'toolbar-action', value: AppShellAction): void
  (e: 'toggle-menu', value: { mini: boolean; open: boolean }): void
}>()

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

const resolvedTheme = computed<AppShellTheme>(() => ({
  ...APP_SHELL_DEFAULT_THEME,
  ...(props.theme ?? {}),
}))

const isMiniMode = computed(() => miniState.value && $q.screen.gt.sm)
const searchModel = computed(() => localSearchValue.value)
const notificationDefaultColor = computed(() => {
  return resolvedTheme.value.notificationErrorColor || ''
})
const notificationDefaultTextColor = computed(() => {
  return (
    resolvedTheme.value.notificationErrorTextColor ||
    resolvedTheme.value.notificationBadgeTextColor ||
    ''
  )
})

const notificationBadgeStyle = computed(() => ({
  backgroundColor: notificationDefaultColor.value,
  color: notificationDefaultTextColor.value,
}))

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
    '--ntk-shell-transition-fast': theme.transitionFast ?? '',
  }
})

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

function getItemBadgeStyle(item: AppShellItem): Record<string, string> {
  const semanticColor = resolveNotificationTypeColor(item.badgeColor)
  const semanticTextColor = resolveNotificationTypeTextColor(item.badgeColor)
  return {
    backgroundColor: semanticColor || item.badgeColor || resolvedTheme.value.itemActiveColor || '',
    color: item.badgeTextColor || semanticTextColor || resolvedTheme.value.notificationBadgeTextColor || '',
  }
}

function getActionBadgeStyle(action: AppShellAction): Record<string, string> {
  const semanticColor = resolveNotificationTypeColor(action.badgeColor)
  const semanticTextColor = resolveNotificationTypeTextColor(action.badgeColor)
  return {
    backgroundColor: semanticColor || action.badgeColor || notificationDefaultColor.value,
    color: action.badgeTextColor || semanticTextColor || resolvedTheme.value.notificationBadgeTextColor || '',
  }
}

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

function selectItem(item: AppShellItem): void {
  localActiveItem.value = item.id
  emit('update:active-item', item.id)
  emit('item-click', item)

  if (!$q.screen.gt.sm) {
    drawerOpen.value = false
  }
}

function updateSearch(value: string | number | null): void {
  const normalized = String(value ?? '')
  localSearchValue.value = normalized
  emit('update:search-value', normalized)
}

function handleToolbarAction(action: AppShellAction): void {
  emit('toolbar-action', action)
}

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
}
</script>

<style scoped lang="scss">
.ntk-app-shell {
  background: var(--ntk-shell-bg);
  font-family: var(--ntk-shell-font-family);
}

.ntk-app-shell__header {
  background: var(--ntk-shell-header-bg);
  color: var(--ntk-shell-header-text);
  box-shadow: var(--ntk-shell-header-shadow) !important;
  z-index: 3000 !important;
  backdrop-filter: blur(10px);
}

.ntk-app-shell__toolbar {
  padding: 0 8px 0 16px;
  gap: 0.5rem;
}

.ntk-app-shell__menu-slot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
}

.ntk-app-shell__menu-slot :deep(.q-btn) {
  color: var(--ntk-shell-toolbar-btn-color);
}

.ntk-app-shell__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 0.925rem;
  color: var(--ntk-shell-title-text);
}

.ntk-app-shell__title-app {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--ntk-shell-title-app);
}

.ntk-app-shell__title-separator {
  color: var(--ntk-shell-title-separator);
}

.ntk-app-shell__search-wrapper {
  width: 320px;
  max-width: 320px;
  margin-right: 16px;
  border: 1px solid var(--ntk-shell-search-border);
  border-radius: 8px;
  background: var(--ntk-shell-search-bg);
  transition: border-color var(--ntk-shell-transition-fast);
  padding: 0 12px;
}

.ntk-app-shell__search-wrapper:hover {
  border-color: var(--ntk-shell-search-border-hover);
}

.ntk-app-shell__search-wrapper:focus-within {
  border-color: var(--ntk-shell-focus-color);
}

.ntk-app-shell__search :deep(.q-field__control) {
  height: 36px;
  min-height: 36px;
  padding: 0;
  background: transparent;
}

.ntk-app-shell__search :deep(.q-field__marginal) {
  height: 36px;
}

.ntk-app-shell__search :deep(.q-field__prepend) {
  padding-right: 12px;
}

.ntk-app-shell__search :deep(input) {
  color: var(--ntk-shell-search-text);
}

.ntk-app-shell__search :deep(.q-icon) {
  color: var(--ntk-shell-search-icon);
}

.ntk-app-shell__actions {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-right: 0.25rem;
}

.ntk-app-shell__actions :deep(.q-btn) {
  color: var(--ntk-shell-toolbar-btn-color);
  transition: all var(--ntk-shell-transition-fast);
}

.ntk-app-shell__actions :deep(.q-btn:hover) {
  transform: translateY(-2px);
  background-color: var(--ntk-shell-action-hover);
}

.ntk-app-shell__actions :deep(.q-badge) {
  animation: ntk-pulse 2s infinite;
}

.ntk-app-shell__drawer {
  background-color: var(--ntk-shell-drawer-bg);
  color: var(--ntk-shell-drawer-text);
  z-index: 2000;
  box-shadow: var(--ntk-shell-drawer-shadow);
}

.ntk-app-shell__drawer-header {
  min-height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--ntk-shell-divider);
}

.ntk-app-shell__brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.ntk-app-shell__brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.ntk-app-shell__brand-text strong {
  font-size: 0.9rem;
  color: var(--ntk-shell-brand-title);
}

.ntk-app-shell__brand-text small {
  font-size: 0.72rem;
  color: var(--ntk-shell-brand-subtitle);
}

.ntk-app-shell__drawer-list {
  padding: 16px 0;
  flex: 1;
}

.ntk-app-shell__group-caption {
  min-height: 24px;
  padding: 0.45rem 1rem 0.25rem;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
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
  padding: 0.45rem 0;
}

.ntk-app-shell__group-caption--mini .ntk-app-shell__group-caption-text {
  min-width: 34px;
  height: 18px;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: var(--ntk-shell-group-caption-mini-bg);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.ntk-app-shell__item {
  border-radius: 0 28px 28px 0;
  margin-right: 12px;
  margin-bottom: 4px;
  min-height: 52px;
  color: var(--ntk-shell-item-text);
  transition: all var(--ntk-shell-transition-fast);
  text-decoration: none;
}

.ntk-app-shell__item:hover {
  background-color: var(--ntk-shell-item-hover);
  color: var(--ntk-shell-item-hover-color);
  transform: translateX(4px);
  text-decoration: none;
}

.ntk-app-shell__item :deep(.q-icon) {
  color: var(--ntk-shell-item-icon);
  font-size: 22px;
  transition: all var(--ntk-shell-transition-fast);
}

.ntk-app-shell__item:hover :deep(.q-icon) {
  color: var(--ntk-shell-item-icon-hover);
}

.ntk-app-shell__item :deep(.q-item__label) {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.25;
}

.ntk-app-shell__item :deep(.q-item__label--caption) {
  font-size: 11px;
  line-height: 1.2;
  margin-top: 0.15rem;
}

.ntk-app-shell__item--active {
  background: var(--ntk-shell-item-active-bg);
  color: var(--ntk-shell-item-active-color);
  border-left: 4px solid var(--ntk-shell-item-active-color);
}

.ntk-app-shell__item--active :deep(.q-icon),
.ntk-app-shell__item--active :deep(.q-item__label) {
  color: var(--ntk-shell-item-active-color);
}

.ntk-app-shell__group-separator {
  opacity: 0.12;
  margin: 0.8rem 0.9rem;
}

.ntk-app-shell__drawer-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid var(--ntk-shell-divider);
  background-color: var(--ntk-shell-drawer-footer-bg);
  box-shadow: var(--ntk-shell-footer-shadow);
}

.ntk-app-shell__item--toggle {
  margin-bottom: 0;
}

.ntk-app-shell__drawer :deep(.q-scrollarea__content) {
  min-height: 100%;
  padding-bottom: 80px;
}

.ntk-app-shell__page-container {
  background: var(--ntk-shell-page-bg);
  min-height: 100vh;
}

.ntk-app-shell__page {
  color: var(--ntk-shell-page-text);
  padding: 1rem;
}

:deep(.q-drawer--mini) .ntk-app-shell__item {
  justify-content: center;
  margin-right: 12px;
  border-radius: 0 28px 28px 0;
  min-height: 52px;
}

:deep(.q-drawer--mini) .ntk-app-shell__item :deep(.q-item__section--avatar) {
  min-width: 28px;
  padding-right: 0;
}

@keyframes ntk-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@media (max-width: 500px) {
  .ntk-app-shell__search-wrapper {
    display: none;
  }
}
</style>
