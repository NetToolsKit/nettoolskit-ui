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

  it('renders title, subtitle, and metric chips', () => {
    const wrapper = shallowMount(CrudListTemplate, {
      ...globalMountOptions,
      props: {
        columns: baseColumns,
        records: baseRecords,
        title: 'Clients',
        subtitle: 'Manage your client list',
        metrics: [
          { id: 'm1', label: 'Total', value: 2, icon: 'people' },
          { id: 'm2', label: 'Active', value: 1, icon: 'check_circle', tone: 'success' },
        ],
      },
    })

    expect(wrapper.find('.ntk-template-crud-list__title').text()).toBe('Clients')
    expect(wrapper.find('.ntk-template-crud-list__subtitle').text()).toContain('Manage your client list')
    const metrics = wrapper.findAll('.ntk-template-crud-list__metric')
    expect(metrics).toHaveLength(2)
    expect(metrics[0]?.text()).toContain('Total')
    expect(metrics[1]?.text()).toContain('Active')
  })

  it('renders record status badge with correct tone class', () => {
    const wrapper = shallowMount(CrudListTemplate, {
      ...globalMountOptions,
      props: { columns: baseColumns, records: baseRecords },
    })

    const statusEls = wrapper.findAll('.ntk-template-crud-list__status')
    expect(statusEls.length).toBeGreaterThan(0)
    // First record has status tone 'success'
    expect(statusEls[0]?.classes()).toContain('ntk-template-crud-list__status--success')
    expect(statusEls[0]?.text()).toBe('Active')
  })

  it('renders records as cards in card view mode', () => {
    const wrapper = shallowMount(CrudListTemplate, {
      ...globalMountOptions,
      props: {
        columns: baseColumns,
        records: [
          {
            id: 'r1',
            title: 'Acme Corp',
            subtitle: 'Enterprise client',
            values: { name: 'Acme Corp', owner: 'Ana' },
            tags: ['vip', 'healthcare'],
          },
        ],
        viewMode: 'cards',
      },
    })

    expect(wrapper.find('.ntk-template-crud-list__cards').exists()).toBe(true)
    expect(wrapper.find('.ntk-template-crud-list__table-wrap').exists()).toBe(false)

    const card = wrapper.find('.ntk-template-crud-list__card')
    expect(card.exists()).toBe(true)
    expect(card.find('.ntk-template-crud-list__card-title').text()).toBe('Acme Corp')
    expect(card.find('.ntk-template-crud-list__card-subtitle').text()).toContain('Enterprise client')

    const tags = wrapper.findAll('.ntk-template-crud-list__tag')
    expect(tags).toHaveLength(2)
    expect(tags[0]?.text()).toBe('vip')
    expect(tags[1]?.text()).toBe('healthcare')
  })

  it('renders loading skeletons when loading is true', () => {
    const wrapper = shallowMount(CrudListTemplate, {
      ...globalMountOptions,
      props: { columns: baseColumns, records: [], loading: true },
    })

    expect(wrapper.find('.ntk-template-crud-list__loading').exists()).toBe(true)
    expect(wrapper.findAll('.ntk-template-crud-list__loading-item').length).toBeGreaterThan(0)
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