#!/bin/bash
set -euo pipefail

if ! command -v apt-get >/dev/null 2>&1; then
  echo "apt-get no está disponible en este entorno. Instalá manualmente las librerías de Puppeteer." >&2
  exit 1
fi

if ! command -v dpkg-deb >/dev/null 2>&1; then
  echo "dpkg-deb no está disponible. Instalalo antes de continuar." >&2
  exit 1
fi

PACKAGES=(
  libnss3
  libnspr4
  libdbus-1-3
  libcups2
  libxkbcommon0
  libatspi2.0-0
  libavahi-common3
  libavahi-client3
  libwayland-server0
  libwayland-client0
  libatk1.0-0
  libatk-bridge2.0-0
  libdrm2
  libxcomposite1
  libxdamage1
  libxfixes3
  libxrandr2
  libgbm1
  libpango-1.0-0
  libasound2
)

LIB_DIR="${HOME}/.local/puppeteer-libs"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "${TMP_DIR}"' EXIT

APT_ROOT="${TMP_DIR}/apt"
mkdir -p "${APT_ROOT}/state/lists/partial" "${APT_ROOT}/cache/archives/partial"
APT_OPTS=(
  -o "Dir::State=${APT_ROOT}/state"
  -o "Dir::State::lists=${APT_ROOT}/state/lists"
  -o "Dir::State::status=${APT_ROOT}/state/status"
  -o "Dir::Cache=${APT_ROOT}/cache"
  -o "Dir::Cache::archives=${APT_ROOT}/cache/archives"
)

echo "Descargando índices de paquetes en ${APT_ROOT}…" >&2
apt-get "${APT_OPTS[@]}" update >&2

mkdir -p "${LIB_DIR}"
pushd "${TMP_DIR}" >/dev/null
for pkg in "${PACKAGES[@]}"; do
  echo "Descargando ${pkg}…" >&2
  apt-get "${APT_OPTS[@]}" download "${pkg}" >&2
  deb_file=$(ls "${pkg}"_*.deb | head -n1)
  if [ -z "${deb_file}" ]; then
    echo "No pude descargar ${pkg}. Revisá el log de apt-get." >&2
    exit 1
  fi
  echo "Extrayendo ${deb_file} en ${LIB_DIR}…" >&2
  dpkg-deb -x "${deb_file}" "${LIB_DIR}"
done
popd >/dev/null

echo "Listo. Las bibliotecas quedaron en ${LIB_DIR}." >&2
cat <<'INSTRUCCIONES'
Agregá esto a tu shell si querés usar las librerías fuera de script.sh:
  export LD_LIBRARY_PATH=${HOME}/.local/puppeteer-libs/lib/x86_64-linux-gnu:${HOME}/.local/puppeteer-libs/lib:${HOME}/.local/puppeteer-libs/usr/lib/x86_64-linux-gnu:${HOME}/.local/puppeteer-libs/usr/lib:${LD_LIBRARY_PATH:-}
INSTRUCCIONES
