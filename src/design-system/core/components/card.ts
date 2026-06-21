/**
 * Card contract and class recipe.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkCardVariants = ['default', 'outlined', 'elevated', 'accent-left', 'accent-top'] as const
export type NtkCardVariant = (typeof ntkCardVariants)[number]
export type NtkCardSize = NtkComponentSize
export type NtkCardIntent = NtkComponentIntent

export interface NtkCardContract extends NtkComponentContractBase {
  readonly title?: string
  readonly subtitle?: string
  readonly variant?: NtkCardVariant
  readonly size?: NtkCardSize
  readonly intent?: NtkCardIntent
  readonly clickable?: boolean
  readonly selected?: boolean
}

export const ntkCardDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkCardContract, 'variant' | 'size' | 'intent'>>

export const ntkCardRecipeClassMap = {
  root: 'ntk-card',
  variants: {
    default: 'ntk-card--variant-default',
    outlined: 'ntk-card--variant-outlined',
    elevated: 'ntk-card--variant-elevated',
    'accent-left': 'ntk-card--variant-accent-left',
    'accent-top': 'ntk-card--variant-accent-top',
  },
  sizes: {
    sm: 'ntk-card--size-sm',
    md: 'ntk-card--size-md',
    lg: 'ntk-card--size-lg',
  },
  intents: {
    neutral: 'ntk-card--intent-neutral',
    primary: 'ntk-card--intent-primary',
    success: 'ntk-card--intent-success',
    warning: 'ntk-card--intent-warning',
    danger: 'ntk-card--intent-danger',
    info: 'ntk-card--intent-info',
  },
  states: {
    clickable: 'ntk-card--is-clickable',
    selected: 'ntk-card--is-selected',
  },
} as const satisfies NtkRecipeClassMap<NtkCardVariant, NtkCardSize, NtkCardIntent>

export type NtkCardRecipeOptions = NtkRecipeOptions<NtkCardVariant, NtkCardSize, NtkCardIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkCardRecipe = (options: NtkCardRecipeOptions = {}) =>
  resolveNtkRecipe(ntkCardRecipeClassMap, ntkCardDefaults, options)

export const getNtkCardClasses = (options: NtkCardRecipeOptions = {}) =>
  resolveNtkCardRecipe(options).classes

export const getNtkCardClassName = (options: NtkCardRecipeOptions = {}) =>
  resolveNtkCardRecipe(options).className