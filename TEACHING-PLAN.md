# Learner-First Teaching Plan: Procedural Risograph Film

## Purpose and course contract

This plan is for a reasonably competent programmer or technical learner who begins with no knowledge of this repository's particular artistic or engineering approach and ends able to originate, build, inspect, score, revise, verify, and deliver an original procedural risograph film.

The repository is the source of truth. The course must teach the reasons behind its practices rather than merely turn `docs/` headings or helper names into lessons. Existing films, prints, studies, tools, skills, and craft documentation are evidence and reference material; the learner does not modify them. Exercises and the final project create new work only.

## Course target and skill boundary

This is specifically a **`riso-film` course**. Its primary production target and final deliverable are the moving-work pipeline defined by `.claude/skills/riso-film/SKILL.md`.

The course deliberately incorporates two supporting repository skills because they are dependencies of competent film production:

- **`riso-still`** supplies the still-image craft and inspection discipline that the learner must establish before motion can hide weak drawing or composition. Parts that use it are foundations or exercises inside the film curriculum, not a separate still-art course.
- **`riso-score`** supplies the deterministic sound, sync, scoring, mix, and delivery workflow used once the picture has a stable event structure. It is the sound subsystem of the final film curriculum, not an alternative course target.

The authoring agent must not choose among these three skills per Part. The Part sequence in this plan decides when each supporting skill becomes relevant. Unless this plan is explicitly amended, standalone `riso-still` or `riso-score` deliverables are exercises only; the capstone remains an original procedural risograph **film**.

The course deliberately separates four kinds of evidence that the repository itself keeps distinct:

- **Technical contract evidence:** exact seeking, reproducibility, dimensions, duration, frame count, audio length, decoding, and other facts tools can gate.
- **Construction evidence:** perspective, attachments, contact, occlusion, shared geometry, and whether an action is mechanically coherent.
- **Perceptual craft evidence:** silhouette, value, focus, tone, registration, continuity, pacing, timbre, and whether a transition or action reads at real speed.
- **Artistic judgment:** whether the concept, viewpoint, rhythm, ending, sound, and overall film are convincing. Passing technical checks does not establish this.

The scaffolding tapers intentionally. Parts 01–04 are tightly guided. Parts 05–11 require increasingly independent drawing and visual decisions. Parts 12–19 require the learner to choose appropriate motion and film architecture rather than merely follow recipes. Parts 20–28 are an original final project in which the course specifies evidence and review gates, not the film's creative answer.

## Course artifact boundary

The approved learner-facing course lives under `course/procedural-riso-film/`. This plan remains at the repository root as the pedagogical design contract; it is not itself learner-facing lesson material. Operational authoring rules live separately in `COURSE-AUTHORING.md`.

The course implementation should use this stable outer shape:

```text
course/
└── procedural-riso-film/
    ├── README.md
    └── parts/
        ├── 01-<descriptive-slug>/
        │   ├── PART.md
        │   └── project/        # only when the Part has a meaningful runnable/inspectable artifact
        ├── 02-<descriptive-slug>/
        │   ├── PART.md
        │   └── project/
        └── ...
```

`README.md` is the learner entry point and Part index. Each `PART.md` is the actual learner-facing teaching material. A `project/` directory is created only when it contains a meaningful artifact for that Part; empty placeholder directories are forbidden. The authoring agent may extend an earlier cumulative project when that better serves the pedagogy, but the Part must state clearly what is being extended and why.

Existing `films/`, `prints/`, `studies/`, `tools/`, `skills/`, and craft documentation remain source-of-truth evidence and are not learner workspaces. Course exercises and reference implementations must remain under the course tree unless an existing production workflow is being inspected rather than modified.

The course is generated one Part at a time. Git history is part of the course artifact: every completed Part must end in its own commit, with no unrelated repository changes included. The detailed session, command, verification, and commit protocol is defined in `COURSE-AUTHORING.md` rather than duplicated here.

---

# Course progression rationale

The order follows dependency rather than repository layout.

First, the learner needs an **inspectable procedural artifact** before they need a sophisticated riso image. Part 01 therefore establishes the single-file Canvas model, native backing store, `window.__riso`, exact seeking, and the tool harness. Parts 02–04 then establish the medium's non-negotiable mechanics: plate coverage, screening, overprint and knockouts, followed by deterministic randomness. This prevents later drawing and animation lessons from resting on an incorrect RGB-paint or frame-state mental model.

Next comes **still-image craft**. Parts 05–08 teach contour, variable-width marks, value, form, composition, focus, print tone, texture, and native-resolution inspection. Part 09 adds reference-led visual development only after the learner has enough drawing vocabulary to turn observations into decisions. Part 10 introduces scene space, perspective, attachment, and explicit occlusion. Part 11 is a still capstone that proves the learner can use the medium without any motion hiding weak construction.

Only then does the course add **time**. Parts 12–17 move from pure time input to material-specific motion, continuity, loops, anticipation, moving tone, and finally the expensive live-plate compositor. This sequence matters: live plates solve a specific moving-screen problem and should not become a default architecture before the learner understands simpler baked and live-element approaches.

Parts 18–19 move from animation to **filmmaking**: transitions carry the eye, then shots and edits carry an event. The learner sees montage, fixed-frame journeys, and continuous takes as alternative forms rather than inheriting the six-passage Resonance structure.

The original final film begins in Part 20. It starts with concept, references, a hard frame, and a hard action proof; Part 21 makes a full-duration silent rough before polish; Parts 22–23 finish and debug picture. Sound begins only after the picture has a stable event structure. Parts 24–27 move from deterministic audio contract to material/sync, musical structure and continuity, then mixing and perceptual review. Part 28 integrates picture and sound, revises observed failures, and performs final delivery and reproducibility checks.

This order also explains why some repository capabilities are intentionally late. `bandPass`, `relight`, full live plates, recorded sample banks, and sound mastering are powerful, but teaching them early would encourage cargo-cult use before the learner can diagnose the problem each one exists to solve.

---

# Parts

## Part 01 — An Exact Frame: Repository Contract and Inspection Harness

**Learner state entering the Part**  
Comfortable programming and reading JavaScript, but unfamiliar with this repository, Canvas delivery constraints, deterministic rendering, or the `__riso` contract.

**Problem or motivation**  
A normal browser animation can look correct while being difficult to reproduce, inspect at an exact moment, or export without dropped frames. Before learning the riso look, the learner needs to understand why this repository makes every work an inspectable function of time.

**Concepts introduced**  
Self-contained `index.html`; Canvas backing pixels versus CSS display size; `duration`, `ready`, and synchronous `seek(t)`; the role of `window.__riso`; exact still capture; Firefox as primary engine; generated work as authoritative source; the difference between realtime preview and exact offline rendering.

**What the learner builds**  
A new disposable still or one-second film scaffold containing only paper and one simple Canvas mark. The purpose is not aesthetic quality. The artifact must expose `__riso`, seek exactly, and export a native PNG.

**Teaching progression**  
Begin with `tools/fixture/index.html` as the smallest contract. Inspect what `new-riso.mjs` generates and identify which parts are infrastructure versus empty art space. Add one mark, seek to the same time repeatedly, capture it with `still.mjs`, then inspect the native pixel dimensions. Read the existing scaffold comments but do not yet use most craft helpers.

**Deliberate experiment/failure investigation**  
Contrast an ordinary `requestAnimationFrame`-driven stateful value with a value computed directly from `t`. The learner should see why a visual state reached by playback is not sufficient evidence that a cold seek will reproduce it.

**Existing repository material used as evidence/reference**  
`README.md`; `CLAUDE.md`; `tools/README.md`; `tools/fixture/index.html`; `tools/new-riso.mjs`; `tools/still.mjs`; `tools/render.mjs`; `tools/lib/browser.mjs`.

**Verification or observation exercise**  
Run `verify.mjs` and `still.mjs`; confirm native backing size rather than relying on browser scaling. Explain in writing what those checks establish and what they do not establish.

**Architectural/artistic choices that must be explained**  
- Exact `seek(t)` versus a stateful realtime loop: this repository chooses exact seeking because inspection and offline export are central. Stateful simulation is better for genuinely interactive systems whose state history is itself the product and exact random access is not required.
- One self-contained HTML versus a component/library build: self-containment improves reproducibility and delivery. A modular application build is better when a large team, shared runtime, or dynamic asset pipeline matters more than single-file portability.
- 1080 backing store with separate CSS size versus rendering at display CSS pixels: the backing store protects screen pitch and export resolution. CSS-sized rendering is acceptable for a web-only sketch where native export and halftone fidelity are irrelevant.

**What the learner should understand by the end**  
The work is not "an animation that happens to play"; it is a deterministic frame source that the tools drive exactly.

**Prerequisites**  
None beyond general programming competence.

**Concepts deliberately deferred to later Parts**  
Ink plates, halftone screens, seeded texture, drawing craft, motion continuity, shot metadata, sound, and artistic review.

---

## Part 02 — Ink, Paper, Screen: The Plate Model

**Learner state entering the Part**  
Can create and inspect an exact Canvas frame and understands the `__riso` contract, but still thinks primarily in normal RGB painting terms.

**Problem or motivation**  
Direct RGB fills can imitate a palette but cannot explain the repository's overprints, paper gaps, halftone gradients, registration misses, or darks. The learner needs the physical-print mental model before using the craft kit.

**Concepts introduced**  
Per-ink coverage layers; alpha as tone; halftone screening; ink tinting and multiply compositing; warm paper; fixed screen angle and pitch; overprint darks; registration offsets; no pure black; baked plates at displayed size.

**What the learner builds**  
A simple two- or three-ink abstract still containing a light area, a screened mid-tone, a deliberate overprint dark, and a visible registration edge. It should be simple enough that each plate's contribution can be reasoned about directly.

**Teaching progression**  
Start with a flat RGB version that looks superficially plausible. Rebuild the same arrangement as coverage on separate inks. Observe paper between dots, then overlap two inks to create a dark. Add a small fixed registration miss and compare it with simply drawing a decorative fringe.

**Deliberate experiment/failure investigation**  
Try to make the darkest region using one ink alone, then compare with an overprint. Compare a smooth alpha gradient laid after screening with a coverage gradient that changes dot size.

**Existing repository material used as evidence/reference**  
`.claude/rules/riso-plates.md`; `docs/brief.md` print-system section; `docs/drawing.md` value and tone sections; `docs/quality-bar.md`; `studies/index.html` ramp study; `prints/workings/index.html` print engine; Window Seat poster and contact sheet.

**Verification or observation exercise**  
Export a native PNG and inspect a 1:1 crop. The learner must identify paper gaps, dot pitch, ink overlap, and registration from pixels rather than from a reduced screenshot.

**Architectural/artistic choices that must be explained**  
- Coverage-before-screening versus smooth-opacity colour layers: coverage produces changing dot size and paper gaps. Smooth alpha is better when the desired medium is translucent digital paint rather than simulated print.
- Overprint darks versus `#000`: overprint keeps the image inside the print logic. Pure black is better only when the intended visual language genuinely includes a separate black plate or digital black, which this repository does not.
- Fixed registration offsets versus random per-frame misregistration: fixed offsets read as printing. Random motion may suit an intentionally unstable/glitch aesthetic, but it destroys this repository's static-print illusion.

**What the learner should understand by the end**  
A riso frame is assembled from ink decisions, not coloured pixels; the screen and paper are structural parts of the image.

**Prerequisites**  
Part 01.

**Concepts deliberately deferred to later Parts**  
Knockouts, shared geometry across plates, texture, sophisticated contours, moving screens, live plates.

---

## Part 03 — Knockouts, Ownership, and Draw Order

**Learner state entering the Part**  
Understands separate ink coverage and overprint, but has not yet dealt with bright subjects over dark grounds or the ordering hazards of plate construction.

**Problem or motivation**  
The most common plate fault in the repository is a bright subject printing muddy because the dark ground was never fully removed beneath it. Plate order can also make highlights, halos, ridges, or shared shapes contradict one another.

**Concepts introduced**  
Full-coverage knockouts with `destination-out`; why a toned knockout leaves screen gaps; draw order within one plate; shape ownership with clear-then-print; clearing every overlay plate; shared `Path2D` geometry; shared seeded geometry (`sr`) before per-ink branching.

**What the learner builds**  
A bright subject on a dark ground with one halo or secondary overlay, first intentionally wrong and then corrected. The same subject geometry must be used for its print and all knockouts.

**Teaching progression**  
Create the muddy version. Clear only the ground and observe an overlay still contaminating the subject. Clear every relevant plate. Then deliberately generate the shared shape separately inside each ink branch and observe why seeded-call order can cause misaligned knockouts; move shared geometry construction before the branches.

**Deliberate experiment/failure investigation**  
Three required failures: toned knockout, knockout on only one plate, and shared geometry built with inconsistent RNG consumption. The learner documents which pixel evidence distinguishes each failure.

