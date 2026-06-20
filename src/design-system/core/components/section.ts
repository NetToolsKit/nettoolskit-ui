/**
 * Section contract and class recipe.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkSectionVariants = ['default', 'surface', 'muted', 'accent'] as const
export type NtkSectionVariant = (typeof ntkSectionVariants)[number]
export type NtkSectionSize = NtkComponentSize
export type NtkSectionIntent = NtkComponentIntent
export type NtkSectionHeadingLevel = 2 | 3 | 4

export interface NtkSectionContract extends NtkComponentContractBase {
  readonly title?: string
  readonly subtitle?: string
  readonly eyebrow?: string
  readonly ariaLabel?: string
  readonly headingLevel?: NtkSectionHeadingLevel
  readonly variant?: NtkSectionVariant
  readonly size?: NtkSectionSize
  readonly intent?: NtkSectionIntent
}

export const ntkSectionDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
  headingLevel: 2,
} as const satisfies Required<Pick<NtkSectionContract, 'variant' | 'size' | 'intent' | 'headingLevel'>>

export const ntkSectionRecipeClassMap = {
  root: 'ntk-section',
  variants: {
    default: 'ntk-section--variant-default',
    surface: 'ntk-section--variant-surface',
    muted: 'ntk-section--variant-muted',
    accent: 'ntk-section--variant-accent',
  },
  sizes: {
    sm: 'ntk-section--size-sm',
    md: 'ntk-section--size-md',
    lg: 'ntk-section--size-lg',
  },
  intents: {
    neutral: 'ntk-section--intent-neutral',
    primary: 'ntk-section--intent-primary',
    success: 'ntk-section--intent-success',
    warning: 'ntk-section--intent-warning',
    danger: 'ntk-section--intent-danger',
    info: 'ntk-section--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkSectionVariant, NtkSectionSize, NtkSectionIntent>

export type NtkSectionRecipeOptions = NtkRecipeOptions<NtkSectionVariant, NtkSectionSize, NtkSectionIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkSectionRecipe = (options: NtkSectionRecipeOptions = {}) =>
  resolveNtkRecipe(ntkSectionRecipeClassMap, ntkSectionDefaults, options)

export const getNtkSectionClasses = (options: NtkSectionRecipeOptions = {}) =>
  resolveNtkSectionRecipe(options).classes

export const getNtkSectionClassName = (options: NtkSectionRecipeOptions = {}) =>
  resolveNtkSectionRecipe(options).className