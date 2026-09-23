# EPRA C2 & C1 — 110 High-Priority Recall & Reinforcement Questions

## Distinction-Level Revision Bank Based on Recurring EPRA Themes, Transcript Teaching and BS 7671 Study Guidance

> **Purpose:** This is not a mock paper. It is a deliberately weighted revision bank for the concepts that recur most often in EPRA C2/C1 preparation and past papers.
>
> It combines:
>
> - the current EPRA C2/C1 competency scope;
> - recurring themes from accessible EPRA/ERC past papers;
> - the Learn Electrics transcript teaching style used throughout the earlier study stages;
> - BS 7671 terminology and calculation discipline;
> - and the uploaded **On-Site Guide updated to BS 7671:2018+A4:2026** for current UK study guidance.
>
> **Jurisdiction caution:** BS 7671 is used here as technical study/reference material. Where an EPRA question asks for Kenyan law, licensing scope or a Kenya-specific rule, use current Kenyan legislation, EPRA requirements and applicable Kenya Standards.

---

# How to Use This Bank

Do not read the answer immediately.

For each question:

1. answer from memory;
2. write the formula before using the calculator;
3. explain **why** your answer is correct;
4. compare with the model answer;
5. repeat weak questions later without looking.

For calculations, use:

\[
\boxed{\text{GIVEN}\rightarrow\text{FORMULA}\rightarrow\text{SUBSTITUTION}\rightarrow\text{ANSWER}\rightarrow\text{CHECK}}
\]

For oral/theory answers, use:

\[
\boxed{\text{Definition}\rightarrow\text{Purpose}\rightarrow\text{How it works}\rightarrow\text{What happens if wrong}\rightarrow\text{How verified}}
\]

---

# SECTION 1 — Electrical Foundations and Calculation Discipline

## Question 1 — Current, Voltage and Resistance
**Define current, voltage and resistance, and state their units.**

### Answer

**Current** is the rate of flow of electric charge.

\[
I=\frac{Q}{t}
\]

Unit:

\[
\boxed{\text{ampere (A)}}
\]

**Voltage/potential difference** is electrical energy transferred per unit charge.

\[
V=\frac{W}{Q}
\]

Unit:

\[
\boxed{\text{volt (V)}}
\]

**Resistance** is opposition to current flow.

\[
R=\frac{V}{I}
\]

Unit:

\[
\boxed{\text{ohm }(\Omega)}
\]

### Examiner-level understanding

Do not define voltage as “230 V” or current as “electricity.” A definition explains the quantity, not a typical value.

A useful physical model is:

\[
\boxed{\text{voltage drives, resistance opposes, current results}}
\]

---

## Question 2 — Ohm's Law
**State Ohm's law and explain its physical meaning.**

### Answer

For an ohmic conductor under substantially constant physical conditions:

\[
\boxed{V=IR}
\]

Therefore:

\[
I=\frac{V}{R}
\]

and:

\[
R=\frac{V}{I}
\]

At fixed resistance:

\[
V\uparrow\Rightarrow I\uparrow
\]

At fixed voltage:

\[
R\uparrow\Rightarrow I\downarrow
\]

The temperature condition matters because conductor resistance changes with temperature.

---

## Question 3 — Ohm's-Law Calculation
A resistor is connected to 24 V and carries 3 A.

Calculate its resistance and then prove your answer by reverse calculation.

### Answer

### GIVEN

\[
V=24V,\qquad I=3A
\]

### FORMULA

\[
R=\frac{V}{I}
\]

### SUBSTITUTION

\[
R=\frac{24}{3}
\]

### ANSWER

\[
\boxed{R=8\Omega}
\]

### CHECK

\[
V=IR
\]

\[
V=3\times8=24V
\]

The check reproduces the original supply voltage, so the result is internally consistent.

---

## Question 4 — Series Circuit
Three resistors of \(2\Omega\), \(4\Omega\) and \(6\Omega\) are connected in series across 24 V.

Calculate total resistance, current and each voltage drop.

### Answer

Series resistance:

\[
R_T=2+4+6=12\Omega
\]

Current:

\[
I=\frac{V}{R_T}
\]

\[
I=\frac{24}{12}=2A
\]

Voltage drops:

\[
V_1=IR_1=2\times2=4V
\]

\[
V_2=2\times4=8V
\]

\[
V_3=2\times6=12V
\]

Check:

\[
4+8+12=24V
\]

Therefore:

\[
\boxed{R_T=12\Omega,\quad I=2A}
\]

### Principle

A series circuit has one current path, so the same current flows through every component.

---

## Question 5 — Parallel Circuit
Two resistors of \(6\Omega\) and \(3\Omega\) are connected in parallel across 12 V.

Calculate branch currents, total current and equivalent resistance.

### Answer

Branch 1:

\[
I_1=\frac{12}{6}=2A
\]

Branch 2:

\[
I_2=\frac{12}{3}=4A
\]

Total current:

\[
I_T=2+4=6A
\]

Equivalent resistance:

\[
R_T=\frac{V}{I_T}
\]

\[
R_T=\frac{12}{6}=2\Omega
\]

Therefore:

\[
\boxed{R_T=2\Omega}
\]

### Reasonableness check

For parallel resistors:

\[
\boxed{R_T<\text{smallest branch resistance}}
\]

Here:

\[
2\Omega<3\Omega
\]

so the answer makes sense.

---

## Question 6 — Electrical Power
**State four useful power formulas and explain when they apply.**

### Answer

Basic relationship:

\[
\boxed{P=VI}
\]

Using Ohm's law:

\[
\boxed{P=I^2R}
\]

and:

\[
\boxed{P=\frac{V^2}{R}}
\]

For balanced three-phase real power:

\[
\boxed{P=\sqrt3V_LI_LPF}
\]

The first three are especially useful for DC or resistive calculations.

The three-phase formula includes power factor because current and voltage may not be in phase.

---

## Question 7 — Heater Power
A fixed-resistance heater has \(R=23\Omega\) and is supplied at 230 V.

Calculate current and power.

### Answer

Current:

\[
I=\frac{V}{R}
\]

\[
I=\frac{230}{23}=10A
\]

Power:

\[
P=VI
\]

\[
P=230\times10=2300W
\]

Therefore:

\[
\boxed{I=10A,\quad P=2.3kW}
\]

Cross-check:

\[
P=\frac{V^2}{R}
\]

\[
P=\frac{230^2}{23}=2300W
\]

---

## Question 8 — Power vs Energy
A 2 kW heater operates for 4.5 hours.

Calculate energy consumed.

### Answer

\[
E=Pt
\]

\[
E=2kW\times4.5h
\]

\[
\boxed{E=9kWh}
\]

### Key distinction

Power is a **rate**.

Energy is power accumulated over time.

Do not say a 2 kW heater “uses 2 kWh” unless a time period is given.

---

## Question 9 — AC, DC and Frequency
**Differentiate AC and DC, and define frequency.**

### Answer

**DC** has a current direction that remains one-directional in normal operation.

**AC** repeatedly changes magnitude and direction.

Frequency is the number of complete AC cycles per second.

Unit:

\[
\boxed{\text{hertz (Hz)}}
\]

At 50 Hz:

\[
\boxed{50\text{ cycles per second}}
\]

Frequency matters for transformers, motors, generators and other AC equipment.

---

## Question 10 — Formula Transposition
Starting with:

\[
P=VI
\]

make \(V\) and then \(I\) the subject.

### Answer

For \(V\):

\[
P=VI
\]

divide both sides by \(I\):

\[
\boxed{V=\frac{P}{I}}
\]

For \(I\):

divide both sides by \(V\):

\[
\boxed{I=\frac{P}{V}}
\]

### Best method

Treat the equals sign like a balance:

\[
\boxed{\text{whatever operation is performed on one side must also be performed on the other}}
\]

This is safer than relying only on “move it across and change the sign.”

---

# SECTION 2 — Cable Selection, Protection and Voltage Drop

