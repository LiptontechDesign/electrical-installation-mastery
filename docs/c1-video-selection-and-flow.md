# C1 video selection and teaching order

Reviewed 14 October 2026. Curriculum revision 7 changes C1 only. C2 and Professional lesson identities, media and order remain unchanged.

The subsequent clarity cleanup removes all 40 C1 section-introduction paragraphs, shortens module summaries and retains only brief technical corrections beside relevant videos. Detailed selection reasoning stays in this review and the optional worked project. Video order, roles, identities and saved-course migration are unchanged.

## Result

C1 now has 40 populated sections across its existing ten modules, 49 catalogue entries and 13 supporting entries: 62 default study rows. Eight catalogue entries were added, including an intentional optional repeat of GSH’s C2 demand example. Seven YouTube videos are new to the course. Every previous C1 lesson and supporting-video identity remains available.

The order is supply/neutral → calculations → distribution/installation → demand/cables → fault protection → compensation → motor principles → controls → verification → diagnosis. The change splits broad groups and moves board workmanship out of earthing. Power-triangle teaching now precedes three-phase power examples. A standalone [four-storey worked study project](../public/c1-worked-project.md), linked from relevant lesson sections, carries one set of assumptions through the main steps. It is an authored training exercise, not an installation design approval or a claim that unrelated videos show one building.

## Selection method and limits

I read each selected video's complete available English transcript, confirmed its creator/title using YouTube’s public oEmbed metadata, checked its actual teaching sequence and independently recalculated the main numerical examples. The evidence manifest is [c1-video-review.json](c1-video-review.json), with creator URLs, retrieval dates, caption languages, hashes, time ranges and decisions. Full downloaded captions stay in ignored local research files rather than being redistributed here.

Public caption providers were YTTools and YTtoTranscript. Their generation type is not exposed; these are not claimed human-authored transcripts. Some candidates returned Arabic/Bengali translations or unusable recognition. Those were not treated as verified English transcripts. Caption punctuation, numbers and diagrams can differ from narration. This is a transcript-based editorial review, not frame-by-frame validation of every video or independent certification of an instructor. New displayed durations are explicitly approximate caption-end estimates, not invented exact YouTube durations.

UK teaching remains the main spine: Joe Robinson, eFIXX, GSH Electrical, John Ward and Learn Electrics. The narrow gaps in efficiency, capacitor-bank mathematics and reversing use English-language educators/manufacturer material from outside the UK. Their voltage/frequency and code limits appear beside the lessons. Samuel Smith’s bench demonstration is selected for its clear test procedure; his professional credentials and country have not been independently established, so he is not presented as a verified UK instructor.

## Accepted additions

