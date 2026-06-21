import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { DsTable } from '@/design-system/vue'

const columns = [
  { id: 'name', label: 'Name', width: '180px' },
  { id: 'status', label: 'Status', align: 'center' as const },
  { id: 'enabled', label: 'Enabled', align: 'right' as const },
]

const rows = [
  {
    id: 'release-1',
    cells: {
      name: 'Release 1',
      status: 'Draft',
      enabled: true,
    },
    rowClass: 'custom-row',
  },
  {
    id: 'release-2',
    cells: {
      name: 'Release 2',
      status: '',
      enabled: false,
    },
  },
]

describe('DsTable', () => {
  it('renders caption, headers, rows, values, and recipe classes', () => {
    const wrapper = mount(DsTable, {
      props: {
        id: 'release-table',
        testId: 'releases',
        caption: 'Release table',
        columns,
        rows,
        selectedKeys: ['release-1'],
        variant: 'striped',
        size: 'lg',
        intent: 'info',
        selectable: true,
        class: ['custom-table'],
      },
    })

    const root = wrapper.get('.ntk-table')
    const table = wrapper.get('table')
    const selectAll = wrapper.get('thead input[type="checkbox"]')
    const headers = wrapper.findAll('th')
    const bodyRows = wrapper.findAll('tbody tr')

    expect(root.attributes('id')).toBe('release-table')
    expect(root.attributes('data-testid')).toBe('releases')
    expect(root.classes()).toEqual(expect.arrayContaining([
      'ntk-table--variant-striped',
      'ntk-table--size-lg',
      'ntk-table--intent-info',
      'ntk-table--has-selection',
      'ntk-table--has-clickable-rows',
      'custom-table',
    ]))
    expect(table.text()).toContain('Release table')
    expect(table.attributes('aria-label')).toBeUndefined()
    expect(selectAll.attributes('aria-checked')).toBe('mixed')
    expect(headers.map(header => header.text())).toEqual(['', 'Name', 'Status', 'Enabled'])
    expect(bodyRows).toHaveLength(2)
    expect(bodyRows[0]?.attributes('aria-selected')).toBeUndefined()
    expect(bodyRows[0]?.attributes('tabindex')).toBe('0')
    expect(bodyRows[0]?.classes()).toContain('custom-row')
    expect(bodyRows[0]?.text()).toContain('Release 1')
    expect(bodyRows[0]?.text()).toContain('Yes')
    expect(bodyRows[0]?.get('input[type="checkbox"]').attributes('aria-label')).toBe('Select row Release 1')
    expect(bodyRows[1]?.text()).toContain('-')
    expect(bodyRows[1]?.text()).toContain('No')
  })

  it('emits row clicks and selected key updates', async () => {
    const wrapper = mount(DsTable, {
      props: {
        columns,
        rows,
        selectedKeys: ['release-1'],
        selectable: true,
      },
    })

    const bodyRows = wrapper.findAll('tbody tr')
    await bodyRows[1]?.trigger('click')
    await bodyRows[0]?.trigger('keydown.enter')
    await bodyRows[1]?.get('input[type="checkbox"]').setValue(true)
    await wrapper.get('thead input[type="checkbox"]').setValue(true)

    expect(wrapper.emitted('row-click')?.[0]).toEqual(['release-2'])
    expect(wrapper.emitted('row-click')?.[1]).toEqual(['release-1'])
    expect(wrapper.emitted('update:selectedKeys')?.[0]).toEqual([['release-1', 'release-2']])
    expect(wrapper.emitted('update:selectedKeys')?.[1]).toEqual([['release-1', 'release-2']])
  })

  it('renders the empty state with the expected column span', () => {
    const wrapper = mount(DsTable, {
      props: {
        columns,
        rows: [],
        selectable: true,
        ariaLabel: 'Release records',
        emptyLabel: 'No releases',
      },
    })

    const emptyCell = wrapper.get('.ntk-table__empty-cell')

    expect(wrapper.get('table').attributes('aria-label')).toBe('Release records')
    expect(emptyCell.text()).toBe('No releases')
    expect(emptyCell.attributes('colspan')).toBe('4')
  })

  it('renders custom cell slots with row and column context', () => {
    const wrapper = mount(DsTable, {
      props: {
        columns,
        rows,
      },
      slots: {
        'cell-status': '<template #default="{ row, column, value }"><strong>{{ column.label }}:{{ row.id }}:{{ value }}</strong></template>',
      },
    })

    expect(wrapper.text()).toContain('Status:release-1:Draft')
  })
})