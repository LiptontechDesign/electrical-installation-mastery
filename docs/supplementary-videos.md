# Shared supplementary videos

Use the compact **+** at module, expanded subsection or lesson level. The position defaults to the end of that module/subsection, or after the current lesson. Paste a YouTube link: title and instructor are fetched automatically after a short debounce. Stale requests are cancelled and manually edited fields are preserved. A retry control and manual entry remain available when lookup fails. Duration is not guessed. Archive controls sit beside the module-level plus.

Videos appear in the existing course map at the chosen lesson position. They open in a course-styled embedded player; opening one pauses the core player and cancels automatic advancement. They have no assessment/overview tabs and do not alter core completion totals. A YouTube fallback link remains available for embed restrictions.

Every visitor may add, rename, move, archive and restore these supplementary records. Each save requires an explicit typed phrase (ADD VIDEO, EDIT VIDEO, ARCHIVE VIDEO or RESTORE VIDEO), checked on both client and server. This is intentionally open collaboration, not authentication or a defense against malicious visitors. Canonical lessons, questions and completion records are outside this API.

Archive is reversible: no deletion endpoint exists. Each module has an Archived videos control. Restoring retains the last saved course position. Duplicate YouTube IDs are rejected across the canonical course and supplementary library, including archived entries.

## Persistence

The existing private Vercel Blob store holds `course/supplementary-videos-v1.json`, separate from private book state. The server uses the existing BLOB_READ_WRITE_TOKEN or BLOB_STORE_ID/OIDC configuration. No new password or database is required. Credentials never enter client code. A storage failure displays an error, never silently substitutes browser-only persistence.

The public application API exposes only this supplementary catalogue. Writes use same-origin checks, bounded JSON requests, fixed YouTube-host parsing, validated canonical lesson anchors, a 500-record limit, catalogue revisions and conditional Blob writes. Concurrent stale saves are rejected. Refresh the list and reopen the latest record before retrying. Loading/re-focusing the course or explicitly refreshing fetches shared changes; there is no continuous polling.

Metadata is fetched from a fixed YouTube oEmbed endpoint with an 8-second timeout, no redirects and a one-day fetch cache. Returned embed HTML is never rendered. Only title and channel text are used.

## Delivery note

### Protective-device study path (10 September 2026)

The supplied study path's steps 1, 2, 3 and 5 were saved to the shared catalogue at revision 4. Step 4 is already core lesson p02-l02 (Understanding Your Consumer Unit) and is not duplicated. Steps 6–10 are bundled in `app/supplementary-defaults.ts`: MCCB, fuses/HRC, SPD, MPCB and AFDD. They appear after p05-l05 in Module 5, following the remotely saved entries in study-path order, using the normal supplementary player without quizzes or overviews.

Reason for the fallback: POST passed the catalogue revision check but repeatedly failed the conditional Blob overwrite, including on a later retry while the visible revision remained 4. The exact storage-layer cause has not been established; the generic conflict message is not proof of a concurrent visitor. No unconditional overwrite was attempted. This addition bypasses the storage write failure for publication, not for later edits. Shared editing/archiving can still fail until that storage conflict is resolved.

Client and API both merge bundled defaults with saved records. Remote records take precedence by record ID or video ID (including archived records), preserving edits and avoiding duplicates. Missing defaults are appended in supplied order; the first successful later save persists the merged catalogue. No cloud record was removed or overwritten during this fallback.

Watched marks are personal, browser-local state under `electrical-supplementary-watched-v1`, keyed by YouTube video ID. Finishing playback (when the shared YouTube API is available) or pressing Mark video watched records completion; simply opening a player does not. Undo removes the mark. Moving, renaming, archiving/restoring or switching navigation mode does not reset it. Replacing a video URL does not inherit the former video's mark. These optional marks are separate from required progress and are not included in the existing core-course progress export.

Core video completion already used the same learner record in both modes. Turning Free Browse off now navigates to the earliest unwatched required video or unpassed checkpoint, without clearing any completed videos or assessment records. Individual lesson quizzes retain their existing status and requirements; watching a video never passes a quiz.

No tests, build, browser QA or deployment monitoring were run, at the user's request. Git main remains the existing Vercel deployment path. Runtime availability depends on the existing production Blob binding; this change does not provision new storage.
