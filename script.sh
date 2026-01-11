#!/bin/bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Uso: $0 <block-id> [args extra para render:block]" >&2
  exit 1
fi

BLOCK_ID="$1"
shift

cd "$(dirname "$0")"

INPUT_JSON="data/places-input/${BLOCK_ID}.json"
if [ ! -f "$INPUT_JSON" ]; then
  echo "No existe ${INPUT_JSON}. Generá el input antes de correr este script." >&2
  exit 1
fi

export GOOGLE_MAPS_API_KEY=${GOOGLE_MAPS_API_KEY:-}
if [ -z "$GOOGLE_MAPS_API_KEY" ]; then
  echo "GOOGLE_MAPS_API_KEY no está definida. Exportala antes de correr este script." >&2
  exit 1
fi

LIB_STASH="${HOME}/.local/puppeteer-libs"
if [ -d "$LIB_STASH" ]; then
  export LD_LIBRARY_PATH="${LIB_STASH}/lib/x86_64-linux-gnu:${LIB_STASH}/lib:${LIB_STASH}/usr/lib/x86_64-linux-gnu:${LIB_STASH}/usr/lib:${LD_LIBRARY_PATH:-}"
fi

echo "[${BLOCK_ID}] Ejecutando fetch:block…"
npm run fetch:block -- "$BLOCK_ID"

echo "[${BLOCK_ID}] Ejecutando routes:block…"
npm run routes:block -- "$BLOCK_ID"

echo "[${BLOCK_ID}] Ejecutando build:map…"
npm run build:map -- "$BLOCK_ID"

echo "[${BLOCK_ID}] Ejecutando render:block…"
npm run render:block -- "$BLOCK_ID" "$@"
