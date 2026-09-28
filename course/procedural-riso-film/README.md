# Procedural Risograph Film

A course in making original films the way this repository makes them: every frame drawn in
Canvas 2D by one self-contained `index.html`, printed in simulated risograph ink, driven by exact
time, inspected with the tools in `tools/`, scored deterministically and exported without a
dropped frame.

## Who it is for

You are a competent programmer. You can read and write JavaScript, run Node scripts from a
terminal, use Git, and look things up on MDN when an API is unfamiliar. You do not need to know
anything about this repository, risograph printing, halftone screens, animation, film editing or
sound design.

The course assumes you can look up ordinary Canvas 2D calls (`fillRect`, `arc`, `fill`,
`fillStyle`, paths, `save`/`restore`) yourself. It teaches the ideas this repository adds on top
of Canvas, not Canvas itself. Web Audio is not needed until the sound Parts.

## Where you end up

By the last Part you will have originated, built, inspected, scored, revised, verified and
delivered an original procedural risograph film: a self-contained HTML source plus an MP4
rendered from it, with a written record of its design decisions, its evidence and its remaining
weaknesses. The film is yours in premise, staging and progression; it is not a remake of the
films in `films/`.

## How the course progresses

The Parts are cumulative and must be taken in order. Each Part assumes only what earlier Parts
taught. When a Part builds on an artifact you made earlier, it says so.

The support tapers deliberately:

- **Parts 01–04** are tightly guided. They set up the machinery everything else rests on: exact
  frames, the ink-plate model, knockouts and deterministic randomness.
- **Parts 05–11** teach still-image craft with increasingly independent drawing decisions, and
  end with an original print.
- **Parts 12–19** add time, motion, transitions and editing; you choose the architecture.
- **Parts 20–28** are your final film. The course sets the evidence and review gates; the
  creative answers are yours.

Every Part ends with something you can open, watch, listen to or inspect, and with a short
written account of what your evidence does and does not show.

## Before Part 01

From the repository root:

```sh
cd tools
npm install        # playwright-core and ffmpeg-static
npm run setup      # the Chromium and Firefox builds this playwright-core expects
npm test           # the harness's own self-tests
```

You need Node.js 18 or newer. If `npm test` stops with an error, fix the setup before starting;
the usual cause is a browser that `npm run setup` did not download. `tools/README.md` explains
each tool and its setup in more detail.

`npm install` may rewrite the package name inside `tools/package-lock.json` (the lockfile and
`tools/package.json` disagree about it). The change is harmless; discard it with
`git checkout -- tools/package-lock.json` so your working tree only contains your own work.

Open works in **Firefox**, the repository's primary engine. Part 01 explains why.

## Where your work goes

| Kind | Location | In Git? |
|---|---|---|
| Lesson text | `parts/NN-<slug>/PART.md` | Supplied. Read it; don't edit it. |
| Supplied files | `parts/NN-<slug>/project/` | Supplied. Copy before changing. |
| Your work | `parts/NN-<slug>/work/` | Yours. You create it; commit it if you want a record. |
| Tool output (PNGs, sheets, MP4s) | `out/course/NN/` at the repository root | Ignored. Disposable, regenerate at will. |

Run tools from `tools/`, as the repository's own docs do. Each Part gives exact commands; they use
paths relative to `tools/`, for example `../course/procedural-riso-film/parts/01-an-exact-frame/work/...`.

## Repository evidence versus your work

The rest of the repository (`films/`, `prints/`, `studies/`, `docs/`, `tools/`, `.claude/`) is
**evidence**: finished works, craft notes, experiments and the harness that produced them. Parts
send you to specific places in it to answer specific questions. Read it, run the tools on it, but
do not modify it and do not copy its subjects, palettes, staging or story structures into your
exercises. Its mechanisms are what you learn to reuse, deliberately.

Your exercises and your final film are new work. They live under `parts/NN-<slug>/work/`.

## Inspecting results

The tools answer different questions, and no tool certifies artistic quality:

- `verify.mjs` checks that a frame is a pure function of time. It says nothing about whether the
  frame is any good.
- `still.mjs` exports the exact native pixels of one frame.
- Other tools are introduced when a Part needs them.

When a Part asks you to look at something (a whole frame, a 1:1 crop, a strip of neighbouring
frames, normal-speed playback, a sound sheet) it says which, and why. A command that exits 0 is
never, on its own, the answer to a visual, motion or sound question.

## Parts

| Part | Title |
|---|---|
| [01](parts/01-an-exact-frame/PART.md) | An Exact Frame: Repository Contract and Inspection Harness |
| [02](parts/02-ink-paper-screen/PART.md) | Ink, Paper, Screen: The Plate Model |
| [03](parts/03-knockouts-ownership-draw-order/PART.md) | Knockouts, Ownership, and Draw Order |
| 04 | Pure Time and Stable Randomness |
| 05 | From Primitives to Designed Contours and Marks |
| 06 | Value First: Modelling Form Without Mud |
| 07 | Composition, Focus, and the Frame Budget |
| 08 | Print Finish and Native-Resolution Judgment |
| 09 | Reference-Led Visual Development and the Hard Frame |
| 10 | Scene Space: Perspective, Attachment, and Occlusion |
| 11 | Still Capstone: From Brief to Delivered Procedural Print |
| 12 | Time as an Explicit Input |
| 13 | Motion Has Units: Speed, Easing, and Mass |
| 14 | Determinism Is Not Continuity: Loops, Resets, and Stable Motion |
| 15 | Anticipation, Contact, and Follow-Through |
| 16 | Tone on Moving Elements: `bandPass` and `relight` |
| 17 | Live Plates: When Most of the Frame Moves |
| 18 | Transitions That Carry the Eye |
| 19 | Shot Design and Editing: Build an Event, Not a Slideshow |
| 20 | Final Project I: Original Concept, Visual Development, and Risk Proofs |
| 21 | Final Project II: Full-Duration Silent Rough |
| 22 | Final Project III: Picture Production and Reuse Without Cargo Culting |
| 23 | Final Project IV: Evidence-Driven Picture Debugging and Picture Lock |
| 24 | Sound I: Deterministic Audio Contract and Spotting the Picture |
| 25 | Sound II: Material, Sync, and Screen Space |
| 26 | Sound III: Scoring to Picture, Handoffs, Density, and Climax |
| 27 | Sound IV: Mix, Master, and Perceptual Review |
| 28 | Final Project V: Integrated Revision, Verification, and Delivery |

Parts without a link have not been written yet.
