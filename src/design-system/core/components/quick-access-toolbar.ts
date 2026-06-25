/**
 * Quick access toolbar contract and class recipe.
 *
 * A compact, icon-only command row (`role="toolbar"`) for save/open/run/help
 * style actions. Items are typed command descriptors (no arbitrary HTML/icon
 * strings); icons resolve through the built-in command-icon registry. The
 * recipe supports variant, size, intent and the shared density modes.
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

export const ntkQuickAccessToolbarVariants = ['default', 'bordered', 'floating'] as const
export type NtkQuickAccessToolbarVariant = (typeof ntkQuickAccessToolbarVariants)[number]
export type NtkQuickAccessToolbarSize = NtkComponentSize
export type NtkQuickAccessToolbarIntent = NtkComponentIntent

export interface NtkQuickAccessItem {
  readonly id: string
  /** Accessible name for the icon-only button. Required. */
  readonly label: string
  /** Registry command-icon name. */
  readonly icon: NtkCommandIconName
  readonly disabled?: boolean
  /** Toggled state: reflected as `aria-pressed`. */
  readonly selected?: boolean
  readonly intent?: NtkQuickAccessToolbarIntent
}

export interface NtkQuickAccessToolbarContract extends NtkComponentContractBase {
  readonly items?: readonly NtkQuickAccessItem[]
  readonly ariaLabel?: string
  readonly variant?: NtkQuickAccessToolbarVariant
  readonly size?: NtkQuickAccessToolbarSize
  readonly intent?: NtkQuickAccessToolbarIntent
  readonly density?: NtkComponentDensity
}

export const ntkQuickAccessToolbarDefaults = {
  variant: 'bordered',
  size: 'md',
  intent: 'neutral',
  density: 'comfortable',
} as const satisfies Required<
  Pick<NtkQuickAccessToolbarContract, 'variant' | 'size' | 'intent' | 'density'>
>

export const ntkQuickAccessToolbarRecipeClassMap = {
  root: 'ntk-quick-access-toolbar',
  variants: {
    default: 'ntk-quick-access-toolbar--variant-default',
    bordered: 'ntk-quick-access-toolbar--variant-bordered',
    floating: 'ntk-quick-access-toolbar--variant-floating',
  },
  sizes: {
    sm: 'ntk-quick-access-toolbar--size-sm',
    md: 'ntk-quick-access-toolbar--size-md',
    lg: 'ntk-quick-access-toolbar--size-lg',
  },
  intents: {
    neutral: 'ntk-quick-access-toolbar--intent-neutral',
    primary: 'ntk-quick-access-toolbar--intent-primary',
    success: 'ntk-quick-access-toolbar--intent-success',
    warning: 'ntk-quick-access-toolbar--intent-warning',
    danger: 'ntk-quick-access-toolbar--intent-danger',
    info: 'ntk-quick-access-toolbar--intent-info',
  },
} as const satisfies NtkRecipeClassMap<
  NtkQuickAccessToolbarVariant,
  NtkQuickAccessToolbarSize,
  NtkQuickAccessToolbarIntent
>

export type NtkQuickAccessToolbarRecipeOptions = NtkRecipeOptions<
  NtkQuickAccessToolbarVariant,
  NtkQuickAccessToolbarSize,
  NtkQuickAccessToolbarIntent
> & {
  readonly density?: NtkComponentDensity
  readonly class?: NtkClassValue
}

export const resolveNtkQuickAccessToolbarRecipe = (
  options: NtkQuickAccessToolbarRecipeOptions = {},
) => {
  const density = options.density ?? ntkQuickAccessToolbarDefaults.density
  const base = resolveNtkRecipe(ntkQuickAccessToolbarRecipeClassMap, ntkQuickAccessToolbarDefaults, {
    variant: options.variant,
    size: options.size,
    intent: options.intent,
  })

  const classes = uniqueNtkClasses([
    ...base.classes,
    getNtkDensityClass(ntkQuickAccessToolbarRecipeClassMap.root, density),
    ...normalizeNtkClasses(options.class),
  ].filter((value): value is string => Boolean(value)))

  return { ...base, density, classes, className: classes.join(' ') }
}

export const getNtkQuickAccessToolbarClasses = (
  options: NtkQuickAccessToolbarRecipeOptions = {},
) => resolveNtkQuickAccessToolbarRecipe(options).classes

export const getNtkQuickAccessToolbarClassName = (
  options: NtkQuickAccessToolbarRecipeOptions = {},
) => resolveNtkQuickAccessToolbarRecipe(options).className

/**
 * Pure keyboard resolver for roving toolbar focus. Given the ordered enabled
 * item ids, the currently focused id, and a navigation key, returns the next
 * focusable id (wrapping at the ends). Returns `undefined` when the key is not a
 * navigation key or no enabled items exist.
 */
export const getNtkQuickAccessNextId = (
  enabledIds: readonly string[],
  currentId: string | undefined,
  key: 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End',
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

  const forward = key === 'ArrowRight' || key === 'ArrowDown'
  const currentIndex = currentId === undefined ? -1 : enabledIds.indexOf(currentId)
  if (currentIndex === -1) {
    return forward ? enabledIds[0] : enabledIds[enabledIds.length - 1]
  }

  const delta = forward ? 1 : -1
  const nextIndex = (currentIndex + delta + enabledIds.length) % enabledIds.length
  return enabledIds[nextIndex]
}