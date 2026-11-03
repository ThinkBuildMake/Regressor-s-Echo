# Night log (audio)

23:30 started. Baselines: ElevenLabs Creator, 25,092 / 131,000 credits used (overage disabled: it can't bill extra). OpenRouter key usage $0 (critic is BYOK on Google Vertex; byok_usage baseline 285.6507). 5-hour usage 63%.
23:30 DECISION: own worktree + branch `night/2026-11-02-audio`, because `night/2026-11-02` belongs to the level chat's night run and main is shared with other sessions.
23:30 DECISION: ElevenLabs stop line = 20,000 credits left, so the user keeps a buffer for the week.
23:30 DECISION: critic model is google/gemini-3.5-flash pinned to google-vertex (user asked for a cheaper model than Argon). ~$0.002 per listen; night cap $10 on Vertex BYOK spend (tracked via OpenRouter byok_usage delta).
00:05 fixed audio-make.sh: takes are judged against the ORIGINAL prompt (rewrites only steer generation).
00:20 pen-scratch: 9/10 on take 3. Kept.
00:30 boss-dissolve: 3 approaches (loop, 3 takes; layered shimmer + inhale; prompt realigned to the story chat's "shimmer into a whoosh"): best 6/10. Kept the 6 as boss-dissolve.ogg; layered version saved as boss-dissolve-alt-layered.ogg. NEEDS REVIEW.
00:30 earthquake: 3 approaches (loop; ElevenLabs rumble + pebbles mixed; ffmpeg-synthesized sub-bass rumble + pebbles): best 4–5/10. Kept the loop's best as earthquake.ogg; synth version saved as earthquake-alt-synth.ogg. NEEDS REVIEW. Note: Gemini may under-hear deep bass, so trust ears over its score here.
00:30 DECISION: boss-dissolve prompt realigned to the story chat's intent ("shimmer into a whoosh"), dropping the beads.
00:45 sfx batch started (first run died on Python SSL certs for the credit check; switched that check to node). 105,583 credits left.
00:50 music batch started in parallel (2 concurrent ElevenLabs requests, limit is 5). Loops: generated one bar long, trimmed to whole bars, the extra bar faded over the start; seam = end vs start RMS.
00:50 DECISION: critic told when it is judging music (--music) so it doesn't grade a loop as a sound effect.
01:40 music: 9 tracks generated. Critic first failed on long files (ffmpeg output overflowed node's 1 MB buffer): fixed by sending compact mono mp3 with a 64 MB buffer.
01:55 music loops: tried picking shorter phrase lengths to match end/start level; it only shortened loops. Measured the raws: ElevenLabs holds level until the final ~2 s and fades only the last bar, so the full planned length is right (the faded bar becomes the crossfade tail). Rebuilt at full length.
02:00 music scores: title 8, World 1 10, World 2 10, World 3 10, shrine 10, moth 10, tree 10, stag 9, ending 10.
