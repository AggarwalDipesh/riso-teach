# Part 08 — Print Finish and Native-Resolution Judgment

Your Part 07 frame is composed: it has a subject, a focus, an eye path and a value structure. Every
surface in it is still flat screen. The stone has no grain, the air has no moisture, the shell
has no gloss. This is the point at which almost everyone reaches for texture: grain over
everything, hatching in the shadows, speckle for "print feel". It is also the point at which
texture does the most damage, because it is easy to add, it looks like effort, and it can hide the
fact that nothing underneath it changed.

The repository's rule is in a heading of `docs/drawing.md`: **Texture, last.** "Added last, cut
first." This Part is about what "last" buys you: by now you know what every surface is and what it
has to do, so each mark can answer a question about it. It is also about a second, quieter skill:
knowing whether what you are looking at is in the print at all. A reduced view of a halftoned
frame invents patterns that are not there and hides small faults that are. Before you change
anything, you will learn to say which of three kinds of problem you are looking at: a **drawing**
problem, a **print** problem, or a **display-sampling** problem, and to settle the question at
native resolution.

**You will make**

- `work/finished/`: the Part 07 reference frame with texture that answers questions about form,
  material and light. This is the Part's deliverable.
- `work/faults/`: `overtextured.html` (texture used to manufacture quality), `swapped.html` (dots
  and lines used backwards), `tentacles-coverage.html` and `tentacles-width.html` (a thin line
  faded two ways).
- `work/screens/`: a screen test of all seven inks, and `supercell.html`, the same test with one
  screen changed in the engine.
- `work/finished-2160.html`: the finished frame re-rasterised at twice the size.
- `work/NOTES.md`: the labels, measurements, crops, questions and answers, and the two decisions.

**Builds on:** Part 07's reference frame, through a copy, so that the measurements below match what
you see. Part 07's file is a snapshot: copy it; never edit it. When you have finished, apply the same
process to your own Part 07 frame. Part 06's orange-shell fault comes back in section 9.

**Supplied:** [`project/bands.mjs`](project/bands.mjs), the block-mean tone check from `docs/drawing.md`
ported to the tools you have, usable from section 1. Part 07's `budget.mjs` is used as it is.

**Reference:** [`project/index.html`](project/index.html) is the finished frame. Do not open it until
section 12 tells you to. It is a snapshot: later Parts never change it.

---

## 1. Setup

```sh
cd tools
PART=../course/procedural-riso-film/parts/08-print-finish-native-judgment
P07=../course/procedural-riso-film/parts/07-composition-focus-frame-budget
OUT=../out/course/08
FFMPEG=$(node -p "require('ffmpeg-static')")
mkdir -p $OUT
crop()   { "$FFMPEG" -loglevel error -y -i "$1" -vf "crop=120:120:$2:$3,scale=480:480:flags=neighbor" "$4"; }
thumb()  { "$FFMPEG" -loglevel error -y -i "$1" -vf "scale=$2:$2:flags=area" "$3"; }
squint() { "$FFMPEG" -loglevel error -y -i "$1" -vf "format=gray,scale=120:120:flags=area" "$2"; }
sample() { "$FFMPEG" -loglevel error -y -i "$1" -vf "scale=$2:$2:flags=neighbor" "$3"; }
row() {  # row OUT SIZE A.png B.png ...: each frame reduced to SIZE px by averaging, side by side
  local out=$1 size=$2; shift 2; local -a ins; local chain="" tail="" n=0 f
  for f in "$@"; do
    ins+=(-i "$f"); chain="${chain}[${n}]scale=${size}:${size}:flags=area[c${n}];"; tail="${tail}[c${n}]"; n=$((n+1))
  done
  "$FFMPEG" -loglevel error -y "${ins[@]}" -filter_complex "${chain}${tail}hstack=inputs=${n}" "$out"
}
BUDGET=$P07/project/budget.mjs
BANDS=$PART/project/bands.mjs
```

