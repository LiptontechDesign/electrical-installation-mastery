# EPRA C2 & C1 Self-Study Question Bank

## Step 7 — Maximum Demand, Diversity, Utilization, Protection Selectivity, Measuring Instruments, Electrical Safety and First Aid — Strengthened Distinction Edition

> **Purpose of this step:**  
> Step 7 completes several major C2 foundation areas that also carry into C1:
>
> - maximum demand;
> - connected load;
> - diversity factor;
> - utilization factor;
> - demand factor;
> - protection discrimination/selectivity;
> - electrical measuring instruments;
> - instrument selection and safe use;
> - electric-shock hazards;
> - electrical burns;
> - emergency response;
> - CPR/AED principles;
> - and practical electrical-safety scenarios.
>
> The aim is not to memorize isolated definitions. The student should understand how these ideas affect:
>
> \[
> \boxed{\text{design, protection, testing, safe work and emergency response}}
> \]

---

# Strengthened-Edition Answer Method

This strengthened Step 7 keeps the original question bank but upgrades the answer standard.

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


# Important EPRA Scope Note

EPRA's current C2 competency areas include:

- diversity factor;
- utilization factor;
- power factor;
- protection discrimination/selectivity;
- instrumentation and electrical measuring instruments;
- electrical safety requirements;
- first aid.

C1 includes all C2 competency areas.

This step therefore contains material relevant to both C2 and C1.

---

# Important First-Aid Note

The first-aid section is for exam preparation and electrical-work awareness.

In a real emergency:

- make the scene electrically safe before touching the casualty;
- activate emergency medical services;
- give care only within your level of training;
- begin CPR for an unresponsive person who is not breathing normally or is only gasping;
- use an AED as soon as one is available;
- electrical burns require medical assessment because internal injury may be greater than the visible skin injury.

Current first-aid guidance should always take precedence over memorized classroom wording.

---

# Section A — Connected Load and Maximum Demand

## Question 1 — Define Connected Load
**Define connected load. (3 marks)**

### Answer

Connected load is the total rated load of electrical equipment connected to an installation or circuit.

It is obtained by adding the rated powers of the connected equipment.

For example, if an installation contains:

- 2 kW heater;
- 3 kW cooker load;
- 1 kW water heater;

then:

\[
P_{\text{connected}}=2+3+1
\]

\[
\boxed{P_{\text{connected}}=6kW}
\]

Connected load does not necessarily mean all equipment will operate simultaneously at full rating.

---

## Question 2 — Define Maximum Demand
**Define maximum demand. (4 marks)**

### Answer

Maximum demand is the greatest demand expected or measured on an electrical installation during a specified period under normal operating conditions.

It is generally lower than total connected load because:

\[
\boxed{\text{not all connected equipment operates at full load at the same time}}
\]

Maximum demand is important for selecting:

- supply capacity;
- main switchgear;
- distribution equipment;
- cables;
- transformers;
- protective devices.

---

## Question 3 — Why Maximum Demand Matters
**Give five reasons why maximum demand is important in electrical design. (5 marks)**

### Answer

Maximum demand affects the selection of:

1. supply service size;
2. main incoming cable;
3. distribution-board rating;
4. main protective device;
5. transformer capacity;
6. generator capacity;
7. feeder size;
8. switchgear rating.

If maximum demand is underestimated, equipment may be overloaded.

If it is grossly overestimated, the installation may be unnecessarily expensive and oversized.

---

## Question 4 — Connected Load vs Maximum Demand
An installation has a connected load of:

\[
30kW
\]

but the estimated maximum demand is:

\[
18kW
\]

Explain why both figures can be correct. **(4 marks)**

### Answer

The connected load represents the total rating of all installed loads.

The maximum demand represents the greatest load expected to operate simultaneously.

Therefore:

\[
30kW
\]

may be installed, but operating patterns may mean that the greatest simultaneous demand is only:

\[
18kW
\]

This is normal and is the reason diversity is considered in electrical design.

---

# Step 7 Distinction Lens — Do Not Confuse the Load Factors

Before calculating, write the numerator and denominator in words.

### Demand factor

\[
\frac{\text{maximum demand}}{\text{connected load}}
\]

normally \(\leq1\).

### Diversity factor

\[
\frac{\sum\text{individual maximum demands}}{\text{maximum simultaneous system demand}}
\]

normally \(>1\).

### Utilization factor

Use the definition/convention specified by the question or applicable design source; in this study bank the system-design form is:

\[
\frac{\text{maximum demand}}{\text{rated capacity}}
\]

The safest exam habit is to write the ratio in words before substituting numbers.

---

# Section B — Demand Factor

## Question 5 — Define Demand Factor
**Define demand factor and give its formula. (4 marks)**

### Answer

Demand factor is the ratio of maximum demand to total connected load.

\[
\boxed{
\text{Demand Factor}
=
\frac{\text{Maximum Demand}}{\text{Connected Load}}
}
\]

Because maximum demand normally does not exceed connected load:

\[
\boxed{\text{Demand factor}\leq1}
\]

---

## Question 6 — Calculate Demand Factor
An installation has:

\[
P_{\text{connected}}=40kW
\]

and:

\[
P_{\text{max demand}}=28kW
\]

Calculate the demand factor. **(4 marks)**

### Answer

\[
DF=\frac{28}{40}
\]

\[
DF=0.70
\]

Therefore:

\[
\boxed{DF=0.70}
\]

or:

\[
\boxed{70\%}
\]

---

# Section C — Diversity Factor

## Question 7 — Define Diversity Factor
**Define diversity factor and give its formula. (5 marks)**

### Answer

Diversity factor is the ratio of the sum of the individual maximum demands of separate loads or groups to the maximum demand of the complete system.

\[
\boxed{
\text{Diversity Factor}
=
\frac{\sum \text{individual maximum demands}}
{\text{maximum demand of complete system}}
}
\]

