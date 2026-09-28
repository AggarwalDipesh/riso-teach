# Part 06 — Value First: Modelling Form Without Mud

Your Part 05 snail has a designed outline and marks that say something, and it is still two flat
tones on paper. Nothing in it is lit. Nothing in it is darker because it turns away from anything,
or lighter because it faces anything. It floats: its sole ends on bare paper as though it had been
cut out and laid there.

This Part gives it light, volume and a ground, and the hard part is doing that without mud. The
obvious way to shade something is to lay a darker colour over the side away from the light. In
this medium that darker colour is a second ink, and a second ink over the first does not make it
darker; it makes it a different, dirtier colour. The repository learned this the hard way and
records it in a comment in your scaffold. You will learn it the same way, then build the
alternative: modelling by **taking ink away** toward the light, and spending the second ink only on
one small, deliberate dark.

You will work in **value** first. Value is how light or dark something is, independent of its hue.
You will judge every step in a value-only view before you judge it in colour, because the two
views catch different faults, and one of them catches a fault the other hides.

**You will make**

- `work/flat/`: a copy of Part 05's reference snail, the starting point and the "before".
- `work/modelled/`: the snail with one light, a modelled shell and body, a paper highlight, one
  overprint dark and a contact shadow. This is the Part's deliverable.
- `work/faults/`: `foreign-shadow.html` (the obvious shadow, in a second ink) and
  `orange-ramp.html` (modelling on an ink that cannot print a smooth ramp).
- `work/NOTES.md`: the value plan, measurements, the four views, and the two decisions.

**Builds on:** Part 05. You start from a copy of Part 05's reference, `project/index.html`, not
your own snail, so that the measurements below match what you see. Part 05's file is a snapshot:
copy it; never edit it. When you have finished, you can apply the same steps to your own snail.

**Reference:** [`project/index.html`](project/index.html) is the finished `work/modelled/`, a
self-contained still made with the same scaffold and verified with the same tools. Do not open it
until section 11 tells you to. It is a snapshot: later Parts never change it.

---

## 1. Setup

```sh
cd tools
PART=../course/procedural-riso-film/parts/06-value-first-modelling-form
P05=../course/procedural-riso-film/parts/05-designed-contours-and-marks
OUT=../out/course/06
FFMPEG=$(node -p "require('ffmpeg-static')")
mkdir -p $OUT
crop()   { "$FFMPEG" -loglevel error -y -i "$1" -vf "crop=120:120:$2:$3,scale=480:480:flags=neighbor" "$4"; }
gray()   { "$FFMPEG" -loglevel error -y -i "$1" -vf "format=gray" "$2"; }
squint() { "$FFMPEG" -loglevel error -y -i "$1" -vf "format=gray,scale=120:120:flags=area" "$2"; }
```

`crop` is Part 02's 1:1 crop. `gray` makes the **value view**: the same frame with its hue thrown
away, using the same brightness weights as Part 02's `measure`. `squint` makes a small value view:
reduced far enough that the screen's dots average away, the way squinting at a picture blurs its
texture and leaves its big lights and darks. It is how you check whether a value structure reads
without relying on dots, grain or line.

In Firefox's console you will use one measurement, pasted once per page load. It is Part 02's
`lightness`, plus the mean colour, because this Part is about hue as much as value:

```js
function swatch(x, y, w, h) {
  const d = ctx.getImageData(x, y, w, h).data;
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
  const n = w * h; r /= n; g /= n; b /= n;
  return { rgb: [r, g, b].map(Math.round), lightness: Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b) };
}
```

## 2. The flat snail, in value

Copy Part 05's reference as your starting point:

```sh
mkdir -p $PART/work/flat
cp $P05/project/index.html $PART/work/flat/index.html
```

