# NetToolsKit UI GitRiver Secret Minimization + Runtime Bitwarden Resolution - Spec

Generated: 2026-06-28 America/Sao_Paulo
LastUpdated: 2026-06-28 America/Sao_Paulo
Status: backlog
Priority: medium
Workstream ID: `nettoolskit-ui-gitriver-secret-minimization`
Phase: cicd-hardening

## Objective

Make Bitwarden the **single source of truth** for CI secrets and shrink the
GitRiver-held secret set to the bootstrap minimum, so publish credentials can no
longer go stale in the published metadata (the exact root cause of the
`@nettoolskit/ui` dist-tag failure: a synced `NTK_RIVER_NPM_PACKAGE_NAME`/token
lagged the source). Standardize the resolution pattern across publishers.

Target end state for the `nettoolskit-ui-ci` GitRiver project:
- **Held in GitRiver (minimum):** `BITWARDEN_ACCESS_TOKEN` + `GITHUB_SOURCE_TOKEN`.
- **Removed from GitRiver (resolved at runtime from Bitwarden):** `NPM_TOKEN`,
  `GITHUB_CR_PUBLISH_TOKEN`, `NPM_AUTH_MODE`.

## Background (verified 2026-06-28)

- `nettoolskit-access/scripts/runtime/bitwarden-runtime.ps1` resolves secrets via
  the **`bws` (Bitwarden Secrets Manager CLI)** using `BITWARDEN_ACCESS_TOKEN`:
  `bws project list` → resolve the `NetToolsKit` project id → `bws secret list
  <projectId>` → key/value map of every project secret. Falls back to the
  `ghcr.io/bitwarden/bws` Docker image when `bws` is absent. So
  **`BITWARDEN_ACCESS_TOKEN` + `bws` ⇒ any secret resolvable at runtime.**
- `nettoolskit-access/scripts/integrations/gitriver/publish-ci-metadata.ps1`
  currently syncs 4 GitRiver variables: `GITHUB_SOURCE_TOKEN`,
  `GITHUB_CR_PUBLISH_TOKEN`, `NPM_TOKEN`, `NPM_AUTH_MODE`. It does NOT sync
  `BITWARDEN_ACCESS_TOKEN`.
- **`GITHUB_SOURCE_TOKEN` must stay synced** — every River job clones the source
  with `GIT_ASKPASS=$GITHUB_SOURCE_TOKEN` and asserts `test -n
  "$GITHUB_SOURCE_TOKEN"` BEFORE any script runs, so a script cannot resolve it
  at runtime.
- **Agent coupling:** `nettoolskit-agent` uses the same shared
  `publish-ci-metadata.ps1` (via `publish-agent-ci-metadata.ps1`) and its
  `npm-publish.sh`/`package-publish.sh` read tokens from env. Removing the synced
  publish tokens globally would break the agent. The synced var set must become
  **per-metadata-repo**, and the agent must migrate before any global removal.

## Scope

1. **Shared runtime resolver (UI):** `scripts/ci/river/resolve-secret.sh`.
   - Signature: `resolve-secret.sh <CANDIDATE_KEY...>` → prints the value.
   - Precedence (safe transition): return the first non-empty **process env**
     among the candidates; otherwise resolve from Bitwarden.
   - Bitwarden path: ensure `bws` (install a pinned release + sha256 verify into
     `.build/tools/bws` if not on PATH, mirroring `package-publish.sh`'s ORAS
     pattern), then `bws project list` → `NetToolsKit` id → `bws secret list` →
     pick the first matching candidate key. Requires `BITWARDEN_ACCESS_TOKEN`.
   - Candidate keys mirror the access script: npm = `NPM_PACKAGES|NPM_TOKEN|NODE_AUTH_TOKEN`,
     GH Packages = `GITHUB_PACKAGES|GITHUB_CR_PUBLISH_TOKEN`.
2. **Wire into the publishers:** `npm-publish.sh` and `package-publish.sh` obtain
   their tokens via `resolve-secret.sh` instead of reading env directly. With the
   env-first precedence this is a **no-op while River still syncs the tokens**,
   and transparently switches to Bitwarden once they are removed.
