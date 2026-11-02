# Level Plan

Rooms connect Celeste-style (walk through a gap, the camera slides over). Each room is a puzzle you can see whole. Decisions behind this live in [IDEAS.md](IDEAS.md).

This is the design source for building levels: design happens here, and building (code and assets) happens in separate chats that work from this file. Mark a room **Built** once it's in the game.

## How difficulty climbs
- **Each world adds one rule and one way to bend it.** Every room hides a trick: something the player has to realize about their own death to get through.
- **Teach, twist, combine.** A new idea first appears alone and safe, then with a twist, then mixed with earlier ideas. The boss tests everything in that world.
- **Fair, not cruel.** The whole puzzle is on screen, nothing kills you without warning, R resets the room, and a wrong death costs seconds, not minutes.
- **The trick should feel like cheating.** The best rooms make players feel they broke the game (used a soul in a way it "wasn't meant" to be used).

## Powers by world
| World | Souls | New power | The world's trick |
|---|---|---|---|
| 1. Forest Edge | 1 | None. Every death comes from the forest | **Where you get hit is where your soul hangs.** You aim your deaths with jumps and positioning |
| 2. Overgrown Ruins | 2 | **Self-destruct** (hold the button) | **Timing.** You keep moving while you hold, so you press early to die where you'll be, and let go to cancel. A 3rd death erases the 1st, so order matters too |
| 3. Sanctum | 3 | **Recall** (remove all your souls at once, without dying) | **Taking it back.** Recall drops you off souls you're standing on, releases switches and clears souls that block your path |

**Self-destruct (World 2 on):** hold the button for about 0.75s while the blue-white flames grow. You keep running, jumping and falling while you hold. Let go early to cancel. A hazard that hits you mid-hold kills you on the spot, so the soul lands there instead.
**Recall (World 3):** one press removes every soul. It isn't a death, so a boss doesn't heal, and the room's switches and doors react right away.

## World 1: Forest Edge (1 soul, about 6 minutes)
- **1 soul.** A new death moves your only soul.
- **No choosing to die.** Every death comes from the forest: spikes, thorns, the walker.
- **Shrines** (mid-room checkpoints) let a 1-soul puzzle chain: place the soul, cross, touch the shrine, place it again.

| # | Room | Teaches | The trick | Story beat | Status |
|---|---|---|---|---|---|
| 1 | The clearing | Moving and jumping | None (story room) | Finds the amulet, puts it on | Built |
| 2 | The ghost | | None (story room) | The opening conversation (below) | Built |
| 3 | First death | A death leaves a soul | A pit too wide to jump: die in it, and your soul is a stepping stone over the spikes | "AGH! THAT HURT!" | Built |
| 4 | The thorn wall | Aiming a death | Where you touch the thorns is where your soul hangs. Jump into them at the top of your jump to make the highest step | The guide teaches timing | Built |
| 5 | The patrol | Switches, walkers | You choose where the walker catches you: get killed standing on the switch so your soul holds the door | "I want you to get killed *efficiently*." | Built |
| 6 | The chain | Shrines | Bridge the pit, reach the shrine, die again for a step up | "How many times have you done this?" | Built |
| 7 | The well | Spike well | A deep shaft with spike ledges. Die on one, respawn at the shrine, drop onto your soul, jump to the next ledge down. Your soul is both landing pad and launch pad | | To build |
| 8 | The low door | A soul in the wrong spot | The exit is a low tunnel under a high ledge. Die too low on the thorns and your soul blocks the tunnel; die too high and you can't reach the ledge. Find the one height that does both | Guide teases the first wrong try | To build |
| 9 | The turnaround | Walkers turn at souls | A walker paces in front of the exit. Let it kill you at the mouth of a dead-end pocket: it turns at your soul, stays penned in, and the exit is clear | | To build |
| 10 | The moth | Boss 1 | One soul, two jobs. You place it by dying on the arena's thorns, and it must shield you from the wing dust *and* be the step you stomp from. Dying again heals the moth and moves the soul, so you get one placement for all 3 stomps. The dust can't break souls | "Careful. It remembers too." | Greybox built (room only) |

