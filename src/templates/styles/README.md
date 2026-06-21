# Template Styles

Tokenized style bridge for template visual consistency.

## Standard Compliance

This README follows:
- [docs/standards/readme-frontend-super-agent-standard.md](../../../docs/standards/readme-frontend-super-agent-standard.md)

## Purpose

Centralize template-specific style mappings so visual surfaces stay consistent while remaining theme-friendly and reusable.

## Structure

- `reference-app-bridge.scss`
  - template compatibility layer aligned with reference visual baseline
- `cms-authoring-reference.css`
  - shared CMS authoring shell CSS for builders, editor workbenches, review hubs, and release surfaces
- `style-template.catalog.ts`
  - style template metadata for registry
- `index.ts`
  - style template exports

## Rules

- prefer tokens over hardcoded values for color, spacing, radius, typography
- keep bridge selectors generic and template-focused
- avoid coupling styles to one feature module or tenant naming
- when a CMS surface needs the same chrome across modules, extend `cms-authoring-reference.css` instead of creating one-off page CSS

## Validation

```bash
npm run lint
npm run type-check
npm run build:samples
```

## References

- [Templates README](../README.md)
- [Global tokens](../../styles/tokens.scss)
