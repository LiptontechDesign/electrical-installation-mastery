# Module recap books and course audit

## Delivered

- Sixteen HTML recap books, organised into 68 short thematic chapters.
- Two-page desktop spreads, previous/next controls, a contents menu, keyboard navigation, and a print/save-PDF view containing the whole selected module.
- On narrow screens each chapter stacks to preserve legibility; pagination remains available. Content can scroll within a chapter rather than being clipped or squeezed into unreadable type.
- Entry points at the end of every module’s lesson list, on its last lesson, and from its final checkpoint.
- Source-video links for every chapter. All 276 canonical lessons occur exactly once in the chapter mapping. Reading does not award lesson, quiz or checkpoint completion.
- Recap content loads on demand. Opening pauses the current player and cancels pending automatic next-lesson navigation.
- The course map now groups lessons into the same 68 collapsible topic groups, showing watched counts. Stable lesson IDs, checkpoint boundaries, sequence and learner records are preserved.
- Optional terminology bridges in the post-video overview connect alternative names and distinguish related but different quantities.

## Source scope and limitations

The recap prose is individually written thematic synthesis, not a generated question-answer template. Transcript excerpts across the lesson groups, existing transcript-grounded lesson material and targeted passages informed the synthesis. This is **not** a claim that every transcript sentence has received a new line-by-line editorial review or that each chapter reproduces every detail in its videos.

The source manifest contains 275 text transcripts and one visual-only lesson (`p04-l03`). That exception is explicitly labelled. The provenance export verifies transcript fingerprints after normalising Windows line endings; fingerprints establish source identity, not semantic accuracy. Chapter source links establish group-level provenance, not sentence-level quotations or timestamps.

The recaps do not promote video-era regulations into current local instructions. They include appropriate boundaries for safety-sensitive demonstrations, and are revision support rather than a work procedure or proof of competence.

## Duplicate-course findings

`course-integrity-audit.json` records the complete inventory and exact-match audit:

- 276 lessons in 16 modules.
- No repeated canonical lesson IDs, video IDs or normalised lesson titles.
- Thirteen similar-title pairs were reviewed as candidates, not automatically deleted. They concern different quantities measured with one instrument, distinct power-formula rearrangements, star versus delta and their combined worked example, diagram versus physical wiring, successive worked examples, introduction versus resolution, or consecutive tutorial parts.
- Therefore no source video was removed. References from recaps, search or cumulative practice point back to the same canonical lesson; they are not extra course entries.

## Assessment audit — remaining work is explicit

The audit originally identified 63 repeated question-stem groups, 63 repeated flashcard-front groups and one literal answer-leak case.

Eleven core questions now have individually written contextual stems, plausible distractors, misconception-specific feedback and follow-up retrieval. Linked flashcards are synchronised. The faulty authoring rule that inserted a correct answer into a stem was removed.

The current audit finds **59 repeated question-stem groups and 59 repeated card-front groups**, all glossary or standards items. There are no remaining repeated core stems under this exact-match check and no remaining literal answer matches above the check’s threshold. Neither result proves the absence of semantic duplication, subtle clues or all editorial weaknesses.

The remaining inherited repetition has **not** been “fixed” by adding lesson titles or swapping synonyms around a template. Removing those items would also change assessment coverage and progress denominators. A full individually authored replacement of the inherited glossary/standards questions remains an editorial backlog; the course is not represented as entirely template-free.

## Flow decision

Use short topic groups within the established modules, rather than moving hundreds of lessons and invalidating familiar navigation or progress. Each group builds toward its existing checkpoint and has a matching recap chapter. Foundations still lead into application, installation, testing and specialist systems. Deliberate subsequent applications of a concept are retained; they are not duplicate videos.

## Verification

- `test-module-recaps.mjs`: all chapter mappings and transcript fingerprints, print source coverage, navigation and bounds, keyboard controls, scroll restoration, unchanged completion, vocabulary bridges and all eleven linked question/card revisions.
- Existing curriculum, tutor, learning, supplied-content and free/guided navigation suites.
- TypeScript and production builds.

No browser visual audit or actual PDF output inspection is claimed. Print output uses the browser’s print/save-PDF facility; pagination can vary by paper size and printer settings.
