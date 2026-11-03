# Rebuilds the greybox rooms from tools/rooms.py and swaps them into game.js, between the
# "New World 1 rooms" marker and 'The moth', and from the World 2 marker to the end of ROOMS.
# Usage: python3 tools/insert-rooms.py   then   node tools/validate-rooms.mjs game.js
import os, subprocess, sys, tempfile
here = os.path.dirname(os.path.abspath(__file__))
game = os.path.join(here, '..', 'game.js')
out = os.path.join(tempfile.gettempdir(), 'rooms.js')
subprocess.run([sys.executable, os.path.join(here, 'rooms.py'), out], check=True)
new = open(out).read()
w1, rest = new.split('  ["Let go"', 1); rest = '  ["Let go"' + rest
rest = rest.replace('  ["Three high"', '  // ---------------- World 3: Sanctum (greybox) ----------------\n  ["Three high"', 1)
s = open(game).read()
a = s.index('  // New World 1 rooms'); b = s.index("  ['The moth', [")
c = s.index('  // ---------------- World 2: Overgrown Ruins (greybox)'); d = s.index('];\nconst WORLD_NAMES')
s = s[:a] + '  // New World 1 rooms (greybox, see docs/LEVELS.md)\n' + w1 + s[b:c] + '  // ---------------- World 2: Overgrown Ruins (greybox) ----------------\n' + rest + s[d:]
open(game, 'w').write(s)
