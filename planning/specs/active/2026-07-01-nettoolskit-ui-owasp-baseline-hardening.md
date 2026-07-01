# NetToolsKit UI OWASP Baseline Hardening - Spec

Generated: 2026-07-01 America/Sao_Paulo
LastUpdated: 2026-07-01 America/Sao_Paulo
Status: active
Priority: high
Workstream ID: `nettoolskit-ui-owasp-baseline-hardening`
Phase: security-baseline

## Objective

Apply the globally-recommended OWASP controls that fit a published component
library + public samples deploy, each as an **executable gate** (not a
convention), and record the baseline in `SECURITY.md`.

## Background (audit 2026-07-01)

- `vercel.json` (public samples deploy) sent **zero** security headers (A05).
- One `v-html` sink in the tree (`DsCommandIcon`, registry-only build-time
  SVG) with no lint gate preventing new sinks (A03).
- One `JSON.parse` of `localStorage` (`useTableColumns`) inside try/catch but
  with no shape validation — `null`/array/foreign-key payloads leaked into
  component state.
- No lockfile linting; publish runs on the River runner where npm
  `--provenance` is not available (no supported OIDC) (A08).
- No scan preventing `eval`/`new Function` from entering published entries
  (CSP compatibility for consumers).
- Validators (`email`/`CPF`/`CNPJ`/`phone`) reviewed for ReDoS: e-mail is a
  linear character scan (no regex); remaining patterns are anchored and
  backtracking-safe. **No fix needed** — conclusion recorded.
- Already covered (kept as-is): `sec:audit` high gate, Dependabot, SCA
  workflow, e2e axe gate, CSS governance.

## Scope

- **A05**: `vercel.json` headers — CSP (`default-src 'self'`, no
  `unsafe-eval`, Google Fonts allow-listed for the catalog typography),
  `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS,
  `frame-ancestors 'none'` + `X-Frame-Options`, COOP/CORP.
- **A03**: `vue/no-v-html` as ESLint **error** for all SFCs; the single
  sanctioned sink keeps a justified `eslint-disable` block.
- **Client-side state**: `useTableColumns` persisted visibility parsed under
  try/catch and copied through a known-column/boolean-only whitelist onto a
  fresh object.
- **A08**: `sec:lockfile` script (`lockfile-lint`: npm host only, HTTPS only,
  integrity required) wired into `verify`; `size:check` gains a
  dynamic-code-sink scan (`eval(`, `new Function(`, `document.write(`) over
  every published entry.
- **Docs**: `SECURITY.md` — package name fixed (`@nettoolskit/ui`), provenance
  corrected from "should publish with --provenance" to an honest deferred
  follow-up (River lacks npm-supported OIDC), and a "Library security
  baseline (OWASP-mapped)" section listing each control and its gate.

## Verification

- `lint --quiet` (no-v-html gate active), `type-check`,
  `sec:lockfile`, `build` + `size:check` (sink scan green), targeted
  `useTableColumns` suite including adversarial payloads
  (null/array/string/number/broken JSON/`__proto__`/required-column
  override).

## Acceptance

- A new `v-html` anywhere in `src/`/`samples/` fails `lint`.
- A published entry containing `eval`/`new Function`/`document.write` fails
  `size:check`; a tampered lockfile host/integrity fails `sec:lockfile`.
- The samples deploy answers with the full header set.
- Malformed persisted column state degrades to defaults (proven by tests).

## Risks / Notes

- CSP is enforced only on the Vercel deploy (headers are a deploy concern);
  the sink scan is what protects arbitrary consumers.
- `style-src 'unsafe-inline'` stays: Vue `:style` bindings and the recipe
  pattern require inline styles; script-src remains strict.
- Provenance lands when publishing moves to an npm-supported OIDC CI (one
  flag in `scripts/ci/river/npm-publish.sh`).

## Progress Checklist

Progress: 100% (5/5 checked)

- [x] Security headers on the samples deploy (A05)
- [x] `vue/no-v-html` error gate + justified single-sink disable (A03)
- [x] Persisted-state whitelist parse + adversarial tests
- [x] `sec:lockfile` in verify + dynamic-sink scan in `size:check` (A08)
- [x] `SECURITY.md` baseline section + provenance follow-up recorded