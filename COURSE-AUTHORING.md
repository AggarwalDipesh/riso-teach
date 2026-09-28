# Course Authoring Contract — Procedural Risograph Film

## Purpose

This file is the operational contract for agents that implement, inspect, verify, or repair the learner-facing course defined by `TEACHING-PLAN.md`.

`TEACHING-PLAN.md` defines **what the curriculum must teach, in what prerequisite order, and why**. This file defines **how an authoring agent works on that curriculum without repeatedly receiving a long prompt**.

The existing repository remains the technical and artistic source of truth.

## Fixed course target

The target of this course is fixed by `TEACHING-PLAN.md`:

- **Primary course/artifact type:** `riso-film`
- **Primary skill:** `.claude/skills/riso-film/SKILL.md`
- **Supporting skill:** `.claude/skills/riso-still/SKILL.md` when the plan is teaching still-image craft, visual development, or still inspection
- **Supporting skill:** `.claude/skills/riso-score/SKILL.md` when the plan reaches sound, scoring, mix, or audio delivery

Do not ask the user to choose `riso-film`, `riso-still`, or `riso-score` for each Part, and do not infer a different target from the current exercise. The Part entry in `TEACHING-PLAN.md` determines which supporting skill is relevant. The course and capstone remain `riso-film` unless the user explicitly amends the teaching plan.

If a future course is intended to teach a different top-level repository skill, it should receive its own teaching plan and course destination rather than reinterpreting this course at run time.

Do not modify existing:

- `films/`;
- `prints/`;
- `studies/`;
- `tools/`;
- `.claude/skills/`;
- `.claude/rules/`;
- craft documentation under `docs/`;
- completed works or their `FILM.md` files.

Do not modify `TEACHING-PLAN.md` or this file unless the user's command explicitly asks to amend the curriculum or authoring contract.

---

# Authority and conflict handling

Use this precedence when deciding what is true:

1. Existing repository implementation, craft rules, tools, skills, and verified completed works are the technical/artistic source of truth.
2. `TEACHING-PLAN.md` is the approved pedagogical design and dependency contract.
3. This file is the course-authoring workflow and filesystem/Git contract.
4. The current user command selects the operation and target and may add a narrow explicit override.

Do not silently resolve a genuine contradiction by inventing new architecture or changing the curriculum. Report the conflict. For an `AUTHOR` operation, make only a correction that is unavoidable for the current Part and explicitly record it; otherwise stop at the contradiction and report it.

---

# Course destination and artifact contract

The learner-facing course lives at:

`course/procedural-riso-film/`

Use this outer structure:

```text
course/
└── procedural-riso-film/
    ├── README.md
    └── parts/
        ├── 01-<descriptive-slug>/
        │   ├── PART.md
        │   └── project/        # only when meaningful
        ├── 02-<descriptive-slug>/
        │   ├── PART.md
        │   └── project/
        └── ...
```

Part slugs follow the approved titles in `TEACHING-PLAN.md`.

Do not pre-create empty Part directories or placeholder project directories. It is acceptable for `README.md` to contain the complete Part index from the beginning.

## `README.md`

`course/procedural-riso-film/README.md` is the learner's front door. It should contain only course-level information useful to the learner:

- intended audience;
- assumed programming knowledge;
- end capability;
- how cumulative progression works;
- repository/course setup needed before Part 01;
- how to run and inspect learner artifacts;
- the distinction between repository evidence and learner work;
- the Part index.

Do not duplicate `TEACHING-PLAN.md` into the learner README.

## `PART.md`

Every authored Part must contain a learner-facing `PART.md`. It is the actual teaching material, not a specification summary.

The learner must be able to determine from it:

- the concrete problem they are solving;
- what they will build, change, or investigate;
- what they should inspect before changing anything;
- which new concepts are introduced;
- how those concepts arise from the problem;
- what they are expected to implement or decide themselves;
- what repository evidence to inspect and why;
- how to run/render/listen to the result;
- what evidence to inspect afterward;
- which failure modes to look for;
- which architectural or artistic trade-offs matter;
- what must be understood before moving on;
- which concepts are deliberately deferred.

Do not force every Part into an identical heading template when a different lesson shape teaches the material better. The teaching contract matters more than cosmetic uniformity.

