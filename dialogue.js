// Dialogue: a panel at the top of the screen, the hero's portrait on the left and the guide's on the
// right, a name, and text that types out. Space, Enter or E first shows the whole line if it is still typing, then advances and settles the current action.
// While open, the scene controls the hero. Each script plays once per session.
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
  guide: ['smug', 'mischievous', 'teasing', 'exasperated', 'warning', 'surprised', 'pained'],
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
  lowDoor: [
    G("amused", "Well. You've locked yourself out. With yourself. That's a new one."),
    W(0.1, 'keys:retry'),
  ],
  letGo: [
    // The nap, at the start of World 2: he writes the note here (revealed in World 3).
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
    H("thinking", "No spikes. No thorns. No bugs. …Why does that make it worse?"),
    G("thinking", "Because this time, nothing's going to do it for you."),
    W(0.1, 'keys:letGo'),
  ],
  takeBack: [ // Take it back, on entry: his own soul plugs the tunnel
    H('annoyed', "Great. Now I'm in my own way."),
    G('wry', "Then take yourself back. You're allowed to change your mind."),
    H('thinking', '…First thing all week that lets me.'),
  ],
  twoPlaces: [ // Two places, on entry: the first room with swap
    H('curious', 'So I just… trade places? With me?'),
    G('wry', "You're both you. Nobody's going to complain."),
    H('thinking', 'Does the other one feel it?'),
    G('solemn', "…Best not to ask."),
    W(0.1, 'keys:swap'),
  ],
  chosenDeath: [
    W(0.8), // A beat.
    H("sad", "…You were right. That's worse."),
    G("sad", "I know."),
    G("wry", "It gets easier. That's the bad part."),
  ],
  carvings: [
    H("curious", "Hey. Look at the wall."),
    W(0.8), // Carvings: a crowd of figures, each with a gold circle on its chest.
    H("thinking", "They're all wearing it. The amulet."),
    G("solemn", "Keep going."),
    W(0.8), // Further along: fewer figures. Then a handful. Then one.
    H("scared", "Where'd everyone go?"),
    G("solemn", "…"),
    H("thinking", "It didn't save them. Did it."),
    G("sad", "It kept them going. That's not the same thing."),
    H("sad", "…"),
    H("determined", "Well. I'm not ending up as a carving."),
    G("wry", "That's the spirit. Ha. Spirit."),
  ],
  guideCrack: [
    H("thinking", "Hey. Can I ask you something?"),
    G("wry", "You're going to anyway."),
    H("thinking", "In your timeline. Did you ever get it off?"),
    W(0.8), // A beat.
    G("solemn", "…No."),
    G("thinking", "I followed the marks, same as you. All the way to the temple. A pyramid. Floor after floor."),
    H("curious", "How far did you get?"),
    G("weary", "Ninety."),
    H("startled", "NINETY?"),
    G("wry", "Don't look so impressed. It's not the top."),
    G("solemn", "I figured the deaths didn't have a limit. That I could just keep going until I got it right."),
    H("scared", "…They do?"),
    G("sad", "Must be. I'm here, aren't I?"),
    H("sad", "…"),
    G("mischievous", "Anyway! Better odds this time. You've got me."),
  ],
  pyramid: [
    H("startled", "…Whoa."),
    H("thinking", "That's it, isn't it. The temple."),
    G("solemn", "That's it."),
    H("thinking", "How many floors?"),
    G("wry", "More than ninety."),
    H("determined", "…Then let's get to the front door."),
  ],
  almostCompetent: [
    H("thinking", "You've been quiet."),
    G("wry", "Savoring it. You're almost competent."),
    H("cocky", "Almost?"),
    G("warm", "…More than I was."),
  ],
  breakingBeam: [
    H("startled", "Hold up. It destroyed my soul? MY soul?"),
    G("solemn", "Yeah. Ancient technology. Souls aren't supposed to break… but somehow they found a way."),
    H("annoyed", "Who's 'they'?"),
    G("wry", "Whoever built this place. They didn't leave notes."),
    H("scared", "Great. Soul-breaking antiques. Love that for me."),
  ],

  stagPromise: [
    W(0.8), // the guide stops; the hero walks a few steps before noticing
    G("thinking", "…Hold on."),
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
  stagDown: [ // the last stomp: the game takes over
    W(0.8),
    H("excited", "We did it! Did you see that? Three stomps, and I barely\u2014"),
    G("amused", "You died {deaths} times."),
    H("cocky", "{next}. But who's counting?"),
    G("warm", "Me. It was always me."),
    W(1.1, 'stagRise'), // behind his back, the stag calls out and gets up
    W(0.9, 'stagCharge'), // and turns on him, a beam gathering in its mouth
    { ...G("warning", "LOOK OUT!"), listen: "scared" },
    W(2.6, 'lastBeam'), // the ghost throws himself into the shot: everything goes white
    W(0.9),
    { ...G("pained", "Ugh\u2026"), listen: "scared" },
    { ...G("pained", "*crack*"), cue: 'crack' },
    H("shouting", "NO\u2014!"),
    W(1),
    // He is breaking apart: each line fainter (fade = his opacity), his words more broken; small cracks as he goes.
    { ...G("weary", "I knew\u2026 it would come to this."), fade: 0.62 },
    { ...G("weary", "Same thing\u2026 happened last time."), fade: 0.58, cue: 'crackle' },
    { ...G("sad", "My guide\u2026 did exactly this."), fade: 0.55 },
    H("shouting", "You KNEW? Then why would you\u2014"),
    W(0.6),
    { ...G("warm", "Because\u2026 I knew."), fade: 0.48 },
    W(1.2),
    H("sad", "\u2026"),
    { ...G("warm", "I've watched over you\u2026"), fade: 0.42, cue: 'crackle' },
    { ...G("warm", "You're already doing better than I did\u2026"), fade: 0.38 },
    { ...G("warm", "You'll get further."), fade: 0.35 },
    { ...G("solemn", "Just remember\u2026 the deaths\u2026 aren't free."), fade: 0.3 },
    { ...G("solemn", "Count\u2026 every one."), fade: 0.27 },
    H("sad", "Don't\u2014 you can't just\u2014"),
    W(0.8),
    { ...G("wry", "\u2026Hey."), fade: 0.22, cue: 'crackle' },
    { ...G("warm", "I was never\u2026 alive in the first place\u2026"), fade: 0.18 },
    { ...G("warm", "\u2026right?"), fade: 0.14 },
    W(2, 'guideBreak'), // after his last word, he shatters
    W(1.6, 'toNote'), // fade to black: next, he finds the note behind the old tree
  ],
  stagNote: [ // he finds it behind the old tree, kneels, and reads it in the ghost's voice (his portrait), in quotes
    H("scared", "Where\u2026 where is it?"),
    H("scared", "The thing he left behind the tree\u2026"),
    W(0.2), W(0.2), W(0.4), // he runs back and forth past the tree looking for it (each beat lasts until he gets there)
    H("sad", "Ah\u2026"),
    G("solemn", "\"Dear Me,\""),
    G("sad", "\"If you're reading this\u2026 then I've kicked the bucket.\""),
    G("weary", "\"Don't make that face. I can see it from here.\""),
    G("sad", "\"Well. Could.\""),
    G("solemn", "\"I guess it's time to come clean.\""),
    G("solemn", "\"You know how I said there was a limit?\""),
    G("sad", "\"That was a lie.\""),
    G("weary", "\"Figured you'd be more careful if you thought you were running out.\""),
    G("solemn", "\"The limit is when your spirit breaks.\""),
    G("sad", "\"And on floor ninety\u2026 mine did.\""),
    G("sad", "\"I just\u2026 stopped getting back up.\""),
    G("solemn", "\"So keep getting back up.\""),
    G("solemn", "\"No matter how hard it gets.\""),
    G("solemn", "\"No matter what.\""),
    G("weary", "\"Thanks for putting up with me. I know I'm not great company.\""),
    G("sad", "\"We'd know.\""),
    G("solemn", "\"And don't take my ending as yours.\""),
    G("warm", "\"You're me, sure\u2026 but you were different from the start.\""),
    G("warm", "\"You'll get further than I ever could.\""),
    G("warm", "\"Trust me.\""),
    G("sad", "\"\u2014 You\""),
    G("wry", "\"P.S. The amulet's still not worth anything. I checked.\""),
    H("sad", "\u2026"), // he stands up, quiet
  ],
  floorOne: [
    H("sad", "Ninety floors, huh?"),
    H("determined", "\u2026Don't worry. I'll get there in a flash."),
    H("determined", "And then I'm clearing this whole godforsaken temple. For both of us."),
    H("determined", "Watch me."),
    W(2.2, 'doorOpen'), // the doors open and he walks into the light on his own
    W(1, 'theEnd')
  ],
  clearing: [
    W(0.6),
    H('neutral', "Mannn… treasure hunting's slow these days."),
    H('thinking', "One good find. That's all I need. Then I could relax. Take it easy for once."),
    W(0.1, 'keys:move'),
  ],
  amulet: [ // the find and the meeting
    H('curious', "Hm? What's this?"),
    H('excited', "An amulet… I'm sure I can sell this for a good price."),
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
    G('sad', "…Guess it's my turn now."),
    W(0.8), // he shakes it off
    G('wry', 'Anyways. Which death are you on right now?'),
    H('thinking', 'Which… death?'),
    G('amused', 'Oh, a first-timer! This is my favorite part.'),
    G('wry', "Introductions, then. I'll cut to the chase."),
    { ...G('wry', "I'm you. From another timeline. Give or take a few thousand deaths."), reveal: true }, // named from here on
    W(0.8),
    H('startled', "You're… me?"),
    G('teasing', 'Same face. Same hair. Same bad decisions.'),
    W(1.2),
    H('exhausted', 'Ooook then. I must be dreaming.'),
  ],
  curse: [ // halfway to the clearing's exit
    H('annoyed', "…This all started when I put this thing on. Nope. I'm leaving it right here."),
    { ...H('startled', "…Why won't it come off?"), cue: 'pulse' },
    G('wry', "If I could've gotten it off that easily, believe me, I would've done it a looong time ago."),
    G('weary', 'If you want to try where I failed, be my guest. But be warned: I tried everything. And when I say everything, I mean everything.'),
    H('determined', "Then I'll find whoever made it. Somebody out there has to know how to get it off."),
    G('weary', "…That's what I said, too."),
    W(0.6), // he turns the amulet over
    { ...H('curious', "Hm. There's a mark on the back. Some kind of squiggle."), cue: 'pulse' },
    H('thinking', 'Whoever made this must have left it.'),
    G('thinking', "There's another one like it farther in."),
    G('weary', "Not that it'll get you anywhere."),
    H('determined', "Pointless or not, that's where I'm headed. The sooner this thing's off, the sooner I'm back to taking it easy."),
  ],
  firstPit: [ // Scene 3, at the edge of the pit
    H('thinking', "I'm not going to make it."),
    G('amused', '…heh.'),
    G('wry', 'Sure you will.'),
    H('startled', "Look at it! There's no way I can make it. This gap is like twice the length I can jump."),
    G('wry', "I'm you from the future. And I managed to get past this point."), // true: he got past it by dying
    G('amused', "You'll make it. Trust me."),
    H('determined', 'All right… here goes nothing.'),
  ],
  firstDeath: [ // he comes back at the room's start
    W(0.6), // he gasps awake back at the room's start
    H('pained', 'AAGH!'),
    H('startled', "…I'm… alive?"),
    H('pained', 'Ugh. Then why does it feel like someone scooped out half my insides?'),
    G('wry', 'Mm. That fades. Mostly.'),
    H('annoyed', "You. You said I'd make it."),
    G('wry', 'And you will.'),
    H('shouting', 'I landed on SPIKES! I trusted you!'),
    G('amused', 'Technically, you trusted yourself.'),
    H('annoyed', "…That's not the point."),
    H('thinking', 'Wait. I landed on spikes. So how am I standing here?'),
    G('thinking', 'The amulet. It keeps bringing you back.'),
    H('startled', 'Bringing me— so I DID die?!'),
    G('wry', "Sorta. Depends who's counting."),
    H('shouting', "That's NOT better!"),
    G('thinking', 'And that empty feeling? You left a piece of yourself out there.'),
    H('shouting', 'A PIECE OF ME?!'),
    G('amused', "Seeing's believing. Go on. Take a look."),
  ],
  soul: [ // back at the pit's edge
    H('startled', 'Is that… me?'),
    G('amused', "Yep. Well, your soul, technically."),
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
    G('wry', 'You used to climb trees all the time.'),
    H('annoyed', 'I was eight. And I fell out of most of them.'),
    G('amused', 'I remember.'),
  ],
  thornsHint: [ // his first death in the thorn wall room
    G('amused', "Now you're getting the hang of it."),
    G('wry', 'Mind how high you touch them, though.'),
  ],
  patrol: [
    H('exhausted', 'Lemme guess. I gotta die again.'),
    G('amused', 'No longer a greenhorn, are ya?'),
    W(0.1, 'keys:retry'), // the first plate puzzle with a bug: easy to get stuck, so show Shift+R here
  ],
  chain: [ // the first shrine; its mark matches the amulet's
    G('thinking', 'Oh, by the way. Take a look over there.'),
    H('curious', '…Over where.'),
    G('thinking', "The stone with the glowing mark. Try touching it."),
    H('annoyed', 'Last time you told me to try something, I ended up on spikes.'),
    G('amused', 'And look how well that turned out.'),
    H('annoyed', '…'),
    G('warm', "It won't hurt. Promise."),
    H('annoyed', "You promised I'd make it, too."),
    G('weary', "…Fine. Touch it. If you die, you'll come back there instead."),
    H('thinking', "Huh. That's actually useful."),
  ],
  slide: [ // The long pit, at the tunnel mouth
    H('thinking', "Spikes in a tunnel. I can't even jump in here."),
    G('wry', "Then don't jump."),
    H('annoyed', 'What, I just walk in?'),
    G('amused', 'Remember sliding down the hill behind the house? Feet first, flat on your back?'),
    H('exhausted', '…I ruined three pairs of pants doing that.'),
    G('wry', 'Four.'),
    W(0.1, 'keys:slide'),
  ],
  wallJump: [ // Thornwood, at the foot of the climbing shaft
    H('thinking', 'Too high to jump. Too narrow to… huh. Narrow.'),
    G('wry', 'Go on. Say it.'),
    H('thinking', "If I kick off one wall, I'd reach the other."),
    G('thinking', 'And then?'),
    H('determined', '…Kick off that one.'),
    G('amused', 'There he is.'),
    W(0.1, 'keys:wallJump'),
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
  dust: [ // 20th death in the fight: it flies too high to reach
    H('annoyed', "Ugh. I can't get high enough to stomp on it."),
    G('thinking', "I made it past here. There's a way."),
    H('annoyed', 'Then tell me!'),
    G('amused', "Where's the fun in that?"),
  ],
  dust2: [G('thinking', 'Remember the thorn wall? You needed a little extra height there, too.')], // 40th death (each try costs about two deaths)
  tree: [
    H('thinking', 'Big tree. Old tree. Very… still tree.'),
    G('warning', "Don't."), H('annoyed', "Don't what?"),
    { ...G('warning', "Don't say it's just a tree."), cue: 'tree' },
    H('scared', "…It's not just a tree."),
  ],
  treeSlam: [H('shouting', 'It keeps flattening me!'),
    G('warning', 'Hey.'), // its own line: a tap of Space meant for jumping spends this one, not the hint
    G('thinking', 'Try to guide the tree to attack your soul.')],
  treeSlam2: [G('thinking', 'Put your other self where its fists come down.')],
  treeDown: [
    W(0.8), H('exhausted', 'Is it…'), H('annoyed', "Don't you dare get back up."),
    W(1.2, 'glow'), W(1.4, 'absorb'), H('startled', 'Again?!'),
    G('thinking', 'Third mark.'), H('curious', 'Three of me now. And…?'),
    G('thinking', 'And you can trade places with one. Without dying.'),
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
    G('thinking', 'Second one.'),
    H('thinking', 'So… two of me now?'),
    G('thinking', 'Two. And you can take the newest back. No dying required.'),
    H('exhausted', 'Wonderful. Twice the dying.'),
    G('wry', 'Twice the options.'),
    H('thinking', '…Will it hurt any less?'),
    G('amused', 'Nope!'),
    W(0.8),
    G('thinking', 'And one more thing. You can let go now, whenever you like.'),
    H('curious', 'Let go of what?'),
    G('wry', "Yourself. Trust me, it's worse when you choose it."),
    W(0.8),
    H('exhausted', '…Great. Something to look forward to.'),
    W(0.1, 'keys:recall'), // Q is taught here, as the moth grants it
  ],
};

// Staging: walk (tile x), face, pose, hop, gesture, amulet, guide ({x, y}), guideBy (tiles), cue.
// Marks are room-local tile coordinates; spoken text stays in SCRIPT above.
const stage = (key, index, { face, ...action }) => Object.assign(SCRIPT[key][index],
  action, face ? { facing: face } : {});
for (const key of Object.keys(SCRIPT)) stage(key, 0, { face: 'guide', pose: 'idle' });
stage('clearing', 0, { walk: 4, face: 'right' });
stage('clearing', 1, { walk: 5, face: 'right' });
stage('clearing', 2, { walk: 6, face: 'right' });
stage('amulet', 0, { walk: 11, face: 'right', pose: 'kneel', amulet: 'ground' });
stage('amulet', 1, { walk: 11.5, pose: 'hold', amulet: 'hold', turnAmulet: true });
stage('amulet', 2, { amulet: 'hand' });
stage('amulet', 3, { pose: 'idle', amulet: 'wear' });
stage('amulet', 6, { walk: 11, face: 'guide', hop: true });
stage('amulet', 7, { face: 'guide' });
stage('amulet', 9, { lookAround: true });
stage('amulet', 11, { guideBy: -0.5 });
stage('amulet', 22, { walk: 11.5, face: 'guide' });
stage('amulet', 25, { face: 'left' });
stage('curse', 0, { walk: 16.5, face: 'right' });
stage('firstPit', 0, { walk: 9, face: 'right' });
stage('firstPit', 6, { face: 'right' });
stage('firstDeath', 0, { walk: 2.5, pose: 'slump' });
stage('firstDeath', 4, { pose: 'idle', face: 'guide' });
stage('soul', 0, { walk: 9, face: 'right' });
for (const key of ['thorns', 'patrol', 'chain', 'shrineMark', 'carvings', 'pyramid', 'tree', 'stagArrival'])
  stage(key, 0, { face: 'right' });
for (const [key, x] of [['thorns', 4], ['patrol', 4], ['chain', 4], ['tree', 8], ['pyramid', 5], ['carvings', 27]])
  stage(key, 0, { walk: x });
stage('carvings', 3, { walk: 31, face: 'right' });
stage('carvings', 4, { walk: 36, face: 'right' });
stage('moth', 0, { walk: 9, face: 'right', speed: 22 });
stage('moth', 1, { walk: 10, face: 'right', speed: 22 });
stage('moth', 2, { walk: 11, face: 'right', speed: 22 });
stage('stagPromise', 0, { walk: 20, guide: { x: 18, y: 13 }, face: 'guide' });
stage('stagNote', 0, { face: 'right' }); // he says it where he stands; the search is the silent run that follows
stage('stagNote', 2, { walk: 23, speed: 190 }); // scrambling: running past the tree and back (silent beats: Space doesn't cut them short)
stage('stagNote', 3, { walk: 17, speed: 190 });
stage('stagNote', 4, { walk: 19.5, speed: 150, face: 'left' });
stage('stagNote', 5, { pose: 'kneel' }); // Ah… He bends down to read
stage('stagNote', SCRIPT.stagNote.length - 1, { pose: 'idle' });
// The stag's fall: walk away from where it lies into the open clearing, back turned to it.
const stagTile = (scene) => { const B = scene.bosses.find((b) => b.stag), r = scene.rooms[scene.index].rect; return ((B?.img ?? B?.r)?.x - r.x) / 32 || 25; };
const awayFromStag = (scene) => (stagTile(scene) > (scene.player.x - scene.rooms[scene.index].rect.x) / 32 ? 'left' : 'right');
const stagWalk = (scene) => { const t = stagTile(scene); return t > 20 ? Math.max(4, t - 11) : Math.min(35, t + 11); };
// He walks away with his back to the stag; the ghost waits a little further on, so he faces the ghost as they talk.
stage('stagDown', 1, { walk: stagWalk, face: awayFromStag,
  guide: (scene) => { const x = stagWalk(scene); return { x: x + (stagTile(scene) > x ? -1.6 : 1.6), y: 13.3 }; } });
for (const i of [2, 3, 4]) stage('stagDown', i, { face: awayFromStag });
stage('stagDown', 7, { face: awayFromStag });
stage('stagDown', 12, { hop: true, face: 'guide' }); // NO—!
stage('stagDown', 13, { pose: 'slump' });
stage('stagDown', 22, { pose: 'idle', face: 'guide' });
stage('floorOne', 0, { walk: 5, face: 'right' });
stage('floorOne', 4, { walk: 15, face: 'right' }); // into the doorway (game.js draws it at 15)
// The nap: the game walks him in, he lies down, full dark, and he gets up at dawn.
stage('letGo', 0, { walk: 4, face: 'right' });
stage('letGo', 2, { pose: 'sleep' });
stage('letGo', 3, { pose: 'sleep' });
stage('letGo', 4, { guideBy: 0.5 });
stage('letGo', 8, { pose: 'idle', hop: true, face: 'guide' });

// Small reactions also give the quieter exchanges a body beat on each panel.
for (const lines of Object.values(SCRIPT)) for (const l of lines) {
  if (!l.text) continue;
  l.gesture = ['sad', 'exhausted', 'pained'].includes(l.face) ? 'bow' : 'nod';
  l.facing ??= l.who === 'guide' ? 'guide' :
    ['thinking', 'exhausted', 'sad'].includes(l.face) ? 'right' : 'guide';
  if (['startled', 'shouting'].includes(l.face)) l.hop ??= true;
}
stage('curse', 0, { amulet: 'pull', pose: 'kneel' });
stage('curse', 1, { amulet: 'wear', pose: 'idle', hop: true });
stage('curse', 4, { walk: 17, face: 'right' });
stage('curse', 7, { pose: 'hold', amulet: 'hold' });
stage('curse', 11, { pose: 'idle', amulet: 'wear', walk: 17.5, face: 'right' });
stage('firstPit', 3, { pose: 'kneel', face: 'right', camera: { x: -32, y: -20 } });
stage('firstPit', 6, { pose: 'idle', face: 'right' });
stage('firstDeath', 1, { pose: 'pained' }); // AAGH!
stage('firstDeath', 3, { pose: 'pained' }); // scooped out half my insides
stage('firstDeath', 5, { pose: 'idle', face: 'guide' });
stage('firstDeath', 17, { guideBy: 1 });
stage('soul', 4, { pose: 'slump', face: 'right' });
stage('soul', 8, { pose: 'idle', face: 'right' });
stage('chain', 1, { face: 'right' });
stage('chain', 2, { guideBy: 0.5 });
stage('chain', 3, { face: 'guide' });
stage('chain', 9, { walk: 4.5, face: 'right' });
stage('shrineMark', 0, { pose: 'hold', amulet: 'hold' });
stage('shrineMark', 1, { pose: 'idle', amulet: 'wear' });
stage('pyramid', 1, { face: 'right', camera: { x: -24, y: 32 } });
stage('tree', 4, { walk: 7.5, hop: true, face: 'right' });
stage('mothDown', 4, { hop: true });
stage('mothDown', 12, { pose: 'hold', amulet: 'hold' });
stage('mothDown', 13, { pose: 'idle', amulet: 'wear' });
stage('stagPromise', 5, { face: 'left' });
stage('stagPromise', 6, { walk: 20.5, face: 'left' });
stage('stagPromise', 7, { walk: 20, face: 'guide' });
stage('floorOne', 1, { walk: 8, face: 'right' });
stage('floorOne', 2, { walk: 11, face: 'right' });

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
    if (!scene.talk.active) {
      scene.player.body.setVelocityX(0);
      scene.slide = scene.charge = scene.kick = scene.buffer = scene.wallCoyote = 0;
      scene.sdLock = true;
      scene.setLying(false);
      scene.talk.landing = 1;
      GameAudio.loop(scene, 'hero-release-wind-up', false, 0.5);
    }
    scene.talk.active = true;
    scene.talk.queue.push(...SCRIPT[key].map((l, i) => ({ ...l, audioScript: key, audioIndex: i })));
    return true;
  },

  mark(scene, tile) {
    const p = scene.player, r = scene.rooms[scene.index].rect;
    const solids = scene.statics.getChildren().filter((s) => s.body.enable);
    const hazards = [...scene.spikes.map(bounds), ...scene.beams()];
    const target = r.x + tile * 32;
    const overlap = (a, b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
    // Prefer the authored mark; if it is unsafe, use the nearest supported column.
    for (let d = 0; d < r.width; d += 16) for (const x of d ? [target - d, target + d] : [target]) {
      if (x < r.x + 20 || x > r.right - 20) continue;
      const floors = solids.filter((s) => x >= s.body.left && x <= s.body.right &&
        s.body.top >= p.y - 16 && s.body.top < r.bottom).sort((a, b) => a.body.top - b.body.top);
      for (const floor of floors) {
        const box = { x: x - p.width / 2, right: x + p.width / 2,
          y: floor.body.top - 30, bottom: floor.body.top - 0.1 };
        if (solids.some((s) => overlap(box, s.body)) || hazards.some((h) => overlap(box, h))) continue;
        return { x, y: floor.body.top - p.height / 2 };
      }
    }
    return { x: scene.start.x, y: scene.start.y };
  },

  act(scene, l, skip = false) {
    const p = scene.player, g = scene.guide, r = scene.rooms[scene.index].rect;
    // A walk mark or facing can be worked out when the line starts (e.g. away from where the stag fell).
    if (typeof l.walk === 'function') l.walk = l.walk(scene);
    if (typeof l.facing === 'function') l.facing = l.facing(scene);
    if (typeof l.guide === 'function') l.guide = l.guide(scene);
    if (!skip) {
      scene.talk.motion = { elapsed: 0, feet: p.y + p.height / 2, height: p.height,
        mark: l.walk === undefined ? null : this.mark(scene, l.walk),
        guideX: g.x, guideTarget: l.guide ? r.x + l.guide.x * 32 : g.x + (l.guideBy || 0) * 32 };
    }
    const m = scene.talk.motion;
    if (l.fade !== undefined) g.maxAlpha = l.fade; // the ghost fading as he breaks apart
    if (l.lookAround) g.looking = !skip;
    if (l.guide && g) g.hoverY = r.y + l.guide.y * 32;
    if (skip && (l.guide || l.guideBy)) g.x = m?.guideTarget ??
      (l.guide ? r.x + l.guide.x * 32 : g.x + l.guideBy * 32);
    if (skip && l.walk !== undefined) {
      const mark = m?.mark ?? this.mark(scene, l.walk);
      p.body.reset(mark.x, mark.y + (m?.mark ? m.height - p.height : 0) / 2);
    } else if (skip && l.hop && m) p.body.reset(p.x, m.feet - p.height / 2);
    if (l.pose) {
      scene.setLying(false);
      if (scene.cutPose !== l.pose) { scene.cutPose = l.pose; scene.cutPoseAt = scene.time.now; } // game.js draws it (HERO_POSES)
    }
    if (l.facing) scene.face = l.facing === 'guide' ? (g.x < p.x ? -1 : 1) : l.facing === 'left' ? -1 : 1;
    if (l.amulet) {
      scene.amuletPose = l.amulet;
      if (l.amulet === 'wear') scene.wearing = true;
    }
    if (skip) {
      this.settleCue(scene, l);
      p.body.setVelocity(0, 0);
      scene.heroSprite?.setAngle(0);
      g.setAngle(0);
    }
  },

  settleCue(scene, l) {
    const g = scene.guide;
    if (l.cue === 'ghost' || l.cue === 'guideBreak') {
      scene.tweens.killTweensOf(g);
      g.fading = false;
      g.setAlpha(l.cue === 'ghost' ? 0.7 : 0);
    }
    if (l.cue === 'lookaround' || l.lookAround) { g.looking = false; g.setFlipX(g.x > scene.player.x); }
    if ((l.cue === 'dim' || l.cue === 'undim') && scene.dimmer) {
      scene.tweens.killTweensOf(scene.dimmer);
      scene.dimmer.setAlpha(l.cue === 'dim' ? 1 : 0);
    }
  },

  move(scene, dt) {
    const t = scene.talk, l = t.line, m = t.motion, p = scene.player;
    m.elapsed += dt;
    const camera = scene.cameras.main, tall = scene.rooms[scene.index].rect.height > camera.height;
    camera.setFollowOffset(l.camera?.x || 0, (tall ? -camera.height * 0.4 : 0) + (l.camera?.y || 0));
    if (m.mark) {
      const delta = m.mark.x - p.x;
      p.body.setVelocityX(Math.abs(delta) > 2 ? Math.sign(delta) * (l.speed || 100) : 0);
      if (Math.abs(delta) > 2) scene.face = Math.sign(delta);
      else if (l.facing) scene.face = l.facing === 'guide' ? (scene.guide.x < p.x ? -1 : 1) : l.facing === 'left' ? -1 : 1;
    }
    if (l.hop && !m.hopped) { p.body.setVelocityY(-140); m.hopped = true; }
    if (l.cue === 'lookaround' || l.lookAround) scene.guide.setFlipX(m.elapsed < 0.5 ? false : m.elapsed < 1 ? true : scene.guide.x > p.x);
    if (l.guide || l.guideBy) scene.guide.x = Phaser.Math.Linear(m.guideX, m.guideTarget, Math.min(1, m.elapsed / 0.6));
    if (l.gesture) {
      const beat = Math.sin(Math.min(1, m.elapsed / 0.5) * Math.PI);
      const actor = l.who === 'guide' ? scene.guide : scene.heroSprite;
      actor?.setAngle(beat * (l.gesture === 'bow' ? 7 : -4) * scene.face);
    }
    const pose = scene.amuletPose;
    if (pose && pose !== 'wear') {
      if (!scene.heldAmulet) scene.heldAmulet = (scene.textures.exists('amulet')
        ? scene.add.image(0, 0, 'amulet').setDisplaySize(14, 18)
        : scene.add.circle(0, 0, 6, 0xffd774).setStrokeStyle(2, 0xb07a22)).setDepth(6);
      const cupped = pose === 'hold' && scene.cutPose === 'hold'; // in the palm of the holding-up pose
      scene.heldAmulet.setVisible(true).setPosition(p.x + scene.face * (pose === 'ground' ? 8 : cupped ? 4 : 14),
        p.body.bottom - (pose === 'ground' ? 5 : cupped ? 19 : pose === 'hold' ? 40 : 23) -
          (pose === 'pull' ? Math.sin(m.elapsed * 20) * 3 : 0));
      scene.heldAmulet.setAngle(l.turnAmulet ? Math.sin(Math.min(1, m.elapsed / 0.8) * Math.PI) * 160 : 0);
    } else scene.heldAmulet?.setVisible(false);
  },

  finish(scene) {
    scene.player.body.setVelocityX(0);
    scene.heldAmulet?.setVisible(false);
    scene.heroSprite?.setAngle(0);
    scene.guide.setAngle(0);
    scene.amuletPose = null;
    scene.setLying(false);
    const p = scene.player, r = scene.rooms[scene.index].rect;
    if (scene.spikes.some((h) => hit(bounds(p), bounds(h))) || scene.laserHit()) {
      const mark = this.mark(scene, (p.x - r.x) / 32);
      p.body.reset(mark.x, mark.y);
    }
    const camera = scene.cameras.main;
    camera.setFollowOffset(0, r.height > camera.height ? -camera.height * 0.4 : 0);
    scene.talk.ui.setVisible(false);
    scene.blockedKeys = new Map();
    for (const key of Object.values(scene.keys)) if (key.isDown) scene.blockedKeys.set(key, key.timeDown);
    scene.talk.landing = 0;
    scene.talk.active = false;
  },

  // Esc: jump to the end of the conversation, still firing its cues (the ghost appears, the boss arrives).
  skip(scene) {
    const t = scene.talk;
    if (!t.line && !t.queue.length) return;
    if (t.line) this.act(scene, t.line, true);
    for (const l of t.queue) {
      t.motion = null;
      this.act(scene, l, true);
      if (l.reveal) NAMES.guide = 'Yourself';
      if (l.cue && l.cue !== 'lookaround') scene.cue?.(l.cue);
      this.settleCue(scene, l);
    }
    t.queue.length = 0;
    t.line = null;
    const p = scene.player, r = scene.rooms[scene.index].rect;
    const mark = this.mark(scene, (p.x - r.x) / 32);
    p.body.reset(mark.x, mark.y);
    this.finish(scene);
  },

  // Returns true while the scene owns the hero's movement.
  update(scene, dt, advance) {
    const t = scene.talk;
    if (t.active && t.landing) {
      scene.player.body.setVelocityX(0);
      t.landing = Math.max(0, t.landing - dt);
      if (t.landing && !scene.player.body.blocked.down && !scene.player.body.touching.down) return true;
      t.landing = 0;
    }
    if (!t.line) {
      if (!t.queue.length) {
        if (t.active) {
          this.finish(scene);
          return true; // This frame's input was read before the closing snapshot.
        }
        return false;
      }
      t.line = t.queue.shift();
      t.shown = 0;
      t.waitLeft = t.line.wait ?? 0; // a silent beat's timer (kept off the script, so a replay waits again)
      this.act(scene, t.line);
      scene.player.body.setVelocityX(0);
      this.move(scene, 0);
      t.text.setText('');
      GameAudio.line(t.line.audioScript, t.line.audioIndex);
      if (t.line.reveal) NAMES.guide = 'Yourself';
      if (t.line.cue === 'lookaround') scene.guide.looking = true;
      else if (t.line.cue) scene.cue?.(t.line.cue);
      if (t.line.cue === 'lastBeam') scene.guide.hoverY = scene.guide.y;
      t.ui.setVisible(!!t.line.text);
      if (!t.line.text) return true;
      const speaking = t.line.who, other = speaking === 'hero' ? 'guide' : 'hero';
      t.name.setText(NAMES[speaking]);
      const pic = t[speaking];
      const setFace = (who, face) => {
        const pic = t[who];
        if (pic.placeholder) return pic.placeholder.setText(face);
        // Second-sheet face if that sheet exists, otherwise the closest face from the first sheet.
        const key = `portrait-${who}`;
        if (FACES2[who].includes(face) && scene.textures.exists(`${key}2`)) pic.setTexture(`${key}2`, FACES2[who].indexOf(face));
        else pic.setTexture(key, Math.max(0, FACES[who].indexOf(FACES[who].includes(face) ? face : FALLBACK[face])));
      };
      setFace(speaking, t.line.face);
      if (t.line.listen) setFace(other, t.line.listen); // the greyed-out listener's reaction
      pic.setAlpha(1);
      t[other].setAlpha(0.3);
      return true;
    }
    this.move(scene, dt);
    if (!t.line.text && t.motion.mark) advance = false; // a silent walk plays out (Space used to snap him to its end); Esc still skips the scene
    if (advance && (t.motion.mark && Math.abs(t.motion.mark.x - scene.player.x) > 2 || t.line.wait !== undefined)) {
      this.act(scene, t.line, true);
      t.line = null;
      return this.update(scene, 0, false);
    }
    if (t.line.wait !== undefined) { // stays a beat after its timer runs out, until a walk in it arrives
      t.waitLeft = Math.max(0, t.waitLeft - dt);
      // A silent beat with a walk lasts until he gets there (a short beat used to cut the walk off and snap him to the mark).
      const walking = t.motion.mark && Math.abs(t.motion.mark.x - scene.player.x) > 2 && t.motion.elapsed < 6;
      if (!t.waitLeft && !walking) { this.act(scene, t.line, true); t.line = null; }
      return true;
    }
    if (!t.line.text) { this.act(scene, t.line, true); t.line = null; return true; }
    const full = t.line.text.length;
    if (advance && t.shown < full) { t.shown = full; advance = false; } // first press shows the whole line, the next one moves on
    else if (advance) {
      this.act(scene, t.line, true); t.line = null; return this.update(scene, 0, false);
    }
    const before = Math.floor(t.shown / 3);
    t.shown = Math.min(full, t.shown + dt * 45);
    if (!advance && Math.floor(t.shown / 3) > before) GameAudio.play(`dialogue-blip-${t.line.who === 'guide' ? 'ghost-guide' : 'hero'}`, 3, 0.25);
    t.text.setText(t.line.text.slice(0, Math.floor(t.shown)));
    t.hint.setAlpha(t.shown >= full ? 0.6 + Math.sin(scene.time.now / 250) * 0.3 : 0);
    return true;
  },
};
