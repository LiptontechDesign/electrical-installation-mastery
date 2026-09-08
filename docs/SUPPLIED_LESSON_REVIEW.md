# Supplied video additions — 8 September 2026

The course now includes all 44 relevant videos from the three specialist archives exactly once. Fourteen were already present; 30 were missing and have been added. The fourth archive, named “Existing 256 Videos”, was retained as additional source evidence. Archive filenames are not used as a count of the active curriculum.

| Collection | Supplied relevant videos | Already present | Added | Placement |
| --- | ---: | ---: | ---: | --- |
| AC theory | 26 | 9 | 17 | Module 1 |
| Resistance and resistivity | 7 | 2 | 5 | Foundations in Module 1; voltage-drop application remains in Module 6 |
| Lighting | 11 | 3 | 8 | Module 12 |

The unrelated Numberphile video about Bertrand’s paradox remains in the source archive but is not included in the electrical curriculum.

## Sequencing decisions

Resistance geometry and temperature now follow Ohm’s law. The existing conductor-resistance calculation (`p06-l06`) moves into that run, followed by length, nichrome and constantan. Its stable ID is preserved. The voltage-drop application remains with cable design in Module 6.

AC proceeds from the fluorescent-lamp motivation and load vocabulary through waveform generation, frequency, reactance, waveform comparison, phasors, voltage triangles, impedance, parallel current, power triangles, power factor, coil analysis and worked applications. The correction lesson follows the necessary phase and power concepts. Existing transformer and safe-measurement lessons remain in Module 1.

Lighting proceeds from the existing visual-task introduction through quantities, inverse-square predictions, direct calculations, oblique incidence, the existing lumen-method lessons, fitting counts and multiple-source point calculations. Existing design and installation lessons follow this foundation.

There are 276 lessons and 68 cumulative checkpoints. No existing lesson or video was deleted or duplicated. Existing IDs preserve the identity of saved notes, completions and cards; moved lessons retain their IDs.

Expanded checkpoint scopes in Module 1 (after its first two checkpoints) and Module 12 have revised identifiers. Old checkpoint passes must not silently count as passes for newly inserted material. Learners may need to take these expanded checkpoints again; individual lesson identities are unchanged.

## Added learning content

Each added lesson contains a transcript-specific model, three distinct ideas, a practical connection, a retrieval problem and exact answer, five explicitly written four-choice questions, three choice-specific diagnoses per question, and five independent recall cards plus an overview card. This gives 150 new questions and 180 cards. The helpers only serialize authored text and shuffle choices together with feedback; they do not invent stems, alternatives or explanations.

The existing overview flow and visual styles are reused. The before-watch state withholds answers; after-watch consolidation includes the exact retrieval answer, a misconception and the quiz bridge. No unrelated standards cards are introduced for these physical-principle lessons.

Source identity, paths and SHA-256 values are recorded in `app/supplied-video-index.json`. Added durations are estimated from the final supplied caption timestamp and visibly marked approximately. Existing duration metadata is retained.

## Technical corrections

- Copper resistance increases with temperature over the demonstrated range, but is not directly proportional to Celsius temperature.
- Inverse-square lighting behaviour is not an exponential relationship.
- Lower RMS supply current at unchanged voltage means lower apparent power; it does not alone prove lower useful-load real power. See [OpenStax: Power in an AC Circuit](https://openstax.org/books/university-physics-volume-2/pages/15-4-power-in-an-ac-circuit).
- Series-reactance cancellation is separated from shunt power-factor correction. For single-phase shunt compensation, use `Qc = P(tan φ1 − tan φ2)` and `C = Qc/(2πfV²)`. The coil transcript mixes these cases; its numerical capacitor recommendation is not adopted as an installation instruction. See [Schneider Electric: Power Factor Correction](https://www.electrical-installation.org/enwiki/Power_Factor_Correction).
- Real coils are distinguished from ideal inductors; measured alloy resistivities retain their sample and measurement limitations; lighting calculations state point-source, incidence and loss-factor assumptions.

## Whole-course editorial audit — remaining work

The runtime bank contains 1,650 questions. The audit identified **1,355 inherited questions** using the older generated follow-up/diagnostic path. They are individually listed in `assessment-template-audit.json`, including their lesson IDs, question IDs, prompts and options. This is a reproducible structural audit of every active question, not a claim that each old question has already received a full human-equivalent transcript review.

Those inherited items have **not** all been rewritten in this patch. Calling the whole course “template-free” would therefore be inaccurate. Their existing behaviour is preserved while the new additions bypass that path. A complete remaining editorial pass must read each relevant transcript, replace weak choices and feedback, and verify any applicable current standards. The 150 new questions do not use that generator.

## Verification

- Source coverage: 276 active records; 275 with transcripts and one declared visual-only source.
- All 44 specialist source files pass SHA-256 checks; each relevant video appears once.
- All 30 additions have five unique MCQ stems, distinct choices and linked option diagnostics; shuffled choices retain the correct answer and feedback.
- Both overview states render for all new lessons; questions and independent recall cards stay linked to stable lesson IDs.
- Ordering, cumulative checkpoint coverage, total durations and representative numerical answers are checked automatically.
- Existing curriculum and interactive learning regressions pass; production compilation and TypeScript checks pass.

Release status is recorded in Git history and the hosted site's saved versions.