| Lesson and creator | Transcript evidence | Why and where it fits |
|---|---|---|
| [Motor input, efficiency and current — Aaron Dahlen](https://www.youtube.com/watch?v=Jx3Pk_5O-PM) | 0:00–8:42; power flow around 1:15–2:40, input/apparent power and current thereafter | Separates shaft output, real input, PF and apparent power. The 75 hp, 460 V, η .95, PF .87 example gives about 85 A. Module 11; Scilab is optional calculator context. |
| [Maximum demand example — GSH Electrical](https://www.youtube.com/watch?v=lGcsQ8mLI34) | 0:00–5:08; method and restricted domestic scope throughout | Short refresher before the building phase schedule. Optional, intentionally repeats C2 p06-l11. The largest-plus-40% method is not extended to every building. |
| [Three-phase capacitor bank — Dieter Monkey](https://www.youtube.com/watch?v=q5xjqXcCqNw) | 0:00–17:06; 600 V network and bank calculations in the second half | Makes total kVAr, per-phase voltage and capacitance explicit. 72 kVAr at 600 V, 60 Hz gives about 530.5 µF per star capacitor. Module 15. The project supplies a practical target below unity at 400 V/50 Hz. |
| [Reversing with contactors — AutomationDirect](https://www.youtube.com/watch?v=VqgXVIi0jw8) | 0:00–6:15; phase exchange and both interlocks 0:00–2:11 | Explains why simultaneous contactors short phases and how the interlocks act. Module 17, after DOL wiring. Later NFPA/UL and product discussion is explicitly US context. |
| [Testing phase sequence — John Ward](https://www.youtube.com/watch?v=aDSY10l_ZqE) | 0:00–7:40; rotating field, identification, instruments and swapped phases | Teaches the reason for the test before the existing practical demonstration. Module 18. |
| [Three-phase IR sequence — Learn Electrics](https://www.youtube.com/watch?v=Xe9vD_a3qEE) | 0:00–5:27; five conductors and ten unique pairs | Adds systematic three-phase insulation testing after C2 isolation/continuity. Module 18. Sensitive equipment, instrument instructions and discharge are stated beside the lesson. |
| [Prospective fault current — GSH Electrical](https://www.youtube.com/watch?v=Ge7me58155E) | 0:00–6:15; L–N estimate, actual L–L readings, device capacity | Connects measurement to breaking capacity after Ze/PFC teaching. Module 18. Doubling L–N is identified as the video's assessment estimate, not a universal exact three-phase fault value. |
| [Disconnected motor tests — Samuel Smith](https://www.youtube.com/watch?v=Ap6fpJ58d5Q) | 0:00–5:51; winding comparisons to 3:20, IR thereafter | Clear bench comparison of three winding resistances, frame insulation and inter-winding insulation. Module 19. Its >200 MΩ display is a meter-range result, not a universal acceptance limit; the lesson does not prove every possible motor fault. |

## Existing supporting lessons

Required labels now follow teaching purpose while retaining the original supplementary IDs and progress keys. Essential worked examples, cable/voltage-drop teaching, capacitor placement, motor terminals, lost neutral, conductor tracing and the phase-loss concept are no longer automatically labelled optional everywhere. The balanced-power trigonometric derivation remains optional. Unrecognised personal additions remain optional.

Important qualifications are displayed in the player, including supplementary players, and in the project:

- Michel van Biezen’s current examples treat stated kW as electrical input. Apparent-power units must be VA/kVA even where narration says W/kW. Efficiency is added in the following dedicated lesson.
- Sparky Help’s BS 7671 three-phase cable example calculates required table capacity correctly, but the 44 A table value must be multiplied by correction factors to obtain installed Iz ≈ 32.52 A. Real termination-temperature and protection checks still apply.
- Learn Electrics’ voltage-drop method needs consistent line/phase references and its balanced-feeder assumptions. Lost-neutral teaching needs the distinction between RMS and peak voltage and between an impedance-dependent overvoltage and a fixed 400 V on every branch.
- The Electrical Guy’s motor-terminal demonstration follows the nameplate lesson. The displayed Δ/Y voltage and supply determine the permissible links; star–delta cannot be used indiscriminately on a 230/400 V motor at 400 V.
- The motor-sizing supporting video remains optional: its 125% breaker shortcut and omitted shaft-to-input efficiency are not adopted as design rules.
- The phase-monitor demonstration remains an optional circuit critique: placing a protective contact only in the holding branch can leave a Start bypass. It is not a wiring template.
- The earlier capacitor-sizing resource stays optional because available captions were corrupted. It is replaced in the core route by the verified three-phase bank lesson and independently checked target-PF project.
- The phase-loss video teaches the fault concept; its current multipliers are illustrative, not universal relay settings.
- The seven-floor design, domestic periodic EICR, smart-board product tour and thermal imaging remain labelled extensions/refresher/context. The domestic EICR is not claimed to be a three-phase commissioning capstone.

## Candidates excluded from the new core

These are editorial decisions about the requested self-study route, not general judgments of the creators. Numerical claims from captions were treated cautiously.

| Candidate | Decision |
|---|---|
| [Learn Electrics: PF/kVA/kW](https://www.youtube.com/watch?v=bXiE9bdFLsU) | Repeatedly conflates PF and mechanical efficiency (notably around 2:50–3:24 and 10:19–11:43). Excluded. |
| [Learn Electrics: motor plates](https://www.youtube.com/watch?v=VDvxtcdZdxw) | Similar PF/output-efficiency ambiguity around 5:11–6:30. Existing IEC plate teaching is retained instead. |
| [Completely Electrical: three-phase motor cable design](https://www.youtube.com/watch?v=pxqn3JFBuOo) | Detailed and connected, but around 26:08 gives an overload condition that can teach the wrong Iz/In relationship. Not selected as the unqualified core case. |
| [Sparky Help: demand/diversity](https://www.youtube.com/watch?v=7MhH-k6pEgI) | Around 14:02–16:54 averages unequal phase schedules and contains a doubtful worked diversity subtotal. The project uses the actual most-loaded phase instead. |
| [Broughton’s: cable sizing](https://www.youtube.com/watch?v=u8Gqg-ELF9Y) | Transcript has inconsistent inequalities/arithmetic and an insufficiently demonstrated final voltage-drop selection. Not selected. |
| [D. Leith: correction capacitance](https://www.youtube.com/watch?v=yHukB1aT36M) | Useful single-phase example, but rounding of the compensation current and motor-versus-supply-current language would need extra qualification. Not needed alongside the selected three-phase bank lesson. |
| [ProfMAD: correction](https://www.youtube.com/watch?v=WdJVXbyTwP4) | Describes the reactive share as lost power. Excluded. |
| [Big Mike H: motor troubleshooting](https://www.youtube.com/watch?v=xHWv173gUbk) | Returned translated captions; also includes isolation/protection ambiguity. Not adopted as a core safe-test method. |
| [Zack Hartle: PFC calculation](https://www.youtube.com/watch?v=4XXyrlpvGTw), [Actual Electrical Content: motor tests](https://www.youtube.com/watch?v=3ccwfO0T9_M) | Potentially valuable, but recovered captions were translated Arabic rather than verified English. Not represented as fully verified English selections. |
| XS Training DOL and high-resistance fault demonstrations | Captions unavailable through the checked public sources. Not added on titles alone. |

## Migration and verification contract

Revision 7 relocates only identified published rows that still occupy their old published sections. Explicitly edited IDs, placements elsewhere and custom relative order remain authoritative. Supporting descendants follow their root only when they have no distinct authored/personal destination. All 21 old C1 section IDs remain valid for historical Undo. New published sections are populated; a learner's intentionally emptied section remains available.

Existing core watched keys and supplementary YouTube-based watched/bookmark/note/resume keys are unchanged. A private copy of a newly canonical video is preserved, including archive status. Deleted IDs stay deleted. Curriculum reads do not write the database or consume an edit revision. Counts and continuous numbering include all active rows; required/optional labels provide context rather than silently removing optional videos from completion totals.

Tests include the real pre-change revision-6 snapshot, earlier revision migrations, custom placements/descendants, archives/deletions/Undo, retained private copies, progress IDs, English-caption provenance, project calculations, guest access and account APIs. See `npm run test:c1-learning` plus existing curriculum, personal-course and progress suites. Browser verification uses a local fixture account, never edits the user's live account. The supplied EPRA archive and generated question/answer slices are unchanged.

Verified locally: the Next.js production build and TypeScript check, ESLint with no warnings, C1/curriculum/licensing checks, the four earlier curriculum migrations, personal-course/API/supplementary/order/drag/progress/account-isolation/guest/architecture checks, and the EPRA source-fidelity suite. The EPRA check confirms 688 complete source pairs and 2,214 rendered formulas. Manual browser checks cover the essential supplementary player, retained notes and watched state, required/optional next-lesson labels, navigation from controls into testing, project-link targets and 390/320-pixel page widths. Browser testing used simulated account data; live Postgres and a live deployment were not exercised. A production guest preview is available locally while its server runs.

## Coverage limits to keep visible

The new route is a stronger self-study foundation. It does not establish professional competence through videos alone. C1 inherits the C2 foundations, and practical installation/testing needs supervised application. No single fully transcript-verified UK video was found that covers this exact four-storey design, commissioning and fault case end to end. The project connects the verified component lessons explicitly rather than falsely describing a domestic EICR or an unrelated board vlog as that capstone.

The project gives a closed arithmetic exercise and identifies the actual data needed for a real cable cross-section and regulatory acceptance. It does not fabricate current cable tables, manufacturer coordination or local legal approval. Check current EPRA scope against [EPRA's competency document](https://www.epra.go.ke/sites/default/files/2025-06/Written%20%26%20Oral%20Interviews%20Areas%20of%20Competency.pdf). Efficiency/PF/current relationships were cross-checked against [Schneider Electric's installed apparent-power guide](https://www.electrical-installation.org/enwiki/Installed_apparent_power_(kVA)); compensation coverage against its [power-factor-correction guide](https://www.electrical-installation.org/enwiki/Power_Factor_Correction).
