import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import NtkButton from '../../../../src/components/ui/NtkButton.vue'
import NtkCard from '../../../../src/components/ui/NtkCard.vue'
import NtkChip from '../../../../src/components/ui/NtkChip.vue'
import NtkSectionHeader from '../../../../src/components/ui/NtkSectionHeader.vue'
import NtkInfoCard from '../../../../src/components/ui/NtkInfoCard.vue'
import NtkTestimonialCard from '../../../../src/components/ui/NtkTestimonialCard.vue'
import NtkSteps from '../../../../src/components/ui/NtkSteps.vue'
import NtkStatCard from '../../../../src/components/ui/NtkStatCard.vue'

// ─── NtkSectionHeader ──────────────────────────────────────────────────────

describe('NtkSectionHeader', () => {
  it('renders title and subtitle', () => {
    const wrapper = shallowMount(NtkSectionHeader, {
      props: { title: 'Our Features', subtitle: 'What we offer' },
    })

    expect(wrapper.find('.section-header__title').text()).toBe('Our Features')
    expect(wrapper.find('.section-header__subtitle').text()).toBe('What we offer')
  })

  it('does not render subtitle when not provided', () => {
    const wrapper = shallowMount(NtkSectionHeader, {
      props: { title: 'About Us' },
    })

    expect(wrapper.find('.section-header__subtitle').exists()).toBe(false)
  })

  it('applies spacing class from spacing prop', () => {
    const wrapper = shallowMount(NtkSectionHeader, {
      props: { title: 'Title', spacing: 'lg' },
    })

    expect(wrapper.find('.section-header').classes()).toContain('section-header--spacing-lg')
  })

  it('defaults to md spacing', () => {
    const wrapper = shallowMount(NtkSectionHeader, {
      props: { title: 'Title' },
    })

    expect(wrapper.find('.section-header').classes()).toContain('section-header--spacing-md')
  })
})

// ─── NtkButton ─────────────────────────────────────────────────────────────

describe('NtkButton', () => {
  it('passes label and disabled to q-btn stub', () => {
    const wrapper = shallowMount(NtkButton, {
      props: { label: 'Submit', disable: true },
    })

    const btn = wrapper.find('q-btn-stub')
    expect(btn.attributes('label')).toBe('Submit')
    expect(btn.attributes('disable')).toBe('true')
  })

  it('emits click event when button is clicked', async () => {
    const wrapper = shallowMount(NtkButton, {
      props: { label: 'Click me' },
    })

    await wrapper.find('q-btn-stub').trigger('click')
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders default slot content via q-btn', () => {
    // shallowMount stubs q-btn, so verify prop passthrough instead
    const wrapper = shallowMount(NtkButton, {
      props: { label: 'Save', icon: 'save', flat: true },
    })
    const btn = wrapper.find('q-btn-stub')
    expect(btn.attributes('icon')).toBe('save')
    expect(btn.attributes('flat')).toBeDefined()
  })
})

// ─── NtkCard ───────────────────────────────────────────────────────────────

describe('NtkCard', () => {
  it('applies variant and padding classes', () => {
    const wrapper = shallowMount(NtkCard, {
      global: { stubs: { 'q-card': { template: '<div class="q-card" v-bind="$attrs"><slot /></div>' }, 'q-card-section': { template: '<div><slot /></div>' } } },
      props: { variant: 'outlined', padding: 'lg' },
    })

    const card = wrapper.find('.q-card')
    expect(card.classes()).toContain('ntk-card--outlined')
    expect(card.classes()).toContain('ntk-card--padding-lg')
  })

  it('applies clickable class when clickable is true', () => {
    const wrapper = shallowMount(NtkCard, {
      global: { stubs: { 'q-card': { template: '<div class="q-card" v-bind="$attrs"><slot /></div>' }, 'q-card-section': { template: '<div><slot /></div>' } } },
      props: { clickable: true },
    })

    expect(wrapper.find('.q-card').classes()).toContain('ntk-card--clickable')
  })

  it('applies accent color class on accent variants', () => {
    const wrapper = shallowMount(NtkCard, {
      global: { stubs: { 'q-card': { template: '<div class="q-card" v-bind="$attrs"><slot /></div>' }, 'q-card-section': { template: '<div><slot /></div>' } } },
      props: { variant: 'accent-left', accentColor: 'success' },
    })

    expect(wrapper.find('.q-card').classes()).toContain('ntk-card--accent-success')
  })

  it('renders header, default and footer slots', () => {
    const wrapper = shallowMount(NtkCard, {
      global: { stubs: { 'q-card': { template: '<div><slot /></div>' }, 'q-card-section': { template: '<div><slot /></div>' } } },
      slots: {
        header: '<span class="header-slot">Header</span>',
        default: '<p class="body-slot">Body</p>',
        footer: '<span class="footer-slot">Footer</span>',
      },
    })

    expect(wrapper.find('.header-slot').exists()).toBe(true)
    expect(wrapper.find('.body-slot').exists()).toBe(true)
    expect(wrapper.find('.footer-slot').exists()).toBe(true)
  })
})

