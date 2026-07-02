/**
 * Final branch push, wave 4: per-field semantic override chains, date-picker
 * range clamping, drawer escape, time-picker active-descendant wiring,
 * select search-tab close, and the useBranding partial-identity fallbacks
 * against a mocked catalog (the only honest way to force absent fields).
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { DsDatePicker, DsDrawer, DsSelect, DsTimePicker } from '@/design-system/vue'
import {
  resetSemanticColors,
  setSemanticColors,
} from '../../../../src/config/colors/semantic.config'

describe('semantic overrides per field', () => {
  it('covers every explicit border/positive/negative override individually', () => {
    const resolved = setSemanticColors({
      successPrimary: '#101010',
      warningPrimary: '#202020',
      errorPrimary: '#303030',
      infoPrimary: '#404040',
      warningBorder: '#212121',
      infoBorder: '#414141',
      negative: '#313131',
    })

    expect(resolved.warningBorder).toBe('#212121')
    expect(resolved.infoBorder).toBe('#414141')
    expect(resolved.negative).toBe('#313131')
    // Non-overridden derived fields fall back to their primaries.
    expect(resolved.successBorder).toBeDefined()
    expect(resolved.positive).toBeDefined()
    resetSemanticColors()
  })
})

describe('DsDatePicker range clamping on open', () => {
  it('clamps the focus anchor into the min/max window', async () => {
    const wrapper = mount(DsDatePicker, {
      props: { modelValue: '2026-06-01', min: '2026-06-10', max: '2026-06-20' },
      attachTo: document.body,
    })
    await wrapper.get('.ntk-date-picker__trigger').trigger('click')
    await nextTick()

    // The roving tab stop landed on the clamped anchor, not the raw model.
    const anchored = wrapper.get('.ntk-date-picker__day[tabindex="0"]')
    expect(anchored.attributes('data-iso')).toBe('2026-06-10')
    wrapper.unmount()
  })
})

describe('DsDrawer escape close (non-persistent)', () => {
  it('closes on cancel when not persistent', async () => {
    const wrapper = mount(DsDrawer, {
      props: { modelValue: true, ariaLabel: 'Menu' },
      attachTo: document.body,
    })
    await nextTick()

    await wrapper.get('dialog').trigger('cancel')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })
})

describe('DsTimePicker active descendant wiring', () => {
  it('exposes aria-activedescendant for the anchored option when an id exists', async () => {
    const wrapper = mount(DsTimePicker, {
      props: { id: 'ad', label: 'Hora', modelValue: '01:00', step: 60 },
      attachTo: document.body,
    })
    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()

    const listbox = wrapper.get('[role="listbox"]')
    expect(listbox.attributes('aria-activedescendant')).toBe('ad__opt-01-00')
    expect(listbox.attributes('aria-label')).toBe('Opções de Hora')
    wrapper.unmount()
  })
})

describe('DsSelect search Tab close', () => {
  it('closes the panel when tabbing out of the search input', async () => {
    const wrapper = mount(DsSelect, {
      props: {
        id: 'st',
        label: 'Busca',
        modelValue: '',
        searchable: true,
        options: [{ label: 'Alfa', value: 'a' }],
      },
      attachTo: document.body,
    })

    await wrapper.get('#st__trigger').trigger('click')
    await nextTick()
    const search = document.querySelector<HTMLInputElement>('.ntk-select-panel input')
    expect(search).toBeTruthy()

    search!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }))
    await nextTick()
    expect(document.querySelector('#st__listbox')).toBeNull()

    wrapper.unmount()
    document.body.querySelectorAll('.ntk-select-panel').forEach(node => node.remove())
  })
})

describe('useBranding partial-identity fallbacks (mocked catalog)', () => {
  it('falls back to empty strings for missing identity fields', async () => {
    vi.resetModules()
    // The global setup mocks useBranding itself — detach that mock, and mock
    // its useTheme dependency with a partial identity instead.
    vi.doUnmock('@/composables/ui/useBranding')
    vi.doUnmock('../../../../src/composables/ui/useBranding')
    vi.doMock('../../../../src/composables/ui/useTheme', () => ({
      useTheme: () => ({
        theme: { value: { name: 'partial-theme', identity: { name: 'platea' }, colors: {} } },
        logo: { value: { mark: 'P' } },
      }),
    }))

    const { useBranding } = await import('../../../../src/composables/ui/useBranding')

    const branding = useBranding()
    expect(branding.appName.value).toBe('partial-theme') // displayName missing
    expect(branding.tagline.value).toBe('')
    expect(branding.appUrl.value).toBe('')

    vi.doUnmock('../../../../src/composables/ui/useTheme')
    vi.resetModules()
  })
})