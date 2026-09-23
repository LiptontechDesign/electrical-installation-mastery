# Video-focused course cleanup

Implemented 23 September 2026 at the owner's request.

## Retained

- 296 canonical videos, their stable IDs, titles, YouTube links and order.
- 25 modules and 86 sections across C2, C1 and Professional pathways.
- 32 bundled supplementary entries, plus each account's personal supplementary videos.
- Continuous per-module numbering across core and supplementary videos, recalculated after moves.
- Embedded playback, next-video navigation, watched/undo controls and optional automatic advancement.
- Google sign-in, private progress, bookmarks, learner-written notes, course arrangement and account lifecycle controls.
- Four original reference books, PDF/text reading, chapters, extracted source figures, saved pages and reading notes.
- Free guest access to videos/books without saving guest learning records.

## Removed

The lesson guide and Standards Companion tabs; authored definitions, glossary entries, explanations and worked-question panels; quizzes, flashcards, exam preparation and mock-exam interfaces; interactive simulations; module recap books and their generated public transcript assets.

Removal covers navigation, search results, home links, content banks, components, associated styling, obsolete tests/scripts and the unused formula-rendering dependency. The video catalogue now contains video metadata rather than embedded lesson-guide/question data. Original video content, original PDF text and privately written notes were not edited.

Generated recap assets in the local public directory were moved into ignored work storage so they cannot be served or deployed. Removed tracked files remain recoverable in Git history.

## Saved data

Learner schema 10 whitelists video progress, notes, bookmarks, study time, completion counts and playback preferences. Older supported backups migrate without changing video IDs. Retired exercise fields are discarded during normalization and subsequent saves. This release does not perform a blanket database purge or delete accounts.

Ordering, supplementary videos and reading state retain their separate account-scoped records. Guests do not load or write personal data. The move confirmation now correctly describes personal, not shared, ordering.

## Verification

Validated with TypeScript, lint, the Next.js production build, and the curriculum, licensing placement, course-order, drag-model, supplementary, navigation, guest-access, learner-migration, books, account-isolation, architecture and theme checks.

The curriculum baseline checks protect every original video identity, title, duration and URL. Theme checks cover 64 declared light/dark contrast pairs. No computer-use or browser automation was used for this cleanup, as requested. These checks do not claim a new end-to-end Google-login or visual browser audit.
