import { beforeEach, describe, expect, it } from 'vitest'
import {
  loadCmsWhiteLabelSettings,
  normalizeCmsWhiteLabelSettings,
  saveCmsWhiteLabelSettings,
} from '../../../../landing-page/cms/white-label.storage'
import {
  CMS_WHITE_LABEL_STORAGE_KEY,
  createDefaultWhiteLabelSettings,
} from '../../../../landing-page/cms/white-label.config'

describe('white-label.storage', () => {
  beforeEach(() => {
    const storage = new Map<string, string>()
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, String(value))
        },
        removeItem: (key: string) => {
          storage.delete(key)
        },
      },
    })
    window.localStorage.removeItem(CMS_WHITE_LABEL_STORAGE_KEY)
  })

  it('fills new layout fields from defaults when loading legacy payloads', () => {
    const defaults = createDefaultWhiteLabelSettings()
    const normalized = normalizeCmsWhiteLabelSettings({
      layout: {
        showSearch: false,
      } as Partial<typeof defaults.layout>,
    })

    expect(normalized.layout.showSearch).toBe(false)
    expect(normalized.layout.showNotifications).toBe(defaults.layout.showNotifications)
    expect(normalized.layout.showUserAvatar).toBe(defaults.layout.showUserAvatar)
    expect(normalized.layout.collapsible).toBe(defaults.layout.collapsible)
    expect(normalized.layout.breakpoint).toBe(defaults.layout.breakpoint)
  })

  it('decouples legacy semantic badge expression from notification error token', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      theme: {
        notificationErrorColor: '#123456',
        notificationBadgeColor: 'var(--semantic-error, #ef4444)',
      },
    })

    expect(normalized.theme.notificationErrorColor).toBe('#123456')
    expect(normalized.theme.notificationBadgeColor).toBe('#123456')
  })

  it('migrates legacy page/search backgrounds to secondary contrast tokens', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      theme: {
        pageBackground: 'var(--ntk-bg-primary)',
        drawerBackground: 'var(--ntk-bg-card)',
        searchBackground: 'var(--ntk-bg-card)',
      },
    })

    expect(normalized.theme.pageBackground).toBe('var(--ntk-bg-hover)')
    expect(normalized.theme.searchBackground).toBe('var(--ntk-bg-hover)')
  })

  it('migrates legacy flat card/page token combination to secondary page background', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      theme: {
        pageBackground: 'var(--ntk-bg-card)',
        drawerBackground: 'var(--ntk-bg-card)',
        searchBackground: 'var(--ntk-bg-card)',
      },
    })

    expect(normalized.theme.pageBackground).toBe('var(--ntk-bg-hover)')
    expect(normalized.theme.searchBackground).toBe('var(--ntk-bg-hover)')
  })

  it('removes legacy CMS sidebar modules while keeping settings and custom modules', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      navGroups: [
        { id: 'core', label: 'Core' },
        { id: 'content', label: 'Content' },
        { id: 'configuration', label: 'Configuration' },
        { id: 'custom', label: 'Custom' },
      ],
      items: [
        { id: 'dashboard', group: 'core', label: 'Dashboard', icon: 'space_dashboard' },
        { id: 'pages', group: 'content', label: 'Pages', icon: 'description' },
        { id: 'settings', group: 'configuration', label: 'Settings', icon: 'settings' },
        { id: 'tenant-report', group: 'custom', label: 'Tenant report', icon: 'analytics' },
      ],
    })

    expect(normalized.items.some(item => item.id === 'dashboard')).toBe(false)
    expect(normalized.items.some(item => item.id === 'pages')).toBe(false)
    expect(normalized.items.some(item => item.id === 'settings')).toBe(true)
    expect(normalized.items.some(item => item.id === 'tenant-report')).toBe(true)
    expect(normalized.navGroups.some(group => group.id === 'core')).toBe(false)
    expect(normalized.navGroups.some(group => group.id === 'content')).toBe(false)
    expect(normalized.navGroups.some(group => group.id === 'configuration')).toBe(true)
    expect(normalized.navGroups.some(group => group.id === 'custom')).toBe(true)
  })

  it('normalizes malformed pages payload into safe defaults', () => {
    const malformedPayload = {
      pages: [
        {
          id: '',
          title: '',
          path: '',
          status: 'invalid-status',
          description: '',
          sections: [
            {
              id: '',
              label: '',
              enabled: true,
            },
          ],
        },
      ],
    } as unknown as Parameters<typeof normalizeCmsWhiteLabelSettings>[0]
    const normalized = normalizeCmsWhiteLabelSettings(malformedPayload)

    expect(normalized.pages[0]?.id).toBe('page-1')
    expect(normalized.pages[0]?.path).toBe('/page-1')
    expect(normalized.pages[0]?.title).toBe('Page 1')
    expect(normalized.pages[0]?.status).toBe('draft')
    expect(normalized.pages[0]?.sections[0]?.id).toBe('page-1-section-1')
    expect(normalized.pages[0]?.sections[0]?.label).toBe('Section 1')
  })

  it('persists and loads white-label settings with layout toggles', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.layout.breakpoint = 812
    settings.layout.showNotifications = false
    settings.layout.showUserAvatar = false
    settings.layout.collapsible = false

    saveCmsWhiteLabelSettings(settings)
    const loaded = loadCmsWhiteLabelSettings()

    expect(loaded.layout.breakpoint).toBe(812)
    expect(loaded.layout.showNotifications).toBe(false)
    expect(loaded.layout.showUserAvatar).toBe(false)
    expect(loaded.layout.collapsible).toBe(false)
  })
})