## Question 11 — \(I_B\), \(I_N\), \(I_Z\)
**Explain \(I_B\), \(I_N\) and \(I_Z\), and state the basic overload-design relationship.**

### Answer

\[
I_B=\text{design current of the circuit}
\]

It is the current expected in normal service.

\[
I_N=\text{rated current or setting of the protective device}
\]

\[
I_Z=\text{current-carrying capacity of the cable under installed conditions}
\]

For normal overload coordination:

\[
\boxed{I_B\leq I_N\leq I_Z}
\]

### Why

If:

\[
I_N<I_B
\]

the protective device may trip during normal operation.

If:

\[
I_N>I_Z
\]

the cable may be thermally overloaded before the protective device operates.

---

## Question 12 — Overload vs Short Circuit
**Differentiate overload current from short-circuit current.**

### Answer

An **overload** is excessive current in a circuit that is otherwise electrically sound.

Examples:

- too many loads;
- motor mechanically overloaded;
- sustained excessive demand.

A **short circuit** is a low-impedance fault between conductors at different potentials.

It can produce very high current.

### Protection consequence

Overload protection is concerned with conductor thermal loading over time.

Short-circuit protection must interrupt severe fault current safely and rapidly.

---

## Question 13 — Cable-Selection Factors
**State eight factors that affect cable selection.**

### Answer

Typical factors include:

1. design current;
2. protective-device rating;
3. installation method;
4. ambient temperature;
5. grouping with other circuits;
6. thermal insulation;
7. voltage drop;
8. fault-current withstand;
9. length;
10. conductor material;
11. environmental conditions;
12. mechanical protection;
13. harmonics where applicable.

A correct cable size cannot be selected from load current alone.

---

## Question 14 — Correction Factors
**Explain \(C_a\), \(C_g\) and \(C_i\).**

### Answer

\(C_a\) accounts for **ambient temperature**.

\(C_g\) accounts for **grouping** of circuits/cables.

\(C_i\) accounts for the effect of **thermal insulation** where applicable.

If conditions make cooling worse, the cable must start with a larger tabulated current capacity.

A common design form is:

\[
I_t\geq\frac{I_N}{C_aC_gC_i}
\]

where only the applicable factors are used.

### Important

Do not derate twice for the same effect.

---

## Question 15 — Full Cable-Selection Calculation
A 6 kW single-phase heater is supplied at 230 V.

Available protective devices: 25 A, 32 A, 40 A.

Correction factors:

\[
C_a=0.94,\qquad C_i=0.78
\]

Available tabulated cable capacities:

- 4 mm² = 37 A
- 6 mm² = 47 A
- 10 mm² = 64 A

Select the minimum cable using the supplied data.

### Answer

### GIVEN

\[
P=6000W,\qquad V=230V
\]

### DESIGN CURRENT

\[
I_B=\frac{P}{V}
\]

\[
I_B=\frac{6000}{230}
\]

\[
I_B=26.09A
\]

### PROTECTIVE DEVICE

25 A is below design current.

Next available:

\[
\boxed{I_N=32A}
\]

### REQUIRED TABULATED CAPACITY

\[
I_t\geq\frac{32}{0.94\times0.78}
\]

\[
0.94\times0.78=0.7332
\]

\[
I_t\geq43.64A
\]

Compare cables:

- 4 mm² = 37 A → reject
- 6 mm² = 47 A → accept

Therefore:

\[
\boxed{6mm^2}
\]

### Check

The selected cable's tabulated capacity exceeds the required 43.64 A.

A complete real design would still check voltage drop, fault protection and other applicable conditions.

---

## Question 16 — Voltage Drop
The 6 mm² cable in Question 15 has a voltage-drop value of \(7.3mV/A/m\). Circuit length is 30 m.

Calculate voltage drop at the design current.

### Answer

Use:

\[
V_d=\frac{mV/A/m\times I_B\times L}{1000}
\]

\[
V_d=
\frac{7.3\times26.09\times30}{1000}
\]

\[
V_d\approx5.71V
\]

Therefore:

\[
\boxed{V_d\approx5.7V}
\]

### Meaning

Voltage drop increases with:

- current;
- length;
- conductor resistance.

A larger conductor normally reduces voltage drop.

---

## Question 17 — Why Excessive Voltage Drop Matters
**State five consequences of excessive voltage drop.**

### Answer

Possible consequences include:

1. weak lighting;
2. reduced heater output;
3. poor motor starting;
4. lower equipment terminal voltage;
5. increased losses;
6. poor equipment performance;
7. malfunction of voltage-sensitive equipment.

Voltage-drop compliance is therefore an operational as well as a regulatory/design issue.

---

## Question 18 — Fuse, MCB, MCCB and ACB
**Distinguish these four overcurrent devices.**

### Answer

A **fuse** opens the circuit by melting a designed element when sufficient overcurrent flows.

An **MCB** is a resettable circuit-breaker commonly used on lower-current final circuits.

An **MCCB** is a moulded-case circuit-breaker generally used for larger current ratings and often offers adjustable protection.

An **ACB** is an air circuit-breaker commonly used for high-current low-voltage switchboards/incomers.

### Selection factors

Consider:

- current rating;
- prospective fault current;
- breaking capacity;
- adjustable protection needs;
- selectivity;
- application.

A high-current circuit cannot be protected by an MCB merely because “it is also a breaker.”

---

## Question 19 — Breaking Capacity
A protective device is installed where prospective short-circuit current is 12 kA.

The breaker has a rated breaking capacity of 6 kA and no verified back-up arrangement.

Is it suitable?

### Answer

No.

The breaker must be able to interrupt the prospective fault current safely, or be part of a verified back-up/cascading arrangement.

Here:

\[
6kA<12kA
\]

Therefore the breaker by itself is inadequate.

### Danger

Attempting to interrupt current above breaking capacity can result in:

- violent failure;
- arcing;
- fire;
- enclosure rupture.

---

## Question 20 — Selectivity / Discrimination
**Define selectivity and explain why it is important.**

### Answer

Selectivity is coordination so that the protective device closest to the fault operates in preference to an upstream device where the designed coordination range permits.

Example:

\[
\text{main breaker}\rightarrow\text{DB breaker}\rightarrow\text{final circuit breaker}
\]

A fault on one final circuit should ideally disconnect only that circuit.

Benefits:

- healthy circuits remain energized;
- easier fault location;
- less disruption;
- improved continuity of service.

Ratings alone do not prove selectivity; time/current characteristics and manufacturer coordination data matter.

---

# SECTION 3 — RCDs, SPDs, AFDDs and Current BS 7671 Awareness

## Question 21 — RCD Principle
**Explain how an RCD detects an earth-leakage fault.**

### Answer

The RCD monitors the algebraic sum of current in the live conductors.

For a healthy single-phase circuit:

\[
I_L\approx I_N
\]

Therefore residual current is near zero.

If some current flows to Earth:

\[
I_L\neq I_N
\]

The difference is residual current:

\[
I_\Delta=|I_L-I_N|
\]

When the device's operating conditions are met, it opens the circuit.

### Key point

An RCD detects **imbalance**, not simply “high current.”

---

## Question 22 — RCD vs RCBO
**What is the difference between an RCD/RCCB and an RCBO?**

### Answer

An RCD/RCCB provides residual-current protection but does not necessarily provide overload/short-circuit protection.

An RCBO combines:

- residual-current protection;
- overload protection;
- short-circuit protection.

Therefore an RCCB normally needs suitable overcurrent protection elsewhere.

---

## Question 23 — RCD Test Button
**Why is pressing the RCD test button useful but not the same as instrument verification?**

### Answer

The test button checks the device's internal operating mechanism by creating a designed imbalance.

It is useful for functional checking.

However it does not by itself provide a measured verification of:

- operating time;
- circuit conditions;
- test current response;
- installation performance.

A suitable RCD tester is used where formal verification requires measured performance.

---

## Question 24 — Current RCD Types
**In current BS 7671 study guidance, why is it important to distinguish Type AC, A, F and B RCDs?**

### Answer

Different electronic loads can produce different residual-current waveforms.

