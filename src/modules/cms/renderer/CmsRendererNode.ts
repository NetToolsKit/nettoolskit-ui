/**
 * Src/modules/cms/renderer/Cms Renderer Node module.
 */

import { defineComponent, h, toRaw } from 'vue'
import type { Component, PropType, VNode } from 'vue'
import type { CmsBlockNode, CmsBlockRegistry, CmsRecord } from '../core'
import { CmsUnknownBlock } from './CmsUnknownBlock'

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value)
    } catch {
      // JSON fallback covers proxies and non-cloneable objects.
    }
  }

  return JSON.parse(JSON.stringify(value)) as T
}

function deepMergeRecords(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const merged = cloneValue(base)

  for (const [key, overrideValue] of Object.entries(override)) {
    const baseValue = merged[key]
    if (isObjectRecord(baseValue) && isObjectRecord(overrideValue)) {
      merged[key] = deepMergeRecords(baseValue, overrideValue)
      continue
    }

    merged[key] = cloneValue(overrideValue)
  }

  return merged
}

function resolveBlockLocalizedProps(
  block: CmsBlockNode,
  context?: CmsRecord
): CmsRecord {
  const baseProps = isObjectRecord(block.props)
    ? cloneValue(block.props)
    : {}
  const locale = String(context?.locale ?? 'en').trim() || 'en'
  const localizedProps = block.localization?.props?.[locale]
  if (!isObjectRecord(localizedProps)) {
    return baseProps
  }

  return deepMergeRecords(baseProps, localizedProps)
}

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
    renderContext: {
      type: Object as PropType<CmsRecord | undefined>,
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
        ...resolveBlockLocalizedProps(block, props.renderContext),
        'data-cms-block-id': block.id,
        'data-cms-block-type': block.type,
      } as Record<string, unknown>

      const resolvedBaseProps = definition?.resolveProps
        ? definition.resolveProps({
          block,
          props: baseProps,
          context: props.renderContext,
        })
        : baseProps

      const resolvedProps = definition
        ? resolvedBaseProps
        : {
            ...resolvedBaseProps,
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