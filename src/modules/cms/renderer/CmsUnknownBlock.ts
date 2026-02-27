/**
 * Src/modules/cms/renderer/Cms Unknown Block module.
 */

import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import type { CmsBlockNode } from '../core'

/**
 * Default fallback for unknown block types.
 */
export const CmsUnknownBlock = defineComponent({
  name: 'CmsUnknownBlock',
  props: {
    block: {
      type: Object as PropType<CmsBlockNode>,
      required: true,
    },
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          class: 'cms-unknown-block',
          'data-cms-unknown-block-type': props.block.type,
          'data-cms-unknown-block-id': props.block.id,
        },
        `Unknown block: ${props.block.type}`
      )
  },
})