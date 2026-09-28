# Part 09 — Reference-Led Visual Development and the Hard Frame

Every subject so far was drawn from what you already knew. The snail's foot and shell came from a
written brief, its light from a decision, its garden from imagination. That was deliberate: Parts
05–08 were about drawing, value, composition and finish, and a snail is familiar enough that
knowing roughly what it looks like was enough to teach them.

It is not enough for a picture that has to be believed. The repository says so about its own work,
bluntly. `docs/visual-development.md` records an audit of its longer films and detailed stills: "An
audit found repeated seated-figure builds, schematic contact and pose, a thin creature contour
vocabulary, an unreadable person/tool relationship. More texture, linework or grain fixed none of
it; the missing steps were an early reference/construction check and an action proof before
expanding the timeline."

This Part is that early reference and construction check. You will turn a request into a brief,
draw its subject from memory, find out what the memory drawing assumes, look at a real reference
and record only what changes the drawing, and then build one **hard frame**: the most difficult
picture the brief implies, developed through a construction view, a value view and the final inks.

The subject is one almost everyone thinks they could draw: an espresso cup with its spoon, on its
saucer. That is the point of choosing it. A subject you have seen thousands of times is exactly
the one you do not look at.

**You will make**

- `work/memory/`: the cup drawn from memory, before looking at anything, with a `TEXTURE` switch.
- `work/thumbs/`: three viewpoint and value thumbnails of the observed cup.
- `work/hero/`: the hard frame, with a construction view. This is the Part's deliverable.
- `work/NOTES.md`: the brief, the reference log, the observations, the thumbnails' answers, the
  side-by-side comparison, and the three decisions.
- `work/own/`: the same process, as far as the construction and value views, on a subject you
  choose (section 12).

**Builds on:** everything from Parts 05–08, used on a new subject: designed contours (05), value and
modelling (06), thumbnails and composition (07), and restraint in finish (08).

**Supplied:** one reference photograph, downloaded and pinned in section 6.

**Reference:** [`project/index.html`](project/index.html) is one hero frame for this brief, and
[`project/memory.html`](project/memory.html) is the memory drawing it started from. Do not open
either until the section that names it. They are snapshots: later Parts never change them.

---

## 1. Setup

```sh
cd tools
PART=../course/procedural-riso-film/parts/09-reference-led-hard-frame
P07=../course/procedural-riso-film/parts/07-composition-focus-frame-budget
OUT=../out/course/09
FFMPEG=$(node -p "require('ffmpeg-static')")
mkdir -p $OUT
crop()   { "$FFMPEG" -loglevel error -y -i "$1" -vf "crop=120:120:$2:$3,scale=480:480:flags=neighbor" "$4"; }
thumb()  { "$FFMPEG" -loglevel error -y -i "$1" -vf "scale=$2:$2:flags=area" "$3"; }
gray()   { "$FFMPEG" -loglevel error -y -i "$1" -vf "format=gray" "$2"; }
squint() { "$FFMPEG" -loglevel error -y -i "$1" -vf "format=gray,scale=120:120:flags=area" "$2"; }
row() {  # row OUT SIZE A.png B.png ...: each frame reduced to SIZE px by averaging, side by side
  local out=$1 size=$2; shift 2; local -a ins; local chain="" tail="" n=0 f
  for f in "$@"; do
    ins+=(-i "$f"); chain="${chain}[${n}]scale=${size}:${size}:flags=area[c${n}];"; tail="${tail}[c${n}]"; n=$((n+1))
  done
  "$FFMPEG" -loglevel error -y "${ins[@]}" -filter_complex "${chain}${tail}hstack=inputs=${n}" "$out"
}
grid() {  # grid IN.png OUT.png: the image doubled, with a line every 20 px and a heavier one every 100 px
  "$FFMPEG" -loglevel error -y -i "$1" -vf "scale=iw*2:ih*2:flags=neighbor,drawgrid=w=40:h=40:t=1:c=gray@0.6,drawgrid=w=200:h=200:t=3:c=cyan@0.9" "$2"
}
```

All but `grid` are Part 07's. `grid` is for measuring a photograph: it doubles the image and rules it
every 20 of the photograph's own pixels, with a heavier line every 100, so you can read positions off
it by counting.

## 2. The request, translated

Here is the request this Part works from:

> For the café's menu board: the morning's first espresso, just stirred. Square. People will see it
> from across the room. No steam, no latte art, no lettering.

