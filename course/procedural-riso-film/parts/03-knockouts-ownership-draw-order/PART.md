# Part 03 — Knockouts, Ownership, and Draw Order

Every ink you printed in Part 02 could only darken what was under it. A plate adds coverage and
the page multiplies it in, so nothing you print can make a pixel lighter. That was fine for a test
pattern on bare paper. It stops being fine the moment a picture needs something bright on
something dark: a lamp at night, a white bird against a storm, a glowing animal in deep water. A
light ink printed over a dark ground does not look light. It looks dirty.

The repository's answer is to take ink away before the bright thing prints: a **knockout**. This
Part is about doing that correctly, and about the fact that doing it correctly depends almost
entirely on **order**: which plate you clear, at what coverage, before or after what, and whether
the shape you clear is exactly the shape you print.

You will build one small picture, a glowing jellyfish in a night sea, and you will build it wrong
five different ways on the way to building it right. Each wrong version is kept, because the
point is not to remember the rules but to recognise, from pixels, which rule was broken.

**You will make**

- `work/jelly/`: the jellyfish, three plates (blue, pink, yellow), corrected step by step. This is
  the Part's deliverable, with its native PNG and 1:1 crops.
- `work/faults/`: five snapshots of the wrong versions, `muddy.html`, `toned.html`,
  `one-plate.html`, `late-ramp.html` and `seed.html`, kept so any failure can be re-exported and
  compared with the corrected picture at the same pixels.
- `work/NOTES.md`: predictions, measurements, the evidence table for the failures, the gather
  reading, and the three decisions.

**Supplied:** a block of shape code in section 3 (the jellyfish, some marine snow, and two alpha
ramps). Drawing a convincing subject is Part 05's problem. Here the subject is given, so that
everything you write is plate logic.

**Reference:** [`project/index.html`](project/index.html) is the corrected jellyfish, a
self-contained still made with the same scaffold and verified with the same tools. It is the
answer to this Part's exercise, so do not open it until section 7 tells you to. It is a snapshot:
later Parts never change it.

---

## 1. Setup

Work from `tools/` with the Part's variables, the bundled ffmpeg and the output folder:

```sh
cd tools
PART=../course/procedural-riso-film/parts/03-knockouts-ownership-draw-order
OUT=../out/course/03
FFMPEG=$(node -p "require('ffmpeg-static')")
mkdir -p $OUT
```

Define the 1:1 crop from Part 02 again (it lasted only for that terminal session):

```sh
crop() { "$FFMPEG" -loglevel error -y -i "$1" -vf "crop=120:120:$2:$3,scale=480:480:flags=neighbor" "$4"; }
```

`crop in.png X Y out.png` cuts 120 × 120 native pixels at (X, Y) and enlarges them four times
without smoothing. Open crops at 100%.

You will also use Part 02's `measure(x, y, w, h)` in Firefox's console, pasted once per page
load. It is repeated here so you do not have to look it up:

```js
function measure(x, y, w, h) {
  const page = ctx.getImageData(x, y, w, h).data;
  const bare = paper.getContext('2d').getImageData(x, y, w, h).data;
  let inked = 0, light = 0;
  for (let i = 0; i < page.length; i += 4) {
    const [r, g, b] = [page[i], page[i + 1], page[i + 2]];
    if (Math.max(Math.abs(r - bare[i]), Math.abs(g - bare[i + 1]), Math.abs(b - bare[i + 2])) > 16) inked++;
    light += 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  return { inked: +(inked / (w * h)).toFixed(3), lightness: Math.round(light / (w * h)) };
}
```

In this Part, read `lightness` first. Part 02 showed that registration's half-pixel offsets
blur dot edges, and a baked scene always applies registration, so `inked` counts those blurred
pixels too and comes out higher than the coverage you drew. `lightness` is an average and does
not care. `inked` is still reliable at the two extremes: 0 means bare paper, and 1 means no paper
at all.

## 2. The fault, in the repository's words

