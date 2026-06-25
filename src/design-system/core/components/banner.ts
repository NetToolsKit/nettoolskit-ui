/**
 * Banner contract and class recipe.
 *
 * An inline, persistent feedback message (not transient like a toast). Variants
 * control the fill treatment (solid/soft/outline); intents map to the shared
 * semantic palette. Size is fixed to `md` for a single inline rhythm — the
 * shared recipe still expects the full size axis, so the map is complete.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkBannerVariants = ['solid', 'soft', 'outline'] as const
export type NtkBannerVariant = (typeof ntkBannerVariants)[number]
export type NtkBannerSize = NtkComponentSize
export type NtkBannerIntent = NtkComponentIntent

export interface NtkBannerContract extends NtkComponentContractBase {
  readonly title?: string
  readonly message?: string
  /** Decorative leading glyph (aria-hidden). */
  readonly icon?: string
  readonly variant?: NtkBannerVariant
  readonly size?: NtkBannerSize
  readonly intent?: NtkBannerIntent
  /** Render a labelled close button that emits `dismiss`. */
  readonly dismissible?: boolean
  readonly dismissLabel?: string
}

export const ntkBannerDefaults = {
  variant: 'soft',
  size: 'md',
  intent: 'info',
} as const satisfies Required<Pick<NtkBannerContract, 'variant' | 'size' | 'intent'>>

export const ntkBannerRecipeClassMap = {
  root: 'ntk-banner',
  variants: {
    solid: 'ntk-banner--variant-solid',
    soft: 'ntk-banner--variant-soft',
    outline: 'ntk-banner--variant-outline',
  },
  sizes: {
    sm: 'ntk-banner--size-sm',
    md: 'ntk-banner--size-md',
    lg: 'ntk-banner--size-lg',
  },
  intents: {
    neutral: 'ntk-banner--intent-neutral',
    primary: 'ntk-banner--intent-primary',
    success: 'ntk-banner--intent-success',
    warning: 'ntk-banner--intent-warning',
    danger: 'ntk-banner--intent-danger',
    info: 'ntk-banner--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkBannerVariant, NtkBannerSize, NtkBannerIntent>

export type NtkBannerRecipeOptions = NtkRecipeOptions<NtkBannerVariant, NtkBannerSize, NtkBannerIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkBannerRecipe = (options: NtkBannerRecipeOptions = {}) =>
  resolveNtkRecipe(ntkBannerRecipeClassMap, ntkBannerDefaults, options)

export const getNtkBannerClasses = (options: NtkBannerRecipeOptions = {}) =>
  resolveNtkBannerRecipe(options).classes

export const getNtkBannerClassName = (options: NtkBannerRecipeOptions = {}) =>
  resolveNtkBannerRecipe(options).className

/**
 * Map an intent to the appropriate ARIA live role. High-urgency intents
 * (`danger`/`warning`) assert immediately via `alert`; everything else is a
 * polite `status`. Pure so both the renderer and adapters agree.
 */
export const getNtkBannerRole = (intent: NtkBannerIntent = ntkBannerDefaults.intent): 'alert' | 'status' =>
  intent === 'danger' || intent === 'warning' ? 'alert' : 'status'