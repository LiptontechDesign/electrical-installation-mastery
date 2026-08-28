# Electrical Installation Mastery

A private, local-first learning app that preserves the original 161-lesson electrical installation curriculum and adds a separately maintained, quality-audited advanced pathway.

## Content architecture

- `app/course-data.json` is the generated, interface-independent course catalogue.
- `app/course-extension-data.ts` assembles modules 11 onward from the files in `app/course-extension/` so future topics can be added without rewriting the original course.
- `app/course-extension/builders.ts` calculates lesson/module durations and fails the build if an extension video is under five minutes, duplicated, missing a four-concept guide, or belongs to the rejected-video audit list.
- `scripts/generate-course-data.mjs` rebuilds that catalogue from `../MASTER_CURRICULUM_PROPOSAL.md` and validates 10 modules, 161 lessons and 161 unique YouTube IDs.
- `app/course-app.tsx` renders all navigation and learning tools from the catalogue rather than hard-coded lesson lists.
- Learner progress uses the versioned Chrome local-storage key `electrical-mastery-progress-v1` and remains separate from curriculum content.

This separation allows new modules, categories, practical projects, references, quizzes or additional courses to be introduced without replacing the current interface or saved progress.

## Local use

Double-click `../OPEN ELECTRICAL COURSE.cmd`. It starts the production build in a hidden process and opens only Google Chrome at `http://localhost:3000/`.

## Updating content

After changing the original master curriculum or an extension module, run:

```powershell
node scripts/generate-course-data.mjs
npm run build
```
