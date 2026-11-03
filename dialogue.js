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
// Written from docs/STORY.md (World 1 script); change the story there first.
const SCRIPT = {
  stagPromise: [
    H("curious", "What? You never stop."),
    G("thinking", "Can you promise me something?"),
    H("annoyed", "\u2026That depends."),
    G("warm", "After the next fight, go take a look behind this tree."),
    H("curious", "What's back there?"),
    G("amused", "Nope! Not yet. No peeking."),
    H("annoyed", "You're doing the mysterious thing again."),
    G("warm", "Promise me."),
    H("exhausted", "\u2026Fine. I promise.")
  ],
  stagArrival: [
    H("scared", "Tell me you remember this one."),
    G("solemn", "I remember this one."),
    { ...H("determined", "\u2026Okay. I've got this."), cue: "stagAppear" },
    G("warm", "Look at you.")
  ],
  stagNudge: [
    G("thinking", "You did this an hour ago. Lead it away.")
  ],
  stagDown: [
    H("excited", "We did it! Did you see that? Three stomps, and I barely\u2014"),
    G("amused", "You died {deaths} times."),
    H("cocky", "{next}. But who's counting?"),
    G("warm", "Me. It was always me."),
    { ...G("warning", "LOOK OUT!"), cue: 'lastBeam' },
    H("shouting", "NO\u2014!"),
    G("pained", "Ugh\u2026 I knew it would come to this."),
    G("weary", "Same thing happened last time. My guide did exactly this."),
    H("shouting", "You KNEW? Then why would you\u2014"),
    G("warm", "Because I knew."),
    H("sad", "\u2026"),
    G("warm", "I've watched over you. You're already doing better than I did. You'll get further."),
    G("solemn", "Just remember\u2026 the deaths aren't free. Count every one."),
    H("sad", "Don't\u2014 you can't just\u2014"),
    G("wry", "Hey."),
    { ...G("warm", "I was never alive in the first place, right?"), cue: 'guideBreak' },
    W(1.6, 'stagGone')
  ],
  stagNote: [
    H("sad", "If you're reading this\u2026 then it must mean I've kicked the bucket."),
    H("sad", "Don't make that face. I can see it from here. Well. Could."),
    H("sad", "Well, I guess it's time to come clean."),
    H("sad", "You know how I said there was a limit? That was a lie. Figured you'd be more careful if you thought you were running out."),
    H("sad", "The limit is when your spirit breaks. On floor ninety, mine did, and I just\u2026 stopped getting back up."),
    H("sad", "So keep getting back up. No matter how hard it gets. No matter what."),
    H("sad", "Thanks for putting up with me. I know I'm not great company. I'd know."),
    H("sad", "And don't take my ending as yours. You're me, sure, but you were different from the start."),
    H("sad", "You'll get further than I ever could."),
    H("sad", "Trust me."),
    H("sad", "\u2014 You"),
    H("sad", "P.S. The amulet's still not worth anything. I checked.")
  ],
  floorOne: [
    H("sad", "\u2026Idiot."),
    H("determined", "Ninety floors, huh."),
    H("determined", "Then I'm not stopping at ninety."),
    W(1, 'theEnd')
  ],
  clearing: [
    W(0.6),
    H('neutral', "Mannn… treasure hunting's slow these days."),
    H('thinking', "One good find. That's all I need. Then I could relax. Take it easy for once."),
  ],
  amulet: [ // the find and the meeting
    H('curious', "Hm? What's this?"),
    H('excited', "An amulet… if that's pure gold, it'd fetch a pretty penny."),
    W(0.8), // tools clink in his satchel
    { ...H('thinking', "It'd get scratched to bits in there, though. Welp. I'll wear it for now."), cue: 'wear' },
    W(0.7, 'flash'),
    W(1.2, 'ghost'),
    H('startled', 'WAH—!'),
    H('scared', 'Wh— where did you come from?!'),
    W(0.2, 'lookaround'),
    G('thinking', 'Where am I?'),
    H('annoyed', "You're asking ME?"),
    W(0.9), // his eyes settle on the hero
    G('solemn', '…Oh.'), // he realizes what he's become; the player learns why in World 2
    W(1.2),
    G('wry', 'Anyways. Which death are you on right now?'),
    H('thinking', 'Which… death?'),
    G('amused', 'A first-timer! Introductions, then.'),
    H('curious', 'Hang on. You look like me.'),
    { ...G('solemn', 'I am you. From another timeline. A few thousand deaths ahead.'), reveal: true }, // named from here on
    W(1.2),
    H('exhausted', 'Ooook then. I must be dreaming.'),
  ],
  curse: [ // halfway to the clearing's exit
    H('annoyed', "It's this blasted amulet. I'm leaving it right here."),
    { ...H('startled', "…Why won't it come off?"), cue: 'pulse' },
    G('solemn', "It won't let go. And it won't let you stay dead."),
    H('determined', 'Then someone out there knows how to get it off.'),
    { ...G('weary', '…Fine. Start with the tribe that made it. See the mark on it?'), cue: 'pulse' },
    H('thinking', 'This squiggle?'),
    G('thinking', "There's another one like it farther in."),
    H('neutral', "All right. But if this is a waste of time, I'm going home."),
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
  firstDeath: [ // he comes back at the room's start
    W(0.6),
    H('pained', 'AAGH!'),
    H('pained', 'Am… I alive?'),
    H('pained', 'Why does it feel like someone scooped out half my insides?'),
    G('wry', 'Mm. That fades. Mostly.'),
    H('annoyed', "You. You said I'd make it."),
    G('thinking', 'And you will.'),
    H('shouting', 'I landed on SPIKES. I trusted you!'),
    G('wry', "Hey, it's not like you actually died. …Well, sorta."),
    H('startled', "That's NOT better!"),
    G('thinking', "That empty feeling's real, though. You left a piece of yourself out there."),
    H('shouting', 'A PIECE OF ME?!'),
    G('amused', "Seeing's believing. Come take a look."),
  ],
  soul: [ // back at the pit's edge
    H('startled', 'Is that… me?'),
    G('amused', "Yep. And more specifically, it's your soul."),
    H('startled', "My SOUL? Isn't that supposed to be, I dunno, inside me?"),
    G('wry', 'Most of it still is.'),
    H('thinking', "…It's just floating there."),
    G('thinking', "It'll hold you. Go on, stand on it."),
    H('annoyed', "I'm not stepping on my own soul."),
    G('wry', "You'd rather jump in again?"),
    H('exhausted', '…Fine. Sorry, me.'),
  ],
  thorns: [
    H('thinking', "That's way too high to climb."),
    H('annoyed', '…And let me guess. The thorns.'),
    G('amused', "Now you're getting the hang of it. Touch them on the way up, about two tiles off the ground. Leave a step you can reach."),
  ],
  patrol: [
    G('thinking', "See that plate? It holds the door open, as long as something's on it."),
    H('exhausted', 'Lemme guess. I gotta die again.'),
    G('amused', 'No longer a greenhorn, are ya?'),
  ],
  chain: [ // the first shrine; its mark matches the amulet's
    G('thinking', 'Oh, by the way. Take a look over there.'),
    H('curious', '…Over where.'),
    G('thinking', "The stone with the glowing mark. That's an artifact. Try touching it."),
    H('annoyed', 'Last time you told me to try something, I ended up on spikes.'),
    G('amused', 'And look how well that turned out.'),
    H('annoyed', '…'),
    G('warm', "It won't hurt. Promise."),
    H('annoyed', "You promised I'd make it, too."),
    G('weary', '…Fine. Touch it, and when you die, you come back there instead of all the way at the start.'),
    H('thinking', "Huh. That's actually useful."),
  ],
  shrineMark: [ // first time he touches a shrine
    H('curious', "Wait. That mark… it's the same as the one on the amulet."),
    G('wry', "Told you you'd see it before long."),
  ],
  moth: [
    { ...H('startled', "What's with this shaking… is this an earthquake?"), cue: 'shake' },
    G('surprised', "Oh shoot, it's been so long that I forgot. Be careful! Watch out for…"),
    { ...G('wry', '…that.'), cue: 'moth' },
  ],
  dust: [ // 2nd death in the fight
    H('shouting', "That's impossible! There's nowhere to hide from that!"),
    G('thinking', "I made it past here. There's a way."),
    H('annoyed', 'Then tell me!'),
    G('amused', "Where's the fun in that?"),
  ],
  dust2: [G('thinking', "Your soul caught you over the thorns. Think it'd catch a little dust?")], // 25th death (each try costs about two deaths)
  tree: [
    H('thinking', 'Big tree. Old tree. Very… still tree.'),
    G('warning', "Don't."), H('annoyed', "Don't what?"),
    { ...G('warning', "Don't say it's just a tree."), cue: 'tree' },
    H('scared', "…It's not just a tree."),
  ],
  treeSlam: [H('shouting', 'It smashed me! The other me! It keeps smashing me!'),
    G('thinking', 'Watch where it looks before it swings.')],
  treeSlam2: [G('thinking', 'It always goes for the one closest to you. Use that.')],
  treeDown: [
    W(0.8), H('exhausted', 'Is it…'), H('annoyed', "Don't you dare get back up."),
    W(1.2, 'glow'), W(1.4, 'absorb'), H('startled', 'Again?!'),
    G('thinking', 'Third mark.'), H('curious', 'Three of me now. And…?'),
    G('thinking', 'And you can take them back. All of them, at once. Without dying.'),
    H('relieved', "Finally. One that doesn't hurt."), G('wry', "Don't get used to it."),
  ],
  mothDown: [ // the last stomp
    W(0.8),
    H('exhausted', 'Is it… over?'),
    H('relieved', "It's over."),
    W(1.2, 'glow'),
    H('startled', "Wait, what's happening?"),
    W(1.4, 'absorb'),
    H('shouting', 'Whoa— WHOA!'),
    W(0.8),
    H('thinking', 'What… just happened?'),
    G('thinking', "The amulet absorbed it. Your soul's a little stronger now."),
    H('scared', 'It ABSORBED it? A whole moth?'),
    G('wry', "It's not picky."),
    H('curious', '…Another mark lit up.'),
    G('thinking', 'Means you can leave two of yourself behind now.'),
    H('exhausted', 'Wonderful. Twice the dying.'),
    G('wry', 'Twice the options.'),
    H('thinking', '…Will it hurt any less?'),
    G('amused', 'Nope!'),
    W(0.8),
    G('thinking', 'And one more thing. You can let go now, whenever you like.'),
    H('curious', 'Let go of what?'),
    G('wry', "Yourself. Trust me, it's worse when you choose it."),
    // The nap: he writes the note here (revealed in World 3).
    H('exhausted', 'I need… a minute. Or a hundred.'),
    G('wry', "Go on. I'll keep watch. Not like I sleep."),
    H('exhausted', 'Wake me if anything else comes through a wall.'),
    W(1.6, 'dim'),
    G('thinking', '…'),
    G('sad', '…'),
    W(1.4),
    W(1.2, 'undim'),
    H('curious', 'Did you just… sit there all night?'),
    G('wry', "Floated. There's a difference."),
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
