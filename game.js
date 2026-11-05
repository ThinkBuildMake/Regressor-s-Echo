// Greybox testbed for "death leaves a platform".
// Rooms are text grids below; each character becomes an object on screen.
// Rule switches toggle live with keys 1-4.

const T = 32;

// Movement feel
const SPEED = 220, ACCEL = 2000, AIR_ACCEL = 1400;
const AIR_DRAG = 220; // in the air with no key held, momentum fades slowly, so jumps arc
const GRAVITY = 1400, JUMP = 550, MAX_FALL = 800; // ~3.4 tiles high, ~5 tiles running jump
const COYOTE = 0.1, BUFFER = 0.1, RESPAWN_DELAY = 0.35;
// Slide: S/↓ while running. Jumping mid-slide is a dive (stay flat in the air).
// Dying while flat leaves a lying body (2 tiles wide, ½ tall) instead of a standing one.
const SLIDE_SPEED = 320, SLIDE_TIME = 0.4;
const STAND = [24, 30], FLAT = [40, 14];               // player hitbox
const HERO_HEIGHT = 46;                                // painted hero's on-screen height (hair pokes above the hitbox)
const HERO_SRC = 112;                                  // his typical height in the processed images (tools/sheet.mjs --height)
// Run cycle: which frames of assets/hero/run.webp to loop, and how far he moves per frame.
// Try orders and pacing in tools/preview.html, then copy the settings here.
const RUN_FRAMES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], RUN_STEP = 12; // Veo run: one full stride in 12 frames
// Cutscene poses (dialogue.js `pose`): sheet, frame count (into the pose, then held), feet position across the frame.
const HERO_POSES = { kneel: ['heroKneel', 4, 0.49], slump: ['heroSlump', 4, 0.36], sleep: ['heroSlump', 4, 0.36],
  hold: ['heroHold', 3, 0.67], pained: ['heroPained', 3, 0.56] };
const RUN_SCALE = 1.12, WALL_SCALE = 1.3; // the Veo run and wall slide draw him smaller in their cells than the idle does
// Slide: loop the first row of assets/hero/slide.webp so the cape flutters.
const SLIDE_FRAMES = [0, 1, 2, 3], SLIDE_FPS = 8;
const BODY_STAND = [30, 32], BODY_LYING = [62, 16];    // body left behind

// Enemies: walkers patrol, turn at walls/bodies/ledges, kill on touch, die when a falling body lands on them.
const WALKER_SPEED = 60;
// Painted walker (assets/enemies/walker.webp, 6 frames facing left): loops two leg poses with a small bob.
const WALKER_FRAMES = [0, 1], WALKER_FPS = 8, WALKER_HEIGHT = 26, WALKER_SRC = 56; // SRC = sheet.mjs --height
// Boss: floats back and forth too high to reach from the floor. Stomp its top from a body (1 high is
// right, 2 high puts you in its path). Speeds up per hit. Heals to full whenever you die.
const BOSS_HP = 3, BOSS_SPEED = 100, BOSS_SPEEDUP = 50;
// Painted moth (assets/bosses/moth-fly.webp, 4 frames facing left: wings up, flat, down, flat) over the boss hitbox.
// MOTH_SIZE grows painting and hitbox together. Its top stays 4 tiles up: out of jump reach from the
// floor (~3.4 tiles), in reach from one soul, so stomping it always takes a death.
const MOTH_SIZE = 1.3, BOSS_W = 96 * MOTH_SIZE, BOSS_H = 48 * MOTH_SIZE;
const MOTH_FRAMES = [...Array(12).keys()], MOTH_FPS = 16, MOTH_SCALE = 0.243 * MOTH_SIZE; // frames are full size (700 px tall); frame 2 reused for 4 so the loop can't shimmer
// Its intro: it bursts out of the right wall at these rows (top, bottom) of its room. The hole is only
// painted; the wall keeps its colliders, so the arena stays closed.
const MOTH_HOLE = [2, 9];
// Tree: lumbers toward you; swing, seed pods, slam, spikes. A slam that lands on a soul sticks its hands for TREE_STUCK s
// (stomp the bowed mask); the soul is unharmed. Spikes cover the whole floor for TREE_SPIKES_UP s (longer than a jump):
// only standing on a soul is safe.
// Tree art (assets/bosses/tree-v2-*.webp, 700 px cells, facing left) is drawn at 0.31 scale: TREE_ART is a cell's height on screen.
// The mask hitbox sits on the painted mask (TREE_MASK: px ahead of the body's center, px above the floor), in jump reach from the
// floor; plain stomps bounce, so only stuck hands open it. TREE_REACH: where the slam's fist lands, px ahead of the body's center.
const TREE_ART = 217, TREE_MASK = [25, 80], TREE_REACH = 75, TREE_WAKE = 2;
// Intro after waking: it stands up tall and roars (14 frames; mouth opens on frame 7), then settles back (10 frames).
const TREE_STAND = 1.75, TREE_SETTLE = 1.25, TREE_INTRO = TREE_WAKE + TREE_STAND + TREE_SETTLE;
const TREE_WAVE_SPEED = 250, TREE_WAVE_RANGE = 150; // the slam's shockwave along the floor (px/s, px each way)
const STAG_WALK = 130, STAG_GALLOP = 650, STAG_DAZE = 3, STAG_SWEEP = 1, STAG_TUG_PULL = 0.15, STAG_TUG_PRESS = 0.06; // tug of war: the stag pulls the bar down per second; each Space press pushes it up
const TREE_GLOW = 2.05, TREE_SPIKES = 1.5, TREE_SPIKES_UP = 1.2, TREE_STUCK = 2.5, TREE_WALK = 40, TREE_LUNGE = 240, TREE_FIST = 40;
// Self-destruct (World 2 on): hold K/X this long. You keep moving while it charges; letting go cancels.
const SD_HOLD = 0.75;
// Recall (World 3): Q takes back your newest soul. Holding keeps going, each gap shorter, down to RECALL_MIN.
const RECALL_GAP = 0.35, RECALL_MIN = 0.08;
// Wall jump: slide down a wall (or a soul) while pushing into it, jump to kick off. Hold jump for the full
// kick; let go early and both the height and the push away are cut short. You can't kick off the same
// side twice in a row (touch the ground or the other wall first), so one wall can't be climbed.
const WALL_SLIDE = 70, WALL_KICK = 170, WALL_JUMP = 500, KICK_LOCK = 0.3; // a kick climbs ~2.8 tiles (was 420: ~2)
// Hazards and enemies
const SAW_SPEED = 90, SAW_R = 13;               // saws run along a row or column; a soul in the way jams them
const CRUMBLE_TIME = 0.45, CRUMBLE_BACK = 2.5;  // crumbling blocks break this long after you land, return later
const FLYER_SPEED = 80, SHOT_SPEED = 200, THROW_EVERY = 1.8, STOMP_BOUNCE = 420;
// Bramble spider (W1): pass under its column and it shakes, drops onto whatever is below (a soul too), rests, climbs.
// Idol slider (W2): steps toward you only while you're airborne or holding K; you can stand on it.
// Reliquary scarab (W3): a walker that patrols floors and soul bridges. Idols and scarabs press plates and block lasers.
const SPIDER_SHAKE = 0.5, SPIDER_REST = 1, SPIDER_CLIMB = 150, IDOL_SPEED = 70, SCARAB_SPEED = 45;
const heavy = (e) => e.kind === 'i' || e.kind === 'b';
// Key prompts: shown once each, on screen (the characters never name keys). Each hides once you've done it.
const KEY_PROMPTS = {
  move: ['A  D  move     ·     Space  jump', (s) => s.player.body.velocity.y < -100],
  slide: ['Shift  or  ↓  while running:  slide', (s) => s.lying && s.slide > 0],
  wallJump: ['In the air against a wall:  press Space again', (s) => s.kick > 0],
  retry: ['Shift + R:  retry the room', (s) => (s.retries ?? 0) > 0], // fades once you've used it
  letGo: ['Hold  K:  let go', (s) => s.charge > 0.2],
  recall: ['Q:  take back your newest soul', (s) => s.recalled],
  swap: ['E:  swap places with your newest soul', (s) => s.swapped],
};
const SPRING = 873; // launch speed: 8.5 tiles high (a 9-high ledge needs a soul)

// Mechanic rules (persist across rooms)
const rules = {
  freeze: true,       // [1] body floats where you died (off = falls with gravity)
  snap: true,         // [2] body snaps to the tile grid
  max: 3,             // [3] oldest vanishes past this; 0 = unlimited
  selfDestruct: false, // [4] hold K/X to die anywhere, in any world (always on from World 2)
  recall: false,       // [5] Q recalls souls, in any world (always on from World 2)
};
const LIMITS = [1, 2, 3, 5, 0];
let showHud = false; // test HUD and rule switches; H toggles
const DEV = new URLSearchParams(location.search).has('dev'); // ?dev turns on the dev keys: N next room, H help panel, 1-5 rules

// '#' wall  '^' spikes  P start  '_' plate  D door (open while any plate is held)
// e walker enemy  B boss  V vines (open when the room's boss is beaten)  x thorns (kill on touch, not solid)
// A the amulet  C shrine (touch: respawn here)
// a aimed soul-breaking relic
// > < v u laser emitter firing right/left/down/up (the beam kills; walls, doors and souls stop it)  s spring
// o saw moving sideways  O saw moving up/down  ~ crumbling block  ! falling spike (drops when you pass under)
// f flyer (flies over souls)  t thrower (shoots at you; souls block the shots). Stomp any enemy to kill it.
// w bramble spider (put it right under the ceiling; its thread hangs from that tile's top)  i idol slider (not
// stompable: stand on it; its sides kill)  b reliquary scarab
// Rooms carry an optional [x, y] world position in tiles. Rooms that touch connect: walk through a gap
// in the shared wall and the camera slides over. Rooms without a position are spread out so they don't
// touch (the old test rooms). Every room is padded to at least one screen (30x17 tiles).
const ROOMS = [
  ['Climb: stack yourself up the cliff', [
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                 ############',
    '#                 #          #',
    '#                 #          #',
    '#                 #          #',
    '#  P              #          #',
    '##############################',
  ]],
  ['Spikes: die in the pit to make a stepping stone', [
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#  P                         #',
    '#########^^^^^^^^#############',
    '##############################',
  ]],
  ['Plate: leave a body on the switch', [
    '##############################',
    '#                     #      #',
    '#                     #      #',
    '#                     #      #',
    '#                     #      #',
    '#                     #      #',
    '#                     #      #',
    '#                     #      #',
    '#                     D      #',
    '#                     D      #',
    '#                     D      #',
    '#  P      _           D      #',
    '##############################',
  ]],
  ['Combo: climb, hold the plate, cross the spikes', [
    '##############################',
    '#                      #     #',
    '#                      #     #',
    '#                      #     #',
    '#                      #     #',
    '#           _          #     #',
    '#        #####         #     #',
    '#        #             #     #',
    '#        #             D     #',
    '#        #             D     #',
    '#        #             D     #',
    '#  P     #    ^^^^     D     #',
    '##############################',
  ]],
  ['Walker: drop a body on it. Die in the tunnel and you block yourself', [
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#     P                      #',
    '## ####################### ###',
    '#                   e        #',
    '##############################',
  ]],
  ['Boss: build steps, then stomp it 3 times. Dying heals it', [
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#  P         B               #',
    '##############################',
  ]],
  ['Slide: with 1 body allowed (key 3), only a lying body bridges this', [
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#  P                         #',
    '#######^^^^^^^^^^^^###########',
    '##############################',
  ]],
  ['Forest 1: die in the pit to cross it', [
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                             ',
    '#                             ',
    '#  P                          ',
    '##########^^^^^^^^############',
  ], [0, 60]],
  ['Forest 2: die on the thorns to build a stair (camera scrolls)', [
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                             ',
    '#                             ',
    '#                             ',
    '#                 ############',
    '#                 x          #',
    '#                 x          #',
    '#                 x          #',
    '#                 x          #',
    '#                 x          #',
    '#                 x          #',
    '#                 x          #',
    '#                 x          #',
    '                  x          #',
    '                  x          #',
    '  P               x          #',
    '##############################',
  ], [30, 53]],
  ['Forest 3: past the walker', [
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '                             #',
    '                             #',
    '  P            e             #',
    '##############################',
  ], [60, 48]],
  // ---------------- World 1: Forest Edge (see docs/LEVELS.md) ----------------
  ['The clearing', [
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                             ',
    '#                  ##         ',
    '#  P       A      ###         ',
    '##############################',
  ], [0, 100], { world: 1, enter: 'clearing', spots: [[16, 'curse', 'amulet']] }],
  ['First death', [
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '                              ',
    '                              ',
    '  P                           ',
    '##########^^^^^^^^############',
  ], [30, 100], { world: 1, spots: [[8, 'firstPit'], [8, 'soul', 'firstDeath']] }], // talk at the pit's edge
  ['The thorn wall', [
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                             ',
    '#                             ',
    '#                             ',
    '#               ##############',
    '#               ##############',
    '#               ##############',
    '                x#############',
    '                x#############',
    '  P             x#############',
    '##############################',
  ], [60, 100], { world: 1, enter: 'thorns', deathTalk: { 1: 'thornsHint' } }],
  ['The patrol', [
    '##############################',
    '#                       #    #',
    '#                       #    #',
    '#                       #    #',
    '#                       #    #',
    '#                       #    #',
    '#                       #    #',
    '#                       #    #',
    '#                       #    #',
    '#                       #    #',
    '#                       #    #',
    '#                       D    #',
    '#                       D    #',
    '                        D     ',
    '                        D     ',
    '  P         _     e     D     ',
    '##############################',
  ], [90, 94], { world: 1, enter: 'patrol' }],
  ['The chain', [
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                             ',
    '#                             ',
    '#                     ########',
    '#                     ########',
    '#                     ########',
    '                      x#######',
    '                      x#######',
    '  P              C    x#######',
    '######^^^^^^^^################',
  ], [120, 94], { world: 1, enter: 'chain' }],
  // New World 1 rooms (greybox, see docs/LEVELS.md)
  ["The long pit", [ // flat bridge, shrine, stomp the guard twice: bridge death revives it
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '###########       #####      #',
    '###########       #####      #',
    '###########       #####      #',
    '   ########  C    #####       ',
    ' P          ##  e       #   # ',
    '######^^^#########^^^#########',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
  ], [150, 94], { world: 1, spots: [[3, "slide"]] }],
  ["The well", [ // aim your fall: the soul must land near the exit side
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '            ##################',
    ' P          ##################',
    '######      ##################',
    '######      ##################',
    '######      ##################',
    '######      ##################',
    '######      ##################',
    '######      ##################',
    '######      ##################',
    '######             w    ######',
    '######        C         ######',
    '######       ###       x######',
    '######       ###       x######',
    '######       ###       x######',
    '######^^^^^^^###       x######',
    '################       x######',
    '################       x######',
    '################             #',
    '################             #',
    '################              ',
    '################           e# ',
    '################         #####',
    '################         #####',
    '################^^^^^^^^^#####',
    '##############################',
  ], [180, 94], { world: 1 }],
  ["The gatehouse", [ // get killed on the plate so the walker ends up on the right side
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############            D  #',
    '##############            D  #',
    '##############            D  #',
    '#            #            D  #',
    '#            #          ##D  #',
    '             D          ##D  #',
    ' P           D          ##D   ',
    '###    _   e D#C #   _ e##D   ',
    '##############################',
  ], [210, 108], { world: 1 }],
  ["Thornwood", [ // SHOWCASE W1: wall jump, thorn anchor, crumbling bridge, falling spikes, saw jam, stomps
    '##############################################',
    '##############################################',
    '##############################################',
    '############         ! ! !        ############',
    '############                      ############',
    '############     C          C     ############',
    '############   #####~~~~~~~####   ############',
    '############   #####       ####   ############',
    '############   #####       ####   ############',
    '############   #####       ####   ############',
    '############   #####^^^^^^^####   ############',
    '############   ################   ############',
    '############   ################   ############',
    '############   ################   ############',
    '############   ################   ############',
    '############   ################   ############',
    '############   ################   ############',
    '############   ################      ######   ',
    '#          #   ################      ######   ',
    '#          #   ################      ######  #',
    '#              ################      ######  #',
    '               ################              #',
    ' P      e      ################   e #   o  # #',
    '##############################################',
    '##############################################',
  ], [240, 101], { world: 1, spots: [[10, "wallJump"]] }],
  ['The moth', [ // you walk in on the arena floor: one soul is the step that reaches its back
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            V',
    'V                            V',
    'VP            xB             V',
    '##############################',
  ], [286, 104], { world: 1, spots: [[7, 'moth']], deathTalk: { 2: 'dust', 25: 'dust2' } }], // the shaking starts 7 tiles in
  // ---------------- World 2: Overgrown Ruins (greybox) ----------------
  ["Let go", [ // hold K: two souls stacked reach a 5-high ledge
    '##############################',
    '#                       D    #',
    '#                       D    #',
    '#                       D    #',
    '#                       D    #',
    '#                       D    #',
    '#                       D    #',
    '#                       D    #',
    '#                       D    #',
    '#                       D     ',
    '#          C            D     ',
    '#        #####        ########',
    '#        #####        ########',
    '         #####        ########',
    '         #####        ########',
    ' P       ##### # e   _########',
    '##############################',
  ], [316, 104], { world: 2, enter: "letGo" }],
  ["Off the edge", [ // jump off the edge holding K: the soul appears mid-pit
    '##############################',
    '#                         D  #',
    '#                         D  #',
    '#                         D  #',
    '#                         D  #',
    '#                         D  #',
    '                          D   ',
    ' P           C  _         D   ',
    '####       ########       ####',
    '####       ########       ####',
    '####       ########       ####',
    '####       ########       ####',
    '####       ########       ####',
    '####       ########       ####',
    '####       ########       ####',
    '####^^^^^^^########^^^^^^^####',
    '##############################',
  ], [346, 107], { world: 2 }],
  ["Take it back", [ // recall a tunnel plug; preserve the plate while repairing a flat bridge
    '##############################',
    '##############################',
    '##############################',
    '##########         ########  #',
    '##########         ########  #',
    '##########         ########  #',
    '   ####### C       #######D   ',
    ' P         #    _         D   ',
    '#####^^^#############^^^######',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
  ], [376, 107], { world: 2, enter: "takeBack" }],
  ["The ladder", [ // 7-high ledge: stack to 3, then run off your top soul holding K for a step beside it
    '##########################################',
    '#               #                        #',
    '#               #                        #',
    '#               #                        #',
    '#               #                        #',
    '#               #                        #',
    '#               #                        #',
    '#               #                         ',
    '#           C   #                         ',
    '#         ##### #       ##################',
    '#         ##### #       ##################',
    '#         ##### #       ##################',
    '#         #####         ##################',
    '#         #####         ##################',
    '          #####         ##################',
    ' P        #####         ##################',
    '#####################^^^##################',
  ], [406, 99], { world: 2, spots: [[26, "carvings"]] }],
  ["The beam", [ // 8-high ledge: jump into the laser right next to its source; that death is the high step and leaves no beam
    '##############################',
    '#               #          D #',
    '#               #          D #',
    '#               #          D #',
    '#               #          D #',
    '#               #          D #',
    '#               #          D  ',
    '#            C  #          D  ',
    '#          #### #        #####',
    '#          #### #        #####',
    '#          #### #        #####',
    '#          <### #        <####',
    '#          #### #        #####',
    '#          ####          #####',
    '           ####        _ #####',
    ' P   i   # ####        # #####',
    '##############################',
  ], [448, 92], { world: 2 }],
  ["The spring", [ // 9-high ledge: hold during the launch so a soul hangs beside the spring, then land on it
    '##############################',
    '#               #            #',
    '#               #            #',
    '#               #            #',
    '#               #            #',
    '#               #             ',
    '#            C  #             ',
    '#          #### #        #####',
    '#          #### #        #####',
    '#          #### #        <####',
    '#          #### #        #####',
    '#          ####          #####',
    '#          ####          #####',
    '#          ####          #####',
    '           ####          #####',
    ' P    s    ####    s     #####',
    '##############################',
  ], [478, 84], { world: 2 }],
  ["Wrong order", [ // step, plate, pit: in another order a soul you still need vanishes
    '##############################',
    '#             D             D#',
    '#             D             D#',
    '#             D             D#',
    '#             D             D#',
    '#             D             D#',
    '#             D  _          D#',
    '#             D ###         D#',
    '#             D ###         D#',
    '#             D ###       < D#',
    '#             D ###         D#',
    '# _           D ###         D#',
    '####          D            #D#',
    '#             D             D ',
    '              D             D ',
    ' P            DC   s        D ',
    '#######^^^^^^^########^^^^^^##',
  ], [508, 75], { world: 2 }],
  ["Sawmill", [ // SHOWCASE W2: spring + timed self-destruct jams a saw, plate soul as a shield, thrower, laser
    '############################################',
    '#              #############################',
    '#              #############################',
    '#              #############################',
    '#              #############################',
    '#              #############################',
    '#                              D   #########',
    '#                              D   #########',
    '#                              D   #########',
    '#                          _ t D C #########',
    '#           C  ####~~~~~~~######## #########',
    '#         #########       ######   #########',
    '#         #########       ######   #########',
    '#         #########       ######   #########',
    '#  o      #########^^^^^^^######   ###v#####',
    '#         ######################           #',
    '#         ######################           #',
    '          ######################            ',
    '          ######################            ',
    ' P    s   ######################    #    e  ',
    '############################################',
    '############################################',
  ], [538, 71], { world: 2 }],
  ["The tree guardian", [ // get the slam to land on a soul to stick its hands; stand on a soul when the floor spikes
    '##############################',
    '#                           V#',
    '#                           V#',
    '#                           V#',
    '#                           V#',
    '#                           V#',
    '#                           V#',
    '#                           V#',
    '#                           V#',
    '#                           V#',
    '#                           V#',
    '#                           V#',
    '#                           V#',
    '                            V ',
    '                            V ',
    ' P                     B    V ',
    '##############################',
  ], [582, 75], { world: 2, boss: "tree", spots: [[7, "tree"]], deathTalk: {"2": "treeSlam", "25": "treeSlam2"} }],
  // ---------------- World 3: Sanctum (greybox) ----------------
  ["Three high", [ // 12-high tower: a 3-soul staircase (run off your top soul while holding K)
    '##############################',
    '#               #####        #',
    '#               #####        #',
    '#           C   #####        #',
    '#         ##### #####        #',
    '#         ##### #####        #',
    '#         ##### #####         ',
    '#         ##### #####         ',
    '#         ##### #####      ###',
    '#         ##### #####      ###',
    '#         ##### #####      ###',
    '#         ##### ##v##      ###',
    '#         #####            ###',
    '          #####            ###',
    '          #####            ###',
    ' P        #####            ###',
    '##############################',
  ], [612, 75], { world: 3, spots: [[4, "pyramid"]] }],
  ["Two places", [ // plug the shaft with a soul, then swap into the low tunnel at a run; exchange places under a falling spike to hold the exit plate
    '##############################',
    '##############################',
    '#################     ########',
    '#      #####    #     ########',
    '#      #####    #     ########',
    '#      #####    # !   #      #',
    '#      #####    #     #      #',
    '#      #####    #     #      #',
    '       #####    D     D       ',
    ' P     #####    D _   D       ',
    '###### #####    ##############',
    '###### #####    ##############',
    '###### #####   ###############',
    '######         ###############',
    '######^ #### C ###############',
    '##############################',
    '##############################',
  ], [642, 73], { world: 3, enter: "twoPlaces" }],
  ["Three jobs", [ // plate, pit and a laser blocker at once; recall mistakes instead of dying over them
    '##############################',
    '##############################',
    '##############################',
    '#############v################',
    '#             #  #############',
    '#             #  #############',
    '#             D  #############',
    '#   _         D  #############',
    '#   ##^^^^^^^##  #############',
    '#   ###########  ##########v##',
    '#   ###########             ##',
    '#   ###########             ##',
    '#   ###########             ##',
    '#   ###########             D#',
    '    ########### C _         D ',
    ' P  ###############~^^^^^^^~# ',
    '###################^#######^##',
  ], [672, 67], { world: 3 }],
  ["Everything", [ // slide bridge, shrine; plate, saw jam and spring step together; recall a bad step
    '#############################################',
    '###############################             #',
    '###############################             #',
    '###############################             #',
    '###############################             #',
    '###############################             #',
    '###############################             #',
    '###############################             #',
    '###############################             #',
    '###############################              ',
    '###############################              ',
    '###############################        ######',
    '###############################        ######',
    '###############################        ######',
    '###############################        ######',
    '##############        #########        ######',
    '##############        #########        ######',
    '##############        ######  #        ######',
    '   ###########  C             D        ######',
    ' P             ##  _  #  o   #D   s  b ######',
    '#######^^^###################################',
    '#############################################',
  ], [702, 63], { world: 3, shrineTalk: "almostCompetent" }],
  ["Reliquary", [ // SHOWCASE W3: flyers in a chimney, two saws to jam, plate, recall, crumbling descent
    '########################################',
    '########################################',
    '########################################',
    '#####                         D   ! !  #',
    '#####    C #   o   #   o  #_  D C      #',
    '#####   ####################### #     x#',
    '#####   #######################xx     x#',
    '#####  f#######################xx     x#',
    '#####   #######################xx~    x#',
    '#####   #######################xx     x#',
    '#####   #######################xx     x#',
    '#####  ########################xx  ~  x#',
    '#####   #######################xx     x#',
    '#####f  #######################xx     x#',
    '#####   #######################xx    ~x#',
    '#####   #######################xx     x#',
    '#####   #######################xx     x#',
    '######  #######################xx  ~  x#',
    '#####   #######################xx     x#',
    '#       #######################xx     x#',
    '        #######################xx   ~   ',
    ' P      #######################xx    ~~ ',
    '################################^^^^^^^#',
    '########################################',
  ], [747, 52], { world: 3 }],
  ["The rehearsal", [ // aimed beams: protect a two-soul stair, shrine, sacrifice a corridor decoy
    '##############################',
    '##############################',
    '#                 ############',
    '#                 ############',
    '#                 ############',
    '#                 ############',
    '#                            #',
    '#                             ',
    '#               C           a ',
    '#             ################',
    '#                            #',
    '#                            #',
    '#                           a#',
    '                             #',
    '                             #',
    '# P                          #',
    '##############################',
  ], [787, 59], { world: 3 }],
  ["The old tree", [ // calm promise; return behind the tree for the note
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                             ',
    '#                             ',
    '#                             ',
    '                              ',
    '  P                           ',
    '##############################',
    '##############################',
  ], [817, 53], { world: 3, spots: [[18, "stagPromise"]] }],
  ["The spectral stag", [ // final boss: gate plate (slide tunnel), antler sweep snags a floating soul, then a tug of war (mash Space)
    '########################################',
    '#                                      #',
    '#                                      #',
    '#                                      #',
    '#                                      #',
    '#                                      #',
    '#                                      #',
    '#                                      #',
    '#                                      #',
    '#                                      #',
    'V                                 ######',
    'V  P                                  _#',
    'V  ####                          #######',
    'V   V                                  V',
    'V V V                       B          V',
    '########################################',
    '########################################',
  ], [847, 53], { world: 3 }],
  ["The pyramid entrance", [ // walk into floor one after reading the note
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '                             #',
    '  P                          #',
    '##############################',
    '##############################',
  ], [887, 53], { world: 3 }],
];
const WORLD_NAMES = { 1: 'Forest Edge', 2: 'Overgrown Ruins', 3: 'Sanctum' }; // fades in when you enter a new world
const WORLD_SOULS = { 1: 1, 2: 2, 3: 3 }; // souls allowed per world; rooms without a world keep 3
// ?dev&room=Name (or a number) starts there, for playtesting
const START_ROOM = ((q) => q == null ? ROOMS.findIndex((r) => r[0] === 'The clearing')
  : isNaN(q) ? ROOMS.findIndex((r) => r[0] === q) : +q)(DEV ? new URLSearchParams(location.search).get('room') : null);

