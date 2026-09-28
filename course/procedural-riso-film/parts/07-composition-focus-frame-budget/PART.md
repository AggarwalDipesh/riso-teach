# Part 07 — Composition, Focus, and the Frame Budget

Part 06 ended with an honest description of its own result: the snail is lit and grounded, "and it
is still in the middle of an empty frame, at a size nobody chose, on a ground made of one soft
shadow." That is what this Part changes.

Composition is usually taught as a set of rules about thirds and diagonals. The repository treats
it as something more measurable and more demanding: a distribution of **attention** (where the eye
goes, and in what order), **value** (where the lights and darks are) and **mass** (how much of the
frame reads as dark or solid). A frame can be full of ink and still light. A subject can be
beautifully drawn and still be unreadable, because three other things in the frame are the same
size, or because it sits on a ground of its own value. None of that is fixed by more detail.

You keep the snail. Composition is easiest to learn when the subject does not change, because then
every difference between two pictures is a composition decision. You will measure the centred
snail, measure the repository's composition studies with the repository's own method, read three
exemplars for viewpoint and moment, make three genuinely different pictures of the same snail,
break one on purpose, and develop one to native resolution in colour.

**You will make**

- `work/centred/`: a copy of Part 06's reference, the "before", measured.
- `work/thumbs/`: three value alternatives of the same snail, in one ink, that differ in viewpoint,
  crop, scale, depth and mass, not in palette.
- `work/faults/competitors.html`: your chosen alternative with three equal focal candidates, and
  the same three in a hierarchy.
- `work/frame/`: the chosen alternative developed in colour at native resolution. This is the
  Part's deliverable.
- `work/faults/no-accent.html`: the frame with its accent ink removed.
- `work/NOTES.md`: measurements, answers, your choice and why, the faults you met, and the three
  decisions.

**Builds on:** Part 06's snail (through a copy of its reference), and Parts 02–04 for everything the
snail now has to survive when it is placed in a scene: rescaling, plate ownership, keys.

**Supplied:** [`project/budget.mjs`](project/budget.mjs), the repository's occupancy and mass
measurement, ported from the Python in `docs/drawing.md` so that it runs with the tools you
already have. You may open and use it from section 1 on. Section 5 supplies the snail in a form
that can be placed anywhere. Section 7 supplies two props.

**Reference:** [`project/index.html`](project/index.html) is one developed frame, made with the
same scaffold and verified with the same tools. Your composition will differ from it and should.
Do not open it until section 11 tells you to. It is a snapshot: later Parts never change it.

---

## 1. Setup

```sh
cd tools
PART=../course/procedural-riso-film/parts/07-composition-focus-frame-budget
P06=../course/procedural-riso-film/parts/06-value-first-modelling-form
OUT=../out/course/07
FFMPEG=$(node -p "require('ffmpeg-static')")
mkdir -p $OUT
crop()    { "$FFMPEG" -loglevel error -y -i "$1" -vf "crop=120:120:$2:$3,scale=480:480:flags=neighbor" "$4"; }
thumb()   { "$FFMPEG" -loglevel error -y -i "$1" -vf "scale=$2:$2:flags=area" "$3"; }
gray()    { "$FFMPEG" -loglevel error -y -i "$1" -vf "format=gray" "$2"; }
squint()  { "$FFMPEG" -loglevel error -y -i "$1" -vf "format=gray,scale=120:120:flags=area" "$2"; }
diffimg() { "$FFMPEG" -loglevel error -y -i "$1" -i "$2" -filter_complex "[0]format=rgb24[a];[1]format=rgb24[b];[a][b]blend=all_mode=difference" "$3"; }
row() {  # row OUT SIZE A.png B.png ...: each frame reduced to SIZE px by averaging, side by side
  local out=$1 size=$2; shift 2; local -a ins; local chain="" tail="" n=0 f
  for f in "$@"; do
    ins+=(-i "$f"); chain="${chain}[${n}]scale=${size}:${size}:flags=area[c${n}];"; tail="${tail}[c${n}]"; n=$((n+1))
  done
  "$FFMPEG" -loglevel error -y "${ins[@]}" -filter_complex "${chain}${tail}hstack=inputs=${n}" "$out"
}
```

`crop` is Part 02's 1:1 crop, `thumb` Part 05's, `gray` and `squint` Part 06's value and small value
views, `diffimg` Part 04's difference image. `row` is new: it puts two or more frames side by side,
each reduced by averaging, so that you can compare whole compositions at thumbnail size.

