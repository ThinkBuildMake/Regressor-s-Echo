# Art Prompts

Use **AI Studio** with the **Nano Banana Pro** image model (included in your Google AI Pro plan), at **2K** resolution, 21:9. Not "Build": that writes an app instead of painting. Download as PNG if offered.

## How to use

1. Make the **reference image** first. Regenerate until you like it, since every other image copies its look.
2. For every image after that: **attach the reference image**, then paste the **style block** followed by the specific prompt.
3. Save each result into `assets/raw/world1/` with the file name given below (any image format is fine). I'll cut out the backgrounds, make the layers tile, and put them in the game.
4. Check the bottom-right corner for a sparkle watermark. If there is one, mention it and I'll crop it.

Why magenta, not green: the forest is green, so cutting out a green background would also eat the leaves. Magenta (#FF00FF) never appears in the scene.

## Style block (paste into every prompt)

> Hand-painted 2D game background, painterly digital matte painting, soft brush edges, no hard outlines. Muted teal-green and moss palette with soft warm light, gentle atmospheric mist and depth haze, low contrast. Soft, diffuse light comes from the upper left, shaping the forms gently. No visible light beams, sun rays or lens glow. Calm, slightly melancholy mood. Side-on view for a 2D platformer, level horizon, no perspective tilt. No people, no animals, no text, no logo, no watermark, no border.

## Lighting: what's painted vs. what's added in code

- **Painted into the images:** the light direction (upper left), soft shading and misty depth. This is what makes it look painted, and it matches the hero's rim light.
- **Added in code, not painted:** visible light beams and sun rays (they move and breathe), the glow of your souls and the amulet, and any per-room lighting changes. Painting beams in would double them up and freeze them in place.

## 1. Reference image → `anchor.png`

> A quiet forest edge in the early morning. Tall old trees fading into mist, soft diffuse light from the upper left, ferns and mossy roots in the foreground, distant layers of trees getting paler with distance. Wide 21:9 image.

## 2. Sky → `sky.png`

> Match the style, palette and lighting of the attached image exactly. Only the sky and distant glowing mist behind the forest: pale morning sky with soft wisps of cloud, warm glow in the upper left, fading to misty teal at the bottom. No trees. Fill the entire image. Wide 21:9.

## 3. Far trees → `far.png`

> Match the style, palette and lighting of the attached image exactly. Only a dense row of many small, very distant trees (at least 15), pale and hazy, nearly lost in mist, low detail, spread evenly across the full width at similar heights, each tree small in the frame. The trunks continue straight down to the bottom edge of the image with no fading. Isolated on a flat solid magenta #FF00FF background. Leave a little empty magenta space at the far left and right edges so the layer can repeat sideways. No sky, no ground. Wide 21:9.

## 4. Middle trees → `mid.png`

> Match the style, palette and lighting of the attached image exactly. Only a row of mid-distance forest trees: visible trunks and canopy shapes, medium detail, lighter and softer than a foreground would be, 6 to 8 trees spaced evenly across the full width. The trunks continue straight down to the bottom edge of the image with no fading. Isolated on a flat solid magenta #FF00FF background. Leave a little empty magenta space at the far left and right edges so the layer can repeat sideways. No sky, no ground. Wide 21:9.

## 5. Near foliage → `near.png`

> Match the style, palette and lighting of the attached image exactly. Only close foreground foliage framing the edges: dark leafy branches and hanging moss along the top edge, and a few ferns and tall grass clumps along the bottom edge. The middle of the image is completely empty. Dark shapes with a soft rim of light from the upper left. Isolated on a flat solid magenta #FF00FF background. Leave a little empty magenta space at the far left and right edges so the layer can repeat sideways. Wide 21:9.

The middle stays empty so foliage never covers the player or the puzzle.

## 6–8. Platforms: top lip, front face, end cap

Platforms are built from three painted pieces. The camera stays side-on, but the top lip shows the surface seen slightly from above, which gives the ground a sense of depth (the way Hollow Knight and Ori do it). Don't squash or tilt the whole platform.

### 6. Top lip → `lip.png`
> Match the style and palette of the attached image. A long horizontal strip for the top edge of a 2D platformer ledge: the mossy top surface of forest ground seen slightly from above (a thin, foreshortened band of moss, small plants and soil, lighter where the light from the upper left hits it), with moss, grass tufts and small roots spilling over the front edge. The same thickness all the way across so it can repeat left to right. Isolated on a flat solid magenta #FF00FF background above and below. Wide 21:9.

### 7. Front face → `ground.png`
> Match the style and palette of the attached image. Seamless tileable texture: the front face of a forest earth bank, seen straight on. Dark packed soil with roots, small stones and patches of moss, getting slightly darker toward the bottom. Even, soft lighting, no horizon line, no top edge, fills the whole square. Square 1:1.

### 8. End cap → `cap.png`
> Match the style and palette of the attached image. The left end of a 2D platformer forest ledge, side view: the rounded, mossy corner where the ground ends, with roots and moss curling over the edge and the earth face continuing down. The right side of the image is plain earth face so it can join the rest of the platform. Isolated on a flat solid magenta #FF00FF background. Square 1:1.

I mirror the end cap for right-hand ends.

## Worlds 2 and 3: same layers, different setting

**Preferred method (learned on World 2): re-dress the World 1 layer.** Attach the World 1 raw layer only (`assets/raw/world1/<layer>.jpg`) and edit: *"Edit the attached image. Keep the layout exactly as it is: the same shapes, positions, spacing, edges and magenta areas. Only change the setting: <the world's setting sentence>. Do not paint anything into the magenta areas."* Edits keep composition, so the layer keeps World 1's silhouettes, repeat margins and tiling, and the worlds line up. Fresh generations with the setting sentence tend to paint a whole scene or backdrop panels.
Add per layer: far *"as pale and low-contrast as the original"*; mid *"the gaps between trunks stay flat magenta"*; near *"keep the painted areas as sparse as the original"*; sky *"sky only, no silhouettes"*; ground tiles *"flat even lighting, no vignette or edge rim; keep the edges matching so it stays tileable"*. Flow outputs 16:9 while the World 1 layers are wider (2.36:1), so trees get re-spaced slightly.

Make each layer for all three worlds in one sitting (World 1 far trees, then World 2 far trees, then World 3), with the World 1 reference image attached each time. Keep the style block and layer prompt word for word, and add the world's setting sentence at the end. Save to `assets/raw/world2/` and `assets/raw/world3/` with the same file names.

- **World 2, Overgrown ruins:** *"Setting: overcast dusk among mossy grey stone ruins overgrown with vines, broken pillars and arches between the trees. Muted olive and slate palette with soft amber light from the upper left."*
- **World 3, Sanctum:** *"Setting: night in an ancient sanctuary deep in the forest, carved stone shrines and tall standing stones. Moonlit blue-violet palette with a pale silver glow. Light from the upper left."*

Keep gold and blue-white out of the backgrounds: gold is reserved for the amulet, and blue-white for your souls.

## Bosses (use ChatGPT for these)

ChatGPT can make transparent backgrounds. If it won't, use the magenta background instead. Save to `assets/raw/bosses/` as `moth.png`, `tree.png` and `stag.png`. Attach the World 1 reference image so the brushwork matches.

**Character style block (paste before each boss prompt):**

> Hand-painted 2D game boss art, painterly, soft brush edges, matching the attached misty painted forest. Side view, full body, facing left, centered with space around it. Isolated on a transparent background (if transparency isn't possible, a flat solid magenta #FF00FF background). No text, no ground, no shadow underneath. Do not use gold or bright blue-white anywhere.

1. **World 1, Great moth spirit → `moth.png`**
   > A huge ancient moth spirit, guardian of the forest edge. Broad soft wings patterned like bark and pale lichen, with large pale-green glowing eyespots, a fuzzy ash-grey body, long feathered antennae, faint luminous dust drifting off the wings. Wings spread wide, hovering. Majestic and eerie, not cute.

2. **World 2, Tree guardian → `tree.png`**
   > An ancient tree guardian rising out of overgrown stone ruins. A thick twisted trunk with a weathered stone mask set into it as a face, two long gnarled branch arms, roots spreading like legs, moss and vines hanging from it, faint pale-green light in the mask's eyes.

3. **World 3, Spectral stag → `stag.png`**
   > A spectral great stag, guardian of a moonlit forest sanctuary. Tall and translucent with a pale silver body, enormous branching antlers wrapped in faint violet light, mist streaming from its legs, head lowered as if about to charge.
   **Pose (user, 2026-11-02): proud and upright, not stalking.** Append: *"Standing tall and proud in side profile facing left, head raised high, chest out, neck upright, all four legs straight and planted, the great antlers held high. Majestic and still, not crouching or charging."*

Each boss image above is the **reference**. The animation sheets come from it (attach the approved reference). Sheets never have effects: dust, mist, glow and particles are added in code.

**Sheet rules (append to every sheet prompt):**
> Every frame faces LEFT with the head on the left side, exactly like the reference, never mirrored. All frames the same size and scale, clear magenta gaps between frames. No dust, no mist, no glow, no particles, no special effects: only the creature itself, with clean edges on flat magenta #FF00FF.

**Clean base (one per boss, before any sheet).** Attach the approved reference, wide 16:9:
> Using the attached creature exactly (same shapes, patterns and colors), paint it as a clean game sprite: a true side view in profile, facing left, in a neutral pose, the whole creature inside the frame with space around it. Do NOT include the reference image itself. No dust, no mist, no glow, no particles, no special effects: only the creature, with clean edges on flat magenta #FF00FF.

For the moth add: *"Hovering with wings raised, both wings visible, legs visible below the body."* Save as `moth-base.png`. **Every moth sheet below attaches `moth-base.png`, never `moth.png`.**

4. **Moth flying → `moth-fly.png`** (attach the approved `moth-base.png`, wide 16:9)
   > Using the attached moth exactly (same wings, patterns, eyespots, body and antennae), paint a flying animation sprite sheet: one horizontal row of 4 evenly spaced frames of a looping wing-flap while hovering. Frame 1: wings raised high above the body. Frames 2 and 4: identical, wings straight out horizontal. Frame 3: wings swept down below the body. The body is exactly the same in every frame: same size, same angle, same height, legs visible; only the wings move. No haze or smudges anywhere.

5. **Moth screaming:** no sheet. The scream reuses the flying frames (wings spread) with code sound-wave rings; the moth has no mouth to open.

### Tree guardian and stag sheets (from their clean bases)

Make each clean base first (the "Clean base" prompt above, attaching the approved reference), then attach the **shrunk** clean base for every sheet (skill: "Attach a shrunk base"). Each sheet: one row of 4 frames, the same creature and size in every frame, feet/roots on one baseline, facing LEFT, plus the sheet rules above.

**Tree guardian** (`tree-base.png`, then):
- `tree-intro.png`: 1 hunched low among the ruins, mask eyes dark; 2 the mask eyes open with pale-green light; 3 rising up, arms lifting; 4 standing at full height, arms spread wide.
- `tree-idle.png`: a slow sway: the body leans slightly left, upright, slightly right, upright; roots stay planted.
- `tree-swing.png` (redo, user: "a single arm swung down"): ONE branch arm only; the other arm stays still at its side. 1 the arm raised high above its head; 2 the arm coming down in front of it; 3 the arm swung all the way down, striking low in front of its roots; 4 the arm still low, recovering. A big overhead chop.
- `tree-slam.png`: 1 both arms raised high overhead; 2 arms coming down; 3 arms slammed into the ground in front; 4 arms on the ground, body leaning in.
- `tree-throw.png` (redo, user: "not throwing correctly"): 1 one branch arm reaches up into its own crown and its twig fingers close around a round seed pod (the pod clearly visible in the hand); 2 that arm cocked far back behind its body, pod in hand, body leaning back; 3 the arm whipping forward and up, the pod just leaving the open hand and flying ahead of it; 4 follow-through: the arm fully extended forward and low, hand open and empty, body leaning forward. Plus `seed-pod.png` (1:1): a single hard woody seed pod the size of a fist, on magenta.

**Spectral stag** (`stag-base.png`, then):
- `stag-intro.png`: 1 standing proud; 2 rearing back; 3 up on its hind legs, forelegs raised, antlers high; 4 coming down, forelegs about to land.
- `stag-idle.png`: standing proud; a slow breath and a small head toss across 4 frames, legs planted.
- `stag-walk.png`: a 4-frame walking loop, proud and unhurried, head held high, legs moving in a clear four-beat walk (each frame a clearly different leg position), body level. For moving between attacks.
- `stag-charge.png`: a 4-frame gallop loop, head lowered, antlers forward.
- `stag-beam.png` (redo, user: "just lean forward so the beam can come from its mouth"): legs stay planted in the same place in every frame. 1 standing proud; 2 leaning its body forward, neck stretching out level, head lowering; 3 fully leaning forward, neck and head stretched straight out in front, mouth open; 4 identical to 3, holding (the beam fires from the mouth in code).
- `stag-wave.png`: 1 rearing; 2 up on hind legs; 3 forelegs stamping down; 4 forelegs planted, head low (the wave is code).

**Spring (World 2)** → `spring-sheet.png` (attach the approved spring): 1 idle; 2 compressed low, cap pushed down; 3 fully extended, cap thrown up; (3 frames, same base position).

## Enemies (Flow, Nano Banana 2.1)

Save to `assets/raw/enemies/`. Attach the World 1 reference image (`anchor.png`) for the brushwork.

**Enemy style block (paste before each enemy prompt):**

> Hand-painted 2D game enemy sprite, painterly, soft brush edges, matching the attached misty painted forest. Side view, full body, facing left, centered with space around it, the whole creature inside the frame. Simple, readable silhouette that stands out against a green forest. Isolated on a flat solid magenta #FF00FF background. No text, no ground, no shadow underneath. Do not use gold or bright blue-white anywhere.

1. **Walker → `walker.png`**
   > A small hostile forest beetle about knee height to a person: a round, glossy deep-red shell with darker crimson markings, six short dark legs, a low blunt head with small curved mandibles, faint dull-orange glints on the shell edge. Squat and sturdy, clearly dangerous to touch, but small. Square 1:1.

2. **Walker sheet → `walker-sheet.png`** (attach the approved `walker.png`)
   > Using the attached creature exactly (same shell, colors, legs and proportions), paint a walking animation sprite sheet in one horizontal row of 6 evenly spaced frames, all the same size, all with feet on the same baseline, facing left: a looping six-legged scuttle cycle. Every frame faces LEFT with the head on the left side, exactly like the reference, never mirrored. The legs move in an alternating tripod gait with clearly different foot positions in each frame. Clear magenta gaps between frames. Wide 21:9.

## Props for the moth's entrance (Flow, Nano Banana 2.1)

On the earthquake the moth bursts through the arena wall. Save to `assets/raw/world1/`. Attach `ground.jpg` (the earth front face) so the material matches the wall, plus `anchor.png` for the brushwork. Wide 16:9, x1.

**Prop style block:**
> Hand-painted 2D game prop, painterly, soft brush edges, matching the attached forest earth texture exactly: dark packed soil with roots, small stones and patches of moss, soft light from the upper left. Side view. Isolated on a flat solid magenta #FF00FF background. No dust, no mist, no particles, no motion blur, no text, no ground line, no shadow.

1. **Rock chunks → `rocks.png`**
   > Six separate broken chunks of this earth bank, as if smashed out of a wall: three large, two medium, one small, each a chunky irregular lump of packed soil with a stone or two, a root end and a bit of moss on top. Arranged in two rows of three, every chunk well apart from the others with wide magenta gaps, none touching, none touching the image edges.

2. **Broken wall edge → `wall-break.png`**
   > A tall vertical strip of this earth bank's broken edge, as if something burst through it: a jagged, crumbled outline with snapped roots poking out, loose clods and a few stones on the break, darker inside the break. The left side is the clean solid earth face (so it joins the wall), the right side is the ragged broken edge. The strip fills the full height of the image so it can repeat top to bottom. Centered, about a quarter of the image wide.

## World 1 props (Flow, Nano Banana 2.1)

Save to `assets/raw/world1/`. Attach `anchor.png` (brushwork) and, for anything made of earth, `ground.jpg`. With `ground.jpg` attached, add *"no soil strip along the bottom, the prop floats on magenta"* (otherwise Flow paints one). One image per run, x1. Gold appears only on the amulet, its runes and the shrine's mark (the colour rule in IDEAS.md).

**World 1 prop style block:**
> Hand-painted 2D game prop for a misty forest platformer, painterly, soft brush edges, matching the attached painting: muted teal-green and moss palette, soft light from the upper left. Side view, level horizon. Isolated on a flat solid magenta #FF00FF background, the whole prop inside the frame with space around it. No dust, no mist, no glow effects, no particles, no text, no ground line, no shadow. Do not use bright blue-white anywhere. Do not include the attached painting itself.

1. **Shrine, dormant → `shrine.png`** (square 1:1)
   > A small ancient waystone shrine at the forest edge: a single weathered standing stone about chest height to a person, mossy at the base and the top, with one carved symbol on its face: a simple circular mark with three short rays, the grooves dark and empty. A few roots and ferns at its foot. Old, quiet, a little sacred.

2. **Shrine, activated → `shrine-lit.png`** (edit `shrine.png`, don't regenerate)
   > Edit the attached image. Keep everything exactly as it is. Only make this change: the carved symbol's grooves are filled with warm soft gold light, as if lit from inside. No glow spilling outside the grooves, no rays, no particles.

3. **Amulet → `amulet.png`** (square 1:1; attach `hero.jpg` too, for the amulet he wears)
   > A small round gold amulet on a short broken leather cord, lying flat, seen straight on, the same amulet the attached hero wears: a worn gold disc with the same carved circular mark with three short rays, and three small empty rune slots around the rim. Slightly tarnished, ancient. Centered, filling about half the frame.

4. **Amulet, runes lit → `amulet-rune1.png`, `amulet-rune2.png`, `amulet-rune3.png`** (edit each from the previous one)
   Flow paints the amulet with the central mark and **two** rim slots (at about 4 and 8 o'clock), so the three runes are: 1 = the central mark (World 1: it brings him back), 2 = the 8 o'clock slot (after the moth), 3 = the 4 o'clock slot (after the tree).
   > Edit the attached image. Keep everything exactly as it is. Only make this change: the carved central mark (the ring and its three rays) is filled with warm soft gold light. *(rune2, edit rune1: "…the small rune slot at the lower left (8 o'clock) is filled with a small warm gold-lit rune." rune3, edit rune2: same for the lower right (4 o'clock).)* No glow spilling outside the grooves, no rays, no particles.

5. **Spikes → `spikes.png`** (wide 16:9)
   > A long horizontal strip of sharp hazard spikes for a forest platformer: a row of dark, splintered, thorn-like wooden stakes and old iron points jutting up from a thin mossy base, evenly spaced, all the same height, clearly dangerous. The strip runs the full width of the image and is the same all the way across so it can repeat left to right.

6. **Spiky vine wall → `thorns.png`** (square 1:1)
   > A square tile of dense thorny bramble vines for a forest platformer hazard wall: tangled dark-green and brown vines covered in long sharp thorns, filling the whole square edge to edge so the tile can repeat in every direction, evenly dense, no gaps, no flowers. Clearly painful to touch.

7. **Vine barrier → `vine-barrier.png`** (tall 9:16)
   > A thick barrier of living woven vines blocking a doorway-sized gap: heavy twisted green vines and roots knotted tightly together from top to bottom, a few leaves, no thorns, the weave filling a tall rectangle that touches the top and bottom edges of the image. It looks like it could wither and pull apart.

8. **Pressure plate → `plate.png`, then `plate-down.png`** (wide 16:9; down = edit)
   > A flat ancient pressure plate set into mossy forest ground: a wide, low, square-edged slab of weathered grey stone with the same carved circular mark with three rays, raised a finger's width above a thin strip of soil, seen from the side and slightly above. *(Down: "Edit the attached image. Only change: the slab is pressed down flush with the soil.")*

9. **Root gate → `gate.png`** (tall 9:16)
   > A gate of interlocking thick old tree roots and a weathered wooden frame, closing a doorway-sized gap in an earth wall, roots woven like bars from top to bottom, touching the top and bottom edges of the image. Heavy, old, closed.

10. **White ghost → `ghost-white.png`** (square 1:1; attach `hero.jpg`)
   > The attached young treasure hunter as a ghostly apparition: exactly his face, hair, cloak, scarf and satchel, but his whole figure is pure soft white, like pale porcelain light, slightly see-through, no other colours. He floats in the air, body upright and relaxed, legs hanging loosely with toes pointed down, arms at his sides, facing right. Calm, eerie. No glow halo, no particles.

## World 2 and 3 props (Flow, Nano Banana 2.1)

Save to `assets/raw/world2/` and `assets/raw/world3/`. Use the World 1 prop style block (attach `anchor.png` for the brushwork) and add the world's setting sentence from "Worlds 2 and 3" above at the end. Gold only for amulet/rune marks; no bright blue-white.

1. **Laser emitter (World 2) → `laser.png`** (1:1)
   > A small ancient stone device mounted on a ruin wall: a squat carved block of mossy grey stone with a round opening in its face, a dull amber crystal set deep inside the opening, cracked and old. Side view, the opening facing right. The beam itself is not painted (it's drawn in code).

2. **Spring (World 2) → `spring.png`** (1:1)
   > A launch pad made of a thick, coiled living root wound tight like a spring under a flat round wooden cap, set into mossy stone ruins, clearly springy. Side view.

3. **Moving platform (World 2) → `platform.png`** (16:9)
   > A floating slab of carved grey ruin stone, wide and flat on top, broken and mossy at the edges, a few vines hanging from its underside, the top surface level. Side view, about four times as wide as it is tall.

4. **Stone slab gate (World 2) → `gate.png`** (9:16)
   > A tall, heavy slab of carved grey ruin stone closing a doorway-sized gap, faint old carvings on its face, moss and vines in the cracks, touching the top and bottom edges of the image.

5. **Shrine door (World 3) → `gate.png`** (9:16, World 3 setting sentence)
   > A tall carved stone door closing a doorway in an ancient sanctuary, standing-stone grey with deep carved bands and the ring-and-three-rays mark in the centre (grooves dark, not lit), touching the top and bottom edges of the image.

6. **Shrine, Worlds 2 and 3 → `shrine.png`, `shrine-lit.png`**: the World 1 shrine re-dressed for the world: attach `assets/raw/world1/shrine.jpg`, "Edit the attached image. Keep the stone's shape and carved mark exactly as they are. Only change its setting to match: <the world's setting sentence>." Then the lit version as an edit, as in World 1.

## Story scenes, Worlds 2 and 3 (Flow, Nano Banana 2.1; from the story chat)

Use the matching world's layer method or the World 1 prop style block, plus the world's setting sentence. Gold only for the amulet circles on the carving.

1. **Carved wall relief (World 2 §6) → `assets/raw/world2/carvings.png`** (16:9; re-dress `assets/raw/world2/mid.jpg`'s palette but a NEW composition, so generate fresh, attaching `world2/far.jpg` for palette)
   > A long weathered wall of grey ruin stone, carved with a shallow relief that reads left to right like a story: on the left a dense crowd of simple carved human figures standing together, each with a small round gold inlay on its chest; moving right, fewer figures; then a handful; at the far right a single figure standing alone. Moss and vines in the cracks, soft amber light from the upper left, calm and low-contrast like a background layer. The wall fills the whole image edge to edge. No text, no letters.

2. **Pyramid backdrop (World 3 §1) → `assets/raw/world3/pyramid.png`** (16:9; attach `world3/far.jpg` for palette)
   > A far background layer: a colossal stepped stone pyramid rising out of the moonlit forest far away, so tall its upper half disappears into a thick bank of cloud, pale and hazy with distance, blue-violet and silver, low contrast. Only the pyramid and the cloud bank around its top; everything else flat solid magenta #FF00FF, including the sky. Centered, the base wide, running to the bottom edge.

3. **The old tree (World 3 §5) → `assets/raw/world3/old-tree.png`** (9:16; World 1 prop style block + World 3 setting; attach `anchor.png`)
   > A single enormous, ancient forest tree with a thick gnarled trunk and great roots, the roots forming a dark hollow at its base big enough to hide a folded letter behind, moss and a few hanging vines, its canopy running off the top of the image. Calm and a little sacred. The trunk and roots stand on flat magenta (no ground strip).

4. **The guide's note (World 3 §9) → `assets/raw/world3/note.png`** (16:9; World 1 prop style block + World 3 setting; attach `world3/ground.jpg` for the earth)
   The note is NOT on paper: the guide wrote it in the dirt behind the old tree. The painting is the blank ground; the game scratches the words into it.
   > A patch of bare forest earth seen from above at a low angle, smoothed flat as if brushed clean by a hand, roughly oval, framed by moss, roots and fallen leaves around its edges. The smoothed dirt in the middle is completely blank, with room for several lines of writing scratched into it with a stick (the writing is added in code). Moonlit, soft. No text, no letters, no marks in the smoothed area. Isolated on flat magenta, no soil strip along the bottom.

## Batch 3: fallen bosses, new enemies and hazards, World 2/3 hazard variants (Flow, Nano Banana 2.1)

Enemy colour language: enemies are red (the walker beetle), so new enemies share its glossy deep-red shell. Hazards stay in each world's palette. Same skill rules as before (shrunk base for sheets, one-shot sheets, no effects, facing LEFT, mirror back if Flow flips frames).

**Fallen bosses** (one image each, attach the boss's shrunk clean base; the dissolve into light is code):
- `moth-fallen.png`: "The attached moth fallen to the ground and lying still, body resting on the ground, both wings drooped and spread flat on either side, antennae limp, eyespots dull. Same moth, same size."
- `tree-fallen.png`: "The attached tree guardian slumped forward and collapsed, its trunk bent low, branch arms hanging limp to the ground, the stone mask's eyes dark. Same tree, same size."
- `stag-fallen.png`: "The attached stag lying down, all four legs folded beneath it, head lowered to the ground, antlers resting, still. Same stag, same size."

**Flyer** (`assets/raw/enemies/flyer.png`, then a sheet; enemy style block + attach the walker `walker.jpg` for the red shell):
> A small hostile flying forest beetle, the same family as the attached red beetle: a round glossy deep-red shell split open with two pairs of fast dark translucent wings, short dangling legs, small mandibles, about the size of a crow. Hovering in profile, facing left.
- `flyer-sheet.png` (attach the shrunk flyer): a 4-frame wing-buzz loop, wings up / mid / down / mid, body still.

**Thrower** (`assets/raw/enemies/thrower.png`, then a sheet; enemy style block + attach `walker.jpg`):
> A squat hostile forest creature that stays rooted in place: a stout red toadstool with a glossy deep-red cap speckled darker crimson, a thick pale stem with a small dark mouth hole facing left, little root feet gripping the ground. It spits hard seeds. Knee height to a person, side view facing left.
- `thrower-sheet.png` (attach the shrunk thrower): 1 idle; 2 the cap puffs up, mouth drawn back; 3 the mouth thrusts forward (spitting); 4 recoil back to idle. Plus `seed-shot.png` (1:1): one small hard dark seed pellet, on magenta.

**Saw blade** (`assets/raw/world1/saw.png`, 1:1; World 1 prop style block, attach `anchor.png`):
> An old round iron saw blade seen flat-on, a perfect circle with jagged teeth around the edge, rust, scratches and a few strands of moss, a square hole at the centre. Clearly dangerous. The whole disc inside the frame. (Spun in code.)

**Crumbling block** (`assets/raw/world1/crumble.png`, 1:1; World 1 prop style block, attach `ground.jpg` + `anchor.png`):
> One square block of packed forest earth with roots and a mossy top, like a single tile of the ledges, with a few hairline cracks. The whole block inside the frame, no soil strip below it.
- `crumble-cracked.png`: edit: "...Only make this change: the block is split by deep cracks, chunks loosening at the edges."
- `crumble-breaking.png`: edit of cracked: "...Only make this change: the block is breaking apart into separate chunks with gaps between them."

**Falling spike** (`assets/raw/world1/falling-spike.png`, 9:16; World 1 prop style block, attach `anchor.png`):
> One long, sharp, hanging thorn spike of hard dark wood with a mossy root clump at its top where it hangs from a ceiling, pointing straight down. The whole spike inside the frame. (It shakes and drops in code.)

**World 2 and 3 hazard variants** (re-dress edits of the World 1 images, like the shrines; one per world): attach the World 1 image only and "Edit the attached image. Keep the shape, size, layout and edges exactly as they are. Only change the setting and materials to match: <the world's setting sentence>." Keep the mark on the plate as three rays above the ring, nothing below the circle. Files to `assets/raw/world2/` and `assets/raw/world3/`: `spikes`, `thorns` (World 2: thorny ruin vines; World 3: thorny dark-violet brambles), `plate`, `vine-barrier`, and the saw, crumble set and falling spike (World 2: rusted ruin metal and grey stone; World 3: carved dark stone).

## Batch 4: enemies per world (Flow, Nano Banana 2.1)

One new enemy per world (see LEVELS.md "Enemies per world"). All red, the walker's palette family (glossy deep red, darker crimson, faint dull-orange glints), no gold, no bright blue-white, no effects. Each belongs to its world through its shape and materials, but its body is red. Reference: enemy style block + attach `walker.jpg` + `anchor.png` + the prompt + "Do not include the attached images themselves." Then a shrunk base (`<name>-small.jpg`), and the sheet from the shrunk base only, with "N small creatures, each the same size as the attached one, no large one anywhere; big, clearly different poses." Same sheet rules as Batch 3 (one-shot, facing LEFT, mirror back if Flow flips frames).

**Bramble spider, World 1** (`assets/raw/enemies/bramble-spider.png`; the thread is drawn in code, so no thread is painted):
> A small hostile forest spider, the same family as the attached red beetle: a round glossy deep-red body with darker crimson markings and a few bramble-like thorny bristles, eight long thin dark legs splayed out, small mandibles. Hanging upside-down in the air as if from a thread, back toward the bottom, legs splayed, seen from the side. No thread, no web, nothing above it: the spider alone. About the size of a hand.
- `bramble-spider-sheet.png` (attach the shrunk spider): 4 frames: 1 hang, legs tucked in close to the body; 2 shake, legs thrown straight out; 3 drop, legs spread wide, body tilted head-down 30°; 4 climb, legs reaching up above the body.

**Idol slider, World 2** (`assets/raw/enemies/idol-slider.png`):
> A small hostile creature from the overgrown ruins: a chunky block of red carved ruin stone, glossy deep red with darker crimson cracks and chips, a worn carved face on its front (left) side, sitting on 4 to 6 short dark crab legs underneath. Squat and heavy, knee height to a person. Side view facing left.
- `idol-slider-sheet.png` (attach the shrunk slider): 3 frames: 1 still, legs folded under, the block resting on the ground; 2 scuttle A, front legs reaching forward, back legs pushing back; 3 scuttle B, front legs pulled back, back legs forward. The block stays level in every frame.

**Reliquary scarab, World 3** (`assets/raw/enemies/reliquary-scarab.png`):
> A small hostile scarab from a moonlit sanctum: very flat and wide, a low flat shell like a carved shield, about three times as long as it is tall, NOT round or domed like the attached beetle (only its red colours are shared). A hard glossy deep-red shell with faint carved sanctum patterns (thin engraved lines and circles, darker crimson) on it, a broad flat shovel-shaped head with small horns, six short dark legs. Low to the ground, knee height to a person. True side view facing left, coin profile, only one eye visible, near legs overlapping far legs.
  (First try without the "NOT domed" line came out a tall domed beetle, a copy of the walker.)
- `reliquary-scarab-sheet.png` (attach the shrunk scarab): 4 frames: 1 walk A, near front leg far forward, near back leg far back; 2 walk B, all near legs gathered straight down; 3 walk C, near front leg lifted high and bent, middle back, back leg forward; body level in 1–3; 4 fall, body tipped back 30°, belly showing, all six legs flung out and UP like a starfish. Say "all four heads point to the left edge of the image": the first try mirrored frame 3 and let the fall legs dangle.

## Menus and UI (Flow, Nano Banana 2.1)
Stills, not sprites, so painted light and mist are fine in the two 16:9 paintings. Attach anchor.png for style; attach the hero reference for the hero; attach the amulet raw for the mark. Colour rules still hold: gold only on the amulet and its mark, bright blue-white only for souls.
- **title** (16:9): [style block] The hero seen from behind and slightly to the side, standing small on a mossy rise at the edge of the dark forest at dusk, scarf and cape lifting in the wind, looking across a misty valley to a huge stepped pyramid far away, its top lost in cloud. Soft cold light, a faint warm glint at his chest. The left third is quiet sky and mist with nothing in it (room for the logo). No text.
- **logo** (16:9, keyed): The words "Regressor's Echo" in elegant hand-painted serif lettering, pale cream with soft dark edges, slightly weathered like carved and painted wood, on one line, centred; the amulet mark (a ring with three short rays above it, nothing below the circle) small and gold above the words. Flat solid magenta #FF00FF background, nothing else. Spell it exactly: Regressor's Echo.
- **ending** (16:9): [style block] At dawn, the hero tiny at the foot of the huge stepped pyramid, standing before its tall dark doorway, the forest behind him, warm first light on the stone steps and mist below. Calm and hopeful. No text.
- **mark** (1:1, keyed): Only the amulet's mark, painted as a small gold emblem: a ring with three short rays above it, nothing below the circle, from the attached amulet. Centred, filling most of the frame, flat solid magenta #FF00FF background.
- **soul-pip** (1:1, keyed): Two small round icons side by side with a wide magenta gap: left, a full soul (a soft bright blue-white flame inside a thin dark ring); right, an empty one (the same dark ring, empty and dim). Flat solid magenta #FF00FF background, no glow outside the rings.
- **panel** (16:9, keyed): [style block] A plain grey carved stone box seen straight on, like a slab of old temple masonry with a thin chiselled border and slightly chipped corners, filling most of the frame; the centre is a plain, even, flat grey stone surface with no carving (so it can stretch). Cool grey, a little moss in the border cracks only. Flat solid magenta #FF00FF background around it.
- **button** (16:9, keyed): [style block] Two wide flat grey stone buttons side by side with a wide magenta gap, each a short rectangular slab with bevelled chiselled edges, seen straight on, blank (no text, no symbols). Left: normal, plain grey stone. Right: the same slab, highlighted: slightly lighter and raised, with a thin warm pale-cream line glowing in the chiselled groove around its edge (not gold). Flat solid magenta #FF00FF background.

## Hero (AI Studio, Nano Banana Pro)

Save to `assets/raw/hero/`. Attach the World 1 reference image for the brushwork, and from step 2 on, also attach the hero image from step 1.

**Hero style block (paste before each hero prompt):**

> Hand-painted 2D game character, painterly, soft brush edges, matching the attached forest painting. A young treasure hunter in the spirit of a forest outlaw: tousled blond hair, a friendly determined face, a deep forest-green hooded cloak worn with the hood down (darker than the trees in the background), a long wavy red scarf that flows behind him, a brown leather jerkin, a worn leather satchel on a strap across the chest, a small gold amulet on the chest, slim build, leather boots. No sword, no bow, no pointed cap. Simple, readable silhouette. Side view facing right. Isolated on a flat solid magenta #FF00FF background. No text, no ground, no shadow. Do not use bright blue-white anywhere.

1. **The hero → `hero.png`**
   > Full body, standing in a relaxed neutral pose, arms at his sides. Square 1:1, centered, the character filling about 80% of the height.

   Regenerate until you love him. Every later image copies this one.

2. **Sprite sheet → `sheet.png`**
   > Using the attached character exactly (same proportions, hair, colors, scarf and satchel), paint an animation sprite sheet in one horizontal row of 8 evenly spaced frames, all the same size, all with feet on the same baseline: frames 1–6 a running cycle, frame 7 jumping upward with legs tucked, frame 8 falling with the cloak and scarf lifted. Wide 21:9.

3. **Slide → `slide.png`**
   > Using the attached character exactly, paint him sliding feet first along the ground, body low and leaning back, one leg extended forward, scarf and cloak streaming behind him. Wide 21:9, character centered.

5. **Idle → `idle-sheet.png`** (wide 16:9; attach the shrunk hero, see the skill; one-shot sheet)
   > Using the attached character exactly (same proportions, hair, colours, scarf, cloak and satchel), paint an idle animation sprite sheet: one horizontal row of 4 evenly spaced frames, all the same size, on flat magenta. He stands still in the same relaxed pose in every frame, feet planted in exactly the same place, body and head unchanged; only his hair, his long red scarf and the hem of his cloak sway gently in a breeze, a little differently in each frame so it loops. Facing right. Same character size in every frame, wide magenta gaps, nothing touching, no effects.

4. **Wall slide → `wall-slide.png`** (wide 16:9, attach `hero.jpg`; one-shot sheet, follow the sheet rules in the skill)
   > Using the attached character exactly (same proportions, hair, colours, scarf and satchel), paint a wall-slide sprite sheet in one horizontal row of 4 evenly spaced frames, all the same size, on flat magenta: frames 1–3 he clings to a vertical wall on his right with one hand and the sole of one boot, body turned out to the left, knees bent, sliding down, his scarf and cloak lifted upward by the slide (slightly different in each frame so it flutters); frame 4 he kicks off the wall, pushing away up and to the left, arms out. Do not paint the wall itself. Every frame the same character size, nothing touching, no effects.

**Fallback, if the frames don't match each other → `parts.png`:**
   > Using the attached character exactly, paint the same character separated into parts for cut-out animation, each part apart from the others: head with blond hair, torso with cloak front, back cloak flap, scarf tail, left arm, right arm, left leg with boot, right leg with boot, satchel. Same scale and colors as the attached image. Wide 21:9.

## Dialogue portraits (AI Studio, Nano Banana Pro)

One image per character with every expression in a grid, so the face stays consistent. I slice the grid into separate portraits. Save to `assets/raw/portraits/`. Attach `hero.png` (and the World 1 reference for the brushwork).

**Portrait style block:**

> Hand-painted character portrait for a 2D game's dialogue box, painterly, soft brush edges, matching the attached character exactly (same face, hair and clothing). Head and shoulders, three-quarter view facing right, the same framing, size and position in every cell. Soft light from the upper left. Each cell isolated on a flat solid magenta #FF00FF background, with clear magenta gaps between cells. No text, no labels, no borders.

1. **Hero → `hero-faces.png`**
   > An expression sheet of the attached young treasure hunter (blond, deep green cloak, wavy red scarf, gold amulet), 8 portraits in a grid of 4 columns and 2 rows, in this order: 1. calm neutral; 2. startled and confused; 3. in pain, wincing, shaken; 4. exhausted and numb, eyes heavy; 5. determined, jaw set; 6. relieved, a soft tired smile; 7. thinking, hand on chin, glancing up; 8. sad, eyes cast down. Wide 2:1.

2. **The guide (his ghost from another timeline) → `guide-faces.png`**
   > An expression sheet of the ghost of the attached young treasure hunter, from a timeline where he has died countless times. Every death sent him back in time, so he looks exactly the same as the attached character: the same age, face, blond hair, green cloak, wavy red scarf and gold amulet, with no scars or wear. The only differences: his whole figure is a translucent blue-white ghost with a faint soft glow, the same blue-white as a soul, and his eyes are tired, knowing and slightly hollow, the look of someone who has seen this all before. 8 portraits in a grid of 4 columns and 2 rows, in this order: 1. wry and knowing, half smile; 2. amused; 3. solemn; 4. quietly sad; 5. weary, eyes down; 6. skeptical, one eye narrowed, hand at his jaw; 7. thinking, hand at his jaw; 8. warm and encouraging smile. Wide 2:1. (He's mirrored in the game to face the hero.)

3. **Hero, extra faces → `hero-faces-2.png`** (same style block, attach `hero.png`)
   > An expression sheet of the attached young treasure hunter (blond, deep green cloak, wavy red scarf, gold amulet), 6 portraits in a grid of 3 columns and 2 rows, in this order: 1. curious, one eyebrow raised, intrigued; 2. annoyed, a flat unimpressed look; 3. excited, a wide greedy grin, eyes lit up; 4. scared, eyes wide, leaning back; 5. shouting in pain, mouth wide open, eyes squeezed shut; 6. a cocky, confident smirk. Wide 3:2.

4. **The guide, extra faces → `guide-faces-2.png`** (same style block, attach the guide sheet so the ghost look matches)
   > An expression sheet of the attached translucent blue-white ghost (the same character, playful and mischievous), 6 portraits in a grid of 3 columns and 2 rows, in this order: 1. a smug grin; 2. mischievous, a scheming grin with narrowed eyes; 3. teasing, a playful wink; 4. exasperated, rolling his eyes; 5. a serious warning, stern, no smile; 6. genuinely surprised, eyes wide. Wide 3:2.

## Drawn in code

The souls (the hero's frames tinted blue, with flames), the ghost guide, light beams and glows.

## Processing (done by Claude)

`node tools/art.mjs <raw> <out.webp> [--key] [--mirror]` removes the magenta (with soft edges and no pink fringe), scales to the game's size and saves WebP into `assets/world1/`. Don't fade anything into the magenta yourself; the game adds mist at the bottom of each layer, so trunks should simply run to the bottom edge.

## Tips

- If a layer comes out too detailed or too dark, add *"lower contrast, softer, more mist"*. The background must stay calmer than the ground you play on.
- Keep the style block word for word. Changing the wording is the most common cause of mismatched images.
- Don't worry about layers repeating seamlessly. I'll fix the seams.
