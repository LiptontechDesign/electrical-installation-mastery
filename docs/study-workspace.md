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

## Verification

`node scripts/test-study-workspace.mjs` verifies unfinished/next/replay selection, pathway scoping, mixed ordering, empty courses, exact book/page resume and loading without false zero progress. Existing navigation, progress, guest/account isolation, books, fullscreen, curriculum, immutable-source and authored-paper checks remain required. `node scripts/test-theme.mjs` checks 64 declared light/dark contrast pairs.

Browser review uses the local Next.js production build for public pages and an isolated signed-in component fixture for account UI. The local book-storage endpoint is unavailable without its production configuration; local reader checks therefore cover toolbar/page controls, with actual PDF rendering requiring the configured deployment. Emulated browser viewports do not replace physical device or screen-reader testing.
