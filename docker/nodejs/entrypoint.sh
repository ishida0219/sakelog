#!/bin/sh
set -eu

cd /app

mkdir -p /app/.manus-logs /pnpm/store

if [ ! -f node_modules/.modules.yaml ]; then
  pnpm install --frozen-lockfile
fi

exec "$@"
