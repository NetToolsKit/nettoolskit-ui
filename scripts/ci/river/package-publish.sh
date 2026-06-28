#!/usr/bin/env bash
set -euo pipefail

# Publishes the @nettoolskit/ui package to GitHub Packages (npm.pkg.github.com)
# from the River `release` stage, as the org-internal mirror of the public
# npmjs.org copy. Pure-JS adaptation of the org publisher (no cargo/ORAS bundle).
#
# Runs AFTER npm-publish.sh in the release stage; the dist is already built, so
# this publishes with --ignore-scripts (the package `files` include .build/dist).
#
# Behaviour:
# - Reads name/version from package.json (env can override).
# - Only publishes on `main` or `v*` source refs; otherwise reports a dry-run.
# - Idempotent: skips when the version already exists in GitHub Packages.
# - Credential from GITHUB_CR_PUBLISH_TOKEN (synced into the runner); written to a
#   temp userconfig as the standard `_authToken` reference and never printed.

log() { printf '%s\n' "package-publish: $*"; }
fail() { printf '%s\n' "package-publish: $*" >&2; exit 1; }

command -v node >/dev/null 2>&1 || fail "node is required."
command -v npm >/dev/null 2>&1 || fail "npm is required."
[ -f package.json ] || fail "package.json is required."

# Name comes from package.json (the single source of truth). An env override can
# go stale relative to the published River metadata and mis-target the publish.
package_name="$(node -p "require('./package.json').name")"
package_name="$(printf '%s' "$package_name" | tr -d '[:space:]')"
package_version="${NTK_RIVER_NPM_PACKAGE_VERSION:-}"
if [ -z "$package_version" ]; then
  package_version="$(node -p "require('./package.json').version")"
fi
package_version="$(printf '%s' "$package_version" | tr -d '[:space:]')"

[ -n "$package_name" ] || fail "package name is required."
[ -n "$package_version" ] || fail "package version is required."
case "$package_name" in
  @*/*) : ;;
  *) fail "GitHub Packages requires a scoped package name (got '$package_name')." ;;
esac

registry="https://npm.pkg.github.com"
source_ref="${GITHUB_SOURCE_REF:-}"
source_sha="${GITHUB_SOURCE_SHA:-}"

if [ -n "$source_sha" ]; then
  current_sha="$(git rev-parse HEAD)"
  if [ "$source_sha" != "$current_sha" ]; then
    fail "GITHUB_SOURCE_SHA does not match checked-out HEAD: expected=$source_sha actual=$current_sha"
  fi
fi

case "$source_ref" in
  main|v*) should_publish="1" ;;
  *) should_publish="0" ;;
esac

log "package=$package_name version=$package_version registry=$registry ref=${source_ref:-unknown} publish=$should_publish"

existing_version=""
if existing_version="$(npm view "$package_name@$package_version" version --registry "$registry" 2>/dev/null)"; then
  if [ -n "$existing_version" ]; then
    log "$package_name@$existing_version already exists in GitHub Packages; skipping."
  fi
fi

if [ "$should_publish" != "1" ]; then
  log "dry-run only outside main or v* release refs."
  exit 0
fi

if [ -n "$existing_version" ]; then
  exit 0
fi

NODE_AUTH_TOKEN="${GITHUB_CR_PUBLISH_TOKEN:-${NPM_PUBLISH_TOKEN:-}}"
[ -n "$NODE_AUTH_TOKEN" ] || fail "GitHub Packages credential is required (set GITHUB_CR_PUBLISH_TOKEN)."
export NODE_AUTH_TOKEN

scope="${package_name%%/*}"   # e.g. @nettoolskit

tmp_dir=""
cleanup() { [ -n "$tmp_dir" ] && rm -rf "$tmp_dir"; }
trap cleanup EXIT HUP INT TERM
tmp_dir="$(mktemp -d)"

npm_userconfig="$tmp_dir/npmrc"
{
  printf '%s:registry=%s\n' "$scope" "$registry"
  printf '//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}\n'
  printf 'always-auth=true\n'
} > "$npm_userconfig"
export NPM_CONFIG_USERCONFIG="$npm_userconfig"

# dist is already built by npm-publish.sh (run earlier in the release stage) and
# by the explicit build; skip lifecycle scripts to avoid a redundant rebuild.
npm publish --ignore-scripts --registry "$registry" --access restricted
log "published $package_name@$package_version to GitHub Packages."