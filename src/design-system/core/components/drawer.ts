/**
 * Drawer (off-canvas navigation) contract and class recipe.
 *
 * Domain-neutral side panel built on the native `<dialog>` modal pattern (focus
 * trap + inert background) with a `<nav>` landmark inside. Replaces the legacy
 * `NtkMobileDrawer`.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkDrawerVariants = ['default', 'elevated'] as const
export type NtkDrawerVariant = (typeof ntkDrawerVariants)[number]
export type NtkDrawerSize = NtkComponentSize
export type NtkDrawerIntent = NtkComponentIntent

export const ntkDrawerSides = ['left', 'right'] as const
export type NtkDrawerSide = (typeof ntkDrawerSides)[number]

export interface NtkDrawerContract extends NtkComponentContractBase {
  /** Open state. Use with `v-model`. */
  readonly modelValue?: boolean
  /** Edge the panel slides in from. */
  readonly side?: NtkDrawerSide
  readonly title?: string
  /** Accessible label for the dialog when no `title` is given. */
  readonly ariaLabel?: string
  /** Accessible label for the inner navigation landmark. */
  readonly navLabel?: string
  /** Block close on backdrop click / Escape. */
  readonly persistent?: boolean
  readonly closeLabel?: string
  readonly hideClose?: boolean
  readonly variant?: NtkDrawerVariant
  readonly size?: NtkDrawerSize
  readonly intent?: NtkDrawerIntent
}

export const ntkDrawerDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkDrawerContract, 'variant' | 'size' | 'intent'>>

export const ntkDrawerRecipeClassMap = {
  root: 'ntk-drawer',
  variants: {
    default: 'ntk-drawer--variant-default',
    elevated: 'ntk-drawer--variant-elevated',
  },
  sizes: {
    sm: 'ntk-drawer--size-sm',
    md: 'ntk-drawer--size-md',
    lg: 'ntk-drawer--size-lg',
  },
  intents: {
    neutral: 'ntk-drawer--intent-neutral',
    primary: 'ntk-drawer--intent-primary',
    success: 'ntk-drawer--intent-success',
    warning: 'ntk-drawer--intent-warning',
    danger: 'ntk-drawer--intent-danger',
    info: 'ntk-drawer--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkDrawerVariant, NtkDrawerSize, NtkDrawerIntent>

/** Class applied for the side the panel docks to. */
export const ntkDrawerSideClassMap = {
  left: 'ntk-drawer--side-left',
  right: 'ntk-drawer--side-right',
} as const satisfies Record<NtkDrawerSide, string>

export type NtkDrawerRecipeOptions =
  NtkRecipeOptions<NtkDrawerVariant, NtkDrawerSize, NtkDrawerIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkDrawerRecipe = (options: NtkDrawerRecipeOptions = {}) =>
  resolveNtkRecipe(ntkDrawerRecipeClassMap, ntkDrawerDefaults, options)

export const getNtkDrawerClasses = (options: NtkDrawerRecipeOptions = {}) =>
  resolveNtkDrawerRecipe(options).classes

export const getNtkDrawerClassName = (options: NtkDrawerRecipeOptions = {}) =>
  resolveNtkDrawerRecipe(options).className