# EPRA C2 & C1 Self-Study Question Bank

## Step 2 — Cable Selection, Current-Carrying Capacity, Correction Factors, Protective Devices and Voltage Drop — Strengthened Distinction Edition

> **Purpose of this step:**  
> Step 2 develops the installation-design skills that follow directly from Step 1. The aim is not merely to memorize cable sizes or breaker ratings, but to understand the complete design sequence:
>
> \[
> \text{Load} \rightarrow I_B \rightarrow I_N \rightarrow \text{installation conditions} \rightarrow I_t/I_Z \rightarrow \text{cable size} \rightarrow \text{voltage-drop check}
> \]
>
> The questions combine short-answer, explanation, calculation, multiple-choice, oral-interview and integrated design scenarios.

---

# Strengthened-Edition Answer Method

This strengthened Step 2 keeps the original question bank but upgrades the answer standard.

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


# Regulatory and Reference Note

This step uses the **BS 7671:2018+A2:2022 Brown Book together with the Amendment 3:2024 supplement** where BS 7671 examples are required, because that is the framework used by the study material.

The important rule for study is:

> **Use regulation, table and appendix numbers as the primary reference. Page numbers are edition-specific and can change between printings or amendments.**

Where a numerical value is taken from BS 7671, the answer identifies:

- the relevant regulation/table/appendix;
- what that source contains;
- the particular value selected;
- why it applies;
- and how it enters the calculation.

The key BS 7671 references used in this step include:

- **Regulation 433.1.1** — coordination of design current, protective device and conductor current-carrying capacity;
- **Appendix 4** — current-carrying capacity and voltage drop for cables;
- **Table 4B1** — ambient-air temperature rating factors \(C_a\);
- **Table 4C1** — grouping rating factors \(C_g\);
- **Table 52.2** — derating factors for cable surrounded by thermal insulation over short lengths;
- **Table 4D5** — current-carrying capacity and voltage-drop data for 70 °C thermoplastic insulated and sheathed flat cable with protective conductor;
- **Table 4Ab** — conventional voltage-drop limits;
- **Regulation 525** — voltage drop in consumers’ installations.

---

# Section A — The Cable-Design Sequence

## Question 1 — Define \(I_B\), \(I_N\), \(I_Z\) and \(I_t\)  
**Define each of the following symbols used in cable design:**

**(a)** \(I_B\)  
**(b)** \(I_N\)  
**(c)** \(I_Z\)  
**(d)** \(I_t\)  

**(8 marks)**

### Answer

### (a) \(I_B\) — Design Current

### Formal BS 7671 definition

The uploaded Part 2 defines **Design current (of a circuit)** as:

> **“The magnitude of the current (rms value for a.c.) to be carried by the circuit in normal service.”**

So \(I_B\) is not merely “the breaker current” or “the cable current.” It is the load current the circuit is designed to carry in normal service.

For a simple single-phase resistive load:

\[
I_B=\frac{P}{V}
\]

---

### (b) \(I_N\) — Rated or Nominal Current of the Protective Device

\(I_N\) is the **rated current or current setting of the protective device** protecting the circuit against overload.

Examples include:

- 16 A MCB;
- 20 A MCB;
- 32 A MCB;
- a suitably rated fuse;
- an RCBO with a specified overcurrent rating.

If a circuit breaker is marked 32 A, then:

\[
I_N=32A
\]

---

### (c) \(I_Z\) — Current-Carrying Capacity Under the Actual Installation Conditions

\(I_Z\) is the **continuous current-carrying capacity of the cable under the particular conditions in which it is actually installed**.

It must account for factors such as:

- ambient temperature;
- grouping with other loaded circuits;
- thermal insulation;
- installation method;
- soil conditions for buried cables;
- and other applicable environmental or installation conditions.

---

### (d) \(I_t\) — Tabulated Current-Carrying Capacity

\(I_t\) is the **current-carrying capacity obtained from the appropriate BS 7671 Appendix 4 table under the reference conditions represented by that table**.

The table value may need to be adjusted to account for the actual installation conditions.

Therefore:

\[
\boxed{I_t\neq I_Z\text{ automatically}}
\]

unless no relevant derating is necessary.

---

## Question 2 — State the Fundamental Design Relationship  
**State the basic relationship that should normally exist between design current, protective-device rating and cable current-carrying capacity where overload protection is required. (3 marks)**

### Answer

The relationship is:

\[
\boxed{I_B\leq I_N\leq I_Z}
\]

This means:

1. the protective device must not normally be rated below the design current of the circuit;
2. the cable must have sufficient current-carrying capacity for the rating of the protective device.

### BS 7671 Reference

**Regulation 433.1.1** gives the operating conditions for a device protecting a conductor against overload.

The first coordination condition is:

\[
I_B\leq I_N\leq I_Z
\]

A further protective-device operating condition also has to be satisfied:

\[
I_2\leq1.45I_Z
\]

where \(I_2\) is the current that causes effective operation of the protective device within the conventional time.

---

## Question 3 — Why Must \(I_B\leq I_N\)?  
**Explain why the design current should not normally exceed the rating of the overload protective device. (3 marks)**

### Answer

If:

\[
I_B>I_N
\]

the circuit is designed to draw more current in normal operation than the protective device is intended to carry.

The result may be:

- nuisance operation of the protective device;
- repeated interruption of a healthy load;
- overheating of a fuse element;
- unreliable operation of the installation.

For example, if a load normally requires 18 A but is protected by a 10 A device, the protective device is undersized for the intended load.

Therefore:

\[
\boxed{I_N\geq I_B}
\]

is normally required.

---

## Question 4 — Why Must \(I_N\leq I_Z\)?  
**Explain why a protective device should not normally have a rated current greater than the cable’s current-carrying capacity. (4 marks)**

### Answer

The cable must be protected against excessive current.

If:

\[
I_N>I_Z
\]

the protective device may permit a current greater than the cable can safely carry for too long.

This can cause:

- excessive conductor temperature;
- deterioration of insulation;
- damage to terminations;
- accelerated ageing;
- risk of fire.

Therefore, the cable should normally be capable of carrying at least the rated current of the protective device:

\[
\boxed{I_N\leq I_Z}
\]

The protective device should operate before the cable is exposed to damaging overload conditions.

---

## Question 5 — Identify an Incorrect Design  
A circuit has:

\[
I_B=28A,\qquad I_N=25A,\qquad I_Z=34A
\]

Is the basic design relationship satisfied? Explain. **(4 marks)**

### Answer

The required relationship is:

\[
I_B\leq I_N\leq I_Z
\]

Substitute:

\[
28\leq25\leq34
\]

The first part is false because:

\[
28A>25A
\]

Therefore:

\[
\boxed{\text{The design is not satisfactory.}}
\]

