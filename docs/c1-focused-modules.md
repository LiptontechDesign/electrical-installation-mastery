# C1: sixteen focused subject modules

Implemented 19 October 2026 · curriculum revision 13.

C1 has its own visible **Module 1–16** sequence, independent of C2. The course map, module cards, overview, search, Home resume context and organisation destinations all use the pathway's module number. Stable module IDs remain the persistence keys. Global catalogue ordinals are internal only.

| C1 module | Subject | Learning purpose |
|---:|---|---|
| 1 | AC and Three-Phase Foundations | Generation, waveforms, RMS, load behaviour, phases, star/delta and neutral current. |
| 2 | AC Power and Calculations | Reactance experiments, phasors, impedance and the power triangle before three-phase calculations. |
| 3 | Generator Principles and Controls | Complete set, alternator output, frequency, loading, governor, AVR and ratings; specialist controls optional. |
| 4 | Transformers | Induction and ratios before EMF, losses and efficiency. |
| 5 | Electrical Measurements | CT precautions, wattmeters, power analysers and bridge measurement; historical apparatus optional. |
| 6 | Power-Factor Correction | Causes, consequences, target factor, capacitor sizing and compensation options. |
| 7 | Three-Phase Distribution | Recognise phases, boards and industrial outlets before installing them. |
| 8 | Load Assessment and Cable Design | Brief, demand, routes, rating factors, capacity and combined voltage drop. |
| 9 | Earthing and Fault Protection | Bonding, RCDs, disconnection, conductor sizing, switching and surge principles. |
| 10 | Submains and Board Installation | Apply completed design/protection checks to physical SWA and board connections. |
| 11 | Motor Principles and Connections | Operation, nameplates, input/output efficiency examples, slip, torque and winding connections. |
| 12 | Motor Starting, Protection and Speed Control | Contactors, protection, DOL, reversing, star/delta, autotransformer starting, soft starters and drives. |
| 13 | Initial Verification and Commissioning | Inspection, dead tests before live tests, result interpretation and handover. |
| 14 | Periodic Inspection | Scope, observations and reporting for an existing installation. |
| 15 | Standby Generators: Connections and Operation | Apply earlier principles, design and verification to siting, earthing, transfer and operation. |
| 16 | Fault Diagnosis | Combine installation/motor knowledge, measurements, emergency response and investigation. |

Each row is an actual module with its own sections and progress. After the [seven-step cable-design addition](c1-cable-design-series.md) and [Rashid iqubal worked examples](c1-rashid-worked-examples.md) on 21 October, C1 contains 89 stable sections and 154 mixed video entries. The whole course has 456 catalogue entries and 488 default mixed entries across 31 modules and 194 sections. One medium-voltage switchgear lesson/section moves to Advanced; no video is deleted.

## Prerequisite repairs

The two existing three-phase motor worked examples and shaft-output/efficiency calculation now follow induction-motor operation and the nameplate lesson in Module 11. General power theory stays in Module 2. Learners no longer need to understand a motor nameplate before meeting the machine.

Module 6 teaches power-factor causes, consequences and sizing as requested. The existing capacitor-placement demonstration refers to induction generation and VFD outputs, so its stable section follows motor/drive teaching in Module 12. A VFD is introduced in its own lesson before the associated capacitor precautions. This applies the earlier PFC calculations without requiring a new topic before its foundation.

Generator principles remain early, immediately after AC power. Physical standby applications remain late, after cable design, protective-conductor checks, switching and verification. General transformer principles precede CTs and autotransformer starting. The existing autotransformer starter lesson itself introduces the tapped common winding before its starting circuits; an additional generic introduction would repeat that explanation.

Stepper/servo videos are labelled optional further study. Medium-voltage switchgear is optional in Advanced's Specialist Cables and Switchgear module. Existing optional Lorenz apparatus, detailed excitation/governor hardware, complex-number tools, torque–slip analysis and specialist lightning applications remain distinguishable from the core route.

## EPRA scope