Because all individual peaks do not usually occur at the same time:

\[
\boxed{\text{diversity factor is normally greater than 1}}
\]

---

## Question 8 — Diversity Factor Calculation
Three sections of an installation have individual maximum demands of:

\[
10kW,\quad15kW,\quad20kW
\]

The maximum demand measured for the whole installation is:

\[
30kW
\]

Calculate the diversity factor. **(5 marks)**

### Answer

Sum of individual maximum demands:

\[
10+15+20=45kW
\]

Therefore:

\[
\text{Diversity Factor}=\frac{45}{30}
\]

\[
\boxed{\text{Diversity Factor}=1.5}
\]

---

## Question 9 — Why Diversity Factor Exceeds 1
**Explain why diversity factor is normally greater than 1. (4 marks)**

### Answer

The maximum demand of every individual load or section usually occurs at different times.

Therefore the sum of their individual peaks is greater than the maximum simultaneous demand of the whole installation.

Hence:

\[
\frac{\sum \text{individual peaks}}
{\text{simultaneous system peak}}
>1
\]

This is the basic principle of diversity.

---

## Question 10 — Diversity Does Not Mean Guessing
**Explain why diversity should not be applied as an arbitrary percentage without considering the installation. (5 marks)**

### Answer

Diversity depends on:

- type of building;
- occupancy;
- appliance use;
- operating schedule;
- load characteristics;
- simultaneous-use patterns;
- historical demand where available.

Applying an arbitrary percentage without justification can lead to:

- undersized cables;
- overloaded switchgear;
- nuisance tripping;
- unsafe supply design.

Diversity must be based on an appropriate rule, standard, design guide or reasonable engineering assessment.

---

# Section D — Utilization Factor

## Question 11 — Define Utilization Factor
**Define utilization factor in an electrical-system design context. (4 marks)**

### Answer

Utilization factor describes how much of the rated capacity of equipment or a system is actually used at maximum demand.

A common engineering definition is:

\[
\boxed{
\text{Utilization Factor}
=
\frac{\text{Maximum Demand}}
{\text{Rated Capacity}}
}
\]

It indicates how fully the available equipment capacity is utilized.

The exact convention should always be checked where a particular standard or examination defines the term differently.

---

## Question 12 — Utilization-Factor Calculation
A distribution transformer is rated at:

\[
100kVA
\]

The highest demand is:

\[
72kVA
\]

Calculate utilization factor. **(4 marks)**

### Answer

\[
UF=\frac{72}{100}
\]

\[
\boxed{UF=0.72}
\]

or:

\[
\boxed{72\%}
\]

---

## Question 13 — Distinguish Demand, Diversity and Utilization
**Differentiate between demand factor, diversity factor and utilization factor. (9 marks)**

### Answer

### Demand Factor

\[
\frac{\text{maximum demand}}
{\text{connected load}}
\]

Normally:

\[
\leq1
\]

---

### Diversity Factor

\[
\frac{\sum\text{individual maximum demands}}
{\text{maximum simultaneous demand}}
\]

Normally:

\[
>1
\]

---

### Utilization Factor

A common system-design definition is:

\[
\frac{\text{maximum demand}}
{\text{rated equipment/system capacity}}
\]

Normally:

\[
\leq1
\]

These three terms describe different relationships and should not be used interchangeably.

---

# Section E — Maximum-Demand Calculations

## Question 14 — Basic Maximum-Demand Calculation
A building has the following estimated diversified loads:

- lighting = 2.5 kW;
- socket loads = 5.0 kW;
- water heating = 3.0 kW;
- cooking = 4.5 kW.

Calculate estimated maximum demand in kW. **(4 marks)**

### Answer

\[
P_{MD}=2.5+5.0+3.0+4.5
\]

\[
\boxed{P_{MD}=15.0kW}
\]

The figures supplied are already diversified values, so they are added directly.

---

## Question 15 — Single-Phase Current from Maximum Demand
Using Question 14, assume:

\[
V=230V
\]

and unity power factor.

Calculate the design current corresponding to the 15 kW maximum demand. **(4 marks)**

### Answer

\[
I=\frac{P}{V}
\]

\[
I=\frac{15000}{230}
\]

\[
I=65.22A
\]

Therefore:

\[
\boxed{I\approx65.2A}
\]

---

## Question 16 — Three-Phase Current from Maximum Demand
A balanced three-phase installation has an estimated maximum demand of:

\[
45kW
\]

at:

\[
400V
\]

and:

\[
PF=0.9
\]

Calculate line current. **(5 marks)**

### Answer

Use:

\[
P=\sqrt{3}V_LI_LPF
\]

Therefore:

\[
I_L=\frac{P}{\sqrt{3}V_LPF}
\]

\[
I_L=\frac{45000}{1.732\times400\times0.9}
\]

\[
I_L=72.17A
\]

Therefore:

\[
\boxed{I_L\approx72.2A}
\]

---

# Section F — Protection Selectivity / Discrimination

## Question 17 — Define Selectivity
**Define protection selectivity or discrimination. (4 marks)**

### Answer

### Formal BS 7671 definition

The uploaded Part 2 uses **Selectivity** by reference to **Discrimination**, which it defines as:

> **“Ability of a protective device to operate in preference to another protective device in series.”**

In practical coordination terms, selectivity means arranging protective devices so that the device nearest the fault operates while upstream devices remain closed where possible.

The goal is:

\[
\boxed{\text{disconnect the smallest necessary part of the installation}}
\]

This improves:

- continuity of supply;
- fault localization;
- operational reliability.

---

## Question 18 — Why Selectivity Matters
**State five advantages of good protective-device selectivity. (5 marks)**

### Answer

Advantages include:

