# ADR-0005: Governed quality gates (verify, coverage, import boundaries)

- Status: accepted
- Date: 2026-06-23
- Deciders: Frontend architecture, QA

## Context

Quality by convention drifts. The platform must make its guarantees executable.

## Decision

`npm run verify` is the single local gate: tokens/docs drift, ESLint (incl.
import boundaries), Stylelint, CSS governance, type-check, coverage-gated tests,
build, build:samples, and a production dependency audit. Public-API changes are
snapshot-gated; the deterministic core (`core/components`, `core/schema`) is held
at 100% coverage. PR gating runs in GitRiver; GitHub workflows are fallbacks.

## Consequences

- Positive: regressions (API breaks, boundary leaks, a11y, debt) fail the build.
- Trade-offs: stricter gates can slow trivial changes; thresholds set per layer.
- Enforcement: this ADR is realized by the `verify` script and CI configuration.

## Alternatives considered

- Rely on review/culture — rejected: not deterministic.