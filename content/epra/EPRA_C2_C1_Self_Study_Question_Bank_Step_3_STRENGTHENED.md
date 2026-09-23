# EPRA C2 & C1 Self-Study Question Bank

## Step 3 — Earthing Systems, CPCs, Earth-Fault Paths, \(Z_e\), \(Z_s\), \(R_1+R_2\), Automatic Disconnection and the Adiabatic Equation — Strengthened Distinction Edition

> **Purpose of this step:**  
> Step 3 develops a complete understanding of protective earthing and earth-fault protection. The aim is not simply to remember definitions such as \(Z_e\), \(Z_s\) and \(R_1+R_2\), but to understand the actual fault-current path, why low loop impedance matters, how protective devices disconnect the supply, how protective conductors are sized, and how test results are interpreted.
>
> This is directly relevant to EPRA C2 because EPRA includes **earthing in domestic installations** and testing/commissioning. It also carries into C1, which includes earthing in domestic and small commercial installations and initial/periodic inspection and testing.

---

# Strengthened-Edition Answer Method

This strengthened Step 3 keeps the original question bank but upgrades the answer standard.

For calculations:

\[
\boxed{\text{GIVEN}\rightarrow\text{FORMULA}\rightarrow\text{SUBSTITUTION}\rightarrow\text{ANSWER}\rightarrow\text{CHECK}}
\]

For technical/oral explanations:

\[
\boxed{\text{Definition}\rightarrow\text{Meaning}\rightarrow\text{How it works}\rightarrow\text{Why it matters}\rightarrow\text{What happens if wrong}}
\]

## Definition Source Rule

- Where the uploaded BS 7671 Part 2 **formally defines** a term, that definition is used or closely preserved and is identified as the formal book definition.
- Where the book does **not** formally define a classroom concept, the answer is labelled as a foundational electrical explanation rather than a supposed BS 7671 quotation.
- The uploaded book is the **Seventeenth Edition incorporating Amendment 3:2015**. It is used for requested definition wording and terminology, not as authority for current 2026 numerical requirements.


# Important Regulatory Note

The BS 7671 references in this step are included because the study material uses BS 7671 extensively and because the tables provide excellent technical examples.

For EPRA preparation, remember:

> **The electrical principle is transferable, but a BS 7671 numerical requirement must not automatically be assumed to be a Kenyan statutory requirement.**

Where a numerical value is taken from BS 7671, the question identifies the relevant regulation/table and explains how the value is used.

The principal BS 7671 references used in this step include:

- **Chapter 41** — protection against electric shock;
- **Regulation group 411.3.2** — automatic disconnection in the event of a fault;
- **Table 41.1** — maximum disconnection times;
- **Table 41.3** — maximum earth-fault loop impedance for circuit-breakers to BS EN 60898 and overcurrent characteristics of RCBOs to BS EN 61009-1;
- **Table 41.5** — maximum earth-fault loop impedance where RCDs provide fault protection;
- **Regulation 411.4.4** — earth-fault loop requirement for TN systems;
- **Regulation 411.5.3** — TT-system condition involving earth-electrode resistance and RCD residual current;
- **Regulation 543.1.3** — protective-conductor sizing using the adiabatic equation;
- **Regulation 543.1.4 and Table 54.7** — protective-conductor sizing by tabulated relationship;
- **Table 43.1** — values of \(k\) for calculation of the effects of fault current;
- **Chapter 54** — earthing arrangements and protective conductors.

---

# Section A — Fundamental Earthing Terms

## Question 1 — What Is Earthing?
**Define protective earthing and explain its safety purpose. (4 marks)**

### Answer

### Formal BS 7671 definitions

The uploaded Part 2 defines **Earthing** as:

> **“Connection of the exposed-conductive-parts of an installation to the main earthing terminal of that installation.”**

It separately defines **Protective earthing** as:

> **“Earthing of a point or points in a system or in an installation or in equipment for the purposes of safety.”**

These definitions are more precise than the loose phrase “connect the metalwork to the ground.”

Its purpose is to provide a deliberate, low-impedance path for fault current if a live conductor accidentally contacts exposed metalwork.

The intended sequence is:

1. a line-to-earth fault occurs;
2. fault current flows through the protective path;
3. sufficient fault current operates the protective device;
4. the supply is disconnected within the required time;
5. the duration of dangerous touch voltage is limited.

Protective earthing therefore does **not** merely “send electricity into the ground.” Its principal purpose in an installation using automatic disconnection of supply is to create an effective fault-current path so that protective devices can disconnect dangerous faults.

---

## Question 2 — Define a Circuit Protective Conductor
**Define a circuit protective conductor (CPC) and state its function. (4 marks)**

### Answer

### Formal BS 7671 definition

The uploaded Part 2 defines a **Circuit protective conductor (cpc)** as:

> **“A protective conductor connecting exposed-conductive-parts of equipment to the main earthing terminal.”**

A CPC is therefore not simply “an earth wire.” It is a specifically protective conductor in the circuit fault path.

Its function is to provide electrical continuity between exposed-conductive-parts of equipment and the earthing arrangement of the installation.

During normal operation, the CPC should not carry normal load current.

During an earth fault, it provides part of the fault-current path.

The CPC may take forms such as:

- a separate copper conductor;
- the protective conductor included in a multicore cable;
- metallic conduit where permitted and suitably continuous;
- metallic trunking where suitable;
- armour of an armoured cable where correctly selected and terminated.

The CPC must have sufficient:

- continuity;
- conductivity;
- mechanical integrity;
- and thermal capacity

to perform its protective function.

---

## Question 3 — Exposed-Conductive-Part
**Define an exposed-conductive-part and give two examples. (4 marks)**

### Answer

### Formal BS 7671 definition

The uploaded Part 2 defines an **Exposed-conductive-part** as:

> **“Conductive part of equipment which can be touched and which is not normally live, but which can become live under fault conditions.”**

This is why exposed metalwork of Class I equipment requires an effective protective connection.

Examples include:

1. the metal enclosure of a Class I appliance;
2. a metal distribution-board enclosure;
3. a metal luminaire body;
4. the metal frame of fixed electrical equipment.

The reason such parts require protective measures is that an insulation fault could raise the metalwork to a dangerous potential.

---

## Question 4 — Extraneous-Conductive-Part
**Explain what is meant by an extraneous-conductive-part. (4 marks)**

### Answer

An extraneous-conductive-part is a conductive part that:

- is not part of the electrical installation;
- but is capable of introducing a potential, generally Earth potential, into the installation.

Possible examples include certain metallic:

- water-service pipes;
- gas-service pipes;
- structural metalwork.

A metal object should not automatically be called an extraneous-conductive-part simply because it is metal.

It must actually be capable of introducing a potential from outside the electrical installation.

This distinction is important when deciding whether protective equipotential bonding is required.

---

## Question 5 — Earthing Conductor vs CPC
**Differentiate between an earthing conductor and a circuit protective conductor. (4 marks)**

### Answer

A **circuit protective conductor (CPC)** is associated with a particular circuit and provides the protective connection from exposed-conductive-parts of that circuit toward the installation earthing system.

An **earthing conductor** connects the main earthing terminal of the installation to the means of earthing.

Therefore:

- CPC → associated with the final/distribution circuit;
- earthing conductor → connects the installation earthing terminal to the earthing means.

Both are protective conductors, but they serve different positions in the earthing arrangement.

---

## Question 6 — Main Earthing Terminal
**What is the main earthing terminal (MET), and why is it important? (4 marks)**

### Answer

The main earthing terminal is the principal terminal or bar provided for the connection of protective conductors in the installation.

Depending on the installation, connections may include:

- the earthing conductor;
- main protective bonding conductors;
- circuit protective conductors;
- other required protective conductors.

The MET provides a common point that helps maintain the protective earthing and bonding system at substantially the same reference potential during normal and fault conditions.

