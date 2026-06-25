/**
 * Dock layout contract and class recipe.
 *
 * A split workspace with optional left/right/top/bottom regions around a center
 * (default) slot. Each present side region is separated from the center by a
 * keyboard-accessible splitter (`role="separator"` with `aria-orientation` and
 * `aria-valuenow/min/max`); Arrow keys resize the region within tokenized
 * bounds. This is a resizable + collapsible region layout, not a full drag-drop
 * docking engine.
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

export const ntkDockLayoutVariants = ['default', 'bordered'] as const
export type NtkDockLayoutVariant = (typeof ntkDockLayoutVariants)[number]
export type NtkDockLayoutSize = NtkComponentSize
export type NtkDockLayoutIntent = NtkComponentIntent

/** Side regions that can carry a resizable splitter against the center. */
export const ntkDockRegions = ['left', 'right', 'top', 'bottom'] as const
export type NtkDockRegion = (typeof ntkDockRegions)[number]

/** Orientation of a region's splitter handle. Left/right resize horizontally. */
export const getNtkDockSplitterOrientation = (
  region: NtkDockRegion,
): 'horizontal' | 'vertical' => (region === 'left' || region === 'right' ? 'vertical' : 'horizontal')

export interface NtkDockLayoutContract extends NtkComponentContractBase {
  readonly ariaLabel?: string
  readonly variant?: NtkDockLayoutVariant
  readonly size?: NtkDockLayoutSize
  readonly intent?: NtkDockLayoutIntent
  /** Initial pixel size of the left region. */
  readonly leftSize?: number
  /** Initial pixel size of the right region. */
  readonly rightSize?: number
  /** Initial pixel size of the top region. */
  readonly topSize?: number
  /** Initial pixel size of the bottom region. */
  readonly bottomSize?: number
  /** Minimum pixel size for any region. */
  readonly minSize?: number
  /** Maximum pixel size for any region. */
  readonly maxSize?: number
  /** Pixel step applied per Arrow key press. */
  readonly step?: number
}

export const ntkDockLayoutDefaults = {
  variant: 'bordered',
  size: 'md',
  intent: 'neutral',
  leftSize: 240,
  rightSize: 240,
  topSize: 160,
  bottomSize: 160,
  minSize: 120,
  maxSize: 480,
  step: 16,
} as const satisfies Required<
  Pick<
    NtkDockLayoutContract,
    | 'variant'
    | 'size'
    | 'intent'
    | 'leftSize'
    | 'rightSize'
    | 'topSize'
    | 'bottomSize'
    | 'minSize'
    | 'maxSize'
    | 'step'
  >
>

export const ntkDockLayoutRecipeClassMap = {
  root: 'ntk-dock-layout',
  variants: {
    default: 'ntk-dock-layout--variant-default',
    bordered: 'ntk-dock-layout--variant-bordered',
  },
  sizes: {
    sm: 'ntk-dock-layout--size-sm',
    md: 'ntk-dock-layout--size-md',
    lg: 'ntk-dock-layout--size-lg',
  },
  intents: {
    neutral: 'ntk-dock-layout--intent-neutral',
    primary: 'ntk-dock-layout--intent-primary',
    success: 'ntk-dock-layout--intent-success',
    warning: 'ntk-dock-layout--intent-warning',
    danger: 'ntk-dock-layout--intent-danger',
    info: 'ntk-dock-layout--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkDockLayoutVariant, NtkDockLayoutSize, NtkDockLayoutIntent>

export type NtkDockLayoutRecipeOptions = NtkRecipeOptions<
  NtkDockLayoutVariant,
  NtkDockLayoutSize,
  NtkDockLayoutIntent
> & {
  readonly class?: NtkClassValue
}

export const resolveNtkDockLayoutRecipe = (options: NtkDockLayoutRecipeOptions = {}) => {
  const base = resolveNtkRecipe(ntkDockLayoutRecipeClassMap, ntkDockLayoutDefaults, {
    variant: options.variant,
    size: options.size,
    intent: options.intent,
  })

  const classes = uniqueNtkClasses([
    ...base.classes,
    ...normalizeNtkClasses(options.class),
  ].filter((value): value is string => Boolean(value)))

  return { ...base, classes, className: classes.join(' ') }
}

export const getNtkDockLayoutClasses = (options: NtkDockLayoutRecipeOptions = {}) =>
  resolveNtkDockLayoutRecipe(options).classes

export const getNtkDockLayoutClassName = (options: NtkDockLayoutRecipeOptions = {}) =>
  resolveNtkDockLayoutRecipe(options).className

/**
 * Clamp a candidate region size into the `[min, max]` bounds. Pure and total:
 * non-finite candidates fall back to `min`, and an inverted range collapses to
 * `min`.
 */
export const clampNtkDockSize = (size: number, min: number, max: number): number => {
  if (!Number.isFinite(size)) {
    return min
  }
  if (max < min) {
    return min
  }
  if (size < min) {
    return min
  }
  if (size > max) {
    return max
  }
  return size
}

/**
 * Resolve the next region size for a keyboard resize. The growth direction of a
 * region depends on its side: ArrowRight/ArrowDown enlarge `left`/`top` and
 * shrink `right`/`bottom`, and vice versa, so the splitter always tracks the
 * visual edge. `Home`/`End` jump to the min/max. Returns `undefined` for keys
 * that are not resize keys. The result is always clamped.
 */
export const getNtkDockNextSize = (
  region: NtkDockRegion,
  current: number,
  key: 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End',
  bounds: { readonly min: number; readonly max: number; readonly step: number },
): number | undefined => {
  const { min, max, step } = bounds

  if (key === 'Home') {
    return clampNtkDockSize(min, min, max)
  }
  if (key === 'End') {
    return clampNtkDockSize(max, min, max)
  }

  // For left/top, the splitter sits after the region: forward keys grow it.
  // For right/bottom, the splitter sits before the region: forward keys shrink.
  const leadingRegion = region === 'left' || region === 'top'
  const forwardKey = key === 'ArrowRight' || key === 'ArrowDown'
  const backwardKey = key === 'ArrowLeft' || key === 'ArrowUp'

  if (!forwardKey && !backwardKey) {
    return undefined
  }

  const grow = leadingRegion ? forwardKey : backwardKey
  const delta = grow ? step : -step
  return clampNtkDockSize(current + delta, min, max)
}