# NetToolsKit UI Source Centralization - Spec

Generated: 2026-06-28 America/Sao_Paulo
LastUpdated: 2026-06-28 America/Sao_Paulo
Status: active
Priority: medium
Workstream ID: `nettoolskit-ui-source-centralization`
Phase: cleanup

## Objective

Finish the root-organization standard: sources under `src/`, tests under `tests/`.
Two deferred moves (held back earlier to avoid conflicts with then-open PRs,
now unblocked): **`index.ts → src/index.ts`** and **`e2e/ → tests/e2e/`**. Also
archive the two shipped specs.

## Scope

1. **`index.ts → src/index.ts`** (public API entry):
   - `git mv index.ts src/index.ts`; fix its OWN relative imports (`./src/...`
     → `./...`).
   - `tsup.config.ts`: entry `index: 'index.ts'` → `index: 'src/index.ts'`
     (build output stays `.build/dist/index.*` — river dist checks unaffected).
   - Update every consumer of the root index: `samples/**` (`../index` /
     `../../index` → `../src/index` / `../../src/index`), the public-api unit
     spec, and any `tests/**` import. Grep exhaustively.
   - `package.json` `files`, README/doc links referencing `index.ts`.
2. **`e2e/ → tests/e2e/`**:
   - `git mv e2e tests/e2e`; `playwright.config.ts` `testDir: './e2e'` →
     `'./tests/e2e'`. Check `scripts/ci/river/*` + `changed-surface.sh` for any
     `e2e/` path filters and update.
3. **Archive shipped specs**: move
   `planning/specs/active/2026-06-27-nettoolskit-ui-governed-ds-parity.md` and
   `…-i18n-final-verification.md` → `planning/specs/completed/2026-06/`, flip
   `Status:` to `completed`.

## Verification (env constraints)

Local vitest does NOT run here (Node 26 + network mount). Verify via:
- Local (works): `npm run build` (entry now src/index.ts → dist + d.ts),
  `npm run build:samples`, `npm run lint`, `npm run lint:css`, `npm run docs:check`.
- CI (Linux): `ci-tests.yml` for lint+type+unit (incl. the public-api spec with
  the new import path) + River (`river/test` runs the e2e from `tests/e2e`).

## Acceptance

- Root no longer has `index.ts` or `e2e/`; they live at `src/index.ts` and
  `tests/e2e/`. Library build + samples build green; public-api spec green; e2e
  runs from the new path. No published-path regression (dist unchanged).
- One PR (base `main`); not merged by the agent.

## Progress Checklist

Progress: 0% (0/3 checked)

- [ ] index.ts → src/index.ts (entry + all imports + configs)
- [ ] e2e → tests/e2e (playwright testDir + river path refs)
- [ ] archive the 2 shipped specs; gates green (build + ci-tests + river)