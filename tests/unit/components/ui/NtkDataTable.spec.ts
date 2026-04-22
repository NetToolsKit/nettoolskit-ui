import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import NtkDataTable from '../../../../src/components/ui/NtkDataTable.vue'

type StubColumn = {
  name: string
  label: string
  field: string | ((row: Record<string, unknown>) => unknown)
  classes?: string
  headerClasses?: string
  style?: string
}

type StubRow = {
  id: string
  cells: Record<string, unknown>
  rowClass?: string
}

const QTableStub = defineComponent({
  name: 'QTable',
  props: {
    rows: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: Array,
      default: () => [],
    },
    selection: {
      type: String,
      default: 'none',
    },
    tableRowClassFn: {
      type: Function,
      default: undefined,
    },
  },
  emits: ['row-click', 'update:selected'],
  setup(props, { attrs, emit, slots }) {
    function resolveValue(column: StubColumn, row: StubRow): unknown {
      return typeof column.field === 'function'
        ? column.field(row)
        : (row as Record<string, unknown>)[column.field]
    }

    return () => h(
      'div',
      {
        ...attrs,
        class: ['q-table-stub', attrs.class],
        'data-selection': props.selection,
      },
      [
        h(
          'button',
          {
            class: 'q-table-stub__select-first',
            type: 'button',
            onClick: () => emit('update:selected', [props.rows[0]]),
          },
          'Select first'
        ),
        h('table', [
          h('thead', [
            h('tr', props.columns.map((column: StubColumn) => h(
              'th',
              {
                class: column.headerClasses,
                style: column.style,
              },
              column.label
            ))),
          ]),
          h('tbody', props.rows.map((row: StubRow) => h(
            'tr',
            {
              class: ['ntk-data-table__row', props.tableRowClassFn?.(row)],
              onClick: (event: Event) => emit('row-click', event, row),
            },
            props.columns.map((column: StubColumn) => {
              const slot = slots[`body-cell-${column.name}`]
              const slotProps = {
                row,
                col: column,
                value: resolveValue(column, row),
              }

              return slot
                ? slot(slotProps)
                : h(
                  'td',
                  {
                    class: column.classes,
                  },
                  String(slotProps.value)
                )
            })
          ))),
        ]),
      ]
    )
  },
})

const globalMountOptions = {
  global: {
    stubs: {
      QTable: QTableStub,
      QTd: {
        template: '<td><slot /></td>',
      },
      QIcon: {
        template: '<i />',
      },
    },
  },
}

const rows = [
  {
    id: 'rec-1',
    cells: {
      name: 'Acme Corp',
      owner: 'Ana',
    },
    status: {
      label: 'Active',
      tone: 'success' as const,
    },
  },
  {
    id: 'rec-2',
    cells: {
      name: 'Beta Industries',
      owner: 'Bruno',
    },
  },
]

const columns = [
  { id: 'name', label: 'Name', emphasize: true },
  { id: 'owner', label: 'Owner', align: 'right' as const, width: '140px' },
]

describe('NtkDataTable', () => {
  it('renders Quasar table columns, cells, status and actions with token classes', () => {
    const wrapper = mount(NtkDataTable, {
      ...globalMountOptions,
      props: {
        rows,
        columns,
        rowActions: [
          { id: 'edit', icon: 'edit', ariaLabel: 'Edit record' },
        ],
        ariaLabel: 'Clients table',
      },
    })

    expect(wrapper.attributes('aria-label')).toBe('Clients table')
    expect(wrapper.attributes('data-selection')).toBe('multiple')
    expect(wrapper.text()).toContain('Name')
    expect(wrapper.text()).toContain('Owner')
    expect(wrapper.text()).toContain('Status')
    expect(wrapper.text()).toContain('Actions')
    expect(wrapper.text()).toContain('Acme Corp')
    expect(wrapper.find('.ntk-data-table__cell--emphasis').exists()).toBe(true)
    expect(wrapper.find('.ntk-data-table__status--success').text()).toBe('Active')
    expect(wrapper.find('.ntk-data-table__row-action').attributes('aria-label')).toBe('Edit record')
  })

  it('emits selected row keys from Quasar selection updates', async () => {
    const wrapper = mount(NtkDataTable, {
      ...globalMountOptions,
      props: {
        rows,
        columns,
        selectedKeys: ['rec-2'],
      },
    })

    await wrapper.get('.q-table-stub__select-first').trigger('click')

    expect(wrapper.emitted('update:selectedKeys')).toEqual([[['rec-1']]])
  })

  it('renders custom column slots while keeping the QTable contract', () => {
    const wrapper = mount(NtkDataTable, {
      ...globalMountOptions,
      props: {
        rows,
        columns,
      },
      slots: {
        'cell-name': ({ value, row }: { value: unknown; row: StubRow }) => h(
          'strong',
          { class: 'custom-name-cell' },
          `${String(value)}:${row.id}`
        ),
      },
    })

    expect(wrapper.find('.custom-name-cell').text()).toBe('Acme Corp:rec-1')
  })

  it('emits row click and row action click without leaking row action clicks to rows', async () => {
    const wrapper = mount(NtkDataTable, {
      ...globalMountOptions,
      props: {
        rows,
        columns,
        rowActions: [
          { id: 'edit', icon: 'edit', ariaLabel: 'Edit record' },
        ],
      },
    })

    await wrapper.get('.ntk-data-table__row').trigger('click')
    expect(wrapper.emitted('row-click')).toEqual([['rec-1']])

    await wrapper.get('.ntk-data-table__row-action').trigger('click')
    expect(wrapper.emitted('row-action-click')).toEqual([
      [{ actionId: 'edit', rowId: 'rec-1' }],
    ])
    expect(wrapper.emitted('row-click')).toEqual([['rec-1']])
  })

  it('can disable selection when the host template owns selection elsewhere', () => {
    const wrapper = mount(NtkDataTable, {
      ...globalMountOptions,
      props: {
        rows,
        columns,
        selectable: false,
      },
    })

    expect(wrapper.attributes('data-selection')).toBe('none')
  })

  it('applies token-safe row classes from host templates', () => {
    const wrapper = mount(NtkDataTable, {
      ...globalMountOptions,
      props: {
        rows: [
          {
            id: 'row-tone',
            cells: { name: 'Service API' },
            rowClass: 'ntk-template-enterprise-command__service-row--warning',
          },
        ],
        columns: [{ id: 'name', label: 'Name' }],
      },
    })

    expect(wrapper.get('.ntk-data-table__row').classes()).toContain(
      'ntk-template-enterprise-command__service-row--warning',
    )
  })
})
