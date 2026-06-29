#!/usr/bin/env bash
set -euo pipefail

# Resolves a CI secret value and prints it to stdout (value only; all logging
# goes to stderr). Centralizes secret access so Bitwarden can be the single
# source of truth while GitRiver holds only the bootstrap minimum.
#
# Usage:  resolve-secret.sh <CANDIDATE_KEY> [<CANDIDATE_KEY> ...]
#   Prints the first resolved value among the candidate keys.
#
# Precedence:
#   1. NTK_FORCE_BITWARDEN_RESOLVE=1  -> always resolve from Bitwarden (used to
#      verify the Bitwarden path before the synced env vars are removed).
#   2. First non-empty process environment variable among the candidates.
#      (Keeps this a no-op while GitRiver still syncs the tokens — safe rollout.)
#   3. Bitwarden Secrets Manager via BITWARDEN_ACCESS_TOKEN.
#
# Bitwarden path requirements (only exercised on force, or once the env vars are
# removed): BITWARDEN_ACCESS_TOKEN, and `bws` reachable (PATH, Docker image, or a
# pinned download). Project name defaults to NetToolsKit (BITWARDEN_PROJECT_NAME).

log() { printf '%s\n' "resolve-secret: $*" >&2; }
fail() { printf '%s\n' "resolve-secret: $*" >&2; exit 1; }

[ "$#" -ge 1 ] || fail "at least one candidate key is required."

force="${NTK_FORCE_BITWARDEN_RESOLVE:-0}"

# 1 + 2: process environment (unless forced to Bitwarden).
if [ "$force" != "1" ]; then
  for key in "$@"; do
    value="$(printenv "$key" 2>/dev/null || true)"
    if [ -n "$value" ]; then
      log "resolved '$key' from process environment."
      printf '%s' "$value"
      exit 0
    fi
  done
fi

# 3: Bitwarden Secrets Manager.
[ -n "${BITWARDEN_ACCESS_TOKEN:-}" ] || fail "no env value for [$*] and BITWARDEN_ACCESS_TOKEN is unset."
command -v node >/dev/null 2>&1 || fail "node is required to parse Bitwarden output."

project_name="${BITWARDEN_PROJECT_NAME:-NetToolsKit}"
server_url="${BITWARDEN_SERVER_URL:-}"

# Resolve a `bws` invocation: native binary, Docker image, or a pinned download.
bws_cmd=()
resolve_bws() {
  if command -v bws >/dev/null 2>&1; then
    bws_cmd=(bws)
    return 0
  fi
  if command -v docker >/dev/null 2>&1 && docker version >/dev/null 2>&1; then
    bws_cmd=(docker run --rm -e BWS_ACCESS_TOKEN ghcr.io/bitwarden/bws)
    return 0
  fi
  # Pinned download (version/url overridable so it can be corrected without a
  # code change). Verifies the archive against the release-published checksums.
  local ver url tools archive checksums bin
  ver="${NTK_BWS_VERSION:-1.0.0}"
  tools="${NTK_BWS_INSTALL_DIR:-.build/tools/bws}"
  bin="$tools/bws"
  if [ -x "$bin" ]; then bws_cmd=("$bin"); return 0; fi
  command -v curl >/dev/null 2>&1 || fail "curl is required to install bws."
  if ! command -v unzip >/dev/null 2>&1; then
    if command -v apt-get >/dev/null 2>&1; then apt-get install -y --no-install-recommends unzip >/dev/null 2>&1 || true; fi
    command -v unzip >/dev/null 2>&1 || fail "unzip is required to install bws."
  fi
  command -v sha256sum >/dev/null 2>&1 || fail "sha256sum is required to verify bws."
  mkdir -p "$tools"
  url="${NTK_BWS_URL:-https://github.com/bitwarden/sdk-sm/releases/download/bws-v${ver}}"
  archive="$tools/bws.zip"
  checksums="$tools/checksums.txt"
  curl -fsSL "$url/bws-x86_64-unknown-linux-gnu-${ver}.zip" -o "$archive"
  curl -fsSL "$url/bws-sha256-checksums-${ver}.txt" -o "$checksums" 2>/dev/null || true
  if [ -s "$checksums" ]; then
    local want got
    want="$(awk '/x86_64-unknown-linux-gnu/ {print $1; exit}' "$checksums")"
    got="$(sha256sum "$archive" | awk '{print $1}')"
    [ -n "$want" ] && [ "$want" = "$got" ] || fail "bws checksum verification failed (want=$want got=$got)."
  else
    fail "bws checksums file not available from $url; refusing to install unverified bws."
  fi
  unzip -o -q "$archive" -d "$tools"
  chmod 700 "$bin"
  bws_cmd=("$bin")
}

resolve_bws

common=()
[ -n "$server_url" ] && common+=(--server-url "$server_url")

# Bitwarden SM CLI reads the token from BWS_ACCESS_TOKEN (Docker) or --access-token.
export BWS_ACCESS_TOKEN="$BITWARDEN_ACCESS_TOKEN"

projects_json="$("${bws_cmd[@]}" "${common[@]}" project list --output json --access-token "$BITWARDEN_ACCESS_TOKEN")"
project_id="$(printf '%s' "$projects_json" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const a=JSON.parse(s);const m=a.find(p=>p&&p.name===process.argv[1]);process.stdout.write(m&&m.id?String(m.id):"")}catch(e){process.exit(3)}})' "$project_name")"
[ -n "$project_id" ] || fail "Bitwarden project '$project_name' not found for this access token."

secrets_json="$("${bws_cmd[@]}" "${common[@]}" secret list "$project_id" --output json --access-token "$BITWARDEN_ACCESS_TOKEN")"
value="$(printf '%s' "$secrets_json" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const a=JSON.parse(s);const wanted=process.argv.slice(1);const map={};for(const it of a){if(it&&it.key)map[it.key]=it.value;}for(const k of wanted){if(map[k]!=null&&String(map[k]).length){process.stdout.write(String(map[k]));return;}}}catch(e){process.exit(3)}})' "$@")"
[ -n "$value" ] || fail "none of the candidate keys [$*] were found in Bitwarden project '$project_name'."

log "resolved one of [$*] from Bitwarden project '$project_name'."
printf '%s' "$value"