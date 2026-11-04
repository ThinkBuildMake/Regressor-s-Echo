# Brainstorm brief: make Regressor's Echo more fun

You're a game designer brainstorming for a 2D puzzle platformer (Phaser, browser, a week-long game jam; about 20 minutes of play over 3 worlds). The core mechanic: **every death leaves a solid, floating "soul" where you died** (it hangs in the air, you can stand on it, it blocks shots and beams, it holds pressure plates). You have a limited number of souls; a new death erases the oldest. Bosses heal to full whenever you die, so a fight is a setup (die freely to place souls) followed by a run where you must not die.

Below are the project's own design notes. Read them, then answer the questions at the end. Be concrete and codeable in a few days by a small team (simple shapes and timers, no physics engines beyond arcade boxes). Prefer ideas where **the soul mechanic is the weapon or the shield**, not ideas that would fit any platformer.

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
- **Thornwood (W1):** walker to stomp, a 3-wide chimney whose right wall turns to thorns for 5 rows (die on the middle one and your soul is the kick point past them), a crumbling bridge under falling spikes, then a saw in a 2-tall corridor you can't jump: let it kill you so your soul jams it (a jammed saw sticks inside the soul, so you walk over it).
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
## Boss and rehearsal designs (2026-11-02, written for the overnight build; tune the numbers in playtests)
All three follow the moth's rules: 3 stomps from above, it speeds up after each one (attack gaps × 0.8), any death heals it to full, yellow attacks never break souls, and an attack that breaks souls is warned by a blue glow.

### The tree guardian (W2 boss, 2 souls + self-destruct)
- **Arena:** one screen (30 × 17), flat floor. The tree is rooted at the right (about 7 tiles wide) and never moves. Its stone mask is the stomp target: top **4 tiles up**, sticking out over the floor at its left edge. Out of reach from the floor, in reach from one standing soul 1–2 tiles in front of it, so every stomp needs a soul.
- **Branch swing (yellow):** a 0.6s wind-up, then a branch sweeps the floor band (the bottom tile) from the trunk out to about 12 tiles. Jump it, or be standing on a soul. It passes through souls.
- **Seed pod (yellow):** lobbed at where you are, bursts on landing in a small area. A soul between you and the pod blocks it, as with the moth's dust.
- **The slam (blue, smashes souls):** every third attack. The mask glows blue for 2.05s and **looks at the soul nearest you; the target locks when the glow starts**. The arm slams that soul into the ground: it sinks flat (useless as a step) and **pushes back up 5s later**. The slam also sends a shockwave along the floor that kills you unless you are standing on an unburied soul when it lands. Each buried decoy opens one stomp, lasting until it rises. With no souls out, it slams where you stand.
- **The trick:** you need 2 souls: the step in front of the mask and a decoy farther out (self-destruct lets you put the decoy anywhere, mid-air too). When the glow starts, be near the decoy. Then get onto the step before the slam lands: the slam buries the decoy, the shockwave passes under you, and you stomp. Stand on the step when the glow starts and the slam buries your step and the shockwave kills you, which heals the tree. As it speeds up (slam intervals 8s → 6.4s → 5.12s), the decoy is barely back up in time, so the last cycle is tight.
- **Replay numbers:** 30 × 17 arena; floor row 16, mask at column 23 with its top 4 tiles up. Step at column 21, decoy at 13 (8 tiles apart). Blue warning 2.05s; run, jump onto the step, then jump mostly straight up before steering onto the mask. Replay spare time: 0.3–0.6s. Jump over the return swing earlier as it speeds up, then lead the pod left before returning to the decoy. Yellow wind-ups 0.6s; burial 5s; attack gaps × 0.8 per stomp.
- **Story:** STORY.md W2 scenes 4 (arrives partway in), 5 (the slam nudges after the 2nd and about the 25th death) and 6 (the tree falls, 3rd rune: 3 souls + recall).

### The rehearsal (W3 room 6, 3 souls + recall)
- Teaches the stag's beam without the stag. An emitter (an antler relic in the right wall) glows blue, shows an **aiming line that follows you**, locks 0.4s before it fires, then fires a beam along that line that breaks the first soul it hits and kills you if it reaches you. Then a 3s gap in the stair chamber; the corridor cycles every 1.6s. Both give 2s extra before the first shot.
- The room: a ledge 7 high on the left needs a 2-soul staircase. The beam fires every ~4s, so you build the stair between shots and must stand away from it (out in the open, or next to a third "spare" soul) when the line locks, so it never crosses the stair. Recall cleans up a soul the beam made useless. Then a short second stage: a corridor where the line can only be led onto a decoy soul you place on purpose.

