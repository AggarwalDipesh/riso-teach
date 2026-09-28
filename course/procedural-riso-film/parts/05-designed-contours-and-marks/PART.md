# Part 05 — From Primitives to Designed Contours and Marks

The subjects in Parts 02–04 were given to you, and all three were assembled from primitives: a
disc and rectangles, a jellyfish of ellipses under a half-ellipse, an egg that was an oval with a
waver. That was deliberate. Those Parts were about plates and randomness, and the drawing was not
the point.

From this Part on, the drawing is the point. The repository's own diagnosis of its weak early
scenes is blunt: they "were ellipses, rings, straight polylines and arc fans, flat-filled on flat
grounds, one subject size, no dark, not one coverage gradient: exactly what the helper vocabulary
offered" (`docs/drawing.md`, first paragraph). Part 06 deals with the flat fills and the missing
dark. This Part deals with the shapes and the lines.

You will draw one small subject, a garden snail crawling, twice: first the way the helper
vocabulary suggests, from circles, ellipses and constant-width strokes; then as one designed
outline with a few marks whose width changes along their length. You will judge both the way the
repository judges a shape: as a solid silhouette, at full size and as a thumbnail, before any
interior detail is allowed to help.

**You will make**

- `work/assembled/`: the snail from primitives and constant strokes, kept as evidence.
- `work/designed/`: the snail as designed contours and variable-width marks. This is the Part's
  deliverable.
- `work/faults/`: `wobbled.html` (the assembled snail with a wobbled shell) and `soft-shell.html`
  (a structural edge softened on purpose).
- `work/NOTES.md`: the silhouette readings, your contour decisions, the edge comparison and the
  two decisions.

**Supplied:** the assembled snail's code in section 3, and a function that lays out the shell's
coil in section 8. The outlines and the width of every mark are yours to design.

**Reference:** [`project/index.html`](project/index.html) is a finished `work/designed/`, a
self-contained still made with the same scaffold and verified with the same tools. Your points and
widths will differ from it, and should: it is one answer, not the answer. Do not open it until
section 12 tells you to. It is a snapshot: later Parts never change it.

---

## 1. Setup

```sh
cd tools
PART=../course/procedural-riso-film/parts/05-designed-contours-and-marks
OUT=../out/course/05
FFMPEG=$(node -p "require('ffmpeg-static')")
mkdir -p $OUT
crop()  { "$FFMPEG" -loglevel error -y -i "$1" -vf "crop=120:120:$2:$3,scale=480:480:flags=neighbor" "$4"; }
thumb() { "$FFMPEG" -loglevel error -y -i "$1" -vf "scale=$2:$2:flags=area" "$3"; }
```

`crop` is Part 02's 1:1 crop. `thumb in.png 120 out.png` makes a small copy of a frame, averaging
each block of pixels the way a contact sheet or a thumbnail in a file browser does. Open a
thumbnail at 100%: it is meant to be small. A thumbnail is the wrong place to judge dots (Part 02),
and exactly the right place to judge whether a shape still says what it is.

## 2. The diagnosis, in the repository's own studies

Export the first two studies:

```sh
node still.mjs ../studies/index.html --at 0 --out $OUT/study-silhouette.png
node still.mjs ../studies/index.html --at 1 --out $OUT/study-stroke.png
```

Each is an A/B: the left half is "how this project has been drawing", the right half is the
technique (the comment under `/* ── studies` in `studies/index.html`). Look at the silhouette study
first, and write down what makes the left bird look the way it does before you read further.

Then read, in [`studies/index.html`](../../../../studies/index.html), the comment above
`const BIRD` and the `scene('silhouette'` code under it. Match each part of the left bird to the
primitive that drew it, and each part of the right bird to what drew it instead. The comment names
the failure: "A silhouette assembled from primitives carries their curvature: every edge is a
machine arc, the joins read as bumps, and no part of the outline says what the subject is doing."
On the right, one contour runs through a list of points, "with a doubled point where an edge needs
a corner".

Now the stroke study. Read `scene('stroke'`. The left plant is drawn with `g.lineWidth = 9` for
everything: stem, leaves, bud. The right one uses `nib`, a ribbon whose width can change along its
length: the stem thick at the root and lifting at the tip, each leaf swelling and narrowing.

Two of the whole-picture exemplars in the same file say the same thing about particular shapes.
Read the comment inside `scene('kettle'`: "A kettle is a flat base, a full belly and a flat
shoulder for the lid. An ellipse has none of those and reads as fruit." And inside `scene('wave'`:
"The opening is a lens with two sharp ends. An ellipse in this position reads as a ball however it
is shaded; the points are what say aperture."

