/**
 * Tests/unit/modules/cms/Domain Payload spec module.
 */

import { describe, expect, it } from 'vitest'
import { createDefaultWhiteLabelSettings } from '../../../../src/modules/cms/white-label/config'
import {
  CMS_DOMAIN_PAYLOAD_KIND,
  CMS_DOMAIN_PAYLOAD_VERSION,
  createCmsDomainExportPayload,
  parseCmsDomainImportPayload,
} from '../../../../src/modules/cms/white-label/domain-payload'
import {
  createCmsAssetRepositorySnapshot,
  createCmsContentRepositorySnapshot,
  createCmsReleaseRepositorySnapshot,
} from '../../../../src/modules/cms/white-label/providers'

describe('domain-payload', () => {
  it('creates versioned export payloads for each repository domain', () => {
    const settings = createDefaultWhiteLabelSettings()
    const contentPayload = createCmsDomainExportPayload({
      domain: 'content',
      snapshot: createCmsContentRepositorySnapshot(settings),
      profile: {
        id: 'tenant-alpha',
        name: 'Tenant Alpha',
      },
    })

    expect(contentPayload.kind).toBe(CMS_DOMAIN_PAYLOAD_KIND)
    expect(contentPayload.version).toBe(CMS_DOMAIN_PAYLOAD_VERSION)
    expect(contentPayload.domain).toBe('content')
    expect(contentPayload.profile.id).toBe('tenant-alpha')
    expect(contentPayload.snapshot.branding.appName).toBe(settings.branding.appName)
  })

  it('parses current envelope payloads and raw compatibility snapshots', () => {
    const settings = createDefaultWhiteLabelSettings()
    const assetSnapshot = createCmsAssetRepositorySnapshot(settings)
    const releaseSnapshot = createCmsReleaseRepositorySnapshot(settings)

    const envelope = parseCmsDomainImportPayload({
      kind: CMS_DOMAIN_PAYLOAD_KIND,
      version: 1,
      exportedAt: '2026-03-10T20:00:00.000Z',
      profile: {
        id: 'tenant-alpha',
        name: 'Tenant Alpha',
      },
      domain: 'assets',
      snapshot: assetSnapshot,
    }, 'tenant-alpha-assets.json')

    expect(envelope).not.toBeNull()
    expect(envelope?.domain).toBe('assets')
    expect(envelope?.profileId).toBe('tenant-alpha')
    expect(envelope?.sourceVersion).toBe(1)

    const rawCompatibility = parseCmsDomainImportPayload(
      releaseSnapshot,
      'releases.json',
      'releases'
    )

    expect(rawCompatibility).not.toBeNull()
    expect(rawCompatibility?.domain).toBe('releases')
    expect(rawCompatibility?.snapshot.releases.activeEnvironment).toBe(settings.releases.activeEnvironment)
  })

  it('rejects unsupported versions, wrong kinds and mismatched expected domains', () => {
    const settings = createDefaultWhiteLabelSettings()
    const contentSnapshot = createCmsContentRepositorySnapshot(settings)

    const unsupportedVersion = parseCmsDomainImportPayload({
      kind: CMS_DOMAIN_PAYLOAD_KIND,
      version: 99,
      domain: 'content',
      snapshot: contentSnapshot,
    }, 'content.json')
    expect(unsupportedVersion).toBeNull()

    const wrongKind = parseCmsDomainImportPayload({
      kind: 'another-kind',
      version: 1,
      domain: 'content',
      snapshot: contentSnapshot,
    }, 'content.json')
    expect(wrongKind).toBeNull()

    const wrongExpectedDomain = parseCmsDomainImportPayload({
      kind: CMS_DOMAIN_PAYLOAD_KIND,
      version: 1,
      domain: 'content',
      snapshot: contentSnapshot,
    }, 'content.json', 'assets')
    expect(wrongExpectedDomain).toBeNull()
  })
})