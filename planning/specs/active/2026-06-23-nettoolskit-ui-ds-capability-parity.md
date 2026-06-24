# NetToolsKit UI Ds Capability Parity - Spec

Generated: 2026-06-23 America/Sao_Paulo
LastUpdated: 2026-06-23 America/Sao_Paulo
Status: active
Priority: high
Branch: `TBD`
Workstream ID: `nettoolskit-ui-ds-capability-parity`
Related Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`
Related Specs:
- `planning/specs/active/2026-06-23-nettoolskit-ui-legacy-surface-elimination.md` (consumer; blocked by this)
- `planning/specs/active/2026-06-23-nettoolskit-ui-front-creation-system.md` (uses the parity components)

## Objective

Close the `Ds*` capability gaps that currently force product code to fall back
to `Ntk*`, `Base*`, or raw Quasar. Legacy can only be removed once every
legitimately reusable capability has a governed `Ds*` equivalent (typed
contract + pure recipe + tests + accessibility). This spec is the prerequisite
for `legacy-surface-elimination`.

## Normalized Request Summary

The library has 18 `Ds*` components but 54 legacy components (35 `Ntk*` + 19
`Base*`). Some legacy components have no `Ds*` equivalent yet (app shell, real
date/time pickers, multi-select, chip/steps, server-mode data table, feedback
surface). Until those exist as `Ds*`, removing legacy would break real use
cases. This spec defines exactly which capabilities to build so the legacy
surface becomes removable rather than load-bearing.

## Parity Matrix (legacy capability -> Ds target)

| Legacy capability | Ds target | Status |
|---|---|---|
| Button / Card / Input / Select / Section | DsButton/DsCard/DsInput/DsSelect/DsSection | exists |
| Textarea, Date, Time (Ntk/Base) | DsInput (multiline / type=date / type=time) | exists (native); upgrade to real pickers = build |
| MultiSelect | DsSelect (multiple + searchable) | extend |
| DataTable (server pagination/sort/filter/selection) | DsTable (server mode via useQTableData) | extend |
| Chip / Badge | DsChip / DsBadge | build |
| Steps / Stepper | DsSteps | build |
| Logo | DsLogo (brand-token driven) | build |
| App shell (AppShell, Header, Sidebar, Footer, MobileDrawer) | DsAppShell + DsHeader/DsSidebar/DsFooter/DsDrawer | build |
| NotificationCenter | feedback service surface (useNotification + DsToast/DsBanner) | build |
| SectionHeader / MetricCard / StatCard | DsPageHeader / DsMetricGrid | exists (map, no new build) |
| CTASection, ContactSection, FeatureCard, Hero, InfoCard, LandingHeader, PricingCard, ServiceGrid, StatsSection, TechStack, TestimonialCard, CreditCard | none (marketing/landing, product scope) | out of scope -> delete (handled by elimination spec) |

## Design Intent

```txt
For every retained legacy capability:
  define contract (closed props)  -> core/components
  define recipe (intent -> classes) -> core/components
  build Ds* wrapper (Quasar encapsulated) -> vue/components
  prove states + a11y (mount + axe) -> tests
  add to public API snapshot + generated docs
