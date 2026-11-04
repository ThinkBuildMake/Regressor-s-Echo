# Assets

Every painted asset the game needs, as a checklist. Each one goes through the `flow-asset` skill
(`.claude/skills/flow-asset/SKILL.md`): **prompt → reference → clean base → sheet → sized → in game**. The critic runs on
reference, sheet and sized. Art prompts live in [PROMPTS.md](PROMPTS.md); audio prompts are in the Audio section below.

**Status (2026-11-03):** every reference, sheet and sound on this list is made and approved by the user, including the stag walk: replaced 2026-11-04 by a Veo video walk (12 frames, true four-beat; method in the flow-asset skill). The art checkboxes below lag behind; the review pages are the record: references https://claude.ai/artifact/D9g8CCAaV7W7MFSZEq2S61 · sprite animations https://claude.ai/artifact/LyqhxdFPrUPioRYo5R7ujU · batch 3 (fallen bosses, flyer, thrower, hazards in all worlds) https://claude.ai/artifact/1EDac6VRWQD4Cw2eqq5jyK · audio https://claude.ai/artifact/CLuj1KAWJxZPRxRSmERRfo. Music alternative if the ElevenLabs tracks don't hold up on review: Google Lyria 3 on OpenRouter (`google/lyria-3-pro-preview`, $0.08/track; served via Google AI Studio, not Vertex; takes an image prompt); not used yet. **Veo animations (2026-11-04, approved):** `stag-walk` (12 frames) and `stag-charge` (12 frames) are swapped in. `moth-fly-12.webp` (12 frames, one full wingbeat) is ready next to the old 4-frame `moth-fly.webp`. Hero (approved by the user): `assets/hero/run-veo.webp` (12 frames, one full stride, 100x112 cells; set `RUN_FRAMES` to 0..11 and retune `RUN_STEP`) and `assets/hero/wall-slide-veo.webp` (6 frames, 141x141, same cell as the old sheet; loop all 6; the kick-off frame 3 stays from the old `wall-slide.webp`). `assets/hero/idle-veo.webp` (8 frames, 106x112 cells, green eyes, gentle air; replaces `idle-anim.webp`: frame count 8, frameWidth 106, origin may need retuning). For the code chat: load moth-fly-12 and set `MOTH_FRAMES` to 0..11 (game.js), and tune playback speed (the user finds 10 fps slow; `MOTH_FPS`, and the duration argument to `bossPose`). What's left is wiring into the game ("In game" column).

Key: ✅ done · 🟡 started · blank = to do · — = not needed (a single image, or drawn in code).
"Sheet" lists the animations to ask for. One facing per sheet; the game mirrors for the other.

## Hero

| Asset | Sheet (animations) | Prompt | Ref | Sheet | Sized | In game |
|---|---|---|---|---|---|---|
| Hero: idle, run, jump, fall, slide | (done) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Hero idle (animated) | standing still while hair, scarf and cape sway in a breeze, ~4–6 frames looping. Replaces the single `idle.webp` | | ✅ `raw/hero/hero.jpg` | | | ✅ |
| Hero wall slide + wall jump (coming with wall jump) | slide: clinging to a wall with one hand and one boot, body facing out, sliding down; scarf and cloak lifted upward by the slide, 2–3 frames looping. Kick-off: 1 frame pushing away from the wall. Facing right (the wall on his right); the game mirrors it | | ✅ `raw/hero/hero.jpg` | | | ✅ |
| Hero kneel / crouch (cutscene pose, requested 2026-11-04) | covers about half the cutscene poses: picking up the amulet, putting it down ("I'm leaving it right here"), the shrine mark, reading the stag's note, peering over the first pit. Ideal: 2–3 frames going down, then a held frame; one held frame is enough. Facing right like the other hero sheets | | ✅ `raw/hero/hero.jpg` | | | |
| Hero slumped / sitting, worn out (cutscene pose) | one held frame. Used after the first death, at the soul reveal, after the moth falls, after the stag falls | | ✅ `raw/hero/hero.jpg` | | | |
| Hero holding something up (cutscene pose) | one frame: looking at the amulet held in front of him (today the amulet floats beside the standing sprite). Hands only, the amulet stays a separate sprite so it can glow | | ✅ `raw/hero/hero.jpg` | | | |
| Hero hurt / moment of death (nice to have) | ~3 frames: the hit and the collapse, played before the existing death burst (today it cuts straight to the ghost and soul). Death is the core mechanic, so this is the most noticeable gameplay upgrade of the four; cutscenes don't need it | | ✅ `raw/hero/hero.jpg` | | | |
| Hero death | arcade-style burst: he flashes pure white, then breaks apart into square pixels that fly outward, ~4–5 frames (white flash → white silhouette → breaking into pixels). The scattering pixels after the last frame are code particles | | — | | | |
| Hero respawn | soul light gathers to the respawn point: pixels fly inward (code particles) → white silhouette → the hero. Plays the **death sheet in reverse**, so no new sheet unless it looks wrong | | — | — | | |
| White ghost (appears when he picks up the amulet) | — `raw/world1/ghost-white.jpg` approved by the user (standing pose fits the floating motif); glow, bob and alpha in code | | | — | | |
| Hero self-destruct (World 2 on, hold) | blue-white flames grow over the ~0.75 s hold while he keeps moving: code flames over his current frame, no sheet. Letting go cancels | — | — | — | — | |
| Recall (World 3) | a soul fades back into the hero, newest first: code effect (the respawn gather, reused), no sheet | — | — | — | — | |

