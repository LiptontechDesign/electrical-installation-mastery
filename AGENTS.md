<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Delivery workflow

The user’s standing preference is to commit completed changes, push them to the remote repository and merge them into the default branch automatically after the relevant checks pass. Do not stop at local changes or ask again for routine commit/push/merge permission. Respect required repository checks and branch protections. Report the commit and merge result when finished.

## Current product scope

Read README.md and docs/README.md for the current application contract. This is a video course and reference-book reader with optional Google sign-in and account-scoped progress, notes and ordering. Lesson guides, Standards Companion, quizzes, flashcards, exams, simulations and module recaps were removed in September 2026. Do not reintroduce them or use historical Git documents as current requirements without an explicit request. Preserve stable video IDs, guest access without tracking, and account isolation.

## C1 video selection

The user requires English spoken teaching and complete available transcript review before selecting C1 videos. Evaluate explanation quality, technical accuracy and teaching flow rather than relying on a title. A translated caption export does not establish the original audio language; resolve English audio/track evidence and label any translated review honestly. See `docs/c1-motor-transcript-audit.md` for the current motor-specific evidence and remaining gaps.

## Standalone practice centre — explicitly requested September 2026

The user authorized `/practice` with the supplied `EPRA_C2_C1_COMPLETE_ALL_IN_ONE_Study_Pack.zip`. `content/epra/` is the immutable source archive; never rewrite question or answer wording. Use `npm run import:epra` to regenerate the exact source slices, and `npm run test:epra` to verify hashes, completeness and formulas. Keep the practice centre independent of retired lesson extras and account progress. Practice working is session-only and downloadable; no guest tracking or new account state is introduced.

The user subsequently authorized omitting unnecessary negative BS-definition / source-provenance asides from displayed answers. `app/practice/presentation-omissions.json` enumerates eight exact passages; `displayAnswer` removes only those. Original sources and generated source slices stay unchanged. All substantive definitions, explanations, cautions and calculations must remain intact.

## Past-paper study compilations — explicitly requested October 2026

The user authorised C1 Past Papers and C2 Past Papers tabs after Practice. `app/past-papers/` contains an independently authored bank, separate from the immutable archive above. Questions have complete givens and a focused worked answer: integrate definitions where needed, use labelled bullets for explanations, numbered procedures, comparison tables and clear calculation steps. Keep optional self-checks collapsed; omit repetitive breakdown/key-term preambles. Preserve correct LaTeX rendering and technical SVG diagrams. Student answers omit per-paper provenance and commentary about mistakes in third-party solutions; source evidence and limitations belong in `docs/past-paper-research.md`. Working is session-only and downloadable; do not add guest tracking or account state. Verify with `node scripts/test-past-papers.mjs` and the existing protected-source/course/account suites.

Answer language must teach a beginner: respond directly to the question, explain essential terms and abbreviations at first use, state the defining conditions and comparison basis, and connect each calculation step to its purpose. Bold the decisive distinctions and keep definitions within the answer rather than adding a separate preamble.
