/**
 * Occupancy and mass of a frame, by the method in docs/drawing.md ("The frame budget").
 *
 *   node budget.mjs frame.png [more.png ...] [--map map.png]
 *
 * Run it from tools/, so the bundled ffmpeg is found (or set FFMPEG to your own). It
 * reads PNGs only: pass native frames from still.mjs or shoot.mjs, not reduced sheets.
 *
 * The method: convert to lightness with the weights Python's Pillow uses for 'L'
 * (0.299 R + 0.587 G + 0.114 B); average 12 x 12 blocks, about 2.6 screen cells, so
 * the dots average away; call the frame's own 97th-percentile block "paper"; a block's
 * darkness is how far it falls below paper, as a share of paper. Occupancy is the share
 * of blocks darker than 0.04 (readable ink); mass is the share darker than 0.35 (reading
 * dark or solid). A full-bleed dark frame has no bare paper, so its "paper" is its own
 * lightest ink and its occupancy is high by definition: read the two numbers together.
 *
 * --map writes one image per input at the input's size: each block painted cream
 * (paper), grey (occupied) or dark (mass). With several inputs, the map name gets the
 * input's name appended. The numbers describe a frame; they are not a score.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const B = 12;
const argv = process.argv.slice(2), files = [];
let map = null;
for (let i = 0; i < argv.length; i++) argv[i] === '--map' ? (map = argv[++i]) : files.push(argv[i]);
if (!files.length) { console.error('usage: node budget.mjs frame.png [more.png ...] [--map map.png]'); process.exit(1); }

let ffmpeg = process.env.FFMPEG;
if (!ffmpeg) {
  try { ffmpeg = createRequire(path.resolve('package.json'))('ffmpeg-static'); }
  catch { console.error('run from tools/ (for its bundled ffmpeg) or set FFMPEG'); process.exit(1); }
}

function size(file) {                        // a PNG's width and height, from its IHDR chunk
  const h = Buffer.alloc(24), fd = fs.openSync(file, 'r');
  fs.readSync(fd, h, 0, 24, 0); fs.closeSync(fd);
  if (h.toString('latin1', 12, 16) !== 'IHDR') throw Error(`${file} is not a PNG`);
  return [h.readUInt32BE(16), h.readUInt32BE(20)];
}

function percentile(sorted, p) {             // linear interpolation, as numpy's default
  const k = (sorted.length - 1) * p / 100, f = Math.floor(k), c = Math.min(f + 1, sorted.length - 1);
  return sorted[f] + (sorted[c] - sorted[f]) * (k - f);
}

for (const file of files) {
  const [w, h] = size(file);
  const run = spawnSync(ffmpeg, ['-loglevel', 'error', '-i', file, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                        { maxBuffer: w * h * 3 + 1024 });
  if (run.status !== 0) throw Error(String(run.stderr));
  const px = run.stdout, bw = Math.floor(w / B), bh = Math.floor(h / B);
  const blocks = new Float64Array(bw * bh);
  for (let by = 0; by < bh; by++) for (let bx = 0; bx < bw; bx++) {
    let s = 0;
    for (let y = by * B; y < by * B + B; y++) for (let x = bx * B; x < bx * B + B; x++) {
      const i = (y * w + x) * 3;
      s += (px[i] * 19595 + px[i + 1] * 38470 + px[i + 2] * 7471 + 32768) >> 16;   // Pillow's 'L', exactly
    }
    blocks[by * bw + bx] = s / (B * B);
  }
  const paper = percentile(Float64Array.from(blocks).sort(), 97);
  let occ = 0, mass = 0;
  const cls = new Uint8Array(blocks.length);
  blocks.forEach((a, i) => {
    const d = Math.min(1, Math.max(0, (paper - a) / paper));
    if (d > 0.04) { occ++; cls[i] = 1; }
    if (d > 0.35) { mass++; cls[i] = 2; }
  });
  const n = blocks.length;
  console.log(`${path.basename(file)}  occupancy ${(occ / n * 100).toFixed(1).padStart(5)}%  mass ${(mass / n * 100).toFixed(1).padStart(5)}%`);

  if (map) {
    const colour = [[242, 237, 227], [170, 168, 176], [46, 49, 90]];
    const raw = Buffer.alloc(bw * bh * 3);
    cls.forEach((c, i) => raw.set(colour[c], i * 3));
    const out = files.length > 1 ? map.replace(/(\.png)?$/, '-' + path.basename(file, '.png') + '.png') : map;
    const enc = spawnSync(ffmpeg, ['-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                                   '-s', `${bw}x${bh}`, '-i', '-', '-vf', `scale=${bw * B}:${bh * B}:flags=neighbor`, out],
                          { input: raw });
    if (enc.status !== 0) throw Error(String(enc.stderr));
  }
}
