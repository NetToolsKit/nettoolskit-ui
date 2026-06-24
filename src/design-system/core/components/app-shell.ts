/**
 * App shell contract and class recipe.
 *
 * Domain-neutral layout scaffolding that composes a header, sidebar, main
 * region, footer, and an optional off-canvas drawer. Replaces the legacy
 * `NtkAppShell` feature shell with slot-driven, landmark-correct structure.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkAppShellVariants = ['default', 'fixed'] as const
export type NtkAppShellVariant = (typeof ntkAppShellVariants)[number]
export type NtkAppShellSize = NtkComponentSize
export type NtkAppShellIntent = NtkComponentIntent

export interface NtkAppShellContract extends NtkComponentContractBase {
  /** Open state of the optional off-canvas drawer. Use with `v-model:drawerOpen`. */
  readonly drawerOpen?: boolean
  readonly variant?: NtkAppShellVariant
  readonly size?: NtkAppShellSize
  readonly intent?: NtkAppShellIntent
}

export const ntkAppShellDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkAppShellContract, 'variant' | 'size' | 'intent'>>

export const ntkAppShellRecipeClassMap = {
  root: 'ntk-app-shell',
  variants: {
    default: 'ntk-app-shell--variant-default',
    fixed: 'ntk-app-shell--variant-fixed',
  },
  sizes: {
    sm: 'ntk-app-shell--size-sm',
    md: 'ntk-app-shell--size-md',
    lg: 'ntk-app-shell--size-lg',
  },
  intents: {
    neutral: 'ntk-app-shell--intent-neutral',
    primary: 'ntk-app-shell--intent-primary',
    success: 'ntk-app-shell--intent-success',
    warning: 'ntk-app-shell--intent-warning',
    danger: 'ntk-app-shell--intent-danger',
    info: 'ntk-app-shell--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkAppShellVariant, NtkAppShellSize, NtkAppShellIntent>

export type NtkAppShellRecipeOptions =
  NtkRecipeOptions<NtkAppShellVariant, NtkAppShellSize, NtkAppShellIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkAppShellRecipe = (options: NtkAppShellRecipeOptions = {}) =>
  resolveNtkRecipe(ntkAppShellRecipeClassMap, ntkAppShellDefaults, options)

export const getNtkAppShellClasses = (options: NtkAppShellRecipeOptions = {}) =>
  resolveNtkAppShellRecipe(options).classes

export const getNtkAppShellClassName = (options: NtkAppShellRecipeOptions = {}) =>
  resolveNtkAppShellRecipe(options).className