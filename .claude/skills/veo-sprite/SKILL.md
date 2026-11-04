---
name: veo-sprite
description: Animate a game sprite with Google Flow's Veo video (through Claude in Chrome), then turn one loop of the video into a keyed, aligned sprite sheet that drops into the game in place of an existing sheet. Use for any animation with real motion, such as walks, gallops, wingbeats, idles or attacks, especially four-legged gaits that image models get wrong, or when the user asks to redo a sprite animation "like the stag walk" or "with Veo".
---

# Veo sprite animation

Image models paint each frame separately, so they can't keep a gait straight (they swap near and far legs and repeat poses). Video models move a body through time, so the motion is consistent. The approach: animate the creature's clean painted base in Veo on flat magenta, find one seamless loop in the video, cut frames from it, key and align them, colour-match them to the painting, and fit them into the existing sheet's cells.

It was proven on the stag walk on 2026-11-04 (`assets/bosses/stag-walk.webp`, 12 frames, a true four-beat walk). The source video is `assets/raw/bosses/stag-walk.mp4`.

Read `.claude/skills/flow-asset/SKILL.md` "Driving Flow" first. It covers uploads, the picker, submitting exactly once, downloads and never deleting anything in Flow. The critic checklist is in `.claude/agents/sprite-critic.md`.

## 1. Start frame
- Use the creature's **clean base** (no effects) from `assets/raw/<kind>/<name>-base.jpg`, or the cleanest standing frame of its current sheet.
- Key the base onto flat magenta #FF00FF at 16:9, with the creature about **65% of the frame height**, centred.
- Save it in the scratchpad, because `file_upload` only accepts scratchpad files.
- If the creature is too small (about 45% of the height), Veo smears its moving legs.

## 2. Generate in Flow
- Use Flow's video mode with **Frames** (start frame) and **Veo 3.1 Fast**. It costs 20 credits a take; read the cost and balance in the UI and log them. Allow at most 2 takes per sheet.
- The prompt is the creature's description plus the motion and the fixed rules:
  > Locked-off static camera, pure side view, flat solid magenta background that never changes. The <creature> <motion> in place, like on a treadmill, <gait detail>. Body level, stays in the centre of the frame and does not change size. Solid legs, no motion blur. No camera movement, no ground, no shadows, no particles, no glow, no other objects.
- Gait details that worked or will help:
  - **Walk:** "a calm natural four-beat walk: one hoof lifts at a time, left hind, left fore, right hind, right fore".
  - **Gallop:** "a real gallop, head lowered".
  - **Wings:** "hovering in place, slow powerful wingbeats, body steady".
  - **Attacks:** describe the wind-up, the strike and the recovery, in order.
- Download the **1080p** version (free) to `assets/raw/<kind>/<name>.mp4`. That video is the raw file for the sheet.

## 3. Video → sheet (all local)
```sh
mkdir -p <scratch>/f && ffmpeg -i <name>.mp4 -vf fps=24 <scratch>/f/%03d.png
node tools/video-loop.mjs <name>.mp4 [minLen] [maxLen]        # best loop windows: first=… next=…
node tools/video-frames.mjs <scratch>/f <scratch>/native <first> <next> 12 [--anchor=feet|fixed] [--mirror] [--rot=k]
node tools/colormatch.mjs <scratch>/native.png <painted keyed sheet of the same creature>.webp <scratch>/cm.png
node tools/video-fit.mjs <scratch>/cm.png 12 assets/<kind>/<current sheet>.webp <scratch>/<name> [--match=i:j]
tools/sheet-gif.sh <scratch>/<name>.png <frameWidth> 12 <scratch>/<name>.gif
node tools/onion.mjs <scratch>/<name>.webp 12 <scratch>/onion.png
```
- **video-loop:** it finds the window whose last frame best matches its first. For a walk, check that the window is one full stride, where the same foot lifts again. A half stride also scores well, but it swaps the sides.
  - Set the length range to the motion: a walk stride ran 35–37 frames at 24 fps; wingbeats are much shorter.
- **video-frames:** it keys the background (video shifts the magenta, so it keys on the median border colour) and lays the frames into one sheet.
  - Use `--anchor=feet` for anything standing: one shared ground line, so a lifted foot can't bob the body. Use `--anchor=fixed` for flying or hanging things: the locked camera already holds them still, and aligning on their outline makes the body jump as the wings move (moth, 2026-11-04).
  - `--mirror` flips the result to face left. `--rot=k` starts the loop on frame k.
- **colormatch:** video tints white and pale colours towards lavender. This shifts the colours to match the painting, then removes leftover pink without turning dark areas green.
  - The reference must be a **keyed** painted sheet (.webp with transparency), not a JPG on magenta.
  - For warm or neutral creatures, add `--blue-cap=6` if thin parts such as antennae turn vivid blue. Leave it off for cool-white creatures like the stag.
- **video-fit:** it scales and places the creature so its height and position match the current sheet's cells. The result drops in with no code change.
  - When the new motion is bigger than the old (a wider wingbeat), size by one matching pose with `--match=i:j` (source frame i to target frame j, e.g. wings up), or the creature comes out too small. The fit always keeps every frame inside the cell, shrinking or shifting if it has to.
- **Start frame for a hard pose:** if take 1 drifts out of the pose you need (the stag's charge lifted its head), start take 2 from a frame of the current sheet in that pose instead of the base.
- **Leave room for the motion:** a big wingbeat clipped the frame edge at 65% height; the moth needed about 36%, placed higher.
- 12 frames is smooth; 8 is lighter but choppier.
- Sheets have no frame limit. `art.mjs` scales to 1088 px by default, so pass `--height` whenever you re-encode with it.

## 4. Check, then swap
- **Onion skin:** one body (no sideways drift over 3 px). Hooves or feet sit on one line, and nothing is clipped at the cell edges.
- **Gait:** write down, frame by frame, which foot is up. A real walk often has only a diagonal pair of feet down; it doesn't need three down. That's from Muybridge's plate 574, "Hansel walking, free".
- **Same creature:** same colours as the painting, no pink or green cast, clean edges.
- **Seamless loop:** play the GIF.
- Show the user the GIF or a review page next to the current sheet. Only after they pick:
  - copy the new sheet over `assets/<kind>/<name>.webp` and its `.json`
  - add the source video as the raw file
  - commit only your own files.

## Game notes
- **Boss sheets** (`game.js`, the boss art pose code) count frames from the image width, so any frame count drops in.
- **Fixed frame lists:** the walker (`WALKER_FRAMES`) and the moth's flight (`MOTH_FRAMES`) use them. A sheet with a new frame count needs a one-line change there; that's code-chat work, so flag it.
- **Moving creatures:** the game should move them at the speed their planted feet slide back, or the feet skate. The stag walk is about 13 px of cell width per frame.

## Fallback
If Veo can't hold the creature or the motion after 2 takes, use the cut-out rig. Split the painted base into a body and four legs, then drive the legs with walk math. The worked example is `references/stag-rig.mjs` (stag polygons and pivots as data), and `tools/gait-guide.mjs` has the gait phases. The rig is exact but stiffer.
