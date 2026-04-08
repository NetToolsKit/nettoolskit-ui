/**
 * Shared deprecation helpers for reusable CMS engine entities.
 * Deprecation keeps existing references valid while steering new authoring
 * toward explicitly configured replacements.
 */
import type { CmsDeprecationMetadataSettings } from './types'

/**
 * Minimal deprecatable shape used across reusable content and authored preset entities.
 */
export interface CmsDeprecatableEntity extends CmsDeprecationMetadataSettings {}

/**
 * Returns `true` when one deprecatable entity is currently marked as deprecated.
 */
export function isCmsDeprecatedEntity(entity: CmsDeprecatableEntity | null | undefined): boolean {
  return Boolean(String(entity?.deprecatedAt ?? '').trim())
}

/**
 * Applies deprecation metadata to one entity using an ISO timestamp.
 */
export function deprecateCmsEntity<T extends CmsDeprecatableEntity>(
  entity: T,
  options: {
    deprecatedAt?: string
    deprecationNote?: string | null
    replacementEntityId?: string | null
  } = {}
): T {
  return {
    ...entity,
    deprecatedAt: String(options.deprecatedAt ?? new Date().toISOString()).trim() || new Date().toISOString(),
    deprecationNote: String(options.deprecationNote ?? entity.deprecationNote ?? '').trim() || null,
    replacementEntityId: String(options.replacementEntityId ?? entity.replacementEntityId ?? '').trim() || null,
  }
}

/**
 * Updates the replacement target for one deprecated entity while preserving the rest of its state.
 */
export function updateCmsDeprecatedEntityReplacement<T extends CmsDeprecatableEntity>(
  entity: T,
  replacementEntityId: string | null | undefined
): T {
  return {
    ...entity,
    replacementEntityId: String(replacementEntityId ?? '').trim() || null,
  }
}

/**
 * Updates the deprecation note for one deprecated entity while preserving the rest of its state.
 */
export function updateCmsDeprecatedEntityNote<T extends CmsDeprecatableEntity>(
  entity: T,
  deprecationNote: string | null | undefined
): T {
  return {
    ...entity,
    deprecationNote: String(deprecationNote ?? '').trim() || null,
  }
}

/**
 * Clears deprecation metadata from one entity.
 */
export function undeprecateCmsEntity<T extends CmsDeprecatableEntity>(entity: T): T {
  return {
    ...entity,
    deprecatedAt: null,
    deprecationNote: null,
    replacementEntityId: null,
  }
}