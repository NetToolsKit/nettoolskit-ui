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
- `/?cms=1`
  - legacy CMS runtime mounted from `landing-page/`
- `/?landing=1`
  - legacy marketing landing mounted from `landing-page/`

## Local Preview

```bash
npm run dev:samples
```
