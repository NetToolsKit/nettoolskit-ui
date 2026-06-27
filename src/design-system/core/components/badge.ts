/**
 * Badge contract and class recipe.
 *
 * A small count/status indicator. Variants control fill treatment
 * (solid/soft/outline); intents map to the shared semantic palette. A `dot`
 * mode renders a text-free status marker.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkBadgeVariants = ['solid', 'soft', 'outline'] as const
export type NtkBadgeVariant = (typeof ntkBadgeVariants)[number]
export type NtkBadgeSize = NtkComponentSize
export type NtkBadgeIntent = NtkComponentIntent

export interface NtkBadgeContract extends NtkComponentContractBase {
  readonly label?: string
  readonly variant?: NtkBadgeVariant
  readonly size?: NtkBadgeSize
  readonly intent?: NtkBadgeIntent
  /** Render a text-free status dot instead of a labelled badge. */
  readonly dot?: boolean
  /** Render a small leading status dot before the label (labelled badges). */
  readonly leadingDot?: boolean
}

export const ntkBadgeDefaults = {
  variant: 'solid',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkBadgeContract, 'variant' | 'size' | 'intent'>>

export const ntkBadgeRecipeClassMap = {
  root: 'ntk-badge',
  variants: {
    solid: 'ntk-badge--variant-solid',
    soft: 'ntk-badge--variant-soft',
    outline: 'ntk-badge--variant-outline',
  },
  sizes: {
    sm: 'ntk-badge--size-sm',
    md: 'ntk-badge--size-md',
    lg: 'ntk-badge--size-lg',
  },
  intents: {
    neutral: 'ntk-badge--intent-neutral',
    primary: 'ntk-badge--intent-primary',
    success: 'ntk-badge--intent-success',
    warning: 'ntk-badge--intent-warning',
    danger: 'ntk-badge--intent-danger',
    info: 'ntk-badge--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkBadgeVariant, NtkBadgeSize, NtkBadgeIntent>

export type NtkBadgeRecipeOptions = NtkRecipeOptions<NtkBadgeVariant, NtkBadgeSize, NtkBadgeIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkBadgeRecipe = (options: NtkBadgeRecipeOptions = {}) =>
  resolveNtkRecipe(ntkBadgeRecipeClassMap, ntkBadgeDefaults, options)

export const getNtkBadgeClasses = (options: NtkBadgeRecipeOptions = {}) =>
  resolveNtkBadgeRecipe(options).classes

export const getNtkBadgeClassName = (options: NtkBadgeRecipeOptions = {}) =>
  resolveNtkBadgeRecipe(options).className