// Overlap that ignores shared edges (standing next to something isn't touching it).
const hit = (A, B) => A.x < B.right && A.right > B.x && A.y < B.bottom && A.bottom > B.y;
const bounds = (o) => o.getBounds();
// A shot's hit box: a moth cloud's (hw: half width) sits inside its soft edge; other shots use a small core for walls.
const shotBox = (sh, h = sh.hw ?? 4) => new Phaser.Geom.Rectangle(sh.x - h, sh.y - h, 2 * h, 2 * h);

const stats = { deaths: 0, stagDeaths: 0, mothFinished: false, treePower: false, stagFinished: false }; // run progress survives room restarts
const FONT = { fontFamily: 'Georgia, serif', align: 'center' };

// First screen: the content warning. Any key or click continues (that click also lets the browser play audio).
class Warning extends Phaser.Scene {
  constructor() { super('warning'); }
  preload() { if (!window.SKIP_WARNING) UI.preload(this); }
  update(_t, ms) { GameAudio.mix(ms / 1000); }
  create() {
    GameAudio.music('title');
    if (window.SKIP_WARNING) return this.scene.start('room'); // the test page
    UI.backdrop(this, 0.78); // over the dimmed title art
    const t = (y, text, size, color, wrap = 640) =>
      this.add.text(480, y, text, { ...FONT, fontSize: size, color, wordWrap: { width: wrap }, lineSpacing: 6 }).setOrigin(0.5);
    t(150, 'Content warning', '30px', '#f1e3b8');
    t(250, 'This game shows a character dying many times, sometimes by his own choice, and deals with grief and self-sacrifice. ' +
      'Death is a puzzle mechanic here and is shown without gore.', '19px', '#dfe8e2');
    t(345, "If you're going through a hard time, please reach out to someone you trust or a local support line.", '16px', '#a8b8ad');
    const go = t(440, 'Click or press any key to continue', '15px', '#e8b44a');
    this.tweens.add({ targets: go, alpha: 0.35, duration: 900, yoyo: true, repeat: -1 });
    t(480, 'M mute · − / = volume', '13px', '#a8b8ad');
    const next = () => { GameAudio.unlocked = true; GameAudio.play('ui-menu-select'); this.scene.start('title'); };
    this.input.keyboard.once('keydown', next);
    this.input.once('pointerdown', next);
  }
}

// The first screen: black, a grey hero running in the lower right and "Loading…", while all the game's art loads.
class Loading extends Phaser.Scene {
  constructor() { super('loading'); }
  preload() { this.load.image('heroRun', 'assets/hero/run-veo.webp'); } // just the runner, so he shows at once
  create() {
    UI.loadingScreen(this);
    if (!window.SKIP_WARNING) UI.preload(this);
    Room.prototype.preload.call(this);
    this.load.once('complete', () => this.scene.start('warning'));
    this.load.start();
  }
}

// The last screen, after he walks into the pyramid: "Floor 1", the title, the run's deaths, thanks and credits.
class End extends Phaser.Scene {
  constructor() { super('end'); }
  update(_t, ms) { GameAudio.mix(ms / 1000); }
  create() {
    GameAudio.music('ending');
    const t = (y, text, size, color, at) => {
      const o = this.add.text(480, y, text, { ...FONT, fontSize: size, color }).setOrigin(0.5).setAlpha(0);
      this.tweens.add({ targets: o, alpha: 1, duration: 1200, delay: at });
      return o;
    };
    const floor = t(272, 'Floor 1', '44px', '#f1e3b8', 600);
    this.tweens.add({ targets: floor, alpha: 0, duration: 1200, delay: 4200 });
    t(170, "Regressor's Echo", '46px', '#f1e3b8', 6000);
    t(245, `Deaths: ${stats.deaths}`, '22px', '#cfeaff', 7400);
    t(280, 'Keep getting back up.', '16px', '#9fb8c8', 8400);
    t(350, 'Thank you for playing.', '20px', '#dfe8e2', 9600);
    t(400, 'A game by Michael Chuang · Made for Game Week', '14px', '#a8b8ad', 10400);
    t(422, 'Art, music and sound made with generative AI tools', '13px', '#7f9086', 10400);
    const again = t(490, 'Click or press any key to continue', '14px', '#e8b44a', 12000);
    const toTitle = () => { // a fresh run starts from the title screen
      if (this.leaving) return;
      this.leaving = true;
      GameAudio.ending = false;
      GameAudio.play('ui-menu-select');
      stats.deaths = stats.stagDeaths = 0; stats.treePower = false; stats.mothFinished = false; stats.stagFinished = false;
      rules.selfDestruct = rules.recall = false; // the moth grants these again on the next run
      Dialogue.seen.clear();
      NAMES.guide = '???';
      this.scene.start('title');
    };
    this.leaving = false;
    this.time.delayedCall(12000, () => { this.input.keyboard.once('keydown', toTitle); this.input.once('pointerdown', toTitle); });
    again.setDepth(1);
  }
}

class Room extends Phaser.Scene {
  constructor() { super('room'); }

  init(data) { this.index = Phaser.Math.Wrap(data.index ?? START_ROOM, 0, ROOMS.length); this.retry = !!data.retry; }

  preload() {
    // Keep the loading screen up until the world is built (removed on the first frame after create).
    if (!window.SKIP_WARNING && !this.retry) {
      const hide = UI.loadingScreen(this);
      this.events.once('update', hide);
    }
    Art.preload(this);
    Dialogue.preload(this);
    for (const [key, path] of [
      ['amulet', 'world1/amulet'], ['ghost', 'world1/ghost'], ['old-tree', 'world3/old-tree'],
      ...[1, 2, 3].flatMap((n) => [[`amulet-rune${n}`, `world1/amulet-rune${n}`], [`shrine${n}`, `world${n}/shrine`], [`shrineLit${n}`, `world${n}/shrine-lit`], [`gate${n}`, `world${n}/gate`]]),
      ['uiSoulFull', 'ui/soul-full'], ['uiSoulEmpty', 'ui/soul-empty'], ['carvings', 'world2/carvings'], ['pyramid', 'world3/pyramid'], ['laserEmitter', 'world2/laser'],
    ]) if (!this.textures.exists(key)) this.load.image(key, `assets/${path}.webp`);
    if (!this.textures.exists('heroSheet')) {
      this.load.image('heroSheet', 'assets/hero/sheet.webp'); // 8 frames: run 0-5, jump 6, fall 7
      this.load.image('heroIdle', 'assets/hero/idle.webp');
      this.load.image('heroRun', 'assets/hero/run-veo.webp'); // 12 run frames in one row
      this.load.image('heroSlide', 'assets/hero/slide.webp'); // 12 slide frames, 3 rows of 4
      this.load.json('heroSlideMeta', 'assets/hero/slide.json');  // each frame's head and feet x
    }
    for (const [key, path, width, height] of [
      ['heroIdleAnim', 'hero/idle-veo', 106, 112],
      ['heroWall', 'hero/wall-slide-veo', 141, 141],
      ['heroKick', 'hero/wall-slide', 141, 141], // the old sheet's frame 3 is the wall kick-off
      ['pyramidDoor', 'world3/pyramid-door', 640, 1024], // closed, half open, open (light inside)
      ['heroKneel', 'hero/pose-kneel', 112, 112],
      ['heroSlump', 'hero/pose-slumped', 127, 112],
      ['heroHold', 'hero/pose-holding-up', 111, 112],
      ['heroPained', 'hero/pose-pained', 116, 112],
      ['flyer', 'enemies/flyer', 115, 112],
      ['thrower', 'enemies/thrower', 123, 112],
      ['spider', 'enemies/bramble-spider', 112, 112],
      ['idol', 'enemies/idol-slider', 195, 116],
      ['scarab', 'enemies/reliquary-scarab', 256, 137],
    ]) if (!this.textures.exists(key)) this.load.spritesheet(key, `assets/${path}.webp`, { frameWidth: width, frameHeight: height });
    if (!this.textures.exists('seedShot')) this.load.image('seedShot', 'assets/enemies/seed-shot.webp');
    if (!this.textures.exists('walker')) this.load.image('walker', 'assets/enemies/walker.webp');
    for (const [effect, width, height] of [['impact', 114, 128], ['mortar-burst', 117, 128], ['root', 70, 128], ['shockwave', 211, 96], ['pollen-cloud', 213, 256]])
      if (!this.textures.exists(effect)) this.load.spritesheet(effect, `assets/effects/${effect}.webp`, { frameWidth: width, frameHeight: height });
    if (this.bossArtRequested) return;
    this.bossArtRequested = true;
    for (const pose of ['intro', 'idle', 'charge', 'beam', 'wave', 'walk']) {
      if (!this.textures.exists(`stag-${pose}`)) this.load.image(`stag-${pose}`, `assets/bosses/stag-${pose}.webp`);
      if (!this.cache.json.exists(`stag-${pose}-frames`)) this.load.json(`stag-${pose}-frames`, `assets/bosses/stag-${pose}.json`);
    }
    for (const kind of ['moth', 'tree', 'stag']) {
      if (!this.textures.exists(`${kind}-fallen`)) this.load.image(`${kind}-fallen`, `assets/bosses/${kind === 'tree' ? 'tree-v2' : kind}-fallen.webp`);
    }
    for (const pose of ['dormant', 'wake', 'stand', 'settle', 'walk', 'swing', 'slam', 'throw', 'fall']) {
      if (!this.textures.exists(`tree-${pose}`)) this.load.image(`tree-${pose}`, `assets/bosses/tree-v2-${pose}.webp`);
      if (!this.cache.json.exists(`tree-${pose}-frames`)) this.load.json(`tree-${pose}-frames`, `assets/bosses/tree-v2-${pose}.json`);
    }
    if (!this.textures.exists('seedPod')) this.load.image('seedPod', 'assets/bosses/seed-pod.webp');
    if (!this.textures.exists('mothDust')) this.load.image('mothDust', 'assets/bosses/moth-dust.webp');
    if (!this.textures.exists('mothFly')) this.load.image('mothFly', 'assets/bosses/moth-fly-12.webp'); // Veo: one full wingbeat in 12 frames
    if (!this.textures.exists('rocks')) this.load.image('rocks', 'assets/world1/rocks.webp'); // 6 earth chunks
    if (!this.textures.exists('wallBreak')) this.load.image('wallBreak', 'assets/world1/wall-break.webp');
  }

