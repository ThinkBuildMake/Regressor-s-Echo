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
room('The well', [180, 94], 30, 33, 1, 'aim your fall: the soul must land near the exit side', well)

def gatehouse(o, p):
    # First pen: let the walker hit the plate from the door side, then hop the soul.
    o(1, 11, 12, 15); o(0, 13, 0, 14); p(1, 14, 'P')
    o(0, 15, 2, 15, '#'); p(7, 15, '_'); p(11, 15, 'e')
    o(13, 13, 13, 15, 'D')
    # The second plate soul also reaches the four-high ledge. A bad death steals that step.
    o(14, 8, 23, 15); p(14, 15, '#'); p(15, 15, 'C'); p(21, 15, '_'); p(23, 15, 'e')
    o(24, 8, 25, 11); o(26, 8, 26, 15, 'D')
    o(27, 8, 28, 15); o(29, 14, 29, 15)
room('The gatehouse', [210, 108], 30, 17, 1, 'get killed on the plate so the walker ends up on the right side', gatehouse)

def thornwood(o, p):
    # A: stomp or dodge the walker, then wall-jump up a 3-wide chimney. Thorns replace the right wall for 5 rows,
    #    more than any kick sequence can cross. Your first death on them leaves a soul right where your arc meets
    #    them; next time kick off that soul (it leaves a 2-wide gap) to get past.
    o(0, 21, 0, 22); o(1, 18, 10, 22); p(1, 22, 'P'); p(8, 22, 'e')
    o(11, 20, 11, 22); o(12, 3, 14, 22); o(15, 10, 15, 14, 'x')
    # B: shrine, then a crumbling bridge over spikes under falling spikes: keep running.
    o(15, 3, 30, 5); p(17, 5, 'C'); o(20, 6, 26, 6, '~'); o(20, 7, 26, 9); o(20, 10, 26, 10, '^')
    for x in (21, 23, 25): p(x, 3, '!')
    p(28, 5, 'C')
    # C: drop down, stomp the walker; a saw sweeps the floor and fills a 2-tall corridor you can't jump in.
    #    Let it kill you: your soul jams it. Then wall-jump the 2-wide shaft to the exit.
    o(31, 3, 33, 16); o(31, 17, 36, 22); p(34, 22, 'e'); o(37, 21, 44, 22); o(43, 17, 44, 22); p(40, 22, 'o')
    p(36, 22, '#')   # a post at the corridor mouth: the saw only patrols inside the corridor (hop the post)
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
    p(16, 7, '_'); o(18, 8, 24, 14); o(18, 15, 24, 15, '^'); o(26, 1, 26, 7, 'D')
room('Off the edge', [346, 107], 30, 17, 2, 'jump off the edge holding K: the soul appears mid-pit', off_edge)

def ladder(o, p):
    # Safe staircase, then bank the climb before dropping to the spike approach.
    o(1, 1, 9, 15); o(10, 1, 14, 8); p(12, 8, 'C')
    o(15, 1, 23, 15); o(24, 1, 28, 8)
    # Both offset souls are also the bridge; a third death removes the lower step.
    o(21, 16, 23, 16, '^')
    o(0, 14, 0, 15); o(29, 7, 29, 8); p(1, 15, 'P')
room('The ladder', [376, 99], 30, 17, 2, '7-high ledge: stack to 3, then run off your top soul holding K for a step beside it', ladder)

def beam(o, p):
    # A: the laser death is both the high step and the shield.
    o(1, 1, 10, 15); o(11, 1, 14, 7); p(11, 11, '<'); p(13, 7, 'C')
    # B: the lower step must also hold the door; a third death removes it.
    o(15, 1, 24, 15); o(25, 1, 28, 7); p(25, 11, '<')
    p(23, 15, '#'); p(23, 14, '_'); o(27, 1, 27, 7, 'D')
    o(0, 14, 0, 15); o(29, 6, 29, 7); p(1, 15, 'P')
room('The beam', [406, 92], 30, 17, 2, '8-high ledge: jump into the laser right next to its source; that death is the high step and leaves no beam', beam)

def spring(o, p):
    # Safe launch: hang a soul beside the spring, land on it, then jump to the shrine.
    o(1, 1, 10, 15); o(11, 1, 14, 6); p(6, 15, 's'); p(13, 6, 'C')
    # The second landing must also shield the launch from the laser.
    o(15, 1, 24, 15); o(25, 1, 28, 6); p(20, 15, 's'); p(25, 9, '<')
    o(0, 14, 0, 15); o(29, 5, 29, 6); p(1, 15, 'P')
room('The spring', [436, 84], 30, 17, 2, '9-high ledge: hold during the launch so a soul hangs beside the spring, then land on it', spring)

def wrong_order(o, p):
    o(1, 1, 28, 15); o(0, 14, 0, 15); o(1, 12, 4, 12, '#'); p(2, 11, '_')   # plate on a shelf over the start, out of the way
    o(11, 16, 18, 16, '^'); o(25, 1, 25, 12, '#'); o(25, 13, 25, 15, 'D'); o(29, 13, 29, 15); p(1, 15, 'P')
