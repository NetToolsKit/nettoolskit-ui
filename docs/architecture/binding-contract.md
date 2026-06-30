# Architecture — Framework Binding Contract

This is the contract a framework binding (Vue today; React/Angular/Svelte
tomorrow) must satisfy to be a first-class `nettoolskit` UI. It is the rubric a
future `@nettoolskit/react` package is **graded against** — and the reason adding
a second framework is cheap: everything expensive to rewrite already lives in a
framework-free layer.

See [`layers.md`](./layers.md) for the L0–L3 taxonomy and the pure-vs-framework
split, and
[`core-extraction-migration-map.md`](./core-extraction-migration-map.md) for the
composable-by-composable plan that keeps `core/` the portable source of truth.

## The shared, framework-free foundation

A binding **consumes** these; it never re-implements them:

| Asset | Lives in | What it gives the binding |
|---|---|---|
| Class recipes — `getNtk*Classes()` | `src/design-system/core/**` | The exact class string for every component state. Theming/density/intent live here, not in the framework. |
| Schema — `defineForm` / `defineResource` | `src/design-system/core/**` | Normalized field/column/action descriptors to render from. |
| Validation, contracts, icons | `src/design-system/core/**` | Pure rules + types shared across frameworks. |
| Design tokens — `--ntk-*` | `src/styles/**` (CSS custom properties) | The visual language. Loaded as CSS; portable for free. |

`core/` is **enforced** Vue-free and DOM-free by the `core-purity` rule in
[`scripts/check-layers.mjs`](../../scripts/check-layers.mjs) (see `layers.md` →
Enforcement). That gate is what guarantees the foundation actually stays
portable.

## What a binding MUST implement (and ONLY this)

To bind framework `X`, the `@nettoolskit/X` package must:

1. **Consume `getNtk*Classes()` for every class string.** A primitive (e.g.
   `<Button>`) is a thin render shell that calls the same pure recipe Vue calls.
   It must not hand-author class strings — identical props must yield a
   **byte-identical** class string across frameworks. (This is unit-testable and
   is the core promise; the React pilot asserts it.)
2. **Render `defineForm` / `defineResource` normalized output for schema.** The
   L2 `<Form>` / `<CrudPage>` consume the schema core's output; they do not
   re-derive field/column/validation logic.
3. **Load `@nettoolskit/tokens` CSS** (`--ntk-*`) and honor the
   `data-theme` / `data-brand` / `data-density` attributes unchanged. Theming is
   CSS, so it ports without code.
4. **Implement only render + event glue.** Reactivity, lifecycle, slots/children,
   and event wiring are the framework-idiomatic part — and the *only* part a new
   binding writes. Pure logic that leaks into this layer is a bug: fix it in
   `core/` (which benefits every framework) rather than forking it per framework.

## What a binding MUST NOT do

- ❌ Re-implement class logic, schema normalization, or validation (duplicates
  truth, drifts across frameworks).
- ❌ Reach into another binding's package (`@nettoolskit/vue` ↔
  `@nettoolskit/react`). Bindings are siblings; they share only `core` + tokens.
- ❌ Push framework types/reactivity down into `core/` (breaks the purity gate).

## Target package boundaries

The internal split today is path-based (`src/design-system/core` vs `…/vue`,
enforced by the layer gate). The intended package shape — whether or not it
becomes real workspaces — is:

```
@nettoolskit/tokens   <- src/styles/**            (CSS vars, theme data; no JS framework)
@nettoolskit/core     <- src/design-system/core/** (pure: recipes, schema, validation, icons)
@nettoolskit/vue      <- src/design-system/vue/**   (consumes core + tokens; Vue render glue)
@nettoolskit/react    <- (future) sibling of vue    (consumes the SAME core + tokens)
@nettoolskit/angular  <- (future) sibling of vue
```

`core` and `tokens` have **no** framework dependency; each `@nettoolskit/<fw>`
depends on them and nothing else in the family.

## Grading checklist (for a new binding PR)

- [ ] Every primitive's class string comes from `getNtk*Classes()` — proven by a
      cross-framework byte-identical class test.
- [ ] Form/CRUD render from `defineForm` / `defineResource` output; no schema
      logic re-authored.
- [ ] `--ntk-*` tokens loaded; `data-theme`/`data-brand`/`data-density` work
      unchanged.
- [ ] The binding adds only render/event glue; `core/` stays Vue-free/DOM-free
      (the `core-purity` gate is green).
- [ ] No cross-binding imports.