After the moth: the amulet grows stronger and you earn a **2nd soul** and **self-destruct**, leading into World 2.

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

## World 2: Overgrown Ruins (2 souls + self-destruct, about 8 minutes)
New: **2 souls**, **self-destruct** (hold), **lasers** (a soul blocks the beam), **springs**.

| # | Room | Teaches | The trick | Status |
|---|---|---|---|---|
| 1 | The awakening | Self-destruct | The amulet awakens. No hazards: hold to build a 2-step staircase anywhere. Let go once to see that it cancels | To build |
| 2 | Off the edge | Hold while moving | A pit too wide to jump. Start holding on solid ground and run off the edge: the soul appears mid-pit. Press later, and it lands further out | To build |
| 3 | Above the jump | Hold while jumping | The wall is taller than a jump plus one soul. Time the hold so it finishes at the top of your jump | To build |
| 4 | The beam | Lasers | A laser crosses a gap in mid-air. Finish your hold in the beam's path and your soul blocks it below | To build |
| 5 | The spring | Springs | A spring throws you higher than any jump. Hold during the flight so your soul appears at the peak, the only step to the high exit | To build |
| 6 | The race | Hold vs. hazard | A walker closes in on the switch. Your hold has to finish on the switch before the walker reaches you, or it kills you somewhere useless. Or wait and let the walker do it in the right spot | To build |
| 7 | The moving ledge | Cancelling | A platform crosses a pit at different speeds. Start holding when you think it will be in place; if it won't be, let go and try again | To build |
| 8 | Wrong order | Death order | Three placements with 2 souls: your 3rd death erases your 1st. Do them in the wrong order and you erase the one you still need | To build |
| 9 | The tree guardian | Boss 2 | It glows blue, then slams the soul nearest you. Lure the slam onto the soul you don't need and stomp from the one you kept. Dying to rebuild heals it | To build |

After the tree: a **3rd soul** and **recall**.

## World 3: Sanctum (3 souls + recall, about 8 minutes)
New: **3 souls**, **recall** (remove every soul at once, without dying), **inverse doors** (open only while their switch is *empty*).

| # | Room | Teaches | The trick | Status |
|---|---|---|---|---|
| 1 | Three high | 3 souls | A ledge only a 3-soul tower reaches. Easy warm-up | To build |
| 2 | The drop | Recall | The exit is *below* a spike pit you bridged with souls. Stand on the bridge over the gap below and recall: you fall through | To build |
| 3 | Two doors | Recall + switches | Your soul on a switch holds door A open, but door B is an inverse door. Pass A, recall, and B opens | To build |
| 4 | In my own way | Recall vs. dying | Your bridge blocks the exit tunnel once you've crossed. Dying would only erase the oldest soul; recall clears them all | To build |
| 5 | Mid-air | Recall while jumping | Jump off a soul tower and recall mid-flight, so the tower that blocked your arc is gone before you reach it | To build |
| 6 | Everything | All powers | A long room: 3 souls, a held self-destruct off a spring, an inverse door and a recall at the right moment. The final exam before the boss | To build |
| 7 | The rehearsal | Leading a beam | A sweeping soul-breaking beam aims at you; lead it away from the soul wall you need. Teaches the stag fight without the stag | To build |
| 8 | The spectral stag | Final boss | Calm setup: build a 3-thick wall. Then charge → beam (glows blue first; lead it away) → wave every ~15s (hide behind the wall). 3 stomps. A broken soul means dying to rebuild, which heals it | To build |

## Open design questions
- **Recall in the stag fight.** It isn't a death, so it doesn't heal the stag, but rebuilding afterwards takes deaths, which do. Idea: the stag switches sides partway through, so your wall faces the wrong way and you have to recall and rebuild. That only works if dying heals one hit, not all three.
- Does dying heal a boss fully, or only one hit?
- **The slide.** It was planned for World 2, which is now crowded (self-destruct, 2 souls, lasers, springs). Move it to World 3 or cut it?
- **The story.** The amulet awakening moves from World 3 to World 2. The arc in IDEAS.md and STORY.md (World 3 = "he chooses his death") needs adjusting.
- Soul burst (self-destruct kills enemies touching you): in or out?