## Part projects

Create a Part-local `project/` only when it contains a meaningful runnable, renderable, listenable, or otherwise inspectable artifact.

Prefer cumulative work where it genuinely reinforces earlier concepts, but do not make every Part mutate one giant project merely for continuity. A Part may:

- create a small isolated experiment;
- extend an earlier Part's artifact;
- begin a new still/motion/sound study;
- transition into the original final-film project at the point defined by `TEACHING-PLAN.md`.

When extending earlier work, state the dependency explicitly in `PART.md`.

Starter code is allowed when setup would obscure the current learning objective. Distinguish supplied infrastructure from code or decisions the learner must make.

Do not expose a completed solution before an exercise whose purpose is for the learner to derive or design that solution. If a verified reference implementation is kept in the course tree, place it so the lesson can direct the learner to inspect it only after the relevant exercise, and do not rely on that reference for the learner to understand the prose.

Do not duplicate large amounts of production code without a pedagogical reason.

---

# Session command protocol

A fresh authoring session should require only a short command after this file and `TEACHING-PLAN.md` are present in the repository.

Command grammar:

`<MODE> <TARGET> [narrow instruction]`

The **mode** says what kind of work to perform. The **target** says which Part or scope. The agent derives the Part title, pedagogical role, prerequisites, required evidence, and expected artifact from `TEACHING-PLAN.md`; the user does not need to restate them.

## Modes

### `AUTHOR`

Create one new learner-facing Part that does not yet exist, including any meaningful project artifact, verification, and the required Part commit.

Examples:

- `AUTHOR PART 01`
- `AUTHOR PART 12`
- `AUTHOR NEXT`

`AUTHOR NEXT` means determine the next unfinished Part from the course tree and Git history, then author only that Part.

Do not use `AUTHOR` to rewrite an already completed Part. Use `REPAIR` or `AMEND`.

### `AUDIT`

Inspect the target adversarially without modifying repository files unless the command explicitly requests an audit report file.

Examples:

- `AUDIT PART 11`
- `AUDIT PARTS 01-11`
- `AUDIT COURSE`

Audit against the repository, `TEACHING-PLAN.md`, this contract, prerequisite discipline, implementability, and observable-result requirements. Distinguish actual defects from stylistic preferences or pedantry.

No commit is made for a read-only audit.

### `VERIFY`

Run the relevant mechanical and manual/visual/audio checks for an already-authored target and report what the evidence proves and does not prove.

Examples:

- `VERIFY PART 17`
- `VERIFY COURSE`

Do not modify content merely to make verification pass. If a defect is found, report it and leave repair to `REPAIR` unless the user explicitly combines the operations.

No commit is made for a read-only verification run.

### `REPAIR`

Fix concrete defects in an existing Part while preserving its intended scope and pedagogy.

Examples:

- `REPAIR PART 07 — fix the future dependency found in the audit`
- `REPAIR PARTS 12-14 — address only the listed continuity defects`

Do not redesign unrelated material. Run the appropriate checks and make a separate repair commit.

### `AMEND`

Apply an explicit requested change that is not merely a defect fix—for example changing exercise scope, adding a missing trade-off explanation, or changing the authoring contract.

Examples:

- `AMEND PART 09 — require two reference families instead of one`
- `AMEND PLAN — change the final-film duration policy`
- `AMEND AUTHORING — add a new command mode`

Amendments to `TEACHING-PLAN.md` or this file require the command to name `PLAN` or `AUTHORING` explicitly.

### `EXTEND`

Add course material only after the curriculum has explicitly been extended in `TEACHING-PLAN.md` or the current command explicitly authorizes both the curriculum extension and its implementation.

Do not use `EXTEND` as a way to invent extra Parts during normal authoring.

### `SCAFFOLD`

Create only the minimum learner-facing course shell (`README.md`, `parts/`, and any setup required to begin Part 01) without authoring future Parts.

Normally `AUTHOR PART 01` may perform this bootstrap automatically if the course does not yet exist, so a separate `SCAFFOLD` command is optional.

---

# How to interpret the target

For `PART NN`, use exactly the Part with that number in `TEACHING-PLAN.md`.