  create() {
    // Screen-fixed things (backdrop, HUD, dialogue) skip the camera's scroll but not its zoom. When a room zooms
    // out (the stag frames its whole arena), scale them back to full screen for the draw, then restore them.
    // Scene events outlive a restart (Shift+R), so hook them once: a second pair would compound the scaling.
    if (!this.zoomHooked) {
      this.zoomHooked = true;
      this.events.on('prerender', () => {
        const cam = this.cameras.main, z = cam.zoom, cx = cam.width / 2, cy = cam.height / 2;
        if (z === 1) return;
        this.unzoomed = this.children.list.filter((o) => o.scrollFactorX === 0).map((o) => [o, o.x, o.y, o.scaleX, o.scaleY]);
        for (const [o, x, y, sx, sy] of this.unzoomed) o.setPosition(cx + (x - cx) / z, cy + (y - cy) / z).setScale(sx / z, sy / z);
      });
      this.events.on('render', () => {
        for (const [o, x, y, sx, sy] of this.unzoomed ?? []) o.setPosition(x, y).setScale(sx, sy);
        this.unzoomed = null;
      });
    }
    this.statics = this.physics.add.staticGroup(); // walls, spike bases, doors, bodies
    this.corpses = [];
    this.doors = [];
    this.plates = [];
    this.spikes = [];
    this.enemies = []; // only the current room's walkers exist (Celeste-style)
    this.walkerSpawns = [];
    this.treePower = !!stats.treePower;
    if (!stats.stagFinished) GameAudio.ending = false; // Shift+R during the last stand brings the stag back: fight music again
    this.bosses = []; // one per boss room; this.boss is the current room's
    this.stagFinished = !!stats.stagFinished;
    this.gates = [];
    this.dead = 0;
    this.lying = false;
    this.face = 1;
    this.slide = 0;
    this.coyote = 0;
    this.buffer = 0;

    Art.ensure(this);
    Art.backdrop(this);
    const rect = (x, y, w, h, color) => this.add.rectangle(x + w / 2, y + h / 2, w, h, color);
    this.hudAmulet = this.pips = this.soulIcons = undefined;
    this.amulets = [];
    this.shrines = [];
    this.lasers = [];
    this.aimedBeams = [];
    this.springs = [];
    this.saws = [];
    this.crumbles = [];
    this.hazardArt = [];
    this.droppers = [];
    this.shots = [];
    this.charge = 0;
    this.platQueue = ROOMS.map(() => []); // wall art is built per room (see buildArt): all at once took ~2s
    this.rooms = ROOMS.map(([name, raw, pos, extra = {}], ri) => {
      const [ox, oy] = pos ?? [ri * 31, 0];
      const width = Math.max(30, ...raw.map((r) => r.length));
      const rows = raw.map((r) => r.padEnd(width, '#'));
      while (rows.length < 17) rows.push('#'.repeat(width));
      const room = { name, ...extra, rect: new Phaser.Geom.Rectangle(ox * T, oy * T, width * T, rows.length * T), spawns: [] };
      const world = extra.world ?? 1;
      const hazard = (body, name, w, h, dy) => Art.hazard(this, body, world, name, w, h, dy);
      // The ladder's carved wall (STORY W2 §3): figures wearing the amulet, thinning to one, standing on the last platform.
      if (name === 'The ladder' && this.textures.exists('carvings'))
        this.add.image((ox + 33) * T, (oy + 9) * T, 'carvings').setOrigin(0.5, 1).setDisplaySize(14 * T, 14 * T * 1056 / 2508).setDepth(-2);
      rows.forEach((row, ty) => {
        for (let tx = 0; tx < row.length; tx++) {
          const x = (ox + tx) * T, y = (oy + ty) * T;
          switch (row[tx]) {
            case '#': { // merge horizontal runs so the player doesn't snag on seams
              let w = 1;
              while (row[tx + w] === '#') w++;
              this.statics.add(rect(x, y, w * T, T, 0).setVisible(false)); // hitbox; painted below
              this.plat(ri, x, y, w * T, T, Array.from({ length: w }, (_, i) => !'#^'.includes(rows[ty - 1]?.[tx + i] ?? '#')), world);
              tx += w - 1;
              break;
            }
            case '^': // solid lower half, deadly upper half
              this.statics.add(rect(x, y + 16, T, 16, 0).setVisible(false));
              this.plat(ri, x, y + 16, T, 16, [false], world);
              this.spikes.push(rect(x + 2, y + 6, T - 4, 10, 0xcd5c5c));
              hazard(this.spikes.at(-1), 'spikes', T, 16, -3);
              break;
            case 'x': this.spikes.push(rect(x + 4, y + 2, T - 8, T - 4, 0x7a3550)); this.spikes.at(-1).audioVine = true; hazard(this.spikes.at(-1), 'thorns', T, T); break;
            case '_': this.plates.push(Object.assign(rect(x + 1, y + T - 8, T - 2, 8, 0xffd700).setStrokeStyle(2, 0x8a6a00).setDepth(3), { room: ri })); hazard(this.plates.at(-1), 'plate', T, T, -12); break; // a square pedestal sheet, base on the floor (the trigger stays 8 tall)
            case 'D': { const d = Object.assign(rect(x, y, T, T, 0x8c6640), { room: ri }); this.statics.add(d); this.doors.push(d); break; }
            case 'e': case 'f': case 't': case 'w': case 'i': case 'b': this.walkerSpawns.push({ x, y, room: ri, kind: row[tx] }); break; // made on entry
            case 'o': case 'O': {
              const sw = { room: ri, x: x + T / 2, y: y + T / 2, dx: row[tx] === 'o' ? 1 : 0, dy: row[tx] === 'O' ? 1 : 0, dir: 1 };
              sw.x0 = sw.x; sw.y0 = sw.y; // Shift+R puts it back here
              const key = Art.hazardKey(this, world, 'saw');
              if (key) sw.img = this.add.image(sw.x, sw.y, key).setDisplaySize(36, 36).setDepth(3);
              this.saws.push(sw);
              break;
            }
            case '~': { const c = rect(x, y, T, T, 0x9a7a52).setStrokeStyle(3, 0x3a2614).setDepth(2); this.statics.add(c); this.crumbles.push(Object.assign(c, { room: ri, t: 0, back: 0 })); hazard(c, 'crumble', T, T); break; }
            case '!': this.droppers.push({ room: ri, x0: x + T / 2, y0: y + 12, r: rect(x + 7, y, T - 14, 24, 0xe0484a).setStrokeStyle(2, 0x6a1010).setDepth(3) }); hazard(this.droppers.at(-1).r, 'falling-spike', 18, 24); break;
            case 'B': // floats with its underside 2.5 tiles above this tile's floor
              this.bosses.push({ hp: BOSS_HP, hurt: 0, dir: 1, room: ri, min: ox * T + (name === 'The moth' ? 8 * T : T + BOSS_W / 2), max: (ox + width) * T - (name === 'The moth' ? 8 * T : T + BOSS_W / 2),
                r: rect(x + T / 2 - BOSS_W / 2, y + T - 128, BOSS_W, BOSS_H, 0x9b59b6),
                hidden: !!extra.spots?.some((sp) => sp[1] === 'moth') && !Dialogue.seen.has('moth'), // bursts in during its intro
                story: extra.spots?.some((sp) => sp[1] === 'moth') ? 'mothDown' : null });
              this.bosses.at(-1).r.setVisible(!this.bosses.at(-1).hidden);
              if (name === 'The spectral stag') {
                const B = this.bosses.at(-1);
                Object.assign(B, { stag: true, face: -1, hidden: !Dialogue.seen.has('stagArrival'), story: 'stagDown', phase: 'setup', clock: 0, deaths: stats.stagDeaths }); // the whole run's deaths here, across Shift+R
                B.r.setVisible(!B.hidden).setSize(192, 64).setPosition(x, (oy + 14) * T).setFillStyle(0xbceaff);
                B.antlers = this.add.graphics().setDepth(5);
                B.r.on('destroy', () => B.antlers.destroy());
                if (this.textures.exists('stag-idle')) {
                  B.img = this.add.image(B.r.x, B.r.y + 32, 'stag-idle').setOrigin(0.5, 1).setDepth(4).setVisible(!B.hidden);
                  this.bossPose(B, 'stag', 'idle', 180, 1);
                  B.r.setAlpha(0); B.r.on('destroy', () => B.img.destroy());
                }
              } else if (extra.boss === 'tree') {
                const B = this.bosses.at(-1);
                Object.assign(B, { kind: 'tree', story: 'treeDown', hidden: !Dialogue.seen.has('tree'), phase: 'idle', timer: 4, attack: -1, pods: [], open: 0, x: x + 16, x0: x + 16, face: -1 });
                B.r.setSize(44, 36).setPosition(x + 16 - TREE_MASK[0], y + T - TREE_MASK[1]).setVisible(!B.hidden);
                B.floor = y + T;
                if (this.textures.exists('tree-dormant')) { // asleep in its ruins until the intro wakes it
                  B.img = this.add.image(x + 0.5 * T, B.floor, 'tree-dormant').setOrigin(0.5, 1).setDepth(4);
                  this.bossPose(B, 'tree', 'dormant', TREE_ART, 1); // one frame at game size, not the whole sheet
                  B.img.setY(B.floor + (B.artFoot ?? 0));
                  B.r.setFillStyle(0, 0);
                }
                B.r.on('destroy', () => { B.img?.destroy(); B.roots?.forEach((r) => r.destroy()); B.pods.forEach((p) => p.r.destroy()); });
              } else if (this.textures.exists('mothFly')) {
                const B = this.bosses.at(-1), tex = this.textures.get('mothFly'), src = tex.getSourceImage();
                const fw = src.width / 6, fh = src.height / 2; // 12 frames in 2 rows of 6: one row would be 8256px, past many GPUs' 8192 limit
                if (!tex.has(0)) for (let i = 0; i < 12; i++) tex.add(i, 0, (i % 6) * fw, Math.floor(i / 6) * fh, fw, fh);
                B.r.setFillStyle(0, 0); // hitbox only
                B.img = this.add.image(B.r.x, B.r.y, 'mothFly', 0).setScale(MOTH_SCALE).setDepth(4);
                B.r.on('destroy', () => B.img.destroy());
              }
              break;
            case 'V': this.gates.push(Object.assign(rect(x, y, T, T, 0x4a6b3a), { room: ri })); this.statics.add(this.gates.at(-1));
              hazard(this.gates.at(-1), 'vine-barrier', T, T);
              if ((name === 'The spectral stag' || name === 'The moth') && tx === 0) this.gates.at(-1).body.enable = false;
              break;
            case 'a': {
              rect(x, y, T, T, 0x539bd6);
              this.aimedBeams.push({ x: x + T / 2, y: y + T / 2, room: ri, clock: -2, period: ty === 8 ? 1.6 : 4, angle: Math.PI });
              break;
            }
            case '>': case '<': case 'v': case 'u': { // laser emitter: a solid block that fires a beam
              // On this lintel, either adjacent snapped soul can shield the seam.
              const e = rect(x + (name === 'Three high' ? T / 2 : 0), y, T, T, 0x5a4a6a);
              this.statics.add(e);
              this.lasers.push({ e, room: ri, dx: { '>': 1, '<': -1 }[row[tx]] ?? 0, dy: { v: 1, u: -1 }[row[tx]] ?? 0 });
              if (this.textures.exists('laserEmitter')) { // carved stone emitter, painted facing right: turn it to fire its way
                e.setFillStyle(0, 0);
                this.add.image(e.x, e.y, 'laserEmitter').setDisplaySize(24, 35).setDepth(2)
                  .setAngle({ '>': 0, v: 90, '<': 180, u: -90 }[row[tx]]).setFlipY(row[tx] === '<');
              }
              break;
            }
            case 's': this.springs.push(rect(x + 3, y + T - 12, T - 6, 12, 0xffc93c).setStrokeStyle(2, 0x7a5200).setDepth(3)); hazard(this.springs.at(-1), 'spring', T - 6, 24, -6); break;
            case 'P': room.spawns.push({ x: x + T / 2, y: y + T - 15 }); break;
            case 'A': {
              const a = this.add.circle(x + T / 2, y + T - 10, 6, 0xffd774).setStrokeStyle(2, 0xb07a22).setDepth(3);
              this.storyPainting(a, 'amulet', 24);
              if (a.img) a.setStrokeStyle(0);
              this.amulets.push(a);
              break;
            }
            case 'C': { // shrine: a mossy stone with a gold rune; touching it moves your respawn here
              const sh = this.add.rectangle(x + T / 2, y + T - 14, 16, 28, 0x56605a).setStrokeStyle(1, 0x2b322e).setDepth(3);
              sh.rune = this.add.circle(x + T / 2, y + T - 18, 3, 0xe8b44a).setAlpha(0.35).setDepth(3);
              sh.spawn = { x: x + T / 2, y: y + T - 15 };
              this.storyPainting(sh, `shrine${world}`, 44, 14);
              if (sh.img) { sh.setStrokeStyle(0); sh.rune.setVisible(false); sh.world = world; }
              this.shrines.push(sh);
              break;
            }
          }
        }
      });
      return room;
    });
    // Shrines separate plate puzzles; adjacent plates in one stage share its doors.
    for (const d of this.doors) {
      const R = this.rooms[d.room].rect;
      const shrines = this.shrines.filter((sh) => R.contains(sh.x, sh.y));
      const stage = (x) => shrines.filter((sh) => sh.x < x).length;
      d.plates = this.plates.filter((pl) => pl.room === d.room && stage(pl.x) === stage(d.x));
    }
    // Gate art: one painting per column of door tiles (each world has its own gate).
    for (const d of this.doors) {
      if (d.gate !== undefined) continue;
      const run = [d];
      while (true) {
        const next = this.doors.find((o) => o.room === d.room && o.x === d.x && o.y === run.at(-1).y + T);
        if (!next) break;
        run.push(next);
      }
      const key = `gate${this.rooms[d.room].world ?? 1}`;
      const img = this.textures.exists(key)
        ? this.add.image(d.x, d.y - T / 2, key).setOrigin(0.5, 0).setDisplaySize(T + 4, run.length * T).setDepth(2) : null;
      for (const o of run) { o.gate = img; if (img) o.setFillStyle(0, 0); }
    }
    // Fill a screen's height of solid ground above and below every room (stopping at any other room),
    // so the camera's diagonal slide between rooms at different heights never shows empty space.
    for (const [ri, { rect: R, world }] of this.rooms.entries()) {
      const others = this.rooms.map((r) => r.rect).filter((O) => O !== R && O.x < R.right && O.right > R.x);
      const top = Math.max(R.y - 544, ...others.filter((O) => O.bottom <= R.y).map((O) => O.bottom));
      const bottom = Math.min(R.bottom + 544, ...others.filter((O) => O.y >= R.bottom).map((O) => O.y));
      if (top < R.y) this.plat(ri, R.x, top, R.width, R.y - top, [], world);
      if (bottom > R.bottom) this.plat(ri, R.x, R.bottom, R.width, bottom - R.bottom, [], world);
    }
    for (const B of [...this.bosses]) {
      if ((B.stag && stats.stagFinished) || (B.kind === 'tree' && stats.treePower) ||
          (B.story === 'mothDown' && stats.mothFinished)) {
        if (B.story === 'mothDown') this.breakWall(B);
        this.bossDefeated(B);
      }
    }
    this.start = this.rooms[this.index].spawns[0];
    this.boss = this.bosses.find((b) => b.room === this.index) ?? null;
    this.bosses.filter((b) => b.story === 'mothDown' && !b.hidden).forEach((b) => this.breakWall(b)); // already broken on replays
    rules.max = this.treePower ? 3 : Math.max(stats.mothFinished ? 2 : 1, WORLD_SOULS[this.rooms[this.index].world] ?? 3);
    Dialogue.create(this);
    this.wearing = Dialogue.seen.has('amulet');
    this.litRune = this.wearing ? (stats.treePower ? 3 : stats.mothFinished ? 2 : 1) : undefined;
    this.roomDeaths = 0;
    this.drawStagGrounds();
    this.buildArt(this.index);
    Art.setWorld(this, this.rooms[this.index].world);
    if (this.retry) this.world = this.rooms[this.index].world; // Shift+R keeps you in the same world: no title card
    else this.showWorld(this.rooms[this.index].world);
    if (this.rooms[this.index].keys) this.showKeys(this.rooms[this.index].keys);

    this.spawnWalkers(this.index);
    this.physics.add.collider(this.enemies, this.statics);

    this.player = this.add.rectangle(this.start.x, this.start.y, 24, 30, 0xd9ebff);
    this.player.setFillStyle(0, 0); // hitbox only; drawn as a figure in drawFigures()
    this.fx = this.add.graphics().setDepth(5);
    // Painted hero, if the art is present (otherwise the code-drawn figure is used).
    this.painted = this.textures.exists('heroSheet') && this.textures.exists('heroIdle');
    if (this.painted) {
      const frames = (key, n) => {
        const tex = this.textures.get(key), img = tex.getSourceImage(), fw = img.width / n;
        if (!tex.has(0)) for (let i = 0; i < n; i++) tex.add(i, 0, i * fw, 0, fw, img.height);
      };
      frames('heroSheet', 8);
      if (this.textures.exists('heroRun')) frames('heroRun', 12);
      this.hasSlide = this.textures.exists('heroSlide');
      if (this.hasSlide) frames('heroSlide', 12);
      this.heroScale = HERO_HEIGHT / HERO_SRC; // same pixel scale for every hero image
      this.heroSprite = this.add.image(0, 0, 'heroIdle').setOrigin(0.5, 1).setDepth(5.5);
      this.heroFrame = ['heroIdle', undefined];
    }
    // The approved ghost replaces the tinted hero; conversation staging stays the same.
    if (!this.painted && !this.textures.exists('guideStandIn'))
      this.make.graphics({ add: false }).fillStyle(0xffffff).fillRoundedRect(0, 0, 22, 40, 10).generateTexture('guideStandIn', 22, 40).destroy();
    this.guide = this.add.image(this.start.x + 60, this.start.y, this.textures.exists('ghost') ? 'ghost' : this.painted ? 'heroIdle' : 'guideStandIn').setOrigin(0.5, 1)
      .setScale(this.textures.exists('ghost') ? HERO_HEIGHT / 112 : this.painted ? this.heroScale : 1).setTint(0xa8d4ff).setDepth(4.4).setAlpha(0); // normal blend: additive washed the pale ghost out to white on bright fog
    this.guide.on = Dialogue.seen.has('amulet') && !this.stagFinished;
    this.guide.hoverY = this.guide.y;
    this.guide.away = 0;
    this.physics.add.existing(this.player);
    this.player.body.maxVelocity.set(10000, 10000); // fall speed is capped in update(), so springs aren't
    // Arcade resolves vertical overlap first, so jumping while pressed into a wall snags on the
    // seam between stacked blocks and kills the jump. Side contacts get pushed out sideways instead.
    this.physics.add.collider(this.player, this.statics, null, (_pl, s) => {
      if (s.lying && this.rooms[this.index].name === 'The spectral stag' && this.corpses.includes(s)) return false; // rammed souls stay flat, before and after the win
      const a = this.player.body, b = s.body;
      const ox = Math.min(a.right, b.right) - Math.max(a.x, b.x);
      const oy = Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y);
      // A narrow landing is still a floor contact, even when the fall exceeds its width.
      const across = a.prev.x < b.right && a.prev.x + a.width > b.x;
      if (across && a.prev.y + a.height <= b.y) return true;
      if (ox >= oy) return true; // floor/ceiling contact: normal handling
      a.x += a.x + a.halfWidth < b.x + b.halfWidth ? -ox : ox;
      a.velocity.x = 0;
      return false;
    });

    // Idols are solid only from above: land on one and stand there. Touching a side kills (the stomp loop in update).
    this.physics.add.collider(this.player, this.enemies, null, (pl, e) => e.kind === 'i' && pl.body.prev.y + pl.body.height <= e.body.y + 4);