---

# Section B — Earthing-System Types

## Question 7 — Meaning of the Letters in TN-S, TN-C-S and TT
**Explain the meaning of the letters used in the designations TN-S, TN-C-S and TT. (6 marks)**

### Answer

The first letter describes the relationship of the supply system to Earth.

### T

“T” indicates that one point of the supply system is directly connected to Earth.

The second letter describes the relationship of the exposed-conductive-parts of the installation to Earth.

### N

“N” indicates that exposed-conductive-parts are connected to the earthed point of the supply system.

### T as the second letter

A second “T” indicates that exposed-conductive-parts are connected to a local earth electrode electrically independent of the supply-system earthing arrangement.

Additional letters describe the relationship between neutral and protective functions.

### S

“S” means neutral and protective functions are provided by **separate conductors**.

### C

“C” means neutral and protective functions are **combined in one conductor** for the relevant portion of the system.

Therefore:

- **TN-S** → supply neutral and protective functions are separate;
- **TN-C-S** → they are combined for part of the system and separate for another part;
- **TT** → installation exposed-conductive-parts are connected to a local earth electrode.

---

## Question 8 — TN-S System
**Describe a TN-S earthing system. (5 marks)**

### Answer

In a TN-S system:

- the supply neutral point is connected to Earth;
- the installation receives a protective earth connection from the supply system;
- the neutral conductor and protective conductor remain separate throughout the relevant supply arrangement.

During an earth fault:

1. current leaves the source on the line conductor;
2. passes through the fault to exposed metalwork;
3. returns through the CPC and supply protective path;
4. reaches the earthed neutral point of the source;
5. completes the fault loop.

Because the metallic return path can have relatively low impedance, sufficiently high fault current can normally be obtained to operate an overcurrent protective device when the circuit is correctly designed.

---

## Question 9 — TN-C-S System
**Describe a TN-C-S earthing system. (5 marks)**

### Answer

In a TN-C-S system:

- the source neutral point is earthed;
- neutral and protective functions are combined in a PEN conductor over part of the supply system;
- they are separated into neutral and protective conductors before or at the consumer installation.

“PEN” means:

\[
\boxed{\text{Protective Earth and Neutral}}
\]

The installation itself normally has separate:

- neutral conductors;
- protective conductors.

A major safety consideration in TN-C-S systems is the consequence of a broken or high-resistance PEN conductor, because connected protective metalwork may be affected by diverted neutral currents or dangerous potential rise.

---

## Question 10 — TT System
**Describe a TT earthing system. (5 marks)**

### Answer

In a TT system:

- the supply source has its own connection to Earth;
- the consumer installation has its own local earth electrode;
- exposed-conductive-parts are connected to that local electrode.

The earth-fault current path therefore includes the resistance of the local earth electrode and the general mass of Earth.

Because this path can have considerably greater impedance than a metallic TN fault-return path, an overcurrent device alone may not disconnect sufficiently quickly.

RCDs are therefore commonly used for fault protection in TT systems.

---

## Question 11 — Compare TN and TT Fault Paths
**Explain the main difference between the earth-fault current path in a TN system and a TT system. (6 marks)**

### Answer

### TN System

The fault return path is largely metallic.

A typical path is:

\[
\text{line}\rightarrow\text{fault}\rightarrow\text{CPC}\rightarrow\text{supply protective path}\rightarrow\text{source neutral point}
\]

A metallic path generally has relatively low impedance.

Therefore the earth-fault current may be high enough to operate a fuse or circuit-breaker rapidly.

### TT System

The path includes:

\[
\text{line}\rightarrow\text{fault}\rightarrow\text{CPC}\rightarrow\text{earth electrode}\rightarrow\text{general mass of Earth}\rightarrow\text{source electrode}
\]

The soil/electrode path generally has a higher resistance.

Consequently fault current may be too small to operate an overcurrent device quickly enough.

This is why RCD protection is particularly important in TT installations.

---

## Question 12 — Why a TT Earth Electrode Is Important
**Explain the function of the consumer’s earth electrode in a TT installation. (4 marks)**

### Answer

The earth electrode connects the installation protective-conductor system to the general mass of Earth.

During an earth fault, it forms part of the fault-current path.

Its resistance affects:

- the magnitude of fault current;
- the rise in potential of exposed metalwork;
- the operation of fault-protection devices;
- the effectiveness of the TT protective system.

The electrode resistance should therefore be as low and as stable as practicable.

---

# Section C — Earth-Fault Current and Automatic Disconnection

## Question 13 — Describe a Complete Earth-Fault Path
A line conductor touches the metal case of a Class I appliance on a TN system.

**Describe the fault-current path from the source and back to the source. (8 marks)**

### Answer

A strong answer should identify the complete loop.

The path is approximately:

1. source transformer line winding;
2. line conductor of the supply;
3. installation line conductor;
4. appliance line conductor;
5. line-to-metal fault;
6. exposed metal case;
7. appliance CPC;
8. circuit CPC;
9. installation earthing system;
10. supply protective conductor/path;
11. earthed neutral/star point of the source;
12. transformer winding.

The fault circuit is a **loop**.

Current does not simply flow “to Earth and disappear.”

It must return to the source for substantial current to continue flowing.

The impedance of the complete loop determines the magnitude of earth-fault current.

---

## Question 14 — Why Low Fault-Loop Impedance Is Desirable
**Explain why a low earth-fault loop impedance is generally desirable where an overcurrent protective device provides automatic disconnection. (5 marks)**

### Answer

Using Ohm’s law:

\[
I_f=\frac{U_0}{Z_s}
\]

where:

- \(I_f\) = earth-fault current;
- \(U_0\) = nominal voltage to Earth;
- \(Z_s\) = earth-fault loop impedance.

If:

\[
Z_s\downarrow
\]

then:

\[
I_f\uparrow
\]

A larger fault current causes an overcurrent protective device to operate more rapidly.

Faster disconnection reduces the duration for which exposed metalwork can remain at a dangerous touch voltage.

Therefore:

\[
\boxed{\text{Lower }Z_s\rightarrow\text{higher fault current}\rightarrow\text{faster operation}}
\]

within the design limits of the protective system.

---

## Question 15 — Automatic Disconnection of Supply
**Explain the principle of automatic disconnection of supply (ADS). (6 marks)**

### Answer

Automatic disconnection of supply is a protective measure used to limit the duration of dangerous touch voltage following a fault.

It depends on a combination of:

- basic protection;
- protective earthing;
- protective equipotential bonding where required;
- an effective earth-fault path;
- and a protective device that disconnects automatically.

When a fault causes an exposed-conductive-part to become live:

1. fault current flows through the protective path;
2. the protective device detects the fault through overcurrent or residual current;
3. the device disconnects the supply;
4. the fault voltage is removed within the required time.

### BS 7671 Reference

The requirements are principally within **Regulation group 411.3.2** and the system-specific requirements in Section 411.

---

## Question 16 — 230 V TN Final-Circuit Disconnection Time
A 230 V AC TN installation has a final circuit within the scope of BS 7671 Regulation 411.3.2.2.

What maximum disconnection time applies? **(3 marks)**

### Answer

From **BS 7671 Table 41.1**:

For:

- TN system;
- AC;
- \(120V<U_0\leq230V\);

the maximum disconnection time is:

\[
\boxed{0.4\text{ s}}
\]

### Table 41.1 Application

Regulation 411.3.2.2 applies this table to relevant final circuits, including:

- final circuits not exceeding 63 A where one or more socket-outlets are included;
- final circuits not exceeding 32 A supplying only fixed connected current-using equipment.

---

## Question 17 — 230 V TT Final-Circuit Disconnection Time
For the same voltage range but a TT system, what value appears in Table 41.1? **(3 marks)**

### Answer

From **BS 7671 Table 41.1**:

For:

- TT system;
- AC;
- \(120V<U_0\leq230V\);

the table value is:

\[
\boxed{0.2\text{ s}}
\]

Where the special Table 41.1 note concerning TT systems and overcurrent protection applies, TN-system times may be applicable, but that is a particular condition and should not be assumed automatically.

---

## Question 18 — TN Distribution-Circuit Disconnection Time
**What disconnection time is generally permitted by BS 7671 for a TN distribution circuit where the Table 41.1 final-circuit condition does not apply? (3 marks)**

### Answer

The permitted value is:

\[
\boxed{5\text{ s}}
\]

### BS 7671 Reference

See **Regulation 411.3.2.3** for TN-system circuits outside the Table 41.1 final-circuit requirement.

The important exam skill is to determine first whether the circuit is:

- a final circuit covered by Table 41.1;
- or another circuit to which the longer permitted time applies.

---

## Question 19 — Why Disconnection Time Matters
**Explain why the maximum disconnection time is a safety requirement rather than simply a protective-device performance figure. (5 marks)**

### Answer

During an earth fault, accessible metalwork may rise to a dangerous potential.

The danger to a person depends not only on voltage but also on the **duration of exposure**.

If the protective device disconnects quickly:

- the dangerous touch voltage exists for less time;
- the period during which current could flow through a person is reduced;
- the risk of severe electric shock is reduced.

Therefore disconnection time is fundamentally about **protection against electric shock**, not merely about whether a breaker is capable of opening.

---

# Section D — \(Z_e\), \(R_1+R_2\) and \(Z_s\)

## Question 20 — Define \(Z_e\)
**Define \(Z_e\). (4 marks)**

### Answer

\(Z_e\) is the **external earth-fault loop impedance**.

It represents the earth-fault loop impedance external to the consumer installation, measured or determined at the origin of the installation.

It includes the relevant impedance of the supply system, such as:

- the source/transformer;
- line conductor on the supply side;
- external protective return path.

It does **not** include the resistance of the final circuit line conductor and CPC within the installation.

---

## Question 21 — Define \(R_1+R_2\)
**Define \(R_1+R_2\). (4 marks)**

### Answer

\(R_1+R_2\) is the resistance of:

- the circuit line conductor \(R_1\);
- plus the circuit protective conductor \(R_2\);

for the relevant path from the origin of the circuit to the point being considered.

It is normally established as a **dead-test resistance** using a low-resistance ohmmeter/continuity tester.

For a radial circuit:

\[
\boxed{R_1+R_2}
\]

represents the line-and-CPC loop resistance to the test point.

It is measured in:

\[
\boxed{\Omega}
\]

---

## Question 22 — Define \(Z_s\)
**Define earth-fault loop impedance \(Z_s\). (4 marks)**

### Answer

\(Z_s\) is the **total earth-fault loop impedance at a particular point in an installation**.

It includes:

- the external loop impedance \(Z_e\);
- the resistance/impedance of the circuit line conductor;
- the resistance/impedance of the circuit protective conductor.

For a simple design calculation:

\[
\boxed{Z_s=Z_e+(R_1+R_2)}
\]

\(Z_s\) determines the prospective earth-fault current available at that point.

---

## Question 23 — Why \(Z_s\) Is Impedance but \(R_1+R_2\) Is Resistance
**Explain the difference between the terms impedance and resistance in this context. (5 marks)**

### Answer

\(R_1+R_2\) is normally obtained by a dead continuity test using a DC test current.

It is therefore treated as a **resistance**.

\(Z_s\) is the impedance of an AC fault-current loop.

AC impedance may contain:

- resistance;
- inductive reactance;
- other AC effects.

Therefore \(Z_s\) is correctly described as **impedance**.

Both are measured in ohms:

\[
\Omega
\]

In small low-voltage circuits, resistance often forms the dominant part of the loop, but it is still important to use the technically correct terms.

---

## Question 24 — Calculate \(Z_s\)
A circuit has:

\[
Z_e=0.35\Omega
\]

and:

\[
R_1+R_2=0.62\Omega
\]

Calculate \(Z_s\). **(3 marks)**

### Answer

Use:

\[
Z_s=Z_e+(R_1+R_2)
\]

Substitute:

\[
Z_s=0.35+0.62
\]

\[
\boxed{Z_s=0.97\Omega}
\]

---

## Question 25 — Calculate \(R_1+R_2\)
A circuit has:

\[
Z_s=1.08\Omega
\]

and:

\[
Z_e=0.28\Omega
\]

Calculate \(R_1+R_2\). **(4 marks)**

### Answer

Start with:

\[
Z_s=Z_e+(R_1+R_2)
\]

Rearrange:

\[
R_1+R_2=Z_s-Z_e
\]

Substitute:

\[
R_1+R_2=1.08-0.28
\]

\[
\boxed{R_1+R_2=0.80\Omega}
\]

---

## Question 26 — Calculate \(Z_e\)
A circuit has:

\[
Z_s=0.91\Omega
\]

and:

\[
R_1+R_2=0.56\Omega
\]

Calculate \(Z_e\). **(4 marks)**

### Answer

Use:

\[
Z_s=Z_e+(R_1+R_2)
\]

Rearrange:

\[
Z_e=Z_s-(R_1+R_2)
\]

Substitute:

\[
Z_e=0.91-0.56
\]

\[
\boxed{Z_e=0.35\Omega}
\]

---

## Question 27 — Why the Highest \(R_1+R_2\) Matters
**Why is the highest relevant \(R_1+R_2\) value on a radial circuit important? (5 marks)**

### Answer

The highest \(R_1+R_2\) value is normally found at the electrically furthest point or highest-resistance path.

Because:

\[
Z_s=Z_e+(R_1+R_2)
\]

the highest \(R_1+R_2\) normally produces the highest circuit \(Z_s\).

The highest \(Z_s\) generally produces the **lowest earth-fault current**.

Therefore the furthest/highest-resistance point is often the most demanding point for demonstrating that the protective device will still disconnect within the required time.

---

## Question 28 — Calculate Earth-Fault Current
A 230 V circuit has:

\[
Z_s=1.15\Omega
\]

Estimate the earth-fault current, ignoring other effects. **(4 marks)**

### Answer

Using Ohm’s law:

\[
I_f=\frac{U_0}{Z_s}
\]

Substitute:

\[
I_f=\frac{230}{1.15}
\]

\[
I_f=200A
\]

Therefore:

\[
\boxed{I_f\approx200A}
\]

This is the approximate current that would flow for a negligible-impedance line-to-earth fault under the assumptions made.

---

## Question 29 — Compare Two Circuits
Circuit A:

\[
Z_s=0.5\Omega
\]

Circuit B:

\[
Z_s=2.0\Omega
\]

Both are supplied at 230 V.

Calculate the approximate earth-fault current in each and explain the result. **(7 marks)**

### Answer

### Circuit A

\[
I_f=\frac{230}{0.5}
\]

\[
\boxed{I_f=460A}
\]

### Circuit B

\[
I_f=\frac{230}{2.0}
\]

\[
\boxed{I_f=115A}
\]

Circuit A has one-quarter the impedance of Circuit B and therefore four times the fault current.

This demonstrates:

\[
\boxed{I_f\propto\frac{1}{Z_s}}
\]

Lower loop impedance produces greater fault current.

---

# Section E — Maximum \(Z_s\) and Protective Devices

## Question 30 — Purpose of a Maximum \(Z_s\) Value
**Explain what a maximum permitted \(Z_s\) value is intended to ensure. (5 marks)**

### Answer

A maximum \(Z_s\) value limits how much total earth-fault loop impedance a circuit may have if a particular protective device is being relied upon to disconnect within the required time.

If actual \(Z_s\) becomes too high:

- earth-fault current becomes too low;
- the fuse or circuit-breaker may operate too slowly;
- dangerous touch voltage may persist for too long.

