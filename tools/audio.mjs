// Generates one sound effect or music loop with ElevenLabs and saves it as Opus in .ogg (loops cleanly; MP3 adds a gap).
//   node tools/audio.mjs <out.ogg> "<prompt>" [--seconds=1.5] [--music]
// Sound effects: /v1/sound-generation (0.5–30 s); leading silence is trimmed so the sound lands on the event.
// Music: /v1/music; no trimming (loop points are cut by hand at a bar line, see the audio prompting guide).
// The key comes from ELEVENLABS_API_KEY in .env (see .env.example); it is never printed.
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname } from 'node:path';

const [outPath, prompt, ...flags] = process.argv.slice(2);
if (!outPath || !prompt) { console.error('usage: node tools/audio.mjs <out.ogg> "<prompt>" [--seconds=N] [--music]'); process.exit(1); }
const key = (readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^ELEVENLABS_API_KEY=(.+)$/m) ?? [])[1]?.trim();
if (!key) { console.error('ELEVENLABS_API_KEY is missing from .env'); process.exit(1); }
const music = flags.includes('--music');
// Duration: --seconds, else the first "N s" in the prompt (our prompts end with a length), else let the API choose.
const seconds = Number(flags.find((f) => f.startsWith('--seconds='))?.split('=')[1] ?? prompt.match(/(\d+(?:\.\d+)?)\s*s\b/)?.[1] ?? 0);

const url = music ? 'https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128'
  : 'https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128';
const body = music ? { prompt, ...(seconds ? { music_length_ms: Math.round(seconds * 1000) } : {}) }
  : { text: prompt, prompt_influence: 0.6, ...(seconds ? { duration_seconds: Math.min(30, Math.max(0.5, seconds)) } : {}) };
const res = await fetch(url, { method: 'POST', headers: { 'xi-api-key': key, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
if (!res.ok) { console.error(`ElevenLabs ${res.status}: ${(await res.text()).slice(0, 300)}`); process.exit(1); }

mkdirSync(dirname(outPath), { recursive: true });
const tmp = outPath.replace(/\.ogg$/, '') + '.tmp.mp3';
writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
// Even loudness across the set, peaks kept under -1.5 dB (ElevenLabs delivers peaks at 0 dB).
const filter = ['-af', music ? 'loudnorm=I=-20:TP=-1.5:LRA=11' : 'silenceremove=start_periods=1:start_threshold=-50dB,loudnorm=I=-18:TP=-1.5:LRA=11'];
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', tmp, ...filter, '-c:a', 'libopus', '-b:a', '96k', outPath]);
unlinkSync(tmp);
const dur = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', outPath]).toString().trim();
console.log(`${outPath}: ${Number(dur).toFixed(2)} s`);
