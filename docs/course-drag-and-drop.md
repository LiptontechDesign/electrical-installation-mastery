# Course Map drag ordering

Implemented locally. Release sign-off remains blocked by the repository's existing assessment prebuild validation. No live shared catalogue was edited during testing.

## Interaction and architecture

- `app/course-drop-model.ts` reproduces the rendered anchor tree, enumerates representable destinations, and returns the exact preview and persistence payload. A state machine separates pickup, review, and saving.
- `app/course-drag-context.tsx` confines drag state to the Course Map. It uses dnd-kit mouse, touch and keyboard sensors, a lightweight portalled overlay, 180 ms layout movement, visible-element hit testing after scrolling, edge auto-scroll, and 650 ms hover expansion. Pathway tabs also accept deliberate hover to reach another pathway. Reduced motion skips layout animation.
- `app/move-confirmation-dialog.tsx` shows the source, destination, exact neighbouring item and shared-change notice. Initial focus goes to Cancel. Escape cancels; only Confirm move invokes persistence. Cancel makes no request.
- `app/course-drag.css` adds handles, placeholders, destination indicators, section highlights and feedback using the existing theme tokens. Touch handles have a 44 px hit area; mouse activation requires 6 px of movement; touch activation requires a 260 ms hold with 7 px tolerance.
- Existing precision editors remain available. Dragging does not modify the player or learner state.

## Placement rules

Core moves retain the existing `{ lessonId, sectionId, beforeId }` model. A lesson and its attached supporting sequence move together. Mixed-row destinations snap to representable core boundaries; the marker describes that normalized location.

Supplementary moves retain `{ id, moduleId, anchorId, position }`. Each candidate is simulated using the same depth-first sibling order as rendering, so existing siblings and nested videos cannot cause the preview to promise a different placement from the saved result. Descendant anchors are excluded, and existing server duplicate, cycle and module checks remain intact. The client supplies `EDIT VIDEO` only after explicit confirmation.

Empty sections accept core lessons. Supplementary videos require a valid anchor and cannot be the sole item in an empty section. The empty-section label says so, and the misleading section-level add control is hidden there.

Core revision conflicts reconcile with the returned server order. Other core errors reload; supplementary failures refresh the catalogue. The preview is discarded after reconciliation. If shared data changes while a move is under review, the user must review a fresh proposal.

## Exact files changed or added

| File | Purpose |
| --- | --- |
| `app/course-app.tsx` | Integrate drag rows, hierarchy targets and drawer protection |
| `app/course-drag-context.tsx` | Drag sensors, overlay, target handling and preview rendering |
| `app/course-drop-model.ts` | Pure placement calculations and confirmation state machine |
| `app/move-confirmation-dialog.tsx` | Explicit confirmation and safe focus |
| `app/course-drag.css` | Interaction styling and reduced motion |
| `app/course-order.tsx` | Reconcile failed core saves |
| `app/supplementary-videos.tsx` | Expose confirmed placement-only saves through the existing provider |
| `app/use-dialog-focus.ts` | Let the native confirmation dialog own focus inside the mobile drawer |
| `app/layout.tsx` | Load interaction styles |
| `package.json` | Dependencies and test commands |
| `package-lock.json` | Lock only the added dependencies; preserve existing versions |
| `scripts/test-course-drag.mjs` | Placement, identity, attachment, cycle and confirmation tests |
| `scripts/test-course-drag-browser.mjs` | Real-browser interaction and API-fixture tests |
| `docs/course-drag-and-drop.md` | This handoff |

Dependencies: runtime `@dnd-kit/core@6.3.1`; development `playwright@1.58.2`. dnd-kit's declared React/React DOM peer range is `>=16.8.0`; this application uses React 19.2.6. Production compilation and browser tests verify the integration with vinext.

## Verification

Passed: `test:course-order`, `test:supplementary`, `test:course-drag`, `test:navigation`, `test:migration`, `test:architecture`, `test:learning`, `test:recaps`, theme validation and TypeScript `--noEmit`.

Lint passes with one existing unused-variable warning in `scripts/test-assessment-ui.mjs`.

Browser scenarios cover mouse pickup/review/cancel, safe focus, no accidental video selection, exact saved core and supplementary previews, keyboard cancellation/review, revision conflict reconciliation, supplementary failure recovery, cross-module hover expansion, invalid outside drops, reduced motion, mobile long press/drawer protection, ordinary touch scrolling, and edge auto-scroll stopping away from the edge. API routes are intercepted with isolated fixtures; no real storage writes occur.

Run browser checks against a running server:

```sh
npx playwright install chromium
npm run test:course-drag-browser
```

Optional environment variables: `COURSE_TEST_URL`, `COURSE_TEST_CHANNEL=chrome` for an installed Chrome, `COURSE_TEST_CDP` for an existing isolated browser, and `COURSE_TEST_FILTER` for one scenario. Screenshots are written under ignored `work/`.

`npm run build` fails in the existing `test:assessment-ui` prebuild check at `C1-02-M07` (answer length). Investigation also found another short answer and duplicated C1 reasoning. Assessment content and assertions are unchanged. Running `npx vinext build` directly passes all production compilation stages, with the existing large-chunk warning; this does not make the full build command pass.

Local Vercel Blob credentials are unavailable, so actual live-storage writes have not been verified. The existing collaboration/security checks and supplementary last-write-wins semantics are unchanged. Cross-pathway hover is implemented; the automated cross-module scenario exercises modules within one pathway. No 60 fps hardware guarantee is claimed.
