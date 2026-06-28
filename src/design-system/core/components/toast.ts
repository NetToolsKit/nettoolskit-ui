/**
 * Toast contract and class recipe.
 *
 * A single transient feedback message. The visual is intent-driven; lifecycle
 * (timeout/auto-dismiss) and stacking are owned by the host live region, never
 * by the toast itself. Variant is fixed to a single elevated surface treatment,
 * but the shared recipe still expects the full variant axis, so the map is
 * complete.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkToastVariants = ['solid', 'soft', 'outline', 'accent'] as const
export type NtkToastVariant = (typeof ntkToastVariants)[number]
export type NtkToastSize = NtkComponentSize
export type NtkToastIntent = NtkComponentIntent

export interface NtkToastContract extends NtkComponentContractBase {
  readonly title?: string
  readonly message?: string
  /** Decorative leading glyph (aria-hidden). */
  readonly icon?: string
  readonly variant?: NtkToastVariant
  readonly size?: NtkToastSize
  readonly intent?: NtkToastIntent
  /** Render a labelled close button that emits `dismiss`. */
  readonly dismissible?: boolean
  readonly dismissLabel?: string
}

export const ntkToastDefaults = {
  variant: 'soft',
  size: 'md',
  intent: 'info',
} as const satisfies Required<Pick<NtkToastContract, 'variant' | 'size' | 'intent'>>

export const ntkToastRecipeClassMap = {
  root: 'ntk-toast',
  variants: {
    solid: 'ntk-toast--variant-solid',
    soft: 'ntk-toast--variant-soft',
    outline: 'ntk-toast--variant-outline',
    accent: 'ntk-toast--variant-accent',
  },
  sizes: {
    sm: 'ntk-toast--size-sm',
    md: 'ntk-toast--size-md',
    lg: 'ntk-toast--size-lg',
  },
  intents: {
    neutral: 'ntk-toast--intent-neutral',
    primary: 'ntk-toast--intent-primary',
    success: 'ntk-toast--intent-success',
    warning: 'ntk-toast--intent-warning',
    danger: 'ntk-toast--intent-danger',
    info: 'ntk-toast--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkToastVariant, NtkToastSize, NtkToastIntent>

export const ntkToastPositions = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const
export type NtkToastPosition = (typeof ntkToastPositions)[number]

export const ntkToastHostPositionClassMap = {
  'top-left': 'ntk-toast-host--position-top-left',
  'top-center': 'ntk-toast-host--position-top-center',
  'top-right': 'ntk-toast-host--position-top-right',
  'bottom-left': 'ntk-toast-host--position-bottom-left',
  'bottom-center': 'ntk-toast-host--position-bottom-center',
  'bottom-right': 'ntk-toast-host--position-bottom-right',
} as const satisfies Record<NtkToastPosition, string>

export type NtkToastRecipeOptions = NtkRecipeOptions<NtkToastVariant, NtkToastSize, NtkToastIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkToastRecipe = (options: NtkToastRecipeOptions = {}) =>
  resolveNtkRecipe(ntkToastRecipeClassMap, ntkToastDefaults, options)

export const getNtkToastClasses = (options: NtkToastRecipeOptions = {}) =>
  resolveNtkToastRecipe(options).classes

export const getNtkToastClassName = (options: NtkToastRecipeOptions = {}) =>
  resolveNtkToastRecipe(options).className

/** Pure mapping of a host position to its container modifier class. */
export const getNtkToastHostPositionClass = (
  position: NtkToastPosition = 'top-right',
): string => ntkToastHostPositionClassMap[position]