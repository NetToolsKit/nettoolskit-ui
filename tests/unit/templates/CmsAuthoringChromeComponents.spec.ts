import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import CmsWorkspaceTabs from '../../../src/templates/features/cms/authoring/CmsWorkspaceTabs.vue'
import CmsShellCard from '../../../src/templates/features/cms/authoring/CmsShellCard.vue'
import CmsAuthoringToolbar from '../../../src/templates/features/cms/authoring/CmsAuthoringToolbar.vue'
import CmsAuthoringStatusBar from '../../../src/templates/features/cms/authoring/CmsAuthoringStatusBar.vue'
import CmsDiagnosticsListSection from '../../../src/templates/features/cms/authoring/CmsDiagnosticsListSection.vue'
import CmsSectionHeaderSummary from '../../../src/templates/features/cms/authoring/CmsSectionHeaderSummary.vue'
import CmsStatusMetricCardGrid from '../../../src/templates/features/cms/authoring/CmsStatusMetricCardGrid.vue'
import CmsPanelListSection from '../../../src/templates/features/cms/authoring/CmsPanelListSection.vue'
import CmsAuthoringWorkbench from '../../../src/templates/features/cms/authoring/CmsAuthoringWorkbench.vue'
import CmsAuthoringRulerBar from '../../../src/templates/features/cms/authoring/CmsAuthoringRulerBar.vue'
import CmsPreviewToolbar from '../../../src/templates/features/cms/authoring/CmsPreviewToolbar.vue'
import CmsPagesPreviewSurface from '../../../src/templates/features/cms/authoring/modules/CmsPagesPreviewSurface.vue'
import CmsEntityUsageDrawer from '../../../src/templates/features/cms/authoring/CmsEntityUsageDrawer.vue'

const globalOpts = {
  global: {
    renderStubDefaultSlot: true,
    stubs: {
      'q-card': { template: '<div><slot /></div>' },
      'q-card-section': { template: '<div><slot /></div>' },
      'q-separator': true,
    },
  },
}

describe('CmsWorkspaceTabs', () => {
  const tabs = [
    { id: 'branding', label: 'Branding' },
    { id: 'typography', label: 'Typography' },
    { id: 'layout', label: 'Layout' },
  ]

  it('renders all tabs and marks the active one', () => {
    const wrapper = shallowMount(CmsWorkspaceTabs, {
      props: { modelValue: 'typography', ariaLabel: 'Settings tabs', tabs },
    })

    const btns = wrapper.findAll('.cms-workspace-tab')
    expect(btns).toHaveLength(3)
    expect(btns[1]?.classes()).toContain('cms-workspace-tab--active')
    expect(btns[0]?.classes()).not.toContain('cms-workspace-tab--active')
    expect(btns[0]?.text()).toBe('Branding')
  })

  it('emits update:modelValue when a tab is clicked', async () => {
    const wrapper = shallowMount(CmsWorkspaceTabs, {
      props: { modelValue: 'branding', ariaLabel: 'Settings tabs', tabs },
    })

    await wrapper.findAll('.cms-workspace-tab')[2]?.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['layout']])
  })

  it('sets aria-selected true only on the active tab', () => {
    const wrapper = shallowMount(CmsWorkspaceTabs, {
      props: { modelValue: 'branding', ariaLabel: 'Settings tabs', tabs },
    })

    const btns = wrapper.findAll('.cms-workspace-tab')
    expect(btns[0]?.attributes('aria-selected')).toBe('true')
    expect(btns[1]?.attributes('aria-selected')).toBe('false')
  })
})

