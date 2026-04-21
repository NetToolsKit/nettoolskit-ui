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

## Theme Runtime Contract

The samples host is the canonical browser surface for validating template theme behavior.

- `/?template-runtime=1` must exercise the same token stack used by reusable templates.
- Theme presets should update Quasar-compatible `--q-*` brand variables, NetToolsKit `--ntk-*` aliases, and template contracts together.
- Dark presets must synchronize with Quasar dark-mode behavior and expose `body--dark` for CSS selectors and E2E assertions.
- Quasar teleported surfaces (`QMenu`, `QDialog`, `QSelect`, `QPopupProxy`, `QTooltip`) must be styled through the shared overlay bridge or explicit popup classes.
- Runtime visual artifacts, Playwright reports, and test output belong under `.build`.

## Structure

- `main.ts`
  - chooses between the single public sample, the legacy landing, and the internal template runtime
- `original-reference/**`
  - self-contained original sample, sample data, and chart composition derived from the approved reference
- `shared/mountSamplesHost.ts`
  - sample host bootstrap helper
