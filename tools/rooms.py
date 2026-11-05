# Builds the greybox rooms (Worlds 1-3 and the showcase rooms) as game.js ROOMS entries. Run tools/insert-rooms.py.
# Each room starts solid; open() carves space; put() places one tile.
import json, sys
rooms = []
def room(name, pos, w, h, world, note, build, extra=None):
    g = [['#'] * w for _ in range(h)]
    def open_(x0, y0, x1, y1, ch=' '):
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1): g[y][x] = ch
    def put(x, y, ch): g[y][x] = ch
    build(open_, put)
    rooms.append((name, pos, world, note, [''.join(r) for r in g], extra or {}))

# ---------- World 1 ----------
def long_pit(o, p):
    # Flat bridge first; hop onto the shrine before moving your only soul.
    o(0, 8, 2, 9); o(3, 9, 10, 9); o(6, 10, 8, 10, '^')
    o(11, 5, 14, 9); o(12, 9, 13, 9, '#'); p(13, 8, 'C'); p(1, 9, 'P')
    # The bridge death revives the guard: stomp from the shrine on both runs.
    # Touching the guard instead moves your only soul out of the pit.
    o(14, 5, 17, 9); p(16, 9, 'e')
    o(18, 9, 22, 9); o(18, 10, 20, 10, '^')
    o(23, 5, 28, 9); p(24, 9, '#'); p(28, 9, '#'); o(29, 8, 29, 9)
room('The long pit', [150, 94], 30, 17, 1, 'flat bridge, shrine, stomp the guard twice: bridge death revives it', long_pit)

def well(o, p):
    # Aim the first fall beside the lip; the soul makes the last jump possible.
    o(0, 8, 5, 9); p(1, 9, 'P')
    o(6, 8, 11, 21); o(12, 17, 12, 21); o(6, 22, 12, 22, '^')
    o(12, 17, 15, 18); p(14, 18, 'C')
    # Stay off the thorn wall on the way down, then launch from the soul to stomp the guard.
    # Touching either hazard moves your only landing out of the bottom of the well.
    o(16, 17, 23, 30); o(23, 19, 23, 24, 'x'); o(24, 27, 24, 30)
    o(16, 31, 24, 31, '^'); o(24, 25, 28, 28); o(29, 27, 29, 28)
    p(27, 28, 'e'); p(28, 28, '#')
    # A bramble spider hangs over the second shaft: it drops after you (too late to catch a fall) and stops on a
    # soul in its column. Wait on that soul and it lands on you: the new soul is a tile higher, and so on.
    p(19, 17, 'w')
room('The well', [180, 94], 30, 33, 1, 'aim your fall: the soul must land near the exit side', well)

def gatehouse(o, p):
    # First pen: let the walker hit the plate from the door side, then hop the soul.
    o(1, 11, 12, 15); o(0, 13, 0, 14); p(1, 14, 'P')
    o(0, 15, 2, 15, '#'); p(7, 15, '_'); p(11, 15, 'e')
    o(13, 13, 13, 15, 'D')
    # The second plate soul also reaches the four-high ledge. A bad death steals that step.
    o(14, 8, 23, 15); p(14, 15, '#'); p(15, 15, 'C'); p(17, 15, '#'); p(21, 15, '_'); p(23, 15, 'e')
    o(24, 8, 25, 11); o(26, 8, 26, 15, 'D')
    o(27, 8, 28, 15); o(29, 14, 29, 15)
room('The gatehouse', [210, 108], 30, 17, 1, 'get killed on the plate so the walker ends up on the right side', gatehouse)

def thornwood(o, p):
    # A: stomp or dodge the walker, then wall-jump up a 3-wide chimney (no thorns since 2026-11-04: playtesters
    #    struggled; the kick also climbs higher now, about 2.8 tiles per kick).
    o(0, 21, 0, 22); o(1, 18, 10, 22); p(1, 22, 'P'); p(8, 22, 'e')
    o(11, 20, 11, 22); o(12, 3, 14, 22)
    # B: shrine, then a crumbling bridge over spikes under falling spikes: keep running.
    o(15, 3, 30, 5); p(17, 5, 'C'); o(20, 6, 26, 6, '~'); o(20, 7, 26, 9); o(20, 10, 26, 10, '^')
    for x in (21, 23, 25): p(x, 3, '!')
    p(28, 5, 'C')
    # C: drop down, stomp the walker; a saw sweeps the floor and fills a 2-tall corridor you can't jump in.
    #    Let it kill you: your soul jams it. Then wall-jump the 2-wide shaft to the exit.
    o(31, 3, 33, 16); o(31, 17, 36, 22); p(34, 22, 'e'); o(37, 21, 44, 22); o(43, 17, 44, 22); p(40, 22, 'o')
    p(36, 22, '#')   # a post at the corridor mouth: the saw only patrols inside the corridor (hop the post)
    p(43, 22, '#')   # and one under the exit shaft, so you can't follow the saw into the shaft and climb out over it
    o(45, 17, 45, 18)
