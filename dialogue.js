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
const SCRIPT = {
  clearing: [H('cocky', 'Three days in these woods and nothing but mushrooms. Some treasure hunter I am.')],
  amulet: [
    H('curious', "Hm? What's this…"),
    H('excited', "Gold. Old gold. That's worth a fortune!"),
    H('relieved', 'Finally, something worth the trip.'),
    H('startled', '…Did it just pulse?'),
  ],
  ghost: [
    G('mischievous', 'Well, well. Which death are you currently on?'),
    H('startled', "Death? I'm on?"),
    G('amused', 'Oh, a first-timer! This is my favorite part.'),
    { ...G('smug', "Introductions, then. I'm you. Give or take a few thousand deaths."), reveal: true }, // from here on he's named
    H('annoyed', "You're me? I'm way better looking."),
    G('teasing', 'Same face. Same hair. Same bad decisions.'),
    G('wry', "Every death sends you back. Your body forgets. You don't."),
    H('excited', "So this amulet makes me immortal? What's it worth?"),
    G('amused', 'Nope! Not telling.'),
    G('warning', "…It won't let you stay dead. One day you'll wish it would."),
    G('mischievous', "Anyway! Treasure's that way. Try not to die. …Actually, do. It's the only way through."),
  ],
  firstPit: [
    G('mischievous', 'Too wide to jump. Go on, jump in.'),
    H('scared', 'Into the spikes?!'),
    G('teasing', "Trust me. I've done this part a lot."),
  ],
  firstDeath: [
    H('shouting', 'AGH! THAT HURT!'),
    G('wry', "It's not like you actually died, right?"),
    H('annoyed', 'I literally just died.'),
    G('smug', 'And yet, here you are. Look, you left yourself behind. Go stand on him.'),
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
    const hint = scene.add.text(838, 104, '▸ Space', { fontFamily: 'Georgia, serif', fontSize: '11px', color: '#9db0a4' }).setOrigin(1, 0.5);
    ui.add([panel, hero, guide, name, text, hint]);
    scene.talk = { ui, hero, guide, name, text, hint, queue: [], line: null, shown: 0 };
  },

  // Queue a script by key; returns false if it was already seen or doesn't exist.
  play(scene, key) {
    if (!SCRIPT[key] || this.seen.has(key)) return false;
    this.seen.add(key);
    scene.talk.queue.push(...SCRIPT[key]);
    return true;
  },

  // Call every frame. Returns true while a conversation is open (the hero should not move).
  update(scene, dt, advance) {
    const t = scene.talk;
    if (!t.line) {
      if (!t.queue.length) { t.ui.setVisible(false); return false; }
      t.line = t.queue.shift();
      t.shown = 0;
      t.ui.setVisible(true);
      if (t.line.reveal) NAMES.guide = 'Yourself';
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
