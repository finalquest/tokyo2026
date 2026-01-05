#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"
export GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY:-}
if [ -z "$GOOGLE_MAPS_API_KEY" ]; then
  echo "GOOGLE_MAPS_API_KEY no está definida. Exportala antes de correr este script." >&2
  exit 1
fi
npm run routes
