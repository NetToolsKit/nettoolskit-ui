/**
 * Footer contract and class recipe.
 *
 * Domain-neutral contentinfo landmark with start/default/end slots. Replaces the
 * legacy `NtkFooter`.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkFooterVariants = ['default', 'elevated', 'transparent'] as const
export type NtkFooterVariant = (typeof ntkFooterVariants)[number]
export type NtkFooterSize = NtkComponentSize
export type NtkFooterIntent = NtkComponentIntent

export interface NtkFooterContract extends NtkComponentContractBase {
  readonly variant?: NtkFooterVariant
  readonly size?: NtkFooterSize
  readonly intent?: NtkFooterIntent
}

export const ntkFooterDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkFooterContract, 'variant' | 'size' | 'intent'>>

export const ntkFooterRecipeClassMap = {
  root: 'ntk-footer',
  variants: {
    default: 'ntk-footer--variant-default',
    elevated: 'ntk-footer--variant-elevated',
    transparent: 'ntk-footer--variant-transparent',
  },
  sizes: {
    sm: 'ntk-footer--size-sm',
    md: 'ntk-footer--size-md',
    lg: 'ntk-footer--size-lg',
  },
  intents: {
    neutral: 'ntk-footer--intent-neutral',
    primary: 'ntk-footer--intent-primary',
    success: 'ntk-footer--intent-success',
    warning: 'ntk-footer--intent-warning',
    danger: 'ntk-footer--intent-danger',
    info: 'ntk-footer--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkFooterVariant, NtkFooterSize, NtkFooterIntent>

export type NtkFooterRecipeOptions =
  NtkRecipeOptions<NtkFooterVariant, NtkFooterSize, NtkFooterIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkFooterRecipe = (options: NtkFooterRecipeOptions = {}) =>
  resolveNtkRecipe(ntkFooterRecipeClassMap, ntkFooterDefaults, options)

export const getNtkFooterClasses = (options: NtkFooterRecipeOptions = {}) =>
  resolveNtkFooterRecipe(options).classes

export const getNtkFooterClassName = (options: NtkFooterRecipeOptions = {}) =>
  resolveNtkFooterRecipe(options).className