1. only the faulty circuit is disconnected;
2. healthy circuits remain energized;
3. reduced disruption;
4. easier fault location;
5. improved continuity of service;
6. reduced risk of complete-building shutdown;
7. safer operation of essential services.

---

## Question 19 — Selective Operation Example
A final circuit MCB and an upstream main breaker both trip for a small fault on one socket circuit.

**Why may this indicate poor selectivity? (4 marks)**

### Answer

Ideally, the final-circuit protective device should clear a fault that is within its protective zone.

If the upstream main breaker also trips unnecessarily:

- unrelated circuits lose supply;
- fault localization is poorer;
- continuity of service is reduced.

This can indicate that the time/current characteristics of the two devices are not adequately coordinated for that fault level.

---

## Question 20 — Total vs Partial Selectivity
**Differentiate between total selectivity and partial selectivity. (5 marks)**

### Answer

### Total Selectivity

The downstream protective device operates alone for all fault currents up to the maximum prospective fault current at the protected point.

### Partial Selectivity

The downstream device operates alone only up to a specified fault-current level.

Above that level, the upstream device may also operate.

Therefore selectivity is not always an all-or-nothing condition.

---

## Question 21 — Time Selectivity
**Explain the principle of time selectivity. (5 marks)**

### Answer

Time selectivity uses intentional differences in operating time.

The downstream protective device is arranged to operate faster.

The upstream device has a delay for fault currents within the coordinated range.

Therefore:

\[
\boxed{\text{downstream device clears first}}
\]

while the upstream device remains closed unless the downstream device fails or the fault lies outside its zone.

---

## Question 22 — Current Selectivity
**Explain the principle of current selectivity. (4 marks)**

### Answer

Current selectivity relies on different operating-current thresholds.

The downstream device is set or selected to respond at a lower current than the upstream device.

For certain fault-current ranges:

- downstream device operates;
- upstream device remains closed.

Actual selectivity should be confirmed using manufacturer data or coordination tables rather than assumed only from device ampere ratings.

---

## Question 23 — RCD Selectivity
**How can RCDs be arranged to improve selectivity? (5 marks)**

### Answer

Selectivity can be improved by coordinating:

- rated residual operating current;
- operating time;
- device type.

For example, an upstream time-delayed/selective RCD may be coordinated with downstream general RCDs so that the downstream device operates first for a local residual-current fault.

Correct coordination depends on the applicable system and manufacturer data.

---

## Question 24 — Why Ratings Alone Are Not Enough
A 100 A upstream breaker supplies a 32 A downstream breaker.

**Can you automatically conclude that the devices are selective? Explain. (4 marks)**

### Answer

No.

Different current ratings alone do not prove selectivity.

Selectivity depends on:

- time/current curves;
- instantaneous trip regions;
- fault-current magnitude;
- device type;
- manufacturer coordination data;
- current-limiting characteristics.

The devices should be checked using appropriate discrimination/selectivity information.

---

# Step 7 Distinction Lens — Instrument Choice Is Part of the Answer

A measurement answer should state:

1. the quantity to be measured;
2. the correct instrument;
3. whether the circuit is dead or live;
4. how the instrument is connected;
5. what result is expected;
6. what an abnormal result would suggest.

Examples:

- voltage → voltmeter/two-pole detector across two points;
- current → ammeter in series or clamp around one conductor;
- low conductor resistance → continuity tester;
- insulation resistance → insulation-resistance tester;
- \(Z_s\) → loop tester or justified calculation;
- RCD operation → RCD tester.

Never use a familiar instrument merely because it can display “some number.”

---

# Section G — Electrical Measuring Instruments

## Question 25 — Voltmeter
**What does a voltmeter measure, and how is it connected? (4 marks)**

### Answer

A voltmeter measures:

\[
\boxed{\text{potential difference}}
\]

in volts.

It is connected:

\[
\boxed{\text{in parallel}}
\]

across the two points between which voltage is required.

An ideal voltmeter has very high internal resistance so that it draws minimal current from the circuit being measured.

---

## Question 26 — Ammeter
**What does an ammeter measure, and how is it connected? (4 marks)**

### Answer

An ammeter measures:

\[
\boxed{\text{electric current}}
\]

in amperes.

A conventional ammeter is connected:

\[
\boxed{\text{in series}}
\]

with the circuit whose current is being measured.

It has very low internal resistance so that it introduces minimal voltage drop.

Connecting a low-resistance current input directly across a voltage source can cause a severe short circuit.

---

## Question 27 — Ohmmeter
**What does an ohmmeter measure, and why should resistance normally be measured on a de-energized circuit? (5 marks)**

### Answer

An ohmmeter measures electrical resistance.

It uses its own internal test source.

If connected to an energized circuit:

- external voltage can damage the instrument;
- the reading may be meaningless;
- the operator may be exposed to danger.

Therefore resistance testing is normally carried out on:

\[
\boxed{\text{safely isolated, proved-dead circuits}}
\]

---

## Question 28 — Multimeter
**State six quantities or functions a typical digital multimeter may provide. (6 marks)**

### Answer

Depending on the instrument, functions may include:

1. AC voltage;
2. DC voltage;
3. AC/DC current;
4. resistance;
5. continuity;
6. diode test;
7. frequency;
8. capacitance;
9. temperature.

A multimeter is versatile but is not automatically the best instrument for every electrical-installation test.

---

## Question 29 — Clamp Meter
**Explain the main advantage of a clamp meter. (4 marks)**

### Answer

A clamp meter can measure current by detecting the magnetic field around a conductor.

The main advantage is that the conductor normally does not need to be disconnected and inserted in series with the meter.

This makes it useful for:

- load-current measurement;
- phase-current comparison;
- inrush-current measurement where supported;
- identifying current imbalance.

Only the intended conductor should normally pass through the clamp for ordinary current measurement.

---

## Question 30 — Why Clamp One Conductor?
A clamp meter is placed around both line and neutral of a healthy single-phase circuit.

