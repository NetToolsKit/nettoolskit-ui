import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { QBtn } from 'quasar'
import NtkButton from '@/components/ui/NtkButton.vue'

describe('NtkButton', () => {
  describe('Component Structure', () => {
    it('should render QBtn component', () => {
      // Arrange & Act
      const wrapper = mount(NtkButton, {
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).exists()).toBe(true)
    })

    it('should pass label prop to QBtn', () => {
      // Arrange
      const label = 'Click Me'

      // Act
      const wrapper = mount(NtkButton, {
        props: { label },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('label')).toBe(label)
    })

    it('should render slot content', () => {
      // Arrange
      const slotContent = 'Button Text'

      // Act
      const wrapper = mount(NtkButton, {
        slots: {
          default: slotContent
        },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.text()).toContain(slotContent)
    })

    it('should render loading slot when provided', () => {
      // Arrange
      const loadingContent = 'Loading...'

      // Act
      const wrapper = mount(NtkButton, {
        props: { loading: true },
        slots: {
          loading: loadingContent
        },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.text()).toContain(loadingContent)
    })
  })

  describe('Color Prop', () => {
    it('should pass color prop to QBtn', () => {
      // Arrange
      const color = 'primary'

      // Act
      const wrapper = mount(NtkButton, {
        props: { color },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('color')).toBe(color)
    })

    it('should support secondary color', () => {
      // Arrange
      const color = 'secondary'

      // Act
      const wrapper = mount(NtkButton, {
        props: { color },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('color')).toBe(color)
    })

    it('should support custom Quasar colors', () => {
      // Arrange
      const color = 'positive'

      // Act
      const wrapper = mount(NtkButton, {
        props: { color },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('color')).toBe(color)
    })
  })

  describe('State Props', () => {
    it('should pass disable prop to QBtn', () => {
      // Arrange
      const disable = true

      // Act
      const wrapper = mount(NtkButton, {
        props: { disable },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('disable')).toBe(true)
    })

    it('should pass loading prop to QBtn', () => {
      // Arrange
      const loading = true

      // Act
      const wrapper = mount(NtkButton, {
        props: { loading },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('loading')).toBe(true)
    })

    it('should not be disabled by default', () => {
      // Arrange & Act
      const wrapper = mount(NtkButton, {
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('disable')).toBeFalsy()
    })

    it('should not be loading by default', () => {
      // Arrange & Act
      const wrapper = mount(NtkButton, {
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('loading')).toBeFalsy()
    })
  })

  describe('Icon Props', () => {
    it('should pass icon prop to QBtn', () => {
      // Arrange
      const icon = 'add'

      // Act
      const wrapper = mount(NtkButton, {
        props: { icon },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('icon')).toBe(icon)
    })

    it('should pass iconRight prop to QBtn', () => {
      // Arrange
      const iconRight = 'arrow_forward'

      // Act
      const wrapper = mount(NtkButton, {
        props: { iconRight },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('iconRight')).toBe(iconRight)
    })

    it('should support both left and right icons', () => {
      // Arrange
      const icon = 'add'
      const iconRight = 'arrow_forward'

      // Act
      const wrapper = mount(BaseButton, {
        props: { icon, iconRight },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('icon')).toBe(icon)
      expect(wrapper.findComponent({ name: 'QBtn' }).props('iconRight')).toBe(iconRight)
    })
  })

  describe('Style Props', () => {
    it('should pass round prop to QBtn', () => {
      // Arrange
      const round = true

      // Act
      const wrapper = mount(BaseButton, {
        props: { round },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('round')).toBe(true)
    })

    it('should pass flat prop to QBtn', () => {
      // Arrange
      const flat = true

      // Act
      const wrapper = mount(BaseButton, {
        props: { flat },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('flat')).toBe(true)
    })

    it('should pass outline prop to QBtn', () => {
      // Arrange
      const outline = true

      // Act
      const wrapper = mount(BaseButton, {
        props: { outline },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('outline')).toBe(true)
    })

    it('should pass unelevated prop to QBtn', () => {
      // Arrange
      const unelevated = true

      // Act
      const wrapper = mount(BaseButton, {
        props: { unelevated },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('unelevated')).toBe(true)
    })
  })

  describe('Size Props', () => {
    it('should pass size prop to QBtn', () => {
      // Arrange
      const size = 'sm'

      // Act
      const wrapper = mount(BaseButton, {
        props: { size },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('size')).toBe(size)
    })

    it('should support md size', () => {
      // Arrange
      const size = 'md'

      // Act
      const wrapper = mount(BaseButton, {
        props: { size },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('size')).toBe(size)
    })

    it('should support lg size', () => {
      // Arrange
      const size = 'lg'

      // Act
      const wrapper = mount(BaseButton, {
        props: { size },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('size')).toBe(size)
    })

    it('should pass dense prop to QBtn', () => {
      // Arrange
      const dense = true

      // Act
      const wrapper = mount(BaseButton, {
        props: { dense },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('dense')).toBe(true)
    })

    it('should pass padding prop to QBtn', () => {
      // Arrange
      const padding = '8px 16px'

      // Act
      const wrapper = mount(BaseButton, {
        props: { padding },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('padding')).toBe(padding)
    })
  })

  describe('Text Props', () => {
    it('should pass noCaps prop to QBtn', () => {
      // Arrange
      const noCaps = true

      // Act
      const wrapper = mount(BaseButton, {
        props: { noCaps },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('noCaps')).toBe(true)
    })

    it('should pass noWrap prop to QBtn', () => {
      // Arrange
      const noWrap = true

      // Act
      const wrapper = mount(BaseButton, {
        props: { noWrap },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('noWrap')).toBe(true)
    })

    it('should pass align prop to QBtn', () => {
      // Arrange
      const align = 'left'

      // Act
      const wrapper = mount(BaseButton, {
        props: { align },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('align')).toBe(align)
    })
  })

  describe('Navigation Props', () => {
    it('should pass to prop to QBtn for router links', () => {
      // Arrange
      const to = '/home'

      // Act
      const wrapper = mount(BaseButton, {
        props: { to },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('to')).toBe(to)
    })

    it('should pass href prop to QBtn for external links', () => {
      // Arrange
      const href = 'https://example.com'

      // Act
      const wrapper = mount(BaseButton, {
        props: { href },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('href')).toBe(href)
    })

    it('should pass target prop to QBtn', () => {
      // Arrange
      const target = '_blank'

      // Act
      const wrapper = mount(BaseButton, {
        props: { href: 'https://example.com', target },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('target')).toBe(target)
    })
  })

  describe('Layout Props', () => {
    it('should pass stretch prop to QBtn', () => {
      // Arrange
      const stretch = true

      // Act
      const wrapper = mount(BaseButton, {
        props: { stretch },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('stretch')).toBe(true)
    })

    it('should pass stack prop to QBtn', () => {
      // Arrange
      const stack = true

      // Act
      const wrapper = mount(BaseButton, {
        props: { stack },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('stack')).toBe(true)
    })
  })

  describe('Interactive Props', () => {
    it('should pass ripple prop to QBtn', () => {
      // Arrange
      const ripple = false

      // Act
      const wrapper = mount(BaseButton, {
        props: { ripple },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('ripple')).toBe(false)
    })

    it('should pass type prop to QBtn', () => {
      // Arrange
      const type = 'submit'

      // Act
      const wrapper = mount(BaseButton, {
        props: { type },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('type')).toBe(type)
    })

    it('should support reset type', () => {
      // Arrange
      const type = 'reset'

      // Act
      const wrapper = mount(BaseButton, {
        props: { type },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('type')).toBe(type)
    })
  })

  describe('Custom Class', () => {
    it('should pass customClass to QBtn class prop', () => {
      // Arrange
      const customClass = 'my-custom-button'

      // Act
      const wrapper = mount(BaseButton, {
        props: { customClass },
        global: {
          components: { QBtn }
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QBtn' }).props('class')).toBe(customClass)
    })
  })

  describe('Events', () => {
    it('should emit click event when QBtn is clicked', async () => {
      // Arrange
      const wrapper = mount(BaseButton, {
        global: {
          components: { QBtn }
        }
      })

      // Act
      await wrapper.findComponent({ name: 'QBtn' }).vm.$emit('click', new MouseEvent('click'))

      // Assert
      expect(wrapper.emitted('click')).toBeTruthy()
      expect(wrapper.emitted('click')).toHaveLength(1)
    })

    it('should pass click event payload', async () => {
      // Arrange
      const wrapper = mount(BaseButton, {
        global: {
          components: { QBtn }
        }
      })
      const clickEvent = new MouseEvent('click')

      // Act
      await wrapper.findComponent({ name: 'QBtn' }).vm.$emit('click', clickEvent)

      // Assert
      expect(wrapper.emitted('click')?.[0][0]).toBe(clickEvent)
    })
  })

  describe('Attributes Inheritance', () => {
    it('should inherit attributes with v-bind attrs', () => {
      // Arrange
      const attrs = {
        'data-testid': 'test-button',
        'aria-label': 'Test Button'
      }

      // Act
      const wrapper = mount(BaseButton, {
        attrs,
        global: {
          components: { QBtn }
        }
      })

      // Assert
      const qBtn = wrapper.findComponent({ name: 'QBtn' })
      expect(qBtn.attributes('data-testid')).toBe('test-button')
      expect(qBtn.attributes('aria-label')).toBe('Test Button')
    })
  })
})
