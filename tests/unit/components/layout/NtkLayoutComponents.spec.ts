import { describe, expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import NtkSection from '../../../../src/components/layout/NtkSection.vue'
import NtkMobileDrawer from '../../../../src/components/layout/NtkMobileDrawer.vue'
import NtkServiceGrid from '../../../../src/components/layout/NtkServiceGrid.vue'
import NtkStatsSection from '../../../../src/components/layout/NtkStatsSection.vue'

vi.mock('../../../../src/composables/ui/useTheme', () => ({
  useTheme: () => ({
    theme: { value: { gradients: { primary: 'linear-gradient(90deg, #0f172a, #334155)' } } },
  }),
}))

// ─── NtkSection ────────────────────────────────────────────────────────────

describe('NtkSection', () => {
  it('renders title, subtitle and badge', () => {
    const wrapper = shallowMount(NtkSection, {
      props: { title: 'Features', subtitle: 'What we offer', badge: 'New' },
    })

    expect(wrapper.find('.ntk-section__title').text()).toBe('Features')
    expect(wrapper.find('.ntk-section__subtitle').text()).toBe('What we offer')
    expect(wrapper.find('.ntk-section__badge').text()).toBe('New')
  })

  it('does not render header block when no title/subtitle/badge/slot provided', () => {
    const wrapper = shallowMount(NtkSection, {
      props: { title: '', subtitle: '', badge: '' },
    })

    expect(wrapper.find('.ntk-section__header').exists()).toBe(false)
  })

  it('applies variant class', () => {
    const wrapper = shallowMount(NtkSection, {
      props: { title: 'T', variant: 'dark' },
    })

    expect(wrapper.find('.ntk-section').classes()).toContain('ntk-section--dark')
  })

  it('applies size class', () => {
    const wrapper = shallowMount(NtkSection, {
      props: { title: 'T', size: 'xl' },
    })

    expect(wrapper.find('.ntk-section').classes()).toContain('ntk-section--xl')
  })

  it('applies centered class by default', () => {
    const wrapper = shallowMount(NtkSection, {
      props: { title: 'T' },
    })

    expect(wrapper.find('.ntk-section').classes()).toContain('ntk-section--centered')
  })

  it('applies fullWidth container class when fullWidth is true', () => {
    const wrapper = shallowMount(NtkSection, {
      props: { title: 'T', fullWidth: true },
    })

    expect(wrapper.find('.ntk-section__container').classes()).toContain('ntk-section__container--full-width')
  })

  it('renders default slot content', () => {
    const wrapper = shallowMount(NtkSection, {
      props: { title: 'T' },
      slots: { default: '<p class="body">Body</p>' },
    })

    expect(wrapper.find('.body').exists()).toBe(true)
  })

  it('renders footer slot when provided', () => {
    const wrapper = shallowMount(NtkSection, {
      props: { title: 'T' },
      slots: { footer: '<span class="footer-slot">Footer</span>' },
    })

    expect(wrapper.find('.footer-slot').exists()).toBe(true)
  })

  it('applies tokenized bgColor as inline style', () => {
    const wrapper = shallowMount(NtkSection, {
      props: { title: 'T', bgColor: 'surface-muted' },
    })

    expect(wrapper.find('.ntk-section').attributes('style')).toContain('background-color: var(--ntk-bg-secondary)')
  })
})

// ─── NtkMobileDrawer ───────────────────────────────────────────────────────

describe('NtkMobileDrawer', () => {
  const globalOpts = {
    global: {
      stubs: {
        'q-drawer': { template: '<div class="q-drawer"><slot /></div>' },
        'q-icon': { template: '<span class="icon" />' },
      },
    },
  }

  it('renders nav items with labels', () => {
    const wrapper = shallowMount(NtkMobileDrawer, {
      ...globalOpts,
      props: {
        modelValue: true,
        navItems: [
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    })

    const items = wrapper.findAll('.drawer-nav-item')
    expect(items).toHaveLength(3)
    expect(items[0]?.text()).toContain('Home')
    expect(items[2]?.text()).toContain('Contact')
  })

  it('emits update:modelValue false when compress button is clicked', async () => {
    const wrapper = shallowMount(NtkMobileDrawer, {
      ...globalOpts,
      props: { modelValue: true, navItems: [] },
    })

    await wrapper.find('.drawer-compress-btn').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('emits nav-click when a nav item is clicked', async () => {
    const item = { label: 'Features', href: '#features' }
    const wrapper = shallowMount(NtkMobileDrawer, {
      ...globalOpts,
      props: { modelValue: true, navItems: [item] },
    })

    await wrapper.find('.drawer-nav-item').trigger('click')
    expect(wrapper.emitted('nav-click')?.[0]).toEqual([item])
  })

  it('emits cta-click when CTA button is clicked', async () => {
    const wrapper = shallowMount(NtkMobileDrawer, {
      ...globalOpts,
      props: { modelValue: true, navItems: [], ctaText: 'Get Started', ctaLink: '/signup' },
    })

    await wrapper.find('.drawer-cta-btn').trigger('click')
    expect(wrapper.emitted('cta-click')).toHaveLength(1)
  })

  it('does not render CTA when ctaText is empty', () => {
    const wrapper = shallowMount(NtkMobileDrawer, {
      ...globalOpts,
      props: { modelValue: true, navItems: [], ctaText: '' },
    })

    expect(wrapper.find('.drawer-cta-container').exists()).toBe(false)
  })

  it('renders compress button with custom label', () => {
    const wrapper = shallowMount(NtkMobileDrawer, {
      ...globalOpts,
      props: { modelValue: true, navItems: [], compressLabel: 'Close menu' },
    })

    expect(wrapper.find('.drawer-compress-btn').text()).toContain('Close menu')
  })
})

// ─── NtkServiceGrid ────────────────────────────────────────────────────────

// NtkServiceGrid and NtkStatsSection wrap all content inside NtkSection.
// shallowMount stubs NtkSection and won't render its slots without a custom stub.
const sectionSlotStub = {
  global: {
    stubs: {
      NtkSection: { template: '<div><slot name="header" /><slot /></div>' },
    },
  },
}

describe('NtkServiceGrid', () => {
  it('renders a NtkFeatureCard stub per service', () => {
    const wrapper = shallowMount(NtkServiceGrid, {
      ...sectionSlotStub,
      props: {
        title: 'Our Services',
        services: [
          { id: 's1', title: 'API', description: 'REST APIs' },
          { id: 's2', title: 'SDK', description: 'Client SDKs' },
          { id: 's3', title: 'Docs', description: 'Documentation' },
        ],
      },
    })

    expect(wrapper.findAll('ntk-feature-card-stub')).toHaveLength(3)
  })

  it('passes title and description to NtkFeatureCard stubs', () => {
    const wrapper = shallowMount(NtkServiceGrid, {
      ...sectionSlotStub,
      props: {
        title: 'Services',
        services: [{ id: 'a', title: 'Monitoring', description: 'Real-time observability' }],
      },
    })

    const card = wrapper.find('ntk-feature-card-stub')
    expect(card.attributes('title')).toBe('Monitoring')
    expect(card.attributes('description')).toBe('Real-time observability')
  })

  it('uses formatted index as icon fallback when service has no icon', () => {
    const wrapper = shallowMount(NtkServiceGrid, {
      ...sectionSlotStub,
      props: {
        title: 'S',
        services: [{ id: 'x', title: 'Item', description: 'Desc' }],
      },
    })

    expect(wrapper.find('ntk-feature-card-stub').attributes('icon')).toBe('01')
  })
})

// ─── NtkStatsSection ───────────────────────────────────────────────────────

describe('NtkStatsSection', () => {
  it('renders a NtkStatCard stub per item', () => {
    const wrapper = shallowMount(NtkStatsSection, {
      ...sectionSlotStub,
      props: {
        title: 'Key Metrics',
        items: [
          { id: 'm1', value: 100, label: 'Users' },
          { id: 'm2', value: 50, label: 'Deployments' },
        ],
      },
    })

    expect(wrapper.findAll('ntk-stat-card-stub')).toHaveLength(2)
  })

  it('passes value and label to NtkStatCard stubs', () => {
    const wrapper = shallowMount(NtkStatsSection, {
      ...sectionSlotStub,
      props: {
        title: 'Metrics',
        items: [{ id: 'k1', value: 99, label: 'Uptime' }],
      },
    })

    const card = wrapper.find('ntk-stat-card-stub')
    expect(card.attributes('value')).toBe('99')
    expect(card.attributes('label')).toBe('Uptime')
  })

  it('renders section title via NtkSectionHeader', () => {
    const wrapper = shallowMount(NtkStatsSection, {
      ...sectionSlotStub,
      props: { title: 'Our Numbers', items: [] },
    })

    const header = wrapper.find('ntk-section-header-stub')
    expect(header.attributes('title')).toBe('Our Numbers')
  })
})