Current guidance distinguishes devices by the residual currents they can correctly detect.

In broad terms:

- Type AC — sinusoidal AC residual current, with restricted application;
- Type A — AC plus pulsating DC residual current;
- Type F — extends capability for certain frequency-controlled/single-phase electronic loads;
- Type B — includes more complex residual currents, including smooth DC applications.

### Current-awareness point

The uploaded A4:2026 On-Site Guide states that Type AC RCDs should not be used for general purposes; device selection must match expected residual-current characteristics.

This is **BS 7671 study guidance**, not a substitute for Kenyan installation rules.

---

## Question 25 — SPD Function
**What does an SPD protect against, and what does it not replace?**

### Answer

An SPD limits transient overvoltage and diverts surge current.

Sources include:

- lightning-related transients;
- switching events.

An SPD does **not** replace:

- overcurrent protection;
- RCD protection;
- earthing;
- normal insulation.

It protects against a different electrical phenomenon: transient overvoltage.

---

## Question 26 — SPD Types
**What are the broad applications of Type 1, Type 2 and Type 3 SPDs in the current On-Site Guide?**

### Answer

In broad BS 7671 study terms:

- **Type 1** — used where lightning-current handling at the origin is required;
- **Type 2** — commonly used at distribution boards;
- **Type 3** — used near terminal equipment.

Coordination between devices is important where multiple SPDs are used.

### Practical point

SPD connecting conductors should be kept short because long leads increase residual voltage due to inductive effects.

---

## Question 27 — AFDD
**What is an AFDD and what type of hazard is it intended to reduce?**

### Answer

AFDD means:

\[
\boxed{\text{Arc Fault Detection Device}}
\]

It is intended to detect dangerous arcing patterns that ordinary overcurrent protection may not detect reliably.

Arcing can produce intense local heating and fire risk without drawing enough current to operate a normal breaker quickly.

### Current A4 awareness

The current On-Site Guide includes AFDD requirements/recommendations for specified single-phase AC final circuits and certain higher-risk residential premises.

Treat this as current BS 7671 study material, not automatically as a Kenyan legal requirement.

---

## Question 28 — MCB Trips but RCD Does Not
A circuit trips its MCB immediately when a switch is operated, but the RCD does not trip.

What fault type is most strongly suggested?

### Answer

An immediate MCB trip suggests a low-impedance overcurrent fault such as:

- line-neutral short;
- line-line short;
- severe wiring short on the switched path.

Because the RCD does not trip, there may be little or no residual current to Earth.

This does not prove the fault is not earth-related, but it directs fault-finding toward overcurrent paths first.

---

## Question 29 — RCD Trips but MCB Does Not
A circuit trips the RCD but not the MCB.

What does this suggest?

### Answer

It suggests a residual-current fault where current is leaving the intended live-conductor path.

Examples:

- line-to-earth leakage;
- neutral-to-earth fault under load;
- moisture;
- damaged insulation to exposed metalwork.

The leakage may be only tens of milliamps—far below the current needed to trip a normal MCB.

---

## Question 30 — Protective Device Selection
**List eight checks required before choosing a protective device.**

### Answer

Consider:

1. design current;
2. cable capacity;
3. overload requirement;
4. short-circuit protection;
5. prospective fault current;
6. breaking capacity;
7. required disconnection performance;
8. load starting/inrush current;
9. residual-current requirements;
10. selectivity;
11. device type/curve;
12. environmental conditions.

The correct answer is never simply “choose the next breaker above the load.”

---

# SECTION 4 — Earthing, Bonding and Automatic Disconnection

## Question 31 — Earthing, CPC and Protective Earthing
**Define the practical purpose of earthing and the CPC.**

### Answer

Protective earthing connects exposed conductive metalwork into the installation's protective earthing system.

A CPC connects exposed-conductive-parts of circuit equipment toward the main earthing terminal.

Its purpose is to create a reliable fault-current path.

During a line-to-case fault:

\[
\text{line}\rightarrow\text{fault}\rightarrow\text{CPC}\rightarrow\text{earthing path}\rightarrow\text{source}
\]

The protective device can then disconnect.

---

## Question 32 — Exposed vs Extraneous Conductive Part
**Differentiate these two terms.**

### Answer

An **exposed-conductive-part** is conductive equipment metalwork that:

- can be touched;
- is not normally live;
- can become live if insulation fails.

An **extraneous-conductive-part** is conductive material not forming part of the electrical installation but capable of introducing a potential, usually Earth potential.

Example:

- motor metal frame → exposed-conductive-part;
- metallic water pipe entering a building → potentially extraneous-conductive-part.

---

## Question 33 — Main Earthing Terminal
**What is the MET and why is it important?**

### Answer

The main earthing terminal is the principal point where protective conductors are connected to the means of earthing.

It may connect:

- circuit protective conductors;
- earthing conductor;
- protective bonding conductors;
- other protective/functional earthing conductors where applicable.

It forms the central reference point of the installation protective network.

---

## Question 34 — Equipotential Bonding
**What is protective equipotential bonding and what problem does it reduce?**

### Answer

Protective bonding electrically connects relevant conductive parts so that dangerous potential differences between simultaneously accessible parts are reduced.

It is concerned with:

\[
\boxed{\text{touch voltage}}
\]

not with carrying normal load current.

A person is endangered by voltage **between** points they can touch.

Bonding reduces that difference during fault conditions.

---

## Question 35 — TN-S
**Describe the fault-return principle of TN-S.**

### Answer

In TN-S:

- the source neutral is earthed;
- neutral and protective conductors are separate throughout the relevant supply arrangement;
- exposed-conductive-parts are connected to the source earth through a metallic protective path.

A line-to-case fault returns mainly through the CPC/earthing metallic route rather than relying on soil.

---

## Question 36 — TN-C-S / PME
**Describe TN-C-S and explain why PEN integrity matters.**

### Answer

In TN-C-S:

- neutral and protective functions are combined in a PEN conductor over part of the supply;
- they are separated into neutral and protective conductors at the installation.

PME is associated with this arrangement.

### Why PEN failure is serious

If the PEN opens upstream, the consumer's protective metalwork can rise to a dangerous potential because the protective system is connected to the supply neutral/PEN point.

That is why PEN integrity is a major safety issue.

---

## Question 37 — TT
**Describe a TT system and explain why RCDs are commonly important.**

### Answer

In TT:

- the source has an earth connection;
- the consumer has a local earth electrode;
- exposed-conductive-parts are connected to the local electrode.

The earth-fault path includes electrode and soil resistance.

That path may be too high in impedance to produce enough current for a normal overcurrent device to disconnect quickly.

Therefore residual-current fault protection is commonly essential.

---

## Question 38 — \(Z_e\), \(R_1+R_2\), \(Z_s\)
A circuit has:

\[
Z_e=0.35\Omega
\]

and:

\[
R_1+R_2=0.62\Omega
\]

Calculate \(Z_s\).

### Answer

\[
Z_s=Z_e+(R_1+R_2)
\]

\[
Z_s=0.35+0.62
\]

\[
\boxed{Z_s=0.97\Omega}
\]

### Meaning

- \(Z_e\) = external part of the earth-fault loop;
- \(R_1+R_2\) = line plus CPC circuit resistance;
- \(Z_s\) = total earth-fault loop impedance at the point.

---

## Question 39 — Earth-Fault Current
Using Question 38 and \(U_0=230V\), calculate approximate earth-fault current.

### Answer

\[
I_f=\frac{U_0}{Z_s}
\]

\[
I_f=\frac{230}{0.97}
\]

\[
\boxed{I_f\approx237A}
\]

### Principle

\[
Z_s\downarrow\Rightarrow I_f\uparrow
\]

\[
Z_s\uparrow\Rightarrow I_f\downarrow
\]

The fault current must be sufficient for the protective arrangement to disconnect as required.

---

## Question 40 — High \(Z_s\)
**Give five possible reasons for unexpectedly high \(Z_s\).**

### Answer

Possible causes:

1. loose CPC termination;
2. broken or damaged CPC;
3. high-resistance joint;
4. incorrect conductor size;
5. poor earthing connection;
6. unexpectedly high external impedance;
7. corroded termination;
8. long circuit length;
9. test error.

Do not merely record a high reading—investigate the fault path.

---

## Question 41 — Automatic Disconnection of Supply
**Explain ADS as a complete protection concept.**

### Answer

ADS means automatic disconnection when a fault creates a dangerous condition.

The system depends on:

1. protective earthing;
2. bonding where required;
3. a sufficiently effective fault path;
4. a suitable protective device;
5. operation within the required disconnection condition/time.

The concept is:

\[
\boxed{\text{fault occurs}\rightarrow\text{fault current flows}\rightarrow\text{device detects}\rightarrow\text{supply disconnects}}
\]

Earthing alone is not enough if the device does not operate.

---

## Question 42 — Current BS Disconnection-Time Awareness
**What disconnection-time pattern does the uploaded A4:2026 On-Site Guide show for ordinary TN and TT final circuits within its scope?**

### Answer

For current BS 7671 study guidance, the On-Site Guide shows the familiar pattern of faster disconnection for ordinary final circuits:

- TN final circuits within the stated current limits: typically **0.4 s**;
- TT comparable final circuits: typically **0.2 s**;
- longer times are permitted for specified other circuits.

### Critical caution

These are **BS 7671 current study values**. In an EPRA question asking for a Kenyan legal/national value, answer using the applicable Kenyan standard or information explicitly given.

---

## Question 43 — TT RCD Condition
Using the study relationship:

\[
R_AI_{\Delta n}\leq50V
\]

calculate the maximum theoretical \(R_A\) for a 30 mA RCD.

### Answer

Convert:

\[
30mA=0.03A
\]

Rearrange:

\[
R_A\leq\frac{50}{0.03}
\]

\[
R_A\leq1666.7\Omega
\]

Therefore:

\[
\boxed{R_A\approx1667\Omega\text{ theoretical maximum}}
\]

### Important

This is not a good practical electrode-design target.

A much lower, stable electrode resistance is normally desirable because real installations must remain safe under changing soil and system conditions.

---

## Question 44 — Improving Earth-Electrode Resistance
**State four technically reasonable methods of improving a high earth-electrode resistance.**

### Answer

Possible methods:

1. increase electrode depth;
2. install additional correctly spaced electrodes in parallel;
3. use a more suitable location/soil;
4. increase effective electrode contact area;
5. use an approved engineered earthing enhancement where permitted.

### Why spacing matters

Electrodes placed too close together have overlapping resistance areas and may not provide the expected improvement.

---

## Question 45 — Adiabatic Equation
**State the adiabatic equation and explain each term.**

### Answer

\[
\boxed{S=\frac{\sqrt{I^2t}}{k}}
\]

where:

- \(S\) = minimum conductor cross-sectional area;
- \(I\) = fault current;
- \(t\) = protective-device clearing time;
- \(k\) = conductor/insulation/material thermal constant.

### Physical meaning

\[
I^2t
\]

represents fault-energy stress.

Higher fault current or slower disconnection increases heating.

The conductor must survive until protection clears the fault.

---

# SECTION 5 — Inspection, Testing, Safe Isolation and Interpretation

## Question 46 — Verification
**What does verification include?**

### Answer

Verification is the process of checking that an electrical installation complies with relevant requirements.

It comprises:

\[
\boxed{\text{inspection + testing + certification}}
\]

The sequence matters because instruments cannot identify every visible workmanship defect.

---

## Question 47 — Inspection
**Why should inspection normally precede testing?**

### Answer

Inspection can identify defects that should be corrected before electrical tests are applied.

Examples:

- damaged insulation;
- wrong conductor size;
- exposed live parts;
- loose terminals;
- missing CPC;
- incorrect device;
- damaged enclosure.

Testing a visibly dangerous installation first can create unnecessary risk.

---

## Question 48 — Safe Isolation
**Give a complete single-phase safe-isolation sequence.**

### Answer

1. identify the correct circuit/equipment;
2. identify all possible supplies/backfeeds;
3. inspect the voltage indicator;
4. prove the indicator on a proving unit/known source;
5. isolate the correct device;
6. lock off;
7. attach warning notice;
8. retain control of key;
9. test:
   - L-N;
   - L-E;
   - N-E;
10. re-prove the indicator;
11. begin work only after the circuit is proved dead.

### Key statement

\[
\boxed{\text{OFF}\neq\text{proved dead}}
\]

---

## Question 49 — Three-Phase Proving Dead
**What conductor combinations should be considered when proving a three-phase four-wire system dead?**

### Answer

A systematic check includes:

Phase to Earth:

- L1-E;
- L2-E;
- L3-E.

Neutral to Earth:

- N-E.

Phase to Neutral:

- L1-N;
- L2-N;
- L3-N.

Phase to Phase:

- L1-L2;
- L1-L3;
- L2-L3.

This helps avoid missing one energized conductor or phase.

---

## Question 50 — Continuity Testing
**What does a low-resistance continuity test prove?**

### Answer

It verifies that a conductor/path is electrically continuous and measures its low resistance.

Applications include:

- CPC continuity;
- bonding;
- \(R_1+R_2\);
- ring conductor end-to-end tests.

A continuity tester is different from an insulation-resistance tester.

---

## Question 51 — Radial \(R_1+R_2\)
**Explain a dead-test method for obtaining \(R_1+R_2\) on a radial circuit.**

### Answer

After safe isolation:

1. disconnect/prepare the circuit as required;
2. link line conductor and CPC at the origin;
3. measure between line and CPC at each point;
4. the furthest point normally gives the greatest resistance;
5. record/interpret the result.

The measured path is:

\[
\text{line out}+\text{CPC back}
\]

This helps verify CPC continuity and can be used in:

\[
Z_s=Z_e+(R_1+R_2)
\]

---

## Question 52 — Ring End-to-End Test
A ring gives:

\[
r_1=0.80\Omega,\quad r_n=0.82\Omega,\quad r_2=1.34\Omega
\]

Is the pattern reasonable?

### Answer

Yes, broadly.

Line and neutral are normally same material/CSA/length, so:

\[
r_1\approx r_n
\]

The CPC is often smaller, so:

\[
r_2>r_1
\]

Therefore the pattern is plausible.

It still must be checked against:

- circuit length;
- cable construction;
- expected conductor resistance.

---

## Question 53 — Ring Crossover Expected Values
For a healthy ring, explain the approximate values expected after line-neutral and line-CPC cross-connection.

### Answer

For line-neutral crossover:

\[
\boxed{\frac{r_1+r_n}{4}}
\]

approximately at each socket, subject to circuit geometry and spurs.

For line-CPC crossover:

\[
\boxed{\frac{r_1+r_2}{4}}
\]

approximately.

### Why divide by four?

At a point on the ring there are two parallel paths back to the origin; the crossover arrangement creates approximately equal parallel combinations.

A spur often produces a higher reading than points directly on the ring.

---

## Question 54 — Broken Ring Conductor
The line conductor is open somewhere on a ring, but every socket still works.

Why is this possible and why is it dangerous?

### Answer

Every socket may still receive supply from one direction.

The ring has effectively become two radial legs.

The danger is that the design assumed two parallel current paths.

One leg may now carry more current than intended.

Therefore:

\[
\boxed{\text{all sockets working does not prove ring continuity}}
\]

End-to-end testing is essential.

---

## Question 55 — Insulation Resistance
**What is the purpose of insulation-resistance testing?**

### Answer

It verifies that conductors which should be electrically separated have sufficiently high resistance between them.

It can reveal:

- damaged insulation;
- moisture;
- contamination;
- trapped conductors;
- incorrect connections;
- connected equipment affecting the circuit.

An IR test uses a dedicated DC test voltage, not the low test voltage of an ordinary multimeter resistance range.

---

## Question 56 — IR Precautions
**State six precautions before an insulation-resistance test.**

### Answer