For `PARTS NN-MM`, operate only across that inclusive range.

For `NEXT`, inspect the course tree and Git history and choose the lowest-numbered approved Part that has not been completed and committed.

For `COURSE`, inspect the whole learner-facing course and its dependency chain. Do not use `COURSE` with `AUTHOR`; normal generation remains one Part at a time.

The user should not have to specify a separate "Part type." The pedagogical type is already encoded by the plan. For example, whether the target is a tightly guided foundation, a still capstone, a motion lesson, or a final-project production gate is derived from that Part's entry in `TEACHING-PLAN.md`.

---

# Required repository study before authoring

Do not write a Part from `TEACHING-PLAN.md` alone.

Before authoring the target Part:

1. reread its complete entry in `TEACHING-PLAN.md`;
2. inspect every repository artifact explicitly named as evidence/reference for that Part;
3. inspect the relevant implementation behind that evidence, not just prose documentation;
4. when a completed work is used as evidence, inspect both its `FILM.md` and the implementation relevant to the concept;
5. reread the earlier course Parts on which the target directly depends;
6. identify the exact learner state entering the Part;
7. identify concepts that must remain deferred.

For very large completed-work files, locate and read only the implementation regions relevant to the current concept. Do not ingest an entire large generated or asset-embedded file when targeted search or bounded reads answer the question.

---

# Pedagogical authoring rules

Do not mechanically expand bullets from `TEACHING-PLAN.md` into prose.

Design an actual learning experience. Where the repository's real constraints make it meaningful, the learner should:

1. encounter a concrete visual, construction, motion, editing, sound, or engineering problem;
2. see why a plausible simple approach seems reasonable;
3. observe the real limitation or failure;
4. derive the repository's technique or architecture from that failure;
5. apply or improve the technique themselves;
6. inspect evidence that answers whether it worked.

Do not manufacture artificial failures merely to satisfy this pattern.

## Dependency discipline

An earlier Part may not depend on knowledge, utilities, abstractions, terminology, workflows, or techniques first taught later.

Before using a repository helper pedagogically, either:

- it was already introduced in an earlier Part; or
- the current Part first explains the problem it solves and introduces it here.

Do not expose future architecture simply because it exists in the production repository.

Audit every authored Part for:

- unexplained helper functions;
- future terminology;
- later rendering architecture;
- later animation concepts;
- later audio infrastructure;
- later verification workflows;
- exercises whose solution requires a technique not yet taught.

## Teach decisions, not recipes

For every significant architectural or artistic choice, teach:

- the problem being solved;
- why the repository's approach works here;
- at least one plausible alternative;
- why that alternative is not being used here;
- when that alternative would actually be the better choice.

Do not teach repository helpers as mandatory style. The learner should understand the underlying reason well enough to make a different deliberate choice.

## Existing works are evidence

Use studies, prints, and completed films as evidence, not assignments to reproduce.

When an existing artifact demonstrates a concept:

- identify exactly what the learner should inspect;
- explain what question that evidence answers;
- then apply the idea to a different learner subject/problem where practical.

Window Seat, Roost, Lumen, Emergence, Resonance, and existing prints are not course templates. Their mechanisms may be analysed and reused deliberately; their subjects, staging, motifs, palettes, transitions, and story structures must not become disguised learner copies.

## Observable results

Every Part must leave the learner with a meaningful observable artifact or improvement.

A command exiting zero is not sufficient evidence for a visual, motion, editorial, or sound lesson.

Maintain the distinction between:

- technical contract evidence;
- construction evidence;
- perceptual craft evidence;
- artistic judgment.

Use an inspection method that matches the question, such as:

- full frame;
- silhouette/value view;
- 1:1/native crop;
- before/after comparison;
- frame strip;
- normal-speed playback;
- transition loop;
- contact sheet;
- audio sheet;
- waveform/spectral/loudness evidence;
- picture-and-sound playback.

Never imply that `verify`, a contact sheet, audio measurements, or successful export proves artistic quality.

## Scaffolding taper

Follow the taper specified by `TEACHING-PLAN.md`.

Early Parts may be explicit and guided. Middle Parts should require diagnosis and increasingly independent choice. Late Parts must specify evidence and production gates without prescribing the creative answer.

