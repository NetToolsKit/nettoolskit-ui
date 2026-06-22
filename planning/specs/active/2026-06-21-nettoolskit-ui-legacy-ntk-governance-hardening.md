# NetToolsKit UI Legacy Ntk Governance Hardening - Spec

Generated: 2026-06-21 21:43 America/Sao_Paulo
LastUpdated: 2026-06-21 21:43 America/Sao_Paulo
Status: active
Priority: high
Branch: `TBD`
Workstream ID: `nettoolskit-ui-legacy-ntk-governance-hardening`
Related Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`
Related Baseline: `planning/specs/completed/2026-06/2026-06-21-nettoolskit-ui-library-only-surface.md`

## Objective

Reduce the remaining `Ntk*`/Quasar/CSS compatibility debt and harden governance
so the repository moves from "do not get worse" to "actively converge toward
the frontend standard."

## Normalized Request Summary

The current CSS governance baseline is intentionally no-increase. That protects
the cleanup branch from new debt, but it still allows existing debt to remain:
direct Quasar tags, `.q-*` selectors, unmanaged `:deep()`, and `!important`.
This spec registers the follow-up work to burn down that debt and clarify when
developers should use `Ds*`, `Ntk*`, or Quasar.

## Current Baseline

From `tests/architecture/design-system-governance.baseline.json`:

| Metric | Current baseline |
|---|---:|
| `directQuasarTags` | 334 |
| `quasarClassSelectors` | 144 |
| `unmanagedDeepSelectors` | 106 |
| `importantDeclarations` | 110 |
| `rawHexColors` | 0 |

The goal is not to rewrite everything in one PR. The goal is to define an
ordered path that lowers the baseline safely.

## Design Intent

Compatibility components may remain temporarily, but the default development
path should become:

```txt
new product UI -> Ds* component/recipe
legacy library compatibility -> Ntk* only when needed
Quasar direct use -> adapter/wrapper internals only
```

Every reduction should either migrate a component to tokens/recipes or isolate
the unavoidable Quasar coupling behind a documented wrapper boundary.

## Key Decisions

- Keep `rawHexColors` at zero and never reintroduce raw hex debt in governed
  roots.
- Lower one or two metrics per implementation slice instead of attempting a
  large mechanical rewrite.
- New exceptions must include owner, removal spec, reason and target removal
  path.
- Once a metric is reduced, update the baseline downward in the same PR.
- Do not remove public `Ntk*` compatibility exports without a separate breaking
  package-surface decision.

## Design Slice Matrix

| Slice | Target paths | Standardization impact | Security impact | Performance impact | Acceptance signal |
|---|---|---|---|---|---|
| Inventory | `src/components/**`, tests | Maps debt to component owners | Identifies risky style escape hatches | Finds duplicated CSS cost | Report groups debt by component |
| Direct Quasar reduction | `src/components/**/*.vue` | Moves direct `q-*` use into `Ds*` or wrappers | Reduces arbitrary pass-through props | Reduces repeated render/style glue | `directQuasarTags` baseline decreases |
| Selector/deep reduction | `src/components/**/*.vue`, `src/styles/**` | Replaces internals coupling with tokens/classes | Removes brittle internal selector reliance | Reduces cascade complexity | `.q-*` and `:deep()` baselines decrease |
| Important reduction | component styles | Removes override fights | Lowers risk of inaccessible forced states | Improves cascade predictability | `importantDeclarations` baseline decreases |
| Policy hardening | `policies/**`, `scripts/**`, tests | Moves from no-increase toward stricter thresholds | Keeps escape hatches traceable | Keeps governance cheap and deterministic | Architecture tests enforce lowered baseline |

## Alternatives Considered

| Alternative | Decision | Reason |
|---|---|---|
| Fail all existing debt immediately | Rejected | Would block useful work before replacement components exist. |
| Ignore legacy debt after cleanup | Rejected | Developers would keep seeing mixed patterns and bypass the standard. |
| Remove all `Ntk*` components | Rejected | Public compatibility surface may still be needed by downstream consumers. |
| Allow Quasar in product apps with review only | Rejected | The standard requires deterministic guardrails, not just review culture. |

## Risks

- Large refactors can alter visual behavior of compatibility components.
- Lowering baseline without adequate tests can hide regressions.
- Overly strict policy can block necessary adapter work.
- Public package consumers may depend on `Ntk*` behavior while internals change.

## Acceptance Criteria

- Each implementation slice reduces at least one tracked governance metric or
  documents why the metric cannot yet move.
- Updated baselines never increase unless a new traceable exception is approved.
- New `Ds*` usage guidance clearly separates preferred, compatibility and
  internal-only APIs.
- `npm run lint:css`, `npm run test:architecture`, `npm run test`, and
  `npm run verify` pass after each baseline change.

## Planning Readiness

Ready for execution planning after the library-only cleanup PR is merged and
the first component expansion slice identifies replacement wrappers.

## Recommended Specialist Focus

- Super Agent controller
- Frontend Vue/Quasar engineer
- Test engineer for visual/state regression risk
- Review engineer for API compatibility and baseline reductions