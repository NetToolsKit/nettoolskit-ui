import { describe, expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import NtkLandingHeader from '../../../../src/components/layout/NtkLandingHeader.vue'
import NtkTechStack from '../../../../src/components/layout/NtkTechStack.vue'
import NtkContactSection from '../../../../src/components/layout/NtkContactSection.vue'

vi.mock('../../../../src/composables/ui/useBranding', () => ({
  useBranding: () => ({
    appName: { value: 'TestApp' },
    tagline: { value: '' },
    logo: { value: { type: 'letter', value: 'T', alt: 'TestApp' } },
    appUrl: { value: '/' },
    primaryColor: { value: '#3b82f6' },
  }),
}))

const sectionSlotStub = {
  global: {
    renderStubDefaultSlot: true,
    stubs: {
      NtkSection: { template: '<div><slot name="header" /><slot /></div>' },
    },
  },
}

// ─── NtkLandingHeader ──────────────────────────────────────────────────────

describe('NtkLandingHeader', () => {
  it('renders nav items', () => {
    const wrapper = shallowMount(NtkLandingHeader, {
      props: {
        navItems: [
          { label: 'Features', href: '#features' },
          { label: 'Pricing', href: '#pricing' },
          { label: 'Contact', href: '#contact' },
        ],
      },
    })

    const items = wrapper.findAll('.header-nav-item')
    expect(items).toHaveLength(3)
    expect(items[0]?.text()).toBe('Features')
    expect(items[2]?.text()).toBe('Contact')
  })

  it('does not render nav when navItems is empty', () => {
    const wrapper = shallowMount(NtkLandingHeader, {
      props: { navItems: [] },
    })

    expect(wrapper.find('.header-nav').exists()).toBe(false)
  })

  it('renders CTA button with text and link', () => {
    const wrapper = shallowMount(NtkLandingHeader, {
      props: { navItems: [], ctaText: 'Sign up', ctaLink: '/register' },
    })

    const cta = wrapper.find('.header-cta-btn')
    expect(cta.text()).toBe('Sign up')
    expect(cta.attributes('href')).toBe('/register')
  })

  it('does not render CTA when ctaText is empty', () => {
    const wrapper = shallowMount(NtkLandingHeader, {
      props: { navItems: [], ctaText: '' },
    })

    expect(wrapper.find('.header-cta-btn').exists()).toBe(false)
  })

  it('applies header-sticky class when sticky is true', () => {
    const wrapper = shallowMount(NtkLandingHeader, {
      props: { navItems: [], sticky: true },
    })

    expect(wrapper.find('.ntk-landing-header').classes()).toContain('header-sticky')
  })

  it('emits mobile-toggle when mobile button is clicked', async () => {
    const wrapper = shallowMount(NtkLandingHeader, {
      props: { navItems: [] },
    })

    await wrapper.find('.header-mobile-btn').trigger('click')
    expect(wrapper.emitted('mobile-toggle')).toBeTruthy()
    expect((wrapper.emitted('mobile-toggle')?.[0] as unknown[])[0]).toBe(true)
  })

  it('emits nav-click when handleNavClick is called', () => {
    const wrapper = shallowMount(NtkLandingHeader, {
      props: { navItems: [] },
    })

    const item = { label: 'Home', href: '/' }
    ;(wrapper.vm as unknown as { handleNavClick: (i: typeof item) => void }).handleNavClick(item)
    expect(wrapper.emitted('nav-click')?.[0]).toEqual([item])
  })

  it('emits cta-click when handleCtaClick is called', () => {
    const wrapper = shallowMount(NtkLandingHeader, {
      props: { navItems: [] },
    })

    ;(wrapper.vm as unknown as { handleCtaClick: () => void }).handleCtaClick()
    expect(wrapper.emitted('cta-click')).toHaveLength(1)
  })
})

// ─── NtkTechStack ──────────────────────────────────────────────────────────

describe('NtkTechStack', () => {
  const categories = [
    { id: 'frontend', label: 'Frontend', items: ['Vue 3', 'TypeScript', 'Quasar'] },
    { id: 'backend', label: 'Backend', items: ['Node.js', 'PostgreSQL'] },
  ]

  it('renders category cards', () => {
    const wrapper = shallowMount(NtkTechStack, {
      ...sectionSlotStub,
      props: { title: 'Our Stack', categories },
    })

    const cards = wrapper.findAll('.ntk-tech-stack__card')
    expect(cards).toHaveLength(2)
    expect(cards[0]?.find('h3').text()).toBe('Frontend')
    expect(cards[1]?.find('h3').text()).toBe('Backend')
  })

  it('renders chips for each item in a category', () => {
    const wrapper = shallowMount(NtkTechStack, {
      ...sectionSlotStub,
      props: { title: 'Stack', categories: [categories[0]!] },
    })

    const chips = wrapper.findAll('q-chip-stub')
    expect(chips).toHaveLength(3)
    expect(chips[0]?.text()).toBe('Vue 3')
  })

  it('shows item count in category header', () => {
    const wrapper = shallowMount(NtkTechStack, {
      ...sectionSlotStub,
      props: { title: 'Stack', categories: [categories[0]!] },
    })

    expect(wrapper.find('.ntk-tech-stack__card-header small').text()).toBe('3 itens')
  })
})

// ─── NtkContactSection ─────────────────────────────────────────────────────

describe('NtkContactSection', () => {
  it('renders contact channels', () => {
    const wrapper = shallowMount(NtkContactSection, {
      ...sectionSlotStub,
      props: {
        title: 'Contact Us',
        showForm: false,
        channels: [
          { id: 'email', label: 'Email', value: 'hi@example.com', href: 'mailto:hi@example.com' },
          { id: 'phone', label: 'Phone', value: '+55 11 9999-0000' },
        ],
      },
    })

    const channels = wrapper.findAll('.ntk-contact__channel')
    expect(channels).toHaveLength(2)
    expect(channels[0]?.find('strong').text()).toBe('Email')
    expect(channels[1]?.find('strong').text()).toBe('Phone')
  })

  it('shows form when showForm is true', () => {
    const wrapper = shallowMount(NtkContactSection, {
      ...sectionSlotStub,
      props: { title: 'Contact', showForm: true, channels: [] },
    })

    expect(wrapper.find('.ntk-contact__form').exists()).toBe(true)
  })

  it('hides form when showForm is false', () => {
    const wrapper = shallowMount(NtkContactSection, {
      ...sectionSlotStub,
      props: { title: 'Contact', showForm: false, channels: [] },
    })

    expect(wrapper.find('.ntk-contact__form').exists()).toBe(false)
  })

  it('emits submit when submitForm is called with form state', () => {
    const wrapper = shallowMount(NtkContactSection, {
      ...sectionSlotStub,
      props: {
        title: 'Contact',
        showForm: true,
        fields: [
          { id: 'name', label: 'Name', required: true },
          { id: 'email', label: 'Email', required: true },
        ],
        channels: [],
      },
    })

    ;(wrapper.vm as unknown as { submitForm: () => void }).submitForm()
    expect(wrapper.emitted('submit')).toHaveLength(1)
    expect((wrapper.emitted('submit')?.[0] as unknown[])[0]).toMatchObject({ name: '', email: '' })
  })

  it('renders portal action when provided', () => {
    const wrapper = shallowMount(NtkContactSection, {
      ...sectionSlotStub,
      props: {
        title: 'Contact',
        showForm: false,
        channels: [],
        portalAction: { label: 'Access portal', href: '/portal' },
      },
    })

    expect(wrapper.find('.ntk-contact__portal').exists()).toBe(true)
  })
})