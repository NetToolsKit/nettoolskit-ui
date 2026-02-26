import { describe, it, expect } from 'vitest'
import { CmsBlockRegistry } from '../../../../src/modules/cms/core/registry'
import type { CmsBlockDefinition } from '../../../../src/modules/cms/core/block'

describe('CmsBlockRegistry', () => {
  const heroBlock: CmsBlockDefinition<{ title: string; subtitle: string }> = {
    type: 'layout.hero',
    displayName: 'Hero',
    category: 'layout',
    defaults: {
      title: 'Default title',
      subtitle: 'Default subtitle',
    },
    validateProps: (
      props
    ): props is { title: string; subtitle: string } =>
      typeof props.title === 'string' && typeof props.subtitle === 'string',
  }

  it('should register and resolve block definitions', () => {
    const registry = new CmsBlockRegistry()
    registry.register(heroBlock)

    expect(registry.has('layout.hero')).toBe(true)
    expect(registry.get('layout.hero')?.displayName).toBe('Hero')
  })

  it('should reject duplicate block types', () => {
    const registry = new CmsBlockRegistry([heroBlock])

    expect(() => registry.register(heroBlock)).toThrowError(
      'Block type "layout.hero" is already registered.'
    )
  })

  it('should create a block instance with default and custom props', () => {
    const registry = new CmsBlockRegistry([heroBlock])

    const instance = registry.createBlockInstance('layout.hero', {
      id: 'block-1',
      props: {
        title: 'Custom title',
      },
    })

    expect(instance).toEqual({
      id: 'block-1',
      type: 'layout.hero',
      props: {
        title: 'Custom title',
        subtitle: 'Default subtitle',
      },
    })
  })

  it('should enforce children rules', () => {
    const registry = new CmsBlockRegistry([heroBlock])

    expect(() =>
      registry.createBlockInstance('layout.hero', {
        id: 'block-2',
        children: [
          {
            id: 'child-1',
            type: 'layout.hero',
            props: {
              title: 'Child',
              subtitle: 'Child',
            },
          },
        ],
      })
    ).toThrowError('Block type "layout.hero" does not accept children.')
  })

  it('should list blocks by category', () => {
    const contentBlock: CmsBlockDefinition = {
      type: 'content.rich-text',
      displayName: 'Rich Text',
      category: 'content',
    }

    const registry = new CmsBlockRegistry([heroBlock, contentBlock])

    expect(registry.list('layout')).toHaveLength(1)
    expect(registry.list('content')).toHaveLength(1)
    expect(registry.list()).toHaveLength(2)
  })
})