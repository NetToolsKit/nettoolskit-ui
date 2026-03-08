/**
 * Tests/unit/modules/cms/Cms Renderer spec module.
 */

import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { CMS_SCHEMA_VERSION, CmsBlockRegistry } from '../../../../src/modules/cms'
import { CmsRenderer } from '../../../../src/modules/cms/renderer'
import { createLandingRegistry } from '../../../../landing-page/cms/landing.registry'

describe('CmsRenderer', () => {
  const HeroBlock = defineComponent({
    name: 'HeroBlock',
    props: {
      title: {
        type: String,
        required: true,
      },
      subtitle: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      return () =>
        h('div', { class: 'hero-block' }, [
          h('h1', props.title),
          h('p', props.subtitle),
        ])
    },
  })

  const ContainerBlock = defineComponent({
    name: 'ContainerBlock',
    setup(_, { slots }) {
      return () => h('div', { class: 'container-block' }, slots.default?.())
    },
  })

  const TextBlock = defineComponent({
    name: 'TextBlock',
    props: {
      value: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      return () => h('span', { class: 'text-block' }, props.value)
    },
  })

  const MediaBlock = defineComponent({
    name: 'MediaBlock',
    props: {
      image: {
        type: String,
        required: true,
      },
      imageAlt: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      return () => h('img', {
        class: 'media-block',
        src: props.image,
        alt: props.imageAlt,
      })
    },
  })

  it('should render registered blocks with merged defaults', () => {
    const registry = new CmsBlockRegistry([
      {
        type: 'layout.hero',
        displayName: 'Hero',
        category: 'layout',
        component: HeroBlock,
        defaults: {
          subtitle: 'Default subtitle',
        },
      },
    ])

    const page = {
      version: CMS_SCHEMA_VERSION,
      id: 'landing-home',
      slug: '/home',
      title: 'Home',
      status: 'draft' as const,
      sections: [
        {
          id: 'hero',
          blocks: [
            {
              id: 'hero-1',
              type: 'layout.hero',
              props: {
                title: 'Welcome',
              },
            },
          ],
        },
      ],
    }

    const wrapper = mount(CmsRenderer, {
      props: {
        page,
        registry,
      },
    })

    expect(wrapper.find('[data-cms-page-id="landing-home"]').exists()).toBe(true)
    expect(wrapper.find('.hero-block').text()).toContain('Welcome')
    expect(wrapper.find('.hero-block').text()).toContain('Default subtitle')
  })

  it('should resolve block props from render context before mounting the component', () => {
    const registry = new CmsBlockRegistry([
      {
        type: 'content.media',
        displayName: 'Media',
        category: 'media',
        component: MediaBlock,
        resolveProps: ({ props, context }) => {
          const assetId = String(props.imageAssetId ?? '').trim()
          const mediaAssets = Array.isArray(context?.mediaAssets)
            ? context.mediaAssets as Array<{ id: string; url: string; alt: string }>
            : []
          const asset = mediaAssets.find(entry => entry.id === assetId)

          return {
            ...props,
            image: asset?.url ?? props.image,
            imageAlt: asset?.alt ?? props.imageAlt,
          }
        },
      },
    ])

    const page = {
      version: CMS_SCHEMA_VERSION,
      id: 'media-page',
      slug: '/media',
      title: 'Media',
      status: 'draft' as const,
      sections: [
        {
          id: 'hero',
          blocks: [
            {
              id: 'media-1',
              type: 'content.media',
              props: {
                imageAssetId: 'hero-image',
                image: '/fallback.png',
                imageAlt: '',
              },
            },
          ],
        },
      ],
    }

    const wrapper = mount(CmsRenderer, {
      props: {
        page,
        registry,
        renderContext: {
          mediaAssets: [
            {
              id: 'hero-image',
              url: '/resolved.png',
              alt: 'Resolved hero',
            },
          ],
        },
      },
    })

    expect(wrapper.find('.media-block').attributes('src')).toBe('/resolved.png')
    expect(wrapper.find('.media-block').attributes('alt')).toBe('Resolved hero')
  })

  it('should resolve locale-specific block props before mounting the component', () => {
    const registry = new CmsBlockRegistry([
      {
        type: 'layout.hero',
        displayName: 'Hero',
        category: 'layout',
        component: HeroBlock,
      },
    ])

    const page = {
      version: CMS_SCHEMA_VERSION,
      id: 'localized-page',
      slug: '/localized',
      title: 'Localized',
      status: 'draft' as const,
      sections: [
        {
          id: 'hero',
          blocks: [
            {
              id: 'hero-1',
              type: 'layout.hero',
              props: {
                title: 'Build faster',
                subtitle: 'Use reusable templates.',
              },
              localization: {
                props: {
                  'pt-BR': {
                    title: 'Monte mais rapido',
                    subtitle: 'Use templates reutilizaveis.',
                  },
                },
              },
            },
          ],
        },
      ],
    }

    const wrapper = mount(CmsRenderer, {
      props: {
        page,
        registry,
        renderContext: {
          locale: 'pt-BR',
        },
      },
    })

    expect(wrapper.find('.hero-block').text()).toContain('Monte mais rapido')
    expect(wrapper.find('.hero-block').text()).toContain('Use templates reutilizaveis.')
  })

  it('should render nested children when block accepts children', () => {
    const registry = new CmsBlockRegistry([
      {
        type: 'layout.container',
        displayName: 'Container',
        category: 'layout',
        component: ContainerBlock,
        acceptsChildren: true,
      },
      {
        type: 'content.text',
        displayName: 'Text',
        category: 'content',
        component: TextBlock,
      },
    ])

    const page = {
      version: CMS_SCHEMA_VERSION,
      id: 'nested-page',
      slug: '/nested',
      title: 'Nested',
      status: 'draft' as const,
      sections: [
        {
          id: 'content',
          blocks: [
            {
              id: 'container-1',
              type: 'layout.container',
              props: {},
              children: [
                {
                  id: 'text-1',
                  type: 'content.text',
                  props: {
                    value: 'Nested content',
                  },
                },
              ],
            },
          ],
        },
      ],
    }

    const wrapper = mount(CmsRenderer, {
      props: {
        page,
        registry,
      },
    })

    expect(wrapper.find('.container-block').exists()).toBe(true)
    expect(wrapper.find('.container-block .text-block').text()).toBe('Nested content')
  })

  it('should render unknown block fallback', () => {
    const registry = new CmsBlockRegistry()

    const page = {
      version: CMS_SCHEMA_VERSION,
      id: 'unknown-page',
      slug: '/unknown',
      title: 'Unknown',
      status: 'draft' as const,
      sections: [
        {
          id: 'content',
          blocks: [
            {
              id: 'block-unknown',
              type: 'content.missing',
              props: {},
            },
          ],
        },
      ],
    }

    const wrapper = mount(CmsRenderer, {
      props: {
        page,
        registry,
      },
    })

    expect(wrapper.text()).toContain('Unknown block: content.missing')
    expect(wrapper.find('[data-cms-unknown-block-type="content.missing"]').exists()).toBe(true)
  })

  it('should render landing CTA block even when compatibility props are empty', () => {
    const page = {
      version: CMS_SCHEMA_VERSION,
      id: 'landing-compat',
      slug: '/compat',
      title: 'Compatibility page',
      status: 'draft' as const,
      sections: [
        {
          id: 'cta',
          blocks: [
            {
              id: 'cta-1',
              type: 'landing.cta',
              props: {},
            },
          ],
        },
      ],
    }

    const wrapper = mount(CmsRenderer, {
      props: {
        page,
        registry: createLandingRegistry(),
      },
    })

    expect(wrapper.find('[data-cms-page-id="landing-compat"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Unknown block')
  })
})