// Audio critic: Gemini listens to a generated sound and says what it actually hears, whether that matches
// the prompt, and whether the loudness suits it. Runs through OpenRouter, pinned to Google Vertex (no fallback).
//   node tools/audio-judge.mjs <sound.ogg> "<prompt>" [--level=quiet|normal|loud] [--music]
// Prints one JSON line: { hears, match (1-10), loudness, fix, rewrite }. Key: OPENROUTER_API_KEY in .env.
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const MODEL = 'google/gemini-3.5-flash'; // cheap; pinned to Vertex below
const [inPath, prompt, ...flags] = process.argv.slice(2);
if (!inPath || !prompt) { console.error('usage: node tools/audio-judge.mjs <sound.ogg> "<prompt>" [--level=quiet|normal|loud]'); process.exit(1); }
const key = (readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^OPENROUTER_API_KEY=(.+)$/m) ?? [])[1]?.trim();
if (!key) { console.error('OPENROUTER_API_KEY is missing from .env'); process.exit(1); }
const level = flags.find((f) => f.startsWith('--level='))?.split('=')[1] ?? 'normal';
const kind = flags.includes('--music') ? 'looping background music track' : 'sound effect';

// Gemini takes wav/mp3, not Opus: convert in memory to a compact mono mp3 (music tracks run to minutes).
const audio = execFileSync('ffmpeg', ['-loglevel', 'error', '-i', inPath, '-ac', '1', '-ar', '22050', '-b:a', '64k', '-f', 'mp3', '-'], { maxBuffer: 64 << 20 });
const ask = `You are a strict sound designer reviewing one ${kind} for a calm, painterly 2D game.
The sound was generated from this description: "${prompt}".
It should sit at a ${level} loudness in the mix (quiet = breaths, sighs, faint foley; normal = most effects; loud = impacts, quakes).
Listen carefully, then answer with only JSON, no prose:
{"hears": "<what you actually hear, concretely: sources, materials, length, any noise or artefacts>",
 "match": <1-10, how well it matches the description>,
 "loudness": "<too quiet | right | too loud> for a ${level} sound",
 "fix": "<one concrete change to the description that would fix it, or empty if match >= 8>",
 "rewrite": "<the full description rewritten with that fix, written for a sound-effect generator: real-world sources and materials, no game jargon, keep the length; or empty if match >= 8>"}`;

const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: MODEL,
    provider: { only: ['google-vertex'], allow_fallbacks: false },
    messages: [{ role: 'user', content: [
      { type: 'text', text: ask },
      { type: 'input_audio', input_audio: { data: audio.toString('base64'), format: 'mp3' } },
    ] }],
  }),
});
if (!res.ok) { console.error(`OpenRouter ${res.status}: ${(await res.text()).slice(0, 300)}`); process.exit(1); }
const out = await res.json();
const text = out.choices?.[0]?.message?.content ?? '';
const json = text.match(/\{[\s\S]*\}/)?.[0];
console.log(json ? JSON.stringify({ file: inPath, provider: out.provider, ...JSON.parse(json) }) : text);
