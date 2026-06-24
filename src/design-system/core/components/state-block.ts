/**
 * State block contract and class recipe.
 *
 * Renders loading / error / empty / success / skeleton placeholders with a
 * single semantic `state` axis so product code never hand-rolls these surfaces.
 */

import {
  normalizeNtkClasses,
  resolveNtkRecipe,
  uniqueNtkClasses,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkStateBlockVariants = ['default', 'inline', 'overlay'] as const
export type NtkStateBlockVariant = (typeof ntkStateBlockVariants)[number]
export type NtkStateBlockSize = NtkComponentSize
export type NtkStateBlockIntent = NtkComponentIntent

export const ntkStateBlockStates = ['loading', 'error', 'empty', 'success', 'skeleton'] as const
export type NtkStateBlockState = (typeof ntkStateBlockStates)[number]

export interface NtkStateBlockContract extends NtkComponentContractBase {
  readonly state?: NtkStateBlockState
  readonly title?: string
  readonly description?: string
  readonly icon?: string
  readonly ariaLabel?: string
  readonly variant?: NtkStateBlockVariant
  readonly size?: NtkStateBlockSize
  readonly intent?: NtkStateBlockIntent
  /** Number of skeleton lines rendered when `state` is `skeleton`. */
  readonly skeletonLines?: number
}

export const ntkStateBlockDefaults = {
  state: 'loading',
  variant: 'default',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkStateBlockContract, 'state' | 'variant' | 'size' | 'intent'>>

export const ntkStateBlockRecipeClassMap = {
  root: 'ntk-state-block',
  variants: {
    default: 'ntk-state-block--variant-default',
    inline: 'ntk-state-block--variant-inline',
    overlay: 'ntk-state-block--variant-overlay',
  },
  sizes: {
    sm: 'ntk-state-block--size-sm',
    md: 'ntk-state-block--size-md',
    lg: 'ntk-state-block--size-lg',
  },
  intents: {
    neutral: 'ntk-state-block--intent-neutral',
    primary: 'ntk-state-block--intent-primary',
    success: 'ntk-state-block--intent-success',
    warning: 'ntk-state-block--intent-warning',
    danger: 'ntk-state-block--intent-danger',
    info: 'ntk-state-block--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkStateBlockVariant, NtkStateBlockSize, NtkStateBlockIntent>

export const ntkStateBlockStateClassMap = {
  loading: 'ntk-state-block--state-loading',
  error: 'ntk-state-block--state-error',
  empty: 'ntk-state-block--state-empty',
  success: 'ntk-state-block--state-success',
  skeleton: 'ntk-state-block--state-skeleton',
} as const satisfies Record<NtkStateBlockState, string>

/** Default semantic intent for each state, used when no intent is supplied. */
export const ntkStateBlockStateIntent = {
  loading: 'neutral',
  error: 'danger',
  empty: 'neutral',
  success: 'success',
  skeleton: 'neutral',
} as const satisfies Record<NtkStateBlockState, NtkStateBlockIntent>

export type NtkStateBlockRecipeOptions = NtkRecipeOptions<NtkStateBlockVariant, NtkStateBlockSize, NtkStateBlockIntent>
  & {
    readonly state?: NtkStateBlockState
    readonly class?: NtkClassValue
  }

export const resolveNtkStateBlockRecipe = (options: NtkStateBlockRecipeOptions = {}) => {
  const state = options.state ?? ntkStateBlockDefaults.state
  const intent = options.intent ?? ntkStateBlockStateIntent[state]
  const base = resolveNtkRecipe(ntkStateBlockRecipeClassMap, ntkStateBlockDefaults, {
    variant: options.variant,
    size: options.size,
    intent,
  })

  const classes = uniqueNtkClasses([
    ...base.classes,
    ntkStateBlockStateClassMap[state],
    ...normalizeNtkClasses(options.class),
  ].filter((value): value is string => Boolean(value)))

  return { ...base, state, intent, classes, className: classes.join(' ') }
}

export const getNtkStateBlockClasses = (options: NtkStateBlockRecipeOptions = {}) =>
  resolveNtkStateBlockRecipe(options).classes

export const getNtkStateBlockClassName = (options: NtkStateBlockRecipeOptions = {}) =>
  resolveNtkStateBlockRecipe(options).className