## Story objects

| Asset | Sheet (animations) | Prompt | Ref | Sheet | Sized | In game |
|---|---|---|---|---|---|---|
| Amulet: in the world (pickup) | — (glow and bob in code) | | | — | | |
| Amulet: runes lit (1, 2, 3) | — one image per state, same framing: a rune lights after each boss (2nd after the moth, 3rd after the tree) | | | — | | |
| Shrine: dormant | — | | | — | | |
| Shrine: activated | — (same shrine, lit; glow pulse in code) | | | — | | |

## Enemies

| Asset | Sheet (animations) | Prompt | Ref | Sheet | Sized | In game |
|---|---|---|---|---|---|---|
| Walker (red beetle) | walk (2 poses + code bob) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Flyer | flies over soul walls; a small red flying beetle (the walker's family); wing-buzz loop, 4 frames | ✅ | | | | ✅ |
| Thrower | stands still and shoots seeds along the ground (souls block them); a red toadstool creature; idle + spit, 4 frames, plus a seed pellet | ✅ | | | | ✅ |
| Bramble spider (W1) | hangs on a silk thread, drops on you, climbs back; a red spider; hang/shake, drop, climb, 3–4 frames, plus a thread drawn in code. See LEVELS.md "Enemies per world" | ✅ | ✅ | ✅ | ✅ | |
| Idol slider (W2) | a red carved-stone block on crab legs that slides while you're airborne or holding self-destruct; still, scuttle 2–3 frames | ✅ | ✅ | ✅ | ✅ | |
| Reliquary scarab (W3) | a flat red scarab that patrols floors and soul bridges; walk 2–3 frames, plus a falling pose | ✅ | ✅ | ✅ | ✅ | |

## Bosses

**Boss idles are code, not sheets (user):** each boss just stands in place and breathes: its standing frame plus a slight scale bob.
Shared: the blue "soul-breaking" charge glow and the yellow normal-attack color are tinted in code, not painted.
Every boss gets an **intro animation** when the fight starts, with a Silksong-style name card (name + title) in the
bottom-left corner. The name card is text drawn in code, not an asset.

| Asset | Sheet (animations) | Prompt | Ref | Sheet | Sized | In game |
|---|---|---|---|---|---|---|
| **Moth** (World 1) | | ✅ | ✅ `raw/bosses/moth.jpg` | | | |
| Moth: flying | wing-flap loop, 4 frames (up, flat, 45° down, flat) | ✅ | ✅ `moth-base.jpg` | ✅ `moth-fly.jpg` | ✅ | 🟡 playtest |
| Moth: screaming (= its intro, and before each wing-dust attack) | no new sheet, and no mouth (moths don't have one): reuse the flying frames, beat from raised (1) to fully spread (2) and hold the spread, while code draws sound-wave rings pushing out in all directions, plus camera shake and the scream sound | — | — | — | — | |
| Moth: intro (crash through the wall) | no new sheet: on the earthquake the moth bursts through the arena wall (flying frames + code movement), rocks fly, then it screams. Needs the two rows below | — | — | — | — | |
| Rock chunks (wall burst debris) | — 6 chunks cut into `assets/world1/rocks.webp` (6 frames, natural sizes), flung by code; dust puffs are code particles | ✅ | ✅ `raw/world1/rocks.jpg` | — | ✅ | |
| Broken wall edge (the hole the moth leaves) | — `assets/world1/wall-break.webp` (cropped: Flow painted a forest floor under the strip). Clean left side joins the wall, ragged right side; not seamless top-to-bottom, so mask or cap its ends in code | ✅ | ✅ `raw/world1/wall-break.jpg` | — | ✅ | |
| Moth: wing dust (its attack) | — code particles. Room 11: you hide behind your soul from it; it can't break souls | — | — | — | — | |
| **Tree guardian** (World 2) | reference: the ORIGINAL Flow tree (`raw/bosses/tree.jpg`, user's pick); the side-profile version is kept as `tree-profile.jpg` | ✅ | 🟡 `raw/bosses/tree.jpg`, top clipped, faces front | | | |
| Tree: intro | mask eyes open, rises out of the ruins, arms spread, ~4 frames | | | | | ✅ |
| Tree: idle | no sheet (user: too much movement; bosses just stand and breathe): the standing frame from `raw/bosses/tree-base.jpg` plus a slight breathing bob in code (scale ~1–2%, ~2 s per breath). `assets/bosses/tree-idle.webp` stays only as a fallback | — | ✅ | — | | ✅ |
| Tree: branch swing | wind-up → swing → recover, ~4–5 frames | | | | | ✅ |
| Tree: slam (smashes souls) | raise arms → slam down, ~4–5 frames | | | | | ✅ |
| Tree: seed pod throw + pod | throw ~3 frames; pod is a single image | | | | | ✅ |
| **Spectral stag** (World 3) | | ✅ | | | | |
| Stag: intro | rears up on its hind legs, antlers raised, ~4 frames | | | | | ✅ |
| Stag: idle | no sheet (user: the painted idle was useless): the standing frame from the clean base plus a slight breathing bob in code (scale ~1–2%, ~2 s per breath). `assets/bosses/stag-idle.webp` stays only as a fallback | — | ✅ | — | | ✅ |
| Stag: walk | proud walking loop, `assets/bosses/stag-walk.webp` (reads as a prance, not a four-beat walk; user's call). **Stag sheets are drawn at different sizes** (walk and beam ~555 px tall, idle ~486 px): code scales each sheet so the body height matches | ✅ | ✅ | 🟡 | ✅ | |
| Stag: charge | gallop loop, ~6 frames | | | | | ✅ |
| Stag: beam | lower antlers, charge, fire, ~3–4 frames (beam itself in code) | | | | | ✅ |
| Stag: wave | rear up → stamp, ~4 frames (the wave itself in code) | | | | | ✅ |
| All bosses: hurt | code flash (user's call), no art | — | — | — | — | |
| All bosses: death | 1 painted **fallen pose** each (moth on the ground wings drooped; tree slumped, mask dark; stag lying down), then code: white glow → dissolves into motes that stream into the hero → he flashes (STORY.md W1 §13) | ✅ | | — | | ✅ |

## Boss attack effects (requested 2026-11-03, fun pass)
From docs/brainstorm/2026-11-03-bosses.md. Paint physical objects; beams, lanes, warnings and rings are drawn in code. Attacks are **lemon yellow** (kept apart from the amulet's gold); the code adds the blue and violet glows. The game already loads each file below if it exists and draws a stand-in shape until then.

| Asset → file | Sheet (animations) | Size in game | Prompt | Ref | Sheet | Sized | In game |
|---|---|---|---|---|---|---|---|
| Moth dust pod → `assets/bosses/moth-dust.webp` | a puff of glowing lemon-yellow moth scales, spinning, 4 frames | ½ tile | | | | | stand-in |
| Falling stone → `assets/effects/falling-stone.webp` | a grey ruin stone with cracks and a faint yellow danger rim; 1 intact frame + 4 breaking apart | 1 tile | | | | | stand-in |
| Impact burst / stun stars → `assets/effects/impact.webp` | yellow-white burst with little circling motes, for a boss getting hit or stunned, 4 frames | 1 tile | | | | | stand-in |
| Seed mortar burst → `assets/effects/mortar-burst.webp` | a yellow seed husk cracking open into a ring of thorns, 5 frames | 2 tiles | | | | | stand-in |
| Root rake segment → `assets/effects/root.webp` | a yellow-tipped root bursting up out of the ground, 4 frames (rising) | 1 tile | | | | | stand-in |
| Seal socket → `assets/effects/seal.webp` | a carved stone socket in the floor, 2 frames: empty and glowing (a soul fills it) | 1 tile | | | | | stand-in |

## Hazards and room objects

| Asset | Sheet (animations) | Prompt | Ref | Sheet | Sized | In game |
|---|---|---|---|---|---|---|
| Spikes (tileable strip) | — | | | — | | ✅ W2–3 |
| Spiky vine wall (the `x` tile) | — (static, tileable) | | | — | | ✅ W2–3 |
| Pressure plate: up / down | — up: `raw/world1/plate.jpg` approved. Down: no new art; when pressed the code sinks the plate so only a thin sliver of its top edge peeks above the ground | | | — | | ✅ W2–3 |
| Gate (held open by a pressure plate) | — one image per world: W1 root gate ✅, W2 stone slab, W3 carved shrine door; slides open in code | ✅ | 🟡 W1 | — | | |
| Vine barrier (`V`, opens when the room's boss is beaten) | — `raw/world1/vine-barrier.jpg` approved; draw it **thinner** (about one tile wide) when sizing; it withers open in code | | | — | | ✅ W2–3 |
| Laser emitter (World 2) | — (beam in code) | | | — | | |
| Spring (World 2) | idle / compressed / launch, 3 frames | | | | | ✅ |
| Moving platform (World 2 room 7) | — | | | — | | |
| Saw blade (all worlds) | — one round blade image, spun in code | | | — | | ✅ |
| Crumbling block (all worlds; breaks 0.45 s after landing, back 2.5 s later) | intact → cracked → breaking, 3 frames (or the platform art plus code cracks and falling chunks) | | | | | ✅ |
| Falling spike (all worlds; drops as you pass under) | — one hanging stalactite/thorn spike, shakes then drops in code | | | — | | ✅ |

## Story assets (requested by the story chat, 2026-11-02)

Script: [STORY.md](STORY.md); § = the scene each asset serves. Done in priority order.

**Priority 1: portraits** (used throughout World 1 and every world after)

| Asset | Notes | Prompt | Ref | Sheet | Sized | In game |
|---|---|---|---|---|---|---|
| Hero expressions 2 → `assets/portraits/hero2.webp` | curious, annoyed, excited, scared, shouting, cocky (= `FACES2.hero` order in dialogue.js). Attach `hero.jpg` + the first sheet (`raw/portraits/hero-faces.jpg`) so face and framing match. Cut: `sheet.mjs <raw> <out> --grid --frames=3 --rows=2 --height=192` | ✅ PROMPTS item 3 | — | ✅ | ✅ | ✅ |
| Guide expressions 2 → `assets/portraits/guide2.webp` | smug, mischievous, teasing, exasperated, warning, surprised (= `FACES2.guide`). Attach the first guide sheet so the ghost look matches. Same cut | ✅ PROMPTS item 4 | — | ✅ | ✅ | ✅ |

**Priority 2: World 1 scene sounds** (in the game now, silent). Prompts in the Audio section below.

| For | § | Done |
|---|---|---|
| Satchel clink (tools and a metal cup) | W1 §2 | |
| Gold flash chime, warm and magical, as he puts the amulet on | W1 §2 | |
| Ghost fading in, soft and airy | W1 §2 | |
| Amulet refusing to come off: a low gold pulse | W1 §3 | |
| Guide's quiet snicker "…heh" | W1 §4 | |
| Guide's tired sigh | W1 §3 | |
| Earthquake rumble, ~1.5 s (the moth arrives) | W1 §11 | |
| Boss dissolving into light motes that get absorbed: shimmer into a whoosh | W1 §13 | |
| Faint pen scratching on paper in the dark, during the nap (he's secretly writing the note; keep it subtle) | W1 §14 | |

**Priority 3: Worlds 2 and 3 story scenes** (not built yet)

| Asset | § | Notes | Prompt | Ref | Sized | In game |
|---|---|---|---|---|---|---|
| Carved wall relief | W2 §6 | reads left to right: a crowd of figures, each with a gold circle on its chest; then fewer; then a handful; then one. Ruins stone, as a background layer behind room 7 | ✅ | | | |
| Pyramid backdrop | W3 §1 | a huge stepped pyramid, its top lost in cloud; a far parallax layer for the Sanctum | ✅ | | | |
| The old tree | W3 §5 | by the stag's arena, with a hiding spot behind it (where the note is) | ✅ | | | |
| The guide's note | written in the DIRT behind the old tree, not on paper (user): a blank smoothed patch of earth, the words scratched in by code | a folded, worn paper, for a close-up the note's text sits on | ✅ | | | |
| Sound: the guide cracking like glass as the beam hits him | W3 §8 | sad, not violent | | — | | |
| Music: the last-stand cue | W3 §8 | later | | — | | |

## Backgrounds (prompts already in PROMPTS.md)

| Asset | Prompt | Ref | Sized | In game |
|---|---|---|---|---|
| World 1 layers | ✅ | ✅ | ✅ | ✅ |
| World 2 layers (sky, far, mid, near, lip, ground, cap) | ✅ | | | |
| World 3 layers (sky, far, mid, near, lip, ground, cap) | ✅ | | | |

## Menus and UI (added 2026-11-03)
The game has no title screen, pause menu or on-screen soul count yet (the content warning and ending card are code text). Art for them; the screens themselves are code-chat work. Prompts: PROMPTS.md "## Menus and UI".

| Asset | Used for | Prompt | Ref | Sized | In game |
|---|---|---|---|---|---|
| Title key art (16:9) | title screen background (the logo and the stone menu box sit centred over it); dimmed behind the content warning | ✅ | | | |
| Logo: "Regressor's Echo" | title screen and ending card (painted lettering + the amulet mark; fall back to code text if the lettering is off) | ✅ | | | |
| Ending art (16:9) | behind the ending card: the hero small at the pyramid door at dawn | ✅ | | | |
| Amulet mark icon | menu cursor, favicon | ✅ | | | |
| Soul pips: full / empty | HUD soul count (1–3 by world) | ✅ | | | |
| Menu panel | grey stone box holding the menu buttons, centred on screen (title, pause, settings); plain centre so it stretches. Replaces the first wooden panel (user: "a grey stone box") | ✅ | | | |
| Stone button: normal / highlighted | Start, Settings, Resume… as stone buttons inside the box; blank, the words are code text; highlighted = the selected one | ✅ | | | |

## Audio

How to write and check these prompts: [.claude/skills/flow-asset/references/audio-prompts.md](../.claude/skills/flow-asset/references/audio-prompts.md).
The generation tool isn't chosen yet, so the prompts don't depend on any one tool. Generate dry (no reverb); the
game adds room sound. Rows marked *(3 takes)* repeat often, so make 2–3 variations.

### Sound effects

| Group | For | Prompt | Done |
|---|---|---|---|
| Hero | Footstep, World 1 *(3 takes)* | A single soft leather boot step on damp packed moss and leaf litter, close, dry, outdoors, 0.2 s | ✅ |
| Hero | Footstep, Worlds 2–3 *(3 takes)* | A single leather boot step on old flat stone with a little grit underfoot, close, dry, 0.2 s | ✅ |
| Hero | Jump *(3 takes)* | A short push-off: boot scuff on ground plus a quick cloth rustle of a light jacket, close, dry, 0.25 s | ✅ |
| Hero | Land *(3 takes)* | Both boots landing on packed earth after a short drop, soft thud with a small cloth flap, close, dry, 0.3 s | ✅ |
| Hero | Slide | A person sliding on their side across damp grass and gravel, a rough scrape that fades out, close, dry, 0.45 s | ✅ |
| Hero | Dive | A quick body lunge: sharp cloth whip of a coat through the air, no impact, close, dry, 0.3 s | ✅ |
| Hero | Death burst | A sharp camera-flash pop followed by a handful of small glass beads scattering and bouncing on a stone floor, close, dry, 0.8 s | ✅ |
| Hero | Respawn (soul gathers back) | Small glass beads rolling inward across a stone floor and settling, then a soft breath over a wine-glass rim swelling to a clear hum, close, quiet, 1 s | ✅ |
| Hero | Soul appears | A soft breath blown across the rim of a wine glass, giving a faint airy hum that swells and settles, close, quiet, 1 s | ✅ |
| Hero | Soul erased / replaced | A thin sheet of frost cracking softly, then a short exhale of air, close, quiet, 0.5 s | ✅ |
| Hero | Release wind-up (W3) | A gas burner igniting with a soft whump, then a steady low flame roar building for 0.75 s, ending abruptly, close, dry | ✅ |
| Story | Amulet pickup | A small brass pendant on a fine chain lifted off stone, a light chain jingle and a single clear tap of metal on glass, close, dry, 0.6 s | ✅ |
| Story | Amulet awakening | A large brass singing bowl struck softly with a felt mallet, a long warm hum with a slow shimmer, close, 3 s, natural decay | ✅ |
| Story | Shrine activates | A heavy stone slab shifting a few centimetres, then a low hum like a finger on a wet glass rim, outdoors, close, 1.5 s | ✅ |
| Hazards | Spikes impale | An iron garden fork stabbed quickly into a sack of wet sand, close, dry, 0.3 s | ✅ |
| Hazards | Vine wall touch | Thick thorny bramble branches snapping back and scratching against a canvas coat, close, dry, 0.4 s | ✅ |
| Hazards | Plate down | A heavy stone tile pressed down into a stone frame, a dull clunk with a short grinding settle, close, dry, 0.35 s | ✅ |
| Hazards | Plate up | The same stone tile rising back up, a lighter clunk with a tiny grit rattle, close, dry, 0.3 s | ✅ |
| Hazards | Door opens | A heavy stone slab door grinding upward in a stone groove, steady scrape, ends in a soft knock, medium distance, 1.2 s | ✅ |
| Hazards | Door closes | A heavy stone slab dropping down a stone groove and landing with a deep thud and dust trickle, medium distance, 0.9 s | ✅ |
| Story | Satchel clink (W1 §2) | Small metal tools and a tin cup knocking together inside a leather satchel as it is set down: several bright, clear metallic clinks and clanks, iron against tin, close, dry, 0.8 s | ✅ |
| Story | Gold flash as he puts the amulet on (W1 §2) | Acoustic foley recording: a small brass bell struck gently once with a soft mallet, warm and round, then a soft rising shimmer of a wet finger circling a wine-glass rim, soft high frequencies, close, 2 s, natural decay | ✅ |
| Story | Ghost fading in (W1 §2) | A long, soft, natural breath of air drifting through a slightly open window, gently swelling and settling, airy and quiet, only the faintest hint of a hum, close, 2 s | ✅ |
| Story | Amulet refusing to come off (W1 §3) | One low, dull hum of a large brass singing bowl touched by a palm, short and muffled, with a faint warm throb, close, 1 s | ✅ |
| Story | Guide's quiet snicker "…heh" (W1 §4) | A young man's single quiet, amused breath-laugh through the nose, "heh", close, dry, 0.5 s | ✅ |
| Story | Guide's tired sigh (W1 §3) | A young man's unvoiced, breathy exhale out through the mouth, tired and resigned, no voice or groan in it, close, dry, 1.2 s | ✅ |
| Story | Earthquake rumble (W1 §11) | A heavy, resonant sub-bass ground tremor rolling under a forest, swelling up then fading, with distinct gravel and pebbles clattering and small stones knocking together on top, outdoors, close, 1.5 s | ✅ |
| Story | Boss dissolving into light, absorbed (W1 §13) | A soft glittering shimmer of tiny glass wind chimes and a finger circling a wine-glass rim, rising gently, then a quick soft rush of air drawn inward like a gentle inhale, nothing breaking, 2.3 s | ✅ |
| Story | Pen scratching in the dark (W1 §14) | Light, soft graphite strokes of a pencil writing slowly on smooth paper in a quiet room, a few gentle strokes with pauses between them, very quiet and delicate, close, 4 s | ✅ |
| Story | Guide cracking like glass (W3 §8) | A thin pane of glass slowly splintering under pressure, soft crackles spreading, then a faint high ring fading out, sad and gentle, not a smash, close, 2 s | ✅ |
| Bosses | Moth bursts through the wall | A dry earth bank collapsing as something heavy smashes through it: a sharp crack, then a rumble of clods and stones tumbling and scattering on the ground, outdoors, close, 2 s | ✅ |
| Bosses | Name card appears (all bosses) | One deep low drum hit with a large gong swelling behind it, in a stone hall, 2 s, natural decay | ✅ |
| Hazards | Laser hum (loop) | Steady electrical hum of a fluorescent tube, mid-pitch, close, constant level, seamless loop, 2 s | ✅ |
| Hazards | Laser blocked by soul | Water flicked onto a hot iron pan, a short sizzle and hiss, close, dry, 0.4 s | ✅ |
| Hazards | Spring | A heavy steel coil spring compressed and released, a twangy boing with a metallic rattle, close, dry, 0.5 s | ✅ |
| Hazards | Moving platform (loop) | A heavy wooden plank sliding on rope through a creaky wooden pulley, slow, medium distance, seamless loop, 2 s | ✅ |
| Walker | Scuttle (loop) | Small hard beetle legs clicking quickly across a dry wooden table, close, dry, seamless loop, 1 s | ✅ |
| Walker | Crushed | A walnut shell cracked under a boot heel, close, dry, 0.25 s | ✅ |
| Moth | Presence (loop) | Large soft wings slowly fanning, like a heavy silk sheet waved gently in a quiet room, medium distance, seamless loop, 3 s | ✅ |
| Moth | Wing-dust shot | A quick puff of fine flour blown from a palm, with a soft papery wing flap, close, dry, 0.4 s | ✅ |
| Moth | Scream | A wet finger rubbed hard on a large glass pane, a high squealing screech, slowed down, medium distance, 1.5 s | ✅ |
| Moth | Hit | A cushion struck hard with a flat palm, plus a puff of dust, close, dry, 0.3 s | ✅ |
| Moth | Defeat | A long fading screech, then large silk sheets fluttering to the ground and a soft dust settle, medium distance, 3 s | ✅ |
| Tree | Presence (loop) | Old tree trunks creaking and groaning slowly in a light wind, deep, medium distance, seamless loop, 4 s | ✅ |
| Tree | Branch swing | A heavy leafy branch swung fast through the air, a deep whoosh with leaves rustling, close, 0.6 s | ✅ |
| Tree | Slam | A large log dropped flat onto a stone floor, a deep heavy thud with a short crack of stone, close, 0.8 s | ✅ |
| Tree | Seed pod launch | A hollow wooden gourd thrown, a dull pop like a cork pulled from a big bottle, close, dry, 0.3 s | ✅ |
| Tree | Seed pod burst | A dry seed pod cracking open and hard seeds pattering onto stone, close, dry, 0.5 s | ✅ |
| Tree | Mask hit | A wooden mallet striking a thick stone slab, a solid knock with a short ring, close, dry, 0.4 s | ✅ |
| Tree | Defeat | A large tree trunk splitting with long crackling creaks, then a heavy stone mask falling and cracking on stone, medium distance, 3 s | ✅ |
| Stag | Presence (loop) | A large animal breathing slowly through its nose in cold night air, deep and calm, close, seamless loop, 3 s | ✅ |
| Stag | Charge | Heavy hooves galloping fast on hard earth, coming closer, close, dry, 1.5 s | ✅ |
| Stag | Beam | A thin steel wire stretched tight and bowed with a cello bow, a rising steady tone, close, 1.5 s | ✅ |
| Stag | Wave | Hooves stamping once hard on stone, then a rolling rush of air like a sudden gust through a doorway, medium distance, 1.2 s | ✅ |
| Stag | Hit | A thick wooden staff struck against a stag antler, a hard bony clack, close, dry, 0.3 s | ✅ |
| Stag | Defeat | A deep stag bellow fading into a long soft wind over an open hilltop, distant, 4 s, natural decay | ✅ |
| Dialogue | Blip, hero *(3 takes)* | A single soft tap of a fingertip on a wooden box, close, dry, 0.05 s | ✅ |
| Dialogue | Blip, ghost guide *(3 takes)* | A single light tap of a fingernail on a thin glass, a tiny high ring, close, dry, 0.08 s | ✅ |
| UI | Menu move | A small wooden bead sliding one step on an abacus rod, close, dry, 0.1 s | ✅ |
| UI | Menu select | A brass latch of a small wooden box clicking shut, close, dry, 0.2 s | ✅ |
| UI | Pause / unpause | A thick book closed gently on a table, a soft paper thump, close, dry, 0.3 s | ✅ |

### Music

Every track is a seamless loop except the ending. Instrumental only, no vocals. Trim at a phrase boundary with a
short crossfade; save as OGG or M4A, not MP3.

| For | Prompt | Done |
|---|---|---|
| Title | Instrumental, slow and calm, solo fingerpicked harp with soft sustained low strings and a faint music-box melody, D minor (Dorian feel), 70 BPM, 16 bars, gentle and a little melancholy, seamless loop, no intro, no fade-out, no ending, no vocals | ✅ |
| World 1: Forest edge | Instrumental ambient, soft harp arpeggios over warm sustained strings, light wooden flute phrases, no drums, misty and calm, A minor, 80 BPM, 32 bars, steady level throughout, seamless loop, no intro, no fade-out, no ending, no vocals | ✅ |
| World 2: Overgrown ruins | Instrumental ambient, harp and low cello with soft hand-drum pulse and a dulcimer, dusk feeling, slightly mysterious, E Dorian, 84 BPM, 32 bars, steady level throughout, seamless loop, no intro, no fade-out, no ending, no vocals | ✅ |
| World 3: Sanctum | Instrumental ambient, slow sustained strings and choir-like pad (no words), sparse harp notes and a soft low bell, moonlit and still, C minor, 66 BPM, 32 bars, steady level throughout, seamless loop, no intro, no fade-out, no ending, no vocals | ✅ |
| Shrine / dialogue (calm) | Instrumental, very quiet solo harp and a soft string pad, gentle and warm with a hint of playfulness, A minor, 72 BPM, 16 bars, no drums, seamless loop, no intro, no fade-out, no ending, no vocals | ✅ |
| Boss: great moth | Instrumental, driving harp ostinato with fast staccato strings and a light frame-drum beat, fluttering and anxious, A minor, 120 BPM, 32 bars, same energy throughout, seamless loop, no intro, no fade-out, no ending, no vocals | ✅ |
| Boss: tree guardian | Instrumental, heavy low cellos and double basses with deep taiko-style drums, harp and dulcimer riff on top, slow and stomping, E Phrygian, 100 BPM, 32 bars, same energy throughout, seamless loop, no intro, no fade-out, no ending, no vocals | ✅ |
| Boss: spectral stag | Instrumental, urgent strings and choir-like pad (no words), galloping frame drums, harp runs and a low bell on each phrase, grand but sad, C minor, 132 BPM, 32 bars, same energy throughout, seamless loop, no intro, no fade-out, no ending, no vocals | ✅ |
| Ending (not a loop) | Instrumental, solo harp theme from the title slowly joined by warm strings and flute, hopeful and quietly bittersweet, D major turning to D minor at the end, 70 BPM, about 2 minutes, a real ending with a soft final chord, no vocals | ✅ |

## Open questions

- **White ghost vs. the guide:** is the white ghost the guide (who is blue-white today), or a separate one-time vision?
- **Boss hurt:** painted pose or code flash? Code flash saves three sheets.
