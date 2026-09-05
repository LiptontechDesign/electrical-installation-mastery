# Product assessment and learning architecture

Prepared 5 September 2026, before implementation. Baseline: bb6c896.

## Evidence and limits

Inspected the deployed Home, Learn, Toolkit, Progress and Settings; followed an isolated local first-lesson quiz through incorrect and correct answers, a passing result and flashcard reveal. Inspected beginner atomic structure, intermediate earth-fault loop impedance and advanced induction-motor lessons. Observed mobile (390 × 844) and tablet (820 × 1180) layouts, loading states, search results and keyboard/tab implementation. Read the player, persistence, assessment generator, curriculum, reader, calculator and exercise architecture.

This is not a claim that every video was watched, every screen-reader combination was tested, or every error was reproduced. Actual YouTube end/fullscreen timing, long-term retention and supervised practical competence require separate validation. The baseline contains no diagnostic tutor, concept mastery graph or dedicated standards tab to inspect. No locked learning path is implemented. Browser origin localhost:3001 is used for disposable learner tests; pre-existing learner records are not reset.

Sources: both supplied PDFs were opened and their page counts verified (264 and 352). Electrical Installation Designs (2013) has extractable text; Modern Wiring Practice (2010) is scanned. Selected design/protection/testing pages were rendered and visually inspected. Extraction is not a claim of a cover-to-cover scholarly reading. The available local transcript archive contains seven creator-caption records and a 246-video manifest, not all historical transcripts. Existing guides remain retained source material; new supplemental explanations must not be represented as instructor quotations. Exact timestamps must not be invented from un-timed text.

## Decisions

| Area | Decision | Evidence, learner problem and change |
| --- | --- | --- |
| Curriculum and identities | Preserve | 246 lessons, prerequisite-aware ordering and 16 modules already provide a useful route. Preserve all lesson, question and flashcard IDs so backups survive. |
| Navigation and brand | Preserve/refine | Four main destinations are understandable. Keep the navy/copper style and mobile navigation; avoid a cosmetic rebuild. Add focused learning surfaces within this structure. |
| Home | Redesign its purpose | Hero describes course size; primary action always resumes a video. Recommend unresolved difficulty or due review before continuing, and explain the recommendation. |
| Video | Preserve/refine | Embedded playback, fullscreen-aware auto-next and external fallback exist. Completion is activity, not understanding. Use completion to open a short synthesis and retrieval moment. Preserve an explicit optional playback preference. |
| Overview | Refine | Existing concise guides are useful. Prerequisites sit at the bottom, and the learner must assemble disconnected activities. Put orientation, retrieval and a next action near the lesson. |
| Keywords | Expand | Only 24 glossary entries; Ze/Zs share one definition and terms are disconnected from lessons. Add aliases, quantities, units, contrasts and contextual course links. |
| Standards | New capability | Mostly generic notices and historical source warnings. Add versioned provenance, practical meaning, verification and selective Kenyan notes. Never mark a draft as adopted. |
| Quiz | Rethink | An 80% score is labelled “Mastered”; only best scores survive. Some distractors are implausible, such as “It has no effect on [video title].” Preserve legacy practice but call it a recognition check; add actual application and diagnostic evidence. |
| Feedback | Redesign | A wrong atomic-structure answer receives the correct statement; there is no question about the student's reasoning. Offer error reflection, prerequisite links and an alternative representation. Only authored distractor mappings justify a specific misconception inference. |
| Flashcards | Preserve/fix | Recall before reveal and due dates are good. Repeated same-day clicks can inflate intervals; a changing due array can skip cards during a session. Freeze the session, prevent same-day interval inflation and distinguish self-report from independent evidence. |
| Progress | Redesign its meaning | Video completion, self-confidence and best quiz scores are conflated with learning. Separate exposure, recognition, recall, application, standards and diagnostic reasoning. No digital score confers authorisation. |
| Calculators and diagrams | Preserve/expand | Five calculators and existing RCD/cable/motor exercises support cause and effect. Add prediction and faded worked examples without replacing the working tools. |
| Fault finding | New capability | Videos exist, but no learner-controlled investigation. Add bounded cases requiring safe conditions, instrument/test choice, interpretation, corrective action and verification. |
| Search | Expand | Searches titles, guides and glossary text; cannot retrieve activity or standards context. Prioritise exact term matches and include practice, standards and personal mistakes. |
| Notes and books | Preserve/refine | Valuable personal reference system. Book state is shared by all site visitors; do not describe it as private individual storage. Keep reader infrastructure and distinguish local lesson notes. |
| Mobile and accessibility | Refine | Mobile layout is usable, but search loses its accessible name when text hides. Dialogs need focus containment and restoration. Maintain keyboard-operated activities, text alternatives, reduced motion and large controls. |
| Loading/errors/data | Refine | Storage writes can throw; corrupt data can be overwritten; imports accept arbitrary objects. Preserve unreadable data, validate backups, and report unsaved changes. |
| Gamification | Remove misleading claims | Remove one-attempt “mastery” labels, retain informative evidence and encouraging feedback. No new points, streak pressure or rewards for clicking. |

