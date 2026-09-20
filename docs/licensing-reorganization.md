# C2 → C1 curriculum implementation

Originally implemented 10 September 2026; C2 teaching progression revised 20 September 2026.

## Current C2 reorganization — 20 September 2026

The current course has **296 canonical lessons in 25 stages**: C2 has 184 lessons / nine stages, C1 has 41 lessons / ten stages, and Professional has 71 lessons / six stages. There are 78 learning sections. The original implementation counts and checkpoint descriptions below are historical, not the current assessment model.

The authoritative order is assembled in `app/licensing-curriculum.ts` with insertions from `app/integrated-video-index.json`. `app/learning-sections.json` is the authored membership source, not a generated artifact. Exact approved group titles and ordered lesson IDs are recorded independently in `scripts/fixtures/c2-stage-order.json` and checked against both canonical modules and learning sections.

- C2-05 has four groups: Overload and Short-Circuit Protection; Earth Fault, Earthing, ADS and Residual-Current Protection; Surge, Arc and Special Protection; Protective-Device Selection and Coordination.
- C2-06 has three groups: Load, Demand and Design Current; Cable Selection and Installation Factors; Voltage Drop, Fault Duty and Final Design Checks.
- C2-07 has two groups: Consumer-Unit Assembly, Connections and Supply Arrangements; Complete Single-Phase Installation Cases.
- C2-08 retains its complete lesson order and three groups, now explicitly titled Inspection and Dead Tests: Continuity, Polarity and Insulation; Earthing Verification, Ze/PFC/Zs and Controlled Live Tests; RCD Testing, Functional Verification and Certification.
- C2-09 has three fault-family groups: Ring, Continuity, Polarity and Open-Circuit Faults; Insulation, Cable Deterioration, RCD and Leakage Faults; Load-Current and Functional Diagnosis.

AFDD (`course-lIit5k8QVj8`) moves from Professional to C2-05 immediately after `p05-spd`. Selective coordination (`course-V6WR_TBf1AU`) moves separately from Professional to C2-05 after `p05-l14`. Their overview terminology now cites these lessons. AFDD does not replace overcurrent, residual-current or surge protection.

MCB versus MCCB (`course-TqdQRgf3uGs`) follows `course-Me_adh09CdY` in overcurrent protection. The cable-sizing workflow (`course-8Z255dd78H4`) follows `p06-l10`, after basic cable selection and grouping factors. All three voltage-drop lessons remain together, ending with `p06-l09`; `p06-l15` remains the final C2-06 fault-duty check.

C2-08 retains `p05-l09` and both Ze demonstrations. The complete installation case `p10-l02` remains in C2-07. Thermal imaging `p16-l06` stays in C1; C2-09 mentions it only as wider knowledge. Detailed motor protection remains in C1.

No canonical lesson, video, title, URL, duration or source metadata is removed or replaced. Completion/bookmark/note identifiers remain unchanged. Different instructors and demonstrations are retained as reinforcement. Regrouped recaps are assembled from the included lesson guides instead of reusing mismatched old group summaries. All sections cover their canonical lessons exactly once, in order, with their final lesson as `throughLessonId`.

Regression checks retain the historical course baseline and permit only these specified reorders and two relocations. A pre-change fingerprint also verifies every lesson property except its presentation number and automatically derived predecessor description. No test of content quality is relaxed.

## Exact approved C2-05–09 lesson sequence

### module-05

- **Overload and Short-Circuit Protection**: `p05-l01` → `course-8VhgQ9Q9ixA` → `p02-l06` → `p05-l02` → `course-kx35WN3uLis` → `p05-l03` → `course-gqEu9t8HwW0` → `p05-l05` → `course-Me_adh09CdY` → `course-TqdQRgf3uGs`.
- **Earth Fault, Earthing, ADS and Residual-Current Protection**: `p02-l04` → `p02-l05` → `p05-l08` → `p05-l07` → `p05-l06` → `p05-l10` → `p05-l11` → `p02-l07` → `p05-l04` → `course-TUno2IT-KZY` → `p02-l08` → `p05-l15`.
- **Surge, Arc and Special Protection**: `course-CNiLNvBLopI` → `p05-spd` → `course-lIit5k8QVj8`.
- **Protective-Device Selection and Coordination**: `p05-l14` → `course-V6WR_TBf1AU`.

