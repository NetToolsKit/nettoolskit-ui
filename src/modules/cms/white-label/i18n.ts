/**
 * CMS white-label copy presets (default English + optional pt-BR).
 * This module centralizes locale defaults for shell labels and CMS content copy.
 */
import type { AppShellAction, AppShellGroup, AppShellItem } from '../../../components/layout/app-shell.types'
import type { CmsContentSettings, CmsLocale, CmsWhiteLabelSettings } from './types'

export const CMS_SUPPORTED_LOCALES = ['en', 'pt-BR'] as const

export const CMS_LOCALE_OPTIONS: ReadonlyArray<{ label: string, value: CmsLocale }> = [
  { label: 'English', value: 'en' },
  { label: 'Portuguese (Brazil)', value: 'pt-BR' },
]

interface CmsLocalePack {
  appName: string
  appSubtitle: string
  searchPlaceholder: string
  menuAriaLabel: string
  collapseLabel: string
  expandLabel: string
  userTooltip: string
  notificationsTooltip: string
  tenantProfileLabel: string
  navGroups: Record<string, string>
  items: Record<string, { label: string, caption: string, description: string }>
  actions: Record<string, { label: string, tooltip: string }>
  content: Omit<CmsContentSettings, 'locale'>
}

const cmsLocalePacks: Record<CmsLocale, CmsLocalePack> = {
  en: {
    appName: 'White-Label App',
    appSubtitle: 'CMS Workspace',
    searchPlaceholder: 'Search module',
    menuAriaLabel: 'Toggle menu',
    collapseLabel: 'Collapse menu',
    expandLabel: 'Expand menu',
    userTooltip: 'Account',
    notificationsTooltip: 'Notifications',
    tenantProfileLabel: 'Tenant profile name',
    navGroups: {
      configuration: 'Configuration',
      content: 'Content',
    },
    items: {
      settings: {
        label: 'Settings',
        caption: 'White-label',
        description: 'Theme tokens, branding and tenant configuration.',
      },
      pages: {
        label: 'Pages',
        caption: 'Landing pages',
        description: 'Manage page routes, status and section composition.',
      },
      blocks: {
        label: 'Blocks',
        caption: 'Reusable blocks',
        description: 'Manage reusable CMS blocks for landing experiences.',
      },
      media: {
        label: 'Media',
        caption: 'Assets',
        description: 'Manage images and media references used by CMS pages.',
      },
      releases: {
        label: 'Releases',
        caption: 'Orchestration',
        description: 'Validate, schedule, publish and rollback tenant releases.',
      },
    },
    actions: {
      notifications: { label: 'Notifications', tooltip: 'Notifications' },
      account: { label: 'Account', tooltip: 'Account' },
    },
    content: {
      tabBrandingLabel: 'Branding',
      tabTypographyLabel: 'Typography',
      tabLayoutLabel: 'Layout',
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
    },
  },
  'pt-BR': {
    appName: 'Aplicacao White-Label',
    appSubtitle: 'Workspace CMS',
    searchPlaceholder: 'Buscar modulo',
    menuAriaLabel: 'Alternar menu',
    collapseLabel: 'Comprimir menu',
    expandLabel: 'Expandir menu',
    userTooltip: 'Conta',
    notificationsTooltip: 'Notificacoes',
    tenantProfileLabel: 'Nome do perfil do tenant',
    navGroups: {
      configuration: 'Configuracao',
      content: 'Conteudo',
    },
    items: {
      settings: {
        label: 'Configuracoes',
        caption: 'White-label',
        description: 'Tokens de tema, branding e configuracao por tenant.',
      },
      pages: {
        label: 'Paginas',
        caption: 'Landing pages',
        description: 'Gerencie rotas, status e composicao das secoes.',
      },
      blocks: {
        label: 'Blocos',
        caption: 'Blocos reutilizaveis',
        description: 'Gerencie blocos reutilizaveis para experiencias de landing.',
      },
      media: {
        label: 'Midia',
        caption: 'Assets',
        description: 'Gerencie imagens e referencias de midia das paginas CMS.',
      },
      releases: {
        label: 'Releases',
        caption: 'Orquestracao',
        description: 'Valide, agende, publique e faca rollback de releases.',
      },
    },
    actions: {
      notifications: { label: 'Notificacoes', tooltip: 'Notificacoes' },
      account: { label: 'Conta', tooltip: 'Conta' },
    },
    content: {
      tabBrandingLabel: 'Branding',
      tabTypographyLabel: 'Tipografia',
      tabLayoutLabel: 'Layout',
      tabColorsLabel: 'Cores',
      tabMenuLabel: 'Menu lateral',
      tabTopbarLabel: 'Topbar',
      tabContentLabel: 'Conteudo',
      moduleFallbackDescription: 'Selecione um modulo no menu lateral.',
      brandingBannerText: 'Alteracoes de branding sao aplicadas imediatamente no shell e favicon.',
      colorsBannerText: 'Campos de cor principais em cascata para tokens relacionados. Voce pode usar valores diretos (ex. #1c19d2) ou expressoes CSS.',
      previewSuccessLabel: 'Sucesso',
      previewWarningLabel: 'Aviso',
      previewErrorLabel: 'Erro',
      previewInfoLabel: 'Info',
      statusTitle: 'Status do white-label',
      statusChipLabel: 'Ao vivo',
      statusThemeText: 'As cores do tema sao totalmente editaveis',
      statusBrandingText: 'Logo e favicon sao configuraveis',
      statusMenuText: 'Grupos e itens do menu lateral sao configuraveis',
      statusTopbarText: 'Acoes da topbar sao configuraveis',
      howToTitle: 'Como usar',
      howToBody: 'Abra o modulo de Configuracoes no menu lateral para editar o white-label. As mudancas sao salvas automaticamente no local storage.',
      howToNextStep: 'Proximo passo: vincular essas configuracoes aos schemas CMS por tenant.',
    },
  },
}