**Existing repository material used as evidence/reference**  
`.claude/rules/riso-plates.md`; `prints/workings/index.html` `gather`; `studies/index.html` ramp/form examples; `docs/drawing.md`; `docs/motion.md` flame/relight notes for the later moving version.

**Verification or observation exercise**  
Inspect 1:1 crops of the corrected subject edge. Compare the same area with the wrong variants and state whether the observed darkening comes from intended overprint or unremoved underlying plate.

**Architectural/artistic choices that must be explained**  
- Full knockout versus partial/toned knockout: full knockout is necessary when the goal is bare paper under the subject. Partial knockout is better when a deliberately translucent or blended overprint is the artistic goal.
- Shared geometry object versus visually similar independently generated shapes: shared geometry guarantees plate agreement. Independent shapes are better only when the offset/deformation itself is intentional and controlled.
- Explicit draw order versus general painter sorting: explicit order is necessary when a plate's carve/print semantics matter. Automated sorting is useful for large sets of disjoint objects with reliable depth relations.

**What the learner should understand by the end**  
Plate construction is an ordered program. A shape's visual result depends on what was present before it and what survives after it.

**Prerequisites**  
Parts 01–02.

**Concepts deliberately deferred to later Parts**  
Perspective/occlusion ordering, moving relight masks, live plate composition.

---

## Part 04 — Pure Time and Stable Randomness

**Learner state entering the Part**  
Can construct static plates correctly but has not yet distinguished deterministic seeking from stable appearance across neighbouring times.

**Problem or motivation**  
Procedural texture makes riso work convincing, but naïve randomness causes either hard reproducibility failures or visually crawling texture. A render can also be repeatable at each timestamp yet still look discontinuous in motion.

**Concepts introduced**  
`rngFor(key)`; frozen stable keys; seeded paper and geometry; deterministic wobble; why `Math.random()` is prohibited in render paths; per-time seeding versus stable object identity; cold-seek and seek-history tests; the invariants hook.

**What the learner builds**  
A small procedural composition with a wobbled contour, speckle, and one parameter that can later move. The learner makes three variants: unseeded, time-seeded, and stable-keyed.

**Teaching progression**  
First let `Math.random()` fail repeated seeks. Then make a frame-repeatable version seeded from time and discover that adjacent frames still crawl. Finally key persistent texture to object identity while reserving explicit smooth functions of `t` for things that are supposed to change.

**Deliberate experiment/failure investigation**  
The time-seeded variant is important because it demonstrates a real limitation of `verify.mjs`: exact repeated frames can pass while temporal texture is visually bad.

**Existing repository material used as evidence/reference**  
`CLAUDE.md` invariants; `.claude/hooks/check-film-invariants.py`; `tools/verify.mjs`; `.claude/rules/riso-plates.md`; `docs/motion.md` determinism section; common `rngFor`, `makeWob`, and `wobbler` implementations in the studies and films.

**Verification or observation exercise**  
Run `verify.mjs`, then create a short frame-spaced strip of the time-seeded and stable-keyed versions. The learner must explain why one passes a technical contract yet fails visual continuity.

**Architectural/artistic choices that must be explained**  
- Object-stable seeds versus frame/time seeds: stable seeds preserve material identity. Time-varying noise is better for phenomena that genuinely change, such as turbulence, but should vary smoothly and intentionally rather than redraw identity.
- Frozen keys after approval versus casually renaming keys: frozen keys make revisions comparable. Rekeying is useful when the art direction intentionally wants a new procedural instance and comparison stability is no longer required.

**What the learner should understand by the end**  
Determinism is necessary for inspection but is not the same as continuity. Randomness must have an owner and a lifetime.

**Prerequisites**  
Parts 01–03.

**Concepts deliberately deferred to later Parts**  
Loop-safe motion, `wander`, analytic trajectories, time-based animation, shared action clocks.

---

## Part 05 — From Primitives to Designed Contours and Marks

**Learner state entering the Part**  
Understands plate mechanics and stable procedural randomness, but may still draw recognizable subjects as circles, rectangles, and constant-width strokes.

**Problem or motivation**  
The repository's own diagnosis is that helper-shaped scenes became generic: ellipses, rings, arc fans, straight polylines, and constant line widths produced parts without convincing silhouette or action.

**Concepts introduced**  
`Path2D`; contour as one designed boundary; `curve`; `cut`; corners through repeated control points; variable curvature; `nib`; width profiles (`wTip`, `wSwell`, `wLeaf`, `wNib`); structural versus diffusive edges.

**What the learner builds**  
One compact subject twice: first from assembled primitives and constant strokes, then as a designed contour with one or two variable-width marks. The subject should have at least one sharp change of direction and one long slow curve.

**Teaching progression**  
Reproduce the failure logic of studies 0 and 1 without merely copying their subjects. Ask what the silhouette says before interior detail. Convert the primitive assembly into one coherent outline and replace at least one `lineWidth` stroke with a ribbon whose width communicates taper, load, or material.

**Deliberate experiment/failure investigation**  
Use a wobbled ellipse and show that wobble does not turn a generic ellipse into an observed contour. Deliberately soften one structural edge and compare it with a genuinely diffusive edge.

**Existing repository material used as evidence/reference**  
`docs/drawing.md` contour sections; `studies/index.html` silhouette and stroke A/Bs; the kettle, wave, and telescope exemplars; `prints/workings/index.html` figure, cable, bird, and tower construction.

**Verification or observation exercise**  
View the subject as a solid silhouette at intended viewing scale and at a much smaller thumbnail. Interior detail is temporarily disabled. The learner records which identity cues survive.

**Architectural/artistic choices that must be explained**  
- One designed contour versus assembled primitives: the designed contour gives silhouette control. Separate primitives are better when the subject is genuinely modular, when articulation must be independently animated, or when overlaps are invisible and simplify construction.
- `nib` ribbon versus `lineWidth`: ribbons control width along a path. Constant strokes are better for machine-made members, wires, or intentionally uniform graphic marks.

**What the learner should understand by the end**  
Drawing quality does not emerge automatically from procedural complexity. The boundary and mark shape must be authored deliberately.

**Prerequisites**  
Parts 01–04.

**Concepts deliberately deferred to later Parts**  
Perspective mapping, anatomy/reference workflows, motion deformation, live moving contours.

---

## Part 06 — Value First: Modelling Form Without Mud

**Learner state entering the Part**  
Can create designed silhouettes and marks, but may rely on flat fills or add foreign ink to simulate shading.

**Problem or motivation**  
A convincing subject needs a readable value hierarchy and turning form. Adding another ink over the shaded side often produces dirty colour rather than volume.

**Concepts introduced**  
Paper/mid/dark hierarchy; high-key alternatives; overprint as small dark accent; modelling by removing ink toward light; `shade(..., {cut:true})`; `plane()` for owned values; highlights as paper; `bed()` as contact support; value before palette.

**What the learner builds**  
A single object or simple organic form with one clear light source, a screened mid, a paper highlight, contact support, and one controlled overprint dark.

**Teaching progression**  
Start with a flat silhouette. Add a foreign-ink shadow and observe hue contamination. Rebuild the turning form on its own plate by subtraction, then reserve the second ink for core/contact/opening accents. Compare the value structure in grayscale before judging colour.

**Deliberate experiment/failure investigation**  
Recreate the logic behind the study-3 "olive-brown ball" failure using a different subject. Also stack multiple tones on one plate without clearing and observe unwanted cumulative darkness before switching to `plane()`.

**Existing repository material used as evidence/reference**  
`docs/drawing.md` value, tone, form, and contact sections; `studies/index.html` ramp and form A/Bs; `prints/workings/index.html` `gather`; `docs/quality-bar.md` overprint reference.

**Verification or observation exercise**  
Produce colour, value-only, and silhouette views. The learner identifies the focal dark, the light source, and whether the subject remains legible without texture.

**Architectural/artistic choices that must be explained**  
- Same-plate subtraction versus extra shadow ink: subtraction preserves hue and print logic. A second ink is better when the shadow is intentionally a colour event, reflected light, or a meaningful overprint rather than generic modelling.
- `bed()` contact shadow versus geometric cast shadow: `bed()` is a quick grounding device. A projected cast shadow is better when light direction, receiving surface, and spatial relationship are important to the scene.

**What the learner should understand by the end**  
Value and form are solved before surface finish; darkness must have a structural reason.

**Prerequisites**  
Parts 01–05.

**Concepts deliberately deferred to later Parts**  
Multi-plane depth, perspective-correct cast shadows, moving light, `relight`.

---

## Part 07 — Composition, Focus, and the Frame Budget

**Learner state entering the Part**  
Can draw and model a subject but has not yet learned how this repository controls where the eye goes or how much visual mass a frame can spend.

**Problem or motivation**  
A technically attractive subject can still become unreadable when centred at a middling scale, surrounded by equal competitors, or buried in uniformly dense ink. More detail is not the same as stronger composition.

**Concepts introduced**  
Focus and eye path; shot scale in a still; negative space; one area of high detail; occupancy versus mass; open screen as low-cost atmosphere; edge hierarchy; an earned accent hue; repeated events decaying with distance.

**What the learner builds**  
Three small compositional/value alternatives for the same subject that differ in viewpoint, crop, scale, depth, and mass—not merely palette. The learner then develops one selected frame to native resolution.

**Teaching progression**  
Measure why the middle-density/default-centre solution is weak. Use the kettle, wave, and telescope exemplars to compare viewpoint and moment. Use the composition studies to separate "lots of dots" from "heavy dark mass." Make a deliberate eye path and one focal commitment.

**Deliberate experiment/failure investigation**  
Create one version with three equal-size focal candidates and one with a single hierarchy. Also remove the accent hue: if the meaning survives unchanged, the accent was decoration rather than structure.

**Existing repository material used as evidence/reference**  
`docs/drawing.md` composition and frame-budget sections; `studies/composition.html` (`budget`, `deepen`, `window`, `lanterns`); `studies/index.html` kettle/wave/telescope; Window Seat contact sheet; `prints/workings/index.html` `lines`.

**Verification or observation exercise**  
Inspect at thumbnail scale, normal viewing scale, and 1:1. Optionally measure occupancy/mass using the repository's documented method, but treat the numbers as descriptive evidence rather than a target score.

**Architectural/artistic choices that must be explained**  
- Sparse versus dense composition: neither is a default winner. Sparse is better for isolation, anticipation, and legibility; dense is better when mass or immersion is the subject and hierarchy remains clear.
- Fixed central anchor versus moving focus: a fixed anchor works when it has conceptual meaning. A moving focus is better when the subject's action or spatial journey demands it.
- Measured frame budget versus intuition alone: measurement reveals hidden density patterns. Pure intuition is still necessary for meaning and taste and is preferable when measurement would falsely imply a quota.

**What the learner should understand by the end**  
Composition is a distribution of attention, value, and mass, not a layer added after drawing.

**Prerequisites**  
Parts 01–06.

**Concepts deliberately deferred to later Parts**  
Eye movement over time, shot-to-shot handoffs, editorial pacing.

---

## Part 08 — Print Finish and Native-Resolution Judgment

**Learner state entering the Part**  
Can make a readable composed frame, but may be tempted to use grain, hatching, registration, or extra ink to manufacture quality before inspecting the underlying image.

**Problem or motivation**  
Texture is easy to add and hard to use diagnostically. Reduced contact sheets also create moiré and hide small failures, so a learner can "fix" artifacts that do not exist or miss ones that do.

**Concepts introduced**  
Texture last; starvation, spray, hatch, dry pass, carved highlights; paper mottling/fibres; contour registration; screen-angle consistency; screen supercell issue as an advanced example; 1:1 inspection; scaled-preview moiré; block-mean checks; print evidence versus drawing evidence.

**What the learner builds**  
A finished version of the Part 07 frame with texture serving form/material, plus a deliberately over-textured comparison. The learner also produces at least two native crops: a contour/registration crop and a tone/texture crop.

**Teaching progression**  
Add one texture treatment at a time and ask what material or form question it answers. Compare dots thinning outward with hatching thickening inward. Demonstrate that a reduced sheet can invent banding, then settle the question at native resolution.

**Deliberate experiment/failure investigation**  
Over-spray the whole subject and observe silhouette loss. Fade a thin line by coverage and observe dashing; then fade by alpha/width. If useful, inspect Emergence's screen-supercell fix as evidence that real screen quantisation defects sometimes require engine-level treatment rather than aesthetic camouflage.

**Existing repository material used as evidence/reference**  
`docs/drawing.md` texture and judging sections; `docs/quality-bar.md`; `studies/index.html` texture study; `studies/composition.html`; `.claude/rules/riso-plates.md` thin-line guidance; `films/emergence/FILM.md` screen quantisation note.