### module-06

- **Load, Demand and Design Current**: `p06-l01` → `p10-l09` → `p06-l11` → `p11-v2-l07` → `p06-l12` → `p06-l02` → `p06-l03`.
- **Cable Selection and Installation Factors**: `p06-l04` → `p06-l10` → `course-8Z255dd78H4`.
- **Voltage Drop, Fault Duty and Final Design Checks**: `p06-l07` → `p06-l08` → `p06-l09` → `p06-l15`.

### c2-boards

- **Consumer-Unit Assembly, Connections and Supply Arrangements**: `p03-l13` → `p03-l12` → `p02-l10`.
- **Complete Single-Phase Installation Cases**: `p10-l01` → `p10-l02` → `p10-l05`.

### module-08

- **Inspection and Dead Tests: Continuity, Polarity and Insulation**: `p08-l02` → `p08-l03` → `p05-l09` → `p08-l04` → `p08-l05` → `p08-l16` → `p08-l06`.
- **Earthing Verification, Ze/PFC/Zs and Controlled Live Tests**: `p08-l12` → `p02-l09` → `p08-l08` → `p08-l09` → `p08-l10`.
- **RCD Testing, Functional Verification and Certification**: `p08-l13` → `p08-l14` → `p08-l15` → `p16-l09`.

### module-09

- **Ring, Continuity, Polarity and Open-Circuit Faults**: `p09-l01` → `p09-l02` → `p09-l04` → `p09-l05` → `p09-l08`.
- **Insulation, Cable Deterioration, RCD and Leakage Faults**: `p09-l03` → `p09-l06` → `p09-l07` → `p09-l09`.
- **Load-Current and Functional Diagnosis**: `p09-l10` → `p09-l11`.

## Files changed in the 20 September reorganization

- Curriculum/membership: `app/licensing-curriculum.ts`, `app/integrated-video-index.json`, `app/learning-sections.json`, `app/supplementary-defaults.ts`.
- Overview/provenance: `app/c2-05-overview.ts`, `app/c2-05-sources.ts`, `app/c2-06-overview.ts`, `app/c2-06-sources.ts`, `app/c2-09-overview.ts`, `app/c2-09-sources.ts`. C2-07 and C2-08 overview files were reviewed; their section membership already derives from the authoritative learning sections, so no direct edits were necessary.
- Regression tests: `scripts/assert-c2-reorganization.mjs`, `scripts/fixtures/c2-stage-order.json`, `scripts/audit-course-integrity.mjs`, `scripts/test-curriculum.mjs`, `scripts/test-licensing.mjs`, `scripts/test-module-recaps.mjs`, `scripts/test-overview.mjs`.
- Test dependency consistency: `package.json`, `package-lock.json`; declare the existing tests' matching React 19.2.6 renderer dependency and reconcile root lockfile declarations with the manifest.
- Documentation: `docs/licensing-reorganization.md`.

## Verification — 20 September 2026

- PASS: `npm run test:curriculum`, `npm run test:licensing`, `npm run test:recaps`, `npm run test:overview`, `npm run test:competency`, `npm run audit:course`, and supplementary ordering tests.
- PASS: `npm run lint` (zero errors; one existing unused-variable warning in `scripts/test-assessment-ui.mjs`).
- Duplicate audit: all 296 canonical lessons preserved; zero duplicate lesson IDs, video IDs or normalized titles. Exact stage/group order, section endpoints, integrated anchors, C1 preservation and Professional-only relocations are asserted.
- BLOCKED: `npm run build` stops in its existing assessment UI prebuild check: `C1-02-M07 keeps an exam-ready model answer`. Neither that assessment content nor its quality assertion was changed. Theme prebuild checks pass (60 contrast pairs).
- PASS separately: `node scripts/prepare-reader.mjs` and `npx next build`, including TypeScript, production compilation and static generation. This does not constitute a pass of the normal build command or its assessment gate.
- No broad UI redesign, new regulatory numerical requirements, video playback audit or deployment was performed for this reorganization.
- Dependency installation reported 13 npm advisories; no broad dependency upgrades or automatic audit fixes were attempted in this curriculum-only change.

