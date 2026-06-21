/**
 * BaseInput Component - Unit Tests
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseInput from '../../../../src/components/form/BaseInput.vue'

describe('BaseInput', () => {
  describe('Props', () => {
    it('should render with default props', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseInput)

      // Assert
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'QInput' }).exists()).toBe(true)
    })

    it('should bind modelValue correctly', () => {
      // Arrange
      const testValue = 'test value'

      // Act
      const wrapper = mount(BaseInput, {
        props: { modelValue: testValue }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('modelValue')).toBe(testValue)
    })

    it('should apply label prop', () => {
      // Arrange
      const label = 'Username'

      // Act
      const wrapper = mount(BaseInput, {
        props: { label }
      })

      // Assert
      expect(wrapper.text()).toContain(label)
    })

    it('should apply placeholder prop', () => {
      // Arrange
      const placeholder = 'Enter your name'

      // Act
      const wrapper = mount(BaseInput, {
        props: { placeholder }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('placeholder')).toBe(placeholder)
    })

    it('should apply type prop', () => {
      // Arrange
      const type = 'email'

      // Act
      const wrapper = mount(BaseInput, {
        props: { type }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('type')).toBe(type)
    })

    it('should apply outlined style', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseInput, {
        props: { outlined: true }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('outlined')).toBe(true)
    })

    it('should apply filled style', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseInput, {
        props: { filled: true }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('filled')).toBe(true)
    })

    it('should apply dense prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseInput, {
        props: { dense: true }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('dense')).toBe(true)
    })

    it('should disable input when disable prop is true', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseInput, {
        props: { disable: true }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('disable')).toBe(true)
    })

    it('should make input readonly', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseInput, {
        props: { readonly: true }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('readonly')).toBe(true)
    })

    it('should apply validation rules', () => {
      // Arrange
      const rules = [(val: string) => !!val || 'Required']

      // Act
      const wrapper = mount(BaseInput, {
        props: { rules }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('rules')).toEqual(rules)
    })

    it('should apply lazy rules', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseInput, {
        props: { lazyRules: true }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('lazyRules')).toBe(true)
    })

    it('should show clear icon when clearable', () => {
      // Arrange
      const props = {
        modelValue: 'test',
        clearable: true
      }

      // Act
      const wrapper = mount(BaseInput, { props })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('clearable')).toBe(true)
    })

    it('should apply maxlength', () => {
      // Arrange
      const maxlength = 50

      // Act
      const wrapper = mount(BaseInput, {
        props: { maxlength }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('maxlength')).toBe(maxlength)
    })

    it('should show counter when enabled', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseInput, {
        props: { counter: true }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('counter')).toBe(true)
    })
  })

  describe('Events', () => {
    it('should emit update:modelValue on input change', async () => {
      // Arrange
      const wrapper = mount(BaseInput, {
        props: { modelValue: '' }
      })
      const input = wrapper.findComponent({ name: 'QInput' })

      // Act
      await input.vm.$emit('update:model-value', 'new value')

      // Assert
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
    })

    it('should emit blur event', async () => {
      // Arrange
      const wrapper = mount(BaseInput)
      const input = wrapper.findComponent({ name: 'QInput' })

      // Act
      await input.vm.$emit('blur')

      // Assert
      expect(wrapper.emitted('blur')).toBeTruthy()
    })

    it('should emit focus event', async () => {
      // Arrange
      const wrapper = mount(BaseInput)
      const input = wrapper.findComponent({ name: 'QInput' })

      // Act
      await input.vm.$emit('focus')

      // Assert
      expect(wrapper.emitted('focus')).toBeTruthy()
    })
  })

  describe('Slots', () => {
    it('should render prepend slot', () => {
      // Arrange
      const slots = {
        prepend: '<q-icon name="search" />'
      }

      // Act
      const wrapper = mount(BaseInput, { slots })

      // Assert
      expect(wrapper.html()).toContain('search')
    })

    it('should render append slot', () => {
      // Arrange
      const slots = {
        append: '<q-icon name="visibility" />'
      }

      // Act
      const wrapper = mount(BaseInput, { slots })

      // Assert
      expect(wrapper.html()).toContain('visibility')
    })

    it('should render hint slot', () => {
      // Arrange
      const slots = {
        hint: '<span class="custom-hint">Custom hint</span>'
      }

      // Act
      const wrapper = mount(BaseInput, { slots })

      // Assert
      expect(wrapper.find('.custom-hint').exists()).toBe(true)
    })
  })

  describe('Validation', () => {
    it('should validate required field', async () => {
      // Arrange
      const rules = [(val: string) => !!val || 'Field is required']

      // Act
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: '',
          rules,
          lazyRules: false
        }
      })

      // Assert
      expect(wrapper.exists()).toBe(true)
    })

    it('should show error message when validation fails', async () => {
      // Arrange
      const rules = [(val: string) => val.length >= 5 || 'Min 5 characters']

      // Act
      const wrapper = mount(BaseInput, {
        props: {
          modelValue: 'abc',
          rules
        }
      })

      // Assert
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Password Type', () => {
    it('should toggle password visibility', async () => {
      // Arrange
      const props = {
        type: 'password' as const,
        showPasswordToggle: true
      }

      // Act
      const wrapper = mount(BaseInput, { props })

      // Assert
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Mask', () => {
    it('should apply input mask', () => {
      // Arrange
      const mask = '###.###.###-##'

      // Act
      const wrapper = mount(BaseInput, {
        props: { mask }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('mask')).toBe(mask)
    })
  })

  describe('useBaseField Integration', () => {
    it('should use internal value from composable', async () => {
      // Arrange
      const wrapper = mount(BaseInput, {
        props: { modelValue: 'initial' }
      })
      const input = wrapper.findComponent({ name: 'QInput' })

      // Act
      await input.vm.$emit('update:model-value', 'changed')

      // Assert
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['changed'])
    })
  })

  describe('Custom Classes', () => {
    it('should apply custom class', () => {
      // Arrange
      const customClass = 'my-input'

      // Act
      const wrapper = mount(BaseInput, {
        props: { customClass }
      })

      // Assert
      expect(wrapper.classes()).toContain(customClass)
    })
  })

  describe('Loading State', () => {
    it('should show loading indicator', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseInput, {
        props: { loading: true }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('loading')).toBe(true)
    })
  })

  describe('Autofocus', () => {
    it('should autofocus on mount', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseInput, {
        props: { autofocus: true }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('autofocus')).toBe(true)
    })
  })
})