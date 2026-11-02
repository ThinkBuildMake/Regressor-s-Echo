---
name: flow-asset
description: Make a game asset in Google Flow through Claude in Chrome — reference image, sprite sheet, sizing, then into the game for a playtest, with a separate critic at each art step. Use when the user asks to generate, make, or redo an asset (boss, enemy, hero pose, layer, portraits) with Flow.
---

# Flow asset pipeline

Prompts, style blocks, reference images and file names come from `docs/PROMPTS.md`. Never reword a style block; paste it word for word. If the asset isn't in PROMPTS.md yet, write its prompt there first (same style block, same format) and show the user before generating.

Flow project: **"Nov 01 - 18:56"** (https://flow.google.com/project/70e60ecc-3746-4c2e-baa5-c313da53e98f). Never create a new project.

## Steps

Each art step ends with **critic → user approves → save the raw**. Don't move on until the user approves.

1. **Reference image.** Generate the single sprite (character style block + its prompt, reference from PROMPTS.md attached). Effects (mist, dust, glow) are fine here: it's the look, not a game sprite. Critic. Save as `assets/raw/<folder>/<name>.jpg`.
2. **Clean base sprite.** Attach the approved reference and ask for the same creature as a clean game sprite: true side view facing the sheet direction, neutral pose, *"Do NOT include the reference image itself. No dust, no mist, no glow, no particles, no special effects: only the creature, clean edges on flat magenta #FF00FF, the whole creature inside the frame."* Critic (same creature? no effects? clean keying?). Save as `assets/raw/<folder>/<name>-base.jpg`.
   Why: sheets made straight from a misty reference copied the mist and even pasted the whole reference in behind the frames (moth, two failures). Skip this step only when the reference is already clean (e.g. the walker beetle).
3. **Sprite sheet.** Attach the approved **base sprite**, never the misty reference (⋮ → Add to prompt), ask for the animations the user wants: one row (or a grid) of evenly spaced, same-size frames, feet on one baseline, same character exactly, magenta background. Critic. Save as `assets/raw/<folder>/<name>-sheet.jpg`.
   - **Attach a shrunk base, not the full-size one.** Given a full-frame sprite, Flow pasted a giant copy of it behind the frames (moth, twice). Key the base onto pure magenta and pad it so the sprite is ~¼ of the width, then upload that (`<name>-base-small.jpg`) and say *"4 small moths, each the same size as the attached one, no large one anywhere"*:
     `node tools/art.mjs <base> s.webp --key --height=391 --bg=#ff00ff && sips -s format png s.webp --out s.png && sips --padToHeightWidth 1536 2752 --padColor FF00FF s.png && sips -s format jpeg s.png --out assets/raw/<folder>/<name>-base-small.jpg`
     Frames come out ~400 px wide at 2K, enough for a boss ~200 px on screen; upscale in Flow (2K/4K download) if a bigger sprite is needed.
   - **Generate the whole sheet in one shot.** Building frames one at a time by editing in the image chat was tried on the moth and rejected: Flow keeps poses too close to the source (wings barely move) and each edit carries the previous frame's artifacts forward.
   - **Spell out each frame's pose with angles** ("Frame 3: both wings pointing down at 45° below horizontal, tips below the legs"), and say *"all frames the same size as the attached sprite, wide gaps between frames, nothing touching"*.
   - **No effects on sheets.** The reference image may have mist, dust or glow (it's only a reference), but a sheet is the sprite alone: always add *"No dust, no mist, no glow, no particles, no special effects: only the creature itself, with clean edges on flat magenta."* Effects are added in code. The critic fails any sheet with effects painted in.
   - Draw one facing only; the game mirrors for the other direction. Always add *"Every frame faces LEFT/RIGHT with the head on that side, exactly like the reference, never mirrored"*: without it Flow mirrored 7 of 8 frames.
   - Flow may ignore the frame count/layout (asked 6 in a row, got a 4×2 grid). That's fine if the critic passes it: `sheet.mjs --frames=COLS --rows=ROWS`.
   - Small sprites (under ~40 px on screen): two alternating poses + a 1 px bob in code reads as walking. Tell the critic the on-screen size and don't chase six distinct poses; ask the user rather than regenerate a third time.
4. **Sizing.** Cut and scale:
   - sheets: `node tools/sheet.mjs <raw> assets/<folder>/<name>.webp --frames=N [--rows=R] --height=H [--normalize]`
   - flying/floating sprites, or any frame that hides the feet: crop the empty magenta band off first (`sips -c H W --cropOffset Y 0`), then cut equal cells with `--grid --frames=N`. Head/feet alignment jumps when a pose hides the feet (moth down-stroke: 65 px). Equal cells keep the model's own placement, which drifts sideways (moth: up to 24 px): measure a fixed body point (the eye) per frame on an enlarged view and line them up with `--shift=a,b,c,d`. Grid mode also drops a neighbour's wingtip that crosses into a cell.
   - single images / layers: `node tools/art.mjs <raw> assets/<folder>/<name>.webp --key --height=H`
   - Scale reference: the hero is 112 px tall (`assets/hero/*.json` frameHeight); layers are 1088 tall. Pick H so the asset reads right next to the hero, and say what you picked.
   Critic on the output (and on `<name>.json` frame data for sheets).
   - If the raw has a lavender/gradient band (often along the bottom), crop it off with `art.mjs --crop` first; the keyer expects flat magenta.
5. **Into the game.** Follow the walker in `game.js` (search `WALKER_FRAMES`): `this.load.image` in `preload`, cut the sheet into frames with `tex.add`, hide the hitbox rectangle (`setFillStyle(0, 0)`), attach an image scaled by `ON_SCREEN_HEIGHT / sheet.mjs --height`, origin at the feet, `setFlipX` for the mirrored direction, and destroy it with its owner. Run `npm test`.
   Playtest: `python3 -m http.server 8765` (background), open http://localhost:8765/ in a new tab, jump to a room with `javascript_tool`: `game.scene.getScene('room').scene.restart({ index: ROOMS.findIndex(r => r[0] === '<room name>') })` (the N key gets swallowed by dialogue). Zoom screenshots on the asset, then hand it to the user to play; adjust size/speed from their notes.

## Critic

Use the **`sprite-critic` agent** (`.claude/agents/sprite-critic.md`), fresh per art step, so it judges the image, not your intentions. Its checklist lives in that file; don't rewrite it in the prompt. Give it only: the **step** (reference / clean base / sheet / sized frames), the **file paths** (raw, keyed preview, and the approved image it must match), the **exact prompt used**, and the **game use** (on-screen size, fps, how it moves).

**Always run it on the sized game frames too** (the cut `.webp` the game loads), not only on the raw sheet. The moth passed review while drifting 24 px and carrying a neighbour's wingtip, because the critic only saw the raw sheet; the onion skin (`tools/onion.mjs`) it now makes from the cut frames shows both. Verify its main claim yourself before acting on it.

Generate **one** image per run. Show the user the image and the critic's verdict; they approve. On FAIL: if the image is mostly right (stray specks, haze, a color off), **edit it** instead of regenerating: attach that image and prompt *"Edit the attached image. Keep everything exactly as it is. Only make these changes: …"* (worked for the moth base). If it's wrong at the core (pose, layout, wrong creature), propose one prompt tweak and regenerate.

## Driving Flow (Claude in Chrome)

- **Reference already in the project:** ⋮ (or right-click) on the image → **Add to prompt**.
- **Reference from the repo, not yet in Flow:** "Upload media" opens a native file dialog you can't drive. Instead open the prompt's + ("Add ingredients") picker, then run this, then `find` the file input and `file_upload` the repo path:
  ```js
  const orig = HTMLInputElement.prototype.click;
  HTMLInputElement.prototype.click = function () { if (this.type === 'file') { if (!this.isConnected) { this.style.display = 'none'; document.body.appendChild(this); } HTMLInputElement.prototype.click = orig; return; } return orig.call(this); };
  [...document.querySelectorAll('button')].find(b => b.textContent.includes('Upload media')).click();
  ```
  Then select it in the picker → Add to prompt.
- **Prompt:** click the "What do you want to create?" box, type the style block + prompt, check the attached thumbnail is right, submit (→). Settings button next to → (shows "Nano Banana 2.1 ▭ xN"): model Nano Banana 2.1, count **x1**, aspect 1:1 for single sprites, 16:9 for sheets. Image gen costs 0 credits.
- **Wait:** ~30 s; new results appear top-left of All media.
- **Download:** right-click → `find` "Download" menuitem → click → `find` the **first** "Upscaled" menuitem (2K; the second is 4K, paid) → click. It lands in `~/Downloads` as `<Flow_title>_<hash>_2K.jpg` after ~10–20 s; `ls -t ~/Downloads | head` and `mv` it to the raw path.
- Don't trash or delete anything in Flow without asking.
