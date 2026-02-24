import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NtkCard from '../../../../src/components/ui/NtkCard.vue'

describe('NtkCard', () => {
  describe('Props - Variant', () => {
    it('should apply default variant class', () => {
      const wrapper = mount(NtkCard, {
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('base-card--default')
    })

    it('should apply outlined variant class', () => {
      const wrapper = mount(NtkCard, {
        props: { variant: 'outlined' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('base-card--outlined')
    })

    it('should apply elevated variant class', () => {
      const wrapper = mount(NtkCard, {
        props: { variant: 'elevated' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('base-card--elevated')
    })

    it('should apply accent-left variant class', () => {
      const wrapper = mount(NtkCard, {
        props: { variant: 'accent-left' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('base-card--accent-left')
    })

    it('should apply accent-top variant class', () => {
      const wrapper = mount(NtkCard, {
        props: { variant: 'accent-top' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('base-card--accent-top')
    })
  })

  describe('Props - Padding', () => {
    it('should apply md padding by default', () => {
      const wrapper = mount(NtkCard, {
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('base-card--padding-md')
    })

    it('should apply none padding class', () => {
      const wrapper = mount(NtkCard, {
        props: { padding: 'none' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('base-card--padding-none')
    })

    it('should apply sm padding class', () => {
      const wrapper = mount(NtkCard, {
        props: { padding: 'sm' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('base-card--padding-sm')
    })

    it('should apply lg padding class', () => {
      const wrapper = mount(NtkCard, {
        props: { padding: 'lg' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('base-card--padding-lg')
    })
  })

  describe('Props - Clickable', () => {
    it('should not apply clickable class by default', () => {
      const wrapper = mount(BaseCard, {
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).not.toContain('base-card--clickable')
    })

    it('should apply clickable class when clickable is true', () => {
      const wrapper = mount(BaseCard, {
        props: { clickable: true },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('base-card--clickable')
    })
  })

  describe('Props - Accent Color', () => {
    it('should apply primary accent color for accent-left variant', () => {
      const wrapper = mount(BaseCard, {
        props: { variant: 'accent-left', accentColor: 'primary' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('base-card--accent-primary')
    })

    it('should apply success accent color for accent-top variant', () => {
      const wrapper = mount(BaseCard, {
        props: { variant: 'accent-top', accentColor: 'success' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('base-card--accent-success')
    })

    it('should not apply accent color for non-accent variants', () => {
      const wrapper = mount(BaseCard, {
        props: { variant: 'default', accentColor: 'primary' },
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).not.toContain('base-card--accent-primary')
    })
  })

  describe('Structure - Slots', () => {
    it('should always render body slot', () => {
      const wrapper = mount(BaseCard, {
        slots: { default: 'Body content' }
      })
      expect(wrapper.find('.base-card__body').exists()).toBe(true)
      expect(wrapper.find('.base-card__body').text()).toBe('Body content')
    })

    it('should render header slot when provided', () => {
      const wrapper = mount(BaseCard, {
        slots: {
          header: 'Header content',
          default: 'Body'
        }
      })
      expect(wrapper.find('.base-card__header').exists()).toBe(true)
      expect(wrapper.find('.base-card__header').text()).toBe('Header content')
    })

    it('should not render header when slot not provided', () => {
      const wrapper = mount(BaseCard, {
        slots: { default: 'Body' }
      })
      expect(wrapper.find('.base-card__header').exists()).toBe(false)
    })

    it('should render footer slot when provided', () => {
      const wrapper = mount(BaseCard, {
        slots: {
          default: 'Body',
          footer: 'Footer content'
        }
      })
      expect(wrapper.find('.base-card__footer').exists()).toBe(true)
      expect(wrapper.find('.base-card__footer').text()).toBe('Footer content')
    })

    it('should not render footer when slot not provided', () => {
      const wrapper = mount(BaseCard, {
        slots: { default: 'Body' }
      })
      expect(wrapper.find('.base-card__footer').exists()).toBe(false)
    })
  })

  describe('Structure - Root Element', () => {
    it('should render as div element', () => {
      const wrapper = mount(BaseCard, {
        slots: { default: 'Content' }
      })
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('should have base-card class', () => {
      const wrapper = mount(BaseCard, {
        slots: { default: 'Content' }
      })
      expect(wrapper.classes()).toContain('base-card')
    })
  })
})
