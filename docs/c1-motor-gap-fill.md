# C1 motor gaps: reviewed English video additions

21 October 2026 · additive curriculum revision 13 · follows the [motor transcript audit](c1-motor-transcript-audit.md).

Twelve videos (2 h 57 min 04 s) are added in ten focused sections across existing Modules 6, 12, 13 and 17. No existing video is removed or moved. Stepper and servo foundations now count as core because they appear in the reviewed paper requirements. There are no additional student-facing section preambles.

## Selection and language

UK teachers were searched first, followed by suitable Canadian, US and manufacturer teaching. Hindi lessons and a Hindi-original NPTEL video with an English auto-dub were rejected. The one India-based exception is Education 4u’s synchronous hunting lesson: original/default English audio plus English ASR are verified. Broader UK and other non-India searches did not produce a suitable available English-caption alternative. Teacher location is recorded as source context, not a measure of technical ability.

All twelve complete available English caption exports were read before selection. The [JSON ledger](c1-motor-gap-video-review.json) records hashes, caption end times, language/track evidence, teaching flow, qualifications and rejected candidates. Caption review is not a complete listening or frame-by-frame review. Eight selected videos lack original-audio metadata in the retrieved player response; their English transcript and English-teaching source support selection, but this is explicitly weaker evidence than a verified original-audio track. Captions ending before an end card do not establish unseen content. No full copyrighted transcripts are redistributed.

## Placement and learning sequence