describe('CmsShellCard', () => {
  it('renders title and body slot content', () => {
    const wrapper = shallowMount(CmsShellCard, {
      ...globalOpts,
      props: { title: 'Media Assets' },
      slots: { default: '<p class="body-content">Content here</p>' },
    })

    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.classes()).toContain('cms-shell-card')
    expect(wrapper.text()).toContain('Media Assets')
    expect(wrapper.find('.body-content').exists()).toBe(true)
  })

  it('renders header-actions slot when provided', () => {
    const wrapper = shallowMount(CmsShellCard, {
      ...globalOpts,
      props: { title: 'Releases' },
      slots: { 'header-actions': '<button class="add-btn">Add</button>' },
    })

    expect(wrapper.find('.add-btn').exists()).toBe(true)
  })

  it('renders separator when showSeparator is true (default)', () => {
    const wrapper = shallowMount(CmsShellCard, {
      ...globalOpts,
      props: { title: 'Card' },
    })

    const separator = wrapper.find('.cms-shell-card__separator')
    expect(separator.exists()).toBe(true)
    expect(separator.element.tagName).toBe('HR')
    expect(separator.attributes('aria-hidden')).toBe('true')
  })

  it('hides separator when showSeparator is false', () => {
    const wrapper = shallowMount(CmsShellCard, {
      ...globalOpts,
      props: { title: 'Card', showSeparator: false },
    })

    expect(wrapper.find('.cms-shell-card__separator').exists()).toBe(false)
  })
})

describe('CmsAuthoringToolbar', () => {
  it('renders infoItems with emphasis', () => {
    const wrapper = shallowMount(CmsAuthoringToolbar, {
      props: {
        infoItems: [
          { id: 'i1', label: 'Draft', emphasis: true },
          { id: 'i2', label: 'English' },
        ],
      },
    })

    const items = wrapper.findAll('.cms-designer-card__info-item')
    expect(items).toHaveLength(2)
    expect(items[0]?.find('strong').text()).toBe('Draft')
    expect(items[1]?.find('strong').exists()).toBe(false)
    expect(items[1]?.text()).toBe('English')
  })

  it('does not render info strip when infoItems is empty', () => {
    const wrapper = shallowMount(CmsAuthoringToolbar, { props: { infoItems: [] } })

    expect(wrapper.find('.cms-designer-card__toolbar-row--info').exists()).toBe(false)
  })

  it('renders actions and trailing slots', () => {
    const wrapper = shallowMount(CmsAuthoringToolbar, {
      slots: {
        actions: '<button class="save-btn">Save</button>',
        trailing: '<button class="preview-btn">Preview</button>',
      },
    })

    expect(wrapper.find('.save-btn').exists()).toBe(true)
    expect(wrapper.find('.preview-btn').exists()).toBe(true)
  })
})

describe('CmsAuthoringStatusBar', () => {
  it('renders chip and text items with emphasis', () => {
    const wrapper = shallowMount(CmsAuthoringStatusBar, {
      global: { stubs: { 'q-chip': { template: '<span class="chip"><slot /></span>' } } },
      props: {
        items: [
          { id: 'i1', label: 'Saved', kind: 'chip' },
          { id: 'i2', label: 'English', kind: 'text' },
          { id: 'i3', label: 'Published', kind: 'text', emphasis: true },
        ],
      },
    })

    expect(wrapper.findAll('.chip')).toHaveLength(1)
    expect(wrapper.findAll('.cms-designer-card__status-text')).toHaveLength(2)
    const emphasisEl = wrapper.findAll('.cms-designer-card__status-text')[1]
    expect(emphasisEl?.find('strong').text()).toBe('Published')
  })
})

describe('CmsDiagnosticsListSection', () => {
  it('renders items with severity chip, code and message', () => {
    const wrapper = shallowMount(CmsDiagnosticsListSection, {
      global: { stubs: { 'q-chip': { template: '<span class="chip">{{ $attrs.label }}<slot /></span>' } } },
      props: {
        title: 'Validation Issues',
        showCount: true,
        items: [
          { id: 'd1', code: 'MISSING_ALT', message: 'Image alt text is missing', severity: 'warning', severityStyle: {} },
          { id: 'd2', code: 'BROKEN_LINK', message: 'Link target not found', severity: 'error', severityStyle: {} },
        ],
      },
    })

    expect(wrapper.text()).toContain('Validation Issues')
    const diagItems = wrapper.findAll('.cms-diagnostics-item')
    expect(diagItems).toHaveLength(2)
    expect(diagItems[0]?.text()).toContain('MISSING_ALT')
    expect(diagItems[0]?.text()).toContain('Image alt text is missing')
    expect(diagItems[1]?.text()).toContain('BROKEN_LINK')
  })

  it('does not render when items array is empty', () => {
    const wrapper = shallowMount(CmsDiagnosticsListSection, {
      props: { title: 'Issues', items: [] },
    })

    expect(wrapper.find('.cms-diagnostics-list').exists()).toBe(false)
  })
})

