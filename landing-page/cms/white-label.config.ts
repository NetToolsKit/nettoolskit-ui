import { createAppShellConfig } from '../../src/components/layout/app-shell.config'
import type { AppShellConfig, AppShellItem, AppShellTheme } from '../../src/components/layout/app-shell.types'
import { semanticColors } from '../../src/config/colors/semantic.config'
import { createCmsShellConfig } from './shell.config'
import type { CmsContentSettings, CmsShellSnapshot, CmsWhiteLabelSettings } from './white-label.types'

export const CMS_WHITE_LABEL_STORAGE_KEY = 'ntk.cms.whiteLabel.settings.v1'

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }
  return JSON.parse(JSON.stringify(value)) as T
}

function createDefaultWhiteLabelTheme(theme: AppShellTheme): AppShellTheme {
  const notificationBadgeTextColor = theme.notificationBadgeTextColor ?? 'var(--ntk-text-inverse)'
  return {
    ...theme,
    notificationSuccessColor: semanticColors.successPrimary,
    notificationWarningColor: semanticColors.warningPrimary,
    notificationErrorColor: semanticColors.errorPrimary,
    notificationInfoColor: semanticColors.infoPrimary,
    notificationBadgeTextColor,
    notificationSuccessTextColor: theme.notificationSuccessTextColor ?? notificationBadgeTextColor,
    notificationWarningTextColor: theme.notificationWarningTextColor ?? 'var(--ntk-text-primary)',
    notificationErrorTextColor: theme.notificationErrorTextColor ?? notificationBadgeTextColor,
    notificationInfoTextColor: theme.notificationInfoTextColor ?? notificationBadgeTextColor,
  }
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
      searchPlaceholder: shell.searchPlaceholder,
      showGroupCaptions: shell.showGroupCaptions,
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

  const resolvedTheme = resolveWhiteLabelTheme(settings.theme)

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
    showGroupCaptions: settings.layout.showGroupCaptions,
    toolbarActions: settings.toolbarActions,
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

function resolveWhiteLabelTheme(theme: AppShellTheme): AppShellTheme {
  const accentColor = theme.itemActiveColor
  const drawerTextColor = theme.drawerTextColor
  const drawerBackground = theme.drawerBackground
  const headerTextColor = theme.headerTextColor
  const headerBackground = theme.headerBackground
  const pageTextColor = theme.pageTextColor
  const itemHoverBackground = theme.itemHoverBackground
  const dividerColor = theme.dividerColor
  const notificationSuccessColor = theme.notificationSuccessColor ?? semanticColors.successPrimary
  const notificationWarningColor = theme.notificationWarningColor ?? semanticColors.warningPrimary
  const notificationErrorColor = theme.notificationErrorColor ?? semanticColors.errorPrimary
  const notificationInfoColor = theme.notificationInfoColor ?? semanticColors.infoPrimary
  const notificationBadgeTextColor = theme.notificationBadgeTextColor ?? 'var(--ntk-text-inverse)'
  const notificationSuccessTextColor = theme.notificationSuccessTextColor ?? notificationBadgeTextColor
  const notificationWarningTextColor = theme.notificationWarningTextColor ?? 'var(--ntk-text-primary)'
  const notificationErrorTextColor = theme.notificationErrorTextColor ?? notificationBadgeTextColor
  const notificationInfoTextColor = theme.notificationInfoTextColor ?? notificationBadgeTextColor

  return {
    ...theme,
    toolbarButtonColor: theme.toolbarButtonColor ?? headerTextColor,
    titleTextColor: theme.titleTextColor ?? headerTextColor,
    searchIconColor: theme.searchIconColor ?? headerTextColor,
    titleAppColor: theme.titleAppColor ?? accentColor ?? headerTextColor,
    brandTitleColor: theme.brandTitleColor ?? accentColor ?? headerTextColor,
    brandSubtitleColor: theme.brandSubtitleColor ?? drawerTextColor ?? headerTextColor,
    itemTextColor: theme.itemTextColor ?? drawerTextColor,
    itemIconColor: theme.itemIconColor ?? drawerTextColor,
    itemHoverColor: theme.itemHoverColor ?? accentColor,
    itemIconHoverColor: theme.itemIconHoverColor ?? accentColor,
    groupCaptionColor: theme.groupCaptionColor ?? drawerTextColor,
    titleSeparatorColor: theme.titleSeparatorColor ?? dividerColor,
    focusColor: theme.focusColor ?? accentColor,
    actionHoverBackground: theme.actionHoverBackground ?? itemHoverBackground,
    notificationErrorColor,
    notificationSuccessColor,
    notificationWarningColor,
    notificationInfoColor,
    notificationBadgeTextColor,
    notificationSuccessTextColor,
    notificationWarningTextColor,
    notificationErrorTextColor,
    notificationInfoTextColor,
    drawerFooterBackground: theme.drawerFooterBackground ?? drawerBackground,
    searchBackground: theme.searchBackground ?? headerBackground ?? drawerBackground,
    searchTextColor: theme.searchTextColor ?? pageTextColor ?? drawerTextColor,
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