The [EPRA written/oral competency document](https://www.epra.go.ke/sites/default/files/2025-06/Written%20%26%20Oral%20Interviews%20Areas%20of%20Competency.pdf), pages 1–2, was retrieved and read on 19 October 2026. C1 includes C2 competence and low-voltage three-phase building installation up to four storeys, excluding factories and public-entertainment premises. This route supplements the C2 foundations; it does not remove that prerequisite.

| C1 competency | Main course coverage |
|---|---|
| Three-phase power, current and voltage | Modules 1–2, 5 and motor calculations in 11 |
| Cable/protective-device sizing and special devices | Modules 7–10 and motor protection in 12 |
| Domestic/small-commercial earthing | Modules 9–10, applied in 13 and 15 |
| Power-factor causes, demerits, correction and sizing | Module 6, with motor/drive placement in 12 |
| Motors, starting, speed control and protection | Modules 11–12 |
| Initial and periodic inspection/testing | Modules 13–14; interpretation and diagnosis in 16 |

EPRA separately identifies medium-voltage installations and backup changeover under B, and detailed generator sizing, installation, protection and maintenance under A2 (Generators). Generator foundations and the requested UK practical examples support understanding and historical question preparation; their inclusion is not a claim that all A2 competence is required for C1 or achieved by these clips. UK examples require the actual Kenyan installation/examination conditions to be checked.

The teaching approach follows the [NSW Department of Education's sequencing guidance](https://education.nsw.gov.au/teaching-and-learning/curriculum/explicit-teaching/explicit-teaching-strategies/chunking-and-sequencing-learning): manageable concepts connected in a logical progression. Module boundaries alone do not prove learning; the independently available Practice and Papers areas provide opportunities to use the knowledge.

## Additional video review

Full available caption tracks were read for three possible additions. None was added: Stan Gibilisco's autotransformer introduction is mostly RF matching and includes confusing voltage wording; Flirting with Technology's short introduction describes isolation imprecisely; Power Electrics UK's short generator-sizing video overgeneralises power factor and loading limits. [Review metadata](c1-module-video-review.json) records URLs, caption ranges and hashes without publishing third-party transcripts.

The retained autotransformer lesson has a clearer application sequence and now explicitly qualifies its Canadian voltage/code examples, lack of galvanic isolation and conductor-sizing limitations. The seven generator videos already added in revision 12 remain in the new modules. See [their transcript evidence and practical coverage audit](c1-generator-learning.md).

An outstanding practical limitation remains: the generator selections do not show every inlet/changeover termination and both-source commissioning test on one installation. They cannot honestly be presented as a complete standalone installation practical. No unsuitable clip was added to conceal that gap.

## Preservation and validation

Whole sections keep their IDs and exact mixed row groups. Account parsing resolves their module ownership from the new section layout; no row-moving migration is needed. All existing videos, notes, bookmarks, watched identities, private additions, explicit personal placements, archives, removals and historical Undo destinations remain valid. Supplementary-video module metadata follows its actual saved section.

`scripts/fixtures/c1-modules-previous.json` is the actual published revision-12 course. `scripts/test-c1-modules.mjs` checks its exact upgrade, all 16 subjects, prerequisite edges, unchanged overall progress, custom order, nested private additions, archived parents, explicit cross-pathway moves, deletions, legacy ordering and pre-update Undo. Historical curriculum and account tests continue to exercise earlier revisions.

Validation passed: the focused-module and historical curriculum suites, account/API/guest isolation, learner-state and mixed-progress checks, course navigation/workspace/fullscreen component tests, protected EPRA questions, Past Papers, books, theme, ESLint, TypeScript, Next.js production build and Vinext production build. The API suite uses a deterministic storage fixture. Vinext retains its existing chunk-size warning. In the single dedicated Chrome tab, the local production build showed all sixteen C1 module labels and the foundation-first generator section; selecting a lesson and Previous/Next navigation worked without console errors. Embedded playback was not established during this tab check, so it is not included in that verification claim.
