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
const RUN_FRAMES = [6, 7, 8, 9, 10], RUN_STEP = 15; // 11 dropped: it repeats 6
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
const MOTH_FRAMES = [0, 1, 2, 1], MOTH_FPS = 8, MOTH_SCALE = 0.243 * MOTH_SIZE; // frames are full size (700 px tall); frame 2 reused for 4 so the loop can't shimmer
// Its intro: it bursts out of the right wall at these rows (top, bottom) of its room. The hole is only
// painted; the wall keeps its colliders, so the arena stays closed.
const MOTH_HOLE = [2, 9];
// Self-destruct (World 2 on): hold K/X this long. You keep moving while it charges; letting go cancels.
const SD_HOLD = 0.75;
// Recall (World 3): Q takes back your newest soul. Holding keeps going, each gap shorter, down to RECALL_MIN.
const RECALL_GAP = 0.35, RECALL_MIN = 0.08;
// Wall jump: slide down a wall (or a soul) while pushing into it, jump to kick off. Hold jump for the full
// kick; let go early and both the height and the push away are cut short. You can't kick off the same
// side twice in a row (touch the ground or the other wall first), so one wall can't be climbed.
const WALL_SLIDE = 110, WALL_KICK = 170, WALL_JUMP = 420, KICK_LOCK = 0.3;
// Hazards and enemies
const SAW_SPEED = 90, SAW_R = 13;               // saws run along a row or column; a soul in the way jams them
const CRUMBLE_TIME = 0.45, CRUMBLE_BACK = 2.5;  // crumbling blocks break this long after you land, return later
const FLYER_SPEED = 80, SHOT_SPEED = 200, THROW_EVERY = 1.8, STOMP_BOUNCE = 420;
const SPRING = 873; // launch speed: 8.5 tiles high (a 9-high ledge needs a soul)

// Mechanic rules (persist across rooms)
const rules = {
  freeze: true,       // [1] body floats where you died (off = falls with gravity)
  snap: true,         // [2] body snaps to the tile grid
  max: 3,             // [3] oldest vanishes past this; 0 = unlimited
  selfDestruct: false, // [4] hold K/X to die anywhere, in any world (always on from World 2)
  recall: false,       // [5] Q recalls souls, in any world (always on in World 3)
};
const LIMITS = [1, 2, 3, 5, 0];
let showHud = false; // test HUD and rule switches; H toggles
const DEV = new URLSearchParams(location.search).has('dev'); // ?dev turns on the dev keys: N next room, H help panel, 1-5 rules

