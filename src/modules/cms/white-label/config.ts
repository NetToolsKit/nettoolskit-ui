/**
 * CMS white-label configuration builders.
 * This module defines default settings and maps them into the app shell snapshot.
 *
 * Consumers can inject a custom {@link AppShellConfig} seed via the optional
 * parameter in {@link createDefaultWhiteLabelSettings} to provide branded
 * defaults. When omitted, a minimal library-level default is used.
 */
import { APP_SHELL_DEFAULT_THEME, createAppShellConfig } from '../../../components/layout/app-shell.config'
import type { AppShellConfig, AppShellItem, AppShellTheme } from '../../../components/layout/app-shell.types'
import { semanticColors } from '../../../config/colors/semantic.config'
import { resolveAppShellTheme } from '../../../components/layout/app-shell.theme'
import type { CmsContentSettings, CmsLocale, CmsPageSettings, CmsShellSnapshot, CmsWhiteLabelSettings } from './types'
import { createDefaultWhiteLabelGovernance } from './workflow'
import { createDefaultCmsReleaseSettings } from '../releases/orchestration'
import {
  createCmsPageSectionFromPreset,
  createDefaultCmsAuthoredContentModels,
  getCmsContentModelSchemaVersion,
} from './content-models'
import { createDefaultCmsReusableBlocks } from './reusable-blocks'
import { createDefaultCmsReusableSections } from './reusable-sections'
import { createDefaultCmsMediaAssets } from './media-library'
import { createDefaultCmsAuthoredBlockPresets } from './block-presets'
import { createDefaultCmsAuthoredContentModelFieldPresets } from './schema-field-presets'
import {
  createCmsDefaultEnterpriseTheme,
  CMS_AUTHORING_DEFAULT_THEME_PRESET_ID,
} from './authoring/design-baseline'
import {
  createLocalizedContentDefaults,
  createLocalizedShellActions,
  createLocalizedShellGroups,
  createLocalizedShellItems,
  getCmsLocalePack,
  resolveCmsLocale,
} from './i18n'

/**
 * Storage key for the current tenant white-label settings payload.
 */
export const CMS_WHITE_LABEL_STORAGE_KEY = 'ntk.cms.whiteLabel.settings.v1'
const COMPAT_SURFACE_BACKGROUND_TOKEN = 'var(--ntk-bg-card)'
const COMPAT_PAGE_BACKGROUND_TOKEN = 'var(--ntk-bg-primary)'

/**
 * Creates a deep clone for plain objects used in default settings.
 */
function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value)
  }
  return JSON.parse(JSON.stringify(value)) as T
}

/**
 * Builds a minimal library-level shell configuration seed.
 * This provides sensible structural defaults without imposing any specific branding.
 */
function createDefaultShellConfig(localeInput: CmsLocale | string = 'en'): AppShellConfig {
  const locale = resolveCmsLocale(localeInput)
  const localePack = getCmsLocalePack(locale)
  return createAppShellConfig({
    appName: localePack.appName,
    appSubtitle: localePack.appSubtitle,
    navGroups: createLocalizedShellGroups(locale),
    items: createLocalizedShellItems(locale),
    toolbarActions: createLocalizedShellActions(locale),
    activeItem: 'settings',
    searchPlaceholder: localePack.searchPlaceholder,
    menuAriaLabel: localePack.menuAriaLabel,
    collapseLabel: localePack.collapseLabel,
    expandLabel: localePack.expandLabel,
    userTooltip: localePack.userTooltip,
    notificationsTooltip: localePack.notificationsTooltip,
  })
}

/**
 * Builds the default theme while enforcing explicit notification semantic values.
 */
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

/**
 * Migrates old flat page/surface/search backgrounds to modern contrasting defaults.
 */
function normalizeShellSurfaceContrast(theme: AppShellTheme): AppShellTheme {
  const pageBackground = String(theme.pageBackground ?? '').trim().toLowerCase()
  const drawerBackground = String(theme.drawerBackground ?? '').trim().toLowerCase()
  const searchBackground = String(theme.searchBackground ?? '').trim().toLowerCase()

  const isCompatPageToken = pageBackground === COMPAT_PAGE_BACKGROUND_TOKEN || pageBackground === COMPAT_SURFACE_BACKGROUND_TOKEN
  const isCompatFlatSurface = isCompatPageToken && pageBackground === drawerBackground
  const isCompatSearchSurface = searchBackground.length === 0 || searchBackground === drawerBackground

  if (!isCompatFlatSurface || !isCompatSearchSurface) {
    return theme
  }

  return {
    ...theme,
    pageBackground: APP_SHELL_DEFAULT_THEME.pageBackground,
    searchBackground: APP_SHELL_DEFAULT_THEME.searchBackground,
  }
}