`row` and the others are Part 07's helpers. `sample in.png SIZE out.png` is new and deliberately
bad: it reduces a frame by keeping one pixel in every few and throwing the rest away, as cheap
previews do. The new instrument is `bands.mjs`. Read its header comment, then
[*Judging a frame*](../../../../docs/drawing.md#judging-a-frame) in `docs/drawing.md`, whose method it
implements. `node $BANDS frame.png X Y W H N` cuts the rectangle into `N` strips from top to bottom
(`--across` for left to right) and prints each strip's mean lightness and its change from the strip
before. Each strip averages thousands of pixels, so dots and grain disappear and only **tone** is
left. A smooth ramp changes by similar amounts from strip to strip; a ramp the screen has
quantised shows runs of nearly equal strips with jumps between them.

Copy Part 07's reference and export it:

```sh
mkdir -p $PART/work/finished
cp $P07/project/index.html $PART/work/finished/index.html
node still.mjs $P07/project/index.html --at 0 --out $OUT/part07.png
```

## 2. The finish that is already there

Read [*The reference*](../../../../docs/quality-bar.md#the-reference) in `docs/quality-bar.md` again.
You read it in Part 02 as a description of the medium. Read it now as a list of what a finished riso
print shows at 1:1: "Restraint more than texture", "Darks are overprints", "Each ink keeps its
screen angle", "Starvation is load-bearing", "Small contours sell registration", paper "cloudier
than 'subtle grain'".

Then look for each of them in the Part 07 frame, which has no texture at all:

```sh
crop $OUT/part07.png 300 800 $OUT/p07-step.png      # the step's near-solid face
crop $OUT/part07.png 820 80  $OUT/p07-sky.png       # open sky
crop $OUT/part07.png 200 540 $OUT/p07-shell.png     # the shell's base against the body
crop $OUT/part07.png 260 380 $OUT/p07-coil.png      # the coil over the shell
crop $OUT/part07.png 200 500 $OUT/p07-dark.png      # the shell's one dark
```

For each crop, write which bullet of *The reference* it shows, and which part of the engine made it.
You met every one of them in Parts 02–04: `starve`, `bakePaper`, the `REG` offsets, the `SCREEN`
angles, the multiply of one plate over another.

<details>
<summary>After labelling: what you should be seeing</summary>

- **The step:** blue and pink dots closed almost solid, with scattered pale flecks where ink did not
  land. That is `starve`, run on every plate of every baked scene ("Perfect solids look
  laser-printed").
- **The sky:** blue dots with cream between them, and the cream is not flat: faint blotches and the
  odd fibre. That is `bakePaper`.
- **The shell's base:** the pink shell and the hole the blue plate cleared for it do not coincide.
  Along the base, where the shell meets the body, a thin violet line two to four pixels deep shows
  where the pink overlaps the body's blue. On the opposite edges the pink stops a few pixels short
  of the hole. That is registration: each plate's fixed `REG` offset, pink and blue about four
  pixels apart.
- **The coil:** blue dots and pink dots in rows at two different angles, overprinting deep violet.
  Each ink keeps its `SCREEN` angle.
- **The dark:** blue over near-solid pink, the darkest thing on the snail, and not one black pixel.
</details>

This is the most important observation of the Part. **The print's texture is already in every
frame the engine makes.** Starvation, paper, registration and screen are not decisions you add; they
are properties of the medium the engine simulates. Adding grain "so it looks like riso" doubles
something that is already there. Texture, in the sense of this Part, is something else: marks that
say what a surface is made of, how light falls on it, or how much weight it has. Every one of those
is a question about the drawing, and every one can be answered wrongly.

## 3. The reduced view lies

Now look at the same frame the way it usually gets looked at: small.

```sh
node shoot.mjs $P07/project/index.html --times 0 --size 300 --engine firefox --out $OUT/at-300
sample $OUT/part07.png 300 $OUT/sampled-300.png
row $OUT/reduced-vs-averaged.png 300 $OUT/at-300/t_000.000.png $OUT/sampled-300.png $OUT/part07.png
```

`shoot.mjs --size 300` captures the frame the way a small preview in a browser does: the browser
shrinks the 1080 canvas to 300 px with its own scaler. `sample` makes the cheapest reduction there
is. `row` puts them side by side with the native PNG reduced by averaging every block of pixels
(`row` reduces all three to 300 px, which leaves the first two as they are). Part 02 showed what
rescaling a screened plate does; this is the same thing done by the viewer instead of the code.

Look at the first two thirds of `reduced-vs-averaged.png`, enlarged in your image viewer if you like, and
write down everything that looks like a defect: patterns, bands, textures you did not draw.
**Before doing anything else**, label each one: is it a **drawing** problem (a shape, value or
arrangement you drew), a **print** problem (something the plates or the screen really do), or a
**display-sampling** problem (something the reduction made)? A label is a hypothesis. Then settle
it at native resolution:

```sh
crop $OUT/part07.png 300 800 $OUT/step-native.png
node $BANDS $OUT/part07.png 40 660 560 400 8          # the step, top to bottom
node $BANDS $OUT/part07.png 700 40 340 640 8          # the sky right of the snail, top to bottom
```

<details>
<summary>After looking: what the reference's reductions showed</summary>

The sampled reduction, and the reference's capture (taken in Chromium; your browser's scaler may
make a milder or a different pattern), are covered in a coarse checker weave, and the step, a plain
near-solid face, shows rings and whorls like watered silk. The averaged third has none of it: the
sky is a smooth blue fading to pink, the step is flat. At 1:1 the step is uniform dots with
starvation flecks; nothing in it is a ring. Its strip means fall evenly from about 73 to 52, two to
four at a time: the pink ramp that deepens it toward its foot. The sky's strip means rise from
about 194 to 217, two to six at a time, and drop a little where the pink dawn band begins.

Every pattern in the capture was **display-sampling**. None of it is in the print.
</details>

[*Judging a frame*](../../../../docs/drawing.md#judging-a-frame) records the same trap in the
repository's own work: "A halftoned 1080 frame shown scaled down beats against the sampling grid and
invents banding. A sky showing three hard bands measured 99, 99, 100, 99, 100, 104, 106, 108 in 80
px rows: a smooth ramp. Confirm banding, moiré or a weak silhouette at 1:1 before acting". The
failure to avoid is acting on the capture: "fixing" rings in the step with a texture, or softening
a sky that has no bands. The opposite failure is as real. The capture made the snail's tentacles
look fine; at 1:1 they are the thinnest marks in the frame, and section 8 shows how easily they
break.

Keep the three labels. From here on, every observation in your notes gets one before it gets a fix.

## 4. Texture, last: the repository's study

Export the texture study and the composition studies' two texture languages:

```sh
node still.mjs ../studies/index.html --at 4 --out $OUT/study-texture.png
node shoot.mjs ../studies/composition.html --times 1 --engine firefox --out $OUT/deepen
thumb $OUT/study-texture.png 340 $OUT/study-texture-340.png
```

Read [*Texture, last*](../../../../docs/drawing.md#texture-last) in `docs/drawing.md`, all of it,
then `scene('texture'` in [`studies/index.html`](../../../../studies/index.html) with its comments.
Left: a whale printed as "one screen, whole animal". Right: the same whale with a ramp for its
turning form, pleats hatched as removed ink, a dry pass, spray "only where the light already is",
one small overprint under the jaw.

Answer, from the study:

1. For each of the right whale's marks, what question about the animal does it answer?
2. Look at `study-texture-340.png`, the study at contact-sheet size. What difference between the two
   whales survives at 340 px, and what does not?
3. The comment inside the blue branch says why spray is kept where it is. What is the alternative
   it rejects?

<details>
<summary>After answering</summary>

1. The ramp: which way the light is, and that the body is round. The hatched pleats: what the
   underside is made of. The dry pass: the skin's surface where the light rakes across it. The
   spray: the edge that catches the light. The overprint: where the jaw turns under.
2. At 340 px the two whales differ mostly in value and colour (the lit top, the dark under the jaw,
   the yellow light); the pleats, the dry pass and the spray are nearly invisible. *Texture, last*
   says so: "At 340 px contact-sheet size the texture A/B is hardest to tell apart while silhouette,
   tone and depth A/Bs are obvious".
3. Spray over the whole form: "Stipple spread over a whole form eats the silhouette, which is worth
   more than any texture."
</details>

## 5. The tempting version

Make the version everyone makes first, so that you have seen it:

```sh
mkdir -p $PART/work/faults
cp $PART/work/finished/index.html $PART/work/faults/overtextured.html
```

In `overtextured.html`, "improve" the frame with the three most common moves: spray the whole
snail, hatch the sky, and scatter grain over everything. On the blue plate, after `snail(g, ink, AT)`:

```js
      hatch(g, sky, rng, { ang: -0.5, gap: 9, w: 2, a: 0.35 });                       // "more texture": the sky hatched
      for (const p of snailParts(AT)) {                                                // the whole subject sprayed
        g.save(); g.clip(p);
        spray(g, null, rngFor('over:blue'), { cut: true, n: 40000, r0: 1, r1: 3.5, a: 0.9, box: [0, 280, 700, 400], density: () => 0.5 });
        g.restore();
      }
```

and on the pink plate, after `snail(g, ink, AT)`:

```js
      for (const p of snailParts(AT)) {
        g.save(); g.clip(p);
        spray(g, null, rngFor('over:pink'), { cut: true, n: 40000, r0: 1, r1: 3.5, a: 0.9, box: [0, 280, 700, 400], density: () => 0.5 });
        g.restore();
      }
      spray(g, null, rngFor('over:grain'), { n: 30000, r0: 0.8, r1: 2.4, a: 0.8, box: [0, 0, W, W], density: () => 0.25 });
```

`hatch(g, path, rng, o)` and `spray(g, path, rng, o)` are the kit's line and grain tools; read both
comments in your scaffold now. `spray` places `n` dots in `box`, keeping each with probability
`density(x, y)`; with `cut: true` it removes ink instead of adding it. Each spray here is clipped to
one of the snail's parts, so it lands on the snail and nowhere else.

**Predict** what it does to the frame at 240 px and in the squint view. Then:

```sh
node still.mjs $PART/work/faults/overtextured.html --at 0 --out $OUT/overtextured.png
row $OUT/over-ab.png 240 $OUT/part07.png $OUT/overtextured.png
squint $OUT/part07.png $OUT/part07-squint.png
squint $OUT/overtextured.png $OUT/over-squint.png
node $BUDGET $OUT/part07.png $OUT/overtextured.png
```

<details>
<summary>After looking: what you should be seeing</summary>

At 240 px the frame looks busier and older, which is what the moves were for. It also reads worse.
The snail is grainy all over; its edge breaks up, so in the squint view it is a mottled grey shape
losing contrast against the sky, where before it was a clean dark shape. The pink grain sits on the
sky, the step and the lawn alike, so it says nothing about any of them. The budget goes from about
76% occupancy and 27% mass to about 89% and 24%: the frame carries more ink and less weight, and
the weight it lost was the subject's.
</details>

Label what you see: this is a **drawing** fault produced with print tools. *Texture, last* names it:
"Spray over a whole form eats the silhouette; keep it where the light is." And `docs/visual-development.md`
puts it as a rule of evidence: "Texture is not evidence steps 1–4 worked."

## 6. One question at a time

Now the real thing, in `work/finished/index.html`. Add one treatment at a time. Before each, write
in your notes the **question** it answers about a surface: what it is made of, where the light hits
it, how much weight it has. If you cannot write the question, do not add the mark. After each,
export and look at 1:1 where the mark is, and at 120 px to confirm the composition did not change:

```sh
node still.mjs $PART/work/finished/index.html --at 0 --out $OUT/finished.png
thumb $OUT/finished.png 120 $OUT/finished-120.png
```

The Part 07 frame has five surfaces worth asking about: the step's face, the step's foot, the far
lawn, the sun and the shell. The reference's answers are below each prompt. Try your own first.

### The step's face: what is it made of?

It is cut stone, lit from high up, and the light rakes across it just under the lip. Raking light
on a worked surface shows its grain. *Texture, last* names the mark: "fine-gap `hatch` with `cut` for
a dry pass": fine lines of ink taken away, like a brush that ran dry.

One thing about `hatch` before you use it. Its `fade(u)` thins lines "across the run", and the run is
not your shape: `hatch` draws a field of lines `W * 1.6` either side of the frame's centre, so `u`
goes from 0 to 1 across 3456 px, most of it outside the frame. To fade by page position, convert.
For nearly horizontal lines, put this above the scene, next to `SUN`:

```js
const hatchY = u => CY - W * 1.6 + u * W * 3.2;   // the page y of a near-horizontal hatch line at u
```

This is easy to get wrong, and the repository has an example. The comment near the end of
`scene('lines'` in `prints/workings` says "Weight at the very foot of the frame: a deepening is line,
thickening inward, and it is the only place in this print that carries any." Its fade is
`clamp((u - 0.88) * 7.0, 0, 1)`. Work out the page y where that starts, then look:

```sh
node still.mjs ../prints/workings/index.html --at 1 --out $OUT/lines.png
crop $OUT/lines.png 500 940 $OUT/lines-foot.png
```

<details>
<summary>After looking</summary>

`u = 0.88` is at about y = 1850, far below the frame. The crop of the foot shows the snow's blue and
indigo dots, a tuft of grass, and no hatching at all. The mark the comment describes is not in the
print. A comment is a statement of intent, not evidence; the pixels are the evidence. (Notice also
that `lines` reads perfectly well without it.)
</details>

<details>
<summary>After trying yours: the reference's dry pass</summary>

On both plates, after the step is printed and before the lip:

```js
      hatch(g, step, rngFor('edge:dry'), { ang: 0.02, gap: 4, w: 1.4, cut: true, a: 0.7,   // dry pass: dressed stone
            fade: u => clamp(1 - (hatchY(u) - TOP) / 220, 0, 1) });                        // catching light under the lip
```

It takes its randomness from a key of its own, `'edge:dry'`, not from each plate's `rng`, so the
blue and pink plates draw the **same** streaks (Part 04: one key for each thing). With each plate's
own `rng`, the two plates would lose ink in different places and the streaks would print as
scattered blue and pink scratches instead of pale lines through the stone.
</details>

### The step's foot: where is its weight?

The step is the near plane, the frame's mass. *Texture, last* gives the language: "hatching thickens
inward (deep water, shadow under a mass, the nearest plane's weight)". In Part 07 the step deepened
toward its foot through a smooth pink ramp. Replace that ramp with hatching whose lines thicken and
darken toward the bottom.

<details>
<summary>After trying yours: the reference's foot</summary>

On the pink plate, in place of the two lines that clear the step and ramp it (`carve(g, step)` and
the `shade(g, step, …)` after it):

```js
      plane(g, step, 0.4);                                 // the step: pink under its blue, a violet stone
      hatch(g, step, rng, { ang: 0.04, gap: 10, w: 3.4, a: 1,                 // weight at the foot: line, thickening inward
            fade: u => clamp((hatchY(u) - 700) / 330, 0, 1) });
```

followed by the pink plate's copy of the dry pass. `hatch` both widens (`w` times the fade) and
strengthens (`a` times the fade) each line, so near the bottom the lines are wide and nearly solid,
and near the top they vanish.
</details>

### The far lawn: what is between the snail and the horizon?

Air, at dawn, over wet grass: mist. Mist is "something going to nothing", and *Texture, last* says
what that is made of: "Dots thin outward (fog, glow, something to nothing)". Here the mist is light,
so the grain is ink taken away, with `spray(…, { cut: true })`, thickest at the horizon and thinning
toward the viewer.

<details>
<summary>After trying yours: the reference's mist</summary>

On the blue plate, after the stones:

```js
      spray(g, lawn, rngFor('edge:mist'), { cut: true, n: 9000, r0: 0.8, r1: 3.2, a: 0.9,   // mist on the far lawn:
            box: [EDGE, HZ - 10, W - EDGE, 250],                                          // grain thinning toward us
            density: (x, y) => 0.6 * clamp(1 - (y - HZ) / 230, 0, 1) });
```

The far stones lose their edges in it, which is what distance should do to them.
</details>

### The sun: does it give light?

In Part 07, a smooth yellow glow round the sun printed as a hard ring, because yellow's screen has
almost no small dot sizes. A glow does not have to be a coverage ramp. The telescope exemplar's
galaxy is "stipple density along two log spirals, which is a gradient made of grain" (its comment).
Grain thinning outward is a glow any ink can print. It needs paper to land on: yellow over the pink
dawn prints orange, so open the pink plate round the sun first, with a soft knockout (Part 03).

<details>
<summary>After trying yours: the reference's glow</summary>

On the pink plate, after the dawn:

```js
      shade(g, null, { cut: true, x: SUN[0], y: SUN[1], r0: 20, r: 140, stops: [[0, 1], [0.5, 0.6], [1, 0]] });  // open it for the glow
```

and on the yellow plate, after the sun:

```js
      spray(g, null, rngFor('edge:glow'), { n: 9000, r0: 0.6, r1: 1.7, a: 1,     // its glow: grain thinning outward
            box: [SUN[0] - 130, SUN[1] - 120, 260, 130],
            density: (x, y) => 0.9 * Math.pow(clamp(1 - Math.hypot(x - SUN[0], y - SUN[1]) / 120, 0, 1), 2) });
```
</details>

### The shell: what is its surface like?

A snail's shell is smooth and slightly glossy, and the gloss is only visible where the light is. The
texture study's rule: spray "only where the light already is". This is a change to the snail itself,
so it goes in the snail block's pink branch, in snail space, after the highlight.

<details>
<summary>After trying yours: the reference's shell</summary>

```js
    g.save(); g.clip(shell);                       // a glossy shoulder: grain taken out where the light already is
    spray(g, null, rngFor('snail:shine'), { cut: true, n: 900, r0: 1.2, r1: 3.4, a: 0.85, box: [470, 330, 240, 220],
          density: (x, y) => clamp(1.1 - Math.hypot(x - 600, (y - 420) * 1.3) / 140, 0, 1) });
    g.restore();
```

The shell is a clip here, not `spray`'s `path` argument. `spray` tests its `path` with Canvas's
`isPointInPath`, which takes the point in page coordinates, and inside the snail block the context
is in snail space. Its dots are sized in snail space too. At the snail's scale of 0.75 they print
about 1–2.5 px across,
which is why `r0` is larger than elsewhere: a knockout much smaller than the screen's pitch barely
changes the print (`.claude/rules/riso-plates.md`: "A knock narrower than the screen pitch (~4.6 px)
or under ~0.4 barely prints").
</details>

### What was left alone

The sky, the body and the lawn's near half stay flat screen. Write, for each, why nothing was added.
The quality bar's first bullet is "Restraint more than texture".

## 7. Dots or lines

The finished frame now uses both texture languages: grain thinning outward in the mist and the
glow, line thickening inward at the step's foot. *Texture, last*: "Sprayed depth reads as
evaporating, hatched dissipation as a screen door. One gradient is dots or lines; if a frame uses
both, they belong to different surfaces."

Read the comment above `scene('deepen'` in `studies/composition.html` (you exported it in section 4):
"Run either one backwards and the water stops meaning what it means." Then run yours backwards:

```sh
cp $PART/work/finished/index.html $PART/work/faults/swapped.html
```

In `swapped.html`, make the mist out of line and the step's weight out of dots:

```js
      hatch(g, lawn, rngFor('edge:mist'), { ang: 0.02, gap: 7, w: 2.4, cut: true, a: 0.9,   // mist as line, run backwards
            fade: u => 0.8 * clamp(1 - (hatchY(u) - HZ) / 230, 0, 1) });
```

in place of the mist's `spray`, and

```js
      spray(g, step, rng, { n: 60000, r0: 1, r1: 3.2, a: 1, box: [0, 640, EDGE, 440],   // weight as dots, run backwards
            density: (x, y) => 0.8 * clamp((y - 700) / 330, 0, 1) });
```

in place of the foot's `hatch`. Export and put the lower halves side by side:

```sh
node still.mjs $PART/work/faults/swapped.html --at 0 --out $OUT/swapped.png
"$FFMPEG" -loglevel error -y -i $OUT/finished.png -i $OUT/swapped.png \
  -filter_complex "[0]crop=540:440:540:640[a];[1]crop=540:440:540:640[b];[a][b]hstack" $OUT/swapped-ab.png
```

<details>
<summary>After looking</summary>

The mist made of line is a set of pale horizontal stripes over the lawn: a blind, or a screen door,
not air. The weight made of dots is a mottle at the foot of the step, more like damp or crumbling than
like mass. Both are in the same places as before and fade the same way. What changed is what the
marks say.
</details>

## 8. A thin line, faded two ways

The snail's tentacles are the thinnest marks in the frame: at a scale of 0.75 they are about 10 px
wide at the root and 4–5 px at the tip. Suppose you want them to look more delicate toward the eyes.
The obvious way is to make them lighter there. Try it, and the other way, in two copies:

```sh
cp $PART/work/finished/index.html $PART/work/faults/tentacles-coverage.html
cp $PART/work/finished/index.html $PART/work/faults/tentacles-width.html
```

In `tentacles-coverage.html`, in the snail block's blue branch, after the loop that planes and lights
the foot and tentacles:

```js
    g.save(); g.clip(stalks);                      // the tentacles made more delicate toward the tips: by coverage
    shade(g, null, { cut: true, x0: 0, y0: 600, x1: 0, y1: 450, stops: [[0, 0], [1, 0.75]] });
    g.restore();
```

In `tentacles-width.html`, make the two upper tentacles taper more instead: in `SNAIL`, change both
profiles `u => 7 - 4 * u` to `u => 7 - 5.6 * u`. **Predict** both, then:

```sh
node still.mjs $PART/work/faults/tentacles-coverage.html --at 0 --out $OUT/tentacles-coverage.png
node still.mjs $PART/work/faults/tentacles-width.html    --at 0 --out $OUT/tentacles-width.png
crop $OUT/finished.png           550 370 $OUT/t-finished.png
crop $OUT/tentacles-coverage.png 550 370 $OUT/t-coverage.png
crop $OUT/tentacles-width.png    550 370 $OUT/t-width.png
```

<details>
<summary>After looking: what you should be seeing</summary>

Faded by coverage, the tentacles break into separate dots toward the top, and the eye knobs vanish
into the sky's screen: the tip of a 5 px ribbon at a quarter of its coverage is a few scattered
dots. Faded by
width, they thin toward the eyes and stay continuous, knobs and all.
</details>

This is the rule in `.claude/rules/riso-plates.md`: "`coverage` is the dot screen, `alpha` is plate
opacity. Fade line work on alpha and width: punching a screen through a 5px stroke breaks it into
dashes rather than lightening it." In a baked plate everything is coverage, so width is the tool you
have. The other half of the rule, **alpha**, is the `alpha` option of Part 04's `inkPass`: a whole
live pass made more transparent, like Part 02's faded strip. That is acceptable for a line narrower
than a screen cell, which has no dots to lose, and it is how moving line work fades; Part 16 comes
back to it.

## 9. A defect that really is in the print

Section 3's patterns were not in the print. Part 06's orange shell was: at 1:1 its ramp jumped from
near-solid to a much smaller dot, and Part 06 promised this Part would say why. Make a screen test: a
still with one strip per ink, each ramping from nothing to 50% coverage.

```sh
node new-riso.mjs --kind still --out $PART/work/screens/index.html
```

```js
// One strip per ink, each ramping from nothing at the left to 50% coverage at the right.
const INKS = ['blue', 'pink', 'yellow', 'green', 'orange', 'violet', 'indigo'];
scene('screens', {
  inks: INKS,
  plates(g, ink) {
    const strip = new Path2D();
    strip.rect(40, 40 + INKS.indexOf(ink) * 146, 1000, 110);
    shade(g, strip, { x0: 40, y0: 0, x1: 1040, y1: 0, stops: [[0, 0], [1, 0.5]] });
  },
});

function drawArt(t) {
  paintBaked('screens');
}
```

```sh
node still.mjs $PART/work/screens/index.html --at 0 --out $OUT/screens.png
node $BANDS $OUT/screens.png 40 40  500 110 20 --across     # blue: the first half of its strip
node $BANDS $OUT/screens.png 40 624 500 110 20 --across     # orange
```

The first half of each strip covers coverage 0 to 0.25. Look at `screens.png` at 100% and compare the
two sets of strip means.

<details>
<summary>After measuring</summary>

Blue falls steadily, from about 229 to 196, a little at every step. Orange is paper, about 231, for
the first 140 px, jumps by about 20 between x = 165 and 215, and then stays at about 212 for the rest
of the half. It has one tone between paper and 25%. In the image, yellow, green, orange, violet and
indigo all show blocks; blue and pink are smooth.
</details>

Label this one **print**: it is in the native pixels, and block means find it. The cause is in the
engine. Open the screen test in Firefox and paste into the console:

```js
for (const ink of Object.keys(INK)) {
  const th = Array.from(screenOf(ink).th);
  console.log(ink, new Set(th).size, new Set(th.filter(v => v < 0.25)).size);
}
```

`screenOf(ink).th` is the ink's **threshold tile**, which you met in Part 02: `screenCoverage`
compares each pixel's coverage with it, and a pixel takes ink when its coverage exceeds its threshold. The two numbers are
how many different thresholds the tile has, in all and below 0.25. That is how many different tones
the screen can print.

<details>
<summary>After running it</summary>

Blue and pink: 41, 12 of them below 0.25. Green and indigo: 10 and 3. Yellow: 5 and 1. Orange and
violet: 4 and 1. `docs/drawing.md`, in *Tone that prints*, has the same count: "yellow, orange and
violet get one tone step below 25% coverage".
</details>

The comment above `function buildScreen` explains why. A screen at angle `b/a` repeats in a tile
holding `a² + b²` dots. Blue at 4/1 has 17 dots in its tile, each sitting at a different position
relative to the pixel grid, so between them they have many different thresholds. Orange at 2/1 has 5,
and yellow at 1/0 just one: every dot in the screen is the same, so the whole screen changes at the
same coverages. Part 06 fixed the orange shell by choosing an ink that could print the ramp. That is
still the usual right answer.

### Advanced: when the engine is the right place

Twice, the repository met this defect in a finished work and fixed it in the engine instead. Read
the *Screens* section of [`films/emergence/FILM.md`](../../../../films/emergence/FILM.md#screens) and
the first two bullets under *Changes to this print's engine copy* in
[`prints/cabinet/PRINT.md`](../../../../prints/cabinet/PRINT.md). Emergence tiled its 45° screens as
"a 3/3 supercell at the same angle... the same lattice, more sub-pixel phases, so the same ramp steps
through about ten levels"; Cabinet moved dot centres half a pixel, after it saw a luna moth's wing
"contour into visible rings".

Try the first in a copy of the screen test:

```sh
cp $PART/work/screens/index.html $PART/work/screens/supercell.html
```

In `supercell.html`, in the `SCREEN` table, change orange from `{ a: 2, b: 1 }` to `{ a: 4, b: 2 }`:
the same angle, a tile four times as large. Run the console count on it, export it, and measure:

```sh
node still.mjs $PART/work/screens/supercell.html --at 0 --out $OUT/supercell.png
node $BANDS $OUT/supercell.png 40 624 500 110 20 --across
crop $OUT/screens.png   160 620 $OUT/orange-crop.png
crop $OUT/supercell.png 160 620 $OUT/orange-super-crop.png
```

<details>
<summary>After measuring</summary>

The count goes to 56 thresholds, 18 below 0.25, and the strip means fall steadily from about 232 to
207. At 1:1, the price is visible: the dots in a supercell ramp are no longer all the same shape,
because neighbouring dots sit at different sub-pixel positions and fill in differently.
</details>

Three things keep this an advanced example rather than the default. The change was made in each work's
own copy of the engine, in response to a defect seen in that work (*Tone that prints*: "A large print
can shift its own copy, as Cabinet did; the kit keeps the films' look until the change is judged in
motion"). It changes every ramp of that ink in the work, not only the one you were looking at. And
screens in moving pictures raise questions a still does not (Part 17). What it demonstrates is the
point of this Part: a real print defect is fixed where it is made, not hidden under texture.

## 10. Native size, or a larger copy

Suppose the finished frame has to be shown at 2160. There are two ways to get a 2160 image. Try both:

```sh
cp $PART/work/finished/index.html $PART/work/finished-2160.html
```

In `finished-2160.html`, change the engine's first line to
`const CSS=720, W=1080, OUT=2160, K=2, PITCH=9.2, DUR=1;`. Everything draws in 1080 units (`W`), so
the picture is unchanged; `OUT` is the backing store, and the pitch is doubled so that the screen
stays the same size relative to the picture (the comment above `const OUT` in `prints/workings`
explains the pairing). Then:

```sh
node still.mjs $PART/work/finished-2160.html --at 0 --out $OUT/finished-2160.png
"$FFMPEG" -loglevel error -y -i $OUT/finished.png -vf "scale=2160:2160:flags=lanczos" $OUT/finished-upscaled.png
"$FFMPEG" -loglevel error -y -i $OUT/finished-upscaled.png -i $OUT/finished-2160.png \
  -filter_complex "[0]crop=240:240:1120:760[a];[1]crop=240:240:1120:760[b];[a][b]hstack,scale=960:480:flags=neighbor" $OUT/upscaled-vs-native.png
```

<details>
<summary>After looking</summary>

Both halves show the snail's tentacles against the sky at the same place and the same size. The
upscaled half is the 1080 frame's dots, blurred into soft blobs with faint halos from the scaling
filter: nothing new, and less sharp. The re-rasterised half has round, crisp dots and clean edges,
drawn at 2160 from the geometry. Look also at registration: `REG` is in device pixels, so at 2160 the
plates miss by half as much relative to the picture. Cabinet, which prints at 2160, scaled its
registration with the size (`REG × K × 0.6`, in its `PRINT.md`).
</details>

This is Part 01's backing-store principle and Part 02's no-resampling rule, applied to delivery.

## 11. Inspect the finished frame

Export the finished frame, then make the evidence this Part asks for:

```sh
node still.mjs $PART/work/finished/index.html --at 0 --out $OUT/finished.png
node verify.mjs $PART/work/finished/index.html --times 0
row $OUT/p07-vs-finished-340.png 340 $OUT/part07.png $OUT/finished.png
node $BUDGET $OUT/part07.png $OUT/finished.png
```

and at least two native crops, chosen by you:

- **a contour/registration crop**, where a subject's edge meets its ground and the plates' offsets
  show (the tentacles against the sky, the shell's lip, the lip of the step);
- **a tone/texture crop**, where one of your treatments meets untextured screen (the dry pass under
  the lip, the mist's thinning edge).

For every observation in these views, write its label (drawing, print or display-sampling), then the
evidence that settled it. Then answer:

1. At 340 px, what differs between the Part 07 frame and the finished one? Is that what you would
   expect from *Texture, last*?
2. Does every treatment answer the question you wrote for it, at 1:1?
3. Did any treatment change the composition at 120 px? If so, was that intended?

<details>
<summary>After answering: what the reference shows</summary>

At 340 px the snail is unchanged; the differences are the glow round the sun, the grain of the mist
and a faint striping at the foot of the step. The budget barely moves (about 76% and 27% before and
after). The textures are there to be found at 1:1 and to be felt at normal size, and they do not
change what the frame is about.
</details>

## 12. Compare with the reference

Now open [`project/index.html`](project/index.html). Read the last paragraph of the comment above
`scene('edge'`, which lists its treatments and the question each answers.

```sh
node still.mjs $PART/project/index.html --at 0 --out $OUT/project.png
row $OUT/finished-vs-project.png 540 $OUT/finished.png $OUT/project.png
```

If you made the reference's choices your frame will match it; if not, compare the treatments one by
one at 1:1, and write which answers its question better, and why. Then apply the same process to
your own Part 07 frame, in a copy, and note what its surfaces asked for.

## 13. What this evidence is, and is not

The 1:1 crops, the block means and the console's threshold count are **print** evidence: what the
plates and the screen actually put on paper, with the display's own errors taken out. They are the
right evidence for screen, edge and registration questions, and native pixels are their only
authority. The thumbnails and the squint view are **perceptual** evidence about whether texture
changed the composition. `verify.mjs` is **technical** evidence.

`docs/quality-bar.md` is exact about the limit. In its table of reviews, a **Print** review's
evidence is "Native PNG, 1:1 crops, plate isolation if needed", and what a pass there "cannot
establish" is "That the drawing is good". Your frame's stone is still a rectangle, its stones were
placed by eye, and nothing in it was drawn from looking at a real snail, step or garden. Write what
you would change first, and which Part you expect to teach it.

## 14. Decisions you should be able to defend

In your notes, give for each a situation where you would choose the alternative.

**Texture as evidence of form and material, or texture as decoration.** The problem: marks are cheap,
look like effort, and can cover a surface without saying anything about it; over the subject they
break its silhouette. Texture that answers a question (what the stone is, where the light rakes,
where the weight is, whether the air is wet) is kept, where the question arises and nowhere else.
Decorative texture is the better choice in a deliberately pattern-led picture, a poster or a textile
design, where the pattern is the subject; there it is chosen as pattern, with its own hierarchy. It is
never a cure for weak form.

**Re-rasterising at the delivery size, or upscaling a finished image.** The problem: a screened frame
is made of pixel-exact dots, and resampling it blurs or moirés them (Parts 01–02). Re-rasterising at
the target size draws the geometry and the screen afresh, at the right pitch, with nothing invented
and nothing lost; it is how a real print or a larger delivery should be made. Upscaling is acceptable
for a preview, a slide or a web page, where nobody is shown the result as if it held more detail
than the 1080 original does.

## Before you move on

You should have, in `work/`:

- [ ] `finished/index.html`: the Part 07 frame with a dry pass, a hatched foot, mist, a grain glow on
  an opened ground and a shell with gloss where the light is (or your own set, each with its
  question); `verify.mjs --times 0` passes.
- [ ] `faults/`: `overtextured.html`, `swapped.html`, `tentacles-coverage.html`,
  `tentacles-width.html`.
- [ ] `screens/index.html` and `screens/supercell.html`.
- [ ] `finished-2160.html`.
- [ ] `NOTES.md`: the five labelled crops of section 2; the reduced-view list, each item labelled,
  and what settled it; the texture study answers; the over-textured comparison and budgets; each
  treatment's question and what the 1:1 crop showed; the `lines` foot; the swap; the tentacle
  comparison; the screen test measurements and threshold counts, with and without the supercell;
  the upscale comparison; the finished frame's two crops and every observation labelled; the three
  answers; the comparison with the reference; what the frame still lacks; the two decisions.

And in `out/course/08/` (regenerable): every export, capture, crop, row and measurement input.

You should be able to explain, without looking:

- which parts of a riso finish the engine already provides, and which part is a drawing decision;
- how to tell a drawing, print or display-sampling problem apart, and what settles each;
- why a reduced preview of a halftoned frame invents patterns, and what block means do about it;
- why texture over a whole subject weakens it, and why texture belongs where the light is;
- when a gradient should be dots and when it should be lines;
- why a thin line faded by coverage breaks, and what to fade instead;
- why some inks step, what the threshold tile has to do with it, and why an engine change is an
  answer only to an observed defect;
- why a larger delivery is re-rasterised, not upscaled.

The sentence to carry forward: **a high-quality riso finish is restraint plus correct print
behaviour, and native pixels are the authority for screen and edge questions.**

## Deliberately left for later

- **Reference and observation** (Part 09). Every surface you textured was imagined. What a real
  step, garden or snail looks like is a different kind of evidence.
- **Constructed space** (Part 10). The stepping stones' sizes and spacing were guessed; a camera
  and a ground plane can construct them.
- **Moving screens** (Parts 16–17). Everything here is baked. A screen on a moving element, and the
  tables of thresholds that make a moving frame's screen affordable, raise their own questions.
- **Encoded motion** (Parts 17 and 23). An MP4 blurs fine coloured screens further; judging print
  quality in a film starts from native frames, not the video.
