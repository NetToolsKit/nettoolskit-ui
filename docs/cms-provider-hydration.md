# CMS Provider Hydration Examples

This note documents the smallest supported path for plugging the CMS engine into an external backend **without changing authoring flows**.

## Goal

Keep the engine boundary stable:

`Quasar -> NTK UI -> NTK CMS Engine -> application/backend`

The engine already persists locally for the demo. External apps should replace that storage with async providers for the three independent domains:

- `content`
- `assets`
- `releases`

## Recommended shape

Persist each domain independently.

Why:
- content authoring changes more often than releases
- assets may live in another backend or object store
- releases often need stricter audit controls

## Option 1: custom async providers

Use the existing provider contracts directly.

```ts
import type {
  CmsAsyncEngineProviders,
  CmsContentRepositorySnapshot,
  CmsAssetRepositorySnapshot,
  CmsReleaseRepositorySnapshot,
} from '@nettoolskit/ui-vue/src/modules/cms/white-label'

const providers: CmsAsyncEngineProviders = {
  contentRepository: {
    async loadContentSnapshot(): Promise<CmsContentRepositorySnapshot | null> {
      return await api.get('/cms/content')
    },
    async saveContentSnapshot(snapshot) {
      await api.put('/cms/content', snapshot)
    },
  },
  assetRepository: {
    async loadAssetSnapshot(): Promise<CmsAssetRepositorySnapshot | null> {
      return await api.get('/cms/assets')
    },
    async saveAssetSnapshot(snapshot) {
      await api.put('/cms/assets', snapshot)
    },
  },
  releaseRepository: {
    async loadReleaseSnapshot(): Promise<CmsReleaseRepositorySnapshot | null> {
      return await api.get('/cms/releases')
    },
    async saveReleaseSnapshot(snapshot) {
      await api.put('/cms/releases', snapshot)
    },
  },
}
```

## Option 2: transport-based example adapter

The engine now exposes a generic transport example that maps domain names to async providers.

```ts
import {
  createCmsAsyncEngineProvidersFromTransport,
} from '@nettoolskit/ui-vue/src/modules/cms/white-label'

const providers = createCmsAsyncEngineProvidersFromTransport({
  async loadSnapshot(domain) {
    return await api.get(`/cms/${domain}`)
  },
  async saveSnapshot(domain, snapshot) {
    await api.put(`/cms/${domain}`, snapshot)
  },
})
```

Use this when your backend already exposes one endpoint per CMS domain.

## Option 3: fetch-based example adapter

For simple integrations, use the built-in fetch example.

```ts
import {
  createCmsFetchEngineProviders,
  hydrateCmsWhiteLabelSettingsFromProvidersAsync,
  saveCmsEngineProviderSnapshotsAsync,
} from '@nettoolskit/ui-vue/src/modules/cms/white-label'

const providers = createCmsFetchEngineProviders({
  endpoints: {
    content: '/api/cms/content',
    assets: '/api/cms/assets',
    releases: '/api/cms/releases',
  },
  fetchImpl: fetch,
  saveMethod: 'PUT',
  headers: {
    authorization: `Bearer ${token}`,
  },
})

const hydratedSettings = await hydrateCmsWhiteLabelSettingsFromProvidersAsync(
  currentSettings,
  providers,
)

await saveCmsEngineProviderSnapshotsAsync(hydratedSettings, providers)
```

## Runtime recommendation

At application boot:
1. load current tenant context
2. build the provider bundle for that tenant
3. hydrate the white-label settings from providers
4. mount the CMS UI with the hydrated engine state

On save/publish:
1. validate authoring state in the engine
2. persist through the provider bundle
3. keep workflow/audit logic in the application layer, not in the engine

## What stays outside the engine

Still out of scope for this layer:
- RBAC
- approval workflow
- audit log storage
- media binary upload implementation
- release approval policy
- tenant routing rules

Those belong to the host application/backend.