Read [*Value first*](../../../../docs/drawing.md#value-first) in `docs/drawing.md`, all three
paragraphs. The first says what to decide before anything else: "Decide the value hierarchy before
inks. Paper, a mid and a dark anchor is a good start; high-key works too. Add a dark for separation
or depth, not by quota."

Now look at the flat snail that way. Export it, and make its value view and its squint view:

```sh
node still.mjs $PART/work/flat/index.html --at 0 --out $OUT/flat.png
gray   $OUT/flat.png $OUT/flat-gray.png
squint $OUT/flat.png $OUT/flat-squint.png
```

Answer from `flat-gray.png` and `flat-squint.png`, in your notes:

1. Where is the light coming from?
2. What is the darkest thing in the frame, and is it where you would want the eye to go?
3. How many distinct values does the snail have, and how far apart are they?
4. In the squint view, what is left of the snail?

<details>
<summary>After answering: what you should be seeing</summary>

1. Nowhere. Every part is one value from edge to edge.
2. The coil, the blue-over-orange line. It is the only overprint, so it is the only dark, and it is
   a line inside the shell rather than anything with a structural reason to be dark.
3. Two mids, close together: the orange shell and the 60% blue body sit only a little apart in
   value (you will measure them shortly), with paper around them.
4. A grey shape on a light ground. It reads as a silhouette, and nothing in it says volume.
</details>

This is the state `docs/drawing.md` describes as "flat-filled on flat grounds, ... no dark". It is
not wrong the way a plate fault is wrong. It is simply undecided.

## 3. Tones add on a plate

Before adding anything, fix something that is already wrong. Crop the flat snail where the
tentacles enter the head:

```sh
crop $OUT/flat.png 770 560 $OUT/flat-roots.png
```

Look at it at 100%. Then open `work/flat/index.html` in Firefox, paste `swatch`, and measure a
strip inside the first tentacle's root and a patch of head beside it:

```js
swatch(797, 606, 10, 26)   // inside the head, where a tentacle's root is
swatch(840, 680, 20, 20)   // the head, away from any tentacle
```

<details>
<summary>After looking: what you should be seeing</summary>

Two darker stubs inside the head, where the tentacles start. The root measures a lightness of about
118, the head beside it about 148: 30 darker, although both were printed at 0.6.
</details>

Part 05 told you to start each tentacle inside the head, so that its blunt end would not show. It
did not show as an edge. It showed as a darker patch, because the tentacle was printed on the same
plate as the head, and Part 03 established what two prints on one plate do: coverage `a` printed
over `b` becomes `a + b − a·b`. Two 0.6 prints make 0.84. `docs/drawing.md` records the large
version of the same fault in *Tone that prints*: "Tones add on a plate: ridges at 0.14, 0.3 and
0.62 drawn back to front print 0.79 at frame bottom, a colour band, not land. Use `plane()`."

Part 03 introduced `plane(g, path, a)`: carve the shape, then print it, so it owns its value
whatever was under it. Read its comment in your scaffold now; it describes exactly this: "Tones on
one plate add where they overlap, so a stack of ridges drawn back to front ends up solid at the
bottom of the frame."

Make the deliverable's file and fix it there:

```sh
mkdir -p $PART/work/modelled
cp $PART/work/flat/index.html $PART/work/modelled/index.html
```

In `work/modelled/index.html`, on the blue plate, change `print(g, stalks, 0.6)` to
`plane(g, stalks, 0.6)`. Export, crop the same place and measure again: the stubs are gone, and the
root measures the same as the head beside it.

## 4. Decide the light, and a value plan

Before any ramp, decide two things and write them in your notes.

**The light.** One source, and where it is. The reference puts it high and ahead of the snail,
off the top right of the frame: the snail crawls toward it. Any direction will do, but it has to be
one, because every value in the frame will be decided by it. Add it to the top of the ART region as
a comment, so the code records the decision:

```js
// One light, high and ahead of the snail, off the top right of the frame. Every ramp is centred toward it.
```

**The value plan.** Before touching an ink, list the values the snail should have, lightest to
darkest, and where each one goes. For a paper, mid and dark hierarchy, something like:

| Value | Where | Why |
|---|---|---|
| paper | a small highlight on the shell, where its curve faces the light | the brightest thing a print can show |
| light mid | the shell's side facing the light; the lifted head | they face the light |
| mid | the shell's far side; the tail | they turn away from it |
| dark | one small place where the shell turns away and meets the body | it is hidden from the light twice |
| contact | under the sole | the body pressing on its ground |

Make a thumbnail sketch of that plan in greys, on paper or in any drawing program, small enough
that you cannot put detail in it. It is the target you will compare the `squint` view against.

This is also the moment for the plan's other option. *High-key* means no dark anchor at all: the
whole picture spent between paper and pale mids. The `lines` print in `prints/workings` is built
that way on purpose ("Low mass on purpose ... open sky, snow at nearly bare stock, and the frame's
whole value spent on one structure", in the comment above `scene('lines'`). A snail in a bright
fog could be high-key. Record which you chose and why.

## 5. The obvious shadow: a second ink

The shell needs to turn away from the light. The obvious move: lay the other ink over the shell's
far side as a shadow. Make a snapshot to try it in:

```sh
mkdir -p $PART/work/faults
cp $PART/work/modelled/index.html $PART/work/faults/foreign-shadow.html
```

In `faults/foreign-shadow.html`, at the end of the blue branch, after the coil, add a blue shadow
across the shell's side away from the light. `shade` is the kit's coverage ramp (you met it in
Part 03 as the packaged form of your own gradients; read its comment now): a radial ramp,
strongest low on the shell's back and fading toward the front:

```js
      g.save(); g.clip(shell);                       // a shadow on the side away from the light, in blue
      shade(g, null, { x: 330, y: 660, r0: 0, r: 330, stops: [[0, 0.6], [0.5, 0.35], [1, 0]] });
      g.restore();
```

**Predict** what it will look like in the value view and in colour. Then:

```sh
node still.mjs $PART/work/faults/foreign-shadow.html --at 0 --out $OUT/foreign.png
gray $OUT/foreign.png $OUT/foreign-gray.png
```

and measure the shell's back in both files (open each, paste `swatch`):

```js
swatch(296, 470, 40, 40)   // the shell's back, away from the light
```

<details>
<summary>After looking: what you should be seeing</summary>

In the value view it works: the shell darkens toward its back and bottom, and it reads as a round
thing turning away from a light. In colour it is brown. The back measures about `rgb(157, 103, 71)`
with a lightness of about 112, where the flat shell was `rgb(236, 125, 77)`, about 145. The value
went down by about a quarter; the hue went from orange to mud.
</details>

That is the fault the kit was written to prevent. Find the comment in your scaffold that begins
"There is no `model()` helper here on purpose" (just above `function bed`) and read it: "Shading a
form by laying a second ink across its shade side is the obvious move and it is wrong: study 3 in
that form printed an orange ball olive-brown. Model with `shade(…, {cut: true})` on the subject's
own plate instead, and spend a second ink only on the smallest darkest accent."

Notice which view caught it. The value view said the shadow was a success. Only colour showed the
mud. A value view answers "is the structure of lights and darks right?"; it cannot answer "is this
the colour I meant?". You need both views, and you need to know which question each one answers.

## 6. Taking ink away toward the light

Now the alternative, in `work/modelled/`. The shell is printed solid orange. Instead of adding ink
to its dark side, remove ink from its light side, on its own plate, with the same `shade` and
`cut: true` (Part 03: a `destination-out` ramp). After `print(g, shell, 1)` on the orange plate:

```js
      g.save(); g.clip(shell);                       // light taken out of the shell toward the source
      shade(g, null, { cut: true, x: 600, y: 420, r0: 0, r: 330, stops: [[0, 0.65], [0.45, 0.32], [1, 0]] });
      g.restore();
      carve(g, cut(ringPts(596, 420, 26, 16, 8, -0.6), rng, { amp: 1.5 }));  // the highlight is paper
```

The ramp is centred on the part of the shell nearest the light, removing 65% of the ink there and
nothing by the back. The highlight is a small carve at the same place: `docs/drawing.md`,
*Value first*: "Highlights are paper, cleared with `carve`, not a light ink." It takes its waver
from `rng`, because only this plate draws it (Part 03).

Export, make the value view, and measure the lit side and the back:

```sh
node still.mjs $PART/work/modelled/index.html --at 0 --out $OUT/orange-ramp.png
gray $OUT/orange-ramp.png $OUT/orange-ramp-gray.png
```

```js
swatch(530, 470, 50, 50)   // the shell's lit side
swatch(296, 470, 40, 40)   // the shell's back
```

<details>
<summary>After looking: what you should be seeing</summary>

The lit side measures about `rgb(237, 152, 113)`, lightness about 167; the back is still the flat
orange, about 145. The value now runs from light to mid across the shell, and the hue is orange
everywhere: "every value is the same plate at a different dot size", as the comment in study 3
puts it (you read that study in section 9).
</details>

Now look at it at 1:1, on the lit side:

```sh
crop $OUT/orange-ramp.png 520 500 $OUT/orange-ramp-steps.png
```

<details>
<summary>After looking: what you should be seeing</summary>

The ramp does not change smoothly. Across one line, the orange jumps from near-solid (paper showing
only as pinholes) to a much smaller dot, with nothing in between. At normal viewing size those
jumps show as rings round the light.
</details>

You were warned about this in Part 03: blue and pink screens have about forty dot sizes, and the
other inks' screens have between four and ten, so a gentle gradient on them prints as visible
bands. `docs/drawing.md` gives the detail in *Tone that prints*: "dots grow 0 → 4 → 12 px and a
gentle ramp contours into rings ... yellow, orange and violet get one tone step below 25%
coverage". Part 08 looks at what can be done about that inside the engine. Here the fix is a
decision you should make before choosing any ink: the value plan needs a smooth ramp on the shell,
so the shell's ink has to be one that can print one. That is what *value before palette* means in
practice.

Keep this version, then re-ink the shell:

```sh
cp $PART/work/modelled/index.html $PART/work/faults/orange-ramp.html
```

In `work/modelled/index.html`, change `'orange'` to `'pink'` in the scene's `inks` and in the
branch that prints the shell. Part 05's construction view used pink for its points; move it to
`'yellow'` (in the `SHOW_POINTS` part of `inks`, and in its branch), so the two do not collide.
Export again, crop the same place, and measure the lit side and back.

<details>
<summary>After looking: what you should be seeing</summary>

The steps are gone: the pink dots shrink gradually toward the light. The lit side measures about
`rgb(237, 142, 183)`, lightness about 165; the back about `rgb(236, 87, 160)`, about 124. The coil,
blue over pink, now prints as a deep violet line.
</details>

Compare the back with the foreign-shadow version: about 124 here, about 112 there. Nearly the same
value. One is pink; the other is brown.

## 7. The body, lit by the same light

The body turns toward the same light: its lifted head faces it, the tail is lower and further away.
Model it the same way, on the blue plate. Two things about how, both from Part 03.

**One ramp, not one per part.** `gather`'s header comment: "Forms are modelled by taking ink away
toward the light — one ramp per source". If you ramp the foot and then ramp the tentacles
separately, the tentacle roots inside the head get the ramp twice and come out lighter than the
head, the section 3 fault reversed. Use one ramp over the whole plate.

**Order decides what it touches.** A ramp over the whole plate also lightens anything printed on
that plate before it. The trail and (in section 9) the contact shadow must not be lit this way, so
they go **after** the ramp. Move the trail's block to below it.

Raise the body's coverage a little first, so there is ink to take away: print the foot at 0.8 and
plane the stalks at 0.8. Then the blue branch begins:

```js
      print(g, foot, 0.8);
      plane(g, stalks, 0.8);                         // one value with the head, not stacked on it
      shade(g, null, { cut: true, x: 860, y: 560, r0: 0, r: 560,      // one ramp for the one light,
                       stops: [[0, 0.45], [0.5, 0.25], [1, 0]] });    // before anything it must not touch
```

followed by the trail, then `carve(g, shell)` and the coil, as before. Measure the head and the
root again (`swatch(840, 680, 20, 20)` and `swatch(797, 606, 10, 26)`): about 160 and 161, the same
value, and both lighter than the tail.

## 8. The one dark

The value plan has one dark: where the shell turns away from the light **and** meets the body, low
on its back. This is the "smallest darkest accent" the kit's comment keeps the second ink for, and
the list in *Value first* names such places: "core shadow, contact shadow, inside an opening".

It uses the same blue ink over the same shell as the fault in section 5. What makes it different is
size, strength and reason. At the end of the blue branch:

```js
      g.save(); g.clip(shell);                       // the one dark: where the shell turns away and meets the body
      shade(g, null, { x: 318, y: 676, r0: 0, r: 120, stops: [[0, 1], [0.4, 0.9], [1, 0]] });
      g.restore();
```

It is small (it fades out within about 120 px of the shell's back corner) and it is near solid
where it is dark. Measure it: `swatch(345, 625, 30, 30)`.

Then try it at half strength. Change the stops to `[[0, 0.5], [0.4, 0.45], [1, 0]]`, export,
measure the same place, and look at it. Put it back afterwards, and export the snail as it now
stands, for section 9 to compare against:

```sh
node still.mjs $PART/work/modelled/index.html --at 0 --out $OUT/before-contact.png
```

<details>
<summary>After measuring: what you should be seeing</summary>

Near solid, it measures about `rgb(53, 49, 128)`, lightness about 56: a deep violet, the darkest
thing on the snail. At half strength, about `rgb(145, 66, 143)`, lightness about 88: a dusty
purple, neither mid nor dark.
</details>

`gather`'s header says why, for its own pair of inks: "Both plates run near solid: at 0.6 and 0.8
the same pair prints dusty rose, not black." An overprint is only a dark when both plates are
nearly solid. Partial overprint is not a darker version of either ink; it is a third, muddier
colour. That is what the foreign shadow in section 5 was, spread over half the shell.

This is the dark the repository's measured reference is made of. *The reference* in
[`docs/quality-bar.md`](../../../../docs/quality-bar.md#the-reference): "**Darks are overprints.**
At 2× a near-black kettle handle is green and red multiplied". Part 02 showed you why a dark has to
be an overprint; this Part shows how small and how solid it has to be to stay one.

## 9. Touching the ground

The snail still floats. Read `function bed` in your scaffold and its comment: "Contact shadow. A
subject that does not touch its ground reads as a decal." It prints a soft, wavering ellipse of
coverage, darkest in the middle. On the blue plate, after the trail:

```js
      bed(g, 430, 772, 420, 20, rng, 0.6);           // contact: the sole pressed on its ground
```

It is centred a little behind the snail's middle, away from the light, and it is long and thin
because the snail is. It takes its waver from `rng`, because only this plate prints it. Export,
and compare the sole with and without it:

```sh
node still.mjs $PART/work/modelled/index.html --at 0 --out $OUT/modelled.png
"$FFMPEG" -loglevel error -y -i $OUT/before-contact.png -i $OUT/modelled.png \
  -filter_complex "[0]crop=700:200:120:640[a];[1]crop=700:200:120:640[b];[a][b]vstack" $OUT/contact.png
```

The top half of `contact.png` is without the contact shadow, the bottom half with it. Without it,
the sole ends in a clean edge on bare paper. With it, the bottom of the sole darkens where it
presses down, and a soft band of shadow runs out beneath it. Write down whether your snail now
reads as resting on something, and what the something is.

`bed` is a convention, not a projection. It does not know where the light is or what shape the
ground has. That is the trade-off section 13 asks you to defend.

### The repository's version: study 3

You have now made every move of the repository's form study on a different subject. Export it and
read its code:

```sh
node still.mjs ../studies/index.html --at 3 --out $OUT/study-form.png
```

In [`studies/index.html`](../../../../studies/index.html), read `scene('form'` and its comment.
Left: an orange ball, one flat fill. Right: the same ball printed solid and then lightened by a
`cut` ramp toward the light, with a carved highlight; a blue floor with `bed` under the ball; and
on a third ink, indigo, "one small deliberate overprint: the core shadow", plus a second, smaller
`cut` where light returns at the far rim. Match each of its moves to one of yours, and note the
one it makes that you did not (the returning light at the rim). Its comment is the sentence
section 6 quoted: "The hue stays pure, every value is the same plate at a different dot size, and
it still reads as one printing."

## 10. Four views

The deliverable is done. Now inspect it the way this Part has taught, in four views, and keep all
four:

```sh
node still.mjs $PART/work/modelled/index.html --at 0 --out $OUT/modelled.png
gray   $OUT/modelled.png $OUT/modelled-gray.png
squint $OUT/modelled.png $OUT/modelled-squint.png
```

and the silhouette view, with `SILHOUETTE = true` (export to `$OUT/modelled-sil.png`, then set it
back). Answer in your notes, from the views, not from the code:

1. **Where is the light?** Which view shows it most clearly?
2. **What is the focal dark?** Is there exactly one, and is it where the value plan put it?
3. **Does the snail read without texture?** In the squint view, where the dots have averaged away,
   is it still a lit, rounded shell on a body resting on a ground?
4. **Does the silhouette still read?** Modelling should not have cost the outline anything.
5. **Compare the squint view with your thumbnail sketch** from section 4. Where do they differ?

<details>
<summary>After answering: what the reference shows</summary>

1. Upper right. The value view shows it best: the shell lightens toward its upper front, the
   highlight sits there, the head is lighter than the tail.
2. One: the deep violet low on the shell's back. The coil is dark too, but it is a line, and on the
   lit side it is surrounded by light pink, so it reads as a mark on the shell, not as a mass.
3. Yes. The squint view is a light-to-mid shell with one dark at its back, a body lighter at the
   head, and a soft dark line under the sole.
4. Yes; the silhouette is the same shape as Part 05's.
</details>

## 11. Compare with the reference

Now open [`project/index.html`](project/index.html). It is a freshly generated still holding Part
05's reference snail with every change of this Part applied: `plane` for the tentacles, the shell
re-inked pink and modelled by subtraction toward one light, a paper highlight, one ramp for the
body placed before the trail, the one dark, and the contact shadow.

```sh
node still.mjs $PART/project/index.html --at 0 --out $OUT/project.png
"$FFMPEG" -loglevel error -y -i $OUT/modelled.png -i $OUT/project.png -filter_complex "[0]format=rgb24[a];[1]format=rgb24[b];[a][b]blend=all_mode=difference" $OUT/modelled-vs-project.png
```

If you followed the sections exactly, the difference image is black. If you made different value
decisions (a different light, a stronger or tighter dark), it lights up there, and it should: then
compare the two squint views instead, and write down which value structure you prefer and why.

## 12. What this evidence is, and is not

The value view, the squint view and the swatch measurements are **perceptual** evidence about
value and hue: where the lights and darks are, whether the one dark is really darker than
everything else, whether a shadow has changed an ink's hue. They are exactly what caught the two
faults in this Part: the value view caught neither, colour caught the mud, and a 1:1 crop caught the
steps. Plate isolation from Parts 02–03 still answers "which ink is this?" when a colour surprises
you.

None of this establishes that the snail is a good picture. It is lit and grounded now, and it is
still in the middle of an empty frame, at a size nobody chose, on a ground made of one soft
shadow. The light was chosen, not observed. Its shell and body were drawn from a verbal brief.
Write down, in one or two sentences, what you would change first if this were going to be shown,
and which later Part you expect to teach it.

## 13. Decisions you should be able to defend

In your notes, give for each a situation where you would choose the alternative.

**Modelling by subtraction on the subject's own plate, rather than a shadow in another ink.** The
problem: a form must turn from light to dark without changing colour, and in this medium a second
ink over the first changes the colour. Removing ink toward the light keeps one hue from highlight
to shadow, every value "the same plate at a different dot size", and keeps the second ink free for
one real dark. A second ink over the shade side is the better choice when the shadow really is a
different colour: reflected light from a coloured surface, a coloured cast light, a deliberate
colour event, or a meaningful overprint. It must then be chosen as a colour, not used as "darker".

**`bed()` as a contact shadow, rather than a cast shadow constructed from the light.** The
problem: a subject that does not touch its ground reads as a decal, and the cheapest reliable fix
is a soft, dark pool where it touches. `bed` gives that in one line, and it does not need to know
the light's position or the ground's shape. A shadow constructed from the light is the better
choice when the light's direction, the receiving surface and the spatial relationship matter to the
picture: a low sun throwing long shadows, an object on a table edge or a step, a shadow that tells
the viewer where the light is. That needs a model of the surfaces that receive it, which is
Part 10.

## Before you move on

You should have, in `work/`:

- [ ] `flat/index.html`: the unchanged copy of Part 05's reference.
- [ ] `modelled/index.html`: `plane` for the tentacles; the shell in pink, modelled by a `cut`
  ramp toward the light with a paper highlight; the body at 0.8 with one ramp before the trail; the
  one dark near solid; the contact shadow; `verify.mjs --times 0` passes; the difference from
  `project/index.html` is black or explained.
- [ ] `faults/`: `foreign-shadow.html` and `orange-ramp.html`.
- [ ] `NOTES.md`: the flat snail's four answers; the root measurements; your light and value plan
  with the thumbnail sketch; high-key or not, and why; the foreign-shadow and subtraction
  measurements, and which view caught which fault; the half-strength accent measurement; the
  contact comparison; the four views and five answers; what you would change first; the two
  decisions.

And in `out/course/06/` (regenerable): every export, its value and squint views, and the crops.

You should be able to explain, without looking:

- why two prints on one plate make a darker patch, and what `plane` does about it;
- why a second ink over the shade side changes hue and not just value, and why the value view does
  not show it;
- what "remove ink toward the light" means, in plate operations, and why the hue survives it;
- why a ramp on orange steps and a ramp on pink does not, and why that is a palette decision made
  after the value plan;
- why an overprint is only a dark when both plates are near solid;
- why one ramp per light, and why its position in the plate's order matters;
- what `bed` gives a subject, and what it does not know.

The sentence to carry forward: **value and form are solved before surface finish; darkness must
have a structural reason.**

## Deliberately left for later

- **Composition and depth** (Part 07). Where the snail sits, how large, against what; several
  planes receding into a place, and what a frame spends its darks on.
- **Screen quantisation and texture** (Part 08). Why the orange steps, what the engine can do about
  it, and the marks (hatch, spray, dry pass) that give a surface its material.
- **Reference and observation** (Part 09). The light and the snail were decided, not looked at.
- **Cast shadows and receiving surfaces** (Part 10). A shadow projected from the light onto a
  modelled ground.
- **Light that moves** (Part 16). Everything here is baked for one light. A light that moves, or a
  bright thing moving over a printed dark, needs `bandPass` and `relight`.
