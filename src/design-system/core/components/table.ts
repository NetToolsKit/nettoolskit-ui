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