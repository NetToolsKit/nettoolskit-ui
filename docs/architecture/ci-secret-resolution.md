# Architecture — CI Secret Resolution (Bitwarden as source of truth)

How `@nettoolskit/ui` resolves CI secrets, and why the GitRiver project should
hold only a **bootstrap minimum**. The goal: make **Bitwarden Secrets Manager**
the single source of truth so publish credentials can never go stale in the
published CI metadata.

Spec: `planning/specs/.../nettoolskit-ui-gitriver-secret-minimization.md`.
Related memory: `npm-publish-mechanism`.

## Target secret set for the `nettoolskit-ui-ci` GitRiver project

| Held in GitRiver (bootstrap minimum) | Resolved at runtime from Bitwarden |
|---|---|
| `BITWARDEN_ACCESS_TOKEN` — unlocks Bitwarden SM | `NPM_TOKEN` (npmjs publish) |
| `GITHUB_SOURCE_TOKEN` — River's own source checkout | `GITHUB_CR_PUBLISH_TOKEN` (GitHub Packages) |
| | `NPM_AUTH_MODE` |

- **`GITHUB_SOURCE_TOKEN` must stay synced.** Every River job clones the source
  with `GIT_ASKPASS=$GITHUB_SOURCE_TOKEN` and asserts it is set **before any
  script runs**, so a script cannot resolve it at runtime.
- **`BITWARDEN_ACCESS_TOKEN` + `bws` ⇒ any other secret** is resolvable at
  runtime, so the publish tokens do not need to live in GitRiver.

## The resolver — `scripts/ci/river/resolve-secret.sh`

Single entry point; prints the resolved value to stdout (all logging goes to
stderr so the value stays clean for capture).

```
resolve-secret.sh <CANDIDATE_KEY> [<CANDIDATE_KEY> ...]
```

Precedence (a deliberately **safe transition**):

1. `NTK_FORCE_BITWARDEN_RESOLVE=1` → always go to Bitwarden (used to verify the
   Bitwarden path before the synced env vars are removed).
2. First non-empty **process env** among the candidate keys. ← keeps the resolver
   a **no-op while GitRiver still syncs the tokens** (safe rollout).
3. **Bitwarden Secrets Manager** via `BITWARDEN_ACCESS_TOKEN`.

Candidate keys mirror the access script: npm =
`NPM_TOKEN | NODE_AUTH_TOKEN | NPM_PACKAGES`; GitHub Packages =
`GITHUB_CR_PUBLISH_TOKEN | GITHUB_PACKAGES | NPM_PUBLISH_TOKEN`.

### Bitwarden path (`bws`)

1. Obtain `bws`: native binary on PATH → `ghcr.io/bitwarden/bws` Docker image →
   a **pinned download** (`NTK_BWS_VERSION`, default 2.1.0) verified against the
   release-published **sha256 checksums** before use (supply-chain).
2. `bws project list` → resolve the **`NetToolsKit`** project id
   (`BITWARDEN_PROJECT_NAME`).
3. `bws secret list <projectId>` → key/value map → return the first matching
   candidate key.

JSON parsing never silently dies: a parse failure surfaces the raw (secret-free)
`bws project list` output and the byte count of `secret list`, so a runner
failure prints a real reason instead of an empty error.

## Publishers consume the resolver

`npm-publish.sh` and `package-publish.sh` obtain their tokens via
`resolve-secret.sh` instead of reading env directly. Because of the env-first
precedence this is a **no-op while River still syncs the tokens**, and switches
to Bitwarden transparently once they are removed.

The release stage also runs a **non-fatal self-test**
(`NTK_FORCE_BITWARDEN_RESOLVE=1`) per token that reports `OK`/`FAIL` via
Bitwarden **without** affecting the real publish — it proves whether the synced
tokens can be dropped before anyone flips the var set.

## Rollout state & sequencing

1. ✅ **Additive:** the access publisher also syncs `BITWARDEN_ACCESS_TOKEN` to
   `nettoolskit-ui-ci` (bootstrap in place).
2. ✅ Resolver shipped + publishers wired (env-first ⇒ dormant; release stays
   green via synced env).
3. ⏳ **Verify the Bitwarden path for real in the runner** — the release
   self-test prints the runner's actual `bws` outcome. **Gating step.**
4. ⏳ **Flip** `nettoolskit-ui-ci` to the minimal var set (stop syncing the
   publish tokens) — **only after step 3 is green**. Touches `nettoolskit-access`
   (credential control-plane).
5. ⏳ Migrate `nettoolskit-agent` the same way **before** removing the tokens from
   any shared default (the agent uses the same shared publisher).

> **Why the flip is gated, not done:** the runner has historically received
> tokens **injected**, never talking to Bitwarden itself, so its network path to
> Bitwarden SM is unverified. Flipping before step 3 risks breaking the live
> publish to both registries. The env-first precedence keeps everything working
> until the flip is deliberately made.