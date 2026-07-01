/**
 * DsCrudPage (L1) — drives list + filter + create/edit/delete from a resource
 * definition, including loading/empty/error states and stale-fetch protection.
 */

import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import { DsCrudPage } from '@/design-system/vue'
import { defineResource } from '@/design-system/core'

type Client = { id: number; name: string; email: string }

const baseRows: Client[] = [{ id: 1, name: 'Ana', email: 'ana@acme.co' }]

const makeResource = (overrides: Record<string, unknown> = {}) =>
  defineResource<Client>({
    title: 'Clients',
    columns: [{ field: 'name' }, { field: 'email' }],
    form: [
      { field: 'name', type: 'text', required: true },
      { field: 'email', type: 'email' },
    ],
    rowKey: 'id',
    fetch: vi.fn(async () => baseRows),
    create: vi.fn(async () => undefined),
    update: vi.fn(async () => undefined),
    remove: vi.fn(async () => undefined),
    ...overrides,
  })

const clickByText = async (wrapper: ReturnType<typeof mount>, text: string) => {
  const button = wrapper.findAll('button').find((b) => b.text() === text)
  if (!button) {
    throw new Error(`Button "${text}" not found`)
  }
  await button.trigger('click')
}

describe('DsCrudPage', () => {
  it('fetches on mount and renders rows', async () => {
    const resource = makeResource()
    const wrapper = mount(DsCrudPage, { props: { resource } })
    await flushPromises()

    expect(resource.fetch).toHaveBeenCalledTimes(1)
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.text()).toContain('Ana')
    expect(wrapper.text()).toContain('ana@acme.co')
  })

  it('shows the empty state when there are no rows', async () => {
    const resource = makeResource({ fetch: vi.fn(async () => []) })
    const wrapper = mount(DsCrudPage, { props: { resource } })
    await flushPromises()

    expect(wrapper.find('.ntk-empty-state').exists()).toBe(true)
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('shows the error state when the fetch rejects', async () => {
    const resource = makeResource({ fetch: vi.fn(async () => { throw new Error('network down') }) })
    const wrapper = mount(DsCrudPage, { props: { resource } })
    await flushPromises()

    expect(wrapper.find('.ntk-state-block--state-error').exists()).toBe(true)
    expect(wrapper.text()).toContain('network down')
    expect(wrapper.emitted('error')).toHaveLength(1)
  })

  it('re-fetches with the search term on filter apply', async () => {
    const resource = makeResource()
    const wrapper = mount(DsCrudPage, { props: { resource } })
    await flushPromises()

    await wrapper.find('#ds-crud-search__control').setValue('ana')
    await wrapper.find('form[role="search"]').trigger('submit')
    await flushPromises()

    expect(resource.fetch).toHaveBeenLastCalledWith({ search: 'ana' })
  })

  it('creates a record through the dialog form', async () => {
    const resource = makeResource()
    const wrapper = mount(DsCrudPage, { props: { resource } })
    await flushPromises()

    await wrapper.get('.ntk-page-header__actions button').trigger('click')
    await nextTick()

    await wrapper.find('#ds-crud-form-name__control').setValue('Bob')
    await wrapper.find('dialog form').trigger('submit')
    await flushPromises()

    expect(resource.create).toHaveBeenCalledTimes(1)
    expect((resource.create as ReturnType<typeof vi.fn>).mock.calls[0][0]).toMatchObject({ name: 'Bob' })
    // refetch after create
    expect(resource.fetch).toHaveBeenCalledTimes(2)
  })

  it('edits a record, merging the row id into the update payload', async () => {
    const resource = makeResource()
    const wrapper = mount(DsCrudPage, { props: { resource } })
    await flushPromises()

    await clickByText(wrapper, 'Editar')
    await nextTick()
    await wrapper.find('dialog form').trigger('submit')
    await flushPromises()

    expect(resource.update).toHaveBeenCalledTimes(1)
    expect((resource.update as ReturnType<typeof vi.fn>).mock.calls[0][0]).toMatchObject({ id: 1, name: 'Ana' })
  })

  it('deletes a record and refetches', async () => {
    const resource = makeResource()
    const wrapper = mount(DsCrudPage, { props: { resource } })
    await flushPromises()

    await clickByText(wrapper, 'Excluir')
    await flushPromises()

    expect(resource.remove).toHaveBeenCalledTimes(1)
    expect((resource.remove as ReturnType<typeof vi.fn>).mock.calls[0][0]).toMatchObject({ id: 1 })
    expect(resource.fetch).toHaveBeenCalledTimes(2)
  })

  it('drives server-mode pagination and sorting through the fetch params', async () => {
    const pageRows: Client[] = [{ id: 1, name: 'Ana', email: 'ana@acme.co' }]
    const fetch = vi.fn(async () => ({ rows: pageRows, total: 25 }))
    const resource = defineResource<Client>({
      title: 'Clients',
      columns: [{ field: 'name', sortable: true }, { field: 'email' }],
      rowKey: 'id',
      pageSize: 10,
      fetch,
    })
    const wrapper = mount(DsCrudPage, { props: { resource } })
    await flushPromises()

    // First load is paginated and the footer reflects the server total.
    expect(fetch).toHaveBeenLastCalledWith({ search: undefined, page: 1, pageSize: 10 })
    expect(wrapper.find('.ntk-table__pagination').exists()).toBe(true)
    expect(wrapper.find('.ntk-table__pagination').text()).toContain('25')

    // Next page advances the page param.
    const nav = wrapper.findAll('.ntk-table__pagination-button')
    await nav[nav.length - 1]?.trigger('click')
    await flushPromises()
    expect(fetch).toHaveBeenLastCalledWith({ search: undefined, page: 2, pageSize: 10 })

    // Activating a sortable header sorts ascending and resets to page 1.
    await wrapper.get('th .ntk-table__sort').trigger('click')
    await flushPromises()
    expect(fetch).toHaveBeenLastCalledWith({
      search: undefined,
      page: 1,
      pageSize: 10,
      sortBy: 'name',
      descending: false,
    })
  })

  it('ignores a stale in-flight fetch result', async () => {
    const resolvers: Array<(rows: Client[]) => void> = []
    const fetch = vi.fn(() => new Promise<Client[]>((resolve) => { resolvers.push(resolve) }))
    const resource = makeResource({ fetch })
    const wrapper = mount(DsCrudPage, { props: { resource } })
    await nextTick()

    // Second load starts before the first resolves. Do NOT await it; its fetch
    // promise is resolved manually below.
    void (wrapper.vm as unknown as { reload: () => Promise<void> }).reload()
    await nextTick()

    // Resolve the newer request first, then the older (stale) one.
    resolvers[1]([{ id: 2, name: 'New', email: 'new@acme.co' }])
    await flushPromises()
    resolvers[0]([{ id: 9, name: 'Stale', email: 'stale@acme.co' }])
    await flushPromises()

    expect(wrapper.text()).toContain('New')
    expect(wrapper.text()).not.toContain('Stale')
  })
})

describe('DsCrudPage slot forwarding (extension model)', () => {
  it('forwards #cell-<field> to the table and augments row actions via #row-actions', async () => {
    const resource = makeResource()
    const rowsSeen: unknown[] = []
    const wrapper = mount(DsCrudPage, {
      props: { resource },
      slots: {
        'cell-name': (scope: { value: unknown }) =>
          h('em', { class: 'custom-cell' }, `${scope.value}!`),
        'row-actions': (scope: { row: Client }) =>
          h('button', {
            class: 'extra-action',
            type: 'button',
            onClick: () => rowsSeen.push(scope.row),
          }, 'Arquivar'),
      },
    })
    await flushPromises()

    expect(wrapper.get('.custom-cell').text()).toBe('Ana!')
    // Governed actions are kept — the slot augments, never replaces.
    expect(wrapper.text()).toContain('Editar')
    expect(wrapper.text()).toContain('Excluir')

    await wrapper.get('.extra-action').trigger('click')
    expect(rowsSeen[0]).toMatchObject({ id: 1, name: 'Ana', email: 'ana@acme.co' })
  })

  it('shows the actions column for #row-actions even without update/remove', async () => {
    const resource = makeResource({ update: undefined, remove: undefined })
    const wrapper = mount(DsCrudPage, {
      props: { resource },
      slots: {
        'row-actions': () => h('button', { class: 'extra-action', type: 'button' }, 'Ver'),
      },
    })
    await flushPromises()

    expect(wrapper.find('.extra-action').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Editar')
  })

  it('renders #header-actions before the governed new button', async () => {
    const resource = makeResource()
    const wrapper = mount(DsCrudPage, {
      props: { resource },
      slots: {
        'header-actions': () => h('button', { class: 'header-extra', type: 'button' }, 'Exportar'),
      },
    })
    await flushPromises()

    const labels = wrapper.findAll('.ntk-page-header__actions button').map((b) => b.text())
    expect(labels).toEqual(['Exportar', 'Novo'])
  })

  it('overrides the empty state via #empty with openCreate in scope', async () => {
    const resource = makeResource({ fetch: vi.fn(async () => []) })
    const wrapper = mount(DsCrudPage, {
      props: { resource },
      slots: {
        empty: (scope: { openCreate: () => void }) =>
          h('button', { class: 'custom-empty', type: 'button', onClick: scope.openCreate }, 'Começar'),
      },
    })
    await flushPromises()

    expect(wrapper.find('.ntk-empty-state').exists()).toBe(false)
    await wrapper.get('.custom-empty').trigger('click')
    await nextTick()
    expect(wrapper.find('dialog form').exists()).toBe(true)
  })

  it('forwards #form-field-<name> into the dialog form field slot', async () => {
    const resource = makeResource()
    const wrapper = mount(DsCrudPage, {
      props: { resource },
      slots: {
        'form-field-name': (scope: { update: (value: unknown) => void }) =>
          h('input', {
            id: 'crud-custom-name',
            onInput: (event: Event) => scope.update((event.target as HTMLInputElement).value),
          }),
      },
    })
    await flushPromises()

    await wrapper.get('.ntk-page-header__actions button').trigger('click')
    await nextTick()

    expect(wrapper.find('#crud-custom-name').exists()).toBe(true)
    expect(wrapper.find('#ds-crud-form-name__control').exists()).toBe(false)
  })
})