room('Wrong order', [466, 75], 30, 17, 2, 'step, plate, pit: in another order a soul you still need vanishes', wrong_order)

def sawmill(o, p):
    # A: the spring reaches 8.5, the ledge is 9. A saw sweeps the row 5-6 tiles up. Hold K during a launch so
    #    your soul hangs beside the spring 5-7 tiles up: one in the saw's row also jams it; one a row higher is a
    #    step too, but then you spring past a moving saw.
    o(0, 17, 0, 19); o(1, 1, 9, 19); p(1, 19, 'P'); p(6, 19, 's'); p(3, 14, 'o')
    # B: shrine, plate (self-destruct on it: the soul opens the door AND shields you from the thrower's shots),
    #    then crumbling floor over spikes under fire. Stomp the thrower.
    o(10, 1, 14, 10); o(15, 6, 30, 9); p(12, 10, 'C'); p(16, 9, '_'); p(17, 9, '_'); o(19, 10, 25, 10, '~'); o(19, 11, 25, 13)
    o(19, 14, 25, 14, '^'); p(29, 9, 't'); o(31, 6, 31, 9, 'D')
    # C: shrine, drop down; a laser from the ceiling cuts the way out. Die in it mid-jump so the soul sits high
    #    and you can walk under it (a soul on the floor blocks the path with the beam still above it). Stomp the walker.
    o(32, 6, 34, 19); p(33, 9, 'C'); o(35, 15, 42, 19); p(38, 14, 'v'); p(41, 19, 'e'); p(36, 19, '#'); o(43, 17, 43, 19)   # post keeps the walker off the landing
room('Sawmill', [496, 71], 44, 22, 2, 'SHOWCASE W2: spring + timed self-destruct jams a saw, plate soul as a shield, thrower, laser', sawmill)

# ---------- World 3 ----------
def three_high(o, p):
    # Safe staircase, then a shrine before dropping into the laser chamber.
    o(1, 1, 9, 15); o(10, 1, 14, 7); p(12, 7, 'C')
    o(15, 1, 26, 15); o(27, 1, 28, 7); p(27, 11, '<')
    o(0, 13, 0, 15); o(29, 6, 29, 7); p(1, 15, 'P')
room('Three high', [540, 75], 30, 17, 3, '8-high ledge: a 3-soul staircase (run off your top soul while holding K)', three_high)

def own_way(o, p):
    # Recall a standing mistake without disturbing the flat bridge underneath it.
    o(0, 8, 2, 9); o(3, 9, 9, 9); o(4, 10, 7, 10, '^'); p(1, 9, 'P')
    o(10, 5, 18, 9); p(11, 9, '#'); p(11, 8, 'C')
    # The plate and both bridge souls use all three slots: another death shuts the door.
    p(16, 9, '_'); o(19, 9, 25, 9); o(20, 10, 23, 10, '^')
    o(26, 8, 26, 9, 'D'); o(27, 5, 28, 9); o(29, 8, 29, 9)
room('In my own way', [570, 73], 30, 17, 3, 'two lying souls bridge the tunnel pit; recall (Q) a standing one that blocks it', own_way)

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
    p(19, 19, '_'); o(22, 18, 29, 19); p(22, 19, '#'); p(25, 19, 'o')
    o(30, 18, 30, 19, 'D')
    o(31, 1, 38, 19); p(34, 19, 's')
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
    o(8, 3, 30, 4); p(9, 4, 'C'); p(11, 4, '#'); p(15, 4, 'o'); p(19, 4, '#'); p(23, 4, 'o'); p(28, 4, '#')
    p(29, 4, '_'); o(30, 3, 30, 4, 'D')
    # C: shrine, then crumbling steps down over spikes with falling spikes overhead.
    o(31, 3, 38, 21); p(32, 4, 'C'); o(32, 5, 32, 5, '#'); o(32, 22, 37, 22, '^')
    for x, y in ((33, 8), (35, 11), (37, 14), (35, 17)): o(x, y, x, y, '~')
    for x in (34, 36): p(x, 3, '!')
    o(39, 20, 39, 21)
room('Reliquary', [675, 52], 40, 24, 3, 'SHOWCASE W3: flyers in a chimney, two saws to jam, plate, recall, crumbling descent', reliquary)

def end(o, p):
    o(1, 1, 28, 14); o(0, 13, 0, 14); p(14, 14, 'P')
room('End of the greybox', [715, 59], 30, 17, None, 'bosses for Worlds 2 and 3 and the beam rehearsal are not built yet', end)

out = []
for name, pos, world, note, rows, extra in rooms:
    opts = {'world': world} if world else {}
    o = ', '.join(f"{k}: {v}" for k, v in opts.items())
    out.append(f"  [{json.dumps(name)}, [ // {note}\n" + ''.join(f"    '{r}',\n" for r in rows) + f"  ], {json.dumps(pos)}{', { ' + o + ' }' if o else ''}],")
open(sys.argv[1], 'w').write('\n'.join(out) + '\n')
