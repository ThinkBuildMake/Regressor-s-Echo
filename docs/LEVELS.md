# Level Plan

Rooms connect Celeste-style (walk through a gap, the camera slides over). In every room taller than the screen, the camera leads downward to show hazards before a drop reaches them. Decisions behind this live in [IDEAS.md](IDEAS.md).

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
- **Thornwood (W1):** walker to stomp, a 3-wide wall-jump chimney (thorns removed and the wall kick raised to ~2.8 tiles on 2026-11-04: playtesters struggled), a crumbling bridge under falling spikes, then a saw in a 2-tall corridor you can't jump: let it kill you so your soul jams it (a jammed saw sticks inside the soul, so you walk over it). Posts at both ends of the corridor keep the saw out of the exit shaft, so you can't follow it there and climb out, and a saw death mid-hop still drops your soul into the saw's lane (2026-11-04).
- **Sawmill (W2):** the spring reaches 8.5, the ledge is 9, and a saw sweeps the row 5–6 tiles up. Hold K during a launch so the soul hangs beside the spring: in the saw's row it jams the saw and is your step; a row higher it's a step too, but you spring past a moving saw. Then a crumbling floor under fire to the plate in front of a thrower: die there and the soul holds the door and blocks every later shot, so the second crossing is calm. Then a ceiling laser you must block high so you can walk under.
- **Reliquary (W3):** a 3-wide chimney with flyers crossing it (small ledges let you stop and time them), two saws in their own lanes of a 2-tall corridor (jam both, then self-destruct on the plate at the end: all 3 souls), recall to undo a bad death, and a crumbling descent under falling spikes.

## Powers by world
| World | Souls | New power | The world's trick |
|---|---|---|---|
| 1. Forest Edge | 1 | **Slide** (a speed boost, and it leaves a flat soul 2 wide). Every death comes from the forest | **Where you get hit is where your soul hangs.** You aim your deaths with jumps and positioning |
| 2. Overgrown Ruins | 2 | **Self-destruct** (hold the button), then **recall** a few rooms in (taught by Take it back) | **Timing.** You keep moving while you hold, so you press early to die where you'll be, and let go to cancel. A 3rd death erases the 1st, so order matters too. Recall takes your newest soul back without dying |
| 3. Sanctum | 3 | **Soul swap** (a key swaps places with your newest soul: you appear where it was, it appears where you stood) | **Three at once, in the right order.** Puzzles need all 3 souls doing different jobs at the same time. Swap turns every soul into an escape hatch |

**Self-destruct (World 2 on):** hold the button for about 0.75s while the blue-white flames grow. You keep running, jumping and falling while you hold. Let go early to cancel. A hazard that hits you mid-hold kills you on the spot, so the soul lands there instead.
**Recall (World 2 on, decided 2026-11-03; was World 3):** a tap removes your newest soul. Holding keeps removing them, newest first, faster the longer you hold. Recalling the soul you stand on drops you. It isn't a death, so it doesn't hurt and doesn't heal a boss.
**Soul swap (World 3, decided 2026-11-03):** a tap swaps you with your newest soul. Not a death, so it never heals a boss.
**Boss damage (decided 2026-11-03):** each boss has one soul trick that opens it up, used for all three hits, and the stomp lands the hit: the moth's Lantern Dive crashes into a soul, the tree's slam buries a stone support to drop the stone onto its mask (recall also works), and the stag rams a soul you swap away from. No attack forces a death to recover from it. Details: docs/brainstorm/2026-11-03-bosses.md.
**Bosses:** any death heals the boss to full, so a fight is a setup (die freely to place souls) followed by a run where you must not die. Self-destruct's burst is only visual: it never hurts enemies or bosses.
**The amulet** gains one rune per boss, and each rune brings the next world's powers.

## World 1: Forest Edge (1 soul, about 7 minutes)
- **1 soul.** A new death moves your only soul.
- **No choosing to die.** Every death comes from the forest: spikes, thorns, the walker.
- **The slide** works from the start (run + S/↓): a short burst of speed, and a death mid-slide leaves a lying soul, 2 tiles wide and half a tile tall. It's first needed in room 7.
- **Shrines** (mid-room checkpoints) let a 1-soul puzzle chain: place the soul, cross, touch the shrine, place it again.

