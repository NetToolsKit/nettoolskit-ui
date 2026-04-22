import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import DashboardTemplate from '../../../src/templates/pages/dashboard/DashboardTemplate.vue'

const globalMountOptions = {
  global: {
    renderStubDefaultSlot: true,
    stubs: {
      'q-page': { template: '<div><slot /></div>' },
      'q-card': { template: '<div><slot /></div>' },
      'q-card-section': { template: '<div><slot /></div>' },
      'q-icon': { template: '<span />' },
    },
  },
}

describe('DashboardTemplate', () => {
  it('renders title, subtitle, chips and metrics from props', () => {
    const wrapper = shallowMount(DashboardTemplate, {
      ...globalMountOptions,
      props: {
        title: 'Operations Dashboard',
        subtitle: 'Live system metrics',
        chips: [{ id: 'c1', text: '247 clients', icon: 'people' }],
        metrics: [
          { id: 'm1', label: 'Orders today', value: 18, icon: 'shopping_cart', tone: 'primary' },
          { id: 'm2', label: 'Cancelled', value: 3, icon: 'cancel', tone: 'danger' },
        ],
      },
    })

    expect(wrapper.text()).toContain('Operations Dashboard')
    expect(wrapper.text()).toContain('Live system metrics')
    expect(wrapper.text()).toContain('247 clients')
    expect(wrapper.text()).toContain('Orders today')
    expect(wrapper.text()).toContain('18')
    expect(wrapper.text()).toContain('Cancelled')

    const metricEls = wrapper.findAll('.ntk-template-dashboard__metric')
    expect(metricEls).toHaveLength(2)
    expect(metricEls[0]?.classes()).toContain('ntk-template-dashboard__metric--primary')
    expect(metricEls[1]?.classes()).toContain('ntk-template-dashboard__metric--danger')
  })

  it('renders activity list and top items', () => {
    const wrapper = shallowMount(DashboardTemplate, {
      ...globalMountOptions,
      props: {
        activityTitle: 'Recent activity',
        topItemsTitle: 'Top clients',
        activities: [
          { id: 'a1', label: 'Orders today', value: 18, icon: 'today' },
          { id: 'a2', label: 'Revenue this month', value: 'R$ 156.780' },
        ],
        topItems: [
          { id: 't1', name: 'Distribuidora Alfa', value: 45, secondaryValue: 'R$ 32.500' },
          { id: 't2', name: 'Comercio Beta', value: 38 },
        ],
      },
    })

    expect(wrapper.text()).toContain('Recent activity')
    expect(wrapper.text()).toContain('Top clients')
    expect(wrapper.text()).toContain('Orders today')
    expect(wrapper.text()).toContain('R$ 156.780')
    expect(wrapper.text()).toContain('Distribuidora Alfa')
    expect(wrapper.text()).toContain('R$ 32.500')

    const topRows = wrapper.findAll('.ntk-template-dashboard__top-row')
    expect(topRows).toHaveLength(2)
    const ranks = wrapper.findAll('.ntk-template-dashboard__top-rank')
    expect(ranks[0]?.text()).toBe('1')
    expect(ranks[1]?.text()).toBe('2')
  })

  it('renders barPercent progress bar when provided on top items', () => {
    const wrapper = shallowMount(DashboardTemplate, {
      ...globalMountOptions,
      props: {
        topItems: [
          { id: 't1', name: 'Alpha', value: 100, barPercent: 80 },
          { id: 't2', name: 'Beta', value: 50 },
        ],
      },
    })

    const bars = wrapper.findAll('.ntk-template-dashboard__top-bar-fill')
    expect(bars).toHaveLength(1)
    expect(bars[0]?.attributes('style')).toContain('width: 80%')

    const tracks = wrapper.findAll('.ntk-template-dashboard__top-bar-track')
    expect(tracks).toHaveLength(1)
  })

  it('clamps barPercent to [2, 100] range', () => {
    const wrapper = shallowMount(DashboardTemplate, {
      ...globalMountOptions,
      props: {
        topItems: [
          { id: 't1', name: 'Zero', value: 0, barPercent: 0 },
          { id: 't2', name: 'Over', value: 999, barPercent: 150 },
        ],
      },
    })

    const bars = wrapper.findAll('.ntk-template-dashboard__top-bar-fill')
    expect(bars[0]?.attributes('style')).toContain('width: 2%')
    expect(bars[1]?.attributes('style')).toContain('width: 100%')
  })

  it('renders the charts slot when provided', () => {
    const wrapper = shallowMount(DashboardTemplate, {
      ...globalMountOptions,
      slots: {
        charts: '<div class="custom-chart">Chart content</div>',
      },
    })

    expect(wrapper.find('.ntk-template-dashboard__charts').exists()).toBe(true)
    expect(wrapper.find('.custom-chart').exists()).toBe(true)
    expect(wrapper.text()).toContain('Chart content')
  })

  it('does not render charts section when slot is empty', () => {
    const wrapper = shallowMount(DashboardTemplate, {
      ...globalMountOptions,
    })

    expect(wrapper.find('.ntk-template-dashboard__charts').exists()).toBe(false)
  })

  it('renders greetingIcon before the title', () => {
    const wrapper = shallowMount(DashboardTemplate, {
      ...globalMountOptions,
      props: { title: 'Good morning, John', greetingIcon: '☀️' },
    })

    const icon = wrapper.find('.ntk-template-dashboard__greeting-icon')
    expect(icon.exists()).toBe(true)
    expect(icon.text()).toBe('☀️')
    expect(wrapper.find('.ntk-template-dashboard__title').text()).toBe('Good morning, John')
  })

  it('does not render greeting-icon element when greetingIcon is not set', () => {
    const wrapper = shallowMount(DashboardTemplate, { ...globalMountOptions })

    expect(wrapper.find('.ntk-template-dashboard__greeting-icon').exists()).toBe(false)
  })

  it('renders activity items with iconTone color class', () => {
    const wrapper = shallowMount(DashboardTemplate, {
      ...globalMountOptions,
      props: {
        activities: [
          { id: 'a1', label: 'Orders today', value: 18, icon: 'today', iconTone: 'blue' },
          { id: 'a2', label: 'Revenue', value: 'R$ 1.200', icon: 'attach_money', iconTone: 'green' },
        ],
      },
    })

    const icons = wrapper.findAll('.ntk-template-dashboard__activity-icon')
    expect(icons[0]?.classes()).toContain('ntk-template-dashboard__activity-icon--blue')
    expect(icons[1]?.classes()).toContain('ntk-template-dashboard__activity-icon--green')
  })

  it('renders avatar on top items when avatar is set', () => {
    const wrapper = shallowMount(DashboardTemplate, {
      ...globalMountOptions,
      props: {
        topItems: [
          { id: 't1', name: 'Distribuidora Alfa', value: 45, avatar: 'DA' },
          { id: 't2', name: 'Comercio Beta', value: 38 },
        ],
      },
    })

    const avatars = wrapper.findAll('.ntk-template-dashboard__top-avatar')
    expect(avatars).toHaveLength(1)
    expect(avatars[0]?.text()).toBe('DA')
  })
})
