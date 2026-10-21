# C1: Rashid iqubal applied examples

Reviewed 21 October 2026. Three additions from [Rashid iqubal’s channel](https://www.youtube.com/@Rashid-iqubal/videos), totalling **50:10**, complement the existing foundations. All are optional applied examples with concise technical clarifications in the existing lesson-note style. No section descriptions or extra interface panels were introduced.

| C1 position | Video | Reason for placement |
|---|---|---|
| Module 6, Section 4 — Applied example: capacitor-bank steps and protection | [Capacitor-bank calculation](https://www.youtube.com/watch?v=vbytmPtvZi4), 10:43 | Follows the target-PF and three-phase capacitor calculations; adds bank steps and protective-device considerations before optional mathematical depth. |
| Module 11, Section 1 — Worked Building Design: From Loads to Feeders | [Supplied residential-building example](https://www.youtube.com/watch?v=HmgqGPzYSMs), 28:04 | Connects apartment demand, board hierarchy, transformer capacity and feeders. Cable sizing, voltage drop and fault-protection foundations have already been taught; physical submain and board assembly follow immediately. |
| Module 16, Section 2 — Main distribution boards, bus couplers and automatic transfer | [MDB and generator-transfer diagrams](https://www.youtube.com/watch?v=j78uOSXYuOE), 11:23 | Builds on neutral/earthing, interlocked changeover and real standby operation, then compares single- and split-bus arrangements and critical-load supply. |

Existing section IDs and membership remain stable; only the displayed numbers following the two inserted sections change. C1 now contains **89 sections and 154 default mixed rows**. Across all pathways there are 456 canonical lessons, 488 default mixed rows, 194 sections and 31 modules.

## Transcript review and selection

The complete available English caption text was read for six videos. [The review manifest](c1-rashid-video-review.json) records original titles, transcript hashes, languages, segment counts, reviewed ranges, decisions and runtime provenance. Captions remain in ignored `work/c1-rashid-review/`; they are not redistributed in Git. Automatic captions can lose digits and symbols. YouTube oEmbed returned an iframe for each selected video; live playback and frame-by-frame verification were not performed.

The screening covered the latest 30 channel entries and channel searches for motor, generator and power factor. It is a curated sample, rather than a review of the entire archive. Further transcript retrieval was limited by provider failures and the fallback provider’s daily free quota. Unreviewed candidates were not added on the strength of titles alone. Medium-voltage termination/RMU material falls outside the C1 low-voltage sequence.

Three reviewed alternatives were omitted: the short-circuit example adds impedance magnitudes, which can underestimate fault current; the five-minute motor explanation incorrectly adds phase voltages arithmetically; the combined DOL/star-delta video repeats existing coverage and misstates the starting-current reduction. These are substantive reasons to retain the present lessons. For fault estimates, add the resistive components and reactive components separately before finding the impedance magnitude. ABB’s [motor-starting handbook](https://library.e.abb.com/public/6b4e1a3530814df0c12579bb0030e58b/1SFC132060M0201.pdf) explains the approximate one-third starting line current for star relative to direct delta starting.

## Technical qualifications

The building example is useful for connecting design stages, but its final component choices require verification. Its higher upstream kA rating does **not** establish selectivity. Selectivity needs device coordination data; see Schneider Electric’s [coordination principles](https://www.electrical-installation.org/enwiki/Coordination_between_circuit-breakers). Its parallel-cable example gives `2 × 490 × 0.8 = 784 A` installed capacity. An 800 A frame therefore needs an appropriate verified overload setting or revised conductors; [protection must coordinate with installed capacity](https://www.electrical-installation.org/enwiki/Practical_values_for_a_protective_scheme). The lesson note also distinguishes example margins from design requirements and retains phase balancing, full-route voltage drop and fault checks.

Independent calculation gives `200 × [tan(acos(0.75)) − tan(acos(0.95))] = 110.6466 kVAr`. The capacitor example proposes 125 kVAr but continues its current calculation using 122 kVAr; the installed 125 kVAr bank instead draws about **173.90 A at 415 V**. Its 300 A choice and percentage factors are not universal instructions. Use the actual bank, harmonic conditions and manufacturer protection data, and review switching steps at reduced load. Schneider’s [capacitor protection guidance](https://www.electrical-installation.org/enwiki/Implementation_of_capacitor_banks) and [fixed/automatic bank guidance](https://www.electrical-installation.org/enwiki/The_choice_between_a_fixed_or_automatically-regulated_bank_of_capacitors) provide the supporting basis. PF correction reduces upstream current and associated losses; it does not automatically reduce the working load’s active power.

The MDB lesson is a diagram explanation, rather than an installation procedure. Its transfer-delay example is system dependent. Open-transition transfer interrupts supply; continuity depends on a suitable UPS for the affected loads. Neutral treatment, interlocking, protection and load shedding must be resolved for the actual system.

## Saved courses and validation

Additive catalogue normalisation supplies the new sections and lessons to revision-13 accounts without replaying historical placement migrations. Private copies of the newly published media remain available, including archived copies and descendants. The actual pre-addition published course is captured in `scripts/fixtures/c1-rashid-previous.json`.

`node scripts/test-c1-rashid.mjs` checks prerequisites, optional classification, existing and fresh courses, custom order, private copies, progress identity, archives/deletions and historical Undo. Browser checks verify the existing presentation and matching embedded IDs on desktop and phone, using simulated account data and player responses.

Validation passed: TypeScript, ESLint, both Next.js and vinext production builds, curriculum/licensing and historical placement suites, all earlier C1 suites, personal-course/API, progress, account isolation, guest access, theme, protected EPRA and past-paper checks. Desktop, phone and guest checks passed for all three additions; the existing section-watched confirmation also passed on desktop and a 320 px dark-theme phone. Live Google sign-in, Postgres and YouTube playback were not exercised by those browser fixtures.
