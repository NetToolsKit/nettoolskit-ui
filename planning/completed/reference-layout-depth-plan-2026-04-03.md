# Plan: Reference System Layout Depth

Date: 2026-04-03
Status: Completed / archived
Spec: `planning/specs/completed/reference-layout-depth-2026-04-03.md`
Branch: `feat/remove-cms-whitelabel-reference-2026-04-01`

Archive note: the unchecked task ledger below is preserved from the original execution plan for historical context. This plan is closed and archived; the checklist is not an active backlog.

## Ordered Tasks

| # | Task | File(s) | Status |
|---|------|---------|--------|
| A | Remove card wrapper, wire topbar-document slot | `ReferenceReportDesignerTemplate.vue` | ⬜ |
| B | Add showDocumentRegions prop + region bands in canvas | `EditorWorkbenchTemplate.vue`, `ReferenceReportDesignerTemplate.vue` | ⬜ |
| C | Replace preview placeholder with read-only render | `EditorWorkbenchTemplate.vue` | ⬜ |
| D | Create ReferenceDocumentNavigatorPanel + wire to widgets-panel slot | `ReferenceDocumentNavigatorPanel.vue` (new), `ReferenceReportDesignerTemplate.vue`, `index.ts` | ⬜ |

## Commits

- [ ] `refactor(reference): remove card wrapper around editor workbench to eliminate dead space`
- [ ] `feat(reference): add EditableDocument region bands to canvas layout view`
- [ ] `feat(reference): render canvas objects as read-only document in preview tab`
- [ ] `feat(reference): add ReferenceDocumentNavigatorPanel for document structure navigation`

## Checkpoints

After each commit:
- `npm run type-check` — must pass
- `npm test` — 1036 tests must hold

After gap D:
- `npm run build:landing` — smoke build
