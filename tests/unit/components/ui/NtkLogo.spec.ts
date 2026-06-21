/**
 * Tests/unit/components/ui/Ntk Logo spec module.
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NtkLogo from '../../../../src/components/ui/NtkLogo.vue'

describe('NtkLogo', () => {
  describe('Props - Size', () => {
    it('should apply md size class by default', () => {
      // Arrange
      const wrapper = mount(NtkLogo)

      // Act

      // Assert
      expect(wrapper.classes()).toContain('size-md')
    })

    it('should apply xs size class', () => {
      // Arrange
      const wrapper = mount(NtkLogo, {
        props: { size: 'xs' }
      })

      // Act

      // Assert
      expect(wrapper.classes()).toContain('size-xs')
    })

    it('should apply sm size class', () => {
      // Arrange
      const wrapper = mount(NtkLogo, {
        props: { size: 'sm' }
      })

      // Act

      // Assert
      expect(wrapper.classes()).toContain('size-sm')
    })

    it('should apply lg size class', () => {
      // Arrange
      const wrapper = mount(NtkLogo, {
        props: { size: 'lg' }
      })

      // Act

      // Assert
      expect(wrapper.classes()).toContain('size-lg')
    })

    it('should apply xl size class', () => {
      // Arrange
      const wrapper = mount(NtkLogo, {
        props: { size: 'xl' }
      })

      // Act

      // Assert
      expect(wrapper.classes()).toContain('size-xl')
    })
  })

  describe('Props - LinkTo', () => {
    it('should render as div by default', () => {
      // Arrange
      const wrapper = mount(NtkLogo)

      // Act

      // Assert
      expect(wrapper.element.tagName).toBe('DIV')
    })

    it('should render as anchor when linkTo provided', () => {
      // Arrange
      const wrapper = mount(NtkLogo, {
        props: { linkTo: 'https://example.com' }
      })

      // Act

      // Assert
      expect(wrapper.element.tagName).toBe('A')
      expect(wrapper.attributes('href')).toBe('https://example.com')
    })

    it('should apply clickable class when linkTo provided', () => {
      // Arrange
      const wrapper = mount(NtkLogo, {
        props: { linkTo: 'https://example.com' }
      })

      // Act

      // Assert
      expect(wrapper.classes()).toContain('clickable')
    })
  })

  describe('Props - ShowText', () => {
    it('should show text by default', () => {
      // Arrange
      const wrapper = mount(NtkLogo)

      // Act

      // Assert
      expect(wrapper.find('.logo-content').exists()).toBe(true)
      expect(wrapper.classes()).toContain('with-text')
    })

    it('should hide text when showText is false', () => {
      // Arrange
      const wrapper = mount(NtkLogo, {
        props: { showText: false }
      })

      // Act

      // Assert
      expect(wrapper.find('.logo-content').exists()).toBe(false)
      expect(wrapper.classes()).not.toContain('with-text')
    })
  })

  describe('Props - ShowTagline', () => {
    it('should not show tagline by default', () => {
      // Arrange
      const wrapper = mount(NtkLogo)

      // Act

      // Assert
      expect(wrapper.find('.logo-tagline').exists()).toBe(false)
    })

    it('should show tagline when showTagline is true', () => {
      // Arrange
      const wrapper = mount(NtkLogo, {
        props: { showTagline: true, tagline: 'Custom Tagline' }
      })

      // Act

      // Assert
      expect(wrapper.find('.logo-tagline').exists()).toBe(true)
    })
  })

  describe('Structure', () => {
    it('should have ntk-logo class', () => {
      // Arrange
      const wrapper = mount(NtkLogo)

      // Act

      // Assert
      expect(wrapper.classes()).toContain('ntk-logo')
    })

    it('should contain logo-icon element', () => {
      // Arrange
      const wrapper = mount(NtkLogo)

      // Act

      // Assert
      expect(wrapper.find('.logo-icon').exists()).toBe(true)
    })

    it('should contain logo-text when showText is true', () => {
      // Arrange
      const wrapper = mount(NtkLogo, {
        props: { showText: true }
      })

      // Act

      // Assert
      expect(wrapper.find('.logo-text').exists()).toBe(true)
    })
  })

  describe('Props - Letter/Text/Tagline', () => {
    it('should override letter with prop', () => {
      // Arrange
      const wrapper = mount(NtkLogo, {
        props: { letter: 'T' }
      })

      // Act
      const iconText = wrapper.find('.logo-icon').text()

      // Assert
      expect(iconText).toContain('T')
    })

    it('should override text with prop', () => {
      // Arrange
      const wrapper = mount(NtkLogo, {
        props: { text: 'Custom' }
      })

      // Act
      const textContent = wrapper.find('.logo-text').text()

      // Assert
      expect(textContent).toContain('Custom')
    })

    it('should override tagline with prop', () => {
      // Arrange
      const wrapper = mount(NtkLogo, {
        props: { showTagline: true, tagline: 'Custom Tagline' }
      })

      // Act
      const taglineText = wrapper.find('.logo-tagline').text()

      // Assert
      expect(taglineText).toContain('Custom Tagline')
    })
  })
})