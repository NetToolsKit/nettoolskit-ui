/**
 * BaseFooter Component - Unit Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseFooter from '../../../../src/components/layout/BaseFooter.vue'

vi.mock('../../../../src/composables/ui/useBranding', () => ({
  useBranding: () => ({
    logo: { value: { letter: 'T', text: 'TestApp' } },
    colors: { value: { primary: '#007bff' } },
    contact: { value: { email: 'test@example.com', whatsapp: '5511999999999' } },
    social: {
      value: {
        github: 'https://github.com/test',
        linkedin: 'https://linkedin.com/company/test'
      }
    }
  })
}))

describe('BaseFooter', () => {
  const mockLinkSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact', external: true }
      ]
    }
  ]

  const mockSocialLinks = [
    { icon: 'fab fa-github', href: 'https://github.com', label: 'GitHub' },
    { icon: 'fab fa-twitter', href: 'https://twitter.com', label: 'Twitter' }
  ]

  describe('Props', () => {
    it('should render with default props', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter)

      // Assert
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.base-footer').exists()).toBe(true)
    })

    it('should render brand name', () => {
      // Arrange
      const brandName = 'My Company'

      // Act
      const wrapper = mount(BaseFooter, {
        props: { brandName }
      })

      // Assert
      expect(wrapper.text()).toContain(brandName)
    })

    it('should render brand description', () => {
      // Arrange
      const brandDescription = 'We build amazing products'

      // Act
      const wrapper = mount(BaseFooter, {
        props: {
          brandName: 'My Company',
          brandDescription
        }
      })

      // Assert
      expect(wrapper.text()).toContain(brandDescription)
    })

    it('should render link sections', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter, {
        props: { linkSections: mockLinkSections }
      })

      // Assert
      expect(wrapper.text()).toContain('Product')
      expect(wrapper.text()).toContain('Features')
      expect(wrapper.text()).toContain('Company')
      expect(wrapper.text()).toContain('About')
    })

    it('should render external links with correct attributes', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter, {
        props: { linkSections: mockLinkSections }
      })

      // Assert
      const externalLink = wrapper.find('a[href="/contact"]')
      expect(externalLink.attributes('target')).toBe('_blank')
      expect(externalLink.attributes('rel')).toBe('noopener noreferrer')
    })

    it('should render social links', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter, {
        props: { socialLinks: mockSocialLinks }
      })

      // Assert
      expect(wrapper.findAll('.base-footer__social-link')).toHaveLength(2)
    })

    it('should render social icons', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter, {
        props: { socialLinks: mockSocialLinks }
      })

      // Assert
      const icons = wrapper.findAllComponents({ name: 'QIcon' })
      expect(icons.length).toBeGreaterThan(0)
    })

    it('should render custom copyright text', () => {
      // Arrange
      const copyrightText = '© 2025 Custom Copyright'

      // Act
      const wrapper = mount(BaseFooter, {
        props: { copyrightText }
      })

      // Assert
      expect(wrapper.text()).toContain(copyrightText)
    })

    it('should render social title', () => {
      // Arrange
      const socialTitle = 'Follow Us'

      // Act
      const wrapper = mount(BaseFooter, {
        props: {
          socialLinks: mockSocialLinks,
          socialTitle
        }
      })

      // Assert
      expect(wrapper.text()).toContain(socialTitle)
    })
  })

  describe('useBranding Integration', () => {
    it('should use branding data when no props provided', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter, {
        props: { useBrandingData: true }
      })

      // Assert
      expect(wrapper.exists()).toBe(true)
    })

    it('should auto-map social platforms to icons', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter, {
        props: { useBrandingData: true }
      })

      // Assert
      expect(wrapper.html()).toContain('fab fa-github')
    })
  })

  describe('Slots', () => {
    it('should render custom brand slot', () => {
      // Arrange
      const slots = {
        brand: '<div class="custom-brand">Custom Brand</div>'
      }

      // Act
      const wrapper = mount(BaseFooter, { slots })

      // Assert
      expect(wrapper.find('.custom-brand').exists()).toBe(true)
    })

    it('should render custom links slot', () => {
      // Arrange
      const slots = {
        links: '<div class="custom-links">Custom Links</div>'
      }

      // Act
      const wrapper = mount(BaseFooter, { slots })

      // Assert
      expect(wrapper.find('.custom-links').exists()).toBe(true)
    })

    it('should render custom social slot', () => {
      // Arrange
      const slots = {
        social: '<div class="custom-social">Custom Social</div>'
      }

      // Act
      const wrapper = mount(BaseFooter, { slots })

      // Assert
      expect(wrapper.find('.custom-social').exists()).toBe(true)
    })

    it('should render custom copyright slot', () => {
      // Arrange
      const slots = {
        copyright: '<p class="custom-copyright">Custom Copyright</p>'
      }

      // Act
      const wrapper = mount(BaseFooter, { slots })

      // Assert
      expect(wrapper.find('.custom-copyright').exists()).toBe(true)
    })
  })

  describe('Layout Variants', () => {
    it('should apply dark variant class', () => {
      // Arrange
      const variant = 'dark' as const

      // Act
      const wrapper = mount(BaseFooter, {
        props: { variant }
      })

      // Assert
      expect(wrapper.classes()).toContain('base-footer--dark')
    })

    it('should apply light variant class', () => {
      // Arrange
      const variant = 'light' as const

      // Act
      const wrapper = mount(BaseFooter, {
        props: { variant }
      })

      // Assert
      expect(wrapper.classes()).toContain('base-footer--light')
    })

    it('should apply minimal variant class', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter, {
        props: { minimal: true }
      })

      // Assert
      expect(wrapper.classes()).toContain('base-footer--minimal')
    })
  })

  describe('Accessibility', () => {
    it('should have semantic footer tag', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter)

      // Assert
      expect(wrapper.find('footer').exists()).toBe(true)
    })

    it('should have aria-label on social links', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter, {
        props: { socialLinks: mockSocialLinks }
      })

      // Assert
      const socialLinks = wrapper.findAll('.base-footer__social-link')
      socialLinks.forEach(link => {
        expect(link.attributes('aria-label')).toBeDefined()
      })
    })

    it('should have proper link structure', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter, {
        props: { linkSections: mockLinkSections }
      })

      // Assert
      const lists = wrapper.findAll('.base-footer__link-list')
      expect(lists.length).toBeGreaterThan(0)
    })
  })

  describe('Responsiveness', () => {
    it('should render responsive container', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter)

      // Assert
      expect(wrapper.find('.base-footer__container').exists()).toBe(true)
    })

    it('should have flexible link sections layout', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter, {
        props: { linkSections: mockLinkSections }
      })

      // Assert
      expect(wrapper.find('.base-footer__links').exists()).toBe(true)
    })
  })

  describe('Structure', () => {
    it('should have main content section', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter)

      // Assert
      expect(wrapper.find('.base-footer__content').exists()).toBe(true)
    })

    it('should have divider between content and copyright', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter)

      // Assert
      expect(wrapper.find('.base-footer__divider').exists()).toBe(true)
    })

    it('should have copyright section', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseFooter)

      // Assert
      expect(wrapper.find('.base-footer__copyright').exists()).toBe(true)
    })
  })
})