/**
 * Tree explorer contract and class recipe.
 *
 * An accessible project/tree explorer. Renders ARIA tree semantics
 * (`role="tree"` / `treeitem` / `group`) with `aria-expanded`, `aria-selected`,
 * `aria-level` and roving tabindex. Keyboard: Up/Down move, Right expands or
 * steps into children, Left collapses or steps out, Enter/Space selects. Long
 * labels truncate with a `title` rather than clipping silently. Icons (node +
 * the expand chevron) resolve through the built-in command-icon registry.
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
import type { NtkCommandIconName } from '../icons/registry'

export const ntkTreeExplorerVariants = ['default', 'bordered'] as const
export type NtkTreeExplorerVariant = (typeof ntkTreeExplorerVariants)[number]
export type NtkTreeExplorerSize = NtkComponentSize
export type NtkTreeExplorerIntent = NtkComponentIntent

export interface NtkTreeNode {
  readonly id: string
  readonly label: string
  /** Optional registry command-icon name rendered before the label. */
  readonly icon?: NtkCommandIconName
  readonly children?: readonly NtkTreeNode[]
  readonly expanded?: boolean
  readonly selected?: boolean
  readonly disabled?: boolean
}

export interface NtkTreeExplorerContract extends NtkComponentContractBase {
  readonly nodes?: readonly NtkTreeNode[]
  /** Accessible name for the tree. */
  readonly ariaLabel?: string
  readonly variant?: NtkTreeExplorerVariant
  readonly size?: NtkTreeExplorerSize
  readonly intent?: NtkTreeExplorerIntent
  readonly density?: NtkComponentDensity
}

export const ntkTreeExplorerDefaults = {
  variant: 'bordered',
  size: 'md',
  intent: 'neutral',
  density: 'comfortable',
} as const satisfies Required<
  Pick<NtkTreeExplorerContract, 'variant' | 'size' | 'intent' | 'density'>
>

export const ntkTreeExplorerRecipeClassMap = {
  root: 'ntk-tree-explorer',
  variants: {
    default: 'ntk-tree-explorer--variant-default',
    bordered: 'ntk-tree-explorer--variant-bordered',
  },
  sizes: {
    sm: 'ntk-tree-explorer--size-sm',
    md: 'ntk-tree-explorer--size-md',
    lg: 'ntk-tree-explorer--size-lg',
  },
  intents: {
    neutral: 'ntk-tree-explorer--intent-neutral',
    primary: 'ntk-tree-explorer--intent-primary',
    success: 'ntk-tree-explorer--intent-success',
    warning: 'ntk-tree-explorer--intent-warning',
    danger: 'ntk-tree-explorer--intent-danger',
    info: 'ntk-tree-explorer--intent-info',
  },
} as const satisfies NtkRecipeClassMap<
  NtkTreeExplorerVariant,
  NtkTreeExplorerSize,
  NtkTreeExplorerIntent
>

export type NtkTreeExplorerRecipeOptions = NtkRecipeOptions<
  NtkTreeExplorerVariant,
  NtkTreeExplorerSize,
  NtkTreeExplorerIntent
> & {
  readonly density?: NtkComponentDensity
  readonly class?: NtkClassValue
}

export const resolveNtkTreeExplorerRecipe = (options: NtkTreeExplorerRecipeOptions = {}) => {
  const density = options.density ?? ntkTreeExplorerDefaults.density
  const base = resolveNtkRecipe(ntkTreeExplorerRecipeClassMap, ntkTreeExplorerDefaults, {
    variant: options.variant,
    size: options.size,
    intent: options.intent,
  })

  const classes = uniqueNtkClasses([
    ...base.classes,
    getNtkDensityClass(ntkTreeExplorerRecipeClassMap.root, density),
    ...normalizeNtkClasses(options.class),
  ].filter((value): value is string => Boolean(value)))

  return { ...base, density, classes, className: classes.join(' ') }
}

export const getNtkTreeExplorerClasses = (options: NtkTreeExplorerRecipeOptions = {}) =>
  resolveNtkTreeExplorerRecipe(options).classes

export const getNtkTreeExplorerClassName = (options: NtkTreeExplorerRecipeOptions = {}) =>
  resolveNtkTreeExplorerRecipe(options).className

/** A node projected to its visible (expanded-aware) position in the tree. */
export interface NtkTreeVisibleNode {
  readonly node: NtkTreeNode
  /** 1-based ARIA level. */
  readonly level: number
  readonly hasChildren: boolean
  readonly expanded: boolean
  readonly parentId: string | undefined
}

const nodeHasChildren = (node: NtkTreeNode): boolean =>
  Array.isArray(node.children) && node.children.length > 0

