#!/usr/bin/env bash
# Publish the Android debug APK as a GitHub Release asset.
#
# The tag is computed from existing git tags. package.json is not consulted,
# and this script never commits a version bump (that would retrigger the
# workflow).
#
# Versioning:
#   - No vMAJOR.MINOR.PATCH tag yet -> v1.0.0.
#   - Otherwise take the highest such tag and add 1 to its patch component
#     (v1.0.0 -> v1.0.1, v1.0.1 -> v1.0.2).
#   - If that tag or a GitHub Release of the same name already exists (rerun
#     or a race), do not fail. Keep incrementing the patch until both the tag
#     and the release are free, then publish that one.
#
# The workflow calls this script with --print-version before assembleDebug,
# builds the APK with that versionName/versionCode, then runs it again with
# ANDROID_RELEASE_TAG set to the same tag. In that mode a taken tag is a
# failure: publishing a different patch would make the Release disagree with
# the APK.
set -euo pipefail

print_only=0
apk_src=""
if [[ "${1:-}" == "--print-version" ]]; then
  print_only=1
else
  apk_src="${1:-}"
  if [[ -z "$apk_src" || ! -f "$apk_src" ]]; then
    echo "Debug APK not found: ${apk_src:-<missing path>}" >&2
    exit 1
  fi
  : "${GITHUB_SHA:?GITHUB_SHA is required}"
fi

: "${GITHUB_REPOSITORY:?GITHUB_REPOSITORY is required}"
: "${GH_TOKEN:?GH_TOKEN is required}"

semver_greater() {
  local a="${1#v}" b="${2#v}"
  local a1 a2 a3 b1 b2 b3
  IFS=. read -r a1 a2 a3 <<< "$a"
  IFS=. read -r b1 b2 b3 <<< "$b"
  if ((10#$a1 > 10#$b1)); then return 0; fi
  if ((10#$a1 < 10#$b1)); then return 1; fi
  if ((10#$a2 > 10#$b2)); then return 0; fi
  if ((10#$a2 < 10#$b2)); then return 1; fi
  if ((10#$a3 > 10#$b3)); then return 0; fi
  return 1
}

read_names() {
  local output="$1"
  local line
  while IFS= read -r line || [[ -n "$line" ]]; do
    if [[ -n "$line" && "$line" != "null" ]]; then
      names+=("$line")
    fi
  done <<< "$output"
  return 0
}

tag_or_release_exists() {
  local name="$1"
  if gh api "repos/${GITHUB_REPOSITORY}/git/ref/tags/${name}" --jq .ref >/dev/null 2>&1; then
    return 0
  fi
  if gh release view "$name" --repo "$GITHUB_REPOSITORY" >/dev/null 2>&1; then
    return 0
  fi
  return 1
}

# Actions checks out with fetch-depth 1 and does not fetch tags, so read them
# from the API. package.json is intentionally ignored.
resolve_next_tag() {
  local names=()
  local tag_list release_list highest name
  local major minor patch candidate tag i
  tag_list="$(gh api --paginate "repos/${GITHUB_REPOSITORY}/tags?per_page=100" --jq '.[].name')"
  release_list="$(gh api --paginate "repos/${GITHUB_REPOSITORY}/releases?per_page=100" --jq '.[].tag_name')"
  read_names "$tag_list"
  read_names "$release_list"

  highest=""
  for name in "${names[@]+"${names[@]}"}"; do
    [[ "$name" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]] || continue
    if [[ -z "$highest" ]] || semver_greater "$name" "$highest"; then
      highest="$name"
    fi
  done

  if [[ -z "$highest" ]]; then
    major=1
    minor=0
    patch=0
    echo "No existing vMAJOR.MINOR.PATCH tag. First release is v1.0.0." >&2
  else
    IFS=. read -r major minor patch <<< "${highest#v}"
    patch=$((10#$patch + 1))
    echo "Highest existing semver tag is ${highest}. Next patch candidate is v${major}.${minor}.${patch}." >&2
  fi

  tag=""
  for ((i = 0; i < 100; i++)); do
    if ((10#$patch >= 1000)); then
      echo "Patch ${patch} does not fit versionCode (minor * 1000 + patch)." >&2
      exit 1
    fi
    candidate="v${major}.${minor}.${patch}"
    if tag_or_release_exists "$candidate"; then
      echo "Tag or release ${candidate} already exists. Taking the next unused patch instead of failing." >&2
      patch=$((patch + 1))
      continue
    fi
    tag="$candidate"
    break
  done

  if [[ -z "$tag" ]]; then
    echo "No unused patch version within 100 increments of v${major}.${minor}.0." >&2
    exit 1
  fi
  printf '%s\n' "$tag"
}

if [[ "$print_only" -eq 1 ]]; then
  resolve_next_tag
  exit 0
fi

if [[ -n "${ANDROID_RELEASE_TAG:-}" ]]; then
  tag="$ANDROID_RELEASE_TAG"
  if [[ ! "$tag" =~ ^v[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "ANDROID_RELEASE_TAG must be vMAJOR.MINOR.PATCH, got ${tag}." >&2
    exit 1
  fi
  if tag_or_release_exists "$tag"; then
    echo "ANDROID_RELEASE_TAG ${tag} already has a tag or Release. Refusing to publish a different version than the APK was built with." >&2
    exit 1
  fi
  echo "Publishing the precomputed tag ${tag}." >&2
else
  tag="$(resolve_next_tag)"
fi

asset="nba-basketball-kill-${tag}-debug.apk"
asset_path="${RUNNER_TEMP:-${TMPDIR:-/tmp}}/${asset}"
cp "$apk_src" "$asset_path"

notes=$(cat <<EOF
篮球杀（nba-basketball-kill）${tag} 的 Android debug APK。

这是可以直接安装试玩的 debug 包，包名 \`com.tianyi.nbabasketballkill\`，应用名「篮球杀」。不是用于上架的正式签名包。安装包里是单机 AI 局，不包含局域网房间服务器。

- 版本标签：\`${tag}\`
- 附件：\`${asset}\`
- 提交：\`${GITHUB_SHA}\`
- 构建：${GITHUB_SERVER_URL:-https://github.com}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID:-0}

把附件传到手机后安装即可。系统如果提示未知来源，允许安装这个应用。如果手机上还装着旧的 CI 安装包，先卸载一次再装这一版；之后同一把 debug 签名可以覆盖安装后续版本。
EOF
)

echo "Publishing GitHub Release ${tag} with asset ${asset}."
gh release create "$tag" "$asset_path" \
  --repo "$GITHUB_REPOSITORY" \
  --title "篮球杀 ${tag}（debug APK）" \
  --notes "$notes" \
  --target "$GITHUB_SHA"

asset_names="$(gh release view "$tag" --repo "$GITHUB_REPOSITORY" --json assets --jq '.assets[].name')"
if ! printf '%s\n' "$asset_names" | grep -Fxq "$asset"; then
  echo "Release ${tag} was created without the APK asset ${asset}." >&2
  exit 1
fi
url="$(gh release view "$tag" --repo "$GITHUB_REPOSITORY" --json url --jq .url)"
echo "Release URL: ${url}"

if [[ -n "${GITHUB_STEP_SUMMARY:-}" ]]; then
  cat >> "$GITHUB_STEP_SUMMARY" <<EOF
### 篮球杀 debug APK

- Release: ${url}
- 附件: \`${asset}\`
- 版本规则: 构建前按已有 tag 算出下一个 patch，APK 的 versionName/versionCode 与这个 tag 一致。若该 tag 或 Release 已存在，任务失败，不会改发另一个版本号。
EOF
fi
