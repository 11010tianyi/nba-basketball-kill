#!/usr/bin/env bash
# Fail unless the debug APK is signed by the restored debug keystore.
#
# assembleDebug can succeed while the Android Gradle Plugin signs with a
# keystore it just created. Compare the APK Signature Scheme v2 certificate
# to the keystore's androiddebugkey certificate and exit non-zero on mismatch.
# Only the public SHA-256 is printed.
set -euo pipefail

apk="${1:-}"
keystore="${2:-}"
if [[ -z "$apk" || ! -f "$apk" ]]; then
  echo "Debug APK not found: ${apk:-<missing path>}" >&2
  exit 1
fi
if [[ -z "$keystore" || ! -f "$keystore" ]]; then
  echo "Debug keystore not found: ${keystore:-<missing path>}" >&2
  exit 1
fi

normalize_sha256() {
  local value="$1"
  value="$(printf '%s' "$value" | tr -d '[:space:]' | tr '[:lower:]' '[:upper:]' | tr -d ':')"
  if [[ ! "$value" =~ ^[0-9A-F]{64}$ ]]; then
    echo "Not a SHA-256 fingerprint: ${1}" >&2
    return 1
  fi
  printf '%s\n' "$value"
}

# apksigner --print-certs labels differ by build-tools:
#   36.0.0: Signer #1 certificate SHA-256 digest: <64 hex>
#   37.0.0: V2 Signer: certificate SHA-256 digest: <64 hex>
#           V3.0 Signer: certificate SHA-256 digest: <64 hex>
#           V3.0 Signer: certificate SHA-256 digest: <64 hex>
# Splitting on ": " takes the words "certificate SHA-256 digest" as the
# fingerprint on the 37.0.0 line. Pull the hex itself, and ignore a source
# stamp signer when one is printed alongside the APK signer.
sha256_from_cert_line() {
  local line="$1"
  local hex=""
  if [[ "$line" =~ [0-9A-Fa-f]{64} ]]; then
    hex="${BASH_REMATCH[0]}"
  elif [[ "$line" =~ ([0-9A-Fa-f]{2}:){31}[0-9A-Fa-f]{2} ]]; then
    hex="${BASH_REMATCH[0]}"
  fi
  if [[ -z "$hex" ]]; then
    echo "Not a SHA-256 fingerprint: ${line}" >&2
    return 1
  fi
  normalize_sha256 "$hex"
}

apk_signer_sha256_line() {
  local output="$1"
  local line lower
  local v2="" fallback=""
  while IFS= read -r line || [[ -n "$line" ]]; do
    [[ "$line" == *"certificate SHA-256 digest"* ]] || continue
    lower="${line,,}"
    [[ "$lower" == *"source stamp"* ]] && continue
    if [[ "$line" =~ Signer\ #1([^0-9]|$) ]]; then
      printf '%s\n' "$line"
      return 0
    fi
    if [[ "$line" == *"V2 Signer"* && -z "$v2" ]]; then
      v2="$line"
    fi
    if [[ -z "$fallback" ]]; then
      fallback="$line"
    fi
  done <<< "$output"
  if [[ -n "$v2" ]]; then
    printf '%s\n' "$v2"
    return 0
  fi
  if [[ -n "$fallback" ]]; then
    printf '%s\n' "$fallback"
    return 0
  fi
  return 1
}

find_sdk_tool() {
  local name="$1"
  if command -v "$name" >/dev/null 2>&1; then
    command -v "$name"
    return 0
  fi
  local root="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
  if [[ -z "$root" || ! -d "$root/build-tools" ]]; then
    echo "Could not find ${name}. Install Android build-tools or set ANDROID_HOME." >&2
    exit 1
  fi
  local tool
  tool="$(find "$root/build-tools" -type f -name "$name" | sort | tail -1)"
  if [[ -z "$tool" ]]; then
    echo "Could not find ${name} under ${root}/build-tools." >&2
    exit 1
  fi
  printf '%s\n' "$tool"
}

keystore_raw="$(keytool -list -v -keystore "$keystore" -storepass android -alias androiddebugkey | awk -F': ' '/SHA256:/{print $2; exit}')"
if [[ -z "$keystore_raw" ]]; then
  echo "keytool did not print a SHA-256 for alias androiddebugkey." >&2
  exit 1
fi
keystore_sha="$(normalize_sha256 "$keystore_raw")"
if [[ -n "${DEBUG_CERT_SHA256:-}" ]]; then
  recorded="$(normalize_sha256 "$DEBUG_CERT_SHA256")"
  echo "SHA-256 recorded before assembleDebug: ${recorded}"
  echo "SHA-256 of the keystore now:           ${keystore_sha}"
  if [[ "$recorded" != "$keystore_sha" ]]; then
    echo "The debug keystore changed during the build. Refusing to trust a replacement key." >&2
    exit 1
  fi
fi
expected="$keystore_sha"

apksigner="$(find_sdk_tool apksigner)"
certs_output="$("$apksigner" verify --print-certs "$apk" 2>&1)" || {
  echo "apksigner verify --print-certs failed for ${apk}." >&2
  printf '%s\n' "$certs_output" >&2
  exit 1
}
if ! signer_line="$(apk_signer_sha256_line "$certs_output")"; then
  echo "apksigner did not print an APK signer certificate SHA-256 for ${apk}." >&2
  echo "apksigner verify --print-certs:" >&2
  printf '%s\n' "$certs_output" >&2
  exit 1
fi
if ! actual="$(sha256_from_cert_line "$signer_line")"; then
  echo "apksigner verify --print-certs:" >&2
  printf '%s\n' "$certs_output" >&2
  exit 1
fi

echo "Keystore androiddebugkey SHA-256: ${expected}"
echo "APK signer SHA-256:               ${actual}"
if [[ "$actual" != "$expected" ]]; then
  echo "The APK certificate does not match the restored debug keystore. Refusing to publish an APK that cannot update the previous install." >&2
  echo "apksigner verify --print-certs:" >&2
  printf '%s\n' "$certs_output" >&2
  exit 1
fi

if [[ -n "${APP_VERSION_NAME:-}" || -n "${APP_VERSION_CODE:-}" ]]; then
  aapt="$(find_sdk_tool aapt)"
  badging="$("$aapt" dump badging "$apk")"
  package_line="$(printf '%s\n' "$badging" | awk '/^package:/{print; exit}')"
  if [[ ! "$package_line" =~ ^package:\ name=\'([^\']+)\'\ versionCode=\'([^\']+)\'\ versionName=\'([^\']+)\' ]]; then
    echo "Could not parse package line: ${package_line}" >&2
    exit 1
  fi
  got_id="${BASH_REMATCH[1]}"
  got_code="${BASH_REMATCH[2]}"
  got_name="${BASH_REMATCH[3]}"
  echo "APK applicationId=${got_id} versionName=${got_name} versionCode=${got_code}"
  if [[ "$got_id" != "com.tianyi.nbabasketballkill" ]]; then
    echo "APK applicationId changed: ${got_id}" >&2
    exit 1
  fi
  if [[ -n "${APP_VERSION_NAME:-}" && "$got_name" != "$APP_VERSION_NAME" ]]; then
    echo "APK versionName ${got_name} does not match release version ${APP_VERSION_NAME}." >&2
    exit 1
  fi
  if [[ -n "${APP_VERSION_CODE:-}" && "$got_code" != "$APP_VERSION_CODE" ]]; then
    echo "APK versionCode ${got_code} does not match release versionCode ${APP_VERSION_CODE}." >&2
    exit 1
  fi
fi
