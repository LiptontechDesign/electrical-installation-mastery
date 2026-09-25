# Current documentation

Updated 23 September 2026. This index and the root README describe the current application, not a future roadmap.

- [Application overview and setup](../README.md): video course, books, Google sign-in, configuration and test commands.
- [Video-only cleanup](video-only-cleanup.md): what was retained, removed and verified.
- [Course ordering](course-drag-and-drop.md): personal ordering, placement rules and continuous numbering.
- [Supplementary videos](supplementary-videos.md): personal additions, defaults, playback and persistence.
- [EPRA practice centre](epra-practice-centre.md): source fidelity, topic practice, quizzes, mock exams and verification.
- [Theme and accessibility](theme-audit.md): current palette and verification limits.

The app has Home, Learn, Books and a standalone Practice destination, plus account/settings controls. The new practice centre uses the supplied EPRA study pack. Retired lesson guides, Standards Companion, flashcards, simulations and recap interfaces remain absent.

Superseded assessment, competency, lesson-explanation, transcript-integration and recap plans/audits were removed from this documentation set. Historical versions remain in Git history; they are not specifications for the current product.

Course progress uses explicit not-started, in-progress and completed badges with watched counts and progress bars. Required core videos determine core completion; optional catalogue and supplementary videos are counted separately. Optional-only groups show their own progress. C2, C1 and Advanced use restrained blue, violet and amber accents, while green indicates completion. The active video is labelled Watching now. Guest views do not show saved progress.

The course map uses compact progress rows with explicit core/optional counts, separate module and section headings, full lesson titles and a current-module indicator. Completed groups use quieter success styling, and a Next unwatched shortcut keeps navigation close to the course list.

The learning view now defaults to study mode; Organise course exposes move, add, archive and bulk-mark controls. All / Unwatched / Saved filters apply to the selected pathway (Saved includes core and supplementary bookmarks). Counts and completion still reflect the full group, independent of filtering. Completed sections can be collapsed; the current section remains available. Module colours are stable by module ID and carry through sections, rows and player headings, with larger lesson titles and touch controls.

Signed-in core and supplementary videos resume using positions keyed by YouTube ID. Positions are checkpointed during playback, on pause and navigation, and on page hide. Timestamp notes use the same account-scoped learner-state document; they include jump and delete actions. Existing freeform lesson notes remain intact. Schema 10 gains additive validated videoPositions and timestampNotes fields; older backups receive empty defaults. Guests do not record either field. Browser checks with a simulated YouTube API: node scripts/test-course-experience-browser.mjs (local fixture server only).

Supplementary lessons share the main lesson layout, course-order Previous/Next controls, save action, watched panel and private freeform notes. Duration is shown only after YouTube reports it. Added videos use the same component automatically. Large screens use a fluid lesson canvas up to 1920px, with a preserved 16:9 player.

Mobile layouts keep book page controls above navigation, retain guest playback settings, use larger touch targets and form text, and constrain dialogs to dynamic viewport height. Touch taps do not leave hover tooltips. See [mobile verification](mobile-experience.md) for coverage and device-testing limits.
