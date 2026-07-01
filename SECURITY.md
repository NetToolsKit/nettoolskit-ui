# Security Policy

## Supported versions

This library is published as `@nettoolskit/ui`. Security fixes are applied to
the latest published `0.x` preview line. Older preview tags are not maintained.

| Version | Supported |
|---|---|
| latest `0.x` | yes |
| older tags | no |

## Reporting a vulnerability

Please report suspected vulnerabilities **privately** — do not open a public
issue for undisclosed problems.

- Preferred: GitHub Security Advisories ("Report a vulnerability") on
  `NetToolsKit/nettoolskit-ui`.
- Alternatively: email the maintainer at `tguislotti@gmail.com` with steps to
  reproduce and affected versions.

You can expect an initial acknowledgement within a few business days. Please
allow reasonable time for a fix before any public disclosure.

## Supply-chain hardening

- Production dependencies are gated in CI and locally via
  `npm run sec:audit` (`npm audit --omit=dev --audit-level=high`), which also
  runs as part of `npm run verify`; Dependabot and the SCA workflow cover the
  full tree.
- The lockfile is linted on every `verify` via `npm run sec:lockfile`
  (`lockfile-lint`): npm registry host only, HTTPS only, integrity hashes
  required — blocks lockfile-tampering and registry-substitution attacks.
- Provenance follow-up: `npm publish --provenance` requires an npm-supported
  OIDC CI (GitHub Actions / GitLab). Publishing currently runs on the River
  runner, so provenance is deferred until the publish job moves to a supported
  OIDC context; enabling it then is a one-flag change in
  `scripts/ci/river/npm-publish.sh`.
- The package ships only built artifacts and declared assets (see the `files`
  field in `package.json`).

## Library security baseline (OWASP-mapped)

Executable controls, each enforced by a gate — not by convention:

- **A03 Injection/XSS** — components never render untrusted HTML.
  `vue/no-v-html` is an ESLint **error** across `src/` and `samples/`; the
  single sanctioned sink (`DsCommandIcon`, build-time SVG paths from the
  closed icon registry) carries a justified inline disable. Vue interpolation
  escaping covers everything else.
- **A05 Security misconfiguration** — the public samples deploy sends
  hardened headers via `vercel.json`: CSP (`default-src 'self'`, no
  `unsafe-eval`; Google Fonts allow-listed), `X-Content-Type-Options`,
  `Referrer-Policy`, `Permissions-Policy`, HSTS, `frame-ancestors 'none'`/
  `X-Frame-Options`, COOP/CORP.
- **A06 Vulnerable components** — `sec:audit` (high, production tree) in
  `verify` + Dependabot + the SCA workflow (Critical/High gate).
- **A08 Software & data integrity** — `sec:lockfile` (registry/HTTPS/
  integrity pinning) and a published-entry scan in `size:check` that fails on
  `eval(`, `new Function(` and `document.write(` so the library stays
  CSP-compatible (no `unsafe-eval`) for every consumer.
- **Client-side state** — persisted `localStorage` payloads are treated as
  untrusted input: parsed under try/catch and copied through a
  known-keys/boolean-only whitelist (`useTableColumns`); theme/scheme readers
  accept only closed enum values.
- **Input validation robustness** — the CPF/CNPJ/email/phone validators were
  reviewed for ReDoS: the e-mail check is a linear character scan (no regex)
  and the remaining patterns are anchored, fixed-shape and backtracking-safe.
- **A11y/abuse surface in the catalog** — the built samples run under the
  Playwright + axe gate (`test:e2e` in `verify`), which also exercises the
  dialog focus/Escape lifecycle.