Read the *Knockouts* bullets in
[`.claude/rules/riso-plates.md`](../../../../.claude/rules/riso-plates.md#knockouts). The first
one says:

> A bright element over a dark ground must clear that ground first with `destination-out`, or it
> prints muddy. This is the most common fault by far — it made fireworks olive and a hummingbird
> read as a leaf.

You have already seen it without being told what it was. In Part 02 you exported the ramp study
and noticed that its left-hand sun is brown. Export it again for this Part and crop both suns:

```sh
node still.mjs ../studies/index.html --at 2 --out $OUT/ramp-study.png
crop $OUT/ramp-study.png 210 372 $OUT/ramp-left-sun.png
crop $OUT/ramp-study.png 750 372 $OUT/ramp-right-sun.png
crop $OUT/ramp-study.png 700 330 $OUT/ramp-right-rim.png
```

Both suns are printed by the same orange plate at full coverage. Answer from the crops, in your
notes:

1. In the left sun, what lies under and between the orange dots?
2. In the centre of the right sun, what lies between the orange dots?
3. At the upper-left rim of the right sun (`ramp-right-rim`), is it the same as the centre?

<details>
<summary>After answering: what you should be seeing</summary>

1. Blue dots, and dark brown-black where orange and blue overlap. The sky's blue plate was
   never cleared under this sun, so the orange multiplied over it. That is the brown.
2. Bare paper. The blue plate is gone under the centre of the right sun.
3. No. Near the rim a scattering of blue dots survives under the orange, thinning toward the
   centre. Something removed the blue there, but not all of it. Section 5 explains why that is
   deliberate.
</details>

The source says what happened. In [`studies/index.html`](../../../../studies/index.html), find
`scene('ramp'` and read the comment in its `blue` branch: "The sun is cleared out of the sky with
a soft-edged knockout, so the halo fades into the screen instead of ending on a cut circle.
Orange printed straight over this blue would go brown, which is the left." In Part 02 you were
asked to ignore that `cut: true` call. By the end of section 5 you will have written one.

## 3. The muddy version

Generate a still:

```sh
node new-riso.mjs --kind still --out $PART/work/jelly/index.html
```

Paste this block into the ART region, above `drawArt`. It is the supplied code:

```js
// ── Part 03 supplied shapes and ramps ──────────────────────────────────────
const JX = 520, RIM = 470;       // the bell's centre line and the height of its rim

// The jellyfish as one Path2D: a dome, a scalloped rim and four arms. Every
// irregularity (scallop depths, arm positions, lengths, widths, tilts) comes
// from r, a function that returns a new number between 0 and 1 on each call.
function jellyPath(r) {
  const bell = new Path2D();
  bell.ellipse(JX, RIM, 175, 185, 0, Math.PI, 0);          // the dome: left rim, over the top, right rim
  const N = 7, step = 350 / N;
  for (let i = 0; i < N; i++) {                             // the scalloped rim, back from right to left
    const x0 = JX + 175 - i * step, x1 = x0 - step;
    bell.quadraticCurveTo((x0 + x1) / 2, RIM + 14 + 26 * r(), x1, RIM);
  }
  bell.closePath();
  const jelly = new Path2D(bell);
  for (let i = 0; i < 4; i++) {                             // four arms under the bell
    const x = JX - 96 + i * 64 + (r() - 0.5) * 24, len = 110 + 120 * r();
    const arm = new Path2D();
    arm.ellipse(x, RIM + len / 2, 12 + 8 * r(), len / 2, (r() - 0.5) * 0.35, 0, Math.PI * 2);
    jelly.addPath(arm);
  }
  return jelly;
}

// Marine snow as one Path2D: 70 small discs scattered by r. Not used until section 7.
function snowPath(r) {
  const snow = new Path2D();
  for (let i = 0; i < 70; i++) {
    const x = r() * 1080, y = r() * 1080, rad = 2.5 + 4 * r();
    snow.moveTo(x + rad, y);
    snow.arc(x, y, rad, 0, Math.PI * 2);
  }
  return snow;
}

// Two alpha ramps over the whole plate, drawn with the context's current
// globalAlpha and composite operation, like any fill. glow runs outward from
// just above the bell: stops are [[at, alpha], …] with at = 0 at the centre
// and 1 at 360 units out. vramp runs down the page, alpha a0 at y0 to a1 at y1.
function glow(g, stops) {
  const grd = g.createRadialGradient(JX, 430, 0, JX, 430, 360);
  for (const [at, a] of stops) grd.addColorStop(at, `rgba(0,0,0,${a})`);
  g.fillStyle = grd; g.fillRect(0, 0, 1080, 1080); g.fillStyle = '#000';
}
function vramp(g, y0, y1, a0, a1) {
  const grd = g.createLinearGradient(0, y0, 0, y1);
  grd.addColorStop(0, `rgba(0,0,0,${a0})`); grd.addColorStop(1, `rgba(0,0,0,${a1})`);
  g.fillStyle = grd; g.fillRect(0, 0, 1080, 1080); g.fillStyle = '#000';
}
// ── end of supplied code ───────────────────────────────────────────────────
```

Three things in it are new, and each will matter.

**The names.** Your ART code runs in the same script as the engine you mapped in Part 01, so a
top-level name the engine already uses stops the page with `Identifier … has already been
declared`, and the tools then wait (up to three minutes) and report that the work never became
ready, listing that error. `CX` and `CY` (the frame's centre), `W`, `K`, `TAU`, `INK` and `REG`
are all taken. That is why the bell's centre is `JX`.

**A shape as a value.** In Part 02 the mark was a function that drew a circle on whatever context
you gave it. `jellyPath` instead returns a
[`Path2D`](https://developer.mozilla.org/docs/Web/API/Path2D): an object that holds a shape
without drawing it. The same object can be filled on one plate with `g.fill(jelly)`, removed from
another, and used as a clip on a third. The craft kit is built on this; find the comment that
begins `Shapes are Path2D values` in your scaffold and read it. Its last sentence names the trap
this Part walks into in section 7.

**`r`.** The shape's irregularities come from calls to `r()`. You will pass it `sr`, the fourth
argument that `bakeScene` gives your `plates` function and that Part 02 told you to ignore. For
now, all you need is that `sr()` returns a number between 0 and 1 and a different one on each
call. Section 7 is about where those numbers come from.

Now write the scene. It has three plates:

| Plate | Prints | Coverage |
|---|---|---|
| `blue` | the sea, the whole frame | 0.8 |
| `pink` | the sea's second ink, the whole frame | 0.65 |
| `pink` | then the halo round the jellyfish: `glow(g, [[0, 0.85], [0.45, 0.45], [1, 0]])` | 0.85 in the middle, fading to 0 |
| `yellow` | the jellyfish, `jelly` | 1 |

Build `const jelly = jellyPath(sr);` once at the top of `plates`, before the branches. Add a
switch for isolating plates, which you will use constantly:

```js
const ONLY = null;   // 'blue', 'pink' or 'yellow' prints that plate alone
```

and give the scene `inks: ONLY ? [ONLY] : ['blue', 'pink', 'yellow']`. (Blue and pink carry
every gradient in this Part for a reason. Their screens have about forty dot sizes; the other
inks' screens have between four and ten, so a gentle gradient on them prints as visible bands.
`docs/drawing.md` records this under *Tone that prints*, and Part 08 deals with it.)

<details>
<summary>After writing yours: one way to write it</summary>

```js
const ONLY = null;   // 'blue', 'pink' or 'yellow' prints that plate alone

scene('jelly', {
  inks: ONLY ? [ONLY] : ['blue', 'pink', 'yellow'],
  plates(g, ink, rng, sr) {
    const jelly = jellyPath(sr);
    if (ink === 'blue') {
      tone(g, 0.8); g.fillRect(0, 0, 1080, 1080);               // the sea
    }
    if (ink === 'pink') {
      tone(g, 0.65); g.fillRect(0, 0, 1080, 1080);              // the sea's second ink
      tone(g, 1); glow(g, [[0, 0.85], [0.45, 0.45], [1, 0]]);  // the halo
    }
    if (ink === 'yellow') {
      tone(g, 1); g.fill(jelly);                                // the jellyfish
    }
  },
});

function drawArt(t) {
  paintBaked('jelly');
}
```
</details>

**Predict** the jellyfish's colour, using what Part 02 taught you about multiply. Then export,
crop and measure:

```sh
node still.mjs $PART/work/jelly/index.html --at 0 --out $OUT/muddy.png
crop $OUT/muddy.png 400 440 $OUT/muddy-arms.png
```

In Firefox's console on `work/jelly/index.html`: the jellyfish `measure(460, 340, 120, 80)` and
the sea `measure(60, 40, 160, 160)`.

<details>
<summary>After you have looked: what you should be seeing</summary>

A dark olive jellyfish, almost black: lightness about 49, against a sea of about 73. The bright
subject has become the darkest thing in the frame. At 1:1 it is yellow, blue and pink dots all
multiplied together. The halo is hard to see at all.
</details>

Now set `ONLY = 'yellow'` and export again:

```sh
node still.mjs $PART/work/jelly/index.html --at 0 --out $OUT/muddy-yellow-only.png
```

The yellow plate alone is a bright jellyfish on bare paper. Nothing is wrong with the yellow
plate. What is wrong is what lies under it: yellow × blue × pink, which is what Part 02's model
predicts. Set `ONLY` back to `null`.

Keep this version. Every snapshot in this Part is a copy of your file at that moment, with
`ONLY` set to `null`:

```sh
mkdir -p $PART/work/faults
cp $PART/work/jelly/index.html $PART/work/faults/muddy.html
```

## 4. Clear the ground, and at what coverage

A knockout uses Canvas's `destination-out` composite operation. Where a normal fill adds coverage,
`destination-out` removes it: the plate keeps its coverage only where the new shape is *not*.
More precisely, a pixel whose coverage is `c`, hit by a `destination-out` fill at alpha `a`, is
left with `c × (1 − a)`. At `a = 1` that is 0, bare paper. On the press this is the stencil being
closed where the subject will go.

Start with the obvious ground, the blue plate. In the blue branch, directly after the sea, write
the knockout the obvious way:

```js
      g.globalCompositeOperation = 'destination-out';           // take coverage away instead of adding it
      g.fill(jelly);
      g.globalCompositeOperation = 'source-over';
```

Export the whole picture:

```sh
node still.mjs $PART/work/jelly/index.html --at 0 --out $OUT/toned.png
```

The jellyfish is still not yellow; you will deal with that in section 5. First look at what this
knockout actually did to the blue plate, on its own. Set `ONLY = 'blue'` and:

```sh
node still.mjs $PART/work/jelly/index.html --at 0 --out $OUT/toned-blue.png
crop $OUT/toned-blue.png 400 440 $OUT/toned-blue-arms.png
```

Measure the jellyfish (`measure(460, 340, 120, 80)`) and the sea (`measure(60, 40, 160, 160)`)
on this blue-only page, and compare with bare paper, which is about 231.

<details>
<summary>After you have looked: what you should be seeing</summary>

The hole is there, but it is not empty. It holds small blue dots on the same lattice as the sea.
The sea measures about 122; the hole about 211, not 231.
</details>

Work out why before reading on. The formula above has the answer, and so does the line before
your knockout.

The knockout inherited its alpha. `tone(g, 0.8)` set `globalAlpha` to 0.8 for the sea, and
nothing set it back, so the knockout removed 80% of the coverage and left `0.8 × (1 − 0.8) =
0.16`. The screen does not know that this coverage is left over from a knockout; it screens 16%
coverage into 16% dots, as it would anywhere. (Lightness says the same thing: the sea's 0.8
darkens paper by about 109, the hole's 0.16 by about 20.) This is the rule's "Clear at full
coverage: a knockout at a tone leaves the screen's own gaps and the plate below shows through
the holes."

Make it unmistakable. Put `tone(g, 0.5);` on the line before `g.fill(jelly)`, export the blue
plate again and measure. Predict the coverage first.

<details>
<summary>After measuring: check yourself</summary>

`0.8 × (1 − 0.5) = 0.4`. The hole measures about 173 and is plainly a 40% screen of blue: a
paler jellyfish drawn in the sea's own dots.
</details>

Remove the `tone(g, 0.5);` line, set `ONLY = null`, and keep the inherited version as evidence:

```sh
cp $PART/work/jelly/index.html $PART/work/faults/toned.html
```

Then fix it: set `tone(g, 1);` before `g.fill(jelly)`. On the blue-only page the hole should now
measure bare paper, about 231, with `inked` at 0.

The repository packages exactly that fix. In your scaffold, find `function carve` and read it and
its comment: it saves the context, sets `globalAlpha` to 1 and `destination-out` itself, fills,
and restores. It sets its own alpha because a knockout's strength must not depend on whatever was
drawn before it, which is exactly the dependency that just bit you. A few lines above it,
`print(g, path, a)` is its opposite: `tone` then `fill`. Replace your three lines with:

```js
      carve(g, jelly);
```

## 5. Clear every plate that prints under the subject

Export the whole picture again (`ONLY = null`) and measure the jellyfish:

```sh
node still.mjs $PART/work/jelly/index.html --at 0 --out $OUT/one-plate.png
crop $OUT/one-plate.png 400 440 $OUT/one-plate-arms.png
```

It is orange, about 112. The blue is gone from under it, and so is the olive, but the jellyfish
is still not the colour of its own ink. Isolate the plate you have not touched (`ONLY = 'pink'`)
and look: the sea's pink and the halo run straight through the jellyfish's shape. Yellow over
pink is orange. The rules file names this twice: "Clear the subject out of every overlay plate,
not just the ground. Light shafts crossing a whale turned it brown", and "pink over yellow goes
orange across the mark". The knockout is correct; it is on one plate out of two.

Set `ONLY = null` and keep it:

```sh
cp $PART/work/jelly/index.html $PART/work/faults/one-plate.html
```

Now clear the pink plate too. Before you do, decide *where* in the pink branch the `carve` goes,
and test the choice you did not make. Put `carve(g, jelly);` **before** the halo line first, export
and measure; then move it **after** the halo line, export and measure.

<details>
<summary>After both: what you should be seeing</summary>

Carved before the halo, the jellyfish is still orange (about 130), and not evenly: it is most
orange in the middle, where the halo is strongest. The sea's pink was cleared, but the halo was
printed afterwards, into the hole. Carved after the halo, the jellyfish is clean yellow on paper,
about 206, and the pink-only view shows an empty hole.
</details>

That is the rule this Part keeps returning to, in the rules file's words: "Anything drawn after a
knockout survives it. Order is the whole mechanism." Keep the carve after the halo.

### Letting the halo glow: a partial knockout, on purpose

Look at the halo now. Measure beside the dome, `measure(700, 300, 60, 60)`: about 67, no lighter
than the sea. Pink printed over a dark blue sea only makes it a slightly different dark. The same
fault as the jellyfish, at lower strength: a light ink cannot lighten what is under it.

So open the blue under the halo as well, but **not** fully. A glow is light spreading into the
water; the sea should still be there, thinning toward the jellyfish. In the blue branch, after
the sea and before `carve(g, jelly)`, add a graded knockout:

```js
      g.save();                                                 // open the sea round the glow, partly
      g.globalCompositeOperation = 'destination-out';
      tone(g, 1); glow(g, [[0, 0.9], [0.5, 0.5], [1, 0]]);
      g.restore();
```

`tone(g, 1)` is there for the reason you found in section 4: without it, this knockout would
also inherit the sea's 0.8, and the gradient's own alphas would be scaled down. Export and measure
the same place beside the dome.

<details>
<summary>After you have looked: what you should be seeing</summary>

About 91, and a pink-violet glow that fades into the sea. At 1:1, near the jellyfish the blue
dots are small and sparse and pink dominates; further out the blue dots grow back to the sea's
size.
</details>

This is a **toned knockout**, the same operation that was a fault in section 4, now used
deliberately. Under the jellyfish you wanted bare paper, so any surviving dots were a defect.
Around it you want a blend, the halo's pink mixed with a thinning sea, so surviving dots are the
effect. Nothing about `destination-out` changed; what changed is what the picture needs at that
place.

Go back to the ramp study's blue branch. `shade(g, skyR, { cut: true, x: QR, y: sunY, … })` is
the craft kit's packaged version of what you just wrote: `shade` fills a shape with an alpha
gradient, and `cut: true` makes it a `destination-out` fill at `globalAlpha` 1 (find
`function shade` and check). Its stops start at 1, full clearing near the sun's centre, and fall
to 0.7 and then 0. That is why the right sun's centre is on bare paper while its rim keeps some
sky: the halo "fades into the screen instead of ending on a cut circle". The left sun had no
knockout at all. `docs/drawing.md` gives the general rule under
[*Tone that prints*](../../../../docs/drawing.md#tone-that-prints): "Open a dark ground with a
soft knockout (`shade(…, {cut: true})`) before a light ink lands: yellow over green prints lime,
on opened paper it prints as light." You will use `shade` itself from Part 06.

## 6. Order within one plate

### Which orders matter

A plate holds only coverage: every fill is black, and only alpha is kept. That makes most
orderings irrelevant, and it is worth knowing exactly which.

- **Two prints** give the same result in either order. Coverage `a` printed over `b` becomes
  `a + b − a·b`, which is symmetric. There is no "in front" on a plate; overlapping tones simply
  add toward 1.
- **Two knockouts** give the same result in either order: `c × (1 − a) × (1 − b)`.
- **A print and a knockout** do not. A print before a knockout is removed by it; a print after a
  knockout survives it.

Test the second claim. Export the current picture, then move the four-line glow opening in the
blue branch to after `carve(g, jelly)`, export again, and make a difference image as in Part 02:

```sh
node still.mjs $PART/work/jelly/index.html --at 0 --out $OUT/knock-order-a.png
# move the glow opening after the carve, then:
node still.mjs $PART/work/jelly/index.html --at 0 --out $OUT/knock-order-b.png
"$FFMPEG" -loglevel error -y -i $OUT/knock-order-a.png -i $OUT/knock-order-b.png -filter_complex "blend=all_mode=difference" $OUT/knock-order-diff.png
```

The difference is black apart from at most a handful of isolated pixels, where rounding tipped a
threshold one way or the other. Move the glow opening back. So whenever order matters on a plate,
the cause is a print and a knockout in the wrong order.

### Ownership: clear first, then print

The jellyfish should carry a little of the halo's colour toward its rim: a blush, pink at nothing
near the top of the bell rising to 0.45 at the arm tips. That pink belongs to the jellyfish, so
it should be exactly the tone the jellyfish asks for, whatever the pink plate held there before.

Add it to the pink branch, **after** `carve(g, jelly)`:

```js
      g.save(); g.clip(jelly);                                  // the blush, inside the jellyfish only
      tone(g, 1); vramp(g, RIM - 150, RIM + 220, 0, 0.45);
      g.restore();
```

(`clip` limits drawing to the jellyfish's shape; `restore` removes the clip. Here the `Path2D`
is doing a third job, after being filled and carved.) Export and look:

```sh
node still.mjs $PART/work/jelly/index.html --at 0 --out $OUT/blush.png
crop $OUT/blush.png 400 440 $OUT/blush-arms.png
```

Measure the jellyfish, then isolate pink and measure the band just under the rim:
`measure(460, 440, 80, 20)`.

<details>
<summary>After you have looked: what you should be seeing</summary>

Orange-red dots scattered through the lower bell and the arms, sparse at the top, denser toward
the arm tips. The jellyfish measures about 199 instead of 206. On the pink-only page the band
under the rim measures about 215, where it was bare paper (about 234) before the blush.
</details>

Now move the three blush lines to **before** `carve(g, jelly)` and export. Then answer, without
exporting it, what the blush would look like if the pink plate had no `carve(g, jelly)` at all.

<details>
<summary>Check yourself</summary>

Before the carve, the blush disappears: the carve removes it along with the halo. With
no carve at all, the blush would add to the halo's roughly 0.85 already there, `0.45 + 0.85 −
0.45 × 0.85 ≈ 0.92`, and the lower jellyfish would go deep orange: the blush's own value lost in
what was under it.
</details>

Only one order gives the blush its own value: clear the shape, then print it. That is what the
rules file means by "A shape that must own its value clears first and prints second". The kit
names the pair `plane(g, path, a)`, which is `carve` followed by `print`; find it under `carve`
in your scaffold. The `gather` print uses it for its fire (`plane(g, fire, 1)`), and Part 06 uses
it to give each plane of a picture its own value. Put the blush back after the carve.

### A late addition to the ground

Now the sea should darken with depth. Add this line **at the end** of the blue branch, after the
carve, where a new idea usually gets added:

```js
      tone(g, 1); vramp(g, 250, 1080, 0, 1);                     // deeper toward the bottom
```

Predict what happens to the jellyfish and to the glow. Then:

```sh
node still.mjs $PART/work/jelly/index.html --at 0 --out $OUT/late-ramp.png
crop $OUT/late-ramp.png 400 440 $OUT/late-ramp-arms.png
```

and measure the jellyfish, and the sea near the bottom, `measure(60, 880, 160, 160)`.

<details>
<summary>After you have looked: what you should be seeing</summary>

The sea is darker toward the bottom, as intended (about 62 at the bottom, from about 74). The
jellyfish has gone greenish, more so toward the arm tips (about 178), and the lower half of the
glow has sunk back into the sea. At 1:1 the jellyfish holds blue dots on the sea's lattice,
growing downward: the ramp printed straight into the hole, and into the glow's opening.
</details>

Keep it:

```sh
cp $PART/work/jelly/index.html $PART/work/faults/late-ramp.html
```

If you know Canvas well you may think of `destination-over`, which draws new content *behind*
what is already there, and the rules file suggests it: "A shape drawn after another buries it.
Use `destination-over` to slot something behind." Try it: set
`g.globalCompositeOperation = 'destination-over';` before the late ramp line and `'source-over'`
after it, export, and compare with `late-ramp.png` using a difference image.

<details>
<summary>After comparing: what you should be seeing</summary>

The difference is black. On a plate, `destination-over` gives exactly the same pixels as a normal
fill.
</details>

The first bullet list above explains it. Behind and in front are colour ideas: on a canvas that
holds colour, `destination-over` puts the new colour under the old one. A plate holds only
coverage, and two coverages combine the same way in either order. On a plate, "in front" exists
only through knockouts: a shape is in front when it is printed after something was cleared for
it. A knockout, in turn, is not an object that something can be "behind". It is the absence of
coverage, and anything added afterwards can fill it, from in front or from behind. The only ways
to keep this hole open are to draw the ramp *before* the knockout, or to knock the jellyfish out
of the ramp as well. (Here a line in the rules file does not match what the plate engine does on
a plate; the measurement is the authority.)

Remove the `destination-over` lines and move the ramp to directly after the sea, before the glow
opening and the carve. Export: the depth stays, and the jellyfish and glow are back. The rules
file's version: "Draw a subject into the ground's plate *before* knocking the ground out, or it
stripes across the hole."

### Reading a real plate program: `gather`

Now read a finished print as the ordered program it is. Export `gather` (the first print in
`prints/workings`) and crop the edge of the furnace mouth:

```sh
node still.mjs ../prints/workings/index.html --at 0 --out $OUT/gather.png
crop $OUT/gather.png 600 350 $OUT/gather-mouth.png
```

In [`prints/workings/index.html`](../../../../prints/workings/index.html) read the comment above
`scene('gather'`, then the `indigo` branch. You do not need to know what each kit call draws, only
which way it moves coverage. Label every call **P** (adds), **K** (removes) or **K+P**:
`carve`, and anything with `cut: true`, removes; `plane` removes then adds; everything else
adds. Then answer:

1. The brick courses (`hatch(g, face, …)`) come after the light ramps and before
   `carve(g, fire)`. What would each of the other two positions do? Check against the comment and
   against `gather-mouth.png`, where the dark horizontal courses meet the fire.
2. `keyline(g, fire, 21, 1)` strokes a thick line centred on the fire's outline, and the next line
   carves the fire. What is left of the stroke, and what does the print use it for?
3. `print(g, mass, 1)`, the glassblower's silhouette, comes after every carve. What does that
   position guarantee about the figure?
4. In the `yellow` branch, `carve(g, mass)` removes the figure from the yellow spill. The figure is
   dark, not bright. Why clear it anyway? (Section 5 is the answer, turned round.)

<details>
<summary>After answering: check yourself</summary>

1. Before the light ramps, the ramps would thin the courses along with the wall, so the lit face
   would lose them; after the carve, they would print across the fire's opening. In the crop they
   stop at the dark ring round the mouth.
2. The carve removes the stroke's inner half, so only a dark ring outside the opening survives:
   the reveal, the furnace wall's thickness seen in its own shadow.
3. No knockout for the fire or the gather comes after it, so no hole is cut through the figure:
   it is whole and in front of everything else on those plates. (The one later knockout is the
   figure's own light ramp, which lifts the side facing the gather on purpose.) Order is the
   occlusion.
4. Yellow over the dark figure would tint it olive. "no light prints across the silhouette": a
   foreground that is meant to block light must be cleared from the light's plate, whatever its
   own value.
</details>

The form study has the smallest example of the same idea. In `scene('form'`, the orange branch
prints both balls, ramps light out of the right-hand one, and ends with one `carve`: a small
highlight that survives because nothing comes after it. The rest of that study is Part 06.

## 7. Shared geometry, and the order of random numbers

### What `sr` and `rng` are

In your scaffold, find the line in `bakeScene` that calls your function:

```js
sc.plates(g, ink, rngFor(id + ':' + ink), rngFor(id + ':shape'));
```

`rngFor(key)` makes a new generator of numbers between 0 and 1 whose whole sequence is fixed by
its key: the same key always gives the same sequence. (How, and why `Math.random()` is never
allowed here, is Part 04.) So:

- **`rng`** is keyed by the scene and the ink: a different sequence on every plate.
- **`sr`** is keyed by the scene and the word `shape`: the same key for every plate. And because
  this line runs once per ink, each plate gets a **fresh** `sr` that starts from the beginning of
  the same sequence.

That is why your jellyfish has agreed on all three plates so far without any effort from you:
each plate's `jellyPath(sr)` consumed the same first numbers of the same sequence.

### Add marine snow where it is used

Marine snow is particles drifting in the dark, catching light: small knockouts, bare paper. They
must be cleared from both plates that print the sea. A natural way to write that is to build the
snow in the branches that use it. In the blue branch, between the glow opening and
`carve(g, jelly)`, and in the pink branch, between the halo and `carve(g, jelly)`, add:

```js
      const snow = snowPath(sr);
      carve(g, snow);
```

Predict before exporting: will the specks be bare paper, or single-ink dots where the two plates'
specks miss each other?

```sh
node still.mjs $PART/work/jelly/index.html --at 0 --out $OUT/snow.png
```

<details>
<summary>After you have looked: what you should be seeing</summary>

Paper-white specks all over the sea, each with a thin coloured fringe on some sides (registration,
as in Part 02). Both plates built the jellyfish first (at the top of `plates`) and then the snow,
so both drew the same 210 numbers for the snow and cleared the same specks.
</details>

### Tidy it up, and break it

The code now builds one shape at the top and the other inside two branches. A tidy-minded
refactor is to build every shape inside the branch that uses it, in the order it is used. Do
exactly that: delete `const jelly = jellyPath(sr);` from the top of `plates`; in the blue and pink
branches put `const jelly = jellyPath(sr);` directly after `const snow = snowPath(sr);` (the
snow is carved first, so it is built first); and in the yellow branch put
`const jelly = jellyPath(sr);` as its first line. **Predict** what this does, then:

```sh
node still.mjs $PART/work/jelly/index.html --at 0 --out $OUT/seed.png
crop $OUT/seed.png 420 500 $OUT/seed-arms.png
```

<details>
<summary>After you have looked: what you should be seeing</summary>

The dome still matches, but the rim and the arms do not. Yellow arms print over uncleared sea,
dark olive; next to them are arm-shaped holes with no yellow in them, bare paper with a little
pink. The two sea plates agree with each other; the yellow plate disagrees with both.
</details>

Explain it from the sequence. The blue and pink branches now draw 210 numbers for the snow
**before** building the jellyfish, so their scallops and arms come from numbers 211 onward. The
yellow branch builds no snow, so its jellyfish comes from numbers 1 onward, as it always did.
Two different jellyfish, from correct code on every plate. The dome matches because it uses no
random numbers: a useful clue that the problem is the sequence, not the geometry. This is the
failure `gather` warns about in the comment above its shapes: "Shapes more than one plate touches
come off sr, before the ink branch. sr is re-seeded identically per plate and has to be consumed
in the same order every time, or a knockout lands somewhere other than the shape it was built to
clear."

Keep it:

```sh
cp $PART/work/jelly/index.html $PART/work/faults/seed.html
```

### The fix

Build every shape that more than one plate uses **once, at the top of `plates`, before any
branch, always in the same order**, and use `sr` for nothing else. Then no branch can change what
another branch's shapes are made of. Anything only one plate draws takes its randomness from
`rng` instead, so it never touches `sr`'s sequence at all; the rules file: "The per-ink `rng` is
fine for anything only one plate draws." Move the snow and the jellyfish back to the top, remove
the three branch copies, and switch the yellow plate to the kit's `print`:

<details>
<summary>After writing yours: the corrected scene</summary>

```js
const ONLY = null;   // 'blue', 'pink' or 'yellow' prints that plate alone

scene('jelly', {
  inks: ONLY ? [ONLY] : ['blue', 'pink', 'yellow'],
  plates(g, ink, rng, sr) {
    // Shapes more than one plate uses: built once, before any branch, in a fixed order.
    const jelly = jellyPath(sr);
    const snow = snowPath(sr);
    if (ink === 'blue') {
      tone(g, 0.8); g.fillRect(0, 0, 1080, 1080);               // the sea
      tone(g, 1); vramp(g, 250, 1080, 0, 1);                     // deeper toward the bottom
      g.save();                                                 // open the sea round the glow, partly
      g.globalCompositeOperation = 'destination-out';
      tone(g, 1); glow(g, [[0, 0.9], [0.5, 0.5], [1, 0]]);
      g.restore();
      carve(g, snow);
      carve(g, jelly);
    }
    if (ink === 'pink') {
      tone(g, 0.65); g.fillRect(0, 0, 1080, 1080);              // the sea's second ink
      tone(g, 1); glow(g, [[0, 0.85], [0.45, 0.45], [1, 0]]);  // the halo
      carve(g, snow);
      carve(g, jelly);
      g.save(); g.clip(jelly);                                  // the blush, inside the jellyfish only
      tone(g, 1); vramp(g, RIM - 150, RIM + 220, 0, 0.45);
      g.restore();
    }
    if (ink === 'yellow') {
      print(g, jelly, 1);                                       // the jellyfish
    }
  },
});

function drawArt(t) {
  paintBaked('jelly');
}
```
</details>

Export it and compare it with the snow version you made before the tidy-up:

```sh
node still.mjs $PART/work/jelly/index.html --at 0 --out $OUT/jelly.png
"$FFMPEG" -loglevel error -y -i $OUT/snow.png -i $OUT/jelly.png -filter_complex "blend=all_mode=difference" $OUT/snow-vs-jelly.png
```

The difference should be completely black: building the snow at the top, after the jellyfish,
consumes `sr` in exactly the order the working version did.

Two short checks, in your notes:

1. **`rng` for a shared shape.** Temporarily change the top line to `jellyPath(rng)` and export.
   Predict first. (Every plate now builds a different jellyfish from its own sequence, so the
   scallops and arms disagree on all three plates at once.) Change it back.
2. **Why a `Path2D` and not a drawing function?** The pink branch uses the jellyfish twice: once
   to carve, once to clip the blush. Suppose `jellyPath` drew straight onto the context and you
   called it for each use. What would the blush be clipped to?

<details>
<summary>Check yourself on question 2</summary>

A different jellyfish. Each call consumes the next numbers of `sr`, so the second call in the
same branch builds new scallops and arms: the blush would be clipped to a shape that was never
carved, and would print partly over the halo and partly into nothing. A `Path2D` built once is one
set of numbers, used as many times as the plate needs. That is the "usual trap of rebuilding a
shape per ink and having the knockout miss" that the kit's comment describes.
</details>

### Compare with the reference

Now open [`project/index.html`](project/index.html). Its ART region holds the supplied block and
the corrected scene exactly as this lesson gives them. Export it and compare it with yours, with
the `jellyPath(rng)` check undone:

```sh
node still.mjs $PART/work/jelly/index.html --at 0 --out $OUT/jelly.png
node still.mjs $PART/project/index.html    --at 0 --out $OUT/reference.png
"$FFMPEG" -loglevel error -y -i $OUT/jelly.png -i $OUT/reference.png -filter_complex "blend=all_mode=difference" $OUT/jelly-vs-reference.png
```

The difference should be black: the same shapes, built from `sr` in the same order, on the same
plates in the same order. The scene is registered under the same id, `jelly`, so even the
starvation flecks match. If whole shapes show up instead, find the first plate that differs by
setting `ONLY` to the same ink in both files, and read the two branches side by side, line by
line. Differences in comments, spacing or variable names change nothing; a difference in the
order of a print and a knockout, or in what is built from `sr` before the branches, changes
pixels. Do not edit the reference; copy anything you want to
experiment with into `work/`.

## 8. Inspect the corrected jellyfish

Confirm the contract and export the deliverable, full size and reduced:

```sh
node verify.mjs $PART/work/jelly/index.html --times 0
node still.mjs  $PART/work/jelly/index.html --at 0 --out $OUT/jelly.png
node shoot.mjs  $PART/work/jelly/index.html --times 0 --size 360 --engine firefox --out $OUT/jelly-at-360
```

`verify.mjs` passes. Now run it on `work/faults/seed.html`. It passes too, and so do the other
four snapshots: every one of them draws the same pixels every time. The contract check has no
idea what a plate should contain. Every question in this Part is answered by pixels.

### The corrected edge

Crop four places on the corrected picture:

```sh
crop $OUT/jelly.png 330 330 $OUT/jelly-left.png
crop $OUT/jelly.png 440 230 $OUT/jelly-top.png
crop $OUT/jelly.png 600 330 $OUT/jelly-right.png
crop $OUT/jelly.png 420 500 $OUT/jelly-arms.png
```

Even a correct knockout is not a perfect edge. Look along the contour in each crop and record
what you find on each side.

<details>
<summary>After you have looked: what you should be seeing</summary>

The dome is clean yellow with paper pinholes. Its **left** edge has a thin pale line of blue dots
on paper; its **right** edge a thin red line; its **top** a thin pink line. Each arm has red
on its right edge and a pale line on its left. None is wider than about five pixels, and each
follows the whole contour, on the same side everywhere. The snow specks show the same pattern in
miniature.
</details>

This is registration, Part 02's fixed plate offsets, meeting a knockout. The three plates are
drawn at `REG.yellow = [2, 1.5]`, `REG.blue = [1.5, -1]` and `REG.pink = [-2.5, 2]`. So the pink
plate's hole sits 4.5 px to the left of the yellow jellyfish: on the right edge, yellow overlaps
un-cleared pink for 4.5 px (red); on the left edge, the pink hole runs 4.5 px past the yellow,
and that sliver holds only the blue plate's dots on paper, lighter than the two-ink sea around it
(the pale line). Work out the top edge yourself from the blue and pink offsets. These slivers are
what "the subject's own contours reveal it" looks like on a knockout, and they are part of the
print, not a defect: fixed, a few pixels, identical along every contour. (Also expect thin lines
along the frame's own edges, where each plate's offset slid it off the sheet. Every baked frame
has them.)

### Compare the failures at the same pixels

Export each snapshot and crop it at the two places that show the most: the left edge of the dome
and the arms.

```sh
for f in muddy toned one-plate late-ramp seed; do
  node still.mjs $PART/work/faults/$f.html --at 0 --out $OUT/fault-$f.png
  crop $OUT/fault-$f.png 330 330 $OUT/fault-$f-left.png
  crop $OUT/fault-$f.png 420 500 $OUT/fault-$f-arms.png
done
```

Open each pair next to `jelly-left.png` and `jelly-arms.png`. When a crop leaves you unsure which
plate a pixel belongs to, open that snapshot, set its `ONLY` to one ink, and look again: that is
the evidence, not your eye's guess at a colour.

In `NOTES.md`, make a table with one row for each failure and these columns:

- **what is in the subject** that should not be: which ink, at which screen angle (blue's rows
  slope about 14°, pink's about 76°, as `SCREEN` says);
- **where**: across the whole subject, graded across it, or only near the contour;
- **how isolation confirms it**: which plate, isolated, shows the unwanted coverage;
- **the cause** in one line, and **the fix** in one line.

Then add two rows for darkening that is **not** a fault: the blush, and the registration slivers.
For each of the seven rows, state whether the extra ink is an **intended overprint** or an
**unremoved underlying plate**.

<details>
<summary>After writing yours: points your table should contain</summary>

- **Muddy:** both sea plates under the whole subject, uniform. The subject is darker than the
  sea. Isolating yellow shows a perfect jellyfish, so the fault is underneath it. Unremoved
  plates.
- **Toned:** a thin screen of blue dots on the sea's own lattice, uniform across the subject,
  plus the pink of the next fault. The blue-only view shows a hole that is not empty. Unremoved
  (partly removed) plate; cause, a knockout below full coverage.
- **One plate:** pink across the whole subject at the sea-plus-halo coverage, strongest in the
  middle; no blue. The pink-only view shows the shape was never cut. Unremoved plate.
- **Late ramp:** blue dots in the subject, growing toward the bottom, and the lower glow closed.
  Blue-only view: the ramp runs straight through the hole. A print after a knockout.
- **Seed:** the dome clean; arms and scallops wrong in shape, dark where yellow prints over sea and
  pale where holes have no yellow. Errors tens of pixels wide, different at every arm. Each plate
  is internally consistent; they disagree with each other. Shared geometry built from `sr` in
  different orders.
- **Blush:** pink inside the subject only, graded from nothing to 0.45, never outside the
  contour. Intended overprint.
- **Registration slivers:** a few pixels at the contour, same side everywhere. Intended property
  of the print. They are distinguished from the seed fault by size and regularity, and from the
  one-plate fault by being confined to the edge.
</details>

Last, open `jelly-at-360/t_000.000.png`. At this size the slivers vanish and the jellyfish reads as
one clean yellow shape. Could you have told the toned version from the one-plate version at this
size? The reduced view is how the picture will usually be seen, but it is not where plate faults
are found.

Be as precise as in Part 02 about what all of this is. It is **print** evidence: native pixels,
1:1 crops, isolated plates. It establishes that each plate holds what you meant it to hold. It
says nothing about whether the jellyfish is well drawn, well placed or worth looking at; it is
ellipses and a scalloped line in the middle of the frame, and a perfect print of it is still
that.

## 9. Decisions you should be able to defend

In your notes, give for each a situation where you would choose the alternative.

**Full knockout rather than a partial one.** The problem: a bright subject must sit on bare paper,
or every ink under it multiplies into it. A full knockout is the only way to get bare paper; any
alpha below 1 leaves `c × (1 − a)` of the ground to be screened into dots, which you measured. A
partial knockout is the better choice when the blend is the point: the halo, where the sea should
thin rather than vanish; the ramp study's sun rim; a light ink meant to sit *in* a ground rather
than on it, like light through thin mist or a colour cast over a surface.

**One shared geometry object rather than similar shapes made per plate.** The problem: a knockout
must land exactly on the shape it clears, on every plate. One `Path2D`, built once from `sr` before
the branches, guarantees that; per-plate construction works only while every branch happens to
consume the same random numbers in the same order, and you broke it with an unrelated change.
Independently made shapes are the better choice when the difference *is* the intended effect and
is controlled: the registration offset itself is a deliberate, fixed disagreement between plates;
a deliberately doubled or vibrating contour on one ink would be another.

**Explicit draw order rather than automatic sorting.** The problem: on a plate, a print and a
knockout do not commute, and what survives depends on which comes last. Explicit order in code is
the only thing that expresses "courses on the lit face, but not across the mouth", or "the halo,
and then the hole through it". Automatic sorting (drawing a list of objects back to front by a
depth value) is the better choice for many disjoint objects with reliable depth relations and no
carve-then-print semantics between them: seventy snow specks, a crowd of distant birds each
printed solid. Part 10 meets the cases where such sorting goes wrong even there.

## Before you move on

You should have, in `work/`:

- [ ] `jelly/index.html`: three plates, shared shapes built before the branches, every knockout at
  full coverage except the deliberate glow opening; `verify.mjs --times 0` passes, and its
  difference image against `project/index.html` is black.
- [ ] `faults/`: `muddy.html`, `toned.html`, `one-plate.html`, `late-ramp.html` and `seed.html`,
  each with `ONLY = null`.
- [ ] `NOTES.md`: the ramp-sun answers; predictions and what happened at each step; the
  measurements; the `gather` labels and answers; the two section 7 checks; the seven-row evidence
  table; the three decisions.

And in `out/course/03/` (regenerable): the native PNGs of every step and snapshot, the crops, the
difference images and the 360 px capture.

You should be able to explain, without looking:

- why a light ink printed over a dark ground can never read as light, and what has to happen
  first;
- what coverage a knockout at alpha `a` leaves behind, and why the screen turns it into dots;
- why clearing the ground is not enough, and how to find which plate is still under a subject;
- which pairs of operations on a plate commute and which do not, and why `destination-over`
  changes nothing on a plate;
- what "owning" a value means, and the order that achieves it;
- why `sr` must be consumed in the same order on every plate, and where shared shapes are built;
- how registration slivers differ, in the pixels, from each of the five faults.

The sentence to carry forward: **plate construction is an ordered program. A shape's visual
result depends on what was present before it and what survives after it.**

## Deliberately left for later

- **Randomness itself** (Part 04). You relied on `sr` and `rng` giving fixed sequences. How
  `rngFor` does that, why `Math.random()` is banned from rendering, why keys are frozen once a
  picture is approved, and what happens to texture when seeds change with time, come next.
- **Contours** (Part 05). The jellyfish is ellipses, curves and a scalloped line: assembled
  primitives, which is exactly what Part 05 teaches you to replace.
- **Value and form** (Part 06). `plane()` for depth stacks, modelling a form by taking ink away
  toward the light with `shade(…, {cut: true})`, highlights as bare paper, and which tones a
  picture should spend.
- **Composition** (Part 07). The jellyfish sits roughly in the middle because it was convenient,
  not because it was decided.
- **Screen quantisation** (Part 08). Why gradients on most inks print as bands.
- **Occlusion in constructed space** (Part 10): explicit draw groups when objects overlap in
  perspective.
- **Knockouts that move** (Part 16). Everything here was baked once. A bright element moving over
  a printed ground is drawn live, and the same problem needs a live answer:
  [`docs/motion.md`](../../../../docs/motion.md) says "live passes multiply, so a bright element
  on a printed night must remove the night first", and names the tool, `relight`.