```

The shell family (DsAppShell and parts) is the largest gap and the main blocker
for real applications; it gets its own slice.

## Key Decisions

- Build only general, domain-neutral platform capabilities. Marketing/landing
  widgets are NOT recreated as `Ds*`; they are removed (elimination spec).
- Extend existing components (DsSelect, DsTable) where the gap is a feature, not
  a new component, to keep the surface minimal (ISP).
- Real date/time pickers and data-table server mode encapsulate Quasar inside
  the adapter; the public API stays `Ds*` with closed props.
- Each capability ships with the same gates as current `Ds*`: recipe contract
  tests, mount tests, axe checks, public-API snapshot.

## Design Slice Matrix

| Slice | Target paths | Standardization impact | Security impact | Performance impact | Acceptance signal |
|---|---|---|---|---|---|
| Primitives (DsChip/DsBadge/DsSteps/DsLogo) | `core/components/**`, `vue/components/**` | Removes Ntk chip/steps/logo reliance | Closed props, no raw style | Tree-shakeable pure recipes | Recipe + mount + axe tests pass |
| Field upgrades (DsSelect multiple/searchable, DsDatePicker, DsTimePicker) | `vue/components/**`, adapters | Replaces Ntk multi/date/time | Encapsulates Quasar pickers | No per-screen field glue | Forms cover all field types end to end |
| DsTable server mode | `vue/components/DsTable.vue`, `composables/data/**` | Replaces NtkDataTable | Controlled requests, cancellation | Virtual/paged where measured | Server pagination/sort/filter tested |
| Shell family (DsAppShell/Header/Sidebar/Footer/Drawer) | `core/components/**`, `vue/components/**` | Replaces Ntk app-shell debt | Landmarks + focus by default | One shell instead of per-app layout | Shell renders, a11y landmarks pass |
| Feedback surface (DsToast/DsBanner + service) | `vue/components/**`, `services/**` | Replaces NtkNotificationCenter | aria-live, no data leak in logs | Bounded toast lifecycle | Feedback service + live region tested |

## Alternatives Considered

| Alternative | Decision | Reason |
|---|---|---|
| Migrate legacy components in place | Rejected | Keeps mixed conventions; goal is a clean `Ds*` surface. |
| Recreate marketing widgets as Ds* | Rejected | Product/landing surfaces belong downstream per library-only baseline. |
| Build a generic "renderless" field and one component | Rejected | Hurts discoverability and typing; closed components are clearer. |
| Skip shell, tell apps to compose Quasar layout | Rejected | That is the exact coupling the platform removes. |

## Risks

- Shell family is broad; scope can creep into product layout opinions.
- Real pickers add Quasar surface; must stay encapsulated and a11y-correct.
- Table server mode is stateful; race conditions need cancellation tests.

## Acceptance Criteria

- Every "exists/extend/build" row in the parity matrix has a `Ds*`
  contract+recipe+wrapper+tests and is in the public API snapshot + docs.
- No retained capability still requires `Ntk*`/`Base*`/raw Quasar in product code.
- New components pass axe checks and the coverage gate.
- `npm run verify` passes.

## Planning Readiness

Ready for execution planning now; sequence primitives -> field upgrades ->
table -> shell -> feedback. Unblocks `legacy-surface-elimination`.

## Recommended Specialist Focus

- Frontend Vue/Quasar engineer (components, adapters)
- Test engineer (states, a11y, table race conditions)
- Docs/release engineer (generated docs, API snapshot)
## Progress (2026-06-24)

- [x] DsChip (replaces NtkChip) — shipped, CI green; samples catalog de-legacy'd.
- [x] DsSteps app stepper — shipped, CI green.
- [x] DsSelect multiple (covers NtkMultiSelect) — shipped, CI green; DsForm
  multiselect now renders DsSelect instead of an inline native select.
- Note: DsDatePicker/DsTimePicker are optional polish, not a blocking gap —
  DsForm already renders accessible native date/time inputs via DsInput.
- [x] DsTable server-mode (replaces NtkDataTable) — shipped; sortable headers
  (`aria-sort`), server pagination footer + loading, driven by DsCrudPage via
  `defineResource` (`pageSize`/`defaultSort`, `{ rows, total }` results). Pure
  helpers (`getNtkTablePageInfo`/`nextNtkTableSort`/`getNtkTableAriaSort`/
  `normalizeFetchResult`) at 100% core coverage; stale-fetch cancellation kept.
- [ ] DsLogo (replaces NtkLogo) — next.
- [ ] App shell: DsAppShell / DsHeader / DsSidebar / DsFooter / DsDrawer — largest.

All shipped on PR #60. Per-commit CI uses the GitHub `ci-tests` workflow
(manual dispatch); GitRiver gates only at PR-open.