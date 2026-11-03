# Level Plan

Rooms connect Celeste-style (walk through a gap, the camera slides over). Each room is a puzzle you can see whole. Decisions behind this live in [IDEAS.md](IDEAS.md).

This is the design source for building levels: design happens here, and building (code and assets) happens in separate chats that work from this file. Mark a room **Built** once it's in the game.

## How difficulty climbs
- **Each world adds one rule and one way to bend it.** Every room hides a trick: something the player has to realize about their own death to get through.
- **Teach, twist, combine.** A new idea first appears alone and safe, then with a twist, then mixed with earlier ideas. The boss tests everything in that world.
- **Fair, not cruel.** The whole puzzle is on screen, nothing kills you without warning, R resets the room, and a wrong death costs seconds, not minutes.
- **The trick should feel like cheating.** The best rooms make players feel they broke the game (used a soul in a way it "wasn't meant" to be used).

## Direction after the first playtest (2026-11-02)
The first greybox rooms were too thin: one mechanic per screen, "find the one spot to die, walk out". Rooms now follow Celeste:
- **Moving around is a skill too:** wall jump (chimneys 2–3 wide), stomping enemies, crumbling floors and falling spikes that punish hesitation.
- **Each room has 2–3 stages** with a shrine between, and each stage layers 2–3 elements that react to each other.
- **Deaths can backfire:** a saw jams wherever you die, a bad death erases a soul you still need, a falling spike kills you somewhere you didn't plan.

Three **showcase rooms**, one per world, are in the greybox to judge this style before the rest are redone (`?dev&room=Thornwood`, `?dev&room=Sawmill`, `?dev&room=Reliquary`):
- **Thornwood (W1):** walker to stomp, a 2-wide chimney whose right wall turns to thorns for 3 rows (die on the middle one and your soul is the kick point past them), a crumbling bridge under falling spikes, then a saw in a 2-tall corridor you can't jump: let it kill you so your soul jams it (a jammed saw sticks inside the soul, so you walk over it).
- **Sawmill (W2):** the spring reaches 8.5, the ledge is 9, and a saw sweeps the row 5–6 tiles up. Hold K during a launch so the soul hangs beside the spring: in the saw's row it jams the saw and is your step; a row higher it's a step too, but you spring past a moving saw. Then a plate soul that also shields you from a thrower, a crumbling floor under fire, and a ceiling laser you must block high so you can walk under.
- **Reliquary (W3):** a 3-wide chimney with flyers crossing it (small ledges let you stop and time them), two saws in their own lanes of a 2-tall corridor (jam both, then self-destruct on the plate at the end: all 3 souls), recall to undo a bad death, and a crumbling descent under falling spikes.

## Powers by world
| World | Souls | New power | The world's trick |
|---|---|---|---|
| 1. Forest Edge | 1 | **Slide** (a speed boost, and it leaves a flat soul 2 wide). Every death comes from the forest | **Where you get hit is where your soul hangs.** You aim your deaths with jumps and positioning |
| 2. Overgrown Ruins | 2 | **Self-destruct** (hold the button) | **Timing.** You keep moving while you hold, so you press early to die where you'll be, and let go to cancel. A 3rd death erases the 1st, so order matters too |
| 3. Sanctum | 3 | **Recall** (take souls back without dying, newest first) | **Three at once, in the right order.** Puzzles need all 3 souls doing different jobs at the same time. Recall clears mistakes without dying, and dropping through a soul only works if it's your newest |

**Self-destruct (World 2 on):** hold the button for about 0.75s while the blue-white flames grow. You keep running, jumping and falling while you hold. Let go early to cancel. A hazard that hits you mid-hold kills you on the spot, so the soul lands there instead.
**Recall (World 3):** a tap removes your newest soul. Holding keeps removing them, newest first, faster the longer you hold. Recalling the soul you stand on drops you. It isn't a death, so it doesn't hurt and doesn't heal a boss.
**Bosses:** any death heals the boss to full, so a fight is a setup (die freely to place souls) followed by a run where you must not die. Self-destruct's burst is only visual: it never hurts enemies or bosses.
**The amulet** gains one rune per boss, and each rune brings the next world's powers.

