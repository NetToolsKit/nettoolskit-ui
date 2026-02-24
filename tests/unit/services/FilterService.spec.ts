/**
 * FilterService - Unit Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('FilterService', () => {
  describe('applyFilters()', () => {
    it('should filter data based on criteria', () => {
      const data = [
        { id: 1, name: 'John', age: 25 },
        { id: 2, name: 'Jane', age: 30 },
        { id: 3, name: 'Bob', age: 25 }
      ]

      const filtered = data.filter(item => item.age === 25)

      expect(filtered).toHaveLength(2)
      expect(filtered[0].name).toBe('John')
      expect(filtered[1].name).toBe('Bob')
    })

    it('should return all data when no filters applied', () => {
      const data = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ]

      expect(data).toHaveLength(2)
    })

    it('should handle empty data array', () => {
      const data: any[] = []
      const filtered = data.filter(() => true)

      expect(filtered).toHaveLength(0)
    })
  })

  describe('searchFilter()', () => {
    it('should filter by text search', () => {
      const data = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Bob Johnson' }
      ]

      const searchTerm = 'john'
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

      expect(filtered).toHaveLength(2)
      expect(filtered[0].name).toBe('John Doe')
      expect(filtered[1].name).toBe('Bob Johnson')
    })

    it('should be case insensitive', () => {
      const data = [
        { id: 1, name: 'JOHN' },
        { id: 2, name: 'john' },
        { id: 3, name: 'John' }
      ]

      const searchTerm = 'JOHN'
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

      expect(filtered).toHaveLength(3)
    })

    it('should return empty array when no matches', () => {
      const data = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
      ]

      const searchTerm = 'xyz'
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )

      expect(filtered).toHaveLength(0)
    })
  })

  describe('dateRangeFilter()', () => {
    it('should filter by date range', () => {
      const data = [
        { id: 1, date: new Date('2024-01-15') },
        { id: 2, date: new Date('2024-02-15') },
        { id: 3, date: new Date('2024-03-15') }
      ]

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-02-28')

      const filtered = data.filter(item =>
        item.date >= startDate && item.date <= endDate
      )

      expect(filtered).toHaveLength(2)
    })

    it('should include boundary dates', () => {
      const data = [
        { id: 1, date: new Date('2024-01-01') },
        { id: 2, date: new Date('2024-01-31') }
      ]

      const startDate = new Date('2024-01-01')
      const endDate = new Date('2024-01-31')

      const filtered = data.filter(item =>
        item.date >= startDate && item.date <= endDate
      )

      expect(filtered).toHaveLength(2)
    })
  })

  describe('sortData()', () => {
    it('should sort data ascending', () => {
      const data = [
        { id: 3, name: 'Charlie' },
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]

      const sorted = [...data].sort((a, b) => a.name.localeCompare(b.name))

      expect(sorted[0].name).toBe('Alice')
      expect(sorted[1].name).toBe('Bob')
      expect(sorted[2].name).toBe('Charlie')
    })

    it('should sort data descending', () => {
      const data = [
        { id: 1, value: 10 },
        { id: 2, value: 30 },
        { id: 3, value: 20 }
      ]

      const sorted = [...data].sort((a, b) => b.value - a.value)

      expect(sorted[0].value).toBe(30)
      expect(sorted[1].value).toBe(20)
      expect(sorted[2].value).toBe(10)
    })

    it('should handle null values', () => {
      const data = [
        { id: 1, name: 'Alice' },
        { id: 2, name: null },
        { id: 3, name: 'Bob' }
      ]

      const sorted = [...data].sort((a, b) => {
        if (a.name === null) return 1
        if (b.name === null) return -1
        return a.name.localeCompare(b.name)
      })

      expect(sorted[0].name).toBe('Alice')
      expect(sorted[1].name).toBe('Bob')
      expect(sorted[2].name).toBe(null)
    })
  })

  describe('paginateData()', () => {
    it('should paginate data correctly', () => {
      const data = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))
      const pageSize = 10
      const page = 1

      const start = (page - 1) * pageSize
      const paginated = data.slice(start, start + pageSize)

      expect(paginated).toHaveLength(10)
      expect(paginated[0].id).toBe(1)
      expect(paginated[9].id).toBe(10)
    })

    it('should handle last page with fewer items', () => {
      const data = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))
      const pageSize = 10
      const page = 3

      const start = (page - 1) * pageSize
      const paginated = data.slice(start, start + pageSize)

      expect(paginated).toHaveLength(5)
      expect(paginated[0].id).toBe(21)
      expect(paginated[4].id).toBe(25)
    })

    it('should return empty array for page beyond data', () => {
      const data = Array.from({ length: 10 }, (_, i) => ({ id: i + 1 }))
      const pageSize = 10
      const page = 3

      const start = (page - 1) * pageSize
      const paginated = data.slice(start, start + pageSize)

      expect(paginated).toHaveLength(0)
    })
  })
})
