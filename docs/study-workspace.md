# Study workspace design

The October 2026 redesign changes presentation and access to existing study material. Video identities and ordering, the supplied study archive, authored question and answer banks, diagrams, definitions and original books are unchanged. There are no new learner record fields or guest tracking.

## Layout

- Home chooses unfinished work in the selected mixed pathway, then its first unwatched video. A watched last-opened video is explicitly offered as Replay. The video and current book precede secondary progress information. Progress is compact, with overall totals and secondary statistics available on demand. Continue reading uses the existing account reading position and opens that exact book and PDF page.
- Learn uses a compact title, a contained 16:9 player, a prominent Next action and quieter watched controls. Notes and the existing course tools remain available without preceding the video.
- Books prioritizes the most recent reading position. Contents and Save stay visible while Reading tools discloses view and zoom controls. Page navigation remains outside the scrolling document.
- Practice begins with pathway, practice type, search and topics. Instructions stay in the study guide. Short phone labels retain the full accessible names. Mock-paper context remains visible when that mode is chosen.
- Papers begins with a compact pathway/mode selection and the question. Filters and the mobile question index are optional disclosures. Study/Attempt first, working, downloads, technical diagrams and optional self-checks remain available. Undownloaded working retains its existing leave guard.

Desktop and phones share Home, Learn, Books, Practice and Papers. C2/C1 selection happens inside Papers. Cross-route destination links explicitly return to the top while modified clicks retain normal browser behavior. In-app course navigation continues to preserve the current learner record.

`app/workspace-design.css` owns the shared layout and typography, using the existing audited light/dark semantic roles. Teal identifies the primary action; technical reading is 16px on phones and 17px on wider screens. Source PDFs and technical figures retain their original colors.

## Interaction refinement

A second review covered destination navigation, Home choices, lesson/player controls, course drawers, book tools, Practice modes/search/session controls, Papers modes/filters/answer controls, loading, keyboard focus and touch targets.

- Practice modes sit above changing pathway and definition content, keeping their position stable. Home's My learning/About and Practice's four modes use one keyboard tab stop, arrow-key activation, Home/End, explicit selection and a labelled panel. Content is synchronous, matching the [W3C tabs guidance](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/). Main destinations remain navigation links/buttons rather than being labelled as a tab widget.
- Home navigation returns to My learning. Reselecting Learn or Books preserves the current video or open book instead of resetting it. Supplementary video selection survives in-app destination changes. Destination changes scroll directly to the beginning and place keyboard focus in the main content.
- Question and answer jumps account for the phone, tablet, desktop and compact landscape header heights. Papers reveals focus the answer, and end-of-question Previous/Next controls remove the need to scroll back to the top.
- Route links show a small pending indicator without moving their labels. Local tab color changes respect reduced-motion preferences. Core and supplementary lesson-save buttons expose their pressed state.
- Session exit guards allow same-page navigation and modified/new-tab clicks while retaining warnings for actual departures with working. No storage or account fields were added.

## Verification

`node scripts/test-study-workspace.mjs` verifies unfinished/next/replay selection, pathway scoping, mixed ordering, empty courses, exact book/page resume and loading without false zero progress. Existing navigation, progress, guest/account isolation, books, fullscreen, curriculum, immutable-source and authored-paper checks remain required. `node scripts/test-theme.mjs` checks 64 declared light/dark contrast pairs.

The follow-up adds keyboard-tab and actual Papers/Practice component regressions: reveal focus, previous/next draft retention, attempt-first behavior and exit-guard cancellation. Browser review measured zero Practice tab displacement when switching to Definitions at 320, 390, 768 and 1440px. At 390px, topics begin around 387px and question jumps leave the heading below the 68px header. Native browser confirmation handling and physical-device behavior require their normal browser/device checks; the component harness covers guard event handling independently.

Browser review uses the local Next.js production build for public pages and an isolated signed-in component fixture for account UI. The local book-storage endpoint is unavailable without its production configuration; local reader checks therefore cover toolbar/page controls, with actual PDF rendering requiring the configured deployment. Emulated browser viewports do not replace physical device or screen-reader testing.
