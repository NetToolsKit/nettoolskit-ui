# NetToolsKit UI Framework-Agnostic Core Extraction - Spec

Generated: 2026-06-28 America/Sao_Paulo
LastUpdated: 2026-06-30 America/Sao_Paulo
Status: active
Priority: medium
Workstream ID: `nettoolskit-ui-framework-agnostic-core-extraction`
Phase: architecture-foundation

## Objective

Make a second UI framework (React/Angular/Svelte) **cheap to add** by ensuring
everything expensive-to-rewrite already lives in a framework-free layer. This is
the prerequisite for [[nettoolskit-ui-react-binding-pilot]] and is valuable on
its own (it shrinks the Vue surface and clarifies ownership).

Today the foundation is already half-right and that is the whole reason this is
worth doing:

- `src/design-system/core/**` — **0 Vue imports, ~0 DOM** (measured 2026-06-28:
  `5330` LOC, only `workspace-canvas.ts` references the DOM). Pure contracts,
  class recipes (`getNtk*Classes`), schema (`defineForm`/`defineResource`),
  validation, icons. This ports to any framework as-is.
- `src/styles/**` — `--ntk-*` DTCG tokens (~736 declarations across
  `themes.css` + `reference-themes.css`). CSS custom properties are
  framework-agnostic by construction; they port for free.
- `src/design-system/vue/**` — `10432` LOC of `.vue` SFCs + plugin. Vue-only.
- `src/composables/**` — **11 of 14 files import Vue** (`ref`/`computed`). Their
  *logic* is often pure but is currently trapped behind reactive wrappers, so it
  would be re-authored per framework instead of reused.

The gap: logic that should live in `core/` (portable) currently leaks into
composables and SFCs (non-portable). This spec closes that gap **without a React
port** — it only reshapes ownership so the port becomes mechanical.

## Scope

1. **Audit logic leakage out of `core/`.**
   - Enumerate the 11 Vue-coupled composables in `src/composables/{data,forms,services,ui,utils}`
     + `useThemeSwitcher.ts`. For each, separate *pure logic* (state machines,
     derivations, validation, formatting, query/sort/pagination math) from
     *reactivity glue* (`ref`/`computed`/`watch`/lifecycle).
   - Produce a table: composable → pure core it should expose → thin Vue wrapper
     left behind. No code change in this step; it is the migration map.

2. **Push pure logic down into `core/`.**
   - Move the pure parts into `src/design-system/core/**` as plain functions /
     framework-free state factories (e.g. a `createTableState(...)` returning
     `{ next(action) }` rather than a Vue `ref`). Keep the public Vue composable
     name + signature; it becomes a reactive shell over the core function.
   - Constraint: `core/` stays Vue-free and DOM-free (the existing rule). The one
     legit DOM toucher (`workspace-canvas.ts`) is documented as an exception or
     gets a tiny injectable-DOM port.
   - Each moved unit gets a core-level unit test (core already carries the 100%
     coverage gate, so this raises confidence, not burden).

3. **Draw package boundaries (no publish yet — internal restructure).**
   - Define the intended monorepo/package split as the target shape, even if it
     stays a single package for now:
     - `@nettoolskit/core` ← `src/design-system/core/**` (pure: contracts,
       recipes, schema, validation, icons).
     - `@nettoolskit/tokens` ← `src/styles/**` (CSS vars + theme data).
     - `@nettoolskit/vue` ← `src/design-system/vue/**` + Vue composables
       (consumes core + tokens).
     - (future) `@nettoolskit/react`, `@nettoolskit/angular` — siblings of vue.
   - Decide: real workspaces now, or path-alias boundary + lint rule now and
     workspaces later. Recommend the lint-rule-first path (lower risk): an
     import-boundary rule forbidding `core/` from importing `vue/`, `vue` (the
     framework), or anything DOM — enforced in CI like the existing boundaries.

4. **Document the contract that a framework binding must satisfy.**
   - A short `docs/architecture/binding-contract.md`: "to bind a framework, a
     package must (a) consume `getNtk*Classes()` for class strings, (b) consume
     `defineForm`/`defineResource` normalized output for schema rendering,
     (c) load `@nettoolskit/tokens` CSS, (d) implement only render + event glue."
   - This is the spec a future React/Angular package is graded against.

## Verification (env constraints)

Local vitest does NOT run here (Node 26 + network mount). Verify via:
- Local (works): `npm run build`, `npm run build:samples`, `npm run lint`,
  `npm run lint:css`, `npm run docs:check`.
- CI (Linux): `ci-tests.yml` (lint + type-check + unit incl. the moved core
  logic) + River (`river/*` stages). The 100% core-coverage gate must stay green
  after logic moves into `core/`.
- New gate: the `core/` import-boundary rule fails CI if `core/` reaches into
  Vue/DOM.

## Acceptance

- A written migration map (composable → pure core + thin wrapper) exists.
- The clearly-pure logic from the audited composables lives in `core/`; the Vue
  composables are reduced to reactive shells with unchanged public signatures.
- An import-boundary rule enforces `core/` purity in CI.
- `docs/architecture/binding-contract.md` defines what any framework binding must
  implement. No behavior change for existing Vue consumers (public-api spec +
  samples unchanged). No new framework added in this spec.
- One PR (base `main`); not merged by the agent.

## Risks / Notes

- Over-extraction can hurt debuggability — only move logic that is genuinely
  pure; leave Vue-idiomatic glue in the composable.
- Do not change `package.json` published paths (`main`/`module`/`types`/`exports`)
  in this spec; the package split is design + internal boundaries only.
- Sequenced before [[nettoolskit-ui-react-binding-pilot]]; pairs with
  [[nettoolskit-ui-layer-taxonomy-formalization]] (the layer doc should reference
  the binding contract).

## Progress Checklist

Progress: 75% (3/4 checked) — design + guardrails landed; the logic-move is the
remaining (deferred) execution step.

- [x] Audit logic leakage; produce composable→core migration map —
  `docs/architecture/core-extraction-migration-map.md` (14 composables classified
  MOSTLY-PURE / MIXED / VUE-IDIOMATIC + ranked extraction order)
- [ ] Push pure logic into `core/` (+ core unit tests), Vue composables as shells
  — **deferred** (separate sequenced change so each move carries a core unit test
  under the 100% coverage gate). Order defined in the migration map.
- [x] Define package boundaries + add `core/` import-boundary CI rule — boundaries
  documented in `binding-contract.md`; the `core-purity` rule shipped in
  `scripts/check-layers.mjs` (layer-taxonomy formalization) and enforces
  `core/**` Vue-free/DOM-free in River + `verify`.
- [x] Write `docs/architecture/binding-contract.md` — the rubric a framework
  binding is graded against.