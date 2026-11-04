#!/bin/sh
# Animated preview of a sprite sheet on the forest colour.  tools/sheet-gif.sh <sheet.png|webp> <frameWidth> <frames> <out.gif> [fps=8]
# Every cell must be the full image height.
in=$1; fw=$2; n=$3; out=$4; fps=${5:-8}
h=$(ffprobe -v error -show_entries stream=height -of csv=p=0 "$in")
ffmpeg -v error -y -f lavfi -i color=0x6f8f86:s=$((fw*n))x$h -i "$in" -filter_complex "[0][1]overlay=shortest=1,format=rgb24" -frames:v 1 "${out%.gif}_flat.png" || exit 1
ffmpeg -v error -y -loop 1 -framerate $fps -t $(echo "scale=3; $n*3/$fps" | bc) -i "${out%.gif}_flat.png" \
  -filter_complex "crop=$fw:$h:mod(n\,$n)*$fw:0,scale=-1:350,split[a][b];[a]palettegen[p];[b][p]paletteuse" "$out" && rm -f "${out%.gif}_flat.png"
