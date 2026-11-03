# Regressor's Echo — Ideas Backlog

Every idea raised so far, so we can decide what to build. Status:

- **Built**: in the greybox now (`game.js`)
- **Proposed**: agreed direction, not built yet
- **Undecided**: needs a call
- **Cut**: dropped unless we change our minds

---

## Core mechanic

| Idea | Status | Notes |
|---|---|---|
| Dying leaves your body behind as a solid block | Built | Stand on it, stack it, use it to hold switches |
| Bodies obey physics (fall straight down, stack, collapse when the bottom one vanishes) | Replaced by floating | Still available on key 1 |
| Body limit: past the limit, your oldest body vanishes | Built | Key 3 toggles 1/2/3/5/unlimited in the greybox |
| Bodies float where you died (a soul), instead of falling | Decided: float (default) | Key 1 switches back to falling. More uses: mid-air steps, bridges, shields at any height. Reach is capped by soul count, since a new death removes your oldest body. Costs: no crushing enemies (fine: only bosses need beating), no stack collapse |
| Bodies snap to the tile grid | Built (toggle) | Key 2. Easier to read puzzles with snap on |
| Die-anywhere button vs. only dying to the environment | Decided: unlocked late | Off by default (key 4 turns it on for testing). World 1 is environment-only deaths. Unlocked in World 2, together with the 2nd soul |
| What unlocks die-anywhere | Decided: the amulet grows stronger | The amulet gains one rune per boss, each with a new power (World 2: 2 souls + self-destruct; World 3: 3 souls + recall). It's not a single awakening. After the moth, the 2nd rune lights up. You can then release your soul at will: the hero bursts into blue and white flames, leaving a body. Guide: *"You can let go whenever you like now. Trust me, it's worse when you choose it."* Rejected: big red button (clashes with the tone), dagger (self-harm connotations), burst mushroom, will-o'-wisp |
| Soul explosion also affects the world (e.g. breaks cracked walls, lights braziers) | Undecided | Would give World 3 new puzzles from the same action. Only if time allows. The burst never damages enemies |
| Wall jump | Decided, built (greybox) | Slide down a wall (or a soul) while pushing into it; jump to kick off. A gentle kick (about 2 tiles out, a bit lower than a jump). Hold jump for the full kick, tap for a small one. You can't kick off the same side twice in a row, and steering locks for 0.3s after a kick, so one wall or ledge face gives no extra height. Gaps 2–3 tiles wide between two walls climb about 1.7–1.9 tiles per kick; a soul can be the second wall. No climbing or stamina |
| Self-destruct is held (about 0.75s) | Decided | Hold the button while the flames grow. You keep moving, jumping and falling, so where the soul lands depends on when you started. Letting go early cancels. A hazard that hits you mid-hold kills you on the spot |
| Recall: take souls back without dying | Decided (World 3) | Tap removes your newest soul; hold keeps going, newest first, speeding up. Mostly a convenience (unblock yourself without dying several times). Recalling the soul you stand on drops you, so dropping through a platform needs it to be your newest. Not a death, so it doesn't hurt and bosses don't heal |
| Dying is sometimes bad: a body in the wrong spot blocks your own path | Built | Walker tunnel room. R resets the room if you trap yourself |

## Progression

| Idea | Status | Notes |
|---|---|---|
| Start with 1 soul (1 body at a time); the soul grows stronger to allow 2, then 3 | Decided | World 1: 1 soul. World 2: 2 souls + self-destruct. World 3: 3 souls + recall. Rooms per world: [LEVELS.md](LEVELS.md) |
| New tools that change where and how you can die | Proposed | Each tool should create a new way to place a body, not just a movement trick |
| Slide → leaves a lying body (2 wide × ½ tall) instead of a standing one (1 × 1) | Built | S/↓ while running. Jumping mid-slide is a dive: you stay flat until you land. Lying: bridges, covering wide spike pits, sealing holes, blocking vertical lasers. Standing: steps, towers, switches, blocking horizontal lasers |
| Slide also as a movement tool (faster on the ground, fits under low gaps) | Decided: speed boost, from World 1 | Right now it's faster than running for 0.4s. Low gaps need half-tile walls, which the grid doesn't support yet |

