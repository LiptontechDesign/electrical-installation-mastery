# Personal course ordering

Signed-in learners can arrange their own course map. Changes belong to the authenticated account; guests use the published arrangement without tracking.

## Interaction

A compact **Add video** control is always available in the course map. Every video has a **More actions** menu with **Move to…**, **Add video after**, **Archive video** and **Delete permanently…**. Supplementary entries also offer **Edit details**. Section add controls work even when a section is empty.

**Archive video** removes a published or supplementary video from that learner's active course while keeping its identity, notes and progress. **Archived videos** in the course menu lists both types and offers **Restore…** to any section. Archived videos can also be permanently removed from this list.

**Delete permanently…** opens a confirmation showing the video title, with Cancel initially focused. It removes the entry from the signed-in account's course and archive, clears its saved Undo details and cannot be undone or restored from the archive. This changes course membership; saved notes and progress remain in the account. A learner can deliberately paste the URL into Add video again. Published lessons retain their original identity and metadata when explicitly added again. Default merging never revives a permanently removed entry.

All removals use the authenticated account ID on the server. Other learners and guests keep their own courses. The playing video moves to a remaining neighbour when removed; empty courses retain their section destinations and show a selection/restore prompt.

**Move to…** opens a searchable destination picker with pathway/module browsing and exact insertion positions. The preview shows the resulting lesson numbers. Videos move independently by default. Where a legacy supporting sequence exists, an explicit checkbox lists the videos that can move together.

**Organise** reveals drag handles and bulk watched controls. Mouse, touch hold, and keyboard dragging share the same placement model. Dropping saves once and offers **Undo**; Escape cancels without saving. The precise move dialog is also usable entirely by keyboard or touch without dragging. A saved move highlights its destination and keeps the current video selected.

Undo is available from the latest-change message and course menu during the current session. It reverses the affected items while preserving unrelated edits. If the same video has changed again, the older change cannot be undone over that newer edit. Undoing an addition archives it, preserving its notes and progress.

## Placement and numbering

Core and supplementary videos share explicit section membership and a continuous L1, L2, L3 sequence within each module. Any video can move between sections, modules and pathways, including empty destinations. Display numbers are derived from the visible order; archived and deleted entries are excluded from rows, counts, search and playback navigation. Stable lesson and YouTube IDs preserve watched records, notes, bookmarks and playback positions.

The map, overview, Home, search, progress counts, Previous/Next and automatic advancement use the same mixed sequence. Every active video contributes to section, module and overall completion, including optional and supplementary entries. Moves update source and destination totals without changing overall progress.

## Persistence and migration

`/api/personal-course` requires authentication, same-origin writes and validated operations. A single version-2 `personal-course` document contains both catalogue and placement, keyed by account ID. Postgres compare-and-swap writes atomically reject stale revisions. An operation receipt makes retries idempotent, including a disconnected response after a successful save. Conflict responses load the latest arrangement for review; failed forms keep their details.

Optional `archivedLessonIds` and `deletedIds` fields preserve removed membership in existing version-2 documents without a database migration. Deleted IDs block default merging, and deletion receipts have no Undo. Published course data and source archives stay shared; removal changes only the account's current arrangement. Retained legacy records and learning records remain available in account exports.

The [earthing/ADS teaching update](earthing-ads-learning-order.md) uses a `curriculumRevision` marker. Revision 2 repairs known ADS/calculation lessons still in the obsolete combined groups, including reordered groups skipped by the first update. Introductory mixed order, placements in other destinations, removals and operation receipts remain intact. Reading performs no write; the next successful edit persists the marker. Later personal moves are not remigrated.

Accounts without this document are read from their existing `course-order` and `supplementary` records. Migration preserves the legacy visible order, archived entries and stable identities. The first successful edit saves version 2. Legacy documents remain available for recovery and account export. Legacy GET endpoints project the new document; legacy POST endpoints request a reload so older tabs cannot save incompatible changes. No manual database migration is required.

Implementation: `app/personal-course-model.ts`, `app/course-order.tsx`, `app/personal-course-editor.tsx`, `app/course-editor-actions.tsx`, `app/course-drag-context.tsx`, and `app/server/personal-course-store.ts`.

## Verification

- `npm run test:personal-course`: migration, mixed placement, numbering, grouped moves, undo, identity, duplicates and request validation.
- `npm run test:personal-course-api`: actual route/store code with deterministic database fixtures; authentication, CSRF, isolation, concurrency, retries and storage failure.
- `npm run test:personal-course-browser`: desktop/mobile add, move, archive, restore, failure recovery and guest isolation.
- `npm run test:personal-course-removal-browser`: actual course components/styles in a local UI harness with simulated accounts; desktop/mobile delete confirmation, cancel/Escape, archive/restore, failed saves, reload, empty courses and guest isolation. It needs no authentication credentials and does not connect to live storage.
- `npm run test:personal-course-interactions`: drag cancellation/save/undo, keyboard movement, mixed auto-next and disconnected-response recovery.
- `npm run test:course-experience`: playback resume, timestamp notes, bookmarks and layout regression coverage.

Browser tests require a local server on port 3001 with fixture auth configuration (see `scripts/personal-course-browser-fixture.mjs`). They mock API storage and the YouTube player; they do not verify a live Google session, live Postgres or YouTube playback. Legacy model suites remain useful for migration compatibility.

### Local verification, 29 September 2026

Both the Next.js production build and the vinext/Vite build passed. The Vite App Router dependency `@vitejs/plugin-rsc` is now explicitly declared at the version already in the lockfile, so clean installs include it. Lint, TypeScript, theme contrast checks, model/API tests, desktop/mobile browser tests, conflict tests and playback regression checks passed. `npm run test:personal-course-conflicts` covers stale-tab recovery, duplicate guidance and mobile dialog dismissal.

The two build tools generate different `.next/types/routes.d.ts` shapes. If running standalone TypeScript after the Vite build, run `npx next typegen` first. This is generated tooling output, not application state.

The browser suites use a local Next server with `AUTH_SECRET=local-preview-only-0000000000000000000000`, `AUTH_GOOGLE_ID=local-fixture` and `AUTH_GOOGLE_SECRET=local-fixture`. All storage and player responses are intercepted by the fixtures. Never use those test credentials in production. Live account sign-in, actual Postgres persistence and real YouTube embedding remain deployment integration checks. No live account data was changed or application deployed by this implementation.

### Private removal verification, 30 September 2026

Model and API checks cover published/supplementary removal, persistence through default merging, archive/restore, Undo protection, explicit re-addition, stale writes, failed saves, idempotent retries and account isolation. Supplying another user's ID does not select that account; the authenticated server session determines ownership. The credential-free local browser harness passed desktop and mobile confirmation/cancel, restore, current-player navigation, permanent removal after reload, preservation of study data, empty-course rendering and guest checks. Production Next.js build, lint, TypeScript, theme and course placement checks passed. These checks use simulated accounts and storage; they do not perform removal against live learner data.

### Compact rows and clear locations

Video menus use a small vertical-dot icon beside the lower metadata, preserving the full title width and a 44px touch target. Add/Move/Restore show explicit pathway, numbered module and numbered section labels; destination search, module options and saved messages use the same naming. Current location is separate from the destination.

Design rationale: [NN/g contextual-menu guidance](https://www.nngroup.com/articles/contextual-menus-guidelines/) supports proximity and relevant secondary actions; [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) supports maintaining usable targets while keeping icons visually restrained. Placement was chosen for this course layout rather than treated as a universal best pattern. Verified desktop/mobile workflows, keyboard/drag interaction, theme contrast, lint, types and the Next production build.
