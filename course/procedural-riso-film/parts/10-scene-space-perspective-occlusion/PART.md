# Part 10 — Scene Space: Perspective, Attachment, and Occlusion

Part 09 ended by naming two limits of its own hard frame. Every ellipse in the cup was drawn at the
ratio measured in one photograph (0.8), which is true only for that camera height; and the handle's
roots and the spoon's contacts were placed by eye where they looked right, not built on the surfaces
they belong to. Part 07 and Part 08 left the same debt in another form: the stepping stones'
sizes and spacing were guessed.

This Part replaces guessing with construction. You will build a small scene the way
`docs/scene-space.md` says to: in a **world** with its own units, seen through one **camera**,
with every detail attached to the **surface** it belongs to and then projected. Then you will meet
the problem projection does not solve, which is **visibility**: what covers what. The repository's
answer to it is not a 3D renderer. It is a small, pure geometry kit and an explicit order that you
write yourself.

The subject is a garden bench with an espresso left on it. A bench has everything this Part needs:
a sloped surface (the backrest), repeated attached details (slats), support and contact (legs on
paving, a cup on a seat), and a part that passes through another (the arm posts through the seat).
And the cup comes back: Part 09's proportions, placed in a world, where its ellipses are no longer
yours to choose.

**You will make**

- `work/bench/`: the constructed scene, built in stages, with three diagnostic views and two
  switches that reproduce the faults. This is the Part's worked deliverable.
- `work/faults/`: `leg-behind.html` (a part that passes through a surface, ordered as one piece), and
  optionally `zoom-bitmap.html` and `zoom-camera.html`.
- `work/own/`: a constructed object of your own choosing, built the same way (section 12).
- `work/NOTES.md`: predictions, measurements, crops, the test results, and the three decisions.

**Builds on:** Part 03's plate order and ownership (`plane`, `carve`, "shared geometry" built before
the branches), Part 06's one light and its value steps, Part 07's value groups and the frame budget,
Part 09's cup and its observations.

**Supplied:** small blocks of geometry code, each introduced where its problem appears. The camera,
the world, the object's dimensions, the order and the values are yours to decide in section 12.

**Reference:** [`project/index.html`](project/index.html) is the finished bench. Do not open it
until section 11 tells you to. It is a snapshot: later Parts never change it.

---

## 1. Setup

```sh
cd tools
PART=../course/procedural-riso-film/parts/10-scene-space-perspective-occlusion
OUT=../out/course/10
FFMPEG=$(node -p "require('ffmpeg-static')")
mkdir -p $OUT
crop()    { "$FFMPEG" -loglevel error -y -i "$1" -vf "crop=120:120:$2:$3,scale=480:480:flags=neighbor" "$4"; }
thumb()   { "$FFMPEG" -loglevel error -y -i "$1" -vf "scale=$2:$2:flags=area" "$3"; }
diffimg() { "$FFMPEG" -loglevel error -y -i "$1" -i "$2" -filter_complex "[0]format=rgb24[a];[1]format=rgb24[b];[a][b]blend=all_mode=difference" "$3"; }
row() {  # row OUT SIZE A.png B.png ...: each frame reduced to SIZE px by averaging, side by side
  local out=$1 size=$2; shift 2; local -a ins; local chain="" tail="" n=0 f
  for f in "$@"; do
    ins+=(-i "$f"); chain="${chain}[${n}]scale=${size}:${size}:flags=area[c${n}];"; tail="${tail}[c${n}]"; n=$((n+1))
  done
  "$FFMPEG" -loglevel error -y "${ins[@]}" -filter_complex "${chain}${tail}hstack=inputs=${n}" "$out"
}
```

All are earlier Parts' helpers. You will also use `shoot.mjs --query`, from Part 09, to open the
work with a view or a switch in its query string.

## 2. The repository's constructed scene

