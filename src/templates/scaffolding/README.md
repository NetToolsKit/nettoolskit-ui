# Scaffolding Templates

Generic integration scaffolds to accelerate template-first bootstrap.

## Standard Compliance

This README follows:
- [docs/standards/readme-frontend-super-agent-standard.md](../../../docs/standards/readme-frontend-super-agent-standard.md)

## Purpose

Provide reusable scaffolding blocks for app setup:
- route assembly by layout shells
- menu constants generation
- layout state bootstrap
- notification bridge integration

These scaffolds are generic and intended for reuse in dashboards, CRUD modules, CMS backoffice, and other enterprise flows.

## Structure

- `router-template.ts`
  - typed route-node contracts and layout-group scaffold generator
- `menu.constants.template.ts`
  - menu constants builder from explicit definitions or scaffold routes
- `layout-store.template.ts`
  - generic layout state manager with optional local persistence
- `notification.template.ts`
  - notification bridge with defaults and preset support
- `scaffold-template.catalog.ts`
  - registry metadata for scaffolding templates
- `index.ts`
  - public exports

## Rules

- keep scaffolds framework-light and business-domain neutral
- use typed contracts for all integration points
- avoid hardcoded route/menu assumptions tied to one product

## Validation

```bash
npm run lint
npm run type-check
npm run test -- tests/unit/templates/ScaffoldingTemplates.spec.ts
```

## References

- [Templates README](../README.md)
- [Page templates](../pages/README.md)
- [Feature templates](../features/README.md)