What approximate reading should be expected, and why? **(5 marks)**

### Answer

In a healthy circuit:

\[
I_L\approx I_N
\]

but the currents flow in opposite directions.

Their magnetic fields cancel.

Therefore the clamp should read approximately:

\[
\boxed{0A}
\]

A sensitive leakage-current clamp can use this principle to detect residual current where the cancellation is not exact.

---

# Section H — Installation Test Instruments

## Question 31 — Low-Resistance Continuity Tester
**What is a low-resistance continuity tester used for? (4 marks)**

### Answer

It is used to measure low conductor resistances such as:

- CPC continuity;
- bonding continuity;
- \(R_1+R_2\);
- ring end-to-end resistance.

Results are commonly in:

\[
\Omega
\]

or:

\[
m\Omega
\]

It is designed for low-resistance measurement, unlike an insulation-resistance tester.

---

## Question 32 — Insulation-Resistance Tester
**What is an insulation-resistance tester used for? (4 marks)**

### Answer

It applies a controlled DC test voltage and measures very high resistance between conductors.

It is used to assess insulation between:

- line and neutral;
- live conductors and Earth;
- phase conductors;
- other isolated conductors.

Results are normally expressed in:

\[
\boxed{M\Omega}
\]

---

## Question 33 — Earth-Fault Loop Tester
**What does an earth-fault loop impedance tester measure? (4 marks)**

### Answer

It measures the impedance of the earth-fault loop.

Depending on where and how it is used, it can determine values such as:

\[
Z_e
\]

or:

\[
Z_s
\]

The result helps establish whether sufficient fault current can flow to operate the protective device within the required time.

Because many loop tests are live tests, safe procedure is essential.

---

## Question 34 — RCD Tester
**What does an RCD tester verify? (4 marks)**

### Answer

An RCD tester applies a controlled residual current and measures the response of the RCD.

Depending on the test method and applicable standard, it may verify:

- operating time;
- residual-current response;
- correct disconnection.

It provides quantitative information that the integral RCD test button alone does not provide.

---

## Question 35 — Phase-Sequence Meter
**What is a phase-sequence meter used for? (4 marks)**

### Answer

It identifies the order of the three phases.

For example:

\[
L1\rightarrow L2\rightarrow L3
\]

It is useful when:

- commissioning three-phase installations;
- checking motor rotation arrangements;
- verifying consistent phase sequence.

---

## Question 36 — Earth-Electrode Resistance Tester
**What is an earth-electrode resistance tester used for? (4 marks)**

### Answer

It measures the resistance of an earth electrode or earthing system to the general mass of Earth using an appropriate test method.

It is particularly relevant to installations such as:

- TT systems;
- lightning protection;
- dedicated earthing systems.

Test method depends on site conditions and may use auxiliary test electrodes or suitable alternative techniques.

---

## Question 37 — Two-Pole Voltage Detector
**Why is a two-pole voltage detector preferred for proving dead? (4 marks)**

### Answer

A suitable two-pole voltage detector:

- directly tests between two points;
- has a simple dedicated purpose;
- reduces risk of incorrect range selection;
- is suitable for prove-dead procedures when used with a proving unit.

The instrument should be proved:

\[
\boxed{\text{before and after proving the circuit dead}}
\]

---

## Question 38 — Proving Unit
**What is the purpose of a proving unit? (4 marks)**

### Answer

A proving unit provides a known test voltage that confirms the voltage indicator is functioning.

It is used:

1. before proving the circuit dead;
2. after proving the circuit dead.

This confirms that a zero indication was not caused by instrument failure.

---

# Section I — Instrument Safety, Range and Accuracy

## Question 39 — Accuracy
**What is instrument accuracy? (3 marks)**

### Answer

Accuracy is the closeness of an instrument's indicated value to the true value.

An instrument with poor accuracy may give a repeatable reading that is still incorrect.

Accuracy is therefore different from repeatability.

---

## Question 40 — Resolution
**What is instrument resolution? (3 marks)**

### Answer

Resolution is the smallest change in the measured quantity that the instrument can display or distinguish.

For example, a meter displaying to:

\[
0.01V
\]

has finer voltage resolution than one displaying only to:

\[
0.1V
\]

within the relevant range.

---

## Question 41 — Calibration
**Why is calibration or periodic accuracy verification important? (4 marks)**

### Answer

Instrument performance can drift due to:

- age;
- damage;
- environmental effects;
- component change;
- misuse.

Calibration/verification provides confidence that measured values remain sufficiently accurate for the intended work.

A test certificate based on unreliable instruments can lead to incorrect safety conclusions.

---

## Question 42 — Wrong Multimeter Range
A technician attempts to measure a 230 V supply while the multimeter leads are connected to the high-current input terminals.

**Why is this dangerous? (5 marks)**

### Answer

The current-input circuit has very low resistance.

Connecting it directly across a voltage source can effectively create a short circuit through the meter.

Possible consequences include:

- high fault current;
- meter destruction;
- arc flash;
- burns;
- blown internal fuse;
- serious injury.

The correct:

- function;
- input terminals;
- range;
- instrument category

must be selected before connection.

---

## Question 43 — CAT Rating
**What is the purpose of an instrument measurement-category rating such as CAT II, CAT III or CAT IV? (5 marks)**

### Answer

Measurement categories relate to the transient-overvoltage environment in which test equipment is intended to be safely used.

Higher-energy parts of an electrical distribution system can expose instruments to larger transient currents and overvoltages.

The instrument must therefore have a category and voltage rating suitable for the point of measurement.

A small electronics multimeter may not be safe for measurements at a distribution board even if its display can show the nominal voltage.

---

# Step 7 Distinction Lens — Shock Severity Is a Current-and-Time Problem

A useful first-principles model is:

