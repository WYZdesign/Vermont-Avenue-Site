#!/bin/sh
# Vermont Avenue Records ignoreCommand guard (vercel.json -> `sh _agent/vercel_ignore.sh`).
# exit 0 = skip the build, exit 1 = build. Fail-open: unknown state builds.
if [ -z "$VERCEL_GIT_PREVIOUS_COMMIT" ]; then
  echo "guard: no previous commit -> build"
  exit 1
fi

if git diff --quiet "$VERCEL_GIT_PREVIOUS_COMMIT" HEAD -- \
    src public db scripts package.json package-lock.json \
    next.config.ts tsconfig.json vercel.json _agent; then
  echo "guard: no app changes -> skip"
  exit 0
else
  echo "guard: app changes -> build"
  exit 1
fi
