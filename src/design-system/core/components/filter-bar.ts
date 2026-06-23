/**
 * Filter bar contract and class recipe.
 */

import {
  normalizeNtkClasses,
  resolveNtkRecipe,
  uniqueNtkClasses,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import {
  type NtkComponentDensity,
  type NtkComponentContractBase,
  type NtkComponentIntent,
  type NtkComponentSize,
} from './contracts'

export const ntkFilterBarVariants = ['default', 'inline', 'stacked'] as const
export type NtkFilterBarVariant = (typeof ntkFilterBarVariants)[number]
export type NtkFilterBarSize = NtkComponentSize
export type NtkFilterBarIntent = NtkComponentIntent

export interface NtkFilterBarContract extends NtkComponentContractBase {
  readonly ariaLabel?: string
  readonly variant?: NtkFilterBarVariant
  readonly size?: NtkFilterBarSize
  readonly intent?: NtkFilterBarIntent
  readonly density?: NtkComponentDensity
  readonly loading?: boolean
  readonly applyLabel?: string
  readonly resetLabel?: string
  readonly showActions?: boolean
}

export const ntkFilterBarDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
  density: 'comfortable',
} as const satisfies Required<Pick<NtkFilterBarContract, 'variant' | 'size' | 'intent' | 'density'>>

export const ntkFilterBarRecipeClassMap = {
  root: 'ntk-filter-bar',
  variants: {
    default: 'ntk-filter-bar--variant-default',
    inline: 'ntk-filter-bar--variant-inline',
    stacked: 'ntk-filter-bar--variant-stacked',
  },
  sizes: {
    sm: 'ntk-filter-bar--size-sm',
    md: 'ntk-filter-bar--size-md',
    lg: 'ntk-filter-bar--size-lg',
  },
  intents: {
    neutral: 'ntk-filter-bar--intent-neutral',
    primary: 'ntk-filter-bar--intent-primary',
    success: 'ntk-filter-bar--intent-success',
    warning: 'ntk-filter-bar--intent-warning',
    danger: 'ntk-filter-bar--intent-danger',
    info: 'ntk-filter-bar--intent-info',
  },
  states: {
    loading: 'ntk-filter-bar--is-loading',
  },
} as const satisfies NtkRecipeClassMap<NtkFilterBarVariant, NtkFilterBarSize, NtkFilterBarIntent>

export const ntkFilterBarDensityClassMap = {
  compact: 'ntk-filter-bar--density-compact',
  comfortable: 'ntk-filter-bar--density-comfortable',
  spacious: 'ntk-filter-bar--density-spacious',
} as const satisfies Record<NtkComponentDensity, string>

export type NtkFilterBarRecipeOptions = NtkRecipeOptions<NtkFilterBarVariant, NtkFilterBarSize, NtkFilterBarIntent>
  & {
    readonly density?: NtkComponentDensity
    readonly class?: NtkClassValue
  }

export const resolveNtkFilterBarRecipe = (options: NtkFilterBarRecipeOptions = {}) => {
  const density = options.density ?? ntkFilterBarDefaults.density
  const base = resolveNtkRecipe(ntkFilterBarRecipeClassMap, ntkFilterBarDefaults, {
    variant: options.variant,
    size: options.size,
    intent: options.intent,
    loading: options.loading,
  })

  const classes = uniqueNtkClasses([
    ...base.classes,
    ntkFilterBarDensityClassMap[density],
    ...normalizeNtkClasses(options.class),
  ].filter((value): value is string => Boolean(value)))

  return { ...base, density, classes, className: classes.join(' ') }
}

export const getNtkFilterBarClasses = (options: NtkFilterBarRecipeOptions = {}) =>
  resolveNtkFilterBarRecipe(options).classes

export const getNtkFilterBarClassName = (options: NtkFilterBarRecipeOptions = {}) =>
  resolveNtkFilterBarRecipe(options).className