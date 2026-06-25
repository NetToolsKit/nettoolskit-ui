/**
 * Tabs contract and class recipe.
 *
 * An accessible tablist (`role="tablist"`) with roving-tabindex tabs and a
 * linked tabpanel. Variants control the visual treatment; the active tab is a
 * controlled value (v-model) so navigation stays declarative.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkTabsVariants = ['line', 'pill', 'enclosed'] as const
export type NtkTabsVariant = (typeof ntkTabsVariants)[number]
export type NtkTabsSize = NtkComponentSize
export type NtkTabsIntent = NtkComponentIntent

export interface NtkTabItem {
  readonly id: string
  readonly label: string
  readonly disabled?: boolean
}

export interface NtkTabsContract extends NtkComponentContractBase {
  readonly tabs?: readonly NtkTabItem[]
  /** Active tab id (v-model). */
  readonly modelValue?: string
  readonly variant?: NtkTabsVariant
  readonly size?: NtkTabsSize
  readonly intent?: NtkTabsIntent
  readonly ariaLabel?: string
}

export const ntkTabsDefaults = {
  variant: 'line',
  size: 'md',
  intent: 'primary',
} as const satisfies Required<Pick<NtkTabsContract, 'variant' | 'size' | 'intent'>>

export const ntkTabsRecipeClassMap = {
  root: 'ntk-tabs',
  variants: {
    line: 'ntk-tabs--variant-line',
    pill: 'ntk-tabs--variant-pill',
    enclosed: 'ntk-tabs--variant-enclosed',
  },
  sizes: {
    sm: 'ntk-tabs--size-sm',
    md: 'ntk-tabs--size-md',
    lg: 'ntk-tabs--size-lg',
  },
  intents: {
    neutral: 'ntk-tabs--intent-neutral',
    primary: 'ntk-tabs--intent-primary',
    success: 'ntk-tabs--intent-success',
    warning: 'ntk-tabs--intent-warning',
    danger: 'ntk-tabs--intent-danger',
    info: 'ntk-tabs--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkTabsVariant, NtkTabsSize, NtkTabsIntent>

export type NtkTabsRecipeOptions = NtkRecipeOptions<NtkTabsVariant, NtkTabsSize, NtkTabsIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkTabsRecipe = (options: NtkTabsRecipeOptions = {}) =>
  resolveNtkRecipe(ntkTabsRecipeClassMap, ntkTabsDefaults, options)

export const getNtkTabsClasses = (options: NtkTabsRecipeOptions = {}) =>
  resolveNtkTabsRecipe(options).classes

export const getNtkTabsClassName = (options: NtkTabsRecipeOptions = {}) =>
  resolveNtkTabsRecipe(options).className

/**
 * Pure keyboard resolver for roving tab focus. Given the ordered enabled tab
 * ids, the currently active id, and a navigation key, returns the next active
 * id (skipping disabled tabs and wrapping at the ends). Returns `undefined`
 * when the key is not a navigation key or no enabled tabs exist.
 */
export const getNtkTabsNextId = (
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
    // No (or unknown) active tab: enter the list at the nearest end.
    return key === 'ArrowRight' ? enabledIds[0] : enabledIds[enabledIds.length - 1]
  }

  const delta = key === 'ArrowRight' ? 1 : -1
  const nextIndex = (currentIndex + delta + enabledIds.length) % enabledIds.length
  return enabledIds[nextIndex]
}