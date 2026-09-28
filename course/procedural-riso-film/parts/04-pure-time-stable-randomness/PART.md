# Part 04 — Pure Time and Stable Randomness

Every Part so far has used randomness you did not write. The paper's mottling and fibres are
random, and Part 01 promised they come out identical on every run without saying how. Every baked
plate is starved of random flecks. Part 03's jellyfish took its scallops and arms from `sr`, and
the whole lesson depended on `sr` giving the same numbers every time it was asked.

This Part is about where those numbers come from, and about two ways of getting randomness wrong
that look very different to the tools. The first is the one everyone has heard of: `Math.random()`
makes a frame impossible to reproduce, and the contract check catches it at once. The second is
the one this Part is really about. You can make every frame perfectly reproducible and still make
a film that boils, and no check in the repository will object.

You will draw one small subject, a speckled egg standing on sand, three ways: with `Math.random()`,
with randomness seeded from the time, and with randomness that belongs to the egg. Then you will
let one thing about the egg change with time, and see that what changes and what stays put are
separate decisions.

**You will make**

- `work/unseeded/`: the egg drawn with `Math.random()`, kept as evidence.
- `work/timeseeded/`: the egg seeded from `t`. It passes the contract check and boils anyway.
- `work/stable/`: the egg with randomness keyed to the egg, and a lean that changes with `t`. This
  is the Part's deliverable.
- `work/faults/`: three snapshots of plausible mistakes, `hoisted.html`, `shared.html` and
  `page-speckle.html`.
- `work/NOTES.md`: predictions, measurements, the evidence table, and the two decisions.

**Supplied:** a block of egg and ground code in section 3. Drawing a good egg is Part 05's and
Part 06's problem; here the subject is given so that everything you write is about randomness.

**Reference:** [`project/index.html`](project/index.html) is the finished `work/stable/`, a
self-contained two-second film made with the same scaffold and verified with the same tools. It
is the answer to this Part's exercise, so do not open it until section 8 tells you to. It is a
snapshot: later Parts never change it.

---

## 1. Setup

Work from `tools/` with the Part's variables, the bundled ffmpeg and the output folder:

```sh
cd tools
PART=../course/procedural-riso-film/parts/04-pure-time-stable-randomness
OUT=../out/course/04
FFMPEG=$(node -p "require('ffmpeg-static')")
mkdir -p $OUT
```

This Part needs three shell helpers. `crop` is Part 02's. `strip` lays the same 1:1 crop from
every frame in a `shoot.mjs` folder side by side, so you can compare neighbouring frames at native
pixels. `diffimg` is the difference image from Parts 02–03, with both inputs converted to plain RGB
first so that the result is black, not transparent, wherever the two images agree:

```sh
crop() { "$FFMPEG" -loglevel error -y -i "$1" -vf "crop=120:120:$2:$3,scale=480:480:flags=neighbor" "$4"; }

strip() {  # strip DIR X Y OUT: the same 120 x 120 crop of every t_*.png in DIR, enlarged 4x, side by side
  local -a ins; local chain="" tail="" n=0 f
  for f in "$1"/t_*.png; do
    ins+=(-i "$f")
    chain="${chain}[${n}]crop=120:120:${2}:${3},scale=480:480:flags=neighbor[c${n}];"
    tail="${tail}[c${n}]"; n=$((n+1))
  done
  "$FFMPEG" -loglevel error -y "${ins[@]}" -filter_complex "${chain}${tail}hstack=inputs=${n}" "$4"
}

diffimg() { "$FFMPEG" -loglevel error -y -i "$1" -i "$2" -filter_complex "[0]format=rgb24[a];[1]format=rgb24[b];[a][b]blend=all_mode=difference" "$3"; }
```

`shoot.mjs` never clears its output folder (Part 01), and `strip` takes every `t_*.png` it finds,
so give each strip a folder of its own.

You also need one measurement in Firefox's console, pasted once per page load. It answers the
question this Part keeps asking: between two times, how much of a region changed?

```js
function changed(t1, t2, x, y, w, h) {
  __riso.seek(t1); const a = ctx.getImageData(x, y, w, h).data;
  __riso.seek(t2); const b = ctx.getImageData(x, y, w, h).data;
  let n = 0;
  for (let i = 0; i < a.length; i += 4)
    if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) n++;
  return +(n / (w * h)).toFixed(3);
}
```

