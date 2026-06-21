import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

import CmsBlocksModuleTemplate from '../../../src/templates/features/cms/authoring/modules/CmsBlocksModuleTemplate.vue'
import CmsPagesModuleTemplate from '../../../src/templates/features/cms/authoring/modules/CmsPagesModuleTemplate.vue'
import CmsSettingsModuleTemplate from '../../../src/templates/features/cms/authoring/modules/CmsSettingsModuleTemplate.vue'

function createSurfaceStub(name: string, emittedEvent: string, emittedPayload: unknown) {
  return defineComponent({
    name,
    props: {
      shellFlag: { type: String, default: '' },
      tenantFlag: { type: String, default: '' },
      themeFlag: { type: String, default: '' },
      contentFlag: { type: String, default: '' },
      builderFlag: { type: String, default: '' },
      libraryFlag: { type: String, default: '' },
      previewFlag: { type: String, default: '' },
      actionFlag: { type: String, default: '' },
    },
    emits: [emittedEvent],
    template: '<button class="surface-stub" @click="$emit(emittedEvent, emittedPayload)">emit</button>',
    setup() {
      return {
        emittedEvent,
        emittedPayload,
      }
    },
  })
}

describe('CMS module template wrappers', () => {
  it('flattens grouped settings contracts and forwards file events', async () => {
    const surfaceStub = createSurfaceStub('CmsSettingsModuleSurface', 'tenant-import-file-change', 'tenant.json')
    const wrapper = mount(CmsSettingsModuleTemplate, {
      props: {
        shell: { shellFlag: 'shell' },
        tenant: { tenantFlag: 'tenant' },
        theme: { themeFlag: 'theme' },
        contentModel: { contentFlag: 'content' },
        actions: { actionFlag: 'actions' },
      },
      global: {
        stubs: {
          CmsSettingsModuleSurface: surfaceStub,
        },
      },
    })

    const child = wrapper.findComponent(surfaceStub)
    expect(child.props('shellFlag')).toBe('shell')
    expect(child.props('tenantFlag')).toBe('tenant')
    expect(child.props('themeFlag')).toBe('theme')
    expect(child.props('contentFlag')).toBe('content')
    expect(child.props('actionFlag')).toBe('actions')

    await child.trigger('click')
    expect(wrapper.emitted('tenant-import-file-change')).toEqual([['tenant.json']])
  })

  it('flattens grouped pages contracts and forwards selection events', async () => {
    const surfaceStub = createSurfaceStub('CmsPagesModuleSurface', 'update:selectedPageTemplateId', 'blank')
    const wrapper = mount(CmsPagesModuleTemplate, {
      props: {
        shell: { shellFlag: 'shell' },
        builder: { builderFlag: 'builder' },
        library: { libraryFlag: 'library' },
        preview: { previewFlag: 'preview' },
        actions: { actionFlag: 'actions' },
      },
      global: {
        stubs: {
          CmsPagesModuleSurface: surfaceStub,
        },
      },
    })

    const child = wrapper.findComponent(surfaceStub)
    expect(child.props('shellFlag')).toBe('shell')
    expect(child.props('builderFlag')).toBe('builder')
    expect(child.props('libraryFlag')).toBe('library')
    expect(child.props('previewFlag')).toBe('preview')
    expect(child.props('actionFlag')).toBe('actions')

    await child.trigger('click')
    expect(wrapper.emitted('update:selectedPageTemplateId')).toEqual([['blank']])
  })

  it('flattens grouped blocks contracts and forwards preview events', async () => {
    const surfaceStub = createSurfaceStub('CmsBlocksModuleSurface', 'update:cmsPreviewViewport', 'mobile')
    const wrapper = mount(CmsBlocksModuleTemplate, {
      props: {
        shell: { shellFlag: 'shell' },
        builder: { builderFlag: 'builder' },
        library: { libraryFlag: 'library' },
        preview: { previewFlag: 'preview' },
        actions: { actionFlag: 'actions' },
      },
      global: {
        stubs: {
          CmsBlocksModuleSurface: surfaceStub,
        },
      },
    })

    const child = wrapper.findComponent(surfaceStub)
    expect(child.props('shellFlag')).toBe('shell')
    expect(child.props('builderFlag')).toBe('builder')
    expect(child.props('libraryFlag')).toBe('library')
    expect(child.props('previewFlag')).toBe('preview')
    expect(child.props('actionFlag')).toBe('actions')

    await child.trigger('click')
    expect(wrapper.emitted('update:cmsPreviewViewport')).toEqual([['mobile']])
  })
})