**Verification or observation exercise**  
Use `still.mjs` for the native PNG, then inspect crops at 1:1. The learner labels each observed issue as drawing, print, or display-sampling related before making a change.

**Architectural/artistic choices that must be explained**  
- Texture as form evidence versus global decoration: texture that explains material or light is retained. Decorative texture can be appropriate in a deliberately pattern-led poster, but must not be presented as a cure for weak form.
- Native rerasterisation versus upscaling: rerasterisation preserves geometry and screen at the target size. Upscaling is acceptable only for presentation previews where no claim of higher native detail is made.

**What the learner should understand by the end**  
A high-quality riso finish is restraint plus correct print behaviour, and native pixels are the authority for screen/edge questions.

**Prerequisites**  
Parts 01–07.

**Concepts deliberately deferred to later Parts**  
Moving screens, live-plate threshold tables, encoded-motion inspection.

---

## Part 09 — Reference-Led Visual Development and the Hard Frame

**Learner state entering the Part**  
Has enough drawing and print craft to execute a frame, but may still invent unfamiliar subjects from generic schemas or collect references without turning them into decisions.

**Problem or motivation**  
The repository explicitly records that long films and detailed stills failed when they used generic seated figures, schematic contact, invented machine details, and texture instead of observation. The learner needs a disciplined way to answer drawing questions before production expands.

**Concepts introduced**  
Translating a request into subject/feeling/deliverable/audience/constraints; reference sources as evidence; subject facts versus composition references versus print references; viewpoint/value thumbnails; hardest-frame-first; gesture, support, weight-bearing contact, and host-surface attachment; measured likeness workflow as an optional special case.

**What the learner builds**  
A reference-led hero frame of an unfamiliar subject or interaction. The learner records specific observations that change the drawing, creates at least three viewpoint/value thumbnails, selects one, and develops it through construction, value, and final-ink views.

**Teaching progression**  
Begin with a plausible unresearched sketch. Identify where it relies on generic assumptions. Inspect references and record only actionable relationships. Redraw the frame, preserving original composition rather than tracing. Keep construction and value views available beside the final print.

**Deliberate experiment/failure investigation**  
Ask the learner to add more texture to the unresearched version before fixing its construction, then compare whether identity/contact improved. The answer should be visibly no.

**Existing repository material used as evidence/reference**  
`docs/visual-development.md`; `docs/brief.md`; `prints/workings/index.html`; `studies/scene-space.html`; `films/roost/FILM.md` as a useful caution because its subject references are explicitly marked uninspected; the CalComp research trail documented in `docs/scene-space.md`.

**Verification or observation exercise**  
Side-by-side comparison of the first and reference-led frame at the same scale. The learner names concrete changed relationships (angle, support, proportion, attachment, material, negative space), not a vague "more accurate" judgment.

**Architectural/artistic choices that must be explained**  
- Observed construction versus generic symbolic drawing: observation is preferred for recognizable unfamiliar subjects. Symbolic simplification is better for intentionally iconic/abstract work, provided simplification is deliberate rather than accidental ignorance.
- Reference grid/measurement versus free observation: measurement is appropriate for likeness-critical work. Free observation is better when exact identity is not the goal and the film needs graphic interpretation.
- Hard-frame proof before timeline expansion versus building scenes in chronological order: hard-first reduces risk. Chronological building can be better for a tiny, technically uniform film where no shot is materially harder than another.

**What the learner should understand by the end**  
References answer construction questions. They are not a mood-board ritual and they do not replace original staging.

**Prerequisites**  
Parts 01–08.

**Concepts deliberately deferred to later Parts**  
Action proof, editing, long-film rough cuts, motion-specific reference problems.

---

## Part 10 — Scene Space: Perspective, Attachment, and Occlusion

**Learner state entering the Part**  
Can develop a convincing single frame but has not yet used the repository's explicit world/camera/surface model or handled complex attached details systematically.

**Problem or motivation**  
Screen-space guesses make slats, ellipses, handles, keyboard keys, and repeated details disagree in perspective. Projection alone also does not solve visibility; naïve average-depth sorting can cover an object's own details.

**Concepts introduced**  
World coordinates; `Space.camera`; focal pixels; `Space.plane`; projection and near clipping; host-surface UV; explicit background/support/object/detail order; splitting intersecting geometry; contact/cast shadows on receiving planes; shared projected shapes for print and knockout.

**What the learner builds**  
A constructed object in a small scene—machine, table, instrument, architectural object, or equivalent—with at least one sloped surface, repeated attached details, support/contact, and a foreground/attached occlusion relationship.

**Teaching progression**  
First place detail by interpolating projected corner positions in screen space and observe spacing errors. Then build the detail on the host surface and project every point. Try automatic mean-depth sorting, reproduce an occlusion fault, and replace it with explicit draw groups or split geometry.

**Deliberate experiment/failure investigation**  
Required failures are screen-space bilerp and unsuitable average-depth painter sorting. Optional experiment: scale a rendered/screened bitmap for a fake camera move and inspect the screen distortion; save the full moving-camera correction for Part 17.

**Existing repository material used as evidence/reference**  
`docs/scene-space.md`; `tools/lib/visual-kit.mjs`; `tools/visual-kit.test.mjs`; `studies/scene-space.html`; `tools/scene-space.test.mjs`; `docs/visual-development.md` object/attachment guidance.

**Verification or observation exercise**  
Use the study's idea of `debug=structure` and a value view in the learner's own artifact or an equivalent temporary diagnostic. Inspect 1:1 attachment/contact crops. Run the geometry tests so the learner sees what is mechanically proven versus what still requires visual judgment.

**Architectural/artistic choices that must be explained**  
- Explicit lightweight projection kit versus a 3D renderer: this repository chooses a small pure geometry layer to keep the final work self-contained and graphic. A full 3D engine is better when complex visibility, arbitrary camera motion, mesh deformation, or lighting must be solved generally.
- Explicit draw order versus depth buffer: explicit order is predictable for designed 2D scenes. A depth buffer is better for many intersecting surfaces where manual splitting becomes unmanageable.
- Perspective versus coherent orthographic/graphic flattening: perspective is not automatically superior. Orthographic/flattened construction is better when the art direction intentionally rejects convergence and keeps internal relationships coherent.

**What the learner should understand by the end**  
Perspective is a construction system, not a styling filter; attached detail belongs to object space before it belongs to screen space.

**Prerequisites**  
Parts 01–09.

**Concepts deliberately deferred to later Parts**  
Distance-based travel, shared motion clocks, moving camera cost, live re-projection.

---

## Part 11 — Still Capstone: From Brief to Delivered Procedural Print

**Learner state entering the Part**  
Has learned the complete still-image stack but has only solved isolated exercises.

**Problem or motivation**  
The learner needs to prove that drawing, composition, reference use, plate craft, and inspection can work together without motion or sound masking weaknesses.

**Concepts introduced**  
Integrated `riso-still` workflow; substantial-work `PRINT.md`; format choice; native-size changes; choosing which earlier techniques not to use; revision from concrete defects.

**What the learner builds**  
An original procedural risograph still unrelated to the shipped subjects. It includes a short `PRINT.md`-style record of brief, references, viewpoint, geometry/light decisions, native size, inspected output, and remaining weaknesses, plus the self-contained source and native PNG.

**Teaching progression**  
The instructor provides constraints but not a composition. The learner proposes alternatives only if the brief asks for them, selects a direction, proves the hardest area, builds the final plate image, then reviews in value/silhouette/native crops. Revision addresses the smallest responsible mechanism.

**Deliberate experiment/failure investigation**  
No manufactured failure is required. The learner instead has to find one real defect in their own first pass and document the evidence, fix, and what remains unreviewed.

**Existing repository material used as evidence/reference**  
`.claude/skills/riso-still/SKILL.md`; `prints/workings/index.html`; all drawing/visual-development/scene-space docs and studies learned so far; `docs/quality-bar.md` review cases.

**Verification or observation exercise**  
`verify.mjs --times 0`, `still.mjs`, whole-frame viewing, value view, silhouette view, and at least two 1:1 crops. Technical validity and artistic review are reported separately.

**Architectural/artistic choices that must be explained**  
The learner must defend at least three choices from the earlier Parts and name a plausible alternative plus a situation where that alternative would be better. The point is to demonstrate deliberate selection rather than helper usage.

**What the learner should understand by the end**  
They can independently originate and deliver a procedural still in this medium and can distinguish print craft from underlying drawing quality.

**Prerequisites**  
Parts 01–10.

**Concepts deliberately deferred to later Parts**  
Timeline, motion, transitions, shot design, sound, MP4 delivery.

---

## Part 12 — Time as an Explicit Input

**Learner state entering the Part**  
Can create a strong static print and understands deterministic seeking, but has not yet designed animation as a pure function of film time.

**Problem or motivation**  
Frame counters and incremental state are intuitive animation tools, but they make cold jumps, retiming, and exact export unreliable. The learner needs a temporal model compatible with `seek(t)`.

**Concepts introduced**  
Film scaffold; `DUR`; `phase(t,t0,dur)`; local versus global time; clamping before/after an event; analytic position/state; action clocks; time-based rather than frame-counted animation; `?t=` inspection.

**What the learner builds**  
A 4–6 second film with one static scene and one changing element whose complete state is computable directly from `t`. It has a clear prepare/act/hold structure but no advanced easing yet.

**Teaching progression**  
Start with a frame-accumulated position and show cold-seek failure. Rewrite it as a function of phase. Add a second property driven by the same event clock. Seek arbitrarily and confirm that the exact visible state is reproducible.

**Deliberate experiment/failure investigation**  
A state variable updated partway through `render` should be read earlier in the frame once, reproducing the type of seek-history trap documented in `docs/motion.md`; then compute all derived per-frame state at the top of the frame.

**Existing repository material used as evidence/reference**  
`docs/motion.md`; `docs/scene-space.md` clock ownership; `tools/new-riso.mjs`; `tools/verify.mjs`; common film `seek`/`render` structure.

**Verification or observation exercise**  
Run `verify.mjs` and cold-seek to preparation, action, and hold times in nonchronological order. The learner annotates which clock owns each changing property.

**Architectural/artistic choices that must be explained**  
- Absolute film time versus accumulated delta time: absolute time supports exact random access. Delta simulation is better for systems where emergent state and interactions cannot be expressed or feasibly precomputed as a direct time function.
- One shared clock for coupled mechanics versus duplicated time constants: shared clocks prevent drift. Independent clocks are better for genuinely independent atmosphere or asynchronous background behaviour.

**What the learner should understand by the end**  
Animation state is derived from time; time is data, not an implicit side effect of playback.

**Prerequisites**  
Parts 01–11.

**Concepts deliberately deferred to later Parts**  
Material-specific easing, path-distance travel, continuity at wraps, anticipation, transitions.

---

## Part 13 — Motion Has Units: Speed, Easing, and Mass

**Learner state entering the Part**  
Can animate from explicit time but may choose curves by visual convenience rather than what the subject or material implies.

**Problem or motivation**  
Using one ease for stone, leaf, camera, iris, and thrown object produces generic "slideshow" motion. Curve parameterisation can also create unintended speed changes along paths.

**Concepts introduced**  
Easing as a physical/graphic claim; `easeInQuad`, `easeOutQuad`, `easeInOutCubic`, `settle`; distance versus parameter; `pathByLength`; `travel` with world units/second or duration; screen-speed versus world-speed; `ballistic`; `hermite` endpoint velocities; retiming at 0.5×/1×/2×.

**What the learner builds**  
A paired motion study using the same scene: two different materials or actions move through comparable space but with deliberately different arrival behaviour and aftermath. One path uses distance-based travel rather than a raw curve parameter.

**Teaching progression**  
Replicate the logic of the weight study with new subjects. Measure equal-time positions along an unevenly sampled path to expose nonconstant parameter speed. Then use the visual kit to give explicit units and choose a curve based on material. Retiming changes the action and shot duration together.

**Deliberate experiment/failure investigation**  
Apply `easeInOutCubic` to everything and compare. Also slow the action without lengthening the shot so it truncates, then fix the coupled duration/cut clock.

**Existing repository material used as evidence/reference**  
`docs/motion.md` easing section; `docs/scene-space.md` speed/owner section; `studies/index.html` weight study; `studies/scene-space.html`; `tools/lib/visual-kit.mjs`; Window Seat's analytic distance `S(t)` as an advanced later-use example.

**Verification or observation exercise**  
Shoot 8–10-cell motion strips and read spacing. Check one action at 0.5×, 1×, and 2×. The learner states whether the changed version preserves contact and completes within the retimed shot.

