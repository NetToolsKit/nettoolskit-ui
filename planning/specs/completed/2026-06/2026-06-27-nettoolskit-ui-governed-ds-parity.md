# NetToolsKit UI Governed Ds* Parity - Spec

Generated: 2026-06-27 America/Sao_Paulo
LastUpdated: 2026-06-27 America/Sao_Paulo
Status: completed
Priority: high
Workstream ID: `nettoolskit-ui-governed-ds-parity`
Phase: P3.5

## Objective

The living catalog reaches the reference look, but several visuals are achieved
via **sample-layer overrides** because the governed `Ds*` components lack the
needed capability. Bring those capabilities INTO the governed components (recipes
+ contracts + token-only CSS), so a real product using `Ds*` gets the reference
look natively — then drop the corresponding catalog overrides. Keep all
governance gates green (lint:css = 0, 100% core coverage, generated docs in sync).

## Scope (governed components in `src/design-system/**`)

1. **DsButton** — add `soft` and `plain` variants to the button recipe + contract
   + scoped CSS (token-only). Match the reference button matrix.
2. **DsCard** — add `soft` variant (surface-muted background, no border).
3. **DsBadge** — leading status dot + readable soft foreground (on-soft) for the
   `soft` variant.
4. **DsTable** — sortable column headers with direction affordance, a pagination
   footer contract, and a keyboard-focusable scroll container (`role="region"`),
   plus typed per-cell/column slots.
5. **DsSelect** — themed option panel (no native popup), searchable + multiple
   (extend existing), keyboard + ARIA (combobox/listbox) correct.
6. **DsDialog** — header bar + slim reserved footer regions matching the
   reference modal, token-driven.
7. **DsToast / DsBanner** — neutral surface + single colored left-accent
   treatment (the reference feedback look) as a governed variant.

## Rules / constraints

- Token-only CSS in governed components: no raw hex, no `!important`, no `:deep()`
  outside DS wrappers, no `.q-*` — `lint:css` stays at 0.
- New recipe branches/contracts are covered to keep **100% core coverage**
  (`src/design-system/core/**`). Add unit tests for each new variant.
- Regenerate `docs/COMPONENTS.md` (and any token docs) so `docs:check` passes.
- WCAG 2.2 AA preserved (the `--ntk-on-soft` / contrast work stays valid).
- After landing the governed capabilities, refactor `samples/catalog/**` to use
  the native variants and remove the now-redundant sample overrides — the catalog
  must remain pixel-faithful (verify against the reference).

## Acceptance

- Governed `Ds*` render the reference look without sample overrides for the items
  above; catalog still matches the reference (screenshot check).
- Gates green: `type-check`, `lint`, `lint:css` (=0), `test:coverage` (100% core),
  `build`, `build:samples`, `docs:check`, and `test:e2e` (a11y, 0 violations).
- Delivered as one governed PR (base `main`); not merged by the agent.

## Progress Checklist

Progress: 100% (8/8 checked)

- [x] DsButton soft + plain variants
- [x] DsCard soft variant
- [x] DsBadge dot + soft foreground
- [x] DsTable sort + pagination + scroll region + slots
- [x] DsSelect themed panel (searchable/multiple, ARIA)
- [x] DsDialog header/footer regions
- [x] DsToast/DsBanner left-accent variant
- [x] Catalog refactor to native variants + gates green (incl. 100% core, docs)