describe('CmsSectionHeaderSummary', () => {
  it('renders title and description', () => {
    const wrapper = shallowMount(CmsSectionHeaderSummary, {
      props: { title: 'Pages', description: '3 pages configured' },
    })

    expect(wrapper.text()).toContain('Pages')
    expect(wrapper.text()).toContain('3 pages configured')
  })

  it('renders summary slot when provided', () => {
    const wrapper = shallowMount(CmsSectionHeaderSummary, {
      props: { title: 'Blocks' },
      slots: { summary: '<span class="summary-chip">12 blocks</span>' },
    })

    expect(wrapper.find('.summary-chip').exists()).toBe(true)
    expect(wrapper.find('.summary-chip').text()).toBe('12 blocks')
  })
})

describe('CmsStatusMetricCardGrid', () => {
  const items = [
    {
      id: 'page-1',
      title: 'Home',
      description: 'Main landing page',
      statusLabel: 'Published',
      metrics: [
        { id: 'blocks', label: 'Blocks', value: 8 },
        { id: 'locales', label: 'Locales', value: 2 },
      ],
    },
    {
      id: 'page-2',
      title: 'About',
      description: 'About the company',
      statusLabel: 'Draft',
      metrics: [
        { id: 'blocks', label: 'Blocks', value: 4 },
      ],
    },
  ]

  it('renders item cards with title, description, status and metrics', () => {
    const wrapper = shallowMount(CmsStatusMetricCardGrid, {
      global: { stubs: { 'q-chip': { template: '<span class="chip"><slot /></span>' } } },
      props: { items },
    })

    const cards = wrapper.findAll('article')
    expect(cards).toHaveLength(2)
    expect(cards[0]?.text()).toContain('Home')
    expect(cards[0]?.text()).toContain('Main landing page')
    expect(cards[0]?.text()).toContain('Published')
    expect(cards[0]?.text()).toContain('Blocks')
    expect(cards[0]?.text()).toContain('8')
  })
})

describe('CmsPanelListSection', () => {
  const items = [
    { id: 'i1', title: 'Branding Block', meta: 'hero', lines: ['Color: #1e293b', 'Font: Inter'] },
    { id: 'i2', title: 'Footer Block', meta: 'footer' },
  ]

  it('renders section title, summary label and items', () => {
    const wrapper = shallowMount(CmsPanelListSection, {
      global: { stubs: { 'q-chip': { template: '<span class="chip"><slot /></span>' }, CmsSectionHeaderSummary: { template: '<div><slot /><slot name="summary" /></div>' } } },
      props: { title: 'Blocks', summaryLabel: '2 blocks', items },
    })

    expect(wrapper.text()).toContain('Branding Block')
    expect(wrapper.text()).toContain('hero')
    expect(wrapper.text()).toContain('Color: #1e293b')
    expect(wrapper.text()).toContain('Footer Block')
  })
})

