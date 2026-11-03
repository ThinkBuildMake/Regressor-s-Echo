#!/bin/sh
# Generate → listen (Gemini critic) → retry with the critic's rewrite, up to 3 takes; keeps the best take.
#   sh tools/audio-make.sh <out.ogg> "<prompt>" [quiet|normal|loud]
# Each take is judged against the original prompt. Prints each take's score; the final file is the best-scoring take. Runs one request at a time
# (ElevenLabs allows 5 at once, and Vertex throttles bursts).
out="$1"; prompt="$2"; orig="$2"; level="${3:-normal}"; best=0; tmp="${out%.ogg}"
for take in 1 2 3; do
  node tools/audio.mjs "$tmp.take$take.ogg" "$prompt" --level="$level" >/dev/null || { sleep 5; continue; }
  # Always judge against the ORIGINAL intent; rewrites only change what gets generated (else meaning drifts).
  j=$(node tools/audio-judge.mjs "$tmp.take$take.ogg" "$orig" --level="$level" 2>/dev/null) || { sleep 10; j=$(node tools/audio-judge.mjs "$tmp.take$take.ogg" "$orig" --level="$level" 2>/dev/null); }
  score=$(printf '%s' "$j" | python3 -c "import json,sys; print(json.loads(sys.stdin.read()).get('match',0))" 2>/dev/null || echo 0)
  echo "take $take: match $score | $(printf '%s' "$j" | python3 -c "import json,sys; d=json.loads(sys.stdin.read()); print(d['loudness'], '|', d['hears'][:110])" 2>/dev/null)"
  if [ "$score" -gt "$best" ]; then best=$score; cp "$tmp.take$take.ogg" "$out"; printf '%s' "$prompt" > "$tmp.prompt.txt"; fi
  [ "$score" -ge 8 ] && break
  next=$(printf '%s' "$j" | python3 -c "import json,sys; print(json.loads(sys.stdin.read()).get('rewrite',''))" 2>/dev/null)
  [ -n "$next" ] && prompt="$next"
done
rm -f "$tmp".take*.ogg
echo "kept: match $best → $out (prompt in ${tmp}.prompt.txt)"
