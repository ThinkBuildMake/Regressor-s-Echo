# Art Prompts: World 1 (Forest Edge)

Use **Gemini** (the app, Pro plan). This is the one-hour test: if these layers look like one painting, the painted style works.

## How to use

1. Make the **reference image** first. Regenerate until you like it, since every other image copies its look.
2. For every image after that: **attach the reference image**, then paste the **style block** followed by the specific prompt.
3. Save each result into `assets/raw/world1/` with the file name given below. I'll cut out the backgrounds, make the layers tile, and put them in the game.
4. Check the bottom-right corner for a sparkle watermark. If there is one, mention it and I'll crop it.

Why magenta, not green: the forest is green, so cutting out a green background would also eat the leaves. Magenta (#FF00FF) never appears in the scene.

## Style block (paste into every prompt)

> Hand-painted 2D game background, painterly digital matte painting, soft brush edges, no hard outlines. Muted teal-green and moss palette with soft warm light, gentle atmospheric mist and depth haze, low contrast. Light comes from the upper left. Calm, slightly melancholy mood. Side-on view for a 2D platformer, level horizon, no perspective tilt. No people, no animals, no text, no logo, no watermark, no border.

## 1. Reference image → `anchor.png`

> A quiet forest edge in the early morning. Tall old trees fading into mist, soft beams of light from the upper left, ferns and mossy roots in the foreground, distant layers of trees getting paler with distance. Wide 21:9 image.

## 2. Sky → `sky.png`

> Match the style, palette and lighting of the attached image exactly. Only the sky and distant glowing mist behind the forest: pale morning sky with soft wisps of cloud, warm glow in the upper left, fading to misty teal at the bottom. No trees. Fill the entire image. Wide 21:9.

## 3. Far trees → `far.png`

> Match the style, palette and lighting of the attached image exactly. Only a row of very distant tree silhouettes, pale and hazy, nearly lost in mist, low detail, spread evenly across the full width at similar heights. The bottoms of the trees fade into pale mist. Isolated on a flat solid magenta #FF00FF background. No sky, no ground. Wide 21:9.

## 4. Middle trees → `mid.png`

> Match the style, palette and lighting of the attached image exactly. Only a row of mid-distance forest trees: visible trunks and canopy shapes, medium detail, lighter and softer than a foreground would be, spaced across the full width. The bases of the trunks fade into mist. Isolated on a flat solid magenta #FF00FF background. No sky, no ground. Wide 21:9.

## 5. Near foliage → `near.png`

> Match the style, palette and lighting of the attached image exactly. Only close foreground foliage framing the edges: dark leafy branches and hanging moss along the top edge, and a few ferns and tall grass clumps along the bottom edge. The middle of the image is completely empty. Dark shapes with a soft rim of light from the upper left. Isolated on a flat solid magenta #FF00FF background. Wide 21:9.

The middle stays empty so foliage never covers the player or the puzzle.

## 6. Ground texture → `ground.png`

> Match the style and palette of the attached image. Seamless tileable texture: side-view cross-section of forest soil, dark earth with small roots and stones. Flat even lighting, no shadows, no horizon line, fills the whole square evenly. Square 1:1.

## 7. Moss edge → `moss.png`

> Match the style and palette of the attached image. A long horizontal strip of thick moss and short grass growing along the top of a ledge, side view, the same thickness all the way across so it can repeat left to right. Isolated on a flat solid magenta #FF00FF background above and below. Wide 21:9.

## Tips

- If a layer comes out too detailed or too dark, add *"lower contrast, softer, more mist"*. The background must stay calmer than the ground you play on.
- Keep the style block word for word. Changing the wording is the most common cause of mismatched images.
- Don't worry about layers repeating seamlessly. I'll fix the seams.
