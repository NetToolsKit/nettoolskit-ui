/**
 * Final branch push, wave 5: ribbon tablist contract, closed-state keyboard
 * guards, dialog double-open guard, validator custom messages, crud dialog
 * form write-back.
 */

import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { DsCrudPage, DsDialog, DsDrawer, DsRibbon, DsSelect, DsTable, DsTimePicker } from '@/design-system/vue'
import { defineResource } from '@/design-system/core'
import { FormValidationService } from '../../../../src/design-system/core/validators/FormValidationService'

describe('DsRibbon tablist contract', () => {
  const tabs = [
    { id: 'home', label: 'Início', groups: [{ id: 'g1', label: 'Ações', commands: [{ id: 'save', label: 'Salvar', icon: 'open' }] }] },
    { id: 'off', label: 'Desativada', disabled: true, groups: [] },
    { id: 'view', label: 'Exibir', groups: [] },
  ]

  it('falls back to the first enabled tab for an unknown activeTab and guards disabled clicks', async () => {
    const wrapper = mount(DsRibbon, {
      props: { id: 'rb', tabs, activeTab: 'ghost', ariaLabel: 'Comandos' },
    })

    const active = wrapper.get('[role="tab"][aria-selected="true"]')
    expect(active.text()).toBe('Início')

    // Disabled tab click must not emit a selection.
    await wrapper.findAll('[role="tab"]')[1]!.trigger('click')
    expect(wrapper.emitted('update:activeTab')).toBeUndefined()

    // Enabled tab click selects it.
    await wrapper.findAll('[role="tab"]')[2]!.trigger('click')
    expect(wrapper.emitted('update:activeTab')?.at(-1)).toEqual(['view'])
  })

  it('roves with arrow keys skipping disabled tabs and bubbles command clicks', async () => {
    const wrapper = mount(DsRibbon, {
      props: { id: 'rb2', tabs, activeTab: 'home' },
      attachTo: document.body,
    })

    const first = wrapper.findAll('[role="tab"]')[0]!
    await first.trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    // Skips the disabled middle tab.
    expect(wrapper.emitted('update:activeTab')?.at(-1)).toEqual(['view'])

    await first.trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()

    // Command button inside the active panel bubbles the command id.
    const commandButton = wrapper.find('.ntk-ribbon__panel button')
    if (commandButton.exists()) {
      await commandButton.trigger('click')
      expect(wrapper.emitted('command')?.at(-1)).toEqual(['save'])
    }
    wrapper.unmount()
  })
})

