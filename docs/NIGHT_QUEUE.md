# Night queue — started 2026-11-02 (branch night/2026-11-02, worktree ../Game-Week-night)

Goal: Worlds 1–3 playable end to end, every room in the showcase style (docs/LEVELS.md "Direction after the first playtest").

**Every room task is done when:** its intended solution is a replay in tests/check.html and passes; `node tools/validate-rooms.mjs game.js` passes; the room is in the world's chain; LEVELS.md says Built; the full suite passes after merging.

## Todo
- [ ] Merge night-w2's tree guardian (W3 rooms shift 30 tiles right)
- [ ] Stag second pass: its own wide arena (about 40 × 17, the camera follows), the old tree and the note in a room of their own, then the pyramid entrance and the ending (the first pass squeezed it all into the old 30 × 17 placeholder room)
- [ ] Playtests: one Claude playtester per world, playing from its first room through its boss with real key presses, reporting skips, softlocks and unfair deaths; fix what they find
- [ ] Full run from the clearing to the ending card without dev keys
- [ ] Morning summary at the top of NIGHT_LOG.md

## Doing
- [ ] Full suite hangs (>10 min) after merging the moth and the first stag pass; progress marker added to find where

## Done
- [x] Baseline: `npm test` green on merged main (4m30s) — fd234ed
- [x] Showcase rooms in the chain (+ narrow-landing physics fix, clean replays, ?only= filter) — 1434b9f^
- [x] W1 The long pit — 1434b9f
- [x] W1 The well, The gatehouse, the moth fight (dust, 3 stomps, 2nd rune → W2)
- [x] W2 Let go, Off the edge, The ladder, The beam, The spring, Wrong order
- [x] W3 Three high, In my own way, Three jobs, Everything, The rehearsal (aimed beam), the spectral stag (first pass) and the ending

## Blocked
