# Course flow review — 4 September 2026

The website keeps its 16-module structure and existing lesson tabs. Seven accepted videos bring the catalogue from 239 to 246 lessons (63 h 11 min). Twenty-five existing lessons move to a more suitable module; further ordering changes happen within modules. Original lesson/video identities and existing guide concepts remain intact, preserving saved lessons, notes, bookmarks and flashcard records. Module progress reflects the revised membership.

## Review method

Reviewed the existing lesson catalogue, all lesson guides, prerequisites, module checkpoints and book links alongside the supplied `EPRA_C1_UK_YouTube_Gap_Course.md`. New videos were checked through public YouTube metadata and indexed creator captions, with author, IET, Schneider Electric and current first-aid references used for the additional explanations. This was not a complete replay of 239 videos. The historical local transcript archive was not present in this checkout; the seven new caption records were archived outside the website and audited explicitly as new material.

The [placement ledger](COURSE_LESSON_PLACEMENTS.csv) records the old and new position of **every existing and added video**. [Video evidence metadata](COURSE_VIDEO_REVIEW.json) records each accepted addition. Original reference texts and captions are not copied into public pages.

## Findings and implementation

| Module | Finding and resulting flow |
| --- | --- |
| 1 — Foundations | Transformer operation lacked a dedicated visual explanation. Add a short animation after induction; put visual power-factor meaning before the existing mathematics. Bring the advanced power-triangle example beside that sequence and safe isolation before measurement demonstrations. |
| 2 — Building systems | Drawings arrived after many wiring exercises. Move single-line, riser and panel-schedule lessons here. Move the live Ze demonstration out to verification. |
| 3 — Practical wiring | Tools and ferrules were late; torque setup followed the consumer-unit exercise. Teach preparation first, then the existing diagram/practical pairs. |
| 4 — Cable systems | Motor starters interrupted containment. Group PVC, steel, capacity, SWA, lugs, specialist cables and installation methods. Move motor control to Module 7. |
| 5 — Protection | Teach earthing before ADS and loop interpretation. Move the bonding measurement to testing. Add one SPD component demonstration with a concise explanation of types, coordination and test limitations. |
| 6 — Design | Three-phase calculations preceded their foundations, and demand appeared after cable choices. Move the five three-phase foundation lessons here; follow with worked phase/power calculations, demand, current, cable capacity, voltage drop and breaking-capacity checks. |
| 7 — Motors and distribution | Add induction-motor operation, star–delta starting and VFDs. Sequence three-phase isolation → motor operation → contactor → existing DOL diagram → existing DOL wiring → star–delta → drive → building distribution. |
| 8 — Verification | Put instrument setup and dead tests before live tests, with insulation-test arrangements before the measurement. Add one periodic inspection case and move certification here, before complete projects. |
| 9 — Fault finding | Retain the existing evidence-led circuit, insulation, polarity and RCD investigations. No extra generic fault-finding videos. |
| 10 — Projects | Move load estimation before installation. Bring concealed-service detection before chasing and underground location before the external supply case. Follow first fix with second fix. |
| 11 — Residential detail | Existing route, accessory and client-specification lessons already deepen the project sequence. Retain them; service detection is now taught before the earlier practical project. |
| 12 — Lighting | Teach the visual brief before products. Reuse the three lumen-method lessons here, alongside specification and controls. No additional lighting videos: existing technology, drivers, dimming, colour, photometry, emergency and design cases are extensive. |
| 13 — Connected systems | Keep KNX introduction → ETS setup → programming; cable theory → test setup → MPTL; then CCTV, access, gates and life safety. No extra introductions. |
| 14 — Energy systems | Move multiple-source isolation before PV testing and inverter installation. Retain the detailed survey, storage, transfer, UPS and three-part EV sequence. |
| 15 — Building services | Retain the single-phase starter, complete pump panel, ventilation and lighting-surge applications. They apply the earlier motor/protection knowledge to specific systems. |
| 16 — Professional review | Put practical tools, terminations and certification where first needed. Retain thermal interpretation and the two estimating lessons as the professional conclusion. |

## Decisions on the supplied video list

