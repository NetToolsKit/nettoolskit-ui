import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import EditorWorkbenchTemplate from '../../../src/templates/pages/editor/EditorWorkbenchTemplate.vue'

const globalMountOptions = {
  global: {
    renderStubDefaultSlot: true,
    stubs: {
      'q-page': {
        template: '<div><slot /></div>',
      },
    },
  },
}

describe('EditorWorkbenchTemplate', () => {
  it('emits toolbar, widget, canvas, rail and zoom contracts', async () => {
    const wrapper = shallowMount(EditorWorkbenchTemplate, {
      ...globalMountOptions,
      props: {
        topbarActions: [
          { id: 'save', icon: 'save', ariaLabel: 'Save file' },
        ],
        quickActions: [
          { id: 'undo', icon: 'undo', ariaLabel: 'Undo' },
        ],
        widgetSections: [
          {
            id: 'basic',
            title: 'Basic',
            items: [
              { id: 'widget-text', label: 'Text', icon: 'text_fields' },
            ],
          },
        ],
        canvasObjects: [
          { id: 'canvas-title', label: 'Report title', subtitle: 'Heading' },
        ],
        railActions: [
          { id: 'properties', icon: 'tune', ariaLabel: 'Open properties' },
        ],
        zoomOptions: [90, 100, 125],
        zoomValue: 100,
      },
    })

    await wrapper.get('.ntk-template-editor-workbench__widget-search-input').setValue('text')
    expect(wrapper.emitted('update:widgetSearchValue')).toEqual([['text']])

    await wrapper.get('button[aria-label="Save file"]').trigger('click')
    expect(wrapper.emitted('toolbar-action-click')?.at(0)).toEqual(['save'])

    await wrapper.get('.ntk-template-editor-workbench__widget-item').trigger('click')
    expect(wrapper.emitted('update:selectedWidgetId')?.at(0)).toEqual(['widget-text'])
    expect(wrapper.emitted('widget-click')?.at(0)).toEqual(['widget-text'])

    await wrapper.get('.ntk-template-editor-workbench__canvas-object').trigger('click')
    expect(wrapper.emitted('canvas-object-click')?.at(0)).toEqual(['canvas-title'])

    await wrapper.get('button[aria-label="Open properties"]').trigger('click')
    expect(wrapper.emitted('rail-action-click')?.at(0)).toEqual(['properties'])

    await wrapper.get('.ntk-template-editor-workbench__zoom-select').setValue('125')
    expect(wrapper.emitted('update:zoomValue')?.at(0)).toEqual([125])
  })

  it('filters widget sections by search term', () => {
    const wrapper = shallowMount(EditorWorkbenchTemplate, {
      ...globalMountOptions,
      props: {
        widgetSearchValue: 'image',
        widgetSections: [
          {
            id: 'basic',
            title: 'Basic',
            items: [
              { id: 'widget-text', label: 'Text' },
              { id: 'widget-image', label: 'Image' },
            ],
          },
          {
            id: 'charts',
            title: 'Charts',
            items: [
              { id: 'widget-column', label: 'Column' },
            ],
          },
        ],
      },
    })

    const widgetItems = wrapper.findAll('.ntk-template-editor-workbench__widget-item')
    expect(widgetItems).toHaveLength(1)
    const renderedWidgetLabels = widgetItems.map(item => item.text())
    expect(renderedWidgetLabels).toEqual(['Image'])
    expect(renderedWidgetLabels).not.toContain('Column')
    expect(renderedWidgetLabels).not.toContain('Text')
  })
})