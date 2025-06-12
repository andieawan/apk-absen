#!/bin/sh
# Script: auto-version-push.sh
# Otomatis commit, tag, dan push ke GitHub dengan penomoran versi

# 1. Commit semua perubahan
msg=${1:-"feat: update aplikasi"}
git add .
git commit -m "$msg"

# 2. Ambil versi terakhir dari tag
last_tag=$(git tag --sort=-v:refname | head -n1)
if [ -z "$last_tag" ]; then
  new_tag="v1.0.0"
else
  # Naikkan minor version (misal: v1.0.0 -> v1.1.0)
  major=$(echo $last_tag | cut -d. -f1 | tr -d 'v')
  minor=$(echo $last_tag | cut -d. -f2)
  patch=$(echo $last_tag | cut -d. -f3)
  minor=$((minor+1))
  new_tag="v${major}.${minor}.0"
fi

echo "Tag versi baru: $new_tag"

git tag $new_tag
git push
git push origin $new_tag
