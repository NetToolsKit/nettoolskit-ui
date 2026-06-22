# NetToolsKit UI Industrial Desktop Components - Spec

Generated: 2026-06-22 10:35 America/Sao_Paulo
LastUpdated: 2026-06-22 10:35 America/Sao_Paulo
Status: active
Priority: high
Branch: `TBD`
Workstream ID: `nettoolskit-ui-industrial-desktop-components`
Related Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`
Related Specs:

- `planning/specs/active/2026-06-21-nettoolskit-ui-ds-component-usability-expansion.md`
- `planning/specs/active/2026-06-21-nettoolskit-ui-developer-recipe-catalog.md`

## Objective

Add a generic industrial desktop component set to `nettoolskit` so downstream
engineering products can build SCADA/IDE-like interfaces without copying
screen-specific CSS, direct Quasar primitives, or one-off ribbon/dock layouts.

## Normalized Request Summary

The Zylix SCADA Schneider reference experiment proved that the current
`nettoolskit` package does not yet help enough for dense industrial UIs. The
library has useful tokens, primitive `Ds*` components and application-oriented
recipes, but it lacks generic components for:

- desktop-like window shells;
- ribbon command surfaces;
- quick access toolbars with real icons;
- project/tree explorers;
- docked panels and technical output areas;
- status bars;
- grid/canvas workspaces.

This spec registers a new design-system workstream to make those patterns
library-owned, domain-neutral and reusable across SCADA, automation,
engineering, monitoring, diagnostic and IDE-like products.

## Design Intent

Product developers should be able to compose a dense engineering workspace like
this without local layout CSS:

```vue
<DsDesktopShell title="Engineering Studio - Screen1">
  <template #quickAccess>
    <DsQuickAccessToolbar :items="quickActions" />
  </template>

  <DsRibbon
    v-model:active-tab="activeTab"
    :tabs="ribbonTabs"
  />

  <DsDockLayout>
    <template #left>
      <DsTreeExplorer :nodes="projectNodes" title="Project Explorer" />
    </template>

    <DsWorkspaceCanvas grid document-title="Screen1" />

    <template #bottom>
      <DsDockPanel title="Watch" />
      <DsDockPanel title="Output" />
    </template>
  </DsDockLayout>

  <DsStatusBar :segments="statusSegments" />
