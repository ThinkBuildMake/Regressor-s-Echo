# Asset Generation: Tools and Workflow

Research done Nov 1, 2026 by a research agent using web search. Some claims come from third-party sources; see "Not verified" at the end. Tool names, prices and limits change fast, so recheck anything that matters before paying.

## Picks

| Need | Pick | Runner-up |
|---|---|---|
| Painted backgrounds and textures | **Gemini app (Nano Banana 2 / Pro)**: already paid for if your Google One plan includes AI. Wide 21:9 images, accepts several reference images to keep the style consistent | **ChatGPT Plus image generation**: follows instructions better, good for edits |
| Bosses on transparent backgrounds | **ChatGPT / OpenAI image generation**: the only option with native transparency (confirmed in the API; the ChatGPT app is unconfirmed) | Gemini on a solid green background, then cut it out |
| Music | **Gemini Lyria 3 Pro**: already paid for if on AI Pro, tracks up to 3 minutes | **ElevenLabs Music**: commercial use clearly allowed on paid plans |
| Sound effects | **ElevenLabs Sound Effects, Starter plan ($6/month)**: about 150 effects/month, commercial license | **jsfxr / code-generated sounds**: free, but retro-sounding, so only for UI blips |

**First check:** which Google One plan you have. Basic ($1.99) has no AI. Google AI Plus ($9.99) and AI Pro ($19.99) do. See one.google.com or Gemini → Settings → Usage limits.

Only add Midjourney ($10–30/month, best painterly look and style matching, no transparency) if Gemini and ChatGPT visibly fail on consistency after a 1-hour test.

## Workflow for backgrounds and textures

1. **Make a style anchor first.** Spend about an hour getting one World 1 scene right. Write a fixed style block and use it in every prompt, e.g. *"painterly digital matte, soft edges, muted teal-green palette, gold accents, misty atmospheric depth, moonlight from upper left"*. Attach the anchor image as a reference every time.
2. **Make each layer separately.** Prompt each layer on its own, e.g. *"far tree silhouettes only, on solid #00FF00 background, no ground, no sky"*. Ask for 21:9 in Gemini or 3:1 in ChatGPT. Remove the green with a one-line ffmpeg or ImageMagick command (Claude can write it), or with rembg / Photopea. The sky layer fills the whole frame and needs no cutout.
3. **Make the same layer for all 3 worlds in one go**, with the same prompt and only the palette word changed (forest edge / ruins / sanctum). Doing one world at a time makes the worlds drift apart.
4. **Bosses:** ChatGPT with a transparent background, or the green-background method. Give them a faint glow edge to hide any green fringe.
5. **Seamless textures:** generate a 1024×1024 square (*"top-down moss texture, flat lighting, no shadows, tileable"*), shift the seam to the center (`magick in.png -roll +50%+50% out.png`), then fix the seam with an edit pass or Krita's wrap-around mode. Flat lighting is what makes tiling work.
6. **Web sizes:** layers 1920–2880 wide × 540–1080 tall. Bosses about 512–768 px. Textures 256–512 px. Save as WebP at quality 80 (supports transparency, and Phaser loads it). Keep total art under ~10 MB.
7. **Music:** prompt *"instrumental ambient, no drums, no vocals, slow harp and strings, loopable"*. Trim at a musical phrase with a short crossfade. Save loops as OGG or M4A, not MP3, because MP3 adds a small gap at the loop point.

## Pitfalls

- **Gemini watermark:** there may be a visible sparkle watermark in the corner. Check the setting, or crop it out.
- **Free plans usually exclude commercial use** (ElevenLabs Free, for example). Suno's free plan can no longer download, and Suno faces new lawsuits, so it isn't recommended.
- **Lyria's commercial terms are unclear.** Fine for a jam entry; use ElevenLabs music if the game is ever sold.
- **itch.io requires AI tags** ("AI Generated Graphics/Sounds") if you host there, or the game drops out of browse listings.
- **What makes AI art inconsistent:** changing prompt wording, mixing tools for the same kind of layer, different light directions, and highly detailed near layers next to soft far ones. Fix the light direction in the style block, and give all layers one final shared color grade.
- **Daily limits:** Gemini's limits change often and reset daily, so spread generation over two days.

## Not verified

- ChatGPT Plus image limits, and whether the ChatGPT app (not just the API) supports transparent backgrounds.
- Gemini's exact daily image limit (~100/day on Pro is a third-party figure) and whether it supports transparency.
- Ownership terms for Gemini images and Lyria music (Google's own terms weren't read).
- ElevenLabs' seamless-loop option for sound effects.

## Sources

- OpenAI image generation guide (fetched Nov 1, 2026): https://developers.openai.com/api/docs/guides/image-generation
- OpenAI changelog: https://developers.openai.com/api/docs/changelog
- Google One plans (fetched Nov 1, 2026): https://one.google.com/about/plans
- Gemini limits: https://support.google.com/gemini/answer/16275805
- Lyria 3 Pro limits per plan: https://www.androidauthority.com/gemini-lyria-3-pro-rollout-3652057
- ElevenLabs pricing (fetched Nov 1, 2026): https://elevenlabs.io/pricing
- Midjourney terms of service: https://docs.midjourney.com/docs/terms-of-service
- Suno licensing changes: https://propakistani.pk/2026/09/10/suno-launches-licensed-ai-music-models-after-warner-copyright-settlement/
- itch.io AI disclosure: https://80.lv/articles/asset-creators-on-itch-io-now-have-to-disclose-the-use-of-generative-ai/