## World 1: Forest Edge (1 soul, about 7 minutes)
- **1 soul.** A new death moves your only soul.
- **No choosing to die.** Every death comes from the forest: spikes, thorns, the walker.
- **The slide** works from the start (run + S/↓): a short burst of speed, and a death mid-slide leaves a lying soul, 2 tiles wide and half a tile tall. It's first needed in room 7.
- **Shrines** (mid-room checkpoints) let a 1-soul puzzle chain: place the soul, cross, touch the shrine, place it again.

| # | Room | Teaches | The trick | Story beat | Status |
|---|---|---|---|---|---|
| 1 | The clearing | Moving and jumping | None (story room) | Finds the amulet, puts it on | Built |
| 2 | The ghost | | None (story room) | The opening conversation (below) | Built |
| 3 | First death | A death leaves a soul | A pit too wide to jump: die in it, and your soul is a stepping stone over the spikes | "AGH! THAT HURT!" | Built |
| 4 | The thorn wall | Aiming a death | Where you touch the thorns is where your soul hangs. Jump into them at the top of your jump to make the highest step | The guide teaches timing | Built |
| 5 | The patrol | Switches, walkers | You choose where the walker catches you: get killed standing on the switch so your soul holds the door | "I want you to get killed *efficiently*." | Built |
| 6 | The chain | Shrines | Bridge the pit, reach the shrine, die again for a step up | "How many times have you done this?" | Built |
| 7 | The long pit | Slide | Slide into a low spike tunnel: the flat soul bridges it, a standing soul plugs it. Hop to the shrine; stomp the tunnel guard from the ledge before sliding to place the second bridge. That death revives the guard: stomp it again to use the bridge, then hop the exit post. Touching the guard moves your bridge into the approach | Guide: "Lie down. No, really." | Built |
| 8 | The well | Aiming a fall | Two deep spike shafts. Land your soul near the exit side, respawn, drop onto it, jump out. The second shaft has thorns on the exit-side wall, so you fall close to them without touching | | Greybox |
| 9 | The gatehouse | Which side the walker ends up on | Get killed on the plate while the walker comes from the door side: it ends up penned between your soul and the door, and you jump it. Get killed the other way round and it's penned with your respawn point. Then a shrine and a spike pit | | Greybox |
| 10 | The moth | Boss 1 | One soul, two jobs. You place it by dying on the arena's thorns, and it must shield you from the wing dust *and* be the step you stomp from. Dying again heals the moth and moves the soul, so you get one placement for all 3 stomps. The dust can't break souls | "Careful. It remembers too." | Greybox built (room only) |

After the moth: the amulet's 2nd rune lights up and you earn a **2nd soul** and **self-destruct**, leading into World 2.

## Opening conversation (room 2)

The dialogue lives in [dialogue.js](../dialogue.js). The guide is playful, mischievous and witty; the one serious line is marked.

> **Guide** *(mischievous)*: Well, well. Which death are you currently on?
> **Hero** *(startled)*: Death? I'm on?
> **Guide** *(amused)*: Oh, a first-timer! This is my favorite part.
> **Guide** *(smug)*: Introductions, then. I'm you. Give or take a few thousand deaths.
> **Hero** *(annoyed)*: You're me? I'm way better looking.
> **Guide** *(teasing)*: Same face. Same hair. Same bad decisions.
> **Guide** *(wry)*: Every death sends you back. Your body forgets. You don't.
> **Hero** *(excited)*: So this amulet makes me immortal? What's it worth?
> **Guide** *(amused)*: Nope! Not telling.
> **Guide** *(warning, the armor slips)*: …It won't let you stay dead. One day you'll wish it would.
> **Guide** *(mischievous)*: Anyway! Treasure's that way. Try not to die. …Actually, do. It's the only way through.

First death: **Hero** *(shouting)*: AGH! THAT HURT! · **Guide** *(wry)*: It's not like you actually died, right? · **Hero** *(annoyed)*: I literally just died.

## World 2: Overgrown Ruins (2 souls + self-destruct, about 6 minutes)
New: **2 souls**, **self-destruct** (hold K), **lasers** (a soul blocks the beam), **springs**.

