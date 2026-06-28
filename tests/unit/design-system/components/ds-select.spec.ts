import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { DsSelect } from '@/design-system/vue'

describe('DsSelect', () => {
  const options = [
    { label: 'Draft', value: 'draft' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived', disabled: true },
  ]

  afterEach(() => {
    // The themed panel teleports to <body>; clear any leftover nodes.
    document.body.querySelectorAll('.ntk-select-panel').forEach(node => node.remove())
  })

  const openPanel = async (wrapper: ReturnType<typeof mount>) => {
    await wrapper.get('.ntk-select__trigger').trigger('click')
    await nextTick()
  }

  it('renders label, trigger, message, attributes, and recipe classes', () => {
    const wrapper = mount(DsSelect, {
      attachTo: document.body,
      props: {
        id: 'release-status',
        testId: 'release-status-field',
        modelValue: 'published',
        name: 'releaseStatus',
        label: 'Release status',
        hint: 'Choose the publication state',
        placeholder: 'Select status',
        options,
        variant: 'filled',
        size: 'sm',
        intent: 'primary',
        required: true,
        class: ['custom-select'],
      },
    })

    const root = wrapper.get('[data-testid="release-status-field"]')
    const trigger = wrapper.get('.ntk-select__trigger')

    expect(root.element.tagName).toBe('DIV')
    expect(root.text()).toContain('Release status')
    expect(root.text()).toContain('Choose the publication state')
    expect(root.classes()).toEqual(expect.arrayContaining([
      'ntk-field',
      'ntk-select',
      'ntk-field--variant-filled',
      'ntk-field--size-sm',
      'ntk-field--intent-primary',
      'ntk-field--is-required',
      'custom-select',
    ]))
    expect(trigger.attributes('role')).toBe('combobox')
    expect(trigger.attributes('aria-haspopup')).toBe('listbox')
    expect(trigger.attributes('aria-expanded')).toBe('false')
    expect(trigger.attributes('aria-controls')).toBe('release-status__listbox')
    expect(trigger.attributes('aria-describedby')).toBe('release-status__description')
    // Trigger label reflects the selected option label.
    expect(trigger.text()).toContain('Published')
    wrapper.unmount()
  })

  it('opens a themed listbox panel with correct ARIA and picks a single value', async () => {
    const wrapper = mount(DsSelect, {
      attachTo: document.body,
      props: { id: 'sel', modelValue: 'draft', options },
    })

    await openPanel(wrapper)
    expect(wrapper.get('.ntk-select__trigger').attributes('aria-expanded')).toBe('true')

    const listbox = document.getElementById('sel__listbox')
    expect(listbox?.getAttribute('role')).toBe('listbox')
    const optionEls = listbox?.querySelectorAll('[role="option"]') ?? []
    expect(optionEls.length).toBe(3)
    expect(optionEls[0]?.getAttribute('aria-selected')).toBe('true')
    expect(optionEls[2]?.getAttribute('aria-disabled')).toBe('true')

    // Click the second (enabled) option.
    ;(optionEls[1] as HTMLElement).click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['published'])
    // Single-select closes after a pick.
    expect(wrapper.get('.ntk-select__trigger').attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('toggles values in multiple mode and keeps the panel open', async () => {
    const wrapper = mount(DsSelect, {
      attachTo: document.body,
      props: { id: 'multi', multiple: true, modelValue: ['draft'], options },
    })

    await openPanel(wrapper)
    const listbox = document.getElementById('multi__listbox')
    expect(listbox?.getAttribute('aria-multiselectable')).toBe('true')

    const optionEls = listbox?.querySelectorAll('[role="option"]') ?? []
    // Add 'published'
    ;(optionEls[1] as HTMLElement).click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['draft', 'published']])
    // Panel stays open in multiple mode.
    expect(wrapper.get('.ntk-select__trigger').attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })

  it('filters options through the in-panel search field', async () => {
    const wrapper = mount(DsSelect, {
      attachTo: document.body,
      props: { id: 'search', searchable: true, options },
    })

    await openPanel(wrapper)
    const search = document.querySelector<HTMLInputElement>('.ntk-select-panel__search-input')
    expect(search).not.toBeNull()
    if (search) {
      search.value = 'pub'
      search.dispatchEvent(new Event('input'))
    }
    await nextTick()

    const visible = document.querySelectorAll('#search__listbox [role="option"]')
    expect(visible.length).toBe(1)
    expect(visible[0]?.textContent).toContain('Published')
    wrapper.unmount()
  })

  it('shows the empty label when the search matches nothing', async () => {
    const wrapper = mount(DsSelect, {
      attachTo: document.body,
      props: { id: 'empty', searchable: true, emptyLabel: 'Nothing here', options },
    })

    await openPanel(wrapper)
    const search = document.querySelector<HTMLInputElement>('.ntk-select-panel__search-input')
    if (search) {
      search.value = 'zzz'
      search.dispatchEvent(new Event('input'))
    }
    await nextTick()
    expect(document.querySelector('.ntk-select-panel__empty')?.textContent).toContain('Nothing here')
    wrapper.unmount()
  })

  it('opens and moves the active option with the keyboard', async () => {
    const wrapper = mount(DsSelect, {
      attachTo: document.body,
      props: { id: 'kbd', modelValue: 'draft', options },
    })

    const trigger = wrapper.get('.ntk-select__trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(trigger.attributes('aria-expanded')).toBe('true')

    // Enter selects the active option.
    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    wrapper.unmount()
  })

  it('closes on Escape and does not open when disabled', async () => {
    const wrapper = mount(DsSelect, {
      attachTo: document.body,
      props: { id: 'esc', options },
    })
    await openPanel(wrapper)
    await wrapper.get('.ntk-select__trigger').trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.get('.ntk-select__trigger').attributes('aria-expanded')).toBe('false')

    const disabled = mount(DsSelect, {
      attachTo: document.body,
      props: { id: 'dis', disabled: true, options },
    })
    await disabled.get('.ntk-select__trigger').trigger('click')
    await nextTick()
    expect(disabled.get('.ntk-select__trigger').attributes('aria-expanded')).toBe('false')
    expect(disabled.get('.ntk-select__trigger').attributes('disabled')).toBeDefined()
    wrapper.unmount()
    disabled.unmount()
  })

  it('does not open or emit model updates while readonly', async () => {
    const wrapper = mount(DsSelect, {
      attachTo: document.body,
      props: { id: 'ro', modelValue: 'draft', readonly: true, options },
    })

    await openPanel(wrapper)
    // A readonly select shows its value but does not open an interactive panel.
    expect(wrapper.get('.ntk-select__trigger').attributes('aria-expanded')).toBe('false')
    expect(document.getElementById('ro__listbox')).toBeNull()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('defaults to comfortable density and reflects an explicit density class', () => {
    expect(mount(DsSelect, { props: { options } }).get('.ntk-field').classes())
      .toContain('ntk-field--density-comfortable')

    const compact = mount(DsSelect, { props: { options, density: 'compact' } })
    expect(compact.get('.ntk-field').classes()).toContain('ntk-field--density-compact')
  })
})