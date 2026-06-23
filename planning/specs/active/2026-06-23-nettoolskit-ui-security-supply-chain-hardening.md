# NetToolsKit UI Security & Supply-Chain Hardening - Spec

Generated: 2026-06-23 America/Sao_Paulo
LastUpdated: 2026-06-23 America/Sao_Paulo
Status: active
Priority: high
Branch: `feat/ds-component-usability-expansion`
Workstream ID: `nettoolskit-ui-security-supply-chain-hardening`
Related Standard: `.temp/NETTOOLSKIT_FRONTEND_DESIGN_SYSTEM_STANDARD.md` (§20 Security)

## Objective

Close the security gaps observed in the published library: no dependency-audit
gate in the local/`verify` flow, no documented disclosure policy, and no
publish-time supply-chain hardening. Production dependencies are already clean
(`npm audit --omit=dev` → 0), so this locks that in and makes it a gate.

## Findings (evidence)

- `npm audit --omit=dev` → 0 vulnerabilities (shipped surface is clean).
- Dev-only transitive advisories exist (esbuild/vite/vitest/tsup chain); they do
  not ship and are out of scope for the published-package gate.
- No `SECURITY.md`; no `publishConfig`; no `engines`; `verify` had no audit step.

## Key Decisions

- Add a `sec:audit` script gating **production** dependencies at `--audit-level=high`
  and wire it into `npm run verify` (fail fast, before the heavy gates).
- Add `SECURITY.md` with a private disclosure channel and supported-versions note.
- Add `publishConfig.access: public` and document `npm publish --provenance`
  for CI (Sigstore provenance), without forcing provenance in config so local
  publish is not broken outside a supported CI.
- Add `engines.node` to match the CI/runtime baseline (Node 20+).

## Acceptance Criteria

- `npm run sec:audit` passes (prod deps, high severity) and runs inside `verify`.
- `SECURITY.md` exists with disclosure + supported versions.
- `package.json` declares `publishConfig` and `engines`.
- `npm run verify` passes.

## Out of Scope

- CodeQL-on-PR wiring (CI workflow change) — follow-up.
- Dev-dependency advisory remediation (no shipped impact).
- Runtime DS class-injection governance — tracked with legacy governance spec.