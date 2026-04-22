/**
 * FilterService - filter management service.
 * 
 * Pure business logic service for search/report filters.
 * No framework dependencies (Vue, Quasar, etc.).
 * 
 * Responsabilidades:
 * - Manage reactive state
 * - Integrate with URL (query params)
 * - Validate and transform values
 * - Save user preferences
 * - Count active filters
 * - Reset filters
 * - Serialize/deserialize URL state
 * 
 * @example
 * const service = new FilterService({ category: null, status: null })
 * service.setFilter('category', 'tech')
 * const count = service.getActiveFilterCount()
 * 
 * @layer Application
 */

/**
 * Generic filter state
 */
export interface FiltersState {
  [key: string]: any
}

/**
 * Callback for filter changes
 */
export type FilterChangeCallback<T extends FiltersState> = (filters: T) => void

/**
 * FilterService configuration options
 */
export interface FilterServiceOptions<T extends FiltersState> {
  /**
   * Callback called when filters change
   */
  onFilterChange?: FilterChangeCallback<T>
}

/**
 * Filter management service
 * 
 * Implements pure business logic for filters, without external
 * framework dependencies.
 */
export class FilterService<T extends FiltersState> {
  private currentFilters: T
  private readonly initialFilters: T
  private readonly options: FilterServiceOptions<T>

  constructor(initialFilters: T, options: FilterServiceOptions<T> = {}) {
    this.initialFilters = { ...initialFilters }
    this.currentFilters = { ...initialFilters }
    this.options = options
  }

  /**
   * Returns current filter state
   */
  getFilters(): T {
    return { ...this.currentFilters }
  }

  /**
   * Sets the complete filter state
   */
  setFilters(filters: T): void {
    this.currentFilters = { ...filters }
    this.notifyChange()
  }

  /**
   * Sets a specific filter
   */
  setFilter<K extends keyof T>(key: K, value: T[K]): void {
    this.currentFilters[key] = value
    this.notifyChange()
  }

  /**
   * Returns a specific filter
   */
  getFilter<K extends keyof T>(key: K): T[K] {
    return this.currentFilters[key]
  }

  /**
   * Resets all filters to initial values
   */
  resetFilters(): void {
    this.currentFilters = { ...this.initialFilters }
    this.notifyChange()
  }

  /**
   * Resets a specific filter
   */
  resetFilter<K extends keyof T>(key: K): void {
    this.currentFilters[key] = this.initialFilters[key]
    this.notifyChange()
  }

  /**
   * Checks whether any filters are active
   * 
   * A filter is considered active when:
   * - It is not null, undefined, or an empty string
   * - It is not an empty array
   * - It differs from its initial value
   */
  hasActiveFilters(): boolean {
    return Object.keys(this.currentFilters).some(key => {
      return this.isFilterActive(key as keyof T)
    })
  }

  /**
   * Checks whether a specific filter is active
   */
  isFilterActive<K extends keyof T>(key: K): boolean {
    const value = this.currentFilters[key]
    const initialValue = this.initialFilters[key]

    // Ignore empty values
    if (this.isEmptyValue(value)) return false

    // Check if different from initial
    return value !== initialValue
  }

  /**
   * Counts active filters
   */
  getActiveFilterCount(): number {
    return Object.keys(this.currentFilters).filter(key => {
      return this.isFilterActive(key as keyof T)
    }).length
  }

  /**
   * Lists active filter keys
   */
  getActiveFilterKeys(): (keyof T)[] {
    return Object.keys(this.currentFilters).filter(key => {
      return this.isFilterActive(key as keyof T)
    }) as (keyof T)[]
  }

  /**
   * Serializes filters to URL query params
   * 
   * Converts current filter state into an object suitable
   * for URL query parameters.
   * 
   * @returns Object with string key-value pairs
   */
  serializeToQueryParams(): Record<string, string> {
    const query: Record<string, string> = {}

    Object.keys(this.currentFilters).forEach(key => {
      const value = this.currentFilters[key]

      if (!this.isEmptyValue(value)) {
        query[key] = this.valueToString(value)
      }
    })

    return query
  }

  /**
   * Deserializes URL query params into filters
   * 
   * Converts URL query parameters into the expected filter
   * shape while respecting initial value types.
   * 
   * @param queryParams - Query parameter object
   */
  deserializeFromQueryParams(queryParams: Record<string, string | string[]>): void {
    const newFilters: any = { ...this.currentFilters }

    Object.keys(queryParams).forEach(key => {
      if (key in this.initialFilters) {
        const value = queryParams[key]
        
        // Ignore undefined values
        if (value === undefined) return
        
        const initialType = typeof this.initialFilters[key]

        newFilters[key] = this.parseQueryValue(
          value,
          initialType,
          Array.isArray(this.initialFilters[key])
        )
      }
    })

    this.currentFilters = newFilters as T
    this.notifyChange()
  }

  /**
   * Clears all filters (sets to empty values)
   * 
   * Different from resetFilters which restores initial values,
   * this method sets all to null/undefined.
   */
  clearFilters(): void {
    const cleared: any = {}

    Object.keys(this.currentFilters).forEach(key => {
      const value = this.currentFilters[key]

      if (Array.isArray(value)) {
        cleared[key] = []
      } else if (typeof value === 'string') {
        cleared[key] = ''
      } else {
        cleared[key] = null
      }
    })

    this.currentFilters = cleared as T
    this.notifyChange()
  }

  /**
   * Checks whether a value is considered empty
   */
  private isEmptyValue(value: any): boolean {
    if (value === null || value === undefined || value === '') return true
    if (Array.isArray(value) && value.length === 0) return true
    return false
  }

  /**
   * Converts a value to a string for URL state
   */
  private valueToString(value: any): string {
    if (Array.isArray(value)) {
      return value.join(',')
    }
    return String(value)
  }

  /**
   * Parses a query param value into the expected type
   */
  private parseQueryValue(
    value: string | string[],
    expectedType: string,
    isArray: boolean
  ): any {
    const stringValue = Array.isArray(value) ? value[0] : value

    // Ensure we have a valid value
    if (!stringValue) return isArray ? [] : null

    if (isArray) {
      return stringValue.split(',')
    }

    switch (expectedType) {
      case 'number':
        return Number(stringValue)
      case 'boolean':
        return stringValue === 'true'
      default:
        return stringValue
    }
  }

  /**
   * Notifies filter changes
   */
  private notifyChange(): void {
    if (this.options.onFilterChange) {
      this.options.onFilterChange(this.getFilters())
    }
  }
}

/**
 * FilterService singleton factory.
 * 
 * Creates and manages FilterService instances centrally.
 */
export class FilterServiceFactory {
  private static instances: Map<string, FilterService<any>> = new Map()

  /**
   * Creates or returns an existing FilterService instance
   * 
   * @param key - Unique key that identifies the instance
   * @param initialFilters - Initial filter state
   * @param options - Configuration options
   */
  static getInstance<T extends FiltersState>(
    key: string,
    initialFilters: T,
    options?: FilterServiceOptions<T>
  ): FilterService<T> {
    if (!this.instances.has(key)) {
      this.instances.set(key, new FilterService(initialFilters, options))
    }
    return this.instances.get(key)!
  }

  /**
   * Removes an instance from the cache
   */
  static removeInstance(key: string): void {
    this.instances.delete(key)
  }

  /**
   * Clears all instances
   */
  static clearAll(): void {
    this.instances.clear()
  }
}
