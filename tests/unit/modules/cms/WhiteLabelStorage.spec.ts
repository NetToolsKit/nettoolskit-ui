/**
 * Tests/unit/modules/cms/White Label Storage spec module.
 */

import { beforeEach, describe, expect, it } from 'vitest'
import {
  loadCmsWhiteLabelSettings,
  normalizeCmsWhiteLabelSettings,
  saveCmsWhiteLabelSettings,
} from '../../../../src/modules/cms/white-label/storage'
import {
  CMS_WHITE_LABEL_STORAGE_KEY,
  createDefaultWhiteLabelSettings,
} from '../../../../src/modules/cms/white-label/config'

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

  it('fills new layout fields from defaults when loading compatibility payloads', () => {
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
    expect(normalized.governance.workflow.status).toBe(defaults.governance.workflow.status)
    expect(normalized.governance.workflow.version).toBe(defaults.governance.workflow.version)
  })

  it('decouples compatibility semantic badge expression from notification error token', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      theme: {
        notificationErrorColor: '#123456',
        notificationBadgeColor: 'var(--semantic-error, #ef4444)',
      },
    })

    expect(normalized.theme.notificationErrorColor).toBe('#123456')
    expect(normalized.theme.notificationBadgeColor).toBe('#123456')
  })

  it('migrates old page/search backgrounds to secondary contrast tokens', () => {
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

  it('migrates old flat card/page token combination to secondary page background', () => {
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

  it('keeps action hover and search backgrounds independent when both are explicitly set', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      theme: {
        pageBackground: '#f4f1ec',
        searchBackground: '#ffffff',
        actionHoverBackground: '#1f2937',
      },
    })

    expect(normalized.theme.pageBackground).toBe('#f4f1ec')
    expect(normalized.theme.searchBackground).toBe('#ffffff')
    expect(normalized.theme.actionHoverBackground).toBe('#1f2937')
  })

  it('normalizes legacy ntk text tokens to readable colors for active dark preset themes', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      themePresetId: 'dark',
      theme: {
        headerBackground: '#0f172a',
        drawerBackground: '#1e293b',
        searchBackground: '#1e293b',
        pageBackground: '#334155',
        titleAppColor: 'var(--ntk-text-primary)',
        drawerTextColor: 'var(--ntk-text-secondary)',
        itemTextColor: 'var(--ntk-text-primary)',
        itemIconColor: 'var(--ntk-text-primary)',
        searchTextColor: 'var(--ntk-text-primary)',
        pageTextColor: 'var(--ntk-text-primary)',
      },
    })

    expect(normalized.theme.titleAppColor).toBe('#f1f5f9')
    expect(normalized.theme.drawerTextColor).toBe('#cbd5e1')
    expect(normalized.theme.itemTextColor).toBe('#cbd5e1')
    expect(normalized.theme.itemIconColor).toBe('#cbd5e1')
    expect(normalized.theme.searchTextColor).toBe('#f1f5f9')
    expect(normalized.theme.pageTextColor).toBe('#f1f5f9')
  })

  it('normalizes dark preset overrides that still use legacy runtime token expressions', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      themePresetOverrides: {
        dark: {
          titleAppColor: 'var(--ntk-text-primary)',
          itemTextColor: 'var(--ntk-text-primary)',
          itemIconColor: 'var(--ntk-text-primary)',
        },
      },
    })

    expect(normalized.themePresetOverrides.dark?.titleAppColor).toBe('#f1f5f9')
    expect(normalized.themePresetOverrides.dark?.itemTextColor).toBe('#cbd5e1')
    expect(normalized.themePresetOverrides.dark?.itemIconColor).toBe('#cbd5e1')
  })

  it('removes deprecated modules and restores required CMS core items', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      navGroups: [
        { id: 'core', label: 'Core' },
        { id: 'content', label: 'Content' },
        { id: 'configuration', label: 'Configuration' },
        { id: 'custom', label: 'Custom' },
      ],
      items: [
        { id: 'dashboard', group: 'core', label: 'Dashboard', icon: 'space_dashboard' },
        { id: 'users', group: 'core', label: 'Users', icon: 'group' },
        { id: 'settings', group: 'configuration', label: 'Settings', icon: 'settings' },
        { id: 'tenant-report', group: 'custom', label: 'Tenant report', icon: 'analytics' },
      ],
    })

    expect(normalized.items.some(item => item.id === 'dashboard')).toBe(false)
    expect(normalized.items.some(item => item.id === 'users')).toBe(false)
    expect(normalized.items.some(item => item.id === 'settings')).toBe(true)
    expect(normalized.items.some(item => item.id === 'pages')).toBe(true)
    expect(normalized.items.some(item => item.id === 'blocks')).toBe(true)
    expect(normalized.items.some(item => item.id === 'media')).toBe(true)
    expect(normalized.items.some(item => item.id === 'tenant-report')).toBe(true)
    expect(normalized.navGroups.some(group => group.id === 'core')).toBe(false)
    expect(normalized.navGroups.some(group => group.id === 'content')).toBe(true)
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
    expect(normalized.pages[0]?.sections[0]?.blocks.length).toBeGreaterThan(0)
    expect(normalized.pages[0]?.sections[0]?.blocks[0]?.id).toBe('page-1-section-1-block-1')
    expect(normalized.pages[0]?.sections[0]?.blocks[0]?.type).toBe('landing.hero')
  })

  it('normalizes section block props and keeps valid object payloads', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      pages: [
        {
          id: 'landing',
          title: 'Landing',
          path: '/',
          status: 'draft',
          description: '',
          sections: [
            {
              id: 'hero',
              label: 'Hero',
              enabled: true,
              blocks: [
                {
                  id: 'hero-main',
                  type: 'landing.hero',
                  enabled: true,
                  props: {
                    title: 'Tenant Hero',
                    subtitle: 'Tenant subtitle',
                  },
                },
                {
                  id: '',
                  type: '',
                  enabled: false,
                  props: 'invalid',
                },
              ],
            },
          ],
        },
      ],
    } as unknown as Parameters<typeof normalizeCmsWhiteLabelSettings>[0])

    expect(normalized.pages[0]?.sections[0]?.blocks[0]?.id).toBe('hero-main')
    expect(normalized.pages[0]?.sections[0]?.blocks[0]?.type).toBe('landing.hero')
    expect(normalized.pages[0]?.sections[0]?.blocks[0]?.props).toEqual({
      title: 'Tenant Hero',
      subtitle: 'Tenant subtitle',
    })
    expect(normalized.pages[0]?.sections[0]?.blocks[1]?.id).toBe('hero-block-2')
    expect(normalized.pages[0]?.sections[0]?.blocks[1]?.type).toBe('landing.hero')
    expect(normalized.pages[0]?.sections[0]?.blocks[1]?.props).toEqual({})
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

  it('stores versioned payload and ignores unsupported future versions', () => {
    const settings = createDefaultWhiteLabelSettings()
    saveCmsWhiteLabelSettings(settings)

    const persisted = JSON.parse(window.localStorage.getItem(CMS_WHITE_LABEL_STORAGE_KEY) ?? '{}') as Record<string, unknown>
    expect(persisted.version).toBe(2)
    expect(persisted.settings && typeof persisted.settings === 'object').toBe(true)

    window.localStorage.setItem(CMS_WHITE_LABEL_STORAGE_KEY, JSON.stringify({
      version: 99,
      settings,
    }))

    const loaded = loadCmsWhiteLabelSettings()
    expect(loaded.branding.appName).toBe(createDefaultWhiteLabelSettings().branding.appName)
    expect(loaded.governance.workflow.version).toBe(1)
  })

  it('normalizes malformed governance payload into safe values', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      governance: {
        workflow: {
          status: 'invalid-status',
          version: -1,
          publishedVersion: 999,
          lastActionAt: '',
          lastActionBy: '',
          lastActionRole: 'invalid-role',
        } as never,
        revisions: [],
        auditTrail: [],
        maxAuditEntries: 0,
      },
    })

    expect(normalized.governance.workflow.status).toBe('draft')
    expect(normalized.governance.workflow.version).toBe(1)
    expect(normalized.governance.workflow.publishedVersion).toBeNull()
    expect(normalized.governance.revisions.length).toBeGreaterThanOrEqual(1)
    expect(normalized.governance.maxAuditEntries).toBeGreaterThanOrEqual(20)
  })
})