# Part 02 — Ink, Paper, Screen: The Plate Model

Your Part 01 mark was a flat RGB fill: `ctx.fillStyle = INK.blue` and a disc. It used a riso
ink's colour, but nothing about it behaves like print. A risograph cannot put "45% blue" anywhere.
It can only put ink or no ink at each point, and a printed image is built from that one limit. Dots
make mid-tones, paper shows between the dots, darks appear where one translucent ink crosses
another, and each ink lands slightly out of line with the others.

In this Part you draw one small abstract arrangement three ways: as ordinary RGB, through a
plate pipeline you write yourself, and through the repository's own engine. You finish with a
native frame in which you can point at any pixel and say which inks printed it.

**You will make**

- `work/rgb/`: the arrangement in flat RGB, kept as evidence of what that approach cannot explain.
- `work/plates/`: the same arrangement printed by a plate pipeline you write (about fifteen
  lines), plus the experiments of this Part.
- `work/jitter/`: a copy whose registration changes every frame, kept as evidence.
- `work/still/`: the arrangement through the repository's engine (`scene` and `bakeScene`). This
  is the Part's deliverable, with its native PNG and 1:1 crops.
- `work/NOTES.md`: predictions, measurements, what the pixels show, and the three decisions.

**Reference:** [`project/index.html`](project/index.html) is the finished arrangement, a
self-contained still made with the same scaffold and verified with the same tools. It is the answer
to section 9's exercise, so do not open it until section 9 tells you to; nothing before that
depends on it. It is a snapshot: later Parts never change it. Copy it into `work/` if you want to
experiment with it.

---

## 1. Setup and two inspection tools

Work from `tools/` as in Part 01, with the same shell variables pointed at this Part, plus the
bundled ffmpeg. This time create the output folder yourself, because the first thing you write
into it comes from ffmpeg, which does not create folders:

```sh
cd tools
PART=../course/procedural-riso-film/parts/02-ink-paper-screen
OUT=../out/course/02
FFMPEG=$(node -p "require('ffmpeg-static')")
mkdir -p $OUT
```

This Part is about pixels a few pixels wide, so you need two instruments.

**A 1:1 crop.** Define this shell function (it lasts for your terminal session):

```sh
crop() { "$FFMPEG" -loglevel error -y -i "$1" -vf "crop=120:120:$2:$3,scale=480:480:flags=neighbor" "$4"; }
```

`crop in.png X Y out.png` cuts the 120 × 120 native pixels whose top-left corner is (X, Y) and
enlarges them exactly four times with nearest-neighbour scaling. Every native pixel becomes a
4 × 4 block of the same colour, so nothing is blended, smoothed or invented, and the enlargement
holds the same information as the native crop. Image viewers usually smooth when you zoom in,
which blurs exactly the edges you are trying to see. From here on, "crop" means this function,
and a crop is opened at 100%.

**A pixel measurement.** Part 01 established that the page canvas holds the frame's native
pixels, the same ones `still.mjs` exports. So you can measure them directly in Firefox's console
on the open work. Paste this function there once per page load (the first time, Firefox asks you
to type `allow pasting`):

```js
function measure(x, y, w, h) {
  const page = ctx.getImageData(x, y, w, h).data;                     // the frame on the page now
  const bare = paper.getContext('2d').getImageData(x, y, w, h).data;  // the same pixels of bare paper
  let inked = 0, light = 0;
  for (let i = 0; i < page.length; i += 4) {
    const [r, g, b] = [page[i], page[i + 1], page[i + 2]];
    if (Math.max(Math.abs(r - bare[i]), Math.abs(g - bare[i + 1]), Math.abs(b - bare[i + 2])) > 16) inked++;
    light += 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  return { inked: +(inked / (w * h)).toFixed(3), lightness: Math.round(light / (w * h)) };
}
```

`ctx` and `paper` are the scaffold's own globals: the page context and the baked paper you mapped
in Part 01. `measure(x, y, w, h)` compares a rectangle of the frame with the same rectangle of bare
paper and returns two numbers:

- `inked`: the share of pixels that differ from bare paper by more than 16 in some channel,
  meaning some ink landed there;
- `lightness`: the mean brightness of the rectangle, from 0 (black) to about 232 (this paper),
  using the standard luma weights.

Both describe the rectangle you give them, not the whole frame. Measure inside a region, away from
its edges.

## 2. What a printed frame is made of

