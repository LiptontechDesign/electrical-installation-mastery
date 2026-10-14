# C1 worked study project: a four-storey building

Work through this project as you study C1 Modules 10–19. Keep one drawing and one calculation sheet throughout. Try each task before reading its worked result. This authored exercise supplements the videos; it does not alter the supplied EPRA questions or answers.

## 1. Draw the installation and state the assumptions

Draw: 400 V three-phase origin → main protective device → 40 m submain → main distribution board → four floor boards and a common 7.5 kW motor circuit. Show L1, L2, L3, neutral and CPC throughout. Show the motor starter and a possible central compensation bank as separate branches.

Use 50 Hz, balanced sinusoidal supply, VL = 400 V and Uo = 400/√3 = 230.94 V for internally consistent arithmetic. “400/230 V” is the usual rounded description. The earthing arrangement is TN for this exercise, with Ze = 0.12 Ω. The building has four storeys including the ground floor; this example contains no factory or public-entertainment installation.

The figures below are explicitly supplied training inputs. Cable candidate capacities, factors, fault energy and acceptance limits are not claimed quotations from a current standard or a product data sheet. A real design must establish the supply, applicable Kenyan requirements, installation method, actual cable tables, manufacturer data and local approval conditions. UK video examples teach methods, not automatic Kenyan compliance.

## 2. Build a phase schedule before choosing a feeder

Each entry is a mixed load group's assessed **electrical input kW**, after the exercise's stated duty assessment. Each group has fundamental power factor 0.80 lagging. These are given demands, not breaker ratings or a rule for applying diversity. Ignore harmonics only for this exercise.

| Floor | L1 kW | L2 kW | L3 kW |
|---|---:|---:|---:|
| Ground | 6 | 3 | 3 |
| First | 4 | 6 | 3 |
| Second | 3 | 4 | 6 |
| Third | 5 | 3 | 2 |
| Total | 18 | 16 | 14 |

Task: explain why dividing total kW by three hides the most heavily loaded phase. Reassign one 2 kW single-phase group from third-floor L1 to L3. Redraw the schedule: each phase now supplies 16 kW. Only reassign a circuit if its supply, neutral, protective devices and identification permit it.

The common motor has shaft output 7.5 kW, η = 0.90 and PF = 0.80. First calculate electrical input: 7.5/0.90 = 8.333 kW. Its apparent power is 8.333/0.80 = 10.417 kVA; its line current is 10,416.7/(√3 × 400) = 15.04 A. PF is not efficiency.

For every load here, tan(arccos 0.80) = 0.75. The building's totals are therefore P = 48 + 8.333 = 56.333 kW and Q = 56.333 × 0.75 = 42.250 kVAr. After balancing, S = √(P² + Q²) = 70.417 kVA and IL = 101.64 A.

Before balancing, add one third of the motor's P and Q to each phase, then find each phase current using |I| = √(Pphase² + Qphase²)/Uo. Do not add scalar magnitudes for loads with different power factors. Here all PF values are equal, so the three currents are approximately 112.46 A, 101.64 A and 90.81 A. The neutral current from the unequal floor groups is 18.75 A; the balanced motor contributes zero in this model. After balancing, the theoretical neutral current is zero. Real changing loads and triplen harmonics can produce neutral current even with apparently balanced demand.

Before applying any diversity in a real building, state occupancy, duty, simultaneous use, special loads and the source of each factor. Explain which phase limits the service capacity and how demand monitoring could check the assumptions.

## 3. Select current capacity, then check the complete voltage path

For the balanced design, use Ib = 101.64 A, a proposed In = 125 A, Ca = 0.94 and Cg = 0.80. Other applicable factors are assumed 1 only in this exercise. Required tabulated capacity is at least 125/(0.94 × 0.80) = 166.22 A.

| Training candidate | Tabulated capacity | Three-phase mV/A/m | Installed Iz |
|---|---:|---:|---:|
| A | 160 A | 1.25 | 120.32 A |
| B | 200 A | 0.90 | 150.40 A |

