/**
 * Final branch push — the pools named in the branch-coverage-push spec:
 * DsTimePicker keyboard/outside-close/min-max, DsDrawer close policies and
 * side classes, DsSelect outside-close + disabled-option skipping + multiple
 * mode, DsForm value coercions, useTableColumns column operations.
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { DsDrawer, DsForm, DsSelect, DsTimePicker } from '@/design-system/vue'
import { useTableColumns } from '../../../../src/composables/data/useTableColumns'

describe('DsTimePicker interactions', () => {
  const mountPicker = (props: Record<string, unknown> = {}) =>
    mount(DsTimePicker, {
      props: { id: 'tp', label: 'Início', modelValue: '09:30', step: 30, ...props },
      attachTo: document.body,
    })

  it('drives the full listbox keyboard contract', async () => {
    const wrapper = mountPicker()
    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()

    const listbox = wrapper.get('[role="listbox"]')
    // Home + Enter selects the first option.
    await listbox.trigger('keydown', { key: 'Home' })
    await listbox.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['00:00'])
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)

    // Reopen: End + Space selects the last option (23:30 with step 30).
    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()
    const reopened = wrapper.get('[role="listbox"]')
    await reopened.trigger('keydown', { key: 'End' })
    await reopened.trigger('keydown', { key: ' ' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['23:30'])

    // Arrow movement clamps at the edges; Escape closes without selecting.
    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()
    const third = wrapper.get('[role="listbox"]')
    await third.trigger('keydown', { key: 'ArrowUp' })
    await third.trigger('keydown', { key: 'ArrowDown' })
    await third.trigger('keydown', { key: 'Escape' })
    await nextTick()
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('selects by click, honors min/max windows and ignores outside pointerdown targets inside', async () => {
    const wrapper = mountPicker({ min: '08:00', max: '10:00' })
    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()

    const times = wrapper.findAll('[role="option"]').map(option => option.attributes('data-time'))
    expect(times[0]).toBe('08:00')
    expect(times.at(-1)).toBe('10:00')

    await wrapper.get('[data-time="09:00"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['09:00'])

    // Outside pointerdown closes a reopened popup.
    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await nextTick()
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('does not open when disabled or readonly', async () => {
    for (const props of [{ disabled: true }, { readonly: true }] as const) {
      const wrapper = mountPicker(props)
      await wrapper.get('.ntk-time-picker__trigger').trigger('click')
      await nextTick()
      expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
      wrapper.unmount()
    }
  })
})

describe('DsDrawer close policies and sides', () => {
  it('persistent blocks cancel/backdrop but the close button and slot scope work', async () => {
    const wrapper = mount(DsDrawer, {
      props: { modelValue: true, persistent: true, title: 'Menu' },
      slots: { default: `<template #default="{ close }">
        <button class="nav-close" type="button" @click="close()">Sair</button>
      </template>` },
      attachTo: document.body,
    })
    await nextTick()
    const dialog = wrapper.get('dialog')

    await dialog.trigger('cancel')
    await dialog.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.get('.nav-close').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('non-persistent closes on backdrop, applies the side class and hides the close button', async () => {
    const wrapper = mount(DsDrawer, {
      props: { modelValue: true, side: 'right', hideClose: true, ariaLabel: 'Painel' },
      attachTo: document.body,
    })
    await nextTick()

    const dialog = wrapper.get('dialog')
    expect(dialog.classes().join(' ')).toContain('right')
    expect(wrapper.find('.ntk-drawer__close').exists()).toBe(false)
    expect(dialog.attributes('aria-label')).toBe('Painel')

    await dialog.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })
})

describe('DsSelect edge behavior', () => {
  const options = [
    { label: 'Alfa', value: 'a' },
    { label: 'Beta', value: 'b', disabled: true },
    { label: 'Gama', value: 'g' },
  ]

  it('closes on an outside pointerdown and skips disabled options from Home', async () => {
    const wrapper = mount(DsSelect, {
      props: { id: 'se', label: 'Opção', modelValue: '', options },
      attachTo: document.body,
    })
    const trigger = wrapper.get('#se__trigger')

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    expect(document.querySelector('#se__listbox')).toBeTruthy()

    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    await nextTick()
    expect(document.querySelector('#se__listbox')).toBeNull()

    // Home anchors on the first ENABLED option; ArrowDown skips the disabled one.
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await trigger.trigger('keydown', { key: 'Home' })
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    await trigger.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['g'])

    wrapper.unmount()
    document.body.querySelectorAll('.ntk-select-panel').forEach(node => node.remove())
  })

  it('multiple mode toggles values without closing the panel', async () => {
    const wrapper = mount(DsSelect, {
      props: {
        id: 'sm',
        label: 'Tags',
        modelValue: [] as string[],
        multiple: true,
        options,
        // v-model write-back so successive toggles accumulate.
        'onUpdate:modelValue': (value: string | string[]) => {
          void wrapper.setProps({ modelValue: value })
        },
      },
      attachTo: document.body,
    })

    await wrapper.get('#sm__trigger').trigger('click')
    await nextTick()

    const pick = (value: string) =>
      document.querySelector<HTMLElement>(`#sm__listbox [role="option"][data-value="${value}"]`)
        ?? [...document.querySelectorAll<HTMLElement>('#sm__listbox [role="option"]')]
          .find(el => el.textContent?.includes(value === 'a' ? 'Alfa' : 'Gama'))

    pick('a')?.click()
    await nextTick()
    expect(document.querySelector('#sm__listbox')).toBeTruthy() // stays open
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['a']])

    pick('g')?.click()
    await nextTick()
    const last = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as string[]
    expect(last.sort()).toEqual(['a', 'g'])

    wrapper.unmount()
    document.body.querySelectorAll('.ntk-select-panel').forEach(node => node.remove())
  })
})

describe('DsForm value coercions', () => {
  it('coerces an emptied number field to null and keeps typed values', async () => {
    const wrapper = mount(DsForm, {
      props: { schema: { fields: [{ field: 'age', type: 'number' }] } },
    })
    const control = wrapper.get('#ds-form-age__control')

    await control.setValue('41')
    let last = wrapper.emitted('update:modelValue')!.at(-1)![0] as Record<string, unknown>
    expect(last.age).toBe(41)

    await control.setValue('')
    last = wrapper.emitted('update:modelValue')!.at(-1)![0] as Record<string, unknown>
    expect(last.age).toBeNull()
  })

  it('renders date/time typed controls and honors an external modelValue', async () => {
    const wrapper = mount(DsForm, {
      props: {
        modelValue: { when: '2026-07-01', at: '09:00' },
        schema: {
          fields: [
            { field: 'when', type: 'date' },
            { field: 'at', type: 'time' },
          ],
        },
      },
    })

    expect(wrapper.get('#ds-form-when__control').attributes('type')).toBe('date')
    expect(wrapper.get('#ds-form-at__control').attributes('type')).toBe('time')
    expect((wrapper.get('#ds-form-when__control').element as HTMLInputElement).value)
      .toBe('2026-07-01')

    const vm = wrapper.vm as unknown as { validate: () => boolean }
    expect(vm.validate()).toBe(true)
  })
})

describe('useTableColumns column operations', () => {
  const base = [
    { name: 'id', label: 'ID', field: 'id', required: true },
    { name: 'name', label: 'Nome', field: 'name' },
    { name: 'email', label: 'E-mail', field: 'email' },
  ]

  it('reorders known names and appends unknown leftovers', () => {
    const { columns, reorderColumns } = useTableColumns([...base])
    reorderColumns(['email', 'id'])
    expect(columns.value.map(c => c.name)).toEqual(['email', 'id', 'name'])
  })

  it('adds columns dynamically and refuses to remove required ones', () => {
    const { columns, addColumn, removeColumn } = useTableColumns([...base])

    addColumn({ name: 'status', label: 'Status', field: 'status' })
    expect(columns.value.map(c => c.name)).toContain('status')

    removeColumn('id') // required — must stay
    expect(columns.value.map(c => c.name)).toContain('id')
    removeColumn('status')
    expect(columns.value.map(c => c.name)).not.toContain('status')
    removeColumn('ghost') // unknown — no-op
    expect(columns.value).toHaveLength(3)
  })

  it('resetColumns honors defaultVisibleColumns and falls back to all-visible', () => {
    const withDefaults = useTableColumns([...base], { defaultVisibleColumns: ['id', 'email'] })
    withDefaults.hideAllColumns()
    withDefaults.resetColumns()
    expect(withDefaults.visibleColumnNames.value.sort()).toEqual(['email', 'id'])

    const withoutDefaults = useTableColumns([...base])
    withoutDefaults.hideAllColumns()
    withoutDefaults.resetColumns()
    expect(withoutDefaults.visibleColumns.value).toHaveLength(3)
  })

  it('persists visibility changes back to localStorage', async () => {
    const key = 'ntk-branch-final-cols'
    localStorage.removeItem(key)
    const { toggleColumn } = useTableColumns([...base], { persistKey: key })

    toggleColumn('name')
    await nextTick()

    const saved = JSON.parse(localStorage.getItem(key) ?? '{}') as Record<string, boolean>
    expect(saved.name).toBe(false)
    localStorage.removeItem(key)
  })
})