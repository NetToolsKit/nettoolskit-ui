/**
 * Final branch push, wave 2: DsDatePicker keyboard month/week jumps and
 * id-less fallbacks, DsDialog native showModal/close branches (polyfilled),
 * useTheme brightness matrix + storage bootstrap, preset default arguments.
 */

import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { DsDatePicker, DsDialog } from '@/design-system/vue'
import { initTheme, useTheme } from '../../../../src/composables/ui/useTheme'
import { themes, type ThemeName } from '../../../../src/config/theme/theme.config'
import { applyNettoolskitPreset } from '../../../../src/config/presets/nettoolskit.preset'

afterEach(() => {
  useTheme().setTheme('nettoolskit')
  localStorage.removeItem('app-theme')
  document.documentElement.className = ''
  document.documentElement.removeAttribute('style')
})

describe('DsDatePicker keyboard month/week jumps and fallbacks', () => {
  const openPicker = async (props: Record<string, unknown> = {}) => {
    const wrapper = mount(DsDatePicker, {
      props: { modelValue: '2026-06-15', ...props },
      attachTo: document.body,
    })
    await wrapper.get('.ntk-date-picker__trigger').trigger('click')
    await nextTick()
    return wrapper
  }

  it('PageUp/PageDown shift the focused month; Home/End snap to the week edges', async () => {
    const wrapper = await openPicker()
    const popup = wrapper.get('[role="dialog"]')
    const monthLabel = () => wrapper.get('.ntk-date-picker__month-label').text()
    const initial = monthLabel()

    await popup.trigger('keydown', { key: 'PageDown' })
    await nextTick()
    expect(monthLabel()).not.toBe(initial)

    await popup.trigger('keydown', { key: 'PageUp' })
    await nextTick()
    expect(monthLabel()).toBe(initial)

    // 2026-06-15 is a Monday: Home -> Sunday 14th, End -> Saturday 20th.
    await popup.trigger('keydown', { key: 'Home' })
    await popup.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-06-14'])

    wrapper.unmount()
  })

  it('End + unknown keys leave state coherent and outside pointerdown closes', async () => {
    const wrapper = await openPicker()
    const popup = wrapper.get('[role="dialog"]')

    await popup.trigger('keydown', { key: 'End' })
    await popup.trigger('keydown', { key: 'x' }) // default branch: ignored
    await popup.trigger('keydown', { key: ' ' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-06-20'])

    const second = await openPicker({ modelValue: null })
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await nextTick()
    expect(second.find('[role="dialog"]').exists()).toBe(false)

    wrapper.unmount()
    second.unmount()
  })

  it('renders without an id (no control id) and anchors on today without a model value', async () => {
    const wrapper = await openPicker({ modelValue: null, hint: 'dica' })

    expect(wrapper.get('.ntk-date-picker__input').attributes('id')).toBeUndefined()
    // hint without id -> no describedby id can be built.
    expect(wrapper.get('.ntk-field__message').text()).toBe('dica')
    expect(wrapper.get('[role="dialog"]').exists()).toBe(true)
    wrapper.unmount()
  })
})

describe('DsDialog native dialog API branches (polyfilled)', () => {
  it('uses showModal()/close() when the platform implements them', async () => {
    const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>
    const originalShow = proto.showModal
    const originalClose = proto.close
    let shown = 0
    let closed = 0
    proto.showModal = function (this: HTMLDialogElement) {
      shown += 1
      this.setAttribute('open', '')
    }
    proto.close = function (this: HTMLDialogElement) {
      closed += 1
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    }

    try {
      const wrapper = mount(DsDialog, {
        props: { id: 'poly', modelValue: true, title: 'Nativo' },
        attachTo: document.body,
      })
      await nextTick()
      expect(shown).toBe(1)

      await wrapper.setProps({ modelValue: false })
      await nextTick()
      expect(closed).toBeGreaterThanOrEqual(1)
      wrapper.unmount()
    } finally {
      if (originalShow === undefined) {
        delete proto.showModal
      } else {
        proto.showModal = originalShow
      }
      if (originalClose === undefined) {
        delete proto.close
      } else {
        proto.close = originalClose
      }
    }
  })

  it('cleans up an open dialog on unmount', async () => {
    const wrapper = mount(DsDialog, {
      props: { id: 'um', modelValue: true, title: 'Aberto' },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.get('dialog').attributes('open')).toBeDefined()
    expect(() => wrapper.unmount()).not.toThrow()
  })
})

describe('useTheme brightness matrix and storage bootstrap', () => {
  it('derives text-inverse/footer colors per theme following the brightness rule', () => {
    const { setTheme } = useTheme()
    const root = document.documentElement

    for (const name of Object.keys(themes) as ThemeName[]) {
      setTheme(name)
      const theme = themes[name]
      const hex = theme.colors.background.replace('#', '')
      const valid = /^[0-9A-Fa-f]{6}$/.test(hex)
      const r = valid ? parseInt(hex.slice(0, 2), 16) : 255
      const g = valid ? parseInt(hex.slice(2, 4), 16) : 255
      const b = valid ? parseInt(hex.slice(4, 6), 16) : 255
      const isDark = (r * 299 + g * 587 + b * 114) / 1000 < 128

      const expected = isDark ? theme.colors.text : theme.colors.background
      expect(root.style.getPropertyValue('--ntk-text-inverse')).toBe(expected)
    }
  })

  it('initTheme restores a valid stored theme and ignores an invalid one', () => {
    localStorage.setItem('app-theme', 'sentinela')
    initTheme()
    expect(useTheme().themeName.value).toBe('sentinela')

    localStorage.setItem('app-theme', 'not-a-theme')
    initTheme()
    expect(useTheme().themeName.value).toBe('revolut')
  })
})

describe('applyNettoolskitPreset default arguments', () => {
  it('defaults to dark mode with no developer options', () => {
    applyNettoolskitPreset()
    const root = document.documentElement
    expect(root.classList.contains('theme-dark')).toBe(true)
    expect(root.classList.contains('code-highlight-enabled')).toBe(false)
    expect(root.classList.contains('hot-reload-enabled')).toBe(false)
  })
})