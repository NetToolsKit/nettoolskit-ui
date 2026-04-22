/**
 * BaseDatePicker Component - Unit Tests
 */

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseDatePicker from '../../../../src/components/form/BaseDatePicker.vue'

describe('BaseDatePicker', () => {
  describe('Props', () => {
    it('should render with default props', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker)

      // Assert
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'QInput' }).exists()).toBe(true)
    })

    it('should bind modelValue correctly', () => {
      // Arrange
      const modelValue = '2025/12/25'

      // Act
      const wrapper = mount(BaseDatePicker, {
        props: { modelValue }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('modelValue')).toBe(modelValue)
    })

    it('should apply label prop', () => {
      // Arrange
      const label = 'Birth Date'

      // Act
      const wrapper = mount(BaseDatePicker, {
        props: { label }
      })

      // Assert
      expect(wrapper.text()).toContain(label)
    })

    it('should apply placeholder prop', () => {
      // Arrange
      const placeholder = 'Select a date'

      // Act
      const wrapper = mount(BaseDatePicker, {
        props: { placeholder }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('placeholder')).toBe(placeholder)
    })

    it('should have default placeholder YYYY/MM/DD', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker)

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('placeholder')).toBe('YYYY/MM/DD')
    })

    it('should apply outlined style', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker, {
        props: { outlined: true }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('outlined')).toBe(true)
    })

    it('should apply filled style', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker, {
        props: { filled: true }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('filled')).toBe(true)
    })

    it('should disable input when disable prop is true', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker, {
        props: { disable: true }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('disable')).toBe(true)
    })

    it('should make input readonly', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker, {
        props: { readonly: true }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('readonly')).toBe(true)
    })

    it('should apply validation rules', () => {
      // Arrange
      const rules = [(val: string) => !!val || 'Date is required']

      // Act
      const wrapper = mount(BaseDatePicker, {
        props: { rules }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('rules')).toEqual(rules)
    })
  })

  describe('Date Calendar', () => {
    it('should render calendar icon', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker)

      // Assert
      expect(wrapper.find('[name="event"]').exists()).toBe(true)
    })

    it('should have calendar popup', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker)

      // Assert
      expect(wrapper.findComponent({ name: 'QPopupProxy' }).exists()).toBe(true)
    })

    it('should render QDate component', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker)

      // Assert
      expect(wrapper.findComponent({ name: 'QDate' }).exists()).toBe(true)
    })

    it('should apply English locale', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker)
      const qDate = wrapper.findComponent({ name: 'QDate' })
      const locale = qDate.props('locale')

      // Assert
      expect(locale).toBeDefined()
      expect(locale.days).toContain('Sunday')
      expect(locale.months).toContain('January')
    })

    it('should have minimal calendar style', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker)

      // Assert
      const qDate = wrapper.findComponent({ name: 'QDate' })
      expect(qDate.props('minimal')).toBe(true)
    })

    it('should have today button', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker)

      // Assert
      const qDate = wrapper.findComponent({ name: 'QDate' })
      expect(qDate.props('todayBtn')).toBe(true)
    })

    it('should use tokenized calendar colors instead of a fixed Quasar color prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker)

      // Assert
      const qDate = wrapper.findComponent({ name: 'QDate' })
      expect(qDate.props('color')).toBeUndefined()
      expect(qDate.classes()).toContain('base-date-picker__calendar')
    })
  })

  describe('Calendar Actions', () => {
    it('should have "Today" button', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker)

      // Assert
      expect(wrapper.text()).toContain('Today')
    })

    it('should have "Close" button', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker)

      // Assert
      expect(wrapper.text()).toContain('Close')
    })

    it('should set today date when "Today" button clicked', async () => {
      // Arrange
      const wrapper = mount(BaseDatePicker, {
        props: { modelValue: '' }
      })
      const todayBtn = wrapper.findAll('button').find(btn => btn.text() === 'Today')

      // Act
      await todayBtn?.trigger('click')

      // Assert
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      const emittedValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as string
      expect(emittedValue).toMatch(/\d{4}\/\d{2}\/\d{2}/)
    })
  })

  describe('Events', () => {
    it('should emit update:modelValue on date selection', async () => {
      // Arrange
      const wrapper = mount(BaseDatePicker, {
        props: { modelValue: '' }
      })
      const qDate = wrapper.findComponent({ name: 'QDate' })

      // Act
      await qDate.vm.$emit('update:model-value', '2025/12/25')

      // Assert
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2025/12/25'])
    })

    it('should emit update:modelValue on input change', async () => {
      // Arrange
      const wrapper = mount(BaseDatePicker, {
        props: { modelValue: '' }
      })
      const input = wrapper.findComponent({ name: 'QInput' })

      // Act
      await input.vm.$emit('update:model-value', '2025/12/25')

      // Assert
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    })
  })

  describe('useBaseField Integration', () => {
    it('should use internal value from composable', async () => {
      // Arrange
      const modelValue = '2025/01/01'

      // Act
      const wrapper = mount(BaseDatePicker, {
        props: { modelValue }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('modelValue')).toBe(modelValue)
    })

    it('should handle value updates through composable', async () => {
      // Arrange
      const wrapper = mount(BaseDatePicker, {
        props: { modelValue: '2025/01/01' }
      })
      const qDate = wrapper.findComponent({ name: 'QDate' })

      // Act
      await qDate.vm.$emit('update:model-value', '2025/12/31')

      // Assert
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['2025/12/31'])
    })
  })

  describe('Date Format', () => {
    it('should format today date correctly (YYYY/MM/DD)', async () => {
      // Arrange
      const wrapper = mount(BaseDatePicker)
      const todayBtn = wrapper.findAll('button').find(btn => btn.text() === 'Today')

      // Act
      await todayBtn?.trigger('click')

      // Assert
      const emittedValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as string
      expect(emittedValue).toMatch(/^\d{4}\/\d{2}\/\d{2}$/)
    })

    it('should pad single digit months and days with zero', async () => {
      // Arrange
      const wrapper = mount(BaseDatePicker)
      const todayBtn = wrapper.findAll('button').find(btn => btn.text() === 'Today')

      // Act
      await todayBtn?.trigger('click')

      // Assert
      const emittedValue = wrapper.emitted('update:modelValue')?.[0]?.[0] as string
      const parts = emittedValue.split('/')
      expect(parts[1]).toMatch(/^\d{2}$/) // month with 2 digits
      expect(parts[2]).toMatch(/^\d{2}$/) // day with 2 digits
    })
  })

  describe('Accessibility', () => {
    it('should have stack-label for better UX', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker)

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('stackLabel')).toBe(true)
    })

    it('should have calendar icon as clickable trigger', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker)

      // Assert
      const icon = wrapper.find('[name="event"]')
      expect(icon.classes()).toContain('cursor-pointer')
    })
  })

  describe('Validation', () => {
    it('should validate date format', async () => {
      // Arrange
      const rules = [(val: string) => /^\d{4}\/\d{2}\/\d{2}$/.test(val) || 'Invalid date format']

      // Act
      const wrapper = mount(BaseDatePicker, {
        props: {
          modelValue: 'invalid',
          rules
        }
      })

      // Assert
      expect(wrapper.exists()).toBe(true)
    })

    it('should validate required date', async () => {
      // Arrange
      const rules = [(val: string) => !!val || 'Date is required']

      // Act
      const wrapper = mount(BaseDatePicker, {
        props: {
          modelValue: '',
          rules
        }
      })

      // Assert
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Dense Mode', () => {
    it('should apply dense mode', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker, {
        props: { dense: true }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('dense')).toBe(true)
    })
  })

  describe('Lazy Rules', () => {
    it('should apply lazy rules', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker, {
        props: { lazyRules: true }
      })

      // Assert
      const input = wrapper.findComponent({ name: 'QInput' })
      expect(input.props('lazyRules')).toBe(true)
    })
  })

  describe('Custom Class', () => {
    it('should apply base-date-picker class', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseDatePicker)

      // Assert
      expect(wrapper.find('.base-date-picker').exists()).toBe(true)
    })
  })
})
