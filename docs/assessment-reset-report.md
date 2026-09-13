# Assessment reset and four-book integration
Date: 2026-09-13

## Delivered

The old assessment architecture is retired. No replacement quiz system or EPRA exam has been created. Primary navigation is Home, Learn, Books; Settings retains backup/import/reset and playback preferences. All 296 lessons, their IDs, video IDs, titles, durations and order remain unchanged across 25 modules. All 295 supplied transcripts retain their recorded SHA-256 fingerprints; p04-l03 remains explicitly visual-only.

82 stable LearningSections replace the assessment boundary model while preserving its coherent video groupings and recap provenance. Sections have no scores or completion gates. Required progress and next-required recommendations count C2/C1 videos only. Professional lessons remain independently accessible.

Schema 7 accepts old schema-6 backups and preserves active lesson, watched IDs/counts, notes, bookmarks, reading/lab completion, independent confidence, study-minute history and preferences. It does not copy any quiz/checkpoint passes, scores, attempts, records or flashcard schedules. Practical calculation/fault-investigation evidence is retained; recall and recognition evidence is discarded. Server-side reading state is independent and unchanged.

## Content preservation and removal

Before removal, dependencies were separated into assessment-only files, mixed teaching files and core learning resources. Mixed content was extracted into neutral lesson explanations, supplied teaching and study notes. A final comparison showed zero module/checkpoint question IDs absent from the lesson bank; these were reused questions, not a separate source of unique teaching. An additional 128 standalone explanatory passages from old cards were retained as plain prose. No question options, answer-position indexes, old question IDs, grading algorithm or generator are preserved in those neutral files.

Removed per-video quizzes, module/mastery quizzes, checkpoint rows/workspaces, flashcard review, recall-rating buttons, assessment completion gates, old review dashboards, Toolkit and Progress destinations. Removed 306 unused retired-feature CSS selectors after checking their class usage. Removed old assessment audit/export/review scripts and their generated question-bank audit. Git history remains the recovery path for deleted tracked source.

## Books

All four books use one ReaderWorkspace through the full-page BookWorkspace or the lesson-source dialog wrapper. Existing books, figures, PDF.js rendering, text view, range serving, chapter search, saved pages and shared synchronization remain intact.

Added:
- Guide to the IET Wiring Regulations: 2012 guide to BS 7671:2008+A1:2011, all 290 PDF pages; OCR text layer. Printed page 1 is PDF page 19.
- On-Site Guide: ninth edition, BS 7671:2018+A4:2026, all 258 PDF pages; image scan. Printed page 3 is PDF page 5.

Verified title/edition/contents against the supplied PDFs, representative reading pages and final index pages. The 2012 guide's printed p.265 is PDF 283; the On-Site Guide's printed p.254 is PDF 256. Added edition-specific chapter mappings and source readings. Do not treat the historical guide as current compliance guidance.

Private Blob uploads (no existing assets overwritten):
- `books/iet-wiring-guide-17th-amendment-1-2011.pdf`: 18,573,328 bytes
- `books/iet-wiring-guide-reader-v1.pdf`: 18,331,674 bytes
- `books/on-site-guide-ninth-edition-2026.pdf`: 101,203,998 bytes
- `books/on-site-guide-reader-v1.pdf`: 101,129,952 bytes

Originals and reading copies are outside Git/public assets. Bookmark notes now have an editable field that saves on blur. Browser tests created and removed one temporary bookmark/note in the new On-Site Guide; both new books were left at their covers. Existing books' saved records were not overwritten.

## Verification commands and results

All commands below passed on the completed implementation; affected checks were rerun after final edits.

