# NetToolsKit UI Front Creation System - Spec

Generated: 2026-06-23 America/Sao_Paulo
LastUpdated: 2026-06-23 America/Sao_Paulo
Status: active
Priority: high
Branch: `feat/ds-component-usability-expansion`
Workstream ID: `nettoolskit-ui-front-creation-system`
Related Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`
Related Specs:
- `planning/specs/active/2026-06-21-nettoolskit-ui-ds-component-usability-expansion.md` (foundation, done)
- `planning/specs/active/2026-06-21-nettoolskit-ui-developer-recipe-catalog.md` (consumed by L3)

## Objective

Turn the `Ds*` design-system library into a **front creation system**: building a
real application screen should require minimal ceremony and zero custom CSS. A
developer installs the library in one line and describes *what* a screen is
(its fields, columns, actions) as data; the system renders *how* it looks and
behaves (layout, density, theme, validation, loading/empty/error states,
accessibility) from the existing semantic components.

## Normalized Request Summary

The library currently exposes ~30 components and composables as a flat list of
named exports with no install plugin and no high-level composition layer. To
"abstract complexity and keep the APP simple" we add three layers on top of the
existing primitives, plus a catalog that proves them. Nothing in the existing
`Ds*`/recipe/token foundation is replaced — this is an additive composition and
ergonomics layer.

## Design Intent

```txt
main.ts:    app.use(createNetToolsKitUI({ theme: 'auto' }))   // L0: one-line setup

screen:     <DsCrudPage :resource="clients" />                 // L2: schema → screen
            const clients = defineResource({
              title: 'Clientes',
              columns: [{ field: 'name', label: 'Nome' }],
              form:    [{ field: 'name', type: 'text', required: true }],
              fetch:   api.clients.list,
            })

