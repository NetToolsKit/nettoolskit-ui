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
import type { CmsPersistenceStore } from '../../../../src/modules/cms/white-label/providers'

/**
 * Creates an isolated in-memory persistence store for engine contract tests.
 */
function createMemoryStore(): CmsPersistenceStore {
  const storage = new Map<string, string>()
  return {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => {
      storage.set(key, String(value))
    },
    removeItem: (key: string) => {
      storage.delete(key)
    },
  }
}

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

  it('normalizes locale compatibility values to supported cms locales', () => {
    type ContentSettings = ReturnType<typeof createDefaultWhiteLabelSettings>['content']

    const normalizedPt = normalizeCmsWhiteLabelSettings({
      content: {
        locale: 'pt',
      } as Partial<ContentSettings>,
    })
    const normalizedFallback = normalizeCmsWhiteLabelSettings({
      content: {
        locale: 'es',
      } as Partial<ContentSettings>,
    })

    expect(normalizedPt.content.locale).toBe('pt-BR')
    expect(normalizedFallback.content.locale).toBe('en')
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

  it('normalizes dark landing preset overrides that still use legacy runtime token expressions', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      themePresetOverrides: {
        darkLanding: {
          titleAppColor: 'var(--ntk-text-primary)',
          itemTextColor: 'var(--ntk-text-primary)',
          itemIconColor: 'var(--ntk-text-primary)',
        },
      },
    })

    expect(normalized.themePresetOverrides.darkLanding?.titleAppColor).toBe('#c9d1d9')
    expect(normalized.themePresetOverrides.darkLanding?.itemTextColor).toBe('#c9d1d9')
    expect(normalized.themePresetOverrides.darkLanding?.itemIconColor).toBe('#8b949e')
  })

  it('normalizes legacy ntk text tokens for active dark landing preset themes', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      themePresetId: 'darkLanding',
      theme: {
        headerBackground: '#010409',
        drawerBackground: '#0d1117',
        searchBackground: '#161b22',
        pageBackground: '#0d1117',
        titleAppColor: 'var(--ntk-text-primary)',
        drawerTextColor: 'var(--ntk-text-secondary)',
        itemTextColor: 'var(--ntk-text-primary)',
        itemIconColor: 'var(--ntk-text-primary)',
        searchTextColor: 'var(--ntk-text-primary)',
        pageTextColor: 'var(--ntk-text-primary)',
      },
    })

    expect(normalized.theme.titleAppColor).toBe('#c9d1d9')
    expect(normalized.theme.drawerTextColor).toBe('#c9d1d9')
    expect(normalized.theme.itemTextColor).toBe('#c9d1d9')
    expect(normalized.theme.itemIconColor).toBe('#8b949e')
    expect(normalized.theme.searchTextColor).toBe('#c9d1d9')
    expect(normalized.theme.pageTextColor).toBe('#c9d1d9')
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
    expect(normalized.items.some(item => item.id === 'releases')).toBe(true)
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
    expect(normalized.pages[0]?.sections[0]?.blocks[0]?.presetId).toBe('custom')
  })

  it('normalizes page custom fields against authored content-model schemas during load', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      authoredContentModels: [
        {
          id: 'authored-model:campaign',
          name: 'Campaign schema',
          description: 'Schema-driven campaign page',
          allowedPresets: ['hero', 'footer'],
          requiredPresets: ['hero'],
          fields: [
            {
              id: 'campaignHeadline',
              type: 'text',
              label: 'Campaign headline',
              description: 'Required headline',
              placeholder: 'Headline',
              required: true,
              defaultValue: 'Launch campaign',
            },
            {
              id: 'showBanner',
              type: 'toggle',
              label: 'Show banner',
              description: 'Toggle the banner',
              placeholder: '',
              required: false,
              defaultValue: 'true',
            },
            {
              id: 'bulletPoints',
              type: 'text',
              label: 'Bullet points',
              description: 'One bullet per line',
              placeholder: 'One bullet per line',
              required: false,
              repeatable: true,
              min: 2,
              max: 4,
              defaultValue: ['Launch faster', 'Ship safely'],
              localization: {
                label: {
                  'pt-BR': 'Pontos principais',
                },
                description: {
                  'pt-BR': 'Um ponto por linha',
                },
                placeholder: {
                  'pt-BR': 'Um ponto por linha',
                },
              },
            },
          ],
        },
      ],
      pages: [
        {
          id: 'campaign',
          contentModelId: 'authored-model:campaign',
          title: 'Campaign',
          path: '/campaign',
          status: 'draft',
          description: '',
          customFields: {
            campaignheadline: 'Custom launch',
            showbanner: 'false',
            bulletpoints: ['Reliable', '', 'Fast'],
            rogue: 'discard me',
          },
          sections: [],
        },
      ],
    } as unknown as Parameters<typeof normalizeCmsWhiteLabelSettings>[0])

    expect(normalized.pages[0]?.customFields).toEqual({
      campaignheadline: 'Custom launch',
      showbanner: false,
      bulletpoints: ['Reliable', 'Fast'],
    })
    expect(normalized.authoredContentModels[0]?.fields?.[2]).toEqual(expect.objectContaining({
      id: 'bulletpoints',
      repeatable: true,
      min: 2,
      max: 4,
      defaultValue: ['Launch faster', 'Ship safely'],
      localization: {
        label: { 'pt-BR': 'Pontos principais' },
        description: { 'pt-BR': 'Um ponto por linha' },
        placeholder: { 'pt-BR': 'Um ponto por linha' },
      },
    }))
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
    expect(normalized.pages[0]?.sections[0]?.blocks[0]?.presetId).toBe('custom')
    expect(normalized.pages[0]?.sections[0]?.blocks[0]?.props).toEqual({
      title: 'Tenant Hero',
      subtitle: 'Tenant subtitle',
    })
    expect(normalized.pages[0]?.sections[0]?.blocks[1]?.id).toBe('hero-block-2')
    expect(normalized.pages[0]?.sections[0]?.blocks[1]?.type).toBe('landing.hero')
    expect(normalized.pages[0]?.sections[0]?.blocks[1]?.presetId).toBe('custom')
    expect(normalized.pages[0]?.sections[0]?.blocks[1]?.props).toEqual({})
  })

  it('preserves authored localized content payloads for pages sections and blocks', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      pages: [
        {
          id: 'landing',
          title: 'Landing',
          path: '/',
          status: 'draft',
          description: 'English description',
          localization: {
            title: {
              en: 'Landing',
              'pt-BR': 'Pagina Inicial',
            },
            description: {
              en: 'English description',
              'pt-BR': 'Descricao em portugues',
            },
          },
          sections: [
            {
              id: 'hero',
              label: 'Hero',
              enabled: true,
              localization: {
                label: {
                  en: 'Hero',
                  'pt-BR': 'Destaque',
                },
              },
              blocks: [
                {
                  id: 'hero-main',
                  type: 'landing.hero',
                  enabled: true,
                  props: {
                    title: 'English hero',
                  },
                  localization: {
                    props: {
                      'pt-BR': {
                        title: 'Heroi em portugues',
                      },
                    },
                  },
                },
              ],
            },
          ],
        },
      ],
    } as unknown as Parameters<typeof normalizeCmsWhiteLabelSettings>[0])

    expect(normalized.pages[0]?.localization?.title?.['pt-BR']).toBe('Pagina Inicial')
    expect(normalized.pages[0]?.localization?.description?.['pt-BR']).toBe('Descricao em portugues')
    expect(normalized.pages[0]?.sections[0]?.localization?.label?.['pt-BR']).toBe('Destaque')
    expect(normalized.pages[0]?.sections[0]?.blocks[0]?.localization?.props?.['pt-BR']).toEqual({
      title: 'Heroi em portugues',
    })
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

  it('supports custom persistence stores without touching browser localStorage', () => {
    const store = createMemoryStore()
    const settings = createDefaultWhiteLabelSettings()
    settings.branding.appName = 'Provider Tenant'
    settings.layout.defaultMini = true

    saveCmsWhiteLabelSettings(settings, { store })
    const loaded = loadCmsWhiteLabelSettings({ store })

    expect(loaded.branding.appName).toBe('Provider Tenant')
    expect(loaded.layout.defaultMini).toBe(true)
    expect(window.localStorage.getItem(CMS_WHITE_LABEL_STORAGE_KEY)).toBeNull()
  })

  it('stores versioned payload and ignores unsupported future versions', () => {
    const settings = createDefaultWhiteLabelSettings()
    saveCmsWhiteLabelSettings(settings)

    const persisted = JSON.parse(window.localStorage.getItem(CMS_WHITE_LABEL_STORAGE_KEY) ?? '{}') as Record<string, unknown>
    expect(persisted.version).toBe(10)
    expect(persisted.settings && typeof persisted.settings === 'object').toBe(true)

    window.localStorage.setItem(CMS_WHITE_LABEL_STORAGE_KEY, JSON.stringify({
      version: 99,
      settings,
    }))

    const loaded = loadCmsWhiteLabelSettings()
    expect(loaded.branding.appName).toBe(createDefaultWhiteLabelSettings().branding.appName)
    expect(loaded.governance.workflow.version).toBe(1)
  })

  it('persists localized authored page content through storage roundtrip', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.pages[0]!.localization = {
      title: {
        en: 'Main Landing',
        'pt-BR': 'Landing Principal',
      },
    }
    settings.pages[0]!.sections[0]!.localization = {
      label: {
        en: 'Hero',
        'pt-BR': 'Destaque',
      },
    }
    settings.pages[0]!.sections[0]!.blocks[0]!.localization = {
      props: {
        'pt-BR': {
          title: 'Construa interfaces consistentes',
        },
      },
    }

    saveCmsWhiteLabelSettings(settings)
    const loaded = loadCmsWhiteLabelSettings()

    expect(loaded.pages[0]?.localization?.title?.['pt-BR']).toBe('Landing Principal')
    expect(loaded.pages[0]?.sections[0]?.localization?.label?.['pt-BR']).toBe('Destaque')
    expect(loaded.pages[0]?.sections[0]?.blocks[0]?.localization?.props?.['pt-BR']).toEqual({
      title: 'Construa interfaces consistentes',
    })
    expect(loaded.pages[0]?.sections[0]?.blocks[0]?.presetId).toBe('landing-header-product')
  })

  it('normalizes and preserves authored content-model required presets through storage', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      authoredContentModels: [
        {
          id: 'authored-model:campaign',
          name: 'Campaign schema',
          description: 'Hero and footer are mandatory',
          allowedPresets: ['hero', 'features', 'footer'],
          requiredPresets: ['hero', 'footer', 'metrics'],
          starterPresets: ['features', 'footer', 'metrics'],
        recommendedPresets: ['hero'],
        maxSections: 1,
        sectionPresetLimits: {
          hero: 1,
          footer: 1,
          metrics: 2,
        },
        defaultPageTitle: '',
        defaultPageDescription: ' Campaign content model ',
        defaultPagePathPrefix: 'campaign schema',
      },
      ],
    } as unknown as Parameters<typeof normalizeCmsWhiteLabelSettings>[0])

    expect(normalized.authoredContentModels[0]?.requiredPresets).toEqual(['hero', 'footer'])
    expect(normalized.authoredContentModels[0]?.starterPresets).toEqual(['features', 'footer'])
    expect(normalized.authoredContentModels[0]?.maxSections).toBe(2)
    expect(normalized.authoredContentModels[0]?.sectionPresetLimits).toEqual({
      hero: 1,
      footer: 1,
    })
    expect(normalized.authoredContentModels[0]?.defaultPageTitle).toBe('Campaign schema')
    expect(normalized.authoredContentModels[0]?.defaultPageDescription).toBe('Campaign content model')
    expect(normalized.authoredContentModels[0]?.defaultPagePathPrefix).toBe('/campaign-schema')
  })

  it('persists authored content-model starter scaffolds through storage roundtrip', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.authoredContentModels = [
      {
        id: 'authored-model:campaign',
        name: 'Campaign schema',
        description: 'Author-defined starter scaffold',
        allowedPresets: ['hero', 'features', 'footer'],
        requiredPresets: ['footer'],
        starterPresets: ['features', 'footer'],
        recommendedPresets: ['hero'],
        maxSections: 3,
        sectionPresetLimits: {
          hero: 1,
          footer: 1,
        },
        defaultPageTitle: 'Campaign default page',
        defaultPageDescription: 'Campaign default description.',
        defaultPagePathPrefix: '/campaign-default',
      },
    ]

    saveCmsWhiteLabelSettings(settings)
    const loaded = loadCmsWhiteLabelSettings()

    expect(loaded.authoredContentModels[0]?.requiredPresets).toEqual(['footer'])
    expect(loaded.authoredContentModels[0]?.starterPresets).toEqual(['features', 'footer'])
    expect(loaded.authoredContentModels[0]?.maxSections).toBe(3)
    expect(loaded.authoredContentModels[0]?.sectionPresetLimits).toEqual({
      hero: 1,
      footer: 1,
    })
    expect(loaded.authoredContentModels[0]?.defaultPageTitle).toBe('Campaign default page')
    expect(loaded.authoredContentModels[0]?.defaultPageDescription).toBe('Campaign default description.')
    expect(loaded.authoredContentModels[0]?.defaultPagePathPrefix).toBe('/campaign-default')
  })

  it('persists content-model schema metadata and normalizes page-applied schema versions', () => {
    const settings = createDefaultWhiteLabelSettings()
    settings.authoredContentModels = [
      {
        id: 'authored-model:campaign',
        name: 'Campaign schema',
        description: 'Versioned content model',
        schemaVersion: 3,
        migrationNotes: 'Added CTA contract',
        lastSchemaChangeAt: '2026-03-08T10:15:00.000Z',
        allowedPresets: ['hero', 'footer'],
        requiredPresets: ['hero'],
        starterPresets: ['hero', 'footer'],
        recommendedPresets: ['hero'],
        maxSections: 2,
        sectionPresetLimits: {
          hero: 1,
        },
        defaultPageTitle: 'Campaign default page',
        defaultPageDescription: 'Campaign default description.',
        defaultPagePathPrefix: '/campaign-default',
      },
    ]
    settings.pages = [
      {
        id: 'campaign-page',
        contentModelId: 'authored-model:campaign',
        title: 'Campaign page',
        path: '/campaign',
        status: 'draft',
        description: 'Uses authored content model',
        sections: [],
      },
      {
        id: 'invalid-version-page',
        contentModelId: 'authored-model:campaign',
        contentModelVersion: 0,
        title: 'Invalid version page',
        path: '/campaign-invalid',
        status: 'draft',
        description: 'Invalid version fallback',
        sections: [],
      },
    ]

    saveCmsWhiteLabelSettings(settings)
    const loaded = loadCmsWhiteLabelSettings()

    expect(loaded.authoredContentModels[0]).toMatchObject({
      schemaVersion: 3,
      migrationNotes: 'Added CTA contract',
      lastSchemaChangeAt: '2026-03-08T10:15:00.000Z',
    })
    expect(loaded.pages[0]?.contentModelVersion).toBe(3)
    expect(loaded.pages[1]?.contentModelVersion).toBe(3)
  })

  it('normalizes malformed schema metadata on authored content models', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      authoredContentModels: [
        {
          id: 'authored-model:campaign',
          name: 'Campaign schema',
          description: 'Versioned content model',
          schemaVersion: -5,
          migrationNotes: ' Added CTA contract ',
          lastSchemaChangeAt: 'not-a-date',
          allowedPresets: ['hero', 'footer'],
          requiredPresets: ['hero'],
          starterPresets: ['hero', 'footer'],
        },
      ],
    } as unknown as Parameters<typeof normalizeCmsWhiteLabelSettings>[0])

    expect(normalized.authoredContentModels[0]).toMatchObject({
      schemaVersion: 1,
      migrationNotes: 'Added CTA contract',
      lastSchemaChangeAt: null,
    })
  })

  it('normalizes malformed reusable block payloads and keeps valid authored entries', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      reusableBlocks: [
        null,
        {
          id: '',
          name: '',
          type: '',
          category: '',
          props: 'invalid',
        },
        {
          id: 'hero-reusable',
          name: 'Hero reusable',
          description: 'Saved from builder',
          type: 'landing.hero',
          category: 'layout',
          props: {
            title: 'Reusable hero',
          },
        },
      ],
    } as unknown as Parameters<typeof normalizeCmsWhiteLabelSettings>[0])

    expect(normalized.reusableBlocks[0]?.id).toBe('reusable-block-2')
    expect(normalized.reusableBlocks[0]?.type).toBe('landing.hero')
    expect(normalized.reusableBlocks[0]?.presetId).toBe('custom')
    expect(normalized.reusableBlocks[0]?.props).toEqual({})
    expect(normalized.reusableBlocks[1]?.id).toBe('hero-reusable')
    expect(normalized.reusableBlocks[1]?.presetId).toBe('custom')
    expect(normalized.reusableBlocks[1]?.props).toEqual({ title: 'Reusable hero' })
  })

  it('normalizes malformed reusable section payloads and keeps valid authored entries', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      reusableSections: [
        null,
        {
          id: '',
          name: '',
          category: '',
          contentModelId: 'invalid',
          presetId: 'invalid',
          label: '',
          enabled: 'invalid',
          blocks: 'invalid',
        },
        {
          id: 'hero-section',
          name: 'Hero Section',
          description: 'Saved from pages builder',
          category: 'hero',
          contentModelId: 'landing-page',
          presetId: 'hero',
          label: 'Hero',
          enabled: true,
          blocks: [
            {
              id: 'hero-section-block-1',
              type: 'landing.hero',
              enabled: true,
              props: {
                title: 'Reusable hero section',
              },
            },
          ],
        },
      ],
    } as unknown as Parameters<typeof normalizeCmsWhiteLabelSettings>[0])

    expect(normalized.reusableSections[0]?.id).toBe('reusable-section-2')
    expect(normalized.reusableSections[0]?.presetId).toBe('custom')
    expect(normalized.reusableSections[0]?.blocks[0]?.type).toBe('landing.hero')
    expect(normalized.reusableSections[0]?.blocks[0]?.presetId).toBe('custom')
    expect(normalized.reusableSections[1]?.id).toBe('hero-section')
    expect(normalized.reusableSections[1]?.blocks[0]?.presetId).toBe('custom')
    expect(normalized.reusableSections[1]?.blocks[0]?.props).toEqual({ title: 'Reusable hero section' })
  })

  it('creates branding-aware media defaults and keeps valid media library entries', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      branding: {
        brandLogo: '/assets/tenant-logo.svg',
        faviconUrl: '/assets/tenant-favicon.svg',
        userAvatar: '/assets/tenant-avatar.png',
      } as never,
      mediaAssets: [
        null,
        {
          id: '',
          name: '',
          kind: 'invalid-kind',
          url: 42,
          alt: {},
          tags: 'branding',
          usage: ['branding.custom'],
        },
        {
          id: 'tenant-hero-image',
          name: 'Tenant Hero',
          description: 'Used in landing hero blocks',
          kind: 'image',
          url: '/assets/hero.webp',
          alt: 'Hero preview',
          tags: ['landing', 'hero'],
          usage: ['content.hero'],
        },
      ],
    } as unknown as Parameters<typeof normalizeCmsWhiteLabelSettings>[0])

    expect(normalized.mediaAssets[0]?.id).toBe('media-asset-2')
    expect(normalized.mediaAssets[0]?.kind).toBe('other')
    expect(normalized.mediaAssets[0]?.url).toBe('42')
    expect(normalized.mediaAssets[0]?.tags).toEqual([])
    expect(normalized.mediaAssets[1]?.id).toBe('tenant-hero-image')
    expect(normalized.mediaAssets[1]?.usage).toEqual(['content.hero'])

    const defaultsOnly = normalizeCmsWhiteLabelSettings({
      branding: {
        brandLogo: '/assets/brand.svg',
        faviconUrl: '/assets/favicon.svg',
        userAvatar: '/assets/avatar.png',
      } as never,
      mediaAssets: undefined,
    })

    expect(defaultsOnly.mediaAssets[0]?.url).toBe('/assets/brand.svg')
    expect(defaultsOnly.mediaAssets[1]?.url).toBe('/assets/favicon.svg')
    expect(defaultsOnly.mediaAssets[2]?.url).toBe('/assets/avatar.png')
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

  it('normalizes malformed release payload into safe values', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      releases: {
        schemaVersion: 1,
        maxEntries: -1,
        activeReleaseId: 'missing',
        activeEnvironment: 'invalid-env',
        environmentPolicies: [],
        promotions: [],
        items: [
          {
            id: '',
            name: '',
            summary: '',
            status: 'invalid-status',
            sourceVersion: -8,
            sourceWorkflowStatus: 'invalid',
            createdAt: '',
            createdBy: '',
            updatedAt: '',
            updatedBy: '',
            scheduledAt: 'not-a-date',
            publishedAt: 'not-a-date',
            rolledBackAt: 'not-a-date',
            rollbackTargetReleaseId: '',
          },
        ],
      } as never,
    })

    expect(normalized.releases.schemaVersion).toBe(4)
    expect(normalized.releases.maxEntries).toBeGreaterThan(0)
    expect(normalized.releases.activeEnvironment).toBe('dev')
    expect(normalized.releases.enforceEnvironmentPolicies).toBe(false)
    expect(normalized.releases.environmentPolicies.length).toBe(3)
    expect(normalized.releases.reviewPackages).toEqual([])
    expect(normalized.releases.reviewAcknowledgements).toEqual([])
    expect(normalized.releases.items[0]?.id).toBe('rel-legacy-1')
    expect(normalized.releases.items[0]?.status).toBe('draft')
    expect(normalized.releases.items[0]?.sourceVersion).toBe(1)
    expect(normalized.releases.items[0]?.sourceWorkflowStatus).toBe('draft')
  })

  it('normalizes authored schema-field preset payloads and preserves them in settings', () => {
    const normalized = normalizeCmsWhiteLabelSettings({
      authoredContentModelFieldPresets: [
        {
          id: 'campaign-headline',
          name: 'Campaign headline',
          description: 'Reusable field preset',
          category: 'Campaign',
          field: {
            id: 'campaignHeadline',
            type: 'text',
            label: 'Campaign headline',
            description: 'Primary campaign title',
            placeholder: 'Type the headline',
            group: 'Campaign',
            order: 2,
            required: true,
          },
        },
      ] as never,
    })

    expect(normalized.authoredContentModelFieldPresets).toHaveLength(1)
    expect(normalized.authoredContentModelFieldPresets[0]?.id).toBe('field-preset:campaign-headline')
    expect(normalized.authoredContentModelFieldPresets[0]?.field.id).toBe('campaignheadline')
    expect(normalized.authoredContentModelFieldPresets[0]?.field.order).toBe(2)
  })
})