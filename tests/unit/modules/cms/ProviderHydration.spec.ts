/**
 * Tests for backend hydration example adapters.
 */
import { describe, expect, it, vi } from 'vitest'
import {
  createCmsAsyncEngineProvidersFromTransport,
  createCmsFetchEngineProviders,
  createCmsFetchProviderHydrationTransport,
  type CmsHydrationFetch,
  type CmsProviderHydrationDomain,
} from '../../../../src/modules/cms/white-label/provider-hydration'

describe('white-label.provider-hydration', () => {
  it('maps a generic transport into async engine providers by domain', async () => {
    const loadSnapshot = vi.fn(async (domain: CmsProviderHydrationDomain) => {
      if (domain === 'content') {
        return { branding: { appName: 'External Tenant' } }
      }
      if (domain === 'assets') {
        return { mediaAssets: [{ id: 'asset-1', name: 'Asset 1' }] }
      }
      return { releases: { activeEnvironment: 'staging' } }
    })
    const saveSnapshot = vi.fn(async () => undefined)

    const providers = createCmsAsyncEngineProvidersFromTransport({ loadSnapshot, saveSnapshot })

    const content = await providers.contentRepository?.loadContentSnapshot()
    const assets = await providers.assetRepository?.loadAssetSnapshot()
    const releases = await providers.releaseRepository?.loadReleaseSnapshot()

    expect(content).toMatchObject({ branding: { appName: 'External Tenant' } })
    expect(assets).toMatchObject({ mediaAssets: [{ id: 'asset-1', name: 'Asset 1' }] })
    expect(releases).toMatchObject({ releases: { activeEnvironment: 'staging' } })

    await providers.contentRepository?.saveContentSnapshot({ branding: { appName: 'Saved' } } as never)
    expect(saveSnapshot).toHaveBeenCalledWith('content', { branding: { appName: 'Saved' } })
  })

  it('loads and saves snapshots through fetch endpoints', async () => {
    const fetchImpl: CmsHydrationFetch = vi.fn(async (input, init) => {
      if ((init?.method ?? 'GET') === 'GET') {
        if (input.endsWith('/content')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ branding: { appName: 'HTTP Tenant' } }),
          }
        }

        return {
          ok: false,
          status: 404,
          json: async () => null,
        }
      }

      return {
        ok: true,
        status: 204,
        json: async () => null,
      }
    })

    const transport = createCmsFetchProviderHydrationTransport({
      endpoints: {
        content: 'https://api.example.com/cms/content',
        assets: 'https://api.example.com/cms/assets',
        releases: 'https://api.example.com/cms/releases',
      },
      fetchImpl,
    })

    const content = await transport.loadSnapshot<{ branding: { appName: string } }>('content')
    const assets = await transport.loadSnapshot('assets')
    await transport.saveSnapshot('releases', { releases: { activeEnvironment: 'production' } })

    expect(content).toEqual({ branding: { appName: 'HTTP Tenant' } })
    expect(assets).toBeNull()
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.example.com/cms/releases',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ releases: { activeEnvironment: 'production' } }),
      })
    )
  })

  it('creates fetch-backed async engine providers', async () => {
    const fetchImpl: CmsHydrationFetch = vi.fn(async (input) => ({
      ok: true,
      status: 200,
      json: async () => ({ domain: input }),
    }))

    const providers = createCmsFetchEngineProviders({
      endpoints: {
        content: 'https://api.example.com/content',
        assets: 'https://api.example.com/assets',
        releases: 'https://api.example.com/releases',
      },
      fetchImpl,
      saveMethod: 'POST',
      headers: {
        authorization: 'Bearer test-token',
      },
    })

    const content = await providers.contentRepository?.loadContentSnapshot()
    await providers.assetRepository?.saveAssetSnapshot({ mediaAssets: [] })

    expect(content).toEqual({ domain: 'https://api.example.com/content' })
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.example.com/assets',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ authorization: 'Bearer test-token' }),
        body: JSON.stringify({ mediaAssets: [] }),
      })
    )
  })
})