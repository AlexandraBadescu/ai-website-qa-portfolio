#!/usr/bin/env bash
# CI privacy guard: audit the author and committer email of every reachable commit.
# Does not print addresses: CI logs should not expose the very data being checked.
set -euo pipefail
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo 'ERROR: No Git repository yet. This check runs after the first private commit.' >&2
  exit 2
fi
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
  echo 'ERROR: No commit to inspect yet.' >&2
  exit 2
fi
count=0
bad=0
while IFS= read -r email; do
  [[ -z "$email" ]] && continue
  count=$((count+1))
  case "$email" in
    *@users.noreply.github.com|noreply@github.com) ;;
    *) bad=$((bad+1)) ;;
  esac
done < <(git log --all --format='%ae%n%ce')
if [[ "$count" -eq 0 ]]; then
  echo 'ERROR: No Git author/committer metadata available.' >&2
  exit 2
fi
if [[ "$bad" -gt 0 ]]; then
  echo "FAIL: $bad author/committer email entries are not GitHub noreply addresses. Stop before publishing." >&2
  exit 1
fi
echo "PASS: inspected $count author/committer email entries; all use GitHub noreply addresses."