// '#' wall  '^' spikes  P start  '_' plate  D door (open while any plate is held)
// e walker enemy  B boss  V vines (open when the room's boss is beaten)  x thorns (kill on touch, not solid)
// A the amulet  C shrine (touch: respawn here)
// > < v u laser emitter firing right/left/down/up (the beam kills; walls, doors and souls stop it)  s spring
// o saw moving sideways  O saw moving up/down  ~ crumbling block  ! falling spike (drops when you pass under)
// f flyer (flies over souls)  t thrower (shoots at you; souls block the shots). Stomp any enemy to kill it.
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
    '#               x#############',
    '#               x#############',
    '                x#############',
    '                x#############',
    '  P             x#############',
    '##############################',
  ], [60, 100], { world: 1, enter: 'thorns' }],
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
    '#                     x#######',
    '#                     x#######',
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
  ], [150, 94], { world: 1 }],
  ["The well", [ // aim your fall: the soul must land near the exit side
    '##############################',
    '######      ##################',
    '######      ##################',
    '######      ##################',
    '######      ##################',
    '######      ##################',
    '######      ##################',
    '######      ##################',
    '            ##################',
    ' P          ##################',
    '######      ##################',
    '######      ##################',
    '######      ##################',
    '######      ##################',
    '######      ##################',
    '######      ##################',
    '######      ##################',
    '######                  ######',
    '######        C         ######',
    '######       ###       x######',
    '######       ###       x######',
    '######       ###       x######',
    '######^^^^^^^###       x######',
    '################       x######',
    '################       x######',
    '################       x######',
    '################       x######',
    '################              ',
    '################              ',
    '################         #####',
    '################         #####',
    '################^^^^^^^^^#####',
    '##############################',
  ], [180, 94], { world: 1 }],
  ["The gatehouse", [ // get killed on the plate so the walker ends up on the right side
    '##############################',
    '#            #               #',
    '#            #               #',
    '#            #               #',
    '#            #               #',
    '#            #               #',
    '#            #               #',
    '#            #               #',
    '#            #               #',
    '#            #               #',
    '#            #               #',
    '#            #               #',
    '#            #               #',
    '             D               #',
    ' P           D                ',
    '###    _   e D C              ',
    '#################^^^^^^^^#####',
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
    '############   x####^^^^^^^####   ############',
    '############   x###############   ############',
    '############   x###############   ############',
    '############   x###############   ############',
    '############   x###############   ############',
    '############   ################   ############',
    '############   ################   ############',
    '############   ################      ######   ',
    '#          #   ################      ######   ',
    '#          #   ################      ######  #',
    '#              ################      ######  #',
    '               ################              #',
    ' P      e      ################   e #   o    #',
    '##############################################',
    '##############################################',
  ], [240, 101], { world: 1 }],
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
    '                             V',
    ' P             B             V',
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
  ], [316, 104], { world: 2 }],
  ["Off the edge", [ // jump off the edge holding K: the soul appears mid-pit
    '##############################',
    '#                         D  #',
    '#                         D  #',
    '#                         D  #',
    '#                         D  #',
    '#                         D  #',
    '                          D   ',
    ' P           C  _         D   ',
    '####       #######       #####',
    '####       #######       #####',
    '####       #######       #####',
    '####       #######       #####',
    '####       #######       #####',
    '####       #######       #####',
    '####       #######       #####',
    '####^^^^^^^#######^^^^^^^#####',
    '##############################',
  ], [346, 107], { world: 2 }],
  ["The ladder", [ // 7-high ledge: stack to 3, then run off your top soul holding K for a step beside it
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                             ',
    '#                             ',
    '#                    #########',
    '#                    #########',
    '#                    #########',
    '#                    #########',
    '#                    #########',
    '                     #########',
    ' P                   #########',
    '##############################',
  ], [376, 99], { world: 2 }],
  ["The beam", [ // 8-high ledge: jump into the laser right next to its source; that death is the high step and leaves no beam
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                             ',
    '#                             ',
    '#                        #####',
    '#                        #####',
    '#                        #####',
    '#                        <####',
    '#                        #####',
    '#                        #####',
    '                         #####',
    ' P                       #####',
    '##############################',
  ], [406, 92], { world: 2 }],
  ["The spring", [ // 9-high ledge: hold during the launch so a soul hangs beside the spring, then land on it
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                             ',
    '#                             ',
    '#                     ########',
    '#                     ########',
    '#                     ########',
    '#                     ########',
    '#                     ########',
    '#                     ########',
    '#                     ########',
    '                      ########',
    ' P               s    ########',
    '##############################',
  ], [436, 84], { world: 2 }],
  ["Wrong order", [ // step, plate, pit: in another order a soul you still need vanishes
    '##############################',
    '#                        #   #',
    '#                        #   #',
    '#                        #   #',
    '#                        #   #',
    '#                        #   #',
    '#                        #   #',
    '#                        #   #',
    '#                        #   #',
    '#                        #   #',
    '#                        #   #',
    '# _                      #   #',
    '#####                    #   #',
    '#                        D    ',
    '                         D    ',
    ' P                       D    ',
    '###########^^^^^^^^###########',
  ], [466, 75], { world: 2 }],
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
    '#               __           t D C #########',
    '#           C  ####~~~~~~~######   #########',
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
  ], [496, 71], { world: 2 }],
  // ---------------- World 3: Sanctum (greybox) ----------------
  ["Three high", [ // 8-high ledge: a 3-soul staircase (run off your top soul while holding K)
    '##############################',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                            #',
    '#                             ',
    '#                             ',
    '#                    #########',
    '#                    #########',
    '#                    #########',
    '#                    #########',
    '#                    #########',
    '                     #########',
    '                     #########',
    ' P                   #########',
    '##############################',
  ], [540, 75], { world: 3 }],
  ["In my own way", [ // two lying souls bridge the tunnel pit; recall (Q) a standing one that blocks it
    '##############################',
    '###########################  #',
    '###########################  #',
    '###########################  #',
    '###########################  #',
    '###########################  #',
    '###########################  #',
    '###########################  #',
    '    #######################   ',
    ' P                            ',
    '##########^^^^^###############',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
    '##############################',
  ], [570, 73], { world: 3 }],
  ["Three jobs", [ // plate, pit and a laser blocker at once; recall mistakes instead of dying over them
    '##############################',
    '#                 ####### #  #',
    '#                 ####### #  #',
    '#                 ####### #  #',
    '#                 ####### #  #',
    '#                 ####### #  #',
    '#                 ####### #  #',
    '#                 ####### #  #',
    '#                 ####### #  #',
    '#                 ####### #  #',
    '#                 ####### #  #',
    '#                 ####### #  #',
    '#                 ###v### #  #',
    '#                         D  #',
    '                          D   ',
    ' P   _                    D   ',
    '#########^^^^^^^^#############',
  ], [600, 67], { world: 3 }],
  ["Everything", [ // tunnel, plate with a walker, spring; one spare death before the plate soul goes (recall instead)
    '#############################################',
    '###############               #             #',
    '###############               #             #',
    '###############               #             #',
    '###############               #             #',
    '###############               #             #',
    '###############               #             #',
    '###############               #             #',
    '###############               #             #',
    '###############               #              ',
    '###############               #              ',
    '###############               #        ######',
    '###############               #        ######',
    '###############               #        ######',
    '###############               #        ######',
    '###############               #        ######',
    '###############               #        ######',
    '###############               D        ######',
    '   ############ C             D        ######',
    ' P             ##     _   e   D     s  ######',
    '#######^^^###################################',
    '#############################################',
  ], [630, 63], { world: 3 }],
  ["Reliquary", [ // SHOWCASE W3: flyers in a chimney, two saws to jam, plate, recall, crumbling descent
    '########################################',
    '########################################',
    '########################################',
    '#####                         D   ! !  #',
    '#####    C #   o   #   o    #_D C      #',
    '#####   ####################### #      #',
    '#####   #######################        #',
    '#####  f#######################        #',
    '#####   #######################  ~     #',
    '#####   #######################        #',
    '#####   #######################        #',
    '#####  ########################    ~   #',
    '#####   #######################        #',
    '#####f  #######################        #',
    '#####   #######################      ~ #',
    '#####   #######################        #',
    '#####   #######################        #',
    '######  #######################    ~   #',
    '#####   #######################        #',
    '#       #######################        #',
    '        #######################         ',
    ' P      #######################         ',
    '################################^^^^^^##',
    '########################################',
  ], [675, 52], { world: 3 }],
  ["End of the greybox", [ // bosses for Worlds 2 and 3 and the beam rehearsal are not built yet
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
    '              P              #',
    '##############################',
    '##############################',
  ], [715, 59]],
];
const WORLD_NAMES = { 1: 'Forest Edge', 2: 'Overgrown Ruins', 3: 'Sanctum' }; // fades in when you enter a new world
const WORLD_SOULS = { 1: 1, 2: 2, 3: 3 }; // souls allowed per world; rooms without a world keep 3
// ?dev&room=Name (or a number) starts there, for playtesting
const START_ROOM = ((q) => q == null ? ROOMS.findIndex((r) => r[0] === 'The clearing')
  : isNaN(q) ? ROOMS.findIndex((r) => r[0] === q) : +q)(DEV ? new URLSearchParams(location.search).get('room') : null);

// Overlap that ignores shared edges (standing next to something isn't touching it).
const hit = (A, B) => A.x < B.right && A.right > B.x && A.y < B.bottom && A.bottom > B.y;
const bounds = (o) => o.getBounds();

const stats = { deaths: 0 }; // the whole run's deaths, shown on the ending card
const FONT = { fontFamily: 'Georgia, serif', align: 'center' };

// First screen: the content warning. Any key or click continues (that click also lets the browser play audio).
class Warning extends Phaser.Scene {
  constructor() { super('warning'); }
  create() {
    if (window.SKIP_WARNING) return this.scene.start('room'); // the test page
    const t = (y, text, size, color, wrap = 640) =>
      this.add.text(480, y, text, { ...FONT, fontSize: size, color, wordWrap: { width: wrap }, lineSpacing: 6 }).setOrigin(0.5);
    t(150, 'Content warning', '30px', '#f1e3b8');
    t(250, 'This game shows a character dying many times, sometimes by his own choice, and deals with grief and self-sacrifice. ' +
      'Death is a puzzle mechanic here and is shown without gore.', '19px', '#dfe8e2');
    t(345, "If you're going through a hard time, please reach out to someone you trust or a local support line.", '16px', '#a8b8ad');
    const go = t(440, 'Click or press any key to continue', '15px', '#e8b44a');
    this.tweens.add({ targets: go, alpha: 0.35, duration: 900, yoyo: true, repeat: -1 });
    const next = () => this.scene.start('room');
    this.input.keyboard.once('keydown', next);
    this.input.once('pointerdown', next);
  }
}