| Module / section | Lesson | Why this position / coverage |
|---|---|---|
| c1-pfc / c1-pfc-single-phase-worked | [Red Seal Electrician](https://www.youtube.com/watch?v=MWCqtJfQUt0) | Unity and 0.91-lagging targets; input S/P/Q, unchanged active power, capacitor var, current, reactance, µF and new supply current. |
| c1-pfc / c1-pfc-automatic-bank | [Festo Didactic – LabVolt Series](https://www.youtube.com/watch?v=FyGr8yMOGf8) | Schematics to a four-step delta bank, CT/voltage feedback, contactors, relative 1:2:2:2 steps, target PF, delay/deadband and changing load. |
| c1-pfc / c1-pfc-static-var | [ABB production / Smart & Green Technologies](https://www.youtube.com/watch?v=Z2S0QfoiGmc) | Thyristor-controlled reactive support using reactors, capacitors and a control system. |
| c1-motors / c1-motors-wound-rotor | [Zack Hartle](https://www.youtube.com/watch?v=Bstjh1gMUYk) | Conventional stator, wound rotor, brushes/slip rings, resistor bank, starting-current/torque benefit, resistance removal, cost/maintenance and inefficient resistance speed control. |
| c1-motors / c1-motors-single-phase-types | [Red Seal Electrician](https://www.youtube.com/watch?v=utbt6_XK4C8) | Resistance-split-phase, capacitor-start and capacitor-start/run; phase angle versus starting torque, run-capacitor PF benefit, centrifugal switch, dual-voltage wiring and reversal. |
| c1-motors / c1-motors-single-phase-types | [Jeremy Fielding](https://www.youtube.com/watch?v=2XYdTogWcIA) | Pulsating field and no initial net torque, auxiliary phase shift, start capacitor/switch and the shaded ring producing a travelling flux component with low starting torque. |
| c1-motors / c1-motors-synchronous | [Jim Pytel](https://www.youtube.com/watch?v=wlj4Oy6aw6A) | DC field versus AC stator, slip rings, constant synchronous speed, load/torque angle, pull-out, starting methods, V/inverted-V behaviour and measured lagging/unity/leading operation. |
| c1-motors / c1-motors-hunting | [Education 4u](https://www.youtube.com/watch?v=etgmqvrKgYA) | Hunting/phase swinging, damped versus undamped load-angle graphs, shaft/current/heating effects, load/supply/field/torque disturbances and mitigation. |
| module-07 / c1-controls-no-voltage-release | [bigclivedotcom](https://www.youtube.com/watch?v=vMCXb7AoPnU) | Magnetic holding, Start/Stop, supply-failure release, no automatic restart on supply return and comparison with contactor/auxiliary three-phase control. |
| module-07 / c1-controls-star-delta-circuits | [Jim Pytel](https://www.youtube.com/watch?v=DpB-kdM2RA4) | Power circuit, coil/holding circuit, interlocks, Stop/overload, manual Start/Run, speed transition, open-transition current and correct rotation. |
| module-07 / c1-controls-star-delta-circuits | [Jim Pytel](https://www.youtube.com/watch?v=aCDD_IHUnro) | On-delay contacts, holding and reset; fully traced timed star–delta Start/Stop/overload/interlock circuit, followed by soft-starter run/bypass/brake timing. |
| c1-faults / c1-faults-motor-diagnosis | [eMotors Direct](https://www.youtube.com/watch?v=R7hpQia0WXc) | No-start decision path through free shaft/load, overload, wiring, motor-terminal voltage, fuse/switch/contact losses and windings; then speed, heating, noise and phase loss. |

The manual star–delta lesson is deliberately followed by its timed-control sequel: one does not substitute for the other. The winding/torque lessons precede both. The NVR demonstration follows the complete DOL circuit. Diagnosis follows the existing phase-loss and isolated-winding test lessons. North American supply values and lead markings are examples; use the actual question and manufacturer diagram.

## Follow-up against the paper audit

| Audit item | Added teaching / remaining boundary |
|---|---|
| Wound rotor / slip-ring resistance starting (missing) | Direct construction, circuit, current/torque and resistance-removal teaching is added. |
| Synchronous hunting (missing) | Direct definition, graph, causes, effects and damping teaching is added after the synchronous foundation. |
| Star–delta control (partial) | Full manual ladder plus timed sequel trace holding, interlocks, Stop/overload and transition. Students still practise drawing their own labelled circuit. |
| Synchronous field/PF and pull-out (partial) | Explanation and repeated measured tests now connect field current, reactive power and load angle to loss of synchronism. |
| Single-phase comparison (partial) | Resistance-start, capacitor-start/run and shaded-pole operation and torque are explicitly compared; run-capacitor PF benefit is explained. |
| DOL NVR completeness | Working switch and three-phase holding-circuit equivalent explicitly show power-loss release and intentional restart. NVR is not isolation. |
| Target PF to microfarads (partial) | Two complete input-current examples reach capacitor var/current/reactance/µF and new supply current. Existing efficiency lesson supplies shaft-output-to-input conversion; no claim that the new video demonstrates that entire chain. |
| Capacitor bank drawing (partial) | Four-step schematic, feedback and observed switching added. The exact paper motor-feeder brief still needs learner application. |
| Two correction alternatives (partial) | Existing synchronous condenser plus new SVC principle supply two alternatives. No phase-advancer lesson claimed. |
| Humming/no start (partial) | New symptom-to-check route adds low voltage and mechanical loading to existing phase-loss and bench-test teaching. Complete site repair/handover remains unobserved. |
| Sewing-machine wattage (missing) | Still model-specific. No universal rating or unsuitable video added just to force closure. |

These are targeted follow-up judgements, not a fresh authenticated marking scheme or proof of every C1 paper ever issued. The original audit has seven readable paper extracts and two register-only records; oral weighting and a guaranteed grade cannot be inferred.

## Accuracy checks and restrained qualifications

The independently recomputed 120 V, 60 Hz examples use Qc = P[tan(acos(PF₁)) − tan(acos(PF₂))] and C = Qc/(2πfV²). The 12 A, 0.7-to-unity example gives about 189.43 µF and 8.4 A corrected supply current. The 20 A, 0.4-to-0.91 example gives about 324.62 µF and 8.79 A. Motor-branch current and mechanical working power do not automatically decrease. Shaft output requires Pin = Pshaft/η first.

The [ABB Softstarter Handbook](https://library.e.abb.com/public/6b4e1a3530814df0c12579bb0030e58b/1SFC132060M0201.pdf), printed pages 9 and 13–15, supports the resistance-starting principle and star–delta voltage/current/torque distinction. Compared with direct delta at the same supply, star winding voltage/current are about 58%, while starting line current and ideal torque are about one-third. No universal 5 kW DOL threshold is taught. Existing DOL/MPCB notes were clarified, and the earlier power-animation title now accurately identifies its scope.

Short lesson notes qualify consequential source limitations: start versus run capacitor duty, training-bank CT scaling, equipment-specific torque/current limits, interlocking/dead time, and energised hand-start demonstrations. The latter is a concept demonstration, not a student test procedure. The new diagnosis lesson does not establish universal no-load current, cable-length or insulation-test acceptance values.

## Saved-course behaviour

The actual previous 503-row published state is frozen in the regression fixture. The additions retain revision 13 and all prior section IDs and membership. Existing placements, private videos and descendants, archive/deletion choices, progress keys, receipt history and Undo must survive. New occurrences start unwatched. English/audio source evidence is recorded in research documentation, not inserted as a product workflow.

## Validation

Passed: additive migration and selection regression, all C1 curriculum suites, course integrity, licensing and prior placement migrations, personal-course model/API and browser conflict checks, account isolation, guest access, learner-state/progress, protected EPRA source hashes, Past Papers, TypeScript and lint. Next.js production and Vinext production builds pass. Vinext retains its existing bundle-size/static-route-analysis notices. Theme contrast and definition-source checks pass.

The new browser check visits all twelve matching lesson/iframe IDs on desktop and 390 px phone layouts, verifies section order and notes, preserves existing account data, and checks guest access. Screenshots were inspected. The local fixture replaces YouTube playback and account persistence: it does not prove live playback in every country or exercise live Postgres. The older conflict script needed to open the existing collapsed Course tools menu before Add video; its stale-tab and mobile checks now pass.