\[
I=\frac{V}{R}
\]

Body resistance is not fixed.

It can fall with:

- wet skin;
- larger contact area;
- damaged skin;
- conductive surroundings.

Shock severity then also depends on:

- current path;
- duration;
- frequency;
- physiological condition.

This is why “it is only 230 V” is never a valid safety argument.

---

# Section J — Electrical Shock

## Question 44 — What Is Electric Shock?
**Define electric shock. (3 marks)**

### Answer

### Formal BS 7671 definition

The uploaded Part 2 defines **Electric shock** as:

> **“A dangerous physiological effect resulting from the passing of an electric current through a human body or livestock.”**

This definition emphasizes that the danger comes from current through the body, not merely from “touching voltage.”

The severity can range from:

- tingling;
- muscle contraction;
- burns;

to:

- respiratory arrest;
- cardiac arrest;
- fatal injury.

---

## Question 45 — Factors Affecting Shock Severity
**State six factors that influence the severity of electric shock. (6 marks)**

### Answer

Important factors include:

1. magnitude of current;
2. duration of current flow;
3. current path through the body;
4. supply frequency;
5. skin condition;
6. contact area;
7. body resistance;
8. wet/dry environment;
9. voltage;
10. health condition of the casualty.

Current passing through the chest is especially dangerous because it can affect the heart and breathing.

---

## Question 46 — Why Wet Conditions Increase Risk
**Explain why electric-shock risk generally increases in wet conditions. (4 marks)**

### Answer

Water, especially water containing dissolved salts or contaminants, reduces the effective resistance of the skin and contact path.

From:

\[
I=\frac{V}{R}
\]

if resistance falls while voltage remains the same:

\[
I\uparrow
\]

Therefore more current may pass through the body.

Wet conditions can also increase:

- contact area;
- contact with Earth;
- likelihood of conductive surfaces.

---

## Question 47 — Touch Voltage
**What is touch voltage? (4 marks)**

### Answer

Touch voltage is the voltage that may appear between conductive parts that can be touched simultaneously, or between an exposed-conductive-part and Earth, during a fault.

For example, if a metal appliance case becomes energized because of a fault, a person touching:

- the case;
- and an earthed object or the ground

may be exposed to a dangerous potential difference.

---

## Question 48 — Step Potential
**What is step potential? (4 marks)**

### Answer

Step potential is the voltage difference between two points on the ground separated by a person's step distance.

It can occur near:

- fallen high-voltage conductors;
- lightning strikes;
- high-current earth faults;
- substations.

A voltage gradient in the soil can cause current to pass through a person from one foot to the other.

---

# Section K — Electrical Safety Practices

## Question 49 — Hierarchy: De-Energize First
**Why should electrical work normally be carried out de-energized where practicable? (5 marks)**

### Answer

De-energizing removes the principal electrical energy source.

This reduces the risk of:

- electric shock;
- arc flash;
- burns;
- unintended short circuit;
- involuntary reaction/fall.

The circuit must still be:

- correctly identified;
- isolated;
- secured;
- proved dead.

Simply switching OFF is not enough.

---

## Question 50 — PPE Is Not a Substitute for Isolation
**Explain why PPE should not be used as an excuse to work live unnecessarily. (4 marks)**

### Answer

PPE reduces risk but does not eliminate the electrical hazard.

PPE can:

- fail;
- be damaged;
- be incorrectly selected;
- be incorrectly worn.

The preferred control is to remove the hazard where possible by:

\[
\boxed{\text{safe isolation}}
\]

PPE is an additional control, not a replacement for proper isolation.

---

## Question 51 — Damaged Test Leads
**Why should damaged meter leads never be used? (4 marks)**

### Answer

Damaged insulation or probes can expose the operator to:

- electric shock;
- short circuit;
- arc;
- inaccurate test results.

Test leads should be inspected before use and replaced if damaged.

Temporary repairs such as ordinary adhesive tape should not be treated as an acceptable long-term safety repair for professional test leads.

---

## Question 52 — Working in a Wet Area
**State six precautions relevant when electrical work is required in a wet or damp environment. (6 marks)**

### Answer

Possible precautions include:

1. de-energize and isolate where possible;
2. use suitable equipment with correct IP rating;
3. use appropriate RCD protection;
4. keep hands and equipment dry where practicable;
5. avoid standing in water;
6. use suitable insulated tools/PPE where required;
7. control access;
8. remove damaged equipment;
9. use safe extra-low-voltage equipment where appropriate;
10. assess environmental risk before starting.

---

# Section L — Electrical Fire Safety

## Question 53 — Causes of Electrical Fire
**State six electrical faults or conditions that can cause fire. (6 marks)**

### Answer

Causes include:

1. overload;
2. loose high-resistance connections;
3. short circuit;
4. damaged insulation;
5. undersized conductors;
6. poor terminations;
7. incorrect protective devices;
8. overheating equipment;
9. arcing;
10. poor ventilation around electrical equipment.

---

## Question 54 — Loose Connection Heating
**Explain why a loose connection can overheat even when circuit current is not excessive. (5 marks)**

### Answer

A loose connection can create high local resistance.

Power dissipated at the connection is:

\[
P=I^2R
\]

If local resistance rises:

\[
R\uparrow
\]

then heating rises for the same current.

The small connection area concentrates the heat.

This can:

- damage insulation;
- carbonize material;
- cause arcing;
- start a fire.

---

## Question 55 — Water on Energized Electrical Equipment
**Why should ordinary water not be directed onto energized electrical equipment during a fire? (4 marks)**

### Answer

Water can conduct electrical current, particularly when contaminated.

Applying water to energized equipment can create:

- shock hazard;
- current paths through the user;
- additional short circuits.

The electrical supply should be isolated where safe to do so, and the correct firefighting method/equipment for the situation should be used.

Personal safety and emergency-service instructions take priority.

