/**
 * Dock panel contract and class recipe.
 *
 * A titled panel for a dock region: a title bar with an optional actions slot
 * and typed collapse/close affordances. When `collapsed`, the panel reduces to
 * its title bar. Stays usable at compact density without text collision via
 * the shared density modes. Variant/size/intent follow the standard recipe.
 */

import {
  normalizeNtkClasses,
  resolveNtkRecipe,
  uniqueNtkClasses,
  type NtkClassValue,
  type NtkRecipeClassMap,
  type NtkRecipeOptions,
} from './recipe'
import {
  getNtkDensityClass,
  type NtkComponentDensity,
  type NtkComponentContractBase,
  type NtkComponentIntent,
  type NtkComponentSize,
} from './contracts'

export const ntkDockPanelVariants = ['default', 'bordered'] as const
export type NtkDockPanelVariant = (typeof ntkDockPanelVariants)[number]
export type NtkDockPanelSize = NtkComponentSize
export type NtkDockPanelIntent = NtkComponentIntent

export interface NtkDockPanelContract extends NtkComponentContractBase {
  readonly title: string
  readonly variant?: NtkDockPanelVariant
  readonly size?: NtkDockPanelSize
  readonly intent?: NtkDockPanelIntent
  readonly density?: NtkComponentDensity
  /** Show a collapse toggle that emits `toggle-collapse`. */
  readonly collapsible?: boolean
  /** Show a close affordance that emits `close`. */
  readonly closable?: boolean
  /** When true, the panel renders only its title bar. */
  readonly collapsed?: boolean
}

export const ntkDockPanelDefaults = {
  variant: 'bordered',
  size: 'md',
  intent: 'neutral',
  density: 'comfortable',
} as const satisfies Required<
  Pick<NtkDockPanelContract, 'variant' | 'size' | 'intent' | 'density'>
>

export const ntkDockPanelRecipeClassMap = {
  root: 'ntk-dock-panel',
  variants: {
    default: 'ntk-dock-panel--variant-default',
    bordered: 'ntk-dock-panel--variant-bordered',
  },
  sizes: {
    sm: 'ntk-dock-panel--size-sm',
    md: 'ntk-dock-panel--size-md',
    lg: 'ntk-dock-panel--size-lg',
  },
  intents: {
    neutral: 'ntk-dock-panel--intent-neutral',
    primary: 'ntk-dock-panel--intent-primary',
    success: 'ntk-dock-panel--intent-success',
    warning: 'ntk-dock-panel--intent-warning',
    danger: 'ntk-dock-panel--intent-danger',
    info: 'ntk-dock-panel--intent-info',
  },
  states: {
    selected: 'ntk-dock-panel--is-collapsed',
  },
} as const satisfies NtkRecipeClassMap<NtkDockPanelVariant, NtkDockPanelSize, NtkDockPanelIntent>

/** Modifier applied when the panel is collapsed to its title bar. */
export const ntkDockPanelCollapsedClass = ntkDockPanelRecipeClassMap.states.selected

export type NtkDockPanelRecipeOptions = NtkRecipeOptions<
  NtkDockPanelVariant,
  NtkDockPanelSize,
  NtkDockPanelIntent
> & {
  readonly density?: NtkComponentDensity
  readonly collapsed?: boolean
  readonly class?: NtkClassValue
}

export const resolveNtkDockPanelRecipe = (options: NtkDockPanelRecipeOptions = {}) => {
  const density = options.density ?? ntkDockPanelDefaults.density
  const base = resolveNtkRecipe(ntkDockPanelRecipeClassMap, ntkDockPanelDefaults, {
    variant: options.variant,
    size: options.size,
    intent: options.intent,
  })

  const classes = uniqueNtkClasses([
    ...base.classes,
    getNtkDensityClass(ntkDockPanelRecipeClassMap.root, density),
    options.collapsed ? ntkDockPanelCollapsedClass : undefined,
    ...normalizeNtkClasses(options.class),
  ].filter((value): value is string => Boolean(value)))

  return { ...base, density, classes, className: classes.join(' ') }
}

export const getNtkDockPanelClasses = (options: NtkDockPanelRecipeOptions = {}) =>
  resolveNtkDockPanelRecipe(options).classes

export const getNtkDockPanelClassName = (options: NtkDockPanelRecipeOptions = {}) =>
  resolveNtkDockPanelRecipe(options).className