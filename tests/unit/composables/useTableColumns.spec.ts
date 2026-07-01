import { describe, expect, it } from 'vitest'
import { useTableColumns } from '../../../src/composables/data/useTableColumns'

const sampleColumns = [
  { name: 'id', label: 'ID', field: 'id', required: true },
  { name: 'name', label: 'Name', field: 'name', visible: true },
  { name: 'email', label: 'Email', field: 'email', visible: true },
  { name: 'status', label: 'Status', field: 'status', visible: false },
]

describe('useTableColumns', () => {
  it('returns all columns including initially hidden ones', () => {
    const { columns } = useTableColumns(sampleColumns)
    expect(columns.value).toHaveLength(4)
  })

  it('visibleColumns excludes initially hidden columns', () => {
    const { visibleColumns } = useTableColumns(sampleColumns)
    expect(visibleColumns.value).toHaveLength(3)
    expect(visibleColumns.value.map(c => c.name)).not.toContain('status')
  })

  it('visibleColumnNames returns name strings', () => {
    const { visibleColumnNames } = useTableColumns(sampleColumns)
    expect(visibleColumnNames.value).toContain('id')
    expect(visibleColumnNames.value).toContain('name')
    expect(visibleColumnNames.value).not.toContain('status')
  })

  it('toggleColumn shows a hidden column', () => {
    const { visibleColumns, toggleColumn } = useTableColumns(sampleColumns)
    toggleColumn('status')
    expect(visibleColumns.value.map(c => c.name)).toContain('status')
  })

  it('toggleColumn hides a visible column', () => {
    const { visibleColumns, toggleColumn } = useTableColumns(sampleColumns)
    toggleColumn('name')
    expect(visibleColumns.value.map(c => c.name)).not.toContain('name')
  })

  it('required columns cannot be hidden via toggleColumn', () => {
    const { visibleColumns, toggleColumn } = useTableColumns(sampleColumns)
    toggleColumn('id')
    expect(visibleColumns.value.map(c => c.name)).toContain('id')
  })

  it('showColumn makes a hidden column visible', () => {
    const { visibleColumns, showColumn } = useTableColumns(sampleColumns)
    showColumn('status')
    expect(visibleColumns.value.map(c => c.name)).toContain('status')
  })

  it('hideColumn hides a visible column', () => {
    const { visibleColumns, hideColumn } = useTableColumns(sampleColumns)
    hideColumn('name')
    expect(visibleColumns.value.map(c => c.name)).not.toContain('name')
  })

  it('hideColumn cannot hide required columns', () => {
    const { visibleColumns, hideColumn } = useTableColumns(sampleColumns)
    hideColumn('id')
    expect(visibleColumns.value.map(c => c.name)).toContain('id')
  })

  it('showAllColumns makes all columns visible', () => {
    const { visibleColumns, showAllColumns } = useTableColumns(sampleColumns)
    showAllColumns()
    expect(visibleColumns.value).toHaveLength(4)
  })

  it('hideAllColumns hides all non-required columns', () => {
    const { visibleColumns, hideAllColumns } = useTableColumns(sampleColumns)
    hideAllColumns()
    // Only required column remains visible
    expect(visibleColumns.value).toHaveLength(1)
    expect(visibleColumns.value[0]?.name).toBe('id')
  })

  it('columnVisibility returns a name→boolean map', () => {
    const { columnVisibility } = useTableColumns(sampleColumns)
    expect(columnVisibility.value.id).toBe(true)
    expect(columnVisibility.value.name).toBe(true)
    expect(columnVisibility.value.status).toBe(false)
  })

  it('toggleableColumns excludes required columns', () => {
    const { toggleableColumns } = useTableColumns(sampleColumns)
    expect(toggleableColumns.value.map(c => c.name)).not.toContain('id')
    expect(toggleableColumns.value).toHaveLength(3)
  })
})

describe('useTableColumns persisted-state hardening (untrusted localStorage)', () => {
  const persistKey = 'ntk-test-columns'

  const withPayload = (payload: string) => {
    localStorage.setItem(persistKey, payload)
    const api = useTableColumns(sampleColumns, { persistKey })
    localStorage.removeItem(persistKey)
    return api
  }

  it('applies only boolean values for known column names', () => {
    const { visibleColumns } = withPayload(JSON.stringify({
      name: false,
      status: true,
      unknownColumn: true,
      email: 'yes',
    }))

    const names = visibleColumns.value.map(c => c.name)
    expect(names).not.toContain('name') // persisted boolean honored
    expect(names).toContain('status') // persisted boolean honored
    expect(names).toContain('email') // non-boolean value ignored -> default
  })

  it.each([
    ['null', 'null'],
    ['array', '[true,false]'],
    ['string', '"true"'],
    ['number', '42'],
    ['broken JSON', '{oops'],
  ])('degrades to defaults for a %s payload', (_label, payload) => {
    const { visibleColumns } = withPayload(payload)
    expect(visibleColumns.value.map(c => c.name)).toEqual(['id', 'name', 'email'])
  })

  it('does not copy foreign keys such as __proto__ into state', () => {
    const { columns } = withPayload('{"__proto__":{"polluted":true},"name":false}')

    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
    for (const column of columns.value) {
      expect(Object.keys(column)).not.toContain('__proto__')
    }
  })

  it('keeps required columns visible even when persisted state hides them', () => {
    const { visibleColumns } = withPayload(JSON.stringify({ id: false }))
    expect(visibleColumns.value.map(c => c.name)).toContain('id')
  })
})