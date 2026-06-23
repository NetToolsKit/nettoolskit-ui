/**
 * Toolbar contract and class recipe.
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
  ntkComponentDensities,
  type NtkComponentDensity,
  type NtkComponentContractBase,
  type NtkComponentIntent,
  type NtkComponentSize,
} from './contracts'

export const ntkToolbarVariants = ['default', 'bordered', 'floating'] as const
export type NtkToolbarVariant = (typeof ntkToolbarVariants)[number]
export type NtkToolbarSize = NtkComponentSize
export type NtkToolbarIntent = NtkComponentIntent

export const ntkToolbarAligns = ['start', 'center', 'end', 'between'] as const
export type NtkToolbarAlign = (typeof ntkToolbarAligns)[number]

export interface NtkToolbarContract extends NtkComponentContractBase {
  readonly ariaLabel?: string
  readonly variant?: NtkToolbarVariant
  readonly size?: NtkToolbarSize
  readonly intent?: NtkToolbarIntent
  readonly density?: NtkComponentDensity
  readonly align?: NtkToolbarAlign
  readonly wrap?: boolean
}

export const ntkToolbarDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
  density: 'comfortable',
  align: 'start',
} as const satisfies Required<Pick<NtkToolbarContract, 'variant' | 'size' | 'intent' | 'density' | 'align'>>

export const ntkToolbarRecipeClassMap = {
  root: 'ntk-toolbar',
  variants: {
    default: 'ntk-toolbar--variant-default',
    bordered: 'ntk-toolbar--variant-bordered',
    floating: 'ntk-toolbar--variant-floating',
  },
  sizes: {
    sm: 'ntk-toolbar--size-sm',
    md: 'ntk-toolbar--size-md',
    lg: 'ntk-toolbar--size-lg',
  },
  intents: {
    neutral: 'ntk-toolbar--intent-neutral',
    primary: 'ntk-toolbar--intent-primary',
    success: 'ntk-toolbar--intent-success',
    warning: 'ntk-toolbar--intent-warning',
    danger: 'ntk-toolbar--intent-danger',
    info: 'ntk-toolbar--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkToolbarVariant, NtkToolbarSize, NtkToolbarIntent>

export const ntkToolbarDensityClassMap = {
  compact: 'ntk-toolbar--density-compact',
  comfortable: 'ntk-toolbar--density-comfortable',
  spacious: 'ntk-toolbar--density-spacious',
} as const satisfies Record<NtkComponentDensity, string>

export const ntkToolbarAlignClassMap = {
  start: 'ntk-toolbar--align-start',
  center: 'ntk-toolbar--align-center',
  end: 'ntk-toolbar--align-end',
  between: 'ntk-toolbar--align-between',
} as const satisfies Record<NtkToolbarAlign, string>

export type NtkToolbarRecipeOptions = NtkRecipeOptions<NtkToolbarVariant, NtkToolbarSize, NtkToolbarIntent>
  & {
    readonly density?: NtkComponentDensity
    readonly align?: NtkToolbarAlign
    readonly wrap?: boolean
    readonly class?: NtkClassValue
  }

export const resolveNtkToolbarRecipe = (options: NtkToolbarRecipeOptions = {}) => {
  const density = options.density ?? ntkToolbarDefaults.density
  const align = options.align ?? ntkToolbarDefaults.align
  const base = resolveNtkRecipe(ntkToolbarRecipeClassMap, ntkToolbarDefaults, {
    variant: options.variant,
    size: options.size,
    intent: options.intent,
  })

  const classes = uniqueNtkClasses([
    ...base.classes,
    ntkToolbarDensityClassMap[density],
    ntkToolbarAlignClassMap[align],
    options.wrap ? 'ntk-toolbar--is-wrap' : undefined,
    ...normalizeNtkClasses(options.class),
  ].filter((value): value is string => Boolean(value)))

  return { ...base, density, align, classes, className: classes.join(' ') }
}

export const getNtkToolbarClasses = (options: NtkToolbarRecipeOptions = {}) =>
  resolveNtkToolbarRecipe(options).classes

export const getNtkToolbarClassName = (options: NtkToolbarRecipeOptions = {}) =>
  resolveNtkToolbarRecipe(options).className