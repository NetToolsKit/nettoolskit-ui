/**
 * Tests/unit/modules/cms/White Label Config spec module.
 */

import { describe, expect, it } from 'vitest'
import { APP_SHELL_DEFAULT_THEME } from '../../../../src/components/layout/app-shell.config'
import {
  createDefaultWhiteLabelSettings,
  mapWhiteLabelToShellSnapshot,
} from '../../../../src/modules/cms/white-label/config'

describe('white-label.config', () => {
  it('keeps theme keys aligned with AppShell default theme', () => {
    const settings = createDefaultWhiteLabelSettings()
    const settingsThemeKeys = Object.keys(settings.theme).sort()
    const shellThemeKeys = Object.keys(APP_SHELL_DEFAULT_THEME).sort()

    expect(settingsThemeKeys).toEqual(shellThemeKeys)
  })

  it('includes required CMS modules in default sidebar config', () => {
    const settings = createDefaultWhiteLabelSettings()
    const itemIds = settings.items.map(item => item.id)

    expect(itemIds).toContain('settings')
    expect(itemIds).toContain('pages')
    expect(itemIds).toContain('blocks')
    expect(itemIds).toContain('media')
    expect(itemIds).toContain('releases')
  })

  it('creates default pages with section blocks for builder integration', () => {
    const settings = createDefaultWhiteLabelSettings()
    const firstPage = settings.pages[0]
    const firstSection = firstPage?.sections[0]
    const firstBlock = firstSection?.blocks[0]

    expect(firstPage).toBeDefined()
    expect(firstSection).toBeDefined()
    expect(firstBlock).toBeDefined()
    expect(firstPage?.title).toBe('Main Landing')
    expect(firstPage?.localization?.title?.['pt-BR']).toBe('Landing Principal')
    expect(firstSection?.label).toBe('Header')
    expect(firstSection?.localization?.label?.['pt-BR']).toBe('Cabecalho')
    expect(firstBlock?.type).toContain('landing.')
    expect(firstBlock?.presetId).toBe('landing-header-product')
    expect(firstBlock?.props).toMatchObject({
      ctaText: 'Test CMS',
    })
    expect(settings.reusableSections).toEqual([])
  })

  it('maps layout and branding settings to shell snapshot', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.branding.appName = 'Tenant Alpha'
    settings.branding.notificationCount = 7
    settings.layout.searchPlaceholder = 'Search tenant modules'
    settings.layout.breakpoint = 920
    settings.layout.collapsible = false
    settings.layout.showNotifications = false
    settings.layout.showUserAvatar = false

    const snapshot = mapWhiteLabelToShellSnapshot(settings, {
      activeItem: 'invalid-item',
      searchValue: '',
    })

    expect(snapshot.shellConfig.appName).toBe('Tenant Alpha')
    expect(snapshot.shellConfig.notificationCount).toBe(7)
    expect(snapshot.shellConfig.searchPlaceholder).toBe('Search tenant modules')
    expect(snapshot.shellConfig.breakpoint).toBe(920)
    expect(snapshot.shellConfig.collapsible).toBe(false)
    expect(snapshot.shellConfig.showNotifications).toBe(false)
    expect(snapshot.shellConfig.showUserAvatar).toBe(false)
    expect(snapshot.shellConfig.activeItem).toBe(settings.items[0]?.id ?? '')
  })

  it('filters system actions when notification and account visibility are disabled', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.layout.showNotifications = false
    settings.layout.showUserAvatar = false
    settings.toolbarActions.push({
      id: 'custom-docs',
      icon: 'description',
      label: 'Docs',
    })

    const snapshot = mapWhiteLabelToShellSnapshot(settings, {
      activeItem: settings.items[0]?.id ?? '',
      searchValue: '',
    })

    const actionIds = snapshot.shellConfig.toolbarActions.map(action => action.id)
    expect(actionIds).not.toContain('notifications')
    expect(actionIds).not.toContain('account')
    expect(actionIds).toContain('custom-docs')
  })

  it('keeps filtered items and resolves active fallback by search query', () => {
    const settings = createDefaultWhiteLabelSettings()
    const query = 'settings'

    const snapshot = mapWhiteLabelToShellSnapshot(settings, {
      activeItem: settings.items[0]?.id ?? '',
      searchValue: query,
    })

    expect(snapshot.filteredItems.length).toBeGreaterThan(0)
    expect(
      snapshot.filteredItems.every(item => {
        const source = `${item.label} ${item.caption ?? ''} ${item.description ?? ''}`.toLowerCase()
        return source.includes(query)
      })
    ).toBe(true)
    expect(snapshot.shellConfig.activeItem).toBe(snapshot.filteredItems[0]?.id ?? '')
  })

  it('normalizes old flat page/surface backgrounds in shell snapshot', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.theme.pageBackground = 'var(--ntk-bg-card)'
    settings.theme.drawerBackground = 'var(--ntk-bg-card)'
    settings.theme.searchBackground = 'var(--ntk-bg-card)'

    const snapshot = mapWhiteLabelToShellSnapshot(settings, {
      activeItem: settings.items[0]?.id ?? '',
      searchValue: '',
    })

    expect(snapshot.shellConfig.theme.pageBackground).toBe('var(--ntk-bg-hover)')
    expect(snapshot.shellConfig.theme.searchBackground).toBe('var(--ntk-bg-hover)')
  })

  it('propagates typography and layout token overrides to shell snapshot theme', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.theme.fontSizeGroupCaption = '0.74rem'
    settings.theme.searchControlHeight = '40px'
    settings.theme.workspaceMaxWidth = '1440px'
    settings.theme.searchBackground = '#f5f7fb'
    settings.theme.actionHoverBackground = '#1f2937'

    const snapshot = mapWhiteLabelToShellSnapshot(settings, {
      activeItem: settings.items[0]?.id ?? '',
      searchValue: '',
    })

    expect(snapshot.shellConfig.theme.fontSizeGroupCaption).toBe('0.74rem')
    expect(snapshot.shellConfig.theme.searchControlHeight).toBe('40px')
    expect(snapshot.shellConfig.theme.workspaceMaxWidth).toBe('1440px')
    expect(snapshot.shellConfig.theme.searchBackground).toBe('#f5f7fb')
    expect(snapshot.shellConfig.theme.actionHoverBackground).toBe('#1f2937')
  })

  it('creates default governance values in white-label settings', () => {
    const settings = createDefaultWhiteLabelSettings()

    expect(settings.governance.workflow.status).toBe('draft')
    expect(settings.governance.workflow.version).toBe(1)
    expect(settings.governance.workflow.publishedVersion).toBeNull()
    expect(settings.governance.revisions.length).toBeGreaterThanOrEqual(1)
    expect(settings.releases.items).toHaveLength(0)
    expect(settings.releases.schemaVersion).toBe(4)
    expect(settings.releases.activeEnvironment).toBe('dev')
    expect(settings.releases.enforceEnvironmentPolicies).toBe(false)
    expect(settings.releases.environmentPolicies.length).toBe(3)
    expect(settings.releases.reviewAcknowledgements).toEqual([])
  })

  it('supports localized seeds with English default and optional pt-BR', () => {
    const english = createDefaultWhiteLabelSettings()
    const portuguese = createDefaultWhiteLabelSettings(undefined, 'pt-BR')

    expect(english.content.locale).toBe('en')
    expect(portuguese.content.locale).toBe('pt-BR')
    expect(portuguese.layout.searchPlaceholder).toBe('Buscar modulo')
    expect(portuguese.items.find(item => item.id === 'settings')?.label).toBe('Configuracoes')
  })
})