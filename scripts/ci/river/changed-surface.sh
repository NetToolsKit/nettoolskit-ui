#!/usr/bin/env bash
set -euo pipefail

gate_name="${1:-river-gate}"
base_ref="${GITHUB_BASE_REF:-main}"
base_sha="${GITHUB_BASE_SHA:-}"
source_ref="${GITHUB_SOURCE_REF:-}"

normalize_ref() {
  case "$1" in
    refs/heads/*) printf '%s\n' "${1#refs/heads/}" ;;
    origin/*) printf '%s\n' "${1#origin/}" ;;
    *) printf '%s\n' "$1" ;;
  esac
}

force_variable="$(printf '%s\n' "$gate_name" | tr '[:lower:]-' '[:upper:]_')"
gate_force_variable="NTK_RIVER_FORCE_${force_variable}"
gate_force="${!gate_force_variable:-0}"

if [ "${NTK_RIVER_FORCE_QUALITY:-0}" = "1" ] || [ "$gate_force" = "1" ]; then
  echo "River changed-surface: forcing $gate_name."
  exit 0
fi

bounded_git_fetch() {
  if command -v timeout >/dev/null 2>&1; then
    timeout "${NTK_RIVER_FETCH_TIMEOUT_SECONDS:-20}" git fetch "$@" >/dev/null 2>&1 || true
    return 0
  fi

  git fetch "$@" >/dev/null 2>&1 || true
}

base_commit=""
if [ -n "$base_sha" ]; then
  if ! git cat-file -e "$base_sha^{commit}" >/dev/null 2>&1; then
    bounded_git_fetch --depth=1 origin "$base_sha"
  fi
  if git cat-file -e "$base_sha^{commit}" >/dev/null 2>&1; then
    base_commit="$base_sha"
  fi
fi

if [ -n "$base_ref" ]; then
  bounded_git_fetch --depth=64 origin "$base_ref"
fi

if [ -z "$base_commit" ] && [ -n "$base_ref" ] && git rev-parse --verify "origin/$base_ref" >/dev/null 2>&1; then
  base_commit="$(git merge-base HEAD "origin/$base_ref" 2>/dev/null || true)"
elif [ -z "$base_commit" ] && [ -n "$base_ref" ] && git rev-parse --verify "$base_ref" >/dev/null 2>&1; then
  base_commit="$(git merge-base HEAD "$base_ref" 2>/dev/null || true)"
fi

if ! git rev-parse --verify HEAD^ >/dev/null 2>&1; then
  if [ -n "$source_ref" ]; then
    bounded_git_fetch --deepen=2 origin "$source_ref"
  fi
fi

changed_paths_file="$(mktemp)"
trap 'rm -f "$changed_paths_file"' EXIT

if [ -z "$base_commit" ]; then
  echo "River changed-surface: merge base unavailable; running $gate_name to avoid under-detecting multi-commit PRs."
  exit 0
fi

git diff --name-only "$base_commit..HEAD" >"$changed_paths_file"

if [ ! -s "$changed_paths_file" ]; then
  echo "River changed-surface: empty changed-path diff; skipping $gate_name."
  exit 78
fi

requires_gate() {
  local checked_path="$1"

  case "$checked_path" in
    planning/* | planning/** | docs/* | docs/**)
      return 1
      ;;
  esac

  case "$gate_name" in
    prepare)
      case "$checked_path" in
        package.json | package-lock.json | sources.lock.yaml | tsconfig.json | tsup.config.ts | vite.config.ts | eslint.config.mjs | stylelint.config.mjs | \
          src/* | src/** | samples/* | samples/** | tests/* | tests/** | scripts/* | scripts/** | policies/* | policies/** | .gitriver/* | .gitriver/** | .github/* | .github/**)
          return 0
          ;;
      esac
      ;;
    standard)
      case "$checked_path" in
        README.md | DESIGN.md | COMPONENTS.md | TOKENS.md | CHANGELOG.md | package.json | package-lock.json | sources.lock.yaml | tsconfig.json | tsup.config.ts | vite.config.ts | eslint.config.mjs | stylelint.config.mjs | \
          src/* | src/** | samples/* | samples/** | tests/* | tests/** | scripts/* | scripts/** | policies/* | policies/** | .gitriver/* | .gitriver/** | .github/* | .github/**)
          return 0
          ;;
      esac
      ;;
    security)
      case "$checked_path" in
        package.json | package-lock.json | sources.lock.yaml | scripts/* | scripts/** | .gitriver/* | .gitriver/** | .github/* | .github/**)
          return 0
          ;;
      esac
      ;;
    build)
      case "$checked_path" in
        package.json | package-lock.json | sources.lock.yaml | tsconfig.json | tsup.config.ts | vite.config.ts | \
          src/* | src/** | samples/* | samples/** | scripts/* | scripts/** | policies/* | policies/** | .gitriver/* | .gitriver/** | .github/* | .github/**)
          return 0
          ;;
      esac
      ;;
    test)
      case "$checked_path" in
        package.json | package-lock.json | sources.lock.yaml | tsconfig.json | vite.config.ts | \
          src/* | src/** | samples/* | samples/** | tests/* | tests/** | scripts/* | scripts/** | policies/* | policies/** | .gitriver/* | .gitriver/** | .github/* | .github/**)
          return 0
          ;;
      esac
      ;;
    *)
      case "$checked_path" in
        package.json | package-lock.json | src/* | src/** | samples/* | samples/** | tests/* | tests/** | scripts/* | scripts/** | .gitriver/* | .gitriver/** | .github/* | .github/**)
          return 0
          ;;
      esac
      ;;
  esac

  return 1
}

while IFS= read -r changed_path; do
  if requires_gate "$changed_path"; then
    echo "River changed-surface: $changed_path requires $gate_name."
    exit 0
  fi
done <"$changed_paths_file"

if [ "$gate_name" = "build" ] && [ "$(normalize_ref "$source_ref")" = "main" ]; then
  echo "River changed-surface: main build diff did not match; running build to keep post-merge artifacts honest."
  exit 0
fi

echo "River changed-surface: changed paths do not require $gate_name; skipping."
exit 78