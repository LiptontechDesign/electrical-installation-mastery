# Personal course ordering

Signed-in learners can arrange their own course map. Changes belong to the authenticated account; guests use the published arrangement without tracking.

## Interaction

A compact **Add video** control is always available in the course map. Every video has a **More actions** menu with **Move to…** and **Add video after**. Supplementary entries also offer **Edit details** and **Archive**. Section add controls work even when a section is empty.

**Move to…** opens a searchable destination picker with pathway/module browsing and exact insertion positions. The preview shows the resulting lesson numbers. Videos move independently by default. Where a legacy supporting sequence exists, an explicit checkbox lists the videos that can move together.

**Organise** reveals drag handles and bulk watched controls. Mouse, touch hold, and keyboard dragging share the same placement model. Dropping saves once and offers **Undo**; Escape cancels without saving. The precise move dialog is also usable entirely by keyboard or touch without dragging. A saved move highlights its destination and keeps the current video selected.

Undo is available from the latest-change message and course menu during the current session. It reverses the affected items while preserving unrelated edits. If the same video has changed again, the older change cannot be undone over that newer edit. Undoing an addition archives it, preserving its notes and progress.

## Placement and numbering

Core and supplementary videos share explicit section membership and a continuous L1, L2, L3 sequence within each module. Any video can move between sections, modules and pathways, including empty destinations. Display numbers are derived from the visible order; archived entries are excluded. Stable lesson and YouTube IDs preserve watched records, notes, bookmarks and playback positions.

The map, search, module counts, Previous/Next and automatic advancement use the same mixed sequence. Core completion remains separate from optional and supplementary completion.

## Persistence and migration

`/api/personal-course` requires authentication, same-origin writes and validated operations. A single version-2 `personal-course` document contains both catalogue and placement, keyed by account ID. Postgres compare-and-swap writes atomically reject stale revisions. An operation receipt makes retries idempotent, including a disconnected response after a successful save. Conflict responses load the latest arrangement for review; failed forms keep their details.

Accounts without this document are read from their existing `course-order` and `supplementary` records. Migration preserves the legacy visible order, archived entries and stable identities. The first successful edit saves version 2. Legacy documents remain available for recovery and account export. Legacy GET endpoints project the new document; legacy POST endpoints request a reload so older tabs cannot save incompatible changes. No manual database migration is required.

Implementation: `app/personal-course-model.ts`, `app/course-order.tsx`, `app/personal-course-editor.tsx`, `app/course-editor-actions.tsx`, `app/course-drag-context.tsx`, and `app/server/personal-course-store.ts`.

## Verification

- `npm run test:personal-course`: migration, mixed placement, numbering, grouped moves, undo, identity, duplicates and request validation.
- `npm run test:personal-course-api`: actual route/store code with deterministic database fixtures; authentication, CSRF, isolation, concurrency, retries and storage failure.
- `npm run test:personal-course-browser`: desktop/mobile add, move, archive, restore, failure recovery and guest isolation.
- `npm run test:personal-course-interactions`: drag cancellation/save/undo, keyboard movement, mixed auto-next and disconnected-response recovery.
- `npm run test:course-experience`: playback resume, timestamp notes, bookmarks and layout regression coverage.

Browser tests require a local server on port 3001 with fixture auth configuration (see `scripts/personal-course-browser-fixture.mjs`). They mock API storage and the YouTube player; they do not verify a live Google session, live Postgres or YouTube playback. Legacy model suites remain useful for migration compatibility.

### Local verification, 29 September 2026

Both the Next.js production build and the vinext/Vite build passed. The Vite App Router dependency `@vitejs/plugin-rsc` is now explicitly declared at the version already in the lockfile, so clean installs include it. Lint, TypeScript, theme contrast checks, model/API tests, desktop/mobile browser tests, conflict tests and playback regression checks passed. `npm run test:personal-course-conflicts` covers stale-tab recovery, duplicate guidance and mobile dialog dismissal.

The two build tools generate different `.next/types/routes.d.ts` shapes. If running standalone TypeScript after the Vite build, run `npx next typegen` first. This is generated tooling output, not application state.

The browser suites use a local Next server with `AUTH_SECRET=local-preview-only-0000000000000000000000`, `AUTH_GOOGLE_ID=local-fixture` and `AUTH_GOOGLE_SECRET=local-fixture`. All storage and player responses are intercepted by the fixtures. Never use those test credentials in production. Live account sign-in, actual Postgres persistence and real YouTube embedding remain deployment integration checks. No live account data was changed or application deployed by this implementation.

### Compact rows and clear locations

Video menus use a small vertical-dot icon beside the lower metadata, preserving the full title width and a 44px touch target. Add/Move/Restore show explicit pathway, numbered module and numbered section labels; destination search, module options and saved messages use the same naming. Current location is separate from the destination.

Design rationale: [NN/g contextual-menu guidance](https://www.nngroup.com/articles/contextual-menus-guidelines/) supports proximity and relevant secondary actions; [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) supports maintaining usable targets while keeping icons visually restrained. Placement was chosen for this course layout rather than treated as a universal best pattern. Verified desktop/mobile workflows, keyboard/drag interaction, theme contrast, lint, types and the Next production build.
