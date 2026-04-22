/**
 * BaseSidebar Component - Unit Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseSidebar from '../../../../src/components/layout/BaseSidebar.vue'

describe('BaseSidebar', () => {
  const mockItems = [
    { id: 1, label: 'Home', icon: 'home', to: '/' },
    { id: 2, label: 'Products', icon: 'shopping_cart', to: '/products' },
    { id: 3, type: 'separator' as const },
    { id: 4, label: 'Settings', icon: 'settings', to: '/settings', badge: '3' }
  ]

  describe('Props', () => {
    it('should render with default props', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseSidebar, {
        props: { items: [] }
      })

      // Assert
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'QDrawer' }).exists()).toBe(true)
    })

    it('should render navigation items', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseSidebar, {
        props: { items: mockItems }
      })

      // Assert
      expect(wrapper.text()).toContain('Home')
      expect(wrapper.text()).toContain('Products')
      expect(wrapper.text()).toContain('Settings')
    })

    it('should render item icons', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseSidebar, {
        props: { items: mockItems }
      })

      // Assert
      const icons = wrapper.findAllComponents({ name: 'QIcon' })
      expect(icons.length).toBeGreaterThan(0)
    })

    it('should render separator', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseSidebar, {
        props: { items: mockItems }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSeparator' }).exists()).toBe(true)
    })

    it('should render badges', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseSidebar, {
        props: { items: mockItems }
      })

      // Assert
      expect(wrapper.find('.ntk-sidebar__badge').exists()).toBe(true)
      expect(wrapper.text()).toContain('3')
    })

    it('should apply custom width', () => {
      // Arrange
      const width = 300

      // Act
      const wrapper = mount(BaseSidebar, {
        props: {
          items: [],
          width
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QDrawer' }).props('width')).toBe(300)
    })

    it('should apply mini mode', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseSidebar, {
        props: {
          items: mockItems,
          mini: true
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QDrawer' }).props('mini')).toBe(true)
    })

    it('should show brand name when not mini', () => {
      // Arrange
      const brandName = 'My App'

      // Act
      const wrapper = mount(BaseSidebar, {
        props: {
          items: [],
          brandName,
          mini: false
        }
      })

      // Assert
      expect(wrapper.text()).toContain(brandName)
    })

    it('should hide brand name in mini mode', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseSidebar, {
        props: {
          items: [],
          brandName: 'My App',
          mini: true
        }
      })

      // Assert
      const brandSpan = wrapper.find('.base-sidebar__brand')
      expect(brandSpan.exists()).toBe(false)
    })

    it('should render logo image', () => {
      // Arrange
      const logo = 'https://example.com/logo.png'
      const logoAlt = 'Company Logo'

      // Act
      const wrapper = mount(BaseSidebar, {
        props: {
          items: [],
          logo,
          logoAlt
        }
      })

      // Assert
      const img = wrapper.find('.base-sidebar__logo-img')
      expect(img.exists()).toBe(true)
      expect(img.attributes('src')).toBe(logo)
      expect(img.attributes('alt')).toBe(logoAlt)
    })

    it('should show toggle button when enabled', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseSidebar, {
        props: {
          items: [],
          showToggle: true
        }
      })

      // Assert
      expect(wrapper.find('.base-sidebar__footer').exists()).toBe(true)
    })

    it('should disable items when specified', () => {
      // Arrange
      const disabledItems = [
        { id: 1, label: 'Disabled', icon: 'block', disabled: true }
      ]

      // Act
      const wrapper = mount(BaseSidebar, {
        props: { items: disabledItems }
      })

      // Assert
      const item = wrapper.findComponent({ name: 'QItem' })
      expect(item.props('disable')).toBe(true)
    })
  })

  describe('Events', () => {
    it('should emit update:model-value when drawer state changes', async () => {
      // Arrange
      const wrapper = mount(BaseSidebar, {
        props: {
          items: [],
          modelValue: true
        }
      })
      const drawer = wrapper.findComponent({ name: 'QDrawer' })

      // Act
      await drawer.vm.$emit('update:model-value', false)

      // Assert
      expect(wrapper.emitted('update:model-value')).toBeTruthy()
      expect(wrapper.emitted('update:model-value')?.[0]).toEqual([false])
    })

    it('should emit toggle when toggle button clicked', async () => {
      // Arrange
      const wrapper = mount(BaseSidebar, {
        props: {
          items: [],
          showToggle: true
        }
      })
      const toggleItem = wrapper.find('.base-sidebar__footer .q-item')

      // Act
      await toggleItem.trigger('click')

      // Assert
      expect(wrapper.emitted('toggle')).toBeTruthy()
    })

    it('should call item onClick handler', async () => {
      // Arrange
      const onClickSpy = vi.fn()
      const itemsWithClick = [
        { id: 1, label: 'Clickable', icon: 'touch_app', onClick: onClickSpy }
      ]
      const wrapper = mount(BaseSidebar, {
        props: { items: itemsWithClick }
      })
      const item = wrapper.findComponent({ name: 'QItem' })

      // Act
      await item.trigger('click')

      // Assert
      expect(onClickSpy).toHaveBeenCalled()
    })
  })

  describe('Slots', () => {
    it('should render custom header slot', () => {
      // Arrange
      const slots = {
        header: '<div class="custom-header">Custom Header</div>'
      }

      // Act
      const wrapper = mount(BaseSidebar, {
        props: { items: [] },
        slots
      })

      // Assert
      expect(wrapper.find('.custom-header').exists()).toBe(true)
    })

    it('should render custom footer slot', () => {
      // Arrange
      const slots = {
        footer: '<div class="custom-footer">Custom Footer</div>'
      }

      // Act
      const wrapper = mount(BaseSidebar, {
        props: { items: [], showToggle: true },
        slots
      })

      // Assert
      expect(wrapper.find('.custom-footer').exists()).toBe(true)
    })
  })

  describe('Mini Mode', () => {
    it('should show tooltips in mini mode', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseSidebar, {
        props: {
          items: mockItems,
          mini: true
        }
      })

      // Assert
      const tooltips = wrapper.findAllComponents({ name: 'QTooltip' })
      expect(tooltips.length).toBeGreaterThan(0)
    })

    it('should show correct toggle icon in mini mode', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseSidebar, {
        props: {
          items: [],
          showToggle: true,
          mini: true
        }
      })

      // Assert
      const toggleIcon = wrapper.find('.base-sidebar__footer [name="keyboard_double_arrow_right"]')
      expect(toggleIcon.exists()).toBe(true)
    })

    it('should show correct toggle icon in expanded mode', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseSidebar, {
        props: {
          items: [],
          showToggle: true,
          mini: false
        }
      })

      // Assert
      const toggleIcon = wrapper.find('.base-sidebar__footer [name="keyboard_double_arrow_left"]')
      expect(toggleIcon.exists()).toBe(true)
    })
  })

  describe('Navigation', () => {
    it('should set correct route paths', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseSidebar, {
        props: { items: mockItems }
      })

      // Assert
      const items = wrapper.findAllComponents({ name: 'QItem' })
      const homeItem = items[0]
      expect(homeItem.props('to')).toBe('/')
    })

    it('should use exact route matching when specified', () => {
      // Arrange
      const exactItems = [
        { id: 1, label: 'Home', icon: 'home', to: '/', exact: true }
      ]

      // Act
      const wrapper = mount(BaseSidebar, {
        props: { items: exactItems }
      })

      // Assert
      const item = wrapper.findComponent({ name: 'QItem' })
      expect(item.props('exact')).toBe(true)
    })
  })

  describe('Custom Classes', () => {
    it('should apply custom drawer class', () => {
      // Arrange
      const customClass = 'my-sidebar'

      // Act
      const wrapper = mount(BaseSidebar, {
        props: {
          items: [],
          customClass
        }
      })

      // Assert
      expect(wrapper.classes()).toContain(customClass)
    })

    it('should apply custom item class', () => {
      // Arrange
      const itemClass = 'custom-item'

      // Act
      const wrapper = mount(BaseSidebar, {
        props: {
          items: mockItems,
          itemClass
        }
      })

      // Assert
      const items = wrapper.findAllComponents({ name: 'QItem' })
      expect(items[0].classes()).toContain(itemClass)
    })
  })

  describe('Responsiveness', () => {
    it('should apply breakpoint for mobile behavior', () => {
      // Arrange
      const breakpoint = 768

      // Act
      const wrapper = mount(BaseSidebar, {
        props: {
          items: [],
          breakpoint
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QDrawer' }).props('breakpoint')).toBe(768)
    })
  })
})
