import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const source = path.resolve('../artifacts/demo-video/demo-script.md');
const outputDir = path.resolve('../artifacts/demo-video/voice-parts');
const output = path.resolve('../artifacts/demo-video/voice-over.mp3');
const ffmpeg = path.resolve('node_modules/ffmpeg-static/ffmpeg');
const markdown = await fs.readFile(source, 'utf8');
const paragraphs = markdown
  .split('\n')
  .filter((line) => line && !line.startsWith('#') && !line.startsWith('Target duration:') && !line.startsWith('Disclaimer:'));
const sentences = paragraphs.flatMap((paragraph) => paragraph.match(/[^.!?]+[.!?]?/g) || []);
const chunks = [];

for (const sentence of sentences) {
  const clean = sentence.trim();
  if (!clean) continue;
  if (clean.length <= 180) {
    chunks.push(clean);
    continue;
  }
  for (let index = 0; index < clean.length; index += 170) {
    chunks.push(clean.slice(index, index + 170));
  }
}

await fs.rm(outputDir, { recursive: true, force: true });
await fs.mkdir(outputDir, { recursive: true });

const files = [];
for (const [index, chunk] of chunks.entries()) {
  const file = path.join(outputDir, `${String(index).padStart(3, '0')}.mp3`);
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=vi&q=${encodeURIComponent(chunk)}`;
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!response.ok) throw new Error(`TTS failed (${response.status}): ${chunk}`);
  await fs.writeFile(file, Buffer.from(await response.arrayBuffer()));
  files.push(file);
}

const concatFile = path.join(outputDir, 'concat.txt');
await fs.writeFile(concatFile, files.map((file) => `file '${file.replaceAll("'", "'\\''")}'`).join('\n'));
execFileSync(ffmpeg, ['-y', '-f', 'concat', '-safe', '0', '-i', concatFile, '-c:a', 'libmp3lame', '-q:a', '2', output], { stdio: 'inherit' });
console.log(`Voice-over generated: ${output}`);
