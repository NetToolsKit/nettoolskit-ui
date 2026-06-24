/**
 * Header (top app bar) contract and class recipe.
 *
 * Domain-neutral banner landmark with brand/title/actions slots and an optional
 * hamburger that toggles a mobile drawer. Replaces the legacy `NtkHeader`.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkHeaderVariants = ['default', 'elevated', 'transparent'] as const
export type NtkHeaderVariant = (typeof ntkHeaderVariants)[number]
export type NtkHeaderSize = NtkComponentSize
export type NtkHeaderIntent = NtkComponentIntent

export interface NtkHeaderContract extends NtkComponentContractBase {
  /** Title rendered as the default content when no default slot is provided. */
  readonly title?: string
  /** Show a hamburger button that emits `toggle-menu`. */
  readonly showMenu?: boolean
  /** Accessible label for the hamburger button. */
  readonly menuLabel?: string
  readonly variant?: NtkHeaderVariant
  readonly size?: NtkHeaderSize
  readonly intent?: NtkHeaderIntent
}

export const ntkHeaderDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkHeaderContract, 'variant' | 'size' | 'intent'>>

export const ntkHeaderRecipeClassMap = {
  root: 'ntk-header',
  variants: {
    default: 'ntk-header--variant-default',
    elevated: 'ntk-header--variant-elevated',
    transparent: 'ntk-header--variant-transparent',
  },
  sizes: {
    sm: 'ntk-header--size-sm',
    md: 'ntk-header--size-md',
    lg: 'ntk-header--size-lg',
  },
  intents: {
    neutral: 'ntk-header--intent-neutral',
    primary: 'ntk-header--intent-primary',
    success: 'ntk-header--intent-success',
    warning: 'ntk-header--intent-warning',
    danger: 'ntk-header--intent-danger',
    info: 'ntk-header--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkHeaderVariant, NtkHeaderSize, NtkHeaderIntent>

export type NtkHeaderRecipeOptions =
  NtkRecipeOptions<NtkHeaderVariant, NtkHeaderSize, NtkHeaderIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkHeaderRecipe = (options: NtkHeaderRecipeOptions = {}) =>
  resolveNtkRecipe(ntkHeaderRecipeClassMap, ntkHeaderDefaults, options)

export const getNtkHeaderClasses = (options: NtkHeaderRecipeOptions = {}) =>
  resolveNtkHeaderRecipe(options).classes

export const getNtkHeaderClassName = (options: NtkHeaderRecipeOptions = {}) =>
  resolveNtkHeaderRecipe(options).className