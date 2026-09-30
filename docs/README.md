# Current documentation

Updated 30 September 2026. This index and the root README describe the current application, not a future roadmap.

- [Application overview and setup](../README.md): video course, books, Google sign-in, configuration and test commands.
- [Video-only cleanup](video-only-cleanup.md): what was retained, removed and verified.
- [Course ordering](course-drag-and-drop.md): personal ordering, placement rules and continuous numbering.
- [Supplementary videos](supplementary-videos.md): personal additions, defaults, playback and persistence.
- [Earth-electrode video selection](earth-electrode-video-selection.md): Module 5 sequence, verified creator links, electrode/test coverage and source limitations.
- [C2 testing playlist integration](c2-testing-playlist-integration.md): approved JPElectric lessons, teaching order, excluded and retired videos, and preservation of personal course arrangements.
- [Earthing, ADS and fault-loop learning order](earthing-ads-learning-order.md): revised Module 5 sections, conductor sizing in Module 6, bonding assessment in Module 8 and saved-course migration.
- [EPRA practice centre](epra-practice-centre.md): source fidelity, topic practice, quizzes, mock exams and verification.
- [BS 7671 17th-edition EPRA definitions](bs7671-17th-edition-epra-definitions.md): historical source quotations powering the searchable Definitions tab in Practice.
- [Installable app](pwa.md): installation, privacy boundaries, offline recovery and verification.
- [Theme and accessibility](theme-audit.md): current palette and verification limits.

The app has Home, Learn, Books and a standalone Practice destination, plus account/settings controls. The new practice centre uses the supplied EPRA study pack. Retired lesson guides, Standards Companion, flashcards, simulations and recap interfaces remain absent.

Superseded assessment, competency, lesson-explanation, transcript-integration and recap plans/audits were removed from this documentation set. Historical versions remain in Git history; they are not specifications for the current product.

Course progress uses explicit not-started, in-progress and completed badges with watched counts and progress bars. Every active video counts once, including required catalogue, optional catalogue, bundled supplementary and personal additions across all pathways. Sections, modules, Home, Settings and the toolbar use the same mixed course arrangement. Watching or undoing a mark updates the numerator; adding, archiving, restoring or deleting updates the active total and its matching watched count. Historical marks for removed entries remain saved but do not contribute until restored. Optional remaining counts provide extra context within the primary total. C2, C1 and Advanced use restrained blue, violet and amber accents, while green indicates completion. The active video is labelled Watching now. Guests see video totals without saved progress.

The course map uses compact progress rows with watched/total video counts, separate module and section headings, full lesson titles and a current-module indicator. Completed groups use quieter success styling only after every active video is watched, and a Next unwatched shortcut follows the same mixed sequence.

Progress backups include supplementary watched marks alongside the learner state. Older backups remain accepted and leave supplementary marks intact when that field is absent. Reset learning progress clears both watched records. Verify with `node scripts/test-course-progress.mjs` and `node scripts/test-course-progress-browser.mjs` (the browser suite requires a local fixture server).

The learning view defaults to study mode. Compact Add video and per-video menus remain available; Organise reveals drag handles and bulk-mark controls. A shared destination picker supports every video and empty sections, with revision-safe account persistence and Undo. All / Unwatched / Saved filters apply to the selected pathway (Saved includes core and supplementary bookmarks). Counts and completion still reflect the full group, independent of filtering. Completed sections can be collapsed; the current section remains available. Module colours are stable by module ID and carry through sections, rows and player headings, with larger lesson titles and touch controls.

Signed-in core and supplementary videos resume using positions keyed by YouTube ID. Positions are checkpointed during playback, on pause and navigation, and on page hide. Timestamp notes use the same account-scoped learner-state document; they include jump and delete actions. Existing freeform lesson notes remain intact. Schema 10 gains additive validated videoPositions and timestampNotes fields; older backups receive empty defaults. Guests do not record either field. Browser checks with a simulated YouTube API: node scripts/test-course-experience-browser.mjs (local fixture server only).

Supplementary lessons share the main lesson layout, course-order Previous/Next controls, save action, watched panel and private freeform notes. Duration is shown only after YouTube reports it. Added videos use the same component automatically. Large screens use a fluid lesson canvas up to 1920px, with a preserved 16:9 player.

Mobile layouts keep book page controls above navigation, retain guest playback settings, use larger touch targets and form text, and constrain dialogs to dynamic viewport height. Touch taps do not leave hover tooltips. See [mobile verification](mobile-experience.md) for coverage and device-testing limits.
