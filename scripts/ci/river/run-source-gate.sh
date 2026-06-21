#!/usr/bin/env bash
set -euo pipefail

description="${1:?description is required}"
shift
if [ "$#" -eq 0 ]; then
  echo "gate command is required" >&2
  exit 2
fi

test -n "${GITHUB_REPOSITORY:-}"
test -n "${GITHUB_SOURCE_TOKEN:-}"
test -n "${GITHUB_STATUS_CONTEXT:-}"

source_ref="${GITHUB_SOURCE_REF:-${GITHUB_BASE_REF:-main}}"
source_sha="$(git rev-parse HEAD)"

normalize_pipeline_url() {
  printf '%s\n' "$1" | sed 's#/-/pipelines/#/pipelines/#'
}

resolve_status_target_url() {
  ci_repository="${CI_REPOSITORY:-}"
  repository_slug="${GITRIVER_REPOSITORY_SLUG:-${CI_REPOSITORY_NAME:-${ci_repository##*/}}}"
  pipeline_url=""

  if [ -n "${GITHUB_STATUS_TARGET_URL:-}" ]; then
    normalize_pipeline_url "$GITHUB_STATUS_TARGET_URL"
    return 0
  fi

  if [ -n "${CI_PIPELINE_URL:-}" ]; then
    pipeline_url="$(normalize_pipeline_url "$CI_PIPELINE_URL")"
  elif [ -n "${CI_PIPELINE_ID:-}" ] && [ -n "${CI_SERVER_URL:-}" ]; then
    pipeline_url="${CI_SERVER_URL%/}/admin/${repository_slug}/pipelines/${CI_PIPELINE_ID}"
  fi

  if [ -n "$pipeline_url" ]; then
    if [ -n "${CI_JOB_ID:-}" ]; then
      echo "${pipeline_url}?job=${CI_JOB_ID}"
    else
      echo "$pipeline_url"
    fi
    return 0
  fi

  echo "https://github.com/${GITHUB_REPOSITORY}/commit/${source_sha}/checks"
}

post_status() {
  state="$1"
  status_description="$2"

  if [ -z "${GITHUB_STATUS_TARGET_URL:-}" ]; then
    GITHUB_STATUS_TARGET_URL="$(resolve_status_target_url)"
  fi

  curl -fsS \
    -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $GITHUB_SOURCE_TOKEN" \
    -H "Content-Type: application/json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "https://api.github.com/repos/$GITHUB_REPOSITORY/statuses/$source_sha" \
    -d "{\"state\":\"$state\",\"target_url\":\"$GITHUB_STATUS_TARGET_URL\",\"description\":\"$status_description\",\"context\":\"$GITHUB_STATUS_CONTEXT\"}" \
    >/dev/null
}

json_escape() {
  awk 'BEGIN { first = 1 } {
    gsub(/\\/, "\\\\")
    gsub(/"/, "\\\"")
    gsub(/\r/, "\\r")
    if (!first) {
      printf "\\n"
    }
    first = 0
    printf "%s", $0
  }'
}

publish_failure_issue() {
  status_description="$1"
  issue_pipeline_url="${GITHUB_STATUS_TARGET_URL:-$(resolve_status_target_url)}"
  issue_key="$(printf '%s' "river-ci-${GITHUB_STATUS_CONTEXT}-${source_ref}" | tr '/:@ ' '----' | tr -cd 'A-Za-z0-9._-')"
  issue_title="River CI failure: ${GITHUB_STATUS_CONTEXT} on ${source_ref}"
  issue_body="$(printf '%s\n' \
    "Automated River CI failure detected." \
    "" \
    "Repository: ${GITHUB_REPOSITORY}" \
    "Context: ${GITHUB_STATUS_CONTEXT}" \
    "Ref: ${source_ref}" \
    "Commit: ${source_sha}" \
    "Pipeline: ${issue_pipeline_url}" \
    "Description: ${status_description}" \
    "" \
    "Issue key: ${issue_key}")"

  search_response="$(curl -fsS \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $GITHUB_SOURCE_TOKEN" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    --get \
    --data-urlencode "q=repo:${GITHUB_REPOSITORY} is:issue is:open ${issue_key} in:title,body" \
    --data-urlencode "per_page=1" \
    "https://api.github.com/search/issues" 2>/dev/null || true)"
  issue_number="$(printf '%s' "$search_response" | tr -d '\n' | sed -n 's/.*"number":[[:space:]]*\([0-9][0-9]*\).*/\1/p' | head -n 1)"

  escaped_body="$(printf '%s' "$issue_body" | json_escape)"
  if [ -n "$issue_number" ]; then
    curl -fsS \
      -X POST \
      -H "Accept: application/vnd.github+json" \
      -H "Authorization: Bearer $GITHUB_SOURCE_TOKEN" \
      -H "Content-Type: application/json" \
      -H "X-GitHub-Api-Version: 2022-11-28" \
      "https://api.github.com/repos/$GITHUB_REPOSITORY/issues/$issue_number/comments" \
      -d "{\"body\":\"${escaped_body}\"}" \
      >/dev/null 2>&1 || true
    return 0
  fi

  escaped_title="$(printf '%s' "$issue_title" | json_escape)"
  curl -fsS \
    -X POST \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $GITHUB_SOURCE_TOKEN" \
    -H "Content-Type: application/json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    "https://api.github.com/repos/$GITHUB_REPOSITORY/issues" \
    -d "{\"title\":\"${escaped_title}\",\"body\":\"${escaped_body}\"}" \
    >/dev/null 2>&1 || true
}

finish() {
  exit_code=$?
  case "$exit_code" in
    0)
      post_status success "$description passed"
      ;;
    78)
      post_status success "$description skipped"
      exit_code=0
      ;;
    *)
      post_status failure "$description failed"
      publish_failure_issue "$description failed"
      ;;
  esac
  exit "$exit_code"
}

trap finish EXIT

post_status pending "$description started"
if [ "$#" -eq 1 ] && [ -f "$1" ]; then
  bash "$1"
else
  "$@"
fi