// The last screen, after he walks into the pyramid: "Floor 1", the title, the run's deaths, thanks and credits.
class End extends Phaser.Scene {
  constructor() { super('end'); }
  create() {
    const t = (y, text, size, color, at) => {
      const o = this.add.text(480, y, text, { ...FONT, fontSize: size, color }).setOrigin(0.5).setAlpha(0);
      this.tweens.add({ targets: o, alpha: 1, duration: 1200, delay: at });
      return o;
    };
    const floor = t(272, 'Floor 1', '44px', '#f1e3b8', 600);
    this.tweens.add({ targets: floor, alpha: 0, duration: 1200, delay: 4200 });
    t(170, 'Reincarnation Echo', '46px', '#f1e3b8', 6000);
    t(245, `Deaths: ${stats.deaths}`, '22px', '#cfeaff', 7400);
    t(280, 'Keep getting back up.', '16px', '#9fb8c8', 8400);
    t(350, 'Thank you for playing.', '20px', '#dfe8e2', 9600);
    t(400, 'A game by Michael Chuang · Made for Game Week', '14px', '#a8b8ad', 10400);
    t(422, 'Art, music and sound made with generative AI tools', '13px', '#7f9086', 10400);
    const again = t(490, 'Press any key to play again', '14px', '#e8b44a', 12000);
    this.time.delayedCall(12000, () => this.input.keyboard.once('keydown', () => {
      stats.deaths = 0;
      Dialogue.seen.clear();
      NAMES.guide = '???';
      this.scene.start('room', { index: START_ROOM });
    }));
    again.setDepth(1);
  }
}

class Room extends Phaser.Scene {
  constructor() { super('room'); }

  init(data) { this.index = Phaser.Math.Wrap(data.index ?? START_ROOM, 0, ROOMS.length); }

  preload() {
    Art.preload(this);
    Dialogue.preload(this);
    if (!this.textures.exists('heroSheet')) {
      this.load.image('heroSheet', 'assets/hero/sheet.webp'); // 8 frames: run 0-5, jump 6, fall 7
      this.load.image('heroIdle', 'assets/hero/idle.webp');
      this.load.image('heroRun', 'assets/hero/run.webp'); // 12 run frames: top row 0-5, bottom row 6-11
      this.load.image('heroSlide', 'assets/hero/slide.webp'); // 12 slide frames, 3 rows of 4
      this.load.json('heroSlideMeta', 'assets/hero/slide.json');  // each frame's head and feet x
    }
    if (!this.textures.exists('walker')) this.load.image('walker', 'assets/enemies/walker.webp');
    if (!this.textures.exists('mothFly')) this.load.image('mothFly', 'assets/bosses/moth-fly.webp');
    if (!this.textures.exists('rocks')) this.load.image('rocks', 'assets/world1/rocks.webp'); // 6 earth chunks
    if (!this.textures.exists('wallBreak')) this.load.image('wallBreak', 'assets/world1/wall-break.webp');
  }

