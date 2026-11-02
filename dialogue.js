// Dialogue: a panel at the top of the screen, the hero's portrait on the left and the guide's on the
// right, a name, and text that types out. Space, Enter or E continues (pressing early shows the whole
// line). While it's open the hero can't move. Each script plays once per session.
//
// Portraits: assets/portraits/hero.webp and guide.webp (8 faces each), cut from the expression
// sheets with: node tools/sheet.mjs <sheet> assets/portraits/hero.webp --grid --frames=4 --rows=2 --height=192
// (same for the guide). Until they exist, a placeholder circle shows the face's name.

const FACES = {
  hero: ['neutral', 'startled', 'pained', 'exhausted', 'determined', 'relieved', 'thinking', 'sad'],
  guide: ['wry', 'amused', 'solemn', 'sad', 'weary', 'skeptical', 'thinking', 'warm'], // painted facing right; mirrored
};
// Second expression sheets (assets/portraits/hero2.webp, guide2.webp). Until they exist, each of
// these faces borrows the closest face from the first sheet.
const FACES2 = {
  hero: ['curious', 'annoyed', 'excited', 'scared', 'shouting', 'cocky'],
  guide: ['smug', 'mischievous', 'teasing', 'exasperated', 'warning', 'surprised'],
};
const FALLBACK = {
  curious: 'thinking', annoyed: 'determined', excited: 'relieved', scared: 'startled', shouting: 'pained', cocky: 'neutral',
  smug: 'amused', mischievous: 'wry', teasing: 'amused', exasperated: 'weary', warning: 'solemn', surprised: 'skeptical',
};
const NAMES = { hero: 'You', guide: '???' };
const H = (face, text) => ({ who: 'hero', face, text });
const G = (face, text) => ({ who: 'guide', face, text });

// Story text. Keys are triggered by rooms (on first entry) or by events (amulet, firstDeath).
// Character voices: see docs/STORY.md.
// A line can carry a `cue` the room acts on when it starts (screen shake, the boss arriving).
const W = (wait, cue) => ({ wait, cue }); // a silent beat: the panel hides for `wait` seconds
// Scenes 1–3 follow docs/STORY.md. The rest are older drafts, due for rewriting from STORY.md.
const SCRIPT = {
  clearing: [
    W(0.6),
    H('neutral', "Mannn… treasure hunting's slow these days."),
    H('thinking', "One good find. That's all I need. Then I could relax. Take it easy for once."),
  ],
  amulet: [ // Scenes 1 and 2: the find, the flash, and the ghost appearing beside him
    H('thinking', 'Hmm? What do we have here?'),
    H('thinking', 'An… amulet?'),
    H('relieved', 'If this is pure gold, it could fetch me a pretty penny.'),
    W(0.8),
    H('thinking', "It'll get scratched to bits in there."),
    { ...H('neutral', "Welp. I'll wear it for now."), cue: 'wear' },
    W(0.7, 'flash'),
    W(1.2, 'ghost'),
    W(0.4, 'lookaround'),
    G('thinking', 'Where am I?'),
    W(0.9),
    G('wry', "Oh… must've died one too many times. I guess I'm the guide now."),
    G('weary', '…'),
    G('wry', 'Anyways, enough about me moping. Which death are you on right now?'),
    H('startled', 'Wh—! Where did you come from?'),
    H('thinking', 'Wait. Which death?'),
    G('wry', 'First timer, then. Well. Introductions are in order.'),
    H('startled', 'You look like me.'),
    { ...G('solemn', 'I am you. From another timeline. A few thousand deaths ahead.'), reveal: true }, // named from here on
    W(1.2),
    H('startled', 'Ooook then. I must be dreaming.'),
    H('thinking', 'Must be this blasted amulet. I should never have put it on.'),
    H('neutral', "I'll just leave it where I found it and call it a day."),
    { ...H('startled', "Why won't it come off?"), cue: 'pulse' },
    G('solemn', "It won't let go. And it won't let you stay dead."),
    H('determined', "Well, someone must know how to get it off. I'm not keeping it."),
    G('weary', "Fine. If you must take it off, I'd start with the tribe that created the thing."),
    { ...G('thinking', 'Look. See that symbol on it?'), cue: 'pulse' },
    H('thinking', 'What about it?'),
    G('thinking', 'Go a little farther in. You should see a very similar one before long.'),
    H('neutral', "All right. I'll have a look. But if this is a waste of time, I'm going home."),
  ],
  firstPit: [ // Scene 3, at the edge of the pit
    H('thinking', "I'm not going to make it."),
    G('amused', '…heh.'),
    G('wry', "No, you'll be able to make it."),
    H('startled', "Look at it! There's no way I can make it. This gap is like twice the length I can jump."),
    G('wry', "Trust me. I'm you from the future. I already know what's gonna happen."),
    G('amused', "You'll make it. Trust me."),
    H('determined', 'All right… here goes nothing.'),
  ],
  firstDeath: [
    H('pained', 'AGH, THAT HURT!'),
    H('pained', "It's like my soul was ripped in half."),
    H('determined', 'I TRUSTED you.'),
    W(0.6),
    G('wry', "Hey, it's not like you actually died, right?"),
    G('thinking', 'Besides, it feels like your soul was ripped in half because it actually was.'),
    G('wry', 'Take a look at this.'),
  ],
  thorns: [
    H('annoyed', 'Let me guess. Die on the thorns.'),
    G('amused', "Look at you, learning! Not too high, though. You still have to climb yourself."),
  ],
  patrol: [
    G('mischievous', 'See the switch? See the fellow pacing over it? Let him do the work.'),
    H('annoyed', 'You want me to get killed on purpose.'),
    G('smug', 'I want you to get killed efficiently.'),
  ],
  moth: [
    { ...H('startled', "What's with this shaking… is this an earthquake?"), cue: 'shake' },
    G('surprised', "Oh shoot, it's been so long that I forgot. Be careful! Watch out for…"),
    { ...G('wry', '…that.'), cue: 'moth' },
  ],
  chain: [
    H('exhausted', 'How many times have you done this?'),
    G('teasing', 'Today? Or ever?'),
    H('annoyed', 'Ever.'),
    G('weary', '…Fine. Enough to stop counting. The shrine will hold your place.'),
  ],
};

