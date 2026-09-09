# Practical assessment editorial pass

## Implemented in this pass

- Module 16: all 18 canonical lesson questions and 21 independent flashcards rewritten; the three overview retrievals use the same revised content.
- Four book-simulation questions rewritten with four choices and choice-specific feedback.
- Stable lesson, question and card IDs retained. Existing records are not reset; past success on an older item is historical evidence, not proof of success on its revised wording or objective.
- Module and checkpoint selections reuse the canonical lesson questions and therefore receive these revisions.

## Evidence

The complete plain-text transcript sections were read for:

- `course-transcripts/transcripts/244-KceE8zdk35g.txt`: thermal signatures, loading, complementary measurements, reporting, harmonics, emissivity discussion.
- `course-transcripts/transcripts/245-GT_wTybt6Ao.txt`: quotation visit, photographs, mental method statement, materials, lead time, allowance, written quotation and extras.
- `course-transcripts/transcripts/246-ntAHKvT5pFg.txt`: rewire survey, point schedule, occupancy, retained wiring, labour estimate and supporting costs.

Thermal clarification corroborated against Fluke's [emissivity application note](https://media.fluke.com/72dfc488-720f-4223-a098-b10600670289_original%20file.pdf) and [electrical-inspection guidance](https://www.fluke.com/en/learn/blog/thermal-imaging/electrical-systems). The electrical square law concerns resistive power at fixed resistance, not multiplication of a Celsius temperature. No numerical acceptance limit was added.

Simulation content follows the explicit models in `app/experiment-models.ts`, not a live-work procedure. Installation examples are bounded educational applications; no current price or universal regulation is inferred from a historical video.

## Remaining

Modules 01–15 still require this course-wide editorial pass. Earlier bespoke revisions remain intact but have not all been re-reviewed in this pass. The exported inventory contains 1,650 canonical questions and 1,926 cards. Do not describe the whole course as completely rewritten, unique or fully audited on the basis of this change.

Parallel agents were stopped at the user's request. No agent editorial output was integrated.

TypeScript compilation passed before the user requested no further testing. Further tests were explicitly skipped. The deployment build is separate from an assessment-content audit.