| # | Room | Teaches | The trick | Status |
|---|---|---|---|---|
| 1 | Let go | Self-destruct | Stack two souls for a safe 5-high ledge, then shrine. Stomp the guard and stack on a plate: the bottom soul opens the exit. Each death revives the guard; a careless third death erases the plate soul | Built |
| 2 | Off the edge | Hold while jumping | Jump off holding K: hang a step over the pit, cross to the shrine. Then leave a soul on the plate and hang another over the next pit; a careless third death closes the exit | Built |
| 3 | The ladder | Staircase | A ledge 7 high. A straight stack only lets you stand on its top, so it tops out at 3. Then run off your top soul holding K: the new soul appears beside it, one step up | Greybox |
| 4 | The beam | Lasers | A ledge 8 high and a laser at 4.5. Jump into the laser right next to its source: that soul is the high step, and it blocks the whole beam | Greybox |
| 5 | The spring | Springs | The spring reaches 8.5, the ledge is 9. Hold K during the launch so a soul hangs beside the spring, spring again onto it, jump up | Greybox |
| 6 | Wrong order | Death order | A step to reach the plate, a soul on the plate, a soul in the pit. Pit first, and your 3rd death erases it | Greybox |
| 7 | The tree guardian | Boss 2 | It glows blue, then slams the soul nearest you. Lure the slam onto the soul you don't need and stomp from the one you kept. Dying to rebuild heals it | Designed (below) |

Cut for now: *The race* (walkers are slow enough to outrun, so it had no tension) and *The moving ledge* (its timing window was too small to be fair).

After the tree: the 3rd rune lights up, giving a **3rd soul** and **recall**.

## World 3: Sanctum (3 souls + recall, about 6 minutes)
New: **3 souls** and **recall** (Q: tap for the newest soul, hold for more). Mostly a convenience: rooms can be longer and harder without a mistake costing several deaths.

| # | Room | Teaches | The trick | Status |
|---|---|---|---|---|
| 1 | Three high | 3 souls | A ledge 8 high: the World 2 staircase, one step taller | Greybox |
| 2 | In my own way | Recall | A 5-wide pit in a 1-tall tunnel: two lying souls bridge it. A standing soul plugs the tunnel; recall it instead of resetting | Greybox |
| 3 | Three jobs | 3 souls at once | A soul on the plate, one in the spike pit, one blocking a laser from the ceiling (die in it mid-jump, so you can walk under). A 4th death erases the plate soul, so recall mistakes instead | Greybox |
| 4 | Everything | All powers | Slide tunnel, shrine, plate with a walker, door, spring to a 9-high ledge. One spare death before the plate soul goes | Greybox |
| 5 | The rehearsal | Leading a beam | A sweeping soul-breaking beam aims at you; lead it away from your soul wall | Designed (below) |
| 6 | The spectral stag | Final boss | Calm setup: build a 3-thick wall. Then charge → beam (glows blue first; lead it away) → wave every ~15s (hide behind the wall). 3 stomps. A broken soul means dying to rebuild, which heals it | Designed (below) |

Cut: *Spring tower* (a spring-placed soul has to land within a few frames, too tight).

## Boss and rehearsal designs (2026-11-02, written for the overnight build; tune the numbers in playtests)
All three follow the moth's rules: 3 stomps from above, it speeds up after each one (attack gaps × 0.8), any death heals it to full, yellow attacks never break souls, and an attack that breaks souls is warned by a blue glow.

### The tree guardian (W2 boss, 2 souls + self-destruct)
- **Arena:** one screen (30 × 17), flat floor. The tree is rooted at the right (about 7 tiles wide) and never moves. Its stone mask is the stomp target: top **4 tiles up**, sticking out over the floor at its left edge. Out of reach from the floor, in reach from one standing soul 1–2 tiles in front of it, so every stomp needs a soul.
- **Branch swing (yellow):** a 0.6s wind-up, then a branch sweeps the floor band (the bottom tile) from the trunk out to about 12 tiles. Jump it, or be standing on a soul. It passes through souls.
- **Seed pod (yellow):** lobbed at where you are, bursts on landing in a small area. A soul between you and the pod blocks it, as with the moth's dust.
- **The slam (blue, smashes souls):** every third attack. The mask glows blue for 1.2s and **looks at the soul nearest you; the target locks when the glow starts**. The arm slams that soul into the ground: it sinks flat (useless as a step) and **pushes back up 5s later**. The slam also sends a shockwave along the floor that kills you if you're on the ground. With no souls out, it slams where you stand.
- **The trick:** you need 2 souls: the step in front of the mask and a decoy farther out (self-destruct lets you put the decoy anywhere, mid-air too). When the glow starts, be near the decoy. Then get onto the step before the slam lands: the slam buries the decoy, the shockwave passes under you, and you stomp. Stand on the step when the glow starts and the slam buries your step and the shockwave kills you, which heals the tree. As it speeds up (gaps 8s → 7s → 6s), the decoy is barely back up in time, so the last cycle is tight.
- **Numbers to tune:** the 1.2s glow must fit a run from the decoy (about 8 tiles away) onto the step, measured with real physics in the replay; aim for about 0.5s of spare time on the first hit.
- **Story:** STORY.md W2 scenes 4 (arrives partway in), 5 (the slam nudges after the 2nd and about the 25th death) and 6 (the tree falls, 3rd rune: 3 souls + recall).

