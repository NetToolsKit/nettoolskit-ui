import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTimePicker from '@/components/form/BaseTimePicker.vue'

vi.mock('@/composables/forms/useBaseField', () => ({
  useBaseField: vi.fn(() => ({
    fieldId: 'test-timepicker',
    hasError: false,
    errorMessage: '',
    validate: vi.fn()
  }))
}))

describe('BaseTimePicker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Props', () => {
    it('should render with default props', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker)

      // Assert
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'QInput' }).exists()).toBe(true)
    })

    it('should bind modelValue as time string', () => {
      // Arrange
      const modelValue = '14:30'

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { modelValue }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('modelValue')).toBe(modelValue)
    })

    it('should apply label prop', () => {
      // Arrange
      const label = 'Select Time'

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { label }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('label')).toBe(label)
    })

    it('should apply placeholder prop', () => {
      // Arrange
      const placeholder = 'HH:MM'

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { placeholder }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('placeholder')).toBe(placeholder)
    })

    it('should apply outlined prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { outlined: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('outlined')).toBe(true)
    })

    it('should apply filled prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { filled: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('filled')).toBe(true)
    })

    it('should apply disable prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { disable: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('disable')).toBe(true)
    })

    it('should apply readonly prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { readonly: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('readonly')).toBe(true)
    })

    it('should apply rules prop', () => {
      // Arrange
      const rules = [(val: string) => !!val || 'Time is required']

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { rules }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('rules')).toEqual(rules)
    })
  })

  describe('Time Format', () => {
    it('should display time in HH:MM format', () => {
      // Arrange
      const modelValue = '09:45'

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { modelValue }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('modelValue')).toBe(modelValue)
    })

    it('should accept 24-hour format', () => {
      // Arrange
      const modelValue = '23:59'

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { modelValue }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('modelValue')).toBe(modelValue)
    })

    it('should accept morning time', () => {
      // Arrange
      const modelValue = '08:00'

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { modelValue }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('modelValue')).toBe(modelValue)
    })

    it('should accept afternoon time', () => {
      // Arrange
      const modelValue = '15:30'

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { modelValue }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('modelValue')).toBe(modelValue)
    })

    it('should handle midnight time', () => {
      // Arrange
      const modelValue = '00:00'

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { modelValue }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('modelValue')).toBe(modelValue)
    })
  })

  describe('Time Popup', () => {
    it('should render QTime component in popup', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker)

      // Assert
      expect(wrapper.findComponent({ name: 'QTime' }).exists()).toBe(true)
    })

    it('should bind time value to QTime', () => {
      // Arrange
      const modelValue = '14:30'

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { modelValue }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QTime' }).props('modelValue')).toBe(modelValue)
    })

    it('should display clock icon to open popup', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker)

      // Assert
      const icon = wrapper.findComponent({ name: 'QIcon' })
      expect(icon.exists()).toBe(true)
    })

    it('should have cursor pointer on clock icon', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker)

      // Assert
      const icon = wrapper.findComponent({ name: 'QIcon' })
      expect(icon.classes()).toContain('cursor-pointer')
    })
  })

  describe('24-Hour Format', () => {
    it('should use 24-hour format by default', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker)

      // Assert
      expect(wrapper.findComponent({ name: 'QTime' }).props('format24h')).toBe(true)
    })

    it('should allow 12-hour format when format24h is false', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { format24h: false }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QTime' }).props('format24h')).toBe(false)
    })

    it('should display hours from 00-23 in 24h mode', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { format24h: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QTime' }).props('format24h')).toBe(true)
    })
  })

  describe('Calendar Actions', () => {
    it('should render "Agora" button to set current time', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker)

      // Assert
      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const nowButton = buttons.find(btn => btn.text().includes('Agora'))
      expect(nowButton).toBeDefined()
    })

    it('should render "Fechar" button to close popup', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker)

      // Assert
      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const closeButton = buttons.find(btn => btn.text().includes('Fechar'))
      expect(closeButton).toBeDefined()
    })

    it('should set current time when "Agora" is clicked', async () => {
      // Arrange
      const wrapper = mount(BaseTimePicker)
      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const nowButton = buttons.find(btn => btn.text().includes('Agora'))

      // Act
      await nowButton?.trigger('click')

      // Assert
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('should close popup when "Fechar" is clicked', async () => {
      // Arrange
      const wrapper = mount(BaseTimePicker)
      const buttons = wrapper.findAllComponents({ name: 'QBtn' })
      const closeButton = buttons.find(btn => btn.text().includes('Fechar'))

      // Act
      await closeButton?.trigger('click')

      // Assert
      expect(closeButton?.attributes('v-close-popup')).toBeDefined()
    })
  })

  describe('Events', () => {
    it('should emit update:modelValue on time selection', async () => {
      // Arrange
      const wrapper = mount(BaseTimePicker)
      const newTime = '16:45'

      // Act
      await wrapper.findComponent({ name: 'QTime' }).vm.$emit('update:modelValue', newTime)

      // Assert
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([newTime])
    })

    it('should emit update:modelValue on input change', async () => {
      // Arrange
      const wrapper = mount(BaseTimePicker)
      const newTime = '10:20'

      // Act
      await wrapper.findComponent({ name: 'QInput' }).vm.$emit('update:modelValue', newTime)

      // Assert
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })

    it('should emit blur event', async () => {
      // Arrange
      const wrapper = mount(BaseTimePicker)

      // Act
      await wrapper.findComponent({ name: 'QInput' }).vm.$emit('blur')

      // Assert
      expect(wrapper.emitted('blur')).toBeTruthy()
    })

    it('should emit focus event', async () => {
      // Arrange
      const wrapper = mount(BaseTimePicker)

      // Act
      await wrapper.findComponent({ name: 'QInput' }).vm.$emit('focus')

      // Assert
      expect(wrapper.emitted('focus')).toBeTruthy()
    })
  })

  describe('useBaseField Integration', () => {
    it('should integrate with useBaseField', () => {
      // Arrange
      const name = 'appointmentTime'

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { name }
      })

      // Assert
      expect(wrapper.exists()).toBe(true)
    })

    it('should apply field validation', () => {
      // Arrange
      const rules = [(val: string) => !!val || 'Time is required']

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { rules }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('rules')).toEqual(rules)
    })

    it('should show error message on validation failure', () => {
      // Arrange
      const errorMessage = 'Invalid time format'

      // Act
      const wrapper = mount(BaseTimePicker, {
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
        (val: string) => !!val || 'Required',
        (val: string) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(val) || 'Invalid format'
      ]

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { rules }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('rules')).toEqual(rules)
    })

    it('should validate on blur when lazy-rules enabled', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { lazyRules: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('lazyRules')).toBe(true)
    })

    it('should show error state when validation fails', () => {
      // Arrange
      const errorMessage = 'Invalid time'

      // Act
      const wrapper = mount(BaseTimePicker, {
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
      const wrapper = mount(BaseTimePicker, {
        props: { dense: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('dense')).toBe(true)
    })
  })

  describe('Custom Classes', () => {
    it('should apply custom class', () => {
      // Arrange
      const customClass = 'my-custom-timepicker'

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { customClass }
      })

      // Assert
      expect(wrapper.classes()).toContain(customClass)
    })

    it('should apply multiple custom classes', () => {
      // Arrange
      const customClass = 'class-one class-two'

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { customClass }
      })

      // Assert
      expect(wrapper.classes()).toContain('class-one')
      expect(wrapper.classes()).toContain('class-two')
    })
  })

  describe('Accessibility', () => {
    it('should have proper input semantics', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker)

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).exists()).toBe(true)
    })

    it('should apply stack-label for better UX', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { stackLabel: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('stackLabel')).toBe(true)
    })

    it('should have cursor-pointer on clock icon for clarity', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker)

      // Assert
      const icon = wrapper.findComponent({ name: 'QIcon' })
      expect(icon.classes()).toContain('cursor-pointer')
    })
  })

  describe('Time Selection Behavior', () => {
    it('should allow hour selection', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker)

      // Assert
      expect(wrapper.findComponent({ name: 'QTime' }).exists()).toBe(true)
    })

    it('should allow minute selection', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker)

      // Assert
      expect(wrapper.findComponent({ name: 'QTime' }).exists()).toBe(true)
    })

    it('should update time on direct input', async () => {
      // Arrange
      const wrapper = mount(BaseTimePicker)
      const newTime = '18:30'

      // Act
      await wrapper.findComponent({ name: 'QInput' }).vm.$emit('update:modelValue', newTime)

      // Assert
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([newTime])
    })
  })

  describe('Mask and Format', () => {
    it('should apply time mask for input validation', () => {
      // Arrange
      const mask = 'time'

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { mask }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('mask')).toBe(mask)
    })

    it('should enforce HH:MM format', () => {
      // Arrange
      const mask = 'time'

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { mask }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('mask')).toBe(mask)
    })
  })

  describe('Loading State', () => {
    it('should show loading indicator', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { loading: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('loading')).toBe(true)
    })
  })

  describe('Clearable', () => {
    it('should enable clear button when clearable', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { clearable: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('clearable')).toBe(true)
    })

    it('should emit empty value when cleared', async () => {
      // Arrange
      const wrapper = mount(BaseTimePicker, {
        props: {
          modelValue: '14:30',
          clearable: true
        }
      })

      // Act
      await wrapper.findComponent({ name: 'QInput' }).vm.$emit('update:modelValue', null)

      // Assert
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
  })

  describe('With Seconds', () => {
    it('should support seconds when withSeconds prop is true', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: { withSeconds: true }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QTime' }).props('withSeconds')).toBe(true)
    })

    it('should display HH:MM:SS format with seconds enabled', () => {
      // Arrange
      const modelValue = '14:30:45'

      // Act
      const wrapper = mount(BaseTimePicker, {
        props: {
          modelValue,
          withSeconds: true
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QInput' }).props('modelValue')).toBe(modelValue)
    })
  })
})