room('Thornwood', [240, 101], 46, 25, 1, 'SHOWCASE W1: wall jump, thorn anchor, crumbling bridge, falling spikes, saw jam, stomps', thornwood)

# ---------- World 2 ----------
def let_go(o, p):
    o(1, 1, 28, 15); o(0, 13, 0, 15); p(1, 15, 'P')
    # Safe stack, then a shrine before dropping into the guard's lane.
    o(9, 11, 13, 16, '#'); p(11, 10, 'C')
    # The bottom soul holds the door; a third death erases it.
    p(15, 15, '#'); p(17, 15, 'e'); p(21, 15, '_')
    o(22, 11, 29, 16, '#'); o(24, 1, 24, 10, 'D'); o(29, 9, 29, 10)
room('Let go', [316, 104], 30, 17, 2, 'hold K: two souls stacked reach a 5-high ledge', let_go)

def off_edge(o, p):
    o(1, 1, 28, 7); o(0, 6, 0, 7); o(29, 6, 29, 7); p(1, 7, 'P')
    # Hang a step over the first pit, then bank the crossing at the shrine.
    o(4, 8, 10, 14); o(4, 15, 10, 15, '^'); p(13, 7, 'C')
    # Keep one soul on the plate and one in the air. An extra death shuts the exit.
    p(16, 7, '_'); o(19, 8, 25, 14); o(19, 15, 25, 15, '^'); o(26, 1, 26, 7, 'D')
room('Off the edge', [346, 107], 30, 17, 2, 'jump off the edge holding K: the soul appears mid-pit', off_edge)

def take_back(o, p):
    # A standing mistake plugs the tunnel; recall it, then slide a flat bridge.
    o(0, 6, 2, 7); o(3, 7, 9, 7); o(5, 8, 7, 8, '^'); p(1, 7, 'P')
    o(10, 3, 18, 7); p(11, 7, '#'); p(11, 6, 'C')
    # Keep the plate oldest. Recall the bad bridge before spending the last slot.
    p(16, 7, '_'); o(19, 7, 25, 7); o(21, 8, 23, 8, '^')
    o(26, 6, 26, 7, 'D'); o(27, 3, 28, 7); o(29, 6, 29, 7)
room('Take it back', [376, 107], 30, 17, 2, 'recall a tunnel plug; preserve the plate while repairing a flat bridge', take_back)

def ladder(o, p):
    # Safe staircase, then bank the climb before dropping to the spike approach.
    o(1, 1, 9, 15); o(10, 1, 14, 8); p(12, 8, 'C')
    o(15, 1, 23, 15); o(24, 1, 40, 8)  # the last platform runs to col 41: the carved mural stands on it
    o(16, 1, 16, 11, '#')  # descend before approaching the spike stairs
    # Both offset souls are also the bridge; a third death removes the lower step.
    o(21, 16, 23, 16, '^')
    o(0, 14, 0, 15); o(41, 7, 41, 8); p(1, 15, 'P')
room('The ladder', [376, 99], 42, 17, 2, '7-high ledge: stack to 3, then run off your top soul holding K for a step beside it', ladder)

def beam(o, p):
    # A: the laser death is both the high step and the shield.
    o(1, 1, 10, 15); o(11, 1, 14, 7); p(11, 11, '<'); p(13, 7, 'C')
    p(9, 15, '#')  # a low block beside the source: die standing on it for the step (as stage B's plate block)
    # An idol slider guards the floor: it steps toward you whenever you jump or hold K, so it ends up against
    # the low block (or a soul). Hop onto it rather than into its side; it's no higher than the block, so no shortcut.
    p(5, 15, 'i')
    # B: the lower step must also hold the door; a third death removes it.
    o(15, 1, 24, 15); o(25, 1, 28, 7); p(25, 11, '<')
    o(16, 1, 16, 12, '#')  # sheltered drop beside the shrine
    p(23, 15, '#'); p(23, 14, '_'); o(27, 1, 27, 7, 'D')
    o(0, 14, 0, 15); o(29, 6, 29, 7); p(1, 15, 'P')
