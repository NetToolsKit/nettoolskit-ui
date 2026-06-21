# CMS Backend Integration Handbook

This handbook describes how a backend-oriented team should integrate the NetToolsKit CMS engine without collapsing the engine/application boundary.

## Target boundary

Keep this layering explicit:

`Quasar -> NTK UI -> NTK CMS Engine -> application/backend`

The CMS engine owns:
- schema-driven authoring
- page, section and block composition
- reusable presets and reusable content
- preview resolution
- validation contracts
- release orchestration helpers

The host application/backend owns:
- authentication and authorization
- tenant resolution
- API contracts and persistence infrastructure
- audit logs and approvals
- binary file upload/storage
- business rules outside generic CMS behavior

## Persist domains independently

The engine is already split into three persistence domains:

| Domain | What it contains | Why it should stay separate |
|---|---|---|
| `content` | pages, reusable sections, reusable blocks, authored content models, authored presets | changes frequently during authoring |
| `assets` | media metadata and library bindings | may live behind different storage/upload flows |
| `releases` | snapshots, release history, publish state, rollback data | usually needs stricter controls and auditability |

This split is already modeled by the provider contracts in:
- [providers.ts](../src/modules/cms/white-label/providers.ts)
- [provider-hydration.ts](../src/modules/cms/white-label/provider-hydration.ts)

## Recommended backend shape

The safest default is one endpoint per CMS domain per tenant.

Example:

```text
GET  /api/cms/{tenantId}/content
PUT  /api/cms/{tenantId}/content

GET  /api/cms/{tenantId}/assets
PUT  /api/cms/{tenantId}/assets

GET  /api/cms/{tenantId}/releases
PUT  /api/cms/{tenantId}/releases
```

Why this shape works:
- the engine already loads and saves domains independently
- releases can evolve with stricter backend rules later
- media binaries can be handled outside the CMS metadata contract

## Runtime boot flow

At application startup:

1. Resolve the active tenant and user context.
2. Build the async provider bundle for that tenant.
3. Hydrate engine settings from providers.
4. Mount the CMS UI with the hydrated settings.

Minimal example:

```ts
import {
  createCmsFetchEngineProviders,
  hydrateCmsWhiteLabelSettingsFromProvidersAsync,
} from '@nettoolskit/ui-vue/src/modules/cms/white-label'

const providers = createCmsFetchEngineProviders({
  endpoints: {
    content: `/api/cms/${tenantId}/content`,
    assets: `/api/cms/${tenantId}/assets`,
    releases: `/api/cms/${tenantId}/releases`,
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
```

For transport-based examples, see [cms-provider-hydration.md](./cms-provider-hydration.md).

## Save flow

The recommended save flow is:

1. Keep all authoring state inside the engine/UI.
2. When the user saves, persist through domain providers.
3. Let the backend own concurrency, revision and audit strategy.

The engine-side helpers already support this:

```ts
import {
  saveCmsEngineProviderSnapshotsAsync,
} from '@nettoolskit/ui-vue/src/modules/cms/white-label'

await saveCmsEngineProviderSnapshotsAsync(hydratedSettings, providers)
```

Backend recommendation:
- use optimistic concurrency (`etag`, `version`, `updatedAt`, revision id, or equivalent)
- reject stale writes explicitly
- preserve domain-level history if your product needs audit or recovery beyond frontend autosave

## Publish and release flow

Release orchestration is provided by the engine, but backend policy still belongs to the host application.

Relevant helpers live in:
- [orchestration.ts](../src/modules/cms/releases/orchestration.ts)

Important functions:
- `createCmsReleaseSnapshot(...)`
- `validateCmsRelease(...)`
- `publishCmsRelease(...)`
- `rollbackCmsRelease(...)`
- `promoteCmsReleaseEnvironment(...)`

Recommended publish flow:

1. Persist current authoring changes.
2. Build or refresh the release snapshot.
3. Run engine validation/pre-publish checks.
4. Apply backend approval/audit rules if needed.
5. Persist the updated `releases` domain.
6. Only then expose the published snapshot to the runtime delivery surface.

## Validation responsibilities

The engine validates:
- content-model compatibility
- section/block composition rules
- required presets
- schema-field constraints
- reusable-content integrity
- release snapshot consistency

The backend should validate again:
- tenant authorization
- write permissions
- stale revision conflicts
- payload size/rate limits
- domain ownership and environment policy
- any organization-specific publishing rule

Do not assume frontend validation is enough for production write paths.

## Versioning and migrations

Use the engine contracts as versioned payloads, not as ad hoc JSON blobs.

Recommended backend strategy:
- store the raw domain snapshot as produced by the engine
- keep a revision id per domain
- keep a migration path at the backend boundary only when contract changes force it
- never merge unrelated domains into one opaque record unless there is a strong operational reason

For schema evolution specifically:
- content models already track schema version metadata
- pages already carry model version references
- backend should preserve those values, not rewrite them

## Media responsibilities

The CMS engine manages media metadata and references.

The backend/application should manage:
- binary upload
- file storage provider
- signed URLs if needed
- image/video processing
- retention policies

A practical split is:
- backend returns the final URL or media handle
- engine stores the media metadata used by authoring and rendering

## What should stay out of the engine

Do not push these concerns into the CMS engine layer:
- RBAC
- approval workflow
- tenant billing or quotas
- organization-specific publish governance
- asset antivirus/moderation pipelines
- analytics dashboards unrelated to CMS authoring

If a rule is product-specific, keep it in the application/backend layer.

## Backend implementation checklist

Use this checklist before calling the integration done:

1. Expose domain endpoints for `content`, `assets` and `releases`.
2. Resolve tenant context before building providers.
3. Hydrate engine state through async providers, not through ad hoc UI mutations.
4. Enforce optimistic concurrency on save.
5. Persist release data independently from content.
6. Re-run backend authorization and policy validation on write/publish.
7. Keep binary media upload separate from CMS metadata persistence.
8. Preserve schema and release version metadata exactly as emitted by the engine.

## Minimal reading order

For teams integrating the CMS engine into a real backend:

1. [README.md](../README.md)
2. [cms-provider-hydration.md](./cms-provider-hydration.md)
3. [providers.ts](../src/modules/cms/white-label/providers.ts)
4. [provider-hydration.ts](../src/modules/cms/white-label/provider-hydration.ts)
5. [orchestration.ts](../src/modules/cms/releases/orchestration.ts)