Start with evidence of the look. Open `films/window-seat/sheet.jpg`, a contact sheet of twelve
reduced frames from the repository's showcase film. Then open `films/window-seat/poster.png`, a
native 1080 × 1080 frame (the dawn scene, the sheet's 60.5 s cell). At a normal viewing size the
poster reads as flat colour: a smooth yellow-to-blue sky, a solid sun, lilac mountains, a dark
window frame, a deep blue glass of water.

Now look at it at 1:1:

```sh
crop ../films/window-seat/poster.png 60  110 $OUT/poster-corner.png
crop ../films/window-seat/poster.png 470 440 $OUT/poster-sun.png
crop ../films/window-seat/poster.png 740 720 $OUT/poster-glass.png
```

Answer in your notes, from the crops:

1. In the sky (`poster-corner`), how many colours of dot can you find, and what lies between them?
2. The sun (`poster-sun`, upper part) looked solid. What runs through the yellow at 1:1, and in
   what pattern? What are the orange marks on it?
3. The glass (`poster-glass`) looked like one deep blue. Which colours make it up? Are any pixels
   black?
4. Do the blue dots in the sky and the orange dots in the sun line up in rows at the same angle?

<details>
<summary>After answering: what you should be seeing</summary>

1. Mostly blue dots, with yellow ones and some green where blue and yellow overlap, and bare
   cream paper between them. The dark line crossing the crop is the window frame's outline.
2. A regular square grid of tiny paper pinholes: yellow's screen, set at 0°. The orange marks
   are orange dots printed over the yellow.
3. Blue, indigo and pink dots, overlapping. The darkest pixels are where they overlap (a lightness
   of about 4 on the `measure` scale from section 1), and not one pixel is black.
4. No. Each ink's rows run at their own angle.
</details>

Then read *The reference* in [`docs/quality-bar.md`](../../../../docs/quality-bar.md#the-reference).
It is the repository's measured description of the print finish it aims for. Four of its
bullets are what you just looked for: *Darks are overprints*, *Each ink keeps its screen angle*
(where mid-tones "show paper between dots"), *Small contours sell registration*, and the paper,
which is "cloudier than 'subtle grain'" and appears in every gap. Registration is hard to find
in these three crops; you will see it clearly in your own work in section 8.

Window Seat moves, and its frames come from a compositor you meet in Part 17. Its poster still
obeys the model this Part builds, which is all you need it for here.

## 3. The obvious approach: flat RGB

Now make something of your own. Use this arrangement, or move and resize its parts, as long as
each part is still there. Its job is to put every print question in one frame, not to be a
composition. Composition starts in Part 07.

| Part | Where (1080 units) | What it should read as |
|---|---|---|
| Paper | anywhere left empty, e.g. the top-right corner | the light area |
| Field | rectangle x 140–620, y 120–700 | one ink at a flat mid-tone, 45% |
| Block | rectangle x 380–620, y 260–560, inside the field | the same ink, solid |
| Strip | rectangle x 140–940, y 780–880 | the same ink, graded from nothing (left) to solid (right) |
| Disc | centre (640, 410), radius 200 | a second ink, solid; it crosses the field, the block and paper |
| Mark | centre (860, 650), radius 56, on paper | a small dark, the darkest thing in the frame |

The examples below use `INK.blue` for the first ink and `INK.orange` for the second. You can
choose any two from `INK`; if you do, read section 7 on screen angles before you choose.

Generate a **still** this time:

```sh
node new-riso.mjs --kind still --out $PART/work/rgb/index.html
```

`--kind still` makes the same scaffold as Part 01 without the player bar. Its duration is 1 s
(the tools still need one), and you export it with `still.mjs --at 0`.

In `work/rgb/index.html`, write `drawArt` with ordinary Canvas fills in the ink colours: the field
with `globalAlpha = 0.45`, the strip with a `createLinearGradient` from transparent to blue, the
disc in orange. The disc then hides whatever it covers, so wherever the disc overlaps the field or
the block you must **pick a colour by eye** for what the two inks together should look like. Give
the mark a dark colour you pick the same way. Then imitate a registration miss: draw a thin
orange stroke along one side of the mark.

<details>
<summary>After writing yours: one way to write it</summary>

```js
function drawArt(t) {
  const disc = () => { ctx.beginPath(); ctx.arc(640, 410, 200, 0, Math.PI * 2); };
  const mark = () => { ctx.beginPath(); ctx.arc(860, 650, 56, 0, Math.PI * 2); };
  ctx.fillStyle = INK.blue;
  ctx.globalAlpha = 0.45; ctx.fillRect(140, 120, 480, 580);     // field
  ctx.globalAlpha = 1;    ctx.fillRect(380, 260, 240, 300);     // block
  const ramp = ctx.createLinearGradient(140, 0, 940, 0);        // strip
  ramp.addColorStop(0, 'rgba(0, 120, 191, 0)');                 // INK.blue, transparent
  ramp.addColorStop(1, 'rgba(0, 120, 191, 1)');                 // INK.blue, opaque
  ctx.fillStyle = ramp; ctx.fillRect(140, 780, 800, 100);
  ctx.fillStyle = INK.orange; disc(); ctx.fill();               // disc: hides what it covers,
  ctx.save(); disc(); ctx.clip();                               // so each overlap gets a colour
  ctx.fillStyle = '#8a6a6a'; ctx.fillRect(140, 120, 480, 580);  // picked by eye
  ctx.fillStyle = '#2e2a3a'; ctx.fillRect(380, 260, 240, 300);
  ctx.restore();
  ctx.fillStyle = '#2e2a3a'; mark(); ctx.fill();                // mark
  ctx.strokeStyle = INK.orange; ctx.lineWidth = 3;              // a drawn "registration" fringe
  ctx.beginPath(); ctx.arc(860, 652, 56, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
}
```
</details>

Export it, and also take a reduced screenshot, the kind of view a contact sheet or a chat
thumbnail gives:

```sh
node still.mjs $PART/work/rgb/index.html --at 0 --out $OUT/rgb.png
node shoot.mjs $PART/work/rgb/index.html --times 0 --size 360 --engine firefox --out $OUT/rgb-at-360
```

At 360 px it looks like a clean flat-colour print. Now crop it:

```sh
crop $OUT/rgb.png 200 200 $OUT/rgb-field.png
crop $OUT/rgb.png 480 340 $OUT/rgb-overlap.png
crop $OUT/rgb.png 800 590 $OUT/rgb-mark.png
```

Open `work/rgb/index.html` in Firefox, paste `measure` into the console, and measure the field:
`measure(180, 200, 160, 160)`. `inked` is 1. Every pixel of the "45% tone" differs from the paper:
there is no paper in it, only a paler colour.

Write down answers to these, and keep them. The rest of the Part answers them properly.

- Pick one pixel of the overlap dark. Which inks printed it?
- If you swapped the orange for pink, what colour would the overlap become? How would you find out?
- Where is the paper under the block and the disc?
- Why is the fringe on that side of the mark, and why is it 3 px wide?

In this version every answer is "because I chose it". The dark is a colour you picked, not
something two inks produced. Each new overlap would need another hand-picked colour, and nothing
connects the fringe to the inks. If you know blend modes you may have thought of `multiply` for
the overlaps. That is half of the answer, and the model below uses it. A multiplied smooth fill
still has no dots, no paper between them, and no reason to miss.

## 4. How the press makes a picture, and how the code imitates it

A risograph prints one ink at a time. For each ink, the machine burns a stencil (the *master*)
and pushes ink through it onto the paper. At every point the stencil is either open or closed:
there is no half-open. To print a mid-tone, the image is first **screened**, turned into dots on
a regular grid, with bigger dots where the tone should be darker. Paper shows between the dots,
and that uncovered paper is what makes the tone lighter. Each ink has its own drum, stencil and
screen, and the screens are rotated to different angles. Riso inks are translucent, so a second
ink over the first darkens it the way two coloured gels do. Each drum also lands a little out of
line with the others. None of this is decoration. These are things the press cannot help doing,
and they are why the result reads as print.

The repository imitates this in a few steps. The first paragraph of
[`.claude/rules/riso-plates.md`](../../../../.claude/rules/riso-plates.md) says it in one
sentence:

> A scene is drawn once per ink into a coverage layer, screened into halftone dots, tinted, and
> multiplied onto the paper; alpha is tone, so `tone(g, 0.4)` means a 40% dot screen.

| On the press | In the code |
|---|---|
| a stencil for one ink | a **plate**: a canvas for one ink, on which shapes are drawn in black and only their **alpha** matters. Alpha is *coverage*: how much of the stencil is open there. |
| screening | `screenCoverage(cover, ink)`: each pixel's coverage is compared with that ink's threshold tile; the pixel becomes fully inked or fully bare |
| the ink's colour | *tinting*: the surviving dots are recoloured with `INK[ink]` |
| translucent ink on paper | the tinted plate is drawn onto the page with `multiply` |
| each drum's miss | the plate is drawn shifted by that ink's `REG` offset |
| the paper | `bakePaper()`, the cream sheet every frame starts from |

Read the brief's version, the *Print system* bullets in
[`docs/brief.md`](../../../../docs/brief.md#print-system). Then read the engine itself. Your scaffold
contains a copy, but read the donor, [`prints/workings/index.html`](../../../../prints/workings/index.html).
Its header comment (the first block inside `<script>`) explains why a still can do things a film
cannot. Then find:

- `const SCREEN` and its comment: one angle per ink, written as a ratio;
- `const REG`: one fixed offset per ink, in device pixels;
- `/* ── halftone screens` and the function `screenCoverage` below `buildScreen`.

You do not need `buildScreen`'s lattice maths. Its job is to make, for each ink, a small square
**threshold tile**: for every pixel of the tile, the coverage at which that pixel starts to take
ink. Answer from `screenCoverage` and the comments around it:

1. `screenCoverage` reads one number per pixel from the coverage canvas. Which channel, and what
   does it write back?
2. Where in a tile is the threshold smallest, and what happens to a pixel's ink as coverage rises
   from 0 to 1? What, then, is a dot?
3. The tile is indexed by `x % sc.S` and `y % sc.S`, where `x` and `y` are pixel positions **on
   the page**. If you drew a rectangle 2 px further right, would its dots move 2 px with it?
4. `th` is clamped to at most 1, and a pixel takes ink only when coverage is **greater** than its
   threshold. Predict what a coverage of exactly 1 looks like at 1:1.

<details>
<summary>After answering: check yourself</summary>

1. Alpha (`s[i + 3]`). It writes alpha back as exactly 255 or 0: ink or no ink.
2. Smallest at the dot centres (the lattice points), rising with distance from them. As coverage
   rises, the set of pixels whose threshold it exceeds grows outward from each centre, so a dot
   is a patch that grows with coverage. Tone is dot size.
3. No. The tile belongs to the page, not to the shape: the rectangle's edge just cuts through a
   different set of dots. The comment calls this anchoring to canvas space. A screen that moved
   with its subject would make the texture crawl, which matters once things move (Parts 16–17).
4. The pixels furthest from any dot centre have a threshold of exactly 1, and 1 is not greater
   than 1, so they never take ink. A "solid" on one plate keeps a lattice of paper pinholes.
</details>

## 5. One plate, by hand

Generate the file you will experiment in:

```sh
node new-riso.mjs --kind still --out $PART/work/plates/index.html
```

Write a function `makePlate(ink, drawCoverage)` in the ART region. It returns the finished, tinted
plate for one ink:

1. make a blank canvas the size of the frame with the engine's `cv(OUT, OUT)`;
2. set its `fillStyle` to black and call `drawCoverage(g)` with its context. Shapes drawn there
   say where the ink goes and, through alpha, how much;
3. screen it with `screenCoverage(canvas, ink)`, which returns a new canvas of hard dots;
4. tint the dots: on the dots canvas set `globalCompositeOperation = 'source-in'`, which keeps
   only pixels that already have alpha, and fill the whole canvas with `INK[ink]`;
5. return the dots canvas.

Build the plate **once, at load**, as a top-level `const` in the ART region, not inside
`drawArt`. Screening visits all 1,166,400 pixels. A still never changes, so there is no reason to
do it per frame, and everything at top level runs before `ready` becomes `true`, the preparation
time Part 01 described. Computing a plate once, at the size it will be shown, and reusing it is
what the repository calls **baking**. `drawArt` only reads the finished plate and never writes to
it, so the Part 01 rule still holds: nothing carries from one frame to the next.

Start with the first ink only. `tone(g, a)` is the engine's one-line helper for "alpha is tone":
it sets `g.globalAlpha` to `a`, clamped to 0..1.

```js
const plates = {
  blue: makePlate('blue', g => {
    tone(g, 0.45); g.fillRect(140, 120, 480, 580);   // field
    tone(g, 1);    g.fillRect(380, 260, 240, 300);   // block
    const ramp = g.createLinearGradient(140, 0, 940, 0);
    ramp.addColorStop(0, 'rgba(0,0,0,0)');           // only alpha matters: coverage 0 ...
    ramp.addColorStop(1, 'rgba(0,0,0,1)');           // ... to coverage 1
    g.fillStyle = ramp; g.fillRect(140, 780, 800, 100); // strip
  }),
};

function drawArt(t) {
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  for (const ink in plates) ctx.drawImage(plates[ink], 0, 0);
  ctx.restore();
}
```

<details>
<summary>After writing yours: one way to write <code>makePlate</code></summary>

```js
function makePlate(ink, drawCoverage) {
  const cover = cv(OUT, OUT), g = cover.getContext('2d');
  g.fillStyle = '#000';                       // colour is ignored: only alpha is read
  drawCoverage(g);
  const dots = screenCoverage(cover, ink);    // every pixel now ink (alpha 255) or none (0)
  const d = dots.getContext('2d');
  d.globalCompositeOperation = 'source-in';   // keep the dots, replace their colour
  d.fillStyle = INK[ink];
  d.fillRect(0, 0, OUT, OUT);
  return dots;
}
```

It can go anywhere in the ART region: `const plates` calls it at load, and a function
declaration is hoisted, so it is available throughout its script.
</details>

Before exporting, write down what you expect to see at 1:1 in the field, in the block, and along
the strip. Then:

```sh
node still.mjs $PART/work/plates/index.html --at 0 --out $OUT/plates.png
crop $OUT/plates.png 200 200 $OUT/plates-field.png
crop $OUT/plates.png 330 350 $OUT/plates-block.png
crop $OUT/plates.png 160 780 $OUT/plates-strip-left.png
crop $OUT/plates.png 480 780 $OUT/plates-strip-mid.png
crop $OUT/plates.png 820 780 $OUT/plates-strip-right.png
```

And in the console on `work/plates/index.html`:

```js
measure(180, 200, 160, 160)   // field
measure(390, 280, 40, 260)    // block
measure(180, 800, 40, 60)     // strip, near the left end
measure(520, 800, 40, 60)     // strip, middle
measure(860, 800, 40, 60)     // strip, near the right end
```

<details>
<summary>After you have looked: what you should be seeing</summary>

- **Field.** Blue dots on a regular lattice tilted a little from horizontal, with paper between
  them. `inked` is about 0.45. The 0.45 you gave `tone` became the share of pixels that got ink:
  alpha became tone. At this pitch a "dot" is a cluster of a few pixels, so do not expect circles.
- **Block.** Blue with a regular lattice of tiny paper pinholes. `inked` is about 0.92: a single
  plate at full coverage leaves roughly 8% of the paper bare, as you predicted from the clamp. The
  crop also takes in a strip of the field to the left, so you can compare the two.
- **Strip.** Tiny dots at the left, touching dots at the right, the same lattice throughout.
  `inked` follows the position along the strip (about 0.08, 0.5 and 0.87; near the right end the
  dots merge into a solid, which cannot pass the block's 0.92). Tone is dot size.
</details>

Two more facts to take from these pixels:

**The paper is in every colour.** In the console, read one pixel in the middle of a dot or of the
block: `ctx.getImageData(400, 400, 1, 1).data` (if it lands on a pinhole, move a pixel). You will
not get `INK.blue`, which is `0, 120, 191`. You get roughly `0, 111, 170`: the ink multiplied by
the cream under it. Warm paper is not a background behind the image. It tints every ink printed
on it, and it is the light in every mid-tone.

**Pitch and angle belong to the ink.** In the console, `screenOf('blue')` returns the ink's
screen. `S` is the tile size (19 px) and `P` the dot pitch (about 4.61 px). `SCREEN.blue` is
`{a: 4, b: 1}`, an angle of atan(1/4) ≈ 14°. Check both in `plates-field.png`: follow one row of
dots across the crop, count them, and see that the row slopes about one pixel down for every four
across. The brief asks for "~4–5 px pitch at 1080 with distinct angles"; this is that, per ink.

## 6. Tone by dot size, or tone by opacity

The strip became lighter by making the dots smaller. There is a second way to make a screened
ink lighter, which looks equally reasonable and is what a normal graphics program does: screen it
flat, then fade it with opacity. Add it to the plates file, as a second strip directly under the
first, so the two can be compared:

```js
function leftToRight(g, a0, a1) {                   // an alpha gradient across the strips
  const grd = g.createLinearGradient(140, 0, 940, 0);
  grd.addColorStop(0, `rgba(0,0,0,${a0})`);
  grd.addColorStop(1, `rgba(0,0,0,${a1})`);
  return grd;
}
// A solid, screened plate, made lighter afterwards by opacity.
const faded = makePlate('blue', g => { tone(g, 1); g.fillRect(140, 900, 800, 100); });
{
  const f = faded.getContext('2d');
  f.globalCompositeOperation = 'destination-in';   // keep each pixel, scaled by the gradient's alpha
  f.fillStyle = leftToRight(f, 0, 1);
  f.fillRect(0, 0, OUT, OUT);
}
```

and in `drawArt`, after the loop: `ctx.drawImage(faded, 0, 0);`.

Both strips now go from paper on the left to solid blue on the right. **Predict** which one you
could tell apart from the other at 360 px, and at 1:1. Then:

```sh
node still.mjs $PART/work/plates/index.html --at 0 --out $OUT/plates.png
node shoot.mjs $PART/work/plates/index.html --times 0 --size 360 --engine firefox --out $OUT/plates-at-360
crop $OUT/plates.png 480 820 $OUT/strips-mid.png
crop $OUT/plates.png 200 820 $OUT/strips-left.png
```

Each crop holds the bottom of the dot-size strip, a band of paper, and the top of the faded
strip at the same x. Measure both strips at the same place:
`measure(520, 800, 40, 60)` and `measure(520, 920, 40, 60)`.

<details>
<summary>After you have looked: what you should be seeing</summary>

At 360 px both are gradients; the faded one only looks a little smoother. The two measurements
have almost the same `lightness` (about 162 and 166) and very different `inked` (about 0.49 and
0.92). In the crops, the upper strip is full-strength blue dots with bare paper between. The lower
strip is pale blue nearly everywhere, with the solid's pinhole lattice in it, and it gets paler
toward the left without its dots ever getting smaller.
</details>

The two strips have the same average and are made of different things. In the dot-size strip,
every pixel holds either full ink or bare paper, and the tone is how many pixels have ink. That is
what a press can do. In the faded strip, the tone is how strong the ink is, and a press cannot
print weak ink: ink comes out of the stencil at full strength or not at all. The faded strip is
translucent digital paint laid over a dot pattern. `docs/drawing.md`, in
[*Tone that prints*](../../../../docs/drawing.md#tone-that-prints), calls the other one "the
signature riso gesture": "`screenCoverage` thresholds per pixel, so a canvas gradient in a plate
becomes a dot-size ramp". Part 16 meets the faded strip's failure again, in moving elements,
where it is harder to avoid.

The repository's own A/B of this is the ramp study, study 2 of `studies/index.html` (each study is
one second of that file):

```sh
node still.mjs ../studies/index.html --at 2 --out $OUT/ramp-study.png
crop $OUT/ramp-study.png 100 60  $OUT/ramp-study-left-sky.png
crop $OUT/ramp-study.png 560 60  $OUT/ramp-study-right-sky.png
crop $OUT/ramp-study.png 700 780 $OUT/ramp-study-right-ground-top.png
crop $OUT/ramp-study.png 700 950 $OUT/ramp-study-right-ground-low.png
```

The left half is flat screens and the right half is coverage gradients. In the source, find
`scene('ramp'` and read only the `blue` branch: `print(g, skyL, 0.45)` against
`shade(g, skyR, {… stops …})`, and ignore the `cut: true` call after them, which belongs to
Part 03. `print` and `shade` are craft-kit helpers you meet properly in
Parts 05–06. For now read `print` as "fill at a flat alpha" and `shade` as "fill with an alpha
gradient", which is your strip with a wrapper. Notice also that the left half's sun is brown:
orange printed over blue. Section 7 explains the brown. How the right half's sun avoids it is
Part 03.

## 7. The second ink: overprint and the dark

Now add the second ink and the mark. The mark is printed on **both** plates: that is what will
make it dark. Define it once, above `const plates`, so both plates draw the identical circle:

```js
const mark = g => { g.beginPath(); g.arc(860, 650, 56, 0, Math.PI * 2); g.fill(); };
```

Call `mark(g)` in the blue plate, **before** the strip. After the strip, `fillStyle` is still
the gradient, so a later fill would take the gradient's alpha instead of the solid `tone` you
meant. Then add the orange plate:

```js
  orange: makePlate('orange', g => {
    tone(g, 1); g.beginPath(); g.arc(640, 410, 200, 0, Math.PI * 2); g.fill();   // disc
    mark(g);
  }),
```

`drawArt` needs no change: it already multiplies every plate in `plates`. Before exporting,
predict the colour of the block where the disc crosses it, and whether the pinholes will survive.

```sh
node still.mjs $PART/work/plates/index.html --at 0 --out $OUT/plates.png
crop $OUT/plates.png 480 340 $OUT/plates-overlap.png
crop $OUT/plates.png 800 590 $OUT/plates-mark.png
```

Measure, in the console: paper `measure(900, 200, 100, 100)`, orange alone
`measure(700, 300, 80, 80)`, blue alone (the block, left of the disc) `measure(390, 280, 40, 260)`,
both `measure(480, 320, 120, 180)` and the mark `measure(830, 620, 60, 60)`.

<details>
<summary>After you have looked: what you should be seeing</summary>

Lightness: paper about 232, orange alone about 145, blue alone about 101, and where both print
about 54, the darkest thing in the frame. (Orange alone has `inked` about 0.8: how much paper a
solid leaves bare depends on the ink's screen, and orange's leaves more than blue's.) The overlap is a deep green-black: blue multiplied by
orange. In the crop it is not uniform. It is dark, speckled with blue where orange left a pinhole,
with orange where blue did, and with a few bare paper pixels where both pinholes fell on the same
spot. The mark looks the same.
</details>

The colour of the overlap was not chosen by you. It is the product of the two inks and the paper,
and swapping orange for another ink would change it without further decisions. That answers the
first two questions you wrote down in section 3.

**Try to make that dark with one ink.** Two experiments:

1. In the blue plate, draw the block three times: `for (let i = 0; i < 3; i++) g.fillRect(380, 260, 240, 300);`.
   Export and measure the block. Nothing changes. Coverage says how much of the stencil is open,
   and at 1 it is already fully open; alpha cannot go above 1. Put the block back to one fill.
2. Use the darkest ink the repository has, indigo, as a temporary third plate on empty paper,
   and put orange over half of it:

   ```js
   plates.indigo = makePlate('indigo', g => { tone(g, 1); g.fillRect(860, 40, 120, 120); });
   ```

   (after the `plates` object), and in the orange plate add `g.fillRect(920, 40, 60, 120);`.
   Measure indigo alone `measure(870, 50, 40, 100)` and indigo with orange
   `measure(930, 50, 40, 100)`.

<details>
<summary>After measuring: what you should be seeing</summary>

Three fills print the same as one. Indigo alone is about 65, the darkest a single plate gets;
indigo under orange is about 40. For comparison, blue alone is about 101 and blue under orange
about 54.
</details>

A single ink can never be darker than that ink printed solid, and with the pinholes it is always
a little lighter. Under another ink the darkness multiplies, and because the two screens sit at
different angles, one plate's pinholes mostly land on the other's ink. Read the second paragraph
of [*Value first*](../../../../docs/drawing.md#value-first) in `docs/drawing.md`: "one plate can't
print a true solid, two can." Its figures were measured per pixel, a different method from your
region averages, so do not expect your numbers to match; the order is the same.

This is why the repository has no black. `CLAUDE.md`'s invariants say "No pure black ink. Darks
are overprints". In this model a `#000` would be an extra ink the press does not have: multiplied
by black, every pixel is black whatever lies under it, so it erases the other inks and the paper,
and it brings no screen of its own. The hand-picked dark in your RGB version was the same move in
disguise: a colour that no combination of your plates produced. With overprints, choosing inks
means choosing your darks. Blue and orange make a green-black, indigo and orange a warmer one. The
Window Seat glass reached a lightness of about 4 by stacking several inks, and still has no black
pixel.

**Screen angles.** Look at `plates-overlap.png` again. The blue lattice (14°) and the orange
lattice (26.6°) cross at different angles, which is why their gaps rarely coincide. `SCREEN` gives
`green` and `indigo` the same angle, 45°. Optionally, test the prediction: a copy of this file
with green and indigo in place of blue and orange (registration is still off at this point) leaves
the overlap about 8% bare paper (`inked` about 0.92) instead of about 1.5%, because the two
plates' pinholes land in the same places. The brief's "distinct angles" is not a style note: two
screens at one angle stack dots on dots and gaps on gaps.

Delete both halves of the indigo experiment (the indigo plate and the orange rectangle) before
moving on. It is not part of the arrangement.

## 8. Registration

So far every plate is printed exactly on the page. Add the misses. At the top of the ART region:

```js
const SHOW_REG = true;
```

and in `drawArt`, draw each plate at its ink's offset from the engine's `REG` table:

```js
  for (const ink in plates) {
    const [dx, dy] = SHOW_REG ? REG[ink] : [0, 0];
    ctx.drawImage(plates[ink], dx, dy);
  }
```

`REG.blue` is `[1.5, -1]` and `REG.orange` is `[1, 2]`. **Predict**: relative to orange, which
way is blue now shifted, and by how much? Where on the mark's edge will each ink show on its own?
Then:

```sh
node still.mjs $PART/work/plates/index.html --at 0 --out $OUT/plates-reg.png
crop $OUT/plates-reg.png 800 590 $OUT/plates-reg-mark.png
```

Compare it with `plates-mark.png` (no registration) and `rgb-mark.png` (the drawn fringe).

<details>
<summary>After you have looked: what you should be seeing</summary>

Blue sits 3 px higher than orange (and half a pixel to the right). A blue-only crescent escapes
along the top of the mark, and an orange-only crescent along the bottom. Each is widest where the
edge faces the direction of the shift and fades to nothing where the edge runs along it.
</details>

Write down every difference you can see between the registration crescents and your RGB fringe.
Three matter:

- The fringe is an **extra mark** you drew. Registration adds nothing: the two inks that make the
  dark have simply separated, so each shows alone on one side.
- The fringe belongs to a **shape**, and you would have to draw one for every shape and choose a
  side each time. The offset belongs to the **plate**: every contour the two inks share shows the
  same miss in the same direction, and no shape has to do anything.
- The fringe has a fixed width. The crescents' width follows the geometry of the contour and the
  offset.

This is what `docs/brief.md` means by "Fix each ink's 1–3 px registration offset per scene; the
subject's own contours reveal it", and what *The reference* in `docs/quality-bar.md` calls a
crescent "escaping" a small contour. Contours printed by only one ink, such as the disc against
paper, show nothing, because there is nothing to misalign with. The mark is in the arrangement to
give the miss a shared contour.

Two side effects to notice before moving on. First, `REG.blue` has a half pixel in it. Drawing a
canvas at a fractional position makes the browser blend each pixel with its neighbour, so blue
dots gain soft, in-between edge pixels (look closely at `plates-reg-mark.png`). The plate moves,
but its pitch does not change, and section 9 shows what happens when it does. Second, measure the
field again: `lightness` is unchanged, while `inked` has jumped from about 0.45 to about 0.6,
because those blended edge pixels now count as inked. Pixel counts are fragile. Averages are
robust. That is why you measured coverage before adding registration.

**Why fixed?** Make a copy in which the misses change every frame, as though each impression
landed somewhere new:

```sh
mkdir -p $PART/work/jitter
cp $PART/work/plates/index.html $PART/work/jitter/index.html
```

In `work/jitter/index.html`, replace the `const [dx, dy] = …` line with offsets that depend on
the frame. They are computed from `t`, so the work stays exact (Part 04 explains why
`Math.random()` would not be allowed here):

```js
    const f = Math.round(t * 30), k = ink.length;   // frame number, and a different phase per ink
    const dx = REG[ink][0] + 2 * Math.sin(f * 7.1 + k), dy = REG[ink][1] + 2 * Math.cos(f * 5.3 + k);
```

The file's duration is 1 s, so it renders as 30 frames:

```sh
node verify.mjs $PART/work/jitter/index.html
node render.mjs $PART/work/jitter/index.html --engine firefox --out $OUT/jitter.mp4
node shoot.mjs  $PART/work/jitter/index.html --range 0.4:0.4666667:0.0333333333 --engine firefox --out $OUT/jitter-strip
```

Watch the MP4 in a video player set to loop. Then crop the mark from each of the three
consecutive frames in `jitter-strip/` and put them side by side.

<details>
<summary>After watching: what you should be seeing</summary>

`verify.mjs` passes: every frame is exactly reproducible. The film shimmers anyway. The crescents
swing round the mark from frame to frame, and the pinholes in the overlap rearrange every frame,
because the two screens slide against each other. Even the field, one ink alone, crawls, because
its dots move on the page. Paper does not do that.
</details>

Keep this result. It is the same lesson as Part 01 from the other side: `verify.mjs` establishes
that each frame is exact, not that the sequence of frames looks like anything you want.

## 9. The repository's version: `scene` and `bakeScene`

You have built the model by hand. The repository packages the same steps once, so that works
describe *what* each ink prints and the engine does the rest. Read, in
`prints/workings/index.html`:

- `/* ── scene registry`: `scene(id, def)` stores a definition in `SCENES`;
- `function bakeScene` and the comment above it;
- `function starve`, right after it.

Then match every line of `bakeScene` to your `makePlate` and `drawArt`. You will find your five
steps, `REG` and `multiply`, and these differences:

1. **One function draws every ink.** A scene is `{ inks: [...], plates(g, ink) { … } }`, and
   `bakeScene` calls `plates` once per ink on one cleared coverage canvas. Your plate functions
   become branches: `if (ink === 'blue') { … }`.
2. **Two more arguments.** `plates` is actually called as `plates(g, ink, rng, sr)`. Both are
   seeded random-number generators, which Parts 03–04 need and explain. A function written
   `plates(g, ink)` simply ignores them.
3. **Starvation.** After your drawing, `starve` knocks random pale flecks out of every plate,
   because perfectly even solids look laser-printed. It is texture, which Part 08 treats as the
   last layer of a picture. Here it is simply something to recognise, so you do not mistake it for
   screen pinholes.
4. **White first, then paper.** Plates are multiplied onto an opaque white canvas, and that one
   bitmap is later multiplied over paper. The result is the same, since multiplying by white
   changes nothing and the order of multiplications does not matter, and a whole scene becomes a
   single bitmap.
5. **Baked once, at a size.** The result is cached under `id@size`. Your scaffold bakes every
   registered scene before `ready` (search for `bakeScene(id,OUT)`) and draws one with
   `paintBaked(id)` (search for `function paintBaked`).

Now rebuild the arrangement that way, as the Part's deliverable:

```sh
node new-riso.mjs --kind still --out $PART/work/still/index.html
```

Write one `scene('arrangement', { inks: ['blue', 'orange'], plates(g, ink) { … } })` holding
your blue and orange drawing as two branches, and make `drawArt` a single call to
`paintBaked('arrangement')`. Leave the faded strip, the jitter and the indigo test behind: those
were experiments.

<details>
<summary>After writing yours: one way to write it</summary>

```js
scene('arrangement', {
  inks: ['blue', 'orange'],
  plates(g, ink) {
    const mark = () => { g.beginPath(); g.arc(860, 650, 56, 0, Math.PI * 2); g.fill(); };
    if (ink === 'blue') {
      tone(g, 0.45); g.fillRect(140, 120, 480, 580);   // field
      tone(g, 1);    g.fillRect(380, 260, 240, 300);   // block
      mark();
      const ramp = g.createLinearGradient(140, 0, 940, 0);
      ramp.addColorStop(0, 'rgba(0,0,0,0)');
      ramp.addColorStop(1, 'rgba(0,0,0,1)');
      g.fillStyle = ramp; g.fillRect(140, 780, 800, 100); // strip, last
    }
    if (ink === 'orange') {
      tone(g, 1); g.beginPath(); g.arc(640, 410, 200, 0, Math.PI * 2); g.fill();   // disc
      mark();
    }
  },
});

function drawArt(t) {
  paintBaked('arrangement');
}
```
</details>

Export it and compare it with your hand-built version with registration on. A difference image is
black wherever the two agree:

```sh
node still.mjs $PART/work/still/index.html --at 0 --out $OUT/still.png
"$FFMPEG" -loglevel error -y -i $OUT/plates-reg.png -i $OUT/still.png -filter_complex "blend=all_mode=difference" $OUT/hand-vs-engine.png
```

Apart from the faded strip, which only the plates file has, the difference should be black except
for scattered specks: the flecks `starve` removed, about 4% of the pixels above the faded strip.
If whole shapes show up instead, your two versions draw different coverage. A common cause is the
`fillStyle` trap from section 7.

### Compare with the reference

Now open [`project/index.html`](project/index.html). It is a freshly generated `--kind still`
scaffold whose ART region holds the scene above, exactly as this lesson gives it, and nothing
else. Compare your deliverable with it, pixel by pixel:

```sh
node still.mjs $PART/project/index.html --at 0 --out $OUT/project.png
"$FFMPEG" -loglevel error -y -i $OUT/still.png -i $OUT/project.png -filter_complex "blend=all_mode=difference" $OUT/still-vs-project.png
```

If you kept the suggested arrangement and named your scene `arrangement`, the difference is black
everywhere: same coverage, same engine, same pixels. With another scene name, only the starvation
flecks move, because the engine seeds them from the name (Part 04 explains how a name can do
that). If you moved or resized parts of the arrangement, differences there are expected. Anywhere
else, a difference means your plates draw something the example's do not, and it is worth finding
out which.

### Baked at the size it is shown

Every plate so far was screened at 1080 and drawn at 1080.
The screen's pitch is defined in device pixels (`PITCH` is 4.6 at 1080), and `bakeScene`'s
comment explains why the bake happens at display size: "Resampling a halftoned bitmap beats the dot
grid against the pixel grid and moirés". See it. In the plates file, change the declaration to
`const SHOW_REG = true, SCALE = 1.03;` and draw each plate enlarged by 3%:
`ctx.drawImage(plates[ink], dx, dy, OUT * SCALE, OUT * SCALE)`.

```sh
node still.mjs $PART/work/plates/index.html --at 0 --out $OUT/plates-scaled.png
crop $OUT/plates-scaled.png 200 180 $OUT/plates-scaled-field.png
crop $OUT/plates-reg.png    200 180 $OUT/plates-reg-field.png
```

<details>
<summary>After you have looked: what you should be seeing</summary>

In the scaled field, bands of crisp dots alternate with bands of blurred, doubled dots, about 33 px
apart (1 / 0.03). Every so often the enlarged dot grid falls back into step with the pixel grid,
and in between it falls out of step.
</details>

That is `CLAUDE.md`'s "Never resize a screened bitmap: it causes moiré", and the reason Part 01's
backing store is fixed: the dots are backing-store pixels. If something must be bigger, draw its
coverage bigger and screen it at its final size, and the dots stay 4.6 px apart. Set `SCALE` back
to 1.

## 10. Inspect your still

`work/still/` is the deliverable. Before inspecting it, check that it still has everything: bare
paper; one ink at a flat mid-tone; a coverage gradient; each ink solid on its own somewhere; an
overprint dark made by printing one shape on both plates; and a registration miss visible where
the two plates share a contour. You may add a third ink if you want one: add its name to `inks`,
give it a branch, and choose an ink whose angle in `SCREEN` differs from the other two. Keep the
arrangement simple enough that you can still say what each plate contributes to each region.

Confirm the contract and export:

```sh
node verify.mjs $PART/work/still/index.html --times 0
node still.mjs  $PART/work/still/index.html --at 0 --out $OUT/still.png
node shoot.mjs  $PART/work/still/index.html --times 0 --size 360 --engine firefox --out $OUT/still-at-360
```

The bake runs before `ready`, so the contract holds just as it did for Part 01's disc. That tells
you nothing about the print. The print questions are answered by pixels. Choose four crops of
`still.png` yourself (you know where everything is), one for each of:

1. **paper gaps**: a mid-tone, where you can see paper between dots;
2. **dot pitch and angle**: somewhere you can count dots along a row;
3. **ink overlap**: an overprint, where you can see which ink fills which other ink's pinholes;
4. **registration**: the shared contour where the plates separate.

In `NOTES.md`, give each crop a short entry: its coordinates, what you see, which plate or plates
each kind of pixel in it belongs to, and any measurement you took. When you cannot tell which ink
a pixel belongs to, **isolate the plate**: set `inks: ['blue']` for a moment, re-export and crop
the same place, then put it back. Separating plates is part of the repository's evidence for print
questions, listed in the *Print* row of the review table at the end of `docs/quality-bar.md`.

Then open `still-at-360/t_000.000.png` and try to find the same four things. Look at the field:
the reduced view shows a pattern, but count its spacing and direction and compare them with the
real screen. It is not your dots. A reduced image is a new raster made from your pixels, and fine
periodic detail comes out as a false pattern. Part 08 deals with that properly. For now the rule
from Part 01 extends: questions about dots, gaps, overlap and registration are settled on the
native PNG at 1:1, never on a reduced view.

Last, be precise about what this evidence is. In the review table's terms it is **print**
evidence: native PNG, 1:1 crops and plate isolation. The same table says what print evidence
cannot establish: "That the drawing is good". Your arrangement is a test pattern, and a perfect
print of it is still a test pattern.

## 11. Decisions you should be able to defend

In your notes, give for each choice a situation where you would choose the alternative.

**Coverage screened into dots, rather than smooth-opacity colour layers.** The problem is that a
print makes tone by uncovering paper, not by weakening ink. Coverage screened into dots produces
changing dot size and paper gaps, and every pixel stays within what a press can print. You saw
the alternative in the faded strip: the same average lightness, made of pale ink. Smooth opacity
is the better choice when the medium you want is translucent digital paint, such as a watercolour
wash, glazing or a UI shadow, where the image is not pretending to have been printed.

**Overprint darks rather than `#000`.** The problem is that a dark must stay inside the print
logic. An overprint keeps its hue from the inks, keeps other inks' dots visible in it, and keeps
the paper's light in its pinholes. A black fill does none of that. You measured that one plate
cannot go below its own ink, however often you print it. Pure black is the better choice when the
visual language really includes a separate black plate or digital black, for example a
four-colour print with a key plate, or a graphic style built on black line. This repository's
medium has neither.

**Fixed registration offsets rather than per-frame misregistration.** The problem is that a miss
must read as a property of a printed sheet. A fixed offset per ink does, because every shared
contour shows the same miss and the sheet never changes. You saw per-frame offsets make an exact,
verifiable film shimmer. Changing offsets are the better choice when instability is the point:
glitch, vibration, an image that is deliberately coming apart. They give up this repository's
illusion of a still print.

## Before you move on

You should have, in `work/`:

- [ ] `rgb/index.html`: the flat RGB arrangement, with hand-picked overlap colours and a drawn fringe.
- [ ] `plates/index.html`: `makePlate`, the two inks, the faded strip, `SHOW_REG` and `SCALE` (back at 1).
- [ ] `jitter/index.html`: per-frame offsets; `verify.mjs` passes and the MP4 shimmers.
- [ ] `still/index.html`: the arrangement as one `scene`, drawn with `paintBaked`; `verify.mjs --times 0`
  passes, and every difference from `project/index.html` is one you can explain.
- [ ] `NOTES.md`: the poster answers; your section 3 questions and their answers; predictions and
  what happened; the measurements; the four labelled crops of `still.png`; the three decisions.

And in `out/course/02/` (regenerable): the native PNGs, the crops, the 360 px captures, the two
difference images, `jitter.mp4` and its strip.

You should be able to explain, without looking:

- what coverage, screening, tinting and multiply each contribute to one printed pixel;
- why 45% alpha on a plate becomes about 45% of pixels inked, and why that differs from 45% opacity;
- why a solid on one plate still shows paper, and why two plates at different angles close it;
- why the darkest thing in a frame has to be an overprint, and what decides its colour;
- why registration is a property of a plate, and why it is fixed;
- why a screened plate is baked at the size it is shown and never rescaled.

The sentence to carry forward: **a riso frame is assembled from ink decisions, not coloured
pixels; the screen and the paper are structural parts of the image.**

## Deliberately left for later

- **Knockouts** (Part 03). Every ink you have printed only ever darkens what is below it, so a
  light subject cannot sit on a dark ground yet. The ramp study's right-hand sun shows the answer.
- **Shared geometry and seeded randomness across plates** (Parts 03–04). The mark agrees on both
  plates because both draw the same literal circle. `plates`' `rng` and `sr` arguments, and why
  their order matters, come next.
- **The craft kit** (`print`, `carve`, `plane`, `shade` and the rest; Parts 03, 05 and 06). You
  used only `tone` and plain Canvas.
- **Value and form** (Part 06): which tones a picture should use, and why tones drawn on top of
  each other on one plate add up.
- **Texture** (Part 08): starvation, grain and hatching as deliberate finish; the screen's fine
  quantisation; why reduced views invent patterns.
- **Moving tone and moving screens** (Parts 16–17). Everything here was baked for a still; how a
  moving element keeps dot-size tone, and how whole moving frames are screened, come much later.
- **Choosing inks for a subject** (Parts 06–09). Blue and orange were chosen to make the plate
  mechanics easy to see, not as a palette.
