# Post-Closeout Template Theme Hardening

Date: 2026-04-21
Branch: `feat/remove-cms-whitelabel-reference-2026-04-01`
Status: active - execution in progress

## Scope Summary

Close the residual issues found after the completed template/theme closeout audit.

This plan is limited to frontend/template/runtime hardening:
- remove remaining raw color and Quasar palette entry points in shared Vue/Quasar components
- strengthen token scanners so future regressions are caught outside the narrow template/layout/ui scan
- clean stale completed-plan documentation references
- clarify or gate public sample/runtime routes that expose internal or legacy surfaces
- keep residual logs, reports, traces, and generated artifacts in `.build` or `.temp`

Out of scope:
- backend behavior
- CMS domain feature implementation
- broad formatting cleanup unrelated to the findings

## Status Snapshot

Overall status: **10%**

| Slice | Status | Current evidence | Remaining closeout gap |
|---|---:|---|---|
| Slice 1 - Planning And Documentation Hygiene | 10% | Audit found stale `planning/active` references and completed-plan wording drift. | Clean stale completed-plan references and old visual-spec mentions. |
| Slice 2 - Component Color Entry Point Hardening | 0% | Audit found `NtkButton`, `NtkHeader`, sidebars, and raw inline color props still accepting palette/raw colors. | Sanitize aliases, CSS vars, and style props without breaking token customization. |
| Slice 3 - Guardrail Scanner Expansion | 0% | Audit found scanner roots and patterns too narrow. | Expand roots/patterns and allowlists to cover config/styles/builders/runtime helpers. |
| Slice 4 - Runtime Route And Sample Surface Cleanup | 0% | Audit found stale docs and internal/legacy surfaces still exposed by sample build. | Clarify or gate internal CMS and legacy landing sample routes. |
| Slice 5 - Validation And Closeout | 0% | Previous closeout was green before this new audit. | Run focused tests, type-check, lint, E2E where impacted, then move this plan to completed. |

## Ordered Tasks

1. Clean completed-plan and README drift.
   - Target paths: `planning/completed/**`, `README.md`, `samples/README.md`
   - Commands: `rg`, targeted markdown checks
   - Commit suggestion: `docs(plans): clean stale completed references`

2. Harden component color entry points.
   - Target paths: `src/components/ui/**`, `src/components/layout/**`, `src/components/builders/NtkAppSidebar.vue`
   - Commands: focused component tests, `npm run type-check`, targeted ESLint
   - Commit suggestion: `fix(theme): sanitize public color inputs`

3. Expand scanner and runtime guardrails.
   - Target paths: `tests/unit/templates/TemplateWhiteLabelAudit.spec.ts`, focused tests as needed
   - Commands: `npm test -- tests/unit/templates/TemplateWhiteLabelAudit.spec.ts --testTimeout=30000`
   - Commit suggestion: `test(theme): expand color regression scanner`

4. Resolve sample/runtime public-surface drift.
   - Target paths: `vite.config.ts`, `samples/main.ts`, `README.md`, `samples/README.md`, related tests
   - Commands: focused sample/runtime tests and `npm run build` if behavior changes
   - Commit suggestion: `fix(samples): gate internal runtime surfaces`

5. Validate and close.
   - Commands: `npm run type-check`, `npm test -- --testTimeout=30000`, `npm run lint`, focused Playwright visual specs if runtime/theme surfaces changed
   - Closeout: update status to 100%, move to `planning/completed/`, commit.

## Validation Checklist

- `npm run type-check`
- `npm test -- --testTimeout=30000`
- `npm run lint`
- focused Playwright visual/dark/screenshot specs if runtime surfaces or theme rendering change
- `rg` checks for direct Quasar color props/classes, `theme.value.colors/theme.value.gradients`, and residual artifacts outside `.build` or `.temp`

## Closeout Expectations

- `planning/active` is empty after completion
- completed plans no longer instruct readers to keep or move files in `planning/active`
- shared components reject raw palette/color values unless they are CSS variable/expression tokens
- generic scanners cover templates, shared components, styles, config, builders, and runtime helpers
- runtime/sample documentation matches the routes that can actually be built and served
