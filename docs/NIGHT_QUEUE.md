# Night queue — 2026-11-04 (branch night/2026-11-02, worktree ../Game-Week-night)

Goal: every room and boss in Worlds 1-3 verified possible, fair and skip-free by real play, with the new cutscenes, audio and story art working, merged into main by morning.

## Todo
- [ ] Merge the cutscene work (night-w1: line-by-line staging + cutscene input) once its agent verifies it
- [ ] World 1 QA-and-fix agent (after the cutscene merge) in ../Game-Week-w1
- [ ] Merge World 2 and World 3 QA-and-fix work; full suite twice
- [ ] Final start-to-finish playthrough (one Claude agent, real inputs, clearing to ending card, no dev keys); fix what it finds
- [ ] Merge night into main when the full suite passes twice
- [ ] Morning summary at the top of NIGHT_LOG.md

## Doing
- [ ] Cutscene input bug (moth exit after the win) — Claude agent in ../Game-Week-w1
- [ ] World 2 QA-and-fix — Claude agent in ../Game-Week-w2
- [ ] World 3 QA-and-fix — Claude agent in ../Game-Week-w3

## Done
- [x] Ending route fix (walk back to the old tree after the stag) — 3b1187e
- [x] Story art (amulet, runes, ghost, shrines, old tree), music and sound effects merged

## Blocked
- Menus / title screen: the user is generating art in another chat; don't build until asked