The protective device is rated below the circuit design current and may operate during normal intended loading.

---

## Question 6 — Identify a Correct Design  
A circuit has:

\[
I_B=21A,\qquad I_N=25A,\qquad I_Z=31A
\]

Determine whether the basic relationship is satisfied. **(3 marks)**

### Answer

Check:

\[
21\leq25\leq31
\]

Both inequalities are true.

Therefore:

\[
\boxed{I_B\leq I_N\leq I_Z}
\]

is satisfied.

This is only one part of the complete circuit design. Other checks such as voltage drop, fault protection, disconnection time and installation conditions may still be required.

---

## Question 7 — Correct Order of Design  
Arrange the following in the correct basic sequence:

- determine cable size;
- determine design current;
- select protective device;
- check voltage drop.

**(4 marks)**

### Answer

The correct order is:

1. **Determine the design current \(I_B\).**
2. **Select a suitable protective device \(I_N\).**
3. **Determine the required cable current-carrying capacity and select a cable size.**
4. **Check voltage drop.**

A more complete design process also includes checks for:

- fault protection;
- thermal withstand;
- disconnection time;
- mechanical suitability;
- environmental conditions;
- and any special installation requirements.

---

## Question 8 — Why Cable Size Cannot Be Chosen from Load Current Alone  
**Explain why an installer should not simply calculate the load current and immediately choose a cable from a current-rating table. (6 marks)**

### Answer

The design current is only the starting point.

The safe cable size also depends on:

- the protective-device rating;
- the cable type and insulation temperature rating;
- the installation/reference method;
- ambient temperature;
- grouping with other circuits;
- contact with or enclosure in thermal insulation;
- cable length and voltage drop;
- mechanical conditions;
- environmental conditions;
- fault-current requirements;
- and, for buried cables, ground conditions.

A cable that can carry a particular current when clipped directly to a wall may **not** be able to carry the same current when:

- surrounded by thermal insulation;
- grouped with several loaded circuits;
- installed in a hot location;
- or enclosed in a less favourable installation method.

Therefore cable selection is a **design process**, not a single table lookup.

---

# Section B — Cable Types and Installation Conditions

## Question 9 — Factors Affecting Cable-Type Selection  
**State six factors that should be considered when selecting a type of cable for an installation. (6 marks)**

### Answer

Any six suitable factors include:

1. operating voltage;
2. expected load current;
3. environmental temperature;
4. presence of water or moisture;
5. mechanical damage risk;
6. exposure to sunlight or ultraviolet radiation;
7. method of installation;
8. fire-performance requirements;
9. chemical or corrosive environment;
10. flexibility requirements;
11. burial underground;
12. thermal insulation;
13. grouping;
14. required conductor material;
15. required number of cores;
16. protective-conductor arrangement.

The selected cable must be suitable both **electrically and physically** for the installation.

---

## Question 10 — Twin-and-Earth Cable  
**Give four typical characteristics or uses of flat thermoplastic insulated and sheathed cable with protective conductor, commonly called twin-and-earth. (4 marks)**

### Answer

Typical characteristics include:

- it contains insulated line and neutral conductors together with a protective conductor;
- it is widely used for fixed wiring in buildings;
- it can be used for many domestic lighting and power circuits where the environment is suitable;
- it is available in a range of conductor cross-sectional areas;
- it should be installed according to an appropriate wiring method;
- its current rating depends strongly on how it is installed.

It should not be assumed to be suitable for every environment merely because its conductor size is electrically adequate.

---

## Question 11 — Singles in Conduit or Trunking  
**Why are single-insulated conductors normally installed inside a suitable enclosure such as conduit or trunking? (4 marks)**

### Answer

Single-insulated conductors do not have the additional overall sheath provided by many multicore cables.

A suitable enclosure can provide:

- mechanical protection;
- containment;
- support;
- protection from external influences;
- separation and organization of circuits;
- and a defined wiring system.

The enclosure and conductor combination must still be suitable for:

- temperature;
- cable fill;
- grouping;
- earthing requirements;
- and the installation environment.

---

## Question 12 — Mechanical Damage  
A cable route passes through an area where it may be struck by tools or equipment.

**Explain why current-carrying capacity alone is not enough to justify the cable choice. (4 marks)**

### Answer

A cable can be electrically large enough but mechanically unsuitable.

If there is significant risk of physical damage, the wiring system may require:

- a more robust cable construction;
- conduit;
- trunking;
- armouring;
- mechanical guards;
- or relocation to a protected route.

Cable selection must therefore consider **external influences** as well as current rating.

---

## Question 13 — What Is a Reference Method?  
**Explain what is meant by a cable installation reference method. (4 marks)**

### Answer

A reference method is a standardized installation condition used for determining a cable’s current-carrying capacity.

Different installation arrangements dissipate heat differently.

For example, a cable:

- clipped directly to a surface;
- enclosed in conduit in an insulated wall;
- surrounded by thermal insulation;
- or buried in the ground

will not necessarily have the same current-carrying capacity.

BS 7671 Appendix 4 uses reference methods to link the physical installation arrangement to the correct current-rating table or column.

### BS 7671 Reference

**Appendix 4, Tables 4A1 and 4A2** provide schedules of installation methods and their relationship to reference methods used for cable current-carrying capacity.

---

## Question 14 — Why Installation Method Changes Cable Rating  
**Explain why the same 4 mm² copper cable can have different current-carrying capacities under different installation methods. (5 marks)**

### Answer

The limiting factor is usually conductor temperature.

Electrical current produces heat in a conductor approximately according to:

\[
P_{\text{loss}}=I^2R
\]

The cable must be able to lose that heat to its surroundings.

A cable installed where heat can escape easily can normally carry more current than the same cable where heat is trapped.

Therefore:

- clipped direct in free air or on a surface may allow better heat dissipation;
- conduit, trunking or insulation may reduce heat dissipation;
- grouping causes neighbouring cables to heat one another.

The conductor size has not changed, but the **thermal environment has changed**, so the allowable current changes.

---

## Question 15 — Thermal Insulation  
**Explain why thermal insulation surrounding a cable may require the cable to be derated. (4 marks)**

### Answer

Thermal insulation is designed to resist heat transfer.

When a cable is surrounded by insulation:

- heat generated by current flow cannot escape as easily;
- conductor temperature rises more quickly;
- the insulation system of the cable may approach or exceed its permitted operating temperature.

The current-carrying capacity must therefore be reduced unless the selected tabulated installation method already accounts for that thermal condition.

---

## Question 16 — Grouping of Cables  
**Explain why several loaded circuits grouped closely together may require a grouping factor. (4 marks)**

### Answer

Every loaded cable produces heat.

When several loaded cables are grouped closely together:

- each cable heats its neighbours;
- heat dissipation becomes less effective;
- the group operates hotter than a single isolated cable.

The allowable current per cable must therefore often be reduced.

This is represented by a grouping factor:

\[
C_g
\]

A smaller \(C_g\) means a greater derating effect.

---

# Section C — Correction Factors

## Question 17 — Define \(C_a\), \(C_g\) and \(C_i\)  
**State what each of the following correction factors represents:**

**(a)** \(C_a\)  
**(b)** \(C_g\)  
**(c)** \(C_i\)  

**(6 marks)**

### Answer

### \(C_a\)

Ambient-temperature rating factor.

It accounts for ambient temperature different from the reference temperature on which the cable table is based.

---

### \(C_g\)

Grouping rating factor.

It accounts for the heating effect of several loaded circuits or multicore cables installed together.

---

### \(C_i\)

Thermal-insulation factor.

It accounts for the reduction in heat dissipation where a cable is surrounded by thermal insulation, where a separate factor is applicable.

---

## Question 18 — Ambient Temperature Factor at 35 °C  
A 70 °C thermoplastic-insulated cable is installed in ambient air at 35 °C.

State the applicable \(C_a\) value from BS 7671. **(3 marks)**

### Answer

For 70 °C thermoplastic cable at an ambient-air temperature of 35 °C:

\[
\boxed{C_a=0.94}
\]

### BS 7671 Reference

**Appendix 4, Table 4B1** gives ambient-air temperature rating factors.

For the **70 °C thermoplastic** column:

- reference ambient temperature = 30 °C;
- at 35 °C:

\[
C_a=0.94
\]

The factor reduces the usable current-carrying capacity because the surrounding air is hotter than the reference condition.

---

## Question 19 — Ambient Temperature Factor at 40 °C  
A 70 °C thermoplastic-insulated cable is installed in ambient air at 40 °C.

Determine \(C_a\). **(3 marks)**

### Answer

From BS 7671 Appendix 4 Table 4B1:

\[
\boxed{C_a=0.87}
\]

for 70 °C thermoplastic cable in 40 °C ambient air.

The higher ambient temperature leaves less thermal margin between the surroundings and the cable’s maximum operating temperature.

---

## Question 20 — Grouping Factor for Three Bunched Circuits  
Three equally loaded circuits are bunched together under an arrangement to which the “bunched in air, on a surface, embedded or enclosed” row of Table 4C1 applies.

Determine \(C_g\). **(3 marks)**

### Answer

For three circuits:

\[
\boxed{C_g=0.70}
\]

### BS 7671 Reference

**Appendix 4, Table 4C1** provides rating factors for groups of circuits or multicore cables.

For:

- arrangement: bunched/enclosed;
- number of circuits: 3;

the factor is:

\[
C_g=0.70
\]

This means the group condition substantially reduces the permissible current compared with a single isolated circuit.

---

## Question 21 — Thermal Insulation: 100 mm  
A cable of suitable size is surrounded by thermal insulation over a length of 100 mm in a situation where Table 52.2 applies.

Determine the derating factor. **(3 marks)**

### Answer

From Table 52.2:

\[
\boxed{C_i=0.78}
\]

### BS 7671 Reference

**Table 52.2 — Cable surrounded by thermal insulation**

For a length in insulation of:

\[
100\text{ mm}
\]

the derating factor is:

\[
0.78
\]

The table is intended for the specified conditions and conductor sizes within its scope.

---

## Question 22 — Thermal Insulation: 200 mm  
For the same type of application, determine the Table 52.2 factor for 200 mm of thermal insulation. **(3 marks)**

### Answer

From BS 7671 Table 52.2:

\[
\boxed{C_i=0.63}
\]

The longer insulated section causes a greater thermal restriction than 100 mm, so the factor is lower.

---

## Question 23 — Cable Surrounded for 0.5 m or More  
**What general current-carrying-capacity rule applies, in the absence of more precise information, to a single cable totally surrounded by thermal insulation for 0.5 m or more? (4 marks)**

### Answer

In the absence of more precise information, the current-carrying capacity is taken as:

\[
\boxed{0.5}
\]

times the appropriate clipped-direct/open current-carrying capacity.

In other words, the cable may effectively be limited to approximately 50% of the relevant reference capacity.

### Important Design Point

Do **not** apply a separate insulation factor blindly if the current-rating table or installation method already accounts for the thermal-insulation condition. Doing so could incorrectly derate the cable twice.

---

## Question 24 — Calculate Required \(I_t\) with One Correction Factor  
A circuit is protected by a 32 A MCB.

The only applicable correction factor is:

\[
C_a=0.87
\]

Determine the minimum tabulated cable capacity \(I_t\). **(4 marks)**

### Answer

Use:

\[
I_t\geq\frac{I_N}{C_a}
\]

Substitute:

\[
I_t\geq\frac{32}{0.87}
\]

\[
I_t\geq36.78A
\]

Therefore:

\[
\boxed{I_t\geq36.8A}
\]

A cable-table entry must be chosen that is **equal to or greater than 36.8 A** for the applicable cable type and installation method.

---

## Question 25 — Calculate Required \(I_t\) with Two Correction Factors  
A circuit has:

\[
I_N=32A,\qquad C_a=0.94,\qquad C_i=0.78
\]

Determine the minimum required \(I_t\). **(5 marks)**

### Answer

Where the factors apply together:

\[
I_t\geq\frac{I_N}{C_aC_i}
\]

Substitute:

\[
I_t\geq\frac{32}{0.94\times0.78}
\]

First calculate:

\[
0.94\times0.78=0.7332
\]

Therefore:

\[
I_t\geq\frac{32}{0.7332}
\]

\[
I_t\geq43.64A
\]

Hence:

\[
\boxed{I_t\geq43.7A}
\]

The selected tabulated cable rating must be at least this value.

---

## Question 26 — Why Correction Factors Increase the Required Tabulated Rating  
In Question 25, the protective device is only 32 A, yet the required \(I_t\) is approximately 43.7 A.

**Explain why. (5 marks)**

### Answer

The 32 A protective device has not changed.

The installation conditions make it harder for the cable to lose heat.

The factors:

\[
C_a=0.94
\]

and:

\[
C_i=0.78
\]

reduce the current the cable can safely carry in service.

Therefore, a cable that has a substantially higher rating under standard tabulated conditions is needed so that, after derating, its installed current-carrying capacity is still adequate.

Conceptually:

\[
I_Z=I_t\times C_a\times C_i
\]

If:

\[
I_t=43.7A
\]

then approximately:

\[
I_Z=43.7\times0.94\times0.78
\]

\[
I_Z\approx32A
\]

Thus the larger tabulated rating compensates for the unfavourable installation conditions.

---

# Section D — Cable Selection from BS 7671 Tables