## Original implementation history — 10 September

### Before and after

Before: 16 topic modules mixed residential work, three-phase design, installation cases and specialist systems. After: 25 stages grouped into a C2 core, a subsequent C1 core and optional professional extensions. Original lesson IDs, titles, media, transcript sources, cards and lesson assessments remain intact.

| Path | Stages | Canonical lessons | Checkpoints |
| --- | ---: | ---: | ---: |
| C2 Core | 9 | 170 | 43 |
| C1 Core | 10 | 35 | 14 |
| Professional Extension | 6 | 71 | 21 |
| Total | 25 | 276 | 78 |

C2: foundations → architecture/drawings/safety → wiring/accessories → cable systems → protection/earthing/ADS → single-phase design → consumer units/installations → verification → faults → preparation.

C1: three-phase foundations → calculations → distribution → design → power-factor correction → motor principles/nameplates → starting/control/protection → earthing application → verification/periodic inspection → fault diagnosis → preparation.

Professional: specialist cables → advanced lighting → smart buildings/data/security → solar/storage/EV → specialist services → estimating.

Short C1 stages are deliberate topic boundaries, not claims that one video establishes competence. Their introductions, supporting videos and gap notices identify what further learning is needed.

## Important relocations

- Safe isolation, installation architecture, drawings and service detection precede practical wiring. Foundation instrument videos remain theory demonstrations and carry a supervision warning.
- Residential first/second fix, accessory selection, lamp technology and practical downlight selection join C2 wiring.
- Consumer-unit assembly and complete single-phase installation cases follow protection and design; case-study testing is a preview of the subsequent formal verification stage.
- Fault types, device operation, bonding, the fault path and ADS precede design checks.
- The existing three-phase SWA design example now follows the single-phase design workflow and three-phase fundamentals.
- Three-phase isolation, industrial connections, boards and project cases move into C1.
- Motor principles precede contactor/starter wiring; advanced correction follows AC power foundations.
- Specialist SY/MICC cable work, advanced lighting, KNX, solar, EV and estimating no longer block the licensing core.

## Approved supporting videos

Sixteen bundled supplementary videos are present: nine retained protection resources and seven newly added bridges. No duration, transcript, quiz or overview was fabricated for external resources.

New bridges:

| Video ID | Resource | Placement |
| --- | --- | --- |
| 8Z255dd78H4 | Cable-size selection and the OSG | C2-06 cable selection, after p06-l10 |
| TsJ49Np3HS0 | St John CPR | After C2 safe isolation, with electrical-incident introduction |
| UFvL7wTFzl0 | St John AED | After CPR, with electrical-incident introduction |
| NIrKOVZrqnU | Power factor explained | C1 correction |
| XbL0R_9KLD4 | IEC motor nameplate | C1 motor principles |
| HFkTPmY7N7w | DOL starters explained | Before C1 starter wiring |
| V6WR_TBf1AU | Selective coordination | C2-05 selection/coordination, after p05-l14 |

Existing approved resources reused rather than duplicated: wAcqKNBxy-w (p06-l05, three-phase cable design), pngNTsHmyY4 (p02-l02, consumer-unit architecture). Motor protection remains with C1 starters. AFDD and selectivity now belong to C2-05 special protection and device coordination respectively.

No canonical videos were deleted: the audit found zero duplicate lesson IDs, video IDs or normalized titles. Similar titles represent different methods, parts or worked examples, not automatically duplicates. Shared supplementary defaults merge by record ID or YouTube ID.

## Metadata, progress and navigation

