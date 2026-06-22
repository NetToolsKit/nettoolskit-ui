# NetToolsKit UI Library A11y Browser Gates - Spec

Generated: 2026-06-21 21:43 America/Sao_Paulo
LastUpdated: 2026-06-21 21:43 America/Sao_Paulo
Status: active
Priority: medium
Branch: `TBD`
Workstream ID: `nettoolskit-ui-library-a11y-browser-gates`
Related Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md`
Related Baseline: `planning/specs/active/nettoolskit-ui-library-only-surface-2026-06-21.md`

## Objective

Add library-owned accessibility and browser validation gates that verify the
design-system sample/catalog without reintroducing product Playwright suites,
CMS tests, or template runtime fixtures.

## Normalized Request Summary

The cleanup removed product e2e and visual regression gates because they tested
CMS/template/landing runtime behavior. The frontend standard still expects
accessibility and browser-level confidence. This spec defines a replacement
that belongs to the library itself: small, deterministic, focused on `Ds*`
components and recipes.

## Design Intent

Browser gates should prove the design system is usable and accessible in the
rendered DOM, without becoming a product test suite. They should validate the
catalog/sample host, key component states, focus behavior and basic responsive
layouts.

The desired split:

```txt
Vitest/unit -> contracts, recipes, component state
Architecture tests -> governance and package boundaries
Browser/a11y gate -> rendered accessibility and interaction smoke
Product e2e -> downstream products such as NetToolsKit.One
```

## Key Decisions

- Browser gates must target only library sample/catalog routes and local static
  fixtures.
- No CMS, product landing, template runtime, backend, authentication or
  provider flows are allowed.
- Accessibility checks should cover rendered components, labels, keyboard
  focus, dialog behavior, empty/error states and contrast where tooling allows.
- Visual checks, if added, should be small smoke snapshots or DOM assertions,
  not broad product screenshot suites.
- GitRiver/GitHub gates must remain fast enough for ordinary PRs.

## Design Slice Matrix

| Slice | Target paths | Standardization impact | Security impact | Performance impact | Acceptance signal |
|---|---|---|---|---|---|
| Test harness | browser test config and scripts | Restores browser validation without product scope | Avoids external URLs/secrets | Keeps browser install/use explicit | Dedicated script runs locally |
| Catalog targets | `samples/**` | Tests approved rendered recipes | Uses static fixtures only | Small number of pages/components | Browser smoke covers sample build |
| A11y assertions | browser specs | Enforces WCAG-oriented usability checks | Reduces inaccessible flows reaching products | Runs focused checks only | Labels/focus/dialog/landmark checks pass |
| CI integration | `.gitriver/**`, `.github/**`, package scripts | Adds optional or staged library gate | Avoids product CI coupling | Gate remains bounded | CI stage documents when browser gate runs |
| Documentation | README and generated docs | Tells devs which UX guarantees are validated | Avoids overstating product coverage | Reduces manual QA ambiguity | Docs clarify library vs product e2e |

## Alternatives Considered

| Alternative | Decision | Reason |
|---|---|---|
| Keep removed Playwright product suites | Rejected | They depended on product/CMS/template runtime surfaces removed from the repo. |
| Rely only on Vitest/jsdom | Rejected | jsdom does not prove rendered browser accessibility and focus behavior. |
| Add large visual regression suite immediately | Deferred | It can be expensive and brittle before the catalog is stable. |
| Move all browser testing downstream | Rejected | The library still owns component accessibility guarantees. |

## Risks

- Browser gates can become slow if they cover too many recipes.
- Snapshot tests can become noisy if visual tokens are still changing.
- Tooling dependencies can add install weight if not scoped carefully.
- CI/River environments may need explicit browser cache/install handling.

## Acceptance Criteria

- A library-only browser/a11y script exists and targets sample/catalog routes.
- Browser tests do not reference removed product paths or CMS/template runtime.
- Core `Ds*` interactions have at least smoke coverage for focus, labels,
  disabled/loading/error states and dialog behavior when available.
- CI documentation states whether the gate is ordinary PR, manual fallback or
  staged River execution.
- `npm run verify` remains green, with browser gate placement intentionally
  documented.

## Planning Readiness

Ready for execution planning after the developer recipe catalog has at least
one stable route/page to test.

## Recommended Specialist Focus

- Super Agent controller
- Frontend Vue/Quasar engineer
- Test engineer for browser/a11y harness
- Ops/DevOps engineer for GitRiver/GitHub integration