**Architectural/artistic choices that must be explained**  
- Analytic/path-table motion versus frame simulation: analytic motion is exactly seekable. Simulation is better for complex interaction/collision when deterministic precomputation can be saved or when random access is not needed.
- World speed versus screen speed: world speed preserves scene-space meaning. Screen speed is better for deliberately graphic UI-like movement or titles whose apparent velocity should ignore depth.
- Generic easing versus material-specific motion: generic curves are acceptable for neutral interface/camera motion; subject actions require stronger justification.

**What the learner should understand by the end**  
Motion parameters need units, an owner, and a material claim. A curve is not merely "smoothness."

**Prerequisites**  
Parts 01–12, especially Part 10 for scene-space travel.

**Concepts deliberately deferred to later Parts**  
Loop seams, anticipation/follow-through, transitions, moving screened tone.

---

## Part 14 — Determinism Is Not Continuity: Loops, Resets, and Stable Motion

**Learner state entering the Part**  
Can produce deterministic time-based motion and inspect spacing, but may assume `verify.mjs` guarantees smooth playback.

**Problem or motivation**  
A modulo reset or per-time seeded texture can be perfectly repeatable and still jump visibly. Loops often fail only when a shot is held longer or reused later.

**Concepts introduced**  
Visible wrap versus numeric wrap; periodic position and velocity; offscreen recycling; fade life with zero endpoint slope; `fract`, `smooth01`, `life`; deterministic `wander`; independent stable keys; neighbouring-frame inspection around wraps.

**What the learner builds**  
A looping or recycled stream of marks with an intentionally visible seam, then a corrected version using one of the repository's three strategies: truly periodic geometry, offscreen recycle, or zero-slope fade around the wrap.

**Teaching progression**  
Make the simplest `fract(t*hz)` carrier and confirm that `verify.mjs` passes. Inspect the seam at frame spacing. Fix the seam without hiding it through randomisation. Reuse the scene at a longer duration to prove the fix survives beyond the first convenient hold.

**Deliberate experiment/failure investigation**  
The deliberate "passes verify but still jumps" case is mandatory. A second case lets two parts share the same `wander` key so they breathe in lockstep, then separates them.

**Existing repository material used as evidence/reference**  
`docs/motion.md` determinism and loops sections; Lumen's tide filament correction in `films/lumen/FILM.md`; Emergence's `life`/`smooth01` implementation and motion contracts; `.claude/skills/riso-film/examples.md`.

**Verification or observation exercise**  
Run `verify.mjs`, then use `shoot.mjs` at delivery-frame spacing on both sides of the wrap. If useful, use a cropped pixel diff to locate the reset. The learner reports both technical pass and continuity revise/pass separately.

**Architectural/artistic choices that must be explained**  
- Periodic geometry, offscreen recycle, and fade-to-zero are alternatives, not a hierarchy. Periodic geometry is best when the phenomenon is physically cyclical; offscreen recycle is best for streams whose births can be hidden; fade is best when individual marks can naturally appear/disappear.
- Smooth deterministic variation versus simulated noise: `wander` is good for flame/smoke/cloth-like irregularity without state. A simulation is better when forces/interactions are the content.

**What the learner should understand by the end**  
Continuity must be inspected across time boundaries; determinism alone cannot certify it.

**Prerequisites**  
Parts 01–13.

**Concepts deliberately deferred to later Parts**  
Shot-to-shot transitions, encoded-motion review, full rough-film pacing.

---

## Part 15 — Anticipation, Contact, and Follow-Through

**Learner state entering the Part**  
Can move objects with appropriate speed and loop behaviour but may still animate only translation from A to B.

**Problem or motivation**  
An action feels weightless when the subject simply departs, lands, or contacts something without preparation or consequence. The repository treats anticipation as a phase/pose and follow-through as disturbed material, not as another generic ease.

**Concepts introduced**  
Prepare/act/settle phases; anticipation pose; loaded versus unloaded rest; contact moment; environmental response; subordinate material motion; shared contact/release clocks; `settle` for appropriate flexible follow-through; cause and consequence.

**What the learner builds**  
A short action involving contact or release: launch from a support, tool contacting a surface, object landing, branch releasing, door/handle action, or equivalent. It must include preparation, contact/release, and a visible consequence that outlives the main motion.

**Teaching progression**  
Build the straight translation first. Add anticipation as a distinct pose/phase, then compress the main travel so total duration remains intentional. Make the support/environment change state after the contact. Ensure the action and consequence share the same source event time.

**Deliberate experiment/failure investigation**  
Apply a back-ease to translation and compare it with an actual anticipation pose. Add follow-through to a tiny insignificant detail and observe that it does not read; move the response to a larger, causally connected element.

**Existing repository material used as evidence/reference**  
`studies/index.html` launch study; `docs/motion.md` anticipation/follow-through; `docs/visual-development.md` action-before-effects guidance; Window Seat glass `SLOSH` as an advanced consequence tied to acceleration; Roost falcon strike/agitation as a larger-scale cause/consequence example.

**Verification or observation exercise**  
Inspect a normal-speed clip and a strip around contact. The learner identifies the exact shared contact/release time and checks that a cold seek after the event produces the same settled consequence.

**Architectural/artistic choices that must be explained**  
- Anticipation pose versus back-ease: pose changes the subject's configuration and intent; back-ease only changes trajectory. Back-ease is better for stylized UI/object motion where pose has no anatomy/material meaning.
- Follow-through in environment versus automatic bounce on the subject: environmental response communicates cause. Subject bounce is better when the subject itself is elastic and the support is rigid.

**What the learner should understand by the end**  
Good motion describes what causes an action and what the action changes, not only where an object moves.

**Prerequisites**  
Parts 01–14.

**Concepts deliberately deferred to later Parts**  
Multiple-shot action continuity, eye handoffs, score sync to contact.

---

## Part 16 — Tone on Moving Elements: `bandPass` and `relight`

**Learner state entering the Part**  
Understands static screened tone and meaningful motion but has not yet confronted the fact that `inkPass` screens a live element at one flat coverage.

**Problem or motivation**  
A moving gradient drawn through a flat live pass becomes smooth-opacity ink rather than changing dot size. A bright moving subject over an already printed dark ground also multiplies into mud unless the ground is opened first.

**Concepts introduced**  
Flat live pass limitation; quantised `bandPass`; moving highlights returning to paper; `relight`; ordered light openings; nearest-plane occlusion; coverage versus opacity on thin live marks; cost of multiple full-canvas bands.

**What the learner builds**  
A moving modelled/luminous element over a darker scene—flame, glow, lantern, moving lit object, or another suitable form—with four-step tone and a live paper-returning highlight.

**Teaching progression**  
Draw the element with one flat `inkPass`; then try a normal Canvas gradient and observe smooth ink. Print it over dark ground and observe mud. Replace the tone with bands and explicitly relight the ground before printing the bright inks. Restore foreground occluders after the opening where needed.

**Deliberate experiment/failure investigation**  
Use coverage to fade a thin moving line until it turns dashed/disappears, then fade alpha/width while keeping full coverage. Also cut a soft opening on a mismatched screen and inspect beating if practical.

**Existing repository material used as evidence/reference**  
`studies/index.html` flame study; `docs/motion.md` tone-on-moving-element section; `.claude/rules/riso-plates.md`; `docs/drawing.md` tone guidance.

**Verification or observation exercise**  
Native 1:1 crops at several animation times plus a frame strip. The learner must identify whether tone variation comes from dot size, opacity, or both.

**Architectural/artistic choices that must be explained**  
- `bandPass` versus one flat `inkPass`: bands are justified for a small number of important moving modelled elements. Flat pass is better for solid silhouettes, tiny marks, or performance-sensitive background motion where spatial modelling would not read.
- `relight` versus simply adding a light ink: relight is required when the artistic intent is bright paper/light over a dark printed ground. Extra ink alone is appropriate when the result should remain an overprint colour.

**What the learner should understand by the end**  
Moving tone must preserve the same plate logic as static tone; animation does not excuse smooth digital shading.

**Prerequisites**  
Parts 01–15.

**Concepts deliberately deferred to later Parts**  
Frames where most of the picture has moving gradients/tone, full live-plate compositor.

---

## Part 17 — Live Plates: When Most of the Frame Moves

**Learner state entering the Part**  
Can handle baked static plates and a few live screened elements, and can articulate when `bandPass` becomes expensive or insufficient.

**Problem or motivation**  
Parallax landscapes, moving sky gradients, smears, reflections, camera-like travel, and other frames with extensive moving tone cannot be solved cleanly by scaling screened bitmaps or layering many separate `bandPass` calls.

**Concepts introduced**  
Per-ink live coverage canvases; page-pinned threshold tables; compose-time screening; `put`/`add`/`knock`/mask operations; value ownership; motion blur from shutter samples; reflections as plate operations; covered switches/veils; static plate caching; profiling and buffered preview.

**What the learner builds**  
A short moving scene in which most of the view changes: a travelling/parallax landscape, moving weather view, water reflection, or similar. At least one static foreground/interior element remains pinned so the difference between moving world and page-fixed frame is clear.

**Teaching progression**  
First try scaling or translating a baked screened bitmap and observe swimming/moiré. Then draw moving coverage in page space and screen at compose time. Add one reflection or smear only if the concept benefits. Measure frame cost before attempting optimisation; cache only genuinely static plate content.

**Deliberate experiment/failure investigation**  
The bitmap-scaling failure is required. An optional performance experiment wraps named draw functions to find the actual expensive stage instead of assuming screening is the bottleneck.

**Existing repository material used as evidence/reference**  
`docs/motion.md` live-plates section; `films/window-seat/index.html` `compose` and plate helpers; Window Seat `FILM.md`; `films/roost/index.html` and `FILM.md`; `.claude/skills/riso-film/examples.md` live compositor, parallax, reflections, veil, drops, glitter; generated player's slow-film buffering in `tools/new-riso.mjs`.

**Verification or observation exercise**  
Shoot a strip through motion and inspect screen stability at 1:1. Time sequential seeks. If a reflection or smear is used, compare it at multiple speeds. Confirm exact seeking still passes even if realtime drawing is slower than 30 fps.

**Architectural/artistic choices that must be explained**  
- Full live plates versus baked scenes plus a few live elements: full live plates are for frames where moving tone dominates. Baked scenes are better when most art is static because they are simpler and faster.
- Reprojecting vector geometry versus scaling a screened image: vector reproject preserves screen scale. Bitmap scaling is better only when moving/resampling the printed texture itself is intentionally the visual effect.
- Buffered preview versus forcing realtime optimisation: buffering preserves exact art while allowing pace review. Aggressive optimisation is better when the final work must itself run interactively in realtime, not merely export correctly.

**What the learner should understand by the end**  
Live plates are a targeted architecture for moving screened coverage, not the default engine for every shot.

**Prerequisites**  
Parts 01–16.

**Concepts deliberately deferred to later Parts**  
Transition design, multi-shot editorial structure, final-project performance budgeting.

---

## Part 18 — Transitions That Carry the Eye

**Learner state entering the Part**  
Can animate convincing individual actions/scenes but has not yet designed what happens between them.

**Problem or motivation**  
Clearing to paper and opening the next scene repeatedly makes a film feel like a sequence of restarts. Full-scene dissolves can hide, rather than solve, disconnected eye position and motion.

**Concepts introduced**  
Eye destination; shared centre/contour/direction/moving edge; outgoing coverage surviving until incoming reveal completes; overlapping iris/sweep; hard cut as deliberate choice; paper hold with purpose; covered content switch; one clock across multiple cues; transition versus camera versus subject versus atmosphere.

**What the learner builds**  
A two- or three-scene transition study with the same source scenes connected in at least two ways: a naïve reset/dissolve and a designed handoff. One handoff should use overlap or a covered switch; one may be a hard cut if justified.

**Teaching progression**  
Decide what the eye follows before selecting a transition. Keep the outgoing scene under an opening mask until full coverage. Repaint paper inside a window before multiply where necessary. For a carried element or closing lens, drive the motion from passage time rather than restarting local scene time.

**Deliberate experiment/failure investigation**  
Create a transition where the incoming pass clears outside its mask and observe the white flash. Create per-shot radii or motion clocks that restart at a boundary, then replace them with one shared owner.

**Existing repository material used as evidence/reference**  
`docs/motion.md` transitions section; Lumen `FLOW`, `drawWindow`, `memoryRadius`; Emergence's corresponding machinery; Window Seat's tunnel, overtaking train, fog veil, and rain-haze covered switches; `.claude/rules/riso-plates.md` window repaint trap.

**Verification or observation exercise**  
Use a coarse sheet to locate each handoff, then shoot at 1/30 s on both sides. Watch at normal speed as well; a sheet cannot establish pacing. The learner states the intended eye carrier for each transition.

