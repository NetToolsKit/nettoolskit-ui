/**
 * Command icon contract and class recipe.
 *
 * A semantic, inline-SVG command glyph resolved from the built-in registry
 * (see `../icons/registry`). The recipe is light — a single line `variant`,
 * the shared `sm`/`md`/`lg` sizes, and the shared intent palette — but follows
 * the standard recipe shape so it participates in the core-helpers gate.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'
import type { NtkCommandIconName } from '../icons/registry'

export const ntkCommandIconVariants = ['line'] as const
export type NtkCommandIconVariant = (typeof ntkCommandIconVariants)[number]
export type NtkCommandIconSize = NtkComponentSize
export type NtkCommandIconIntent = NtkComponentIntent

export interface NtkCommandIconContract extends NtkComponentContractBase {
  /** Registry icon name. A closed union; unknown names render a fallback glyph. */
  readonly name: NtkCommandIconName
  readonly variant?: NtkCommandIconVariant
  readonly size?: NtkCommandIconSize
  readonly intent?: NtkCommandIconIntent
  /**
   * Accessible label. When omitted the icon is decorative (`aria-hidden`);
   * when present the icon exposes `role="img"` + `aria-label`.
   */
  readonly label?: string
}

export const ntkCommandIconDefaults = {
  variant: 'line',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkCommandIconContract, 'variant' | 'size' | 'intent'>>

export const ntkCommandIconRecipeClassMap = {
  root: 'ntk-command-icon',
  variants: {
    line: 'ntk-command-icon--variant-line',
  },
  sizes: {
    sm: 'ntk-command-icon--size-sm',
    md: 'ntk-command-icon--size-md',
    lg: 'ntk-command-icon--size-lg',
  },
  intents: {
    neutral: 'ntk-command-icon--intent-neutral',
    primary: 'ntk-command-icon--intent-primary',
    success: 'ntk-command-icon--intent-success',
    warning: 'ntk-command-icon--intent-warning',
    danger: 'ntk-command-icon--intent-danger',
    info: 'ntk-command-icon--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkCommandIconVariant, NtkCommandIconSize, NtkCommandIconIntent>

export type NtkCommandIconRecipeOptions =
  NtkRecipeOptions<NtkCommandIconVariant, NtkCommandIconSize, NtkCommandIconIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkCommandIconRecipe = (options: NtkCommandIconRecipeOptions = {}) =>
  resolveNtkRecipe(ntkCommandIconRecipeClassMap, ntkCommandIconDefaults, options)

export const getNtkCommandIconClasses = (options: NtkCommandIconRecipeOptions = {}) =>
  resolveNtkCommandIconRecipe(options).classes

export const getNtkCommandIconClassName = (options: NtkCommandIconRecipeOptions = {}) =>
  resolveNtkCommandIconRecipe(options).className