Therefore the maximum \(Z_s\) is linked to:

- supply voltage;
- required disconnection time;
- protective-device type;
- protective-device current rating;
- operating characteristic of the protective device.

---

## Question 31 — Type B 32 A Circuit-Breaker Maximum \(Z_s\)
A 230 V TN final circuit is protected by a **32 A Type B BS EN 60898 circuit-breaker**.

Using BS 7671 Table 41.3, state the maximum tabulated \(Z_s\). **(3 marks)**

### Answer

From:

**BS 7671 Table 41.3**

for:

- BS EN 60898 circuit-breaker;
- Type B;
- 32 A;

the maximum tabulated earth-fault loop impedance is:

\[
\boxed{1.37\Omega}
\]

This is a **tabulated BS 7671 design value**.

It is not the same thing as the commonly used maximum value for a field measurement at ordinary conductor temperature.

---

## Question 32 — What Is \(C_{\min}\)?
**Explain the purpose of the factor \(C_{\min}\) in earth-fault loop calculations. (4 marks)**

### Answer

\(C_{\min}\) is a minimum-voltage factor used to account for variation in supply voltage and related system conditions.

For the UK low-voltage supply conditions referenced in BS 7671 Appendix 3:

\[
\boxed{C_{\min}=0.95}
\]

The purpose is to avoid assuming that the full nominal voltage will always be available to drive the fault current.

A lower fault-driving voltage produces lower fault current, so incorporating \(C_{\min}\) is conservative for protective-device operation.

---

## Question 33 — TN-System \(Z_s\) Condition
**State the basic BS 7671 TN-system relationship between earth-fault loop impedance and protective-device operating current. (4 marks)**

### Answer

The relationship is:

\[
\boxed{Z_s\times I_a\leq U_0\times C_{\min}}
\]

where:

- \(Z_s\) = earth-fault loop impedance;
- \(I_a\) = current causing the protective device to operate within the required time;
- \(U_0\) = nominal AC RMS voltage to Earth;
- \(C_{\min}\) = minimum-voltage factor.

Rearranging:

\[
\boxed{Z_s\leq\frac{U_0C_{\min}}{I_a}}
\]

### BS 7671 Reference

**Regulation 411.4.4** and supporting information in **Appendix 3**.

---

## Question 34 — Tabulated vs Measured \(Z_s\)
**Explain why the maximum \(Z_s\) value used when assessing a measured circuit may be lower than the Table 41.3 design value. (6 marks)**

### Answer

Conductor resistance increases as conductor temperature rises.

A circuit tested under ordinary ambient conditions is usually cooler than it may be under full-load operating conditions.

If the measured value were compared directly with the maximum hot-design value without adjustment, a circuit might appear acceptable when its impedance could rise too high when the conductors become hotter.

BS 7671 Appendix 3 provides a simplified method that applies a factor of:

\[
0.8
\]

to the Table 41.2–41.4 value for this purpose.

Therefore:

\[
Z_{s,\text{measured max}}\approx0.8Z_{41}
\]

This is the origin of the commonly taught “80% rule.”

It is a **temperature allowance**, not a random safety margin.

---

## Question 35 — Apply the 80% Method
A 32 A Type B circuit-breaker has a Table 41.3 maximum \(Z_s\) of:

\[
1.37\Omega
\]

Calculate the simplified maximum value used for comparison with a field measurement using the 80% method. **(4 marks)**

### Answer

Use:

\[
Z_{s,\text{measured max}}=1.37\times0.8
\]

\[
Z_{s,\text{measured max}}=1.096\Omega
\]

Therefore:

\[
\boxed{Z_{s,\text{measured max}}\approx1.10\Omega}
\]

This approximately 1.10 Ω value is not a different protective-device characteristic.

It is the Table 41.3 value adjusted for the temperature conditions associated with field measurement.

---

## Question 36 — Interpret a Measured \(Z_s\)
A 32 A Type B circuit has:

\[
Z_{s,\text{measured}}=1.25\Omega
\]

The Table 41.3 value is 1.37 Ω.

Using the simplified 80% comparison, determine whether the result should be accepted. **(5 marks)**

### Answer

First calculate the simplified measured limit:

\[
1.37\times0.8=1.096\Omega
\]

Approximately:

\[
1.10\Omega
\]

Measured:

\[
1.25\Omega
\]

Compare:

\[
1.25>1.096
\]

Therefore:

\[
\boxed{\text{The result should not be accepted using this simplified comparison.}}
\]

Although 1.25 Ω is below the raw Table 41.3 value of 1.37 Ω, it exceeds the temperature-adjusted value used for comparison with an ordinary field measurement.

---

## Question 37 — Why Manufacturer Data May Be Better
**Why may manufacturer-specific protective-device data be preferable to relying only on generic Table 41.3 values? (4 marks)**

### Answer

Protective devices from different manufacturers can have operating characteristics that differ within the limits permitted by their product standard.

Manufacturer-specific data can therefore provide:

- actual time/current characteristics;
- actual maximum \(Z_s\) values;
- more precise operating information.

BS 7671 Appendix 3 advises that manufacturer-specific information should be used wherever possible.

Generic table values remain useful, especially for study and general design, but they are not necessarily the most precise available data for a specific device.

---

# Section F — TT Systems and RCD Fault Protection

## Question 38 — TT-System RCD Relationship
**State the BS 7671 relationship involving electrode resistance and residual operating current for TT systems where the RCD provides fault protection. (4 marks)**

### Answer

The requirement is:

\[
\boxed{R_A\times I_{\Delta n}\leq50V}
\]

where:

- \(R_A\) = sum of the resistance of the earth electrode and protective conductor connecting it to the exposed-conductive-parts, as applicable to the arrangement;
- \(I_{\Delta n}\) = rated residual operating current of the RCD.

### BS 7671 Reference

**Regulation 411.5.3**

The 50 V figure represents the conventional touch-voltage criterion used in this requirement.

---

## Question 39 — Calculate Maximum \(R_A\) for a 30 mA RCD
A TT installation uses a 30 mA RCD for fault protection.

Using:

\[
R_A I_{\Delta n}\leq50V
\]

calculate the theoretical maximum \(R_A\). **(5 marks)**

### Answer

Convert:

\[
30mA=0.03A
\]

Rearrange:

\[
R_A\leq\frac{50}{I_{\Delta n}}
\]

Substitute:

\[
R_A\leq\frac{50}{0.03}
\]

\[
R_A\leq1666.67\Omega
\]

Therefore:

\[
\boxed{R_A\leq1667\Omega\text{ approximately}}
\]

### Important Practical Note

This theoretical value should **not** be interpreted as a desirable electrode resistance.

BS 7671 guidance notes that the earth-electrode resistance should be as low as practicable, and values above about 200 Ω may be unstable and require investigation.

---

## Question 40 — Table 41.5
**State the maximum \(Z_s\) values shown in BS 7671 Table 41.5 for RCDs rated at:**

**(a)** 30 mA  
**(b)** 100 mA  
**(c)** 300 mA  
**(d)** 500 mA  

**(4 marks)**

### Answer

From **BS 7671 Table 41.5**:

| Rated residual current | Maximum \(Z_s\) |
|---:|---:|
| 30 mA | \(\boxed{1667\Omega}\) |
| 100 mA | \(\boxed{500\Omega}\) |
| 300 mA | \(\boxed{167\Omega}\) |
| 500 mA | \(\boxed{100\Omega}\) |

These values follow from the touch-voltage relationship associated with the RCD fault-protection requirement.

Again, very high theoretical values do not mean that an earth electrode should deliberately be installed with very high resistance.

---

## Question 41 — Why RCDs Are Effective in TT Systems
**Explain why an RCD can provide effective fault protection in a TT system where an MCB may not operate rapidly. (6 marks)**

### Answer

In a TT system, the fault path includes the consumer earth electrode and the mass of Earth.

