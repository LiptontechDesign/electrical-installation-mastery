# Electrical Installation Mastery

A video course with 296 lessons in 25 modules across C2, C1 and Professional pathways, plus a standalone EPRA C1/C2 practice centre.

## Learning experience

- **Home:** guests see the public course overview; signed-in learners see a personal workspace with their current lesson, upcoming videos, bookmarks and progress. A full-width header includes the account initials, progress and sign-out menu.
- **Learn:** 86 sections with embedded videos, watched progress, bookmarks and private notes. Lessons are freely accessible in any order. Core and supplementary videos share continuous numbering that adjusts when reordered.
- **Books:** four complete reference books with chapter search, PDF/text views, zoom, saved pages and personal notes.
- **Practice (`/practice`):** separate C2/C1 pathways, 568 verbatim topic questions, 110 recall questions and two complete mock papers. Topic filters, answer reveals, LaTeX worked solutions, session quizzes, timed/untimed exams, self-assessment and downloadable working. No sign-in required. See [the practice-centre guide](docs/epra-practice-centre.md).
- **Settings:** Google account controls, complete account export/deletion, progress backup/import/reset and playback preferences.

Schema 10 accepts earlier backups and preserves video progress, bookmarks, notes and playback preferences. Learner records synchronize per account.

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

The course is open without sign-in. The public overview includes outcomes, pathway filters and an expandable curriculum. Guests can watch any video and read books; no guest learning records are read from or written to local storage or the database. Google sign-in enables the existing personal progress, notes, bookmarks and course arrangement. Account controls are in the top-right menu; sign-out returns to the public course. Personal data APIs still require an authenticated session. Book/figure content is accessible to guests, while saved reading state remains authenticated.

Node.js 22.13 or newer:

```powershell
npm ci
npm run dev
```

Checks:

```powershell
npm run lint
npx tsc --noEmit
npm run test:curriculum
npm run test:licensing
npm run test:books
npm run test:navigation
npm run test:migration
npm run test:architecture
npm run test:accounts
npm run test:guests
npm run audit:course
npm run build
npx next build
```

`npm run build` validates the existing vinext/Vite target. `vercel.json` uses `npm run test:theme && node scripts/prepare-reader.mjs && npx next build`; verify that target before publishing. Production-like local server: `npx next start -H 127.0.0.1 -p 3001`.

With server credentials configured, browser integration checks should cover Google sign-in, account-scoped state reads, all four PDF ranges, CSRF rejection, private Blob access and an extracted figure.

## Architecture and sources

- `app/video-catalog.json` and `app/course-curriculum.ts`: video metadata and canonical ordering; `scripts/course-baseline.json` protects existing video identities.
- `app/learning-sections.ts` / `.json`: coherent lesson groups, with no pass/fail state.
- `app/learner-state.ts`: schema 10 migration and validation.
- `app/server/auth.ts`: Google OpenID Connect, PKCE/state/nonce validation and signed course sessions.
- `app/server/database.ts`: account-scoped Neon document storage and lifecycle operations.
- `app/book-reader.tsx`: per-account reference book reader.
- `course-transcripts/`: 295 complete transcript sources and one explicitly visual-only lesson; retained as source archives, not published as recap pages.

## Historical cleanup — September 2026

The removal described below predates the explicitly requested standalone practice centre. The new `/practice` route uses only the supplied complete study pack; retired question banks and lesson extras remain removed.

The course now focuses on videos and reference books. The lesson guide, Standards Companion, definitions/glossary, authored lesson explanations, worked-question panels, quizzes, flashcards, mock exams, exam preparation, simulations and module recap books have been removed. Their navigation, search entries, content banks, components, obsolete tests, styles and formula-rendering dependency have also been removed.

Personal notes are learner-written, not built-in teaching text. Original video content and source PDF books are unchanged. Stable video IDs preserve watched progress, notes and bookmarks. Schema 10 discards retired exercise fields when old records are read and on subsequent saves; no blanket deletion of account records was performed.

Superseded Markdown plans/audits were removed to avoid describing features that no longer exist. Their previous versions and the removed code/content are recoverable in Git history. See [the documentation index](docs/README.md) for current implementation notes and [the cleanup record](docs/video-only-cleanup.md) for scope and verification.

## Safety

This course does not grant an electrical licence or authorize regulated work. Kenyan requirements, applicable standards, approved project specifications and manufacturers' instructions govern actual installations. UK book references must not be treated as proof of Kenyan compliance. Practical work requires appropriate competence and supervision.
