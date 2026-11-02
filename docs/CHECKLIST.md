# Checklist

Due **Thursday at midnight**. Run `npm test` after every change, and commit each working feature.
Decisions and their reasons live in [IDEAS.md](IDEAS.md); this page is only what's left to do.
Art to make is tracked in [ASSETS.md](ASSETS.md).

## Sunday
- [x] Floating souls, slide and dive, connected rooms with camera slides, parallax, painted stand-ins
- [x] `npm test`, git, this checklist
- [x] World 1 painted: sky, far, middle, near foliage, earth, mossy top lip
- [ ] **You:** paint the hero (blond, green cloak, wavy red scarf): `hero.png`, `sheet.png`, `slide.png`
- [ ] Hero sprite sheet in the game; souls as his frames tinted blue with flames
- [ ] Dialogue system for the guide (placeholder lines)
- [x] World 1 reference image + layers ([PROMPTS.md](PROMPTS.md))

## Monday
- [ ] Lasers (souls block the beam)
- [ ] Boss shots that souls block, and attacks you can't dodge
- [ ] Boss 1: great moth spirit
- [ ] World 1 rooms (5–6), designed around 1 soul, ending in the moth
- [ ] Soul count as progression (1 → 2 → 3), earned between worlds
- [ ] Put the World 1 art in the game; **decide painted vs. flat by Tuesday midday**
- [ ] **You:** layers for Worlds 2 and 3, the three boss images

## Tuesday
- [ ] Boss 2: tree guardian (smashes souls). Boss 3: spectral stag (charges, can't-dodge attacks)
- [ ] World 2 rooms (slide unlocked), World 3 rooms (amulet awakens: die anywhere)
- [ ] Hazard and object art: thorns, spikes, doors, switches, the goal

## Wednesday
- [ ] Write the dialogue: guide intro, strain lines by death count, story beats, ending
- [ ] Sound effects (ElevenLabs) and music (Gemini Lyria)
- [ ] Content warning screen, title screen, chapter select, saving progress, pause, volume
- [ ] Death counter per world
- [ ] Remove the test HUD and rule switches from the player's view

## Thursday
- [ ] Someone else plays it start to finish; fix what they hit
- [ ] Test in Chrome, Safari and Firefox
- [ ] Bundle Phaser locally instead of loading it from the internet
- [ ] Put it online (GitHub Pages, Netlify or itch.io, with AI tags if itch.io) and test the link
- [ ] One code review pass

## If time allows
- [ ] Artifacts (collectibles) in side rooms
- [ ] Soul explosion affects the world (cracked walls, braziers)