Candidate A fails In ≤ Iz even though its table capacity exceeds 125 A. Candidate B passes Ib ≤ In ≤ Iz. The second overload condition, I2 ≤ 1.45 Iz, must also be checked for the chosen device and installation; it is not a rule that Iz must equal 1.45 In.

Using candidate B, submain drop = 0.90 × 101.64 × 40/1000 = 3.66 V line-to-line, or 0.915% of 400 V. A specified single-phase lighting circuit has Ib = 6 A, length 20 m and tabulated drop 29 mV/A/m. Its drop is 3.48 V, or 1.507% of 230.94 V. The combined percentage is approximately 2.42%, passing the exercise's supplied 3% origin-to-light limit. Do not add 3.66 V and 3.48 V directly: they have different voltage references.

Now explain what you still need to select a real conductor cross-section: cable construction, reference method, loaded conductors, grouping, ambient temperature, thermal insulation, termination rating, route, neutral loading, table edition and manufacturer data. The abstract candidates above deliberately do not invent a real cable's cross-section or table rating. In your own design, attach the actual table/data sheet and reproduce these checks with it. Check motor starting voltage separately; a satisfactory steady-state drop does not prove successful starting.

## 4. Complete earthing and fault-protection checks

For a specified circuit, cold R1 + R2 = 0.16 Ω. The supplied operating-temperature multiplier is 1.20, so design Zs = 0.12 + 1.20 × 0.16 = 0.312 Ω. Compare with the supplied device limit of 0.40 Ω for the required disconnection time: the exercise passes. Identify the actual protective device and time/current curve before using a real limit. Do not confuse a corrected design value with a cold measured value.

For a separate CPC check, supplied protective-device let-through I²t = 1,600,000 A²s and k = 115 A√s/mm². Required S ≥ √(I²t)/k = 11.00 mm²; a specified 16 mm² CPC passes this arithmetic check. Verify that k matches the actual conductor/insulation and that the energy data and disconnection conditions apply. Assess main earthing, bonding and any armour used as a CPC separately.

At the origin, the specified maximum applicable prospective short-circuit current is 6 kA. A proposed 10 kA breaking-capacity device passes that comparison; a 4.5 kA device does not. Selectivity and backup/cascading arrangements still require manufacturer evidence. Do not infer all prospective fault currents from Ze alone or treat “double L–N” as an exact universal three-phase fault calculation.

## 5. Size compensation to a target below unity

Keep the original P = 56.333 kW and PF1 = 0.80; target PF2 = 0.95 lagging. Real load input is unchanged by ideal compensation.

Qc = P[tan(arccos PF1) − tan(arccos PF2)] ≈ 23.734 kVAr total. Remaining Q ≈ 18.516 kVAr. New S = P/0.95 ≈ 59.298 kVA and upstream current ≈ 85.59 A.

For an ideal delta bank at 400 V, 50 Hz:

C per capacitor = Qc/(3 × 2πf × VL²) ≈ 157.39 µF.

For an ideal star bank at the same line voltage:

C per capacitor = Qc/(2πf × VL²) ≈ 472.18 µF.

Use var rather than kVAr in those capacitance formulae. Each delta capacitor sees 400 V; each star capacitor sees 400/√3 V. This is a capacitance calculation, not a product selection: specify voltage rating, harmonics/detuning, steps, contactors, protection and discharge using equipment data. A changing building load usually needs controlled steps to avoid leading power factor. A central bank reduces upstream current; downstream load branches still carry their own reactive current. Do not size the feeder on a bank that might be disconnected without assessing the resulting operating condition. Do not put correction capacitors on a VFD output.

As an independent check, calculate the supplied EPRA-style case of 30 kW corrected from 0.75 to 0.95: Qc ≈ 16.597 kVAr. Explain why this is not the building's bank size.

## 6. Explain motor connection and control

For a 400 V supply, compare a 230/400 V Δ/Y plate with a 400/690 V Δ/Y plate. The first requires star for its normal rated winding voltage; the second requires delta. A 400 V star–delta starter needs a motor rated for delta running at 400 V with six accessible winding ends.