**Architectural/artistic choices that must be explained**  
- Overlap/reveal versus hard cut: overlap is better when motion/space should feel continuous; a hard cut is better for a decisive change, compression, contrast, or when continuity comes from eye position rather than literal image overlap.
- Covered switch versus visible transformation: covered switching is excellent when content can change invisibly under fog/tunnel/train. Visible transformation is better when the change itself is the subject and should be witnessed.
- One passage clock versus per-shot local clocks: one clock preserves continuous carried motion; local clocks are better when a genuinely new action begins at the cut.

**What the learner should understand by the end**  
A transition is an eye-and-time design decision, not a stock effect.

**Prerequisites**  
Parts 01–17.

**Concepts deliberately deferred to later Parts**  
Full shot sequence design and whole-film pacing.

---

## Part 19 — Shot Design and Editing: Build an Event, Not a Slideshow

**Learner state entering the Part**  
Can build and connect shots but has not yet designed a sequence whose shot lengths, scales, and actions form an editorial argument.

**Problem or motivation**  
Long procedural films can degrade into equal-length illustrated nouns: every shot reveals, idles, and resets. The repository instead asks what changes, what consequence follows, and where the eye goes next. It also demonstrates that montage is not the only viable structure.

**Concepts introduced**  
Shot size; action and consequence; readable arrival/hold; `__riso.shots` metadata; `readAt`; cut timing from information/action; silent rough edit; establishing/action/detail reuse of one set; fixed-frame journey; continuous take; cue-driven montage; optional Resonance form as one form among several.

**What the learner builds**  
A 10–15 second three- or four-shot mini-film around one event, using one set or subject rather than unrelated nouns. It must include at least two shot sizes and a justified transition/cut. `SHOTS` is the authoritative timing list.

**Teaching progression**  
Create an equal-slot noun version on paper first. Redesign it as cause/consequence using the same subject and fewer settings. Add `action`, `transition`, and representative `readAt` metadata. Run `review.mjs` and compare its sheet with normal-speed playback.

**Deliberate experiment/failure investigation**  
A shot that contains only an introduction/reveal but no action is identified and revised. Another version repeats the same transition three times, then the learner decides whether repetition is intentional or symptomatic.

**Existing repository material used as evidence/reference**  
`docs/visual-development.md` build-actions-then-edit section; `docs/brief.md`; `tools/review.mjs`; `studies/scene-space.html` three shots preserving one action clock; Window Seat as fixed-frame journey; Roost as continuous take; Lumen/Emergence as cue-driven montage; `docs/forms/resonance.md` as explicitly optional.

**Verification or observation exercise**  
Run `review.mjs`, inspect its timing JSON/sheet, then watch the full mini-film at speed. The learner must state what new information/action each shot earns and why each cut occurs where it does.

**Architectural/artistic choices that must be explained**  
- Montage versus one fixed frame versus one continuous take: montage is best for comparison/compression; fixed frame is best when change in the world is the event; one take is best when continuity of a single evolving action is central.
- Equal shot lengths versus information-driven timing: equal timing is appropriate only when a deliberate grid/repetition is part of the form.
- `SHOTS` as one authoritative timing source versus duplicate constants: one source supports tools and sound. Separate timing systems are acceptable only when they represent genuinely different temporal layers and their relationship is explicit.

**What the learner should understand by the end**  
Editing is the organisation of attention, action, and consequence across time—not a list of scene assets.

**Prerequisites**  
Parts 01–18.

**Concepts deliberately deferred to later Parts**  
Original long-form concept development, final rough cut, production scoring.

---

## Part 20 — Final Project I: Original Concept, Visual Development, and Risk Proofs

**Learner state entering the Part**  
Has completed the still and motion curriculum and a short edited exercise. They are now capable of making independent visual and architectural decisions but have not yet built the final film.

**Problem or motivation**  
The final project must prove design judgment, not the ability to reproduce Window Seat, Roost, Lumen, Emergence, or the studies. The largest risk is committing to a timeline before proving the film's distinctive picture and difficult action.

**Concepts introduced**  
Original premise; subject-specific progression and ending; format/duration decision; early `FILM.md`; reference plan; shot/action plan; eye path; palette/ink budget; signature technical risk; hard frame; hard action proof; final-project evidence log.

**What the learner builds**  
The first final-project package: an original `FILM.md` draft, reference notes, several composition/value thumbnails, one native-resolution hard frame, and a short sample of the hardest action. The learner may choose montage, fixed-frame journey, continuous take, or another form supported by the learned constraints.

**Teaching progression**  
Ask whether the progression and ending would survive swapping in an unrelated subject; if yes, make them more subject-specific. Compare materially different visual approaches. Prove the hard frame through construction/value/final ink. Then prove the hardest action including contact, mass, timing, and aftermath. Do not fill the rest of the timeline yet.

**Deliberate experiment/failure investigation**  
No artificial failure. The course requires the learner to identify the actual highest-risk visual/action assumption and test it. If the chosen concept does not contain a difficult action, the learner proves the most difficult transition, moving-tone, perspective, or crowd/spatial problem instead.

**Existing repository material used as evidence/reference**  
`docs/brief.md`; `docs/visual-development.md`; `.claude/skills/riso-film/SKILL.md`; all four `FILM.md` files as contrasting forms; `.claude/skills/riso-film/examples.md`; `docs/forms/resonance.md` only if deliberately considered as one optional form.

**Verification or observation exercise**  
Review the hero frame using the appropriate still evidence and the action proof using a normal-speed clip plus strips. The learner records real weaknesses. Passing `verify.mjs` is necessary but explicitly insufficient to proceed if the hard proof remains visually unclear.

**Architectural/artistic choices that must be explained**  
The learner must defend: chosen film form, chosen visual viewpoint, chosen plate architecture (mostly baked / some live elements / live plates where needed), and one rejected alternative for each with a case where that alternative would have been better.

**What the learner should understand by the end**  
They own a film concept whose hardest assumptions have evidence behind them, not merely a storyboard and enthusiasm.

**Prerequisites**  
Parts 01–19.

**Concepts deliberately deferred to later Parts**  
Full-duration rough construction, polished production, score implementation, final mix.

---

## Part 21 — Final Project II: Full-Duration Silent Rough

**Learner state entering the Part**  
Has an original concept, hero frame, and hard-action proof, but no full film.

**Problem or motivation**  
A contact sheet cannot reveal whether a 40-second sequence feels slow, whether anticipation is long enough, or whether the film reaches its ending with the right density. Polishing before testing duration wastes effort.

**Concepts introduced**  
Full-duration silent animatic/rough; temporary simplified art; one authoritative shot/cue timeline; holds based on information; whole-film density; reused sets; carried clocks; transition placeholders that still respect eye logic; scope reduction by scene count rather than amputating ending/progression.

**What the learner builds**  
A playable silent rough at the intended final duration. Every major passage exists. Shots have real timings, action intent, transitions, and `readAt` values, but many assets may remain simplified. The ending must already be present.

**Teaching progression**  
Lay in the complete progression with the minimum art needed to judge timing. Watch it at speed. Shorten/lengthen from what the eye needs, not from equal slots. Preserve the hard-action proof's real timing. Reuse environments where it deepens the event rather than inventing extra settings to fill time.

**Deliberate experiment/failure investigation**  
If the first rough is derived from equal slots, preserve a copy for comparison. Identify at least one place where a hold feels different in playback than it looked on a contact sheet.

**Existing repository material used as evidence/reference**  
`docs/visual-development.md`; `docs/brief.md`; `tools/review.mjs`; Window Seat and Roost passage structures; Lumen/Emergence timing only as examples of their own forms, not timing templates.

**Verification or observation exercise**  
`review.mjs` for structure, a coarse whole-film sheet for density, and uninterrupted silent playback for pacing. The learner marks revision points with observed reasons (unreadable arrival, dead hold, rushed consequence, repetitive transition), not numerical beauty scores.

**Architectural/artistic choices that must be explained**  
- Rough with simplified art versus polishing shot 1 onward: rough-first protects editorial decisions. Shot-by-shot polish is better only for a very short single-event film whose timing is already proven by the hard-action sample.
- Cutting scene count versus shortening the core progression: scene-count reduction preserves the film's argument. A shorter duration is better when the concept itself does not support the original length and the scope change is made explicitly.

**What the learner should understand by the end**  
The film's timing and progression are testable before final art exists.

**Prerequisites**  
Part 20 and all earlier Parts.

**Concepts deliberately deferred to later Parts**  
Full finish, exhaustive handoff debugging, sound.

---

## Part 22 — Final Project III: Picture Production and Reuse Without Cargo Culting

**Learner state entering the Part**  
Has a timing-approved silent rough and proven hard frame/action. The remaining problem is turning the whole film into finished procedural art without losing coherence or importing another film's identity.

**Problem or motivation**  
Production invites two opposite mistakes: inventing new mechanisms for solved problems, or copying a donor scene so literally that the final film inherits its palette, timing, or story structure.

**Concepts introduced**  
Copy routines, not scenes; timing contracts travel with borrowed mechanisms; shared geometry; stable keys; reusable scene registry where appropriate; baked/static versus live partition; performance measurement; coherent palette/value/edge system across shots; revision preserving approved direction.

**What the learner builds**  
The complete picture pass of the final film. Major shots are final enough for native inspection; all essential actions and transitions are implemented; no sound is required yet.

**Teaching progression**  
Prioritise the highest-risk or visually defining shots, then propagate proven construction/material rules. When borrowing a mechanism, identify its dependencies (`S(t)`, `FLOW`, cue data, plate masks) and build an equivalent owner in the new film rather than hard-coding donor timings. Measure expensive shots before optimising.

**Deliberate experiment/failure investigation**  
The learner must identify one tempting donor routine or pattern and write why its *scene* is not being copied. If no donor is needed, they instead explain why a simpler local implementation is preferable.

**Existing repository material used as evidence/reference**  
`.claude/skills/riso-film/examples.md`; Window Seat, Roost, Lumen, and Emergence source implementations; `prints/workings`; `studies`; `tools/new-riso.mjs` donor-selection philosophy.

**Verification or observation exercise**  
Per-shot native stills and real-speed playback; targeted strips at known complex actions. `verify.mjs` after mechanism integration. Profile any live-plate shot that feels slow rather than optimising speculatively.

**Architectural/artistic choices that must be explained**  
- Borrowed reusable mechanism versus new local mechanism: borrow when the same problem and timing/plate contract recur; write local code when the abstraction would be larger or less truthful than the problem.
- Scene registry/baked assets versus direct per-frame draw: bake when geometry is static and reuse is exact; direct/live draw when geometry or coverage genuinely changes.
- Shared palette/system versus forced uniformity: coherence matters, but a new ink or rendering treatment is justified when the story/material earns it.

**What the learner should understand by the end**  
Reuse means carrying a solved mechanism and its contract, not importing another film's creative identity.

**Prerequisites**  
Parts 01–21.

**Concepts deliberately deferred to later Parts**  
Formal picture lock/revision pass and sound.

---

## Part 23 — Final Project IV: Evidence-Driven Picture Debugging and Picture Lock

**Learner state entering the Part**  
Has a complete picture pass that may be technically valid but still contains visual, construction, motion, pacing, or encoding defects.

**Problem or motivation**  
Technical green checks can coexist with muddy knockouts, weak silhouettes, unreadable contact, loop snaps, white flashes, flicker, or poor pacing. The learner must debug visual failures with the right evidence instead of treating `verify.mjs` as an artistic validator.

**Concepts introduced**  
Review categories from `quality-bar`: subject/staging, construction, print, action, edit, delivery; coarse-to-fine inspection; frame-spaced strips; native crops; pixel diffs; flicker measurement; encoded-section review; cold-seek versus continuity; performance profiling; defect/fix/evidence log; pass/revise/unreviewed language.

**What the learner builds**  
A picture-locked revision of the final film plus a concise review log listing observed defects, the artifact used to diagnose each, the fix, and anything still unreviewed.

**Teaching progression**  
Start with whole-film playback and coarse sheet. Move to native hero frames, construction/contact crops, then frame-spaced strips around every transition/wrap/contact. Use pixel analysis only to answer specific questions. Render difficult sections and inspect encoded motion. Fix the earliest responsible layer: construction before texture, action before effects, timing before score.

**Deliberate experiment/failure investigation**  
No invented failure. At least one issue must be chosen because the learner actually observed it. If the film seems clean, a peer/instructor review should try to find a counterexample to the learner's claim rather than reward lack of scrutiny.

**Existing repository material used as evidence/reference**  
`docs/quality-bar.md`; `docs/drawing.md` judging; `docs/motion.md` judging; `tools/verify.mjs`; `tools/review.mjs`; `tools/shoot.mjs`; `tools/render.mjs`; Lumen loop fix; Roost glitter flicker correction; Window Seat strip/crop verification notes; all `FILM.md` remaining-weakness sections.

**Verification or observation exercise**  
Run the exact tool sequence appropriate to the film and record what each result proves. The film does not reach picture lock merely because all commands exit zero; it reaches picture lock when known perceptual defects have been reviewed and remaining risks are explicit.