### The spectral stag (W3 boss, 3 souls + recall, final)
- **Arena:** wider than one screen (about 40 × 17, the camera follows). A raised platform at the left (columns 2–6, surface row 12 over floor row 15), 3 tiles up and 5 wide; the stag's charge lane is the floor under and to the right of it.
- **Calm setup:** the stag watches until you step off the platform's edge or 8s pass after its intro. Build a **wall 3 souls thick** on the platform's right edge.
- **The loop:** charge → beam → charge → beam, with the first violet wave after 15s; later waves wait 25s, restarted by stomps.
  - **Charge (yellow):** it gallops along the floor and rams the arena's left wall under the platform, then stands **dazed for 2s under the platform's edge. Drop onto its back from the platform: that's the stomp.** It breaks any soul in its lane, so the floor is no place for souls.
  - **Beam (blue):** the same aimed beam as the rehearsal. Lead the line away from your wall before it locks (step out to the platform's left end), then get back behind the wall.
  - **Wave (violet, can't dodge):** a wall of light rolls across the arena at platform height. It breaks 2 souls and stops at the 3rd, so only the 3-thick wall saves you. Stand behind it.
- **A broken soul** means a 2-thick wall: you either die to rebuild (it heals) or recall and rebuild later. Recall isn't a death, so it never heals the stag.
- **Replay numbers:** 40 × 17 arena; charge speed 650 px/s, ram centre column 6.5 against the buttress at column 4, six-wide back top row 13. Wall souls at columns 4, 5, 6 on row 12; drop beyond column 7. Setup 8s, yellow wind-up 0.7s, daze 2s, beam gaps 8s × 0.8 per stomp, wave at 420 px/s: first after 15s, later waves after 25s. After the first wave, every stomp restarts the 25s timer.
- **Route:** The rehearsal → The old tree (30 × 17, promise beside the tree at column 21) → arena → The pyramid entrance (30 × 17). Both arena gates and the vine buttress under the platform open after the last stand, clearing the way back. Return behind the tree to the dirt note at columns 18–20, then walk through the arena to the pyramid door at column 22; entering fades to the ending card.
- **Story:** STORY.md W3 scenes 5 (arrives), 6 (nudge after about 10 deaths), 7 (the guide's last stand), 8 (the note behind the old tree), 9 (floor one, ending card).

## Enemies per world (planned 2026-11-03, not built)
Each world gets its own creature built around that world's trick, not a reskin. Brainstormed with Codex and agy; the level chat places them in rooms. All are red (readability rule), stompable from above unless noted, and drawn as 2–4 frame sheets. The walker stays in World 1, the thrower in World 2 and the flyer in World 3 as each world's second enemy.

| World | Enemy | Looks | Behaviour (codeable) | Soul puzzle it creates | Fits |
|---|---|---|---|---|---|
| 1 | **Bramble spider** | A red spider hanging on a dark silk thread from ceiling roots | When you pass under its column, it shakes (~0.5s warning), drops straight down, pauses 1s, then climbs back. A soul in its column stops the drop on top of the soul | Vertical death aiming without self-destruct: jump into its drop to choose the height your soul hangs at (e.g. a wall-jump kick point in a chimney); that soul then also stops its later drops | *The well* (W1-8), the Thornwood chimney |
| 2 | **Idol slider** | A block of red carved stone on short crab legs | Moves toward you only while you're airborne or holding self-destruct (K); stands still otherwise. Turns around at walls and souls. Solid on top: presses plates, blocks lasers | World 2's trick is timing, and every self-destruct hold also moves it. Fence it with your 2 souls onto a plate or into a beam so it takes over a soul's job | *The beam* (W2-4), *Wrong order* (W2-6) |
| 3 | **Reliquary scarab** | A flat red scarab with a hard shell | Patrols floors and the tops of souls (walks along soul bridges), turns at walls and soul ends. Presses plates, its shell blocks lasers. Falls when the soul under it is recalled | Recall becomes a weapon: walk it out over a gap on your souls, then recall the soul under it so it drops onto a plate you can't reach, or into a beam | *Three jobs* (W3-3), *Everything* (W3-4) |

Runner-up for World 2: **rubble toad** (a red stone-backed toad hopping between two marked landings on a timer; each landing starts a crumbling tile's countdown; a soul above a landing catches it so the floor survives).

## Measured movement (design to these)
## Measured movement (design to these)
Measured in the game; the greybox tests (`tests/check.html`) replay each tight room's solution with real physics.
- Jump: **3.4 tiles** up. A ledge 3 up is reachable, 4 is not.
- Running jump: **5.4 tiles** across; slide-jump **6.1**. The slide adds only about a tile, too little for "slide or fail" gaps; raise `SLIDE_SPEED` if we want those.
- Spring: **8.5 tiles** up. (Until a fix after the playtest, a speed cap meant for falling held springs to 7.4.)
- Souls snap to the grid: a spike death leaves a standing soul as a 1-tile step, or a lying soul flush with the floor.
- **Only the top of a stack can be stood on**, so stacking in place tops out at 3 + a jump = 6.4 tiles. Going higher takes a staircase (souls side by side), built by running off your top soul while holding K.
- Lasers stop at the first soul, wall or door in their path, so a soul blocks only the part of the beam beyond it.

## Playing the greybox
## Enemies per world (planned 2026-11-03, not built)
Each world gets its own creature built around that world's trick, not a reskin. Brainstormed with Codex and agy; the level chat places them in rooms. All are red (readability rule), stompable from above unless noted, and drawn as 2–4 frame sheets. The walker stays in World 1, the thrower in World 2 and the flyer in World 3 as each world's second enemy.

| World | Enemy | Looks | Behaviour (codeable) | Soul puzzle it creates | Fits |
|---|---|---|---|---|---|
| 1 | **Bramble spider** | A red spider hanging on a dark silk thread from ceiling roots | When you pass under its column, it shakes (~0.5s warning), drops straight down, pauses 1s, then climbs back. A soul in its column stops the drop on top of the soul | Vertical death aiming without self-destruct: jump into its drop to choose the height your soul hangs at (e.g. a wall-jump kick point in a chimney); that soul then also stops its later drops | *The well* (W1-8), the Thornwood chimney |
| 2 | **Idol slider** | A block of red carved stone on short crab legs | Moves toward you only while you're airborne or holding self-destruct (K); stands still otherwise. Turns around at walls and souls. Solid on top: presses plates, blocks lasers | World 2's trick is timing, and every self-destruct hold also moves it. Fence it with your 2 souls onto a plate or into a beam so it takes over a soul's job | *The beam* (W2-4), *Wrong order* (W2-6) |
| 3 | **Reliquary scarab** | A flat red scarab with a hard shell | Patrols floors and the tops of souls (walks along soul bridges), turns at walls and soul ends. Presses plates, its shell blocks lasers. Falls when the soul under it is recalled | Recall becomes a weapon: walk it out over a gap on your souls, then recall the soul under it so it drops onto a plate you can't reach, or into a beam | *Three jobs* (W3-3), *Everything* (W3-4) |

Runner-up for World 2: **rubble toad** (a red stone-backed toad hopping between two marked landings on a timer; each landing starts a crumbling tile's countdown; a soul above a landing catches it so the floor survives).
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

# The questions (from the game's author)

1. **Boss damage beyond stomping.** "Damaging the bosses only by jumping on heads is boring." The author's seed idea: a stone falls from the ceiling; you must stop it and hold it up with a soul; only by **recalling** the soul (dropping the stone) can you damage the boss. Develop this and give 4-6 more ways to damage each boss that use the soul mechanic (souls as props, counterweights, bait, mirrors, fuses, etc.). Note the powers each world has: World 1 = 1 soul, no self-destruct, no recall; World 2 = 2 souls + self-destruct; World 3 = 3 souls + self-destruct + recall. So recall-based damage only fits World 3 unless you give earlier worlds another way to release a held object.
2. **The moth (World 1 boss) needs real attack patterns**, "like Hollow Knight instead of a linear back-and-forth." Design 3-5 named attacks with tells (what the player sees before it hits), timings, and how a soul counters each, plus a phase change. The moth can't break souls.
3. **Same for the tree guardian and the stag**: what attacks and patterns would make them memorable, and how does each world's power become the answer?
4. **The undodgeable attack.** The current plan: a wave on the stag that breaks 2 souls and stops at the 3rd. Is that good? Propose 2-3 alternatives where the only answer is a soul arrangement, and how it's telegraphed.
5. **New level mechanics or room ideas** (5-8) that would make rooms more fun, each with the soul trick it creates and which world it fits.
6. **Projectile and attack sprites to generate** (the author makes painted sprites with an image generator, then cuts them into frames): list every projectile/effect the bosses and enemies above would need (e.g. stones, fireballs, dust, beams, shockwaves), each with its look, size in tiles, frame count, and whether it's better drawn in code instead. Keep the colour rule: normal attacks yellow, soul-breaking attacks glow blue first; the amulet is gold.

Answer as a compact markdown document with a section per question. Rank ideas within each section, best first, and give one line on why the best one is best. Under 1500 words total.
