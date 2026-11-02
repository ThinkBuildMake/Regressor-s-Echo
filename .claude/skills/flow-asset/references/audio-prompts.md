# Prompting sound effects and music

How to write and check audio prompts for this game. The prompts themselves live in `docs/ASSETS.md` → Audio.
The tool isn't chosen yet, so keep prompts plain English that any text-to-audio tool can read.

## Sound effects

**Describe a real thing making a real sound.** Name four things:

1. **Source**: what makes the sound (a leather boot, a stone slab, a brass bowl).
2. **Material**: what it hits or rubs on (damp moss, old stone, glass).
3. **Action**: what happens (lands, scrapes, cracks, rings).
4. **Space and distance**: close or far, indoors or outdoors, dry or roomy.

Then add a **duration** ("0.3 s"). Example: *"wet leather boot landing on packed moss, close, dry, 0.3 s"*.

Rules:

- **One sound per prompt.** Need a pop and a scatter? Fine if they're one event; otherwise make two files.
- **No game jargon**: not "death sound", "power-up", "pickup", "UI click", "hit sound".
- **No genre words**: not "8-bit", "retro", "magical whoosh", "sci-fi", "epic", "cinematic". They give generic
  stock sounds. If it isn't something a microphone could record, rewrite it.
- **Fantastical events need a real analogue.** Ask: what real object would sound like this?
- **Variations**: for sounds that repeat a lot (footsteps, jumps, landings, dialogue blips), make 2–3 takes and
  pick one at random in game, so they don't get tiring.
- **Generate dry.** Ask for "dry", no reverb or echo. The game adds room sound per world if needed; baked-in
  reverb can't be removed.
- **Trim the start.** Cut silence before the sound so it lands on the frame of the event. Leave the natural
  tail but cut any noise after it.
- **Loops** (laser hum, walker scuttle, boss presence): add "constant level, seamless loop" and check the loop
  point like music (below).

### Before / after (from this game)

| Event | Bad prompt | Good prompt |
|---|---|---|
| Hero death burst | "arcade death explosion, pixels" | "a sharp camera-flash pop, then a handful of small glass beads scattering on a stone floor, close, dry, 0.8 s" |
| Soul appears | "ghostly magic appear sound" | "a soft breath blown across the rim of a wine glass, a faint airy hum that swells and settles, close, quiet, 1 s" |
| Release wind-up (W3) | "blue fire power charge" | "a gas burner igniting with a soft whump, then a steady flame roar building for 0.75 s, ending abruptly, close, dry" |
| Amulet awakening | "epic magical power-up" | "a large brass singing bowl struck softly with a felt mallet, long warm hum, close, 3 s, natural decay" |
| Moth scream | "monster scream" | "a wet finger rubbed hard on a large glass pane, a high squealing screech, slowed down, medium distance, 1.5 s" |
| Stag beam | "laser beam charging" | "a thin steel wire stretched tight and bowed with a cello bow, a rising steady tone, close, 1.5 s" |

## Music

Every track except the ending is a **seamless loop**. Loop rules:

- **Say it plainly**: "seamless loop, no intro, no fade-out, no ending".
- **State BPM and bar count** (e.g. "80 BPM, 32 bars") so the loop point lands on a bar line.
  Loop length in seconds = bars × 4 × 60 / BPM (32 bars at 80 BPM = 96 s).
- **One key or mode** for the whole track; name it.
- **Steady level throughout.** Avoid strong one-off moments (a big hit, a solo, a key change). They become
  obvious on the second pass.
- **Instrumental only**: "no vocals". For a choir sound, say "choir-like pad (no words)".
- **Same instrument family across the game.** Harp and strings are the thread; each world adds a colour (flute
  in W1, cello and dulcimer in W2, choir pad and bell in W3).
- **Boss loops** are the same world's family made more driving: faster BPM, a drum pulse, short repeated
  figures. They should feel like the world's track under pressure, not a different game.

### Checking and fixing the loop

1. Play the end into the start a few times. Listen for a click, a jump in volume, or a held note cut off.
2. If it doesn't loop cleanly, **trim at a phrase boundary** (the start of a bar where a phrase begins), using
   the BPM to find it, and add a **short crossfade** (20–50 ms) at the join.
3. If the tool gave an intro or fade-out anyway, cut them off and loop a clean middle section.
4. **Save as OGG or M4A, not MP3.** MP3 adds a small silent gap at the start and end, which you hear at
   every loop.

## Checking a result

Act as a critic before accepting a file:

- **Does it sound like the real thing?** Could a microphone have recorded it? Generic "game" sounds fail.
- **Does it fit the event?** Right length, right weight (a small beetle shouldn't sound like a boulder).
- **Is the start tight?** No silence or slow fade-in before the sound.
- **Clean ending?** No clipping (harsh crackle at the loudest part), no hiss or noise tail, no cut-off reverb.
- **Is it dry** (SFX)? No baked-in echo unless the prompt asked for distance.
- **Does the loop click?** Play it looping for 30 s. Any bump, gap or pop means trim again.
- **Does it sit with the others?** Play it next to the world's music and a couple of other effects. Too loud,
  too bright or too "cinematic" against the calm tone means redo or turn it down.
- **Mark it done** in `docs/ASSETS.md` only after it's in the game and heard at the real moment.