| Proposal | Decision |
| --- | --- |
| G01 impedance | Already `p01-l24`; retain once. |
| G02 balanced neutral | Already `p07-l04`; move with three-phase theory to Module 6. |
| G03 star / G04 delta | Already `p07-l02` / `p07-l03`; move before the combined worked example. |
| G05 visual power factor | Add `Tv_7XWf96gg` (11:09) before the existing calculation. |
| G06 power-factor mathematics | Already `p01-l26`; retain and add a short correction exercise. |
| G07 induction motor | Add `59HBoIXzX_c` (15:33) before starters. |
| G08 another DOL introduction | Omit. Existing `p04-l19`, `p04-l20` and the later single-phase application already give diagram, wiring and applied control. |
| G09 star–delta | Add `h89TTwlNnpY` (11:08), with winding-voltage eligibility explained. |
| G10 VFD | Add `yEPe7RDtkgo` (15:17), distinguishing speed control from fixed-speed starting. |
| G11 another proving-dead demonstration | Omit. Reposition the existing single-phase and three-phase GSH isolation demonstrations before the relevant practical work. |
| G12 prospective fault current | Already `p08-l09`; retain once and place the three-phase application next to it. |
| G13 periodic inspection | Add `1tBICSsjVWo` (59:44) as a complete case after individual tests. Explicitly identify it as a 2018 UK case; do not adopt its codes as current local rules. |
| G14 SPD | Add `N-ocwOCoPfE` (07:01); explain why one manufacturer-specific test cannot certify a complete surge-protection arrangement. |
| G15 general first-aid course | Omit the broad, hour-long course. The title’s “Updated 2026” does not establish a fresh technical review of older footage. Add a concise emergency-readiness connection to isolation and link current Resuscitation Council UK guidance. Practical first-aid training remains a separate need. |
| Additional transformer gap | Add `UchitHGF4n8` (06:30), verified on the creator’s public YouTube listing. Existing supply and shaver-transformer applications did not replace a clear induction/turns explanation. |

## Written reinforcement

Thirteen optional explanations sit within Overview, collapsed initially: transformer turns ratio; power-factor correction; emergency readiness; identifying applicable rules; neutral harmonics; total three-phase power; motor nameplates/current/speed/slip; separate starter protection functions; star–delta eligibility; MCCB breaking capacity/selectivity; phase sequence; SPD system context; and interpreting historical inspection cases.

Three small interactive exercises isolate the important variables: power-factor correction at constant real power, motor speed versus frequency/pole count, and relative phase order. Eight authored application questions and cards reinforce the new calculations and decisions. Module assessments prioritise these applications while retaining their size limits. The existing book reader, DOL simulation, cable and RCD activities remain available; the periodic case links directly to inspection/testing reading.

## Source and scope decisions

Physical principles are distinguished from requirements. Current requirements are linked rather than guessed from old clause numbers. The [IET edition checker](https://electrical.theiet.org/bs-7671-18th-edition-wiring-regulations/ensure-you-are-up-to-date-with-bs-7671/) confirms Amendment 4:2026 and the transition ending 15 October 2026. Kenyan applicability remains a separate [EPRA](https://epra.go.ke/electricity-1), [KEBS](https://www.kebs.org/) and project-specific question.

Motor input current, compensation, neutral harmonics, SPD functions and breaker coordination are supported by the linked Schneider Electric Electrical Installation Guide sections. Transformer, power-factor and starting explanations also link the original creator’s articles. No universal motor setting, capacitor-bank specification, SPD pass value, inspection code or licence entitlement is inferred from a teaching example.

This strengthens an electrical-installation foundation. It does not claim professional competence in every specialist installation, a new legal compliance certification, or replacement of supervised practical work. Existing specialist awareness remains proportionate to the course; no separate gap module, library page or extra navigation was introduced.

## Verification

- Production build and TypeScript compilation.
- 246 unique videos; 16 consistent module totals; all 239 original lesson identities and existing cards retained.
- Explicit prerequisite-order checks, including isolation before measurements, motor foundations before starters, and PV isolation before tests.
- 1,580 questions/cards with lesson coverage; current module reviews include the new application questions.
- KaTeX render checks, independent numerical checks, invalid-input checks and React interaction tests for the three exercises.
- Existing learning and book tests; seven new caption-to-guide evidence checks. The full historical transcript audit is not claimed for this checkout.

Browser visual QA was not performed as part of this curriculum review. Responsive layout uses bounded SVG viewboxes, wrapping result rows, accessible labelled controls, local formula overflow and 44 px controls.
