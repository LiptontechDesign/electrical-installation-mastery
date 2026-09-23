<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Current product scope

Read README.md and docs/README.md for the current application contract. This is a video course and reference-book reader with optional Google sign-in and account-scoped progress, notes and ordering. Lesson guides, Standards Companion, quizzes, flashcards, exams, simulations and module recaps were removed in September 2026. Do not reintroduce them or use historical Git documents as current requirements without an explicit request. Preserve stable video IDs, guest access without tracking, and account isolation.

## Standalone practice centre — explicitly requested September 2026

The user authorized `/practice` with the supplied `EPRA_C2_C1_COMPLETE_ALL_IN_ONE_Study_Pack.zip`. `content/epra/` is the immutable source archive; never rewrite question or answer wording. Use `npm run import:epra` to regenerate the exact source slices, and `npm run test:epra` to verify hashes, completeness and formulas. Keep the practice centre independent of retired lesson extras and account progress. Practice working is session-only and downloadable; no guest tracking or new account state is introduced.

The user subsequently authorized omitting unnecessary negative BS-definition / source-provenance asides from displayed answers. `app/practice/presentation-omissions.json` enumerates eight exact passages; `displayAnswer` removes only those. Original sources and generated source slices stay unchanged. All substantive definitions, explanations, cautions and calculations must remain intact.
