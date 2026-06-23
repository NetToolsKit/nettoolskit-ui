/**
 * Chip contract and class recipe.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkChipVariants = ['solid', 'soft', 'outline'] as const
export type NtkChipVariant = (typeof ntkChipVariants)[number]
export type NtkChipSize = NtkComponentSize
export type NtkChipIntent = NtkComponentIntent

export interface NtkChipContract extends NtkComponentContractBase {
  readonly label?: string
  readonly icon?: string
  readonly variant?: NtkChipVariant
  readonly size?: NtkChipSize
  readonly intent?: NtkChipIntent
  /** Render as a button and emit `click`. */
  readonly clickable?: boolean
  readonly selected?: boolean
  readonly disabled?: boolean
  /** Render a remove affordance that emits `remove`. */
  readonly removable?: boolean
  readonly removeLabel?: string
}

export const ntkChipDefaults = {
  variant: 'solid',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkChipContract, 'variant' | 'size' | 'intent'>>

export const ntkChipRecipeClassMap = {
  root: 'ntk-chip',
  variants: {
    solid: 'ntk-chip--variant-solid',
    soft: 'ntk-chip--variant-soft',
    outline: 'ntk-chip--variant-outline',
  },
  sizes: {
    sm: 'ntk-chip--size-sm',
    md: 'ntk-chip--size-md',
    lg: 'ntk-chip--size-lg',
  },
  intents: {
    neutral: 'ntk-chip--intent-neutral',
    primary: 'ntk-chip--intent-primary',
    success: 'ntk-chip--intent-success',
    warning: 'ntk-chip--intent-warning',
    danger: 'ntk-chip--intent-danger',
    info: 'ntk-chip--intent-info',
  },
  states: {
    clickable: 'ntk-chip--is-clickable',
    selected: 'ntk-chip--is-selected',
    disabled: 'ntk-chip--is-disabled',
  },
} as const satisfies NtkRecipeClassMap<NtkChipVariant, NtkChipSize, NtkChipIntent>

export type NtkChipRecipeOptions = NtkRecipeOptions<NtkChipVariant, NtkChipSize, NtkChipIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkChipRecipe = (options: NtkChipRecipeOptions = {}) =>
  resolveNtkRecipe(ntkChipRecipeClassMap, ntkChipDefaults, options)

export const getNtkChipClasses = (options: NtkChipRecipeOptions = {}) =>
  resolveNtkChipRecipe(options).classes

export const getNtkChipClassName = (options: NtkChipRecipeOptions = {}) =>
  resolveNtkChipRecipe(options).className