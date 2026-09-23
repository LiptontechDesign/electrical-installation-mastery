# Electrical Installation Mastery

A learning workshop with 296 lessons in 25 modules across C2, C1 and Professional pathways. The assessment reset intentionally removes the old quizzes, flashcards and checkpoints without introducing replacement exams.

## Learning experience

- **Home:** continue learning, required-video progress, study minutes and licensing pathway information.
- **Learn:** 82 neutral learning sections, original videos and transcripts, Overview explanations, standards, glossary, book links, worked calculations, fault investigations and personal notes. Lessons remain freely accessible in any order.
- **Books:** four complete books with chapter search, PDF and text views, zoom, page navigation, saved pages/notes, extracted figures and explanatory simulations. Lesson source links reuse the same reader in a dialog.
- **Settings:** Google account controls, complete account export/deletion, progress backup/import/reset and playback preferences.

Schema 9 accepts earlier backups, retains learning records and preferences, and discards retired assessment scores, passes, attempts and recall schedules. Required progress counts videos only. All learner-owned records are synchronized per account.

## Books and privacy

| Book | Edition | Complete PDF pages |
|---|---|---:|
| Electrical Installation Designs | Fourth, 2013 | 264 |
| Modern Wiring Practice | Fourteenth, 2010 | 352 |
| Guide to the IET Wiring Regulations | BS 7671:2008+A1:2011 guide, 2012 | 290 |
| On-Site Guide | Ninth, BS 7671:2018+A4:2026 | 258 |

Originals, reading copies and extracted figures live in private Vercel Blob, not Git or public assets. The 2026 On-Site Guide is an image scan; use Page view and chapter search. The IET Wiring Guide has an OCR text layer. Older editions are historical references, not current compliance specifications.

The course uses Google OpenID Connect for identity and a signed, HttpOnly course session. Google access and refresh tokens are not retained. Every database document has a composite `(user_id, document_type)` key, so progress, lesson notes, course ordering, supplementary videos and reading records are isolated between learners. A first sign-in imports the old browser-local progress once; subsequent changes synchronize across devices. Book files stay in private Blob storage and are served through the course's public, read-only content endpoints; personal reading records remain protected.

Server configuration:

- `BLOB_READ_WRITE_TOKEN`, or `BLOB_STORE_ID` with Vercel OIDC.
- `DATABASE_URL` (or `POSTGRES_URL`): Neon Postgres connection string.
- `AUTH_SECRET`: at least 32 random characters, never prefixed `NEXT_PUBLIC_`.
- `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`: Google OAuth web client credentials.
- `ADMIN_EMAIL`: administrator email; production uses `liptontechdesign@gmail.com`.
- `NEXT_PUBLIC_SITE_URL`: canonical site origin, without a trailing slash.

Database tables are created idempotently on the first authenticated request. PDF.js assets are prepared automatically before development/build. All complete page counts and exact byte sizes are recorded in the registry.

To prepare/upload one new book, use `scripts/prepare-book-copies.py --book BOOK_ID INPUT_PDF PAGE_COUNT OUTPUT_PDF` and `node --env-file=.env.local scripts/upload-books.mjs --book BOOK_ID ORIGINAL_PDF READER_PDF`. Uploads are private and refuse overwrites. Generated PDFs and manifests belong in ignored `work/`.

## Run and verify

The course is open without sign-in. The public overview includes outcomes, pathway filters and an expandable curriculum. Guests can watch any video, read books and use practice; no guest learning records are read from or written to local storage or the database. Temporary practice answers disappear on reload. Google sign-in enables the existing personal progress, notes, bookmarks and course arrangement. Account controls are in the top-right menu; sign-out returns to the public course. Personal data APIs still require an authenticated session. Book/figure content is accessible to guests, while saved reading state remains authenticated.

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
npm run test:accounts
npm run test:guests
node scripts/test-supplied-learning.mjs
npm run audit:course
npm run audit:transcripts
npm run build
npx next build
```

`npm run build` validates the existing vinext/Vite target. `vercel.json` uses `node scripts/prepare-reader.mjs && npx next build`; verify that target before publishing. Production-like local server: `npx next start -H 127.0.0.1 -p 3001`.

With server credentials configured, browser integration checks should cover Google sign-in, account-scoped state reads, all four PDF ranges, CSRF rejection, private Blob access and an extracted figure.

## Architecture and sources

- `app/course-curriculum.ts`: canonical ordering; `scripts/course-baseline.json` protects all existing lesson/video identities.
- `app/learning-sections.ts` / `.json`: coherent lesson groups, with no pass/fail state.
- `app/lesson-explanations.json`, `lesson-study-notes.json`, `supplied-teaching.json`: neutral preserved teaching extracted before the old question engine was removed.
- `app/learner-state.ts`: schema 7 migration and validation.
- `app/server/auth.ts`: Google OpenID Connect, PKCE/state/nonce validation and signed course sessions.
- `app/server/database.ts`: account-scoped Neon document storage and lifecycle operations.
- `app/book-reader.tsx`: per-account full-page/dialog reader implementation.
- `course-transcripts/`: 295 complete transcript sources and one explicitly visual-only lesson; all fingerprints are audited.
- `app/knowledge-graph.ts`, `standards-data.ts`, `lesson-terminology.ts`, `practice-data.ts`, toolkit math and visuals remain available for contextual learning.

Earlier documents in `docs/` are historical design/audit records, not the current implementation contract. See the assessment-reset report for the current delivered scope. The obsolete generated question-bank audit has been removed.

## Safety

This course does not grant an electrical licence or authorize regulated work. Kenyan requirements, applicable standards, approved project specifications and manufacturers' instructions govern actual installations. UK book references and illustrative models must not be treated as proof of Kenyan compliance. Practical work requires appropriate competence and supervision.
