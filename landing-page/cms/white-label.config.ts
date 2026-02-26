import { APP_SHELL_DEFAULT_THEME, createAppShellConfig } from '../../src/components/layout/app-shell.config'
import type { AppShellConfig, AppShellItem, AppShellTheme } from '../../src/components/layout/app-shell.types'
import { semanticColors } from '../../src/config/colors/semantic.config'
import { resolveAppShellTheme } from '../../src/components/layout/app-shell.theme'
import { createCmsShellConfig } from './shell.config'
import type { CmsContentSettings, CmsPageSettings, CmsShellSnapshot, CmsWhiteLabelSettings } from './white-label.types'

export const CMS_WHITE_LABEL_STORAGE_KEY = 'ntk.cms.whiteLabel.settings.v1'

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }
  return JSON.parse(JSON.stringify(value)) as T
}

function createDefaultWhiteLabelTheme(theme: AppShellTheme): AppShellTheme {
  const notificationErrorColor = theme.notificationErrorColor ?? semanticColors.errorPrimary
  const notificationBadgeColor = theme.notificationBadgeColor ?? semanticColors.errorPrimary
  const notificationBadgeTextColor = theme.notificationBadgeTextColor ?? 'var(--ntk-text-inverse)'
  const notificationIconColor = theme.notificationIconColor ?? theme.toolbarButtonColor ?? 'var(--ntk-text-secondary)'
  return resolveAppShellTheme(
    {
      ...theme,
      notificationSuccessColor: semanticColors.successPrimary,
      notificationWarningColor: semanticColors.warningPrimary,
      notificationErrorColor,
      notificationInfoColor: semanticColors.infoPrimary,
      notificationBadgeColor,
      notificationBadgeTextColor,
      notificationIconColor,
      notificationSuccessTextColor: theme.notificationSuccessTextColor ?? notificationBadgeTextColor,
      notificationWarningTextColor: theme.notificationWarningTextColor ?? 'var(--ntk-text-primary)',
      notificationErrorTextColor: theme.notificationErrorTextColor ?? notificationBadgeTextColor,
      notificationInfoTextColor: theme.notificationInfoTextColor ?? notificationBadgeTextColor,
    },
    APP_SHELL_DEFAULT_THEME
  )
}

function createDefaultContentSettings(): CmsContentSettings {
  return {
    tabBrandingLabel: 'Branding',
    tabColorsLabel: 'Colors',
    tabMenuLabel: 'Sidebar Menu',
    tabTopbarLabel: 'Topbar',
    tabContentLabel: 'Content',
    moduleFallbackDescription: 'Select a module in the sidebar.',
    brandingBannerText: 'Branding changes are applied immediately to the shell and favicon.',
    colorsBannerText: 'Core color fields cascade to related tokens. You can use plain values (e.g. #1c19d2) or CSS expressions.',
    previewSuccessLabel: 'Success',
    previewWarningLabel: 'Warning',
    previewErrorLabel: 'Error',
    previewInfoLabel: 'Info',
    statusTitle: 'White-label status',
    statusChipLabel: 'Live',
    statusThemeText: 'Theme colors are fully editable',
    statusBrandingText: 'Brand logo and favicon are configurable',
    statusMenuText: 'Sidebar groups/items are configurable',
    statusTopbarText: 'Topbar actions are configurable',
    howToTitle: 'How to use',
    howToBody: 'Open the Settings module in the sidebar to edit white-label settings. Changes are auto-saved in local storage.',
    howToNextStep: 'Next step: bind these settings to CMS schemas by tenant.',
  }
}

function createDefaultPagesSettings(): CmsPageSettings[] {
  return [
    {
      id: 'landing-main',
      title: 'Main Landing',
      path: '/',
      status: 'published',
      description: 'Primary public landing page.',
      sections: [
        { id: 'header', label: 'Header', enabled: true },
        { id: 'hero', label: 'Hero', enabled: true },
        { id: 'features', label: 'Features', enabled: true },
        { id: 'installation', label: 'Installation', enabled: true },
        { id: 'footer', label: 'Footer', enabled: true },
      ],
    },
  ]
}

