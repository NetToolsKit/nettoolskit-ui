/**
 * Empty state contract and class recipe.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkEmptyStateVariants = ['default', 'bordered', 'ghost'] as const
export type NtkEmptyStateVariant = (typeof ntkEmptyStateVariants)[number]
export type NtkEmptyStateSize = NtkComponentSize
export type NtkEmptyStateIntent = NtkComponentIntent

export interface NtkEmptyStateContract extends NtkComponentContractBase {
  readonly title?: string
  readonly description?: string
  readonly icon?: string
  readonly ariaLabel?: string
  readonly variant?: NtkEmptyStateVariant
  readonly size?: NtkEmptyStateSize
  readonly intent?: NtkEmptyStateIntent
}

export const ntkEmptyStateDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkEmptyStateContract, 'variant' | 'size' | 'intent'>>

export const ntkEmptyStateRecipeClassMap = {
  root: 'ntk-empty-state',
  variants: {
    default: 'ntk-empty-state--variant-default',
    bordered: 'ntk-empty-state--variant-bordered',
    ghost: 'ntk-empty-state--variant-ghost',
  },
  sizes: {
    sm: 'ntk-empty-state--size-sm',
    md: 'ntk-empty-state--size-md',
    lg: 'ntk-empty-state--size-lg',
  },
  intents: {
    neutral: 'ntk-empty-state--intent-neutral',
    primary: 'ntk-empty-state--intent-primary',
    success: 'ntk-empty-state--intent-success',
    warning: 'ntk-empty-state--intent-warning',
    danger: 'ntk-empty-state--intent-danger',
    info: 'ntk-empty-state--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkEmptyStateVariant, NtkEmptyStateSize, NtkEmptyStateIntent>

export type NtkEmptyStateRecipeOptions = NtkRecipeOptions<NtkEmptyStateVariant, NtkEmptyStateSize, NtkEmptyStateIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkEmptyStateRecipe = (options: NtkEmptyStateRecipeOptions = {}) =>
  resolveNtkRecipe(ntkEmptyStateRecipeClassMap, ntkEmptyStateDefaults, options)

export const getNtkEmptyStateClasses = (options: NtkEmptyStateRecipeOptions = {}) =>
  resolveNtkEmptyStateRecipe(options).classes

export const getNtkEmptyStateClassName = (options: NtkEmptyStateRecipeOptions = {}) =>
  resolveNtkEmptyStateRecipe(options).className