The original final film must not be a reproduction or reskin of an existing work.

---

# Final-project discipline

Preserve the final-project progression in `TEACHING-PLAN.md`.

Do not let the learner fill the full timeline before proving difficult work. The intended order is:

- concept and references;
- hard-frame proof;
- hard-action/risk proof;
- full-duration silent rough;
- picture production;
- evidence-driven picture debugging;
- picture lock;
- deterministic sound contract and spotting;
- material/sync work;
- score structure;
- mix/review;
- integrated revision and final delivery.

Do not introduce future sound APIs during picture stages merely as placeholders.

The learner's final-film documentation should evolve alongside the film and record intent, decisions, evidence, known limitations, unresolved weaknesses, and revisions.

---

# Authoring and verification loop for `AUTHOR`

For one target Part:

1. Inspect branch, `git status`, recent Git history, existing course files, `TEACHING-PLAN.md`, and this contract.
2. Confirm the target Part is the intended next authoring unit and its prerequisites already exist.
3. Study the repository evidence required for the Part.
4. Author or update only the learner-facing files needed for this Part.
5. Create or extend a meaningful project artifact only when required by the lesson.
6. Perform the learner exercise sufficiently to establish that the instructions are implementable.
7. Run appropriate technical checks.
8. Perform the same visual/audio/manual inspection the learner is instructed to perform, where possible.
9. Audit the Part for future dependency leakage and cargo-cult use of repository helpers.
10. Inspect `git diff` and `git status`.
11. Confirm no protected existing repository material was unintentionally modified.
12. Commit the completed Part.
13. Push the commit to the current course branch when the environment supports/permits pushing.
14. Stop. Do not begin another Part.

Do not claim an inspection was performed if the environment could not actually perform it. Record the limitation instead.

---

# Git contract

Git history is part of the course artifact.

Every newly completed Part gets its own commit. Do not combine multiple new Parts into one commit. Do not squash completed Part commits during ordinary authoring.

Use commit messages in this form:

`course: complete part NN - <short title>`

A Part commit may include:

- the target Part's `PART.md`;
- the target Part's meaningful project files;
- necessary updates to the learner `README.md`/Part index;
- a strictly necessary correction to earlier course material, only when reported explicitly.

It must not include unrelated repository changes.

For repairs, use:

`course: repair part NN - <short reason>`

For explicit amendments, use:

`course: amend part NN - <short reason>`

Do not amend a previous completed Part commit unless the user explicitly asks for Git-history rewriting. Normal corrections receive a new commit.

If unrelated user changes are already present in the working tree, preserve them and exclude them from the course commit.

In a cloud session, the repository and Git history are persistent memory between fresh agent sessions. Do not assume access to reasoning or conversation state from the session that authored an earlier Part.

---

# Completion report

After `AUTHOR`, `REPAIR`, or `AMEND` completes, report concisely:

- operation and target;
- files created/changed;
- learner artifact produced or extended;
- repository evidence used;
- concepts introduced or changed;
- prerequisite Parts relied upon;
- concepts deliberately deferred;
- technical verification performed;
- visual/audio/manual inspection performed;
- any discrepancy between the plan and repository;
- commit hash;
- whether the commit was pushed and to which branch, if applicable.

Then stop.

For `AUDIT` or `VERIFY`, report findings and evidence without creating a commit unless the command explicitly requested a repository artifact.

---

# Minimal session prompts

A normal fresh cloud session should need only one of these after checking out the correct course branch:

```text
Read TEACHING-PLAN.md and COURSE-AUTHORING.md. AUTHOR NEXT.
```

or, when you want an explicit Part:

```text
Read TEACHING-PLAN.md and COURSE-AUTHORING.md. AUTHOR PART 07.
```

For a milestone audit:

```text
Read TEACHING-PLAN.md and COURSE-AUTHORING.md. AUDIT PARTS 01-11.
```

For a repair:

```text
Read TEACHING-PLAN.md and COURSE-AUTHORING.md. REPAIR PART 11 — address only the confirmed findings from the previous audit.
```

The long-lived repository files carry the curriculum and workflow. The session prompt selects only the operation and target.