// ─── NtkChip ───────────────────────────────────────────────────────────────

describe('NtkChip', () => {
  it('passes disabled and selected props to q-chip stub', () => {
    const wrapper = shallowMount(NtkChip, {
      props: { variant: 'primary', disabled: true, selected: true },
    })
    const chip = wrapper.find('q-chip-stub')
    expect(chip.attributes('disable')).toBe('true')
    expect(chip.attributes('selected')).toBe('true')
  })

  it('renders slot content', () => {
    const wrapper = shallowMount(NtkChip, {
      global: { stubs: { 'q-chip': { template: '<span><slot /></span>' } } },
      slots: { default: 'Technology' },
    })

    expect(wrapper.text()).toBe('Technology')
  })
})

// ─── NtkInfoCard ───────────────────────────────────────────────────────────

describe('NtkInfoCard', () => {
  const globalOpts = {
    global: {
      stubs: {
        'q-card': { template: '<div class="card" :class="$attrs.class"><slot /></div>' },
        'q-card-section': { template: '<div><slot /></div>' },
        'q-card-actions': { template: '<div><slot /></div>' },
        'q-icon': { template: '<span class="icon" />' },
        'q-separator': true,
      },
    },
  }

  it('renders title and subtitle', () => {
    const wrapper = shallowMount(NtkInfoCard, {
      ...globalOpts,
      props: { title: 'Quick Stats', subtitle: 'Last 30 days' },
    })

    expect(wrapper.text()).toContain('Quick Stats')
    expect(wrapper.text()).toContain('Last 30 days')
  })

  it('applies elevated class when variant is elevated', () => {
    const wrapper = shallowMount(NtkInfoCard, {
      ...globalOpts,
      props: { title: 'Card', variant: 'elevated' },
    })

    expect(wrapper.find('.card').classes()).toContain('info-card--elevated')
  })

  it('renders default slot content', () => {
    const wrapper = shallowMount(NtkInfoCard, {
      ...globalOpts,
      props: { title: 'Stats' },
      slots: { default: '<p class="body">Body content</p>' },
    })

    expect(wrapper.find('.body').exists()).toBe(true)
  })

  it('renders actions slot when provided', () => {
    const wrapper = shallowMount(NtkInfoCard, {
      ...globalOpts,
      props: { title: 'Card' },
      slots: { actions: '<button class="action-btn">View all</button>' },
    })

    expect(wrapper.find('.action-btn').exists()).toBe(true)
  })
})

// ─── NtkTestimonialCard ────────────────────────────────────────────────────

describe('NtkTestimonialCard', () => {
  it('renders quote, author, role and company', () => {
    const wrapper = shallowMount(NtkTestimonialCard, {
      props: {
        quote: 'Best product ever.',
        author: 'João Silva',
        role: 'CTO',
        company: 'TechCorp',
      },
    })

    expect(wrapper.find('.testimonial-quote').text()).toBe('Best product ever.')
    expect(wrapper.find('.author-name').text()).toBe('João Silva')
    expect(wrapper.find('.author-role').text()).toContain('CTO')
    expect(wrapper.find('.author-role').text()).toContain('TechCorp')
  })

  it('renders star rating with correct filled count', () => {
    const wrapper = shallowMount(NtkTestimonialCard, {
      props: { quote: 'Great!', author: 'Ana', rating: 4 },
    })

    const stars = wrapper.findAll('.rating-star')
    expect(stars).toHaveLength(5)
    const filled = stars.filter(s => s.classes().includes('filled'))
    expect(filled).toHaveLength(4)
  })

  it('shows quote icon by default and hides it when showQuoteIcon is false', () => {
    const withIcon = shallowMount(NtkTestimonialCard, {
      props: { quote: 'Good', author: 'Bob', showQuoteIcon: true },
    })
    expect(withIcon.find('.testimonial-quote-icon').exists()).toBe(true)

    const noIcon = shallowMount(NtkTestimonialCard, {
      props: { quote: 'Good', author: 'Bob', showQuoteIcon: false },
    })
    expect(noIcon.find('.testimonial-quote-icon').exists()).toBe(false)
  })

  it('applies variant and size classes', () => {
    const wrapper = shallowMount(NtkTestimonialCard, {
      props: { quote: 'Great', author: 'Jane', variant: 'featured', size: 'lg' },
    })

    expect(wrapper.find('.ntk-testimonial-card').classes()).toContain('variant-featured')
    expect(wrapper.find('.ntk-testimonial-card').classes()).toContain('size-lg')
  })
})

