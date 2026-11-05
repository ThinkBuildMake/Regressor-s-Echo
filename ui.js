// Title screen and the system menu (Esc in game): stone buttons over the painted title art.
// Art: assets/ui (title key art, logo, stone panel, buttons, keycaps, the amulet mark as the cursor).
// Mouse and keyboard both work: ↑/↓ (or W/S) to choose, Enter/Space to press, Esc to go back.

const UI_ART = [['uiTitle', 'title'], ['uiLogo', 'logo'], ['uiPanel', 'stone-panel'], ['uiButton', 'button'],
  ['uiButtonHover', 'button-hover'], ['uiMark', 'mark'], ['uiKey', 'key'], ['uiKeyWide', 'key-wide']];

const UI = {
  preload(scene) {
    scene.load.on('loaderror', () => {}); // missing art falls back to plain shapes
    for (const [key, file] of UI_ART) if (!scene.textures.exists(key)) scene.load.image(key, `assets/ui/${file}.webp`);
  },

  // The title art, scaled to cover the screen; dim (0..1) darkens it.
  backdrop(scene, dim = 0) {
    if (scene.textures.exists('uiTitle')) {
      const img = scene.add.image(480, 272, 'uiTitle');
      img.setScale(Math.max(960 / img.width, 544 / img.height));
    } else scene.add.rectangle(480, 272, 960, 544, 0x10161a);
    if (dim) scene.add.rectangle(480, 272, 960, 544, 0x05080a, dim);
  },

  // Black, a grey hero running in the lower right, and "Loading…" (the boot screen, and the game while it builds the world).
  // Fixed to the screen; returns a function that removes it.
  loadingScreen(scene) {
    const parts = [scene.add.rectangle(480, 272, 960, 544, 0x000000).setDepth(1000)];
    let runner;
    if (scene.textures.exists('heroRun')) {
      const tex = scene.textures.get('heroRun'), img = tex.getSourceImage(), fw = img.width / 12;
      if (!tex.has(0)) for (let i = 0; i < 12; i++) tex.add(i, 0, i * fw, 0, fw, img.height);
      runner = scene.add.image(880, 520, 'heroRun', 0).setOrigin(0.5, 1).setScale(0.62).setDepth(1001);
      parts.push(runner);
      runner.preFX?.addColorMatrix().grayscale(1);
    }
    const label = scene.add.text(820, 498, 'Loading', { ...FONT, fontSize: '22px', color: '#d8d8d8' }).setOrigin(1, 0.5).setDepth(1001);
    parts.push(label);
    parts.forEach((o) => o.setScrollFactor(0));
    let step = 0;
    const timer = scene.time.addEvent({ delay: 60, loop: true, callback: () => {
      step++;
      runner?.setFrame(step % 12);
      label.setText('Loading' + '.'.repeat(Math.floor(step / 6) % 4));
    } });
    return () => { timer.remove(); parts.forEach((o) => o.destroy()); };
  },

  panel(scene, y, w, h) {
    return scene.textures.exists('uiPanel')
      ? scene.add.image(480, y, 'uiPanel').setDisplaySize(w, h)
      : scene.add.rectangle(480, y, w, h, 0x3a3f42, 0.92).setStrokeStyle(3, 0x1e2224);
  },

  // A column of stone buttons. items: [{ label, act }]. Returns { select(i), destroy() }.
  menu(scene, items, top, gap = 62) {
    const art = scene.textures.exists('uiButton');
    const mark = scene.textures.exists('uiMark') ? scene.add.image(0, 0, 'uiMark').setDisplaySize(30, 30).setDepth(2) : null;
    let current = 0, ready = false;
    const rows = items.map((item, i) => {
      const y = top + i * gap;
      const bg = art ? scene.add.image(480, y, 'uiButton').setDisplaySize(230, 54) : scene.add.rectangle(480, y, 230, 54, 0x55595b);
      const text = scene.add.text(480, y, item.label, { ...FONT, fontSize: '22px', color: '#f1e3b8' }).setOrigin(0.5).setShadow(0, 2, '#000', 4);
      bg.setInteractive({ useHandCursor: true })
        .on('pointerover', () => select(i))
        .on('pointerdown', (pointer) => press(i, pointer));
      return { bg, text, item };
    });
    const select = (i) => {
      if (i === current && rows[i].lit) return;
      if (rows[current]) rows[current].lit = false;
      current = (i + rows.length) % rows.length;
      rows.forEach((r, j) => {
        r.lit = j === current;
        if (art) r.bg.setTexture(r.lit && scene.textures.exists('uiButtonHover') ? 'uiButtonHover' : 'uiButton').setDisplaySize(230, 54);
        r.text.setColor(r.lit ? '#ffe9a8' : '#cfc3a0');
      });
      mark?.setPosition(480 - 140, rows[current].bg.y);
      if (ready) GameAudio.play('ui-menu-move', 0, 0.5);
    };
    const press = (i, pointer) => { select(i); GameAudio.play('ui-menu-select'); rows[current].item.act(pointer); };
    const keys = (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) select(current - 1);
      else if (['ArrowDown', 'KeyS'].includes(e.code)) select(current + 1);
      else if (['Enter', 'Space'].includes(e.code)) press(current);
      else rows[current].item.key?.(e);
    };
    scene.input.keyboard.on('keydown', keys);
    rows[0].lit = false; select(0); ready = true;
    return { rows, select, destroy() { scene.input.keyboard.off('keydown', keys); mark?.destroy(); rows.forEach((r) => { r.bg.destroy(); r.text.destroy(); }); } };
  },
};