**Architectural/artistic choices that must be explained**  
- Quantitative pixel evidence versus visual playback: use measurement to answer bounded questions (flicker amount, reset location, tone), but playback is better for pacing, appeal, and continuity meaning.
- Fixing local symptom versus responsible mechanism: mechanism-level fixes are preferred when the same defect can recur. A local patch is better when the issue is truly isolated and generalisation would create unnecessary abstraction.

**What the learner should understand by the end**  
Technical verification, visual debugging, and artistic judgment are separate activities with different evidence.

**Prerequisites**  
Parts 01–22.

**Concepts deliberately deferred to later Parts**  
Sound design and final mux review.

---

## Part 24 — Sound I: Deterministic Audio Contract and Spotting the Picture

**Learner state entering the Part**  
Has a picture-locked or near-locked film and understands deterministic visual data, but has not used the repository's audio system.

**Problem or motivation**  
Writing music first encourages copied timings and decorative scoring. Before choosing timbre or harmony, the learner needs a score that is exactly reproducible, exactly the film's length, and driven by the picture's event data.

**Concepts introduced**  
`renderAudio()`; 48 kHz stereo exact duration; `Score`; cached offline build; seeded audio; buses and `air`; `window.__riso.marks`; spotting; boundaries versus true sync events; three-to-five sync points; picture event data as timing source; `audio.mjs --twice`.

**What the learner builds**  
A deterministic score skeleton for the final film: room tone/air across the necessary span, no elaborate music yet, and a published set of meaningful marks derived from picture data.

**Teaching progression**  
Read the final `FILM.md` and list every passage boundary and visible event. Decide which ones sound should notice and which should ride through. Copy the sound kit as a mechanism, create `Score({duration,key})`, render exactly once/cached, expose `renderAudio()`, and prove two renders match before adding foreground detail.

**Deliberate experiment/failure investigation**  
Make the score slightly longer or shorter than picture and inspect the consequence described by `render.mjs`/`-shortest`. Optionally duplicate event times manually and retime picture to demonstrate why copied numbers drift.

**Existing repository material used as evidence/reference**  
`.claude/skills/riso-score/SKILL.md`; `docs/sound.md`; `studies/sound.html`; `tools/audio.mjs`; `tools/render.mjs`; `.claude/skills/riso-score/examples.md`.

**Verification or observation exercise**  
`audio.mjs --twice --marks ...` and, before any aesthetic claim, confirm duration, rate, repeatability, and absence of contract `FAIL`s. Read the generated audio sheet enough to understand its lanes without yet optimizing the mix.

**Architectural/artistic choices that must be explained**  
- Offline deterministic render versus scheduling live during playback: offline rendering makes export and playback share one exact score. Live scheduling is better for interactive/generative music whose response to user input is the point.
- Picture-derived event times versus duplicated score constants: shared data prevents retiming drift. Separate timing is better only for a deliberately independent musical clock whose relationship to edits is part of the design.
- Sparse marks versus sound on every motion: sparse marks keep hierarchy. Literal sound-on-every-motion is valid for a deliberately mickey-moused or hyperreal aesthetic but must be chosen as a whole approach.

**What the learner should understand by the end**  
The score is another deterministic output of the film's data, not a loosely synced attachment.

**Prerequisites**  
Parts 01–23.

**Concepts deliberately deferred to later Parts**  
Material timbre, sync placement, musical structure, climax, mixing/mastering.

---

## Part 25 — Sound II: Material, Sync, and Screen Space

**Learner state entering the Part**  
Has a deterministic audio skeleton and spotted event list but has not yet designed foreground sound.

**Problem or motivation**  
A sine ping can be perfectly synchronized and still fail to sound like contact. A swell can start on the visual mark and peak late. Centred dry sound can detach from a moving picture.

**Concepts introduced**  
Exciter/resonator/body model; `contact` materials; paper/weather/drop/breath families; onset versus energy peak; start swells early; early-reflection delay; screen-x pan; centred bass; distance/brightness; diffuse events measured from picture rather than forced into impact-sync logic.

**What the learner builds**  
Foreground sound for the final film's true sync events and at least one material/environmental layer. Each cue must be justified by what is visibly happening, not by a preset the learner wants to use.

**Teaching progression**  
Use sound studies 1–3 to compare generic versus material timbre. Use study 5 to place peak rather than start on a visible event. Pan appropriate foreground by picture x. If an event is diffuse, derive a cue from picture state or explicitly classify it as perceptual rather than impact-sync.

**Deliberate experiment/failure investigation**  
Start a slow swell exactly on a visual mark and measure how late its peak arrives. Replace one generic burst with a material-specific contact. For a bowed/swollen cue, observe that onset detection may not meaningfully validate it.

**Existing repository material used as evidence/reference**  
`docs/sound.md` material and sync sections; `studies/sound.html` contact/material/timbre/accent/weather/paper/space studies; Window Seat `scoreWorld` and through-glass rain; Roost `FLIGHT_SCORE` picture-derived diffuse cues; score examples map.

**Verification or observation exercise**  
Use `audio.mjs --around` at true impact marks and inspect onset/energy peak. For diffuse cues, listen/watch with picture and report measured offsets without falsely claiming a 40 ms "pass."

**Architectural/artistic choices that must be explained**  
- Procedural material synthesis versus recorded samples: procedural sound is flexible and self-contained. Samples are better when acoustic realism or a specific instrument exceeds what synthesis can convincingly deliver, provided licensing/embedding are handled.
- Impact-sync threshold versus perceptual alignment: precise threshold is useful for clicks/contacts. Broad bowed or atmospheric gestures are better judged with picture and energy shape.
- Panning with screen position versus centred mix: panning reinforces visible locality; centred sound is better for bed/sub or intentionally non-diegetic material.

**What the learner should understand by the end**  
Sound should inherit timing, material, scale, and space from the picture rather than merely decorate its cuts.

**Prerequisites**  
Part 24 and picture lock from Part 23.

**Concepts deliberately deferred to later Parts**  
Whole-score form, handoffs, density, climax, mastering.

---

## Part 26 — Sound III: Scoring to Picture, Handoffs, Density, and Climax

**Learner state entering the Part**  
Has event-aligned material sound but not a coherent full-length musical/sonic arc.

**Problem or motivation**  
A new tune at every scene sounds stitched, fades to silence at cuts feel like restarts, wall-to-wall notes become wallpaper, and simply making the climax louder/brighter can force the entire master down.

**Concepts introduced**  
Spot-first structure; one motif and limited secondary material; tempo/phrasing from subject/picture; establish/develop/turn/release; button/tail/hard out; pre-lap, post-lap, pedal, pivot, texture handoff; density; room tone versus deliberate silence; prepared climax; visual event data driving musical structure where appropriate.

**What the learner builds**  
The full score arrangement for the final film, including purposeful treatment of every major boundary, one clearly designed turn/climax or equivalent structural high point, and an ending that declares itself.

**Teaching progression**  
Begin with bed and transitions before foreground density. Make one deliberately bad fade-to-silence handoff and compare with a carried transition. Develop motif/register/harmony rather than writing unrelated scene tunes. Build the climax by preparation, low body, staggered accents, or another subject-appropriate strategy rather than gain alone.

**Deliberate experiment/failure investigation**  
Required: fade both sides of one cut to near silence and inspect the loudness valley; then bridge it. Required: create a "same voices + louder/brighter" climax and compare its measured lift/headroom with a prepared version.

**Existing repository material used as evidence/reference**  
`docs/sound.md` structure, transitions, density, climax sections; `studies/sound.html` handoff, climax, density; Window Seat written piano phrasing across cuts; Roost tempo/cues derived from flock data; Lumen continuous reed/air through memory; Emergence's two score candidates and continuity through 15–18 s.

**Verification or observation exercise**  
Inspect the audio sheet's valleys and short-term loudness around handoffs and climax. Listen to the film's major transitions with picture. The learner must label real deliberate silence separately from accidental digital dropout.

**Architectural/artistic choices that must be explained**  
- Fixed musical grid versus picture-derived or flexible phrasing: fixed grid is good for formal rhythmic structure; picture-derived timing is better when movement density/speed is the musical driver; loose phrasing is better when forcing sync would sound stitched.
- Continuous bed versus silence: continuity helps a film feel like one place; silence is better when absence itself is a dramatic event and its return is designed.
- Procedural score versus recorded performance: either is valid in this repository. Recorded performance is better when human articulation is central; procedural synthesis is better when exact event coupling and self-contained generation dominate.

**What the learner should understand by the end**  
A score has its own form but remains structurally accountable to the picture.

**Prerequisites**  
Parts 24–25.

**Concepts deliberately deferred to later Parts**  
Final balancing, loudness/true peak, encoded AAC review, delivery metadata.

---

## Part 27 — Sound IV: Mix, Master, and Perceptual Review

**Learner state entering the Part**  
Has a complete score arrangement but has not yet balanced, mastered, or validated the muxed film.

**Problem or motivation**  
Passing event sync does not ensure a usable mix. Kit presets have incomparable levels, reverb can mask attacks, sparse scores can hit peak ceilings below the nominal loudness target, and AAC can raise true peak.

**Concepts introduced**  
`bed`/`fore`/`fx` buses; post-fader room sends; dark room design; register separation; ducking; one static loudness gain; −16 LUFS nominal target and −1 dBTP ceiling as repository defaults; ceiling winning over target; spectrogram band balance; discontinuities; encoded audio review; listening as a separate gate.

**What the learner builds**  
The final mix of the original film plus a measured audio report and a full muxed review render.

**Teaching progression**  
Balance raw voices relatively before mastering. If a voice seems absent, isolate and compare rather than blindly raising master gain. Pan/room only where they serve picture. Render, inspect integrated/short-term loudness and true peak, then listen through quiet passages, handoffs, climax, and ending with the picture. Correct the mix, not the target number, when a peak problem is structural.

**Deliberate experiment/failure investigation**  
Temporarily over-level a dense pad or room return so it buries foreground, then isolate RMS/listening to diagnose it. If the ceiling pulls the mix below target, fix the peak source rather than forcing target gain.

**Existing repository material used as evidence/reference**  
`docs/sound.md` mix/master and judging sections; `.claude/skills/riso-score/SKILL.md`; `tools/audio.mjs`; `tools/render.mjs`; Window Seat's pad and room-normalisation corrections; Roost's measured dark string balance; Emergence's candidate comparison.

**Verification or observation exercise**  
Run Firefox `audio.mjs --twice --ffmpeg`, read waveform/spectrogram/loudness sheet, then render the full mux and read muxed loudness/peak. Listen on at least one ordinary playback system; ideally compare headphones and small speakers. If listening is impossible, perceptual quality remains explicitly unreviewed.

**Architectural/artistic choices that must be explained**  
- Static post-render gain versus compressor/limiter as automatic level fixer: static gain preserves authored balance and cross-engine consistency. Dynamics processing is better when compression itself is an intentional sonic treatment and deterministic implementation has been validated.
- Shared room versus per-voice reverbs: shared room unifies space and simplifies buildup. Separate spaces are better when the film intentionally contrasts locations or diegetic environments.
- Recorded samples versus procedural voices: if the learner chooses samples, they must explain why realism/articulation justified the extra licensing, embedding, and bank work.

**What the learner should understand by the end**  
Meters support listening; they cannot certify timbre, musicality, or perceived sync by themselves.

**Prerequisites**  
Parts 24–26 and the final picture.

**Concepts deliberately deferred to later Parts**  
Only integrated final revision and delivery.

---

## Part 28 — Final Project V: Integrated Revision, Verification, and Delivery

**Learner state entering the Part**  
Has a complete original picture and final mix, each individually reviewed, but has not yet proved the integrated deliverable.

**Problem or motivation**  
A finished-looking page and a good WAV can still yield a flawed MP4: encoded motion may differ perceptually, audio true peak can change, wrong frame count/duration can slip through, or a local fix can reintroduce an earlier determinism/transition defect.

**Concepts introduced**  
Integrated picture-and-sound review; final defect triage; regression checks; full exact export; decode/frame-count/dimensions/duration/audio validation; cross-engine seek verification; frozen procedural keys; evidence/remaining-weakness reporting; technical verification versus artistic acceptance; reproducible delivery.

**What the learner builds**  
The final self-contained `films/<original-name>/index.html`, completed `FILM.md`, verified MP4, and final evidence package. The final work must be original and must not reproduce the story structure, visual identity, or scene content of any shipped film.

**Teaching progression**  
Watch and listen to the muxed export from start to finish. Record concrete defects. Fix each in the smallest responsible mechanism while preserving approved pacing/score where the defect is local. Rerun targeted checks, then the full contract. Decode the final MP4 and confirm duration, dimensions, frame count, audio stream, and muxed loudness/peak. Update `FILM.md` with what was actually inspected/heard and what remains weak or unreviewed.