const Dialogue = {
  seen: new Set(), // survives room restarts, so lines don't repeat

  preload(scene) {
    for (const who of ['hero', 'guide']) {
      if (!scene.textures.exists(`portrait-${who}`)) scene.load.image(`portrait-${who}`, `assets/portraits/${who}.webp`);
      if (!scene.textures.exists(`portrait-${who}2`)) scene.load.image(`portrait-${who}2`, `assets/portraits/${who}2.webp`);
    }
  },

  create(scene) {
    const W = 960, ui = scene.add.container(0, 0).setDepth(40).setScrollFactor(0).setVisible(false);
    const panel = scene.add.graphics();
    panel.fillStyle(0x0c1411, 0.9).fillRoundedRect(110, 12, 740, 108, 10);
    panel.lineStyle(1, 0xe8b44a, 0.45).strokeRoundedRect(110, 12, 740, 108, 10);
    for (const x of [12, W - 104]) { // framed slots for the two portraits
      panel.fillStyle(0x0c1411, 0.9).fillRoundedRect(x, 12, 92, 108, 10);
      panel.lineStyle(1, 0xe8b44a, 0.45).strokeRoundedRect(x, 12, 92, 108, 10);
    }
    const portrait = (x, who) => {
      const key = `portrait-${who}`;
      if (scene.textures.exists(key)) {
        for (const [k, list] of [[key, FACES[who]], [`${key}2`, FACES2[who]]]) {
          if (!scene.textures.exists(k)) continue;
          const tex = scene.textures.get(k), im = tex.getSourceImage(), fw = im.width / list.length;
          if (!tex.has(0)) for (let i = 0; i < list.length; i++) tex.add(i, 0, i * fw, 0, fw, im.height);
        }
        const img = scene.textures.get(key).getSourceImage();
        return scene.add.image(x, 119, key, 0).setOrigin(0.5, 1).setScale(100 / img.height) // bust sits on the slot's floor
          .setFlipX(who === 'guide'); // he faces the hero, across the panel
      }
      // Placeholder: a framed circle in the character's colours, with the face name.
      const g = scene.add.graphics();
      g.fillStyle(who === 'hero' ? 0x2f4a33 : 0x9fd8ff, who === 'hero' ? 1 : 0.5).fillCircle(0, 0, 40);
      g.fillStyle(who === 'hero' ? 0xd9b65a : 0xeef8ff, 1).fillCircle(0, -10, 18);
      g.lineStyle(2, 0xe8b44a, 0.6).strokeCircle(0, 0, 40);
      const label = scene.add.text(0, 26, '', { fontFamily: 'Georgia, serif', fontSize: '11px', color: '#dfe8e2' }).setOrigin(0.5);
      const c = scene.add.container(x, 66, [g, label]);
      c.placeholder = label;
      return c;
    };
    const hero = portrait(60, 'hero'), guide = portrait(W - 60, 'guide');
    const name = scene.add.text(130, 20, '', { fontFamily: 'Georgia, serif', fontSize: '15px', color: '#e8b44a', fontStyle: 'bold' });
    const text = scene.add.text(130, 44, '', { fontFamily: 'Georgia, serif', fontSize: '18px', color: '#e4ece6', wordWrap: { width: 700 }, lineSpacing: 4 });
    const hint = scene.add.text(838, 104, '▸ Space   ·   Esc skip', { fontFamily: 'Georgia, serif', fontSize: '11px', color: '#9db0a4' }).setOrigin(1, 0.5);
    ui.add([panel, hero, guide, name, text, hint]);
    scene.talk = { ui, hero, guide, name, text, hint, queue: [], line: null, shown: 0 };
  },

  // Queue a script by key; returns false if it was already seen or doesn't exist.
  play(scene, key) {
    if (!SCRIPT[key] || this.seen.has(key)) return false;
    this.seen.add(key);
    scene.talk.queue.push(...SCRIPT[key].map((l) => ({ ...l })));
    return true;
  },

  // Esc: jump to the end of the conversation, still firing its cues (the ghost appears, the boss arrives).
  skip(scene) {
    const t = scene.talk;
    if (!t.line && !t.queue.length) return;
    for (const l of t.queue) {
      if (l.reveal) NAMES.guide = 'Yourself';
      if (l.cue) scene.cue?.(l.cue);
    }
    t.queue.length = 0;
    t.line = null;
  },

  // Call every frame. Returns true while a conversation is open (the hero should not move).
  update(scene, dt, advance) {
    const t = scene.talk;
    if (!t.line) {
      if (!t.queue.length) { t.ui.setVisible(false); return false; }
      t.line = t.queue.shift();
      t.shown = 0;
      if (t.line.reveal) NAMES.guide = 'Yourself';
      if (t.line.cue) scene.cue?.(t.line.cue);
      t.ui.setVisible(!t.line.wait);
      if (t.line.wait) return true;
      const speaking = t.line.who, other = speaking === 'hero' ? 'guide' : 'hero';
      t.name.setText(NAMES[speaking]);
      const pic = t[speaking];
      if (pic.placeholder) pic.placeholder.setText(t.line.face);
      else {
        // Second-sheet face if that sheet exists, otherwise the closest face from the first sheet.
        const face = t.line.face, key = `portrait-${speaking}`;
        if (FACES2[speaking].includes(face) && scene.textures.exists(`${key}2`)) pic.setTexture(`${key}2`, FACES2[speaking].indexOf(face));
        else pic.setTexture(key, Math.max(0, FACES[speaking].indexOf(FALLBACK[face] ?? face)));
      }
      pic.setAlpha(1);
      t[other].setAlpha(0.3);
      return true;
    }
    if (t.line.wait) { // silent beat: no panel, no input, just time passing
      if ((t.line.wait -= dt) <= 0) t.line = null;
      return true;
    }
    const full = t.line.text.length;
    if (advance) {
      if (t.shown < full) t.shown = full;
      else { t.line = null; return t.queue.length > 0 || this.update(scene, 0, false); }
    }
    t.shown = Math.min(full, t.shown + dt * 45);
    t.text.setText(t.line.text.slice(0, Math.floor(t.shown)));
    t.hint.setAlpha(t.shown >= full ? 0.6 + Math.sin(scene.time.now / 250) * 0.3 : 0);
    return true;
  },
};