</DsDesktopShell>
```

The design system owns:

- layout geometry and density;
- keyboard and focus contracts;
- tokenized borders, surfaces, hover/focus states and disabled states;
- icon and command semantics;
- responsive degradation rules;
- accessibility semantics for toolbar, tablist, tree, splitter, panel and grid
  regions.

Downstream products own:

- labels and domain data;
- command handlers;
- routing and persistence;
- telemetry/runtime integrations;
- product-specific icons only through an approved icon registry.

## Target Component Set

Initial high-value components:

- `DsDesktopShell`: technical desktop application frame with title, top areas,
  workspace and status slots.
- `DsQuickAccessToolbar`: compact icon-only command row for save/open/run/help
  style actions.
- `DsRibbon`: tabbed command surface with groups, command buttons, disabled
  states, selected states and compact overflow behavior.
- `DsRibbonGroup`: named command group with label, separators and density.
- `DsRibbonCommand`: icon/text command with semantic `intent`, `state`,
  `size`, `selected`, `disabled`, `loading` and tooltip contract.
- `DsDockLayout`: split workspace layout with left/right/bottom/top regions and
  controlled resizer tokens.
- `DsDockPanel`: titled dock panel with pin/close/collapse affordances, tabs and
  action slots.
- `DsTreeExplorer`: accessible tree/project explorer with icons, selection,
  expansion, search/filter slot and keyboard navigation.
- `DsStatusBar`: dense status segment row for coordinates, counts, mode
  indicators and environment state.
- `DsWorkspaceCanvas`: neutral canvas/grid surface for design, monitoring,
  diagram or editor workspaces.
- `DsCommandIcon`: semantic icon resolver component backed by an approved
  built-in registry and product extension hooks.

## Key Decisions

- Component names must stay domain-neutral. Use `Desktop`, `Ribbon`, `Dock`,
  `TreeExplorer`, `StatusBar` and `WorkspaceCanvas`, not `Scada*` or
  `Schneider*`.
- Schneider/Zylix SCADA screenshots may inform density and ergonomics, but no
  screenshot, clone-specific styling or product text belongs in reusable
  components.
- Public APIs must remain semantic and closed. Avoid open props such as
  `color?: string`, `padding?: string`, `iconHtml?: string` or arbitrary CSS
  class pass-through.
- `DsCommandIcon` must not degrade to text initials such as `N`, `S` or `X`.
  Missing icons must render a controlled fallback glyph and emit a development
  warning in non-production builds.
- Components may wrap Quasar only inside the design-system implementation. The
  public API must not expose Quasar internals, `.q-*` classes or raw `q-*`
  component requirements.
- Dense desktop layout must support explicit density modes:
  `compact`, `comfortable`, and `spacious`.
- Components must support light/dark/high-contrast readiness through existing
  token and resolver architecture.
- Recipes and docs must show industrial examples without becoming product
  templates.

## Design Slice Matrix

| Slice | Target paths | Standardization impact | Security impact | Performance impact | Acceptance signal |
|---|---|---|---|---|---|
| Contracts and recipes | `src/design-system/core/components/**` | Adds typed semantic APIs for desktop/ribbon/dock patterns | Blocks arbitrary style strings and unsafe icon HTML | Pure recipes remain tree-shakeable | Contract tests cover variants, density and states |
| Vue wrappers | `src/design-system/vue/components/**` | Gives downstream apps reusable `Ds*` building blocks | Keeps Quasar and DOM internals encapsulated | Avoids product CSS duplication | Component tests mount all major slots/states |
| Icon registry | `src/design-system/core/icons/**`, `src/design-system/vue/components/DsCommandIcon.vue` | Standardizes command icon semantics | Prevents raw HTML/SVG injection from product data | Allows tree-shaken icon subsets | Missing icon behavior is deterministic and tested |
| Tokens and CSS | `src/design-system/tokens/**`, `src/styles/**` | Centralizes desktop density, borders, splitters, focus and panels | Avoids hardcoded visual values in products | Shared CSS reduces repeated app payload | `tokens:check`, `lint:style`, `lint:css` pass |
| Samples and recipes | `samples/**`, `COMPONENTS.md`, generated docs | Makes SCADA/engineering layouts copyable without local CSS | Uses static fixtures only | Sample build stays lightweight | `npm run build:samples` passes |
| Accessibility gates | `tests/**`, optional browser smoke | Proves keyboard/focus behavior for dense UIs | Prevents hidden focus and inaccessible command surfaces | Keeps interaction logic bounded | Tree, ribbon, dock and toolbar keyboard tests pass |
| Package surface | `index.ts`, `src/design-system/vue/components/index.ts` | Makes new components explicit public API | Prevents private-path imports | Preserves package clarity | Type declarations include all new exports |

## Component Contract Requirements

### `DsQuickAccessToolbar`

- `items` array with `id`, `label`, `icon`, `disabled`, `selected`,
  `shortcut`, `tooltip` and `intent`.
- Icon-only visual by default; accessible label is required.
- Keyboard navigation must be predictable with arrow keys and tab entry/exit.
- No text initials as production icon fallback.

### `DsRibbon`

- `tabs` array with groups and commands.
- Supports `v-model:activeTab`.
- Renders tablist semantics and preserves keyboard navigation.
- Supports horizontal overflow without overlap.
- Groups must never overlap commands at compact desktop widths.

### `DsDockLayout` and `DsDockPanel`

- Supports left, right, top, bottom and center regions through slots.
- Supports fixed and resizable panels through tokenized splitter geometry.
- Dock panel titlebars expose collapse/pin/close actions as slots or typed
  action descriptors.
- Must keep panels usable at compact density without text collision.

### `DsTreeExplorer`

- Supports hierarchical nodes with icon, label, expanded, selected, disabled and
  children fields.
- Uses ARIA tree semantics where applicable.
- Keyboard support includes expand/collapse, selection and focus movement.
- Must support truncation with tooltip or title, not silent clipping.

### `DsWorkspaceCanvas`

- Provides neutral grid, dotted grid and plain surface modes.
- Supports document tab/header slots without assuming SCADA screen names.
- Does not implement diagram/editor business logic.
- Must avoid forced full-screen assumptions so products can compose it inside
  dock layouts.

### `DsStatusBar`

- Supports dense segments with optional icon, label, value, state and tooltip.
- Handles long values through truncation policy.
- Must keep status information accessible to screen readers.

## Alternatives Considered

| Alternative | Decision | Reason |
|---|---|---|
| Keep industrial shell code inside Zylix SCADA | Rejected | It creates product-specific CSS debt and cannot help other engineering products. |
| Add only a recipe, no components | Rejected | A recipe cannot enforce overlap, density, keyboard and icon behavior. |
| Expose raw Quasar layout/ribbon wrappers | Rejected | That leaks implementation details and recreates direct Quasar coupling. |
| Build a pixel-perfect Schneider clone in the library | Rejected | The library must provide domain-neutral components, not vendor-specific UI. |
| Use text initials for missing toolbar icons | Rejected | It looked non-standard in SCADA and is not acceptable for desktop command surfaces. |
| Add one large `DsIndustrialShell` component only | Rejected | It would become too rigid; smaller composable components are easier to reuse. |

## Risks

- Scope can grow into a full SCADA product shell if component boundaries are not
  kept strict.
- Dense desktop components can create accessibility regressions if keyboard and
  focus behavior are not treated as first-class requirements.
- A broad icon registry can bloat the package if icons are not tree-shakeable.
- Overly flexible props can reintroduce arbitrary CSS and visual drift.
- If samples resemble Schneider too closely, the library may look like a clone
  instead of a generic industrial toolkit.
- If `DsRibbon` overflow behavior is weak, downstream apps will recreate local
  CSS hacks.

## Acceptance Criteria

- The initial component set has typed contracts, recipes, Vue wrappers, tests
  and public exports.
- No product-specific names such as `Scada`, `Schneider`, `EcoStruxure`,
  `PCDemo` or `Screen1` appear in reusable component APIs.
- `DsQuickAccessToolbar` renders real command icons or controlled icon fallback,
  never text initials.
- `DsRibbon` and `DsDockLayout` are validated against compact desktop widths
  with no incoherent overlap.
- `DsTreeExplorer`, `DsRibbon`, `DsQuickAccessToolbar` and `DsDockPanel` have
  keyboard/focus tests.
- New CSS uses tokens, low specificity and approved design-system layers.
- Generated docs and sample recipes demonstrate an engineering workspace using
  static fixtures only.
- `npm run verify` passes.

## Planning Readiness

Ready for execution planning after maintainers choose the first implementation
slice. Recommended first slice:

1. `DsCommandIcon`
2. `DsQuickAccessToolbar`
3. `DsRibbon`
4. one sample engineering workspace showing those three components together

`DsDockLayout`, `DsDockPanel`, `DsTreeExplorer`, `DsWorkspaceCanvas` and
`DsStatusBar` should follow in separate implementation slices to avoid a large
unreviewable PR.

## Recommended Specialist Focus

- Super Agent controller
- Frontend Vue/Quasar engineer for component contracts and wrappers
- Test engineer for keyboard, focus and dense layout states
- Docs/release engineer for generated docs, recipe catalog and package surface
- Review-code engineer for API boundaries and library-only discipline

## Pillar Impact

### Standardization

High. This work turns ad hoc industrial shell CSS into typed `Ds*` contracts and
documented recipes.

### Security

Medium. The main security concern is preventing unsafe icon/HTML injection and
keeping product-provided command metadata constrained to typed fields.

### Performance

Medium. The design must keep icon assets and shell components tree-shakeable and
avoid shipping a large industrial UI bundle to products that do not use it.