describe('CmsAuthoringRulerBar', () => {
  it('renders marks and zoom label', () => {
    const wrapper = shallowMount(CmsAuthoringRulerBar, {
      global: { stubs: { DsButton: false } },
      props: { marks: [0, 100, 200, 300], zoomLabel: '125%', modeLabel: 'Snap' },
    })

    const rulerMarks = wrapper.findAll('.cms-designer-card__ruler-mark')
    expect(rulerMarks).toHaveLength(4)
    expect(wrapper.find('.cms-designer-card__ruler-zoom').text()).toBe('125%')
    expect(wrapper.findAll('button.ntk-button')).toHaveLength(2)
  })

  it('emits focus when gutter button is clicked', async () => {
    const wrapper = shallowMount(CmsAuthoringRulerBar, {
      global: { stubs: { DsButton: false } },
      props: { focusAriaLabel: 'Focus workbench', modeLabel: 'Grid' },
    })

    const button = wrapper.get('button[aria-label="Focus workbench"]')

    expect(button.classes()).toEqual(expect.arrayContaining([
      'cms-designer-card__ruler-focus',
      'ntk-button--variant-ghost',
      'ntk-button--size-sm',
      'ntk-button--intent-neutral',
    ]))

    await button.trigger('click')
    expect(wrapper.emitted('focus')).toHaveLength(1)
  })

  it('emits toggle-mode when mode button is clicked', async () => {
    const wrapper = shallowMount(CmsAuthoringRulerBar, {
      global: { stubs: { DsButton: false } },
      props: { focusAriaLabel: 'Focus workbench', modeLabel: 'Grid' },
    })

    const button = wrapper.get('button.cms-designer-card__ruler-mode')

    expect(button.classes()).toEqual(expect.arrayContaining([
      'ntk-button--variant-ghost',
      'ntk-button--size-sm',
      'ntk-button--intent-neutral',
    ]))
    expect(button.text()).toContain('grid_4x4')
    expect(button.text()).toContain('Grid')

    await button.trigger('click')
    expect(wrapper.emitted('toggle-mode')).toHaveLength(1)
  })
})

describe('CmsPreviewToolbar', () => {
  const baseProps = {
    source: 'draft',
    locale: 'en',
    viewport: 'desktop',
    sourceOptions: [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }],
    localeOptions: [{ label: 'English', value: 'en' }, { label: 'Português', value: 'pt' }],
    viewportOptions: [{ label: 'Desktop', value: 'desktop' }, { label: 'Mobile', value: 'mobile' }],
    statusChipStyle: { background: '#e0e0e0' },
    isPtBr: false,
  }

  it('renders with data attributes reflecting source and viewport', () => {
    const wrapper = shallowMount(CmsPreviewToolbar, {
      global: { stubs: { NtkSelect: true, 'q-chip': { template: '<span class="chip"><slot /></span>' } } },
      props: baseProps,
    })

    expect(wrapper.attributes('data-cms-preview-source')).toBe('draft')
    expect(wrapper.attributes('data-cms-preview-viewport')).toBe('desktop')
  })

  it('renders preview fields through NtkSelect compatibility wrappers', () => {
    const wrapper = shallowMount(CmsPreviewToolbar, {
      global: { stubs: { NtkSelect: true, 'q-chip': { template: '<span class="chip"><slot /></span>' } } },
      props: baseProps,
    })

    const fields = wrapper.findAll('ntk-select-stub')

    expect(fields).toHaveLength(3)
    for (const field of fields) {
      expect(field.attributes('variant')).toBe('outlined')
      expect(field.attributes('size')).toBe('sm')
      expect(field.attributes('popup-content-class')).toBe('cms-preview-toolbar__popup')
    }
  })

  it('shows publishedReleaseLabel chip when provided', () => {
    const wrapper = shallowMount(CmsPreviewToolbar, {
      global: { stubs: { NtkSelect: true, 'q-chip': { template: '<span class="chip"><slot /></span>' } } },
      props: { ...baseProps, publishedReleaseLabel: 'v2.1.0' },
    })

    const chips = wrapper.findAll('.chip')
    expect(chips.length).toBeGreaterThan(3)
    const chipTexts = chips.map(c => c.text())
    expect(chipTexts).toContain('v2.1.0')
  })

  it('hides publishedReleaseLabel chip when null', () => {
    const wrapper = shallowMount(CmsPreviewToolbar, {
      global: { stubs: { NtkSelect: true, 'q-chip': { template: '<span class="chip"><slot /></span>' } } },
      props: { ...baseProps, publishedReleaseLabel: null },
    })

    const chips = wrapper.findAll('.chip')
    expect(chips).toHaveLength(3)
  })
})

