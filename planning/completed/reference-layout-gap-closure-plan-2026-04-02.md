# Plan: Reference Layout Gap Closure

Date: 2026-04-02
Status: Completed / archived
Spec: `planning/specs/completed/reference-layout-gap-closure-2026-04-02.md`
Branch: `feat/remove-cms-whitelabel-reference-2026-04-01`

Archive note: the unchecked task ledger below is preserved from the original execution plan for historical context. This plan is closed and archived; the checklist is not an active backlog.

## Ordered Tasks

| # | Task | File(s) | Status |
|---|------|---------|--------|
| 1 | Search debounce 300ms | `ReferenceTopbarActions.vue` | ⬜ |
| 2 | Help button emits help-click | `ReferenceTopbarActions.vue`, `ReferenceWorkspaceShell.vue`, `ReferenceSamplesApp.vue` | ⬜ |
| 3 | Notifications q-menu with sample items | `reference-system.types.ts`, `reference-report.sample-data.ts`, `ReferenceTopbarActions.vue`, `ReferenceWorkspaceShell.vue`, `ReferenceSamplesApp.vue` | ⬜ |
| 4 | Brand lockup logoUrl | `src/whitelabel/types.ts`, `src/whitelabel/presets.ts`, `ReferenceBrandLockup.vue` | ⬜ |
| 5 | Document tabs switch canvas content | `EditorWorkbenchTemplate.vue`, `ReferenceReportDesignerTemplate.vue` | ⬜ |
| 6 | ReferenceContextRailPanel + right-rail | `ReferenceContextRailPanel.vue` (new), `ReferenceReportDesignerTemplate.vue`, `index.ts` | ⬜ |

## Commits

- [ ] `fix(reference): add debounce to topbar search input`
- [ ] `feat(reference): wire help-click event through topbar and shell`
- [ ] `feat(reference): add notifications q-menu with sample items`
- [ ] `feat(reference): support logoUrl in brand lockup with initials fallback`
- [ ] `feat(reference): make document tabs switch canvas content`
- [ ] `feat(reference): add ReferenceContextRailPanel with object properties`

## Checkpoints

After each commit:
- `npm run type-check` — must pass
- `npm test` — 1036 tests must hold

After final commit:
- `npm run build:landing` — smoke build