### The rehearsal (W3 room 5, 3 souls + recall)
- Teaches the stag's beam without the stag. An emitter (an antler relic in the right wall) glows blue, shows an **aiming line that follows you**, locks 0.4s before it fires, then fires a beam along that line that breaks the first soul it hits and kills you if it reaches you. Then a 3s gap.
- The room: a ledge 7 high on the left needs a 2-soul staircase. The beam fires every ~4s, so you build the stair between shots and must stand away from it (out in the open, or next to a third "spare" soul) when the line locks, so it never crosses the stair. Recall cleans up a soul the beam made useless. Then a short second stage: a corridor where the line can only be led onto a decoy soul you place on purpose.

### The spectral stag (W3 boss, 3 souls + recall, final)
- **Arena:** wider than one screen (about 40 × 17, the camera follows). A raised platform at the left, 3 tiles up and 5 wide; the stag's charge lane is the floor under and to the right of it.
- **Calm setup:** the stag watches until you step off the platform's edge or 8s pass after its intro. Build a **wall 3 souls thick** on the platform's right edge.
- **The loop:** charge → beam → charge → beam, with a wave every ~15s.
  - **Charge (yellow):** it gallops along the floor and rams the arena's left wall under the platform, then stands **dazed for 2s under the platform's edge. Drop onto its back from the platform: that's the stomp.** It breaks any soul in its lane, so the floor is no place for souls.
  - **Beam (blue):** the same aimed beam as the rehearsal. Lead the line away from your wall before it locks (step out to the platform's left end), then get back behind the wall.
  - **Wave (blue, can't dodge):** a wall of light rolls across the arena at platform height. It breaks 2 souls and stops at the 3rd, so only the 3-thick wall saves you. Stand behind it.
- **A broken soul** means a 2-thick wall: you either die to rebuild (it heals) or recall and rebuild later. Recall isn't a death, so it never heals the stag.
- **Story:** STORY.md W3 scenes 5 (arrives), 6 (nudge after about 10 deaths), 7 (the guide's last stand), 8 (the note behind the old tree), 9 (floor one, ending card).

## Measured movement (design to these)
Measured in the game; the greybox tests (`tests/check.html`) replay each tight room's solution with real physics.
- Jump: **3.4 tiles** up. A ledge 3 up is reachable, 4 is not.
- Running jump: **5.4 tiles** across; slide-jump **6.1**. The slide adds only about a tile, too little for "slide or fail" gaps; raise `SLIDE_SPEED` if we want those.
- Spring: **8.5 tiles** up. (Until a fix after the playtest, a speed cap meant for falling held springs to 7.4.)
- Souls snap to the grid: a spike death leaves a standing soul as a 1-tile step, or a lying soul flush with the floor.
- **Only the top of a stack can be stood on**, so stacking in place tops out at 3 + a jump = 6.4 tiles. Going higher takes a staircase (souls side by side), built by running off your top soul while holding K.
- Lasers stop at the first soul, wall or door in their path, so a soul blocks only the part of the beam beyond it.

## Playing the greybox
The rooms are on the `greybox-levels` branch, in its own folder (`../Game-Week-greybox`). Serve that folder (`python3 -m http.server 8001`) and open `http://localhost:8001/?dev&room=The%20long%20pit` (any room name works; `?dev` turns on the dev keys and the room shortcut). Keys: hold K to self-destruct (World 2 on), Q to recall your newest soul (World 3), Shift+R to retry the room (the way out if you trap yourself), N for the next room and H for the help panel (both dev only). The flames in the bottom left show how many souls you have left.

## Open design questions
- **Slide speed:** raise it so the slide's speed boost can carry puzzles, or keep it as the flat-soul tool only?