/**
 * Resolves raw locale values to supported CMS locale ids.
 */
export function resolveCmsLocale(value: unknown): CmsLocale {
  const normalized = String(value ?? '').trim()
  if ((CMS_SUPPORTED_LOCALES as readonly string[]).includes(normalized)) {
    return normalized as CmsLocale
  }
  if (normalized.toLowerCase().startsWith('pt')) {
    return 'pt-BR'
  }
  return 'en'
}

/**
 * Returns locale pack used by shell and content default builders.
 */
export function getCmsLocalePack(localeInput: unknown): CmsLocalePack {
  const locale = resolveCmsLocale(localeInput)
  return cmsLocalePacks[locale]
}

/**
 * Creates CMS content defaults according to locale.
 */
export function createLocalizedContentDefaults(localeInput: unknown): CmsContentSettings {
  const locale = resolveCmsLocale(localeInput)
  const pack = getCmsLocalePack(locale)
  return {
    locale,
    ...pack.content,
  }
}

/**
 * Returns localized shell groups by id.
 */
export function createLocalizedShellGroups(localeInput: unknown): AppShellGroup[] {
  const pack = getCmsLocalePack(localeInput)
  return [
    { id: 'configuration', label: pack.navGroups.configuration },
    { id: 'content', label: pack.navGroups.content },
  ]
}

/**
 * Returns localized shell items by id.
 */
export function createLocalizedShellItems(localeInput: unknown): AppShellItem[] {
  const pack = getCmsLocalePack(localeInput)
  return [
    {
      id: 'settings',
      group: 'configuration',
      label: pack.items.settings.label,
      icon: 'settings',
      caption: pack.items.settings.caption,
      description: pack.items.settings.description,
    },
    {
      id: 'pages',
      group: 'content',
      label: pack.items.pages.label,
      icon: 'description',
      caption: pack.items.pages.caption,
      description: pack.items.pages.description,
    },
    {
      id: 'blocks',
      group: 'content',
      label: pack.items.blocks.label,
      icon: 'widgets',
      caption: pack.items.blocks.caption,
      description: pack.items.blocks.description,
    },
    {
      id: 'media',
      group: 'content',
      label: pack.items.media.label,
      icon: 'photo_library',
      caption: pack.items.media.caption,
      description: pack.items.media.description,
    },
    {
      id: 'releases',
      group: 'content',
      label: pack.items.releases.label,
      icon: 'rocket_launch',
      caption: pack.items.releases.caption,
      description: pack.items.releases.description,
    },
  ]
}

/**
 * Returns localized toolbar actions for core CMS controls.
 */
export function createLocalizedShellActions(localeInput: unknown): AppShellAction[] {
  const pack = getCmsLocalePack(localeInput)
  return [
    {
      id: 'notifications',
      icon: 'notifications',
      tooltip: pack.actions.notifications.tooltip,
      label: pack.actions.notifications.label,
      flat: true,
      dense: true,
      round: true,
      badge: 0,
    },
    {
      id: 'account',
      icon: 'account_circle',
      tooltip: pack.actions.account.tooltip,
      label: pack.actions.account.label,
      flat: true,
      dense: true,
      round: true,
    },
  ]
}

/**
 * Applies selected locale preset to copy-centric fields in current settings.
 * The function keeps tenant branding/theme values untouched.
 */
export function applyCmsLocalePreset(settings: CmsWhiteLabelSettings, localeInput: unknown): CmsLocale {
  const locale = resolveCmsLocale(localeInput)
  const pack = getCmsLocalePack(locale)
  const defaults = createLocalizedContentDefaults(locale)

  settings.content = {
    ...settings.content,
    ...defaults,
  }

  settings.layout.searchPlaceholder = pack.searchPlaceholder
  settings.layout.menuAriaLabel = pack.menuAriaLabel
  settings.layout.collapseLabel = pack.collapseLabel
  settings.layout.expandLabel = pack.expandLabel

  settings.branding.userTooltip = pack.userTooltip
  settings.branding.notificationsTooltip = pack.notificationsTooltip

  settings.navGroups = settings.navGroups.map(group => ({
    ...group,
    label: pack.navGroups[group.id] ?? group.label,
  }))

  settings.items = settings.items.map(item => {
    const localizedItem = pack.items[item.id]
    if (!localizedItem) {
      return item
    }
    return {
      ...item,
      label: localizedItem.label,
      caption: localizedItem.caption,
      description: localizedItem.description,
    }
  })

  settings.toolbarActions = settings.toolbarActions.map(action => {
    const localizedAction = pack.actions[action.id]
    if (!localizedAction) {
      return action
    }
    return {
      ...action,
      label: localizedAction.label,
      tooltip: localizedAction.tooltip,
    }
  })

  return locale
}

/**
 * Returns localized label used by tenant name prompt.
 */
export function getCmsTenantProfilePromptLabel(localeInput: unknown): string {
  const pack = getCmsLocalePack(localeInput)
  return pack.tenantProfileLabel
}