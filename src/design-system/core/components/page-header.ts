/**
 * Page header contract and class recipe.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkPageHeaderVariants = ['default', 'compact', 'hero'] as const
export type NtkPageHeaderVariant = (typeof ntkPageHeaderVariants)[number]
export type NtkPageHeaderSize = NtkComponentSize
export type NtkPageHeaderIntent = NtkComponentIntent
export type NtkPageHeaderHeadingLevel = 1 | 2 | 3

export interface NtkPageHeaderContract extends NtkComponentContractBase {
  readonly title?: string
  readonly description?: string
  readonly eyebrow?: string
  readonly ariaLabel?: string
  readonly headingLevel?: NtkPageHeaderHeadingLevel
  readonly variant?: NtkPageHeaderVariant
  readonly size?: NtkPageHeaderSize
  readonly intent?: NtkPageHeaderIntent
}

export const ntkPageHeaderDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
  headingLevel: 1,
} as const satisfies Required<Pick<NtkPageHeaderContract, 'variant' | 'size' | 'intent' | 'headingLevel'>>

export const ntkPageHeaderRecipeClassMap = {
  root: 'ntk-page-header',
  variants: {
    default: 'ntk-page-header--variant-default',
    compact: 'ntk-page-header--variant-compact',
    hero: 'ntk-page-header--variant-hero',
  },
  sizes: {
    sm: 'ntk-page-header--size-sm',
    md: 'ntk-page-header--size-md',
    lg: 'ntk-page-header--size-lg',
  },
  intents: {
    neutral: 'ntk-page-header--intent-neutral',
    primary: 'ntk-page-header--intent-primary',
    success: 'ntk-page-header--intent-success',
    warning: 'ntk-page-header--intent-warning',
    danger: 'ntk-page-header--intent-danger',
    info: 'ntk-page-header--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkPageHeaderVariant, NtkPageHeaderSize, NtkPageHeaderIntent>

export type NtkPageHeaderRecipeOptions = NtkRecipeOptions<NtkPageHeaderVariant, NtkPageHeaderSize, NtkPageHeaderIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkPageHeaderRecipe = (options: NtkPageHeaderRecipeOptions = {}) =>
  resolveNtkRecipe(ntkPageHeaderRecipeClassMap, ntkPageHeaderDefaults, options)

export const getNtkPageHeaderClasses = (options: NtkPageHeaderRecipeOptions = {}) =>
  resolveNtkPageHeaderRecipe(options).classes

export const getNtkPageHeaderClassName = (options: NtkPageHeaderRecipeOptions = {}) =>
  resolveNtkPageHeaderRecipe(options).className