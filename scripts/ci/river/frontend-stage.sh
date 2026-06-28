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
    ;;
  standard)
    run_changed_surface
    npm_ci
    npm run tokens:check
    npm run docs:check
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
    # Publishes nettoolskit to the public npm registry. npm-publish.sh gates on
    # the source ref (publishes only on main / v*; dry-run elsewhere) and is
    # idempotent on an already-published version. `npm publish` triggers the
    # prepublishOnly build, so full devDependencies are required here.
    npm_ci
    bash "$script_dir/npm-publish.sh"
    ;;
  *)
    echo "Unknown River frontend stage: $stage" >&2
    exit 2
    ;;
esac