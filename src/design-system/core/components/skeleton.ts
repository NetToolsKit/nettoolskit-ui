/**
 * Skeleton contract and class recipe.
 *
 * A decorative loading placeholder. The API is intentionally closed: variant
 * selects the shape (text/block/circle) and `lines` controls multi-line text
 * placeholders. The element is `aria-hidden`; the host marks `aria-busy`.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkSkeletonVariants = ['text', 'block', 'circle'] as const
export type NtkSkeletonVariant = (typeof ntkSkeletonVariants)[number]
export type NtkSkeletonSize = NtkComponentSize
export type NtkSkeletonIntent = NtkComponentIntent

export interface NtkSkeletonContract extends NtkComponentContractBase {
  readonly variant?: NtkSkeletonVariant
  readonly size?: NtkSkeletonSize
  readonly intent?: NtkSkeletonIntent
  /** Number of lines rendered for the `text` variant. */
  readonly lines?: number
}

export const ntkSkeletonDefaults = {
  variant: 'text',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkSkeletonContract, 'variant' | 'size' | 'intent'>>

export const ntkSkeletonRecipeClassMap = {
  root: 'ntk-skeleton',
  variants: {
    text: 'ntk-skeleton--variant-text',
    block: 'ntk-skeleton--variant-block',
    circle: 'ntk-skeleton--variant-circle',
  },
  sizes: {
    sm: 'ntk-skeleton--size-sm',
    md: 'ntk-skeleton--size-md',
    lg: 'ntk-skeleton--size-lg',
  },
  intents: {
    neutral: 'ntk-skeleton--intent-neutral',
    primary: 'ntk-skeleton--intent-primary',
    success: 'ntk-skeleton--intent-success',
    warning: 'ntk-skeleton--intent-warning',
    danger: 'ntk-skeleton--intent-danger',
    info: 'ntk-skeleton--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkSkeletonVariant, NtkSkeletonSize, NtkSkeletonIntent>

export type NtkSkeletonRecipeOptions =
  NtkRecipeOptions<NtkSkeletonVariant, NtkSkeletonSize, NtkSkeletonIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkSkeletonRecipe = (options: NtkSkeletonRecipeOptions = {}) =>
  resolveNtkRecipe(ntkSkeletonRecipeClassMap, ntkSkeletonDefaults, options)

export const getNtkSkeletonClasses = (options: NtkSkeletonRecipeOptions = {}) =>
  resolveNtkSkeletonRecipe(options).classes

export const getNtkSkeletonClassName = (options: NtkSkeletonRecipeOptions = {}) =>
  resolveNtkSkeletonRecipe(options).className