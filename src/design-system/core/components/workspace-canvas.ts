/**
 * Workspace canvas contract and class recipe.
 *
 * A neutral surface for design/monitoring/diagram/editor workspaces. Provides
 * grid, dotted-grid and plain background modes (token-driven CSS gradients),
 * an optional header slot (document tabs/title) and a default content slot. It
 * does NOT force full-screen, so products can compose it inside a dock region,
 * and it implements no editor/diagram business logic.
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

export const ntkWorkspaceCanvasVariants = ['default'] as const
export type NtkWorkspaceCanvasVariant = (typeof ntkWorkspaceCanvasVariants)[number]
export type NtkWorkspaceCanvasSize = NtkComponentSize
export type NtkWorkspaceCanvasIntent = NtkComponentIntent

export const ntkWorkspaceCanvasSurfaces = ['grid', 'dots', 'plain'] as const
export type NtkWorkspaceCanvasSurface = (typeof ntkWorkspaceCanvasSurfaces)[number]

export interface NtkWorkspaceCanvasContract extends NtkComponentContractBase {
  /** Background pattern: tokenized grid, dotted grid, or plain surface. */
  readonly surface?: NtkWorkspaceCanvasSurface
  readonly ariaLabel?: string
  readonly variant?: NtkWorkspaceCanvasVariant
  readonly size?: NtkWorkspaceCanvasSize
  readonly intent?: NtkWorkspaceCanvasIntent
}

export const ntkWorkspaceCanvasDefaults = {
  variant: 'default',
  size: 'md',
  intent: 'neutral',
  surface: 'grid',
} as const satisfies Required<
  Pick<NtkWorkspaceCanvasContract, 'variant' | 'size' | 'intent' | 'surface'>
>

export const ntkWorkspaceCanvasRecipeClassMap = {
  root: 'ntk-workspace-canvas',
  variants: {
    default: 'ntk-workspace-canvas--variant-default',
  },
  sizes: {
    sm: 'ntk-workspace-canvas--size-sm',
    md: 'ntk-workspace-canvas--size-md',
    lg: 'ntk-workspace-canvas--size-lg',
  },
  intents: {
    neutral: 'ntk-workspace-canvas--intent-neutral',
    primary: 'ntk-workspace-canvas--intent-primary',
    success: 'ntk-workspace-canvas--intent-success',
    warning: 'ntk-workspace-canvas--intent-warning',
    danger: 'ntk-workspace-canvas--intent-danger',
    info: 'ntk-workspace-canvas--intent-info',
  },
} as const satisfies NtkRecipeClassMap<
  NtkWorkspaceCanvasVariant,
  NtkWorkspaceCanvasSize,
  NtkWorkspaceCanvasIntent
>

export const ntkWorkspaceCanvasSurfaceClassMap = {
  grid: 'ntk-workspace-canvas--surface-grid',
  dots: 'ntk-workspace-canvas--surface-dots',
  plain: 'ntk-workspace-canvas--surface-plain',
} as const satisfies Record<NtkWorkspaceCanvasSurface, string>

export type NtkWorkspaceCanvasRecipeOptions = NtkRecipeOptions<
  NtkWorkspaceCanvasVariant,
  NtkWorkspaceCanvasSize,
  NtkWorkspaceCanvasIntent
> & {
  readonly surface?: NtkWorkspaceCanvasSurface
  readonly class?: NtkClassValue
}

export const resolveNtkWorkspaceCanvasRecipe = (options: NtkWorkspaceCanvasRecipeOptions = {}) => {
  const surface = options.surface ?? ntkWorkspaceCanvasDefaults.surface
  const base = resolveNtkRecipe(ntkWorkspaceCanvasRecipeClassMap, ntkWorkspaceCanvasDefaults, {
    variant: options.variant,
    size: options.size,
    intent: options.intent,
  })

  const classes = uniqueNtkClasses([
    ...base.classes,
    ntkWorkspaceCanvasSurfaceClassMap[surface],
    ...normalizeNtkClasses(options.class),
  ].filter((value): value is string => Boolean(value)))

  return { ...base, surface, classes, className: classes.join(' ') }
}

export const getNtkWorkspaceCanvasClasses = (options: NtkWorkspaceCanvasRecipeOptions = {}) =>
  resolveNtkWorkspaceCanvasRecipe(options).classes

export const getNtkWorkspaceCanvasClassName = (options: NtkWorkspaceCanvasRecipeOptions = {}) =>
  resolveNtkWorkspaceCanvasRecipe(options).className