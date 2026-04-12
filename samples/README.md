# Samples Runtime

Runtime host for the approved samples catalog and showcase flows.

## Purpose

- keep `samples/` as the canonical app shell that renders demos, catalogs, and showcase routes
- consume reusable libraries, templates, composables, and styles from `src/**`
- keep `landing-page/` limited to the legacy marketing landing assets and compatibility-only runtime pieces

## Entry Modes

- `/`
  - reference catalog
- `/?samples=1`
  - reference workspace sample
- `/?templates=1`
  - template showcase
- `/?template-runtime=1`
  - router-enabled template runtime
- `/?landing=1`
  - legacy marketing landing mounted from `landing-page/`

## Internal Compatibility Entry

- `/internal-cms.html`
  - internal CMS compatibility runtime kept outside the public samples host navigation

## Local Preview

```bash
npm run dev:samples
```

## Structure

- `ReferenceCatalogApp.vue`
  - canonical catalog host for the approved reference system
- `reference-hub/**`
  - root navigation and template-selection surfaces for the samples runtime
- `ReferenceSamplesApp.vue`
  - report workspace sample host
- `shared/**`
  - sample-only reusable helpers for interaction feedback and runtime glue
- `TemplateShowcaseApp.vue`
  - thin orchestrator for the template showcase
- `template-showcase/families/**`
  - config-driven visual families built from whitelabel overrides and example ids
- `template-showcase/components/**`
  - reusable showcase-only composition pieces such as the visual-family section renderer
- `template-showcase/examples/**`
  - one subfolder per rendered showcase example
- `template-showcase/template-showcase.examples.ts`
  - registry that maps showcase example ids to reusable `src/**`-backed sample components
- `template-showcase/template-showcase.sample-data.ts`
  - shared static sample content for the showcase