  create() {
    this.statics = this.physics.add.staticGroup(); // walls, spike bases, doors, bodies
    this.corpses = [];
    this.doors = [];
    this.plates = [];
    this.spikes = [];
    this.enemies = []; // only the current room's walkers exist (Celeste-style)
    this.walkerSpawns = [];
    this.bosses = []; // one per boss room; this.boss is the current room's
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
    this.amulets = [];
    this.shrines = [];
    this.lasers = [];
    this.springs = [];
    this.saws = [];
    this.crumbles = [];
    this.droppers = [];
    this.shots = [];
    this.charge = 0;
    this.rooms = ROOMS.map(([name, raw, pos, extra = {}], ri) => {
      const [ox, oy] = pos ?? [ri * 31, 0];
      const width = Math.max(30, ...raw.map((r) => r.length));
      const rows = raw.map((r) => r.padEnd(width, '#'));
      while (rows.length < 17) rows.push('#'.repeat(width));
      const room = { name, ...extra, rect: new Phaser.Geom.Rectangle(ox * T, oy * T, width * T, rows.length * T), spawns: [] };
      rows.forEach((row, ty) => {
        for (let tx = 0; tx < row.length; tx++) {
          const x = (ox + tx) * T, y = (oy + ty) * T;
          switch (row[tx]) {
            case '#': { // merge horizontal runs so the player doesn't snag on seams
              let w = 1;
              while (row[tx + w] === '#') w++;
              this.statics.add(rect(x, y, w * T, T, 0).setVisible(false)); // hitbox; painted below
              Art.platform(this, x, y, w * T, T, Array.from({ length: w }, (_, i) => !'#^'.includes(rows[ty - 1]?.[tx + i] ?? '#')));
              tx += w - 1;
              break;
            }
            case '^': // solid lower half, deadly upper half
              this.statics.add(rect(x, y + 16, T, 16, 0).setVisible(false));
              Art.platform(this, x, y + 16, T, 16, [false]);
              this.spikes.push(rect(x + 2, y + 6, T - 4, 10, 0xcd5c5c));
              break;
            case 'x': this.spikes.push(rect(x + 4, y + 2, T - 8, T - 4, 0x7a3550)); break;
            case '_': this.plates.push(Object.assign(rect(x + 1, y + T - 8, T - 2, 8, 0xffd700).setStrokeStyle(2, 0x8a6a00).setDepth(3), { room: ri })); break;
            case 'D': { const d = Object.assign(rect(x, y, T, T, 0x8c6640), { room: ri }); this.statics.add(d); this.doors.push(d); break; }
            case 'e': case 'f': case 't': this.walkerSpawns.push({ x, y, room: ri, kind: row[tx] }); break; // made on entry
            case 'o': case 'O': this.saws.push({ room: ri, x: x + T / 2, y: y + T / 2, dx: row[tx] === 'o' ? 1 : 0, dy: row[tx] === 'O' ? 1 : 0, dir: 1 }); break;
            case '~': { const c = rect(x, y, T, T, 0x9a7a52).setStrokeStyle(3, 0x3a2614).setDepth(2); this.statics.add(c); this.crumbles.push(Object.assign(c, { room: ri, t: 0, back: 0 })); break; }
            case '!': this.droppers.push({ room: ri, x0: x + T / 2, y0: y + 12, r: rect(x + 7, y, T - 14, 24, 0xe0484a).setStrokeStyle(2, 0x6a1010).setDepth(3) }); break;
            case 'B': // floats with its underside 2.5 tiles above this tile's floor
              this.bosses.push({ hp: BOSS_HP, hurt: 0, dir: 1, room: ri, min: ox * T + T + BOSS_W / 2, max: (ox + width) * T - T - BOSS_W / 2,
                r: rect(x + T / 2 - BOSS_W / 2, y + T - 128, BOSS_W, BOSS_H, 0x9b59b6),
                hidden: !!extra.spots?.some((sp) => sp[1] === 'moth') && !Dialogue.seen.has('moth'), // bursts in during its intro
                story: extra.spots?.some((sp) => sp[1] === 'moth') ? 'mothDown' : null });
              this.bosses.at(-1).r.setVisible(!this.bosses.at(-1).hidden);
              if (this.textures.exists('mothFly')) {
                const B = this.bosses.at(-1), tex = this.textures.get('mothFly'), fw = tex.getSourceImage().width / 4;
                if (!tex.has(0)) for (let i = 0; i < 4; i++) tex.add(i, 0, i * fw, 0, fw, tex.getSourceImage().height);
                B.r.setFillStyle(0, 0); // hitbox only
                B.img = this.add.image(B.r.x, B.r.y, 'mothFly', 0).setScale(MOTH_SCALE).setDepth(4);
                B.r.on('destroy', () => B.img.destroy());
              }
              break;
            case 'V': this.gates.push(Object.assign(rect(x, y, T, T, 0x4a6b3a), { room: ri })); this.statics.add(this.gates.at(-1)); break;
            case '>': case '<': case 'v': case 'u': { // laser emitter: a solid block that fires a beam
              const e = rect(x, y, T, T, 0x5a4a6a);
              this.statics.add(e);
              this.lasers.push({ e, room: ri, dx: { '>': 1, '<': -1 }[row[tx]] ?? 0, dy: { v: 1, u: -1 }[row[tx]] ?? 0 });
              break;
            }
            case 's': this.springs.push(rect(x + 3, y + T - 12, T - 6, 12, 0xffc93c).setStrokeStyle(2, 0x7a5200).setDepth(3)); break;
            case 'P': room.spawns.push({ x: x + T / 2, y: y + T - 15 }); break;
            case 'A': this.amulets.push(this.add.circle(x + T / 2, y + T - 10, 6, 0xffd774).setStrokeStyle(2, 0xb07a22).setDepth(3)); break;
            case 'C': { // shrine: a mossy stone with a gold rune; touching it moves your respawn here
              const sh = this.add.rectangle(x + T / 2, y + T - 14, 16, 28, 0x56605a).setStrokeStyle(1, 0x2b322e).setDepth(3);
              sh.rune = this.add.circle(x + T / 2, y + T - 18, 3, 0xe8b44a).setAlpha(0.35).setDepth(3);
              sh.spawn = { x: x + T / 2, y: y + T - 15 };
              this.shrines.push(sh);
              break;
            }
          }
        }
      });
      return room;
    });
    // Fill a screen's height of solid ground above and below every room (stopping at any other room),
    // so the camera's diagonal slide between rooms at different heights never shows empty space.
    for (const { rect: R } of this.rooms) {
      const others = this.rooms.map((r) => r.rect).filter((O) => O !== R && O.x < R.right && O.right > R.x);
      const top = Math.max(R.y - 544, ...others.filter((O) => O.bottom <= R.y).map((O) => O.bottom));
      const bottom = Math.min(R.bottom + 544, ...others.filter((O) => O.y >= R.bottom).map((O) => O.y));
      if (top < R.y) Art.platform(this, R.x, top, R.width, R.y - top, []);
      if (bottom > R.bottom) Art.platform(this, R.x, R.bottom, R.width, bottom - R.bottom, []);
    }
    this.start = this.rooms[this.index].spawns[0];
    this.boss = this.bosses.find((b) => b.room === this.index) ?? null;
    this.bosses.filter((b) => b.story === 'mothDown' && !b.hidden).forEach((b) => this.breakWall(b)); // already broken on replays
    rules.max = WORLD_SOULS[this.rooms[this.index].world] ?? 3;
    Dialogue.create(this);
    this.wearing = Dialogue.seen.has('amulet');
    this.roomDeaths = 0;
    this.showWorld(this.rooms[this.index].world);
    Dialogue.play(this, this.rooms[this.index].enter);

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
    // The guide: the hero's own painting as a see-through, flameless blue-white ghost (a plain shape
    // without the art). He appears in the amulet cutscene, then only for conversations he's in.
    if (!this.painted && !this.textures.exists('guideStandIn'))
      this.make.graphics({ add: false }).fillStyle(0xffffff).fillRoundedRect(0, 0, 22, 40, 10).generateTexture('guideStandIn', 22, 40).destroy();
    this.guide = this.add.image(this.start.x + 60, this.start.y, this.painted ? 'heroIdle' : 'guideStandIn').setOrigin(0.5, 1)
      .setScale(this.painted ? this.heroScale : 1).setTint(0xcfeaff).setBlendMode(Phaser.BlendModes.ADD).setDepth(4.4).setAlpha(0);
    this.guide.on = Dialogue.seen.has('amulet');
    this.guide.hoverY = this.guide.y;
    this.guide.away = 0;
    this.physics.add.existing(this.player);
    this.player.body.maxVelocity.set(10000, 10000); // fall speed is capped in update(), so springs aren't
    // Arcade resolves vertical overlap first, so jumping while pressed into a wall snags on the
    // seam between stacked blocks and kills the jump. Side contacts get pushed out sideways instead.
    this.physics.add.collider(this.player, this.statics, null, (_pl, s) => {
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

    this.keys = this.input.keyboard.addKeys('A,D,LEFT,RIGHT,SPACE,W,UP,K,X,Q,R,N,S,DOWN,SHIFT,ENTER,E,ESC,H,ONE,TWO,THREE,FOUR,FIVE');
    this.hud = this.add.text(8, 4, '', { fontFamily: 'monospace', fontSize: '13px', color: '#ddd', lineSpacing: 3, backgroundColor: '#000000aa', padding: { x: 6, y: 4 } }).setDepth(30).setScrollFactor(0).setVisible(showHud);
    const cam = this.cameras.main, R = this.rooms[this.index].rect;
    cam.setBounds(R.x, R.y, R.width, R.height);
    cam.startFollow(this.player, true, 0.12, 0.12);
    cam.centerOn(this.player.x, this.player.y);
    this.transit = false;
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
        this.flyers.push(Object.assign(f, { dir: -1, baseY: y + 16, kind, spawn: sp }));
        return;
      }
      const e = kind === 't' ? rect(x + 4, y + T - 28, 24, 28, 0xe08a3c) : rect(x + 4, y + T - 24, 24, 24, 0xd0543c);
      e.kind = kind;
      e.spawn = sp;
      if (kind === 't') e.cool = THROW_EVERY;
      this.physics.add.existing(e);
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

  // The world's name fades in when you arrive in a new world.
  showWorld(w) {
    this.world = w;
    if (!WORLD_NAMES[w]) return;
    const t = this.add.text(480, 200, WORLD_NAMES[w], { fontFamily: 'Georgia, serif', fontSize: '42px', color: '#f1e3b8' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(45).setAlpha(0).setShadow(0, 2, '#000', 8);
    this.tweens.add({ targets: t, alpha: 1, duration: 900, hold: 1600, yoyo: true, onComplete: () => t.destroy() });
  }

  bossDefeated(B) {
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
      g.setAlpha(Math.min(0.7, g.alpha + dt * 1.2));
      g.away = 0;
      if (!g.looking) g.setFlipX(g.x > p.x);
    } else if (g.alpha > 0 && (g.away += dt) > 0.6) g.setAlpha(Math.max(0, g.alpha - dt * 0.9)); // lingers, then fades
    g.y = g.hoverY + Math.sin(this.time.now / 600) * 3;
  }

  // Staging cues fired by dialogue lines (see `cue` in dialogue.js).
  cue(name) {
    const g = this.guide, p = this.player;
    if (name === 'wear') this.wearing = true;
    if (name === 'flash') this.cameras.main.flash(600, 255, 215, 120);
    if (name === 'theEnd') { // he walks into the pyramid: fade out to the ending card
      this.cameras.main.fadeOut(1500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('end'));
    }
    if (name === 'dim' || name === 'undim') { // night falls / morning comes (under the dialogue panel)
      this.dimmer ??= this.add.rectangle(480, 272, 960, 544, 0x020610).setScrollFactor(0).setDepth(39).setAlpha(0);
      this.tweens.killTweensOf(this.dimmer);
      this.tweens.add({ targets: this.dimmer, alpha: name === 'dim' ? 0.88 : 0, duration: 1100 });
      this.guide.setDepth(name === 'dim' ? 39.5 : 4.4); // the ghost still glows in the dark
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
      B.r.setFillStyle(0xffffff);
      this.tweens.add({ targets: B.r, alpha: 0.4, duration: 220, yoyo: true, repeat: 4 });
    }
    if (name === 'absorb' && B) { // dissolves into motes that stream into the hero, who flashes white
      if (!this.textures.exists('spark'))
        this.make.graphics({ add: false }).fillStyle(0xffffff).fillCircle(3, 3, 3).generateTexture('spark', 6, 6).destroy();
      const em = this.add.particles(B.r.x, B.r.y, 'spark', {
        x: { min: -48, max: 48 }, y: { min: -24, max: 24 }, moveToX: p.x, moveToY: p.y, lifespan: 900,
        scale: { start: 1.2, end: 0.4 }, tint: [0xffffff, 0xcfeaff], blendMode: 'ADD', emitting: false,
      }).setDepth(6);
      em.explode(60);
      this.time.delayedCall(1200, () => em.destroy());
      this.time.delayedCall(850, () => this.cameras.main.flash(350, 255, 255, 255));
      this.bossDefeated(B);
    }
    if (name === 'lookaround' && g) { // surveys the clearing, then settles on the hero
      g.looking = true;
      [0, 500, 1000].forEach((ms, i) => this.time.delayedCall(ms, () => g.setFlipX(i % 2 === 0 ? false : true)));
      this.time.delayedCall(1600, () => { g.looking = false; });
    }
    if (name === 'shake') this.cameras.main.shake(1400, 0.006);
    if (name === 'moth' && this.boss?.hidden) { // bursts out of the wall, flies to its patrol spot, screams
      const B = this.boss, { x, y } = B.r, h = this.breakWall(B, true);
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
    B.pose = 0;
    this.time.delayedCall(150, () => { B.pose = 1; this.cameras.main.shake(500, 0.008); });
    for (let i = 0; i < 6; i++) this.time.delayedCall(150 + i * 160, () => {
      for (const [w, col, a] of [[10, 0x2a2018, 0.35], [4, 0xffffff, 0.95]]) { // pale wave with a dark halo, readable on any backdrop
        const ring = this.add.circle(B.r.x, B.r.y, 50).setStrokeStyle(w, col, a).setDepth(5.9);
        this.tweens.add({ targets: ring, radius: 420, duration: 900, ease: 'Cubic.easeOut', onComplete: () => ring.destroy() });
        this.tweens.add({ targets: ring, alpha: 0, duration: 900, ease: 'Quad.easeIn' }); // stays bright most of the way out
      }
    });
    this.time.delayedCall(1150, () => { B.pose = null; done?.(); });
  }

  enterRoom(i) {
    const p = this.player, R = this.rooms[i].rect, cam = this.cameras.main;
    this.index = i;
    rules.max = WORLD_SOULS[this.rooms[i].world] ?? rules.max;
    Dialogue.play(this, this.rooms[i].enter);
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

  die() {
    if (this.dead > 0) return;
    stats.deaths++;
    const p = this.player;
    const [w, h] = this.lying ? BODY_LYING : BODY_STAND;
    // Snap: standing bodies fill one tile, lying bodies span the two tiles nearest you.
    const x = !rules.snap ? p.x : this.lying ? Math.round(p.x / T) * T : Math.floor(p.x / T) * T + T / 2;
    // Snap: standing souls sit on a tile line, lying souls on a half-tile line (a spike death leaves
    // a lying soul flush with the floor, a standing one as a step one tile up).
    const feet = p.y + p.height / 2;
    const bottom = !rules.snap ? feet : this.lying ? Math.ceil((feet - 1) / 16) * 16 : Math.round(feet / T) * T;
    const c = this.add.rectangle(x, bottom - h / 2, w, h, 0x7399d9);
    c.vy = 0;
    c.lying = this.lying;
    c.dir = this.face;
    c.setFillStyle(0x7399d9, 0.12); // faint hitbox; the soul figure is drawn in drawFigures()
    if (this.painted && (!this.lying || this.hasSlide)) {
      // A soul is the hero's painting, frozen in the pose he died in, glowing blue-white.
      const [key, frame] = this.lying ? ['heroSlide', SLIDE_FRAMES[0]] : this.heroFrame; // pose may not be drawn yet
      const feet = c.y + c.height / 2, flip = this.face < 0;
      const body = this.add.image(c.x, feet, key, frame).setOrigin(0.5, 1).setScale(this.heroScale).setFlipX(flip)
        .setTintFill(0x6fb6ee).setAlpha(0.45).setDepth(4.5);
      const glow = this.add.image(c.x, feet, key, frame).setOrigin(0.5, 1).setScale(this.heroScale).setFlipX(flip)
        .setTint(0xbfe6ff).setBlendMode(Phaser.BlendModes.ADD).setAlpha(0.9).setDepth(4.6);
      c.sprites = [body, glow];
      c.on('destroy', () => c.sprites.forEach((sp) => sp.destroy()));
    }
    this.statics.add(c);
    this.corpses.push(c);
    if (rules.max && this.corpses.length > rules.max) this.corpses.shift().destroy();

    this.charge = 0;
    this.droppers.forEach((d) => this.resetDropper(d));
    this.downed.forEach((d) => this.spawnEnemy(d.sp)); // dying brings stomped enemies back
    this.downed = [];
    // Respawn on top of any bodies sitting on the start point.
    this.setLying(false);
    let y = this.start.y;
    for (const b of [...this.corpses].sort((a, b) => b.y - a.y))
      if (Math.abs(b.x - this.start.x) < b.width / 2 + 12 && b.y - b.height / 2 < y + 15) y = b.y - b.height / 2 - 15;
    p.body.reset(this.start.x, y);
    p.setVisible(false);
    this.dead = RESPAWN_DELAY;
    if (this.boss) { this.boss.hp = BOSS_HP; this.boss.hurt = 0; } // your death heals the boss
    if (this.rooms[this.index].world) Dialogue.play(this, 'firstDeath'); // only the first time
    const hint = this.rooms[this.index].deathTalk?.[++this.roomDeaths]; // hints after repeated deaths in a room
    if (hint) Dialogue.play(this, hint);
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
        if (bottom <= bounds(e).y + 2 && hit(next, bounds(e))) { e.destroy(); this.enemies.splice(this.enemies.indexOf(e), 1); }
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

  canStand() {
    const p = this.player, feet = p.y + p.height / 2;
    const r = new Phaser.Geom.Rectangle(p.x - STAND[0] / 2, feet - STAND[1], STAND[0], STAND[1]);
    return !this.statics.getChildren().some((s) => s.body.enable && hit(r, bounds(s)));
  }

  // Bodies and the player are drawn as figures; their rectangles are only hitboxes.
  // The hero is a hooded explorer (cloak, scarf, satchel) lit from the upper left. A soul is the
  // same figure in blue flame; a lying soul is him mid-dive, with a flame trail filling its hitbox.
  drawFigures(t, dt) {
    const g = this.fx, b = this.player.body, p = this.player;
    g.clear();
    for (const c of this.corpses) {
      if (c.sprites) this.soulFlames(g, c, t);
      else this.figure(g, c, { lying: c.lying, dir: c.dir, t, soul: true });
    }
    const grounded = b.blocked.down || b.touching.down;
    this.walk = (this.walk || 0) + (grounded ? Math.abs(b.velocity.x) * dt : 0);
    const usePainting = this.painted && (!this.lying || this.hasSlide);
    if (this.painted) this.heroSprite.setVisible(p.visible && usePainting);
    if (!p.visible) return;
    if (!usePainting) {
      this.figure(g, p, { lying: this.lying, dir: this.face, t, vx: b.velocity.x, air: !grounded, walk: this.walk });
      return;
    }
    // Pick the frame: in the air, jump or fall; on the ground, run frames timed to distance covered
    // (one frame per RUN_STEP px, so steps match speed), or the standing painting when still.
    this.heroFrame = this.lying ? ['heroSlide', SLIDE_FRAMES[Math.floor(t * SLIDE_FPS) % SLIDE_FRAMES.length]]
      : !grounded ? ['heroSheet', b.velocity.y < 0 ? 6 : 7]
      : Math.abs(b.velocity.x) > 20
        ? (this.textures.exists('heroRun') ? ['heroRun', RUN_FRAMES[Math.floor(this.walk / RUN_STEP) % RUN_FRAMES.length]] : ['heroSheet', Math.floor(this.walk / RUN_STEP) % 6])
      : ['heroIdle', undefined];
    const [key, frame] = this.heroFrame;
    // Standing frames center on him. The slide is anchored by its feet (the frame's leading edge),
    // a little ahead of center, so the body trails behind and getting up moves him forward.
    // Position from the physics body, which has already moved this frame (the rectangle only catches
    // up after drawing, so using it made the painting trail one frame behind the body).
    const flip = this.face < 0, slide = key === 'heroSlide', bx = b.center.x, feet = b.bottom;
    this.heroSprite.setTexture(key, frame).setScale(this.heroScale).setFlipX(flip)
      .setOrigin(slide ? this.slideOrigin(frame, flip) : 0.5, 1)
      .setPosition(bx + (slide ? this.face * 12 : 0), feet + 1);
    // the amulet's glow, on his chest (only placed for upright poses)
    if (slide || !this.wearing) return;
    g.fillStyle(0xffd774, 0.25 + Math.sin(t * 3) * 0.08);
    g.fillCircle(bx + this.face * 2, feet - HERO_HEIGHT * 0.5, 4);
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
    const solids = this.statics.getChildren().filter((s) => s.body.enable).map(bounds);
    for (const e of this.enemies) {
      const b = e.body;
      if (e.kind === 't') { // stands still; shoots straight at you along the ground
        b.velocity.x = 0;
        const p = this.player;
        if (p.visible && Math.abs(p.y - e.y) < 3 * T && (e.cool -= this.game.loop.delta / 1000) <= 0) {
          e.cool = THROW_EVERY;
          const d = Math.sign(p.x - e.x) || 1;
          this.shots.push(Object.assign(this.add.circle(e.x + d * 16, e.y - 4, 5, 0xffb060).setDepth(4), { vx: d * SHOT_SPEED }));
        }
        continue;
      }
      if (b.blocked.left || b.touching.left || e.x < e.room.x + 16) e.dir = 1; // walls and the room's edges turn it
      else if (b.blocked.right || b.touching.right || e.x > e.room.right - 16) e.dir = -1;
      else if ((b.blocked.down || b.touching.down) && !solids.some((s) => s.contains(e.x + e.dir * 14, e.y + 14)))
        e.dir *= -1; // ledge ahead
      b.velocity.x = e.dir * WALKER_SPEED;
      if (e.img) {
        const step = Math.floor((this.time.now / 1000) * WALKER_FPS);
        e.img.setPosition(e.x, e.y + 12 - (step % 2)).setFlipX(e.dir > 0) // sheet faces left; 1px bob
          .setFrame(WALKER_FRAMES[step % WALKER_FRAMES.length]);
      }
    }
  }

  // Flyers, shots, saws, crumbling blocks and falling spikes (only the current room's move).
  updateHazards(dt) {
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
    for (const f of this.flyers) {
      const nx = f.x + f.dir * FLYER_SPEED * dt;
      if (walls(new Phaser.Geom.Rectangle(nx - 12, f.y - 8, 24, 16)) || nx < R.x + 16 || nx > R.right - 16) f.dir *= -1;
      else f.x = nx;
      f.y = f.baseY + Math.sin(t * 3 + f.baseY) * 10;
    }
    this.shots = this.shots.filter((sh) => {
      sh.x += sh.vx * dt;
      if (!solid(new Phaser.Geom.Rectangle(sh.x - 4, sh.y - 4, 8, 8)) && R.contains(sh.x, sh.y)) return true;
      sh.destroy();
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

  resetDropper(d) { d.state = null; d.r.setPosition(d.x0, d.y0).setVisible(true); }

  drawHazards() {
    const g = this.fx, t = this.time.now / 1000;
    for (const sw of this.saws) {
      if (sw.room !== this.index) continue;
      g.fillStyle(0x8a8f99, 1).fillCircle(sw.x, sw.y, SAW_R);
      for (let i = 0; i < 8; i++) {
        const a = (sw.jam ? 0 : t * 12) + (i * Math.PI) / 4;
        g.fillStyle(0xd9dde3, 1).fillTriangle(sw.x + Math.cos(a) * SAW_R, sw.y + Math.sin(a) * SAW_R,
          sw.x + Math.cos(a + 0.3) * (SAW_R + 5), sw.y + Math.sin(a + 0.3) * (SAW_R + 5), sw.x + Math.cos(a + 0.5) * SAW_R, sw.y + Math.sin(a + 0.5) * SAW_R);
      }
      g.fillStyle(0x3a3d44, 1).fillCircle(sw.x, sw.y, 4);
    }
  }

  updateBoss(dt) {
    const B = this.boss;
    if (B?.img) B.img.setPosition(B.r.x, B.r.y).setVisible(B.r.visible).setAlpha(B.r.alpha).setFlipX(B.dir > 0) // sheet faces left
      .setFrame(B.pose ?? MOTH_FRAMES[Math.floor((this.time.now / 1000) * MOTH_FPS) % MOTH_FRAMES.length]);
    if (!B || B.hidden) return;
    B.hurt -= dt;
    B.r.x += B.dir * (BOSS_SPEED + (BOSS_HP - B.hp) * BOSS_SPEEDUP) * dt;
    if (B.r.x < B.min || B.r.x > B.max) { B.r.x = Phaser.Math.Clamp(B.r.x, B.min, B.max); B.dir *= -1; }
    B.r.setAlpha(B.hurt > 0 ? 0.4 : 1);
  }

  // Returns true if the player died. Feet in the boss's top sliver is a stomp (also covers the
  // bounce frames after it); any other touch kills.
  touchBoss() {
    const B = this.boss, p = this.player;
    if (!B || B.hidden || !hit(bounds(p), bounds(B.r))) return false;
    const top = B.r.y - BOSS_H / 2;
    if (p.y + 15 - top > 14) { this.die(); return true; }
    p.body.velocity.y = -JUMP * 0.8;
    if (B.hurt > 0) return false;
    B.hurt = 0.5;
    if (--B.hp <= 0 && B.story) { // a story boss stops still; its script dissolves it (cue 'absorb')
      B.hidden = true;
      Dialogue.play(this, B.story);
    } else if (B.hp <= 0) {
      this.bossDefeated(B);
      this.cameras.main.flash(500, 255, 220, 140);
    }
    return false;
  }

  update(_t, ms) {
    const dt = Math.min(ms / 1000, 0.05);
    const k = this.keys, JD = Phaser.Input.Keyboard.JustDown, p = this.player;

    if (JD(k.R) && k.SHIFT.isDown) return this.scene.restart({ index: this.index }); // Shift+R: retry the room (if you've trapped yourself)
    if (DEV && JD(k.N)) return this.scene.restart({ index: this.index + 1 });
    if (DEV && JD(k.ONE)) rules.freeze = !rules.freeze;
    if (DEV && JD(k.TWO)) rules.snap = !rules.snap;
    if (DEV && JD(k.THREE)) rules.max = LIMITS[(LIMITS.indexOf(rules.max) + 1) % LIMITS.length];
    if (DEV && JD(k.FOUR)) rules.selfDestruct = !rules.selfDestruct;
    if (DEV && JD(k.FIVE)) rules.recall = !rules.recall;
    if (JD(k.ESC)) Dialogue.skip(this);
    if (DEV && JD(k.H)) { showHud = !showHud; this.hud.setVisible(showHud); }

    if (!rules.freeze) this.dropCorpses(dt);
    this.updateEnemies();
    this.updateHazards(dt);
    this.updateBoss(dt);
    this.drawFigures(this.time.now / 1000, dt);
    this.drawBeams();
    this.drawHazards();
    Art.update(this, this.time.now / 1000);

    const weights = [p, ...this.corpses].map(bounds);
    for (const d of this.doors) {
      const held = this.plates.some((pl) => pl.room === d.room && weights.some((w) => hit(w, bounds(pl))));
      d.body.enable = !held;
      d.setAlpha(held ? 0.2 : 1);
    }

    this.updateHud();
    if (this.transit) return;
    // Spots: [column, script, after] plays a script once you walk past that column (after another script, if given).
    if (!this.talk.line && !this.talk.queue.length)
      for (const [col, key, after] of this.rooms[this.index].spots ?? [])
        if (p.x > this.rooms[this.index].rect.x + col * T && (!after || Dialogue.seen.has(after)) && Dialogue.play(this, key)) break;
    if (!this.rooms[this.index].rect.contains(p.x, p.y)) {
      const next = this.rooms.findIndex((r) => r.rect.contains(p.x, p.y));
      if (next >= 0) return this.enterRoom(next);
      p.body.reset(this.start.x, this.start.y); // fell out of the world
    }
    const space = JD(k.SPACE), jumpDown = space | JD(k.W) | JD(k.UP), talkKey = space | JD(k.ENTER) | JD(k.E);
    const JU = Phaser.Input.Keyboard.JustUp, jumpUp = JU(k.SPACE) | JU(k.W) | JU(k.UP);
    const slideKey = JD(k.S) | JD(k.DOWN) | JD(k.SHIFT);
    this.showGuide(dt);
    if (this.dead <= 0 && Dialogue.update(this, dt, talkKey)) { p.body.velocity.x = 0; return; } // talking: hold still
    if (this.dead > 0) {
      this.dead -= dt;
      p.setVisible(this.dead <= 0);
      p.body.velocity.x = 0;
      return;
    }
    const pb = bounds(p);
    // Land on an enemy from above to stomp it (it comes back when you re-enter the room); any other touch kills.
    for (const list of [this.enemies, this.flyers]) for (const e of [...list]) {
      if (!hit(pb, bounds(e))) continue;
      if (p.body.velocity.y > 0 && pb.bottom - bounds(e).y < 14) { list.splice(list.indexOf(e), 1); this.downed.push({ sp: e.spawn }); e.destroy(); p.body.velocity.y = -STOMP_BOUNCE; }
      else return this.die();
    }
    const sawBoxes = this.saws.filter((sw) => sw.room === this.index).map((sw) => new Phaser.Geom.Rectangle(sw.x - SAW_R + 3, sw.y - SAW_R + 3, SAW_R * 2 - 6, SAW_R * 2 - 6));
    const falling = this.droppers.filter((d) => d.room === this.index && d.state !== 'gone').map((d) => bounds(d.r));
    const hazards = [...this.spikes.map(bounds), ...this.shots.map(bounds), ...sawBoxes, ...falling];
    if (hazards.some((h) => hit(pb, h)) || this.laserHit()) return this.die();
    const world = this.rooms[this.index].world ?? 0;
    // Self-destruct: hold to charge, let go to cancel. After a death, let go before charging again.
    if (!(k.K.isDown || k.X.isDown)) this.sdLock = false, this.charge = 0;
    else if (!this.sdLock && (rules.selfDestruct || world >= 2) && (this.charge += ms / 1000) >= SD_HOLD) { this.sdLock = true; return this.die(); }
    // Recall: a tap takes back the newest soul; holding keeps going, faster and faster.
    if ((rules.recall || world >= 3) && k.Q.isDown) {
      if (JD(k.Q)) { this.recallGap = RECALL_GAP; this.recallT = 0; }
      if ((this.recallT -= ms / 1000) <= 0) { // real time, like the physics (dt is capped)
        this.corpses.pop()?.destroy();
        this.recallT = this.recallGap;
        this.recallGap = Math.max(RECALL_MIN, this.recallGap * 0.7);
      }
    }
    if (this.touchBoss()) return;
    this.amulets = this.amulets.filter((a) => {
      if (!hit(bounds(p), bounds(a))) return true;
      a.destroy(); // the gold flash comes later, once he puts it on
      Dialogue.play(this, 'amulet');
      return false;
    });
    for (const sh of this.shrines) if (hit(bounds(p), bounds(sh)) && this.start !== sh.spawn) {
      this.start = sh.spawn;
      this.shrines.forEach((o) => o.rune.setAlpha(o === sh ? 1 : 0.35));
      if (this.rooms[this.index].world) Dialogue.play(this, 'shrineMark'); // the first touch only
    }

    const b = p.body;
    if (b.velocity.y > MAX_FALL) b.velocity.y = MAX_FALL; // cap falling only (a cap both ways held springs to 7.4 tiles)
    const grounded = b.blocked.down || b.touching.down;
    if (grounded || b.velocity.y >= 0) this.sprung = false;
    if (b.velocity.y >= 0 && this.springs.some((sp) => hit(bounds(p), bounds(sp)))) { b.velocity.y = -SPRING; this.sprung = true; }
    const dir = (k.D.isDown || k.RIGHT.isDown) - (k.A.isDown || k.LEFT.isDown);
    if (dir && !(this.lying && this.slide > 0)) this.face = dir; // can't turn mid-slide
    if (slideKey && grounded && !this.lying && Math.abs(b.velocity.x) > 100) {
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
      b.velocity.x -= Math.sign(b.velocity.x) * Math.min(Math.abs(b.velocity.x), AIR_DRAG * dt);
    } else {
      const diff = dir * SPEED - b.velocity.x, step = (grounded ? ACCEL : AIR_ACCEL) * dt;
      b.velocity.x += Math.sign(diff) * Math.min(Math.abs(diff), step);
    }
    this.coyote = grounded ? COYOTE : this.coyote - dt;
    this.buffer = jumpDown ? BUFFER : this.buffer - dt;
    if (this.buffer > 0 && this.coyote > 0) { b.velocity.y = -JUMP; this.buffer = this.coyote = 0; }
    else if (this.buffer > 0 && this.wallCoyote > 0 && !grounded && this.lastWall !== this.kickSide) { // wall jump
      b.velocity.y = -WALL_JUMP; b.velocity.x = -this.lastWall * WALL_KICK; this.face = -this.lastWall;
      this.kick = KICK_LOCK; this.kickSide = this.lastWall; this.buffer = this.wallCoyote = 0;
    }
    if (grounded) this.kickSide = 0;
    if (jumpUp && this.kick > 0) b.velocity.x *= 0.5; // a tap: a small kick (the jump-height cut is below)
    if (jumpUp && b.velocity.y < 0 && !this.sprung) b.velocity.y *= 0.5; // short hop on early release
  }

  // Each beam runs from its emitter to the first solid thing in its way (walls, closed doors, souls).
  beams() {
    const solids = this.statics.getChildren().filter((s) => s.body.enable).map(bounds);
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
    for (let i = 0; i < rules.max; i++) {
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
    const on = (v) => (v ? 'ON' : 'off');
    this.hud.setText([
      `Room ${this.index + 1}/${ROOMS.length} — ${this.rooms[this.index].name}`,
      'Move A/D or ←/→ · Jump Space · Slide Shift/S/↓ while running · Self-destruct hold K · Recall Q · Retry room Shift+R · Next room N (dev) · Hide H',
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
  scene: [Warning, Room, End],
});
