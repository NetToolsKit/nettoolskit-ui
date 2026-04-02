import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import {
  ReferenceBrandLockup,
  ReferenceDocumentTabsBar,
  ReferencePresetSelectorBar,
  ReferenceReportDesignerTemplate,
  ReferenceReportDetailCard,
  ReferenceReportManagerTemplate,
  ReferenceReportStatusBadge,
  ReferenceWorkspaceComposer,
  ReferenceWorkspaceShell,
  ReferenceWhitelabelPresetCard,
  referenceSampleDesignerConfig,
  referenceSampleDocumentTabs,
  referenceSampleManagerConfig,
  referenceSampleMenuItems,
  referenceSampleReportGroups,
} from '../../../src/templates/features/reference-system'
import { resolveReferenceWhitelabelPreset } from '../../../src/whitelabel'

const preset = resolveReferenceWhitelabelPreset('reference-light')

const globalMountOptions = {
  global: {
    renderStubDefaultSlot: true,
    stubs: {
      'q-icon': {
        props: ['name'],
        template: '<i :data-icon="name"><slot /></i>',
      },
      'q-select': {
        template: '<div><slot /></div>',
      },
      'q-btn': {
        props: ['label', 'icon'],
        template: '<button :data-icon="icon">{{ label }}<slot /></button>',
      },
      MainLayoutTemplate: {
        props: ['appName', 'activeItemId', 'menuItems'],
        template: `
          <div class="main-layout-stub">
            <div class="main-layout-stub__brand"><slot name="brand" /></div>
            <div class="main-layout-stub__header">
              <slot name="header-actions" :layout-controls="{ horizontalMode: false, setHorizontalMode: () => {}, showLabelsInMini: false, setShowLabelsInMini: () => {}, sideMenuVariant: 'reference', setSideMenuVariant: () => {} }" />
            </div>
            <div class="main-layout-stub__content"><slot /></div>
          </div>
        `,
      },
      EditorWorkbenchTemplate: {
        props: ['documentTitle', 'documentSubtitle', 'zoomValue'],
        template: '<div class="editor-workbench-stub">{{ documentTitle }} {{ documentSubtitle }} {{ zoomValue }}</div>',
      },
    },
  },
}