/**
 * Provides default copy used by CMS settings UI sections and previews.
 */
function createDefaultContentSettings(localeInput: CmsLocale | string = 'en'): CmsContentSettings {
  return createLocalizedContentDefaults(localeInput)
}

/**
 * Provides default CMS pages metadata for landing-page orchestration.
 */
function createDefaultPagesSettings(): CmsPageSettings[] {
  const mainPresetIds = ['header', 'hero', 'features', 'installation', 'footer'] as const
  const sections = mainPresetIds.reduce<CmsPageSettings['sections']>((accumulator, presetId) => {
    accumulator.push(createCmsPageSectionFromPreset({
      presetId,
      existingSections: accumulator,
      localeInput: 'en',
    }))
    return accumulator
  }, [])

  return [
    {
      id: 'landing-main',
      contentModelId: 'landing-page',
      contentModelVersion: getCmsContentModelSchemaVersion('landing-page'),
      title: 'Main Landing',
      path: '/',
      status: 'published',
      description: 'Primary public landing page.',
      localization: {
        title: {
          en: 'Main Landing',
          'pt-BR': 'Landing Principal',
        },
        description: {
          en: 'Primary public landing page.',
          'pt-BR': 'Página pública principal de landing.',
        },
      },
      sections,
    },
  ]
}

/**
 * Builds the complete default white-label settings object.
 *
 * @param shellConfig - Optional branded shell seed. When omitted, a minimal
 *   library-level default is used. Consumers (e.g. demo apps) can inject their
 *   own branded shell config to customize the initial settings.
 */
export function createDefaultWhiteLabelSettings(
  shellConfig?: AppShellConfig,
  localeInput: CmsLocale | string = 'en'
): CmsWhiteLabelSettings {
  const locale = resolveCmsLocale(localeInput)
  const shell = shellConfig ?? createDefaultShellConfig(locale)
  const baseTheme = createDefaultWhiteLabelTheme(cloneValue(shell.theme))
  const branding = {
    appName: shell.appName,
    appSubtitle: shell.appSubtitle,
    brandLogo: shell.brandLogo,
    brandLogoAlt: shell.brandLogoAlt,
    faviconUrl: shell.brandLogo,
    userAvatar: shell.userAvatar,
    userTooltip: shell.userTooltip,
    notificationsTooltip: shell.notificationsTooltip,
    notificationCount: shell.notificationCount,
  }

  return {
    branding,
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
    content: createDefaultContentSettings(locale),
    pages: createDefaultPagesSettings(),
    reusableSections: createDefaultCmsReusableSections(),
    reusableBlocks: createDefaultCmsReusableBlocks(locale),
    authoredContentModels: createDefaultCmsAuthoredContentModels(),
    authoredContentModelFieldPresets: createDefaultCmsAuthoredContentModelFieldPresets(),
    authoredBlockPresets: createDefaultCmsAuthoredBlockPresets(),
    mediaAssets: createDefaultCmsMediaAssets(branding, locale),
    releases: createDefaultCmsReleaseSettings(),
    themePresetId: CMS_AUTHORING_DEFAULT_THEME_PRESET_ID,
    themePresetOverrides: {},
    theme: createCmsDefaultEnterpriseTheme(baseTheme),
    navGroups: cloneValue(shell.navGroups),
    items: cloneValue(shell.items),
    toolbarActions: cloneValue(shell.toolbarActions),
    governance: createDefaultWhiteLabelGovernance(),
  }
}

/**
 * Resolves current white-label settings into an AppShell snapshot for runtime rendering.
 */
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

  const resolvedTheme = normalizeShellSurfaceContrast(
    resolveAppShellTheme(settings.theme, APP_SHELL_DEFAULT_THEME)
  )
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

/**
 * Creates a new menu item scaffold bound to a specific navigation group.
 */
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