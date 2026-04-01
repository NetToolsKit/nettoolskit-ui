# Approved Reference-System Layout

## Goal

The report designer and manager flows should use the full available workspace instead of centering a narrow content card.
The reusable shell must feel like a real authoring environment and stay aligned with the approved reference direction.

## Overall Structure

```text
AppShell
|-- Global topbar
`-- Main area
    |-- Navigation sidebar
    |-- Editor workspace
    `-- Optional context rail
```

## Layout Regions

### 1. Global topbar

Responsible for product identity, search, and global actions.

### 2. Navigation sidebar

Responsible for module navigation between catalog, designer, reports, assets, and other product areas.

### 3. Editor workspace

Responsible for the full editing experience.

The `EditorWorkspace` must occupy the remaining horizontal and vertical space in the shell.
It must not center a smaller card with large empty side margins.

### 4. Context rail

Optional supporting rail for properties, history, recovery, diagnostics, or selected-item details.

When present, it can stay fixed on the right, but it must not create dead space between the rail and the editor.

## Main Occupancy Rule

The workspace should follow this rule:

- navigation takes a fixed width on the left
- the contextual rail takes a fixed width on the right when present
- the space between those rails belongs entirely to the editor
- the editor content expands to fill that space
- the main editing surface should not be centered inside a narrow wrapper

## Internal Editor Structure

```text
EditorWorkspace
|-- Editor topbar
|-- Editor body
|   |-- Editor navigator
|   |-- Editor canvas region
|   `-- Designer rail
`-- Optional bottom panels
```

## Editor Body Expectations

The editor body must consume the remaining height after the editor topbar and keep the navigator, canvas, and rail visually connected.

## Reusable Outcome

This layout should be implemented through reusable templates and parameter-driven shell tokens so the same structure can support:

- reference report catalog flows
- report designer flows
- whitelabel tenant variations
- future backoffice authoring experiences without reviving CMS-specific contracts