## Question 27 — Read Table 4D5  
For 70 °C thermoplastic insulated and sheathed flat cable with protective conductor, state the clipped-direct current-carrying capacity and voltage-drop value for a 6 mm² conductor using Table 4D5. **(4 marks)**

### Answer

From **BS 7671 Appendix 4, Table 4D5**:

For:

\[
6\text{ mm}^2
\]

under **Reference Method C — clipped direct**:

\[
\boxed{I_t=47A}
\]

The voltage-drop value is:

\[
\boxed{7.3\text{ mV/A/m}}
\]

These are different pieces of information from the same cable-data table:

- 47 A is a current-carrying-capacity value for the stated method;
- 7.3 mV/A/m is the tabulated voltage-drop value used in voltage-drop calculations.

---

## Question 28 — Select a Cable from Table 4D5  
A calculation has established that the minimum required tabulated rating is:

\[
I_t=43.7A
\]

The circuit uses the cable type covered by Table 4D5 and is clipped direct.

Select the smallest suitable conductor from the following clipped-direct ratings:

- 4 mm² = 37 A
- 6 mm² = 47 A
- 10 mm² = 64 A

**(4 marks)**

### Answer

The cable must have a tabulated rating:

\[
I_t\geq43.7A
\]

Check the values:

### 4 mm²

\[
37A<43.7A
\]

Not suitable.

### 6 mm²

\[
47A>43.7A
\]

Suitable.

Therefore the smallest suitable cable is:

\[
\boxed{6\text{ mm}^2}
\]

### BS 7671 Reference

**Appendix 4, Table 4D5**, clipped-direct/Reference Method C column.

---

## Question 29 — Why 4 mm² Fails Despite a Moderate Load  
A circuit has a design current of only 26.1 A, but the correction-factor calculation requires:

\[
I_t\geq43.7A
\]

Explain why a 4 mm² cable rated at 37 A in the relevant table is still unsuitable. **(4 marks)**

### Answer

The load current alone is not the final cable-selection criterion.

The unfavourable installation conditions reduce the cable’s usable current capacity.

The required tabulated capacity is:

\[
43.7A
\]

but the 4 mm² cable provides only:

\[
37A
\]

Since:

\[
37A<43.7A
\]

the cable is not adequate after allowing for the correction factors.

The correct comparison is with the **required tabulated current \(I_t\)**, not merely with \(I_B\).

---

## Question 30 — Complete Single-Phase Design: Design Current  
A single-phase 230 V, 6 kW water heater is to be installed.

Calculate the design current. **(3 marks)**

### Answer

For a purely resistive load:

\[
I_B=\frac{P}{V}
\]

Convert:

\[
6kW=6000W
\]

Then:

\[
I_B=\frac{6000}{230}
\]

\[
I_B=26.087A
\]

Therefore:

\[
\boxed{I_B\approx26.1A}
\]

---

## Question 31 — Complete Single-Phase Design: Protective Device  
For the water-heater circuit in Question 30, choose the next suitable standard MCB rating from:

- 20 A;
- 25 A;
- 32 A;
- 40 A.

**(3 marks)**

### Answer

The design current is:

\[
I_B=26.1A
\]

The protective device should satisfy:

\[
I_N\geq I_B
\]

Check:

- 20 A < 26.1 A — too small;
- 25 A < 26.1 A — too small;
- 32 A > 26.1 A — suitable;
- 40 A is larger than necessary for this selection stage.

Therefore:

\[
\boxed{I_N=32A}
\]

The complete cable and protection design must still confirm that the chosen cable and other protective requirements are compatible with the 32 A device.

---

## Question 32 — Complete Single-Phase Design: Correction Factors  
The water-heater cable is 70 °C thermoplastic flat cable, clipped direct, but:

- ambient air temperature = 35 °C;
- it passes through 100 mm of thermal insulation.

Determine:

**(a)** \(C_a\);  
**(b)** \(C_i\);  
**(c)** minimum \(I_t\).

**(7 marks)**

### Answer

### (a) Ambient factor

From **BS 7671 Appendix 4, Table 4B1**, for 70 °C thermoplastic at 35 °C:

\[
\boxed{C_a=0.94}
\]

### (b) Thermal-insulation factor

From **Table 52.2**, for 100 mm:

\[
\boxed{C_i=0.78}
\]

### (c) Required tabulated capacity

\[
I_t\geq\frac{I_N}{C_aC_i}
\]

\[
I_t\geq\frac{32}{0.94\times0.78}
\]

\[
I_t\geq43.64A
\]

Therefore:

\[
\boxed{I_t\geq43.7A}
\]

---

## Question 33 — Complete Single-Phase Design: Select CSA  
Using Table 4D5 clipped-direct ratings:

- 4 mm² = 37 A;
- 6 mm² = 47 A;
- 10 mm² = 64 A.

Select the minimum conductor size for Question 32. **(3 marks)**

### Answer

Required:

\[
I_t\geq43.7A
\]

4 mm²:

\[
37A<43.7A
\]

Not adequate.

6 mm²:

\[
47A>43.7A
\]

Adequate.

Therefore:

\[
\boxed{6\text{ mm}^2}
\]

is the minimum of the listed sizes satisfying the current-carrying-capacity requirement.

---

## Question 34 — Confirm the Design Relationship  
For the completed water-heater design:

\[
I_B=26.1A,\qquad I_N=32A
\]

The selected 6 mm² cable has:

\[
I_t=47A,\quad C_a=0.94,\quad C_i=0.78
\]

Calculate the approximate installed current capacity \(I_Z\) and confirm the basic coordination. **(6 marks)**

### Answer

Calculate:

\[
I_Z=I_tC_aC_i
\]

\[
I_Z=47\times0.94\times0.78
\]

\[
I_Z=34.45A
\]

Approximately:

\[
\boxed{I_Z=34.5A}
\]

Now check:

\[
I_B\leq I_N\leq I_Z
\]

\[
26.1\leq32\leq34.5
\]

Therefore:

\[
\boxed{\text{The basic overload coordination is satisfied.}}
\]

This does not remove the need for the remaining design checks, especially voltage drop and fault protection.

---

# Section E — Voltage Drop

## Question 35 — Define Voltage Drop  
**Define voltage drop in an electrical circuit. (3 marks)**

### Answer

Voltage drop is the **reduction in voltage between the supply end of a circuit and the point of utilization caused by the impedance of the conductors while current is flowing**.

For example, if:

- voltage at the distribution board = 230 V;
- voltage at the load = 224 V;

then:

\[
V_d=230-224=6V
\]

Therefore:

\[
\boxed{V_d=6V}
\]

---

## Question 36 — Factors Affecting Voltage Drop  
**State four factors that can affect circuit voltage drop. (4 marks)**

### Answer

Factors include:

1. load current;
2. cable length;
3. conductor cross-sectional area;
4. conductor material;
5. conductor operating temperature;
6. cable impedance;
7. circuit arrangement;
8. power factor in AC circuits.

In general:

- greater current increases voltage drop;
- greater length increases voltage drop;
- greater conductor cross-sectional area usually reduces voltage drop.

---

## Question 37 — Meaning of mV/A/m  
**Explain the meaning of a tabulated voltage-drop value expressed in mV/A/m. (4 marks)**

### Answer

A value in:

\[
\text{mV/A/m}
\]

represents the approximate voltage drop, in **millivolts**, for:

- each ampere of current;
- through each metre of the relevant circuit length;
- for the stated cable and circuit conditions represented by the table.

For example:

\[
7.3\text{ mV/A/m}
\]

means the cable data gives 7.3 millivolts of voltage drop per ampere per metre under the tabulated conditions.

To convert millivolts to volts, divide by:

\[
1000
\]

---

## Question 38 — Voltage-Drop Formula  
**State the basic single-phase voltage-drop formula using a tabulated mV/A/m value. (3 marks)**

### Answer

The formula is:

\[
\boxed{
V_d=
\frac{(mV/A/m)\times I_B\times L}{1000}
}
\]

where:

- \(V_d\) = voltage drop in volts;
- \(mV/A/m\) = tabulated cable voltage-drop value;
- \(I_B\) = design/load current in amperes;
- \(L\) = route length in metres;
- 1000 converts millivolts to volts.

The applicable table and formula must match the circuit and cable arrangement being designed.

---

## Question 39 — BS 7671 Conventional Voltage-Drop Limits  
For an installation supplied from a public low-voltage distribution system, state the conventional voltage-drop percentages from Table 4Ab for:

**(a)** lighting;  
**(b)** other uses.

**(4 marks)**

### Answer

From **BS 7671 Appendix 4, Table 4Ab**:

### Lighting

\[
\boxed{3\%}
\]

### Other uses

\[
\boxed{5\%}
\]

At a nominal 230 V:

Lighting:

\[
230\times0.03=6.9V
\]

\[
\boxed{6.9V}
\]

Other uses:

\[
230\times0.05=11.5V
\]

\[
\boxed{11.5V}
\]

These figures are BS 7671 conventional design values for the applicable supply arrangement. They should not be treated as universal values for every electrical standard or every special installation.

---

## Question 40 — Actual Voltage Drop of the Water-Heater Circuit  
The 6 mm² cable selected for the water-heater circuit has a tabulated voltage-drop value of:

\[
7.3\text{ mV/A/m}
\]

The design current is:

\[
26.1A
\]

and the route length is:

\[
25m
\]

Calculate the actual voltage drop. **(5 marks)**

### Answer

Use:

\[
V_d=
\frac{(mV/A/m)\times I_B\times L}{1000}
\]

Substitute:

\[
V_d=
\frac{7.3\times26.1\times25}{1000}
\]

\[
V_d=
\frac{4763.25}{1000}
\]

\[
\boxed{V_d\approx4.76V}
\]

### BS 7671 Table Source

For the stated cable type:

**Appendix 4, Table 4D5**

For:

\[
6\text{ mm}^2
\]

the tabulated voltage-drop figure used is:

\[
\boxed{7.3\text{ mV/A/m}}
\]

---

## Question 41 — Is the Water-Heater Voltage Drop Acceptable?  
The calculated voltage drop is:

\[
4.76V
\]

The circuit is a non-lighting load supplied at 230 V from the applicable public LV system.

Determine whether the voltage drop is within the BS 7671 Table 4Ab conventional limit. **(4 marks)**

### Answer

For “other uses”:

\[
V_{d,\max}=5\%
\]

At 230 V:

\[
V_{d,\max}=230\times0.05
\]

\[
V_{d,\max}=11.5V
\]

Actual:

\[
V_d=4.76V
\]

Compare:

\[
4.76V<11.5V
\]

Therefore:

\[
\boxed{\text{The voltage drop is within the stated BS 7671 conventional limit.}}
\]

---

## Question 42 — Maximum Cable Length  
A 4 mm² cable has a voltage-drop value of:

\[
11\text{ mV/A/m}
\]

A non-lighting load draws:

\[
20A
\]

from a 230 V supply.

Using a maximum voltage drop of 11.5 V, calculate the maximum cable length. **(6 marks)**

### Answer

Start with:

\[
V_d=
\frac{mV/A/m\times I_B\times L}{1000}
\]

Rearrange for \(L\):

\[
L=
\frac{V_d\times1000}{mV/A/m\times I_B}
\]

Substitute:

\[
L=
\frac{11.5\times1000}{11\times20}
\]

\[
L=
\frac{11500}{220}
\]

\[
L=52.27m
\]

Therefore:

\[
\boxed{L_{\max}\approx52.3m}
\]

### BS 7671 Table Sources

- **Table 4Ab** gives the applicable 5% conventional limit for “other uses”.
- **Table 4D5** gives:

\[
11\text{ mV/A/m}
\]

for the stated 4 mm² flat thermoplastic cable.

---

## Question 43 — Lighting-Circuit Maximum Length  
A 1 mm² flat thermoplastic cable has:

\[
44\text{ mV/A/m}
\]

A lighting circuit carries:

\[
4A
\]

at 230 V.

Using the 3% conventional voltage-drop limit, calculate the maximum route length. **(6 marks)**

### Answer

For lighting:

\[
V_{d,\max}=230\times0.03
\]

\[
V_{d,\max}=6.9V
\]

Use:

\[
L=
\frac{V_d\times1000}{mV/A/m\times I_B}
\]

\[
L=
\frac{6.9\times1000}{44\times4}
\]

\[
L=
\frac{6900}{176}
\]

\[
L=39.2045m
\]

Therefore:

\[
\boxed{L_{\max}\approx39.2m}
\]

### BS 7671 References

- **Table 4Ab** — 3% for lighting from the applicable public LV supply.
- **Table 4D5** — 44 mV/A/m for 1 mm² flat thermoplastic cable.

---

## Question 44 — Correcting Excessive Voltage Drop  
A circuit is thermally adequate but fails its voltage-drop check.

**State four possible design actions that could reduce the voltage drop. (4 marks)**

### Answer

Possible actions include:

1. increase conductor cross-sectional area;
2. reduce the cable route length;
3. relocate the distribution point closer to the load;
4. divide the load between additional circuits where appropriate;
5. reduce circuit current where the design permits;
6. redesign the distribution arrangement.

Simply installing a larger protective device does **not** solve excessive cable voltage drop and may create a protection problem.

---

## Question 45 — Why Larger Cable Reduces Voltage Drop  
**Explain why increasing conductor cross-sectional area normally reduces voltage drop. (4 marks)**

