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

These are animated in code (floating, swaying, charging, squash and stretch), so one image per boss is enough.

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
