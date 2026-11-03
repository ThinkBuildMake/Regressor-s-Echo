# Night queue — started 2026-11-02 (branch night/2026-11-02, worktree ../Game-Week-night)

Goal: Worlds 1–3 playable end to end, every room in the showcase style (docs/LEVELS.md "Direction after the first playtest").

**Every room task is done when:** its intended solution is a replay in tests/check.html and passes; `node tools/validate-rooms.mjs game.js` passes; a playtester agent confirms the solution works, finds no skip around the trick, and finds no hidden softlock (Shift+R always gets you out); the room is in the world's chain (walking out of the previous room leads into it); LEVELS.md says Built.

## Todo
- [ ] W1 The well — redo in showcase style
- [ ] W1 The gatehouse — redo in showcase style
- [ ] W1 The moth — the full fight works: dust, soul shield and step, 3 stomps, heal on death, the defeat scene, 2nd rune → 2 souls + self-destruct, then leads into W2
- [ ] W2 Let go / Off the edge / The ladder / The beam / The spring / Wrong order — redo each in showcase style (one task each)
- [ ] W2 The tree guardian — write the detailed pattern into LEVELS.md (arena, timings, steps, speed-up), build it with the tree art in assets/bosses, STORY.md scenes 4–6, 3rd rune → 3 souls + recall
- [ ] W3 Three high / In my own way / Three jobs / Everything — redo each in showcase style
- [ ] W3 The rehearsal — design in LEVELS.md, build (soul-breaking beam that aims at you)
- [ ] W3 The spectral stag — detailed pattern in LEVELS.md, build (charge, beam, wave), STORY.md stag scenes and ending; stand-in art if no stag art exists
- [ ] Remove "End of the greybox"; the game runs from the clearing to the ending without dev keys
- [ ] Full run: one playtester per world from its first room to its boss, then one from the start to the end
- [ ] Morning summary at the top of NIGHT_LOG.md

## Doing
- [ ] Workers w1/w2/w3 running (scratchpad worker.sh); review + merge in batches

## Done
- [x] W1 The long pit — 1434b9f
- [x] W1 The well, W2 Let go, W3 Three high, W3 In my own way — merged 74fa519, full suite OK
- [x] Showcase rooms in the chain (+ narrow-landing physics fix, clean replays, ?only= filter) — 969d74c
- [x] Baseline: `npm test` green on merged main (4m30s) — fd234ed

## Blocked