---

# Section M — First Response to Electric Shock

## Question 56 — First Action at an Electrical-Shock Scene
A person is still in contact with an energized conductor.

**What is the first priority? (5 marks)**

### Answer

The first priority is:

\[
\boxed{\text{make the scene electrically safe without becoming another casualty}}
\]

Do **not** touch the person while they remain in contact with the energized source.

Where safe and practicable:

- switch off/isolate the electrical supply;
- have another person activate emergency services.

Only approach/touch the casualty when the electrical hazard has been removed or controlled.

---

## Question 57 — Why Not Grab the Casualty?
**Why must you not simply grab a person who is still in contact with live electricity? (4 marks)**

### Answer

The casualty's body may be part of the electrical circuit.

Touching them can create a new path through the rescuer.

The rescuer may then also receive an electric shock.

This can produce:

\[
\boxed{\text{two casualties instead of one}}
\]

The source must be made safe first.

---

## Question 58 — Initial Casualty Assessment
Once the electrical source is safely isolated, what should be assessed first? **(6 marks)**

### Answer

A basic emergency assessment includes:

1. scene safety;
2. responsiveness;
3. normal breathing;
4. immediately life-threatening bleeding or injury;
5. activation of emergency medical services where required;
6. obtaining an AED if the casualty is unresponsive and not breathing normally.

If the person is unresponsive and not breathing normally or is only gasping:

\[
\boxed{\text{start CPR and use an AED as soon as available}}
\]

according to current first-aid guidance and level of training.

---

## Question 59 — CPR Compression Rate
For an adult in cardiac arrest, what chest-compression rate is recommended by current Red Cross guidance? **(3 marks)**

### Answer

The recommended rate is:

\[
\boxed{100\text{ to }120\text{ compressions per minute}}
\]

Compressions should be delivered on a firm, flat surface where possible.

Current CPR/AED training should be followed in a real emergency.

---

## Question 60 — CPR Compression-to-Breath Ratio
For a trained rescuer providing standard adult CPR, what compression-to-breath pattern is commonly taught? **(3 marks)**

### Answer

A common adult CPR sequence is:

\[
\boxed{30\text{ chest compressions} : 2\text{ rescue breaths}}
\]

The cycle continues with minimal interruption until:

- the person shows signs of life;
- trained emergency personnel take over;
- an AED directs otherwise during analysis/shock;
- the rescuer cannot continue safely.

---

## Question 61 — AED
**What is an AED and when should it be used? (5 marks)**

### Answer

AED means:

\[
\boxed{\text{Automated External Defibrillator}}
\]

It analyzes the heart rhythm of a person in cardiac arrest and advises/delivers a shock when appropriate.

For an unresponsive person who is not breathing normally:

- CPR should begin;
- an AED should be obtained and used as soon as possible;
- follow the device voice/visual instructions.

No one should touch the casualty while the AED is analyzing or delivering a shock.

---

## Question 62 — Unresponsive but Breathing
An electrical-shock casualty is unresponsive but breathing normally after the source has been isolated.

**What general care is appropriate? (5 marks)**

### Answer

Activate emergency medical services.

Maintain:

- airway;
- breathing observation;
- body temperature.

If there is no suspected spinal/major trauma and the situation is appropriate, a recovery position can help maintain the airway.

Continue monitoring because the person's condition can deteriorate.

Electrical injuries require medical assessment even where external injuries appear minor.

---

# Section N — Electrical Burns

## Question 63 — Why Electrical Burns Are Deceptive
**Why can an electrical burn be more serious than it appears? (5 marks)**

### Answer

Visible skin damage may be small, but electrical current can pass through:

- deeper tissues;
- muscles;
- nerves;
- blood vessels;
- heart.

Therefore internal injury may be much greater than the visible entry/exit burn.

Electrical current can also disturb:

- heart rhythm;
- breathing.

For this reason electrical-burn casualties should receive medical evaluation.

---

## Question 64 — First Aid for an Electrical Burn
After the source is safely isolated and the casualty is stable, state the general first-aid approach for an electrical burn. **(6 marks)**

### Answer

General current first-aid principles include:

1. activate emergency medical help as appropriate;
2. ensure the electrical source is no longer a hazard;
3. cool the burn with clean, cool running water where appropriate;
4. do not apply butter, grease or unapproved creams;
5. remove loose clothing/jewelry not stuck to the burn where appropriate;
6. protect the area with an appropriate clean dressing if needed;
7. monitor breathing and responsiveness;
8. arrange medical evaluation.

Current Red Cross guidance recommends cooling a thermal/electrical burn with cool running water for at least:

\[
\boxed{15\text{ minutes}}
\]

where appropriate.

---

## Question 65 — Why Medical Evaluation Is Important
A worker receives an electric shock and has only a tiny burn mark on one finger.

He says he feels fine.

**Why should the event not automatically be dismissed as minor? (5 marks)**

### Answer

Electrical current may have passed internally through the body.

Potential hidden effects include:

- cardiac rhythm disturbance;
- internal tissue damage;
- muscle injury;
- nerve injury;
- delayed symptoms.

The small external mark does not reliably indicate the total injury.

Medical assessment is therefore important following significant electrical injury.

---

# Section O — Practical Safety Scenarios

## Question 66 — Fallen Conductor
A person is lying near a fallen power conductor.

**Why is it dangerous to run directly toward the person? (6 marks)**

### Answer

The conductor may still be energized.

Current entering the ground can create a voltage gradient.

This produces:

\[
\boxed{\text{step potential}}
\]

between points on the ground.

A rescuer may receive current from one foot to the other.

The area should be treated as energized until the supply authority/emergency personnel make it safe.

The casualty should not be approached casually.

---

## Question 67 — Electrician Shocked on a Ladder
An electrician receives a shock while working on a ladder and falls.

The supply is isolated.