- Stages have path, stageNumber and classification metadata. Stable lesson IDs remain the progress keys.
- Historical module and checkpoint records remain valid stored history. A previous pass counts toward a current checkpoint only when its ordered lesson coverage is identical. Changed module assessments and checkpoints get versioned IDs.
- Watched lessons are not reset. Old assessment results do not incorrectly certify a newly assembled scope.
- Supplementary placementRevision supports a one-time curriculum placement migration. Archive flags and later visitor moves are retained; a moved canonical anchor determines its new module.
- Licensing progress excludes optional professional checkpoints; professional lessons can be opened without first completing the licensing path.
- Home shows three pathway cards, counts and preparation access. The course map and lesson header identify path/stage. End-of-path lessons link to preparation.
- C2/C1 written practice samples existing questions across each stage, alongside oral/practical prompts and an optional countdown. Scores are separate from lesson/checkpoint results. It is course-authored revision, not an official EPRA paper.
- A course-core milestone requires all path videos, checkpoints and 80% in written practice; C1 additionally requires the C2 milestone. Neither is a licence or proof of practical competence.

## Recaps and learning support

All 276 lessons are covered once by the reorganized recap chapters. Unchanged chapter groups retain their curated copy. Changed groups use the included lessons' summaries and key distinctions, with existing detailed notes, equations and supplied transcript access preserved. No unrelated legacy chapter summary is used for a newly mixed group.

Added: electrical-shock safety context before CPR/AED, a C2 initial-verification overview, the linked Ib/In/Iz design chain and an interactive PFC kVAr example rendered with LaTeX.

The React review informed separate exercise/timer components, semantic controls, effect cleanup and responsive path cards. The existing Git-to-Vercel workflow is retained.

## Verification and limitations

- PASS: focused licensing checks — 276 identities/media preserved, no video duplicates, all 25 stages assigned, recap coverage, checkpoint scope migration, key prerequisites, 16 valid supplementary anchors, archive preservation and migration idempotence.
- PASS: course integrity audit — zero canonical duplicates and zero detected answer-in-prompt leaks.
- PASS: TypeScript and production Next build, including reader/transcript asset preparation.
- PASS: targeted lint for the new licensing UI/curriculum, course UI, checkpoint plan, recap assembly, assessment data and supplementary defaults.
- NOT CLEAN: broader lint reports existing supplementary-component effect/state rules and existing local variable naming in the supplementary API/component. These predate the curriculum changes and were not hidden with rule suppression.
- NOT CLEAN: the legacy curriculum regression stops at inherited question p16-l06-q-concept-4, whose wording violates its independent-prompt rule. Relevant structure/count/reference assertions were updated; the wording assertion was not weakened.
- Browser review: Home pathway cards, narrow-screen layout, C2 preparation and C1 lesson navigation/controls inspected locally. This was not an exhaustive playback or every-device test. The local shared-video API reports unavailable storage; the existing embedded core remains available. Remote storage writes and Vercel deployment readiness were not verified.
- Inherited editorial debt: 57 repeated question-stem groups and 57 repeated card-front groups remain. Reusing canonical questions for checkpoints/revision is intentional; the inherited lesson-bank repetitions are separately disclosed in course-integrity-audit.json. This change is not a complete bespoke question-bank rewrite.

## Genuine content gaps

Further authored and supervised work is needed for comprehensive C1 motor phase-loss/imbalance diagnosis, coordination studies, site-specific PFC/harmonics selection, practical first-aid competency and practical installation/testing assessments.

Authoritative current Kenyan/KEBS tables, regulatory requirements, EPRA eligibility, verified official exam/past-paper material and utility requirements must be supplied or independently verified before claiming full local licensing coverage. UK worked examples are learning sources, not Kenyan approval.

References linked in the application: EPRA competency publication (https://www.epra.go.ke/written-oral-interviews-areas-competency), St John electrical-shock first aid (https://www.sja.org.uk/first-aid-advice/electrocution/), Kenya NDMU emergency contacts (https://disastermanagement.go.ke/).

## Changed files

Curriculum: app/licensing-curriculum.ts, app/course-curriculum.ts, app/checkpoint-plan.ts, app/assessment-data.ts, app/module-recaps.ts.

Interface: app/licensing-ui.tsx, app/licensing.css, app/course-app.tsx, app/layout.tsx.

Supplementary integration: app/supplementary-defaults.ts, app/supplementary-model.ts, app/supplementary-videos.tsx, app/api/supplementary/route.ts.

Checks/report: scripts/test-licensing.mjs, scripts/test-curriculum.mjs, package.json, docs/course-integrity-audit.json, this report.