| Command | Result |
|---|---|
| `npm ci` | Dependencies installed |
| `npm run prepare:reader` | PDF.js assets and complete recap transcripts prepared |
| `npm run lint` | Pass, no lint errors/warnings |
| `npx tsc --noEmit --pretty false` | Pass |
| `npm run test:learning` | Formula models, LaTeX, boundaries and invalid inputs |
| `npm run test:curriculum` | 296 unchanged lessons, 25 modules, formulas and interactive connections |
| `npm run test:licensing` | C2/C1 information, neutral sections, oral preparation, video-only milestones and promoted-video migration |
| `npm run test:tutor` | Every lesson Overview renders, before and after watched; calculations, safety gates, glossary and standards |
| `npm run test:books` | Four books, nine topics, 40 lesson links, bookmark/state merge, ranges and simulations |
| `npm run test:recaps` | 25 recap books, 82 sections, 296 sources, math and reader controls |
| `npm run test:navigation` | Flexible navigation, watched/undo/replay, next lesson, reload, notes |
| `npm run test:migration` | Schema 6 to 7 preservation and malformed/retired-field rejection |
| `npm run test:architecture` | No removed navigation/imports/generator in bundled dependency graph |
| `node scripts/test-supplied-learning.mjs` | 50 supplied teaching entries |
| `npm run audit:course` | Complete unchanged curriculum and section/recap coverage |
| `npm run audit:transcripts` | 295 transcript fingerprints |
| `npm run build` | Existing vinext/Vite target builds |
| `npx next build` | Production Next.js target builds, all routes generated |
| `node --env-file=.env.local scripts/verify-book-access.mjs http://127.0.0.1:3002` | Automatic/renewed sessions, shared state, CSRF rejection, all four private PDF ranges and extracted figure |
| `git diff --check` | Pass |

Browser verification used agent-browser against a local production Next.js server:
- Home and Learn render with Home/Learn/Books navigation.
- Both new PDFs render; desktop and 390px phone reader layouts inspected.
- PDF page navigation and printed-page offset checked (On-Site Guide PDF 125 = printed 123).
- Book position and note survive reload; temporary book bookmark removed afterward.
- Video watched state, lesson note and lesson bookmark survive reload in the isolated browser session.
- Impedance glossary search opens a lightweight term detail rather than Toolkit.
- No application error overlay or recorded browser errors during the checked flows.

Unit/component tests cover all 296 lessons; the browser check sampled representative flows rather than manually playing every video. YouTube playback completion timing and every third-party video were not exhaustively re-tested.

The PDF skill guided complete-copy/visual verification; the storage skill guided private, no-overwrite uploads and range verification; React guidance informed effect/ref cleanup and lazy-loaded teaching/reader components. Browser skills guided live UI verification.

## Intentionally retained

- `overview-answers.ts`: authored explanations, correct conceptual models and rendered mathematical working used by Overview and module recaps. It is not a question generator or scorer.
- `practice-data.ts` / `practice-workspace.tsx`: existing worked calculations, numerical feedback and fictional fault-investigation steps, including safety gates. These are explicitly preserved practice resources, not course completion assessments. Their evidence never awards a checkpoint/exam pass.
- `simulation-activities.ts`: explanatory experiment instructions and models only; old multiple-choice prediction/scoring data was removed.
- Licensing descriptions and oral/practical preparation: informational guidance independent of the removed bank, with no mock written exam.
- Historical documents in `docs/` and the original catalogue-generation parser: provenance only, explicitly identified as historical in README. The parser still recognizes the original source document's “Checkpoint” heading but emits neutral `learningOutcome` copy, not an assessment.
- Migration tests intentionally include retired field names to prove they are discarded.

## Limits and deployment status

No application commit, push or production deployment was performed. The new private book assets are uploaded, but the live application needs this code published before it can show them.

The downloaded environment supplied a Blob token but no usable READER_SESSION_SECRET. Local browser/API testing used a cryptographically random process-only secret; no production secret was changed. Ensure the deployment has a persistent secret of at least 32 characters. This does not establish that the existing production setting is missing—sensitive settings may not be downloadable.

The existing automatic shared-reader design is preserved: private Blob access is not individual website-user authentication. Anyone with website access can use its shared reading state.

Non-blocking toolchain notices remain: react-test-renderer deprecation; Vite chunk-size warning above 500 kB; vinext route-classification/plugin timing notices; npm reported existing dependency advisories. These were not hidden or treated as test failures. Electrical content was preserved rather than re-certified against current law.

