# Electrical Installation Mastery

A learning workshop with 296 lessons in 25 modules across C2, C1 and Professional pathways. The assessment reset intentionally removes the old quizzes, flashcards and checkpoints without introducing replacement exams.

## Learning experience

- **Home:** continue learning, required-video progress, study minutes and licensing pathway information.
- **Learn:** 82 neutral learning sections, original videos and transcripts, Overview explanations, standards, glossary, book links, worked calculations, fault investigations and personal notes. Lessons remain freely accessible in any order.
- **Books:** four complete books with chapter search, PDF and text views, zoom, page navigation, saved pages/notes, extracted figures and explanatory simulations. Lesson source links reuse the same reader in a dialog.
- **Settings:** browser progress backup/import/reset and playback preferences.

Schema 7 accepts earlier backups (including version 6), retains learning records and preferences, and discards retired assessment scores, passes, attempts and recall schedules. Required progress counts videos only. Book state remains independently synchronized on the server.

## Books and privacy

| Book | Edition | Complete PDF pages |
|---|---|---:|
| Electrical Installation Designs | Fourth, 2013 | 264 |
| Modern Wiring Practice | Fourteenth, 2010 | 352 |
| Guide to the IET Wiring Regulations | BS 7671:2008+A1:2011 guide, 2012 | 290 |
| On-Site Guide | Ninth, BS 7671:2018+A4:2026 | 258 |

Originals, reading copies and extracted figures live in private Vercel Blob, not Git or public assets. The 2026 On-Site Guide is an image scan; use Page view and chapter search. The IET Wiring Guide has an OCR text layer. Older editions are historical references, not current compliance specifications.

Opening Books creates a signed HttpOnly session automatically. **This is a shared reader, not individual authentication:** anyone who can access the website can read books and update shared bookmarks/positions/notes. Private Blob storage protects credentials and prevents direct anonymous Blob downloads; it does not restrict website visitors. Video progress and lesson notes are browser-local.

Server configuration:

- `BLOB_READ_WRITE_TOKEN`, or `BLOB_STORE_ID` with Vercel OIDC.
- `READER_SESSION_SECRET`: at least 32 random characters, never prefixed `NEXT_PUBLIC_`.

Reader operations use ETag checks to avoid replacing another device's concurrent changes. PDF.js assets are prepared automatically before development/build. All complete page counts and exact byte sizes are recorded in the registry.

To prepare/upload one new book, use `scripts/prepare-book-copies.py --book BOOK_ID INPUT_PDF PAGE_COUNT OUTPUT_PDF` and `node --env-file=.env.local scripts/upload-books.mjs --book BOOK_ID ORIGINAL_PDF READER_PDF`. Uploads are private and refuse overwrites. Generated PDFs and manifests belong in ignored `work/`.

## Run and verify

Node.js 22.13 or newer:

```powershell
npm ci
npm run dev
```

Checks:

```powershell
npm run lint
npx tsc --noEmit
npm run test:learning
npm run test:curriculum
npm run test:licensing
npm run test:tutor
npm run test:books
npm run test:recaps
npm run test:navigation
npm run test:migration
npm run test:architecture
node scripts/test-supplied-learning.mjs
npm run audit:course
npm run audit:transcripts
npm run build
npx next build
```

`npm run build` validates the existing vinext/Vite target. `vercel.json` uses `node scripts/prepare-reader.mjs && npx next build`; verify that target before publishing. Production-like local server: `npx next start -H 127.0.0.1 -p 3001`.

With server credentials configured, `node --env-file=.env.local scripts/verify-book-access.mjs http://127.0.0.1:3001` checks session renewal, shared state reads, all four PDF ranges, CSRF rejection, private Blob access and an extracted figure. Its optional `--test-saving` mode refuses to change an occupied store.

## Architecture and sources

- `app/course-curriculum.ts`: canonical ordering; `scripts/course-baseline.json` protects all existing lesson/video identities.
- `app/learning-sections.ts` / `.json`: coherent lesson groups, with no pass/fail state.
- `app/lesson-explanations.json`, `lesson-study-notes.json`, `supplied-teaching.json`: neutral preserved teaching extracted before the old question engine was removed.
- `app/learner-state.ts`: schema 7 migration and validation.
- `app/book-reader.tsx`: shared full-page/dialog reader implementation.
- `course-transcripts/`: 295 complete transcript sources and one explicitly visual-only lesson; all fingerprints are audited.
- `app/knowledge-graph.ts`, `standards-data.ts`, `lesson-terminology.ts`, `practice-data.ts`, toolkit math and visuals remain available for contextual learning.

Earlier documents in `docs/` are historical design/audit records, not the current implementation contract. See the assessment-reset report for the current delivered scope. The obsolete generated question-bank audit has been removed.

## Safety

This course does not grant an electrical licence or authorize regulated work. Kenyan requirements, applicable standards, approved project specifications and manufacturers' instructions govern actual installations. UK book references and illustrative models must not be treated as proof of Kenyan compliance. Practical work requires appropriate competence and supervision.
