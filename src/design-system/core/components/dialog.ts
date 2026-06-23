/**
 * Dialog contract and class recipe.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkDialogVariants = ['default', 'sheet', 'fullscreen'] as const
export type NtkDialogVariant = (typeof ntkDialogVariants)[number]
export type NtkDialogSize = NtkComponentSize
export type NtkDialogIntent = NtkComponentIntent

export interface NtkDialogContract extends NtkComponentContractBase {
  /** Open state. Use with `v-model`. */
  readonly modelValue?: boolean
  readonly title?: string
  readonly description?: string
  readonly ariaLabel?: string
  readonly variant?: NtkDialogVariant
  readonly size?: NtkDialogSize
  readonly intent?: NtkDialogIntent
  /** Block close on backdrop click / Escape. */
  readonly persistent?: boolean
  readonly closeLabel?: string
  readonly hideClose?: boolean
}

export const ntkDialogDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkDialogContract, 'variant' | 'size' | 'intent'>>

export const ntkDialogRecipeClassMap = {
  root: 'ntk-dialog',
  variants: {
    default: 'ntk-dialog--variant-default',
    sheet: 'ntk-dialog--variant-sheet',
    fullscreen: 'ntk-dialog--variant-fullscreen',
  },
  sizes: {
    sm: 'ntk-dialog--size-sm',
    md: 'ntk-dialog--size-md',
    lg: 'ntk-dialog--size-lg',
  },
  intents: {
    neutral: 'ntk-dialog--intent-neutral',
    primary: 'ntk-dialog--intent-primary',
    success: 'ntk-dialog--intent-success',
    warning: 'ntk-dialog--intent-warning',
    danger: 'ntk-dialog--intent-danger',
    info: 'ntk-dialog--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkDialogVariant, NtkDialogSize, NtkDialogIntent>

export type NtkDialogRecipeOptions = NtkRecipeOptions<NtkDialogVariant, NtkDialogSize, NtkDialogIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkDialogRecipe = (options: NtkDialogRecipeOptions = {}) =>
  resolveNtkRecipe(ntkDialogRecipeClassMap, ntkDialogDefaults, options)

export const getNtkDialogClasses = (options: NtkDialogRecipeOptions = {}) =>
  resolveNtkDialogRecipe(options).classes

export const getNtkDialogClassName = (options: NtkDialogRecipeOptions = {}) =>
  resolveNtkDialogRecipe(options).className