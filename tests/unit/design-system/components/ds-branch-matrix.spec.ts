/**
 * State-permutation matrix for composite components — exercises the prop
 * branches the base suites left one-sided (per STD §15.4 state contract).
 */

import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { DsCrudPage, DsDialog, DsForm, DsTable } from '@/design-system/vue'
import { defineForm, defineResource } from '@/design-system/core'

describe('DsForm permutations', () => {
  it('renders placeholder/help/disabled field metadata and a legend', () => {
    const wrapper = mount(DsForm, {
      props: {
        legend: 'Dados pessoais',
        columns: 2,
        schema: {
          fields: [
            { field: 'name', type: 'text', label: 'Nome', placeholder: 'Digite...', help: 'Como no documento', disabled: true },
            { field: 'plan', type: 'select', label: 'Plano', placeholder: 'Escolha', options: [{ label: 'Pro', value: 'pro' }] },
          ],
        },
      },
    })

    expect(wrapper.text()).toContain('Dados pessoais')
    const name = wrapper.get('#ds-form-name__control')
    expect(name.attributes('placeholder')).toBe('Digite...')
    expect(name.attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('Como no documento')
    expect(wrapper.get('.ntk-form-layout').classes().join(' ')).toContain('cols-2')
  })

  it('hides the action row with showActions=false and surfaces checkbox rule errors', async () => {
    const wrapper = mount(DsForm, {
      props: {
        showActions: false,
        schema: {
          fields: [{
            field: 'terms',
            type: 'checkbox',
            label: 'Aceito',
            rules: [(value: unknown) => value === true || 'Aceite os termos'],
          }],
        },
      },
    })

    expect(wrapper.find('.ntk-form-layout__actions').exists()).toBe(false)

    await wrapper.find('form').trigger('submit')
    await nextTick()
    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.get('.ntk-field--is-invalid').text()).toContain('Aceite os termos')
  })

  it('fails fast for option fields without options and renders multiselect with options', () => {
    expect(() => defineForm({ fields: [{ field: 'role', type: 'select' }] }))
      .toThrow(/requires non-empty options/)

    const wrapper = mount(DsForm, {
      props: {
        schema: {
          fields: [{ field: 'tags', type: 'multiselect', options: [{ label: 'A', value: 'a' }] }],
        },
      },
    })
    expect(wrapper.find('#ds-form-tags__trigger').exists()).toBe(true)
  })
})

describe('DsDialog fallback branches', () => {
  it('falls back to static ids without an id prop and renders the description', async () => {
    const wrapper = mount(DsDialog, {
      props: { modelValue: true, title: 'T', description: 'Explica o contexto' },
      attachTo: document.body,
    })
    await nextTick()

    expect(wrapper.get('.ntk-dialog__title').attributes('id')).toBe('ntk-dialog-title')
    expect(wrapper.get('.ntk-dialog__description').attributes('id')).toBe('ntk-dialog-description')
    expect(wrapper.get('dialog').attributes('aria-describedby')).toBe('ntk-dialog-description')
    wrapper.unmount()
  })

  it('uses aria-label when there is no title', async () => {
    const wrapper = mount(DsDialog, {
      props: { modelValue: true, ariaLabel: 'Janela de aviso' },
      attachTo: document.body,
    })
    await nextTick()

    const dialog = wrapper.get('dialog')
    expect(dialog.attributes('aria-label')).toBe('Janela de aviso')
    expect(dialog.attributes('aria-labelledby')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('DsTable option branches', () => {
  const columns = [{ id: 'name', label: 'Nome' }, { id: 'age', label: 'Idade' }]

  it('honors a custom emptyValueLabel and a custom selectRowLabel', () => {
    const wrapper = mount(DsTable, {
      props: {
        columns,
        rows: [{ id: 'r1', cells: { name: '', age: 30 } }],
        selectable: true,
        emptyValueLabel: '(vazio)',
        selectRowLabel: (row: { id: string }) => `Marcar ${row.id}`,
      },
    })

    expect(wrapper.text()).toContain('(vazio)')
    expect(wrapper.get('tbody input[type="checkbox"]').attributes('aria-label')).toBe('Marcar r1')
  })

  it('renders a caption and drops the table aria-label in its favor', () => {
    const wrapper = mount(DsTable, {
      props: { columns, rows: [], caption: 'Tabela de clientes', ariaLabel: 'ignored' },
    })

    expect(wrapper.get('caption').text()).toBe('Tabela de clientes')
    expect(wrapper.get('table').attributes('aria-label')).toBeUndefined()
  })
})

describe('DsCrudPage resource-shape branches', () => {
  type Row = { id: number; name: string }

  it('renders without search, create button or actions column for a read-only resource', async () => {
    const resource = defineResource<Row>({
      title: 'Somente leitura',
      rowKey: 'id',
      columns: [{ field: 'name', label: 'Nome', format: (value) => `#${String(value)}` }],
      fetch: vi.fn(async () => [{ id: 1, name: 'Ana' }]),
    })
    const wrapper = mount(DsCrudPage, { props: { resource, searchable: false } })
    await flushPromises()

    expect(wrapper.find('form[role="search"]').exists()).toBe(false)
    expect(wrapper.find('.ntk-page-header__actions').exists()).toBe(false)
    expect(wrapper.text()).toContain('#Ana') // column format branch
    expect(wrapper.text()).not.toContain('Editar')
  })

  it('applies the descending defaultSort on the first fetch', async () => {
    const fetch = vi.fn(async () => ({ rows: [] as Row[], total: 0 }))
    const resource = defineResource<Row>({
      title: 'Ordenado',
      rowKey: 'id',
      columns: [{ field: 'name', sortable: true }],
      defaultSort: { field: 'name', descending: true },
      pageSize: 5,
      fetch,
    })
    mount(DsCrudPage, { props: { resource } })
    await flushPromises()

    expect(fetch).toHaveBeenCalledWith(expect.objectContaining({
      sortBy: 'name',
      descending: true,
      pageSize: 5,
    }))
  })

  it('stringifies non-Error fetch failures into the error state', async () => {
    const resource = defineResource<Row>({
      title: 'Falha',
      rowKey: 'id',
      columns: [{ field: 'name' }],
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      fetch: vi.fn(async () => { throw 'string-failure' }),
    })
    const wrapper = mount(DsCrudPage, { props: { resource } })
    await flushPromises()

    expect(wrapper.text()).toContain('string-failure')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('renders rows without a fetch function (static resource)', async () => {
    const resource = defineResource<Row>({
      title: 'Estático',
      rowKey: 'id',
      columns: [{ field: 'name' }],
    })
    const wrapper = mount(DsCrudPage, { props: { resource } })
    await flushPromises()

    // No fetch: stays on the empty state without crashing, search hidden.
    expect(wrapper.find('form[role="search"]').exists()).toBe(false)
    expect(wrapper.find('.ntk-empty-state').exists()).toBe(true)
  })
})