This can make the earth-fault loop impedance relatively high.

High loop impedance means:

\[
I_f=\frac{U_0}{Z_s}
\]

may produce only a modest fault current.

That current may be too low to make an MCB or fuse operate within the required time.

An RCD does not need hundreds of amperes of earth-fault current.

It monitors the **imbalance** between current leaving and returning through the live conductors.

A residual current such as:

\[
30mA
\]

can therefore cause operation even where the earth-fault current is far below the instantaneous operating current of an MCB.

---

# Section G — CPC Continuity and \(R_1+R_2\) Testing

## Question 42 — Purpose of CPC Continuity Testing
**State the purpose of a CPC continuity test. (4 marks)**

### Answer

The purpose is to verify that the circuit protective conductor:

- is present where required;
- is electrically continuous;
- reaches the relevant points and accessories;
- provides a reliable protective path.

The test helps demonstrate that exposed-conductive-parts can be connected effectively to the installation earthing arrangement.

A circuit should not be assumed safe simply because a green-and-yellow conductor is visible.

Electrical continuity must be verified.

---

## Question 43 — Basic \(R_1+R_2\) Test on a Radial Circuit
**Describe how an \(R_1+R_2\) continuity test is carried out on a safely isolated radial circuit. (8 marks)**

### Answer

A suitable procedure is:

1. safely isolate the circuit;
2. prove the circuit dead;
3. ensure the test is carried out as a dead test;
4. identify the line conductor and CPC;
5. temporarily link the line conductor and CPC together at the origin of the circuit;
6. use a low-resistance continuity tester between line and CPC at each relevant point;
7. verify continuity throughout the circuit;
8. record the highest relevant reading;
9. remove the temporary link after testing;
10. restore all conductors correctly.

The measured loop is:

\[
\text{line conductor out}\rightarrow\text{link}\rightarrow\text{CPC return}
\]

Hence the result is:

\[
\boxed{R_1+R_2}
\]

---

## Question 44 — Why Link Line and CPC?
**Explain why the line conductor and CPC are linked at the origin during an \(R_1+R_2\) test. (4 marks)**

### Answer

The link creates a complete test loop.

The test current flows:

1. from the instrument through one conductor;
2. through the link at the origin;
3. back through the other conductor;
4. to the test instrument.

The measured value therefore includes the resistance of:

- line conductor \(R_1\);
- CPC \(R_2\).

Thus:

\[
\boxed{R_1+R_2}
\]

is obtained.

---

## Question 45 — Expected Highest Reading
**Why is the largest \(R_1+R_2\) result normally expected at the furthest point of a simple radial circuit? (4 marks)**

### Answer

Conductor resistance increases with conductor length.

The furthest point has the longest combined line-and-CPC path.

Therefore:

\[
R=\rho\frac{L}{A}
\]

means the greatest \(L\) normally produces the greatest resistance.

The furthest point therefore usually produces the highest:

\[
R_1+R_2
\]

and consequently the highest calculated circuit \(Z_s\).

Unexpected patterns should be investigated rather than assumed to be correct.

---

## Question 46 — Calculate Expected \(R_1+R_2\)
A radial circuit uses conductors whose combined line-and-CPC resistance is:

\[
30.2m\Omega/m
\]

The distance to the furthest point is:

\[
20m
\]

Calculate the expected \(R_1+R_2\) at that point. **(5 marks)**

### Answer

Multiply:

\[
30.2m\Omega/m\times20m=604m\Omega
\]

Convert milliohms to ohms:

\[
604m\Omega=\frac{604}{1000}\Omega
\]

\[
\boxed{R_1+R_2=0.604\Omega}
\]

Approximately:

\[
\boxed{0.60\Omega}
\]

The 30.2 mΩ/m value in this question is supplied data.

When such a value is obtained from a guidance table, the cable material, conductor sizes and temperature basis must match the table.

---

## Question 47 — Use \(R_1+R_2\) to Predict \(Z_s\)
For Question 46:

\[
R_1+R_2=0.604\Omega
\]

and:

\[
Z_e=0.31\Omega
\]

Calculate the predicted \(Z_s\). **(4 marks)**

### Answer

Use:

\[
Z_s=Z_e+(R_1+R_2)
\]

\[
Z_s=0.31+0.604
\]

\[
\boxed{Z_s=0.914\Omega}
\]

Approximately:

\[
\boxed{Z_s=0.91\Omega}
\]

This calculation allows the likely loop impedance to be assessed before or instead of unnecessary live testing where the verification method permits.

---

## Question 48 — Why Parallel Paths Can Affect a Live \(Z_s\) Test
**Explain how parallel earth paths can cause a measured live \(Z_s\) value to be lower than a value calculated from \(Z_e+(R_1+R_2)\). (5 marks)**

### Answer

A live loop-impedance test can include additional conductive paths in parallel with the intended CPC path.

Possible parallel paths include:

- protective bonding;
- metallic services;
- structural steel;
- cable armour;
- other interconnected protective conductors.

Parallel paths reduce total impedance.

Therefore the instrument may measure a value lower than the impedance of the intended circuit protective path alone.

A dead-test \(R_1+R_2\) value is useful because it helps verify the actual circuit conductor continuity without relying on accidental parallel paths.

---

# Section H — Missing CPC and Protective-Conductor Faults

## Question 49 — Metal Luminaire on a Circuit with No CPC
An old lighting circuit has no CPC.

A customer wants a metal Class I luminaire installed.

**Explain the problem. (6 marks)**

### Answer

A Class I metal luminaire depends on protective earthing.

If a line conductor faults onto the metal enclosure, the CPC is intended to carry sufficient fault current back toward the source so that the protective device disconnects.

Without an effective CPC:

- the metal enclosure may become live;
- little or no earth-fault current may flow through the intended protective path;
- the protective device may not disconnect;
- the dangerous touch voltage may remain present;
- touching the luminaire could expose a person to electric shock.

Therefore a Class I item must not simply be connected to a circuit that lacks the protective conductor required for its safety.

---

## Question 50 — Why “It Has Worked for Years” Is Not Proof of Safety
**Explain why the statement “the circuit has worked for years without an earth, so it must be safe” is incorrect. (5 marks)**

### Answer

Normal operation does not prove that a protective system will work during a fault.

A circuit can operate normally for years without a CPC because the CPC normally carries no load current.

Its importance becomes apparent only when a fault occurs.

The correct question is not:

> “Does the appliance work?”

It is:

> “Will the protective system make the installation safe if insulation fails?”

Safety therefore has to be established through:

- correct design;
- inspection;
- testing;
- verification of protective conductors;
- verification of protective-device operation.

---

## Question 51 — Class II Equipment
**Explain why suitably constructed Class II equipment does not rely on a CPC in the same way as Class I equipment. (4 marks)**

### Answer

Class II equipment uses double or reinforced insulation as its protective measure.

Its accessible parts are designed so that protection against electric shock does not depend on connection of exposed metalwork to a protective conductor.

Therefore it does not rely on a CPC in the same way as Class I equipment.

However, this does **not** mean that a missing CPC in the fixed wiring can simply be ignored.

The wiring installation itself must still comply with the applicable requirements and must be assessed for present and future use.

---

# Section I — Protective-Conductor Sizing

## Question 52 — Two Main CPC-Sizing Methods
**State the two principal BS 7671 methods for determining the minimum cross-sectional area of a protective conductor. (4 marks)**

### Answer

The two principal methods are:

### 1. Calculation

Use the **adiabatic equation** in accordance with:

\[
\boxed{\text{Regulation 543.1.3}}
\]

### 2. Tabulated Selection

Select the conductor using:

\[
\boxed{\text{Regulation 543.1.4 and Table 54.7}}
\]

The tabulated method is simpler but may result in a larger protective conductor than a detailed adiabatic calculation.

---

