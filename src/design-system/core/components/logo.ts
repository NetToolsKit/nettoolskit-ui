/**
 * Logo contract and class recipe.
 *
 * A domain-neutral brand mark: a glyph/letter tile plus an optional wordmark and
 * tagline. Colors are token-driven (no per-instance color props), replacing the
 * legacy `NtkLogo` whose colors were resolved at runtime from branding state.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent } from './contracts'

export const ntkLogoVariants = ['gradient', 'solid', 'outline'] as const
export type NtkLogoVariant = (typeof ntkLogoVariants)[number]

export const ntkLogoSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
export type NtkLogoSize = (typeof ntkLogoSizes)[number]

export type NtkLogoIntent = NtkComponentIntent

export interface NtkLogoContract extends NtkComponentContractBase {
  /** Glyph/letter rendered inside the brand mark tile. */
  readonly mark?: string
  /** Brand wordmark text. */
  readonly text?: string
  /** Secondary line under the wordmark. */
  readonly tagline?: string
  /** Show the wordmark next to the mark. */
  readonly showText?: boolean
  /** Show the tagline under the wordmark. */
  readonly showTagline?: boolean
  readonly variant?: NtkLogoVariant
  readonly size?: NtkLogoSize
  readonly intent?: NtkLogoIntent
  /** When set, the logo renders as an anchor to this href. */
  readonly href?: string
  /** Accessible label (required when the wordmark is hidden). */
  readonly ariaLabel?: string
}

export const ntkLogoDefaults = {
  variant: 'gradient',
  size: 'md',
  intent: 'primary',
} as const satisfies Required<Pick<NtkLogoContract, 'variant' | 'size' | 'intent'>>

export const ntkLogoRecipeClassMap = {
  root: 'ntk-logo',
  variants: {
    gradient: 'ntk-logo--variant-gradient',
    solid: 'ntk-logo--variant-solid',
    outline: 'ntk-logo--variant-outline',
  },
  sizes: {
    xs: 'ntk-logo--size-xs',
    sm: 'ntk-logo--size-sm',
    md: 'ntk-logo--size-md',
    lg: 'ntk-logo--size-lg',
    xl: 'ntk-logo--size-xl',
  },
  intents: {
    neutral: 'ntk-logo--intent-neutral',
    primary: 'ntk-logo--intent-primary',
    success: 'ntk-logo--intent-success',
    warning: 'ntk-logo--intent-warning',
    danger: 'ntk-logo--intent-danger',
    info: 'ntk-logo--intent-info',
  },
  states: {
    clickable: 'ntk-logo--is-clickable',
  },
} as const satisfies NtkRecipeClassMap<NtkLogoVariant, NtkLogoSize, NtkLogoIntent>

export type NtkLogoRecipeOptions = NtkRecipeOptions<NtkLogoVariant, NtkLogoSize, NtkLogoIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkLogoRecipe = (options: NtkLogoRecipeOptions = {}) =>
  resolveNtkRecipe(ntkLogoRecipeClassMap, ntkLogoDefaults, options)

export const getNtkLogoClasses = (options: NtkLogoRecipeOptions = {}) =>
  resolveNtkLogoRecipe(options).classes

export const getNtkLogoClassName = (options: NtkLogoRecipeOptions = {}) =>
  resolveNtkLogoRecipe(options).className