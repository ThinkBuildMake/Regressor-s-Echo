# Night queue (audio) — started 2026-11-02 ~23:30
Worktree: /Users/mrchuang/Documents/Projects/Gauntlet/Game-Week-audio, branch `night/2026-11-02-audio` (the level chat has its own night run on `night/2026-11-02`; don't touch it).

## Todo
- [ ] Fix tools/audio-make.sh so every take is judged against the ORIGINAL prompt (rewrites only change what is generated). (done when: the script keeps an `orig` prompt for judging; one test run shows it)
- [ ] Redo boss-dissolve (drifted into a bead shaker), earthquake (generate a sub-bass rumble and a pebble clatter separately, mix with ffmpeg), pen-scratch (quiet, delicate). (done when: each scores ≥ 8 against its original prompt, or 3 takes tried and the best kept + NEEDS REVIEW logged)
- [ ] All remaining sound effects in docs/ASSETS.md → Audio → Sound effects, one at a time via tools/audio-make.sh, level by type, rows marked (3 takes) saved as name-1/-2/-3.ogg, files in assets/audio/sfx/<kebab-name>.ogg; mark Done in the table; commit in batches. (done when: every row has a file and a Done mark, scores logged)
- [ ] Music loops in docs/ASSETS.md → Music via tools/audio.mjs --music (length from bars × BPM), trimmed to whole bars with a short crossfade, seam checked, judged; files in assets/audio/music/<name>.ogg; the ending is not a loop. (done when: 9 files, each loop seam checked, scores logged)
- [ ] Listening page https://claude.ai/artifact/CLuj1KAWJxZPRxRSmERRfo (built from the scratchpad audiorev folder): every sound and track with players (.ogg + .mp3), picture, levels, critic score and description. Republish. (done when: page republished)
- [ ] Morning summary at the top of docs/NIGHT_AUDIO_LOG.md.

## Doing

## Done
- [x] Night worktree + branch set up; scene-sound retakes and tools committed — 4d2e35e

## Blocked
