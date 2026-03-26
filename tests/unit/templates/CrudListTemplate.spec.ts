import { describe, expect, it } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import CrudListTemplate from '../../../src/templates/pages/crud/CrudListTemplate.vue'

const globalMountOptions = {
  global: {
    renderStubDefaultSlot: true,
    stubs: {
      'q-page': {
        template: '<div><slot /></div>',
      },
      'q-skeleton': true,
    },
  },
}

const baseColumns = [
  { id: 'name', label: 'Name', emphasize: true },
  { id: 'owner', label: 'Owner' },
]

const baseRecords = [
  {
    id: 'rec-1',
    title: 'Acme Corp',
    values: {
      name: 'Acme Corp',
      owner: 'Ana',
    },
    status: {
      value: 'active',
      label: 'Active',
      tone: 'success' as const,
    },
    filterKeys: ['active'],
  },
  {
    id: 'rec-2',
    title: 'Beta Industries',
    values: {
      name: 'Beta Industries',
      owner: 'Bruno',
    },
    status: {
      value: 'archived',
      label: 'Archived',
      tone: 'neutral' as const,
    },
    filterKeys: ['archived'],
  },
]

describe('CrudListTemplate', () => {
  it('emits toolbar, row and bulk action contracts', async () => {
    const wrapper = shallowMount(CrudListTemplate, {
      ...globalMountOptions,
      props: {
        columns: baseColumns,
        records: baseRecords,
        filters: [
          { id: 'all', label: 'All', count: 2 },
          { id: 'active', label: 'Active', count: 1 },
        ],
        selectedIds: ['rec-1'],
        rowActions: [
          { id: 'edit', icon: 'edit', ariaLabel: 'Edit record' },
        ],
        bulkActions: [
          { id: 'archive', label: 'Archive selected', icon: 'archive' },
        ],
      },
    })

    await wrapper.get('.ntk-template-crud-list__search-input').setValue('acme')
    expect(wrapper.emitted('update:searchValue')).toEqual([['acme']])

    await wrapper.findAll('.ntk-template-crud-list__filter')[1]?.trigger('click')
    expect(wrapper.emitted('update:activeFilterId')?.at(-1)).toEqual(['active'])

    await wrapper.findAll('.ntk-template-crud-list__view')[1]?.trigger('click')
    expect(wrapper.emitted('update:viewMode')?.at(-1)).toEqual(['cards'])

    await wrapper.get('.ntk-template-crud-list__row-action').trigger('click')
    expect(wrapper.emitted('row-action-click')).toEqual([
      [{ actionId: 'edit', recordId: 'rec-1' }],
    ])

    await wrapper.get('q-btn-stub[aria-label="Archive selected"]').trigger('click')
    expect(wrapper.emitted('bulk-action-click')).toEqual([
      [{ actionId: 'archive', selectedIds: ['rec-1'] }],
    ])
  })

  it('filters records and updates selection through checkbox events', async () => {
    const wrapper = shallowMount(CrudListTemplate, {
      ...globalMountOptions,
      props: {
        columns: baseColumns,
        records: baseRecords,
        activeFilterId: 'active',
        searchValue: 'acme',
        selectedIds: [],
      },
    })

    expect(wrapper.findAll('.ntk-template-crud-list__row')).toHaveLength(1)
    expect(wrapper.text()).toContain('Acme Corp')
    expect(wrapper.text()).not.toContain('Beta Industries')

    await wrapper.get('.ntk-template-crud-list__row').trigger('click')
    expect(wrapper.emitted('row-click')).toEqual([['rec-1']])
  })
})