/**
 * Shared component contract primitives.
 */

import type { NtkClassValue } from './recipe'

export const ntkComponentSizes = ['sm', 'md', 'lg'] as const
export type NtkComponentSize = (typeof ntkComponentSizes)[number]

export const ntkComponentIntents = [
  'neutral',
  'primary',
  'success',
  'warning',
  'danger',
  'info',
] as const
export type NtkComponentIntent = (typeof ntkComponentIntents)[number]

export const ntkComponentDensities = ['compact', 'comfortable', 'spacious'] as const
export type NtkComponentDensity = (typeof ntkComponentDensities)[number]

/**
 * Build the BEM density modifier class for a component root. Pure: maps a root
 * class plus a density token to `${root}--density-${density}`. Defaults to
 * `comfortable`, which mirrors each component's baseline spacing.
 */
export const getNtkDensityClass = (
  root: string,
  density: NtkComponentDensity = 'comfortable',
): string => `${root}--density-${density}`

export interface NtkComponentContractBase {
  readonly id?: string
  readonly testId?: string
  readonly class?: NtkClassValue
}