### Answer

For a conductor:

\[
R=\rho\frac{L}{A}
\]

Increasing cross-sectional area \(A\) reduces conductor resistance.

Since voltage drop depends on current and conductor impedance:

\[
V_d\approx IR
\]

for a simple resistive explanation, lower resistance results in lower voltage drop for the same current and length.

This is reflected in Table 4D5:

- 4 mm²: approximately 11 mV/A/m;
- 6 mm²: approximately 7.3 mV/A/m.

The larger conductor has the smaller voltage-drop value.

---

# Step 2 Distinction Lens — Voltage Drop

Voltage drop should never be treated as only a memorized formula.

For a single-phase circuit using tabulated \(mV/A/m\):

\[
V_d=\frac{mV/A/m\times I_B\times L}{1000}
\]

The value grows when:

- current increases;
- route length increases;
- conductor resistance increases.

It reduces when a larger conductor is selected because larger CSA generally means lower resistance.

A good calculation answer should state:

1. which table produced the \(mV/A/m\) value;
2. why that row applies to the cable type/size;
3. whether design current or another specified current is being used;
4. route length;
5. final voltage drop;
6. comparison with the stated limit.

The physical consequence of excessive voltage drop is not just “fail the table.” It can cause:

- poor appliance performance;
- weak lighting;
- reduced heater output;
- motor starting difficulty;
- excessive losses.

---

# Section F — Overcurrent, Residual-Current and Surge Protection

## Question 46 — What Does an MCB Protect Against?  
**State the main purpose of an MCB and distinguish overload from short circuit. (5 marks)**

### Answer

An MCB is an **overcurrent protective device**.

It is intended to disconnect a circuit when excessive current occurs.

### Overload

An overload is excessive current occurring in an otherwise electrically sound current path, commonly because too much load has been connected or equipment is drawing more current than intended.

### Short Circuit

A short circuit is a fault involving a very low-impedance connection between conductors at different potentials, causing a potentially very high current.

An MCB normally contains mechanisms intended to respond appropriately to both overload and high fault currents.

Its purpose includes protecting conductors against damaging overcurrent conditions when correctly selected and coordinated.

---

## Question 47 — Why Not Replace a Tripping MCB with a Larger One?  
An MCB repeatedly trips.

Someone suggests replacing the 20 A MCB with a 40 A MCB without carrying out any investigation.

**Explain why this is unsafe practice. (5 marks)**

### Answer

The repeated operation may indicate:

- overload;
- short circuit;
- equipment fault;
- cable fault;
- incorrect circuit design.

Installing a larger MCB without investigation may:

- remove the intended protection;
- allow excessive current in a cable not designed for it;
- cause conductor overheating;
- damage insulation;
- increase fire risk.

The correct procedure is to:

1. identify the cause of operation;
2. verify the load;
3. verify cable size and installation method;
4. verify the protective device;
5. test for faults;
6. redesign the circuit if necessary.

Protective-device rating must be coordinated with the cable, not chosen simply to stop nuisance tripping.

---

## Question 48 — What Does an RCD Detect?  
**Explain the operating principle of an RCD. (5 marks)**

### Answer

An RCD monitors the current flowing in the live conductors of a circuit.

In a simple single-phase circuit, it compares:

- current leaving through line;
- current returning through neutral.

Under healthy conditions, these currents should be substantially equal.

If some current flows by an unintended path, such as to Earth, the returning current is reduced.

The RCD detects the **residual or imbalance current**.

If the residual current reaches the device’s operating threshold under the required conditions, the RCD disconnects the supply.

An RCD does not automatically provide overload or short-circuit protection unless that function is combined in the device.

---

## Question 49 — MCB vs RCD  
**State four differences between an MCB and an RCD. (4 marks)**

### Answer

| MCB | RCD |
|---|---|
| Responds primarily to overcurrent | Responds to residual-current imbalance |
| Protects circuit conductors against overload/short circuit when correctly selected | Provides residual-current protection, including additional shock protection in relevant applications |
| Rated primarily by overcurrent characteristics such as current rating and trip curve | Includes residual operating-current rating such as \(I_{\Delta n}\) |
| Does not detect small earth-leakage imbalance simply because it is an MCB | Detects imbalance between live conductors |

A complete installation may require both functions.

---

## Question 50 — What Is an RCBO?  
**Define an RCBO and explain its advantage. (4 marks)**

### Answer

An RCBO is a:

**Residual Current operated Circuit-Breaker with Overcurrent protection.**

It combines:

- residual-current protection;
- overload protection;
- short-circuit protection

in one device, subject to its design and ratings.

An advantage is that individual circuits can have both types of protection from a single device.

This can improve circuit separation because a residual-current fault on one RCBO-protected circuit does not necessarily disconnect every other circuit.

---

## Question 51 — Residual Current Does Not Replace Overcurrent Protection  
**Explain why fitting an RCD alone does not remove the need for suitable overcurrent protection. (4 marks)**

### Answer

An RCD monitors current imbalance.

It is not, merely by being an RCD, intended to provide the conductor overload and short-circuit protection required of an overcurrent protective device.

A circuit still requires suitable protection against excessive line current.

This may be provided by:

- a fuse;
- an MCB;
- another suitable overcurrent device;
- or a combined RCBO.

Therefore:

\[
\boxed{\text{Residual-current protection and overcurrent protection perform different functions.}}
\]

---

## Question 52 — What Is an SPD?  
**Define a surge protective device and explain its purpose. (5 marks)**

### Answer

An SPD is a **surge protective device**.

It is intended to limit transient overvoltages and divert surge current so that excessive transient voltage is less likely to damage equipment.

Possible sources of transient overvoltage include:

- lightning-related effects;
- switching events;
- disturbances on the supply system.

Under normal voltage conditions an SPD has a high-impedance state or otherwise does not conduct significant surge current.

During a surge, its protective components provide a low-impedance path for the transient energy.

After the event, the SPD returns to its normal state if it remains serviceable.

---

## Question 53 — Why SPD Connections Matter  
**Explain why the conductors connecting an SPD should be arranged correctly and kept appropriately short in accordance with the device and installation requirements. (4 marks)**

### Answer

A surge contains a very rapid change in current.

Connection conductors have impedance, and excessive conductor length can increase the voltage developed during surge-current flow.

Poorly arranged or excessively long connections can therefore reduce the effectiveness of the SPD.

The installation should follow:

- BS 7671 requirements;
- the SPD manufacturer’s instructions;
- correct conductor routing;
- correct conductor sizing;
- and the specified connection arrangement.

---

## Question 54 — Protection-Device Scenario  
A circuit has all of the following requirements:

- overload protection;
- short-circuit protection;
- residual-current protection.

