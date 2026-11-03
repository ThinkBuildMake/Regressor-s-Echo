#!/bin/sh
# Checks a generated sound for the review: prints length, loudness, peak (clipping), and silence at the start
# and end, and draws a waveform + spectrogram picture to look at. Listening is still the user's call.
#   sh tools/audio-check.sh <in.ogg> <out.png>
in="$1"; out="$2"
[ -z "$in" ] || [ -z "$out" ] && { echo "usage: sh tools/audio-check.sh <in.ogg> <out.png>"; exit 1; }
dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$in")
vol=$(ffmpeg -hide_banner -i "$in" -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume" | sed 's/.*\] //' | tr '\n' ' ')
# Silence only counts at an edge if the first detected silence starts at 0 (in reverse for the tail).
edge() { ffmpeg -hide_banner -i "$in" -af "$1silencedetect=noise=-50dB:d=0.05" -f null - 2>&1 | grep -E "silence_(start|end)" | head -2 \
  | awk '/silence_start/ { s=$NF } /silence_end/ { if (s+0 < 0.01) print $5; exit }'; }
lead=$(edge ""); tail=$(edge "areverse,")
echo "$in: ${dur}s | $vol| lead silence ${lead:-0}s | tail silence ${tail:-0}s"
ffmpeg -hide_banner -loglevel error -y -i "$in" -filter_complex \
  "[0:a]showwavespic=s=800x160:colors=0x2f7a55[w];[0:a]showspectrumpic=s=800x200:legend=0[s];[w][s]vstack" "$out"
