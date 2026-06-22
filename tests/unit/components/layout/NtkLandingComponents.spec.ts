import { describe, expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import NtkHero from '../../../../src/components/layout/NtkHero.vue'
import NtkCTASection from '../../../../src/components/layout/NtkCTASection.vue'

vi.mock('../../../../src/composables/ui/useTheme', () => ({
  useTheme: () => ({
    theme: {
      value: {
        gradients: { primary: 'linear-gradient(90deg, #0f172a, #334155)' },
        colors: { primary: '#3b82f6', background: '#ffffff' },
      },
    },
  }),
}))

vi.mock('../../../../src/composables/ui/useBranding', () => ({
  useBranding: () => ({
    logo: { value: { type: 'letter', value: 'N', alt: 'NetToolsKit' } },
    appName: { value: 'BrandApp' },
    tagline: { value: 'Brand tagline' },
    primaryColor: { value: 'var(--ntk-primary)' },
    secondaryColor: { value: 'var(--ntk-secondary)' },
    social: {
      value: {
        github: 'https://github.com/test',
        linkedin: 'https://linkedin.com/company/test',
      },
    },
  }),
}))

// ─── NtkHero ───────────────────────────────────────────────────────────────

describe('NtkHero', () => {
  it('renders title and subtitle from props', () => {
    const wrapper = shallowMount(NtkHero, {
      props: { title: 'Welcome', subtitle: 'The best platform' },
    })

    expect(wrapper.find('.ntk-hero__title').text()).toBe('Welcome')
    expect(wrapper.find('.ntk-hero__subtitle').text()).toBe('The best platform')
  })

  it('falls back to branding appName/tagline when title/subtitle not provided', () => {
    const wrapper = shallowMount(NtkHero, {})

    expect(wrapper.find('.ntk-hero__title').text()).toBe('BrandApp')
    expect(wrapper.find('.ntk-hero__subtitle').text()).toBe('Brand tagline')
  })

  it('renders badge when provided', () => {
    const wrapper = shallowMount(NtkHero, {
      props: { title: 'T', badge: 'New' },
    })

    expect(wrapper.find('.ntk-hero__badge').text()).toBe('New')
  })

  it('does not render badge when not provided', () => {
    const wrapper = shallowMount(NtkHero, {
      props: { title: 'T' },
    })

    expect(wrapper.find('.ntk-hero__badge').exists()).toBe(false)
  })

  it('applies variant, layout and size classes', () => {
    const wrapper = shallowMount(NtkHero, {
      props: { title: 'T', variant: 'gradient', layout: 'centered', size: 'lg' },
    })

    const classes = wrapper.find('.ntk-hero').classes()
    expect(classes).toContain('ntk-hero--gradient')
    expect(classes).toContain('ntk-hero--centered')
    expect(classes).toContain('ntk-hero--lg')
  })

  it('renders image when image prop is provided', () => {
    const wrapper = shallowMount(NtkHero, {
      props: { title: 'T', image: '/hero.png', imageAlt: 'Hero' },
    })

    const img = wrapper.find('.ntk-hero__image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/hero.png')
    expect(img.attributes('alt')).toBe('Hero')
  })

  it('renders actions slot', () => {
    const wrapper = shallowMount(NtkHero, {
      props: { title: 'T' },
      slots: { actions: '<button class="action-btn">Get Started</button>' },
    })

    expect(wrapper.find('.ntk-hero__actions').exists()).toBe(true)
    expect(wrapper.find('.action-btn').exists()).toBe(true)
  })

  it('does not render actions area when actions slot is not provided', () => {
    const wrapper = shallowMount(NtkHero, {
      props: { title: 'T' },
    })

    expect(wrapper.find('.ntk-hero__actions').exists()).toBe(false)
  })
})

// ─── NtkCTASection ─────────────────────────────────────────────────────────

describe('NtkCTASection', () => {
  const defaultCTA = { text: 'Get Started', link: '/signup' }

  it('renders title and subtitle', () => {
    const wrapper = shallowMount(NtkCTASection, {
      props: { title: 'Ready to launch?', subtitle: 'Join 10,000 teams', primaryCTA: defaultCTA },
    })

    expect(wrapper.find('.cta-title').text()).toBe('Ready to launch?')
    expect(wrapper.find('.cta-subtitle').text()).toBe('Join 10,000 teams')
  })

  it('does not render subtitle when not provided', () => {
    const wrapper = shallowMount(NtkCTASection, {
      props: { title: 'Start now', primaryCTA: defaultCTA },
    })

    expect(wrapper.find('.cta-subtitle').exists()).toBe(false)
  })

  it('applies variant, size and layout classes', () => {
    const wrapper = shallowMount(NtkCTASection, {
      props: { title: 'T', primaryCTA: defaultCTA, variant: 'dark', size: 'lg', layout: 'split' },
    })

    const classes = wrapper.find('.ntk-cta-section').classes()
    expect(classes).toContain('variant-dark')
    expect(classes).toContain('size-lg')
    expect(classes).toContain('layout-split')
  })

  it('renders primary CTA button with correct text and link', () => {
    const wrapper = shallowMount(NtkCTASection, {
      props: { title: 'T', primaryCTA: { text: 'Sign up free', link: '/register' } },
    })

    const primary = wrapper.find('.cta-btn--primary')
    expect(primary.text()).toBe('Sign up free')
    expect(primary.attributes('href')).toBe('/register')
  })

  it('renders secondary CTA when provided', () => {
    const wrapper = shallowMount(NtkCTASection, {
      props: {
        title: 'T',
        primaryCTA: defaultCTA,
        secondaryCTA: { text: 'Learn more', link: '/about' },
      },
    })

    expect(wrapper.find('.cta-btn--secondary').exists()).toBe(true)
    expect(wrapper.find('.cta-btn--secondary').text()).toBe('Learn more')
  })

  it('does not render secondary CTA when not provided', () => {
    const wrapper = shallowMount(NtkCTASection, {
      props: { title: 'T', primaryCTA: defaultCTA },
    })

    expect(wrapper.find('.cta-btn--secondary').exists()).toBe(false)
  })
})
