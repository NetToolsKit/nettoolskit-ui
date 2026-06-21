import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { useFilters } from '../../../src/composables/data/useFilters'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ query: {} }),
}))

describe('useFilters', () => {
  it('initializes filters from initialFilters', () => {
    const { filters } = useFilters({ category: null, status: null })
    expect(filters.value).toEqual({ category: null, status: null })
  })

  it('hasActiveFilters is false when all filters are null', () => {
    const { hasActiveFilters } = useFilters({ category: null, status: null })
    expect(hasActiveFilters.value).toBe(false)
  })

  it('hasActiveFilters is true after modifying filter and applying', () => {
    const { filters, hasActiveFilters, applyFilters } = useFilters({ category: null as string | null })
    filters.value = { category: 'tech' }
    applyFilters()
    expect(hasActiveFilters.value).toBe(true)
  })

  it('filterCount reflects the number of active filters after apply', () => {
    const { filters, filterCount, applyFilters } = useFilters({
      a: null as string | null,
      b: null as string | null,
      c: null as string | null,
    })
    filters.value = { a: 'x', b: 'y', c: null }
    applyFilters()
    expect(filterCount.value).toBe(2)
  })

  it('resetFilters clears all filters', async () => {
    const { filters, resetFilters } = useFilters({ category: null as string | null, status: null as string | null })
    filters.value = { category: 'tech', status: 'active' }
    await nextTick() // let watcher sync to service
    resetFilters()
    expect(filters.value.category).toBeNull()
    expect(filters.value.status).toBeNull()
  })

  it('resetFilter resets a single key', async () => {
    const { filters, resetFilter } = useFilters({ category: null as string | null, status: null as string | null })
    filters.value = { category: 'tech', status: 'active' }
    await nextTick()
    resetFilter('category')
    expect(filters.value.category).toBeNull()
    expect(filters.value.status).toBe('active')
  })

  it('toggleFilters toggles showFilters state', () => {
    const { showFilters, toggleFilters } = useFilters({})
    expect(showFilters.value).toBe(false)
    toggleFilters()
    expect(showFilters.value).toBe(true)
    toggleFilters()
    expect(showFilters.value).toBe(false)
  })

  it('calls onFilterChange callback when filters are applied', () => {
    const onFilterChange = vi.fn()
    const { filters, applyFilters } = useFilters(
      { q: null as string | null },
      { onFilterChange }
    )
    filters.value = { q: 'hello' }
    applyFilters()
    expect(onFilterChange).toHaveBeenCalled()
  })
})