room('The beam', [406, 92], 30, 17, 2, '8-high ledge: jump into the laser right next to its source; that death is the high step and leaves no beam', beam)

def spring(o, p):
    # Safe launch: hang a soul beside the spring, land on it, then jump to the shrine.
    o(1, 1, 10, 15); o(11, 1, 14, 6); p(6, 15, 's'); p(13, 6, 'C')
    # The second landing must also shield the launch from the laser.
    o(15, 1, 24, 15); o(25, 1, 28, 6); p(19, 15, 's'); p(25, 9, '<')
    o(16, 1, 16, 10, '#')  # drop under the beam before launching
    o(0, 14, 0, 15); o(29, 5, 29, 6); p(1, 15, 'P')
room('The spring', [436, 84], 30, 17, 2, '9-high ledge: hold during the launch so a soul hangs beside the spring, then land on it', spring)

def wrong_order(o, p):
    o(1, 1, 28, 15); o(0, 14, 0, 15); o(29, 13, 29, 15); p(1, 15, 'P')
    # Spend the first step reaching the plate; replace it with the pit bridge.
    o(1, 12, 3, 12, '#'); p(2, 11, '_')
    o(7, 16, 13, 16, '^'); o(14, 1, 14, 15, 'D'); p(15, 15, 'C')
    # Spring to a temporary landing, then the high plate. Its replacement shields the next launch.
    o(16, 7, 18, 11, '#'); p(17, 6, '_'); p(19, 15, 's')
    o(22, 16, 27, 16, '^'); p(27, 12, '#'); o(28, 1, 28, 15, 'D'); p(26, 9, '<')
room('Wrong order', [466, 75], 30, 17, 2, 'step, plate, pit: in another order a soul you still need vanishes', wrong_order)

def sawmill(o, p):
    # A: the spring reaches 8.5, the ledge is 9. A saw sweeps the row 5-6 tiles up. Hold K during a launch so
    #    your soul hangs beside the spring 5-7 tiles up: one in the saw's row also jams it; one a row higher is a
    #    step too, but then you spring past a moving saw.
    o(0, 17, 0, 19); o(1, 1, 9, 19); p(1, 19, 'P'); p(6, 19, 's'); p(3, 14, 'o')
    # B: shrine, then crumbling floor over spikes under fire to the plate in front of the thrower. Die on it (or let
    #    it shoot you there): the soul opens the door AND blocks every later shot, so the second crossing is calm.
    #    Stomp the thrower from the soul.
    o(10, 1, 14, 10); o(15, 6, 30, 9); p(12, 10, 'C'); p(27, 9, '_'); o(19, 10, 25, 10, '~'); o(19, 11, 25, 13)
    o(19, 14, 25, 14, '^'); p(29, 9, 't'); o(31, 6, 31, 9, 'D')
    # C: shrine on a ledge in the shaft, drop down; a laser from the ceiling cuts the way out. Die in it mid-jump so the soul sits high
    #    and you can walk under it (a soul on the floor blocks the path with the beam still above it). Stomp the walker.
    o(32, 6, 34, 19); o(32, 10, 33, 10, '#'); p(33, 9, 'C'); o(35, 15, 42, 19); p(38, 14, 'v'); p(41, 19, 'e'); p(36, 19, '#'); o(43, 17, 43, 19)   # post keeps the walker off the landing
room('Sawmill', [496, 71], 44, 22, 2, 'SHOWCASE W2: spring + timed self-destruct jams a saw, plate soul as a shield, thrower, laser', sawmill)

def tree_guardian(o, p):
    o(1, 1, 28, 15); o(0, 13, 0, 15, 'V'); o(29, 13, 29, 15)   # entrance vines close behind you
    p(1, 15, 'P'); p(23, 15, 'B'); o(28, 1, 28, 15, 'V')
room('The tree guardian', [540, 75], 30, 17, 2, 'get the slam to land on a soul to stick its hands; stand on a soul when the floor spikes', tree_guardian)

# ---------- World 3 ----------
def three_high(o, p):
    # Twelve high needs three staggered steps; two steps plus a kick off the tower face fall short.
    o(1, 1, 9, 15); o(10, 1, 14, 3); p(12, 3, 'C')
    o(15, 1, 26, 15); o(27, 1, 28, 7)
    # Drop under the low lintel: the shield cannot double as an exit step.
    o(16, 1, 20, 11, '#'); p(18, 11, 'v')
    o(0, 13, 0, 15); o(29, 6, 29, 7); p(1, 15, 'P')