1. safely isolate and prove dead;
2. disconnect sensitive electronic equipment where required;
3. isolate or account for SPDs/electronics;
4. use the correct test voltage;
5. ensure nobody can touch conductors;
6. discharge capacitive circuits after testing;
7. place switches in the required position;
8. separate connected loads if they would distort/damage the test.

---

## Question 57 — Polarity
**What is polarity testing intended to confirm?**

### Answer

Polarity verifies that conductors are connected to the intended terminals.

Examples:

- line reaches line terminal;
- neutral reaches neutral;
- single-pole switches interrupt line;
- protective devices are placed in intended line conductors;
- socket terminals are correct.

### Danger of wrong polarity

An appliance may appear OFF while internal parts remain live.

---

## Question 58 — \(Z_e\) vs \(Z_s\)
**Differentiate \(Z_e\) and \(Z_s\).**

### Answer

\(Z_e\) is the external earth-fault loop impedance at the installation origin.

\(Z_s\) is the total earth-fault loop impedance at the point being considered.

Therefore:

\[
\boxed{Z_s=Z_e+(R_1+R_2)}
\]

approximately for the dead-test calculation method.

---

## Question 59 — Phase Sequence
**What is phase sequence and why is it tested?**

### Answer

Phase sequence is the order in which the three phase voltages reach corresponding points of their cycles.

Example:

\[
L1\rightarrow L2\rightarrow L3
\]

It matters because phase order affects:

- motor rotation;
- pumps;
- fans;
- conveyors;
- phase-sensitive systems.

A phase-sequence indicator is used for verification.

---

## Question 60 — Reasonableness of Results
A tester expects \(R_1+R_2\approx0.45\Omega\) but measures \(4.5\Omega\).

What should happen next?

### Answer

The result should **not** simply be recorded.

Investigate possibilities such as:

- loose connection;
- damaged CPC;
- wrong circuit;
- incorrect test link;
- poor accessory contact;
- wrong conductor size;
- meter lead problem;
- instrument issue.

A competent tester predicts the approximate result before measuring.

---

# SECTION 6 — Lighting, Socket Circuits and Domestic Fault Finding

## Question 61 — Final Circuit, Radial, Ring and Spur
**Differentiate these four terms.**

### Answer

A **final circuit** directly supplies current-using equipment or outlet points.

A **radial circuit** runs from the origin through points and terminates at the final point.

A **ring final circuit** leaves the origin, passes through points and returns to the same origin.

A **spur** is a branch from a radial or ring final circuit.

The geometry of the circuit affects:

- current paths;
- testing;
- conductor loading;
- fault diagnosis.

---

## Question 62 — One-Way Lighting
**Explain a one-way lighting circuit from line to neutral.**

### Answer

A typical path is:

\[
\text{line}\rightarrow\text{switch COM}\rightarrow\text{switch contact}\rightarrow\text{switched line}\rightarrow\text{lamp}\rightarrow\text{neutral}
\]

When the switch closes, current flows and the lamp operates.

The CPC remains continuous to any equipment/accessory requiring protective earthing.

### Critical point

The switch should interrupt the **line**, not simply the neutral.

---

## Question 63 — Two-Way Lighting
**Explain how two-way switching controls one lamp from two positions.**

### Answer

Two changeover switches are used.

Each has:

- COM;
- L1;
- L2.

The two switches are linked by two strappers.

Operating either switch changes which strapper forms the continuity path.

The lamp is ON when a continuous line path exists through the selected contacts.

### Better understanding

Do not memorize “both switches up = on.”

Trace the electrical path.

---

## Question 64 — Intermediate Switching
**How is one lamp controlled from three or more locations?**

### Answer

Use:

- a two-way switch at each end;
- one or more intermediate switches between them.

The intermediate switch changes the relationship of the two strapper conductors:

- straight-through;
- crossed.

Each intermediate switch adds another control position.

---

## Question 65 — Neutral Switched Instead of Line
**Why is switching only the neutral dangerous?**

### Answer

The lamp may turn OFF, but the luminaire can remain connected to line potential internally.

A person changing the lamp may believe the circuit is safe because the light is OFF.

Therefore:

\[
\boxed{\text{OFF operation does not necessarily mean isolated}}
\]

Correct polarity ensures the normal single-pole switch interrupts line.

---

## Question 66 — Class I vs Class II Luminaire
**Differentiate Class I and Class II equipment.**

### Answer

**Class I** relies on basic insulation plus protective earthing of exposed conductive metalwork.

If basic insulation fails, the CPC provides a fault path.

**Class II** uses double or reinforced insulation as its protective construction and does not depend on a protective-earth connection to exposed metalwork.

### Practical implication

Never assume all metal-looking equipment is Class I or all plastic-looking equipment is Class II. Check the equipment marking/construction.

---

## Question 67 — Socket Polarity
**What connections should be verified at a socket outlet?**

### Answer

Verify:

- line to L;
- neutral to N;
- CPC to earth terminal.

Also verify protective continuity.

Wrong line/neutral connection can place switching/fusing in the wrong conductor inside connected appliances.

---

## Question 68 — Radial vs Ring
**Give three advantages and three risks/limitations of a ring final compared with a radial.**

### Answer

Possible advantages:

1. two current paths;
2. efficient conductor use in the intended design;
3. lower effective resistance to many points.

Risks/limitations:

1. hidden open ring may leave sockets working;
2. testing is more complex;
3. load distribution matters;
4. incorrect spurs can compromise design.

A radial is simpler to understand/test, but conductor/protection selection must suit the full load path.

---

## Question 69 — Fault Symptom: Lamp Causes MCB Trip
A lamp circuit operates normally until one switch is turned ON; then the MCB trips immediately.

Give four likely causes.

### Answer

Possible causes:

1. line-neutral short in the switched cable;
2. line-CPC fault causing high fault current;
3. damaged luminaire;
4. trapped conductor at switch/luminaire;
5. failed lamp/control gear causing severe current;
6. incorrect termination.

The fact that the fault appears only when switched ON narrows the fault to the energized switched path/load.

---

## Question 70 — Fault Symptom: RCD Trips When Appliance Connected
The socket circuit itself remains energized until one appliance is plugged in; then the RCD trips.

What should be suspected?

### Answer

Suspect leakage from that appliance or its flex/filter to Earth.

Possible causes:

- insulation breakdown;
- moisture;
- damaged flex;
- faulty heating element;
- EMC-filter leakage exceeding acceptable conditions.

Do not repeatedly reset the RCD without investigation.

---

## Question 71 — Domestic Circuit Division
**Why should a house be divided into several final circuits rather than one large circuit?**

### Answer

Circuit division:

- reduces inconvenience after a fault;
- improves load management;
- makes protection more appropriate;
- simplifies maintenance;
- improves fault isolation;
- can prevent the whole dwelling losing lighting due to one fault.

Examples of separate duties may include:

- lighting;
- socket circuits;
- cooker;
- water heating;
- other significant fixed loads.

---

## Question 72 — Integrated House Design
A two-storey house has lighting, general sockets, a 5.5 kW water heater and an electric cooker.

Describe a sensible design approach.

### Answer

A strong answer should:

1. establish connected load and expected maximum demand;
2. divide circuits logically;
3. use separate lighting circuits where practical;
4. provide appropriate socket circuit(s);
5. provide dedicated circuits for significant fixed loads such as heater/cooker;
6. calculate \(I_B\);
7. select \(I_N\);
8. select cable using installation conditions/correction factors;
9. check voltage drop;
10. provide appropriate earthing/CPC;
11. select RCD/RCBO and other protective measures as required;
12. inspect, test and commission before use.

The strongest answer explains the **design process**, not merely lists familiar cable sizes.

---

# SECTION 7 — Safety, First Aid, Instruments, Diversity and EPRA Scope

## Question 73 — Electric Shock
**Define electric shock and state six factors affecting severity.**

### Answer

Electric shock is the dangerous physiological effect of current passing through a person or animal.

Severity depends on:

1. current magnitude;
2. duration;
3. current path through body;
4. frequency;
5. skin/contact resistance;
6. wet/dry conditions;
7. contact area;
8. health/physiological condition.

Current through the chest is especially dangerous.

---

## Question 74 — Electrical-Shock First Aid
A worker is still touching a live conductor.

State the correct response sequence.

### Answer

1. **Do not touch the casualty while the source may be live.**
2. safely isolate/disconnect the electrical source.
3. call/activate emergency medical help.
4. once safe, check responsiveness and breathing.
5. if unresponsive and not breathing normally/only gasping, begin CPR according to training.
6. use an AED as soon as available.
7. treat burns/trauma and continue monitoring.

The first principle is:

\[
\boxed{\text{do not become a second casualty}}
\]

---

## Question 75 — Electrical Burns
**Why may an electrical burn be more serious than the visible skin injury?**

### Answer

Current may pass through deep tissue.

Possible hidden effects include:

- muscle damage;
- nerve damage;
- vascular injury;
- cardiac rhythm disturbance;
- deep internal burns.

Therefore a small entry/exit mark does not prove the injury is minor.

Electrical injury should receive appropriate medical assessment.

---

## Question 76 — Instrument Matching
Match the task to the best instrument:

1. prove dead;
2. CPC resistance;
3. insulation resistance;
4. load current without disconnecting conductor;
5. \(Z_s\);
6. RCD operating test;
7. phase order.

### Answer

1. two-pole voltage detector + proving unit;
2. low-resistance continuity tester;
3. insulation-resistance tester;
4. clamp meter;
5. earth-fault loop impedance tester;
6. RCD tester;
7. phase-sequence indicator.

The instrument must be chosen for the **quantity and test purpose**.

---

## Question 77 — Clamp Meter
**Why should an ordinary load-current clamp be placed around one conductor, not both line and neutral?**

### Answer

Line and neutral currents flow in opposite directions.

Their magnetic fields largely cancel.

If both are inside the clamp:

\[
I_L-I_N\approx0
\]

so an ordinary load-current reading will be near zero.

A sensitive leakage-current clamp deliberately uses this cancellation principle to measure residual current.

---

## Question 78 — Instrument Accuracy and CAT Rating
**Why are calibration/verification and measurement category important?**

### Answer

Calibration/accuracy verification gives confidence that the displayed value is reliable.

Measurement category relates to the transient-energy environment in which the meter is safe to use.

A meter that can display 400 V is not automatically safe on a high-energy distribution board.

Wrong instrument selection can cause:

- internal flashover;
- meter explosion;
- arc injury.

---

## Question 79 — Demand Factor vs Diversity Factor
**Define both and distinguish them.**

### Answer

Demand factor:

\[
\boxed{
\frac{\text{maximum demand}}
{\text{connected load}}
}
\]

Normally:

\[
\leq1
\]

Diversity factor:

\[
\boxed{
\frac{\sum\text{individual maximum demands}}
{\text{maximum simultaneous system demand}}
}
\]

Normally:

\[
>1
\]

Do not confuse the two ratios.

---

## Question 80 — Diversity Calculation
Three sections have individual maximum demands of:

\[
12kW,\quad18kW,\quad20kW
\]

The building maximum simultaneous demand is 32 kW.

Calculate diversity factor.

### Answer

Sum individual demands:

\[
12+18+20=50kW
\]

\[
DF=\frac{50}{32}
\]

\[
\boxed{DF=1.5625\approx1.56}
\]

The result above 1 is reasonable for diversity factor.

---

## Question 81 — Current C2 Scope
**State the core current EPRA C2 assessment scope.**

### Answer

C2 includes:

- low-voltage;
- single-phase electrical installation work;
- buildings up to two storeys;
- excluding factories;
- excluding places designated for public entertainment;

plus the published technical competency areas such as:

- circuit theory;
- lighting;
- radial/ring sockets;
- cable/protective-device selection;
- instruments;
- testing;
- earthing;
- safety/first aid.

---

## Question 82 — Current C1 Scope
**State the core current EPRA C1 assessment scope.**

### Answer

C1 includes the C2 competencies and extends to:

- low-voltage three-phase systems;
- buildings up to four storeys;
- with the same stated exclusions of factories and public-entertainment premises;

plus:

- three-phase calculations;
- cable/protective-device sizing;
- power-factor correction;
- three-phase machines;
- motor starting, speed control and protection;
- initial and periodic inspection/testing.

---

## Question 83 — Worker vs Contractor
**Why are worker certification and contractor licensing not the same thing?**

### Answer

Worker certification concerns the individual's technical authorization/class.

Contractor licensing concerns authorization to undertake electrical installation work as a contracting activity/business.

A person must:

- remain within technical class;
- and satisfy the applicable contractor/licensing arrangement.

Technical competence alone does not expand legal authorization.

---

## Question 84 — Source Hierarchy
**If an EPRA question asks for Kenyan law but your BS 7671 book gives a different-looking rule, which source controls your exam answer?**

### Answer

Use the applicable Kenyan source.

A strong hierarchy is:

1. Kenya legislation;
2. enacted EPRA regulations/rules;
3. current EPRA official requirements;
4. applicable Kenya Standards;
5. utility requirements where relevant;
6. BS 7671 as technical/reference learning where appropriate.

BS 7671 should not be silently presented as Kenyan legislation.

---

# SECTION 8 — Three-Phase Systems and Calculations

## Question 85 — Three-Phase Supply
**What is a balanced three-phase supply?**

### Answer

It consists of three sinusoidal phase voltages with:

- same frequency;
- equal nominal magnitude;
- phase displacement of:

\[
\boxed{120^\circ}
\]

The equal spacing comes from:

\[
\frac{360^\circ}{3}=120^\circ
\]

This creates smooth power transfer and naturally produces a rotating magnetic field in motors.

---

## Question 86 — Star Relationships
**State the balanced star voltage/current relationships.**

### Answer

\[
\boxed{V_L=\sqrt3V_{ph}}
\]

\[
\boxed{I_L=I_{ph}}
\]

Therefore:

\[
V_{ph}=\frac{V_L}{\sqrt3}
\]

For 415 V:

\[
V_{ph}=\frac{415}{1.732}
\]

\[
\boxed{V_{ph}\approx239.6V}
\]

---

## Question 87 — Delta Relationships
**State the balanced delta voltage/current relationships.**

### Answer

\[
\boxed{V_L=V_{ph}}
\]

\[
\boxed{I_L=\sqrt3I_{ph}}
\]

Therefore:

\[
I_{ph}=\frac{I_L}{\sqrt3}
\]

The \(\sqrt3\) factor comes from phasor/vector relationships, not arbitrary multiplication.

---

## Question 88 — Three-Phase Power
A balanced load takes 30 kW from a 400 V supply at PF 0.85.

Calculate line current.

### Answer

### GIVEN

\[
P=30000W
\]

\[
V_L=400V
\]

\[
PF=0.85
\]

### FORMULA

\[
P=\sqrt3V_LI_LPF
\]

Rearrange:

\[
I_L=\frac{P}{\sqrt3V_LPF}
\]

### SUBSTITUTION

\[
I_L=
\frac{30000}
{1.732\times400\times0.85}
\]

\[
\boxed{I_L\approx50.9A}
\]

---

## Question 89 — Balanced and Unbalanced Loads
**What happens to neutral current when a three-phase four-wire load becomes unbalanced?**

### Answer

For an ideal balanced load:

\[
\boxed{I_N=0}
\]

because equal phase currents 120° apart cancel vectorially.

With unequal single-phase loads, they no longer cancel completely.

Neutral current therefore flows.

Consequences of poor balance can include:

- one phase overloaded;
- unequal voltage drops;
- increased neutral loading;
- poor system utilization.

---

## Question 90 — Phase Sequence
**What happens when any two phases feeding a three-phase induction motor are interchanged?**

### Answer

The phase sequence reverses.

That reverses the rotating magnetic field.

The motor normally rotates in the opposite direction.

Therefore reversing contactor circuits interchange two phases but must be interlocked to prevent simultaneous forward/reverse connection.