Which of the following single devices can provide all three functions when correctly selected?

A. RCD only  
B. SPD only  
C. RCBO  
D. Isolator

**(2 marks)**

### Answer

\[
\boxed{\text{C. RCBO}}
\]

An RCBO combines:

- residual-current operation;
- overload protection;
- short-circuit protection.

An RCD alone does not inherently provide all required overcurrent protection.

An SPD limits transient overvoltages.

An isolator provides isolation but is not selected as the complete protective device for the listed functions.

---

# Section G — Integrated Design Questions

## Question 55 — Full Single-Phase Cable Design  
A 6 kW, 230 V single-phase water heater is to be supplied using 70 °C thermoplastic flat cable with protective conductor.

The cable:

- is clipped direct for most of its route;
- is 25 m long;
- passes through 100 mm of thermal insulation;
- is installed in 35 °C ambient air.

A suitable MCB is to be selected.

Using the following BS 7671 data:

- Table 4B1: \(C_a=0.94\) at 35 °C for 70 °C thermoplastic;
- Table 52.2: \(C_i=0.78\) for 100 mm insulation;
- Table 4D5, clipped direct:
  - 4 mm² = 37 A, 11 mV/A/m;
  - 6 mm² = 47 A, 7.3 mV/A/m;
- Table 4Ab: 5% voltage-drop limit for applicable non-lighting use from a public LV system.

Determine:

**(a)** \(I_B\);  
**(b)** suitable \(I_N\);  
**(c)** minimum required \(I_t\);  
**(d)** minimum cable size from the listed data;  
**(e)** actual voltage drop;  
**(f)** whether the voltage drop is acceptable;  
**(g)** whether \(I_B\leq I_N\leq I_Z\) is satisfied.

**(20 marks)**

### Answer

### (a) Design current

\[
I_B=\frac{P}{V}
\]

\[
I_B=\frac{6000}{230}
\]

\[
\boxed{I_B=26.1A}
\]

---

### (b) Protective device

The next listed standard rating above 26.1 A is:

\[
\boxed{I_N=32A}
\]

---

### (c) Required tabulated current

\[
I_t\geq\frac{I_N}{C_aC_i}
\]

\[
I_t\geq\frac{32}{0.94\times0.78}
\]

\[
I_t\geq43.64A
\]

Therefore:

\[
\boxed{I_t\geq43.7A}
\]

---

### (d) Select cable

4 mm²:

\[
37A<43.7A
\]

Not adequate.

6 mm²:

\[
47A>43.7A
\]

Therefore:

\[
\boxed{6\text{ mm}^2}
\]

---

### (e) Actual voltage drop

For 6 mm²:

\[
7.3\text{ mV/A/m}
\]

Use:

\[
V_d=
\frac{7.3\times26.1\times25}{1000}
\]

\[
V_d=4.76V
\]

Therefore:

\[
\boxed{V_d\approx4.76V}
\]

---

### (f) Check voltage-drop limit

From Table 4Ab:

\[
5\%\times230V=11.5V
\]

Compare:

\[
4.76V<11.5V
\]

Therefore:

\[
\boxed{\text{Voltage drop is acceptable under the stated BS 7671 criterion.}}
\]

---

### (g) Calculate \(I_Z\) and check coordination

\[
I_Z=I_tC_aC_i
\]

\[
I_Z=47\times0.94\times0.78
\]

\[
I_Z=34.45A
\]

Approximately:

\[
\boxed{I_Z=34.5A}
\]

Check:

\[
26.1\leq32\leq34.5
\]

Therefore:

\[
\boxed{I_B\leq I_N\leq I_Z}
\]

is satisfied.

### Final Design Result

- \(I_B=26.1A\)
- \(I_N=32A\)
- minimum required \(I_t=43.7A\)
- selected conductor = 6 mm²
- actual voltage drop ≈ 4.76 V
- voltage drop acceptable
- basic overload coordination satisfied.

A real installation would still require all other applicable checks, including fault protection, earthing, disconnection and suitability of equipment.

---

## Question 56 — Faulty Cable Selection  
A 32 A circuit breaker protects a cable whose installed current-carrying capacity is only 24 A.

The installer argues:

> “The normal load is only 20 A, so the cable is safe.”

Evaluate the statement. **(6 marks)**

### Answer

The design current is:

\[
I_B=20A
\]

The protective-device rating is:

\[
I_N=32A
\]

The cable installed capacity is:

\[
I_Z=24A
\]

Check:

\[
I_B\leq I_N\leq I_Z
\]

\[
20\leq32\leq24
\]

The second inequality is false:

\[
32A>24A
\]

Therefore:

\[
\boxed{\text{The arrangement does not satisfy the basic overload coordination requirement.}}
\]

The problem is that the protective device may allow a prolonged overload above the cable’s safe capacity before operating.

The fact that the normal load is 20 A does not guarantee that:

- additional load will never be connected;
- an overload will never occur;
- the protective device will protect the cable correctly.

The cable and protective device must be properly coordinated.

---

## Question 57 — Combined Grouping and Ambient Temperature  
A circuit is to be protected by a 25 A protective device.

The cable is 70 °C thermoplastic and installed:

- in ambient air at 40 °C;
- bunched with two other equally loaded circuits under the Table 4C1 bunched/enclosed arrangement.

Use:

\[
C_a=0.87
\]

and:

\[
C_g=0.70
\]

Calculate the minimum required tabulated current \(I_t\). **(6 marks)**

### Answer

Use:

\[
I_t\geq\frac{I_N}{C_aC_g}
\]

Substitute:

\[
I_t\geq\frac{25}{0.87\times0.70}
\]

\[
0.87\times0.70=0.609
\]

Therefore:

\[
I_t\geq\frac{25}{0.609}
\]

\[
I_t\geq41.05A
\]

Hence:

\[
\boxed{I_t\geq41.1A}
\]

This shows how two moderate derating factors can combine to create a substantial increase in the required tabulated cable capacity.

---

## Question 58 — Oral Interview: Explain Cable Sizing from Beginning to End  
An EPRA examiner asks:

> **“Explain how you would select the cable and protective device for a new single-phase fixed load.”**

Give a complete structured answer. **(12 marks)**

### Answer

A strong answer would follow a clear sequence.

### 1. Establish the Load

Identify:

- load power;
- supply voltage;
- load characteristics;
- duty;
- starting current where relevant;
- power factor where relevant.

Calculate the design current:

\[
I_B
\]

For a simple resistive single-phase load:

\[
I_B=\frac{P}{V}
\]

---

### 2. Select a Suitable Protective Device

Choose a device with a rated current:

\[
I_N
\]

that is suitable for the circuit and normally satisfies:

\[
I_B\leq I_N
\]

The device type must also be appropriate for:

