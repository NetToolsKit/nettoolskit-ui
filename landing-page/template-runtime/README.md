# Template Runtime

Router-enabled runtime shell for template-first adoption.

## Purpose

This runtime validates that templates under `src/templates/**` work in route-level composition (not only static showcase mode).

## Entry Mode

Use:

- `/?template-runtime=1`

The runtime loads:

- layout templates (`MainLayoutTemplate`, `AuthLayoutTemplate`)
- navigation templates (menu + breadcrumb + user menu)
- page and feature templates through routed views
- scaffolding helpers (`createTemplateRouteScaffold`, `createTemplateMenuFromScaffoldRoutes`)

## Notes

- Hash history is used to preserve runtime mode on in-app navigation and reloads.
- Menu structure is generated from typed scaffold route nodes in `router.ts`.