#!/usr/bin/env bash
# Compress gallery photos for the web.
#
# Walks every images/ subfolder that has a captions.csv (= a gallery
# folder, whatever its name) and compresses photos larger than 1 MB:
# fixes EXIF rotation, resizes to at most 2000px on the long edge, and
# re-encodes at quality 85. Compressed photos end up well under 1 MB,
# so they are skipped on later runs - it is safe to run this after every
# batch of new photos.
#
# Usage: ./compress-images.sh

set -euo pipefail
shopt -s nullglob
cd "$(dirname "$0")"

THRESHOLD_KB=1024
compressed=0

for csv in images/*/captions.csv; do
	dir=${csv%/captions.csv}
	for f in "$dir"/*.{jpg,jpeg,png,webp}; do
		size_kb=$(du -k "$f" | cut -f1)
		if (( size_kb > THRESHOLD_KB )); then
			mogrify -auto-orient -resize '2000x2000>' -quality 85 "$f"
			echo "compressed $f: ${size_kb} KB -> $(du -k "$f" | cut -f1) KB"
			(( ++compressed ))
		fi
	done
done

if (( compressed == 0 )); then
	echo "nothing to compress (no gallery image over ${THRESHOLD_KB} KB)"
fi
