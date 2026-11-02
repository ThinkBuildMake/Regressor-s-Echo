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
const NAMES = { hero: 'You', guide: '???' };
const H = (face, text) => ({ who: 'hero', face, text });
const G = (face, text) => ({ who: 'guide', face, text });

// Story text. Keys are triggered by rooms (on first entry) or by events (amulet, firstDeath).
const SCRIPT = {
  clearing: [H('neutral', "Three days in these woods. Treasure hunting's slow this season…")],
  amulet: [
    H('thinking', "What's this? An amulet… it's warm."),
    H('startled', '…Did it just pulse?'),
  ],
  ghost: [
    G('wry', 'Which death are you currently on?'),
    H('startled', "Death? I'm on?"),
    G('wry', 'First timer, then. …Well. Introductions are in order.'),
    { ...G('solemn', "I'm you. A few thousand deaths from now."), reveal: true }, // from here on he's named
    H('startled', 'You… you look exactly like me.'),
    G('wry', "Every death sends you back. Your body forgets. You don't."),
    G('solemn', "That amulet won't let you stay dead. You'll wish it would."),
    H('thinking', '…And the treasure?'),
    G('amused', 'Still out there. Keep walking.'),
  ],
  firstPit: [
    G('wry', 'Too wide to jump. Go on. Jump in.'),
    H('startled', 'Into the spikes?!'),
    G('solemn', "Trust me. I'd know."),
  ],
  firstDeath: [
    H('pained', 'Agh—! That… that hurt.'),
    G('solemn', "It doesn't stop hurting. But look."),
    G('wry', "You're still there. Use it."),
  ],
  thorns: [
    G('thinking', "Too high to reach. The thorns can lift you."),
    G('wry', 'Not too high, though. You still have to climb yourself.'),
  ],
  patrol: [
    G('wry', 'Sometimes you let the forest do it for you.'),
    H('exhausted', "You say that like it's easy."),
  ],
  chain: [
    G('thinking', 'One soul, two problems. The shrine will hold your place.'),
    H('exhausted', 'How many times have you done this?'),
    G('sad', 'Enough to stop counting.'),
  ],
};

const Dialogue = {
  seen: new Set(), // survives room restarts, so lines don't repeat

  preload(scene) {
    for (const who of ['hero', 'guide'])
      if (!scene.textures.exists(`portrait-${who}`)) scene.load.image(`portrait-${who}`, `assets/portraits/${who}.webp`);
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
        const tex = scene.textures.get(key), img = tex.getSourceImage(), n = FACES[who].length, fw = img.width / n;
        if (!tex.has(0)) for (let i = 0; i < n; i++) tex.add(i, 0, i * fw, 0, fw, img.height);
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
      else pic.setFrame(Math.max(0, FACES[speaking].indexOf(t.line.face)));
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
