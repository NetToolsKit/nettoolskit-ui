/**
 * Tooltip contract and class recipe.
 *
 * Wraps a trigger and shows descriptive text on hover/focus. The tooltip is
 * linked to its trigger via `aria-describedby`; position is a closed token set.
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

export const ntkTooltipVariants = ['solid', 'soft'] as const
export type NtkTooltipVariant = (typeof ntkTooltipVariants)[number]
export type NtkTooltipSize = NtkComponentSize
export type NtkTooltipIntent = NtkComponentIntent

export const ntkTooltipPositions = ['top', 'bottom', 'left', 'right'] as const
export type NtkTooltipPosition = (typeof ntkTooltipPositions)[number]

export interface NtkTooltipContract extends NtkComponentContractBase {
  /** Tooltip text (falls back to the `#content` slot when omitted). */
  readonly text?: string
  readonly position?: NtkTooltipPosition
  readonly variant?: NtkTooltipVariant
  readonly size?: NtkTooltipSize
  readonly intent?: NtkTooltipIntent
}

export const ntkTooltipDefaults = {
  variant: 'solid',
  size: 'md',
  intent: 'neutral',
  position: 'top',
} as const satisfies Required<Pick<NtkTooltipContract, 'variant' | 'size' | 'intent' | 'position'>>

export const ntkTooltipRecipeClassMap = {
  root: 'ntk-tooltip',
  variants: {
    solid: 'ntk-tooltip--variant-solid',
    soft: 'ntk-tooltip--variant-soft',
  },
  sizes: {
    sm: 'ntk-tooltip--size-sm',
    md: 'ntk-tooltip--size-md',
    lg: 'ntk-tooltip--size-lg',
  },
  intents: {
    neutral: 'ntk-tooltip--intent-neutral',
    primary: 'ntk-tooltip--intent-primary',
    success: 'ntk-tooltip--intent-success',
    warning: 'ntk-tooltip--intent-warning',
    danger: 'ntk-tooltip--intent-danger',
    info: 'ntk-tooltip--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkTooltipVariant, NtkTooltipSize, NtkTooltipIntent>

export const ntkTooltipPositionClassMap = {
  top: 'ntk-tooltip__bubble--position-top',
  bottom: 'ntk-tooltip__bubble--position-bottom',
  left: 'ntk-tooltip__bubble--position-left',
  right: 'ntk-tooltip__bubble--position-right',
} as const satisfies Record<NtkTooltipPosition, string>

export type NtkTooltipRecipeOptions =
  NtkRecipeOptions<NtkTooltipVariant, NtkTooltipSize, NtkTooltipIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkTooltipRecipe = (options: NtkTooltipRecipeOptions = {}) =>
  resolveNtkRecipe(ntkTooltipRecipeClassMap, ntkTooltipDefaults, options)

export const getNtkTooltipClasses = (options: NtkTooltipRecipeOptions = {}) =>
  resolveNtkTooltipRecipe(options).classes

export const getNtkTooltipClassName = (options: NtkTooltipRecipeOptions = {}) =>
  resolveNtkTooltipRecipe(options).className

/** Build the tooltip bubble class list for a given position. */
export const getNtkTooltipBubbleClasses = (
  position: NtkTooltipPosition = ntkTooltipDefaults.position,
  options: { readonly class?: NtkClassValue } = {},
): string[] =>
  uniqueNtkClasses([
    'ntk-tooltip__bubble',
    ntkTooltipPositionClassMap[position],
    ...normalizeNtkClasses(options.class),
  ])