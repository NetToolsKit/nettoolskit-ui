# Layout Templates

Reusable layout shells for template-first app assembly.

## Standard Compliance

This README follows:
- [docs/standards/readme-frontend-super-agent-standard.md](../../../docs/standards/readme-frontend-super-agent-standard.md)

## Purpose

Provide generic layout templates that can be reused across CMS, dashboard, CRUD, and backoffice scenarios without tenant coupling.

## Structure

- `MainLayoutTemplate.vue`
  - generic app shell with navigation/header slots and typed props
- `AuthLayoutTemplate.vue`
  - auth-focused shell for login/recovery/register flows
- `layout-template.catalog.ts`
  - metadata entries for template registry
- `index.ts`
  - public exports for layout templates

## Rules

- layout templates must stay business-domain neutral
- preserve accessibility points (`role`, `aria-*`, keyboard focus targets)
- avoid direct store/router coupling inside layout templates

## Validation

```bash
npm run lint
npm run type-check
npm run test -- tests/unit/components/AllComponentsSmoke.spec.ts
```

## References

- [Templates README](../README.md)
- [Navigation templates](../navigation/README.md)