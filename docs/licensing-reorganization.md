# C2 → C1 curriculum implementation

Implemented 10 September 2026 from the supplied licensing-stage plans.

## Before and after

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
| 8Z255dd78H4 | Cable-size selection and the OSG | C2 design, before p06-l01 |
| TsJ49Np3HS0 | St John CPR | After C2 safe isolation, with electrical-incident introduction |
| UFvL7wTFzl0 | St John AED | After CPR, with electrical-incident introduction |
| NIrKOVZrqnU | Power factor explained | C1 correction |
| XbL0R_9KLD4 | IEC motor nameplate | C1 motor principles |
| HFkTPmY7N7w | DOL starters explained | Before C1 starter wiring |
| V6WR_TBf1AU | Selective coordination | Professional building services |

Existing approved resources reused rather than duplicated: wAcqKNBxy-w (p06-l05, three-phase cable design), pngNTsHmyY4 (p02-l02, consumer-unit architecture). Motor protection moves with C1 starters; AFDD/selectivity remain specialist extensions.

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