**Deliberate experiment/failure investigation**  
No artificial failure. The final review is adversarial: assume a green tool report can coexist with a bad artistic result and assume a pleasing preview can conceal a technical delivery defect. The learner must produce evidence for both sides.

**Existing repository material used as evidence/reference**  
`CLAUDE.md`; `tools/README.md`; `tools/verify.mjs`; `tools/review.mjs`; `tools/shoot.mjs`; `tools/render.mjs`; `tools/audio.mjs`; all four finished `FILM.md` verification/weakness sections; `.claude/skills/riso-film/SKILL.md`; `.claude/skills/riso-score/SKILL.md`; `docs/quality-bar.md`.

**Verification or observation exercise**  
Full cross-engine seek verification; targeted native strips/crops for previously risky areas; full Firefox render; decode validation; final audio measurement; uninterrupted picture-and-sound review. The learner reports technical pass/revise and artistic reviewed/unreviewed separately.

**Architectural/artistic choices that must be explained**  
The final `FILM.md` includes a short design defense covering at least five consequential choices across composition, plate architecture, motion, editing, and sound. Each names the problem, why the chosen repository-compatible approach worked, a plausible alternative, why it was not chosen here, and a situation where the alternative would be better.

**What the learner should understand by the end**  
They can independently originate, implement, inspect, score, revise, verify, and deliver a high-quality procedural risograph film while knowing which conclusions are technical facts and which remain artistic judgment.

**Prerequisites**  
Parts 01–27.

**Concepts deliberately deferred to later Parts**  
None. Further work is specialization rather than a prerequisite for independent film-making in this repository.

---

# Dependency map

## Linear spine and intentional branches

The course is mostly cumulative, but not every later capability must be used in every final film. The dependency structure is:

```text
01 exact frame / __riso / tools
  ↓
02 plate model
  ↓
03 knockouts + order
  ↓
04 deterministic procedural identity
  ↓
05 contour + marks
  ↓
06 value + form
  ↓
07 composition + focus
  ↓
08 print finish + native inspection
  ↓
09 reference-led visual development
  ↓
10 scene space + attachment
  ↓
11 STILL MILESTONE: independent procedural print
  ↓
12 explicit time
  ↓
13 speed/easing/mass
  ↓
14 continuity + loops
  ↓
15 anticipation/contact/follow-through
  ↓
16 moving tone + relight
  ↓
17 live plates (advanced moving-screen branch; learned even if final film does not need them)
  ↓
18 eye-carrying transitions
  ↓
19 shot design + editing
  ↓
20 FINAL FILM START: concept + hard frame + hard action
  ↓
21 full-duration silent rough
  ↓
22 picture production
  ↓
23 PICTURE-LOCK MILESTONE: evidence-driven debug
  ↓
24 deterministic sound + spotting
  ↓
25 material + sync + space
  ↓
26 score structure + handoffs + climax
  ↓
27 MIX MILESTONE: mastered, listened mux candidate
  ↓
28 FINAL MILESTONE: integrated verified delivery
```

## Major learning milestones

| Milestone | Parts | Evidence of competence |
|---|---|---|
| Inspectable procedural artifact | 01–04 | Exact seeking, native export, correct plate model, stable procedural identity |
| Readable riso image | 05–08 | Designed silhouette, value hierarchy, focus, print finish judged at native resolution |
| Reference-led constructed still | 09–11 | Original print with researched construction, perspective/attachment where needed, revision log |
| Deterministic meaningful motion | 12–17 | Pure time, material motion, seamless continuity, cause/consequence, correct moving screen strategy |
| Film grammar | 18–19 | Eye-carrying handoffs, purposeful shot sizes/lengths, event-based mini-film |
| Original picture direction | 20–23 | Original concept, hard proofs, full silent rough, finished/debugged picture |
| Picture-driven score | 24–27 | Deterministic exact audio, justified materials/sync, continuous musical form, measured and heard mix |
| Independent delivery | 28 | Verified self-contained HTML + MP4, evidence-backed review, explicit remaining weaknesses |

## Non-required use dependencies

Some capabilities are curriculum requirements but not mandatory final-film ingredients:

- Part 10 scene-space knowledge is required, but an intentionally flat abstract final film may choose not to use perspective.
- Part 16 moving-tone knowledge is required, but a film of solid moving silhouettes may not need `bandPass` or `relight`.
- Part 17 live plates are required to understand the repository's full motion infrastructure, but a final film dominated by baked scenes should deliberately avoid them.
- Parts 24–27 teach a complete score workflow, but the final score may be sparse, mostly environmental, mostly musical, procedural, or sample-based if the choice is justified.

This prevents the final project from becoming a checklist of every helper in the repository.

---

# Repository coverage audit

The goal of this audit is not to force every file into the course. It shows where important repository knowledge is taught and which material is intentionally peripheral.

## Top-level contracts and rules

| Repository material | Core Parts | Why it matters |
|---|---|---|
| `README.md` | 01, 20 | Repository purpose, shipped works, one-file philosophy, development history |
| `CLAUDE.md` | 01–04, 17, 28 | Setup/commands, invariants, fixed backing store, keys, primary engine, no-black rule, exact contract |
| `.claude/rules/riso-plates.md` | 02–03, 08, 16–18 | Plate coverage, knockouts, order, canvas traps, live tone, screen/alpha distinction |
| `.claude/hooks/check-film-invariants.py` | 04, 28 | Cheap guard for `Math.random()` and missing `window.__riso`; also demonstrates that hook warnings are not full verification |

## Skills

| Skill | Core Parts | Teaching role |
|---|---|---|
| `.claude/skills/riso-still/SKILL.md` | 09–11 | Integrated still workflow after craft fundamentals are learned rather than as an initial checklist |
| `.claude/skills/riso-film/SKILL.md` | 18–23, 28 | Direction, hard-frame/action proof, clean engine, review, export; taught only after the learner knows why each gate exists |
| `.claude/skills/riso-film/examples.md` | 14–23 | Technique-to-source map; used for mechanism reuse, explicitly not as a scene-copy catalogue |
| `.claude/skills/riso-score/SKILL.md` | 24–28 | Deterministic score stages and gates |
| `.claude/skills/riso-score/examples.md` | 24–27 | Compares procedural, sampled piano, recorded strings, picture-derived cues, and multiple score candidates |

## Craft documentation

| Document | Core Parts | Teaching role |
|---|---|---|
| `docs/brief.md` | 02, 18–23, 28 | Design/delivery contract, subject-specific progression, `FILM.md`, print system, build/inspect workflow |
| `docs/visual-development.md` | 07, 09–11, 15, 19–23 | Translating briefs, reference evidence, hard frame, action proof, long-film rough, stopping criteria |
| `docs/drawing.md` | 05–08, 11 | Craft kit, value, contour, tone, depth, texture, composition, frame budget, lettering, native inspection |
| `docs/scene-space.md` | 10, 13, 15, 17, 20–23 | Camera/surfaces, attachment, occlusion, speed units, clocks, retiming, drawing-machine evidence |
| `docs/motion.md` | 12–18, 23 | Determinism vs continuity, mass, transitions, loops, anticipation, live tone, live plates, motion inspection |
| `docs/sound.md` | 24–27 | Sound kit, determinism, visible-event sync, material, form, handoffs, density, mix, measurement |
| `docs/quality-bar.md` | 02, 08, 11, 20, 23, 28 | Print reference, failure modes, review cases, evidence categories, pass/revise/unreviewed discipline |
| `docs/forms/resonance.md` | 19–20 | Taught as an optional form and historical source of Lumen/Emergence, specifically to prevent treating it as the repository's default story |

## Studies

| Study material | Core Parts | Specific evidence used |
|---|---|---|
| `studies/index.html` silhouette | 05 | Primitive assembly versus designed cut contour |
| `studies/index.html` stroke | 05 | Constant line width versus tapered ribbon |
| `studies/index.html` ramp | 02, 06 | Flat screen versus coverage gradient; knockout logic |
| `studies/index.html` form | 06 | Flat silhouette versus modelled/subtracted form, bedding, restrained overprint |
| `studies/index.html` texture | 08 | Texture after form; ramp/hatch/spray/dry pass |
| `studies/index.html` depth | 07 | Multiple planes, haze, occluder versus flat ground |
| `studies/index.html` kettle/wave/telescope | 07 | Moment, viewpoint, scale, negative space, focus; examples of originality through framing/action rather than palette swap |
| `studies/index.html` weight | 13 | Material-specific motion and arrival |
| `studies/index.html` launch | 15 | Anticipation plus environmental follow-through |
| `studies/index.html` flame | 16 | Flat live coverage versus banded tone and relit ground |
| `studies/composition.html` | 07–08 | Occupancy/mass, deepening textures, hard/diffusive edge hierarchy, one event decaying across distance |
| `studies/scene-space.html` | 10, 13, 15, 19 | Projection, host surfaces, explicit occlusion, distance travel, preserved action time across cuts, retiming |
| `studies/sound.html` | 24–27 | Contact, material, timbre, handoff, accent placement, climax, weather, paper, density/silence, space |

The studies are used most heavily where they contain genuine A/B evidence. The course should preserve the comparison logic but use new learner subjects wherever practical so the learner understands the mechanism rather than memorising a picture.

## Finished prints

| Material | Core Parts | Teaching use |
|---|---|---|
| `prints/workings/index.html` `gather` | 03, 06, 08–11 | Plate order, overprint dark, light by subtraction, earned hue, contact, deliberate detail concentration; demonstrates comments as production reasoning rather than a style recipe |
| `prints/workings/index.html` `lines` | 05, 07, 10–11 | Machine/hand-made mark distinction, perspective recession, cable sag, support, repeated event decay, near/far value control |

`prints/workings` also donates the baked print/craft engine to `new-riso.mjs`; Part 22 explains why copying the reusable mechanism is different from copying either print.

## Finished films and their implementations

### Window Seat

**Core Parts:** 17–19, 22–28.

Teaching evidence:
- `VK`, `VSEG`, `S(t)`: analytic speed/distance that multiple visual and sound systems can share.
- `compose`, `put`, `add`, `knock`, `smear`, `mixCov`: full live-plate architecture.
- Parallax layers, reflections, veil/fog, covered switches, drops, ballistic sparks, star trails, slosh: a catalogue of *problem-specific mechanisms*, not required motifs.
- `SHOTS`: one authoritative shot list for tools and score.
- `FILM.md`: subject-specific ending, strip/crop review, performance cost, measured score, and explicit weaknesses.
- Piano score: evidence that a measured procedural model can still sound wrong to a listener, justifying sample-based realism when appropriate.

### Roost

**Core Parts:** 14–19, 22, 25–28.

Teaching evidence:
- Analytic crowd rather than frame simulation: thousands of birds remain pure in `t`.
- Crowd density becomes tone; fixed-view one-take form shows montage is not mandatory.
- Falcon disturbance and pour into roost demonstrate cause/consequence at system scale.
- Horizon shift as limited camera motion; page-space reflections and stable glitter show how visual continuity defects were measured and corrected.
- `FLIGHT_SCORE` derives musical events/tempo from picture state, useful when a visible event is diffuse rather than a single impact.
- `FILM.md` explicitly labels uninspected subject references, useful as a caution against overstating reference evidence.

### Lumen

**Core Parts:** 14, 18–19, 22, 26–28.

Teaching evidence:
- Cue list/dispatch and overlapping reveals for a short montage form.
- `memoryRadius(t)` as a continuous owner replacing per-shot radii that jumped.
- Loop-safe tide live element and documented before/after pixel evidence.
- Scene colourway swaps and one static+baked scene plus live element architecture.
- Release timing shared with score; continuous audio through memory.
- Its Resonance-derived structure is explicitly taught as one chosen form, not a default curriculum template.

### Emergence

**Core Parts:** 08, 14, 18–19, 22, 26–28.

Teaching evidence:
- Deliberate sibling reuse of Lumen's machinery while changing worlds/palette/content demonstrates reuse without copying frames.
- Analytic interference; seeded branching with birth times; loop-safe `life`; memory absorption shared by picture and score.
- Screen supercells show a real low-level screen quantisation issue and why engine changes should follow observed defects.
- Two complete score candidates show that measured validity does not choose an artistic winner.
- Verification explicitly records what was not watched/listened to, modelling honest evidence boundaries.

## Tooling and verification workflow

