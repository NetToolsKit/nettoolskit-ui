/**
 * useFilters - Vue Composable for managing filters
 * 
 * Vue wrapper for FilterService (Application Layer).
 * Adds Vue Router integration and Vue reactivity.
 * 
 * This composable follows Clean Architecture:
 * - Presentation (composable) → Application (service)
 * 
 * @example
 * const { filters, resetFilters, hasActiveFilters } = useFilters({
 *   category: null,
 *   status: null
 * })
 * 
 * @layer Presentation
 */

import { ref, computed, watch, type Ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FilterService, type FiltersState } from '../../services/FilterService'

export interface UseFiltersOptions {
  syncWithUrl?: boolean
  onFilterChange?: (filters: FiltersState) => void
  debounce?: number
}

/**
 * Composable useFilters
 * 
 * Manages filters with Vue reactivity and router integration.
 * Delegates business logic to FilterService.
 * 
 * @param initialFilters - Initial filter state
 * @param options - Configuration options
 * @returns Reactive object with state and filter methods
 */
export function useFilters<T extends FiltersState>(
  initialFilters: T,
  options: UseFiltersOptions = {}
) {
  const router = useRouter()
  const route = useRoute()

  const {
    syncWithUrl = false,
    onFilterChange,
    debounce = 0
  } = options

  // Create FilterService instance
  const filterService = new FilterService<T>(initialFilters, {
    onFilterChange
  })

  // Reactive filter state (delegating to service)
  const filters: Ref<T> = ref(filterService.getFilters()) as Ref<T>
  const showFilters = ref(false)

  /**
   * Computed: Check if there are active filters
   */
  const hasActiveFilters = computed(() => {
    return filterService.hasActiveFilters()
  })

  /**
   * Computed: Count how many filters are active
   */
  const filterCount = computed(() => {
    return filterService.getActiveFilterCount()
  })

  /**
   * Reset all filters to initial values
   */
  const resetFilters = () => {
    filterService.resetFilters()
    filters.value = filterService.getFilters()

    if (syncWithUrl) {
      router.push({ query: {} })
    }
  }

  /**
   * Reset a specific filter
   */
  const resetFilter = (key: keyof T) => {
    filterService.resetFilter(key)
    filters.value = filterService.getFilters()
  }

  /**
   * Apply filters (useful for search with button)
   */
  const applyFilters = () => {
    filterService.setFilters(filters.value)

    if (syncWithUrl) {
      syncFiltersToUrl()
    }
  }

  /**
   * Toggle visibilidade do painel de filtros
   */
  const toggleFilters = () => {
    showFilters.value = !showFilters.value
  }

  /**
   * Sincroniza filtros com URL query params
   */
  const syncFiltersToUrl = () => {
    const query = filterService.serializeToQueryParams()
    router.push({ query })
  }

  /**
   * Loads filters from the URL when the component mounts.
   */
  const loadFiltersFromUrl = () => {
    if (!syncWithUrl) return

    const queryParams = route.query as Record<string, string | string[]>
    filterService.deserializeFromQueryParams(queryParams)
    filters.value = filterService.getFilters()
  }

  /**
   * Watch para mudanças nos filtros (auto-apply)
   */
  if (!debounce) {
    watch(filters, (newFilters) => {
      filterService.setFilters(newFilters)
    }, { deep: true })
  }

  // Carrega filtros da URL ao inicializar
  if (syncWithUrl) {
    loadFiltersFromUrl()
  }

  return {
    filters,
    showFilters,
    hasActiveFilters,
    filterCount,
    resetFilters,
    resetFilter,
    applyFilters,
    toggleFilters,
    syncFiltersToUrl,
    loadFiltersFromUrl
  }
}

/**
 * Re-exporta tipos para conveniência
 */
export type { FiltersState } from '../../services/FilterService'
