# C1 self-study video sequence

Updated 14 October 2026. Follow this order after C2, especially AC theory, safe isolation, cable design, earthing/ADS and initial verification. Required and optional labels describe the teaching route; every active video still counts toward the course watched total.

The sequence contains 40 sections and 62 video rows. UK instructors form the main route; non-UK mathematical/manufacturer examples carry their scope notes below. Approximate timings on new entries are caption-end estimates.

Use the [four-storey worked project](../public/c1-worked-project.md) throughout. See [selection evidence and exclusions](c1-video-selection-and-flow.md) for the transcript review.

## Module 10: Three-Phase Supply, Star/Delta and Neutral Behaviour

### 1. Three phase waveforms, supply voltages and the complete system

Begin after C2 AC theory and safe isolation. Start with the whole system, then identify L1, L2, L3, neutral and CPC. Separate 400 V line voltage from approximately 230 V phase voltage. UK examples teach principles; EPRA and local supply requirements govern Kenyan work.

- [The Utimate Guide to Three Phase Electricity](https://www.youtube.com/watch?v=9BZ_hSndQyw) — eFIXX; Core lesson.
- [An Introduction to Three Phase Systems Using the Matrix Locktronics Kit](https://www.youtube.com/watch?v=NhLzjDJFuvk) — Joe Robinson Training; Core lesson.

### 2. Star and delta: line voltage, phase voltage and current

Draw both connections and label each line and winding quantity before using √3. This is the prerequisite for motor terminals, power calculations and capacitor banks.

- [3 Phase: Star Connected Loads, How to Calculate Line and Phase Voltage & Line and Phase Current](https://www.youtube.com/watch?v=rB1NafJ6XPk) — Joe Robinson Training; Core lesson.
- [3 Phase: Delta Connected Loads, How to Calculate Line and Phase Voltage & Line and Phase Current](https://www.youtube.com/watch?v=7slCHGpfHtg) — Joe Robinson Training; Core lesson.

### 3. Balanced loads, unequal phase currents and the neutral

Compare a balanced motor with unequal single-phase building loads. Reproduce the neutral-current example before moving to a phase schedule. Simple vector formulae assume sinusoidal currents with the stated phase relationships; nonlinear loads and harmonics need separate assessment.

- [Three Phase Mystery Solved, No Neutral Required in a Balanced Load?](https://www.youtube.com/watch?v=WZ4GG4GuSfQ) — Joe Robinson Training; Core lesson.
- [The Easiest Most Accurate Way to Calculate Three Phase Neutral Current in an Unbalanced Load](https://www.youtube.com/watch?v=ExHJGSJSE6o) — Joe Robinson Training; Core lesson.

## Module 11: Three-Phase Voltage, Current and Power Calculations

### 1. Calculate resistive star and delta circuit quantities

Use the previous line/phase relationships in a worked resistive exercise. This lesson does not cover the entire P, Q and S topic.

- [3 Phase: How to Calculate Line Voltage, Phase Voltage, Line Current & Phase Current in Star & Delta](https://www.youtube.com/watch?v=ky7cs1NYvCI) — Joe Robinson Training; Core lesson.

### 2. Real power, reactive power, apparent power and power factor

Revise the power triangle with Joe Robinson, then optionally derive constant balanced three-phase power. Use W for P, var for Q and VA for S. Power factor and motor efficiency are different ratios.

- [Questions from Viewers: AC Theory, How to Calculate Power Factor and Draw a Power Triangle to Scale](https://www.youtube.com/watch?v=qBJvgN8nCqw) — Joe Robinson Training; Core lesson.
- [Power in a Balanced Three-Phase Circuit](https://www.youtube.com/watch?v=bSjh8AakqXM) — Michel van Biezen; Optional derivation.

  Study focus: This derives constant total power for balanced sinusoidal loads. You can first study the worked P, Q and S examples below, then return to the trigonometric derivation.

### 3. Find three phase power factor and line current

Solve for S, PF and line current in that order. For balanced sinusoidal loads: S = √3VLIL, P = S cos φ, Q = S sin φ. Write each unit and identify whether a kW figure is electrical input or shaft output.

- [Three-Phase Motor Power Factor — Worked Example](https://www.youtube.com/watch?v=T2eO6hOT-EA) — Michel van Biezen; Core worked example.

  Study focus: Treat 4.8 kW as electrical input power. S = √3 × VL × IL is measured in VA, not W; power factor = P/S. Mechanical output requires a separate efficiency calculation.
- [Find the Line Current Needed for a Three-Phase Motor](https://www.youtube.com/watch?v=TPsHULaNc7s) — Michel van Biezen; Core worked example.

  Study focus: The 25 kW is electrical input power. Write apparent power as 31.25 kVA, although the narration says kW. If a motor rating gives shaft output, first divide it by efficiency.

### 4. Convert motor shaft output into input power and supply current

Include efficiency before power factor when the nameplate power is shaft output. Check the answer against the nameplate current rather than silently assuming 100% efficiency.

- [Motor Output, Efficiency, Power Factor and Three-Phase Line Current](https://www.youtube.com/watch?v=Jx3Pk_5O-PM) — Aaron Dahlen; Core lesson.

  Study focus: The 460 V, 75 hp example teaches universal power relationships, not local supply values or North American wiring rules. Pinput = Pshaft/η; S = Pinput/PF; IL = S/(√3VL). Scilab is only a calculator: reproduce the result with a normal scientific calculator.

## Module 12: Three-Phase Boards, Feeders and Outlets

### 1. Safe isolation, board layout and phase identification

Repeat C2 safe isolation for all phases, neutral and possible alternative supplies. Understand the board and the manufacturer’s switching arrangement before working through submains. The smart-board product tour is optional context.

- [10 Stages of Safe Isolation - 3 Phase Distribution Board](https://www.youtube.com/watch?v=P2VoJ52yfoE) — GSH Electrical; Applied practical.
- [Understanding Your Three-Phase Distribution Board](https://www.youtube.com/watch?v=27QIQAvOF9k) — eFIXX; Applied practical.
- [Inside Hager's Smart Three-Phase Distribution Board 🤓](https://www.youtube.com/watch?v=Uj63TuZ3QXw) — eFIXX; Deep practice.

### 2. Submains and three phase distribution between boards

Trace origin → protective device → submain → floor board → final circuits. Carry the neutral, earthing arrangement and protective conductor through the same drawing.

- [Sub-Main SWA Circuit and the Connections in our Wylex DSF60M Switch-Disconnector Fuse (Switch Fuse)](https://www.youtube.com/watch?v=zSw0mVzcQ4A) — GSH Electrical; Applied practical.

[Continue the worked project](../public/c1-worked-project.md).

### 3. Board installation, terminations and workmanship

Follow the installation demonstrations after learning board architecture. Check conductor identification, torque, separation and manufacturer instructions. Cable management is an optional workmanship detail; it is not an earthing-design lesson.

- [SCHNEIDER Acti 9 THREE PHASE DISTRIBUTION BOARD INSTALLATION](https://www.youtube.com/watch?v=_nba6f8ClgM) — eFIXX; Applied practical.
- [THAT'S NOT A CONSUMER UNIT - 3 PHASE POWER FOR NEW BUILD HOMES](https://www.youtube.com/watch?v=MNy60muYklo) — eFIXX; Applied practical.
- [Do You Cable Tie Your Conductors in 3 Phase Distribution Boards..? Electricians Matt & Clive O’Dell](https://www.youtube.com/watch?v=c6YyObUS4Mk) — GSH Electrical; Deep practice.

### 4. Industrial plugs, sockets and circuit connections

Identify the voltage, phase, neutral and earth arrangement for each connector. Match circuit protection and conductor identification to the outlet before testing it.

- [Connections in a 3 Phase Plug and Socket Explained](https://www.youtube.com/watch?v=-9irkJ94xg0) — GSH Electrical; Applied practical.
- [Industrial Plugs and Sockets: IP, IK and Duty Selection](https://www.youtube.com/watch?v=PNWdC47daYM) — eFIXX; Applied practical.

## Module 13: Three-Phase Load, Cable and Protection Design

### 1. Build a load schedule and justify maximum demand

List actual loads, electrical input, duty and any justified diversity. Distinguish connected load, demand, breaker ratings and service capacity. The optional domestic example is limited to its stated UK arrangements.

- [Electrical Load Estimation - Electrical Load Calculation in Electrical Distribution](https://www.youtube.com/watch?v=AQffdGvDNcA) — Engr. Ahmed / Khadija Academy; Core lesson.
- [Maximum Demand and Diversity: A UK Domestic Worked Example](https://www.youtube.com/watch?v=lGcsQ8mLI34) — GSH Electrical; Optional context.

  Study focus: This is a limited UK domestic example. Its largest-circuit plus 40% method requires the stated standard final-circuit arrangements. It is not a universal whole-building diversity rule. For C1, prepare a separate L1/L2/L3 schedule and assess the most heavily loaded phase; use the worked project.

[Continue the worked project](../public/c1-worked-project.md).

### 2. Design current, correction factors and cable current capacity

Start after C2 Module 6 conductor sizing. Follow Ib → In → correction factors → required table capacity → selected cable → installed Iz. The three-phase example adds line current and the correct three-phase cable-table column.

- [Cable calculation. Calculating the live cable size from BS 7671](https://www.youtube.com/watch?v=wAcqKNBxy-w) — Electrical Student; Core lesson.
- [Master Three-Phase Cable Calculations](https://www.youtube.com/watch?v=ChC_94Zmf4I) — Sparky Help; Core worked example.

  Study focus: BS 7671 example: 15.7 kW is electrical input. Ib = 28.33 A; In = 32 A; required tabulated capacity ≈ 43.29 A. A table rating of 44 A is not installed Iz: 44 × 0.96 × 0.77 ≈ 32.52 A. Check terminal temperature limits, CPC, Zs and breaking capacity separately.

### 3. Add submain and final circuit voltage drop correctly

A circuit can pass current capacity and still fail voltage drop. Carry the same load, route length and supply reference through the whole origin-to-load path; do not mix volts referred to 400 V with volts referred to 230 V.

- [Voltage Drop in Three-Phase Installations and Single-Phase Circuits from a Three-Phase Supply](https://www.youtube.com/watch?v=RCHw0TUEAes) — LEARN ELECTRICS; Core worked example.

  Study focus: Follow the diagram values as captions can misread lengths. Express the balanced three-phase submain drop against line voltage and the single-phase final-circuit drop against phase voltage before adding percentages. An unbalanced feeder needs a fuller calculation.

[Continue the worked project](../public/c1-worked-project.md).

### 4. Optional extension: larger buildings and transformer loading

Complete the four-storey low-voltage project first. This earlier seven-floor example is an extension, not the defining C1 design exercise.

- [Electrical Load Calculation for Buildings | Transformer Sizing, DB, SMDB, Main-DB Design Tutorial](https://www.youtube.com/watch?v=XGMUpguNzao) — Elegant Power Solutions; Optional extension.

  Study focus: Optional extension: a seven-floor building and transformer example exceeds the four-storey C1 building scope. Complete the main low-voltage building sequence and the four-storey worked project first.

## Module 14: Earth Fault Loops, Disconnection and Protection Checks

### 1. Verify earth fault loop impedance and automatic disconnection

Revisit C2 Module 5 earthing systems, ADS and Module 6 CPC sizing before this application. Follow Ze + (R1 + R2), the applicable disconnection time and device characteristic. The eFIXX worked process connects the preceding cable design to ADS.

- [Electrical Design: Calculating Earth Fault Loop Impedance](https://www.youtube.com/watch?v=q3rSnVEJ7kA) — eFIXX; Core lesson.

### 2. Apply conductor temperature and complete the protection checks

Use the correct reference temperature when comparing calculated and measured loop impedance. Complete CPC/adiabatic, bonding, fault-current and device-coordination checks alongside cable capacity and voltage drop; passing one check does not complete a design.

- [How to Calculate Total Earth Fault Loop Impedance Part 2 - Applying a Temperature Factor to R1 + R2](https://www.youtube.com/watch?v=kgZvjl4A1sE) — GSH Electrical; Core lesson.

[Continue the worked project](../public/c1-worked-project.md).

## Module 15: Power Factor Causes, Correction and Capacitor Sizing

### 1. Why poor power factor increases supply current

Revise the Module 11 power triangle. Distinguish reactive exchange from real energy losses and distinguish displacement power factor from efficiency. Any tariff or billing example is jurisdiction-specific.

- [Power Factor Explained – Your Electricity Bill Money Drain (Reactive Power)](https://www.youtube.com/watch?v=NIrKOVZrqnU) — The Engineering Mindset; Core lesson.

### 2. Size a three phase capacitor bank in kVAr and microfarads

Find Q before and after correction, then subtract. Calculate total bank kVAr before dividing between phases. Star capacitors see VL/√3; delta capacitors see VL. Use the worked project for a 0.75 → 0.95 target at 400 V, 50 Hz.

- [Three-Phase Power Factor Correction: From kVAr to a Star Capacitor Bank](https://www.youtube.com/watch?v=q5xjqXcCqNw) — Dieter Monkey; Core lesson.

  Study focus: This generic 600 V, 60 Hz calculation is a mathematical example, not a Kenyan supply specification. The 72 kVAr total becomes 24 kVAr per star-connected capacitor; C ≈ 530.5 µF per phase. Unity is an instructional limit, not the default design target. The worked project uses 400 V, 50 Hz and correction to 0.95.
- [Calculation of Capacitor Bank for Power Factor Improvement — kVAr](https://www.youtube.com/watch?v=u9m8vgz4aJs) — Electrical lectures; Optional earlier example.

  Study focus: The available captions are badly corrupted, so this earlier resource is not the core calculation. Use the verified three-phase capacitor-bank lesson and the linked worked project for Qc = P(tan φ1 − tan φ2), units and a target power factor below unity.

[Continue the worked project](../public/c1-worked-project.md).

### 3. Choose compensation location, switching and automatic steps

Compare load, group and central banks. Explain discharge, overcorrection, harmonics and switching before choosing equipment. Compensation does not raise motor efficiency or remove the load’s own reactive current downstream of the bank.

- [5 Types of Power Factor Correction — Capacitor Bank Locations](https://www.youtube.com/watch?v=oaIRQ1Xm7OQ) — The Electrical Guy; Core application.

  Study focus: Compare individual, group and central compensation. Specify switching, protection and discharge from manufacturer guidance. Automatic steps prevent overcorrection as demand falls. Do not connect correction capacitors to a VFD output.

## Module 16: Induction Motors, Nameplates and Terminal Connections

### 1. How the rotating field and induction motor produce torque

Connect the three-phase rotating field to rotor motion, synchronous speed and slip before reading the nameplate.

- [Induction Motors: Rotating Field, Rotor and Slip](https://www.youtube.com/watch?v=59HBoIXzX_c) — The Engineering Mindset; Core lesson.

### 2. Read the nameplate: voltage, connection, current, speed and efficiency

Read Δ/Y voltage, rated current, output, duty, speed and power factor together. Refer back to Module 11 when converting shaft output to electrical input.

- [How to read a Motor Nameplate (IEC standard)](https://www.youtube.com/watch?v=XbL0R_9KLD4) — ElectricalEngineeringPlanet; Core lesson.

### 3. Identify six winding ends and select star or delta links

Use the rated winding voltage to choose the connection. A terminal-link demonstration does not authorise either connection on every motor; confirm the plate and the actual supply.

- [How to Connect Motor Windings in Star and Delta](https://www.youtube.com/watch?v=p2hDLMeFJqs) — The Electrical Guy; Core demonstration.

  Study focus: Study the nameplate first: a 230/400 V Δ/Y motor runs in star on a 400 V supply; a 400/690 V Δ/Y motor runs in delta on 400 V. A star–delta starter on 400 V needs a motor rated for delta running at 400 V and six accessible ends. Identify winding pairs on an isolated, disconnected motor.

## Module 17: Motor Starters, Protection and Speed Control

### 1. Contactors, control coils and the complete DOL starter

Begin with contactor action and eFIXX’s complete DOL explanation. Separate the three-phase power circuit from the lower-current Start/Stop holding circuit.

- [Single Phase Contactor - Connections Explained, Application plus the Current in the Coil and Load](https://www.youtube.com/watch?v=Ed3_zbZ0xaA) — GSH Electrical; Core lesson.
- [How Do Direct On Line Motor (DOL) Starters Work?](https://www.youtube.com/watch?v=HFkTPmY7N7w) — eFIXX; Core lesson.

### 2. Motor protection: short circuit, overload and nameplate settings

Separate short-circuit protection, overload protection and no-volt release. Use the motor nameplate and manufacturer coordination tables for device selection and relay setting. The sizing rule and single-phase starter examples are optional comparisons, not general design instructions.

- [What is MPCB | MPCB Vs MCB | Motor Protection Circuit Breaker @the Electrical Guy](https://www.youtube.com/watch?v=wQwGZMcDGXk) — The Electrical Guy; Core lesson.
- [How to Select MCB and Overload Relay Size for a Motor](https://www.youtube.com/watch?v=DWUuKNjMf3E) — The Electrical Guy; Optional comparison.

  Study focus: Do not use the blanket 125% breaker rule as a BS 7671 or EPRA design rule. The kW example omits efficiency if kW means shaft output. Select protection from nameplate current, starting duty, cable protection and manufacturer coordination; distinguish relay range from its actual setting.
- [Single-Phase Direct-On-Line Starter Wiring](https://www.youtube.com/watch?v=PIaqmCxN9KU) — GSH Electrical; Optional refresher.

  Study focus: Optional single-phase DOL comparison. The following three-phase diagram and wiring demonstrations provide the main C1 starter sequence.

### 3. Read and wire the three phase DOL power and control diagrams

Follow the same GSH diagram into the actual wiring. Trace Stop, overload NC, Start, auxiliary holding contact and coil. Explain why the motor stops after a supply failure and should not restart unexpectedly.

- [3 Phase Direct Online Starter DOL Wiring Diagram Connections Explained](https://www.youtube.com/watch?v=mcXxhUaUb94) — GSH Electrical; Applied practical.
- [3 Phase Direct Online Starter DOL Wiring and Connections Explained](https://www.youtube.com/watch?v=qlqPdLGwJxk) — GSH Electrical; Applied practical.

### 4. Reverse rotation with electrical and mechanical interlocking

Swap two phases to reverse the rotating field. Trace both contactors and prove the opposing coil cannot energise; simultaneous closure creates a phase-to-phase short circuit.

- [Reversing a Three-Phase Motor: Mechanical and Electrical Interlocks](https://www.youtube.com/watch?v=VqgXVIi0jw8) — AutomationDirect.com; Core lesson.

  Study focus: Learn the swapped-phase power paths and both interlock principles first (0:00–2:11). Later NFPA/UL references and product kits are US-specific context. Choose components, coil voltage and protection for the actual installation; verify that forward and reverse cannot energise together.

### 5. Star delta starting: connection, transition and reduced torque

Use a motor suitable for delta running at the actual line voltage. Explain the starting-current and torque reduction, timing and interlocking before comparing other starters.

- [Star–Delta Starting: Sequence and Interlocks](https://www.youtube.com/watch?v=h89TTwlNnpY) — The Engineering Mindset; Core lesson.

### 6. Soft starters: limit starting current without continuous speed control

Compare reduced-voltage starting with star–delta. Distinguish a starting ramp from a VFD’s continuous frequency/speed control.

- [What is a Soft Starter? from AutomationDirect](https://www.youtube.com/watch?v=_tGyaE78WTA) — AutomationDirect; Core lesson.

### 7. VFD speed control: rectifier, DC link and inverter

Connect supply frequency, motor speed and the drive stages. Follow manufacturer requirements for motor suitability, earthing, cable, EMC and protection; isolate and wait the specified DC-link discharge time before tests.

- [Variable-Frequency Drives: From Rectifier to Motor Speed](https://www.youtube.com/watch?v=yEPe7RDtkgo) — The Engineering Mindset; Core lesson.

### 8. Optional review: phase monitoring and protective contact placement

Review the relay function, then critique the shown holding-branch protection. A robust circuit must prevent energisation through every required path during a fault. The diagram is not an approved wiring template.

- [Phase-Failure Relay with a DOL Starter](https://www.youtube.com/watch?v=-OCfG8inGSY) — The Electrical Guy; Optional circuit critique.

  Study focus: Inspect the control diagram critically: protection in only the holding branch can be bypassed while Start is held. A validated protective contact must interrupt every energising path as required by the manufacturer. Do not copy this diagram as a complete approved control circuit.

## Module 18: Three-Phase Initial Verification and Periodic Inspection

### 1. Dead tests: continuity, conductor identification and insulation

Use the C2 initial-verification process in order: inspect, isolate/prove dead, protective-conductor continuity and dead polarity, then insulation resistance. The new lessons add conductor tracing and all ten IR pairs for a five-conductor three-phase circuit.

- [Tracing Three-Phase Wiring and Identifying Cables](https://www.youtube.com/watch?v=CDW_SKOgYSY) — LEARN ELECTRICS; Core dead-test method.

  Study focus: Apply only after safe isolation, proving dead and separating the conductors from all supplies and loads. Record each identified pair, verify the final conductor and remove temporary links before reconnection.
- [Three-Phase Insulation Resistance: All Ten Conductor Pairs](https://www.youtube.com/watch?v=Xe9vD_a3qEE) — LEARN ELECTRICS; Core lesson.

  Study focus: Apply C2 safe isolation and continuity/polarity methods first. Disconnect or protect sensitive loads, electronics, SPDs and drive equipment according to their instructions. Test voltage and acceptance criteria depend on the circuit and applicable standard; discharge after testing.

### 2. Supply polarity, phase identification and phase sequence

After satisfactory dead tests, verify supply characteristics and phase sequence using rated equipment and the appropriate safe procedure. John Ward explains the principle before the practical meter demonstration.

- [First Live Test - Check Polarity of 3 Phase Supply, Using an Approved Voltage Indicator AM2 & AM2S](https://www.youtube.com/watch?v=3kHlWHM9Wm8) — GSH Electrical; Applied practical.
- [Testing Phase Sequence: Rotation, Instruments and Consistent Phase Identification](https://www.youtube.com/watch?v=aDSY10l_ZqE) — John Ward (jwflame); Core lesson.

  Study focus: Phase identification and phase rotation are different checks. Establish consistent identification, verify the instrument rating and confirm rotation at the required points before testing the intended motor direction.
- [How to use a phase rotation meter? 👷🏽‍♂️](https://www.youtube.com/watch?v=igi8F6UAvh0) — Odeane's Electric; Core lesson.

### 3. Measure Ze and prospective fault current; assess breaking capacity

Keep earth-fault and short-circuit paths distinct. Compare the applicable maximum prospective fault current with the protective-device breaking capacity. Treat an assessment estimate as an estimate.

- [LIVE Testing on a 3 Phase Dis-Board - External Earth Fault Loop Impedance Ze, PEFC, PSCC AM2 & AM2S](https://www.youtube.com/watch?v=IeWoLUIKuJw) — GSH Electrical; Applied practical.
- [Three-Phase Prospective Fault Current: Measurements, Estimates and Breaking Capacity](https://www.youtube.com/watch?v=Ge7me58155E) — GSH Electrical; Core lesson.

  Study focus: PFC here means prospective fault current, not power factor correction. The doubled highest L–N result is a UK assessment approximation shown in this video, not a universal measurement of a three-phase fault. Use the correct instrument method and compare the applicable prospective fault current with protective-device breaking capacity.

### 4. Verify outlet Zs and assemble the commissioning record

Combine the outlet check with earlier continuity, polarity, IR and phase-sequence results. Complete applicable RCD and functional tests, record deviations and rectify failures before handover. Use C2’s certificate teaching and the worked project for the full record.

- [Earth Fault Loop Impedance (Zs) - Testing 16 Amp Industrial Socket Outlets Both Single and 3 Phase](https://www.youtube.com/watch?v=Y7NPT8sQINY) — GSH Electrical; Applied practical.

[Continue the worked project](../public/c1-worked-project.md).

### 5. Optional refresher: domestic periodic inspection and reporting

This house EICR revises periodic inspection. It is separate from initial three-phase verification and does not replace the C1 commissioning sequence above.

- [Periodic Inspection: Follow the Evidence Through an EICR](https://www.youtube.com/watch?v=1tBICSsjVWo) — Artisan Electrics; Optional refresher.

  Study focus: Optional domestic EICR refresher. This is not a complete three-phase commissioning demonstration. Initial verification, periodic inspection and diagnosis have different purposes; use the preceding three-phase test sequence and the worked project to assemble the C1 handover.

## Module 19: Three-Phase and Motor Fault Diagnosis

### 1. Diagnose supply imbalance, lost neutral and installation faults

Begin with the C2 systematic fault method: obtain symptoms/history, inspect, form a hypothesis, isolate, test and compare. Separate a shared-neutral problem from a final-circuit open neutral. Use the site video to discuss evidence rather than memorising a repair.

- [Three-Phase Lost Neutral — What Happens and Why Equipment Is Damaged](https://www.youtube.com/watch?v=0MVNJUstzCY) — LEARN ELECTRICS; Core fault explanation.

  Study focus: The RMS supply is approximately 230 V phase-to-neutral; its sinusoidal peak is about 325 V. Losing the shared neutral shifts the star point under unequal loads. Individual voltages depend on the impedances and can approach line voltage; they do not all become 400 V.
- [IS THIS THE WORST THREE PHASE WIRING YOU'VE EVER SEEN - Does it need a rewire?](https://www.youtube.com/watch?v=XxOG5eqmKHk) — eFIXX; Applied practical.

### 2. Recognise motor phase loss and distinguish supply from winding faults

A stopped motor may fail to start; a running motor may overheat. Trace supply, protection, contactor, cable and winding as separate possible causes. Avoid repeated starting until the cause is established.

- [Single-Phasing Fault in a Three-Phase Motor](https://www.youtube.com/watch?v=AtlXd1xA-CU) — Electrical lectures; Core fault concept.

  Study focus: Single-phasing can prevent starting or cause overheating while running. The quoted current multipliers illustrate a particular model; they are not universal trip settings. Compare phase currents, supply continuity and winding tests using the motor and protection manufacturer instructions.

### 3. Test an isolated motor and compare the winding evidence

Inspect mechanical freedom and condition, then compare winding continuity/resistance and insulation. Record all three winding readings rather than accepting one good measurement. Repair, repeat the relevant tests and assess safe operation before return to service.

- [Isolated Motor Bench Tests: Winding Resistance and Insulation Resistance](https://www.youtube.com/watch?v=Ap6fpJ58d5Q) — Samuel Smith; Core lesson.

  Study focus: This is a disconnected bench motor. Complete safe isolation and separation from the starter/VFD first. Compare U1–U2, V1–V2 and W1–W2, then insulation to the frame and between windings using manufacturer-approved voltage. The displayed >200 MΩ is that meter’s range, not a universal pass threshold. Balanced ohms do not prove absence of turn-to-turn faults; assess mechanical condition and safe functional behaviour too.

[Continue the worked project](../public/c1-worked-project.md).

### 4. Optional extension: thermal imaging and abnormal heating

Use thermography as additional evidence, with load, emissivity, environment and competent safe access considered. A hot connection does not replace electrical diagnosis and verification.

- [Detecting Electrical Energy Loss with Thermal Imaging](https://www.youtube.com/watch?v=KceE8zdk35g) — VoltimumUK/Fluke; Deep practice.
