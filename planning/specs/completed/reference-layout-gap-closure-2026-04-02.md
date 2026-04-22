# Spec: Reference Layout Gap Closure

Date: 2026-04-02
Status: completed - archived
Branch: `feat/remove-cms-whitelabel-reference-2026-04-01`

## Summary

The reference layout is ~90% conformant with `planning/reference/layout-reference-system.md`.
This spec closes 6 identified gaps in order of implementation speed.

## Out of scope

- Redesigning existing components
- Adding real backend/API connectivity (all notifications, help, etc. stay sample/placeholder)
- Changing routing or whitelabel persistence contracts

## Gap Contracts

### GAP 1 — Search debounce

**File:** `ReferenceTopbarActions.vue`

Replace the `watch(internalSearch, ...)` immediate-emit pattern with a 300 ms
`setTimeout`/`clearTimeout` debounce inside a local handler `onSearchInput`.
Clear the timer in `onUnmounted`. No external library.

Acceptance:
- Typing quickly produces only one `update:searchValue` emission after 300 ms idle
- Timer is cleared on unmount

### GAP 2 — Help button event

**Files:** `ReferenceTopbarActions.vue`, `ReferenceWorkspaceShell.vue`, `ReferenceSamplesApp.vue`

- `ReferenceTopbarActions` gains emit `help-click: []` and `@click` on the help q-btn
- `ReferenceWorkspaceShell` gains emit `help-click: []` and passes `@help-click` from TopbarActions
- `ReferenceSamplesApp` handles `@help-click` with a no-op placeholder function

Acceptance:
- Clicking help button emits through all layers with no TypeScript errors

### GAP 3 — Notifications panel

**Files:** `reference-system.types.ts`, `reference-report.sample-data.ts`,
`ReferenceTopbarActions.vue`, `ReferenceWorkspaceShell.vue`, `ReferenceSamplesApp.vue`

New type:
```ts
export interface ReferenceNotificationItem {
  id: string
  icon: string
  title: string
  description: string
  time: string
  read: boolean
}
```

`sampleNotifications` (4 items) added to `reference-report.sample-data.ts`.

`ReferenceTopbarActions` gains prop `notifications?: ReferenceNotificationItem[]` and
wraps the bell button in a `<q-menu>` that renders each item.

Shell and App wire the `notifications` prop.

Acceptance:
- Clicking bell opens a dropdown with 4 sample items (icon, title, description, time)
- Unread items visually distinct (no-read indicator or bold)

### GAP 4 — Brand lockup logo image

**Files:** `src/whitelabel/types.ts`, `src/whitelabel/presets.ts`, `ReferenceBrandLockup.vue`

`ReferenceWhitelabelBrand` gains optional `logoUrl?: string`.
`ReferenceBrandLockup` renders `<img>` when `logoUrl` is present, falls back to initials div.
At least one preset gets a placeholder `logoUrl`.

Acceptance:
- Preset with `logoUrl` shows image
- Preset without `logoUrl` shows initials (unchanged behaviour)
- No TypeScript errors

### GAP 5 — Document tabs functional

**Files:** `EditorWorkbenchTemplate.vue`, `ReferenceReportDesignerTemplate.vue`

`EditorWorkbenchTemplate` gains prop `activeDocumentTabId?: string` (default `'layout'`).
Default `#canvas-stage` slot content switches on this prop:

| Tab id | Content |
|--------|---------|
| `layout` | Existing canvas objects grid (unchanged) |
| `data` | Data binding placeholder table (3 columns, 4 sample rows) |
| `preview` | Preview placeholder card (full-width, "Preview mode" label) |

`ReferenceReportDesignerTemplate` already declares `activeDocumentTabId` — verify it passes
through to `EditorWorkbenchTemplate`.

Acceptance:
- Clicking Layout / Data / Preview tabs changes the canvas area content
- No regressions in existing canvas object rendering

### GAP 6 — Context rail connected

**Files:** `components/ReferenceContextRailPanel.vue` (new),
`ReferenceReportDesignerTemplate.vue`, `index.ts`

New component `ReferenceContextRailPanel`:
- Props: `selectedObjectId?: string | null`, `canvasObjects?: TemplateEditorCanvasObject[]`
- Computed `selectedObject` — finds object by id
- Empty state: "Select an element on the canvas" when nothing selected
- Selected state: inline tabs (Properties / Style / Data) showing label, x, y, width, height

`ReferenceReportDesignerTemplate` adds prop `selectedCanvasObjectId?: string | null` (default null)
and uses `#right-rail` slot to render `ReferenceContextRailPanel`.

Export `ReferenceContextRailPanel` from `index.ts`.

Acceptance:
- When `selectedCanvasObjectId` is null: empty state renders
- When an id is passed: object fields render in Properties tab
- No TypeScript errors

## Validation

```bash
npm run type-check   # after each gap
npm test             # 1036 tests baseline must hold
npm run build:landing  # after gap 6
```