room('Three high', [540, 75], 30, 17, 3, '12-high tower: a 3-soul staircase (run off your top soul while holding K)', three_high)

def own_way(o, p):
    # Die on the spike at the bottom of the shaft: the soul plugs it, and the thorn stops you walking off it
    # into the low tunnel. Run on the floor and swap: you keep your speed and come out in the tunnel.
    o(0, 8, 0, 9); o(1, 3, 6, 9); p(1, 9, 'P')
    o(6, 10, 6, 13); p(6, 14, '^'); o(7, 13, 11, 13); o(7, 14, 7, 14)
    o(12, 3, 15, 14); p(13, 14, 'C'); o(15, 12, 15, 14, '#')
    # Hold K to die on the exit plate, then swap out with E, leaving it held.
    o(17, 2, 21, 9); o(16, 8, 16, 9, 'D'); p(18, 9, '_')
    o(22, 8, 22, 9, 'D'); o(23, 5, 28, 9); o(29, 8, 29, 9)
room('Two places', [570, 73], 30, 17, 3, 'plug the shaft with a soul, then swap into the low tunnel at a run; die on the exit plate and swap out to keep it held', own_way)

def three_jobs(o, p):
    # Climb to the safe three-job setup, then drop to the shrine.
    o(0, 14, 0, 15); o(1, 4, 3, 15); p(1, 15, 'P')
    o(4, 4, 13, 7); p(4, 7, '_'); o(6, 8, 12, 8, '^'); p(13, 3, 'v')
    o(14, 6, 14, 7, 'D'); o(15, 4, 16, 14); p(16, 14, 'C')
    # The second bridge has crumbling lips: commit to the jump, including the high laser death.
    o(17, 10, 27, 14); p(18, 14, '_'); o(20, 15, 26, 15, '^')
    for x in (19, 27):
        p(x, 15, '~'); p(x, 16, '^')
    p(27, 9, 'v'); o(28, 13, 28, 14, 'D'); o(29, 14, 29, 15)

room('Three jobs', [600, 67], 30, 17, 3, 'plate, pit and a laser blocker at once; recall mistakes instead of dying over them', three_jobs)

def everything(o, p):
    # Slide a flat bridge through the low tunnel, then hop onto the shrine.
    o(0, 18, 2, 19); o(3, 19, 14, 19); o(7, 20, 9, 20, '^')
    o(14, 15, 21, 19); o(15, 19, 16, 19, '#'); p(16, 18, 'C')
    # Keep the plate oldest, jam the low saw lane, then time a spring step.
    # Recall a bad step: another death would erase the plate and shut the door.
    p(19, 19, '_'); o(22, 18, 29, 19); p(22, 19, '#'); p(25, 19, 'o'); p(29, 19, '#'); o(28, 17, 29, 17)  # the post keeps the saw in its lane; headroom to hop it
    o(30, 18, 30, 19, 'D')
    o(31, 1, 38, 19); p(34, 19, 's')
    # A reliquary scarab paces the spring floor: stomp it or let a soul fence it off (it turns at souls and walks
    # across flat ones). It can't reach the exit ledge or the hanging step, so it's no ladder.
    p(37, 19, 'b')
    o(39, 1, 43, 10); o(44, 9, 44, 10)
    p(1, 19, 'P')
room('Everything', [630, 63], 45, 22, 3, 'slide bridge, shrine; plate, saw jam and spring step together; recall a bad step', everything)

def reliquary(o, p):
    # A: wall-jump a 3-wide chimney while flyers cross it. A small ledge below each flyer lets you stop and time
    #    your next kicks (or stomp the flyer for a bounce).
    o(0, 20, 0, 21); o(1, 19, 4, 21); p(1, 21, 'P'); o(5, 3, 7, 21); p(5, 13, 'f'); p(7, 7, 'f')
    p(5, 17, '#'); p(7, 11, '#')   # resting ledges: stand, watch the flyer above, then go
    # B: shrine. A 2-tall corridor split by posts into two saw lanes. Jam each saw with a soul (it sticks inside
    #    the soul, so you walk over it), then self-destruct on the plate at the end: all 3 souls. A wrong death
    #    erases your oldest jam: recall (Q) the mistake instead.
    o(8, 3, 30, 4); p(9, 4, 'C'); p(11, 4, '#'); p(15, 4, 'o'); p(19, 4, '#'); p(23, 4, 'o'); p(26, 4, '#')
    p(27, 4, '_'); o(30, 3, 30, 4, 'D')   # two tiles from plate to door: you can't hold it and stand in the doorway
    # C: shrine, then crumbling steps down over spikes with falling spikes overhead.
    o(31, 3, 38, 21); p(32, 4, 'C'); o(32, 5, 32, 5, '#'); o(32, 22, 37, 22, '^')
    for x, y in ((33, 8), (35, 11), (37, 14), (35, 17)): o(x, y, x, y, '~')
    for x in (34, 36): p(x, 3, '!')
    o(31, 6, 32, 21, 'x'); o(38, 5, 38, 19, 'x'); p(38, 22, '^'); p(36, 20, '~'); o(37, 21, 38, 21, '~')
    o(39, 20, 39, 21)
