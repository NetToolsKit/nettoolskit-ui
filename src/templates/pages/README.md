# Page Templates

Page-level template catalog for reusable visual entry points.

## Standard Compliance

This README follows:
- [docs/standards/readme-frontend-super-agent-standard.md](../../../docs/standards/readme-frontend-super-agent-standard.md)

## Purpose

Keep page templates organized by domain to maximize reuse and speed:
- dashboard surfaces
- CRUD/list surfaces
- account/system utility surfaces

## Folder Organization

- `dashboard/`
  - `DashboardTemplate.vue`
  - `DashboardWorkspaceTemplate.vue`
- `crud/`
  - `CrudListTemplate.vue`
  - table mode is rendered through `src/components/ui/NtkDataTable.vue`, a tokenized adapter over Quasar `QTable`
- `editor/`
  - `EditorWorkbenchTemplate.vue`
- `account/`
  - `ProfileTemplate.vue`
- `system/`
  - `PlaceholderTemplate.vue`
  - `ErrorNotFoundTemplate.vue`
- `page-template.types.ts`
  - shared typed contracts for all page templates
- `page-template.catalog.ts`
  - catalog metadata used by template registry
- `index.ts`
  - public exports

## Rules

- page templates must remain generic and reusable
- no direct store coupling inside shared templates
- no hardcoded business strings tied to one tenant/domain
- all page templates expose typed props and emits contracts
- CRUD table mode must use the shared `NtkDataTable` adapter instead of native table markup so selection, row events, and tokenized Quasar table styling stay consistent

## Validation

```bash
npm run lint
npm run type-check
npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts
```
