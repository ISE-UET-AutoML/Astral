#!/bin/sh
set -e
cd /app

# Named volume hides image node_modules; ensure devDependencies (vite, typescript, …) exist.
if [ ! -x "node_modules/.bin/vite" ]; then
  echo "docker-entrypoint-dev: running npm ci (vite missing or incomplete node_modules)"
  npm ci
fi

exec npm run start