describe('CmsPagesPreviewSurface', () => {
  const createProps = () => ({
    source: 'draft',
    locale: 'en',
    viewport: 'desktop',
    sourceOptions: [{ label: 'Draft', value: 'draft' }],
    localeOptions: [{ label: 'English', value: 'en' }],
    viewportOptions: [{ label: 'Desktop', value: 'desktop' }],
    publishedReleaseLabel: null,
    statusChipStyle: {},
    bannerStyle: {},
    isPtBr: false,
    emptyMessage: '',
    draftPublishedDiff: null,
    changedPageDiffs: [],
    localeCoverageMatrix: [],
    activeLocaleCoverage: null,
    localeCoverageCategories: [],
    pagesForRender: [],
    previewPageDiffMap: new Map(),
    previewAuthoredContentModels: [],
    registry: {},
    previewRenderContext: {},
    t: (en: string) => en,
    getPreviewDiffStatusStyle: () => ({}),
    getPreviewDiffStatusLabel: () => '',
    getPreviewDiffChangeCount: () => 0,
    getPreviewDiffPageLabel: () => '',
    getPreviewDiffPagePath: () => '',
    getLocaleCoverageStatusStyle: () => ({}),
    getLocaleCoverageSummaryLabel: () => '',
    getLocaleCoverageStatusLabel: () => '',
    getLocaleCoverageCategoryLabel: () => '',
    getLocaleCoverageLocaleLabel: () => '',
    getPageTitleValue: () => '',
    getPageDescriptionValue: () => '',
    getContentModelLabel: () => '',
    getPageCurrentSchemaVersion: () => 1,
    getPageStatusStyle: () => ({}),
    toPreviewPageSchema: () => ({ sections: [] }),
    getPreviewPageDiagnostics: () => [],
    toDiagnosticsListItems: () => [],
    getPageSectionStyle: () => ({}),
    getSectionLabelValue: () => '',
  })

  it('emits openInWindow from the design-system header action', async () => {
    const wrapper = shallowMount(CmsPagesPreviewSurface, {
      props: createProps(),
      global: {
        stubs: {
          CmsShellCard: {
            props: ['bodyClass'],
            template: '<section :class="bodyClass"><div class="header-actions"><slot name="header-actions" /></div><slot /></section>',
          },
          CmsPreviewToolbar: true,
          CmsLocaleCoverageMatrix: true,
          CmsSectionHeaderSummary: true,
          CmsDiagnosticsListSection: true,
          CmsRenderer: true,
          'q-banner': true,
          'q-chip': true,
          DsButton: false,
        },
      },
    })

    const button = wrapper.get('button.ntk-button')
    expect(button.classes()).toEqual(expect.arrayContaining([
      'ntk-button--variant-ghost',
      'ntk-button--size-sm',
      'ntk-button--intent-neutral',
    ]))
    expect(button.text()).toContain('Open in new window')

    await button.trigger('click')

    expect(wrapper.emitted('openInWindow')).toHaveLength(1)
  })
})

