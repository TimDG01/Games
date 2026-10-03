#!/bin/sh
# Gebruik: tools/bump-version.sh 2.3
# Zet de nieuwe versie in version.js en in de verwijzing naar version.js in elke pagina,
# zodat browsers niet blijven hangen op een oude kopie.
set -e
[ -n "$1" ] || { echo "gebruik: $0 <versie>"; exit 1; }
cd "$(dirname "$0")/.."
sed -i "s/SITE_VERSION = '[^']*'/SITE_VERSION = '$1'/" version.js
find . -name '*.html' -not -path './.git/*' | while read -r f; do
  sed -i -E "s#(src=\"(\.\./\.\./)?version\.js)(\?v=[^\"]*)?\"#\1?v=$1\"#" "$f"
done
grep -rn "version.js" --include='*.html' . | sed 's/^/  /'