escape:     <DsFormPage> ...compose Ds* by hand... </DsFormPage> // L1: full control
```

The schema layer (L2) is built on the screen composites (L1), which are built on
the existing `Ds*` primitives (L0). Each layer is independently usable, so the
schema renderer is an accelerator, never a cage: dropping to manual composition
is always available.

## Layered Architecture

| Layer | Deliverable | Location | Depends on |
|---|---|---|---|
| L0 | `createNetToolsKitUI()` install plugin | `src/design-system/vue/plugin/**` | existing `Ds*`, theme/color-scheme composables |
| L1 | `DsFormPage`, `DsCrudPage` screen composites | `src/design-system/vue/components/**` | `Ds*` primitives, recipes |
| L2 | `defineForm`/`defineResource` schema core + `DsForm` renderer | `src/design-system/core/schema/**` (pure) + `src/design-system/vue/components/DsForm.vue` | L1, `useFormRules` |
| L3 | Recipe catalog (CRUD/form/dashboard/dialog) | `samples/**` | L0–L2 |

## Key Decisions

- The schema model (`defineForm`/`defineResource`, field types, validation
  resolution) is **pure** and lives in `core/` with no Vue/DOM/Quasar imports,
  per STANDARD §8–§9. Vue renderers consume it.
- Field types are a **closed enum** (`text`, `number`, `select`, `multiselect`,
  `date`, `time`, `textarea`, `checkbox`, `switch`) each mapped to an existing
  `Ds*` field component. No arbitrary component injection in the base contract.
- The install plugin is **SSR-safe and idempotent**; component registration is
  opt-out (`registerComponents: false`) for tree-shaking-sensitive consumers.
- Validation reuses `useFormRules`/pure rule builders; messages explain how to
  correct, per STANDARD §17.9 / §19.6.
- Schema renderers own loading/empty/error/disabled/submitting states via
  `DsStateBlock`/`DsEmptyState` so product code never hand-rolls them.
- Public API additions are versioned and snapshot-gated (existing
  `ds-public-api.spec.ts`).

## Design Slice Matrix

| Slice | Target paths | Standardization impact | Security impact | Performance impact | Acceptance signal |
|---|---|---|---|---|---|
| L0 install plugin | `src/design-system/vue/plugin/**`, `index.ts` | One-line, consistent app setup | No arbitrary global side effects; opt-out registration | Registration is O(components), tree-shakeable when disabled | Unit tests: registers, applies options, idempotent, SSR-safe |
| L2 schema core | `src/design-system/core/schema/**` | Typed, closed field/validation vocabulary | No `eval`/dynamic component from untyped strings | Pure functions, cheap, memoizable | Contract tests cover every field type + validation path |
| L1/L2 renderers | `src/design-system/vue/components/**` | CRUD/form screens with no local CSS | Encapsulates Quasar; no raw style strings | Avoids per-screen layout debt | Mount tests: states, validation, events; axe clean |
| L3 catalog | `samples/**` | Teaches approved composition | Static fixtures only, no secrets | Keeps `build:samples` a fast gate | `npm run build:samples` passes, recipes render |

## Alternatives Considered

| Alternative | Decision | Reason |
|---|---|---|
| Composite components only (no schema) | Rejected | Still verbose per screen; user asked for maximum abstraction. |
| Schema-only (no manual escape hatch) | Rejected | Removes flexibility for non-standard screens; cages developers. |
| Visual drag-and-drop builder | Deferred | High cost; engineering-first config covers the need now. |
| Put screen builders in product repos | Rejected | The point is a shared, governed creation system in the library. |

## Risks

- Schema scope can creep into product/domain logic — keep field types closed and
  domain mapping in product code.
- Renderers can re-introduce arbitrary styling through props — reuse recipes.
- Over-abstraction can hurt debuggability — keep the escape hatch (L1) first-class.
- CRUD page is stateful; race conditions on fetch/submit need cancellation tests.

## Acceptance Criteria

- `createNetToolsKitUI()` installs the system in one `app.use(...)` call and is
  covered by unit tests (registration, options, idempotency, SSR-safety).
- `defineForm`/`defineResource` are pure, typed, and have contract tests for
  every field type and validation outcome.
- `DsForm` renders a schema, validates, and emits `submit`/`update:modelValue`;
  `DsCrudPage` drives list+filter+create/edit+delete with loading/empty/error.
- New components are in the public API snapshot and generated docs.
- Recipe catalog renders CRUD/form/dashboard/dialog with library components only.
- `npm run verify` passes (incl. coverage gate and axe checks).

## Phasing (execution order)

1. **L0** install plugin — foundation, no design risk.
2. **L2-core** schema model + validation (pure, in `core/`).
3. **L2-vue** `DsForm` renderer over existing field components.
4. **L1** `DsFormPage` + `DsCrudPage` composites.
5. **L3** recipe catalog in samples.

## Out of Scope (tracked by sibling specs)

- Industrial/SCADA desktop components → `industrial-desktop-components` spec.
- Legacy `Ntk*` convergence → `legacy-ntk-governance-hardening` spec.
- Browser/visual a11y gates (Playwright) → `library-a11y-browser-gates` spec.
- Supply-chain/security hardening → proposed security spec.

## Recommended Specialist Focus

- Frontend Vue/Quasar engineer (renderers, plugin)
- Test engineer (schema contracts, CRUD race conditions, axe)
- Docs/release engineer (catalog, generated docs)

## Progress (2026-06-23)

- [x] L0 install plugin (`createNetToolsKitUI`) — implemented + tested.
- [x] L2-core schema model + validation (pure) — implemented + tested.
- [x] L2-vue `DsForm` renderer (DsInput extended with `type`/`multiline`) — implemented + tested (incl. axe).
- [x] L1 `DsCrudPage` + `DsFormPage` composites — implemented + tested (incl. stale-fetch guard).
- [ ] L3 recipe catalog in samples — pending.
- New components added to the public API snapshot gate; `npm run verify` is green.