| # | Room | Teaches | The trick | Story beat | Status |
|---|---|---|---|---|---|
| 1 | The clearing | Moving and jumping | None (story room) | Finds the amulet, puts it on; The ghost conversation (below) | Built |
| 2 | First death | A death leaves a soul | A pit too wide to jump: die in it, and your soul is a stepping stone over the spikes | "AGH! THAT HURT!" | Built |
| 3 | The thorn wall | Aiming a death | Where you touch the thorns is where your soul hangs. The thorns cover only the bottom three rows, under a solid lip: a rising touch leaves a three-high step, a walk-in or early jump a step too low. The lip backs the step, so overshooting it can't kill you (2026-11-04) | The guide teaches timing | Built |
| 4 | The patrol | Switches, walkers | You choose where the walker catches you: get killed standing on the switch so your soul holds the door | "I want you to get killed *efficiently*." | Built |
| 5 | The chain | Shrines | Bridge the pit, reach the shrine, die again for a step up (same three-row thorns under a solid lip as The thorn wall) | "How many times have you done this?" | Built |
| 6 | The long pit | Slide | Slide into a low spike tunnel: the flat soul bridges it, a standing soul plugs it. Hop to the shrine; stomp the tunnel guard from the ledge before sliding to place the second bridge. That death revives the guard: stomp it again to use the bridge, then hop the exit post. Touching the guard moves your bridge into the approach | Guide: "Lie down. No, really." | Built |
| 7 | The well | Aiming a fall | Aim a fall beside the first exit, then drop onto your soul and jump to the shrine. In the second well, fall straight beside the exit, clear of the upper thorns; jump from the soul to the guard’s shelf and stomp it. A thorn or guard death steals your landing. A **bramble spider** hangs over the second well (column 19): it drops after you as you fall past (too late to catch a fall), rests on the soul in its column, and kills you if you wait on that soul; dying to it hangs your landing a tile higher in its column | | Built |
| 8 | The gatehouse | Which side the walker ends up on | Let the walker kill you on the plate from the door side, then hop your soul and its pen. After the shrine, a low post keeps the patrol away from your respawn; the plate soul is also the step to a four-high ledge. Careless guard contact steals the step | | Built |
| 9 | The moth | Boss 1 | Any stomp hurts it; the easy opening is to bait a locked Lantern Dive into the soul placed by any death in the arena, step aside, then stomp during its 2s stun. Dust Loom (one slow aimed pollen cloud) → Dive → Pollen Curtain (falling clouds) → reposition; after hit 1, Ground Skimmer tests standing on the soul. After hit 2, Loom sends a second cloud. Only recovery gaps shrink (×0.8 per hit); death heals all 3 hits. The arena stays sealed until victory | "Careful. It remembers too." | Built |

After the moth: the amulet's 2nd rune lights up and you earn a **2nd soul**, **self-destruct** and **recall**, leading into World 2.