---

## Question 91 — Synchronous Speed
A six-pole motor is supplied at 50 Hz.

Calculate synchronous speed.

### Answer

\[
N_s=\frac{120f}{P}
\]

\[
N_s=\frac{120\times50}{6}
\]

\[
\boxed{N_s=1000rpm}
\]

More poles mean lower synchronous speed for the same frequency.

---

## Question 92 — Slip
The six-pole motor in Question 91 runs at 960 rpm.

Calculate slip percentage.

### Answer

\[
s=\frac{N_s-N_r}{N_s}\times100
\]

\[
s=\frac{1000-960}{1000}\times100
\]

\[
\boxed{s=4\%}
\]

Slip is necessary in an induction motor because relative motion is needed to induce rotor current and torque.

---

## Question 93 — Motor Input Current with Efficiency
A three-phase motor delivers 22 kW mechanical output at:

- 415 V;
- efficiency = 91%;
- PF = 0.84.

Calculate approximate line current.

### Answer

### STEP 1 — Electrical input power

\[
\eta=\frac{P_{out}}{P_{in}}
\]

\[
P_{in}=\frac{P_{out}}{\eta}
\]

\[
P_{in}=\frac{22000}{0.91}
\]

\[
P_{in}=24175.8W
\]

### STEP 2 — Line current

\[
I_L=
\frac{P_{in}}
{\sqrt3V_LPF}
\]

\[
I_L=
\frac{24175.8}
{1.732\times415\times0.84}
\]

\[
\boxed{I_L\approx40.0A}
\]

### Common mistake

Do not use shaft output directly as electrical input unless the question tells you to ignore efficiency.

---

## Question 94 — kW vs kVA Rating
**Why are transformers and generators commonly rated in kVA rather than only kW?**

### Answer

Their heating/capacity is strongly related to:

- voltage;
- current;

rather than the load power factor alone.

Apparent power is:

\[
S=\sqrt3V_LI_L
\]

in a balanced three-phase system.

The actual kW delivered depends on the connected load power factor:

\[
P=S\times PF
\]

Therefore the equipment capability is conveniently expressed in kVA.

---

# SECTION 9 — Motors, Starting, Protection and Fault Finding

## Question 95 — Induction-Motor Principle
**Explain how a three-phase induction motor produces torque.**

### Answer

1. three-phase stator currents are 120° displaced;
2. their magnetic fields combine into a rotating magnetic field;
3. the rotating field cuts rotor conductors;
4. rotor EMF is induced;
5. rotor current flows;
6. rotor current produces its own magnetic field;
7. interaction between stator and rotor fields creates torque;
8. rotor accelerates in the direction of the rotating field.

The rotor must remain slightly below synchronous speed so induction continues.

---

## Question 96 — DOL Starting
**Explain DOL starting and give two advantages and two limitations.**

### Answer

DOL connects the motor directly to full line voltage through suitable switching/protection.

Advantages:

- simple;
- low cost;
- high starting torque;
- easy maintenance.

Limitations:

- high starting current;
- voltage dip;
- mechanical shock;
- unsuitable for some larger motors/weak supplies.

---

## Question 97 — Star-Delta Starting
**Why does star-delta starting reduce starting current and torque?**

### Answer

During star starting:

\[
V_{ph}=\frac{V_L}{\sqrt3}
\]

Each winding receives only about 57.7% of the delta winding voltage.

Under the usual simplified comparison:

\[
I_{L,star}\approx\frac13I_{L,delta}
\]

Motor torque is approximately proportional to:

\[
T\propto V^2
\]

so:

\[
T_{star}\approx\frac13T_{delta}
\]

This is why star-delta is unsuitable where high starting torque is required.

---

## Question 98 — Motor Protection
**Differentiate overload, short-circuit, phase-failure and earth-fault protection for a motor.**

### Answer

**Overload protection** protects against sustained excessive motor current/thermal stress.

**Short-circuit protection** clears very high fault current from low-impedance conductor faults.

**Phase-failure protection** detects loss of a phase or serious unbalance that can overheat the motor.

**Earth-fault protection** responds to current flowing from live conductors to exposed metalwork/Earth.

One device does not automatically provide all four functions.

---

## Question 99 — Single Phasing
**What is single phasing and why is it dangerous?**

### Answer

Single phasing occurs when one phase is lost while a three-phase motor remains connected to the other phases.

Effects can include:

- reduced torque;
- high current in remaining phases;
- failure to start;
- overheating;
- winding damage.

A running motor may continue turning, which can hide the fault until overheating becomes severe.

---

## Question 100 — Motor Hums but Does Not Start
A motor hums but fails to accelerate.

State six possible causes and the correct first troubleshooting action.

### Answer

Possible causes:

1. loss of one phase;
2. locked mechanical load;
3. seized bearing;
4. severe undervoltage;
5. incorrect star/delta connection;
6. faulty contactor pole;
7. winding fault;
8. excessive load.

### First action

\[
\boxed{\text{isolate safely}}
\]

Do not repeatedly energize a stalled motor because starting current can rapidly overheat the windings.

---

## Question 101 — VFD
**How does a VFD control induction-motor speed?**

### Answer

Synchronous speed is:

\[
N_s=\frac{120f}{P}
\]

A VFD changes the applied frequency.

Therefore changing \(f\) changes synchronous speed.

The VFD also controls voltage/current appropriately to maintain suitable motor magnetic conditions.

Benefits include:

- adjustable speed;
- controlled acceleration;
- reduced mechanical shock;
- potential energy savings on suitable variable-torque loads.

---

## Question 102 — Motor Nameplate
A nameplate reads:

\[
400/690V\quad\Delta/Y
\]

What is the normal running connection on a 400 V supply, and why?

### Answer

Use:

\[
\boxed{\Delta}
\]

In delta:

\[
V_{winding}=V_L=400V
\]

At 690 V, star would give:

\[
\frac{690}{\sqrt3}\approx398V
\]

per winding.

The correct reasoning is based on **winding voltage**, not rote memorization.

---

## Question 103 — Synchronous, Stepper and Servo Motors
**Distinguish these three motor concepts briefly.**

### Answer

A **synchronous motor** runs locked to the rotating field at synchronous speed in normal operation.

A **stepper motor** moves through discrete angular steps in response to commanded electrical pulses.

A **servo system/motor** is used in a closed-loop motion-control system where feedback controls position, speed or torque accurately.

These terms describe different operating/control principles.

---

## Question 104 — Pre-Commissioning Motor Checks
**State eight checks/tests before commissioning a three-phase motor.**

### Answer

Possible checks:

1. nameplate voltage/frequency;
2. correct star/delta connection;
3. insulation resistance;
4. winding resistance/continuity;
5. earth/CPC continuity;
6. phase sequence;
7. overload setting;
8. protective-device rating;
9. contactor/interlock operation;
10. mechanical freedom;
11. terminal tightness;
12. control circuit operation.

Then perform controlled functional testing and verify direction of rotation.

---

# SECTION 10 — Power Factor and Recurrent C1 Calculation Themes

## Question 105 — Define Power Factor
**Define power factor and distinguish it from efficiency.**

### Answer

Power factor is:

\[
\boxed{PF=\frac{P}{S}}
\]

For a sinusoidal system:

\[
PF=\cos\phi
\]

It compares real power to apparent power.

Efficiency is:

\[
\boxed{\eta=\frac{P_{out}}{P_{in}}}
\]

They are not the same.

A motor can be efficient while still having a poor power factor.

---

## Question 106 — Causes and Demerits of Poor PF
**State four causes and five disadvantages of poor lagging power factor.**

### Answer

Causes include:

- induction motors;
- lightly loaded motors;
- transformers;
- discharge lighting;
- inductive equipment.

Disadvantages:

1. higher current for same real kW;
2. greater \(I^2R\) losses;
3. larger voltage drop;
4. larger cable requirement;
5. greater transformer/generator kVA loading;
6. reduced system capacity;
7. possible utility financial consequences where tariffs apply.

---