3. **Access publisher — per-repo var set:** parameterize
   `publish-ci-metadata.ps1` so the synced variable set is configurable per
   `MetadataRepositoryName`. For `nettoolskit-ui-ci`: sync
   `{ BITWARDEN_ACCESS_TOKEN, GITHUB_SOURCE_TOKEN }` only. Add a
   `-RuntimeResolvedSecrets`/exclusion switch so the publish tokens are NOT
   synced for repos that resolve at runtime. (Agent repo keeps the full set until
   it migrates.)
4. **(Optional, related) self-sync stage:** a River stage that runs
   `publish-ui-ci-metadata.ps1` against the checked-out source using
   `BITWARDEN_ACCESS_TOKEN`, removing the manual metadata-publish step (see the
   parallel note in the "what's wrong with River" assessment). Eventually
   consistent (a metadata change applies on the next run).
5. **Docs:** record the minimal secret set + the resolution flow in
   `docs/architecture/` and the [[npm-publish-mechanism]] memory.

## Sequencing (must not break the agent or the live publish)

1. **Additive:** make `publish-ci-metadata.ps1` ALSO sync `BITWARDEN_ACCESS_TOKEN`
   to `nettoolskit-ui-ci` (nothing breaks; just adds the bootstrap).
2. Ship the UI resolver + wire the publishers (env-first ⇒ dormant; release still
   green via synced env).
3. **Verify the Bitwarden path for real** in the runner (temporarily prefer bws,
   or a throwaway stage) — this needs `BITWARDEN_ACCESS_TOKEN` + `bws`, so it is
   executed in a session/runner where the token is available (access domain).
4. Flip `nettoolskit-ui-ci` to the minimal var set (stop syncing the publish
   tokens); run a release → must publish to both registries via runtime
   resolution.
5. Migrate `nettoolskit-agent` the same way before removing the tokens from any
   shared default.

## Verification (env constraints)

- The Bitwarden/`bws` runtime path **cannot be tested in the local dev shell**
  (no `bws`, no token access, the River runner is remote). It must be verified in
  a runner/session with `BITWARDEN_ACCESS_TOKEN` present.
- Locally testable: `bash -n` + the **env-present** branch of `resolve-secret.sh`
  (returns the env value, bws untouched); `npm run build`; existing River gates.
- End-to-end: a `main` release run with the publish tokens removed from
  `nettoolskit-ui-ci` publishes `@nettoolskit/ui` to npmjs + GitHub Packages.

## Acceptance

- `nettoolskit-ui-ci` GitRiver project holds only `{ BITWARDEN_ACCESS_TOKEN,
  GITHUB_SOURCE_TOKEN }`.
- A release publishes to both registries with `NPM_TOKEN`/`GITHUB_CR_PUBLISH_TOKEN`
  resolved at runtime from Bitwarden; no token lives in GitRiver metadata.
- `nettoolskit-agent` publishing remains green throughout (per-repo var set).
- Resolution flow documented. One PR per repo touched (UI; access); not merged by
  the agent.

## Risks / Notes

- Adds a `bws` call + a runtime dependency on Bitwarden SM availability per
  publish; pin the `bws` version with checksum (supply-chain).
- Do NOT merge untested secret-resolution into the live pipeline — the env-first
  precedence keeps it dormant until deliberately flipped + verified with the
  token.
- Touches `nettoolskit-access` (credential control-plane) — coordinate with the
  access owner; activation requires a Bitwarden-authenticated publisher run.
- Pairs with [[npm-publish-mechanism]].

## Progress Checklist

Progress: 0% (0/5 checked)

- [ ] `resolve-secret.sh` shared resolver (env-first → bws), pinned bws install
- [ ] Wire `npm-publish.sh` + `package-publish.sh` to the resolver
- [ ] Access publisher: per-repo var set; sync `BITWARDEN_ACCESS_TOKEN`; drop publish tokens for `nettoolskit-ui-ci`
- [ ] Verify runtime resolution in a runner with the token; flip the ui-ci var set
- [ ] Docs + memory; sequence agent migration before any shared-default removal