Read [*Translate the request*](../../../../docs/visual-development.md#translate-the-request) in
`docs/visual-development.md`: "Extract subject, feeling, deliverable, duration, audience and explicit
inclusions/exclusions". Then read the first bullet of *Design before inheriting a timeline* in
[`docs/brief.md`](../../../../docs/brief.md#design-before-inheriting-a-timeline), which asks for the
same things before any design.

Write the brief in your notes as six lines: subject, feeling, deliverable, audience, inclusions,
exclusions. Then write one sentence on what each line **decides** about the picture.

<details>
<summary>After writing yours: one translation</summary>

| | Brief | What it decides |
|---|---|---|
| Subject | an espresso with its spoon, on its saucer | three objects and how they touch |
| Feeling | the quiet moment before the first sip | a still picture, nothing in motion but the coffee; a close, warm viewpoint |
| Deliverable | one 1080 square still | Parts 07–08's frame; no timeline |
| Audience | people across a room | it must read at a glance: test it at 120 px |
| Inclusions | "just stirred" | a moment, not just an object: the crema still turning, the spoon just put down |
| Exclusions | no steam, no latte art, no lettering | the three clichés are out; the picture has to be about the cup |
</details>

"Just stirred" is the most useful phrase in the request. It is a **moment**, which is what Part 07
said originality mostly is. It also tells you what the spoon is doing: it has just been put down.

## 3. From memory, first

Before you look at any cup, draw one. This order is the experiment: the drawing records what you
believe a cup looks like, and you cannot recover that after you have looked.

```sh
node new-riso.mjs --kind still --out $PART/work/memory/index.html
```

Draw the brief's subject in its ART region, in any three inks, in about fifteen minutes: the cup,
its handle, the coffee, the spoon, the saucer, on a table. Use what Parts 05–06 gave you, but do not
labour it. Add a switch you will need in section 5:

```js
const TEXTURE = false;   // true: the Part 08 kit spread over the sketch, before any construction is fixed
```

Export it and write, in your notes, a sentence for each of these, from your drawing and not from any
cup you can remember: where is the eye that sees this cup? how thick is the rim? where is the coffee's
surface? where does the handle join the cup, and how big is it? where is the spoon, and what is it
touching? what is under the cup?

```sh
node still.mjs $PART/work/memory/index.html --at 0 --out $OUT/memory.png
```

## 4. What the memory drawing assumes

Now look at your drawing as the repository's audit would. For each part of it, ask: did I **see**
this, or did I **know** it? A thing you know is a schema: the version of a subject everyone draws,
because it is what the word calls up. It is usually right in outline and wrong in every relationship.

List every schema you can find. Then open the one this Part's reference started from:

```sh
node still.mjs $PART/project/memory.html --at 0 --out $OUT/memory-reference.png
```

<details>
<summary>After listing yours: what the reference's memory drawing assumed</summary>

- **The viewpoint is eye level**, so the saucer is a flat stripe and the rim an ellipse only a tenth
  as tall as it is wide. But the brief's cup is on a menu board: nobody sees an espresso at eye
  level; you look down into it.
- **The cup is a tapered tumbler** with straight sides and a sharp top edge. No lip, no foot.
- **The handle is a big C** halfway up the side, as tall as half the cup.
- **The coffee is a dark disc at the brim**, as if the cup were full to the top and black.
- **The spoon lies on the table**, beside the saucer, touching nothing that matters.
- **Steam**, three wavy lines, which the brief excluded, and which appeared anyway because a cup of
  coffee in a picture has them.
- **There is no shadow and no contact**: the cup stands on the saucer only because their outlines
  meet.

Every item is a schema. None of them was looked at.
</details>

## 5. More texture will not fix it

Before looking at a reference, try the other remedy, the one Part 08 warned about. Set
`TEXTURE = true`, and in that branch use Part 08's kit over your sketch: hatch the cup, spray it,
dry-pass the saucer, grain the table. Export both and compare them at the same size:

```sh
node still.mjs $PART/work/memory/index.html --at 0 --out $OUT/memory-textured.png
row $OUT/memory-ab.png 540 $OUT/memory.png $OUT/memory-textured.png
```

Answer, from the pixels: did the handle's attachment change? Is the spoon touching anything now? Is
the coffee's surface in a different place? Does anything tell you more about where the eye is?

<details>
<summary>After answering</summary>

No, no, no and no. The textured version looks busier, older and more like a print, and every
relationship in it is the same. In the reference's pair, the budget moves from about 44% occupancy
and 3.5% mass to 44% and 6%: the texture added a little weight and no information.
</details>

This is the audit's sentence, reproduced: "More texture, linework or grain fixed none of it". Texture
answers questions about surfaces (Part 08). It cannot answer questions about construction, because it
lies on surfaces that are already in the wrong place.

## 6. A reference that answers drawing questions

Read [*References that answer drawing questions*](../../../../docs/visual-development.md#references-that-answer-drawing-questions)
in `docs/visual-development.md`. Three instructions matter here:

- "inspect a few real references first: primary collections, manufacturers, natural-history
  institutions, the artist's own work. ... A search snippet is not an inspected picture."
- "Record what changes in the drawing ... No mood board without decisions. Study relationships;
  compose originally."
- "Separate subject facts, composition/lighting and print finish."

For this worked subject the reference is supplied, so that everyone has the same evidence and the
lesson can say what it shows. It is a photograph distributed with scikit-image's test images, with
its licence and credit in the library's source ("This photograph is courtesy of Pikolo Espresso Bar.
... No copyright restrictions. CC0 by the photographer (Rachel Michetti)"). Download it into `out/`,
never into your work, and pin it by hash, as the repository does with Eclosion's specimen photograph:

```sh
curl -sSL -o $OUT/coffee.png https://raw.githubusercontent.com/scikit-image/scikit-image/v0.19.3/skimage/data/coffee.png
node -e "console.log(require('crypto').createHash('sha256').update(require('fs').readFileSync('$OUT/coffee.png')).digest('hex'))"
# cc02f8ca188b167c775a7101b5d767d1e71792cf762c33d6fa15a4599b5a8de7
grid $OUT/coffee.png $OUT/coffee-grid.png
```

Start a **reference log** in your notes, with one row per source: where it came from (the URL and
the hash), its licence, whether you **inspected** it (opened and looked at it) or only know of it,
and what kind of evidence it is. This photograph is one source; it is a subject reference (how an
espresso cup, spoon and saucer are made and how they rest on each other), a lighting reference (how
glaze and steel take light) and, at the same time, somebody else's composition, which you will not
use.

### Look, and record only what changes the drawing

Open `coffee-grid.png` at 100%. Compare the photograph with your memory drawing, relationship by
relationship. For each item from section 4, record the **observed relationship** and the **change it
makes** to the drawing. Measure where a number helps, in the photograph's own pixels, and turn each
measurement into a ratio, because the photograph's pixels mean nothing in your frame. The most
useful unit is the rim's half-width.

<details>
<summary>After recording yours: the reference's observation log</summary>

Measured on the grid, rim half-width = 117.5 photograph px (the rim spans x 173–405).

| Relationship observed | Measurement | What changes in the drawing |
|---|---|---|
| We look down into the cup; every circle is an ellipse | rim 235 × 189 px: height 0.8 of width; the saucer is about the same | the eye is high; every rim, foot and saucer is drawn at 0.8 |
| The lip is white glaze, and so is the whole inside; the red is on the outside only | lip 13 px: 0.11 of the half-width | a thick paper lip; the inside of the cup is paper, not coffee colour |
| The coffee is well below the rim, and it is crema: pale tan, not black | its surface's ellipse centre 48 px below the rim's; its half-width 84 px (0.72) | the coffee is a smaller, lower ellipse, clipped by the near wall; a mid, not a dark |
| The body bellies out and narrows to a much smaller foot | foot about 0.7 of the rim | the wall leans in toward the base; the cup stands on a small foot |
| The handle is small, thick and low: a band seen nearly edge-on, both roots on the lower half of the wall | it spans x 197–260, y 228–305: about half a half-width across, two thirds down | a short thick loop, low on the side; a dark gap between it and the wall |
| The handle's top face catches the light | a bright specular patch | a carved highlight on the band |
| The spoon's bowl rests on the saucer; its handle leans against the cup's flank and rises past the rim | the stem crosses the rim's height about 1.05 half-widths out | two contacts, saucer and wall: the spoon is supported, not placed |
| The steel is brighter than anything but the lip, with dark edges where it reflects the room | | the spoon is the lightest mid, outlined dark |
| The saucer is 1.7 times the rim, and the cup stands in a shadow that falls away from the light | saucer about 400 px across | a large saucer; the cup's shadow on it; a contact line where the foot meets it |
| The light is high and to one side; the flank away from it goes dark; inside, it is the wall on the far side that is lit, and the wall nearer the light is in its own shadow | | one light; the body ramps across; the inside is darker on the light's side |
| The table's grain runs in one direction; the wood is lighter than the glaze | | the table is a lighter value than the saucer |
</details>

Notice two things about that table. Every row says what **changes**, not what the photograph
"looks like". And the photograph's own composition, a cup in the upper middle of a landscape frame
with the table behind, appears nowhere in it. You studied its relationships; you will compose the
picture yourself.

### What you did not inspect

The log has one more column in the repository's practice: what you did **not** look at, stated as
such. Open [`films/roost/FILM.md`](../../../../films/roost/FILM.md) and read its *Subject references*
section: "From general knowledge, **not inspected images this session (unverified)**: starlings
gather at dusk over reedbeds; murmurations are thin 3-D sheets..." Then the *Research sources* table
at the end of `docs/visual-development.md`: one source is "Text only; its photographs weren't
retrieved, so they count as uninspected", another has "Pages 5–7 and 12 inspected", and the
drawing-machine study "combines them into an invented mechanism, not a reconstruction". Its closing
line: "Lasseter's 1987 animation paper couldn't be retrieved; no rule here rests on it."

That is the standard. For this brief, the swirl in freshly stirred crema is **not** in the
photograph (its crema is unstirred). If you draw one, it comes from general knowledge, and your log
says so.

## 7. Viewpoint and value, small

Now apply Part 07's method to the observed subject. Make three value thumbnails, in one ink, in one
file whose seconds are the alternatives:

```sh
node new-riso.mjs --kind film --duration 3 --out $PART/work/thumbs/index.html
```

They must differ in **camera height**, which is the choice the memory drawing never made. Use the
observed proportions in all three. One way to spread them: from the side at the saucer's height; high
and three-quarter, looking into the cup; straight down.

```sh
node shoot.mjs $PART/work/thumbs/index.html --times 0,1,2 --engine firefox --out $OUT/thumbs
row $OUT/thumbs-row.png 300 $OUT/thumbs/t_000.000.png $OUT/thumbs/t_001.000.png $OUT/thumbs/t_002.000.png
row $OUT/thumbs-120.png 120 $OUT/thumbs/t_000.000.png $OUT/thumbs/t_001.000.png $OUT/thumbs/t_002.000.png
```

For each, write what it shows and what it loses, against the brief. Then choose. Read the first
paragraph of *Prove the hardest picture first* in `docs/visual-development.md` again: "pick the one
where action and subject read most easily".

<details>
<summary>After choosing: what the reference's three showed</summary>

- **From the side:** the wall's lean, the foot and the handle's attachment read perfectly; the
  coffee does not exist, and the spoon is a thin stick. Nothing says "just stirred".
- **High three-quarter:** you look into the cup, so the crema and any swirl read; the handle, the
  spoon's two contacts and the saucer all read too. The cost is that everything is an ellipse, and
  their proportions have to be right or the cup tilts.
- **Straight down:** circles in circles, a strong graphic; the lean, the foot, the handle's depth
  and the spoon's support are all lost.

The reference chose the high three-quarter view, because it is the only one where the brief's moment
(the stirred crema) and the subject's construction (handle, contacts) are both visible.
</details>

## 8. The hard frame

Read the rest of *Prove the hardest picture first*. It asks you to "develop one representative
difficult frame at delivery resolution before filling the timeline: the hardest subject or
interaction, not the title card", and gives an order:

1. "Horizon, projection, support, main masses and overlap"
2. "Silhouette and pose"
3. "Light, mid and dark grouped by form and light source"
4. "Details attached to the same geometry: joints, rim thickness, inset openings, supported weight"
5. "Plate craft ... Texture is not evidence steps 1–4 worked."

It also says: "Keep construction, value and final-ink views available." Look at what that looks like
in the repository's own constructed study:

```sh
node shoot.mjs ../studies/scene-space.html --times 6 --engine firefox --out $OUT/ss-ink
node shoot.mjs ../studies/scene-space.html --times 6 --query "debug=structure" --engine firefox --out $OUT/ss-structure
node shoot.mjs ../studies/scene-space.html --times 6 --query "debug=value" --engine firefox --out $OUT/ss-value
```

Same frame three ways: final inks; the same inks with the construction grid over them; values only.
`--query` passes a query string to the page, which the study reads with `URLSearchParams`. The
mechanism behind its grid is Part 10's. What matters here is the habit: every hard frame keeps a way
to see its construction apart from its ink.

### What is hard here

In a single still of a cup the hard part is not the cup's outline. It is the **interaction**: the
handle's two roots meeting the wall; the spoon's bowl resting on the saucer and its handle leaning on
the cup; the foot standing on the saucer. Those are the places a viewer checks without knowing they
are checking, and where the memory drawing had nothing. *Prove the hardest picture first* calls them
"supported weight". Write your hard area in your notes before you draw.

### Build it in the subject's own units

```sh
node new-riso.mjs --kind still --out $PART/work/hero/index.html
```

Put the observations in the file as data, in the unit you measured: the rim's half-width, with `u`
across and `v` down from the centre of the rim's ellipse. Then place the cup in your frame with three
numbers: where the rim's centre goes, how large a half-width is, and which way round it faces:

```js
const CUP = {
  E: 0.8,                            // every ellipse is 0.8 as tall as it is wide from this height
  lip: 0.11,
  crema: { v: 0.41, r: 0.72 },
  // … foot, saucer, handle, spoon, shadow: your measurements
};
const R = 270, C = [640, 420], S = -1;              // this picture: large, low right, handle to the right
const P = (u, v) => [C[0] + S * u * R, C[1] + v * R];
```

This is how the measurements stay relationships rather than a tracing. The photograph's composition
is not in the file: only its proportions are. `S = -1` mirrors the cup, a composition decision the
reference made (the handle to the right, the light from the upper left); `R` and `C` set its size and
place. Mirror the light with the geometry, or the shadows will contradict the highlights.

Add a construction view, read from the query string:

```js
const VIEW = new URLSearchParams(location.search).get('view') || 'ink';   // ?view=construction shows what was measured
```

In the scene, when `VIEW === 'construction'`, print one ink only and draw with `keyline` (Part 03):
every measured ellipse and its axes, the outlines of the body, handle and spoon, and a dot at each
contact (the two handle roots, the spoon on the saucer, the spoon on the wall). Return before the ink
branches. Export it with:

```sh
node shoot.mjs $PART/work/hero/index.html --times 0 --query "view=construction" --engine firefox --out $OUT/hero-construction
```

Work in the document's order. Get the construction view right before you add a single ramp: every
contact dot on the surfaces it belongs to, every ellipse the right ratio, the foot inside the saucer's
well. Then the silhouette. Then values, checked against the photograph's own values (next paragraph).
Then attached details: lip, handle face, spoon edges. Plate craft last, and Part 08's restraint.

**Check the values against the reference.** The photograph is evidence about value as well as shape:

```sh
"$FFMPEG" -loglevel error -y -i $OUT/coffee.png -vf "hflip,format=gray,scale=360:240:flags=area" $OUT/coffee-value.png
node still.mjs $PART/work/hero/index.html --at 0 --out $OUT/hero.png
squint $OUT/hero.png $OUT/hero-squint.png
```

(Leave out `hflip,` if you did not mirror.) Compare the groups, not the exact values: which is
lightest, which darker, the table or the saucer, where the darkest darks are.

### Faults the reference met

In the order it met them, with what saw each one:

- **The handle vanished.** Drawn as a filled loop in the body's own inks, it merged into the wall; only
  its hole showed, as a dark spot. The 1:1 crop beside the photograph at the same place showed why:
  the real handle is a band seen nearly edge-on, lighter on its top face than the wall behind it, with
  a dark gap between them and its own shadow on the wall. It was rebuilt that way.
- **The handle's lower root was on the saucer.** The construction view showed the root's dot below the
  body's silhouette. From above, a loop that sticks out toward you hangs below its own lower root;
  the root itself has to stay on the wall.
- **The glaze and the table were one value.** In the squint view the cup and saucer did not separate
  from the table, while in the photograph's value view the glaze is clearly darker than the wood. The
  table's blue was lightened.
- **The spoon then vanished into the table** above the saucer: steel at the wood's value (Part 07's
  fault). It was lightened and given dark edges, which is what the photograph shows.

Every one was a construction or value fault. None was a texture fault, and none was visible in the
memory drawing, because the memory drawing had no handle roots, contacts or values to get wrong.

## 9. The same scale, side by side

The verification for this Part is a comparison, and its rules are in `docs/quality-bar.md`'s
*Review cases*: "A before/after claim needs the same subject, constraints, comparable moment, display
size, duration and key content". Same subject, same brief, same size:

```sh
node still.mjs $PART/work/hero/index.html --at 0 --out $OUT/hero.png
row $OUT/memory-vs-hero.png 540 $OUT/memory.png $OUT/hero.png
row $OUT/memory-vs-hero-120.png 120 $OUT/memory.png $OUT/hero.png
```

Write down, for the pair, the **relationships** that changed: angle (where the eye is), support (what
rests on what), proportion (lip, foot, crema depth, saucer), attachment (where the handle's roots are),
material (white glaze inside, steel), negative space (what is around the cup). Each item is one
sentence naming what was, what is, and which observation changed it. "More accurate" is not an item.

Then inspect three contacts at 1:1: a handle root, the spoon's bowl on the saucer, and the foot on
the saucer. For each, write whether a viewer could tell what is touching what.

## 10. Compare with the reference

Now open [`project/index.html`](project/index.html). Read the comment above `const VIEW` first: it is
the brief, the reference log and the hard area, written into the source where the next person to open
the file will find them. Then export it both ways:

```sh
node still.mjs $PART/project/index.html --at 0 --out $OUT/project.png
node shoot.mjs $PART/project/index.html --times 0 --query "view=construction" --engine firefox --out $OUT/project-construction
row $OUT/hero-vs-project.png 540 $OUT/hero.png $OUT/project.png
```

Compare the two as answers to the same brief: which reads better at 120 px, which has the clearer
hard area at 1:1, and one observation the other used that you did not.

Then read the comments in `scene('gather'` in [`prints/workings/index.html`](../../../../prints/workings/index.html)
for the same habit in a finished print. Find three decisions that came from how a real thing behaves:
"Molten glass sags: the blob is heavier below its own centre", "A round aperture reads as a hole; the
arched one read as a lamp", "The furnace is a built object, not a wall: it stops short of the ceiling
and stands on a plinth". Each is a subject fact turned into a drawing decision, in one line.

## 11. Likeness: a special case

Some subjects are not a kind of thing but one particular thing, and above all one particular person.
For those, observation is not enough; the repository measures. Read *Likeness of a real person* in
[`docs/characters.md`](../../../../docs/characters.md): a squint test on aligned photograph and render,
a landmark grid in head units, and "Study the photo; never trace or embed it". It took eight passes on
one face, and "Seven passes that matched landmark positions still read as a generic well-drawn man".

You do not need it here. Your cup is a cup, not a particular cup, which is why you measured
proportions and not positions. Write down one subject for which you would need the likeness method,
and why.

## 12. Your own subject

Now do the process without a supplied reference. Choose a subject or interaction you have **not**
drawn and could not describe precisely: a bicycle's pedals, chain and frame; a hand holding chopsticks;
a heron standing on one leg; a folding chair; a padlock on a chain; a crab's walking legs. Choose one
where something rests on, holds or attaches to something else: that is where the hard frame will be.

In `work/own/`:

1. Write the brief's six lines (make up a plausible request if you have none).
2. Draw it from memory first, in fifteen minutes, and list its schemas.
3. Find at least **three** references from primary sources: museum or natural-history collections,
   manufacturers, the maker's own documentation, photographs you take yourself. Log each one: source,
   licence, inspected or not, and which kind of evidence it is. If you cannot reach a source, say so
   in the log; if you have no web access, photograph a real one yourself.
4. Record only observations that change the drawing, with ratios where they help.
5. Make three viewpoint and value thumbnails, and choose one.
6. Build the hard frame's **construction view** and **value view** (the squint of a first value
   pass). The final inks are optional in this Part.

This is the part of the process that matters most, and it is the part the next still (Part 11) and
the final film (Part 20) will ask you to do without being told how.

## 13. What this evidence is, and is not

The reference log, the observation table and the construction view are **construction** evidence:
they say where things are and what supports what, and they can be checked against the source. The
value comparison with the photograph and the squint view are **perceptual** evidence about the value
structure. The side-by-side at one size is a fair before/after, because the subject, brief and size
are the same. `verify.mjs --times 0` is **technical** evidence, and says nothing about any of it.

What none of it establishes: that the picture is a good menu board. It has not been seen from across
a room, only at 120 px. And be precise about the limits of your evidence: the cup was measured from
one photograph at one camera height, so every proportion is true for that view; a higher or lower
camera would change every ellipse, and nothing in your file would know. The handle's roots and the
spoon's contacts were placed by eye in the frame, where the construction view showed they looked
right, not constructed on the wall's surface. Write those two limits in your notes; Part 10 is about
both.

## 14. Decisions you should be able to defend

In your notes, give for each a situation where you would choose the alternative.

**Observed construction, or generic symbolic drawing.** The problem: a recognisable subject is judged
by its relationships (where a handle joins, what a spoon rests on), and a schema gets those wrong while
looking right in outline. Observation is the better choice whenever the subject must be believed as
a particular kind of thing: an unfamiliar subject, a constructed object, an animal's weight on its
feet. Symbolic simplification is better for deliberately iconic or abstract work (a pictogram, a
logo, a sign), provided the simplification is chosen, and keeps the relationships a viewer would
check, rather than being ignorance that happens to look simple. The telescope exemplar's dishes, "a
thumbnail, not a subject", are simplified on purpose; a cup whose handle is on the saucer is not.

**Measuring against a grid, or free observation.** The problem: the eye misjudges proportions it
expects to know (every memory cup had a big handle and no lip). Measurement, in ratios of one of the
subject's own dimensions, is the right tool when proportion is identity: a likeness, a specific
object, an animal's anatomy, anything someone will check. Free observation is better when exact
identity is not the goal and the picture needs graphic interpretation: exaggeration, simplification,
a style that the measurements would stiffen. Even then, look first.

**Proving the hard frame first, or building in order.** The problem: the hardest picture decides
whether the rest is worth building, and building it last means discovering that after everything else
is made. Proving it first reduces risk, and what it teaches (construction, value, materials) is reused
by every other frame. Building in chronological order can be better for a tiny, technically uniform
piece where no picture is materially harder than another, where the order itself is the thing being
discovered, or when the first frame really is the hardest.

## Before you move on

You should have, in `work/`:

- [ ] `memory/index.html`: your memory drawing, with `TEXTURE`.
- [ ] `thumbs/index.html`: three value thumbnails at different camera heights, with your choice.
- [ ] `hero/index.html`: the hard frame, its observations as data in the subject's own units, a
  construction view at `?view=construction`, the brief and reference log in a comment above it;
  `verify.mjs --times 0` passes.
- [ ] `own/`: brief, memory drawing, reference log, observations, thumbnails, construction and value
  views.
- [ ] `NOTES.md`: the brief and what each line decides; the memory drawing's answers and its schemas;
  the texture comparison; the reference log, with inspected and uninspected sources; the observation
  table; the thumbnails' answers and choice; the hard area; the faults you met and what saw them; the
  side-by-side relationships; the three contact crops; the comparison with the reference; a subject
  needing the likeness method; the two limits; the three decisions.

And in `out/course/09/` (regenerable): the reference photograph and its grid, every export, row,
squint and crop.

You should be able to explain, without looking:

- how a request becomes subject, feeling, deliverable, audience and constraints, and what each decides;
- what a schema is, and why a familiar subject is where schemas are worst;
- why more texture cannot repair a construction fault;
- the difference between subject facts, composition and print references, and why a reference's
  composition is not yours to use;
- what "inspected" means, and why an uninspected source is recorded as one;
- why observations are recorded as ratios of the subject's own dimensions;
- what the hard frame is, why it comes first, and the order it is built in;
- why a before/after comparison needs the same subject, brief and size.

The sentence to carry forward: **references answer construction questions. They are not a mood-board
ritual and they do not replace original staging.**

## Deliberately left for later

- **Constructed space** (Part 10). Your ellipses were measured at one camera height and your contacts
  placed by eye. A camera, surfaces and projection construct both.
- **Action proof** (Parts 15 and 20). This Part proved a frame. A film's hardest moment is usually an
  action (a catch, a pour, a fall), and proving it needs motion.
- **Motion-specific references** (Parts 13–15). How a thing moves, not only how it is built, is a
  different kind of observation.
- **Editing and the long rough cut** (Parts 19 and 21). Which frames a film needs, and in what order,
  come after the hard ones are proven.
