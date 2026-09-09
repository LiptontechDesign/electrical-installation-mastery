# Shared supplementary videos

Use **Add supporting video** in an expanded module or above a lesson. Paste a YouTube link, use **Fill title and instructor from YouTube**, then choose the module and the lesson it should appear before or after. Titles and channel names remain editable. Metadata lookup can fail; manual entry remains available. Duration is not guessed.

Videos appear in the existing course map at the chosen lesson position. They open in a course-styled embedded player; opening one pauses the core player and cancels automatic advancement. They have no assessment/overview tabs and do not alter core completion totals. A YouTube fallback link remains available for embed restrictions.

Every visitor may add, rename, move, archive and restore these supplementary records. Each save requires an explicit typed phrase (ADD VIDEO, EDIT VIDEO, ARCHIVE VIDEO or RESTORE VIDEO), checked on both client and server. This is intentionally open collaboration, not authentication or a defense against malicious visitors. Canonical lessons, questions and completion records are outside this API.

Archive is reversible: no deletion endpoint exists. Each module has an Archived videos control. Restoring retains the last saved course position. Duplicate YouTube IDs are rejected across the canonical course and supplementary library, including archived entries.

## Persistence

The existing private Vercel Blob store holds `course/supplementary-videos-v1.json`, separate from private book state. The server uses the existing BLOB_READ_WRITE_TOKEN or BLOB_STORE_ID/OIDC configuration. No new password or database is required. Credentials never enter client code. A storage failure displays an error, never silently substitutes browser-only persistence.

The public application API exposes only this supplementary catalogue. Writes use same-origin checks, bounded JSON requests, fixed YouTube-host parsing, validated canonical lesson anchors, a 500-record limit, catalogue revisions and conditional Blob writes. Concurrent stale saves are rejected. Refresh the list and reopen the latest record before retrying. Loading/re-focusing the course or explicitly refreshing fetches shared changes; there is no continuous polling.

Metadata is fetched from a fixed YouTube oEmbed endpoint with an 8-second timeout, no redirects and a one-day fetch cache. Returned embed HTML is never rendered. Only title and channel text are used.

## Delivery note

No tests, build, browser QA or deployment monitoring were run, at the user's request. Git main remains the existing Vercel deployment path. Runtime availability depends on the existing production Blob binding; this change does not provision new storage.
