/**
 * Steps (application stepper) contract and class recipe.
 *
 * A generic, accessible process stepper (multi-step forms / wizards) — not a
 * marketing "how it works" widget. Step status (complete/current/upcoming) is
 * derived purely so the renderer stays declarative.
 */

import {
  normalizeNtkClasses,
  resolveNtkRecipe,
  uniqueNtkClasses,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkStepsVariants = ['default', 'numbered', 'simple'] as const
export type NtkStepsVariant = (typeof ntkStepsVariants)[number]
export type NtkStepsSize = NtkComponentSize
export type NtkStepsIntent = NtkComponentIntent

export const ntkStepsOrientations = ['horizontal', 'vertical'] as const
export type NtkStepsOrientation = (typeof ntkStepsOrientations)[number]

export const ntkStepStatuses = ['complete', 'current', 'upcoming'] as const
export type NtkStepStatus = (typeof ntkStepStatuses)[number]

export interface NtkStepItem {
  readonly id: string
  readonly label: string
  readonly description?: string
  readonly icon?: string
}

export interface NtkStepsContract extends NtkComponentContractBase {
  readonly steps?: readonly NtkStepItem[]
  /** Zero-based index of the current step. */
  readonly current?: number
  readonly orientation?: NtkStepsOrientation
  readonly variant?: NtkStepsVariant
  readonly size?: NtkStepsSize
  readonly intent?: NtkStepsIntent
  /** Render each step as a button that emits navigation. */
  readonly clickable?: boolean
  readonly ariaLabel?: string
}

export const ntkStepsDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
  orientation: 'horizontal',
} as const satisfies Required<Pick<NtkStepsContract, 'variant' | 'size' | 'intent' | 'orientation'>>

export const ntkStepsRecipeClassMap = {
  root: 'ntk-steps',
  variants: {
    default: 'ntk-steps--variant-default',
    numbered: 'ntk-steps--variant-numbered',
    simple: 'ntk-steps--variant-simple',
  },
  sizes: {
    sm: 'ntk-steps--size-sm',
    md: 'ntk-steps--size-md',
    lg: 'ntk-steps--size-lg',
  },
  intents: {
    neutral: 'ntk-steps--intent-neutral',
    primary: 'ntk-steps--intent-primary',
    success: 'ntk-steps--intent-success',
    warning: 'ntk-steps--intent-warning',
    danger: 'ntk-steps--intent-danger',
    info: 'ntk-steps--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkStepsVariant, NtkStepsSize, NtkStepsIntent>

export const ntkStepsOrientationClassMap = {
  horizontal: 'ntk-steps--orientation-horizontal',
  vertical: 'ntk-steps--orientation-vertical',
} as const satisfies Record<NtkStepsOrientation, string>

export const ntkStepStatusClassMap = {
  complete: 'ntk-steps__item--complete',
  current: 'ntk-steps__item--current',
  upcoming: 'ntk-steps__item--upcoming',
} as const satisfies Record<NtkStepStatus, string>

/** Pure status of a step given its index and the current step index. */
export const getNtkStepStatus = (index: number, current: number): NtkStepStatus => {
  if (index < current) {
    return 'complete'
  }
  if (index === current) {
    return 'current'
  }
  return 'upcoming'
}

export type NtkStepsRecipeOptions = NtkRecipeOptions<NtkStepsVariant, NtkStepsSize, NtkStepsIntent>
  & {
    readonly orientation?: NtkStepsOrientation
    readonly class?: NtkClassValue
  }

export const resolveNtkStepsRecipe = (options: NtkStepsRecipeOptions = {}) => {
  const orientation = options.orientation ?? ntkStepsDefaults.orientation
  const base = resolveNtkRecipe(ntkStepsRecipeClassMap, ntkStepsDefaults, {
    variant: options.variant,
    size: options.size,
    intent: options.intent,
  })

  const classes = uniqueNtkClasses([
    ...base.classes,
    ntkStepsOrientationClassMap[orientation],
    ...normalizeNtkClasses(options.class),
  ].filter((value): value is string => Boolean(value)))

  return { ...base, orientation, classes, className: classes.join(' ') }
}

export const getNtkStepsClasses = (options: NtkStepsRecipeOptions = {}) =>
  resolveNtkStepsRecipe(options).classes

export const getNtkStepsClassName = (options: NtkStepsRecipeOptions = {}) =>
  resolveNtkStepsRecipe(options).className