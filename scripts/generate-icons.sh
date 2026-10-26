#!/usr/bin/env bash
# Génère les icônes de l'app (favicon, PWA, iOS) à partir de assets/icon-source.png.
# Nécessite ImageMagick 7 (commande `magick`). Usage : ./scripts/generate-icons.sh
set -euo pipefail
cd "$(dirname "$0")/.."

SRC=assets/icon-source.png
OUT=public
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# Le carré arrondi de l'image source occupe la zone 64→1190 px (1126 px de côté).
CARD=1126x1126+64+64
RADIUS=220

# Pleine page, fond noir : iOS et Android appliquent leur propre masque arrondi.
magick "$SRC" -crop "$CARD" +repage "$TMP/square.png"

# Coins transparents : favicon et icônes « any » du manifeste.
magick "$SRC" \
  \( -size 1254x1254 xc:black -fill white -draw "roundrectangle 64,64 1190,1190 $RADIUS,$RADIUS" \) \
  -alpha off -compose CopyOpacity -composite -crop "$CARD" +repage "$TMP/rounded.png"

resize() { magick "$1" -filter Lanczos -resize "$2x$2" -strip "$3"; }

resize "$TMP/rounded.png" 192 "$OUT/pwa-192x192.png"
resize "$TMP/rounded.png" 512 "$OUT/pwa-512x512.png"

# Maskable : le contenu doit tenir dans le cercle central (80 %), on ajoute une marge noire.
magick "$TMP/square.png" -filter Lanczos -resize 420x420 -background black -gravity center \
  -extent 512x512 -strip "$OUT/maskable-512x512.png"

# iOS ignore les icônes du manifeste : apple-touch-icon (iPhone 180, iPad 152, iPad Pro 167).
resize "$TMP/square.png" 180 "$OUT/apple-touch-icon.png"
resize "$TMP/square.png" 152 "$OUT/apple-touch-icon-152x152.png"
resize "$TMP/square.png" 167 "$OUT/apple-touch-icon-167x167.png"

magick "$TMP/rounded.png" -filter Lanczos -define icon:auto-resize=48,32,16 "$OUT/favicon.ico"

echo "Icônes générées dans $OUT/"
