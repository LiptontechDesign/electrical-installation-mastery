# Transcript-backed course integration — 10 September 2026

## Delivered

The supplied archive contains 20 usable transcripts. All 20 videos are now canonical lessons, with stable IDs derived from their YouTube video IDs. The previous 16 shared supplementary entries are not displayed a second time. The four further additions are radial circuits, ring circuits, soft starters and phase rotation.

- 296 unique canonical videos in 25 stages and 80 checkpoints.
- C2: 182 videos; C1: 41; Professional: 73.
- 78 individually authored new multiple-choice questions, each with three distinct distractors and option-specific teaching feedback.
- 98 independently worded flashcards, including one overview retrieval item per new lesson.
- Every addition has an overview, practical connection, ordinary embedded playback, watched tracking, quiz, checkpoint inclusion and module-recap source/notes coverage.
- 295 full supplied transcripts are available through the recap reader. The remaining original PVC video has no supplied transcript.
- Approximate new video durations use the final supplied caption timestamp, not independently measured video duration.

Longer technical explanations receive additional calculations and distinctions. The shortest demonstrations are not padded to a fixed question count. This update does not claim that all older course assessments have been re-authored or that every inherited repetition has been eliminated.

## Placement

| Stage | Integrated material |
| --- | --- |
| C2 architecture and safety | CPR, then AED after safe isolation |
| C2 single-phase wiring | Radial, then ring topology before socket installation |
| C2 protection | Device overview, fuses, MCB mechanism, curves, RCD, MCCB and Type 2 SPD |
| C2 circuit design | Cable-selection/voltage-drop worked explanation before the existing design sequence |
| C1 distribution | Phase-sequence concept bridge, then meter demonstration after three-phase isolation |
| C1 power factor | P/Q/S and correction explanation before the existing calculation lesson |
| C1 motor principles | Nameplate interpretation after induction-motor principles |
| C1 motor control | DOL explanation and MPCB before wiring; soft starter between star-delta and VFD |
| Professional services | AFDD and advanced selective-coordination webinar |

## Written bridges and presentation

Eight course-authored bridges address demand/utilization vocabulary, conductor identification, the instrument map, MCCB ratings, basic selectivity, APFC hardware, motor-protection layers and phase sequence.

These are explicitly identified as course-authored explanations, not instructor quotations or invented transcripts. Compact native disclosure controls preserve the normal player and reading layout. Responsive two-column notes collapse to one column on smaller screens. Concept sequences distinguish control from power paths. Equations use the existing KaTeX/MathML renderer. Bridges also appear alongside the relevant recap lesson notes.

Source corrections are visible before playback as well as in lesson review and recap notes. Important distinctions include RCD limitations, rated current versus instantaneous operation, fuse interruption duty, manufacturer-specific breaker characteristics, motor input versus shaft output, and controlled live measurement versus safe isolation.

## Progress and shared records

- Existing canonical lesson IDs, notes and marks are retained.
- Browser-local supplementary watched video IDs are imported once into their corresponding canonical watched lesson IDs. This does not award quiz passes.
- The migration flag preserves later “undo watched” actions and explicit resets.
- Previously expanded module/checkpoint/practice assessment records remain historical data; they do not count as passes on newly expanded scopes.
- Promoted visitor entries are excluded from the supplementary response, but retained in Blob storage on subsequent shared-library edits. Other visitor videos retain their move/archive behaviour.
- No remote content record was rewritten as part of this implementation.

## Evidence still needed

1. **Original PVC cable video:** https://www.youtube.com/watch?v=n4g153JhVnc — archive reports no captions. Existing lesson retained; no transcript invented.
2. **Suggested newer Artisan EICR case:** “7 EICR FAILS — Inspection and Testing DEEP DIVE.” The supplied suggestion links https://tradietv.uk/video/7-eicr-fails-inspection-and-testing-deep-dive/ but the 20 usable transcripts do not include it. Its direct YouTube ID was not verified. Existing periodic-inspection lesson remains; no fabricated replacement assessment.
3. **Adopted Kenyan conductor-identification requirements:** the accessible KEBS DKS 662-5:2026 document is a public-review draft. The bridge teaches the identification/evidence process but deliberately does not publish a draft colour table as an adopted requirement.

Other wider evidence gaps previously documented—current local standards/tables, verified official examination material, eligibility and supervised practical assessment—are not resolved by adding YouTube transcripts. This course is not EPRA approval or certification of competence.

## Sources used for clarification

- Supplied transcript files are preserved under course-transcripts/imported-2026-09-10 and linked by SHA-256 through the merged manifest and recap provenance.
- [St John Ambulance: CPR](https://www.sja.org.uk/first-aid-advice/cpr/) and [2025 adult basic life support guidance](https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/adult-basic-life-support-guidelines).
- [Schneider: demand terminology](https://www.electrical-installation.org/enwiki/Estimation_of_actual_maximum_kVA_demand).
- [Schneider: circuit-breaker characteristics](https://www.electrical-installation.org/enwiki/Fundamental_characteristics_of_a_circuit-breaker) and [additional ratings](https://www.electrical-installation.org/enwiki/Other_characteristics_of_a_circuit-breaker).
- [Schneider: coordination](https://www.electrical-installation.org/enwiki/Coordination_between_circuit-breakers).
- [Schneider: fixed and automatic correction](https://www.electrical-installation.org/enwiki/Equipment_to_improve_power_factor); exact PowerLogic CT guidance is linked in the APFC bridge.
- [Megger: instrument functions](https://www.megger.com/en/type/low-voltage-installation-testing/multifunction-installation-testers).
- [Fluke 9040 manual](https://assets.fluke.com/manuals/9040____umeng0100.pdf).
- [KEBS public-review draft, explicitly not treated as adopted law](https://www.kebs.org/wp-content/uploads/2026/03/DKS-662-5-2026-PRD.pdf).

## Focused verification

- Full supplied-transcript preparation and SHA-256 validation passed.
- Licensing integration check passed: unique catalogue, legacy preservation, exact recap/checkpoint coverage, addition placement, authored choices/feedback, KaTeX formulas, supplementary deduplication and idempotent watched migration.
- TypeScript and lint of the new content/bridge components passed.
- Production Next.js build passed.
- No agents, browser walkthrough, broad legacy test suite or Vercel monitoring used.
- Deployment uses the existing main-branch Git integration. A pushed commit is not a claim that the remote deployment has already finished.