It draws the frame at `t1` and the frame at `t2` through the contract, exactly as a tool would,
and returns the share of pixels in the rectangle that differ at all. `changed(1, 1 + 1/30, …)`
compares two neighbouring frames of a 30 fps film. This is the measure the repository uses for
flicker: the *Defects seen at playback speed* table at the end of
[`docs/quality-bar.md`](../../../../docs/quality-bar.md#defects-seen-at-playback-speed) lists
"Share of pixels changing between adjacent frames inside the region" for shimmer, with Roost's sun
glitter going from 5.4% to 0.1% when it was fixed. You will meet that fix again in section 10.

## 2. Where the numbers come from

Open any scaffold you have made (Part 03's `work/jelly/index.html` will do) in your editor and find
`/* ── deterministic randomness`. It is about fifteen lines:

- `hash(s)` turns a string into one 32-bit integer. Each character is mixed in with an XOR and a
  multiplication, so changing one character of the string changes the whole result.
- `mulberry32(a)` returns a **generator**: a function that, each time you call it, updates its own
  hidden number `a` and returns a new value between 0 and 1 computed from it.
- `rngFor(key)` is `mulberry32(hash(key))`: a new generator whose whole sequence is fixed by the
  key.

Open that work in Firefox and try, in the console:

```js
const a = rngFor('egg'), b = rngFor('egg');
[a(), a(), b(), b()]
```

<details>
<summary>After trying it: what you should see</summary>

`[0.4916…, 0.4697…, 0.4916…, 0.4697…]`. Two generators made from the same key produce the same
sequence, each from its own beginning. Calling `a` twice moved `a` along; it did nothing to `b`.
These numbers are exact: the arithmetic is 32-bit integer multiplication and bit shifts, which
every JavaScript engine computes identically, so you get the same digits in Firefox, in Chromium
and on any machine.
</details>

Now compare two keys that differ only a little:

```js
[rngFor('egg:1')(), rngFor('egg:1.0333333333333334')()]
```

<details>
<summary>After trying it: what you should see</summary>

About `0.8812` and `0.6704`: unrelated. That is what the hash is for. Keys that look alike give
sequences that have nothing to do with each other. Keep this in mind; it decides section 5.
</details>

`Math.random()` is the same kind of function, a generator returning a new number between 0 and 1 on
each call, with one difference that matters here: it has no key. The browser seeds it differently
on every page load, and you cannot restart it.

Now find the three places the engine already uses `rngFor`, and write down the key each one uses
and when it runs:

1. In `bakePaper`: `rngFor('paper')`, once, at load. Read the comment above it: "Baked once, never
   recomputed, because any per-frame regeneration flickers." This is Part 01's promise kept: the
   paper is the same on every run because it is always built from the first numbers of the same
   key, and the same on every frame because it is built once.
2. In `bakeScene`, the line Part 03 made you read:
   `sc.plates(g, ink, rngFor(id + ':' + ink), rngFor(id + ':shape'))`. Both keys are made from the
   scene's **name**. A new generator is made for every plate, so every plate starts at the beginning
   of its sequence.
3. One line further down: `starve(g, rngFor(id + ':' + ink + ':void'))`. The starvation flecks are
   keyed by the scene's name too.

So every random thing you have seen so far has a **key** that names it and a **moment** at which its
generator is made. Those two decisions are what this Part is about.

## 3. The egg, and why it has to be drawn every frame

The egg in this Part will eventually lean from side to side. Everything you have printed so far was
**baked**: coverage screened once, at load, into a bitmap. A baked bitmap cannot lean. Turning it
would resample its dots, the way Part 02's `SCALE` experiment did, and the screen would turn with
the egg, where Part 02 established that the screen belongs to the page, not to the shape. So
a thing that moves is drawn **live**, every frame, from its coverage. That is the problem this
Part starts from: if the egg is drawn every frame, then whatever randomness goes into drawing it
runs every frame too.

### A live pass: `inkPass`

The scaffold's tool for drawing an ink live is `inkPass(ctx, ink, opts, drawFn)`. Find
`function inkPass` in your scaffold and read it with its comment. Then match it to the `makePlate`
you wrote in Part 02:

1. It clears a shared scratch canvas and calls `drawFn` with its context. You draw coverage there,
   exactly as in a plate: only alpha matters.
2. If `opts.coverage` is below 1, it screens the drawing by keeping only the pixels under a dot
   pattern of that coverage. Find `function dotPattern` just above it: the pattern is a small tile
   of dots at one of 16 sizes, and the line `pat.setTransform(new DOMMatrix())` carries the comment
   "pin to canvas space so it cannot swim". The dots belong to the page, as they did in Part 02.
3. It tints what is left with the ink's colour.
4. It multiplies the result onto the page at the ink's `REG` offset.

Two differences from `makePlate` matter. `inkPass` is cheap enough to run every frame, because it
stamps a pre-drawn tile instead of testing every pixel against a threshold. And a pass has **one**
coverage for everything drawn in it. What that costs when a moving thing needs shading is Part 16's
problem; here the egg is one flat tone and its speckles are solid, so one coverage per pass is all
you need.

### Generate and paste

```sh
node new-riso.mjs --kind film --duration 2 --out $PART/work/unseeded/index.html
```

Paste this block into the ART region, above `drawArt`. It is the supplied code:

```js
// ── Part 04 supplied egg ───────────────────────────────────────────────────
const EX = 540, EY = 830;   // where the egg's base touches the ground, on the page

// The shell as one Path2D in egg space: the base at (0, 0), the top at about
// (0, -380), narrower toward the top. Its outline wavers a few pixels, like a
// drawn line, by a wobble built from r. As in Part 03, r is any function that
// returns a new number between 0 and 1 on each call.
function shellPath(r) {
  const wob = makeWob(r, 3), p = new Path2D();
  for (let i = 0; i < 160; i++) {
    const th = i / 160 * TAU;                                  // 0 at the top, round the egg
    const k = 1 + 0.04 * wob(th);                              // the waver: a few px in or out
    const x = 148 * Math.sin(th) * (1 - 0.14 * Math.cos(th)) * k;
    const y = -190 - 190 * Math.cos(th) * k;
    i ? p.lineTo(x, y) : p.moveTo(x, y);
  }
  p.closePath();
  return p;
}

// The speckle as one Path2D in egg space: 90 small spots inside the shell,
// each placed, sized, stretched and turned by r.
function specklePath(r) {
  const p = new Path2D();
  for (let i = 0; i < 90; i++) {
    const th = r() * TAU, d = 0.92 * Math.sqrt(r());          // somewhere inside the outline
    const x = 148 * d * Math.sin(th) * (1 - 0.14 * Math.cos(th));
    const y = -190 - 190 * d * Math.cos(th);
    const rad = 1.8 + 6 * r() * r(), turn = r() * Math.PI, squash = 0.45 + 0.55 * r();
    p.moveTo(x + rad * Math.cos(turn), y + rad * Math.sin(turn));
    p.ellipse(x, y, rad, rad * squash, turn, 0, TAU);
  }
  return p;
}

// The ground: one baked plate of sand whose top edge passes through the egg's base.
scene('ground', {
  inks: ['orange'],
  plates(g, ink, rng) {
    const edge = makeWob(rng, 5), top = x => EY + 50 * (edge(x / 1080 * TAU) - edge(Math.PI));
    const sand = new Path2D();
    sand.moveTo(-20, 1100);
    for (let x = -20; x <= 1100; x += 10) sand.lineTo(x, top(x));
    sand.lineTo(1100, 1100);
    sand.closePath();
    print(g, sand, 0.3);
    for (let i = 0; i < 160; i++) {                            // grit
      const x = rng() * 1080, y = top(x) + 14 + rng() * 240, rad = 1 + 2.5 * rng();
      tone(g, 1); g.beginPath(); g.arc(x, y, rad, 0, TAU); g.fill();
    }
  },
});
// ── end of supplied code ───────────────────────────────────────────────────
```

Read it for its randomness, not its geometry:

- **`makeWob(r, 3)`**, which the shell uses for its waver, is in your scaffold under
  `/* ── scene drawing helpers`. Read it: it draws two numbers from `r` for each of its three
  harmonics (an amplitude and a phase) and returns a function of the angle that adds up three
  sines. Because each sine completes a whole number of cycles round the egg, the outline closes
  without a seam. It is how the repository gives a line a hand's waver without drawing a random
  number per point, which would make the edge ragged. A few lines below `inkPass` you will also
  find `wobbler(key, n)`: it is simply `makeWob(rngFor(key), n)`, the same thing with its key
  built in.
- **`shellPath(r)`** takes 6 numbers from `r`. **`specklePath(r)`** takes 6 per spot, 540 in all.
  Both return a `Path2D` in **egg space**, a coordinate system whose origin is the egg's base.
- **The ground** is a baked scene with one ink, so it takes its randomness from `rng`, the plate's
  own generator (Part 03: "The per-ink `rng` is fine for anything only one plate draws").

Now replace the empty `drawArt` with this. It draws the egg the obvious way:

```js
const tiltAt = t => 0;   // the egg's lean, in radians: still, for now

function drawArt(t) {
  const shell = shellPath(Math.random);
  const speck = specklePath(Math.random);
  const tilt = tiltAt(t);
  paintBaked('ground');
  const place = g => { g.translate(EX, EY); g.rotate(tilt); };   // egg space -> page
  inkPass(ctx, 'blue', { coverage: 0.4 }, g => { place(g); g.fill(shell); });
  inkPass(ctx, 'violet', {}, g => { place(g); g.clip(shell); g.fill(speck); });
}
```

`Math.random` is passed as `r` without calling it: it is itself a function that returns a new
number between 0 and 1 on each call, which is all `shellPath` asks for. `place` moves egg space to
the egg's base on the page and turns it by the lean, which is 0 until section 8. The shell prints
as a blue screen of about 40% (`dotPattern` rounds coverage to sixteenths, so strictly 37.5%); the
speckle prints solid violet over it, clipped to the shell, so every speckle is an overprint dark
(Part 02). Everything the egg's randomness produces is built inside `drawArt`, so it is rebuilt on
every frame.

## 4. Version 1: `Math.random()`

**Predict** what you will see when you press Play, and which of `verify.mjs`'s checks will fail.
Then open `work/unseeded/index.html` in Firefox. Press Play and Replay. Pause, and step one frame
at a time with the arrow keys. Drag the scrubber back and forth over the same small range.

<details>
<summary>After looking: what you should be seeing</summary>

The egg boils. Its speckles are in new places on every frame, and its outline shivers. Stepping
with the arrow keys shows a different egg at every step, and dragging the scrubber back to a time
you have already seen shows yet another one. The sand and the paper are perfectly still: they are
baked, and their randomness ran once.
</details>

Now the tools:

```sh
node verify.mjs $PART/work/unseeded/index.html
node still.mjs $PART/work/unseeded/index.html --at 1 --out $OUT/unseeded.png
```

<details>
<summary>After running them: what you should be seeing</summary>

`verify.mjs` fails every check at every time, in both engines, **including** "not repeatable on
consecutive seeks", and its `DIAGNOSIS` reads "t=0 changes when drawn twice on a fresh page:
something advances per seek (a counter, an undrawn canvas, an rng not re-seeded from its key)".
`still.mjs` refuses to write a PNG: "Still changes after a seek; fix determinism before delivery".
</details>

Compare that with Part 01's stateful film, which passed the consecutive-seek check while failing
the others. That one failed only when the *sequence* of times changed. This one is not even the
same when asked for the same time twice in a row: nothing about the frame is a function of `t`.
It is the first invariant in [`CLAUDE.md`](../../../../CLAUDE.md), in full: "`seek(t)` is pure in
time, independent of seek history. Never call `Math.random()` in a render path; stable keys through
`rngFor(key)` prevent texture crawl. A hook flags violations in `films/`."

### The hook

Read [`.claude/hooks/check-film-invariants.py`](../../../../.claude/hooks/check-film-invariants.py),
docstring first. Then answer from the code:

1. Which files does it look at, and which does it skip?
2. What exactly does it search for? What does it remove from the source first, and why?
3. When does it run at all? (Look at `.claude/settings.json`: it is a Claude Code hook, run after
   Claude Code's own `Edit`/`Write` tools change a file.)

Run it by hand on your file. It only looks at paths containing `/films/`, and your work is not
under `films/`, so give it a copy that is (in `out/`, which is disposable):

```sh
hook() { echo "{\"tool_input\":{\"file_path\":\"$1\"}}" | python3 ../.claude/hooks/check-film-invariants.py; echo "exit $?"; }
mkdir -p $OUT/films
cp $PART/work/unseeded/index.html $OUT/films/unseeded.html
hook $OUT/films/unseeded.html
```

(Use `python` if that is what your system calls Python 3.) **Predict** the result before you run
it.

<details>
<summary>After running it: what you should be seeing</summary>

`exit 0`, and no message. The hook is silent about a file that calls `Math.random` on every
frame.
</details>

The hook searches the text for `Math.random` followed by an opening parenthesis. Your code never
writes that: it passes `Math.random` as a value. Change the copy (not your work) so the call is
spelled out, and run it again:

```sh
sed 's/shellPath(Math.random)/shellPath(() => Math.random())/' $OUT/films/unseeded.html > $OUT/films/unseeded-call.html
hook $OUT/films/unseeded-call.html
```

Now it reports "1 Math.random() call(s)" and exits 2. Run it once more on your real file,
`hook $PART/work/unseeded/index.html`: silent again, because the path has no `/films/` in it.

Write down what the hook is: a cheap tripwire for one spelling of one mistake, in one folder, and
only when Claude Code is the one editing. Its docstring says as much ("Two invariants are cheap to
check here and expensive to discover later"). It is not verification, and a silent hook is not
evidence that a work is pure.

## 5. Version 2: seeded from the time

The obvious repair is to make the randomness repeatable: seed it, and seed it from the one thing
that identifies a frame, its time.

```sh
cp -r $PART/work/unseeded $PART/work/timeseeded
```

In `work/timeseeded/index.html`, change the first two lines of `drawArt` to:

```js
  const r = rngFor('egg:' + t);            // a fixed sequence for each time
  const shell = shellPath(r);
  const speck = specklePath(r);
```

**Predict**: will `verify.mjs` pass? Will it look any different in Firefox?

```sh
node verify.mjs $PART/work/timeseeded/index.html
```

<details>
<summary>After running it: what you should be seeing</summary>

`seek is pure in t; contract holds`, in both engines. Every time it sampled draws the same pixels
whatever came before.
</details>

Now look. Open it in Firefox, press Play, step with the arrow keys, and drag the scrubber back and
forth.

<details>
<summary>After looking: what you should be seeing</summary>

At playback speed it boils exactly as version 1 did. The one difference is in the scrubber: going
back to a time you have already seen now shows the same egg as before. Each moment has one egg; the
next moment has a different one.
</details>

Measure it. Paste `changed` into the console on `work/timeseeded/index.html` and compare
neighbouring frames in a rectangle round the egg, and in a patch of bare paper:

```js
changed(1, 1, 380, 430, 320, 410)            // the same frame twice
changed(1, 1 + 1/30, 380, 430, 320, 410)     // neighbouring frames, the egg
changed(1, 1 + 1/30, 60, 60, 200, 200)       // neighbouring frames, bare paper
```

<details>
<summary>After measuring: what you should be seeing</summary>

0, then about 0.06 to 0.07, then 0. The same frame is identical to itself, which is all
`verify.mjs` asks. Between neighbouring frames, six or seven per cent of the egg's rectangle
changes, while the paper next to it does not change at all.
</details>

Then look at the pixels. Shoot four neighbouring frames and lay a 1:1 crop of each side by side:

```sh
node shoot.mjs $PART/work/timeseeded/index.html --range 1:1.1:0.0333333333 --engine firefox --out $OUT/timeseeded-strip
strip $OUT/timeseeded-strip 400 520 $OUT/timeseeded-strip.png
```

Open `timeseeded-strip.png` at 100%. The crop takes in the upper left of the shell and a little
paper outside it. Describe, in your notes, what stays the same across the four crops and what does
not.

<details>
<summary>After looking: what you should be seeing</summary>

The blue screen's lattice is the same in every crop: it is pinned to the page. Everything else is
new each time: every speckle is somewhere else, with another size and angle, and the edge of the
shell sits a few pixels further in or out. There is no speckle you can follow from one crop to the
next.
</details>

Finally, watch it as a film, looped in a video player:

```sh
node render.mjs $PART/work/timeseeded/index.html --engine firefox --out $OUT/timeseeded.mp4
```

### Why seeding from the time cannot work

Go back to section 2. Keys that differ slightly give unrelated sequences. `'egg:1'` and
`'egg:1.0333333333333334'` are two unrelated eggs, and so is every pair of neighbouring frames,
whatever the frame rate. No step between frames is small enough to make them similar, because
similarity was never on offer: the key changes, so the egg is replaced.

The same fact has a second, quieter consequence. Try it in the console:

```js
changed(1.0333, 31/30, 380, 430, 320, 410)
```

<details>
<summary>After measuring: what you should be seeing</summary>

About 0.07: a completely different egg, although the two times differ by less than a
twenty-thousandth of a second. `shoot.mjs` rounds the times of a `--range` to four decimals, and
`render.mjs` computes frame 31 as `31/30`. With a time-seeded egg, the frame you inspected with one
tool is not the frame the other exported.
</details>

This is the case the repository warns about in three places. [`docs/motion.md`](../../../../docs/motion.md),
*Determinism is not continuity*: "A per-frame rng keeps each frame repeatable, so nothing catches
it, but texture crawls." The comment at the top of `tools/verify.mjs`: "This does not prove
continuity, absence of time-seeded crawl, or artistic quality". And the `verify.mjs` row of
[`tools/README.md`](../../../../tools/README.md): "Time-seeded noise can still pass; inspect
adjacent frames." `docs/quality-bar.md` lists the result among its *Failure modes* as "Texture
swimming".

Copy the time-seeded file to `$OUT/films/` and run the hook on it too. It is silent: there is no
`Math.random` in it to find.

Write the Part's central observation in your notes, in your own words: **what `verify.mjs`
established about this film, what `changed` and the strip established, and why both are true at
once.**

## 6. Version 3: randomness that belongs to the egg

The egg is supposed to be one egg. Its speckles are its markings and its waver is the way its
outline was drawn. Neither should change from frame to frame. So the randomness has to be tied to
the **egg**, not to the frame.

```sh
cp -r $PART/work/timeseeded $PART/work/stable
```

### The first attempt: one generator for the egg

A reasonable first move is to give the egg its own generator, made once, and use it wherever the
egg needs a number. In `work/stable/index.html`, add above `drawArt`:

```js
const eggRng = rngFor('egg');              // one generator for the egg, made once
```

and in `drawArt` delete the `const r = …` line and pass `eggRng` to both builders. **Predict**,
then:

```sh
node verify.mjs $PART/work/stable/index.html
```

<details>
<summary>After running it: what you should be seeing</summary>

It fails every check, like version 1, with the same `DIAGNOSIS`: "something advances per seek (a
counter, an undrawn canvas, an rng not re-seeded from its key)". In Firefox the egg boils exactly
as before.
</details>

The key is fixed, but the generator is **state**. Each call moves it along, and nothing ever puts
it back. The first frame drawn on the page uses numbers 1–546, the second 547–1092, and so on: the
egg on any frame depends on how many frames were drawn before it. That is Part 01's stateful film
again, with a random number generator as the variable carried between frames.

<details>
<summary>A detail to check your understanding: one line that may be missing</summary>

In the `FAIL … differs on a fresh page drawn in reverse order` lines, you may find that one time is
missing. On the first page, `verify.mjs` draws each time twice in order, so `t = 0.4` is the sixth
frame drawn on that page (the page draws `t = 0` once as it loads). On the fresh page it draws the
times in reverse, and `t = 0.4` is again the sixth. Same count, same numbers, same egg. The frame
does not depend on which times came before it, only on how many.
</details>

Keep it:

```sh
mkdir -p $PART/work/faults
cp $PART/work/stable/index.html $PART/work/faults/hoisted.html
```

### The fix: build the egg once, from its keys

Remove `eggRng`. Build the egg's identity once, at load, as two top-level constants above
`drawArt`, each from a key of its own, and make `drawArt` use them:

```js
// The egg's identity: built once, at load, from its own keys.
const SHELL = shellPath(rngFor('egg:shell'));
const SPECK = specklePath(rngFor('egg:speckle'));
```

<details>
<summary>After writing yours: the whole of <code>drawArt</code></summary>

```js
function drawArt(t) {
  const tilt = tiltAt(t);
  paintBaked('ground');
  const place = g => { g.translate(EX, EY); g.rotate(tilt); };   // egg space -> page
  inkPass(ctx, 'blue', { coverage: 0.4 }, g => { place(g); g.fill(SHELL); });
  inkPass(ctx, 'violet', {}, g => { place(g); g.clip(SHELL); g.fill(SPECK); });
}
```
</details>

Run the same evidence as in section 5:

```sh
node verify.mjs $PART/work/stable/index.html
node shoot.mjs $PART/work/stable/index.html --range 1:1.1:0.0333333333 --engine firefox --out $OUT/stable-strip
strip $OUT/stable-strip 400 520 $OUT/stable-strip.png
```

and in the console, `changed(1, 1 + 1/30, 380, 430, 320, 410)`.

<details>
<summary>After looking: what you should be seeing</summary>

`verify.mjs` passes, and every time it sampled has the **same** hash: the egg does not change at
all yet. `changed` is exactly 0. The four crops in the strip are identical. In Firefox the egg
stands perfectly still, speckles and all.
</details>

The repository does this everywhere a thing keeps its identity while it moves. In
[`studies/index.html`](../../../../studies/index.html), find `const STONE` and `const DUST` above
`scene('weight'`: the stone's outline is built once from `rngFor('weight:stone')` and moved into
place each frame, and `DUST` carries the comment "seeded once: per-frame draws crawl".

### The alternative: re-seed from the key every frame

Building once is not the only way to be stable. Make the builders run inside `drawArt` again, but
make a fresh generator from the egg's key at the start of every frame:

```js
  const SHELL = shellPath(rngFor('egg:shell'));      // re-seeded from its key, every frame
  const SPECK = specklePath(rngFor('egg:speckle'));
```

(as the first lines of `drawArt`, with the top-level constants commented out). **Predict**, then
export one frame from each version and compare them:

```sh
node still.mjs $PART/work/stable/index.html --at 1 --out $OUT/reseed.png
# put the top-level constants back and remove the two lines from drawArt, then:
node still.mjs $PART/work/stable/index.html --at 1 --out $OUT/stable.png
```

The two runs print the same sha256: byte-identical. Every frame builds the same egg from the
beginning of the same two sequences, which is exactly what `bakeScene` does for every plate.
`docs/motion.md` states the use for it: "`cut(pts, rngFor(key), …)` re-seeds identically each
frame, so a contour with moving points keeps a stable edge; a per-frame rng would boil it." (`cut`
is a contour builder you meet in Part 05.) Window Seat does it for its grass. In
`films/window-seat/index.html`, search for `grass tufts anchored to world X`: the landscape slides
past the window, so the tufts are drawn afresh every frame at new screen positions, and each one
takes its offset, height and lean from `rngFor('gt' + k)`, where `k` counts tufts along the
ground. Tuft 40 is the same tuft on every frame it is visible. So, in your notes: build once when
what you build does not depend on `t`, which is cheaper and simpler; re-seed from the key every
frame when it does, because its points move or it enters and leaves the frame, so that it cannot
be built in advance.

Either way, the rule you have found is about **lifetime**. A generator is made from its key at the
start of the thing it describes (a load, a bake, a frame) and thrown away at the end. It is never
carried from one frame to the next. Leave `work/stable/` building the egg once.

## 7. Owners: one key for each thing

### Why two keys?

You gave the shell and the speckle separate keys. Find out what that buys. Make a snapshot that
uses one generator for both, still built once:

```sh
cp $PART/work/stable/index.html $PART/work/faults/shared.html
```

In `work/faults/shared.html`, replace the two constants with:

```js
const eggRng = rngFor('egg');                  // one generator for both
const SHELL = shellPath(eggRng);
const SPECK = specklePath(eggRng);
```

This is stable: `verify.mjs` passes and the egg is still. Now make a change a reviewer might ask
for, in **both** files: the outline's waver should be finer, so in the supplied `shellPath` change
`makeWob(r, 3)` to `makeWob(r, 5)`. Export before and after for each file, and compare:

```sh
# with makeWob(r, 3) in both files:
node still.mjs $PART/work/faults/shared.html --at 1 --out $OUT/shared-3.png
node still.mjs $PART/work/stable/index.html  --at 1 --out $OUT/stable-3.png
# change to makeWob(r, 5) in both files, then:
node still.mjs $PART/work/faults/shared.html --at 1 --out $OUT/shared-5.png
node still.mjs $PART/work/stable/index.html  --at 1 --out $OUT/stable-5.png
diffimg $OUT/shared-3.png $OUT/shared-5.png $OUT/shared-diff.png
diffimg $OUT/stable-3.png $OUT/stable-5.png $OUT/stable-diff.png
```

**Predict** each difference image before you open it.

<details>
<summary>After looking: what you should be seeing</summary>

In `stable-diff.png`, only a thin line along the shell's outline lights up: the waver changed and
nothing else did. In `shared-diff.png`, the outline lights up and so does **every speckle**. Five
harmonics take 10 numbers instead of 6, so the speckle, which came after the shell in the same
sequence, now starts four numbers later, and every spot is somewhere new. (Measured over the egg's
rectangle, about 1.6% of the pixels change with separate keys and about 6.6% with one.)
</details>

This is Part 03's `sr` lesson from the other side. There, several plates *had* to share one
sequence, because their shapes had to agree, and so the order of consumption was part of the
program. Here nothing needs to agree with anything, so each thing gets a sequence of its own, and
no change to one can disturb another. Put `makeWob(r, 3)` back in `work/stable/` (leave
`shared.html` as it is; it is a snapshot).

The repository names keys after what they own. The borrowing guide in
[`.claude/skills/riso-film/examples.md`](../../../../.claude/skills/riso-film/examples.md), *How to
borrow*, says: "Keep seeds keyed: take randomness from `rngFor('<film>:<thing>:<index>')`, never
`Math.random()`". The films do it for things that come in numbers: Lumen seeds each pollen grain's
angle, speed, delay and size from `rngFor('pollen'+i)`, and Window Seat each grass tuft from
`rngFor('gt' + k)`. The index is part of the name, so grain 7 is always grain 7, whatever happens
to grain 6.

### Keys are part of the picture: freeze them

Another invariant in `CLAUDE.md` reads: "Changing a `Score({ key })` or any
`rngFor` key reseeds that output; freeze keys once approved." (`Score` belongs to the sound Parts.)
Section 2 showed you that scene names are keys. Test what that means. Export a frame, then rename
the scene: `scene('ground', …)` to `scene('sand', …)` and `paintBaked('ground')` to
`paintBaked('sand')`, and export again.

```sh
node still.mjs $PART/work/stable/index.html --at 1 --out $OUT/ground.png
# rename the scene in both places, then:
node still.mjs $PART/work/stable/index.html --at 1 --out $OUT/sand.png
diffimg $OUT/ground.png $OUT/sand.png $OUT/rename-diff.png
```

<details>
<summary>After looking: what you should be seeing</summary>

The whole ground lights up: a new undulation along the sand's top edge, every grain of grit
somewhere new, and the starvation flecks rearranged. The egg and the paper are black: their keys
did not change.
</details>

Nothing about the drawing changed. A tidy-minded rename is an art change, because the name is the
key for the sand's `rng`, for its starvation and for its `sr`. (This is also why Part 02's
comparison with its reference says that under another scene name "only the starvation flecks
move".) Once a picture is approved, its keys are part of it, just as its coordinates are. Put the
name back to `ground`.

Rekeying is sometimes exactly what you want: a different instance of the same procedure, a new
egg. Try `rngFor('egg:speckle:2')` and `rngFor('egg:speckle:3')`, choose the speckle you prefer,
and record the decision in your notes. Then freeze it. From that moment on, a change of key is a
change of picture and should be made on purpose.

## 8. The one thing that is supposed to change

Everything so far has been still, because nothing about the egg was meant to change. Now let one
thing change: the lean. In `work/stable/index.html`, replace the `tiltAt` line with:

```js
const tiltAt = t => 0.1 * Math.sin(TAU * t / DUR);   // the egg's lean: a slow rock, about 6° each way
```

`DUR` is the film's duration, from the scaffold's first line. The lean is an explicit function of
`t`, like Part 01's `160 + 700 * t`: it goes from upright to leaning right, back through upright to
leaning left, and home, in the two seconds. How to time and shape motion properly starts in
Part 12; here the point is only that **the thing meant to change is computed from `t`, and the
things meant to stay are computed from keys.**

**Predict** what the speckles will do as the egg leans. Then:

```sh
node verify.mjs $PART/work/stable/index.html
node render.mjs $PART/work/stable/index.html --engine firefox --out $OUT/stable.mp4
node shoot.mjs  $PART/work/stable/index.html --times 0.5,1,1.5 --engine firefox --out $OUT/lean-strip
strip $OUT/lean-strip 440 470 $OUT/lean-strip.png
```

`t = 0.5` and `t = 1.5` are the two extremes of the lean; `t = 1` is upright, moving fastest. The
crop is the upper left of the shell, where the lean moves the edge furthest.

<details>
<summary>After looking: what you should be seeing</summary>

`verify.mjs` passes, now with a different hash at each time. In the MP4 the egg rocks and its
speckles ride on it. In the strip, each speckle is recognisably the same speckle in all three
crops, carried round with the shell and turned with it. The blue screen's lattice does not move at
all: the shell's edge slides across a lattice that stays on the page.
</details>

Measure the rocking egg between neighbouring frames, where it moves fastest and where it moves
slowest:

```js
changed(1, 1 + 1/30, 380, 430, 320, 410)
changed(0.5, 0.5 + 1/30, 380, 430, 320, 410)
```

<details>
<summary>After measuring: what you should be seeing</summary>

About 0.045 and about 0.02. A correctly moving egg changes several per cent of its rectangle
between frames, which is the same order as the time-seeded egg's 0.06–0.07.
</details>

So the measure that settled section 5 cannot settle this. On a subject that should be still, any
change between frames is a defect, and `changed` measures it. On a subject that moves, pixels
*must* change, and the question is whether they change **coherently**: whether each thing on frame
`n + 1` is the same thing as on frame `n`, moved. That is a question for the strip, and for your
eye at playback speed. Note in your notes which question each piece of evidence can answer.

### Owned by the wrong thing

One more mistake, and it is the subtlest, because it neither boils nor fails any check. Make a
snapshot:

```sh
cp $PART/work/stable/index.html $PART/work/faults/page-speckle.html
```

In `faults/page-speckle.html`, change the speckle pass so the speckle is not turned with the egg:

```js
  inkPass(ctx, 'violet', {}, g => { place(g); g.clip(SHELL); g.rotate(-tilt); g.fill(SPECK); });
```

The clip still follows the shell, but `rotate(-tilt)` undoes the lean for the speckle itself. This
is what happens whenever texture is placed in page coordinates and then cut to a shape: a speckle
bitmap made once for the frame and clipped to the egg, say. **Predict**, then:

```sh
node verify.mjs $PART/work/faults/page-speckle.html
node shoot.mjs  $PART/work/faults/page-speckle.html --times 0.5,1,1.5 --engine firefox --out $OUT/page-strip
strip $OUT/page-strip 440 470 $OUT/page-strip.png
```

<details>
<summary>After looking: what you should be seeing</summary>

`verify.mjs` passes, and nothing boils. But in the strip every speckle stays at the same pixels in
all three crops while the shell's edge sweeps across them, and near the edge speckles are cut off
on one side of the lean and uncovered on the other. At playback speed the egg seems to rock behind
a speckled window.
</details>

`docs/quality-bar.md` describes texture swimming as "grain or halftone recomputed per frame
instead of pinned to the object". The speckle here is not recomputed at all; it is pinned, to the
wrong thing. So a key is only half of ownership. The other half is the coordinate system the
randomness lives in. In this one frame, three things own their own randomness or pattern, and each
must stay with its owner:

| Pattern | Owner | Where it is fixed |
|---|---|---|
| halftone screen | the press, so the page | `dotPattern` pinned to canvas space |
| paper mottling and fibres | the sheet | `bakePaper`, once, from `'paper'` |
| speckle and the outline's waver | the egg | egg space, from `'egg:speckle'` and `'egg:shell'` |

### Compare with the reference

Now open [`project/index.html`](project/index.html). It is a freshly generated two-second film
whose ART region holds the supplied block and the final `drawArt` of this Part, and nothing else.
Compare your deliverable with it at a moment when the egg leans:

```sh
node still.mjs $PART/project/index.html --at 0.5 --out $OUT/project-0.5.png
node still.mjs $PART/work/stable/index.html --at 0.5 --out $OUT/stable-0.5.png
diffimg $OUT/stable-0.5.png $OUT/project-0.5.png $OUT/stable-vs-project.png
```

If your keys are `egg:shell` and `egg:speckle`, your scene is named `ground`, and your lean is the
one above, the difference is black. If you kept a different speckle key in section 7, the speckle
lights up and nothing else does, which is itself a check that your keys own what you think they
own. Any other difference is worth finding.

## 9. The evidence, side by side

In `NOTES.md`, make a table with one row for each version: `unseeded`, `timeseeded`,
`faults/hoisted.html`, `stable` still (as it was at the end of section 6), `stable` rocking, and
`faults/page-speckle.html`. Give it these columns, filled from what you actually ran or looked at:

- **hook** (on a copy under `$OUT/films/`): silent or reported;
- **`verify.mjs`**: pass or fail, and which kind of failure;
- **`still.mjs`**: wrote a PNG, or refused;
- **`changed` between neighbouring frames** on the egg;
- **1:1 strip**: what stays, what changes;
- **playback**: still, boiling, rocking, or rocking behind a window.

Then, under the table, answer: which versions would a reviewer who only ran the tools have
approved, and which would they have rejected for the wrong reason or for no stated reason at all?

<details>
<summary>After writing yours: points your table should contain</summary>

- **Unseeded:** hook silent (it only matches `Math.random(`); `verify.mjs` fails everything,
  diagnosing per-seek state; `still.mjs` refuses; boils. Every check that looked, caught it; the
  one cheap guard did not look properly.
- **Time-seeded:** hook silent; `verify.mjs` passes; `still.mjs` writes a PNG; about 6–7% of the
  egg changes between neighbouring frames; the strip shows a new egg each frame; boils. **Only the
  strip, the measurement of neighbouring frames and playback reveal it.**
- **Hoisted:** hook silent; `verify.mjs` fails with "an rng not re-seeded from its key"; boils.
- **Stable, still:** passes, identical hashes, 0 change, identical strip, still.
- **Stable, rocking:** passes, several per cent change between frames, each speckle followed through
  the strip, rocks.
- **Page speckle:** passes, several per cent change, speckles fixed on the page while the shell
  moves, rocks behind a window. **Only the strip and playback reveal it, and only if you ask what
  each speckle belongs to.**

The tools would have passed both the time-seeded and the page-speckle versions. They rejected the
unseeded and hoisted versions, for the right reason.
</details>

Be precise about the kind of evidence each row holds. `verify.mjs`, `still.mjs` and the hook are
**technical contract** evidence: they establish that a frame is a function of `t`, or that one
spelling of one mistake is absent. The strip, `changed` and playback are **perceptual** evidence
about continuity: whether what is on one frame is the same thing on the next. The first kind is
necessary for the second to mean anything (a strip of an impure film shows only one of its possible
histories), and it is never a substitute for it. None of this is evidence that the egg is well
drawn. It is a wobbled oval with dots on it; Parts 05 and 06 deal with that.

## 10. Decisions you should be able to defend

In your notes, give for each a situation where you would choose the alternative.

**Randomness keyed to the object rather than to the time or the frame.** The problem: a thing's
material identity (its markings, the waver of its outline, the grit in its ground) must persist
from one frame to the next, or the eye reads the difference as boiling. Keying by the object
(`'egg:speckle'`, `'pollen' + i`) and building from the key once, or from the key every frame,
gives the same thing on every frame and lets explicit functions of `t` move it. Randomness that
varies with time is the better choice when the phenomenon genuinely changes: sparks, rain,
turbulence, a flickering signal. Even then the repository gives each particle a keyed identity and
lets time move it smoothly, rather than drawing new randomness per frame. Roost's
[`FILM.md`](../../../../films/roost/FILM.md) records the case: its sun's glitter is seeded once
(`rngFor('glitter')` in its source), and each glint "grow[s] and shrink[s] over about 2 s";
"Earlier glints switched on and off at 5.3 rad/s and flashed (user report)", and fixing that took
the change between neighbouring frames from 5.4% to 0.1%. Fresh randomness on every frame is right
only when frame-to-frame disorder is itself the image, such as the static on a screen inside a
story, and even then it will look like boiling, because that is what it is. Part 14 introduces
`wander`, the kit's tool for smooth variation in `t` with no state.

**Frozen keys rather than renaming freely.** The problem: revising a picture means comparing
versions, and a comparison only means something if everything you did not change stays put. Once a
picture is approved, its keys (scene names included) are part of it; change one only when you mean
to change what it seeds. Renaming or rekeying freely is the better choice while you are still
exploring, when trying `egg:speckle:1` to `egg:speckle:5` and keeping the best is the point, or
when you actually want a new instance and have no approved version to protect. After choosing,
freeze again.

## Before you move on

You should have, in `work/`:

- [ ] `unseeded/index.html`: the egg built from `Math.random` in `drawArt`; `verify.mjs` fails.
- [ ] `timeseeded/index.html`: the egg built from `rngFor('egg:' + t)`; `verify.mjs` passes and it
  boils.
- [ ] `stable/index.html`: `SHELL` and `SPECK` built once from `egg:shell` and the speckle key you
  chose, scene `ground`, `makeWob(r, 3)`, and the rocking `tiltAt`; `verify.mjs` passes; the
  difference from `project/index.html` is black or explained.
- [ ] `faults/`: `hoisted.html`, `shared.html` and `page-speckle.html`.
- [ ] `NOTES.md`: the `rngFor` experiments; the hook answers and results; predictions and what
  happened; the `changed` measurements; the section 5 observation in your own words; the key you
  chose in section 7; the evidence table; the two decisions.

And in `out/course/04/` (regenerable): the strips and their shot folders, the MP4s, the exported
frames and the difference images, and the copies under `films/` you gave the hook.

You should be able to explain, without looking:

- how a key becomes a sequence, why the same key always gives the same numbers, and why similar
  keys give unrelated ones;
- why `Math.random()` fails even the consecutive-seek check, and why the hook might still miss it;
- why seeding from `t` passes `verify.mjs` and still boils, and why no frame rate fixes it;
- why a generator made once and used across frames is carried state;
- the difference between building from a key once and re-seeding from it every frame, and when
  each is needed;
- why separate things take separate keys, and why a renamed scene is a changed picture;
- which evidence distinguishes crawl from motion, and which cannot.

The sentence to carry forward: **determinism is necessary for inspection but is not the same as
continuity. Randomness must have an owner and a lifetime.**

## Deliberately left for later

- **Contours** (Part 05). The egg is an oval with a waver. Part 05 shows why a wobbled primitive is
  not yet an observed shape, and introduces `cut`, `curve` and `nib`.
- **Value and form** (Part 06). The egg is one flat tone standing on the sand without touching it
  in any way that reads as weight: no modelling, no contact.
- **Composition** (Part 07). The egg is in the middle because that was convenient.
- **Timing and motion** (Parts 12–15). The lean is the simplest function of `t` that rocks. Phases,
  clocks, easing, loops that do not jump, and `wander` for smooth variation all come later.
- **Tone on moving things** (Part 16). One `inkPass` prints one coverage; a moving thing that needs
  shading, or a bright thing moving over a dark ground, needs more.
- **Frames where most of the picture moves** (Part 17). Here only one small element is live.
- **Sound's keys** (Parts 24–27). `Score({ key })` follows the same rule as `rngFor`.
