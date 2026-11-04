// Painted look: parallax backdrop, textured platforms, light and atmosphere.
// Real art lives in assets/world<N>/<name>.webp (sky, far, mid, near, ground, moss). Worlds 2-3 use their own
// file when it exists (key `w2-sky`), else World 1's. Any missing World 1 file
// falls back to a painted stand-in drawn in code, so the game always runs.
// Note: browsers block image files opened via file://, so real art needs a local server
// (e.g. `python3 -m http.server` in this folder, then open http://localhost:8000).
const Art = {
  FILES: ['sky', 'far', 'mid', 'midAlt', 'near', 'nearTop', 'nearBottom', 'ground', 'moss', 'lip'],
  W: 960,
  H: 544,

  preload(scene) {
    this.preloadHazards(scene);
    scene.load.on('loaderror', () => {}); // missing file → stand-in below
    for (const k of this.FILES) if (!scene.textures.exists(k)) scene.load.image(k, `assets/world1/${k}.webp`);
    for (const w of [2, 3]) for (const k of this.FILES)
      if (!scene.textures.exists(`w${w}-${k}`)) scene.load.image(`w${w}-${k}`, `assets/world${w}/${k}.webp`);
  },

  // This world's texture for a layer, or World 1's.
  key(scene, world, k) {
    return world > 1 && scene.textures.exists(`w${world}-${k}`) ? `w${world}-${k}` : k;
  },

  // Swap the screen-fixed backdrop to a world's layers (called when you arrive in a new world).
  setWorld(scene, world) {
    for (const L of scene.art?.layers ?? []) {
      const key = this.key(scene, world, L.base);
      // World 1's foliage strips don't belong in other worlds: hide them unless that world has its own.
      L.ts.setVisible(!(L.base.startsWith('near') && world > 1 && key === L.base));
      if (L.ts.texture.key === key) continue;
      L.ts.setTexture(key);
      const s = L.scale ?? this.H / scene.textures.get(key).getSourceImage().height;
      L.ts.setTileScale(s, s);
    }
  },

  preloadHazards(scene) {
    if (scene.hazardsPreloaded) return;
    scene.hazardsPreloaded = true;
    for (const world of [1, 2, 3]) {
      for (const name of ['crumble', 'crumble-cracked', 'crumble-breaking', 'falling-spike', 'saw',
        ...(world > 1 ? ['spikes', 'thorns', 'plate', 'vine-barrier'] : [])]) {
        const key = `hazard-${world}-${name}`;
        if (!scene.textures.exists(key)) scene.load.image(key, `assets/world${world}/${name}.webp`);
      }
    }
    if (!scene.textures.exists('hazard-spring')) scene.load.spritesheet('hazard-spring', 'assets/world2/spring.webp', { frameWidth: 163, frameHeight: 300 });
  },

  hazardKey(scene, world, name) {
    return [world, 1].map((w) => `hazard-${w}-${name}`).find((k) => scene.textures.exists(k));
  },

  hazard(scene, body, world, name, width, height, offsetY = 0) {
    const key = name === 'spring' ? (scene.textures.exists('hazard-spring') && 'hazard-spring') : this.hazardKey(scene, world, name);
    if (!key) return;
    const tex = scene.textures.get(key);
    if (name === 'spikes' && !tex.has('points')) {
      const top = key.includes('-2-') ? 71 : 69, source = tex.getSourceImage();
      tex.add('points', 0, 0, top, source.width, source.height - top);
    }
    const img = scene.add.image(body.x, body.y + offsetY, key, name === 'spikes' ? 'points' : undefined).setDisplaySize(width, height).setDepth(3);
    body.setFillStyle(0, 0).setStrokeStyle(0);
    body.hazardArt = { img, world, name, offsetY };
    body.on('destroy', () => img.destroy());
    (scene.hazardArt ??= []).push(body);
    return img;
  },

  updateHazardArt(scene, t) {
    const weights = [scene.player, ...scene.corpses].map(bounds);
    for (const body of scene.hazardArt ?? []) {
      if (!body.active) continue;
      const { img, world, name, offsetY } = body.hazardArt;
      img.setPosition(body.x, body.y + offsetY).setVisible(body.visible).setAlpha(body.alpha);
      if (name === 'crumble') {
        const state = body.t > 0 ? (body.t < 0.15 ? 'crumble-breaking' : 'crumble-cracked') : 'crumble';
        img.setTexture(this.hazardKey(scene, world, state) ?? this.hazardKey(scene, world, name));
        body.setFillStyle(0, 0);
      } else if (name === 'plate') {
        const held = weights.some((w) => hit(w, bounds(body)));
        if (held) img.y += 5;
        img.setCrop(0, 0, img.frame.width, img.frame.height * (held ? 3 / 8 : 1));
      } else if (name === 'spring') {
        const elapsed = scene.time.now - (body.launchArt ?? -1000);
        img.setFrame(elapsed < 65 ? 1 : elapsed < 200 ? 2 : 0);
      }
    }
    for (const sw of scene.saws) if (sw.img) {
      sw.img.setPosition(sw.x, sw.y);
      if (!sw.jam && sw.room === scene.index) sw.img.setRotation(t * 12);
    }
  },

  // Make a stand-in for every texture that didn't load. Textures persist across room restarts.
  ensure(scene) {
    const T = scene.textures;
    const make = (key, w, h, draw) => {
      if (T.exists(key)) return;
      const c = T.createCanvas(key, w, h);
      draw(c.context, w, h);
      c.refresh();
    };
    const rnd = (seed) => () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);

    make('sky', 960, 544, (g, w, h) => {
      const sky = g.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#e6e0c4'); sky.addColorStop(0.45, '#b7c8a3'); sky.addColorStop(1, '#7b9a83');
      g.fillStyle = sky; g.fillRect(0, 0, w, h);
      const sun = g.createRadialGradient(130, 40, 10, 130, 40, 420);
      sun.addColorStop(0, 'rgba(255,240,200,.75)'); sun.addColorStop(1, 'rgba(255,240,200,0)');
      g.fillStyle = sun; g.fillRect(0, 0, w, h);
    });

    // Tree rows: soft dabs of paint, blurred more the farther away they are, fading into mist at the base.
    const trees = (seed, colors, blur, base, height, gap) => (g, w, h) => {
      const r = rnd(seed);
      g.filter = `blur(${blur}px)`;
      for (let x = -20; x < w + 20; x += gap * (0.7 + r() * 0.6)) {
        const th = height * (0.7 + r() * 0.5), tw = 30 + r() * 30;
        g.fillStyle = colors[2]; g.globalAlpha = 1;
        g.fillRect(x - 3, base - th * 0.65, 6 + r() * 4, th * 0.65 + 80);
        for (let k = 0; k < 26; k++) {
          g.fillStyle = colors[k % 3]; g.globalAlpha = 0.45 + r() * 0.45;
          g.beginPath();
          g.ellipse(x + (r() - 0.5) * tw * 1.4, base - th * (0.4 + r() * 0.6), 9 + r() * 16, 7 + r() * 10, r() * 3, 0, Math.PI * 2);
          g.fill();
        }
      }
      g.globalAlpha = 1; g.filter = 'none';
      g.fillStyle = colors[1]; g.fillRect(0, base, w, h - base);
      g.globalCompositeOperation = 'destination-out'; // fade the bottom into mist
      const fade = g.createLinearGradient(0, base - 60, 0, base + 60);
      fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,1)');
      g.fillStyle = fade; g.fillRect(0, base - 60, w, h);
      g.globalCompositeOperation = 'source-over';
    };
    make('far', 1200, 544, trees(11, ['#93b29a', '#a7c0a5', '#809f8b'], 3, 360, 230, 46));
    make('mid', 1300, 544, trees(23, ['#4f7560', '#5f8669', '#3f6350'], 1.2, 430, 330, 80));

    make('near', 1300, 544, (g, w, h) => { // framing foliage: top and bottom edges only
      const r = rnd(37);
      for (let x = 0; x < w; x += 6) {
        const d = 30 + Math.sin(x * 0.013) * 22 + r() * 18;
        g.fillStyle = r() > 0.8 ? '#3d5a3a' : '#16241b';
        g.beginPath(); g.ellipse(x, d * 0.4, 10 + r() * 10, d * 0.6, 0, 0, Math.PI * 2); g.fill();
        if (r() > 0.93) { g.fillStyle = '#1d3023'; g.fillRect(x, 0, 2, d + 40 + r() * 70); } // hanging moss
      }
      for (let x = 0; x < w; x += 14 + r() * 50) {
        if (r() < 0.5) continue;
        for (let b = 0; b < 7; b++) {
          g.strokeStyle = b % 3 ? '#16241b' : '#3f5c3a'; g.lineWidth = 3;
          g.beginPath(); g.moveTo(x, h); g.quadraticCurveTo(x + (b - 3) * 6, h - 30, x + (b - 3) * 12, h - 26 - r() * 24); g.stroke();
        }
      }
    });

    // Seamless textures: every dab is also drawn wrapped around the edges.
    const wrapDabs = (seed, colors, count, size, yRange) => (g, w, h) => {
      const r = rnd(seed);
      for (let i = 0; i < count; i++) {
        const x = r() * w, y = yRange[0] + r() * (yRange[1] - yRange[0]), rx = size * (0.5 + r()), c = colors[i % colors.length];
        g.fillStyle = c; g.globalAlpha = 0.55 + r() * 0.4;
        for (const ox of [-w, 0, w]) for (const oy of [-h, 0, h]) {
          g.beginPath(); g.ellipse(x + ox, y + oy, rx, rx * 0.55, r() * 3, 0, Math.PI * 2); g.fill();
        }
      }
      g.globalAlpha = 1;
    };
    make('ground', 128, 128, (g, w, h) => {
      g.fillStyle = '#2a2a1f'; g.fillRect(0, 0, w, h);
      wrapDabs(41, ['#3a3123', '#2f3a24', '#20291b', '#453826'], 140, 7, [0, h])(g, w, h);
    });
    make('moss', 128, 20, (g, w, h) => wrapDabs(53, ['#56763a', '#6b8d43', '#3f5d2c', '#7d9f4c'], 70, 5, [2, 11])(g, w, h));

    make('mote', 8, 8, (g) => {
      const m = g.createRadialGradient(4, 4, 0, 4, 4, 4);
      m.addColorStop(0, 'rgba(255,250,225,1)'); m.addColorStop(1, 'rgba(255,250,225,0)');
      g.fillStyle = m; g.fillRect(0, 0, 8, 8);
    });
    make('vignette', 960, 544, (g, w, h) => {
      const v = g.createRadialGradient(w / 2, h / 2, h * 0.35, w / 2, h / 2, w * 0.62);
      v.addColorStop(0, 'rgba(10,20,14,0)'); v.addColorStop(1, 'rgba(10,20,14,.6)');
      g.fillStyle = v; g.fillRect(0, 0, w, h);
    });
  },

  // Three parallax planes, back to front: background-background (far trees, over a near-still sky),
  // background (mid trees), foreground (near foliage, in front of the player). The farther the plane,
  // the less it moves. Draw order: sky, far, light shafts, mid, mist, [level], near, dust, vignette.
  backdrop(scene) {
    // Each plane repeats sideways and scrolls at a fraction of the camera's speed.
    // A strip h tall, at the top of the screen or the bottom, drawn at `scale` (default: fit the screen height).
    const layer = (key, depth, f, h = this.H, atBottom = false, scale) => {
      const ts = scene.add.tileSprite(0, atBottom ? this.H - h : 0, this.W, h, key).setOrigin(0).setDepth(depth).setScrollFactor(0);
      const s = scale ?? this.H / scene.textures.get(key).getSourceImage().height;
      ts.setTileScale(s, s);
      return { ts, f, base: key, scale };
    };
    // Painted foreground comes as two strips: branches hanging from the top, and only the tips of the
    // ferns along the bottom, so foliage never hides the hero on the floor.
    const near = scene.textures.exists('nearTop')
      ? [layer('nearTop', 10, 1.25, 190, false, 0.5), layer('nearBottom', 10, 1.25, 44, true, 0.5)]
      : [layer('near', 10, 1.25)];
    const a = (scene.art = { layers: [layer('sky', -100, 0.03), layer('far', -90, 0.12), layer('mid', -80, 0.3), ...near] });

    a.shafts = scene.add.graphics().setDepth(-85).setBlendMode(Phaser.BlendModes.ADD).setScrollFactor(0);
    for (let i = 0; i < 4; i++) {
      const x = 170 + i * 120;
      a.shafts.fillStyle(0xfff0c0, 0.06 + (i % 2) * 0.03);
      a.shafts.fillPoints([{ x, y: 0 }, { x: x + 40, y: 0 }, { x: x - 110, y: 544 }, { x: x - 180, y: 544 }], true);
    }
    const mist = scene.add.graphics().setDepth(-75).setScrollFactor(0);
    mist.fillGradientStyle(0xc9dccb, 0xc9dccb, 0xc9dccb, 0xc9dccb, 0, 0, 0.35, 0.35);
    mist.fillRect(0, 300, 960, 244);

    scene.add.particles(0, 0, 'mote', {
      x: { min: 0, max: 960 }, y: { min: 60, max: 520 }, lifespan: 7000, frequency: 220,
      speedX: { min: -6, max: 6 }, speedY: { min: -9, max: -2 },
      scale: { min: 0.4, max: 1 }, alpha: { start: 0.7, end: 0 }, blendMode: 'ADD',
    }).setDepth(11).setScrollFactor(0);
    scene.add.image(0, 0, 'vignette').setOrigin(0).setDepth(20).setScrollFactor(0);
  },

  // A wall run: tiled ground texture, plus moss on every tile whose top is open to the air.
  platform(scene, x, y, w, h, mossTop, world = 1) {
    const ground = this.key(scene, world, 'ground'), lip = this.key(scene, world, 'lip');
    const tex = scene.textures.get(ground).getSourceImage();
    const ts = scene.add.tileSprite(x, y, w, h, ground).setOrigin(0).setDepth(1);
    ts.setTileScale(256 / tex.height).setTilePosition(x / ts.tileScaleX, y / ts.tileScaleY); // one repeat = 256px on screen
    const shade = scene.add.graphics().setDepth(1); // darker toward the bottom, for weight
    shade.fillGradientStyle(0x000000, 0x000000, 0x000000, 0x000000, 0, 0, 0.35, 0.35);
    shade.fillRect(x, y, w, h);
    if (scene.textures.exists(lip)) {
      // Painted top lip: one continuous strip per run of open tiles. Grass pokes ~12px above the
      // surface, moss hangs over the front; it repeats by world position so neighbours line up.
      for (let i = 0; i < mossTop.length; i++) {
        if (!mossTop[i]) continue;
        let n = 1;
        while (mossTop[i + n]) n++;
        const lx = x + i * 32 - 3, m = scene.add.tileSprite(lx, y - 12, n * 32 + 6, 48, lip).setOrigin(0).setDepth(2);
        m.setTileScale(0.5).setTilePosition(lx / 0.5, 0);
        i += n - 1;
      }
      return;
    }
    mossTop.forEach((open, i) => {
      if (!open) return;
      const m = scene.add.tileSprite(x + i * 32 - 2, y - 7, 36, 20, 'moss').setOrigin(0).setDepth(2);
      m.setTileScale(20 / scene.textures.get('moss').getSourceImage().height).setTilePosition(x + i * 32, 0);
    });
  },

  update(scene, t) {
    this.updateHazardArt(scene, t);
    const a = scene.art, cam = scene.cameras.main;
    for (const L of a.layers) L.ts.tilePositionX = (cam.scrollX * L.f) / L.ts.tileScaleX;
    a.shafts.setAlpha(0.75 + Math.sin(t * 0.6) * 0.25);
  },
};
