/**
 * Tests/unit/modules/cms/Deprecation State spec module.
 */
import { describe, expect, it } from 'vitest'
import {
  deprecateCmsEntity,
  isCmsDeprecatedEntity,
  undeprecateCmsEntity,
  updateCmsDeprecatedEntityNote,
  updateCmsDeprecatedEntityReplacement,
} from '../../../../src/modules/cms/white-label/deprecation-state'

describe('deprecation-state', () => {
  it('marks entities as deprecated and restores them later', () => {
    const entity = {
      id: 'entity-1',
      deprecatedAt: null,
      deprecationNote: null,
      replacementEntityId: null,
    }

    const deprecated = deprecateCmsEntity(entity, {
      deprecatedAt: '2026-03-13T18:00:00.000Z',
    })
    expect(isCmsDeprecatedEntity(deprecated)).toBe(true)
    expect(deprecated.deprecatedAt).toBe('2026-03-13T18:00:00.000Z')

    const restored = undeprecateCmsEntity(deprecated)
    expect(isCmsDeprecatedEntity(restored)).toBe(false)
    expect(restored.deprecatedAt).toBeNull()
    expect(restored.deprecationNote).toBeNull()
    expect(restored.replacementEntityId).toBeNull()
  })

  it('preserves replacement and note updates while deprecated', () => {
    const entity = deprecateCmsEntity({
      id: 'entity-2',
      deprecatedAt: null,
      deprecationNote: null,
      replacementEntityId: null,
    }, {
      deprecatedAt: '2026-03-13T18:05:00.000Z',
    })

    const withReplacement = updateCmsDeprecatedEntityReplacement(entity, 'entity-3')
    const withNote = updateCmsDeprecatedEntityNote(withReplacement, 'Use the new hero preset instead.')

    expect(withNote.replacementEntityId).toBe('entity-3')
    expect(withNote.deprecationNote).toBe('Use the new hero preset instead.')
    expect(isCmsDeprecatedEntity(withNote)).toBe(true)
  })
})