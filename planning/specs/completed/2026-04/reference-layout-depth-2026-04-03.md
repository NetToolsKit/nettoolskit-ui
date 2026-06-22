# Spec: Reference System Layout Depth

Date: 2026-04-03
Status: completed - archived
Branch: `feat/remove-cms-whitelabel-reference-2026-04-01`

## Summary

Second-pass gap closure against `docs/knowledge-base/planning-reference/layout-cms.md`.
4 structural/behavioral gaps remain after the initial 6 were closed (see `planning/plans/completed/2026-04/reference-layout-gap-closure-plan-2026-04-02.md`).

## Out of scope

- Real data binding or live preview rendering
- Canvas drag-and-drop or resize interactions
- Backend connectivity

## Gap Contracts

### GAP A — Dead space elimination

**File:** `ReferenceReportDesignerTemplate.vue`

Remove `.ntk-reference-designer__workbench-shell` card wrapper (border-radius 20px, padding 16px, shadow) and its `__workbench-header` block. Wire document metadata (brand eyebrow, filename, description, status badge) into the `#topbar-document` slot of `EditorWorkbenchTemplate` so document info lives inside the native topbar rather than above it.

Acceptance:
- No outer card border/padding around the workbench
- Document title and status still visible inside the workbench topbar
- No regressions in grid layout

### GAP B — EditableDocument region bands

**File:** `EditorWorkbenchTemplate.vue`

Add prop `showDocumentRegions?: boolean` (default `false`). When `true` and `activeDocumentTabId === 'layout'`, render three labeled background bands inside `canvas-stage` before the absolutely-positioned canvas objects: Header (~180px), Body (flex-grow), Footer (~100px). Bands are visual only — faint background tint + region label text.

`ReferenceReportDesignerTemplate` passes `:show-document-regions="true"`.

Acceptance:
- Three region bands visible in layout tab
- Canvas objects still render above bands
- Bands not visible in data/preview tabs

### GAP C — Preview read-only render

**File:** `EditorWorkbenchTemplate.vue`

Replace the static placeholder in the `preview` branch with a read-only render of the same canvas objects. Apply class `--preview` on `canvas-stage` to: disable grid, reduce ruler opacity, remove pointer events and hover states from canvas objects. Document region bands (when enabled) remain visible in preview.

Acceptance:
- Preview shows actual canvas object shapes/labels without grid
- No click interactions on objects in preview mode
- Rulers visually dimmed
- Switching back to layout tab restores full editing appearance

### GAP D — EditorNavigator document structure panel

**Files:** `ReferenceDocumentNavigatorPanel.vue` (new), `ReferenceReportDesignerTemplate.vue`, `index.ts`

New component `ReferenceDocumentNavigatorPanel`:
- Props: `canvasObjects?: TemplateEditorCanvasObject[]`, `selectedObjectId?: string | null`, `documentTitle?: string`
- Groups objects into Header / Body / Footer by Y position thresholds
- Renders tree: group label → object items (icon + label + lock indicator)
- Emit `object-select: [objectId: string]` on item click
- Selected item highlighted
- Header: "Document structure" + `account_tree` icon

`ReferenceReportDesignerTemplate` uses `#widgets-panel` slot to render this component instead of the default widget toolbox. Wires `@object-select` to update `activeCanvasObjectId`.

Export from `index.ts`.

Acceptance:
- Navigator panel shows document tree with Header/Body/Footer groups
- Clicking an item selects the object (updates activeCanvasObjectId, highlights in rail)
- Selected item visually highlighted in the tree

## Validation

```bash
npm run type-check
npm test             # 1036 baseline
npm run build:landing  # after gap D
```