## Question 107 — Power Triangle
A load takes 45 kW at PF 0.72.

Calculate apparent and reactive power.

### Answer

Apparent power:

\[
S=\frac{P}{PF}
\]

\[
S=\frac{45}{0.72}
\]

\[
\boxed{S=62.5kVA}
\]

Reactive power:

\[
Q=P\tan(\cos^{-1}0.72)
\]

\[
\boxed{Q\approx43.37kvar}
\]

Check:

\[
S^2\approx P^2+Q^2
\]

---

## Question 108 — PF Correction
The 45 kW load in Question 107 is to be corrected from 0.72 to 0.95 PF.

Calculate capacitor kvar.

### Answer

Use:

\[
Q_c=P(\tan\phi_1-\tan\phi_2)
\]

where:

\[
\phi_1=\cos^{-1}(0.72)
\]

\[
\phi_2=\cos^{-1}(0.95)
\]

Initial reactive power:

\[
Q_1\approx43.37kvar
\]

Target reactive power:

\[
Q_2\approx14.79kvar
\]

Therefore:

\[
Q_c=43.37-14.79
\]

\[
\boxed{Q_c\approx28.58kvar}
\]

A practical capacitor-bank rating would be selected from standard available stages and actual system requirements.

---

## Question 109 — Current Before and After PF Correction
The 45 kW load is supplied at 415 V three-phase.

Calculate current at PF 0.72 and at PF 0.95.

### Answer

Use:

\[
I_L=\frac{P}{\sqrt3V_LPF}
\]

### Before

\[
I_1=
\frac{45000}
{1.732\times415\times0.72}
\]

\[
\boxed{I_1\approx87.0A}
\]

### After

\[
I_2=
\frac{45000}
{1.732\times415\times0.95}
\]

\[
\boxed{I_2\approx65.9A}
\]

Current reduction:

\[
87.0-65.9\approx21.1A
\]

### Meaning

The real load is still 45 kW.

PF correction reduces:

- reactive power;
- apparent power;
- line current.

---

## Question 110 — Final Integrated Oral Question
An EPRA examiner asks:

> **“You are given a three-phase motor circuit that is overheating and occasionally trips. Explain how you would investigate it from supply to motor.”**

Give a complete distinction-level answer.

### Answer

A strong answer should proceed systematically.

### 1. Safety first

- identify the motor/circuit;
- isolate safely before dead tests;
- control unexpected restart;
- inspect for obvious damage.

### 2. Gather design/nameplate information

Check:

- rated voltage;
- current;
- frequency;
- kW;
- PF;
- connection;
- duty;
- rated speed.

Compare these with the supply and starter.

### 3. Mechanical condition

Check:

- bearing condition;
- free movement;
- driven load;
- jamming;
- alignment;
- ventilation.

A mechanically overloaded motor can draw excessive current even when the electrical supply is correct.

### 4. Supply condition

Verify:

- all three phase voltages;
- phase balance;
- phase sequence where relevant;
- no phase loss;
- no severe undervoltage.

### 5. Current measurement

Measure each phase current.

Compare:

- phase-to-phase balance;
- measured current with nameplate current.

High balanced current may indicate overload.

Strongly unequal currents may indicate phase/supply/winding problems.

### 6. Starter and contactors

Inspect:

- burnt contacts;
- loose terminals;
- star-delta timing if used;
- interlocks;
- contactor pole failure.

A high-resistance contact can cause voltage imbalance and overheating.

### 7. Protection

Check:

- short-circuit protective device;
- overload setting;
- phase-failure protection;
- earth-fault protection;
- device coordination.

Do not simply increase the overload setting to stop tripping.

### 8. Motor winding condition

After safe isolation, carry out appropriate:

- winding resistance/continuity checks;
- insulation resistance;
- earth continuity.

Compare winding resistances for abnormal imbalance.

### 9. Connection

Confirm the motor is connected correctly according to its nameplate.

Example:

\[
400/690V\quad\Delta/Y
\]

on 400 V normal running:

\[
\boxed{\Delta}
\]

unless a specific starting arrangement requires otherwise.

### 10. Temperature and cooling

Check:

- fan;
- ventilation path;
- ambient temperature;
- blocked cooling fins;
- duty cycle.

### 11. Recommission carefully

After correcting defects:

- restore protection correctly;
- energize under controlled conditions;
- verify direction;
- measure current;
- observe acceleration;
- confirm stable running;
- record results.

### Examiner-level conclusion

Do not treat “motor tripping” as proof that the breaker is too small.

The trip may be correctly warning of:

- overload;
- phase failure;
- mechanical fault;
- winding problem;
- poor connection;
- incorrect motor connection.

A competent electrician finds the **cause** before changing protection.

---

# Rapid Recall — The 25 Things You Must Be Able to Say Without Notes

1. \(\boxed{V=IR}\)
2. \(\boxed{P=VI}\)
3. \(\boxed{E=Pt}\)
4. \(\boxed{I_B\leq I_N\leq I_Z}\)
5. Correction factors reduce effective cable capacity.
6. Voltage drop grows with current, length and conductor resistance.
7. RCD = residual-current imbalance protection.
8. RCBO = residual + overcurrent protection.
9. SPD = transient-overvoltage protection.
10. Selectivity = downstream device should operate first where coordination allows.
11. CPC completes the protective fault-current path.
12. Bonding reduces dangerous potential differences.
13. \(\boxed{Z_s=Z_e+(R_1+R_2)}\)
14. \(\boxed{I_f=U_0/Z_s}\)
15. High \(Z_s\) means lower fault current.
16. Safe isolation means identify, isolate, secure, prove dead, re-prove.
17. A ring can be broken and still make every socket appear to work.
18. Insulation resistance should be high; conductor continuity resistance should be low.
19. C2 = current published low-voltage single-phase scope up to two storeys, subject to exclusions.
20. C1 includes C2 and adds current published low-voltage three-phase scope up to four storeys, subject to exclusions.
21. Star: \(V_L=\sqrt3V_{ph}\), \(I_L=I_{ph}\).
22. Delta: \(V_L=V_{ph}\), \(I_L=\sqrt3I_{ph}\).
23. \(\boxed{P_{3\phi}=\sqrt3V_LI_LPF}\)
24. \(\boxed{N_s=120f/P}\)
25. Power-factor correction reduces current/kVA/reactive demand, not the real kW required by an unchanged load.

---

# Final Revision Strategy

If your exam is close, revise this bank in three passes.

## Pass 1 — Definitions and explanation
Be able to answer every non-calculation question aloud.

## Pass 2 — Calculations
Redo every numerical problem without viewing the working.

Focus especially on:

- Ohm's law;
- single-phase current;
- cable sizing;
- correction factors;
- voltage drop;
- \(Z_s\);
- fault current;
- diversity;
- three-phase current;
- synchronous speed/slip;
- motor current including efficiency;
- power factor;
- kvar correction.

## Pass 3 — Practical/oral reasoning
For every practical question ask:

1. What is the danger?
2. What should happen first?
3. What instrument/device is appropriate?
4. What reading/behaviour do I expect?
5. What would an abnormal result mean?
6. What should I do next?

That is the style of reasoning that turns memorized electrical facts into exam-ready competence.

---

# Source Discipline

This revision bank is deliberately built from several kinds of material:

- **EPRA current competency areas** determine the official C2/C1 assessment scope.
- **Accessible past EPRA/ERC papers** are used only to identify recurring themes and question styles.
- **The Learn Electrics transcripts** supply explanation techniques, testing logic, formula discipline and fault-finding teaching.
- **The uploaded BS 7671 / IET material** supplies wiring-regulation terminology and technical study context.
- **The uploaded On-Site Guide updated to BS 7671:2018+A4:2026** supplies current UK study guidance on protection, earthing/bonding, final circuits, initial verification, cable/current/voltage-drop topics and safe working.

Where Kenya-specific law or national requirements are asked, current Kenyan sources take priority over UK BS 7671 guidance.

---

**End of 110-Question High-Priority EPRA C2/C1 Revision Bank**
