/**
 * Src/modules/cms/renderer/Cms Renderer module.
 */

import { defineComponent, h } from 'vue'
import type { Component, PropType, VNode } from 'vue'
import type { CmsBlockRegistry, CmsPageSchema, CmsRecord, CmsSectionNode } from '../core'
import { CmsRendererNode } from './CmsRendererNode'

/**
 * Builds section class.
 */
function buildSectionClass(section: CmsSectionNode): string[] {
  const classes = ['cms-section']
  if (section.layout) {
    classes.push(`cms-section--${section.layout}`)
  }

  return classes
}

/**
 * Page renderer for schema-driven CMS pages.
 */
export const CmsRenderer = defineComponent({
  name: 'CmsRenderer',
  props: {
    page: {
      type: Object as PropType<CmsPageSchema>,
      required: true,
    },
    registry: {
      type: Object as PropType<CmsBlockRegistry>,
      required: true,
    },
    rootTag: {
      type: String,
      default: 'div',
    },
    sectionTag: {
      type: String,
      default: 'section',
    },
    unknownBlockComponent: {
      type: Object as PropType<Component | undefined>,
      default: undefined,
    },
    renderContext: {
      type: Object as PropType<CmsRecord | undefined>,
      default: undefined,
    },
  },
  setup(props) {
    const renderSection = (section: CmsSectionNode): VNode =>
      h(
        props.sectionTag,
        {
          key: section.id,
          id: section.id,
          class: buildSectionClass(section),
          'data-cms-section-id': section.id,
          'data-cms-section-layout': section.layout ?? 'single',
        },
        section.blocks.map(block =>
          h(CmsRendererNode, {
            key: block.id,
            block,
            registry: props.registry,
            unknownBlockComponent: props.unknownBlockComponent,
            renderContext: props.renderContext,
          })
        )
      )

    return () =>
      h(
        props.rootTag,
        {
          class: 'cms-renderer',
          'data-cms-page-id': props.page.id,
          'data-cms-page-slug': props.page.slug,
        },
        props.page.sections.map(section => renderSection(section))
      )
  },
})