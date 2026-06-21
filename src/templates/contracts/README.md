# Template Contracts

Shared contracts and acceptance gates for template-first delivery.

## Standard Compliance

This README follows:
- [docs/standards/readme-frontend-super-agent-standard.md](../../../docs/standards/readme-frontend-super-agent-standard.md)

## Purpose

Define stable, typed contracts used across all template areas:
- catalog metadata contracts
- acceptance checklist contracts

## Structure

- `template-catalog.ts`
  - typed model for template entries, statuses, and customization scopes
- `template-acceptance.ts`
  - acceptance checklist helpers and missing-criteria detector
- `index.ts`
  - public export surface

## Rules

- keep contracts framework-agnostic when possible
- update acceptance criteria whenever template release policy changes
- avoid domain-specific fields in shared contract types

## Validation

```bash
npm run lint
npm run type-check
npm run test -- tests/unit/templates/TemplateAcceptance.spec.ts
```

## References

- [Templates README](../README.md)
- [CMS enterprise plan](../../../planning/active/cms-engine-enterprise-plan-2026-03-13.md)