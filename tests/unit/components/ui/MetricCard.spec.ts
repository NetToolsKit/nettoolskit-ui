import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NtkMetricCard from '../../../../src/components/ui/NtkMetricCard.vue'

describe('NtkMetricCard', () => {
  describe('Props - Basic Rendering', () => {
    it('should render label', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total Users',
          value: '1,234',
          icon: 'people'
        }
      })
      expect(wrapper.find('.metric-card__label').text()).toBe('Total Users')
    })

    it('should render value as string', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '1,234',
          icon: 'people'
        }
      })
      expect(wrapper.find('.metric-card__value').text()).toBe('1,234')
    })

    it('should render value as number', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: 1234,
          icon: 'people'
        }
      })
      expect(wrapper.find('.metric-card__value').text()).toBe('1234')
    })

    it('should render icon with correct name', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '100',
          icon: 'analytics'
        }
      })
      const icon = wrapper.findAll('.q-icon').at(-1)
      expect(icon?.exists()).toBe(true)
    })

    it('should render icon with 3rem size', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '100',
          icon: 'people'
        }
      })
      expect(wrapper.find('.metric-card__icon').exists()).toBe(true)
    })
  })

  describe('Props - Trend Optional', () => {
    it('should not render trend section when trend not provided', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '100',
          icon: 'people'
        }
      })
      expect(wrapper.find('.metric-card__trend').exists()).toBe(false)
    })

    it('should render trend text when provided', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '100',
          icon: 'people',
          trend: '+15%'
        }
      })
      const trendElement = wrapper.find('.metric-card__trend')
      expect(trendElement.exists()).toBe(true)
      expect(trendElement.text()).toContain('+15%')
    })

    it('should render two QIcon elements when trend provided', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '100',
          icon: 'people',
          trend: '+15%'
        }
      })
      const icons = wrapper.findAll('.q-icon')
      expect(icons.length).toBe(2)
    })

    it('should render one QIcon element when trend not provided', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '100',
          icon: 'people'
        }
      })
      const icons = wrapper.findAll('.q-icon')
      expect(icons.length).toBe(1)
    })
  })

  describe('Props - TrendType', () => {
    it('should default to neutral trendType', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '100',
          icon: 'people',
          trend: '+5%'
        }
      })
      const trend = wrapper.find('.metric-card__trend')
      expect(trend.classes()).toContain('metric-card__trend--neutral')
    })

    it('should apply positive trendType class', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '100',
          icon: 'people',
          trend: '+15%',
          trendType: 'positive'
        }
      })
      const trend = wrapper.find('.metric-card__trend')
      expect(trend.classes()).toContain('metric-card__trend--positive')
    })

    it('should apply negative trendType class', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '100',
          icon: 'people',
          trend: '-10%',
          trendType: 'negative'
        }
      })
      const trend = wrapper.find('.metric-card__trend')
      expect(trend.classes()).toContain('metric-card__trend--negative')
    })

    it('should apply neutral trendType class explicitly', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '100',
          icon: 'people',
          trend: '0%',
          trendType: 'neutral'
        }
      })
      const trend = wrapper.find('.metric-card__trend')
      expect(trend.classes()).toContain('metric-card__trend--neutral')
    })
  })

  describe('Structure', () => {
    it('should have metric-card root class', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '100',
          icon: 'people'
        }
      })
      expect(wrapper.classes()).toContain('metric-card')
    })

    it('should render as div element', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '100',
          icon: 'people'
        }
      })
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('should contain metric-card__content section', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '100',
          icon: 'people'
        }
      })
      expect(wrapper.find('.metric-card__content').exists()).toBe(true)
    })

    it('should contain metric-card__info section', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '100',
          icon: 'people'
        }
      })
      expect(wrapper.find('.metric-card__info').exists()).toBe(true)
    })

    it('should render trend inside info section', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Total',
          value: '100',
          icon: 'people',
          trend: '+15%'
        }
      })
      const info = wrapper.find('.metric-card__info')
      expect(info.find('.metric-card__trend').exists()).toBe(true)
    })
  })

  describe('Component Integration', () => {
    it('should render complete metric card with all props', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Revenue',
          value: '1,234',
          icon: 'attach_money',
          trend: '+15%',
          trendType: 'positive'
        }
      })

      expect(wrapper.find('.metric-card__label').text()).toBe('Revenue')
      expect(wrapper.find('.metric-card__value').text()).toBe('1,234')
      expect(wrapper.find('.metric-card__trend').text()).toContain('+15%')
      expect(wrapper.find('.metric-card__trend').classes()).toContain('metric-card__trend--positive')
      expect(wrapper.findAll('.q-icon').length).toBe(2)
    })

    it('should render minimal metric card without trend', () => {
      const wrapper = mount(NtkMetricCard, {
        props: {
          label: 'Active Users',
          value: '42',
          icon: 'person'
        }
      })

      expect(wrapper.find('.metric-card__label').text()).toBe('Active Users')
      expect(wrapper.find('.metric-card__value').text()).toBe('42')
      expect(wrapper.find('.metric-card__trend').exists()).toBe(false)
      expect(wrapper.findAll('.q-icon').length).toBe(1)
    })
  })
})