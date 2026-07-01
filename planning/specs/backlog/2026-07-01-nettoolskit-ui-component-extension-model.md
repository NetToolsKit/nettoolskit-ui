# NetToolsKit UI Component Extension Model (props-vs-slots + L2 slot forwarding) - Spec

Generated: 2026-07-01 America/Sao_Paulo
LastUpdated: 2026-07-01 America/Sao_Paulo
Status: backlog
Priority: medium-high
Workstream ID: `nettoolskit-ui-component-extension-model`
Phase: architecture-extensibility

## Objective

Codify **how a component is allowed to vary by context**, and close the concrete
gap where the most dynamic (schema-driven) components cannot be extended without
dropping a layer. The guiding principle is **"closed by default, open by
extension"**: a governed design system's value is consistency, so we expose the
*right* extension points per layer — not a slot on everything (which would
re-create raw markup and throw away governance).

Decision rule (the standard this spec establishes):

| Vary by… | Mechanism | Where |
|---|---|---|
| Governed variation (visual/behavioral consistency) | **props** | L0 primitives (`intent`, `size`, `icon`, `loading`, `variant`) |
| Layout composition | **named slots** | L1 layout (`header`/`actions`/`footer`/…) — already present |
| Data/render of a specific piece | **scoped override slots** | L2 data/schema (`#cell-<field>`, `#field-<name>`) |
| Truly bespoke | **escape hatch (drop to L1)** | compose `Ds*` by hand |

Explicit non-goal: **do not slot-ify primitives.** A `DsButton`/`DsInput` that
accepts arbitrary internal slots stops being governed. If a screen needs a
"different" primitive, that is a missing **prop/variant** (add to the API) or it
is not that primitive.

## Background — current state (audited 2026-07-01)

- **Layout/structural (L1): good.** 74 named slots across 29 components
  (`header`/`footer`/`actions`/`sidebar`/`search`/`icon`/…). E.g. `DsPage`,
  `DsSection`, `DsCard`, `DsDialog`, `DsAppShell`, `DsDockLayout`,
  `DsFilterBar` (`#search`, `#actions`), `DsFormPage` (`#headerActions`).
- **`DsTable` (data): already does the right thing.** Dynamic scoped slots:
  - `#header-<columnId>` → `{ column }`
  - `#cell-<columnId>` → `{ row, column, value }` (default falls back to the
    formatted value).
- **`DsForm` (L2 schema): gap.** Renders fields via `v-for` over the schema with
  `v-if` on `field.type` → `Ds*` primitives. **No per-field slot.** Extension is
  only via `field.type`. (Only an internal `#actions` template.)
- **`DsCrudPage` (top composite): gap.** Composes `DsPageHeader` + `DsFilterBar`
  + `DsTable` + `DsForm` + `DsDialog` and **consumes** their slots internally
  (`#actions` for the "new" button, `DsFilterBar #search`, `DsTable
  #cell-__actions` for row actions) but **re-exposes zero slots** to the
  consumer. So `<DsCrudPage :resource>` cannot: custom-render a cell/column, add
  extra header actions or row actions, add custom filters, override a form field,
  or override the empty/loading/error states — without dropping to L1.

## Scope — where to adjust

### 1. `DsForm` — per-field override slots (`src/design-system/vue/components/DsForm.vue`)
- Add a **scoped override slot per field**: `#field-<name>` exposing
  `{ field, value, error, disabled, update }` (where `update(v)` writes back
  through the same `update:model-value` path). The **default** slot content stays
  the current schema-driven primitive, so it is opt-in per field.
- Add optional structural slots: `#before-fields`, `#after-fields` (e.g. a
  section intro, an inline note) — rendered around the generated fields, not
  replacing them.
- Keep `field.type` as the primary mechanism; the slot is a **targeted override**,
  not a replacement for the schema.

### 2. `DsCrudPage` — forward a curated slot set (`.../DsCrudPage.vue`)
Forward (not open everything) the high-value override points to the right child:
- **Table:** `#cell-<field>` and `#header-<field>` → passed straight through to
  `DsTable` (same scope `{ row, column, value }`). This is the #1 ask
  ("a table changes per screen").
- **Row actions:** `#row-actions="{ row }"` that **augments** the built-in
  edit/remove (or replaces when provided) — do not silently drop the governed
  actions.
