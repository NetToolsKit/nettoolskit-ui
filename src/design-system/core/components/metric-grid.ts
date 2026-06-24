/**
 * Metric grid contract and class recipe.
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

export const ntkMetricGridVariants = ['default', 'bordered', 'plain'] as const
export type NtkMetricGridVariant = (typeof ntkMetricGridVariants)[number]
export type NtkMetricGridSize = NtkComponentSize
export type NtkMetricGridIntent = NtkComponentIntent

export const ntkMetricGridColumns = ['auto', 2, 3, 4] as const
export type NtkMetricGridColumnCount = (typeof ntkMetricGridColumns)[number]

export type NtkMetricDeltaDirection = 'up' | 'down' | 'flat'

export interface NtkMetricItem {
  readonly id: string
  readonly label: string
  readonly value: string | number
  readonly caption?: string
  readonly icon?: string
  readonly intent?: NtkComponentIntent
  readonly delta?: string
  readonly deltaDirection?: NtkMetricDeltaDirection
}

export interface NtkMetricGridContract extends NtkComponentContractBase {
  readonly ariaLabel?: string
  readonly metrics?: readonly NtkMetricItem[]
  readonly variant?: NtkMetricGridVariant
  readonly size?: NtkMetricGridSize
  readonly intent?: NtkMetricGridIntent
  readonly density?: NtkComponentDensity
  readonly columns?: NtkMetricGridColumnCount
}

export const ntkMetricGridDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
  density: 'comfortable',
  columns: 'auto',
} as const satisfies Required<Pick<NtkMetricGridContract, 'variant' | 'size' | 'intent' | 'density' | 'columns'>>

export const ntkMetricGridRecipeClassMap = {
  root: 'ntk-metric-grid',
  variants: {
    default: 'ntk-metric-grid--variant-default',
    bordered: 'ntk-metric-grid--variant-bordered',
    plain: 'ntk-metric-grid--variant-plain',
  },
  sizes: {
    sm: 'ntk-metric-grid--size-sm',
    md: 'ntk-metric-grid--size-md',
    lg: 'ntk-metric-grid--size-lg',
  },
  intents: {
    neutral: 'ntk-metric-grid--intent-neutral',
    primary: 'ntk-metric-grid--intent-primary',
    success: 'ntk-metric-grid--intent-success',
    warning: 'ntk-metric-grid--intent-warning',
    danger: 'ntk-metric-grid--intent-danger',
    info: 'ntk-metric-grid--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkMetricGridVariant, NtkMetricGridSize, NtkMetricGridIntent>

export const ntkMetricGridDensityClassMap = {
  compact: 'ntk-metric-grid--density-compact',
  comfortable: 'ntk-metric-grid--density-comfortable',
  spacious: 'ntk-metric-grid--density-spacious',
} as const satisfies Record<NtkComponentDensity, string>

export const ntkMetricGridColumnsClassMap = {
  auto: 'ntk-metric-grid--cols-auto',
  2: 'ntk-metric-grid--cols-2',
  3: 'ntk-metric-grid--cols-3',
  4: 'ntk-metric-grid--cols-4',
} as const satisfies Record<NtkMetricGridColumnCount, string>

export type NtkMetricGridRecipeOptions = NtkRecipeOptions<NtkMetricGridVariant, NtkMetricGridSize, NtkMetricGridIntent>
  & {
    readonly density?: NtkComponentDensity
    readonly columns?: NtkMetricGridColumnCount
    readonly class?: NtkClassValue
  }

export const resolveNtkMetricGridRecipe = (options: NtkMetricGridRecipeOptions = {}) => {
  const density = options.density ?? ntkMetricGridDefaults.density
  const columns = options.columns ?? ntkMetricGridDefaults.columns
  const base = resolveNtkRecipe(ntkMetricGridRecipeClassMap, ntkMetricGridDefaults, {
    variant: options.variant,
    size: options.size,
    intent: options.intent,
  })

  const classes = uniqueNtkClasses([
    ...base.classes,
    ntkMetricGridDensityClassMap[density],
    ntkMetricGridColumnsClassMap[columns],
    ...normalizeNtkClasses(options.class),
  ].filter((value): value is string => Boolean(value)))

  return { ...base, density, columns, classes, className: classes.join(' ') }
}

export const getNtkMetricGridClasses = (options: NtkMetricGridRecipeOptions = {}) =>
  resolveNtkMetricGridRecipe(options).classes

export const getNtkMetricGridClassName = (options: NtkMetricGridRecipeOptions = {}) =>
  resolveNtkMetricGridRecipe(options).className