# C1 protective-device foundations

Added 21 October 2026 as C1 **Module 10: Protective Devices and Coordination**, after Earthing and Fault Protection and before Submains and Board Installation. Motor Principles is now Module 12 and Motor Starting, Protection and Speed Control is Module 13. This introduces device functions before their building and motor applications; it does not move detailed starter wiring ahead of motor fundamentals.

15 lessons (13 core, two optional demonstrations), nine sections, 2:20:59. Eight videos are new media; seven are intentional repetitions of existing course resources. Original lessons remain in place. The learner requested repetition where it makes a coherent sequence.

## Sequence and selection

| Section | Selected lessons | Why here |
|---|---|---|
| Fuses and HRC Protection | [GSH identification and construction](https://www.youtube.com/watch?v=rijmYhVeUNs), [optional eFIXX heating experiment](https://www.youtube.com/watch?v=iHjWlO0JKyQ) | Physical identification before current/time behaviour. |
| MCBs and Time–Current Curves | [eFIXX complete MCB explanation](https://www.youtube.com/watch?v=iVZhVeFoSfk) | Thermal and magnetic mechanisms before B/C/D curves, inrush and fault levels. |
| MCCBs | [The M&E Engineers, episode 1](https://www.youtube.com/watch?v=yzXROOX2LfI) | Frame, trip settings and Icu/Ics extend the MCB foundation. |
| ACBs | [The M&E Engineers, episode 2](https://www.youtube.com/watch?v=ILE7RM604CQ), [optional Siemens component recognition](https://www.youtube.com/watch?v=OWygTF_BO3E) | Same presenter's sequel, followed by a manufacturer equipment example. |
| Residual-current protection | [eFIXX principles and waveform types](https://www.youtube.com/watch?v=bXS-uNxeTXo), [RCCB versus RCBO](https://www.youtube.com/watch?v=eWaNJ-VD5m0), [three-phase balance and neutral](https://www.youtube.com/watch?v=tBjIVDu6YHo) | Principle → combined device → three-phase application. |
| Surge protection | [eFIXX SPD fundamentals](https://www.youtube.com/watch?v=7en_Rc14c2g) | Distinguish transient suppression from fault-current interruption. |
| Selectivity and coordination | [LEARN ELECTRICS](https://www.youtube.com/watch?v=lOcbVQgCSpM) | Compare upstream and downstream devices after learning their functions. |
| Overcurrent relays | [OMICRON](https://www.youtube.com/watch?v=bQ6fZrrP0H4) | Clear CT → relay → breaker explanation, with pickup and time delay. |
| Motor protective devices | [Automatedo overload relay](https://www.youtube.com/watch?v=3aur1tZYlKE), [Afshin MPCB mechanisms](https://www.youtube.com/watch?v=1DDsOJa_FuU), [ATO phase monitoring](https://www.youtube.com/watch?v=sO2RPcGLshA) | Heating and contactor trip → integrated breaker mechanisms → voltage/phase supervision. Detailed starter wiring follows in the motor modules. |

Every selected video's complete available English caption track was read. Selection considers whether a beginner can follow the explanation, prerequisites and terminology. This was a transcript review, not a complete visual-production or hands-on equipment assessment. Public YouTube oEmbed confirmed titles/authors on the review date; it does not guarantee playback in every region. [Review metadata](c1-protection-video-review.json) records caption ranges, hashes, selection reasons, technical qualifications and rejected alternatives. Copyrighted transcripts stay in ignored research files.

Several otherwise useful lessons generalise equipment ratings or historical UK rules. Short existing-style study notes qualify these at the point of use: no universal 800 A MCCB/ACB boundary; Icu/Ics and actual trip settings matter; 30 mA is not a safe touch current; Type B RCDs do not universally require neutral; one overload-curve point does not prove full selectivity; never open an energised CT secondary; a monitoring relay operates a contactor rather than interrupting motor fault current. The phase-monitoring contact must remain effective while Start is held. The old optional phase-relay circuit critique remains explicitly labelled in its original motor section.

AFDD teaching already exists in C2. The additional historical UK AFDD application clip was not repeated because its regulatory discussion adds little to this C1 foundation. The new module does not claim every available specialist protective device is compulsory for EPRA C1.

## Course and past-paper gap check

C2 already teaches fuses, MCB curves, RCD/RCCB/RCBO principles, SPD and AFDD, with supporting selectivity material. C1 already has earthing/RCD applications, an MPCB comparison and motor starters. ACBs and MCCBs appeared incidentally in recent building examples; there was no focused ACB foundation or standalone overcurrent-relay introduction. Three-phase residual-current balance also lacked a dedicated lesson. The new sequence makes those gaps explicit and gathers the relevant foundations before motor applications.

The existing [past-paper register](past-paper-research.md) lists eight C1 public archive copies. Relevant public question text was checked again on 21 October:

- [June 2025](https://www.scribd.com/document/1013156754/Class-C-1-Written-Exam-June-2025), Q3(b): MCB, MCCB, ACB and RCD uses/ratings; Q5(d): building single-line diagram with a 120 A TPN MCCB.
- [May 2025](https://www.scribd.com/document/1013156811/May-2025-C1-written-interview-Jr), Q5(c), and [May 2022](https://www.scribd.com/document/941499251/May-2022-C1-exam-marking-scheme), Q5(c): thermal overload, overcurrent and phase-failure relay functions.

These are third-party archive copies, not a newly authenticated official EPRA exam archive or a promise of future questions. The original practice archive and independently authored past-paper answers were not edited. The official competency PDF had previously been reviewed for the [C1 route](c1-focused-modules.md); attempts to retrieve it again for this task timed out, so this update does not claim a fresh official-PDF review.

Three-phase 415 V uses the same broad protection families, with suitable poles/common operation, voltage rating, current range and fault duty. It does not automatically require MCCBs instead of MCBs. C1 study adds emphasis on larger distribution breakers, coordination and motor protective relays. A contactor, isolator or ATS is not by itself an automatic fault-protection device.

Technical cross-checks: [Schneider on multipole common tripping](https://www.se.com/uk/en/faqs/FA166896/), [MCCB markings](https://productinfo.se.com/compactnsxuserguide/viewer?docidentity=D-SE-0068738&extension=xml&lang=en&manualidentity=UserGuidePacTSeriesComPacTNSXCircui-67530380), [manufacturer coordination guidance](https://www.electrical-installation.org/enwiki/Coordination_between_circuit-breakers), [ABB residual-current technical guide](https://library.e.abb.com/public/9f0e99de3bc740288bc41ab95667f72f/RCD%20Technical%20Guide%20EN.pdf), [OMICRON's English overcurrent material](https://www.omicronenergy.com/en/video-channel/?tx_solr%5Bfilter%5D%5B0%5D=product%3AOvercurrent&tx_solr%5Bfilter%5D%5B1%5D=language%3AEnglish), and [ATO's monitoring-relay explanation](https://www.ato.com/monitoring-relay-basics).

## Saved courses and verification

The change is additive within curriculum revision 13. Existing section IDs, lesson identities, groups and private content remain intact; current normalisation supplies the new sections without replaying old placement migrations. Repeated videos have new lesson IDs, so existing watched marks do not silently complete the new module. The C2 supplementary selectivity row remains available. Personal copies of the same media, including archived parents and their descendants, survive.

`test-c1-protection.mjs` checks the actual previous 488-row published snapshot, exact existing group order, independent progress, private copies, earlier Undo, moves/deletion and review evidence. Existing course, historical migration, account, guest and protected-source suites remain part of validation. Browser fixtures check embeds, section ordering, responsive layout and saved learner records; the YouTube API is simulated and real Google/YouTube playback is outside that check.

Validation passed: the new protection suite; curriculum/licensing and all earlier curriculum-migration suites; personal-course/API, account isolation, guest access, learner-state, mixed progress, supplementary duration, theme, architecture, immutable EPRA and Past Papers checks; ESLint and TypeScript; Next.js and Vinext production builds. Vinext retains its existing large-chunk warning. The new browser suite passed for all 15 lessons on desktop and phone and for guests, with screenshot inspection. The existing section-watched browser suite also passed, including Cancel/Escape/focus, exact section scope, filters and guest restrictions. Running the two build targets changes generated route types; Next type generation was rerun before the final standalone TypeScript check.
