# NetToolsKit UI Component Library Completion - Spec

Generated: 2026-06-24 America/Sao_Paulo
LastUpdated: 2026-06-24 America/Sao_Paulo
Status: completed
Priority: medium
Workstream ID: `nettoolskit-ui-component-library-completion`
Phase: P2

## Objective

Close the remaining `Ds*` gaps for a complete general-purpose design system —
including the two capability-parity items not yet built (`DsBadge` and the
`DsToast`/`DsBanner` feedback surface) — so product apps rarely need anything
outside the library.

## Scope (each: contract + recipe + Vue wrapper + tests + axe + public API + docs)

- `DsBadge` — count/status badge (intents, variants solid/soft/outline, dot mode).
- `DsToast` + `DsBanner` + feedback binding — transient toast (aria-live polite,
  bounded lifecycle) and inline banner (intents, dismissible) wired to
  `useNotification`/`NotificationService`. Closes the parity feedback slice.
- `DsTabs` — `tablist`/`tab`/`tabpanel` semantics, keyboard nav, `v-model`.
- `DsTooltip` — accessible, hover/focus, `aria-describedby`, no nested-interactive.
- `DsSkeleton` — loading placeholder (text/block/circle), `aria-busy` friendly.
- `DsAvatar` — initials/image/icon, sizes, status dot.
- `DsBreadcrumbs` — `nav` + ordered list, current marker.
- `DsDatePicker` / `DsTimePicker` — real pickers encapsulating Quasar behind the
  closed `Ds*` field API (upgrade from native inputs); used by `DsForm` field
  types `date`/`time` when opted in.

## Key Decisions

- Same gates as existing `Ds*`: recipe contract tests, mount tests, axe, public-
  API snapshot, generated docs, token-only scoped styles (governance 0).
- Feedback surface keeps the imperative path (`useNotification`) working; the new
  components are the visual layer over it.
- Pickers wrap Quasar **inside** the adapter; the public API stays `Ds*` closed
  props — no Quasar leakage.
- Delivered as several small PRs (Badge; Toast+Banner; Tabs/Tooltip/Skeleton/
  Avatar/Breadcrumbs; Pickers), not one large one.

## Design Slice Matrix

| Slice | Target paths | Standardization | Security | Performance | Acceptance |
|---|---|---|---|---|---|
| Primitives | `core/components/**`, `vue/components/**` | Fills common DS gaps | Closed props, token-only | Tree-shakeable | Recipe+mount+axe pass |
| Feedback | `vue/components/**`, `services/**` | Replaces NtkNotificationCenter UI | aria-live, no data leak | Bounded toasts | Live region + service tested |
| Pickers | `vue/components/**`, `adapters/**` | Real date/time UX | Quasar encapsulated | Lazy where measured | Field types cover date/time end to end |

## Acceptance Criteria

- Each component has contract+recipe+wrapper+tests (incl. axe) and is in the
  public-API snapshot and generated docs.
- `DsToast`/`DsBanner` integrate with `useNotification`; the parity feedback slice
  is marked complete.
- `npm run verify` and `npm run test:e2e` pass; governance baseline stays 0.

## Recommended Specialist Focus

- Frontend Vue/Quasar engineer (components, picker adapters)
- Accessibility/test engineer (live regions, keyboard, axe)
- Docs/release engineer (public API, generated docs)