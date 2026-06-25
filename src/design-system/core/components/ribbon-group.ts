/**
 * Ribbon group contract and class recipe.
 *
 * A titled cluster of ribbon commands with a label and separators. Domain-
 * neutral; the label position (`above`/`below` the commands) is a closed prop.
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
  getNtkDensityClass,
  type NtkComponentDensity,
  type NtkComponentContractBase,
  type NtkComponentIntent,
  type NtkComponentSize,
} from './contracts'
import type { NtkRibbonCommandItem } from './ribbon-command'

export const ntkRibbonGroupVariants = ['default'] as const
export type NtkRibbonGroupVariant = (typeof ntkRibbonGroupVariants)[number]
export type NtkRibbonGroupSize = NtkComponentSize
export type NtkRibbonGroupIntent = NtkComponentIntent

export const ntkRibbonGroupLabelPositions = ['above', 'below'] as const
export type NtkRibbonGroupLabelPosition = (typeof ntkRibbonGroupLabelPositions)[number]

export interface NtkRibbonGroupDescriptor {
  readonly id: string
  readonly label: string
  readonly commands: readonly NtkRibbonCommandItem[]
}

export interface NtkRibbonGroupContract extends NtkComponentContractBase {
  readonly label: string
  readonly variant?: NtkRibbonGroupVariant
  readonly size?: NtkRibbonGroupSize
  readonly intent?: NtkRibbonGroupIntent
  readonly density?: NtkComponentDensity
  readonly labelPosition?: NtkRibbonGroupLabelPosition
  /** Render a trailing separator after this group. */
  readonly separator?: boolean
}

export const ntkRibbonGroupDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
  density: 'comfortable',
  labelPosition: 'below',
} as const satisfies Required<
  Pick<NtkRibbonGroupContract, 'variant' | 'size' | 'intent' | 'density' | 'labelPosition'>
>

export const ntkRibbonGroupRecipeClassMap = {
  root: 'ntk-ribbon-group',
  variants: {
    default: 'ntk-ribbon-group--variant-default',
  },
  sizes: {
    sm: 'ntk-ribbon-group--size-sm',
    md: 'ntk-ribbon-group--size-md',
    lg: 'ntk-ribbon-group--size-lg',
  },
  intents: {
    neutral: 'ntk-ribbon-group--intent-neutral',
    primary: 'ntk-ribbon-group--intent-primary',
    success: 'ntk-ribbon-group--intent-success',
    warning: 'ntk-ribbon-group--intent-warning',
    danger: 'ntk-ribbon-group--intent-danger',
    info: 'ntk-ribbon-group--intent-info',
  },
} as const satisfies NtkRecipeClassMap<
  NtkRibbonGroupVariant,
  NtkRibbonGroupSize,
  NtkRibbonGroupIntent
>

export const ntkRibbonGroupLabelPositionClassMap = {
  above: 'ntk-ribbon-group--label-above',
  below: 'ntk-ribbon-group--label-below',
} as const satisfies Record<NtkRibbonGroupLabelPosition, string>

export type NtkRibbonGroupRecipeOptions = NtkRecipeOptions<
  NtkRibbonGroupVariant,
  NtkRibbonGroupSize,
  NtkRibbonGroupIntent
> & {
  readonly density?: NtkComponentDensity
  readonly labelPosition?: NtkRibbonGroupLabelPosition
  readonly separator?: boolean
  readonly class?: NtkClassValue
}

export const resolveNtkRibbonGroupRecipe = (options: NtkRibbonGroupRecipeOptions = {}) => {
  const density = options.density ?? ntkRibbonGroupDefaults.density
  const labelPosition = options.labelPosition ?? ntkRibbonGroupDefaults.labelPosition
  const base = resolveNtkRecipe(ntkRibbonGroupRecipeClassMap, ntkRibbonGroupDefaults, {
    variant: options.variant,
    size: options.size,
    intent: options.intent,
  })

  const classes = uniqueNtkClasses([
    ...base.classes,
    getNtkDensityClass(ntkRibbonGroupRecipeClassMap.root, density),
    ntkRibbonGroupLabelPositionClassMap[labelPosition],
    options.separator ? 'ntk-ribbon-group--has-separator' : undefined,
    ...normalizeNtkClasses(options.class),
  ].filter((value): value is string => Boolean(value)))

  return { ...base, density, labelPosition, classes, className: classes.join(' ') }
}

export const getNtkRibbonGroupClasses = (options: NtkRibbonGroupRecipeOptions = {}) =>
  resolveNtkRibbonGroupRecipe(options).classes

export const getNtkRibbonGroupClassName = (options: NtkRibbonGroupRecipeOptions = {}) =>
  resolveNtkRibbonGroupRecipe(options).className