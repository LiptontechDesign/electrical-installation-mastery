# Electrical Installation Mastery

A mobile-friendly, self-paced electrical installation course designed around long-form UK teaching videos and practical Kenyan residential and light-commercial context.

**Live course:** [electrical-installation-mastery.vercel.app](https://electrical-installation-mastery.vercel.app/)

## What has been built

- **246 sequenced video lessons across 16 modules:** the existing 239 lessons plus seven targeted additions; safety, three-phase theory, motors, calculations and verification now follow a clearer dependency order. See [the course review](docs/COURSE_FLOW_REVIEW.md).
- **Embedded YouTube learning:** lessons play inside the course without requiring a separate playlist or paid video hosting.
- **Reliable optional auto-next:** a completed video is marked finished and the next lesson loads after a five-second countdown. The learner can cancel, select another lesson or switch auto-next off. Fullscreen playback is handled without removing the active player unexpectedly.
- **Lesson teaching guides:** every video has a concise summary, key concepts, points to remember and practical connections.
- **Lesson-specific retrieval practice:** 1,580 flashcards and 1,580 quiz questions include new worked applications. Optional explanations and three interactive exercises appear inside the existing Overview tab.
- **Lesson and module mastery:** flashcard review, instant quiz feedback, saved best scores, an 80% mastery target and spaced-review due dates.
- **Learning workspace:** searchable lessons, concise lesson overviews, interactive formula diagrams with KaTeX, glossary, bookmarks, personal notes, confidence ratings and progress reporting. Navigation is limited to Home, Learn, Toolkit and Progress; lessons have Overview, Quiz, Flashcards and My notes tabs, and module quizzes and due flashcards open from Progress.
- **Local-first progress:** learning records stay in browser storage and can be exported or restored as a JSON backup.
- **Responsive interface:** the course navigation, video lesson, practice tools and progress views adapt for desktop and phone use.
- **Book reader:** two complete reference books and eight extracted illustrations in private Vercel Blob storage. My books opens automatically and includes chapter search, PDF page navigation, zoom, saved pages and book notes. Devices share the same reading state without entering a key.
- **Phone reading:** full-screen reader, safe-area spacing, larger touch controls, persistent bottom page navigation and fit-to-width pages. Page zoom reaches 300%; Text view offers adjustable, wrapping text wherever the source PDF has selectable text. Scanned pages remain available in Page view. Rendered canvases are limited to four million pixels to reduce memory pressure.
- **Reading companions:** nine carefully mapped topics connect 39 lessons to precise book pages. RCD current balance, cable-route conditions and motor holding contacts have interactive models, also available after revealing relevant quiz and flashcard answers.
- **My books → Simulations:** four guided activities explore current balance, cable capacity, voltage drop and motor control using those models. Each has a prediction check and exact source-page links. Matching book pages link back to the relevant simulation. The RCD model has an adjustable protective-path current and animated current paths, with reduced-motion support.

## Books on Vercel

The PDFs and extracted images are stored in a **private** Blob store, outside Git and the public website assets. Opening My books automatically creates a signed, HttpOnly session; no reader key or account is required. This is a shared reader: anyone using the website can read the books and access or update the same book positions, bookmarks and notes. Private storage keeps Blob credentials on the server; the automatic session is not an identity check. Bookmarks and reading positions use small operations with ETag checks so simultaneous changes on different devices do not replace the whole reading record. Video progress and lesson notes retain their existing browser storage.

Required server variables:

- `BLOB_READ_WRITE_TOKEN` from the connected private store, or `BLOB_STORE_ID` with Vercel OIDC.
- `READER_SESSION_SECRET`: a separate random secret of at least 32 characters. Changing it invalidates existing reader sessions.

Never expose these variables with a `NEXT_PUBLIC_` prefix. Sessions last 30 days and renew automatically whenever My books opens, including after a session expires. No secret is hardcoded in the browser, and `READER_ACCESS_KEY_SHA256` is no longer required. There are no individual user accounts.

`scripts/prepare-book-copies.py` creates reading copies with compact PDF object indexes using pikepdf. All 264 / 352 pages are retained; source originals remain in the private store. The optimized indexes prevent the scanned book from downloading every page image just to open the document. `app/book-assets.json` records the exact file sizes required for range reads.

`scripts/upload-books.mjs` uploads the two supplied PDFs, optional prepared illustrations and reading copies with private access, fixed paths and size checks. `scripts/prepare-reader.mjs` copies matching PDF.js worker, font and decoder assets before the Vercel build. Generated PDF.js assets, credentials, source books and local research outputs are excluded from Git and from deployment uploads. The reader downloads at most two sections at once and retries temporary transfer failures.

Validation:

```sh
npm run prepare:reader
npm run test:learning
npm run test:books
npx next build
node --env-file=.env.local scripts/verify-book-access.mjs https://electrical-installation-mastery.vercel.app
```

The access check verifies opening without a key, replacement of an invalid session, shared state access, CSRF rejection, PDF ranges, private Blob access and an extracted figure without changing reading progress. The optional `--test-saving` flag is only for an unused store; it checks concurrent updates from two independent sessions and then removes its temporary test progress.

These books describe historical UK requirements. The lesson source panels explain that context and direct learners to current authorities. The interactive cable values are illustrative, and the models do not certify a real installation. Chapter-title search works for both books; the scanned book has no selectable page text.

## Curriculum

The learning path begins with electrical principles and progresses through:

1. Electrical foundations
2. Building electrical systems
3. Practical wiring and terminations
4. Containment, cables and installation methods
5. Protection, earthing and fault paths
6. Electrical design and calculations
7. Three-phase systems and distribution
8. Inspection, testing and commissioning
9. Fault finding and maintenance
10. Complete installation workflows
11. Socket outlets, fixed appliances and domestic loads
12. Lighting design, LED systems and lighting controls
13. Smart homes, data, CCTV, access control and electric fencing
14. Solar PV, batteries, generators, UPS systems and EV charging
15. Pumps, water heating, HVAC, fire detection and building services
16. Tools, quotations, documentation, handover and professional practice

Kenyan applications include stone and brick construction, concealed conduit, reinforced slabs, gypsum ceilings, modern lighting layouts, outdoor and compound systems, backup power and future-ready services.

## Assessment design

Each lesson follows a simple learning loop:

1. Watch the complete video.
2. Review the lesson summary and key concepts.
3. Answer concise flashcard questions from that lesson.
4. Complete the lesson quiz and read the answer feedback.
5. Continue automatically or choose another lesson.
6. Complete a larger mastery review at the end of the module.

The assessment generator requires at least three lesson-specific concepts and builds distinct recall, application, safety and Kenya-compliance checks. The transcript audit verifies that every lesson has a matching teaching guide and that its learning content is grounded in the archived transcript vocabulary. One visual-only lesson is explicitly recorded rather than treated as spoken narration.

Run the course-wide assessment audit with:

```powershell
npm run audit:transcripts
```

September 2026 verified coverage:

- 246 unique videos, 16 modules and complete lesson-guide/assessment coverage
- All 239 original lesson and flashcard identities preserved
- Seven new videos checked against publicly indexed creator captions and metadata
- 1,580 flashcards
- 1,580 quiz questions
- 0 generic title-based recall prompts
- 0 overlong flashcard questions or answers

The transcript archive is maintained outside this repository. The historical archive was unavailable in the September review checkout; this review does not claim a fresh full-course transcript audit. Run `node scripts/audit-transcript-assessments.mjs --new-only` to explicitly audit the seven new caption records. The default command remains strict and requires all 246 archived records. Vocabulary overlap is an evidence-coverage check, not proof of technical accuracy. Original guides and the current author/manufacturer references are reviewed separately; copied captions are not published by the site.

## Safety and standards

This is an educational course, not an electrical licence or authorisation to undertake regulated work. Current Kenyan law, EPRA and utility requirements, applicable KS/IEC standards, the approved project specification and the equipment manufacturer's instructions take priority. UK videos and BS 7671 material are teaching references and must not be assumed to establish Kenyan compliance automatically.

## Project structure

- `app/course-data.json` — validated catalogue for the original 161 lessons.
- `app/course-extension/` — modular definitions for the advanced curriculum.
- `app/course-extension-data.ts` — combines and validates extension modules.
- `app/course-curriculum.ts` — canonical ordering, module descriptions and totals used by the website and audits.
- `app/course-gap-data.ts` — seven accepted video additions and original guides.
- `app/lesson-connections-data.ts` — concise calculation and concept explanations with primary sources.
- `app/lesson-connection.tsx` — optional explanations and interactive learning exercises.
- `scripts/test-curriculum.mjs` — progress-identity, prerequisite, assessment and exercise checks.
- `app/lesson-guides-*.json` — lesson-specific summaries and core concepts.
- `app/assessment-data.ts` — flashcard and quiz construction and quality rules.
- `app/assessment-panel.tsx` — lesson and module practice interface.
- `app/course-app.tsx` — course navigation, player, progress and learning tools.
- `docs/ASSESSMENT_SOURCE_MAP.md` — assessment pedagogy, source hierarchy and Kenyan regulatory guardrails.
- `scripts/audit-transcript-assessments.mjs` — full transcript-to-assessment coverage audit.
- `scripts/generate-course-data.mjs` — rebuilds and validates the original curriculum catalogue.

## Run locally

Requirements: Node.js 22.13 or newer.

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:3000/` in Chrome. For a production check:

```powershell
npm run audit:transcripts
npx next build
npx next start
```

## Deployment

The production application is hosted on Vercel. The repository includes `vercel.json` and the Next.js configuration needed for deployment. After linking the repository to a Vercel project, pushes to the production branch can deploy automatically; a manual production deployment can also be created with:

```powershell
npx vercel deploy --prod
```

## Updating the course

Add advanced lessons through the appropriate file in `app/course-extension/`, add a matching lesson guide, and preserve every existing lesson ID so saved progress remains valid. Before publishing a content change, run:

```powershell
npm run audit:transcripts
npx next build
```
