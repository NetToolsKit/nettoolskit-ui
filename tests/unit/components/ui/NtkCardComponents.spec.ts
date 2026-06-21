import { describe, expect, it, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import NtkFeatureCard from '../../../../src/components/ui/NtkFeatureCard.vue'
import NtkPricingCard from '../../../../src/components/ui/NtkPricingCard.vue'
import NtkCreditCard from '../../../../src/components/ui/NtkCreditCard.vue'
import NtkMetricCard from '../../../../src/components/ui/NtkMetricCard.vue'

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

// ─── NtkFeatureCard ────────────────────────────────────────────────────────

describe('NtkFeatureCard', () => {
  it('renders title and description', () => {
    const wrapper = shallowMount(NtkFeatureCard, {
      props: { title: 'REST APIs', description: 'Build and consume RESTful APIs' },
    })

    expect(wrapper.find('.feature-title').text()).toBe('REST APIs')
    expect(wrapper.find('.feature-description').text()).toBe('Build and consume RESTful APIs')
  })

  it('does not render description when not provided', () => {
    const wrapper = shallowMount(NtkFeatureCard, {
      props: { title: 'REST APIs' },
    })

    expect(wrapper.find('.feature-description').exists()).toBe(false)
  })

  it('renders icon text', () => {
    const wrapper = shallowMount(NtkFeatureCard, {
      props: { title: 'APIs', icon: '🔌' },
    })

    expect(wrapper.find('.feature-icon').text()).toContain('🔌')
  })

  it('applies variant, size and iconStyle classes', () => {
    const wrapper = shallowMount(NtkFeatureCard, {
      props: { title: 'T', variant: 'elevated', size: 'lg', iconStyle: 'circle' },
    })

    const classes = wrapper.find('.feature-card').classes()
    expect(classes).toContain('variant-elevated')
    expect(classes).toContain('size-lg')
    expect(wrapper.find('.feature-icon').classes()).toContain('icon-circle')
  })

  it('applies clickable and hoverable classes', () => {
    const wrapper = shallowMount(NtkFeatureCard, {
      props: { title: 'T', clickable: true, hoverable: true },
    })

    const classes = wrapper.find('.feature-card').classes()
    expect(classes).toContain('clickable')
    expect(classes).toContain('hoverable')
  })

  it('emits click when card is clicked and clickable is true', async () => {
    const wrapper = shallowMount(NtkFeatureCard, {
      props: { title: 'T', clickable: true },
    })

    await wrapper.find('.feature-card').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when clickable is false', async () => {
    const wrapper = shallowMount(NtkFeatureCard, {
      props: { title: 'T', clickable: false },
    })

    await wrapper.find('.feature-card').trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})

// ─── NtkPricingCard ────────────────────────────────────────────────────────

const pricingGlobal = {
  global: {
    mocks: { $q: { screen: { xs: false } } },
  },
}

describe('NtkPricingCard', () => {
  const baseProps = {
    title: 'Pro',
    price: '49',
    features: [
      { text: 'Unlimited projects' },
      { text: 'Priority support' },
      { text: 'Legacy API', disabled: true },
    ],
  }

  it('renders title, price and features', () => {
    const wrapper = shallowMount(NtkPricingCard, {
      ...pricingGlobal,
      props: baseProps,
    })

    expect(wrapper.find('.pricing-card__title').text()).toBe('Pro')
    expect(wrapper.find('.pricing-card__amount').text()).toBe('49')
    const features = wrapper.findAll('.pricing-card__feature')
    expect(features).toHaveLength(3)
    expect(features[0]?.text()).toContain('Unlimited projects')
  })

  it('renders currency and period when provided', () => {
    const wrapper = shallowMount(NtkPricingCard, {
      ...pricingGlobal,
      props: { ...baseProps, currency: '$', period: 'mo' },
    })

    expect(wrapper.find('.pricing-card__currency').text()).toBe('$')
    expect(wrapper.find('.pricing-card__period').text()).toBe('/mo')
  })

  it('applies disabled class to disabled features', () => {
    const wrapper = shallowMount(NtkPricingCard, {
      ...pricingGlobal,
      props: baseProps,
    })

    const disabled = wrapper.findAll('.pricing-card__feature--disabled')
    expect(disabled).toHaveLength(1)
  })

  it('shows featured badge when featured is true', () => {
    const wrapper = shallowMount(NtkPricingCard, {
      ...pricingGlobal,
      props: { ...baseProps, featured: true, badgeText: 'Most Popular' },
    })

    expect(wrapper.find('.pricing-card__badge').exists()).toBe(true)
    expect(wrapper.find('.pricing-card__badge').text()).toBe('Most Popular')
  })

  it('emits select when action button is clicked', async () => {
    const wrapper = shallowMount(NtkPricingCard, {
      ...pricingGlobal,
      props: baseProps,
    })

    await wrapper.find('ntk-button-stub').trigger('click')
    expect(wrapper.emitted('select')).toHaveLength(1)
  })
})

// ─── NtkCreditCard ─────────────────────────────────────────────────────────

describe('NtkCreditCard', () => {
  it('renders icon, name and credits', () => {
    const wrapper = shallowMount(NtkCreditCard, {
      props: { icon: '⚡', name: 'API Call', credits: 5 },
    })

    expect(wrapper.find('.credit-icon').text()).toContain('⚡')
    expect(wrapper.find('.credit-name').text()).toBe('API Call')
    expect(wrapper.find('.amount').text()).toBe('5')
  })

  it('renders description when provided', () => {
    const wrapper = shallowMount(NtkCreditCard, {
      props: { icon: '⚡', name: 'API Call', credits: 5, description: 'Standard REST call' },
    })

    expect(wrapper.find('.credit-description').text()).toBe('Standard REST call')
  })

  it('does not render description when not provided', () => {
    const wrapper = shallowMount(NtkCreditCard, {
      props: { icon: '⚡', name: 'API Call', credits: 5 },
    })

    expect(wrapper.find('.credit-description').exists()).toBe(false)
  })

  it('applies variant and hoverable classes', () => {
    const wrapper = shallowMount(NtkCreditCard, {
      props: { icon: '⚡', name: 'T', credits: 1, variant: 'compact', hoverable: true },
    })

    const classes = wrapper.find('.credit-card').classes()
    expect(classes).toContain('variant-compact')
    expect(classes).toContain('hoverable')
  })

  it('renders custom creditLabel', () => {
    const wrapper = shallowMount(NtkCreditCard, {
      props: { icon: '⚡', name: 'T', credits: 10, creditLabel: 'tokens' },
    })

    expect(wrapper.find('.label').text()).toBe('tokens')
  })
})

// ─── NtkMetricCard ─────────────────────────────────────────────────────────

describe('NtkMetricCard', () => {
  const globalOpts = {
    global: {
      stubs: {
        'q-card': { template: '<div class="q-card"><slot /></div>' },
        'q-card-section': { template: '<div class="q-card-section"><slot /></div>' },
        'q-icon': { template: '<span class="q-icon" />' },
      },
    },
  }

  it('renders label and value', () => {
    const wrapper = shallowMount(NtkMetricCard, {
      ...globalOpts,
      props: { label: 'Active Users', value: 1024, icon: 'people' },
    })

    expect(wrapper.find('.metric-card__label').text()).toBe('Active Users')
    expect(wrapper.find('.metric-card__value').text()).toBe('1024')
  })

  it('renders trend with correct type class', () => {
    const wrapper = shallowMount(NtkMetricCard, {
      ...globalOpts,
      props: { label: 'Revenue', value: '$50k', icon: 'attach_money', trend: '+12%', trendType: 'positive' },
    })

    const trend = wrapper.find('.metric-card__trend')
    expect(trend.exists()).toBe(true)
    expect(trend.classes()).toContain('metric-card__trend--positive')
    expect(trend.text()).toContain('+12%')
  })

  it('does not render trend when not provided', () => {
    const wrapper = shallowMount(NtkMetricCard, {
      ...globalOpts,
      props: { label: 'Score', value: 99, icon: 'star' },
    })

    expect(wrapper.find('.metric-card__trend').exists()).toBe(false)
  })
})