export function createDefaultWhiteLabelSettings(): CmsWhiteLabelSettings {
  const shell = createCmsShellConfig()

  return {
    branding: {
      appName: shell.appName,
      appSubtitle: shell.appSubtitle,
      brandLogo: shell.brandLogo,
      brandLogoAlt: shell.brandLogoAlt,
      faviconUrl: shell.brandLogo,
      userAvatar: shell.userAvatar,
      userTooltip: shell.userTooltip,
      notificationsTooltip: shell.notificationsTooltip,
      notificationCount: shell.notificationCount,
    },
    layout: {
      menuIcon: shell.menuIcon,
      menuAriaLabel: shell.menuAriaLabel,
      showSearch: shell.showSearch,
      showNotifications: shell.showNotifications,
      showUserAvatar: shell.showUserAvatar,
      searchPlaceholder: shell.searchPlaceholder,
      showGroupCaptions: shell.showGroupCaptions,
      collapsible: shell.collapsible,
      collapseLabel: shell.collapseLabel,
      expandLabel: shell.expandLabel,
      drawerWidth: shell.drawerWidth,
      miniWidth: shell.miniWidth,
      breakpoint: shell.breakpoint,
      headerHeight: shell.headerHeight,
      defaultDrawerOpen: shell.defaultDrawerOpen,
      defaultMini: shell.defaultMini,
    },
    content: createDefaultContentSettings(),
    pages: createDefaultPagesSettings(),
    themePresetId: 'default',
    themePresetOverrides: {},
    theme: createDefaultWhiteLabelTheme(cloneValue(shell.theme)),
    navGroups: cloneValue(shell.navGroups),
    items: cloneValue(shell.items),
    toolbarActions: cloneValue(shell.toolbarActions),
  }
}

export function mapWhiteLabelToShellSnapshot(
  settings: CmsWhiteLabelSettings,
  state: {
    activeItem: string
    searchValue: string
  }
): CmsShellSnapshot {
  const query = state.searchValue.trim().toLowerCase()
  const filteredItems = settings.items.filter(item => {
    if (!query) {
      return true
    }

    return (
      item.label.toLowerCase().includes(query) ||
      (item.caption ?? '').toLowerCase().includes(query) ||
      (item.description ?? '').toLowerCase().includes(query)
    )
  })

  const fallbackActiveItem = filteredItems[0]?.id ?? settings.items[0]?.id ?? ''
  const activeItem = filteredItems.some(item => item.id === state.activeItem)
    ? state.activeItem
    : fallbackActiveItem

  const resolvedTheme = resolveAppShellTheme(settings.theme, APP_SHELL_DEFAULT_THEME)
  const toolbarActions = settings.toolbarActions.filter(action => {
    const normalizedId = String(action.id ?? '').trim().toLowerCase()
    const normalizedIcon = String(action.icon ?? '').trim().toLowerCase()
    const isNotificationAction = normalizedId === 'notifications' || normalizedIcon === 'notifications'
    const isAccountAction = normalizedId === 'account' || normalizedIcon === 'account_circle'

    if (!settings.layout.showNotifications && isNotificationAction) {
      return false
    }

    if (!settings.layout.showUserAvatar && isAccountAction) {
      return false
    }

    return true
  })

  const shellConfig: AppShellConfig = createAppShellConfig({
    appName: settings.branding.appName,
    appSubtitle: settings.branding.appSubtitle,
    brandLogo: settings.branding.brandLogo,
    brandLogoAlt: settings.branding.brandLogoAlt,
    menuIcon: settings.layout.menuIcon,
    menuAriaLabel: settings.layout.menuAriaLabel,
    navGroups: settings.navGroups,
    items: filteredItems,
    activeItem,
    searchValue: state.searchValue,
    searchPlaceholder: settings.layout.searchPlaceholder,
    showSearch: settings.layout.showSearch,
    showNotifications: settings.layout.showNotifications,
    showUserAvatar: settings.layout.showUserAvatar,
    showGroupCaptions: settings.layout.showGroupCaptions,
    collapsible: settings.layout.collapsible,
    toolbarActions,
    theme: resolvedTheme,
    notificationCount: settings.branding.notificationCount,
    notificationsTooltip: settings.branding.notificationsTooltip,
    userAvatar: settings.branding.userAvatar,
    userTooltip: settings.branding.userTooltip,
    collapseLabel: settings.layout.collapseLabel,
    expandLabel: settings.layout.expandLabel,
    drawerWidth: settings.layout.drawerWidth,
    miniWidth: settings.layout.miniWidth,
    breakpoint: settings.layout.breakpoint,
    headerHeight: settings.layout.headerHeight,
    defaultDrawerOpen: settings.layout.defaultDrawerOpen,
    defaultMini: settings.layout.defaultMini,
  })

  return {
    shellConfig,
    filteredItems,
  }
}

export function createNewMenuItem(groupId: string): AppShellItem {
  const id = `item-${Math.random().toString(36).slice(2, 8)}`
  return {
    id,
    group: groupId,
    label: 'New item',
    icon: 'radio_button_unchecked',
    caption: 'Short description',
    description: 'Detailed module description.',
  }
}