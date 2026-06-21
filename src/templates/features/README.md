# Feature Templates

Reusable feature-level templates for auth, wiki, enterprise operational flows, CMS authoring, and reference-system workspaces.

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
- `cms/`
  - reusable CMS authoring chrome
  - reusable internal module surfaces
  - grouped module templates for public whitelabel consumption with fewer top-level parameters
- `reference-system/`
  - reusable report manager/designer workspaces and host controller
- `feature-template.catalog.ts`
  - registry metadata for feature templates
- `index.ts`
  - public exports for feature templates

## Rules

- feature templates must be domain-agnostic and route/store independent
- expose typed props/emits for extension instead of hardcoded behavior
- prefer grouped domain contracts over large flat prop lists for reusable authoring modules
- keep accessibility and empty/loading states explicit

## Validation

```bash
npm run lint
npm run type-check
npm run test -- tests/unit/templates/EnterpriseFeatureTemplates.spec.ts
```

## References

- [Templates README](../README.md)
- [Page templates](../pages/README.md)