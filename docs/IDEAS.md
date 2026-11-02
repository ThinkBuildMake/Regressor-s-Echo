# Reincarnation Echo — Ideas Backlog

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
| Die-anywhere button vs. only dying to the environment | Decided: unlocked late | Off by default (key 4 turns it on for testing). Worlds 1–2 are environment-only deaths. Unlocked as a big upgrade for World 3 |
| What unlocks die-anywhere | Decided: the amulet awakens | A rune on the amulet lights up as your soul grows stronger. You can then release your soul at will: the hero bursts into blue and white flames, leaving a body. Guide: *"You can let go whenever you like now. Trust me, it's worse when you choose it."* Rejected: big red button (clashes with the tone), dagger (self-harm connotations), burst mushroom, will-o'-wisp |
| Soul explosion also affects the world (e.g. breaks cracked walls, lights braziers) | Undecided | Would give World 3 new puzzles from the same action. Only if time allows |
| Dying is sometimes bad: a body in the wrong spot blocks your own path | Built | Walker tunnel room. R resets the room if you trap yourself |

## Progression

| Idea | Status | Notes |
|---|---|---|
| Start with 1 soul (1 body at a time); the soul grows stronger to allow 2, then 3 | Proposed | Turns the body limit into progression. With 1 soul, every death moves your only body |
| New tools that change where and how you can die | Proposed | Each tool should create a new way to place a body, not just a movement trick |
| Slide → leaves a lying body (2 wide × ½ tall) instead of a standing one (1 × 1) | Built | S/↓ while running. Jumping mid-slide is a dive: you stay flat until you land. Lying: bridges, covering wide spike pits, sealing holes, blocking vertical lasers. Standing: steps, towers, switches, blocking horizontal lasers |
| Slide also as a movement tool (faster on the ground, fits under low gaps) | Undecided | Right now it's faster than running for 0.4s. Low gaps need half-tile walls, which the grid doesn't support yet |

## Hazards and enemies

| Idea | Status | Notes |
|---|---|---|
| Spikes; your body covers them | Built | |
| Pressure plates and doors; a body holds the plate down | Built | |
| Walker enemy: kills on touch, turns at walls, bodies and ledges | Built | Enemies are obstacles, not things to kill. Only bosses get defeated. The walker room was built for falling bodies and needs a redesign |
| Player attack / weapon | Decided: none | A weapon would compete with the body mechanic. Bosses take stomps from steps built out of your bodies |
| Lasers: kill you, and your body blocks the beam | Proposed | A body that dies in mid-air falls out of the beam, so it needs support to stay in the way |
| Fall damage: a long fall kills you where you land | Proposed | A death you can control. Limits itself: each body shortens the next fall |
| Moving hazards (sweeping lasers, crushers) instead of more enemy types | Proposed | Same pressure, much less work than more enemies |

## Bosses

| Idea | Status | Notes |
|---|---|---|
| Boss heals to full whenever you die | Built | Setup phase (die to place bodies), then a fight where you must not die |
| Dying mid-fight ruins your setup (your oldest body vanishes, and the new one lands somewhere unhelpful) | Built | Follows from the body limit and physics |
| Stomp the boss from a body; 3 hits; it speeds up each hit | Built | A 1-high step is safe; 2-high puts you in its path |
| The three bosses | Decided | World 1: **great moth spirit** (floats, wing-dust shots, can't destroy souls). World 2: **tree guardian** with a stone mask face (stationary, branch swings and seed pods, can smash souls). World 3: **spectral stag** (charges, destroys souls it hits, has attacks you can't dodge) |
| Hero look | Decided (changed) | Robin Hood–style treasure hunter: blond, deep forest-green cloak (hood down, darker than the trees), long wavy red scarf, leather jerkin and satchel, gold amulet. No sword, bow or pointed cap, to stay clear of Link (Zelda). Painted with Nano Banana Pro as a sprite sheet; the code-drawn hooded figure is a placeholder |
| Boss passes through bodies vs. is blocked by them | Undecided | Passing through now. Blocking would let players trap it |
| Boss projectiles that bodies block | Proposed | Bodies become shields as well as steps |
| Some attacks can't be dodged; you need a body to block them | Proposed | Forces body placement as part of the fight, not just the setup |
| Boss 1 can't destroy bodies; later bosses can | Proposed | Later fights: dodge so your bodies survive until the attack you can't dodge, then spend them |

## Stage structure (draft)

1. **Forest edge / Ruined Approach**: 1 soul, standing bodies only. Teaches steps, spikes and switches. Ends with earning the 2nd soul.
2. **Overgrown ruins / Spire**: gain the slide (lying bodies). Walkers and lasers. Boss 1 (can't destroy bodies). Ends with the 3rd soul.
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
| 3. Sanctum | Acceptance: the amulet awakens and he chooses his death | Uses it deliberately against the final boss |
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
- **Color rule (decided):** blue/white = your soul (flames, floating bodies, the hero's death). Gold = the amulet and its runes. Keep both colors for those uses only, so they stay meaningful.
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
- **Hero:** dark cloaked figure with a soft edge of light, animated in code (bob, lean, cloak sway). No AI animation frames.
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
| More AI enemy types | On hold | Moving hazards cover the same ground for less work |