    this.keys = this.input.keyboard.addKeys('A,D,LEFT,RIGHT,SPACE,W,UP,K,X,Q,R,N,S,DOWN,SHIFT,ENTER,E,ESC,H,ONE,TWO,THREE,FOUR,FIVE');
    this.bossBar = this.add.text(480, 14, '', { fontFamily: 'Georgia, serif', fontSize: '22px', color: '#ffef72' })
      .setOrigin(0.5, 0).setScrollFactor(0).setDepth(30).setShadow(0, 2, '#000', 6);
    this.hud = this.add.text(8, 4, '', { fontFamily: 'monospace', fontSize: '13px', color: '#ddd', lineSpacing: 3, backgroundColor: '#000000aa', padding: { x: 6, y: 4 } }).setDepth(30).setScrollFactor(0).setVisible(showHud);
    const cam = this.cameras.main, R = this.rooms[this.index].rect;
    cam.setBounds(R.x, R.y, R.width, R.height);
    cam.startFollow(this.player, true, 0.12, 0.12);
    cam.centerOn(this.player.x, this.player.y);
    this.transit = false;
    Dialogue.play(this, this.rooms[this.index].enter);
  }

  // Walked into a neighbouring room: souls stay behind (cleared), respawn moves to the nearest
  // entrance, and the camera slides over while the game holds still, Celeste-style.
  // Celeste-style: walkers belong to a room. Entering a room clears the old room's walkers and puts
  // this room's back where they started (crushed ones too). The array is kept, since the collider holds it.
  spawnWalkers(i) {
    for (const e of this.enemies) e.destroy();
    this.enemies.length = 0;
    const rect = (x, y, w, h, color) => this.add.rectangle(x + w / 2, y + h / 2, w, h, color);
    for (const sh of this.shots) sh.destroy();
    this.shots.length = 0;
    for (const f of this.flyers ?? []) f.destroy();
    this.flyers = [];
    for (const d of this.droppers) this.resetDropper(d);
    for (const c of this.crumbles) { c.t = 0; c.body.enable = true; c.setAlpha(1); }
    this.downed = []; // stomped enemies waiting to come back
    for (const sp of this.walkerSpawns) if (sp.room === i) this.spawnEnemy(sp);
  }

  // One enemy at its spawn point. sp: { x, y, room, kind } from the room grid.
  spawnEnemy(sp) {
    const { x, y, kind } = sp, i = sp.room;
    const rect = (x, y, w, h, color) => this.add.rectangle(x + w / 2, y + h / 2, w, h, color);
    {
      if (kind === 'f') { // flyer: no physics body, so souls don't stop it
        const f = rect(x + 4, y + 8, 24, 16, 0x9b59b6).setDepth(4);
        this.enemyPainting(f, 'flyer', 32);
        this.flyers.push(Object.assign(f, { dir: -1, baseY: y + 16, kind, spawn: sp }));
        return;
      }
      if (kind === 'w') { // spider: no physics body; it moves in updateSpider
        const f = rect(x + 5, y + 4, 22, 20, 0xb03030).setDepth(4);
        this.enemyPainting(f, 'spider', 64);
        this.flyers.push(Object.assign(f, { kind, spawn: sp, top: y, y0: f.y, state: null }));
        return;
      }
      const e = kind === 't' ? rect(x + 4, y + T - 28, 24, 28, 0xe08a3c) : kind === 'i' ? rect(x + 1, y + T - 28, 30, 28, 0x8a2a24)
        : kind === 'b' ? rect(x + 1, y + T - 16, 30, 16, 0xa8322a) : rect(x + 4, y + T - 24, 24, 24, 0xd0543c);
      e.kind = kind;
      e.spawn = sp;
      if (kind === 't') { e.cool = THROW_EVERY; this.enemyPainting(e, 'thrower', 32); }
      if (kind === 'i') this.enemyPainting(e, 'idol', 40);
      if (kind === 'b') this.enemyPainting(e, 'scarab', 27);
      this.physics.add.existing(e);
      if (kind === 'i') e.body.pushable = false; // you stand on it without pressing it into the floor
      e.dir = -1;
      if (kind === 'e' && this.textures.exists('walker')) {
        const tex = this.textures.get('walker'), img = tex.getSourceImage(), fw = img.width / 6;
        if (!tex.has(0)) for (let i = 0; i < 6; i++) tex.add(i, 0, i * fw, 0, fw, img.height);
        e.setFillStyle(0, 0); // hitbox only
        e.img = this.add.image(e.x, e.y, 'walker', 0).setOrigin(0.5, 1).setScale(WALKER_HEIGHT / WALKER_SRC);
        e.on('destroy', () => e.img.destroy());
      }
      e.room = this.rooms[i].rect;
      this.enemies.push(e);
    }
  }

  storyPainting(object, key, height, feet = 0) {
    if (!this.textures.exists(key)) return;
    object.setFillStyle(0, 0);
    const image = this.textures.get(key).getSourceImage();
    object.img = this.add.image(object.x, object.y + feet, key).setOrigin(0.5, feet ? 1 : 0.5)
      .setScale(height / image.height).setDepth(3);
    object.on('destroy', () => object.img.destroy());
  }

  drawStoryArt(t) {
    const g = this.fx, p = this.player, b = p.body;
    for (const a of this.amulets) {
      const y = a.y + Math.sin(t * 2) * 3;
      a.img?.setY(y);
      g.fillStyle(0xffd774, 0.12 + Math.sin(t * 2) * 0.04).fillCircle(a.x, y, 16);
    }
    for (const sh of this.shrines) {
      const active = this.start === sh.spawn;
      const lit = `shrineLit${sh.world}`; // lit and unlit are two paintings of the same stone
      if (sh.img) sh.img.setTexture(active && this.textures.exists(lit) ? lit : `shrine${sh.world}`);
      if (active) g.fillStyle(0xffd774, 0.12 + Math.sin(t * 3) * 0.04).fillCircle(sh.x, sh.y - 4, 24);
    }
    const rune = stats.treePower ? 3 : stats.mothFinished ? 2 : 1;
    const key = this.textures.exists(`amulet-rune${rune}`) ? `amulet-rune${rune}` : 'amulet';
    if (!this.textures.exists(key)) return;
    if (!this.hudAmulet) this.hudAmulet = this.add.image(0, 516, key).setScrollFactor(0).setDepth(40);
    this.hudAmulet.setTexture(key).setDisplaySize(32, 32).setX(32 + rules.max * 22).setVisible(this.wearing);
    if (this.wearing && this.litRune !== rune) {
      this.litRune = rune;
      const flash = this.add.image(p.x, p.y - 62, key).setDisplaySize(64, 64).setDepth(6);
      this.tweens.add({ targets: flash, y: flash.y - 18, alpha: 0, duration: 1800, onComplete: () => flash.destroy() });
    }
  }

  enemyPainting(object, key, height) {
    if (!this.textures.exists(key)) return;
    object.setFillStyle(0, 0);
    object.img = this.add.image(object.x, object.y, key, 0).setDepth(4)
      .setDisplaySize(this.textures.get(key).get(0).width * height / this.textures.get(key).get(0).height, height);
    object.on('destroy', () => object.img.destroy());
  }

  // The world's name fades in when you arrive in a new world.
  showWorld(w) {
    this.world = w;
    Art.setWorld(this, w);
    if (!WORLD_NAMES[w]) return;
    const t = this.add.text(480, 200, WORLD_NAMES[w], { fontFamily: 'Georgia, serif', fontSize: '42px', color: '#f1e3b8' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(45).setAlpha(0).setShadow(0, 2, '#000', 8);
    this.tweens.add({ targets: t, alpha: 1, duration: 900, hold: 1600, yoyo: true, onComplete: () => t.destroy() });
  }

  bossDefeated(B) {
    if (B.stag) this.stagFinished = stats.stagFinished = true;
    if (B.story === 'mothDown') { B.warn?.destroy(); stats.mothFinished = true; rules.max = 2; rules.selfDestruct = true; rules.recall = true; }
    if (B.kind === 'tree') { this.treePower = stats.treePower = true; rules.max = 3; }
    B.r.destroy();
    this.bosses.splice(this.bosses.indexOf(B), 1);
    if (this.boss === B) this.boss = null;
    this.gates.filter((g) => g.room === B.room).forEach((g) => g.destroy()); // the way on opens
  }

  // The guide shows up only for conversations he's part of: he fades in at the hero's upper right,
  // hovers facing him, and fades away a moment after the conversation ends.
  showGuide(dt) {
    const g = this.guide, p = this.player, t = this.talk;
    if (!g.on || g.fading) return;
    const talking = t.line || t.queue.length;
    if (talking && [t.line, ...t.queue].some((l) => l?.who === 'guide')) g.inTalk = true;
    if (!talking) g.inTalk = false;
    if (g.inTalk) {
      if (g.alpha === 0) { g.setPosition(p.x + 40, p.y - 34); g.hoverY = g.y; }
      // Left far behind (he respawned, or walked on while the ghost lingered): drift back to his upper right.
      const home = { x: p.x + 40, y: p.y - 34 };
      if (Math.hypot(home.x - g.x, home.y - g.hoverY) > 160 && !t.line?.guide && !t.line?.guideBy) g.drifting = true;
      if (g.drifting) {
        const d = Math.hypot(home.x - g.x, home.y - g.hoverY), s = Math.min(1, 260 * dt / (d || 1));
        g.x += (home.x - g.x) * s; g.hoverY += (home.y - g.hoverY) * s;
        if (d < 8) g.drifting = false;
      }
      g.setAlpha(Math.min(0.7, g.alpha + dt * 1.2));
      g.away = 0;
      if (!g.looking) g.setFlipX(g.x > p.x);
    } else if (g.alpha > 0 && (g.away += dt) > 0.6) g.setAlpha(Math.max(0, g.alpha - dt * 0.9)); // lingers, then fades
    g.y = g.hoverY + Math.sin(this.time.now / 600) * 3;
  }

  // Staging cues fired by dialogue lines (see `cue` in dialogue.js).
  // A key prompt at the bottom of the screen, once per run. It stays until you do the move (or 25s pass).
  showKeys(id) {
    if (!KEY_PROMPTS[id] || Dialogue.seen.has('keys:' + id)) return;
    Dialogue.seen.add('keys:' + id);
    this.keyPrompt?.destroy();
    this.keyPrompt = this.add.text(480, 500, KEY_PROMPTS[id][0], { fontFamily: 'Georgia, serif', fontSize: '18px', color: '#f1e3b8', backgroundColor: '#000000aa', padding: { x: 14, y: 8 } })
      .setOrigin(0.5).setScrollFactor(0).setDepth(46).setAlpha(0);
    this.keyPrompt.done = KEY_PROMPTS[id][1];
    this.keyPrompt.until = this.time.now + 25000;
    this.tweens.add({ targets: this.keyPrompt, alpha: 1, duration: 400 });
  }

  updateKeyPrompt() {
    const k = this.keyPrompt;
    if (!k || k.leaving || this.talk?.line || this.talk?.queue?.length) return;
    if (k.done(this) || this.time.now > k.until) {
      k.leaving = true;
      this.tweens.add({ targets: k, alpha: 0, duration: 600, delay: 400, onComplete: () => k.destroy() });
      this.keyPrompt = null;
    }
  }

  cue(name) {
    GameAudio.cue(name);
    if (['moth', 'tree', 'stagAppear'].includes(name) && this.boss) this.boss.audioArrived = true;
    const g = this.guide, p = this.player;
    if (name.startsWith('keys:')) return this.showKeys(name.slice(5));
    if (name === 'stagAppear' && this.boss?.stag) {
      this.boss.hidden = false; this.boss.introUntil = this.time.now + 1000; this.boss.r.setVisible(true); this.cameras.main.flash(450, 170, 225, 255);
    }
    // The stag's fall (stagDown): behind his back it calls out and gets up, starts its charge, and the ghost
    // throws himself into the last shot.
    const stagAt = (B, pose, duration, loop) => {
      this.bossPose(B, 'stag', pose, 180, duration, loop);
      B.img?.setAlpha(1).clearTint().setPosition(B.r.x, B.r.y + 32 + (B.artFoot ?? 0)).setFlipX(B.r.x < p.x); // sheets face left
    };
    if (name === 'stagRise' && this.boss?.stag) {
      const B = this.boss;
      GameAudio.play('stag-wave');
      this.cameras.main.shake(500, 0.004);
      stagAt(B, 'intro', 1);
      this.tweens.addCounter({ from: 0, to: 1, duration: 1000, onUpdate: () => B.img?.active && stagAt(B, 'intro', 1) });
    }
    if (name === 'stagCharge' && this.boss?.stag) { // gallops in and holds, still a few tiles off, while the ghost shouts
      const B = this.boss, stop = p.x + Math.sign(B.r.x - p.x) * 7 * T;
      GameAudio.play('stag-charge');
      this.tweens.add({ targets: B.r, x: stop, duration: 900, ease: 'Quad.easeIn', onUpdate: () => B.img?.active && stagAt(B, 'charge', 0.37, true) });
    }
    if (name === 'lastBeam' && this.boss?.stag) { // he steps into the shot; everything goes white; the stag is spent
      const B = this.boss, between = (p.x + B.r.x) / 2;
      g.on = true; g.inTalk = true;
      this.tweens.add({ targets: g, x: between, duration: 220, onComplete: () => { g.hoverY = p.y - 20; } });
      g.setAlpha(0.9);
      stagAt(B, 'beam', 0.7);
      this.time.delayedCall(250, () => {
        GameAudio.play('stag-beam');
        const beam = this.add.line(0, 0, B.r.x - Math.sign(B.r.x - p.x) * 40, B.r.y - 30, between, p.y - 20, 0x9bdfff).setOrigin(0).setLineWidth(9).setDepth(6);
        this.time.delayedCall(500, () => beam.destroy());
      });
      const white = this.add.rectangle(480, 272, 960, 544, 0xffffff).setScrollFactor(0).setDepth(38).setAlpha(0);
      this.tweens.add({ targets: white, alpha: 1, duration: 300, delay: 300 });
      this.time.delayedCall(800, () => { if (this.boss?.stag) this.bossDefeated(this.boss); this.stagFinished = true; }); // gone under the light
      this.tweens.add({ targets: white, alpha: 0, duration: 800, delay: 1900, onComplete: () => white.destroy() });
    }
    if (name === 'crack') { // the ghost cracks like glass
      GameAudio.play('story-guide-cracking-like-glass');
      this.cameras.main.shake(250, 0.004);
      this.cameras.main.flash(180, 170, 220, 255);
    }
    if (name === 'toNote') { // fade to black, then he finds the note behind the old tree
      const cam = this.cameras.main;
      p.body.moves = false;
      cam.fadeOut(900, 0, 0, 0);
      cam.once('camerafadeoutcomplete', () => {
        const i = this.rooms.findIndex((r) => r.name === 'The old tree'), R = this.rooms[i].rect;
        p.body.reset(R.x + 15 * T, R.y + 15 * T - p.height / 2);
        this.enterRoom(i);
        this.time.delayedCall(600, () => {
          p.body.moves = true;
          cam.fadeIn(900, 0, 0, 0);
          Dialogue.play(this, 'stagNote');
        });
      });
    }
    if (name === 'guideBreak') {
      g.on = false;
      this.cameras.main.flash(400, 120, 210, 255);
      this.tweens.add({ targets: g, alpha: 0, duration: 1500, onComplete: () => { g.on = false; } });
    }
    if (name === 'stagGone' && this.boss?.stag) { this.bossDefeated(this.boss); this.stagFinished = true; }
    if (name === 'tree' && this.boss?.kind === 'tree') { this.boss.hidden = false; this.boss.r.setVisible(true); this.boss.phase = 'intro'; this.boss.timer = TREE_INTRO; this.boss.screamed = false; }
    if (name === 'wear') this.wearing = true;
    if (name === 'flash') this.cameras.main.flash(600, 255, 215, 120);
    if (name === 'doorOpen' && this.pyramidDoor?.setFrame) { // the doors swing open onto warm light
      this.time.delayedCall(150, () => this.pyramidDoor.setFrame(1));
      this.time.delayedCall(500, () => this.pyramidDoor.setFrame(2));
    }
    if (name === 'theEnd') { // he walks into the pyramid: fade out to the ending card
      this.tweens.add({ targets: this.heroSprite, alpha: 0, duration: 700 }); // swallowed by the dark doorway
      this.cameras.main.fadeOut(1500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('end'));
    }
    if (name === 'dim' || name === 'undim') { // night falls / morning comes (under the dialogue panel)
      this.dimmer ??= this.add.rectangle(480, 272, 960, 544, 0x020610).setScrollFactor(0).setDepth(39).setAlpha(0);
      this.tweens.killTweensOf(this.dimmer);
      this.tweens.add({ targets: this.dimmer, alpha: name === 'dim' ? 1 : 0, duration: 1100 }); // full dark, ghost included
    }
    if (name === 'pulse') this.cameras.main.flash(250, 255, 215, 120);
    if (name === 'ghost' && g && !g.on) { // fades in right beside him
      g.on = g.fading = true;
      g.setPosition(p.x + 40, p.y - 34).setFlipX(true); // floating at his upper right
      g.hoverY = g.y;
      g.inTalk = true;
      this.tweens.add({ targets: g, alpha: 0.7, duration: 900, onComplete: () => { g.fading = false; } });
    }
    const B = this.bosses.find((b) => b.room === this.index && b.story);
    if (name === 'glow' && B) { // the fallen boss turns white and pulses
      if (!B.img) B.r.setFillStyle(0xffffff);
      B.img?.setTintFill(0xffffff);
      this.tweens.add({ targets: B.img ?? B.r, alpha: 0.4, duration: 220, yoyo: true, repeat: 4 });
    }
    if (name === 'absorb' && B) { // dissolves into motes that stream into the hero, who flashes white
      if (!this.textures.exists('spark'))
        this.make.graphics({ add: false }).fillStyle(0xffffff).fillCircle(3, 3, 3).generateTexture('spark', 6, 6).destroy();
      // The fallen body fades while a stream of motes flows from it into him (normal blend: additive vanished
      // on bright fog); when it lands he glows white for a moment.
      const from = B.img?.visible ? B.img : B.r, fx = from.x, fy = from.y - (from === B.img ? from.displayHeight * 0.3 : 0);
      const em = this.add.particles(0, 0, 'spark', {
        x: { min: fx - 50, max: fx + 50 }, y: { min: fy - 30, max: fy + 30 }, moveToX: p.x, moveToY: p.y - 6,
        lifespan: 800, frequency: 12, quantity: 2, scale: { start: 1.8, end: 0.7 }, tint: [0xffffff, 0xfff2c0, 0xcfeaff],
      }).setDepth(6);
      this.tweens.killTweensOf([B.img, B.r].filter(Boolean)); // stop the glow pulse, then fade (the moth copies r's alpha to its image)
      this.tweens.add({ targets: [B.img, B.r].filter(Boolean), alpha: 0, duration: 1100 });
      this.time.delayedCall(1000, () => em.stop());
      this.time.delayedCall(1900, () => em.destroy());
      this.time.delayedCall(800, () => {
        this.heroSprite?.setTintFill(0xffffff);
        this.cameras.main.flash(250, 255, 255, 255);
        this.time.delayedCall(700, () => this.heroSprite?.clearTint());
      });
      this.time.delayedCall(1150, () => this.bossDefeated(B));
    }
    if (name === 'lookaround' && g) { // surveys the clearing, then settles on the hero
      g.looking = true;
      [0, 500, 1000].forEach((ms, i) => this.time.delayedCall(ms, () => g.setFlipX(i % 2 === 0 ? false : true)));
      this.time.delayedCall(1600, () => { g.looking = false; });
    }
    if (name === 'shake') this.cameras.main.shake(1400, 0.006);
    if (name === 'moth' && this.boss?.hidden) { // bursts out of the wall, flies to its patrol spot, screams
      const B = this.boss, { x, y } = B.r, h = this.breakWall(B, true);
      this.gates.filter((g) => g.room === B.room).forEach((g) => { g.body.enable = true; });
      B.dir = -1;
      B.r.setVisible(true).setPosition(h.x, h.y);
      B.img?.setScale(MOTH_SCALE * 0.5);
      if (B.img) this.tweens.add({ targets: B.img, scale: MOTH_SCALE, duration: 900 });
      this.tweens.add({ targets: B.r, x, y, duration: 900, ease: 'Sine.easeOut', onComplete: () => this.mothScream(() => { B.hidden = false; }) });
    }
  }

  // Paints the moth's hole in its room's right wall; with fling, rock chunks and dust burst out of it.
  // Returns the hole's centre.
  breakWall(B, fling) {
    const R = this.rooms[B.room].rect, [r0, r1] = MOTH_HOLE, x = R.right - T, top = R.y + r0 * T, h = (r1 - r0 + 1) * T;
    const c = { x: x + T / 2, y: top + h / 2 };
    this.add.rectangle(x, top, T, h, 0x120c08).setOrigin(0).setDepth(1); // the tunnel it came through
    if (this.textures.exists('wallBreak')) { // ragged earth edge facing into the room
      const src = this.textures.get('wallBreak').getSourceImage();
      this.add.image(x + T, top - 12, 'wallBreak').setOrigin(1, 0).setFlipX(true).setDisplaySize(T * 2.2 * src.width / 800, h + 24).setDepth(1);
    }
    if (!fling) return c;
    this.cameras.main.shake(400, 0.012);
    const tex = this.textures.exists('rocks') && this.textures.get('rocks');
    if (tex && !tex.has(0)) for (let i = 0; i < 6; i++) tex.add(i, 0, i * 514, 0, 514, 525);
    for (let i = 0; i < 16; i++) { // chunks fly into the room and fall off-screen
      const dx = -Phaser.Math.Between(150, 650), dy = Phaser.Math.Between(-250, 150), rock = tex
        ? this.add.image(c.x, c.y + Phaser.Math.Between(-h / 3, h / 3), 'rocks', i % 6).setScale(Phaser.Math.FloatBetween(0.05, 0.12))
        : this.add.rectangle(c.x, c.y, 10, 10, 0x4a3a2a);
      rock.setDepth(6).setAngle(Phaser.Math.Between(0, 360));
      this.tweens.add({ targets: rock, x: rock.x + dx, duration: 1600, onComplete: () => rock.destroy() });
      this.tweens.add({ targets: rock, y: rock.y + dy - 200, duration: 450, ease: 'Quad.easeOut',
        onComplete: () => this.tweens.add({ targets: rock, y: rock.y + 900, duration: 1150, ease: 'Quad.easeIn' }) });
      this.tweens.add({ targets: rock, angle: rock.angle + Phaser.Math.Between(-540, 540), duration: 1600 });
    }
    for (let i = 0; i < 14; i++) { // dust puffs drift out and fade
      const d = this.add.circle(c.x, c.y + Phaser.Math.Between(-h / 2, h / 2), Phaser.Math.Between(10, 24), 0x8a7f72, 0.55).setDepth(5.8);
      this.tweens.add({ targets: d, x: d.x - Phaser.Math.Between(20, 160), y: d.y + Phaser.Math.Between(-40, 40), scale: 2.2, alpha: 0,
        duration: Phaser.Math.Between(900, 1700), ease: 'Sine.easeOut', onComplete: () => d.destroy() });
    }
    return c;
  }

  // The moth's roar (it has no mouth): wings beat up then spread wide and hold, while sound-wave rings
  // push out from it. Plays at the end of its intro; meant to play again before each wing-dust attack.
  mothScream(done) {
    const B = this.boss;
    if (!B) return done?.();
    GameAudio.play('moth-scream');
    B.pose = 6; // wings up (Veo sheet: 0 down, 3 flat, 6 up)
    this.time.delayedCall(150, () => { B.pose = 3; this.cameras.main.shake(500, 0.008); });
    for (let i = 0; i < 6; i++) this.time.delayedCall(150 + i * 160, () => {
      for (const [w, col, a] of [[10, 0x2a2018, 0.35], [4, 0xffffff, 0.95]]) { // pale wave with a dark halo, readable on any backdrop
        const ring = this.add.circle(B.r.x, B.r.y, 50).setStrokeStyle(w, col, a).setDepth(5.9);
        this.tweens.add({ targets: ring, radius: 420, duration: 900, ease: 'Cubic.easeOut', onComplete: () => ring.destroy() });
        this.tweens.add({ targets: ring, alpha: 0, duration: 900, ease: 'Quad.easeIn' }); // stays bright most of the way out
      }
    });
    this.time.delayedCall(1150, () => { B.pose = null; done?.(); });
  }

  // Painted walls are slow to make (~1ms per run), so they're queued per room: the current room and its
  // neighbours are built at once, the rest a few at a time in the background (buildArtSome, each frame).
  plat(ri, ...args) { this.platQueue[ri].push(args); }
  buildArt(i) {
    const near = new Phaser.Geom.Rectangle(this.rooms[i].rect.x - 960, this.rooms[i].rect.y - 544, this.rooms[i].rect.width + 1920, this.rooms[i].rect.height + 1088);
    this.rooms.forEach((r, ri) => {
      if (ri !== i && !Phaser.Geom.Rectangle.Overlaps(near, r.rect)) return;
      for (const args of this.platQueue[ri].splice(0)) Art.platform(this, ...args);
    });
  }
  buildArtSome(budgetMs) {
    const end = performance.now() + budgetMs;
    for (const q of this.platQueue) while (q.length) { Art.platform(this, ...q.shift()); if (performance.now() > end) return; }
  }

  // Shift+R outside boss fights: reset this room in place, like a death that also clears your souls and
  // puts enemies, saws, crumbling floors and falling spikes back. Rebuilding the whole world took ~0.5s.
  retryRoom() {
    const i = this.index, p = this.player;
    this.corpses.forEach((c) => c.destroy());
    this.corpses = [];
    this.spawnWalkers(i);
    for (const sw of this.saws) if (sw.room === i) { sw.x = sw.x0; sw.y = sw.y0; sw.dir = 1; sw.jam = false; }
    this.start = this.rooms[i].spawns[0];
    this.dead = this.charge = this.slide = this.kick = this.buffer = 0;
    this.roomDeaths = 0;
    this.setLying(false);
    p.setVisible(true);
    p.body.moves = true;
    p.body.reset(this.start.x, this.start.y);
    this.retries = (this.retries ?? 0) + 1;
    this.cameras.main.flash(200, 0, 0, 0);
  }

  enterRoom(i) {
    this.buildArt(i);
    const p = this.player, R = this.rooms[i].rect, cam = this.cameras.main;
    this.index = i;
    cam.setZoom(1);
    rules.max = this.treePower ? 3 : Math.max(stats.mothFinished ? 2 : 1, WORLD_SOULS[this.rooms[i].world] ?? rules.max);
    Dialogue.play(this, this.rooms[i].enter);
    if (this.rooms[i].keys) this.showKeys(this.rooms[i].keys);
    this.roomDeaths = 0;
    this.corpses.forEach((c) => c.destroy());
    this.corpses = [];
    this.spawnWalkers(i);
    this.boss = this.bosses.find((b) => b.room === i) ?? null;
    if (this.rooms[i].world !== this.world) this.showWorld(this.rooms[i].world);
    this.start = this.rooms[i].spawns.reduce((a, b) => (Phaser.Math.Distance.Between(p.x, p.y, b.x, b.y) < Phaser.Math.Distance.Between(p.x, p.y, a.x, a.y) ? b : a));
    cam.stopFollow();
    cam.removeBounds();
    this.transit = true;
    this.physics.world.pause();
    this.tweens.add({
      targets: cam, duration: 450, ease: 'Sine.easeInOut',
      scrollX: Phaser.Math.Clamp(p.x - cam.width / 2, R.x, R.right - cam.width),
      scrollY: Phaser.Math.Clamp(p.y - cam.height / 2, R.y, R.bottom - cam.height),
      onComplete: () => {
        cam.setBounds(R.x, R.y, R.width, R.height);
        cam.startFollow(p, true, 0.12, 0.12);
        this.physics.world.resume();
        this.transit = false;
      },
    });
  }

  die(chosen = false) {
    if (this.dead > 0) return;
    GameAudio.play('hero-death-burst');
    const treeSetup = this.boss?.kind === 'tree' && (chosen || this.corpses.length < 2);
    stats.deaths++;
    const p = this.player;
    const [w, h] = this.lying ? BODY_LYING : BODY_STAND;
    // Snap: standing bodies fill one tile, lying bodies span the two tiles nearest you.
    const x = !rules.snap ? p.x : this.lying ? Math.round(p.x / T) * T : Math.floor(p.x / T) * T + T / 2;
    // Snap: standing souls sit on a tile line, lying souls on a half-tile line (a spike death leaves
    // a lying soul flush with the floor, a standing one as a step one tile up).
    const feet = p.y + p.height / 2;
    let bottom = !rules.snap ? feet : this.lying ? Math.ceil((feet - 1) / 16) * 16 : Math.round(feet / T) * T;
    // World 1: a sideways saw that kills you mid-hop still gets your soul in its lane, so the soul jams it.
    const saw = this.saws.find((sw) => sw.room === this.index && sw.dx && Math.abs(sw.x - p.x) < SAW_R + p.width / 2 && Math.abs(sw.y - p.y) < SAW_R + p.height / 2);
    if (saw && rules.snap && this.rooms[this.index].world === 1) bottom = Math.max(bottom, Math.round((saw.y + SAW_R) / T) * T);
    // A soul made by a sideways beam fills that beam's row, so it always blocks it
    // (rounding the feet left it a tile under the beam when you jumped up into it).
    const lane = rules.snap && !this.lying && this.beams().find((r) => r.height === 6 && hit(bounds(p), r));
    if (lane) bottom = Math.ceil(lane.bottom / T) * T;
    const c = this.add.rectangle(x, bottom - h / 2, w, h, 0x7399d9);
    c.vy = 0;
    c.lying = this.lying;
    c.dir = this.face;
    c.setFillStyle(0x7399d9, 0.12); // faint hitbox; the soul figure is drawn in drawFigures()
    if (this.painted && (!this.lying || this.hasSlide)) {
      // A soul is the hero's painting, frozen in the pose he died in, glowing blue-white.
      const [key, frame] = this.lying ? ['heroSlide', SLIDE_FRAMES[0]] : this.heroFrame; // pose may not be drawn yet
      const feet = c.y + c.height / 2, flip = this.face < 0;
      const body = this.add.image(c.x, feet, key, frame).setOrigin(0.5, 1).setScale(key === 'heroWall' ? HERO_HEIGHT / 141 * WALL_SCALE : key === 'heroKick' ? HERO_HEIGHT / 141 : this.heroScale).setFlipX(flip)
        .setTintFill(0x6fb6ee).setAlpha(0.45).setDepth(4.5);
      const glow = this.add.image(c.x, feet, key, frame).setOrigin(0.5, 1).setScale(key === 'heroWall' ? HERO_HEIGHT / 141 * WALL_SCALE : key === 'heroKick' ? HERO_HEIGHT / 141 : this.heroScale).setFlipX(flip)
        .setTint(0xbfe6ff).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.9).setDepth(4.6);
      c.sprites = [body, glow];
      c.on('destroy', () => c.sprites.forEach((sp) => sp.destroy()));
    }
    this.statics.add(c);
    this.corpses.push(c);
    GameAudio.play('hero-soul-appears');
    c.on('destroy', () => GameAudio.play('hero-soul-erased-replaced'));
    if (this.rooms[this.index].name === 'The long pit' && !c.lying &&
        c.x > this.rooms[this.index].rect.x + 3 * T && c.x < this.rooms[this.index].rect.x + 11 * T &&
        bottom > this.rooms[this.index].rect.y + 9 * T && bottom - h < this.rooms[this.index].rect.y + 10 * T)
      Dialogue.play(this, 'lowDoor');
    if (rules.max && this.corpses.length > rules.max) this.corpses.shift().destroy();

    this.charge = 0;
    this.droppers.forEach((d) => this.resetDropper(d));
    this.downed.forEach((d) => this.spawnEnemy(d.sp)); // dying brings stomped enemies back
    this.downed = [];
    // Respawn on top of any bodies sitting on the start point. Only bodies he would stand inside count: a soul
    // floating above his head stays above it, or dying at the start would lift him a tile per death into the ceiling.
    this.setLying(false);
    let y = this.start.y;
    for (const b of [...this.corpses].sort((a, b) => b.y - a.y))
      if (Math.abs(b.x - this.start.x) < b.width / 2 + 12 && b.y - b.height / 2 < y + 15 && b.y + b.height / 2 > y - 15) y = b.y - b.height / 2 - 15;
    p.body.reset(this.start.x, y);
    p.setVisible(false);
    p.body.moves = false; // Gravity must pause with the enemies during respawn.
    this.dead = RESPAWN_DELAY;
    if (this.boss) { this.boss.hp = BOSS_HP; this.boss.hurt = 0;
      if (this.boss.stag) { this.boss.deaths = ++stats.stagDeaths; this.boss.phase = 'setup'; this.boss.clock = 0; this.boss.beam = null; this.boss.again = false; this.boss.gateBroken = false; this.boss.snag = null; }
      if (this.boss.kind === 'tree') { this.boss.phase = 'idle'; this.boss.timer = 4; this.boss.attack = -1; this.boss.open = 0; this.boss.x = this.boss.x0; this.boss.face = -1; this.boss.pods.forEach((p) => p.r.destroy()); this.boss.pods = []; this.boss.waves?.forEach((w) => w.img?.destroy()); this.boss.waves = []; }
    } // your death heals the boss
    if (this.boss?.story === 'mothDown' && !this.boss.hidden) {
      this.boss.r.setSize(BOSS_W, BOSS_H); this.boss.phase = null; this.boss.open = false; this.boss.warn?.clear();
      this.boss.resetWait = 1.5;
      this.boss.r.x = this.rooms[this.index].rect.x + 22 * T;
      this.boss.dir = 1;
      this.shots = this.shots.filter((sh) => { if (!sh.mothDust) return true; sh.destroy(); return false; });
    }
    if (this.rooms[this.index].name === 'First death') Dialogue.play(this, 'firstDeath'); // only the first time; its staging is that room's
    const hint = !treeSetup && this.rooms[this.index].deathTalk?.[++this.roomDeaths]; // hints after repeated deaths in a room
    if (hint) Dialogue.play(this, hint);
    if (chosen) Dialogue.play(this, 'chosenDeath');
  }

  // Bodies fall straight down until they rest on a wall, closed door or another body.
  // Bottom-up order so a stack falls together when its base vanishes.
  dropCorpses(dt) {
    const solids = this.statics.getChildren();
    for (const c of [...this.corpses].sort((a, b) => b.y - a.y)) {
      c.vy = Math.min(c.vy + GRAVITY * dt, MAX_FALL);
      const hw = c.width / 2, hh = c.height / 2, bottom = c.y + hh;
      const next = new Phaser.Geom.Rectangle(c.x - hw, c.y - hh + c.vy * dt, c.width, c.height);
      // A body coming down from above an enemy crushes it.
      for (const e of [...this.enemies]) {
        if (bottom <= bounds(e).y + 2 && hit(next, bounds(e))) { GameAudio.play('walker-crushed'); e.destroy(); this.enemies.splice(this.enemies.indexOf(e), 1); }
      }
      let floor = Infinity;
      for (const s of solids) {
        if (s === c || !s.body.enable) continue;
        const b = bounds(s);
        if (b.y >= bottom - 0.5 && hit(next, b)) floor = Math.min(floor, b.y);
      }
      if (floor < Infinity) { c.y = floor - hh; c.vy = 0; } else c.y += c.vy * dt;
      c.body.updateFromGameObject();
    }
  }

  // Switch hitbox between standing and flat, keeping the feet where they are.
  setLying(on) {
    if (this.lying === on) return;
    const p = this.player, feet = p.y + p.height / 2, [w, h] = on ? FLAT : STAND;
    p.setSize(w, h);
    p.body.setSize(w, h);
    p.y = feet - h / 2;
    this.lying = on;
  }

  // -1 or 1 if a wall or soul is right beside you on that side (not spikes or thorns), else 0.
  wallSide() {
    const pb = bounds(this.player);
    for (const side of [-1, 1]) {
      const probe = new Phaser.Geom.Rectangle(side < 0 ? pb.x - 2 : pb.right, pb.y + 4, 2, pb.height - 8);
      if (this.statics.getChildren().some((s) => s.body.enable && hit(probe, bounds(s)))) return side;
    }
    return 0;
  }

  canStand(height = STAND[1]) {
    const p = this.player, feet = p.y + p.height / 2;
    const r = new Phaser.Geom.Rectangle(p.x - STAND[0] / 2, feet - height, STAND[0], height);
    return !this.statics.getChildren().some((s) => s.body.enable && hit(r, bounds(s)));
  }

  // Bodies and the player are drawn as figures; their rectangles are only hitboxes.
  // The hero is a hooded explorer (cloak, scarf, satchel) lit from the upper left. A soul is the
  // same figure in blue flame; a lying soul is him mid-dive, with a flame trail filling its hitbox.
  drawFigures(t, dt) {
    const g = this.fx, b = this.player.body, p = this.player;
    g.clear();
    this.drawStoryArt(t);
    for (const c of this.corpses) {
      if (c.buried > 0) { g.fillStyle(0x69cfff, 0.5).fillRect(c.x - 15, c.y + c.height / 2 - 4, 30, 4); continue; }
      if (c.sprites) this.soulFlames(g, c, t);
      else this.figure(g, c, { lying: c.lying, dir: c.dir, t, soul: true });
    }
    const grounded = b.blocked.down || b.touching.down;
    // Land sound only after a real moment in the air (standing on an idol flickers 'grounded' every frame).
    this.airTime = grounded ? 0 : (this.airTime ?? 0) + dt;
    if (grounded && !this.audioGrounded && this.landAir > 0.12 && this.dead <= 0) GameAudio.play('hero-land', 3);
    this.landAir = grounded ? 0 : this.airTime;
    this.audioGrounded = grounded;
    this.walk = (this.walk || 0) + (grounded ? Math.abs(b.velocity.x) * dt : 0);
    const step = Math.floor(this.walk / RUN_STEP) % RUN_FRAMES.length;
    if ((step === 0 || step === 3) && step !== this.audioStep && grounded && !this.lying && p.visible && Math.abs(b.velocity.x) > 20) {
      const surface = this.world >= 2 ? 'worlds-2-3' : 'world-1';
      const take = (this.audioTake ?? 0) % 3 + 1;
      this.audioTake = take;
      GameAudio.play(`hero-footstep-${surface}-${take}`, 0, 0.4);
    }
    this.audioStep = step;
    const usePainting = this.painted && (!this.lying || this.hasSlide);
    if (this.painted) this.heroSprite.setVisible(p.visible && usePainting);
    if (!p.visible) return;
    if (!usePainting) {
      this.figure(g, p, { lying: this.lying, dir: this.face, t, vx: b.velocity.x, air: !grounded, walk: this.walk });
      return;
    }
    // Pick the frame: in the air, jump or fall; on the ground, run frames timed to distance covered
    // (one frame per RUN_STEP px, so steps match speed), or the standing painting when still.
    const wallPose = !grounded && b.velocity.y > 0 && this.wallSide() === this.face && this.textures.exists('heroWall');
    const cut = this.talk.active && grounded && Math.abs(b.velocity.x) < 20 && HERO_POSES[this.cutPose];
    this.heroFrame = cut && this.textures.exists(cut[0]) ? [cut[0], Math.min(cut[1] - 1, Math.floor((this.time.now - this.cutPoseAt) / 1000 * 8))]
      : this.lying ? ['heroSlide', SLIDE_FRAMES[Math.floor(t * SLIDE_FPS) % SLIDE_FRAMES.length]]
      : !grounded && this.kick > 0 && this.textures.exists('heroKick') ? ['heroKick', 3]
      : wallPose ? ['heroWall', Math.floor(t * 8) % 6]
      : !grounded ? ['heroSheet', b.velocity.y < 0 ? 6 : 7]
      : Math.abs(b.velocity.x) > 20
        ? (this.textures.exists('heroRun') ? ['heroRun', RUN_FRAMES[Math.floor(this.walk / RUN_STEP) % RUN_FRAMES.length]] : ['heroSheet', Math.floor(this.walk / RUN_STEP) % 6])
      : this.textures.exists('heroIdleAnim') ? ['heroIdleAnim', Math.floor(t * 8) % 8] : ['heroIdle', undefined];
    const [key, frame] = this.heroFrame;
    // Standing frames center on him. The slide is anchored by its feet (the frame's leading edge),
    // a little ahead of center, so the body trails behind and getting up moves him forward.
    // Position from the physics body, which has already moved this frame (the rectangle only catches
    // up after drawing, so using it made the painting trail one frame behind the body).
    const flip = (key === 'heroKick' ? this.lastWall : this.face) < 0, slide = key === 'heroSlide', bx = b.center.x, feet = b.bottom;
    this.heroSprite.setTexture(key, frame).setScale(key === 'heroWall' ? HERO_HEIGHT / 141 * WALL_SCALE : key === 'heroKick' ? HERO_HEIGHT / 141 : this.heroScale * (key === 'heroRun' ? RUN_SCALE : 1)).setFlipX(flip)
      .setOrigin(slide ? this.slideOrigin(frame, flip) : key === 'heroIdleAnim' ? (flip ? 0.27 : 0.73) : cut ? (flip ? 1 - cut[2] : cut[2]) : 0.5, 1) // idle feet sit 73% across the frame
      .setPosition(bx + (slide ? this.face * 12 : 0), feet + 1);
  }

  // Origin for a slide frame: its feet (from tools/sheet.mjs's metadata), mirrored when facing left.
  slideOrigin(frame, flip) {
    const meta = this.cache.json.get('heroSlideMeta'), fw = this.textures.get('heroSlide').get(frame).width;
    const feet = meta ? meta.frames[frame].feet / fw : 0.97;
    return flip ? 1 - feet : feet;
  }

  // Flames and glow over a painted soul.
  soulFlames(g, c, t) {
    const feet = c.y + c.height / 2, tall = c.lying ? 28 : HERO_HEIGHT;
    const top = feet - tall * 0.92;
    g.fillStyle(0x5aa6e6, 0.14);
    g.fillEllipse(c.x, feet - tall / 2, c.lying ? c.width + 14 : 46, tall + 14);
    (c.lying ? [-20, -10, 0, 10, 20] : [-7, -2, 3, 8]).forEach((o, i) => {
      // his head sits toward the way he faces, so the flames shift that way
      const fx = c.x + o + c.dir * 4, fy = top + Math.abs(o) * 0.6, fh = 6 + Math.sin(t * 7 + i * 1.9 + c.x) * 3, lean = Math.sin(t * 5 + i) * 1.5;
      g.fillStyle(0x7cc7ff, 0.55);
      g.fillTriangle(fx - 3, fy, fx + 3, fy, fx + lean, fy - fh);
      g.fillStyle(0xeef8ff, 0.8);
      g.fillTriangle(fx - 1.5, fy, fx + 1.5, fy, fx + lean * 0.5, fy - fh * 0.55);
    });
  }


  figure(g, r, { lying, dir, t, soul = false, vx = 0, air = false, walk = 0 }) {
    const cx = r.x, w = r.width, h = r.height, top = r.y - h / 2, bot = r.y + h / 2;
    const P = (x, y) => ({ x, y });
    const C = soul
      ? { cloak: 0x9fd8ff, dark: 0x6fb6ee, face: 0xd8f0ff, scarf: 0xc6e8ff, bag: 0x8ccaf6, rim: 0xffffff, a: 0.85 }
      : { cloak: 0x34444b, dark: 0x232e33, face: 0x12181a, scarf: 0xb5523b, bag: 0x6b4a32, rim: 0xe8d9a8, a: 1 };
    const speed = Phaser.Math.Clamp(Math.abs(vx) / SPEED, 0, 1);
    if (soul) { g.fillStyle(0x5aa6e6, 0.16); g.fillEllipse(cx, r.y, w + 20, h + 20); }
    let flames, chest;
    if (!lying) {
      const lean = Phaser.Math.Clamp(vx / SPEED, -1, 1) * 2.5, sway = Math.sin(t * 3 + cx) * 1.5;
      const hx = cx + lean + dir, hy = top + 7;
      // legs: stride on the ground, tucked in the air
      const st = air ? 0 : Math.sin(walk * 0.12) * 4.5 * speed;
      const feet = air ? [P(cx - 3, bot - 3), P(cx + 3, bot - 5)] : [P(cx - 2 + st, bot), P(cx + 2 - st, bot)];
      g.lineStyle(3.5, C.dark, C.a);
      feet.forEach((f, i) => g.lineBetween(cx + (i ? 2 : -2) + lean * 0.4, bot - 9, f.x, f.y));
      // cloak tail, body, satchel
      g.fillStyle(C.dark, C.a);
      g.fillTriangle(cx - 4 * dir + lean, top + 12, cx - 6 * dir, bot - 6, cx - (12 + speed * 5) * dir + sway, bot - 3 - speed * 4);
      g.fillStyle(C.cloak, C.a);
      g.fillPoints([P(cx - 6 + lean, top + 11), P(cx + 6 + lean, top + 11), P(cx + 8, bot - 7), P(cx - 8, bot - 7)], true);
      g.fillStyle(C.bag, C.a);
      g.fillRect(cx - dir * 7 - 2.5, bot - 15, 5, 6);
      g.lineStyle(1.2, C.bag, C.a);
      g.lineBetween(cx + lean + dir * 5, top + 12, cx - dir * 6, bot - 14);             // satchel strap
      // hood with a pointed tip behind, face in shadow, one pale eye
      g.fillStyle(C.cloak, C.a);
      g.fillCircle(hx, hy, 6.5);
      g.fillTriangle(hx - dir * 3, top + 1, hx - dir * 10, hy + 2, hx - dir * 2, hy + 4);
      g.fillStyle(C.face, C.a);
      g.fillEllipse(hx + dir * 2.5, hy + 1, 6, 7);
      if (!soul) { g.fillStyle(0xd8f3ea, 1); g.fillCircle(hx + dir * 3.8, hy, 0.9); }
      // scarf: a band at the neck and a tail streaming behind, livelier when moving
      g.fillStyle(C.scarf, C.a);
      g.fillRect(cx - 6 + lean, top + 11, 12, 3);
      const tail = [0, 1, 2, 3, 4].map((i) => P(cx + lean - dir * (5 + i * (3 + speed * 1.5)), top + 12.5 + i * (1.6 - speed * 1.2) + Math.sin(t * 9 - i * 1.3) * (0.6 + speed) * i * 0.5));
      g.lineStyle(2.6, C.scarf, C.a);
      g.strokePoints(tail);
      // rim light from the upper left
      g.lineStyle(1.3, C.rim, soul ? 0.6 : 0.75);
      g.beginPath(); g.arc(hx, hy, 6.3, Math.PI * 0.85, Math.PI * 1.55); g.strokePath();
      g.lineStyle(1.1, C.rim, soul ? 0.4 : 0.45);
      g.lineBetween(cx - 6 + lean, top + 12, cx - 8, bot - 8);
      flames = [P(cx - 6, top + 13), P(hx - 2, top + 2), P(hx + 2, top + 1), P(cx + 6, top + 13)];
      chest = P(cx + lean + 2 * dir, top + 17);
    } else {
      dir = -dir; // slides go feet first: draw the body facing backwards, so the head trails
      const front = cx + dir * (w / 2), back = cx - dir * (w / 2), hip = front - dir * 30;
      g.lineStyle(3.2, C.dark, C.a);                                                  // legs trail behind
      g.lineBetween(hip, bot - 4, hip - dir * 7, bot - 2);
      g.lineBetween(hip, bot - 6, hip - dir * 8, bot - 6);
      g.fillStyle(C.cloak, C.a);
      g.fillPoints([P(front - dir * 11, bot - 9), P(hip, bot - 8), P(hip, bot), P(front - dir * 11, bot)], true);
      g.fillCircle(front - dir * 6, bot - 5, 5.5);                                    // hood, trailing
      g.fillStyle(C.face, C.a);
      g.fillEllipse(front - dir * 4, bot - 4.5, 5, 6);
      g.lineStyle(2.4, C.scarf, C.a);                                                 // scarf streams up and back
      g.strokePoints([0, 1, 2, 3].map((i) => P(front - dir * (11 + i * 4), bot - 9 - i * 1.2 + Math.sin(t * 9 - i) * 1)));
      if (soul) {                                                                     // flame trail
        g.fillStyle(0x7cc7ff, 0.55);
        g.fillTriangle(hip, bot - 9, hip, bot, back, bot - 3 + Math.sin(t * 8 + cx) * 2);
      }
      g.lineStyle(1.1, C.rim, 0.5);
      g.lineBetween(front - dir * 11, bot - 9, hip, bot - 8);
      flames = [-8, -14, -20, -26].map((o) => P(front + dir * o, bot - 8));
      chest = P(front - dir * 15, bot - 5);
    }
    if (soul) {
      flames.forEach((f, i) => {
        const fh = 5 + Math.sin(t * 7 + i * 1.9 + cx) * 3, lean = Math.sin(t * 5 + i) * 1.5;
        g.fillStyle(0x7cc7ff, 0.55);
        g.fillTriangle(f.x - 3, f.y, f.x + 3, f.y, f.x + lean, f.y - fh);
        g.fillStyle(0xeef8ff, 0.8);
        g.fillTriangle(f.x - 1.5, f.y, f.x + 1.5, f.y, f.x + lean * 0.5, f.y - fh * 0.55);
      });
    } else {                                                                          // the amulet
      g.fillStyle(0xffd774, 0.3);
      g.fillCircle(chest.x, chest.y, 5);
      g.fillStyle(0xffd774, 1);
      g.fillCircle(chest.x, chest.y, 2);
    }
  }

  updateEnemies() {
    if (this.dead > 0 || this.talk.active) { // walkers wait while you are dead or in a conversation
      for (const e of this.enemies) e.body.setVelocity(0, 0);
      return;
    }
    const solids = this.statics.getChildren().filter((s) => s.body.enable).map(bounds);
    for (const e of this.enemies) {
      const b = e.body;
      if (e.kind === 't') { // stands still; shoots straight at you along the ground
        b.velocity.x = 0;
        const p = this.player;
        e.dir = Math.sign(p.x - e.x) || 1;
        if (e.img) {
          const until = e.cool, since = THROW_EVERY - until;
          const frame = since < 0.12 ? 2 : since < 0.28 ? 3 : until < 0.3 ? 1 : 0;
          e.img.setPosition(e.x, b.bottom - 16).setFlipX(e.dir > 0).setFrame(frame);
        }
        if (p.visible && Math.abs(p.y - e.y) < 3 * T && (e.cool -= this.game.loop.delta / 1000) <= 0) {
          e.cool = THROW_EVERY;
          const d = Math.sign(p.x - e.x) || 1;
          const shot = this.add.circle(e.x + d * 16, e.y - 4, 5, 0xffb060).setDepth(4);
          if (this.textures.exists('seedShot')) {
            shot.setFillStyle(0, 0);
            shot.img = this.add.image(shot.x, shot.y, 'seedShot').setDisplaySize(10, 10).setDepth(4).setFlipX(d < 0);
            shot.on('destroy', () => shot.img.destroy());
          }
          this.shots.push(Object.assign(shot, { vx: d * SHOT_SPEED }));
        }
        continue;
      }
      if (e.kind === 'i') { // moves toward you only while you're in the air or holding K; walls and souls stop it
        const p = this.player, pb = p.body, dx = p.x - e.x;
        const air = !(pb.blocked.down || pb.touching.down) && !this.enemies.some((o) => o.kind === 'i' && Math.abs(pb.bottom - o.body.top) < 2 && pb.right > o.body.left && pb.left < o.body.right); // standing on an idol is the ground
        const go = p.visible && (air || this.charge > 0) && Math.abs(dx) > 4 && (dx < 0 ? e.x > e.room.x + 16 : e.x < e.room.right - 16);
        if (go) e.dir = Math.sign(dx);
        b.velocity.x = go ? e.dir * IDOL_SPEED : 0;
        const step = Math.floor((this.time.now / 1000) * 8);
        e.img?.setPosition(e.x, b.bottom + 2).setOrigin(0.5, 1).setFlipX(e.dir > 0).setFrame(go && !b.blocked.left && !b.blocked.right ? 1 + (step % 2) : 0);
        continue;
      }
      if (b.blocked.left || b.touching.left || e.x < e.room.x + 16) e.dir = 1; // walls and the room's edges turn it
      else if (b.blocked.right || b.touching.right || e.x > e.room.right - 16) e.dir = -1;
      else if ((b.blocked.down || b.touching.down) && !solids.some((s) => s.contains(e.x + e.dir * 14, e.y + 14)))
        e.dir *= -1; // ledge ahead
      b.velocity.x = e.dir * (e.kind === 'b' ? SCARAB_SPEED : WALKER_SPEED);
      if (e.kind === 'b') { // three walk poses; on its back (frame 3) while falling
        const step = Math.floor((this.time.now / 1000) * 6), down = b.blocked.down || b.touching.down;
        e.img?.setPosition(e.x, b.bottom + 3).setOrigin(0.5, 1).setFlipX(e.dir > 0).setFrame(down ? step % 3 : 3);
      } else if (e.img) {
        const step = Math.floor((this.time.now / 1000) * WALKER_FPS);
        e.img.setPosition(e.x, e.y + 12 - (step % 2)).setFlipX(e.dir > 0) // sheet faces left; 1px bob
          .setFrame(WALKER_FRAMES[step % WALKER_FRAMES.length]);
      }
    }
  }

  // Flyers, shots, saws, crumbling blocks and falling spikes (only the current room's move).
  updateHazards(dt) {
    if (this.talk?.line || this.talk?.queue?.length) return; // saws, flyers and shots wait while they talk
    // A stomped enemy comes back once its starting spot is off screen, so it's there again when you return
    // (and you can't strand yourself without the walker a puzzle needs). Dying or re-entering the room also does it.
    const view = this.cameras.main.worldView;
    this.downed = this.downed.filter((d) => {
      if (view.contains(d.sp.x + T / 2, d.sp.y + T / 2) || this.transit) return true;
      this.spawnEnemy(d.sp);
      return false;
    });
    const solid = (box, skip) => this.statics.getChildren().find((s) => s !== skip && s.body.enable && hit(box, bounds(s)));
    const walls = (box) => this.statics.getChildren().find((s) => s.body.enable && !this.corpses.includes(s) && hit(box, bounds(s)));
    const R = this.rooms[this.index].rect, p = this.player, t = this.time.now / 1000;
    for (const f of this.dead > 0 || this.talk.active ? [] : this.flyers) {
      if (f.kind === 'w') { this.updateSpider(f, dt); continue; }
      const nx = f.x + f.dir * FLYER_SPEED * dt;
      if (walls(new Phaser.Geom.Rectangle(nx - 12, f.y - 8, 24, 16)) || nx < R.x + 16 || nx > R.right - 16) f.dir *= -1;
      else f.x = nx;
      f.y = f.baseY + Math.sin(t * 3 + f.baseY) * 10;
      f.img?.setPosition(f.x, f.y).setFlipX(f.dir > 0).setFrame(Math.floor(t * 12) % 4);
    }
    this.shots = this.shots.filter((sh) => {
      sh.x += sh.vx * dt;
      sh.y += (sh.vy ?? 0) * dt;
      sh.img?.setPosition(sh.x, sh.y);
      if (sh.hw && sh.texture?.key === 'pollen-cloud') sh.setFrame(Math.floor(t * 6 + sh.hw) % 4); // slow swirl
      const gone = () => sh.hw ? this.tweens.add({ targets: sh, alpha: 0, duration: 200, onComplete: () => sh.destroy() }) : sh.destroy(); // a cloud puffs out
      if (sh.mothDust && sh.y + (sh.hw ?? 0) >= R.bottom - T - 4) { gone(); return false; }
      if (!solid(shotBox(sh)) && R.contains(sh.x, sh.y)) return true;
      gone();
      return false;
    });
    for (const sw of this.saws) {
      if (sw.room !== this.index) continue;
      const nx = sw.x + sw.dx * sw.dir * SAW_SPEED * dt, ny = sw.y + sw.dy * sw.dir * SAW_SPEED * dt;
      const block = solid(new Phaser.Geom.Rectangle(nx - SAW_R, ny - SAW_R, SAW_R * 2, SAW_R * 2));
      sw.jam = !!block && this.corpses.includes(block);
      if (sw.jam) { sw.x = sw.dx ? block.x : sw.x; sw.y = sw.dy ? block.y : sw.y; } // sticks inside the soul, so you can walk over it
      else if (!block) { sw.x = nx; sw.y = ny; } else sw.dir *= -1;
    }
    for (const c of this.crumbles) {
      if (c.room !== this.index) continue;
      if (c.body.enable) {
        const pb = bounds(p), cb = bounds(c);
        const on = p.visible && Math.abs(pb.bottom - cb.y) < 3 && pb.right > cb.x + 2 && pb.x < cb.right - 2;
        if (on && c.t <= 0) c.t = CRUMBLE_TIME;
        if (c.t > 0) {
          c.setFillStyle(Math.floor(t * 20) % 2 ? 0xc49a62 : 0x6d5236);
          if ((c.t -= dt) <= 0) { c.body.enable = false; c.setAlpha(0.12); c.back = CRUMBLE_BACK; }
        }
      } else if ((c.back -= dt) <= 0 && !hit(bounds(p), bounds(c))) { c.body.enable = true; c.setAlpha(1).setFillStyle(0x9a7a52); c.t = 0; }
    }
    for (const d of this.droppers) {
      if (d.room !== this.index || d.state === 'gone') continue;
      if (!d.state && p.visible && Math.abs(p.x - d.x0) < 22 && p.y > d.y0) { d.state = 'shake'; d.t = 0.25; }
      if (d.state === 'shake') { d.r.x = d.x0 + Math.sin(t * 80) * 2; if ((d.t -= dt) <= 0) { d.state = 'fall'; d.vy = 0; d.r.x = d.x0; } }
      if (d.state === 'fall') {
        d.vy = Math.min(d.vy + GRAVITY * dt, MAX_FALL);
        d.r.y += d.vy * dt;
        if (solid(bounds(d.r)) || d.r.y > R.bottom) { d.state = 'gone'; d.r.setVisible(false); }
      }
    }
  }

  // Bramble spider: hang; you pass under its column -> shake, drop onto the first wall or soul below, rest, climb back.
  updateSpider(f, dt) {
    const p = this.player, R = this.rooms[this.index].rect;
    if (!f.state && p.visible && Math.abs(p.x - f.x) < 22 && p.y > f.y) { f.state = 'shake'; f.t = SPIDER_SHAKE; }
    if (f.state === 'shake' && (f.t -= dt) <= 0) { f.state = 'drop'; f.vy = 0; }
    if (f.state === 'drop') {
      f.vy = Math.min(f.vy + GRAVITY * dt, MAX_FALL);
      const b = bounds(f), next = new Phaser.Geom.Rectangle(b.x, b.y + f.vy * dt, b.width, b.height);
      let floor = R.bottom;
      for (const s of this.statics.getChildren()) {
        const r = bounds(s);
        if (s.body.enable && r.y > b.y && hit(next, r)) floor = Math.min(floor, r.y); // a soul made under it mid-drop counts too
      }
      if (next.bottom >= floor) { f.y = floor - b.height / 2; f.state = 'rest'; f.t = SPIDER_REST; } else f.y = next.centerY;
    }
    if (f.state === 'rest' && (f.t -= dt) <= 0) f.state = 'climb';
    if (f.state === 'climb' && (f.y -= SPIDER_CLIMB * dt) <= f.y0) { f.y = f.y0; f.state = null; }
    const t = this.time.now / 1000, shake = f.state === 'shake' ? Math.sin(t * 80) * 2 : 0;
    const frame = { shake: Math.floor(t * 16) % 2, drop: 2, rest: 1, climb: 3 }[f.state] ?? 0;
    f.img?.setPosition(f.x + shake, f.y + 4).setFrame(frame);
  }

  resetDropper(d) { d.state = null; d.r.setPosition(d.x0, d.y0).setVisible(true); }

  drawHazards() {
    const g = this.fx, t = this.time.now / 1000;
    for (const f of this.flyers) if (f.kind === 'w') g.lineStyle(1.5, 0x2a1c1c, 0.9).lineBetween(f.x, f.top, f.x, f.y - 6); // silk
    const B = this.boss;
    if (B?.kind === 'tree' && !B.hidden) {
      if (B.phase === 'slam') {
        g.lineStyle(3, 0x69cfff, 1).strokeCircle(B.aimX, B.floor - 16, 24).lineBetween(B.r.x, B.r.y, B.aimX, B.floor);
        const c = this.treeCatch(B); // the soul that will catch the fists
        if (c) g.strokeRect(c.x - c.width / 2 - 4, c.y - c.height / 2 - 4, c.width + 8, c.height + 8);
      } else if (B.phase === 'swing') {
        const box = this.treeSwingBox(B);
        g.fillStyle(0xf1f578, 0.25).fillRect(box.x, box.y, box.width, box.height);
      } else if (B.phase === 'throw') {
        for (const x of B.landings) g.lineStyle(2, 0xf1f578, 0.9).strokeEllipse(x, B.landingY + 4, 76, 12);
      } else if (B.phase === 'spikes' || (B.phase === 'spikesUp' && !B.roots)) { // cracks across the floor, then spikes (triangles without the root art)
        const R = this.rooms[B.room].rect, up = B.phase === 'spikesUp';
        g.fillStyle(0xff8a6b, up ? 0.9 : 0.25 + 0.2 * Math.sin(t * 20));
        for (let x = R.x + T; x < R.right - T; x += 16) up ? g.fillTriangle(x, B.floor, x + 8, B.floor - 18, x + 16, B.floor) : g.fillRect(x + 2, B.floor - 3, 12, 3);
      }
      if (B.open > 0) this.dizzy(B.r.x, B.r.y - 40, 40);
    }
    for (const sw of this.saws) {
      if (sw.room !== this.index) continue;
      if (sw.img) continue;
      g.fillStyle(0x8a8f99, 1).fillCircle(sw.x, sw.y, SAW_R);
      for (let i = 0; i < 8; i++) {
        const a = (sw.jam ? 0 : t * 12) + (i * Math.PI) / 4;
        g.fillStyle(0xd9dde3, 1).fillTriangle(sw.x + Math.cos(a) * SAW_R, sw.y + Math.sin(a) * SAW_R,
          sw.x + Math.cos(a + 0.3) * (SAW_R + 5), sw.y + Math.sin(a + 0.3) * (SAW_R + 5), sw.x + Math.cos(a + 0.5) * SAW_R, sw.y + Math.sin(a + 0.5) * SAW_R);
      }
      g.fillStyle(0x3a3d44, 1).fillCircle(sw.x, sw.y, 4);
    }
  }

  drawStagGrounds() {
    const R = this.rooms.find((r) => r.name === 'The old tree').rect;
    if (this.textures.exists('old-tree'))
      this.add.image(R.x + 21 * T, R.y + 15 * T + 12, 'old-tree').setOrigin(0.5, 1).setScale(0.5).setDepth(1); // roots sunk into the grass lip
    else {
      this.add.rectangle(R.x + 21 * T, R.y + 13 * T, 26, 128, 0x655d60).setDepth(1);
      this.add.circle(R.x + 21 * T, R.y + 9 * T, 65, 0x526672).setDepth(1);
    }
    this.stagWriting = this.add.text(R.x + 16.5 * T, R.y + 13 * T, SCRIPT.stagNote.map((l) => l.text).join('\n'), {
      fontFamily: 'cursive', fontSize: '14px', color: '#382b23', fontStyle: 'italic', wordWrap: { width: 600 }
    }).setScale(0.28, 0.14).setAngle(-4).setDepth(2).setVisible(false);
    const P = this.rooms.find((r) => r.name === 'The pyramid entrance').rect;
    if (this.textures.exists('pyramid')) // the pyramid rising over the jungle, its base on the floor at the room's far end
      this.add.image(P.x + 15 * T, P.y + 15 * T + 6, 'pyramid').setOrigin(0.5, 1).setDisplaySize(880, 491).setDepth(0.5);
    else this.add.triangle(P.x + 22 * T, P.y + 10 * T, 0, 160, 120, 0, 240, 160, 0x708292).setDepth(1);
    this.pyramidDoor = this.textures.exists('pyramidDoor') // a carved double door at the pyramid's base; it opens as he walks up
      ? this.add.image(P.x + 15 * T, P.y + 15 * T, 'pyramidDoor', 0).setOrigin(0.5, 1).setDisplaySize(96, 154).setDepth(2)
      : this.add.rectangle(P.x + 15 * T, P.y + 14 * T, 40, 64, 0x101923).setDepth(2);
  }

  // Every boss shows this while it can be stomped: sparks circling over its head.
  dizzy(x, y, w) {
    for (let i = 0; i < 4; i++) {
      const a = this.time.now / 200 + i * Math.PI / 2, sx = x + Math.cos(a) * w, sy = y + Math.sin(a) * w * 0.24;
      this.fx.fillStyle(0xffef72, 0.95).fillCircle(sx, sy, 8).fillStyle(0xffffff, 1).fillCircle(sx, sy, 3.5);
    }
  }

  // Three hits, three tricks: the plate's gate (once), a soul floating in the antler sweep (2 HP), and at 1 HP a tug of war: the antlers hold the snagged soul, and mashing Space wins it back and topples the stag.
  updateStag(B, dt) {
    const R = this.rooms[B.room].rect, p = this.player, floor = R.y + 15 * T;
    const moved = B.moved; B.moved = false; // walking last frame; dialogue and respawn freeze it in place
    const walkTo = (x, speed) => {
      const d = x - B.r.x;
      if (d) { B.face = Math.sign(d); B.moved = true; B.r.x = Math.abs(d) <= speed * dt ? x : B.r.x + Math.sign(d) * speed * dt; }
      return B.r.x === x;
    };
    const cam = this.cameras.main;
    cam.setZoom(Math.min(1, cam.width / R.width)); cam.stopFollow(); cam.centerOn(R.centerX, R.centerY);
    B.antlers.setVisible(B.r.visible && !B.img).clear().lineStyle(3, 0xd9f3ff);
    for (const dx of [-28, 28]) {
      B.antlers.lineBetween(B.r.x + dx, B.r.y - 32, B.r.x + dx, B.r.y - 66);
      B.antlers.lineBetween(B.r.x + dx, B.r.y - 48, B.r.x + dx + Math.sign(dx) * 17, B.r.y - 62);
    }
    // The gate: a stone pillar in the gallop lane that rises while anything weighs on the plate at the end of the shelf tunnel.
    if (!B.gate) {
      B.plate = this.plates.find((pl) => pl.room === B.room);
      B.gate = this.add.rectangle(R.x + 13.5 * T, floor - T, T, 2 * T, 0x9aa9b8).setStrokeStyle(3, 0xd9f3ff).setDepth(4);
      this.statics.add(B.gate); B.r.on('destroy', () => B.gate.destroy());
    }
    const held = !!B.plate && [p, ...this.corpses].some((w) => w.body?.enable !== false && hit(bounds(w), bounds(B.plate)));
    B.gateUp = held && !B.gateBroken;
    B.gate.setVisible(B.gateUp); B.gate.body.enable = B.gateUp;
    const pose = this.time.now < B.introUntil ? 'intro' : ['sweepTell', 'sweep', 'tug'].includes(B.phase) ? 'wave' : B.phase === 'beam' ? 'beam'
      : B.phase === 'charge' ? 'charge' : moved ? 'walk' : 'idle';
    // Loop times match the hooves to the ground: walk 23 and gallop 55 px of cell per frame, at STAG_WALK and STAG_GALLOP.
    this.bossPose(B, 'stag', pose, 180, pose === 'intro' ? 1 : pose === 'wave' ? STAG_SWEEP : pose === 'walk' ? 0.73 : pose === 'charge' ? 0.37 : 0.7, pose === 'charge' || pose === 'idle' || pose === 'walk');
    // The sheets face left and place the body off-center by a different amount each (pixel mass center, cell px); line the bodies up on B.r.x.
    const shift = ({ idle: 55, intro: 55, charge: -79, beam: 25, wave: 30, walk: -28 }[pose] ?? 0) * (B.img?.scaleX ?? 0);
    B.img?.setFlipX(B.face > 0).setPosition(B.r.x + B.face * shift, B.r.y + 32 + (B.artFoot ?? 0)).setVisible(B.r.visible)
      .setTint(B.phase === 'beam' ? 0x65baff : B.phase === 'dazed' ? 0xb8b8d0 : 0xffffff)
      .setAngle(B.phase === 'dazed' ? Math.sin(B.clock * 5) * 7 : B.phase === 'tug' ? -B.face * (4 + Math.sin(B.clock * 30) * 1.5) : 0); // dazed: it reels; tug: it leans back, straining
    if (B.phase === 'beam' && B.beam && B.img) { // the beam comes from its open mouth (beam sheet: 585x700 cells, mouth at 43,395)
      const scale = B.img.scaleX, side = B.img.flipX ? -1 : 1;
      B.beam.x = B.img.x + side * (43 - 585 / 2) * scale;
      B.beam.y = B.img.y - (700 - 395) * scale;
      this.fx.fillStyle(0x65baff, 0.9).fillCircle(B.beam.x, B.beam.y, 6);
    }
    // The antler sweep's band: in front of it, above your head; a soul floating there snags the antlers.
    const band = new Phaser.Geom.Rectangle(B.face > 0 ? B.r.x + 2 * T : B.r.x - 7 * T, floor - 6 * T, 5 * T, 4 * T);
    if (B.phase === 'sweepTell') {
      this.fx.fillStyle(0xbfe6ff, 0.28 + 0.12 * Math.sin(B.clock * 18)).fillRect(band.x, band.y, band.width, band.height);
      this.fx.lineStyle(3, 0xbfe6ff, 0.8).beginPath()
        .arc(B.r.x + B.face * T, floor - 2 * T, 5.5 * T, B.face > 0 ? -1.4 : Math.PI + 1.4, B.face > 0 ? -0.2 : Math.PI + 0.2, B.face < 0).strokePath();
    }
    if (B.phase === 'dazed') this.dizzy(B.r.x + B.face * 40, B.r.y + 32 - 215, 50);
    B.tugText ??= this.add.text(0, 0, 'Press  SPACE', { fontFamily: 'Georgia, serif', fontSize: '22px', color: '#f1e3b8', backgroundColor: '#000000aa', padding: { x: 14, y: 8 } }).setOrigin(0.5).setDepth(46);
    if (!B.tugText.hooked) { B.tugText.hooked = true; B.r.on('destroy', () => B.tugText.destroy()); }
    const tugging = B.phase === 'tug' && this.corpses.includes(B.snag);
    B.tugText.setVisible(tugging);
    if (tugging) { // a strained tether from the antler tips to the soul
      const ax = B.r.x + B.face * 70, ay = floor - 5 * T, jx = Math.sin(B.clock * 47) * 3;
      this.fx.lineStyle(7, 0xbfe6ff, 0.35).lineBetween(ax, ay, B.snag.x + jx, B.snag.y);
      this.fx.lineStyle(3, 0xffffff, 0.95).lineBetween(ax, ay, B.snag.x + jx, B.snag.y);
      // The bar: your side (blue, from the soul's end) against the stag's (pale gold).
      const bx = (ax + B.snag.x) / 2, by = Math.min(ay, B.snag.y) - 70, w = 220, mine = Phaser.Math.Clamp(B.tug, 0, 1) * w;
      const left = B.snag.x < ax; // which end of the bar is yours
      this.fx.fillStyle(0x000000, 0.6).fillRect(bx - w / 2 - 4, by - 10, w + 8, 20);
      this.fx.fillStyle(0xf1e3b8, 0.9).fillRect(bx - w / 2, by - 6, w, 12);
      this.fx.fillStyle(0x69cfff, 1).fillRect(left ? bx - w / 2 : bx + w / 2 - mine, by - 6, mine, 12);
      this.fx.lineStyle(2, 0xffffff, 0.9).lineBetween(bx, by - 10, bx, by + 10);
      B.tugText.setPosition(bx, by - 34).setScale(1 + 0.08 * Math.sin(B.clock * 16));
    }
    if (this.dead > 0 || this.transit || this.talk.line || this.talk.queue.length) return;
    if (p.x > R.x + 1.5 * T) this.gates.filter((g) => g.active && g.room === B.room).forEach((g) => { g.body.enable = true; });
    if (!Dialogue.seen.has('stagArrival')) { Dialogue.play(this, 'stagArrival'); return; }
    if (B.hidden) return;
    B.hurt -= dt; B.clock += dt;
    if (B.phase === 'setup') {
      if (p.x < R.x + 7 * T && p.y + 15 > R.y + 12 * T) { B.clock = 0; return; }
      if (B.clock < 8 && p.x < R.x + 7 * T) return;
      B.phase = 'windup'; B.clock = 0;
    }
    const gap = 3 * Math.pow(0.8, 3 - B.hp);
    const next = (phase) => { B.phase = phase; B.clock = 0; };
    const daze = () => { B.stomped = false; next('dazed'); this.cameras.main.shake(200, 0.01); };
    // The gallop runs wall to wall: from the vines under the left platform to the right shelf.
    const lane = (to) => new Phaser.Geom.Rectangle(Math.min(B.r.x, to) - B.r.width / 2, B.r.y - B.r.height / 2, Math.abs(to - B.r.x) + B.r.width, B.r.height);
    const tell = B.again ? 0.6 : 0.9, lock = tell - 0.4;
    if (B.phase === 'windup') {
      if (B.clock < lock) {
        B.face = p.x > B.r.x ? 1 : -1;
        B.aimX = B.face > 0 ? R.x + 33 * T - B.r.width / 2 : R.x + 5 * T + B.r.width / 2;
      }
      const L = lane(B.aimX);
      this.fx.fillStyle(0xf5f582, B.clock >= lock ? 0.3 : 0.12).fillRect(L.x, L.y, L.width, L.height);
      if (B.clock >= tell) next('charge');
    } else if (B.phase === 'charge') {
      walkTo(B.aimX, STAG_GALLOP);
      for (const c of this.corpses.filter((c) => c.body.enable && !c.lying && hit(bounds(c), bounds(B.r)))) {
        const bottom = c.y + c.height / 2; // trampled flat, never destroyed; flat souls stay walk-through here
        c.lying = true; c.setSize(...BODY_LYING); c.y = bottom - BODY_LYING[1] / 2;
        c.body.setSize(...BODY_LYING); c.body.updateFromGameObject();
        c.sprites?.forEach(sp => sp.destroy()); c.sprites = [];
        c.setFillStyle(0x7399d9, 0.6);
      }
      if (B.gateUp && hit(bounds(B.gate), bounds(B.r))) { // slams into the risen gate, which shatters
        B.r.x = B.gate.x - B.face * (T / 2 + B.r.width / 2);
        B.gateBroken = true; B.again = false; B.gate.setVisible(false); B.gate.body.enable = false;
        this.playFx('impact', B.gate.x, floor - T, 3 * T, 3.4 * T, 500);
        daze();
      } else if (B.r.x === B.aimX) next('miss');
    } else if (B.phase === 'miss' && B.clock >= 0.5) {
      B.again = B.hp === 1 && !B.again; // its last stand: gallops back at once
      if (B.again) next('windup');
      else if (B.hp === 3) next('recovery');
      else if (B.hp === 2) next('stalk');
      else { // 1 HP: dodge the beam, then the sweep
        next('beam'); B.face = p.x > B.r.x ? 1 : -1; B.beam = { x: B.r.x, y: B.r.y, angle: B.face > 0 ? 0 : Math.PI, clock: 0, stag: true };
      }
    } else if (B.phase === 'stalk') { // walks up to you, then rears for the antler sweep
      const close = Math.abs(p.x - B.r.x) < 6 * T;
      if (!close) walkTo(Phaser.Math.Clamp(p.x, R.x + 8 * T, R.x + 30 * T), STAG_WALK);
      if (close || B.clock >= 3) { B.face = p.x > B.r.x ? 1 : -1; next('sweepTell'); }
    } else if (B.phase === 'sweepTell' && B.clock >= STAG_SWEEP) {
      next('sweep');
      const snag = this.corpses.find((c) => c.body.enable && hit(bounds(c), band));
      if (snag) { // antlers snag the soul: at 2 HP it crashes down; at 1 HP it holds on and pulls
        this.playFx('impact', snag.x, snag.y, 2 * T, 2.25 * T, 500);
        if (B.hp === 1) { B.snag = snag; B.tug = 0.5; this.tugPresses = 0; next('tug'); } else daze();
      } else if (hit(bounds(p), band)) return this.die();
    } else if (B.phase === 'tug') { // your Space presses (counted in the controls, which the tug takes over) against its pull
      B.tug += (this.tugPresses ?? 0) * STAG_TUG_PRESS - STAG_TUG_PULL * dt; this.tugPresses = 0;
      if (!this.corpses.includes(B.snag) || B.tug <= 0) { B.snag = null; next('recovery'); } // it wins: shakes the soul loose
      else if (B.tug >= 1) { B.snag = null; this.cameras.main.flash(200, 190, 230, 255); daze(); } // you win: the tether snaps, it topples backward
    } else if (B.phase === 'sweep' && B.clock >= 0.3) {
      next('recovery');
    } else if (B.phase === 'dazed' && B.clock >= STAG_DAZE) {
      if (B.hp === 3 && B.gateBroken) { B.gateBroken = false; this.playFx('impact', B.gate.x, floor - T, 2 * T, 2.25 * T, 400); } // missed the stomp: the gate grows back
      next('recovery');
    } else if (B.phase === 'beam') {
      if (B.beam.clock < 1.98) this.updateAimedBeam(B.beam, dt);
      else next('stalk');
    } else if (B.phase === 'recovery') { // walks toward you (the Veo walk), then winds up
      if (Math.abs(p.x - B.r.x) > 8 * T) walkTo(Phaser.Math.Clamp(p.x, R.x + 8 * T, R.x + 30 * T), STAG_WALK);
      if (B.clock >= gap) { B.again = false; next('windup'); }
    }
    if (B.deaths >= 10) Dialogue.play(this, 'stagNudge');
  }

  updateBoss(dt) {
    for (const c of this.corpses) if (c.buried > 0 && (c.buried -= dt) <= 0) {
      c.buried = 0; c.body.enable = true; c.setAlpha(1); c.sprites?.forEach((s) => s.setAlpha(0.6));
    }
    const B = this.boss;
    if (B?.hp <= 0) return;
    if (B?.stag) return this.updateStag(B, dt);
    if (B?.kind === 'tree') return this.updateTree(B, dt);
    if (B?.img) B.img.setPosition(B.r.x, B.r.y).setVisible(B.r.visible).setAlpha(B.r.alpha).setFlipX(B.dir > 0) // sheet faces left
      .setFrame(B.pose ?? MOTH_FRAMES[Math.floor((this.time.now / 1000) * MOTH_FPS) % MOTH_FRAMES.length]);
    if (!B || B.hidden) return;
    if (B.story === 'mothDown') {
      if (this.player.x > this.rooms[B.room].rect.x + 1.5 * T)
        this.gates.filter((g) => g.room === B.room).forEach((g) => { g.body.enable = true; });
      if ((B.resetWait = Math.max(0, (B.resetWait ?? 0) - dt)) > 0) return;
      return this.updateMoth(B, dt);
    }
    B.hurt -= dt;
    B.r.x += B.dir * (BOSS_SPEED + (BOSS_HP - B.hp) * BOSS_SPEEDUP) * dt;
    if (B.r.x < B.min || B.r.x > B.max) { B.r.x = Phaser.Math.Clamp(B.r.x, B.min, B.max); B.dir *= -1; }
    B.r.setAlpha(B.hurt > 0 ? 0.4 : 1);
  }

  updateMoth(B, dt) {
    const R = this.rooms[B.room].rect, p = this.player, floor = R.bottom - T;
    B.hurt = Math.max(0, B.hurt - dt);
    B.warn ??= this.add.graphics().setDepth(5);
    B.warn.clear();
    if (this.dead > 0 || this.transit || this.talk.line || this.talk.queue.length) return;
    const gap = 1.2 * 0.8 ** (BOSS_HP - B.hp);
    const enter = (phase) => { B.phase = phase; B.clock = 0; };
    // One drifting pollen cloud (hw: its hit box's half width, inside the art's soft edge). Souls stop it.
    const cloud = (x, y, vx, vy, hw) => {
      const sh = this.textures.exists('pollen-cloud') ? this.add.image(x, y, 'pollen-cloud', 0).setDisplaySize(hw * 2.35, hw * 2.8)
        : this.add.circle(x, y, hw, 0xffef72, 0.7);
      GameAudio.play('moth-wing-dust-shot');
      this.shots.push(Object.assign(sh.setDepth(4), { vx, vy, hw, mothDust: true }));
    };
    if (!B.phase) { enter('pause'); B.r.y = floor - 96; B.fired = 0; }
    B.clock += dt;
    B.pose = ['diveTell', 'dive'].includes(B.phase) ? 0 : undefined; // wings down
    B.img?.setAngle(B.phase === 'stunned' ? 25 : B.phase === 'loomTell' ? Math.sin(B.clock * 40) * 6 : 0);
    const flyTo = (x, y) => {
      const distance = Math.hypot(x - B.r.x, y - B.r.y), step = Math.min(1, 900 * dt / (distance || 1));
      B.dir = Math.sign(x - B.r.x) || B.dir;
      B.r.x += (x - B.r.x) * step; B.r.y += (y - B.r.y) * step;
      return distance <= 900 * dt;
    };
    B.r.setAlpha(B.hurt > 0 ? 0.4 : 1);
    B.warn.lineStyle(2, 0xffef72, 0.8);
    if (B.phase === 'loomTell') {
      B.warn.strokeCircle(B.r.x, B.r.y, 40 + Math.sin(B.clock * 40) * 5);
      if (B.clock >= 0.6) { enter('loom'); B.fired = 0; }
    } else if (B.phase === 'loom') {
      if (B.clock >= B.fired * 0.7) { // one slow cloud aimed at you; a second after hit two
        const a = Math.atan2(p.y - B.r.y - BOSS_H / 2, p.x - B.r.x);
        cloud(B.r.x, B.r.y + BOSS_H / 2, Math.cos(a) * 150, Math.sin(a) * 150, 28);
        if (++B.fired >= (B.hp === 1 ? 2 : 1)) enter('loomGap');
      }
    } else if (B.phase === 'loomGap' && B.clock >= gap) {
      enter('diveApproach');
      B.lane = Phaser.Math.Clamp(p.x, B.min, B.max);
    } else if (B.phase === 'diveApproach') {
      if (flyTo(B.lane, floor - 160)) enter('diveTell');
    } else if (B.phase === 'diveTell') {
      B.warn.strokeRect(B.lane - BOSS_W / 2, floor - 200, BOSS_W, 200);
      if (B.clock >= 0.8) enter('dive');
    } else if (B.phase === 'dive') {
      B.r.y += 320 * dt;
      const soul = this.corpses.find((c) => hit(bounds(c), bounds(B.r)));
      if (soul) {
        B.r.y = bounds(soul).top - BOSS_H / 2;
        enter('stunned'); B.open = true;
        this.playFx('impact', B.r.x, bounds(soul).top, 2 * T, 2.25 * T, 500);
      } else if (B.clock >= 0.5) enter('diveGap');
    } else if (B.phase === 'stunned') {
      this.dizzy(B.r.x, B.r.y - BOSS_H / 2 - 14, 40);
      if (B.clock >= 2) { B.open = false; enter('diveGap'); }
    } else if (B.phase === 'diveGap' && B.clock >= gap) {
      enter('curtainApproach');
    } else if (B.phase === 'curtainApproach') {
      if (flyTo(B.max, floor - 96)) enter('curtainTell');
    } else if (B.phase === 'curtainTell') {
      for (let i = 0; i < 3; i++) B.warn.strokeRect(R.x + (3 + i * 8) * T, R.y + T, 6 * T, 10);
      if (B.clock >= 1) { enter('curtain'); B.fired = 0; }
    } else if (B.phase === 'curtain') {
      if (B.clock >= B.fired * 0.45) {
        for (const dx of [1.5, 4.5]) cloud(R.x + (3 + B.fired * 8 + dx) * T, R.y + T + 48, 0, 280, 1.5 * T - 2); // two clouds fill the 6-tile strip; under the ceiling, or it dies inside it
        if (++B.fired === 3) enter('curtainGap');
      }
    } else if (B.phase === 'curtainGap' && B.clock >= gap) {
      enter(B.hp < BOSS_HP ? 'skimmerTell' : 'pause');
    } else if (B.phase === 'skimmerTell') {
      B.r.y = Phaser.Math.Linear(floor - 96, floor - 12, Math.min(1, B.clock / 0.8));
      B.warn.strokeRect(B.min, floor - 24, B.max - B.min, 24);
      if (B.clock >= 0.8) { B.r.setSize(BOSS_W, 24); enter('skimmer'); }
    } else if (B.phase === 'skimmer') {
      B.r.x = Math.max(B.min, B.max - B.clock * 360);
      if (B.r.x <= B.min) enter('pause');
    } else if (B.phase === 'pause' && B.clock >= 2 * 0.8 ** (BOSS_HP - B.hp)) {
      B.r.setSize(BOSS_W, BOSS_H); enter('loomApproach');
    } else if (B.phase === 'loomApproach') {
      if (flyTo(B.max, floor - 96)) { enter('loomTell'); B.fired = 0; }
    }
  }

  // Attack sheets start at the wind-up and hold their recovery frame.
  bossPose(B, kind, pose, height, duration, loop = false, last = Infinity) { // last: play frames 0..last, hold last
    const key = `${kind}-${pose}`;
    if (!B.img || !this.textures.exists(key)) return;
    const tex = this.textures.get(key), info = this.cache.json.get(`${key}-frames`);
    if (!info) return;
    const { frameWidth: fw, frameHeight: fh } = info, source = tex.getSourceImage();
    const cols = Math.floor(source.width / fw), all = cols * Math.floor(source.height / fh), count = Math.min(all, last + 1);
    if (!tex.has(0)) for (let i = 0; i < all; i++) tex.add(i, 0, (i % cols) * fw, Math.floor(i / cols) * fh, fw, fh);
    if (B.artPose !== key) { B.artPose = key; B.artStart = this.time.now; }
    const frame = Math.floor((this.time.now - B.artStart) / (duration * 1000) * count);
    const sourceHeight = kind === 'stag' ? { idle: 486, intro: 584, charge: 500, beam: 555, wave: 617, walk: 520 }[pose] : fh;
    const scale = height / sourceHeight;
    B.artFoot = (fh - (kind === 'stag' ? { idle: 660, intro: 677, charge: 676, beam: 653, wave: 676, walk: 645 } : { dormant: 658, wake: 652, stand: 652, settle: 652, walk: 652, swing: 653, slam: 652, throw: 653, fall: 652 })[pose]) * scale; // empty rows under the feet
    B.img.setTexture(key, loop ? frame % count : Math.min(count - 1, frame)).setScale(scale);
    if (pose === 'idle') B.img.setFrame(0).setScale(scale, scale * (1 + Math.sin(this.time.now / 320) * 0.012));
  }

  fallenBoss(B) {
    const kind = B.stag ? 'stag' : B.kind === 'tree' ? 'tree' : 'moth', key = `${kind}-fallen`;
    if (!this.textures.exists(key)) return;
    if (kind === 'tree' && !B.fell && B.img && this.textures.exists('tree-fall')) { // topples over 3 frames, then lies there
      B.fell = true;
      for (let i = 0; i <= 3; i++) this.time.delayedCall(i * 180, () => {
        if (!B.img?.active) return;
        if (i === 3) return this.fallenBoss(B);
        this.bossPose(B, 'tree', 'fall', TREE_ART, 0.54);
        B.img.setPosition(B.x, B.floor + B.artFoot).clearTint().setVisible(true).setAlpha(1);
      });
      return;
    }
    if (!B.img) {
      B.img = this.add.image(B.r.x, B.r.y, key).setDepth(4);
      B.r.on('destroy', () => B.img.destroy());
    }
    const floor = B.floor ?? (B.stag ? B.r.y + 32 : this.rooms[B.room].rect.bottom - T); // the stag's room has two floor rows
    const tex = this.textures.get(key);
    // Fallen paintings have wide transparent margins.
    const [x, y, w, h] = { moth: [464, 310, 344, 104], tree: [4, 234, 726, 437], stag: [558, 306, 136, 86] }[kind];
    if (!tex.has('pose')) tex.add('pose', 0, x, y, w, h);
    B.img.setTexture(key, 'pose').setOrigin(0.5, 1).setVisible(true).setAlpha(1).clearTint().setFlipX(kind === 'tree' && B.face > 0);
    B.img.setScale((kind === 'tree' ? TREE_ART / 700 * w : kind === 'stag' ? 160 : 170) / w);
    B.img.setPosition(kind === 'tree' ? B.x : B.r.x, kind === 'moth' ? B.r.y : floor);
    B.r.setFillStyle(0, 0);
    B.antlers?.setVisible(false);
    if (kind === 'moth') this.tweens.add({ targets: B.img, y: floor, duration: 650, ease: 'Quad.easeIn' });
  }

  // Plays an effect sheet (assets/effects) once at w x h, then removes it. Null when its art isn't loaded.
  playFx(key, x, y, w, h, ms) {
    if (!this.textures.exists(key)) return null;
    const n = this.textures.get(key).frameTotal - 1, s = this.add.image(x, y, key, 0).setDisplaySize(w, h).setDepth(5);
    this.tweens.addCounter({ from: 0, to: n, duration: ms, onUpdate: (tw) => s.active && s.setFrame(Math.min(n - 1, Math.floor(tw.getValue()))), onComplete: () => s.destroy() });
    return s;
  }

  // The slam lands at the fist (on the soul's top when one catches it). On the floor it also sends a shockwave
  // each way along the ground: a moving hitbox (jump it; a soul in its path stops it). Returns the fist's x.
  treeImpact(B, y, waves) {
    GameAudio.play('tree-slam');
    const x = B.x + B.face * TREE_REACH;
    this.playFx('impact', x, y - 24, 72, 80, 350);
    if (waves) for (const dir of [-1, 1]) {
      const img = this.textures.exists('shockwave') ? this.add.image(x, B.floor - 22, 'shockwave', 0).setDisplaySize(106, 48).setFlipX(dir < 0).setDepth(4.4) : null;
      (B.waves ??= []).push({ x: x + dir * 24, dir, left: TREE_WAVE_RANGE, img });
    }
    return x;
  }

  // Shockwaves roll outward; touching one on the floor kills, a soul or wall stops it.
  updateTreeWaves(B, dt) {
    const p = this.player, feet = p.y + p.height / 2;
    for (const w of B.waves ?? []) {
      const step = Math.min(w.left, TREE_WAVE_SPEED * dt);
      w.x += w.dir * step; w.left -= step;
      const box = new Phaser.Geom.Rectangle(w.x - 20, B.floor - 22, 40, 22);
      const blocked = this.corpses.some((c) => hit(bounds(c), box)) || !this.rooms[B.room].rect.contains(w.x, B.floor - 8);
      w.img?.setPosition(w.x, B.floor - 22).setFrame(Math.floor(this.time.now / 90) % 4).setAlpha(Math.min(1, w.left / 40));
      if (blocked || w.left <= 0) { w.img?.destroy(); w.done = true; continue; }
      if (p.visible && this.dead <= 0 && hit(bounds(p), box) && feet > B.floor - 22) return this.die();
    }
    if (B.waves) B.waves = B.waves.filter((w) => !w.done);
  }

  updateTree(B, dt) {
    const R = this.rooms[B.room].rect, p = this.player, feet = p.y + p.height / 2;
    // Attacks reach their strike frame as the tell ends (swing 8 of 10, throw 8 of 10); the slam and the spikes
    // land the fist on frame 7 of 10 as the tell ends and hold it there, through the stuck hands too.
    const moving = B.x !== B.lastX; B.lastX = B.x;
    const ground = B.open > 0 || ['slam', 'spikes', 'spikesUp'].includes(B.phase);
    const intro = TREE_INTRO - B.timer; // seconds into the intro: wake, stand and roar, settle
    const [pose, duration, last] = B.hidden ? ['dormant', 1] : B.phase === 'intro'
        ? (intro < TREE_WAKE ? ['wake', TREE_WAKE] : intro < TREE_WAKE + TREE_STAND ? ['stand', TREE_STAND] : ['settle', TREE_SETTLE])
      : ground ? ['slam', (B.phase === 'slam' ? TREE_GLOW : TREE_SPIKES) * 7 / 6, 6]
      : B.phase === 'swing' ? ['swing', 1] : B.phase === 'throw' ? ['throw', 0.875]
      : ['walk', 12 * 22 * (TREE_ART / 700) / TREE_WALK]; // 12 steps of ~22 px (sheet scale) per cycle, at walking speed
    this.bossPose(B, 'tree', pose, TREE_ART, duration, pose === 'walk', last);
    if (pose === 'walk' && !moving) B.img?.setFrame(0).setScale(B.img.scaleX, B.img.scaleX * (1 + Math.sin(this.time.now / 320) * 0.012)); // stands and breathes
    B.r.setPosition(B.x + B.face * TREE_MASK[0], B.floor - TREE_MASK[1]);
    const rising = B.phase === 'spikesUp' && !B.hidden; // roots burst up across the floor, behind the souls
    if (rising && !B.roots && this.textures.exists('root'))
      B.roots = Array.from({ length: Math.floor((R.width - 2 * T) / 14) }, (_, i) => this.add.image(R.x + T + 7 + i * 14, B.floor, 'root', 0).setOrigin(0.5, 1).setDisplaySize(17, 26 + (i * 7 % 3) * 4).setDepth(1).setFlipX(i % 2 > 0)); // under a soul's top
    B.roots?.forEach((r, i) => r.setVisible(rising).setFrame(Math.min(3, Math.floor((TREE_SPIKES_UP - B.timer) / 0.03 + (i % 3) / 2))));
    B.img?.setPosition(B.x, B.floor + B.artFoot).setFlipX(B.face > 0)
      .setTint({ slam: 0x69cfff, spikes: 0xff8a6b, spikesUp: 0xff8a6b, swing: 0xf1f578, throw: 0xf1f578 }[B.phase] ?? 0xffffff);
    if (B.hidden || this.dead > 0 || this.talk.line || this.talk.queue.length || this.transit) return;
    this.updateTreeWaves(B, dt);
    if (this.dead > 0) return; // a wave got you
    B.hurt -= dt;
    if (p.body.blocked.down || p.body.touching.down) B.stompReady = true;
    const walk = (to, speed) => { B.x += Phaser.Math.Clamp(Phaser.Math.Clamp(to, R.x + 3 * T, R.right - 3 * T) - B.x, -speed * dt, speed * dt); };
    for (const pod of [...B.pods]) {
      pod.vy += 700 * dt; pod.r.x += pod.vx * dt; pod.r.y += pod.vy * dt;
      const blocked = this.corpses.some((c) => !c.buried && hit(bounds(c), bounds(pod.r)));
      const landed = pod.r.y >= B.floor - 8;
      if (!blocked && (hit(bounds(p), bounds(pod.r)) || landed && Math.abs(p.x - pod.r.x) < 38 && feet > B.floor - 28)) return this.die();
      if (blocked || landed) {
        if (landed) this.playFx('mortar-burst', pod.r.x, B.floor - 36, 76, 83, 350); // spikes reach the burst's 38px
        GameAudio.play('tree-seed-pod-burst');
        pod.r.destroy(); B.pods.splice(B.pods.indexOf(pod), 1);
      }
    }
    if (B.phase === 'intro' && !B.screamed && !B.hidden && intro >= TREE_WAKE + TREE_STAND * 7 / 14) { // the mouth opens: ROAR
      B.screamed = true;
      GameAudio.play('tree-scream');
      this.cameras.main.shake(900, 0.008);
      for (let i = 0; i < 6; i++) this.time.delayedCall(i * 160, () => { // sound-wave rings from the mask, like the moth's
        for (const [w, col, a] of [[10, 0x2a2018, 0.35], [4, 0xffffff, 0.95]]) {
          const ring = this.add.circle(B.r.x, B.r.y, 40).setStrokeStyle(w, col, a).setDepth(5.9);
          this.tweens.add({ targets: ring, radius: 420, duration: 900, ease: 'Cubic.easeOut', onComplete: () => ring.destroy() });
          this.tweens.add({ targets: ring, alpha: 0, duration: 900, ease: 'Quad.easeIn' });
        }
      });
    }
    if (B.open > 0) { B.open = Math.max(0, B.open - dt); return; }
    if (B.phase === 'idle') { // lumber toward you
      B.face = Math.sign(p.x - B.x) || B.face;
      if (Math.abs(p.x - B.x) > 3 * T) walk(p.x, TREE_WALK);
    } else if (B.phase === 'slam') walk(B.aimX - B.face * TREE_REACH, TREE_LUNGE); // reach the target in time
    if (B.phase === 'spikesUp' && feet > B.floor - 12) return this.die(); // on the floor, not on a soul
    if ((B.timer -= dt) > 0) return;
    if (B.phase === 'idle' || B.phase === 'intro') {
      B.attack = (B.attack + 1) % 4;
      B.phase = ['swing', 'throw', 'slam', 'spikes'][B.attack];
      B.timer = [0.8, 0.7, TREE_GLOW, TREE_SPIKES][B.attack];
      if (B.phase === 'throw') { B.landingY = feet - 8; B.landings = [-64, 0, 64].map((dx) => Phaser.Math.Clamp(p.x + dx, R.x + T, R.right - T)); }
      if (B.phase === 'slam') { B.aimX = p.x; B.face = Math.sign(B.aimX - B.x) || B.face; } // locks where you stand
      return;
    }
    if (B.phase === 'swing') {
      GameAudio.play('tree-branch-swing');
      if (hit(bounds(p), this.treeSwingBox(B))) return this.die();
    } else if (B.phase === 'throw') {
      const s = TREE_ART / 700, hx = B.x + B.face * (348 - 60) * s, y = B.floor - (653 - 380) * s; // the throwing hand (throw sheet)
      for (const x of B.landings) {
        const r = this.textures.exists('seedPod') ? this.add.image(hx, y, 'seedPod').setDisplaySize(20, 20) : this.add.rectangle(hx, y, 20, 20, 0xf1f578);
        GameAudio.play('tree-seed-pod-launch');
        B.pods.push({ r, vx: (x - hx) / 0.9, vy: (B.landingY - y - 350 * 0.81) / 0.9 });
      }
    } else if (B.phase === 'slam') { // a soul where the fists land catches them: they stick, and you're spared
      const c = this.treeCatch(B);
      const fist = this.treeImpact(B, c ? bounds(c).top : B.floor, !c); // a caught slam sends no wave
      this.cameras.main.shake(180, 0.005);
      if (c) B.open = TREE_STUCK;
      else if (Math.abs(p.x - fist) < TREE_FIST && feet > B.floor - 40) return this.die(); // the fist itself
    } else if (B.phase === 'spikes') { // spikes rise across the whole floor
      GameAudio.play('tree-slam'); this.cameras.main.shake(TREE_SPIKES_UP * 1000, 0.006);
      B.phase = 'spikesUp'; B.timer = TREE_SPIKES_UP; return;
    }
    B.timer = 1.6 * Math.pow(0.8, BOSS_HP - B.hp); B.phase = 'idle';
  }

  treeCatch(B) { return this.corpses.find((c) => !c.buried && Math.abs(c.x - B.aimX) < TREE_FIST + c.width / 2); }

  treeSwingBox(B) { return new Phaser.Geom.Rectangle(B.face < 0 ? B.x - 3.2 * T : B.x, B.floor - 2.8 * T, 3.2 * T, 2.8 * T); } // the arm's sweep, chest high

  // Use the previous feet position so a fast fall still counts as landing on top.
  touchBoss() {
    const B = this.boss, p = this.player;
    if (!B || B.hidden || !hit(bounds(p), bounds(B.r))) return false;
    const top = bounds(B.r).top;
    const falling = p.body.velocity.y >= 0;
    if (!falling && p.y + 15 <= top + 18) return false;
    if (!falling || (this.bossPreviousFeet ?? p.body.prev.y + p.body.height) > top + 1) {
      if (B.kind === 'tree') return false;
      if (B.story === 'mothDown' && (B.phase === 'stunned' || B.phase?.endsWith('Approach'))) return false;
      if (B.stag && B.phase !== 'charge') return false; // only the gallop hurts
      this.die(); return true;
    }
    p.body.reset(p.x, top - p.height / 2);
    p.body.velocity.y = -JUMP * (B.stag ? 1 : 0.8);
    if (B.hurt > 0 || (B.stag && (B.phase !== 'dazed' || B.stomped)) || (B.kind === 'tree' && (B.stompReady === false || B.open <= 0))) return false;
    if (B.stag) B.stomped = true;
    if (B.kind === 'tree') { B.stompReady = false; B.open = 0; }
    GameAudio.play(`${GameAudio.kind(B)}-${B.kind === 'tree' ? 'mask-hit' : 'hit'}`);
    B.hurt = B.story === 'mothDown' ? 0.9 : 0.5; // the moth's longer: a bounce can't land a second stomp at once
    this.cameras.main.shake(180, 0.008);
    B.img?.setTintFill(0xffffff);
    this.time.delayedCall(120, () => B.img?.active && B.img.clearTint());
    if (B.story === 'mothDown') {
      B.open = false; B.phase = 'diveGap'; B.clock = 0; B.warn?.clear();
      for (const sh of this.shots.filter((sh) => sh.mothDust)) sh.destroy();
      this.shots = this.shots.filter((sh) => !sh.mothDust);
    }
    if (--B.hp <= 0 && B.story) { // a story boss stops still; its script dissolves it (cue 'absorb')
      GameAudio.play(`${GameAudio.kind(B)}-defeat`);
      B.hidden = true;
      this.fallenBoss(B);
      // Shift+R during the scene brings the boss back unbeaten, so its scene (which grants the win) must play again.
      Dialogue.seen.delete(B.story);
      Dialogue.play(this, B.story);
      if (B.story === 'treeDown') { Dialogue.seen.delete('guideCrack'); Dialogue.play(this, 'guideCrack'); }
      if (B.stag) this.talk.queue = this.talk.queue.map((l) => ({ ...l, text: l.text?.replace('{deaths}', B.deaths).replace('{next}', B.deaths + 1) }));
    } else if (B.hp <= 0) {
      this.bossDefeated(B);
      this.cameras.main.flash(500, 255, 220, 140);
    }
    return false;
  }

  update(_t, ms) {
    const dt = Math.min(ms / 1000, 0.05);
    const raw = this.keys, JD = Phaser.Input.Keyboard.JustDown, p = this.player;
    this.blockedKeys ??= new Map();
    // A held key stays blocked until released; a new press (new timeDown) counts even if
    // the release and press both landed between two frames.
    for (const [key, timeDown] of this.blockedKeys) {
      if (!key.isDown) key._justDown = key._justUp = false;
      if (!key.isDown || key.timeDown !== timeDown) this.blockedKeys.delete(key);
    }
    const k = Object.fromEntries(Object.entries(raw).map(([name, key]) => {
      if (!this.blockedKeys.has(key)) return [name, key];
      return [name, { isDown: false, _justDown: false, _justUp: false }];
    }));
    GameAudio.room(this, dt);
    this.bossPreviousFeet = this.bossFeet;
    this.bossFeet = p.y + p.height / 2;

    if (JD(k.R) && k.SHIFT.isDown) { // Shift+R: retry the room (if you've trapped yourself)
      if (this.boss || this.talk.active || this.transit) return this.scene.restart({ index: this.index, retry: true }); // boss fights rebuild fully
      return this.retryRoom();
    }
    if (DEV && JD(k.N)) return this.scene.restart({ index: this.index + 1 });
    if (DEV && JD(k.ONE)) rules.freeze = !rules.freeze;
    if (DEV && JD(k.TWO)) rules.snap = !rules.snap;
    if (DEV && JD(k.THREE)) rules.max = LIMITS[(LIMITS.indexOf(rules.max) + 1) % LIMITS.length];
    if (DEV && JD(k.FOUR)) rules.selfDestruct = !rules.selfDestruct;
    if (DEV && JD(k.FIVE)) rules.recall = !rules.recall;
    if (JD(raw.ESC)) { // Esc skips a scene; otherwise it opens the system menu
      if (this.talk.active) Dialogue.skip(this);
      else if (!this.transit) { this.scene.launch('menu', { page: 'pause', back: 'room' }); this.scene.pause(); return; }
    }
    if (DEV && JD(k.H)) { showHud = !showHud; this.hud.setVisible(showHud); }

    if (!rules.freeze) this.dropCorpses(dt);
    this.updateEnemies();
    this.updateHazards(dt);
    this.drawFigures(this.time.now / 1000, dt);
    this.updateBoss(dt);
    this.drawBeams();
    if (!this.transit && this.dead <= 0 && !this.talk.line)
      for (const beam of this.aimedBeams) if (beam.room === this.index) this.updateAimedBeam(beam, dt);
    this.drawHazards();
    Art.update(this, this.time.now / 1000);
    this.buildArtSome(4); // the other rooms' walls, a few ms per frame

    const weights = [p, ...this.corpses, ...this.enemies.filter(heavy)].map(bounds);
    for (const pl of this.plates.filter(pl => pl.room === this.index)) {
      const held = weights.some(w => hit(w, bounds(pl)));
      if (held !== !!pl.audioHeld) GameAudio.play(held ? 'hazards-plate-down' : 'hazards-plate-up');
      pl.audioHeld = held;
    }
    for (const d of this.doors) {
      let held = d.plates.some((pl) => weights.some((w) => hit(w, bounds(pl))));
      if (this.rooms[d.room].name === 'Two places' && d.x < this.rooms[d.room].rect.x + 17 * T) held = !held;
      if (d.room === this.index && d.audioHeld !== undefined && d.audioHeld !== held) GameAudio.play(held ? 'hazards-door-opens' : 'hazards-door-closes');
      d.audioHeld = held;
      d.body.enable = !held;
      d.setAlpha(held ? 0.2 : 1);
      d.gate?.setAlpha(held ? 0.2 : 1);
    }

    this.updateHud();
    this.updateKeyPrompt();
    const room = this.rooms[this.index];
    if (!this.boss?.stag) { // the stag frames its whole arena; after the win the camera follows again
      const zoom = room.name === 'Thornwood' && p.x > room.rect.x + 27 * T ? 0.68 : 1, cam = this.cameras.main;
      cam.setZoom(cam.zoom + (zoom - cam.zoom) * Math.min(1, dt * 6)); // eases out to show Thornwood's section C
      if (!this.cameras.main._follow && !this.transit) this.cameras.main.startFollow(p, true, 0.12, 0.12);
    }
    for (const layer of this.art.layers) if (layer.ts.depth === 10)
      layer.ts.setAlpha(room.name === 'The well' ? 0.15 : 1);
    // Look into drops in every tall room, including drops after a shrine.
    this.cameras.main.setFollowOffset(0, this.rooms[this.index].rect.height > this.cameras.main.height ? -this.cameras.main.height * 0.4 : 0);
    if (this.transit) return;
    this.stagWriting.setVisible(this.stagFinished);
    if (this.stagFinished && !this.talk.line && !this.talk.queue.length) {
      const R = this.rooms[this.index];
      if (R.name === 'The old tree' && p.x > R.rect.x + 18 * T && p.x < R.rect.x + 20 * T)
        Dialogue.play(this, 'stagNote');
      if (R.name === 'The pyramid entrance' && Dialogue.seen.has('stagNote') && p.x > R.rect.x + 2 * T) // starts as you arrive; he walks in on his own
        Dialogue.play(this, 'floorOne');
    }
    // Spots: [column, script, after] plays a script once you walk past that column (after another script, if given).
    if (!this.talk.line && !this.talk.queue.length)
      for (const [col, key, after] of this.rooms[this.index].spots ?? [])
        if (p.x > this.rooms[this.index].rect.x + col * T && (!after || Dialogue.seen.has(after)) && Dialogue.play(this, key)) break;
    if (!this.rooms[this.index].rect.contains(p.x, p.y)) {
      const next = this.rooms.findIndex((r) => r.rect.contains(p.x, p.y));
      if (next >= 0) return this.enterRoom(next);
      p.body.reset(this.start.x, this.start.y); // fell out of the world
    }
    const rawSpace = JD(raw.SPACE), rawSwap = JD(raw.E);
    const talkKey = rawSpace | JD(raw.ENTER) | rawSwap;
    const space = k.SPACE === raw.SPACE && rawSpace;
    // A press that advances (or ends) a conversation is only for the conversation: no jump, swap or slide.
    const talking = this.talk.active;
    const jumpDown = !talking && (space | JD(k.W) | JD(k.UP)), swap = !talking && k.E === raw.E && rawSwap;
    const JU = Phaser.Input.Keyboard.JustUp, jumpUp = JU(k.SPACE) | JU(k.W) | JU(k.UP);
    const slideKey = !talking && (JD(k.S) | JD(k.DOWN) | JD(k.SHIFT));
    this.showGuide(dt);
    if (this.dead <= 0 && Dialogue.update(this, dt, talkKey)) return; // the scene owns movement
    if (this.dead > 0) {
      this.dead -= dt;
      p.setVisible(this.dead <= 0);
      p.body.moves = this.dead <= 0;
      if (this.dead <= 0) GameAudio.play('hero-respawn-soul-gathers-back');
      p.body.velocity.x = 0;
      return;
    }
    if (this.boss?.phase === 'tug') { // the tug of war takes over: Space pulls, nothing else moves you
      if (rawSpace) this.tugPresses = (this.tugPresses ?? 0) + 1;
      p.body.velocity.x = 0;
      return;
    }
    if (swap && ((this.rooms[this.index].world ?? 0) >= 3 || this.treePower)) {
      const c = this.corpses.at(-1);
      if (c) {
        const x = p.x, y = p.y, vx = p.body.velocity.x;
        const sink = c.lying ? p.body.bottom - p.y - c.height / 2 : 0; // a flat soul is shorter than you: meet it feet to feet, not inside the floor
        p.body.reset(c.x, c.y - sink); p.body.setVelocity(vx, 0);
        c.setPosition(x, y + sink); c.body.updateFromGameObject(); c.vy = 0;
        c.sprites?.forEach((sp) => sp.setPosition(c.x, c.y + c.height / 2));
        this.swapped = true;
      }
    }
    const pb = bounds(p);
    // Land on an enemy from above to stomp it (it comes back when you re-enter the room); any other touch kills.
    for (const list of [this.enemies, this.flyers]) for (const e of [...list]) {
      if (!hit(pb, bounds(e))) continue;
      if (e.kind === 'i') { if (pb.bottom - bounds(e).y > 6) return this.die(); continue; } // its top is a floor
      if (p.body.velocity.y > 0 && pb.bottom - bounds(e).y < 14) { list.splice(list.indexOf(e), 1); this.downed.push({ sp: e.spawn }); GameAudio.play('walker-crushed'); e.destroy(); p.body.velocity.y = -STOMP_BOUNCE; }
      else return this.die();
    }
    const sawBoxes = this.saws.filter((sw) => sw.room === this.index).map((sw) => new Phaser.Geom.Rectangle(sw.x - SAW_R + 3, sw.y - SAW_R + 3, SAW_R * 2 - 6, SAW_R * 2 - 6));
    const falling = this.droppers.filter((d) => d.room === this.index && d.state !== 'gone').map((d) => bounds(d.r));
    const hazards = [...this.spikes.map(bounds), ...this.shots.map((sh) => sh.hw ? shotBox(sh) : bounds(sh)), ...sawBoxes, ...falling];
    if (hazards.some((h) => hit(pb, h)) || this.laserHit()) {
      const spike = this.spikes.find(h => hit(pb, bounds(h)));
      if (spike) GameAudio.play(spike.audioVine ? 'hazards-vine-wall-touch' : 'hazards-spikes-impale');
      return this.die();
    }
    const world = this.rooms[this.index].world ?? 0;
    GameAudio.loop(this, 'hero-release-wind-up', !this.sdLock && (rules.selfDestruct || world >= 2) && (k.K.isDown || k.X.isDown), 0.5);
    // Self-destruct: hold to charge, let go to cancel. After a death, let go before charging again.
    if (!(k.K.isDown || k.X.isDown)) this.sdLock = false, this.charge = 0;
    else if (!this.sdLock && (rules.selfDestruct || world >= 2) && (this.charge += ms / 1000) >= SD_HOLD) { this.sdLock = true; return this.die(true); }
    // Recall: a tap takes back the newest soul; holding keeps going, faster and faster.
    if ((rules.recall || world >= 2 || stats.mothFinished || this.treePower) && k.Q.isDown) {
      if (JD(k.Q)) { this.recallGap = RECALL_GAP; this.recallT = 0; }
      if ((this.recallT -= ms / 1000) <= 0) { // real time, like the physics (dt is capped)
        const c = this.corpses.pop();
        if (c) { c.destroy(); this.recalled = true; }
        this.recallT = this.recallGap;
        this.recallGap = Math.max(RECALL_MIN, this.recallGap * 0.7);
      }
    }
    if (this.touchBoss()) return;
    this.amulets = this.amulets.filter((a) => {
      if (!hit(bounds(p), bounds(a))) return true;
      GameAudio.play('story-amulet-pickup');
      a.destroy(); // the gold flash comes later, once he puts it on
      Dialogue.play(this, 'amulet');
      return false;
    });
    for (const sh of this.shrines) if ((hit(bounds(p), bounds(sh)) ||
        (world === 3 && Math.abs(p.x - sh.x) < T / 2 && p.y + 15 <= sh.y + 14 && p.y + 15 > sh.y - 4 * T)) && this.start !== sh.spawn) {
      GameAudio.play('story-shrine-activates');
      this.start = sh.spawn;
      this.shrines.forEach((o) => o.rune.setAlpha(o === sh ? 1 : 0.35));
      if (this.rooms[this.index].shrineTalk) Dialogue.play(this, this.rooms[this.index].shrineTalk);
      if (this.rooms[this.index].world) Dialogue.play(this, 'shrineMark'); // the first touch only
    }

    // A pickup, shrine or boss can open dialogue during this frame.
    if (this.talk.active) { Dialogue.update(this, dt, false); return; }
    const b = p.body;
    if (b.velocity.y > MAX_FALL) b.velocity.y = MAX_FALL; // cap falling only (a cap both ways held springs to 7.4 tiles)
    const grounded = b.blocked.down || b.touching.down;
    if (grounded || b.velocity.y >= 0) this.sprung = false;
    if (b.velocity.y >= 0 && this.springs.some((sp) => hit(bounds(p), bounds(sp)))) {
      GameAudio.play('hazards-spring');
      b.velocity.y = -SPRING; this.sprung = true;
      for (const sp of this.springs) if (hit(bounds(p), bounds(sp))) sp.launchArt = this.time.now;
    }
    const dir = (k.D.isDown || k.RIGHT.isDown) - (k.A.isDown || k.LEFT.isDown);
    if (dir && !(this.lying && this.slide > 0)) this.face = dir; // can't turn mid-slide
    if (slideKey && grounded && !this.lying && Math.abs(b.velocity.x) > 100) {
      GameAudio.play('hero-slide');
      this.setLying(true);
      this.slide = SLIDE_TIME;
      this.slideDir = Math.sign(b.velocity.x);
      this.face = this.slideDir; // he faces the way he slides, even if no key is held
    }
    if (this.lying && grounded) {
      this.slide -= dt; // only counts down on the ground, so a dive stays flat until you land
      if (this.slide <= 0 && this.canStand()) this.setLying(false);
    }
    const wall = grounded || this.lying ? 0 : this.wallSide();
    if (wall && dir === wall && b.velocity.y > WALL_SLIDE) b.velocity.y = WALL_SLIDE; // slide down it
    if (wall) { this.wallCoyote = 0.1; this.lastWall = wall; } else this.wallCoyote -= dt;
    if (this.kick > 0) this.kick -= dt; // just kicked off a wall: no steering for a moment
    else if (this.lying && grounded && this.slide > 0) b.velocity.x = this.slideDir * SLIDE_SPEED;
    else if (!grounded && (dir === 0 || (dir === Math.sign(b.velocity.x) && Math.abs(b.velocity.x) > SPEED))) {
      // Airborne and not steering (or steering with momentum already past running speed, e.g. a dive
      // out of a slide): keep the momentum, fading it only by light air drag.
      // Letting go while a spring throws you up stops your drift (as on the ground), so a soul hung beside the spring isn't bumped from below.
      b.velocity.x -= Math.sign(b.velocity.x) * Math.min(Math.abs(b.velocity.x), (this.sprung && !dir ? ACCEL : AIR_DRAG) * dt);
    } else {
      const diff = dir * SPEED - b.velocity.x, step = (grounded ? ACCEL : AIR_ACCEL) * dt;
      b.velocity.x += Math.sign(diff) * Math.min(Math.abs(diff), step);
    }
    this.coyote = grounded ? COYOTE : this.coyote - dt;
    this.buffer = jumpDown ? BUFFER : this.buffer - dt;
    // No dive in a one-tile tunnel: a bonk off its ceiling would float a slide over a spike gap.
    if (this.buffer > 0 && this.coyote > 0 && (!this.lying || this.canStand(T + 8))) { GameAudio.play(this.lying ? 'hero-dive' : 'hero-jump', this.lying ? 0 : 3); b.velocity.y = -JUMP; this.buffer = this.coyote = 0; }
    else if (this.buffer > 0 && this.wallCoyote > 0 && !grounded && this.lastWall !== this.kickSide) { // wall jump
      GameAudio.play('hero-jump', 3);
      b.velocity.y = -WALL_JUMP; b.velocity.x = -this.lastWall * WALL_KICK; this.face = -this.lastWall;
      this.kick = KICK_LOCK; this.kickSide = this.lastWall; this.buffer = this.wallCoyote = 0;
    }
    if (grounded) this.kickSide = 0;
    if (jumpUp && this.kick > 0) b.velocity.x *= 0.5; // a tap: a small kick (the jump-height cut is below)
    if (jumpUp && b.velocity.y < 0 && !this.sprung) b.velocity.y *= 0.5; // short hop on early release
  }

  // Shared by relics and bosses. One shot stops at its first wall, soul or player.
  updateAimedBeam(beam, dt) {
    beam.clock += dt;
    const aim = beam.stag ? 1.4 : 0.6, fire = aim + 0.4, end = fire + 0.18;
    if (beam.clock < aim) beam.angle = Math.atan2(this.player.y - beam.y, this.player.x - beam.x);
    const dx = Math.cos(beam.angle), dy = Math.sin(beam.angle);
    const distance = (r) => {
      let lo = 0, hi = 2000;
      for (const [origin, dir, min, max] of [[beam.x, dx, r.x - 3, r.right + 3], [beam.y, dy, r.y - 3, r.bottom + 3]]) {
        if (Math.abs(dir) < 0.00001) { if (origin < min || origin > max) return Infinity; }
        else { const a = (min - origin) / dir, b = (max - origin) / dir; lo = Math.max(lo, Math.min(a, b)); hi = Math.min(hi, Math.max(a, b)); }
      }
      return lo <= hi ? lo : Infinity;
    };
    let length = 2000, target = null;
    for (const solid of [...this.statics.getChildren().filter((s) => s.body.enable), this.player]) {
      const d = distance(bounds(solid));
      if (d < length) { length = d; target = solid; }
    }
    const firing = beam.clock >= fire && beam.clock < end;
    if (beam.clock < end) {
      this.fx.fillStyle(0x65baff, 0.35).fillCircle(beam.x, beam.y, 22);
      this.fx.lineStyle(firing ? 7 : 1, 0x8edbff, firing ? 1 : beam.clock < aim ? 0.4 : 0.9);
      this.fx.lineBetween(beam.x, beam.y, beam.x + dx * length, beam.y + dy * length);
    }
    if (firing && !beam.fired) {
      beam.fired = true;
      GameAudio.play('stag-beam');
      if (this.corpses.includes(target)) GameAudio.play('hazards-laser-blocked-by-soul');
      if (target === this.player) this.die();
      else if (beam.stag && this.corpses.includes(target)) { GameAudio.play('hero-soul-erased-replaced'); target.buried = 2; target.body.enable = false; target.setAlpha(0.25); }
      else if (this.corpses.includes(target)) { this.corpses.splice(this.corpses.indexOf(target), 1); target.destroy();
        if (this.rooms[this.index].name === 'The rehearsal') Dialogue.play(this, 'breakingBeam');
      }
    }
    if (beam.clock >= (beam.period ?? 4)) { beam.clock = 0; beam.fired = false; }
  }

  // Each beam runs from its emitter to the first solid thing in its way (walls, closed doors, souls).
  beams() {
    const solids = [...this.statics.getChildren().filter((s) => s.body.enable), ...this.enemies.filter(heavy)].map(bounds); // idol and scarab shells block too
    return this.lasers.filter((l) => l.room === this.index).map(({ e, dx, dy }) => {
      const E = bounds(e), cx = E.centerX, cy = E.centerY, w = 6;
      let d = 2000;
      for (const s of solids) {
        if (s.x === E.x && s.y === E.y) continue;
        if (dx && s.y < cy + w / 2 && s.bottom > cy - w / 2) { const g = dx > 0 ? s.x - E.right : E.x - s.right; if (g >= 0) d = Math.min(d, g); }
        if (dy && s.x < cx + w / 2 && s.right > cx - w / 2) { const g = dy > 0 ? s.y - E.bottom : E.y - s.bottom; if (g >= 0) d = Math.min(d, g); }
      }
      return dx ? new Phaser.Geom.Rectangle(dx > 0 ? E.right : E.x - d, cy - w / 2, d, w)
        : new Phaser.Geom.Rectangle(cx - w / 2, dy > 0 ? E.bottom : E.y - d, w, d);
    });
  }

  laserHit() { return this.beams().some((r) => hit(bounds(this.player), r)); }

  drawBeams() {
    const g = this.fx, p = this.player;
    for (const r of this.beams()) {
      g.fillStyle(0xff2d2d, 0.6).fillRect(r.x - 3, r.y - 3, r.width + 6, r.height + 6);
      g.fillStyle(0xffe0e0, 0.95).fillRect(r.x + (r.width > 6 ? 0 : 2), r.y + (r.height > 6 ? 0 : 2), r.width > 6 ? r.width : 2, r.height > 6 ? r.height : 2);
    }
    // Souls left: one flame per soul in this world, lit while it's still available (bottom left).
    const pips = this.pips ??= this.add.graphics().setScrollFactor(0).setDepth(40);
    pips.clear();
    if (this.wearing && !this.hudAmulet)
      pips.lineStyle(2, 0xffd774).strokeCircle(32 + rules.max * 22, 516, 9);
    const icons = this.textures.exists('uiSoulFull') && (this.soulIcons ??= []);
    if (icons) for (let i = 0; i < 3; i++) {
      icons[i] ??= this.add.image(22 + i * 22, 516, 'uiSoulFull').setScrollFactor(0).setDepth(40).setDisplaySize(24, 24);
      icons[i].setVisible(i < rules.max).setTexture(i < rules.max - this.corpses.length ? 'uiSoulFull' : 'uiSoulEmpty').setDisplaySize(24, 24);
    }
    for (let i = 0; !icons && i < rules.max; i++) {
      const free = i < rules.max - this.corpses.length, x = 22 + i * 22, y = 520;
      pips.fillStyle(0x7cc7ff, free ? 0.95 : 0.18).fillTriangle(x - 6, y + 6, x + 6, y + 6, x, y - 10);
      pips.fillStyle(0xeef8ff, free ? 0.9 : 0.1).fillTriangle(x - 3, y + 6, x + 3, y + 6, x, y - 3);
    }
    if (this.charge > 0 && p.visible) { // self-destruct charging: blue-white flames grow around him
      const f = Math.min(1, this.charge / SD_HOLD);
      g.fillStyle(0x7cc7ff, 0.2 + 0.4 * f).fillCircle(p.x, p.y, 8 + 18 * f);
      g.fillStyle(0xeef8ff, 0.3 + 0.5 * f).fillCircle(p.x, p.y, 3 + 8 * f);
    }
  }

  updateHud() {
    const B = this.boss, show = B?.room === this.index && !B.hidden && B.hp > 0 && !this.transit;
    this.bossBar.setVisible(show).setText(show ? '♥'.repeat(B.hp) + '♡'.repeat(BOSS_HP - B.hp) : '');
    const on = (v) => (v ? 'ON' : 'off');
    this.hud.setText([
      `Room ${this.index + 1}/${ROOMS.length} — ${this.rooms[this.index].name}`,
      'Move A/D or ←/→ · Jump Space · Slide Shift/S/↓ while running · Self-destruct hold K · Recall Q · Swap E · Retry room Shift+R · Next room N (dev) · Hide H',
      `[1] bodies float: ${on(rules.freeze)}   [2] grid snap: ${on(rules.snap)}   ` +
      `[3] max bodies: ${rules.max || '∞'}   [4] self-destruct: ${on(rules.selfDestruct)}   [5] recall: ${on(rules.recall)}   · bodies: ${this.corpses.length}`,
      this.boss?.room === this.index ? `Boss ${'■'.repeat(this.boss.hp)}${'□'.repeat(BOSS_HP - this.boss.hp)}` : '',
    ]);
  }
}

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 960,
  height: 544,
  backgroundColor: '#1f1f24',
  physics: { default: 'arcade', arcade: { gravity: { y: GRAVITY } } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [Loading, Warning, Title, Room, Menu, End],
});
