# EPRA self-study practice centre

`/practice` is an independent, public route linked from the desktop and mobile course navigation. It uses the supplied `EPRA_C2_C1_COMPLETE_ALL_IN_ONE_Study_Pack.zip`, not the previously retired banks.

## Content and fidelity

All 12 Markdown documents are retained byte for byte under `content/epra/`. The importer records a SHA-256 hash for each source, and slices original question and answer text using source offsets. The generated `app/practice/study-pack.json` contains 568 topic questions, 110 recall questions and 10 complete 20-mark mock-paper questions (five per licence). The C1 multiple-choice section retains its complete 20-part source question, instructions and answer explanations. Its study presentation supplies one radio group per item and compares selections with the supplied key only during answer review. A complete original-question view remains available.

The source README maps Steps 1–5, 7 and 8 to the shared foundations and cross-cutting topics, and Step 6 to the C1 extension. The interface follows this mapping. The shared banks may discuss both licence scopes; they are labelled C2 + C1 rather than silently rewriting or removing questions. Mock papers are strictly separated by licence.

The original questions, answers, source cautions, study lenses, checklists, tables and reference notes are retained. At the user’s explicit request, displayed answers omit eight reviewed editorial asides about missing BS definitions or OCR provenance. `presentation-omissions.json` records the exact text and question IDs; tests require every other character of the answer to remain unchanged. The Class II aside includes its orphaned connective fragment so the definition reads directly. Non-question material is available in each collection's source-guidance panel, and the original README in the study-pack guide. UI topic labels are separate metadata. The authored material is displayed as supplied; its legal and technical assertions have not been re-authored or independently certified.

Markdown headings, lists, tables, code diagrams and emphasis are rendered as presentation. `\(...\)` and `\[...\]` delimiters are converted in memory for remark-math/KaTeX; stored text is unchanged. Raw HTML is not enabled, and KaTeX trust is disabled. Keep the directly installed KaTeX version compatible with rehype-katex's renderer so its CSS and generated markup match.

## Learning flows

- **Topic practice:** choose C2 or C1, browse the topic cards, search question text, filter by section, read the whole question, write working, then Reveal Answer. Answer contents links navigate long solutions without hiding steps. A fixed reading dock keeps Previous/Next and answer access available at any scroll position, with left/right keyboard shortcuts outside inputs. The mobile navigator starts collapsed; selecting a question closes it. Answer reveals scroll to the solution with a short entrance transition; reduced-motion preferences disable animation. Flag questions or mark them understood / needing revision.
- **Recall quizzes:** browse all 110 questions or select up to 10 shuffled questions from the current filtered bank. Questions are unique within a quiz. Answers are locked until the learner finishes and opens review. Independent quizzes exclude questions with explicit prerequisite references and the reviewed implicit cable-design dependency; topic study shows prerequisite question text recursively, never prerequisite solutions. A quiz creates a separate session without clearing topic work.
- **Mock exams:** retain all five complete questions and original instructions. Timed attempts use a two-hour wall-clock deadline (not accumulated interval ticks), while untimed attempts have no countdown. Expiry automatically opens review. Working is preserved read-only for comparison, each answer is revealed on demand, and the learner can self-assess each supplied question part; complete part allocations roll up to 20 marks per question. The C1 MCQ section retains a 0–20 self-assessment field alongside its comparison with the supplied key. Self-assessment is clearly labelled and is not an official result.
- **Working:** remains in React memory for the current session, including when moving between questions. Returning to the practice centre preserves separate study and quiz sessions, including flags, answers revealed, responses, marks and original exam deadlines. It is not written to browser storage or account records. Download creates a local Markdown copy containing original questions and the learner's working, review choices, flags, stable question IDs, individual responses and self-assessed part/total marks. Leaving the route or reloading warns when any session has work, flags, review choices, marks or an active attempt. Navigating between collections within the centre does not discard those sessions. Timed papers continue against their original deadline while away. There is no cross-reload resume or cloud syncing.

The visual layout uses the existing light/dark semantic palette, responsive cards and reading columns, horizontally scrollable formulas/tables, visible keyboard focus, labelled inputs and answer expanded states. The standalone route keeps the new content out of the course-app bundle.

## Verification

```powershell
npm run import:epra
npm run test:epra
npm run lint
npx tsc --noEmit
npm run test:theme
npm run test:architecture
npm run test:guests
npm run test:accounts
npm run test:navigation
npm run build
npx next build
```

With a local server on port 3001, run `npm run test:epra-browser`. It uses installed Chrome via Playwright; set `EPRA_TEST_URL` to change the server URL. It covers pathway separation, search, answer gating, mathematical rendering, per-question working, flags, filtered navigation, quiz review, download, timer expiry, untimed mocks, self-assessment, the recall bank, mobile overflow, dark appearance and zero guest browser-storage writes. Screenshots are under `artifacts/browser-verification/practice-*.png`.

## Answer presentation and practice experience

Source heading hierarchy is preserved under the answer heading, including nested answer contents. Previous/Next, Question and Go to answer remain available in the reading dock. Explicit Not attempted / Attempted / Reviewed / Needs revision labels distinguish learning states; flags remain independent reminders. Topic cards, reader headings and answer borders share a restrained topic accent.

On screens at least 1500 CSS pixels wide, Compare side by side provides a question/working column and a full-answer column within a canvas capped at 1920px. Smaller screens use a single reading column. Short answers remain simple; no source explanations, conditions or cautions are collapsed automatically. Multipart mock questions have separate working areas with mark allocations parsed from their unchanged source parts. All nine multipart questions must total 20 marks in verification.

Run `node scripts/test-practice-experience-browser.mjs` against a local server (or set `EPRA_TEST_URL`). `EPRA_BROWSER` selects an installed Chromium channel. This check covers session/quiz isolation, return/resume, flags and part-mark exports, prerequisite context, desktop comparison, mobile light/dark layout, actual wall-clock timer expiry, MCQ choices and locked review, hierarchical contents and zero guest local-storage writes. The older practice browser suite remains available and uses the same optional channel setting. Audit screenshots from the new suite go to ignored `work/practice-experience/`.
