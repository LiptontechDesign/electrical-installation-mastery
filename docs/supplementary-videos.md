# Personal supplementary videos

The published course includes 32 bundled supplementary entries. Guests can watch freely. Signed-in learners can add, rename, move, archive, restore and permanently remove entries in their own account without affecting other learners.

## Adding and watching

Use **Add video**, a section's small plus control, or a video's **Add video after** action. Paste a YouTube watch, share, Shorts or live link. Metadata lookup fills the title and channel; manual edits and retry remain available. Choose another destination if needed, then **Add to my course**. Success offers **Watch now** or **Add another** while keeping the current video in place. Duplicate links lead to the existing video or its restore action.

Videos play inline in the shared lesson canvas with watched marks, bookmarks, private notes, timestamp notes, resume and sequence navigation. Duration is shown only after YouTube reports it. Core and supplementary videos share automatic advancement and continuous numbering. A YouTube fallback link is available for embedding restrictions.

Use the compact video menu to edit the title/channel, move to any section, or archive. Restore from **Archived videos** in the course menu. Archiving preserves notes and progress. **Delete permanently…** opens a separate title-specific confirmation and removes the entry from your course and archive. Permanent removal has no Undo; saved notes and progress are kept. Deleted bundled entries stay removed through reloads and default merging. See [course ordering](course-drag-and-drop.md) for removal of published lessons too. Reversible edits require no typed confirmation phrase.

## Persistence and safeguards

Catalogue and explicit section order share the authenticated account's revisioned `personal-course` document. See [course ordering](course-drag-and-drop.md) for atomic saves, conflict handling, Undo and legacy migration. Guest browsing never loads private records. Default merging preserves saved edits and archived entries. Complete account exports include both the new document and retained legacy records.

Watched marks are keyed by YouTube ID in `supplementary-progress`. Bookmarks, freeform notes, playback positions and timestamp notes also retain their stable video identity. Moving, renaming or archiving does not reset them. Existing video links cannot be replaced through Edit details; add a different video separately.

The API validates YouTube links, placement, duplicates, body size and a 500-entry catalogue limit. Metadata comes from a fixed YouTube oEmbed endpoint; supplied HTML is never rendered. Save errors retain the form. Simultaneous changes cannot silently overwrite one another.

## Verification

Run the personal-course model/API/browser suites listed in [course ordering](course-drag-and-drop.md). `test:supplementary`, `test:course-order` and `test:course-drag` cover legacy models used by migration; `test:licensing` covers canonical videos and default placements.
