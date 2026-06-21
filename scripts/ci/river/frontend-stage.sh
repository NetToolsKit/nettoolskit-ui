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
    npm run build:landing
    test -f .build/dist/index.js
    test -f .build/dist/index.mjs
    test -f .build/dist/index.d.ts
    test -f .build/dist/styles.js
    test -f .build/dist/styles.mjs
    ;;
  test)
    run_changed_surface
    npm_ci
    npm run test:architecture
    npm test
    npx playwright install --with-deps chromium
    npm run test:a11y
    npx playwright test \
      tests/e2e/template-runtime-reset-workspace.spec.ts \
      tests/e2e/template-runtime-whitelabel.spec.ts \
      tests/e2e/template-runtime-wiki-chat.spec.ts \
      --project=chromium \
      --workers=1
    if [ "${NTK_RIVER_ENABLE_WINDOWS_VISUAL:-0}" = "1" ]; then
      npm run test:visual
    else
      echo "River test: Windows-specific visual snapshot suites remain in the manual GitHub fallback workflow."
    fi
    ;;
  *)
    echo "Unknown River frontend stage: $stage" >&2
    exit 2
    ;;
esac