## Files deleted

- `app/answer-teaching.ts`
- `app/assessment-data.ts`
- `app/assessment-panel.tsx`
- `app/checkpoint-plan.ts`
- `app/checkpoint-questions.ts`
- `app/checkpoint-workspace.tsx`
- `app/concept-distractors.ts`
- `app/connection-assessments.ts`
- `app/course-editorial-revisions.ts`
- `app/foundation-revisions.ts`
- `app/foundation-vocabulary-revisions.ts`
- `app/integrated-applications-content.ts`
- `app/integrated-deeper-questions.ts`
- `app/integrated-protection-content.ts`
- `app/integrated-safety-content.ts`
- `app/learning-design.ts`
- `app/learning-toolkit.tsx`
- `app/module-two-revisions.ts`
- `app/professional-flashcard-revisions.ts`
- `app/professional-question-revisions.ts`
- `app/question-authoring.ts`
- `app/question-revisions.ts`
- `app/recall-distractors.ts`
- `app/recall-extras.ts`
- `app/retrieval-reveal.tsx`
- `app/simulation-assessments.ts`
- `app/standards-checks.ts`
- `app/supplied-ac-applications.ts`
- `app/supplied-ac-foundations.ts`
- `app/supplied-ac-phasors.ts`
- `app/supplied-assessments.ts`
- `app/supplied-lighting-content.ts`
- `app/supplied-resistance-content.ts`
- `docs/assessment-template-audit.json`
- `scripts/audit-transcript-assessments.mjs`
- `scripts/export-editorial-packets.mjs`
- `scripts/validate-editorial-reviews.mjs`
- `tsconfig.tsbuildinfo` (generated cache; ignored for future builds)

## Files created

- `app/learner-state.ts`
- `app/learning-sections.json`
- `app/learning-sections.ts`
- `app/lesson-explanations.json`
- `app/lesson-study-notes.json`
- `app/simulation-activities.ts`
- `app/study-notes.tsx`
- `app/supplied-teaching.json`
- `scripts/audit-transcripts.mjs`
- `scripts/course-baseline.json`
- `scripts/test-clean-architecture.mjs`
- `scripts/test-learner-state.mjs`
- `docs/assessment-reset-report.md`

## Files materially refactored or updated

- `.gitignore`
- `README.md`
- `app/api/supplementary/route.ts`
- `app/book-assets.json`
- `app/book-reader.tsx`
- `app/book-simulations.tsx`
- `app/books-data.ts`
- `app/course-app.tsx`
- `app/course-curriculum.ts`
- `app/course-data.json`
- `app/course-extension/builders.ts`
- `app/globals.css`
- `app/integrated-content.ts`
- `app/integrated-progress.ts`
- `app/layout.tsx`
- `app/learning-ui.css`
- `app/lesson-overview.tsx`
- `app/lesson-progress.tsx`
- `app/licensing-curriculum.ts`
- `app/licensing-ui.tsx`
- `app/manifest.ts`
- `app/module-recap.tsx`
- `app/module-recaps.ts`
- `app/practice-workspace.tsx`
- `app/reader-mobile.css`
- `app/server/reader-storage.ts`
- `app/supplementary-videos.tsx`
- `app/supplied-content-types.ts`
- `app/supplied-lessons.ts`
- `app/tutor-model.ts`
- `app/tutor-panels.tsx`
- `app/tutor.css`
- `package.json`
- `scripts/audit-course-integrity.mjs`
- `scripts/generate-course-data.mjs`
- `scripts/inspect-recap-sources.mjs`
- `scripts/prepare-book-copies.py`
- `scripts/test-books.mjs`
- `scripts/test-curriculum.mjs`
- `scripts/test-learning.mjs`
- `scripts/test-licensing.mjs`
- `scripts/test-module-recaps.mjs`
- `scripts/test-navigation.mjs`
- `scripts/test-supplied-learning.mjs`
- `scripts/test-tutor.mjs`
- `scripts/upload-books.mjs`
- `scripts/verify-book-access.mjs`