describe('Reference system templates', () => {
  it('renders manager report metadata and quick actions', () => {
    const wrapper = mount(ReferenceReportManagerTemplate, {
      ...globalMountOptions,
      props: {
        reportGroups: referenceSampleReportGroups,
        stats: referenceSampleManagerConfig.stats,
        quickActions: referenceSampleManagerConfig.quickActions,
        activeReportId: referenceSampleReportGroups[0]?.items[0]?.id,
        selectedPreset: preset,
      },
    })

    expect(wrapper.text()).toContain('Approved report catalog')
    expect(wrapper.text()).toContain('monthly-revenue-summary.rdl')
    expect(wrapper.text()).toContain('Create report')
    expect(wrapper.text()).toContain('Reference Light')
  })

  it('emits document tab and catalog interactions in designer mode', async () => {
    const wrapper = mount(ReferenceReportDesignerTemplate, {
      ...globalMountOptions,
      props: {
        reportGroups: referenceSampleReportGroups,
        activeReportId: referenceSampleReportGroups[0]?.items[0]?.id,
        selectedPreset: preset,
        documentTabs: referenceSampleDocumentTabs,
        activeDocumentTabId: referenceSampleDocumentTabs[0]?.id,
        topbarActions: referenceSampleDesignerConfig.topbarActions,
        quickActions: referenceSampleDesignerConfig.quickActions,
        widgetSections: referenceSampleDesignerConfig.widgetSections,
        canvasColumns: referenceSampleDesignerConfig.canvasColumns,
        canvasObjects: referenceSampleDesignerConfig.canvasObjects,
        railActions: referenceSampleDesignerConfig.railActions,
        leftStatusSegments: referenceSampleDesignerConfig.leftStatusSegments,
        rightStatusSegments: referenceSampleDesignerConfig.rightStatusSegments,
        zoomOptions: referenceSampleDesignerConfig.zoomOptions,
        zoomValue: 100,
      },
    })

    await wrapper.findAll('.ntk-reference-tabs-bar__tab')[1]?.trigger('click')
    expect(wrapper.emitted('update:activeDocumentTabId')?.at(0)).toEqual(['data'])
    expect(wrapper.text()).toContain('monthly-revenue-summary.rdl')
    expect(wrapper.text()).toContain('Reference Light')
  })

  it('renders extracted detail and preset cards as reusable building blocks', () => {
    const report = referenceSampleReportGroups[0]?.items[0]
    const detailCard = mount(ReferenceReportDetailCard, {
      ...globalMountOptions,
      props: {
        report,
        quickActions: referenceSampleManagerConfig.quickActions,
      },
    })
    const presetCard = mount(ReferenceWhitelabelPresetCard, {
      ...globalMountOptions,
      props: {
        preset,
      },
    })

    expect(detailCard.text()).toContain('Selected report')
    expect(detailCard.text()).toContain('Finance')
    expect(presetCard.text()).toContain('Whitelabel preset')
    expect(presetCard.text()).toContain('Accent')
  })

  it('keeps tabs and status badges reusable outside the page templates', async () => {
    const tabsBar = mount(ReferenceDocumentTabsBar, {
      ...globalMountOptions,
      props: {
        documentTabs: referenceSampleDocumentTabs,
        activeDocumentTabId: 'layout',
        selectedPreset: preset,
      },
    })
    const statusBadge = mount(ReferenceReportStatusBadge, {
      props: {
        status: 'review',
      },
    })

    await tabsBar.findAll('.ntk-reference-tabs-bar__tab')[2]?.trigger('click')

    expect(tabsBar.emitted('update:activeDocumentTabId')?.at(0)).toEqual(['preview'])
    expect(tabsBar.text()).toContain('Reference Light')
    expect(statusBadge.text()).toContain('review')
  })

  it('composes manager and designer surfaces through the shared workspace composer', () => {
    const wrapper = mount(ReferenceWorkspaceComposer, {
      ...globalMountOptions,
      props: {
        mode: 'both',
        reportGroups: referenceSampleReportGroups,
        selectedPreset: preset,
        activeReportId: referenceSampleReportGroups[0]?.items[0]?.id,
        managerStats: referenceSampleManagerConfig.stats,
        managerQuickActions: referenceSampleManagerConfig.quickActions,
        documentTabs: referenceSampleDocumentTabs,
        activeDocumentTabId: referenceSampleDocumentTabs[0]?.id,
        designerTopbarActions: referenceSampleDesignerConfig.topbarActions,
        designerQuickActions: referenceSampleDesignerConfig.quickActions,
        widgetSections: referenceSampleDesignerConfig.widgetSections,
        canvasColumns: referenceSampleDesignerConfig.canvasColumns,
        canvasObjects: referenceSampleDesignerConfig.canvasObjects,
        railActions: referenceSampleDesignerConfig.railActions,
        leftStatusSegments: referenceSampleDesignerConfig.leftStatusSegments,
        rightStatusSegments: referenceSampleDesignerConfig.rightStatusSegments,
        zoomOptions: referenceSampleDesignerConfig.zoomOptions,
        zoomValue: 100,
      },
    })

    expect(wrapper.text()).toContain('Approved report catalog')
    expect(wrapper.text()).toContain('Report files')
  })

  it('reuses the shell brand and preset controls for the samples runtime', async () => {
    const shell = mount(ReferenceWorkspaceShell, {
      ...globalMountOptions,
      props: {
        whitelabelStyleVars: { '--ntk-template-layout-page-bg': '#ffffff' },
        selectedPreset: preset,
        selectedPresetId: preset.id,
        presetOptions: [{ label: preset.label, value: preset.id }],
        menuItems: referenceSampleMenuItems,
        activeItemId: 'catalog',
      },
      slots: {
        default: '<div class="shell-slot">workspace</div>',
      },
    })
    const brand = mount(ReferenceBrandLockup, {
      props: {
        preset,
      },
    })
    const presetBar = mount(ReferencePresetSelectorBar, {
      ...globalMountOptions,
      props: {
        modelValue: preset.id,
        options: [{ label: preset.label, value: preset.id }],
      },
    })

    await presetBar.find('button').trigger('click')

    expect(shell.text()).toContain('NetToolsKit Reference')
    expect(shell.text()).toContain('workspace')
    expect(brand.text()).toContain('NetToolsKit Reference')
    expect(presetBar.emitted('primary-action-click')).toHaveLength(1)
  })
})