## New architecture

Keep the course catalogue and add a deterministic, inspectable learning layer: lesson → existing guide concepts → prerequisite lesson links → relevant terms → authored practice/standards → evidence. Record attempts with concept, dimension, result, source and time; self-rated recall is different evidence from an independently answered calculation. A later mistake must affect the next recommendation even if a best quiz score is high. Delayed successful retrieval is evidence of retention; immediate repetition is not.

Every lesson receives an orientation, a retrieve-before-reveal prompt from its guide, linked concepts and prerequisites, a consolidation experience, and learning evidence. Selected authored activity families cover core circuit calculations, protection, earthing, test interpretation, motor control, design and professional reasoning. Match activities to real lesson content, not module membership alone. Do not pretend a generic question is a bespoke assessment for an unrelated lesson.

The guided tutor is an authored diagnostic flow. It does not impersonate an LLM or claim to interpret arbitrary prose. An AI service is optional: adding one requires source retrieval, grounded citations and a configured provider. The first implementation should work without sending learner history or the supplied books to an external model.

Standards metadata includes organisation, identifier, edition, status, jurisdiction, publication/effective dates where verified, last checked date and source. Kenya legal authorisation is a separate layer from BS/IEC technical teaching. Draft KEBS material is useful as a development signal, never proof of adoption. Unverified clauses/limits are not filled with guesses.

## Priority and validation

Prioritise learning impact × reach × pain × safety relevance, divided by implementation effort. Multiplying by cost, as suggested in the brief, would incorrectly favour expensive work.

1. Preserve data and correct misleading evidence; make review reliable.
2. Connect every lesson to retrieval, terms, prerequisites and a next action.
3. Add standards provenance and cross-course applied/diagnostic practice.
4. Refine Home, Progress, search and accessible interactions.
5. Test migration, repeated mistakes, delayed reviews, numeric/unit boundaries, scenario safety gates, keyboard flow and mobile/tablet/desktop layouts.

Learning superiority cannot be established by a passing build. Evaluate representative novice and experienced learners on unseen transfer problems immediately and after 7/30 days; compare with equal-time video-only study. Track misconception correction and safe reasoning rather than watch time. Teacher review of new technical content and observed practical assessments remain necessary for professional competence.

## Primary research ledger

- IET, [edition checker](https://electrical.theiet.org/bs-7671-18th-edition-wiring-regulations/ensure-you-are-up-to-date-with-bs-7671/): A4:2026 published; previous edition transition ends 15 October 2026. Checked 2026-09-05.
- IEC, [60364-6:2016 catalogue](https://webstore.iec.ch/en/publication/24656): second edition, publication 2016-04-27; initial/periodic verification. Catalogue checked; full standard not supplied.
- Kenya Law, [Energy Act](https://new.kenyalaw.org/akn/ke/act/2019/1/eng%402022-12-31), sections 148–151; EPRA [regulations](https://www.epra.go.ke/regulations) and [business processes](https://www.epra.go.ke/business-process). Source availability and exact scope must be recorded; do not infer UK law applies in Kenya.
- KEBS, [DKS 662-6:2025 public-review draft](https://www.kebs.org/wp-content/uploads/2026/03/DKS-662-6-2025-PRD.pdf): draft only. No adoption claim.
- HSE, [GS38](https://www.hse.gov.uk/pubns/books/gs38.htm): UK equipment/safe-testing guidance, fourth edition 2015; engineering teaching reference, not Kenyan legislation.
- IET, [minimising unnecessary live testing](https://electrical.theiet.org/wiring-matters/years/2025/105-may-2025/minimizing-unnecessary-live-testing-for-initial-verification/) and [loop values and temperature](https://electrical.theiet.org/wiring-matters/years/2024/100-may-2024/why-are-the-values-of-maximum-earth-fault-loop-impedance-different/): distinguish circuit resistance, external impedance and temperature assumptions.
- IES/What Works Clearinghouse, [Organizing Instruction and Study](https://ies.ed.gov/ncee/wwc/PracticeGuide/1): spacing, retrieval, worked examples and linked graphical/verbal representations. Supports the design approach, not a claim of measured outcomes for this app.
