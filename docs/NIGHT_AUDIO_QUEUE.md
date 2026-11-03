# Night queue (audio) — started 2026-11-02 ~23:30
Worktree: /Users/mrchuang/Documents/Projects/Gauntlet/Game-Week-audio, branch `night/2026-11-02-audio` (the level chat has its own night run on `night/2026-11-02`; don't touch it).

## Todo
- [ ] All remaining sound effects in docs/ASSETS.md → Audio → Sound effects, one at a time via tools/audio-make.sh, level by type, rows marked (3 takes) saved as name-1/-2/-3.ogg, files in assets/audio/sfx/<kebab-name>.ogg; mark Done in the table; commit in batches. (done when: every row has a file and a Done mark, scores logged)
- [ ] Music loops in docs/ASSETS.md → Music via tools/audio.mjs --music (length from bars × BPM), trimmed to whole bars with a short crossfade, seam checked, judged; files in assets/audio/music/<name>.ogg; the ending is not a loop. (done when: 9 files, each loop seam checked, scores logged)
- [ ] Listening page https://claude.ai/artifact/CLuj1KAWJxZPRxRSmERRfo (built from the scratchpad audiorev folder): every sound and track with players (.ogg + .mp3), picture, levels, critic score and description. Republish. (done when: page republished)
- [ ] Morning summary at the top of docs/NIGHT_AUDIO_LOG.md.

## Doing
- [ ] Sound-effect batch (scratchpad night/sfx-batch.py → night/sfx.log), 52 rows / 64 files, running in background
- [ ] Music batch (night/music-batch.py → night/music.log), 9 tracks, running in background

## Done
- [x] audio-make judges against the original prompt — 8dcc9b4
- [x] Retakes: pen-scratch 9/10; boss-dissolve 6 and earthquake 4–5 kept with layered alternates (NEEDS REVIEW) — 8dcc9b4
- [x] Night worktree + branch set up; scene-sound retakes and tools committed — 4d2e35e

## Blocked
