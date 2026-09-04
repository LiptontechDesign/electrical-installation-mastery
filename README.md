# Electrical Installation Mastery

A mobile-friendly, self-paced electrical installation course designed around long-form UK teaching videos and practical Kenyan residential and light-commercial context.

**Live course:** [electrical-installation-mastery.vercel.app](https://electrical-installation-mastery.vercel.app/)

## What has been built

- **239 sequenced video lessons across 16 modules:** the original 161-lesson foundation plus 78 advanced lessons covering residential work, lighting, smart systems, communications, security, solar, backup power and professional practice.
- **Embedded YouTube learning:** lessons play inside the course without requiring a separate playlist or paid video hosting.
- **Reliable optional auto-next:** a completed video is marked finished and the next lesson loads after a five-second countdown. The learner can cancel, select another lesson or switch auto-next off. Fullscreen playback is handled without removing the active player unexpectedly.
- **Lesson teaching guides:** every video has a concise summary, key concepts, points to remember and practical connections.
- **Transcript-grounded retrieval practice:** 1,521 flashcards and 1,521 quiz questions are linked to the content of their source lessons. Questions are short, direct recall prompts rather than copied transcript sentences or vague title-based questions.
- **Lesson and module mastery:** flashcard review, instant quiz feedback, saved best scores, an 80% mastery target and spaced-review due dates.
- **Learning workspace:** searchable lessons, lesson summaries, glossary, bookmarks, personal notes, confidence ratings and progress reporting. Navigation is limited to Home, Learn, Toolkit and Progress; lesson quizzes are in Review, and module quizzes and due flashcards open from Progress.
- **Local-first progress:** learning records stay in browser storage and can be exported or restored as a JSON backup.
- **Responsive interface:** the course navigation, video lesson, practice tools and progress views adapt for desktop and phone use.

## Curriculum

The learning path begins with electrical principles and progresses through:

1. Electrical foundations
2. Building electrical systems
3. Practical wiring and terminations
4. Containment, cables and installation methods
5. Protection, earthing and fault paths
6. Electrical design and calculations
7. Three-phase systems and distribution
8. Inspection, testing and commissioning
9. Fault finding and maintenance
10. Complete installation workflows
11. Socket outlets, fixed appliances and domestic loads
12. Lighting design, LED systems and lighting controls
13. Smart homes, data, CCTV, access control and electric fencing
14. Solar PV, batteries, generators, UPS systems and EV charging
15. Pumps, water heating, HVAC, fire detection and building services
16. Tools, quotations, documentation, handover and professional practice

Kenyan applications include stone and brick construction, concealed conduit, reinforced slabs, gypsum ceilings, modern lighting layouts, outdoor and compound systems, backup power and future-ready services.

## Assessment design

Each lesson follows a simple learning loop:

1. Watch the complete video.
2. Review the lesson summary and key concepts.
3. Answer concise flashcard questions from that lesson.
4. Complete the lesson quiz and read the answer feedback.
5. Continue automatically or choose another lesson.
6. Complete a larger mastery review at the end of the module.

The assessment generator requires at least three lesson-specific concepts and builds distinct recall, application, safety and Kenya-compliance checks. The transcript audit verifies that every lesson has a matching teaching guide and that its learning content is grounded in the archived transcript vocabulary. One visual-only lesson is explicitly recorded rather than treated as spoken narration.

Run the course-wide assessment audit with:

```powershell
npm run audit:transcripts
```

Current verified coverage:

- 239 lessons checked
- 238 spoken transcripts grounded
- 1 visual-only lesson documented
- 0 missing lesson guides or transcript records
- 1,521 flashcards
- 1,521 quiz questions
- 0 generic title-based recall prompts
- 0 overlong flashcard questions or answers

The transcript archive itself is maintained outside this repository. It is used as research material for creating original lesson summaries and assessments, not published as copied video content.

## Safety and standards

This is an educational course, not an electrical licence or authorisation to undertake regulated work. Current Kenyan law, EPRA and utility requirements, applicable KS/IEC standards, the approved project specification and the equipment manufacturer's instructions take priority. UK videos and BS 7671 material are teaching references and must not be assumed to establish Kenyan compliance automatically.

## Project structure

- `app/course-data.json` — validated catalogue for the original 161 lessons.
- `app/course-extension/` — modular definitions for the advanced curriculum.
- `app/course-extension-data.ts` — combines and validates extension modules.
- `app/lesson-guides-*.json` — lesson-specific summaries and core concepts.
- `app/assessment-data.ts` — flashcard and quiz construction and quality rules.
- `app/assessment-panel.tsx` — lesson and module practice interface.
- `app/course-app.tsx` — course navigation, player, progress and learning tools.
- `docs/ASSESSMENT_SOURCE_MAP.md` — assessment pedagogy, source hierarchy and Kenyan regulatory guardrails.
- `scripts/audit-transcript-assessments.mjs` — full transcript-to-assessment coverage audit.
- `scripts/generate-course-data.mjs` — rebuilds and validates the original curriculum catalogue.

## Run locally

Requirements: Node.js 22.13 or newer.

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:3000/` in Chrome. For a production check:

```powershell
npm run audit:transcripts
npx next build
npx next start
```

## Deployment

The production application is hosted on Vercel. The repository includes `vercel.json` and the Next.js configuration needed for deployment. After linking the repository to a Vercel project, pushes to the production branch can deploy automatically; a manual production deployment can also be created with:

```powershell
npx vercel deploy --prod
```

## Updating the course

Add advanced lessons through the appropriate file in `app/course-extension/`, add a matching lesson guide, and preserve every existing lesson ID so saved progress remains valid. Before publishing a content change, run:

```powershell
npm run audit:transcripts
npx next build
```
