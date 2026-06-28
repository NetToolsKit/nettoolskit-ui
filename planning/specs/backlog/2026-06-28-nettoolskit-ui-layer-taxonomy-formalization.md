# NetToolsKit UI Layer Taxonomy Formalization (L0–L3) - Spec

Generated: 2026-06-28 America/Sao_Paulo
LastUpdated: 2026-06-28 America/Sao_Paulo
Status: backlog
Priority: medium
Workstream ID: `nettoolskit-ui-layer-taxonomy-formalization`
Phase: architecture-docs

## Objective

The L0–L3 layering exists and is implemented (see the completed spec
`planning/specs/completed/2026-06/2026-06-23-nettoolskit-ui-front-creation-system.md`),
but the taxonomy currently lives **only inside that archived spec**. A developer
opening the repo today has no living doc telling them which layer to reach for,
and nothing enforces that a given file stays in its declared layer. This spec
turns the taxonomy into (a) living documentation with a decision guide and
(b) a lightweight gate that keeps the layers honest.

Canonical taxonomy (from the front-creation-system spec; the numbering is a
dependency order, NOT a "higher = better" ranking — L1 is a first-class escape
hatch, deliberately below the schema layer):

| Layer | What | Where | Use when |
|---|---|---|---|
| **L0** | `Ds*` primitives + `createNetToolsKitUI()` install | `vue/components/**`, `vue/plugin/**` | You need one widget / app setup |
| **L1** | `DsCrudPage` / `DsFormPage` composites (compose `Ds*` by hand) | `vue/components/**` | No template fits → full control |
| **L2** | `defineForm` / `defineResource` schema (pure) + `DsForm` renderer | `core/schema/**` + `DsForm.vue` | A whole screen from a schema |
| **L3** | Recipe catalog (teaches approved composition) | `samples/**` | Learn / copy a sanctioned pattern |

Dependency direction: L2 → L1 → L0; L3 consumes L0–L2; everything pure lives in
`core/` (`L2-core`).

## Scope

1. **Living architecture doc** `docs/architecture/layers.md`:
   - The table above + the dependency diagram + the "use when" decision guide
     ("Is there a recipe? → L3 copy. A whole CRUD/form from data? → L2. Need
     bespoke layout? → L1 compose. Just one control? → L0.").
   - Worked example showing the SAME screen at L2 (`<DsCrudPage :resource>`),
     dropping to L1 (hand-composed), and the L0 building blocks underneath, so
     the escape-hatch path is explicit.
   - Link from `README.md` and reference the binding contract from
     [[nettoolskit-ui-framework-agnostic-core-extraction]] (each layer's pure
     part vs framework part).

2. **Layer manifest (machine-readable):** a small `planning/architecture/layers.json`
   (or front-matter convention) mapping path globs → layer, e.g.
   `core/schema/** = L2-core`, `vue/components/Ds{Crud,Form}Page.vue = L1`,
   `vue/components/Ds*.vue = L0`, `samples/** = L3`.

3. **Layer-boundary gate (lightweight, advisory→enforced):**
   - A `docs:check`-style script (`scripts/check-layers.mjs`) that fails if a
     dependency points the wrong way (e.g. an L0 primitive importing an L1
     composite, or `core/` importing `vue/`). Reuse the existing import-boundary
     machinery if present.
   - Wire into the existing governance gates (River `standard`/`prepare`), same
     pattern as `lint:css` / `docs:check`.

4. **Keep the taxonomy doc generated/synced where possible** so it cannot drift
   (e.g. component → layer derived from the manifest, surfaced in the generated
   `COMPONENTS.md`).

## Verification (env constraints)

Local vitest does NOT run here (Node 26 + network mount). Verify via:
- Local (works): `npm run lint`, `npm run lint:css`, `npm run docs:check`,
  the new `check-layers` script, `npm run build:samples`.
- CI (Linux): `ci-tests.yml` + River; the layer gate runs alongside the existing
  governance gates and fails on a wrong-direction dependency.

## Acceptance

- `docs/architecture/layers.md` exists with the table, dependency diagram,
  decision guide, and a worked L2→L1→L0 example; linked from README.
- A layer manifest maps paths → layers.
- `check-layers` runs in CI and fails on a wrong-direction dependency
  (proven with a temporary intentional violation in the PR description, reverted).
- No behavior change to shipped code. One PR (base `main`); not merged by agent.

## Risks / Notes

- Keep the gate advisory first (report-only) for one PR if the codebase has a
  pre-existing cross-layer edge, then flip to enforcing once clean — do not block
  unrelated work on day one.
- This is documentation + guardrail, not a refactor; resist renaming/moving
  components here (that belongs in its own spec if ever needed).
- Pairs with [[nettoolskit-ui-framework-agnostic-core-extraction]]: the "pure
  part of each layer" maps directly onto what ports across frameworks.

## Progress Checklist

Progress: 0% (0/4 checked)

- [ ] Write `docs/architecture/layers.md` (table + diagram + decision guide + example)
- [ ] Add machine-readable layer manifest (paths → layers)
- [ ] Add `check-layers` gate; wire into CI/River
- [ ] Link from README; sync layer labels into generated `COMPONENTS.md`