/**
 * Tests/unit/modules/cms/Archive State spec module.
 */
import { describe, expect, it } from 'vitest'
import {
  archiveCmsEntity,
  isCmsArchivedEntity,
  unarchiveCmsEntity,
} from '../../../../src/modules/cms/white-label/archive-state'

describe('archive-state', () => {
  it('marks entities as archived and restores them later', () => {
    const entity = {
      id: 'entity-1',
      archivedAt: null,
    }

    const archived = archiveCmsEntity(entity, '2026-03-11T12:00:00.000Z')
    expect(isCmsArchivedEntity(archived)).toBe(true)
    expect(archived.archivedAt).toBe('2026-03-11T12:00:00.000Z')

    const restored = unarchiveCmsEntity(archived)
    expect(isCmsArchivedEntity(restored)).toBe(false)
    expect(restored.archivedAt).toBeNull()
  })

  it('treats blank archive metadata as active and keeps archive transitions explicit', () => {
    const entity = {
      id: 'entity-2',
      archivedAt: '   ',
    }

    expect(isCmsArchivedEntity(entity)).toBe(false)

    const archived = archiveCmsEntity(entity, '2026-03-11T13:00:00.000Z')
    expect(isCmsArchivedEntity(archived)).toBe(true)
    expect(archived.archivedAt).toBe('2026-03-11T13:00:00.000Z')

    const restored = unarchiveCmsEntity(archived)
    expect(restored.archivedAt).toBeNull()
    expect(isCmsArchivedEntity(restored)).toBe(false)
  })
})