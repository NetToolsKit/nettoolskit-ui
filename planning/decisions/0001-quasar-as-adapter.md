# ADR-0001: Quasar as adapter; Ds* is the public contract

- Status: accepted
- Date: 2026-06-23
- Deciders: Frontend architecture

## Context

Quasar is the UI engine, but using QBtn/QInput/QTable directly across features
spreads coupling, arbitrary props, and CSS overrides (`:deep()`, `.q-*`).

## Decision

Quasar is an implementation detail encapsulated behind adapters. The public
visual contract is the `Ds*` component family with closed semantic props
(`variant`, `intent`, `size`, `density`). Features must not use Quasar visual
components or `.q-*` selectors directly.

## Consequences

- Positive: consistent surface; Quasar is upgradable/replaceable; no per-screen CSS.
- Trade-offs: every needed capability must exist as a `Ds*` wrapper.
- Enforcement: CSS governance lint (no `.q-*`/`:deep()`/`!important`/raw hex) and
  ESLint import boundaries (design system must not import legacy/Quasar in core).

## Alternatives considered

- Expose raw Quasar with pass-through props — rejected: recreates coupling.