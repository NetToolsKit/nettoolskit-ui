/**
 * Ribbon contract and class recipe.
 *
 * A tabbed command surface: a `role="tablist"` of tabs with roving tabindex,
 * each revealing a row of titled command groups below. Horizontal overflow is
 * handled by scrolling so groups never overlap at compact widths. Supports
 * variant, size, intent and the shared density modes.
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
import type { NtkRibbonGroupDescriptor } from './ribbon-group'

export const ntkRibbonVariants = ['default', 'bordered'] as const
export type NtkRibbonVariant = (typeof ntkRibbonVariants)[number]
export type NtkRibbonSize = NtkComponentSize
export type NtkRibbonIntent = NtkComponentIntent

export interface NtkRibbonTab {
  readonly id: string
  readonly label: string
  readonly disabled?: boolean
  readonly groups: readonly NtkRibbonGroupDescriptor[]
}

export interface NtkRibbonContract extends NtkComponentContractBase {
  readonly tabs?: readonly NtkRibbonTab[]
  /** Active tab id (v-model:activeTab). */
  readonly activeTab?: string
  readonly ariaLabel?: string
  readonly variant?: NtkRibbonVariant
  readonly size?: NtkRibbonSize
  readonly intent?: NtkRibbonIntent
  readonly density?: NtkComponentDensity
}

export const ntkRibbonDefaults = {
  variant: 'bordered',
  size: 'md',
  intent: 'neutral',
  density: 'comfortable',
} as const satisfies Required<
  Pick<NtkRibbonContract, 'variant' | 'size' | 'intent' | 'density'>
>

export const ntkRibbonRecipeClassMap = {
  root: 'ntk-ribbon',
  variants: {
    default: 'ntk-ribbon--variant-default',
    bordered: 'ntk-ribbon--variant-bordered',
  },
  sizes: {
    sm: 'ntk-ribbon--size-sm',
    md: 'ntk-ribbon--size-md',
    lg: 'ntk-ribbon--size-lg',
  },
  intents: {
    neutral: 'ntk-ribbon--intent-neutral',
    primary: 'ntk-ribbon--intent-primary',
    success: 'ntk-ribbon--intent-success',
    warning: 'ntk-ribbon--intent-warning',
    danger: 'ntk-ribbon--intent-danger',
    info: 'ntk-ribbon--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkRibbonVariant, NtkRibbonSize, NtkRibbonIntent>

export type NtkRibbonRecipeOptions = NtkRecipeOptions<NtkRibbonVariant, NtkRibbonSize, NtkRibbonIntent>
  & {
    readonly density?: NtkComponentDensity
    readonly class?: NtkClassValue
  }

export const resolveNtkRibbonRecipe = (options: NtkRibbonRecipeOptions = {}) => {
  const density = options.density ?? ntkRibbonDefaults.density
  const base = resolveNtkRecipe(ntkRibbonRecipeClassMap, ntkRibbonDefaults, {
    variant: options.variant,
    size: options.size,
    intent: options.intent,
  })

  const classes = uniqueNtkClasses([
    ...base.classes,
    getNtkDensityClass(ntkRibbonRecipeClassMap.root, density),
    ...normalizeNtkClasses(options.class),
  ].filter((value): value is string => Boolean(value)))

  return { ...base, density, classes, className: classes.join(' ') }
}

export const getNtkRibbonClasses = (options: NtkRibbonRecipeOptions = {}) =>
  resolveNtkRibbonRecipe(options).classes

export const getNtkRibbonClassName = (options: NtkRibbonRecipeOptions = {}) =>
  resolveNtkRibbonRecipe(options).className

/**
 * Pure keyboard resolver for roving ribbon-tab focus. Mirrors the tabs helper:
 * given the ordered enabled tab ids, the active id, and a navigation key,
 * returns the next active id (skipping disabled tabs and wrapping at the ends).
 */
export const getNtkRibbonNextTabId = (
  enabledIds: readonly string[],
  activeId: string | undefined,
  key: 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End',
): string | undefined => {
  if (enabledIds.length === 0) {
    return undefined
  }

  if (key === 'Home') {
    return enabledIds[0]
  }
  if (key === 'End') {
    return enabledIds[enabledIds.length - 1]
  }

  const currentIndex = activeId === undefined ? -1 : enabledIds.indexOf(activeId)
  if (currentIndex === -1) {
    return key === 'ArrowRight' ? enabledIds[0] : enabledIds[enabledIds.length - 1]
  }

  const delta = key === 'ArrowRight' ? 1 : -1
  const nextIndex = (currentIndex + delta + enabledIds.length) % enabledIds.length
  return enabledIds[nextIndex]
}