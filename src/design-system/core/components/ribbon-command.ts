/**
 * Ribbon command contract and class recipe.
 *
 * A single icon-over-label command button inside a ribbon group. Carries the
 * shared semantic `intent`, plus `selected`/`disabled` states. The icon is a
 * registry command-icon name (no arbitrary HTML).
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'
import type { NtkCommandIconName } from '../icons/registry'

export const ntkRibbonCommandVariants = ['default'] as const
export type NtkRibbonCommandVariant = (typeof ntkRibbonCommandVariants)[number]
export type NtkRibbonCommandSize = NtkComponentSize
export type NtkRibbonCommandIntent = NtkComponentIntent

export interface NtkRibbonCommandItem {
  readonly id: string
  readonly label: string
  readonly icon: NtkCommandIconName
  readonly disabled?: boolean
  readonly selected?: boolean
  readonly intent?: NtkRibbonCommandIntent
}

export interface NtkRibbonCommandContract extends NtkComponentContractBase {
  readonly label: string
  readonly icon: NtkCommandIconName
  readonly variant?: NtkRibbonCommandVariant
  readonly size?: NtkRibbonCommandSize
  readonly intent?: NtkRibbonCommandIntent
  readonly selected?: boolean
  readonly disabled?: boolean
}

export const ntkRibbonCommandDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkRibbonCommandContract, 'variant' | 'size' | 'intent'>>

export const ntkRibbonCommandRecipeClassMap = {
  root: 'ntk-ribbon-command',
  variants: {
    default: 'ntk-ribbon-command--variant-default',
  },
  sizes: {
    sm: 'ntk-ribbon-command--size-sm',
    md: 'ntk-ribbon-command--size-md',
    lg: 'ntk-ribbon-command--size-lg',
  },
  intents: {
    neutral: 'ntk-ribbon-command--intent-neutral',
    primary: 'ntk-ribbon-command--intent-primary',
    success: 'ntk-ribbon-command--intent-success',
    warning: 'ntk-ribbon-command--intent-warning',
    danger: 'ntk-ribbon-command--intent-danger',
    info: 'ntk-ribbon-command--intent-info',
  },
  states: {
    selected: 'ntk-ribbon-command--is-selected',
    disabled: 'ntk-ribbon-command--is-disabled',
  },
} as const satisfies NtkRecipeClassMap<
  NtkRibbonCommandVariant,
  NtkRibbonCommandSize,
  NtkRibbonCommandIntent
>

export type NtkRibbonCommandRecipeOptions = NtkRecipeOptions<
  NtkRibbonCommandVariant,
  NtkRibbonCommandSize,
  NtkRibbonCommandIntent
> & {
  readonly class?: NtkClassValue
}

export const resolveNtkRibbonCommandRecipe = (options: NtkRibbonCommandRecipeOptions = {}) =>
  resolveNtkRecipe(ntkRibbonCommandRecipeClassMap, ntkRibbonCommandDefaults, options)

export const getNtkRibbonCommandClasses = (options: NtkRibbonCommandRecipeOptions = {}) =>
  resolveNtkRibbonCommandRecipe(options).classes

export const getNtkRibbonCommandClassName = (options: NtkRibbonCommandRecipeOptions = {}) =>
  resolveNtkRibbonCommandRecipe(options).className