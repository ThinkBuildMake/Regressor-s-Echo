# Night queue — 2026-11-04 (branch night/2026-11-02, worktree ../Game-Week-night)

Goal: every room and boss in Worlds 1-3 verified possible, fair and skip-free by real play, with the new cutscenes, audio and story art working, merged into main by morning.

## Todo
- [ ] Merge World 2 and World 3 QA-and-fix work; full suite twice
- [ ] Final start-to-finish playthrough (one Claude agent, real inputs, clearing to ending card, no dev keys); fix what it finds
- [ ] Merge night into main when the full suite passes twice
- [ ] Morning summary at the top of NIGHT_LOG.md

## Doing
- [ ] World 1 QA-and-fix — Claude agent in ../Game-Week-w1

## Done
- [x] World 2 QA-and-fix merged (a770aaf)
- [x] World 3 QA-and-fix merged (9ae325b)
- [x] Cutscene work merged (line-by-line staging, input stops during scenes, held keys need a fresh press); the moth failure was a test bug; full suite OK — 882ebd9
- [x] Ending route fix (walk back to the old tree after the stag) — 3b1187e
- [x] Story art (amulet, runes, ghost, shrines, old tree), music and sound effects merged

## Blocked
- Menus / title screen: the user is generating art in another chat; don't build until asked