| Tool/file | Core Parts | What the learner learns |
|---|---|---|
| `tools/README.md` | 01, 19, 23–28 | Operational map of the supported inspection/export commands; used as workflow reference, not lesson order |
| `tools/new-riso.mjs` | 01, 11–12, 20–22 | Clean scaffold copies engines/kits but no art/story; refuses overwrite; authoritative HTML is edited thereafter |
| `tools/verify.mjs` | 01, 04, 12, 14, 22–23, 28 | Repeat/cold-seek contract across full duration/shot boundaries; does not prove continuity or beauty |
| `tools/review.mjs` | 19, 21, 23, 28 | Shot metadata, representative frames, repeated-transition prompts; visual aid, not aesthetic score |
| `tools/shoot.mjs` | 01, 07–08, 13–18, 23, 28 | Exact-time stills, coarse sheets, frame-spaced strips, native event investigation |
| `tools/still.mjs` | 01, 08, 11 | Native backing-store PNG and repeatability |
| `tools/render.mjs` | 17–18, 23, 27–28 | Exact per-frame MP4 export, section renders, full audio mux, post-AAC loudness/peak |
| `tools/audio.mjs` | 24–27 | Deterministic WAV, sheet, loudness/spectrum, valleys, marks, ffmpeg cross-check |
| `tools/lib/audio.mjs` | 24–27 | The shared deterministic sound/score kit: buses, room, spatial placement, instruments, material contacts, rendering, and mastering; taught through use rather than as an API inventory |
| `tools/lib/visual-kit.mjs` | 10, 13, 15 | Pure camera/surface/path/timing utilities and their limits |
| `tools/visual-kit.test.mjs` | 10, 13 | Mechanical guarantees for projection/travel/retiming/Hermite/ballistic, not art |
| `tools/scene-space.test.mjs` | 10, 13, 23 | Retime equivalence and draw performance for the scoped study |
| `tools/visual-workflow.test.mjs` | 01, 11, 28 | Late-film verifier coverage, native PNG, scaffold cleanliness and overwrite refusal |
| `tools/lib/browser.mjs` | 01, 28 | How tools open the work and seek exact frames; implementation detail beyond this is optional |
| `tools/lib/ffmpeg.mjs` | 28 | Export plumbing; learner needs to understand purpose, not become an ffmpeg-tool author |

## Useful material intentionally not part of the core course

- **`docs/forms/resonance.md` as a required film form:** intentionally excluded. It is taught only as an optional compositional form and historical context for Lumen/Emergence.
- **Recorded-sample bank rebuild scripts (`films/window-seat/build-piano-bank.py`, `films/roost/build-string-bank.py`) as mandatory work:** excluded from the core. They become an optional branch if the learner chooses recorded/sample-based sound. The core sound curriculum can be completed with the procedural sound kit.
- **`AUDIO-SOURCES.md`, `string-bank-manifest.json`, `VSCO-LICENSE.txt`:** licensing/attribution material is required only if the learner takes the recorded-sample path. The principle—redistributable license, pinned sources, attribution—is taught in Part 27.
- **The exact subjects/palettes of `gather`, `lines`, Window Seat, Roost, Lumen, or Emergence:** never core exercises to reproduce. Their mechanisms and documented corrections are evidence.
- **`hold()` as a style technique:** not a core recommendation because the repository labels it unproved.
- **Unvalidated extremes in the scene-space study, arbitrary camera motion, universal visibility/physics, organic anatomy guarantees, looping-bed seams, tempo changes, and other documented gaps:** the course names these limits instead of pretending the repository has solved them.
- **Tool-authoring internals:** modifying `tools/`, browser plumbing, ffmpeg pipe implementation, or the Claude hook system is outside the goal of learning to make films. The learner reads enough to trust the contract boundaries but does not refactor them.
- **`.claude/settings.json`, `tools/package.json`, and `tools/package-lock.json`:** operational configuration/dependency plumbing. They are part of repository setup and reproducibility but do not contain a distinct artistic or film-making concept that warrants a core lesson.
- **Real-person likeness:** the measurement method in `docs/visual-development.md` is useful optional specialization. It should become a required subexercise only if the learner's chosen subject depends on likeness.
- **Press-ready physical separations:** `riso-still` explicitly says this requires a separate print-production brief. The course teaches the repository's digital risograph film medium, not full physical-press prepress.

---

# Final-project progression

The final project begins only after the learner has demonstrated still craft, deterministic motion, moving-screen choices, transitions, and basic editing. It then grows in stages that never require future knowledge.

| Part | Final-project state | New obligation introduced at that Part | What is intentionally not required yet |
|---|---|---|---|
| 20 | Concept + risk proofs | Original premise, references, thumbnails, hard frame, hard action, early `FILM.md` | Full timeline, polished secondary scenes, implemented score |
| 21 | Full silent rough | Real duration, complete progression/ending, `SHOTS`, holds, transitions, normal-speed pacing | Final texture/detail, final sound |
| 22 | Finished picture pass | All essential final art/actions, appropriate baked/live architecture, coherent palette/value system | Exhaustive final verification, score |
| 23 | Picture lock | Evidence-driven defect correction, native crops/strips, encoded sections, explicit remaining visual risks | Musical arrangement |
| 24 | Sound skeleton | Exact deterministic `renderAudio`, spotted events, marks, room tone/continuity base | Detailed material cues, motif, climax |
| 25 | Foreground sound | Material-specific events, picture-derived sync, spatial placement | Complete musical arc/master |
| 26 | Full score | Motif/form, handoffs, density/silence, structural turn and ending | Final loudness/mix decisions |
| 27 | Final mix candidate | Balanced buses/room/register, measured and heard full mux | Final regression/delivery report |
| 28 | Delivered film | Integrated revision, exact export, decode checks, final `FILM.md`, design defense | Nothing further required for course completion |

The learner therefore never has to invent a score before learning the sound model, never has to decide a full timeline before learning editing, and never has to choose live plates before learning the simpler alternatives. Each final-project step consumes only concepts already taught.

A key rule throughout Parts 20–28 is **no future-dependent placeholder architecture**. For example, Part 21 may say "sound direction: sparse mechanical room with two impacts" in `FILM.md`, but it must not require sound-kit APIs that are not taught until Part 24. Likewise, Part 20 may identify a possible live-plate risk only because live plates were already taught in Part 17.

---

# Pedagogical risks

| Risk | How the course could fail | Mitigation in this plan |
|---|---|---|
| Documentation walkthrough | Parts mirror `docs/drawing.md`, `docs/motion.md`, `docs/sound.md` headings and the learner passively reads rules. | Parts are organised around concrete problems and builds. Docs are evidence introduced when the problem appears. Several docs contribute to one Part and one doc spans several Parts. |
| API/helper tutorial | Learner memorises `cut`, `shade`, `bandPass`, `Space.travel`, `Score`, etc. without knowing when not to use them. | Every major helper is introduced after a naïve/alternative approach reveals the problem it solves. Each Part requires explaining alternatives and when the rejected option is better. |
| Copy-the-existing-film course | Learner reproduces Window Seat transitions, Lumen's six passages, Roost flock, or Resonance dots. | Exercises use new subjects; finished works are architectural evidence. Part 20 explicitly rejects inherited story structures unless consciously chosen. Resonance is optional, not the spine. |
| Overly theoretical art course | Learner reads about value, silhouette, composition, or references but does not make procedural artifacts. | Every Part produces a viewable image, motion study, rough film, score stage, or final deliverable. Theory appears only as explanation for a build or review. |
| Verification-driven checklist | Green `verify`/audio output becomes synonymous with quality. | Part 04 intentionally creates a continuity defect that passes deterministic verification. Parts 08, 23, 27, and 28 explicitly separate technical, construction, perceptual, and artistic evidence. |
| Texture cargo cult | Learner uses grain, hatching, registration, and paper to hide weak drawing. | Texture is delayed until Part 08, after silhouette, value, and composition. Reference-led construction comes before the still capstone. |
| Premature architecture | Learner starts every film with live plates or perspective because those systems look sophisticated. | Baked scenes and simple live passes are taught first. Part 17 frames live plates as an expensive targeted solution. Final project must justify architecture. |
| Motion-as-easing | Learner maps every action to one stock ease. | Part 13 ties curves to units/material; Part 15 separates anticipation pose and environmental consequence from easing. |
| Timeline-first production | Learner fills a minute with scenes before proving the hardest visual/action problem. | Part 20 requires hard frame and hard action proof before Part 21 allows a full rough. |
| Contact-sheet-only review | Learner mistakes attractive sampled frames for good pacing. | Parts 18, 19, 21, 23 require normal-speed playback; sheets are used to locate issues, not to certify timing. |
| Sound as post-hoc decoration | Learner writes a generic soundtrack after picture. | Parts 24–26 derive event times, material, space, phrasing, and handoffs from the picture and its event data. |
| Meter-as-listening | Learner trusts LUFS/sync sheets to certify timbre or musicality. | Part 27 requires listening with picture and uses Window Seat's "meters passed, piano still sounded MIDI-like" correction as evidence. |
| Scope explosion | Final project tries to use every technique and becomes unfinishable. | Skills are competency requirements, not final-film ingredient requirements. The learner may deliberately choose baked scenes, no perspective, no live plates, sparse score, etc. if the concept supports it. |
| False generalisation from one study | Learner treats the drawing-machine study or attractive frame as universal proof. | Coverage audit marks repository-known gaps; the course requires comparable evidence and names the limits of each study. |
| Hidden future dependency | Early exercises invoke abstractions the learner has not learned. | Dependencies are explicit. Final project starts after all picture architecture is taught; sound begins only after its prerequisites. |

---

# Open questions

These are genuine curriculum decisions the repository does not fully answer. They should be resolved before writing lesson prose, because they materially change scope or assessment.

1. **Expected JavaScript/Canvas baseline.** The learner is described as a competent programmer, but not necessarily a Canvas/Web Audio programmer. Should Part 01 include a short Canvas 2D primer (state stack, paths, compositing, offscreen canvases), or may the course assume the learner can look up ordinary Canvas syntax while the course focuses only on repository-specific ideas? A primer increases length but may prevent incidental API friction from obscuring the craft.

2. **Default final-film duration.** The repository proves 28-second shorts and 70–78-second films, but it does not prescribe a learner capstone length. A default around 20–40 seconds would be more realistic for a first independent film while still requiring editing, continuity, and score structure; a 60–90 second requirement would test endurance and long-form pacing but multiply asset and review load. The choice materially affects course workload.

3. **Reference-access model.** Reference-led development is essential, but the course environment may or may not allow unrestricted web research. If web access is unavailable, should the course ship curated reference packets for Parts 09–11 while still requiring independent research for the final project, or should external research access be a hard prerequisite?

4. **Sound-path requirement.** The repository supports fully procedural sound, embedded sampled piano, and embedded recorded strings. Should every learner complete only the procedural core and treat sample embedding as optional, or should one advanced exercise require legal sample acquisition/attribution and embedding? The latter teaches an important real repository path but adds licensing and asset-preparation complexity unrelated to many films.

5. **Human/peer review availability.** The repository repeatedly distinguishes measurement from perceptual/artistic judgment. Will the course have an instructor/peer who can perform at least one external picture and sound review at Parts 11, 23, and 27, or must it be fully self-guided? If self-guided, the course should strengthen comparison protocols and require preserved before/after evidence, but it still cannot honestly substitute automated scoring for human judgment.

6. **Final-project subject constraints.** Should the capstone require a recognizable constructed/organic subject with at least one attachment/contact problem, or allow a wholly abstract film? An abstract film can still prove plate, motion, editing, and sound competence, but it may not independently re-test reference-led construction unless that skill is already considered sufficiently proven by Part 11.

---

# Recommended course-writing constraints derived from this plan

`COURSE-AUTHORING.md` is the operational contract for implementing this plan. It defines the command grammar, output locations, one-Part-per-session discipline, verification expectations, and Git/commit behaviour. The rules below remain pedagogical constraints and must not be weakened by the operational workflow.

When the individual lesson prose is written later, it should preserve the following rules:

- Do not reveal a helper before the learner has encountered the problem it solves, except for the minimum scaffold needed to produce the current observable result.
- Do not make a Part's success criterion "the command exited zero" when the Part is about visual, motion, editorial, or sonic quality.
- Preserve failed/naïve variants long enough for the learner to compare evidence; do not merely tell them the wrong approach is wrong.
- Reuse repository studies as evidence, but change exercise subjects often enough that the learner cannot pass by copying geometry.
- Give exact inspection tasks: whole frame, value/silhouette, 1:1 crop, frame strip, normal-speed playback, audio sheet, or full mux as appropriate. Do not say merely "review it."
- Every significant architectural/artistic decision should be taught as a trade-off: problem, chosen approach, plausible alternative, why not here, and when the alternative wins.
- The final project must remain original in premise, staging, and progression. Reusing the repository's technical medium and mechanisms is the goal; reproducing its existing films is not.
- `FILM.md` should evolve throughout the final project rather than be written as a post-hoc completion report.
- The course should preserve the repository's candour: record remaining weaknesses and unreviewed areas instead of converting uncertain artistic outcomes into invented scores.

