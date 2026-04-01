# Feature Templates

Reusable feature-level templates for auth, wiki, enterprise, and reference-system flows.

## Standard Compliance

This README follows:
- [docs/standards/readme-frontend-super-agent-standard.md](../../../docs/standards/readme-frontend-super-agent-standard.md)

## Purpose

Provide generic feature surfaces that accelerate delivery while remaining fully customizable for multiple products and tenants.

## Structure

- `auth/`
  - `LoginTemplate.vue`
- `wiki/`
  - `WikiTemplate.vue`
  - `WikiChatTemplate.vue`
  - `WikiChatDrawerTemplate.vue`
  - `wiki-template.types.ts`
- `enterprise/`
  - `EnterpriseCommandCenterTemplate.vue`
  - `ApprovalQueueTemplate.vue`
  - `AuditTimelineTemplate.vue`
  - `enterprise-template.types.ts`
  - `index.ts`
- `reference-system/`
  - `ReferenceReportManagerTemplate.vue`
  - `ReferenceReportDesignerTemplate.vue`
  - `ReferenceWorkspaceShell.vue`
  - `ReferenceWorkspaceComposer.vue`
  - `useReferenceWorkspaceHost.ts`
  - `reference-system.types.ts`
  - `reference-system.sample-data.ts`
  - `reference-report.sample-data.ts`
  - `reference-manager.sample-config.ts`
  - `reference-designer.sample-config.ts`
  - `components/`
    - `ReferenceBrandLockup.vue`
    - `ReferencePresetSelectorBar.vue`
    - `ReferenceDocumentTabsBar.vue`
    - `ReferenceReportCatalogPanel.vue`
    - `ReferenceReportDetailCard.vue`
    - `ReferenceReportStatusBadge.vue`
    - `ReferenceWhitelabelPresetCard.vue`
  - `index.ts`
- `../../whitelabel/`
  - shared preset, runtime and token mapping for reference samples
- `feature-template.catalog.ts`
  - registry metadata for feature templates
- `index.ts`
  - public exports for feature templates

## Rules

- feature templates must be domain-agnostic and route/store independent
- expose typed props/emits for extension instead of hardcoded behavior
- keep accessibility and empty/loading states explicit

## Validation

```bash
npm run lint
npm run type-check
npm run test -- tests/unit/templates/EnterpriseFeatureTemplates.spec.ts
npm run test -- tests/unit/templates/ReferenceSystemTemplates.spec.ts
```

## References

- [Templates README](../README.md)
- [Page templates](../pages/README.md)