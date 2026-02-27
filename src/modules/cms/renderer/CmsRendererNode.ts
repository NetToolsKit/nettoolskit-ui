/**
 * Src/modules/cms/renderer/Cms Renderer Node module.
 */

import { defineComponent, h, toRaw } from 'vue'
import type { Component, PropType, VNode } from 'vue'
import type { CmsBlockNode } from '../core'
import type { CmsBlockRegistry } from '../core'
import { CmsUnknownBlock } from './CmsUnknownBlock'

/**
 * Recursive block renderer used by CmsRenderer.
 */
export const CmsRendererNode = defineComponent({
  name: 'CmsRendererNode',
  props: {
    block: {
      type: Object as PropType<CmsBlockNode>,
      required: true,
    },
    registry: {
      type: Object as PropType<CmsBlockRegistry>,
      required: true,
    },
    unknownBlockComponent: {
      type: Object as PropType<Component | undefined>,
      default: undefined,
    },
  },
  setup(props) {
    const renderNode = (block: CmsBlockNode): VNode => {
      const registry = toRaw(props.registry)
      const definition = registry.get(block.type)
      const component = definition?.component ?? props.unknownBlockComponent ?? CmsUnknownBlock
      const baseProps = {
        ...(definition?.defaults ?? {}),
        ...(block.props ?? {}),
        'data-cms-block-id': block.id,
        'data-cms-block-type': block.type,
      } as Record<string, unknown>

      const resolvedProps = definition
        ? baseProps
        : {
            ...baseProps,
            block,
          }

      const hasChildren = Array.isArray(block.children) && block.children.length > 0
      if (hasChildren && definition?.acceptsChildren) {
        return h(
          component as Component,
          resolvedProps,
          {
            default: () => block.children!.map(child => renderNode(child)),
          }
        )
      }

      return h(component as Component, resolvedProps)
    }

    return () => renderNode(props.block)
  },
})