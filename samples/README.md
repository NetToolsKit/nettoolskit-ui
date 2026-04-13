# Samples Runtime

Runtime host for a single approved sample derived from `.temp/reference`.

## Purpose

- keep `samples/` as the canonical public runtime for the approved reference-derived sample
- consume reusable layouts, pages, navigation, and styles from `src/**`
- keep the public host focused on one clean implementation instead of a multi-gallery flow

## Entry Modes

- `/`
  - original reference-derived sample
- `/?landing=1`
  - legacy marketing landing mounted from `landing-page/`
- `/?template-runtime=1`
  - router-enabled template runtime for internal composition checks

## Internal Compatibility Entry

- `/internal-cms.html`
  - internal CMS compatibility runtime kept outside the public sample flow

## Local Preview

```bash
npm run dev:samples
```

## Structure

- `main.ts`
  - chooses between the single public sample, the legacy landing, and the internal template runtime
- `original-reference/**`
  - self-contained original sample, sample data, and chart composition derived from the approved reference
- `shared/mountSamplesHost.ts`
  - sample host bootstrap helper
