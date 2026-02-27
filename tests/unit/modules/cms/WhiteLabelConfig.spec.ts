import { describe, expect, it } from 'vitest'
import { APP_SHELL_DEFAULT_THEME } from '../../../../src/components/layout/app-shell.config'
import {
  createDefaultWhiteLabelSettings,
  mapWhiteLabelToShellSnapshot,
} from '../../../../landing-page/cms/white-label.config'

describe('white-label.config', () => {
  it('keeps theme keys aligned with AppShell default theme', () => {
    const settings = createDefaultWhiteLabelSettings()
    const settingsThemeKeys = Object.keys(settings.theme).sort()
    const shellThemeKeys = Object.keys(APP_SHELL_DEFAULT_THEME).sort()

    expect(settingsThemeKeys).toEqual(shellThemeKeys)
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

  it('normalizes legacy flat page/surface backgrounds in shell snapshot', () => {
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
})