/**
 * Table contract and class recipe.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkTableVariants = ['default', 'bordered', 'striped'] as const
export type NtkTableVariant = (typeof ntkTableVariants)[number]
export type NtkTableSize = NtkComponentSize
export type NtkTableIntent = NtkComponentIntent
export type NtkTableCellValue = string | number | boolean | null | undefined

export interface NtkTableColumn {
  readonly id: string
  readonly label: string
  readonly align?: 'left' | 'center' | 'right'
  readonly width?: string
  /** When true, the header becomes an interactive sort control. */
  readonly sortable?: boolean
}

export type NtkTableSortDirection = 'asc' | 'desc'

export interface NtkTableSort {
  readonly field: string
  readonly direction: NtkTableSortDirection
}

export interface NtkTablePagination {
  /** 1-based current page. */
  readonly page: number
  readonly pageSize: number
  /** Total row count across all pages (server-reported in server mode). */
  readonly total: number
}

export interface NtkTablePageInfo {
  readonly page: number
  readonly pageSize: number
  readonly total: number
  readonly totalPages: number
  /** 1-based index of the first row on the current page (0 when empty). */
  readonly startRow: number
  /** 1-based index of the last row on the current page (0 when empty). */
  readonly endRow: number
  readonly hasPrevious: boolean
  readonly hasNext: boolean
  readonly isEmpty: boolean
}

export interface NtkTableRow {
  readonly id: string
  readonly cells: Readonly<Record<string, NtkTableCellValue>>
  readonly rowClass?: NtkClassValue
}

export interface NtkTableContract extends NtkComponentContractBase {
  readonly caption?: string
  readonly ariaLabel?: string
  readonly columns?: readonly NtkTableColumn[]
  readonly rows?: readonly NtkTableRow[]
  readonly selectedKeys?: readonly string[]
  readonly variant?: NtkTableVariant
  readonly size?: NtkTableSize
  readonly intent?: NtkTableIntent
  readonly selectable?: boolean
  readonly emptyLabel?: string
  readonly emptyValueLabel?: string
  /** Active sort (controlled). `null` means unsorted. */
  readonly sort?: NtkTableSort | null
  /** When provided, the table renders server-mode pagination controls. */
  readonly pagination?: NtkTablePagination | null
  /** Reflects an in-flight fetch (server mode). */
  readonly loading?: boolean
}

export const ntkTableDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkTableContract, 'variant' | 'size' | 'intent'>>

export const ntkTableRecipeClassMap = {
  root: 'ntk-table',
  variants: {
    default: 'ntk-table--variant-default',
    bordered: 'ntk-table--variant-bordered',
    striped: 'ntk-table--variant-striped',
  },
  sizes: {
    sm: 'ntk-table--size-sm',
    md: 'ntk-table--size-md',
    lg: 'ntk-table--size-lg',
  },
  intents: {
    neutral: 'ntk-table--intent-neutral',
    primary: 'ntk-table--intent-primary',
    success: 'ntk-table--intent-success',
    warning: 'ntk-table--intent-warning',
    danger: 'ntk-table--intent-danger',
    info: 'ntk-table--intent-info',
  },
  states: {
    selected: 'ntk-table--has-selection',
    clickable: 'ntk-table--has-clickable-rows',
  },
} as const satisfies NtkRecipeClassMap<NtkTableVariant, NtkTableSize, NtkTableIntent>

export type NtkTableRecipeOptions = NtkRecipeOptions<NtkTableVariant, NtkTableSize, NtkTableIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkTableRecipe = (options: NtkTableRecipeOptions = {}) =>
  resolveNtkRecipe(ntkTableRecipeClassMap, ntkTableDefaults, options)

export const getNtkTableClasses = (options: NtkTableRecipeOptions = {}) =>
  resolveNtkTableRecipe(options).classes

export const getNtkTableClassName = (options: NtkTableRecipeOptions = {}) =>
  resolveNtkTableRecipe(options).className

/**
 * The `aria-sort` value for a column header given the active sort. Pure.
 */
export const getNtkTableAriaSort = (
  sort: NtkTableSort | null | undefined,
  field: string,
): 'ascending' | 'descending' | 'none' => {
  if (!sort || sort.field !== field) {
    return 'none'
  }
  return sort.direction === 'asc' ? 'ascending' : 'descending'
}

/**
 * Compute the next sort state when a column header is activated. Cycles
 * none -> ascending -> descending -> none for the same column; a different
 * column always restarts at ascending. Pure.
 */
export const nextNtkTableSort = (
  current: NtkTableSort | null | undefined,
  field: string,
): NtkTableSort | null => {
  if (!current || current.field !== field) {
    return { field, direction: 'asc' }
  }
  if (current.direction === 'asc') {
    return { field, direction: 'desc' }
  }
  return null
}

/**
 * Derive presentational pagination info (clamped page, row range, navigation
 * flags) from a raw pagination state. Pure and defensive: a non-positive page
 * size collapses to a single page and the page is clamped into range.
 */
export const getNtkTablePageInfo = (pagination: NtkTablePagination): NtkTablePageInfo => {
  const total = Math.max(0, Math.trunc(pagination.total))
  const pageSize = Math.max(1, Math.trunc(pagination.pageSize))
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(Math.max(1, Math.trunc(pagination.page)), totalPages)
  const isEmpty = total === 0
  const startRow = isEmpty ? 0 : (page - 1) * pageSize + 1
  const endRow = isEmpty ? 0 : Math.min(page * pageSize, total)

  return {
    page,
    pageSize,
    total,
    totalPages,
    startRow,
    endRow,
    hasPrevious: page > 1,
    hasNext: page < totalPages,
    isEmpty,
  }
}