// The title screen: key art, logo, Start / Settings / Controls.
class Title extends Phaser.Scene {
  constructor() { super('title'); }
  preload() { UI.preload(this); }
  update(_t, ms) { GameAudio.mix(ms / 1000); }
  create() {
    GameAudio.music('title');
    UI.backdrop(this);
    if (this.textures.exists('uiLogo')) this.add.image(480, 128, 'uiLogo').setDisplaySize(430, 240);
    else this.add.text(480, 128, "Regressor's Echo", { ...FONT, fontSize: '52px', color: '#f1e3b8' }).setOrigin(0.5);
    UI.panel(this, 372, 330, 236);
    UI.menu(this, [
      { label: 'Start', act: () => this.start() },
      { label: 'Settings', act: () => this.open('settings') },
      { label: 'Controls', act: () => this.open('controls') },
    ], 310);
    this.add.text(480, 528, 'Click or use ↑ ↓ and Enter', { ...FONT, fontSize: '13px', color: '#a8b8ad' }).setOrigin(0.5);
    if (this.sys.settings.data?.fadeIn) this.cameras.main.fadeIn(900, 0, 0, 0); // from the ending card
  }
  open(page) { this.scene.pause(); this.scene.launch('menu', { page, back: 'title' }); }
  // The title (under its loading screen) stays up until the game has built the world, so there's no blank gap.
  start() {
    UI.loadingScreen(this);
    this.time.delayedCall(50, () => {
      this.scene.get('room').events.once('create', () => this.scene.stop());
      // Always say which room: without data, Phaser would reuse the last room's (e.g. the final room after the ending).
      this.scene.launch('room', { index: UI.resumeIndex ?? START_ROOM });
    });
  }
}

// The system menu, drawn over a paused scene: the pause list, Settings and Controls.
// data: { page: 'pause' | 'settings' | 'controls', back: the scene key it was opened from }.
class Menu extends Phaser.Scene {
  constructor() { super('menu'); }
  preload() { UI.preload(this); }
  update(_t, ms) { GameAudio.mix(ms / 1000); }
  init(data) { this.page = data.page ?? 'pause'; this.back = data.back ?? 'room'; }
  create() {
    this.add.rectangle(480, 272, 960, 544, 0x05080a, 0.62);
    this.layer = [];
    this.input.keyboard.on('keydown-ESC', () => (this.page === 'pause' || this.back === 'title' ? this.close() : this.show('pause')));
    this.show(this.page);
  }

  clear() { this.list?.destroy(); this.layer.forEach((o) => o.destroy()); this.layer = []; }
  text(x, y, s, size = '20px', color = '#f1e3b8', origin = 0.5) {
    const t = this.add.text(x, y, s, { ...FONT, fontSize: size, color }).setOrigin(origin, 0.5).setShadow(0, 2, '#000', 4);
    this.layer.push(t); return t;
  }

