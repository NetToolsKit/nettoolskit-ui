#!/usr/bin/env bash
set -euo pipefail

# Publishes the nettoolskit package to the public npm registry from the River
# `release` stage. Adapted for a pure-JS package (no native binary validation).
#
# Behaviour:
# - Reads name/version from package.json (env can override).
# - Requires package.json publishConfig.access = public.
# - Only publishes on `main` or `v*` source refs; otherwise reports a dry-run.
# - Idempotent: if the version already exists on npm, only (re)syncs dist-tags.
# - Credential comes from the NPM_TOKEN (or NODE_AUTH_TOKEN) environment variable
#   injected into the runner. It is written to a temporary userconfig as the
#   standard `//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}` reference
#   (npm resolves the env var at runtime) and is never printed.

log() {
  printf '%s\n' "npm-publication: $*"
}

fail() {
  printf '%s\n' "npm-publication: $*" >&2
  exit 1
}

command -v node >/dev/null 2>&1 || fail "node is required."
command -v npm >/dev/null 2>&1 || fail "npm is required."
[ -f package.json ] || fail "package.json is required."

# Name comes from package.json (the single source of truth). An env override can
# go stale relative to the published River metadata and mis-target dist-tags.
package_name="$(node -p "require('./package.json').name")"
package_name="$(printf '%s' "$package_name" | tr -d '[:space:]')"
package_version="${NTK_RIVER_NPM_PACKAGE_VERSION:-}"
if [ -z "$package_version" ]; then
  package_version="$(node -p "require('./package.json').version")"
fi
package_version="$(printf '%s' "$package_version" | tr -d '[:space:]')"
publish_access="$(node -p "((require('./package.json').publishConfig || {}).access) || ''")"

[ -n "$package_name" ] || fail "package name is required."
[ -n "$package_version" ] || fail "package version is required."
[ "$publish_access" = "public" ] || fail "package.json publishConfig.access must be public."

npm_dist_tag="${NTK_RIVER_NPM_DIST_TAG:-preview}"
npm_dist_tag="$(printf '%s' "$npm_dist_tag" | tr -d '[:space:]')"
[ -n "$npm_dist_tag" ] || fail "npm dist-tag is required."

source_ref="${GITHUB_SOURCE_REF:-}"
source_sha="${GITHUB_SOURCE_SHA:-}"

if [ -n "$source_sha" ]; then
  current_sha="$(git rev-parse HEAD)"
  if [ "$source_sha" != "$current_sha" ]; then
    fail "GITHUB_SOURCE_SHA does not match checked-out HEAD: expected=$source_sha actual=$current_sha"
  fi
fi

case "$source_ref" in
  main|v*)
    should_publish="1"
    ;;
  *)
    should_publish="0"
    ;;
esac

log "package=$package_name version=$package_version tag=$npm_dist_tag ref=${source_ref:-unknown} publish=$should_publish"

existing_version=""
if existing_version="$(npm view "$package_name@$package_version" version --registry https://registry.npmjs.org 2>/dev/null)"; then
  if [ -n "$existing_version" ]; then
    log "$package_name@$existing_version already exists in npm."
  fi
fi

if [ "$should_publish" != "1" ]; then
  log "dry-run only outside main or v* release refs."
  exit 0
fi

# Resolve the npm token via the shared resolver: process env first (a no-op while
# GitRiver still syncs NPM_TOKEN), else Bitwarden (key NPM_PACKAGES). Exposed to
# npm as NODE_AUTH_TOKEN, which the .npmrc reference below reads.
resolver_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_AUTH_TOKEN="$(bash "$resolver_dir/resolve-secret.sh" NPM_TOKEN NODE_AUTH_TOKEN NPM_PACKAGES)" \
  || fail "npm publish credential is required (NPM_TOKEN/NODE_AUTH_TOKEN env, or Bitwarden NPM_PACKAGES)."
export NODE_AUTH_TOKEN

tmp_dir=""
cleanup() {
  if [ -n "$tmp_dir" ]; then
    rm -rf "$tmp_dir"
  fi
}
trap cleanup EXIT HUP INT TERM
tmp_dir="$(mktemp -d)"

npm_userconfig="$tmp_dir/npmrc"
cat > "$npm_userconfig" <<'NPMRC'
registry=https://registry.npmjs.org/
//registry.npmjs.org/:_authToken=${NODE_AUTH_TOKEN}
always-auth=true
NPMRC
export NPM_CONFIG_USERCONFIG="$npm_userconfig"

sync_dist_tag() {
  npm dist-tag add "$package_name@$package_version" "$1" --registry https://registry.npmjs.org
  log "synchronized $package_name@$package_version with npm dist-tag $1."
}

sync_dist_tags() {
  sync_dist_tag "$npm_dist_tag"
  if [ "$npm_dist_tag" != "latest" ]; then
    sync_dist_tag "latest"
  fi
}

if [ -n "$existing_version" ]; then
  sync_dist_tags
  exit 0
fi

# `npm publish` runs the package `prepublishOnly` script (npm run build), which
# regenerates .build/dist from the checked-out source before the tarball is cut.
npm publish --access public --registry https://registry.npmjs.org --tag "$npm_dist_tag"
log "published $package_name@$package_version to npm with dist-tag $npm_dist_tag."
sync_dist_tags