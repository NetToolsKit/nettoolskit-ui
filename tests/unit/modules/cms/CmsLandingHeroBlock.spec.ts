/**
 * Tests/unit/modules/cms/Cms Landing Hero Block spec module.
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import CmsLandingHeroBlock from '../../../../src/modules/cms/blocks/landing/CmsLandingHeroBlock.vue'

describe('CmsLandingHeroBlock', () => {
  it('renders premium video media when a source URL is provided', () => {
    const wrapper = mount(CmsLandingHeroBlock, {
      props: {
        title: 'Hero',
        videoMp4: 'https://cdn.example.com/hero.mp4',
        videoPoster: '/hero-poster.png',
        image: '/hero-fallback.png',
      },
      global: {
        stubs: {
          NtkButton: true,
        },
      },
    })

    const video = wrapper.find('video.cms-landing-hero-media__video')
    expect(video.exists()).toBe(true)
    expect(video.attributes('poster')).toBe('/hero-poster.png')
    expect(wrapper.find('source[type="video/mp4"]').attributes('src')).toBe('https://cdn.example.com/hero.mp4')
  })

  it('falls back to image media when video URLs are not configured', () => {
    const wrapper = mount(CmsLandingHeroBlock, {
      props: {
        title: 'Hero',
        image: '/hero-fallback.png',
      },
      global: {
        stubs: {
          NtkButton: true,
        },
      },
    })

    expect(wrapper.find('video.cms-landing-hero-media__video').exists()).toBe(false)
    expect(wrapper.find('img.cms-landing-hero-media__image').attributes('src')).toBe('/hero-fallback.png')
  })

  it('shows image fallback after video error events', async () => {
    const wrapper = mount(CmsLandingHeroBlock, {
      props: {
        title: 'Hero',
        videoWebm: 'https://cdn.example.com/hero.webm',
        image: '/hero-fallback.png',
      },
      global: {
        stubs: {
          NtkButton: true,
        },
      },
    })

    await wrapper.find('video.cms-landing-hero-media__video').trigger('error')
    await nextTick()

    expect(wrapper.find('video.cms-landing-hero-media__video').exists()).toBe(false)
    expect(wrapper.find('img.cms-landing-hero-media__image').attributes('src')).toBe('/hero-fallback.png')
  })

  it('reveals media immediately when revealOnScroll is disabled', async () => {
    const wrapper = mount(CmsLandingHeroBlock, {
      props: {
        title: 'Hero',
        image: '/hero-fallback.png',
        revealOnScroll: false,
      },
      global: {
        stubs: {
          NtkButton: true,
        },
      },
    })

    await nextTick()
    expect(wrapper.find('.cms-landing-hero-media').classes()).toContain('cms-landing-hero-media--revealed')
  })

  it('keeps media stage without parallax transform when parallax is disabled', async () => {
    const wrapper = mount(CmsLandingHeroBlock, {
      props: {
        title: 'Hero',
        image: '/hero-fallback.png',
        revealOnScroll: false,
        parallaxEnabled: false,
      },
      global: {
        stubs: {
          NtkButton: true,
        },
      },
    })

    await nextTick()
    const style = wrapper.find('.cms-landing-hero-media__stage').attributes('style') ?? ''
    expect(style).not.toContain('transform:')
  })
})