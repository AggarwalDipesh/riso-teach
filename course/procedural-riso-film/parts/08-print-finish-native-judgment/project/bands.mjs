/**
 * Block means across a region of a frame: the tone check in docs/drawing.md ("Judging a frame").
 *
 *   node bands.mjs frame.png X Y W H N [--across]
 *
 * Run it from tools/, so the bundled ffmpeg is found (or set FFMPEG to your own). It cuts the
 * rectangle (X, Y, W, H) of a PNG into N equal strips, stacked top to bottom (or left to right
 * with --across), and prints each strip's mean lightness with the weights Python's Pillow uses
 * for 'L' (0.299 R + 0.587 G + 0.114 B), plus the change from the strip before.
 *
 * A strip averages thousands of pixels, so the screen's dots and the paper's grain average away
 * and what is left is tone. A smooth ramp changes by similar amounts from strip to strip. A
 * ramp the screen has quantised shows runs of nearly equal strips separated by jumps. Banding
 * you can see in a reduced view but cannot find in the native frame's strips was made by the
 * reduction. Measure the native PNG: a reduced image carries the reduction's own errors.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const argv = process.argv.slice(2);
const across = argv.includes('--across');
const [file, ...nums] = argv.filter(a => a !== '--across');
const [X, Y, Wd, Ht, N] = nums.map(Number);
if (!file || ![X, Y, Wd, Ht, N].every(Number.isFinite) || N < 1) {
  console.error('usage: node bands.mjs frame.png X Y W H N [--across]');
  process.exit(1);
}

let ffmpeg = process.env.FFMPEG;
if (!ffmpeg) {
  try { ffmpeg = createRequire(path.resolve('package.json'))('ffmpeg-static'); }
  catch { console.error('run from tools/ (for its bundled ffmpeg) or set FFMPEG'); process.exit(1); }
}

const h = Buffer.alloc(24), fd = fs.openSync(file, 'r');
fs.readSync(fd, h, 0, 24, 0); fs.closeSync(fd);
if (h.toString('latin1', 12, 16) !== 'IHDR') throw Error(`${file} is not a PNG`);
const w = h.readUInt32BE(16), ht = h.readUInt32BE(20);
if (X < 0 || Y < 0 || X + Wd > w || Y + Ht > ht) throw Error(`region is outside the ${w} x ${ht} frame`);

const run = spawnSync(ffmpeg, ['-loglevel', 'error', '-i', file, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                      { maxBuffer: w * ht * 3 + 1024 });
if (run.status !== 0) throw Error(String(run.stderr));
const px = run.stdout;

const sums = new Float64Array(N), counts = new Float64Array(N);
for (let y = Y; y < Y + Ht; y++) for (let x = X; x < X + Wd; x++) {
  const k = Math.min(N - 1, Math.floor((across ? (x - X) / Wd : (y - Y) / Ht) * N));
  const i = (y * w + x) * 3;
  sums[k] += (px[i] * 19595 + px[i + 1] * 38470 + px[i + 2] * 7471 + 32768) >> 16;
  counts[k]++;
}
let prev = null;
for (let k = 0; k < N; k++) {
  const m = sums[k] / counts[k];
  const at = across ? `x ${Math.round(X + k * Wd / N)}` : `y ${Math.round(Y + k * Ht / N)}`;
  console.log(`${at.padEnd(7)} ${m.toFixed(1).padStart(6)}${prev === null ? '' : `  ${(m - prev >= 0 ? '+' : '') + (m - prev).toFixed(1)}`}`);
  prev = m;
}
