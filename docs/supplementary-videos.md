# Personal supplementary videos

The published course includes 32 bundled supplementary entries. Guests can watch them freely. Signed-in learners can add, rename, move, archive and restore supplementary entries in their own account; these changes do not affect other learners.

## Adding and watching

Use the + control at a module, section or video. A YouTube link can populate its title and channel through metadata lookup; manual entry and retry remain available. Duration is not invented. Save actions require the applicable explicit confirmation phrase.

Videos appear at their chosen place in the course map and play inline in the main lesson canvas, with their title, watched control and editing actions. Playback does not open a modal; only management forms and the archive use dialogs. Selecting a core lesson or leaving Learn closes supplementary playback. Opening one pauses core playback and cancels pending automatic advancement. A YouTube fallback link is available for embedding restrictions.

Core and supplementary videos share continuous numbering within each module. Moving an entry automatically updates display numbers. Supplementary videos retain their label, so they do not need a separate numbering system.

Signed-in watched marks are keyed by YouTube video ID and synchronized in the account's supplementary-progress record. Moving or renaming does not reset them. Replacing the video URL does not inherit the previous video's watched mark. Supplementary marks remain separate from required core progress; complete account export includes account documents.

## Persistence and safeguards

Records are stored in the authenticated user's supplementary document in Postgres, not a public shared Blob catalogue. Guest browsing uses bundled defaults without loading private records. Default merging preserves saved edits and archived entries.

The API checks authentication, same-origin requests, confirmation phrases, YouTube links, valid placement anchors, cycles and duplicates. Each account's supplementary catalogue has a 500-record limit. Archiving is reversible; no supplementary deletion endpoint is provided.

Metadata comes from a fixed YouTube oEmbed endpoint; returned embed HTML is never rendered. Storage failures show an error and retain the form. Supplementary writes do not provide optimistic revision conflict rejection; simultaneous edits in the same account should be avoided.

## Verification

Run test:supplementary, test:course-order, test:course-drag and test:accounts. Canonical-video and default-placement coverage is also checked by test:licensing.

Supplementary playback uses the same title, module context, lesson stepper, next-video card, saved control and personal-notes styling as core lessons. New additions automatically receive this layout. YouTube reports duration after the player connects; unavailable durations are omitted. Saved supplementary videos, freeform notes, playback positions and timestamped notes are keyed by YouTube ID in the learner record, so moving or renaming preserves them and changing the video does not inherit another video’s data.
