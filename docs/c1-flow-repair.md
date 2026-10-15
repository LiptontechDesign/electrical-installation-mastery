# C1 prerequisite and flow repair

Reviewed 15 October 2026 · curriculum revision 10.

The fresh review found prerequisite jumps within the existing C1 sequence. This update adds **six new YouTube videos and eight C2 repeats**, then reorders the affected teaching. C1 now has **78 sections and 131 default video entries**. All videos use the existing lesson/player format. No section introductions or new teaching-text panels were added.

## Teaching chains

| Area | Revised sequence and purpose |
|---|---|
| AC foundations, Module 10 | Generation → sine waves/frequency → RMS/peak → resistive, inductive and capacitive loads → electric/magnetic energy storage → current/voltage waveforms → phasors → three-phase supply. Learners encounter the physical behaviour before its rotating-vector representation. |
| AC calculations, Module 11 | Frequency/inductance/capacitance experiments → fluorescent-lamp demonstration → scaled voltage diagram → voltage triangle → impedance → reactive energy → power triangle and calculations. The real choke's resistance explains why the ideal right-angle result differs from the measured supply. |
| Transformers and measurement, Module 11 | General transformer principles, ratios, EMF and efficiency precede current transformers and wattmeter connections. Wheatstone/Lorenz content is labelled as bridge measurement and apparatus, matching its actual scope. |
| Power-factor correction, Module 15 | Concept → target power factor → calculation → capacitor-bank application. Optional complex-number arithmetic and conjugates then prepare the existing advanced combined-load worked examples. |
| Motors, Module 16 | Rotating field and motor construction → slip/rotor frequency → an illustrated torque–speed introduction → starting and application teaching. The more demanding NPTEL torque–slip analysis is optional further study at the module's end. |
| Lightning, Module 14 | A short physical strike-path model precedes the existing surge-protection foundation. The long data-centre lightning/bonding application is a separate optional section. The model introduces a principle; it does not teach complete lightning-protection design. |

Medium-voltage switchgear is explicitly labelled with its voltage scope. The industrial-outlet testing heading promises loop-impedance measurement, matching the demonstration.

## Added selections

| New video | Role |
|---|---|
| [The Engineering Mindset — capacitors](https://www.youtube.com/watch?v=X4EUwTwZ110) | Plates/dielectric, charge/discharge and electric-field energy before phase relationships. A short note distinguishes polarized DC examples from AC-rated motor/PFC capacitors. |
| [Afrotechmods — inductors](https://www.youtube.com/watch?v=NgwXkUt3XxQ) | Series-RL demonstration of magnetic-energy storage and opposition to **changing** current. |
| [BSEPolyU — induction motor and torque–speed curve](https://www.youtube.com/watch?v=8T53wEGiBKE) | Visual bridge from rotating field/slip to starting, pull-up and breakdown torque and the load operating point. Final NEMA classes are identified as US examples. |
| [The Royal Institution — lightning-rod demonstration](https://www.youtube.com/watch?v=UKe1LaMLWTY) | Brief physical introduction to a continuous strike path to earth. |
| [EEVblog — complex numbers for electrical engineering](https://www.youtube.com/watch?v=GfihUkWPCQQ) | Optional rectangular/polar forms, magnitude, angle and arithmetic before advanced AC examples. |
| [Khan Academy — complex conjugates](https://www.youtube.com/watch?v=dbxJ6LD0344) | Optional sign change and multiplication; the course note connects mathematical i to electrical j. |

Eight Joe Robinson C2 lessons now also appear in C1: load types; current/voltage waveforms; three reactance experiments; the fluorescent-lamp phasor demonstration; scaled drawing; and voltage-triangle calculation. Their original C2 entries remain intact. See the [complete ordered sequence](c1-study-sequence.md) and [selection manifest](c1-flow-video-review.json) for all fourteen identities and placements.

## Evidence and limits

Complete available caption text was read for each selection. Eleven selections had English caption tracks. The capacitor, inductor and conjugate selections were reviewed through translated tracks (Albanian, Arabic and Arabic respectively); original English captions were not obtained for those three. The publisher's [English capacitor explanation](https://theengineeringmindset.com/capacitors-explained/) and [English conjugate example](https://www.khanacademy.org/math/college-algebra/xa5dd2923c88e7aa8:complex-numbers/xa5dd2923c88e7aa8:complex-conjugates-and-dividing-complex-numbers/v/complex-conjugates-example) supplemented the checks. This is not a claim of frame-by-frame review or original-English transcript review for the translated tracks.

The manifest records language, reviewed extent, transcript hashes and qualifications. Full third-party captions stay in ignored local research files. Some durations use caption endpoints as estimates; the player can supply the actual runtime. A malformed final conjugate-caption duration was bounded to the observed 4:01 video runtime; the underlying text hash remains unchanged.

All six new videos played successfully in the existing embedded player on a local production build in guest mode. The manifest records the observed playback state and duration; this short functionality check is separate from the caption-based content review. The capacitor and lightning runtime labels were refined from these observations.

Independent arithmetic checks cover the 195 V/125 V triangle (approximately 231.62 V), inductive and capacitive reactance, and the conjugate product. These checks and the caption review address the identified flow gaps; they do not establish complete EPRA coverage, replace supervised practical assessment, or verify Kenyan compliance details. The earlier [gap-fill review](c1-gap-fill-selection.md) retains its broader coverage limits.

## Saved courses and verification

Revision 10 reuses the existing placement migration with explicit previous/current groups. Unedited published groups receive the new chain; explicit personal destinations and custom relative order remain authoritative. Stable old lesson IDs, private copies, supporting descendants, archived/deleted items, account progress and historical Undo records survive. C2 and Advanced catalogue metadata are unchanged.

`node scripts/test-c1-flow.mjs` verifies migration from the actual published revision-9 snapshot, all previous identities, exact new placements, optional roles, prerequisite order, private attachments/copies, edits/removals, Undo, legacy documents and caption qualifications. The existing curriculum, placement, personal-course and account suites cover the shared implementation.

The Next.js production build, ESLint, C1/curriculum/migration/account suites and protected past-paper/practice checks pass. The optional definitions-export freshness check fails on unchanged repository inputs; the current exported definitions and source Markdown already differ. No definition source or export was changed in this update.