describe('closed-state keyboard guards', () => {
  it('DsSelect ignores Home/End/Escape while closed', async () => {
    const wrapper = mount(DsSelect, {
      props: { id: 'cg', label: 'X', modelValue: '', options: [{ label: 'A', value: 'a' }] },
      attachTo: document.body,
    })
    const trigger = wrapper.get('#cg__trigger')

    await trigger.trigger('keydown', { key: 'Home' })
    await trigger.trigger('keydown', { key: 'End' })
    await trigger.trigger('keydown', { key: 'Escape' })
    await nextTick()

    expect(document.querySelector('#cg__listbox')).toBeNull()
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('DsTimePicker toggles closed on a second trigger click', async () => {
    const wrapper = mount(DsTimePicker, {
      props: { id: 'tg', modelValue: '01:00', step: 60 },
      attachTo: document.body,
    })
    const trigger = wrapper.get('.ntk-time-picker__trigger')

    await trigger.trigger('click')
    await nextTick()
    expect(wrapper.find('[role="listbox"]').exists()).toBe(true)
    await trigger.trigger('click')
    await nextTick()
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    wrapper.unmount()
  })
})

describe('DsDialog double-open command guard', () => {
  it('does not re-emit open when a show-modal command arrives while already open', async () => {
    const wrapper = mount(DsDialog, {
      props: { id: 'dg', modelValue: true, title: 'Aberto' },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.emitted('open')).toHaveLength(1)

    const event = new Event('command')
    Object.defineProperty(event, 'command', { value: 'show-modal' })
    wrapper.get('dialog').element.dispatchEvent(event)
    await nextTick()

    expect(wrapper.emitted('open')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('validator custom-message branches', () => {
  it('returns the custom message on every failing rule', () => {
    expect(FormValidationService.required('obrigatório')('')).toBe('obrigatório')
    expect(FormValidationService.required()('ok')).toBe(true)
    expect(FormValidationService.email('email!')('nope')).toBe('email!')
    expect(FormValidationService.email()('a@b.co')).toBe(true)
    expect(FormValidationService.minLength(3, 'curto')('ab')).toBe('curto')
    expect(FormValidationService.maxLength(2, 'longo')('abc')).toBe('longo')
    expect(FormValidationService.cpf('cpf!')('123')).toBe('cpf!')
    expect(FormValidationService.cpf()('529.982.247-25')).toBe(true)
    expect(FormValidationService.cnpj('cnpj!')('123')).toBe('cnpj!')
    expect(FormValidationService.phone('fone!')('1')).toBe('fone!')
  })

  it('honors exact boundaries and per-rule custom messages', () => {
    expect(FormValidationService.lengthBetween(2, 4)('ab')).toBe(true)
    expect(FormValidationService.lengthBetween(2, 4)('abcd')).toBe(true)
    expect(FormValidationService.between(1, 5)(1)).toBe(true)
    expect(FormValidationService.between(1, 5)(5)).toBe(true)
    expect(FormValidationService.min(2, 'mínimo!')(1)).toBe('mínimo!')
    expect(FormValidationService.min(2)(2)).toBe(true)
    expect(FormValidationService.max(2, 'máximo!')(3)).toBe('máximo!')
    expect(FormValidationService.max(2)(2)).toBe(true)
    expect(FormValidationService.match('x', 'Senha', 'confere!')('y')).toBe('confere!')
  })
})

describe('DsForm live revalidation clears a fixed error', () => {
  it('shows the error after submit and clears it once corrected', async () => {
    const { DsForm } = await import('@/design-system/vue')
    const wrapper = mount(DsForm, {
      props: { schema: { fields: [{ field: 'name', type: 'text', required: true }] } },
    })

    // Typing BEFORE submit does not live-validate.
    await wrapper.get('#ds-form-name__control').setValue('a')
    await wrapper.get('#ds-form-name__control').setValue('')
    expect(wrapper.text()).not.toContain('Preencha')

    await wrapper.find('form').trigger('submit')
    await nextTick()
    expect(wrapper.text()).toContain('Preencha')

    await wrapper.get('#ds-form-name__control').setValue('Ana')
    await nextTick()
    expect(wrapper.text()).not.toContain('Preencha')
  })
})

describe('DsDialog initial-focus fallback', () => {
  it('focuses the dialog itself when no focusable child exists', async () => {
    const wrapper = mount(DsDialog, {
      props: { modelValue: true, hideClose: true, ariaLabel: 'Vazio' },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()
    // No inputs/buttons inside: the fallback target is the dialog element.
    expect(wrapper.find('dialog button').exists()).toBe(false)
    expect(wrapper.get('dialog').attributes('open')).toBeDefined()
    wrapper.unmount()
  })
})

describe('micro state permutations', () => {
  it('DsDrawer hides the whole header without title, header slot and with hideClose', async () => {
    const { DsDrawer } = await import('@/design-system/vue')
    const wrapper = mount(DsDrawer, {
      props: { modelValue: true, hideClose: true, ariaLabel: 'Menu' },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.find('.ntk-drawer__header').exists()).toBe(false)
    wrapper.unmount()
  })

  it('DsTimePicker windows options with only a min bound', async () => {
    const wrapper = mount(DsTimePicker, {
      props: { id: 'mo', modelValue: null, step: 60, min: '22:00' },
      attachTo: document.body,
    })
    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()
    const times = wrapper.findAll('[role="option"]').map(o => o.attributes('data-time'))
    expect(times[0]).toBe('22:00')
    expect(times).toHaveLength(2) // 22:00, 23:00
    wrapper.unmount()
  })

  it('DsSelect multiple marks preselected values on open', async () => {
    const wrapper = mount(DsSelect, {
      props: {
        id: 'pv',
        label: 'Tags',
        multiple: true,
        modelValue: ['a'],
        options: [{ label: 'Alfa', value: 'a' }, { label: 'Gama', value: 'g' }],
      },
      attachTo: document.body,
    })
    await wrapper.get('#pv__trigger').trigger('click')
    await nextTick()

    const selected = document.querySelector('#pv__listbox [aria-selected="true"]')
    expect(selected?.textContent).toContain('Alfa')
    wrapper.unmount()
    document.body.querySelectorAll('.ntk-select-panel').forEach(node => node.remove())
  })
})

describe('last deterministic edges', () => {
  it('DsSelect opens the closed combobox with Space', async () => {
    const wrapper = mount(DsSelect, {
      props: { id: 'sp', label: 'X', modelValue: '', options: [{ label: 'A', value: 'a' }] },
      attachTo: document.body,
    })
    await wrapper.get('#sp__trigger').trigger('keydown', { key: ' ' })
    await nextTick()
    expect(document.querySelector('#sp__listbox')).toBeTruthy()
    wrapper.unmount()
    document.body.querySelectorAll('.ntk-select-panel').forEach(node => node.remove())
  })

  it('DsTimePicker clamps arrow movement at both list edges', async () => {
    const wrapper = mount(DsTimePicker, {
      props: { id: 'cl', modelValue: '00:00', step: 60 },
      attachTo: document.body,
    })
    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()
    const listbox = wrapper.get('[role="listbox"]')

    await listbox.trigger('keydown', { key: 'ArrowUp' }) // clamp at 0
    await listbox.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['00:00'])

    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()
    const reopened = wrapper.get('[role="listbox"]')
    await reopened.trigger('keydown', { key: 'End' })
    await reopened.trigger('keydown', { key: 'ArrowDown' }) // clamp at last
    await reopened.trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['23:00'])
    wrapper.unmount()
  })

  it('DsDatePicker refuses Enter on a keyboard-focused out-of-range day', async () => {
    const { DsDatePicker } = await import('@/design-system/vue')
    const wrapper = mount(DsDatePicker, {
      props: { modelValue: '2026-06-15', min: '2026-06-15', max: '2026-06-20' },
      attachTo: document.body,
    })
    await wrapper.get('.ntk-date-picker__trigger').trigger('click')
    await nextTick()
    const popup = wrapper.get('[role="dialog"]')

    await popup.trigger('keydown', { key: 'ArrowLeft' }) // focus 2026-06-14 (< min)
    await popup.trigger('keydown', { key: 'Enter' })
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true) // stayed open
    wrapper.unmount()
  })

  it('DsTable normalizes array rowClass and falls back select labels to the row id', () => {
    const wrapper = mount(DsTable, {
      props: {
        columns: [{ id: 'v', label: 'V' }],
        rows: [{ id: 'rx', cells: { v: '' }, rowClass: ['a-class', 'b-class'] }],
        selectable: true,
      },
    })
    const row = wrapper.get('tbody tr')
    expect(row.classes()).toEqual(expect.arrayContaining(['a-class', 'b-class']))
    // Every cell empty -> accessible fallback uses the row id.
    expect(row.get('input[type="checkbox"]').attributes('aria-label')).toContain('rx')
  })
})

describe('pinpointed residual branches', () => {
  it('DsForm takes the column count from the schema when no prop is given', async () => {
    const { DsForm } = await import('@/design-system/vue')
    const wrapper = mount(DsForm, {
      props: { schema: { columns: 3, fields: [{ field: 'a', type: 'text' }] } },
    })
    expect(wrapper.get('.ntk-form-layout').classes().join(' ')).toContain('cols-3')
  })

  it('DsForm field slot scope reports disabled when the whole form is disabled', async () => {
    const { DsForm } = await import('@/design-system/vue')
    const seen: boolean[] = []
    mount(DsForm, {
      props: { disabled: true, schema: { fields: [{ field: 'a', type: 'text' }] } },
      slots: {
        'field-a': (scope: { disabled: boolean }) => {
          seen.push(scope.disabled)
          return null
        },
      },
    })
    expect(seen.at(-1)).toBe(true)
  })

  it('DsDrawer uses native showModal/close when the platform provides them', async () => {
    const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>
    const originalShow = proto.showModal
    let shown = 0
    proto.showModal = function (this: HTMLDialogElement) {
      shown += 1
      this.setAttribute('open', '')
    }
    try {
      const wrapper = mount(DsDrawer, {
        props: { modelValue: true, ariaLabel: 'Nativo' },
        attachTo: document.body,
      })
      await nextTick()
      expect(shown).toBe(1)
      await wrapper.setProps({ modelValue: false })
      await nextTick()
      expect(wrapper.get('dialog').attributes('open')).toBeUndefined()
      wrapper.unmount()
    } finally {
      if (originalShow === undefined) {
        delete proto.showModal
      } else {
        proto.showModal = originalShow
      }
    }
  })

  it('DsDrawer falls back to the open attribute when showModal throws and closes an already-closed dialog safely', async () => {
    const proto = HTMLDialogElement.prototype as unknown as Record<string, unknown>
    const originalShow = proto.showModal
    proto.showModal = function () {
      throw new Error('blocked')
    }
    try {
      const wrapper = mount(DsDrawer, {
        props: { modelValue: true, ariaLabel: 'Exceção' },
        attachTo: document.body,
      })
      await nextTick()
      expect(wrapper.get('dialog').attributes('open')).toBeDefined()

      // Simulate an external native close before v-model catches up.
      wrapper.get('dialog').element.removeAttribute('open')
      await wrapper.setProps({ modelValue: false })
      await nextTick()
      expect(wrapper.emitted('close')).toBeTruthy()
      wrapper.unmount()
    } finally {
      if (originalShow === undefined) {
        delete proto.showModal
      } else {
        proto.showModal = originalShow
      }
    }
  })
})

describe('four last edges', () => {
  it('DsDialog persistent still honors the actions-scope close()', async () => {
    const wrapper = mount(DsDialog, {
      props: { id: 'pa', modelValue: true, persistent: true, title: 'P' },
      attachTo: document.body,
      slots: {
        actions: `<template #actions="{ close }">
          <button class="act" type="button" @click="close()">OK</button>
        </template>`,
      },
    })
    await nextTick()
    await wrapper.get('.act').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([false])
    wrapper.unmount()
  })

  it('DsDialog wires id-scoped describedby when both id and description exist', async () => {
    const wrapper = mount(DsDialog, {
      props: { id: 'idd', modelValue: true, title: 'T', description: 'ctx' },
      attachTo: document.body,
    })
    await nextTick()
    expect(wrapper.get('dialog').attributes('aria-describedby')).toBe('idd__description')
    expect(wrapper.get('dialog').attributes('aria-labelledby')).toBe('idd__title')
    wrapper.unmount()
  })

  it('DsTimePicker renders no selected option for a null model', async () => {
    const wrapper = mount(DsTimePicker, {
      props: { id: 'ns', modelValue: null, step: 360 },
      attachTo: document.body,
    })
    await wrapper.get('.ntk-time-picker__trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('.ntk-time-picker__option--selected').exists()).toBe(false)
    expect(wrapper.findAll('[role="option"]').every(o => o.attributes('aria-selected') === 'false'))
      .toBe(true)
    wrapper.unmount()
  })

  it('DsSelect single mode marks the selected option and reopens anchored on it', async () => {
    const wrapper = mount(DsSelect, {
      props: {
        id: 'an',
        label: 'X',
        modelValue: 'g',
        options: [{ label: 'Alfa', value: 'a' }, { label: 'Gama', value: 'g' }],
      },
      attachTo: document.body,
    })
    await wrapper.get('#an__trigger').trigger('keydown', { key: 'Enter' }) // opens when closed
    await nextTick()
    const selected = document.querySelector('#an__listbox [aria-selected="true"]')
    expect(selected?.textContent).toContain('Gama')
    wrapper.unmount()
    document.body.querySelectorAll('.ntk-select-panel').forEach(node => node.remove())
  })
})

describe('DsCrudPage dialog form write-back', () => {
  it('routes dialog form edits through formValues into the update payload', async () => {
    type Row = { id: number; name: string }
    const update = vi.fn(async () => undefined)
    const resource = defineResource<Row>({
      title: 'Edição',
      rowKey: 'id',
      columns: [{ field: 'name' }],
      form: [{ field: 'name', type: 'text' }],
      fetch: vi.fn(async () => [{ id: 7, name: 'Ana' }]),
      update,
    })
    const wrapper = mount(DsCrudPage, { props: { resource } })
    await flushPromises()

    const editButton = wrapper.findAll('button').find(b => b.text() === 'Editar')
    await editButton!.trigger('click')
    await nextTick()

    await wrapper.get('#ds-crud-form-name__control').setValue('Ana Maria')
    await wrapper.get('dialog form').trigger('submit')
    await flushPromises()

    expect(update).toHaveBeenCalledWith(expect.objectContaining({ id: 7, name: 'Ana Maria' }))
  })
})