## Question 53 — Table 54.7: Same-Material Conductors
Where the protective conductor is the **same material** as the associated line conductor, state the Table 54.7 relationships. **(6 marks)**

### Answer

From **BS 7671 Table 54.7**:

### If:

\[
S\leq16\text{ mm}^2
\]

then:

\[
\boxed{S_p=S}
\]

### If:

\[
16<S\leq35\text{ mm}^2
\]

then:

\[
\boxed{S_p=16\text{ mm}^2}
\]

### If:

\[
S>35\text{ mm}^2
\]

then:

\[
\boxed{S_p=\frac{S}{2}}
\]

where:

- \(S\) = line-conductor cross-sectional area;
- \(S_p\) = minimum protective-conductor cross-sectional area under the table.

These relationships apply only when the conditions of Table 54.7 are satisfied.

---

## Question 54 — Table 54.7 Example 1
A copper line conductor has a cross-sectional area of:

\[
10\text{ mm}^2
\]

The protective conductor is of the same material.

Using Table 54.7, determine the protective-conductor size. **(3 marks)**

### Answer

Because:

\[
S\leq16\text{ mm}^2
\]

Table 54.7 gives:

\[
S_p=S
\]

Therefore:

\[
\boxed{S_p=10\text{ mm}^2}
\]

---

## Question 55 — Table 54.7 Example 2
The associated copper line conductor is:

\[
25\text{ mm}^2
\]

The protective conductor is the same material.

Determine the Table 54.7 size. **(3 marks)**

### Answer

Because:

\[
16<S\leq35
\]

the protective conductor is:

\[
\boxed{16\text{ mm}^2}
\]

---

## Question 56 — Table 54.7 Example 3
The associated copper line conductor is:

\[
70\text{ mm}^2
\]

The protective conductor is of the same material.

Determine the Table 54.7 size. **(3 marks)**

### Answer

Because:

\[
S>35\text{ mm}^2
\]

use:

\[
S_p=\frac{S}{2}
\]

\[
S_p=\frac{70}{2}
\]

\[
\boxed{S_p=35\text{ mm}^2}
\]

---

# Section J — The Adiabatic Equation

## Question 57 — State the Adiabatic Equation
**State the adiabatic equation used to calculate the minimum cross-sectional area of a protective conductor. Define every symbol. (7 marks)**

### Answer

The equation is:

\[
\boxed{S=\frac{\sqrt{I^2t}}{k}}
\]

which may also be written:

\[
\boxed{S=\frac{I\sqrt{t}}{k}}
\]

where:

- \(S\) = minimum cross-sectional area of the protective conductor in mm²;
- \(I\) = fault current in amperes;
- \(t\) = operating time of the protective device in seconds;
- \(k\) = factor taking account of conductor material, resistivity, temperature coefficient, heat capacity, and initial/final temperatures.

### BS 7671 Reference

**Regulation 543.1.3**

The equation is based on an adiabatic assumption that, during the short fault period considered, the heat generated by the fault is treated as remaining in the conductor rather than being dissipated to the surroundings.

---

## Question 58 — What Does “Adiabatic” Mean Here?
**Explain the physical idea behind the adiabatic calculation. (6 marks)**

### Answer

A large earth-fault current can generate substantial heat in a protective conductor.

The adiabatic method assumes that during the short fault period:

\[
\boxed{\text{no significant heat escapes from the conductor}}
\]

This is a conservative assumption.

The generated heat is treated as remaining in the conductor.

The calculation then checks whether the protective conductor has enough thermal capacity to carry the fault current until the protective device disconnects.

The key relationships are:

- larger fault current → more heating;
- longer disconnection time → more heating;
- larger conductor CSA → greater thermal capacity;
- higher suitable \(k\) value → greater permissible fault-energy withstand for the stated conductor system.

---

## Question 59 — Meaning of \(I\) in the Adiabatic Equation
**What exactly does \(I\) represent in the adiabatic equation? (3 marks)**

### Answer

\(I\) represents the:

\[
\boxed{\text{fault current}}
\]

in amperes.

It is **not simply the normal load current** of the circuit.

The conductor is being checked for its ability to survive the high current that can flow during a fault until the protective device disconnects.

---

## Question 60 — Meaning of \(t\)
**What does \(t\) represent in the adiabatic equation? (3 marks)**

### Answer

\(t\) is the:

\[
\boxed{\text{operating/disconnection time of the protective device}}
\]

in seconds, corresponding to the fault current under consideration.

A longer disconnection time allows fault current to heat the conductor for longer and therefore increases the required thermal capacity.

---

## Question 61 — Meaning of \(k\)
**Explain what the \(k\) factor represents. (5 marks)**

### Answer

The \(k\) factor represents the thermal/electrical characteristics of the conductor system.

It takes account of factors including:

- conductor material;
- electrical resistivity;
- temperature coefficient;
- heat capacity;
- initial conductor temperature;
- permitted final temperature;
- insulation/material system.

Different conductor and insulation combinations therefore have different \(k\) values.

The correct \(k\) must be selected for the actual conductor construction and thermal conditions.

---

## Question 62 — Table 43.1 \(k\) Values
For common copper conductors, state the Table 43.1 \(k\) values used in the following examples:

**(a)** 70 °C thermoplastic insulation, conductor not exceeding 300 mm²;  
**(b)** 90 °C thermosetting insulation.

**(4 marks)**

### Answer

From **BS 7671 Table 43.1**:

### (a) Copper, 70 °C thermoplastic

\[
\boxed{k=115}
\]

for the stated conductor-size range.

### (b) Copper, 90 °C thermosetting

\[
\boxed{k=143}
\]

The correct column must always match the conductor material, insulation system and relevant initial/final temperature assumptions.

---

# Step 3 Distinction Lens — Adiabatic Calculations

Use the adiabatic equation as a **thermal-survival test**:

\[
S=\frac{\sqrt{I^2t}}{k}
\]

Interpretation:

- \(I^2t\) represents fault energy stress;
- larger fault current increases heating strongly because current is squared;
- longer clearing time increases heating;
- \(k\) represents conductor/insulation/material thermal capability;
- the calculated \(S\) is a minimum theoretical CSA;
- the selected standard conductor size must not be below that minimum.

A complete answer should identify where the \(k\) value comes from when it is taken from a BS 7671 table.

---

## Question 63 — Adiabatic Calculation: Minimum CSA
A copper protective conductor with 70 °C thermoplastic insulation must carry:

\[
I=400A
\]

for:

\[
t=0.4s
\]

Use:

\[
k=115
\]

Calculate the minimum CSA. **(6 marks)**

### Answer

Use:

\[
S=\frac{\sqrt{I^2t}}{k}
\]

Substitute:

\[
S=\frac{\sqrt{400^2\times0.4}}{115}
\]

First:

\[
400^2=160000
\]

Then:

\[
160000\times0.4=64000
\]

Square root:

\[
\sqrt{64000}=252.98
\]

Then:

\[
S=\frac{252.98}{115}
\]

\[
S=2.20\text{ mm}^2
\]

Therefore the calculated minimum is:

\[
\boxed{2.20\text{ mm}^2}
\]

A standard conductor selected must be **not less than** the calculated requirement.

If the available standard sizes are:

- 1.5 mm²;
- 2.5 mm²;
- 4 mm²;

the suitable selection is:

\[
\boxed{2.5\text{ mm}^2}
\]

---

## Question 64 — Never Round Down
An adiabatic calculation gives:

\[
S=4.12\text{ mm}^2
\]

Available standard conductor sizes are:

- 4 mm²;
- 6 mm²;
- 10 mm².

Which size should be selected, and why? **(4 marks)**

### Answer

The calculated value is:

\[
4.12\text{ mm}^2
\]

A 4 mm² conductor is smaller than the calculated minimum:

\[
4<4.12
\]

Therefore it is not sufficient.

The next standard size is:

\[
\boxed{6\text{ mm}^2}
\]

A calculated minimum must not be rounded down to a smaller protective conductor.

---

## Question 65 — Adiabatic Calculation with 750 A
A 70 °C thermoplastic copper protective conductor has:

\[
k=115
\]

Fault current:

\[
I=750A
\]

Disconnection time:

\[
t=0.4s
\]

Calculate the minimum CSA and select the next standard size from:

- 2.5 mm²;
- 4 mm²;
- 6 mm²;
- 10 mm².

**(7 marks)**

### Answer

Use:

\[
S=\frac{\sqrt{I^2t}}{k}
\]

\[
S=\frac{\sqrt{750^2\times0.4}}{115}
\]

First:

\[
750^2=562500
\]

\[
562500\times0.4=225000
\]

\[
\sqrt{225000}=474.34
\]

Therefore:

\[
S=\frac{474.34}{115}
\]

\[
S=4.12\text{ mm}^2
\]

Calculated minimum:

\[
\boxed{4.12\text{ mm}^2}
\]

The next standard size not less than this is:

\[
\boxed{6\text{ mm}^2}
\]

---

## Question 66 — Calculate Maximum Fault Duration
Rearrange the adiabatic relationship to calculate the maximum time:

\[
\boxed{t=\frac{k^2S^2}{I^2}}
\]

A 4 mm² copper protective conductor has:

\[
k=115
\]

and carries a fault current of:

\[
650A
\]

Calculate the time required to reach the limiting thermal condition represented by the equation. **(7 marks)**

### Answer

Use:

\[
t=\frac{k^2S^2}{I^2}
\]

Substitute:

\[
t=\frac{115^2\times4^2}{650^2}
\]

Calculate the numerator:

\[
115^2=13225
\]

\[
4^2=16
\]

\[
13225\times16=211600
\]

Calculate the denominator:

\[
650^2=422500
\]

Then:

\[
t=\frac{211600}{422500}
\]

\[
t=0.5008s
\]

Therefore:

\[
\boxed{t\approx0.50s}
\]

If the protective device disconnects in less than this time under the stated fault-current conditions, the conductor remains within the thermal criterion represented by the calculation.

---

## Question 67 — Thermosetting Conductor Example
A 6 mm² copper protective conductor with a thermosetting insulation system uses:

\[
k=143
\]

The fault current is:

\[
800A
\]

Calculate the thermal time using:

\[
t=\frac{k^2S^2}{I^2}
\]

**(6 marks)**

### Answer

\[
t=\frac{143^2\times6^2}{800^2}
\]

Calculate:

\[
143^2=20449
\]

\[
6^2=36
\]

\[
20449\times36=736164
\]

Denominator:

\[
800^2=640000
\]

Therefore:

\[
t=\frac{736164}{640000}
\]

\[
t=1.1503s
\]

Approximately:

\[
\boxed{t=1.15s}
\]

---

## Question 68 — Effect of Fault Current on Required CPC Size
**If all other quantities remain unchanged, what happens to the required CPC size when fault current increases? Explain using the adiabatic equation. (4 marks)**

### Answer

From:

\[
S=\frac{I\sqrt{t}}{k}
\]

if:

- \(t\) remains constant;
- \(k\) remains constant;

then:

\[
S\propto I
\]

Therefore increasing fault current increases the required conductor cross-sectional area.

For example, doubling \(I\) doubles the calculated \(S\), provided the other quantities remain unchanged.

---

## Question 69 — Effect of Disconnection Time
**What happens to the calculated CPC size if the protective-device disconnection time increases from 0.25 s to 1.0 s while \(I\) and \(k\) remain constant? (5 marks)**

### Answer

From:

\[
S=\frac{I\sqrt{t}}{k}
\]

Initial time:

\[
\sqrt{0.25}=0.5
\]

New time:

\[
\sqrt{1}=1
\]

The square-root term has doubled:

\[
0.5\rightarrow1
\]

Therefore the calculated conductor size also doubles.

\[
\boxed{\text{Increasing fault duration increases the required CPC size.}}
\]

This is because the conductor must absorb fault energy for a longer time.

---

# Section K — Integrated Earthing and Protection Scenarios

## Question 70 — Complete TN Fault-Loop Problem
A 230 V TN final circuit has:

\[
Z_e=0.30\Omega
\]

and:

\[
R_1+R_2=0.72\Omega
\]

It is protected by a 32 A Type B BS EN 60898 circuit-breaker.

Determine:

**(a)** \(Z_s\);  
**(b)** approximate fault current;  
**(c)** Table 41.3 maximum \(Z_s\);  
**(d)** simplified 80% measured-value limit;  
**(e)** whether a measured \(Z_s\) of 0.99 Ω would satisfy the simplified comparison.

**(12 marks)**

### Answer

### (a) Calculate \(Z_s\)

\[
Z_s=Z_e+(R_1+R_2)
\]

\[
Z_s=0.30+0.72
\]

\[
\boxed{Z_s=1.02\Omega}
\]

---

### (b) Approximate earth-fault current

\[
I_f=\frac{230}{1.02}
\]

\[
I_f=225.49A
\]

Approximately:

\[
\boxed{I_f=225A}
\]

---

### (c) Table 41.3 maximum

For:

- Type B;
- 32 A;
- BS EN 60898;

Table 41.3 gives:

\[
\boxed{1.37\Omega}
\]

---

### (d) 80% measured comparison

\[
1.37\times0.8=1.096\Omega
\]

\[
\boxed{\approx1.10\Omega}
\]

---

### (e) Compare measured result

Measured:

\[
0.99\Omega
\]

Limit:

\[
1.096\Omega
\]

Since:

\[
0.99<1.096
\]

the measured value is:

\[
\boxed{\text{within the simplified temperature-adjusted maximum}}
\]

provided the rest of the circuit and protective arrangement also satisfy the applicable requirements.

---

## Question 71 — High \(Z_s\) Fault Scenario
A Type B 32 A final circuit has a measured:

\[
Z_s=1.45\Omega
\]

Explain why simply saying “the breaker is 32 A, so it is safe” is technically unacceptable. **(7 marks)**

### Answer

Protective-device rating alone does not prove fault protection.

The protective device must receive enough fault current to operate within the required disconnection time.

For a Type B 32 A BS EN 60898 circuit-breaker:

\[
Z_{s,\text{Table 41.3}}=1.37\Omega
\]

The measured value:

\[
1.45\Omega
\]

already exceeds the raw table value.

It also exceeds the simplified temperature-adjusted field value:

\[
1.37\times0.8=1.096\Omega
\]

Higher \(Z_s\) means lower fault current.

Therefore the fault current may not cause the required protective-device operation within the required time.

The circuit requires investigation and corrective action.

---

## Question 72 — Broken CPC Scenario
A socket circuit is operating normally, but continuity testing reveals that the CPC is broken before the final two socket outlets.

**Explain the danger. (7 marks)**

### Answer

Normal load current flows through:

- line;
- neutral.

Therefore the sockets may appear to work normally even with a broken CPC.

However, the final two sockets have lost their intended earth-fault return path.

If a line conductor faults onto exposed metalwork:

- the fault current may be severely reduced;
- the protective device may not disconnect;
- exposed metalwork may remain live;
- a person touching the equipment may become part of the fault-current path.

This demonstrates why:

\[
\boxed{\text{Normal operation does not prove protective-conductor continuity.}}
\]

CPC continuity must be verified by inspection and testing.

---

## Question 73 — TT Electrode and RCD Problem
A TT installation has an electrode resistance:

\[
R_A=120\Omega
\]

and a 100 mA RCD.

Check the touch-voltage relationship:

\[
R_AI_{\Delta n}\leq50V
\]

**(5 marks)**

### Answer

Convert:

\[
100mA=0.1A
\]

Calculate:

\[
R_AI_{\Delta n}=120\times0.1
\]

