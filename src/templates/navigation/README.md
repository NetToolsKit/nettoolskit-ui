# Navigation Templates

Navigation primitives and contracts for vertical/horizontal template navigation.

## Standard Compliance

This README follows:
- [docs/standards/readme-frontend-super-agent-standard.md](../../../docs/standards/readme-frontend-super-agent-standard.md)

## Purpose

Expose reusable navigation components and typed menu/breadcrumb contracts for template-based applications.

## Structure

- `MenuLinkTemplate.vue`
- `HorizontalMenuLinkTemplate.vue`
- `UserMenuTemplate.vue`
- `AppBreadcrumbTemplate.vue`
- `menu-template.types.ts`
  - shared menu and breadcrumb contracts
- `navigation-template.catalog.ts`
  - template registry metadata
- `index.ts`
  - public exports

## Rules

- menu contracts must remain generic and reusable
- preserve keyboard navigation and semantic landmarks
- avoid tenant-specific labels or icons inside component defaults

## Validation

```bash
npm run lint
npm run type-check
npm run test -- tests/unit/components/AllComponentsSmoke.spec.ts
```

## References

- [Templates README](../README.md)
- [Page templates](../pages/README.md)