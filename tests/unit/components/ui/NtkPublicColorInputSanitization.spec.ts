import { describe, expect, it, vi } from 'vitest'
import { mount, shallowMount } from '@vue/test-utils'

import NtkButton from '../../../../src/components/ui/NtkButton.vue'
import NtkCreditCard from '../../../../src/components/ui/NtkCreditCard.vue'
import NtkFeatureCard from '../../../../src/components/ui/NtkFeatureCard.vue'
import NtkInfoCard from '../../../../src/components/ui/NtkInfoCard.vue'
import NtkLogo from '../../../../src/components/ui/NtkLogo.vue'
import NtkStatCard from '../../../../src/components/ui/NtkStatCard.vue'
import NtkSteps from '../../../../src/components/ui/NtkSteps.vue'

vi.mock('../../../../src/composables/ui/useBranding', () => ({
  useBranding: () => ({
    logo: { value: { value: 'N' } },
    appName: { value: 'NetToolsKit' },
    tagline: { value: 'Toolkit' },
    primaryColor: { value: 'var(--ntk-primary)' },
    secondaryColor: { value: 'var(--ntk-secondary)' },
  }),
}))

const styleOf = (wrapper: ReturnType<typeof mount> | ReturnType<typeof shallowMount>, selector: string): string => (
  wrapper.find(selector).attributes('style') ?? ''
)

describe('public UI color input sanitization', () => {
  it('does not forward NtkButton color to Quasar and tokenizes safe aliases', () => {
    const wrapper = mount(NtkButton, {
      props: { label: 'Save', color: 'primary' },
      global: {
        stubs: {
          'q-btn': { template: '<button data-test="q-btn" v-bind="$attrs"><slot /></button>' },
        },
      },
    })

    const button = wrapper.find('[data-test="q-btn"]')
    expect(button.attributes('color')).toBeUndefined()
    expect(button.classes()).toContain('ntk-button--token-color')
    expect(button.attributes('style')).toContain('--ntk-button-color: var(--ntk-primary)')
  })

  it('drops unsafe NtkButton color literals', () => {
    const wrapper = mount(NtkButton, {
      props: { label: 'Save', color: '#ffffff' },
      global: {
        stubs: {
          'q-btn': { template: '<button data-test="q-btn" v-bind="$attrs"><slot /></button>' },
        },
      },
    })

    const button = wrapper.find('[data-test="q-btn"]')
    expect(button.attributes('color')).toBeUndefined()
    expect(button.classes()).not.toContain('ntk-button--token-color')
    expect(button.attributes('style') ?? '').not.toContain('#ffffff')
  })

  it('sanitizes card color props while preserving CSS variable expressions', () => {
    const feature = shallowMount(NtkFeatureCard, {
      props: { title: 'Feature', iconColor: 'hotpink' },
    })
    expect(styleOf(feature, '.feature-icon')).not.toContain('hotpink')

    const credit = shallowMount(NtkCreditCard, {
      props: {
        icon: 'C',
        name: 'Credits',
        credits: 12,
        iconColor: 'var(--credit-icon-bg)',
        amountColor: 'rgb(1, 2, 3)',
      },
    })
    expect(styleOf(credit, '.credit-icon')).toContain('background-color: var(--credit-icon-bg)')
    expect(styleOf(credit, '.credit-amount')).toContain('color: var(--ntk-primary)')
    expect(styleOf(credit, '.credit-amount')).not.toContain('rgb(1, 2, 3)')
  })

  it('sanitizes step and stat color props before inline styles', () => {
    const steps = shallowMount(NtkSteps, {
      props: {
        steps: [{ title: 'One' }],
        numberColor: '#ff00ff',
      },
    })
    expect(styleOf(steps, '.step-number')).toContain('var(--ntk-primary-gradient)')
    expect(styleOf(steps, '.step-number')).not.toContain('#ff00ff')

    const stat = shallowMount(NtkStatCard, {
      props: {
        value: 42,
        label: 'Users',
        valueColor: 'grey-8',
        icon: 'U',
        iconColor: 'white',
      },
    })
    expect(styleOf(stat, '.stat-number')).toContain('color: var(--ntk-text-secondary)')
    expect(styleOf(stat, '.stat-icon')).toContain('color: var(--ntk-primary)')
    expect(styleOf(stat, '.stat-icon')).not.toContain('white')
  })

  it('sanitizes NtkInfoCard header and icon colors', () => {
    const unsafeHeader = shallowMount(NtkInfoCard, {
      props: { title: 'Info', icon: 'info', headerBg: 'white' },
      global: {
        mocks: { $q: { screen: { xs: false } } },
        stubs: {
          'q-card': { template: '<div><slot /></div>' },
          'q-card-section': { template: '<section v-bind="$attrs"><slot /></section>' },
          'q-card-actions': { template: '<div><slot /></div>' },
          'q-icon': { template: '<span class="q-icon" v-bind="$attrs" />' },
          'q-separator': true,
        },
      },
    })
    expect(unsafeHeader.find('.info-card__header--colored').exists()).toBe(false)

    const safeIcon = shallowMount(NtkInfoCard, {
      props: { title: 'Info', icon: 'info', iconColor: 'var(--safe-icon)' },
      global: {
        mocks: { $q: { screen: { xs: false } } },
        stubs: {
          'q-card': { template: '<div><slot /></div>' },
          'q-card-section': { template: '<section v-bind="$attrs"><slot /></section>' },
          'q-card-actions': { template: '<div><slot /></div>' },
          'q-icon': { template: '<span class="q-icon" v-bind="$attrs" />' },
          'q-separator': true,
        },
      },
    })
    expect(styleOf(safeIcon, '.q-icon')).toContain('color: var(--safe-icon)')
  })

  it('sanitizes NtkLogo icon and text color overrides', () => {
    const wrapper = mount(NtkLogo, {
      props: {
        iconColor: 'rgba(255, 255, 255, 0.8)',
        textColor: 'hotpink',
      },
    })

    expect(styleOf(wrapper, '.logo-icon')).toContain('var(--ntk-primary)')
    expect(styleOf(wrapper, '.logo-icon')).not.toContain('rgba(255')
    expect(styleOf(wrapper, '.logo-text')).toContain('color: var(--ntk-primary)')
    expect(styleOf(wrapper, '.logo-text')).not.toContain('hotpink')
  })
})