Draw a DOL power circuit and separate Start/Stop holding circuit. Mark short-circuit protection, overload elements, overload NC contact, Stop NC, Start NO, holding NO and coil voltage. Trace why releasing Start does not stop the motor, why pressing Stop does, and why a supply failure releases the contactor.

Add reversing contactors, with two phases exchanged, plus mechanical and electrical interlocks. Verify the opposing coil cannot energise. Explain the different purposes of DOL, star–delta, soft starter and VFD. If a phase-monitor contact appears only in the holding branch, ask whether holding Start bypasses it; a protective function needs a validated circuit that interrupts all required energising paths.

## 7. Produce an initial-verification and handover record

Use the C2 inspection, RCD testing and certificate lessons alongside the C1 three-phase sequence. This is the required record, not an instruction to carry out unsupervised live work.

1. Record supply/earthing characteristics, circuit schedule, visual inspection, equipment suitability, isolation and instrument checks.
2. Record protective-conductor continuity, relevant bonding/continuity results and dead polarity. Remove parallel paths where the applicable test requires it; restore them afterwards.
3. Record the appropriate insulation tests with sensitive equipment handled according to its instructions. For L1/L2/L3/N/PE, identify all ten unique pairs: L1–L2, L1–L3, L1–N, L1–PE, L2–L3, L2–N, L2–PE, L3–N, L3–PE and N–PE. Distinguish circuit testing from a disconnected motor winding test.
4. Following satisfactory dead tests, record the applicable supply polarity, phase sequence, Ze, prospective fault current, Zs and RCD results using competent safe procedures and the correct instruments.
5. Record safe functional tests: starter Start/Stop, no-volt release, protective functions, interlocks, intended motor direction, drive settings and compensation steps where present. Do not create uncontrolled supply or neutral faults to demonstrate them.
6. Compare every result with its actual acceptance criterion. Correct defects, repeat affected tests, complete the applicable installation record and schedules, identify limitations/deviations, label circuits and hand over operating/maintenance information. A domestic periodic EICR video is not a substitute for this initial-verification record.

## 8. Diagnose from evidence and verify the repair

Scenario A: lights on different phases change brightness together as load changes. Distinguish a common neutral fault from a single final-circuit open neutral. Explain why unequal loads can shift the neutral point and subject equipment to overvoltage. Stop using affected equipment and arrange safe isolation/competent supply investigation; do not repeatedly energise it to watch the effect.

Scenario B: a disconnected bench motor has U1–U2 = 12.4 Ω, V1–V2 = 12.5 Ω and W1–W2 = open circuit, with the links removed. The evidence suggests an open winding path or terminal connection, rather than proving an upstream missing supply phase. Confirm contact quality and winding identification. Compare insulation to frame and between windings at a manufacturer-approved test voltage; balanced resistance alone would not prove a healthy motor or rule out a turn-to-turn fault.

Scenario C: the contactor closes only while Start is held. Trace the holding contact and wiring using the isolated control diagram. Explain why randomly changing overload settings is not a diagnosis.

For each case, write symptoms → hypothesis → safe test → expected evidence → conclusion → corrective work → repeated verification → recorded result. Finish by explaining your design and results aloud without reading a video title. Use the existing C1 Practice topics and oral questions to identify remaining weaknesses.

## Primary references

- [EPRA written and oral interview areas of competency](https://www.epra.go.ke/sites/default/files/2025-06/Written%20%26%20Oral%20Interviews%20Areas%20of%20Competency.pdf): confirm current C1 scope and requirements with EPRA.
- [Schneider Electric: installed apparent power](https://www.electrical-installation.org/enwiki/Installed_apparent_power_(kVA)): efficiency, power factor and balanced three-phase current.
- [Schneider Electric: power factor correction](https://www.electrical-installation.org/enwiki/Power_Factor_Correction): compensation, placement and harmonics.
- Use the applicable current installation standard, actual cable/manufacturer tables and test instrument instructions for real design and acceptance values.

Prepared 14 October 2026. Approximate results are rounded only at the final step.
