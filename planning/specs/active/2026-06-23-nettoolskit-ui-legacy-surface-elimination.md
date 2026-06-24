# NetToolsKit UI Legacy Surface Elimination - Spec

Generated: 2026-06-23 America/Sao_Paulo
LastUpdated: 2026-06-23 America/Sao_Paulo
Status: active
Priority: high
Branch: `TBD`
Workstream ID: `nettoolskit-ui-legacy-surface-elimination`
Related Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`
Supersedes: `planning/specs/active/2026-06-21-nettoolskit-ui-legacy-ntk-governance-hardening.md`
Blocked by: `planning/specs/active/2026-06-23-nettoolskit-ui-ds-capability-parity.md`

## Objective

Remove the legacy `Ntk*`/`Base*` component surface and its Quasar/CSS debt from
the published library, so the only public visual surface is the governed `Ds*`
system. This is the breaking package-surface decision the governance-hardening
spec deferred: we move from "do not get worse" to "the legacy is gone."

## Normalized Request Summary

The library still exports 35 `Ntk*` + 19 `Base*` components carrying the
governance debt tracked in the baseline (directQuasarTags 334,
quasarClassSelectors 144, unmanagedDeepSelectors 106, importantDeclarations 110).
With the capability-parity spec closing the `Ds*` gaps, that legacy surface is
no longer load-bearing and should be deprecated and removed under a controlled,
deterministic lifecycle.

## Classification

| Bucket | Components | Action |
|---|---|---|
| Has Ds* equivalent | Button, Card, Chip, Input, Select, MultiSelect, Textarea, DatePicker, TimePicker, DataTable, Section, SectionHeader, MetricCard, StatCard, Logo, Steps (Ntk + Base twins) | migrate usage to `Ds*`, then delete |
| App shell | AppShell, AppSidebar, Header, Footer, Sidebar, MobileDrawer, NotificationCenter | replace with `Ds*` shell/feedback (parity), then delete |
| Marketing/landing (out of library scope) | CTASection, ContactSection, FeatureCard, Hero, InfoCard, LandingHeader, PricingCard, ServiceGrid, StatsSection, TechStack, TestimonialCard, CreditCard | delete; product-owned downstream |

## Design Intent

```txt
Phase 0  deprecate + guard: no NEW legacy usage can enter the codebase
Phase 1  delete out-of-scope marketing widgets (no Ds target)
Phase 2  migrate internal usage to Ds*, delete migrated Ntk*/Base* + exports
Phase 3  burn governance baseline metrics to 0, tighten policy to zero-tolerance
```

## Key Decisions

- This is a BREAKING change to the package surface; it ships behind a major
  (or preview-major) version bump with a migration guide and a codemod that
  rewrites `Ntk*`/`Base*` imports to `Ds*` where a 1:1 mapping exists.
- Deprecation precedes deletion: `@deprecated` JSDoc + a dev-only console
  warning on legacy component mount + an ESLint `no-restricted-imports` rule
  banning new `Ntk*`/`Base*` imports.
- Marketing/landing components are deleted outright (consistent with the
  library-only-surface baseline that moved product surfaces downstream).
- Each deletion slice lowers the governance baseline in the same PR; the
  baseline only ever moves down. End state: all metrics 0.
- No silent behavior changes: migration guide documents every prop/slot/event
  delta between a legacy component and its `Ds*` replacement.

## Design Slice Matrix

| Slice | Target paths | Standardization impact | Security impact | Performance impact | Acceptance signal |
|---|---|---|---|---|---|
| Deprecation + guard | `src/components/**`, eslint config, `index.ts` | Stops new legacy adoption | Surfaces escape hatches | No runtime cost in prod build | Lint blocks new `Ntk*/Base*` imports |
| Marketing deletion | `src/components/**`, `index.ts`, tests | Removes product-scope widgets | Removes unmaintained surfaces | Shrinks bundle | Components + exports + tests removed; build green |
| Migrate + delete twins | `src/components/**`, `index.ts` | Collapses surface to `Ds*` | Removes Quasar pass-through props | Removes duplicated CSS/render glue | Governance metrics decrease each PR |
| Baseline to zero | `policies/**`, `tests/architecture/**`, `scripts/**` | Zero-tolerance governance | No remaining `.q-*`/`:deep()`/`!important` outside adapters | Predictable cascade | Baseline metrics = 0; policy enforces it |
| Release + migration | `README.md`, `CHANGELOG`, `docs/**`, codemod | Communicates breaking change | Documents safe upgrade | One-time migration cost | Migration guide + codemod published |

## Alternatives Considered

| Alternative | Decision | Reason |
|---|---|---|
| Keep `Ntk*` exports indefinitely as compatibility | Rejected | Perpetuates mixed conventions and the debt baseline. |
| Delete everything in one PR | Rejected | Unsafe; deprecation + phased burn-down is deterministic and reviewable. |
| Migrate marketing widgets to `Ds*` | Rejected | They are product/landing surfaces, out of library scope. |
| Soft-deprecate without lint guard | Rejected | Culture alone re-introduces debt; guardrails must be executable. |

## Risks

- Downstream consumers may import `Ntk*`; the breaking bump + codemod + guide
  mitigate but require coordination.
- Large deletions can alter visual behavior; parity components and tests must
  land first (hence the blocked-by dependency).
- Baseline reductions without tests can hide regressions.

## Acceptance Criteria

- `index.ts` exports only `Ds*`, composables, services, tokens, and types — no
  `Ntk*`/`Base*` component exports.
- Governance baseline metrics are all 0 and the policy enforces zero tolerance
  (no `.q-*`/`:deep()`/`!important`/raw hex outside documented adapters).
- An ESLint rule prevents reintroducing legacy imports.
- A migration guide + codemod map every removed component to its `Ds*`
  replacement (or marks it product-scope/removed).
- `npm run verify` passes after every slice and at the end state.

## Planning Readiness

Execution starts after `ds-capability-parity` lands the replacement components.
Phase 0 (deprecation + lint guard) can start immediately in parallel.

## Recommended Specialist Focus

- Frontend Vue/Quasar engineer (migration, deletions)
- Review engineer (API/package surface, breaking change)
- Test engineer (visual/state regression, baseline reductions)
- Docs/release engineer (migration guide, codemod, changelog)

## Progress (2026-06-24)

Executed after `ds-capability-parity` landed (all replacements shipped). Because
the legacy tests were grouped by category rather than scope, the marketing-only
and twin-only slices would have required surgical edits of shared test files with
no safety benefit now that parity is complete — so the deletion was consolidated
into one reviewable PR, with docs/codemod following.

- [x] **Deletion + index rewrite (this PR):** removed the entire `src/components`
  tree (54 `Ntk*`/`Base*`/marketing components + `app-shell.*`), the legacy
  `useNtkField`/`useBaseField` composables, and all legacy component tests
  (~31 files). `index.ts` now exports only the design system (`Ds*`, tokens,
  recipes, schema, install plugin), kept composables/services/utils/config, and
  the Quasar notification adapter. Samples migrated to `Ds*`-only.
- [x] **Governance baseline → 0:** scan root moved to `src/design-system/vue/
  components`; all metrics (directQuasarTags / quasarClassSelectors /
  unmanagedDeepSelectors / importantDeclarations / rawHexColors) are 0 and the
  policy now enforces zero tolerance. (Fixed a false-positive hex from the
  `&#9776;` entity in DsHeader by using the literal glyph.)
- [x] **Migration guide + codemod + CHANGELOG (this PR):** `MIGRATION.md` maps
  every removed component to its `Ds*` replacement (1:1, manual, or product-scope
  removed) and the removed composables; `scripts/codemod/ntk-to-ds.mjs` rewrites
  the 1:1 `Ntk*`/`Base*`→`Ds*` cases (flagging the rest); CHANGELOG has a
  breaking-change entry; and an ESLint `no-restricted-imports` guard blocks
  reintroducing `src/components` or `Ntk*`/`Base*` imports across app/samples/tests.

**Status: complete** — `index.ts` is `Ds*`-only, the governance baseline is 0
(zero-tolerance), reintroduction is lint-blocked, and the breaking change is
documented with a codemod. Ready to archive.

Notification capability is preserved by the kept `useNotification` composable +
`NotificationService` + `QuasarNotificationAdapter`; only the legacy
`NtkNotificationCenter` UI wrapper was removed. Version stays on the `0.0.x`
preview line (breaking changes acceptable pre-1.0).