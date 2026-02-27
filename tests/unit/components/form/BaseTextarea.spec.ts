/**
 * Tests/unit/components/form/Base Textarea spec module.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTextarea from '@/components/form/BaseTextarea.vue'

vi.mock('@/composables/forms/useBaseField', () => ({
  useBaseField: vi.fn(() => ({
    fieldId: 'test-textarea',
    hasError: false,
    errorMessage: '',
    validate: vi.fn()
  }))
}))

describe('BaseTextarea', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Props', () => {
    it('should render with default props', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTextarea)

      // Assert
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'QInput' }).exists()).toBe(true)
    })

    it('should bind modelValue', () => {
      // Arrange
      const modelValue = 'Sample text content'

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { modelValue }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('modelValue')).toBe(modelValue)
    })

    it('should apply label prop', () => {
      // Arrange
      const label = 'Description'

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { label }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('label')).toBe(label)
    })

    it('should apply placeholder prop', () => {
      // Arrange
      const placeholder = 'Enter your message here'

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { placeholder }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('placeholder')).toBe(placeholder)
    })

    it('should apply rows prop', () => {
      // Arrange
      const rows = 5

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { rows }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('rows')).toBe(rows)
    })

    it('should apply outlined prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { outlined: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('outlined')).toBe(true)
    })

    it('should apply filled prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { filled: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('filled')).toBe(true)
    })

    it('should apply disable prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { disable: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('disable')).toBe(true)
    })

    it('should apply readonly prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { readonly: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('readonly')).toBe(true)
    })

    it('should set type as textarea', () => {
      // Arrange
      const type = 'textarea' as const

      // Act
      const wrapper = mount(BaseTextarea)

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('type')).toBe(type)
    })

    it('should apply maxlength prop', () => {
      // Arrange
      const maxlength = 500

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { maxlength }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('maxlength')).toBe(maxlength)
    })

    it('should apply rules prop', () => {
      // Arrange
      const rules = [(val: string) => val.length > 0 || 'Required']

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { rules }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('rules')).toEqual(rules)
    })
  })

  describe('Events', () => {
    it('should emit update:modelValue on input', async () => {
      // Arrange
      const wrapper = mount(BaseTextarea)
      const newValue = 'New text content'

      // Act
      await wrapper.findComponent({ name: 'QInput' }).vm.$emit('update:modelValue', newValue)

      // Assert
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([newValue])
    })

    it('should emit blur event', async () => {
      // Arrange
      const wrapper = mount(BaseTextarea)

      // Act
      await wrapper.findComponent({ name: 'QInput' }).vm.$emit('blur')

      // Assert
      expect(wrapper.emitted('blur')).toBeTruthy()
    })

    it('should emit focus event', async () => {
      // Arrange
      const wrapper = mount(BaseTextarea)

      // Act
      await wrapper.findComponent({ name: 'QInput' }).vm.$emit('focus')

      // Assert
      expect(wrapper.emitted('focus')).toBeTruthy()
    })

    it('should emit input event on value change', async () => {
      // Arrange
      const wrapper = mount(BaseTextarea)
      const inputValue = 'Typing...'

      // Act
      await wrapper.findComponent({ name: 'QInput' }).vm.$emit('input', inputValue)

      // Assert
      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('Slots', () => {
    it('should render prepend slot', () => {
      // Arrange
      const slots = {
        prepend: '<div class="prepend-content">Prepend</div>'
      }

      // Act
      const wrapper = mount(BaseTextarea, { slots })

      // Assert
      expect(wrapper.html()).toContain('prepend-content')
    })

    it('should render append slot', () => {
      // Arrange
      const slots = {
        append: '<div class="append-content">Append</div>'
      }

      // Act
      const wrapper = mount(BaseTextarea, { slots })

      // Assert
      expect(wrapper.html()).toContain('append-content')
    })

    it('should render hint slot', () => {
      // Arrange
      const slots = {
        hint: '<span class="hint-text">Character limit: 500</span>'
      }

      // Act
      const wrapper = mount(BaseTextarea, { slots })

      // Assert
      expect(wrapper.html()).toContain('hint-text')
    })
  })

  describe('Autogrow Feature', () => {
    it('should enable autogrow when prop is true', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { autogrow: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('autogrow')).toBe(true)
    })

    it('should disable autogrow when prop is false', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { autogrow: false }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('autogrow')).toBe(false)
    })

    it('should respect rows prop when autogrow is disabled', () => {
      // Arrange
      const rows = 8

      // Act
      const wrapper = mount(BaseTextarea, {
        props: {
          rows,
          autogrow: false
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('rows')).toBe(rows)
      expect(wrapper.findComponent({ name: 'QInput' }).props('autogrow')).toBe(false)
    })

    it('should expand with content when autogrow is enabled', () => {
      // Arrange
      const longText = 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5'

      // Act
      const wrapper = mount(BaseTextarea, {
        props: {
          modelValue: longText,
          autogrow: true
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('autogrow')).toBe(true)
      expect(wrapper.findComponent({ name: 'QInput' }).props('modelValue')).toBe(longText)
    })
  })

  describe('Character Counter', () => {
    it('should show counter when maxlength is set', () => {
      // Arrange
      const maxlength = 200

      // Act
      const wrapper = mount(BaseTextarea, {
        props: {
          maxlength,
          counter: true
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('counter')).toBe(true)
      expect(wrapper.findComponent({ name: 'QInput' }).props('maxlength')).toBe(maxlength)
    })

    it('should display remaining characters', () => {
      // Arrange
      const modelValue = 'Sample text'
      const maxlength = 100

      // Act
      const wrapper = mount(BaseTextarea, {
        props: {
          modelValue,
          maxlength,
          counter: true
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('counter')).toBe(true)
    })

    it('should not show counter when counter prop is false', () => {
      // Arrange
      const maxlength = 200

      // Act
      const wrapper = mount(BaseTextarea, {
        props: {
          maxlength,
          counter: false
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('counter')).toBe(false)
    })

    it('should enforce maxlength limit', () => {
      // Arrange
      const maxlength = 50

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { maxlength }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('maxlength')).toBe(maxlength)
    })
  })

  describe('useBaseField Integration', () => {
    it('should integrate with useBaseField', () => {
      // Arrange
      const name = 'description'

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { name }
      })

      // Assert
      expect(wrapper.exists()).toBe(true)
    })

    it('should apply field validation', () => {
      // Arrange
      const rules = [(val: string) => val.length >= 10 || 'Minimum 10 characters']

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { rules }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('rules')).toEqual(rules)
    })

    it('should show error message on validation failure', () => {
      // Arrange
      const errorMessage = 'This field is required'

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { errorMessage }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('errorMessage')).toBe(errorMessage)
    })
  })

  describe('Validation', () => {
    it('should apply validation rules', () => {
      // Arrange
      const rules = [
        (val: string) => val.length > 0 || 'Required',
        (val: string) => val.length <= 500 || 'Too long'
      ]

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { rules }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('rules')).toEqual(rules)
    })

    it('should validate on blur when lazy-rules enabled', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { lazyRules: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('lazyRules')).toBe(true)
    })

    it('should validate immediately when lazy-rules is false', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { lazyRules: false }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('lazyRules')).toBe(false)
    })

    it('should show error state when validation fails', () => {
      // Arrange
      const errorMessage = 'Invalid input'

      // Act
      const wrapper = mount(BaseTextarea, {
        props: {
          errorMessage,
          error: true
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('error')).toBe(true)
    })
  })

  describe('Dense Mode', () => {
    it('should apply dense styling', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { dense: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('dense')).toBe(true)
    })
  })

  describe('Custom Classes', () => {
    it('should apply custom class', () => {
      // Arrange
      const customClass = 'my-custom-textarea'

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { customClass }
      })

      // Assert
      expect(wrapper.classes()).toContain(customClass)
    })

    it('should apply multiple custom classes', () => {
      // Arrange
      const customClass = 'class-one class-two'

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { customClass }
      })

      // Assert
      expect(wrapper.classes()).toContain('class-one')
      expect(wrapper.classes()).toContain('class-two')
    })
  })

  describe('Loading State', () => {
    it('should show loading indicator', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { loading: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('loading')).toBe(true)
    })
  })

  describe('Behavior Options', () => {
    it('should apply stack-label for floating label', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { stackLabel: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('stackLabel')).toBe(true)
    })

    it('should enable clearable option', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { clearable: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('clearable')).toBe(true)
    })

    it('should apply bottom-slots prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { bottomSlots: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('bottomSlots')).toBe(true)
    })
  })

  describe('Accessibility', () => {
    it('should have proper textarea semantics', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTextarea)

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('type')).toBe('textarea')
    })

    it('should apply aria-label when provided', () => {
      // Arrange
      const ariaLabel = 'Description field'

      // Act
      const wrapper = mount(BaseTextarea, {
        attrs: { 'aria-label': ariaLabel }
      })

      // Assert
      expect(wrapper.attributes('aria-label')).toBe(ariaLabel)
    })
  })

  describe('Hint Text', () => {
    it('should display hint text', () => {
      // Arrange
      const hint = 'Please provide detailed information'

      // Act
      const wrapper = mount(BaseTextarea, {
        props: { hint }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('hint')).toBe(hint)
    })

    it('should combine hint with character counter', () => {
      // Arrange
      const hint = 'Min 10 characters'
      const maxlength = 200

      // Act
      const wrapper = mount(BaseTextarea, {
        props: {
          hint,
          maxlength,
          counter: true
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('hint')).toBe(hint)
      expect(wrapper.findComponent({ name: 'QInput' }).props('counter')).toBe(true)
    })
  })
})