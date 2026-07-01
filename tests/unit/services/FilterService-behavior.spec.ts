/**
 * FilterService — activity detection, URL round-trip, clear/reset semantics
 * and change notification (the behavior surface beyond basic get/set).
 */

import { describe, expect, it, vi } from 'vitest'

import { FilterService, FilterServiceFactory } from '../../../src/services/FilterService'

const makeService = () =>
  new FilterService({ q: '', page: 1, tags: [] as string[], active: null as boolean | null })

describe('FilterService activity detection', () => {
  it('treats empty strings/arrays/null and initial values as inactive', () => {
    const service = makeService()
    expect(service.hasActiveFilters()).toBe(false)
    expect(service.getActiveFilterCount()).toBe(0)
    expect(service.getActiveFilterKeys()).toEqual([])

    service.setFilter('q', '')
    service.setFilter('tags', [])
    expect(service.hasActiveFilters()).toBe(false)
  })

  it('detects values that differ from the initial state', () => {
    const service = makeService()
    service.setFilter('q', 'ana')
    service.setFilter('page', 2)

    expect(service.isFilterActive('q')).toBe(true)
    expect(service.isFilterActive('tags')).toBe(false)
    expect(service.getActiveFilterCount()).toBe(2)
    expect(service.getActiveFilterKeys().sort()).toEqual(['page', 'q'])
  })

  it('resetFilter restores one key; resetFilters restores everything', () => {
    const service = makeService()
    service.setFilters({ q: 'x', page: 9, tags: ['a'], active: true })

    service.resetFilter('page')
    expect(service.getFilter('page')).toBe(1)
    expect(service.getFilter('q')).toBe('x')

    service.resetFilters()
    expect(service.getFilters()).toEqual({ q: '', page: 1, tags: [], active: null })
  })

  it('clearFilters empties by type instead of restoring initial values', () => {
    const service = new FilterService({ q: 'seed', page: 3, tags: ['a', 'b'] })
    service.clearFilters()

    const cleared = service.getFilters()
    expect(cleared.q).toBe('')
    expect(cleared.tags).toEqual([])
    expect(cleared.page).toBeNull()
  })
})

describe('FilterService URL round-trip', () => {
  it('serializes only non-empty filters as strings', () => {
    const service = makeService()
    service.setFilter('q', 'ana')
    service.setFilter('page', 2)

    const query = service.serializeToQueryParams()
    expect(query.q).toBe('ana')
    expect(query.page).toBe('2')
    expect(query).not.toHaveProperty('tags')
    expect(query).not.toHaveProperty('active')
  })

  it('deserializes respecting the initial value types and ignores foreign keys', () => {
    const service = makeService()
    service.deserializeFromQueryParams({ q: 'busca', page: '42', evil: 'x' })

    expect(service.getFilter('q')).toBe('busca')
    expect(service.getFilter('page')).toBe(42)
    expect(service.getFilters()).not.toHaveProperty('evil')
    expect(Array.isArray(service.getFilter('tags'))).toBe(true)
  })

  it('getFilters returns a copy, not a live reference', () => {
    const service = makeService()
    const snapshot = service.getFilters()
    snapshot.q = 'mutated'
    expect(service.getFilter('q')).toBe('')
  })
})

describe('FilterService query value parsing', () => {
  it('restores arrays from CSV, booleans from literals and drops empty values', () => {
    const service = new FilterService({
      tags: [] as string[],
      active: false,
      label: 'x',
    })

    service.deserializeFromQueryParams({ tags: 'a,b', active: 'true', label: '' })
    expect(service.getFilter('tags')).toEqual(['a', 'b'])
    expect(service.getFilter('active')).toBe(true)
    expect(service.getFilter('label')).toBeNull()

    service.deserializeFromQueryParams({ active: 'false', tags: ['c,d'] as never })
    expect(service.getFilter('active')).toBe(false)
    expect(service.getFilter('tags')).toEqual(['c', 'd'])
  })
})

describe('FilterServiceFactory', () => {
  it('caches instances per key, removes and clears them', () => {
    FilterServiceFactory.clearAll()
    const first = FilterServiceFactory.getInstance('grid', { q: '' })
    const again = FilterServiceFactory.getInstance('grid', { q: 'ignored' })
    expect(again).toBe(first)

    FilterServiceFactory.removeInstance('grid')
    const rebuilt = FilterServiceFactory.getInstance('grid', { q: '' })
    expect(rebuilt).not.toBe(first)

    FilterServiceFactory.clearAll()
    expect(FilterServiceFactory.getInstance('grid', { q: '' })).not.toBe(rebuilt)
    FilterServiceFactory.clearAll()
  })
})

describe('FilterService change notification', () => {
  it('invokes onFilterChange for every mutating operation', () => {
    const onFilterChange = vi.fn()
    const service = new FilterService({ q: '' }, { onFilterChange })

    service.setFilter('q', 'a')
    service.setFilters({ q: 'b' })
    service.resetFilter('q')
    service.resetFilters()
    service.clearFilters()
    service.deserializeFromQueryParams({ q: 'c' })

    expect(onFilterChange).toHaveBeenCalledTimes(6)
    expect(onFilterChange).toHaveBeenLastCalledWith(expect.objectContaining({ q: 'c' }))
  })
})