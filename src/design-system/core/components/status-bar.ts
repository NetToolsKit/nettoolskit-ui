/**
 * Status bar contract and class recipe.
 *
 * A dense, single-row status surface (`role="status"`) for coordinates, counts,
 * mode indicators and environment state. Segments are typed descriptors (no
 * arbitrary HTML); optional icons resolve through the built-in command-icon
 * registry. Long values truncate with a `title` rather than clipping silently.
 * Supports variant, size, intent and the shared density modes.
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
import type { NtkCommandIconName } from '../icons/registry'

export const ntkStatusBarVariants = ['default', 'bordered'] as const
export type NtkStatusBarVariant = (typeof ntkStatusBarVariants)[number]
export type NtkStatusBarSize = NtkComponentSize
export type NtkStatusBarIntent = NtkComponentIntent

export interface NtkStatusBarSegment {
  readonly id: string
  /** Optional registry command-icon name rendered before the text. */
  readonly icon?: NtkCommandIconName
  /** Static label (e.g. "Zoom"). */
  readonly label?: string
  /** Dynamic value (e.g. "120%"). Truncates with a title when long. */
  readonly value?: string
  /** Per-segment semantic color. */
  readonly intent?: NtkStatusBarIntent
  /** Full text exposed via `title`/tooltip when the value is truncated. */
  readonly tooltip?: string
}

export interface NtkStatusBarContract extends NtkComponentContractBase {
  readonly segments?: readonly NtkStatusBarSegment[]
  readonly ariaLabel?: string
  readonly variant?: NtkStatusBarVariant
  readonly size?: NtkStatusBarSize
  readonly intent?: NtkStatusBarIntent
  readonly density?: NtkComponentDensity
}

export const ntkStatusBarDefaults = {
  variant: 'bordered',
  size: 'md',
  intent: 'neutral',
  density: 'comfortable',
} as const satisfies Required<
  Pick<NtkStatusBarContract, 'variant' | 'size' | 'intent' | 'density'>
>

export const ntkStatusBarRecipeClassMap = {
  root: 'ntk-status-bar',
  variants: {
    default: 'ntk-status-bar--variant-default',
    bordered: 'ntk-status-bar--variant-bordered',
  },
  sizes: {
    sm: 'ntk-status-bar--size-sm',
    md: 'ntk-status-bar--size-md',
    lg: 'ntk-status-bar--size-lg',
  },
  intents: {
    neutral: 'ntk-status-bar--intent-neutral',
    primary: 'ntk-status-bar--intent-primary',
    success: 'ntk-status-bar--intent-success',
    warning: 'ntk-status-bar--intent-warning',
    danger: 'ntk-status-bar--intent-danger',
    info: 'ntk-status-bar--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkStatusBarVariant, NtkStatusBarSize, NtkStatusBarIntent>

export type NtkStatusBarRecipeOptions = NtkRecipeOptions<
  NtkStatusBarVariant,
  NtkStatusBarSize,
  NtkStatusBarIntent
> & {
  readonly density?: NtkComponentDensity
  readonly class?: NtkClassValue
}

export const resolveNtkStatusBarRecipe = (options: NtkStatusBarRecipeOptions = {}) => {
  const density = options.density ?? ntkStatusBarDefaults.density
  const base = resolveNtkRecipe(ntkStatusBarRecipeClassMap, ntkStatusBarDefaults, {
    variant: options.variant,
    size: options.size,
    intent: options.intent,
  })

  const classes = uniqueNtkClasses([
    ...base.classes,
    getNtkDensityClass(ntkStatusBarRecipeClassMap.root, density),
    ...normalizeNtkClasses(options.class),
  ].filter((value): value is string => Boolean(value)))

  return { ...base, density, classes, className: classes.join(' ') }
}

export const getNtkStatusBarClasses = (options: NtkStatusBarRecipeOptions = {}) =>
  resolveNtkStatusBarRecipe(options).classes

export const getNtkStatusBarClassName = (options: NtkStatusBarRecipeOptions = {}) =>
  resolveNtkStatusBarRecipe(options).className

/**
 * Resolve the accessible/tooltip text for a status segment. Prefers an explicit
 * `tooltip`; otherwise composes the visible label and value so screen readers
 * and the truncation `title` always carry the full content. Returns `undefined`
 * when the segment has no textual content at all.
 */
export const getNtkStatusSegmentTitle = (segment: NtkStatusBarSegment): string | undefined => {
  if (segment.tooltip) {
    return segment.tooltip
  }
  const parts = [segment.label, segment.value].filter((part): part is string => Boolean(part))
  return parts.length > 0 ? parts.join(': ') : undefined
}