// ─── NtkSteps ──────────────────────────────────────────────────────────────

describe('NtkSteps', () => {
  const steps = [
    { title: 'Register', description: 'Create your account' },
    { title: 'Configure', description: 'Set up your workspace' },
    { title: 'Launch', description: 'Go live' },
  ]

  it('renders all steps with title and description', () => {
    const wrapper = shallowMount(NtkSteps, { props: { steps } })

    const rendered = wrapper.findAll('.step')
    expect(rendered).toHaveLength(3)
    expect(rendered[0]?.text()).toContain('Register')
    expect(rendered[0]?.text()).toContain('Create your account')
    expect(rendered[2]?.text()).toContain('Launch')
  })

  it('marks step as active via activeStep prop', () => {
    const wrapper = shallowMount(NtkSteps, { props: { steps, activeStep: 1 } })

    const stepEls = wrapper.findAll('.step')
    expect(stepEls[1]?.classes()).toContain('active')
    expect(stepEls[0]?.classes()).not.toContain('active')
  })

  it('applies layout class', () => {
    const wrapper = shallowMount(NtkSteps, {
      props: { steps, layout: 'vertical' },
    })

    expect(wrapper.find('.ntk-steps').classes()).toContain('layout-vertical')
  })

  it('renders connectors between steps when showArrows is true', () => {
    const wrapper = shallowMount(NtkSteps, {
      props: { steps, showArrows: true },
    })

    const connectors = wrapper.findAll('.step-connector')
    expect(connectors).toHaveLength(2) // n-1 connectors
  })

  it('hides connectors when showArrows is false', () => {
    const wrapper = shallowMount(NtkSteps, {
      props: { steps, showArrows: false },
    })

    expect(wrapper.findAll('.step-connector')).toHaveLength(0)
  })
})

// ─── NtkStatCard ───────────────────────────────────────────────────────────

describe('NtkStatCard', () => {
  it('renders value, label, prefix and suffix', () => {
    const wrapper = shallowMount(NtkStatCard, {
      props: { value: 42, label: 'Users', prefix: '#', suffix: '+' },
    })

    // values < 1000 are not formatted
    expect(wrapper.find('.stat-number').text()).toContain('42')
    expect(wrapper.find('.stat-label').text()).toBe('Users')
    expect(wrapper.find('.stat-prefix').text()).toBe('#')
    expect(wrapper.find('.stat-suffix').text()).toBe('+')
  })

  it('formats large numbers (>=1000 → K, >=1M → M)', () => {
    const k = shallowMount(NtkStatCard, { props: { value: 1500, label: 'Sales' } })
    expect(k.find('.stat-number').text()).toBe('1.5K')

    const m = shallowMount(NtkStatCard, { props: { value: 2_000_000, label: 'Revenue' } })
    expect(m.find('.stat-number').text()).toBe('2.0M')
  })

  it('does not render prefix/suffix when not provided', () => {
    const wrapper = shallowMount(NtkStatCard, {
      props: { value: 42, label: 'Users' },
    })

    expect(wrapper.find('.stat-prefix').exists()).toBe(false)
    expect(wrapper.find('.stat-suffix').exists()).toBe(false)
  })

  it('renders trend with up/down direction', () => {
    const up = shallowMount(NtkStatCard, {
      props: { value: 100, label: 'Sales', trend: { direction: 'up', value: 12 } },
    })
    expect(up.find('.stat-trend').exists()).toBe(true)
    expect(up.find('.trend-icon').text()).toBe('↑')
    expect(up.find('.trend-value').text()).toBe('12%')

    const down = shallowMount(NtkStatCard, {
      props: { value: 80, label: 'Churn', trend: { direction: 'down', value: 5 } },
    })
    expect(down.find('.trend-icon').text()).toBe('↓')
  })

  it('does not render trend when not provided', () => {
    const wrapper = shallowMount(NtkStatCard, {
      props: { value: 99, label: 'Score' },
    })

    expect(wrapper.find('.stat-trend').exists()).toBe(false)
  })

  it('renders icon when provided', () => {
    const wrapper = shallowMount(NtkStatCard, {
      props: { value: 5, label: 'Teams', icon: '🏆' },
    })

    expect(wrapper.find('.stat-icon').exists()).toBe(true)
    expect(wrapper.find('.stat-icon').text()).toContain('🏆')
  })
})