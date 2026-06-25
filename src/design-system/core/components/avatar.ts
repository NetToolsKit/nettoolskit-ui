/**
 * Avatar contract and class recipe.
 *
 * Renders an image, initials (derived from `name`), or an icon fallback. An
 * optional status dot maps to the semantic palette. Shapes are circle/square;
 * sizes extend the shared scale with `xl`.
 */

import {
  normalizeNtkClasses,
  resolveNtkRecipe,
  uniqueNtkClasses,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import type { NtkComponentContractBase, NtkComponentIntent } from './contracts'

export const ntkAvatarVariants = ['solid', 'soft', 'outline'] as const
export type NtkAvatarVariant = (typeof ntkAvatarVariants)[number]

export const ntkAvatarSizes = ['sm', 'md', 'lg', 'xl'] as const
export type NtkAvatarSize = (typeof ntkAvatarSizes)[number]

export type NtkAvatarIntent = NtkComponentIntent

export const ntkAvatarShapes = ['circle', 'square'] as const
export type NtkAvatarShape = (typeof ntkAvatarShapes)[number]

export const ntkAvatarStatuses = ['online', 'offline', 'busy'] as const
export type NtkAvatarStatus = (typeof ntkAvatarStatuses)[number]

export interface NtkAvatarContract extends NtkComponentContractBase {
  /** Display name used to derive initials and the accessible label. */
  readonly name?: string
  /** Image source; when present it takes precedence over initials/icon. */
  readonly src?: string
  /** Icon glyph rendered when no image or name is available. */
  readonly icon?: string
  readonly variant?: NtkAvatarVariant
  readonly size?: NtkAvatarSize
  readonly intent?: NtkAvatarIntent
  readonly shape?: NtkAvatarShape
  /** Optional presence indicator. */
  readonly status?: NtkAvatarStatus
}

export const ntkAvatarDefaults = {
  variant: 'soft',
  size: 'md',
  intent: 'neutral',
  shape: 'circle',
} as const satisfies Required<Pick<NtkAvatarContract, 'variant' | 'size' | 'intent' | 'shape'>>

export const ntkAvatarRecipeClassMap = {
  root: 'ntk-avatar',
  variants: {
    solid: 'ntk-avatar--variant-solid',
    soft: 'ntk-avatar--variant-soft',
    outline: 'ntk-avatar--variant-outline',
  },
  sizes: {
    sm: 'ntk-avatar--size-sm',
    md: 'ntk-avatar--size-md',
    lg: 'ntk-avatar--size-lg',
    xl: 'ntk-avatar--size-xl',
  },
  intents: {
    neutral: 'ntk-avatar--intent-neutral',
    primary: 'ntk-avatar--intent-primary',
    success: 'ntk-avatar--intent-success',
    warning: 'ntk-avatar--intent-warning',
    danger: 'ntk-avatar--intent-danger',
    info: 'ntk-avatar--intent-info',
  },
} as const satisfies NtkRecipeClassMap<NtkAvatarVariant, NtkAvatarSize, NtkAvatarIntent>

export const ntkAvatarShapeClassMap = {
  circle: 'ntk-avatar--shape-circle',
  square: 'ntk-avatar--shape-square',
} as const satisfies Record<NtkAvatarShape, string>

export const ntkAvatarStatusClassMap = {
  online: 'ntk-avatar__status--online',
  offline: 'ntk-avatar__status--offline',
  busy: 'ntk-avatar__status--busy',
} as const satisfies Record<NtkAvatarStatus, string>

export type NtkAvatarRecipeOptions =
  NtkRecipeOptions<NtkAvatarVariant, NtkAvatarSize, NtkAvatarIntent>
  & {
    readonly shape?: NtkAvatarShape
    readonly class?: NtkClassValue
  }

export const resolveNtkAvatarRecipe = (options: NtkAvatarRecipeOptions = {}) => {
  const shape = options.shape ?? ntkAvatarDefaults.shape
  const base = resolveNtkRecipe(ntkAvatarRecipeClassMap, ntkAvatarDefaults, {
    variant: options.variant,
    size: options.size,
    intent: options.intent,
  })

  const classes = uniqueNtkClasses([
    ...base.classes,
    ntkAvatarShapeClassMap[shape],
    ...normalizeNtkClasses(options.class),
  ])

  return { ...base, shape, classes, className: classes.join(' ') }
}

export const getNtkAvatarClasses = (options: NtkAvatarRecipeOptions = {}) =>
  resolveNtkAvatarRecipe(options).classes

export const getNtkAvatarClassName = (options: NtkAvatarRecipeOptions = {}) =>
  resolveNtkAvatarRecipe(options).className

/**
 * Pure derivation of up to two uppercase initials from a display name. Returns
 * an empty string for blank input so the renderer can fall back to an icon.
 */
export const getNtkAvatarInitials = (name: string | undefined): string => {
  if (!name) {
    return ''
  }

  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return ''
  }

  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : ''
  return `${first}${last}`.toUpperCase()
}