## Opening conversation (inside The clearing)

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
| 2 | Off the edge | Hold while jumping | Jump off holding K: hang a step over the pit, cross to the shrine. Then leave a soul on the plate and hang another over the seven-wide next pit (a slide jump clears six); a careless third death closes the exit | Built |
| 3 | Take it back | Recall | Recall a standing tunnel plug, then slide a flat bridge. Shrine; preserve a plate soul by recalling a bad bridge before replacing it | Built |
| 4 | The ladder | Staircase | Offset your two souls to climb a 7-high ledge; a straight stack falls short. Shrine, descend beneath the hanging wall, then hang the staircase over spikes: the lower step is also your bridge. A third death erases it | Built |
| 5 | The beam | Lasers | Die standing on the low block beside the laser source for a step, then jump from it into the beam: that high step also blocks the beam (stage 2's plate block works the same way). Shrine, drop through the sheltered shaft, then the lower step must hold a plate while the laser soul finishes the stair. A third death erases the plate soul and shuts the exit. An **idol slider** guards stage 1's floor: it steps toward you whenever you jump or hold K and ends up against the low block or a soul; hop onto it (a short hop: a full jump from its top reaches the beam), never into its side | Built |
| 6 | The spring | Springs | Hang a soul beside the spring to reach a 9-high ledge, then shrine. Descend through the sheltered shaft; the hanging wall prevents bridging from the shrine. Hold → onto the second spring (column 19) and the beam kills you just right of it: that soul is the landing. Let go as the spring throws you (the drift stops, so you don't bump it from below), steer onto it near the top, then jump from its far edge. It also blocks a laser: die too low and the beam stays live; extra deaths can erase the shield | Built |
| 7 | Wrong order | Death order | Step, plate, pit: replace the step, not the bridge. Shrine, then spring into the beam: the soul beside the spring is both the temporary landing to the high plate and the shield for the next launch (recall only fixes a bad one). Bank the plate soul from the plate (the bridge is spent now), relaunch letting go, land on the shield and jump to the foothold at 27, then drop past the emitter to the doorway. Only the high plate opens the exit; one death too many shuts it | Built |
| 8 | The tree guardian | Boss 2 | The tree walks toward you. Make its blue slam land on a soul: its hands stick and the bowed mask is stompable from the floor. Stand on a soul when the floor spikes (a jump doesn't last long enough). The tree never removes souls. Three stomps | Built (2026-11-04 redesign) |

Cut for now: *The race* (walkers are slow enough to outrun, so it had no tension) and *The moving ledge* (its timing window was too small to be fair).

After the tree: the 3rd rune lights up, giving a **3rd soul** and **soul swap**.

## World 3: Sanctum (3 souls + swap, about 6 minutes)
New: **3 souls** and **soul swap** (E exchanges you with the newest soul). Recall remains available from World 2.

| # | Room | Teaches | The trick | Status |
|---|---|---|---|---|
| 1 | Three high | 3 souls | Twelve-high three-soul staircase (two souls plus a kick off the tower face fall short); shrine, then hang a shield under a low laser lintel before building two exit steps. A fourth death erases the shield | Built |
| 2 | Two places | Soul swap (E) | Fall into the one-wide shaft: its spike leaves a soul that plugs it, and the wall above the low tunnel stops you walking off the plug. Slide on the floor above and swap mid-slide: you keep the slide's speed and clear the spike into the tunnel (a walking-speed swap drops onto it). Leave an escape soul beyond the full-height approach gate, then swap from the visible spike plate: its soul opens the exit but closes the approach behind you | Built |
| 3 | Three jobs | 3 souls at once | Plate, pit bridge, high laser blocker; shrine, then crumbling lips force you to jump into the beam before the landing falls. A fourth death erases the plate: recall the mistake | Built |
| 4 | Everything | All powers | Slide a flat bridge to the shrine. Then keep a plate soul, a saw jam and a spring step at once (a post keeps the saw in its lane when the door opens, so it must be jammed; hop the post where the ceiling rises): recall a bad step, because a fourth death shuts the door. A **reliquary scarab** paces the spring floor: stomp it before launching, or fence it with a soul (it turns at souls, walks along their tops and falls when you recall the one under it) | Built |
| 5 | Reliquary | Recall, three souls | Climb the flyer chimney, jam two saws and hold the plate (two tiles from its door, so you can't stand on it and in the doorway at once). Shrine, then crumbling descent under falling spikes; thorns close both sides of the descent shaft | Built |
| 6 | The rehearsal | Leading a beam | First lock after 2.6s: lead the beam below a two-soul stair; shrine, then sacrifice a decoy in a low corridor firing every 1.6s, too fast to run its full length | Built |
| 7 | The old tree | Story | Calm promise before the fight; return for the note after victory | Built |
| 8 | The spectral stag | Final boss | Charge a soul flat, swap onto the platform and stomp during the 2s daze. Antlers → three floor pulses → Three seals: all three sockets must hold souls at the end of a 3s countdown. Souls survive every attack; death heals it | Built (40×17 arena; separate old-tree and pyramid rooms) |
| 9 | The pyramid entrance | Ending | Read the old tree’s note, then enter the pyramid. Restarting preserves the open return route | Built |

Cut: *Spring tower* (a spring-placed soul has to land within a few frames, too tight).

## Boss and rehearsal designs (2026-11-02, written for the overnight build; tune the numbers in playtests)
All three follow the moth's rules: 3 stomps from above, it speeds up after each one (attack gaps × 0.8), any death heals it to full, yellow attacks never break souls, and an attack that breaks souls is warned by a blue glow.

### The moth (W1 boss, 1 soul + slide; 2026-11-03)
- **Arena:** unchanged 30 × 17; thorn at column 14, floor row 16. Flight and dive centres stay between columns 8 and 22, beyond wall-jump reach. Any death in the arena makes a usable soul; a thorn death is the simplest setup. No self-destruct.
- **Loop:** Dust Loom (0.6s wing-shake tell, one big aimed pollen cloud drifting at 150 px/s, hit box 56 px; changed 2026-11-04 from 3 small pods, user: one big cloud instead of many shots) → Lantern Dive (0.8s yellow lane tell, locks the player's column clamped to the flight range; 320 px/s downward for at most 0.5s) → Pollen Curtain (1s ceiling tell, three 6-tile strips starting at columns 3, 11, 19, spaced 0.45s; each strip is two 3-tile pollen clouds falling at 280 px/s) → reposition (2s). Two-tile curtain gaps allow escape without a hanging soul.
- **Damage:** the dive stops on a soul, opens a fixed 2s stun, and allows one stomp. Any other stomp also lands a hit (decided 2026-11-04: the first boss was too hard), so the stun is the easy opening, not the only one. Side contacts are harmless during the stun. Bait beside the thorn soul, retreat from the marked lane, then jump onto the stopped moth. Pollen clouds stop on souls (as soon as their edge touches one) and never consume them.
- **Phases:** after hit 1, a 0.8s visible descent adds Ground Skimmer after Curtain: a 24px-high sweep at 360 px/s from column 22 to 8, cleared by standing on the soul. Torn wings show damage. After hit 2, Loom sends a second cloud 0.7s after the first. The 1.2s inter-attack gaps and 2s reposition pause multiply by 0.8 per hit; tells, attack speeds and stun never shorten. Death resets the loop and HP, clears dust and gives a 1.5s approach pause. Intro, defeat and second-rune reward stay intact.

### The tree guardian (W2 boss, 2 souls + self-destruct + recall)
- **Redesigned 2026-11-04 (user): the tree moves**, and its art is being remade from the approved `raw/bosses/tree.jpg` (ASSETS.md "Tree guardian redo"). Built in `updateTree`; tunables are the `TREE_*` constants in game.js.
- **Arena:** unchanged 30 × 17, floor row 16; the tree starts at column 23.5 and keeps 3 tiles off each wall. Its mask sits 4 tiles up (out of jump reach from the floor, in reach from a soul); its sides are harmless.
- **Between attacks** it lumbers toward the hero at 40 px/s, stopping 3 tiles short, and turns to face him. Gaps 1.6s → 1.28s → 1.024s per hit; initial grace 4s.
- **Loop:** Swing → Throw → Slam → Spikes, then repeat. Tells: 0.8s, 0.7s, 2.05s, 1.5s.
- **Swing (lemon):** a box 4 tiles in front of it, 2.5 tiles high. Back off or jump it.
- **Throw (lemon):** three seed pods lobbed from its throwing hand at markers on the hero and ±64px. Souls block them; a floor burst reaches 38px each side and 28px up.
- **Slam (blue):** locks where the hero stands when the tell starts and lunges toward it. The fists kill within 40px of the aim point; the cracking-earth ripples that run out from the fist along the floor are only a visual (harmless). **A soul where the fists land catches them:** the hero is spared, the soul is unharmed (the tree never removes souls), and the hands stick for 2.5s while the mask bows forward to 2.5 tiles up, in jump reach from the floor. Stomp it then; that is the only way to hurt it. The catching soul is outlined during the tell.
- **Spikes (red):** both arms drive into the ground; the floor cracks for 1.5s, then roots burst up across the whole floor for 1.2s, longer than a jump (~0.8s in the air). Only standing on a soul is safe.
- **Three hits:** stand by a soul so the slam lands on it, stomp the stuck mask, get up on a soul before the spikes; repeat. One mechanic: souls are where the tree's attacks land and what you stand on.
- **Story:** tree fall grants three souls and soul swap via persistent `stats.treePower`; recall belongs to the moth's rune.

### The rehearsal (W3 room 6, 3 souls + recall)
- Teaches the stag's beam without the stag. An emitter (an antler relic in the right wall) glows blue, shows an **aiming line that follows you**, locks 0.4s before it fires, then fires a beam along that line that breaks the first soul it hits and kills you if it reaches you. Then a 3s gap in the stair chamber; the corridor cycles every 1.6s. Both give 2s extra before the first shot.
- The room: a ledge 7 high on the left needs a 2-soul staircase. The beam fires every ~4s, so you build the stair between shots and must stand away from it (out in the open, or next to a third "spare" soul) when the line locks, so it never crosses the stair. Recall cleans up a soul the beam made useless. Then a short second stage: a corridor where the line can only be led onto a decoy soul you place on purpose.

### The spectral stag (W3 boss, 3 souls + swap, final)
- **Arena:** unchanged 40 × 17; platform columns 3–6 at row 12; the two-wide entrance shaft stays calm until you climb out. During the fight the camera zooms out to frame the whole arena (backdrop, HUD and dialogue keep full size); after the win it follows the hero again, and rammed (flat) souls stay walk-through.
- **Setup:** reach the platform or the floor to its right, then 8s or leave the platform. E exchanges hero and newest soul, keeps horizontal momentum and stops vertical motion, and never heals; available in World 3 or after the tree.
- **Loop:** Buttress Charge → Searching Antlers → Procession → Three seals → recovery. Gaps 3s × 0.8 per hit; tells stay fixed.
- **Charge:** yellow lane tracks for 0.5s, locks until 0.9s; 650 px/s. Only ramming a soul dazes it (2s); the soul is flattened, survives, and can be swapped again. Plain stomps bounce without damage. The stronger stomp bounce reaches the platform for restoring the seal.
- **Antlers:** the origin is high above the floor, giving the platform a steep, jumpable shot; blue aim 1.4s, lock 0.4s, fire 0.18s. A hit soul phases out for 2s, then returns, allowing recovery without a death.
- **Procession:** three yellow floor pulses, each 0.6s warning and 0.6s active, two tiles wide; climb above floor row 14.7.
- **Three seals:** sockets at (1.5,11.5), (37.5,11.5), (5.5,11.5). Three violet rings shrink for 3s; all sockets must contain souls within 25px on both axes. The blast preserves every soul. All sockets sit above the charge lane. Swap from the locked lane to the platform soul, stomp the rammed stag, then return to the platform socket and swap its soul back before the bell.
- **Route:** The rehearsal → The old tree (30 × 17, promise beside the tree at column 21) → arena → The pyramid entrance (30 × 17). Both arena gates and the vine buttress under the platform open after the last stand, clearing the way back. Return behind the tree to the dirt note at columns 18–20, then walk through the arena to the pyramid door at column 22; entering fades to the ending card.
- **Story:** STORY.md W3 scenes 5 (arrives), 6 (nudge after about 10 deaths), 7 (the guide's last stand), 8 (the note behind the old tree), 9 (floor one, ending card).

## Enemies per world (planned 2026-11-03, built 2026-11-04)
Each world gets its own creature built around that world's trick, not a reskin. Brainstormed with Codex and agy; the level chat places them in rooms. All are red (readability rule), stompable from above unless noted, and drawn as 2–4 frame sheets. The walker stays in World 1, the thrower in World 2 and the flyer in World 3 as each world's second enemy.

| World | Enemy | Looks | Behaviour (codeable) | Soul puzzle it creates | Fits |
|---|---|---|---|---|---|
| 1 | **Bramble spider** | A red spider hanging on a dark silk thread from ceiling roots | When you pass under its column, it shakes (~0.5s warning), drops straight down, pauses 1s, then climbs back. A soul in its column stops the drop on top of the soul | Vertical death aiming without self-destruct: jump into its drop to choose the height your soul hangs at (e.g. a wall-jump kick point in a chimney); that soul then also stops its later drops | *The well* (W1-8), the Thornwood chimney |
| 2 | **Idol slider** | A block of red carved stone on short crab legs | Moves toward you only while you're airborne or holding self-destruct (K); stands still otherwise. Turns around at walls and souls. Solid on top: presses plates, blocks lasers | World 2's trick is timing, and every self-destruct hold also moves it. Fence it with your 2 souls onto a plate or into a beam so it takes over a soul's job | *The beam* (W2-4), *Wrong order* (W2-6) |
| 3 | **Reliquary scarab** | A flat red scarab with a hard shell | Patrols floors and the tops of souls (walks along soul bridges), turns at walls and soul ends. Presses plates, its shell blocks lasers. Falls when the soul under it is recalled | Recall becomes a weapon: walk it out over a gap on your souls, then recall the soul under it so it drops onto a plate you can't reach, or into a beam | *Three jobs* (W3-3), *Everything* (W3-4) |

Built 2026-11-04 (tiles `w`, `i`, `b`): the spider in *The well*, the idol in *The beam* stage 1 and the scarab in *Everything*'s spring floor. The Thornwood chimney and *Wrong order* were considered and *Three jobs* was tried, and all were left out: the enemy either sat on the landing tile of a tight existing jump or, in *Three jobs*, paced the 2-tile plate ledge and held the door almost all the time for free (a skip). In the three rooms that have them, each enemy is an extra hazard that uses its trick; none yet takes over a soul's job as the table imagines, which needs a room built around it.

Runner-up for World 2: **rubble toad** (a red stone-backed toad hopping between two marked landings on a timer; each landing starts a crumbling tile's countdown; a soul above a landing catches it so the floor survives).

## Measured movement (design to these)
Measured in the game; the greybox tests (`tests/check.html`) replay each tight room's solution with real physics.
- Jump: **3.4 tiles** up. A ledge 3 up is reachable, 4 is not.
- A slide can't jump with less than about a tile of headroom (2026-11-04): in a one-tile tunnel the jump would bonk the ceiling and float the slide over a 3-wide spike gap (The long pit).
- Running jump: **5.4 tiles** across; slide-jump **6.1**. The slide adds only about a tile, too little for "slide or fail" gaps; raise `SLIDE_SPEED` if we want those.
- Spring: **8.5 tiles** up. (Until a fix after the playtest, a speed cap meant for falling held springs to 7.4.) Hold a direction to keep drifting during the launch; let go and the drift stops as on the ground, so you rise straight past a soul beside the spring.
- Souls snap to the grid: a spike death leaves a standing soul as a 1-tile step, or a lying soul flush with the floor.
- **Only the top of a stack can be stood on**, so stacking in place tops out at 3 + a jump = 6.4 tiles. Going higher takes a staircase (souls side by side), built by running off your top soul while holding K.
- Lasers stop at the first soul, wall or door in their path, so a soul blocks only the part of the beam beyond it.

## Playing the greybox
The rooms are on the `greybox-levels` branch, in its own folder (`../Game-Week-greybox`). Serve that folder (`python3 -m http.server 8001`) and open `http://localhost:8001/?dev&room=The%20long%20pit` (any room name works; `?dev` turns on the dev keys and the room shortcut). Keys: hold K to self-destruct (World 2 on), Q to recall your newest soul (World 2 on), Shift+R to retry the room (the way out if you trap yourself), N for the next room and H for the help panel (both dev only). The flames in the bottom left show how many souls you have left.

## Open design questions
- **Slide speed:** raise it so the slide's speed boost can carry puzzles, or keep it as the flat-soul tool only?
