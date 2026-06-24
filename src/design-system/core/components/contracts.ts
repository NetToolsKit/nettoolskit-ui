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

export interface NtkComponentContractBase {
  readonly id?: string
  readonly testId?: string
  readonly class?: NtkClassValue
}