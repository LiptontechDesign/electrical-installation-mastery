# C1 generators: foundations, physical equipment and standby supplies

Reviewed 19 October 2026 · curriculum revision 12.

The old generator section began with droop/isochronous control, then excitation hardware and a power analogy. Those clips assumed the learner already understood a generator set. Revision 12 adds **seven videos**, puts the complete set before its controls, retains the short power recap and makes the two specialist clips optional. The eight core videos total **46 minutes 38 seconds**. This connects the foundation to UK equipment demonstrations; it is **not a complete generator installation and commissioning practical**.

## Study order

| Stage | Selected video | Length | Reviewed teaching |
|---|---|---:|---|
| Module 11, 1 | [saVRee: Diesel Generators Explained](https://www.youtube.com/watch?v=aeUhT7wuNpI) | 5:13 | Complete set, engine/alternator, normal/emergency use, cooling, energy conversion, rotor and stator. |
| Module 11, 2 | [Graham Dudgeon / MATLAB: Introduction to Synchronous Generators](https://www.youtube.com/watch?v=gf8Pn2jpJiA) | 9:24 | Field/stator output, poles/speed/frequency, loading before controls, governor and AVR responses. No MATLAB programming or machine construction exercise. |
| Module 11, 3 | [WellandTV: kW, kVAR and kVA](https://www.youtube.com/watch?v=Lc-u37_gfIg) | 1:23 | Recap of engine and alternator limits, after the complete explanation. |
| Module 18, 1 | [Shenton Group: Installing Backup Generators in Plant Rooms](https://www.youtube.com/watch?v=uexkXQ_I7iE) | 4:10 | Airflow, exhaust, noise, access, cable route/distance and fuel access. Planning explanation. |
| Module 18, 2 | [John Ward: Generator Earthing Types — TN-S or IT?](https://www.youtube.com/watch?v=mzCGE5wnWos) | 14:57 | Isolated versus referenced output; metallic fault path versus reference electrode; three-phase L1/L2/L3/N/PE diagrams. |
| Module 18, 3 | [Blades Power Generation: Motorized Changeover Switch](https://www.youtube.com/watch?v=MfR2Y34U7Ww) | 2:14 | Physical four-pole mechanism, manual handle, simulated source availability, start signal, delays, transfer and return. |
| Module 18, 4 | [Pleavin Power: Initial Generator Operation](https://www.youtube.com/watch?v=cwBzqfZRn3I) | 5:42 | Real set, fluids, battery, controller, alarms, output breaker, off-load starting and emergency-stop check. Assumes installed output wiring. |
| Module 18, 5 | [ThePowerSite: How an ATS Works with a Generator](https://www.youtube.com/watch?v=jwBI-rd3-I4) | 3:35 | Connected generator/ATS/consumer-unit/lamp rig. Failure, starting, transfer, restored mains, return and cool-down; power versus control/charging cables. |

The first three form a **16-minute foundation**, following Module 10 AC/three-phase/neutral study and Module 11 power/current/efficiency calculations. They precede transformers. The complete set appears before relying on its control functions.

The five UK application lessons form one coherent section at the end of Module 18. Cable selection, protection, earthing, industrial connectors, motor starting and verification have already been taught. The section applies those skills to a standby source before fault diagnosis. It would be premature immediately after basic three-phase theory.

The original governor and excitation IDs remain in `c1-generator-further-controls`, near the end of Module 11, labelled optional. Neither specialist clip establishes the new beginner foundation.

## Theory-to-practical coverage audit

Treat the whole course as the learner's source, including its C2 foundations. Selected repeats in C1 do not make every earlier safety and earthing lesson unnecessary.

| Necessary skill | Course evidence | Remaining limitation |
|---|---|---|
| Identify the set and explain energy conversion | New overview; real equipment in pre-start lesson | Not engine-maintenance training. |
| Explain governor, AVR, frequency and power limits | New operating explanation, power recap, existing three-phase calculations | No complete generator load-schedule/motor-starting sizing example in the new videos. |
| Plan location, airflow, exhaust and cable route | Shenton; earlier cable/CPC/voltage-drop/protection teaching | Actual clearances, fuel and protection depend on site/equipment. |
| Recognise connectors and distribution | Existing GSH `p02-l11` plug/socket connections, eFIXX connectors, submain/board assembly; new connected ATS rig | The rig does not show every generator outlet/inlet/changeover termination being made. |
| Explain conductors and fault-return path | John Ward diagrams after earthing/ADS foundations; four-pole mechanism | Establish neutral switching/bonding for the actual arrangement. |
| Inspect and electrically verify | Earlier continuity, insulation, polarity, phase-sequence, loop/fault-current, RCD and electrode-testing demonstrations | No selected video performs every test on the same standby installation in both modes. A lamp relighting is not complete verification. |
| Start, transfer, restore and recognise stops | Pleavin pre-start/emergency-stop lesson; connected ATS/load demonstration | Follow actual instructions for shutdown, loading and settings. Practical competence is not assessed. |

**Open practical gap:** a suitable concise UK capstone must still show the complete power path being terminated, the approved neutral/earthing arrangement, verification under both sources, loading/phase checks, safe return/shutdown and handover records on one installation. Generic component skills and a functional demonstration are not evidence of that missing capstone. Do not label this selection a complete stand-alone practical qualification.

For C1 written/oral revision, existing Papers questions `generator-response`, `equipment-ratings`, `generator-cable` and `standby-generator` remain relevant. Explain the energy/fault paths, governor versus AVR, current from the stated rating/voltage/PF, and the transfer sequence. No question/answer source or new assessment interface was changed.

## Evidence and qualifications

All available English caption text returned for the **seven additions and retained power recap** was read in full. The [review manifest](c1-generator-video-review.json) records providers, languages, hashes, ranges, scope, exclusions and availability. Full third-party transcripts stay in ignored research files, not the published site. Provider text is not assumed human-authored or error-free. MATLAB's publisher transcript mislabels a demand as reactive at 5:55; its English YouTube text correctly says active.

Representative physical-equipment frames of both transfer demonstrations were inspected in **one dedicated Chrome tab**. This is not a complete visual playback review of every selection. One public request for the ATS upload returned `LOGIN_REQUIRED`; a subsequent request returned `OK`/`playableInEmbed`, and Chrome playback worked. Other selected uploads also returned playable embed metadata. Availability may change.

All five installation/earthing/operation selections are UK teaching. Shared voltage/frequency conventions do not make UK regulations identical to Kenyan requirements. Use the examination's stated voltage or actual nameplate; do not silently replace 415 V with 400 V. The synchronous-generator theory lesson is not UK installation certification.

Short lesson notes supply essential qualifications while watching:

- **Earthing:** neutral is a live conductor: never touch it. Do not infer a bond, TN-S arrangement or permitted loads from generator size. Identify the actual winding and approved arrangement before considering a link. An electrode does not replace the protective conductor. The older On-Site Guide diagrams are historical examples.
- **Pre-start:** isolate AC/DC and disable auto-start before internal inspection. Follow the model's battery/fuel procedures; the demonstrated battery order and priming are not universal instructions. Persistent hunting needs investigation. Emergency stop is not routine shutdown.
- **Connected rig:** trace power/control paths; do not copy the indoor combustion-engine location. Portable sets belong outdoors away from openings; permanent enclosed sets require engineered ventilation/exhaust.
- **Power:** reactive power exchanges energy; it is not wasted power, although current causes losses. Both engine kW and alternator kVA limits apply.

The [IET generator/UPS guidance](https://electrical.theiet.org/bs-7671-18th-edition-wiring-regulations/faqs/webinar-questions-and-answers/ups-systems-and-generators-webinar/) supports assessing actual neutral/earthing strategy, transition arrangements and protective coordination. [FG Wilson's operator-manual page](https://www.fgwilson.com/en_GB/support/OperatorManuals.index.html) identifies pre-start, operation, maintenance and manufacturer support. Neither makes a short demonstration a complete installation course.

The [EPRA competency document](https://www.epra.go.ke/sites/default/files/2025-06/Written%20%26%20Oral%20Interviews%20Areas%20of%20Competency.pdf) covers C1 building-installation competence and separately lists specialist generator competence under A2. Historical C1 generator questions motivate this foundation; they do not require turning it into winding design, engine overhaul, controller programming or power-station synchronising. Future examination coverage is not guaranteed.

Reviewed US Cummins/Eaton application clips were not added. Vlogs with skipped connections/testing, major tangents or unresolved technical uncertainty were excluded. The manifest distinguishes full from partial transcript reviews. The original optional excitation clip has only an earlier translated-Arabic review, not newly verified original-English evidence.

## Preservation and verification

Revision 12 adds seven stable lesson IDs and two sections. There are **446 catalogue entries, 190 sections and 478 mixed default rows**; C1 has **86 sections and 145 default rows**. All prior video identities survive. C2/Advanced content, protected Practice sources, Papers answers, books and diagrams remain unchanged.

The actual published revision-11 course was captured before editing. `node scripts/test-c1-generators.mjs` checks prerequisites, UK selections, duration bounds, caption evidence and explicit practical limits, plus private copies, personal moves/order, archives/deletions, nested supporting descendants, legacy documents, idempotence and historical Undo. Run it with existing curriculum, account/source-fidelity checks and both production builds. Tests do not edit live learner accounts.

Validation completed: generator and historical curriculum migrations; saved-course/API, account/guest, progress/order, licensing, navigation/workspace/fullscreen component checks; EPRA source fidelity, Papers and books; lint, TypeScript, Next production build (`--webpack`) and Vinext production build. Turbopack rejected the local dependency junction outside the worktree root; the webpack build passed. The separate-browser conflict script was excluded to respect the requested single Chrome tab. Guest navigation in that tab confirmed the new foundation/Next sequence and all five application rows/notes. The local embedded video frame was blank, so embedded playback is not claimed as verified by that UI check; the source video itself played on YouTube.
