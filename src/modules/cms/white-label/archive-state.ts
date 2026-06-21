/**
 * Shared archive-state helpers for reusable CMS engine entities.
 * Archive keeps authored records available for existing references while hiding
 * them from new authoring flows until they are restored.
 */

/**
 * Minimal archivable shape used across reusable content and authored preset entities.
 */
export interface CmsArchivableEntity {
  archivedAt?: string | null
}

/**
 * Returns `true` when one archivable entity is currently archived.
 */
export function isCmsArchivedEntity(entity: CmsArchivableEntity | null | undefined): boolean {
  return Boolean(String(entity?.archivedAt ?? '').trim())
}

/**
 * Applies archive metadata to one entity using an ISO timestamp.
 */
export function archiveCmsEntity<T extends CmsArchivableEntity>(
  entity: T,
  archivedAt = new Date().toISOString()
): T {
  return {
    ...entity,
    archivedAt,
  }
}

/**
 * Clears archive metadata from one entity.
 */
export function unarchiveCmsEntity<T extends CmsArchivableEntity>(entity: T): T {
  return {
    ...entity,
    archivedAt: null,
  }
}