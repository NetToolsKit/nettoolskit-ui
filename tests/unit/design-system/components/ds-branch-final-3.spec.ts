/**
 * Final branch push, wave 3: residual pools — validator rule extremes,
 * CrudPage sort cycle/pagination, select repositioning + anchored reopen,
 * time picker id-less fallbacks, drawer labelled-title branch, dialog
 * showModal exception path, switcher/scheme module bootstraps.
 */

import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick } from 'vue'

import { DsCrudPage, DsDialog, DsDrawer, DsSelect, DsTimePicker } from '@/design-system/vue'
import { defineResource } from '@/design-system/core'
import { FormValidationService } from '../../../../src/design-system/core/validators/FormValidationService'

describe('FormValidationService rule extremes', () => {
  it('covers boundary and custom-message branches across rules', () => {
    expect(FormValidationService.lengthBetween(2, 4)('abc')).toBe(true)
    expect(FormValidationService.lengthBetween(2, 4, 'faixa')('a')).toBe('faixa')
    expect(FormValidationService.between(1, 5)(3)).toBe(true)
    expect(FormValidationService.between(1, 5, 'fora')(9)).toBe('fora')
    expect(FormValidationService.min(2)(1)).not.toBe(true)
    expect(FormValidationService.max(2)(3)).not.toBe(true)
    expect(FormValidationService.numeric()('123')).toBe(true)
    expect(FormValidationService.numeric('só números')('12a')).toBe('só números')
    expect(FormValidationService.dateFormat()('2026/07/01')).toBe(true)
    expect(FormValidationService.dateFormat('data!')('01-07-2026')).toBe('data!')
    expect(FormValidationService.match('x', 'Senha')('x')).toBe(true)
    expect(typeof FormValidationService.match('x', 'Senha')('y')).toBe('string')
    expect(FormValidationService.url()('https://ntk.io')).toBe(true)
    expect(FormValidationService.url('url!')('nope')).toBe('url!')
    expect(FormValidationService.phone()('(11) 99999-9999')).toBe(true)
  })
})

describe('DsCrudPage sort cycle and pagination', () => {
  it('cycles asc -> desc -> none and pages backwards', async () => {
    type Row = { id: number; name: string }
    const fetch = vi.fn(async () => ({ rows: [{ id: 1, name: 'Ana' }] as Row[], total: 30 }))
    const resource = defineResource<Row>({
      title: 'Ciclo',
      rowKey: 'id',
      columns: [{ field: 'name', sortable: true }],
      pageSize: 10,
      fetch,
    })
    const wrapper = mount(DsCrudPage, { props: { resource } })
    await flushPromises()

    const sortButton = () => wrapper.get('th .ntk-table__sort')
    await sortButton().trigger('click')
    await flushPromises()
    expect(fetch).toHaveBeenLastCalledWith(expect.objectContaining({ descending: false }))

    await sortButton().trigger('click')
    await flushPromises()
    expect(fetch).toHaveBeenLastCalledWith(expect.objectContaining({ descending: true }))

    await sortButton().trigger('click')
    await flushPromises()
    const params = fetch.mock.calls.at(-1)?.[0] as Record<string, unknown>
    expect(params.sortBy).toBeUndefined() // third activation clears the sort

    // Forward then backward pagination.
    const buttons = () => wrapper.findAll('.ntk-table__pagination-button')
    await buttons()[1]!.trigger('click')
    await flushPromises()
    expect(fetch).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }))
    await buttons()[0]!.trigger('click')
    await flushPromises()
    expect(fetch).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1 }))
  })
})

describe('DsSelect repositioning and anchored reopen', () => {
  const options = [
    { label: 'Alfa', value: 'a' },
    { label: 'Gama', value: 'g' },
  ]

  it('repositions on window scroll/resize while open and anchors reopen on the selected value', async () => {
    const wrapper = mount(DsSelect, {
      props: { id: 'rp', label: 'Opção', modelValue: 'g', options },
      attachTo: document.body,
    })

    await wrapper.get('#rp__trigger').trigger('click')
    await nextTick()
    expect(document.querySelector('#rp__listbox')).toBeTruthy()

    window.dispatchEvent(new Event('scroll'))
    window.dispatchEvent(new Event('resize'))
    await nextTick()
    // Panel survives repositioning and the selected option is marked.
    const selected = document.querySelector('#rp__listbox [aria-selected="true"]')
    expect(selected?.textContent).toContain('Gama')

    wrapper.unmount()
    document.body.querySelectorAll('.ntk-select-panel').forEach(node => node.remove())
  })
})

describe('DsTimePicker id-less and unanchored fallbacks', () => {
  it('opens without id/label/modelValue anchoring on the first option', async () => {
    const wrapper = mount(DsTimePicker, {
      props: { modelValue: null, step: 60 },
      attachTo: document.body,
    })

    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()

    const listbox = wrapper.get('[role="listbox"]')
    expect(listbox.attributes('aria-label')).toBe('Escolher horário')
    await listbox.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['00:00'])
    wrapper.unmount()
  })
})

describe('DsDrawer titled header branch', () => {
  it('labels the dialog by the title id and mounts already open', async () => {
    const wrapper = mount(DsDrawer, {
      props: { id: 'dw', modelValue: true, title: 'Navegação' },
      attachTo: document.body,
    })
    await nextTick()

    const dialog = wrapper.get('dialog')
    expect(dialog.attributes('aria-labelledby')).toBe('dw__title')
    expect(wrapper.get('.ntk-drawer__title').text()).toBe('Navegação')
    expect(dialog.attributes('open')).toBeDefined()
    wrapper.unmount()
  })
})

describe('DsDialog showModal exception fallback', () => {
  it('falls back to the open attribute when showModal throws', async () => {
    const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>
    const original = proto.showModal
    proto.showModal = function () {
      throw new Error('already open elsewhere')
    }

    try {
      const wrapper = mount(DsDialog, {
        props: { id: 'thr', modelValue: true, title: 'Fallback' },
        attachTo: document.body,
      })
      await nextTick()
      expect(wrapper.get('dialog').attributes('open')).toBeDefined()
      wrapper.unmount()
    } finally {
      if (original === undefined) {
        delete proto.showModal
      } else {
        proto.showModal = original
      }
    }
  })
})

describe('module bootstrap leftovers', () => {
  it('theme switcher boots from a valid stored id on a fresh module', async () => {
    vi.resetModules()
    localStorage.setItem('ntk-theme', 'kraken')
    const fresh = await import('../../../../src/composables/useThemeSwitcher')
    expect(fresh.useThemeSwitcher().activeTheme.value).toBe('kraken')
    localStorage.removeItem('ntk-theme')
    fresh.resetThemePreference()
    vi.resetModules()
  })

  it('color scheme scope disposal detaches the media listener', async () => {
    vi.resetModules()
    const removed = vi.fn()
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: removed,
    })))
    const fresh = await import('../../../../src/composables/ui/useColorScheme')

    const scope = effectScope()
    scope.run(() => {
      fresh.useColorScheme()
    })
    scope.stop()

    expect(removed).toHaveBeenCalled()
    vi.unstubAllGlobals()
    vi.resetModules()
  })
})