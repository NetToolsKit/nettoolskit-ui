/**
 * Tests/unit/modules/cms/Tenant Payload spec module.
 */

import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../landing-page/cms/white-label.config'
import {
  CMS_TENANT_PROFILE_PAYLOAD_KIND,
  CMS_TENANT_PROFILE_PAYLOAD_VERSION,
  createCmsTenantExportPayload,
  parseCmsTenantImportPayload,
} from '../../../../landing-page/cms/tenant-payload'

describe('tenant-payload', () => {
  it('creates versioned export payload with kind and profile envelope', () => {
    const settings = createDefaultWhiteLabelSettings()
    const payload = createCmsTenantExportPayload({
      id: 'tenant-alpha',
      name: 'Tenant Alpha',
      settings,
    })

    expect(payload.kind).toBe(CMS_TENANT_PROFILE_PAYLOAD_KIND)
    expect(payload.version).toBe(CMS_TENANT_PROFILE_PAYLOAD_VERSION)
    expect(payload.profile.id).toBe('tenant-alpha')
    expect(payload.profile.name).toBe('Tenant Alpha')
  })

  it('parses current payload schema and legacy settings envelope formats', () => {
    const settings = createDefaultWhiteLabelSettings()
    const currentPayload = {
      kind: CMS_TENANT_PROFILE_PAYLOAD_KIND,
      version: 2,
      exportedAt: '2026-02-27T12:00:00.000Z',
      profile: {
        id: 'Tenant Alpha',
        name: 'Tenant Alpha',
        settings,
      },
    }

    const currentResult = parseCmsTenantImportPayload(currentPayload, 'tenant-alpha.json')
    expect(currentResult).not.toBeNull()
    expect(currentResult?.id).toBe('tenant-alpha')
    expect(currentResult?.name).toBe('Tenant Alpha')
    expect(currentResult?.sourceVersion).toBe(2)

    const legacyResult = parseCmsTenantImportPayload({
      id: 'legacy-id',
      name: 'Legacy Tenant',
      settings,
    }, 'legacy.json')

    expect(legacyResult).not.toBeNull()
    expect(legacyResult?.id).toBe('legacy-id')
    expect(legacyResult?.name).toBe('Legacy Tenant')
    expect(legacyResult?.sourceVersion).toBe(1)
  })

  it('rejects unsupported versions and invalid payload kinds', () => {
    const settings = createDefaultWhiteLabelSettings()

    const unsupportedVersion = parseCmsTenantImportPayload({
      kind: CMS_TENANT_PROFILE_PAYLOAD_KIND,
      version: 99,
      profile: {
        id: 'tenant',
        name: 'Tenant',
        settings,
      },
    }, 'invalid.json')
    expect(unsupportedVersion).toBeNull()

    const unsupportedKind = parseCmsTenantImportPayload({
      kind: 'another-kind',
      version: 2,
      profile: {
        id: 'tenant',
        name: 'Tenant',
        settings,
      },
    }, 'invalid-kind.json')
    expect(unsupportedKind).toBeNull()
  })
})