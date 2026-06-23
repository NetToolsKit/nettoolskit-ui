# ADR-0002: Schema-driven front creation system

- Status: accepted
- Date: 2026-06-23
- Deciders: Frontend architecture

## Context

Building real screens still required hand-wiring components, layout, validation
and states. The goal is to make a screen describable as data.

## Decision

Layer a schema-driven system on the `Ds*` primitives: `createNetToolsKitUI()`
(one-line install), pure `defineForm`/`defineResource` in `core/`, and renderers
`DsForm`/`DsCrudPage`/`DsFormPage`. The schema layer is an accelerator on top of
composites, never a cage — manual composition stays first-class.

## Consequences

- Positive: a CRUD screen is a `defineResource({...})` + `<DsCrudPage>`; no CSS.
- Trade-offs: closed field-type enum; complex inputs need explicit extension.
- Enforcement: schema core is pure (import-boundary lint) and 100%-covered;
  renderers have mount + axe tests; public API is snapshot-gated.

## Alternatives considered

- Composite components only — rejected: still verbose per screen.
- Schema-only with no escape hatch — rejected: removes flexibility.