**The budget instrument.** Read the header comment of `project/budget.mjs`, then the section it
implements, [*The frame budget*](../../../../docs/drawing.md#the-frame-budget) in
`docs/drawing.md`. The repository measures two things per frame:

- **occupancy**, the share of the frame that carries readable ink;
- **mass**, the share that reads as dark or solid.

Both are measured on 12 × 12 blocks, big enough that the screen's dots average away, against the
frame's own paper (its lightest 3% of blocks). `node $PART/project/budget.mjs frame.png` prints
the two numbers; `--map map.png` also writes a picture of the blocks: cream for paper, grey for
occupied, dark for mass. Run it from `tools/`, so that it finds the bundled ffmpeg.

## 2. The centred snail, measured

Copy Part 06's reference as the "before", and look at it the way this Part will look at everything:
at full size, as a small thumbnail, and as a budget.

```sh
mkdir -p $PART/work/centred
cp $P06/project/index.html $PART/work/centred/index.html
node still.mjs $PART/work/centred/index.html --at 0 --out $OUT/centred.png
thumb $OUT/centred.png 120 $OUT/centred-120.png
node $PART/project/budget.mjs $OUT/centred.png --map $OUT/centred-map.png
```

Answer in your notes, from the pixels and the map:

1. How far is the snail from each edge of the frame? Is anything cropped?
2. What share of the frame is printed at all, and what share of that is mass?
3. What is the empty paper around the snail doing? Is it shaped by anything?
4. Cover the snail with your thumb in the 120 px thumbnail. What is left?

<details>
<summary>After answering: what you should be seeing</summary>

1. About 150 px from the left and right edges, about 340 px above and 285 px below. Only the drying
   end of the trail runs off the left edge; the snail itself touches nothing. It spans nearly three
   quarters of the frame's width, centred.
2. About 18% occupancy and 10% mass. More than half of the blocks that carry ink read as mass: the
   snail is the frame's only ink, and most of it is solid pink, 0.8 blue or their overprint.
3. Nothing. It is what is left over after the snail was put down. No edge, no direction, no depth,
   no other thing gives it a shape.
4. Paper. The frame has no place in it, only a subject.
</details>

Now read [*Composition and focus*](../../../../docs/drawing.md#composition-and-focus) in
`docs/drawing.md`, all of it. Its second bullet names what you have: "Vary shot size: cropped by two
edges, or a tenth of the frame in empty sky, not everything middling and centred." The Part 06
snail is middling and centred. That was never a decision; it was where the snail landed when Part
05 placed its points.

Keep the distinction the third question points at. **Negative space** is empty area that has a job:
room in front of a subject to move into, isolation that makes something small matter, the gap
across which two things relate. Paper around a centred subject is not negative space. It is margin.

## 3. Covered is not heavy

The Part 06 snail has almost no occupancy and all of it is mass. The composition studies show the
opposite arrangements. Export them and measure them:

```sh
node shoot.mjs ../studies/composition.html --times 0,1,2,3 --engine firefox --out $OUT/comp
node $PART/project/budget.mjs $OUT/comp/t_00*.png --map $OUT/comp-map.png
```

Compare your numbers with the ones printed in *The frame budget*: "`budget` at 54% occupancy, 0.4%
mass; `deepen`, `window`, `lanterns` at 78–96% occupancy, 20–44% mass." They should agree to within
a point or two; if they do not, your instrument or your export is wrong, and it has to be fixed
before any number from it means anything. This check is the only reason `budget.mjs` deserves your
trust. It says nothing about whether the method is a good one; that is a separate question.

<details>
<summary>After measuring: the reference's numbers</summary>

About 55.1% / 0.4% for `budget`, 77.9% / 27.3% for `deepen`, 92.1% / 19.9% for `window` and
96.1% / 44.9% for `lanterns`. The Python in `docs/drawing.md`, run on the same PNGs, gives the same
figures to the decimal.
</details>

Now read the comment above each of the four scenes in
[`studies/composition.html`](../../../../studies/composition.html) and look at each frame beside
its map. Answer:

1. `budget` carries ink in more than half its blocks and almost no mass. What is the ink doing, and
   where is the one mass?
2. `lanterns` spends almost half its frame on mass. On what, and why can it afford to?
3. Which of the four would still read at 60 px, and what survives?

<details>
<summary>After answering</summary>

1. Sky and water are open screen, dots with paper between them: atmosphere, light and distance
   for almost nothing. The only mass is the boat's hull, "worth a fraction of a percent", and the
   comment says why the frame does not add more: "Adding a second dark thing here would cost more
   than opening the screen wider ever does."
2. On the night. The dark is the ground everything else is lit against: the lanterns are knocked
   out of it, and the nearest keeps an overprint dark under it. It can afford the mass because the
   lights are the subject and the dark is what makes them lights.
3. All four, and for the same reason: each has one thing with the frame's strongest contrast.
</details>

*The frame budget* puts the lesson in four words: **covered is not heavy**. "Screen and line fill a
frame almost free; mass is the expensive budget". Open screen makes atmosphere without spending a
dark. Mass is what a frame spends to say where its weight is, and every extra mass competes with
the one that matters.

One more piece of evidence, at the scale of a whole film. Open `films/window-seat/sheet.jpg`, twelve
frames of the repository's showcase film (you looked at it for its print in Part 02; look at it now
for its composition). Two things do not change across 78 seconds: the rounded window frame and a
glass of water on the sill, bottom right. What does change is mass: compare the 1.00 s cell (a light
sky over bright fields) with the 15.60 s cell (almost the whole window black with forest) and the
50.00 s cell (a night of star trails). Write down what the unchanging glass does for the viewer,
and what would be lost if it moved in every shot. You will come back to it in section 13.

## 4. Viewpoint and moment: three exemplars

Export the three whole-picture exemplars from `studies/index.html`:

```sh
node still.mjs ../studies/index.html --at 6 --out $OUT/kettle.png
node still.mjs ../studies/index.html --at 7 --out $OUT/wave.png
node still.mjs ../studies/index.html --at 8 --out $OUT/telescope.png
```

Each one reworks a scene that an earlier film drew weakly, and the header comment above
`/* ── exemplars` says how: "reworked by composition before technique: a viewpoint, a moment, a
value anchor and a place for the centre dot." Read the comment above each of `scene('kettle'`,
`scene('wave'` and `scene('telescope'` and fill in this table from the comments and the pictures:

| | kettle | wave | telescope |
|---|---|---|---|
| The moment or viewpoint chosen | | | |
| Where the subject sits, how large, what is cropped | | | |
| The darkest value, and why it is there | | | |
| What the centre dot stands for | | | |

<details>
<summary>After filling it in</summary>

| | kettle | wave | telescope |
|---|---|---|---|
| Moment or viewpoint | the instant it whistles | a barrel seen as an opening, not a shape | scale instead of detail |
| Placement | low and left "so the steam has somewhere to go"; the hob is cropped by three edges | the wave's mass is cropped by the bottom and both sides; a gull gives it its size | the sky takes nine tenths; the dishes are thumbnails on the horizon |
| Darkest value | the hob: "the darkest value in the frame, and it is a shape" | the hole: "the darkest value in the frame is the hole" | the ridge along the bottom and the night itself; the galaxy is "the only bright object" |
| The dot | the whistle, the sound's source | the far end of the tube, "where the eye already wants to go" | the galaxy's core |
</details>

Two lessons are in that table. The first is the bullet in *Composition and focus* that reads
"Originality is mostly viewpoint and moment". None of the three is a new subject. A kettle, a wave
and a radio telescope are the most familiar pictures there are; each exemplar is original because
of **when** and **from where** it is seen. The same will be true of your snail.

The second is the dot. These pictures were made for a film form, used by some of the repository's
short films, that keeps a small dot at the exact centre of every frame. That is a **fixed anchor**.
Each exemplar gives it a meaning in that picture (a sound's source, the throat of a tube, a
galaxy's core), and composes around it. *Composition and focus* records what happens otherwise:
"If a concept needs a fixed anchor, decide what it represents first; retrofitting the Resonance
(540, 540) dot into a wave study cost five iterations." Window Seat's glass is the same idea at the
scale of a film: it stands for the passenger's seat, so it never moves. (The quotation names the
form, Resonance. Part 19 comes back to it as one film form among several; you need nothing more
about it here.) Your snail has no such
anchor, and nothing in this Part asks it to.

## 5. A snail that can be placed

To compose the snail you have to be able to put it anywhere, at any size, on a ground that prints on
the same plates it does. Part 06's snail can do none of that. Its shapes are in frame coordinates at
one size; it takes its randomness from its scene; and it was written for plates that held nothing
else. Here is the same snail as a block you can place. It is supplied because the lesson is
composition, not refactoring, but every line in it applies something you learned earlier, and you
should be able to say which.

It needs `FOOT`, `SHELL` and `coilPoints` exactly as they are in `work/centred/index.html`. Copy
those three, then this:

```js
/* The snail, built once in its own coordinates (Part 06's frame: sole on y = 770, facing right)
   from its own keys, so it is the same snail in every scene it is placed in. 'snail:shape' is
   the key Part 06's scene gave its shapes, taken in the same order, so nothing is reseeded. */
const SNAIL = (() => {
  const r = rngFor('snail:shape');
  const foot = cut(FOOT, r, { amp: 2.5 });
  const shell = cut(SHELL, r, { amp: 2 });
  const stalks = new Path2D();                     // tentacles taper; roots start deep in the head
  stalks.addPath(nib([[800, 640], [806, 540], [822, 458]], u => 7 - 4 * u, { per: 16 }));
  stalks.addPath(nib([[830, 636], [868, 548], [904, 484]], u => 7 - 4 * u, { per: 16 }));
  stalks.addPath(nib([[872, 668], [906, 660], [930, 668]], wTip(6), { per: 10 }));  // lower feeler
  for (const [x, y] of [[823, 452], [906, 478]])                                   // the eyes: small knobs
    stalks.addPath(cut(ringPts(x, y, 9, 8, 8), r, { amp: 0.8 }));
  const coilLine = coilPoints();
  const coil = nib(coilLine, wNib(coilLine, 6, 0.6), { raw: true });
  const trail = cut([[-40, 754], [150, 752], [150, 752], [300, 766], [-40, 774]], r, { amp: 1.5 });
  return { foot, shell, stalks, coil, trail };
})();

// Where a snail goes: the middle of its sole lands on (x, y), scaled by s.
const snailMatrix = at => new DOMMatrix().translate(at.x, at.y).scale(at.s).translate(-500, -770);

/** The snail's outline, placed, as its three parts: plane each at one value for a value thumbnail.
    (One Path2D holding all three would not do: addPath does not merge shapes, and where two
    parts overlap with opposite winding the fill leaves a hole.) */
const snailParts = at => [SNAIL.foot, SNAIL.shell, SNAIL.stalks].map(part => {
  const p = new Path2D(); p.addPath(part, snailMatrix(at)); return p;
});

/** The modelled snail of Part 06, placed, on the blue and pink plates of whatever scene holds it.
    One light, high and ahead of the snail: its ramps are centred toward it in snail space. */
function snail(g, ink, at) {
  const { foot, shell, stalks, coil, trail } = SNAIL;
  g.save();
  const m = snailMatrix(at); g.transform(m.a, m.b, m.c, m.d, m.e, m.f);   // snail space, before any screening
  if (ink === 'blue') {
    for (const part of [foot, stalks]) {           // each part owns its value over the scene's ink,
      plane(g, part, 0.8);                         // then takes the one light's ramp, clipped to it:
      g.save(); g.clip(part);                      // plane resets the roots, so no pixel is lit twice
      shade(g, null, { cut: true, x: 860, y: 560, r0: 0, r: 560, stops: [[0, 0.45], [0.5, 0.25], [1, 0]] });
      g.restore();
    }
    g.save(); g.clip(trail);                       // the slime trail, drying away behind the tail
    const dry = g.createLinearGradient(-40, 0, 160, 0);
    dry.addColorStop(0, 'rgba(0,0,0,0)'); dry.addColorStop(1, 'rgba(0,0,0,0.5)');
    g.fillStyle = dry; tone(g, 1); g.fillRect(-40, 700, 360, 120); g.fillStyle = '#000';
    g.restore();
    bed(g, 430, 772, 420, 20, rngFor('snail:blue'), 0.6);   // contact: the sole pressed on its ground
    carve(g, shell);                               // the shell stands in front of the body
    g.save(); g.clip(shell); print(g, coil, 1); g.restore();
    g.save(); g.clip(shell);                       // the one dark: where the shell turns away and meets the body
    shade(g, null, { x: 318, y: 676, r0: 0, r: 120, stops: [[0, 1], [0.4, 0.9], [1, 0]] });
    g.restore();
  }
  if (ink === 'pink') {
    carve(g, foot); carve(g, stalks);              // the body clears whatever the scene printed under it
    plane(g, shell, 1);
    g.save(); g.clip(shell);                       // light taken out of the shell toward the source
    shade(g, null, { cut: true, x: 600, y: 420, r0: 0, r: 330, stops: [[0, 0.65], [0.45, 0.32], [1, 0]] });
    g.restore();
    carve(g, cut(ringPts(596, 420, 26, 16, 8, -0.6), rngFor('snail:pink'), { amp: 1.5 }));  // the highlight is paper
  }
  if (ink !== 'blue' && ink !== 'pink')            // on any other plate the snail is a hole
    for (const part of [foot, shell, stalks]) carve(g, part);
  g.restore();
}
```

Four changes from Part 06, each an earlier lesson applied to a new situation.

**Its randomness belongs to the snail.** In a scene, `sr` is `rngFor(id + ':shape')`: it is keyed by
the scene's id (look at `bakeScene`). A snail built from `sr` inside a scene called `'far'` would be
a differently wobbled snail from one inside `'close'`. Part 04's rule, one key for each thing,
answers it: the snail is built once from keys of its own. And they are exactly the keys Part 06's
scene, which was called `'snail'`, consumed: `'snail:shape'` for the shapes in the same order,
`'snail:blue'` for the contact shadow, `'snail:pink'` for the highlight. Part 04 said to freeze keys
once a picture is approved. This keeps them.

**It is placed by transforming the drawing, not the picture.** `snailMatrix(at)` moves and scales
the snail's coordinates while its plates are being drawn, before anything is screened. The screen
is applied later, at the frame's own pitch. Part 02 showed what scaling a screened bitmap does
(moiré); scaling the geometry does nothing of the kind: a snail at `s: 0.2` is printed with the same
dots as a snail at `s: 2`. What does change with scale is everything measured in pixels inside the
snail: the waver of its edges, the width of its tentacles. Keep that in mind when you make it small.

**It owns its values over a printed ground.** Part 06's plates held nothing but the snail, so
`print` and `plane` gave the same result, and one ramp across the whole blue plate lit only the
body. In a scene, the blue plate may already hold sky or stone under the snail. Now the foot and
tentacles are `plane`d, and the light's ramp is clipped to each part straight after its `plane`.
Part 06's rule was "one ramp per light"; the principle behind it is that **every pixel is lit
once**, and `plane` resetting the tentacle roots before their own ramp keeps it true. (The obvious
alternative, one clip to the foot and tentacles together, brings Part 06's dark roots straight
back: see the note in `snailParts`.)

**It clears every plate it does not print on.** Part 03: "Clear the subject out of every overlay
plate, not just the ground." On the pink plate the body now removes whatever the scene put there;
on any other plate the whole snail is a hole.

**Check it.** A snail placed at `{ x: 500, y: 770, s: 1 }` should be Part 06's snail. Generate a
still, paste the three constants and the block, and add:

```js
scene('snail', {
  inks: ['blue', 'pink'],
  plates(g, ink) { snail(g, ink, { x: 500, y: 770, s: 1 }); },
});

function drawArt(t) {
  paintBaked('snail');
}
```

```sh
node new-riso.mjs --kind still --out $PART/work/placed/index.html
# paste FOOT, SHELL, coilPoints, the block and the scene above into its ART region, then:
node still.mjs $PART/work/placed/index.html --at 0 --out $OUT/placed.png
diffimg $OUT/centred.png $OUT/placed.png $OUT/placed-diff.png
```

<details>
<summary>After looking: what you should be seeing</summary>

Black, except for about a hundred single pixels scattered along the outline of the body and the
tentacles. Those are the clips' antialiased edges: a clipped ramp lightens an edge pixel partly,
where Part 06's unclipped ramp lightened it fully. Everything else, including every dot of the
shell and every speck of starvation, is identical, because the scene is still called `'snail'` and
the snail still takes its numbers from the same keys. (Starvation is keyed by the scene's id, so in
a scene with another name its flecks will move. That is expected.)
</details>

## 6. Three pictures of the same snail

Read *Prove the hardest picture first* in
[`docs/visual-development.md`](../../../../docs/visual-development.md#prove-the-hardest-picture-first),
its first paragraph: "draw small alternatives differing in camera height, crop, depth and value
grouping (palette swaps don't count); pick the one where action and subject read most easily."

That is this section. Before you start, one constraint and one freedom:

- **The snail is drawn side-on, from its own height.** A view from above would need a new drawing,
  which is Part 09's and Part 10's business. So the camera stays near the ground. But "near the
  ground" still leaves a great deal: the camera can be close or far, a little above or a little
  below whatever the snail is on, which moves the horizon; the frame can crop the snail or leave it
  small in a large space; the world around it can be one plane or several.
- **Everything else is yours.** Where the snail is, what it is on, what is beyond it, what time of
  day, what it is about to do.

### The file

A composition you can compare with others should sit next to them. Make one file whose seconds are
your three alternatives, the way each second of `studies/index.html` is one study:

```sh
node new-riso.mjs --kind film --duration 3 --out $PART/work/thumbs/index.html
```

It is a three-second "film" only so that the tools can shoot it; nothing moves. Paste `FOOT`,
`SHELL`, `coilPoints` and the snail block into its ART region, then three scenes and a `drawArt`
that shows one per second:

```js
const rectPath = (x, y, w, h) => { const p = new Path2D(); p.rect(x, y, w, h); return p; };
const FULL = rectPath(-10, -10, W + 20, W + 20);

scene('A', {
  inks: ['blue'],
  plates(g, ink, rng, sr) {
    // grounds and planes, then:
    for (const p of snailParts({ x: 540, y: 800, s: 0.5 })) plane(g, p, 0.8);
  },
});
// scene('B', …), scene('C', …)

const ALTS = ['A', 'B', 'C'];
function drawArt(t) {
  paintBaked(ALTS[Math.min(ALTS.length - 1, Math.floor(t))]);
}
```

### The rules for a value thumbnail

- **One ink, a few values.** Blue, because it is one of the two inks whose screens have enough dot
  sizes to print a smooth ramp (Part 06: blue and pink have about forty, the others between four and
  ten; a sky ramped in indigo shows its steps even in a reduced view). Use paper, one or two mids and a
  dark: that is a value plan, and it is what you are comparing.
- **The snail is one shape.** `snailParts(at)` gives its foot, shell and tentacles placed; `plane`
  each at one value. Its interior modelling is not what is being decided yet.
- **Big shapes only.** A sky is one `shade`; a ground is one shape; a far plane is one skyline. For
  skylines the scaffold has `ridgeAt(y, { rng, amp, freq })`, a function from `u` (0 just past the
  left edge, 1 just past the right) to a height, and `ridge(f)`, which closes that line down to the bottom of
  the frame as a shape. Read both comments in your scaffold. Straight-edged things (a wall, a step,
  a box) are rectangles.
- **Different in at least three of**: scale (how much of the frame the snail fills), crop (which
  edges cut it), camera height (where the horizon falls against the snail), depth (how many planes,
  and which is darkest), mass (where the frame's weight is). Not palette.
- **Each one is about something.** Write one sentence per alternative: what is the snail doing,
  and what does the frame say about it?

Shoot all three, then look at them in two ways:

```sh
node shoot.mjs $PART/work/thumbs/index.html --times 0,1,2 --sheet --cols 3 --cell 360 --engine firefox --out $OUT/thumbs
row $OUT/thumbs-row.png 360 $OUT/thumbs/t_000.000.png $OUT/thumbs/t_001.000.png $OUT/thumbs/t_002.000.png
row $OUT/thumbs-120.png 120 $OUT/thumbs/t_000.000.png $OUT/thumbs/t_001.000.png $OUT/thumbs/t_002.000.png
node $PART/project/budget.mjs $OUT/thumbs/t_00*.png
```

`--sheet` is new: `shoot.mjs` lays its frames out as a contact sheet, `sheet.png` in the output
folder, reduced by the browser. Compare its cells with `thumbs-row.png`, which is reduced by
averaging. Where a ramp looks faintly striped in the sheet and smooth in the row, the stripes were
made by the reduction, not by your plates; Part 08 is about telling those apart. For judging big
value groups, trust the averaged row.

Iterate until each alternative says its sentence at 120 px. Then answer, for each one, from the
120 px row:

1. Where does your eye land first, and where does it go next?
2. What is the snail doing? Could someone who has not read your sentence say?
3. Where is the frame's mass, and is it where the picture's weight should be?
4. Is there anywhere the snail's outline touches a line or an edge of the same value, so that
   part of it disappears?

<details>
<summary>After designing yours: one set of three</summary>

The reference made these (in the order of its sentences: a portrait, a small traveller in a big
world, and an arrival at an edge):

```js
// A — close: the snail twice its Part 06 size, cropped by the left and bottom edges.
scene('A', {
  inks: ['blue'],
  plates(g, ink, rng, sr) {
    shade(g, FULL, { x0: 0, y0: 0, x1: 0, y1: W, stops: [[0, 0.1], [1, 0.3]] });   // soft garden, far behind
    plane(g, cut([[-40, 1000], [400, 990], [1120, 1010], [1120, 1120], [-40, 1120]], sr, { amp: 3 }), 0.5);
    for (const p of snailParts({ x: 150, y: 1010, s: 2 })) plane(g, p, 0.8);
  },
});

// B — far: the snail a tenth of the frame's width, on the top of a long wall, under a big sky.
scene('B', {
  inks: ['blue'],
  plates(g, ink, rng, sr) {
    shade(g, FULL, { x0: 0, y0: 0, x1: 0, y1: 800, stops: [[0, 0.35], [1, 0.03]] });  // sky, paler to the horizon
    plane(g, rectPath(-10, 800, W + 20, 300), 0.5);                                  // the wall's face
    carve(g, nib([[-10, 802], [700, 802]], () => 3, { per: 4 }));                    // the trail along its top
    for (const p of snailParts({ x: 790, y: 800, s: 0.16 })) plane(g, p, 0.95);
  },
});

// C — edge: the snail at a step's edge, the garden dropping away below and beyond.
scene('C', {
  inks: ['blue'],
  plates(g, ink, rng, sr) {
    const HZ = 620, EDGE = 770;
    shade(g, FULL, { x0: 0, y0: 0, x1: 0, y1: HZ, stops: [[0, 0.3], [1, 0.05]] });          // sky
    const hedge = ridge(ridgeAt(HZ - 40, { rng: sr, amp: 26, freq: 4 }), {});
    plane(g, hedge, 0.28);                                                                 // far hedge, in haze
    const lawn = rectPath(-10, HZ, W + 20, W - HZ + 20);
    carve(g, lawn);
    shade(g, lawn, { x0: 0, y0: HZ, x1: 0, y1: W, stops: [[0, 0.2], [1, 0.55]] });         // lower lawn, nearer = darker
    plane(g, rectPath(-10, HZ, EDGE + 10, W - HZ + 20), 0.78);                              // the step's face
    for (const p of snailParts({ x: 440, y: HZ, s: 0.85 })) plane(g, p, 0.55);
  },
});
```

Their budgets are about 76% / 44% (A), 83% / 0.4% (B) and 89% / 32% (C). A is heavy: the snail
itself is most of the mass, and the frame is a portrait. B is the `budget` study's arrangement: open
screen everywhere and one tiny mass, the snail, which is the darkest thing in the frame. C spends its
mass on the step.

The reference chose C, because it is the only one of the three in which the snail is doing
something that the frame shows the consequence of: A shows a snail, B shows a distance, C shows an
arrival at an edge with somewhere to go beyond it. Its thumbnail also shows C's first problem, before
a single colour: look where the tail and sole meet the step. The snail's 0.55 and the step's 0.78
are close enough that the tail, the one part of the outline that says which way the snail is going,
dissolves into the step. The thumbnail found it; section 8 fixes it.
</details>

Choose one alternative. In your notes, write why, in terms of what reads at 120 px, not what you
like drawing. If two read equally well, choose the one whose moment is more specific.

## 7. Three things the same size

The telescope exemplar's comment names a failure you can now produce on purpose: "Three things the
same size in the same frame always compete." Make a file with two scenes:

```sh
node new-riso.mjs --kind film --duration 2 --out $PART/work/faults/competitors.html
```

Paste the snail block again, and these two props, which are deliberately plain:

```js
// A flowerpot standing on (x, y), h tall: a tapered body under a rim.
function pot(x, y, h) {
  const p = new Path2D();
  p.moveTo(x - h * 0.33, y); p.lineTo(x + h * 0.33, y);
  p.lineTo(x + h * 0.45, y - h * 0.8); p.lineTo(x - h * 0.45, y - h * 0.8); p.closePath();
  p.rect(x - h * 0.52, y - h, h * 1.04, h * 0.22);
  return p;
}
// A toadstool standing on (x, y), h tall: a stem under a domed cap.
function toadstool(x, y, h) {
  const p = new Path2D();
  p.rect(x - h * 0.12, y - h * 0.6, h * 0.24, h * 0.6);
  p.ellipse(x, y - h * 0.55, h * 0.5, h * 0.45, 0, Math.PI, TAU);
  return p;
}
```

Scene `'equal'`: your chosen composition's ground, with the snail, the pot and the toadstool all at
about the same height and the same value, each on a plausible surface. Scene `'ranked'`: the same
ground and the same three things, arranged so that there is one subject. You may not delete either
prop. You may move, scale, crop and re-value them.

```sh
node shoot.mjs $PART/work/faults/competitors.html --times 0,1 --engine firefox --out $OUT/competitors
row $OUT/competitors-row.png 360 $OUT/competitors/t_000.000.png $OUT/competitors/t_001.000.png
node $PART/project/budget.mjs $OUT/competitors/t_00*.png
```

Look at `competitors-row.png` for a second, look away, and write down what the picture was of.
Do it for each half.

<details>
<summary>After trying it: what the reference's version showed</summary>

In `'equal'` the reference stood a pot and the snail side by side on the step, both about 250 px
tall at 0.55, and a toadstool of the same size and value on the lawn below. It reads as an
inventory: a pot, a snail, a toadstool. The eye goes to each in turn and settles on none, and the
snail, though it is the most carefully drawn thing in the frame, is the least legible, because at
that size its tentacles are a few pixels wide.

In `'ranked'` the pot moved to the left edge, bigger and cropped, at 0.7 against the step's 0.78:
it became a dark vertical at the frame's edge, part of the place rather than a thing in it. The
toadstool became 64 px tall, far down the lawn near the horizon, only a little darker than the
haze: it became distance. The snail went back to its size in C.

The budgets: about 88% / 32% for `'equal'` and 90% / 35% for `'ranked'`. The two numbers barely
moved. The instrument measures how much ink and how much mass; it cannot see hierarchy, which is
entirely about how the same ink is distributed.
</details>

Write down which tools you used to rank the three. The usual ones are scale, contrast against
what is behind it, crop, position (near the frame's edge, near its focus, in the distance), and
detail. *Composition and focus* has the principle: "One area of high detail; simplify the rest."

## 8. Developing the frame

Now build the chosen alternative in colour at 1080. This is the Part's deliverable.

```sh
node new-riso.mjs --kind still --out $PART/work/frame/index.html
```

Paste the three constants and the snail block, and build your scene. You have all the plate
mechanics you need. What this section adds is an order of decisions, and a list of the faults you
are most likely to meet, each with the way to see it.

### Decide before drawing

Write these in your notes first, and put them as a comment above the scene, the way `gather` and
`lines` in `prints/workings` begin with a paragraph of decisions:

1. **The value plan**, now for the whole frame (Part 06 did it for the snail): paper, the light
   group, the mid group, the dark; which areas belong to each. The snail's own values are fixed by
   Part 06 (a mid body, a pink shell, one small overprint dark); the frame's other groups have to be
   decided around them.
2. **One focal commitment.** Where the eye should end up. Put the frame's strongest contrast
   there: its hardest edge, and its darkest dark next to its lightest light. Anywhere else with
   that much contrast is a competitor.
3. **The eye path.** In what order should the viewer see things, and what leads the eye from one
   to the next: a line (a trail, an edge, a tentacle), a direction the subject faces, a row of
   things?
4. **Where the mass goes.** Mass is the expensive budget. Spend it on one thing, and give it a
   structural reason: a near plane, a shadow, a night.
5. **Depth.** Read [*Depth*](../../../../docs/drawing.md#depth) in `docs/drawing.md`, all of it. The
   far plane prints over the sky without clearing it, so it inherits the sky's value ("That is
   haze"), with its own ramp to sink its base; nearer planes `plane` what they stand in front of; a
   near plane cropped by the frame is a depth cue in itself.
6. **Repeats**, if you have any. The last bullet of *Composition and focus*: "Equal repeats read as
   several subjects; decreasing emphasis (nearest full, each next lower, furthest nearly paper, far
   ones losing their overprint dark first) reads as one event across distance." Look at the
   `lanterns` study and at `lines` in `prints/workings` (its header and the comment above the
   birds) before you place a row of anything.
7. **Edges.** Part 05 separated structural edges (hard) from diffusive ones (broken into dots).
   Composition adds a hierarchy: the hardest, cleanest edges belong at the focus; far things soften
   into haze.
8. **The light.** The snail's ramps assume one light, high and ahead of it. Keep your scene's light
   there, or move the snail's ramp centres to match.

### Faults you are likely to meet

These are the faults the reference met while it was developed, in the order it met them. Check for
each after every change, with the views named.

**The subject at its ground's value vanishes.** The first colour pass printed the step's face at
about the same blue as the snail's body. The snail's tail, sole and contact shadow disappeared into
the stone, and the snail appeared to float above a blue block. *Depth* says it in one line: "A
silhouette at its plane's tone vanishes". *See it* in the `squint` view and at 120 px, where the
tail's taper should still point back along the ground. *Fix it* by moving one of the two values
apart, changing the ground's hue, or separating them with a narrow lit edge between them.

**A line through the focus.** With the horizon at the step's height, the far hedge ran straight
through the snail's head. A line that passes through, or just touches, the focus (a horizon, an
edge, a branch) splits it or welds it to something else; the usual name for it is a tangency.
*See it* at 120 px. *Fix it* by moving the camera: a camera a little lower put the horizon below the
step and left the head and tentacles against open sky.

**Scene ink under the subject on a plate the subject does not print.** The pink dawn low in the sky
printed under the snail's blue body and turned it violet, because Part 06's snail never had to
clear the pink plate. The block you pasted now clears it. Any other object you place must follow the
same rule. *See it* by isolating the plate (Parts 02–03), or by measuring the colour inside the
subject with Part 06's `swatch`.

**A ramp on an ink that cannot print one.** A soft yellow glow round a sun printed as a hard ring:
yellow, like orange, has only a few dot sizes at low coverage (Part 06), so the fade stepped from
some dots to none. *See it* at 1:1. *Fix it* with a hard shape that is meant to be hard, or a ramp on
an ink that can print it.

**A spline that overshoots a corner.** A step's top edge built with `cut` through one very short
segment next to a very long one looped out past the corner and printed a dark blob in the air. Part
05 warned that tight turns can overshoot in `curve`. A cut stone step is a made thing with straight
edges, and Part 05's section 11 applies: a rectangle is the right primitive. *See it* at 1:1 on every
corner.

### Check as you go

After each change:

```sh
node still.mjs $PART/work/frame/index.html --at 0 --out $OUT/frame.png
thumb  $OUT/frame.png 120 $OUT/frame-120.png
squint $OUT/frame.png $OUT/frame-squint.png
node $PART/project/budget.mjs $OUT/frame.png
```

Stop when the frame says its sentence at 120 px, when the squint view has the value groups your plan
names, and when nothing on the list above is left. Then run `node verify.mjs
$PART/work/frame/index.html --times 0`.

## 9. The accent, tested by removal

Your frame may have a hue outside its working pair, like the reference's small yellow sun. Or you may
have wanted one. *Composition and focus* has a test for it: "A hue outside the scene's working pair
must be earned by meaning. Test by removal: if meaning survives, it was decoration, and decoration
turns a third overprint brown. One such element is a default, not a limit."

Read the comment above `scene('window'` in `studies/composition.html`: "Take the warm ink away and
the picture is about nothing, which is the test that lets it stay." And the last paragraph of the
comment above `scene('lines'` in `prints/workings`: the aviation lamp is "the one earned hue in the
frame, and the only warm mark in it, which is what lets 11 px of orange hold against a 790 px
tower".

Test yours. Removing the ink, not the thing, is the point: whatever the accent's plate cleared on the
other plates stays cleared.

```sh
cp $PART/work/frame/index.html $PART/work/faults/no-accent.html
# in no-accent.html, delete the accent ink from the scene's inks list, then:
node still.mjs $PART/work/faults/no-accent.html --at 0 --out $OUT/no-accent.png
row $OUT/accent-ab.png 540 $OUT/frame.png $OUT/no-accent.png
node $PART/project/budget.mjs $OUT/frame.png $OUT/no-accent.png
```

Write down what the picture is about in each half. If the sentence is the same, the accent is
decoration: delete it from the frame. If your frame has no accent, add one somewhere that seems
pleasant (a few yellow flowers, a yellow rim), then run the same test on it.

<details>
<summary>After testing: what the reference found</summary>

The reference's yellow is a sun 44 px across, low on the horizon, at the far end of a row of
stepping stones. Without the yellow, what is left is the disc the blue plate cleared for it: paper,
on a sky that is nearly paper at the horizon. It all but disappears, and the row of stones leads
nowhere. With it, the stones lead to the sun, and the picture is a snail at the edge of a drop at
dawn, with a way on. The reference kept it.

The budgets of the two versions differ by a tenth of a percent. The accent is about a tenth of a
percent of the frame, and it is what the picture's ending is about. No block count will tell you that.
</details>

## 10. Three scales of inspection

The finished frame has to work at three sizes, and each size answers a different question.

**Thumbnail (60 and 120 px): what is it, and where does the eye go?**

```sh
thumb $OUT/frame.png 60 $OUT/frame-60.png
```

The subject, the action and the one focal commitment should all survive at 120 px, and the
subject should at 60. Texture, marks and interior detail are not expected to.

**Normal viewing (the page in Firefox, 720 CSS pixels): does it hold together?** Open
`work/frame/index.html`. Look for a minute. Write down the order in which you looked at things, and
compare it with the eye path you planned.

**1:1 (crops): is it built right where it matters?** Crop the focus and the contact:

```sh
crop $OUT/frame.png X Y $OUT/frame-focus.png     # where the focal commitment is
crop $OUT/frame.png X Y $OUT/frame-contact.png   # where the snail meets its ground
```

At 1:1 check that the silhouette's edge is clean against whatever is behind it, that the contact
reads, and that there is no tangency the thumbnail hid.

**The budget, as description.** Run `budget.mjs` with `--map` once more, and write the two numbers
in your notes beside the centred snail's, with one sentence on what changed. The numbers describe
where the frame spends its ink. They do not certify that it spends it well: section 7 showed two
frames with the same budget and different hierarchies; section 9 showed the same budget with and
without the picture's meaning.

## 11. Compare with the reference

Now open [`project/index.html`](project/index.html). Read the comment above `scene('edge'` first: it
is the reference's decisions written down before the code, as yours should be above your scene.

```sh
node still.mjs $PART/project/index.html --at 0 --out $OUT/project.png
row $OUT/frame-vs-project.png 540 $OUT/frame.png $OUT/project.png
row $OUT/frame-vs-project-120.png 120 $OUT/frame.png $OUT/project.png
node $PART/project/budget.mjs $OUT/project.png
```

Your frame should look nothing like it unless you chose the same alternative; even then your
decisions will differ. Compare them as compositions: for each, write the eye path as you actually
experience it, where the mass is and why, and one thing the other does better. Its budget is about
76% occupancy and 27% mass, against the centred snail's 18% and 10%.

Notice what the reference did not do. The snail's drawing is unchanged from Part 06; it is only
placed and scaled. Everything that makes this a better picture than the centred one happened around
it.

## 12. What this evidence is, and is not

The thumbnails, the squint view and the budget are **perceptual** evidence about composition:
where value and mass are, what survives reduction, where the strongest contrast sits. The 1:1 crops
are **construction** evidence about edges and contact. `verify.mjs --times 0` is **technical**
evidence that the frame is exactly reproducible. The two tests in sections 7 and 9 showed the limit
of the one number you now have: the budget describes a distribution of ink and cannot see hierarchy
or meaning.

None of this establishes that the composition is good. The eye path you wrote down is your own; it
has not been checked against anyone else's eye. And be specific about what the frame still lacks. Its
surfaces are flat screen with no material. If it has repeats in depth (the reference's stones),
their sizes and spacing were placed by eye in screen space, not constructed. The light was chosen,
not observed. Write, in your notes, what you would change first, and which Part you expect to teach
it.

## 13. Decisions you should be able to defend

In your notes, give for each a situation where you would choose the alternative.

**Sparse or dense.** Neither is the default. The problem: a frame has to direct attention, and both
emptiness and fullness can do it. Sparse composition (the `budget` study, `lines`, the reference's
thumbnail B) isolates a subject, gives it room to move into, and keeps it legible at a glance; it is
better for isolation, anticipation and anything that must read instantly. Dense composition (the
`lanterns` study, the telescope's night at about 64% mass, Window Seat's forest) is better when mass
or immersion is the subject: a night, a crowd, a flood. It works only while the hierarchy stays clear,
because "marks without hierarchy are clutter" (*The frame budget*).

**A fixed central anchor, or a focus that goes where the action is.** The problem: the eye needs
somewhere to go, and a picture can either decide that place once for all frames or per picture. A
fixed anchor works when it means something: the exemplars' dot is a sound's source or a galaxy's
core; Window Seat's glass is the passenger's seat, which is why it never moves while everything else
does. Without that meaning it is a constraint the picture has to fight ("five iterations"). A focus
placed per picture is better when the subject's action or journey decides where the eye should be:
the snail's head is where the edge is. Across a film the same trade-off becomes whether the eye stays
put while shots change or travels with the action, which Parts 18 and 19 take up.

**A measured budget, or intuition.** The problem: density is hard to judge by eye. Measurement found
things intuition missed here: the centred snail's ink was nearly all mass; thumbnails that felt
empty were 76–89% occupied, because open screen is ink. It is also blind to everything that made the
reference work: hierarchy (section 7) and meaning (section 9). Measure when you suspect a density
pattern, or when comparing passages of a film; rely on intuition, and say so, for meaning and taste,
and never treat the numbers as a quota. `docs/drawing.md` says of its own measurements: "That is this
piece's rhythm, not a rule".

## Before you move on

You should have, in `work/`:

- [ ] `centred/index.html`: the unchanged copy of Part 06's reference.
- [ ] `placed/index.html`: the snail block at `{ x: 500, y: 770, s: 1 }`; its difference from
  `centred` is black except along the outline.
- [ ] `thumbs/index.html`: three value alternatives in blue, different in at least three of scale,
  crop, camera height, depth and mass, each with its sentence.
- [ ] `faults/competitors.html`: `'equal'` and `'ranked'`.
- [ ] `frame/index.html`: the chosen alternative in colour, with its decisions as a comment above
  the scene; `verify.mjs --times 0` passes.
- [ ] `faults/no-accent.html`: the frame without its accent ink.
- [ ] `NOTES.md`: the centred snail's answers and budget; the composition studies' numbers against
  the doc's; the four-scene answers; the Window Seat observation; the exemplar table; the placement
  check; your three sentences, the thumbnails' answers and budgets, and the choice with its reason;
  the competitors' result and the ranking tools you used; the frame's decisions; each fault you met,
  how you saw it and how you fixed it; the accent test and its verdict; the three-scale inspection;
  the comparison with the reference; what the frame still lacks; the three decisions.

And in `out/course/07/` (regenerable): every export, sheet, row, map, crop and thumbnail.

You should be able to explain, without looking:

- why margin around a centred subject is not negative space;
- the difference between occupancy and mass, and why open screen is cheap and mass is not;
- what "originality is mostly viewpoint and moment" means for a subject everyone has seen;
- why a placed subject takes its randomness from its own keys, is scaled as geometry and not as a
  bitmap, `plane`s its values, and clears every plate it does not print;
- why three equal things compete, and five ways to rank them;
- why a subject at its ground's value disappears, and what a tangency does to a focus;
- how to test an accent, and why the budget cannot.

The sentence to carry forward: **composition is a distribution of attention, value, and mass, not a
layer added after drawing.**

## Deliberately left for later

- **Texture and print finish** (Part 08). Every surface in your frame is flat screen. Which
  surfaces get marks, what the marks say about material and light, and how to tell a real print
  defect from one a reduced view invented.
- **Reference** (Part 09). The garden, the step and the light were invented, not looked at.
- **Constructed space** (Part 10). Anything receding in your frame (a row of stones, a wall, a
  path) was placed by eye in screen space. Projecting it from a camera is a different, checkable
  method.
- **Eye movement over time** (Parts 12–18). In a still the eye path is a route through one frame. In
  a film, the eye has to be led from one moment to the next.
- **Shot-to-shot handoffs and editorial pacing** (Parts 18–19). How the focus of one shot hands the
  eye to the next, and how long each picture is held.