Finally read *Silhouette and contour* in [`docs/drawing.md`](../../../../docs/drawing.md#silhouette-and-contour).
Keep it open; this Part works through it bullet by bullet.

## 3. The assembled snail

Generate a still:

```sh
node new-riso.mjs --kind still --out $PART/work/assembled/index.html
```

Replace the empty `drawArt` with the supplied snail. It is what a reasonable programmer writes when
asked for a snail with the tools of Parts 02–04: every part the simplest shape that stands for it,
and every line one width.

```js
const SILHOUETTE = false;   // true: the whole subject in one solid ink, no interior detail

scene('snail', {
  inks: SILHOUETTE ? ['indigo'] : ['blue', 'orange'],
  plates(g, ink, rng, sr) {
    // The snail from primitives: every part the simplest shape that stands for it.
    const foot = new Path2D(); foot.ellipse(530, 712, 360, 50, 0, 0, TAU);
    const head = new Path2D(); head.arc(835, 640, 58, 0, TAU);
    const shell = new Path2D(); shell.arc(470, 520, 185, 0, TAU);
    const eyes = new Path2D();
    for (const [x, y] of [[818, 468], [888, 488]]) { eyes.moveTo(x + 13, y); eyes.arc(x, y, 13, 0, TAU); }
    const body = new Path2D(foot); body.addPath(head); body.addPath(eyes);
    const stalks = g => {                          // eye stalks and feelers: constant-width strokes
      g.lineWidth = 9; g.lineCap = 'round';
      g.beginPath();
      g.moveTo(820, 600); g.lineTo(818, 468);
      g.moveTo(850, 600); g.lineTo(888, 488);
      g.moveTo(870, 660); g.lineTo(915, 640);
      g.stroke();
    };
    const coil = g => {                            // the coil: circles, one width
      g.lineWidth = 9;
      for (const r of [140, 95, 52]) { g.beginPath(); g.arc(470 - (185 - r) * 0.3, 520 - (185 - r) * 0.25, r, 0, TAU); g.stroke(); }
    };

    if (SILHOUETTE) {
      print(g, body, 1); print(g, shell, 1); tone(g, 1); stalks(g);
      return;
    }
    if (ink === 'blue') {
      print(g, body, 0.6);
      tone(g, 0.6); stalks(g);
      carve(g, shell);                               // the shell stands in front of the body
      tone(g, 1); coil(g);
    }
    if (ink === 'orange') {
      print(g, shell, 1);
    }
  },
});

function drawArt(t) {
  paintBaked('snail');
}
```

Everything in it is plate logic you already know: the body at a 60% blue screen, the shell solid
orange and carved out of the blue so it stands in front (Part 03's ownership), the coil printed on
the blue plate **after** that carve, so it survives it and prints as a blue-over-orange dark
(Part 02's overprint). The `SILHOUETTE` switch is new, and it is the instrument for this Part: it
prints every part of the subject solid in one ink and leaves out the coil, which is interior
detail.

Export it and look at it at full size, then at 1:1 where a stalk meets its eye:

```sh
node still.mjs $PART/work/assembled/index.html --at 0 --out $OUT/assembled.png
crop $OUT/assembled.png 780 420 $OUT/assembled-eye.png
```

It is a snail. That is worth admitting before criticising it: everyone recognises it. Write down
in a sentence what else it is. (The repository's word for it is clip art.)

## 4. What the silhouette says

Interior detail is persuasive. The coil tells you "snail" whatever the outline is doing, and a
viewer's eye supplies the rest. To see what the **shape** says, take the detail away. Set
`SILHOUETTE = true`, export, and make two thumbnails:

```sh
node still.mjs $PART/work/assembled/index.html --at 0 --out $OUT/assembled-sil.png
thumb $OUT/assembled-sil.png 120 $OUT/assembled-sil-120.png
thumb $OUT/assembled-sil.png 60  $OUT/assembled-sil-60.png
thumb $OUT/assembled.png 60 $OUT/assembled-60.png
```

Set `SILHOUETTE` back to `false`. Now, looking at the full-size silhouette and at the two
thumbnails, answer in your notes. Do not answer from what you know the code draws; answer from
what the pixels show.

1. Which way is the snail going? What in the outline tells you?
2. Where does the shell sit on the body? Is it resting on the foot, or in front of it?
3. What does the head do? Is it part of the body, or attached to it?
4. At 60 px, what is left? Compare `assembled-60.png`, with its coil, against the silhouette at
   the same size.

<details>
<summary>After answering: what you should be seeing</summary>

1. Nothing says. The foot is an ellipse, symmetrical front to back; only the stalks tell you
   which end is the head.
2. The shell is a disc stood in front of a plate. Where the disc's bottom arc crosses the
   ellipse's top arc there is a sharp notch on each side: two curves crossing, not one thing
   resting on another.
3. The head is a ball stuck on the end of the plate, with a visible bump where the two curves meet
   ("the joins read as bumps").
4. At 60 px the coil is gone in both: three rings become one smudge. What is left is a ball on a
   plate with a smaller ball and two pins. It still says "snail", because that arrangement is the
   iconic snail. It says nothing about this snail, or about crawling.
</details>

Keep the four images. Section 9 repeats this with the designed snail, and the comparison is the
Part's main evidence.

## 5. Wobble is not a contour

The obvious first improvement is to make the machine curves look hand-drawn. The kit has a tool for
exactly that. In your scaffold, find `function cut` and `function ringPts` and read both with their
comments.

- `ringPts(x, y, rx, ry, n, rot)` returns `n` points round an ellipse.
- `cut(pts, rng, o)` runs a closed smooth curve through the points and then pushes each part of it
  in or out along its normal by a wobble built with `makeWob` from `rng` (Part 04), smoothed twice.
  `o.amp` is how far, in pixels: the comment says "2 is a drawn line, 8 is torn stock". It returns
  a `Path2D`.

Make a snapshot with a hand-wobbled shell:

```sh
mkdir -p $PART/work/faults
cp $PART/work/assembled/index.html $PART/work/faults/wobbled.html
```

In `faults/wobbled.html`, replace the shell line with:

```js
    const shell = cut(ringPts(470, 520, 185, 185, 12), sr, { amp: 8 });
```

**Predict**: does it read more like a snail's shell? Export it, look at full size and in the
silhouette view.

```sh
node still.mjs $PART/work/faults/wobbled.html --at 0 --out $OUT/wobbled.png
```

<details>
<summary>After looking: what you should be seeing</summary>

A slightly lumpy disc. The edge wavers by a few pixels, so it no longer looks machine-cut, but it
is still round everywhere, still has no base and no lip, still sits in front of the foot rather
than on it. The coil's rings are unchanged.
</details>

`docs/drawing.md` says it in six words: "A wobbled ellipse is still an ellipse." Waver changes the
**edge**; it does not change the **shape**. The shape is decided by where the points are, and here
they are still twelve points evenly round a circle. Part 04's egg was the same thing, and so, if
you look again, are the ellipse arms of Part 03's jellyfish.

## 6. Designing the foot

Generate the deliverable's file:

```sh
node new-riso.mjs --kind still --out $PART/work/designed/index.html
```

Start it as a copy of the assembled `drawArt` and scene: paste the same code, then replace parts
one at a time, checking the silhouette after each.

### The tools

Read `function curve` in your scaffold. It is a Catmull-Rom spline: a smooth curve that passes
**through** every point you give it, turning each gap between two points into `per` short
straight steps. Each piece of curve takes its direction from the points on either side, which has
two consequences you will use:

- **Where points are far apart and nearly in line, the curve is long and slow.** Where they are
  close together and turn sharply, it turns tightly. You choose the curvature by spacing the
  points, not by picking a radius.
- **A point given twice makes a corner.** The segment between the two copies has no length, so the
  curve arrives at the point along one direction and leaves along another. This is the doubled
  point in `BIRD`'s beak and tail, and in the kettle's base.

`cut` uses `curve` with the path closed, then adds its waver. So from now on a contour is a list of
points plus an `amp`, and designing a contour means deciding where the points go.

### The brief for the foot

A snail's foot and head are one continuous body. Before placing a single point, write down what the
outline has to say. For a garden snail crawling to the right, seen from the side:

- **The sole is nearly flat.** It is the surface the animal is gliding on.
- **The tail tapers to a point** behind the shell, low to the ground: that taper, more than
  anything else, says which way it is going.
- **The tail's top edge is one long slow curve**, rising from the tip toward the shell.
- **The neck lifts the head** clear of the ground in front of the shell, and the head is rounder
  and higher than the tail.
- **The front of the head is the one tight turn**, curving down to where it meets the sole.
- There are **corners** where the outline really changes direction abruptly: the tail tip, and the
  chin where the head meets the sole.

The part of the outline under the shell will be covered, so it only has to be somewhere sensible.

### Place the points

Plan the points on paper first, or directly as numbers in a 1080 frame with the sole around
y = 765 and the head around x = 880 so the snail sits where the assembled one did. Then write them
as a constant above the scene, clockwise from the tail tip, doubling the corners:

```js
// The foot and head as one contour, clockwise from the tail tip. A doubled point makes a corner.
const FOOT = [
  // your points
];
```

and build the foot from it at the top of `plates`, where the shared shapes go:

```js
    const foot = cut(FOOT, sr, { amp: 2.5 });
```

Replace the assembled `foot` and `head` with it (the eyes stay as they are for now).

To see where your points actually are, add a construction view. It prints a pink dot at every
point, a bigger one where a point is doubled, over the drawing:

```js
const SHOW_POINTS = false;  // true: mark the contours' control points in pink; doubled points larger
```

with the scene's inks extended so the construction view gets a plate of its own:

```js
  inks: (SILHOUETTE ? ['indigo'] : ['blue', 'orange']).concat(SHOW_POINTS ? ['pink'] : []),
```

and this as the first branch in `plates`, after the shared shapes and before the `SILHOUETTE`
branch:

```js
    if (ink === 'pink') {                            // construction view: where the points are
      for (const pts of [FOOT]) pts.forEach(([x, y], i) => {
        const doubled = i > 0 && x === pts[i - 1][0] && y === pts[i - 1][1];
        tone(g, 1); g.beginPath(); g.arc(x, y, doubled ? 10 : 5, 0, TAU); g.fill();
      });
      return;
    }
```

Iterate: export with `SHOW_POINTS = true`, look at the outline against its points, move points,
export again. Check the silhouette view as you go. Stop when every item of the brief is visible in
the silhouette.

<details>
<summary>After designing yours: one set of points, and what each group does</summary>

```js
const FOOT = [
  [150, 760], [150, 760],                              // tail tip: a corner
  [250, 738], [380, 700],                              // the tail rising, one long slow curve
  [520, 676], [640, 664],                              // under the shell
  [720, 640], [780, 606], [834, 590],                  // the neck lifting the head
  [878, 604], [902, 640], [898, 684],                  // round the front of the head: the tight turn
  [884, 712], [884, 712],                              // chin: where the head meets the sole, a corner
  [860, 748], [700, 766], [450, 770], [260, 766],      // the sole, almost flat
];
```

Notice the spacing. The tail's top edge gets two points over 230 px, so it is one slow curve. The
front of the head gets three points over 80 px, so it turns tightly. The sole's points are far
apart and almost level.
</details>

### Test the corner

Your tail tip is a doubled point. Make it single, export the silhouette view, and crop the tip:

```sh
node still.mjs $PART/work/designed/index.html --at 0 --out $OUT/tip-single.png
# double the tail-tip point again, then:
node still.mjs $PART/work/designed/index.html --at 0 --out $OUT/tip-double.png
crop $OUT/tip-single.png 120 700 $OUT/tip-single-crop.png
crop $OUT/tip-double.png 120 700 $OUT/tip-double-crop.png
```

(Use crop coordinates that put your own tail tip in the crop.)

<details>
<summary>After looking: what you should be seeing</summary>

With a single point the curve passes through the tip smoothly and the tail ends in a rounded,
blunt end. Doubled, it ends in a needle point. Look at the last few pixels of the needle: they
break into separate specks. Near the tip the shape is narrower than the screen's pitch, and a shape
that thin cannot print solid (the thin-line rule you will meet properly in Part 08).
</details>

One hazard to know before you need it. `docs/drawing.md` warns: "Tight concavities can overshoot
or self-intersect in `curve`; inspect. If a notch fills in, use explicit Bézier control or print
the mass and `carve` the bite." If a narrow inward notch in your outline comes out shallower than
you placed it, that is the spline smoothing through it, not your points being wrong.

## 7. Designing the shell

Now the shell, by the same method. Write its brief first. Here is the one the reference used; you
may change it if you look at snails and disagree:

- It is **not round**. It is fullest low at the front, where the newest and largest whorl is, and
  its back rises to a gentler bulge where the older whorls are.
- Its **base is flattened** where it rides on the foot: the shell sits on the body, it is not a
  disc in front of it.
- At the front of the base is the **lip** of the opening, where the shell meets the body: a
  corner.

Add `SHELL` as a second point list, build `const shell = cut(SHELL, sr, { amp: 2 });` directly
after the foot (so it always takes the same numbers from `sr`, Part 03), add `SHELL` to the list in
the construction view, and replace the assembled `shell`. The carve on the blue plate now removes
your designed shell from the foot, so the foot shows under it only where the shell's base leaves
it bare.

<details>
<summary>After designing yours: one set of points</summary>

```js
// The shell: a flattened base where it rides on the foot, a lip corner at the front.
const SHELL = [
  [640, 690], [640, 690],                              // the lip meets the body: a corner
  [672, 612], [668, 520], [626, 432],                  // the body whorl's full front
  [548, 364], [450, 340], [362, 366],                  // over the top
  [300, 430], [286, 520], [312, 610],                  // down the back
  [370, 670], [470, 694], [560, 700],                  // the base, flattened on the foot
];
```
</details>

Compare your shell with the wobbled one from section 5 in the silhouette view. Write down which of
your brief's items the wobbled disc could never have shown, whatever its `amp`.

## 8. Marks whose width means something

The shape is now designed. The lines are still the assembled ones: stalks and coil at a constant
9 px. Read `function nib` and the width profiles under it (`wTip`, `wSwell`, `wLeaf`, `wNib`) in
your scaffold, with their comments.

- `nib(pts, wfn, o)` runs a curve through `pts` (or uses them as they are with `raw: true`) and
  builds a closed ribbon around it, `wfn(u)` pixels to each side, where `u` runs from 0 at the first
  point to 1 at the last. It returns a `Path2D`, so a mark is a shape like any other: it can be
  printed, carved or used as a clip.
- A width profile is just a function of `u`. `wTip(w)` starts full and lifts to a point.
  `wSwell(w, at, k)` is a bump centred at `at`. `wLeaf(w, skew)` swells and closes at both ends.
  `wNib(c, w0, ang)` imitates a broad pen held at angle `ang`: the ribbon is wide where the path
  runs across the pen and thin where it runs along it.

The comment above `nib` says why this matters: "Canvas has no pressure, so a constant lineWidth is
the default and it is what makes stems, branches, whiskers and rigging read as wire."

### The tentacles

Each upper tentacle is a muscular stalk, thickest where it leaves the head and thinning toward the
eye at its tip. The lower feelers are short and taper to nothing. Replace the `stalks` function
with a `Path2D` of ribbons, built with the other shared shapes, and print it on the blue plate with
`print(g, stalks, 0.6)` in place of the stroke:

```js
    const stalks = new Path2D();                   // tentacles taper; roots start deep in the head
    stalks.addPath(nib([[800, 640], [806, 540], [822, 458]], u => 7 - 4 * u, { per: 16 }));
    // … the second upper tentacle, and a lower feeler with wTip
```

Three decisions are yours: the path of each tentacle (straight stalks read as pins; a slight curve
reads as muscle), the width profile, and where each one starts. The wave study's comment on its
lip explains the last: "The ribbon's blunt starting end has to begin deep inside the water, or it
prints as a flat cut across the face." A nib starts and ends square. Start each tentacle inside the
head.

Then the eyes. The obvious move is to add a bump to the end of the profile, for example
`u => 7 - 4 * u + wSwell(6, 1, 0.07)(u)`. Try it, export, and crop an eye.

<details>
<summary>After looking: what you should be seeing</summary>

The tip flares into a wedge or a fork, not a ball. A ribbon's end is cut square across its last
sample, so a width bump at the very end is sliced flat.
</details>

An eye is a small knob on the end of a stalk: a separate part with its own outline. Give it one,
`cut(ringPts(x, y, 9, 8, 8), sr, { amp: 0.8 })` at each tip, added to `stalks`, and remove the old
`eyes` from `body` (which is now just the foot: print `foot` directly). Update the `SILHOUETTE`
branch to print `stalks` as a shape too. This is the first place in this Part where a primitive is
the right answer, and section 11 comes back to why.

### The coil

The coil is the line where one turn of the shell meets the next, spiralling out from the apex and
ending at the lip. Its shape is not the lesson here, so it is supplied. Add this function above the
scene; it returns a dense polyline:

```js
// The coil: the suture between whorls, spiralling out from the apex to the lip.
// Its centre drifts from the apex toward the middle of the shell as it grows.
function coilPoints() {
  const pts = [], apex = [420, 452], mid = [476, 520];
  for (let i = 0; i <= 140; i++) {
    const u = i / 140, th = 0.42 - (1 - u) * 2.1 * TAU, r = 176 * Math.pow(u, 1.25);
    pts.push([lerp(apex[0], mid[0], u) + Math.cos(th) * r, lerp(apex[1], mid[1], u) + Math.sin(th) * r * 0.92]);
  }
  return curve(pts.concat([[648, 640], [640, 690]]), false, 4);   // on down the lip to its corner
}
```

(If your shell's apex, centre or lip are far from the reference's, adjust `apex`, `mid` and the
last two points so the coil lies inside your shell and ends at your lip.) Build it as a ribbon with
a held-pen width, among the shared shapes:

```js
    const coilLine = coilPoints();
    const coil = nib(coilLine, wNib(coilLine, 6, 0.6), { raw: true });
```

and print it where the old circles were, after the carve on the blue plate, clipped to the shell:
`g.save(); g.clip(shell); print(g, coil, 1); g.restore();`. Try two or three nib angles in place of
`0.6` and keep the one whose thick and thin parts you like best. Record the choice.

Compare the two versions at 1:1 where a tentacle meets the head, and where the coil turns:

```sh
node still.mjs $PART/work/designed/index.html --at 0 --out $OUT/designed.png
crop $OUT/assembled.png 780 560 $OUT/assembled-root.png
crop $OUT/designed.png  780 560 $OUT/designed-root.png
```

In your notes, say for each mark what its changing width tells the viewer that a constant width
could not: taper (where it is attached and where it ends), load or muscle (where it is thick), the
hand (where a held pen turned).

## 9. The silhouette again

Repeat section 4 exactly on the designed snail: `SILHOUETTE = true`, the full-size silhouette and
the 120 and 60 px thumbnails, plus the 60 px thumbnail of the finished colour version.

```sh
node still.mjs $PART/work/designed/index.html --at 0 --out $OUT/designed-sil.png
thumb $OUT/designed-sil.png 120 $OUT/designed-sil-120.png
thumb $OUT/designed-sil.png 60  $OUT/designed-sil-60.png
thumb $OUT/designed.png 60 $OUT/designed-60.png
```

Answer the same four questions, and put the eight images side by side, assembled and designed at
each size.

<details>
<summary>After answering: what the reference's version shows</summary>

1. It is going right: the tail tapers to a point behind, the head is lifted in front.
2. The shell sits on the foot. In the silhouette its outline runs down into the line of the back
   without a crease, where the assembled disc met the plate in a sharp notch on each side.
3. The head is the lifted end of the body, one outline with it, with no join.
4. At 60 px the coil is gone, as before. What is left is still a snail, and now a crawling one:
   the taper and the lifted head survive the reduction. The stalks thin to faint lines less than a
   pixel wide and barely survive; the eyes survive as dots.

Both versions say "snail" at 60 px. Only one says what the snail is doing. That is the difference
the silhouette study's comment means by "no part of the outline says what the subject is doing".
</details>

Record in your notes which identity cues survived each reduction, and which did not. The ones that
did not (the coil, the eyes' shape, the waver of the edge) are detail. Detail is welcome, but it
cannot carry a subject that its outline does not.

## 10. Edges: structural and diffusive

Every edge so far has been hard, because every shape so far has had one. Some edges in the world
are not: steam, fog, the glow round a light, the far end of a crack. `docs/drawing.md` puts the
rule in its last contour bullet: "Edges follow the world: diffusive ones (fog, glow, a crack's far
end, steam) break into dots; structural ones (window, rooftop, bell rim) stay hard. A softened
structural edge reads as a registration fault, not atmosphere."

A snail provides one of each. Its shell is hard. Its slime trail is a wet film that thins out and
dries behind it.

**The trail.** Add it as the **last** shared shape in `plates`, after the coil, so that every shape
before it keeps the numbers it already takes from `sr` (Part 04):

```js
    const trail = cut([[-40, 754], [150, 752], [150, 752], [300, 766], [-40, 774]], sr, { amp: 1.5 });
```

(adjust the points so the trail starts under your tail tip) and print it first on the blue plate,
with a coverage gradient that fades to nothing away from the snail, the same technique as Part 02's
strip:

```js
      g.save(); g.clip(trail);                       // the slime trail, drying away behind the tail
      const dry = g.createLinearGradient(-40, 0, 160, 0);
      dry.addColorStop(0, 'rgba(0,0,0,0)'); dry.addColorStop(1, 'rgba(0,0,0,0.5)');
      g.fillStyle = dry; tone(g, 1); g.fillRect(-40, 700, 360, 120); g.fillStyle = '#000';
      g.restore();
```

**The softened shell.** Make a snapshot and soften the shell's edge in it, by printing the shell as
a radial coverage gradient that stays solid most of the way out and fades to nothing at the edge:

```sh
cp $PART/work/designed/index.html $PART/work/faults/soft-shell.html
```

In `faults/soft-shell.html`, replace `print(g, shell, 1);` on the orange plate with:

```js
      g.save(); g.clip(shell);                       // the shell's edge softened: coverage fades out toward it
      const soft = g.createRadialGradient(478, 520, 0, 478, 520, 200);
      soft.addColorStop(0, 'rgba(0,0,0,1)'); soft.addColorStop(0.7, 'rgba(0,0,0,1)'); soft.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = soft; tone(g, 1); g.fillRect(0, 0, 1080, 1080); g.fillStyle = '#000';
      g.restore();
```

(centred on your shell, with a radius that reaches its edge). **Predict** what happens where the
softened shell meets the foot. Then export both and crop three places: the shell's upper front edge
in each version, the place where the shell's base meets the foot in each version, and the far end
of the trail.

```sh
node still.mjs $PART/work/designed/index.html   --at 0 --out $OUT/designed.png
node still.mjs $PART/work/faults/soft-shell.html --at 0 --out $OUT/soft-shell.png
crop $OUT/designed.png   600 400 $OUT/edge-hard.png
crop $OUT/soft-shell.png 600 400 $OUT/edge-soft.png
crop $OUT/designed.png   560 620 $OUT/join-hard.png
crop $OUT/soft-shell.png 560 620 $OUT/join-soft.png
crop $OUT/designed.png   20  700 $OUT/trail-end.png
```

<details>
<summary>After looking: what you should be seeing</summary>

The trail's end is dots growing smaller and sparser until there is only paper: it reads as a wet
film thinning out, and nothing about it looks wrong. The softened shell edge is the same kind of
pixels, dots shrinking toward the edge, and it looks like a mistake: a fuzzy halo round a hard
object, as if out of focus or badly printed. Where the soft shell meets the foot it is worse. The
blue plate's knockout is still the shell's hard outline, so between the fading orange and the hard
blue edge there is now a crescent of bare paper, a gap that belongs to neither ink. That is
exactly what a registration fault looks like.
</details>

The dots were the same in both places. What differed was whether the world has an edge there. A
hard object with a soft edge is not atmosphere; it is a print that missed. Keep `soft-shell.html`
as evidence.

## 11. When primitives and constant widths are right

This Part has argued for designed contours and variable marks. The repository does not use them
everywhere, and the places where it chooses otherwise are as instructive as the studies. Read
these three comments in [`prints/workings/index.html`](../../../../prints/workings/index.html):

1. Above `const mass` in `scene('gather'`, the glassblower's silhouette: "One silhouette assembled
   from overlapping solids rather than one re-entrant contour: `curve()` fills a notch back in, and
   at full coverage the overlaps are invisible, so the neck and the arms come for free."
2. Inside `scene('lines'`, the birds on the wire: "Assembled from overlapping solids, not one
   `cut()` contour. At 30 px a contour's head notch is averaged away by the Catmull-Rom and the
   edge wobble both, and what comes back is a dart; a head that is its own circle survives, and
   the head is most of what says bird."
3. Above `function towerPath`: "Steel is machine-made, so the members keep a constant width — the
   hand is in the endpoint jitter and in what the screen does to a 3 px bar, not in a taper that
   real angle iron does not have." Then read `function span` a few lines below: a conductor is a
   `nib` with a constant width, `() => w`.

And in `studies/index.html`, `scene('telescope'`: the radio dishes are an ellipse and two ribbons,
under the comment "a thumbnail, not a subject".

For each, write one sentence in your notes: what condition made the primitive or the constant
width the right choice there? Then check your own snail against them. Your eyes are small
separate knobs on the ends of stalks, which is the same reasoning as the birds' heads.

## 12. Compare with the reference

Now open [`project/index.html`](project/index.html). It is a freshly generated still whose ART
region holds one finished version of this Part's snail: `FOOT` and `SHELL` as given in the
sections above, the tapering tentacles with their eye knobs, the coil with `wNib` at 0.6, the
trail, and the `SILHOUETTE` and `SHOW_POINTS` switches.

Your snail should not be pixel-identical to it; your points and widths are your own. Compare them
as drawings instead. Export both in the silhouette view and as 60 px thumbnails, put them side by
side, and write down one place where your version says something more clearly than the reference,
and one place where the reference does. If you cannot find either, look harder: two designed
outlines of the same subject always make different decisions.

## 13. What this evidence is, and is not

The silhouette at full size and at 60 px, the construction view, and the 1:1 crops of edges and
marks are **construction** and **perceptual** evidence about shape: whether the outline says what
the subject is and what it is doing, whether corners and tapers land where you put them, whether
an edge reads as hard or diffusive. `verify.mjs --times 0` still passes, and still says nothing
about any of it.

Be honest about what the designed snail still lacks, and write it down. It is two flat tones: no
light, no volume, no contact with anything. The trail implies a ground that is not there. It sits
where the assembled snail sat, in the middle of the frame, because that was convenient. Its points
were placed from a verbal brief, not from looking at a snail. Parts 06, 07 and 09 deal with value,
composition and reference in that order.

## 14. Decisions you should be able to defend

In your notes, give for each a situation where you would choose the alternative.

**One designed contour rather than assembled primitives.** The problem: a subject's outline has to
carry its identity and its action before any interior detail helps, and primitives bring their own
curvature (one radius everywhere, bumps at the joins) and cannot say which way anything is going.
One contour through deliberately placed points gives you control of every flat, slow curve, tight
turn and corner. Separate primitives are the better choice when the subject is genuinely modular
(an eye on a stalk, a head on a 30 px bird), when a part must later move independently of the rest
(a limb that will be animated), or when the overlaps are invisible at full coverage and a single
outline would lose a notch to the spline, as in `gather`'s figure.

**A `nib` ribbon rather than a constant `lineWidth`.** The problem: a line's width is information
about attachment, load and the hand, and a constant width says "wire" whether you meant it or not.
A ribbon with a profile says where a stem is rooted, where a tentacle is muscular, where a pen
turned. A constant width is the better choice for things that are made at one width: steel
members, conductors and rigging, ruled lines, and deliberately uniform graphic marks, as in the
tower and the spans of `lines`. Even then the repository draws them as constant-width `nib`
ribbons, so they are shapes that can be printed and carved like any other.

## Before you move on

You should have, in `work/`:

- [ ] `assembled/index.html`: the supplied primitive snail with its `SILHOUETTE` switch.
- [ ] `designed/index.html`: your `FOOT` and `SHELL` point lists with doubled corners, tapering
  tentacles with separate eye knobs, a `wNib` coil, the trail built last from `sr`, and the
  `SILHOUETTE` and `SHOW_POINTS` switches; `verify.mjs --times 0` passes.
- [ ] `faults/`: `wobbled.html` and `soft-shell.html`.
- [ ] `NOTES.md`: the four silhouette answers for each version with the eight images named; your
  briefs for the foot and the shell; the corner test; what each mark's width says; the nib angle
  you chose; the edge comparison; the four "when primitives are right" sentences; the comparison
  with the reference; what the snail still lacks; the two decisions.

And in `out/course/05/` (regenerable): the studies, every export, silhouette and thumbnail, and
the crops.

You should be able to explain, without looking:

- why interior detail must be switched off to judge a silhouette, and why at more than one size;
- why wobble changes an edge but not a shape;
- how the spacing of points decides curvature in `curve`, and why a doubled point makes a corner;
- why a ribbon's width profile carries information, and why a bump at a ribbon's end prints as a
  wedge;
- why a softened hard edge reads as a fault while a diffusive edge built the same way reads as
  atmosphere;
- two situations where assembled primitives, and one where a constant width, are the better
  choice.

The sentence to carry forward: **drawing quality does not emerge automatically from procedural
complexity. The boundary and the mark shape must be authored deliberately.**

## Deliberately left for later

- **Value and form** (Part 06). The snail is two flat tones. How to give it light and volume
  without muddying it, and how to seat it on a ground, come next.
- **Composition** (Part 07). Where the snail sits in the frame, and how big, were not decided.
- **Texture** (Part 08). The shell's surface, the skin's wrinkles, grain and hatching are finish,
  and finish comes after shape.
- **Reference** (Part 09). The briefs in this Part came from general knowledge of snails. Looking
  at real ones, and recording what changes the drawing, is its own discipline.
- **Perspective** (Part 10). The snail is drawn flat, side-on; nothing here is projected.
- **Contours that move** (Parts 12–15). A contour whose points move over time is where Part 04's
  per-frame re-seeding from a key comes back.