- **Header:** `#header-actions` to add buttons next to the auto "new" button.
- **Filters:** `#filters` / `#filter-<field>` → `DsFilterBar` (pairs with a
  future schema-driven filter set on the resource; see Notes).
- **Form:** `#form-field-<name>` → forwarded to `DsForm`'s `#field-<name>` so a
  CRUD's dialog form can override a field without leaving L2.
- **States:** `#empty`, `#loading`, `#error` to override the default
  `DsEmptyState`/`DsStateBlock` copy/visual.

### 3. `DsTable` — confirm + document (`.../DsTable.vue`)
- Already has `#header-<id>` / `#cell-<id>`. Add `#empty` (table-level empty) and
  `#toolbar` only if missing after audit. Document the scoped-slot contract in
  `COMPONENTS.md`/recipes.

### 4. Governance doc — the decision rule as living documentation
- New `docs/architecture/extension-model.md` (or a section in
  [`layers.md`](../../docs/architecture/layers.md)) codifying the props-vs-slots
  table above + "closed by default, open by extension" + the primitives
  non-goal. Link from `binding-contract.md`.
- **Cross-framework note:** slots are the *Vue* mechanism; the **contract** is
  "targeted, named override points with a default." A React binding exposes the
  equivalent (children / render-props / `renderCell`). So the pure core stays
  slot-agnostic — slots live only in the Vue binding. Pairs with
  [[nettoolskit-ui-framework-agnostic-core-extraction]] and graded by
  [[nettoolskit-ui-react-binding-pilot]].

### 5. Guardrail (advisory first)
- A documented review rule (and, if cheap, a lint) that **primitives
  (`Ds*` except the L1/L2 set) must not add arbitrary named slots** — keep them
  prop-governed. Start as a checklist item in the review skill / PR template;
  only harden into a gate if drift appears. Reuse the layer manifest
  (`planning/architecture/layers.json`) to know which components are primitives.

## Verification (env constraints)

Local vitest runs per-file via the node/jsdom path (worker pool is flaky on this
mount — run targeted specs, not the whole suite). Verify via:
- Local: `type-check`, `build`, `build:samples`, `docs:check`, `check-layers`,
  and targeted unit specs for the new slots.
- CI (River): unit + e2e/axe over a sample that exercises an overridden
  cell/field to prove a11y is preserved through the slot.

## Acceptance

- `DsForm` exposes `#field-<name>` (+ `#before-fields`/`#after-fields`) with the
  schema default preserved; a sample overrides one field without leaving L2.
- `DsCrudPage` forwards `#cell-<field>`/`#header-<field>`, `#row-actions`,
  `#header-actions`, `#form-field-<name>`, and `#empty`/`#loading`/`#error`;
  a sample renders a custom status cell + an extra row action via slots only.
- `DsTable` slot contract documented; `#empty` present.
- `docs/architecture/extension-model.md` states the props-vs-slots rule + the
  primitives non-goal; linked from `layers.md` + `binding-contract.md`.
- Primitives gained **no** new arbitrary slots (governance held).
- No behavior change for existing consumers (all slots opt-in with current
  defaults). PRs base `main`; not merged by the agent.

## Risks / Notes

- **Over-opening risk:** forwarding *everything* re-creates the L1 escape hatch
  and dilutes governance — forward only the curated set above; leave the rest to
  the deliberate L1 drop-down.
- Slot names must be **stable public API** — pick them once (`#cell-<field>`,
  `#field-<name>`) and document; renaming later is a breaking change.
- Schema-driven **filters** on the resource do not exist yet; `#filter-<field>`
  should land with (or after) a resource-level filter schema, not before.
- Sequence: **DsForm** first (self-contained), then **DsCrudPage** forwarding
  (depends on DsForm's `#field-<name>`), then the doc + guardrail. Can be >1 PR.

## Progress Checklist

Progress: 0% (0/5 checked)

- [ ] `DsForm`: `#field-<name>` (+ `#before-fields`/`#after-fields`) scoped slots, schema default preserved
- [ ] `DsCrudPage`: forward the curated slot set (table cell/header, row-actions, header-actions, form-field, states)
- [ ] `DsTable`: confirm/add `#empty`; document the scoped-slot contract
- [ ] `docs/architecture/extension-model.md` (props-vs-slots rule + primitives non-goal); link from layers + binding-contract
- [ ] Advisory guardrail: primitives must not accrue arbitrary slots (review-rule first)