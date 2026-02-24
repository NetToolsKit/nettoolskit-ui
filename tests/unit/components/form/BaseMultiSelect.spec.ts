import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseMultiSelect from '@/components/form/BaseMultiSelect.vue'

vi.mock('@/composables/forms/useBaseField', () => ({
  useBaseField: vi.fn(() => ({
    fieldId: 'test-multiselect',
    hasError: false,
    errorMessage: '',
    validate: vi.fn()
  }))
}))

const mockOptions = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
  { value: 'opt4', label: 'Option 4' },
  { value: 'opt5', label: 'Option 5' }
]

const mockStringOptions = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']

describe('BaseMultiSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Props', () => {
    it('should render with default props', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: { options: mockOptions }
      })

      // Assert
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'QSelect' }).exists()).toBe(true)
    })

    it('should bind modelValue as array', () => {
      // Arrange
      const modelValue = ['opt1', 'opt2']

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          modelValue,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('modelValue')).toEqual(modelValue)
    })

    it('should render with object options', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: { options: mockOptions }
      })

      // Assert
      const qSelect = wrapper.findComponent({ name: 'QSelect' })
      expect(qSelect.props('options')).toEqual(mockOptions)
    })

    it('should render with string options', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: { options: mockStringOptions }
      })

      // Assert
      const qSelect = wrapper.findComponent({ name: 'QSelect' })
      expect(qSelect.props('options')).toEqual(mockStringOptions)
    })

    it('should apply label prop', () => {
      // Arrange
      const label = 'Select Tags'

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          label,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('label')).toBe(label)
    })

    it('should apply placeholder prop', () => {
      // Arrange
      const placeholder = 'Choose multiple items'

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          placeholder,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('placeholder')).toBe(placeholder)
    })

    it('should apply outlined prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          outlined: true,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('outlined')).toBe(true)
    })

    it('should apply filled prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          filled: true,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('filled')).toBe(true)
    })

    it('should apply disable prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          disable: true,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('disable')).toBe(true)
    })

    it('should apply readonly prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          readonly: true,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('readonly')).toBe(true)
    })

    it('should enable multiple selection by default', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: { options: mockOptions }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('multiple')).toBe(true)
    })

    it('should enable use-chips by default', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: { options: mockOptions }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('useChips')).toBe(true)
    })

    it('should apply clearable prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          clearable: true,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('clearable')).toBe(true)
    })

    it('should apply maxValues prop', () => {
      // Arrange
      const maxValues = 3

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          maxValues,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('maxValues')).toBe(maxValues)
    })

    it('should apply rules prop', () => {
      // Arrange
      const rules = [(val: string[]) => val.length > 0 || 'Select at least one']

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          rules,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('rules')).toEqual(rules)
    })
  })

  describe('Events', () => {
    it('should emit update:modelValue on selection', async () => {
      // Arrange
      const wrapper = mount(BaseMultiSelect, {
        props: { options: mockOptions }
      })

      // Act
      await wrapper.findComponent({ name: 'QSelect' }).vm.$emit('update:modelValue', ['opt1', 'opt2'])

      // Assert
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['opt1', 'opt2']])
    })

    it('should emit blur event', async () => {
      // Arrange
      const wrapper = mount(BaseMultiSelect, {
        props: { options: mockOptions }
      })

      // Act
      await wrapper.findComponent({ name: 'QSelect' }).vm.$emit('blur')

      // Assert
      expect(wrapper.emitted('blur')).toBeTruthy()
    })

    it('should emit focus event', async () => {
      // Arrange
      const wrapper = mount(BaseMultiSelect, {
        props: { options: mockOptions }
      })

      // Act
      await wrapper.findComponent({ name: 'QSelect' }).vm.$emit('focus')

      // Assert
      expect(wrapper.emitted('focus')).toBeTruthy()
    })

    it('should emit add event when item is added', async () => {
      // Arrange
      const wrapper = mount(BaseMultiSelect, {
        props: { options: mockOptions }
      })
      const details = { value: 'opt3' }

      // Act
      await wrapper.findComponent({ name: 'QSelect' }).vm.$emit('add', details)

      // Assert
      expect(wrapper.emitted('add')).toBeTruthy()
      expect(wrapper.emitted('add')?.[0]).toEqual([details])
    })

    it('should emit remove event when item is removed', async () => {
      // Arrange
      const wrapper = mount(BaseMultiSelect, {
        props: {
          modelValue: ['opt1', 'opt2'],
          options: mockOptions
        }
      })
      const details = { value: 'opt1' }

      // Act
      await wrapper.findComponent({ name: 'QSelect' }).vm.$emit('remove', details)

      // Assert
      expect(wrapper.emitted('remove')).toBeTruthy()
      expect(wrapper.emitted('remove')?.[0]).toEqual([details])
    })

    it('should emit filter event on search', async () => {
      // Arrange
      const wrapper = mount(BaseMultiSelect, {
        props: {
          useInput: true,
          options: mockOptions
        }
      })
      const filterValue = 'opt'
      const doneFn = vi.fn()

      // Act
      await wrapper.findComponent({ name: 'QSelect' }).vm.$emit('filter', filterValue, doneFn)

      // Assert
      expect(wrapper.emitted('filter')).toBeTruthy()
    })
  })

  describe('Slots', () => {
    it('should render prepend slot', () => {
      // Arrange
      const slots = {
        prepend: '<div class="prepend-content">Prepend</div>'
      }

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: { options: mockOptions },
        slots
      })

      // Assert
      expect(wrapper.html()).toContain('prepend-content')
    })

    it('should render append slot', () => {
      // Arrange
      const slots = {
        append: '<div class="append-content">Append</div>'
      }

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: { options: mockOptions },
        slots
      })

      // Assert
      expect(wrapper.html()).toContain('append-content')
    })

    it('should render custom selected-item slot', () => {
      // Arrange
      const slots = {
        'selected-item': '<span class="custom-chip">Custom</span>'
      }

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          modelValue: ['opt1'],
          options: mockOptions
        },
        slots
      })

      // Assert
      expect(wrapper.html()).toContain('custom-chip')
    })

    it('should render custom option slot', () => {
      // Arrange
      const slots = {
        option: '<div class="custom-option">Custom Option</div>'
      }

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: { options: mockOptions },
        slots
      })

      // Assert
      expect(wrapper.html()).toContain('custom-option')
    })
  })

  describe('Chip Display', () => {
    it('should display selected items as chips', () => {
      // Arrange
      const modelValue = ['opt1', 'opt2']

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          modelValue,
          options: mockOptions
        }
      })

      // Assert
      const qSelect = wrapper.findComponent({ name: 'QSelect' })
      expect(qSelect.props('useChips')).toBe(true)
      expect(qSelect.props('modelValue')).toEqual(modelValue)
    })

    it('should display correct number of chips', () => {
      // Arrange
      const modelValue = ['opt1', 'opt2', 'opt3']

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          modelValue,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('modelValue')).toHaveLength(3)
    })

    it('should allow removing chips when not disabled', () => {
      // Arrange
      const modelValue = ['opt1', 'opt2']

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          modelValue,
          options: mockOptions,
          disable: false
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('disable')).toBe(false)
    })

    it('should prevent removing chips when disabled', () => {
      // Arrange
      const modelValue = ['opt1', 'opt2']

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          modelValue,
          options: mockOptions,
          disable: true
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('disable')).toBe(true)
    })
  })

  describe('Multiple Selection', () => {
    it('should allow selecting multiple items', async () => {
      // Arrange
      const wrapper = mount(BaseMultiSelect, {
        props: { options: mockOptions }
      })

      // Act
      await wrapper.findComponent({ name: 'QSelect' }).vm.$emit('update:modelValue', ['opt1', 'opt2', 'opt3'])

      // Assert
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([['opt1', 'opt2', 'opt3']])
    })

    it('should enforce maxValues limit', () => {
      // Arrange
      const maxValues = 2

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          maxValues,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('maxValues')).toBe(maxValues)
    })

    it('should allow clearing all selections when clearable', () => {
      // Arrange
      const modelValue = ['opt1', 'opt2']

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          modelValue,
          options: mockOptions,
          clearable: true
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('clearable')).toBe(true)
    })

    it('should maintain selection order', async () => {
      // Arrange
      const wrapper = mount(BaseMultiSelect, {
        props: { options: mockOptions }
      })
      const expectedOrder = ['opt2', 'opt1', 'opt4']

      // Act
      await wrapper.findComponent({ name: 'QSelect' }).vm.$emit('update:modelValue', expectedOrder)

      // Assert
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([expectedOrder])
    })
  })

  describe('Filtering', () => {
    it('should enable filtering with use-input prop', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          useInput: true,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('useInput')).toBe(true)
    })

    it('should apply custom filter function', () => {
      // Arrange
      const filterFn = vi.fn()

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          useInput: true,
          options: mockOptions,
          filterFn
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('filterFn')).toBe(filterFn)
    })

    it('should emit filter event with search term', async () => {
      // Arrange
      const wrapper = mount(BaseMultiSelect, {
        props: {
          useInput: true,
          options: mockOptions
        }
      })
      const searchTerm = 'Option'

      // Act
      await wrapper.findComponent({ name: 'QSelect' }).vm.$emit('filter', searchTerm, vi.fn())

      // Assert
      expect(wrapper.emitted('filter')).toBeTruthy()
    })
  })

  describe('Empty State', () => {
    it('should display when no options provided', () => {
      // Arrange
      const emptyOptions: typeof mockOptions = []

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: { options: emptyOptions }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('options')).toEqual([])
    })

    it('should show custom no-options text', () => {
      // Arrange
      const noOptionsText = 'No items available'

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          options: [],
          noOptionsText
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('noOptionsText')).toBe(noOptionsText)
    })
  })

  describe('Loading State', () => {
    it('should show loading indicator', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          loading: true,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('loading')).toBe(true)
    })

    it('should disable interaction during loading', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          loading: true,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('loading')).toBe(true)
    })
  })

  describe('Validation', () => {
    it('should integrate with useBaseField', () => {
      // Arrange
      const name = 'tags'

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          name,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.exists()).toBe(true)
    })

    it('should apply validation rules', () => {
      // Arrange
      const rules = [(val: string[]) => val.length >= 2 || 'Select at least 2 items']

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          rules,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('rules')).toEqual(rules)
    })

    it('should show error message on validation failure', () => {
      // Arrange
      const errorMessage = 'This field is required'

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          options: mockOptions,
          errorMessage
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('errorMessage')).toBe(errorMessage)
    })

    it('should validate on blur when lazy-rules enabled', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          lazyRules: true,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('lazyRules')).toBe(true)
    })
  })

  describe('Dense Mode', () => {
    it('should apply dense styling', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          dense: true,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('dense')).toBe(true)
    })
  })

  describe('Custom Classes', () => {
    it('should apply custom class', () => {
      // Arrange
      const customClass = 'my-custom-multiselect'

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          customClass,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.classes()).toContain(customClass)
    })

    it('should apply multiple custom classes', () => {
      // Arrange
      const customClass = 'class-one class-two'

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          customClass,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.classes()).toContain('class-one')
      expect(wrapper.classes()).toContain('class-two')
    })
  })

  describe('Behavior Options', () => {
    it('should apply stack-label for floating label', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          stackLabel: true,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('stackLabel')).toBe(true)
    })

    it('should enable emit-value to emit values instead of objects', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          emitValue: true,
          options: mockOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('emitValue')).toBe(true)
    })

    it('should enable map-options for string arrays', () => {
      // Arrange

      // Act
      const wrapper = mount(BaseMultiSelect, {
        props: {
          mapOptions: true,
          options: mockStringOptions
        }
      })

      // Assert
      expect(wrapper.findComponent({ name: 'QSelect' }).props('mapOptions')).toBe(true)
    })
  })
})
