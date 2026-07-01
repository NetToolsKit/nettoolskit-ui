# ADR-0006: Native-element primitives; Quasar reduced to optional service adapters

- Status: accepted
- Date: 2026-07-01
- Deciders: Frontend architecture

## Context

ADR-0001 established `Ds*` as the public contract with Quasar encapsulated as
the rendering engine *inside* the wrappers (`DsButton` → `QBtn`, `DsTable` →
`QTable`, …). The implementation has since moved past that mechanism: every
`Ds*` primitive renders **native elements** (`<button>`, `<table>`, `<dialog>`
with `showModal()`, native inputs) styled exclusively by `--ntk-*` tokens and
pure class recipes. Quasar survives only at five service touchpoints (`Notify`,
`Dark`, the `QTableColumn` type, and `useQuasar` inside
`useDialogActions`/`useResponsive`). The framework-agnostic core extraction and
the React binding pilot both depend on this native position. NTK-FE-STD-002
(§9/§10) and ADR-0001 still describe the wrapper era, which misleads code
generators and agents that treat them as normative.

## Decision

`Ds*` primitives render native HTML elements styled by tokens and class
recipes; no `Ds*` component wraps a Quasar visual component. Quasar is a
peer-level, **optional service dependency** accessed only through adapters and
composables (`QuasarNotificationAdapter`, theme-dom `Dark` sync,
`useDialogActions`, `useResponsive`); it never defines the visual contract.
The public contract remains the closed semantic props (`variant`, `intent`,
`size`, `density`) — unchanged from ADR-0001.

## Consequences

- Positive: no Quasar runtime cost in primitives; native a11y semantics
  (dialog focus trap, table/aria) come from the platform; the pure core +
  token CSS port to other frameworks (binding contract) without a Quasar
  dependency; Quasar can become an optional peer.
- Trade-offs: capabilities previously inherited from Quasar widgets (virtual
  scroll, date locales, ripple) must be implemented or deliberately declined
  per component contract.
- Enforcement: `lint:css` (no `.q-*`/`<q-*` in components), ESLint boundaries
  (no `quasar` import in `core`), `scripts/check-layers.mjs` purity gate, and
  the Ds* public-API snapshot suite.

## Alternatives considered

- Keep Quasar as the rendering engine inside `Ds*` (ADR-0001 mechanism) —
  rejected: blocks the framework-agnostic core goal, taxes every primitive
  with Quasar runtime/theming, and duplicates a11y behavior the platform now
  provides natively.
- Fork/vendorize the needed Quasar widgets — rejected: maintenance surface
  without the upgrade path.

## Supersession

Supersedes the *mechanism* of ADR-0001 (Quasar as the engine inside `Ds*`).
The *contract* half of ADR-0001 (closed `Ds*` public API; features never touch
Quasar directly) remains in force and is restated here.