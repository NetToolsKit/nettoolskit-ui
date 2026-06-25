/**
 * Breadcrumbs contract and class recipe.
 *
 * A `nav`-wrapped ordered trail. The last item is the current page
 * (`aria-current="page"`, not a link); separators are decorative.
 */

import {
  resolveNtkRecipe,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent, NtkComponentSize } from './contracts'

export const ntkBreadcrumbsVariants = ['default', 'subtle'] as const
export type NtkBreadcrumbsVariant = (typeof ntkBreadcrumbsVariants)[number]
export type NtkBreadcrumbsSize = NtkComponentSize
export type NtkBreadcrumbsIntent = NtkComponentIntent

export interface NtkBreadcrumbItem {
  readonly label: string
  readonly href?: string
}

export interface NtkBreadcrumbsContract extends NtkComponentContractBase {
  readonly items?: readonly NtkBreadcrumbItem[]
  readonly variant?: NtkBreadcrumbsVariant
  readonly size?: NtkBreadcrumbsSize
  readonly intent?: NtkBreadcrumbsIntent
  /** Decorative separator glyph rendered between items. */
  readonly separator?: string
  readonly ariaLabel?: string
}

export const ntkBreadcrumbsDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
} as const satisfies Required<Pick<NtkBreadcrumbsContract, 'variant' | 'size' | 'intent'>>

export const ntkBreadcrumbsRecipeClassMap = {
  root: 'ntk-breadcrumbs',
  variants: {
    default: 'ntk-breadcrumbs--variant-default',
    subtle: 'ntk-breadcrumbs--variant-subtle',
  },
  sizes: {
    sm: 'ntk-breadcrumbs--size-sm',
    md: 'ntk-breadcrumbs--size-md',
    lg: 'ntk-breadcrumbs--size-lg',
  },
  intents: {
    neutral: 'ntk-breadcrumbs--intent-neutral',
    primary: 'ntk-breadcrumbs--intent-primary',
    success: 'ntk-breadcrumbs--intent-success',
    warning: 'ntk-breadcrumbs--intent-warning',
    danger: 'ntk-breadcrumbs--intent-danger',
    info: 'ntk-breadcrumbs--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkBreadcrumbsVariant, NtkBreadcrumbsSize, NtkBreadcrumbsIntent>

export type NtkBreadcrumbsRecipeOptions =
  NtkRecipeOptions<NtkBreadcrumbsVariant, NtkBreadcrumbsSize, NtkBreadcrumbsIntent>
  & {
    readonly class?: NtkClassValue
  }

export const resolveNtkBreadcrumbsRecipe = (options: NtkBreadcrumbsRecipeOptions = {}) =>
  resolveNtkRecipe(ntkBreadcrumbsRecipeClassMap, ntkBreadcrumbsDefaults, options)

export const getNtkBreadcrumbsClasses = (options: NtkBreadcrumbsRecipeOptions = {}) =>
  resolveNtkBreadcrumbsRecipe(options).classes

export const getNtkBreadcrumbsClassName = (options: NtkBreadcrumbsRecipeOptions = {}) =>
  resolveNtkBreadcrumbsRecipe(options).className