describe('CmsEntityUsageDrawer', () => {
  const dialogStub = {
    template: '<div v-if="modelValue" class="dialog"><button class="dialog-close" @click="$emit(\'update:modelValue\', false)">Close</button><slot /></div>',
    props: ['modelValue'],
  }
  const chipStub = { template: '<span class="chip"><slot /></span>' }
  const drawerGlobalOpts = {
    global: {
      stubs: {
        'q-dialog': dialogStub,
        'q-chip': chipStub,
        DsButton: false,
      },
    },
  }

  it('renders header, references and count when open', () => {
    const wrapper = shallowMount(CmsEntityUsageDrawer, {
      ...drawerGlobalOpts,
      props: {
        modelValue: true,
        headerLabel: 'Usage',
        detailsLabel: 'Details',
        title: 'Hero Banner',
        referenceCount: 2,
        refsLabel: 'references',
        summaryLabel: 'Used in 2 places',
        emptyTitle: 'No usage',
        emptyDescription: 'Not used anywhere.',
        references: [
          { key: 'r1', label: 'Home Page', sourceLabel: 'Hero', description: 'Block slot 1' },
          { key: 'r2', label: 'About Page', sourceLabel: 'Banner', description: 'Top section' },
        ],
      },
    })

    expect(wrapper.find('.dialog').exists()).toBe(true)
    expect(wrapper.get('.cms-usage-drawer').element.tagName).toBe('SECTION')
    expect(wrapper.text()).toContain('Usage')
    expect(wrapper.text()).toContain('Hero Banner')
    const refs = wrapper.findAll('.cms-usage-drawer__reference')
    expect(refs).toHaveLength(2)
    expect(refs[0]?.text()).toContain('Home Page')
    expect(refs[1]?.text()).toContain('About Page')
  })

  it('does not render dialog content when modelValue is false', () => {
    const wrapper = shallowMount(CmsEntityUsageDrawer, {
      ...drawerGlobalOpts,
      props: {
        modelValue: false,
        headerLabel: 'Usage',
        detailsLabel: 'Details',
        referenceCount: 0,
        refsLabel: 'refs',
        summaryLabel: '',
        emptyTitle: 'No usage',
        emptyDescription: '',
        references: [],
      },
    })

    expect(wrapper.find('.dialog').exists()).toBe(false)
  })

  it('shows empty state when references array is empty', () => {
    const wrapper = shallowMount(CmsEntityUsageDrawer, {
      ...drawerGlobalOpts,
      props: {
        modelValue: true,
        headerLabel: 'Usage',
        detailsLabel: 'Details',
        referenceCount: 0,
        refsLabel: 'refs',
        summaryLabel: 'Not used',
        emptyTitle: 'Not used anywhere',
        emptyDescription: 'No references found.',
        references: [],
      },
    })

    expect(wrapper.find('.cms-block-item__empty').exists()).toBe(true)
    expect(wrapper.text()).toContain('Not used anywhere')
  })

  it('emits close from the native design-system close button', async () => {
    const wrapper = shallowMount(CmsEntityUsageDrawer, {
      ...drawerGlobalOpts,
      props: {
        modelValue: true,
        headerLabel: 'Usage',
        detailsLabel: 'Details',
        closeLabel: 'Close usage',
        referenceCount: 0,
        refsLabel: 'refs',
        summaryLabel: '',
        emptyTitle: 'No usage',
        emptyDescription: '',
        references: [],
      },
    })

    const closeButton = wrapper.get('button.cms-usage-drawer__close')
    expect(closeButton.classes()).toContain('ntk-button')
    expect(closeButton.attributes('aria-label')).toBe('Close usage')

    await closeButton.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('forwards q-dialog model updates', async () => {
    const wrapper = shallowMount(CmsEntityUsageDrawer, {
      ...drawerGlobalOpts,
      props: {
        modelValue: true,
        headerLabel: 'Usage',
        detailsLabel: 'Details',
        referenceCount: 0,
        refsLabel: 'refs',
        summaryLabel: '',
        emptyTitle: 'No usage',
        emptyDescription: '',
        references: [],
      },
    })

    await wrapper.get('.dialog-close').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })
})

describe('CmsAuthoringWorkbench', () => {
  it('mounts and delegates to EditorWorkbenchTemplate', () => {
    const wrapper = shallowMount(CmsAuthoringWorkbench, {
      global: { stubs: { 'q-card': { template: '<div><slot /></div>' } } },
      props: {
        pageAriaLabel: 'CMS page',
        canvasAriaLabel: 'CMS canvas',
        statusBarAriaLabel: 'CMS status',
      },
    })

    expect(wrapper.element.tagName).toBe('SECTION')
    expect(wrapper.find('editor-workbench-template-stub').exists()).toBe(true)
    expect(wrapper.classes()).toContain('cms-authoring-workbench')
  })
})