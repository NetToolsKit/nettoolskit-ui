/**
 * Form layout contract and class recipe.
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

export const ntkFormLayoutVariants = ['stacked', 'grid', 'inline'] as const
export type NtkFormLayoutVariant = (typeof ntkFormLayoutVariants)[number]
export type NtkFormLayoutSize = NtkComponentSize
export type NtkFormLayoutIntent = NtkComponentIntent

export const ntkFormLayoutColumns = [1, 2, 3, 4] as const
export type NtkFormLayoutColumnCount = (typeof ntkFormLayoutColumns)[number]

export interface NtkFormLayoutContract extends NtkComponentContractBase {
  readonly ariaLabel?: string
  readonly variant?: NtkFormLayoutVariant
  readonly size?: NtkFormLayoutSize
  readonly intent?: NtkFormLayoutIntent
  readonly density?: NtkComponentDensity
  readonly columns?: NtkFormLayoutColumnCount
}

export const ntkFormLayoutDefaults = {
  variant: 'stacked',
  size: 'md',
  intent: 'neutral',
  density: 'comfortable',
  columns: 1,
} as const satisfies Required<Pick<NtkFormLayoutContract, 'variant' | 'size' | 'intent' | 'density' | 'columns'>>

export const ntkFormLayoutRecipeClassMap = {
  root: 'ntk-form-layout',
  variants: {
    stacked: 'ntk-form-layout--variant-stacked',
    grid: 'ntk-form-layout--variant-grid',
    inline: 'ntk-form-layout--variant-inline',
  },
  sizes: {
    sm: 'ntk-form-layout--size-sm',
    md: 'ntk-form-layout--size-md',
    lg: 'ntk-form-layout--size-lg',
  },
  intents: {
    neutral: 'ntk-form-layout--intent-neutral',
    primary: 'ntk-form-layout--intent-primary',
    success: 'ntk-form-layout--intent-success',
    warning: 'ntk-form-layout--intent-warning',
    danger: 'ntk-form-layout--intent-danger',
    info: 'ntk-form-layout--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkFormLayoutVariant, NtkFormLayoutSize, NtkFormLayoutIntent>

export const ntkFormLayoutDensityClassMap = {
  compact: 'ntk-form-layout--density-compact',
  comfortable: 'ntk-form-layout--density-comfortable',
  spacious: 'ntk-form-layout--density-spacious',
} as const satisfies Record<NtkComponentDensity, string>

export const ntkFormLayoutColumnsClassMap = {
  1: 'ntk-form-layout--cols-1',
  2: 'ntk-form-layout--cols-2',
  3: 'ntk-form-layout--cols-3',
  4: 'ntk-form-layout--cols-4',
} as const satisfies Record<NtkFormLayoutColumnCount, string>

export type NtkFormLayoutRecipeOptions = NtkRecipeOptions<NtkFormLayoutVariant, NtkFormLayoutSize, NtkFormLayoutIntent>
  & {
    readonly density?: NtkComponentDensity
    readonly columns?: NtkFormLayoutColumnCount
    readonly class?: NtkClassValue
  }

export const resolveNtkFormLayoutRecipe = (options: NtkFormLayoutRecipeOptions = {}) => {
  const density = options.density ?? ntkFormLayoutDefaults.density
  const columns = options.columns ?? ntkFormLayoutDefaults.columns
  const base = resolveNtkRecipe(ntkFormLayoutRecipeClassMap, ntkFormLayoutDefaults, {
    variant: options.variant,
    size: options.size,
    intent: options.intent,
  })

  const classes = uniqueNtkClasses([
    ...base.classes,
    ntkFormLayoutDensityClassMap[density],
    ntkFormLayoutColumnsClassMap[columns],
    ...normalizeNtkClasses(options.class),
  ].filter((value): value is string => Boolean(value)))

  return { ...base, density, columns, classes, className: classes.join(' ') }
}

export const getNtkFormLayoutClasses = (options: NtkFormLayoutRecipeOptions = {}) =>
  resolveNtkFormLayoutRecipe(options).classes

export const getNtkFormLayoutClassName = (options: NtkFormLayoutRecipeOptions = {}) =>
  resolveNtkFormLayoutRecipe(options).className