**Besides the electrical injury, what other injuries should be considered? (5 marks)**

### Answer

The fall can cause trauma such as:

- head injury;
- neck injury;
- spinal injury;
- fractures;
- internal bleeding;
- soft-tissue injury.

Do not focus only on the electrical burn.

Emergency assessment should consider both:

\[
\boxed{\text{electrical injury and trauma}}
\]

---

## Question 68 — Person Appears Well After Shock
A worker receives a brief shock, remains conscious and says no treatment is needed.

**What should a competent supervisor do? (5 marks)**

### Answer

The incident should still be taken seriously.

Actions include:

- make equipment safe;
- remove the worker from further electrical exposure;
- assess for injury;
- obtain appropriate medical evaluation/advice;
- monitor for deterioration;
- investigate and report the electrical fault according to workplace procedures.

An electrical shock should not be ignored merely because the person can speak and walk afterward.

---

# Section P — Integrated Instrument Selection

## Question 69 — Select the Correct Instrument
Select the most appropriate instrument for each task:

**(a)** proving a circuit dead;  
**(b)** measuring CPC resistance;  
**(c)** measuring insulation resistance;  
**(d)** measuring load current without disconnecting conductor;  
**(e)** measuring earth-fault loop impedance;  
**(f)** verifying RCD trip time;  
**(g)** checking phase order.

**(7 marks)**

### Answer

### (a)

\[
\boxed{\text{Two-pole voltage detector + proving unit}}
\]

### (b)

\[
\boxed{\text{Low-resistance continuity tester}}
\]

### (c)

\[
\boxed{\text{Insulation-resistance tester}}
\]

### (d)

\[
\boxed{\text{Clamp meter}}
\]

### (e)

\[
\boxed{\text{Earth-fault loop impedance tester}}
\]

### (f)

\[
\boxed{\text{RCD tester}}
\]

### (g)

\[
\boxed{\text{Phase-sequence meter}}
\]

---

## Question 70 — Wrong Instrument Scenario
A student attempts to test insulation resistance using the resistance range of an ordinary multimeter.

**Why is this not equivalent to a proper insulation-resistance test? (5 marks)**

### Answer

A normal multimeter resistance function uses a low internal test voltage.

An insulation-resistance tester applies a specified higher DC test voltage such as:

\[
250V,\quad500V,\quad1000V
\]

depending on the circuit and standard.

The higher test voltage stresses the insulation appropriately and detects leakage/breakdown that a low-voltage multimeter test may not reveal.

Therefore:

\[
\boxed{\text{ordinary resistance testing is not the same as insulation-resistance verification}}
\]

---

# Section Q — Integrated Diversity and Protection Scenario

## Question 71 — Full Load-Assessment Problem
A small installation contains:

- lighting connected load = 4 kW;
- socket connected load = 10 kW;
- water heating = 6 kW;
- cooking = 8 kW.

After applying the appropriate design diversity method, the estimated contributions to maximum demand are:

- lighting = 3.6 kW;
- sockets = 6.0 kW;
- water heating = 3.0 kW;
- cooking = 4.8 kW.

Calculate:

**(a)** total connected load;  
**(b)** maximum demand;  
**(c)** demand factor.

**(8 marks)**

### Answer

### (a) Connected load

\[
4+10+6+8=28kW
\]

\[
\boxed{P_{\text{connected}}=28kW}
\]

### (b) Maximum demand

\[
3.6+6.0+3.0+4.8=17.4kW
\]

\[
\boxed{P_{MD}=17.4kW}
\]

### (c) Demand factor

\[
DF=\frac{17.4}{28}
\]

\[
DF=0.6214
\]

Therefore:

\[
\boxed{DF\approx0.62}
\]

or about:

\[
\boxed{62\%}
\]

---

## Question 72 — Diversity-Factor Scenario
Four departments have individual maximum demands of:

\[
20,\quad25,\quad30,\quad15kW
\]

The maximum simultaneous demand of the building is:

\[
60kW
\]

Calculate diversity factor. **(5 marks)**

### Answer

Sum of individual maximum demands:

\[
20+25+30+15=90kW
\]

Then:

\[
\text{Diversity Factor}=\frac{90}{60}
\]

\[
\boxed{1.5}
\]

---

# Section R — Oral Examination Questions

## Question 73 — Explain Diversity to an Examiner
An examiner asks:

> **“What is diversity, why do we use it, and what is the danger of using too much diversity?”**

Give a complete answer. **(10 marks)**

### Answer

Diversity recognizes that:

\[
\boxed{\text{not all connected loads reach maximum demand at the same time}}
\]

It allows the designer to estimate a realistic maximum simultaneous load.

This prevents unnecessary oversizing of:

- cables;
- switchgear;
- transformers;
- supply equipment.

However, diversity must be justified.

If excessive diversity is assumed:

- actual demand may exceed design capacity;
- cables may overload;
- protective devices may trip repeatedly;
- switchgear may overheat;
- voltage drop may increase.

Therefore diversity is an engineering assessment, not an arbitrary reduction percentage.

---

## Question 74 — Explain Selectivity to an Examiner
An examiner asks:

> **“What is discrimination or selectivity, and why does it matter?”**

Give a complete answer. **(10 marks)**

### Answer

Selectivity is coordination between protective devices so that the device closest to the fault operates first while upstream devices remain in service where possible.

For example:

\[
\text{main breaker}\rightarrow\text{distribution breaker}\rightarrow\text{final-circuit breaker}
\]

A fault on the final circuit should ideally trip only the final-circuit device.

Advantages include:

- healthy circuits remain energized;
- easier fault location;
- reduced interruption;
- improved reliability.

Selectivity can be achieved using coordination of:

- operating current;
- operating time;
- current-limiting characteristics;
- residual-current rating/time delay for RCDs.

