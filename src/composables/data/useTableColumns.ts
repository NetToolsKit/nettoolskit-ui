/**
 * useTableColumns - Composable para configuração de colunas de tabelas
 * 
 * Gerencia colunas de QTable com ordenação, visibilidade e persistência
 * de configurações do usuário.
 * 
 * @example
 * const { columns, visibleColumns, toggleColumn, resetColumns } = useTableColumns([
 *   { name: 'name', label: 'Nome', field: 'name', align: 'left', sortable: true }
 * ])
 */

import { ref, computed, watch, type Ref } from 'vue'
import type { QTableColumn } from 'quasar'

export interface TableColumn extends QTableColumn {
  name: string
  label: string
  field: string | ((row: any) => any)
  align?: 'left' | 'right' | 'center'
  sortable?: boolean
  required?: boolean // Required column (cannot be hidden)
  visible?: boolean // Initial visibility
}

export interface UseTableColumnsOptions {
  persistKey?: string // Key for localStorage persistence
  defaultVisibleColumns?: string[] // Columns visible by default
}

/**
 * Composable useTableColumns
 * 
 * @param initialColumns - Configuração inicial das colunas
 * @param options - Opções de configuração
 * @returns Objeto com colunas e métodos de gerenciamento
 */
export function useTableColumns(
  initialColumns: TableColumn[],
  options: UseTableColumnsOptions = {}
) {
  const {
    persistKey,
    defaultVisibleColumns
  } = options

  // Carrega visibilidade salva do localStorage
  const loadSavedVisibility = (): Record<string, boolean> => {
    if (persistKey && typeof window !== 'undefined') {
      const saved = localStorage.getItem(persistKey)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return {}
        }
      }
    }
    return {}
  }

  const savedVisibility = loadSavedVisibility()

  // Initialize columns with visibility
  const columnsWithVisibility = initialColumns.map(col => ({
    ...col,
    // Colunas obrigatórias nunca podem ficar ocultas, mesmo se houver estado persistido
    visible: col.required ? true : (savedVisibility[col.name] ?? col.visible ?? true)
  }))

  // Columns state
  const columns: Ref<TableColumn[]> = ref(columnsWithVisibility)

  /**
   * Computed: Colunas visíveis
   */
  const visibleColumns = computed(() => {
    return columns.value.filter(col => col.visible !== false)
  })

  /**
   * Computed: Nomes das colunas visíveis (para QTable)
   */
  const visibleColumnNames = computed(() => {
    return visibleColumns.value.map(col => col.name)
  })

  /**
   * Computed: Colunas que podem ser ocultadas
   */
  const toggleableColumns = computed(() => {
    return columns.value.filter(col => !col.required)
  })

  /**
   * Computed: Mapa de visibilidade das colunas
   */
  const columnVisibility = computed(() => {
    const visibility: Record<string, boolean> = {}
    columns.value.forEach(col => {
      visibility[col.name] = col.visible !== false
    })
    return visibility
  })

  /**
   * Alterna visibilidade de uma coluna
   */
  const toggleColumn = (columnName: string) => {
    const column = columns.value.find(col => col.name === columnName)
    if (column && !column.required) {
      column.visible = !column.visible
    }
  }

  /**
   * Mostra uma coluna específica
   */
  const showColumn = (columnName: string) => {
    const column = columns.value.find(col => col.name === columnName)
    if (column) {
      column.visible = true
    }
  }

  /**
   * Oculta uma coluna específica
   */
  const hideColumn = (columnName: string) => {
    const column = columns.value.find(col => col.name === columnName)
    if (column && !column.required) {
      column.visible = false
    }
  }

  /**
   * Mostra todas as colunas
   */
  const showAllColumns = () => {
    columns.value.forEach(col => {
      col.visible = true
    })
  }

  /**
   * Oculta todas as colunas não obrigatórias
   */
  const hideAllColumns = () => {
    columns.value.forEach(col => {
      if (!col.required) {
        col.visible = false
      }
    })
  }

  /**
   * Resets visibility to the default state.
   */
  const resetColumns = () => {
    if (defaultVisibleColumns) {
      columns.value.forEach(col => {
        col.visible = col.required ? true : defaultVisibleColumns.includes(col.name)
      })
    } else {
      columns.value.forEach(col => {
        col.visible = true
      })
    }
  }

  /**
   * Reordena colunas
   */
  const reorderColumns = (newOrder: string[]) => {
    const reordered: TableColumn[] = []
    
    newOrder.forEach(name => {
      const column = columns.value.find(col => col.name === name)
      if (column) {
        reordered.push(column)
      }
    })

    // Add columns that were not in the new order
    columns.value.forEach(col => {
      if (!newOrder.includes(col.name)) {
        reordered.push(col)
      }
    })

    columns.value = reordered
  }

  /**
   * Add new column dynamically
   */
  const addColumn = (column: TableColumn) => {
    columns.value.push(column)
  }

  /**
   * Remove column
   */
  const removeColumn = (columnName: string) => {
    const index = columns.value.findIndex(col => col.name === columnName)
    if (index !== -1 && !columns.value[index].required) {
      columns.value.splice(index, 1)
    }
  }

  // Persist visibility to localStorage when changed
  if (persistKey && typeof window !== 'undefined') {
    watch(
      columnVisibility,
      (newVisibility) => {
        localStorage.setItem(persistKey, JSON.stringify(newVisibility))
      },
      { deep: true }
    )
  }

  return {
    columns,
    visibleColumns,
    visibleColumnNames,
    toggleableColumns,
    columnVisibility,
    toggleColumn,
    showColumn,
    hideColumn,
    showAllColumns,
    hideAllColumns,
    resetColumns,
    reorderColumns,
    addColumn,
    removeColumn
  }
}
