# NetToolsKit UI React Binding Pilot - Spec

Generated: 2026-06-28 America/Sao_Paulo
LastUpdated: 2026-06-28 America/Sao_Paulo
Status: backlog
Priority: low
Workstream ID: `nettoolskit-ui-react-binding-pilot`
Phase: multi-framework

## Objective

Prove that the framework-agnostic foundation actually pays off: stand up a
`@nettoolskit/react` package that consumes the **same** `@nettoolskit/core`
(contracts + recipes + schema) and `@nettoolskit/tokens` (CSS vars) as Vue, and
deliver enough of it to validate the model end-to-end — without committing to
porting all 48 components up front.

"Possible" must become "demonstrated on one real path." If the pilot reveals the
core abstraction is leaky for React (e.g. recipes assume Vue semantics), that is
the finding — better learned on 1 component than 48.

Depends on [[nettoolskit-ui-framework-agnostic-core-extraction]] (the binding
contract + pure core must exist first).

## Scope

1. **Bootstrap `@nettoolskit/react`** as a sibling of `vue/`:
   - `src/design-system/react/**` (mirrors `vue/` structure) or a workspace
     package, matching whatever boundary decision the extraction spec landed.
   - React + TS + build (tsup or vite-lib), consuming `@nettoolskit/core` and
     loading `@nettoolskit/tokens` CSS. No re-implementation of contracts/recipes.

2. **Pilot component slice (vertical, not horizontal):** pick a path that
   exercises every layer once, not 48 shallow widgets:
   - **L0 primitive:** `<Button>` — renders via `getNtkButtonClasses()` (the SAME
     pure function Vue uses). Proves recipe reuse.
   - **L2 schema:** a `<Form>` driven by `defineForm` normalized output. Proves
     the schema core is render-agnostic.
   - **L1 composite:** a minimal `<CrudPage resource={defineResource(...)} />`.
     Proves the screen-composite contract ports.
   - Tokens: confirm `--ntk-*` theming (`data-theme`/`data-brand`/`data-density`)
     works unchanged in a React tree.

3. **Parity harness:** a tiny React sample app rendering the same Button/Form/CRUD
   as a Vue recipe, side by side, asserting identical class output + identical
   rendered theme (the recipe functions must return byte-identical class strings
   across frameworks — that is the core promise).

4. **Tests + a11y:** unit tests for the React bindings; reuse the axe/e2e
   approach (`tests/e2e`) against the React sample so the a11y bar is the same.

5. **Decision gate (explicit non-goal: full port):** end with a written
   go/no-go: did the core abstraction hold? what would porting the remaining
   components cost? Only then decide whether to schedule the full React surface.

## Verification (env constraints)

Local vitest does NOT run here (Node 26 + network mount). Verify via:
- Local (works): build the React package + sample (`build` / `build:samples`
  equivalents), `lint`, `lint:css`, `docs:check`.
- CI (Linux): `ci-tests.yml` + River. River `test` stage runs e2e/axe; extend it
  (or add a parallel job) to cover the React sample's a11y scan from `tests/e2e`.
- Parity assertion: the React and Vue recipes must produce identical
  `getNtk*Classes()` output for the same props (unit-tested).

## Acceptance

- `@nettoolskit/react` builds and renders Button (L0) + Form (L2) + CrudPage (L1)
  from the shared `core` + `tokens`, with no duplicated contract/recipe logic.
- A side-by-side parity sample shows identical class output + identical theming
  vs the Vue recipe; axe clean on the React sample.
- A written go/no-go on the full port (cost estimate + any core leaks found).
- One PR (base `main`); not merged by the agent.

## Risks / Notes

- If `getNtk*Classes()` or schema output encodes Vue-only assumptions, fix in
  `core/` (benefits Vue too) rather than forking logic into React.
- Keep it a pilot: resist porting all 48 components in this spec. The deliverable
  is proof + a costed decision, not coverage.
- Angular/Svelte follow the same template once React validates the contract.

## Progress Checklist

Progress: 0% (0/5 checked)

- [ ] Bootstrap `@nettoolskit/react` package consuming core + tokens
- [ ] Pilot vertical slice: Button (L0) + Form (L2) + CrudPage (L1)
- [ ] Side-by-side parity sample (identical class output + theming)
- [ ] React unit tests + axe/e2e on the React sample
- [ ] Written go/no-go on the full React port (cost + core-leak findings)