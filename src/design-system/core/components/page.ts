/**
 * Page contract and class recipe.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkPageVariants = ['default', 'surface', 'dashboard'] as const
export type NtkPageVariant = (typeof ntkPageVariants)[number]
export type NtkPageSize = NtkComponentSize
export type NtkPageIntent = NtkComponentIntent

export interface NtkPageContract extends NtkComponentContractBase {
  readonly title?: string
  readonly subtitle?: string
  readonly ariaLabel?: string
  readonly variant?: NtkPageVariant
  readonly size?: NtkPageSize
  readonly intent?: NtkPageIntent
}

export const ntkPageDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkPageContract, 'variant' | 'size' | 'intent'>>

export const ntkPageRecipeClassMap = {
  root: 'ntk-page',
  variants: {
    default: 'ntk-page--variant-default',
    surface: 'ntk-page--variant-surface',
    dashboard: 'ntk-page--variant-dashboard',
  },
  sizes: {
    sm: 'ntk-page--size-sm',
    md: 'ntk-page--size-md',
    lg: 'ntk-page--size-lg',
  },
  intents: {
    neutral: 'ntk-page--intent-neutral',
    primary: 'ntk-page--intent-primary',
    success: 'ntk-page--intent-success',
    warning: 'ntk-page--intent-warning',
    danger: 'ntk-page--intent-danger',
    info: 'ntk-page--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkPageVariant, NtkPageSize, NtkPageIntent>

export type NtkPageRecipeOptions = NtkRecipeOptions<NtkPageVariant, NtkPageSize, NtkPageIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkPageRecipe = (options: NtkPageRecipeOptions = {}) =>
  resolveNtkRecipe(ntkPageRecipeClassMap, ntkPageDefaults, options)

export const getNtkPageClasses = (options: NtkPageRecipeOptions = {}) =>
  resolveNtkPageRecipe(options).classes

export const getNtkPageClassName = (options: NtkPageRecipeOptions = {}) =>
  resolveNtkPageRecipe(options).className