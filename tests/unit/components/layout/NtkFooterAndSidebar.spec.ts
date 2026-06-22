import { describe, expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import NtkFooter from '../../../../src/components/layout/NtkFooter.vue'
import NtkSidebar from '../../../../src/components/layout/NtkSidebar.vue'

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

// ─── NtkFooter ─────────────────────────────────────────────────────────────

describe('NtkFooter', () => {
  const globalOpts = {
    global: {
      stubs: { 'q-icon': { template: '<span class="icon" />' } },
    },
  }

  it('renders brand name', () => {
    const wrapper = shallowMount(NtkFooter, {
      ...globalOpts,
      props: { brandName: 'AcmeCorp', linkSections: [] },
    })

    expect(wrapper.find('.ntk-footer__logo').text()).toBe('AcmeCorp')
  })

  it('renders brand description when provided', () => {
    const wrapper = shallowMount(NtkFooter, {
      ...globalOpts,
      props: { brandName: 'AcmeCorp', brandDescription: 'We build software', linkSections: [] },
    })

    expect(wrapper.find('.ntk-footer__description').text()).toBe('We build software')
  })

  it('applies variant class', () => {
    const wrapper = shallowMount(NtkFooter, {
      ...globalOpts,
      props: { brandName: 'B', linkSections: [], variant: 'light' },
    })

    expect(wrapper.find('.ntk-footer').classes()).toContain('ntk-footer--light')
  })

  it('renders link sections with links', () => {
    const wrapper = shallowMount(NtkFooter, {
      ...globalOpts,
      props: {
        brandName: 'B',
        linkSections: [
          {
            title: 'Product',
            links: [
              { label: 'Features', href: '/features' },
              { label: 'Pricing', href: '/pricing' },
            ],
          },
        ],
      },
    })

    expect(wrapper.find('.ntk-footer__link-title').text()).toBe('Product')
    const links = wrapper.findAll('.ntk-footer__link')
    expect(links).toHaveLength(2)
    expect(links[0]?.text()).toBe('Features')
  })

  it('renders custom copyright text', () => {
    const wrapper = shallowMount(NtkFooter, {
      ...globalOpts,
      props: { brandName: 'B', linkSections: [], copyrightText: '© 2026 B Corp' },
    })

    expect(wrapper.text()).toContain('© 2026 B Corp')
  })

  it('renders social links when provided', () => {
    const wrapper = shallowMount(NtkFooter, {
      ...globalOpts,
      props: {
        brandName: 'B',
        linkSections: [],
        socialLinks: [{ label: 'GitHub', href: 'https://github.com', icon: 'fab fa-github' }],
      },
    })

    const socialLink = wrapper.find('.ntk-footer__social-link')
    expect(socialLink.exists()).toBe(true)
    expect(socialLink.attributes('aria-label')).toBe('GitHub')
  })
})

// ─── NtkSidebar ────────────────────────────────────────────────────────────

describe('NtkSidebar', () => {
  const globalOpts = {
    global: {
      renderStubDefaultSlot: true,
      stubs: {
        'q-drawer': { template: '<div class="q-drawer"><slot /></div>' },
        'q-scroll-area': { template: '<div><slot /></div>' },
        'q-list': { template: '<ul><slot /></ul>' },
        'q-item': { template: '<li class="q-item" v-bind="$attrs" @click="$emit(\'click\')"><slot /></li>' },
        'q-item-section': { template: '<div><slot /></div>' },
        'q-item-label': { template: '<span><slot /></span>' },
        'q-icon': { template: '<span class="icon" />' },
        'q-badge': { template: '<span class="badge" />' },
        'q-separator': true,
      },
    },
  }

  const items = [
    { id: 'dash', label: 'Dashboard', icon: 'dashboard', to: '/dashboard' },
    { id: 'settings', label: 'Settings', icon: 'settings', to: '/settings' },
  ]

  it('renders navigation items', () => {
    const wrapper = shallowMount(NtkSidebar, {
      ...globalOpts,
      props: { modelValue: true, items, showToggle: false },
    })

    expect(wrapper.findAll('.q-item')).toHaveLength(2)
  })

  it('renders brand name in header when provided', () => {
    const wrapper = shallowMount(NtkSidebar, {
      ...globalOpts,
      props: { modelValue: true, items: [], showToggle: false, brandName: 'MyApp' },
    })

    expect(wrapper.find('.ntk-sidebar__brand').text()).toBe('MyApp')
  })

  it('emits item-click when handleItemClick is called', () => {
    const wrapper = shallowMount(NtkSidebar, {
      ...globalOpts,
      props: { modelValue: true, items, showToggle: false },
    })

    const item = items[0]!
    ;(wrapper.vm as unknown as { handleItemClick: (i: typeof item) => void }).handleItemClick(item)
    expect(wrapper.emitted('item-click')).toHaveLength(1)
    expect((wrapper.emitted('item-click')?.[0] as unknown[])[0]).toMatchObject({ id: 'dash' })
  })
})