room('Reliquary', [675, 52], 40, 24, 3, 'SHOWCASE W3: flyers in a chimney, two saws to jam, plate, recall, crumbling descent', reliquary)

def rehearsal(o, p):
    o(0, 13, 0, 14); o(1, 2, 13, 15); p(2, 15, 'P')
    # Two staggered souls reach the seven-high shelf; bait the relic below them.
    o(14, 2, 17, 8); p(16, 8, 'C')
    o(14, 10, 28, 15); p(28, 12, 'a')
    # A low corridor gives the second beam a narrow angle: sacrifice a decoy, then run.
    o(18, 6, 28, 8); p(28, 8, 'a'); o(29, 7, 29, 8)
room('The rehearsal', [715, 59], 30, 17, 3, 'aimed beams: protect a two-soul stair, shrine, sacrifice a corridor decoy', rehearsal)

def old_tree(o, p):
    o(1, 7, 28, 14); o(0, 13, 0, 14); o(29, 13, 29, 14)
    p(2, 14, 'P')
room('The old tree', [745, 53], 30, 17, 3, 'calm promise; return behind the tree for the note', old_tree)

def end(o, p):
    # An open plain (user, 2026-11-05): nowhere to camp; you jump over the stag. You walk in on the floor (the vines
    # close behind you) and the stag appears 7 tiles in. A soul on the plate raises the gate (game.js) the gallop slams into.
    o(1, 1, 38, 14); o(0, 13, 0, 14, 'V'); p(2, 14, 'P'); p(28, 14, 'B'); p(34, 14, '_'); o(39, 13, 39, 14, 'V')
room('The spectral stag', [775, 53], 40, 17, 3, 'final boss: gate plate, antler sweep snags a floating soul, then a tug of war (mash Space)', end)

def pyramid(o, p):
    o(1, 1, 28, 14); o(0, 13, 0, 14); p(2, 14, 'P')  # open to the sky so the whole pyramid shows
room('The pyramid entrance', [815, 53], 30, 17, 3, 'walk into floor one after reading the note', pyramid)

out = []
for name, pos, world, note, rows, extra in rooms:
    opts = {'world': world} if world else {}
    if name == 'Let go': opts.update(enter='letGo')
    if name == 'The long pit': opts.update(spots=[[3, 'slide']])
    if name == 'Take it back': opts.update(enter='takeBack')
    if name == 'Two places': opts.update(enter='twoPlaces')
    if name == 'Thornwood': opts.update(spots=[[10, 'wallJump']])
    if name == 'The ladder': opts.update(spots=[[26, 'carvings']])  # at the carved wall
    if name == 'Three high': opts.update(spots=[[4, 'pyramid']])
    if name == 'Everything': opts.update(shrineTalk='almostCompetent')
    if name == 'The old tree': opts.update(spots=[[18, 'stagPromise']])
    if name == 'The spectral stag': opts.update(spots=[[7, 'stagArrival']])
    if name == 'The tree guardian': opts.update(boss='tree', spots=[[7, 'tree']], deathTalk={20: 'treeSlam', 40: 'treeSlam2'})
    if world == 3 or name == 'End of the greybox': pos = [pos[0] + 30, pos[1]]
    if name != 'Take it back' and (world == 3 or world == 2 and pos[0] >= 376): pos = [pos[0] + 30, pos[1]]
    if name != 'The ladder' and pos[0] >= 436: pos = [pos[0] + 12, pos[1]]  # The ladder is 12 wider (the mural's platform)
    o = ', '.join(f"{k}: {json.dumps(v)}" for k, v in opts.items())
    out.append(f"  [{json.dumps(name)}, [ // {note}\n" + ''.join(f"    '{r}',\n" for r in rows) + f"  ], {json.dumps(pos)}{', { ' + o + ' }' if o else ''}],")
open(sys.argv[1], 'w').write('\n'.join(out) + '\n')
