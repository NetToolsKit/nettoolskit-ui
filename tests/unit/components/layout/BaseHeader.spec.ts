/**
 * BaseHeader Component - Unit Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseHeader from '../../../../src/components/layout/BaseHeader.vue'

describe('BaseHeader', () => {
  describe('Props', () => {
    it('should render with default props', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseHeader)

      // Assert
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.find('.base-header').exists()).toBe(true)
    })

    it('should apply elevated prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseHeader, {
        props: { elevated: true }
      })

      // Assert
      expect(wrapper.find('header').attributes('elevated')).toBeDefined()
    })

    it('should apply custom height', () => {
      // Arrange
      const height = 80

      // Act
      const wrapper = mount(BaseHeader, {
        props: { height }
      })

      // Assert
      const toolbar = wrapper.find('[role="toolbar"]')
      expect(toolbar.attributes('style')).toContain('height: 80px')
    })

    it('should render title when provided', () => {
      // Arrange
      const title = 'Test Title'

      // Act
      const wrapper = mount(BaseHeader, {
        props: { title }
      })

      // Assert
      expect(wrapper.text()).toContain(title)
    })

    it('should render breadcrumbs when provided', () => {
      // Arrange
      const breadcrumbs = ['Home', 'Products', 'Item']

      // Act
      const wrapper = mount(BaseHeader, {
        props: { breadcrumbs }
      })

      // Assert
      expect(wrapper.text()).toContain('Home')
      expect(wrapper.text()).toContain('Products')
      expect(wrapper.text()).toContain('Item')
      expect(wrapper.findAll('.base-header__breadcrumb-separator')).toHaveLength(2)
    })

    it('should show menu button when showMenuButton is true', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseHeader, {
        props: { showMenuButton: true }
      })

      // Assert
      expect(wrapper.find('.base-header__menu-container').exists()).toBe(true)
    })

    it('should hide menu button when showMenuButton is false', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseHeader, {
        props: { showMenuButton: false }
      })

      // Assert
      expect(wrapper.find('.base-header__menu-container').exists()).toBe(false)
    })

    it('should show search when showSearch is true and not mobile', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseHeader, {
        props: { showSearch: true, isMobile: false }
      })

      // Assert
      expect(wrapper.find('.base-header__search').exists()).toBe(true)
    })

    it('should hide search on mobile', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseHeader, {
        props: { showSearch: true, isMobile: true }
      })

      // Assert
      expect(wrapper.find('.base-header__search').exists()).toBe(false)
    })

    it('should show notifications button when enabled', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseHeader, {
        props: { showNotifications: true }
      })

      // Assert
      expect(wrapper.find('[icon="notifications"]').exists()).toBe(true)
    })

    it('should display notification badge with count', () => {
      // Arrange
      const notificationCount = 5

      // Act
      const wrapper = mount(BaseHeader, {
        props: { showNotifications: true, notificationCount }
      })

      // Assert
      expect(wrapper.text()).toContain('5')
    })

    it('should show user avatar when enabled', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseHeader, {
        props: { showUserAvatar: true }
      })

      // Assert
      expect(wrapper.find('.q-avatar').exists()).toBe(true)
    })

    it('should render custom user avatar image', () => {
      // Arrange
      const userAvatar = 'https://example.com/avatar.jpg'

      // Act
      const wrapper = mount(BaseHeader, {
        props: {
          showUserAvatar: true,
          userAvatar
        }
      })

      // Assert
      const img = wrapper.find('.q-avatar img')
      expect(img.attributes('src')).toBe(userAvatar)
    })
  })

  describe('Events', () => {
    it('should emit toggle-menu when menu button clicked', async () => {
      // Arrange
      const wrapper = mount(BaseHeader, {
        props: { showMenuButton: true }
      })

      // Act
      await wrapper.find('[icon="menu"]').trigger('click')

      // Assert
      expect(wrapper.emitted('toggle-menu')).toBeTruthy()
    })

    it('should emit update:search-value when search input changes', async () => {
      // Arrange
      const wrapper = mount(BaseHeader, {
        props: { showSearch: true, isMobile: false }
      })
      const input = wrapper.findComponent({ name: 'QInput' })

      // Act
      await input.vm.$emit('update:model-value', 'test search')

      // Assert
      expect(wrapper.emitted('update:search-value')).toBeTruthy()
      expect(wrapper.emitted('update:search-value')?.[0]).toEqual(['test search'])
    })

    it('should emit notifications-click when notification button clicked', async () => {
      // Arrange
      const wrapper = mount(BaseHeader, {
        props: { showNotifications: true }
      })

      // Act
      await wrapper.find('[icon="notifications"]').trigger('click')

      // Assert
      expect(wrapper.emitted('notifications-click')).toBeTruthy()
    })

    it('should emit user-click when user avatar clicked', async () => {
      // Arrange
      const wrapper = mount(BaseHeader, {
        props: { showUserAvatar: true }
      })
      const avatarBtn = wrapper.findAll('button').find(btn =>
        btn.find('.q-avatar').exists()
      )

      // Act
      await avatarBtn?.trigger('click')

      // Assert
      expect(wrapper.emitted('user-click')).toBeTruthy()
    })
  })

  describe('Slots', () => {
    it('should render custom title slot', () => {
      // Arrange
      const slots = {
        title: '<div class="custom-title">Custom Title</div>'
      }

      // Act
      const wrapper = mount(BaseHeader, { slots })

      // Assert
      expect(wrapper.find('.custom-title').exists()).toBe(true)
      expect(wrapper.text()).toContain('Custom Title')
    })

    it('should render custom actions slot', () => {
      // Arrange
      const slots = {
        actions: '<button class="custom-action">Custom Action</button>'
      }

      // Act
      const wrapper = mount(BaseHeader, { slots })

      // Assert
      expect(wrapper.find('.custom-action').exists()).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have proper aria-label on menu button', () => {
      // Arrange
      const menuAriaLabel = 'Toggle navigation menu'

      // Act
      const wrapper = mount(BaseHeader, {
        props: {
          showMenuButton: true,
          menuAriaLabel
        }
      })

      // Assert
      expect(wrapper.find('[icon="menu"]').attributes('aria-label')).toBe(menuAriaLabel)
    })

    it('should have tooltips on interactive elements', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseHeader, {
        props: {
          showMenuButton: true,
          showNotifications: true,
          showUserAvatar: true
        }
      })

      // Assert
      expect(wrapper.findAllComponents({ name: 'QTooltip' }).length).toBeGreaterThan(0)
    })
  })

  describe('Responsiveness', () => {
    it('should adapt to mobile mode', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseHeader, {
        props: {
          isMobile: true,
          showSearch: true
        }
      })

      // Assert
      expect(wrapper.find('.base-header__search').exists()).toBe(false)
    })

    it('should show compact layout on mobile', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseHeader, {
        props: {
          isMobile: true,
          compact: true
        }
      })

      // Assert
      expect(wrapper.classes()).toContain('base-header--compact')
    })
  })

  describe('Custom Classes', () => {
    it('should apply custom class', () => {
      // Arrange
      const customClass = 'my-custom-header'

      // Act
      const wrapper = mount(BaseHeader, {
        props: { customClass }
      })

      // Assert
      expect(wrapper.classes()).toContain(customClass)
    })

    it('should apply dark theme class', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseHeader, {
        props: { dark: true }
      })

      // Assert
      expect(wrapper.classes()).toContain('base-header--dark')
    })

    it('should apply transparent class', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseHeader, {
        props: { transparent: true }
      })

      // Assert
      expect(wrapper.classes()).toContain('base-header--transparent')
    })
  })
})
