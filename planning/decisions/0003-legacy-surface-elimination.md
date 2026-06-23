# ADR-0003: Eliminate the legacy Ntk*/Base* surface

- Status: accepted
- Date: 2026-06-23
- Deciders: Frontend architecture, Release

## Context

The library still exports 35 `Ntk*` + 19 `Base*` components carrying Quasar/CSS
debt (governance baseline: 334 direct Quasar tags, 144 `.q-*`, 106 `:deep()`,
110 `!important`). They duplicate the governed `Ds*` surface.

## Decision

Once `Ds*` reaches capability parity, deprecate and remove the legacy surface:
delete marketing/landing widgets (product scope), migrate the rest to `Ds*`, and
burn the governance baseline to zero. This is a breaking package-surface change
shipped with a migration guide and codemod.

## Consequences

- Positive: one governed surface; zero legacy debt.
- Trade-offs: breaking change for downstream `Ntk*` consumers.
- Enforcement: ESLint `no-restricted-imports` blocks new legacy use; governance
  baseline drops to 0; index.ts exports only `Ds*`/composables/services/tokens.

## Alternatives considered

- Keep `Ntk*` as permanent compatibility — rejected: perpetuates the debt.

## Supersedes

- planning/specs/active/2026-06-21-nettoolskit-ui-legacy-ntk-governance-hardening.md