\[
=12V
\]

Compare:

\[
12V<50V
\]

Therefore:

\[
\boxed{\text{The stated relationship is satisfied.}}
\]

This does not by itself prove the whole installation is satisfactory.

Other requirements include:

- correct RCD operation;
- required disconnection time;
- electrode condition;
- continuity of protective conductors;
- inspection and testing.

---

## Question 74 — Oral Interview: Explain \(Z_e\), \(R_1+R_2\) and \(Z_s\)
An examiner asks:

> **“Explain \(Z_e\), \(R_1+R_2\) and \(Z_s\) without confusing them.”**

Give a complete answer. **(10 marks)**

### Answer

### \(Z_e\)

\(Z_e\) is the external earth-fault loop impedance.

It represents the portion of the earth-fault loop external to the consumer’s circuit wiring.

---

### \(R_1+R_2\)

\(R_1+R_2\) is the resistance of the circuit line conductor plus the CPC to the point under consideration.

It is commonly established by a dead continuity test.

---

### \(Z_s\)

\(Z_s\) is the total earth-fault loop impedance at the point under consideration.

For a simple calculation:

\[
Z_s=Z_e+(R_1+R_2)
\]

---

### Why the distinction matters

The three values describe different parts of the fault path.

A high circuit \(R_1+R_2\) increases \(Z_s\).

A high \(Z_s\) reduces earth-fault current.

Reduced fault current can slow protective-device operation.

Therefore the measurements and calculations are directly connected to protection against electric shock.

---

## Question 75 — Oral Interview: Explain Earthing from Fault to Disconnection
An examiner asks:

> **“Why do we earth metal equipment? Explain what happens from the instant a line conductor touches the metal case until the supply disconnects.”**

Give a complete answer. **(12 marks)**

### Answer

A strong answer is:

1. Under normal conditions, the metal case of Class I equipment is not live.
2. The case is connected to the CPC.
3. If basic insulation fails and the line conductor touches the metal case, the case becomes connected to line voltage.
4. Because the case is earthed through the CPC, a fault-current path is immediately created.
5. Current flows from the source through the line conductor to the fault.
6. It flows through the metal enclosure and CPC.
7. It returns through the earthing system to the earthed source point.
8. The total impedance of this path is the earth-fault loop impedance \(Z_s\).
9. The available fault current is approximately:

\[
I_f=\frac{U_0}{Z_s}
\]

10. If the loop impedance is sufficiently low, enough current flows to operate the protective device.
11. The fuse, MCB, RCBO or RCD, depending on the protective arrangement, disconnects the supply.
12. The exposed metalwork is therefore prevented from remaining dangerously energized for an excessive period.

The essential point is:

\[
\boxed{\text{Earthing creates the protective fault path; the protective device removes the dangerous supply.}}
\]

---

# Step 3 Summary

By the end of Step 3, the student should be able to:

- define protective earthing;
- define CPC, earthing conductor and MET;
- distinguish exposed-conductive-parts from extraneous-conductive-parts;
- explain TN-S, TN-C-S and TT earthing systems;
- trace the complete earth-fault current path;
- explain automatic disconnection of supply;
- use Table 41.1 disconnection times correctly in BS 7671 examples;
- define \(Z_e\), \(R_1+R_2\) and \(Z_s\);
- use:

\[
Z_s=Z_e+(R_1+R_2)
\]

- calculate approximate earth-fault current;
- explain why low \(Z_s\) assists rapid overcurrent-device operation;
- use Table 41.3 for protective-device examples;
- distinguish tabulated maximum \(Z_s\) from a temperature-adjusted field comparison;
- explain the 80% method;
- understand the role of \(C_{\min}\);
- use the TT relationship:

\[
R_AI_{\Delta n}\leq50V
\]

- interpret Table 41.5;
- explain why RCDs are especially important in many TT systems;
- describe CPC continuity and \(R_1+R_2\) testing;
- explain the danger of a broken or missing CPC;
- select CPC sizes using Table 54.7;
- state and use the adiabatic equation;
- choose the correct \(k\) value;
- calculate minimum CPC size;
- calculate fault withstand time;
- and explain the complete relationship between earthing, fault current and protective-device disconnection.

---

# BS 7671 Reference Summary for Step 3

## Table 41.1 — Maximum Disconnection Times

For the \(120V<U_0\leq230V\) AC column used in common 230 V examples:

| Earthing system | Maximum time |
|---|---:|
| TN | 0.4 s |
| TT | 0.2 s |

The table applies to the final circuits specified in Regulation 411.3.2.2.

Other circuit conditions may permit different times, such as 5 s for applicable TN circuits under Regulation 411.3.2.3.

---

## Table 41.3 — Example Maximum \(Z_s\)

For a:

- Type B;
- 32 A;
- BS EN 60898 circuit-breaker;

the table value used in this step is:

\[
\boxed{1.37\Omega}
\]

For design and real installations, device characteristics and manufacturer data should be considered where appropriate.

---

## Appendix 3 — Simplified Measured-\(Z_s\) Temperature Allowance

A commonly used simplified comparison is:

\[
\boxed{Z_{s,\text{measured max}}\approx0.8Z_{41}}
\]

Example:

\[
1.37\times0.8=1.096\Omega
\]

This allowance accounts for the increase in conductor resistance as conductor temperature rises.

---

## Regulation 411.5.3 / Table 41.5 — TT/RCD Fault Protection

Relationship:

\[
\boxed{R_AI_{\Delta n}\leq50V}
\]

Selected Table 41.5 values:

| RCD rated residual operating current | Maximum \(Z_s\) |
|---:|---:|
| 30 mA | 1667 Ω |
| 100 mA | 500 Ω |
| 300 mA | 167 Ω |
| 500 mA | 100 Ω |

The electrode resistance should nevertheless be as low as practicable; a very high theoretical allowable value is not a design target.

---

## Regulation 543.1.3 — Adiabatic Equation

\[
\boxed{S=\frac{\sqrt{I^2t}}{k}}
\]

where:

- \(S\) = conductor CSA in mm²;
- \(I\) = fault current in A;
- \(t\) = protective-device operating time in s;
- \(k\) = conductor thermal/material factor.

---

## Table 43.1 — Selected \(k\) Values

For the examples in this step:

| Conductor/insulation | \(k\) |
|---|---:|
| Copper, 70 °C thermoplastic, relevant size range | 115 |
| Copper, 90 °C thermosetting | 143 |

The correct table column must match the actual conductor and insulation system.

---

## Table 54.7 — Protective Conductor of Same Material as Line Conductor

| Associated line conductor \(S\) | Minimum protective conductor |
|---:|---:|
| \(S\leq16\text{ mm}^2\) | \(S\) |
| \(16<S\leq35\text{ mm}^2\) | 16 mm² |
| \(S>35\text{ mm}^2\) | \(S/2\) |

If the protective conductor is of a different material, the relevant \(k_1/k_2\) relationship in Table 54.7 must be used rather than blindly applying this same-material column.

---

# Step 3 Distinction Checklist

You should now be able to:

1. give the official definitions of earthing, protective earthing, CPC, exposed-conductive-part, extraneous-conductive-part, MET, earth electrode and \(Z_s\);
2. draw and verbally trace a complete earth-fault loop;
3. explain why fault current must return to the source;
4. distinguish \(Z_e\), \(R_1+R_2\) and \(Z_s\);
5. explain why \(Z_s\) is impedance while conductor continuity values are mainly resistance;
6. relate low/high \(Z_s\) to fault current and disconnection speed;
7. distinguish TN and TT fault paths;
8. explain why an RCD is especially important where the fault-loop path cannot produce sufficient overcurrent;
9. size a CPC by tabulated method or adiabatic equation;
10. explain every term in \(S=\sqrt{I^2t}/k\) physically.

**End of Strengthened Step 3**
