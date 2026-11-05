// Lazy media cache: missing files and browsers without audio stay silent.
const GameAudio = {
  musicKey: null, tracks: new Map(), effects: new Map(), loops: new Map(), loopCache: new Map(), unlocked: false,
  master: 0.8, muted: false, ending: false,
  init() {
    try {
      const saved = JSON.parse(localStorage.getItem('echo-audio'));
      if (Number.isFinite(saved?.master)) this.master = Math.max(0, Math.min(1, saved.master));
      this.muted = saved?.muted === true;
    } catch {}
    window.addEventListener('keydown', e => {
      if (e.repeat) return;
      if (e.code === 'KeyM') this.muted = !this.muted;
      else if (e.code === 'Minus' || e.code === 'Equal') this.master = Math.max(0, Math.min(1, this.master + (e.code === 'Equal' ? 0.1 : -0.1)));
      else return;
      this.save();
    });
    const unlock = () => { this.unlocked = true; this.mix(0); };
    window.addEventListener('keydown', unlock, { once: true });
    window.addEventListener('pointerdown', unlock, { once: true });
  },
  // Keep the volume and mute between visits (the settings menu calls this too).
  save() {
    try { localStorage.setItem('echo-audio', JSON.stringify({ master: this.master, muted: this.muted })); } catch {}
    this.mix(0);
  },
  media(key, music = false) {
    try {
      const a = new Audio(new URL(`assets/audio/${music ? 'music' : 'sfx'}/${key}.ogg`, document.querySelector('script[src*="audio.js"]').src));
      a.preload = 'auto';
      a.addEventListener('error', () => { a.failed = true; });
      return a;
    } catch { return null; }
  },
  start(a) {
    if (!a || a.failed || a.starting || !this.unlocked || !a.paused) return;
    a.starting = true;
    try {
      Promise.resolve(a.play()).catch(() => {}).finally(() => { a.starting = false; });
    } catch { a.starting = false; }
  },
  play(key, takes = 0, volume = 0.7) {
    if (!this.unlocked) return;
    if (takes) key += '-' + (1 + Math.floor(Math.random() * takes));
    let pool = this.effects.get(key);
    if (!pool) this.effects.set(key, pool = []);
    let a = pool.find(a => a.paused || a.ended);
    if (!a && pool.length < 4) { a = this.media(key); if (a) pool.push(a); }
    if (!a) return;
    a.level = volume; a.volume = this.muted ? 0 : this.master * volume;
    try { a.currentTime = 0; } catch {}
    this.start(a);
  },
  music(key) {
    if (this.musicKey === key) return;
    this.musicKey = key;
    if (!this.tracks.has(key)) {
      const a = this.media(key, true);
      if (a) { a.loop = key !== 'ending'; a.volume = 0; this.tracks.set(key, { a, gain: 0 }); }
    }
  },
  loop(source, key, wanted, volume = 0.2) {
    let entry = this.loops.get(source);
    if (wanted && !entry) {
      let pool = this.loopCache.get(key);
      if (!pool) this.loopCache.set(key, pool = []);
      let a = pool.find(a => !a.busy);
      if (!a && this.unlocked) { a = this.media(key); if (a) pool.push(a); }
      if (a) { a.busy = true; a.loop = true; entry = { a, level: volume }; this.loops.set(source, entry); }
    }
    if (entry) entry.wanted = wanted;
  },
  mix(dt, talking = false) {
    const master = this.muted ? 0 : this.master;
    // Music changes fade the old track out (1.2 s) first, then fade the new one in from its start (2 s).
    const fading = [...this.tracks].some(([key, t]) => key !== this.musicKey && t.gain > 0);
    for (const [key, t] of this.tracks) {
      const target = key === this.musicKey && !fading ? 1 : 0;
      const rate = target > t.gain ? 1 / 2 : 1 / 1.2;
      t.gain += Math.sign(target - t.gain) * Math.min(Math.abs(target - t.gain), dt * rate);
      t.a.volume = master * 0.28 * (talking ? 0.4 : 1) * t.gain;
      if (target && (!t.a.ended || t.a.loop)) this.start(t.a);
      else if (!t.gain && !t.a.paused) { t.a.pause(); try { t.a.currentTime = 0; } catch {} }
    }
    for (const pool of this.effects.values()) for (const a of pool) a.volume = master * a.level;
    for (const [source, e] of this.loops) {
      if (!e.wanted) { e.a.pause(); e.a.busy = false; this.loops.delete(source); }
      else { e.a.volume = master * e.level; this.start(e.a); e.wanted = false; }
    }
  },
  kind(B) { return B.stag ? 'stag' : B.kind === 'tree' ? 'tree' : 'moth'; },
  room(scene, dt) {
    const B = scene.boss, active = B && (!B.hidden || B.audioArrived) && B.hp > 0;
    const world = scene.rooms[scene.index].world || 1;
    this.music(this.ending ? 'ending' : active ? { moth: 'boss-great-moth', tree: 'boss-tree-guardian', stag: 'boss-spectral-stag' }[this.kind(B)] : ['title', 'world-1-forest-edge', 'world-2-overgrown-ruins', 'world-3-sanctum'][world]);
    if (active) {
      const kind = this.kind(B);
      this.loop(B, `${kind}-presence-loop`, true);
      if (B.audioPhase !== B.phase) {
        const sound = kind === 'stag' ? { charge: 'charge', beam: 'beam', procession: 'wave', bell: 'wave' }[B.phase]
          : kind === 'tree' ? { rake: 'branch-swing', slam: 'branch-swing' }[B.phase] : null;
        if (sound) this.play(`${kind}-${sound}`);
        B.audioPhase = B.phase;
      }
    }
    for (const e of scene.enemies) if (e.kind === 'e') this.loop(e, 'walker-scuttle-loop', Math.abs(e.x - scene.player.x) < 320, 0.12);
    const beams = scene.beams();
    for (let i = 0; i < beams.length; i++) {
      const r = beams[i], source = scene.lasers.filter(l => l.room === scene.index)[i];
      const p = scene.player;
      this.loop(source, 'hazards-laser-hum-loop', p.x > r.x - 160 && p.x < r.right + 160 && p.y > r.y - 160 && p.y < r.bottom + 160, 0.15);
      const blocked = scene.corpses.some(c => c.body.enable && hit(new Phaser.Geom.Rectangle(r.x - 2, r.y - 2, r.width + 4, r.height + 4), bounds(c)));
      if (blocked && !source.audioBlocked) this.play('hazards-laser-blocked-by-soul');
      source.audioBlocked = blocked;
    }
    this.mix(dt, !!(scene.talk?.line || scene.talk?.queue.length));
  },
  cue(name) {
    const key = { flash: 'amulet-flash', ghost: 'ghost-fade-in', pulse: 'amulet-refuses', shake: 'earthquake', moth: 'bosses-moth-bursts-through-the-wall', absorb: 'boss-dissolve', dim: 'pen-scratch', guideBreak: 'story-guide-cracking-like-glass', glow: 'story-amulet-awakening', lastBeam: 'stag-beam' }[name];
    if (key) this.play(key);
    if (['moth', 'tree', 'stagAppear'].includes(name)) this.play('bosses-name-card-appears-all-bosses');
    if (['lastBeam', 'theEnd'].includes(name)) this.ending = true;
  },
  line(key, index) {
    const sound = { 'amulet:2': 'satchel-clink', 'firstPit:1': 'guide-snicker', 'curse:4': 'guide-sigh' }[`${key}:${index}`];
    if (sound) this.play(sound);
  },
};
GameAudio.init();