/**
 * Flatten the tree into the ordered list of currently-visible rows, honoring
 * each node's `expanded` flag (collapsed subtrees are skipped). Pure. The order
 * matches the rendered roving-tabindex order for Up/Down navigation.
 */
export const getNtkTreeVisibleNodes = (
  nodes: readonly NtkTreeNode[] = [],
): NtkTreeVisibleNode[] => {
  const visible: NtkTreeVisibleNode[] = []

  const walk = (
    list: readonly NtkTreeNode[],
    level: number,
    parentId: string | undefined,
  ): void => {
    for (const node of list) {
      const hasChildren = nodeHasChildren(node)
      const expanded = hasChildren && node.expanded === true
      visible.push({ node, level, hasChildren, expanded, parentId })
      if (expanded) {
        walk(node.children ?? [], level + 1, node.id)
      }
    }
  }

  walk(nodes, 1, undefined)
  return visible
}

export type NtkTreeNavigationKey =
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Home'
  | 'End'

/** The intent a navigation key resolves to against the visible node set. */
export interface NtkTreeFocusResult {
  /** The node id that should receive focus next (may equal the current id). */
  readonly focusId: string
  /** When set, the node should be expanded/collapsed by the caller. */
  readonly expand?: boolean
  readonly collapse?: boolean
}

const firstFocusableIndex = (visible: readonly NtkTreeVisibleNode[]): number =>
  visible.findIndex((entry) => !entry.node.disabled)

const lastFocusableIndex = (visible: readonly NtkTreeVisibleNode[]): number => {
  for (let index = visible.length - 1; index >= 0; index -= 1) {
    if (!visible[index].node.disabled) {
      return index
    }
  }
  return -1
}

const nextFocusableIndex = (
  visible: readonly NtkTreeVisibleNode[],
  from: number,
  delta: number,
): number => {
  let index = from + delta
  while (index >= 0 && index < visible.length) {
    if (!visible[index].node.disabled) {
      return index
    }
    index += delta
  }
  return -1
}

/**
 * Pure keyboard resolver for the tree. Given the visible node list, the current
 * focus id and a navigation key, returns the next focus id plus an optional
 * expand/collapse intent the caller applies to its node state:
 *
 * - Up/Down: move to the previous/next focusable visible row.
 * - Right on a collapsed parent: expand it; on an expanded parent: move into
 *   the first child.
 * - Left on an expanded parent: collapse it; otherwise move to the parent row.
 * - Home/End: jump to the first/last focusable row.
 *
 * Returns `undefined` when the key is not a navigation key or there is nothing
 * actionable (empty tree, or a move that has no target).
 */
export const getNtkTreeNextFocus = (
  visible: readonly NtkTreeVisibleNode[],
  currentId: string | undefined,
  key: NtkTreeNavigationKey,
): NtkTreeFocusResult | undefined => {
  if (visible.length === 0) {
    return undefined
  }

  if (key === 'Home') {
    const index = firstFocusableIndex(visible)
    return index === -1 ? undefined : { focusId: visible[index].node.id }
  }
  if (key === 'End') {
    const index = lastFocusableIndex(visible)
    return index === -1 ? undefined : { focusId: visible[index].node.id }
  }

  const currentIndex = currentId === undefined
    ? -1
    : visible.findIndex((entry) => entry.node.id === currentId)

  if (key === 'ArrowDown') {
    const from = currentIndex === -1 ? -1 : currentIndex
    const index = nextFocusableIndex(visible, from, 1)
    return index === -1 ? undefined : { focusId: visible[index].node.id }
  }

  if (key === 'ArrowUp') {
    const from = currentIndex === -1 ? visible.length : currentIndex
    const index = nextFocusableIndex(visible, from, -1)
    return index === -1 ? undefined : { focusId: visible[index].node.id }
  }

  // Right/Left need a known current row to act on.
  if (currentIndex === -1) {
    return undefined
  }
  const entry = visible[currentIndex]

  if (key === 'ArrowRight') {
    if (entry.hasChildren && !entry.expanded) {
      return { focusId: entry.node.id, expand: true }
    }
    if (entry.hasChildren && entry.expanded) {
      const index = nextFocusableIndex(visible, currentIndex, 1)
      // Only step in if the next visible row is actually a child of this node.
      if (index !== -1 && visible[index].parentId === entry.node.id) {
        return { focusId: visible[index].node.id }
      }
    }
    return undefined
  }

  // ArrowLeft.
  if (entry.hasChildren && entry.expanded) {
    return { focusId: entry.node.id, collapse: true }
  }
  if (entry.parentId !== undefined) {
    return { focusId: entry.parentId }
  }
  return undefined
}