# NetToolsKit UI Layout Reference Convergence - Spec

Generated: 2026-06-26 America/Sao_Paulo
LastUpdated: 2026-06-26 America/Sao_Paulo
Status: active
Priority: high
Workstream ID: `nettoolskit-ui-layout-reference-convergence`
Phase: P0

## Objective

Converge the project's **layout/visual to 100%** of the prepared reference at
`.temp/nettoolskit-ui` (the canonical `@nettoolskit/vue-ui` package + the
`NetToolsKit Design System (standalone).html` living catalog), with code
**organized and well-defined** per `NTK-FE-STD-001` and its implementation
evidence `NTK-FE-STD-001.1`.

## Authority decision (non-destructive)

User decision (2026-06-26): keep the existing `--ntk-*` token foundation,
governance gates, and open PRs #80-83. Port the reference's components/screens
into the project translating `--ds-*` -> `--ntk-*`. The token prefix is invisible
to layout, so visual fidelity is identical; a destructive migration to `--ds-*`
was explicitly rejected. See memory `layout-converge-reference`.

## Visual ground truth

Reference rendered to `.build/ref/slice-*.png` (catalog is one 11627px page).
Sticky top control bar: **TEMA** (Claro/Escuro/Alto contraste) · **MARCA** (color
palette + custom + reset) · **DENSIDADE** (Compacto/Confortável/Espaçoso) ·
**FONTE** (IBM Plex Sans/Manrope/Source Sans 3/Libre Franklin) · **IDIOMA**
(PT/EN). Sticky left TOC with collapsible groups + level chevrons. Sections:
Visão geral (Introdução) · Exemplos de telas (Login, Web, E-commerce, Dashboards,
Fluxo/BPM, Visualizador 3D, Industrial) · Fundamentos (Cores & temas, Tipografia,
Espaçamento & raio) · Componentes (Botões, Inputs & forms, Cards, Badges, Modais,
Tabela & estados, Interativos, Feedback).

## Phases

- **P1 · Token & theme foundation** — add `light/dark/hc/machine` themes +
  `purple/blue` brand override + 3 densities + `--ind-*` industrial tokens +
  font context, as **additive** `--ntk-*` themes mapped 1:1 from the reference
  `tokens.css`. Wire samples to `data-theme="light" data-brand="purple"`.
- **P2 · Catalog shell** — exact top control bar + sticky collapsible TOC with
  level controls + hero + info banner + 4 brand lockups.
- **P3 · Fundamentals + component galleries** — Cores & temas, Tipografia,
  Espaçamento & raio; Botões/Inputs/Cards/Badges/Modais/Tabela & estados/
  Interativos (Kanban·Agenda·Desenho)/Feedback galleries.
- **P4 · Example screens** — Login, Web (Clientes), E-commerce, Dashboards
  (charts), Fluxo/BPM, Visualizador 3D, Industrial; each with "Tela cheia".
- **P5 · i18n PT/EN + verification** — PT/EN dictionary + locale numbers/dates;
  visual diff vs `.build/ref`, a11y/e2e, governance gates, generated docs.

## Rules / constraints

- `Ds*` in `src/design-system/**` stay governed: token-only CSS, no raw hex,
  no `!important`, no `:deep()` outside DS wrappers, no `.q-*` (lint:css = 0).
- Rich/visual demo CSS lives under `samples/` (not governance-scoped).
- Quasar stays an adapter; features/screens compose `Ds*` only.
- WCAG 2.2 AA across light/dark/hc; closed semantic props; explicit states.

## Acceptance

- Each section renders visually equal to the matching `.build/ref` slice
  (screenshot diff during review).
- `type-check`, `lint`, `lint:css` (=0), `build`, `build:samples`, unit/e2e/a11y
  gates green.
- Delivered as governed PRs (base `main`), one per phase; none merged by the
  agent (user accepts). No AI attribution in commits/PRs.

## Progress Checklist

Acceptance: **pixel-identical** to the reference (not "close"); verify side-by-side per section.

Progress: 50% (3/6 checked)

- [x] P1 · Token & theme foundation (PR #84 — additive light/dark/hc/machine + brand + density + --ind-*; gates green)
- [x] P2 · Catalog shell (PR #84 — top bar TEMA/MARCA/DENSIDADE/FONTE/IDIOMA + sticky collapsible TOC + hero + banner + 4 lockups; live token switching verified vs slice-00)
- [x] P3 · Fundamentals + component galleries (PR #84 — Cores/Tipografia/Espaço + Botões/Inputs/Cards/Badges/Modais/Tabela/Interativos/Feedback; verified pixel-faithful vs slice-05..11)
- [ ] P4 · Example screens (Login · Web · E-commerce · Dashboards · Fluxo/BPM · Visualizador 3D · Industrial; each with "Tela cheia")
- [ ] P3.5 · Governed Ds* parity (DsButton soft/plain, DsCard soft, DsToast/Banner accent-left, DsDialog header/footer, DsTable scroll) — token-only, gates + tests + docs
- [ ] P5 · i18n PT/EN + final verification (a11y/e2e, governance, docs, side-by-side diff sign-off)