Actual selectivity must be confirmed from device characteristics or manufacturer coordination data.

A larger upstream ampere rating alone does not prove discrimination.

---

## Question 75 — Explain Electrical First Aid to an Examiner
An examiner asks:

> **“A person has received an electric shock. Explain what you do.”**

Give a strong, safe answer. **(15 marks)**

### Answer

A strong answer is:

### 1. Protect Yourself First

Do not touch the casualty while they are still in contact with electricity.

Make the scene safe.

If possible:

- switch off;
- isolate;
- disconnect the supply safely.

### 2. Activate Help

Call or instruct someone to contact emergency medical services.

Obtain an AED if available.

### 3. Assess the Casualty

Once it is safe to approach:

- check responsiveness;
- check normal breathing;
- identify major life-threatening injury.

### 4. If Not Breathing Normally

Begin CPR according to current training.

Adult CPR commonly uses:

\[
\boxed{100-120\text{ compressions/min}}
\]

and, for a trained rescuer:

\[
\boxed{30:2}
\]

compression-to-breath cycles.

### 5. Use AED

Turn on the AED and follow its instructions.

Ensure nobody touches the casualty during rhythm analysis or shock delivery.

### 6. If Breathing

Maintain the airway.

Monitor the casualty continuously.

Use an appropriate recovery position where suitable and where trauma does not make movement unsafe.

### 7. Treat Burns/Injuries

Electrical burns can hide deeper injury.

Cool burns appropriately and arrange medical assessment.

Also consider:

- falls;
- fractures;
- head injury;
- spinal injury.

### 8. Continue Monitoring

The casualty can deteriorate even after appearing to recover.

The key sequence is:

\[
\boxed{\text{make safe}\rightarrow\text{call for help}\rightarrow\text{assess}\rightarrow\text{CPR/AED if required}\rightarrow\text{monitor}}
\]

---

## Question 76 — Explain Measuring Instruments to an Examiner
An examiner asks:

> **“Name the main instruments you use when testing an installation and tell me what each one proves.”**

Give a complete answer. **(15 marks)**

### Answer

### Two-Pole Voltage Detector

Used to:

- identify voltage;
- prove a circuit dead.

Used with a proving unit.

### Low-Resistance Continuity Tester

Used for:

- CPC continuity;
- bonding;
- \(R_1+R_2\);
- ring continuity.

### Insulation-Resistance Tester

Used to verify insulation between conductors at an appropriate DC test voltage.

### Earth-Fault Loop Impedance Tester

Used to determine:

- \(Z_e\);
- \(Z_s\)

where live measurement is necessary.

### RCD Tester

Used to verify:

- RCD operation;
- trip time/current response according to the applicable test method.

### Clamp Meter

Used to measure current without opening the conductor.

Can assist with:

- load measurement;
- phase balancing;
- leakage-current investigation.

### Phase-Sequence Meter

Used to confirm phase order in a three-phase system.

### Earth-Electrode Tester

Used to determine earth-electrode resistance using a suitable method.

### Multimeter

Useful for:

- voltage;
- resistance;
- current;
- frequency;
- basic diagnostics.

However, a multimeter does not replace specialized installation-test instruments where a specified test method is required.

---

# Step 7 Summary

By the end of Step 7, the student should be able to:

- define connected load;
- define maximum demand;
- calculate demand factor;
- define diversity factor;
- calculate diversity factor;
- explain why diversity exists;
- define utilization factor;
- distinguish demand, diversity and utilization factors;
- calculate single-phase and three-phase current from maximum demand;
- define protection selectivity/discrimination;
- distinguish total and partial selectivity;
- explain time and current selectivity;
- explain RCD selectivity;
- understand why ratings alone do not prove discrimination;
- identify and use voltmeters, ammeters and ohmmeters;
- explain multimeter and clamp-meter use;
- explain continuity, insulation, loop, RCD, phase-sequence and earth-electrode test instruments;
- explain accuracy, resolution and calibration;
- understand instrument CAT ratings;
- explain factors affecting electric-shock severity;
- explain wet-condition hazards;
- define touch voltage and step potential;
- apply safe electrical-work principles;
- identify electrical-fire causes;
- explain emergency response to electric shock;
- explain CPR/AED principles;
- explain why electrical burns require medical assessment;
- select the correct instrument for a test;
- and answer integrated oral questions on diversity, selectivity, instrumentation and first aid.

---

# First-Aid Reference Summary

Current Red Cross guidance emphasizes:

- scene safety first;
- do not touch a casualty who remains in contact with electrical current;
- turn off the electrical source where possible;
- call emergency medical services;
- for an unresponsive person not breathing normally or only gasping, begin CPR and use an AED;
- adult chest-compression rate:

\[
\boxed{100-120/min}
\]

- common trained-rescuer cycle:

\[
\boxed{30:2}
\]

- use an AED as soon as available;
- electrical burns may conceal serious internal injury;
- cool burns with clean cool running water where appropriate;
- electrical-burn casualties should receive medical evaluation.

Formal first-aid/CPR/AED training and current local emergency guidance should always take precedence over memorized notes.

---

# Step 7 Distinction Checklist

You should now be able to:

1. distinguish connected load, maximum demand, demand factor, diversity factor and utilization factor;
2. write each ratio in words before calculating;
3. give the formal BS 7671 discrimination/selectivity definition;
4. explain why breaker ratings alone do not prove selectivity;
5. choose a test instrument based on the quantity and test purpose;
6. explain why current inputs on a multimeter can be dangerous across a voltage source;
7. give the formal definition of electric shock;
8. explain how voltage, body resistance, path and duration affect shock severity;
9. explain first aid beginning with scene/electrical safety;
10. distinguish CPR/AED response from burn treatment and trauma assessment;
11. answer integrated oral questions without mixing technical, instrument and safety concepts.

**End of Strengthened Step 7**
