#!/bin/sh
# Fail-open build guard: skip the deploy only when no app file changed since the
# previous commit (e.g. docs/handover-only pushes). Exit 1 cancels the build.
if [ -z "$VERCEL_GIT_PREVIOUS_COMMIT" ]; then
  exit 0
fi

if git diff --quiet "$VERCEL_GIT_PREVIOUS_COMMIT" HEAD -- \
    src public db scripts package.json package-lock.json \
    next.config.ts tsconfig.json vercel.json _agent; then
  exit 1
else
  exit 0
fi
