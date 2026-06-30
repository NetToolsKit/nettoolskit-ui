#!/usr/bin/env bash
set -euo pipefail

stage="${1:?stage is required}"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

run_changed_surface() {
  bash "$script_dir/changed-surface.sh" "$stage"
}

require_lockfile() {
  if [ ! -f package-lock.json ]; then
    echo "package-lock.json is required for deterministic River npm gates." >&2
    exit 1
  fi
}

npm_ci() {
  require_lockfile
  npm ci --no-audit --no-fund
}

npm_ci_without_lifecycle_scripts() {
  require_lockfile
  npm ci --ignore-scripts --no-audit --no-fund
}

case "$stage" in
  prepare)
    run_changed_surface
    npm_ci_without_lifecycle_scripts
    npm run tokens:check
    npm run docs:check
    npm run layers:check
    ;;
  standard)
    run_changed_surface
    npm_ci
    npm run tokens:check
    npm run docs:check
    npm run layers:check
    npm run lint -- --quiet
    npm run lint:style
    npm run lint:css
    npm run type-check
    ;;
  security)
    run_changed_surface
    require_lockfile
    npm audit --omit=dev --audit-level=high
    ;;
  build)
    run_changed_surface
    npm_ci
    npm run build
    npm run build:samples
    test -f .build/dist/index.js
    test -f .build/dist/index.mjs
    test -f .build/dist/index.d.ts
    test -f .build/dist/styles.js
    test -f .build/dist/styles.mjs
    test -d .build/samples
    ;;
  test)
    run_changed_surface
    npm_ci
    npm run test:architecture
    npm run test:design-system
    npm test
    # Browser + accessibility gate (Playwright + axe over the sample catalog).
    # River's node:20-bookworm image has apt + root, so install Chromium with its
    # system dependencies here and run the e2e/a11y suite (CI mode builds the
    # samples and serves them on :3000). This keeps the browser/WCAG gate inside
    # River — there is no separate GitHub Action on pull requests.
    npx playwright install --with-deps chromium
    npm run test:e2e
    ;;
  release)
    # Publishes @nettoolskit/ui to BOTH registries (org standard):
    #   - npm-publish.sh    -> public npmjs.org (primary, no-auth install)
    #   - package-publish.sh -> GitHub Packages (org-internal mirror)
    # Both gate on the source ref (publish only on main / v*; dry-run elsewhere)
    # and are idempotent on an already-published version. Build once up front so
    # the GitHub Packages publish can reuse dist with --ignore-scripts.
    npm_ci
    npm run build
    # Non-fatal Bitwarden-path self-test: forces the resolver down the Bitwarden
    # (bws) path and reports OK/FAIL per token, WITHOUT affecting the real publish
    # (which still resolves env-first below). This proves whether the synced
    # publish tokens can be dropped. Never fails the stage. Secret values are
    # discarded (stdout -> /dev/null); only the resolver's stderr reason is shown.
    bws_selftest() {
      local label="$1"; shift
      if NTK_FORCE_BITWARDEN_RESOLVE=1 bash "$script_dir/resolve-secret.sh" "$@" >/dev/null 2>/tmp/bws-selftest.err; then
        echo "::bws-selftest:: $label via Bitwarden = OK"
      else
        echo "::bws-selftest:: $label via Bitwarden = FAIL"
        sed 's/^/::bws-selftest::   /' /tmp/bws-selftest.err 2>/dev/null | tail -n 5
      fi
    }
    bws_selftest "npm token" NPM_TOKEN NODE_AUTH_TOKEN NPM_PACKAGES || true
    bws_selftest "gh-packages token" GITHUB_CR_PUBLISH_TOKEN GITHUB_PACKAGES NPM_PUBLISH_TOKEN || true
    bash "$script_dir/npm-publish.sh"
    bash "$script_dir/package-publish.sh"
    ;;
  *)
    echo "Unknown River frontend stage: $stage" >&2
    exit 2
    ;;
esac