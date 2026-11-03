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

Each boss image above is the **reference**. The animation sheets come from it (attach the approved reference). Sheets never have effects: dust, mist, glow and particles are added in code.

**Sheet rules (append to every sheet prompt):**
> Every frame faces LEFT with the head on the left side, exactly like the reference, never mirrored. All frames the same size and scale, clear magenta gaps between frames. No dust, no mist, no glow, no particles, no special effects: only the creature itself, with clean edges on flat magenta #FF00FF.

**Clean base (one per boss, before any sheet).** Attach the approved reference, wide 16:9:
> Using the attached creature exactly (same shapes, patterns and colors), paint it as a clean game sprite: a true side view in profile, facing left, in a neutral pose, the whole creature inside the frame with space around it. Do NOT include the reference image itself. No dust, no mist, no glow, no particles, no special effects: only the creature, with clean edges on flat magenta #FF00FF.

For the moth add: *"Hovering with wings raised, both wings visible, legs visible below the body."* Save as `moth-base.png`. **Every moth sheet below attaches `moth-base.png`, never `moth.png`.**

4. **Moth flying → `moth-fly.png`** (attach the approved `moth-base.png`, wide 16:9)
   > Using the attached moth exactly (same wings, patterns, eyespots, body and antennae), paint a flying animation sprite sheet: one horizontal row of 4 evenly spaced frames of a looping wing-flap while hovering. Frame 1: wings raised high above the body. Frames 2 and 4: identical, wings straight out horizontal. Frame 3: wings swept down below the body. The body is exactly the same in every frame: same size, same angle, same height, legs visible; only the wings move. No haze or smudges anywhere.

5. **Moth screaming:** no sheet. The scream reuses the flying frames (wings spread) with code sound-wave rings; the moth has no mouth to open.

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
