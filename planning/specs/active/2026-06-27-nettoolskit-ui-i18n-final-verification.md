# NetToolsKit UI i18n + Final Verification - Spec

Generated: 2026-06-27 America/Sao_Paulo
LastUpdated: 2026-06-27 America/Sao_Paulo
Status: active
Priority: medium
Workstream ID: `nettoolskit-ui-i18n-final-verification`
Phase: P5

## Objective

Close out the layout-convergence program: make the catalog's PT/EN i18n
**complete** (no hardcoded user-facing strings outside the dictionary), ensure
locale-aware number/date formatting where the reference uses it, and run the
**final verification** so the whole catalog passes every gate, signed off
against the reference.

> Stacked on P3.5 (`feat/ds-governed-parity` / #85) because both edit
> `samples/catalog/**` (esp. `catalogI18n.ts`). Accept order: #85 then this PR.

## Scope

1. **i18n coverage audit** — sweep `samples/catalog/**` for user-facing strings
   not routed through `catalogI18n.ts` (section bodies, screen labels, gallery
   captions, empty/error states, aria-labels). Add any gaps to the PT + EN
   dictionaries; the IDIOMA toggle must switch ALL visible copy.
2. **Locale numbers/dates** — where the reference localizes (Web table dates,
   currency `R$`/`$`, dashboard figures), format via `Intl` per `pt-BR`/`en-US`.
3. **Final verification (sign-off)** — confirm green: `type-check`, `lint`,
   `lint:css` (=0), unit + coverage, `build`, `build:samples`, `docs:check`, and
   the browser/a11y gate (`test:e2e`, 0 axe violations). Visually re-check the
   catalog (light/dark/hc × densities, PT/EN) against the reference.

## Rules / constraints

- Local vitest does NOT run in this environment (Node 26 + network mount worker
  timeout); verify units via the Linux `ci-tests.yml` (and River) — not locally.
- Governance unchanged: token-only CSS, lint:css = 0, 100% core coverage, docs in
  sync. No raw hex / `!important` / `:deep()` outside DS / `.q-*`.
- No AI attribution; the agent does not merge.

## Acceptance

- No hardcoded user-facing strings in the catalog; PT↔EN toggles everything;
  numbers/dates localize.
- All gates green (verified via ci-tests Linux + River, since local vitest can't
  run here).
- Delivered as a stacked PR (base `feat/ds-governed-parity`); not merged.

## Progress Checklist

Progress: 0% (0/3 checked)

- [ ] i18n coverage audit + PT/EN gaps closed
- [ ] Locale-aware numbers/dates
- [ ] Final verification sign-off (gates green via CI; visual vs reference)