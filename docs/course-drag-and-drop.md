# Personal course ordering

Signed-in learners can arrange their own course map. A change belongs to the authenticated account and does not change anyone else's course. Guests use the published default arrangement.

## Interaction

Drag handles support mouse, touch and keyboard through dnd-kit. A preview describes the proposed destination; the confirmation dialog opens with focus on Cancel. Only confirmation persists a move. Precision move controls remain available. Cancelling does not save anything.

The map supports section/module targets, deliberate pathway hover, edge auto-scroll and reduced-motion preferences. Touch activation uses a hold gesture to avoid confusing normal scrolling with dragging.

## Placement and numbering

Core moves use lessonId, sectionId and beforeId. A video and its attached supporting sequence move together. Supplementary moves use moduleId, anchorId and before/after placement. Descendant/self cycles are excluded, and previews use the same ordering model as rendering.

Core and supplementary videos share one continuous L1, L2, L3 sequence within each module. Display numbers are calculated from the current visible order, not stored as permanent identities. Watched records and notes use stable IDs and survive moves.

Empty sections accept core videos; supplementary videos require an existing anchor. Archived supplementary videos do not appear in the visible numbering.

## Persistence and implementation

The course-order and supplementary endpoints require a signed-in account, validate same-origin requests and store records by user ID in Postgres. Course-order requests include a revision; stale requests return the current order for review. Storage errors are shown instead of silently claiming a save.

Relevant code: course-drop-model.ts, course-order-model.ts, course-drag-context.tsx, course-order.tsx, supplementary-videos.tsx and move-confirmation-dialog.tsx in app/.

## Verification

Run test:course-order, test:course-drag, test:supplementary, test:navigation and test:accounts. The placement suite checks mixed numbering, cross-section/module moves, attachment rules, cycles, empty sections, identity preservation and confirmation-only saves.

The optional test:course-drag-browser script remains available for future browser regression work; it was not run during the September 2026 cleanup because the owner requested no computer use.
