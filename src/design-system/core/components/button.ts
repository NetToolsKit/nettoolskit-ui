/**
 * Button contract and class recipe.
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

export const ntkButtonVariants = ['solid', 'soft', 'outline', 'ghost', 'link', 'plain'] as const
export type NtkButtonVariant = (typeof ntkButtonVariants)[number]
export type NtkButtonSize = NtkComponentSize
export type NtkButtonIntent = NtkComponentIntent
export type NtkButtonDensity = NtkComponentDensity

export interface NtkButtonContract extends NtkComponentContractBase {
  readonly label?: string
  readonly variant?: NtkButtonVariant
  readonly size?: NtkButtonSize
  readonly intent?: NtkButtonIntent
  readonly density?: NtkButtonDensity
  readonly disabled?: boolean
  readonly loading?: boolean
  readonly icon?: string
  readonly iconRight?: string
  readonly type?: 'button' | 'submit' | 'reset'
}

export const ntkButtonDefaults = {
  variant: 'solid',
  size: 'md',
  intent: 'primary',
  density: 'comfortable',
} as const satisfies Required<Pick<NtkButtonContract, 'variant' | 'size' | 'intent' | 'density'>>

export const ntkButtonRecipeClassMap = {
  root: 'ntk-button',
  variants: {
    solid: 'ntk-button--variant-solid',
    soft: 'ntk-button--variant-soft',
    outline: 'ntk-button--variant-outline',
    ghost: 'ntk-button--variant-ghost',
    link: 'ntk-button--variant-link',
    plain: 'ntk-button--variant-plain',
  },
  sizes: {
    sm: 'ntk-button--size-sm',
    md: 'ntk-button--size-md',
    lg: 'ntk-button--size-lg',
  },
  intents: {
    neutral: 'ntk-button--intent-neutral',
    primary: 'ntk-button--intent-primary',
    success: 'ntk-button--intent-success',
    warning: 'ntk-button--intent-warning',
    danger: 'ntk-button--intent-danger',
    info: 'ntk-button--intent-info',
  },
  states: {
    disabled: 'ntk-button--is-disabled',
    loading: 'ntk-button--is-loading',
  },
} as const satisfies NtkRecipeClassMap<NtkButtonVariant, NtkButtonSize, NtkButtonIntent>

export type NtkButtonRecipeOptions = NtkRecipeOptions<NtkButtonVariant, NtkButtonSize, NtkButtonIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkButtonRecipe = (options: NtkButtonRecipeOptions = {}) =>
  resolveNtkRecipe(ntkButtonRecipeClassMap, ntkButtonDefaults, options)

export const getNtkButtonClasses = (options: NtkButtonRecipeOptions = {}) =>
  resolveNtkButtonRecipe(options).classes

export const getNtkButtonClassName = (options: NtkButtonRecipeOptions = {}) =>
  resolveNtkButtonRecipe(options).className