- overload;
- short-circuit conditions;
- required residual-current protection;
- fault current;
- load characteristics;
- discrimination/selectivity where required.

---

### 3. Identify Cable Type and Installation Method

Determine:

- conductor material;
- insulation type;
- number of conductors;
- reference method;
- mechanical environment;
- moisture;
- fire conditions;
- burial;
- containment;
- thermal insulation.

---

### 4. Determine Correction Factors

Identify the applicable factors, for example:

- \(C_a\) — ambient temperature;
- \(C_g\) — grouping;
- \(C_i\) — thermal insulation;
- other factors for buried cables or special conditions where applicable.

Calculate the minimum required tabulated current:

\[
I_t
\]

using the appropriate design method.

---

### 5. Select Conductor Cross-Sectional Area

Use the correct BS 7671 Appendix 4 cable table for:

- cable type;
- conductor material;
- insulation;
- installation/reference method.

Select a cable whose tabulated capacity is at least the calculated requirement.

Confirm the installed cable capacity is adequately coordinated with the protective device:

\[
I_B\leq I_N\leq I_Z
\]

where applicable.

---

### 6. Check Voltage Drop

Obtain the appropriate cable voltage-drop value.

Calculate:

\[
V_d=
\frac{mV/A/m\times I_B\times L}{1000}
\]

or the appropriate formula for the particular circuit.

Compare the result with the applicable design limit.

If excessive, consider:

- increasing cable size;
- reducing route length;
- changing the distribution arrangement.

---

### 7. Check Fault Protection and Earthing

Verify:

- earth-fault loop impedance;
- required disconnection;
- protective conductor;
- fault-current withstand;
- protective-device breaking capacity;
- earthing and bonding.

These will be studied in greater depth in the later earthing and protection steps.

---

### 8. Confirm Practical Suitability

Finally confirm:

- cable routing;
- mechanical protection;
- terminations;
- accessibility;
- identification;
- environmental suitability;
- manufacturer requirements;
- applicable Kenyan regulations and standards;
- testing and commissioning requirements.

The essential principle is:

\[
\boxed{\text{A cable is not selected from current alone.}}
\]

It must be suitable for the load, protective device, installation conditions, voltage drop and fault conditions.

---

# Step 2 Summary

By the end of Step 2, the student should be able to:

- define \(I_B\), \(I_N\), \(I_Z\) and \(I_t\);
- explain the relationship:

\[
I_B\leq I_N\leq I_Z
\]

- explain why overload protection must be coordinated with cable capacity;
- identify cable-selection factors;
- explain installation reference methods;
- explain ambient-temperature, grouping and thermal-insulation derating;
- use \(C_a\), \(C_g\) and \(C_i\);
- determine a minimum required \(I_t\);
- use Table 4D5 data correctly;
- select a conductor size from a required tabulated current;
- explain mV/A/m;
- calculate actual voltage drop;
- calculate maximum circuit length from a voltage-drop limit;
- distinguish MCB, RCD, RCBO and SPD functions;
- reject unsafe “just fit a bigger breaker” reasoning;
- and carry out a complete basic single-phase cable-design sequence.

---

# BS 7671 Reference Summary for Step 2

## Regulation 433.1.1 — Overload Protection Coordination

Key relationship:

\[
\boxed{I_B\leq I_N\leq I_Z}
\]

and the protective-device operating requirement involving:

\[
I_2\leq1.45I_Z
\]

---

## Appendix 4 — Cable Current-Carrying Capacity and Voltage Drop

Appendix 4 contains:

- installation/reference methods;
- current-carrying-capacity tables;
- correction/rating factors;
- voltage-drop data;
- supporting cable-design information.

---

## Table 4B1 — Ambient-Air Temperature Factor \(C_a\)

For **70 °C thermoplastic cable**:

| Ambient air temperature | \(C_a\) |
|---:|---:|
| 30 °C | 1.00 |
| 35 °C | 0.94 |
| 40 °C | 0.87 |
| 45 °C | 0.79 |
| 50 °C | 0.71 |
| 55 °C | 0.61 |
| 60 °C | 0.50 |

Use the column appropriate to the cable insulation system.

---

## Table 4C1 — Grouping Factor \(C_g\)

For the **bunched/enclosed** arrangement used in the examples:

| Number of circuits | \(C_g\) |
|---:|---:|
| 1 | 1.00 |
| 2 | 0.80 |
| 3 | 0.70 |
| 4 | 0.65 |
| 5 | 0.60 |
| 6 | 0.57 |

The exact row must match the physical arrangement.

---

## Table 52.2 — Cable Surrounded by Thermal Insulation

For the applicable conditions:

| Length in insulation | Factor |
|---:|---:|
| 50 mm | 0.88 |
| 100 mm | 0.78 |
| 200 mm | 0.63 |
| 400 mm | 0.51 |

For longer surrounding insulation, the relevant BS 7671 rule must be checked rather than extending the short-length table by assumption.

---

## Table 4D5 — Flat 70 °C Thermoplastic Cable with Protective Conductor

Selected study values:

| CSA | Clipped-direct current capacity | Voltage drop |
|---:|---:|---:|
| 1.0 mm² | 16 A | 44 mV/A/m |
| 1.5 mm² | 20 A | 29 mV/A/m |
| 2.5 mm² | 27 A | 18 mV/A/m |
| 4 mm² | 37 A | 11 mV/A/m |
| 6 mm² | 47 A | 7.3 mV/A/m |
| 10 mm² | 64 A | 4.4 mV/A/m |
| 16 mm² | 85 A | 2.8 mV/A/m |

These values are to be used only where the cable type and installation method match the table.

---

## Table 4Ab — Conventional Voltage-Drop Limits

For the applicable public low-voltage distribution supply:

| Use | Percentage |
|---|---:|
| Lighting | 3% |
| Other uses | 5% |

For 230 V:

\[
3\%=6.9V
\]

\[
5\%=11.5V
\]

Always confirm that the table and supply arrangement actually apply to the installation being designed.

---

# Step 2 Distinction Checklist

Before leaving Step 2, you should be able to:

1. define design current and conductor current-carrying capacity using the official book terminology;
2. explain \(I_B\le I_N\le I_Z\) physically, not just quote it;
3. explain why correction factors force a larger tabulated cable rating;
4. identify exactly where \(C_a\), \(C_g\), \(C_i\) and \(mV/A/m\) values come from;
5. calculate required \(I_t\) without double-derating;
6. explain why a larger MCB is not a cure for nuisance tripping;
7. distinguish overload from short circuit;
8. give the formal RCD, RCBO and SPD meanings and distinguish their functions;
9. calculate voltage drop and explain what excessive voltage drop does to equipment;
10. complete a whole cable design from load to final checks and defend every design decision.

**End of Strengthened Step 2**