## Hazards and enemies

| Idea | Status | Notes |
|---|---|---|
| Spikes; your body covers them | Built | |
| Pressure plates and doors; a body holds the plate down | Built | |
| Walker enemy: kills on touch, turns at walls, bodies and ledges | Built | Enemies are obstacles, not things to kill. Only bosses get defeated. The walker room was built for falling bodies and needs a redesign |
| Player attack / weapon | Decided: none, but you can stomp | A weapon would compete with the body mechanic. Landing on an enemy from above kills it (Mario-style). It comes back once its starting spot scrolls off screen (so it's waiting when you return), when you die, or when you re-enter the room. In a one-screen room the spot never leaves the screen, so only dying or R brings it back. Bosses take stomps from steps built out of souls |
| Lasers: kill you, and your body blocks the beam | Proposed | A body that dies in mid-air falls out of the beam, so it needs support to stay in the way |
| Fall damage: a long fall kills you where you land | Proposed | A death you can control. Limits itself: each body shortens the next fall |
| Moving hazards | Built (greybox) | **Saw blades** run along a row or column and reverse at walls; a soul in their way **jams** them where you died (can save you or wall you off). **Crumbling blocks** break 0.45s after you land and return 2.5s later. **Falling spikes** drop when you pass under them, so you die where you didn't plan |
| Springs launch the hero (later worlds) | Proposed | Height no jump can reach. W2: hold during the flight to place a soul higher than any jump |
| Getting rid of enemies | Decided: stomp, or lure | Stomp them, or lure them into hazards. The self-destruct burst still does no damage |
| Celeste-style spike wells | Decided | Drop into spikes to make a soul platform, respawn, drop onto that platform, jump off it toward the next ledge, die again lower down. Works with 1 soul and gets longer with shrines or more souls |

## Bosses

| Idea | Status | Notes |
|---|---|---|
| Boss heals to full whenever you die | Built | Setup phase (die to place bodies), then a fight where you must not die |
| Dying mid-fight ruins your setup (your oldest body vanishes, and the new one lands somewhere unhelpful) | Built | Follows from the body limit and physics |
| Stomp the boss from a body; 3 hits; it speeds up each hit | Built | A 1-high step is safe; 2-high puts you in its path |
| Attack colors | Decided | Normal boss attacks are yellow. Before an attack that breaks souls, the boss glows blue while it charges (it's pulling on soul power), so players know to protect their souls. Watch that the yellow stays clearly apart from the amulet's gold |
| Dying to block an attack | Decided: full heal | Any death heals the boss to full. A one-hit heal would let players brute-force a fight by dying over and over. So dying to block is free during setup (the boss is already full) and costly once you've landed a stomp |
| Soul-breaking beam aims at you | Proposed | It shows an aiming line pointed at the hero. You lead it away from your soul wall. If it breaks a soul, rebuilding means dying, which heals the boss |
| Wave you can't dodge | Proposed | Breaks 2 souls and stops at the 3rd, so only a wall 3 souls thick protects you. Final boss only |
| Boss arc | Proposed | Moth (1 soul): hide behind your soul; can't break souls. Tree (2 souls): a slow, clearly signaled slam hits the soul nearest you, so you lure it to the soul you don't need and stomp from the one you kept. Stag (3 souls, final): build a 3-thick wall during a calm setup, then loop charge → beam (lead it away) → wave every ~15s (hide), and win with 3 stomps |
| The three bosses | Decided | World 1: **great moth spirit** (floats, wing-dust shots, can't destroy souls). World 2: **tree guardian** with a stone mask face (stationary, branch swings and seed pods, can smash souls). World 3: **spectral stag** (charges, destroys souls it hits, has attacks you can't dodge) |
| Dialogue portraits | Decided | Dialogue box at the top of the screen: hero portrait on the left, guide on the right, name label, typed-out text. Hero: 8 expressions (neutral, startled, pained, exhausted, determined, relieved smile, thinking, sad). Guide: 6 (wry, amused, solemn, sad, thinking, warm) |
| Hero personality | Decided | An ordinary, slightly lazy treasure hunter who wants one good find so he can take it easy. Talks to himself, copes by denying and bargaining, has common sense, and takes betrayal personally. Full description: [STORY.md](STORY.md). Extra faces: curious (eyebrow raise at the amulet), annoyed, excited, scared, shouting, cocky |
| Pain pacing | Decided | Strain lines by death count (1, 3, 10, 25…), each different: shouting, then grumbling, then silence, then a numb joke |
| The guide's look and voice | Decided | Looks **exactly** like the hero, because every death sends him back in time: same age, face, clothes, no scars. Only differences: a translucent blue-white ghost (the soul color, because he is a soul), and tired, knowing, slightly hollow eyes. In the level he's see-through, flameless and floating, so he never reads as a soul you can stand on. **Voice (decided):** tired first, playful second. Dry, quiet mischief; technically honest but leaves out the catch; deflects instead of apologizing; cares only when it's earned. Full description: [STORY.md](STORY.md) |
| Hero look | Decided (changed) | Robin Hood–style treasure hunter: blond, deep forest-green cloak (hood down, darker than the trees), long wavy red scarf, leather jerkin and satchel, gold amulet. No sword, bow or pointed cap, to stay clear of Link (Zelda). Painted with Nano Banana Pro as a sprite sheet; the code-drawn hooded figure is a placeholder |
| Boss passes through bodies vs. is blocked by them | Undecided | Passing through now. Blocking would let players trap it |
| Boss projectiles that bodies block | Proposed | Bodies become shields as well as steps |
| Some attacks can't be dodged; you need a body to block them | Proposed | Forces body placement as part of the fight, not just the setup |
| Boss 1 can't destroy bodies; later bosses can | Proposed | Later fights: dodge so your bodies survive until the attack you can't dodge, then spend them |

## Stage structure (draft)

1. **Forest edge / Ruined Approach**: 1 soul, standing and lying (slide) bodies. Teaches steps, spikes, switches and the slide. Ends with earning the 2nd soul.
2. **Overgrown ruins / Spire**: self-destruct and the 2nd soul (the slide now comes in World 1). Walkers and lasers. Boss 1 (can't destroy bodies). Ends with the 3rd soul.
3. **Sanctum / where the herb grows**: all tools. Final boss destroys bodies and has attacks you can't dodge.

## Story and theme

**Given:**
- A treasure hunter travels through a forest in search of treasure (decided).
- He finds an amulet on the ground and puts it on.
- He meets a ghost of himself from another timeline, who asks: *"Which death are you currently on?"*
  - Adventurer: *"Death? I'm on?"*
  - Ghost: *"First timer then, huh? Well, I guess introductions are in order."*
- The ghost becomes the guide.
- After the first death, the amulet brings him back to life.
- He feels every death, and the dialogue shows the mental strain building.

**Story arc (decided): a power that looks like a curse turns out to be strength.**

| World | Hero's state | What happens |
|---|---|---|
| 1. Forest edge | Fear and denial: every death hurts, and he hates the amulet | The guide teaches him to use his deaths |
| 2. Overgrown ruins | Enduring: numb, worn down, the strain dialogue peaks | Learns the guide's own history |
| 3. Sanctum | Acceptance: the 3rd rune lets him recall his deaths; control through planning | Uses it deliberately against the final boss |
| Ending | | Finds the treasure, meets a new version of himself, and asks *"Which death are you currently on?"* |

Dialogue gets written last, once the rooms exist. The dialogue system gets built early with placeholder lines.

**Suggestions (undecided):**
- ~~Make it an herb, for someone.~~ Decided against: he's a treasure hunter. Could still give the treasure a personal reason later (what he needs it for).
- **The story and mechanic pull against each other, and that's the theme.** The mechanic needs you to die; the story says every death hurts. The boss rule backs this up: careless deaths ruin you.
- **Pace the strain dialogue by death count.** Lines at deaths 1, 3, 10, 25 and so on, not after every death. Short lines that don't stop play, so dying doesn't become a chore.
- **Show the strain without words too.** The hero gets wearier (slower idle, drooping pose), and the colors fade slightly as the death count rises.
- **Show the death count on screen**, as the answer to the guide's question.
- **Possible ending: the hero becomes the guide.** He finds the herb, then meets a new version of himself and asks, *"Which death are you currently on?"* That closes the loop and gives the clear ending the brief asks for.
- **What the guide shows** (undecided): the guide's own death count, revealed late, could show how much worse it gets.
- **Color rule (decided):** blue/white = souls: your bodies (solid, flame-topped, standable), the hero's death, and the guide (see-through, flameless, floating). Gold = the amulet and its runes. One exception: a boss glows blue while charging an attack that breaks souls (it draws on soul power). Boss attacks are yellow, kept clearly apart from the amulet gold. Otherwise keep these colors for those uses only, so they stay meaningful.
- **Visual tone:** bodies as translucent blue soul-husks, not gore. This matches the blue/gold palette in the design doc and keeps the forest setting gentle.
- **Setting:** forest overgrown with ruins, so both the forest idea and the design doc's "magical ruins" fit.

## Level structure (decided, Celeste-style)

| Decision | Choice |
|---|---|
| Room size | Mostly one screen, so the whole puzzle is visible. A few bigger rooms (climbs, boss arenas) where the camera follows you. **Built** |
| Moving between rooms | Walk through a gap and the camera slides to the next room while the game holds still. **Built** |
| Respawn | At the entrance nearest to where you came in. **Built** |
| Souls when you leave a room | They clear. The soul limit is per room, so each room is a fresh puzzle. **Built** |
| Going back | Main path is one-way. Optional side rooms (for artifacts) open back to the room you came from. Set per room by where the gaps are |
| Building levels | Text grids while greyboxing, Tiled (free visual editor) for final levels |
| Screen and tile size | Keep 960×544 with 32px tiles |
| Between worlds | Chapter select after the title screen; progress saves per world |
| Death counter | Per world, shown on screen (answers the guide's question) |
| Collectibles | **Artifacts**, since the hero is a treasure hunter. Idea: each belonged to a past version of you from another timeline and reveals how that version died. Only if time allows |

## Art direction

**Decided: painted style, with flat shapes as the fallback.** Style comparison: https://claude.ai/artifact/WfWGrCaxYsEs2mTMPnoSdr

- **Backgrounds:** AI-painted, 3–4 parallax layers per world (sky, far trees, middle trees, near foliage). Generated one at a time with a shared style prompt, on a flat solid color that's easy to cut away.
- **Ground you play on:** code-drawn shapes filled with a painted texture, moss edges, higher contrast than the background. Backgrounds slightly hazy and muted so gameplay stays readable.
- **Hero:** blond treasure hunter in a deep forest-green cloak with a wavy red scarf, painted with Nano Banana Pro as a sprite sheet (run, jump, fall, slide). Fallback: one painting cut into parts and animated in code.
- **Bosses:** one large painted image each, animated with movement, squash and stretch, and particles.
- **Budget:** about 12–15 generated images total.
- **Fallback:** if World 1's painted layers don't look cohesive by Tuesday midday, switch to flat shapes drawn in code. Same layer structure, so only the art changes.
- **Open:** which image generation tool to use.

## Required before release

- **Content warning as the first screen**, before the title, dismissed with a click (that click also lets browsers play audio). Draft:
  > **Content warning:** This game depicts repeated character death, including deaths the character chooses, and themes of psychological distress. Player discretion is advised.
  >
  > If you're struggling, you're not alone. Support is available at findahelpline.com.

  Open question: say "self-harm" explicitly, or keep the wording above.

## Cut or on hold

| Idea | Status | Why |
|---|---|---|
| Time-echo layer (ghosts replaying your past runs) | On hold | Riskiest piece to build in a week. Souls + slide + bosses already add something new in each stage |
| More enemy types | Built (greybox) | **Flyer**: flies over souls, so soul walls don't stop it. **Thrower**: stands still and shoots along the ground; souls block its shots, so a soul doubles as a shield |
