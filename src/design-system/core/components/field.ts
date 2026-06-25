/**
 * Field contract and class recipe.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type {
  NtkComponentContractBase,
  NtkComponentDensity,
  NtkComponentIntent,
  NtkComponentSize,
} from './contracts'

export const ntkFieldVariants = ['outlined', 'filled', 'plain'] as const
export type NtkFieldVariant = (typeof ntkFieldVariants)[number]
export type NtkFieldSize = NtkComponentSize
export type NtkFieldIntent = NtkComponentIntent
export type NtkFieldDensity = NtkComponentDensity
export type NtkFieldValue = string | number | boolean | readonly unknown[] | Record<string, unknown> | null

export interface NtkFieldContract<TValue = NtkFieldValue> extends NtkComponentContractBase {
  readonly modelValue?: TValue
  readonly name?: string
  readonly label?: string
  readonly placeholder?: string
  readonly variant?: NtkFieldVariant
  readonly size?: NtkFieldSize
  readonly intent?: NtkFieldIntent
  readonly density?: NtkFieldDensity
  readonly disabled?: boolean
  readonly readonly?: boolean
  readonly required?: boolean
  readonly invalid?: boolean
  readonly hint?: string
  readonly errorMessage?: string
}

export const ntkFieldDefaults = {
  variant: 'outlined',
  size: 'md',
  intent: 'neutral',
  density: 'comfortable',
} as const satisfies Required<Pick<NtkFieldContract, 'variant' | 'size' | 'intent' | 'density'>>

export const ntkFieldRecipeClassMap = {
  root: 'ntk-field',
  variants: {
    outlined: 'ntk-field--variant-outlined',
    filled: 'ntk-field--variant-filled',
    plain: 'ntk-field--variant-plain',
  },
  sizes: {
    sm: 'ntk-field--size-sm',
    md: 'ntk-field--size-md',
    lg: 'ntk-field--size-lg',
  },
  intents: {
    neutral: 'ntk-field--intent-neutral',
    primary: 'ntk-field--intent-primary',
    success: 'ntk-field--intent-success',
    warning: 'ntk-field--intent-warning',
    danger: 'ntk-field--intent-danger',
    info: 'ntk-field--intent-info',
  },
  states: {
    disabled: 'ntk-field--is-disabled',
    invalid: 'ntk-field--is-invalid',
    readonly: 'ntk-field--is-readonly',
    required: 'ntk-field--is-required',
  },
} as const satisfies NtkRecipeClassMap<NtkFieldVariant, NtkFieldSize, NtkFieldIntent>

export type NtkFieldRecipeOptions = NtkRecipeOptions<NtkFieldVariant, NtkFieldSize, NtkFieldIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkFieldRecipe = (options: NtkFieldRecipeOptions = {}) =>
  resolveNtkRecipe(ntkFieldRecipeClassMap, ntkFieldDefaults, options)

export const getNtkFieldClasses = (options: NtkFieldRecipeOptions = {}) =>
  resolveNtkFieldRecipe(options).classes

export const getNtkFieldClassName = (options: NtkFieldRecipeOptions = {}) =>
  resolveNtkFieldRecipe(options).className