Read [*Construct space once*](../../../../docs/scene-space.md#construct-space-once) in
`docs/scene-space.md`, and in `docs/visual-development.md`, the paragraph that begins "Objects:
attach every detail to a host surface": "Equal keys on a sloping keyboard foreshorten; circles on a
turned panel become ellipses. Use coherent perspective or a coherent orthographic/graphic treatment;
mixing them by accident disconnects parts."

Then look again at the drawing-machine study you exported in Part 09 (`out/course/09/ss-ink` and
`ss-structure`), and read its source, [`studies/scene-space.html`](../../../../studies/scene-space.html),
from `// ART BEGIN` to `function staticObjects` and a little way into it. Find:

1. where the cameras are made, and what `focal` is;
2. `Space.plane`, and one detail built on a plane (the front panel's controls);
3. the comment above the `return` of `builder`, which begins "Explicit painter order";
4. the `DIAG === 'structure'` branch in `drawArt`, and what world lines it draws.

Answer in your notes, from the source:

<details>
<summary>After reading: what you should have found</summary>

1. `Space.camera({eye, target, focal, cx, cy})`: a camera at `eye` looking at `target`. `focal` is
   in pixels, and `cx, cy` is where the point straight ahead lands on the page.
2. `const panel = Space.plane([-330,306,254],[640,0,0],[0,46,0])` maps a (u, v) on the panel to a
   point in the world; the dials are `disc(panel, u, .51, …)` and `ring(panel, …)`, built in the
   panel's (u, v) and projected. The comment above them: "projected circles become consistent
   ellipses automatically".
3. "Explicit painter order: average-depth sorting misorders a large table/wall and its details. Emit
   background, supporting surface, attached parts, then foreground. Split intersecting faces."
4. The desk's grid: world lines every 120 units along x and every 100 along z, at the desk top's
   height, each drawn through the same camera with `cam.line`.
</details>

`Space` is in your scaffold: search for `const Space=(()=>{`. It is the repository's
[`tools/lib/visual-kit.mjs`](../../../../tools/lib/visual-kit.mjs), embedded whole. Read the file now,
its first 47 lines, through `function plane`. Everything this Part uses from it is in those lines.

## 3. A camera

```sh
node new-riso.mjs --kind still --out $PART/work/bench/index.html
```

Open it in Firefox, and in the console try the camera by hand:

```js
const c = Space.camera({ eye: [0, 1600, 3000], target: [0, 400, 0], focal: 1400 });
c.project([0, 400, 0]);        // the target: where does it land?
c.project([0, 0, 0]);          // the ground under it
c.project([0, 0, -3000]);      // the ground further away
c.project([0, 0, 4000]);       // behind the camera
c.depth([0, 0, 0]);            // how far in front of the camera, along its line of sight
```

<details>
<summary>After trying it</summary>

The target lands at (540, 540), the page's centre, because the default `cx, cy` is (540, 540). The
ground under it lands lower on the page (image y grows downward), and the ground further away lands
higher, closer to the horizon. The point behind the camera returns `null`: the camera cannot see it.
Depth is positive in front. `docs/scene-space.md`: "World coordinates are +Y up. ... positive depth
points forward and image Y points down."
</details>

Two numbers carry most of the camera's meaning. `focal`, in pixels, sets how large a thing of a
given size appears at a given depth: *Construct space once* gives the rule, "A pinhole camera shows
world height H at depth z as `focal × H / z` px". And the camera's height against its target sets
how far you look down, which is exactly what set the cup's 0.8 in Part 09.

Now make the scene's world and camera. Paste this into the ART region, above `drawArt`:

```js
// ── geometry helpers (supplied) ─────────────────────────────────────────────
const v3 = { add: (a, b) => a.map((v, i) => v + b[i]), sub: (a, b) => a.map((v, i) => v - b[i]),
             mul: (a, k) => a.map(v => v * k), dot: (a, b) => a.reduce((s, v, i) => s + v * b[i], 0),
             cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]] };
const path2 = pts => { const p = new Path2D(); pts.forEach(([x, y], i) => i ? p.lineTo(x, y) : p.moveTo(x, y)); p.closePath(); return p; };
function hull(pts) {                                // the convex hull of screen points (monotone chain)
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], hi = [];
  for (const q of p) { while (lo.length > 1 && cr(lo.at(-2), lo.at(-1), q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.reverse()) { while (hi.length > 1 && cr(hi.at(-2), hi.at(-1), q) <= 0) hi.pop(); hi.push(q); }
  return lo.slice(0, -1).concat(hi.slice(0, -1));
}
// ── the world and the camera ────────────────────────────────────────────────
const Q = new URLSearchParams(location.search);
const VIEW = Q.get('view') || 'ink';                // 'structure': the world's planes over the print; 'value': luminance
const PAVING = Q.get('paving') || 'projected';      // 'bilerp': the flags near the bench placed between four projected corners
const ORDER = Q.get('order') || 'explicit';         // 'depth': every surface sorted by its mean depth instead

// Millimetres, +Y up, the bench's front facing +Z. Garden-bench proportions from general knowledge, not measured.
const SEAT_Y = 450, LEAN = 110;                     // the seat's top; how far the backrest leans back over its height
const EYE = [-1250, 1150, 1550], TARGET = [-120, 400, -60];

// Frame by numbers: project the bench's extremes with a focal of 1, then scale and place them.
const cam = (() => {
  const probe = Space.camera({ eye: EYE, target: TARGET, focal: 1, cx: 0, cy: 0 });
  const pts = [];
  for (const x of [-760, 760]) for (const y of [0, 850]) for (const z of [-300, 260]) pts.push(probe.project([x, y, z]));
  const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
  const focal = 1080 * 1.05 / (Math.max(...xs) - Math.min(...xs));     // 5% wider than the frame: the far end is cropped
  return Space.camera({ eye: EYE, target: TARGET, focal,
    cx: 540 + 150 - focal * (Math.min(...xs) + Math.max(...xs)) / 2,     // pushed right, so the near end has room
    cy: 560 - focal * (Math.min(...ys) + Math.max(...ys)) / 2 });
})();
```

The helpers are plain vector arithmetic, a `Path2D` from a list of screen points, and a convex hull
you will need for the cup in section 9. `hull` is standard computational geometry, supplied because
it is not this Part's subject.

The camera is framed by numbers, the way *Construct space once* asks: "take the projected bounds of
the subject ... then scale so that span fits the safe area and place it. ... In another code-drawn
film, framing set by eye took five rounds of fixes." The corners of the bench's bounding box are
projected with a focal of 1; their spread gives the focal that makes the bench 5% wider than the
frame; `cx, cy` put the result where the composition wants it. The camera stands to the bench's
front left, at about the eye height of someone sitting, looking down at it. The world's units are millimetres because the
bench is designed in them: a seat 450 mm high is a number a reader can check.

## 4. Laying the ground

### The obvious way

Paving is repeated detail on a surface. Its flags are 600 mm squares with a 16 mm joint. The ground
is flat, so the obvious way to draw it is to find where the corners of the paved area land on the
page, and space the flags evenly between those corners, with `lerp` in two directions (bilinear
interpolation: "bilerp" in the repository's comments). It is a reasonable first move. Add this, the scene's first version:

```js
// ── every surface, once, as an object all four plates draw from ─────────────
function buildObjects() {
  const objs = [], P = pts => cam.polygon(pts);                 // clip at the near plane, then project
  const add = (group, pts3, inks, o = {}) => {
    const pts = P(pts3); if (pts.length < 3) return;
    objs.push({ group, path: path2(pts), inks, knockout: o.knockout !== false,
                depth: pts3.reduce((s, p) => s + cam.depth(p), 0) / pts3.length, ...o });
  };

  // 1 the ground: joints are the ground between the flags; they fade into haze with distance, as the flags do
  add('ground', [[-30000, 0, -30000], [30000, 0, -30000], [30000, 0, 4000], [-30000, 0, 4000]], { pink: 0.3 },
      { ramp: [cam.project([0, 0, -9000])[1], 0.12, cam.project([0, 0, 1500])[1], 0.5] });
  const FLAG = 600, J = 16;
  const B = { x0: -1800, x1: 1800, z0: -2400, z1: 600 };        // the flags round the bench
  const bc = [[B.x0, 0, B.z0], [B.x1, 0, B.z0], [B.x1, 0, B.z1], [B.x0, 0, B.z1]].map(p => cam.project(p));
  const bil = (u, v) => [0, 1].map(k => lerp(lerp(bc[0][k], bc[1][k], u), lerp(bc[3][k], bc[2][k], u), v));
  for (let x = B.x0; x < B.x1; x += FLAG) for (let z = B.z0; z < B.z1; z += FLAG) {
    const q = [[x + J, 0, z + J], [x + FLAG - J, 0, z + J], [x + FLAG - J, 0, z + FLAG - J], [x + J, 0, z + FLAG - J]];
    const uv = q.map(([px, , pz]) => bil((px - B.x0) / (B.x1 - B.x0), (pz - B.z0) / (B.z1 - B.z0)));
    objs.push({ group: 'ground', path: path2(uv), inks: { pink: 0.1 }, knockout: true, depth: cam.depth([x, 0, z]) });
  }
  return objs;
}
const OBJECTS = buildObjects();
const ordered = OBJECTS;
```

Every surface in the scene will be one **object**: a screen shape, the ink values it prints at, and
whether it knocks out what is behind it. The scene's plates walk the list in order and treat every
object the same way on every plate: print it at its value, or clear it from a plate it does not
print. That is Part 03's rule ("Clear the subject out of every overlay plate") and its shared
geometry ("built before the branches") applied once, for every surface, instead of by hand. Replace
`drawArt` with the plates and the diagnostic views:

```js
// ── the plates, and the diagnostic views ────────────────────────────────────
scene('bench', {
  inks: ['pink', 'blue', 'indigo', 'orange'],
  plates(g, ink) {
    for (const o of ordered) {                                    // one shape per surface, on every plate
      g.save();
      if (o.clip) g.clip(o.clip);
      const a = o.inks[ink];
      if (o.ramp && a) {                                          // a value that falls away with distance
        const [y0, a0, y1, a1] = o.ramp;
        carve(g, o.path); shade(g, o.path, { x0: 0, y0, x1: 0, y1, stops: [[0, a0], [1, a1]] });
      }
      else if (o.knockout) a ? plane(g, o.path, a) : carve(g, o.path);   // print it, or clear it from this plate
      else if (a) print(g, o.path, a);                            // a shadow: laid over what is already there
      g.restore();
    }
  },
});

function drawArt(t) {
  paintBaked('bench');
  if (VIEW === 'value') {
    const im = ctx.getImageData(0, 0, W, W), d = im.data;
    for (let i = 0; i < d.length; i += 4) { const y = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; d[i] = d[i + 1] = d[i + 2] = y; }
    ctx.putImageData(im, 0, 0);
  }
  if (VIEW === 'structure') {                                     // the world's planes, through the same camera
    const seg = (a, b) => { const p = cam.line(a, b); if (p.length) { ctx.beginPath(); ctx.moveTo(...p[0]); ctx.lineTo(...p[1]); ctx.stroke(); } };
    ctx.save(); ctx.lineWidth = 1.5; ctx.setLineDash([8, 7]);
    ctx.strokeStyle = '#e34e84';                                  // the ground, every 600 mm
    for (let x = -3000; x <= 3000; x += 600) seg([x, 0, -3000], [x, 0, 3000]);
    for (let z = -3000; z <= 3000; z += 600) seg([-3000, 0, z], [3000, 0, z]);
    ctx.restore();
  }
}
```

The two views are the drawing-machine study's, in your own file. The value view is the page turned
to luminance, like Part 06's `gray`. The structure view is drawn **after** the print, directly on the
page, through the same camera: a dashed line along every 600 mm of the ground, exactly where the
flags' joints should be. It is not printed and not screened; it is a diagnostic.

**Predict** whether the flags will match the dashed lines. Then:

```sh
node shoot.mjs $PART/work/bench/index.html --times 0 --query "view=structure" --engine firefox --out $OUT/ground-bilerp
```

<details>
<summary>After looking</summary>

They do not. The flags look like paving, receding in rows, and their joints cross the dashed grid at
every angle. Some joints happen to lie near a dashed line; they are the wrong joints. (Outside the
patch there are no flags yet, so the ground there is unbroken joint colour.)
</details>

Measure it. In the console of the open page:

```js
const B = { x0: -1800, x1: 1800, z0: -2400, z1: 600 };
const bc = [[B.x0, 0, B.z0], [B.x1, 0, B.z0], [B.x1, 0, B.z1], [B.x0, 0, B.z1]].map(p => cam.project(p));
const bil = (u, v) => [0, 1].map(k => lerp(lerp(bc[0][k], bc[1][k], u), lerp(bc[3][k], bc[2][k], u), v));
const miss = (x, z) => { const p = cam.project([x, 0, z]), q = bil((x - B.x0) / (B.x1 - B.x0), (z - B.z0) / (B.z1 - B.z0)); return Math.round(Math.hypot(p[0] - q[0], p[1] - q[1])); };
[bc.map(p => p.map(Math.round)), miss(1800, 600), miss(1200, -1800), miss(600, -1200), miss(0, 0)];
```

<details>
<summary>After measuring</summary>

About `[[-593, 502], [722, 287], [1671, 576], [-1049, 2045]]`, then 0, 82, 252 and 630. The four
corners are exact, because they were projected; the corner at (1800, 600) is one of them, so its
miss is 0. Between the corners the misses grow to hundreds of pixels. Notice also where the corners
land: two of them are far outside the frame, one of them 2045 px down the page, because the patch
runs close to the camera. The nearer a surface comes to the camera, the less its projection behaves
like a flat shape on the page.
</details>

*Construct space once* names the fault: "Interpolating in screen space across four projected corners
gives wrong spacing." Projection divides by depth, and depth changes across the patch, so equal steps
in the world are not equal steps on the page. In the `visual-kit.mjs` source, the comment above
`function plane` says it in one line: "screen-space bilerp is not perspective".

### Project every point

The fix is to build each flag where it is, in the world, and project **its** corners. Replace the
loop and the lines before it (from `const B =` to the end of the loop) with:

```js
  const G = { x0: -6000, x1: 6000, z0: -9000, z1: 3600 };      // runs under and behind the camera
  const B = { x0: -1800, x1: 1800, z0: -2400, z1: 600 };        // the flags round the bench: the fault's patch
  const bc = [[B.x0, 0, B.z0], [B.x1, 0, B.z0], [B.x1, 0, B.z1], [B.x0, 0, B.z1]].map(p => cam.project(p));
  const bil = (u, v) => [0, 1].map(k => lerp(lerp(bc[0][k], bc[1][k], u), lerp(bc[3][k], bc[2][k], u), v));
  for (let x = G.x0; x < G.x1; x += FLAG) for (let z = G.z0; z < G.z1; z += FLAG) {
    const q = [[x + J, 0, z + J], [x + FLAG - J, 0, z + J], [x + FLAG - J, 0, z + FLAG - J], [x + J, 0, z + FLAG - J]];
    if (PAVING === 'bilerp' && x >= B.x0 && x < B.x1 && z >= B.z0 && z < B.z1) {   // the fault: interpolated on screen
      const uv = q.map(([px, , pz]) => bil((px - B.x0) / (B.x1 - B.x0), (pz - B.z0) / (B.z1 - B.z0)));
      objs.push({ group: 'ground', path: path2(uv), inks: { pink: 0.1 }, knockout: true, depth: cam.depth([x, 0, z]) });
    } else add('ground', q, { pink: 0.1 });                     // laid on the ground plane, then projected
  }
```

`add` projects through `cam.polygon`, which clips at the camera's near plane before projecting
(read `clip` in `visual-kit.mjs`). That is why the paving can now run under and behind the camera,
out of the frame's bottom edge, where the four-corner method could not go at all: a corner behind
the camera has no projection to interpolate between. The fault stays behind a switch, so you can
compare (the dashed grid runs 3 m each way from the bench; beyond it there is nothing to compare
against):

```sh
node shoot.mjs $PART/work/bench/index.html --times 0 --query "view=structure" --engine firefox --out $OUT/ground-projected
node shoot.mjs $PART/work/bench/index.html --times 0 --query "view=structure&paving=bilerp" --engine firefox --out $OUT/ground-bilerp
```

In the projected version every joint lies on a dashed line, as far as the grid runs.

## 5. Solids that know which way they face

The bench is made of wooden boards, and a board is a box with six faces. In a world, a face has two
properties a flat drawing never had to know: which way it points (so which faces the camera can see)
and how squarely it meets the light (so how light it is). Add the supplied solid, **above** the
`// ── every surface, once` block. Everything `buildObjects` uses must be defined before it runs, and it
runs where it is written (`const OBJECTS = buildObjects();`): a `const` declared further down is not yet
initialised when it is called, and the page stops with a `ReferenceError`. The same goes for every block
in the next sections:

```js
// ── solids: faces that know which way they point ────────────────────────────
const LIGHT = [0.55, -1, 0.35];                     // the direction light travels: high, from behind and to the left

/* A solid with six four-sided faces: c[0..3] the bottom, c[4..7] the top above them. Each face knows
   its outward normal, whether it is turned toward the eye, and how squarely it meets the light. */
function solid(c) {
  const centre = v3.mul(c.reduce((s, p) => v3.add(s, p), [0, 0, 0]), 1 / 8);
  return [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]].map(ix => {
    const q = ix.map(i => c[i]), mid = v3.mul(q.reduce((s, p) => v3.add(s, p), [0, 0, 0]), 0.25);
    let n = v3.cross(v3.sub(q[1], q[0]), v3.sub(q[3], q[0]));
    if (v3.dot(n, v3.sub(mid, centre)) < 0) n = v3.mul(n, -1);
    n = v3.mul(n, 1 / Math.hypot(...n));
    return { q, n, facing: v3.dot(n, v3.sub(EYE, mid)) > 0,
             lit: Math.max(0, -v3.dot(n, LIGHT) / Math.hypot(...LIGHT)) };
  });
}
const box = (x0, y0, z0, x1, y1, z1) => solid([[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1],
                                               [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]]);
// A board attached to a host surface: the region u0..u1, v0..v1 of the plane, t thick along its normal n.
function board(surf, n, u0, u1, v0, v1, t) {
  const a = [surf(u0, v0), surf(u1, v0), surf(u1, v1), surf(u0, v1)];
  return solid([...a, ...a.map(p => v3.add(p, v3.mul(n, t)))]);
}
```

A face's normal is the cross product of two of its edges, turned to point away from the solid's
centre. It faces the camera when the normal points toward the eye; a face turned away is never drawn,
which removes the hidden half of every box without any visibility test. `lit` is the cosine between
the normal and the direction the light comes from: 1 for a face square to the light, 0 for one edge-on
or turned away. This is Part 06's single light, computed instead of decided. Three value steps will do,
chosen from `lit`, as you will see in the next section.

`board` is the host-surface idea as code: a region of a plane, in the plane's own (u, v), with a
thickness along its normal. A slat is a `board` on the seat; the seat is a `Space.plane`.

## 6. A bench, built on its surfaces

Now the bench. Its seat is a level plane; its backrest is a plane that leans back as it rises: the
sloped surface. The slats are boards on those two planes. Add, above `buildObjects`, after the solids:

```js
// ── the bench ───────────────────────────────────────────────────────────────
const zBack = y => -175 - LEAN * (y - 425) / 425;              // the posts' front face, leaning back as it rises
const BACK = Space.plane([-750, 470, zBack(470)], [1500, 0, 0], [0, 360, zBack(830) - zBack(470)]);   // host of the back slats
const backN = (() => { const n = v3.cross([1500, 0, 0], [0, 360, zBack(830) - zBack(470)]);           // its normal, to the front
                       return v3.mul(n, (n[2] > 0 ? 1 : -1) / Math.hypot(...n)); })();
const SEAT = Space.plane([-750, 425, 215], [1500, 0, 0], [0, 0, -430]);   // host of the seat slats: u along, v front to back

const bench = { legsLow: [], rails: [], posts: [], backSlats: [], seatSlats: [], armsHigh: [], arms: [] };
for (const s of [-1, 1]) {                                       // the two ends
  const x0 = s * 700 - 25, x1 = s * 700 + 25;
  bench.legsLow.push(box(x0, 0, 175, x1, 425, 225));             // front leg, below the seat
  bench.armsHigh.push(box(x0, 450, 175, x1, 650, 225));          // the same post above it: one leg, split at the seat
  bench.legsLow.push(box(x0, 0, -225, x1, 425, -175));           // rear leg
  bench.rails.push(box(x0, 375, -175, x1, 425, 175));            // the rail the seat slats rest on
  bench.posts.push(solid([[x0, 425, -225], [x1, 425, -225], [x1, 425, -175], [x0, 425, -175],
                          [x0, 850, -225 - LEAN], [x1, 850, -225 - LEAN], [x1, 850, -175 - LEAN], [x0, 850, -175 - LEAN]]));
  bench.arms.push(box(s * 700 - 35, 650, -230, s * 700 + 35, 675, 265));
}
for (let i = 0; i < 5; i++)                                      // five seat slats, 70 deep, 20 apart, front to back
  bench.seatSlats.push(board(SEAT, [0, 1, 0], 0, 1, i * 90 / 430, (i * 90 + 70) / 430, 25));
for (let i = 0; i < 4; i++)                                      // four back slats up the leaning plane
  bench.backSlats.push(board(BACK, backN, 0, 1, i * 95 / 360, (i * 95 + 70) / 360, 20));
```

(Ignore for now that the front leg is two boxes, `legsLow` and `armsHigh`. Section 7 is about why.)

The rear posts are not boxes: they lean with the backrest, so their tops are set back by `LEAN`. The
back slats are spaced up the leaning plane in its own `v`, so they share its slope, its foreshortening
and its thickness direction. You never had to decide how much each slat foreshortens: the plane and
the camera decide it.

To draw the bench, add the faces to `buildObjects`, in groups, in this order. `paint` and `faces` go
first, straight after `add`. Then, after the ground (group 1), add group 3; then 4; then 7. (Groups 2,
5 and 6 come in sections 8 and 9; keep the numbers so the order stays readable.)

```js
  const paint = { top: { blue: 0.42 }, face: { blue: 0.75 }, shade: { blue: 0.95, indigo: 0.35 } };
  const faces = (group, sol) => { for (const f of sol) if (f.facing)
    add(group, f.q, f.lit > 0.75 ? paint.top : f.lit > 0.2 ? paint.face : paint.shade); };

  // 3 behind and below the seat: legs below it, rails, posts, back slats
  for (const s of [...bench.legsLow, ...bench.rails, ...bench.posts]) faces('support', s);
  for (const s of bench.backSlats) faces('back', s);
  // 4 the seat
  for (const s of bench.seatSlats) faces('seat', s);
  // 7 in front of everything: the posts above the seat, and the arms
  for (const s of [...bench.armsHigh, ...bench.arms]) faces('front', s);
```

Three values from `lit`: faces that
meet the light squarely print a light blue; faces at a slant, a mid; faces turned away, a near-solid
blue overprinted with indigo, which is the frame's dark (Part 06: "Darks are overprints"). That is a
value plan, in three lines, that every face follows.

Export and look, in ink and in the structure view. Add the seat's and the backrest's host planes to
the structure view first, so the view shows every surface that details are attached to. In the
`VIEW === 'structure'` branch, before `ctx.restore()`:

```js
    ctx.strokeStyle = '#2e3192';                                  // the seat's and the backrest's host planes
    const top = (u, v) => { const p = SEAT(u, v); return [p[0], SEAT_Y, p[2]]; };
    for (let u = 0; u <= 1.001; u += 0.1) { seg(top(u, 0), top(u, 1)); seg(BACK(u, 0), BACK(u, 1)); }
    for (let v = 0; v <= 1.001; v += 0.25) { seg(top(0, v), top(1, v)); seg(BACK(0, v), BACK(1, v)); }
```

```sh
node still.mjs $PART/work/bench/index.html --at 0 --out $OUT/bench-v1.png
node shoot.mjs $PART/work/bench/index.html --times 0 --query "view=structure" --engine firefox --out $OUT/bench-v1-structure
```

Check that the seat grid's lines lie along the slats' tops, and that the backrest grid's lines lean
with the back slats, just behind them: `BACK` is the posts' front face, the plane the slats are fixed
to, and each slat stands 20 mm in front of it.

## 7. What covers what

Projection gives every point its place on the page. It does not say which of two surfaces is in
front where they overlap. Read [*Occlusion and light*](../../../../docs/scene-space.md#occlusion-and-light),
its first bullet: "An average-depth painter sort can put a wall or table over its own details. In the
drawing-machine study it did exactly that; explicit background/support/object/detail order fixed it
... Sort only suitable disjoint surfaces or use explicit order; split intersecting geometry at the
overlap. There is no depth buffer."

### The automatic order

Every object already carries its mean depth. The automatic answer is to sort by it, far to near, the
way Part 03's "automatic sorting" alternative did for snow specks. Replace `const ordered = OBJECTS;`:

```js
const ordered = ORDER === 'depth' ? OBJECTS.slice().sort((a, b) => b.depth - a.depth) : OBJECTS;
```

Your explicit order stays the default; `?order=depth` gives the sorted one. **Predict** what the sort
will get wrong. The ground is one enormous quad; the flags are 600 mm squares; the bench's faces are
small. Then:

```sh
node still.mjs $PART/work/bench/index.html --at 0 --out $OUT/bench-explicit.png
node shoot.mjs $PART/work/bench/index.html --times 0 --query "order=depth" --engine firefox --out $OUT/bench-depth
row $OUT/order-ab.png 540 $OUT/bench-explicit.png $OUT/bench-depth/t_000.000.png
```

Keep this comparison; you will repeat it in section 8 when there is more to get wrong.

<details>
<summary>After looking: what you should be seeing</summary>

The near front leg ends above the ground: its foot is cut off by a flag. That flag's mean depth is
nearer the camera than the mean depth of the leg's faces, so the sort draws the flag afterwards, over
the leg that stands on it. At the seat's near end, the rail the slats rest on is drawn over the slats'
ends: the rail's top face is short and near the camera, the slats are long and reach far away, so the
rail's mean depth is the nearer. The back slats and the far legs come out right, because they are
disjoint boards of similar size that nothing stands on: the case where a sort works.
</details>

The fault is not a bug in the sort. Mean depth is one number for a whole surface, and a surface that
is large, or that something stands on, is nearer than its neighbour at one end and further at the
other. A flag under a leg is both behind the leg (where the leg stands on it) and in front of the leg's
far faces (in mean depth). No single number orders them.

### A part that passes through a surface

The front leg is two boxes because it goes through the seat: at the seat's front corners the slats
pass through it. Below the seat it belongs with the other supports, under the seat. Above the seat it
rises out of the seat and holds up the arm, and nothing on the seat may cover it. One box can only
have one place in the order. Try it as one piece. Make a copy:

```sh
mkdir -p $PART/work/faults
cp $PART/work/bench/index.html $PART/work/faults/leg-behind.html
```

In `leg-behind.html`, replace the two lines that make `legsLow`'s front leg and `armsHigh` with one
box drawn with the support, behind the seat:

```js
  bench.legsLow.push(box(x0, 0, 175, x1, 650, 225));             // front leg, whole, drawn behind the seat
```

```sh
node still.mjs $PART/work/faults/leg-behind.html --at 0 --out $OUT/leg-behind.png
"$FFMPEG" -loglevel error -y -i $OUT/bench-explicit.png -i $OUT/leg-behind.png \
  -filter_complex "[0]crop=360:420:200:300[a];[1]crop=360:420:200:300[b];[a][b]hstack" $OUT/leg-ab.png
```

<details>
<summary>After looking</summary>

The near arm floats. The post that should hold it up above the seat is hidden behind the seat slats,
so the arm's end hangs in the air over the seat with nothing under it.
</details>

Now think the other way: the whole leg drawn with the front group, after the seat. In this view it
happens to look right, because the leg's front face (z = 225) stands 10 mm in front of the seat's front
edge (z = 215), so nothing on the seat should cover it anywhere. Move the legs 40 mm back (z 135 to
185) and it fails the other way: the front slat now passes in front of the leg, and the leg drawn over
it cuts it. The split is right in both cases. That is the rule's second half: "split intersecting
geometry at the overlap".

Write in your notes the explicit order you used, as a list of groups, and one sentence for each on why
it is where it is.

## 8. Shadows on the surfaces that receive them

Part 06 grounded the snail with `bed`, and said what it did not know: where the light is and what
shape the ground has. Here both are known. A shadow is the solid seen from the light: each of its
points moved along the light's direction until it meets the receiving surface. Add, above `buildObjects`:

```js
// ── shadows: a point dropped along the light onto a level surface ───────────
const onPlane = (p, h) => { const k = (p[1] - h) / -LIGHT[1]; return [p[0] + LIGHT[0] * k, h, p[2] + LIGHT[2] * k]; };
// An outline wound clockwise on screen, so that outlines added to one Path2D fill as a union.
// (Canvas fills by the nonzero rule: two overlaps wound opposite ways cancel, and leave a hole.)
const clockwise = pts => { let a = 0; pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; });
                           return a < 0 ? pts.slice().reverse() : pts; };
```

`onPlane(p, h)` drops a point along `LIGHT` onto the level surface at height `h`. A solid's shadow is
all its faces dropped that way and filled together. The winding fix is a trap worth knowing: the
first version of this shadow printed as a checkerboard of holes, because half the dropped faces were
wound one way and half the other, and where two overlapped they cancelled. Part 07's `snailParts`
comment described the same rule.

In `buildObjects`, after `add`, `paint` and `faces`, add the helper, and then two groups in their
places in the order: group 2 after the ground, group 5 after the seat.

```js
  const shadowOf = (sols, h) => { const p = new Path2D();
    for (const sol of sols) for (const f of sol) { const pts = P(f.q.map(q => onPlane(q, h))); if (pts.length > 2) p.addPath(path2(clockwise(pts))); }
    return p; };

  // 2 on the ground: the bench's cast shadow, and a contact shadow under each foot
  const all = Object.values(bench).flat();
  objs.push({ group: 'ground-shadow', path: shadowOf(all, 0), inks: { indigo: 0.5 }, knockout: false, depth: cam.depth([0, 0, 200]) });
  for (const leg of bench.legsLow) {
    const a = leg[0].q[0], c = leg[0].q[2], pad = 18;
    add('ground-shadow', [[a[0] - pad, 0, a[2] - pad], [c[0] + pad, 0, a[2] - pad], [c[0] + pad, 0, c[2] + pad], [a[0] - pad, 0, c[2] + pad]],
        { indigo: 0.75 }, { knockout: false });
  }

  // 5 on the seat: what the backrest and the arms cast on it, clipped to the slats' tops
  const tops = new Path2D(); for (const s of bench.seatSlats) tops.addPath(path2(P(s[1].q)));
  objs.push({ group: 'seat-shadow', path: shadowOf([...bench.posts, ...bench.backSlats, ...bench.arms, ...bench.armsHigh], SEAT_Y),
              clip: tops, inks: { indigo: 0.55 }, knockout: false, depth: cam.depth([0, SEAT_Y, 0]) });
```

Four decisions are in those lines, each from *Occlusion and light* or earlier Parts.

- **A shadow belongs to the surface that receives it.** "A contact shadow lies on the receiving plane;
  a cast shadow follows a chosen light direction. Don't offset a generic ellipse under everything." The
  ground's shadow is drawn right after the ground, so the bench stands on it; the seat's shadow is
  clipped to the slats' tops (`s[1]` is each slat's top face), so it falls on wood and not into the
  gaps between slats, where the light passes through to the ground below.
- **Shadows print over; they do not own.** `knockout: false`: a shadow is laid over the flags and
  their joints without clearing them, so the paving shows through it, darkened. The joints are still
  where they were.
- **One shadow per surface, not per object.** The shadow of the whole bench is one shape, so where two
  boards' shadows overlap they do not print darker (Part 06: tones add on a plate).
- **Contact is separate from cast shadow.** Each foot gets a small dark square on the ground under it,
  the constructed version of `bed`: whatever the light does, the place where a thing presses on
  another is dark.

Export, and repeat section 7's order comparison:

```sh
node still.mjs $PART/work/bench/index.html --at 0 --out $OUT/bench-v2.png
node shoot.mjs $PART/work/bench/index.html --times 0 --query "order=depth" --engine firefox --out $OUT/bench-v2-depth
row $OUT/order-ab-2.png 540 $OUT/bench-v2.png $OUT/bench-v2-depth/t_000.000.png
```

<details>
<summary>After looking: what the sort now gets wrong</summary>

Much more. The bench's shadow on the ground is cut off wherever nearer flags are drawn over it, so
most of it is missing; the contact squares under the feet are gone; and the shadows on the seat
vanish, because the seat's slats are sorted after them and cover them. The sort has no idea that a
shadow must come after the surface it falls on, because that is not a fact about depth at all.
</details>

## 9. The cup, attached

The cup from Part 09 goes on the seat. Its proportions come with it (lip 0.11 of the rim, foot 0.7,
crema below the rim, saucer larger than the rim); its ellipse ratio does not. Add, above `buildObjects`:

```js
// ── the cup: Part 09's proportions, as circles in the world ─────────────────
const CUPAT = [-400, SEAT_Y, -40];                               // on the seat, towards the back, near the near end
const RIM_R = 32, CUP_H = 55, FOOT_Y = SEAT_Y + 8;               // an espresso cup's size; the saucer 8 thick
const ring = (r, y, n = 48) => Array.from({ length: n }, (_, i) =>
  [CUPAT[0] + r * Math.cos(i / n * TAU), y, CUPAT[2] + r * Math.sin(i / n * TAU)]);
const cupRings = { saucerLow: ring(56, SEAT_Y), saucer: ring(56, FOOT_Y), foot: ring(0.7 * RIM_R, FOOT_Y),
                   rim: ring(RIM_R, FOOT_Y + CUP_H), inner: ring(0.89 * RIM_R, FOOT_Y + CUP_H),
                   crema: ring(0.8 * RIM_R, FOOT_Y + CUP_H - 14) };
// A point on the cup's wall: azimuth az round it, h from foot (0) to rim (1). The handle's roots are on it.
const wall = (az, h) => { const r = lerp(0.7 * RIM_R, RIM_R, h);
                          return [CUPAT[0] + r * Math.cos(az), FOOT_Y + h * CUP_H, CUPAT[2] + r * Math.sin(az)]; };
const HANDLE = [wall(0.25, 0.72), v3.add(wall(0.25, 0.62), [20, 0, 5]), v3.add(wall(0.25, 0.32), [18, 0, 4]), wall(0.25, 0.2)];
```

Every ring is a circle in the world at the height it belongs, and the cup's wall is a surface with its
own coordinates: `wall(az, h)` is a point on the wall. The handle is four points: two **roots on the
wall** and two held out from it. Part 09's lower root landed on the saucer by accident; here it cannot,
because it is a point on the wall by definition.

In `buildObjects`, add group 6 between 5 and 7, and the cup's shadow into group 5:

```js
  objs.push({ group: 'seat-shadow', path: path2(hull([...cupRings.rim, ...cupRings.foot].map(p => cam.project(onPlane(p, SEAT_Y))))),
              clip: tops, inks: { indigo: 0.6 }, knockout: false, depth: cam.depth(CUPAT) });
  // 6 the cup: every ellipse a circle in the world, projected; a frustum's outline is the hull of its two rims
  const proj = pts => pts.map(p => cam.project(p));
  const cup = (path, inks, o) => objs.push({ group: 'cup', path, inks, knockout: true, depth: cam.depth(CUPAT), ...o });
  cup(path2(hull(proj([...cupRings.saucerLow, ...cupRings.saucer]))), { orange: 0.9, pink: 0.75 });   // the saucer's edge
  cup(path2(proj(cupRings.saucer)), { orange: 0.9, pink: 0.35 });                                     // its top
  cup(path2(hull(proj([...cupRings.foot, ...cupRings.rim]))), { orange: 0.9, pink: 0.6 });           // the body
  cup(path2(proj(cupRings.rim)), {});                                                                 // the lip and the white inside
  cup(path2(proj(cupRings.crema)), { orange: 0.45 }, { clip: path2(proj(cupRings.inner)) });          // crema, below the near wall
  cup(nib(proj(HANDLE), () => 3.2, { per: 8 }), { orange: 0.9, pink: 0.6 });                          // the handle, rooted on the wall
```

The cup's body is a frustum, a cone with its top cut off, and the outline of a projected frustum is the
convex hull of its two projected rims: the cheapest correct silhouette there is. The crema is clipped by
the inner lip, so the near wall hides its near edge (Part 09's observation, now a clip). The handle is
a `nib` through the projected handle points, from Part 05.

Export, and measure the cup's ellipses in the console of the page:

```js
const ratio = pts => { const s = pts.map(p => cam.project(p)), xs = s.map(p => p[0]), ys = s.map(p => p[1]);
                       return +((Math.max(...ys) - Math.min(...ys)) / (Math.max(...xs) - Math.min(...xs))).toFixed(2); };
[ratio(cupRings.rim), ratio(cupRings.saucer)];
```

<details>
<summary>After measuring</summary>

About 0.33 and 0.36: much flatter than Part 09's 0.8, because this camera looks at the seat far less
steeply than the photograph's camera looked into the cup. And the two differ from each other, because
the saucer is lower and nearer than the rim, and the camera sees it at a slightly different angle. A cup
drawn with Part 09's 0.8 on this bench would tip toward the viewer and disagree with every slat under
it. The ratio is not a property of the cup; it belongs to the cup and the camera together.
</details>

## 10. Inspect it

Complete the structure view with three light rays, so you can check the shadows against the light. In
the `VIEW === 'structure'` branch, after the host planes:

```js
    ctx.setLineDash([]); ctx.strokeStyle = '#e34e84'; ctx.lineWidth = 2;   // three rays of light, to where they land
    for (const [p, h] of [[[-735, 675, 265], 0], [[-700, 850, -335], 0], [HANDLE[1], SEAT_Y]]) seg(p, onPlane(p, h));
```

Each ray runs from a point on the bench (the near arm's front corner, the middle of a back post's
top, the handle) to where `onPlane` drops it. It should end where the shadow shows that point: at the
tip of the arm's shadow, on the post's shadow, at the handle's shadow on the seat. A ray that ends
somewhere else means the shadow and the light disagree. Then export the three
views and four 1:1 crops:

```sh
node still.mjs $PART/work/bench/index.html --at 0 --out $OUT/bench.png
node shoot.mjs $PART/work/bench/index.html --times 0 --query "view=structure" --engine firefox --out $OUT/bench-structure
node shoot.mjs $PART/work/bench/index.html --times 0 --query "view=value" --engine firefox --out $OUT/bench-value
node verify.mjs $PART/work/bench/index.html --times 0
crop $OUT/bench.png 420 420 $OUT/crop-cup.png     # the cup on the seat
crop $OUT/bench.png 320 900 $OUT/crop-foot.png    # the near front foot on the paving
crop $OUT/bench.png 290 390 $OUT/crop-arm.png     # the arm on its post, over the seat
crop $OUT/bench.png 880 120 $OUT/crop-back.png    # back slats meeting the far post
```

(If your camera differs, choose crop positions that hold the same four places.) For each crop, write
what is touching what, and whether a viewer could tell: the saucer's edge on a slat and its shadow on
the slats in front of it; the foot in its contact square; the arm resting on the post, the post in front of the seat;
the slats' ends against the post.

In the structure view, check: every paving joint on a dashed line; the seat grid along the slats; the
backrest grid leaning with the back slats; each ray ending on the shadow of the point it starts from. In the value view,
check Part 07's question: does the bench separate from the ground and the cup from the seat, as value
groups, without colour?

<details>
<summary>After inspecting: what the reference shows</summary>

At 1:1 the saucer sits on a slat with its shadow falling forward and to the right across the next
slats, away from the light; the handle is
a small loop on the side of the cup, its roots on the wall; the near foot stands in a dark square that
reads as contact on the paving; the arm lies on its post, which runs down in front of the seat's slats
to the leg. In the structure view the joints lie on the grid everywhere, and each ray ends on its
point's shadow: the arm's ray at the tip of the arm's shadow, the handle's at the edge of the cup's
shadow. In the value view the bench is a dark group on a light ground, the cup a small mid
on the dark seat.
</details>

### What the tests prove

The geometry kit has its own tests. Run them:

```sh
node visual-kit.test.mjs
node scene-space.test.mjs
```

Read both files. `visual-kit.test.mjs` checks, with exact numbers, that two points on a ground plane
at twice the depth project at half the size (perspective's rule), that points behind the camera return
`null`, that polygons and lines crossing the near plane are clipped rather than wrapped, and the timing
functions you will meet in Part 13. `scene-space.test.mjs` opens the drawing-machine study at three
playback speeds and checks that seven frames are identical at each (a motion property for Part 13),
and measures how long a frame takes to draw. It needs Firefox, the primary engine.

Write in your notes what they establish about **your** scene, and what they do not. They prove that
`Space.camera`, `Space.plane` and clipping do what they claim, which is why the joints now land on the
grid. They say nothing about whether your paving is placed where you meant, whether your order is right,
whether the shadows look right, or whether the picture is any good: those were settled by the
structure view, the order comparisons and the crops. *Known gaps* in `docs/visual-development.md`
says it for the kit as a whole: "camera, mapped surfaces, near clipping ... not anatomy, visibility,
physics or judgment."

### Optional: a camera move that is not one

Part 02 showed that rescaling a screened plate makes moiré. A camera that pushes in is the tempting
place to do it anyway: enlarge the finished print. Try it, and the honest alternative, in two copies:

```sh
cp $PART/work/bench/index.html $PART/work/faults/zoom-bitmap.html
cp $PART/work/bench/index.html $PART/work/faults/zoom-camera.html
```

In `zoom-bitmap.html`, replace `paintBaked('bench');` with the finished print enlarged 1.15 times
about the centre:

```js
  const z = 1.15;                                     // a fake push-in: the finished print, enlarged about the centre
  ctx.save(); ctx.globalCompositeOperation = 'multiply';
  ctx.translate(540, 540); ctx.scale(z, z); ctx.translate(-540, -540);
  ctx.drawImage(bakeScene('bench', OUT), 0, 0); ctx.restore();
```

In `zoom-camera.html`, give the camera a 1.15 times longer lens instead: in the `cam` block, multiply
`focal` by 1.15, and move `cx, cy` 1.15 times further from (540, 540). Export both and crop the same
place:

```sh
node still.mjs $PART/work/faults/zoom-bitmap.html --at 0 --out $OUT/zoom-bitmap.png
node still.mjs $PART/work/faults/zoom-camera.html --at 0 --out $OUT/zoom-camera.png
crop $OUT/zoom-bitmap.png 700 300 $OUT/zoom-bitmap-crop.png
crop $OUT/zoom-camera.png 700 300 $OUT/zoom-camera-crop.png
```

The enlarged print's dots are larger and softer than the screen's, as in Part 02; the re-projected one
has the screen's own crisp dots at its own pitch, drawn from geometry. *Occlusion and light*: "Moving
camera: transform vector geometry, then screen at final pixel size; never scale a screened bitmap to
fake a dolly." What a camera that moves every frame costs, and how the repository pays for it, is
Part 17.

## 11. Compare with the reference

Open [`project/index.html`](project/index.html). Read its header comment, then compare:

```sh
node still.mjs $PART/project/index.html --at 0 --out $OUT/project.png
diffimg $OUT/bench.png $OUT/project.png $OUT/bench-vs-project.png
```

If you pasted every block as given, the difference image is black. Where it is not, find the block that
differs. Then read the reference's `buildObjects` from top to bottom as a list of decisions: it is the
explicit order written as code, and the numbered comments are its back-to-front plan.

## 12. Your own constructed object

Now build one yourself. Choose an object with at least:

- **one sloped surface** (a lectern, a deck chair, a drafting table, a laptop's open screen, a music
  stand, a roof);
- **repeated attached details** on a surface (keys, slats, buttons, rungs, tiles, strings);
- **support and contact** (it stands on something; something rests on it);
- **a foreground or attached occlusion** (a part in front of another, or a part through another).

If your Part 09 subject qualifies (a bicycle, a folding chair), use it and its references. Otherwise
choose one and look at at least one real example first (Part 09).

In `work/own/`:

1. Decide the world's units and write the object's dimensions as numbers, with where each came from
   (measured, referenced, or general knowledge, marked as such).
2. Make the camera by numbers: the bounds of the object, projected, scaled to the frame.
3. Build every detail on its host surface with `Space.plane`, and project every point. Include one
   deliberate screen-space interpolation behind a switch, and show in the structure view that it
   disagrees.
4. Write the explicit order as numbered groups. Find one part that passes through another and split
   it; include a depth-sorted version behind a switch, and describe what it gets wrong.
5. Add cast shadows from one light, on the surfaces that receive them, and a contact at every support.
6. Keep `?view=structure` and `?view=value`. Export the ink, structure and value views and at least two
   1:1 crops, one of an attachment and one of a contact.

The camera, the dimensions, the order and the values are your decisions. The supplied helpers
(`v3`, `path2`, `hull`, `solid`, `box`, `board`, `onPlane`, `clockwise`) may be copied as they are.

## 13. What this evidence is, and is not

The structure view, the light rays and the 1:1 crops of attachments and contacts are **construction**
evidence: they show the construction agreeing with itself (joints on the grid, slats on their planes,
shadows at the ends of their rays, roots on the wall). The order comparisons are construction evidence
about visibility. The value view is **perceptual** evidence about the value groups. The kit's tests
are **technical** evidence about the kit. `verify.mjs` is technical evidence about the frame.

What none of it establishes: that the bench is a good picture, or even a good bench. Its proportions
came from general knowledge, not from looking at benches; the light was chosen, not observed; the
composition is a three-quarter view that nobody compared with alternatives (Part 07). Nothing here tests
visibility in general either: the explicit order is correct for this camera and this object, and a
different camera could need a different order, which is exactly what `docs/scene-space.md` says of a
subject that turns ("needs layering by depth, not fixed rules"). Write these limits in your notes.

## 14. Decisions you should be able to defend

In your notes, give for each a situation where you would choose the alternative.

**A small projection kit, or a 3D renderer.** The problem: details must agree in perspective, and the
work must stay one self-contained HTML file whose every surface is a Canvas shape that the plates can
print, knock out and screen. The repository's kit is a few dozen lines of pure geometry: a camera,
planes, clipping. Every shape it produces is a `Path2D`, so the whole print system applies unchanged,
and it adds no library. A full 3D engine is the better choice when visibility must be solved in general
(many intersecting surfaces, objects that turn freely), when the camera moves arbitrarily, when meshes
deform, or when lighting must be computed rather than designed; then the price (a library, a renderer's
look, a pipeline from its pixels back to plates) is worth paying.

**Explicit order, or a depth buffer.** The problem: projection does not decide what covers what. An
explicit order, written as groups, is predictable and reviewable, and it can express rules that are
not about depth at all: a shadow after the surface it falls on, a clip to a slat's top, a part split at
a surface. It is right for designed 2D scenes with a handful of surfaces. A depth buffer (a per-pixel
nearest-depth test) is better for many intersecting surfaces where manual splitting becomes
unmanageable: a crowd of overlapping objects in 3D, a tangle of branches, a mesh.

**Perspective, or a coherent flat construction.** The problem: parts must agree with each other.
Perspective is one way to make them agree; it is not automatically better. An orthographic or graphic
flattening (isometric drawing, an elevation, a pattern-led poster) is the better choice when the art
direction rejects convergence on purpose, when measurements must read directly off the picture, or when
the picture is about pattern rather than place, provided every part follows the same flattening.
*Construct space once*: "Projection supports observed form; it doesn't impose a geometric style.
Organic contours and deliberate graphic flattening remain valid." What fails is mixing the two by
accident.

## Before you move on

You should have, in `work/`:

- [ ] `bench/index.html`: the world, the camera by numbers, projected paving with `?paving=bilerp`,
  solids on host planes, the explicit order with `?order=depth`, the split posts, shadows on their
  receiving surfaces and contacts, the cup attached, and `?view=structure` and `?view=value`;
  `verify.mjs --times 0` passes; the difference from `project/index.html` is black or explained.
- [ ] `faults/leg-behind.html` (and, optionally, `zoom-bitmap.html` and `zoom-camera.html`).
- [ ] `own/`: your constructed object, with its dimensions and their sources, its switches, its views
  and crops.
- [ ] `NOTES.md`: the study's four answers; the camera experiments; the bilerp measurements; the order
  comparisons before and after shadows; the leg experiment; your explicit order with a reason per group;
  the cup's ellipse ratios; the structure and value checks; the four crops; what the tests prove and do
  not; the comparison with the reference; your own object's record; the limits; the three decisions.

And in `out/course/10/` (regenerable): every export, view, comparison and crop.

You should be able to explain, without looking:

- what a camera's `focal`, `eye` and `target` decide, and why framing is done by numbers;
- why equal steps between projected corners are not equal steps in the world, and what to do instead;
- what a host surface is, and why details are built on it before they are projected;
- why a face's normal decides both whether it is drawn and how light it is;
- why a mean-depth sort fails for large surfaces and for things that stand on each other, and why a
  shadow's place in the order is not a depth question;
- why a part that passes through a surface is split at it;
- how a cast shadow is constructed from a light direction and a receiving surface, and what `bed` did
  instead;
- why an ellipse's ratio belongs to the camera and the object together;
- what the geometry tests prove, and what only the diagnostic views can show.

The sentence to carry forward: **perspective is a construction system, not a styling filter; attached
detail belongs to object space before it belongs to screen space.**

## Deliberately left for later

- **Travel by distance, and motion clocks** (Part 13). The kit's `pathByLength` and `travel` move
  things at a speed in world units per second; the tests you ran check them already.
- **Shared clocks for several moving systems** (Parts 13–14), which *Speed units and an owner* in
  `docs/scene-space.md` describes.
- **A moving camera, and live re-projection** (Part 17). Every surface here was baked once, for one
  camera. Re-projecting the vector geometry and re-screening it every frame is a different
  architecture with its own cost.
- **Layering that changes as a subject turns** (the motion Parts and the final film). An explicit
  order is right for one view; a subject that turns needs its layers decided per pose.
