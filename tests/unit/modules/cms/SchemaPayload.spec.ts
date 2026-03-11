/**
 * Tests/unit/modules/cms/Schema Payload spec module.
 */

import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import {
  applyCmsSchemaPackageSnapshot,
  CMS_SCHEMA_PACKAGE_KIND,
  CMS_SCHEMA_PACKAGE_VERSION,
  createCmsSchemaExportPayload,
  createCmsSchemaPackageSnapshot,
  parseCmsSchemaImportPayload,
} from '../../../../src/modules/cms/white-label/schema-payload'

describe('schema-payload', () => {
  it('creates versioned schema export payloads', () => {
    const settings = createDefaultWhiteLabelSettings()
    const payload = createCmsSchemaExportPayload({
      snapshot: createCmsSchemaPackageSnapshot(settings),
      profile: {
        id: 'tenant-alpha',
        name: 'Tenant Alpha',
      },
    })

    expect(payload.kind).toBe(CMS_SCHEMA_PACKAGE_KIND)
    expect(payload.version).toBe(CMS_SCHEMA_PACKAGE_VERSION)
    expect(payload.profile.id).toBe('tenant-alpha')
    expect(payload.snapshot.authoredContentModels).toEqual(settings.authoredContentModels)
  })

  it('parses current envelope payloads and raw compatibility snapshots', () => {
    const settings = createDefaultWhiteLabelSettings()
    const schemaSnapshot = createCmsSchemaPackageSnapshot(settings)

    const envelope = parseCmsSchemaImportPayload({
      kind: CMS_SCHEMA_PACKAGE_KIND,
      version: 1,
      exportedAt: '2026-03-11T12:00:00.000Z',
      profile: {
        id: 'tenant-alpha',
        name: 'Tenant Alpha',
      },
      snapshot: schemaSnapshot,
    }, 'tenant-alpha-schema.json')

    expect(envelope).not.toBeNull()
    expect(envelope?.profileId).toBe('tenant-alpha')
    expect(envelope?.sourceVersion).toBe(1)
    expect(envelope?.snapshot.authoredBlockPresets).toEqual(settings.authoredBlockPresets)

    const rawCompatibility = parseCmsSchemaImportPayload(schemaSnapshot, 'schema-package.json')

    expect(rawCompatibility).not.toBeNull()
    expect(rawCompatibility?.snapshot.authoredContentModels).toEqual(settings.authoredContentModels)
  })

  it('rejects unsupported versions and wrong kinds', () => {
    const settings = createDefaultWhiteLabelSettings()
    const snapshot = createCmsSchemaPackageSnapshot(settings)

    const unsupportedVersion = parseCmsSchemaImportPayload({
      kind: CMS_SCHEMA_PACKAGE_KIND,
      version: 99,
      snapshot,
    }, 'schema.json')
    expect(unsupportedVersion).toBeNull()

    const wrongKind = parseCmsSchemaImportPayload({
      kind: 'another-kind',
      version: 1,
      snapshot,
    }, 'schema.json')
    expect(wrongKind).toBeNull()
  })

  it('applies schema packages without overwriting pages, media or releases', () => {
    const settings = createDefaultWhiteLabelSettings()
    const nextSnapshot = {
      authoredContentModels: [
        {
          ...settings.authoredContentModels[0],
          id: 'authored:imported-schema',
          name: 'Imported schema',
          defaultPageTitle: 'Imported page title',
        },
      ],
      authoredContentModelFieldPresets: [],
      authoredBlockPresets: [],
    }

    const applied = applyCmsSchemaPackageSnapshot(settings, nextSnapshot)

    expect(applied.authoredContentModels).toHaveLength(1)
    expect(applied.authoredContentModels[0]?.id).toBe('authored-model:imported-schema')
    expect(applied.pages).toEqual(settings.pages)
    expect(applied.mediaAssets).toEqual(settings.mediaAssets)
    expect(applied.releases).toEqual(settings.releases)
  })
})