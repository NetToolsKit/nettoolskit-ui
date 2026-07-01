# Architecture — Component Extension Model

How a component is allowed to vary by context. The guiding principle is
**closed by default, open by extension**: the value of a governed design system
is consistency, so each layer exposes only the *right* extension points — not a
slot on everything, which would re-create raw markup and throw governance away.

## The decision rule

| Vary by… | Mechanism | Where |
|---|---|---|
| Governed variation (visual/behavioral consistency) | **props** | L0 primitives (`intent`, `size`, `variant`, `density`, `loading`, …) |
| Layout composition | **named slots** | L1 layout (`header` / `actions` / `footer` / …) |
| Data/render of a specific piece | **scoped override slots** | L2 data/schema (`#cell-<field>`, `#field-<name>`) |
| Truly bespoke | **escape hatch (drop to L1)** | compose `Ds*` by hand |

Non-goal — **do not slot-ify primitives.** A `DsButton`/`DsInput` that accepts
arbitrary internal slots stops being governed. If a screen needs a "different"
primitive, that is a missing **prop/variant** (extend the contract) or it is
not that primitive.

## Scoped-slot contracts (stable public API)

Slot names below are public API: renaming any of them is a breaking change.

### `DsTable`

| Slot | Scope | Default |
|---|---|---|
| `#cell-<columnId>` | `{ row, column, value }` | formatted cell value |
| `#header-<columnId>` | `{ column }` | column label |
| `#empty` | — | `emptyLabel` text |

### `DsForm`

| Slot | Scope | Default |
|---|---|---|
| `#field-<name>` | `{ field, value, error, disabled, update }` | the schema-driven `Ds*` control |
| `#before-fields` / `#after-fields` | — | nothing (rendered inside the fields grid, around the generated fields) |

`update(value)` writes back through the same `update:modelValue` path as the
generated control, so an overridden field keeps v-model, submit-time live
validation and initial-value semantics. `field.type` remains the primary
mechanism — the slot is a targeted override, not a schema replacement.

### `DsCrudPage` (curated forwarding — not everything)

| Slot | Forwarded to / rendered at | Scope |
|---|---|---|
| `#cell-<field>` / `#header-<field>` | `DsTable` (pass-through) | same as `DsTable` |
| `#row-actions` | inside the built-in actions cell, **after** the governed edit/remove buttons (augments; never silently drops them) | `{ row }` — the original domain row |
| `#header-actions` | `DsPageHeader` actions, next to the auto "new" button | — |
| `#form-field-<name>` | `DsForm` `#field-<name>` inside the dialog | same as `DsForm` |
| `#loading` | replaces the default `DsStateBlock` | — |
| `#error` | replaces the default `DsStateBlock` | `{ error, retry }` |
| `#empty` | replaces the default `DsEmptyState` | `{ openCreate }` |

Reserved names: `cell-__actions` stays internal (extend via `#row-actions`);
`header-actions` addresses the page header, never a table column named
`actions`. Anything beyond this curated set is a deliberate drop to L1 —
forwarding *everything* would re-create the escape hatch and dilute governance.

## Cross-framework note

Slots are the *Vue* mechanism; the **contract** is "targeted, named override
points with a default". A React binding exposes the equivalent surface
(children / render props / `renderCell`). The pure core stays slot-agnostic —
slots live only in the framework binding. See
[binding-contract.md](./binding-contract.md).

## Review guardrail (advisory)

Primitives (`Ds*` components mapped to **L0** in
[`planning/architecture/layers.json`](../../planning/architecture/layers.json))
must not accrue arbitrary named slots — they stay prop-governed. Check this in
review for any PR that adds a slot to an L0 component; harden into a lint gate
only if drift appears.

## See also

- [layers.md](./layers.md) — the L0–L3 taxonomy this model plugs into
- [binding-contract.md](./binding-contract.md) — what a framework binding may implement
- [docs/RECIPES.md](../RECIPES.md) — sanctioned composition patterns