  show(page) {
    this.clear();
    this.page = page;
    if (page === 'pause') this.pause();
    if (page === 'settings') this.settings();
    if (page === 'controls') this.controls();
  }

  pause() {
    this.layer.push(UI.panel(this, 290, 330, 370));
    this.text(480, 150, 'Paused', '30px');
    this.list = UI.menu(this, [
      { label: 'Resume', act: () => this.close() },
      { label: 'Settings', act: () => this.show('settings') },
      { label: 'Controls', act: () => this.show('controls') },
      { label: 'Quit to title', act: () => { UI.resumeIndex = this.scene.get(this.back).index; this.scene.stop(this.back); this.scene.start('title'); } }, // Start resumes here
    ], 215);
  }

  settings() {
    this.layer.push(UI.panel(this, 278, 440, 330));
    this.text(480, 150, 'Settings', '30px');
    const volume = () => `Volume   ◀  ${Math.round(GameAudio.master * 100)}%  ▶`;
    const mute = () => `Sound   ${GameAudio.muted ? 'Off' : 'On'}`;
    const nudge = (d) => { GameAudio.master = Math.round(Math.max(0, Math.min(1, GameAudio.master + d)) * 10) / 10; GameAudio.save(); this.list.rows[0].text.setText(volume()); };
    this.list = UI.menu(this, [
      { label: volume(), act: (pointer) => nudge(pointer ? (pointer.x < 480 ? -0.1 : 0.1) : GameAudio.master >= 1 ? -1 : 0.1), // click ◀ or ▶ side
        key: (e) => (e.code === 'ArrowLeft' || e.code === 'KeyA' ? nudge(-0.1) : e.code === 'ArrowRight' || e.code === 'KeyD' ? nudge(0.1) : 0) },
      { label: mute(), act: () => { GameAudio.muted = !GameAudio.muted; GameAudio.save(); this.list.rows[1].text.setText(mute()); } },
      { label: 'Back', act: () => (this.back === 'title' ? this.close() : this.show('pause')) },
    ], 220);
    this.list.rows[0].text.setFontSize('19px');
    this.text(480, 400, '← → change the volume · M mutes and − / = change it in game', '13px', '#a8b8ad');
  }

  controls() {
    this.layer.push(UI.panel(this, 272, 640, 470));
    this.text(480, 66, 'Controls', '30px');
    const rows = [
      [['A', 'D'], 'move (or ← →)'], [['Space'], 'jump (again on a wall: wall jump)'], [['Shift'], 'or ↓ while running: slide'],
      [['K'], 'hold: let go (World 2 on)'], [['Q'], 'take back your newest soul (World 2 on)'], [['E'], 'swap with your newest soul (World 3 on)'],
      [['Shift', 'R'], 'retry the room'], [['Enter'], 'or Space: next line · Esc skips a scene'], [['Esc'], 'this menu'], [['M'], '− / =: mute, volume'],
    ];
    rows.forEach(([caps, what], i) => {
      const y = 112 + i * 36;
      let x = 230;
      for (const cap of caps) {
        const wide = cap.length > 1 && !['←', '→'].includes(cap), w = wide ? 74 : 40;
        const key = wide ? 'uiKeyWide' : 'uiKey';
        this.layer.push(this.textures.exists(key) ? this.add.image(x + w / 2, y, key).setDisplaySize(w, 34)
          : this.add.rectangle(x + w / 2, y, w, 34, 0x55595b).setStrokeStyle(2, 0x2a2e30));
        this.text(x + w / 2, y - 1, cap, '15px', '#2b2620');
        x += w + 6;
      }
      this.text(390, y, what, '16px', '#e8dfc4', 0);
    });
    this.list = UI.menu(this, [{ label: 'Back', act: () => (this.back === 'title' ? this.close() : this.show('pause')) }], 492);
  }

  close() {
    this.scene.stop();
    this.scene.resume(this.back);
    const room = this.scene.get(this.back);
    if (this.back === 'room') { // keys pressed in the menu shouldn't act in the game
      room.input.keyboard.resetKeys();
      room.blockedKeys = new Map();
    }
  }
}
