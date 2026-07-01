/**
 * DsFormPage (L1) — page-level composite: header + schema form passthrough.
 */

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import { DsFormPage } from '@/design-system/vue'

const schema = {
  fields: [
    { field: 'name', type: 'text', label: 'Nome', required: true },
    { field: 'email', type: 'email', label: 'E-mail' },
  ],
}

describe('DsFormPage', () => {
  it('renders the page header and the schema-driven form', () => {
    const wrapper = mount(DsFormPage, {
      props: { title: 'Clientes', description: 'Cadastro', schema },
    })

    expect(wrapper.text()).toContain('Clientes')
    expect(wrapper.text()).toContain('Cadastro')
    expect(wrapper.find('#ds-form-page-name__control').exists()).toBe(true)
    expect(wrapper.find('#ds-form-page-email__control').exists()).toBe(true)
  })

  it('renders header actions through the #headerActions slot', () => {
    const wrapper = mount(DsFormPage, {
      props: { title: 'Clientes', schema },
      slots: {
        headerActions: () => h('button', { class: 'header-cta', type: 'button' }, 'Exportar'),
      },
    })

    expect(wrapper.find('.ntk-page-header__actions .header-cta').exists()).toBe(true)
  })

  it('passes model updates, submit and reset through to the host', async () => {
    const wrapper = mount(DsFormPage, {
      props: { title: 'Clientes', schema, modelValue: { name: '', email: '' } },
    })

    await wrapper.find('#ds-form-page-name__control').setValue('Ana')
    const updated = wrapper.emitted('update:modelValue')
    expect(updated).toBeTruthy()
    expect((updated!.at(-1)![0] as Record<string, unknown>).name).toBe('Ana')

    await wrapper.setProps({ modelValue: { name: 'Ana', email: '' } })
    await wrapper.find('form').trigger('submit')
    await nextTick()
    expect(wrapper.emitted('submit')).toHaveLength(1)

    await wrapper.find('form').trigger('reset')
    await nextTick()
    expect(wrapper.emitted('reset')).toHaveLength(1)
  })

  it('forwards labels and loading state down to the form', () => {
    const wrapper = mount(DsFormPage, {
      props: {
        title: 'Clientes',
        schema,
        submitLabel: 'Gravar',
        resetLabel: 'Descartar',
        loading: true,
      },
    })

    expect(wrapper.text()).toContain('Gravar')
    expect(wrapper.text()).toContain('Descartar')
    expect(wrapper.find('form').attributes('aria-busy')).toBe('true')
  })
})