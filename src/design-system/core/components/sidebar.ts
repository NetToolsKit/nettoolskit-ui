/**
 * Sidebar (side navigation) contract and class recipe.
 *
 * Domain-neutral complementary landmark wrapping a navigation region, with an
 * optional collapsed state and header/footer slots. Replaces `NtkSidebar`.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkSidebarVariants = ['default', 'elevated', 'transparent'] as const
export type NtkSidebarVariant = (typeof ntkSidebarVariants)[number]
export type NtkSidebarSize = NtkComponentSize
export type NtkSidebarIntent = NtkComponentIntent

export interface NtkSidebarContract extends NtkComponentContractBase {
  /** Accessible label for the inner navigation landmark. */
  readonly ariaLabel?: string
  /** Apply the collapsed (rail) state. */
  readonly collapsed?: boolean
  readonly variant?: NtkSidebarVariant
  readonly size?: NtkSidebarSize
  readonly intent?: NtkSidebarIntent
}

export const ntkSidebarDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkSidebarContract, 'variant' | 'size' | 'intent'>>

export const ntkSidebarRecipeClassMap = {
  root: 'ntk-sidebar',
  variants: {
    default: 'ntk-sidebar--variant-default',
    elevated: 'ntk-sidebar--variant-elevated',
    transparent: 'ntk-sidebar--variant-transparent',
  },
  sizes: {
    sm: 'ntk-sidebar--size-sm',
    md: 'ntk-sidebar--size-md',
    lg: 'ntk-sidebar--size-lg',
  },
  intents: {
    neutral: 'ntk-sidebar--intent-neutral',
    primary: 'ntk-sidebar--intent-primary',
    success: 'ntk-sidebar--intent-success',
    warning: 'ntk-sidebar--intent-warning',
    danger: 'ntk-sidebar--intent-danger',
    info: 'ntk-sidebar--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkSidebarVariant, NtkSidebarSize, NtkSidebarIntent>

/** Class applied when the sidebar is collapsed (rail) state. */
export const ntkSidebarCollapsedClass = 'ntk-sidebar--is-collapsed'

export type NtkSidebarRecipeOptions =
  NtkRecipeOptions<NtkSidebarVariant, NtkSidebarSize, NtkSidebarIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkSidebarRecipe = (options: NtkSidebarRecipeOptions = {}) =>
  resolveNtkRecipe(ntkSidebarRecipeClassMap, ntkSidebarDefaults, options)

export const getNtkSidebarClasses = (options: NtkSidebarRecipeOptions = {}) =>
  resolveNtkSidebarRecipe(options).classes

export const getNtkSidebarClassName = (options: NtkSidebarRecipeOptions = {}) =>
  resolveNtkSidebarRecipe(options).className